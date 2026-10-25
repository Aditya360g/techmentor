import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  CircleDashed,
  Clock3,
  Copy,
  Download,
  Eye,
  FileText,
  Filter,
  Flag,
  GraduationCap,
  Layers3,
  LayoutGrid,
  List,
  MoreHorizontal,
  Paperclip,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  X,
  ClipboardList,
} from "lucide-react";

/* =========================================================
   COLLEGE ASSIGNMENTS
   Premium College Portal · Navy + Ice Blue
   Demo data is local to this page.
========================================================= */

const TYPE_OPTIONS = [
  "All types",
  "Assignment",
  "Quiz",
  "Project",
  "Coding Test",
];

const STATUS_OPTIONS = [
  "All statuses",
  "Published",
  "In Review",
  "Draft",
  "Closed",
];

const PRIORITY_OPTIONS = ["All priorities", "High", "Medium", "Low"];

const SORT_OPTIONS = [
  "Due date",
  "Recently updated",
  "Most submissions",
  "A–Z",
];

const COURSE_OPTIONS = [
  "Full Stack Web Development",
  "Python for Data Science",
  "Java & DSA Masterclass",
  "Cloud & DevOps Foundations",
  "Machine Learning Essentials",
];

const INITIAL_ASSIGNMENTS = [
  {
    id: "ASG-204",
    title: "React Components & State Management",
    course: "Full Stack Web Development",
    type: "Assignment",
    description:
      "Build a reusable component system and demonstrate state handling with a clean, responsive interface.",
    dueDate: "2026-10-29",
    status: "Published",
    priority: "High",
    assignedTo: "Batch A · Full Stack",
    instructor: "Aman Sharma",
    instructorInitials: "AS",
    submitted: 42,
    totalStudents: 60,
    marks: 20,
    attachments: 2,
    updated: "2026-10-24",
    instructions: [
      "Use reusable React components.",
      "Manage component state correctly.",
      "Include responsive styling.",
      "Submit the source code with a short README.",
    ],
  },
  {
    id: "ASG-203",
    title: "Python Data Analysis Report",
    course: "Python for Data Science",
    type: "Project",
    description:
      "Analyze the provided dataset, identify useful trends and present your findings with charts.",
    dueDate: "2026-10-31",
    status: "Published",
    priority: "Medium",
    assignedTo: "Batch B · Data Science",
    instructor: "Priya Verma",
    instructorInitials: "PV",
    submitted: 31,
    totalStudents: 48,
    marks: 50,
    attachments: 3,
    updated: "2026-10-23",
    instructions: [
      "Clean and validate the dataset.",
      "Document the analysis process.",
      "Include at least three meaningful visualizations.",
      "Submit a report and runnable notebook.",
    ],
  },
  {
    id: "ASG-202",
    title: "DSA Weekly Problem Set",
    course: "Java & DSA Masterclass",
    type: "Coding Test",
    description:
      "Solve the assigned algorithmic problems and explain the time and space complexity of each solution.",
    dueDate: "2026-10-27",
    status: "In Review",
    priority: "High",
    assignedTo: "Batch A · Java & DSA",
    instructor: "Rahul Mehta",
    instructorInitials: "RM",
    submitted: 54,
    totalStudents: 60,
    marks: 30,
    attachments: 1,
    updated: "2026-10-25",
    instructions: [
      "Write readable Java solutions.",
      "Test edge cases.",
      "Add time and space complexity.",
      "Submit all solutions before the deadline.",
    ],
  },
  {
    id: "ASG-201",
    title: "Docker & Deployment Fundamentals",
    course: "Cloud & DevOps Foundations",
    type: "Assignment",
    description:
      "Containerize a small application and document the steps needed to run it locally.",
    dueDate: "2026-11-02",
    status: "Published",
    priority: "Medium",
    assignedTo: "Batch C · DevOps",
    instructor: "Neha Kapoor",
    instructorInitials: "NK",
    submitted: 18,
    totalStudents: 40,
    marks: 25,
    attachments: 2,
    updated: "2026-10-22",
    instructions: [
      "Create a working Dockerfile.",
      "Document the required environment variables.",
      "Build and run the application.",
      "Include setup instructions in the README.",
    ],
  },
  {
    id: "ASG-200",
    title: "Machine Learning Model Evaluation",
    course: "Machine Learning Essentials",
    type: "Quiz",
    description:
      "Demonstrate your understanding of evaluation metrics, overfitting and model validation.",
    dueDate: "2026-11-04",
    status: "Draft",
    priority: "Low",
    assignedTo: "Batch B · AI & ML",
    instructor: "Arjun Malhotra",
    instructorInitials: "AM",
    submitted: 0,
    totalStudents: 42,
    marks: 15,
    attachments: 0,
    updated: "2026-10-21",
    instructions: [
      "Review the course evaluation material.",
      "Answer all questions independently.",
      "Check each answer before submission.",
    ],
  },
  {
    id: "ASG-199",
    title: "Java OOP Mini Project",
    course: "Java & DSA Masterclass",
    type: "Project",
    description:
      "Design a small Java application using classes, interfaces and clear object-oriented principles.",
    dueDate: "2026-10-20",
    status: "Closed",
    priority: "Medium",
    assignedTo: "Batch A · Java & DSA",
    instructor: "Rahul Mehta",
    instructorInitials: "RM",
    submitted: 57,
    totalStudents: 60,
    marks: 40,
    attachments: 1,
    updated: "2026-10-20",
    instructions: [
      "Use a clear object-oriented design.",
      "Separate responsibilities into classes.",
      "Include basic test cases.",
      "Submit the project with setup instructions.",
    ],
  },
];

const itemVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, staggerChildren: 0.045 },
  },
};

const secondaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-3.5 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-sky-300/25 hover:bg-sky-300/[0.05] hover:text-sky-100";

/* =========================================================
   DATE HELPERS
========================================================= */

function formatDate(dateString) {
  if (!dateString) return "Not set";

  const date = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(date.getTime())) return dateString;

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function getDueLabel(dateString) {
  if (!dateString) return "No deadline";

  const dueDate = new Date(`${dateString}T00:00:00`);
  const today = new Date();

  today.setHours(0, 0, 0, 0);

  if (Number.isNaN(dueDate.getTime())) return "Date not set";

  const daysLeft = Math.round(
    (dueDate.getTime() - today.getTime()) / 86400000
  );

  if (daysLeft < 0) {
    const daysOverdue = Math.abs(daysLeft);
    return `${daysOverdue} day${daysOverdue === 1 ? "" : "s"} overdue`;
  }

  if (daysLeft === 0) return "Due today";
  if (daysLeft === 1) return "Due tomorrow";

  return `${daysLeft} days left`;
}

function isOverdue(assignment) {
  if (
    assignment.status === "Closed" ||
    assignment.status === "Draft" ||
    !assignment.dueDate
  ) {
    return false;
  }

  const dueDate = new Date(`${assignment.dueDate}T23:59:59`);

  return dueDate.getTime() < Date.now();
}

/* =========================================================
   ANIMATED DROPDOWN
========================================================= */

function PremiumDropdown({
  value,
  options,
  onChange,
  icon: Icon,
  label,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const closeOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", closeOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", closeOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div className="relative min-w-0" ref={dropdownRef}>
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
          {Icon && (
            <Icon size={15} className="shrink-0 text-sky-300" />
          )}
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
              const active = value === option;

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
                    active
                      ? "bg-sky-300/10 font-semibold text-sky-200"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white",
                  ].join(" ")}
                >
                  <span>{option}</span>
                  {active && (
                    <Check
                      size={14}
                      className="shrink-0 text-sky-300"
                    />
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
   STATUS & PRIORITY BADGES
========================================================= */

function AssignmentStatus({ status }) {
  const styles = {
    Published: "border-sky-300/20 bg-sky-300/[0.08] text-sky-200",
    "In Review":
      "border-violet-300/20 bg-violet-300/[0.08] text-violet-200",
    Draft: "border-amber-300/20 bg-amber-300/[0.08] text-amber-200",
    Closed: "border-slate-400/20 bg-slate-400/[0.08] text-slate-300",
  };

  const currentStyle =
    styles[status] || "border-white/10 bg-white/[0.04] text-slate-300";

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold ${currentStyle}`}
    >
      <span
        className={[
          "h-1.5 w-1.5 rounded-full",
          status === "Published"
            ? "bg-sky-300"
            : status === "In Review"
              ? "bg-violet-300"
              : status === "Draft"
                ? "bg-amber-300"
                : "bg-slate-400",
        ].join(" ")}
      />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const styles = {
    High: "border-rose-300/20 bg-rose-300/[0.08] text-rose-200",
    Medium: "border-amber-300/20 bg-amber-300/[0.08] text-amber-200",
    Low: "border-sky-300/20 bg-sky-300/[0.08] text-sky-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        styles[priority] || styles.Medium,
      ].join(" ")}
    >
      <Flag size={10} />
      {priority}
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
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${accent}`}
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
   CREATE ASSIGNMENT MODAL
========================================================= */

function CreateAssignmentModal({ onClose, onCreate }) {
  const [form, setForm] = useState({
    title: "",
    course: COURSE_OPTIONS[0],
    type: "Assignment",
    dueDate: "",
    priority: "Medium",
    assignedTo: "",
    marks: "20",
    description: "",
  });

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.title.trim() ||
      !form.course ||
      !form.dueDate ||
      !form.assignedTo.trim()
    ) {
      return;
    }

    onCreate(form);
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020617]/80 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-assignment-title"
        initial={{ opacity: 0, y: 16, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.2 }}
        className="my-auto w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0e1726] shadow-2xl shadow-black/50"
      >
        <div className="relative border-b border-white/[0.07] px-5 py-5 sm:px-7 sm:py-6">
          <div className="pointer-events-none absolute right-0 top-0 h-28 w-28 rounded-full bg-sky-400/[0.07] blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-sky-300/20 bg-sky-300/[0.08] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-sky-200">
                <Sparkles size={12} />
                Assignment builder
              </span>

              <h2
                id="create-assignment-title"
                className="mt-3 text-xl font-bold text-white sm:text-2xl"
              >
                Create assignment
              </h2>

              <p className="mt-1.5 text-xs leading-5 text-slate-400">
                Prepare a new academic task for your students.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <X size={17} />
            </button>
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-4 px-5 py-5 sm:px-7 sm:py-6"
        >
          <div>
            <label
              htmlFor="assignment-title"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              Assignment title <span className="text-sky-300">*</span>
            </label>
            <input
              id="assignment-title"
              required
              autoFocus
              value={form.title}
              onChange={(event) => update("title", event.target.value)}
              placeholder="e.g. React component design task"
              className={inputClass}
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="assignment-course"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Course
              </label>
              <div className="relative">
                <select
                  id="assignment-course"
                  value={form.course}
                  onChange={(event) => update("course", event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  {COURSE_OPTIONS.map((course) => (
                    <option key={course} value={course}>
                      {course}
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
                htmlFor="assignment-type"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Assessment type
              </label>
              <div className="relative">
                <select
                  id="assignment-type"
                  value={form.type}
                  onChange={(event) => update("type", event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  {TYPE_OPTIONS.filter((type) => type !== "All types").map(
                    (type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    )
                  )}
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
                htmlFor="assignment-due"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Due date <span className="text-sky-300">*</span>
              </label>
              <input
                id="assignment-due"
                type="date"
                required
                value={form.dueDate}
                onChange={(event) => update("dueDate", event.target.value)}
                className={`${inputClass} scheme-dark`}
              />
            </div>

            <div>
              <label
                htmlFor="assignment-priority"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Priority
              </label>
              <div className="relative">
                <select
                  id="assignment-priority"
                  value={form.priority}
                  onChange={(event) => update("priority", event.target.value)}
                  className={`${inputClass} appearance-none pr-9`}
                >
                  {["High", "Medium", "Low"].map((priority) => (
                    <option key={priority} value={priority}>
                      {priority}
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
                htmlFor="assignment-batch"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Assign to batch <span className="text-sky-300">*</span>
              </label>
              <input
                id="assignment-batch"
                required
                value={form.assignedTo}
                onChange={(event) => update("assignedTo", event.target.value)}
                placeholder="e.g. Batch A · Full Stack"
                className={inputClass}
              />
            </div>

            <div>
              <label
                htmlFor="assignment-marks"
                className="mb-2 block text-xs font-semibold text-slate-300"
              >
                Total marks
              </label>
              <input
                id="assignment-marks"
                type="number"
                min="1"
                max="1000"
                value={form.marks}
                onChange={(event) => update("marks", event.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="assignment-description"
              className="mb-2 block text-xs font-semibold text-slate-300"
            >
              Instructions / description
            </label>
            <textarea
              id="assignment-description"
              rows={3}
              value={form.description}
              onChange={(event) => update("description", event.target.value)}
              placeholder="Describe the task and submission expectations..."
              className={`${inputClass} resize-y`}
            />
          </div>

          <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className={secondaryButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-300 px-5 py-3 text-xs font-bold text-[#07111f] transition hover:bg-sky-200 active:scale-[0.98]"
            >
              <Plus size={15} />
              Save as draft
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   ASSIGNMENT DETAILS MODAL
========================================================= */

function AssignmentDetailsModal({ assignment, onClose, onChangeStatus }) {
  if (!assignment) return null;

  const submissionPercent =
    assignment.totalStudents > 0
      ? Math.round(
        (assignment.submitted / assignment.totalStudents) * 100
      )
      : 0;

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020617]/80 p-3 backdrop-blur-md sm:p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby="assignment-detail-title"
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 12, scale: 0.985 }}
        transition={{ duration: 0.2 }}
        className="my-auto w-full max-w-2xl overflow-hidden rounded-[24px] border border-white/[0.1] bg-[#0e1726] shadow-2xl shadow-black/50"
      >
        <div className="relative overflow-hidden border-b border-white/[0.07] bg-gradient-to-br from-sky-400/[0.13] via-[#101e30] to-[#0e1726] p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-sky-300/[0.06] blur-3xl" />

          <div className="relative flex items-start justify-between gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-300/10 text-sky-200">
              <ClipboardList size={23} />
            </div>
            <button
              type="button"
              aria-label="Close details"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.1] bg-black/10 text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <div className="relative mt-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-sky-300/20 bg-sky-300/[0.08] px-2.5 py-1 text-[10px] font-semibold text-sky-200">
              {assignment.id}
            </span>
            <AssignmentStatus status={assignment.status} />
            <PriorityBadge priority={assignment.priority} />
          </div>

          <h2
            id="assignment-detail-title"
            className="relative mt-3 max-w-xl text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {assignment.title}
          </h2>

          <p className="relative mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
            {assignment.description}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 p-5 sm:grid-cols-4 sm:px-7">
          {[
            {
              icon: Users,
              label: "Submitted",
              value: `${assignment.submitted}/${assignment.totalStudents}`,
            },
            {
              icon: Target,
              label: "Total marks",
              value: assignment.marks,
            },
            {
              icon: CalendarDays,
              label: "Due date",
              value: formatDate(assignment.dueDate),
            },
            {
              icon: BookOpen,
              label: "Type",
              value: assignment.type,
            },
          ].map((stat) => {
            const StatIcon = stat.icon;

            return (
              <div
                key={stat.label}
                className="min-w-0 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-3.5"
              >
                <StatIcon size={16} className="text-sky-300" />
                <p className="mt-3 break-words text-sm font-bold text-white">
                  {stat.value}
                </p>
                <p className="mt-1 text-[10px] text-slate-500">{stat.label}</p>
              </div>
            );
          })}
        </div>

        <div className="px-5 pb-5 sm:px-7 sm:pb-7">
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.025] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold text-white">
                  Submission progress
                </p>
                <p className="mt-1 text-[10px] text-slate-500">
                  {assignment.submitted} submitted out of{" "}
                  {assignment.totalStudents} students
                </p>
              </div>
              <span className="text-sm font-bold text-sky-200">
                {submissionPercent}%
              </span>
            </div>
            <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${submissionPercent}%` }}
                transition={{ duration: 0.55, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300"
              />
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-sky-300/10 bg-sky-300/10 text-xs font-bold text-sky-200">
              {assignment.instructorInitials}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white">
                {assignment.instructor}
              </p>
              <p className="mt-1 text-[10px] text-slate-500">
                {assignment.course}
              </p>
            </div>
            <span className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[10px] text-slate-400">
              {assignment.assignedTo}
            </span>
          </div>

          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-white">
                Instructions
              </h3>
              <span className="text-[10px] text-slate-500">
                {assignment.instructions.length} steps
              </span>
            </div>
            <div className="space-y-2">
              {assignment.instructions.map((instruction, index) => (
                <div
                  key={`${assignment.id}-${instruction}`}
                  className="flex items-start gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3.5 py-3"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-sky-300/10 text-[10px] font-bold text-sky-200">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="pt-1 text-xs leading-5 text-slate-300">
                    {instruction}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-col-reverse gap-2 border-t border-white/[0.07] pt-5 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onClose}
              className={secondaryButton}
            >
              Close details
            </button>
            <button
              type="button"
              onClick={() => {
                onChangeStatus(assignment.id);
                onClose();
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-3 text-xs font-bold text-[#07111f] transition hover:bg-sky-200"
            >
              {assignment.status === "Closed"
                ? "Reopen assignment"
                : "Close assignment"}
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   ASSIGNMENT CARD
========================================================= */

function AssignmentCard({
  assignment,
  index,
  viewMode,
  onView,
  onChangeStatus,
  onDuplicate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const overdue = isOverdue(assignment);

  const percent =
    assignment.totalStudents > 0
      ? Math.round(
        (assignment.submitted / assignment.totalStudents) * 100
      )
      : 0;

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
        "group relative min-w-0 rounded-[20px] border border-white/[0.07] bg-[#101a2a]",
        "transition-all duration-200 hover:-translate-y-0.5 hover:border-sky-300/20 hover:shadow-xl hover:shadow-black/10",
        viewMode === "list" ? "flex flex-col sm:flex-row" : "",
      ].join(" ")}
    >
      {/* CARD TOP */}

      <div
        className={[
          "relative min-w-0 border-b border-white/[0.06] p-4",
          viewMode === "list"
            ? "sm:w-[225px] sm:shrink-0 sm:border-b-0 sm:border-r"
            : "",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.08] text-sky-200">
              {assignment.type === "Project" ? (
                <Layers3 size={18} />
              ) : assignment.type === "Quiz" ? (
                <CheckCircle2 size={18} />
              ) : assignment.type === "Coding Test" ? (
                <CircleDashed size={18} />
              ) : (
                <ClipboardList size={18} />
              )}
            </div>

            <div className="min-w-0 pt-0.5">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.1em] text-sky-300/80">
                {assignment.id}
              </p>
              <p className="mt-1 line-clamp-2 text-[11px] font-medium leading-5 text-slate-300">
                {assignment.course}
              </p>
            </div>
          </div>

          <div className="relative shrink-0" ref={menuRef}>
            <button
              type="button"
              aria-label={`More actions for ${assignment.title}`}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
              className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
            >
              <MoreHorizontal size={17} />
            </button>

            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -5, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.98 }}
                  transition={{ duration: 0.13 }}
                  className="absolute right-0 top-10 z-[90] w-48 rounded-2xl border border-white/[0.1] bg-[#0d1726] p-1.5 shadow-2xl shadow-black/40"
                >
                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onView(assignment);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Eye size={14} className="text-sky-300" />
                    View details
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onDuplicate(assignment);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Copy size={14} className="text-cyan-300" />
                    Duplicate task
                  </button>

                  <div className="my-1 border-t border-white/[0.06]" />

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      onChangeStatus(assignment.id);
                    }}
                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                  >
                    <Check size={14} className="text-sky-300" />
                    {assignment.status === "Closed"
                      ? "Reopen assignment"
                      : "Close assignment"}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          <AssignmentStatus status={assignment.status} />
          <PriorityBadge priority={assignment.priority} />
        </div>
      </div>

      {/* CARD BODY */}

      <div className="flex min-w-0 flex-1 flex-col p-4 sm:p-5">
        <h3 className="line-clamp-2 text-base font-bold leading-6 text-white transition-colors group-hover:text-sky-200">
          {assignment.title}
        </h3>

        <p className="mt-2 line-clamp-2 min-h-[40px] text-[11px] leading-5 text-slate-400 sm:text-xs">
          {assignment.description}
        </p>

        <div className="mt-4 flex min-w-0 items-center gap-2.5">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-sky-300/10 bg-sky-300/10 text-[10px] font-bold text-sky-200">
            {assignment.instructorInitials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[11px] font-semibold text-slate-200">
              {assignment.instructor}
            </p>
            <p className="mt-0.5 truncate text-[9px] text-slate-500">
              {assignment.assignedTo}
            </p>
          </div>
          <span className="shrink-0 rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-1 text-[9px] font-medium text-slate-400">
            {assignment.type}
          </span>
        </div>

        {/* DUE DATE */}

        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
          <div className="flex min-w-0 items-start gap-2">
            <CalendarDays
              size={14}
              className={`mt-0.5 shrink-0 ${overdue ? "text-rose-300" : "text-sky-300"}`}
            />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-500">Due date</p>
              <p
                className={`mt-1 text-[11px] font-semibold ${overdue ? "text-rose-200" : "text-slate-200"}`}
              >
                {formatDate(assignment.dueDate)}
              </p>
              <p
                className={`mt-1 text-[9px] ${overdue ? "text-rose-300" : "text-slate-500"}`}
              >
                {getDueLabel(assignment.dueDate)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2">
            <Users size={14} className="mt-0.5 shrink-0 text-sky-300" />
            <div className="min-w-0">
              <p className="text-[9px] text-slate-500">Submissions</p>
              <p className="mt-1 text-[11px] font-semibold text-slate-200">
                {assignment.submitted}/{assignment.totalStudents}
              </p>
              <p className="mt-1 text-[9px] text-slate-500">
                {assignment.marks} marks total
              </p>
            </div>
          </div>
        </div>

        {/* PROGRESS */}

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="text-[10px] text-slate-500">
              Submission progress
            </span>
            <span className="text-[10px] font-semibold text-sky-200">
              {percent}%
            </span>
          </div>

          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percent}%` }}
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
            onClick={() => onView(assignment)}
            className="inline-flex min-h-[39px] flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-[11px] font-semibold text-slate-200 transition hover:border-sky-300/25 hover:bg-sky-300/[0.06] hover:text-sky-200"
          >
            <Eye size={14} />
            View details
          </button>

          <button
            type="button"
            title={
              assignment.status === "Closed"
                ? "Reopen assignment"
                : "Close assignment"
            }
            aria-label={
              assignment.status === "Closed"
                ? "Reopen assignment"
                : "Close assignment"
            }
            onClick={() => onChangeStatus(assignment.id)}
            className="flex h-[39px] w-[42px] shrink-0 items-center justify-center rounded-xl border border-sky-300/15 bg-sky-300/[0.07] text-sky-200 transition hover:bg-sky-300/[0.13]"
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

export default function CollegeAssignmentsPage() {
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [searchQuery, setSearchQuery] = useState("");
  const [typeFilter, setTypeFilter] = useState("All types");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [sortBy, setSortBy] = useState("Due date");
  const [viewMode, setViewMode] = useState("grid");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [notice, setNotice] = useState("");

  const noticeTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (noticeTimer.current) window.clearTimeout(noticeTimer.current);
    };
  }, []);

  const showNotice = (message) => {
    setNotice(message);

    if (noticeTimer.current) {
      window.clearTimeout(noticeTimer.current);
    }

    noticeTimer.current = window.setTimeout(() => setNotice(""), 3200);
  };

  const publishedCount = assignments.filter(
    (assignment) => assignment.status === "Published"
  ).length;

  const reviewCount = assignments.filter(
    (assignment) => assignment.status === "In Review"
  ).length;

  const draftCount = assignments.filter(
    (assignment) => assignment.status === "Draft"
  ).length;

  const submittedTotal = assignments.reduce(
    (total, assignment) => total + assignment.submitted,
    0
  );

  const overdueCount = assignments.filter(isOverdue).length;

  const filteredAssignments = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    const result = assignments.filter((assignment) => {
      const matchesSearch =
        !query ||
        assignment.title.toLowerCase().includes(query) ||
        assignment.course.toLowerCase().includes(query) ||
        assignment.instructor.toLowerCase().includes(query) ||
        assignment.id.toLowerCase().includes(query) ||
        assignment.assignedTo.toLowerCase().includes(query);

      const matchesType =
        typeFilter === "All types" || assignment.type === typeFilter;

      const matchesStatus =
        statusFilter === "All statuses" ||
        assignment.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All priorities" ||
        assignment.priority === priorityFilter;

      return (
        matchesSearch &&
        matchesType &&
        matchesStatus &&
        matchesPriority
      );
    });

    if (sortBy === "Most submissions") {
      result.sort((a, b) => b.submitted - a.submitted);
    } else if (sortBy === "A–Z") {
      result.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortBy === "Recently updated") {
      result.sort((a, b) => b.updated.localeCompare(a.updated));
    } else {
      result.sort((a, b) => {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
      });
    }

    return result;
  }, [
    assignments,
    searchQuery,
    typeFilter,
    statusFilter,
    priorityFilter,
    sortBy,
  ]);

  const resetFilters = () => {
    setSearchQuery("");
    setTypeFilter("All types");
    setStatusFilter("All statuses");
    setPriorityFilter("All priorities");
    setSortBy("Due date");
  };

  const handleCreateAssignment = (form) => {
    const newAssignment = {
      id: `ASG-${String(
        Math.max(
          204,
          ...assignments.map((assignment) => {
            const match = assignment.id.match(/\d+/);
            return match ? Number(match[0]) : 0;
          })
        ) + 1
      )}`,
      title: form.title.trim(),
      course: form.course,
      type: form.type,
      description:
        form.description.trim() ||
        "Instructions can be updated after the assignment draft has been created.",
      dueDate: form.dueDate,
      status: "Draft",
      priority: form.priority,
      assignedTo: form.assignedTo.trim(),
      instructor: "College Admin",
      instructorInitials: "CA",
      submitted: 0,
      totalStudents: 0,
      marks: Number(form.marks) || 20,
      attachments: 0,
      updated: new Date().toISOString().slice(0, 10),
      instructions: [
        "Review the assignment requirements.",
        "Complete the task according to the instructions.",
        "Upload the requested submission before the deadline.",
      ],
    };

    setAssignments((current) => [newAssignment, ...current]);
    setSearchQuery("");
    setTypeFilter("All types");
    setStatusFilter("All statuses");
    setPriorityFilter("All priorities");
    setSortBy("Recently updated");
    setIsCreateOpen(false);
    showNotice("Assignment created as a draft.");
  };

  const handleChangeStatus = (assignmentId) => {
    const target = assignments.find(
      (assignment) => assignment.id === assignmentId
    );

    if (!target) return;

    const nextStatus =
      target.status === "Closed" ? "Published" : "Closed";

    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === assignmentId
          ? {
            ...assignment,
            status: nextStatus,
            updated: new Date().toISOString().slice(0, 10),
            updatedLabel:
              nextStatus === "Closed"
                ? "Recently closed"
                : "Recently reopened",
          }
          : assignment
      )
    );

    showNotice(
      nextStatus === "Closed"
        ? `${target.id} has been closed.`
        : `${target.id} has been reopened.`
    );
  };

  const handleDuplicate = (assignment) => {
    const nextId =
      Math.max(
        204,
        ...assignments.map((item) => {
          const match = item.id.match(/\d+/);
          return match ? Number(match[0]) : 0;
        })
      ) + 1;

    const duplicated = {
      ...assignment,
      id: `ASG-${nextId}`,
      title: `${assignment.title} (Copy)`,
      status: "Draft",
      submitted: 0,
      updated: new Date().toISOString().slice(0, 10),
      updatedLabel: "Draft · Not published",
    };

    setAssignments((current) => [duplicated, ...current]);
    setSearchQuery("");
    setTypeFilter("All types");
    setStatusFilter("All statuses");
    setPriorityFilter("All priorities");
    setSortBy("Recently updated");
    showNotice("Assignment duplicated as a draft.");
  };

  return (
    <>
      {/* Page padding keeps content away from the sidebar edges. */}

      <motion.div
        variants={pageVariants}
        initial="hidden"
        animate="visible"
        className="box-border mx-auto w-full min-w-0 max-w-[1600px] space-y-5 px-4 py-5 text-slate-100 sm:space-y-6 sm:px-5 sm:py-6 lg:px-6 lg:py-6 2xl:px-7"
      >
        {/* HERO */}

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
                Assignments &{" "}
                <span className="bg-gradient-to-r from-sky-300 to-cyan-200 bg-clip-text text-transparent">
                  Assessments
                </span>
              </h1>

              <p className="mt-3 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm sm:leading-7">
                Create academic tasks, manage deadlines, track student
                submissions and keep every course organized from one workspace.
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[10px] text-slate-400 sm:text-xs">
                <span className="inline-flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
                  {assignments.length} total assessments
                </span>
                <span className="hidden h-3 w-px bg-white/10 sm:block" />
                <span className="inline-flex items-center gap-1.5">
                  <Activity size={13} className="text-sky-300" />
                  Academic workspace
                </span>
              </div>
            </div>

            <div className="relative flex flex-col gap-2 sm:flex-row xl:shrink-0">
              <Link
                to="/college/programs"
                className={`${secondaryButton} min-h-[43px]`}
              >
                <BookOpen size={15} />
                View courses
                <ArrowUpRight size={14} className="text-slate-500" />
              </Link>

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-xl bg-sky-300 px-4 py-2.5 text-xs font-bold text-[#07111f] shadow-lg shadow-sky-500/10 transition hover:-translate-y-0.5 hover:bg-sky-200 active:translate-y-0"
              >
                <Plus size={16} strokeWidth={2.5} />
                Create assignment
              </button>
            </div>
          </div>
        </motion.section>

        {/* SUMMARY CARDS */}

        <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={ClipboardList}
            label="Total assessments"
            value={assignments.length}
            note="Across all courses"
            accent="bg-sky-400/10 text-sky-300"
          />
          <StatCard
            icon={CheckCircle2}
            label="Published"
            value={publishedCount}
            note="Available to students"
            accent="bg-cyan-400/10 text-cyan-300"
          />
          <StatCard
            icon={Users}
            label="Submissions received"
            value={submittedTotal.toLocaleString("en-IN")}
            note="Across current assessments"
            accent="bg-blue-400/10 text-blue-300"
          />
          <StatCard
            icon={Clock3}
            label="Overdue"
            value={overdueCount}
            note={`${reviewCount} currently in review · ${draftCount} drafts`}
            accent="bg-amber-400/10 text-amber-300"
          />
        </section>

        {/* MAIN ASSIGNMENTS PANEL */}

        <motion.section
          variants={itemVariants}
          className="relative min-w-0 rounded-[22px] border border-white/[0.08] bg-[#0c1523] sm:rounded-[24px]"
        >
          {/* SECTION HEADER */}

          <div className="flex min-w-0 flex-col justify-between gap-4 border-b border-white/[0.07] p-4 sm:p-5 lg:flex-row lg:items-center lg:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-300/10 bg-sky-300/[0.08] text-sky-300">
                <ClipboardList size={18} />
              </div>
              <div className="min-w-0">
                <h2 className="text-sm font-bold text-white sm:text-base">
                  Assignment catalog
                </h2>
                <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                  Manage tasks, deadlines and submission progress
                </p>
              </div>
            </div>

            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <div className="relative min-w-0 flex-1 sm:min-w-[230px] lg:w-[265px] lg:flex-none">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search assignment, course..."
                  aria-label="Search assignments"
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

          {/* FILTERS */}

          <div className="space-y-4 border-b border-white/[0.07] p-4 sm:p-5 lg:px-6">
            <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-500">
                <Filter size={13} className="text-sky-300" />
                Filter assessments
              </div>

              <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2 xl:w-[720px] xl:grid-cols-4">
                <PremiumDropdown
                  value={typeFilter}
                  options={TYPE_OPTIONS}
                  onChange={setTypeFilter}
                  icon={Layers3}
                  label="Assessment type"
                />
                <PremiumDropdown
                  value={statusFilter}
                  options={STATUS_OPTIONS}
                  onChange={setStatusFilter}
                  icon={CheckCircle2}
                  label="Status"
                />
                <PremiumDropdown
                  value={priorityFilter}
                  options={PRIORITY_OPTIONS}
                  onChange={setPriorityFilter}
                  icon={Flag}
                  label="Priority"
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
              {STATUS_OPTIONS.map((status) => {
                const active = statusFilter === status;

                return (
                  <button
                    type="button"
                    key={status}
                    onClick={() => setStatusFilter(status)}
                    className={[
                      "rounded-full border px-3.5 py-2 text-[10px] font-semibold transition-all duration-200",
                      active
                        ? "border-sky-300/30 bg-sky-300/10 text-sky-200"
                        : "border-white/[0.07] bg-white/[0.02] text-slate-400 hover:border-white/[0.15] hover:bg-white/[0.04] hover:text-slate-200",
                    ].join(" ")}
                  >
                    {status}
                  </button>
                );
              })}

              {(typeFilter !== "All types" ||
                statusFilter !== "All statuses" ||
                priorityFilter !== "All priorities" ||
                searchQuery ||
                sortBy !== "Due date") && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-[10px] font-semibold text-sky-300 transition hover:bg-sky-300/[0.06] hover:text-sky-200"
                  >
                    <X size={12} />
                    Reset filters
                  </button>
                )}
            </div>
          </div>

          {/* RESULTS INFO */}

          <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6">
            <p className="text-xs text-slate-400">
              Showing{" "}
              <span className="font-semibold text-white">
                {filteredAssignments.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-white">
                {assignments.length}
              </span>{" "}
              assessments
            </p>

            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
              <Activity size={12} className="text-sky-300" />
              Submission tracking
            </span>
          </div>

          {/* ASSIGNMENT CARDS */}

          <div className="min-w-0 px-4 pb-5 sm:px-5 sm:pb-6 lg:px-6">
            <AnimatePresence mode="wait">
              {filteredAssignments.length > 0 ? (
                <motion.div
                  key={`${viewMode}-${typeFilter}-${statusFilter}-${priorityFilter}-${sortBy}-${searchQuery}`}
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
                  {filteredAssignments.map((assignment, index) => (
                    <AssignmentCard
                      key={assignment.id}
                      assignment={assignment}
                      index={index}
                      viewMode={viewMode}
                      onView={setSelectedAssignment}
                      onChangeStatus={handleChangeStatus}
                      onDuplicate={handleDuplicate}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="empty-assignments"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex min-h-[270px] flex-col items-center justify-center px-4 py-12 text-center"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-sky-300/15 bg-sky-300/[0.07] text-sky-300">
                    <Search size={23} />
                  </div>
                  <h3 className="mt-5 text-base font-bold text-white">
                    No assignments found
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
                    Try changing your search or filter settings to find the
                    assessment you need.
                  </p>
                  <button
                    type="button"
                    onClick={resetFilters}
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

        {/* QUICK ACTIONS */}

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
                  Keep learning on track
                </h3>
                <p className="mt-1.5 max-w-2xl text-xs leading-6 text-slate-400">
                  Keep assessments connected to the right courses, review
                  upcoming deadlines and monitor submission activity.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Link
                    to="/college/programs"
                    className={secondaryButton}
                  >
                    <BookOpen size={14} />
                    Manage courses
                    <ArrowUpRight size={13} />
                  </Link>
                  <Link
                    to="/college/students"
                    className={secondaryButton}
                  >
                    <Users size={14} />
                    View students
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
                Create an assessment
              </h3>
              <p className="mt-1.5 text-[11px] leading-5 text-slate-400">
                Set a deadline, choose a course and prepare a student task.
              </p>
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="mt-4 inline-flex items-center gap-2 text-xs font-bold text-sky-200 transition hover:text-sky-100"
              >
                Create assignment
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
            Assignments & Assessments
          </p>

          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-sky-300" />
            <span>Academic workspace ready</span>
          </div>
        </motion.footer>
      </motion.div>

      {/* CREATE MODAL */}

      <AnimatePresence>
        {isCreateOpen && (
          <CreateAssignmentModal
            key="create-assignment-modal"
            onClose={() => setIsCreateOpen(false)}
            onCreate={handleCreateAssignment}
          />
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}

      <AnimatePresence>
        {selectedAssignment && (
          <AssignmentDetailsModal
            key={`assignment-details-${selectedAssignment.id}`}
            assignment={
              assignments.find(
                (assignment) =>
                  assignment.id === selectedAssignment.id
              ) || selectedAssignment
            }
            onClose={() => setSelectedAssignment(null)}
            onChangeStatus={handleChangeStatus}
          />
        )}
      </AnimatePresence>

      {/* ACTION FEEDBACK */}

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