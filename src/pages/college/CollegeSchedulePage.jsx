import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowDownToLine,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  GraduationCap,
  MapPin,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Trash2,
  Users,
  Video,
  X,
  XCircle,
  CalendarClock,
} from "lucide-react";

/* =========================================================
   CONFIGURATION
========================================================= */

const STORAGE_KEY = "techmentor-college-schedule-v1";

const TRAINERS = [
  "Aman Sharma",
  "Priya Verma",
  "Rahul Mehta",
  "Neha Singh",
  "Arjun Kumar",
  "Meera Joshi",
  "Vikram Singh",
  "Kavya Agarwal",
];

const COURSES = [
  "Java Development",
  "Data Structures & Algorithms",
  "Full Stack Development",
  "React Development",
  "Python for Data Science",
  "Machine Learning",
  "Cloud Computing",
  "DevOps Engineering",
  "Database Management",
  "Frontend Development",
];

const STATUSES = ["Scheduled", "Completed", "Cancelled"];

const STATUS_STYLES = {
  Scheduled:
    "border-sky-400/20 bg-sky-400/[0.08] text-sky-300",
  Completed:
    "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
  Cancelled:
    "border-rose-400/20 bg-rose-400/[0.08] text-rose-300",
};

/* =========================================================
   DATE HELPERS
========================================================= */

function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function parseISODate(value) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function addDays(date, amount) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function getWeekStart(value) {
  const date =
    typeof value === "string" ? parseISODate(value) : new Date(value);

  const day = date.getDay();
  const difference = day === 0 ? -6 : 1 - day;

  date.setDate(date.getDate() + difference);
  date.setHours(0, 0, 0, 0);

  return date;
}

function formatDate(value, options = {}) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    ...options,
  }).format(parseISODate(value));
}

function formatTime(value) {
  if (!value) return "";

  const [hours, minutes] = value.split(":").map(Number);
  const date = new Date();

  date.setHours(hours, minutes, 0, 0);

  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
}

function getDuration(start, end) {
  if (!start || !end) return 0;

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  return eh * 60 + em - (sh * 60 + sm);
}

function formatDuration(start, end) {
  const minutes = getDuration(start, end);

  if (minutes <= 0) return "0 min";

  const hours = Math.floor(minutes / 60);
  const remaining = minutes % 60;

  if (!hours) return `${remaining} min`;
  if (!remaining) return `${hours} hr`;

  return `${hours} hr ${remaining} min`;
}

function getWeekDays(selectedDate) {
  const monday = getWeekStart(selectedDate);

  return Array.from({ length: 7 }, (_, index) =>
    toISODate(addDays(monday, index))
  );
}

function isSameDate(a, b) {
  return a === b;
}

/* =========================================================
   DEMO SESSIONS
   First launch pe sample sessions create hote hain.
========================================================= */

function createInitialSessions() {
  const today = new Date();

  const getDate = (offset) => toISODate(addDays(today, offset));

  return [
    {
      id: "CLS-001",
      title: "Java Fundamentals",
      course: "Java Development",
      trainer: "Aman Sharma",
      date: getDate(0),
      startTime: "09:00",
      endTime: "10:00",
      mode: "Online",
      location: "Google Meet",
      capacity: 45,
      enrolled: 38,
      status: "Scheduled",
      notes: "Java basics and hands-on coding exercises.",
    },
    {
      id: "CLS-002",
      title: "React Components Workshop",
      course: "React Development",
      trainer: "Rahul Mehta",
      date: getDate(0),
      startTime: "11:00",
      endTime: "12:30",
      mode: "In-person",
      location: "Lab 204",
      capacity: 40,
      enrolled: 32,
      status: "Scheduled",
      notes: "Component architecture and practical implementation.",
    },
    {
      id: "CLS-003",
      title: "Python for Beginners",
      course: "Python for Data Science",
      trainer: "Priya Verma",
      date: getDate(1),
      startTime: "10:00",
      endTime: "11:30",
      mode: "Online",
      location: "Google Meet",
      capacity: 50,
      enrolled: 42,
      status: "Scheduled",
      notes: "Python syntax, data types and practice problems.",
    },
    {
      id: "CLS-004",
      title: "DSA Problem Solving",
      course: "Data Structures & Algorithms",
      trainer: "Aman Sharma",
      date: getDate(2),
      startTime: "12:00",
      endTime: "13:00",
      mode: "In-person",
      location: "Room 301",
      capacity: 45,
      enrolled: 41,
      status: "Scheduled",
      notes: "Arrays, strings and algorithmic thinking.",
    },
    {
      id: "CLS-005",
      title: "Machine Learning Introduction",
      course: "Machine Learning",
      trainer: "Priya Verma",
      date: getDate(3),
      startTime: "14:00",
      endTime: "15:30",
      mode: "Online",
      location: "Google Meet",
      capacity: 35,
      enrolled: 29,
      status: "Scheduled",
      notes: "Introduction to supervised learning.",
    },
    {
      id: "CLS-006",
      title: "Full Stack Project Session",
      course: "Full Stack Development",
      trainer: "Rahul Mehta",
      date: getDate(4),
      startTime: "10:30",
      endTime: "12:00",
      mode: "In-person",
      location: "Lab 105",
      capacity: 40,
      enrolled: 36,
      status: "Scheduled",
      notes: "Project structure and application integration.",
    },
    {
      id: "CLS-007",
      title: "Database Design",
      course: "Database Management",
      trainer: "Neha Singh",
      date: getDate(5),
      startTime: "09:30",
      endTime: "10:30",
      mode: "Online",
      location: "Google Meet",
      capacity: 40,
      enrolled: 27,
      status: "Scheduled",
      notes: "Database relationships and normalization.",
    },
    {
      id: "CLS-008",
      title: "DevOps Essentials",
      course: "DevOps Engineering",
      trainer: "Arjun Kumar",
      date: getDate(-1),
      startTime: "11:00",
      endTime: "12:00",
      mode: "Online",
      location: "Google Meet",
      capacity: 35,
      enrolled: 30,
      status: "Completed",
      notes: "Introduction to DevOps and deployment pipelines.",
    },
  ];
}

function loadSessions() {
  try {
    if (typeof window === "undefined") {
      return createInitialSessions();
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error("Could not load saved schedule:", error);
  }

  return createInitialSessions();
}

/* =========================================================
   SHARED UI HELPERS
========================================================= */

function StatusBadge({ status }) {
  const Icon =
    status === "Completed"
      ? CheckCircle2
      : status === "Cancelled"
        ? XCircle
        : CalendarClock;

  return (
    <span
      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.Scheduled
        }`}
    >
      <Icon size={11} />
      {status}
    </span>
  );
}

function FieldLabel({ children, required = false }) {
  return (
    <span className="mb-2 block text-[11px] font-semibold text-slate-300">
      {children}
      {required && <span className="ml-1 text-rose-300">*</span>}
    </span>
  );
}

function TextInput({ label, required = false, ...props }) {
  return (
    <label className="block min-w-0">
      <FieldLabel required={required}>{label}</FieldLabel>
      <input
        required={required}
        {...props}
        className={`min-h-[43px] w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-2.5 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08] ${props.className || ""}`}
      />
    </label>
  );
}

function SelectInput({ label, options, required = false, ...props }) {
  return (
    <label className="block min-w-0">
      <FieldLabel required={required}>{label}</FieldLabel>

      <select
        required={required}
        {...props}
        className={`min-h-[43px] w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-2.5 text-xs text-slate-100 outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08] ${props.className || ""}`}
      >
        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { label: option, value: option }
              : option;

          return (
            <option
              key={item.value}
              value={item.value}
              className="bg-[#0f1b2c] text-white"
            >
              {item.label}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function StatCard({ label, value, description, icon: Icon, color }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5"
    >
      <div className="flex min-w-0 items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="truncate text-[11px] font-medium text-slate-400">
            {label}
          </p>
          <p className="mt-3 text-2xl font-extrabold tracking-tight text-white">
            {value}
          </p>
          <p className="mt-1 text-[10px] leading-5 text-slate-500">
            {description}
          </p>
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] ${color}`}
        >
          <Icon size={19} />
        </span>
      </div>
    </motion.article>
  );
}

/* =========================================================
   CLASS CREATE / EDIT MODAL
========================================================= */

function SessionFormModal({
  initialSession,
  selectedDate,
  onClose,
  onSave,
}) {
  const isEditing = Boolean(initialSession);

  const [form, setForm] = useState(() => ({
    title: initialSession?.title || "",
    course: initialSession?.course || COURSES[0],
    trainer: initialSession?.trainer || TRAINERS[0],
    date: initialSession?.date || selectedDate,
    startTime: initialSession?.startTime || "10:00",
    endTime: initialSession?.endTime || "11:00",
    mode: initialSession?.mode || "Online",
    location: initialSession?.location || "Google Meet",
    capacity: String(initialSession?.capacity ?? 40),
    enrolled: String(initialSession?.enrolled ?? 0),
    status: initialSession?.status || "Scheduled",
    notes: initialSession?.notes || "",
  }));

  const [formError, setFormError] = useState("");

  function changeField(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError("");
  }

  function submitForm(event) {
    event.preventDefault();
    setFormError("");

    if (form.endTime <= form.startTime) {
      setFormError("End time must be later than start time.");
      return;
    }

    if (Number(form.capacity) < 1) {
      setFormError("Capacity must be at least 1.");
      return;
    }

    if (
      Number(form.enrolled) < 0 ||
      Number(form.enrolled) > Number(form.capacity)
    ) {
      setFormError("Enrolled students must be between 0 and capacity.");
      return;
    }

    const result = onSave({
      ...(initialSession || {}),
      ...form,
      capacity: Number(form.capacity),
      enrolled: Number(form.enrolled),
      id: initialSession?.id || `CLS-${Date.now()}`,
    });

    if (result === true) {
      onClose();
    } else {
      setFormError(
        typeof result === "string"
          ? result
          : "Unable to save the class. Please try again."
      );
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="schedule-form-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-[#020712]/85 p-3 backdrop-blur-md sm:p-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.section
          initial={{ opacity: 0, y: 18, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.985 }}
          transition={{ duration: 0.2 }}
          role="dialog"
          aria-modal="true"
          aria-label={isEditing ? "Edit class session" : "Create class session"}
          className="my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-sky-400/15 bg-[#0d1829] shadow-2xl shadow-black/50"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/[0.07] bg-[#0d1829]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">
                Class management
              </p>

              <h2 className="mt-1.5 text-lg font-bold text-white">
                {isEditing ? "Edit class session" : "Schedule a class"}
              </h2>

              <p className="mt-1 text-[11px] text-slate-400">
                Add class details, trainer, timing and location.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close form"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-sky-400/30 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <form onSubmit={submitForm} className="space-y-5 p-5 sm:p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <TextInput
                  label="Class title"
                  name="title"
                  value={form.title}
                  onChange={changeField}
                  placeholder="e.g. React Components Workshop"
                  required
                  maxLength={100}
                />
              </div>

              <SelectInput
                label="Course"
                name="course"
                value={form.course}
                onChange={changeField}
                options={COURSES}
                required
              />

              <SelectInput
                label="Trainer"
                name="trainer"
                value={form.trainer}
                onChange={changeField}
                options={TRAINERS}
                required
              />

              <TextInput
                label="Class date"
                type="date"
                name="date"
                value={form.date}
                onChange={changeField}
                required
              />

              <SelectInput
                label="Class status"
                name="status"
                value={form.status}
                onChange={changeField}
                options={STATUSES}
                required
              />

              <TextInput
                label="Start time"
                type="time"
                name="startTime"
                value={form.startTime}
                onChange={changeField}
                required
              />

              <TextInput
                label="End time"
                type="time"
                name="endTime"
                value={form.endTime}
                onChange={changeField}
                required
              />

              <SelectInput
                label="Session mode"
                name="mode"
                value={form.mode}
                onChange={changeField}
                options={["Online", "In-person"]}
                required
              />

              <TextInput
                label={form.mode === "Online" ? "Meeting link / platform" : "Room / venue"}
                name="location"
                value={form.location}
                onChange={changeField}
                placeholder={
                  form.mode === "Online"
                    ? "Google Meet or meeting link"
                    : "e.g. Lab 204"
                }
                required
              />

              <TextInput
                label="Student capacity"
                type="number"
                name="capacity"
                min="1"
                max="10000"
                value={form.capacity}
                onChange={changeField}
                required
              />

              <TextInput
                label="Enrolled students"
                type="number"
                name="enrolled"
                min="0"
                max={form.capacity}
                value={form.enrolled}
                onChange={changeField}
                required
              />

              <label className="block sm:col-span-2">
                <FieldLabel>Notes / class agenda</FieldLabel>

                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={changeField}
                  rows={3}
                  maxLength={1000}
                  placeholder="Topics, preparation instructions or other information..."
                  className="w-full resize-y rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-3 text-xs leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
                />
              </label>
            </div>

            {formError && (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-3.5 text-xs leading-5 text-rose-200"
              >
                <AlertCircle size={15} className="mt-0.5 shrink-0" />
                {formError}
              </div>
            )}

            <div className="flex flex-col-reverse justify-end gap-2 border-t border-white/[0.07] pt-4 sm:flex-row">
              <button
                type="button"
                onClick={onClose}
                className="min-h-[42px] rounded-xl border border-white/[0.09] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-5 text-xs font-bold text-[#07111f] transition hover:brightness-110 active:scale-[0.99]"
              >
                <Check size={15} />
                {isEditing ? "Save changes" : "Create class"}
              </button>
            </div>
          </form>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

/* =========================================================
   SESSION CARD
========================================================= */

function SessionCard({
  session,
  onEdit,
  onDelete,
  onStatusChange,
}) {
  const cancelled = session.status === "Cancelled";
  const completed = session.status === "Completed";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      className={`min-w-0 rounded-xl border p-4 transition-colors ${cancelled
        ? "border-white/[0.05] bg-white/[0.015]"
        : "border-white/[0.075] bg-[#0c1728]/80 hover:border-sky-400/20"
        }`}
    >
      <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex min-w-0 gap-3">
          <div className="flex h-11 w-11 shrink-0 flex-col items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.06] text-sky-200">
            {session.mode === "Online" ? (
              <Video size={17} />
            ) : (
              <MapPin size={17} />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <h3
                className={`break-words text-sm font-bold ${cancelled ? "text-slate-500 line-through" : "text-white"
                  }`}
              >
                {session.title}
              </h3>

              <StatusBadge status={session.status} />
            </div>

            <p className="mt-1.5 text-[11px] text-slate-400">
              {session.course}
            </p>

            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-[10px] text-slate-400">
              <span className="inline-flex items-center gap-1.5">
                <Clock3 size={12} className="text-sky-300" />
                {formatTime(session.startTime)} – {formatTime(session.endTime)}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <GraduationCap size={12} className="text-sky-300" />
                {session.trainer}
              </span>

              <span className="inline-flex items-center gap-1.5">
                <Users size={12} className="text-sky-300" />
                {session.enrolled}/{session.capacity} students
              </span>

              <span className="inline-flex items-center gap-1.5">
                {session.mode === "Online" ? (
                  <Video size={12} className="text-sky-300" />
                ) : (
                  <MapPin size={12} className="text-sky-300" />
                )}
                <span className="max-w-[220px] break-words">
                  {session.location || session.mode}
                </span>
              </span>
            </div>

            {session.notes && (
              <p className="mt-3 break-words text-[11px] leading-5 text-slate-500">
                {session.notes}
              </p>
            )}
          </div>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5 sm:justify-end">
          {!completed && !cancelled && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(session.id, "Completed")}
                title="Mark completed"
                aria-label={`Mark ${session.title} completed`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/15 text-emerald-300 transition hover:bg-emerald-400/10"
              >
                <CheckCircle2 size={15} />
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(session.id, "Cancelled")}
                title="Cancel session"
                aria-label={`Cancel ${session.title}`}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-400/15 text-rose-300 transition hover:bg-rose-400/10"
              >
                <XCircle size={15} />
              </button>
            </>
          )}

          {cancelled && (
            <button
              type="button"
              onClick={() => onStatusChange(session.id, "Scheduled")}
              className="h-9 rounded-lg border border-sky-400/15 px-3 text-[10px] font-semibold text-sky-300 transition hover:bg-sky-400/[0.07]"
            >
              Restore
            </button>
          )}

          <button
            type="button"
            onClick={() => onEdit(session)}
            title="Edit session"
            aria-label={`Edit ${session.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-300 transition hover:border-sky-400/25 hover:bg-sky-400/[0.05] hover:text-sky-200"
          >
            <Pencil size={14} />
          </button>

          <button
            type="button"
            onClick={() => onDelete(session)}
            title="Delete session"
            aria-label={`Delete ${session.title}`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.08] text-slate-400 transition hover:border-rose-400/20 hover:bg-rose-400/[0.06] hover:text-rose-300"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function CollegeSchedulePage() {
  const [sessions, setSessions] = useState(loadSessions);
  const [selectedDate, setSelectedDate] = useState(() => toISODate(new Date()));

  const [search, setSearch] = useState("");
  const [courseFilter, setCourseFilter] = useState("All courses");
  const [trainerFilter, setTrainerFilter] = useState("All trainers");
  const [statusFilter, setStatusFilter] = useState("All statuses");

  const [viewMode, setViewMode] = useState("Week");
  const [showForm, setShowForm] = useState(false);
  const [editingSession, setEditingSession] = useState(null);
  const [toast, setToast] = useState(null);

  const weekDays = useMemo(
    () => getWeekDays(selectedDate),
    [selectedDate]
  );

  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
    } catch (error) {
      console.error("Could not save schedule:", error);
    }
  }, [sessions]);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => setToast(null), 3500);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  const filteredSessions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return [...sessions]
      .filter((session) => {
        const searchable = [
          session.title,
          session.course,
          session.trainer,
          session.location,
          session.mode,
          session.id,
          session.notes,
        ]
          .join(" ")
          .toLowerCase();

        const matchesSearch = !query || searchable.includes(query);

        const matchesCourse =
          courseFilter === "All courses" ||
          session.course === courseFilter;

        const matchesTrainer =
          trainerFilter === "All trainers" ||
          session.trainer === trainerFilter;

        const matchesStatus =
          statusFilter === "All statuses" ||
          session.status === statusFilter;

        return (
          matchesSearch &&
          matchesCourse &&
          matchesTrainer &&
          matchesStatus
        );
      })
      .sort((a, b) => {
        const dateDifference = a.date.localeCompare(b.date);

        return dateDifference || a.startTime.localeCompare(b.startTime);
      });
  }, [sessions, search, courseFilter, trainerFilter, statusFilter]);

  const weeklySessions = useMemo(
    () =>
      filteredSessions.filter(
        (session) => session.date >= weekStart && session.date <= weekEnd
      ),
    [filteredSessions, weekStart, weekEnd]
  );

  const selectedDaySessions = useMemo(
    () =>
      weeklySessions.filter((session) => session.date === selectedDate),
    [weeklySessions, selectedDate]
  );

  const sessionsToDisplay =
    viewMode === "Week" ? selectedDaySessions : weeklySessions;

  const today = toISODate(new Date());

  const upcomingCount = sessions.filter(
    (session) => session.date >= today && session.status === "Scheduled"
  ).length;

  const completedCount = sessions.filter(
    (session) => session.status === "Completed"
  ).length;

  const weekCount = sessions.filter(
    (session) =>
      session.date >= weekStart &&
      session.date <= weekEnd &&
      session.status !== "Cancelled"
  ).length;

  const totalStudents = sessions
    .filter((session) => session.status !== "Cancelled")
    .reduce((sum, session) => sum + (Number(session.enrolled) || 0), 0);

  /* -------------------------------------------------------
     OPEN / CLOSE FORM
  ------------------------------------------------------- */

  function openCreateForm() {
    setEditingSession(null);
    setShowForm(true);
  }

  function openEditForm(session) {
    setEditingSession(session);
    setShowForm(true);
  }

  function closeForm() {
    setShowForm(false);
    setEditingSession(null);
  }

  /* -------------------------------------------------------
     SAVE SESSION + VALIDATION
  ------------------------------------------------------- */

  function saveSession(payload) {
    if (!payload.title.trim()) {
      return "Please enter a class title.";
    }

    if (!payload.date || !payload.startTime || !payload.endTime) {
      return "Please complete the date and time fields.";
    }

    if (payload.endTime <= payload.startTime) {
      return "End time must be later than start time.";
    }

    const conflict = sessions.find((session) => {
      if (session.id === payload.id) return false;
      if (session.date !== payload.date) return false;
      if (session.trainer !== payload.trainer) return false;
      if (session.status === "Cancelled") return false;
      if (payload.status === "Cancelled") return false;

      const overlaps =
        payload.startTime < session.endTime &&
        payload.endTime > session.startTime;

      return overlaps;
    });

    if (conflict) {
      return `${payload.trainer} already has "${conflict.title}" scheduled from ${formatTime(
        conflict.startTime
      )} to ${formatTime(conflict.endTime)} on this date.`;
    }

    const exists = sessions.some((session) => session.id === payload.id);

    if (exists) {
      setSessions((current) =>
        current.map((session) =>
          session.id === payload.id ? { ...payload } : session
        )
      );

      setToast({
        type: "success",
        text: "Class session updated successfully.",
      });
    } else {
      setSessions((current) => [...current, { ...payload }]);

      setToast({
        type: "success",
        text: "New class added to the schedule.",
      });
    }

    setSelectedDate(payload.date);
    setSearch("");
    setCourseFilter("All courses");
    setTrainerFilter("All trainers");
    setStatusFilter("All statuses");

    return true;
  }

  /* -------------------------------------------------------
     DELETE SESSION
  ------------------------------------------------------- */

  function deleteSession(session) {
    const confirmed = window.confirm(
      `Delete "${session.title}" scheduled for ${formatDate(session.date, {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}? This action cannot be undone.`
    );

    if (!confirmed) return;

    setSessions((current) =>
      current.filter((item) => item.id !== session.id)
    );

    setToast({
      type: "success",
      text: "Class session deleted.",
    });
  }

  /* -------------------------------------------------------
     CHANGE STATUS
  ------------------------------------------------------- */

  function updateStatus(id, status) {
    setSessions((current) =>
      current.map((session) =>
        session.id === id ? { ...session, status } : session
      )
    );

    const statusMessage = {
      Scheduled: "Session restored to scheduled.",
      Completed: "Session marked as completed.",
      Cancelled: "Session cancelled.",
    };

    setToast({
      type: "success",
      text: statusMessage[status] || "Session status updated.",
    });
  }

  /* -------------------------------------------------------
     WEEK NAVIGATION
  ------------------------------------------------------- */

  function changeWeek(amount) {
    const date = parseISODate(selectedDate);
    setSelectedDate(toISODate(addDays(date, amount * 7)));
  }

  function goToToday() {
    setSelectedDate(toISODate(new Date()));
  }

  /* -------------------------------------------------------
     EXPORT CSV
  ------------------------------------------------------- */

  function exportCSV() {
    if (!filteredSessions.length) {
      setToast({
        type: "error",
        text: "There are no sessions to export.",
      });

      return;
    }

    const headers = [
      "Session ID",
      "Title",
      "Course",
      "Trainer",
      "Date",
      "Start Time",
      "End Time",
      "Duration",
      "Mode",
      "Location",
      "Capacity",
      "Enrolled",
      "Status",
      "Notes",
    ];

    const rows = filteredSessions.map((session) => [
      session.id,
      session.title,
      session.course,
      session.trainer,
      session.date,
      session.startTime,
      session.endTime,
      formatDuration(session.startTime, session.endTime),
      session.mode,
      session.location,
      session.capacity,
      session.enrolled,
      session.status,
      session.notes,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "college-class-schedule.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setToast({
      type: "success",
      text: "Schedule exported as CSV.",
    });
  }

  /* -------------------------------------------------------
     RESET FILTERS
  ------------------------------------------------------- */

  function resetFilters() {
    setSearch("");
    setCourseFilter("All courses");
    setTrainerFilter("All trainers");
    setStatusFilter("All statuses");
  }

  return (
    <main className="college-schedule-page min-h-full w-full min-w-0 overflow-x-clip bg-[#0b1424] text-slate-100">
      <style>{`
        .college-schedule-page {
          color-scheme: dark;
          background:
            radial-gradient(ellipse at 8% 0%, rgba(56,189,248,.055), transparent 33%),
            radial-gradient(ellipse at 95% 10%, rgba(99,102,241,.04), transparent 30%),
            #0b1424;
        }

        .college-schedule-page,
        .college-schedule-page * {
          box-sizing: border-box;
        }

        .college-schedule-page input::-webkit-calendar-picker-indicator {
          cursor: pointer;
          opacity: .7;
        }

        .college-schedule-page .schedule-scroll {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }

        .college-schedule-page .schedule-scroll::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .college-schedule-page .schedule-scroll::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: #334155;
        }

        @media (prefers-reduced-motion: reduce) {
          .college-schedule-page *,
          .college-schedule-page *::before,
          .college-schedule-page *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-3 py-5 sm:px-5 sm:py-6 xl:px-7">
        {/* HEADER */}

        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div className="min-w-0">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-200">
              <CalendarDays size={12} />
              Academic management
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              Class Schedule
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">
              Schedule classes, manage trainers and keep track of your
              college's upcoming sessions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-3.5 text-xs font-semibold text-slate-200 transition hover:border-sky-400/25 hover:text-white"
            >
              <ArrowDownToLine size={15} />
              Export CSV
            </button>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-4 text-xs font-bold text-[#07111f] shadow-lg shadow-sky-950/20 transition hover:brightness-110 active:scale-[0.99]"
            >
              <Plus size={16} />
              Schedule Class
            </button>
          </div>
        </motion.section>

        {/* STATS */}

        <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
          <StatCard
            label="Upcoming classes"
            value={upcomingCount}
            description="Scheduled sessions from today onward"
            icon={CalendarClock}
            color="text-sky-300"
          />

          <StatCard
            label="This week"
            value={weekCount}
            description="Non-cancelled sessions in this week"
            icon={CalendarDays}
            color="text-blue-300"
          />

          <StatCard
            label="Completed classes"
            value={completedCount}
            description="Sessions marked completed"
            icon={CheckCircle2}
            color="text-emerald-300"
          />

          <StatCard
            label="Enrolled students"
            value={totalStudents.toLocaleString("en-IN")}
            description="Across non-cancelled sessions"
            icon={Users}
            color="text-violet-300"
          />
        </section>

        {/* CALENDAR CONTROLS */}

        <section className="rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
          <div className="flex min-w-0 flex-col justify-between gap-4 lg:flex-row lg:items-center">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-500">
                Schedule calendar
              </p>

              <h2 className="mt-1.5 text-lg font-bold text-white">
                {formatDate(weekStart, {
                  day: "numeric",
                  month: "short",
                })}{" "}
                –{" "}
                {formatDate(weekEnd, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </h2>

              <p className="mt-1 text-[10px] text-slate-500">
                Select a date to view its class sessions.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={goToToday}
                className="min-h-9 rounded-lg border border-white/[0.09] px-3 text-[11px] font-semibold text-slate-300 transition hover:border-sky-400/25 hover:text-white"
              >
                Today
              </button>

              <div className="flex items-center gap-1 rounded-xl border border-white/[0.08] bg-[#0b1424] p-1">
                <button
                  type="button"
                  onClick={() => changeWeek(-1)}
                  aria-label="Previous week"
                  title="Previous week"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <ChevronLeft size={17} />
                </button>

                <button
                  type="button"
                  onClick={() => changeWeek(1)}
                  aria-label="Next week"
                  title="Next week"
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <ChevronRight size={17} />
                </button>
              </div>

              <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#0b1424] p-1">
                {["Week", "Agenda"].map((mode) => (
                  <button
                    key={mode}
                    type="button"
                    onClick={() => setViewMode(mode)}
                    aria-pressed={viewMode === mode}
                    className={`min-h-8 rounded-lg px-3 text-[10px] font-semibold transition ${viewMode === mode
                      ? "bg-sky-400/10 text-sky-200"
                      : "text-slate-500 hover:text-white"
                      }`}
                  >
                    {mode}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* WEEK VIEW */}

          <AnimatePresence mode="wait">
            {viewMode === "Week" && (
              <motion.div
                key={weekStart}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="schedule-scroll mt-5 grid min-w-0 grid-cols-1 gap-2 overflow-x-auto sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-7"
              >
                {weekDays.map((day) => {
                  const date = parseISODate(day);
                  const daySessions = weeklySessions
                    .filter((session) => session.date === day)
                    .sort((a, b) => a.startTime.localeCompare(b.startTime));

                  const selected = isSameDate(day, selectedDate);
                  const isToday = day === today;

                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setSelectedDate(day)}
                      aria-pressed={selected}
                      className={`flex min-h-[155px] min-w-0 flex-col rounded-xl border p-3 text-left transition ${selected
                        ? "border-sky-400/35 bg-sky-400/[0.07] ring-1 ring-sky-400/[0.07]"
                        : "border-white/[0.07] bg-[#0b1424]/60 hover:border-white/[0.14] hover:bg-white/[0.025]"
                        }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p
                            className={`text-[10px] font-semibold ${selected ? "text-sky-200" : "text-slate-500"
                              }`}
                          >
                            {new Intl.DateTimeFormat("en-IN", {
                              weekday: "short",
                            }).format(date)}
                          </p>

                          <p
                            className={`mt-1 text-xl font-extrabold ${selected ? "text-sky-200" : "text-white"
                              }`}
                          >
                            {date.getDate()}
                          </p>
                        </div>

                        {isToday && (
                          <span className="rounded-md border border-emerald-400/15 bg-emerald-400/[0.07] px-1.5 py-1 text-[9px] font-bold text-emerald-300">
                            TODAY
                          </span>
                        )}
                      </div>

                      <div className="mt-3 flex flex-col gap-1.5">
                        {daySessions.length === 0 ? (
                          <p className="py-2 text-[10px] text-slate-600">
                            No classes
                          </p>
                        ) : (
                          daySessions.slice(0, 3).map((session) => (
                            <div
                              key={session.id}
                              className={`min-w-0 truncate rounded-md border px-2 py-1.5 text-[9px] font-semibold ${session.status === "Cancelled"
                                ? "border-rose-400/10 bg-rose-400/[0.04] text-slate-500 line-through"
                                : session.status === "Completed"
                                  ? "border-emerald-400/10 bg-emerald-400/[0.05] text-emerald-300"
                                  : "border-sky-400/10 bg-sky-400/[0.05] text-sky-200"
                                }`}
                            >
                              {formatTime(session.startTime)} · {session.title}
                            </div>
                          ))
                        )}

                        {daySessions.length > 3 && (
                          <span className="px-1 text-[9px] font-semibold text-slate-500">
                            +{daySessions.length - 3} more sessions
                          </span>
                        )}
                      </div>

                      <span className="mt-auto flex items-center gap-1 pt-3 text-[9px] text-slate-500">
                        <CalendarDays size={11} />
                        {daySessions.length}{" "}
                        {daySessions.length === 1 ? "class" : "classes"}
                      </span>
                    </button>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* AGENDA MODE INFO */}

          {viewMode === "Agenda" && (
            <div className="mt-5 rounded-xl border border-sky-400/10 bg-sky-400/[0.035] p-4">
              <p className="text-xs font-semibold text-sky-200">
                Weekly agenda
              </p>
              <p className="mt-1 text-[11px] leading-5 text-slate-400">
                All matching sessions for the displayed week are listed below.
                Use the date and week controls to navigate.
              </p>
            </div>
          )}
        </section>

        {/* FILTERS */}

        <section className="rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-center gap-2.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.06] text-sky-200">
                <SlidersHorizontal size={16} />
              </span>

              <div>
                <h2 className="text-xs font-bold text-white">
                  Search and filters
                </h2>
                <p className="mt-1 text-[10px] text-slate-500">
                  Find sessions by topic, course, trainer or status.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="self-start rounded-lg px-2 py-1.5 text-[10px] font-semibold text-sky-300 transition hover:bg-sky-400/[0.06] sm:self-auto"
            >
              Reset filters
            </button>
          </div>

          <div className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <label className="block min-w-0 xl:col-span-1">
              <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                Search
              </span>

              <div className="relative">
                <Search
                  size={15}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  type="search"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search classes..."
                  aria-label="Search class sessions"
                  className="min-h-[43px] w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#091322] py-2.5 pl-9 pr-3 text-xs text-white outline-none transition placeholder:text-slate-600 focus:border-sky-400/40"
                />
              </div>
            </label>

            <SelectInput
              label="Course"
              value={courseFilter}
              onChange={(event) => setCourseFilter(event.target.value)}
              options={["All courses", ...COURSES]}
            />

            <SelectInput
              label="Trainer"
              value={trainerFilter}
              onChange={(event) => setTrainerFilter(event.target.value)}
              options={["All trainers", ...TRAINERS]}
            />

            <SelectInput
              label="Status"
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              options={["All statuses", ...STATUSES]}
            />
          </div>
        </section>

        {/* SESSION LIST */}

        <section className="min-w-0">
          <div className="mb-4 flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-base font-bold text-white sm:text-lg">
                  {viewMode === "Week"
                    ? formatDate(selectedDate, {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                    })
                    : "Weekly agenda"}
                </h2>

                <span className="rounded-lg border border-sky-400/15 bg-sky-400/[0.06] px-2 py-1 text-[10px] font-bold text-sky-200">
                  {sessionsToDisplay.length} sessions
                </span>
              </div>

              <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                {viewMode === "Week"
                  ? "Manage sessions scheduled for the selected date."
                  : "Review and manage every session in this week."}
              </p>
            </div>

            <button
              type="button"
              onClick={openCreateForm}
              className="inline-flex min-h-[39px] shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-sky-400/15 bg-sky-400/[0.06] px-3.5 text-[11px] font-semibold text-sky-200 transition hover:bg-sky-400/[0.1] sm:self-auto"
            >
              <Plus size={14} />
              Add session
            </button>
          </div>

          {sessionsToDisplay.length > 0 ? (
            <div className="space-y-3">
              <AnimatePresence mode="popLayout">
                {sessionsToDisplay.map((session) => (
                  <SessionCard
                    key={session.id}
                    session={session}
                    onEdit={openEditForm}
                    onDelete={deleteSession}
                    onStatusChange={updateStatus}
                  />
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-2xl border border-dashed border-white/[0.12] bg-[#111c2d]/50 px-5 py-14 text-center"
            >
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-slate-500">
                <CalendarDays size={23} />
              </span>

              <h3 className="mt-4 text-sm font-bold text-white">
                No sessions found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                There are no matching sessions for this view. Try changing the
                filters or create a new class.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                <button
                  type="button"
                  onClick={resetFilters}
                  className="rounded-xl border border-white/[0.09] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:text-white"
                >
                  Reset filters
                </button>

                <button
                  type="button"
                  onClick={openCreateForm}
                  className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-bold text-[#07111f] transition hover:bg-sky-300"
                >
                  <Plus size={14} />
                  Schedule a class
                </button>
              </div>
            </motion.div>
          )}
        </section>

        {/* FOOTER */}

        <footer className="flex min-w-0 flex-col justify-between gap-2 border-t border-white/[0.07] pt-5 text-[10px] text-slate-500 sm:flex-row sm:items-center">
          <span>College class scheduling</span>

          <span className="inline-flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Changes saved in this browser
          </span>
        </footer>
      </div>

      {/* CREATE / EDIT MODAL */}

      {showForm && (
        <SessionFormModal
          key={editingSession?.id || `new-${selectedDate}`}
          initialSession={editingSession}
          selectedDate={selectedDate}
          onClose={closeForm}
          onSave={saveSession}
        />
      )}

      {/* TOAST */}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -10, x: 8 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role={toast.type === "error" ? "alert" : "status"}
            className={`fixed right-4 top-20 z-[12000] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border px-4 py-3 shadow-2xl sm:right-6 ${toast.type === "error"
              ? "border-rose-400/20 bg-[#21121a] text-rose-200"
              : "border-emerald-400/20 bg-[#10211e] text-emerald-200"
              }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
            ) : (
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            )}

            <p className="text-xs leading-5">{toast.text}</p>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="ml-1 rounded-md p-0.5 opacity-70 transition hover:opacity-100"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}