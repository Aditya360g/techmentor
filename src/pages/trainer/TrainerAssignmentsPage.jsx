
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDownWideNarrow,
  ArrowRight,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  Filter,
  GraduationCap,
  Layers3,
  Search,
  SlidersHorizontal,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   ASSIGNMENT DATA
========================================================= */

const INITIAL_ASSIGNMENTS = [
  {
    id: "ASN-1001",
    institution: "RKGIT",
    location: "Ghaziabad",
    course: "Java + DSA",
    category: "Programming",
    students: 120,
    startDate: "2026-09-01",
    endDate: "2026-12-31",
    duration: "4 Months",
    progress: 34,
    status: "Active",
    trainer: "Aditya Sharma",
    email: "aditya@example.com",
    completedModules: 8,
    totalModules: 24,
    attendance: 91,
    description:
      "A structured Java and Data Structures program focused on problem-solving, programming fundamentals, and placement preparation.",
    modules: [
      "Java Fundamentals",
      "Object-Oriented Programming",
      "Arrays and Strings",
      "Searching and Sorting",
      "Linked Lists",
      "Stacks and Queues",
      "Trees and Graphs",
      "Dynamic Programming",
    ],
  },
  {
    id: "ASN-1002",
    institution: "XYZ College",
    location: "Noida",
    course: "Spring Boot",
    category: "Backend Development",
    students: 80,
    startDate: "2026-08-18",
    endDate: "2026-10-13",
    duration: "8 Weeks",
    progress: 62,
    status: "Active",
    trainer: "Aditya Sharma",
    email: "aditya@example.com",
    completedModules: 13,
    totalModules: 21,
    attendance: 88,
    description:
      "A practical backend development program covering REST APIs, Spring Boot, database integration, authentication, and deployment fundamentals.",
    modules: [
      "Java Backend Fundamentals",
      "Spring Boot Setup",
      "REST API Development",
      "Spring Data JPA",
      "MySQL Integration",
      "Validation and Error Handling",
      "Authentication",
      "Testing and Deployment",
    ],
  },
  {
    id: "ASN-1003",
    institution: "Global University",
    location: "Jaipur",
    course: "Core Java",
    category: "Programming",
    students: 95,
    startDate: "2026-07-05",
    endDate: "2026-08-16",
    duration: "6 Weeks",
    progress: 100,
    status: "Completed",
    trainer: "Aditya Sharma",
    email: "aditya@example.com",
    completedModules: 18,
    totalModules: 18,
    attendance: 96,
    description:
      "A completed Core Java training program covering programming fundamentals, object-oriented concepts, collections, and exception handling.",
    modules: [
      "Java Fundamentals",
      "Control Statements",
      "Object-Oriented Programming",
      "Inheritance and Polymorphism",
      "Exception Handling",
      "Collections Framework",
      "File Handling",
      "Final Project",
    ],
  },
  {
    id: "ASN-1004",
    institution: "Tech Institute",
    location: "Delhi",
    course: "DSA Placement",
    category: "Placement Preparation",
    students: 70,
    startDate: "2026-10-05",
    endDate: "2026-11-16",
    duration: "6 Weeks",
    progress: 0,
    status: "Upcoming",
    trainer: "Aditya Sharma",
    email: "aditya@example.com",
    completedModules: 0,
    totalModules: 20,
    attendance: 0,
    description:
      "An upcoming placement-focused program covering data structures, algorithms, coding practice, and technical interview preparation.",
    modules: [
      "Complexity Analysis",
      "Arrays and Strings",
      "Recursion",
      "Linked Lists",
      "Stacks and Queues",
      "Trees and Graphs",
      "Greedy Algorithms",
      "Interview Practice",
    ],
  },
  {
    id: "ASN-1005",
    institution: "Northstar Institute",
    location: "Gurugram",
    course: "Full Stack Development",
    category: "Web Development",
    students: 65,
    startDate: "2026-09-15",
    endDate: "2027-01-15",
    duration: "4 Months",
    progress: 18,
    status: "Active",
    trainer: "Aditya Sharma",
    email: "aditya@example.com",
    completedModules: 4,
    totalModules: 22,
    attendance: 84,
    description:
      "A full-stack program covering frontend development, backend APIs, database fundamentals, application integration, and project building.",
    modules: [
      "HTML and CSS",
      "JavaScript Essentials",
      "React Development",
      "Routing and State",
      "Backend APIs",
      "Database Integration",
      "Authentication",
      "Capstone Project",
    ],
  },
  {
    id: "ASN-1006",
    institution: "Pioneer Technical Campus",
    location: "Faridabad",
    course: "Python + Data Science",
    category: "AI & Data Science",
    students: 105,
    startDate: "2026-08-25",
    endDate: "2026-12-25",
    duration: "4 Months",
    progress: 48,
    status: "Active",
    trainer: "Aditya Sharma",
    email: "aditya@example.com",
    completedModules: 10,
    totalModules: 21,
    attendance: 89,
    description:
      "A Python and data science program covering data analysis, visualization, statistics, machine learning fundamentals, and practical projects.",
    modules: [
      "Python Fundamentals",
      "NumPy",
      "Pandas",
      "Data Cleaning",
      "Data Visualization",
      "Statistics",
      "Machine Learning",
      "Final Project",
    ],
  },
];

const STATUS_OPTIONS = [
  { label: "All statuses", value: "All" },
  { label: "Active", value: "Active" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Completed", value: "Completed" },
];

const CATEGORY_OPTIONS = [
  { label: "All categories", value: "All" },
  { label: "Programming", value: "Programming" },
  { label: "Backend Development", value: "Backend Development" },
  { label: "Web Development", value: "Web Development" },
  { label: "AI & Data Science", value: "AI & Data Science" },
  {
    label: "Placement Preparation",
    value: "Placement Preparation",
  },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Progress: high to low", value: "progress-desc" },
  { label: "Progress: low to high", value: "progress-asc" },
  { label: "Students: high to low", value: "students-desc" },
  { label: "Course name: A–Z", value: "course-asc" },
];

const STATUS_STYLES = {
  Active: {
    dot: "bg-emerald-500",
    badge: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  Upcoming: {
    dot: "bg-amber-500",
    badge: "border-amber-200 bg-amber-50 text-amber-700",
  },
  Completed: {
    dot: "bg-blue-500",
    badge: "border-blue-200 bg-blue-50 text-blue-700",
  },
};

/* =========================================================
   HELPERS
========================================================= */

function formatDate(value) {
  if (!value) return "—";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(value = "") {
  return value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function exportAssignments(assignments) {
  const headers = [
    "Assignment ID",
    "Institution",
    "Location",
    "Course",
    "Category",
    "Students",
    "Start Date",
    "End Date",
    "Duration",
    "Progress",
    "Status",
    "Attendance",
  ];

  const rows = assignments.map((item) => [
    item.id,
    item.institution,
    item.location,
    item.course,
    item.category,
    item.students,
    item.startDate,
    item.endDate,
    item.duration,
    `${item.progress}%`,
    item.status,
    `${item.attendance}%`,
  ]);

  const csvValue = (value) =>
    `"${String(value ?? "").replaceAll('"', '""')}"`;

  const csv = [headers, ...rows]
    .map((row) => row.map(csvValue).join(","))
    .join("\r\n");

  const blob = new Blob(["\uFEFF", csv], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "trainer-assignments.csv";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

/* =========================================================
   CUSTOM PREMIUM DROPDOWN
========================================================= */

function CustomDropdown({
  label,
  value,
  options,
  onChange,
  icon: Icon = SlidersHorizontal,
  searchable = false,
  placeholder = "Select an option",
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const optionRefs = useRef([]);

  const selectedOption =
    options.find((option) => option.value === value) ?? options[0];

  const filteredOptions = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    if (!normalized) return options;

    return options.filter((option) =>
      option.label.toLowerCase().includes(normalized)
    );
  }, [options, query]);

  useEffect(() => {
    function handleOutsideClick(event) {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
        setQuery("");
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (!open) return;

    const selectedIndex = filteredOptions.findIndex(
      (option) => option.value === value
    );

    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);

    if (searchable) {
      requestAnimationFrame(() => searchRef.current?.focus());
    }
  }, [open, searchable, filteredOptions, value]);

  useEffect(() => {
    if (open) {
      optionRefs.current[activeIndex]?.scrollIntoView({
        block: "nearest",
      });
    }
  }, [activeIndex, open]);

  function selectOption(option) {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  }

  function handleKeyDown(event) {
    if (!open) {
      if (["Enter", " ", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActiveIndex((index) =>
        Math.min(index + 1, filteredOptions.length - 1)
      );
    }

    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    }

    if (event.key === "Enter" && filteredOptions[activeIndex]) {
      event.preventDefault();
      selectOption(filteredOptions[activeIndex]);
    }
  }

  const optionColors = [
    {
      idle: "bg-violet-50 text-violet-800 hover:bg-violet-100",
      icon: "bg-violet-100 text-violet-700",
    },
    {
      idle: "bg-sky-50 text-sky-800 hover:bg-sky-100",
      icon: "bg-sky-100 text-sky-700",
    },
    {
      idle: "bg-amber-50 text-amber-800 hover:bg-amber-100",
      icon: "bg-amber-100 text-amber-700",
    },
    {
      idle: "bg-rose-50 text-rose-800 hover:bg-rose-100",
      icon: "bg-rose-100 text-rose-700",
    },
    {
      idle: "bg-teal-50 text-teal-800 hover:bg-teal-100",
      icon: "bg-teal-100 text-teal-700",
    },
    {
      idle: "bg-indigo-50 text-indigo-800 hover:bg-indigo-100",
      icon: "bg-indigo-100 text-indigo-700",
    },
  ];

  return (
    <div ref={rootRef} className="relative min-w-0">
      {label && (
        <label className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
          {label}
        </label>
      )}

      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        onKeyDown={handleKeyDown}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={[
          "group flex min-h-[48px] w-full items-center gap-3 rounded-2xl",
          "border bg-white px-3.5 py-3 text-left shadow-sm",
          "transition-all duration-200",
          open
            ? "border-emerald-400 ring-4 ring-emerald-500/10"
            : "border-slate-200 hover:border-slate-300 hover:shadow-md",
        ].join(" ")}
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-emerald-50 group-hover:text-emerald-700">
          <Icon size={16} />
        </span>

        <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-900">
          {selectedOption?.label ?? placeholder}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-slate-400"
        >
          <ChevronDown size={17} />
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={{ transformOrigin: "top center" }}
            className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_55px_-18px_rgba(15,23,42,0.32)]"
          >
            {searchable && (
              <div className="border-b border-slate-100 p-3">
                <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 focus-within:border-emerald-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                  <Search size={15} className="shrink-0 text-slate-400" />

                  <input
                    ref={searchRef}
                    type="text"
                    value={query}
                    onChange={(event) => {
                      setQuery(event.target.value);
                      setActiveIndex(0);
                    }}
                    onKeyDown={handleKeyDown}
                    placeholder="Find an option..."
                    className="h-10 w-full min-w-0 bg-transparent text-sm font-bold text-slate-950 outline-none placeholder:font-medium placeholder:text-slate-400"
                  />

                  {query && (
                    <button
                      type="button"
                      aria-label="Clear dropdown search"
                      onClick={() => {
                        setQuery("");
                        setActiveIndex(0);
                        searchRef.current?.focus();
                      }}
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-200 hover:text-slate-900"
                    >
                      <X size={14} />
                    </button>
                  )}
                </div>
              </div>
            )}

            <div
              role="listbox"
              aria-label={label || "Options"}
              className="max-h-64 space-y-1 overflow-y-auto p-2"
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option, index) => {
                  const selected = option.value === value;
                  const active = index === activeIndex;
                  const colors = optionColors[index % optionColors.length];

                  return (
                    <button
                      key={option.value}
                      ref={(element) => {
                        optionRefs.current[index] = element;
                      }}
                      type="button"
                      role="option"
                      aria-selected={selected}
                      onMouseEnter={() => setActiveIndex(index)}
                      onClick={() => selectOption(option)}
                      className={[
                        "flex w-full items-center gap-3 rounded-xl border px-3 py-3 text-left",
                        "transition-colors duration-150",
                        selected
                          ? "border-emerald-200 bg-emerald-100 text-emerald-900 shadow-sm"
                          : active
                            ? "border-slate-200 bg-slate-100 text-slate-950"
                            : `border-transparent ${colors.idle}`,
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                          selected
                            ? "bg-emerald-600 text-white"
                            : active
                              ? "bg-white text-slate-700"
                              : colors.icon,
                        ].join(" ")}
                      >
                        {selected ? (
                          <Check size={15} />
                        ) : (
                          <span className="h-2 w-2 rounded-full bg-current" />
                        )}
                      </span>

                      <span
                        className={[
                          "min-w-0 flex-1 text-sm",
                          selected ? "font-extrabold" : "font-semibold",
                        ].join(" ")}
                      >
                        {option.label}
                      </span>

                      {selected && (
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700">
                          Selected
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="px-4 py-8 text-center">
                  <Search size={22} className="mx-auto mb-2 text-slate-300" />
                  <p className="text-sm font-semibold text-slate-600">
                    No matching options
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Try another search term.
                  </p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-4 py-2.5">
              <span className="text-[11px] font-medium text-slate-400">
                {filteredOptions.length} options
              </span>
              <span className="text-[11px] font-semibold text-slate-400">
                Enter to select · Esc to close
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   STATUS BADGE
========================================================= */

function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] || STATUS_STYLES.Active;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-bold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

/* =========================================================
   SUMMARY CARD
========================================================= */

function SummaryCard({ title, value, subtitle, icon: Icon, accent }) {
  const accents = {
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    violet: "bg-violet-50 text-violet-700 ring-violet-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
  };

  return (
    <motion.div
      whileHover={{ y: -3 }}
      transition={{ duration: 0.2 }}
      className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-lg hover:shadow-slate-200/40 sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-3 text-3xl font-extrabold tracking-tight text-slate-950">
            {value}
          </p>
          <p className="mt-2 text-xs font-medium text-slate-400">
            {subtitle}
          </p>
        </div>

        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ${accents[accent]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   PROGRESS BAR
========================================================= */

function ProgressBar({ progress }) {
  const color =
    progress === 100
      ? "bg-blue-500"
      : progress === 0
        ? "bg-slate-300"
        : "bg-emerald-500";

  return (
    <div>
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-500">
          Course progress
        </span>
        <span className="text-sm font-extrabold tabular-nums text-slate-900">
          {progress}%
        </span>
      </div>

      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`h-full rounded-full ${color}`}
        />
      </div>
    </div>
  );
}

/* =========================================================
   ASSIGNMENT CARD
========================================================= */

function AssignmentCard({ assignment, onOpenProgram }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.22 }}
      className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl hover:shadow-slate-200/60"
    >
      <div className="h-1 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400" />

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-700 ring-1 ring-emerald-100">
            <GraduationCap size={23} />
          </div>

          <StatusBadge status={assignment.status} />
        </div>

        <div className="mt-5">
          <p className="text-xs font-bold uppercase tracking-[0.12em] text-emerald-700">
            {assignment.id}
          </p>

          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-950">
            {assignment.course}
          </h3>

          <div className="mt-2 flex items-start gap-2 text-sm text-slate-500">
            <Building2 size={16} className="mt-0.5 shrink-0" />
            <span>
              <span className="font-semibold text-slate-700">
                {assignment.institution}
              </span>
              <span className="mx-1.5 text-slate-300">·</span>
              {assignment.location}
            </span>
          </div>

          <div className="mt-4 inline-flex max-w-full items-center rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-600">
            <Layers3 size={13} className="mr-2 shrink-0 text-slate-400" />
            <span className="truncate">{assignment.category}</span>
          </div>
        </div>

        <div className="my-5 grid grid-cols-2 gap-3">
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
            <div className="flex items-center gap-2 text-slate-400">
              <Users size={15} />
              <span className="text-xs font-semibold">Students</span>
            </div>
            <p className="mt-2 text-xl font-extrabold text-slate-900">
              {assignment.students}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3.5">
            <div className="flex items-center gap-2 text-slate-400">
              <BookOpen size={15} />
              <span className="text-xs font-semibold">Modules</span>
            </div>
            <p className="mt-2 text-xl font-extrabold text-slate-900">
              {assignment.completedModules}
              <span className="ml-1 text-sm font-semibold text-slate-400">
                / {assignment.totalModules}
              </span>
            </p>
          </div>
        </div>

        <ProgressBar progress={assignment.progress} />

        <div className="mt-5 space-y-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm">
            <CalendarDays size={15} className="shrink-0 text-slate-400" />
            <span className="text-slate-500">Duration</span>
            <span className="ml-auto text-right font-bold text-slate-700">
              {assignment.duration}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <Clock3 size={15} className="shrink-0 text-slate-400" />
            <span className="text-slate-500">Ends on</span>
            <span className="ml-auto text-right font-bold text-slate-700">
              {formatDate(assignment.endDate)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => onOpenProgram(assignment)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3.5 text-sm font-bold text-white transition-all hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
        >
          Open program
          <ArrowRight
            size={16}
            className="transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </motion.article>
  );
}

/* =========================================================
   ASSIGNMENT DETAILS MODAL
========================================================= */

function AssignmentDetailsModal({ assignment, onClose, onStatusChange }) {
  useEffect(() => {
    if (!assignment) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [assignment, onClose]);

  return (
    <AnimatePresence>
      {assignment && (
        <motion.div
          key={assignment.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/50 p-3 backdrop-blur-sm sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22 }}
            className="my-auto w-full max-w-3xl overflow-hidden rounded-3xl border border-white/70 bg-white shadow-2xl"
            role="dialog"
            aria-modal="true"
            aria-labelledby="assignment-modal-title"
          >
            <div className="relative overflow-hidden bg-slate-950 px-5 py-6 text-white sm:px-8 sm:py-8">
              <div className="absolute -right-12 -top-20 h-52 w-52 rounded-full bg-emerald-500/20 blur-3xl" />
              <div className="absolute -bottom-24 left-1/3 h-44 w-44 rounded-full bg-cyan-400/10 blur-3xl" />

              <div className="relative flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
                    {assignment.id}
                  </p>

                  <h2
                    id="assignment-modal-title"
                    className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl"
                  >
                    {assignment.course}
                  </h2>

                  <p className="mt-2 flex items-center gap-2 text-sm text-slate-300">
                    <Building2 size={15} />
                    {assignment.institution}, {assignment.location}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close assignment details"
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-white transition hover:bg-white/20"
                >
                  <X size={19} />
                </button>
              </div>

              <div className="relative mt-5 flex flex-wrap items-center gap-3">
                <StatusBadge status={assignment.status} />
                <span className="text-sm font-medium text-slate-300">
                  {assignment.duration}
                </span>
              </div>
            </div>

            <div className="max-h-[65vh] space-y-7 overflow-y-auto p-5 sm:p-8">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Program overview
                </h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">
                  {assignment.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                {[
                  {
                    label: "Students",
                    value: assignment.students,
                    icon: Users,
                  },
                  {
                    label: "Progress",
                    value: `${assignment.progress}%`,
                    icon: Activity,
                  },
                  {
                    label: "Attendance",
                    value: `${assignment.attendance}%`,
                    icon: CheckCircle2,
                  },
                  {
                    label: "Modules",
                    value: `${assignment.completedModules}/${assignment.totalModules}`,
                    icon: BookOpen,
                  },
                ].map((item) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.label}
                      className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <Icon size={17} className="text-emerald-700" />
                      <p className="mt-3 text-xl font-extrabold text-slate-950">
                        {item.value}
                      </p>
                      <p className="mt-1 text-xs font-medium text-slate-500">
                        {item.label}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Program timeline
                </h3>

                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500">
                      Start date
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {formatDate(assignment.startDate)}
                    </p>
                  </div>

                  <div className="rounded-2xl border border-slate-200 p-4">
                    <p className="text-xs font-semibold text-slate-500">
                      End date
                    </p>
                    <p className="mt-2 font-bold text-slate-900">
                      {formatDate(assignment.endDate)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-extrabold text-slate-950">
                    Training modules
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">
                    {assignment.modules.length} topics
                  </span>
                </div>

                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {assignment.modules.map((module, index) => {
                    const completed = index < assignment.completedModules;

                    return (
                      <div
                        key={module}
                        className="flex items-center gap-3 rounded-xl border border-slate-100 p-3"
                      >
                        <span
                          className={[
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                            completed
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500",
                          ].join(" ")}
                        >
                          {completed ? <Check size={15} /> : index + 1}
                        </span>

                        <span className="text-sm font-semibold text-slate-700">
                          {module}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 p-4 sm:p-5">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Assigned trainer
                </p>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-sm font-extrabold text-emerald-800">
                    {getInitials(assignment.trainer)}
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">
                      {assignment.trainer}
                    </p>
                    <p className="break-all text-sm text-slate-500">
                      {assignment.email}
                    </p>
                  </div>
                </div>
              </div>

              {assignment.status !== "Completed" && (
                <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-slate-500">
                    Update the program status when its stage changes.
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {assignment.status === "Upcoming" && (
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(assignment.id, "Active")
                        }
                        className="rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                      >
                        Start program
                      </button>
                    )}

                    {assignment.status === "Active" && (
                      <button
                        type="button"
                        onClick={() =>
                          onStatusChange(assignment.id, "Completed")
                        }
                        className="rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-700"
                      >
                        Mark completed
                      </button>
                    )}
                  </div>
                </div>
              )}

              <div className="flex justify-end border-t border-slate-100 pt-5">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Close details
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TrainerAssignmentsPage() {
  const navigate = useNavigate();

  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  const summary = useMemo(
    () => ({
      total: assignments.length,
      active: assignments.filter((item) => item.status === "Active").length,
      students: assignments.reduce((total, item) => total + item.students, 0),
      completed: assignments.filter((item) => item.status === "Completed")
        .length,
    }),
    [assignments]
  );

  const filteredAssignments = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const result = assignments.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        [
          item.id,
          item.institution,
          item.location,
          item.course,
          item.category,
          item.status,
          item.trainer,
        ].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesStatus =
        statusFilter === "All" || item.status === statusFilter;

      const matchesCategory =
        categoryFilter === "All" || item.category === categoryFilter;

      return matchesSearch && matchesStatus && matchesCategory;
    });

    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return a.startDate.localeCompare(b.startDate);
        case "progress-desc":
          return b.progress - a.progress;
        case "progress-asc":
          return a.progress - b.progress;
        case "students-desc":
          return b.students - a.students;
        case "course-asc":
          return a.course.localeCompare(b.course);
        case "newest":
        default:
          return b.startDate.localeCompare(a.startDate);
      }
    });

    return result;
  }, [assignments, search, statusFilter, categoryFilter, sortBy]);

  function handleOpenProgram(assignment) {
    navigate(`/trainer/assignments/${assignment.id}`, {
      state: { assignment },
    });
  }

  function handleStatusChange(assignmentId, newStatus) {
    setAssignments((current) =>
      current.map((item) =>
        item.id === assignmentId ? { ...item, status: newStatus } : item
      )
    );

    setSelectedAssignment((current) =>
      current?.id === assignmentId
        ? { ...current, status: newStatus }
        : current
    );
  }

  function resetFilters() {
    setSearch("");
    setStatusFilter("All");
    setCategoryFilter("All");
    setSortBy("newest");
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    statusFilter !== "All" ||
    categoryFilter !== "All" ||
    sortBy !== "newest";

  return (
    <div className="min-h-screen bg-[#f7f9fc] px-4 py-6 text-slate-900 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-[1500px]">
        {/* PAGE HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
        >
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-800">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              TRAINER WORKSPACE
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              My Assignments
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Manage your training programs, track learner progress, and keep
              every assignment moving forward.
            </p>
          </div>

          <button
            type="button"
            onClick={() => exportAssignments(filteredAssignments)}
            className="inline-flex items-center justify-center gap-2 self-start rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20 lg:self-auto"
          >
            <Download size={17} />
            Export CSV
          </button>
        </motion.div>

        {/* SUMMARY CARDS */}
        <div className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard
            title="Total assignments"
            value={summary.total}
            subtitle="All assigned programs"
            icon={Layers3}
            accent="emerald"
          />

          <SummaryCard
            title="Active programs"
            value={summary.active}
            subtitle="Currently in progress"
            icon={Activity}
            accent="blue"
          />

          <SummaryCard
            title="Total learners"
            value={summary.students.toLocaleString("en-IN")}
            subtitle="Across all programs"
            icon={Users}
            accent="violet"
          />

          <SummaryCard
            title="Completed programs"
            value={summary.completed}
            subtitle="Successfully completed"
            icon={CheckCircle2}
            accent="amber"
          />
        </div>

        {/* SEARCH AND FILTERS */}
        <section className="relative mt-8 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center">
            <div className="relative min-w-0 flex-1">
              <Search
                size={19}
                className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search course, institution, location or ID..."
                className="h-[52px] w-full rounded-2xl border border-slate-200 bg-slate-50 pl-12 pr-12 text-sm font-bold text-slate-950 outline-none transition placeholder:font-medium placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-200 hover:text-slate-950"
                >
                  <X size={17} />
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={() => setShowFilters((current) => !current)}
              aria-expanded={showFilters}
              className={[
                "inline-flex min-h-[52px] items-center justify-center gap-2 rounded-2xl border px-4 text-sm font-bold transition",
                showFilters
                  ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              <Filter size={17} />
              Filters
              <motion.span
                animate={{ rotate: showFilters ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown size={16} />
              </motion.span>
            </button>
          </div>

          {/* Height animation intentionally removed to prevent dropdown clipping */}
          {showFilters && (
            <div className="relative mt-5 border-t border-slate-100 pt-5">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                <CustomDropdown
                  label="Program status"
                  value={statusFilter}
                  options={STATUS_OPTIONS}
                  onChange={setStatusFilter}
                  icon={Activity}
                />

                <CustomDropdown
                  label="Program category"
                  value={categoryFilter}
                  options={CATEGORY_OPTIONS}
                  onChange={setCategoryFilter}
                  icon={Layers3}
                  searchable
                />

                <CustomDropdown
                  label="Sort assignments"
                  value={sortBy}
                  options={SORT_OPTIONS}
                  onChange={setSortBy}
                  icon={ArrowDownWideNarrow}
                  searchable
                />
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                <p className="text-xs font-medium text-slate-500">
                  Filters update the assignment list instantly.
                </p>

                {hasActiveFilters && (
                  <button
                    type="button"
                    onClick={resetFilters}
                    className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-bold text-emerald-700 transition hover:bg-emerald-50"
                  >
                    <X size={15} />
                    Reset filters
                  </button>
                )}
              </div>
            </div>
          )}

          {/* RESULTS SUMMARY */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
            <p className="text-sm text-slate-500">
              Showing{" "}
              <span className="font-extrabold text-slate-950">
                {filteredAssignments.length}
              </span>{" "}
              of{" "}
              <span className="font-extrabold text-slate-950">
                {assignments.length}
              </span>{" "}
              assignments
            </p>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-xs font-bold text-slate-500 underline decoration-slate-300 underline-offset-4 transition hover:text-emerald-700"
              >
                Clear all filters
              </button>
            )}
          </div>
        </section>

        {/* ASSIGNMENT GRID */}
        <section className="mt-6">
          {filteredAssignments.length > 0 ? (
            <motion.div
              layout
              className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 2xl:grid-cols-3"
            >
              <AnimatePresence mode="popLayout">
                {filteredAssignments.map((assignment) => (
                  <AssignmentCard
                    key={assignment.id}
                    assignment={assignment}
                    onOpenProgram={handleOpenProgram}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-3xl border border-dashed border-slate-300 bg-white px-5 py-16 text-center"
            >
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                <Search size={27} />
              </div>

              <h3 className="mt-5 text-lg font-extrabold text-slate-950">
                No assignments found
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Try changing your search term or adjusting the selected
                filters to find the assignment you need.
              </p>

              <button
                type="button"
                onClick={resetFilters}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-emerald-700"
              >
                <X size={16} />
                Clear filters
              </button>
            </motion.div>
          )}
        </section>

        {/* FOOTER NOTE */}
        <div className="mt-8 flex flex-col gap-2 rounded-2xl border border-slate-200/80 bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-600">
            <CheckCircle2 size={17} className="text-emerald-600" />
            Assignment overview is up to date for this session.
          </div>

          <span className="text-xs font-medium text-slate-400">
            Trainer Workspace · Assignment Management
          </span>
        </div>
      </div>

      {/* DETAILS MODAL */}
      <AssignmentDetailsModal
        assignment={selectedAssignment}
        onClose={() => setSelectedAssignment(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
