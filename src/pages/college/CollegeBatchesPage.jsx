
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Layers,
  Users,
  Plus,
  Search,
  Download,
  GraduationCap,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  ChevronDown,
  ChevronRight,
  Check,
  Filter,
  RotateCcw,
  Eye,
  FileText,
  Sparkles,
  Building2,
  Monitor,
  MapPin,
  BadgeCheck,
  TrendingUp,
  BookOpen,
  Laptop,
  UsersRound,
  ArrowUpRight,
  MoreHorizontal,
  ShieldCheck,
} from "lucide-react";

/* =========================================================
   COLLEGE BATCH MANAGEMENT
   Theme: Dark Navy + Ice Blue
   Data: LocalStorage demo implementation
   ========================================================= */

const C = {
  page: "#0B1425",
  surface: "#111F34",
  surface2: "#152740",
  surface3: "#1A304D",
  border: "#293D58",
  borderLight: "#344C69",
  text: "#EAF3FF",
  muted: "#9FB2CA",
  accent: "#80BFFF",
};

const STORAGE_KEY = "techmentor-college-batches-v1";

const COURSE_OPTIONS = [
  "Full Stack Development",
  "Python Programming",
  "Data Science & AI",
  "Java & DSA",
  "Frontend Development",
  "UI/UX Design",
  "Cloud Computing",
  "Cybersecurity",
];

const TRAINER_OPTIONS = [
  "Unassigned",
  "Rahul Mehta",
  "Priya Verma",
  "Amit Sharma",
  "Sneha Patel",
  "Vikram Singh",
];

const MODE_OPTIONS = ["On Campus", "Online", "Hybrid"];

const STATUS_OPTIONS = [
  "Active",
  "Upcoming",
  "Completed",
  "Draft",
];

const EMPTY_FORM = {
  name: "",
  course: "Full Stack Development",
  trainer: "Unassigned",
  department: "",
  mode: "On Campus",
  status: "Upcoming",
  startDate: "",
  endDate: "",
  capacity: "40",
  students: "0",
  description: "",
};

const FIELD_CLASS =
  "w-full rounded-xl border border-[#344A66] bg-[#101D30] px-4 py-3 text-sm text-[#EAF3FF] outline-none transition placeholder:text-[#7187A2] focus:border-[#80BFFF] focus:ring-4 focus:ring-[#4B9AE8]/15";

const INITIAL_BATCHES = [
  {
    id: "BAT-1001",
    name: "Full Stack — October",
    course: "Full Stack Development",
    trainer: "Rahul Mehta",
    department: "Computer Science",
    mode: "Hybrid",
    status: "Active",
    startDate: "2026-10-05",
    endDate: "2026-12-20",
    capacity: 40,
    students: 32,
    description:
      "A practical full-stack development program covering frontend development, APIs, databases, authentication, testing and deployment.",
    createdAt: "2026-09-20",
  },
  {
    id: "BAT-1002",
    name: "Data Science — Winter",
    course: "Data Science & AI",
    trainer: "Priya Verma",
    department: "AI & Data Science",
    mode: "Online",
    status: "Upcoming",
    startDate: "2026-11-01",
    endDate: "2027-02-20",
    capacity: 50,
    students: 38,
    description:
      "An applied learning program covering Python, data analysis, visualization, statistics and machine learning foundations.",
    createdAt: "2026-10-01",
  },
  {
    id: "BAT-1003",
    name: "Python Foundation",
    course: "Python Programming",
    trainer: "Amit Sharma",
    department: "Computer Science",
    mode: "On Campus",
    status: "Completed",
    startDate: "2026-08-01",
    endDate: "2026-09-30",
    capacity: 35,
    students: 30,
    description:
      "An introductory programming cohort with hands-on Python exercises, problem solving and mini projects.",
    createdAt: "2026-07-15",
  },
  {
    id: "BAT-1004",
    name: "UI/UX Design Studio",
    course: "UI/UX Design",
    trainer: "Sneha Patel",
    department: "Design",
    mode: "Hybrid",
    status: "Upcoming",
    startDate: "2026-11-15",
    endDate: "2027-01-15",
    capacity: 30,
    students: 18,
    description:
      "A project-oriented design cohort covering user research, wireframes, prototypes, usability and design systems.",
    createdAt: "2026-10-12",
  },
  {
    id: "BAT-1005",
    name: "Java DSA — New Cohort",
    course: "Java & DSA",
    trainer: "Unassigned",
    department: "Computer Science",
    mode: "On Campus",
    status: "Draft",
    startDate: "",
    endDate: "",
    capacity: 40,
    students: 0,
    description:
      "A planned cohort for Java programming and data structures and algorithms.",
    createdAt: "2026-10-21",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

function loadBatches() {
  try {
    if (typeof window === "undefined") return INITIAL_BATCHES;

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }

    return INITIAL_BATCHES;
  } catch {
    return INITIAL_BATCHES;
  }
}

function getToday() {
  const date = new Date();
  const localDate = new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  );

  return localDate.toISOString().slice(0, 10);
}

function formatDate(date) {
  if (!date) return "Not scheduled";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(value = "") {
  return value
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function getNextBatchId(batches) {
  const maxNumber = batches.reduce((max, batch) => {
    const match = String(batch.id).match(/^BAT-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1000);

  return `BAT-${maxNumber + 1}`;
}

function getEnrollment(batch) {
  const capacity = Math.max(0, Number(batch.capacity) || 0);
  const students = Math.max(0, Number(batch.students) || 0);

  return {
    capacity,
    students,
    available: Math.max(0, capacity - students),
    percentage:
      capacity > 0
        ? Math.min(100, Math.round((students / capacity) * 100))
        : 0,
  };
}

function getStatusStyle(status) {
  const styles = {
    Active: {
      badge: "border-[#3A5F86] bg-[#193653] text-[#AED7FF]",
      dot: "bg-[#80BFFF]",
    },
    Upcoming: {
      badge: "border-amber-800 bg-amber-950/50 text-amber-300",
      dot: "bg-amber-400",
    },
    Completed: {
      badge: "border-emerald-800 bg-emerald-950/50 text-emerald-300",
      dot: "bg-emerald-400",
    },
    Draft: {
      badge: "border-slate-600 bg-slate-800 text-slate-300",
      dot: "bg-slate-400",
    },
  };

  return styles[status] || styles.Draft;
}

function getModeStyle(mode) {
  const styles = {
    "On Campus":
      "border-[#3B5877] bg-[#192F49] text-[#B8D5F3]",
    Online:
      "border-cyan-800 bg-cyan-950/40 text-cyan-300",
    Hybrid:
      "border-violet-800 bg-violet-950/40 text-violet-300",
  };

  return styles[mode] || styles["On Campus"];
}

function getCourseIcon(course) {
  if (course?.includes("Data Science") || course?.includes("AI")) {
    return TrendingUp;
  }

  if (course?.includes("UI/UX")) {
    return Sparkles;
  }

  if (course?.includes("Cloud") || course?.includes("Cybersecurity")) {
    return Laptop;
  }

  if (course?.includes("Python") || course?.includes("Java")) {
    return FileText;
  }

  return BookOpen;
}

/* =========================================================
   BADGES
   ========================================================= */

function StatusBadge({ status }) {
  const style = getStatusStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

function ModeBadge({ mode }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${getModeStyle(mode)}`}
    >
      {mode === "Online" ? (
        <Monitor size={13} />
      ) : mode === "Hybrid" ? (
        <Laptop size={13} />
      ) : (
        <Building2 size={13} />
      )}
      {mode}
    </span>
  );
}

function IconButton({
  children,
  onClick,
  label,
  className = "",
  disabled = false,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      disabled={disabled}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#344A66] bg-[#14253C] text-[#A7BBD2] transition hover:border-[#628DBB] hover:bg-[#1A3555] hover:text-[#C8E5FF] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   PREMIUM CUSTOM DROPDOWN
   No browser-native select popup.
   ========================================================= */

function PremiumSelect({
  value,
  options,
  onChange,
  icon: Icon,
  placeholder = "Select an option",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedOption = options.find((option) => option === value);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={rootRef} className="relative min-w-0 w-full">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={`group flex min-h-[46px] w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 ${open
          ? "border-[#80BFFF] bg-[#193858] ring-4 ring-[#4B9AE8]/10"
          : "border-[#344A66] bg-[#111F34] hover:border-[#52759A] hover:bg-[#162941]"
          }`}
      >
        {Icon && (
          <Icon
            size={17}
            className={`shrink-0 transition ${open
              ? "text-[#9BCFFF]"
              : "text-[#8FA6C1] group-hover:text-[#A9D5FF]"
              }`}
          />
        )}

        <span
          className={`min-w-0 flex-1 truncate text-sm font-medium ${selectedOption ? "text-[#EAF3FF]" : "text-[#8FA6C1]"
            }`}
        >
          {selectedOption || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#8FA6C1] transition-transform duration-200 ${open ? "rotate-180 text-[#A9D5FF]" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.985 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[calc(100%+8px)] z-[110] w-full min-w-[210px] overflow-hidden rounded-2xl border border-[#3B5677] bg-[#111F34] p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.45)]"
          >
            <div
              role="listbox"
              aria-label="Options"
              className="max-h-64 overflow-y-auto overscroll-contain"
            >
              {options.map((option) => {
                const selected = option === value;

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${selected
                      ? "bg-[#1A3C60] text-[#C6E5FF]"
                      : "text-[#C1D0E2] hover:bg-[#1A304B] hover:text-white"
                      }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${selected
                        ? "bg-[#28537F] text-[#D6ECFF]"
                        : "bg-[#1B2C42] text-[#7F99B7]"
                        }`}
                    >
                      {selected ? (
                        <Check size={15} strokeWidth={2.5} />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                      )}
                    </span>

                    <span className="min-w-0 flex-1 text-sm font-semibold">
                      {option}
                    </span>
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

/* =========================================================
   STAT CARD
   ========================================================= */

function StatCard({ icon: Icon, label, value, note, tone }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group min-w-0 rounded-2xl border border-[#263B56] bg-[#111F34] p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#42658B] hover:bg-[#14243A] hover:shadow-[0_14px_35px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#9FB2CA]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#F0F6FF]">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#8096B1]">{note}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${tone}`}
        >
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   BATCH CREATE / EDIT MODAL
   ========================================================= */

function BatchFormModal({
  open,
  onClose,
  onSubmit,
  editingBatch,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (editingBatch) {
      setForm({
        name: editingBatch.name || "",
        course: editingBatch.course || COURSE_OPTIONS[0],
        trainer: editingBatch.trainer || "Unassigned",
        department: editingBatch.department || "",
        mode: editingBatch.mode || "On Campus",
        status: editingBatch.status || "Upcoming",
        startDate: editingBatch.startDate || "",
        endDate: editingBatch.endDate || "",
        capacity: String(editingBatch.capacity ?? 40),
        students: String(editingBatch.students ?? 0),
        description: editingBatch.description || "",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setError("");
  }, [open, editingBatch]);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const department = form.department.trim();
    const description = form.description.trim();

    const capacity = Number(form.capacity);
    const students = Number(form.students);

    if (!name || !department || !form.course || !form.trainer) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!Number.isInteger(capacity) || capacity < 1) {
      setError("Maximum seats must be a positive whole number.");
      return;
    }

    if (
      !Number.isInteger(students) ||
      students < 0 ||
      students > capacity
    ) {
      setError("Enrolled students must be between 0 and the maximum seats.");
      return;
    }

    if (
      form.startDate &&
      form.endDate &&
      form.endDate < form.startDate
    ) {
      setError("End date cannot be before the start date.");
      return;
    }

    if (
      form.status === "Active" &&
      (!form.startDate || !form.endDate)
    ) {
      setError("Add both start and end dates before activating the batch.");
      return;
    }

    onSubmit({
      ...form,
      name,
      department,
      description,
      capacity,
      students,
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020916]/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ duration: 0.2 }}
            className="my-auto w-full max-w-3xl overflow-visible rounded-3xl border border-[#344A66] bg-[#111F34] shadow-[0_25px_90px_rgba(0,0,0,0.6)]"
          >
            <div className="relative overflow-hidden rounded-t-3xl border-b border-[#344A66] bg-gradient-to-r from-[#172B46] via-[#152740] to-[#1A3655] px-5 py-5 sm:px-7">
              <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full border border-[#7AB5EF]/15" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#52749B] bg-[#1B3A5B] text-[#A9D5FF]">
                    {editingBatch ? (
                      <Pencil size={21} />
                    ) : (
                      <Plus size={22} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#EFF6FF]">
                      {editingBatch ? "Edit batch" : "Create new batch"}
                    </h2>

                    <p className="mt-1 max-w-md text-sm leading-5 text-[#97ADC7]">
                      Configure the batch, select a trainer and define
                      enrollment capacity.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close dialog"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#344A66] bg-[#14253C] text-[#A7BBD2] transition hover:bg-[#1A3555] hover:text-white"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100dvh-150px)] space-y-5 overflow-y-auto p-5 sm:p-7"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Batch name <span className="text-red-400">*</span>
                </label>

                <input
                  autoFocus
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="e.g. Full Stack — November"
                  maxLength={120}
                  required
                  className={FIELD_CLASS}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Course / Program
                  </label>

                  <PremiumSelect
                    value={form.course}
                    options={COURSE_OPTIONS}
                    onChange={(value) => updateField("course", value)}
                    icon={BookOpen}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Assigned trainer
                  </label>

                  <PremiumSelect
                    value={form.trainer}
                    options={TRAINER_OPTIONS}
                    onChange={(value) => updateField("trainer", value)}
                    icon={GraduationCap}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Class mode
                  </label>

                  <PremiumSelect
                    value={form.mode}
                    options={MODE_OPTIONS}
                    onChange={(value) => updateField("mode", value)}
                    icon={Monitor}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Batch status
                  </label>

                  <PremiumSelect
                    value={form.status}
                    options={STATUS_OPTIONS}
                    onChange={(value) => updateField("status", value)}
                    icon={CheckCircle2}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Department <span className="text-red-400">*</span>
                </label>

                <input
                  value={form.department}
                  onChange={(event) =>
                    updateField("department", event.target.value)
                  }
                  placeholder="e.g. Computer Science"
                  maxLength={100}
                  required
                  className={FIELD_CLASS}
                />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Start date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
                    />

                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(event) =>
                        updateField("startDate", event.target.value)
                      }
                      style={{ colorScheme: "dark" }}
                      className={`${FIELD_CLASS} pl-10`}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    End date
                  </label>

                  <div className="relative">
                    <CalendarDays
                      size={17}
                      className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
                    />

                    <input
                      type="date"
                      min={form.startDate || undefined}
                      value={form.endDate}
                      onChange={(event) =>
                        updateField("endDate", event.target.value)
                      }
                      style={{ colorScheme: "dark" }}
                      className={`${FIELD_CLASS} pl-10`}
                    />
                  </div>
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Maximum seats
                  </label>

                  <input
                    type="number"
                    min="1"
                    step="1"
                    value={form.capacity}
                    onChange={(event) =>
                      updateField("capacity", event.target.value)
                    }
                    required
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Enrolled students
                  </label>

                  <input
                    type="number"
                    min="0"
                    step="1"
                    value={form.students}
                    onChange={(event) =>
                      updateField("students", event.target.value)
                    }
                    required
                    className={FIELD_CLASS}
                  />

                  <p className="mt-1.5 text-xs text-[#7F96B1]">
                    Demo field; this does not enroll real student accounts.
                  </p>
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Batch description
                </label>

                <textarea
                  value={form.description}
                  onChange={(event) =>
                    updateField("description", event.target.value)
                  }
                  rows={4}
                  maxLength={2000}
                  placeholder="Describe the learning objectives or batch details..."
                  className={`${FIELD_CLASS} min-h-[105px] resize-y leading-6`}
                />
              </div>

              <div className="rounded-2xl border border-[#304D6D] bg-[#152A43] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#385979] bg-[#1D3957] text-[#A9D5FF]">
                    <UsersRound size={18} />
                  </div>

                  <div>
                    <p className="text-sm font-bold text-[#DFEEFF]">
                      Enrollment preview
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#91A8C2]">
                      {Math.max(0, Number(form.students) || 0)} students enrolled
                      out of {Math.max(0, Number(form.capacity) || 0)} seats.
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-900 bg-red-950/60 px-4 py-3 text-sm leading-5 text-red-300"
                >
                  <AlertCircle size={17} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[#2B405B] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#3A506C] bg-[#172840] px-5 py-3 text-sm font-semibold text-[#C1D0E2] transition hover:bg-[#203750]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#80BFFF] px-5 py-3 text-sm font-bold text-[#10233D] shadow-lg shadow-black/10 transition hover:bg-[#A0D0FF]"
                >
                  {editingBatch ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Plus size={17} />
                  )}
                  {editingBatch ? "Save changes" : "Create batch"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   BATCH DETAILS MODAL
   ========================================================= */

function BatchDetailsModal({ batch, onClose, onEdit }) {
  if (!batch) return null;

  const CourseIcon = getCourseIcon(batch.course);
  const enrollment = getEnrollment(batch);

  return (
    <AnimatePresence>
      {batch && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-[#020916]/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#344A66] bg-[#111F34] shadow-[0_25px_90px_rgba(0,0,0,0.6)]"
          >
            <div className="relative overflow-hidden border-b border-[#344A66] bg-gradient-to-r from-[#172B46] via-[#152740] to-[#1A3655] p-5 sm:p-6">
              <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full border border-[#7AB5EF]/15" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#52749B] bg-[#1B3A5B] text-[#A9D5FF]">
                    <CourseIcon size={22} />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-2 text-xs font-bold tracking-wider text-[#80BFFF]">
                      {batch.id}
                    </p>

                    <h2 className="break-words text-xl font-bold leading-7 text-[#EFF6FF]">
                      {batch.name}
                    </h2>

                    <p className="mt-1.5 text-sm text-[#9DB3CC]">
                      {batch.course}
                    </p>
                  </div>
                </div>

                <IconButton label="Close details" onClick={onClose}>
                  <X size={18} />
                </IconButton>
              </div>

              <div className="relative mt-4 flex flex-wrap gap-2">
                <StatusBadge status={batch.status} />
                <ModeBadge mode={batch.mode} />
              </div>
            </div>

            <div className="max-h-[calc(100dvh-170px)] space-y-5 overflow-y-auto p-5 sm:p-6">
              <section className="rounded-2xl border border-[#293D58] bg-[#0D1A2B] p-4">
                <h3 className="text-sm font-bold text-[#DCEBFC]">
                  Batch description
                </h3>

                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#AFC2D8]">
                  {batch.description || "No description has been added."}
                </p>
              </section>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#293D58] bg-[#152740] p-4">
                  <div className="flex items-center gap-2 text-[#80BFFF]">
                    <GraduationCap size={17} />
                    <span className="text-xs font-semibold text-[#8FA6C1]">
                      ASSIGNED TRAINER
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#E0ECFA]">
                    {batch.trainer}
                  </p>

                  <p className="mt-1 text-xs text-[#92A8C2]">
                    {batch.department}
                  </p>
                </div>

                <div className="rounded-xl border border-[#293D58] bg-[#152740] p-4">
                  <div className="flex items-center gap-2 text-[#80BFFF]">
                    <CalendarDays size={17} />
                    <span className="text-xs font-semibold text-[#8FA6C1]">
                      BATCH DURATION
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#E0ECFA]">
                    {formatDate(batch.startDate)}
                  </p>

                  <p className="mt-1 text-xs text-[#92A8C2]">
                    Until {formatDate(batch.endDate)}
                  </p>
                </div>
              </div>

              <section className="rounded-2xl border border-[#293D58] bg-[#0E1A2C] p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-bold text-[#DFECFC]">
                      Enrollment overview
                    </p>

                    <p className="mt-1 text-xs text-[#8299B5]">
                      Current demo enrollment information
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-2xl font-bold text-[#EAF3FF]">
                      {enrollment.percentage}%
                    </p>
                    <p className="text-[10px] text-[#8299B5]">Filled</p>
                  </div>
                </div>

                <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#22364F]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#4B9AE8] to-[#9BD1FF] transition-all duration-500"
                    style={{ width: `${enrollment.percentage}%` }}
                  />
                </div>

                <div className="mt-4 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xl font-bold text-[#EAF3FF]">
                      {enrollment.students}
                    </p>
                    <p className="mt-1 text-xs text-[#8299B5]">Enrolled</p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-[#EAF3FF]">
                      {enrollment.capacity}
                    </p>
                    <p className="mt-1 text-xs text-[#8299B5]">Total seats</p>
                  </div>

                  <div>
                    <p className="text-xl font-bold text-[#A9D5FF]">
                      {enrollment.available}
                    </p>
                    <p className="mt-1 text-xs text-[#8299B5]">Available</p>
                  </div>
                </div>
              </section>

              <div className="flex flex-col-reverse gap-3 border-t border-[#293D58] pt-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#3A506C] bg-[#172840] px-5 py-3 text-sm font-semibold text-[#C1D0E2] transition hover:bg-[#203750]"
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => onEdit(batch)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#80BFFF] px-5 py-3 text-sm font-bold text-[#10233D] transition hover:bg-[#A0D0FF]"
                >
                  <Pencil size={16} />
                  Edit batch
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function CollegeBatchesPage() {
  const [batches, setBatches] = useState(loadBatches);
  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [modeFilter, setModeFilter] = useState("All modes");
  const [activeView, setActiveView] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [selectedBatchId, setSelectedBatchId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(batches),
      );
    } catch {
      setToast("Unable to save batch data in browser storage.");
    }
  }, [batches]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setModalOpen(false);
        setEditingBatchId(null);
        setSelectedBatchId(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const stats = useMemo(() => {
    const totalLearners = batches.reduce(
      (sum, batch) => sum + Math.max(0, Number(batch.students) || 0),
      0,
    );

    const active = batches.filter(
      (batch) => batch.status === "Active",
    ).length;

    const upcoming = batches.filter(
      (batch) => batch.status === "Upcoming",
    ).length;

    const totalCapacity = batches.reduce(
      (sum, batch) => sum + Math.max(0, Number(batch.capacity) || 0),
      0,
    );

    const utilization =
      totalCapacity > 0
        ? Math.round((totalLearners / totalCapacity) * 100)
        : 0;

    return {
      total: batches.length,
      active,
      upcoming,
      totalLearners,
      utilization,
    };
  }, [batches]);

  const filteredBatches = useMemo(() => {
    const query = search.trim().toLowerCase();

    return batches
      .filter((batch) => {
        const searchable = [
          batch.id,
          batch.name,
          batch.course,
          batch.trainer,
          batch.department,
          batch.mode,
          batch.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchable.includes(query);

        const matchesCourse =
          courseFilter === "All courses" ||
          batch.course === courseFilter;

        const matchesStatus =
          statusFilter === "All statuses" ||
          batch.status === statusFilter;

        const matchesMode =
          modeFilter === "All modes" ||
          batch.mode === modeFilter;

        const matchesView =
          activeView === "All" ||
          batch.status === activeView;

        return (
          matchesSearch &&
          matchesCourse &&
          matchesStatus &&
          matchesMode &&
          matchesView
        );
      })
      .sort((a, b) => {
        const pinnedStatus = {
          Active: 0,
          Upcoming: 1,
          Draft: 2,
          Completed: 3,
        };

        const statusDifference =
          (pinnedStatus[a.status] ?? 4) -
          (pinnedStatus[b.status] ?? 4);

        if (statusDifference !== 0) return statusDifference;

        return String(b.createdAt || "").localeCompare(
          String(a.createdAt || ""),
        );
      });
  }, [
    batches,
    search,
    courseFilter,
    statusFilter,
    modeFilter,
    activeView,
  ]);

  const editingBatch = batches.find(
    (batch) => batch.id === editingBatchId,
  );

  const selectedBatch = batches.find(
    (batch) => batch.id === selectedBatchId,
  );

  function openCreate() {
    setEditingBatchId(null);
    setModalOpen(true);
  }

  function openEdit(batch) {
    setSelectedBatchId(null);
    setEditingBatchId(batch.id);
    setModalOpen(true);
  }

  function handleSave(formData) {
    if (editingBatchId) {
      setBatches((previous) =>
        previous.map((batch) =>
          batch.id === editingBatchId
            ? { ...batch, ...formData, updatedAt: getToday() }
            : batch,
        ),
      );

      setToast("Batch updated successfully.");
    } else {
      const id = getNextBatchId(batches);

      setBatches((previous) => [
        {
          id,
          ...formData,
          createdAt: getToday(),
          updatedAt: getToday(),
        },
        ...previous,
      ]);

      setToast(`Batch ${id} created successfully.`);
    }

    setModalOpen(false);
    setEditingBatchId(null);
  }

  function handleDelete(batch) {
    const confirmed = window.confirm(
      `Delete batch "${batch.name}" (${batch.id})?`,
    );

    if (!confirmed) return;

    setBatches((previous) =>
      previous.filter((item) => item.id !== batch.id),
    );

    if (selectedBatchId === batch.id) {
      setSelectedBatchId(null);
    }

    setToast(`${batch.id} deleted successfully.`);
  }

  async function copyBatch(batch) {
    const text = [
      `Batch ID: ${batch.id}`,
      `Name: ${batch.name}`,
      `Course: ${batch.course}`,
      `Trainer: ${batch.trainer}`,
      `Department: ${batch.department}`,
      `Mode: ${batch.mode}`,
      `Status: ${batch.status}`,
      `Start: ${formatDate(batch.startDate)}`,
      `End: ${formatDate(batch.endDate)}`,
      `Students: ${batch.students}/${batch.capacity}`,
      "",
      batch.description || "",
    ].join("\n");

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(text);
      setToast("Batch details copied.");
    } catch {
      setToast("Clipboard access is unavailable in this browser.");
    }
  }

  function exportCSV() {
    if (!filteredBatches.length) {
      setToast("No batches available to export.");
      return;
    }

    const headers = [
      "Batch ID",
      "Batch Name",
      "Course",
      "Trainer",
      "Department",
      "Mode",
      "Status",
      "Start Date",
      "End Date",
      "Students",
      "Capacity",
      "Available Seats",
      "Description",
    ];

    const rows = filteredBatches.map((batch) => {
      const enrollment = getEnrollment(batch);

      return [
        batch.id,
        batch.name,
        batch.course,
        batch.trainer,
        batch.department,
        batch.mode,
        batch.status,
        batch.startDate,
        batch.endDate,
        enrollment.students,
        enrollment.capacity,
        enrollment.available,
        batch.description,
      ];
    });

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "techmentor-college-batches.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setToast("Batch directory exported successfully.");
  }

  function resetFilters() {
    setSearch("");
    setCourseFilter("All courses");
    setStatusFilter("All statuses");
    setModeFilter("All modes");
    setActiveView("All");
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    courseFilter !== "All courses" ||
    statusFilter !== "All statuses" ||
    modeFilter !== "All modes" ||
    activeView !== "All";

  const metrics = [
    {
      icon: Layers,
      label: "Total batches",
      value: stats.total,
      note: "All registered batches",
      tone: "border-[#3A5D83] bg-[#1A3452] text-[#A9D5FF]",
    },
    {
      icon: CheckCircle2,
      label: "Active batches",
      value: stats.active,
      note: "Currently in progress",
      tone: "border-[#28634F] bg-[#15382F] text-[#8CE0BA]",
    },
    {
      icon: CalendarDays,
      label: "Upcoming batches",
      value: stats.upcoming,
      note: "Scheduled for the future",
      tone: "border-[#6C5632] bg-[#3A2F20] text-[#F2CD8B]",
    },
    {
      icon: UsersRound,
      label: "Total learners",
      value: stats.totalLearners,
      note: `${stats.utilization}% of total seat capacity`,
      tone: "border-[#51477E] bg-[#292442] text-[#CEC5FF]",
    },
  ];

  const views = [
    { label: "All", count: stats.total, icon: Layers },
    {
      label: "Active",
      count: batches.filter((item) => item.status === "Active").length,
      icon: CheckCircle2,
    },
    {
      label: "Upcoming",
      count: stats.upcoming,
      icon: CalendarDays,
    },
    {
      label: "Completed",
      count: batches.filter((item) => item.status === "Completed").length,
      icon: BadgeCheck,
    },
    {
      label: "Draft",
      count: batches.filter((item) => item.status === "Draft").length,
      icon: FileText,
    },
  ];

  return (
    <div
      className="min-h-full w-full overflow-x-clip text-[#EAF3FF]"
      style={{ backgroundColor: C.page }}
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        {/* PAGE HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"
        >
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#3B5C7F] bg-[#193858] text-[#B9DEFF] shadow-lg shadow-black/10">
              <Layers size={24} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80BFFF]">
                  INSTITUTION
                </span>

                <ChevronRight size={13} className="text-[#607A98]" />

                <span className="text-xs font-medium text-[#94A9C2]">
                  Academic management
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FF] sm:text-[30px]">
                Batches & Departments
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#97ADC7]">
                Organize academic cohorts, assign trainers, manage seats
                and keep track of each batch from one workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#344A66] bg-[#14253C] px-4 py-3 text-sm font-semibold text-[#C0D2E7] transition hover:border-[#52759A] hover:bg-[#1A304A] hover:text-white"
            >
              <Download size={17} />
              Export CSV
            </button>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BCFFF] bg-[#80BFFF] px-4 py-3 text-sm font-bold text-[#10233D] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#A0D0FF] focus:outline-none focus:ring-4 focus:ring-[#80BFFF]/20"
            >
              <Plus size={18} />
              Create batch
            </button>
          </div>
        </motion.header>

        {/* HERO BANNER */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative isolate overflow-hidden rounded-3xl border border-[#2D4868] bg-gradient-to-br from-[#142640] via-[#173251] to-[#1B3D60] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.2)] sm:p-7 lg:p-8"
        >
          <div className="pointer-events-none absolute -right-10 -top-28 h-72 w-72 rounded-full border border-[#A7D3FF]/10" />
          <div className="pointer-events-none absolute -right-2 -top-20 h-60 w-60 rounded-full border border-[#A7D3FF]/10" />
          <div className="pointer-events-none absolute -bottom-24 right-[18%] h-44 w-44 rounded-full bg-[#66B2FF]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#6685A9]/50 bg-[#274768] text-[#C4E4FF]">
                <GraduationCap size={27} strokeWidth={1.7} />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9DCDFF]">
                    ACADEMIC WORKSPACE
                  </span>

                  <span className="rounded-full border border-[#59718E] bg-[#203C59] px-2 py-0.5 text-[10px] font-semibold text-[#C5DFFF]">
                    Batch overview
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-[#F1F7FF] sm:text-2xl">
                  Every cohort, organized.
                </h2>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#B0C4DB]">
                  Plan learning schedules, coordinate trainers and make
                  enrollment capacity easy to monitor.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-[#476482] bg-[#142B45]/80 px-4 py-3.5 md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
                <Users size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#EFF6FF]">
                  Enrollment overview
                </p>

                <p className="mt-1 text-xs text-[#9EB6D1]">
                  {stats.totalLearners} learners across all batches
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* METRICS */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <StatCard
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              note={metric.note}
              tone={metric.tone}
            />
          ))}
        </section>

        {/* BATCH DIRECTORY */}
        <section className="overflow-visible rounded-3xl border border-[#293D58] bg-[#111F34] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col justify-between gap-4 rounded-t-3xl border-b border-[#293D58] p-5 sm:p-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                  <Layers size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#EAF3FF]">
                  Batch directory
                </h2>

                <span className="rounded-lg border border-[#395A7D] bg-[#1A3554] px-2 py-1 text-xs font-bold text-[#A9D5FF]">
                  {filteredBatches.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#92A8C2]">
                View, search and manage academic batches and assigned trainers.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#395B80] bg-[#193754] px-4 py-2.5 text-sm font-semibold text-[#B9DCFF] transition hover:bg-[#23476D] lg:self-auto"
            >
              <Plus size={17} />
              Add new batch
            </button>
          </div>

          {/* QUICK STATUS TABS */}
          <div className="flex gap-2 overflow-x-auto border-b border-[#293D58] bg-[#0E1A2C] px-4 py-3 sm:px-5">
            {views.map((view) => {
              const Icon = view.icon;
              const selected = activeView === view.label;

              return (
                <button
                  key={view.label}
                  type="button"
                  onClick={() => setActiveView(view.label)}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition ${selected
                    ? "border-[#648DB8] bg-[#1C3C5C] text-[#C8E6FF]"
                    : "border-transparent bg-transparent text-[#8FA5BE] hover:border-[#2E4561] hover:bg-[#152740] hover:text-[#D4E5F8]"
                    }`}
                >
                  <Icon size={15} />

                  {view.label}

                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] ${selected
                      ? "bg-[#2B5278] text-[#D6EBFF]"
                      : "bg-[#1B2B40] text-[#91A6BF]"
                      }`}
                  >
                    {view.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SEARCH + PREMIUM FILTER DROPDOWNS */}
          <div className="relative z-20 grid grid-cols-1 gap-3 border-b border-[#293D58] bg-[#0E1A2C] p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-[minmax(230px,1fr)_240px_180px_180px_auto]">
            <div className="relative min-w-0">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search batches, trainers, courses..."
                className={`${FIELD_CLASS} min-h-[46px] pl-10`}
              />
            </div>

            <PremiumSelect
              value={courseFilter}
              options={["All courses", ...COURSE_OPTIONS]}
              onChange={setCourseFilter}
              icon={BookOpen}
            />

            <PremiumSelect
              value={statusFilter}
              options={["All statuses", ...STATUS_OPTIONS]}
              onChange={setStatusFilter}
              icon={Filter}
            />

            <PremiumSelect
              value={modeFilter}
              options={["All modes", ...MODE_OPTIONS]}
              onChange={setModeFilter}
              icon={Monitor}
            />

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#344A66] bg-[#14253C] px-4 py-3 text-sm font-semibold text-[#AFC2D9] transition hover:border-[#52759A] hover:bg-[#1A304A] hover:text-[#D7EBFF]"
            >
              {hasActiveFilters ? (
                <RotateCcw size={16} />
              ) : (
                <X size={16} />
              )}
              Reset
            </button>
          </div>

          {/* TABLE */}
          <div className="relative z-10 w-full overflow-x-auto">
            <table className="w-full min-w-[1060px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#293D58] bg-[#152740]">
                  {[
                    "Batch",
                    "Course & mode",
                    "Trainer",
                    "Enrollment",
                    "Duration",
                    "Status",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#849BB7] sm:px-6 ${heading === "Actions" ? "text-right" : ""
                        }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#263952]">
                {filteredBatches.map((batch, index) => {
                  const CourseIcon = getCourseIcon(batch.course);
                  const enrollment = getEnrollment(batch);

                  return (
                    <motion.tr
                      key={batch.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(index * 0.025, 0.2),
                      }}
                      className="group transition-colors hover:bg-[#172A42]"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#344E6C] bg-[#19304A] text-[#A9D5FF]">
                            <CourseIcon size={20} />
                          </div>

                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() => setSelectedBatchId(batch.id)}
                              className="max-w-[240px] truncate text-left text-sm font-semibold text-[#EAF3FF] transition hover:text-[#A9D5FF]"
                            >
                              {batch.name}
                            </button>

                            <p className="mt-1 text-xs text-[#80BFFF]">
                              {batch.id}
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-xs text-[#7F96B1]">
                              {batch.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <p className="max-w-[220px] text-sm font-semibold text-[#CBD9EA]">
                          {batch.course}
                        </p>

                        <div className="mt-2">
                          <ModeBadge mode={batch.mode} />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#344E6C] bg-[#19304A] text-xs font-bold text-[#A9D5FF]">
                            {getInitials(batch.trainer)}
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-[#D5E3F3]">
                              {batch.trainer}
                            </p>

                            <p className="mt-1 text-xs text-[#7F96B1]">
                              {batch.trainer === "Unassigned"
                                ? "Assignment pending"
                                : "Assigned trainer"}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-[150px]">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-bold text-[#DCEBFC]">
                              {enrollment.students}
                              <span className="font-medium text-[#7F96B1]">
                                {" "}
                                / {enrollment.capacity}
                              </span>
                            </p>

                            <span className="text-[10px] font-semibold text-[#91BDE9]">
                              {enrollment.percentage}%
                            </span>
                          </div>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#263A53]">
                            <div
                              className={`h-full rounded-full transition-all duration-500 ${enrollment.percentage >= 90
                                ? "bg-amber-400"
                                : "bg-gradient-to-r from-[#4B9AE8] to-[#9BD1FF]"
                                }`}
                              style={{
                                width: `${enrollment.percentage}%`,
                              }}
                            />
                          </div>

                          <p className="mt-1.5 text-[10px] text-[#8299B5]">
                            {enrollment.available} seats available
                          </p>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2">
                          <CalendarDays
                            size={15}
                            className="mt-0.5 shrink-0 text-[#80BFFF]"
                          />

                          <div>
                            <p className="whitespace-nowrap text-xs font-semibold text-[#D0DFF0]">
                              {formatDate(batch.startDate)}
                            </p>

                            <p className="mt-1 whitespace-nowrap text-xs text-[#7F96B1]">
                              to {formatDate(batch.endDate)}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={batch.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <IconButton
                            label="View batch details"
                            onClick={() => setSelectedBatchId(batch.id)}
                          >
                            <Eye size={16} />
                          </IconButton>

                          <IconButton
                            label="Edit batch"
                            onClick={() => openEdit(batch)}
                          >
                            <Pencil size={15} />
                          </IconButton>

                          <IconButton
                            label="Delete batch"
                            onClick={() => handleDelete(batch)}
                            className="border-[#533B47] bg-[#241B2A] text-[#E9A8B9] hover:border-[#805364] hover:bg-[#36202C] hover:text-[#FFCAD8]"
                          >
                            <Trash2 size={15} />
                          </IconButton>
                        </div>
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {filteredBatches.length === 0 && (
              <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#344E6C] bg-[#192F49] text-[#A9D5FF]">
                  <Search size={25} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#E2EEFC]">
                  No batches found
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-[#91A7C0]">
                  Try another search or change your filters to find the
                  required batch.
                </p>

                <div className="mt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#395879] bg-[#193451] px-4 py-2.5 text-sm font-semibold text-[#B7D9FF] transition hover:bg-[#23466A]"
                  >
                    <RotateCcw size={15} />
                    Reset filters
                  </button>

                  <button
                    type="button"
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#80BFFF] px-4 py-2.5 text-sm font-bold text-[#10233D] transition hover:bg-[#A0D0FF]"
                  >
                    <Plus size={16} />
                    Create batch
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TABLE FOOTER */}
          <div className="flex flex-col gap-2 rounded-b-3xl border-t border-[#293D58] bg-[#0E1A2C] px-5 py-4 text-xs text-[#90A6C0] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              Showing{" "}
              <span className="font-bold text-[#E0ECFA]">
                {filteredBatches.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#E0ECFA]">
                {batches.length}
              </span>{" "}
              batches
            </p>

            <p className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#80BFFF]" />
              Batch data is saved in this browser
            </p>
          </div>
        </section>

        {/* ENROLLMENT SUMMARY */}
        <section className="rounded-3xl border border-[#293D58] bg-[#111F34] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                  <TrendingUp size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#EAF3FF]">
                  Enrollment capacity
                </h2>
              </div>

              <p className="mt-2 text-sm text-[#91A7C0]">
                A combined overview of the seats and learner counts entered
                for your batches.
              </p>
            </div>

            <div className="self-start rounded-xl border border-[#344D6B] bg-[#172B44] px-4 py-3 sm:self-auto">
              <p className="text-xs font-semibold text-[#8FA6C1]">
                Overall utilization
              </p>

              <p className="mt-1 text-2xl font-bold text-[#A9D5FF]">
                {stats.utilization}%
              </p>
            </div>
          </div>

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-[#22364F]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#3978B9] via-[#65ABE9] to-[#A4D4FF] transition-all duration-500"
              style={{ width: `${Math.min(100, stats.utilization)}%` }}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#293D58] bg-[#0E1A2C] p-4">
              <p className="text-xs text-[#8299B5]">Enrolled learners</p>
              <p className="mt-2 text-xl font-bold text-[#EAF3FF]">
                {stats.totalLearners}
              </p>
            </div>

            <div className="rounded-xl border border-[#293D58] bg-[#0E1A2C] p-4">
              <p className="text-xs text-[#8299B5]">Total seat capacity</p>
              <p className="mt-2 text-xl font-bold text-[#EAF3FF]">
                {batches.reduce(
                  (sum, batch) =>
                    sum + Math.max(0, Number(batch.capacity) || 0),
                  0,
                )}
              </p>
            </div>

            <div className="rounded-xl border border-[#293D58] bg-[#0E1A2C] p-4">
              <p className="text-xs text-[#8299B5]">Available seats</p>
              <p className="mt-2 text-xl font-bold text-[#A9D5FF]">
                {batches.reduce(
                  (sum, batch) => sum + getEnrollment(batch).available,
                  0,
                )}
              </p>
            </div>
          </div>
        </section>

        {/* INFORMATION STRIP */}
        <section className="flex flex-col gap-4 rounded-2xl border border-[#2A4563] bg-[#122640] p-5 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
            <Sparkles size={20} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#DFEDFC]">
              Keep academic operations organized
            </h3>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[#9BB0C8]">
              Maintain consistent batch naming, assign the appropriate trainer,
              select the learning mode and track enrollment capacity. Use the
              details view to review a batch before making changes.
            </p>
          </div>
        </section>
      </div>

      {/* CREATE / EDIT MODAL */}
      <BatchFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingBatchId(null);
        }}
        onSubmit={handleSave}
        editingBatch={editingBatch}
      />

      {/* DETAILS MODAL */}
      <BatchDetailsModal
        batch={selectedBatch}
        onClose={() => setSelectedBatchId(null)}
        onEdit={openEdit}
      />

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            role="status"
            className="fixed bottom-5 right-4 z-[150] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-[#3A5472] bg-[#152840] px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:bottom-6 sm:right-6"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-800 bg-emerald-950/70 text-emerald-300">
              <CheckCircle2 size={20} />
            </div>

            <p className="text-sm font-medium leading-5 text-[#DAE8F7]">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-lg p-1 text-[#8EA5BF] transition hover:bg-[#263D58] hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

