import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDownLeft,
  ArrowDownUp,
  ArrowUpRight,
  BadgeIndianRupee,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  IndianRupee,
  Landmark,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Smartphone,
  Wallet,
  X,
  AlertCircle,
  ArrowRight,
} from "lucide-react";

/* =========================================================
   CODEFACULTY — ADMIN PAYMENTS
   Premium Orange + White Theme
   Responsive transaction management
   Demo data is stored in browser localStorage.
========================================================= */

const STORAGE_KEY = "codefaculty_admin_payments_v3";
const PAGE_SIZE = 8;

const PAYMENT_STATUSES = ["Paid", "Pending", "Failed", "Refunded"];

const PAYMENT_METHODS = [
  "UPI",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Wallet",
];

const PAYMENT_PURPOSES = [
  "Course Fee",
  "Training Program",
  "Placement Preparation",
  "Subscription",
  "Workshop",
  "Certification",
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Highest amount", value: "amount-high" },
  { label: "Lowest amount", value: "amount-low" },
  { label: "Student: A to Z", value: "student-asc" },
];

/* =========================================================
   DEMO TRANSACTIONS
========================================================= */

const INITIAL_PAYMENTS = [
  {
    id: "PAY-8101",
    orderId: "ORD-51001",
    transactionId: "TXN-CF8101",
    student: "Rahul Sharma",
    email: "rahul.sharma@example.com",
    purpose: "Course Fee",
    course: "Full Stack Development",
    college: "Rajasthan Institute of Technology",
    amount: 14999,
    fee: 150,
    method: "UPI",
    gateway: "Razorpay",
    status: "Paid",
    createdAt: "2026-10-28T10:35:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8102",
    orderId: "ORD-51002",
    transactionId: "TXN-CF8102",
    student: "Priya Verma",
    email: "priya.verma@example.com",
    purpose: "Training Program",
    course: "AI & Data Science Bootcamp",
    college: "CodeFaculty Learning",
    amount: 24999,
    fee: 250,
    method: "Credit Card",
    gateway: "Razorpay",
    status: "Paid",
    createdAt: "2026-10-28T09:20:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8103",
    orderId: "ORD-51003",
    transactionId: "—",
    student: "Aman Singh",
    email: "aman.singh@example.com",
    purpose: "Placement Preparation",
    course: "Placement Pro Program",
    college: "North Campus College",
    amount: 4999,
    fee: 0,
    method: "UPI",
    gateway: "Razorpay",
    status: "Pending",
    createdAt: "2026-10-27T16:45:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8104",
    orderId: "ORD-51004",
    transactionId: "TXN-CF8104",
    student: "Neha Gupta",
    email: "neha.gupta@example.com",
    purpose: "Subscription",
    course: "Premium Learning Plan",
    college: "CodeFaculty Learning",
    amount: 1999,
    fee: 20,
    method: "Debit Card",
    gateway: "Razorpay",
    status: "Paid",
    createdAt: "2026-10-27T13:10:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8105",
    orderId: "ORD-51005",
    transactionId: "TXN-CF8105",
    student: "Karan Meena",
    email: "karan.meena@example.com",
    purpose: "Workshop",
    course: "Generative AI Workshop",
    college: "Tech Learning Hub",
    amount: 1499,
    fee: 0,
    method: "Net Banking",
    gateway: "Razorpay",
    status: "Failed",
    createdAt: "2026-10-26T15:25:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8106",
    orderId: "ORD-51006",
    transactionId: "TXN-CF8106",
    student: "Sneha Jain",
    email: "sneha.jain@example.com",
    purpose: "Certification",
    course: "Python Professional Certificate",
    college: "Rajasthan Institute of Technology",
    amount: 2999,
    fee: 30,
    method: "UPI",
    gateway: "Razorpay",
    status: "Paid",
    createdAt: "2026-10-26T11:40:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8107",
    orderId: "ORD-51007",
    transactionId: "TXN-CF8107",
    student: "Mohit Kumar",
    email: "mohit.kumar@example.com",
    purpose: "Course Fee",
    course: "React & TypeScript",
    college: "CodeFaculty Learning",
    amount: 8999,
    fee: 90,
    method: "Credit Card",
    gateway: "Razorpay",
    status: "Refunded",
    createdAt: "2026-10-25T17:30:00",
    refundAmount: 8999,
  },
  {
    id: "PAY-8108",
    orderId: "ORD-51008",
    transactionId: "TXN-CF8108",
    student: "Pooja Yadav",
    email: "pooja.yadav@example.com",
    purpose: "Training Program",
    course: "Python for Data Analytics",
    college: "North Campus College",
    amount: 11999,
    fee: 120,
    method: "Wallet",
    gateway: "Razorpay",
    status: "Paid",
    createdAt: "2026-10-25T12:05:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8109",
    orderId: "ORD-51009",
    transactionId: "—",
    student: "Deepak Joshi",
    email: "deepak.joshi@example.com",
    purpose: "Subscription",
    course: "Premium Learning Plan",
    college: "CodeFaculty Learning",
    amount: 1999,
    fee: 0,
    method: "UPI",
    gateway: "Razorpay",
    status: "Pending",
    createdAt: "2026-10-24T14:55:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8110",
    orderId: "ORD-51010",
    transactionId: "TXN-CF8110",
    student: "Anjali Mehta",
    email: "anjali.mehta@example.com",
    purpose: "Course Fee",
    course: "UI/UX Design Fundamentals",
    college: "Rajasthan Institute of Technology",
    amount: 6999,
    fee: 70,
    method: "Debit Card",
    gateway: "Razorpay",
    status: "Paid",
    createdAt: "2026-10-23T10:15:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8111",
    orderId: "ORD-51011",
    transactionId: "TXN-CF8111",
    student: "Vikas Saini",
    email: "vikas.saini@example.com",
    purpose: "Placement Preparation",
    course: "Interview Accelerator",
    college: "Tech Learning Hub",
    amount: 3999,
    fee: 0,
    method: "Net Banking",
    gateway: "Razorpay",
    status: "Failed",
    createdAt: "2026-10-22T16:00:00",
    refundAmount: 0,
  },
  {
    id: "PAY-8112",
    orderId: "ORD-51012",
    transactionId: "TXN-CF8112",
    student: "Isha Rathore",
    email: "isha.rathore@example.com",
    purpose: "Workshop",
    course: "Cloud & DevOps Essentials",
    college: "CodeFaculty Learning",
    amount: 2499,
    fee: 25,
    method: "UPI",
    gateway: "Razorpay",
    status: "Paid",
    createdAt: "2026-10-21T09:40:00",
    refundAmount: 0,
  },
];

const FILTER_OPTIONS = {
  statuses: [
    { label: "All statuses", value: "All" },
    ...PAYMENT_STATUSES.map((item) => ({
      label: item,
      value: item,
    })),
  ],
  methods: [
    { label: "All payment methods", value: "All" },
    ...PAYMENT_METHODS.map((item) => ({
      label: item,
      value: item,
    })),
  ],
  purposes: [
    { label: "All purposes", value: "All" },
    ...PAYMENT_PURPOSES.map((item) => ({
      label: item,
      value: item,
    })),
  ],
};

/* =========================================================
   HELPERS
========================================================= */

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(value) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getInitials(value = "") {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function escapeCSV(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function getStatusConfig(status) {
  const map = {
    Paid: {
      icon: CheckCircle2,
      classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
      dot: "bg-emerald-500",
    },
    Pending: {
      icon: Clock3,
      classes: "border-amber-200 bg-amber-50 text-amber-700",
      dot: "bg-amber-500",
    },
    Failed: {
      icon: AlertCircle,
      classes: "border-rose-200 bg-rose-50 text-rose-700",
      dot: "bg-rose-500",
    },
    Refunded: {
      icon: ArrowDownLeft,
      classes: "border-violet-200 bg-violet-50 text-violet-700",
      dot: "bg-violet-500",
    },
  };

  return map[status] || map.Pending;
}

function getMethodIcon(method) {
  if (method === "UPI") return Smartphone;
  if (method === "Credit Card" || method === "Debit Card") {
    return CreditCard;
  }
  if (method === "Net Banking") return Landmark;
  if (method === "Wallet") return Wallet;

  return CircleDollarSign;
}

/* =========================================================
   PREMIUM SCROLLBAR STYLES
========================================================= */

function PaymentsPremiumStyles() {
  return (
    <style>{`
      .payments-admin-page {
        min-width: 0;
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .payments-admin-page *,
      .payments-premium-menu {
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .payments-admin-page ::-webkit-scrollbar,
      .payments-premium-menu::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .payments-admin-page ::-webkit-scrollbar-track,
      .payments-premium-menu::-webkit-scrollbar-track {
        background: #fff7f3;
        border-radius: 999px;
      }

      .payments-admin-page ::-webkit-scrollbar-thumb,
      .payments-premium-menu::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #f8c4b4, #f4512b);
        border: 2px solid #fff7f3;
        border-radius: 999px;
      }

      .payments-admin-page ::-webkit-scrollbar-thumb:hover,
      .payments-premium-menu::-webkit-scrollbar-thumb:hover {
        background: #db3d1c;
      }

      .payments-premium-menu {
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      .payments-table-scroll {
        width: 100%;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        -webkit-overflow-scrolling: touch;
      }

      .payments-admin-page input,
      .payments-admin-page textarea {
        color: #1e293b;
      }

      .payments-admin-page input::placeholder,
      .payments-admin-page textarea::placeholder {
        color: #94a3b8;
        opacity: 1;
      }

      .payments-admin-page button:focus-visible {
        outline: 2px solid #f4512b;
        outline-offset: 2px;
      }

      @media (prefers-reduced-motion: reduce) {
        .payments-admin-page *,
        .payments-admin-page *::before,
        .payments-admin-page *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
  );
}

/* =========================================================
   PREMIUM PORTAL DROPDOWN
   Searchable, keyboard accessible and scroll aware.
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
      Math.max(rect.width, 220),
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
    const maxHeight = Math.min(315, availableSpace);

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

    const handleOutside = (event) => {
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
    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKeyboard);

    return () => {
      window.removeEventListener("resize", reposition);
      window.removeEventListener("scroll", reposition, true);
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKeyboard);
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
          "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left outline-none transition duration-200",
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
              className="payments-premium-menu overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_22px_60px_-20px_rgba(15,23,42,.36)] ring-1 ring-black/[.025]"
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
                        if (event.key === "Escape") {
                          setOpen(false);
                        }
                      }}
                      placeholder="Search options..."
                      aria-label="Search dropdown options"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
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
                          "group/option flex min-h-10 w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition duration-150",
                          selected
                            ? "bg-orange-50 text-[#F4512B]"
                            : "text-slate-700 hover:bg-slate-50",
                        ].join(" ")}
                      >
                        <span
                          className={[
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition",
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
   BUTTON
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

/* =========================================================
   STATUS BADGE
========================================================= */

function PaymentStatusBadge({ status }) {
  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
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
  icon: Icon = BadgeIndianRupee,
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

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onCloseRef.current?.();
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
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
          "my-auto w-full overflow-visible rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_90px_-24px_rgba(15,23,42,.45)]",
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
            aria-label="Close dialog"
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
   PAYMENT DETAILS MODAL
========================================================= */

function PaymentDetailsModal({
  payment,
  onClose,
  onMarkPaid,
  onRefund,
}) {
  if (!payment) return null;

  const MethodIcon = getMethodIcon(payment.method);

  const fields = [
    {
      label: "Student",
      value: payment.student,
      icon: Smartphone,
    },
    {
      label: "Email",
      value: payment.email,
      icon: FileText,
    },
    {
      label: "Order ID",
      value: payment.orderId,
      icon: BadgeIndianRupee,
    },
    {
      label: "Transaction ID",
      value: payment.transactionId || "—",
      icon: Activity,
    },
    {
      label: "Payment Method",
      value: payment.method,
      icon: MethodIcon,
    },
    {
      label: "Payment Gateway",
      value: payment.gateway,
      icon: ShieldCheck,
    },
    {
      label: "Purpose",
      value: payment.purpose,
      icon: FileText,
    },
    {
      label: "Institution",
      value: payment.college || "—",
      icon: Landmark,
    },
    {
      label: "Created At",
      value: formatDateTime(payment.createdAt),
      icon: CalendarDays,
    },
  ];

  return (
    <ModalShell
      title="Payment Details"
      subtitle={`Transaction reference: ${payment.id}`}
      icon={BadgeIndianRupee}
      onClose={onClose}
      size="max-w-3xl"
    >
      <div className="p-5 sm:p-6">
        <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-[.15em] text-slate-400">
                Transaction amount
              </p>

              <h3 className="mt-2 break-words text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                {formatCurrency(payment.amount)}
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                {payment.purpose}
              </p>
            </div>

            <PaymentStatusBadge status={payment.status} />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-orange-100 pt-4">
            <span className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
              <MethodIcon size={15} className="text-[#F4512B]" />
              {payment.method}
            </span>

            <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
              {payment.gateway}
            </span>

            <span className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600">
              {payment.orderId}
            </span>
          </div>
        </div>

        <div className="mt-5">
          <div className="mb-3">
            <h3 className="text-sm font-bold text-slate-900">
              Transaction Information
            </h3>

            <p className="mt-1 text-xs text-slate-400">
              Payment record and customer details
            </p>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {fields.map((item) => {
              const Icon = item.icon;

              return (
                <div
                  key={item.label}
                  className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-500">
                    <Icon size={16} />
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
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 p-4">
          <h3 className="text-sm font-bold text-slate-900">
            Amount Breakdown
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Payment amount</span>
              <span className="font-semibold text-slate-800">
                {formatCurrency(payment.amount)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Recorded gateway fee</span>
              <span className="font-semibold text-slate-800">
                {formatCurrency(payment.fee)}
              </span>
            </div>

            <div className="flex items-center justify-between gap-4 text-sm">
              <span className="text-slate-500">Refund amount</span>
              <span className="font-semibold text-violet-700">
                {formatCurrency(payment.refundAmount)}
              </span>
            </div>

            <div className="border-t border-dashed border-slate-200 pt-3">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm font-bold text-slate-700">
                  Net recorded amount
                </span>

                <span className="text-lg font-extrabold text-slate-950">
                  {formatCurrency(
                    Math.max(
                      0,
                      Number(payment.amount || 0) -
                      Number(payment.refundAmount || 0)
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-orange-100 bg-orange-50/70 p-3">
          <ShieldCheck
            size={17}
            className="mt-0.5 shrink-0 text-[#F4512B]"
          />

          <p className="text-xs leading-5 text-slate-600">
            This is a demonstration transaction record. Status changes and
            refund actions on this page are local-only and do not contact a
            payment gateway.
          </p>
        </div>

        <div className="mt-5 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <div>
            {payment.status === "Paid" && (
              <ActionButton
                variant="danger"
                onClick={() => onRefund(payment)}
              >
                <ArrowDownLeft size={15} />
                Demo Refund
              </ActionButton>
            )}

            {payment.status === "Pending" && (
              <ActionButton onClick={() => onMarkPaid(payment)}>
                <CheckCircle2 size={15} />
                Mark Paid (Demo)
              </ActionButton>
            )}
          </div>

          <ActionButton onClick={onClose}>Close Details</ActionButton>
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
  trend,
}) {
  const tones = {
    orange: "border-orange-100 bg-orange-50 text-[#F4512B]",
    green: "border-emerald-100 bg-emerald-50 text-emerald-700",
    blue: "border-blue-100 bg-blue-50 text-blue-700",
    violet: "border-violet-100 bg-violet-50 text-violet-700",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 7 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/70 transition duration-200 hover:shadow-md sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-2 break-words text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
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

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {trend && (
          <span
            className={[
              "inline-flex items-center gap-1 text-xs font-bold",
              trend.positive ? "text-emerald-600" : "text-slate-500",
            ].join(" ")}
          >
            {trend.positive ? (
              <ArrowUpRight size={13} />
            ) : (
              <ArrowDownRight size={13} />
            )}

            {trend.label}
          </span>
        )}

        <p className="text-xs leading-5 text-slate-400">{note}</p>
      </div>
    </motion.div>
  );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onReset }) {
  return (
    <div className="px-5 py-14 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#F4512B]">
        <Search size={24} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        No transactions found
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        No payment records match the current search and filter settings.
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

export default function PaymentsPage() {
  const [payments, setPayments] = useState(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Fall back to demo data if local storage is unavailable.
    }

    return INITIAL_PAYMENTS;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [methodFilter, setMethodFilter] = useState("All");
  const [purposeFilter, setPurposeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
    } catch {
      // Keep the page usable if storage is disabled.
    }
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = payments.filter((item) => {
      const searchValues = [
        item.id,
        item.orderId,
        item.transactionId,
        item.student,
        item.email,
        item.course,
        item.college,
        item.purpose,
        item.method,
        item.gateway,
        item.status,
      ];

      const matchesSearch =
        !query ||
        searchValues.some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesMethod =
        methodFilter === "All" || item.method === methodFilter;

      const matchesPurpose =
        purposeFilter === "All" || item.purpose === purposeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod &&
        matchesPurpose
      );
    });

    return [...result].sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return String(a.createdAt || "").localeCompare(
            String(b.createdAt || "")
          );

        case "amount-high":
          return Number(b.amount || 0) - Number(a.amount || 0);

        case "amount-low":
          return Number(a.amount || 0) - Number(b.amount || 0);

        case "student-asc":
          return String(a.student || "").localeCompare(
            String(b.student || "")
          );

        case "newest":
        default:
          return String(b.createdAt || "").localeCompare(
            String(a.createdAt || "")
          );
      }
    });
  }, [
    payments,
    search,
    statusFilter,
    methodFilter,
    purposeFilter,
    sortBy,
  ]);

  /* Dashboard figures are based on currently stored records. */
  const paidPayments = payments.filter((item) => item.status === "Paid");
  const pendingPayments = payments.filter(
    (item) => item.status === "Pending"
  );
  const refundedPayments = payments.filter(
    (item) => item.status === "Refunded"
  );
  const failedPayments = payments.filter(
    (item) => item.status === "Failed"
  );

  const totalCollected = paidPayments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const pendingAmount = pendingPayments.reduce(
    (sum, item) => sum + Number(item.amount || 0),
    0
  );

  const totalRefunded = refundedPayments.reduce(
    (sum, item) => sum + Number(item.refundAmount || 0),
    0
  );

  const successRate = payments.length
    ? Math.round((paidPayments.length / payments.length) * 100)
    : 0;

  const totalPages = Math.max(
    1,
    Math.ceil(filteredPayments.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const visiblePayments = filteredPayments.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const activeFiltersCount = [
    statusFilter !== "All",
    methodFilter !== "All",
    purposeFilter !== "All",
  ].filter(Boolean).length;

  const hasFilters =
    Boolean(search.trim()) || activeFiltersCount > 0;

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, methodFilter, purposeFilter, sortBy]);

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages));
  }, [totalPages]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setMethodFilter("All");
    setPurposeFilter("All");
    setSortBy("newest");
    setPage(1);
  }

  function updatePaymentStatus(payment, status) {
    const now = new Date().toISOString();

    setPayments((current) =>
      current.map((item) =>
        item.id === payment.id
          ? {
            ...item,
            status,
            ...(status === "Refunded"
              ? { refundAmount: Number(item.amount || 0) }
              : {}),
            ...(status === "Paid" && item.transactionId === "—"
              ? {
                transactionId: `DEMO-${Date.now()
                  .toString()
                  .slice(-8)}`,
              }
              : {}),
          }
          : item
      )
    );

    setSelectedPayment((current) =>
      current?.id === payment.id
        ? {
          ...current,
          status,
          ...(status === "Refunded"
            ? { refundAmount: Number(current.amount || 0) }
            : {}),
          ...(status === "Paid" && current.transactionId === "—"
            ? {
              transactionId: `DEMO-${Date.now()
                .toString()
                .slice(-8)}`,
            }
            : {}),
        }
        : current
    );

    setNotice({
      type: "success",
      message:
        status === "Refunded"
          ? `Demo refund recorded for ${payment.id}. No gateway refund was initiated.`
          : `${payment.id} updated to ${status}. This change is local-only.`,
    });

    void now;
  }

  function handleRefund(payment) {
    if (payment.status !== "Paid") return;

    const confirmed = window.confirm(
      `Record a demo refund of ${formatCurrency(payment.amount)} for ${payment.id}?\n\nThis only changes the local demo record and will NOT send a real refund.`
    );

    if (!confirmed) return;

    updatePaymentStatus(payment, "Refunded");
  }

  function handleMarkPaid(payment) {
    if (payment.status !== "Pending") return;

    const confirmed = window.confirm(
      `Mark ${payment.id} as Paid in the demo records?\n\nThis will not verify or capture an actual payment.`
    );

    if (!confirmed) return;

    updatePaymentStatus(payment, "Paid");
  }

  function exportCSV() {
    const headers = [
      "Payment ID",
      "Order ID",
      "Transaction ID",
      "Student",
      "Email",
      "Purpose",
      "Course",
      "College",
      "Amount INR",
      "Gateway Fee INR",
      "Refund Amount INR",
      "Method",
      "Gateway",
      "Status",
      "Created At",
    ];

    const rows = filteredPayments.map((item) => [
      item.id,
      item.orderId,
      item.transactionId,
      item.student,
      item.email,
      item.purpose,
      item.course,
      item.college,
      item.amount,
      item.fee,
      item.refundAmount,
      item.method,
      item.gateway,
      item.status,
      item.createdAt,
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
    link.download = `codefaculty-payments-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    setNotice({
      type: "success",
      message: `${filteredPayments.length} payment record(s) exported to CSV.`,
    });
  }

  function resetDemoData() {
    const confirmed = window.confirm(
      "Reset payment records to the original sample data? All local demo changes will be lost."
    );

    if (!confirmed) return;

    setPayments(INITIAL_PAYMENTS);
    setSelectedPayment(null);
    setPage(1);
    resetFilters();

    setNotice({
      type: "success",
      message: "Demo payment records have been restored.",
    });
  }

  const sortLabel =
    {
      newest: "Newest first",
      oldest: "Oldest first",
      "amount-high": "Highest amount",
      "amount-low": "Lowest amount",
      "student-asc": "Student (A–Z)",
    }[sortBy] || "Newest first";

  return (
    <div className="payments-admin-page min-w-0 bg-[#F8FAFC] px-4 py-5 text-slate-800 sm:px-6 sm:py-6 xl:px-8">
      <PaymentsPremiumStyles />

      <div className="mx-auto w-full max-w-[1600px]">
        {/* HEADER */}
        <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-slate-400">
              <BadgeIndianRupee
                size={15}
                className="text-[#F4512B]"
              />
              Administration
              <span className="text-slate-300">/</span>
              Finance & Billing
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Payments & Transactions
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Monitor payment records, review transaction status, track
              collections and export financial records from one workspace.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={resetDemoData}>
              <RefreshCw size={15} />
              Reset Demo
            </ActionButton>

            <ActionButton variant="primary" onClick={exportCSV}>
              <Download size={16} />
              Export CSV
            </ActionButton>
          </div>
        </section>

        {/* FEEDBACK NOTICE */}
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
                  aria-label="Dismiss message"
                  onClick={() => setNotice(null)}
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
            label="Total Collected"
            value={formatCurrency(totalCollected)}
            note="Recorded paid transactions"
            icon={IndianRupee}
            tone="green"
          />

          <StatCard
            label="Paid Transactions"
            value={formatNumber(paidPayments.length)}
            note={`${successRate}% of all recorded transactions`}
            icon={CheckCircle2}
            tone="orange"
            trend={{
              positive: true,
              label: `${paidPayments.length} paid`,
            }}
          />

          <StatCard
            label="Pending Amount"
            value={formatCurrency(pendingAmount)}
            note={`${pendingPayments.length} awaiting verification`}
            icon={Clock3}
            tone="blue"
          />

          <StatCard
            label="Total Refunded"
            value={formatCurrency(totalRefunded)}
            note={`${refundedPayments.length} refunded transaction(s)`}
            icon={ArrowDownLeft}
            tone="violet"
          />
        </div>

        {/* FINANCE OVERVIEW */}
        <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.35fr_.65fr]">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                    <Activity size={18} />
                  </div>

                  <div>
                    <h2 className="text-sm font-bold text-slate-900">
                      Transaction Overview
                    </h2>

                    <p className="mt-0.5 text-xs text-slate-400">
                      Current stored demo records
                    </p>
                  </div>
                </div>
              </div>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Demo ledger
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                {
                  label: "All records",
                  value: payments.length,
                  color: "text-slate-900",
                },
                {
                  label: "Paid",
                  value: paidPayments.length,
                  color: "text-emerald-700",
                },
                {
                  label: "Failed",
                  value: failedPayments.length,
                  color: "text-rose-700",
                },
                {
                  label: "Refunded",
                  value: refundedPayments.length,
                  color: "text-violet-700",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                >
                  <p className="text-xs font-medium text-slate-500">
                    {item.label}
                  </p>

                  <p
                    className={[
                      "mt-2 text-2xl font-extrabold tabular-nums",
                      item.color,
                    ].join(" ")}
                  >
                    {formatNumber(item.value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-5">
              <div className="mb-2 flex items-center justify-between gap-3">
                <p className="text-xs font-semibold text-slate-600">
                  Paid transaction ratio
                </p>

                <p className="text-xs font-bold tabular-nums text-[#F4512B]">
                  {successRate}%
                </p>
              </div>

              <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${successRate}%` }}
                  transition={{ duration: 0.35 }}
                  className="h-full rounded-full bg-gradient-to-r from-[#F4512B] to-orange-300"
                />
              </div>

              <div className="mt-2 flex items-center justify-between gap-3 text-[11px] text-slate-400">
                <span>{paidPayments.length} paid</span>
                <span>{payments.length} total records</span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/90 via-white to-white p-4 shadow-sm shadow-orange-100/30 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white text-[#F4512B]">
                <ShieldCheck size={20} />
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900">
                  Payment Operations
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Review transaction records and export the currently
                  filtered ledger.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2.5">
              <div className="flex items-center gap-2.5 rounded-xl border border-orange-100 bg-white/90 p-3">
                <CheckCircle2
                  size={16}
                  className="shrink-0 text-emerald-600"
                />

                <p className="text-xs font-semibold text-slate-600">
                  {formatNumber(paidPayments.length)} successful demo records
                </p>
              </div>

              <div className="flex items-center gap-2.5 rounded-xl border border-orange-100 bg-white/90 p-3">
                <Clock3 size={16} className="shrink-0 text-amber-600" />

                <p className="text-xs font-semibold text-slate-600">
                  {formatNumber(pendingPayments.length)} records need review
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SEARCH & FILTERS */}
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
                placeholder="Search payment ID, student, email, order or transaction..."
                aria-label="Search payments"
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
              <div className="min-w-0 xl:w-44">
                <PremiumDropdown
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="All statuses"
                  searchable={false}
                  options={FILTER_OPTIONS.statuses}
                />
              </div>

              <div className="min-w-0 xl:w-48">
                <PremiumDropdown
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort transactions"
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
                      Payment method
                    </p>

                    <PremiumDropdown
                      value={methodFilter}
                      onChange={setMethodFilter}
                      placeholder="All payment methods"
                      options={FILTER_OPTIONS.methods}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Payment purpose
                    </p>

                    <PremiumDropdown
                      value={purposeFilter}
                      onChange={setPurposeFilter}
                      placeholder="All purposes"
                      options={FILTER_OPTIONS.purposes}
                    />
                  </div>

                  <div className="flex flex-col justify-end">
                    <p className="mb-2 text-xs text-slate-400">
                      Matching transactions
                    </p>

                    <div className="flex min-h-11 items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/50 px-3.5 text-sm font-semibold text-slate-700">
                      <Filter size={15} className="text-[#F4512B]" />
                      {formatNumber(filteredPayments.length)} records
                    </div>
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
              Transaction Ledger
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredPayments.length === 0
                  ? 0
                  : (safePage - 1) * PAGE_SIZE + 1}
                {"–"}
                {Math.min(
                  safePage * PAGE_SIZE,
                  filteredPayments.length
                )}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {formatNumber(filteredPayments.length)}
              </span>{" "}
              transactions
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
            <ArrowDownUp size={14} />

            Sorted by{" "}
            <span className="font-semibold text-slate-600">
              {sortLabel}
            </span>
          </div>
        </div>

        {/* TRANSACTION TABLE */}
        <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/50">
          <div className="payments-table-scroll">
            <table className="w-full min-w-[1180px] border-collapse text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/90">
                  {[
                    "TRANSACTION",
                    "STUDENT",
                    "PURPOSE",
                    "AMOUNT",
                    "PAYMENT METHOD",
                    "STATUS",
                    "DATE",
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
                {visiblePayments.map((payment) => {
                  const MethodIcon = getMethodIcon(payment.method);

                  return (
                    <tr
                      key={payment.id}
                      className="border-b border-slate-100 transition-colors last:border-0 hover:bg-orange-50/25"
                    >
                      {/* TRANSACTION */}
                      <td className="px-4 py-4">
                        <div className="flex min-w-[170px] items-start gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                            <BadgeIndianRupee size={18} />
                          </div>

                          <div className="min-w-0">
                            <p className="whitespace-nowrap text-sm font-bold text-slate-800">
                              {payment.id}
                            </p>

                            <p className="mt-1 whitespace-nowrap text-xs text-slate-400">
                              Order: {payment.orderId}
                            </p>

                            <p className="mt-1 max-w-[170px] truncate text-[11px] text-slate-400">
                              {payment.transactionId}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STUDENT */}
                      <td className="px-4 py-4">
                        <div className="flex min-w-[190px] items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-xs font-extrabold text-[#F4512B]">
                            {getInitials(payment.student)}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[190px] truncate text-sm font-bold text-slate-800">
                              {payment.student}
                            </p>

                            <p className="mt-1 max-w-[190px] truncate text-xs text-slate-400">
                              {payment.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* PURPOSE */}
                      <td className="px-4 py-4">
                        <div className="min-w-[175px]">
                          <p className="text-sm font-semibold text-slate-700">
                            {payment.purpose}
                          </p>

                          <p className="mt-1 max-w-[210px] truncate text-xs text-slate-400">
                            {payment.course}
                          </p>
                        </div>
                      </td>

                      {/* AMOUNT */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <p className="text-sm font-extrabold tabular-nums text-slate-900">
                          {formatCurrency(payment.amount)}
                        </p>

                        <p className="mt-1 text-[11px] text-slate-400">
                          Fee: {formatCurrency(payment.fee)}
                        </p>

                        {payment.refundAmount > 0 && (
                          <p className="mt-1 text-[11px] font-semibold text-violet-600">
                            Refunded: {formatCurrency(payment.refundAmount)}
                          </p>
                        )}
                      </td>

                      {/* METHOD */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-500">
                            <MethodIcon size={15} />
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-slate-700">
                              {payment.method}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                              {payment.gateway}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <PaymentStatusBadge status={payment.status} />
                      </td>

                      {/* DATE */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-start gap-2">
                          <CalendarDays
                            size={14}
                            className="mt-0.5 text-slate-400"
                          />

                          <div>
                            <p className="text-xs font-semibold text-slate-600">
                              {formatDate(payment.createdAt)}
                            </p>

                            <p className="mt-1 text-[11px] text-slate-400">
                              {new Date(payment.createdAt).toLocaleTimeString(
                                "en-IN",
                                {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* ACTIONS */}
                      <td className="whitespace-nowrap px-4 py-4">
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setSelectedPayment(payment)}
                            title="View payment details"
                            aria-label={`View ${payment.id}`}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-orange-200 bg-orange-50 text-[#F4512B] transition hover:bg-[#F4512B] hover:text-white"
                          >
                            <Eye size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* EMPTY STATE */}
          {visiblePayments.length === 0 && (
            <EmptyState onReset={resetFilters} />
          )}

          {/* PAGINATION */}
          {filteredPayments.length > 0 && (
            <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <p className="text-xs text-slate-400">
                <span className="font-semibold text-slate-600">
                  {visiblePayments.length}
                </span>{" "}
                transactions on this page
              </p>

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
            Payment records on this screen are sample data stored in this
            browser. Connect your backend and payment gateway to verify
            transactions, calculate actual fees and process real refunds.
          </p>
        </div>
      </div>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedPayment && (
          <PaymentDetailsModal
            key={selectedPayment.id}
            payment={
              payments.find((item) => item.id === selectedPayment.id) ||
              selectedPayment
            }
            onClose={() => setSelectedPayment(null)}
            onMarkPaid={handleMarkPaid}
            onRefund={handleRefund}
          />
        )}
      </AnimatePresence>
    </div>
  );
}