import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDownUp,
  Ban,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  Eye,
  FileSpreadsheet,
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
  Users,
  X,
} from "lucide-react";

/* =========================================================
   CODEFACULTY — MANAGE COLLEGES
   Premium Orange + White Theme
========================================================= */

const STORAGE_KEY = "codefaculty_admin_colleges_v2";
const PAGE_SIZE = 6;

const INITIAL_COLLEGES = [
  {
    id: "CLG-1001",
    name: "R.K. Institute of Technology",
    shortName: "RKGIT",
    type: "Engineering College",
    city: "Ghaziabad",
    state: "Uttar Pradesh",
    email: "admin@rkgi.edu.in",
    phone: "+91 98765 43210",
    contactPerson: "Dr. Neeraj Sharma",
    students: 1240,
    trainers: 18,
    programs: 12,
    status: "Active",
    joinedAt: "2025-08-12",
    website: "https://example.com",
    address: "Delhi-Meerut Road, Ghaziabad, Uttar Pradesh",
    notes: "Technology and engineering education partner.",
  },
  {
    id: "CLG-1002",
    name: "Global Institute of Engineering",
    shortName: "GIE",
    type: "Engineering College",
    city: "Jaipur",
    state: "Rajasthan",
    email: "contact@global.example",
    phone: "+91 98123 45670",
    contactPerson: "Prof. Anil Verma",
    students: 860,
    trainers: 14,
    programs: 9,
    status: "Active",
    joinedAt: "2025-09-05",
    website: "https://example.com",
    address: "Ajmer Road, Jaipur, Rajasthan",
    notes: "Partner for technical training and placement readiness.",
  },
  {
    id: "CLG-1003",
    name: "North Valley University",
    shortName: "NVU",
    type: "University",
    city: "Dehradun",
    state: "Uttarakhand",
    email: "office@nvu.example",
    phone: "+91 98760 12345",
    contactPerson: "Dr. Priya Kapoor",
    students: 2180,
    trainers: 26,
    programs: 18,
    status: "Active",
    joinedAt: "2025-10-18",
    website: "https://example.com",
    address: "University Road, Dehradun, Uttarakhand",
    notes: "University partner offering multidisciplinary programs.",
  },
  {
    id: "CLG-1004",
    name: "Apex College of Computer Science",
    shortName: "ACCS",
    type: "Engineering College",
    city: "Lucknow",
    state: "Uttar Pradesh",
    email: "admin@apex.example",
    phone: "+91 97654 32109",
    contactPerson: "Mr. Rahul Saxena",
    students: 720,
    trainers: 11,
    programs: 8,
    status: "Pending",
    joinedAt: "2026-01-14",
    website: "https://example.com",
    address: "Gomti Nagar, Lucknow, Uttar Pradesh",
    notes: "Awaiting final partnership verification.",
  },
  {
    id: "CLG-1005",
    name: "Sunrise Business School",
    shortName: "SBS",
    type: "Management College",
    city: "Delhi",
    state: "Delhi",
    email: "connect@sbs.example",
    phone: "+91 99887 76655",
    contactPerson: "Dr. Meera Joshi",
    students: 540,
    trainers: 9,
    programs: 6,
    status: "Active",
    joinedAt: "2026-02-03",
    website: "https://example.com",
    address: "Rohini, New Delhi",
    notes: "Partner for business and professional development.",
  },
  {
    id: "CLG-1006",
    name: "Eastern Technical Campus",
    shortName: "ETC",
    type: "Technical Institute",
    city: "Kolkata",
    state: "West Bengal",
    email: "office@etc.example",
    phone: "+91 91234 56789",
    contactPerson: "Mr. Sandeep Das",
    students: 0,
    trainers: 0,
    programs: 0,
    status: "Inactive",
    joinedAt: "2025-05-20",
    website: "",
    address: "Salt Lake, Kolkata, West Bengal",
    notes: "Partnership currently inactive.",
  },
  {
    id: "CLG-1007",
    name: "Modern College of Technology",
    shortName: "MCT",
    type: "Engineering College",
    city: "Pune",
    state: "Maharashtra",
    email: "admin@mct.example",
    phone: "+91 90909 12345",
    contactPerson: "Dr. Kavita Patil",
    students: 960,
    trainers: 16,
    programs: 10,
    status: "Pending",
    joinedAt: "2026-04-10",
    website: "https://example.com",
    address: "Hinjawadi, Pune, Maharashtra",
    notes: "Partnership application under review.",
  },
  {
    id: "CLG-1008",
    name: "City Institute of Information Technology",
    shortName: "CIIT",
    type: "Technical Institute",
    city: "Indore",
    state: "Madhya Pradesh",
    email: "info@ciit.example",
    phone: "+91 90011 22334",
    contactPerson: "Mr. Amit Kulkarni",
    students: 680,
    trainers: 12,
    programs: 7,
    status: "Active",
    joinedAt: "2026-05-16",
    website: "https://example.com",
    address: "Vijay Nagar, Indore, Madhya Pradesh",
    notes: "Active technical education partner.",
  },
  {
    id: "CLG-1009",
    name: "Western Hills University",
    shortName: "WHU",
    type: "University",
    city: "Ahmedabad",
    state: "Gujarat",
    email: "admin@whu.example",
    phone: "+91 93456 78901",
    contactPerson: "Dr. Nisha Shah",
    students: 1520,
    trainers: 21,
    programs: 14,
    status: "Active",
    joinedAt: "2026-06-08",
    website: "https://example.com",
    address: "SG Highway, Ahmedabad, Gujarat",
    notes: "Partner for academic and career development programs.",
  },
];

const COLLEGE_TYPES = [
  "Engineering College",
  "University",
  "Management College",
  "Technical Institute",
  "Other",
];

const EMPTY_COLLEGE = {
  name: "",
  shortName: "",
  type: "Engineering College",
  city: "",
  state: "",
  email: "",
  phone: "",
  contactPerson: "",
  students: "0",
  trainers: "0",
  programs: "0",
  status: "Pending",
  joinedAt: new Date().toISOString().slice(0, 10),
  website: "",
  address: "",
  notes: "",
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

function getCollegeColor(value = "") {
  const colors = [
    "bg-orange-50 text-orange-700 border-orange-100",
    "bg-blue-50 text-blue-700 border-blue-100",
    "bg-emerald-50 text-emerald-700 border-emerald-100",
    "bg-violet-50 text-violet-700 border-violet-100",
    "bg-amber-50 text-amber-700 border-amber-100",
  ];

  const number = value
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return colors[number % colors.length];
}

function escapeCSV(value) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

/* =========================================================
   CUSTOM PREMIUM DROPDOWN
   - Portal-based menu, so modal overflow cannot clip it
   - Searchable options
   - Outside click + Escape support
   - Smooth open / close animation
========================================================= */

function PremiumSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  className = "",
  disabled = false,
  searchable,
}) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState(null);

  const shouldSearch =
    searchable ?? options.length > 6;

  const selectedOption = options.find(
    (option) => String(option.value) === String(value)
  );

  const filteredOptions = options.filter((option) =>
    String(option.label)
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  function calculatePosition() {
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

    const spaceBelow = viewportHeight - rect.bottom - 20;
    const spaceAbove = rect.top - 20;
    const openUp = spaceBelow < 200 && spaceAbove > spaceBelow;

    const availableSpace = openUp ? spaceAbove : spaceBelow;
    const maxHeight = Math.min(
      280,
      Math.max(140, availableSpace)
    );

    let top = openUp
      ? rect.top - maxHeight - 8
      : rect.bottom + 8;

    top = Math.max(
      10,
      Math.min(top, viewportHeight - maxHeight - 10)
    );

    setPosition({
      top,
      left,
      width,
      maxHeight,
      openUp,
    });
  }

  function toggleMenu() {
    if (disabled) return;

    if (open) {
      setOpen(false);
      return;
    }

    setSearch("");
    calculatePosition();
    setOpen(true);
  }

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => {
      calculatePosition();
    };

    const handleOutsideClick = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
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

    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleMenu}
        className={[
          "group flex min-h-11 w-full items-center justify-between gap-3 rounded-xl",
          "border bg-white px-3.5 py-2.5 text-left text-sm outline-none",
          "transition duration-200 ease-out",
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
            "min-w-0 flex-1 truncate font-medium",
            selectedOption ? "text-slate-800" : "text-slate-400",
          ].join(" ")}
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={[
            "shrink-0 text-slate-400 transition-transform duration-200",
            open ? "rotate-180 text-[#F4512B]" : "",
          ].join(" ")}
        />
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
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}
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
              className="overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_18px_55px_-18px_rgba(15,23,42,0.32),0_5px_15px_-8px_rgba(15,23,42,0.18)] ring-1 ring-black/[0.025]"
            >
              <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50/80 to-white px-3 py-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                    Available options
                  </span>

                  <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-[#F4512B]">
                    {filteredOptions.length}
                  </span>
                </div>

                {shouldSearch && (
                  <div className="relative mt-2.5">
                    <Search
                      size={15}
                      className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    />

                    <input
                      value={search}
                      onChange={(event) => setSearch(event.target.value)}
                      onKeyDown={(event) => {
                        if (event.key === "Escape") {
                          setOpen(false);
                        }
                      }}
                      placeholder="Search options..."
                      aria-label="Search dropdown options"
                      className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                    />
                  </div>
                )}
              </div>

              <div
                className="overflow-y-auto p-1.5"
                style={{
                  maxHeight: Math.max(
                    80,
                    position.maxHeight - (shouldSearch ? 82 : 42)
                  ),
                  scrollbarWidth: "thin",
                  scrollbarColor: "#FDBA9A #FFF7F3",
                }}
              >
                {filteredOptions.length > 0 ? (
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
                          setSearch("");
                          triggerRef.current?.focus();
                        }}
                        className={[
                          "group/item flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5",
                          "text-left text-sm transition duration-150",
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
                              : "border-slate-100 bg-slate-50 text-slate-400 group-hover/item:border-orange-100 group-hover/item:bg-orange-50 group-hover/item:text-[#F4512B]",
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
                            "min-w-0 flex-1 break-words",
                            selected ? "font-bold" : "font-medium",
                          ].join(" ")}
                        >
                          {option.label}
                        </span>

                        {selected && (
                          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#F4512B]">
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
                      No results found
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      Try a different search term.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-3 py-2">
                <span className="text-[10px] font-medium text-slate-400">
                  CodeFaculty
                </span>
                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                  <ShieldCheck size={12} className="text-[#F4512B]" />
                  Secure selection
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
  const config = {
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

  const item = config[status] || config.Pending;
  const Icon = item.icon;

  return (
    <span
      className={[
        "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1",
        "text-xs font-semibold",
        item.classes,
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
  icon: Icon = Building2,
  onClose,
  children,
  size = "max-w-3xl",
}) {
  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = oldOverflow;
      window.removeEventListener("keydown", onKeyDown);
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
        className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-800 outline-none transition duration-200 placeholder:text-slate-400 hover:border-slate-300 focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
      />
    </label>
  );
}

function FormSelect({
  label,
  name,
  value,
  onChange,
  options,
  required = false,
}) {
  return (
    <label className="block min-w-0">
      <span className="mb-1.5 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-[#F4512B]">*</span>}
      </span>

      <PremiumSelect
        value={value}
        onChange={(nextValue) =>
          onChange({
            target: {
              name,
              value: nextValue,
            },
          })
        }
        options={options}
        searchable={options.length > 5}
      />
    </label>
  );
}

/* =========================================================
   ADD / EDIT COLLEGE MODAL
========================================================= */

function CollegeFormModal({ college, onClose, onSave }) {
  const [form, setForm] = useState(() => ({
    ...EMPTY_COLLEGE,
    ...(college || {}),
    students: String(college?.students ?? 0),
    trainers: String(college?.trainers ?? 0),
    programs: String(college?.programs ?? 0),
  }));

  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const result = onSave({
      ...form,
      name: form.name.trim(),
      shortName: form.shortName.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      email: form.email.trim().toLowerCase(),
      phone: form.phone.trim(),
      contactPerson: form.contactPerson.trim(),
      students: Number(form.students || 0),
      trainers: Number(form.trainers || 0),
      programs: Number(form.programs || 0),
    });

    if (result?.error) {
      setError(result.error);
    }
  }

  return (
    <ModalShell
      title={college ? "Edit College" : "Add New College"}
      subtitle={
        college
          ? "Update institution details and partnership status."
          : "Add an institution to the CodeFaculty college network."
      }
      onClose={onClose}
      icon={Building2}
      size="max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="p-5 sm:p-6">
        <div className="mb-5">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#F4512B]">
            01 — Institution information
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Basic identity and official contact details.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormField
            label="College / Institution Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter institution name"
            required
          />

          <FormField
            label="Short Name"
            name="shortName"
            value={form.shortName}
            onChange={handleChange}
            placeholder="e.g. RKGIT"
            required
          />

          <FormSelect
            label="Institution Type"
            name="type"
            value={form.type}
            onChange={handleChange}
            options={COLLEGE_TYPES.map((type) => ({
              label: type,
              value: type,
            }))}
            required
          />

          <FormField
            label="Contact Person"
            name="contactPerson"
            value={form.contactPerson}
            onChange={handleChange}
            placeholder="Enter contact person's name"
            required
          />

          <FormField
            label="Official Email"
            name="email"
            value={form.email}
            onChange={handleChange}
            type="email"
            placeholder="admin@college.edu"
            required
          />

          <FormField
            label="Contact Number"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
            placeholder="+91 98765 43210"
            required
          />

          <FormField
            label="City"
            name="city"
            value={form.city}
            onChange={handleChange}
            placeholder="Enter city"
            required
          />

          <FormField
            label="State"
            name="state"
            value={form.state}
            onChange={handleChange}
            placeholder="Enter state"
            required
          />

          <FormField
            label="Website"
            name="website"
            value={form.website}
            onChange={handleChange}
            placeholder="https://example.com"
          />

          <FormField
            label="Partnership Start Date"
            name="joinedAt"
            value={form.joinedAt}
            onChange={handleChange}
            type="date"
            required
          />
        </div>

        <div className="mb-4 mt-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.14em] text-[#F4512B]">
            02 — Academic overview
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Enter the current student, trainer and program totals.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <FormField
            label="Students"
            name="students"
            value={form.students}
            onChange={handleChange}
            type="number"
            min="0"
            required
          />

          <FormField
            label="Assigned Trainers"
            name="trainers"
            value={form.trainers}
            onChange={handleChange}
            type="number"
            min="0"
            required
          />

          <FormField
            label="Programs"
            name="programs"
            value={form.programs}
            onChange={handleChange}
            type="number"
            min="0"
            required
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <FormSelect
            label="Partnership Status"
            name="status"
            value={form.status}
            onChange={handleChange}
            options={[
              { label: "Active", value: "Active" },
              { label: "Pending", value: "Pending" },
              { label: "Inactive", value: "Inactive" },
            ]}
            required
          />

          <FormField
            label="Full Address"
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Street, area, city"
          />
        </div>

        <label className="mt-4 block">
          <span className="mb-1.5 block text-sm font-semibold text-slate-700">
            Internal Notes
          </span>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            placeholder="Add relevant partnership notes..."
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
          <ActionButton onClick={onClose}>Cancel</ActionButton>

          <ActionButton type="submit" variant="primary">
            <Check size={16} />
            {college ? "Save Changes" : "Create College"}
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
   COLLEGE DETAILS MODAL
========================================================= */

function CollegeDetailsModal({
  college,
  onClose,
  onEdit,
  onToggleStatus,
}) {
  if (!college) return null;

  return (
    <ModalShell
      title="College Profile"
      subtitle={`Institution ID: ${college.id}`}
      onClose={onClose}
      icon={Building2}
      size="max-w-3xl"
    >
      <div className="p-5 sm:p-6">
        <div className="flex flex-col gap-4 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:flex-row sm:items-center">
          <div
            className={[
              "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border text-xl font-extrabold",
              getCollegeColor(college.shortName || college.name),
            ].join(" ")}
          >
            {getInitials(college.shortName || college.name)}
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={college.status} />
              <span className="text-xs font-semibold text-slate-400">
                {college.type}
              </span>
            </div>

            <h3 className="mt-2 text-xl font-bold tracking-tight text-slate-900">
              {college.name}
            </h3>

            <p className="mt-1 flex items-center gap-1.5 text-sm text-slate-500">
              <MapPin size={14} />
              {college.city}, {college.state}
            </p>
          </div>

          <ActionButton
            onClick={() => onEdit(college)}
            className="shrink-0"
          >
            <Pencil size={15} />
            Edit Profile
          </ActionButton>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "Students",
              value: formatNumber(college.students),
              icon: GraduationCap,
            },
            {
              label: "Assigned Trainers",
              value: formatNumber(college.trainers),
              icon: Users,
            },
            {
              label: "Programs",
              value: formatNumber(college.programs),
              icon: Activity,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-slate-200 bg-white p-4 transition hover:border-orange-200 hover:shadow-sm"
              >
                <Icon size={18} className="text-[#F4512B]" />
                <p className="mt-3 text-2xl font-extrabold tabular-nums text-slate-900">
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
            icon={Users}
            label="Contact Person"
            value={college.contactPerson}
          />
          <DetailItem
            icon={Mail}
            label="Official Email"
            value={college.email}
          />
          <DetailItem
            icon={Phone}
            label="Phone Number"
            value={college.phone}
          />
          <DetailItem
            icon={CalendarDays}
            label="Partnership Start Date"
            value={formatDate(college.joinedAt)}
          />
          <DetailItem
            icon={MapPin}
            label="Address"
            value={college.address}
          />
          <DetailItem
            icon={Building2}
            label="Website"
            value={college.website}
          />
        </div>

        {college.notes && (
          <div className="mt-4 rounded-xl border border-slate-200 p-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Internal notes
            </p>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-600">
              {college.notes}
            </p>
          </div>
        )}

        <div className="mt-6 flex flex-col-reverse justify-between gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center">
          <button
            type="button"
            onClick={() => onToggleStatus(college)}
            className="inline-flex items-center gap-2 self-start rounded-lg px-2 py-2 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
          >
            {college.status === "Active" ? (
              <>
                <Ban size={16} />
                Deactivate College
              </>
            ) : (
              <>
                <CheckCircle2 size={16} />
                Activate College
              </>
            )}
          </button>

          <ActionButton onClick={onClose}>Close Profile</ActionButton>
        </div>
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
   COLLEGE CARD
========================================================= */

function CollegeCard({
  college,
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
            getCollegeColor(college.shortName || college.name),
          ].join(" ")}
        >
          {getInitials(college.shortName || college.name)}
        </div>

        <StatusBadge status={college.status} />
      </div>

      <div className="mt-4 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          {college.id} · {college.type}
        </p>

        <h3
          className="mt-2 min-h-[3.25rem] text-base font-bold leading-6 text-slate-900"
          title={college.name}
        >
          {college.name}
        </h3>

        <p className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
          <MapPin size={15} className="shrink-0 text-slate-400" />
          <span className="truncate">
            {college.city}, {college.state}
          </span>
        </p>

        <p className="mt-1 flex items-center gap-1.5 truncate text-sm text-slate-500">
          <Mail size={14} className="shrink-0 text-slate-400" />
          <span className="truncate">{college.email}</span>
        </p>
      </div>

      <div className="my-5 grid grid-cols-3 divide-x divide-slate-100 rounded-xl border border-slate-100 bg-slate-50/70 py-3">
        <div className="px-2 text-center">
          <p className="text-lg font-extrabold tabular-nums text-slate-900">
            {formatNumber(college.students)}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Students
          </p>
        </div>

        <div className="px-2 text-center">
          <p className="text-lg font-extrabold tabular-nums text-slate-900">
            {formatNumber(college.trainers)}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Trainers
          </p>
        </div>

        <div className="px-2 text-center">
          <p className="text-lg font-extrabold tabular-nums text-slate-900">
            {formatNumber(college.programs)}
          </p>
          <p className="mt-1 text-[11px] font-medium text-slate-500">
            Programs
          </p>
        </div>
      </div>

      <div className="mt-auto flex items-center justify-between gap-2 border-t border-slate-100 pt-4">
        <button
          type="button"
          onClick={() => onView(college)}
          className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-orange-50 hover:text-[#F4512B]"
        >
          <Eye size={16} />
          View Profile
        </button>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => onEdit(college)}
            aria-label={`Edit ${college.name}`}
            title="Edit college"
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B]"
          >
            <Pencil size={15} />
          </button>

          <button
            type="button"
            onClick={() => onToggleStatus(college)}
            aria-label={
              college.status === "Active"
                ? `Deactivate ${college.name}`
                : `Activate ${college.name}`
            }
            title={
              college.status === "Active"
                ? "Deactivate college"
                : "Activate college"
            }
            className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B]"
          >
            {college.status === "Active" ? (
              <Ban size={15} />
            ) : (
              <CheckCircle2 size={15} />
            )}
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-slate-400">
        <CalendarDays size={13} />
        Partner since {formatDate(college.joinedAt)}
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
        <Building2 size={25} />
      </div>

      <h3 className="mt-4 text-lg font-bold text-slate-900">
        {hasFilters ? "No matching colleges" : "No colleges yet"}
      </h3>

      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
        {hasFilters
          ? "Try changing your search or filters to find the institution you are looking for."
          : "Start by adding your first institution to the college management list."}
      </p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {hasFilters && (
          <ActionButton onClick={onReset}>
            <RefreshCw size={15} />
            Reset Filters
          </ActionButton>
        )}

        {!hasFilters && (
          <ActionButton variant="primary" onClick={onAdd}>
            <Plus size={16} />
            Add College
          </ActionButton>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ManageCollegesPage() {
  const [colleges, setColleges] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        if (Array.isArray(parsed)) return parsed;
      }
    } catch {
      // Ignore invalid local storage and use demo records.
    }

    return INITIAL_COLLEGES;
  });

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [stateFilter, setStateFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name-asc");
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);

  const [formOpen, setFormOpen] = useState(false);
  const [editingCollege, setEditingCollege] = useState(null);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(colleges));
    } catch {
      // The UI remains usable even when storage is unavailable.
    }
  }, [colleges]);

  const states = useMemo(
    () =>
      [...new Set(colleges.map((college) => college.state).filter(Boolean))]
        .sort((a, b) => a.localeCompare(b)),
    [colleges]
  );

  const filteredColleges = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = colleges.filter((college) => {
      const matchesSearch =
        !query ||
        [
          college.name,
          college.shortName,
          college.id,
          college.city,
          college.state,
          college.email,
          college.contactPerson,
          college.type,
        ].some((value) =>
          String(value || "").toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "All" || college.status === statusFilter;

      const matchesState =
        stateFilter === "All" || college.state === stateFilter;

      const matchesType =
        typeFilter === "All" || college.type === typeFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesState &&
        matchesType
      );
    });

    result = [...result].sort((a, b) => {
      switch (sortBy) {
        case "name-desc":
          return b.name.localeCompare(a.name);
        case "students-desc":
          return Number(b.students) - Number(a.students);
        case "students-asc":
          return Number(a.students) - Number(b.students);
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
  }, [
    colleges,
    search,
    statusFilter,
    stateFilter,
    typeFilter,
    sortBy,
  ]);

  const activeCount = colleges.filter(
    (college) => college.status === "Active"
  ).length;

  const pendingCount = colleges.filter(
    (college) => college.status === "Pending"
  ).length;

  const inactiveCount = colleges.filter(
    (college) => college.status === "Inactive"
  ).length;

  const totalStudents = colleges.reduce(
    (sum, college) => sum + Number(college.students || 0),
    0
  );

  const totalTrainers = colleges.reduce(
    (sum, college) => sum + Number(college.trainers || 0),
    0
  );

  const totalPrograms = colleges.reduce(
    (sum, college) => sum + Number(college.programs || 0),
    0
  );

  const totalPages = Math.max(
    1,
    Math.ceil(filteredColleges.length / PAGE_SIZE)
  );

  const safePage = Math.min(page, totalPages);

  const visibleColleges = filteredColleges.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  );

  const activeFiltersCount = [
    statusFilter !== "All",
    stateFilter !== "All",
    typeFilter !== "All",
  ].filter(Boolean).length;

  const hasFilters =
    Boolean(search.trim()) || activeFiltersCount > 0;

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, stateFilter, typeFilter, sortBy]);

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setStateFilter("All");
    setTypeFilter("All");
    setSortBy("name-asc");
    setPage(1);
  }

  function openAddModal() {
    setEditingCollege(null);
    setFormOpen(true);
  }

  function openEditModal(college) {
    setSelectedCollege(null);
    setEditingCollege(college);
    setFormOpen(true);
  }

  function saveCollege(form) {
    const duplicateEmail = colleges.some(
      (college) =>
        college.email?.toLowerCase() === form.email?.toLowerCase() &&
        college.id !== editingCollege?.id
    );

    if (duplicateEmail) {
      return {
        error: "This email is already registered with another college.",
      };
    }

    if (editingCollege) {
      setColleges((current) =>
        current.map((college) =>
          college.id === editingCollege.id
            ? { ...college, ...form, id: editingCollege.id }
            : college
        )
      );

      setNotice({
        type: "success",
        message: `${form.name} has been updated successfully.`,
      });
    } else {
      const newCollege = {
        ...form,
        id: `CLG-${Date.now().toString().slice(-6)}`,
      };

      setColleges((current) => [newCollege, ...current]);

      setNotice({
        type: "success",
        message: `${form.name} has been added successfully.`,
      });
    }

    setFormOpen(false);
    setEditingCollege(null);
    setPage(1);

    return { success: true };
  }

  function toggleCollegeStatus(college) {
    const nextStatus =
      college.status === "Active" ? "Inactive" : "Active";

    setColleges((current) =>
      current.map((item) =>
        item.id === college.id
          ? { ...item, status: nextStatus }
          : item
      )
    );

    setSelectedCollege((current) =>
      current?.id === college.id
        ? { ...current, status: nextStatus }
        : current
    );

    setNotice({
      type: "success",
      message: `${college.name} is now ${nextStatus.toLowerCase()}.`,
    });
  }

  function exportCSV() {
    const headers = [
      "College ID",
      "College Name",
      "Short Name",
      "Type",
      "City",
      "State",
      "Contact Person",
      "Email",
      "Phone",
      "Students",
      "Trainers",
      "Programs",
      "Status",
      "Partnership Start Date",
      "Website",
    ];

    const rows = filteredColleges.map((college) => [
      college.id,
      college.name,
      college.shortName,
      college.type,
      college.city,
      college.state,
      college.contactPerson,
      college.email,
      college.phone,
      college.students,
      college.trainers,
      college.programs,
      college.status,
      college.joinedAt,
      college.website,
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
    link.download = `codefaculty-colleges-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    setNotice({
      type: "success",
      message: `${filteredColleges.length} college records exported to CSV.`,
    });
  }

  return (
    <div className="min-h-full min-w-0 bg-[#F8FAFC] px-4 py-5 text-slate-800 sm:px-6 sm:py-6 xl:px-8">
      <div className="mx-auto w-full max-w-[1600px]">
        {/* PAGE HEADER */}
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-slate-400">
              <Building2 size={14} className="text-[#F4512B]" />
              Administration
              <span className="text-slate-300">/</span>
              Institutions
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
              Manage Colleges
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              Manage institution profiles, monitor academic partnerships,
              and organize college records from one place.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <ActionButton onClick={exportCSV}>
              <Download size={16} />
              Export CSV
            </ActionButton>

            <ActionButton variant="primary" onClick={openAddModal}>
              <Plus size={17} />
              Add College
            </ActionButton>
          </div>
        </div>

        {/* NOTIFICATION */}
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

        {/* SUMMARY CARDS */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="Total Colleges"
            value={formatNumber(colleges.length)}
            note="All registered institution records"
            icon={Building2}
            tone="orange"
          />

          <StatCard
            label="Active Colleges"
            value={formatNumber(activeCount)}
            note={`${pendingCount} awaiting approval`}
            icon={CheckCircle2}
            tone="green"
          />

          <StatCard
            label="Students Covered"
            value={formatNumber(totalStudents)}
            note="Total students across all colleges"
            icon={GraduationCap}
            tone="blue"
          />

          <StatCard
            label="Academic Programs"
            value={formatNumber(totalPrograms)}
            note={`${formatNumber(totalTrainers)} trainers across the network`}
            icon={Activity}
            tone="violet"
          />
        </div>

        {/* STATUS OVERVIEW */}
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
            Institution management
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
                placeholder="Search college, ID, city, email or contact..."
                aria-label="Search colleges"
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
                <PremiumSelect
                  value={statusFilter}
                  onChange={setStatusFilter}
                  placeholder="All statuses"
                  options={[
                    { label: "All Statuses", value: "All" },
                    { label: "Active", value: "Active" },
                    { label: "Pending", value: "Pending" },
                    { label: "Inactive", value: "Inactive" },
                  ]}
                  searchable={false}
                />
              </div>

              <div className="min-w-0 xl:w-52">
                <PremiumSelect
                  value={sortBy}
                  onChange={setSortBy}
                  placeholder="Sort colleges"
                  options={[
                    { label: "Name: A to Z", value: "name-asc" },
                    { label: "Name: Z to A", value: "name-desc" },
                    {
                      label: "Students: High to Low",
                      value: "students-desc",
                    },
                    {
                      label: "Students: Low to High",
                      value: "students-asc",
                    },
                    { label: "Newest Partnerships", value: "newest" },
                    { label: "Oldest Partnerships", value: "oldest" },
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
                      Filter by state
                    </p>

                    <PremiumSelect
                      value={stateFilter}
                      onChange={setStateFilter}
                      placeholder="All States"
                      options={[
                        { label: "All States", value: "All" },
                        ...states.map((state) => ({
                          label: state,
                          value: state,
                        })),
                      ]}
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      Institution type
                    </p>

                    <PremiumSelect
                      value={typeFilter}
                      onChange={setTypeFilter}
                      placeholder="All Institution Types"
                      options={[
                        { label: "All Institution Types", value: "All" },
                        ...COLLEGE_TYPES.map((type) => ({
                          label: type,
                          value: type,
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
              College Directory
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-700">
                {filteredColleges.length === 0
                  ? 0
                  : (safePage - 1) * PAGE_SIZE + 1}
                {"–"}
                {Math.min(safePage * PAGE_SIZE, filteredColleges.length)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-slate-700">
                {formatNumber(filteredColleges.length)}
              </span>{" "}
              colleges
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-medium text-slate-400">
            <ArrowDownUp size={14} />
            Sorted by{" "}
            <span className="font-semibold text-slate-600">
              {{
                "name-asc": "Name (A–Z)",
                "name-desc": "Name (Z–A)",
                "students-desc": "Students (High–Low)",
                "students-asc": "Students (Low–High)",
                newest: "Newest",
                oldest: "Oldest",
              }[sortBy]}
            </span>
          </div>
        </div>

        {/* COLLEGE GRID */}
        <motion.div
          layout
          className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {visibleColleges.map((college) => (
              <CollegeCard
                key={college.id}
                college={college}
                onView={setSelectedCollege}
                onEdit={openEditModal}
                onToggleStatus={toggleCollegeStatus}
              />
            ))}
          </AnimatePresence>

          {visibleColleges.length === 0 && (
            <EmptyState
              hasFilters={hasFilters}
              onReset={resetFilters}
              onAdd={openAddModal}
            />
          )}
        </motion.div>

        {/* PAGINATION */}
        {filteredColleges.length > 0 && (
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

              {Array.from({ length: totalPages }, (_, index) => index + 1)
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
                  setPage((current) => Math.min(totalPages, current + 1))
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
          <FileSpreadsheet size={15} className="mt-0.5 shrink-0" />
          <p>
            College data is saved in this browser using local storage.
            It is not yet connected to the backend or shared across users.
          </p>
        </div>
      </div>

      {/* ADD / EDIT MODAL */}
      <AnimatePresence>
        {formOpen && (
          <CollegeFormModal
            key={editingCollege?.id || "new-college"}
            college={editingCollege}
            onClose={() => {
              setFormOpen(false);
              setEditingCollege(null);
            }}
            onSave={saveCollege}
          />
        )}
      </AnimatePresence>

      {/* DETAILS MODAL */}
      <AnimatePresence>
        {selectedCollege && (
          <CollegeDetailsModal
            key={selectedCollege.id}
            college={
              colleges.find(
                (college) => college.id === selectedCollege.id
              ) || selectedCollege
            }
            onClose={() => setSelectedCollege(null)}
            onEdit={openEditModal}
            onToggleStatus={toggleCollegeStatus}
          />
        )}
      </AnimatePresence>
    </div>
  );
}