// src/pages/college/DemoSchedulePage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Building2,
  CalendarCheck,
  CalendarClock,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleAlert,
  CircleX,
  Clock3,
  Copy,
  Download,
  Eye,
  Filter,
  GraduationCap,
  LayoutGrid,
  List,
  Mail,
  MapPin,
  MonitorPlay,
  MoreHorizontal,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  Send,
  SlidersHorizontal,
  Sparkles,
  Target,
  Trash2,
  Users,
  Video,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "techmentor_college_demo_schedule_v1";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const pad = (number) => String(number).padStart(2, "0");

const toLocalDate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

const dateOffset = (offset, time = "11:00") => {
  const date = new Date();
  date.setDate(date.getDate() + offset);
  return `${toLocalDate(date)}T${time}:00`;
};

const dateOnly = (value) => {
  if (!value) return "";

  if (value.includes("T")) {
    return value.split("T")[0];
  }

  return value;
};

const formatDate = (value, options = {}) => {
  if (!value) return "Not scheduled";

  const date = new Date(`${dateOnly(value)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  });
};

const formatLongDate = (value) => {
  if (!value) return "Not scheduled";

  const date = new Date(`${dateOnly(value)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "Invalid date";

  return date.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

const formatTime = (value) => {
  if (!value) return "--:--";

  const [hours, minutes] = value.split(":").map(Number);

  if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
    return value;
  }

  const date = new Date();
  date.setHours(hours, minutes, 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const getStartDate = (demo) => {
  const date = dateOnly(demo.date);

  if (!date || !demo.time) return null;

  const result = new Date(`${date}T${demo.time}:00`);

  return Number.isNaN(result.getTime()) ? null : result;
};

const isUpcoming = (demo) => {
  const start = getStartDate(demo);

  return (
    start &&
    start >= new Date() &&
    demo.status !== "Completed" &&
    demo.status !== "Cancelled"
  );
};

const makeDemoId = () => {
  const number = Math.floor(1000 + Math.random() * 9000);
  return `DEMO-${number}`;
};

const createSeedDemos = () => [
  {
    id: "DEMO-2041",
    title: "Python Fundamentals — Orientation",
    course: "Python for Beginners",
    department: "Computer Science",
    trainer: "Mayank Sharma",
    trainerEmail: "mayank@example.com",
    students: 45,
    date: dateOffset(1, "11:00"),
    time: "11:00",
    duration: 60,
    mode: "Online",
    location: "Google Meet",
    meetingLink: "https://meet.google.com/",
    status: "Confirmed",
    contactPerson: "Priya Verma",
    contactEmail: "priya@example.com",
    notes: "Introduction to the program, learning path and student expectations.",
  },
  {
    id: "DEMO-2042",
    title: "Java & DSA Interactive Demo",
    course: "Java & DSA",
    department: "Computer Science",
    trainer: "Rahul Mehta",
    trainerEmail: "rahul@example.com",
    students: 80,
    date: dateOffset(2, "14:30"),
    time: "14:30",
    duration: 90,
    mode: "On-campus",
    location: "Seminar Hall A",
    meetingLink: "",
    status: "Pending",
    contactPerson: "Amit Singh",
    contactEmail: "amit@example.com",
    notes: "Live coding session covering arrays, searching and problem-solving.",
  },
  {
    id: "DEMO-2043",
    title: "Full Stack Development Preview",
    course: "Full Stack Development",
    department: "Information Technology",
    trainer: "Neha Gupta",
    trainerEmail: "neha@example.com",
    students: 60,
    date: dateOffset(3, "10:00"),
    time: "10:00",
    duration: 60,
    mode: "Online",
    location: "Microsoft Teams",
    meetingLink: "https://teams.microsoft.com/",
    status: "Confirmed",
    contactPerson: "Rohit Jain",
    contactEmail: "rohit@example.com",
    notes: "Frontend, backend and database workflow introduction.",
  },
  {
    id: "DEMO-2044",
    title: "Data Analytics Career Session",
    course: "Data Analytics",
    department: "Data Science",
    trainer: "Ananya Rao",
    trainerEmail: "ananya@example.com",
    students: 35,
    date: dateOffset(5, "12:00"),
    time: "12:00",
    duration: 45,
    mode: "Online",
    location: "Google Meet",
    meetingLink: "https://meet.google.com/",
    status: "Rescheduled",
    contactPerson: "Sneha Sharma",
    contactEmail: "sneha@example.com",
    notes: "Project-based analytics workflow and career roadmap.",
  },
  {
    id: "DEMO-2045",
    title: "Cloud & DevOps Overview",
    course: "Cloud & DevOps",
    department: "Information Technology",
    trainer: "Vikram Joshi",
    trainerEmail: "vikram@example.com",
    students: 50,
    date: dateOffset(7, "15:00"),
    time: "15:00",
    duration: 60,
    mode: "On-campus",
    location: "Lab 204",
    meetingLink: "",
    status: "Pending",
    contactPerson: "Karan Patel",
    contactEmail: "karan@example.com",
    notes: "Cloud fundamentals, deployment pipelines and DevOps practices.",
  },
  {
    id: "DEMO-2046",
    title: "React UI Development Demo",
    course: "Frontend Development",
    department: "Computer Science",
    trainer: "Mayank Sharma",
    trainerEmail: "mayank@example.com",
    students: 40,
    date: dateOffset(-1, "11:00"),
    time: "11:00",
    duration: 60,
    mode: "Online",
    location: "Google Meet",
    meetingLink: "https://meet.google.com/",
    status: "Completed",
    contactPerson: "Priya Verma",
    contactEmail: "priya@example.com",
    notes: "Component-based UI development and responsive layouts.",
  },
];

const STATUS_STYLES = {
  Confirmed: {
    badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-300",
    Icon: CheckCircle2,
  },
  Pending: {
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    dot: "bg-amber-300",
    Icon: CircleAlert,
  },
  Completed: {
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    dot: "bg-emerald-300",
    Icon: CheckCircle2,
  },
  Rescheduled: {
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    dot: "bg-violet-300",
    Icon: RefreshCw,
  },
  Cancelled: {
    badge: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    dot: "bg-rose-300",
    Icon: CircleX,
  },
};

const EMPTY_FORM = {
  title: "",
  course: "Python for Beginners",
  department: "Computer Science",
  trainer: "",
  trainerEmail: "",
  students: "30",
  date: toLocalDate(new Date()),
  time: "11:00",
  duration: "60",
  mode: "Online",
  location: "Google Meet",
  meetingLink: "",
  status: "Pending",
  contactPerson: "",
  contactEmail: "",
  notes: "",
};

const COURSE_OPTIONS = [
  "Python for Beginners",
  "Java & DSA",
  "Full Stack Development",
  "Frontend Development",
  "Data Analytics",
  "Cloud & DevOps",
  "Artificial Intelligence",
];

const TRAINER_OPTIONS = [
  {
    name: "Mayank Sharma",
    email: "mayank@example.com",
  },
  {
    name: "Rahul Mehta",
    email: "rahul@example.com",
  },
  {
    name: "Neha Gupta",
    email: "neha@example.com",
  },
  {
    name: "Ananya Rao",
    email: "ananya@example.com",
  },
  {
    name: "Vikram Joshi",
    email: "vikram@example.com",
  },
];

const loadDemos = () => {
  if (typeof window === "undefined") return createSeedDemos();

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to read saved demo schedule:", error);
  }

  return createSeedDemos();
};

/* -------------------------------------------------------------------------- */
/*                                SMALL PIECES                                */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const Icon = style.Icon;

  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold",
        style.badge
      )}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon,
  width = "w-44",
  compact = false,
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

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

  const selected = options.find((option) => option.value === value);

  return (
    <div ref={rootRef} className={cx("relative shrink-0", width)}>
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className={cx(
          "group flex w-full items-center gap-2 rounded-xl border text-left transition-all duration-200",
          compact ? "px-3 py-2.5" : "px-3.5 py-3",
          open
            ? "border-cyan-400/50 bg-[#12243a] shadow-[0_0_0_3px_rgba(34,211,238,0.07)]"
            : "border-white/[0.09] bg-[#0c192b] hover:border-cyan-400/30 hover:bg-[#102036]"
        )}
      >
        {Icon && (
          <Icon
            size={15}
            className={cx(
              "shrink-0 transition-colors",
              open ? "text-cyan-300" : "text-slate-500 group-hover:text-cyan-300"
            )}
          />
        )}

        <span className="min-w-0 flex-1 truncate">
          {!compact && label && (
            <span className="mb-0.5 block text-[10px] font-medium uppercase tracking-[0.12em] text-slate-500">
              {label}
            </span>
          )}

          <span
            className={cx(
              "block truncate font-medium text-slate-200",
              compact ? "text-xs" : "text-[13px]"
            )}
          >
            {selected?.label ?? value}
          </span>
        </span>

        <ChevronDown
          size={14}
          className={cx(
            "shrink-0 text-slate-500 transition-transform duration-200",
            open && "rotate-180 text-cyan-300"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 7, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.985 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-[calc(100%+8px)] z-[80] w-full min-w-[190px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.45)]"
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
                        ? "bg-cyan-400/10 text-cyan-200"
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
                    {active && <Check size={14} className="text-cyan-300" />}
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

function StatCard({ title, value, caption, icon: Icon, accent, progress }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c192b] p-4 sm:p-5"
    >
      <div
        className={cx(
          "pointer-events-none absolute -right-9 -top-10 h-28 w-28 rounded-full blur-3xl opacity-[0.12]",
          accent
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
              {value}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-relaxed text-slate-500">
            {caption}
          </p>
        </div>

        <div
          className={cx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06]",
            accent
          )}
        >
          <Icon size={18} className="text-cyan-100" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300"
          />
        </div>
      )}
    </motion.div>
  );
}

function EmptyState({ onCreate, hasFilters, onClear }) {
  return (
    <div className="flex flex-col items-center px-5 py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
        <CalendarDays size={27} className="text-cyan-300" />
      </div>

      <h3 className="mt-5 text-base font-semibold text-white">
        {hasFilters ? "No matching demos" : "Your demo schedule starts here"}
      </h3>

      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
        {hasFilters
          ? "Try changing your search or filters to see more sessions."
          : "Create a demo session to coordinate trainers, students and schedules in one place."}
      </p>

      <div className="mt-5 flex flex-wrap justify-center gap-2">
        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05]"
          >
            Clear filters
          </button>
        )}

        <button
          type="button"
          onClick={onCreate}
          className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-[#071323] transition hover:bg-cyan-200"
        >
          <Plus size={15} />
          Schedule a demo
        </button>
      </div>
    </div>
  );
}

function ModalShell({ title, subtitle, icon: Icon, onClose, children, wide = false }) {
  useEffect(() => {
    const handleKey = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="modal-backdrop"
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
          exit={{ opacity: 0, y: 12, scale: 0.985 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className={cx(
            "my-auto w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0b1728] shadow-[0_30px_100px_rgba(0,0,0,0.5)]",
            wide ? "max-w-3xl" : "max-w-xl"
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08]">
                <Icon size={19} className="text-cyan-300" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">{subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition hover:border-white/15 hover:bg-white/[0.05] hover:text-white"
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

function Field({ label, required, children, hint }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 flex items-center gap-1 text-xs font-medium text-slate-300">
        {label}
        {required && <span className="text-cyan-300">*</span>}
      </span>

      {children}

      {hint && <span className="mt-1.5 block text-[10px] text-slate-500">{hint}</span>}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/[0.09] bg-[#081323] px-3.5 py-3 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-white/[0.15] focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-300/[0.06]";

function TextInput({ icon: Icon, ...props }) {
  if (!Icon) {
    return <input {...props} className={cx(inputClass, props.className)} />;
  }

  return (
    <div className="relative">
      <Icon
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input
        {...props}
        className={cx(inputClass, "pl-10", props.className)}
      />
    </div>
  );
}

function SelectInput({ children, ...props }) {
  return (
    <div className="relative">
      <select
        {...props}
        className={cx(inputClass, "appearance-none pr-9", props.className)}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
      />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                           CREATE / EDIT DEMO MODAL                         */
/* -------------------------------------------------------------------------- */

function DemoFormModal({ demo, onClose, onSave }) {
  const isEditing = Boolean(demo);

  const [form, setForm] = useState(() => {
    if (!demo) return EMPTY_FORM;

    return {
      ...EMPTY_FORM,
      ...demo,
      students: String(demo.students ?? 30),
      duration: String(demo.duration ?? 60),
      date: dateOnly(demo.date),
    };
  });

  const [error, setError] = useState("");

  const change = (field, value) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
    setError("");
  };

  const handleTrainer = (name) => {
    const trainer = TRAINER_OPTIONS.find((item) => item.name === name);

    setForm((previous) => ({
      ...previous,
      trainer: name,
      trainerEmail: trainer?.email || previous.trainerEmail,
    }));

    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a demo title.");
      return;
    }

    if (!form.trainer.trim()) {
      setError("Please select or enter a trainer.");
      return;
    }

    if (!form.date || !form.time) {
      setError("Please select the demo date and time.");
      return;
    }

    if (!form.students || Number(form.students) < 1) {
      setError("Please enter at least one student.");
      return;
    }

    if (!form.duration || Number(form.duration) < 15) {
      setError("Demo duration must be at least 15 minutes.");
      return;
    }

    onSave({
      ...form,
      id: demo?.id || makeDemoId(),
      students: Number(form.students),
      duration: Number(form.duration),
      date: dateOnly(form.date),
      title: form.title.trim(),
      trainer: form.trainer.trim(),
      trainerEmail: form.trainerEmail.trim(),
      contactPerson: form.contactPerson.trim(),
      contactEmail: form.contactEmail.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <ModalShell
      title={isEditing ? "Edit demo session" : "Schedule a new demo"}
      subtitle={
        isEditing
          ? `Update session details for ${demo.id}.`
          : "Coordinate the trainer, session details and student attendance."
      }
      icon={CalendarClock}
      onClose={onClose}
      wide
    >
      <form onSubmit={handleSubmit}>
        <div className="max-h-[68vh] space-y-6 overflow-y-auto px-5 py-5 sm:px-6">
          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-[11px] font-bold text-cyan-200">
                01
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-300">
                Session details
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Demo title" required>
                  <TextInput
                    value={form.title}
                    onChange={(event) => change("title", event.target.value)}
                    placeholder="e.g. Python Fundamentals — Orientation"
                    autoFocus
                  />
                </Field>
              </div>

              <Field label="Course / program" required>
                <SelectInput
                  value={form.course}
                  onChange={(event) => change("course", event.target.value)}
                >
                  {COURSE_OPTIONS.map((course) => (
                    <option key={course} value={course}>
                      {course}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Department">
                <SelectInput
                  value={form.department}
                  onChange={(event) => change("department", event.target.value)}
                >
                  {[
                    "Computer Science",
                    "Information Technology",
                    "Data Science",
                    "Electronics",
                    "Management",
                    "Other",
                  ].map((department) => (
                    <option key={department} value={department}>
                      {department}
                    </option>
                  ))}
                </SelectInput>
              </Field>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-[11px] font-bold text-cyan-200">
                02
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-300">
                Trainer & attendance
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Assigned trainer" required>
                <SelectInput
                  value={form.trainer}
                  onChange={(event) => handleTrainer(event.target.value)}
                >
                  <option value="">Select trainer</option>
                  {TRAINER_OPTIONS.map((trainer) => (
                    <option key={trainer.name} value={trainer.name}>
                      {trainer.name}
                    </option>
                  ))}
                  {form.trainer &&
                    !TRAINER_OPTIONS.some((trainer) => trainer.name === form.trainer) && (
                      <option value={form.trainer}>{form.trainer}</option>
                    )}
                </SelectInput>
              </Field>

              <Field label="Trainer email">
                <TextInput
                  type="email"
                  icon={Mail}
                  value={form.trainerEmail}
                  onChange={(event) => change("trainerEmail", event.target.value)}
                  placeholder="trainer@example.com"
                />
              </Field>

              <Field label="Expected students" required>
                <TextInput
                  type="number"
                  min="1"
                  max="10000"
                  value={form.students}
                  onChange={(event) => change("students", event.target.value)}
                  placeholder="30"
                />
              </Field>

              <Field label="Session status">
                <SelectInput
                  value={form.status}
                  onChange={(event) => change("status", event.target.value)}
                >
                  {["Pending", "Confirmed", "Completed", "Rescheduled", "Cancelled"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    )
                  )}
                </SelectInput>
              </Field>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-[11px] font-bold text-cyan-200">
                03
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-300">
                Date, time & venue
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Demo date" required>
                <TextInput
                  type="date"
                  value={form.date}
                  onChange={(event) => change("date", event.target.value)}
                />
              </Field>

              <Field label="Start time" required>
                <TextInput
                  type="time"
                  value={form.time}
                  onChange={(event) => change("time", event.target.value)}
                />
              </Field>

              <Field label="Duration">
                <SelectInput
                  value={form.duration}
                  onChange={(event) => change("duration", event.target.value)}
                >
                  <option value="15">15 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                  <option value="120">120 minutes</option>
                </SelectInput>
              </Field>

              <Field label="Session mode">
                <SelectInput
                  value={form.mode}
                  onChange={(event) => {
                    const mode = event.target.value;
                    change("mode", mode);

                    if (mode === "Online" && !form.location) {
                      change("location", "Google Meet");
                    } else if (mode === "On-campus") {
                      change("location", "Seminar Hall A");
                    }
                  }}
                >
                  <option value="Online">Online</option>
                  <option value="On-campus">On-campus</option>
                </SelectInput>
              </Field>

              <div className="sm:col-span-2">
                <Field label={form.mode === "Online" ? "Meeting platform" : "Venue / room"}>
                  <TextInput
                    icon={MapPin}
                    value={form.location}
                    onChange={(event) => change("location", event.target.value)}
                    placeholder={
                      form.mode === "Online" ? "Google Meet" : "Seminar Hall A"
                    }
                  />
                </Field>
              </div>

              {form.mode === "Online" && (
                <div className="sm:col-span-2">
                  <Field label="Meeting link" hint="Optional. Add the actual meeting URL when available.">
                    <TextInput
                      icon={Video}
                      type="url"
                      value={form.meetingLink}
                      onChange={(event) => change("meetingLink", event.target.value)}
                      placeholder="https://meet.google.com/..."
                    />
                  </Field>
                </div>
              )}
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-[11px] font-bold text-cyan-200">
                04
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-300">
                College contact & notes
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Contact person">
                <TextInput
                  value={form.contactPerson}
                  onChange={(event) => change("contactPerson", event.target.value)}
                  placeholder="College coordinator"
                />
              </Field>

              <Field label="Contact email">
                <TextInput
                  type="email"
                  icon={Mail}
                  value={form.contactEmail}
                  onChange={(event) => change("contactEmail", event.target.value)}
                  placeholder="coordinator@college.edu"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Session notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(event) => change("notes", event.target.value)}
                    placeholder="Agenda, prerequisites or instructions for the trainer..."
                    className={cx(inputClass, "resize-y")}
                  />
                </Field>
              </div>
            </div>
          </section>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-3.5 py-3 text-xs text-rose-200">
              <CircleAlert size={15} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] bg-[#091423] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[10px] text-slate-500">
            <span className="text-cyan-300">*</span> Required fields
          </p>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05] sm:flex-none"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-[#071323] transition hover:bg-cyan-200 sm:flex-none"
            >
              <Check size={15} />
              {isEditing ? "Save changes" : "Create demo"}
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*                                DETAILS MODAL                               */
/* -------------------------------------------------------------------------- */

function DemoDetailsModal({ demo, onClose, onEdit, onStatusChange, onCopyLink }) {
  if (!demo) return null;

  return (
    <ModalShell
      title="Demo session details"
      subtitle={`Session reference · ${demo.id}`}
      icon={CalendarCheck}
      onClose={onClose}
      wide
    >
      <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-6">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-[#12324a] via-[#0e2238] to-[#0b1728] p-5">
          <div className="pointer-events-none absolute -right-8 -top-12 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="min-w-0">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <StatusBadge status={demo.status} />
                <span className="rounded-full border border-white/10 bg-black/10 px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                  {demo.mode}
                </span>
              </div>

              <h3 className="max-w-xl text-xl font-semibold leading-snug text-white">
                {demo.title}
              </h3>

              <p className="mt-2 text-sm text-slate-300">{demo.course}</p>
            </div>

            <button
              type="button"
              onClick={() => onEdit(demo)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
            >
              <Pencil size={14} />
              Edit session
            </button>
          </div>

          <div className="relative mt-5 grid gap-3 border-t border-white/10 pt-4 sm:grid-cols-3">
            <div className="flex items-center gap-2.5">
              <CalendarDays size={16} className="text-cyan-300" />
              <div>
                <p className="text-[10px] text-slate-400">Date</p>
                <p className="mt-0.5 text-xs font-semibold text-white">
                  {formatDate(demo.date)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Clock3 size={16} className="text-cyan-300" />
              <div>
                <p className="text-[10px] text-slate-400">Start time</p>
                <p className="mt-0.5 text-xs font-semibold text-white">
                  {formatTime(demo.time)} · {demo.duration} min
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2.5">
              <Users size={16} className="text-cyan-300" />
              <div>
                <p className="text-[10px] text-slate-400">Expected students</p>
                <p className="mt-0.5 text-xs font-semibold text-white">
                  {demo.students}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-[#081323] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <GraduationCap size={16} className="text-cyan-300" />
              Trainer information
            </div>

            <p className="text-sm font-medium text-slate-200">{demo.trainer}</p>

            <p className="mt-1 break-all text-xs text-slate-400">
              {demo.trainerEmail || "No email added"}
            </p>

            <p className="mt-3 text-[10px] text-slate-500">
              Department: {demo.department || "Not specified"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#081323] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              {demo.mode === "Online" ? (
                <MonitorPlay size={16} className="text-cyan-300" />
              ) : (
                <Building2 size={16} className="text-cyan-300" />
              )}
              Session location
            </div>

            <p className="text-sm font-medium text-slate-200">
              {demo.location || "Location not added"}
            </p>

            {demo.mode === "Online" && demo.meetingLink ? (
              <div className="mt-3 flex flex-wrap gap-2">
                <a
                  href={demo.meetingLink}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-300 px-3 py-2 text-[11px] font-bold text-[#071323] transition hover:bg-cyan-200"
                >
                  Open meeting
                  <ArrowUpRight size={13} />
                </a>

                <button
                  type="button"
                  onClick={() => onCopyLink(demo.meetingLink)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/[0.05]"
                >
                  <Copy size={13} />
                  Copy link
                </button>
              </div>
            ) : (
              <p className="mt-3 text-[10px] text-slate-500">
                {demo.mode === "Online"
                  ? "Meeting link has not been added."
                  : "On-campus session"}
              </p>
            )}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <Users size={15} className="text-cyan-300" />
              College coordinator
            </div>
            <p className="text-sm text-slate-200">
              {demo.contactPerson || "Not assigned"}
            </p>
            <p className="mt-1 break-all text-xs text-slate-400">
              {demo.contactEmail || "No contact email"}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <BookOpen size={15} className="text-cyan-300" />
              Session notes
            </div>
            <p className="whitespace-pre-wrap text-xs leading-5 text-slate-400">
              {demo.notes || "No notes added for this session."}
            </p>
          </div>
        </div>

        {demo.status !== "Completed" && demo.status !== "Cancelled" && (
          <div className="flex flex-wrap gap-2 border-t border-white/[0.07] pt-4">
            {demo.status !== "Confirmed" && (
              <button
                type="button"
                onClick={() => onStatusChange(demo.id, "Confirmed")}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
              >
                <CheckCircle2 size={14} />
                Confirm demo
              </button>
            )}

            <button
              type="button"
              onClick={() => onStatusChange(demo.id, "Completed")}
              className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
            >
              <Check size={14} />
              Mark completed
            </button>
          </div>
        )}
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*                              MAIN PAGE COMPONENT                           */
/* -------------------------------------------------------------------------- */

export default function DemoSchedulePage() {
  const [demos, setDemos] = useState(loadDemos);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [courseFilter, setCourseFilter] = useState("all");
  const [modeFilter, setModeFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [view, setView] = useState("list");
  const [formDemo, setFormDemo] = useState(null);
  const [formOpen, setFormOpen] = useState(false);
  const [selectedDemo, setSelectedDemo] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
    } catch (error) {
      console.error("Unable to save demo schedule:", error);
    }
  }, [demos]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  const openCreate = () => {
    setFormDemo(null);
    setFormOpen(true);
  };

  const openEdit = (demo) => {
    setSelectedDemo(null);
    setActiveMenu(null);
    setFormDemo(demo);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormDemo(null);
  };

  const handleSave = (formData) => {
    setDemos((previous) => {
      const exists = previous.some((item) => item.id === formData.id);

      if (exists) {
        return previous.map((item) =>
          item.id === formData.id ? { ...item, ...formData } : item
        );
      }

      return [formData, ...previous];
    });

    closeForm();
    setSelectedDemo(null);
    notify(formDemo ? "Demo session updated." : "Demo session created.");
  };

  const changeStatus = (id, status) => {
    const existing = demos.find((demo) => demo.id === id);

    if (!existing) return;

    setDemos((previous) =>
      previous.map((demo) => (demo.id === id ? { ...demo, status } : demo))
    );

    setSelectedDemo((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );

    setActiveMenu(null);
    notify(
      status === "Completed"
        ? "Demo marked as completed."
        : status === "Cancelled"
          ? "Demo cancelled."
          : status === "Rescheduled"
            ? "Demo marked as rescheduled."
            : `Demo status changed to ${status}.`
    );
  };

  const handleDelete = (demo) => {
    const confirmed = window.confirm(
      `Delete ${demo.id} — "${demo.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setDemos((previous) => previous.filter((item) => item.id !== demo.id));
    setActiveMenu(null);
    setSelectedDemo(null);
    notify("Demo session deleted.");
  };

  const handleCopyLink = async (url) => {
    if (!url) {
      notify("No meeting link is available.", "error");
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      notify("Meeting link copied.");
    } catch {
      notify("Unable to copy automatically. Please copy the link manually.", "error");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCourseFilter("all");
    setModeFilter("all");
    setDateFilter("all");
  };

  const hasActiveFilters =
    Boolean(search.trim()) ||
    statusFilter !== "all" ||
    courseFilter !== "all" ||
    modeFilter !== "all" ||
    dateFilter !== "all";

  const filteredDemos = useMemo(() => {
    const query = search.trim().toLowerCase();
    const today = toLocalDate(new Date());

    const nextSeven = new Date();
    nextSeven.setDate(nextSeven.getDate() + 7);
    const nextSevenString = toLocalDate(nextSeven);

    return demos
      .filter((demo) => {
        if (statusFilter !== "all" && demo.status !== statusFilter) {
          return false;
        }

        if (courseFilter !== "all" && demo.course !== courseFilter) {
          return false;
        }

        if (modeFilter !== "all" && demo.mode !== modeFilter) {
          return false;
        }

        if (dateFilter === "today" && dateOnly(demo.date) !== today) {
          return false;
        }

        if (
          dateFilter === "next7" &&
          (dateOnly(demo.date) < today || dateOnly(demo.date) > nextSevenString)
        ) {
          return false;
        }

        if (dateFilter === "past" && dateOnly(demo.date) >= today) {
          return false;
        }

        if (query) {
          const searchable = [
            demo.id,
            demo.title,
            demo.course,
            demo.trainer,
            demo.department,
            demo.location,
            demo.contactPerson,
            demo.status,
          ]
            .join(" ")
            .toLowerCase();

          if (!searchable.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const aDate = getStartDate(a)?.getTime() ?? 0;
        const bDate = getStartDate(b)?.getTime() ?? 0;
        return aDate - bDate;
      });
  }, [demos, search, statusFilter, courseFilter, modeFilter, dateFilter]);

  const stats = useMemo(() => {
    const upcoming = demos.filter(isUpcoming);
    const confirmed = upcoming.filter((demo) => demo.status === "Confirmed");
    const students = upcoming.reduce(
      (total, demo) => total + (Number(demo.students) || 0),
      0
    );
    const completed = demos.filter((demo) => demo.status === "Completed").length;

    const confirmRate = upcoming.length
      ? Math.round((confirmed.length / upcoming.length) * 100)
      : 0;

    return {
      upcoming: upcoming.length,
      students,
      completed,
      confirmRate,
    };
  }, [demos]);

  const handleExport = () => {
    const headers = [
      "ID",
      "Title",
      "Course",
      "Department",
      "Trainer",
      "Trainer Email",
      "Students",
      "Date",
      "Time",
      "Duration (min)",
      "Mode",
      "Location",
      "Meeting Link",
      "Status",
      "Contact Person",
      "Contact Email",
      "Notes",
    ];

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = filteredDemos.map((demo) => [
      demo.id,
      demo.title,
      demo.course,
      demo.department,
      demo.trainer,
      demo.trainerEmail,
      demo.students,
      dateOnly(demo.date),
      demo.time,
      demo.duration,
      demo.mode,
      demo.location,
      demo.meetingLink,
      demo.status,
      demo.contactPerson,
      demo.contactEmail,
      demo.notes,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "college-demo-schedule.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    notify(`${filteredDemos.length} demo records exported.`);
  };

  const openReschedule = (demo) => {
    setDemos((previous) =>
      previous.map((item) =>
        item.id === demo.id
          ? { ...item, status: "Rescheduled" }
          : item
      )
    );

    setActiveMenu(null);
    setFormDemo({ ...demo, status: "Rescheduled" });
    setFormOpen(true);
  };

  return (
    <div className="min-h-full min-w-0 space-y-6 bg-[#071323] p-4 text-slate-100 sm:p-6 xl:p-7">
      {/* Header */}
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
            <span className="text-cyan-300">Demo Schedule</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/15 to-sky-400/[0.04] sm:flex">
              <CalendarDays size={23} className="text-cyan-200" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
                  Demo Schedule
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-2 py-1 text-[10px] font-semibold text-cyan-200">
                  <Activity size={11} />
                  Live workspace
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Coordinate trainer demonstrations, manage session status and keep
                upcoming college programs organised.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-[#0c192b] px-3.5 py-3 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/25 hover:bg-[#102036] hover:text-white"
          >
            <Download size={15} />
            Export CSV
          </button>

          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-[#071323] shadow-[0_5px_18px_rgba(34,211,238,0.1)] transition hover:bg-cyan-200"
          >
            <Plus size={16} />
            Schedule demo
          </button>
        </div>
      </motion.header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Upcoming demos"
          value={stats.upcoming}
          caption="Sessions planned for the future"
          icon={CalendarClock}
          accent="bg-cyan-400/15"
        />

        <StatCard
          title="Students expected"
          value={stats.students.toLocaleString("en-IN")}
          caption="Across all upcoming sessions"
          icon={Users}
          accent="bg-sky-400/15"
        />

        <StatCard
          title="Confirmation rate"
          value={`${stats.confirmRate}%`}
          caption="Of upcoming sessions confirmed"
          icon={Target}
          accent="bg-indigo-400/15"
          progress={stats.confirmRate}
        />

        <StatCard
          title="Completed demos"
          value={stats.completed}
          caption="Sessions marked as completed"
          icon={CheckCircle2}
          accent="bg-emerald-400/15"
        />
      </section>

      {/* Spotlight */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-300/[0.13] bg-gradient-to-r from-[#103047] via-[#10253b] to-[#0b192a] p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.07] blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.08]">
              <Sparkles size={18} className="text-cyan-200" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white">
                Keep every demo on track
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300/75">
                Assign a trainer, confirm the venue and share the session details
                with your college coordinator before the demo starts.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setDateFilter("next7");
              setStatusFilter("all");
              setCourseFilter("all");
              setModeFilter("all");
              setSearch("");
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-cyan-200/15 bg-[#061525]/40 px-3.5 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.08] md:self-center"
          >
            View next 7 days
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Filter toolbar */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b] p-3 sm:p-4">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035]">
              <SlidersHorizontal size={16} className="text-cyan-300" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">Session directory</h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {filteredDemos.length} of {demos.length} sessions
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-[#071323] p-1">
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
              Grid
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
              placeholder="Search by title, trainer, course or demo ID..."
              className="w-full rounded-xl border border-white/[0.09] bg-[#071323] py-3 pl-10 pr-10 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-300/[0.05]"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 2xl:flex">
            <CustomDropdown
              label="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              icon={Filter}
              compact
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "All statuses", value: "all" },
                { label: "Confirmed", value: "Confirmed" },
                { label: "Pending", value: "Pending" },
                { label: "Rescheduled", value: "Rescheduled" },
                { label: "Completed", value: "Completed" },
                { label: "Cancelled", value: "Cancelled" },
              ]}
            />

            <CustomDropdown
              label="Course"
              value={courseFilter}
              onChange={setCourseFilter}
              icon={BookOpen}
              compact
              width="w-full sm:w-40 2xl:w-44"
              options={[
                { label: "All courses", value: "all" },
                ...COURSE_OPTIONS.map((course) => ({
                  label: course,
                  value: course,
                })),
              ]}
            />

            <CustomDropdown
              label="Mode"
              value={modeFilter}
              onChange={setModeFilter}
              icon={MonitorPlay}
              compact
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "All modes", value: "all" },
                { label: "Online", value: "Online" },
                { label: "On-campus", value: "On-campus" },
              ]}
            />

            <CustomDropdown
              label="Date range"
              value={dateFilter}
              onChange={setDateFilter}
              icon={CalendarDays}
              compact
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "Any date", value: "all" },
                { label: "Today", value: "today" },
                { label: "Next 7 days", value: "next7" },
                { label: "Past demos", value: "past" },
              ]}
            />
          </div>
        </div>

        {hasActiveFilters && (
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

            {courseFilter !== "all" && (
              <button
                type="button"
                onClick={() => setCourseFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {courseFilter}
                <X size={11} />
              </button>
            )}

            {modeFilter !== "all" && (
              <button
                type="button"
                onClick={() => setModeFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {modeFilter}
                <X size={11} />
              </button>
            )}

            {dateFilter !== "all" && (
              <button
                type="button"
                onClick={() => setDateFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {dateFilter === "next7"
                  ? "Next 7 days"
                  : dateFilter === "today"
                    ? "Today"
                    : "Past demos"}
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

      {/* Session content */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b]">
        {filteredDemos.length === 0 ? (
          <EmptyState
            onCreate={openCreate}
            hasFilters={hasActiveFilters}
            onClear={clearFilters}
          />
        ) : view === "list" ? (
          <div>
            <div className="flex flex-col justify-between gap-2 border-b border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
              <div>
                <h2 className="text-sm font-semibold text-white">All demo sessions</h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Select a session to view complete details.
                </p>
              </div>

              <span className="w-fit rounded-lg border border-white/[0.07] bg-[#071323] px-2.5 py-1.5 text-[10px] font-semibold text-slate-400">
                {filteredDemos.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-[#091525]/80">
                    {[
                      "Session",
                      "Date & time",
                      "Trainer",
                      "Students",
                      "Mode",
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
                  {filteredDemos.map((demo, index) => {
                    const start = getStartDate(demo);
                    const day = start
                      ? start.toLocaleDateString("en-IN", { day: "2-digit" })
                      : "--";
                    const month = start
                      ? start.toLocaleDateString("en-IN", { month: "short" })
                      : "---";

                    return (
                      <motion.tr
                        key={demo.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(index * 0.025, 0.2) }}
                        className="group border-b border-white/[0.045] transition-colors last:border-0 hover:bg-white/[0.025]"
                      >
                        <td className="max-w-[310px] px-4 py-4 pl-5">
                          <button
                            type="button"
                            onClick={() => setSelectedDemo(demo)}
                            className="block min-w-0 text-left"
                          >
                            <span className="block truncate text-xs font-semibold text-slate-100 transition group-hover:text-cyan-200">
                              {demo.title}
                            </span>
                            <span className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500">
                              <span>{demo.id}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-700" />
                              <span className="truncate">{demo.course}</span>
                            </span>
                          </button>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-10 w-10 shrink-0 flex-col items-center justify-center rounded-xl border border-white/[0.07] bg-[#071323]">
                              <span className="text-sm font-bold leading-none text-white">
                                {day}
                              </span>
                              <span className="mt-1 text-[9px] uppercase text-cyan-300">
                                {month}
                              </span>
                            </div>

                            <div className="min-w-[100px]">
                              <p className="text-xs font-medium text-slate-200">
                                {formatTime(demo.time)}
                              </p>
                              <p className="mt-1 text-[10px] text-slate-500">
                                {demo.duration} minutes
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/10 bg-cyan-300/[0.07] text-[10px] font-bold text-cyan-200">
                              {demo.trainer
                                ?.split(" ")
                                .map((part) => part[0])
                                .slice(0, 2)
                                .join("") || "TR"}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[145px] truncate text-xs font-medium text-slate-200">
                                {demo.trainer || "Unassigned"}
                              </p>
                              <p className="mt-1 max-w-[145px] truncate text-[10px] text-slate-500">
                                {demo.department || "Department not set"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                            <Users size={13} className="text-slate-500" />
                            {demo.students}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                            {demo.mode === "Online" ? (
                              <MonitorPlay size={13} className="text-cyan-300" />
                            ) : (
                              <Building2 size={13} className="text-sky-300" />
                            )}
                            {demo.mode}
                          </span>
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={demo.status} />
                        </td>

                        <td className="px-4 py-4 pr-5">
                          <div className="relative flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                setActiveMenu((previous) =>
                                  previous === demo.id ? null : demo.id
                                )
                              }
                              aria-label={`Actions for ${demo.id}`}
                              className={cx(
                                "flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white",
                                activeMenu === demo.id && "border-white/10 bg-white/[0.05] text-white"
                              )}
                            >
                              <MoreHorizontal size={17} />
                            </button>

                            <AnimatePresence>
                              {activeMenu === demo.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                  className="absolute right-0 top-10 z-[90] w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                                >
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setSelectedDemo(demo);
                                      setActiveMenu(null);
                                    }}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                                  >
                                    <Eye size={14} />
                                    View details
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => openEdit(demo)}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                                  >
                                    <Pencil size={14} />
                                    Edit session
                                  </button>

                                  {demo.status !== "Completed" &&
                                    demo.status !== "Cancelled" && (
                                      <>
                                        <button
                                          type="button"
                                          onClick={() => openReschedule(demo)}
                                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                                        >
                                          <RefreshCw size={14} />
                                          Reschedule
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => changeStatus(demo.id, "Completed")}
                                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-emerald-200 transition hover:bg-emerald-400/[0.07]"
                                        >
                                          <CheckCircle2 size={14} />
                                          Mark completed
                                        </button>

                                        <button
                                          type="button"
                                          onClick={() => changeStatus(demo.id, "Cancelled")}
                                          className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-rose-200 transition hover:bg-rose-400/[0.07]"
                                        >
                                          <CircleX size={14} />
                                          Cancel demo
                                        </button>
                                      </>
                                    )}

                                  <div className="my-1 border-t border-white/[0.07]" />

                                  <button
                                    type="button"
                                    onClick={() => handleDelete(demo)}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-rose-300 transition hover:bg-rose-400/[0.07]"
                                  >
                                    <Trash2 size={14} />
                                    Delete session
                                  </button>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/[0.06] px-4 py-3.5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <span>
                Showing <strong className="font-semibold text-slate-300">{filteredDemos.length}</strong> sessions
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Changes save automatically in this browser
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-white">Schedule overview</h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Visual view of your demo sessions.
                </p>
              </div>

              <span className="rounded-lg border border-white/[0.07] bg-[#071323] px-2.5 py-1.5 text-[10px] text-slate-400">
                {filteredDemos.length} sessions
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-3">
              {filteredDemos.map((demo, index) => {
                const start = getStartDate(demo);
                const day = start
                  ? start.toLocaleDateString("en-IN", { day: "2-digit" })
                  : "--";
                const month = start
                  ? start.toLocaleDateString("en-IN", { month: "short" })
                  : "---";

                return (
                  <motion.article
                    key={demo.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.03, 0.2) }}
                    className="group rounded-2xl border border-white/[0.07] bg-[#091525] p-4 transition hover:border-cyan-300/20 hover:bg-[#0b1b2e]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.06]">
                          <span className="text-base font-bold leading-none text-white">
                            {day}
                          </span>
                          <span className="mt-1 text-[9px] uppercase tracking-wide text-cyan-300">
                            {month}
                          </span>
                        </div>

                        <div className="min-w-0 pt-0.5">
                          <p className="mb-1.5 text-[10px] text-slate-500">{demo.id}</p>
                          <h3 className="line-clamp-2 text-sm font-semibold leading-5 text-slate-100 transition group-hover:text-cyan-200">
                            {demo.title}
                          </h3>
                          <p className="mt-1 truncate text-[11px] text-slate-500">
                            {demo.course}
                          </p>
                        </div>
                      </div>

                      <div className="relative">
                        <button
                          type="button"
                          onClick={() =>
                            setActiveMenu((previous) =>
                              previous === demo.id ? null : demo.id
                            )
                          }
                          aria-label={`Actions for ${demo.id}`}
                          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                        >
                          <MoreHorizontal size={17} />
                        </button>

                        <AnimatePresence>
                          {activeMenu === demo.id && (
                            <motion.div
                              initial={{ opacity: 0, y: 6 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0 }}
                              className="absolute right-0 top-9 z-[90] w-44 rounded-xl border border-white/10 bg-[#0b1728] p-1.5 shadow-xl"
                            >
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedDemo(demo);
                                  setActiveMenu(null);
                                }}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-white/[0.05]"
                              >
                                <Eye size={13} /> View details
                              </button>

                              <button
                                type="button"
                                onClick={() => openEdit(demo)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-white/[0.05]"
                              >
                                <Pencil size={13} /> Edit
                              </button>

                              {demo.status !== "Completed" &&
                                demo.status !== "Cancelled" && (
                                  <button
                                    type="button"
                                    onClick={() => changeStatus(demo.id, "Completed")}
                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-emerald-200 hover:bg-emerald-400/[0.07]"
                                  >
                                    <CheckCircle2 size={13} /> Mark completed
                                  </button>
                                )}

                              <button
                                type="button"
                                onClick={() => handleDelete(demo)}
                                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-xs text-rose-300 hover:bg-rose-400/[0.07]"
                              >
                                <Trash2 size={13} /> Delete
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <StatusBadge status={demo.status} />

                      <span className="inline-flex items-center gap-1.5 rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-slate-400">
                        {demo.mode === "Online" ? (
                          <MonitorPlay size={11} />
                        ) : (
                          <Building2 size={11} />
                        )}
                        {demo.mode}
                      </span>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4">
                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-500">Trainer</p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-200">
                          {demo.trainer || "Unassigned"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500">Time & duration</p>
                        <p className="mt-1 text-xs font-medium text-slate-200">
                          {formatTime(demo.time)}
                        </p>
                        <p className="mt-0.5 text-[10px] text-slate-500">
                          {demo.duration} minutes
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500">Expected students</p>
                        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-slate-200">
                          <Users size={13} className="text-cyan-300" />
                          {demo.students}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[10px] text-slate-500">Location</p>
                        <p className="mt-1 truncate text-xs font-medium text-slate-200">
                          {demo.location || "Not added"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedDemo(demo)}
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.025] py-2.5 text-xs font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-200"
                    >
                      View session
                      <ArrowUpRight size={14} />
                    </button>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4 text-[10px] text-slate-500">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
              Changes save automatically in this browser.
            </div>
          </div>
        )}
      </section>

      {/* Footer note */}
      <footer className="flex flex-col gap-2 pb-2 text-[10px] leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Demo Schedule · College Portal</p>
        <p className="inline-flex items-center gap-1.5">
          <Activity size={12} className="text-cyan-300" />
          Local demo workspace
        </p>
      </footer>

      {/* Create / edit modal */}
      {formOpen && (
        <DemoFormModal
          key={formDemo?.id || "new-demo"}
          demo={formDemo}
          onClose={closeForm}
          onSave={handleSave}
        />
      )}

      {/* Detail modal */}
      {selectedDemo && (
        <DemoDetailsModal
          demo={demos.find((item) => item.id === selectedDemo.id) || selectedDemo}
          onClose={() => setSelectedDemo(null)}
          onEdit={openEdit}
          onStatusChange={changeStatus}
          onCopyLink={handleCopyLink}
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
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
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