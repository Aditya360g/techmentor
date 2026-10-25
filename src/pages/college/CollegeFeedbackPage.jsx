// src/pages/college/CollegeFeedbackPage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDownWideNarrow,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  Clock3,
  Download,
  Eye,
  Filter,
  GraduationCap,
  LayoutGrid,
  List,
  MessageCircle,
  MessageSquare,
  MoreHorizontal,
  RefreshCw,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Star,
  ThumbsDown,
  ThumbsUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "techmentor_college_feedback_v1";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const STATUSES = ["New", "In Review", "Responded", "Resolved"];

const CATEGORIES = [
  "Course Content",
  "Trainer",
  "Live Classes",
  "Assignments",
  "Platform",
  "Placement Support",
  "Other",
];

const STATUS_STYLES = {
  New: {
    badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-300",
    Icon: MessageCircle,
  },
  "In Review": {
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    dot: "bg-amber-300",
    Icon: Clock3,
  },
  Responded: {
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    dot: "bg-violet-300",
    Icon: MessageSquare,
  },
  Resolved: {
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    dot: "bg-emerald-300",
    Icon: CheckCircle2,
  },
};

const EMPTY_REPLY = "";

const daysAgo = (days, hours = 10) => {
  const date = new Date();
  date.setDate(date.getDate() - days);
  date.setHours(hours, 30, 0, 0);
  return date.toISOString();
};

const formatDate = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "Date unavailable";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date unavailable";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "ST";

const getSentiment = (rating) => {
  if (rating >= 4) return "Positive";
  if (rating === 3) return "Neutral";
  return "Negative";
};

const SENTIMENT_STYLES = {
  Positive: "border-emerald-400/15 bg-emerald-400/[0.07] text-emerald-200",
  Neutral: "border-amber-400/15 bg-amber-400/[0.07] text-amber-200",
  Negative: "border-rose-400/15 bg-rose-400/[0.07] text-rose-200",
};

const SEED_FEEDBACK = [
  {
    id: "FDB-1041",
    student: "Aarav Sharma",
    email: "aarav@example.com",
    course: "Python for Beginners",
    category: "Trainer",
    rating: 5,
    title: "Excellent teaching approach",
    message:
      "The trainer explains every concept clearly and uses practical examples. The live coding exercises make it easier to understand Python. I would appreciate a few more real-world projects.",
    status: "New",
    createdAt: daysAgo(0, 10),
    trainer: "Mayank Sharma",
    helpful: 18,
    response: "",
    priority: "High",
  },
  {
    id: "FDB-1042",
    student: "Priya Verma",
    email: "priya@example.com",
    course: "Java & DSA",
    category: "Course Content",
    rating: 4,
    title: "Good content, need more practice",
    message:
      "The topics are well structured and the explanations are easy to follow. More practice questions for trees, graphs and dynamic programming would make the course even better.",
    status: "In Review",
    createdAt: daysAgo(1, 14),
    trainer: "Rahul Mehta",
    helpful: 12,
    response: "",
    priority: "Normal",
  },
  {
    id: "FDB-1043",
    student: "Rohan Gupta",
    email: "rohan@example.com",
    course: "Full Stack Development",
    category: "Platform",
    rating: 2,
    title: "Video playback issue",
    message:
      "Sometimes the recorded session freezes when I try to resume from where I left off. It would be helpful to remember the last playback position and load the video faster.",
    status: "New",
    createdAt: daysAgo(1, 9),
    trainer: "Neha Gupta",
    helpful: 4,
    response: "",
    priority: "High",
  },
  {
    id: "FDB-1044",
    student: "Sneha Singh",
    email: "sneha@example.com",
    course: "Data Analytics",
    category: "Assignments",
    rating: 5,
    title: "Assignments are very practical",
    message:
      "The assignments use realistic datasets and helped me practise cleaning, analysing and visualising data. Please continue adding project-oriented assignments.",
    status: "Responded",
    createdAt: daysAgo(2, 12),
    trainer: "Ananya Rao",
    helpful: 21,
    response:
      "Thank you for your thoughtful feedback! We're glad the practical datasets are helping you. We are planning additional project-oriented exercises for upcoming modules.",
    priority: "Normal",
  },
  {
    id: "FDB-1045",
    student: "Karan Patel",
    email: "karan@example.com",
    course: "Frontend Development",
    category: "Live Classes",
    rating: 3,
    title: "Would like more doubt sessions",
    message:
      "The live classes are useful, but sometimes there is not enough time at the end to discuss individual doubts. A separate weekly doubt-clearing session could help.",
    status: "In Review",
    createdAt: daysAgo(3, 16),
    trainer: "Mayank Sharma",
    helpful: 9,
    response: "",
    priority: "Normal",
  },
  {
    id: "FDB-1046",
    student: "Ananya Joshi",
    email: "ananya@example.com",
    course: "AI & Machine Learning",
    category: "Placement Support",
    rating: 4,
    title: "More mock interviews please",
    message:
      "The learning resources are good. I would like more technical mock interviews and resume review sessions before campus placement drives.",
    status: "Resolved",
    createdAt: daysAgo(5, 11),
    trainer: "Vikram Joshi",
    helpful: 15,
    response:
      "Thank you for suggesting this. Your feedback has been shared with the placement support team. Additional mock interview sessions are being planned.",
    priority: "Normal",
  },
  {
    id: "FDB-1047",
    student: "Rahul Jain",
    email: "rahul@example.com",
    course: "Java & DSA",
    category: "Trainer",
    rating: 1,
    title: "Need clearer explanations",
    message:
      "Some advanced topics are covered too quickly. It would help to explain the logic step by step before moving to the final solution, especially for recursion and dynamic programming.",
    status: "New",
    createdAt: daysAgo(6, 9),
    trainer: "Rahul Mehta",
    helpful: 3,
    response: "",
    priority: "High",
  },
  {
    id: "FDB-1048",
    student: "Meera Kapoor",
    email: "meera@example.com",
    course: "Python for Beginners",
    category: "Course Content",
    rating: 5,
    title: "Great learning experience",
    message:
      "The course has a good balance of theory and practical coding. The examples progress naturally from beginner topics to intermediate concepts.",
    status: "Resolved",
    createdAt: daysAgo(8, 13),
    trainer: "Mayank Sharma",
    helpful: 26,
    response:
      "Thank you for sharing your experience. We're happy the course structure is working well for you!",
    priority: "Low",
  },
  {
    id: "FDB-1049",
    student: "Vivek Kumar",
    email: "vivek@example.com",
    course: "Full Stack Development",
    category: "Platform",
    rating: 2,
    title: "Assignment submission needs improvement",
    message:
      "The assignment submission flow is a little confusing. A clearer submission confirmation and visible submission history would make it easier to track completed work.",
    status: "In Review",
    createdAt: daysAgo(9, 15),
    trainer: "Neha Gupta",
    helpful: 7,
    response: "",
    priority: "High",
  },
];

function loadFeedback() {
  if (typeof window === "undefined") return SEED_FEEDBACK;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load feedback:", error);
  }

  return SEED_FEEDBACK;
}

/* -------------------------------------------------------------------------- */
/*                              REUSABLE COMPONENTS                           */
/* -------------------------------------------------------------------------- */

function StarRating({ rating = 0, size = 14, showValue = false }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="inline-flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
            className={cx(
              "shrink-0",
              star <= rating
                ? "fill-amber-300 text-amber-300"
                : "fill-transparent text-slate-700"
            )}
          />
        ))}
      </span>

      {showValue && (
        <span className="text-xs font-semibold tabular-nums text-slate-200">
          {Number(rating).toFixed(1)}
        </span>
      )}
    </span>
  );
}

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.New;
  const Icon = style.Icon;

  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        style.badge
      )}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function SentimentBadge({ rating }) {
  const sentiment = getSentiment(rating);

  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium",
        SENTIMENT_STYLES[sentiment]
      )}
    >
      {sentiment === "Positive" ? (
        <ThumbsUp size={11} />
      ) : sentiment === "Negative" ? (
        <ThumbsDown size={11} />
      ) : (
        <Activity size={11} />
      )}
      {sentiment}
    </span>
  );
}

function CustomDropdown({
  value,
  options,
  onChange,
  icon: Icon,
  width = "w-40",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className={cx("relative shrink-0", width)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={cx(
          "group flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
          open
            ? "border-cyan-300/40 bg-[#12263c] shadow-[0_0_0_3px_rgba(103,232,249,0.05)]"
            : "border-white/[0.09] bg-[#081525] hover:border-cyan-300/25 hover:bg-[#102036]"
        )}
      >
        {Icon && (
          <Icon
            size={15}
            className={cx(
              "shrink-0 transition-colors",
              open ? "text-cyan-200" : "text-slate-500 group-hover:text-cyan-200"
            )}
          />
        )}

        <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-200">
          {selected?.label || value}
        </span>

        <ChevronDown
          size={14}
          className={cx(
            "shrink-0 text-slate-500 transition-transform duration-200",
            open && "rotate-180 text-cyan-200"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 7, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.985 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[calc(100%+8px)] z-[100] w-full min-w-[190px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.5)]"
          >
            <div className="max-h-64 overflow-y-auto">
              {options.map((option) => {
                const active = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    className={cx(
                      "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition",
                      active
                        ? "bg-cyan-300/10 text-cyan-100"
                        : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                    )}
                  >
                    <span
                      className={cx(
                        "h-1.5 w-1.5 shrink-0 rounded-full",
                        active ? "bg-cyan-300" : "bg-slate-600"
                      )}
                    />
                    <span className="min-w-0 flex-1">{option.label}</span>
                    {active && <Check size={14} className="text-cyan-200" />}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function StatCard({ title, value, caption, icon: Icon, tone, progress }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c192b] p-4 sm:p-5"
    >
      <div
        className={cx(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl opacity-[0.13]",
          tone
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{title}</p>

          <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
            {value}
          </p>

          <p className="mt-2 text-[11px] leading-5 text-slate-500">{caption}</p>
        </div>

        <div
          className={cx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06]",
            tone
          )}
        >
          <Icon size={18} className="text-cyan-100" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.65 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300"
          />
        </div>
      )}
    </motion.div>
  );
}

function ModalShell({
  title,
  subtitle,
  icon: Icon,
  onClose,
  children,
  wide = false,
}) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);

    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="feedback-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#020813]/80 p-3 backdrop-blur-sm sm:p-6"
      >
        <motion.div
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.985 }}
          transition={{ duration: 0.2 }}
          className={cx(
            "my-auto w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0b1728] shadow-[0_30px_100px_rgba(0,0,0,0.5)]",
            wide ? "max-w-3xl" : "max-w-xl"
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08]">
                <Icon size={19} className="text-cyan-200" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">{subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          {children}
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* -------------------------------------------------------------------------- */
/*                              FEEDBACK DETAILS                              */
/* -------------------------------------------------------------------------- */

function FeedbackDetailsModal({
  feedback,
  onClose,
  onStatusChange,
  onReply,
}) {
  const [reply, setReply] = useState(feedback?.response || "");
  const [error, setError] = useState("");

  if (!feedback) return null;

  const handleReply = (event) => {
    event.preventDefault();

    if (!reply.trim()) {
      setError("Please write a reply before saving.");
      return;
    }

    onReply(feedback.id, reply.trim());
  };

  return (
    <ModalShell
      title="Feedback details"
      subtitle={`Feedback reference · ${feedback.id}`}
      icon={MessageSquare}
      onClose={onClose}
      wide
    >
      <div className="max-h-[72vh] space-y-5 overflow-y-auto p-5 sm:p-6">
        {/* Feedback header */}
        <div className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-[#12334b] via-[#10253b] to-[#0b1728] p-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-cyan-300/[0.09] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-sm font-bold text-cyan-100">
                {getInitials(feedback.student)}
              </div>

              <div className="min-w-0">
                <p className="text-sm font-semibold text-white">
                  {feedback.student}
                </p>

                <p className="mt-1 break-all text-xs text-slate-400">
                  {feedback.email || "No email available"}
                </p>

                <p className="mt-2 text-[10px] text-slate-500">
                  Submitted {formatDateTime(feedback.createdAt)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={feedback.status} />
              <SentimentBadge rating={feedback.rating} />
            </div>
          </div>

          <div className="relative mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-4">
            <div>
              <p className="text-[10px] text-slate-400">Student rating</p>
              <div className="mt-2">
                <StarRating rating={feedback.rating} size={17} showValue />
              </div>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Feedback category</p>
              <p className="mt-2 text-xs font-medium text-slate-200">
                {feedback.category}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Course</p>
              <p className="mt-2 text-xs font-medium text-slate-200">
                {feedback.course}
              </p>
            </div>
          </div>
        </div>

        {/* Feedback message */}
        <section className="rounded-2xl border border-white/[0.07] bg-[#081323] p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-white">
              {feedback.title}
            </h3>

            <span className="rounded-lg border border-white/[0.08] bg-white/[0.025] px-2.5 py-1 text-[10px] text-slate-400">
              {feedback.id}
            </span>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-300">
            {feedback.message}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.06] pt-4 text-[11px] text-slate-500">
            {feedback.trainer && (
              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={13} />
                Trainer: {feedback.trainer}
              </span>
            )}

            <span className="inline-flex items-center gap-1.5">
              <ThumbsUp size={13} />
              {feedback.helpful || 0} helpful votes
            </span>
          </div>
        </section>

        {/* Reply workflow */}
        <form
          onSubmit={handleReply}
          className="rounded-2xl border border-cyan-300/10 bg-[#0a1829] p-4 sm:p-5"
        >
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08]">
              <Send size={16} className="text-cyan-200" />
            </div>

            <div>
              <h3 className="text-sm font-semibold text-white">
                Reply to student
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-400">
                Save an internal response for this feedback record.
              </p>
            </div>
          </div>

          <textarea
            rows={4}
            value={reply}
            onChange={(event) => {
              setReply(event.target.value);
              setError("");
            }}
            placeholder="Write a helpful, professional response..."
            className="w-full resize-y rounded-xl border border-white/[0.09] bg-[#071323] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-300/[0.06]"
          />

          {error && (
            <p className="mt-2 flex items-center gap-1.5 text-xs text-rose-300">
              <CircleAlert size={13} />
              {error}
            </p>
          )}

          <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <span className="text-[10px] text-slate-500">
              {reply.length} characters
            </span>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-[#071323] transition hover:bg-cyan-200"
            >
              <Send size={14} />
              Save reply
            </button>
          </div>
        </form>

        {/* Existing response */}
        {feedback.response && (
          <section className="rounded-2xl border border-violet-300/15 bg-violet-300/[0.04] p-4 sm:p-5">
            <div className="flex items-center gap-2">
              <MessageCircle size={15} className="text-violet-200" />
              <h3 className="text-xs font-semibold text-violet-100">
                Saved response
              </h3>
            </div>

            <p className="mt-3 whitespace-pre-wrap text-xs leading-6 text-slate-300">
              {feedback.response}
            </p>
          </section>
        )}

        {/* Status actions */}
        <section className="border-t border-white/[0.07] pt-4">
          <h3 className="mb-3 text-xs font-semibold text-slate-300">
            Update feedback status
          </h3>

          <div className="flex flex-wrap gap-2">
            {STATUSES.filter((status) => status !== feedback.status).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(feedback.id, status)}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition",
                    status === "Resolved"
                      ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200 hover:bg-emerald-400/10"
                      : status === "In Review"
                        ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-200 hover:bg-amber-400/10"
                        : status === "Responded"
                          ? "border-violet-400/20 bg-violet-400/[0.06] text-violet-200 hover:bg-violet-400/10"
                          : "border-cyan-300/20 bg-cyan-300/[0.06] text-cyan-200 hover:bg-cyan-300/10"
                  )}
                >
                  {status === "Resolved" ? (
                    <CheckCircle2 size={14} />
                  ) : status === "In Review" ? (
                    <Clock3 size={14} />
                  ) : status === "Responded" ? (
                    <MessageSquare size={14} />
                  ) : (
                    <RefreshCw size={14} />
                  )}
                  Mark {status.toLowerCase()}
                </button>
              )
            )}
          </div>
        </section>
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function CollegeFeedbackPage() {
  const [feedbackItems, setFeedbackItems] = useState(loadFeedback);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("all");
  const [sentimentFilter, setSentimentFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState("grid");
  const [selectedId, setSelectedId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(feedbackItems)
      );
    } catch (error) {
      console.error("Unable to save feedback:", error);
    }
  }, [feedbackItems]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  const selectedFeedback = useMemo(
    () => feedbackItems.find((item) => item.id === selectedId) || null,
    [feedbackItems, selectedId]
  );

  const updateStatus = (id, status) => {
    setFeedbackItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          }
          : item
      )
    );

    setActiveMenu(null);

    const messages = {
      New: "Feedback moved to new.",
      "In Review": "Feedback moved to in review.",
      Responded: "Feedback marked as responded.",
      Resolved: "Feedback marked as resolved.",
    };

    notify(messages[status] || "Feedback status updated.");
  };

  const saveReply = (id, response) => {
    setFeedbackItems((previous) =>
      previous.map((item) =>
        item.id === id
          ? {
            ...item,
            response,
            status: item.status === "Resolved" ? "Resolved" : "Responded",
            updatedAt: new Date().toISOString(),
          }
          : item
      )
    );

    setSelectedId(null);
    notify("Reply saved successfully.");
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setRatingFilter("all");
    setSentimentFilter("all");
    setSortBy("newest");
  };

  const hasFilters =
    Boolean(search.trim()) ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    ratingFilter !== "all" ||
    sentimentFilter !== "all" ||
    sortBy !== "newest";

  const filteredFeedback = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = feedbackItems.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) {
        return false;
      }

      if (categoryFilter !== "all" && item.category !== categoryFilter) {
        return false;
      }

      if (ratingFilter !== "all" && item.rating !== Number(ratingFilter)) {
        return false;
      }

      if (
        sentimentFilter !== "all" &&
        getSentiment(item.rating) !== sentimentFilter
      ) {
        return false;
      }

      if (query) {
        const searchable = [
          item.id,
          item.student,
          item.email,
          item.course,
          item.category,
          item.title,
          item.message,
          item.trainer,
          item.status,
        ]
          .join(" ")
          .toLowerCase();

        if (!searchable.includes(query)) return false;
      }

      return true;
    });

    return result.sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }

      if (sortBy === "highest") return b.rating - a.rating;
      if (sortBy === "lowest") return a.rating - b.rating;

      if (sortBy === "unresolved") {
        const aResolved = a.status === "Resolved" ? 1 : 0;
        const bResolved = b.status === "Resolved" ? 1 : 0;

        if (aResolved !== bResolved) return aResolved - bResolved;
      }

      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [
    feedbackItems,
    search,
    statusFilter,
    categoryFilter,
    ratingFilter,
    sentimentFilter,
    sortBy,
  ]);

  const stats = useMemo(() => {
    const total = feedbackItems.length;

    const avg =
      total > 0
        ? feedbackItems.reduce(
          (sum, item) => sum + (Number(item.rating) || 0),
          0
        ) / total
        : 0;

    const unresolved = feedbackItems.filter(
      (item) => item.status !== "Resolved"
    ).length;

    const positive = feedbackItems.filter((item) => item.rating >= 4).length;

    const resolved = feedbackItems.filter(
      (item) => item.status === "Resolved"
    ).length;

    const positiveRate = total ? Math.round((positive / total) * 100) : 0;

    return {
      total,
      average: avg.toFixed(1),
      unresolved,
      resolved,
      positiveRate,
      positive,
    };
  }, [feedbackItems]);

  const ratingDistribution = useMemo(
    () =>
      [5, 4, 3, 2, 1].map((rating) => ({
        rating,
        count: feedbackItems.filter((item) => item.rating === rating).length,
      })),
    [feedbackItems]
  );

  const exportCsv = () => {
    const headers = [
      "Feedback ID",
      "Student",
      "Email",
      "Course",
      "Category",
      "Rating",
      "Sentiment",
      "Title",
      "Message",
      "Status",
      "Trainer",
      "Helpful Votes",
      "Response",
      "Created At",
    ];

    const rows = filteredFeedback.map((item) => [
      item.id,
      item.student,
      item.email,
      item.course,
      item.category,
      item.rating,
      getSentiment(item.rating),
      item.title,
      item.message,
      item.status,
      item.trainer,
      item.helpful,
      item.response,
      item.createdAt,
    ]);

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "college-feedback.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    notify(`${filteredFeedback.length} feedback records exported.`);
  };

  const menuAction = (item, action) => {
    setActiveMenu(null);

    if (action === "view") {
      setSelectedId(item.id);
      return;
    }

    if (action === "review") updateStatus(item.id, "In Review");
    if (action === "responded") updateStatus(item.id, "Responded");
    if (action === "resolve") updateStatus(item.id, "Resolved");
    if (action === "reopen") updateStatus(item.id, "New");
  };

  return (
    <div className="min-h-full min-w-0 space-y-6 bg-[#071323] p-4 text-slate-100 sm:p-6 xl:p-7">
      {/* Page heading */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.28 }}
        className="flex flex-col justify-between gap-5 xl:flex-row xl:items-end"
      >
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2 text-[11px] font-medium text-slate-500">
            <span>College Portal</span>
            <ChevronRight size={12} />
            <span className="text-cyan-300">Feedback</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/15 to-sky-400/[0.04] sm:flex">
              <MessageSquare size={23} className="text-cyan-200" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
                  Feedback & Reviews
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-2 py-1 text-[10px] font-semibold text-cyan-200">
                  <Activity size={11} />
                  Feedback hub
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Understand student experiences, review ratings and manage
                responses across courses, trainers and learning services.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-[#0c192b] px-3.5 py-3 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/25 hover:bg-[#102036] hover:text-white"
          >
            <Download size={15} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("New");
              setCategoryFilter("all");
              setRatingFilter("all");
              setSentimentFilter("all");
              setSearch("");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-[#071323] shadow-[0_5px_18px_rgba(34,211,238,0.1)] transition hover:bg-cyan-200"
          >
            <MessageCircle size={15} />
            Review new feedback
          </button>
        </div>
      </motion.header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total feedback"
          value={stats.total}
          caption="Student reviews in this workspace"
          icon={MessageSquare}
          tone="bg-cyan-400/15"
        />

        <StatCard
          title="Average rating"
          value={`${stats.average}/5`}
          caption="Overall recorded student rating"
          icon={Star}
          tone="bg-amber-400/15"
          progress={(Number(stats.average) / 5) * 100}
        />

        <StatCard
          title="Needs attention"
          value={stats.unresolved}
          caption="Feedback not yet resolved"
          icon={Clock3}
          tone="bg-sky-400/15"
        />

        <StatCard
          title="Positive reviews"
          value={`${stats.positiveRate}%`}
          caption={`${stats.positive} reviews rated 4 or 5`}
          icon={ThumbsUp}
          tone="bg-emerald-400/15"
          progress={stats.positiveRate}
        />
      </section>

      {/* Insights section */}
      <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_320px]">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-300/[0.13] bg-gradient-to-r from-[#103047] via-[#10253b] to-[#0b192a] p-4 sm:p-5">
          <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.07] blur-3xl" />

          <div className="relative flex h-full flex-col justify-between gap-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.08]">
                <Sparkles size={18} className="text-cyan-200" />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">
                  Turn student feedback into action
                </h2>

                <p className="mt-1 max-w-xl text-xs leading-5 text-slate-300/75">
                  Prioritise low-rated experiences, respond to student concerns
                  and identify improvements that can help every learner.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setRatingFilter("1");
                  setStatusFilter("all");
                  setCategoryFilter("all");
                  setSentimentFilter("all");
                  setSearch("");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-300/20 bg-rose-300/[0.06] px-3.5 py-2.5 text-xs font-semibold text-rose-100 transition hover:bg-rose-300/[0.1]"
              >
                <Star size={13} />
                Review 1-star feedback
              </button>

              <button
                type="button"
                onClick={() => {
                  setStatusFilter("all");
                  setRatingFilter("all");
                  setCategoryFilter("all");
                  setSentimentFilter("all");
                  setSortBy("unresolved");
                  setSearch("");
                }}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-200/15 bg-[#061525]/40 px-3.5 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.08]"
              >
                View unresolved
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c192b] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Rating distribution
              </h2>
              <p className="mt-1 text-[10px] text-slate-500">
                Based on saved feedback
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-300/[0.08]">
              <BarChart3 size={17} className="text-amber-200" />
            </div>
          </div>

          <div className="mt-4 space-y-2.5">
            {ratingDistribution.map(({ rating, count }) => {
              const percentage = stats.total
                ? (count / stats.total) * 100
                : 0;

              return (
                <button
                  key={rating}
                  type="button"
                  onClick={() => {
                    setRatingFilter(String(rating));
                    setStatusFilter("all");
                    setCategoryFilter("all");
                    setSentimentFilter("all");
                    setSearch("");
                  }}
                  className="group flex w-full items-center gap-2.5 text-left"
                >
                  <span className="flex w-7 shrink-0 items-center gap-1 text-[10px] font-medium text-slate-400">
                    {rating}
                    <Star size={10} className="fill-amber-300 text-amber-300" />
                  </span>

                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/[0.06]">
                    <motion.span
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 0.55 }}
                      className="block h-full rounded-full bg-gradient-to-r from-amber-400 to-amber-200"
                    />
                  </span>

                  <span className="w-5 text-right text-[10px] tabular-nums text-slate-500 transition group-hover:text-white">
                    {count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Search and filters */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b] p-3 sm:p-4">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035]">
              <SlidersHorizontal size={16} className="text-cyan-300" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Feedback directory
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {filteredFeedback.length} of {feedbackItems.length} records
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-[#071323] p-1">
            <button
              type="button"
              onClick={() => setView("grid")}
              className={cx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold transition",
                view === "grid"
                  ? "bg-cyan-300/10 text-cyan-200"
                  : "text-slate-500 hover:text-slate-200"
              )}
            >
              <LayoutGrid size={14} />
              Cards
            </button>

            <button
              type="button"
              onClick={() => setView("list")}
              className={cx(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-[11px] font-semibold transition",
                view === "list"
                  ? "bg-cyan-300/10 text-cyan-200"
                  : "text-slate-500 hover:text-slate-200"
              )}
            >
              <List size={14} />
              List
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-2.5 2xl:flex-row">
          <div className="relative min-w-0 flex-1">
            <Search
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
            />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student, course, feedback or feedback ID..."
              className="w-full rounded-xl border border-white/[0.09] bg-[#071323] py-3 pl-10 pr-10 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-300/[0.05]"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:flex">
            <CustomDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              icon={Filter}
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "All statuses", value: "all" },
                ...STATUSES.map((status) => ({
                  label: status,
                  value: status,
                })),
              ]}
            />

            <CustomDropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              icon={MessageSquare}
              width="w-full sm:w-44 2xl:w-44"
              options={[
                { label: "All categories", value: "all" },
                ...CATEGORIES.map((category) => ({
                  label: category,
                  value: category,
                })),
              ]}
            />

            <CustomDropdown
              value={ratingFilter}
              onChange={setRatingFilter}
              icon={Star}
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "All ratings", value: "all" },
                { label: "5 stars", value: "5" },
                { label: "4 stars", value: "4" },
                { label: "3 stars", value: "3" },
                { label: "2 stars", value: "2" },
                { label: "1 star", value: "1" },
              ]}
            />

            <CustomDropdown
              value={sentimentFilter}
              onChange={setSentimentFilter}
              icon={Activity}
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "All sentiment", value: "all" },
                { label: "Positive", value: "Positive" },
                { label: "Neutral", value: "Neutral" },
                { label: "Negative", value: "Negative" },
              ]}
            />

            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              icon={ArrowDownWideNarrow}
              width="w-full sm:w-40 2xl:w-40"
              options={[
                { label: "Newest first", value: "newest" },
                { label: "Oldest first", value: "oldest" },
                { label: "Highest rating", value: "highest" },
                { label: "Lowest rating", value: "lowest" },
                { label: "Unresolved first", value: "unresolved" },
              ]}
            />
          </div>
        </div>

        {hasFilters && (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-500">Active filters:</span>

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                Search: {search}
                <X size={11} />
              </button>
            )}

            {statusFilter !== "all" && (
              <button
                type="button"
                onClick={() => setStatusFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {statusFilter}
                <X size={11} />
              </button>
            )}

            {categoryFilter !== "all" && (
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {categoryFilter}
                <X size={11} />
              </button>
            )}

            {ratingFilter !== "all" && (
              <button
                type="button"
                onClick={() => setRatingFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {ratingFilter} star{ratingFilter === "1" ? "" : "s"}
                <X size={11} />
              </button>
            )}

            {sentimentFilter !== "all" && (
              <button
                type="button"
                onClick={() => setSentimentFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {sentimentFilter}
                <X size={11} />
              </button>
            )}

            {sortBy !== "newest" && (
              <button
                type="button"
                onClick={() => setSortBy("newest")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                Sort: {sortBy}
                <X size={11} />
              </button>
            )}

            <button
              type="button"
              onClick={clearFilters}
              className="ml-auto text-[10px] font-semibold text-cyan-300 transition hover:text-cyan-200"
            >
              Clear all
            </button>
          </div>
        )}
      </section>

      {/* Feedback content */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b]">
        {filteredFeedback.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <MessageSquare size={27} className="text-cyan-300" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-white">
              No matching feedback
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Try changing the search term or filters to find feedback records.
            </p>

            <button
              type="button"
              onClick={clearFilters}
              className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05]"
            >
              Clear filters
            </button>
          </div>
        ) : view === "grid" ? (
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Student experiences
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Open any record to reply or update its status.
                </p>
              </div>

              <span className="w-fit rounded-lg border border-white/[0.07] bg-[#071323] px-2.5 py-1.5 text-[10px] text-slate-400">
                {filteredFeedback.length} records
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {filteredFeedback.map((item, index) => (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.025, 0.2) }}
                  className="group relative min-w-0 overflow-visible rounded-2xl border border-white/[0.07] bg-[#091525] p-4 transition duration-200 hover:border-cyan-300/20 hover:bg-[#0b1b2e] sm:p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="flex min-w-0 items-center gap-3 text-left"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.07] text-xs font-bold text-cyan-100">
                        {getInitials(item.student)}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate text-xs font-semibold text-slate-100 transition group-hover:text-cyan-200">
                          {item.student}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-slate-500">
                          {item.course}
                        </p>
                      </div>
                    </button>

                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`More actions for ${item.id}`}
                        onClick={() =>
                          setActiveMenu((previous) =>
                            previous === item.id ? null : item.id
                          )
                        }
                        className={cx(
                          "flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white",
                          activeMenu === item.id &&
                          "border-white/10 bg-white/[0.05] text-white"
                        )}
                      >
                        <MoreHorizontal size={17} />
                      </button>

                      <AnimatePresence>
                        {activeMenu === item.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            className="absolute right-0 top-9 z-[90] w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                          >
                            <button
                              type="button"
                              onClick={() => menuAction(item, "view")}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                            >
                              <Eye size={14} />
                              View details
                            </button>

                            <button
                              type="button"
                              onClick={() => menuAction(item, "review")}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-amber-200 transition hover:bg-amber-400/[0.07]"
                            >
                              <Clock3 size={14} />
                              Move to review
                            </button>

                            <button
                              type="button"
                              onClick={() => menuAction(item, "responded")}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-violet-200 transition hover:bg-violet-400/[0.07]"
                            >
                              <MessageSquare size={14} />
                              Mark responded
                            </button>

                            {item.status !== "Resolved" ? (
                              <button
                                type="button"
                                onClick={() => menuAction(item, "resolve")}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-emerald-200 transition hover:bg-emerald-400/[0.07]"
                              >
                                <CheckCircle2 size={14} />
                                Resolve feedback
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => menuAction(item, "reopen")}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-cyan-200 transition hover:bg-cyan-400/[0.07]"
                              >
                                <RefreshCw size={14} />
                                Reopen feedback
                              </button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <StatusBadge status={item.status} />
                    <SentimentBadge rating={item.rating} />
                  </div>

                  <div className="mt-4">
                    <StarRating rating={item.rating} size={14} />
                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="mt-2 block w-full text-left"
                    >
                      <h3 className="line-clamp-1 text-sm font-semibold text-white transition hover:text-cyan-200">
                        {item.title}
                      </h3>

                      <p className="mt-2 line-clamp-3 min-h-[60px] text-xs leading-5 text-slate-400">
                        {item.message}
                      </p>
                    </button>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-slate-400">
                      {item.category}
                    </span>

                    {item.priority === "High" && (
                      <span className="rounded-full border border-rose-300/15 bg-rose-300/[0.06] px-2.5 py-1 text-[10px] font-medium text-rose-200">
                        High priority
                      </span>
                    )}
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500">
                        {formatDate(item.createdAt)}
                      </p>

                      <p className="mt-1 flex items-center gap-1.5 text-[10px] text-slate-400">
                        <ThumbsUp size={11} />
                        {item.helpful || 0} helpful
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedId(item.id)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-[11px] font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-200"
                    >
                      {item.response ? "View response" : "Respond"}
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing{" "}
                <strong className="font-semibold text-slate-300">
                  {filteredFeedback.length}
                </strong>{" "}
                feedback records
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Changes save in this browser
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col justify-between gap-2 border-b border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  All feedback records
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Select a row to review the complete feedback.
                </p>
              </div>

              <span className="w-fit rounded-lg border border-white/[0.07] bg-[#071323] px-2.5 py-1.5 text-[10px] text-slate-400">
                {filteredFeedback.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-[#091525]/80">
                    {[
                      "Student & feedback",
                      "Rating",
                      "Category",
                      "Sentiment",
                      "Date",
                      "Status",
                      "",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="whitespace-nowrap px-4 py-3.5 text-[10px] font-semibold uppercase tracking-[0.1em] text-slate-500 first:pl-5"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredFeedback.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(index * 0.025, 0.2) }}
                      className="group border-b border-white/[0.045] transition-colors last:border-0 hover:bg-white/[0.025]"
                    >
                      <td className="max-w-[360px] px-4 py-4 pl-5">
                        <button
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className="flex min-w-0 items-center gap-2.5 text-left"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.06] text-[10px] font-bold text-cyan-100">
                            {getInitials(item.student)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-100 transition group-hover:text-cyan-200">
                              {item.title}
                            </p>
                            <p className="mt-1 truncate text-[10px] text-slate-500">
                              {item.student} · {item.id}
                            </p>
                          </div>
                        </button>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <StarRating rating={item.rating} size={12} showValue />
                      </td>

                      <td className="px-4 py-4">
                        <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-slate-400">
                          {item.category}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <SentimentBadge rating={item.rating} />
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-400">
                        {formatDate(item.createdAt)}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={item.status} />
                      </td>

                      <td className="px-4 py-4 pr-5">
                        <button
                          type="button"
                          onClick={() => setSelectedId(item.id)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 py-2 text-[10px] font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-200"
                        >
                          Open
                          <ArrowUpRight size={12} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/[0.06] px-4 py-3.5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <span>Showing {filteredFeedback.length} feedback records</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Changes save in this browser
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 pb-2 text-[10px] leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Feedback & Reviews · College Portal</p>

        <p className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-cyan-300" />
          Feedback workspace
        </p>
      </footer>

      {/* Details modal */}
      {selectedFeedback && (
        <FeedbackDetailsModal
          key={selectedFeedback.id}
          feedback={selectedFeedback}
          onClose={() => setSelectedId(null)}
          onStatusChange={updateStatus}
          onReply={saveReply}
        />
      )}

      {/* Toast notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className={cx(
              "fixed bottom-5 right-5 z-[300] flex max-w-[calc(100vw-40px)] items-center gap-3 rounded-2xl border px-4 py-3.5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]",
              toast.type === "error"
                ? "border-rose-400/20 bg-[#1c1220] text-rose-100"
                : "border-cyan-300/20 bg-[#0b1c2c] text-slate-100"
            )}
          >
            {toast.type === "error" ? (
              <CircleAlert size={17} className="shrink-0 text-rose-300" />
            ) : (
              <CheckCircle2 size={17} className="shrink-0 text-cyan-300" />
            )}

            <span className="text-xs font-medium">{toast.message}</span>

            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setToast(null)}
              className="ml-2 text-slate-500 transition hover:text-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}