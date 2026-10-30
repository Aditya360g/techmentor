import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertCircle,
  ArrowDownUp,
  BadgeCheck,
  BarChart3,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  Filter,
  GraduationCap,
  Mail,
  MessageSquareText,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  ThumbsUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   CODEFACULTY — FEEDBACK & REVIEWS
   Premium Orange / White Admin Interface
========================================================= */

const STORAGE_KEY = "codefaculty_admin_feedback_v3";
const PAGE_SIZE = 7;
const BRAND = "#F4512B";

const CATEGORY_OPTIONS = [
  "Teaching Quality",
  "Course Content",
  "Trainer Support",
  "Platform Experience",
  "Assessment",
  "Placement Support",
];

const STATUS_OPTIONS = ["New", "Under Review", "Resolved"];

const INITIAL_FEEDBACK = [
  {
    id: "FB-2001",
    student: "Aarav Mehta",
    email: "aarav.mehta@example.com",
    course: "Full Stack Development",
    trainer: "Rahul Sharma",
    category: "Teaching Quality",
    rating: 5,
    date: "2026-10-24",
    status: "New",
    source: "Course Review",
    message:
      "The practical sessions were very helpful. The trainer explained React concepts clearly and connected them to real project requirements.",
    response: "",
  },
  {
    id: "FB-2002",
    student: "Ananya Sharma",
    email: "ananya.sharma@example.com",
    course: "Python & AI/ML",
    trainer: "Priya Verma",
    category: "Course Content",
    rating: 4,
    date: "2026-10-23",
    status: "Under Review",
    source: "Course Review",
    message:
      "The course covers the important fundamentals. Adding more advanced case studies and practical model deployment examples would make it stronger.",
    response: "",
  },
  {
    id: "FB-2003",
    student: "Rohan Gupta",
    email: "rohan.gupta@example.com",
    course: "Java & DSA",
    trainer: "Amit Singh",
    category: "Trainer Support",
    rating: 5,
    date: "2026-10-22",
    status: "Resolved",
    source: "Support Ticket",
    message:
      "I received helpful guidance when I was stuck on recursion and graph problems. The additional examples helped me understand the concepts.",
    response:
      "Thank you for sharing your experience. We are glad the additional guidance helped you. We will continue improving the learning support.",
  },
  {
    id: "FB-2004",
    student: "Sneha Verma",
    email: "sneha.verma@example.com",
    course: "Data Science",
    trainer: "Neha Gupta",
    category: "Platform Experience",
    rating: 3,
    date: "2026-10-21",
    status: "New",
    source: "Platform Feedback",
    message:
      "The learning material is useful, but navigating between course resources and assignments takes extra steps. A more direct navigation flow would help.",
    response: "",
  },
  {
    id: "FB-2005",
    student: "Ishaan Patel",
    email: "ishaan.patel@example.com",
    course: "Cloud & DevOps",
    trainer: "Karan Mehta",
    category: "Assessment",
    rating: 2,
    date: "2026-10-20",
    status: "Under Review",
    source: "Assessment Review",
    message:
      "Some assessment questions seem more advanced than the topics covered in the sessions. It would be helpful to include practice questions before the final assessment.",
    response: "",
  },
  {
    id: "FB-2006",
    student: "Kavya Joshi",
    email: "kavya.joshi@example.com",
    course: "UI/UX Design",
    trainer: "Ananya Joshi",
    category: "Teaching Quality",
    rating: 5,
    date: "2026-10-19",
    status: "Resolved",
    source: "Course Review",
    message:
      "The design exercises and feedback on assignments were excellent. I have become more confident in explaining my design decisions.",
    response:
      "Thank you for the thoughtful feedback. We appreciate your participation and are happy to hear about your progress.",
  },
  {
    id: "FB-2007",
    student: "Dev Kumar",
    email: "dev.kumar@example.com",
    course: "Full Stack Development",
    trainer: "Rahul Sharma",
    category: "Placement Support",
    rating: 4,
    date: "2026-10-18",
    status: "New",
    source: "Placement Feedback",
    message:
      "The project guidance has been valuable. More mock interviews and structured feedback on resumes would help students prepare for recruitment.",
    response: "",
  },
  {
    id: "FB-2008",
    student: "Pooja Singh",
    email: "pooja.singh@example.com",
    course: "Python & AI/ML",
    trainer: "Priya Verma",
    category: "Course Content",
    rating: 5,
    date: "2026-10-17",
    status: "Resolved",
    source: "Course Review",
    message:
      "The notebooks and exercises were easy to follow. The real-world examples helped me connect the theoretical concepts to practical work.",
    response:
      "Thank you for your feedback. We will continue adding practical exercises and real-world examples to the learning material.",
  },
  {
    id: "FB-2009",
    student: "Aditya Jain",
    email: "aditya.jain@example.com",
    course: "Java & DSA",
    trainer: "Amit Singh",
    category: "Assessment",
    rating: 3,
    date: "2026-10-16",
    status: "New",
    source: "Assessment Review",
    message:
      "The coding assessment was useful, but some questions needed clearer constraints and sample test cases.",
    response: "",
  },
  {
    id: "FB-2010",
    student: "Meera Kapoor",
    email: "meera.kapoor@example.com",
    course: "Cloud & DevOps",
    trainer: "Karan Mehta",
    category: "Trainer Support",
    rating: 4,
    date: "2026-10-15",
    status: "Under Review",
    source: "Support Ticket",
    message:
      "The trainer was helpful, although a few support queries took longer than expected to receive a response.",
    response: "",
  },
  {
    id: "FB-2011",
    student: "Arjun Das",
    email: "arjun.das@example.com",
    course: "Data Science",
    trainer: "Neha Gupta",
    category: "Placement Support",
    rating: 5,
    date: "2026-10-14",
    status: "Resolved",
    source: "Placement Feedback",
    message:
      "The project portfolio suggestions were useful and made it easier to present my work during interviews.",
    response:
      "We appreciate your feedback. Keep building projects and updating your portfolio as you progress.",
  },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Highest rating", value: "rating-desc" },
  { label: "Lowest rating", value: "rating-asc" },
  { label: "Student name: A–Z", value: "name-asc" },
];

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function getAvatarTheme(name = "") {
  const themes = [
    "border-orange-100 bg-orange-50 text-[#E94B28]",
    "border-blue-100 bg-blue-50 text-blue-700",
    "border-emerald-100 bg-emerald-50 text-emerald-700",
    "border-violet-100 bg-violet-50 text-violet-700",
    "border-amber-100 bg-amber-50 text-amber-700",
    "border-cyan-100 bg-cyan-50 text-cyan-700",
  ];

  const hash = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return themes[hash % themes.length];
}

function escapeCSV(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

/* =========================================================
   PREMIUM SCROLLBARS
========================================================= */

function FeedbackPremiumStyles() {
  return (
    <style>{`
      .feedback-admin-page {
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .feedback-admin-page *,
      .feedback-premium-menu {
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .feedback-admin-page ::-webkit-scrollbar,
      .feedback-premium-menu::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .feedback-admin-page ::-webkit-scrollbar-track,
      .feedback-premium-menu::-webkit-scrollbar-track {
        background: #fff7f3;
        border-radius: 999px;
      }

      .feedback-admin-page ::-webkit-scrollbar-thumb,
      .feedback-premium-menu::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #f5b39f, #f4512b);
        border: 2px solid #fff7f3;
        border-radius: 999px;
      }

      .feedback-admin-page ::-webkit-scrollbar-thumb:hover,
      .feedback-premium-menu::-webkit-scrollbar-thumb:hover {
        background: #df3f1b;
      }

      .feedback-table-scroll {
        overflow-x: auto;
        overscroll-behavior-x: contain;
        -webkit-overflow-scrolling: touch;
      }

      .feedback-admin-page input,
      .feedback-admin-page textarea {
        color: #1e293b;
      }

      .feedback-admin-page input::placeholder,
      .feedback-admin-page textarea::placeholder {
        color: #94a3b8;
        opacity: 1;
      }

      .feedback-admin-page input[type="checkbox"] {
        accent-color: #F4512B;
      }

      @media (prefers-reduced-motion: reduce) {
        .feedback-admin-page *,
        .feedback-admin-page *::before,
        .feedback-admin-page *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}

/* =========================================================
   PREMIUM CUSTOM DROPDOWN
   Searchable, animated, portal-based, scroll-aware
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

  function updatePosition() {
    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const width = Math.min(
      Math.max(rect.width, 220),
      viewportWidth - 24
    );

    const left = Math.max(
      12,
      Math.min(rect.left, viewportWidth - width - 12)
    );

    const spaceBelow = viewportHeight - rect.bottom - 16;
    const spaceAbove = rect.top - 16;
    const openUp = spaceBelow < 210 && spaceAbove > spaceBelow;

    const availableSpace = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.min(310, Math.max(150, availableSpace));

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
  }

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

    const handleScrollOrResize = () => updatePosition();

    const handleOutsideClick = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }

      if (
        event.key === "ArrowDown" &&
        menuRef.current?.contains(document.activeElement)
      ) {
        event.preventDefault();

        const items = menuRef.current.querySelectorAll(
          '[role="option"]'
        );

        const index = Array.from(items).indexOf(
          document.activeElement
        );

        items[Math.min(index + 1, items.length - 1)]?.focus();
      }

      if (
        event.key === "ArrowUp" &&
        menuRef.current?.contains(document.activeElement)
      ) {
        event.preventDefault();

        const items = menuRef.current.querySelectorAll(
          '[role="option"]'
        );

        const index = Array.from(items).indexOf(
          document.activeElement
        );

        items[Math.max(index - 1, 0)]?.focus();
      }
    };

    window.addEventListener("resize", handleScrollOrResize);
    window.addEventListener("scroll", handleScrollOrResize, true);
    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("resize", handleScrollOrResize);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [open]);

  useEffect(() => {
    if (!open || !showSearch) return undefined;

    const timer = window.setTimeout(() => searchRef.current?.focus(), 50);

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
          "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5",
          "text-left outline-none transition duration-200 ease-out",
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
          transition={{ duration: 0.2 }}
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
                y: position.openUp ? 5 : -5,
                scale: 0.985,
              }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{
                opacity: 0,
                y: position.openUp ? 4 : -4,
                scale: 0.985,
              }}
              transition={{
                duration: 0.16,
                ease: [0.22, 1, 0.36, 1],
              }}
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
              className="feedback-premium-menu overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_22px_60px_-20px_rgba(15,23,42,0.36)] ring-1 ring-black/[0.025]"
            >
              <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50/90 via-white to-white px-3.5 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
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
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                )}
              </div>

              <div
                className="overflow-y-auto p-1.5"
                style={{
                  maxHeight: Math.max(
                    75,
                    position.maxHeight - (showSearch ? 91 : 48)
                  ),
                }}
              >
                {filteredOptions.length > 0 ? (
                  filteredOptions.map((option) => {
                    const isSelected =
                      String(option.value) === String(value);

                    return (
                      <button
                        key={String(option.value)}
                        type="button"
                        role="option"
                        aria-selected={isSelected}
                        onClick={() => {
                          onChange(option.value);
                          setOpen(false);
                          setQuery("");
                          triggerRef.current?.focus();
                        }}
                        className={[
                          "group/option flex min-h-10 w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5",
                          "text-left transition duration-150",
                          isSelected
                            ? "bg-orange-50 text-[#F4512B]"
                            : "text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition",
                            isSelected
                              ? "border-orange-200 bg-white text-[#F4512B]"
                              : "border-slate-100 bg-slate-50 text-slate-400 group-hover/option:border-orange-100 group-hover/option:bg-orange-50 group-hover/option:text-[#F4512B]",
                          ].join(" ")}
                        >
                          {isSelected ? (
                            <Check size={14} strokeWidth={2.5} />
                          ) : (
                            <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                          )}
                        </span>

                        <span
                          className={[
                            "min-w-0 flex-1 break-words text-sm",
                            isSelected ? "font-bold" : "font-medium",
                          ].join(" ")}
                        >
                          {option.label}
                        </span>

                        {isSelected && (
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
                  <ShieldCheck size={12} className="text-[#F4512B]" />
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
   ACTION BUTTON
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
      "border border-[#F4512B] bg-[#F4512B] text-white shadow-sm shadow-orange-200/70 hover:border-[#df3f1b] hover:bg-[#df3f1b]",
    secondary:
      "border border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/60 hover:text-[#F4512B]",
    ghost:
      "border border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800",
    danger:
      "border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100",
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={[
        "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl px-3.5 py-2",
        "text-sm font-semibold transition duration-200 ease-out",
        "focus:outline-none focus:ring-4 focus:ring-orange-100",
        "active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variants[variant],
        className,
      ].join(" ")}
    >
      {children}
    </button>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const configs = {
    New: {
      icon: AlertCircle,
      classes: "border-orange-200 bg-orange-50 text-[#D9411F]",
    },
    "Under Review": {
      icon: Clock3,
      classes: "border-blue-200 bg-blue-50 text-blue-700",
    },
    Resolved: {
      icon: CheckCircle2,
      classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
  };

  const config = configs[status] || configs.New;
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-xs font-semibold",
        config.classes,
      ].join(" ")}
    >
      <Icon size={13} />
      {status}
    </span>
  );
}

/* =========================================================
   STAR RATING
========================================================= */

function StarRating({ rating, size = 15 }) {
  return (
    <span
      className="inline-flex items-center gap-0.5"
      aria-label={`${rating} out of 5 stars`}
    >
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={size}
          className={
            star <= rating
              ? "fill-amber-400 text-amber-400"
              : "fill-slate-100 text-slate-200"
          }
        />
      ))}
    </span>
  );
}

/* =========================================================
   MODAL SHELL
========================================================= */

function ModalShell({
  title,
  subtitle,
  icon: Icon = MessageSquareText,
  onClose,
  children,
  size = "max-w-3xl",
}) {
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

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
        initial={{ opacity: 0, y: 18, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.985 }}
        transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className={[
          "my-auto w-full overflow-hidden rounded-2xl border border-slate-200/80 bg-white",
          "shadow-[0_24px_90px_-24px_rgba(15,23,42,0.45)]",
          size,
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4 sm:px-6">
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

        <div className="max-h-[75vh] overflow-y-auto">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   FEEDBACK DETAIL / REPLY MODAL
========================================================= */

function FeedbackDetailsModal({
  feedback,
  onClose,
  onStatusChange,
  onSaveReply,
}) {
  const [reply, setReply] = useState(feedback?.response || "");
  const [replyError, setReplyError] = useState("");

  if (!feedback) return null;

  function submitReply(event) {
    event.preventDefault();

    if (!reply.trim()) {
      setReplyError("Please enter a response before saving.");
      return;
    }

    onSaveReply(feedback.id, reply.trim());
    setReplyError("");
  }

  return (
    <ModalShell
      title="Feedback Details"
      subtitle={`Feedback ID: ${feedback.id}`}
      icon={MessageSquareText}
      onClose={onClose}
      size="max-w-3xl"
    >
      <div className="p-5 sm:p-6">
        {/* STUDENT / RATING */}
        <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:flex-row sm:items-center">
          <div
            className={[
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-base font-extrabold",
              getAvatarTheme(feedback.student),
            ].join(" ")}
          >
            {getInitials(feedback.student)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={feedback.status} />
              <span className="text-xs font-semibold text-slate-400">
                {feedback.source}
              </span>
            </div>

            <h3 className="mt-2 text-lg font-bold text-slate-900">
              {feedback.student}
            </h3>

            <p className="mt-1 break-all text-sm text-slate-500">
              {feedback.email}
            </p>

            <div className="mt-2 flex flex-wrap items-center gap-2">
              <StarRating rating={feedback.rating} />
              <span className="text-xs font-bold text-slate-700">
                {feedback.rating}.0 / 5
              </span>
            </div>
          </div>
        </div>

        {/* META DETAILS */}
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {[
            {
              label: "Course",
              value: feedback.course,
              icon: GraduationCap,
            },
            {
              label: "Trainer",
              value: feedback.trainer,
              icon: Users,
            },
            {
              label: "Feedback Category",
              value: feedback.category,
              icon: MessageSquareText,
            },
            {
              label: "Submitted On",
              value: formatDate(feedback.date),
              icon: CalendarDays,
            },
          ].map((item) => {
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
                    {item.value || "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* MESSAGE */}
        <div className="mt-5 rounded-2xl border border-slate-200 p-4 sm:p-5">
          <div className="flex items-center gap-2">
            <MessageSquareText size={17} className="text-[#F4512B]" />
            <h4 className="text-sm font-bold text-slate-900">
              Student Feedback
            </h4>
          </div>

          <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-600">
            {feedback.message}
          </p>
        </div>

        {/* STATUS CONTROL */}
        <div className="mt-5">
          <p className="mb-2 text-sm font-semibold text-slate-700">
            Feedback Status
          </p>

          <PremiumDropdown
            value={feedback.status}
            onChange={(nextStatus) =>
              onStatusChange(feedback.id, nextStatus)
            }
            options={STATUS_OPTIONS.map((status) => ({
              label: status,
              value: status,
            }))}
            searchable={false}
          />
        </div>

        {/* ADMIN RESPONSE */}
        <form onSubmit={submitReply} className="mt-5">
          <div className="flex items-center justify-between gap-3">
            <label
              htmlFor="admin-feedback-reply"
              className="text-sm font-semibold text-slate-700"
            >
              Admin Response
            </label>

            {feedback.response && (
              <span className="text-xs font-semibold text-emerald-700">
                Response saved
              </span>
            )}
          </div>

          <textarea
            id="admin-feedback-reply"
            value={reply}
            onChange={(event) => {
              setReply(event.target.value);
              setReplyError("");
            }}
            rows={4}
            placeholder="Write a helpful response to the student..."
            className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3.5 py-3 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
          />

          {replyError && (
            <p className="mt-2 text-xs font-medium text-rose-600">
              {replyError}
            </p>
          )}

          <div className="mt-4 flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-4 sm:flex-row">
            <ActionButton onClick={onClose}>
              Close
            </ActionButton>

            <ActionButton type="submit" variant="primary">
              <Check size={16} />
              Save Response
            </ActionButton>
          </div>
        </form>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({ label, value, note, icon: Icon, tone = "orange" }) {
  const tones = {
    orange: "border-orange-100 bg-orange-50 text-[#F4512B]",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/70 transition duration-200 hover:-translate-y-0.5 hover:shadow-md sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>
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

      <p className="mt-3 text-xs leading-5 text-slate-400">{note}</p>
    </motion.div>
  );
}

/* =========================================================
   RATING DISTRIBUTION
========================================================= */

function RatingDistribution({ feedbacks, selectedRating, onSelect }) {
  const total = feedbacks.length || 1;

  const distributions = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedbacks.filter((item) => item.rating === rating).length,
  }));

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-bold text-slate-900">
            Rating Distribution
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Select a rating to filter feedback
          </p>
        </div>

        <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-amber-100 bg-amber-50 text-amber-600">
          <Star size={19} />
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        {distributions.map(({ rating, count }) => {
          const percentage = (count / total) * 100;
          const active = selectedRating === String(rating);

          return (
            <button
              key={rating}
              type="button"
              onClick={() =>
                onSelect(active ? "All" : String(rating))
              }
              className={[
                "flex w-full items-center gap-3 rounded-lg px-2 py-1.5 text-left transition",
                active
                  ? "bg-orange-50 ring-1 ring-orange-100"
                  : "hover:bg-slate-50",
              ].join(" ")}
            >
              <span className="flex w-8 shrink-0 items-center gap-1 text-xs font-bold text-slate-600">
                {rating}
                <Star size={11} className="fill-amber-400 text-amber-400" />
              </span>

              <span className="h-2.5 flex-1 overflow-hidden rounded-full bg-slate-100">
                <motion.span
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className={[
                    "block h-full rounded-full",
                    active ? "bg-[#F4512B]" : "bg-amber-400",
                  ].join(" ")}
                />
              </span>

              <span className="w-7 shrink-0 text-right text-xs font-semibold tabular-nums text-slate-500">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onReset }) {
  return (
    <div className="px-5 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#F4512B]">
        <MessageSquareText size={25} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No feedback found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        No feedback matches the current search and filter settings.
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
   MAIN PAGE
========================================================= */

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Use the demo records if local storage is unavailable.
    }

    return INITIAL_FEEDBACK;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);

  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(feedbacks));
    } catch {
      // The page remains usable if storage is disabled.
    }
  }, [feedbacks]);

  const filteredFeedback = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = feedbacks.filter((feedback) => {
      const matchesSearch =
        !query ||
        [
          feedback.id,
          feedback.student,
          feedback.email,
          feedback.course,
          feedback.trainer,
          feedback.category,
          feedback.message,
          feedback.response,
          feedback.source,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" || feedback.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" ||
        feedback.category === categoryFilter;

      const matchesRating =
        ratingFilter === "All" ||
        feedback.rating === Number(ratingFilter);

      return (
        matchesSearch &&
        matchesStatus &&
        matchesCategory &&
        matchesRating
      );
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return String(a.date || "").localeCompare(String(b.date || ""));

        case "rating-desc":
          return Number(b.rating) - Number(a.rating);

        case "rating-asc":
          return Number(a.rating) - Number(b.rating);

        case "name-asc":
          return a.student.localeCompare(b.student);

        case "newest":
        default:
          return String(b.date || "").localeCompare(String(a.date || ""));
      }
    });

    return result;
  }, [
    feedbacks,
    search,
    statusFilter,
    categoryFilter,
    ratingFilter,
    sortBy,
  ]);

  const averageRating =
    feedbacks.length > 0
      ? (
        feedbacks.reduce(
          (total, item) => total + Number(item.rating || 0),
          0
        ) / feedbacks.length
      ).toFixed(1)
      : "—";

  const unresolvedCount = feedbacks.filter(
    (item) => item.status !== "Resolved"
  ).length;

  const resolvedCount = feedbacks.filter(
    (item) => item.status === "Resolved"
  ).length;

  const fiveStarCount = feedbacks.filter(
    (item) => item.rating === 5
  ).length;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredFeedback.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const visibleFeedback = filteredFeedback.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const activeFiltersCount = [
    statusFilter !== "All",
    categoryFilter !== "All",
    ratingFilter !== "All",
  ].filter(Boolean).length;

  const hasFilters =
    Boolean(search.trim()) || activeFiltersCount > 0;

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, categoryFilter, ratingFilter, sortBy]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setRatingFilter("All");
    setSortBy("newest");
    setPage(1);
  }

  function updateFeedbackStatus(feedbackId, status) {
    setFeedbacks((current) =>
      current.map((item) =>
        item.id === feedbackId ? { ...item, status } : item
      )
    );

    setSelectedFeedback((current) =>
      current?.id === feedbackId
        ? { ...current, status }
        : current
    );

    const record = feedbacks.find((item) => item.id === feedbackId);

    setNotice({
      type: "success",
      message: `${record?.student || "Feedback"} status changed to ${status}.`,
    });
  }

  function saveFeedbackResponse(feedbackId, response) {
    setFeedbacks((current) =>
      current.map((item) =>
        item.id === feedbackId
          ? {
            ...item,
            response,
            status:
              item.status === "Resolved"
                ? "Resolved"
                : "Under Review",
          }
          : item
      )
    );

    setSelectedFeedback((current) =>
      current?.id === feedbackId
        ? {
          ...current,
          response,
          status:
            current.status === "Resolved"
              ? "Resolved"
              : "Under Review",
        }
        : current
    );

    setNotice({
      type: "success",
      message: "Admin response saved successfully.",
    });
  }

  function exportCSV() {
    const headers = [
      "Feedback ID",
      "Student",
      "Email",
      "Course",
      "Trainer",
      "Category",
      "Rating",
      "Date",
      "Status",
      "Source",
      "Message",
      "Admin Response",
    ];

    const rows = filteredFeedback.map((item) => [
      item.id,
      item.student,
      item.email,
      item.course,
      item.trainer,
      item.category,
      item.rating,
      item.date,
      item.status,
      item.source,
      item.message,
      item.response,
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
    link.download = `codefaculty-feedback-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    setNotice({
      type: "success",
      message: `${filteredFeedback.length} feedback records exported to CSV.`,
    });
  }

  return (
    <div className="feedback-admin-page min-w-0 bg-[#F8FAFC] px-4 py-5 text-slate-800 sm:px-6 sm:py-6 xl:px-8">
      <FeedbackPremiumStyles />

      <div className="mx-auto w-full max-w-[1600px]">
        {/* HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 9 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
        >
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              <MessageSquareText size={14} className="text-[#F4512B]" />
              Administration
              <span className="text-slate-300">/</span>
              Student Experience
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Feedback & Reviews
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Review student feedback, monitor satisfaction, respond to
              concerns and track resolution status from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={exportCSV}>
              <Download size={16} />
              Export CSV
            </ActionButton>
          </div>
        </motion.section>

        {/* NOTICE */}
        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -5, height: 0 }}
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
                  aria-label="Dismiss notification"
                  className="rounded-md p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
                >
                  <X size={16} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* STAT CARDS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Feedback"
            value={formatNumber(feedbacks.length)}
            note="All submitted feedback records"
            icon={MessageSquareText}
            tone="orange"
          />

          <StatCard
            label="Average Rating"
            value={averageRating}
            note="Average student rating out of 5"
            icon={Star}
            tone="blue"
          />

          <StatCard
            label="Needs Attention"
            value={formatNumber(unresolvedCount)}
            note="New and under-review feedback"
            icon={AlertCircle}
            tone="violet"
          />

          <StatCard
            label="Resolved"
            value={formatNumber(resolvedCount)}
            note={`${fiveStarCount} five-star reviews received`}
            icon={BadgeCheck}
            tone="green"
          />
        </div>

        {/* STATUS OVERVIEW */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm shadow-slate-100/50 sm:px-5">
          {[
            {
              label: "New",
              count: feedbacks.filter((item) => item.status === "New").length,
              dot: "bg-[#F4512B]",
            },
            {
              label: "Under Review",
              count: feedbacks.filter(
                (item) => item.status === "Under Review"
              ).length,
              dot: "bg-blue-500",
            },
            {
              label: "Resolved",
              count: resolvedCount,
              dot: "bg-emerald-500",
            },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-2 text-sm font-semibold text-slate-600"
            >
              <span className={`h-2.5 w-2.5 rounded-full ${item.dot}`} />

              {item.label}

              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold tabular-nums text-slate-700">
                {item.count}
              </span>
            </div>
          ))}

          <div className="ml-auto hidden items-center gap-2 text-xs font-medium text-slate-400 md:flex">
            <ShieldCheck size={14} className="text-[#F4512B]" />
            Review management
          </div>
        </div>

        {/* RATING CHART + RECENT SNAPSHOT */}
        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <RatingDistribution
            feedbacks={feedbacks}
            selectedRating={ratingFilter}
            onSelect={setRatingFilter}
          />

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">
                  Feedback Overview
                </h3>

                <p className="mt-1 text-xs text-slate-400">
                  Current response and satisfaction snapshot
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                <BarChart3 size={19} />
              </div>
            </div>

            <div className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    Resolved feedback
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    {feedbacks.length
                      ? Math.round((resolvedCount / feedbacks.length) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${feedbacks.length
                        ? (resolvedCount / feedbacks.length) * 100
                        : 0
                        }%`,
                    }}
                    transition={{ duration: 0.45 }}
                    className="h-full rounded-full bg-emerald-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm font-medium text-slate-600">
                    Five-star feedback
                  </span>

                  <span className="text-sm font-bold text-slate-800">
                    {feedbacks.length
                      ? Math.round((fiveStarCount / feedbacks.length) * 100)
                      : 0}
                    %
                  </span>
                </div>

                <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${feedbacks.length
                        ? (fiveStarCount / feedbacks.length) * 100
                        : 0
                        }%`,
                    }}
                    transition={{ duration: 0.45 }}
                    className="h-full rounded-full bg-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <Users size={14} />
                    Student reviews
                  </div>

                  <p className="mt-2 text-xl font-extrabold text-slate-900">
                    {formatNumber(feedbacks.length)}
                  </p>
                </div>

                <div className="rounded-xl border border-slate-100 bg-slate-50/70 p-3.5">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
                    <ThumbsUp size={14} />
                    Saved responses
                  </div>

                  <p className="mt-2 text-xl font-extrabold text-slate-900">
                    {formatNumber(
                      feedbacks.filter((item) => item.response?.trim()).length
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH / FILTERS */}
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
                placeholder="Search student, course, trainer, feedback ID..."
                aria-label="Search feedback"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#F4512B] focus:bg-white focus:ring-4 focus:ring-orange-100"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
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
                    { label: "New", value: "New" },
                    { label: "Under Review", value: "Under Review" },
                    { label: "Resolved", value: "Resolved" },
                  ]}
                />
              </div>

              <div className="min-w-0 xl:w-48">
                <PremiumDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort feedback"
                  options={SORT_OPTIONS}
                />
              </div>

              <ActionButton
                onClick={() => setShowFilters((current) => !current)}
                className="relative"
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

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-visible"
              >
                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                  <div className="min-w-0">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Feedback category
                    </p>

                    <PremiumDropdown
                      value={categoryFilter}
                      onChange={setCategoryFilter}
                      placeholder="All categories"
                      options={[
                        { label: "All Categories", value: "All" },
                        ...CATEGORY_OPTIONS.map((item) => ({
                          label: item,
                          value: item,
                        })),
                      ]}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Star rating
                    </p>

                    <PremiumDropdown
                      value={ratingFilter}
                      onChange={setRatingFilter}
                      placeholder="All ratings"
                      searchable={false}
                      options={[
                        { label: "All Ratings", value: "All" },
                        { label: "5 stars", value: "5" },
                        { label: "4 stars", value: "4" },
                        { label: "3 stars", value: "3" },
                        { label: "2 stars", value: "2" },
                        { label: "1 star", value: "1" },
                      ]}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* TABLE HEADER */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">
              Feedback Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredFeedback.length === 0
                  ? 0
                  : (safePage - 1) * PAGE_SIZE + 1}
                {"–"}
                {Math.min(
                  safePage * PAGE_SIZE,
                  filteredFeedback.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {formatNumber(filteredFeedback.length)}
              </span>{" "}
              records
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ArrowDownUp size={14} />

            Sorted by{" "}

            <span className="font-semibold text-slate-600">
              {{
                newest: "Newest first",
                oldest: "Oldest first",
                "rating-desc": "Highest rating",
                "rating-asc": "Lowest rating",
                "name-asc": "Student name",
              }[sortBy]}
            </span>
          </div>
        </div>

        {/* FEEDBACK TABLE */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/50">
          <div className="feedback-table-scroll">
            <table className="w-full min-w-[1080px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  {[
                    "STUDENT",
                    "FEEDBACK",
                    "RATING",
                    "CATEGORY",
                    "DATE",
                    "STATUS",
                    "ACTIONS",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className="whitespace-nowrap px-4 py-4 text-[10px] font-extrabold tracking-[0.12em] text-slate-400"
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {visibleFeedback.map((feedback, index) => (
                    <motion.tr
                      key={feedback.id}
                      layout
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      transition={{
                        duration: 0.18,
                        delay: Math.min(index * 0.02, 0.08),
                      }}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-orange-50/30"
                    >
                      {/* STUDENT */}
                      <td className="px-4 py-4">
                        <div className="flex min-w-[190px] items-center gap-3">
                          <div
                            className={[
                              "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-extrabold",
                              getAvatarTheme(feedback.student),
                            ].join(" ")}
                          >
                            {getInitials(feedback.student)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">
                              {feedback.student}
                            </p>

                            <p className="mt-1 text-xs text-slate-400">
                              {feedback.id}
                            </p>

                            <p className="mt-1 max-w-[210px] truncate text-xs text-slate-500">
                              {feedback.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* FEEDBACK */}
                      <td className="max-w-[270px] px-4 py-4">
                        <p className="max-w-[270px] truncate text-sm font-semibold text-slate-700">
                          {feedback.course}
                        </p>

                        <p
                          title={feedback.message}
                          className="mt-1 max-w-[270px] overflow-hidden text-ellipsis text-xs leading-5 text-slate-500"
                          style={{
                            display: "-webkit-box",
                            WebkitBoxOrient: "vertical",
                            WebkitLineClamp: 2,
                          }}
                        >
                          {feedback.message}
                        </p>

                        <p className="mt-1.5 truncate text-[11px] font-medium text-slate-400">
                          Trainer: {feedback.trainer}
                        </p>
                      </td>

                      {/* RATING */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex flex-col gap-1.5">
                          <StarRating rating={feedback.rating} size={13} />

                          <span className="text-xs font-bold tabular-nums text-slate-600">
                            {feedback.rating}.0 / 5
                          </span>
                        </div>
                      </td>

                      {/* CATEGORY */}
                      <td className="px-4 py-4">
                        <span className="inline-flex max-w-[155px] items-center rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs font-semibold text-slate-600">
                          {feedback.category}
                        </span>
                      </td>

                      {/* DATE */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                          <CalendarDays size={13} className="text-slate-400" />
                          {formatDate(feedback.date)}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <StatusBadge status={feedback.status} />
                      </td>

                      {/* ACTIONS */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedFeedback(feedback)}
                            title="View feedback and reply"
                            aria-label={`View ${feedback.id}`}
                            className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-orange-200 bg-orange-50 px-2.5 text-xs font-bold text-[#F4512B] transition hover:bg-[#F4512B] hover:text-white"
                          >
                            <Eye size={14} />
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              const nextStatus =
                                feedback.status === "Resolved"
                                  ? "Under Review"
                                  : "Resolved";

                              updateFeedbackStatus(
                                feedback.id,
                                nextStatus
                              );
                            }}
                            title={
                              feedback.status === "Resolved"
                                ? "Reopen feedback"
                                : "Mark as resolved"
                            }
                            aria-label={`Update status for ${feedback.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                          >
                            {feedback.status === "Resolved" ? (
                              <RefreshCw size={15} />
                            ) : (
                              <CheckCircle2 size={15} />
                            )}
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {visibleFeedback.length === 0 && (
            <EmptyState onReset={resetFilters} />
          )}

          {/* TABLE FOOTER */}
          {filteredFeedback.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-slate-400">
                Feedback records are shown according to the selected filters.
              </p>

              <div className="flex items-center gap-1.5">
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
            Feedback statuses and admin responses are stored in this browser
            using local storage. This demo page is not yet connected to the
            backend, and responses are not sent to students automatically.
          </p>
        </div>
      </div>

      {/* FEEDBACK DETAIL MODAL */}
      <AnimatePresence>
        {selectedFeedback && (
          <FeedbackDetailsModal
            key={selectedFeedback.id}
            feedback={
              feedbacks.find(
                (item) => item.id === selectedFeedback.id
              ) || selectedFeedback
            }
            onClose={() => setSelectedFeedback(null)}
            onStatusChange={updateFeedbackStatus}
            onSaveReply={saveFeedbackResponse}
          />
        )}
      </AnimatePresence>
    </div>
  );
}