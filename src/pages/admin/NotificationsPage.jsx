import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  AlertCircle,
  ArrowDownUp,
  Bell,
  BellRing,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Download,
  Eye,
  FileText,
  MessageSquareText,
  Pencil,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Trash2,
  Users,
  X,
  Zap,
} from "lucide-react";

/* =========================================================
   CODEFACULTY — ADMIN NOTIFICATIONS
   Premium Orange + White Theme
   Stable pagination + modal scrolling
========================================================= */

const STORAGE_KEY = "codefaculty_admin_notifications_v3";
const PAGE_SIZE = 7;

const CATEGORIES = [
  "System Update",
  "Academic",
  "Course Update",
  "Trainer Announcement",
  "Placement",
  "Payment",
  "Maintenance",
  "General",
];

const AUDIENCES = [
  "All Users",
  "Students",
  "Trainers",
  "Colleges",
  "Administrators",
];

const PRIORITIES = ["High", "Normal", "Low"];
const DELIVERY_STATUSES = ["Published", "Scheduled", "Draft"];

const CHANNELS = [
  "In-app",
  "Email",
  "Push Notification",
  "In-app + Email",
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Title: A to Z", value: "title-asc" },
  { label: "Title: Z to A", value: "title-desc" },
  { label: "Highest priority", value: "priority-desc" },
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "NT-3001",
    title: "Platform Maintenance Advisory",
    message:
      "CodeFaculty will undergo scheduled platform maintenance. Please save ongoing work before the maintenance window begins. Some features may be temporarily unavailable.",
    category: "Maintenance",
    audience: "All Users",
    priority: "High",
    channel: "In-app + Email",
    status: "Published",
    createdAt: "2026-10-25T10:30",
    scheduledAt: "",
    sentCount: 1240,
    readCount: 984,
    createdBy: "Admin",
  },
  {
    id: "NT-3002",
    title: "New AI & Data Science Learning Track",
    message:
      "A new AI and Data Science learning track is available. Explore Python, machine learning, practical projects and guided learning resources through your dashboard.",
    category: "Course Update",
    audience: "Students",
    priority: "Normal",
    channel: "In-app",
    status: "Published",
    createdAt: "2026-10-24T12:15",
    scheduledAt: "",
    sentCount: 850,
    readCount: 612,
    createdBy: "Admin",
  },
  {
    id: "NT-3003",
    title: "Trainer Profile Verification",
    message:
      "Trainers with pending profile verification should review their contact information, qualifications and expertise details in the trainer dashboard.",
    category: "Trainer Announcement",
    audience: "Trainers",
    priority: "High",
    channel: "In-app + Email",
    status: "Published",
    createdAt: "2026-10-23T09:45",
    scheduledAt: "",
    sentCount: 168,
    readCount: 151,
    createdBy: "Admin",
  },
  {
    id: "NT-3004",
    title: "Placement Preparation Webinar",
    message:
      "Register for the upcoming placement preparation webinar covering interview strategy, project presentation and resume improvement.",
    category: "Placement",
    audience: "Students",
    priority: "Normal",
    channel: "Email",
    status: "Scheduled",
    createdAt: "2026-10-22T11:00",
    scheduledAt: "2026-11-03T10:00",
    sentCount: 0,
    readCount: 0,
    createdBy: "Admin",
  },
  {
    id: "NT-3005",
    title: "College Partnership Review",
    message:
      "College administrators should review their institution profile and update academic coordinators, program information and student enrollment details.",
    category: "Academic",
    audience: "Colleges",
    priority: "Normal",
    channel: "In-app",
    status: "Published",
    createdAt: "2026-10-21T14:30",
    scheduledAt: "",
    sentCount: 42,
    readCount: 37,
    createdBy: "Admin",
  },
  {
    id: "NT-3006",
    title: "Payment Report Review",
    message:
      "The monthly payment summary is ready for administrative review. Verify outstanding invoices and reconcile pending transactions before finalizing reports.",
    category: "Payment",
    audience: "Administrators",
    priority: "High",
    channel: "In-app",
    status: "Draft",
    createdAt: "2026-10-20T16:20",
    scheduledAt: "",
    sentCount: 0,
    readCount: 0,
    createdBy: "Admin",
  },
  {
    id: "NT-3007",
    title: "Course Schedule Update",
    message:
      "A course schedule has been updated. Learners should review their upcoming sessions and check the dashboard for the latest timetable.",
    category: "Academic",
    audience: "Students",
    priority: "Normal",
    channel: "In-app",
    status: "Published",
    createdAt: "2026-10-19T08:30",
    scheduledAt: "",
    sentCount: 920,
    readCount: 740,
    createdBy: "Admin",
  },
  {
    id: "NT-3008",
    title: "New Trainer Orientation",
    message:
      "New trainers are invited to review the platform orientation material, assignment workflow and session management guidelines.",
    category: "Trainer Announcement",
    audience: "Trainers",
    priority: "Low",
    channel: "In-app",
    status: "Scheduled",
    createdAt: "2026-10-18T13:00",
    scheduledAt: "2026-11-06T11:00",
    sentCount: 0,
    readCount: 0,
    createdBy: "Admin",
  },
  {
    id: "NT-3009",
    title: "Platform Policy Reminder",
    message:
      "Please review the current platform usage guidelines and ensure that account information and professional profiles remain accurate.",
    category: "General",
    audience: "All Users",
    priority: "Low",
    channel: "Push Notification",
    status: "Published",
    createdAt: "2026-10-17T15:40",
    scheduledAt: "",
    sentCount: 1240,
    readCount: 1060,
    createdBy: "Admin",
  },
  {
    id: "NT-3010",
    title: "Assessment Window Announcement",
    message:
      "The upcoming assessment window is being prepared. Students should review the course materials and confirm their assessment schedule.",
    category: "Academic",
    audience: "Students",
    priority: "Normal",
    channel: "In-app",
    status: "Draft",
    createdAt: "2026-10-16T10:15",
    scheduledAt: "",
    sentCount: 0,
    readCount: 0,
    createdBy: "Admin",
  },
];

const EMPTY_FORM = {
  title: "",
  message: "",
  category: "General",
  audience: "All Users",
  priority: "Normal",
  channel: "In-app",
  status: "Draft",
  scheduledAt: "",
};

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
}

function escapeCSV(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function getPriorityRank(priority) {
  return { High: 3, Normal: 2, Low: 1 }[priority] || 0;
}

function getReadPercentage(item) {
  const sent = Number(item?.sentCount || 0);
  const read = Number(item?.readCount || 0);

  return sent ? Math.min(100, Math.round((read / sent) * 100)) : 0;
}

/* =========================================================
   SCROLLBAR STYLES
========================================================= */

function PremiumStyles() {
  return (
    <style>{`
      .notifications-admin-page {
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .notifications-admin-page *,
      .notifications-premium-menu {
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .notifications-admin-page ::-webkit-scrollbar,
      .notifications-premium-menu::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .notifications-admin-page ::-webkit-scrollbar-track,
      .notifications-premium-menu::-webkit-scrollbar-track {
        background: #fff7f3;
        border-radius: 999px;
      }

      .notifications-admin-page ::-webkit-scrollbar-thumb,
      .notifications-premium-menu::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #f5b39f, #f4512b);
        border: 2px solid #fff7f3;
        border-radius: 999px;
      }

      .notifications-admin-page ::-webkit-scrollbar-thumb:hover,
      .notifications-premium-menu::-webkit-scrollbar-thumb:hover {
        background: #df3f1b;
      }

      .notifications-premium-menu {
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      .notifications-table-scroll {
        overflow-x: auto;
        overscroll-behavior-x: contain;
        -webkit-overflow-scrolling: touch;
      }

      .notifications-admin-page input,
      .notifications-admin-page textarea {
        color: #1e293b;
      }

      .notifications-admin-page input::placeholder,
      .notifications-admin-page textarea::placeholder {
        color: #94a3b8;
        opacity: 1;
      }

      @media (prefers-reduced-motion: reduce) {
        .notifications-admin-page *,
        .notifications-admin-page *::before,
        .notifications-admin-page *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}

/* =========================================================
   PREMIUM CUSTOM DROPDOWN
========================================================= */

function PremiumDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  searchable,
  disabled = false,
  className = "",
}) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);
  const searchRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [position, setPosition] = useState(null);

  const selectedOption = options.find(
    (option) => String(option.value) === String(value)
  );

  const showSearch = searchable ?? options.length > 6;

  const filteredOptions = options.filter((option) =>
    String(option.label)
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  );

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const width = Math.min(
      Math.max(rect.width, 224),
      viewportWidth - 24
    );

    const left = Math.max(
      12,
      Math.min(rect.left, viewportWidth - width - 12)
    );

    const spaceBelow = Math.max(100, viewportHeight - rect.bottom - 16);
    const spaceAbove = Math.max(100, rect.top - 16);
    const openUp = spaceBelow < 230 && spaceAbove > spaceBelow;

    const availableSpace = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.min(310, availableSpace);

    let top = openUp
      ? rect.top - maxHeight - 8
      : rect.bottom + 8;

    top = Math.max(
      8,
      Math.min(top, viewportHeight - maxHeight - 8)
    );

    setPosition({
      top,
      left,
      width,
      maxHeight,
      openUp,
    });
  }, []);

  function toggleDropdown() {
    if (disabled) return;

    if (open) {
      setOpen(false);
      return;
    }

    setQuery("");
    updatePosition();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return undefined;

    const reposition = () => updatePosition();

    const outside = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeys = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }

      if (
        (event.key === "ArrowDown" || event.key === "ArrowUp") &&
        menuRef.current?.contains(document.activeElement)
      ) {
        event.preventDefault();

        const items = Array.from(
          menuRef.current.querySelectorAll('[role="option"]')
        );

        const currentIndex = items.indexOf(document.activeElement);

        const nextIndex =
          event.key === "ArrowDown"
            ? Math.min(currentIndex + 1, items.length - 1)
            : Math.max(currentIndex - 1, 0);

        items[nextIndex]?.focus();
      }
    };

    window.addEventListener("resize", reposition);
    window.addEventListener("scroll", reposition, true);
    document.addEventListener("pointerdown", outside);
    document.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      document.removeEventListener("pointerdown", outside);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open || !showSearch) return undefined;

    const timer = window.setTimeout(
      () => searchRef.current?.focus(),
      40
    );

    return () => window.clearTimeout(timer);
  }, [open, showSearch]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleDropdown}
        className={[
          "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left outline-none transition",
          "focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100",
          open
            ? "border-[#F4512B] ring-4 ring-orange-100"
            : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/20",
          disabled ? "cursor-not-allowed opacity-50" : "",
          className,
        ].join(" ")}
      >
        <span
          className={[
            "min-w-0 flex-1 truncate text-sm font-semibold",
            selectedOption ? "text-slate-800" : "text-slate-400",
          ].join(" ")}
        >
          {selectedOption?.label || placeholder}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.16 }}
          className="shrink-0 text-slate-400"
        >
          <ChevronDown size={16} />
        </motion.span>
      </button>

      {createPortal(
        <AnimatePresence>
          {open && position && (
            <motion.div
              ref={menuRef}
              role="listbox"
              aria-label={placeholder}
              initial={{
                opacity: 0,
                y: position.openUp ? 4 : -4,
                scale: 0.99,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: position.openUp ? 3 : -3,
                scale: 0.99,
              }}
              transition={{ duration: 0.14 }}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
                zIndex: 99999,
                transformOrigin: position.openUp
                  ? "bottom center"
                  : "top center",
              }}
              className="notifications-premium-menu overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_22px_60px_-20px_rgba(15,23,42,.36)] ring-1 ring-black/[.025]"
            >
              <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50/90 via-white to-white px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[.15em] text-slate-400">
                    Available options
                  </span>

                  <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-[#F4512B]">
                    {filteredOptions.length}
                  </span>
                </div>

                {showSearch && (
                  <div className="relative mt-2.5">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      ref={searchRef}
                      value={query}
                      onChange={(event) => setQuery(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") setOpen(false);
                      }}
                      placeholder="Search options..."
                      aria-label="Search dropdown options"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                )}
              </div>

              <div
                className="overflow-y-auto p-1.5"
                style={{
                  maxHeight: Math.max(
                    65,
                    position.maxHeight - (showSearch ? 91 : 48)
                  ),
                }}
              >
                {filteredOptions.length ? (
                  filteredOptions.map((option) => {
                    const selected =
                      String(option.value) === String(value);

                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        role="option"
                        aria-selected={selected}
                        onClick={() => {
                          onChange(option.value);
                          setOpen(false);
                          setQuery("");
                          triggerRef.current?.focus();
                        }}
                        className={[
                          "group/option flex min-h-10 w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition",
                          selected
                            ? "bg-orange-50 text-[#F4512B]"
                            : "text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border",
                            selected
                              ? "border-orange-200 bg-white text-[#F4512B]"
                              : "border-slate-100 bg-slate-50 text-slate-400 group-hover/option:border-orange-100 group-hover/option:bg-orange-50 group-hover/option:text-[#F4512B]",
                          ].join(" ")}
                        >
                          {selected ? (
                            <Check size={14} strokeWidth={2.5} />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          )}
                        </span>

                        <span
                          className={[
                            "min-w-0 flex-1 break-words text-sm",
                            selected ? "font-bold" : "font-medium",
                          ].join(" ")}
                        >
                          {option.label}
                        </span>

                        {selected && (
                          <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#F4512B]">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-7 text-center">
                    <Search
                      size={19}
                      className="mx-auto text-slate-300"
                    />

                    <p className="mt-2 text-sm font-semibold text-slate-600">
                      No options found
                    </p>

                    <p className="mt-1 text-xs text-slate-400">
                      Try another search term.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-3.5 py-2">
                <span className="text-[10px] font-medium text-slate-400">
                  CodeFaculty
                </span>

                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                  <ShieldCheck
                    size={12}
                    className="text-[#F4512B]"
                  />
                  Smart selection
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

/* =========================================================
   ACTION BUTTONS AND BADGES
========================================================= */

function ActionButton({
  children,
  onClick,
  variant = "secondary",
  type = "button",
  disabled = false,
  className = "",
}) {
  const variants = {
    primary:
      "border-[#F4512B] bg-[#F4512B] text-white shadow-sm shadow-orange-200/70 hover:border-[#df3f1b] hover:bg-[#df3f1b]",
    secondary:
      "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/60 hover:text-[#F4512B]",
    ghost:
      "border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800",
    danger:
      "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition duration-200",
        "focus:outline-none focus:ring-4 focus:ring-orange-100 active:scale-[.98] disabled:pointer-events-none disabled:opacity-50",
        variants[variant] || variants.secondary,
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function StatusBadge({ status }) {
  const map = {
    Published: {
      icon: CheckCircle2,
      style: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    Scheduled: {
      icon: Clock3,
      style: "border-blue-200 bg-blue-50 text-blue-700",
    },
    Draft: {
      icon: FileText,
      style: "border-slate-200 bg-slate-100 text-slate-600",
    },
  };

  const config = map[status] || map.Draft;
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        config.style,
      ].join(" ")}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  const style =
    {
      High: "border-rose-200 bg-rose-50 text-rose-700",
      Normal: "border-orange-100 bg-orange-50 text-[#C94524]",
      Low: "border-slate-200 bg-slate-50 text-slate-600",
    }[priority] || "border-orange-100 bg-orange-50 text-[#C94524]";

  const dot =
    priority === "High"
      ? "bg-rose-500"
      : priority === "Low"
        ? "bg-slate-400"
        : "bg-[#F4512B]";

  return (
    <span
      className={[
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
        style,
      ].join(" ")}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
      {priority}
    </span>
  );
}

/* =========================================================
   MODAL SHELL
   Stable scroll lock: effect runs only on mount/unmount.
========================================================= */

function ModalShell({
  title,
  subtitle,
  icon: Icon = Bell,
  onClose,
  children,
  size = "max-w-3xl",
}) {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-[5px] sm:p-6"
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
        aria-label={title}
        initial={{ opacity: 0, y: 12, scale: 0.99 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 8, scale: 0.99 }}
        transition={{ duration: 0.16 }}
        className={[
          "my-auto w-full overflow-visible rounded-2xl border border-slate-200/80 bg-white",
          "shadow-[0_24px_90px_-24px_rgba(15,23,42,.45)]",
          size,
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4 rounded-t-2xl border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
              <Icon size={21} />
            </div>

            <div className="min-w-0 pt-0.5">
              <h2 className="text-lg font-bold tracking-tight text-slate-900">
                {title}
              </h2>

              {subtitle && (
                <p className="mt-1 text-sm leading-5 text-slate-500">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
          >
            <X size={19} />
          </button>
        </div>

        <div className="max-h-[75vh] overflow-y-auto rounded-b-2xl">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   FORM FIELDS
========================================================= */

function FormField({
  label,
  value,
  onChange,
  placeholder,
  required = false,
  type = "text",
  min,
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-[#F4512B]">*</span>}
      </span>

      <input
        type={type}
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        required={required}
        min={min}
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

function FormSelect({
  label,
  value,
  onChange,
  options,
  required = false,
}) {
  const normalizedOptions = options.map((item) =>
    typeof item === "string"
      ? { label: item, value: item }
      : item
  );

  return (
    <div className="min-w-0">
      <p className="mb-1.5 text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-[#F4512B]">*</span>}
      </p>

      <PremiumDropdown
        value={value}
        onChange={onChange}
        options={normalizedOptions}
        placeholder={label}
      />
    </div>
  );
}

/* =========================================================
   CREATE / EDIT NOTIFICATION MODAL
========================================================= */

function NotificationFormModal({
  notification,
  onClose,
  onSave,
}) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_FORM,
    ...(notification || {}),
  }));

  const [error, setError] = useState("");

  function setField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function submit(event) {
    event.preventDefault();

    if (form.title.trim().length < 3) {
      setError(
        "Notification title must contain at least 3 characters."
      );
      return;
    }

    if (form.message.trim().length < 10) {
      setError("Please add a clearer notification message.");
      return;
    }

    if (form.status === "Scheduled" && !form.scheduledAt) {
      setError(
        "Choose a date and time for the scheduled notification."
      );
      return;
    }

    if (
      form.status === "Scheduled" &&
      new Date(form.scheduledAt).getTime() <= Date.now()
    ) {
      setError(
        "Scheduled notifications must use a future date and time."
      );
      return;
    }

    const result = onSave({
      ...form,
      title: form.title.trim(),
      message: form.message.trim(),
    });

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <ModalShell
      title={notification ? "Edit Notification" : "Create Notification"}
      subtitle={
        notification
          ? "Update content, delivery settings and priority."
          : "Prepare a notification for the selected audience."
      }
      icon={BellRing}
      onClose={onClose}
      size="max-w-4xl"
    >
      <form onSubmit={submit} className="p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#F4512B]">
            01 — Message content
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Write a clear title and message for your target audience.
          </p>
        </div>

        <div className="space-y-4">
          <FormField
            label="Notification Title"
            value={form.title}
            onChange={(value) => setField("title", value)}
            placeholder="Enter a clear notification title"
            required
          />

          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold text-slate-700">
              Message
              <span className="ml-1 text-[#F4512B]">*</span>
            </span>

            <textarea
              value={form.message}
              onChange={(event) =>
                setField("message", event.target.value)
              }
              rows={5}
              required
              placeholder="Write the complete notification message..."
              className="w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
            />

            <span className="mt-1 block text-right text-xs text-slate-400">
              {form.message.length} characters
            </span>
          </label>
        </div>

        <div className="mb-4 mt-7">
          <p className="text-xs font-extrabold uppercase tracking-[.14em] text-[#F4512B]">
            02 — Audience and delivery
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Choose the audience, delivery channel and notification priority.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            label="Audience"
            value={form.audience}
            onChange={(value) => setField("audience", value)}
            options={AUDIENCES}
            required
          />

          <FormSelect
            label="Category"
            value={form.category}
            onChange={(value) => setField("category", value)}
            options={CATEGORIES}
            required
          />

          <FormSelect
            label="Priority"
            value={form.priority}
            onChange={(value) => setField("priority", value)}
            options={PRIORITIES}
            required
          />

          <FormSelect
            label="Delivery Channel"
            value={form.channel}
            onChange={(value) => setField("channel", value)}
            options={CHANNELS}
            required
          />

          <FormSelect
            label="Notification Status"
            value={form.status}
            onChange={(value) => setField("status", value)}
            options={DELIVERY_STATUSES}
            required
          />

          {form.status === "Scheduled" && (
            <FormField
              label="Schedule Date & Time"
              type="datetime-local"
              value={form.scheduledAt}
              onChange={(value) => setField("scheduledAt", value)}
              required
            />
          )}
        </div>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <AlertCircle size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex items-start gap-2 rounded-xl border border-orange-100 bg-orange-50/70 p-3">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-[#F4512B]"
          />

          <p className="text-xs leading-5 text-slate-600">
            This page currently saves notification records in this browser.
            Publishing here does not send a real email, push notification or
            in-app message.
          </p>
        </div>

        <div className="mt-6 flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-5 sm:flex-row">
          <ActionButton onClick={onClose}>
            Cancel
          </ActionButton>

          <ActionButton type="submit" variant="primary">
            <Check size={16} />
            {notification ? "Save Changes" : "Save Notification"}
          </ActionButton>
        </div>
      </form>
    </ModalShell>
  );
}

/* =========================================================
   NOTIFICATION DETAILS MODAL
========================================================= */

function ActivityIcon() {
  return <BellRing size={19} />;
}

function NotificationDetailsModal({
  notification,
  onClose,
  onEdit,
  onStatusChange,
  onDuplicate,
}) {
  if (!notification) return null;

  const readRate = getReadPercentage(notification);

  const metadata = [
    {
      label: "Audience",
      value: notification.audience,
      icon: Users,
    },
    {
      label: "Category",
      value: notification.category,
      icon: MessageSquareText,
    },
    {
      label: "Created On",
      value: formatDateTime(notification.createdAt),
      icon: CalendarDays,
    },
    {
      label: "Scheduled For",
      value: notification.scheduledAt
        ? formatDateTime(notification.scheduledAt)
        : "Not scheduled",
      icon: Clock3,
    },
  ];

  return (
    <ModalShell
      title="Notification Details"
      subtitle={`Notification ID: ${notification.id}`}
      icon={Bell}
      onClose={onClose}
      size="max-w-3xl"
    >
      <div className="p-5 sm:p-6">
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={notification.status} />
            <PriorityBadge priority={notification.priority} />

            <span className="rounded-full border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-500">
              {notification.channel}
            </span>
          </div>

          <h3 className="mt-4 break-words text-xl font-bold tracking-tight text-slate-900">
            {notification.title}
          </h3>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {notification.message}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {metadata.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
                  <Icon size={17} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">
                    {item.label}
                  </p>

                  <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                    {item.value}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900">
                Engagement Snapshot
              </h4>

              <p className="mt-1 text-xs text-slate-400">
                Sample delivery metrics from the demo record
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-blue-100 bg-blue-50 text-blue-700">
              <ActivityIcon />
            </div>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-3">
            {[
              {
                label: "Sent",
                value: formatNumber(notification.sentCount),
              },
              {
                label: "Read",
                value: formatNumber(notification.readCount),
              },
              {
                label: "Read rate",
                value: `${readRate}%`,
              },
            ].map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-slate-50 p-3"
              >
                <p className="text-lg font-extrabold tabular-nums text-slate-900">
                  {item.value}
                </p>

                <p className="mt-1 text-xs font-medium text-slate-500">
                  {item.label}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-[#F4512B] transition-[width] duration-300"
              style={{ width: `${readRate}%` }}
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <div className="flex flex-wrap gap-2">
            {notification.status !== "Published" && (
              <button
                type="button"
                onClick={() =>
                  onStatusChange(notification, "Published")
                }
                className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                <CheckCircle2 size={15} />
                Mark Published
              </button>
            )}

            <button
              type="button"
              onClick={() => onDuplicate(notification)}
              className="inline-flex items-center gap-2 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
            >
              <Copy size={15} />
              Duplicate
            </button>
          </div>

          <div className="flex gap-2">
            <ActionButton onClick={onClose}>
              Close
            </ActionButton>

            <ActionButton
              variant="primary"
              onClick={() => onEdit(notification)}
            >
              <Pencil size={15} />
              Edit
            </ActionButton>
          </div>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   STAT CARD + EMPTY STATE
========================================================= */

function StatCard({
  label,
  value,
  note,
  icon: Icon,
  tone = "orange",
}) {
  const tones = {
    orange: "border-orange-100 bg-orange-50 text-[#F4512B]",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/70 transition-shadow duration-200 hover:shadow-md sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl">
            {value}
          </p>
        </div>

        <div
          className={[
            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
            tones[tone] || tones.orange,
          ].join(" ")}
        >
          <Icon size={21} />
        </div>
      </div>

      <p className="mt-3 text-xs leading-5 text-slate-400">
        {note}
      </p>
    </div>
  );
}

function EmptyState({ onReset }) {
  return (
    <div className="px-5 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#F4512B]">
        <Bell size={25} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No notifications found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        No notifications match your current search and filter settings.
      </p>

      <div className="mt-5">
        <ActionButton onClick={onReset}>
          <RefreshCw size={15} />
          Reset Filters
        </ActionButton>
      </div>
    </div>
  );
}

/* =========================================================
   MAIN NOTIFICATIONS PAGE
========================================================= */

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch {
      // Use sample data if storage is unavailable or malformed.
    }

    return INITIAL_NOTIFICATIONS;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedIds, setSelectedIds] = useState([]);
  const [formOpen, setFormOpen] = useState(false);
  const [editingNotification, setEditingNotification] = useState(null);
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications)
      );
    } catch {
      // Browser storage is optional.
    }
  }, [notifications]);

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = notifications.filter((item) => {
      const searchableValues = [
        item.id,
        item.title,
        item.message,
        item.category,
        item.audience,
        item.priority,
        item.channel,
        item.createdBy,
      ];

      const matchesSearch =
        !query ||
        searchableValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      return (
        matchesSearch &&
        (statusFilter === "All" || item.status === statusFilter) &&
        (categoryFilter === "All" || item.category === categoryFilter) &&
        (priorityFilter === "All" || item.priority === priorityFilter) &&
        (audienceFilter === "All" || item.audience === audienceFilter)
      );
    });

    return [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return String(a.createdAt || "").localeCompare(
          String(b.createdAt || "")
        );
      }

      if (sortBy === "title-asc") {
        return a.title.localeCompare(b.title);
      }

      if (sortBy === "title-desc") {
        return b.title.localeCompare(a.title);
      }

      if (sortBy === "priority-desc") {
        return getPriorityRank(b.priority) - getPriorityRank(a.priority);
      }

      return String(b.createdAt || "").localeCompare(
        String(a.createdAt || "")
      );
    });
  }, [
    notifications,
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
    audienceFilter,
    sortBy,
  ]);

  const publishedCount = notifications.filter(
    (item) => item.status === "Published"
  ).length;

  const scheduledCount = notifications.filter(
    (item) => item.status === "Scheduled"
  ).length;

  const draftCount = notifications.filter(
    (item) => item.status === "Draft"
  ).length;

  const highPriorityCount = notifications.filter(
    (item) => item.priority === "High"
  ).length;

  const totalSent = notifications.reduce(
    (sum, item) => sum + Number(item.sentCount || 0),
    0
  );

  const totalRead = notifications.reduce(
    (sum, item) => sum + Number(item.readCount || 0),
    0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotifications.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const visibleNotifications = filteredNotifications.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const visibleIds = visibleNotifications.map((item) => item.id);

  const selectedVisibleCount = visibleIds.filter((id) =>
    selectedIds.includes(id)
  ).length;

  const allVisibleSelected =
    visibleIds.length > 0 &&
    selectedVisibleCount === visibleIds.length;

  const activeFiltersCount = [
    statusFilter !== "All",
    categoryFilter !== "All",
    priorityFilter !== "All",
    audienceFilter !== "All",
  ].filter(Boolean).length;

  const hasFilters =
    Boolean(search.trim()) || activeFiltersCount > 0;

  /* Reset pagination and selection when search/filter/sort changes. */
  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [
    search,
    statusFilter,
    categoryFilter,
    priorityFilter,
    audienceFilter,
    sortBy,
  ]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setPriorityFilter("All");
    setAudienceFilter("All");
    setSortBy("newest");
    setPage(1);
    setSelectedIds([]);
  }

  function openCreateModal() {
    setEditingNotification(null);
    setFormOpen(true);
  }

  function openEditModal(notification) {
    setSelectedNotification(null);
    setEditingNotification(notification);
    setFormOpen(true);
  }

  function saveNotification(form) {
    if (editingNotification) {
      setNotifications((current) =>
        current.map((item) =>
          item.id === editingNotification.id
            ? {
              ...item,
              ...form,
              id: editingNotification.id,
            }
            : item
        )
      );

      setNotice({
        type: "success",
        message: `"${form.title}" has been updated.`,
      });
    } else {
      const newItem = {
        ...form,
        id: `NT-${Date.now().toString().slice(-6)}`,
        createdAt: new Date().toISOString().slice(0, 16),
        sentCount: 0,
        readCount: 0,
        createdBy: "Admin",
      };

      setNotifications((current) => [newItem, ...current]);

      setNotice({
        type: "success",
        message: `"${form.title}" has been created successfully.`,
      });
    }

    setFormOpen(false);
    setEditingNotification(null);
    setSelectedIds([]);
    setPage(1);

    return { success: true };
  }

  function updateNotificationStatus(notification, status) {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notification.id
          ? { ...item, status }
          : item
      )
    );

    setSelectedNotification((current) =>
      current?.id === notification.id
        ? { ...current, status }
        : current
    );

    setNotice({
      type: "success",
      message: `"${notification.title}" status changed to ${status}.`,
    });
  }

  function duplicateNotification(notification) {
    const duplicate = {
      ...notification,
      id: `NT-${Date.now().toString().slice(-6)}`,
      title: `${notification.title} (Copy)`,
      status: "Draft",
      createdAt: new Date().toISOString().slice(0, 16),
      scheduledAt: "",
      sentCount: 0,
      readCount: 0,
      createdBy: "Admin",
    };

    setNotifications((current) => [duplicate, ...current]);
    setSelectedNotification(null);
    setPage(1);

    setNotice({
      type: "success",
      message: `Draft copy created from "${notification.title}".`,
    });
  }

  function deleteNotification(notification) {
    const confirmed = window.confirm(
      `Delete "${notification.title}"? This removes the record from this browser.`
    );

    if (!confirmed) return;

    setNotifications((current) =>
      current.filter((item) => item.id !== notification.id)
    );

    setSelectedIds((current) =>
      current.filter((id) => id !== notification.id)
    );

    setSelectedNotification(null);

    setNotice({
      type: "success",
      message: `"${notification.title}" has been deleted.`,
    });
  }

  function toggleSelected(id) {
    setSelectedIds((current) =>
      current.includes(id)
        ? current.filter((itemId) => itemId !== id)
        : [...current, id]
    );
  }

  function toggleSelectAllVisible() {
    if (allVisibleSelected) {
      setSelectedIds((current) =>
        current.filter((id) => !visibleIds.includes(id))
      );
    } else {
      setSelectedIds((current) => [
        ...new Set([...current, ...visibleIds]),
      ]);
    }
  }

  function bulkUpdateStatus(status) {
    if (!selectedIds.length) return;

    const count = selectedIds.length;

    setNotifications((current) =>
      current.map((item) =>
        selectedIds.includes(item.id)
          ? { ...item, status }
          : item
      )
    );

    setSelectedIds([]);

    setNotice({
      type: "success",
      message: `${count} notification record(s) marked ${status.toLowerCase()}.`,
    });
  }

  function bulkDelete() {
    if (
      !selectedIds.length ||
      !window.confirm(
        `Delete ${selectedIds.length} selected notification record(s)?`
      )
    ) {
      return;
    }

    const count = selectedIds.length;

    setNotifications((current) =>
      current.filter((item) => !selectedIds.includes(item.id))
    );

    setSelectedIds([]);

    setNotice({
      type: "success",
      message: `${count} notification record(s) deleted.`,
    });
  }

  function exportCSV() {
    const headers = [
      "Notification ID",
      "Title",
      "Message",
      "Category",
      "Audience",
      "Priority",
      "Channel",
      "Status",
      "Created At",
      "Scheduled At",
      "Sent Count",
      "Read Count",
      "Read Rate",
      "Created By",
    ];

    const rows = filteredNotifications.map((item) => [
      item.id,
      item.title,
      item.message,
      item.category,
      item.audience,
      item.priority,
      item.channel,
      item.status,
      item.createdAt,
      item.scheduledAt,
      item.sentCount,
      item.readCount,
      `${getReadPercentage(item)}%`,
      item.createdBy,
    ]);

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `codefaculty-notifications-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    setNotice({
      type: "success",
      message: `${filteredNotifications.length} notification record(s) exported.`,
    });
  }

  return (
    <div className="notifications-admin-page min-w-0 bg-[#F8FAFC] px-4 py-5 text-slate-800 sm:px-6 sm:py-6 xl:px-8">
      <PremiumStyles />

      <div className="mx-auto w-full max-w-[1600px]">
        {/* HEADER */}
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-slate-400">
              <Bell size={14} className="text-[#F4512B]" />
              Administration
              <span className="text-slate-300">/</span>
              Communication Centre
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Notifications
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage announcements, schedule messages, organize audiences
              and monitor notification records from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={exportCSV}>
              <Download size={16} />
              Export CSV
            </ActionButton>

            <ActionButton variant="primary" onClick={openCreateModal}>
              <Plus size={17} />
              Create Notification
            </ActionButton>
          </div>
        </section>

        {/* NOTICE */}
        <AnimatePresence initial={false}>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -5 }}
              className="overflow-hidden"
            >
              <div
                className={[
                  "mt-5 flex items-start gap-3 rounded-xl border px-4 py-3",
                  notice.type === "success"
                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                    : "border-rose-200 bg-rose-50 text-rose-800",
                ].join(" ")}
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />

                <p className="flex-1 text-sm font-medium leading-6">
                  {notice.message}
                </p>

                <button
                  type="button"
                  onClick={() => setNotice(null)}
                  aria-label="Dismiss notice"
                  className="rounded-md p-1 opacity-70 hover:bg-black/5 hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STATS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Notifications"
            value={formatNumber(notifications.length)}
            note="All notification records"
            icon={Bell}
          />

          <StatCard
            label="Published"
            value={formatNumber(publishedCount)}
            note="Published records in this demo"
            icon={CheckCircle2}
            tone="green"
          />

          <StatCard
            label="Scheduled"
            value={formatNumber(scheduledCount)}
            note="Records prepared for scheduling"
            icon={Clock3}
            tone="blue"
          />

          <StatCard
            label="High Priority"
            value={formatNumber(highPriorityCount)}
            note={`${draftCount} draft records awaiting action`}
            icon={AlertCircle}
            tone="violet"
          />
        </div>

        {/* ENGAGEMENT OVERVIEW */}
        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_.7fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Engagement Overview
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Sample metrics from published notification records
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                <Zap size={19} />
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-medium text-slate-500">
                  Sample delivery count
                </p>

                <p className="mt-2 text-xl font-extrabold tabular-nums text-slate-900">
                  {formatNumber(totalSent)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-medium text-slate-500">
                  Sample read count
                </p>

                <p className="mt-2 text-xl font-extrabold tabular-nums text-slate-900">
                  {formatNumber(totalRead)}
                </p>
              </div>

              <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                <p className="text-xs font-medium text-slate-500">
                  Sample read rate
                </p>

                <p className="mt-2 text-xl font-extrabold tabular-nums text-slate-900">
                  {totalSent
                    ? `${Math.round((totalRead / totalSent) * 100)}%`
                    : "—"}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/90 via-white to-white p-4 shadow-sm shadow-orange-100/30 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white text-[#F4512B]">
                <ShieldCheck size={19} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Delivery Controls
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Manage message content, audiences, priority and planned
                  delivery status.
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-xl border border-orange-100 bg-white/90 p-3.5">
              <p className="text-xs font-semibold leading-5 text-slate-600">
                This page uses browser-based demo data. A backend delivery
                service is required to actually send email, push or in-app
                notifications.
              </p>
            </div>
          </div>
        </div>

        {/* SEARCH AND FILTERS */}
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-5">
          <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search title, message, ID, category or audience..."
                aria-label="Search notifications"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#F4512B] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex">
              <div className="min-w-0 xl:w-40">
                <PremiumDropdown
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="All statuses"
                  searchable={false}
                  options={[
                    { label: "All Statuses", value: "All" },
                    ...DELIVERY_STATUSES.map((item) => ({
                      label: item,
                      value: item,
                    })),
                  ]}
                />
              </div>

              <div className="min-w-0 xl:w-48">
                <PremiumDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort notifications"
                  options={SORT_OPTIONS}
                />
              </div>

              <ActionButton
                onClick={() =>
                  setShowFilters((current) => !current)
                }
              >
                <SlidersHorizontal size={16} />
                Filters

                {activeFiltersCount > 0 && (
                  <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-100 px-1 text-[11px] font-bold text-[#F4512B]">
                    {activeFiltersCount}
                  </span>
                )}
              </ActionButton>

              {hasFilters && (
                <ActionButton onClick={resetFilters} variant="ghost">
                  <RefreshCw size={15} />
                  Reset
                </ActionButton>
              )}
            </div>
          </div>

          <AnimatePresence initial={false}>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.16 }}
                className="overflow-visible"
              >
                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-3">
                  <div className="min-w-0">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Notification category
                    </p>

                    <PremiumDropdown
                      value={categoryFilter}
                      onChange={setCategoryFilter}
                      placeholder="All Categories"
                      options={[
                        { label: "All Categories", value: "All" },
                        ...CATEGORIES.map((item) => ({
                          label: item,
                          value: item,
                        })),
                      ]}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Priority
                    </p>

                    <PremiumDropdown
                      value={priorityFilter}
                      onChange={setPriorityFilter}
                      placeholder="All Priorities"
                      searchable={false}
                      options={[
                        { label: "All Priorities", value: "All" },
                        ...PRIORITIES.map((item) => ({
                          label: item,
                          value: item,
                        })),
                      ]}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Target audience
                    </p>

                    <PremiumDropdown
                      value={audienceFilter}
                      onChange={setAudienceFilter}
                      placeholder="All Audiences"
                      options={[
                        { label: "All Audiences", value: "All" },
                        ...AUDIENCES.map((item) => ({
                          label: item,
                          value: item,
                        })),
                      ]}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RESULTS HEADER */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Notification Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredNotifications.length === 0
                  ? 0
                  : (safePage - 1) * PAGE_SIZE + 1}
                {"–"}
                {Math.min(
                  safePage * PAGE_SIZE,
                  filteredNotifications.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {formatNumber(filteredNotifications.length)}
              </span>{" "}
              records
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ArrowDownUp size={14} />
            Sorted by{" "}
            <span className="font-semibold text-slate-600">
              {
                {
                  newest: "Newest first",
                  oldest: "Oldest first",
                  "title-asc": "Title (A–Z)",
                  "title-desc": "Title (Z–A)",
                  "priority-desc": "Highest priority",
                }[sortBy]
              }
            </span>
          </div>
        </div>

        {/* BULK ACTIONS */}
        <AnimatePresence initial={false}>
          {selectedIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
            >
              <div className="mt-4 flex flex-col justify-between gap-3 rounded-2xl border border-orange-200 bg-orange-50/80 p-3.5 sm:flex-row sm:items-center sm:px-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <CheckCircle2 size={17} className="text-[#F4512B]" />
                  {selectedIds.length} record(s) selected
                </div>

                <div className="flex flex-wrap gap-2">
                  <ActionButton
                    onClick={() => bulkUpdateStatus("Published")}
                  >
                    <CheckCircle2 size={15} />
                    Mark Published
                  </ActionButton>

                  <ActionButton
                    onClick={() => bulkUpdateStatus("Draft")}
                  >
                    <FileText size={15} />
                    Move to Draft
                  </ActionButton>

                  <ActionButton
                    variant="danger"
                    onClick={bulkDelete}
                  >
                    <Trash2 size={15} />
                    Delete Selected
                  </ActionButton>

                  <ActionButton
                    variant="ghost"
                    onClick={() => setSelectedIds([])}
                  >
                    <X size={15} />
                    Clear
                  </ActionButton>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* NOTIFICATIONS TABLE
            No layout animation on the rows, preventing pagination glitches. */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/50">
          <div className="notifications-table-scroll">
            <table className="w-full min-w-[1120px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  <th className="w-12 px-4 py-4">
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={toggleSelectAllVisible}
                      aria-label="Select all visible notifications"
                      className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#F4512B] focus:ring-orange-200"
                    />
                  </th>

                  {[
                    "NOTIFICATION",
                    "AUDIENCE",
                    "PRIORITY",
                    "STATUS",
                    "CREATED / SCHEDULED",
                    "READ RATE",
                    "ACTIONS",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-4 text-[10px] font-extrabold tracking-[.12em] text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {visibleNotifications.map((item) => (
                  <tr
                    key={item.id}
                    className={[
                      "border-b border-slate-100 transition-colors last:border-0",
                      selectedIds.includes(item.id)
                        ? "bg-orange-50/50"
                        : "hover:bg-orange-50/25",
                    ].join(" ")}
                  >
                    <td className="px-4 py-4">
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(item.id)}
                        onChange={() => toggleSelected(item.id)}
                        aria-label={`Select ${item.title}`}
                        className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#F4512B] focus:ring-orange-200"
                      />
                    </td>

                    <td className="px-4 py-4">
                      <div className="flex min-w-[270px] items-start gap-3">
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                          {item.category === "Maintenance" ? (
                            <AlertCircle size={18} />
                          ) : item.category === "Academic" ||
                            item.category === "Course Update" ? (
                            <FileText size={18} />
                          ) : (
                            <Bell size={18} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p
                            title={item.title}
                            className="max-w-[280px] truncate text-sm font-bold text-slate-800"
                          >
                            {item.title}
                          </p>

                          <p className="mt-1 text-xs text-slate-400">
                            {item.id}
                          </p>

                          <p className="mt-1 max-w-[290px] truncate text-xs text-slate-500">
                            {item.message}
                          </p>

                          <div className="mt-2 flex flex-wrap items-center gap-1.5">
                            <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                              {item.category}
                            </span>

                            <span className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[10px] font-semibold text-slate-400">
                              {item.channel}
                            </span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-2 text-sm font-medium text-slate-600">
                        <Users size={15} className="text-slate-400" />
                        {item.audience}
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <PriorityBadge priority={item.priority} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <StatusBadge status={item.status} />
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-start gap-2">
                        <CalendarDays
                          size={14}
                          className="mt-0.5 text-slate-400"
                        />

                        <div>
                          <p className="text-xs font-semibold text-slate-600">
                            {formatDate(item.createdAt)}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-400">
                            {item.status === "Scheduled"
                              ? `Scheduled: ${formatDateTime(item.scheduledAt)}`
                              : formatDateTime(item.createdAt)}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-4">
                      <div className="min-w-[100px]">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-bold tabular-nums text-slate-700">
                            {getReadPercentage(item)}%
                          </span>

                          <span className="text-[10px] text-slate-400">
                            {formatNumber(item.readCount || 0)}
                          </span>
                        </div>

                        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-[#F4512B] transition-[width] duration-300"
                            style={{
                              width: `${getReadPercentage(item)}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>

                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSelectedNotification(item)}
                          title="View notification"
                          aria-label={`View ${item.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-[#F4512B] transition hover:bg-[#F4512B] hover:text-white"
                        >
                          <Eye size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => openEditModal(item)}
                          title="Edit notification"
                          aria-label={`Edit ${item.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B]"
                        >
                          <Pencil size={15} />
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteNotification(item)}
                          title="Delete notification"
                          aria-label={`Delete ${item.id}`}
                          className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-400 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {visibleNotifications.length === 0 && (
            <EmptyState onReset={resetFilters} />
          )}

          {/* PAGINATION */}
          {filteredNotifications.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <input
                  type="checkbox"
                  checked={allVisibleSelected}
                  onChange={toggleSelectAllVisible}
                  aria-label="Select all visible records"
                  className="h-4 w-4 cursor-pointer rounded border-slate-300 accent-[#F4512B] focus:ring-orange-200"
                />

                Select visible records
                <span className="text-slate-300">·</span>

                {selectedIds.length
                  ? `${selectedIds.length} selected`
                  : `${filteredNotifications.length} results`}
              </div>

              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  disabled={safePage <= 1}
                  onClick={() =>
                    setPage((current) => Math.max(1, current - 1))
                  }
                  aria-label="Previous page"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft size={16} />
                </button>

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                )
                  .filter(
                    (number) =>
                      number === 1 ||
                      number === totalPages ||
                      Math.abs(number - safePage) <= 1
                  )
                  .map((number, index, numbers) => (
                    <span key={number} className="contents">
                      {index > 0 &&
                        number - numbers[index - 1] > 1 && (
                          <span className="px-1 text-slate-400">
                            …
                          </span>
                        )}

                      <button
                        type="button"
                        onClick={() => setPage(number)}
                        aria-label={`Go to page ${number}`}
                        aria-current={
                          safePage === number ? "page" : undefined
                        }
                        className={[
                          "min-w-9 rounded-lg border px-3 py-2 text-xs font-bold transition",
                          safePage === number
                            ? "border-[#F4512B] bg-[#F4512B] text-white"
                            : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B]",
                        ].join(" ")}
                      >
                        {number}
                      </button>
                    </span>
                  ))}

                <button
                  type="button"
                  disabled={safePage >= totalPages}
                  onClick={() =>
                    setPage((current) =>
                      Math.min(totalPages, current + 1)
                    )
                  }
                  aria-label="Next page"
                  className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER NOTE */}
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-xs leading-5 text-slate-400">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" />

          <p>
            Notification records are stored in this browser using local
            storage. Real message delivery, audience targeting and delivery
            receipts require backend integration.
          </p>
        </div>
      </div>

      {/* CREATE / EDIT MODAL */}
      <AnimatePresence>
        {formOpen && (
          <NotificationFormModal
            key={editingNotification?.id || "new-notification"}
            notification={editingNotification}
            onClose={() => {
              setFormOpen(false);
              setEditingNotification(null);
            }}
            onSave={saveNotification}
          />
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedNotification && (
          <NotificationDetailsModal
            key={selectedNotification.id}
            notification={
              notifications.find(
                (item) => item.id === selectedNotification.id
              ) || selectedNotification
            }
            onClose={() => setSelectedNotification(null)}
            onEdit={openEditModal}
            onStatusChange={updateNotificationStatus}
            onDuplicate={duplicateNotification}
          />
        )}
      </AnimatePresence>
    </div>
  );
}