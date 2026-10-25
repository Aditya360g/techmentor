// src/pages/college/CollegePaymentsPage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDownLeft,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Banknote,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleDollarSign,
  CircleX,
  Clock3,
  CreditCard,
  Download,
  Eye,
  FileText,
  Filter,
  LayoutGrid,
  List,
  Mail,
  MoreHorizontal,
  Pencil,
  Plus,
  Receipt,
  RefreshCw,
  Search,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  TrendingDown,
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "techmentor_college_payments_v1";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const PAYMENT_STATUSES = ["Completed", "Pending", "Failed", "Refunded"];

const PAYMENT_CATEGORIES = [
  "Course Fee",
  "Program Fee",
  "Trainer Payout",
  "Refund",
  "Other",
];

const PAYMENT_METHODS = [
  "UPI",
  "Bank Transfer",
  "Credit Card",
  "Debit Card",
  "Net Banking",
  "Cash",
  "Other",
];

const STATUS_STYLES = {
  Completed: {
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    Icon: CheckCircle2,
  },
  Pending: {
    badge: "border-amber-400/20 bg-amber-400/10 text-amber-200",
    Icon: Clock3,
  },
  Failed: {
    badge: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    Icon: CircleX,
  },
  Refunded: {
    badge: "border-violet-400/20 bg-violet-400/10 text-violet-200",
    Icon: RefreshCw,
  },
};

const EMPTY_FORM = {
  title: "",
  person: "",
  email: "",
  category: "Course Fee",
  amount: "5000",
  method: "UPI",
  date: new Date().toISOString().slice(0, 10),
  status: "Pending",
  reference: "",
  notes: "",
};

const dateOffset = (offset) => {
  const date = new Date();
  date.setDate(date.getDate() + offset);

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, "0"),
    String(date.getDate()).padStart(2, "0"),
  ].join("-");
};

const formatCurrency = (value) =>
  `₹${(Number(value) || 0).toLocaleString("en-IN", {
    maximumFractionDigits: 2,
  })}`;

const formatShortCurrency = (value) => {
  const amount = Number(value) || 0;

  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(1)}Cr`;
  }

  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)}L`;
  }

  if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }

  return `₹${amount.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(`${String(value).slice(0, 10)}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const formatDateTime = (value) => {
  if (!value) return "Not specified";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const makeId = () => `PAY-${Math.floor(10000 + Math.random() * 90000)}`;

const getDirection = (category) =>
  category === "Trainer Payout" || category === "Refund"
    ? "Outgoing"
    : "Incoming";

const getInitials = (name = "") =>
  name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("") || "NA";

const getDateRange = (range) => {
  const today = dateOffset(0);

  if (range === "today") {
    return { from: today, to: today };
  }

  if (range === "7days") {
    return { from: dateOffset(-6), to: today };
  }

  if (range === "30days") {
    return { from: dateOffset(-29), to: today };
  }

  if (range === "90days") {
    return { from: dateOffset(-89), to: today };
  }

  return null;
};

const SEED_PAYMENTS = [
  {
    id: "PAY-20481",
    title: "Python Fundamentals — Course Fee",
    person: "Aarav Sharma",
    email: "aarav@example.com",
    category: "Course Fee",
    direction: "Incoming",
    amount: 14999,
    method: "UPI",
    date: dateOffset(-1),
    status: "Completed",
    reference: "TXN-UPI-823041",
    notes: "Course enrolment payment.",
  },
  {
    id: "PAY-20482",
    title: "Full Stack Development Program",
    person: "Priya Verma",
    email: "priya@example.com",
    category: "Program Fee",
    direction: "Incoming",
    amount: 24999,
    method: "Credit Card",
    date: dateOffset(-1),
    status: "Completed",
    reference: "TXN-CC-823042",
    notes: "Program fee payment for the current batch.",
  },
  {
    id: "PAY-20483",
    title: "Java & DSA Course Fee",
    person: "Rohan Gupta",
    email: "rohan@example.com",
    category: "Course Fee",
    direction: "Incoming",
    amount: 9999,
    method: "UPI",
    date: dateOffset(0),
    status: "Pending",
    reference: "TXN-UPI-823043",
    notes: "Awaiting payment confirmation.",
  },
  {
    id: "PAY-20484",
    title: "Trainer Session Payout",
    person: "Rahul Mehta",
    email: "rahul@example.com",
    category: "Trainer Payout",
    direction: "Outgoing",
    amount: 12500,
    method: "Bank Transfer",
    date: dateOffset(-2),
    status: "Completed",
    reference: "BNK-OUT-723044",
    notes: "Payment for scheduled training sessions.",
  },
  {
    id: "PAY-20485",
    title: "Data Analytics Program Fee",
    person: "Sneha Singh",
    email: "sneha@example.com",
    category: "Program Fee",
    direction: "Incoming",
    amount: 19999,
    method: "Net Banking",
    date: dateOffset(-3),
    status: "Completed",
    reference: "TXN-NB-823045",
    notes: "Program enrolment payment.",
  },
  {
    id: "PAY-20486",
    title: "Course Fee Refund",
    person: "Karan Patel",
    email: "karan@example.com",
    category: "Refund",
    direction: "Outgoing",
    amount: 4999,
    method: "UPI",
    date: dateOffset(-4),
    status: "Refunded",
    reference: "REF-823046",
    notes: "Refund processed for a cancelled enrolment.",
  },
  {
    id: "PAY-20487",
    title: "Frontend Development Course",
    person: "Ananya Joshi",
    email: "ananya@example.com",
    category: "Course Fee",
    direction: "Incoming",
    amount: 12999,
    method: "Debit Card",
    date: dateOffset(-5),
    status: "Failed",
    reference: "TXN-DC-823047",
    notes: "Payment attempt failed. Reconciliation may be required.",
  },
  {
    id: "PAY-20488",
    title: "Trainer Monthly Payout",
    person: "Neha Gupta",
    email: "neha@example.com",
    category: "Trainer Payout",
    direction: "Outgoing",
    amount: 18000,
    method: "Bank Transfer",
    date: dateOffset(-6),
    status: "Pending",
    reference: "BNK-OUT-723048",
    notes: "Pending trainer payout approval.",
  },
  {
    id: "PAY-20489",
    title: "AI & Machine Learning Program",
    person: "Vivek Kumar",
    email: "vivek@example.com",
    category: "Program Fee",
    direction: "Incoming",
    amount: 29999,
    method: "UPI",
    date: dateOffset(-8),
    status: "Completed",
    reference: "TXN-UPI-823049",
    notes: "Program fee received.",
  },
  {
    id: "PAY-20490",
    title: "Workshop Registration",
    person: "Meera Kapoor",
    email: "meera@example.com",
    category: "Other",
    direction: "Incoming",
    amount: 1500,
    method: "UPI",
    date: dateOffset(-10),
    status: "Completed",
    reference: "TXN-UPI-823050",
    notes: "Registration fee for the technical workshop.",
  },
];

function loadPayments() {
  if (typeof window === "undefined") return SEED_PAYMENTS;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load payment records:", error);
  }

  return SEED_PAYMENTS;
}

/* -------------------------------------------------------------------------- */
/*                             REUSABLE UI COMPONENTS                         */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Pending;
  const Icon = style.Icon;

  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        style.badge
      )}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}

function DirectionBadge({ direction }) {
  const incoming = direction === "Incoming";

  return (
    <span
      className={cx(
        "inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-medium",
        incoming
          ? "border-cyan-300/15 bg-cyan-300/[0.06] text-cyan-200"
          : "border-violet-300/15 bg-violet-300/[0.06] text-violet-200"
      )}
    >
      {incoming ? <ArrowDownLeft size={12} /> : <ArrowUpRight size={12} />}
      {direction}
    </span>
  );
}

function CustomDropdown({
  value,
  options,
  onChange,
  icon: Icon,
  width = "w-40",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selected = options.find((option) => option.value === value);

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

  return (
    <div ref={rootRef} className={cx("relative shrink-0", width)}>
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={cx(
          "group flex w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left transition-all duration-200",
          open
            ? "border-cyan-300/40 bg-[#12263c] shadow-[0_0_0_3px_rgba(103,232,249,0.05)]"
            : "border-white/[0.09] bg-[#081525] hover:border-cyan-300/25 hover:bg-[#102036]"
        )}
      >
        {Icon && (
          <Icon
            size={15}
            className={cx(
              "shrink-0 transition-colors",
              open ? "text-cyan-200" : "text-slate-500 group-hover:text-cyan-200"
            )}
          />
        )}

        <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-200">
          {selected?.label || value}
        </span>

        <ChevronDown
          size={14}
          className={cx(
            "shrink-0 text-slate-500 transition-transform duration-200",
            open && "rotate-180 text-cyan-200"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 7, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.985 }}
            transition={{ duration: 0.15 }}
            className="absolute left-0 top-[calc(100%+8px)] z-[100] w-full min-w-[185px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.5)]"
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
                        ? "bg-cyan-300/10 text-cyan-100"
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
                    {active && <Check size={14} className="text-cyan-200" />}
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

function StatCard({ title, value, caption, icon: Icon, tone, progress }) {
  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.18 }}
      className="group relative min-w-0 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0c192b] p-4 sm:p-5"
    >
      <div
        className={cx(
          "pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl opacity-[0.13]",
          tone
        )}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
            {value}
          </p>
          <p className="mt-2 text-[11px] leading-5 text-slate-500">{caption}</p>
        </div>

        <div
          className={cx(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.06]",
            tone
          )}
        >
          <Icon size={18} className="text-cyan-100" />
        </div>
      </div>

      {progress !== undefined && (
        <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            transition={{ duration: 0.65 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300"
          />
        </div>
      )}
    </motion.div>
  );
}

function ModalShell({
  title,
  subtitle,
  icon: Icon,
  onClose,
  children,
  wide = false,
}) {
  useEffect(() => {
    const handler = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        key="payment-modal"
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
          exit={{ opacity: 0, y: 10, scale: 0.985 }}
          transition={{ duration: 0.2 }}
          className={cx(
            "my-auto w-full overflow-hidden rounded-3xl border border-white/10 bg-[#0b1728] shadow-[0_30px_100px_rgba(0,0,0,0.5)]",
            wide ? "max-w-3xl" : "max-w-xl"
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08]">
                <Icon size={19} className="text-cyan-200" />
              </div>

              <div className="min-w-0">
                <h2 className="text-base font-semibold text-white">{title}</h2>
                <p className="mt-1 text-xs leading-5 text-slate-400">{subtitle}</p>
              </div>
            </div>

            <button
              type="button"
              aria-label="Close modal"
              onClick={onClose}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
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

function TextInput({ icon: Icon, className, ...props }) {
  if (!Icon) {
    return <input {...props} className={cx(inputClass, className)} />;
  }

  return (
    <div className="relative">
      <Icon
        size={15}
        className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
      />
      <input {...props} className={cx(inputClass, "pl-10", className)} />
    </div>
  );
}

function SelectInput({ children, className, ...props }) {
  return (
    <div className="relative">
      <select {...props} className={cx(inputClass, "appearance-none pr-9", className)}>
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
/*                            CREATE / EDIT MODAL                             */
/* -------------------------------------------------------------------------- */

function PaymentFormModal({ payment, onClose, onSave }) {
  const editing = Boolean(payment);

  const [form, setForm] = useState(() =>
    payment
      ? {
        ...EMPTY_FORM,
        ...payment,
        amount: String(payment.amount ?? ""),
        date: String(payment.date || "").slice(0, 10),
      }
      : EMPTY_FORM
  );

  const [error, setError] = useState("");

  const change = (field, value) => {
    setForm((previous) => ({ ...previous, [field]: value }));
    setError("");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Please enter a payment description.");
      return;
    }

    if (!form.person.trim()) {
      setError("Please enter the student, trainer or recipient name.");
      return;
    }

    if (!Number(form.amount) || Number(form.amount) <= 0) {
      setError("Please enter a valid amount greater than zero.");
      return;
    }

    if (!form.date) {
      setError("Please select a transaction date.");
      return;
    }

    const direction = getDirection(form.category);

    onSave({
      ...form,
      id: payment?.id || makeId(),
      title: form.title.trim(),
      person: form.person.trim(),
      email: form.email.trim(),
      amount: Number(form.amount),
      direction,
      date: form.date,
      reference: form.reference.trim(),
      notes: form.notes.trim(),
    });
  };

  return (
    <ModalShell
      title={editing ? "Edit payment record" : "Add payment record"}
      subtitle={
        editing
          ? `Update transaction ${payment.id}.`
          : "Record an incoming payment, payout, refund or other transaction."
      }
      icon={Receipt}
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
                Transaction details
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field label="Payment description" required>
                  <TextInput
                    value={form.title}
                    onChange={(event) => change("title", event.target.value)}
                    placeholder="e.g. Python Course Fee"
                    autoFocus
                  />
                </Field>
              </div>

              <Field label="Transaction category" required>
                <SelectInput
                  value={form.category}
                  onChange={(event) => change("category", event.target.value)}
                >
                  {PAYMENT_CATEGORIES.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Amount (₹)" required>
                <TextInput
                  type="number"
                  min="1"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => change("amount", event.target.value)}
                  placeholder="5000"
                />
              </Field>

              <Field label="Student / trainer / recipient" required>
                <TextInput
                  value={form.person}
                  onChange={(event) => change("person", event.target.value)}
                  placeholder="Full name"
                />
              </Field>

              <Field label="Email address">
                <TextInput
                  type="email"
                  icon={Mail}
                  value={form.email}
                  onChange={(event) => change("email", event.target.value)}
                  placeholder="person@example.com"
                />
              </Field>
            </div>

            <div className="mt-4 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.035] px-3.5 py-3">
              <div className="flex items-center gap-2">
                {getDirection(form.category) === "Incoming" ? (
                  <ArrowDownLeft size={15} className="text-cyan-200" />
                ) : (
                  <ArrowUpRight size={15} className="text-violet-200" />
                )}

                <span className="text-xs font-semibold text-slate-200">
                  {getDirection(form.category)} transaction
                </span>
              </div>

              <p className="mt-1.5 text-[10px] leading-5 text-slate-500">
                {getDirection(form.category) === "Incoming"
                  ? "This category is counted as an incoming payment in the summary."
                  : "This category is counted as an outgoing payment or refund in the summary."}
              </p>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-[11px] font-bold text-cyan-200">
                02
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-300">
                Payment information
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Payment method">
                <SelectInput
                  value={form.method}
                  onChange={(event) => change("method", event.target.value)}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Transaction status">
                <SelectInput
                  value={form.status}
                  onChange={(event) => change("status", event.target.value)}
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Transaction date" required>
                <TextInput
                  type="date"
                  value={form.date}
                  onChange={(event) => change("date", event.target.value)}
                />
              </Field>

              <Field label="Reference / transaction ID">
                <TextInput
                  value={form.reference}
                  onChange={(event) => change("reference", event.target.value)}
                  placeholder="e.g. TXN-123456"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Internal notes">
                  <textarea
                    rows={3}
                    value={form.notes}
                    onChange={(event) => change("notes", event.target.value)}
                    placeholder="Add reconciliation details or other notes..."
                    className={cx(inputClass, "resize-y")}
                  />
                </Field>
              </div>
            </div>
          </section>

          {error && (
            <div className="flex items-start gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.07] px-3.5 py-3 text-xs text-rose-200">
              <CircleAlert size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-white/[0.07] bg-[#091423] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[10px] text-slate-500">
            This creates a local record, not a real bank transaction.
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
              {editing ? "Save changes" : "Save transaction"}
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*                              PAYMENT DETAILS                               */
/* -------------------------------------------------------------------------- */

function PaymentDetailsModal({
  payment,
  onClose,
  onEdit,
  onStatusChange,
  onCopyReference,
}) {
  if (!payment) return null;

  const isIncoming = payment.direction === "Incoming";

  return (
    <ModalShell
      title="Transaction details"
      subtitle={`Payment reference · ${payment.id}`}
      icon={Receipt}
      onClose={onClose}
      wide
    >
      <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-6">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-[#12334b] via-[#10253b] to-[#0b1728] p-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-cyan-300/[0.09] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex min-w-0 items-start gap-3">
              <div
                className={cx(
                  "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border",
                  isIncoming
                    ? "border-cyan-300/15 bg-cyan-300/[0.08]"
                    : "border-violet-300/15 bg-violet-300/[0.08]"
                )}
              >
                {isIncoming ? (
                  <ArrowDownLeft size={22} className="text-cyan-200" />
                ) : (
                  <ArrowUpRight size={22} className="text-violet-200" />
                )}
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={payment.status} />
                  <DirectionBadge direction={payment.direction} />
                </div>

                <h3 className="text-xl font-semibold leading-snug text-white">
                  {payment.title}
                </h3>

                <p className="mt-1.5 text-xs text-slate-300">
                  {payment.person}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEdit(payment)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
            >
              <Pencil size={14} />
              Edit record
            </button>
          </div>

          <div className="relative mt-5 border-t border-white/10 pt-4">
            <p className="text-[10px] text-slate-400">Transaction amount</p>
            <p className="mt-1 text-3xl font-semibold tracking-tight text-white">
              {isIncoming ? "+" : "−"}
              {formatCurrency(payment.amount)}
            </p>

            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              <div>
                <p className="text-[10px] text-slate-400">Payment method</p>
                <p className="mt-1 text-xs font-medium text-slate-200">
                  {payment.method}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Transaction date</p>
                <p className="mt-1 text-xs font-medium text-slate-200">
                  {formatDate(payment.date)}
                </p>
              </div>

              <div>
                <p className="text-[10px] text-slate-400">Category</p>
                <p className="mt-1 text-xs font-medium text-slate-200">
                  {payment.category}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-[#081323] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <Users size={15} className="text-cyan-300" />
              Payer / recipient
            </div>

            <p className="text-sm font-medium text-slate-200">
              {payment.person}
            </p>

            <p className="mt-1 break-all text-xs text-slate-400">
              {payment.email || "No email added"}
            </p>

            <p className="mt-3 text-[10px] text-slate-500">
              Record direction: {payment.direction}
            </p>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#081323] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <ShieldCheck size={15} className="text-cyan-300" />
              Transaction reference
            </div>

            <p className="break-all text-sm font-medium text-slate-200">
              {payment.reference || "No reference added"}
            </p>

            {payment.reference && (
              <button
                type="button"
                onClick={() => onCopyReference(payment.reference)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <FileText size={12} />
                Copy reference
              </button>
            )}
          </div>
        </div>

        <section className="rounded-2xl border border-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
            <FileText size={15} className="text-cyan-300" />
            Internal notes
          </div>

          <p className="whitespace-pre-wrap text-xs leading-6 text-slate-400">
            {payment.notes || "No internal notes added."}
          </p>
        </section>

        <section className="border-t border-white/[0.07] pt-4">
          <h3 className="mb-3 text-xs font-semibold text-slate-300">
            Update transaction status
          </h3>

          <div className="flex flex-wrap gap-2">
            {PAYMENT_STATUSES.filter((status) => status !== payment.status).map(
              (status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => onStatusChange(payment.id, status)}
                  className={cx(
                    "inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition",
                    status === "Completed"
                      ? "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-200 hover:bg-emerald-400/10"
                      : status === "Pending"
                        ? "border-amber-400/20 bg-amber-400/[0.06] text-amber-200 hover:bg-amber-400/10"
                        : status === "Failed"
                          ? "border-rose-400/20 bg-rose-400/[0.06] text-rose-200 hover:bg-rose-400/10"
                          : "border-violet-400/20 bg-violet-400/[0.06] text-violet-200 hover:bg-violet-400/10"
                  )}
                >
                  {status === "Completed" ? (
                    <CheckCircle2 size={14} />
                  ) : status === "Pending" ? (
                    <Clock3 size={14} />
                  ) : status === "Failed" ? (
                    <CircleX size={14} />
                  ) : (
                    <RefreshCw size={14} />
                  )}

                  Mark {status.toLowerCase()}
                </button>
              )
            )}
          </div>

          <p className="mt-3 text-[10px] leading-5 text-slate-500">
            Changing this status updates the local dashboard record only. It does
            not trigger a payment, payout or refund with a bank or payment gateway.
          </p>
        </section>
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*                                MAIN PAGE                                   */
/* -------------------------------------------------------------------------- */

export default function CollegePaymentsPage() {
  const [payments, setPayments] = useState(loadPayments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [methodFilter, setMethodFilter] = useState("all");
  const [directionFilter, setDirectionFilter] = useState("all");
  const [dateFilter, setDateFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [view, setView] = useState("list");
  const [formOpen, setFormOpen] = useState(false);
  const [formPayment, setFormPayment] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payments));
    } catch (error) {
      console.error("Unable to save payment records:", error);
    }
  }, [payments]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  const selectedPayment = useMemo(
    () => payments.find((item) => item.id === selectedId) || null,
    [payments, selectedId]
  );

  const openCreate = () => {
    setFormPayment(null);
    setFormOpen(true);
    setActiveMenu(null);
  };

  const openEdit = (payment) => {
    setSelectedId(null);
    setActiveMenu(null);
    setFormPayment(payment);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormPayment(null);
  };

  const savePayment = (data) => {
    setPayments((previous) => {
      const exists = previous.some((item) => item.id === data.id);

      if (exists) {
        return previous.map((item) =>
          item.id === data.id ? { ...item, ...data } : item
        );
      }

      return [data, ...previous];
    });

    closeForm();
    setSelectedId(null);
    notify(formPayment ? "Payment record updated." : "Payment record created.");
  };

  const updateStatus = (id, status) => {
    setPayments((previous) =>
      previous.map((payment) =>
        payment.id === id
          ? {
            ...payment,
            status,
            updatedAt: new Date().toISOString(),
          }
          : payment
      )
    );

    const messages = {
      Completed: "Payment marked as completed.",
      Pending: "Payment marked as pending.",
      Failed: "Payment marked as failed.",
      Refunded: "Record marked as refunded.",
    };

    setActiveMenu(null);
    notify(messages[status] || "Payment status updated.");
  };

  const deletePayment = (payment) => {
    const confirmed = window.confirm(
      `Delete transaction ${payment.id} — "${payment.title}"? This cannot be undone.`
    );

    if (!confirmed) return;

    setPayments((previous) =>
      previous.filter((item) => item.id !== payment.id)
    );

    setActiveMenu(null);
    setSelectedId(null);
    notify("Payment record deleted.");
  };

  const copyReference = async (reference) => {
    if (!reference) return;

    try {
      await navigator.clipboard.writeText(reference);
      notify("Transaction reference copied.");
    } catch {
      notify("Unable to copy automatically. Please copy the reference manually.", "error");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setCategoryFilter("all");
    setMethodFilter("all");
    setDirectionFilter("all");
    setDateFilter("all");
    setSortBy("newest");
  };

  const hasFilters =
    Boolean(search.trim()) ||
    statusFilter !== "all" ||
    categoryFilter !== "all" ||
    methodFilter !== "all" ||
    directionFilter !== "all" ||
    dateFilter !== "all" ||
    sortBy !== "newest";

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();
    const dateRange = getDateRange(dateFilter);

    return payments
      .filter((payment) => {
        if (statusFilter !== "all" && payment.status !== statusFilter) {
          return false;
        }

        if (
          categoryFilter !== "all" &&
          payment.category !== categoryFilter
        ) {
          return false;
        }

        if (methodFilter !== "all" && payment.method !== methodFilter) {
          return false;
        }

        if (
          directionFilter !== "all" &&
          payment.direction !== directionFilter
        ) {
          return false;
        }

        if (dateRange) {
          const paymentDate = String(payment.date || "").slice(0, 10);

          if (paymentDate < dateRange.from || paymentDate > dateRange.to) {
            return false;
          }
        }

        if (query) {
          const searchable = [
            payment.id,
            payment.title,
            payment.person,
            payment.email,
            payment.category,
            payment.method,
            payment.direction,
            payment.status,
            payment.reference,
          ]
            .join(" ")
            .toLowerCase();

          if (!searchable.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "oldest") {
          return String(a.date || "").localeCompare(String(b.date || ""));
        }

        if (sortBy === "highest") return Number(b.amount) - Number(a.amount);
        if (sortBy === "lowest") return Number(a.amount) - Number(b.amount);

        return (
          String(b.date || "").localeCompare(String(a.date || "")) ||
          String(b.id).localeCompare(String(a.id))
        );
      });
  }, [
    payments,
    search,
    statusFilter,
    categoryFilter,
    methodFilter,
    directionFilter,
    dateFilter,
    sortBy,
  ]);

  const stats = useMemo(() => {
    const completedIncoming = payments
      .filter(
        (payment) =>
          payment.direction === "Incoming" && payment.status === "Completed"
      )
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const pendingIncoming = payments
      .filter(
        (payment) =>
          payment.direction === "Incoming" && payment.status === "Pending"
      )
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const completedOutgoing = payments
      .filter(
        (payment) =>
          payment.direction === "Outgoing" && payment.status === "Completed"
      )
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const refundedAmount = payments
      .filter((payment) => payment.status === "Refunded")
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const completedCount = payments.filter(
      (payment) => payment.status === "Completed"
    ).length;

    const pendingCount = payments.filter(
      (payment) => payment.status === "Pending"
    ).length;

    return {
      received: completedIncoming,
      pending: pendingIncoming,
      payouts: completedOutgoing,
      refunded: refundedAmount,
      total: payments.length,
      completedCount,
      pendingCount,
    };
  }, [payments]);

  const exportCsv = () => {
    const headers = [
      "Transaction ID",
      "Description",
      "Person",
      "Email",
      "Category",
      "Direction",
      "Amount INR",
      "Payment Method",
      "Date",
      "Status",
      "Reference",
      "Notes",
    ];

    const rows = filteredPayments.map((payment) => [
      payment.id,
      payment.title,
      payment.person,
      payment.email,
      payment.category,
      payment.direction,
      payment.amount,
      payment.method,
      payment.date,
      payment.status,
      payment.reference,
      payment.notes,
    ]);

    const escapeCsv = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCsv).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "college-payment-transactions.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    notify(`${filteredPayments.length} payment records exported.`);
  };

  const menuAction = (payment, action) => {
    setActiveMenu(null);

    if (action === "view") {
      setSelectedId(payment.id);
    } else if (action === "edit") {
      openEdit(payment);
    } else if (action === "delete") {
      deletePayment(payment);
    } else if (action === "complete") {
      updateStatus(payment.id, "Completed");
    } else if (action === "pending") {
      updateStatus(payment.id, "Pending");
    } else if (action === "failed") {
      updateStatus(payment.id, "Failed");
    } else if (action === "refunded") {
      updateStatus(payment.id, "Refunded");
    }
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
            <span className="text-cyan-300">Payments</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/15 to-sky-400/[0.04] sm:flex">
              <Wallet size={23} className="text-cyan-200" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
                  Payments & Billing
                </h1>

                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-2 py-1 text-[10px] font-semibold text-cyan-200">
                  <ShieldCheck size={11} />
                  Finance hub
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Track course payments, program fees, trainer payouts and refunds
                from your college finance workspace.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={exportCsv}
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
            Add transaction
          </button>
        </div>
      </motion.header>

      {/* Summary cards */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total received"
          value={formatShortCurrency(stats.received)}
          caption="Completed incoming payments"
          icon={TrendingUp}
          tone="bg-cyan-400/15"
        />

        <StatCard
          title="Pending collection"
          value={formatShortCurrency(stats.pending)}
          caption={`${stats.pendingCount} payment records awaiting completion`}
          icon={Clock3}
          tone="bg-amber-400/15"
        />

        <StatCard
          title="Trainer payouts"
          value={formatShortCurrency(stats.payouts)}
          caption="Completed outgoing payouts"
          icon={Building2}
          tone="bg-indigo-400/15"
        />

        <StatCard
          title="Refunded amount"
          value={formatShortCurrency(stats.refunded)}
          caption="Records marked as refunded"
          icon={RefreshCw}
          tone="bg-violet-400/15"
        />
      </section>

      {/* Finance banner */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-300/[0.13] bg-gradient-to-r from-[#103047] via-[#10253b] to-[#0b192a] p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.07] blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.08]">
              <Sparkles size={18} className="text-cyan-200" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white">
                Your finance overview at a glance
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300/75">
                Review pending collections, reconcile transaction references and
                keep outgoing trainer payments organised.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-xl border border-white/10 bg-[#061525]/40 px-3 py-2.5 text-[11px] font-medium text-slate-300">
              <Receipt size={13} className="text-cyan-200" />
              {stats.total} records
            </span>

            <button
              type="button"
              onClick={() => {
                setStatusFilter("Pending");
                setDirectionFilter("all");
                setCategoryFilter("all");
                setMethodFilter("all");
                setDateFilter("all");
                setSearch("");
              }}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/15 bg-[#061525]/40 px-3.5 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.08]"
            >
              Review pending
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Transaction directory and filters */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b] p-3 sm:p-4">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035]">
              <SlidersHorizontal size={16} className="text-cyan-300" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Transaction directory
              </h2>

              <p className="mt-0.5 text-[11px] text-slate-500">
                {filteredPayments.length} of {payments.length} transactions
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
              Cards
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
              placeholder="Search transaction ID, description, person or reference..."
              className="w-full rounded-xl border border-white/[0.09] bg-[#071323] py-3 pl-10 pr-10 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-300/[0.05]"
            />

            {search && (
              <button
                type="button"
                aria-label="Clear search"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 2xl:flex">
            <CustomDropdown
              value={statusFilter}
              onChange={setStatusFilter}
              icon={Filter}
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "All statuses", value: "all" },
                ...PAYMENT_STATUSES.map((status) => ({
                  label: status,
                  value: status,
                })),
              ]}
            />

            <CustomDropdown
              value={categoryFilter}
              onChange={setCategoryFilter}
              icon={Receipt}
              width="w-full sm:w-40 2xl:w-40"
              options={[
                { label: "All categories", value: "all" },
                ...PAYMENT_CATEGORIES.map((category) => ({
                  label: category,
                  value: category,
                })),
              ]}
            />

            <CustomDropdown
              value={methodFilter}
              onChange={setMethodFilter}
              icon={CreditCard}
              width="w-full sm:w-40 2xl:w-40"
              options={[
                { label: "All methods", value: "all" },
                ...PAYMENT_METHODS.map((method) => ({
                  label: method,
                  value: method,
                })),
              ]}
            />

            <CustomDropdown
              value={directionFilter}
              onChange={setDirectionFilter}
              icon={ArrowRight}
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "All directions", value: "all" },
                { label: "Incoming", value: "Incoming" },
                { label: "Outgoing", value: "Outgoing" },
              ]}
            />

            <CustomDropdown
              value={dateFilter}
              onChange={setDateFilter}
              icon={CalendarDays}
              width="w-full sm:w-36 2xl:w-36"
              options={[
                { label: "Any date", value: "all" },
                { label: "Today", value: "today" },
                { label: "Last 7 days", value: "7days" },
                { label: "Last 30 days", value: "30days" },
                { label: "Last 90 days", value: "90days" },
              ]}
            />

            <CustomDropdown
              value={sortBy}
              onChange={setSortBy}
              icon={Activity}
              width="w-full sm:w-40 2xl:w-40"
              options={[
                { label: "Newest first", value: "newest" },
                { label: "Oldest first", value: "oldest" },
                { label: "Highest amount", value: "highest" },
                { label: "Lowest amount", value: "lowest" },
              ]}
            />
          </div>
        </div>

        {hasFilters && (
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

            {categoryFilter !== "all" && (
              <button
                type="button"
                onClick={() => setCategoryFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {categoryFilter}
                <X size={11} />
              </button>
            )}

            {methodFilter !== "all" && (
              <button
                type="button"
                onClick={() => setMethodFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {methodFilter}
                <X size={11} />
              </button>
            )}

            {directionFilter !== "all" && (
              <button
                type="button"
                onClick={() => setDirectionFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {directionFilter}
                <X size={11} />
              </button>
            )}

            {dateFilter !== "all" && (
              <button
                type="button"
                onClick={() => setDateFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {dateFilter === "today"
                  ? "Today"
                  : dateFilter === "7days"
                    ? "Last 7 days"
                    : dateFilter === "30days"
                      ? "Last 30 days"
                      : "Last 90 days"}
                <X size={11} />
              </button>
            )}

            {sortBy !== "newest" && (
              <button
                type="button"
                onClick={() => setSortBy("newest")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                Sort: {sortBy}
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

      {/* Transactions */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b]">
        {filteredPayments.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <Wallet size={27} className="text-cyan-300" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-white">
              No matching transactions
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Try changing your search or filters to find payment records.
            </p>

            <div className="mt-5 flex flex-wrap justify-center gap-2">
              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05]"
                >
                  Clear filters
                </button>
              )}

              <button
                type="button"
                onClick={openCreate}
                className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-[#071323] transition hover:bg-cyan-200"
              >
                <Plus size={15} />
                Add transaction
              </button>
            </div>
          </div>
        ) : view === "list" ? (
          <div>
            <div className="flex flex-col justify-between gap-2 border-b border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  All transactions
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Select a record to see the full transaction details.
                </p>
              </div>

              <span className="w-fit rounded-lg border border-white/[0.07] bg-[#071323] px-2.5 py-1.5 text-[10px] text-slate-400">
                {filteredPayments.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-[#091525]/80">
                    {[
                      "Transaction",
                      "Date",
                      "Person",
                      "Method",
                      "Amount",
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
                  {filteredPayments.map((payment, index) => {
                    const isIncoming = payment.direction === "Incoming";

                    return (
                      <motion.tr
                        key={payment.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: Math.min(index * 0.02, 0.18) }}
                        className="group border-b border-white/[0.045] transition-colors last:border-0 hover:bg-white/[0.025]"
                      >
                        <td className="max-w-[320px] px-4 py-4 pl-5">
                          <button
                            type="button"
                            onClick={() => setSelectedId(payment.id)}
                            className="block min-w-0 text-left"
                          >
                            <span className="block truncate text-xs font-semibold text-slate-100 transition group-hover:text-cyan-200">
                              {payment.title}
                            </span>

                            <span className="mt-1.5 flex items-center gap-2 text-[10px] text-slate-500">
                              <span>{payment.id}</span>
                              <span className="h-1 w-1 rounded-full bg-slate-700" />
                              <span className="truncate">{payment.category}</span>
                            </span>
                          </button>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <div className="inline-flex items-center gap-2 text-xs text-slate-300">
                            <CalendarDays size={13} className="text-slate-500" />
                            {formatDate(payment.date)}
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2.5">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/10 bg-cyan-300/[0.07] text-[10px] font-bold text-cyan-200">
                              {getInitials(payment.person)}
                            </div>

                            <div className="min-w-0">
                              <p className="max-w-[140px] truncate text-xs font-medium text-slate-200">
                                {payment.person}
                              </p>
                              <p className="mt-1 max-w-[140px] truncate text-[10px] text-slate-500">
                                {payment.email || "No email"}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <span className="inline-flex items-center gap-1.5 text-[11px] text-slate-400">
                            {payment.method === "Bank Transfer" ? (
                              <Building2 size={13} className="text-cyan-300" />
                            ) : payment.method === "UPI" ? (
                              <Wallet size={13} className="text-cyan-300" />
                            ) : (
                              <CreditCard size={13} className="text-cyan-300" />
                            )}
                            {payment.method}
                          </span>
                        </td>

                        <td className="whitespace-nowrap px-4 py-4">
                          <div
                            className={cx(
                              "text-xs font-semibold tabular-nums",
                              isIncoming ? "text-emerald-200" : "text-violet-200"
                            )}
                          >
                            {isIncoming ? "+" : "−"}
                            {formatCurrency(payment.amount)}
                          </div>
                          <div className="mt-1">
                            <DirectionBadge direction={payment.direction} />
                          </div>
                        </td>

                        <td className="px-4 py-4">
                          <StatusBadge status={payment.status} />
                        </td>

                        <td className="px-4 py-4 pr-5">
                          <div className="relative flex justify-end">
                            <button
                              type="button"
                              aria-label={`Actions for ${payment.id}`}
                              onClick={() =>
                                setActiveMenu((previous) =>
                                  previous === payment.id ? null : payment.id
                                )
                              }
                              className={cx(
                                "flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white",
                                activeMenu === payment.id &&
                                "border-white/10 bg-white/[0.05] text-white"
                              )}
                            >
                              <MoreHorizontal size={17} />
                            </button>

                            <AnimatePresence>
                              {activeMenu === payment.id && (
                                <motion.div
                                  initial={{ opacity: 0, y: 6, scale: 0.98 }}
                                  animate={{ opacity: 1, y: 0, scale: 1 }}
                                  exit={{ opacity: 0, y: 4, scale: 0.98 }}
                                  className="absolute right-0 top-9 z-[90] w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                                >
                                  <button
                                    type="button"
                                    onClick={() => menuAction(payment, "view")}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                                  >
                                    <Eye size={14} />
                                    View details
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => menuAction(payment, "edit")}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                                  >
                                    <Pencil size={14} />
                                    Edit record
                                  </button>

                                  {payment.status !== "Completed" && (
                                    <button
                                      type="button"
                                      onClick={() => menuAction(payment, "complete")}
                                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-emerald-200 transition hover:bg-emerald-400/[0.07]"
                                    >
                                      <CheckCircle2 size={14} />
                                      Mark completed
                                    </button>
                                  )}

                                  {payment.status !== "Pending" && (
                                    <button
                                      type="button"
                                      onClick={() => menuAction(payment, "pending")}
                                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-amber-200 transition hover:bg-amber-400/[0.07]"
                                    >
                                      <Clock3 size={14} />
                                      Mark pending
                                    </button>
                                  )}

                                  {payment.status !== "Failed" && (
                                    <button
                                      type="button"
                                      onClick={() => menuAction(payment, "failed")}
                                      className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-rose-200 transition hover:bg-rose-400/[0.07]"
                                    >
                                      <CircleX size={14} />
                                      Mark failed
                                    </button>
                                  )}

                                  {payment.status !== "Refunded" &&
                                    payment.direction === "Incoming" && (
                                      <button
                                        type="button"
                                        onClick={() => menuAction(payment, "refunded")}
                                        className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-violet-200 transition hover:bg-violet-400/[0.07]"
                                      >
                                        <RefreshCw size={14} />
                                        Mark refunded
                                      </button>
                                    )}

                                  <div className="my-1 border-t border-white/[0.07]" />

                                  <button
                                    type="button"
                                    onClick={() => menuAction(payment, "delete")}
                                    className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-rose-300 transition hover:bg-rose-400/[0.07]"
                                  >
                                    <X size={14} />
                                    Delete record
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
                Showing{" "}
                <strong className="font-semibold text-slate-300">
                  {filteredPayments.length}
                </strong>{" "}
                transactions
              </span>

              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Changes save in this browser
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Payment records
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Browse incoming payments and outgoing transactions.
                </p>
              </div>

              <span className="w-fit rounded-lg border border-white/[0.07] bg-[#071323] px-2.5 py-1.5 text-[10px] text-slate-400">
                {filteredPayments.length} records
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {filteredPayments.map((payment, index) => {
                const isIncoming = payment.direction === "Incoming";

                return (
                  <motion.article
                    key={payment.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.025, 0.2) }}
                    className="group min-w-0 rounded-2xl border border-white/[0.07] bg-[#091525] p-4 transition duration-200 hover:border-cyan-300/20 hover:bg-[#0b1b2e] sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={cx(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                            isIncoming
                              ? "border-cyan-300/10 bg-cyan-300/[0.06]"
                              : "border-violet-300/10 bg-violet-300/[0.06]"
                          )}
                        >
                          {isIncoming ? (
                            <ArrowDownLeft size={19} className="text-cyan-200" />
                          ) : (
                            <ArrowUpRight size={19} className="text-violet-200" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-[10px] text-slate-500">
                            {payment.id}
                          </p>
                          <h3 className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-white transition group-hover:text-cyan-100">
                            {payment.title}
                          </h3>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => setSelectedId(payment.id)}
                        aria-label={`View ${payment.id}`}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                      >
                        <Eye size={16} />
                      </button>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2">
                      <StatusBadge status={payment.status} />
                      <DirectionBadge direction={payment.direction} />
                    </div>

                    <div className="mt-4 rounded-xl border border-white/[0.06] bg-[#071323]/65 p-3.5">
                      <p className="text-[10px] text-slate-500">Transaction amount</p>
                      <p
                        className={cx(
                          "mt-1 text-2xl font-semibold tracking-tight",
                          isIncoming ? "text-emerald-200" : "text-violet-200"
                        )}
                      >
                        {isIncoming ? "+" : "−"}
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>

                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-2.5">
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-cyan-300/10 bg-cyan-300/[0.06] text-[10px] font-bold text-cyan-200">
                          {getInitials(payment.person)}
                        </div>

                        <div className="min-w-0">
                          <p className="truncate text-xs font-medium text-slate-200">
                            {payment.person}
                          </p>
                          <p className="mt-0.5 truncate text-[10px] text-slate-500">
                            {payment.email || "No email"}
                          </p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <p className="text-[10px] text-slate-500">Payment method</p>
                          <p className="mt-1 text-xs font-medium text-slate-300">
                            {payment.method}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] text-slate-500">Transaction date</p>
                          <p className="mt-1 text-xs font-medium text-slate-300">
                            {formatDate(payment.date)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                      <span className="truncate text-[10px] text-slate-500">
                        {payment.category}
                      </span>

                      <button
                        type="button"
                        onClick={() => setSelectedId(payment.id)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-[11px] font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-200"
                      >
                        View details
                        <ArrowUpRight size={13} />
                      </button>
                    </div>
                  </motion.article>
                );
              })}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>Showing {filteredPayments.length} transactions</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Changes save in this browser
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 pb-2 text-[10px] leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Payments & Billing · College Portal</p>

        <p className="inline-flex items-center gap-1.5">
          <ShieldCheck size={12} className="text-cyan-300" />
          Finance workspace
        </p>
      </footer>

      {/* Create / edit modal */}
      {formOpen && (
        <PaymentFormModal
          key={formPayment?.id || "new-payment"}
          payment={formPayment}
          onClose={closeForm}
          onSave={savePayment}
        />
      )}

      {/* Details modal */}
      {selectedPayment && (
        <PaymentDetailsModal
          payment={selectedPayment}
          onClose={() => setSelectedId(null)}
          onEdit={openEdit}
          onStatusChange={updateStatus}
          onCopyReference={copyReference}
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
              aria-label="Dismiss notification"
              onClick={() => setToast(null)}
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