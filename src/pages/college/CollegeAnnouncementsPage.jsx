
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Megaphone,
  Plus,
  Search,
  Download,
  Bell,
  Users,
  GraduationCap,
  CalendarDays,
  Clock3,
  CheckCircle2,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  Send,
  Copy,
  ChevronDown,
  ChevronRight,
  Check,
  Filter,
  RotateCcw,
  Eye,
  FileText,
  LayoutGrid,
  Sparkles,
  MessageSquareText,
  Building2,
  Pin,
  ArrowUpRight,
  CalendarClock,
  ShieldCheck,
} from "lucide-react";

/* =========================================================
   THEME: DARK NAVY + ICE BLUE
   Matches CollegeTeamPage.jsx
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
  accentStrong: "#4B9AE8",
};

const STORAGE_KEY = "techmentor-college-announcements-v1";

const CATEGORY_OPTIONS = [
  "Academic",
  "Events",
  "Examinations",
  "Placements",
  "General",
];

const AUDIENCE_OPTIONS = [
  "Everyone",
  "Students",
  "Trainers",
  "Faculty",
  "Final Year Students",
];

const PRIORITY_OPTIONS = ["Normal", "Important", "Urgent"];

const STATUS_OPTIONS = ["Draft", "Published", "Scheduled"];

const EMPTY_FORM = {
  title: "",
  message: "",
  category: "General",
  audience: "Everyone",
  priority: "Normal",
  status: "Draft",
  publishDate: "",
  pinned: false,
};

const INITIAL_ANNOUNCEMENTS = [
  {
    id: "announcement-1",
    title: "Welcome to the new academic session",
    message:
      "Welcome to all students and faculty members. Please check your course dashboard for updated learning materials, academic schedules, and important information for the new session.",
    category: "Academic",
    audience: "Everyone",
    priority: "Important",
    status: "Published",
    publishDate: "2026-10-20",
    createdAt: "2026-10-20",
    pinned: true,
  },
  {
    id: "announcement-2",
    title: "Upcoming placement preparation workshop",
    message:
      "A placement preparation workshop will cover resume building, aptitude practice, interview preparation, and communication skills. Eligible students should review the placement schedule and prepare their questions.",
    category: "Placements",
    audience: "Final Year Students",
    priority: "Important",
    status: "Published",
    publishDate: "2026-10-19",
    createdAt: "2026-10-19",
    pinned: true,
  },
  {
    id: "announcement-3",
    title: "Updated examination guidelines",
    message:
      "Students are requested to review the examination guidelines before their upcoming assessments. Please arrive on time, carry your valid college identity card, and follow the instructions shared by your faculty.",
    category: "Examinations",
    audience: "Students",
    priority: "Urgent",
    status: "Published",
    publishDate: "2026-10-18",
    createdAt: "2026-10-18",
    pinned: false,
  },
  {
    id: "announcement-4",
    title: "Faculty coordination meeting",
    message:
      "The academic coordination meeting will cover course progress, upcoming class schedules, student participation, and departmental updates. Please review the agenda before the meeting.",
    category: "Academic",
    audience: "Faculty",
    priority: "Normal",
    status: "Scheduled",
    publishDate: "2026-10-28",
    createdAt: "2026-10-22",
    pinned: false,
  },
  {
    id: "announcement-5",
    title: "Campus event planning",
    message:
      "The institution is preparing for upcoming campus activities. Students and trainers can share their suggestions with the academic coordination team.",
    category: "Events",
    audience: "Everyone",
    priority: "Normal",
    status: "Draft",
    publishDate: "",
    createdAt: "2026-10-22",
    pinned: false,
  },
];

const PRIORITY_STYLES = {
  Normal: {
    badge: "border-[#3A526F] bg-[#1A3048] text-[#B7CBE2]",
    dot: "bg-[#91A9C4]",
  },
  Important: {
    badge: "border-[#365B85] bg-[#193653] text-[#A8D5FF]",
    dot: "bg-[#80BFFF]",
  },
  Urgent: {
    badge: "border-[#784A40] bg-[#3B2628] text-[#FFB4A8]",
    dot: "bg-[#FF8677]",
  },
};

const STATUS_STYLES = {
  Draft: {
    badge: "border-slate-600 bg-slate-800 text-slate-300",
    dot: "bg-slate-400",
  },
  Published: {
    badge: "border-emerald-800 bg-emerald-950/60 text-emerald-300",
    dot: "bg-emerald-400",
  },
  Scheduled: {
    badge: "border-amber-800 bg-amber-950/50 text-amber-300",
    dot: "bg-amber-400",
  },
};

const CATEGORY_STYLES = {
  Academic: "border-[#385C83] bg-[#1A3553] text-[#ADD5FF]",
  Events: "border-violet-800 bg-violet-950/40 text-violet-300",
  Examinations: "border-amber-800 bg-amber-950/40 text-amber-300",
  Placements: "border-emerald-800 bg-emerald-950/40 text-emerald-300",
  General: "border-[#3A526F] bg-[#1A3048] text-[#B7CBE2]",
};

const FIELD_CLASS =
  "w-full rounded-xl border border-[#344A66] bg-[#101D30] px-4 py-3 text-sm text-[#EAF3FF] outline-none transition placeholder:text-[#7187A2] focus:border-[#80BFFF] focus:ring-4 focus:ring-[#4B9AE8]/15";

/* =========================================================
   HELPERS
   ========================================================= */

function loadAnnouncements() {
  try {
    if (typeof window === "undefined") {
      return INITIAL_ANNOUNCEMENTS;
    }

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);

      if (Array.isArray(parsed)) {
        return parsed;
      }
    }

    return INITIAL_ANNOUNCEMENTS;
  } catch {
    return INITIAL_ANNOUNCEMENTS;
  }
}

function formatDate(date) {
  if (!date) return "Not scheduled";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(title = "") {
  return title
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((word) => word[0] || "")
    .join("")
    .toUpperCase();
}

function getCategoryIcon(category) {
  const icons = {
    Academic: GraduationCap,
    Events: CalendarDays,
    Examinations: FileText,
    Placements: Users,
    General: Megaphone,
  };

  return icons[category] || Megaphone;
}

function getReadableDate(date) {
  if (!date) return "No date selected";

  return formatDate(date);
}

function getToday() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);

  return local.toISOString().slice(0, 10);
}

/* =========================================================
   BADGES
   ========================================================= */

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Draft;

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const style = PRIORITY_STYLES[priority] || PRIORITY_STYLES.Normal;

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {priority}
    </span>
  );
}

function CategoryBadge({ category }) {
  return (
    <span
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${CATEGORY_STYLES[category] || CATEGORY_STYLES.General
        }`}
    >
      {category}
    </span>
  );
}

/* =========================================================
   ACTION BUTTON
   ========================================================= */

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
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#344A66] bg-[#14253C] text-[#A7BBD2] transition hover:border-[#628DBB] hover:bg-[#1A3555] hover:text-[#C8E5FF] disabled:cursor-not-allowed disabled:opacity-40 ${className}`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   CUSTOM DROPDOWN
   Browser-default select is NOT used.
   ========================================================= */

function PremiumSelect({
  value,
  options,
  onChange,
  icon: Icon,
  placeholder = "Select an option",
  className = "",
  menuAlign = "left",
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
      if (event.key === "Escape") {
        setOpen(false);
      }
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
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
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
            className={`absolute top-[calc(100%+8px)] z-[110] w-full min-w-[210px] overflow-hidden rounded-2xl border border-[#3B5677] bg-[#111F34] p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.45)] ${menuAlign === "right" ? "right-0" : "left-0"
              }`}
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
   CREATE / EDIT ANNOUNCEMENT MODAL
   ========================================================= */

function AnnouncementModal({
  open,
  onClose,
  onSubmit,
  editingAnnouncement,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (editingAnnouncement) {
      setForm({
        title: editingAnnouncement.title || "",
        message: editingAnnouncement.message || "",
        category: editingAnnouncement.category || "General",
        audience: editingAnnouncement.audience || "Everyone",
        priority: editingAnnouncement.priority || "Normal",
        status: editingAnnouncement.status || "Draft",
        publishDate: editingAnnouncement.publishDate || "",
        pinned: Boolean(editingAnnouncement.pinned),
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setError("");
  }, [open, editingAnnouncement]);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const title = form.title.trim();
    const message = form.message.trim();

    if (!title || !message) {
      setError("Please enter both title and announcement message.");
      return;
    }

    if (title.length < 4) {
      setError("The title must contain at least 4 characters.");
      return;
    }

    if (message.length < 10) {
      setError("The message must contain at least 10 characters.");
      return;
    }

    if (form.status === "Scheduled" && !form.publishDate) {
      setError("Select a publishing date for scheduled announcements.");
      return;
    }

    if (
      form.status === "Scheduled" &&
      form.publishDate &&
      form.publishDate < getToday()
    ) {
      setError("Scheduled publishing date cannot be in the past.");
      return;
    }

    if (form.status === "Published" && !form.publishDate) {
      updateField("publishDate", getToday());
    }

    onSubmit({
      ...form,
      title,
      message,
      publishDate:
        form.status === "Published"
          ? form.publishDate || getToday()
          : form.publishDate,
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
                    {editingAnnouncement ? (
                      <Pencil size={21} />
                    ) : (
                      <Megaphone size={21} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#EFF6FF]">
                      {editingAnnouncement
                        ? "Edit announcement"
                        : "Create announcement"}
                    </h2>

                    <p className="mt-1 max-w-sm text-sm leading-5 text-[#97ADC7]">
                      {editingAnnouncement
                        ? "Update the message, audience and publishing settings."
                        : "Share important institutional information with your audience."}
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
                  Announcement title <span className="text-red-400">*</span>
                </label>

                <input
                  autoFocus
                  value={form.title}
                  onChange={(event) =>
                    updateField("title", event.target.value)
                  }
                  placeholder="Enter a clear announcement title"
                  maxLength={160}
                  required
                  className={FIELD_CLASS}
                />

                <p className="mt-1.5 text-right text-[11px] text-[#7187A2]">
                  {form.title.length}/160 characters
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Message <span className="text-red-400">*</span>
                </label>

                <textarea
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder="Write the full announcement here..."
                  rows={6}
                  maxLength={5000}
                  required
                  className={`${FIELD_CLASS} min-h-[150px] resize-y leading-6`}
                />

                <p className="mt-1.5 text-right text-[11px] text-[#7187A2]">
                  {form.message.length}/5000 characters
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Category
                  </label>

                  <PremiumSelect
                    value={form.category}
                    options={CATEGORY_OPTIONS}
                    onChange={(value) => updateField("category", value)}
                    icon={FileText}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Target audience
                  </label>

                  <PremiumSelect
                    value={form.audience}
                    options={AUDIENCE_OPTIONS}
                    onChange={(value) => updateField("audience", value)}
                    icon={Users}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Priority
                  </label>

                  <PremiumSelect
                    value={form.priority}
                    options={PRIORITY_OPTIONS}
                    onChange={(value) => updateField("priority", value)}
                    icon={AlertCircle}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Publishing status
                  </label>

                  <PremiumSelect
                    value={form.status}
                    options={STATUS_OPTIONS}
                    onChange={(value) => updateField("status", value)}
                    icon={Bell}
                  />
                </div>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Publishing date
                </label>

                <div className="relative">
                  <CalendarDays
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
                  />

                  <input
                    type="date"
                    value={form.publishDate}
                    onChange={(event) =>
                      updateField("publishDate", event.target.value)
                    }
                    style={{ colorScheme: "dark" }}
                    className={`${FIELD_CLASS} pl-10`}
                  />
                </div>

                <p className="mt-1.5 text-xs text-[#8198B3]">
                  Required for scheduled announcements. Choose a date for
                  published announcements if needed.
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  updateField("pinned", !form.pinned)
                }
                className={`flex w-full items-center gap-3 rounded-xl border p-4 text-left transition ${form.pinned
                  ? "border-[#557DA6] bg-[#193654]"
                  : "border-[#344A66] bg-[#101D30] hover:bg-[#162A42]"
                  }`}
              >
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${form.pinned
                    ? "bg-[#80BFFF] text-[#10233D]"
                    : "bg-[#1D314A] text-[#92A9C3]"
                    }`}
                >
                  <Pin size={17} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-semibold text-[#E5F0FC]">
                    Pin this announcement
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-[#91A7C0]">
                    Keep this announcement at the top of the directory.
                  </span>
                </span>

                <span
                  className={`flex h-5 w-5 items-center justify-center rounded-md border ${form.pinned
                    ? "border-[#80BFFF] bg-[#80BFFF] text-[#10233D]"
                    : "border-[#50637C] bg-transparent"
                    }`}
                >
                  {form.pinned && <Check size={13} strokeWidth={3} />}
                </span>
              </button>

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
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#80BFFF] px-5 py-3 text-sm font-bold text-[#10233D] shadow-lg shadow-black/10 transition hover:bg-[#A0D0FF] focus:outline-none focus:ring-4 focus:ring-[#80BFFF]/20"
                >
                  {editingAnnouncement ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Send size={17} />
                  )}

                  {editingAnnouncement
                    ? "Save changes"
                    : "Save announcement"}
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
   ANNOUNCEMENT CARD
   ========================================================= */

function AnnouncementCard({
  announcement,
  index,
  onEdit,
  onDelete,
  onToggleStatus,
  onCopy,
  onPreview,
}) {
  const CategoryIcon = getCategoryIcon(announcement.category);

  const statusStyle =
    STATUS_STYLES[announcement.status] || STATUS_STYLES.Draft;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8, scale: 0.985 }}
      transition={{ duration: 0.2, delay: Math.min(index * 0.025, 0.15) }}
      className={`group relative overflow-visible rounded-2xl border bg-[#111F34] p-5 shadow-sm transition duration-300 hover:border-[#405E80] hover:bg-[#14243A] sm:p-6 ${announcement.pinned
        ? "border-[#3B5E83]"
        : "border-[#293D58]"
        }`}
    >
      {announcement.pinned && (
        <div className="absolute left-0 top-5 h-10 w-[3px] rounded-r-full bg-[#80BFFF]" />
      )}

      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#344E6C] bg-[#19304A] text-[#A9D5FF]">
              <CategoryIcon size={21} />
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <CategoryBadge category={announcement.category} />

                {announcement.pinned && (
                  <span className="inline-flex items-center gap-1 rounded-full border border-[#49688A] bg-[#1A3048] px-2.5 py-1 text-[10px] font-bold text-[#A9D5FF]">
                    <Pin size={11} />
                    Pinned
                  </span>
                )}
              </div>

              <h3 className="break-words text-base font-bold leading-6 text-[#EAF3FF] sm:text-lg">
                {announcement.title}
              </h3>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <IconButton
              label="Preview announcement"
              onClick={() => onPreview(announcement)}
            >
              <Eye size={17} />
            </IconButton>

            <IconButton
              label="Edit announcement"
              onClick={() => onEdit(announcement)}
            >
              <Pencil size={16} />
            </IconButton>
          </div>
        </div>

        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#9FB2CA]">
          {announcement.message.length > 240
            ? `${announcement.message.slice(0, 240).trimEnd()}…`
            : announcement.message}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={announcement.status} />
          <PriorityBadge priority={announcement.priority} />
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#293D58] bg-[#0E1A2C] p-3 sm:grid-cols-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <Users
              size={15}
              className="mt-0.5 shrink-0 text-[#80BFFF]"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#748BA6]">
                Audience
              </p>
              <p className="mt-1 break-words text-xs font-semibold text-[#C4D4E8]">
                {announcement.audience}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2.5">
            <CalendarDays
              size={15}
              className="mt-0.5 shrink-0 text-[#80BFFF]"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#748BA6]">
                Publishing date
              </p>
              <p className="mt-1 text-xs font-semibold text-[#C4D4E8]">
                {getReadableDate(announcement.publishDate)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2.5">
            <Clock3
              size={15}
              className="mt-0.5 shrink-0 text-[#80BFFF]"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#748BA6]">
                Created
              </p>
              <p className="mt-1 text-xs font-semibold text-[#C4D4E8]">
                {formatDate(announcement.createdAt)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#293D58] pt-4">
          <div className="flex items-center gap-2 text-xs text-[#8299B5]">
            <span className={`h-1.5 w-1.5 rounded-full ${statusStyle.dot}`} />
            <span>{announcement.status}</span>
            <ChevronRight size={12} />
            <span>{announcement.audience}</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onCopy(announcement)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#344A66] bg-[#14253C] px-3 py-2 text-xs font-semibold text-[#B4C7DE] transition hover:bg-[#1B3450] hover:text-white"
            >
              <Copy size={14} />
              Copy
            </button>

            <button
              type="button"
              onClick={() => onToggleStatus(announcement)}
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition ${announcement.status === "Published"
                ? "border-[#5C526B] bg-[#29243A] text-[#D8C9FF] hover:bg-[#352D4D]"
                : "border-[#547DA4] bg-[#80BFFF] text-[#10233D] hover:bg-[#A0D0FF]"
                }`}
            >
              {announcement.status === "Published" ? (
                <>
                  <Eye size={14} />
                  Unpublish
                </>
              ) : (
                <>
                  <Send size={14} />
                  Publish
                </>
              )}
            </button>

            <IconButton
              label="Delete announcement"
              onClick={() => onDelete(announcement)}
              className="border-[#533B47] bg-[#241B2A] text-[#E9A8B9] hover:border-[#805364] hover:bg-[#36202C] hover:text-[#FFCAD8]"
            >
              <Trash2 size={16} />
            </IconButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   ANNOUNCEMENT PREVIEW MODAL
   ========================================================= */

function PreviewModal({ announcement, onClose, onEdit }) {
  return (
    <AnimatePresence>
      {announcement && (
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
            className="my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-[#344A66] bg-[#111F34] shadow-[0_25px_90px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#344A66] bg-[#152740] p-5 sm:p-6">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  <CategoryBadge category={announcement.category} />
                  <StatusBadge status={announcement.status} />
                </div>

                <h2 className="text-xl font-bold leading-7 text-[#EFF6FF]">
                  {announcement.title}
                </h2>
              </div>

              <IconButton label="Close preview" onClick={onClose}>
                <X size={18} />
              </IconButton>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <PriorityBadge priority={announcement.priority} />

                <span className="inline-flex items-center gap-1.5 rounded-full border border-[#344A66] bg-[#14253C] px-3 py-1.5 text-xs font-medium text-[#B6C9DF]">
                  <Users size={13} />
                  {announcement.audience}
                </span>
              </div>

              <div className="rounded-2xl border border-[#293D58] bg-[#0D1A2B] p-4 sm:p-5">
                <p className="whitespace-pre-wrap break-words text-sm leading-7 text-[#C0D0E3]">
                  {announcement.message}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-[#293D58] bg-[#152740] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7F96B1]">
                    Created on
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-[#D7E7F8]">
                    {formatDate(announcement.createdAt)}
                  </p>
                </div>

                <div className="rounded-xl border border-[#293D58] bg-[#152740] p-3">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#7F96B1]">
                    Publishing date
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-[#D7E7F8]">
                    {getReadableDate(announcement.publishDate)}
                  </p>
                </div>
              </div>

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
                  onClick={() => onEdit(announcement)}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#80BFFF] px-5 py-3 text-sm font-bold text-[#10233D] transition hover:bg-[#A0D0FF]"
                >
                  <Pencil size={16} />
                  Edit announcement
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

export default function CollegeAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(loadAnnouncements);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [audienceFilter, setAudienceFilter] = useState("All audiences");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  const [previewAnnouncement, setPreviewAnnouncement] = useState(null);
  const [toast, setToast] = useState("");
  const [activeView, setActiveView] = useState("All");

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(announcements),
      );
    } catch {
      setToast("Unable to save data in browser storage.");
    }
  }, [announcements]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setModalOpen(false);
        setEditingAnnouncement(null);
        setPreviewAnnouncement(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const stats = useMemo(
    () => ({
      total: announcements.length,
      published: announcements.filter(
        (item) => item.status === "Published",
      ).length,
      scheduled: announcements.filter(
        (item) => item.status === "Scheduled",
      ).length,
      drafts: announcements.filter(
        (item) => item.status === "Draft",
      ).length,
    }),
    [announcements],
  );

  const filteredAnnouncements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return announcements
      .filter((item) => {
        const searchable = [
          item.title,
          item.message,
          item.category,
          item.audience,
          item.priority,
          item.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchable.includes(query);

        const matchesCategory =
          categoryFilter === "All categories" ||
          item.category === categoryFilter;

        const matchesStatus =
          statusFilter === "All statuses" ||
          item.status === statusFilter;

        const matchesAudience =
          audienceFilter === "All audiences" ||
          item.audience === audienceFilter;

        const matchesView =
          activeView === "All" ||
          item.status === activeView;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesStatus &&
          matchesAudience &&
          matchesView
        );
      })
      .sort((a, b) => {
        if (Boolean(a.pinned) !== Boolean(b.pinned)) {
          return Number(Boolean(b.pinned)) - Number(Boolean(a.pinned));
        }

        const aDate = a.createdAt || "";
        const bDate = b.createdAt || "";

        return bDate.localeCompare(aDate);
      });
  }, [
    announcements,
    search,
    categoryFilter,
    statusFilter,
    audienceFilter,
    activeView,
  ]);

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "All categories" ||
    statusFilter !== "All statuses" ||
    audienceFilter !== "All audiences" ||
    activeView !== "All";

  function openCreate() {
    setEditingAnnouncement(null);
    setModalOpen(true);
  }

  function openEdit(item) {
    setPreviewAnnouncement(null);
    setEditingAnnouncement(item);
    setModalOpen(true);
  }

  function handleSave(formData) {
    if (editingAnnouncement) {
      setAnnouncements((previous) =>
        previous.map((item) =>
          item.id === editingAnnouncement.id
            ? { ...item, ...formData }
            : item,
        ),
      );

      setToast("Announcement updated successfully.");
    } else {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `announcement-${Date.now()}`;

      const newAnnouncement = {
        id,
        ...formData,
        createdAt: getToday(),
      };

      setAnnouncements((previous) => [
        newAnnouncement,
        ...previous,
      ]);

      setToast("Announcement created successfully.");
    }

    setModalOpen(false);
    setEditingAnnouncement(null);
  }

  function handleDelete(item) {
    const confirmed = window.confirm(
      `Delete "${item.title}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setAnnouncements((previous) =>
      previous.filter((announcement) => announcement.id !== item.id),
    );

    if (previewAnnouncement?.id === item.id) {
      setPreviewAnnouncement(null);
    }

    setToast("Announcement deleted.");
  }

  function handleToggleStatus(item) {
    const nextStatus =
      item.status === "Published" ? "Draft" : "Published";

    setAnnouncements((previous) =>
      previous.map((announcement) =>
        announcement.id === item.id
          ? {
            ...announcement,
            status: nextStatus,
            publishDate:
              nextStatus === "Published"
                ? getToday()
                : announcement.publishDate,
          }
          : announcement,
      ),
    );

    setToast(
      nextStatus === "Published"
        ? "Announcement marked as published."
        : "Announcement moved to drafts.",
    );
  }

  async function copyAnnouncement(item) {
    const text = `${item.title}\n\n${item.message}`;

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(text);
      setToast("Announcement copied to clipboard.");
    } catch {
      setToast("Clipboard access is unavailable in this browser.");
    }
  }

  function exportCSV() {
    if (!filteredAnnouncements.length) {
      setToast("No announcements available to export.");
      return;
    }

    const headers = [
      "Title",
      "Message",
      "Category",
      "Audience",
      "Priority",
      "Status",
      "Publishing Date",
      "Created Date",
      "Pinned",
    ];

    const rows = filteredAnnouncements.map((item) => [
      item.title,
      item.message,
      item.category,
      item.audience,
      item.priority,
      item.status,
      item.publishDate,
      item.createdAt,
      item.pinned ? "Yes" : "No",
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
    anchor.download = "techmentor-announcements.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setToast("Announcements exported successfully.");
  }

  function resetFilters() {
    setSearch("");
    setCategoryFilter("All categories");
    setStatusFilter("All statuses");
    setAudienceFilter("All audiences");
    setActiveView("All");
  }

  const metrics = [
    {
      icon: Megaphone,
      label: "Total announcements",
      value: stats.total,
      note: "All saved announcements",
      tone: "border-[#3A5D83] bg-[#1A3452] text-[#A9D5FF]",
    },
    {
      icon: CheckCircle2,
      label: "Published",
      value: stats.published,
      note: "Currently marked published",
      tone: "border-[#28634F] bg-[#15382F] text-[#8CE0BA]",
    },
    {
      icon: CalendarClock,
      label: "Scheduled",
      value: stats.scheduled,
      note: "Planned for a future date",
      tone: "border-[#6C5632] bg-[#3A2F20] text-[#F2CD8B]",
    },
    {
      icon: FileText,
      label: "Drafts",
      value: stats.drafts,
      note: "Saved but not published",
      tone: "border-[#51477E] bg-[#292442] text-[#CEC5FF]",
    },
  ];

  const views = [
    { label: "All", count: stats.total, icon: LayoutGrid },
    { label: "Published", count: stats.published, icon: CheckCircle2 },
    { label: "Scheduled", count: stats.scheduled, icon: CalendarClock },
    { label: "Draft", count: stats.drafts, icon: FileText },
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
              <Megaphone size={24} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80BFFF]">
                  INSTITUTION
                </span>
                <ChevronRight size={13} className="text-[#607A98]" />
                <span className="text-xs font-medium text-[#94A9C2]">
                  Communication
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FF] sm:text-[30px]">
                Announcements
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#97ADC7]">
                Share institution-wide updates, academic notices and
                important information with the right audience.
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
              Create announcement
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
                <MessageSquareText size={26} strokeWidth={1.7} />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9DCDFF]">
                    COMMUNICATION CENTER
                  </span>

                  <span className="rounded-full border border-[#59718E] bg-[#203C59] px-2 py-0.5 text-[10px] font-semibold text-[#C5DFFF]">
                    Institution updates
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-[#F1F7FF] sm:text-2xl">
                  Keep everyone informed.
                </h2>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#B0C4DB]">
                  Create clear announcements, choose the audience and
                  organize updates from one place.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-[#476482] bg-[#142B45]/80 px-4 py-3.5 md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
                <Bell size={21} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#EFF6FF]">
                  Announcement center
                </p>
                <p className="mt-1 text-xs text-[#9EB6D1]">
                  {stats.published} published notices
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* STATISTICS */}
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

        {/* ANNOUNCEMENT WORKSPACE */}
        <section className="overflow-visible rounded-3xl border border-[#293D58] bg-[#111F34] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col justify-between gap-4 rounded-t-3xl border-b border-[#293D58] p-5 sm:p-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                  <LayoutGrid size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#EAF3FF]">
                  Announcement directory
                </h2>

                <span className="rounded-lg border border-[#395A7D] bg-[#1A3554] px-2 py-1 text-xs font-bold text-[#A9D5FF]">
                  {filteredAnnouncements.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#92A8C2]">
                Manage announcements and review their publishing status.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#395B80] bg-[#193754] px-4 py-2.5 text-sm font-semibold text-[#B9DCFF] transition hover:bg-[#23476D] lg:self-auto"
            >
              <Plus size={17} />
              New announcement
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

          {/* CUSTOM FILTER CONTROLS */}
          <div className="relative z-20 grid grid-cols-1 gap-3 border-b border-[#293D58] bg-[#0E1A2C] p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_210px_200px_220px_auto]">
            <div className="relative min-w-0">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search announcements..."
                className={`${FIELD_CLASS} min-h-[46px] pl-10`}
              />
            </div>

            <PremiumSelect
              value={categoryFilter}
              options={["All categories", ...CATEGORY_OPTIONS]}
              onChange={setCategoryFilter}
              icon={FileText}
            />

            <PremiumSelect
              value={statusFilter}
              options={["All statuses", ...STATUS_OPTIONS]}
              onChange={setStatusFilter}
              icon={Filter}
            />

            <PremiumSelect
              value={audienceFilter}
              options={["All audiences", ...AUDIENCE_OPTIONS]}
              onChange={setAudienceFilter}
              icon={Users}
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

          {/* ANNOUNCEMENT CARDS */}
          <div className="space-y-4 p-4 sm:p-5 lg:p-6">
            {filteredAnnouncements.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredAnnouncements.map((announcement, index) => (
                  <AnnouncementCard
                    key={announcement.id}
                    announcement={announcement}
                    index={index}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onToggleStatus={handleToggleStatus}
                    onCopy={copyAnnouncement}
                    onPreview={setPreviewAnnouncement}
                  />
                ))}
              </AnimatePresence>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#344A66] bg-[#0E1A2C] px-5 py-16 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#344E6C] bg-[#192F49] text-[#A9D5FF]">
                  <Search size={25} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#E2EEFC]">
                  No announcements found
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-[#91A7C0]">
                  Try a different search term or reset your filters. You
                  can also create a new announcement.
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
                    Create announcement
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* DIRECTORY FOOTER */}
          <div className="flex flex-col gap-2 rounded-b-3xl border-t border-[#293D58] bg-[#0E1A2C] px-5 py-4 text-xs text-[#90A6C0] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              Showing{" "}
              <span className="font-bold text-[#E0ECFA]">
                {filteredAnnouncements.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#E0ECFA]">
                {announcements.length}
              </span>{" "}
              announcements
            </p>

            <p className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#80BFFF]" />
              Changes are saved in this browser
            </p>
          </div>
        </section>

        {/* INFORMATION STRIP */}
        <section className="flex flex-col gap-4 rounded-2xl border border-[#2A4563] bg-[#122640] p-5 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
            <Sparkles size={20} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#DFEDFC]">
              Keep announcements organized
            </h3>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[#9BB0C8]">
              Use categories to organize notices, choose the intended audience
              and mark urgent messages with the appropriate priority. Pin
              important announcements to make them easier to find.
            </p>
          </div>
        </section>
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnnouncementModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingAnnouncement(null);
        }}
        onSubmit={handleSave}
        editingAnnouncement={editingAnnouncement}
      />

      {/* PREVIEW MODAL */}
      <PreviewModal
        announcement={previewAnnouncement}
        onClose={() => setPreviewAnnouncement(null)}
        onEdit={openEdit}
      />

      {/* TOAST NOTIFICATIONS */}
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


