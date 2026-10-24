
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
  BadgeCheck,
  BarChart3,
  Target,
  UserRound,
  ClipboardCheck,
  Award,
  Plus,
  Mail,
  Layers,
  UserCheck,
  UserX,
  Timer,
  CircleHelp,
  CalendarCheck,
} from "lucide-react";

/* =========================================================
   COLLEGE ATTENDANCE MANAGEMENT
   Theme: Dark Navy + Ice Blue
   Storage: LocalStorage demo implementation
   ========================================================= */

const C = {
  page: "#0B1425",
  surface: "#111F34",
  surface2: "#152740",
  surface3: "#1A304D",
  border: "#293D58",
  accent: "#80BFFF",
};

const STORAGE_KEY = "techmentor-college-attendance-v1";

const BATCH_OPTIONS = [
  "Full Stack — October",
  "Data Science — Winter",
  "Python Foundation",
  "UI/UX Design Studio",
  "Java DSA — New Cohort",
];

const ATTENDANCE_OPTIONS = [
  "Unmarked",
  "Present",
  "Absent",
  "Late",
  "Leave",
];

const EMPTY_STUDENT = {
  name: "",
  email: "",
  batch: BATCH_OPTIONS[0],
  department: "Computer Science",
};

const FIELD_CLASS =
  "w-full rounded-xl border border-[#344A66] bg-[#101D30] px-4 py-3 text-sm text-[#EAF3FF] outline-none transition placeholder:text-[#7187A2] focus:border-[#80BFFF] focus:ring-4 focus:ring-[#4B9AE8]/15";

const INITIAL_STUDENTS = [
  {
    id: "STU-3001",
    name: "Aarav Sharma",
    email: "aarav@example.com",
    batch: "Full Stack — October",
    department: "Computer Science",
    joined: "2026-08-15",
  },
  {
    id: "STU-3002",
    name: "Priya Verma",
    email: "priya@example.com",
    batch: "Data Science — Winter",
    department: "AI & Data Science",
    joined: "2026-09-01",
  },
  {
    id: "STU-3003",
    name: "Rahul Mehta",
    email: "rahul@example.com",
    batch: "Python Foundation",
    department: "Computer Science",
    joined: "2026-07-20",
  },
  {
    id: "STU-3004",
    name: "Sneha Patel",
    email: "sneha@example.com",
    batch: "UI/UX Design Studio",
    department: "Design",
    joined: "2026-09-10",
  },
  {
    id: "STU-3005",
    name: "Amit Singh",
    email: "amit@example.com",
    batch: "Full Stack — October",
    department: "Computer Science",
    joined: "2026-09-18",
  },
  {
    id: "STU-3006",
    name: "Neha Gupta",
    email: "neha@example.com",
    batch: "Data Science — Winter",
    department: "AI & Data Science",
    joined: "2026-09-05",
  },
  {
    id: "STU-3007",
    name: "Vikram Singh",
    email: "vikram@example.com",
    batch: "Java DSA — New Cohort",
    department: "Computer Science",
    joined: "2026-10-12",
  },
  {
    id: "STU-3008",
    name: "Kavya Joshi",
    email: "kavya@example.com",
    batch: "Python Foundation",
    department: "Computer Science",
    joined: "2026-08-25",
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

function getToday() {
  const now = new Date();
  const local = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  );

  return local.toISOString().slice(0, 10);
}

function createInitialStore() {
  const date = getToday();

  return {
    students: INITIAL_STUDENTS,
    records: {
      [date]: {
        "STU-3001": "Present",
        "STU-3002": "Late",
        "STU-3003": "Present",
        "STU-3004": "Present",
        "STU-3005": "Absent",
        "STU-3006": "Unmarked",
        "STU-3007": "Present",
        "STU-3008": "Leave",
      },
    },
  };
}

function loadStore() {
  try {
    if (typeof window === "undefined") {
      return createInitialStore();
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);

      if (
        parsed &&
        Array.isArray(parsed.students) &&
        parsed.records &&
        typeof parsed.records === "object"
      ) {
        return parsed;
      }
    }

    return createInitialStore();
  } catch {
    return createInitialStore();
  }
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
  }, 3000);

  return `STU-${maxNumber + 1}`;
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
    .reduce((sum, character) => sum + character.charCodeAt(0), 0);

  return styles[index % styles.length];
}

function getAttendanceStyle(status) {
  const styles = {
    Present: {
      badge: "border-emerald-800 bg-emerald-950/50 text-emerald-300",
      dot: "bg-emerald-400",
    },
    Absent: {
      badge: "border-[#784A40] bg-[#3B2628] text-[#FFB4A8]",
      dot: "bg-[#FF8677]",
    },
    Late: {
      badge: "border-amber-800 bg-amber-950/50 text-amber-300",
      dot: "bg-amber-400",
    },
    Leave: {
      badge: "border-violet-800 bg-violet-950/40 text-violet-300",
      dot: "bg-violet-400",
    },
    Unmarked: {
      badge: "border-slate-600 bg-slate-800 text-slate-300",
      dot: "bg-slate-400",
    },
  };

  return styles[status] || styles.Unmarked;
}

function getCourseIcon(batch) {
  if (batch?.includes("Data Science")) return TrendingUp;
  if (batch?.includes("UI/UX")) return Sparkles;
  if (batch?.includes("Java")) return FileText;
  if (batch?.includes("Python")) return BookOpen;

  return GraduationCap;
}

function calculateSummary(students, dayRecords) {
  const summary = {
    total: students.length,
    Present: 0,
    Absent: 0,
    Late: 0,
    Leave: 0,
    Unmarked: 0,
  };

  students.forEach((student) => {
    const status = dayRecords[student.id] || "Unmarked";

    if (Object.prototype.hasOwnProperty.call(summary, status)) {
      summary[status] += 1;
    } else {
      summary.Unmarked += 1;
    }
  });

  const marked =
    summary.Present +
    summary.Absent +
    summary.Late +
    summary.Leave;

  const eligible = summary.Present + summary.Absent + summary.Late;

  const attendanceRate =
    eligible > 0
      ? Math.round(((summary.Present + summary.Late) / eligible) * 100)
      : 0;

  return {
    ...summary,
    marked,
    attendanceRate,
    completion:
      students.length > 0
        ? Math.round((marked / students.length) * 100)
        : 0,
  };
}

/* =========================================================
   BADGES
   ========================================================= */

function AttendanceBadge({ status }) {
  const style = getAttendanceStyle(status);

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
   PREMIUM ANIMATED DROPDOWN
   Uses a portal so the popup isn't clipped by table/modal areas.
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

      const spaceBelow = window.innerHeight - rect.bottom - 12;
      const spaceAbove = rect.top - 12;
      const openAbove = spaceBelow < 200 && spaceAbove > spaceBelow;
      const availableSpace = openAbove ? spaceAbove : spaceBelow;
      const maxHeight = Math.max(110, Math.min(260, availableSpace));

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
      const inTrigger = rootRef.current?.contains(event.target) || false;
      const inMenu = menuRef.current?.contains(event.target) || false;

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
   ADD STUDENT MODAL
   ========================================================= */

function AddStudentModal({ open, onClose, onSubmit, students }) {
  const [form, setForm] = useState(EMPTY_STUDENT);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    setForm(EMPTY_STUDENT);
    setError("");
  }, [open]);

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

    if (!name || !email || !form.batch || !form.department.trim()) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const duplicate = students.some(
      (student) => student.email.toLowerCase() === email,
    );

    if (duplicate) {
      setError("A student with this email already exists.");
      return;
    }

    onSubmit({
      ...form,
      name,
      email,
      department: form.department.trim(),
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
            className="my-auto w-full max-w-xl overflow-visible rounded-3xl border border-[#344A66] bg-[#111F34] shadow-[0_25px_90px_rgba(0,0,0,0.6)]"
          >
            <div className="relative overflow-hidden rounded-t-3xl border-b border-[#344A66] bg-gradient-to-r from-[#172B46] via-[#152740] to-[#1A3655] px-5 py-5 sm:px-7">
              <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full border border-[#7AB5EF]/15" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#52749B] bg-[#1B3A5B] text-[#A9D5FF]">
                    <Plus size={22} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#EFF6FF]">
                      Add student
                    </h2>

                    <p className="mt-1 max-w-sm text-sm leading-5 text-[#97ADC7]">
                      Add a learner to the attendance directory.
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
              className="space-y-5 p-5 sm:p-7"
            >
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Student name <span className="text-red-400">*</span>
                </label>

                <input
                  autoFocus
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter student's full name"
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

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Department
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

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-300"
                >
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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#80BFFF] px-5 py-3 text-sm font-bold text-[#10233D] transition hover:bg-[#A0D0FF]"
                >
                  <UserCheck size={17} />
                  Add to directory
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
   STUDENT DETAIL MODAL
   ========================================================= */

function StudentDetailsModal({
  student,
  selectedDate,
  records,
  onClose,
  onMark,
}) {
  if (!student) return null;

  const studentHistory = Object.entries(records)
    .filter(([date, dayRecords]) => {
      return (
        date <= selectedDate &&
        Object.prototype.hasOwnProperty.call(dayRecords, student.id)
      );
    })
    .sort(([a], [b]) => b.localeCompare(a));

  const attendedCount = studentHistory.filter(([, dayRecords]) =>
    ["Present", "Late"].includes(dayRecords[student.id]),
  ).length;

  const absentCount = studentHistory.filter(
    ([, dayRecords]) => dayRecords[student.id] === "Absent",
  ).length;

  const leaveCount = studentHistory.filter(
    ([, dayRecords]) => dayRecords[student.id] === "Leave",
  ).length;

  const status = records[selectedDate]?.[student.id] || "Unmarked";

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

            <div className="max-h-[calc(100dvh-160px)] space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="rounded-2xl border border-[#293D58] bg-[#0D1A2B] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#8299B5]">
                  Batch & department
                </p>

                <p className="mt-2 text-sm font-bold text-[#E0ECFA]">
                  {student.batch}
                </p>

                <p className="mt-1 text-xs text-[#91A7C0]">
                  {student.department}
                </p>

                <p className="mt-2 text-xs text-[#91A7C0]">
                  Joined {formatDate(student.joined)}
                </p>
              </div>

              <section>
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-sm font-bold text-[#E3EFFD]">
                    Attendance on {formatDate(selectedDate)}
                  </h3>

                  <AttendanceBadge status={status} />
                </div>

                <div className="grid grid-cols-1 gap-2 sm:grid-cols-5">
                  {ATTENDANCE_OPTIONS.filter(
                    (option) => option !== "Unmarked",
                  ).map((option) => {
                    const style = getAttendanceStyle(option);
                    const selected = status === option;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() => onMark(student.id, option)}
                        className={`rounded-xl border px-3 py-3 text-xs font-bold transition ${selected
                          ? style.badge
                          : "border-[#344A66] bg-[#14253C] text-[#9FB2CA] hover:bg-[#1A304D]"
                          }`}
                      >
                        {option}
                      </button>
                    );
                  })}
                </div>
              </section>

              <section>
                <h3 className="mb-3 text-sm font-bold text-[#E3EFFD]">
                  Recorded attendance history
                </h3>

                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-[#28634F] bg-[#15382F] p-3">
                    <p className="text-xl font-bold text-[#8CE0BA]">
                      {attendedCount}
                    </p>
                    <p className="mt-1 text-xs text-[#98BBAA]">
                      Present / Late
                    </p>
                  </div>

                  <div className="rounded-xl border border-[#784A40] bg-[#3B2628] p-3">
                    <p className="text-xl font-bold text-[#FFB4A8]">
                      {absentCount}
                    </p>
                    <p className="mt-1 text-xs text-[#D5A9A2]">
                      Absent
                    </p>
                  </div>

                  <div className="rounded-xl border border-violet-800 bg-violet-950/40 p-3">
                    <p className="text-xl font-bold text-violet-300">
                      {leaveCount}
                    </p>
                    <p className="mt-1 text-xs text-violet-300/70">
                      Leave
                    </p>
                  </div>
                </div>

                <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                  {studentHistory.length > 0 ? (
                    studentHistory.map(([date, dayRecords]) => (
                      <div
                        key={date}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#293D58] bg-[#152740] px-3.5 py-3"
                      >
                        <span className="text-sm text-[#C2D4E7]">
                          {formatDate(date)}
                        </span>

                        <AttendanceBadge status={dayRecords[student.id]} />
                      </div>
                    ))
                  ) : (
                    <p className="rounded-xl border border-[#293D58] bg-[#152740] p-4 text-sm text-[#91A7C0]">
                      No attendance history has been recorded for this student.
                    </p>
                  )}
                </div>
              </section>

              <div className="flex justify-end border-t border-[#293D58] pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#3A506C] bg-[#172840] px-5 py-3 text-sm font-semibold text-[#C1D0E2] transition hover:bg-[#203750]"
                >
                  Close details
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

export default function CollegeAttendancePage() {
  const [store, setStore] = useState(loadStore);
  const [selectedDate, setSelectedDate] = useState(getToday);

  const [search, setSearch] = useState("");
  const [batchFilter, setBatchFilter] = useState("All batches");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [activeView, setActiveView] = useState("All");

  const [selectedIds, setSelectedIds] = useState([]);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [toast, setToast] = useState("");

  const students = store.students || [];
  const dayRecords = store.records?.[selectedDate] || {};

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
    } catch {
      setToast("Unable to save attendance data in browser storage.");
    }
  }, [store]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setAddModalOpen(false);
        setSelectedStudentId(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const summary = useMemo(
    () => calculateSummary(students, dayRecords),
    [students, dayRecords],
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    return students
      .filter((student) => {
        const attendance = dayRecords[student.id] || "Unmarked";

        const searchable = [
          student.id,
          student.name,
          student.email,
          student.batch,
          student.department,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchable.includes(query);

        const matchesBatch =
          batchFilter === "All batches" ||
          student.batch === batchFilter;

        const matchesStatus =
          statusFilter === "All statuses" ||
          attendance === statusFilter;

        const matchesView =
          activeView === "All" ||
          attendance === activeView;

        return (
          matchesSearch &&
          matchesBatch &&
          matchesStatus &&
          matchesView
        );
      })
      .sort((a, b) => {
        const priority = {
          Absent: 0,
          Late: 1,
          Unmarked: 2,
          Present: 3,
          Leave: 4,
        };

        const aStatus = dayRecords[a.id] || "Unmarked";
        const bStatus = dayRecords[b.id] || "Unmarked";

        const difference =
          (priority[aStatus] ?? 5) - (priority[bStatus] ?? 5);

        if (difference !== 0) return difference;

        return a.name.localeCompare(b.name);
      });
  }, [
    students,
    dayRecords,
    search,
    batchFilter,
    statusFilter,
    activeView,
  ]);

  const selectedStudent = students.find(
    (student) => student.id === selectedStudentId,
  );

  const visibleSelectedCount = filteredStudents.filter(
    (student) => selectedIds.includes(student.id),
  ).length;

  const allVisibleSelected =
    filteredStudents.length > 0 &&
    filteredStudents.every((student) => selectedIds.includes(student.id));

  function updateDayRecords(updater) {
    setStore((previous) => {
      const previousDay = previous.records?.[selectedDate] || {};

      const nextDay =
        typeof updater === "function"
          ? updater(previousDay)
          : updater;

      return {
        ...previous,
        records: {
          ...previous.records,
          [selectedDate]: nextDay,
        },
      };
    });
  }

  function markAttendance(studentId, status) {
    updateDayRecords((previousDay) => ({
      ...previousDay,
      [studentId]: status,
    }));

    const student = students.find((item) => item.id === studentId);

    setToast(
      `${student?.name || "Student"} marked as ${status.toLowerCase()}.`,
    );
  }

  function markBulk(status) {
    if (!selectedIds.length) {
      setToast("Select at least one student first.");
      return;
    }

    const ids = new Set(selectedIds);

    updateDayRecords((previousDay) => {
      const next = { ...previousDay };

      ids.forEach((id) => {
        next[id] = status;
      });

      return next;
    });

    setSelectedIds([]);
    setToast(`${ids.size} student(s) marked as ${status.toLowerCase()}.`);
  }

  function markAllVisible(status) {
    if (!filteredStudents.length) {
      setToast("There are no visible students to update.");
      return;
    }

    const confirmed = window.confirm(
      `Mark all ${filteredStudents.length} visible students as ${status}?`,
    );

    if (!confirmed) return;

    updateDayRecords((previousDay) => {
      const next = { ...previousDay };

      filteredStudents.forEach((student) => {
        next[student.id] = status;
      });

      return next;
    });

    setSelectedIds([]);
    setToast(`Visible students marked as ${status.toLowerCase()}.`);
  }

  function toggleStudent(id) {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  }

  function toggleVisibleStudents() {
    const visibleIds = filteredStudents.map((student) => student.id);

    if (allVisibleSelected) {
      setSelectedIds((previous) =>
        previous.filter((id) => !visibleIds.includes(id)),
      );
    } else {
      setSelectedIds((previous) =>
        [...new Set([...previous, ...visibleIds])],
      );
    }
  }

  function changeDate(date) {
    setSelectedDate(date);
    setSelectedIds([]);
  }

  function addStudent(form) {
    const student = {
      id: getNextStudentId(students),
      ...form,
      joined: getToday(),
    };

    setStore((previous) => ({
      ...previous,
      students: [student, ...previous.students],
    }));

    setAddModalOpen(false);
    setToast(`${student.name} added to the attendance directory.`);
  }

  function deleteStudent(student) {
    const confirmed = window.confirm(
      `Remove ${student.name} (${student.id}) from the attendance directory?`,
    );

    if (!confirmed) return;

    setStore((previous) => {
      const nextRecords = {};

      Object.entries(previous.records || {}).forEach(([date, records]) => {
        const nextDay = { ...records };
        delete nextDay[student.id];
        nextRecords[date] = nextDay;
      });

      return {
        students: previous.students.filter(
          (item) => item.id !== student.id,
        ),
        records: nextRecords,
      };
    });

    setSelectedIds((previous) =>
      previous.filter((id) => id !== student.id),
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
      "Date",
      "Student ID",
      "Student Name",
      "Email",
      "Batch",
      "Department",
      "Attendance Status",
    ];

    const rows = filteredStudents.map((student) => [
      selectedDate,
      student.id,
      student.name,
      student.email,
      student.batch,
      student.department,
      dayRecords[student.id] || "Unmarked",
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
    anchor.download = `techmentor-attendance-${selectedDate}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setToast("Attendance report exported successfully.");
  }

  function resetFilters() {
    setSearch("");
    setBatchFilter("All batches");
    setStatusFilter("All statuses");
    setActiveView("All");
    setSelectedIds([]);
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    batchFilter !== "All batches" ||
    statusFilter !== "All statuses" ||
    activeView !== "All";

  const metrics = [
    {
      icon: UserCheck,
      label: "Present today",
      value: summary.Present,
      note: "Students marked present",
      tone: "border-[#28634F] bg-[#15382F] text-[#8CE0BA]",
    },
    {
      icon: UserX,
      label: "Absent today",
      value: summary.Absent,
      note: "Students marked absent",
      tone: "border-[#784A40] bg-[#3B2628] text-[#FFB4A8]",
    },
    {
      icon: Timer,
      label: "Late arrivals",
      value: summary.Late,
      note: "Students marked late",
      tone: "border-[#6C5632] bg-[#3A2F20] text-[#F2CD8B]",
    },
    {
      icon: ClipboardCheck,
      label: "Not marked",
      value: summary.Unmarked,
      note: `${summary.completion}% attendance completion`,
      tone: "border-[#3A5D83] bg-[#1A3452] text-[#A9D5FF]",
    },
  ];

  const views = [
    { label: "All", count: students.length, icon: Users },
    { label: "Present", count: summary.Present, icon: UserCheck },
    { label: "Absent", count: summary.Absent, icon: UserX },
    { label: "Late", count: summary.Late, icon: Timer },
    { label: "Leave", count: summary.Leave, icon: CalendarCheck },
    { label: "Unmarked", count: summary.Unmarked, icon: CircleHelp },
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
              <ClipboardCheck size={24} strokeWidth={1.8} />
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
                Attendance Management
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#97ADC7]">
                Record daily attendance, review student status and maintain
                accurate attendance reports across batches.
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
              onClick={() => setAddModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BCFFF] bg-[#80BFFF] px-4 py-3 text-sm font-bold text-[#10233D] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#A0D0FF] focus:outline-none focus:ring-4 focus:ring-[#80BFFF]/20"
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
                <CalendarCheck size={27} strokeWidth={1.7} />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9DCDFF]">
                    ATTENDANCE WORKSPACE
                  </span>

                  <span className="rounded-full border border-[#59718E] bg-[#203C59] px-2 py-0.5 text-[10px] font-semibold text-[#C5DFFF]">
                    Daily register
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-[#F1F7FF] sm:text-2xl">
                  Every class, accounted for.
                </h2>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#B0C4DB]">
                  Record attendance, review absences and identify unmarked
                  students before closing the daily register.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-[#476482] bg-[#142B45]/80 px-4 py-3.5 md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
                <CalendarDays size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#EFF6FF]">
                  Selected date
                </p>

                <p className="mt-1 text-xs text-[#9EB6D1]">
                  {formatDate(selectedDate)}
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* DATE SELECTOR + PROGRESS */}
        <section className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-[#293D58] bg-[#111F34] p-5 sm:p-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                <CalendarDays size={18} />
              </div>

              <h2 className="text-base font-bold text-[#EAF3FF]">
                Attendance date
              </h2>
            </div>

            <p className="mt-2 text-sm text-[#91A7C0]">
              Select the day for which you want to mark or review attendance.
            </p>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                type="date"
                value={selectedDate}
                max={getToday()}
                onChange={(event) => changeDate(event.target.value)}
                style={{ colorScheme: "dark" }}
                className={FIELD_CLASS}
              />

              <button
                type="button"
                onClick={() => changeDate(getToday())}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#3B5B7D] bg-[#193754] px-4 py-3 text-sm font-semibold text-[#B9DCFF] transition hover:bg-[#23476D]"
              >
                <RotateCcw size={15} />
                Today
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#293D58] bg-[#111F34] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                    <Target size={18} />
                  </div>

                  <h2 className="text-base font-bold text-[#EAF3FF]">
                    Daily completion
                  </h2>
                </div>

                <p className="mt-2 text-sm text-[#91A7C0]">
                  Attendance records completed for the selected date.
                </p>
              </div>

              <p className="text-2xl font-bold text-[#A9D5FF]">
                {summary.completion}%
              </p>
            </div>

            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-[#263A53]">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${summary.completion}%` }}
                transition={{ duration: 0.65, ease: "easeOut" }}
                className="h-full rounded-full bg-gradient-to-r from-[#3978B9] via-[#65ABE9] to-[#A4D4FF]"
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-3 text-xs text-[#8299B5]">
              <span>{summary.marked} records completed</span>
              <span>{summary.Unmarked} still unmarked</span>
            </div>
          </div>
        </section>

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

        {/* ATTENDANCE DIRECTORY */}
        <section className="overflow-visible rounded-3xl border border-[#293D58] bg-[#111F34] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col justify-between gap-4 rounded-t-3xl border-b border-[#293D58] p-5 sm:p-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                  <Users size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#EAF3FF]">
                  Attendance register
                </h2>

                <span className="rounded-lg border border-[#395A7D] bg-[#1A3554] px-2 py-1 text-xs font-bold text-[#A9D5FF]">
                  {filteredStudents.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#92A8C2]">
                Review individual attendance and update student status.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setAddModalOpen(true)}
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

          {/* SEARCH + CUSTOM FILTER DROPDOWNS */}
          <div className="relative z-20 grid grid-cols-1 gap-3 border-b border-[#293D58] bg-[#0E1A2C] p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_250px_210px_auto]">
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
              value={batchFilter}
              options={[
                "All batches",
                ...BATCH_OPTIONS,
              ]}
              onChange={setBatchFilter}
              icon={Layers}
            />

            <PremiumSelect
              value={statusFilter}
              options={[
                "All statuses",
                ...ATTENDANCE_OPTIONS,
              ]}
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

          {/* BULK ACTIONS */}
          <div className="flex flex-col gap-3 border-b border-[#293D58] bg-[#111F34] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-xl border border-[#344A66] bg-[#14253C] px-3 py-2 text-xs font-semibold text-[#B9CCE2]">
                <CheckCircle2 size={15} className="text-[#80BFFF]" />
                {visibleSelectedCount} selected
              </span>

              <button
                type="button"
                onClick={toggleVisibleStudents}
                disabled={!filteredStudents.length}
                className="rounded-lg px-2.5 py-2 text-xs font-semibold text-[#91C8FF] transition hover:bg-[#192F49] disabled:opacity-40"
              >
                {allVisibleSelected ? "Deselect visible" : "Select visible"}
              </button>
            </div>

            <div className="flex flex-wrap gap-2">
              {[
                {
                  label: "Present",
                  status: "Present",
                  icon: UserCheck,
                  style:
                    "border-emerald-800 bg-emerald-950/40 text-emerald-300 hover:bg-emerald-950",
                },
                {
                  label: "Absent",
                  status: "Absent",
                  icon: UserX,
                  style:
                    "border-[#784A40] bg-[#3B2628] text-[#FFB4A8] hover:bg-[#4A2B2E]",
                },
                {
                  label: "Late",
                  status: "Late",
                  icon: Timer,
                  style:
                    "border-amber-800 bg-amber-950/40 text-amber-300 hover:bg-amber-950",
                },
                {
                  label: "Leave",
                  status: "Leave",
                  icon: CalendarCheck,
                  style:
                    "border-violet-800 bg-violet-950/40 text-violet-300 hover:bg-violet-950",
                },
              ].map((action) => {
                const Icon = action.icon;

                return (
                  <button
                    key={action.status}
                    type="button"
                    disabled={!selectedIds.length}
                    onClick={() => markBulk(action.status)}
                    className={`inline-flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition disabled:cursor-not-allowed disabled:opacity-35 ${action.style}`}
                  >
                    <Icon size={14} />
                    Mark {action.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* TABLE */}
          <div className="relative z-10 w-full overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#293D58] bg-[#152740]">
                  <th className="w-12 px-5 py-4">
                    <input
                      type="checkbox"
                      aria-label="Select all visible students"
                      checked={allVisibleSelected}
                      onChange={toggleVisibleStudents}
                      className="h-4 w-4 cursor-pointer rounded border-[#506783] accent-[#80BFFF]"
                    />
                  </th>

                  {[
                    "Student",
                    "Batch & department",
                    "Attendance status",
                    "Joined",
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
                  const CourseIcon = getCourseIcon(student.batch);
                  const attendance =
                    dayRecords[student.id] || "Unmarked";

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
                      <td className="px-5 py-4">
                        <input
                          type="checkbox"
                          aria-label={`Select ${student.name}`}
                          checked={selectedIds.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                          className="h-4 w-4 cursor-pointer rounded border-[#506783] accent-[#80BFFF]"
                        />
                      </td>

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
                              onClick={() => setSelectedStudentId(student.id)}
                              className="max-w-[220px] truncate text-left text-sm font-semibold text-[#EAF3FF] transition hover:text-[#A9D5FF]"
                            >
                              {student.name}
                            </button>

                            <p className="mt-1 text-xs text-[#80BFFF]">
                              {student.id}
                            </p>

                            <p className="mt-1 flex items-center gap-1.5 text-xs text-[#8299B5]">
                              <Mail size={12} className="shrink-0" />
                              <span className="max-w-[190px] truncate">
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
                            <p className="max-w-[220px] text-sm font-semibold text-[#D0DFF0]">
                              {student.batch}
                            </p>

                            <p className="mt-1 max-w-[220px] truncate text-xs text-[#8299B5]">
                              {student.department}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <div className="w-[175px]">
                          <PremiumSelect
                            value={attendance}
                            options={ATTENDANCE_OPTIONS}
                            onChange={(status) =>
                              markAttendance(student.id, status)
                            }
                            icon={
                              attendance === "Present"
                                ? UserCheck
                                : attendance === "Absent"
                                  ? UserX
                                  : attendance === "Late"
                                    ? Timer
                                    : attendance === "Leave"
                                      ? CalendarCheck
                                      : CircleHelp
                            }
                          />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-[#9FB1C8]">
                          <CalendarDays
                            size={15}
                            className="text-[#80BFFF]"
                          />
                          {formatDate(student.joined)}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <IconButton
                            label="View student attendance details"
                            onClick={() =>
                              setSelectedStudentId(student.id)
                            }
                          >
                            <Eye size={16} />
                          </IconButton>

                          <IconButton
                            label="Remove student from directory"
                            onClick={() => deleteStudent(student)}
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
                  Try another search or change your filters to find the
                  required student.
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
                    onClick={() => setAddModalOpen(true)}
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
              Attendance date: {formatDate(selectedDate)}
            </p>
          </div>
        </section>

        {/* ATTENDANCE GUIDELINES */}
        <section className="rounded-3xl border border-[#293D58] bg-[#111F34] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
              <Sparkles size={20} />
            </div>

            <div>
              <h2 className="text-base font-bold text-[#EAF3FF]">
                Attendance guidelines
              </h2>

              <p className="mt-1.5 text-sm leading-6 text-[#91A7C0]">
                Use a consistent attendance status for every student. The
                daily completion percentage indicates how many students have
                a recorded status for the selected date.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                status: "Present",
                text: "Student attended the class.",
              },
              {
                status: "Absent",
                text: "Student did not attend the class.",
              },
              {
                status: "Late",
                text: "Student arrived after the scheduled time.",
              },
              {
                status: "Leave",
                text: "Student is recorded as on leave.",
              },
            ].map((item) => (
              <div
                key={item.status}
                className="rounded-xl border border-[#293D58] bg-[#0E1A2C] p-4"
              >
                <AttendanceBadge status={item.status} />

                <p className="mt-3 text-xs leading-5 text-[#91A7C0]">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ADD STUDENT MODAL */}
      <AddStudentModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={addStudent}
        students={students}
      />

      {/* STUDENT DETAILS MODAL */}
      <StudentDetailsModal
        student={selectedStudent}
        selectedDate={selectedDate}
        records={store.records || {}}
        onClose={() => setSelectedStudentId(null)}
        onMark={markAttendance}
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
