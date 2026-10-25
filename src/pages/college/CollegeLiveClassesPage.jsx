import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { Link } from "react-router";

import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Eye,
  Filter,
  GraduationCap,
  LayoutGrid,
  Layers3,
  List,
  MapPin,
  MonitorPlay,
  MoreHorizontal,
  Plus,
  Search,
  Sparkles,
  Star,
  Users,
  Video,
  X,
  XCircle,
  RefreshCw,
  Radio,
  CalendarCheck,
  SlidersHorizontal,
} from "lucide-react";
/* =========================================================
   COLLEGE LIVE CLASSES
   College Portal theme: Navy + Ice Blue
   Frontend demo state + localStorage persistence
========================================================= */

const STORAGE_KEY = "techmentor-college-live-classes-v1";

const COURSE_OPTIONS = [
  "All courses",
  "Full Stack Web Development",
  "Python for Data Science",
  "Java & DSA Masterclass",
  "Cloud & DevOps Foundations",
  "Machine Learning Essentials",
];

const TYPE_OPTIONS = [
  "All types",
  "Live Class",
  "Demo Session",
  "Workshop",
  "Doubt Solving",
];

const STATUS_OPTIONS = [
  "All sessions",
  "Live",
  "Upcoming",
  "Completed",
  "Cancelled",
];

const SORT_OPTIONS = [
  "Soonest first",
  "Latest first",
  "Most students",
  "A–Z",
];

const INITIAL_SESSIONS = [
  {
    id: "CLS-026",
    title: "React State & Component Architecture",
    course: "Full Stack Web Development",
    type: "Live Class",
    status: "Live",
    date: "2026-10-25",
    time: "20:00",
    duration: 60,
    instructor: "Aman Sharma",
    instructorRole: "Senior Full Stack Trainer",
    instructorInitials: "AS",
    enrolled: 48,
    capacity: 60,
    location: "Online session",
    description:
      "Explore component composition, state management patterns and practical React architecture with a guided coding walkthrough.",
    agenda: [
      "Component composition and reusable UI patterns",
      "Local state and data flow",
      "Practical coding walkthrough",
      "Questions and discussion",
    ],
    updatedAt: "2026-10-25T10:00:00.000Z",
  },
  {
    id: "CLS-025",
    title: "Python Data Analysis: Live Workshop",
    course: "Python for Data Science",
    type: "Workshop",
    status: "Upcoming",
    date: "2026-10-26",
    time: "11:00",
    duration: 90,
    instructor: "Priya Verma",
    instructorRole: "Data Science Trainer",
    instructorInitials: "PV",
    enrolled: 36,
    capacity: 50,
    location: "Online session",
    description:
      "A practical walkthrough of data cleaning, exploratory analysis and useful visualizations with Python.",
    agenda: [
      "Dataset preparation",
      "Pandas data transformations",
      "Exploratory analysis",
      "Chart interpretation",
    ],
    updatedAt: "2026-10-24T09:00:00.000Z",
  },
  {
    id: "CLS-024",
    title: "DSA Problem-Solving Practice",
    course: "Java & DSA Masterclass",
    type: "Live Class",
    status: "Upcoming",
    date: "2026-10-27",
    time: "15:30",
    duration: 75,
    instructor: "Rahul Mehta",
    instructorRole: "Programming Trainer",
    instructorInitials: "RM",
    enrolled: 54,
    capacity: 60,
    location: "Online session",
    description:
      "Solve algorithmic problems step by step and discuss complexity, edge cases and implementation strategies.",
    agenda: [
      "Problem analysis",
      "Selecting an approach",
      "Implementation walkthrough",
      "Complexity and edge cases",
    ],
    updatedAt: "2026-10-23T12:00:00.000Z",
  },
  {
    id: "CLS-023",
    title: "Cloud Deployment Demonstration",
    course: "Cloud & DevOps Foundations",
    type: "Demo Session",
    status: "Upcoming",
    date: "2026-10-28",
    time: "12:00",
    duration: 45,
    instructor: "Neha Kapoor",
    instructorRole: "Cloud & DevOps Trainer",
    instructorInitials: "NK",
    enrolled: 28,
    capacity: 45,
    location: "Online session",
    description:
      "Understand the deployment workflow from building an application image to configuring a basic delivery pipeline.",
    agenda: [
      "Deployment workflow overview",
      "Container image basics",
      "Pipeline demonstration",
      "Deployment questions",
    ],
    updatedAt: "2026-10-23T08:30:00.000Z",
  },
  {
    id: "CLS-022",
    title: "Machine Learning Model Evaluation",
    course: "Machine Learning Essentials",
    type: "Doubt Solving",
    status: "Upcoming",
    date: "2026-10-29",
    time: "16:00",
    duration: 60,
    instructor: "Arjun Malhotra",
    instructorRole: "AI & ML Trainer",
    instructorInitials: "AM",
    enrolled: 32,
    capacity: 48,
    location: "Online session",
    description:
      "Review model evaluation metrics, validation techniques and common reasons models perform poorly.",
    agenda: [
      "Classification and regression metrics",
      "Validation strategies",
      "Overfitting and underfitting",
      "Student questions",
    ],
    updatedAt: "2026-10-22T10:00:00.000Z",
  },
  {
    id: "CLS-021",
    title: "Java OOP: Design Principles",
    course: "Java & DSA Masterclass",
    type: "Live Class",
    status: "Completed",
    date: "2026-10-23",
    time: "10:30",
    duration: 60,
    instructor: "Rahul Mehta",
    instructorRole: "Programming Trainer",
    instructorInitials: "RM",
    enrolled: 58,
    capacity: 60,
    location: "Online session",
    description:
      "A completed class on Java object-oriented programming concepts and practical code organization.",
    agenda: [
      "Classes and objects",
      "Inheritance and interfaces",
      "Encapsulation",
      "Code review",
    ],
    updatedAt: "2026-10-23T12:00:00.000Z",
  },
  {
    id: "CLS-020",
    title: "Building Responsive Interfaces",
    course: "Full Stack Web Development",
    type: "Workshop",
    status: "Completed",
    date: "2026-10-21",
    time: "14:00",
    duration: 90,
    instructor: "Aman Sharma",
    instructorRole: "Senior Full Stack Trainer",
    instructorInitials: "AS",
    enrolled: 52,
    capacity: 60,
    location: "Online session",
    description:
      "A completed workshop covering responsive layouts, component reuse and practical UI refinement.",
    agenda: [
      "Responsive layout principles",
      "Component reuse",
      "Accessibility checks",
      "Practical review",
    ],
    updatedAt: "2026-10-21T15:30:00.000Z",
  },
  {
    id: "CLS-019",
    title: "Introduction to Cloud Infrastructure",
    course: "Cloud & DevOps Foundations",
    type: "Demo Session",
    status: "Cancelled",
    date: "2026-10-22",
    time: "11:30",
    duration: 45,
    instructor: "Neha Kapoor",
    instructorRole: "Cloud & DevOps Trainer",
    instructorInitials: "NK",
    enrolled: 24,
    capacity: 45,
    location: "Online session",
    description:
      "An introductory session covering cloud infrastructure concepts and deployment basics.",
    agenda: [
      "Cloud concepts",
      "Infrastructure overview",
      "Deployment fundamentals",
    ],
    updatedAt: "2026-10-22T07:00:00.000Z",
  },
];

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.04 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25 },
  },
};

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#29445b] bg-[#0d2030] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-[#6ac8f7]/45 hover:bg-[#132c40] hover:text-[#a9e4ff]";

const inputClass =
  "w-full rounded-xl border border-[#263f55] bg-[#081725] px-3.5 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#64c7fa] focus:ring-2 focus:ring-[#64c7fa]/10";

/* =========================================================
   HELPERS
========================================================= */

function readSessions() {
  if (typeof window === "undefined") return INITIAL_SESSIONS;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (!saved) return INITIAL_SESSIONS;

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : INITIAL_SESSIONS;
  } catch {
    return INITIAL_SESSIONS;
  }
}

function formatDate(dateString) {
  if (!dateString) return "Date not set";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "Date not set";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatTime(timeString) {
  if (!timeString) return "Time not set";

  const [hours, minutes] = timeString.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return timeString;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getSessionDateTime(session) {
  if (!session.date || !session.time) return null;

  const date = new Date(`${session.date}T${session.time}:00`);

  return Number.isNaN(date.getTime()) ? null : date;
}

function getSessionTimingLabel(session) {
  if (session.status === "Cancelled") return "Session cancelled";
  if (session.status === "Completed") return "Session completed";
  if (session.status === "Live") return "Session is live";

  const sessionDate = getSessionDateTime(session);

  if (!sessionDate) return "Schedule not set";

  const now = new Date();

  const diff = sessionDate.getTime() - now.getTime();

  if (diff <= 0) return "Scheduled time passed";

  const minutes = Math.floor(diff / 60000);
  const days = Math.floor(minutes / 1440);
  const hours = Math.floor((minutes % 1440) / 60);

  if (days > 0) return `Starts in ${days} day${days === 1 ? "" : "s"}`;
  if (hours > 0) return `Starts in ${hours} hour${hours === 1 ? "" : "s"}`;

  return `Starts in ${Math.max(1, minutes)} min`;
}

function makeSessionId(sessions) {
  const maxId = sessions.reduce((max, session) => {
    const match = String(session.id).match(/\d+/);
    return Math.max(max, match ? Number(match[0]) : 0);
  }, 0);

  return `CLS-${String(maxId + 1).padStart(3, "0")}`;
}

function getInitials(name = "") {
  return (
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "TR"
  );
}

function getAvatarGradient(name = "") {
  const palettes = [
    ["#7DD3FC", "#2563EB"],
    ["#C4B5FD", "#7C3AED"],
    ["#67E8F9", "#0891B2"],
    ["#86EFAC", "#059669"],
    ["#FCD34D", "#D97706"],
    ["#FDA4AF", "#DB2777"],
  ];

  const index = [...name].reduce(
    (sum, character) => sum + character.charCodeAt(0),
    0
  );

  const [start, end] = palettes[index % palettes.length];

  return `linear-gradient(135deg, ${start}, ${end})`;
}

/* =========================================================
   PREMIUM DROPDOWN
   Portalled menu prevents clipping inside panels.
========================================================= */

function PremiumDropdown({
  value,
  options,
  onChange,
  icon: SelectIcon,
  label,
  placeholder = "Choose option",
}) {
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const rootRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find(
    (option) => option.value === value
  );

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      if (!rootRef.current) return;

      const rect = rootRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom;
      const spaceAbove = rect.top;
      const openAbove = spaceBelow < 260 && spaceAbove > spaceBelow;

      const availableSpace = openAbove ? spaceAbove - 20 : spaceBelow - 20;

      setPosition({
        left: rect.left,
        top: openAbove ? rect.top - 8 : rect.bottom + 8,
        width: rect.width,
        maxHeight: Math.max(100, Math.min(300, availableSpace)),
        openAbove,
      });
    };

    updatePosition();

    const handleOutside = (event) => {
      const inTrigger = rootRef.current?.contains(event.target);
      const inMenu = menuRef.current?.contains(event.target);

      if (!inTrigger && !inMenu) setOpen(false);
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const safeLeft = position
    ? Math.min(
      position.left,
      window.innerWidth - Math.min(position.width, window.innerWidth - 24) - 12
    )
    : 0;

  const menu =
    open && position && typeof document !== "undefined"
      ? createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            initial={{
              opacity: 0,
              y: position.openAbove ? 6 : -6,
              scale: 0.985,
            }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{
              opacity: 0,
              y: position.openAbove ? 4 : -4,
              scale: 0.985,
            }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            style={{
              position: "fixed",
              left: safeLeft,
              top: position.top,
              width: Math.min(position.width, window.innerWidth - 24),
              maxHeight: position.maxHeight,
              transform: position.openAbove ? "translateY(-100%)" : "none",
              zIndex: 100000,
            }}
            className="overflow-y-auto rounded-2xl border border-[#2a4c65] bg-[#0b1b2b] p-1.5 shadow-[0_22px_70px_rgba(0,0,0,0.48)]"
          >
            {label && (
              <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {label}
              </p>
            )}

            {options.map((option, index) => {
              const active = option.value === value;

              return (
                <motion.button
                  key={option.value}
                  type="button"
                  initial={{ opacity: 0, x: -3 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: Math.min(index * 0.012, 0.08) }}
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={[
                    "group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition-all",
                    active
                      ? "bg-[#16374e] font-semibold text-[#a6e4ff]"
                      : "text-slate-300 hover:bg-[#122c41] hover:text-white",
                  ].join(" ")}
                >
                  <span className="min-w-0 truncate">{option.label}</span>

                  {active && (
                    <Check
                      size={14}
                      className="shrink-0 text-[#7bd5ff]"
                    />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>,
        document.body
      )
      : null;

  return (
    <>
      <div ref={rootRef} className="relative min-w-0 w-full">
        <button
          type="button"
          aria-label={label || placeholder}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={[
            "flex min-h-[43px] w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5",
            "text-left text-xs font-semibold outline-none transition-all duration-200",
            open
              ? "border-[#6ac8f7] bg-[#102b40] text-white shadow-[0_0_0_3px_rgba(106,200,247,0.09)]"
              : "border-[#263e54] bg-[#0a1b2b] text-slate-300 hover:border-[#416783] hover:bg-[#0d2235]",
          ].join(" ")}
        >
          <span className="flex min-w-0 items-center gap-2.5">
            {SelectIcon && (
              <SelectIcon
                size={15}
                className={`shrink-0 ${open ? "text-[#8bddff]" : "text-slate-500"}`}
              />
            )}

            <span className="truncate">
              {selectedOption?.label || placeholder}
            </span>
          </span>

          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            transition={{ duration: 0.18 }}
            className="shrink-0 text-slate-500"
          >
            <ChevronDown size={15} />
          </motion.span>
        </button>
      </div>

      {menu}
    </>
  );
}

/* =========================================================
   SESSION BADGES
========================================================= */

function SessionStatusBadge({ status }) {
  const styles = {
    Live: {
      text: "#7DD3FC",
      bg: "rgba(56,189,248,0.10)",
      border: "rgba(125,211,252,0.24)",
      icon: Radio,
    },
    Upcoming: {
      text: "#A5DDF7",
      bg: "rgba(103,201,255,0.08)",
      border: "rgba(103,201,255,0.20)",
      icon: Clock3,
    },
    Completed: {
      text: "#70E3B9",
      bg: "rgba(94,230,177,0.08)",
      border: "rgba(94,230,177,0.20)",
      icon: CheckCircle2,
    },
    Cancelled: {
      text: "#FDA4AF",
      bg: "rgba(251,113,133,0.08)",
      border: "rgba(251,113,133,0.20)",
      icon: XCircle,
    },
  };

  const style = styles[status] || styles.Upcoming;
  const StatusIcon = style.icon;

  return (
    <span
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold"
      style={{
        color: style.text,
        background: style.bg,
        borderColor: style.border,
      }}
    >
      <StatusIcon size={12} />
      {status}
    </span>
  );
}

function TypeBadge({ type }) {
  return (
    <span className="inline-flex items-center rounded-lg border border-[#2a4860] bg-[#12283a] px-2.5 py-1 text-[10px] font-medium text-[#a6dfff]">
      {type}
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ label, value, note, icon: Icon, accent, delay = 0 }) {
  return (
    <motion.div
      variants={itemVariants}
      transition={{ delay }}
      whileHover={{ y: -3 }}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-[#20384d] bg-[#0a1a2a] p-4 transition-colors hover:border-[#3d6a87] sm:p-5"
    >
      <div
        className="pointer-events-none absolute -right-7 -top-9 h-28 w-28 rounded-full opacity-[0.08] blur-2xl transition-opacity group-hover:opacity-[0.16]"
        style={{ background: accent }}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
          style={{
            color: accent,
            background: `${accent}12`,
            borderColor: `${accent}2b`,
          }}
        >
          <Icon size={19} />
        </div>
      </div>

      <p className="relative mt-3 text-[10px] leading-5 text-slate-500 sm:text-[11px]">
        {note}
      </p>
    </motion.div>
  );
}

/* =========================================================
   SESSION FORM MODAL
========================================================= */

function SessionFormModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    course: COURSE_OPTIONS[1],
    type: "Live Class",
    date: "",
    time: "10:00",
    duration: "60",
    instructor: "",
    capacity: "60",
    location: "Online session",
    description: "",
  });

  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.course ||
      !form.date ||
      !form.time ||
      !form.instructor.trim()
    ) {
      setError("Please fill in the title, course, date, time and trainer.");
      return;
    }

    const sessionDate = new Date(`${form.date}T${form.time}:00`);

    if (Number.isNaN(sessionDate.getTime())) {
      setError("Please select a valid session date and time.");
      return;
    }

    onCreate(form);
  };

  const labelClass = "mb-2 block text-xs font-semibold text-slate-400";

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="create-session-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[9990] flex items-center justify-center overflow-y-auto bg-[#020914]/80 p-3 backdrop-blur-md sm:p-6"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="create-session-title"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="my-auto w-full max-w-2xl overflow-visible rounded-3xl border border-[#29455d] bg-[#091827] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
        >
          <div className="relative overflow-hidden rounded-t-3xl border-b border-[#20384d] px-5 py-5 sm:px-7 sm:py-6">
            <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-[#56bfff]/10 blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#376581] bg-[#123047] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[#a0e2ff]">
                  <Sparkles size={12} />
                  Session planner
                </span>

                <h2
                  id="create-session-title"
                  className="mt-3 text-xl font-bold text-white sm:text-2xl"
                >
                  Schedule a live class
                </h2>

                <p className="mt-1.5 text-xs leading-5 text-slate-400 sm:text-sm">
                  Create a session for your course and student batch.
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#29445b] bg-[#102438] text-slate-400 transition hover:text-white"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5 sm:p-7">
              <div>
                <label htmlFor="session-title" className={labelClass}>
                  Session title *
                </label>
                <input
                  id="session-title"
                  required
                  autoFocus
                  value={form.title}
                  onChange={(event) => update("title", event.target.value)}
                  placeholder="e.g. React Hooks Deep Dive"
                  className={inputClass}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Course *</label>
                  <PremiumDropdown
                    value={form.course}
                    options={COURSE_OPTIONS.filter(
                      (course) => course !== "All courses"
                    ).map((course) => ({ value: course, label: course }))}
                    onChange={(value) => update("course", value)}
                    icon={BookOpen}
                    label="Select course"
                  />
                </div>

                <div>
                  <label className={labelClass}>Session type</label>
                  <PremiumDropdown
                    value={form.type}
                    options={TYPE_OPTIONS.filter(
                      (type) => type !== "All types"
                    ).map((type) => ({ value: type, label: type }))}
                    onChange={(value) => update("type", value)}
                    icon={MonitorPlay}
                    label="Session type"
                  />
                </div>

                <div>
                  <label htmlFor="session-date" className={labelClass}>
                    Date *
                  </label>
                  <input
                    id="session-date"
                    required
                    type="date"
                    value={form.date}
                    onChange={(event) => update("date", event.target.value)}
                    className={`${inputClass} scheme-dark`}
                  />
                </div>

                <div>
                  <label htmlFor="session-time" className={labelClass}>
                    Start time *
                  </label>
                  <input
                    id="session-time"
                    required
                    type="time"
                    value={form.time}
                    onChange={(event) => update("time", event.target.value)}
                    className={`${inputClass} scheme-dark`}
                  />
                </div>

                <div>
                  <label htmlFor="session-duration" className={labelClass}>
                    Duration (minutes)
                  </label>
                  <input
                    id="session-duration"
                    type="number"
                    min="15"
                    max="480"
                    value={form.duration}
                    onChange={(event) => update("duration", event.target.value)}
                    className={inputClass}
                  />
                </div>

                <div>
                  <label htmlFor="session-capacity" className={labelClass}>
                    Student capacity
                  </label>
                  <input
                    id="session-capacity"
                    type="number"
                    min="1"
                    max="10000"
                    value={form.capacity}
                    onChange={(event) => update("capacity", event.target.value)}
                    className={inputClass}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="session-instructor" className={labelClass}>
                  Trainer name *
                </label>
                <input
                  id="session-instructor"
                  required
                  value={form.instructor}
                  onChange={(event) => update("instructor", event.target.value)}
                  placeholder="Enter trainer name"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="session-location" className={labelClass}>
                  Session location
                </label>
                <input
                  id="session-location"
                  value={form.location}
                  onChange={(event) => update("location", event.target.value)}
                  placeholder="Online session / Lab 2"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="session-description" className={labelClass}>
                  Overview and agenda
                </label>
                <textarea
                  id="session-description"
                  rows={3}
                  value={form.description}
                  onChange={(event) =>
                    update("description", event.target.value)
                  }
                  placeholder="What will students learn in this session?"
                  className={`${inputClass} resize-y`}
                />
              </div>

              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-300"
                >
                  {error}
                </motion.p>
              )}

              <div className="flex items-start gap-2 rounded-xl border border-[#244258] bg-[#0d2234] p-3">
                <CalendarCheck
                  size={16}
                  className="mt-0.5 shrink-0 text-[#7bd4ff]"
                />
                <p className="text-xs leading-5 text-slate-400">
                  New sessions are saved as <span className="font-semibold text-[#a3e4ff]">Upcoming</span>.
                  A real video-conference link is not generated by this frontend demo.
                </p>
              </div>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-[#20384d] bg-[#081624] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-[#2a4256] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#12283b]"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6bc9f5] to-[#91e1ff] px-5 py-2.5 text-sm font-bold text-[#061726] transition hover:brightness-110"
              >
                <Plus size={16} />
                Create session
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* =========================================================
   SESSION DETAILS MODAL
========================================================= */

function SessionDetailsModal({
  session,
  onClose,
  onChangeStatus,
}) {
  const [draftStatus, setDraftStatus] = useState(session?.status || "Upcoming");

  useEffect(() => {
    setDraftStatus(session?.status || "Upcoming");
  }, [session]);

  if (!session) return null;

  const attendancePercent =
    session.capacity > 0
      ? Math.min(100, Math.round((session.enrolled / session.capacity) * 100))
      : 0;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key={`session-modal-${session.id}`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
        className="fixed inset-0 z-[9990] flex items-center justify-center overflow-y-auto bg-[#020914]/80 p-3 backdrop-blur-md sm:p-6"
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby="session-details-title"
          initial={{ opacity: 0, y: 18, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.2 }}
          className="my-auto w-full max-w-2xl overflow-visible rounded-3xl border border-[#29455d] bg-[#091827] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
        >
          <div className="relative overflow-hidden rounded-t-3xl border-b border-[#20384d] bg-gradient-to-br from-[#123047] via-[#0d2031] to-[#091725] p-5 sm:p-7">
            <div className="pointer-events-none absolute -right-10 -top-12 h-40 w-40 rounded-full bg-[#56bfff]/10 blur-3xl" />

            <div className="relative flex items-start justify-between gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#3b6d8a] bg-[#143b54] text-[#8bdcff]">
                <Video size={23} />
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close session details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#29445b] bg-[#102438] text-slate-400 transition hover:text-white"
              >
                <X size={17} />
              </button>
            </div>

            <div className="relative mt-5 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-[#315d79] bg-[#15374f] px-2.5 py-1 text-[10px] font-semibold text-[#a5e3ff]">
                {session.id}
              </span>
              <SessionStatusBadge status={session.status} />
              <TypeBadge type={session.type} />
            </div>

            <h2
              id="session-details-title"
              className="relative mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {session.title}
            </h2>

            <p className="relative mt-2 max-w-xl text-sm leading-6 text-slate-400">
              {session.description || "No session overview has been added."}
            </p>
          </div>

          <div className="max-h-[65vh] space-y-5 overflow-y-auto p-5 sm:p-7">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#20384d] bg-[#0d2031] p-4">
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <CalendarDays size={14} className="text-[#7bd4ff]" />
                  Session date
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {formatDate(session.date)}
                </p>
              </div>

              <div className="rounded-2xl border border-[#20384d] bg-[#0d2031] p-4">
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <Clock3 size={14} className="text-[#7bd4ff]" />
                  Start time & duration
                </p>
                <p className="mt-2 text-sm font-semibold text-white">
                  {formatTime(session.time)}
                  <span className="ml-2 text-xs font-normal text-slate-500">
                    · {session.duration} min
                  </span>
                </p>
              </div>

              <div className="rounded-2xl border border-[#20384d] bg-[#0d2031] p-4">
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <BookOpen size={14} className="text-[#7bd4ff]" />
                  Course
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-200">
                  {session.course}
                </p>
              </div>

              <div className="rounded-2xl border border-[#20384d] bg-[#0d2031] p-4">
                <p className="flex items-center gap-2 text-xs text-slate-500">
                  <MapPin size={14} className="text-[#7bd4ff]" />
                  Location
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-200">
                  {session.location || "Not specified"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-[#20384d] bg-[#0d2031] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl text-sm font-bold text-[#061726]"
                    style={{
                      background: getAvatarGradient(session.instructor),
                    }}
                  >
                    {session.instructorInitials || getInitials(session.instructor)}
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-white">
                      {session.instructor}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      {session.instructorRole || "Session instructor"}
                    </p>
                  </div>
                </div>

                <span className="rounded-lg border border-[#29465d] bg-[#10273a] px-2.5 py-1.5 text-[10px] font-semibold text-[#9fddff]">
                  Trainer assigned
                </span>
              </div>
            </div>

            <div className="rounded-2xl border border-[#20384d] bg-[#0a1b2a] p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Student enrollment
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Enrolled students compared with capacity
                  </p>
                </div>

                <p className="text-lg font-bold text-[#8bdcff]">
                  {attendancePercent}%
                </p>
              </div>

              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${attendancePercent}%` }}
                  transition={{ duration: 0.55 }}
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
                />
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                <span className="text-slate-400">
                  <span className="font-semibold text-white">
                    {session.enrolled}
                  </span>{" "}
                  enrolled
                </span>
                <span className="text-slate-500">
                  Capacity: {session.capacity}
                </span>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold text-white">
                Session agenda
              </h3>

              <div className="space-y-2">
                {(session.agenda || []).map((item, index) => (
                  <div
                    key={`${session.id}-${item}`}
                    className="flex items-start gap-3 rounded-xl border border-[#20384d] bg-[#0d2031] px-3.5 py-3"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-[#2e526b] bg-[#143047] text-[10px] font-bold text-[#8bdcff]">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="pt-1 text-xs leading-5 text-slate-300">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-[#29475e] bg-[#10273a] p-4">
              <label className="mb-2 block text-xs font-semibold text-slate-400">
                Update session status
              </label>

              <PremiumDropdown
                value={draftStatus}
                options={STATUS_OPTIONS.filter(
                  (status) => status !== "All sessions"
                ).map((status) => ({ value: status, label: status }))}
                onChange={setDraftStatus}
                icon={Activity}
                label="Session status"
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-[#20384d] bg-[#081624] px-5 py-4 sm:flex-row sm:justify-between sm:px-7">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2a4256] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#12283b]"
            >
              Close
            </button>

            <button
              type="button"
              disabled={draftStatus === session.status}
              onClick={() => onChangeStatus(session.id, draftStatus)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6bc9f5] to-[#91e1ff] px-5 py-2.5 text-sm font-bold text-[#061726] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Check size={16} />
              Save status
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

/* =========================================================
   SESSION CARD
========================================================= */

function SessionCard({
  session,
  index,
  viewMode,
  onView,
  onChangeStatus,
  onDuplicate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const enrollmentPercent =
    session.capacity > 0
      ? Math.min(100, Math.round((session.enrolled / session.capacity) * 100))
      : 0;

  const isLive = session.status === "Live";
  const isCancelled = session.status === "Cancelled";
  const isCompleted = session.status === "Completed";

  useEffect(() => {
    const closeOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const closeEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", closeEscape);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", closeEscape);
    };
  }, []);

  return (
    <motion.article
      layout
      variants={itemVariants}
      transition={{ layout: { duration: 0.2 } }}
      className={[
        "group relative min-w-0 rounded-[20px] border border-[#20384d] bg-[#0c1b2b]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-[#477795] hover:shadow-xl hover:shadow-black/15",
        viewMode === "list" ? "flex flex-col sm:flex-row" : "",
      ].join(" ")}
    >
      {/* CARD VISUAL */}

      <div
        className={[
          "relative overflow-hidden border-b border-[#20384d] bg-gradient-to-br from-[#163a54] via-[#10283c] to-[#0b1a29]",
          viewMode === "list"
            ? "min-h-[160px] sm:w-[210px] sm:shrink-0 sm:border-b-0 sm:border-r"
            : "h-[150px] rounded-t-[20px]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -right-5 -top-9 h-36 w-36 rounded-full border border-white/[0.06]" />
        <div className="pointer-events-none absolute right-5 top-5 h-20 w-20 rounded-full border border-white/[0.045]" />
        <div className="pointer-events-none absolute -bottom-10 left-8 h-24 w-24 rounded-full bg-sky-300/[0.08] blur-2xl" />

        <div className="relative flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[#5b8eab]/30 bg-[#0d263b]/80 text-[#8bdcff] shadow-lg shadow-black/10">
              {isLive ? <Radio size={22} /> : <MonitorPlay size={22} />}
            </div>

            <div className="flex items-center gap-2">
              {isLive && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/25 bg-sky-300/10 px-2.5 py-1.5 text-[10px] font-bold text-sky-200">
                  <motion.span
                    animate={{ opacity: [1, 0.4, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="h-1.5 w-1.5 rounded-full bg-sky-300"
                  />
                  LIVE NOW
                </span>
              )}

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((current) => !current)}
                  aria-expanded={menuOpen}
                  aria-label={`Actions for ${session.title}`}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.1] bg-[#081725]/65 text-slate-300 transition hover:bg-white/[0.1] hover:text-white"
                >
                  <MoreHorizontal size={17} />
                </button>

                <AnimatePresence>
                  {menuOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -5, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -4, scale: 0.98 }}
                      transition={{ duration: 0.14 }}
                      className="absolute right-0 top-10 z-[90] w-48 rounded-2xl border border-[#2a4c65] bg-[#0b1b2b] p-1.5 shadow-2xl shadow-black/40"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onView(session);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-[#122c41] hover:text-white"
                      >
                        <Eye size={14} className="text-sky-300" />
                        View session
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onDuplicate(session);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-[#122c41] hover:text-white"
                      >
                        <Copy size={14} className="text-cyan-300" />
                        Duplicate session
                      </button>

                      {!isCompleted && !isCancelled && (
                        <>
                          <div className="my-1 border-t border-[#20384d]" />

                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              onChangeStatus(
                                session.id,
                                isLive ? "Completed" : "Live"
                              );
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-[#122c41] hover:text-white"
                          >
                            {isLive ? (
                              <CheckCircle2 size={14} className="text-emerald-300" />
                            ) : (
                              <Radio size={14} className="text-sky-300" />
                            )}
                            {isLive ? "Mark completed" : "Start live session"}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setMenuOpen(false);
                              onChangeStatus(session.id, "Cancelled");
                            }}
                            className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-rose-300 transition hover:bg-rose-300/[0.08]"
                          >
                            <XCircle size={14} />
                            Cancel session
                          </button>
                        </>
                      )}

                      {(isCompleted || isCancelled) && (
                        <button
                          type="button"
                          onClick={() => {
                            setMenuOpen(false);
                            onChangeStatus(session.id, "Upcoming");
                          }}
                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-[#122c41] hover:text-white"
                        >
                          <RefreshCw size={14} className="text-sky-300" />
                          Reopen session
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-end justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-[#9bdfff]">
                {session.id}
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-1.5">
                <TypeBadge type={session.type} />
              </div>
            </div>

            <SessionStatusBadge status={session.status} />
          </div>
        </div>
      </div>

      {/* CARD BODY */}

      <div
        className={[
          "flex min-w-0 flex-1 flex-col p-4 sm:p-5",
          viewMode === "list" ? "sm:justify-center" : "",
        ].join(" ")}
      >
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-base font-bold leading-6 text-white transition-colors group-hover:text-[#9de1ff]">
            {session.title}
          </h3>

          <p className="mt-2 line-clamp-2 min-h-[40px] text-[11px] leading-5 text-slate-400 sm:text-xs">
            {session.description || "No description has been added."}
          </p>
        </div>

        <div className="mt-4 flex min-w-0 items-center gap-2.5">
          <div
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-[#061726]"
            style={{
              background: getAvatarGradient(session.instructor),
            }}
          >
            {session.instructorInitials || getInitials(session.instructor)}
          </div>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-slate-200">
              {session.instructor}
            </p>
            <p className="mt-1 truncate text-[10px] text-slate-500">
              {session.instructorRole || "Session instructor"}
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#20384d] pt-4">
          <div className="flex min-w-0 items-start gap-2">
            <CalendarDays size={14} className="mt-0.5 shrink-0 text-[#79d4ff]" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-500">Date</p>
              <p className="mt-1 text-xs font-semibold text-slate-200">
                {formatDate(session.date)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2">
            <Clock3 size={14} className="mt-0.5 shrink-0 text-[#79d4ff]" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-500">Time & duration</p>
              <p className="mt-1 text-xs font-semibold text-slate-200">
                {formatTime(session.time)}
              </p>
              <p className="mt-0.5 text-[9px] text-slate-500">
                {session.duration} minutes
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2">
            <Users size={14} className="mt-0.5 shrink-0 text-[#79d4ff]" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-500">Enrollment</p>
              <p className="mt-1 text-xs font-semibold text-slate-200">
                {session.enrolled}/{session.capacity} students
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2">
            <MapPin size={14} className="mt-0.5 shrink-0 text-[#79d4ff]" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-500">Location</p>
              <p className="mt-1 truncate text-xs font-semibold text-slate-200">
                {session.location || "Not specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500">
              Seat capacity
            </span>
            <span className="text-[10px] font-semibold text-[#95dfff]">
              {enrollmentPercent}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${enrollmentPercent}%` }}
              transition={{
                duration: 0.55,
                delay: index * 0.025,
                ease: "easeOut",
              }}
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
            />
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(session)}
            className="inline-flex min-h-[39px] flex-1 items-center justify-center gap-2 rounded-xl border border-[#29465c] bg-[#102539] px-3 py-2.5 text-[11px] font-semibold text-[#b0e5ff] transition hover:border-[#6ac8f7]/45 hover:bg-[#173a53]"
          >
            <Eye size={14} />
            View details
          </button>

          {!isLive && !isCompleted && !isCancelled ? (
            <button
              type="button"
              title="Start live session"
              onClick={() => onChangeStatus(session.id, "Live")}
              className="flex h-[39px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-[#5abfea]/25 bg-[#143b52] text-[#8cddff] transition hover:bg-[#1a4c68]"
            >
              <Radio size={15} />
            </button>
          ) : isLive ? (
            <button
              type="button"
              title="Mark completed"
              onClick={() => onChangeStatus(session.id, "Completed")}
              className="flex h-[39px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition hover:bg-emerald-400/20"
            >
              <Check size={15} />
            </button>
          ) : (
            <button
              type="button"
              title="Reopen session"
              onClick={() => onChangeStatus(session.id, "Upcoming")}
              className="flex h-[39px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-[#29465c] bg-[#102539] text-slate-300 transition hover:bg-[#173a53]"
            >
              <RefreshCw size={15} />
            </button>
          )}
        </div>

        {(isCancelled || isCompleted) && (
          <p className="mt-3 text-[10px] text-slate-500">
            {isCancelled
              ? "This session is cancelled."
              : "This session is marked completed."}
          </p>
        )}
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function CollegeLiveClassesPage() {
  const [sessions, setSessions] = useState(readSessions);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All sessions");
  const [sortBy, setSortBy] = useState("Soonest first");
  const [viewMode, setViewMode] = useState("grid");

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [activeSession, setActiveSession] = useState(null);
  const [toast, setToast] = useState(null);

  const toastTimerRef = useRef(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Could not save live sessions:", error);
    }
  }, [sessions]);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  const notify = (message, type = "success") => {
    if (toastTimerRef.current) {
      window.clearTimeout(toastTimerRef.current);
    }

    setToast({ message, type });

    toastTimerRef.current = window.setTimeout(() => {
      setToast(null);
    }, 3200);
  };

  const stats = useMemo(() => {
    const total = sessions.length;
    const live = sessions.filter((session) => session.status === "Live").length;
    const upcoming = sessions.filter(
      (session) => session.status === "Upcoming"
    ).length;
    const completed = sessions.filter(
      (session) => session.status === "Completed"
    ).length;
    const totalEnrolled = sessions
      .filter((session) => session.status !== "Cancelled")
      .reduce((sum, session) => sum + (Number(session.enrolled) || 0), 0);

    return { total, live, upcoming, completed, totalEnrolled };
  }, [sessions]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    const results = sessions.filter((session) => {
      const searchText = [
        session.id,
        session.title,
        session.course,
        session.instructor,
        session.type,
        session.location,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!query || searchText.includes(query)) &&
        (courseFilter === "All courses" || session.course === courseFilter) &&
        (typeFilter === "All types" || session.type === typeFilter) &&
        (statusFilter === "All sessions" || session.status === statusFilter)
      );
    });

    results.sort((a, b) => {
      if (sortBy === "Most students") {
        return (b.enrolled || 0) - (a.enrolled || 0);
      }

      if (sortBy === "A–Z") {
        return a.title.localeCompare(b.title);
      }

      const dateA = getSessionDateTime(a)?.getTime() ?? 0;
      const dateB = getSessionDateTime(b)?.getTime() ?? 0;

      return sortBy === "Latest first" ? dateB - dateA : dateA - dateB;
    });

    return results;
  }, [sessions, search, courseFilter, typeFilter, statusFilter, sortBy]);

  const hasActiveFilters =
    search.trim() !== "" ||
    courseFilter !== "All courses" ||
    typeFilter !== "All types" ||
    statusFilter !== "All sessions" ||
    sortBy !== "Soonest first";

  const clearFilters = () => {
    setSearch("");
    setCourseFilter("All courses");
    setTypeFilter("All types");
    setStatusFilter("All sessions");
    setSortBy("Soonest first");
  };

  const handleCreateSession = (form) => {
    const capacity = Math.max(1, Number(form.capacity) || 60);
    const duration = Math.max(15, Number(form.duration) || 60);
    const now = new Date().toISOString();

    const newSession = {
      id: makeSessionId(sessions),
      title: form.title.trim(),
      course: form.course,
      type: form.type,
      status: "Upcoming",
      date: form.date,
      time: form.time,
      duration,
      instructor: form.instructor.trim(),
      instructorRole: "Session instructor",
      instructorInitials: getInitials(form.instructor),
      enrolled: 0,
      capacity,
      location: form.location.trim() || "Online session",
      description: form.description.trim(),
      agenda: form.description.trim()
        ? [form.description.trim()]
        : ["Session overview to be added."],
      updatedAt: now,
    };

    setSessions((current) => [newSession, ...current]);
    clearFilters();
    setShowCreateModal(false);
    notify("Live class scheduled successfully.");
  };

  const updateSessionStatus = (id, status) => {
    const session = sessions.find((item) => item.id === id);
    if (!session) return;

    setSessions((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, status, updatedAt: new Date().toISOString() }
          : item
      )
    );

    setActiveSession(null);

    const messages = {
      Live: `"${session.title}" marked as live.`,
      Upcoming: `"${session.title}" moved to upcoming sessions.`,
      Completed: `"${session.title}" marked as completed.`,
      Cancelled: `"${session.title}" has been cancelled.`,
    };

    notify(messages[status] || "Session updated.");
  };

  const duplicateSession = (session) => {
    const duplicate = {
      ...session,
      id: makeSessionId(sessions),
      title: `${session.title} (Copy)`,
      status: "Upcoming",
      enrolled: 0,
      updatedAt: new Date().toISOString(),
    };

    setSessions((current) => [duplicate, ...current]);
    clearFilters();
    notify("Session duplicated as an upcoming session.");
  };

  const statusTabs = [
    { value: "All sessions", label: "All sessions", count: stats.total },
    { value: "Live", label: "Live now", count: stats.live },
    { value: "Upcoming", label: "Upcoming", count: stats.upcoming },
    { value: "Completed", label: "Completed", count: stats.completed },
  ];

  return (
    <>
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="box-border mx-auto w-full min-w-0 max-w-[1600px] space-y-5 px-4 py-5 text-slate-100 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6 lg:py-6 2xl:px-7"
      >
        {/* PAGE HERO */}

        <motion.section
          variants={itemVariants}
          className="relative isolate overflow-hidden rounded-[22px] border border-[#24445d] bg-gradient-to-br from-[#102a40] via-[#0b1e30] to-[#091725] p-5 sm:rounded-[24px] sm:p-7 lg:p-8"
        >
          <div className="pointer-events-none absolute -right-12 -top-16 h-56 w-56 rounded-full bg-[#51bdff]/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-[35%] h-32 w-44 rounded-full bg-blue-400/[0.05] blur-3xl" />

          <div className="relative flex min-w-0 flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div className="min-w-0 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#3b627d] bg-[#123047]/70 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#9ce1ff] sm:text-[10px]">
                <Sparkles size={13} />
                Academic management
              </div>

              <h1 className="mt-4 text-[26px] font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[36px]">
                Live Classes &{" "}
                <span className="bg-gradient-to-r from-[#79d5ff] to-[#c1f0ff] bg-clip-text text-transparent">
                  Sessions
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm sm:leading-7">
                Schedule live classes, organize trainer-led sessions and track
                student enrollment from one centralized academic workspace.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400 sm:text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#7bd4ff]" />
                  {stats.upcoming} upcoming sessions
                </span>

                <span className="hidden h-3 w-px bg-white/10 sm:block" />

                <span className="inline-flex items-center gap-1.5">
                  <Activity size={13} className="text-[#7bd4ff]" />
                  Session management workspace
                </span>
              </div>
            </div>

            <div className="relative flex flex-col gap-2 sm:flex-row xl:shrink-0">
              <button
                type="button"
                onClick={() => notify("Session data exported.", "success")}
                className={secondaryButton}
              >
                <DownloadIcon />
                Export view
              </button>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#70ccf7] to-[#a1e6ff] px-4 py-2.5 text-xs font-bold text-[#061624] shadow-lg shadow-sky-500/10 transition hover:-translate-y-0.5 hover:brightness-110 active:translate-y-0"
              >
                <Plus size={16} strokeWidth={2.5} />
                Schedule a session
              </button>
            </div>
          </div>
        </motion.section>

        {/* STATS */}

        <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total sessions"
            value={stats.total}
            note="All scheduled and past sessions"
            icon={MonitorPlay}
            accent="#70CCF7"
            delay={0.03}
          />

          <StatCard
            label="Live now"
            value={stats.live}
            note="Currently marked as live"
            icon={Radio}
            accent="#67C9FF"
            delay={0.07}
          />

          <StatCard
            label="Upcoming"
            value={stats.upcoming}
            note="Ready for the next sessions"
            icon={CalendarDays}
            accent="#8DA8FF"
            delay={0.11}
          />

          <StatCard
            label="Students enrolled"
            value={stats.totalEnrolled.toLocaleString("en-IN")}
            note="Across non-cancelled sessions"
            icon={Users}
            accent="#5EE6B1"
            delay={0.15}
          />
        </section>

        {/* MAIN SESSION PANEL */}

        <motion.section
          variants={itemVariants}
          className="relative min-w-0 rounded-[22px] border border-[#20384d] bg-[#091827] sm:rounded-[24px]"
        >
          {/* SECTION HEADER */}

          <div className="flex min-w-0 flex-col justify-between gap-4 border-b border-[#20384d] p-4 sm:p-5 lg:flex-row lg:items-center lg:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a526c] bg-[#123047] text-[#8bdcff]">
                <Video size={18} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white sm:text-base">
                  Session catalog
                </h2>
                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                  Manage session schedules, trainers and enrollment
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="relative min-w-0 flex-1 sm:min-w-[230px] lg:w-[260px] lg:flex-none">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search session, course, trainer..."
                  aria-label="Search sessions"
                  className="h-[42px] w-full rounded-xl border border-[#263e54] bg-[#0a1b2b] pl-10 pr-9 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-[#67c8fa] focus:ring-2 focus:ring-[#67c8fa]/10"
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

              <div className="flex shrink-0 items-center gap-1 rounded-xl border border-[#263e54] bg-[#0a1b2b] p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${viewMode === "grid"
                    ? "bg-[#1a405a] text-[#9ce2ff]"
                    : "text-slate-500 hover:text-slate-200"
                    }`}
                >
                  <LayoutGrid size={15} />
                </button>

                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${viewMode === "list"
                    ? "bg-[#1a405a] text-[#9ce2ff]"
                    : "text-slate-500 hover:text-slate-200"
                    }`}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* STATUS TABS */}

          <div className="border-b border-[#20384d] bg-[#0a1928] px-3 pt-3 sm:px-5">
            <div className="flex gap-1.5 overflow-x-auto">
              {statusTabs.map((tab) => {
                const active = statusFilter === tab.value;

                return (
                  <button
                    key={tab.value}
                    type="button"
                    onClick={() => setStatusFilter(tab.value)}
                    className={`relative flex shrink-0 items-center gap-2 rounded-t-xl px-3.5 py-3 text-xs font-semibold transition ${active
                      ? "bg-[#112b40] text-[#a2e2ff]"
                      : "text-slate-500 hover:bg-[#0d2234] hover:text-slate-200"
                      }`}
                  >
                    {tab.label}

                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[10px] ${active
                        ? "bg-[#24516d] text-[#b9eaff]"
                        : "bg-[#17293a] text-slate-500"
                        }`}
                    >
                      {tab.count}
                    </span>

                    {active && (
                      <motion.span
                        layoutId="college-live-status-tab"
                        className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[#7ad6ff]"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* FILTERS */}

          <div className="space-y-4 border-b border-[#20384d] p-4 sm:p-5">
            <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
              <Filter size={13} className="text-[#78d3ff]" />
              Filter sessions
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <PremiumDropdown
                value={courseFilter}
                options={COURSE_OPTIONS.map((course) => ({
                  value: course,
                  label: course,
                }))}
                onChange={setCourseFilter}
                icon={BookOpen}
                label="Courses"
              />

              <PremiumDropdown
                value={typeFilter}
                options={TYPE_OPTIONS.map((type) => ({
                  value: type,
                  label: type,
                }))}
                onChange={setTypeFilter}
                icon={Layers3}
                label="Session type"
              />

              <PremiumDropdown
                value={sortBy}
                options={SORT_OPTIONS.map((sort) => ({
                  value: sort,
                  label: sort,
                }))}
                onChange={setSortBy}
                icon={SlidersHorizontal}
                label="Sort sessions"
              />

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-xl border border-[#263e54] bg-[#0a1b2b] px-3.5 py-2.5 text-xs font-semibold text-slate-400 transition hover:border-[#4c7997] hover:text-[#9ce2ff] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <RefreshCw size={14} />
                Reset filters
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-semibold text-slate-300">
                  {filteredSessions.length}
                </span>{" "}
                of{" "}
                <span className="font-semibold text-slate-300">
                  {sessions.length}
                </span>{" "}
                sessions
              </p>

              <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
                <Activity size={12} className="text-[#7bd4ff]" />
                Interactive session workspace
              </span>
            </div>
          </div>

          {/* SESSION GRID */}

          <div className="min-w-0 p-4 sm:p-5 lg:p-6">
            <AnimatePresence mode="wait">
              {filteredSessions.length > 0 ? (
                <motion.div
                  key={`${viewMode}-${courseFilter}-${typeFilter}-${statusFilter}-${sortBy}-${search}`}
                  variants={pageVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, y: 4 }}
                  className={
                    viewMode === "grid"
                      ? "grid min-w-0 grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
                      : "flex min-w-0 flex-col gap-3"
                  }
                >
                  {filteredSessions.map((session, index) => (
                    <SessionCard
                      key={session.id}
                      session={session}
                      index={index}
                      viewMode={viewMode}
                      onView={setActiveSession}
                      onChangeStatus={updateSessionStatus}
                      onDuplicate={duplicateSession}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-sessions"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[280px] flex-col items-center justify-center px-4 py-12 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#2a4e68] bg-[#10283b] text-[#7bd4ff]">
                    <Search size={23} />
                  </div>

                  <h3 className="mt-5 text-base font-bold text-white">
                    No sessions found
                  </h3>

                  <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
                    Try a different search term or adjust your course, type and
                    status filters.
                  </p>

                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#70ccf7] to-[#a1e6ff] px-4 py-3 text-xs font-bold text-[#061624] transition hover:brightness-110"
                  >
                    <RefreshCw size={14} />
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* QUICK ACTIONS */}

        <motion.section
          variants={itemVariants}
          className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3"
        >
          <div className="rounded-2xl border border-[#20384d] bg-[#0a1a2a] p-5 sm:p-6 lg:col-span-2">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2b526b] bg-[#123047] text-[#7bd4ff]">
                <GraduationCap size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white">
                  Keep your academic schedule organized
                </h3>

                <p className="mt-1.5 max-w-2xl text-xs leading-6 text-slate-400">
                  Coordinate classes, review trainer availability and keep
                  student enrollment aligned with your planned sessions.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/college/class-schedule"
                    className={secondaryButton}
                  >
                    <CalendarDays size={14} />
                    Class schedule
                    <ArrowUpRight size={13} />
                  </Link>

                  <Link
                    to="/college/programs"
                    className={secondaryButton}
                  >
                    <BookOpen size={14} />
                    Manage courses
                    <ArrowUpRight size={13} />
                  </Link>

                  <Link
                    to="/college/trainers"
                    className={secondaryButton}
                  >
                    <Users size={14} />
                    Trainers
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-[#315771] bg-gradient-to-br from-[#123047] via-[#0d2031] to-[#091725] p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-6 -top-7 h-28 w-28 rounded-full bg-[#56bfff]/10 blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#3b6986] bg-[#163950] text-[#8bdcff]">
                  <Sparkles size={19} />
                </span>

                <span className="rounded-full border border-[#3b627d] bg-[#123047]/70 px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-[#9ce1ff]">
                  Quick action
                </span>
              </div>

              <h3 className="mt-4 text-sm font-bold text-white">
                Plan a new session
              </h3>

              <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                Choose a course, assign a trainer and schedule the next session.
              </p>

              <button
                type="button"
                onClick={() => setShowCreateModal(true)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-[#93dfff] transition hover:text-white"
              >
                Schedule a session
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}

        <motion.footer
          variants={itemVariants}
          className="flex flex-col justify-between gap-2 border-t border-[#20384d] pt-4 text-[10px] text-slate-600 sm:flex-row sm:items-center"
        >
          <p>
            CodeFaculty College Workspace
            <span className="mx-2 text-slate-700">·</span>
            Live Classes & Sessions
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#7bd4ff]" />
            <span>Session workspace ready</span>
          </div>
        </motion.footer>
      </motion.div>

      {/* CREATE MODAL */}

      <AnimatePresence>
        {showCreateModal && (
          <SessionFormModal
            key="create-live-session"
            onClose={() => setShowCreateModal(false)}
            onCreate={handleCreateSession}
          />
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}

      <AnimatePresence>
        {activeSession && (
          <SessionDetailsModal
            key={`session-details-${activeSession.id}`}
            session={
              sessions.find((item) => item.id === activeSession.id) ||
              activeSession
            }
            onClose={() => setActiveSession(null)}
            onChangeStatus={updateSessionStatus}
          />
        )}
      </AnimatePresence>

      {/* TOAST */}

      <AnimatePresence>
        {toast && (
          <motion.div
            key="college-live-toast"
            initial={{ opacity: 0, y: 14, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="fixed bottom-4 right-4 z-[10010] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-[#31536b] bg-[#0b1c2b] px-4 py-3.5 shadow-[0_16px_50px_rgba(0,0,0,0.45)] sm:bottom-6 sm:right-6"
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${toast.type === "error"
                ? "bg-rose-400/10 text-rose-300"
                : "bg-sky-400/10 text-sky-200"
                }`}
            >
              {toast.type === "error" ? (
                <XCircle size={16} />
              ) : (
                <CheckCircle2 size={16} />
              )}
            </div>

            <p className="text-xs font-medium text-slate-200">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => setToast(null)}
              className="ml-1 shrink-0 text-slate-500 transition hover:text-white"
              aria-label="Dismiss notification"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* Tiny icon-only export action */
function DownloadIcon() {
  return <ArrowUpRight size={14} />;
}