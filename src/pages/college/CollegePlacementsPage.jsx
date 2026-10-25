// src/pages/college/CollegePlacementsPage.jsx

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Briefcase,
  Building2,
  CalendarCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  CircleX,
  Clock3,
  Code2,
  Download,
  Eye,
  Filter,
  GraduationCap,
  LayoutGrid,
  Link2,
  List,
  Mail,
  MapPin,
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
  TrendingUp,
  Users,
  Wallet,
  X,
} from "lucide-react";

/* -------------------------------------------------------------------------- */
/*                                    HELPERS                                 */
/* -------------------------------------------------------------------------- */

const STORAGE_KEY = "techmentor_college_placements_v1";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const formatCurrency = (value) => {
  const number = Number(value) || 0;

  if (number >= 100000) {
    return `₹${(number / 100000).toFixed(number % 100000 === 0 ? 0 : 1)} LPA`;
  }

  return `₹${number.toLocaleString("en-IN")}`;
};

const formatDate = (value) => {
  if (!value) return "Not specified";

  const date = new Date(`${value}T12:00:00`);

  if (Number.isNaN(date.getTime())) return "Not specified";

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const dateOffset = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);

  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
    2,
    "0"
  )}-${String(date.getDate()).padStart(2, "0")}`;
};

const makeId = () => `PLC-${Math.floor(1000 + Math.random() * 9000)}`;

const STATUS_STYLES = {
  Active: {
    badge: "border-cyan-400/20 bg-cyan-400/10 text-cyan-200",
    dot: "bg-cyan-300",
    Icon: CheckCircle2,
  },
  Draft: {
    badge: "border-slate-400/20 bg-slate-400/10 text-slate-300",
    dot: "bg-slate-400",
    Icon: Pencil,
  },
  Closed: {
    badge: "border-rose-400/20 bg-rose-400/10 text-rose-200",
    dot: "bg-rose-300",
    Icon: CircleX,
  },
  Completed: {
    badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-200",
    dot: "bg-emerald-300",
    Icon: BadgeCheck,
  },
};

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Internship",
  "Internship + PPO",
  "Contract",
];

const DEPARTMENTS = [
  "Computer Science",
  "Information Technology",
  "AI & Data Science",
  "Electronics",
  "Mechanical",
  "All Departments",
];

const EMPTY_FORM = {
  company: "",
  role: "",
  package: "600000",
  location: "Remote",
  type: "Full-time",
  openings: "5",
  eligibleStudents: "100",
  applications: "0",
  selected: "0",
  deadline: dateOffset(14),
  driveDate: dateOffset(20),
  department: "Computer Science",
  status: "Active",
  recruiter: "",
  recruiterEmail: "",
  website: "",
  skills: "",
  description: "",
  featured: false,
};

const SEED_PLACEMENTS = [
  {
    id: "PLC-1041",
    company: "TechNova Solutions",
    role: "Software Development Engineer",
    package: 1200000,
    location: "Bengaluru",
    type: "Full-time",
    openings: 12,
    eligibleStudents: 180,
    applications: 86,
    selected: 4,
    deadline: dateOffset(6),
    driveDate: dateOffset(12),
    department: "Computer Science",
    status: "Active",
    recruiter: "Ankit Sharma",
    recruiterEmail: "ankit@example.com",
    website: "https://example.com",
    skills: "Java, DSA, SQL, Problem Solving",
    description:
      "Campus hiring for software engineering roles. Candidates should have strong programming fundamentals and an interest in scalable software systems.",
    featured: true,
  },
  {
    id: "PLC-1042",
    company: "DataBridge Analytics",
    role: "Junior Data Analyst",
    package: 800000,
    location: "Gurugram",
    type: "Full-time",
    openings: 8,
    eligibleStudents: 120,
    applications: 64,
    selected: 2,
    deadline: dateOffset(9),
    driveDate: dateOffset(16),
    department: "AI & Data Science",
    status: "Active",
    recruiter: "Priya Mehta",
    recruiterEmail: "priya@example.com",
    website: "https://example.com",
    skills: "Python, SQL, Power BI, Statistics",
    description:
      "Entry-level data analytics opportunity focused on reporting, data cleaning, dashboard building and turning business data into insights.",
    featured: true,
  },
  {
    id: "PLC-1043",
    company: "CloudPeak Systems",
    role: "Cloud Engineering Intern",
    package: 350000,
    location: "Remote",
    type: "Internship + PPO",
    openings: 10,
    eligibleStudents: 140,
    applications: 52,
    selected: 0,
    deadline: dateOffset(11),
    driveDate: dateOffset(19),
    department: "Information Technology",
    status: "Active",
    recruiter: "Rahul Verma",
    recruiterEmail: "rahul@example.com",
    website: "",
    skills: "Linux, Git, Docker, AWS Basics",
    description:
      "An internship opportunity for students interested in cloud infrastructure, automation, deployment workflows and DevOps fundamentals.",
    featured: false,
  },
  {
    id: "PLC-1044",
    company: "PixelCraft Digital",
    role: "Frontend Developer",
    package: 650000,
    location: "Jaipur",
    type: "Full-time",
    openings: 6,
    eligibleStudents: 90,
    applications: 48,
    selected: 1,
    deadline: dateOffset(15),
    driveDate: dateOffset(23),
    department: "Computer Science",
    status: "Active",
    recruiter: "Neha Kapoor",
    recruiterEmail: "neha@example.com",
    website: "",
    skills: "React, JavaScript, CSS, REST APIs",
    description:
      "Frontend engineering role working on responsive applications, reusable components, accessibility and product-focused UI development.",
    featured: false,
  },
  {
    id: "PLC-1045",
    company: "Apex FinTech",
    role: "Graduate Engineer Trainee",
    package: 950000,
    location: "Mumbai",
    type: "Full-time",
    openings: 15,
    eligibleStudents: 200,
    applications: 132,
    selected: 8,
    deadline: dateOffset(3),
    driveDate: dateOffset(8),
    department: "All Departments",
    status: "Active",
    recruiter: "Vikas Singh",
    recruiterEmail: "vikas@example.com",
    website: "",
    skills: "Java, SQL, OOP, Aptitude",
    description:
      "Graduate hiring program with technical assessments, mentorship and exposure to financial technology products.",
    featured: true,
  },
  {
    id: "PLC-1046",
    company: "InnovateAI Labs",
    role: "Machine Learning Intern",
    package: 400000,
    location: "Hyderabad",
    type: "Internship",
    openings: 5,
    eligibleStudents: 70,
    applications: 39,
    selected: 0,
    deadline: dateOffset(18),
    driveDate: dateOffset(28),
    department: "AI & Data Science",
    status: "Draft",
    recruiter: "Aarav Gupta",
    recruiterEmail: "aarav@example.com",
    website: "",
    skills: "Python, NumPy, Pandas, Machine Learning",
    description:
      "Internship focused on data preparation, model experimentation, evaluation and practical machine learning workflows.",
    featured: false,
  },
  {
    id: "PLC-1047",
    company: "BrightWeb Technologies",
    role: "Web Development Intern",
    package: 240000,
    location: "Remote",
    type: "Internship",
    openings: 12,
    eligibleStudents: 150,
    applications: 93,
    selected: 5,
    deadline: dateOffset(-3),
    driveDate: dateOffset(-1),
    department: "Information Technology",
    status: "Completed",
    recruiter: "Simran Kaur",
    recruiterEmail: "simran@example.com",
    website: "",
    skills: "HTML, CSS, JavaScript, React",
    description:
      "Practical web development internship for students building experience in modern frontend development.",
    featured: false,
  },
  {
    id: "PLC-1048",
    company: "CoreStack Technologies",
    role: "Associate Software Engineer",
    package: 700000,
    location: "Pune",
    type: "Full-time",
    openings: 10,
    eligibleStudents: 160,
    applications: 76,
    selected: 0,
    deadline: dateOffset(-2),
    driveDate: dateOffset(2),
    department: "Computer Science",
    status: "Closed",
    recruiter: "Karan Joshi",
    recruiterEmail: "karan@example.com",
    website: "",
    skills: "C++, DSA, SQL, Communication",
    description:
      "Entry-level software engineering hiring drive. Applications have closed for this cycle.",
    featured: false,
  },
];

function loadPlacements() {
  if (typeof window === "undefined") return SEED_PLACEMENTS;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load placement records:", error);
  }

  return SEED_PLACEMENTS;
}

/* -------------------------------------------------------------------------- */
/*                             PREMIUM UI COMPONENTS                          */
/* -------------------------------------------------------------------------- */

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Draft;
  const Icon = style.Icon;

  return (
    <span
      className={cx(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[10px] font-semibold",
        style.badge
      )}
    >
      <Icon size={12} />
      {status}
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
  const ref = useRef(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
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
    <div ref={ref} className={cx("relative shrink-0", width)}>
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
            className="absolute left-0 top-[calc(100%+8px)] z-[100] w-full min-w-[190px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.5)]"
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

function StatCard({ label, value, caption, icon: Icon, tone, progress }) {
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
          <p className="text-xs font-medium text-slate-400">{label}</p>
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
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.7 }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300"
          />
        </div>
      )}
    </motion.div>
  );
}

function ModalShell({ title, subtitle, icon: Icon, onClose, children, wide = false }) {
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
        key="placement-modal"
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
      <select
        {...props}
        className={cx(inputClass, "appearance-none pr-9", className)}
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
/*                             CREATE / EDIT MODAL                            */
/* -------------------------------------------------------------------------- */

function PlacementFormModal({ placement, onClose, onSave }) {
  const editing = Boolean(placement);

  const [form, setForm] = useState(() =>
    placement
      ? {
        ...EMPTY_FORM,
        ...placement,
        package: String(placement.package ?? ""),
        openings: String(placement.openings ?? "1"),
        eligibleStudents: String(placement.eligibleStudents ?? "0"),
        applications: String(placement.applications ?? "0"),
        selected: String(placement.selected ?? "0"),
        skills: placement.skills ?? "",
        description: placement.description ?? "",
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

    if (!form.company.trim()) {
      setError("Please enter the company name.");
      return;
    }

    if (!form.role.trim()) {
      setError("Please enter the job role.");
      return;
    }

    if (!Number(form.package) || Number(form.package) <= 0) {
      setError("Please enter a valid annual package in rupees.");
      return;
    }

    if (!Number(form.openings) || Number(form.openings) < 1) {
      setError("There must be at least one opening.");
      return;
    }

    if (!form.deadline) {
      setError("Please select an application deadline.");
      return;
    }

    if (!form.driveDate) {
      setError("Please select the placement drive date.");
      return;
    }

    onSave({
      ...form,
      id: placement?.id || makeId(),
      company: form.company.trim(),
      role: form.role.trim(),
      package: Number(form.package),
      openings: Number(form.openings),
      eligibleStudents: Number(form.eligibleStudents) || 0,
      applications: Number(form.applications) || 0,
      selected: Number(form.selected) || 0,
      recruiter: form.recruiter.trim(),
      recruiterEmail: form.recruiterEmail.trim(),
      skills: form.skills.trim(),
      description: form.description.trim(),
    });
  };

  return (
    <ModalShell
      title={editing ? "Edit placement drive" : "Create placement drive"}
      subtitle={
        editing
          ? `Update the opportunity details for ${placement.id}.`
          : "Add a hiring opportunity to your college placement directory."
      }
      icon={Briefcase}
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
                Opportunity details
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Company name" required>
                <TextInput
                  value={form.company}
                  onChange={(event) => change("company", event.target.value)}
                  placeholder="e.g. TechNova Solutions"
                  autoFocus
                />
              </Field>

              <Field label="Job role / position" required>
                <TextInput
                  value={form.role}
                  onChange={(event) => change("role", event.target.value)}
                  placeholder="e.g. Software Engineer"
                />
              </Field>

              <Field label="Annual package (₹)" required hint="Enter the full annual amount in rupees. Example: 800000 = 8 LPA.">
                <TextInput
                  type="number"
                  min="1"
                  value={form.package}
                  onChange={(event) => change("package", event.target.value)}
                  placeholder="800000"
                />
              </Field>

              <Field label="Work location">
                <TextInput
                  icon={MapPin}
                  value={form.location}
                  onChange={(event) => change("location", event.target.value)}
                  placeholder="Bengaluru / Remote"
                />
              </Field>

              <Field label="Employment type">
                <SelectInput
                  value={form.type}
                  onChange={(event) => change("type", event.target.value)}
                >
                  {EMPLOYMENT_TYPES.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <Field label="Eligible department">
                <SelectInput
                  value={form.department}
                  onChange={(event) => change("department", event.target.value)}
                >
                  {DEPARTMENTS.map((department) => (
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
                Recruitment plan
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Total openings" required>
                <TextInput
                  type="number"
                  min="1"
                  value={form.openings}
                  onChange={(event) => change("openings", event.target.value)}
                  placeholder="10"
                />
              </Field>

              <Field label="Eligible students">
                <TextInput
                  type="number"
                  min="0"
                  value={form.eligibleStudents}
                  onChange={(event) => change("eligibleStudents", event.target.value)}
                  placeholder="100"
                />
              </Field>

              <Field label="Application deadline" required>
                <TextInput
                  type="date"
                  value={form.deadline}
                  onChange={(event) => change("deadline", event.target.value)}
                />
              </Field>

              <Field label="Placement drive date" required>
                <TextInput
                  type="date"
                  value={form.driveDate}
                  onChange={(event) => change("driveDate", event.target.value)}
                />
              </Field>

              <Field label="Applications received">
                <TextInput
                  type="number"
                  min="0"
                  value={form.applications}
                  onChange={(event) => change("applications", event.target.value)}
                  placeholder="0"
                />
              </Field>

              <Field label="Students selected">
                <TextInput
                  type="number"
                  min="0"
                  value={form.selected}
                  onChange={(event) => change("selected", event.target.value)}
                  placeholder="0"
                />
              </Field>

              <Field label="Drive status">
                <SelectInput
                  value={form.status}
                  onChange={(event) => change("status", event.target.value)}
                >
                  {["Active", "Draft", "Closed", "Completed"].map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </SelectInput>
              </Field>

              <div className="flex items-center rounded-xl border border-white/[0.08] bg-[#081323] px-3.5 py-3">
                <input
                  id="placement-featured"
                  type="checkbox"
                  checked={Boolean(form.featured)}
                  onChange={(event) => change("featured", event.target.checked)}
                  className="h-4 w-4 accent-cyan-300"
                />
                <label
                  htmlFor="placement-featured"
                  className="ml-2.5 cursor-pointer text-xs text-slate-300"
                >
                  Feature this opportunity
                  <span className="mt-1 block text-[10px] text-slate-500">
                    Highlight it on the placement page.
                  </span>
                </label>
              </div>
            </div>
          </section>

          <section>
            <div className="mb-4 flex items-center gap-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-[11px] font-bold text-cyan-200">
                03
              </span>
              <h3 className="text-xs font-semibold uppercase tracking-[0.13em] text-slate-300">
                Recruiter & requirements
              </h3>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Recruiter / contact person">
                <TextInput
                  value={form.recruiter}
                  onChange={(event) => change("recruiter", event.target.value)}
                  placeholder="Recruiter's name"
                />
              </Field>

              <Field label="Recruiter email">
                <TextInput
                  icon={Mail}
                  type="email"
                  value={form.recruiterEmail}
                  onChange={(event) => change("recruiterEmail", event.target.value)}
                  placeholder="recruiter@company.com"
                />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Company website">
                  <TextInput
                    icon={Link2}
                    type="url"
                    value={form.website}
                    onChange={(event) => change("website", event.target.value)}
                    placeholder="https://company.com"
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Required skills" hint="Separate skills using commas.">
                  <TextInput
                    value={form.skills}
                    onChange={(event) => change("skills", event.target.value)}
                    placeholder="React, JavaScript, SQL, Problem Solving"
                  />
                </Field>
              </div>

              <div className="sm:col-span-2">
                <Field label="Job description">
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(event) => change("description", event.target.value)}
                    placeholder="Describe responsibilities, eligibility, interview rounds and expectations..."
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
              {editing ? "Save changes" : "Create opportunity"}
            </button>
          </div>
        </div>
      </form>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*                              DETAILS MODAL                                 */
/* -------------------------------------------------------------------------- */

function PlacementDetailsModal({
  placement,
  onClose,
  onEdit,
  onStatusChange,
  onCopyEmail,
}) {
  if (!placement) return null;

  const applicationRate = placement.eligibleStudents
    ? Math.min(
      100,
      Math.round(
        (Number(placement.applications) /
          Number(placement.eligibleStudents)) *
        100
      )
    )
    : 0;

  return (
    <ModalShell
      title="Placement opportunity"
      subtitle={`Drive reference · ${placement.id}`}
      icon={Briefcase}
      onClose={onClose}
      wide
    >
      <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 sm:p-6">
        <div className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-[#12334b] via-[#10253b] to-[#0b1728] p-5">
          <div className="pointer-events-none absolute -right-8 -top-10 h-40 w-40 rounded-full bg-cyan-300/[0.09] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.06] text-lg font-bold text-cyan-100">
                {placement.company?.slice(0, 1)?.toUpperCase() || "C"}
              </div>

              <div className="min-w-0">
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <StatusBadge status={placement.status} />
                  {placement.featured && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-amber-300/15 bg-amber-300/[0.08] px-2 py-1 text-[10px] font-semibold text-amber-200">
                      <Sparkles size={11} />
                      Featured
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-semibold leading-snug text-white">
                  {placement.role}
                </h3>
                <p className="mt-1.5 text-sm text-slate-300">
                  {placement.company}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onEdit(placement)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-3.5 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
            >
              <Pencil size={14} />
              Edit opportunity
            </button>
          </div>

          <div className="relative mt-5 grid gap-4 border-t border-white/10 pt-4 sm:grid-cols-3">
            <div>
              <p className="text-[10px] text-slate-400">Annual package</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {formatCurrency(placement.package)}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Total openings</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {placement.openings}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-slate-400">Students selected</p>
              <p className="mt-1 text-lg font-semibold text-white">
                {placement.selected}
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Applications",
              value: placement.applications,
              icon: Users,
            },
            {
              label: "Eligible students",
              value: placement.eligibleStudents,
              icon: GraduationCap,
            },
            {
              label: "Application deadline",
              value: formatDate(placement.deadline),
              icon: Clock3,
            },
            {
              label: "Drive date",
              value: formatDate(placement.driveDate),
              icon: CalendarDays,
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.label}
                className="rounded-xl border border-white/[0.07] bg-[#081323] p-3.5"
              >
                <Icon size={15} className="text-cyan-300" />
                <p className="mt-3 text-[10px] text-slate-500">{item.label}</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-200">
                  {item.value}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/[0.07] bg-[#081323] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <Building2 size={15} className="text-cyan-300" />
              Company information
            </div>

            <div className="space-y-3">
              <div className="flex items-start gap-2.5">
                <MapPin size={14} className="mt-0.5 shrink-0 text-slate-500" />
                <div>
                  <p className="text-[10px] text-slate-500">Location</p>
                  <p className="mt-1 text-xs text-slate-200">
                    {placement.location || "Not specified"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Briefcase size={14} className="mt-0.5 shrink-0 text-slate-500" />
                <div>
                  <p className="text-[10px] text-slate-500">Employment type</p>
                  <p className="mt-1 text-xs text-slate-200">{placement.type}</p>
                </div>
              </div>

              {placement.website && (
                <div className="flex items-start gap-2.5">
                  <Link2 size={14} className="mt-0.5 shrink-0 text-slate-500" />
                  <a
                    href={placement.website}
                    target="_blank"
                    rel="noreferrer"
                    className="break-all text-xs text-cyan-200 hover:text-cyan-100"
                  >
                    {placement.website}
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.07] bg-[#081323] p-4">
            <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
              <Mail size={15} className="text-cyan-300" />
              Recruiter contact
            </div>

            <p className="text-sm font-medium text-slate-200">
              {placement.recruiter || "Contact not added"}
            </p>
            <p className="mt-1 break-all text-xs text-slate-400">
              {placement.recruiterEmail || "No email available"}
            </p>

            {placement.recruiterEmail && (
              <button
                type="button"
                onClick={() => onCopyEmail(placement.recruiterEmail)}
                className="mt-3 inline-flex items-center gap-2 rounded-lg border border-white/[0.08] px-3 py-2 text-[11px] font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
              >
                <Mail size={12} />
                Copy email
              </button>
            )}
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] p-4">
          <div className="mb-3 flex items-center gap-2 text-xs font-semibold text-white">
            <Code2 size={15} className="text-cyan-300" />
            Skills & requirements
          </div>

          <div className="flex flex-wrap gap-2">
            {(placement.skills || "")
              .split(",")
              .map((skill) => skill.trim())
              .filter(Boolean)
              .map((skill) => (
                <span
                  key={skill}
                  className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.05] px-2.5 py-1.5 text-[11px] text-cyan-100"
                >
                  {skill}
                </span>
              ))}

            {!placement.skills && (
              <span className="text-xs text-slate-500">No skills specified.</span>
            )}
          </div>

          <p className="mt-4 whitespace-pre-wrap text-xs leading-6 text-slate-400">
            {placement.description || "No job description has been added."}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.07] p-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <span className="text-xs font-semibold text-white">
              Application activity
            </span>
            <span className="text-xs font-semibold text-cyan-200">
              {applicationRate}% of eligible students
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-sky-300 transition-all"
              style={{ width: `${applicationRate}%` }}
            />
          </div>

          <div className="mt-3 flex flex-wrap justify-between gap-2 text-[10px] text-slate-500">
            <span>{placement.applications} applications recorded</span>
            <span>{placement.selected} selected</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-white/[0.07] pt-4">
          {placement.status === "Draft" && (
            <button
              type="button"
              onClick={() => onStatusChange(placement.id, "Active")}
              className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
            >
              <CheckCircle2 size={14} />
              Publish drive
            </button>
          )}

          {placement.status === "Active" && (
            <>
              <button
                type="button"
                onClick={() => onStatusChange(placement.id, "Completed")}
                className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/20 bg-emerald-400/[0.06] px-3.5 py-2.5 text-xs font-semibold text-emerald-200 transition hover:bg-emerald-400/10"
              >
                <BadgeCheck size={14} />
                Mark completed
              </button>

              <button
                type="button"
                onClick={() => onStatusChange(placement.id, "Closed")}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-400/20 bg-rose-400/[0.05] px-3.5 py-2.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-400/10"
              >
                <CircleX size={14} />
                Close applications
              </button>
            </>
          )}

          {(placement.status === "Closed" ||
            placement.status === "Completed") && (
              <button
                type="button"
                onClick={() => onStatusChange(placement.id, "Active")}
                className="inline-flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/15"
              >
                <RefreshCw size={14} />
                Reopen drive
              </button>
            )}
        </div>
      </div>
    </ModalShell>
  );
}

/* -------------------------------------------------------------------------- */
/*                               MAIN PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function CollegePlacementsPage() {
  const [placements, setPlacements] = useState(loadPlacements);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState("all");
  const [packageFilter, setPackageFilter] = useState("all");
  const [view, setView] = useState("grid");
  const [formOpen, setFormOpen] = useState(false);
  const [formPlacement, setFormPlacement] = useState(null);
  const [selectedPlacement, setSelectedPlacement] = useState(null);
  const [activeMenu, setActiveMenu] = useState(null);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(placements));
    } catch (error) {
      console.error("Unable to save placement data:", error);
    }
  }, [placements]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message, type = "success") => {
    setToast({ message, type, id: Date.now() });
  };

  const openCreate = () => {
    setFormPlacement(null);
    setFormOpen(true);
    setActiveMenu(null);
  };

  const openEdit = (placement) => {
    setSelectedPlacement(null);
    setActiveMenu(null);
    setFormPlacement(placement);
    setFormOpen(true);
  };

  const closeForm = () => {
    setFormOpen(false);
    setFormPlacement(null);
  };

  const savePlacement = (data) => {
    setPlacements((previous) => {
      const exists = previous.some((item) => item.id === data.id);

      if (exists) {
        return previous.map((item) =>
          item.id === data.id ? { ...item, ...data } : item
        );
      }

      return [data, ...previous];
    });

    closeForm();
    setSelectedPlacement(null);
    notify(formPlacement ? "Placement opportunity updated." : "Placement drive created.");
  };

  const changeStatus = (id, status) => {
    setPlacements((previous) =>
      previous.map((placement) =>
        placement.id === id ? { ...placement, status } : placement
      )
    );

    setSelectedPlacement((previous) =>
      previous?.id === id ? { ...previous, status } : previous
    );

    setActiveMenu(null);

    const labels = {
      Active: "Drive published.",
      Draft: "Drive moved to draft.",
      Closed: "Applications closed.",
      Completed: "Drive marked as completed.",
    };

    notify(labels[status] || "Placement status updated.");
  };

  const deletePlacement = (placement) => {
    const confirmed = window.confirm(
      `Delete "${placement.role}" at ${placement.company}? This cannot be undone.`
    );

    if (!confirmed) return;

    setPlacements((previous) =>
      previous.filter((item) => item.id !== placement.id)
    );

    setActiveMenu(null);
    setSelectedPlacement(null);
    notify("Placement opportunity deleted.");
  };

  const copyEmail = async (email) => {
    try {
      await navigator.clipboard.writeText(email);
      notify("Recruiter email copied.");
    } catch {
      notify("Unable to copy automatically. Please copy the email manually.", "error");
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setTypeFilter("all");
    setDepartmentFilter("all");
    setPackageFilter("all");
  };

  const hasFilters =
    Boolean(search.trim()) ||
    statusFilter !== "all" ||
    typeFilter !== "all" ||
    departmentFilter !== "all" ||
    packageFilter !== "all";

  const filteredPlacements = useMemo(() => {
    const query = search.trim().toLowerCase();

    return placements
      .filter((placement) => {
        if (statusFilter !== "all" && placement.status !== statusFilter) {
          return false;
        }

        if (typeFilter !== "all" && placement.type !== typeFilter) {
          return false;
        }

        if (
          departmentFilter !== "all" &&
          placement.department !== departmentFilter
        ) {
          return false;
        }

        const packageValue = Number(placement.package) || 0;

        if (packageFilter === "under5" && packageValue >= 500000) {
          return false;
        }

        if (
          packageFilter === "5to10" &&
          (packageValue < 500000 || packageValue > 1000000)
        ) {
          return false;
        }

        if (packageFilter === "above10" && packageValue <= 1000000) {
          return false;
        }

        if (query) {
          const searchable = [
            placement.id,
            placement.company,
            placement.role,
            placement.location,
            placement.type,
            placement.department,
            placement.status,
            placement.skills,
            placement.recruiter,
          ]
            .join(" ")
            .toLowerCase();

          if (!searchable.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (a.featured !== b.featured) return a.featured ? -1 : 1;

        const dateA = a.deadline ? new Date(`${a.deadline}T12:00:00`).getTime() : 0;
        const dateB = b.deadline ? new Date(`${b.deadline}T12:00:00`).getTime() : 0;

        return dateA - dateB;
      });
  }, [
    placements,
    search,
    statusFilter,
    typeFilter,
    departmentFilter,
    packageFilter,
  ]);

  const stats = useMemo(() => {
    const active = placements.filter((item) => item.status === "Active");
    const openings = active.reduce(
      (sum, item) => sum + (Number(item.openings) || 0),
      0
    );
    const applications = placements.reduce(
      (sum, item) => sum + (Number(item.applications) || 0),
      0
    );
    const selected = placements.reduce(
      (sum, item) => sum + (Number(item.selected) || 0),
      0
    );

    const activePackages = active
      .map((item) => Number(item.package) || 0)
      .filter((value) => value > 0);

    const averagePackage = activePackages.length
      ? Math.round(
        activePackages.reduce((sum, value) => sum + value, 0) /
        activePackages.length
      )
      : 0;

    const conversion = applications
      ? Math.round((selected / applications) * 100)
      : 0;

    return {
      active: active.length,
      openings,
      applications,
      averagePackage,
      conversion,
    };
  }, [placements]);

  const exportCsv = () => {
    const headers = [
      "ID",
      "Company",
      "Role",
      "Package (INR/year)",
      "Location",
      "Type",
      "Openings",
      "Eligible Students",
      "Applications",
      "Selected",
      "Application Deadline",
      "Drive Date",
      "Department",
      "Status",
      "Recruiter",
      "Recruiter Email",
      "Skills",
      "Description",
    ];

    const rows = filteredPlacements.map((item) => [
      item.id,
      item.company,
      item.role,
      item.package,
      item.location,
      item.type,
      item.openings,
      item.eligibleStudents,
      item.applications,
      item.selected,
      item.deadline,
      item.driveDate,
      item.department,
      item.status,
      item.recruiter,
      item.recruiterEmail,
      item.skills,
      item.description,
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
    link.download = "college-placement-drives.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);

    notify(`${filteredPlacements.length} placement records exported.`);
  };

  const openMenuAction = (placement, action) => {
    setActiveMenu(null);

    if (action === "view") {
      setSelectedPlacement(placement);
    } else if (action === "edit") {
      openEdit(placement);
    } else if (action === "delete") {
      deletePlacement(placement);
    } else if (action === "close") {
      changeStatus(placement.id, "Closed");
    } else if (action === "complete") {
      changeStatus(placement.id, "Completed");
    } else if (action === "publish") {
      changeStatus(placement.id, "Active");
    }
  };

  return (
    <div className="min-h-full min-w-0 space-y-6 bg-[#071323] p-4 text-slate-100 sm:p-6 xl:p-7">
      {/* Page heading */}
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
            <span className="text-cyan-300">Placements</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/15 to-sky-400/[0.04] sm:flex">
              <Briefcase size={23} className="text-cyan-200" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
                  Placements & Careers
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full border border-cyan-300/15 bg-cyan-300/[0.07] px-2 py-1 text-[10px] font-semibold text-cyan-200">
                  <TrendingUp size={11} />
                  Placement hub
                </span>
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Manage hiring drives, track applications and organise opportunities
                for your students from one workspace.
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
            Add placement drive
          </button>
        </div>
      </motion.header>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Active drives"
          value={stats.active}
          caption="Currently published opportunities"
          icon={Briefcase}
          tone="bg-cyan-400/15"
        />

        <StatCard
          label="Open positions"
          value={stats.openings}
          caption="Openings across active drives"
          icon={Target}
          tone="bg-sky-400/15"
        />

        <StatCard
          label="Applications"
          value={stats.applications.toLocaleString("en-IN")}
          caption="Applications recorded in this workspace"
          icon={Users}
          tone="bg-indigo-400/15"
        />

        <StatCard
          label="Average package"
          value={formatCurrency(stats.averagePackage)}
          caption="Average listed package for active drives"
          icon={Wallet}
          tone="bg-emerald-400/15"
          progress={Math.min(
            100,
            stats.averagePackage ? (stats.averagePackage / 1500000) * 100 : 0
          )}
        />
      </section>

      {/* Feature banner */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-300/[0.13] bg-gradient-to-r from-[#103047] via-[#10253b] to-[#0b192a] p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-12 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.07] blur-3xl" />

        <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.08]">
              <Sparkles size={18} className="text-cyan-200" />
            </div>

            <div className="min-w-0">
              <h2 className="text-sm font-semibold text-white">
                Turn campus opportunities into career outcomes
              </h2>
              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300/75">
                Keep eligibility, hiring deadlines, recruiter contacts and selection
                progress organised for every placement drive.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setStatusFilter("Active");
              setTypeFilter("all");
              setDepartmentFilter("all");
              setPackageFilter("all");
              setSearch("");
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-cyan-200/15 bg-[#061525]/40 px-3.5 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.08] md:self-center"
          >
            View active drives
            <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Filters */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b] p-3 sm:p-4">
        <div className="mb-4 flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.035]">
              <SlidersHorizontal size={16} className="text-cyan-300" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Placement directory
              </h2>
              <p className="mt-0.5 text-[11px] text-slate-500">
                {filteredPlacements.length} of {placements.length} opportunities
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 rounded-xl border border-white/[0.07] bg-[#071323] p-1">
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
              placeholder="Search companies, job roles, skills or location..."
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
                { label: "Active", value: "Active" },
                { label: "Draft", value: "Draft" },
                { label: "Closed", value: "Closed" },
                { label: "Completed", value: "Completed" },
              ]}
            />

            <CustomDropdown
              value={typeFilter}
              onChange={setTypeFilter}
              icon={Briefcase}
              width="w-full sm:w-40 2xl:w-40"
              options={[
                { label: "All job types", value: "all" },
                ...EMPLOYMENT_TYPES.map((type) => ({
                  label: type,
                  value: type,
                })),
              ]}
            />

            <CustomDropdown
              value={departmentFilter}
              onChange={setDepartmentFilter}
              icon={GraduationCap}
              width="w-full sm:w-48 2xl:w-48"
              options={[
                { label: "All departments", value: "all" },
                ...DEPARTMENTS.map((department) => ({
                  label: department,
                  value: department,
                })),
              ]}
            />

            <CustomDropdown
              value={packageFilter}
              onChange={setPackageFilter}
              icon={Wallet}
              width="w-full sm:w-40 2xl:w-40"
              options={[
                { label: "Any package", value: "all" },
                { label: "Under 5 LPA", value: "under5" },
                { label: "5–10 LPA", value: "5to10" },
                { label: "Above 10 LPA", value: "above10" },
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

            {typeFilter !== "all" && (
              <button
                type="button"
                onClick={() => setTypeFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {typeFilter}
                <X size={11} />
              </button>
            )}

            {departmentFilter !== "all" && (
              <button
                type="button"
                onClick={() => setDepartmentFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {departmentFilter}
                <X size={11} />
              </button>
            )}

            {packageFilter !== "all" && (
              <button
                type="button"
                onClick={() => setPackageFilter("all")}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
              >
                {packageFilter === "under5"
                  ? "Under 5 LPA"
                  : packageFilter === "5to10"
                    ? "5–10 LPA"
                    : "Above 10 LPA"}
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

      {/* Placement cards / table */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b]">
        {filteredPlacements.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <Briefcase size={27} className="text-cyan-300" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-white">
              {hasFilters ? "No matching opportunities" : "No placement drives yet"}
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              {hasFilters
                ? "Try changing your search or filters to find relevant opportunities."
                : "Create your first placement drive to start managing opportunities."}
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
                Add placement drive
              </button>
            </div>
          </div>
        ) : view === "grid" ? (
          <div className="p-4 sm:p-5">
            <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  Hiring opportunities
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Browse and manage placement drives.
                </p>
              </div>

              <span className="w-fit rounded-lg border border-white/[0.07] bg-[#071323] px-2.5 py-1.5 text-[10px] text-slate-400">
                {filteredPlacements.length} records
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-2 2xl:grid-cols-3">
              {filteredPlacements.map((placement, index) => (
                <motion.article
                  key={placement.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.025, 0.2) }}
                  className="group relative min-w-0 overflow-visible rounded-2xl border border-white/[0.07] bg-[#091525] p-4 transition duration-200 hover:border-cyan-300/20 hover:bg-[#0b1b2e] sm:p-5"
                >
                  {placement.featured && (
                    <div className="absolute right-4 top-0 flex -translate-y-0 items-center gap-1 rounded-b-lg border-x border-b border-amber-300/15 bg-amber-300/[0.08] px-2.5 py-1 text-[9px] font-semibold text-amber-200">
                      <Sparkles size={10} />
                      FEATURED
                    </div>
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-gradient-to-br from-cyan-300/10 to-sky-400/[0.03] text-base font-bold text-cyan-100">
                        {placement.company?.slice(0, 1)?.toUpperCase() || "C"}
                      </div>

                      <div className="min-w-0 pt-0.5">
                        <p className="truncate text-xs font-semibold text-slate-100">
                          {placement.company}
                        </p>
                        <p className="mt-1 truncate text-[10px] text-slate-500">
                          {placement.id}
                        </p>
                      </div>
                    </div>

                    <div className="relative">
                      <button
                        type="button"
                        aria-label={`More actions for ${placement.company}`}
                        onClick={() =>
                          setActiveMenu((previous) =>
                            previous === placement.id ? null : placement.id
                          )
                        }
                        className={cx(
                          "flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-500 transition hover:border-white/10 hover:bg-white/[0.05] hover:text-white",
                          activeMenu === placement.id && "border-white/10 bg-white/[0.05] text-white"
                        )}
                      >
                        <MoreHorizontal size={17} />
                      </button>

                      <AnimatePresence>
                        {activeMenu === placement.id && (
                          <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            className="absolute right-0 top-9 z-[90] w-48 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_18px_50px_rgba(0,0,0,0.45)]"
                          >
                            <button
                              type="button"
                              onClick={() => openMenuAction(placement, "view")}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                            >
                              <Eye size={14} />
                              View details
                            </button>

                            <button
                              type="button"
                              onClick={() => openMenuAction(placement, "edit")}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 transition hover:bg-white/[0.05] hover:text-white"
                            >
                              <Pencil size={14} />
                              Edit opportunity
                            </button>

                            {placement.status === "Draft" && (
                              <button
                                type="button"
                                onClick={() => openMenuAction(placement, "publish")}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-cyan-200 transition hover:bg-cyan-400/[0.07]"
                              >
                                <Send size={14} />
                                Publish drive
                              </button>
                            )}

                            {placement.status === "Active" && (
                              <>
                                <button
                                  type="button"
                                  onClick={() => openMenuAction(placement, "complete")}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-emerald-200 transition hover:bg-emerald-400/[0.07]"
                                >
                                  <BadgeCheck size={14} />
                                  Mark completed
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openMenuAction(placement, "close")}
                                  className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-rose-200 transition hover:bg-rose-400/[0.07]"
                                >
                                  <CircleX size={14} />
                                  Close drive
                                </button>
                              </>
                            )}

                            <div className="my-1 border-t border-white/[0.07]" />

                            <button
                              type="button"
                              onClick={() => openMenuAction(placement, "delete")}
                              className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs text-rose-300 transition hover:bg-rose-400/[0.07]"
                            >
                              <Trash2 size={14} />
                              Delete opportunity
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <div className="mt-4">
                    <div className="mb-2 flex flex-wrap items-center gap-2">
                      <StatusBadge status={placement.status} />
                      <span className="rounded-full border border-white/[0.07] bg-white/[0.025] px-2.5 py-1 text-[10px] text-slate-400">
                        {placement.type}
                      </span>
                    </div>

                    <h3 className="line-clamp-2 min-h-[42px] text-base font-semibold leading-6 text-white transition group-hover:text-cyan-100">
                      {placement.role}
                    </h3>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-slate-400">
                      <span className="inline-flex items-center gap-1.5">
                        <MapPin size={12} className="text-slate-500" />
                        {placement.location || "Location flexible"}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <GraduationCap size={12} className="text-slate-500" />
                        {placement.department}
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-cyan-300/[0.09] bg-cyan-300/[0.035] p-3.5">
                    <p className="text-[10px] text-slate-500">Annual package</p>
                    <div className="mt-1 flex items-baseline justify-between gap-2">
                      <span className="text-xl font-semibold tracking-tight text-white">
                        {formatCurrency(placement.package)}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        {placement.openings} openings
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.06] bg-[#071323]/70 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <Users size={12} />
                        Applications
                      </div>
                      <p className="mt-2 text-base font-semibold text-slate-100">
                        {Number(placement.applications || 0).toLocaleString("en-IN")}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/[0.06] bg-[#071323]/70 p-3">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                        <BadgeCheck size={12} />
                        Selected
                      </div>
                      <p className="mt-2 text-base font-semibold text-slate-100">
                        {placement.selected}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3 border-t border-white/[0.06] pt-4">
                    <div className="min-w-0">
                      <p className="text-[10px] text-slate-500">
                        Application deadline
                      </p>
                      <p className="mt-1 flex items-center gap-1.5 text-xs font-medium text-slate-300">
                        <CalendarDays size={12} className="text-cyan-300" />
                        {formatDate(placement.deadline)}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedPlacement(placement)}
                      className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-white/[0.08] bg-white/[0.025] px-3 py-2.5 text-[11px] font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:bg-cyan-300/[0.06] hover:text-cyan-200"
                    >
                      Details
                      <ArrowUpRight size={13} />
                    </button>
                  </div>
                </motion.article>
              ))}
            </div>

            <div className="mt-4 flex flex-col gap-2 border-t border-white/[0.06] pt-4 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between">
              <span>
                Showing{" "}
                <strong className="font-semibold text-slate-300">
                  {filteredPlacements.length}
                </strong>{" "}
                opportunities
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Changes save automatically in this browser
              </span>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col justify-between gap-2 border-b border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
              <div>
                <h2 className="text-sm font-semibold text-white">
                  All placement opportunities
                </h2>
                <p className="mt-1 text-[11px] text-slate-500">
                  Select a row to view complete drive details.
                </p>
              </div>

              <span className="w-fit rounded-lg border border-white/[0.07] bg-[#071323] px-2.5 py-1.5 text-[10px] text-slate-400">
                {filteredPlacements.length} records
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] bg-[#091525]/80">
                    {[
                      "Company & role",
                      "Package",
                      "Openings",
                      "Applications",
                      "Deadline",
                      "Type",
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
                  {filteredPlacements.map((placement, index) => (
                    <motion.tr
                      key={placement.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: Math.min(index * 0.025, 0.2) }}
                      className="group border-b border-white/[0.045] transition-colors last:border-0 hover:bg-white/[0.025]"
                    >
                      <td className="max-w-[320px] px-4 py-4 pl-5">
                        <button
                          type="button"
                          onClick={() => setSelectedPlacement(placement)}
                          className="flex min-w-0 items-center gap-2.5 text-left"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-cyan-300/[0.06] text-xs font-bold text-cyan-100">
                            {placement.company?.slice(0, 1)?.toUpperCase() || "C"}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-semibold text-slate-100 transition group-hover:text-cyan-200">
                              {placement.role}
                            </p>
                            <p className="mt-1 truncate text-[10px] text-slate-500">
                              {placement.company} · {placement.id}
                            </p>
                          </div>
                        </button>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4">
                        <span className="text-xs font-semibold text-white">
                          {formatCurrency(placement.package)}
                        </span>
                      </td>

                      <td className="px-4 py-4 text-xs text-slate-300">
                        {placement.openings}
                      </td>

                      <td className="px-4 py-4">
                        <div className="text-xs font-medium text-slate-200">
                          {placement.applications}
                        </div>
                        <div className="mt-1 text-[10px] text-slate-500">
                          {placement.selected} selected
                        </div>
                      </td>

                      <td className="whitespace-nowrap px-4 py-4 text-xs text-slate-300">
                        {formatDate(placement.deadline)}
                      </td>

                      <td className="px-4 py-4">
                        <span className="text-[11px] text-slate-400">
                          {placement.type}
                        </span>
                      </td>

                      <td className="px-4 py-4">
                        <StatusBadge status={placement.status} />
                      </td>

                      <td className="px-4 py-4 pr-5">
                        <div className="relative flex justify-end">
                          <button
                            type="button"
                            aria-label={`More actions for ${placement.company}`}
                            onClick={() =>
                              setActiveMenu((previous) =>
                                previous === placement.id ? null : placement.id
                              )
                            }
                            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.05] hover:text-white"
                          >
                            <MoreHorizontal size={17} />
                          </button>

                          <AnimatePresence>
                            {activeMenu === placement.id && (
                              <motion.div
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="absolute right-0 top-9 z-[90] w-48 rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-xl"
                              >
                                <button
                                  type="button"
                                  onClick={() => openMenuAction(placement, "view")}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-white/[0.05]"
                                >
                                  <Eye size={14} /> View details
                                </button>

                                <button
                                  type="button"
                                  onClick={() => openMenuAction(placement, "edit")}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-slate-300 hover:bg-white/[0.05]"
                                >
                                  <Pencil size={14} /> Edit
                                </button>

                                {placement.status === "Draft" && (
                                  <button
                                    type="button"
                                    onClick={() => openMenuAction(placement, "publish")}
                                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-cyan-200 hover:bg-cyan-400/[0.07]"
                                  >
                                    <Send size={14} /> Publish
                                  </button>
                                )}

                                {placement.status === "Active" && (
                                  <>
                                    <button
                                      type="button"
                                      onClick={() => openMenuAction(placement, "complete")}
                                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-emerald-200 hover:bg-emerald-400/[0.07]"
                                    >
                                      <BadgeCheck size={14} /> Mark completed
                                    </button>

                                    <button
                                      type="button"
                                      onClick={() => openMenuAction(placement, "close")}
                                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-rose-200 hover:bg-rose-400/[0.07]"
                                    >
                                      <CircleX size={14} /> Close drive
                                    </button>
                                  </>
                                )}

                                <div className="my-1 border-t border-white/[0.07]" />

                                <button
                                  type="button"
                                  onClick={() => openMenuAction(placement, "delete")}
                                  className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-xs text-rose-300 hover:bg-rose-400/[0.07]"
                                >
                                  <Trash2 size={14} /> Delete
                                </button>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-col gap-2 border-t border-white/[0.06] px-4 py-3.5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <span>Showing {filteredPlacements.length} opportunities</span>
              <span className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                Changes save automatically in this browser
              </span>
            </div>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="flex flex-col gap-2 pb-2 text-[10px] leading-5 text-slate-500 sm:flex-row sm:items-center sm:justify-between">
        <p>Placements & Careers · College Portal</p>
        <p className="inline-flex items-center gap-1.5">
          <CheckCircle2 size={12} className="text-cyan-300" />
          Placement workspace
        </p>
      </footer>

      {/* Create / edit dialog */}
      {formOpen && (
        <PlacementFormModal
          key={formPlacement?.id || "new-placement"}
          placement={formPlacement}
          onClose={closeForm}
          onSave={savePlacement}
        />
      )}

      {/* Details dialog */}
      {selectedPlacement && (
        <PlacementDetailsModal
          placement={
            placements.find((item) => item.id === selectedPlacement.id) ||
            selectedPlacement
          }
          onClose={() => setSelectedPlacement(null)}
          onEdit={openEdit}
          onStatusChange={changeStatus}
          onCopyEmail={copyEmail}
        />
      )}

      {/* Toast */}
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