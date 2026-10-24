
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDown,
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Eye,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Users,
  X,
  Target,
  TrendingUp,
  UserRound,
  ClipboardCheck,
  FileText,
} from "lucide-react";

/* ======================================================
   SAMPLE STUDENT DATA
   Replace these records with your college API later.
====================================================== */

const studentsData = [
  {
    id: "TM2026001",
    name: "Rohan Sharma",
    email: "rohan.sharma@example.edu",
    phone: "+91 98765 10001",
    department: "Computer Science",
    course: "Full Stack Development",
    semester: "Semester 6",
    year: "Final Year",
    status: "Active",
    attendance: 92,
    progress: 86,
    completedCourses: 5,
    totalCourses: 6,
    assignments: 18,
    submittedAssignments: 17,
    enrolledOn: "12 Jan 2026",
    lastActive: "Today",
    mentor: "Aarav Mehta",
    city: "Jodhpur",
    skills: ["React", "JavaScript", "Node.js"],
  },
  {
    id: "TM2026002",
    name: "Priya Verma",
    email: "priya.verma@example.edu",
    phone: "+91 98765 10002",
    department: "Data Science",
    course: "Python for Data Science",
    semester: "Semester 5",
    year: "Third Year",
    status: "Active",
    attendance: 96,
    progress: 91,
    completedCourses: 6,
    totalCourses: 7,
    assignments: 20,
    submittedAssignments: 20,
    enrolledOn: "15 Jan 2026",
    lastActive: "Today",
    mentor: "Neha Sharma",
    city: "Jaipur",
    skills: ["Python", "Pandas", "SQL"],
  },
  {
    id: "TM2026003",
    name: "Aman Gupta",
    email: "aman.gupta@example.edu",
    phone: "+91 98765 10003",
    department: "Information Tech",
    course: "Cloud & DevOps",
    semester: "Semester 6",
    year: "Final Year",
    status: "At Risk",
    attendance: 61,
    progress: 48,
    completedCourses: 2,
    totalCourses: 6,
    assignments: 15,
    submittedAssignments: 8,
    enrolledOn: "18 Jan 2026",
    lastActive: "5 days ago",
    mentor: "Rahul Singh",
    city: "Ajmer",
    skills: ["Linux", "Git", "Docker"],
  },
  {
    id: "TM2026004",
    name: "Sneha Patel",
    email: "sneha.patel@example.edu",
    phone: "+91 98765 10004",
    department: "Computer Science",
    course: "Machine Learning",
    semester: "Semester 4",
    year: "Second Year",
    status: "Active",
    attendance: 89,
    progress: 79,
    completedCourses: 4,
    totalCourses: 5,
    assignments: 16,
    submittedAssignments: 15,
    enrolledOn: "20 Jan 2026",
    lastActive: "Yesterday",
    mentor: "Aarav Mehta",
    city: "Udaipur",
    skills: ["Python", "NumPy", "ML"],
  },
  {
    id: "TM2026005",
    name: "Vikram Singh",
    email: "vikram.singh@example.edu",
    phone: "+91 98765 10005",
    department: "Electronics",
    course: "Cloud & DevOps",
    semester: "Semester 3",
    year: "Second Year",
    status: "Inactive",
    attendance: 54,
    progress: 32,
    completedCourses: 1,
    totalCourses: 5,
    assignments: 12,
    submittedAssignments: 5,
    enrolledOn: "22 Jan 2026",
    lastActive: "12 days ago",
    mentor: "Rahul Singh",
    city: "Kota",
    skills: ["Networking", "Linux", "Git"],
  },
  {
    id: "TM2026006",
    name: "Ananya Joshi",
    email: "ananya.joshi@example.edu",
    phone: "+91 98765 10006",
    department: "Data Science",
    course: "Python for Data Science",
    semester: "Semester 6",
    year: "Final Year",
    status: "Completed",
    attendance: 98,
    progress: 100,
    completedCourses: 7,
    totalCourses: 7,
    assignments: 22,
    submittedAssignments: 22,
    enrolledOn: "25 Jan 2026",
    lastActive: "2 days ago",
    mentor: "Neha Sharma",
    city: "Jodhpur",
    skills: ["Python", "SQL", "Machine Learning"],
  },
  {
    id: "TM2026007",
    name: "Karan Mehta",
    email: "karan.mehta@example.edu",
    phone: "+91 98765 10007",
    department: "Information Tech",
    course: "Full Stack Development",
    semester: "Semester 5",
    year: "Third Year",
    status: "Active",
    attendance: 84,
    progress: 73,
    completedCourses: 4,
    totalCourses: 6,
    assignments: 18,
    submittedAssignments: 14,
    enrolledOn: "28 Jan 2026",
    lastActive: "Today",
    mentor: "Aarav Mehta",
    city: "Jaipur",
    skills: ["HTML", "CSS", "React"],
  },
  {
    id: "TM2026008",
    name: "Isha Agarwal",
    email: "isha.agarwal@example.edu",
    phone: "+91 98765 10008",
    department: "Computer Science",
    course: "Machine Learning",
    semester: "Semester 4",
    year: "Second Year",
    status: "At Risk",
    attendance: 68,
    progress: 57,
    completedCourses: 2,
    totalCourses: 5,
    assignments: 14,
    submittedAssignments: 9,
    enrolledOn: "02 Feb 2026",
    lastActive: "4 days ago",
    mentor: "Neha Sharma",
    city: "Bikaner",
    skills: ["Python", "Statistics", "NumPy"],
  },
  {
    id: "TM2026009",
    name: "Mohit Yadav",
    email: "mohit.yadav@example.edu",
    phone: "+91 98765 10009",
    department: "Electronics",
    course: "Cloud & DevOps",
    semester: "Semester 3",
    year: "Second Year",
    status: "Active",
    attendance: 87,
    progress: 72,
    completedCourses: 3,
    totalCourses: 5,
    assignments: 13,
    submittedAssignments: 12,
    enrolledOn: "05 Feb 2026",
    lastActive: "Yesterday",
    mentor: "Rahul Singh",
    city: "Jodhpur",
    skills: ["Linux", "Networking", "Docker"],
  },
  {
    id: "TM2026010",
    name: "Meera Rathore",
    email: "meera.rathore@example.edu",
    phone: "+91 98765 10010",
    department: "Data Science",
    course: "Python for Data Science",
    semester: "Semester 5",
    year: "Third Year",
    status: "Active",
    attendance: 94,
    progress: 88,
    completedCourses: 6,
    totalCourses: 7,
    assignments: 20,
    submittedAssignments: 19,
    enrolledOn: "08 Feb 2026",
    lastActive: "Today",
    mentor: "Neha Sharma",
    city: "Jaipur",
    skills: ["Python", "Pandas", "SQL"],
  },
  {
    id: "TM2026011",
    name: "Arjun Rathore",
    email: "arjun.rathore@example.edu",
    phone: "+91 98765 10011",
    department: "Information Tech",
    course: "Full Stack Development",
    semester: "Semester 6",
    year: "Final Year",
    status: "Active",
    attendance: 90,
    progress: 83,
    completedCourses: 5,
    totalCourses: 6,
    assignments: 18,
    submittedAssignments: 16,
    enrolledOn: "10 Feb 2026",
    lastActive: "Today",
    mentor: "Aarav Mehta",
    city: "Ajmer",
    skills: ["React", "TypeScript", "Node.js"],
  },
  {
    id: "TM2026012",
    name: "Kavya Jain",
    email: "kavya.jain@example.edu",
    phone: "+91 98765 10012",
    department: "Computer Science",
    course: "Full Stack Development",
    semester: "Semester 5",
    year: "Third Year",
    status: "Completed",
    attendance: 97,
    progress: 100,
    completedCourses: 6,
    totalCourses: 6,
    assignments: 20,
    submittedAssignments: 20,
    enrolledOn: "12 Feb 2026",
    lastActive: "Yesterday",
    mentor: "Aarav Mehta",
    city: "Udaipur",
    skills: ["React", "JavaScript", "APIs"],
  },
];

const departmentOptions = [
  "All Departments",
  "Computer Science",
  "Information Tech",
  "Data Science",
  "Electronics",
];

const courseOptions = [
  "All Courses",
  ...new Set(studentsData.map((student) => student.course)),
];

const statusOptions = [
  "All Statuses",
  "Active",
  "At Risk",
  "Inactive",
  "Completed",
];

const sortOptions = [
  "Name A–Z",
  "Highest Progress",
  "Lowest Attendance",
  "Recently Active",
];

const panelClass =
  "rounded-2xl border border-white/[0.09] bg-[#101d32]/80 shadow-[0_18px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl";

/* ======================================================
   HELPERS
====================================================== */

function getInitials(name) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function getStatusClass(status) {
  const styles = {
    Active:
      "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    "At Risk":
      "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
    Inactive:
      "border-rose-400/20 bg-rose-400/[0.08] text-rose-300",
    Completed:
      "border-cyan-400/20 bg-cyan-400/[0.08] text-cyan-200",
  };

  return styles[status] || "border-white/10 bg-white/5 text-slate-300";
}

function getProgressColor(value) {
  if (value >= 80) return "from-cyan-300 to-blue-400";
  if (value >= 60) return "from-amber-300 to-orange-400";
  return "from-rose-400 to-orange-400";
}

/* ======================================================
   PREMIUM CUSTOM DROPDOWN
====================================================== */

function PremiumDropdown({
  value,
  options,
  onChange,
  label,
  icon: Icon = ChevronDown,
  menuWidth = "w-full",
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, options.indexOf(value))
  );

  useEffect(() => {
    if (open) {
      setActiveIndex(Math.max(0, options.indexOf(value)));
    }
  }, [open, value, options]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  function selectOption(option) {
    onChange(option);
    setOpen(false);
  }

  function handleKeyDown(event) {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((current) =>
          Math.min(current + 1, options.length - 1)
        );
      }

      return;
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((current) => Math.max(current - 1, 0));
      }

      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
      } else {
        selectOption(options[activeIndex]);
      }
    }
  }

  return (
    <div ref={rootRef} className="relative w-full">
      <motion.button
        type="button"
        whileTap={{ scale: 0.985 }}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`group flex min-h-[44px] w-full items-center gap-2.5 rounded-xl border px-3 py-2.5 text-left outline-none transition-all duration-200 ${open
          ? "border-cyan-300/50 bg-[#13243a] shadow-[0_0_0_3px_rgba(103,232,249,0.07)]"
          : "border-white/[0.10] bg-[#0e192b]/90 hover:border-cyan-300/30 hover:bg-[#132238]"
          }`}
      >
        <span
          className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition-colors ${open
            ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
            : "border-white/[0.07] bg-white/[0.04] text-slate-400 group-hover:text-cyan-200"
            }`}
        >
          <Icon size={14} />
        </span>

        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-200">
          {value}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="flex shrink-0 text-slate-400 group-hover:text-cyan-200"
        >
          <ChevronDown size={15} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            role="listbox"
            aria-label={label}
            className={`absolute left-0 top-[calc(100%+8px)] z-[100] ${menuWidth} min-w-[200px] overflow-hidden rounded-2xl border border-cyan-300/15 bg-[#0b1424] p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.55)]`}
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-500">
                {label}
              </span>

              <span className="rounded-md border border-cyan-300/10 bg-cyan-300/[0.06] px-1.5 py-0.5 text-[9px] font-semibold text-cyan-200">
                {options.length}
              </span>
            </div>

            <div className="student-dropdown-scroll max-h-64 overflow-y-auto py-1">
              {options.map((option, index) => {
                const selected = option === value;
                const highlighted = index === activeIndex;

                return (
                  <motion.button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.15,
                      delay: Math.min(index * 0.015, 0.1),
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => selectOption(option)}
                    className={`relative flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors ${selected
                      ? "bg-cyan-300/[0.10] text-cyan-100"
                      : highlighted
                        ? "bg-white/[0.055] text-white"
                        : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                      }`}
                  >
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[10px] font-bold ${selected
                        ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                        : "border-white/[0.07] bg-white/[0.035] text-slate-500"
                        }`}
                    >
                      {selected ? (
                        <Check size={13} strokeWidth={2.5} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-xs font-medium">
                      {option}
                    </span>

                    {selected && (
                      <span className="h-4 w-0.5 rounded-full bg-cyan-300" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="border-t border-white/[0.06] px-3 py-2">
              <p className="text-[9px] text-slate-600">
                ↑ ↓ Navigate · Enter Select · Esc Close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ======================================================
   STAT CARD
====================================================== */

function StatCard({ title, value, subtitle, icon: Icon, color, delay }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -4 }}
      className={`${panelClass} relative overflow-hidden p-4 sm:p-5`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full opacity-[0.08] blur-2xl ${color}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-medium text-slate-400">{title}</p>

          <motion.p
            key={value}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl"
          >
            {value}
          </motion.p>

          <p className="mt-2 text-[10px] leading-5 text-slate-500">
            {subtitle}
          </p>
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.035] ${color}`}
        >
          <Icon size={19} />
        </span>
      </div>
    </motion.article>
  );
}

/* ======================================================
   PROGRESS BAR
====================================================== */

function ProgressBar({ value, compact = false }) {
  return (
    <div className="min-w-[90px]">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <span className="text-[11px] font-semibold tabular-nums text-slate-200">
          {value}%
        </span>

        {!compact && (
          <span className="text-[9px] text-slate-500">Complete</span>
        )}
      </div>

      <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(value)}`}
        />
      </div>
    </div>
  );
}

/* ======================================================
   STUDENT DETAILS MODAL
====================================================== */

function StudentDetailsModal({ student, onClose }) {
  useEffect(() => {
    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  if (!student) return null;

  const detailItems = [
    { label: "Student ID", value: student.id },
    { label: "Department", value: student.department },
    { label: "Program", value: student.course },
    { label: "Academic year", value: student.year },
    { label: "Semester", value: student.semester },
    { label: "Enrollment date", value: student.enrolledOn },
    { label: "Assigned mentor", value: student.mentor },
    { label: "City", value: student.city },
    { label: "Last active", value: student.lastActive },
  ];

  return (
    <AnimatePresence>
      <motion.div
        key="student-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#030914]/80 p-3 backdrop-blur-md sm:p-6"
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.section
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: 0.22 }}
          role="dialog"
          aria-modal="true"
          aria-label={`${student.name} details`}
          className="my-auto max-h-[92vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-cyan-300/15 bg-[#0d182a] shadow-[0_30px_100px_rgba(0,0,0,0.6)]"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/[0.08] bg-[#0d182a]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                Student profile
              </p>

              <p className="mt-1 text-sm font-semibold text-white">
                Academic and learning details
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close student details"
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-400 transition hover:border-cyan-300/30 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>

          <div className="space-y-6 p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 to-blue-400/10 text-xl font-bold text-cyan-100">
                {getInitials(student.name)}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-white">
                    {student.name}
                  </h2>

                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${getStatusClass(student.status)}`}
                  >
                    {student.status}
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">{student.id}</p>

                <p className="mt-1 text-xs text-slate-400">
                  {student.course}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Attendance
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {student.attendance}%
                </p>

                <div className="mt-3">
                  <ProgressBar value={student.attendance} compact />
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                  Learning progress
                </p>

                <p className="mt-2 text-2xl font-bold text-white">
                  {student.progress}%
                </p>

                <div className="mt-3">
                  <ProgressBar value={student.progress} compact />
                </div>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <BookOpen size={15} className="text-cyan-300" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Courses completed
                  </span>
                </div>

                <p className="mt-3 text-xl font-bold text-white">
                  {student.completedCourses}
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    / {student.totalCourses}
                  </span>
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.025] p-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <ClipboardCheck size={15} className="text-cyan-300" />
                  <span className="text-[10px] font-bold uppercase tracking-wider">
                    Assignments submitted
                  </span>
                </div>

                <p className="mt-3 text-xl font-bold text-white">
                  {student.submittedAssignments}
                  <span className="ml-1 text-xs font-normal text-slate-500">
                    / {student.assignments}
                  </span>
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
                Student contact
              </h3>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <a
                  href={`mailto:${student.email}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition hover:border-cyan-300/20"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-300/[0.08] text-cyan-200">
                    <Mail size={16} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">Email address</p>
                    <p className="mt-1 truncate text-xs font-medium text-slate-200">
                      {student.email}
                    </p>
                  </div>
                </a>

                <a
                  href={`tel:${student.phone.replace(/\s/g, "")}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-white/[0.025] p-3.5 transition hover:border-cyan-300/20"
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-300/[0.08] text-blue-200">
                    <Phone size={16} />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">Phone number</p>
                    <p className="mt-1 truncate text-xs font-medium text-slate-200">
                      {student.phone}
                    </p>
                  </div>
                </a>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
                Academic information
              </h3>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {detailItems.map((item) => (
                  <div
                    key={item.label}
                    className="min-w-0 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5"
                  >
                    <p className="text-[10px] text-slate-500">{item.label}</p>

                    <p className="mt-1.5 break-words text-xs font-semibold leading-5 text-slate-200">
                      {item.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
                Skills and topics
              </h3>

              <div className="flex flex-wrap gap-2">
                {student.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-lg border border-cyan-300/10 bg-cyan-300/[0.06] px-3 py-1.5 text-[11px] font-medium text-cyan-100"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-end border-t border-white/[0.07] px-5 py-4 sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 bg-white/[0.04] px-4 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:text-white"
            >
              Close details
            </button>
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>
  );
}

/* ======================================================
   MAIN PAGE
====================================================== */

export default function CollegeStudentsPage() {
  const [students] = useState(studentsData);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [course, setCourse] = useState("All Courses");
  const [status, setStatus] = useState("All Statuses");
  const [sortBy, setSortBy] = useState("Name A–Z");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshed, setRefreshed] = useState(false);

  const pageSize = 6;

  const filteredStudents = useMemo(() => {
    let result = students.filter((student) => {
      const query = search.trim().toLowerCase();

      const matchesSearch =
        !query ||
        [
          student.name,
          student.id,
          student.email,
          student.phone,
          student.course,
          student.department,
          student.mentor,
        ].some((value) => value.toLowerCase().includes(query));

      const matchesDepartment =
        department === "All Departments" ||
        student.department === department;

      const matchesCourse =
        course === "All Courses" || student.course === course;

      const matchesStatus =
        status === "All Statuses" || student.status === status;

      return (
        matchesSearch &&
        matchesDepartment &&
        matchesCourse &&
        matchesStatus
      );
    });

    result = [...result];

    if (sortBy === "Name A–Z") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "Highest Progress") {
      result.sort((a, b) => b.progress - a.progress);
    } else if (sortBy === "Lowest Attendance") {
      result.sort((a, b) => a.attendance - b.attendance);
    } else if (sortBy === "Recently Active") {
      const activityOrder = {
        Today: 0,
        Yesterday: 1,
        "2 days ago": 2,
        "4 days ago": 4,
        "5 days ago": 5,
        "12 days ago": 12,
      };

      result.sort(
        (a, b) =>
          (activityOrder[a.lastActive] ?? 99) -
          (activityOrder[b.lastActive] ?? 99)
      );
    }

    return result;
  }, [students, search, department, course, status, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedStudents = filteredStudents.slice(
    (safePage - 1) * pageSize,
    safePage * pageSize
  );

  const totalStudents = filteredStudents.length;

  const activeStudents = filteredStudents.filter(
    (student) => student.status === "Active"
  ).length;

  const atRiskStudents = filteredStudents.filter(
    (student) =>
      student.status === "At Risk" || student.status === "Inactive"
  ).length;

  const averageAttendance = totalStudents
    ? Math.round(
      filteredStudents.reduce(
        (sum, student) => sum + student.attendance,
        0
      ) / totalStudents
    )
    : 0;

  const averageProgress = totalStudents
    ? Math.round(
      filteredStudents.reduce(
        (sum, student) => sum + student.progress,
        0
      ) / totalStudents
    )
    : 0;

  useEffect(() => {
    setCurrentPage(1);
  }, [search, department, course, status, sortBy]);

  const resetFilters = () => {
    setSearch("");
    setDepartment("All Departments");
    setCourse("All Courses");
    setStatus("All Statuses");
    setSortBy("Name A–Z");
  };

  const handleRefresh = () => {
    setRefreshed(true);
    window.setTimeout(() => setRefreshed(false), 1200);
  };

  const handleExport = () => {
    const rows = [
      [
        "Student ID",
        "Name",
        "Email",
        "Phone",
        "Department",
        "Course",
        "Academic Year",
        "Semester",
        "Status",
        "Attendance",
        "Progress",
        "Completed Courses",
        "Total Courses",
        "Assignments Submitted",
        "Total Assignments",
        "Mentor",
        "City",
        "Last Active",
      ],
      ...filteredStudents.map((student) => [
        student.id,
        student.name,
        student.email,
        student.phone,
        student.department,
        student.course,
        student.year,
        student.semester,
        student.status,
        `${student.attendance}%`,
        `${student.progress}%`,
        student.completedCourses,
        student.totalCourses,
        student.submittedAssignments,
        student.assignments,
        student.mentor,
        student.city,
        student.lastActive,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "college-students.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  const closeStudentDetails = () => setSelectedStudent(null);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="college-students-page min-h-full w-full min-w-0 overflow-x-hidden text-slate-100"
    >
      <style>{`
        .college-students-page {
          color-scheme: dark;
          background:
            radial-gradient(ellipse at 8% 0%, rgba(34,211,238,.06), transparent 32%),
            radial-gradient(ellipse at 95% 10%, rgba(96,165,250,.055), transparent 30%),
            #0b1424;
        }

        .college-students-page *,
        .college-students-page *::before,
        .college-students-page *::after {
          box-sizing: border-box;
        }

        .college-students-page .student-dropdown-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(103,232,249,.3) transparent;
        }

        .college-students-page .student-dropdown-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .college-students-page .student-dropdown-scroll::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: rgba(103,232,249,.28);
        }

        .college-students-page .student-table-scroll {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }

        .college-students-page .student-table-scroll::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .college-students-page .student-table-scroll::-webkit-scrollbar-thumb {
          border-radius: 10px;
          background: #334155;
        }

        .college-students-page .student-search::placeholder {
          color: #64748b;
        }

        .college-students-page .student-search:focus {
          border-color: rgba(103,232,249,.45);
          box-shadow: 0 0 0 3px rgba(103,232,249,.06);
        }

        @media (prefers-reduced-motion: reduce) {
          .college-students-page *,
          .college-students-page *::before,
          .college-students-page *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1600px] space-y-6 p-4 sm:p-6 xl:p-8">
        {/* SEARCH AND ACTIONS — NO PAGE TITLE */}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`${panelClass} relative z-20 p-4 sm:p-5`}
        >
          <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by student, ID, email, course or mentor..."
                aria-label="Search students"
                className="student-search min-h-[46px] w-full rounded-xl border border-white/[0.09] bg-[#0b1424]/75 py-3 pl-11 pr-10 text-xs text-slate-100 outline-none transition-all placeholder:text-slate-500"
              />

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-500 transition hover:bg-white/[0.06] hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <div className="flex shrink-0 flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={handleRefresh}
                className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.05] active:scale-[0.98]"
              >
                <motion.span
                  animate={refreshed ? { rotate: 360 } : { rotate: 0 }}
                  transition={{ duration: 0.5 }}
                  className="flex"
                >
                  <RefreshCw size={14} />
                </motion.span>

                {refreshed ? "Updated" : "Refresh"}
              </button>

              <button
                type="button"
                onClick={handleExport}
                className="inline-flex min-h-[43px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-blue-300 px-3.5 text-xs font-bold text-[#071522] transition hover:brightness-110 active:scale-[0.98]"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />

            College student directory

            <span className="text-slate-700">·</span>

            <span>{totalStudents} matching students</span>
          </div>
        </motion.section>

        {/* SUMMARY CARDS */}

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          <StatCard
            title="Total Students"
            value={totalStudents}
            subtitle="Students matching current filters"
            icon={Users}
            color="text-cyan-300"
            delay={0.04}
          />

          <StatCard
            title="Active Students"
            value={activeStudents}
            subtitle="Currently active learners"
            icon={Activity}
            color="text-emerald-300"
            delay={0.1}
          />

          <StatCard
            title="Average Attendance"
            value={`${averageAttendance}%`}
            subtitle="Across matching students"
            icon={CalendarDays}
            color="text-blue-300"
            delay={0.16}
          />

          <StatCard
            title="Students Needing Attention"
            value={atRiskStudents}
            subtitle="At-risk or inactive learners"
            icon={Target}
            color="text-amber-300"
            delay={0.22}
          />
        </section>

        {/* FILTERS */}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className={`${panelClass} relative z-10 p-4 sm:p-5`}
        >
          <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] text-cyan-200">
                <SlidersHorizontal size={15} />
              </span>

              <div>
                <p className="text-xs font-bold text-white">
                  Student filters
                </p>

                <p className="mt-0.5 text-[10px] text-slate-500">
                  Narrow the list to your academic requirements
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 self-start text-[11px] font-semibold text-cyan-300 transition hover:text-cyan-100 sm:self-auto"
            >
              <RefreshCw size={12} />
              Reset filters
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <PremiumDropdown
              value={department}
              options={departmentOptions}
              onChange={setDepartment}
              icon={GraduationCap}
              label="Department"
              menuWidth="min-w-[230px]"
            />

            <PremiumDropdown
              value={course}
              options={courseOptions}
              onChange={setCourse}
              icon={BookOpen}
              label="Course / Program"
              menuWidth="min-w-[250px]"
            />

            <PremiumDropdown
              value={status}
              options={statusOptions}
              onChange={setStatus}
              icon={CheckCircle2}
              label="Student status"
              menuWidth="min-w-[210px]"
            />

            <PremiumDropdown
              value={sortBy}
              options={sortOptions}
              onChange={setSortBy}
              icon={ArrowDown}
              label="Sort students"
              menuWidth="min-w-[225px]"
            />
          </div>
        </motion.section>

        {/* LIST HEADER */}

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center"
        >
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white">
                Student directory
              </h2>

              <span className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] px-2 py-1 text-[10px] font-bold text-cyan-200">
                {totalStudents}
              </span>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Academic progress, attendance and course enrollment
            </p>
          </div>

          <span className="inline-flex items-center gap-2 self-start rounded-lg border border-white/[0.07] bg-white/[0.025] px-3 py-2 text-[10px] text-slate-400 sm:self-auto">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Student records
          </span>
        </motion.div>

        {/* STUDENT TABLE */}

        <section className={`${panelClass} relative z-0 overflow-hidden`}>
          <div className="student-table-scroll overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left">
              <thead>
                <tr className="border-b border-white/[0.08] bg-white/[0.02]">
                  <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Student
                  </th>

                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Course & department
                  </th>

                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Attendance
                  </th>

                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Learning progress
                  </th>

                  <th className="px-4 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Status
                  </th>

                  <th className="px-4 py-4 text-right text-[10px] font-bold uppercase tracking-[0.12em] text-slate-500">
                    Details
                  </th>
                </tr>
              </thead>

              <tbody>
                <AnimatePresence mode="popLayout">
                  {paginatedStudents.map((student, index) => (
                    <motion.tr
                      layout
                      key={student.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{
                        duration: 0.22,
                        delay: index * 0.035,
                      }}
                      className="border-b border-white/[0.05] transition-colors last:border-0 hover:bg-cyan-300/[0.025]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/15 to-blue-400/[0.06] text-xs font-bold text-cyan-100">
                            {getInitials(student.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="max-w-[190px] truncate text-xs font-semibold text-slate-100">
                              {student.name}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-500">
                              {student.id}
                            </p>

                            <p className="mt-1 max-w-[190px] truncate text-[10px] text-slate-400">
                              {student.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <p className="max-w-[225px] truncate text-xs font-semibold text-slate-200">
                          {student.course}
                        </p>

                        <p className="mt-1.5 text-[10px] text-slate-400">
                          {student.department}
                        </p>

                        <p className="mt-1 text-[10px] text-slate-500">
                          {student.year} · {student.semester}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="w-[110px]">
                          <div className="mb-1.5 flex items-center justify-between gap-2">
                            <span
                              className={`text-xs font-bold ${student.attendance < 75
                                ? "text-amber-300"
                                : "text-slate-200"
                                }`}
                            >
                              {student.attendance}%
                            </span>

                            {student.attendance < 75 && (
                              <ArrowDownRight
                                size={13}
                                className="text-amber-300"
                              />
                            )}
                          </div>

                          <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${student.attendance}%`,
                              }}
                              transition={{
                                duration: 0.7,
                                delay: index * 0.035,
                              }}
                              className={`h-full rounded-full ${student.attendance < 75
                                ? "bg-gradient-to-r from-amber-300 to-orange-400"
                                : "bg-gradient-to-r from-cyan-300 to-blue-400"
                                }`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <div className="w-[115px]">
                          <ProgressBar
                            value={student.progress}
                            compact
                          />

                          <p className="mt-2 text-[10px] text-slate-500">
                            {student.completedCourses} of{" "}
                            {student.totalCourses} courses
                          </p>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1.5 text-[10px] font-semibold ${getStatusClass(student.status)}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${student.status === "Active"
                              ? "bg-emerald-300"
                              : student.status === "At Risk"
                                ? "bg-amber-300"
                                : student.status === "Inactive"
                                  ? "bg-rose-300"
                                  : "bg-cyan-300"
                              }`}
                          />

                          {student.status}
                        </span>

                        <p className="mt-2 whitespace-nowrap text-[10px] text-slate-500">
                          Active: {student.lastActive}
                        </p>
                      </td>

                      <td className="px-4 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => setSelectedStudent(student)}
                          className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 py-2 text-[10px] font-semibold text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] hover:text-cyan-100"
                        >
                          <Eye size={13} />
                          View
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>

            {paginatedStudents.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center px-6 py-16 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-slate-500">
                  <Users size={24} />
                </div>

                <p className="mt-4 text-sm font-semibold text-white">
                  No students found
                </p>

                <p className="mt-1 max-w-sm text-xs leading-5 text-slate-500">
                  Search ya filters change karke student records dobara check karo.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl border border-cyan-300/15 bg-cyan-300/[0.06] px-4 py-2.5 text-xs font-semibold text-cyan-200 transition hover:bg-cyan-300/[0.12]"
                >
                  Clear all filters
                </button>
              </motion.div>
            )}
          </div>

          {/* PAGINATION */}

          <div className="flex flex-col justify-between gap-3 border-t border-white/[0.07] px-4 py-4 sm:flex-row sm:items-center sm:px-5">
            <p className="text-[10px] leading-5 text-slate-500">
              Showing{" "}
              <span className="font-semibold text-slate-300">
                {totalStudents === 0
                  ? 0
                  : (safePage - 1) * pageSize + 1}
              </span>
              {"–"}
              <span className="font-semibold text-slate-300">
                {Math.min(safePage * pageSize, totalStudents)}
              </span>
              {" of "}
              <span className="font-semibold text-slate-300">
                {totalStudents}
              </span>{" "}
              students
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={safePage <= 1}
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                className="inline-flex h-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-[10px] font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Previous
              </button>

              {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                (page) => (
                  <button
                    key={page}
                    type="button"
                    onClick={() => setCurrentPage(page)}
                    aria-current={safePage === page ? "page" : undefined}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg border text-[11px] font-semibold transition ${safePage === page
                      ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                      : "border-white/[0.08] bg-white/[0.025] text-slate-400 hover:border-cyan-300/20 hover:text-white"
                      }`}
                  >
                    {page}
                  </button>
                )
              )}

              <button
                type="button"
                disabled={safePage >= totalPages}
                onClick={() =>
                  setCurrentPage((page) => Math.min(totalPages, page + 1))
                }
                className="inline-flex h-9 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.025] px-3 text-[10px] font-semibold text-slate-300 transition hover:border-cyan-300/20 hover:text-white disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
              </button>
            </div>
          </div>
        </section>

        {/* COLLEGE INSIGHT PANEL */}

        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
          className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-gradient-to-r from-[#12243a] via-[#102039] to-[#142344] p-5 sm:p-6"
        >
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.07] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
                <TrendingUp size={22} />
              </div>

              <div>
                <h2 className="text-base font-bold text-white">
                  Academic performance overview
                </h2>

                <p className="mt-1 max-w-xl text-xs leading-6 text-slate-400">
                  Current filters show an average learning progress of{" "}
                  <span className="font-semibold text-cyan-200">
                    {averageProgress}%
                  </span>
                  . Students with low attendance or incomplete work may need
                  academic support.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-black/[0.12] px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/[0.08] text-cyan-200">
                <Clock3 size={17} />
              </div>

              <div>
                <p className="text-[10px] text-slate-500">
                  Students requiring review
                </p>

                <p className="mt-1 text-lg font-bold text-white">
                  {atRiskStudents}
                </p>
              </div>
            </div>
          </div>
        </motion.section>


      </div>

      {selectedStudent && (
        <StudentDetailsModal
          student={selectedStudent}
          onClose={closeStudentDetails}
        />
      )}
    </motion.main>
  );
}
