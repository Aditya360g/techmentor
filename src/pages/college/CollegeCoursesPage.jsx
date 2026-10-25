import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  BrainCircuit,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Cloud,
  Code2,
  Copy,
  Database,
  Eye,
  Filter,
  GraduationCap,
  Layers3,
  LayoutGrid,
  List,
  MonitorPlay,
  MoreHorizontal,
  Palette,
  Plus,
  Search,
  Sparkles,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";

/* =========================================================
   COLLEGE COURSES & PROGRAMS
   Theme: College Portal Navy + Ice Blue
========================================================= */

const CATEGORIES = [
  "All categories",
  "Development",
  "AI & Data Science",
  "Programming",
  "Cloud & DevOps",
  "Design & Product",
];

const STATUSES = ["All courses", "Published", "Draft"];

const SORT_OPTIONS = [
  "Recently updated",
  "Most enrolled",
  "Highest rated",
  "A–Z",
];

const categoryStyles = {
  Development: {
    icon: Code2,
    iconClass: "bg-sky-400/10 text-sky-300",
    badgeClass: "border-sky-300/20 bg-sky-300/10 text-sky-200",
    glow: "from-sky-500/20 via-blue-500/10 to-transparent",
  },
  "AI & Data Science": {
    icon: BrainCircuit,
    iconClass: "bg-violet-400/10 text-violet-300",
    badgeClass: "border-violet-300/20 bg-violet-300/10 text-violet-200",
    glow: "from-violet-500/20 via-indigo-500/10 to-transparent",
  },
  Programming: {
    icon: Database,
    iconClass: "bg-indigo-400/10 text-indigo-300",
    badgeClass: "border-indigo-300/20 bg-indigo-300/10 text-indigo-200",
    glow: "from-indigo-500/20 via-blue-500/10 to-transparent",
  },
  "Cloud & DevOps": {
    icon: Cloud,
    iconClass: "bg-cyan-400/10 text-cyan-300",
    badgeClass: "border-cyan-300/20 bg-cyan-300/10 text-cyan-200",
    glow: "from-cyan-500/20 via-sky-500/10 to-transparent",
  },
  "Design & Product": {
    icon: Palette,
    iconClass: "bg-amber-400/10 text-amber-300",
    badgeClass: "border-amber-300/20 bg-amber-300/10 text-amber-200",
    glow: "from-amber-500/20 via-orange-500/10 to-transparent",
  },
};

const INITIAL_COURSES = [
  {
    id: 1,
    title: "Full Stack Web Development",
    category: "Development",
    description:
      "Build modern web applications using React, APIs, databases and real-world deployment workflows.",
    instructor: "Aman Sharma",
    initials: "AS",
    learners: 248,
    duration: "12 weeks",
    level: "Intermediate",
    rating: 4.9,
    progress: 76,
    status: "Published",
    updated: "2026-10-23",
    updatedLabel: "Updated 2 days ago",
    lessons: 48,
    outline: [
      "HTML, CSS and JavaScript foundations",
      "React components, hooks and routing",
      "Backend API and database integration",
      "Authentication and application security",
      "Testing and production deployment",
    ],
  },
  {
    id: 2,
    title: "Python for Data Science",
    category: "AI & Data Science",
    description:
      "Learn Python, data analysis, visualization and practical data science using real datasets.",
    instructor: "Priya Verma",
    initials: "PV",
    learners: 186,
    duration: "10 weeks",
    level: "Beginner",
    rating: 4.8,
    progress: 62,
    status: "Published",
    updated: "2026-10-22",
    updatedLabel: "Updated 3 days ago",
    lessons: 42,
    outline: [
      "Python programming fundamentals",
      "NumPy and Pandas",
      "Exploratory data analysis",
      "Data visualization",
      "Practical analytics project",
    ],
  },
  {
    id: 3,
    title: "Java & DSA Masterclass",
    category: "Programming",
    description:
      "Improve problem-solving skills through data structures, algorithms and coding interview practice.",
    instructor: "Rahul Mehta",
    initials: "RM",
    learners: 320,
    duration: "16 weeks",
    level: "Intermediate",
    rating: 4.9,
    progress: 88,
    status: "Published",
    updated: "2026-10-24",
    updatedLabel: "Updated yesterday",
    lessons: 64,
    outline: [
      "Java and object-oriented programming",
      "Arrays, strings and linked lists",
      "Stacks, queues, trees and graphs",
      "Sorting, searching and dynamic programming",
      "Interview problems and timed practice",
    ],
  },
  {
    id: 4,
    title: "Cloud & DevOps Foundations",
    category: "Cloud & DevOps",
    description:
      "Understand containers, cloud infrastructure, deployment pipelines and DevOps workflows.",
    instructor: "Neha Kapoor",
    initials: "NK",
    learners: 94,
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.7,
    progress: 41,
    status: "Published",
    updated: "2026-10-19",
    updatedLabel: "Updated 6 days ago",
    lessons: 32,
    outline: [
      "Linux and command-line essentials",
      "Git and team collaboration",
      "Docker containers and images",
      "CI/CD pipelines",
      "Cloud and monitoring fundamentals",
    ],
  },
  {
    id: 5,
    title: "UI/UX & Product Design",
    category: "Design & Product",
    description:
      "Create user-centred interfaces through research, wireframes, prototyping and design systems.",
    instructor: "Kavya Rao",
    initials: "KR",
    learners: 148,
    duration: "8 weeks",
    level: "Beginner",
    rating: 4.8,
    progress: 54,
    status: "Published",
    updated: "2026-10-20",
    updatedLabel: "Updated 5 days ago",
    lessons: 28,
    outline: [
      "User research and problem definition",
      "Information architecture and wireframes",
      "Visual hierarchy and design principles",
      "Interactive prototyping",
      "Portfolio-ready product case study",
    ],
  },
  {
    id: 6,
    title: "Machine Learning Essentials",
    category: "AI & Data Science",
    description:
      "Explore supervised learning, model evaluation and machine learning projects through practical examples.",
    instructor: "Arjun Malhotra",
    initials: "AM",
    learners: 203,
    duration: "12 weeks",
    level: "Intermediate",
    rating: 4.9,
    progress: 35,
    status: "Published",
    updated: "2026-10-21",
    updatedLabel: "Updated 4 days ago",
    lessons: 44,
    outline: [
      "Data preparation and feature engineering",
      "Regression and classification",
      "Model training and validation",
      "Evaluation metrics and tuning",
      "End-to-end machine learning project",
    ],
  },
  {
    id: 7,
    title: "Advanced React Architecture",
    category: "Development",
    description:
      "Build maintainable React applications with reusable components, scalable state and testing strategies.",
    instructor: "Aman Sharma",
    initials: "AS",
    learners: 0,
    duration: "6 weeks",
    level: "Advanced",
    rating: 0,
    progress: 0,
    status: "Draft",
    updated: "2026-10-24",
    updatedLabel: "Draft · Not published",
    lessons: 24,
    outline: [
      "Component architecture and composition",
      "State management patterns",
      "Performance optimization",
      "Component testing",
      "Maintainable frontend structure",
    ],
  },
  {
    id: 8,
    title: "Cybersecurity Fundamentals",
    category: "Cloud & DevOps",
    description:
      "Learn essential security concepts, safe system practices and defensive monitoring fundamentals.",
    instructor: "Rohit Saini",
    initials: "RS",
    learners: 0,
    duration: "7 weeks",
    level: "Beginner",
    rating: 0,
    progress: 0,
    status: "Draft",
    updated: "2026-10-18",
    updatedLabel: "Draft · Not published",
    lessons: 26,
    outline: [
      "Security principles and threat awareness",
      "Network and endpoint basics",
      "Identity and access management",
      "Security monitoring",
      "Defensive security case study",
    ],
  },
];

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.28, staggerChildren: 0.045 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

/* =========================================================
   SHARED STYLES
========================================================= */

const inputClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#0b1422] px-3.5 py-3 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/10";

const secondaryButtonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-sky-300/25 hover:bg-sky-300/[0.05] hover:text-sky-100";

/* =========================================================
   ANIMATED DROPDOWN
========================================================= */

function PremiumDropdown({ value, options, onChange, icon: Icon, label }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    const closeOnOutsideClick = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const closeOnEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);

    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative min-w-0">
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className={[
          "flex min-h-[42px] w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5",
          "text-left text-xs font-semibold outline-none transition-all duration-200",
          open
            ? "border-sky-300/40 bg-sky-300/[0.06] text-white ring-2 ring-sky-300/10"
            : "border-white/[0.09] bg-[#101a2a] text-slate-300 hover:border-white/[0.16] hover:bg-white/[0.035]",
        ].join(" ")}
      >
        <span className="flex min-w-0 items-center gap-2.5">
          {Icon && <Icon size={15} className="shrink-0 text-sky-300" />}
          <span className="truncate">{value}</span>
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.18 }}
          className="shrink-0 text-slate-500"
        >
          <ChevronDown size={15} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.985 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-[calc(100%+8px)] z-[80] max-h-64 w-full min-w-[190px] overflow-y-auto rounded-2xl border border-white/[0.1] bg-[#0d1726] p-1.5 shadow-2xl shadow-black/40"
          >
            <p className="px-3 py-2 text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
              {label}
            </p>

            {options.map((option) => {
              const selected = option === value;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setOpen(false);
                  }}
                  className={[
                    "flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-xs transition",
                    selected
                      ? "bg-sky-300/10 font-semibold text-sky-200"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white",
                  ].join(" ")}
                >
                  <span>{option}</span>
                  {selected && (
                    <Check size={14} className="shrink-0 text-sky-300" />
                  )}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const published = status === "Published";

  return (
    <span
      className={[
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        published
          ? "border-sky-300/20 bg-sky-300/[0.08] text-sky-200"
          : "border-amber-300/20 bg-amber-300/[0.08] text-amber-200",
      ].join(" ")}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          published ? "bg-sky-300" : "bg-amber-300",
        ].join(" ")}
      />
      {status}
    </span>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ icon: Icon, label, value, note, accent }) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.07] bg-[#0e1726] p-4 transition-all duration-200 hover:border-sky-300/20 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-[28px]">
            {value}
          </p>
        </div>

        <div
          className={[
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
            accent,
          ].join(" ")}
        >
          <Icon size={19} />
        </div>
      </div>

      <p className="mt-3 flex items-center gap-1.5 text-[10px] text-slate-500 sm:text-[11px]">
        <TrendingUp size={13} className="shrink-0 text-sky-300" />
        {note}
      </p>

      <div className="pointer-events-none absolute -bottom-10 -right-5 h-24 w-24 rounded-full bg-sky-300/[0.035] blur-2xl transition-colors group-hover:bg-sky-300/[0.08]" />
    </motion.div>
  );
}

/* =========================================================
   ADD COURSE MODAL
========================================================= */

function AddCourseModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    category: "Development",
    instructor: "",
    duration: "8 weeks",
    level: "Beginner",
  });

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.title.trim() || !form.instructor.trim()) return;

    onCreate(form);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020617]/80 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-course-title"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.2 }}
        className="my-auto w-full max-w-xl overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0e1726] shadow-2xl shadow-black/50"
      >
        <div className="relative border-b border-white/[0.07] px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-400/[0.07] blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/20 bg-sky-300/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-200">
                <Sparkles size={12} />
                Course builder
              </span>
              <h2
                id="add-course-title"
                className="mt-3 text-xl font-bold text-white sm:text-2xl"
              >
                Create a new course
              </h2>
              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                Add the course details to create a draft in your workspace.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="space-y-4 px-5 py-5 sm:px-7 sm:py-6">
          <div>
            <label
              htmlFor="course-title"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              Course title <span className="text-sky-300">*</span>
            </label>
            <input
              id="course-title"
              required
              autoFocus
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. Advanced React Development"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="course-category"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Category
              </label>
              <div className="relative">
                <select
                  id="course-category"
                  value={form.category}
                  onChange={(event) => update("category", event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  {CATEGORIES.filter(
                    (category) => category !== "All categories"
                  ).map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="course-level"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Difficulty
              </label>
              <div className="relative">
                <select
                  id="course-level"
                  value={form.level}
                  onChange={(event) => update("level", event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  {["Beginner", "Intermediate", "Advanced"].map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="course-instructor"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Instructor name <span className="text-sky-300">*</span>
              </label>
              <input
                id="course-instructor"
                required
                value={form.instructor}
                onChange={(event) => update("instructor", event.target.value)}
                placeholder="Enter instructor name"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="course-duration"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Duration
              </label>
              <input
                id="course-duration"
                value={form.duration}
                onChange={(event) => update("duration", event.target.value)}
                placeholder="e.g. 8 weeks"
                className={inputClass}
              />
            </div>
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-300 px-5 py-3 text-xs font-bold text-[#07111f] transition hover:bg-sky-200 active:scale-[0.98]"
            >
              <Plus size={15} />
              Create draft
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   COURSE DETAILS MODAL
========================================================= */

function CourseDetailsModal({ course, onClose, onToggleStatus }) {
  if (!course) return null;

  const style =
    categoryStyles[course.category] || categoryStyles.Development;
  const Icon = style.icon;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020617]/80 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.currentTarget === event.target) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="course-detail-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.2 }}
        className="my-auto w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0e1726] shadow-2xl shadow-black/50"
      >
        <div
          className={`relative overflow-hidden border-b border-white/[0.07] bg-gradient-to-br ${style.glow} p-5 sm:p-7`}
        >
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-sky-300/[0.05] blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div
              className={`flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.08] ${style.iconClass}`}
            >
              <Icon size={23} />
            </div>
            <button
              type="button"
              aria-label="Close course details"
              onClick={onClose}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.1] bg-black/10 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <div className="relative mt-5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${style.badgeClass}`}
              >
                {course.category}
              </span>
              <StatusBadge status={course.status} />
            </div>

            <h2
              id="course-detail-title"
              className="mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl"
            >
              {course.title}
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
              {course.description}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:px-7">
          {[
            { icon: Users, label: "Learners", value: course.learners },
            { icon: MonitorPlay, label: "Lessons", value: course.lessons },
            { icon: Clock3, label: "Duration", value: course.duration },
            {
              icon: Star,
              label: "Rating",
              value: course.rating ? course.rating.toFixed(1) : "Not rated",
            },
          ].map((stat) => {
            const StatIcon = stat.icon;

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5"
              >
                <StatIcon size={16} className="text-sky-300" />
                <p className="mt-3 text-sm font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-5 sm:px-7 sm:pb-7">
          <div className="flex items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-sky-300/10 text-xs font-bold text-sky-200">
              {course.initials}
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white">
                {course.instructor}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                Course instructor
              </p>
            </div>

            <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] text-slate-400">
              {course.level}
            </span>
          </div>

          <div className="mt-5">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">
                Course curriculum
              </h3>
              <span className="text-[10px] text-slate-500">
                {course.outline?.length || 0} modules
              </span>
            </div>

            <div className="space-y-2">
              {(course.outline || []).map((item, index) => (
                <div
                  key={`${course.id}-${item}`}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-300/10 text-[10px] font-bold text-sky-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="min-w-0 flex-1 text-xs leading-5 text-slate-300">
                    {item}
                  </p>
                  <Check size={14} className="shrink-0 text-slate-600" />
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className={secondaryButtonClass}
            >
              Close details
            </button>
            <button
              type="button"
              onClick={() => {
                onToggleStatus(course.id);
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-3 text-xs font-bold text-[#07111f] transition hover:bg-sky-200"
            >
              {course.status === "Published" ? "Move to draft" : "Publish course"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   COURSE CARD
========================================================= */

function CourseCard({
  course,
  index,
  viewMode,
  onView,
  onToggleStatus,
  onDuplicate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const style =
    categoryStyles[course.category] || categoryStyles.Development;
  const Icon = style.icon;

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <motion.article
      layout
      variants={itemVariants}
      transition={{ layout: { duration: 0.22 } }}
      className={[
        "group relative min-w-0 overflow-visible rounded-[20px] border",
        "border-white/[0.07] bg-[#101a2a] transition-all duration-200",
        "hover:-translate-y-0.5 hover:border-sky-300/20 hover:shadow-xl hover:shadow-black/10",
        viewMode === "list" ? "flex flex-col sm:flex-row" : "",
      ].join(" ")}
    >
      {/* VISUAL HEADER */}

      <div
        className={[
          "relative overflow-hidden border-b border-white/[0.06] bg-gradient-to-br",
          style.glow,
          viewMode === "list"
            ? "h-36 sm:h-auto sm:w-[190px] sm:shrink-0 sm:border-b-0 sm:border-r"
            : "h-[145px] rounded-t-[20px]",
        ].join(" ")}
      >
        <div className="pointer-events-none absolute -right-5 -top-8 h-32 w-32 rounded-full border border-white/[0.045]" />
        <div className="pointer-events-none absolute right-4 top-4 h-20 w-20 rounded-full border border-white/[0.035]" />
        <div className="pointer-events-none absolute -bottom-8 left-8 h-24 w-24 rounded-full bg-white/[0.025] blur-2xl" />

        <div className="relative flex h-full flex-col justify-between p-4">
          <div className="flex items-start justify-between gap-3">
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.08] bg-[#0b1422]/70 ${style.iconClass}`}
            >
              <Icon size={22} />
            </div>

            <div className="flex items-center gap-2">
              {course.rating > 0 && (
                <span className="inline-flex items-center gap-1 rounded-full border border-white/[0.09] bg-[#0b1422]/65 px-2.5 py-1.5 text-[10px] font-semibold text-slate-200">
                  <Star size={11} className="fill-amber-300 text-amber-300" />
                  {course.rating.toFixed(1)}
                </span>
              )}

              <div className="relative" ref={menuRef}>
                <button
                  type="button"
                  onClick={() => setMenuOpen((current) => !current)}
                  aria-label={`More actions for ${course.title}`}
                  aria-expanded={menuOpen}
                  className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.09] bg-[#0b1422]/65 text-slate-300 transition hover:bg-white/[0.1] hover:text-white"
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
                      className="absolute right-0 top-10 z-[90] w-48 rounded-2xl border border-white/[0.1] bg-[#0d1726] p-1.5 shadow-2xl shadow-black/40"
                    >
                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onView(course);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <Eye size={14} className="text-sky-300" />
                        View course
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onToggleStatus(course.id);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <Check size={14} className="text-sky-300" />
                        {course.status === "Published"
                          ? "Move to draft"
                          : "Publish course"}
                      </button>

                      <div className="my-1 border-t border-white/[0.06]" />

                      <button
                        type="button"
                        onClick={() => {
                          setMenuOpen(false);
                          onDuplicate(course);
                        }}
                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <Copy size={14} className="text-cyan-300" />
                        Duplicate course
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex min-w-0 flex-wrap items-center gap-1.5">
              <span
                className={`rounded-full border px-2.5 py-1 text-[9px] font-semibold ${style.badgeClass}`}
              >
                {course.category}
              </span>
              <StatusBadge status={course.status} />
            </div>

            <span className="rounded-lg border border-white/[0.07] bg-black/[0.12] px-2 py-1 text-[9px] font-medium text-slate-400">
              {course.level}
            </span>
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
          <h3 className="line-clamp-2 text-base font-bold leading-6 text-white transition-colors group-hover:text-sky-200">
            {course.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-[40px] text-[11px] leading-5 text-slate-400 sm:text-xs">
            {course.description}
          </p>
        </div>

        <div className="mt-4 flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-300/10 bg-sky-300/10 text-[10px] font-bold text-sky-200">
            {course.initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-slate-200">
              {course.instructor}
            </p>
            <p className="mt-0.5 text-[9px] text-slate-500">
              Course instructor
            </p>
          </div>
          {course.rating > 0 && (
            <span className="inline-flex shrink-0 items-center gap-1 text-[10px] text-slate-400">
              <Star size={11} className="fill-amber-300 text-amber-300" />
              {course.rating.toFixed(1)}
            </span>
          )}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-x-2 gap-y-3 border-t border-white/[0.06] pt-4">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Users size={13} className="shrink-0 text-sky-300/80" />
            <span>{course.learners.toLocaleString("en-IN")} learners</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <Clock3 size={13} className="shrink-0 text-sky-300/80" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <MonitorPlay size={13} className="shrink-0 text-sky-300/80" />
            <span>{course.lessons} lessons</span>
          </div>
          <div className="flex min-w-0 items-center gap-2 text-[10px] text-slate-400">
            <CalendarDays size={13} className="shrink-0 text-sky-300/80" />
            <span className="truncate">{course.updatedLabel}</span>
          </div>
        </div>

        {course.status === "Published" && (
          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500">
                Course engagement
              </span>
              <span className="text-[10px] font-semibold text-sky-300">
                {course.progress}%
              </span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${course.progress}%` }}
                transition={{
                  duration: 0.55,
                  delay: index * 0.025,
                  ease: "easeOut",
                }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
              />
            </div>
          </div>
        )}

        <div className="mt-5 flex items-center gap-2">
          <button
            type="button"
            onClick={() => onView(course)}
            className="inline-flex min-h-[39px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-[11px] font-semibold text-slate-200 transition hover:border-sky-300/25 hover:bg-sky-300/[0.06] hover:text-sky-200"
          >
            <Eye size={14} />
            View details
          </button>
          <button
            type="button"
            onClick={() => onToggleStatus(course.id)}
            title={course.status === "Published" ? "Move to draft" : "Publish course"}
            aria-label={course.status === "Published" ? "Move to draft" : "Publish course"}
            className={[
              "flex h-[39px] w-[42px] shrink-0 items-center justify-center rounded-xl border transition",
              course.status === "Published"
                ? "border-sky-300/20 bg-sky-300/10 text-sky-200 hover:bg-sky-300/15"
                : "border-amber-300/20 bg-amber-300/10 text-amber-200 hover:bg-amber-300/15",
            ].join(" ")}
          >
            <Check size={15} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function CollegeCoursesPage() {
  const [courses, setCourses] = useState(INITIAL_COURSES);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All courses");
  const [sortBy, setSortBy] = useState("Recently updated");
  const [viewMode, setViewMode] = useState("grid");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [notice, setNotice] = useState("");

  const noticeTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const showNotice = (message) => {
    setNotice(message);
    if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    noticeTimer.current = window.setTimeout(() => setNotice(""), 3200);
  };

  const publishedCount = courses.filter(
    (course) => course.status === "Published"
  ).length;

  const draftCount = courses.filter(
    (course) => course.status === "Draft"
  ).length;

  const totalLearners = courses.reduce(
    (total, course) => total + course.learners,
    0
  );

  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = courses.filter((course) => {
      const matchesSearch =
        !query ||
        course.title.toLowerCase().includes(query) ||
        course.category.toLowerCase().includes(query) ||
        course.instructor.toLowerCase().includes(query) ||
        course.description.toLowerCase().includes(query);

      const matchesCategory =
        categoryFilter === "All categories" ||
        course.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All courses" || course.status === statusFilter;

      return matchesSearch && matchesCategory && matchesStatus;
    });

    if (sortBy === "Most enrolled") {
      result.sort((a, b) => b.learners - a.learners);
    } else if (sortBy === "Highest rated") {
      result.sort((a, b) => b.rating - a.rating);
    } else if (sortBy === "A–Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      result.sort((a, b) => b.updated.localeCompare(a.updated));
    }

    return result;
  }, [courses, searchQuery, categoryFilter, statusFilter, sortBy]);

  const clearFilters = () => {
    setSearchQuery("");
    setCategoryFilter("All categories");
    setStatusFilter("All courses");
    setSortBy("Recently updated");
  };

  const handleCreateCourse = (form) => {
    const newCourse = {
      id: Math.max(0, ...courses.map((course) => course.id)) + 1,
      title: form.title.trim(),
      category: form.category,
      description:
        "Add the course overview, learning objectives, modules and resources while preparing this course for publication.",
      instructor: form.instructor.trim(),
      initials: form.instructor
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() || "")
        .join(""),
      learners: 0,
      duration: form.duration.trim() || "Not set",
      level: form.level,
      rating: 0,
      progress: 0,
      status: "Draft",
      updated: new Date().toISOString().slice(0, 10),
      updatedLabel: "Draft · Not published",
      lessons: 0,
      outline: [
        "Define learning objectives",
        "Add course modules and lessons",
        "Attach learning resources",
        "Review curriculum before publishing",
      ],
    };

    setCourses((current) => [newCourse, ...current]);
    setSearchQuery("");
    setCategoryFilter("All categories");
    setStatusFilter("All courses");
    setSortBy("Recently updated");
    setIsAddOpen(false);
    showNotice("Course draft created successfully.");
  };

  const handleToggleStatus = (courseId) => {
    const course = courses.find((item) => item.id === courseId);
    if (!course) return;

    const nextStatus =
      course.status === "Published" ? "Draft" : "Published";

    setCourses((current) =>
      current.map((item) =>
        item.id === courseId
          ? {
            ...item,
            status: nextStatus,
            updated: new Date().toISOString().slice(0, 10),
            updatedLabel:
              nextStatus === "Published"
                ? "Recently published"
                : "Draft · Not published",
          }
          : item
      )
    );

    showNotice(
      nextStatus === "Published"
        ? `"${course.title}" marked as published.`
        : `"${course.title}" moved to drafts.`
    );
  };

  const handleDuplicateCourse = (course) => {
    const duplicate = {
      ...course,
      id: Math.max(0, ...courses.map((item) => item.id)) + 1,
      title: `${course.title} (Copy)`,
      learners: 0,
      rating: 0,
      progress: 0,
      status: "Draft",
      updated: new Date().toISOString().slice(0, 10),
      updatedLabel: "Draft · Not published",
    };

    setCourses((current) => [duplicate, ...current]);
    setSearchQuery("");
    setCategoryFilter("All categories");
    setStatusFilter("All courses");
    setSortBy("Recently updated");
    showNotice("Course duplicated as a draft.");
  };

  return (
    <>
      {/* Outer padding here fixes the page touching the sidebar edges. */}
      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="box-border mx-auto w-full min-w-0 max-w-[1600px] space-y-5 px-4 py-5 text-slate-100 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6 lg:py-6 2xl:px-7"
      >
        {/* PAGE HERO */}

        <motion.section
          variants={itemVariants}
          className="relative isolate overflow-hidden rounded-[22px] border border-white/[0.08] bg-gradient-to-br from-[#102131] via-[#0e1a29] to-[#0c1725] p-5 sm:rounded-[24px] sm:p-7 lg:p-8"
        >
          <div className="pointer-events-none absolute -right-8 -top-12 h-56 w-56 rounded-full bg-sky-400/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-1/3 h-32 w-44 rounded-full bg-blue-400/[0.05] blur-3xl" />

          <div className="relative flex min-w-0 flex-col justify-between gap-6 xl:flex-row xl:items-end">
            <div className="min-w-0 max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-sky-300/20 bg-sky-300/[0.07] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-sky-200 sm:text-[10px]">
                <Sparkles size={13} />
                Academic management
              </div>

              <h1 className="mt-4 text-[26px] font-bold leading-tight tracking-tight text-white sm:text-3xl lg:text-[36px]">
                Courses &{" "}
                <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                  Programs
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm sm:leading-7">
                Manage your institution&apos;s learning programs, organize
                course content and keep track of student engagement from one
                workspace.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400 sm:text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                  {publishedCount} published courses
                </span>
                <span className="hidden h-3 w-px bg-white/10 sm:block" />
                <span className="inline-flex items-center gap-1.5">
                  <Activity size={13} className="text-sky-300" />
                  Course workspace
                </span>
              </div>
            </div>

            <div className="relative flex flex-col gap-2 sm:flex-row xl:shrink-0">
              <Link
                to="/college/analytics"
                className={`${secondaryButtonClass} min-h-[43px]`}
              >
                <TrendingUp size={15} />
                View analytics
                <ArrowUpRight size={14} className="text-slate-500" />
              </Link>

              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-2.5 text-xs font-bold text-[#07111f] shadow-lg shadow-sky-500/10 transition hover:-translate-y-0.5 hover:bg-sky-200 active:translate-y-0"
              >
                <Plus size={16} strokeWidth={2.5} />
                Add new course
              </button>
            </div>
          </div>
        </motion.section>

        {/* STATS */}

        <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Layers3}
            label="Total courses"
            value={courses.length}
            note="Across all categories"
            accent="bg-sky-400/10 text-sky-300"
          />
          <StatCard
            icon={Check}
            label="Published"
            value={publishedCount}
            note="Available in your catalog"
            accent="bg-cyan-400/10 text-cyan-300"
          />
          <StatCard
            icon={Users}
            label="Total learners"
            value={totalLearners.toLocaleString("en-IN")}
            note="Across published and draft programs"
            accent="bg-blue-400/10 text-blue-300"
          />
          <StatCard
            icon={BookOpen}
            label="Drafts"
            value={draftCount}
            note="Courses waiting for review"
            accent="bg-amber-400/10 text-amber-300"
          />
        </section>

        {/* COURSE CATALOG */}

        <motion.section
          variants={itemVariants}
          className="relative min-w-0 rounded-[22px] border border-white/[0.08] bg-[#0c1523] sm:rounded-[24px]"
        >
          {/* CATALOG HEADER */}

          <div className="flex min-w-0 flex-col justify-between gap-4 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.08] text-sky-300">
                <BookOpen size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white sm:text-base">
                  Course catalog
                </h2>
                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                  Browse, filter and manage your courses
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="relative min-w-0 flex-1 sm:min-w-[220px] lg:w-[250px] lg:flex-none">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search courses, trainer..."
                  aria-label="Search courses"
                  className="h-[42px] w-full rounded-xl border border-white/[0.09] bg-[#101a2a] pl-10 pr-9 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-sky-300/40 focus:ring-2 focus:ring-sky-300/10"
                />
                {searchQuery && (
                  <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>

              <div className="flex shrink-0 items-center gap-1 rounded-xl border border-white/[0.08] bg-[#101a2a] p-1">
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  aria-label="Grid view"
                  aria-pressed={viewMode === "grid"}
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg transition",
                    viewMode === "grid"
                      ? "bg-sky-300/15 text-sky-200"
                      : "text-slate-500 hover:text-slate-200",
                  ].join(" ")}
                >
                  <LayoutGrid size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("list")}
                  aria-label="List view"
                  aria-pressed={viewMode === "list"}
                  className={[
                    "flex h-8 w-8 items-center justify-center rounded-lg transition",
                    viewMode === "list"
                      ? "bg-sky-300/15 text-sky-200"
                      : "text-slate-500 hover:text-slate-200",
                  ].join(" ")}
                >
                  <List size={15} />
                </button>
              </div>
            </div>
          </div>

          {/* FILTER BAR */}

          <div className="space-y-4 border-b border-white/[0.07] p-4 sm:p-5 lg:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                <Filter size={13} className="text-sky-300" />
                Filter catalog
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-3 xl:w-[600px]">
                <PremiumDropdown
                  value={categoryFilter}
                  options={CATEGORIES}
                  onChange={setCategoryFilter}
                  icon={Layers3}
                  label="Category"
                />
                <PremiumDropdown
                  value={statusFilter}
                  options={STATUSES}
                  onChange={setStatusFilter}
                  icon={Check}
                  label="Status"
                />
                <PremiumDropdown
                  value={sortBy}
                  options={SORT_OPTIONS}
                  onChange={setSortBy}
                  icon={TrendingUp}
                  label="Sort by"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {CATEGORIES.map((category) => {
                const active = categoryFilter === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setCategoryFilter(category)}
                    className={[
                      "rounded-full border px-3.5 py-2 text-[10px] font-semibold transition-all duration-200",
                      active
                        ? "border-sky-300/30 bg-sky-300/10 text-sky-200"
                        : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-slate-200",
                    ].join(" ")}
                  >
                    {category}
                  </button>
                );
              })}

              {(categoryFilter !== "All categories" ||
                statusFilter !== "All courses" ||
                searchQuery ||
                sortBy !== "Recently updated") && (
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-semibold text-sky-300 transition hover:bg-sky-300/[0.06] hover:text-sky-200"
                  >
                    <X size={12} />
                    Reset filters
                  </button>
                )}
            </div>
          </div>

          {/* RESULTS SUMMARY */}

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredCourses.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">{courses.length}</span>{" "}
              courses
              {categoryFilter !== "All categories" && (
                <span className="text-slate-500"> in {categoryFilter}</span>
              )}
            </p>

            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
              <Zap size={12} className="text-sky-300" />
              Live filters
            </span>
          </div>

          {/* COURSE GRID / LIST */}

          <div className="min-w-0 px-4 pb-5 sm:px-5 sm:pb-6 lg:px-6">
            <AnimatePresence mode="wait">
              {filteredCourses.length > 0 ? (
                <motion.div
                  key={`${viewMode}-${categoryFilter}-${statusFilter}-${sortBy}-${searchQuery}`}
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
                  {filteredCourses.map((course, index) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      index={index}
                      viewMode={viewMode}
                      onView={setSelectedCourse}
                      onToggleStatus={handleToggleStatus}
                      onDuplicate={handleDuplicateCourse}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-courses"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[270px] flex-col items-center justify-center px-4 py-12 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-300/[0.07] text-sky-300">
                    <Search size={23} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">
                    No courses found
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
                    Try another search term or adjust your category and status
                    filters.
                  </p>
                  <button
                    type="button"
                    onClick={clearFilters}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-300 px-4 py-3 text-xs font-bold text-[#07111f] transition hover:bg-sky-200"
                  >
                    <X size={14} />
                    Clear all filters
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

        {/* BOTTOM SHORTCUTS */}

        <motion.section
          variants={itemVariants}
          className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3"
        >
          <div className="rounded-2xl border border-white/[0.07] bg-[#0e1726] p-5 sm:p-6 lg:col-span-2">
            <div className="flex items-start gap-3.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-300/10 text-sky-300">
                <GraduationCap size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-bold text-white">
                  Keep your programs organized
                </h3>
                <p className="mt-1.5 max-w-2xl text-xs leading-6 text-slate-400">
                  Review drafts, verify instructors and keep your learning
                  catalog updated so students can discover relevant programs.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link to="/college/trainers" className={secondaryButtonClass}>
                    <Users size={14} />
                    Manage trainers
                    <ArrowUpRight size={13} />
                  </Link>
                  <Link
                    to="/college/class-schedule"
                    className={secondaryButtonClass}
                  >
                    <CalendarDays size={14} />
                    Class schedule
                    <ArrowUpRight size={13} />
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden rounded-2xl border border-sky-300/15 bg-gradient-to-br from-sky-300/[0.09] via-[#102033] to-[#0e1726] p-5 sm:p-6">
            <div className="pointer-events-none absolute -right-5 -top-5 h-24 w-24 rounded-full bg-sky-300/[0.07] blur-2xl" />

            <div className="relative">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.08] text-sky-200">
                  <Sparkles size={19} />
                </span>
                <span className="rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.12em] text-sky-200">
                  Quick action
                </span>
              </div>

              <h3 className="mt-4 text-sm font-bold text-white">
                Add a new program
              </h3>
              <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                Create a draft, organize its details and prepare it for review.
              </p>
              <button
                type="button"
                onClick={() => setIsAddOpen(true)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-sky-200 transition hover:text-sky-100"
              >
                Create a course
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* FOOTER */}

        <motion.footer
          variants={itemVariants}
          className="flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-4 text-[10px] text-slate-600 sm:flex-row sm:items-center"
        >
          <p>
            CodeFaculty College Workspace
            <span className="mx-2 text-slate-700">·</span>
            Courses & Programs
          </p>
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            <span>Workspace ready</span>
          </div>
        </motion.footer>
      </motion.div>

      {/* ADD COURSE MODAL */}

      <AnimatePresence>
        {isAddOpen && (
          <AddCourseModal
            key="add-course-modal"
            onClose={() => setIsAddOpen(false)}
            onCreate={handleCreateCourse}
          />
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}

      <AnimatePresence>
        {selectedCourse && (
          <CourseDetailsModal
            key={`course-details-${selectedCourse.id}`}
            course={
              courses.find((course) => course.id === selectedCourse.id) ||
              selectedCourse
            }
            onClose={() => setSelectedCourse(null)}
            onToggleStatus={handleToggleStatus}
          />
        )}
      </AnimatePresence>

      {/* ACTION NOTICE */}

      <AnimatePresence>
        {notice && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            className="fixed bottom-4 right-4 z-[120] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-sky-300/20 bg-[#0d1d2b] px-4 py-3.5 shadow-2xl shadow-black/40"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-sky-300/10 text-sky-200">
              <Check size={16} />
            </span>
            <p className="text-xs font-semibold text-sky-100">{notice}</p>
            <button
              type="button"
              onClick={() => setNotice("")}
              aria-label="Dismiss notification"
              className="ml-1 shrink-0 text-sky-100/60 transition hover:text-white"
            >
              <X size={15} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}