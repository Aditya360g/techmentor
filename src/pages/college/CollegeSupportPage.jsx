
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Headset,
  LifeBuoy,
  Search,
  Plus,
  Download,
  Mail,
  UserRound,
  Tag,
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
  Sparkles,
  MessageSquareText,
  Building2,
  Inbox,
  CircleHelp,
  Wrench,
  CreditCard,
  BookOpen,
  GraduationCap,
  ShieldCheck,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react";

/* =========================================================
   COLLEGE SUPPORT CENTER
   Theme: Dark Navy + Ice Blue
   Storage: Browser LocalStorage
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

const STORAGE_KEY = "techmentor-college-support-v1";

const CATEGORY_OPTIONS = [
  "Technical Issue",
  "Account & Access",
  "Courses & Content",
  "Payments",
  "Trainer Support",
  "Student Management",
  "Other",
];

const PRIORITY_OPTIONS = ["Low", "Medium", "High", "Urgent"];

const STATUS_OPTIONS = [
  "Open",
  "In Progress",
  "Waiting",
  "Resolved",
  "Closed",
];

const ASSIGNEE_OPTIONS = [
  "Unassigned",
  "Support Team",
  "Academic Team",
  "Technical Team",
  "Finance Team",
];

const EMPTY_FORM = {
  subject: "",
  message: "",
  requester: "",
  email: "",
  category: "Technical Issue",
  priority: "Medium",
  status: "Open",
  assignee: "Unassigned",
};

const FIELD_CLASS =
  "w-full rounded-xl border border-[#344A66] bg-[#101D30] px-4 py-3 text-sm text-[#EAF3FF] outline-none transition placeholder:text-[#7187A2] focus:border-[#80BFFF] focus:ring-4 focus:ring-[#4B9AE8]/15";

const INITIAL_TICKETS = [
  {
    id: "SUP-1048",
    subject: "Unable to access student dashboard",
    message:
      "Several students have reported that the student dashboard is not opening after login. The page keeps loading and eventually shows an error. Please investigate this issue.",
    requester: "Priya Sharma",
    email: "priya@college.edu",
    category: "Technical Issue",
    priority: "High",
    status: "Open",
    assignee: "Technical Team",
    createdAt: "2026-10-22",
    updatedAt: "2026-10-22",
    replies: [
      {
        id: "reply-1048-1",
        author: "Support Team",
        message:
          "Thank you for reporting the issue. The technical team has been notified.",
        createdAt: "2026-10-22",
      },
    ],
  },
  {
    id: "SUP-1047",
    subject: "Need to update trainer assignment",
    message:
      "Our department needs to change the assigned trainer for the upcoming React batch. Please advise on the correct process.",
    requester: "Rahul Mehta",
    email: "rahul@college.edu",
    category: "Trainer Support",
    priority: "Medium",
    status: "In Progress",
    assignee: "Academic Team",
    createdAt: "2026-10-21",
    updatedAt: "2026-10-23",
    replies: [],
  },
  {
    id: "SUP-1046",
    subject: "Course material missing from a module",
    message:
      "The JavaScript course module does not show the learning material that was shared last week. Please check the course content.",
    requester: "Neha Verma",
    email: "neha@college.edu",
    category: "Courses & Content",
    priority: "Medium",
    status: "Waiting",
    assignee: "Academic Team",
    createdAt: "2026-10-20",
    updatedAt: "2026-10-22",
    replies: [
      {
        id: "reply-1046-1",
        author: "Academic Team",
        message:
          "Please share the exact course and module name so we can verify the missing content.",
        createdAt: "2026-10-22",
      },
    ],
  },
  {
    id: "SUP-1045",
    subject: "Payment receipt clarification",
    message:
      "We need help understanding a payment receipt generated for our recent institutional payment. Please verify the receipt details.",
    requester: "Amit Singh",
    email: "amit@college.edu",
    category: "Payments",
    priority: "Low",
    status: "Resolved",
    assignee: "Finance Team",
    createdAt: "2026-10-18",
    updatedAt: "2026-10-20",
    replies: [
      {
        id: "reply-1045-1",
        author: "Finance Team",
        message:
          "The receipt has been verified. The payment details are correct.",
        createdAt: "2026-10-20",
      },
    ],
  },
  {
    id: "SUP-1044",
    subject: "Faculty member cannot access assigned batch",
    message:
      "A faculty member cannot see an assigned batch after signing in. Please review the account and batch assignment.",
    requester: "Sneha Patel",
    email: "sneha@college.edu",
    category: "Account & Access",
    priority: "Urgent",
    status: "Open",
    assignee: "Technical Team",
    createdAt: "2026-10-17",
    updatedAt: "2026-10-17",
    replies: [],
  },
];

/* =========================================================
   HELPERS
   ========================================================= */

function loadTickets() {
  try {
    if (typeof window === "undefined") return INITIAL_TICKETS;

    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }

    return INITIAL_TICKETS;
  } catch {
    return INITIAL_TICKETS;
  }
}

function getToday() {
  const now = new Date();
  const local = new Date(
    now.getTime() - now.getTimezoneOffset() * 60000,
  );

  return local.toISOString().slice(0, 10);
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

function nextTicketId(tickets) {
  const maxNumber = tickets.reduce((max, ticket) => {
    const match = String(ticket.id).match(/^SUP-(\d+)$/);
    return match ? Math.max(max, Number(match[1])) : max;
  }, 1048);

  return `SUP-${maxNumber + 1}`;
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

function getCategoryIcon(category) {
  const icons = {
    "Technical Issue": Wrench,
    "Account & Access": ShieldCheck,
    "Courses & Content": BookOpen,
    Payments: CreditCard,
    "Trainer Support": GraduationCap,
    "Student Management": UserRound,
    Other: CircleHelp,
  };

  return icons[category] || CircleHelp;
}

function getPriorityStyle(priority) {
  const styles = {
    Low: {
      badge: "border-slate-600 bg-slate-800 text-slate-300",
      dot: "bg-slate-400",
    },
    Medium: {
      badge: "border-[#3A526F] bg-[#1A3048] text-[#B7CBE2]",
      dot: "bg-[#91A9C4]",
    },
    High: {
      badge: "border-[#755A32] bg-[#392D1F] text-[#F4CC89]",
      dot: "bg-[#F1BA54]",
    },
    Urgent: {
      badge: "border-[#784A40] bg-[#3B2628] text-[#FFB4A8]",
      dot: "bg-[#FF8677]",
    },
  };

  return styles[priority] || styles.Medium;
}

function getStatusStyle(status) {
  const styles = {
    Open: {
      badge: "border-[#3A5F86] bg-[#193653] text-[#AED7FF]",
      dot: "bg-[#80BFFF]",
    },
    "In Progress": {
      badge: "border-violet-800 bg-violet-950/50 text-violet-300",
      dot: "bg-violet-400",
    },
    Waiting: {
      badge: "border-amber-800 bg-amber-950/50 text-amber-300",
      dot: "bg-amber-400",
    },
    Resolved: {
      badge: "border-emerald-800 bg-emerald-950/50 text-emerald-300",
      dot: "bg-emerald-400",
    },
    Closed: {
      badge: "border-slate-600 bg-slate-800 text-slate-300",
      dot: "bg-slate-400",
    },
  };

  return styles[status] || styles.Open;
}

function getCategoryStyle(category) {
  const styles = {
    "Technical Issue":
      "border-[#3A5D83] bg-[#1A3452] text-[#A9D5FF]",
    "Account & Access":
      "border-violet-800 bg-violet-950/40 text-violet-300",
    "Courses & Content":
      "border-cyan-800 bg-cyan-950/40 text-cyan-300",
    Payments:
      "border-emerald-800 bg-emerald-950/40 text-emerald-300",
    "Trainer Support":
      "border-amber-800 bg-amber-950/40 text-amber-300",
    "Student Management":
      "border-[#425871] bg-[#1B2D43] text-[#B7CBE2]",
    Other:
      "border-[#425871] bg-[#1B2D43] text-[#B7CBE2]",
  };

  return styles[category] || styles.Other;
}

function isActiveTicket(status) {
  return ["Open", "In Progress", "Waiting"].includes(status);
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

function PriorityBadge({ priority }) {
  const style = getPriorityStyle(priority);

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
      className={`inline-flex items-center rounded-full border px-3 py-1.5 text-xs font-semibold ${getCategoryStyle(category)}`}
    >
      {category}
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
   CUSTOM PREMIUM DROPDOWN
   Native HTML select is intentionally not used.
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
   CREATE / EDIT TICKET MODAL
   ========================================================= */

function TicketFormModal({
  open,
  onClose,
  onSubmit,
  editingTicket,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (editingTicket) {
      setForm({
        subject: editingTicket.subject || "",
        message: editingTicket.message || "",
        requester: editingTicket.requester || "",
        email: editingTicket.email || "",
        category: editingTicket.category || CATEGORY_OPTIONS[0],
        priority: editingTicket.priority || "Medium",
        status: editingTicket.status || "Open",
        assignee: editingTicket.assignee || "Unassigned",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setError("");
  }, [open, editingTicket]);

  function updateField(field, value) {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const subject = form.subject.trim();
    const message = form.message.trim();
    const requester = form.requester.trim();
    const email = form.email.trim().toLowerCase();

    if (!subject || !message || !requester || !email) {
      setError("Please fill in all required fields.");
      return;
    }

    if (subject.length < 5) {
      setError("The subject must contain at least 5 characters.");
      return;
    }

    if (message.length < 10) {
      setError("Please provide a little more detail about the issue.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    onSubmit({
      ...form,
      subject,
      message,
      requester,
      email,
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
                    {editingTicket ? (
                      <Pencil size={21} />
                    ) : (
                      <LifeBuoy size={21} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#EFF6FF]">
                      {editingTicket ? "Edit support ticket" : "Create support ticket"}
                    </h2>
                    <p className="mt-1 max-w-sm text-sm leading-5 text-[#97ADC7]">
                      {editingTicket
                        ? "Update ticket details, priority and assignment."
                        : "Record a support request and assign it to the right team."}
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
                  Ticket subject <span className="text-red-400">*</span>
                </label>

                <input
                  autoFocus
                  value={form.subject}
                  onChange={(event) =>
                    updateField("subject", event.target.value)
                  }
                  placeholder="Briefly describe the issue"
                  maxLength={160}
                  required
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Issue description <span className="text-red-400">*</span>
                </label>

                <textarea
                  value={form.message}
                  onChange={(event) =>
                    updateField("message", event.target.value)
                  }
                  placeholder="Explain the problem, expected outcome and relevant details..."
                  rows={5}
                  maxLength={5000}
                  required
                  className={`${FIELD_CLASS} min-h-[130px] resize-y leading-6`}
                />
                <p className="mt-1.5 text-right text-[11px] text-[#7187A2]">
                  {form.message.length}/5000 characters
                </p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Requester name <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.requester}
                    onChange={(event) =>
                      updateField("requester", event.target.value)
                    }
                    placeholder="Full name"
                    maxLength={100}
                    required
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Requester email <span className="text-red-400">*</span>
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) =>
                      updateField("email", event.target.value)
                    }
                    placeholder="name@college.edu"
                    maxLength={254}
                    required
                    className={FIELD_CLASS}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Category
                  </label>
                  <PremiumSelect
                    value={form.category}
                    options={CATEGORY_OPTIONS}
                    onChange={(value) => updateField("category", value)}
                    icon={Tag}
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
                    Assign to
                  </label>
                  <PremiumSelect
                    value={form.assignee}
                    options={ASSIGNEE_OPTIONS}
                    onChange={(value) => updateField("assignee", value)}
                    icon={UserRound}
                  />
                </div>

                {editingTicket && (
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                      Ticket status
                    </label>
                    <PremiumSelect
                      value={form.status}
                      options={STATUS_OPTIONS}
                      onChange={(value) => updateField("status", value)}
                      icon={CheckCircle2}
                    />
                  </div>
                )}
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
                  {editingTicket ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Plus size={17} />
                  )}
                  {editingTicket ? "Save changes" : "Create ticket"}
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
   TICKET DETAILS + REPLY MODAL
   ========================================================= */

function TicketDetailsModal({
  ticket,
  onClose,
  onReply,
  onStatusChange,
}) {
  const [reply, setReply] = useState("");
  const [replyError, setReplyError] = useState("");

  useEffect(() => {
    setReply("");
    setReplyError("");
  }, [ticket?.id]);

  if (!ticket) return null;

  const CategoryIcon = getCategoryIcon(ticket.category);

  function submitReply(event) {
    event.preventDefault();

    const message = reply.trim();

    if (!message) {
      setReplyError("Write a reply before submitting.");
      return;
    }

    onReply(ticket.id, message);
    setReply("");
    setReplyError("");
  }

  return (
    <AnimatePresence>
      {ticket && (
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
            className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-[#344A66] bg-[#111F34] shadow-[0_25px_90px_rgba(0,0,0,0.6)]"
          >
            <div className="flex items-start justify-between gap-4 border-b border-[#344A66] bg-gradient-to-r from-[#172B46] to-[#1A3655] p-5 sm:p-6">
              <div className="flex min-w-0 items-start gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#52749B] bg-[#1B3A5B] text-[#A9D5FF]">
                  <CategoryIcon size={20} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="text-xs font-bold tracking-wider text-[#80BFFF]">
                      {ticket.id}
                    </span>
                    <StatusBadge status={ticket.status} />
                  </div>

                  <h2 className="break-words text-lg font-bold leading-6 text-[#EFF6FF] sm:text-xl">
                    {ticket.subject}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close details"
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#344A66] bg-[#14253C] text-[#A7BBD2] transition hover:bg-[#1A3555] hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[calc(100dvh-170px)] space-y-5 overflow-y-auto p-5 sm:p-6">
              <div className="flex flex-wrap gap-2">
                <CategoryBadge category={ticket.category} />
                <PriorityBadge priority={ticket.priority} />
              </div>

              <section className="rounded-2xl border border-[#293D58] bg-[#0D1A2B] p-4 sm:p-5">
                <h3 className="text-sm font-bold text-[#DCEBFC]">
                  Issue description
                </h3>
                <p className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-[#B5C7DC]">
                  {ticket.message}
                </p>
              </section>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-[#293D58] bg-[#152740] p-4">
                  <div className="flex items-center gap-2 text-[#80BFFF]">
                    <UserRound size={16} />
                    <span className="text-xs font-semibold text-[#8FA6C1]">
                      REQUESTER
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#E0ECFA]">
                    {ticket.requester}
                  </p>
                  <p className="mt-1 break-all text-xs text-[#92A8C2]">
                    {ticket.email}
                  </p>
                </div>

                <div className="rounded-xl border border-[#293D58] bg-[#152740] p-4">
                  <div className="flex items-center gap-2 text-[#80BFFF]">
                    <Building2 size={16} />
                    <span className="text-xs font-semibold text-[#8FA6C1]">
                      ASSIGNED TEAM
                    </span>
                  </div>

                  <p className="mt-2 text-sm font-bold text-[#E0ECFA]">
                    {ticket.assignee}
                  </p>
                  <p className="mt-1 text-xs text-[#92A8C2]">
                    Created {formatDate(ticket.createdAt)}
                  </p>
                </div>
              </div>

              <section className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h3 className="flex items-center gap-2 text-sm font-bold text-[#E3EFFD]">
                    <MessageSquareText size={17} className="text-[#80BFFF]" />
                    Conversation
                  </h3>
                  <span className="text-xs text-[#859BB5]">
                    {(ticket.replies || []).length} replies
                  </span>
                </div>

                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#3A587A] bg-[#1A3452] text-[#ADD5FF]">
                      <UserRound size={16} />
                    </div>

                    <div className="min-w-0 flex-1 rounded-2xl border border-[#2E435E] bg-[#152740] p-4">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-sm font-bold text-[#DFECFC]">
                          {ticket.requester}
                        </p>
                        <span className="text-[10px] text-[#8299B5]">
                          {formatDate(ticket.createdAt)}
                        </span>
                      </div>
                      <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#AABED5]">
                        {ticket.message}
                      </p>
                    </div>
                  </div>

                  {(ticket.replies || []).map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#28634F] bg-[#15382F] text-[#8CE0BA]">
                        <Headset size={16} />
                      </div>

                      <div className="min-w-0 flex-1 rounded-2xl border border-[#28513F] bg-[#102A28] p-4">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <p className="text-sm font-bold text-[#C9F2DE]">
                            {item.author || "Support Team"}
                          </p>
                          <span className="text-[10px] text-[#85AE9B]">
                            {formatDate(item.createdAt)}
                          </span>
                        </div>
                        <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-[#B1D6C5]">
                          {item.message}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <form
                onSubmit={submitReply}
                className="space-y-3 rounded-2xl border border-[#344A66] bg-[#14243A] p-4"
              >
                <label className="block text-sm font-semibold text-[#D4E2F2]">
                  Add support reply
                </label>

                <textarea
                  value={reply}
                  onChange={(event) => {
                    setReply(event.target.value);
                    setReplyError("");
                  }}
                  rows={3}
                  maxLength={3000}
                  placeholder="Write an update or response..."
                  className={`${FIELD_CLASS} resize-y leading-6`}
                />

                {replyError && (
                  <p className="text-xs text-red-300">{replyError}</p>
                )}

                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-[#7F96B1]">
                    Reply is saved locally with this ticket.
                  </p>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#80BFFF] px-4 py-2.5 text-sm font-bold text-[#10233D] transition hover:bg-[#A0D0FF]"
                  >
                    <Send size={15} />
                    Add reply
                  </button>
                </div>
              </form>

              <div className="flex flex-col gap-3 border-t border-[#293D58] pt-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold text-[#91A7C0]">
                    CHANGE TICKET STATUS
                  </p>
                  <p className="mt-1 text-xs text-[#7187A2]">
                    Update the current ticket state.
                  </p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {ticket.status !== "Resolved" &&
                    ticket.status !== "Closed" && (
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(ticket.id, "Resolved")
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-800 bg-emerald-950/50 px-4 py-2.5 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-950"
                      >
                        <CheckCircle2 size={16} />
                        Mark resolved
                      </button>
                    )}

                  {(ticket.status === "Resolved" ||
                    ticket.status === "Closed") && (
                      <button
                        type="button"
                        onClick={() => onStatusChange(ticket.id, "Open")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#426688] bg-[#193653] px-4 py-2.5 text-sm font-semibold text-[#B9DCFF] transition hover:bg-[#23466A]"
                      >
                        <RotateCcw size={15} />
                        Reopen ticket
                      </button>
                    )}
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   TICKET CARD
   ========================================================= */

function TicketCard({
  ticket,
  index,
  onView,
  onEdit,
  onDelete,
  onCopy,
  onStatusChange,
}) {
  const CategoryIcon = getCategoryIcon(ticket.category);

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6, scale: 0.99 }}
      transition={{
        duration: 0.2,
        delay: Math.min(index * 0.025, 0.15),
      }}
      className="group overflow-visible rounded-2xl border border-[#293D58] bg-[#111F34] p-5 shadow-sm transition duration-300 hover:border-[#42658B] hover:bg-[#14243A] sm:p-6"
    >
      <div className="flex flex-col gap-4">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#344E6C] bg-[#19304A] text-[#A9D5FF]">
              <CategoryIcon size={21} />
            </div>

            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold tracking-wider text-[#80BFFF]">
                  {ticket.id}
                </span>
                <CategoryBadge category={ticket.category} />
              </div>

              <h3 className="break-words text-base font-bold leading-6 text-[#EAF3FF] sm:text-lg">
                {ticket.subject}
              </h3>

              <p className="mt-1.5 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#8299B5]">
                <span className="inline-flex items-center gap-1.5">
                  <UserRound size={12} />
                  {ticket.requester}
                </span>
                <span className="hidden text-[#425771] sm:inline">•</span>
                <span>{ticket.email}</span>
              </p>
            </div>
          </div>

          <IconButton
            label="View ticket details"
            onClick={() => onView(ticket.id)}
          >
            <Eye size={17} />
          </IconButton>
        </div>

        <p className="whitespace-pre-wrap break-words text-sm leading-6 text-[#9FB2CA]">
          {ticket.message.length > 220
            ? `${ticket.message.slice(0, 220).trimEnd()}…`
            : ticket.message}
        </p>

        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={ticket.status} />
          <PriorityBadge priority={ticket.priority} />
        </div>

        <div className="grid grid-cols-1 gap-3 rounded-xl border border-[#293D58] bg-[#0E1A2C] p-3 sm:grid-cols-3">
          <div className="flex min-w-0 items-start gap-2.5">
            <UserRound
              size={15}
              className="mt-0.5 shrink-0 text-[#80BFFF]"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#748BA6]">
                Assigned team
              </p>
              <p className="mt-1 break-words text-xs font-semibold text-[#C4D4E8]">
                {ticket.assignee || "Unassigned"}
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
                Created
              </p>
              <p className="mt-1 text-xs font-semibold text-[#C4D4E8]">
                {formatDate(ticket.createdAt)}
              </p>
            </div>
          </div>

          <div className="flex min-w-0 items-start gap-2.5">
            <MessageSquareText
              size={15}
              className="mt-0.5 shrink-0 text-[#80BFFF]"
            />
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#748BA6]">
                Conversation
              </p>
              <p className="mt-1 text-xs font-semibold text-[#C4D4E8]">
                {(ticket.replies || []).length} replies
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#293D58] pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs text-[#8299B5]">
            <Clock3 size={13} />
            Updated {formatDate(ticket.updatedAt || ticket.createdAt)}
          </span>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => onView(ticket.id)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#344A66] bg-[#14253C] px-3 py-2 text-xs font-semibold text-[#B4C7DE] transition hover:bg-[#1B3450] hover:text-white"
            >
              <Eye size={14} />
              Details
            </button>

            <button
              type="button"
              onClick={() => onEdit(ticket)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#344A66] bg-[#14253C] px-3 py-2 text-xs font-semibold text-[#B4C7DE] transition hover:bg-[#1B3450] hover:text-white"
            >
              <Pencil size={14} />
              Edit
            </button>

            <IconButton
              label="Copy ticket details"
              onClick={() => onCopy(ticket)}
            >
              <Copy size={15} />
            </IconButton>

            {isActiveTicket(ticket.status) && (
              <button
                type="button"
                onClick={() => onStatusChange(ticket.id, "Resolved")}
                className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-800 bg-emerald-950/50 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-950"
              >
                <CheckCircle2 size={14} />
                Resolve
              </button>
            )}

            <IconButton
              label="Delete ticket"
              onClick={() => onDelete(ticket)}
              className="border-[#533B47] bg-[#241B2A] text-[#E9A8B9] hover:border-[#805364] hover:bg-[#36202C] hover:text-[#FFCAD8]"
            >
              <Trash2 size={15} />
            </IconButton>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN SUPPORT PAGE
   ========================================================= */

export default function CollegeSupportPage() {
  const [tickets, setTickets] = useState(loadTickets);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All categories");
  const [priorityFilter, setPriorityFilter] = useState("All priorities");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [assigneeFilter, setAssigneeFilter] = useState("All teams");
  const [activeView, setActiveView] = useState("All");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTicketId, setEditingTicketId] = useState(null);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch {
      setToast("Unable to save support data in browser storage.");
    }
  }, [tickets]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setModalOpen(false);
        setEditingTicketId(null);
        setSelectedTicketId(null);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const stats = useMemo(() => {
    const active = tickets.filter((ticket) =>
      isActiveTicket(ticket.status),
    ).length;

    const urgent = tickets.filter(
      (ticket) =>
        ticket.priority === "Urgent" &&
        isActiveTicket(ticket.status),
    ).length;

    const resolved = tickets.filter(
      (ticket) =>
        ticket.status === "Resolved" || ticket.status === "Closed",
    ).length;

    return {
      total: tickets.length,
      active,
      urgent,
      resolved,
    };
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const query = search.trim().toLowerCase();

    return tickets
      .filter((ticket) => {
        const searchable = [
          ticket.id,
          ticket.subject,
          ticket.message,
          ticket.requester,
          ticket.email,
          ticket.category,
          ticket.priority,
          ticket.status,
          ticket.assignee,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        const matchesSearch = searchable.includes(query);

        const matchesCategory =
          categoryFilter === "All categories" ||
          ticket.category === categoryFilter;

        const matchesPriority =
          priorityFilter === "All priorities" ||
          ticket.priority === priorityFilter;

        const matchesStatus =
          statusFilter === "All statuses" ||
          ticket.status === statusFilter;

        const matchesAssignee =
          assigneeFilter === "All teams" ||
          ticket.assignee === assigneeFilter;

        const matchesView =
          activeView === "All" ||
          (activeView === "Active"
            ? isActiveTicket(ticket.status)
            : ticket.status === activeView);

        return (
          matchesSearch &&
          matchesCategory &&
          matchesPriority &&
          matchesStatus &&
          matchesAssignee &&
          matchesView
        );
      })
      .sort((a, b) => {
        const aActive = isActiveTicket(a.status);
        const bActive = isActiveTicket(b.status);

        if (aActive !== bActive) {
          return Number(bActive) - Number(aActive);
        }

        const priorityRank = {
          Urgent: 4,
          High: 3,
          Medium: 2,
          Low: 1,
        };

        const priorityDifference =
          (priorityRank[b.priority] || 0) -
          (priorityRank[a.priority] || 0);

        if (priorityDifference !== 0) return priorityDifference;

        return String(b.updatedAt || b.createdAt).localeCompare(
          String(a.updatedAt || a.createdAt),
        );
      });
  }, [
    tickets,
    search,
    categoryFilter,
    priorityFilter,
    statusFilter,
    assigneeFilter,
    activeView,
  ]);

  const editingTicket = tickets.find(
    (ticket) => ticket.id === editingTicketId,
  );

  const selectedTicket = tickets.find(
    (ticket) => ticket.id === selectedTicketId,
  );

  function openCreate() {
    setEditingTicketId(null);
    setModalOpen(true);
  }

  function openEdit(ticket) {
    setSelectedTicketId(null);
    setEditingTicketId(ticket.id);
    setModalOpen(true);
  }

  function handleSave(formData) {
    if (editingTicketId) {
      setTickets((previous) =>
        previous.map((ticket) =>
          ticket.id === editingTicketId
            ? {
              ...ticket,
              ...formData,
              updatedAt: getToday(),
            }
            : ticket,
        ),
      );

      setToast("Support ticket updated successfully.");
    } else {
      const id = nextTicketId(tickets);

      setTickets((previous) => [
        {
          id,
          ...formData,
          createdAt: getToday(),
          updatedAt: getToday(),
          replies: [],
        },
        ...previous,
      ]);

      setToast(`Ticket ${id} created successfully.`);
    }

    setModalOpen(false);
    setEditingTicketId(null);
  }

  function handleDelete(ticket) {
    const confirmed = window.confirm(
      `Delete ${ticket.id} — "${ticket.subject}"?`,
    );

    if (!confirmed) return;

    setTickets((previous) =>
      previous.filter((item) => item.id !== ticket.id),
    );

    if (selectedTicketId === ticket.id) {
      setSelectedTicketId(null);
    }

    setToast(`${ticket.id} deleted successfully.`);
  }

  function handleStatusChange(ticketId, status) {
    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id === ticketId
          ? {
            ...ticket,
            status,
            updatedAt: getToday(),
          }
          : ticket,
      ),
    );

    setToast(`Ticket status changed to ${status}.`);
  }

  function handleReply(ticketId, message) {
    const replyItem = {
      id:
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `reply-${Date.now()}`,
      author: "Support Team",
      message,
      createdAt: getToday(),
    };

    setTickets((previous) =>
      previous.map((ticket) =>
        ticket.id === ticketId
          ? {
            ...ticket,
            replies: [...(ticket.replies || []), replyItem],
            updatedAt: getToday(),
          }
          : ticket,
      ),
    );

    setToast("Reply added successfully.");
  }

  async function copyTicket(ticket) {
    const text = [
      `Ticket: ${ticket.id}`,
      `Subject: ${ticket.subject}`,
      `Requester: ${ticket.requester}`,
      `Email: ${ticket.email}`,
      `Category: ${ticket.category}`,
      `Priority: ${ticket.priority}`,
      `Status: ${ticket.status}`,
      `Assigned team: ${ticket.assignee}`,
      "",
      ticket.message,
    ].join("\n");

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(text);
      setToast("Ticket details copied.");
    } catch {
      setToast("Clipboard access is unavailable in this browser.");
    }
  }

  function exportCSV() {
    if (!filteredTickets.length) {
      setToast("There are no tickets available to export.");
      return;
    }

    const headers = [
      "Ticket ID",
      "Subject",
      "Description",
      "Requester",
      "Email",
      "Category",
      "Priority",
      "Status",
      "Assigned Team",
      "Created Date",
      "Updated Date",
      "Replies",
    ];

    const rows = filteredTickets.map((ticket) => [
      ticket.id,
      ticket.subject,
      ticket.message,
      ticket.requester,
      ticket.email,
      ticket.category,
      ticket.priority,
      ticket.status,
      ticket.assignee,
      ticket.createdAt,
      ticket.updatedAt,
      (ticket.replies || []).length,
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
    anchor.download = "techmentor-support-tickets.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    setToast("Support tickets exported successfully.");
  }

  function resetFilters() {
    setSearch("");
    setCategoryFilter("All categories");
    setPriorityFilter("All priorities");
    setStatusFilter("All statuses");
    setAssigneeFilter("All teams");
    setActiveView("All");
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    categoryFilter !== "All categories" ||
    priorityFilter !== "All priorities" ||
    statusFilter !== "All statuses" ||
    assigneeFilter !== "All teams" ||
    activeView !== "All";

  const metrics = [
    {
      icon: Inbox,
      label: "Total tickets",
      value: stats.total,
      note: "All support requests",
      tone: "border-[#3A5D83] bg-[#1A3452] text-[#A9D5FF]",
    },
    {
      icon: Clock3,
      label: "Active tickets",
      value: stats.active,
      note: "Open, in progress or waiting",
      tone: "border-[#365B85] bg-[#193653] text-[#A8D5FF]",
    },
    {
      icon: AlertCircle,
      label: "Urgent tickets",
      value: stats.urgent,
      note: "Urgent issues not yet resolved",
      tone: "border-[#784A40] bg-[#3B2628] text-[#FFB4A8]",
    },
    {
      icon: CheckCircle2,
      label: "Resolved tickets",
      value: stats.resolved,
      note: "Resolved or closed requests",
      tone: "border-[#28634F] bg-[#15382F] text-[#8CE0BA]",
    },
  ];

  const views = [
    { label: "All", count: stats.total, icon: Inbox },
    { label: "Active", count: stats.active, icon: Clock3 },
    {
      label: "Open",
      count: tickets.filter((item) => item.status === "Open").length,
      icon: AlertCircle,
    },
    {
      label: "In Progress",
      count: tickets.filter((item) => item.status === "In Progress").length,
      icon: Wrench,
    },
    {
      label: "Resolved",
      count: tickets.filter(
        (item) => item.status === "Resolved" || item.status === "Closed",
      ).length,
      icon: CheckCircle2,
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
              <Headset size={24} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80BFFF]">
                  INSTITUTION
                </span>
                <ChevronRight size={13} className="text-[#607A98]" />
                <span className="text-xs font-medium text-[#94A9C2]">
                  Help & support
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FF] sm:text-[30px]">
                Support Center
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#97ADC7]">
                Manage help requests, track resolutions and coordinate
                support across your institution.
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
              Create ticket
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
                <LifeBuoy size={27} strokeWidth={1.7} />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9DCDFF]">
                    SUPPORT OPERATIONS
                  </span>

                  <span className="rounded-full border border-[#59718E] bg-[#203C59] px-2 py-0.5 text-[10px] font-semibold text-[#C5DFFF]">
                    Help desk
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-[#F1F7FF] sm:text-2xl">
                  Every issue deserves a solution.
                </h2>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#B0C4DB]">
                  Track incoming requests, prioritize urgent issues and keep
                  every support conversation organized.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-[#476482] bg-[#142B45]/80 px-4 py-3.5 md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#EFF6FF]">
                  Support workspace
                </p>
                <p className="mt-1 text-xs text-[#9EB6D1]">
                  Ticket management
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

        {/* TICKET DIRECTORY */}
        <section className="overflow-visible rounded-3xl border border-[#293D58] bg-[#111F34] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col justify-between gap-4 rounded-t-3xl border-b border-[#293D58] p-5 sm:p-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                  <Inbox size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#EAF3FF]">
                  Support tickets
                </h2>

                <span className="rounded-lg border border-[#395A7D] bg-[#1A3554] px-2 py-1 text-xs font-bold text-[#A9D5FF]">
                  {filteredTickets.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#92A8C2]">
                Review incoming requests and monitor their current status.
              </p>
            </div>

            <button
              type="button"
              onClick={openCreate}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#395B80] bg-[#193754] px-4 py-2.5 text-sm font-semibold text-[#B9DCFF] transition hover:bg-[#23476D] lg:self-auto"
            >
              <Plus size={17} />
              New ticket
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
          <div className="relative z-20 grid grid-cols-1 gap-3 border-b border-[#293D58] bg-[#0E1A2C] p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_205px_180px_195px_195px_auto]">
            <div className="relative min-w-0">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search ID, subject, requester..."
                className={`${FIELD_CLASS} min-h-[46px] pl-10`}
              />
            </div>

            <PremiumSelect
              value={categoryFilter}
              options={["All categories", ...CATEGORY_OPTIONS]}
              onChange={setCategoryFilter}
              icon={Tag}
            />

            <PremiumSelect
              value={priorityFilter}
              options={["All priorities", ...PRIORITY_OPTIONS]}
              onChange={setPriorityFilter}
              icon={AlertCircle}
            />

            <PremiumSelect
              value={statusFilter}
              options={["All statuses", ...STATUS_OPTIONS]}
              onChange={setStatusFilter}
              icon={Filter}
            />

            <PremiumSelect
              value={assigneeFilter}
              options={["All teams", ...ASSIGNEE_OPTIONS]}
              onChange={setAssigneeFilter}
              icon={UserRound}
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

          {/* TICKET CARDS */}
          <div className="space-y-4 p-4 sm:p-5 lg:p-6">
            {filteredTickets.length > 0 ? (
              <AnimatePresence mode="popLayout">
                {filteredTickets.map((ticket, index) => (
                  <TicketCard
                    key={ticket.id}
                    ticket={ticket}
                    index={index}
                    onView={setSelectedTicketId}
                    onEdit={openEdit}
                    onDelete={handleDelete}
                    onCopy={copyTicket}
                    onStatusChange={handleStatusChange}
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
                  No support tickets found
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-[#91A7C0]">
                  Try different search terms or reset your filters. You can
                  also create a new support ticket.
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
                    Create ticket
                  </button>
                </div>
              </motion.div>
            )}
          </div>

          {/* FOOTER */}
          <div className="flex flex-col gap-2 rounded-b-3xl border-t border-[#293D58] bg-[#0E1A2C] px-5 py-4 text-xs text-[#90A6C0] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              Showing{" "}
              <span className="font-bold text-[#E0ECFA]">
                {filteredTickets.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#E0ECFA]">
                {tickets.length}
              </span>{" "}
              tickets
            </p>

            <p className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#80BFFF]" />
              Ticket data saved in this browser
            </p>
          </div>
        </section>

        {/* SUPPORT INFORMATION */}
        <section className="flex flex-col gap-4 rounded-2xl border border-[#2A4563] bg-[#122640] p-5 sm:flex-row sm:items-start">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
            <Sparkles size={20} />
          </div>

          <div>
            <h3 className="text-sm font-bold text-[#DFEDFC]">
              A clearer support workflow
            </h3>

            <p className="mt-1.5 max-w-3xl text-sm leading-6 text-[#9BB0C8]">
              Categorize requests, assign the responsible team, set priority,
              add replies and track each ticket through resolution. Urgent
              active tickets appear near the top of the directory.
            </p>
          </div>
        </section>
      </div>

      {/* CREATE / EDIT MODAL */}
      <TicketFormModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingTicketId(null);
        }}
        onSubmit={handleSave}
        editingTicket={editingTicket}
      />

      {/* TICKET DETAILS MODAL */}
      <TicketDetailsModal
        ticket={selectedTicket}
        onClose={() => setSelectedTicketId(null)}
        onReply={handleReply}
        onStatusChange={handleStatusChange}
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
