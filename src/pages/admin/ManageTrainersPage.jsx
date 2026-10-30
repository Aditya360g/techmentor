import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDownUp,
  Award,
  Ban,
  BadgeCheck,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Star,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   CODEFACULTY — ADMIN TRAINER MANAGEMENT
   Premium orange + white design
========================================================= */

const STORAGE_KEY = "codefaculty_admin_trainers_v3";
const PAGE_SIZE = 6;

const EXPERTISE_OPTIONS = [
  "React & Frontend",
  "Python & AI/ML",
  "Java & DSA",
  "Data Science",
  "Cloud & DevOps",
  "UI/UX Design",
  "Full Stack Development",
  "Cybersecurity",
  "Mobile App Development",
  "Database & SQL",
];

const STATUS_OPTIONS = ["Active", "Pending", "Inactive"];

const INITIAL_TRAINERS = [
  {
    id: "TR-1001",
    name: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    phone: "+91 98765 43210",
    city: "Jaipur",
    state: "Rajasthan",
    expertise: "React & Frontend",
    experience: 6,
    status: "Active",
    rating: 4.9,
    students: 186,
    courses: 5,
    joinedAt: "2025-06-14",
    bio: "Frontend mentor focused on React, JavaScript, UI architecture and industry-oriented project development.",
  },
  {
    id: "TR-1002",
    name: "Priya Verma",
    email: "priya.verma@example.com",
    phone: "+91 98123 45670",
    city: "Delhi",
    state: "Delhi",
    expertise: "Python & AI/ML",
    experience: 5,
    status: "Active",
    rating: 4.8,
    students: 142,
    courses: 4,
    joinedAt: "2025-07-09",
    bio: "Python and machine learning mentor with a focus on practical AI projects and problem-solving.",
  },
  {
    id: "TR-1003",
    name: "Amit Singh",
    email: "amit.singh@example.com",
    phone: "+91 97654 32109",
    city: "Lucknow",
    state: "Uttar Pradesh",
    expertise: "Java & DSA",
    experience: 7,
    status: "Active",
    rating: 4.9,
    students: 224,
    courses: 6,
    joinedAt: "2025-08-20",
    bio: "Java and data structures mentor specializing in coding interviews, algorithms and competitive programming.",
  },
  {
    id: "TR-1004",
    name: "Neha Gupta",
    email: "neha.gupta@example.com",
    phone: "+91 99887 76655",
    city: "Pune",
    state: "Maharashtra",
    expertise: "Data Science",
    experience: 4,
    status: "Pending",
    rating: 4.6,
    students: 0,
    courses: 0,
    joinedAt: "2026-04-10",
    bio: "Data science mentor with experience in analytics, visualization, statistics and machine learning workflows.",
  },
  {
    id: "TR-1005",
    name: "Karan Mehta",
    email: "karan.mehta@example.com",
    phone: "+91 90909 12345",
    city: "Ahmedabad",
    state: "Gujarat",
    expertise: "Cloud & DevOps",
    experience: 8,
    status: "Active",
    rating: 4.8,
    students: 132,
    courses: 4,
    joinedAt: "2025-10-02",
    bio: "Cloud and DevOps mentor focused on CI/CD, Docker, cloud infrastructure and deployment practices.",
  },
  {
    id: "TR-1006",
    name: "Ananya Joshi",
    email: "ananya.joshi@example.com",
    phone: "+91 91234 56789",
    city: "Indore",
    state: "Madhya Pradesh",
    expertise: "UI/UX Design",
    experience: 5,
    status: "Active",
    rating: 4.7,
    students: 97,
    courses: 3,
    joinedAt: "2025-11-12",
    bio: "UI/UX mentor specializing in design systems, user research, wireframing and interactive prototypes.",
  },
  {
    id: "TR-1007",
    name: "Vikas Patel",
    email: "vikas.patel@example.com",
    phone: "+91 93456 78901",
    city: "Kolkata",
    state: "West Bengal",
    expertise: "Full Stack Development",
    experience: 6,
    status: "Inactive",
    rating: 4.5,
    students: 76,
    courses: 2,
    joinedAt: "2025-03-19",
    bio: "Full-stack development mentor with experience in web applications, APIs and database integration.",
  },
  {
    id: "TR-1008",
    name: "Simran Kaur",
    email: "simran.kaur@example.com",
    phone: "+91 90011 22334",
    city: "Chandigarh",
    state: "Chandigarh",
    expertise: "Python & AI/ML",
    experience: 3,
    status: "Pending",
    rating: 0,
    students: 0,
    courses: 0,
    joinedAt: "2026-05-16",
    bio: "AI and Python educator interested in practical machine learning, data analysis and project-based learning.",
  },
  {
    id: "TR-1009",
    name: "Mohit Agarwal",
    email: "mohit.agarwal@example.com",
    phone: "+91 98760 11223",
    city: "Bengaluru",
    state: "Karnataka",
    expertise: "Database & SQL",
    experience: 9,
    status: "Active",
    rating: 4.9,
    students: 205,
    courses: 5,
    joinedAt: "2025-12-01",
    bio: "Database mentor focused on SQL, query optimization, data modelling and scalable database design.",
  },
];

const EMPTY_TRAINER = {
  name: "",
  email: "",
  phone: "",
  city: "",
  state: "",
  expertise: EXPERTISE_OPTIONS[0],
  experience: "1",
  status: "Pending",
  bio: "",
};

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

function avatarTheme(value = "") {
  const themes = [
    "border-orange-100 bg-orange-50 text-[#E94B28]",
    "border-blue-100 bg-blue-50 text-blue-700",
    "border-emerald-100 bg-emerald-50 text-emerald-700",
    "border-violet-100 bg-violet-50 text-violet-700",
    "border-amber-100 bg-amber-50 text-amber-700",
    "border-cyan-100 bg-cyan-50 text-cyan-700",
  ];

  const hash = value
    .split("")
    .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  return themes[hash % themes.length];
}

function escapeCSV(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

/* =========================================================
   PREMIUM SCROLLBAR STYLES
========================================================= */

function TrainerPremiumStyles() {
  return (
    <style>{`
      .manage-trainers-page {
        color: #1e293b;
        scrollbar-color: #f3a58f #f8fafc;
        scrollbar-width: thin;
      }

      .manage-trainers-page *,
      .trainer-premium-menu,
      .trainer-premium-menu * {
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .manage-trainers-page ::-webkit-scrollbar,
      .trainer-premium-menu::-webkit-scrollbar,
      .trainer-premium-menu *::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .manage-trainers-page ::-webkit-scrollbar-track,
      .trainer-premium-menu::-webkit-scrollbar-track,
      .trainer-premium-menu *::-webkit-scrollbar-track {
        background: #fff7f3;
        border-radius: 999px;
      }

      .manage-trainers-page ::-webkit-scrollbar-thumb,
      .trainer-premium-menu::-webkit-scrollbar-thumb,
      .trainer-premium-menu *::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #f5b39f, #f4512b);
        border: 2px solid #fff7f3;
        border-radius: 999px;
      }

      .manage-trainers-page ::-webkit-scrollbar-thumb:hover,
      .trainer-premium-menu::-webkit-scrollbar-thumb:hover,
      .trainer-premium-menu *::-webkit-scrollbar-thumb:hover {
        background: #df3f1b;
      }

      .trainer-premium-menu {
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      .trainer-premium-menu button {
        -webkit-tap-highlight-color: transparent;
      }

      @media (prefers-reduced-motion: reduce) {
        .manage-trainers-page *,
        .manage-trainers-page *::before,
        .manage-trainers-page *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}

/* =========================================================
   PREMIUM DROPDOWN
   Custom animated menu rendered using a portal
========================================================= */

function PremiumDropdown({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
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
      Math.max(rect.width, 224),
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

    top = Math.max(8, Math.min(top, viewportHeight - maxHeight - 8));

    setPosition({
      top,
      left,
      width,
      maxHeight,
      openUp,
    });
  }

  function openDropdown() {
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

    const handleResizeOrScroll = () => updatePosition();

    const handleOutside = (event) => {
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
        event.key === "ArrowDown" &&
        menuRef.current?.contains(document.activeElement)
      ) {
        event.preventDefault();

        const items = menuRef.current.querySelectorAll(
          '[role="option"]'
        );

        const currentIndex = Array.from(items).indexOf(
          document.activeElement
        );

        items[Math.min(currentIndex + 1, items.length - 1)]?.focus();
      }

      if (
        event.key === "ArrowUp" &&
        menuRef.current?.contains(document.activeElement)
      ) {
        event.preventDefault();

        const items = menuRef.current.querySelectorAll(
          '[role="option"]'
        );

        const currentIndex = Array.from(items).indexOf(
          document.activeElement
        );

        items[Math.max(currentIndex - 1, 0)]?.focus();
      }
    };

    window.addEventListener("resize", handleResizeOrScroll);
    window.addEventListener("scroll", handleResizeOrScroll, true);
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKeys);

    return () => {
      window.removeEventListener("resize", handleResizeOrScroll);
      window.removeEventListener("scroll", handleResizeOrScroll, true);
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKeys);
    };
  }, [open]);

  useEffect(() => {
    if (open && showSearch) {
      const timer = window.setTimeout(() => {
        searchRef.current?.focus();
      }, 50);

      return () => window.clearTimeout(timer);
    }

    return undefined;
  }, [open, showSearch]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={openDropdown}
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
              className="trainer-premium-menu overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_22px_60px_-20px_rgba(15,23,42,0.36)] ring-1 ring-black/[0.025]"
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
                      placeholder="Search options..."
                      aria-label="Search options"
                      onKeyDown={(event) => {
                        if (event.key === "Escape") setOpen(false);
                      }}
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                )}
              </div>

              <div
                className="overflow-y-auto p-1.5"
                style={{
                  maxHeight: Math.max(
                    75,
                    position.maxHeight - (showSearch ? 91 : 45)
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
   BUTTON
========================================================= */

function ActionButton({
  children,
  onClick,
  variant = "secondary",
  type = "button",
  className = "",
  disabled = false,
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
    Active: {
      icon: CheckCircle2,
      classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
    },
    Pending: {
      icon: Clock3,
      classes: "border-amber-200 bg-amber-50 text-amber-700",
    },
    Inactive: {
      icon: Ban,
      classes: "border-slate-200 bg-slate-100 text-slate-600",
    },
  };

  const config = configs[status] || configs.Pending;
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
   MODAL SHELL
========================================================= */

function ModalShell({
  title,
  subtitle,
  icon: Icon = Users,
  onClose,
  children,
  size = "max-w-3xl",
}) {
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
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
   FORM FIELDS
========================================================= */

function FormField({
  label,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  required = false,
  min,
  max,
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-[#F4512B]">*</span>}
      </span>

      <input
        name={name}
        value={value ?? ""}
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        required={required}
        min={min}
        max={max}
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
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
  return (
    <div className="min-w-0">
      <p className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-[#F4512B]">*</span>}
      </p>

      <PremiumDropdown
        value={value}
        onChange={onChange}
        options={options}
        placeholder={label}
      />
    </div>
  );
}

/* =========================================================
   TRAINER FORM MODAL
========================================================= */

function TrainerFormModal({ trainer, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_TRAINER,
    ...(trainer || {}),
    experience: String(trainer?.experience ?? 1),
  }));

  const [error, setError] = useState("");

  function setField(name, value) {
    setForm((current) => ({
      ...current,
      [name]: value,
    }));
    setError("");
  }

  function handleInputChange(event) {
    setField(event.target.name, event.target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (Number(form.experience) < 0 || Number(form.experience) > 60) {
      setError("Experience must be between 0 and 60 years.");
      return;
    }

    const result = onSave({
      ...form,
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      expertise: form.expertise,
      experience: Number(form.experience),
      bio: form.bio.trim(),
    });

    if (result?.error) setError(result.error);
  }

  return (
    <ModalShell
      title={trainer ? "Edit Trainer Profile" : "Add New Trainer"}
      subtitle={
        trainer
          ? "Update professional information and account status."
          : "Add a mentor to the CodeFaculty trainer directory."
      }
      icon={GraduationCap}
      onClose={onClose}
      size="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#F4512B]">
            01 — Personal information
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Basic details used to identify and contact the trainer.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="Full Name"
            name="name"
            value={form.name}
            onChange={handleInputChange}
            placeholder="Enter trainer full name"
            required
          />

          <FormField
            label="Professional Email"
            name="email"
            value={form.email}
            onChange={handleInputChange}
            type="email"
            placeholder="trainer@example.com"
            required
          />

          <FormField
            label="Phone Number"
            name="phone"
            value={form.phone}
            onChange={handleInputChange}
            type="tel"
            placeholder="+91 98765 43210"
            required
          />

          <FormField
            label="City"
            name="city"
            value={form.city}
            onChange={handleInputChange}
            placeholder="Enter city"
            required
          />

          <FormField
            label="State"
            name="state"
            value={form.state}
            onChange={handleInputChange}
            placeholder="Enter state"
            required
          />

          <FormField
            label="Experience (years)"
            name="experience"
            value={form.experience}
            onChange={handleInputChange}
            type="number"
            min="0"
            max="60"
            required
          />
        </div>

        <div className="mb-4 mt-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#F4512B]">
            02 — Professional profile
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Set the trainer's subject area and account status.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            label="Primary Expertise"
            value={form.expertise}
            onChange={(value) => setField("expertise", value)}
            options={EXPERTISE_OPTIONS.map((item) => ({
              label: item,
              value: item,
            }))}
            required
          />

          <FormSelect
            label="Account Status"
            value={form.status}
            onChange={(value) => setField("status", value)}
            options={STATUS_OPTIONS.map((item) => ({
              label: item,
              value: item,
            }))}
            required
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Professional Bio
          </span>

          <textarea
            name="bio"
            value={form.bio}
            onChange={handleInputChange}
            rows={4}
            placeholder="Describe the trainer's experience, teaching focus and strengths..."
            className="w-full resize-y rounded-xl border border-slate-200 px-3.5 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
          />
        </label>

        {error && (
          <div className="mt-4 flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
            <Ban size={17} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse justify-end gap-2 border-t border-slate-100 pt-5 sm:flex-row">
          <ActionButton onClick={onClose}>
            Cancel
          </ActionButton>

          <ActionButton type="submit" variant="primary">
            <Check size={16} />
            {trainer ? "Save Changes" : "Create Trainer"}
          </ActionButton>
        </div>
      </form>
    </ModalShell>
  );
}

/* =========================================================
   DETAIL ITEM
========================================================= */

function DetailItem({ icon: Icon, label, value }) {
  return (
    <div className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-slate-500 shadow-sm">
        <Icon size={17} />
      </div>

      <div className="min-w-0">
        <p className="text-xs font-medium text-slate-400">{label}</p>
        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
          {value || "Not provided"}
        </p>
      </div>
    </div>
  );
}

/* =========================================================
   TRAINER DETAILS MODAL
========================================================= */

function TrainerDetailsModal({
  trainer,
  onClose,
  onEdit,
  onToggleStatus,
}) {
  if (!trainer) return null;

  return (
    <ModalShell
      title="Trainer Profile"
      subtitle={`Trainer ID: ${trainer.id}`}
      icon={GraduationCap}
      onClose={onClose}
      size="max-w-3xl"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:flex-row sm:items-center">
          <div
            className={[
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border text-xl font-extrabold",
              avatarTheme(trainer.name),
            ].join(" ")}
          >
            {getInitials(trainer.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={trainer.status} />
              <span className="text-xs font-semibold text-slate-400">
                {trainer.id}
              </span>
            </div>

            <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
              {trainer.name}
            </h3>

            <p className="mt-1 text-sm font-medium text-[#F4512B]">
              {trainer.expertise}
            </p>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={14} />
              {trainer.city}, {trainer.state}
            </p>
          </div>

          <ActionButton onClick={() => onEdit(trainer)} className="shrink-0">
            <Pencil size={15} />
            Edit Profile
          </ActionButton>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            {
              label: "Experience",
              value: `${trainer.experience || 0} yrs`,
              icon: Award,
            },
            {
              label: "Students",
              value: formatNumber(trainer.students),
              icon: Users,
            },
            {
              label: "Courses",
              value: formatNumber(trainer.courses),
              icon: BookOpen,
            },
            {
              label: "Rating",
              value: trainer.rating ? trainer.rating.toFixed(1) : "New",
              icon: Star,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-sm"
              >
                <Icon size={18} className="text-[#F4512B]" />
                <p className="mt-3 text-xl font-extrabold tabular-nums text-slate-900">
                  {item.value}
                </p>
                <p className="mt-1 text-xs font-medium text-slate-500">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>

        <h4 className="mb-3 mt-6 text-xs font-extrabold uppercase tracking-[0.14em] text-slate-400">
          Contact information
        </h4>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <DetailItem
            icon={Mail}
            label="Professional Email"
            value={trainer.email}
          />
          <DetailItem
            icon={Phone}
            label="Phone Number"
            value={trainer.phone}
          />
          <DetailItem
            icon={MapPin}
            label="Location"
            value={`${trainer.city || "—"}, ${trainer.state || "—"}`}
          />
          <DetailItem
            icon={CalendarDays}
            label="Joined Date"
            value={formatDate(trainer.joinedAt)}
          />
        </div>

        {trainer.bio && (
          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
              Professional bio
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {trainer.bio}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => onToggleStatus(trainer)}
            className="inline-flex items-center gap-2 self-start rounded-lg px-2 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            {trainer.status === "Active" ? (
              <>
                <Ban size={16} />
                Deactivate Trainer
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Activate Trainer
              </>
            )}
          </button>

          <ActionButton onClick={onClose}>
            Close Profile
          </ActionButton>
        </div>
      </div>
    </ModalShell>
  );
}

/* =========================================================
   STAT CARD
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
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
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
   TRAINER CARD
========================================================= */

function TrainerCard({
  trainer,
  onView,
  onEdit,
  onToggleStatus,
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className="group flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/60 transition duration-200 hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-lg hover:shadow-orange-100/50 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div
          className={[
            "flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border text-base font-extrabold",
            avatarTheme(trainer.name),
          ].join(" ")}
        >
          {getInitials(trainer.name)}
        </div>

        <StatusBadge status={trainer.status} />
      </div>

      <div className="mt-4 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {trainer.id}
        </p>

        <h3
          className="mt-1 min-h-7 truncate text-base font-bold text-slate-900"
          title={trainer.name}
        >
          {trainer.name}
        </h3>

        <p
          className="mt-1 truncate text-sm font-semibold text-[#F4512B]"
          title={trainer.expertise}
        >
          {trainer.expertise}
        </p>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={14} className="shrink-0 text-slate-400" />
          <span className="truncate">
            {trainer.city}, {trainer.state}
          </span>
        </p>

        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500">
          <Mail size={14} className="shrink-0 text-slate-400" />
          <span className="truncate">{trainer.email}</span>
        </p>
      </div>

      <div className="my-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/70 py-3">
        <div className="px-2 text-center">
          <p className="text-lg font-extrabold tabular-nums text-slate-900">
            {trainer.experience || 0}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Years
          </p>
        </div>

        <div className="px-2 text-center">
          <p className="text-lg font-extrabold tabular-nums text-slate-900">
            {formatNumber(trainer.students)}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Students
          </p>
        </div>

        <div className="px-2 text-center">
          <p className="flex items-center justify-center gap-1 text-lg font-extrabold tabular-nums text-slate-900">
            <Star size={13} className="fill-amber-400 text-amber-400" />
            {trainer.rating ? trainer.rating.toFixed(1) : "—"}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Rating
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onView(trainer)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-[#F4512B]"
        >
          <Eye size={16} />
          View Profile
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(trainer)}
            aria-label={`Edit ${trainer.name}`}
            title="Edit trainer"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B]"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(trainer)}
            aria-label={
              trainer.status === "Active"
                ? `Deactivate ${trainer.name}`
                : `Activate ${trainer.name}`
            }
            title={
              trainer.status === "Active"
                ? "Deactivate trainer"
                : "Activate trainer"
            }
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B]"
          >
            {trainer.status === "Active" ? (
              <Ban size={15} />
            ) : (
              <CheckCircle2 size={15} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <CalendarDays size={13} />
        Joined {formatDate(trainer.joinedAt)}
      </div>
    </motion.article>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ hasFilters, onReset, onAdd }) {
  return (
    <div className="col-span-full rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#F4512B]">
        <Users size={25} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        {hasFilters ? "No matching trainers" : "No trainers yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or filters to find the trainer you are looking for."
          : "Add your first trainer to build the trainer directory."}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {hasFilters ? (
          <ActionButton onClick={onReset}>
            <RefreshCw size={15} />
            Reset Filters
          </ActionButton>
        ) : (
          <ActionButton variant="primary" onClick={onAdd}>
            <Plus size={16} />
            Add Trainer
          </ActionButton>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Use sample data if stored data cannot be read.
    }

    return INITIAL_TRAINERS;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [expertiseFilter, setExpertiseFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState(null);
  const [selectedTrainer, setSelectedTrainer] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(trainers));
    } catch {
      // Keep the page usable when local storage is unavailable.
    }
  }, [trainers]);

  const filteredTrainers = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = trainers.filter((trainer) => {
      const matchesSearch =
        !query ||
        [
          trainer.name,
          trainer.id,
          trainer.email,
          trainer.phone,
          trainer.city,
          trainer.state,
          trainer.expertise,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" || trainer.status === statusFilter;

      const matchesExpertise =
        expertiseFilter === "All" ||
        trainer.expertise === expertiseFilter;

      return matchesSearch && matchesStatus && matchesExpertise;
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return b.name.localeCompare(a.name);

        case "experience-desc":
          return Number(b.experience) - Number(a.experience);

        case "experience-asc":
          return Number(a.experience) - Number(b.experience);

        case "students-desc":
          return Number(b.students) - Number(a.students);

        case "rating-desc":
          return Number(b.rating) - Number(a.rating);

        case "newest":
          return String(b.joinedAt || "").localeCompare(
            String(a.joinedAt || "")
          );

        case "oldest":
          return String(a.joinedAt || "").localeCompare(
            String(b.joinedAt || "")
          );

        case "name-asc":
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return result;
  }, [trainers, search, statusFilter, expertiseFilter, sortBy]);

  const activeCount = trainers.filter(
    (trainer) => trainer.status === "Active"
  ).length;

  const pendingCount = trainers.filter(
    (trainer) => trainer.status === "Pending"
  ).length;

  const inactiveCount = trainers.filter(
    (trainer) => trainer.status === "Inactive"
  ).length;

  const activeTrainers = trainers.filter(
    (trainer) => trainer.status === "Active"
  );

  const averageRating =
    activeTrainers.filter((trainer) => Number(trainer.rating) > 0).length > 0
      ? (
        activeTrainers
          .filter((trainer) => Number(trainer.rating) > 0)
          .reduce((sum, trainer) => sum + Number(trainer.rating), 0) /
        activeTrainers.filter((trainer) => Number(trainer.rating) > 0).length
      ).toFixed(1)
      : "—";

  const totalStudents = trainers.reduce(
    (sum, trainer) => sum + Number(trainer.students || 0),
    0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTrainers.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const visibleTrainers = filteredTrainers.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const activeFiltersCount = [
    statusFilter !== "All",
    expertiseFilter !== "All",
  ].filter(Boolean).length;

  const hasFilters =
    Boolean(search.trim()) || activeFiltersCount > 0;

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, expertiseFilter, sortBy]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setExpertiseFilter("All");
    setSortBy("name-asc");
    setPage(1);
  }

  function openAddModal() {
    setEditingTrainer(null);
    setFormOpen(true);
  }

  function openEditModal(trainer) {
    setSelectedTrainer(null);
    setEditingTrainer(trainer);
    setFormOpen(true);
  }

  function saveTrainer(form) {
    const duplicateEmail = trainers.some(
      (trainer) =>
        trainer.email?.toLowerCase() === form.email?.toLowerCase() &&
        trainer.id !== editingTrainer?.id
    );

    if (duplicateEmail) {
      return {
        error: "This email is already registered to another trainer.",
      };
    }

    if (editingTrainer) {
      setTrainers((current) =>
        current.map((trainer) =>
          trainer.id === editingTrainer.id
            ? {
              ...trainer,
              ...form,
              id: editingTrainer.id,
            }
            : trainer
        )
      );

      setNotice({
        type: "success",
        message: `${form.name} has been updated successfully.`,
      });
    } else {
      const newTrainer = {
        ...form,
        id: `TR-${Date.now().toString().slice(-6)}`,
        rating: 0,
        students: 0,
        courses: 0,
        joinedAt: new Date().toISOString().slice(0, 10),
      };

      setTrainers((current) => [newTrainer, ...current]);

      setNotice({
        type: "success",
        message: `${form.name} has been added successfully.`,
      });
    }

    setFormOpen(false);
    setEditingTrainer(null);
    setPage(1);

    return { success: true };
  }

  function toggleTrainerStatus(trainer) {
    const nextStatus =
      trainer.status === "Active" ? "Inactive" : "Active";

    setTrainers((current) =>
      current.map((item) =>
        item.id === trainer.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setSelectedTrainer((current) =>
      current?.id === trainer.id
        ? { ...current, status: nextStatus }
        : current
    );

    setNotice({
      type: "success",
      message: `${trainer.name} is now ${nextStatus.toLowerCase()}.`,
    });
  }

  function exportCSV() {
    const headers = [
      "Trainer ID",
      "Name",
      "Email",
      "Phone",
      "City",
      "State",
      "Expertise",
      "Experience Years",
      "Status",
      "Rating",
      "Students",
      "Courses",
      "Joined At",
      "Bio",
    ];

    const rows = filteredTrainers.map((trainer) => [
      trainer.id,
      trainer.name,
      trainer.email,
      trainer.phone,
      trainer.city,
      trainer.state,
      trainer.expertise,
      trainer.experience,
      trainer.status,
      trainer.rating,
      trainer.students,
      trainer.courses,
      trainer.joinedAt,
      trainer.bio,
    ]);

    const csvContent = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `codefaculty-trainers-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    setNotice({
      type: "success",
      message: `${filteredTrainers.length} trainer records exported to CSV.`,
    });
  }

  return (
    <div className="manage-trainers-page min-w-0 bg-[#F8FAFC] px-4 py-5 sm:px-6 sm:py-6 xl:px-8">
      <TrainerPremiumStyles />

      <div className="mx-auto w-full max-w-[1600px]">
        {/* HEADER */}
        <motion.section
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center"
        >
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              <Users size={14} className="text-[#F4512B]" />
              Administration
              <span className="text-slate-300">/</span>
              People Management
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Manage Trainers
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage mentor profiles, professional expertise, account status
              and trainer engagement from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={exportCSV}>
              <Download size={16} />
              Export CSV
            </ActionButton>

            <ActionButton variant="primary" onClick={openAddModal}>
              <Plus size={17} />
              Add Trainer
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

        {/* STATS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Trainers"
            value={formatNumber(trainers.length)}
            note="All trainer records in the directory"
            icon={Users}
            tone="orange"
          />

          <StatCard
            label="Active Trainers"
            value={formatNumber(activeCount)}
            note={`${pendingCount} profiles awaiting review`}
            icon={BadgeCheck}
            tone="green"
          />

          <StatCard
            label="Students Covered"
            value={formatNumber(totalStudents)}
            note="Sample student count across trainer profiles"
            icon={GraduationCap}
            tone="blue"
          />

          <StatCard
            label="Average Rating"
            value={averageRating}
            note={`${inactiveCount} inactive trainer profiles`}
            icon={Star}
            tone="violet"
          />
        </div>

        {/* STATUS STRIP */}
        <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-3 rounded-2xl border border-slate-200 bg-white px-4 py-3.5 shadow-sm shadow-slate-100/50 sm:px-5">
          {[
            {
              label: "Active",
              count: activeCount,
              dot: "bg-emerald-500",
            },
            {
              label: "Pending",
              count: pendingCount,
              dot: "bg-amber-500",
            },
            {
              label: "Inactive",
              count: inactiveCount,
              dot: "bg-slate-400",
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
            Trainer directory
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
                placeholder="Search trainer, ID, expertise, email or city..."
                aria-label="Search trainers"
                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#F4512B] focus:bg-white focus:ring-4 focus:ring-orange-100"
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
                    { label: "Active", value: "Active" },
                    { label: "Pending", value: "Pending" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                />
              </div>

              <div className="min-w-0 xl:w-52">
                <PremiumDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort trainers"
                  options={[
                    { label: "Name: A to Z", value: "name-asc" },
                    { label: "Name: Z to A", value: "name-desc" },
                    {
                      label: "Experience: High to Low",
                      value: "experience-desc",
                    },
                    {
                      label: "Experience: Low to High",
                      value: "experience-asc",
                    },
                    {
                      label: "Students: High to Low",
                      value: "students-desc",
                    },
                    {
                      label: "Highest Rated",
                      value: "rating-desc",
                    },
                    { label: "Newest Trainers", value: "newest" },
                    { label: "Oldest Trainers", value: "oldest" },
                  ]}
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
                      Filter by expertise
                    </p>

                    <PremiumDropdown
                      value={expertiseFilter}
                      onChange={setExpertiseFilter}
                      placeholder="All expertise"
                      options={[
                        { label: "All Expertise", value: "All" },
                        ...EXPERTISE_OPTIONS.map((item) => ({
                          label: item,
                          value: item,
                        })),
                      ]}
                    />
                  </div>

                  <div className="flex items-end">
                    <div className="w-full rounded-xl border border-orange-100 bg-orange-50/60 p-3.5">
                      <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                        <Activity size={16} className="text-[#F4512B]" />
                        Current results
                      </div>

                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {formatNumber(filteredTrainers.length)} trainers match
                        your current search and filters.
                      </p>
                    </div>
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
              Trainer Directory
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredTrainers.length === 0
                  ? 0
                  : (safePage - 1) * PAGE_SIZE + 1}
                {"–"}
                {Math.min(safePage * PAGE_SIZE, filteredTrainers.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {formatNumber(filteredTrainers.length)}
              </span>{" "}
              trainers
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ArrowDownUp size={14} />
            Sorted by{" "}
            <span className="font-semibold text-slate-600">
              {{
                "name-asc": "Name (A–Z)",
                "name-desc": "Name (Z–A)",
                "experience-desc": "Experience (High–Low)",
                "experience-asc": "Experience (Low–High)",
                "students-desc": "Students (High–Low)",
                "rating-desc": "Rating (High–Low)",
                newest: "Newest",
                oldest: "Oldest",
              }[sortBy]}
            </span>
          </div>
        </div>

        {/* TRAINER GRID */}
        <motion.div
          layout
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visibleTrainers.map((trainer) => (
              <TrainerCard
                key={trainer.id}
                trainer={trainer}
                onView={setSelectedTrainer}
                onEdit={openEditModal}
                onToggleStatus={toggleTrainerStatus}
              />
            ))}
          </AnimatePresence>

          {visibleTrainers.length === 0 && (
            <EmptyState
              hasFilters={hasFilters}
              onReset={resetFilters}
              onAdd={openAddModal}
            />
          )}
        </motion.div>

        {/* PAGINATION */}
        {filteredTrainers.length > 0 && (
          <div className="mt-6 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-4 shadow-sm shadow-slate-100/50 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <p className="text-sm text-slate-500">
              Page{" "}
              <span className="font-bold text-slate-800">{safePage}</span>{" "}
              of{" "}
              <span className="font-bold text-slate-800">{totalPages}</span>
            </p>

            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() =>
                  setPage((current) => Math.max(1, current - 1))
                }
                aria-label="Previous page"
                className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft size={17} />
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
                .map((number, index, array) => (
                  <span key={number} className="contents">
                    {index > 0 && number - array[index - 1] > 1 && (
                      <span className="px-1 text-slate-400">…</span>
                    )}

                    <button
                      type="button"
                      onClick={() => setPage(number)}
                      aria-label={`Go to page ${number}`}
                      aria-current={
                        safePage === number ? "page" : undefined
                      }
                      className={[
                        "min-w-10 rounded-lg border px-3 py-2 text-sm font-semibold transition",
                        safePage === number
                          ? "border-[#F4512B] bg-[#F4512B] text-white shadow-sm shadow-orange-200"
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
                className="rounded-lg border border-slate-200 p-2.5 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight size={17} />
              </button>
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-xs leading-5 text-slate-400">
          <ShieldCheck size={15} className="mt-0.5 shrink-0" />
          <p>
            Trainer records are saved in this browser using local storage.
            This demo page is not yet connected to the backend or shared across
            admin users.
          </p>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {formOpen && (
          <TrainerFormModal
            key={editingTrainer?.id || "new-trainer"}
            trainer={editingTrainer}
            onClose={() => {
              setFormOpen(false);
              setEditingTrainer(null);
            }}
            onSave={saveTrainer}
          />
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedTrainer && (
          <TrainerDetailsModal
            key={selectedTrainer.id}
            trainer={
              trainers.find(
                (trainer) => trainer.id === selectedTrainer.id
              ) || selectedTrainer
            }
            onClose={() => setSelectedTrainer(null)}
            onEdit={openEditModal}
            onToggleStatus={toggleTrainerStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}