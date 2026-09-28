// לימוד — כל קוד השרת בקובץ אחד. Node.js + Express + MongoDB.
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import crypto from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

// 1. הגדרות ומודלים
const ROOT = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const SECRET = process.env.JWT_SECRET;
// ברירת המחדל מיועדת להרצה מקומית עם MongoDB Community.
// בסביבת פרודקשן יש להגדיר MONGODB_URI מפורשות דרך משתני הסביבה.
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/limud_academy";
const ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
const production = process.env.NODE_ENV === "production";
const options = { timestamps: true };
const User = mongoose.model(
  "User",
  new mongoose.Schema(
    {
      name: String,
      email: { type: String, unique: true },
      passwordHash: { type: String, select: false },
      role: { type: String, enum: ["student", "admin"], default: "student" },
      isActive: { type: Boolean, default: true },
      tokenVersion: { type: Number, default: 0 },
      lastActiveAt: Date,
    },
    options,
  ),
);
const lessonSchema = new mongoose.Schema(
  {
    id: String,
    title: String,
    youtubeId: String,
    duration: Number,
    order: Number,
    active: { type: Boolean, default: true },
  },
  { _id: false },
);
const Course = mongoose.model(
  "Course",
  new mongoose.Schema(
    {
      id: { type: String, unique: true },
      title: String,
      description: String,
      mark: String,
      color: String,
      category: String,
      language: String,
      level: String,
      instructor: String,
      prerequisites: String,
      status: {
        type: String,
        enum: ["draft", "published", "archived"],
        default: "draft",
      },
      accessType: { type: String, enum: ["free", "paid"], default: "free" },
      priceMinor: { type: Number, default: 0 },
      sourceUrl: String,
      sourceTitle: String,
      playlistId: String,
      verifiedAt: String,
      lessons: [lessonSchema],
    },
    options,
  ),
);
const enrollmentSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    courseId: String,
    lastLessonId: String,
    completedAt: Date,
    lastAccessedAt: Date,
  },
  options,
);
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
const Enrollment = mongoose.model("Enrollment", enrollmentSchema);
const progressSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    courseId: String,
    lessonId: String,
    lastPosition: { type: Number, default: 0 },
    ranges: { type: [[Number]], default: [] },
    completedAt: Date,
    revision: { type: Number, default: 0 },
  },
  options,
);
progressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
const Progress = mongoose.model("Progress", progressSchema);
const ratingSchema = new mongoose.Schema(
  {
    userId: mongoose.Schema.Types.ObjectId,
    courseId: String,
    targetId: String,
    value: { type: Number, min: 1, max: 5 },
  },
  options,
);
ratingSchema.index({ userId: 1, targetId: 1 }, { unique: true });
const Rating = mongoose.model("Rating", ratingSchema);
const Topic = mongoose.model(
  "Topic",
  new mongoose.Schema(
    {
      id: { type: String, unique: true },
      name: String,
      description: String,
      courseId: String,
      archived: { type: Boolean, default: false },
    },
    options,
  ),
);
const Post = mongoose.model(
  "Post",
  new mongoose.Schema(
    {
      topicId: String,
      authorId: mongoose.Schema.Types.ObjectId,
      title: String,
      body: String,
      deleted: { type: Boolean, default: false },
      edited: { type: Boolean, default: false },
    },
    options,
  ),
);
const Reply = mongoose.model(
  "Reply",
  new mongoose.Schema(
    {
      postId: mongoose.Schema.Types.ObjectId,
      authorId: mongoose.Schema.Types.ObjectId,
      parentReplyId: { type: mongoose.Schema.Types.ObjectId, default: null },
      body: String,
      deleted: { type: Boolean, default: false },
      edited: { type: Boolean, default: false },
    },
    options,
  ),
);
// שרת אינו מקבל completed=true מהלקוח. הוא צובר מקטעים ומאמת את ההשלמה.
const watchSchema = new mongoose.Schema({
  key: { type: String, unique: true },
  userId: mongoose.Schema.Types.ObjectId,
  lessonId: String,
  lastPosition: Number,
  lastTick: Number,
  ended: { type: Boolean, default: false },
  expiresAt: { type: Date, index: { expires: 0 } },
});
const Watch = mongoose.model("Watch", watchSchema);

// 2. פונקציות עזר ו־middleware
function fail(status, message, code) {
  const e = new Error(message);
  e.status = status;
  e.code = code;
  throw e;
}
function clean(value, max = 3000) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}
function required(value, label, max) {
  const s = clean(value, max);
  if (!s) fail(400, `יש למלא ${label}`);
  return s;
}
function passwordCheck(p) {
  if (
    typeof p !== "string" ||
    p.length < 10 ||
    Buffer.byteLength(p, "utf8") > 72
  )
    fail(400, "הסיסמה צריכה להכיל לפחות 10 תווים ועד 72 בתים");
}
function objectId(id) {
  if (!mongoose.isValidObjectId(id)) fail(400, "מזהה לא תקין");
  return id;
}
function publicUser(u) {
  return {
    id: String(u._id),
    name: u.name,
    email: u.email,
    role: u.role,
    isActive: u.isActive,
  };
}
function cookieOptions() {
  return {
    httpOnly: true,
    secure: production,
    sameSite: "lax",
    path: "/",
    maxAge: 2 * 60 * 60 * 1000,
  };
}
function issue(res, u) {
  const token = jwt.sign({ sub: String(u._id), v: u.tokenVersion }, SECRET, {
    expiresIn: "2h",
    algorithm: "HS256",
    issuer: "limud",
    audience: "limud-web",
  });
  res.cookie("limud_session", token, cookieOptions());
}
const auth = async (req, res, next) => {
  try {
    const token = req.cookies.limud_session;
    if (!token) fail(401, "יש להתחבר כדי להמשיך");
    let p;
    try {
      p = jwt.verify(token, SECRET, {
        algorithms: ["HS256"],
        issuer: "limud",
        audience: "limud-web",
      });
    } catch {
      fail(401, "ההתחברות פגה. נא להתחבר מחדש");
    }
    const u = await User.findById(p.sub);
    if (!u?.isActive || u.tokenVersion !== p.v)
      fail(401, "ההתחברות אינה פעילה");
    req.user = u;
    await User.updateOne(
      { _id: u._id },
      { $set: { lastActiveAt: new Date() } },
    );
    next();
  } catch (e) {
    next(e);
  }
};
function admin(req, res, next) {
  if (req.user.role !== "admin")
    return next(Object.assign(new Error("אין הרשאת מנהל"), { status: 403 }));
  next();
}
function canEdit(req, author) {
  if (String(req.user._id) !== String(author))
    fail(403, "ניתן לערוך רק תוכן שכתבת");
}
async function access(req, courseId) {
  const c = await Course.findOne({ id: courseId });
  if (!c || (c.status !== "published" && req.user.role !== "admin"))
    fail(404, "הקורס אינו זמין");
  if (c.accessType === "paid" && req.user.role !== "admin")
    fail(403, "הקורס אינו פתוח להרשמה כעת");
  return c;
}
async function lessonAccess(req) {
  const c = await access(req, req.params.id),
    lessons = c.lessons.filter((l) => l.active !== false),
    index = lessons.findIndex((l) => l.id === req.params.lessonId);
  if (index < 0) fail(404, "השיעור אינו זמין");
  const done = await Progress.find({
    userId: req.user._id,
    courseId: c.id,
    completedAt: { $ne: null },
  }).lean();
  const completed = new Set(done.map((p) => p.lessonId));
  if (
    req.user.role !== "admin" &&
    lessons.slice(0, index).some((l) => !completed.has(l.id))
  )
    fail(403, "יש להשלים את השיעורים הקודמים", "LESSON_LOCKED");
  return { c, l: lessons[index] };
}
function mergeRanges(ranges) {
  const sorted = ranges.filter((r) => r[1] > r[0]).sort((a, b) => a[0] - b[0]),
    out = [];
  for (const r of sorted) {
    const last = out.at(-1);
    if (last && r[0] <= last[1] + 0.25) last[1] = Math.max(last[1], r[1]);
    else out.push([...r]);
  }
  return out;
}
function watched(ranges) {
  return ranges.reduce((s, r) => s + r[1] - r[0], 0);
}
function youtubeId(value) {
  try {
    const u = new URL(value);
    if (
      !["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(
        u.hostname,
      )
    )
      return null;
    const id =
      u.hostname === "youtu.be"
        ? u.pathname.slice(1)
        : u.searchParams.get("v") ||
          u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    return /^[\w-]{11}$/.test(id || "") ? id : null;
  } catch {
    return /^[\w-]{11}$/.test(value || "") ? value : null;
  }
}
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }),
);
app.use(cors({ origin: ORIGIN, credentials: true }));
app.use(express.json({ limit: "300kb" }));
app.use(cookieParser());
app.use(
  "/api",
  rateLimit({
    windowMs: 60000,
    limit: 240,
    standardHeaders: true,
    legacyHeaders: false,
  }),
);
// מחייבים Origin מאושר לכל שינוי: הגנת CSRF לממשק המבוסס Cookie.
app.use("/api", (req, res, next) => {
  if (
    !["GET", "HEAD", "OPTIONS"].includes(req.method) &&
    req.get("origin") !== ORIGIN
  )
    return res.status(403).json({ message: "מקור הבקשה אינו מורשה" });
  next();
});
const authLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
app.get("/api/health", (req, res) =>
  res.json({
    ok: true,
    database: mongoose.connection.readyState === 1,
    mode: "live",
  }),
);

// 3. הרשמה, כניסה ופרופיל
app.post("/api/auth/register", authLimit, async (req, res) => {
  const name = required(req.body.name, "שם", 60),
    email = required(req.body.email, "דוא״ל", 254).toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    fail(400, "כתובת דוא״ל אינה תקינה");
  passwordCheck(req.body.password);
  const u = await User.create({
    name,
    email,
    passwordHash: await bcrypt.hash(req.body.password, 12),
    role: "student",
  });
  issue(res, u);
  res.status(201).json(publicUser(u));
});
app.post("/api/auth/login", authLimit, async (req, res) => {
  const email = clean(req.body.email, 254).toLowerCase(),
    u = await User.findOne({ email }).select("+passwordHash");
  const valid =
    u &&
    typeof req.body.password === "string" &&
    (await bcrypt.compare(req.body.password, u.passwordHash));
  if (!valid || !u.isActive) fail(401, "פרטי ההתחברות אינם תקינים");
  issue(res, u);
  res.json(publicUser(u));
});
app.get("/api/auth/me", auth, (req, res) => res.json(publicUser(req.user)));
app.post("/api/auth/logout", auth, async (req, res) => {
  await User.updateOne({ _id: req.user._id }, { $inc: { tokenVersion: 1 } });
  res.clearCookie("limud_session", cookieOptions());
  res.json({ ok: true });
});
app.patch("/api/me", auth, async (req, res) => {
  req.user.name = required(req.body.name, "שם", 60);
  await req.user.save();
  res.json(publicUser(req.user));
});
app.post("/api/me/change-password", auth, async (req, res) => {
  const u = await User.findById(req.user._id).select("+passwordHash");
  if (
    !(await bcrypt.compare(
      String(req.body.currentPassword || ""),
      u.passwordHash,
    ))
  )
    fail(400, "הסיסמה הנוכחית אינה נכונה");
  passwordCheck(req.body.password);
  u.passwordHash = await bcrypt.hash(req.body.password, 12);
  u.tokenVersion++;
  await u.save();
  issue(res, u);
  res.json({ ok: true });
});

// 4. קורסים והתקדמות
app.get("/api/catalog", async (req, res) => {
  const courses = await Course.find({ status: "published" }).lean(),
    stats = await Rating.aggregate([
      {
        $group: {
          _id: "$targetId",
          average: { $avg: "$value" },
          count: { $sum: 1 },
        },
      },
    ]);
  res.json(
    courses.map((c) => ({
      ...c,
      rating: stats.find((s) => s._id === c.id) || null,
      lessons: c.lessons
        .filter((l) => l.active !== false)
        .map(({ youtubeId, ...l }) => l),
    })),
  );
});
app.get("/api/my-learning", auth, async (req, res) => {
  const [progress, enrollments, ratings] = await Promise.all([
    Progress.find({ userId: req.user._id }).lean(),
    Enrollment.find({ userId: req.user._id }).lean(),
    Rating.find({ userId: req.user._id }).lean(),
  ]);
  res.json({ progress, enrollments, ratings });
});
app.get("/api/courses/:id", auth, async (req, res) => {
  const c = await access(req, req.params.id);
  res.json({
    ...c.toObject(),
    lessons: c.lessons
      .filter((l) => l.active !== false)
      .map((l) => {
        const { youtubeId, ...rest } = l.toObject();
        return rest;
      }),
  });
});
app.post("/api/courses/:id/start", auth, async (req, res) => {
  await access(req, req.params.id);
  const e = await Enrollment.findOneAndUpdate(
    { userId: req.user._id, courseId: req.params.id },
    { $set: { lastAccessedAt: new Date() } },
    { upsert: true, returnDocument: "after" },
  );
  res.json(e);
});
app.get("/api/courses/:id/lessons/:lessonId", auth, async (req, res) => {
  const { l } = await lessonAccess(req);
  res.json(l);
});
app.post("/api/courses/:id/lessons/:lessonId/watch", auth, async (req, res) => {
  const { c, l } = await lessonAccess(req);
  const key = crypto.randomUUID();
  await Watch.create({
    key,
    userId: req.user._id,
    lessonId: l.id,
    lastTick: Date.now(),
    lastPosition: Number(req.body.position) || 0,
    expiresAt: new Date(Date.now() + 3 * 3600000),
  });
  await Enrollment.findOneAndUpdate(
    { userId: req.user._id, courseId: c.id },
    { $set: { lastLessonId: l.id, lastAccessedAt: new Date() } },
    { upsert: true },
  );
  res.json({ key });
});
app.put(
  "/api/courses/:id/lessons/:lessonId/progress",
  auth,
  async (req, res) => {
    const { c, l } = await lessonAccess(req),
      w = await Watch.findOne({
        key: req.body.key,
        userId: req.user._id,
        lessonId: l.id,
      });
    if (!w) fail(400, "יש לטעון מחדש את השיעור");
    const pos = Number(req.body.position),
      speed = Number(req.body.speed || 1),
      now = Date.now();
    if (
      !Number.isFinite(pos) ||
      pos < 0 ||
      pos > l.duration + 3 ||
      ![0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].includes(speed)
    )
      fail(400, "נתוני צפייה אינם תקינים");
    const elapsed = (now - w.lastTick) / 1000,
      delta = pos - w.lastPosition;
    let p = await Progress.findOneAndUpdate(
      { userId: req.user._id, courseId: c.id, lessonId: l.id },
      { $setOnInsert: { ranges: [] } },
      { upsert: true, returnDocument: "after" },
    );
    const segment =
      req.body.playing &&
      delta > 0 &&
      delta <= Math.min(elapsed, 20) * speed + 1.5
        ? [Math.max(0, w.lastPosition), Math.min(pos, l.duration)]
        : null;
    // עדכון אופטימי מונע אובדן מקטעים בין שתי לשוניות.
    for (let i = 0; i < 5; i++) {
      const ranges = segment ? mergeRanges([...p.ranges, segment]) : p.ranges;
      const updated = await Progress.findOneAndUpdate(
        { _id: p._id, revision: p.revision },
        {
          $set: { ranges, lastPosition: Math.min(pos, l.duration) },
          $inc: { revision: 1 },
        },
        { returnDocument: "after" },
      );
      if (updated) {
        p = updated;
        break;
      }
      p = await Progress.findById(p._id);
      if (i === 4) fail(409, "יש לנסות לשמור שוב");
    }
    w.lastTick = now;
    w.lastPosition = pos;
    if (req.body.ended && pos >= l.duration - 3) w.ended = true;
    await w.save();
    res.json(p);
  },
);
app.post(
  "/api/courses/:id/lessons/:lessonId/complete",
  auth,
  async (req, res) => {
    const { c, l } = await lessonAccess(req),
      p = await Progress.findOne({ userId: req.user._id, lessonId: l.id }),
      w = await Watch.findOne({
        key: req.body.key,
        userId: req.user._id,
        lessonId: l.id,
      });
    if (
      !p?.completedAt &&
      (!w?.ended || !l.duration || watched(p?.ranges || []) / l.duration < 0.95)
    )
      fail(409, "יש לצפות בלפחות 95% מהשיעור ולהגיע לסופו");
    if (!p.completedAt) {
      p.completedAt = new Date();
      await p.save();
    }
    const count = await Progress.countDocuments({
      userId: req.user._id,
      lessonId: {
        $in: c.lessons.filter((l) => l.active !== false).map((l) => l.id),
      },
      completedAt: { $ne: null },
    });
    if (count === c.lessons.filter((l) => l.active !== false).length)
      await Enrollment.updateOne(
        { userId: req.user._id, courseId: c.id },
        { $set: { completedAt: new Date() } },
      );
    res.json(p);
  },
);
app.put("/api/courses/:id/rating", auth, async (req, res) => {
  const c = await access(req, req.params.id),
    targetId = req.body.lessonId || c.id;
  const needed =
    targetId === c.id
      ? c.lessons.filter((l) => l.active !== false).map((l) => l.id)
      : [targetId];
  if (
    !needed.length ||
    !needed.every((id) => c.lessons.some((l) => l.id === id))
  )
    fail(400, "יעד דירוג לא תקין");
  const n = await Progress.countDocuments({
    userId: req.user._id,
    lessonId: { $in: needed },
    completedAt: { $ne: null },
  });
  if (n !== needed.length) fail(403, "ניתן לדרג רק לאחר השלמה");
  const value = Number(req.body.value);
  if (!Number.isInteger(value) || value < 1 || value > 5)
    fail(400, "הדירוג חייב להיות בין 1 ל־5");
  res.json(
    await Rating.findOneAndUpdate(
      { userId: req.user._id, targetId },
      { $set: { courseId: c.id, value } },
      { upsert: true, returnDocument: "after", runValidators: true },
    ),
  );
});

// 5. פורום — הודעות ותגובות מקוננות
async function authorNames(items) {
  const ids = [...new Set(items.map((x) => String(x.authorId)))],
    users = await User.find({ _id: { $in: ids } }).lean();
  return items.map((x) => ({
    ...x,
    id: String(x._id),
    author:
      users.find((u) => String(u._id) === String(x.authorId))?.name || "משתמש",
    authorRole:
      users.find((u) => String(u._id) === String(x.authorId))?.role ||
      "student",
  }));
}
app.get("/api/forum/topics", auth, async (req, res) => {
  const topics = await Topic.find({ archived: false }).lean(),
    counts = await Post.aggregate([
      { $match: { deleted: false } },
      { $group: { _id: "$topicId", count: { $sum: 1 } } },
    ]);
  res.json(
    topics.map((t) => ({
      ...t,
      count: counts.find((c) => c._id === t.id)?.count || 0,
    })),
  );
});
app.get("/api/forum/topics/:id/posts", auth, async (req, res) => {
  const t = await Topic.findOne({ id: req.params.id, archived: false });
  if (!t) fail(404, "הנושא אינו זמין");
  const posts = await Post.find({ topicId: t.id, deleted: false })
    .sort({ updatedAt: -1 })
    .limit(100)
    .lean();
  res.json(await authorNames(posts));
});
app.post("/api/forum/topics/:id/posts", auth, async (req, res) => {
  if (!(await Topic.exists({ id: req.params.id, archived: false })))
    fail(404, "הנושא אינו זמין");
  const p = await Post.create({
    topicId: req.params.id,
    authorId: req.user._id,
    title: required(req.body.title, "כותרת", 160),
    body: required(req.body.body, "תוכן", 5000),
  });
  res.status(201).json({ id: String(p._id) });
});
app.get("/api/forum/posts/:id", auth, async (req, res) => {
  const p = await Post.findById(objectId(req.params.id)).lean();
  if (
    !p ||
    p.deleted ||
    !(await Topic.exists({ id: p.topicId, archived: false }))
  )
    fail(404, "ההודעה אינה זמינה");
  const replies = await Reply.find({ postId: p._id })
    .sort({ createdAt: 1 })
    .limit(300)
    .lean();
  res.json({
    post: (await authorNames([p]))[0],
    replies: await authorNames(
      replies.map((r) => (r.deleted ? { ...r, body: "תגובה זו הוסרה" } : r)),
    ),
  });
});
app.post("/api/forum/posts/:id/replies", auth, async (req, res) => {
  const p = await Post.findById(objectId(req.params.id));
  if (
    !p ||
    p.deleted ||
    !(await Topic.exists({ id: p.topicId, archived: false }))
  )
    fail(404, "ההודעה אינה זמינה");
  const parent = req.body.parentReplyId;
  if (parent && !(await Reply.exists({ _id: objectId(parent), postId: p._id })))
    fail(400, "תגובה קודמת אינה שייכת לשרשור");
  const r = await Reply.create({
    postId: p._id,
    authorId: req.user._id,
    parentReplyId: parent || null,
    body: required(req.body.body, "תגובה", 5000),
  });
  p.updatedAt = new Date();
  await p.save();
  res.status(201).json(r);
});
for (const [kind, Model] of [
  ["posts", Post],
  ["replies", Reply],
]) {
  app.patch(`/api/forum/${kind}/:id`, auth, async (req, res) => {
    const item = await Model.findById(objectId(req.params.id));
    if (!item || item.deleted) fail(404, "התוכן אינו זמין");
    canEdit(req, item.authorId);
    item.body = required(req.body.body, "תוכן", 5000);
    if (kind === "posts") item.title = required(req.body.title, "כותרת", 160);
    item.edited = true;
    await item.save();
    res.json({ ok: true });
  });
  app.delete(`/api/forum/${kind}/:id`, auth, admin, async (req, res) => {
    await Model.updateOne(
      { _id: objectId(req.params.id) },
      { $set: { deleted: true, body: "" } },
    );
    res.json({ ok: true });
  });
}

// 6. ניהול קורסים, נושאים ומשתמשים
app.use("/api/admin", auth, admin);
app.get("/api/admin/courses", async (req, res) =>
  res.json(await Course.find().lean()),
);
app.post("/api/admin/courses", async (req, res) => {
  const c = await Course.create({
    id: crypto.randomUUID(),
    title: "קורס חדש",
    description: "",
    language: "עברית",
    level: "מתחילים",
    category: "תכנות",
    mark: "NEW",
    color: "#4574db",
    status: "draft",
    lessons: [],
  });
  res.status(201).json(c);
});
app.patch("/api/admin/courses/:id", async (req, res) => {
  const c = await Course.findOne({ id: req.params.id });
  if (!c) fail(404, "הקורס אינו קיים");
  for (const k of [
    "title",
    "description",
    "mark",
    "color",
    "category",
    "language",
    "level",
    "instructor",
    "prerequisites",
    "sourceUrl",
  ])
    if (req.body[k] !== undefined)
      c[k] = clean(req.body[k], k === "description" ? 3000 : 300);
  if (req.body.status) c.status = req.body.status;
  if (req.body.lessons) {
    if (!Array.isArray(req.body.lessons) || req.body.lessons.length > 200)
      fail(400, "רשימת שיעורים אינה תקינה");
    const ids = new Set();
    c.lessons = req.body.lessons.map((l, i) => {
      const vid = youtubeId(l.youtubeId || l.url),
        duration = Number(l.duration);
      if (
        !vid ||
        !clean(l.title) ||
        !Number.isFinite(duration) ||
        duration <= 0 ||
        duration > 86400
      )
        fail(400, `יש לתקן כותרת, קישור ומשך בשיעור ${i + 1}`);
      const old = c.lessons.find((x) => x.id === l.id);
      const id = old && old.youtubeId === vid ? old.id : crypto.randomUUID();
      if (ids.has(id)) fail(400, "שיעור כפול");
      ids.add(id);
      return {
        id,
        title: clean(l.title, 250),
        youtubeId: vid,
        duration,
        active: l.active !== false,
        order: i,
      };
    });
  }
  if (
    c.status === "published" &&
    (!c.title ||
      !c.description ||
      !c.language ||
      !c.lessons.some((l) => l.active !== false))
  )
    fail(400, "פרסום דורש שם, תיאור, שפה ושיעור תקין אחד לפחות");
  await c.save();
  await Topic.findOneAndUpdate(
    { courseId: c.id },
    {
      $set: { name: c.title },
      $setOnInsert: {
        id: "course-" + c.id,
        description: "שאלות ודיונים על הקורס",
      },
    },
    { upsert: true },
  );
  res.json(c);
});
app.delete("/api/admin/courses/:id", async (req, res) => {
  await Course.updateOne(
    { id: req.params.id },
    { $set: { status: "archived" } },
  );
  res.json({ ok: true });
});
app.get("/api/admin/topics", async (req, res) =>
  res.json(await Topic.find().lean()),
);
app.post("/api/admin/topics", async (req, res) =>
  res.status(201).json(
    await Topic.create({
      id: crypto.randomUUID(),
      name: required(req.body.name, "שם נושא", 100),
      description: clean(req.body.description, 300),
    }),
  ),
);
app.patch("/api/admin/topics/:id", async (req, res) => {
  const t = await Topic.findOne({ id: req.params.id });
  if (!t) fail(404, "נושא לא קיים");
  if (req.body.name) t.name = required(req.body.name, "שם", 100);
  if (req.body.description !== undefined)
    t.description = clean(req.body.description, 300);
  if (typeof req.body.archived === "boolean" && t.id !== "general")
    t.archived = req.body.archived;
  await t.save();
  res.json(t);
});
app.delete("/api/admin/topics/:id", async (req, res) => {
  if (req.params.id === "general") fail(400, "לא ניתן למחוק את הנושא הכללי");
  await Topic.updateOne({ id: req.params.id }, { $set: { archived: true } });
  res.json({ ok: true });
});
app.get("/api/admin/users", async (req, res) => {
  const users = await User.find().sort({ createdAt: -1 }).lean();
  res.json(
    users.map((u) => ({
      ...publicUser(u),
      createdAt: u.createdAt,
      lastActiveAt: u.lastActiveAt,
    })),
  );
});
app.get("/api/admin/users/:id", async (req, res) =>
  res.json({
    progress: await Progress.find({ userId: objectId(req.params.id) }).lean(),
    enrollments: await Enrollment.find({ userId: req.params.id }).lean(),
  }),
);
app.patch("/api/admin/users/:id", async (req, res) => {
  if (String(req.user._id) === req.params.id)
    fail(400, "לא ניתן לחסום את עצמך");
  if (typeof req.body.isActive !== "boolean") fail(400, "מצב לא תקין");
  await User.updateOne(
    { _id: objectId(req.params.id), role: "student" },
    { $set: { isActive: req.body.isActive }, $inc: { tokenVersion: 1 } },
  );
  res.json({ ok: true });
});
app.get("/api/admin/dashboard", async (req, res) => {
  const [
    users,
    courses,
    lessons,
    enrollments,
    completed,
    posts,
    byCourse,
    recent,
  ] = await Promise.all([
    User.countDocuments({ role: "student" }),
    Course.countDocuments({ status: "published" }),
    Course.aggregate([{ $unwind: "$lessons" }, { $count: "count" }]),
    Enrollment.countDocuments(),
    Enrollment.countDocuments({ completedAt: { $ne: null } }),
    Post.countDocuments({ deleted: false }),
    Enrollment.aggregate([
      {
        $group: {
          _id: "$courseId",
          started: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $ifNull: ["$completedAt", false] }, 1, 0] },
          },
        },
      },
    ]),
    User.find({ role: "student" }).sort({ createdAt: -1 }).limit(5).lean(),
  ]);
  res.json({
    users,
    courses,
    lessons: lessons[0]?.count || 0,
    enrollments,
    completed,
    posts,
    byCourse,
    recent: recent.map((u) => ({ ...publicUser(u), createdAt: u.createdAt })),
  });
});

// 7. שרת קבצים, שגיאות ואתחול מפורש
app.use("/api", (req, res) =>
  res.status(404).json({ message: "הפעולה אינה קיימת" }),
);
// קובץ התוכן המלא משמש את האתחול וההדגמה בלבד, ואינו מוגש בשרת האמיתי.
app.get("/catalog.json", (req, res) => res.sendStatus(404));
app.use(express.static(path.join(ROOT, "dist")));
app.get("/{*path}", (req, res) =>
  res.sendFile(path.join(ROOT, "dist", "index.html")),
);
app.use((e, req, res, next) => {
  if (e.code === 11000)
    return res
      .status(409)
      .json({ message: "הרשומה כבר קיימת. ייתכן שכתובת הדוא״ל כבר רשומה" });
  const status =
    e.status ||
    (e.name === "ValidationError" || e.name === "CastError" ? 400 : 500);
  if (status === 500) console.error(e.name, e.message);
  res.status(status).json({
    message: status === 500 ? "אירעה תקלה בשרת. נסו שוב מאוחר יותר" : e.message,
    code: e.code,
  });
});
async function seed() {
  const data = JSON.parse(
    fs.readFileSync(path.join(ROOT, "data/catalog.json"), "utf8"),
  );
  for (const c of data) {
    await Course.updateOne({ id: c.id }, { $setOnInsert: c }, { upsert: true });
    await Topic.updateOne(
      { id: "course-" + c.id },
      {
        $setOnInsert: {
          id: "course-" + c.id,
          courseId: c.id,
          name: c.title,
          description: "שאלות, תשובות ולמידה משותפת",
        },
      },
      { upsert: true },
    );
  }
  await Topic.updateOne(
    { id: "general" },
    {
      $setOnInsert: {
        id: "general",
        name: "כללי",
        description: "מקום להכיר, להתייעץ ולשתף",
      },
    },
    { upsert: true },
  );
  if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD) {
    passwordCheck(process.env.ADMIN_PASSWORD);
    await User.updateOne(
      { email: process.env.ADMIN_EMAIL.toLowerCase() },
      {
        $setOnInsert: {
          name: process.env.ADMIN_NAME || "מנהל האתר",
          email: process.env.ADMIN_EMAIL.toLowerCase(),
          passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12),
          role: "admin",
        },
      },
      { upsert: true },
    );
  }
  console.log("הקורסים והנושאים אותחלו. רשומות קיימות לא נדרסו.");
}
if (!SECRET || SECRET.length < 32)
  throw new Error("יש להגדיר JWT_SECRET אקראי באורך 32 תווים לפחות");
await mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 10000,
});
if (process.argv.includes("--seed")) {
  await seed();
  await mongoose.disconnect();
} else
  app.listen(Number(process.env.PORT) || 4000, () =>
    console.log("Limud API is ready"),
  );
