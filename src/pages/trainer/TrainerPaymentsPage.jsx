import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  ArrowDownLeft,
  ArrowDownToLine,
  ArrowUpRight,
  Banknote,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  CreditCard,
  Eye,
  Filter,
  Landmark,
  Plus,
  Receipt,
  Search,
  Settings2,
  ShieldCheck,
  SlidersHorizontal,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

/* ======================== CONFIG ======================== */

// Demo data only. Real payments must use authenticated backend APIs.
const KEYS = {
  payments: "teachlive.trainerPayments.v1",
  payouts: "teachlive.trainerPayouts.v1",
  account: "teachlive.trainerPayoutAccount.v1",
};

const MIN_PAYOUT = 500;

const PAYMENT_STATUSES = ["Completed", "Pending", "Processing", "Failed"];
const PAYOUT_STATUSES = [...PAYMENT_STATUSES, "Cancelled"];
const STATUSES = ["All statuses", ...PAYMENT_STATUSES];
const PAYOUT_FILTERS = ["All statuses", ...PAYOUT_STATUSES];

const DATES = [
  { value: "30days", label: "Last 30 days" },
  { value: "7days", label: "Last 7 days" },
  { value: "thisMonth", label: "This month" },
  { value: "all", label: "All time" },
];

const SORT_OPTIONS = [
  { value: "date-desc", label: "Newest first" },
  { value: "date-asc", label: "Oldest first" },
  { value: "amount-desc", label: "Highest amount" },
  { value: "amount-asc", label: "Lowest amount" },
];

const INITIAL_PAYMENTS = [
  ["PAY-2026-1042", "TL-PAY-8F21A9", "Aarav Sharma", "React Advanced Concepts", "2026-10-20T10:42:00+05:30", 4800, 240, "Completed"],
  ["PAY-2026-1038", "TL-PAY-7D18B3", "Ananya Verma", "Full Stack Development", "2026-10-19T15:30:00+05:30", 6500, 325, "Completed"],
  ["PAY-2026-1032", "TL-PAY-6C14D7", "Rohan Gupta", "Data Structures & Algorithms", "2026-10-18T12:15:00+05:30", 7200, 360, "Completed"],
  ["PAY-2026-1029", "TL-PAY-5A92E4", "Priya Singh", "Java Programming", "2026-10-17T11:00:00+05:30", 3900, 195, "Completed"],
  ["PAY-2026-1025", "TL-PAY-4B81F6", "Ishaan Mishra", "Frontend Development", "2026-10-15T16:10:00+05:30", 8500, 425, "Completed"],
  ["PAY-2026-1021", "TL-PAY-3E72G8", "Meera Joshi", "Python Programming", "2026-10-12T09:45:00+05:30", 2600, 130, "Pending"],
  ["PAY-2026-1018", "TL-PAY-2D63H1", "Kabir Agarwal", "Machine Learning Basics", "2026-10-08T14:20:00+05:30", 5400, 270, "Processing"],
  ["PAY-2026-1012", "TL-PAY-1C54J2", "Diya Kapoor", "JavaScript Masterclass", "2026-09-29T13:00:00+05:30", 3200, 160, "Failed"],
  ["PAY-2026-1007", "TL-PAY-0B43K5", "Aditya Mehta", "React Fundamentals", "2026-09-25T10:30:00+05:30", 4500, 225, "Completed"],
].map(([id, reference, student, course, date, grossAmount, platformFee, status]) => ({
  id,
  reference,
  student,
  course,
  date,
  grossAmount,
  platformFee,
  netAmount: grossAmount - platformFee,
  method: "Online payment",
  description: "Training session",
  status,
}));

const INITIAL_PAYOUTS = [
  {
    id: "PO-2026-0032",
    reference: "TL-PO-92AX41",
    date: "2026-10-16T10:00:00+05:30",
    amount: 10000,
    method: "Bank transfer",
    accountLast4: "4821",
    status: "Completed",
  },
  {
    id: "PO-2026-0028",
    reference: "TL-PO-81BY32",
    date: "2026-10-10T12:30:00+05:30",
    amount: 2500,
    method: "Bank transfer",
    accountLast4: "4821",
    status: "Pending",
  },
  {
    id: "PO-2026-0021",
    reference: "TL-PO-70CZ23",
    date: "2026-09-30T09:15:00+05:30",
    amount: 4500,
    method: "Bank transfer",
    accountLast4: "4821",
    status: "Completed",
  },
];

const DEFAULT_ACCOUNT = {
  accountHolder: "Trainer Account",
  bankName: "Primary Bank Account",
  accountLast4: "4821",
};

/* ======================== SAFE STORAGE ======================== */

function loadArray(key, fallback, type) {
  if (typeof window === "undefined") return fallback;

  try {
    const data = JSON.parse(window.localStorage.getItem(key) || "null");
    if (!Array.isArray(data)) return fallback;

    return data.filter((item) => {
      if (
        !item ||
        typeof item.id !== "string" ||
        typeof item.date !== "string" ||
        Number.isNaN(new Date(item.date).getTime())
      ) {
        return false;
      }

      if (type === "payments") {
        return (
          typeof item.reference === "string" &&
          typeof item.student === "string" &&
          typeof item.course === "string" &&
          PAYMENT_STATUSES.includes(item.status) &&
          ["grossAmount", "platformFee", "netAmount"].every((key) =>
            Number.isFinite(Number(item[key])),
          )
        );
      }

      return (
        typeof item.reference === "string" &&
        PAYOUT_STATUSES.includes(item.status) &&
        Number.isFinite(Number(item.amount)) &&
        Number(item.amount) >= 0
      );
    });
  } catch {
    return fallback;
  }
}

function loadAccount() {
  if (typeof window === "undefined") return DEFAULT_ACCOUNT;

  try {
    const value = JSON.parse(
      window.localStorage.getItem(KEYS.account) || "null",
    );

    if (!value || typeof value !== "object") return DEFAULT_ACCOUNT;

    return {
      accountHolder:
        typeof value.accountHolder === "string"
          ? value.accountHolder.slice(0, 80)
          : DEFAULT_ACCOUNT.accountHolder,
      bankName:
        typeof value.bankName === "string"
          ? value.bankName.slice(0, 80)
          : DEFAULT_ACCOUNT.bankName,
      accountLast4: /^\d{4}$/.test(value.accountLast4)
        ? value.accountLast4
        : DEFAULT_ACCOUNT.accountLast4,
    };
  } catch {
    return DEFAULT_ACCOUNT;
  }
}

/* ======================== HELPERS ======================== */

const money = (amount = 0) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(amount) || 0);

function formatDate(value, withTime = false) {
  const date = new Date(value);

  if (!value || Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    ...(withTime ? { hour: "2-digit", minute: "2-digit" } : {}),
  }).format(date);
}

function matchesDate(value, filter) {
  if (filter === "all") return true;

  const date = new Date(value);
  const now = new Date();

  if (Number.isNaN(date.getTime()) || date > now) return false;

  if (filter === "thisMonth") {
    return (
      date.getMonth() === now.getMonth() &&
      date.getFullYear() === now.getFullYear()
    );
  }

  const start = new Date(now);
  start.setDate(now.getDate() - (filter === "7days" ? 7 : 30));
  start.setHours(0, 0, 0, 0);

  return date >= start;
}

function csvCell(value) {
  let text = String(value ?? "");

  // Prevent CSV formula execution in spreadsheet software.
  if (/^[\s]*[=+\-@]/.test(text)) {
    text = `'${text}`;
  }

  return `"${text.replace(/"/g, '""')}"`;
}

function exportCSV(filename, headers, rows) {
  const csv = [headers, ...rows]
    .map((row) => row.map(csvCell).join(","))
    .join("\r\n");

  const url = URL.createObjectURL(
    new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    }),
  );

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();

  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function createId(prefix) {
  const random =
    globalThis.crypto?.randomUUID?.() ||
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}-${random}`;
}

/* ======================== PREMIUM DROPDOWN ======================== */

function PremiumDropdown({
  value,
  options,
  onChange,
  icon: Icon = Filter,
  label = "Select option",
  ariaLabel = "Select option",
  className = "",
}) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState(null);

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string"
          ? { value: option, label: option }
          : option,
      ),
    [options],
  );

  const selected = normalizedOptions.find((option) => option.value === value);

  const updatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const gap = 12;
    const availableBelow = window.innerHeight - rect.bottom - gap;
    const availableAbove = rect.top - gap;

    const placement =
      availableBelow >= 200 || availableBelow >= availableAbove
        ? "bottom"
        : "top";

    const availableSpace =
      placement === "bottom" ? availableBelow : availableAbove;

    const maxHeight = Math.max(100, Math.min(280, availableSpace));
    const width = Math.min(
      Math.max(rect.width, 220),
      window.innerWidth - 16,
    );

    const left = Math.max(
      8,
      Math.min(rect.left, window.innerWidth - width - 8),
    );

    setPosition({
      left,
      width,
      maxHeight,
      top: placement === "bottom" ? rect.bottom + 8 : rect.top - 8,
      placement,
    });
  }, []);

  useLayoutEffect(() => {
    if (!open) return;

    updatePosition();

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
    };
  }, [open, updatePosition]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event) => {
      const target = event.target;

      if (
        !triggerRef.current?.contains(target) &&
        !menuRef.current?.contains(target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const menu =
    open && position && typeof document !== "undefined"
      ? createPortal(
        <AnimatePresence>
          <motion.div
            ref={menuRef}
            role="listbox"
            aria-label={ariaLabel}
            initial={{ opacity: 0, y: position.placement === "top" ? 5 : -5, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.16 }}
            style={{
              position: "fixed",
              zIndex: 9999,
              left: position.left,
              width: position.width,
              top:
                position.placement === "bottom"
                  ? position.top
                  : undefined,
              bottom:
                position.placement === "top"
                  ? window.innerHeight - position.top
                  : undefined,
              maxHeight: position.maxHeight,
              transformOrigin:
                position.placement === "top" ? "bottom" : "top",
            }}
            className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_60px_-15px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.03]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 bg-gradient-to-r from-emerald-50/90 to-white px-4 py-3">
              <div className="min-w-0">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-emerald-800">
                  {label}
                </p>
                <p className="mt-0.5 text-[11px] text-slate-400">
                  Choose an option
                </p>
              </div>

              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100">
                <SlidersHorizontal size={14} />
              </span>
            </div>

            <div
              className="overflow-y-auto p-2"
              style={{ maxHeight: Math.max(80, position.maxHeight - 61) }}
            >
              {normalizedOptions.map((option, index) => {
                const active = option.value === value;

                return (
                  <button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={active}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                      triggerRef.current?.focus();
                    }}
                    className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition duration-150 ${active
                      ? "bg-emerald-50 text-emerald-800 ring-1 ring-inset ring-emerald-100"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"
                      }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition ${active
                        ? "bg-emerald-600 text-white shadow-sm shadow-emerald-200"
                        : "bg-slate-100 text-slate-400 group-hover:bg-white group-hover:text-emerald-700"
                        }`}
                    >
                      {active ? <Check size={15} /> : <span className="text-[10px] font-bold">{String(index + 1).padStart(2, "0")}</span>}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-sm ${active ? "font-bold" : "font-medium"
                          }`}
                      >
                        {option.label}
                      </span>

                      {active && (
                        <span className="mt-0.5 block text-[10px] font-semibold text-emerald-600">
                          Currently selected
                        </span>
                      )}
                    </span>

                    {active && (
                      <CheckCircle2
                        size={16}
                        className="shrink-0 text-emerald-600"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        </AnimatePresence>,
        document.body,
      )
      : null;

  return (
    <>
      <div className={`relative min-w-0 ${className}`}>
        <button
          ref={triggerRef}
          type="button"
          aria-label={ariaLabel}
          aria-haspopup="listbox"
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          onKeyDown={(event) => {
            if (event.key === "ArrowDown") {
              event.preventDefault();
              setOpen(true);
            }
          }}
          className={`group flex min-h-[46px] w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 py-3 text-left outline-none transition duration-200 focus-visible:ring-4 focus-visible:ring-emerald-100 ${open
            ? "border-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.08)]"
            : "border-slate-200 shadow-sm hover:border-emerald-300 hover:shadow-md"
            }`}
        >
          <span
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition ${open
              ? "bg-emerald-100 text-emerald-800"
              : "bg-slate-50 text-slate-500 group-hover:bg-emerald-50 group-hover:text-emerald-700"
              }`}
          >
            <Icon size={15} />
          </span>

          <span className="min-w-0 flex-1">
            <span className="block truncate text-[10px] font-bold uppercase tracking-wider text-slate-400">
              {label}
            </span>

            <span className="mt-0.5 block truncate text-sm font-semibold text-slate-800">
              {selected?.label ?? String(value)}
            </span>
          </span>

          <ChevronDown
            size={16}
            className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-emerald-600" : ""
              }`}
          />
        </button>
      </div>

      {menu}
    </>
  );
}

/* ======================== STATUS BADGE ======================== */

function StatusBadge({ status }) {
  const styles = {
    Completed: "border-emerald-200 bg-emerald-50 text-emerald-700",
    Pending: "border-amber-200 bg-amber-50 text-amber-700",
    Processing: "border-sky-200 bg-sky-50 text-sky-700",
    Failed: "border-rose-200 bg-rose-50 text-rose-700",
    Cancelled: "border-slate-200 bg-slate-100 text-slate-600",
  };

  const icons = {
    Completed: CheckCircle2,
    Pending: Clock3,
    Processing: TrendingUp,
    Failed: AlertCircle,
    Cancelled: X,
  };

  const Icon = icons[status] || Clock3;

  return (
    <span className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-bold ${styles[status] || styles.Pending}`}>
      <Icon size={12} />
      {status}
    </span>
  );
}

/* ======================== SUMMARY CARD ======================== */

function SummaryCard({
  title,
  value,
  description,
  icon: Icon,
  tone = "green",
  index = 0,
}) {
  const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    slate: "bg-slate-100 text-slate-700 ring-slate-200",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -2 }}
      className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-slate-500">{description}</p>
        </div>

        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${tones[tone]}`}>
          <Icon size={21} />
        </div>
      </div>
    </motion.article>
  );
}

function Field({ label, hint, children }) {
  return (
    <div className="min-w-0">
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
      </label>
      {children}
      {hint && <p className="mt-1.5 text-xs leading-5 text-slate-500">{hint}</p>}
    </div>
  );
}

/* ======================== MODAL ======================== */

function Modal({
  open,
  onClose,
  title,
  description,
  icon: Icon = Receipt,
  children,
}) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!open) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.section
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={reduceMotion ? false : { opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? undefined : { opacity: 0, y: 8 }}
            className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 p-5 sm:p-6">
              <div className="flex min-w-0 gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  <Icon size={21} />
                </div>

                <div>
                  <h2 className="font-bold text-slate-950">{title}</h2>
                  {description && (
                    <p className="mt-1 text-sm leading-5 text-slate-500">
                      {description}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                aria-label="Close dialog"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-800"
              >
                <X size={18} />
              </button>
            </div>

            <div className="max-h-[75vh] overflow-y-auto p-5 sm:p-6">
              {children}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ======================== MAIN PAGE ======================== */

export default function TrainerPaymentsPage() {
  const reduceMotion = useReducedMotion();

  const [payments, setPayments] = useState(() =>
    loadArray(KEYS.payments, INITIAL_PAYMENTS, "payments"),
  );

  const [payouts, setPayouts] = useState(() =>
    loadArray(KEYS.payouts, INITIAL_PAYOUTS, "payouts"),
  );

  const [account, setAccount] = useState(loadAccount);

  const [tab, setTab] = useState("transactions");
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All statuses");
  const [dateRange, setDateRange] = useState("30days");
  const [sort, setSort] = useState("date-desc");

  const [selected, setSelected] = useState(null);
  const [showPayout, setShowPayout] = useState(false);
  const [showAccount, setShowAccount] = useState(false);
  const [amount, setAmount] = useState("");
  const [accountForm, setAccountForm] = useState(loadAccount);
  const [toast, setToast] = useState(null);

  const notify = useCallback((message, tone = "success") => {
    setToast({ id: Date.now(), message, tone });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  // Demo persistence only — localStorage is not authoritative for real payments.
  useEffect(() => {
    try {
      localStorage.setItem(KEYS.payments, JSON.stringify(payments));
    } catch { }
  }, [payments]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.payouts, JSON.stringify(payouts));
    } catch { }
  }, [payouts]);

  useEffect(() => {
    try {
      localStorage.setItem(KEYS.account, JSON.stringify(account));
    } catch { }
  }, [account]);

  /* Earnings */

  const confirmed = useMemo(
    () =>
      payments
        .filter((payment) => payment.status === "Completed")
        .reduce((sum, payment) => sum + Number(payment.netAmount), 0),
    [payments],
  );

  const pendingEarnings = useMemo(
    () =>
      payments
        .filter((payment) => ["Pending", "Processing"].includes(payment.status))
        .reduce((sum, payment) => sum + Number(payment.netAmount), 0),
    [payments],
  );

  const paidOut = useMemo(
    () =>
      payouts
        .filter((payout) => payout.status === "Completed")
        .reduce((sum, payout) => sum + Number(payout.amount), 0),
    [payouts],
  );

  const reserved = useMemo(
    () =>
      payouts
        .filter((payout) => ["Pending", "Processing"].includes(payout.status))
        .reduce((sum, payout) => sum + Number(payout.amount), 0),
    [payouts],
  );

  const available = Math.max(0, confirmed - paidOut - reserved);

  const pendingPayoutCount = payouts.filter((payout) =>
    ["Pending", "Processing"].includes(payout.status),
  ).length;

  /* Search, status and date filters */

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments
      .filter(
        (payment) =>
          (status === "All statuses" || payment.status === status) &&
          matchesDate(payment.date, dateRange) &&
          (!query ||
            [
              payment.id,
              payment.reference,
              payment.student,
              payment.course,
              payment.method,
              payment.status,
            ].some((value) =>
              String(value || "").toLowerCase().includes(query),
            )),
      )
      .sort((a, b) => {
        if (sort === "date-asc") return new Date(a.date) - new Date(b.date);
        if (sort === "amount-desc") return Number(b.netAmount) - Number(a.netAmount);
        if (sort === "amount-asc") return Number(a.netAmount) - Number(b.netAmount);
        return new Date(b.date) - new Date(a.date);
      });
  }, [payments, search, status, dateRange, sort]);

  const filteredPayouts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payouts
      .filter(
        (payout) =>
          (status === "All statuses" || payout.status === status) &&
          matchesDate(payout.date, dateRange) &&
          (!query ||
            [
              payout.id,
              payout.reference,
              payout.method,
              payout.status,
              payout.accountLast4,
            ].some((value) =>
              String(value || "").toLowerCase().includes(query),
            )),
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [payouts, search, status, dateRange]);

  const resetFilters = () => {
    setSearch("");
    setStatus("All statuses");
    setDateRange("30days");
    setSort("date-desc");
  };

  /* CSV export */

  const exportData = () => {
    if (tab === "transactions") {
      if (!filteredPayments.length) {
        notify("No transactions to export.", "error");
        return;
      }

      exportCSV(
        "teachlive-transactions.csv",
        [
          "Transaction ID", "Reference", "Student", "Course", "Date",
          "Gross", "Platform fee", "Net earnings", "Method", "Status",
        ],
        filteredPayments.map((payment) => [
          payment.id,
          payment.reference,
          payment.student,
          payment.course,
          formatDate(payment.date, true),
          payment.grossAmount,
          payment.platformFee,
          payment.netAmount,
          payment.method,
          payment.status,
        ]),
      );
    } else {
      if (!filteredPayouts.length) {
        notify("No payouts to export.", "error");
        return;
      }

      exportCSV(
        "teachlive-payouts.csv",
        ["Payout ID", "Reference", "Date", "Amount", "Method", "Account", "Status"],
        filteredPayouts.map((payout) => [
          payout.id,
          payout.reference,
          formatDate(payout.date, true),
          payout.amount,
          payout.method,
          `****${payout.accountLast4 || ""}`,
          payout.status,
        ]),
      );
    }

    notify("CSV downloaded.");
  };

  const copyReference = async (reference) => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(reference);
      notify("Reference copied.");
    } catch {
      notify("Unable to copy reference. Copy it manually.", "error");
    }
  };

  /* Payout request */

  const requestPayout = (event) => {
    event.preventDefault();

    const value = Number(amount);

    if (!Number.isSafeInteger(value) || value < MIN_PAYOUT) {
      notify(`Enter a whole amount of at least ${money(MIN_PAYOUT)}.`, "error");
      return;
    }

    if (value > available) {
      notify("Amount exceeds available balance.", "error");
      return;
    }

    setPayouts((old) => [
      {
        id: createId("PO"),
        reference: createId("TL-PO").toUpperCase(),
        date: new Date().toISOString(),
        amount: value,
        method: "Bank transfer",
        accountLast4: account.accountLast4,
        status: "Pending",
      },
      ...old,
    ]);

    setAmount("");
    setShowPayout(false);
    setTab("payouts");
    notify("Demo payout request created. No bank transfer was initiated.");
  };

  const cancelPayout = (payout) => {
    if (payout.status !== "Pending") {
      notify("Only pending payouts can be cancelled.", "error");
      return;
    }

    setPayouts((old) =>
      old.map((item) =>
        item.id === payout.id ? { ...item, status: "Cancelled" } : item,
      ),
    );

    notify("Demo payout request cancelled.");
  };

  /* Payout account settings */

  const openAccountSettings = () => {
    setAccountForm({ ...account });
    setShowAccount(true);
  };

  const saveAccount = (event) => {
    event.preventDefault();

    const value = {
      accountHolder: accountForm.accountHolder.trim(),
      bankName: accountForm.bankName.trim(),
      accountLast4: accountForm.accountLast4.trim(),
    };

    if (!value.accountHolder || !value.bankName) {
      notify("Complete all account fields.", "error");
      return;
    }

    if (!/^\d{4}$/.test(value.accountLast4)) {
      notify("Enter exactly four account digits.", "error");
      return;
    }

    setAccount(value);
    setShowAccount(false);
    notify("Account display details saved in this browser.");
  };

  const count =
    tab === "transactions" ? filteredPayments.length : filteredPayouts.length;

  const statusOptions =
    (tab === "transactions" ? STATUSES : PAYOUT_FILTERS).map((item) => ({
      value: item,
      label: item,
    }));

  /* ======================== RENDER ======================== */

  return (
    <div className="min-h-screen min-w-0 bg-[#f5faf8] text-slate-800">
      <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        {/* Header */}

        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex flex-col justify-between gap-5 lg:flex-row lg:items-center"
        >
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <Wallet size={14} />
              Trainer finance
            </span>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
              Payments & earnings
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Track teaching income, review transactions and manage payout requests.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={openAccountSettings}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50"
            >
              <Settings2 size={17} />
              Payout account
            </button>

            <button
              type="button"
              disabled={available < MIN_PAYOUT}
              onClick={() => {
                setAmount("");
                setShowPayout(true);
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Plus size={17} />
              Request payout
            </button>
          </div>
        </motion.header>

        {/* Demo warning */}

        <div className="mb-6 flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-xs leading-5 text-amber-900">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <p>
            <strong>Demo mode:</strong> figures are sample data saved in this
            browser. Payout requests do not move real money.
          </p>
        </div>

        {/* Summary */}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Confirmed earnings"
            value={money(confirmed)}
            description="Net earnings after fees"
            icon={TrendingUp}
          />

          <SummaryCard
            title="Available balance"
            value={money(available)}
            description="Available in demo wallet"
            icon={Wallet}
            tone="blue"
            index={1}
          />

          <SummaryCard
            title="Awaiting settlement"
            value={money(pendingEarnings)}
            description="Pending or processing payments"
            icon={Clock3}
            tone="amber"
            index={2}
          />

          <SummaryCard
            title="Total paid out"
            value={money(paidOut)}
            description="Completed demo payouts"
            icon={Banknote}
            tone="slate"
            index={3}
          />
        </section>

        {/* Wallet panel */}

        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 overflow-hidden rounded-3xl border border-emerald-800/10 bg-white shadow-sm"
        >
          <div className="grid grid-cols-1 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="relative overflow-hidden bg-gradient-to-br from-emerald-700 via-emerald-600 to-teal-700 p-6 text-white sm:p-8">
              <div className="pointer-events-none absolute -right-10 -top-14 h-48 w-48 rounded-full border-[28px] border-white/10" />

              <div className="relative">
                <p className="flex items-center gap-2 text-sm font-medium text-emerald-50">
                  <Wallet size={17} />
                  Available wallet balance
                </p>

                <p className="mt-5 break-words text-3xl font-bold sm:text-4xl">
                  {money(available)}
                </p>

                <p className="mt-3 max-w-md text-sm leading-6 text-emerald-50/90">
                  Completed net earnings minus completed and reserved payout requests.
                </p>

                <div className="mt-6 flex flex-wrap gap-3">
                  <button
                    type="button"
                    disabled={available < MIN_PAYOUT}
                    onClick={() => {
                      setAmount("");
                      setShowPayout(true);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 disabled:opacity-60"
                  >
                    <ArrowUpRight size={17} />
                    Withdraw earnings
                  </button>

                  <button
                    type="button"
                    onClick={() => setTab("payouts")}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/30 bg-white/10 px-4 py-3 text-sm font-semibold text-white hover:bg-white/20"
                  >
                    <Receipt size={16} />
                    Payout history
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 sm:p-8">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    Payout destination
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Display details saved in this browser
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Landmark size={19} />
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600">
                    <CreditCard size={20} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-900">
                      {account.bankName}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      •••• {account.accountLast4}
                    </p>
                  </div>

                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <Check size={15} />
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3 border-t border-slate-200 pt-3">
                  <span className="text-xs text-slate-500">Account holder</span>
                  <span className="max-w-[60%] truncate text-right text-xs font-semibold text-slate-800">
                    {account.accountHolder}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={openAccountSettings}
                className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
              >
                <Settings2 size={15} />
                Manage payout account
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </motion.section>

        {/* Payment activity */}

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Payment activity
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Review transactions and payout activity.
                </p>
              </div>

              <button
                type="button"
                onClick={exportData}
                className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 lg:self-auto"
              >
                <ArrowDownToLine size={16} />
                Export CSV
              </button>
            </div>

            {/* Activity tabs */}

            <div className="mt-5 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => {
                  setTab("transactions");
                  setStatus("All statuses");
                }}
                aria-pressed={tab === "transactions"}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${tab === "transactions"
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
                  }`}
              >
                <ArrowDownLeft size={16} />
                Transactions
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${tab === "transactions" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {payments.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setTab("payouts");
                  setStatus("All statuses");
                }}
                aria-pressed={tab === "payouts"}
                className={`inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition ${tab === "payouts"
                  ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50"
                  }`}
              >
                <ArrowUpRight size={16} />
                Payout history
                <span className={`rounded-md px-1.5 py-0.5 text-[10px] ${tab === "payouts" ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
                  {payouts.length}
                </span>
              </button>
            </div>
          </div>

          {/* Filters — all three dropdowns now use PremiumDropdown */}

          <div className="border-b border-slate-100 bg-slate-50/50 p-4 sm:p-5">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_190px_190px_auto]">
              <div className="relative min-w-0">
                <Search
                  size={17}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder={tab === "transactions" ? "Search student, course or ID..." : "Search payout ID or reference..."}
                  aria-label="Search payments"
                  autoComplete="off"
                  className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-10 text-sm outline-none placeholder:text-slate-400 focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />

                {search && (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>

              <PremiumDropdown
                value={status}
                options={(tab === "transactions" ? STATUSES : PAYOUT_FILTERS).map((item) => ({ value: item, label: item }))}
                onChange={setStatus}
                icon={Filter}
                label="Payment status"
                ariaLabel="Filter by payment status"
              />

              <PremiumDropdown
                value={dateRange}
                options={DATES}
                onChange={setDateRange}
                icon={CalendarDays}
                label="Date range"
                ariaLabel="Filter by date range"
              />

              <button
                type="button"
                onClick={resetFilters}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
              >
                <SlidersHorizontal size={16} />
                Reset filters
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <p className="text-xs font-medium text-slate-500">
                Showing <strong className="text-slate-800">{count}</strong>{" "}
                {tab === "transactions" ? "transaction(s)" : "payout(s)"}

                {tab === "payouts" && pendingPayoutCount > 0 && (
                  <span className="ml-2 text-amber-700">
                    · {pendingPayoutCount} awaiting processing
                  </span>
                )}
              </p>

              {tab === "transactions" && (
                <div className="flex min-w-0 items-center gap-2">
                  <span className="shrink-0 text-xs font-medium text-slate-500">
                    Sort by
                  </span>

                  <div className="w-[190px]">
                    <PremiumDropdown
                      value={sort}
                      options={SORT_OPTIONS}
                      onChange={setSort}
                      icon={TrendingUp}
                      label="Sort transactions"
                      ariaLabel="Sort transactions"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Transactions table */}

          {tab === "transactions" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Student / course", "Transaction ID", "Date", "Gross", "Fee", "Net earnings", "Status", "Details"].map((heading) => (
                      <th key={heading} className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredPayments.map((payment) => (
                    <motion.tr
                      key={payment.id}
                      layout={!reduceMotion}
                      className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/30"
                    >
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50 text-sm font-bold text-emerald-800">
                            {payment.student.split(" ").map((part) => part[0]).slice(0, 2).join("").toUpperCase()}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[220px] truncate text-sm font-bold text-slate-900">
                              {payment.student}
                            </p>
                            <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                              {payment.course}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => copyReference(payment.reference)}
                          title="Copy reference"
                          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-emerald-700"
                        >
                          {payment.id}
                          <Copy size={12} />
                        </button>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                        {formatDate(payment.date)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm">
                        {money(payment.grossAmount)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm text-slate-500">
                        {money(payment.platformFee)}
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-bold">
                        {money(payment.netAmount)}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={payment.status} />
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelected(payment)}
                          aria-label={`View ${payment.id}`}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700"
                        >
                          <Eye size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payout history table */}

          {tab === "payouts" && (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Payout ID", "Requested on", "Destination", "Amount", "Status", "Action"].map((heading) => (
                      <th key={heading} className="whitespace-nowrap px-4 py-4 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {filteredPayouts.map((payout) => (
                    <tr key={payout.id} className="border-b border-slate-100 last:border-0 hover:bg-emerald-50/30">
                      <td className="px-4 py-4">
                        <button
                          type="button"
                          onClick={() => copyReference(payout.reference)}
                          className="inline-flex items-center gap-1.5 text-sm font-bold hover:text-emerald-700"
                        >
                          {payout.id}
                          <Copy size={12} />
                        </button>
                        <p className="mt-1 text-[11px] text-slate-400">{payout.reference}</p>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-500">
                        {formatDate(payout.date)}
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <Landmark size={17} className="text-slate-500" />
                          <div>
                            <p className="text-sm font-semibold">{payout.method}</p>
                            <p className="mt-1 text-xs text-slate-400">•••• {payout.accountLast4 || "----"}</p>
                          </div>
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-right text-sm font-bold">
                        {money(payout.amount)}
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={payout.status} />
                      </td>

                      <td className="px-4 py-4 text-right">
                        {payout.status === "Pending" ? (
                          <button
                            type="button"
                            onClick={() => cancelPayout(payout)}
                            className="rounded-lg px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"
                          >
                            Cancel request
                          </button>
                        ) : (
                          <span className="text-xs text-slate-400">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Empty state */}

          {count === 0 && (
            <div className="px-5 py-14 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                <Receipt size={25} />
              </div>

              <h3 className="mt-4 font-bold text-slate-900">
                {tab === "transactions" ? "No transactions found" : "No payout records found"}
              </h3>

              <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                Change your search, date range or status to find records.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 rounded-xl border border-emerald-200 px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
              >
                Reset filters
              </button>
            </div>
          )}

          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/70 px-4 py-4 sm:flex-row sm:items-center">
            <span className="inline-flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck size={15} className="text-emerald-600" />
              Demo records saved in this browser
            </span>

            <span className="text-xs text-slate-400">
              {tab === "transactions"
                ? `${filteredPayments.length} of ${payments.length} transactions`
                : `${filteredPayouts.length} of ${payouts.length} payouts`}
            </span>
          </div>
        </section>

        {/* Transaction details */}

        <Modal
          open={Boolean(selected)}
          onClose={() => setSelected(null)}
          title="Transaction details"
          description="Payment breakdown and reference information."
          icon={Receipt}
        >
          {selected && (
            <div>
              <div className="rounded-2xl border border-emerald-100 bg-emerald-50/60 p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-emerald-700">
                  Net earnings
                </p>
                <p className="mt-2 text-3xl font-bold text-slate-950">
                  {money(selected.netAmount)}
                </p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <StatusBadge status={selected.status} />
                  <span className="text-xs text-slate-500">
                    {formatDate(selected.date, true)}
                  </span>
                </div>
              </div>

              <div className="mt-5 space-y-4">
                {[
                  ["Transaction ID", selected.id],
                  ["Reference", selected.reference],
                  ["Student", selected.student],
                  ["Course", selected.course],
                  ["Payment method", selected.method],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4">
                    <span className="text-sm text-slate-500">{label}</span>
                    {label === "Reference" ? (
                      <button
                        type="button"
                        onClick={() => copyReference(value)}
                        className="max-w-[65%] break-all text-right text-sm font-semibold text-emerald-700"
                      >
                        {value} <Copy size={12} className="inline" />
                      </button>
                    ) : (
                      <span className="max-w-[65%] break-words text-right text-sm font-semibold text-slate-900">
                        {value}
                      </span>
                    )}
                  </div>
                ))}

                <div className="border-t border-slate-100 pt-4">
                  <div className="flex justify-between gap-3 py-2 text-sm">
                    <span className="text-slate-500">Gross amount</span>
                    <strong>{money(selected.grossAmount)}</strong>
                  </div>

                  <div className="flex justify-between gap-3 py-2 text-sm">
                    <span className="text-slate-500">Platform fee</span>
                    <strong className="text-rose-600">−{money(selected.platformFee)}</strong>
                  </div>

                  <div className="mt-2 flex justify-between gap-3 rounded-xl bg-emerald-50 px-3 py-3 text-sm font-bold text-emerald-800">
                    <span>Net earnings</span>
                    <span>{money(selected.netAmount)}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelected(null)}
                className="mt-6 w-full rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Done
              </button>
            </div>
          )}
        </Modal>

        {/* Request payout */}

        <Modal
          open={showPayout}
          onClose={() => setShowPayout(false)}
          title="Request a payout"
          description="Enter an amount to create a demo payout request."
          icon={Wallet}
        >
          <form onSubmit={requestPayout} className="space-y-5">
            <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4">
              <p className="text-sm text-emerald-800">Available balance</p>
              <p className="mt-1 text-2xl font-bold text-emerald-950">{money(available)}</p>
              <p className="mt-2 text-xs text-emerald-800/80">
                Minimum payout: {money(MIN_PAYOUT)}
              </p>
            </div>

            <Field label="Payout amount (INR)" hint={`Maximum available: ${money(available)}`}>
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 font-bold text-slate-500">₹</span>
                <input
                  type="number"
                  min={MIN_PAYOUT}
                  max={available}
                  step="1"
                  required
                  value={amount}
                  onChange={(event) => setAmount(event.target.value)}
                  placeholder="Enter amount"
                  className="w-full rounded-xl border border-slate-200 py-3 pl-9 pr-4 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
                />
              </div>
            </Field>

            <button
              type="button"
              disabled={available < MIN_PAYOUT}
              onClick={() => setAmount(String(available))}
              className="text-sm font-semibold text-emerald-700 disabled:opacity-50"
            >
              Use maximum available balance
            </button>

            <div className="rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-3">
                <Landmark size={20} className="text-slate-600" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{account.bankName}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {account.accountHolder} · •••• {account.accountLast4}
                  </p>
                </div>
                <BadgeCheck size={19} className="text-emerald-600" />
              </div>

              <button
                type="button"
                onClick={() => {
                  setShowPayout(false);
                  openAccountSettings();
                }}
                className="mt-3 text-xs font-bold text-emerald-700"
              >
                Edit payout account
              </button>
            </div>

            <div className="flex items-start gap-2 rounded-xl border border-amber-100 bg-amber-50 p-3 text-xs leading-5 text-amber-800">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              This demo request does not initiate an actual bank transfer.
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowPayout(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={available < MIN_PAYOUT}
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700 disabled:opacity-50"
              >
                Submit request
              </button>
            </div>
          </form>
        </Modal>

        {/* Payout account settings */}

        <Modal
          open={showAccount}
          onClose={() => setShowAccount(false)}
          title="Payout account settings"
          description="Update the account display details."
          icon={Landmark}
        >
          <form onSubmit={saveAccount} className="space-y-5">
            <div className="rounded-xl border border-sky-100 bg-sky-50 p-3 text-xs leading-5 text-sky-800">
              Only the bank label, account holder and last four digits are stored.
              Never enter your full account number, PIN, password or OTP.
            </div>

            <Field label="Account holder name">
              <input
                required
                maxLength={80}
                value={accountForm.accountHolder}
                onChange={(event) =>
                  setAccountForm((current) => ({
                    ...current,
                    accountHolder: event.target.value,
                  }))
                }
                placeholder="Account holder name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </Field>

            <Field label="Bank / payout account label">
              <input
                required
                maxLength={80}
                value={accountForm.bankName}
                onChange={(event) =>
                  setAccountForm((current) => ({
                    ...current,
                    bankName: event.target.value,
                  }))
                }
                placeholder="Bank name"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </Field>

            <Field label="Last four account digits" hint="Only the last four digits, e.g. 4821.">
              <input
                required
                type="text"
                inputMode="numeric"
                pattern="[0-9]{4}"
                maxLength={4}
                value={accountForm.accountLast4}
                onChange={(event) =>
                  setAccountForm((current) => ({
                    ...current,
                    accountLast4: event.target.value.replace(/\D/g, "").slice(0, 4),
                  }))
                }
                placeholder="0000"
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm tracking-widest outline-none focus:border-emerald-400 focus:ring-4 focus:ring-emerald-100"
              />
            </Field>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAccount(false)}
                className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Save account
              </button>
            </div>
          </form>
        </Modal>

        {/* Toast */}

        <AnimatePresence>
          {toast && (
            <motion.div
              key={toast.id}
              role="status"
              initial={reduceMotion ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              className={`fixed bottom-4 left-4 right-4 z-[150] mx-auto flex max-w-md items-center gap-3 rounded-2xl border bg-white p-4 shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 ${toast.tone === "error" ? "border-rose-200" : "border-emerald-200"
                }`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toast.tone === "error" ? "bg-rose-50 text-rose-600" : "bg-emerald-50 text-emerald-600"
                }`}>
                {toast.tone === "error" ? <AlertCircle size={18} /> : <CheckCircle2 size={18} />}
              </div>

              <p className="min-w-0 flex-1 text-sm font-semibold text-slate-800">
                {toast.message}
              </p>

              <button
                type="button"
                onClick={() => setToast(null)}
                aria-label="Dismiss message"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}