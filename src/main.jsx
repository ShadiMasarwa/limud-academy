import React, {
  useState,
  useEffect,
  useRef,
  createContext,
  useContext,
} from "react";
import { createRoot } from "react-dom/client";
import {
  BrowserRouter,
  Routes,
  Route,
  Link,
  useNavigate,
  useLocation,
  useParams,
  Navigate,
} from "react-router-dom";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  BookOpen,
  GraduationCap,
  Search,
  Play,
  Check,
  CheckCircle2,
  Lock,
  Clock,
  Globe,
  ChevronLeft,
  ChevronDown,
  LayoutGrid,
  List,
  MessageCircle,
  Users,
  LogOut,
  Settings,
  LayoutDashboard,
  Plus,
  Trash2,
  Pencil,
  X,
  Star,
  Menu,
  Code2,
  Terminal,
  Database,
  Workflow,
  BarChart3,
  LoaderCircle,
  ExternalLink,
  Mail,
  Eye,
  EyeOff,
  ShieldCheck,
  Send,
  AlertCircle,
  RefreshCw,
  Heart,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import "bootstrap/dist/css/bootstrap.rtl.min.css";

// 1. עיצוב משותף — כל קוד הממשק והעיצוב נמצא בקובץ זה.
const css = `
@import url("https://fonts.googleapis.com/css2?family=Heebo:wght@400;500;600;700;800;900&display=swap");
:root {
  --ink: #162722;
  --muted: #71807a;
  --green: #1b5546;
  --lime: #d8eeab;
  --paper: #f5f7f5;
  --line: #e3e9e5;
  --bs-body-font-family: "Heebo", Arial, sans-serif;
  --bs-body-color: var(--ink);
  --bs-primary: #1b5546;
}
* {
  box-sizing: border-box;
}
body {
  margin: 0;
  background: var(--paper);
  font-family: "Heebo", Arial, sans-serif;
  font-size: 16px;
  color: var(--ink);
}
a {
  color: inherit;
  text-decoration: none;
}
button,
input,
select,
textarea {
  font: inherit;
}
button,
a,
input,
select,
textarea {
  outline-offset: 4px;
}
button:focus-visible,
a:focus-visible {
  outline: 3px solid #659f8d;
}
.container-xl {
  max-width: 1240px;
}
.muted {
  color: var(--muted);
}
.small-text {
  font-size: 14px;
}
.kicker {
  font-size: 13px;
  font-weight: 700;
  letter-spacing: 1.5px;
  color: var(--green);
}
.btn {
  border-radius: 9px;
  padding: 11px 20px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.btn-primary {
  background: var(--green);
  border-color: var(--green);
}
.btn-primary:hover,
.btn-primary:focus {
  background: #123f34;
  border-color: #123f34;
}
.btn-light {
  background: white;
  border-color: var(--line);
}
.btn-outline-primary {
  border-color: var(--green);
  color: var(--green);
}
.btn-outline-primary:hover {
  background: var(--green);
  border-color: var(--green);
}
.btn-lime {
  background: var(--lime);
  border: 1px solid var(--lime);
  color: #183b2f;
}
.btn-lime:hover {
  background: #c8e18f;
}
.btn-sm {
  padding: 7px 12px;
  font-size: 14px;
}
.icon-btn {
  border: 0;
  background: transparent;
  padding: 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  color: inherit;
}
.icon-btn:hover {
  background: #edf2ef;
}
.form-control,
.form-select {
  border-color: #dce4df;
  border-radius: 9px;
  padding: 12px 14px;
  background: #fff;
}
.form-control:focus,
.form-select:focus {
  border-color: #83aa9b;
  box-shadow: 0 0 0 3px #1b554614;
}
.form-label {
  font-size: 14px;
  font-weight: 600;
}
.app-header {
  height: 84px;
  border-bottom: 1px solid var(--line);
  background: #fff;
  position: relative;
  z-index: 20;
}
.header-inner {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 25px;
}
.brand {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 29px;
  font-weight: 900;
  letter-spacing: -1.5px;
  white-space: nowrap;
}
.brand-symbol {
  height: 39px;
  width: 39px;
  background: var(--green);
  color: #e3f1be;
  border-radius: 10px;
  display: grid;
  place-items: center;
}
.brand small {
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.7px;
  display: block;
  margin-top: -9px;
  color: var(--muted);
}
.header-nav {
  display: flex;
  align-items: center;
  gap: 29px;
  height: 100%;
  margin-inline-end: auto;
  margin-inline-start: 34px;
}
.header-nav a {
  height: 100%;
  display: flex;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  position: relative;
  color: #65716b;
}
.header-nav a.active {
  color: var(--green);
  font-weight: 700;
}
.header-nav a.active:after {
  content: "";
  height: 3px;
  background: var(--green);
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 14px;
}
.avatar {
  height: 36px;
  width: 36px;
  border-radius: 50%;
  background: #e3ede7;
  color: #305345;
  display: inline-grid;
  place-items: center;
  font-weight: 700;
  flex-shrink: 0;
}
.hero {
  background: #eaf0e9;
  padding: 58px 0 48px;
  overflow: hidden;
}
.hero-inner {
  display: grid;
  grid-template-columns: 1.2fr 1fr;
  align-items: center;
  gap: 75px;
}
.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #38604e;
  background: #dae8d9;
  border: 1px solid #cbdcc8;
  border-radius: 30px;
  font-size: 13px;
  padding: 6px 12px;
  font-weight: 500;
}
.hero h1 {
  font-size: clamp(38px, 4vw, 56px);
  font-weight: 800;
  line-height: 1.18;
  letter-spacing: -1.8px;
  margin: 19px 0;
}
.hero h1 span {
  color: #467b56;
}
.hero p {
  color: #62716a;
  font-size: 17px;
  line-height: 1.85;
  max-width: 470px;
}
.hero-actions {
  display: flex;
  gap: 12px;
  margin-top: 25px;
}
.hero-meta {
  display: flex;
  gap: 23px;
  align-items: center;
  margin-top: 25px;
  color: #6a7a6f;
  font-size: 13px;
}
.hero-meta span {
  display: flex;
  align-items: center;
  gap: 6px;
}
.feature-card {
  background: #172e27;
  border-radius: 19px;
  padding: 25px;
  color: #fff;
  position: relative;
  box-shadow: 0 15px 35px #123e2912;
  transform: rotate(-2deg);
}
.feature-card > * {
  transform: rotate(2deg);
}
.feature-head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #9bb4a7;
}
.code-window {
  direction: ltr;
  text-align: left;
  font-family: monospace;
  background: #11241e;
  border: 1px solid #324d3f;
  border-radius: 12px;
  padding: 23px 20px;
  margin: 20px 0;
  color: #cddbd2;
  font-size: 14px;
  line-height: 2;
}
.code-window .comment {
  color: #739586;
}
.code-window .keyword {
  color: #bedda1;
}
.code-window .string {
  color: #e7c18b;
}
.feature-title {
  font-weight: 700;
  font-size: 21px;
  margin-bottom: 7px;
}
.feature-caption {
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #b7c8bd;
  font-size: 13px;
}
.round-play {
  height: 45px;
  width: 45px;
  border-radius: 50%;
  background: var(--lime);
  color: #213b2d;
  display: grid;
  place-items: center;
  border: 0;
}
.trust-strip {
  background: #fff;
  border-bottom: 1px solid var(--line);
}
.trust-inner {
  padding: 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  font-size: 14px;
  color: #6d7872;
}
.trust-inner span {
  display: flex;
  align-items: center;
  gap: 9px;
}
.trust-inner svg {
  color: #648b73;
}
.catalog-section {
  padding: 42px 0 60px;
}
.section-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 23px;
}
.section-heading h2 {
  font-size: 28px;
  font-weight: 800;
  letter-spacing: -0.7px;
  margin: 0 0 7px;
}
.section-heading p {
  font-size: 14px;
  color: var(--muted);
  margin: 0;
}
.search-box {
  position: relative;
  width: 295px;
}
.search-box input {
  padding-inline-start: 42px;
  background: white;
  font-size: 14px;
}
.search-box svg {
  position: absolute;
  inset-inline-start: 14px;
  top: 14px;
  color: #8b9790;
}
.filter-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px;
  margin-bottom: 23px;
}
.chips {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.chip {
  border: 1px solid #e0e6e1;
  border-radius: 8px;
  background: white;
  color: #6b7770;
  padding: 8px 16px;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 7px;
}
.chip.active {
  background: var(--green);
  border-color: var(--green);
  color: white;
}
.chip-count {
  font-size: 11px;
  opacity: 0.65;
}
.filter-select {
  border: 0;
  background: transparent;
  color: #6f7a74;
  font-size: 13px;
  max-width: 130px;
  padding: 8px;
}
.course-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 23px;
}
.course-card {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 13px;
  overflow: hidden;
  transition:
    transform 0.2s,
    box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}
.course-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 28px #1a37200b;
}
.course-cover {
  height: 168px;
  position: relative;
  padding: 17px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--course-color) 9%, white);
  overflow: hidden;
  border-bottom: 1px solid color-mix(in srgb, var(--course-color) 12%, white);
}
.cover-mark {
  font-size: 59px;
  font-weight: 800;
  letter-spacing: -3px;
  color: var(--course-color);
  direction: ltr;
  line-height: 1;
}
.cover-code {
  position: absolute;
  inset-inline-start: 18px;
  bottom: 14px;
  color: var(--course-color);
  opacity: 0.5;
  direction: ltr;
  font-family: monospace;
  font-size: 12px;
}
.cover-label {
  position: absolute;
  top: 14px;
  inset-inline-end: 14px;
  background: #ffffffc9;
  border: 1px solid #ffffffb0;
  border-radius: 6px;
  padding: 3px 8px;
  font-size: 11px;
  color: #65706c;
  display: flex;
  align-items: center;
  gap: 4px;
}
.cover-free {
  position: absolute;
  inset-inline-start: 14px;
  top: 14px;
  background: #fff9;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 11px;
  color: #506759;
}
.course-body {
  padding: 21px 21px 16px;
  flex: 1;
  display: flex;
  flex-direction: column;
}
.course-category {
  font-size: 11px;
  color: #72907a;
  font-weight: 600;
  margin-bottom: 7px;
}
.course-body h3 {
  font-size: 20px;
  line-height: 1.4;
  letter-spacing: -0.4px;
  font-weight: 700;
  margin: 0 0 7px;
}
.course-body p {
  font-size: 14px;
  color: #77817b;
  line-height: 1.7;
  min-height: 48px;
  margin-bottom: 15px;
}
.course-meta {
  display: flex;
  gap: 16px;
  color: #8b948f;
  font-size: 12px;
  margin-top: auto;
  padding-bottom: 17px;
}
.course-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}
.course-bottom {
  border-top: 1px solid #edf0ee;
  padding-top: 15px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  font-size: 13px;
}
.course-bottom .instructor {
  font-size: 12px;
  color: #7b8680;
  max-width: 65%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.course-bottom .open-course {
  color: var(--green);
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 4px;
}
.progress-track {
  height: 5px;
  background: #eaf0eb;
  border-radius: 9px;
  overflow: hidden;
  margin-top: 9px;
}
.progress-fill {
  height: 100%;
  background: #528766;
  transition: width 0.3s;
}
.progress-caption {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: #718276;
  margin-top: 5px;
}
.empty {
  background: #fff;
  border: 1px dashed #cbd8d0;
  border-radius: 15px;
  text-align: center;
  padding: 45px 20px;
  color: #7c8981;
}
.empty h3 {
  font-size: 20px;
  margin-top: 16px;
  color: var(--ink);
}
.footer {
  border-top: 1px solid var(--line);
  padding: 28px 0;
  background: white;
}
.footer-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
}
.footer p {
  font-size: 12px;
  color: #8a958e;
  margin: 0;
}
.footer-links {
  display: flex;
  gap: 23px;
  color: #7b867f;
  font-size: 13px;
}
.page {
  padding: 38px 0 65px;
  min-height: 70vh;
}
.page-title {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.8px;
}
.breadcrumb-row {
  display: flex;
  gap: 8px;
  align-items: center;
  font-size: 13px;
  color: #839087;
  margin-bottom: 25px;
}
.panel {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 13px;
  padding: 25px;
}
.badge-soft {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border-radius: 6px;
  background: #edf3ed;
  color: #57715f;
  padding: 4px 8px;
  font-size: 12px;
}
.banner {
  background: #e7eee7;
  border-radius: 14px;
  padding: 28px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 25px;
  margin: 24px 0;
}
.banner h3 {
  font-size: 22px;
  font-weight: 700;
}
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin: 25px 0;
}
.stat {
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 20px;
}
.stat strong {
  display: block;
  font-size: 30px;
  margin-top: 12px;
  font-weight: 800;
}
.stat span {
  font-size: 13px;
  color: #7f8a83;
}
.auth-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 700px;
  background: white;
}
.auth-story {
  background: #193e31;
  color: #fff;
  padding: 70px max(40px, 10%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.auth-story h2 {
  font-size: 44px;
  font-weight: 800;
  line-height: 1.3;
  letter-spacing: -1px;
}
.auth-story p {
  font-size: 17px;
  line-height: 1.9;
  color: #aec5b6;
}
.auth-benefit {
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 23px;
  color: #d2e3d7;
}
.auth-form-wrap {
  padding: 55px max(35px, 13%);
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.auth-form-wrap h1 {
  font-size: 30px;
  font-weight: 800;
}
.password-wrap {
  position: relative;
}
.password-wrap input {
  padding-inline-end: 44px;
}
.password-wrap button {
  position: absolute;
  inset-inline-end: 8px;
  top: 7px;
}
.error-box {
  background: #fff0ef;
  color: #9b443f;
  border: 1px solid #f1d6d3;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 14px;
}
.notice {
  background: #f3f6f1;
  border: 1px solid #e2e9dc;
  border-radius: 9px;
  padding: 13px 16px;
  font-size: 13px;
  line-height: 1.8;
  color: #687565;
}
.course-intro {
  display: grid;
  grid-template-columns: 1fr 290px;
  gap: 35px;
  align-items: center;
  margin-bottom: 30px;
}
.course-intro .course-cover {
  height: 215px;
  border-radius: 15px;
}
.course-intro h1 {
  font-size: 35px;
  font-weight: 800;
}
.course-intro p {
  color: #78837c;
  line-height: 1.8;
}
.lesson-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;
}
.lesson-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 11px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.lesson-card.locked {
  background: #f1f4f1;
  color: #919b94;
}
.lesson-number {
  font-size: 12px;
  font-weight: 600;
  color: #84948a;
}
.lesson-card h3 {
  font-size: 16px;
  line-height: 1.6;
  margin: 0;
  min-height: 51px;
}
.lesson-top {
  display: flex;
  justify-content: space-between;
}
.lesson-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 12px;
  color: #8a948d;
  margin-top: auto;
}
.watch-layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 315px;
  gap: 25px;
  align-items: start;
}
.player-frame {
  aspect-ratio: 16/9;
  background: #11251d;
  border-radius: 13px;
  overflow: hidden;
  min-height: 210px;
}
.player-frame iframe {
  width: 100%;
  height: 100%;
}
.player-frame > div {
  height: 100%;
}
.watch-title {
  font-size: 24px;
  font-weight: 700;
  margin: 23px 0 12px;
}
.playlist {
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
  overflow: hidden;
}
.playlist h3 {
  padding: 20px;
  font-size: 17px;
  border-bottom: 1px solid var(--line);
  margin: 0;
}
.playlist-list {
  max-height: 650px;
  overflow: auto;
}
.playlist-item {
  padding: 15px 18px;
  border-bottom: 1px solid #edf1ed;
  display: flex;
  align-items: start;
  gap: 10px;
  font-size: 13px;
}
.playlist-item.active {
  background: #e8f0e7;
  color: #23563d;
}
.playlist-item.disabled {
  color: #adb5ae;
}
.playlist-item .num {
  width: 25px;
  flex-shrink: 0;
  font-size: 12px;
}
.stars {
  display: flex;
  gap: 7px;
  direction: ltr;
  justify-content: center;
}
.stars button {
  border: 0;
  background: none;
  padding: 5px;
  color: #d0d9d0;
}
.stars button.on {
  color: #d4a747;
}
.rating-box {
  text-align: center;
  margin-top: 20px;
}
.rating-box h3 {
  font-size: 20px;
}
.forum-layout {
  display: grid;
  grid-template-columns: 240px minmax(0, 1fr);
  gap: 25px;
}
.topic-nav {
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 10px;
  align-self: start;
}
.topic-nav a {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 11px 12px;
  border-radius: 7px;
  font-size: 13px;
  color: #758178;
  gap: 8px;
}
.topic-nav a.active {
  background: #eaf1e8;
  color: #24563d;
  font-weight: 600;
}
.forum-card {
  background: white;
  border: 1px solid var(--line);
  border-radius: 12px;
  padding: 24px;
  display: block;
  margin-bottom: 14px;
}
.forum-card:hover {
  border-color: #b5cbb9;
}
.forum-card h3 {
  font-size: 19px;
  margin: 10px 0;
  font-weight: 700;
}
.forum-card p {
  font-size: 14px;
  color: #7e8882;
  white-space: pre-wrap;
  line-height: 1.8;
}
.post-meta {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 12px;
  color: #8b948e;
}
.post-body {
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  line-height: 1.9;
  font-size: 15px;
}
.reply {
  margin-top: 14px;
  padding: 18px;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: 10px;
}
.reply.indented {
  margin-inline-start: 25px;
  border-inline-start: 3px solid #c6dacb;
}
.admin-layout {
  display: grid;
  grid-template-columns: 210px minmax(0, 1fr);
  gap: 27px;
}
.admin-nav {
  background: #193e31;
  border-radius: 13px;
  color: #bfd3c5;
  padding: 16px;
  align-self: start;
}
.admin-nav .nav-label {
  font-size: 11px;
  padding: 10px;
  color: #8cab97;
}
.admin-nav a {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  margin-bottom: 5px;
}
.admin-nav a.active {
  background: #315441;
  color: #fff;
}
.admin-nav a:hover {
  background: #294c3b;
}
.table {
  font-size: 14px;
  --bs-table-bg: transparent;
  vertical-align: middle;
}
.table th {
  font-size: 12px;
  color: #809084;
  font-weight: 500;
  background: #f7f9f6;
  padding: 13px;
}
.table td {
  padding: 15px 12px;
  border-color: #edf1ec;
}
.table-responsive {
  border: 1px solid var(--line);
  border-radius: 12px;
  background: white;
}
.chart-row {
  display: grid;
  grid-template-columns: 135px 1fr 35px;
  gap: 15px;
  align-items: center;
  font-size: 13px;
  margin: 18px 0;
}
.bar-track {
  height: 12px;
  background: #edf2ec;
  border-radius: 4px;
  overflow: hidden;
}
.bar-fill {
  height: 100%;
  background: #88ab8b;
  border-radius: 4px;
}
.editor-lesson {
  border: 1px solid var(--line);
  border-radius: 10px;
  padding: 17px;
  margin-top: 12px;
  background: #fafbf9;
}
.toast-message {
  position: fixed;
  bottom: 25px;
  left: 50%;
  transform: translateX(-50%);
  padding: 13px 23px;
  border-radius: 11px;
  background: #173d2d;
  color: white;
  box-shadow: 0 8px 30px #0002;
  z-index: 1000;
  max-width: 90vw;
}
.loading {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 240px;
  gap: 10px;
  color: #668572;
}
.spin {
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
.mobile-menu {
  display: none;
}
.pagination-note {
  text-align: center;
  font-size: 12px;
  color: #98a299;
  margin-top: 30px;
}
.source-link {
  font-size: 13px;
  color: #6b8874;
  display: inline-flex;
  gap: 5px;
  align-items: center;
}
.status-pill {
  font-size: 12px;
  padding: 4px 9px;
  border-radius: 20px;
  background: #eaf1e8;
  color: #46754d;
}
.status-pill.draft {
  background: #fff3da;
  color: #94763c;
}
.table-title {
  font-weight: 600;
}
.help-list {
  line-height: 2;
  font-size: 14px;
  color: #708275;
}
.skip-link {
  position: absolute;
  top: -60px;
  right: 15px;
  background: white;
  padding: 12px;
  z-index: 100;
}
.skip-link:focus {
  top: 10px;
}
.success-icon {
  color: #5b8c63;
}
.edit-tools {
  display: flex;
  gap: 4px;
  align-items: center;
}
.inline-editor {
  margin-top: 14px;
}
.hero-rating {
  border-top: 1px solid #43614c;
  margin-top: 20px;
  padding-top: 16px;
  font-size: 12px;
  color: #bbd3bc;
  display: flex;
  align-items: center;
  gap: 9px;
}
.user-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
}
.modal-surface {
  position: fixed;
  inset: 0;
  background: #10261cc0;
  z-index: 200;
  display: grid;
  place-items: center;
  padding: 20px;
}
.modal-card {
  background: white;
  max-width: 520px;
  width: 100%;
  padding: 28px;
  border-radius: 16px;
  max-height: 85vh;
  overflow: auto;
}
.dialog-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
}
.dialog-head h3 {
  font-size: 22px;
  font-weight: 700;
  margin: 0;
}
@media (max-width: 991px) {
  .header-nav {
    gap: 18px;
    margin-inline-start: 10px;
  }
  .hero-inner {
    gap: 30px;
  }
  .hero h1 {
    font-size: 43px;
  }
  .course-grid {
    gap: 16px;
  }
  .course-body {
    padding: 17px;
  }
  .course-body h3 {
    font-size: 18px;
  }
  .watch-layout {
    grid-template-columns: 1fr;
  }
  .playlist-list {
    max-height: 330px;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .auth-form-wrap {
    padding: 40px 30px;
  }
  .auth-story {
    padding: 40px 30px;
  }
  .auth-story h2 {
    font-size: 35px;
  }
  .lesson-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 767px) {
  .container-xl {
    padding-right: 20px;
    padding-left: 20px;
  }
  .app-header {
    height: 72px;
  }
  .header-nav {
    display: none;
    position: absolute;
    top: 72px;
    right: 0;
    left: 0;
    background: white;
    height: auto;
    margin: 0;
    padding: 15px 20px;
    box-shadow: 0 10px 15px #0001;
  }
  .header-nav.show {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 0;
  }
  .header-nav a {
    padding: 12px;
    height: auto;
  }
  .header-nav a.active:after {
    display: none;
  }
  .mobile-menu {
    display: inline-flex;
  }
  .header-actions {
    gap: 5px;
  }
  .header-actions > .login-link,
  .user-link span:not(.avatar) {
    display: none;
  }
  .header-actions .btn {
    padding: 8px 11px;
    font-size: 12px;
  }
  .brand {
    font-size: 25px;
  }
  .brand-symbol {
    width: 33px;
    height: 33px;
  }
  .hero {
    padding: 35px 0;
  }
  .hero-inner {
    grid-template-columns: 1fr;
    gap: 28px;
  }
  .hero h1 {
    font-size: 39px;
  }
  .hero p {
    font-size: 15px;
  }
  .feature-card {
    display: none;
  }
  .hero-meta {
    gap: 14px;
    font-size: 12px;
  }
  .trust-inner {
    flex-wrap: wrap;
    gap: 10px;
    font-size: 12px;
    padding: 15px 0;
  }
  .trust-inner span:last-child {
    display: none;
  }
  .catalog-section {
    padding-top: 29px;
  }
  .section-heading {
    align-items: stretch;
    flex-direction: column;
    gap: 14px;
  }
  .section-heading h2 {
    font-size: 25px;
  }
  .search-box {
    width: 100%;
  }
  .filter-row {
    align-items: start;
    flex-direction: column;
    gap: 6px;
  }
  .chips {
    gap: 6px;
  }
  .chip {
    font-size: 12px;
    padding: 7px 12px;
  }
  .course-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }
  .course-cover {
    height: 125px;
  }
  .cover-mark {
    font-size: 42px;
  }
  .cover-code {
    display: none;
  }
  .course-body {
    padding: 14px;
  }
  .course-body h3 {
    font-size: 17px;
  }
  .course-body p {
    font-size: 12px;
    min-height: 62px;
  }
  .course-meta {
    gap: 8px;
    flex-wrap: wrap;
    font-size: 11px;
  }
  .course-bottom {
    flex-wrap: wrap;
    gap: 8px;
  }
  .course-bottom .instructor {
    max-width: 100%;
    font-size: 11px;
  }
  .course-bottom .open-course {
    font-size: 12px;
  }
  .cover-label,
  .cover-free {
    font-size: 10px;
    padding: 2px 6px;
    top: 8px;
  }
  .cover-label {
    inset-inline-end: 8px;
  }
  .cover-free {
    inset-inline-start: 8px;
  }
  .footer-inner {
    flex-direction: column;
    align-items: start;
  }
  .footer-links {
    font-size: 12px;
  }
  .auth-layout {
    grid-template-columns: 1fr;
    min-height: 0;
  }
  .auth-story {
    display: none;
  }
  .auth-form-wrap {
    padding: 40px 25px;
  }
  .page {
    padding-top: 25px;
  }
  .page-title {
    font-size: 27px;
  }
  .course-intro {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .course-intro .course-cover {
    display: none;
  }
  .course-intro h1 {
    font-size: 28px;
  }
  .lesson-grid {
    grid-template-columns: 1fr;
  }
  .forum-layout,
  .admin-layout {
    grid-template-columns: 1fr;
  }
  .topic-nav {
    display: flex;
    overflow: auto;
    gap: 4px;
  }
  .topic-nav a {
    white-space: nowrap;
    min-width: 120px;
  }
  .admin-nav {
    display: flex;
    overflow: auto;
    gap: 4px;
    padding: 8px;
  }
  .admin-nav a {
    white-space: nowrap;
    margin: 0;
  }
  .admin-nav .nav-label {
    display: none;
  }
  .banner {
    padding: 20px;
    align-items: start;
    flex-direction: column;
  }
  .stats-grid {
    gap: 10px;
  }
  .stat {
    padding: 15px;
  }
  .stat strong {
    font-size: 25px;
  }
  .panel {
    padding: 20px;
  }
  .chart-row {
    grid-template-columns: 95px 1fr 25px;
    font-size: 12px;
    gap: 10px;
  }
  .reply.indented {
    margin-inline-start: 12px;
  }
  .hero-actions .btn {
    font-size: 14px;
  }
  .watch-title {
    font-size: 22px;
  }
}
@media (max-width: 390px) {
  .course-grid {
    grid-template-columns: 1fr;
  }
  .course-cover {
    height: 155px;
  }
  .hero h1 {
    font-size: 34px;
  }
  .brand small {
    display: none;
  }
}
@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
    scroll-behavior: auto !important;
  }
}
`;

// 2. תקשורת עם השרת ואימות חשבון. אין שמירת סיסמאות בדפדפן.
const API = import.meta.env.VITE_API_BASE || "";
async function request(url, method = "GET", body) {
  const res = await fetch(API + url, {
    method,
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error("השרת אינו זמין כרגע");
  }
  if (!res.ok) {
    if (
      res.status === 401 &&
      !["/api/auth/login", "/api/auth/register"].includes(url)
    )
      window.dispatchEvent(new Event("limud-session-expired"));
    throw Object.assign(new Error(data.message || "הפעולה לא הצליחה"), {
      status: res.status,
    });
  }
  return data;
}
const Ctx = createContext(null);
const useApp = () => useContext(Ctx);
const blankLearning = { progress: [], enrollments: [], ratings: [] };
function uid() {
  return crypto.randomUUID();
}
function fmtTime(sec) {
  if (!sec) return "—";
  return sec >= 3600
    ? `${Math.floor(sec / 3600)}:${String(Math.floor((sec % 3600) / 60)).padStart(2, "0")}:${String(Math.floor(sec % 60)).padStart(2, "0")}`
    : `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, "0")}`;
}
function hours(c) {
  const h = c.lessons.reduce((s, l) => s + l.duration, 0) / 3600;
  return h < 1 ? `${Math.round(h * 60)} דקות` : `${h.toFixed(1)} שעות`;
}
function date(s) {
  return s
    ? new Intl.DateTimeFormat("he-IL", { dateStyle: "medium" }).format(
        new Date(s),
      )
    : "—";
}
function activeLessons(c) {
  return c.lessons.filter((l) => l.active !== false);
}
function completion(c, learning) {
  const ls = activeLessons(c);
  return ls.length
    ? Math.round(
        (ls.filter((l) =>
          learning.progress.some((p) => p.lessonId === l.id && p.completedAt),
        ).length /
          ls.length) *
          100,
      )
    : 0;
}
function pct(l, p) {
  return p?.completedAt
    ? 100
    : Math.min(
        99,
        Math.floor(
          ((p?.ranges || []).reduce((s, r) => s + r[1] - r[0], 0) /
            Math.max(l.duration, 1)) *
            100,
        ),
      );
}
function AppProvider({ children }) {
  const [courses, setCourses] = useState([]),
    [mode, setMode] = useState("loading"),
    [user, setUser] = useState(null),
    [learning, setLearning] = useState(blankLearning),
    [toast, setToast] = useState("");
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const health = await request("/api/health");
        if (!health.database) throw Error("מסד הנתונים אינו זמין");
        const catalog = await request("/api/catalog");
        let account = null;
        let savedLearning = blankLearning;
        try {
          account = await request("/api/auth/me");
          savedLearning = await request("/api/my-learning");
        } catch (error) {
          if (error.status !== 401) throw error;
          account = null;
        }
        if (!active) return;
        setCourses(catalog);
        setUser(account);
        setLearning(account ? savedLearning : blankLearning);
        setMode("live");
      } catch {
        if (!active) return;
        setUser(null);
        setLearning(blankLearning);
        setCourses([]);
        setMode("error");
      }
    })();
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    function expired() {
      setUser(null);
      setLearning(blankLearning);
    }
    window.addEventListener("limud-session-expired", expired);
    return () => window.removeEventListener("limud-session-expired", expired);
  }, []);
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(""), 4500);
      return () => clearTimeout(t);
    }
  }, [toast]);
  async function refresh() {
    setLearning(await request("/api/my-learning"));
    setCourses(await request("/api/catalog"));
  }
  async function logout() {
    await request("/api/auth/logout", "POST");
    setUser(null);
    setLearning(blankLearning);
  }
  function saveProgress(p) {
    setLearning((v) => ({
      ...v,
      progress: [...v.progress.filter((x) => x.lessonId !== p.lessonId), p],
    }));
  }
  const val = {
    courses,
    setCourses,
    mode,
    user,
    setUser,
    learning,
    notify: setToast,
    refresh,
    logout,
    saveProgress,
  };
  return (
    <Ctx.Provider value={val}>
      <style>{css}</style>
      {children}
      {toast && (
        <div role="status" className="toast-message">
          {toast}
        </div>
      )}
    </Ctx.Provider>
  );
}
function Loading() {
  return (
    <div className="loading">
      <LoaderCircle size={23} className="spin" />
      טוענים את סביבת הלמידה…
    </div>
  );
}
function Empty({ title = "עדיין אין כאן תוכן", text, children }) {
  return (
    <div className="empty">
      <BookOpen size={30} />
      <h3>{title}</h3>
      {text && <p>{text}</p>}
      {children}
    </div>
  );
}
function ProgressBar({ value, label }) {
  return (
    <div>
      <div
        className="progress-track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin="0"
        aria-valuemax="100"
        aria-label={label || "התקדמות"}
      >
        <div className="progress-fill" style={{ width: value + "%" }} />
      </div>
      <div className="progress-caption">
        <span>{label || "התקדמות בקורס"}</span>
        <span>{value}%</span>
      </div>
    </div>
  );
}
function Header() {
  const { user, logout } = useApp(),
    loc = useLocation(),
    nav = useNavigate(),
    [open, setOpen] = useState(false);
  useEffect(() => {
    setOpen(false);
  }, [loc.pathname]);
  return (
    <>
      <a className="skip-link" href="#main">
        דלג לתוכן
      </a>
      <header className="app-header">
        <div className="container-xl header-inner">
          <Link className="brand" to="/">
            <span className="brand-symbol">
              <BookOpen size={23} />
            </span>
            <span>
              לימוד<small>לומדים. מתקדמים.</small>
            </span>
          </Link>
          <nav
            aria-label="ניווט ראשי"
            className={"header-nav " + (open ? "show" : "")}
          >
            <Link className={loc.pathname === "/" ? "active" : ""} to="/">
              כל הקורסים
            </Link>
            {user && (
              <Link
                className={loc.pathname === "/learn" ? "active" : ""}
                to="/learn"
              >
                הלמידה שלי
              </Link>
            )}
            <Link
              className={loc.pathname.startsWith("/forum") ? "active" : ""}
              to="/forum"
            >
              קהילת הלומדים
            </Link>
            {user?.role === "admin" && (
              <Link
                className={loc.pathname.startsWith("/admin") ? "active" : ""}
                to="/admin"
              >
                ניהול
              </Link>
            )}
          </nav>
          <div className="header-actions">
            {user ? (
              <>
                <Link to="/profile" className="user-link">
                  <span className="avatar">{user.name[0]}</span>
                  <span>{user.name}</span>
                </Link>
                <button
                  className="icon-btn"
                  title="יציאה"
                  onClick={async () => {
                    await logout();
                    nav("/");
                  }}
                >
                  <LogOut size={18} />
                </button>
              </>
            ) : (
              <>
                <Link className="login-link small-text" to="/login">
                  כניסה
                </Link>
                <Link className="btn btn-primary btn-sm" to="/register">
                  מתחילים ללמוד <ArrowLeft size={15} />
                </Link>
              </>
            )}
            <button
              className="icon-btn mobile-menu"
              aria-label="פתח תפריט"
              aria-expanded={open}
              onClick={() => setOpen(!open)}
            >
              <Menu size={21} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
function Footer() {
  return (
    <footer className="footer">
      <div className="container-xl footer-inner">
        <Link to="/" className="brand">
          <span className="brand-symbol">
            <BookOpen size={20} />
          </span>
          לימוד
        </Link>
        <p>
          לומדים בקצב שלכם. כל הקורסים ללא תשלום.
          <br />
          תכני הווידאו שייכים ליוצרים המקוריים ומוצגים באמצעות YouTube.
        </p>
        <div className="footer-links">
          <Link to="/">הקורסים שלנו</Link>
          <Link to="/forum">קהילה</Link>
          <Link to="/about">אודות ומקורות</Link>
        </div>
      </div>
    </footer>
  );
}
function Guard({ children, admin = false }) {
  const { user, mode } = useApp(),
    loc = useLocation();
  if (mode === "loading") return <Loading />;
  if (mode === "error")
    return (
      <div className="container-xl page">
        <Empty title="לא ניתן להתחבר לשרת">
          <button className="btn btn-primary" onClick={() => location.reload()}>
            נסה שוב
          </button>
        </Empty>
      </div>
    );
  if (!user || !["student", "admin"].includes(user.role))
    return (
      <Navigate
        to={"/login?next=" + encodeURIComponent(loc.pathname)}
        replace
      />
    );
  if (admin && user.role !== "admin")
    return (
      <div className="container-xl page">
        <Empty title="עמוד זה מיועד למנהל האתר" />
      </div>
    );
  return children;
}
function Cover({ c }) {
  return (
    <div className="course-cover" style={{ "--course-color": c.color }}>
      <span className="cover-label">
        <Globe size={10} />
        {c.language}
      </span>
      <span className="cover-free">חינם</span>
      <span className="cover-mark">{c.mark}</span>
      <span className="cover-code">
        {c.category === "תכנות"
          ? "hello, world_"
          : c.category === "נתונים"
            ? "find your next insight_"
            : "learn. build. repeat_"}
      </span>
    </div>
  );
}
function CourseCard({ c }) {
  const { user, learning } = useApp();
  const value = completion(c, learning);
  return (
    <Link
      className="course-card"
      to={
        user
          ? "/courses/" + c.id
          : "/login?next=" + encodeURIComponent("/courses/" + c.id)
      }
    >
      <Cover c={c} />
      <div className="course-body">
        <div className="course-category">
          {c.category} · {c.level}
        </div>
        <h3>{c.title}</h3>
        <p>{c.description}</p>
        <div className="course-meta">
          <span>
            <Play size={12} />
            {activeLessons(c).length} שיעורים
          </span>
          <span>
            <Clock size={12} />
            {hours(c)}
          </span>
          {c.rating?.count > 0 && (
            <span>
              <Star size={12} />
              {c.rating.average.toFixed(1)}
            </span>
          )}
        </div>
        {user && (
          <div className="mb-3">
            <ProgressBar value={value} />
          </div>
        )}
        <div className="course-bottom">
          <span className="instructor">{c.instructor}</span>
          <span className="open-course">
            {value === 100
              ? "צפייה חוזרת"
              : value > 0
                ? "ממשיכים ללמוד"
                : "לקורס המלא"}
            <ArrowLeft size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
function Catalog({ personal = false }) {
  const { courses, user, learning, mode } = useApp(),
    [query, setQuery] = useState(""),
    [cat, setCat] = useState("הכול"),
    [language, setLanguage] = useState("הכול"),
    [state, setState] = useState("הכול");
  const categories = [
    "הכול",
    "תכנות",
    "פיתוח אתרים",
    "נתונים",
    "אוטומציה ועסקים",
  ];
  const shown = courses
    .filter(
      (c) =>
        c.status === "published" &&
        (cat === "הכול" || c.category === cat) &&
        (language === "הכול" || c.language === language) &&
        [c.title, c.description, c.instructor]
          .join(" ")
          .toLowerCase()
          .includes(query.toLowerCase()),
    )
    .filter(
      (c) =>
        state === "הכול" ||
        (state === "בתהליך"
          ? completion(c, learning) > 0 && completion(c, learning) < 100
          : state === "הושלמו"
            ? completion(c, learning) === 100
            : completion(c, learning) === 0),
    );
  const python = courses.find((c) => c.id === "python"),
    started = learning.enrollments.length,
    complete = courses.filter((c) => completion(c, learning) === 100).length,
    last = courses.find((c) => c.id === learning.enrollments.at(-1)?.courseId);
  if (mode === "loading") return <Loading />;
  if (mode === "error")
    return (
      <div className="page container-xl">
        <Empty title="לא הצלחנו לטעון את הקורסים">
          <button className="btn btn-primary" onClick={() => location.reload()}>
            נסה שוב
          </button>
        </Empty>
      </div>
    );
  return (
    <>
      {!personal ? (
        <>
          <section className="hero">
            <div className="container-xl hero-inner">
              <div>
                <span className="eyebrow">
                  <Sparkles size={13} />
                  הידע של המחר, פתוח לכולם
                </span>
                <h1>
                  הצעד הבא שלך
                  <br />
                  מתחיל <span>בלמידה.</span>
                </h1>
                <p>
                  תכנות, נתונים וכלים לעולם העבודה.
                  <br />
                  קורסים נבחרים בעברית, בקצב שלך — וללא תשלום.
                </p>
                <div className="hero-actions">
                  <a className="btn btn-primary" href="#catalog">
                    מה לומדים היום? <ArrowLeft size={17} />
                  </a>
                  <Link
                    className="btn btn-light"
                    to={user ? "/learn" : "/register"}
                  >
                    {user ? "הלמידה שלי" : "נרשמים בחינם"}
                  </Link>
                </div>
                <div className="hero-meta">
                  <span>
                    <CheckCircle2 size={14} />
                    ללא כרטיס אשראי
                  </span>
                  <span>
                    <CheckCircle2 size={14} />
                    גישה לכל הקורסים
                  </span>
                  <span>
                    <CheckCircle2 size={14} />
                    בקצב שלך
                  </span>
                </div>
              </div>
              <div className="feature-card">
                <div className="feature-head">
                  <span>ההתחלה של משהו חדש</span>
                  <span dir="ltr">PYTHON / 01</span>
                </div>
                <div className="code-window">
                  <div className="comment"># your next chapter starts here</div>
                  <div>
                    <span className="keyword">def</span> start_learning():
                  </div>
                  <div>
                    &nbsp;&nbsp;curiosity ={" "}
                    <span className="keyword">True</span>
                  </div>
                  <div>
                    &nbsp;&nbsp;<span className="keyword">while</span>{" "}
                    curiosity:
                  </div>
                  <div>
                    &nbsp;&nbsp;&nbsp;&nbsp;learn(
                    <span className="string">"something new"</span>)
                  </div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;build_your_future()</div>
                </div>
                <div className="feature-title">מרעיון לשורת הקוד הראשונה.</div>
                <div className="feature-caption">
                  <span>
                    Python למתחילים · {python?.lessons.length || 40} שיעורים
                    בעברית
                  </span>
                  <Link
                    aria-label="התחל קורס פייתון"
                    className="round-play"
                    to={
                      user ? "/courses/python" : "/login?next=/courses/python"
                    }
                  >
                    <Play fill="currentColor" size={18} />
                  </Link>
                </div>
                <div className="hero-rating">
                  <BookOpen size={16} />
                  מסלול למידה מסודר, צעד אחר צעד
                </div>
              </div>
            </div>
          </section>
          <div className="trust-strip">
            <div className="container-xl trust-inner">
              <span>
                <BookOpen size={18} />
                {courses.filter((c) => c.status === "published").length} קורסים,
                עולם של אפשרויות
              </span>
              <span>
                <Globe size={18} />
                לומדים בעברית
              </span>
              <span>
                <BarChart3 size={18} />
                רואים את ההתקדמות
              </span>
              <span>
                <MessageCircle size={18} />
                לומדים גם ביחד
              </span>
            </div>
          </div>
        </>
      ) : (
        <div className="container-xl pt-4">
          <div className="kicker">סביבת הלמידה האישית</div>
          <h1 className="page-title mt-2">טוב לראות אותך, {user?.name}.</h1>
          <p className="muted">כל צעד קטן הוא עוד משהו גדול שלמדת.</p>
          <div className="stats-grid">
            <div className="stat">
              <BookOpen size={20} />
              <strong>{started}</strong>
              <span>קורסים שהתחלת</span>
            </div>
            <div className="stat">
              <CheckCircle2 size={20} />
              <strong>{complete}</strong>
              <span>קורסים שהשלמת</span>
            </div>
            <div className="stat">
              <Play size={20} />
              <strong>
                {learning.progress.filter((p) => p.completedAt).length}
              </strong>
              <span>שיעורים שהשלמת</span>
            </div>
            <div className="stat">
              <LayoutGrid size={20} />
              <strong>{courses.length}</strong>
              <span>קורסים פתוחים עבורך</span>
            </div>
          </div>
          {last && (
            <div className="banner">
              <div>
                <span className="kicker">ממשיכים מאיפה שעצרת</span>
                <h3 className="mt-2 mb-1">{last.title}</h3>
                <span className="muted small-text">הלמידה שלך מחכה לך.</span>
              </div>
              <Link className="btn btn-primary" to={"/courses/" + last.id}>
                חזרה לקורס <Play size={16} />
              </Link>
            </div>
          )}
        </div>
      )}
      <section className="catalog-section" id="catalog">
        <div className="container-xl">
          <div className="section-heading">
            <div>
              <h2>{personal ? "מה נלמד היום?" : "לומדים משהו חדש היום"}</h2>
              <p>בחרו את התחום שמסקרן אתכם. אנחנו נדאג לדרך.</p>
            </div>
            <div className="search-box">
              <Search size={18} />
              <input
                className="form-control"
                placeholder="איזה נושא מעניין אותך?"
                aria-label="חיפוש קורסים"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>
          <div className="filter-row">
            <div className="chips">
              {categories.map((x) => (
                <button
                  key={x}
                  className={"chip " + (cat === x ? "active" : "")}
                  onClick={() => setCat(x)}
                >
                  {x}
                  {x === "הכול" && (
                    <span className="chip-count">{courses.length}</span>
                  )}
                </button>
              ))}
            </div>
            <div className="d-flex gap-2">
              <select
                aria-label="שפת הקורס"
                className="filter-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
              >
                <option value="הכול">כל השפות</option>
                <option>עברית</option>
                <option>אנגלית</option>
              </select>
              {personal && (
                <select
                  className="filter-select"
                  aria-label="מצב למידה"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                >
                  {["הכול", "בתהליך", "הושלמו", "טרם התחלתי"].map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              )}
            </div>
          </div>
          {shown.length ? (
            <div className="course-grid">
              {shown.map((c) => (
                <CourseCard c={c} key={c.id} />
              ))}
            </div>
          ) : (
            <Empty
              title="לא נמצאו קורסים מתאימים"
              text="נסו חיפוש אחר או נקו את המסננים."
            >
              <button
                className="btn btn-light"
                onClick={() => {
                  setQuery("");
                  setCat("הכול");
                  setLanguage("הכול");
                  setState("הכול");
                }}
              >
                ניקוי מסננים
              </button>
            </Empty>
          )}
          <div className="pagination-note">
            {shown.length} קורסים · ההרשמה חינמית ומאפשרת צפייה ושמירת התקדמות
          </div>
        </div>
      </section>
    </>
  );
}

// 3. כניסה, הרשמה והפרופיל
function AuthPage({ register = false }) {
  const { mode, user, setUser, refresh } = useApp(),
    nav = useNavigate(),
    loc = useLocation(),
    [name, setName] = useState(""),
    [email, setEmail] = useState(""),
    [password, setPassword] = useState(""),
    [confirm, setConfirm] = useState(""),
    [visible, setVisible] = useState(false),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const raw = new URLSearchParams(loc.search).get("next"),
    next = raw?.startsWith("/") && !raw.startsWith("//") ? raw : "/learn";
  useEffect(() => {
    setError("");
  }, [register]);
  if (mode === "loading") return <Loading />;
  if (mode === "error")
    return (
      <div className="container-xl page">
        <Empty title="השרת אינו זמין כרגע">
          <button className="btn btn-primary" onClick={() => location.reload()}>
            נסה שוב
          </button>
        </Empty>
      </div>
    );
  if (user)
    return (
      <Navigate
        to={raw ? next : user.role === "admin" ? "/admin" : next}
        replace
      />
    );
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (mode !== "live") {
      setError("השרת אינו זמין כרגע. נסו שוב לאחר חידוש החיבור.");
      return;
    }
    if (register && password !== confirm) {
      setError("הסיסמאות אינן תואמות");
      return;
    }
    setBusy(true);
    try {
      const u = await request(
        "/api/auth/" + (register ? "register" : "login"),
        "POST",
        { name, email, password },
      );
      setUser(u);
      await refresh();
      nav(next);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="auth-layout">
      <div className="auth-form-wrap">
        <span className="kicker">כל מה שצריך כדי להתקדם</span>
        <h1 className="mt-3">
          {register ? "הדרך שלך מתחילה כאן." : "שמחים שחזרת."}
        </h1>
        <p className="muted small-text mb-4">
          {register
            ? "חשבון אחד. כל הקורסים. אפס עלות."
            : "נכנסים, ממשיכים ללמוד ומגלים משהו חדש."}
        </p>
        {error && (
          <div className="error-box mb-3" role="alert">
            {error}
          </div>
        )}
        <form onSubmit={submit}>
          {register && (
            <div className="mb-3">
              <label className="form-label" htmlFor="name">
                השם שלך
              </label>
              <input
                id="name"
                className="form-control"
                autoComplete="name"
                required
                maxLength={60}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="איך קוראים לך?"
              />
            </div>
          )}
          <div className="mb-3">
            <label className="form-label" htmlFor="email">
              כתובת דוא״ל
            </label>
            <input
              id="email"
              className="form-control"
              type="email"
              dir="ltr"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
            />
          </div>
          <div className="mb-3">
            <label className="form-label" htmlFor="password">
              סיסמה
            </label>
            <div className="password-wrap">
              <input
                id="password"
                className="form-control"
                type={visible ? "text" : "password"}
                autoComplete={register ? "new-password" : "current-password"}
                required
                minLength={register ? 10 : undefined}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={register ? "לפחות 10 תווים" : "הסיסמה שלך"}
              />
              <button
                type="button"
                className="icon-btn"
                aria-label={visible ? "הסתר סיסמה" : "הצג סיסמה"}
                onClick={() => setVisible(!visible)}
              >
                {visible ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {register && (
              <small className="muted">
                לפחות 10 תווים, ועד 72 בתים (עברית עשויה לתפוס יותר מבית לתו).
              </small>
            )}
          </div>
          {register && (
            <div className="mb-3">
              <label className="form-label" htmlFor="confirm">
                סיסמה פעם נוספת
              </label>
              <input
                id="confirm"
                className="form-control"
                type="password"
                autoComplete="new-password"
                required
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>
          )}
          <button
            className="btn btn-primary w-100 mt-2"
            disabled={busy || mode !== "live"}
          >
            {busy ? (
              <LoaderCircle size={18} className="spin" />
            ) : register ? (
              "יצירת חשבון בחינם"
            ) : (
              "כניסה לחשבון"
            )}
            <ArrowLeft size={16} />
          </button>
        </form>
        <p className="text-center small-text muted mt-4">
          {register ? "כבר יש לך חשבון?" : "עדיין לא הצטרפת?"}{" "}
          <Link
            className="fw-bold"
            to={(register ? "/login" : "/register") + loc.search}
          >
            {register ? "נכנסים כאן" : "נרשמים בחינם"}
          </Link>
        </p>
      </div>
      <div className="auth-story">
        <span className="badge-soft align-self-start mb-4">
          ידע טוב פותח דלתות
        </span>
        <h2>
          לכל התחלה קטנה
          <br />
          יש עתיד גדול.
        </h2>
        <p className="mt-3">
          תנו לסקרנות להוביל. אנחנו כאן עם קורסים מסודרים וקהילה שלומדת יחד.
        </p>
        {[
          ["כל הקורסים פתוחים בפניך", BookOpen],
          ["מתקדמים בקצב שמתאים לך", Clock],
          ["ההתקדמות שלך נשמרת", BarChart3],
          ["שואלים, משתפים ולומדים יחד", MessageCircle],
        ].map(([t, I]) => (
          <div className="auth-benefit" key={t}>
            <I size={20} />
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
function Profile() {
  const { user, setUser, notify } = useApp(),
    [name, setName] = useState(user.name),
    [currentPassword, setCurrent] = useState(""),
    [password, setPassword] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save(e) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      setUser(await request("/api/me", "PATCH", { name }));
      notify("השם עודכן");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function change(e) {
    e.preventDefault();
    try {
      await request("/api/me/change-password", "POST", {
        currentPassword,
        password,
      });
      setCurrent("");
      setPassword("");
      notify("הסיסמה שונתה בהצלחה");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <div className="container-xl page" style={{ maxWidth: 700 }}>
      <h1 className="page-title">הפרופיל שלי</h1>
      <p className="muted">הפרטים שלך, במקום אחד.</p>
      {error && <div className="error-box mb-3">{error}</div>}
      <form className="panel" onSubmit={save}>
        <div className="d-flex align-items-center gap-3 mb-4">
          <span className="avatar">{user.name[0]}</span>
          <div>
            {user.name}
            <div className="muted small-text">
              {user.role === "admin" ? "מנהל האתר" : "לומד בקהילה"}
            </div>
          </div>
        </div>
        <label className="form-label" htmlFor="profile-name">
          שם לתצוגה
        </label>
        <input
          id="profile-name"
          className="form-control mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={60}
        />
        <label className="form-label">כתובת דוא״ל</label>
        <input
          className="form-control mb-3"
          value={user.email}
          disabled
          dir="ltr"
        />
        <button className="btn btn-primary" disabled={busy}>
          שמירת שינויים
        </button>
      </form>
      {
        <form className="panel mt-4" onSubmit={change}>
          <h2 className="h5 mb-4">שינוי סיסמה</h2>
          <label className="form-label" htmlFor="current-password">
            סיסמה נוכחית
          </label>
          <input
            id="current-password"
            className="form-control mb-3"
            type="password"
            required
            autoComplete="current-password"
            value={currentPassword}
            onChange={(e) => setCurrent(e.target.value)}
          />
          <label className="form-label" htmlFor="new-password">
            סיסמה חדשה — 10 תווים לפחות
          </label>
          <input
            id="new-password"
            className="form-control mb-3"
            type="password"
            required
            minLength={10}
            autoComplete="new-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button className="btn btn-primary">עדכון סיסמה</button>
        </form>
      }
    </div>
  );
}

// 4. קורסים, שיעורים ודירוגים
function RatingBox({ course, lessonId, onClose }) {
  const { learning, notify, refresh } = useApp(),
    target = lessonId || course.id,
    [value, setValue] = useState(
      learning.ratings.find((r) => r.targetId === target)?.value || 0,
    ),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function save() {
    if (!value) return;
    setBusy(true);
    try {
      await request("/api/courses/" + course.id + "/rating", "PUT", {
        lessonId,
        value,
      });
      await refresh();

      notify("תודה על הדירוג שלך!");
      onClose?.();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="panel rating-box">
      <CheckCircle2 className="success-icon mb-2" size={29} />
      <h3>
        {lessonId
          ? "סיימת את השיעור. כל הכבוד!"
          : "סיימת את הקורס. איזו דרך עשית!"}
      </h3>
      <p className="muted small-text">
        {lessonId ? "איך היה השיעור?" : "איך הייתה חוויית הלמידה בקורס?"} הדירוג
        לבחירתך.
      </p>
      <div className="stars" role="group" aria-label="דירוג">
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={n <= value ? "on" : ""}
            onClick={() => setValue(n)}
            aria-label={n + " כוכבים"}
            aria-pressed={n === value}
          >
            <Star fill={n <= value ? "currentColor" : "none"} size={27} />
          </button>
        ))}
      </div>
      {error && <div className="error-box mt-2">{error}</div>}
      <div className="d-flex justify-content-center gap-2 mt-3">
        <button
          className="btn btn-primary btn-sm"
          disabled={!value || busy}
          onClick={save}
        >
          שליחת דירוג
        </button>
        {onClose && (
          <button className="btn btn-light btn-sm" onClick={onClose}>
            אולי אחר כך
          </button>
        )}
      </div>
    </div>
  );
}
function CoursePage() {
  const { id } = useParams(),
    { courses, learning, user, refresh, notify } = useApp(),
    nav = useNavigate(),
    [busy, setBusy] = useState(false),
    c = courses.find((x) => x.id === id);
  if (!c || c.status === "archived")
    return (
      <div className="page container-xl">
        <Empty title="הקורס אינו זמין" />
      </div>
    );
  const lessons = activeLessons(c),
    value = completion(c, learning),
    next =
      lessons.find(
        (l) =>
          !learning.progress.some((p) => p.lessonId === l.id && p.completedAt),
      ) || lessons[0];
  function unlocked(index) {
    return (
      user.role === "admin" ||
      lessons
        .slice(0, index)
        .every((l) =>
          learning.progress.some((p) => p.lessonId === l.id && p.completedAt),
        )
    );
  }
  async function start(l) {
    setBusy(true);
    try {
      await request("/api/courses/" + c.id + "/start", "POST");
      await refresh();

      nav("/courses/" + c.id + "/lessons/" + l.id);
    } catch (e) {
      notify(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="container-xl page">
      <div className="breadcrumb-row">
        <Link to="/learn">כל הקורסים</Link>
        <ChevronLeft size={13} />
        <span>{c.title}</span>
      </div>
      <div className="course-intro">
        <div>
          <div className="d-flex gap-2 mb-3">
            <span className="badge-soft">{c.category}</span>
            <span className="badge-soft">
              <Globe size={12} />
              {c.language}
            </span>
            <span className="badge-soft">{c.level}</span>
          </div>
          <h1>{c.title}</h1>
          <p>{c.description}</p>
          <div className="course-meta">
            <span>
              <BookOpen size={14} />
              {lessons.length} שיעורים
            </span>
            <span>
              <Clock size={14} />
              {hours(c)}
            </span>
            <span>{c.instructor}</span>
          </div>
          <div className="d-flex flex-wrap gap-3 align-items-center">
            <button
              className="btn btn-primary"
              disabled={!next || busy}
              onClick={() => start(next)}
            >
              {value === 100
                ? "צפייה חוזרת"
                : value
                  ? "ממשיכים ללמוד"
                  : "מתחילים ללמוד"}
              <Play size={16} />
            </button>
            <Link className="btn btn-light" to={"/forum/topics/course-" + c.id}>
              <MessageCircle size={16} />
              פורום הקורס
            </Link>
          </div>
        </div>
        <Cover c={c} />
      </div>
      <div className="panel mb-4">
        <div className="d-flex justify-content-between align-items-center">
          <strong>המסלול שלך</strong>
          <span className="muted small-text">
            {
              lessons.filter((l) =>
                learning.progress.some(
                  (p) => p.lessonId === l.id && p.completedAt,
                ),
              ).length
            }{" "}
            מתוך {lessons.length} שיעורים הושלמו
          </span>
        </div>
        <ProgressBar value={value} />
        <div className="small-text muted mt-3">
          ידע מקדים: {c.prerequisites || "ללא ידע קודם"} · השיעור הבא נפתח לאחר
          השלמת הקודם.
        </div>
      </div>
      <h2 className="h4 fw-bold mb-3">מה לומדים בקורס?</h2>
      <div className="lesson-grid">
        {lessons.map((l, i) => {
          const p = learning.progress.find((p) => p.lessonId === l.id),
            open = unlocked(i);
          return (
            <div
              className={"lesson-card " + (!open ? "locked" : "")}
              key={l.id}
            >
              <div className="lesson-top">
                <span className="lesson-number">
                  שיעור {String(i + 1).padStart(2, "0")}
                </span>
                {p?.completedAt ? (
                  <CheckCircle2 size={18} className="success-icon" />
                ) : !open ? (
                  <Lock size={16} />
                ) : (
                  <Play size={16} />
                )}
              </div>
              <h3 dir="auto">{l.title}</h3>
              <ProgressBar
                value={pct(l, p)}
                label={
                  p?.completedAt
                    ? "הושלם"
                    : !open
                      ? "יש להשלים את השיעורים הקודמים"
                      : "התקדמות בשיעור"
                }
              />
              <div className="lesson-bottom">
                <span dir="ltr">{fmtTime(l.duration)}</span>
                <button
                  className="btn btn-sm btn-light"
                  disabled={!open || busy}
                  onClick={() => start(l)}
                >
                  {!open
                    ? "נעול"
                    : p?.completedAt
                      ? "צפייה חוזרת"
                      : pct(l, p) > 0
                        ? "המשך"
                        : "לצפייה"}
                  <ChevronLeft size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
      {value === 100 && <RatingBox course={c} />}
      <div className="notice mt-4">
        הקורס מבוסס על רשימת ההשמעה של {c.instructor}. סדר השיעורים וכותרותיהם
        נשמרו מהמקור. חלק מהסדרות עשויות להשתמש בגרסאות קודמות של הכלים.
        <br />
        <a
          className="source-link mt-2"
          href={c.sourceUrl}
          target="_blank"
          rel="noreferrer"
        >
          רשימת ההשמעה המקורית <ExternalLink size={13} />
        </a>
      </div>
    </div>
  );
}
let youtubePromise;
function loadYoutube() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (!youtubePromise)
    youtubePromise = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        youtubePromise = null;
        reject(Error("נגן YouTube לא נטען. בדקו חיבור או חוסם תוכן."));
      }, 20000);
      window.onYouTubeIframeAPIReady = () => {
        clearTimeout(timer);
        resolve(window.YT);
      };
      const script = document.createElement("script");
      script.src = "https://www.youtube.com/iframe_api";
      script.onerror = () => {
        clearTimeout(timer);
        youtubePromise = null;
        reject(Error("לא ניתן לטעון את הנגן"));
      };
      document.head.appendChild(script);
    });
  return youtubePromise;
}
function WatchPage() {
  const { id, lessonId } = useParams(),
    { courses, learning, user, saveProgress, refresh } = useApp(),
    [error, setError] = useState(""),
    [status, setStatus] = useState("טוענים את הנגן…"),
    [rating, setRating] = useState(false),
    [retry, setRetry] = useState(0),
    mount = useRef(null),
    player = useRef(null),
    nav = useNavigate();
  const c = courses.find((c) => c.id === id),
    lessons = c ? activeLessons(c) : [],
    index = lessons.findIndex((l) => l.id === lessonId),
    l = lessons[index],
    progress = learning.progress.find((p) => p.lessonId === lessonId),
    unlocked =
      user.role === "admin" ||
      lessons
        .slice(0, index)
        .every((l) =>
          learning.progress.some((p) => p.lessonId === l.id && p.completedAt),
        );
  useEffect(() => {
    if (!l || !unlocked) return;
    let disposed = false,
      interval,
      yt,
      lastPosition = progress?.lastPosition || 0,
      key,
      writing = false,
      previousPlaying = false;
    setError("");
    setStatus("טוענים את הנגן…");
    setRating(false);
    async function tick(ended = false) {
      if (disposed || !yt?.getCurrentTime || writing) return;
      writing = true;
      const position = yt.getCurrentTime(),
        speed = yt.getPlaybackRate() || 1,
        playing = yt.getPlayerState() === 1;
      try {
        let p;

        if (!key) return;
        p = await request(
          `/api/courses/${id}/lessons/${lessonId}/progress`,
          "PUT",
          { key, position, speed, playing: previousPlaying, ended },
        );
        saveProgress(p);
        if (ended) {
          p = await request(
            `/api/courses/${id}/lessons/${lessonId}/complete`,
            "POST",
            { key },
          );
          saveProgress(p);
          setRating(true);
          await refresh();
        }
        setStatus("ההתקדמות נשמרה");

        lastPosition = position;
        previousPlaying = playing;
      } catch (e) {
        setError(e.message);
        setStatus("השמירה לא הושלמה — מנסים שוב בעדכון הבא");
      } finally {
        writing = false;
      }
    }
    (async () => {
      try {
        const item = await request(`/api/courses/${id}/lessons/${lessonId}`);

        const session = await request(
          `/api/courses/${id}/lessons/${lessonId}/watch`,
          "POST",
          { position: lastPosition },
        );
        key = session.key;

        const YT = await loadYoutube();
        if (disposed) return;
        const holder = document.createElement("div");
        mount.current.replaceChildren(holder);
        yt = new YT.Player(holder, {
          videoId: item.youtubeId,
          host: "https://www.youtube-nocookie.com",
          playerVars: {
            origin: window.location.origin,
            playsinline: 1,
            rel: 0,
            start: Math.floor(lastPosition),
            hl: "he",
          },
          events: {
            onReady: () => {
              if (!disposed) {
                player.current = yt;
                setStatus("הנגן מוכן. לחצו על הפעלה כדי להתחיל.");
                interval = setInterval(() => tick(), 10000);
              }
            },
            onStateChange: (e) => {
              if (e.data === 0) tick(true);
              else if (e.data === 1) {
                lastPosition = yt.getCurrentTime();
                previousPlaying = true;
              } else if (e.data === 2 || e.data === 3) tick();
            },
            onError: () => {
              setError(
                "הסרטון אינו זמין להטמעה כרגע. ייתכן שהוסר או שהיוצר הגביל את הצפייה. אפשר לפנות בפורום למנהל.",
              );
              setStatus("שגיאת נגן");
            },
          },
        });
      } catch (e) {
        if (!disposed) setError(e.message);
      }
    })();
    return () => {
      disposed = true;
      clearInterval(interval);
      yt?.destroy?.();
      player.current = null;
    };
  }, [id, lessonId, retry]);
  if (!c || !l)
    return (
      <div className="container-xl page">
        <Empty title="השיעור לא נמצא" />
      </div>
    );
  if (!unlocked)
    return (
      <div className="container-xl page">
        <Empty title="השיעור עדיין נעול" text="יש להשלים את השיעורים הקודמים.">
          <Link className="btn btn-primary" to={"/courses/" + id}>
            חזרה לקורס
          </Link>
        </Empty>
      </div>
    );
  return (
    <div className="container-xl page">
      <div className="breadcrumb-row">
        <Link to="/learn">הקורסים שלי</Link>
        <ChevronLeft size={13} />
        <Link to={"/courses/" + id}>{c.title}</Link>
        <ChevronLeft size={13} />
        <span>שיעור {index + 1}</span>
      </div>
      <div className="watch-layout">
        <div>
          <div className="player-frame">
            <div ref={mount} />
          </div>
          {error && (
            <div className="error-box mt-3" role="alert">
              {error}
              <button
                className="btn btn-sm btn-light ms-2"
                onClick={() => setRetry((x) => x + 1)}
              >
                <RefreshCw size={13} />
                טען מחדש
              </button>
            </div>
          )}
          <div className="d-flex justify-content-between mt-3 small-text muted">
            <span>
              <ShieldCheck size={13} /> {status}
            </span>
            <span dir="ltr">{fmtTime(l.duration)}</span>
          </div>
          <h1 className="watch-title" dir="auto">
            {l.title}
          </h1>
          <ProgressBar
            value={pct(l, progress)}
            label={progress?.completedAt ? "השיעור הושלם" : "התקדמות בשיעור"}
          />
          <div className="d-flex justify-content-between gap-2 mt-4">
            <button
              className="btn btn-light"
              disabled={index === 0}
              onClick={() =>
                nav(`/courses/${id}/lessons/${lessons[index - 1].id}`)
              }
            >
              <ArrowRight size={16} />
              השיעור הקודם
            </button>
            {lessons[index + 1] ? (
              <button
                className="btn btn-primary"
                disabled={!progress?.completedAt && user.role !== "admin"}
                onClick={() =>
                  nav(`/courses/${id}/lessons/${lessons[index + 1].id}`)
                }
              >
                השיעור הבא <ArrowLeft size={16} />
              </button>
            ) : (
              <Link className="btn btn-primary" to={"/courses/" + id}>
                בחזרה לקורס <ArrowLeft size={16} />
              </Link>
            )}
          </div>
          {rating ? (
            <RatingBox
              course={c}
              lessonId={lessonId}
              onClose={() => setRating(false)}
            />
          ) : (
            progress?.completedAt && (
              <button
                className="btn btn-light mt-3"
                onClick={() => setRating(true)}
              >
                <Star size={16} />
                דירוג השיעור
              </button>
            )
          )}
          <div className="panel mt-4">
            <h2 className="h5">לומדים גם ביחד</h2>
            <p className="muted small-text">
              משהו לא ברור? שתפו שאלה עם קהילת הלומדים של הקורס.
            </p>
            <Link
              className="btn btn-light btn-sm"
              to={"/forum/topics/course-" + id}
            >
              <MessageCircle size={15} />
              מעבר לפורום הקורס
            </Link>
          </div>
        </div>
        <aside className="playlist">
          <h3>
            {c.title}
            <ProgressBar value={completion(c, learning)} />
          </h3>
          <div className="playlist-list">
            {lessons.map((item, i) => {
              const done = learning.progress.some(
                  (p) => p.lessonId === item.id && p.completedAt,
                ),
                open =
                  user.role === "admin" ||
                  lessons
                    .slice(0, i)
                    .every((l) =>
                      learning.progress.some(
                        (p) => p.lessonId === l.id && p.completedAt,
                      ),
                    );
              return (
                <Link
                  key={item.id}
                  to={open ? `/courses/${id}/lessons/${item.id}` : "#"}
                  onClick={(e) => !open && e.preventDefault()}
                  aria-disabled={!open}
                  className={
                    "playlist-item " +
                    (item.id === lessonId ? "active " : "") +
                    (!open ? "disabled" : "")
                  }
                >
                  <span className="num">
                    {done ? (
                      <CheckCircle2 size={15} />
                    ) : !open ? (
                      <Lock size={14} />
                    ) : (
                      String(i + 1).padStart(2, "0")
                    )}
                  </span>
                  <div>
                    <div dir="auto">{item.title}</div>
                    <div className="muted mt-1" dir="ltr">
                      {fmtTime(item.duration)}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

// 5. פורום — אותם מסכים לתלמידים ולמנהלים, פעולות לפי בעלות והרשאה.
function Forum() {
  const { topicId, postId } = useParams(),
    { user, notify } = useApp(),
    [topics, setTopics] = useState([]),
    [posts, setPosts] = useState([]),
    [thread, setThread] = useState(null),
    [busy, setBusy] = useState(true),
    [error, setError] = useState(""),
    [composer, setComposer] = useState(false),
    [title, setTitle] = useState(""),
    [body, setBody] = useState(""),
    [replyTo, setReplyTo] = useState(null),
    [editing, setEditing] = useState(null),
    [editText, setEditText] = useState(""),
    [editTitle, setEditTitle] = useState(""),
    [sending, setSending] = useState(false),
    [version, setVersion] = useState(0),
    nav = useNavigate();
  const topic = topics.find((t) => t.id === (topicId || thread?.post.topicId));
  useEffect(() => {
    let active = true;
    setBusy(true);
    setError("");
    setComposer(false);
    setEditing(null);
    setBody("");
    setReplyTo(null);
    (async () => {
      try {
        const t = await request("/api/forum/topics");
        if (!active) return;
        setTopics(t);
        if (postId) setThread(await request("/api/forum/posts/" + postId));
        else {
          setThread(null);
          setPosts(
            topicId
              ? await request("/api/forum/topics/" + topicId + "/posts")
              : [],
          );
        }
      } catch (e) {
        if (active) setError(e.message);
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [topicId, postId, version]);
  async function submitPost(e) {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      let id;

      id = (
        await request(
          "/api/forum/topics/" + (topicId || "general") + "/posts",
          "POST",
          { title, body },
        )
      ).id;

      setTitle("");
      setBody("");
      setComposer(false);
      nav("/forum/posts/" + id);
      notify("ההודעה פורסמה");
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }
  async function submitReply(e) {
    e.preventDefault();
    setSending(true);
    try {
      await request("/api/forum/posts/" + postId + "/replies", "POST", {
        body,
        parentReplyId: replyTo?.id,
      });
      setVersion((x) => x + 1);

      setBody("");
      setReplyTo(null);
      notify("התגובה נשלחה");
    } catch (e) {
      setError(e.message);
    } finally {
      setSending(false);
    }
  }
  async function remove(item, isReply) {
    if (
      !window.confirm(
        isReply
          ? "להסיר את התגובה? תגובות ההמשך יישמרו."
          : "למחוק את ההודעה ואת השרשור מהתצוגה?",
      )
    )
      return;
    try {
      await request(
        "/api/forum/" + (isReply ? "replies" : "posts") + "/" + item.id,
        "DELETE",
      );
      setVersion((x) => x + 1);

      if (!isReply) nav("/forum/topics/" + item.topicId);
      notify("התוכן הוסר");
    } catch (e) {
      setError(e.message);
    }
  }
  async function saveEdit(e) {
    e.preventDefault();
    try {
      await request(
        "/api/forum/" +
          (editing.reply ? "replies" : "posts") +
          "/" +
          editing.id,
        "PATCH",
        { body: editText, title: editTitle },
      );
      setVersion((x) => x + 1);

      setEditing(null);
      notify("השינויים נשמרו");
    } catch (e) {
      setError(e.message);
    }
  }
  function controls(item, isReply = false) {
    return (
      <div className="edit-tools">
        {String(item.authorId) === user.id && !item.deleted && (
          <button
            className="icon-btn"
            aria-label="עריכה"
            onClick={() => {
              setEditing({ id: item.id, reply: isReply });
              setEditText(item.body);
              setEditTitle(item.title || "");
            }}
          >
            <Pencil size={14} />
          </button>
        )}
        {user.role === "admin" && !item.deleted && (
          <button
            className="icon-btn"
            aria-label="מחיקה"
            onClick={() => remove(item, isReply)}
          >
            <Trash2 size={14} />
          </button>
        )}
      </div>
    );
  }
  function editForm(item, isReply) {
    return editing?.id === item.id ? (
      <form onSubmit={saveEdit} className="inline-editor">
        {!isReply && (
          <input
            className="form-control mb-2"
            aria-label="כותרת"
            value={editTitle}
            required
            maxLength={160}
            onChange={(e) => setEditTitle(e.target.value)}
          />
        )}
        <textarea
          className="form-control"
          aria-label="עריכת תוכן"
          value={editText}
          required
          maxLength={5000}
          rows={4}
          onChange={(e) => setEditText(e.target.value)}
        />
        <div className="d-flex gap-2 mt-2">
          <button className="btn btn-primary btn-sm">שמירה</button>
          <button
            type="button"
            className="btn btn-light btn-sm"
            onClick={() => setEditing(null)}
          >
            ביטול
          </button>
        </div>
      </form>
    ) : (
      <div className="post-body mt-3" dir="auto">
        {item.body}
      </div>
    );
  }
  return (
    <div className="container-xl page">
      <div className="section-heading">
        <div>
          <span className="kicker">שאלות טובות מובילות קדימה</span>
          <h1 className="page-title mt-2">קהילת הלומדים</h1>
          <p>מקום לשאול, לחלוק ידע ולפתור דברים יחד.</p>
        </div>
        <div className="d-flex gap-2">
          {user.role === "admin" && (
            <Link className="btn btn-light" to="/admin/topics">
              <Settings size={16} />
              ניהול נושאים
            </Link>
          )}
          {!postId && (
            <button
              className="btn btn-primary"
              onClick={() => setComposer(!composer)}
            >
              <Plus size={17} />
              הודעה חדשה
            </button>
          )}
        </div>
      </div>
      <div className="forum-layout">
        <aside className="topic-nav">
          <Link to="/forum" className={!topicId && !postId ? "active" : ""}>
            <span>כל הנושאים</span>
            <LayoutGrid size={15} />
          </Link>
          {topics.map((t) => (
            <Link
              key={t.id}
              to={"/forum/topics/" + t.id}
              className={topic?.id === t.id ? "active" : ""}
            >
              <span>{t.name}</span>
              <ChevronLeft size={13} />
            </Link>
          ))}
        </aside>
        <div>
          {error && (
            <div className="error-box mb-3" role="alert">
              {error}
            </div>
          )}
          {composer && (
            <form className="panel mb-3" onSubmit={submitPost}>
              <h2 className="h5 mb-3">הודעה חדשה · {topic?.name || "כללי"}</h2>
              <label className="form-label" htmlFor="post-title">
                כותרת
              </label>
              <input
                id="post-title"
                className="form-control mb-3"
                placeholder="מה תרצו לשאול או לשתף?"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                maxLength={160}
              />
              <label className="form-label" htmlFor="post-body">
                תוכן ההודעה
              </label>
              <textarea
                id="post-body"
                className="form-control mb-3"
                rows={5}
                required
                maxLength={5000}
                value={body}
                onChange={(e) => setBody(e.target.value)}
              />
              <div className="d-flex gap-2">
                <button className="btn btn-primary" disabled={sending}>
                  פרסום הודעה <Send size={15} />
                </button>
                <button
                  className="btn btn-light"
                  type="button"
                  onClick={() => setComposer(false)}
                >
                  ביטול
                </button>
              </div>
            </form>
          )}
          {busy ? (
            <Loading />
          ) : thread ? (
            <>
              <div className="breadcrumb-row">
                <Link to={"/forum/topics/" + thread.post.topicId}>
                  {topic?.name || "בחזרה לנושא"}
                </Link>
                <ChevronLeft size={13} />
                דיון
              </div>
              <article className="panel">
                <div className="d-flex justify-content-between">
                  <div className="post-meta">
                    <span className="avatar">{thread.post.author[0]}</span>
                    <span>{thread.post.author}</span>
                    {thread.post.authorRole === "admin" && (
                      <span className="badge-soft">מנהל</span>
                    )}
                    <span>{date(thread.post.createdAt)}</span>
                  </div>
                  {controls(thread.post)}
                </div>
                <h2 className="h4 mt-4" dir="auto">
                  {thread.post.title}
                </h2>
                {editForm(thread.post, false)}
                {thread.post.edited && <small className="muted">נערך</small>}
              </article>
              <h3 className="h6 mt-4">תגובות ({thread.replies.length})</h3>
              {thread.replies.map((r) => (
                <article
                  key={r.id}
                  className={"reply " + (r.parentReplyId ? "indented" : "")}
                >
                  <div className="d-flex justify-content-between">
                    <div className="post-meta">
                      <span className="avatar">{r.author[0]}</span>
                      <span>{r.author}</span>
                      {r.authorRole === "admin" && (
                        <span className="badge-soft">מנהל</span>
                      )}
                      <span>{date(r.createdAt)}</span>
                    </div>
                    {controls(r, true)}
                  </div>
                  {r.parentReplyId && (
                    <div className="small-text muted mt-2">
                      בתגובה ל־
                      {thread.replies.find((x) => x.id === r.parentReplyId)
                        ?.author || "תגובה קודמת"}
                    </div>
                  )}
                  {editForm(r, true)}
                  <div className="d-flex justify-content-between mt-2">
                    {!r.deleted && (
                      <button
                        className="btn btn-light btn-sm"
                        onClick={() => {
                          setReplyTo(r);
                          document.getElementById("reply-box")?.focus();
                        }}
                      >
                        <MessageCircle size={13} />
                        השב
                      </button>
                    )}
                    {r.edited && <small className="muted">נערך</small>}
                  </div>
                </article>
              ))}
              <form className="panel mt-4" onSubmit={submitReply}>
                <h3 className="h6">
                  {replyTo ? "תגובה ל־" + replyTo.author : "מצטרפים לשיחה"}
                </h3>
                {replyTo && (
                  <button
                    className="btn btn-light btn-sm mb-2"
                    type="button"
                    onClick={() => setReplyTo(null)}
                  >
                    ביטול תשובה לתגובה
                  </button>
                )}
                <textarea
                  className="form-control"
                  id="reply-box"
                  aria-label="התגובה שלך"
                  rows={4}
                  required
                  maxLength={5000}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="הידע שלך יכול לעזור למישהו אחר…"
                />
                <button className="btn btn-primary mt-3" disabled={sending}>
                  שליחת תגובה <Send size={15} />
                </button>
              </form>
            </>
          ) : !topicId ? (
            <div className="row g-3">
              {topics.map((t) => (
                <div className="col-md-6" key={t.id}>
                  <Link
                    className="forum-card h-100 m-0"
                    to={"/forum/topics/" + t.id}
                  >
                    <MessageCircle size={22} className="success-icon" />
                    <h3>{t.name}</h3>
                    <p>{t.description || "שאלות, תשובות ולמידה משותפת"}</p>
                    <span className="source-link">
                      כניסה לדיונים <ArrowLeft size={14} />
                    </span>
                  </Link>
                </div>
              ))}
            </div>
          ) : posts.length ? (
            posts.map((p) => (
              <Link
                key={p.id}
                className="forum-card"
                to={"/forum/posts/" + p.id}
              >
                <div className="post-meta">
                  <span className="avatar">{p.author[0]}</span>
                  {p.author}
                  <span>· {date(p.createdAt)}</span>
                </div>
                <h3 dir="auto">{p.title}</h3>
                <p>
                  {p.body.slice(0, 180)}
                  {p.body.length > 180 ? "…" : ""}
                </p>
                <span className="source-link">
                  לקריאת הדיון <ArrowLeft size={14} />
                </span>
              </Link>
            ))
          ) : (
            <Empty
              title="הדיון הראשון מתחיל איתך"
              text="שאלה, תובנה או משהו שלמדת — זה המקום לשתף."
            >
              <button
                className="btn btn-primary"
                onClick={() => setComposer(true)}
              >
                <Plus size={16} />
                כתיבת הודעה
              </button>
            </Empty>
          )}
        </div>
      </div>
    </div>
  );
}

// 6. ניהול — אותו מקור נתונים, עם הרשאות שרת אמיתיות במצב מחובר.
function AdminFrame({ children }) {
  const loc = useLocation();
  return (
    <div className="container-xl page">
      <div className="admin-layout">
        <aside className="admin-nav">
          <div className="nav-label">סביבת הניהול</div>
          {[
            ["/admin", "סקירה כללית", LayoutDashboard],
            ["/admin/courses", "ניהול קורסים", BookOpen],
            ["/admin/users", "משתמשים", Users],
            ["/admin/topics", "נושאי הפורום", MessageCircle],
            ["/forum", "לפורום הקהילה", ArrowLeft],
          ].map(([to, label, I]) => (
            <Link
              key={to}
              to={to}
              className={
                (
                  to === "/admin"
                    ? loc.pathname === to
                    : loc.pathname.startsWith(to)
                )
                  ? "active"
                  : ""
              }
            >
              <I size={17} />
              {label}
            </Link>
          ))}
        </aside>
        <div style={{ minWidth: 0 }}>{children}</div>
      </div>
    </div>
  );
}
function AdminDashboard() {
  const { courses, learning } = useApp(),
    [data, setData] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    request("/api/admin/dashboard")
      .then(setData)
      .catch((e) => setError(e.message));
  }, [courses, learning]);
  return (
    <AdminFrame>
      <div className="section-heading">
        <div>
          <span className="kicker">מבט על כל מה שקורה</span>
          <h1 className="page-title mt-2">סקירה כללית</h1>
          <p>הקורסים, הלומדים והקהילה שלך.</p>
        </div>
        <Link className="btn btn-primary" to="/admin/courses">
          <Plus size={16} />
          ניהול קורסים
        </Link>
      </div>
      {error && <div className="error-box">{error}</div>}
      {!data ? (
        <Loading />
      ) : (
        <>
          <div className="stats-grid">
            {[
              [data.users, "תלמידים רשומים", Users],
              [data.courses, "קורסים מפורסמים", BookOpen],
              [data.enrollments, "התחלות קורס", Play],
              [data.completed, "השלמות קורס", GraduationCap],
            ].map(([n, t, I]) => (
              <div className="stat" key={t}>
                <I size={21} />
                <strong>{n}</strong>
                <span>{t}</span>
              </div>
            ))}
          </div>
          <div className="row g-3">
            <div className="col-lg-7">
              <div className="panel h-100">
                <h2 className="h5 fw-bold">הלמידה בקורסים</h2>
                <p className="muted small-text">מספר הלומדים שהתחילו כל קורס</p>
                {data.byCourse.length ? (
                  data.byCourse.map((b) => (
                    <div className="chart-row" key={b._id}>
                      <span>
                        {courses.find((c) => c.id === b._id)?.title || b._id}
                      </span>
                      <div className="bar-track">
                        <div
                          className="bar-fill"
                          style={{
                            width:
                              Math.max(
                                3,
                                (b.started /
                                  Math.max(
                                    ...data.byCourse.map((x) => x.started),
                                  )) *
                                  100,
                              ) + "%",
                          }}
                        />
                      </div>
                      <strong>{b.started}</strong>
                    </div>
                  ))
                ) : (
                  <Empty
                    title="נתוני הלמידה יופיעו כאן"
                    text="הגרף יתעדכן כאשר תלמידים יתחילו ללמוד."
                  />
                )}
              </div>
            </div>
            <div className="col-lg-5">
              <div className="panel h-100">
                <h2 className="h5 fw-bold mb-4">במספרים</h2>
                <div className="d-flex justify-content-between py-3 border-bottom">
                  <span className="muted">שיעורים במערכת</span>
                  <strong>{data.lessons}</strong>
                </div>
                <div className="d-flex justify-content-between py-3 border-bottom">
                  <span className="muted">הודעות בקהילה</span>
                  <strong>{data.posts}</strong>
                </div>
                <div className="d-flex justify-content-between py-3">
                  <span className="muted">שיעור השלמת קורסים</span>
                  <strong>
                    {data.enrollments
                      ? Math.round((data.completed / data.enrollments) * 100)
                      : 0}
                    %
                  </strong>
                </div>
                <Link className="btn btn-light w-100 mt-3" to="/forum">
                  מעבר לקהילה <ArrowLeft size={15} />
                </Link>
              </div>
            </div>
          </div>
          <div className="panel mt-3">
            <h2 className="h5 fw-bold">הצטרפו לאחרונה</h2>
            {data.recent.length ? (
              data.recent.map((u) => (
                <div
                  className="d-flex justify-content-between border-bottom py-3"
                  key={u.id}
                >
                  <span>{u.name}</span>
                  <span className="muted small-text">{date(u.createdAt)}</span>
                </div>
              ))
            ) : (
              <p className="muted small-text mt-3 mb-0">
                משתמשים חדשים יוצגו כאן לאחר הרשמה לשרת המחובר.
              </p>
            )}
          </div>
        </>
      )}
    </AdminFrame>
  );
}
function AdminCourses() {
  const { courses, setCourses, notify } = useApp(),
    [all, setAll] = useState(courses),
    [query, setQuery] = useState(""),
    [error, setError] = useState(""),
    nav = useNavigate();
  useEffect(() => {
    request("/api/admin/courses")
      .then(setAll)
      .catch((e) => setError(e.message));
  }, [courses]);
  async function create() {
    try {
      let c;
      c = await request("/api/admin/courses", "POST");
      nav("/admin/courses/" + c.id);
    } catch (e) {
      setError(e.message);
    }
  }
  async function archive(c) {
    if (!confirm("להעביר את הקורס לארכיון? היסטוריית הלמידה תישמר.")) return;
    try {
      await request("/api/admin/courses/" + c.id, "DELETE");
      setAll((v) =>
        v.map((x) => (x.id === c.id ? { ...x, status: "archived" } : x)),
      );
      setCourses((v) => v.filter((x) => x.id !== c.id));

      notify("הקורס הועבר לארכיון");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <AdminFrame>
      <div className="section-heading">
        <div>
          <h1 className="page-title">ניהול קורסים</h1>
          <p>מהרעיון הראשון ועד השיעור האחרון.</p>
        </div>
        <button className="btn btn-primary" onClick={create}>
          <Plus size={17} />
          קורס חדש
        </button>
      </div>
      {error && <div className="error-box mb-3">{error}</div>}
      <div className="search-box mb-3">
        <Search size={18} />
        <input
          className="form-control"
          aria-label="חיפוש קורס לניהול"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="חיפוש קורס…"
        />
      </div>
      <div className="table-responsive">
        <table className="table mb-0">
          <thead>
            <tr>
              <th>שם הקורס</th>
              <th>שפה</th>
              <th>שיעורים</th>
              <th>מצב</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {all
              .filter((c) =>
                c.title.toLowerCase().includes(query.toLowerCase()),
              )
              .map((c) => (
                <tr key={c.id}>
                  <td>
                    <span className="table-title">{c.title}</span>
                    <div className="muted small-text">{c.category}</div>
                  </td>
                  <td>{c.language}</td>
                  <td>{c.lessons.length}</td>
                  <td>
                    <span
                      className={
                        "status-pill " + (c.status === "draft" ? "draft" : "")
                      }
                    >
                      {c.status === "published"
                        ? "מפורסם"
                        : c.status === "draft"
                          ? "טיוטה"
                          : "בארכיון"}
                    </span>
                  </td>
                  <td>
                    <div className="edit-tools">
                      <Link
                        className="icon-btn"
                        aria-label={"עריכת " + c.title}
                        to={"/admin/courses/" + c.id}
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        className="icon-btn"
                        aria-label={"ארכוב " + c.title}
                        onClick={() => archive(c)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </AdminFrame>
  );
}
function parseYoutube(value) {
  try {
    const u = new URL(value);
    if (
      !["youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be"].includes(
        u.hostname,
      )
    )
      return "";
    const id =
      u.hostname === "youtu.be"
        ? u.pathname.slice(1)
        : u.searchParams.get("v") ||
          u.pathname.match(/^\/(?:embed|shorts)\/([^/]+)/)?.[1];
    return /^[\w-]{11}$/.test(id || "") ? id : "";
  } catch {
    return /^[\w-]{11}$/.test(value || "") ? value : "";
  }
}
function CourseEditor() {
  const { id } = useParams(),
    { setCourses, notify } = useApp(),
    [c, setC] = useState(null),
    [error, setError] = useState(""),
    [busy, setBusy] = useState(false),
    [preview, setPreview] = useState(null);
  useEffect(() => {
    request("/api/admin/courses")
      .then((all) => setC(all.find((c) => c.id === id)))
      .catch((e) => setError(e.message));
  }, [id]);
  function field(k, v) {
    setC((c) => ({ ...c, [k]: v }));
  }
  function lesson(i, k, v) {
    setC((c) => ({
      ...c,
      lessons: c.lessons.map((l, j) => (j === i ? { ...l, [k]: v } : l)),
    }));
  }
  function move(i, dir) {
    const copy = [...c.lessons];
    [copy[i], copy[i + dir]] = [copy[i + dir], copy[i]];
    field("lessons", copy);
  }
  async function save(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const data = {
        ...c,
        lessons: c.lessons.map((l) => ({
          ...l,
          youtubeId: parseYoutube(l.youtubeId),
          duration: Number(l.duration),
        })),
      };
      if (
        data.lessons.some((l) => !l.youtubeId || !l.title.trim() || !l.duration)
      )
        throw Error("לכל שיעור דרושים כותרת, קישור YouTube תקין ומשך בשניות");
      if (
        c.status === "published" &&
        (!c.title.trim() || !c.description.trim() || !c.lessons.length)
      )
        throw Error("פרסום קורס דורש שם, תיאור ולפחות שיעור אחד");

      const saved = await request("/api/admin/courses/" + id, "PATCH", data);
      setC(saved);
      setCourses(await request("/api/catalog"));

      notify("הקורס נשמר" + "");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <AdminFrame>
      <div className="breadcrumb-row">
        <Link to="/admin/courses">ניהול קורסים</Link>
        <ChevronLeft size={13} />
        עריכת קורס
      </div>
      {error && (
        <div className="error-box mb-3" role="alert">
          {error}
        </div>
      )}
      {!c ? (
        <Loading />
      ) : (
        <form onSubmit={save}>
          <div className="section-heading">
            <div>
              <h1 className="page-title">עריכת קורס</h1>
              <p>הפרטים הקטנים יוצרים חוויית למידה טובה.</p>
            </div>
            <button className="btn btn-primary" disabled={busy}>
              {busy ? (
                <LoaderCircle className="spin" size={17} />
              ) : (
                <Check size={17} />
              )}
              שמירת הקורס
            </button>
          </div>
          <div className="panel">
            <div className="row g-3">
              {[
                ["title", "שם הקורס"],
                ["instructor", "יוצר התוכן"],
                ["mark", "סימון בכרטיס (למשל JS)"],
                ["prerequisites", "ידע מקדים"],
              ].map(([k, t]) => (
                <div className="col-md-6" key={k}>
                  <label className="form-label" htmlFor={k}>
                    {t}
                  </label>
                  <input
                    id={k}
                    className="form-control"
                    value={c[k] || ""}
                    onChange={(e) => field(k, e.target.value)}
                    required={k === "title"}
                  />
                </div>
              ))}
              <div className="col-12">
                <label className="form-label" htmlFor="description">
                  תיאור הקורס
                </label>
                <textarea
                  id="description"
                  className="form-control"
                  value={c.description}
                  rows={3}
                  onChange={(e) => field("description", e.target.value)}
                />
              </div>
              {[
                [
                  "category",
                  "תחום",
                  ["תכנות", "פיתוח אתרים", "נתונים", "אוטומציה ועסקים"],
                ],
                ["language", "שפת הסרטונים", ["עברית", "אנגלית"]],
                ["level", "רמה", ["מתחילים", "בינוני", "מתקדם"]],
              ].map(([k, t, opts]) => (
                <div className="col-md-4" key={k}>
                  <label className="form-label" htmlFor={k}>
                    {t}
                  </label>
                  <select
                    id={k}
                    className="form-select"
                    value={c[k]}
                    onChange={(e) => field(k, e.target.value)}
                  >
                    {opts.map((o) => (
                      <option key={o}>{o}</option>
                    ))}
                  </select>
                </div>
              ))}
              <div className="col-md-6">
                <label className="form-label" htmlFor="status">
                  מצב פרסום
                </label>
                <select
                  id="status"
                  className="form-select"
                  value={c.status}
                  onChange={(e) => field("status", e.target.value)}
                >
                  <option value="draft">טיוטה</option>
                  <option value="published">מפורסם</option>
                  <option value="archived">בארכיון</option>
                </select>
              </div>
              <div className="col-md-6">
                <label className="form-label" htmlFor="color">
                  צבע כרטיס הקורס
                </label>
                <input
                  id="color"
                  type="color"
                  className="form-control"
                  value={c.color || "#347a59"}
                  onChange={(e) => field("color", e.target.value)}
                  style={{ height: 49 }}
                />
              </div>
              <div className="col-12">
                <label className="form-label" htmlFor="sourceUrl">
                  קישור לרשימת ההשמעה המקורית
                </label>
                <input
                  id="sourceUrl"
                  dir="ltr"
                  className="form-control"
                  type="url"
                  value={c.sourceUrl || ""}
                  onChange={(e) => field("sourceUrl", e.target.value)}
                />
              </div>
            </div>
          </div>
          <div className="section-heading mt-4">
            <div>
              <h2 className="h4">השיעורים בקורס</h2>
              <p>השיעורים יוצגו לפי סדר זה. משך הסרטון נרשם בשניות.</p>
            </div>
            <button
              type="button"
              className="btn btn-light"
              onClick={() =>
                field("lessons", [
                  ...c.lessons,
                  {
                    id: uid(),
                    title: "",
                    youtubeId: "",
                    duration: 0,
                    active: true,
                  },
                ])
              }
            >
              <Plus size={17} />
              הוספת שיעור
            </button>
          </div>
          <div className="notice">
            שינוי סדר או הסרת שיעור משפיעים על מסלול הלמידה. החלפת סרטון בשיעור
            קיים יוצרת מזהה שיעור חדש בשרת כדי לא להעביר אליו השלמה ישנה.
          </div>
          {c.lessons.map((l, i) => (
            <div className="editor-lesson" key={l.id}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <strong className="small-text">שיעור {i + 1}</strong>
                <div className="edit-tools">
                  <button
                    className="icon-btn"
                    type="button"
                    disabled={i === 0}
                    aria-label="הזז למעלה"
                    onClick={() => move(i, -1)}
                  >
                    <ArrowUp size={15} />
                  </button>
                  <button
                    className="icon-btn"
                    type="button"
                    disabled={i === c.lessons.length - 1}
                    aria-label="הזז למטה"
                    onClick={() => move(i, 1)}
                  >
                    <ArrowDown size={15} />
                  </button>
                  <button
                    className="icon-btn"
                    type="button"
                    aria-label="הסר שיעור"
                    onClick={() => {
                      if (confirm("להסיר את השיעור מהקורס?"))
                        field(
                          "lessons",
                          c.lessons.filter((_, j) => j !== i),
                        );
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
              <label className="form-label" htmlFor={"lt-" + i}>
                כותרת
              </label>
              <input
                id={"lt-" + i}
                className="form-control mb-2"
                dir="auto"
                value={l.title}
                required
                onChange={(e) => lesson(i, "title", e.target.value)}
              />
              <div className="row g-2">
                <div className="col-md-8">
                  <label className="form-label" htmlFor={"url-" + i}>
                    קישור YouTube או מזהה סרטון
                  </label>
                  <input
                    id={"url-" + i}
                    className="form-control"
                    dir="ltr"
                    value={l.youtubeId}
                    required
                    onChange={(e) => lesson(i, "youtubeId", e.target.value)}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label" htmlFor={"duration-" + i}>
                    משך בשניות
                  </label>
                  <input
                    id={"duration-" + i}
                    type="number"
                    min="1"
                    max="86400"
                    className="form-control"
                    required
                    value={l.duration}
                    onChange={(e) => lesson(i, "duration", e.target.value)}
                  />
                </div>
              </div>
              <button
                type="button"
                className="btn btn-light btn-sm mt-3"
                disabled={!parseYoutube(l.youtubeId)}
                onClick={() => setPreview(parseYoutube(l.youtubeId))}
              >
                <Play size={13} />
                בדיקת הסרטון
              </button>
            </div>
          ))}
          <button className="btn btn-primary mt-4" disabled={busy}>
            שמירת כל השינויים
          </button>
        </form>
      )}
      {preview && (
        <VideoDialog videoId={preview} onClose={() => setPreview(null)} />
      )}
    </AdminFrame>
  );
}
function VideoDialog({ videoId, onClose }) {
  const ref = useRef(null);
  useEffect(() => {
    const previous = document.activeElement;
    ref.current?.focus();
    function key(e) {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        e.preventDefault();
        ref.current?.focus();
      }
    }
    document.addEventListener("keydown", key);
    return () => {
      document.removeEventListener("keydown", key);
      previous?.focus();
    };
  }, []);
  return (
    <div
      className="modal-surface"
      role="dialog"
      aria-modal="true"
      aria-label="בדיקת סרטון"
    >
      <div className="modal-card">
        <div className="dialog-head">
          <h3>תצוגה מקדימה</h3>
          <button
            ref={ref}
            className="icon-btn"
            onClick={onClose}
            aria-label="סגירה"
          >
            <X size={20} />
          </button>
        </div>
        <iframe
          title="תצוגה מקדימה של הסרטון"
          src={"https://www.youtube-nocookie.com/embed/" + videoId}
          style={{
            width: "100%",
            aspectRatio: "16/9",
            minHeight: 210,
            border: 0,
          }}
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
        />
        <p className="muted small-text mt-3">
          יש לוודא שהסרטון ניתן להטמעה ושמשך השיעור תואם לנגן.
        </p>
      </div>
    </div>
  );
}
function AdminTopics() {
  const { notify } = useApp(),
    [topics, setTopics] = useState([]),
    [name, setName] = useState(""),
    [description, setDescription] = useState(""),
    [editId, setEditId] = useState(null),
    [error, setError] = useState("");
  useEffect(() => {
    request("/api/admin/topics")
      .then(setTopics)
      .catch((e) => setError(e.message));
  }, []);
  async function save(e) {
    e.preventDefault();
    try {
      await request(
        "/api/admin/topics" + (editId ? "/" + editId : ""),
        editId ? "PATCH" : "POST",
        { name, description },
      );
      setTopics(await request("/api/admin/topics"));

      setName("");
      setDescription("");
      setEditId(null);
      notify("הנושא נשמר");
    } catch (e) {
      setError(e.message);
    }
  }
  async function archive(t) {
    if (!confirm("להעביר את הנושא לארכיון? השרשורים יוסתרו אך יישמרו.")) return;
    try {
      await request("/api/admin/topics/" + t.id, "DELETE");
      setTopics((v) =>
        v.map((x) => (x.id === t.id ? { ...x, archived: true } : x)),
      );

      notify("הנושא הועבר לארכיון");
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <AdminFrame>
      <h1 className="page-title">נושאי הפורום</h1>
      <p className="muted">מארגנים את השיחות, כדי שיהיה קל למצוא תשובות.</p>
      {error && <div className="error-box mb-3">{error}</div>}
      <form className="panel mb-4" onSubmit={save}>
        <h2 className="h5">{editId ? "עריכת נושא" : "נושא חדש"}</h2>
        <div className="row g-3 mt-1">
          <div className="col-md-5">
            <label className="form-label" htmlFor="topic-name">
              שם הנושא
            </label>
            <input
              id="topic-name"
              required
              maxLength={100}
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="col-md-7">
            <label className="form-label" htmlFor="topic-desc">
              תיאור קצר
            </label>
            <input
              id="topic-desc"
              maxLength={300}
              className="form-control"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <div className="d-flex gap-2 mt-3">
          <button className="btn btn-primary btn-sm">
            {editId ? "שמירת שינויים" : "הוספת נושא"}
          </button>
          {editId && (
            <button
              className="btn btn-light btn-sm"
              type="button"
              onClick={() => {
                setEditId(null);
                setName("");
                setDescription("");
              }}
            >
              ביטול
            </button>
          )}
        </div>
      </form>
      <div className="table-responsive">
        <table className="table mb-0">
          <thead>
            <tr>
              <th>שם</th>
              <th>מצב</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {topics.map((t) => (
              <tr key={t.id}>
                <td className="table-title">{t.name}</td>
                <td>
                  <span className="status-pill">
                    {t.archived ? "בארכיון" : "פעיל"}
                  </span>
                </td>
                <td>
                  <button
                    className="icon-btn"
                    aria-label="עריכת נושא"
                    onClick={() => {
                      setEditId(t.id);
                      setName(t.name);
                      setDescription(t.description || "");
                      window.scrollTo({ top: 0 });
                    }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    className="icon-btn"
                    aria-label="ארכוב נושא"
                    disabled={t.id === "general" || t.archived}
                    onClick={() => archive(t)}
                  >
                    <Trash2 size={15} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminFrame>
  );
}
function AdminUsers() {
  const { courses, notify } = useApp(),
    [users, setUsers] = useState([]),
    [error, setError] = useState(""),
    [query, setQuery] = useState(""),
    [detail, setDetail] = useState(null);
  useEffect(() => {
    request("/api/admin/users")
      .then(setUsers)
      .catch((e) => setError(e.message));
  }, []);
  async function toggle(u) {
    try {
      await request("/api/admin/users/" + u.id, "PATCH", {
        isActive: !u.isActive,
      });
      setUsers((v) =>
        v.map((x) => (x.id === u.id ? { ...x, isActive: !x.isActive } : x)),
      );
      notify("מצב המשתמש עודכן");
    } catch (e) {
      setError(e.message);
    }
  }
  async function inspect(u) {
    try {
      setDetail({ user: u, ...(await request("/api/admin/users/" + u.id)) });
    } catch (e) {
      setError(e.message);
    }
  }
  return (
    <AdminFrame>
      <h1 className="page-title">משתמשים</h1>
      <p className="muted">מכירים את הלומדים ואת הדרך שלהם.</p>
      {error && <div className="error-box">{error}</div>}
      {
        <>
          <div className="search-box mb-3">
            <Search size={17} />
            <input
              className="form-control"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="חיפוש לפי שם או דוא״ל"
              aria-label="חיפוש משתמשים"
            />
          </div>
          <div className="table-responsive">
            <table className="table mb-0">
              <thead>
                <tr>
                  <th>שם ודוא״ל</th>
                  <th>הצטרפות</th>
                  <th>מצב</th>
                  <th>פעולות</th>
                </tr>
              </thead>
              <tbody>
                {users
                  .filter((u) =>
                    (u.name + " " + u.email)
                      .toLowerCase()
                      .includes(query.toLowerCase()),
                  )
                  .map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.name}</strong>
                        <div className="muted small-text" dir="ltr">
                          {u.email}
                        </div>
                      </td>
                      <td>{date(u.createdAt)}</td>
                      <td>
                        {u.isActive ? "פעיל" : "חסום"}
                        {u.role === "admin" && " · מנהל"}
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-light btn-sm"
                            onClick={() => inspect(u)}
                          >
                            התקדמות
                          </button>
                          {u.role !== "admin" && (
                            <button
                              className="btn btn-light btn-sm"
                              onClick={() => toggle(u)}
                            >
                              {u.isActive ? "חסימה" : "שחרור"}
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </>
      }
      {detail && (
        <div className="panel mt-4">
          <div className="d-flex justify-content-between">
            <h2 className="h5">הלמידה של {detail.user.name}</h2>
            <button
              className="icon-btn"
              onClick={() => setDetail(null)}
              aria-label="סגירה"
            >
              <X size={18} />
            </button>
          </div>
          {detail.enrollments.length ? (
            detail.enrollments.map((e) => {
              const c = courses.find((c) => c.id === e.courseId);
              return (
                <div className="my-3" key={e.courseId}>
                  <strong className="small-text">
                    {c?.title || e.courseId}
                  </strong>
                  <ProgressBar value={c ? completion(c, detail) : 0} />
                </div>
              );
            })
          ) : (
            <p className="muted small-text mt-3">המשתמש טרם התחיל קורס.</p>
          )}
        </div>
      )}
    </AdminFrame>
  );
}
function About() {
  const { courses } = useApp();
  return (
    <div className="container-xl page" style={{ maxWidth: 900 }}>
      <span className="kicker">ידע נגיש, דרך ברורה</span>
      <h1 className="page-title mt-2">על לימוד ועל התוכן</h1>
      <div className="panel mt-4">
        <h2 className="h4">מקום לצמוח בו</h2>
        <p className="muted" style={{ lineHeight: 1.9 }}>
          לימוד מרכזת סדרות הדרכה פתוחות בנושאי תכנות, נתונים וכלים לעסקים.
          הקורסים חינמיים, והשיעורים מסודרים לפי רשימות ההשמעה של היוצרים. מטרת
          האתר היא לתת ללמידה מסגרת נוחה: מעקב התקדמות, סדר וקהילה.
        </p>
        <p className="muted small-text">
          האתר הוא פרויקט לימודי. הסרטונים אינם בבעלות האתר ואינם מופקים על ידו.
          ההטמעה נעשית באמצעות נגן YouTube הרשמי, בהתאם לזמינות שקבעו היוצרים.
          תוכן חיצוני עשוי להשתנות או להפסיק להיות זמין.
        </p>
        <h2 className="h5 mt-4">חשוב לדעת</h2>
        <ul className="help-list">
          <li>
            כל 12 הסדרות שנבחרו הן בעברית. כותרת באנגלית אינה בהכרח שפת הדיבור.
          </li>
          <li>
            CRM מתמקד ב־Fireberry ו־ERP במערכת Priority; אין מדובר בקורס מקיף
            בכל המוצרים בתחום.
          </li>
          <li>
            חלק מהסדרות ותיקות. לדוגמה, קורס React כולל Create React App וממשקי
            ספריות ישנים.
          </li>
          <li>
            מעקב הצפייה הוא כלי עזר ללמידה, ולא אישור מקצועי או הוכחת קשב.
          </li>
          <li>דירוגים באתר הם משוב של הלומדים באתר בלבד.</li>
          <li>
            טעינת נגן YouTube מתחברת לשירות חיצוני. ההתקדמות ותוכן הפורום נשמרים
            בחשבון המשתמש במסד הנתונים.
          </li>
        </ul>
      </div>
      <h2 className="h4 mt-4 mb-3">היוצרים ורשימות ההשמעה</h2>
      <div className="table-responsive">
        <table className="table mb-0">
          <thead>
            <tr>
              <th>קורס</th>
              <th>יוצר / מקור</th>
              <th>מקור</th>
            </tr>
          </thead>
          <tbody>
            {courses
              .filter((c) => c.sourceUrl)
              .map((c) => (
                <tr key={c.id}>
                  <td>{c.title}</td>
                  <td>{c.instructor}</td>
                  <td>
                    <a
                      className="source-link"
                      href={c.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      YouTube <ExternalLink size={13} />
                    </a>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      <p className="muted small-text mt-3">
        רשימות ההשמעה נבדקו ב־26.09.2026. זמינות ההטמעה כפופה לשינויים
        ב־YouTube.
      </p>
    </div>
  );
}
function ScrollReset() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}
function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollReset />
        <Header />
        <main id="main">
          <Routes>
            <Route path="/" element={<Catalog />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/register" element={<AuthPage register />} />
            <Route
              path="/learn"
              element={
                <Guard>
                  <Catalog personal />
                </Guard>
              }
            />
            <Route
              path="/courses/:id"
              element={
                <Guard>
                  <CoursePage />
                </Guard>
              }
            />
            <Route
              path="/courses/:id/lessons/:lessonId"
              element={
                <Guard>
                  <WatchPage />
                </Guard>
              }
            />
            <Route
              path="/profile"
              element={
                <Guard>
                  <Profile />
                </Guard>
              }
            />
            <Route
              path="/forum"
              element={
                <Guard>
                  <Forum />
                </Guard>
              }
            />
            <Route
              path="/forum/topics/:topicId"
              element={
                <Guard>
                  <Forum />
                </Guard>
              }
            />
            <Route
              path="/forum/posts/:postId"
              element={
                <Guard>
                  <Forum />
                </Guard>
              }
            />
            <Route
              path="/admin"
              element={
                <Guard admin>
                  <AdminDashboard />
                </Guard>
              }
            />
            <Route
              path="/admin/courses"
              element={
                <Guard admin>
                  <AdminCourses />
                </Guard>
              }
            />
            <Route
              path="/admin/courses/:id"
              element={
                <Guard admin>
                  <CourseEditor />
                </Guard>
              }
            />
            <Route
              path="/admin/users"
              element={
                <Guard admin>
                  <AdminUsers />
                </Guard>
              }
            />
            <Route
              path="/admin/topics"
              element={
                <Guard admin>
                  <AdminTopics />
                </Guard>
              }
            />
            <Route path="/about" element={<About />} />
            <Route
              path="*"
              element={
                <div className="container-xl page">
                  <Empty title="העמוד לא נמצא">
                    <Link className="btn btn-primary" to="/">
                      בחזרה לקורסים
                    </Link>
                  </Empty>
                </div>
              }
            />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </AppProvider>
  );
}
createRoot(document.getElementById("root")).render(<App />);
