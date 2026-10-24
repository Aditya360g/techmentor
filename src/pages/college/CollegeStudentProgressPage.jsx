
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Users,
  Search,
  Download,
  GraduationCap,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertTriangle,
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
  TrendingUp,
  BookOpen,
  Monitor,
  MapPin,
  BadgeCheck,
  BarChart3,
  Target,
  UserRound,
  ClipboardCheck,
  Award,
  Plus,
  Mail,
  Layers,
  CircleUserRound,
} from "lucide-react";

/* =========================================================
   COLLEGE STUDENT PROGRESS
   Theme: Dark Navy + Ice Blue
   Storage: LocalStorage demo implementation
   ========================================================= */

const C = {
  page: "#0B1425",
  surface: "#111F34",
  surface2: "#152740",
  border: "#293D58",
  accent: "#80BFFF",
  muted: "#9FB2CA",
};

const STORAGE_KEY = "techmentor-college-student-progress-v1";

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

const BATCH_OPTIONS = [
  "Full Stack — October",
  "Data Science — Winter",
  "Python Foundation",
  "UI/UX Design Studio",
  "Java DSA — New Cohort",
];

const STATUS_OPTIONS = ["On Track", "At Risk", "Completed"];

const EMPTY_FORM = {
  name: "",
  email: "",
  course: COURSE_OPTIONS[0],
  batch: BATCH_OPTIONS[0],
  progress: "0",
  attendance: "0",
  score: "0",
};

const FIELD_CLASS =
  "w-full rounded-xl border border-[#344A66] bg-[#101D30] px-4 py-3 text-sm text-[#EAF3FF] outline-none transition placeholder:text-[#7187A2] focus:border-[#80BFFF] focus:ring-4 focus:ring-[#4B9AE8]/15";

const INITIAL_STUDENTS = [
  {
    id: "STU-2001",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    course: "Full Stack Development",
    batch: "Full Stack — October",
    progress: 86,
    attendance: 94,
    score: 88,
    status: "On Track",
    lastActivity: "2026-10-23",
    joined: "2026-08-15",
  },
  {
    id: "STU-2002",
    name: "Priya Verma",
    email: "priya@example.com",
    course: "Data Science & AI",
    batch: "Data Science — Winter",
    progress: 34,
    attendance: 58,
    score: 46,
    status: "At Risk",
    lastActivity: "2026-10-16",
    joined: "2026-09-01",
  },
  {
    id: "STU-2003",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    course: "Python Programming",
    batch: "Python Foundation",
    progress: 100,
    attendance: 96,
    score: 93,
    status: "Completed",
    lastActivity: "2026-10-21",
    joined: "2026-07-20",
  },
  {
    id: "STU-2004",
    name: "Sneha Patel",
    email: "sneha@example.com",
    course: "UI/UX Design",
    batch: "UI/UX Design Studio",
    progress: 68,
    attendance: 82,
    score: 76,
    status: "On Track",
    lastActivity: "2026-10-22",
    joined: "2026-09-10",
  },
  {
    id: "STU-2005",
    name: "Amit Singh",
    email: "amit@example.com",
    course: "Full Stack Development",
    batch: "Full Stack — October",
    progress: 22,
    attendance: 48,
    score: 39,
    status: "At Risk",
    lastActivity: "2026-10-12",
    joined: "2026-09-18",
  },
  {
    id: "STU-2006",
    name: "Neha Gupta",
    email: "neha@example.com",
    course: "Data Science & AI",
    batch: "Data Science — Winter",
    progress: 74,
    attendance: 89,
    score: 84,
    status: "On Track",
    lastActivity: "2026-10-23",
    joined: "2026-09-05",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

function loadStudents() {
  try {
    if (typeof window === "undefined") return INITIAL_STUDENTS;

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }

    return INITIAL_STUDENTS;
  } catch {
    return INITIAL_STUDENTS;
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
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function getNextStudentId(students) {
  const maxNumber = students.reduce((max, student) => {
    const match = String(student.id).match(/^STU-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 2000);

  return `STU-${maxNumber + 1}`;
}

function calculateStatus(progress, attendance) {
  if (progress >= 100) return "Completed";
  if (progress < 40 || attendance < 65) return "At Risk";

  return "On Track";
}

function getAvatarStyle(name = "") {
  const styles = [
    "border-[#355D88] bg-[#1A3555] text-[#A9D5FF]",
    "border-[#305F75] bg-[#163747] text-[#A5E3F3]",
    "border-[#514A82] bg-[#2A264D] text-[#CEC7FF]",
    "border-[#376B58] bg-[#183C31] text-[#A7E6C6]",
    "border-[#755C39] bg-[#42311D] text-[#F4D19B]",
    "border-[#754660] bg-[#422337] text-[#F1B8D5]",
  ];

  const index = name
    .split("")
    .reduce((total, character) => total + character.charCodeAt(0), 0);

  return styles[index % styles.length];
}

function getStatusStyle(status) {
  const styles = {
    "On Track": {
      badge: "border-[#3A5F86] bg-[#193653] text-[#AED7FF]",
      dot: "bg-[#80BFFF]",
    },
    "At Risk": {
      badge: "border-[#784A40] bg-[#3B2628] text-[#FFB4A8]",
      dot: "bg-[#FF8677]",
    },
    Completed: {
      badge: "border-emerald-800 bg-emerald-950/50 text-emerald-300",
      dot: "bg-emerald-400",
    },
  };

  return styles[status] || styles["On Track"];
}

function getProgressColor(progress) {
  if (progress >= 100) return "bg-emerald-400";
  if (progress < 40) return "bg-[#FF9284]";

  return "bg-gradient-to-r from-[#4B9AE8] to-[#9BD1FF]";
}

function getCourseIcon(course) {
  if (course?.includes("Data Science") || course?.includes("AI")) {
    return TrendingUp;
  }

  if (course?.includes("UI/UX")) {
    return Sparkles;
  }

  if (course?.includes("Cloud") || course?.includes("Cybersecurity")) {
    return Monitor;
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

function IconButton({ children, onClick, label, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#344A66] bg-[#14253C] text-[#A7BBD2] transition hover:border-[#628DBB] hover:bg-[#1A3555] hover:text-[#C8E5FF] ${className}`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   PREMIUM CUSTOM DROPDOWN
   Menu is rendered in a portal to avoid modal clipping.
   No native HTML select popup is used.
   ========================================================= */

function PremiumSelect({
  value,
  options,
  onChange,
  icon: Icon,
  placeholder = "Select an option",
}) {
  const [open, setOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState(null);

  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const selectedOption = options.find((option) => option === value);

  useEffect(() => {
    if (!open) return undefined;

    function updatePosition() {
      if (!triggerRef.current) return;

      const rect = triggerRef.current.getBoundingClientRect();

      const spaceBelow = window.innerHeight - rect.bottom - 16;
      const spaceAbove = rect.top - 16;

      const openAbove = spaceBelow < 200 && spaceAbove > spaceBelow;
      const availableSpace = openAbove ? spaceAbove : spaceBelow;
      const maxHeight = Math.max(100, Math.min(260, availableSpace));

      const left = Math.max(
        12,
        Math.min(rect.left, window.innerWidth - rect.width - 12),
      );

      setMenuPosition({
        position: "fixed",
        left,
        width: rect.width,
        maxHeight,
        top: openAbove
          ? Math.max(8, rect.top - maxHeight - 8)
          : rect.bottom + 8,
        zIndex: 9999,
      });
    }

    function handlePointerDown(event) {
      const inTrigger =
        rootRef.current?.contains(event.target) || false;

      const inMenu =
        menuRef.current?.contains(event.target) || false;

      if (!inTrigger && !inMenu) {
        setOpen(false);
      }
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") setOpen(false);
    }

    updatePosition();

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative min-w-0 w-full">
      <button
        ref={triggerRef}
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
            className={`shrink-0 ${open
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

      {open &&
        menuPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            <motion.div
              ref={menuRef}
              initial={{ opacity: 0, y: -5, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.985 }}
              transition={{ duration: 0.14 }}
              style={menuPosition}
              className="overflow-hidden rounded-2xl border border-[#3B5677] bg-[#111F34] p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.55)]"
            >
              <div
                role="listbox"
                aria-label="Options"
                className="h-full overflow-y-auto overscroll-contain"
                style={{ maxHeight: menuPosition.maxHeight }}
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
          </AnimatePresence>,
          document.body,
        )}
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
   PROGRESS BAR
   ========================================================= */

function ProgressBar({ value, showLabel = true }) {
  const safeValue = Math.max(0, Math.min(100, Number(value) || 0));

  return (
    <div className="w-full">
      {showLabel && (
        <div className="mb-2 flex items-center justify-between gap-3">
          <span className="text-xs font-medium text-[#91A7C0]">
            Course progress
          </span>

          <span className="text-xs font-bold text-[#DCEBFC]">
            {safeValue}%
          </span>
        </div>
      )}

      <div className="h-2 overflow-hidden rounded-full bg-[#263A53]">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getProgressColor(safeValue)}`}
          style={{ width: `${safeValue}%` }}
        />
      </div>
    </div>
  );
}

/* =========================================================
   STUDENT CREATE / EDIT MODAL
   ========================================================= */

function StudentFormModal({
  open,
  onClose,
  onSubmit,
  editingStudent,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (editingStudent) {
      setForm({
        name: editingStudent.name || "",
        email: editingStudent.email || "",
        course: editingStudent.course || COURSE_OPTIONS[0],
        batch: editingStudent.batch || BATCH_OPTIONS[0],
        progress: String(editingStudent.progress ?? 0),
        attendance: String(editingStudent.attendance ?? 0),
        score: String(editingStudent.score ?? 0),
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setError("");
  }, [open, editingStudent]);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();

    const progress = Number(form.progress);
    const attendance = Number(form.attendance);
    const score = Number(form.score);

    if (!name || !email || !form.course || !form.batch) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    for (const [label, value] of [
      ["Progress", progress],
      ["Attendance", attendance],
      ["Score", score],
    ]) {
      if (!Number.isFinite(value) || value < 0 || value > 100) {
        setError(`${label} must be between 0 and 100.`);
        return;
      }
    }

    onSubmit({
      ...form,
      name,
      email,
      progress,
      attendance,
      score,
      status: calculateStatus(progress, attendance),
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
            className="my-auto w-full max-w-2xl overflow-visible rounded-3xl border border-[#344A66] bg-[#111F34] shadow-[0_25px_90px_rgba(0,0,0,0.6)]"
          >
            <div className="relative overflow-hidden rounded-t-3xl border-b border-[#344A66] bg-gradient-to-r from-[#172B46] via-[#152740] to-[#1A3655] px-5 py-5 sm:px-7">
              <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full border border-[#7AB5EF]/15" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#52749B] bg-[#1B3A5B] text-[#A9D5FF]">
                    {editingStudent ? (
                      <Pencil size={21} />
                    ) : (
                      <Plus size={22} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#EFF6FF]">
                      {editingStudent ? "Update student progress" : "Add student"}
                    </h2>

                    <p className="mt-1 max-w-md text-sm leading-5 text-[#97ADC7]">
                      Manage enrollment details and update learning performance.
                    </p>
                  </div>
                </div>

                <IconButton label="Close dialog" onClick={onClose}>
                  <X size={18} />
                </IconButton>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="max-h-[calc(100dvh-150px)] space-y-5 overflow-y-auto p-5 sm:p-7"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Student name <span className="text-red-400">*</span>
                </label>

                <input
                  autoFocus
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter student name"
                  maxLength={100}
                  required
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Email address <span className="text-red-400">*</span>
                </label>

                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
                  />

                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="student@example.com"
                    maxLength={254}
                    required
                    className={`${FIELD_CLASS} pl-10`}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Course
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
                    Batch
                  </label>

                  <PremiumSelect
                    value={form.batch}
                    options={BATCH_OPTIONS}
                    onChange={(value) => updateField("batch", value)}
                    icon={Layers}
                  />
                </div>
              </div>

              <div className="rounded-2xl border border-[#293D58] bg-[#0E1A2C] p-4 sm:p-5">
                <div className="mb-4 flex items-center gap-2">
                  <BarChart3 size={18} className="text-[#80BFFF]" />

                  <h3 className="text-sm font-bold text-[#E0ECFA]">
                    Performance metrics
                  </h3>
                </div>

                <div className="grid gap-5 sm:grid-cols-3">
                  {[
                    {
                      field: "progress",
                      label: "Course progress",
                    },
                    {
                      field: "attendance",
                      label: "Attendance",
                    },
                    {
                      field: "score",
                      label: "Average score",
                    },
                  ].map((item) => (
                    <div key={item.field}>
                      <label className="mb-2 block text-xs font-semibold text-[#9DB2CA]">
                        {item.label} (%)
                      </label>

                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        required
                        value={form[item.field]}
                        onChange={(event) =>
                          updateField(item.field, event.target.value)
                        }
                        className={FIELD_CLASS}
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 rounded-xl border border-[#344A66] bg-[#152740] p-3">
                  <p className="text-xs font-semibold text-[#9CB2CC]">
                    Calculated student status
                  </p>

                  <div className="mt-2">
                    <StatusBadge
                      status={calculateStatus(
                        Number(form.progress) || 0,
                        Number(form.attendance) || 0,
                      )}
                    />
                  </div>

                  <p className="mt-2 text-[11px] leading-5 text-[#8299B5]">
                    Completed: 100% progress. At Risk: progress below 40%
                    or attendance below 65%. Otherwise, On Track.
                  </p>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="flex items-start gap-2.5 rounded-xl border border-red-900 bg-red-950/60 px-4 py-3 text-sm leading-5 text-red-300"
                >
                  <AlertTriangle size={17} className="mt-0.5 shrink-0" />
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
                  {editingStudent ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Plus size={17} />
                  )}

                  {editingStudent ? "Save progress" : "Add student"}
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
   STUDENT DETAILS MODAL
   ========================================================= */

function StudentDetailsModal({ student, onClose, onEdit }) {
  if (!student) return null;

  const CourseIcon = getCourseIcon(student.course);

  return (
    <AnimatePresence>
      {student && (
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
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-lg font-bold ${getAvatarStyle(student.name)}`}
                  >
                    {getInitials(student.name)}
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1 text-xs font-bold tracking-wider text-[#80BFFF]">
                      {student.id}
                    </p>

                    <h2 className="break-words text-xl font-bold text-[#EFF6FF]">
                      {student.name}
                    </h2>

                    <p className="mt-1 break-all text-sm text-[#9DB3CC]">
                      {student.email}
                    </p>
                  </div>
                </div>

                <IconButton label="Close details" onClick={onClose}>
                  <X size={18} />
                </IconButton>
              </div>
            </div>

            <div className="max-h-[calc(100dvh-170px)] space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge status={student.status} />

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#344A66] bg-[#14253C] px-3 py-1.5 text-xs font-semibold text-[#B7CBE2]">
                  <GraduationCap size={13} />
                  {student.course}
                </span>
              </div>

              <section className="rounded-2xl border border-[#293D58] bg-[#0D1A2B] p-4 sm:p-5">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#344E6C] bg-[#19304A] text-[#A9D5FF]">
                    <CourseIcon size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#DCEBFC]">
                      {student.batch}
                    </p>
                    <p className="mt-1 text-xs text-[#8299B5]">
                      Current enrolled batch
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <ProgressBar value={student.progress} />
                </div>
              </section>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {[
                  {
                    icon: TrendingUp,
                    label: "Course progress",
                    value: `${student.progress}%`,
                    tone: "text-[#A9D5FF]",
                  },
                  {
                    icon: CalendarDays,
                    label: "Attendance",
                    value: `${student.attendance}%`,
                    tone: "text-[#8CE0BA]",
                  },
                  {
                    icon: Award,
                    label: "Average score",
                    value: `${student.score}%`,
                    tone: "text-[#D0C6FF]",
                  },
                ].map((metric) => {
                  const Icon = metric.icon;

                  return (
                    <div
                      key={metric.label}
                      className="rounded-xl border border-[#293D58] bg-[#152740] p-4"
                    >
                      <Icon size={18} className={metric.tone} />

                      <p className="mt-3 text-xl font-bold text-[#EAF3FF]">
                        {metric.value}
                      </p>

                      <p className="mt-1 text-xs text-[#8299B5]">
                        {metric.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#293D58] bg-[#152740] p-4">
                  <div className="flex items-center gap-2 text-[#80BFFF]">
                    <CalendarDays size={16} />
                    <span className="text-xs font-semibold text-[#8FA6C1]">
                      JOINED DATE
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#E0ECFA]">
                    {formatDate(student.joined)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#293D58] bg-[#152740] p-4">
                  <div className="flex items-center gap-2 text-[#80BFFF]">
                    <Clock3 size={16} />
                    <span className="text-xs font-semibold text-[#8FA6C1]">
                      LAST ACTIVITY
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#E0ECFA]">
                    {formatDate(student.lastActivity)}
                  </p>
                </div>
              </div>

              {student.status === "At Risk" && (
                <div className="flex items-start gap-3 rounded-xl border border-[#714A42] bg-[#342326] p-4">
                  <AlertTriangle
                    size={18}
                    className="mt-0.5 shrink-0 text-[#FF9F91]"
                  />

                  <div>
                    <p className="text-sm font-bold text-[#FFD0C7]">
                      Student needs attention
                    </p>

                    <p className="mt-1 text-xs leading-5 text-[#D4A9A2]">
                      Review attendance and course progress and provide
                      appropriate academic support.
                    </p>
                  </div>
                </div>
              )}

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
                  onClick={() => onEdit(student)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#80BFFF] px-5 py-3 text-sm font-bold text-[#10233D] transition hover:bg-[#A0D0FF]"
                >
                  <Pencil size={16} />
                  Update progress
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

export default function CollegeStudentProgressPage() {
  const [students, setStudents] = useState(loadStudents);

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [batchFilter, setBatchFilter] = useState("All batches");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [activeView, setActiveView] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingStudentId, setEditingStudentId] = useState(null);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students),
      );
    } catch {
      setToast("Unable to save student data in browser storage.");
    }
  }, [students]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setModalOpen(false);
        setEditingStudentId(null);
        setSelectedStudentId(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const stats = useMemo(() => {
    const total = students.length;

    const averageProgress = total
      ? Math.round(
        students.reduce(
          (sum, student) => sum + (Number(student.progress) || 0),
          0,
        ) / total,
      )
      : 0;

    const averageAttendance = total
      ? Math.round(
        students.reduce(
          (sum, student) => sum + (Number(student.attendance) || 0),
          0,
        ) / total,
      )
      : 0;

    const atRisk = students.filter(
      (student) => student.status === "At Risk",
    ).length;

    const completed = students.filter(
      (student) => student.status === "Completed",
    ).length;

    return {
      total,
      averageProgress,
      averageAttendance,
      atRisk,
      completed,
    };
  }, [students]);

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students
      .filter((student) => {
        const searchable = [
          student.id,
          student.name,
          student.email,
          student.course,
          student.batch,
          student.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchable.includes(query);

        const matchesCourse =
          courseFilter === "All courses" ||
          student.course === courseFilter;

        const matchesBatch =
          batchFilter === "All batches" ||
          student.batch === batchFilter;

        const matchesStatus =
          statusFilter === "All statuses" ||
          student.status === statusFilter;

        const matchesView =
          activeView === "All" ||
          student.status === activeView;

        return (
          matchesSearch &&
          matchesCourse &&
          matchesBatch &&
          matchesStatus &&
          matchesView
        );
      })
      .sort((a, b) => {
        const riskDifference =
          (b.status === "At Risk" ? 1 : 0) -
          (a.status === "At Risk" ? 1 : 0);

        if (riskDifference !== 0) return riskDifference;

        return (
          (Number(a.progress) || 0) -
          (Number(b.progress) || 0)
        );
      });
  }, [
    students,
    search,
    courseFilter,
    batchFilter,
    statusFilter,
    activeView,
  ]);

  const editingStudent = students.find(
    (student) => student.id === editingStudentId,
  );

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId,
  );

  function openCreate() {
    setEditingStudentId(null);
    setModalOpen(true);
  }

  function openEdit(student) {
    setSelectedStudentId(null);
    setEditingStudentId(student.id);
    setModalOpen(true);
  }

  function handleSave(formData) {
    if (editingStudentId) {
      setStudents((previous) =>
        previous.map((student) =>
          student.id === editingStudentId
            ? {
              ...student,
              ...formData,
              lastActivity: getToday(),
            }
            : student,
        ),
      );

      setToast("Student progress updated successfully.");
    } else {
      const id = getNextStudentId(students);

      setStudents((previous) => [
        {
          id,
          ...formData,
          joined: getToday(),
          lastActivity: getToday(),
        },
        ...previous,
      ]);

      setToast(`Student ${id} added successfully.`);
    }

    setModalOpen(false);
    setEditingStudentId(null);
  }

  function handleDelete(student) {
    const confirmed = window.confirm(
      `Remove ${student.name} (${student.id}) from this progress directory?`,
    );

    if (!confirmed) return;

    setStudents((previous) =>
      previous.filter((item) => item.id !== student.id),
    );

    if (selectedStudentId === student.id) {
      setSelectedStudentId(null);
    }

    setToast(`${student.name} removed from the directory.`);
  }

  function exportCSV() {
    if (!filteredStudents.length) {
      setToast("No student records available to export.");
      return;
    }

    const headers = [
      "Student ID",
      "Name",
      "Email",
      "Course",
      "Batch",
      "Progress (%)",
      "Attendance (%)",
      "Average Score (%)",
      "Status",
      "Joined",
      "Last Activity",
    ];

    const rows = filteredStudents.map((student) => [
      student.id,
      student.name,
      student.email,
      student.course,
      student.batch,
      student.progress,
      student.attendance,
      student.score,
      student.status,
      student.joined,
      student.lastActivity,
    ]);

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
    anchor.download = "techmentor-student-progress.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setToast("Student progress exported successfully.");
  }

  function resetFilters() {
    setSearch("");
    setCourseFilter("All courses");
    setBatchFilter("All batches");
    setStatusFilter("All statuses");
    setActiveView("All");
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    courseFilter !== "All courses" ||
    batchFilter !== "All batches" ||
    statusFilter !== "All statuses" ||
    activeView !== "All";

  const metrics = [
    {
      icon: Users,
      label: "Total students",
      value: stats.total,
      note: "Students in this directory",
      tone: "border-[#3A5D83] bg-[#1A3452] text-[#A9D5FF]",
    },
    {
      icon: TrendingUp,
      label: "Average progress",
      value: `${stats.averageProgress}%`,
      note: "Mean course completion",
      tone: "border-[#365B85] bg-[#193653] text-[#A8D5FF]",
    },
    {
      icon: AlertTriangle,
      label: "Students at risk",
      value: stats.atRisk,
      note: "Require academic attention",
      tone: "border-[#784A40] bg-[#3B2628] text-[#FFB4A8]",
    },
    {
      icon: CheckCircle2,
      label: "Completed courses",
      value: stats.completed,
      note: "Students marked completed",
      tone: "border-[#28634F] bg-[#15382F] text-[#8CE0BA]",
    },
  ];

  const views = [
    {
      label: "All",
      count: students.length,
      icon: Users,
    },
    {
      label: "On Track",
      count: students.filter((item) => item.status === "On Track").length,
      icon: TrendingUp,
    },
    {
      label: "At Risk",
      count: stats.atRisk,
      icon: AlertTriangle,
    },
    {
      label: "Completed",
      count: stats.completed,
      icon: CheckCircle2,
    },
  ];

  return (
    <div
      className="min-h-full w-full overflow-x-clip text-[#EAF3FF]"
      style={{ backgroundColor: C.page }}
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        {/* HEADER */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"
        >
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#3B5C7F] bg-[#193858] text-[#B9DEFF] shadow-lg shadow-black/10">
              <BarChart3 size={24} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80BFFF]">
                  INSTITUTION
                </span>

                <ChevronRight size={13} className="text-[#607A98]" />

                <span className="text-xs font-medium text-[#94A9C2]">
                  Academic analytics
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FF] sm:text-[30px]">
                Student Progress
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#97ADC7]">
                Track learning progress, attendance, assessment scores and
                identify students who need academic support.
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
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BCFFF] bg-[#80BFFF] px-4 py-3 text-sm font-bold text-[#10233D] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#A0D0FF]"
            >
              <Plus size={18} />
              Add student
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
                    LEARNING ANALYTICS
                  </span>

                  <span className="rounded-full border border-[#59718E] bg-[#203C59] px-2 py-0.5 text-[10px] font-semibold text-[#C5DFFF]">
                    Student overview
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-[#F1F7FF] sm:text-2xl">
                  Every learner has a trajectory.
                </h2>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#B0C4DB]">
                  Monitor progress, review learning performance and take
                  action before students fall behind.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-[#476482] bg-[#142B45]/80 px-4 py-3.5 md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
                <Target size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#EFF6FF]">
                  Academic overview
                </p>

                <p className="mt-1 text-xs text-[#9EB6D1]">
                  {stats.averageAttendance}% average attendance
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

        {/* PROGRESS OVERVIEW */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_0.7fr]">
          <div className="rounded-2xl border border-[#293D58] bg-[#111F34] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                    <TrendingUp size={18} />
                  </div>

                  <h2 className="text-base font-bold text-[#EAF3FF]">
                    Learning performance
                  </h2>
                </div>

                <p className="mt-2 text-sm text-[#91A7C0]">
                  Overall student progress and attendance.
                </p>
              </div>

              <span className="rounded-xl border border-[#344D6B] bg-[#172B44] px-3 py-2 text-xs font-bold text-[#B3D6FA]">
                {stats.total} students
              </span>
            </div>

            <div className="mt-6 grid gap-5 sm:grid-cols-2">
              <div className="rounded-2xl border border-[#293D58] bg-[#0E1A2C] p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-[#A9D5FF]">
                    <BookOpen size={17} />
                    <span className="text-sm font-semibold text-[#C9D9EB]">
                      Course progress
                    </span>
                  </div>

                  <span className="text-lg font-bold text-[#DCEBFC]">
                    {stats.averageProgress}%
                  </span>
                </div>

                <div className="mt-4">
                  <ProgressBar
                    value={stats.averageProgress}
                    showLabel={false}
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-[#8299B5]">
                  Average learning completion across the directory.
                </p>
              </div>

              <div className="rounded-2xl border border-[#293D58] bg-[#0E1A2C] p-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CalendarDays size={17} />
                    <span className="text-sm font-semibold text-[#C9D9EB]">
                      Attendance
                    </span>
                  </div>

                  <span className="text-lg font-bold text-[#DCEBFC]">
                    {stats.averageAttendance}%
                  </span>
                </div>

                <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#263A53]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-emerald-600 to-emerald-300 transition-all duration-500"
                    style={{ width: `${stats.averageAttendance}%` }}
                  />
                </div>

                <p className="mt-3 text-xs leading-5 text-[#8299B5]">
                  Mean attendance percentage for all listed students.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#293D58] bg-[#111F34] p-5 sm:p-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#714A42] bg-[#342326] text-[#FFB4A8]">
                <AlertTriangle size={18} />
              </div>

              <h2 className="text-base font-bold text-[#EAF3FF]">
                Students needing attention
              </h2>
            </div>

            <p className="mt-2 text-sm text-[#91A7C0]">
              Students whose course progress or attendance is below the set
              thresholds.
            </p>

            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="text-4xl font-bold text-[#FFB4A8]">
                  {stats.atRisk}
                </p>

                <p className="mt-1.5 text-xs text-[#91A7C0]">
                  At-risk students
                </p>
              </div>

              <button
                type="button"
                onClick={() => setActiveView("At Risk")}
                className="inline-flex items-center gap-2 rounded-xl border border-[#714A42] bg-[#342326] px-3.5 py-2.5 text-xs font-bold text-[#FFB4A8] transition hover:bg-[#472C30]"
              >
                Review students
                <ChevronRight size={15} />
              </button>
            </div>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-[#263A53]">
              <div
                className="h-full rounded-full bg-[#FF9284] transition-all duration-500"
                style={{
                  width: `${stats.total
                    ? (stats.atRisk / stats.total) * 100
                    : 0
                    }%`,
                }}
              />
            </div>
          </div>
        </section>

        {/* STUDENT DIRECTORY */}
        <section className="overflow-visible rounded-3xl border border-[#293D58] bg-[#111F34] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col justify-between gap-4 rounded-t-3xl border-b border-[#293D58] p-5 sm:p-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                  <Users size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#EAF3FF]">
                  Student directory
                </h2>

                <span className="rounded-lg border border-[#395A7D] bg-[#1A3554] px-2 py-1 text-xs font-bold text-[#A9D5FF]">
                  {filteredStudents.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#92A8C2]">
                Review individual progress, attendance and assessment results.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#395B80] bg-[#193754] px-4 py-2.5 text-sm font-semibold text-[#B9DCFF] transition hover:bg-[#23476D] lg:self-auto"
            >
              <Plus size={17} />
              Add student
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

          {/* SEARCH + PREMIUM FILTERS */}
          <div className="relative z-20 grid grid-cols-1 gap-3 border-b border-[#293D58] bg-[#0E1A2C] p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_240px_225px_190px_auto]">
            <div className="relative min-w-0">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, ID, email..."
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
              value={batchFilter}
              options={["All batches", ...BATCH_OPTIONS]}
              onChange={setBatchFilter}
              icon={Layers}
            />

            <PremiumSelect
              value={statusFilter}
              options={["All statuses", ...STATUS_OPTIONS]}
              onChange={setStatusFilter}
              icon={Filter}
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
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#293D58] bg-[#152740]">
                  {[
                    "Student",
                    "Course & batch",
                    "Progress",
                    "Attendance",
                    "Avg. score",
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
                {filteredStudents.map((student, index) => {
                  const CourseIcon = getCourseIcon(student.course);

                  return (
                    <motion.tr
                      key={student.id}
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(index * 0.025, 0.2),
                      }}
                      className="group transition-colors hover:bg-[#172A42]"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <div className="flex items-center gap-3">
                          <div
                            className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${getAvatarStyle(student.name)}`}
                          >
                            {getInitials(student.name)}
                          </div>

                          <div className="min-w-0">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedStudentId(student.id)
                              }
                              className="max-w-[220px] truncate text-left text-sm font-semibold text-[#EAF3FF] transition hover:text-[#A9D5FF]"
                            >
                              {student.name}
                            </button>

                            <p className="mt-1 text-xs text-[#80BFFF]">
                              {student.id}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8299B5]">
                              <Mail size={12} className="shrink-0" />
                              <span className="max-w-[185px] truncate">
                                {student.email}
                              </span>
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-2.5">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#344E6C] bg-[#19304A] text-[#A9D5FF]">
                            <CourseIcon size={17} />
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[210px] text-sm font-semibold text-[#D0DFF0]">
                              {student.course}
                            </p>

                            <p className="mt-1 max-w-[210px] truncate text-xs text-[#8299B5]">
                              {student.batch}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-[130px]">
                          <div className="mb-2 flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-[#DCEBFC]">
                              {student.progress}%
                            </span>
                          </div>

                          <ProgressBar
                            value={student.progress}
                            showLabel={false}
                          />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-[100px]">
                          <p
                            className={`text-sm font-bold ${student.attendance < 65
                              ? "text-[#FFB4A8]"
                              : "text-[#DCEBFC]"
                              }`}
                          >
                            {student.attendance}%
                          </p>

                          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#263A53]">
                            <div
                              className={`h-full rounded-full ${student.attendance < 65
                                ? "bg-[#FF9284]"
                                : "bg-emerald-400"
                                }`}
                              style={{
                                width: `${student.attendance}%`,
                              }}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Award
                            size={15}
                            className={
                              student.score < 50
                                ? "text-[#FFB4A8]"
                                : "text-[#A9D5FF]"
                            }
                          />

                          <span className="text-sm font-bold text-[#DCEBFC]">
                            {student.score}%
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <StatusBadge status={student.status} />
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <IconButton
                            label="View student details"
                            onClick={() =>
                              setSelectedStudentId(student.id)
                            }
                          >
                            <Eye size={16} />
                          </IconButton>

                          <IconButton
                            label="Update student progress"
                            onClick={() => openEdit(student)}
                          >
                            <Pencil size={15} />
                          </IconButton>

                          <IconButton
                            label="Delete student"
                            onClick={() => handleDelete(student)}
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

            {filteredStudents.length === 0 && (
              <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#344E6C] bg-[#192F49] text-[#A9D5FF]">
                  <Search size={25} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#E2EEFC]">
                  No students found
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-[#91A7C0]">
                  Try another search or adjust your filters to find the
                  students you need.
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
                    Add student
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
                {filteredStudents.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#E0ECFA]">
                {students.length}
              </span>{" "}
              students
            </p>

            <p className="inline-flex items-center gap-1.5">
              <BadgeCheck size={14} className="text-[#80BFFF]" />
              Student progress overview
            </p>
          </div>
        </section>

        {/* STATUS GUIDELINES */}
        <section className="rounded-3xl border border-[#293D58] bg-[#111F34] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#EAF3FF]">
                Student status guidelines
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-[#91A7C0]">
                Status is calculated from course progress and attendance
                whenever you add or update a student record.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-[#3A5F86] bg-[#193653] p-4">
              <StatusBadge status="On Track" />
              <p className="mt-3 text-xs leading-5 text-[#A8C5E3]">
                Progress is at least 40% and attendance is at least 65%,
                with the course not yet completed.
              </p>
            </div>

            <div className="rounded-xl border border-[#784A40] bg-[#3B2628] p-4">
              <StatusBadge status="At Risk" />
              <p className="mt-3 text-xs leading-5 text-[#D5A9A2]">
                Progress is below 40% or attendance is below 65%.
              </p>
            </div>

            <div className="rounded-xl border border-emerald-800 bg-emerald-950/40 p-4">
              <StatusBadge status="Completed" />
              <p className="mt-3 text-xs leading-5 text-emerald-200/75">
                Course progress has reached 100%.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* CREATE / EDIT MODAL */}
      <StudentFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingStudentId(null);
        }}
        onSubmit={handleSave}
        editingStudent={editingStudent}
      />

      {/* DETAILS MODAL */}
      <StudentDetailsModal
        student={selectedStudent}
        onClose={() => setSelectedStudentId(null)}
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
