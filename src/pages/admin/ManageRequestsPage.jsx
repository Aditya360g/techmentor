
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  AlertCircle,
  ArrowDownUp,
  Ban,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  ClipboardList,
  CircleDollarSign,
  Download,
  Eye,
  FileText,
  Filter,
  GraduationCap,
  Mail,
  Pencil,
  PauseCircle,
  Phone,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   CODEFACULTY — MANAGE REQUESTS
   Admin Dashboard Typography + Premium Orange Theme
========================================================= */

const STORAGE_KEY = "codefaculty_admin_manage_requests_v2";

/* =========================================================
   OPTIONS
========================================================= */

const COLLEGES = [
  "Rajasthan Technical University",
  "JECRC University",
  "Poornima College of Engineering",
  "LNM Institute of Information Technology",
  "Arya College of Engineering",
  "SKIT Jaipur",
  "Manipal University Jaipur",
  "Amity University Rajasthan",
];

const PROGRAMS = [
  "Full Stack Development",
  "Python Programming",
  "Java & DSA",
  "Artificial Intelligence",
  "Data Science",
  "React Development",
  "Machine Learning",
  "Cloud Computing",
  "Cyber Security",
  "DevOps Engineering",
];

const REQUEST_TYPES = [
  "New Training Program",
  "Trainer Requirement",
  "Workshop Request",
  "Technical Demo",
  "Placement Training",
  "Internship Program",
  "Other",
];

const REQUEST_STATUSES = [
  "Pending",
  "Under Review",
  "Approved",
  "Rejected",
  "On Hold",
];

const PRIORITIES = ["High", "Medium", "Low"];

const STATUS_OPTIONS = [
  { label: "All statuses", value: "All" },
  ...REQUEST_STATUSES.map((value) => ({
    label: value,
    value,
  })),
];

const PRIORITY_OPTIONS = [
  { label: "All priorities", value: "All" },
  ...PRIORITIES.map((value) => ({
    label: value,
    value,
  })),
];

const DATE_OPTIONS = [
  { label: "All dates", value: "All" },
  { label: "Last 7 days", value: "Last 7 days" },
  { label: "Last 30 days", value: "Last 30 days" },
  { label: "Older requests", value: "Older" },
];

const SORT_OPTIONS = [
  { label: "Newest first", value: "newest" },
  { label: "Oldest first", value: "oldest" },
  { label: "Students: high to low", value: "students-high" },
  { label: "Students: low to high", value: "students-low" },
  { label: "Budget: high to low", value: "budget-high" },
];

const STATUS_META = {
  Pending: {
    className: "pending",
  },
  "Under Review": {
    className: "review",
  },
  Approved: {
    className: "approved",
  },
  Rejected: {
    className: "rejected",
  },
  "On Hold": {
    className: "hold",
  },
};

const PRIORITY_META = {
  High: "high",
  Medium: "medium",
  Low: "low",
};

/* =========================================================
   HELPERS
========================================================= */

const pad = (value) => String(value).padStart(2, "0");

const toISODate = (date) =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;

const todayISO = () => toISODate(new Date());

const getDaysAgo = (days) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - days);
  return toISODate(date);
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatNumber = (value) =>
  new Intl.NumberFormat("en-IN").format(Number(value || 0));

const formatCurrency = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value || 0));

const createId = () =>
  `REQ-${Date.now().toString().slice(-7)}`;

const escapeCSV = (value) =>
  `"${String(value ?? "").replace(/"/g, '""')}"`;

/* =========================================================
   SAMPLE REQUEST DATA
========================================================= */

const createInitialRequests = () => [
  {
    id: "REQ-1001",
    title: "Java & DSA Training Program",
    college: "Rajasthan Technical University",
    program: "Java & DSA",
    type: "New Training Program",
    students: 120,
    duration: "8 Weeks",
    priority: "High",
    status: "Pending",
    requestedBy: "Rahul Gupta",
    email: "rahul@rtu.ac.in",
    phone: "9876543210",
    date: getDaysAgo(1),
    budget: 75000,
    description:
      "We need an industry-oriented Java and DSA training program for our final-year students, including coding practice and mock interviews.",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1002",
    title: "Python & AI Foundation Program",
    college: "JECRC University",
    program: "Python Programming",
    type: "New Training Program",
    students: 80,
    duration: "6 Weeks",
    priority: "Medium",
    status: "Under Review",
    requestedBy: "Amit Jain",
    email: "amit@jecrc.ac.in",
    phone: "9876543211",
    date: getDaysAgo(3),
    budget: 55000,
    description:
      "Requesting a Python foundation course with practical assignments and introductory AI concepts.",
    notes: "Curriculum review is in progress.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1003",
    title: "Full Stack Development Workshop",
    college: "Poornima College of Engineering",
    program: "Full Stack Development",
    type: "Workshop Request",
    students: 150,
    duration: "3 Days",
    priority: "High",
    status: "Approved",
    requestedBy: "Sandeep Sharma",
    email: "sandeep@poornima.edu",
    phone: "9876543212",
    date: getDaysAgo(5),
    budget: 40000,
    description:
      "Three-day practical workshop covering frontend, backend and database integration.",
    notes: "Approved. Coordinate trainer availability.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1004",
    title: "React Development Trainer",
    college: "SKIT Jaipur",
    program: "React Development",
    type: "Trainer Requirement",
    students: 65,
    duration: "4 Weeks",
    priority: "Medium",
    status: "Pending",
    requestedBy: "Vikas Sharma",
    email: "vikas@skit.ac.in",
    phone: "9876543213",
    date: getDaysAgo(8),
    budget: 35000,
    description:
      "Requirement for an experienced React trainer for project-based student sessions.",
    notes: "",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1005",
    title: "Machine Learning Orientation",
    college: "LNM Institute of Information Technology",
    program: "Machine Learning",
    type: "Technical Demo",
    students: 90,
    duration: "1 Day",
    priority: "Low",
    status: "On Hold",
    requestedBy: "Rohit Kumar",
    email: "rohit@lnmiit.ac.in",
    phone: "9876543214",
    date: getDaysAgo(12),
    budget: 18000,
    description:
      "An introductory machine learning session with real-world applications and career guidance.",
    notes: "Waiting for college confirmation.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1006",
    title: "Data Science Placement Training",
    college: "Arya College of Engineering",
    program: "Data Science",
    type: "Placement Training",
    students: 110,
    duration: "10 Weeks",
    priority: "High",
    status: "Under Review",
    requestedBy: "Mohit Yadav",
    email: "mohit@arya.ac.in",
    phone: "9876543215",
    date: getDaysAgo(2),
    budget: 95000,
    description:
      "Placement-oriented data science training with Python, SQL, analytics and interview preparation.",
    notes: "Budget and trainer availability need review.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1007",
    title: "Cloud Computing Internship Program",
    college: "Manipal University Jaipur",
    program: "Cloud Computing",
    type: "Internship Program",
    students: 45,
    duration: "12 Weeks",
    priority: "Medium",
    status: "Rejected",
    requestedBy: "Neha Sharma",
    email: "neha@jaipur.manipal.edu",
    phone: "9876543216",
    date: getDaysAgo(35),
    budget: 60000,
    description:
      "Cloud internship request for selected students with practical deployment projects.",
    notes: "Current batch capacity is full.",
    createdAt: new Date().toISOString(),
  },
  {
    id: "REQ-1008",
    title: "Cyber Security Awareness Workshop",
    college: "Amity University Rajasthan",
    program: "Cyber Security",
    type: "Workshop Request",
    students: 75,
    duration: "2 Days",
    priority: "Low",
    status: "Pending",
    requestedBy: "Aman Verma",
    email: "aman@amity.edu",
    phone: "9876543217",
    date: getDaysAgo(4),
    budget: 25000,
    description:
      "A practical cybersecurity awareness workshop covering secure browsing and common threats.",
    notes: "",
    createdAt: new Date().toISOString(),
  },
];

const loadRequests = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load requests:", error);
  }

  return createInitialRequests();
};

const EMPTY_FORM = {
  title: "",
  college: "",
  program: "",
  type: "New Training Program",
  students: "50",
  duration: "6 Weeks",
  priority: "Medium",
  status: "Pending",
  requestedBy: "",
  email: "",
  phone: "",
  date: todayISO(),
  budget: "",
  description: "",
  notes: "",
};

/* =========================================================
   PREMIUM SEARCHABLE DROPDOWN
========================================================= */

function PremiumSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select an option",
  searchable,
  disabled = false,
}) {
  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [position, setPosition] = useState(null);

  const shouldSearch = searchable ?? options.length > 6;

  const normalizedOptions = useMemo(
    () =>
      options.map((option) =>
        typeof option === "string"
          ? { label: option, value: option }
          : option
      ),
    [options]
  );

  const selectedOption = normalizedOptions.find(
    (option) => String(option.value) === String(value)
  );

  const filteredOptions = normalizedOptions.filter((option) =>
    String(option.label)
      .toLowerCase()
      .includes(search.trim().toLowerCase())
  );

  const calculatePosition = useCallback(() => {
    const rect = triggerRef.current?.getBoundingClientRect();

    if (!rect) return;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const width = Math.min(
      Math.max(rect.width, 225),
      viewportWidth - 24
    );

    const left = Math.max(
      12,
      Math.min(rect.left, viewportWidth - width - 12)
    );

    const spaceBelow = viewportHeight - rect.bottom - 20;
    const spaceAbove = rect.top - 20;
    const openUp = spaceBelow < 220 && spaceAbove > spaceBelow;

    const availableSpace = openUp ? spaceAbove : spaceBelow;

    const maxHeight = Math.min(
      320,
      Math.max(155, availableSpace)
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
  }, []);

  const toggleMenu = () => {
    if (disabled) return;

    if (open) {
      setOpen(false);
      return;
    }

    setSearch("");
    calculatePosition();
    setOpen(true);
  };

  useEffect(() => {
    if (!open) return undefined;

    const updatePosition = () => calculatePosition();

    const handleOutsideClick = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
        setSearch("");
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
  }, [open, calculatePosition]);

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={toggleMenu}
        className={`mr-select-trigger ${open ? "is-open" : ""} ${disabled ? "is-disabled" : ""
          }`}
      >
        <span
          className={
            selectedOption
              ? "mr-select-value"
              : "mr-select-placeholder"
          }
        >
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={17}
          className={`mr-select-chevron ${open ? "rotated" : ""}`}
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
              transition={{ duration: 0.16 }}
              style={{
                position: "fixed",
                top: position.top,
                left: position.left,
                width: position.width,
                maxHeight: position.maxHeight,
                zIndex: 99999,
                display: "flex",
                flexDirection: "column",
                transformOrigin: position.openUp
                  ? "bottom center"
                  : "top center",
              }}
              className="mr-dropdown"
            >
              {shouldSearch && (
                <div className="mr-dropdown-search">
                  <Search size={16} />

                  <input
                    autoFocus
                    value={search}
                    onChange={(event) =>
                      setSearch(event.target.value)
                    }
                    placeholder="Search options..."
                    aria-label="Search dropdown options"
                  />

                  {search && (
                    <button
                      type="button"
                      onClick={() => setSearch("")}
                      aria-label="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>
              )}

              <div className="mr-dropdown-list mr-scrollbar">
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
                        className={`mr-dropdown-option ${selected ? "active" : ""
                          }`}
                      >
                        <span className="mr-option-indicator">
                          {selected ? (
                            <Check size={15} strokeWidth={2.5} />
                          ) : (
                            <span />
                          )}
                        </span>

                        <span className="mr-option-label">
                          {option.label}
                        </span>

                        {selected && (
                          <span className="mr-option-selected">
                            Selected
                          </span>
                        )}
                      </button>
                    );
                  })
                ) : (
                  <div className="mr-dropdown-empty">
                    <Search size={20} />
                    <strong>No results found</strong>
                    <span>Try a different search term.</span>
                  </div>
                )}
              </div>

              <div className="mr-dropdown-footer">
                <span>{filteredOptions.length} options</span>
                <span>CodeFaculty</span>
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
   UI COMPONENTS
========================================================= */

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;

  return (
    <span className={`mr-status-badge ${meta.className}`}>
      <span className="mr-status-dot" />
      {status}
    </span>
  );
}

function PriorityBadge({ priority }) {
  return (
    <span
      className={`mr-priority ${PRIORITY_META[priority] || "medium"
        }`}
    >
      <span />
      {priority}
    </span>
  );
}

function StatCard({
  title,
  value,
  note,
  icon: Icon,
  tone,
  index,
}) {
  return (
    <motion.div
      className="mr-stat-card"
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      whileHover={{ y: -3 }}
    >
      <div className="mr-stat-top">
        <div>
          <p className="mr-stat-title">{title}</p>
          <strong className="mr-stat-value">{value}</strong>
        </div>

        <span className={`mr-stat-icon ${tone}`}>
          <Icon size={23} />
        </span>
      </div>

      <div className="mr-stat-bottom">
        <span className="mr-stat-live">
          <Activity size={13} />
          {note}
        </span>
      </div>
    </motion.div>
  );
}

function IconAction({
  icon: Icon,
  label,
  onClick,
  danger = false,
}) {
  return (
    <button
      type="button"
      className={`mr-icon-action ${danger ? "danger" : ""}`}
      title={label}
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={17} />
    </button>
  );
}

function Field({
  label,
  required = false,
  children,
  hint,
  className = "",
}) {
  return (
    <div className={`mr-field ${className}`}>
      <label className="mr-field-label">
        {label}
        {required && <span>*</span>}
      </label>

      {children}

      {hint && <small className="mr-field-hint">{hint}</small>}
    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function ManageRequestsPage() {
  const [requests, setRequests] = useState(loadRequests);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [dateFilter, setDateFilter] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState("");

  const currentDate = todayISO();

  /* Save data */

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
    } catch (error) {
      console.error("Unable to save requests:", error);
    }
  }, [requests]);

  /* Toast */

  const showToast = useCallback((message) => {
    setToast(message);
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => {
      setToast("");
    }, 2700);

    return () => window.clearTimeout(timer);
  }, [toast]);

  /* Modal body scroll lock */

  useEffect(() => {
    const isOpen = modalOpen || Boolean(selectedRequest);

    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        setSelectedRequest(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modalOpen, selectedRequest]);

  /* Dashboard statistics */

  const stats = useMemo(() => {
    const pending = requests.filter(
      (request) =>
        request.status === "Pending" ||
        request.status === "Under Review"
    );

    const approved = requests.filter(
      (request) => request.status === "Approved"
    );

    const highPriority = requests.filter(
      (request) =>
        request.priority === "High" &&
        !["Approved", "Rejected"].includes(request.status)
    );

    const studentsUnderReview = pending.reduce(
      (total, request) =>
        total + Number(request.students || 0),
      0
    );

    return [
      {
        title: "Total Requests",
        value: formatNumber(requests.length),
        note: "All college submissions",
        icon: ClipboardList,
        tone: "orange",
      },
      {
        title: "Needs Attention",
        value: formatNumber(pending.length),
        note: `${formatNumber(studentsUnderReview)} students in review`,
        icon: Clock3,
        tone: "amber",
      },
      {
        title: "Approved Requests",
        value: formatNumber(approved.length),
        note: "Successfully approved",
        icon: CheckCircle2,
        tone: "green",
      },
      {
        title: "High Priority",
        value: formatNumber(highPriority.length),
        note: "Require priority handling",
        icon: AlertCircle,
        tone: "purple",
      },
    ];
  }, [requests]);

  /* Search, filter and sorting */

  const filteredRequests = useMemo(() => {
    let result = [...requests];

    const term = search.trim().toLowerCase();

    if (term) {
      result = result.filter((request) => {
        const searchable = [
          request.id,
          request.title,
          request.college,
          request.program,
          request.type,
          request.requestedBy,
          request.email,
          request.status,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(term);
      });
    }

    if (statusFilter !== "All") {
      result = result.filter(
        (request) => request.status === statusFilter
      );
    }

    if (priorityFilter !== "All") {
      result = result.filter(
        (request) => request.priority === priorityFilter
      );
    }

    if (dateFilter === "Last 7 days") {
      const cutoff = getDaysAgo(7);

      result = result.filter(
        (request) =>
          request.date >= cutoff &&
          request.date <= currentDate
      );
    }

    if (dateFilter === "Last 30 days") {
      const cutoff = getDaysAgo(30);

      result = result.filter(
        (request) =>
          request.date >= cutoff &&
          request.date <= currentDate
      );
    }

    if (dateFilter === "Older") {
      const cutoff = getDaysAgo(30);

      result = result.filter(
        (request) => request.date < cutoff
      );
    }

    result.sort((a, b) => {
      if (sortBy === "newest") {
        return `${b.date} ${b.id}`.localeCompare(
          `${a.date} ${a.id}`
        );
      }

      if (sortBy === "oldest") {
        return `${a.date} ${a.id}`.localeCompare(
          `${b.date} ${b.id}`
        );
      }

      if (sortBy === "students-high") {
        return (
          Number(b.students || 0) -
          Number(a.students || 0)
        );
      }

      if (sortBy === "students-low") {
        return (
          Number(a.students || 0) -
          Number(b.students || 0)
        );
      }

      if (sortBy === "budget-high") {
        return (
          Number(b.budget || 0) -
          Number(a.budget || 0)
        );
      }

      return 0;
    });

    return result;
  }, [
    requests,
    search,
    statusFilter,
    priorityFilter,
    dateFilter,
    sortBy,
    currentDate,
  ]);

  const hasActiveFilters =
    Boolean(search) ||
    statusFilter !== "All" ||
    priorityFilter !== "All" ||
    dateFilter !== "All";

  /* Form handlers */

  const updateForm = (name, value) => {
    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const openCreateModal = () => {
    setEditingId(null);

    setForm({
      ...EMPTY_FORM,
      date: currentDate,
    });

    setModalOpen(true);
  };

  const openEditModal = (request) => {
    setEditingId(request.id);

    setForm({
      ...EMPTY_FORM,
      ...request,
      students: String(request.students ?? 50),
      budget: String(request.budget ?? ""),
    });

    setSelectedRequest(null);
    setModalOpen(true);
  };

  const closeFormModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  /* Create / Update request */

  const handleSave = (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      students: Math.max(0, Number(form.students) || 0),
      budget: Math.max(0, Number(form.budget) || 0),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setRequests((previous) =>
        previous.map((request) =>
          request.id === editingId
            ? { ...request, ...payload }
            : request
        )
      );

      showToast("Request updated successfully");
    } else {
      const newRequest = {
        ...payload,
        id: createId(),
        createdAt: new Date().toISOString(),
      };

      setRequests((previous) => [
        newRequest,
        ...previous,
      ]);

      showToast("New request created successfully");
    }

    closeFormModal();
  };

  /* Status update */

  const handleStatusUpdate = (request, status) => {
    setRequests((previous) =>
      previous.map((item) =>
        item.id === request.id
          ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          }
          : item
      )
    );

    setSelectedRequest((previous) =>
      previous?.id === request.id
        ? { ...previous, status }
        : previous
    );

    showToast(`Request marked as ${status}`);
  };

  /* Delete */

  const handleDelete = (request) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${request.id}?`
    );

    if (!confirmed) return;

    setRequests((previous) =>
      previous.filter((item) => item.id !== request.id)
    );

    setSelectedRequest(null);
    showToast("Request deleted successfully");
  };

  /* Export CSV */

  const handleExport = () => {
    if (!filteredRequests.length) {
      showToast("No requests available to export");
      return;
    }

    const headers = [
      "Request ID",
      "Title",
      "College",
      "Program",
      "Request Type",
      "Students",
      "Duration",
      "Priority",
      "Status",
      "Requested By",
      "Email",
      "Phone",
      "Submission Date",
      "Estimated Budget",
      "Description",
      "Admin Notes",
    ];

    const rows = filteredRequests.map((request) => [
      request.id,
      request.title,
      request.college,
      request.program,
      request.type,
      request.students,
      request.duration,
      request.priority,
      request.status,
      request.requestedBy,
      request.email,
      request.phone,
      request.date,
      request.budget,
      request.description,
      request.notes,
    ]);

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `codefaculty-requests-${currentDate}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    showToast("Request report exported successfully");
  };

  /* Reset filters */

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPriorityFilter("All");
    setDateFilter("All");
    setSortBy("newest");
  };

  /* =======================================================
     MAIN RENDER
  ======================================================= */

  return (
    <div className="mr-page">
      <style>{PAGE_STYLES}</style>

      {/* PAGE HEADER */}

      <motion.section
        className="mr-page-header"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div className="mr-breadcrumb">
          <span>Admin</span>
          <span>/</span>
          <strong>Manage Requests</strong>
        </div>

        <div className="mr-header-main">
          <div>
            <div className="mr-eyebrow">
              <span />
              REQUEST MANAGEMENT
            </div>

            <h1>
              Manage <em>Requests</em>
            </h1>

            <p>
              Review college requirements, manage priorities and control
              incoming training requests.
            </p>
          </div>

          <div className="mr-header-actions">
            <div className="mr-header-date">
              <CalendarDays size={17} />
              {new Date().toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>

            <button
              type="button"
              className="mr-button secondary"
              onClick={handleExport}
            >
              <Download size={16} />
              Export Report
            </button>

            <button
              type="button"
              className="mr-button primary"
              onClick={openCreateModal}
            >
              <Plus size={17} />
              Create Request
            </button>
          </div>
        </div>
      </motion.section>

      {/* STAT CARDS */}

      <section
        className="mr-stats-grid"
        aria-label="Request statistics"
      >
        {stats.map((stat, index) => (
          <StatCard
            key={stat.title}
            {...stat}
            index={index}
          />
        ))}
      </section>

      {/* REQUEST TABLE CARD */}

      <motion.section
        className="mr-card"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="mr-card-heading">
          <div className="mr-heading-left">
            <div className="mr-heading-icon">
              <ClipboardList size={21} />
            </div>

            <div>
              <h2>All Requests</h2>
              <p>
                Review submissions and manage college requirements.
              </p>
            </div>
          </div>

          <span className="mr-record-count">
            <i />
            {formatNumber(filteredRequests.length)} records
          </span>
        </div>

        {/* TOOLBAR */}

        <div className="mr-toolbar">
          <div className="mr-search-box">
            <Search size={18} />

            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search requests, colleges, programs..."
              aria-label="Search requests"
              autoComplete="off"
            />

            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                aria-label="Clear search"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="mr-toolbar-filters">
            <div className="mr-filter-select">
              <PremiumSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={STATUS_OPTIONS}
                searchable={false}
              />
            </div>

            <div className="mr-filter-select">
              <PremiumSelect
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={PRIORITY_OPTIONS}
                searchable={false}
              />
            </div>

            <div className="mr-filter-select">
              <PremiumSelect
                value={dateFilter}
                onChange={setDateFilter}
                options={DATE_OPTIONS}
                searchable={false}
              />
            </div>

            <div className="mr-sort-select">
              <ArrowDownUp size={17} />

              <PremiumSelect
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
                searchable={false}
              />
            </div>
          </div>
        </div>

        {/* ACTIVE FILTERS */}

        {hasActiveFilters && (
          <div className="mr-active-filters">
            <span className="mr-active-label">
              <Filter size={15} />
              Active filters
            </span>

            {search && (
              <button
                type="button"
                className="mr-filter-chip"
                onClick={() => setSearch("")}
              >
                Search: {search}
                <X size={13} />
              </button>
            )}

            {statusFilter !== "All" && (
              <button
                type="button"
                className="mr-filter-chip"
                onClick={() => setStatusFilter("All")}
              >
                {statusFilter}
                <X size={13} />
              </button>
            )}

            {priorityFilter !== "All" && (
              <button
                type="button"
                className="mr-filter-chip"
                onClick={() => setPriorityFilter("All")}
              >
                {priorityFilter} Priority
                <X size={13} />
              </button>
            )}

            {dateFilter !== "All" && (
              <button
                type="button"
                className="mr-filter-chip"
                onClick={() => setDateFilter("All")}
              >
                {dateFilter}
                <X size={13} />
              </button>
            )}

            <button
              type="button"
              className="mr-clear-filters"
              onClick={resetFilters}
            >
              Clear all
            </button>
          </div>
        )}

        {/* DESKTOP TABLE */}

        <div className="mr-table-wrap mr-scrollbar">
          <table className="mr-table">
            <thead>
              <tr>
                <th>REQUEST DETAILS</th>
                <th>COLLEGE</th>
                <th>PROGRAM</th>
                <th>STUDENTS</th>
                <th>PRIORITY</th>
                <th>SUBMITTED</th>
                <th>STATUS</th>
                <th className="mr-action-heading">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request, index) => (
                  <motion.tr
                    key={request.id}
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.22,
                      delay: Math.min(index * 0.03, 0.18),
                    }}
                  >
                    <td>
                      <div className="mr-request-cell">
                        <div className="mr-request-icon">
                          <FileText size={20} />
                        </div>

                        <div className="mr-request-copy">
                          <button
                            type="button"
                            className="mr-request-title"
                            onClick={() =>
                              setSelectedRequest(request)
                            }
                          >
                            {request.title}
                          </button>

                          <span>{request.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="mr-college-cell">
                        <strong>{request.college}</strong>
                        <span>
                          <UserRound size={14} />
                          {request.requestedBy}
                        </span>
                      </div>
                    </td>

                    <td>
                      <div className="mr-program-cell">
                        <strong>{request.program}</strong>
                        <span>{request.type}</span>
                      </div>
                    </td>

                    <td>
                      <div className="mr-students-cell">
                        <Users size={16} />
                        <strong>
                          {formatNumber(request.students)}
                        </strong>
                      </div>
                    </td>

                    <td>
                      <PriorityBadge
                        priority={request.priority}
                      />
                    </td>

                    <td>
                      <div className="mr-date-cell">
                        <CalendarDays size={15} />
                        {formatDate(request.date)}
                      </div>
                    </td>

                    <td>
                      <StatusBadge status={request.status} />
                    </td>

                    <td>
                      <div className="mr-row-actions">
                        <IconAction
                          icon={Eye}
                          label="View details"
                          onClick={() =>
                            setSelectedRequest(request)
                          }
                        />

                        <IconAction
                          icon={Pencil}
                          label="Edit request"
                          onClick={() => openEditModal(request)}
                        />

                        <IconAction
                          icon={Trash2}
                          label="Delete request"
                          danger
                          onClick={() => handleDelete(request)}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="mr-empty">
                      <div className="mr-empty-icon">
                        <ClipboardList size={29} />
                      </div>

                      <h3>No requests found</h3>

                      <p>
                        Try changing your filters or create a new
                        request.
                      </p>

                      {hasActiveFilters ? (
                        <button
                          type="button"
                          className="mr-button secondary"
                          onClick={resetFilters}
                        >
                          <RefreshCw size={16} />
                          Reset Filters
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="mr-button primary"
                          onClick={openCreateModal}
                        >
                          <Plus size={16} />
                          Create Request
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* MOBILE CARDS */}

        <div className="mr-mobile-list">
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <article
                className="mr-mobile-card"
                key={request.id}
              >
                <div className="mr-mobile-top">
                  <div className="mr-request-icon">
                    <FileText size={19} />
                  </div>

                  <div className="mr-mobile-title">
                    <h3>{request.title}</h3>
                    <span>{request.id}</span>
                  </div>

                  <StatusBadge status={request.status} />
                </div>

                <div className="mr-mobile-meta">
                  <span>
                    <Building2 size={15} />
                    {request.college}
                  </span>

                  <span>
                    <GraduationCap size={15} />
                    {request.program}
                  </span>

                  <span>
                    <Users size={15} />
                    {formatNumber(request.students)} students
                  </span>

                  <span>
                    <CalendarDays size={15} />
                    {formatDate(request.date)}
                  </span>
                </div>

                <div className="mr-mobile-bottom">
                  <PriorityBadge priority={request.priority} />

                  <div className="mr-row-actions">
                    <IconAction
                      icon={Eye}
                      label="View details"
                      onClick={() =>
                        setSelectedRequest(request)
                      }
                    />

                    <IconAction
                      icon={Pencil}
                      label="Edit request"
                      onClick={() => openEditModal(request)}
                    />

                    <IconAction
                      icon={Trash2}
                      label="Delete request"
                      danger
                      onClick={() => handleDelete(request)}
                    />
                  </div>
                </div>
              </article>
            ))
          ) : (
            <div className="mr-mobile-empty">
              <ClipboardList size={27} />
              <strong>No requests found</strong>
              <span>Try changing your filters.</span>
            </div>
          )}
        </div>

        {/* TABLE FOOTER */}

        <div className="mr-table-footer">
          <span>
            Showing{" "}
            <strong>{formatNumber(filteredRequests.length)}</strong>
            {" "}of{" "}
            <strong>{formatNumber(requests.length)}</strong>
            {" "}requests
          </span>

          <span className="mr-saved-indicator">
            <i />
            Changes saved locally
          </span>
        </div>
      </motion.section>

      {/* INFORMATION STRIP */}

      <div className="mr-info-strip">
        <div className="mr-info-icon">
          <Sparkles size={19} />
        </div>

        <div>
          <strong>Keep every request under control</strong>
          <p>
            Review incoming requirements, manage priorities and keep
            college coordination organized.
          </p>
        </div>

        <ClipboardList
          className="mr-info-decoration"
          size={43}
        />
      </div>

      {/* ===================================================
          CREATE / EDIT MODAL
      =================================================== */}

      {createPortal(
        <AnimatePresence>
          {modalOpen && (
            <motion.div
              className="mr-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  closeFormModal();
                }
              }}
            >
              <motion.div
                className="mr-modal mr-form-modal"
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.985 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mr-modal-header">
                  <div className="mr-modal-heading">
                    <div className="mr-modal-heading-icon">
                      {editingId ? (
                        <Pencil size={21} />
                      ) : (
                        <Plus size={23} />
                      )}
                    </div>

                    <div>
                      <small>REQUEST MANAGEMENT</small>

                      <h2>
                        {editingId
                          ? "Edit Request"
                          : "Create New Request"}
                      </h2>

                      <p>
                        {editingId
                          ? "Update college requirement details."
                          : "Add a new college training requirement."}
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="mr-close"
                    onClick={closeFormModal}
                    aria-label="Close modal"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSave}>
                  <div className="mr-modal-body mr-scrollbar">
                    {/* SECTION 1 */}

                    <div className="mr-form-section">
                      <div className="mr-form-section-title">
                        <span>01</span>
                        Request Information
                      </div>

                      <div className="mr-form-grid">
                        <Field
                          label="Request Title"
                          required
                          className="span-2"
                        >
                          <input
                            className="mr-input"
                            value={form.title}
                            onChange={(event) =>
                              updateForm(
                                "title",
                                event.target.value
                              )
                            }
                            placeholder="e.g. Full Stack Development Training"
                            required
                          />
                        </Field>

                        <Field label="College" required>
                          <PremiumSelect
                            value={form.college}
                            onChange={(value) =>
                              updateForm("college", value)
                            }
                            options={COLLEGES}
                            placeholder="Select college"
                          />
                        </Field>

                        <Field label="Program" required>
                          <PremiumSelect
                            value={form.program}
                            onChange={(value) =>
                              updateForm("program", value)
                            }
                            options={PROGRAMS}
                            placeholder="Select program"
                          />
                        </Field>

                        <Field label="Request Type">
                          <PremiumSelect
                            value={form.type}
                            onChange={(value) =>
                              updateForm("type", value)
                            }
                            options={REQUEST_TYPES}
                            searchable={false}
                          />
                        </Field>

                        <Field label="Expected Students">
                          <input
                            className="mr-input"
                            type="number"
                            min="0"
                            value={form.students}
                            onChange={(event) =>
                              updateForm(
                                "students",
                                event.target.value
                              )
                            }
                            placeholder="50"
                          />
                        </Field>

                        <Field label="Program Duration">
                          <input
                            className="mr-input"
                            value={form.duration}
                            onChange={(event) =>
                              updateForm(
                                "duration",
                                event.target.value
                              )
                            }
                            placeholder="e.g. 8 Weeks"
                          />
                        </Field>

                        <Field label="Estimated Budget (₹)">
                          <input
                            className="mr-input"
                            type="number"
                            min="0"
                            value={form.budget}
                            onChange={(event) =>
                              updateForm(
                                "budget",
                                event.target.value
                              )
                            }
                            placeholder="50000"
                          />
                        </Field>
                      </div>
                    </div>

                    {/* SECTION 2 */}

                    <div className="mr-form-section">
                      <div className="mr-form-section-title">
                        <span>02</span>
                        Priority & Review
                      </div>

                      <div className="mr-form-grid">
                        <Field label="Priority">
                          <PremiumSelect
                            value={form.priority}
                            onChange={(value) =>
                              updateForm("priority", value)
                            }
                            options={PRIORITIES}
                            searchable={false}
                          />
                        </Field>

                        <Field label="Request Status">
                          <PremiumSelect
                            value={form.status}
                            onChange={(value) =>
                              updateForm("status", value)
                            }
                            options={REQUEST_STATUSES}
                            searchable={false}
                          />
                        </Field>

                        <Field label="Submission Date" required>
                          <input
                            className="mr-input"
                            type="date"
                            value={form.date}
                            onChange={(event) =>
                              updateForm("date", event.target.value)
                            }
                            required
                          />
                        </Field>

                        <Field label="Requested By" required>
                          <input
                            className="mr-input"
                            value={form.requestedBy}
                            onChange={(event) =>
                              updateForm(
                                "requestedBy",
                                event.target.value
                              )
                            }
                            placeholder="Contact person's name"
                            required
                          />
                        </Field>
                      </div>
                    </div>

                    {/* SECTION 3 */}

                    <div className="mr-form-section">
                      <div className="mr-form-section-title">
                        <span>03</span>
                        College Contact
                      </div>

                      <div className="mr-form-grid">
                        <Field label="Contact Email" required>
                          <input
                            className="mr-input"
                            type="email"
                            value={form.email}
                            onChange={(event) =>
                              updateForm("email", event.target.value)
                            }
                            placeholder="name@college.edu"
                            required
                          />
                        </Field>

                        <Field label="Contact Phone">
                          <input
                            className="mr-input"
                            type="tel"
                            value={form.phone}
                            onChange={(event) =>
                              updateForm("phone", event.target.value)
                            }
                            placeholder="Phone number"
                          />
                        </Field>

                        <Field
                          label="Requirement Description"
                          required
                          className="span-2"
                        >
                          <textarea
                            className="mr-textarea"
                            rows={4}
                            value={form.description}
                            onChange={(event) =>
                              updateForm(
                                "description",
                                event.target.value
                              )
                            }
                            placeholder="Describe the college's training requirements..."
                            required
                          />
                        </Field>

                        <Field
                          label="Internal Admin Notes"
                          className="span-2"
                        >
                          <textarea
                            className="mr-textarea"
                            rows={3}
                            value={form.notes}
                            onChange={(event) =>
                              updateForm("notes", event.target.value)
                            }
                            placeholder="Add internal notes for the admin team..."
                          />
                        </Field>
                      </div>
                    </div>
                  </div>

                  <div className="mr-modal-footer">
                    <span className="mr-required-note">
                      <b>*</b> Required fields
                    </span>

                    <div className="mr-modal-footer-actions">
                      <button
                        type="button"
                        className="mr-button secondary"
                        onClick={closeFormModal}
                      >
                        Cancel
                      </button>

                      <button
                        type="submit"
                        className="mr-button primary"
                      >
                        {editingId ? (
                          <Check size={17} />
                        ) : (
                          <Plus size={18} />
                        )}

                        {editingId
                          ? "Save Changes"
                          : "Create Request"}
                      </button>
                    </div>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* ===================================================
          REQUEST DETAILS MODAL
      =================================================== */}

      {createPortal(
        <AnimatePresence>
          {selectedRequest && (
            <motion.div
              className="mr-modal-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setSelectedRequest(null);
                }
              }}
            >
              <motion.div
                className="mr-modal mr-detail-modal"
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.985 }}
                transition={{ duration: 0.2 }}
              >
                <div className="mr-detail-top">
                  <button
                    type="button"
                    className="mr-close mr-detail-close"
                    onClick={() => setSelectedRequest(null)}
                    aria-label="Close details"
                  >
                    <X size={20} />
                  </button>

                  <div className="mr-detail-icon">
                    <ClipboardList size={25} />
                  </div>

                  <small>REQUEST DETAILS</small>

                  <h2>{selectedRequest.title}</h2>

                  <p>{selectedRequest.id}</p>

                  <div className="mr-detail-badges">
                    <StatusBadge status={selectedRequest.status} />
                    <PriorityBadge priority={selectedRequest.priority} />
                  </div>
                </div>

                <div className="mr-detail-body mr-scrollbar">
                  <div className="mr-detail-grid">
                    <div className="mr-detail-item">
                      <span>
                        <Building2 size={18} />
                      </span>
                      <div>
                        <small>College</small>
                        <strong>{selectedRequest.college}</strong>
                      </div>
                    </div>

                    <div className="mr-detail-item">
                      <span>
                        <GraduationCap size={18} />
                      </span>
                      <div>
                        <small>Program</small>
                        <strong>{selectedRequest.program}</strong>
                      </div>
                    </div>

                    <div className="mr-detail-item">
                      <span>
                        <Users size={18} />
                      </span>
                      <div>
                        <small>Expected Students</small>
                        <strong>
                          {formatNumber(selectedRequest.students)}
                        </strong>
                      </div>
                    </div>

                    <div className="mr-detail-item">
                      <span>
                        <CalendarDays size={18} />
                      </span>
                      <div>
                        <small>Submission Date</small>
                        <strong>
                          {formatDate(selectedRequest.date)}
                        </strong>
                      </div>
                    </div>

                    <div className="mr-detail-item">
                      <span>
                        <Clock3 size={18} />
                      </span>
                      <div>
                        <small>Program Duration</small>
                        <strong>
                          {selectedRequest.duration || "Not specified"}
                        </strong>
                      </div>
                    </div>

                    <div className="mr-detail-item">
                      <span>
                        <CircleDollarSign size={18} />
                      </span>
                      <div>
                        <small>Estimated Budget</small>
                        <strong>
                          {formatCurrency(selectedRequest.budget)}
                        </strong>
                      </div>
                    </div>

                    <div className="mr-detail-item">
                      <span>
                        <FileText size={18} />
                      </span>
                      <div>
                        <small>Request Type</small>
                        <strong>{selectedRequest.type}</strong>
                      </div>
                    </div>

                    <div className="mr-detail-item">
                      <span>
                        <UserRound size={18} />
                      </span>
                      <div>
                        <small>Requested By</small>
                        <strong>{selectedRequest.requestedBy}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="mr-detail-section">
                    <h3>Requirement Description</h3>
                    <p>
                      {selectedRequest.description ||
                        "No description provided."}
                    </p>
                  </div>

                  <div className="mr-detail-section">
                    <h3>College Contact</h3>

                    <div className="mr-contact-list">
                      <span>
                        <UserRound size={17} />
                        {selectedRequest.requestedBy || "Not provided"}
                      </span>

                      <span>
                        <Mail size={17} />
                        {selectedRequest.email || "Not provided"}
                      </span>

                      <span>
                        <Phone size={17} />
                        {selectedRequest.phone || "Not provided"}
                      </span>
                    </div>
                  </div>

                  {selectedRequest.notes && (
                    <div className="mr-detail-section">
                      <h3>Internal Admin Notes</h3>
                      <p>{selectedRequest.notes}</p>
                    </div>
                  )}
                </div>

                <div className="mr-detail-footer">
                  <div className="mr-status-control">
                    <span>Update Status</span>

                    <PremiumSelect
                      value={selectedRequest.status}
                      onChange={(value) =>
                        handleStatusUpdate(selectedRequest, value)
                      }
                      options={REQUEST_STATUSES}
                      searchable={false}
                    />
                  </div>

                  <div className="mr-detail-actions">
                    <button
                      type="button"
                      className="mr-button secondary"
                      onClick={() => handleDelete(selectedRequest)}
                    >
                      <Trash2 size={16} />
                      Delete
                    </button>

                    <button
                      type="button"
                      className="mr-button primary"
                      onClick={() => openEditModal(selectedRequest)}
                    >
                      <Pencil size={16} />
                      Edit Request
                    </button>
                  </div>

                  <div className="mr-quick-actions">
                    <button
                      type="button"
                      className="mr-quick-approve"
                      onClick={() =>
                        handleStatusUpdate(
                          selectedRequest,
                          "Approved"
                        )
                      }
                    >
                      <CheckCircle2 size={16} />
                      Approve
                    </button>

                    <button
                      type="button"
                      className="mr-quick-review"
                      onClick={() =>
                        handleStatusUpdate(
                          selectedRequest,
                          "Under Review"
                        )
                      }
                    >
                      <Clock3 size={16} />
                      Under Review
                    </button>

                    <button
                      type="button"
                      className="mr-quick-reject"
                      onClick={() =>
                        handleStatusUpdate(
                          selectedRequest,
                          "Rejected"
                        )
                      }
                    >
                      <Ban size={16} />
                      Reject
                    </button>

                    <button
                      type="button"
                      className="mr-quick-hold"
                      onClick={() =>
                        handleStatusUpdate(
                          selectedRequest,
                          "On Hold"
                        )
                      }
                    >
                      <PauseCircle size={16} />
                      Hold
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}

      {/* TOAST */}

      <AnimatePresence>
        {toast && (
          <motion.div
            className="mr-toast"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
          >
            <span>
              <Check size={17} />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   PREMIUM CSS — ADMIN DASHBOARD SCALE
========================================================= */

const PAGE_STYLES = `
.mr-page {
  --mr-orange: #F4512B;
  --mr-orange-dark: #DF3F1C;
  --mr-orange-light: #FFF0EA;
  --mr-orange-soft: #FFF8F5;
  --mr-background: #F7F7F7;
  --mr-border: #EAEAEA;
  --mr-heading: #292929;
  --mr-text: #555555;
  --mr-muted: #858585;

  width: 100%;
  min-width: 0;
  padding: 2px 2px 30px;
  color: var(--mr-heading);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  position: relative;
}

.mr-page *,
.mr-page *::before,
.mr-page *::after {
  box-sizing: border-box;
}

.mr-page button,
.mr-page input,
.mr-page textarea {
  font: inherit;
}

.mr-page button {
  cursor: pointer;
}

.mr-page button:focus-visible,
.mr-page input:focus-visible,
.mr-page textarea:focus-visible {
  outline: 3px solid rgba(244,81,43,.15);
  outline-offset: 2px;
}

/* SCROLLBAR */

.mr-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #F58B70 #FFF0EA;
}

.mr-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}

.mr-scrollbar::-webkit-scrollbar-track {
  background: #FFF0EA;
  border-radius: 20px;
}

.mr-scrollbar::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,#FFAD94,#F4512B);
  border: 2px solid #FFF0EA;
  border-radius: 20px;
}

.mr-scrollbar::-webkit-scrollbar-thumb:hover {
  background: #DF3F1C;
}

/* PAGE HEADER */

.mr-page-header {
  margin-bottom: 24px;
}

.mr-breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 18px;
  color: #858585;
  font-size: 12px;
  font-weight: 600;
}

.mr-breadcrumb strong {
  color: #444444;
  font-weight: 700;
}

.mr-header-main {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
}

.mr-eyebrow {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 9px;
  color: #E94B27;
  font-size: 11px;
  font-weight: 800;
  letter-spacing: .15em;
}

.mr-eyebrow span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #F4512B;
}

.mr-header-main h1 {
  margin: 0;
  color: #292929;
  font-size: 30px;
  font-weight: 750;
  line-height: 1.2;
  letter-spacing: -1px;
}

.mr-header-main h1 em {
  color: #F4512B;
  font-style: normal;
}

.mr-header-main > div:first-child > p {
  max-width: 670px;
  margin: 9px 0 0;
  color: #626262;
  font-size: 13px;
  line-height: 24px;
}

.mr-header-actions {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
  flex-shrink: 0;
}

.mr-header-date {
  height: 44px;
  padding: 0 14px;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  color: #444444;
  background: white;
  border: 1px solid #EAEAEA;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 650;
  white-space: nowrap;
}

.mr-header-date svg {
  color: #F4512B;
}

/* BUTTONS */

.mr-button {
  min-height: 44px;
  padding: 0 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
  border: 1px solid transparent;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 750;
  white-space: nowrap;
  transition: all .2s ease;
}

.mr-button.primary {
  color: #FFFFFF;
  background: #F4512B;
  border-color: #F4512B;
  box-shadow: 0 3px 9px rgba(244,81,43,.12);
}

.mr-button.primary:hover {
  background: #DF3F1C;
  border-color: #DF3F1C;
  box-shadow: 0 6px 15px rgba(244,81,43,.2);
  transform: translateY(-1px);
}

.mr-button.secondary {
  color: #444444;
  background: #FFFFFF;
  border-color: #EAEAEA;
}

.mr-button.secondary:hover {
  color: #E94B27;
  background: #FFF8F5;
  border-color: #F2B3A3;
}

/* STAT CARDS */

.mr-stats-grid {
  display: grid;
  grid-template-columns: repeat(4,minmax(0,1fr));
  gap: 16px;
  margin-bottom: 22px;
}

.mr-stat-card {
  min-width: 0;
  min-height: 150px;
  padding: 20px;
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,.015);
  transition: box-shadow .2s ease;
}

.mr-stat-card:hover {
  box-shadow: 0 12px 30px rgba(0,0,0,.055);
}

.mr-stat-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 12px;
}

.mr-stat-top > div:first-child {
  min-width: 0;
}

.mr-stat-title {
  margin: 0;
  color: #656565;
  font-size: 13px;
  font-weight: 550;
}

.mr-stat-value {
  display: block;
  margin-top: 11px;
  color: #292929;
  font-size: 28px;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -.8px;
}

.mr-stat-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 13px;
}

.mr-stat-icon.orange {
  color: #F4512B;
  background: #FFF0EA;
}

.mr-stat-icon.amber {
  color: #A36B16;
  background: #FFF5DF;
}

.mr-stat-icon.green {
  color: #218354;
  background: #EAF7EE;
}

.mr-stat-icon.purple {
  color: #8058BE;
  background: #F4EEFF;
}

.mr-stat-bottom {
  margin-top: 14px;
  padding-top: 11px;
  border-top: 1px solid #F1F1F1;
}

.mr-stat-live {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: #777777;
  font-size: 11px;
  font-weight: 550;
}

.mr-stat-live svg {
  color: #218354;
}

/* MAIN CARD */

.mr-card {
  position: relative;
  overflow: visible;
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 16px;
  box-shadow: 0 2px 10px rgba(0,0,0,.015);
}

.mr-card-heading {
  min-height: 80px;
  padding: 17px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid #EAEAEA;
}

.mr-heading-left {
  display: flex;
  align-items: center;
  gap: 13px;
}

.mr-heading-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F4512B;
  background: #FFF0EA;
  border-radius: 12px;
}

.mr-card-heading h2 {
  margin: 0;
  color: #292929;
  font-size: 16px;
  font-weight: 750;
  letter-spacing: -.2px;
}

.mr-card-heading p {
  margin: 5px 0 0;
  color: #777777;
  font-size: 12px;
  line-height: 1.5;
}

.mr-record-count {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  color: #555555;
  background: #FAFAFA;
  border: 1px solid #EAEAEA;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.mr-record-count i {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #228653;
}

/* TOOLBAR */

.mr-toolbar {
  position: relative;
  z-index: 10;
  padding: 16px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 14px;
  border-bottom: 1px solid #EAEAEA;
}

.mr-search-box {
  min-width: 230px;
  max-width: 380px;
  height: 44px;
  flex: 1;
  padding: 0 13px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #777777;
  background: white;
  border: 1px solid #EAEAEA;
  border-radius: 12px;
  transition: all .2s ease;
}

.mr-search-box:focus-within {
  border-color: #F4512B;
  box-shadow: 0 0 0 4px #FFF0EA;
}

.mr-search-box input {
  width: 100%;
  min-width: 0;
  color: #292929;
  background: transparent;
  border: 0;
  outline: none;
  font-size: 13px;
  font-weight: 500;
}

.mr-search-box input::placeholder {
  color: #858585;
  font-size: 12px;
}

.mr-search-box > button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 3px;
  color: #858585;
  background: transparent;
  border: 0;
}

.mr-search-box > button:hover {
  color: #F4512B;
}

.mr-toolbar-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 10px;
}

.mr-filter-select {
  width: 145px;
}

.mr-sort-select {
  width: 190px;
  padding-left: 11px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #777777;
  border-left: 1px solid #EAEAEA;
}

.mr-sort-select .mr-select-trigger {
  padding-left: 4px;
}

/* CUSTOM SELECT */

.mr-select-trigger {
  width: 100%;
  min-width: 0;
  min-height: 44px;
  padding: 0 13px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  color: #444444;
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 12px;
  text-align: left;
  font-size: 13px;
  font-weight: 650;
  transition: all .2s ease;
}

.mr-select-trigger:hover {
  border-color: #F2B3A3;
  background: #FFFDFB;
}

.mr-select-trigger.is-open {
  border-color: #F4512B;
  box-shadow: 0 0 0 4px #FFF0EA;
}

.mr-select-trigger.is-disabled {
  opacity: .55;
  cursor: not-allowed;
}

.mr-select-value,
.mr-select-placeholder {
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mr-select-value {
  color: #343434;
}

.mr-select-placeholder {
  color: #858585;
}

.mr-select-chevron {
  flex-shrink: 0;
  color: #777777;
  transition: transform .2s ease;
}

.mr-select-chevron.rotated {
  color: #F4512B;
  transform: rotate(180deg);
}

/* DROPDOWN MENU */

.mr-dropdown {
  padding: 8px;
  overflow: hidden;
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 15px;
  box-shadow:
    0 18px 55px rgba(15,23,42,.18),
    0 5px 15px rgba(15,23,42,.08);
}

.mr-dropdown-search {
  min-height: 42px;
  margin-bottom: 7px;
  padding: 0 11px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #858585;
  background: #FAFAFA;
  border: 1px solid #EAEAEA;
  border-radius: 10px;
}

.mr-dropdown-search input {
  width: 100%;
  min-width: 0;
  color: #292929;
  background: transparent;
  border: 0;
  outline: none;
  font-size: 13px;
}

.mr-dropdown-search input::placeholder {
  color: #858585;
}

.mr-dropdown-search button {
  padding: 3px;
  display: flex;
  color: #858585;
  background: transparent;
  border: 0;
}

.mr-dropdown-list {
  min-height: 0;
  flex: 1;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2px;
}

.mr-dropdown-list::-webkit-scrollbar {
  width: 8px;
}

.mr-dropdown-list::-webkit-scrollbar-track {
  background: #FFF5F0;
  border-radius: 20px;
}

.mr-dropdown-list::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg,#FDBA9A,#F4512B);
  border: 2px solid #FFF5F0;
  border-radius: 20px;
}

.mr-dropdown-list::-webkit-scrollbar-thumb:hover {
  background: #DF3F1C;
}

.mr-dropdown-option {
  width: 100%;
  min-height: 43px;
  padding: 8px 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #343434;
  background: transparent;
  border: 0;
  border-radius: 9px;
  text-align: left;
  transition: all .15s ease;
}

.mr-dropdown-option:hover {
  color: #F4512B;
  background: #FFF8F5;
}

.mr-dropdown-option.active {
  color: #DF3F1C;
  background: #FFF0EA;
}

.mr-option-indicator {
  width: 27px;
  height: 27px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F4512B;
  background: #FFFFFF;
  border: 1px solid #F3E4DE;
  border-radius: 8px;
}

.mr-option-indicator > span {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #B6B6B6;
}

.mr-dropdown-option.active .mr-option-indicator {
  border-color: #FFD4C6;
}

.mr-option-label {
  min-width: 0;
  flex: 1;
  font-size: 13px;
  font-weight: 600;
  line-height: 1.4;
  overflow-wrap: anywhere;
}

.mr-option-selected {
  color: #F4512B;
  font-size: 9px;
  font-weight: 800;
  letter-spacing: .06em;
  text-transform: uppercase;
}

.mr-dropdown-empty {
  min-height: 130px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: #A0A0A0;
}

.mr-dropdown-empty strong {
  color: #555555;
  font-size: 13px;
}

.mr-dropdown-empty span {
  font-size: 11px;
}

.mr-dropdown-footer {
  min-height: 32px;
  margin-top: 6px;
  padding: 7px 5px 1px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #858585;
  border-top: 1px solid #EEEEEE;
  font-size: 10px;
  font-weight: 600;
}

/* ACTIVE FILTERS */

.mr-active-filters {
  min-height: 45px;
  padding: 9px 22px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
  background: #FFF9F6;
  border-bottom: 1px solid #F3E6E0;
}

.mr-active-label {
  margin-right: 3px;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #666666;
  font-size: 11px;
  font-weight: 750;
}

.mr-filter-chip {
  min-height: 30px;
  padding: 5px 10px;
  display: flex;
  align-items: center;
  gap: 7px;
  color: #C94C2D;
  background: #FFFFFF;
  border: 1px solid #F6D6CB;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 650;
}

.mr-filter-chip:hover {
  background: #FFF0EA;
}

.mr-clear-filters {
  padding: 6px 8px;
  color: #777777;
  background: transparent;
  border: 0;
  font-size: 11px;
  font-weight: 750;
}

.mr-clear-filters:hover {
  color: #F4512B;
}

/* DESKTOP TABLE */

.mr-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.mr-table {
  width: 100%;
  min-width: 1180px;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
}

.mr-table thead th {
  height: 49px;
  padding: 0 13px;
  color: #555555;
  background: #FAFAFA;
  border-bottom: 1px solid #EAEAEA;
  font-size: 11px;
  font-weight: 750;
  letter-spacing: .045em;
  white-space: nowrap;
}

.mr-table thead th:first-child,
.mr-table tbody td:first-child {
  padding-left: 22px;
}

.mr-table thead th:last-child,
.mr-table tbody td:last-child {
  padding-right: 22px;
}

.mr-table tbody td {
  height: 82px;
  padding: 13px;
  color: #555555;
  border-bottom: 1px solid #F0F0F0;
  font-size: 12px;
  vertical-align: middle;
}

.mr-table tbody tr {
  transition: background .16s ease;
}

.mr-table tbody tr:hover {
  background: #FFFAF8;
}

.mr-table tbody tr:last-child td {
  border-bottom: 0;
}

.mr-action-heading {
  text-align: right;
}

/* REQUEST CELL */

.mr-request-cell {
  min-width: 220px;
  display: flex;
  align-items: center;
  gap: 11px;
}

.mr-request-icon {
  width: 41px;
  height: 41px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F4512B;
  background: #FFF0EA;
  border: 1px solid #FFE0D5;
  border-radius: 11px;
}

.mr-request-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mr-request-title {
  max-width: 235px;
  padding: 0;
  color: #292929;
  background: transparent;
  border: 0;
  text-align: left;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.4;
}

.mr-request-title:hover {
  color: #E94B27;
}

.mr-request-copy > span {
  color: #777777;
  font-size: 11px;
  font-weight: 600;
}

/* COLLEGE */

.mr-college-cell {
  min-width: 180px;
  max-width: 205px;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.mr-college-cell strong {
  color: #333333;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.5;
}

.mr-college-cell span {
  display: flex;
  align-items: center;
  gap: 6px;
  color: #777777;
  font-size: 11px;
}

.mr-college-cell svg {
  flex-shrink: 0;
  color: #F4512B;
}

/* PROGRAM */

.mr-program-cell {
  min-width: 145px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.mr-program-cell strong {
  color: #444444;
  font-size: 12px;
  font-weight: 650;
  line-height: 1.4;
}

.mr-program-cell span {
  color: #858585;
  font-size: 11px;
}

/* STUDENTS */

.mr-students-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #E97B5D;
}

.mr-students-cell strong {
  color: #333333;
  font-size: 13px;
  font-weight: 750;
}

/* DATE */

.mr-date-cell {
  min-width: 125px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555555;
  font-size: 12px;
  white-space: nowrap;
}

.mr-date-cell svg {
  flex-shrink: 0;
  color: #F4512B;
}

/* PRIORITY BADGES */

.mr-priority {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.mr-priority > span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
}

.mr-priority.high {
  color: #B83F3F;
  background: #FFF0F0;
}

.mr-priority.high > span {
  background: #D95C5C;
}

.mr-priority.medium {
  color: #986A15;
  background: #FFF5DF;
}

.mr-priority.medium > span {
  background: #D99C30;
}

.mr-priority.low {
  color: #218354;
  background: #EAF7EE;
}

.mr-priority.low > span {
  background: #3B9B76;
}

/* STATUS BADGES */

.mr-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  padding: 7px 11px;
  border-radius: 30px;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.mr-status-dot {
  width: 7px;
  height: 7px;
  flex-shrink: 0;
  border-radius: 50%;
}

.mr-status-badge.pending {
  color: #A36B16;
  background: #FFF5DF;
}

.mr-status-badge.pending .mr-status-dot {
  background: #D99727;
}

.mr-status-badge.review {
  color: #3478C7;
  background: #EDF5FF;
}

.mr-status-badge.review .mr-status-dot {
  background: #3979D8;
}

.mr-status-badge.approved {
  color: #218354;
  background: #EAF7EE;
}

.mr-status-badge.approved .mr-status-dot {
  background: #26966A;
}

.mr-status-badge.rejected {
  color: #B94343;
  background: #FFF0F0;
}

.mr-status-badge.rejected .mr-status-dot {
  background: #D95C5C;
}

.mr-status-badge.hold {
  color: #8058BE;
  background: #F4EEFF;
}

.mr-status-badge.hold .mr-status-dot {
  background: #8B70BD;
}

/* ROW ACTIONS */

.mr-row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
}

.mr-icon-action {
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #777777;
  background: transparent;
  border: 1px solid transparent;
  border-radius: 9px;
  transition: all .16s ease;
}

.mr-icon-action:hover {
  color: #E94B27;
  background: #FFF0EA;
  border-color: #FFE0D5;
}

.mr-icon-action.danger:hover {
  color: #C94343;
  background: #FFF0F0;
  border-color: #FFDDDD;
}

/* EMPTY STATE */

.mr-empty {
  min-height: 285px;
  padding: 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.mr-empty-icon {
  width: 58px;
  height: 58px;
  margin-bottom: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F4512B;
  background: #FFF0EA;
  border-radius: 16px;
}

.mr-empty h3 {
  margin: 0;
  color: #333333;
  font-size: 16px;
  font-weight: 750;
}

.mr-empty p {
  max-width: 400px;
  margin: 9px 0 18px;
  color: #777777;
  font-size: 13px;
  line-height: 1.6;
}

/* TABLE FOOTER */

.mr-table-footer {
  min-height: 52px;
  padding: 0 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  color: #666666;
  border-top: 1px solid #EAEAEA;
  font-size: 12px;
}

.mr-table-footer strong {
  color: #292929;
  font-weight: 750;
}

.mr-saved-indicator {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #777777;
  font-size: 11px;
  font-weight: 550;
}

.mr-saved-indicator i {
  width: 7px;
  height: 7px;
  display: inline-block;
  border-radius: 50%;
  background: #228653;
}

/* INFO STRIP */

.mr-info-strip {
  min-height: 86px;
  position: relative;
  overflow: hidden;
  margin-top: 18px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  background: linear-gradient(100deg,#FFF8F5 0%,#FFFFFF 58%,#FFF5F0 100%);
  border: 1px solid #F3E2DC;
  border-radius: 15px;
}

.mr-info-icon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F4512B;
  background: white;
  border: 1px solid #F3E2DC;
  border-radius: 12px;
}

.mr-info-strip strong {
  color: #444444;
  font-size: 13px;
  font-weight: 750;
}

.mr-info-strip p {
  margin: 5px 0 0;
  color: #777777;
  font-size: 12px;
  line-height: 1.55;
}

.mr-info-decoration {
  position: absolute;
  right: 27px;
  bottom: -11px;
  color: rgba(244,81,43,.12);
  transform: rotate(-12deg);
}

/* MODAL BACKDROP */

.mr-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99990;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(24,30,40,.48);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.mr-modal {
  width: min(100%,780px);
  max-height: min(92vh,920px);
  display: flex;
  flex-direction: column;
  overflow: visible;
  background: white;
  border: 1px solid rgba(255,255,255,.7);
  border-radius: 17px;
  box-shadow: 0 25px 85px rgba(22,29,40,.22);
}

/* MODAL HEADER */

.mr-modal-header {
  min-height: 91px;
  padding: 18px 23px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-bottom: 1px solid #EAEAEA;
}

.mr-modal-heading {
  display: flex;
  align-items: center;
  gap: 13px;
}

.mr-modal-heading-icon {
  width: 46px;
  height: 46px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F4512B;
  background: #FFF0EA;
  border: 1px solid #FFE1D6;
  border-radius: 13px;
}

.mr-modal-heading small {
  display: block;
  margin-bottom: 5px;
  color: #E94B27;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1px;
}

.mr-modal-heading h2 {
  margin: 0;
  color: #292929;
  font-size: 19px;
  font-weight: 750;
  letter-spacing: -.3px;
}

.mr-modal-heading p {
  margin: 5px 0 0;
  color: #777777;
  font-size: 12px;
}

.mr-close {
  width: 37px;
  height: 37px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #777777;
  background: white;
  border: 1px solid #EAEAEA;
  border-radius: 10px;
  transition: .17s ease;
}

.mr-close:hover {
  color: #DF3F1C;
  background: #FFF5F1;
  border-color: #FFD9CE;
}

/* MODAL BODY */

.mr-modal-body {
  min-height: 0;
  overflow-y: auto;
  overflow-x: visible;
  padding: 22px 24px;
}

.mr-form-section + .mr-form-section {
  margin-top: 25px;
  padding-top: 21px;
  border-top: 1px solid #EEEEEE;
}

.mr-form-section-title {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 17px;
  color: #333333;
  font-size: 14px;
  font-weight: 750;
}

.mr-form-section-title span {
  width: 27px;
  height: 27px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E94B27;
  background: #FFF0EA;
  border-radius: 8px;
  font-size: 11px;
  font-weight: 800;
}

.mr-form-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 17px 18px;
}

.mr-field {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mr-field.span-2 {
  grid-column: span 2;
}

.mr-field-label {
  color: #555555;
  font-size: 13px;
  font-weight: 650;
}

.mr-field-label span {
  margin-left: 4px;
  color: #E94B27;
}

.mr-input,
.mr-textarea {
  width: 100%;
  min-width: 0;
  color: #292929;
  background: #FFFFFF;
  border: 1px solid #EAEAEA;
  border-radius: 11px;
  outline: none;
  font-size: 13px;
  transition: all .2s ease;
}

.mr-input {
  height: 44px;
  padding: 0 13px;
}

.mr-textarea {
  min-height: 94px;
  padding: 12px 13px;
  resize: vertical;
  line-height: 1.6;
}

.mr-input:hover,
.mr-textarea:hover {
  border-color: #F2B3A3;
}

.mr-input:focus,
.mr-textarea:focus {
  border-color: #F4512B;
  box-shadow: 0 0 0 4px #FFF0EA;
}

.mr-input::placeholder,
.mr-textarea::placeholder {
  color: #858585;
  font-size: 12px;
}

.mr-field-hint {
  color: #858585;
  font-size: 11px;
  line-height: 1.5;
}

.mr-field .mr-select-trigger {
  min-height: 44px;
  font-size: 13px;
}

/* MODAL FOOTER */

.mr-modal-footer {
  min-height: 70px;
  padding: 12px 23px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  background: white;
  border-top: 1px solid #EAEAEA;
  border-radius: 0 0 17px 17px;
}

.mr-required-note {
  color: #777777;
  font-size: 11px;
}

.mr-required-note b {
  color: #E94B27;
}

.mr-modal-footer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 9px;
}

/* DETAIL MODAL */

.mr-detail-modal {
  width: min(100%,700px);
  max-height: min(92vh,850px);
}

.mr-detail-top {
  position: relative;
  overflow: hidden;
  padding: 27px 25px 22px;
  text-align: center;
  background:
    radial-gradient(circle at 90% 10%,rgba(244,81,43,.11),transparent 35%),
    linear-gradient(145deg,#FFF9F6,#FFFFFF);
  border-bottom: 1px solid #EEEEEE;
  border-radius: 17px 17px 0 0;
}

.mr-detail-close {
  position: absolute;
  top: 17px;
  right: 17px;
}

.mr-detail-icon {
  width: 52px;
  height: 52px;
  margin: 0 auto 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #F4512B;
  background: white;
  border: 1px solid #FFDFD4;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(244,81,43,.08);
}

.mr-detail-top > small {
  color: #E94B27;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.1px;
}

.mr-detail-top h2 {
  max-width: 510px;
  margin: 8px auto 5px;
  color: #292929;
  font-size: 20px;
  font-weight: 750;
  line-height: 1.35;
}

.mr-detail-top > p {
  margin: 0 0 13px;
  color: #777777;
  font-size: 12px;
  font-weight: 600;
}

.mr-detail-badges {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.mr-detail-body {
  min-height: 0;
  overflow-y: auto;
  padding: 21px 23px;
}

.mr-detail-grid {
  display: grid;
  grid-template-columns: repeat(2,minmax(0,1fr));
  gap: 11px;
}

.mr-detail-item {
  min-width: 0;
  padding: 13px;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  background: white;
  border: 1px solid #EAEAEA;
  border-radius: 11px;
}

.mr-detail-item > span {
  width: 34px;
  height: 34px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #E94B27;
  background: #FFF0EA;
  border-radius: 9px;
}

.mr-detail-item > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.mr-detail-item small {
  color: #858585;
  font-size: 11px;
}

.mr-detail-item strong {
  color: #444444;
  font-size: 13px;
  font-weight: 700;
  line-height: 1.45;
  overflow-wrap: anywhere;
}

.mr-detail-section {
  margin-top: 19px;
}

.mr-detail-section h3 {
  margin: 0 0 10px;
  color: #444444;
  font-size: 14px;
  font-weight: 750;
}

.mr-detail-section > p {
  margin: 0;
  padding: 13px;
  color: #555555;
  background: #FAFAFA;
  border: 1px solid #EAEAEA;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.65;
  overflow-wrap: anywhere;
}

.mr-contact-list {
  display: flex;
  flex-direction: column;
  gap: 11px;
}

.mr-contact-list span {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #555555;
  font-size: 13px;
  overflow-wrap: anywhere;
}

.mr-contact-list svg {
  flex-shrink: 0;
  color: #F4512B;
}

.mr-detail-footer {
  padding: 14px 20px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #EAEAEA;
}

.mr-status-control {
  min-width: 175px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.mr-status-control > span {
  color: #555555;
  font-size: 11px;
  font-weight: 700;
  white-space: nowrap;
}

.mr-status-control .mr-select-trigger {
  min-height: 40px;
  font-size: 12px;
}

.mr-detail-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mr-quick-actions {
  width: 100%;
  padding-top: 13px;
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  border-top: 1px solid #EEEEEE;
}

.mr-quick-actions button {
  min-height: 38px;
  padding: 0 13px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: 1px solid transparent;
  border-radius: 9px;
  font-size: 11px;
  font-weight: 700;
  transition: all .16s ease;
}

.mr-quick-actions button:hover {
  filter: brightness(.97);
  transform: translateY(-1px);
}

.mr-quick-approve {
  color: #218354;
  background: #EAF7EE;
  border-color: #D9F0E3 !important;
}

.mr-quick-review {
  color: #3478C7;
  background: #EDF5FF;
  border-color: #DCEAFF !important;
}

.mr-quick-reject {
  color: #B94343;
  background: #FFF0F0;
  border-color: #FFDDDD !important;
}

.mr-quick-hold {
  color: #8058BE;
  background: #F4EEFF;
  border-color: #E9E0F8 !important;
}

/* TOAST */

.mr-toast {
  position: fixed;
  left: 50%;
  bottom: 25px;
  z-index: 100010;
  max-width: calc(100vw - 30px);
  min-height: 46px;
  padding: 9px 16px 9px 11px;
  display: flex;
  align-items: center;
  gap: 10px;
  color: #444444;
  background: white;
  border: 1px solid #EAEAEA;
  border-radius: 12px;
  box-shadow: 0 9px 35px rgba(26,35,48,.16);
  font-size: 12px;
  font-weight: 700;
  transform: translateX(-50%);
}

.mr-toast > span {
  width: 27px;
  height: 27px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #21895F;
  background: #EAF7EE;
  border-radius: 8px;
}

/* MOBILE */

.mr-mobile-list {
  display: none;
}

.mr-mobile-empty {
  min-height: 190px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 10px;
  color: #858585;
  font-size: 12px;
}

.mr-mobile-empty svg {
  color: #F4512B;
}

.mr-mobile-empty strong {
  color: #444444;
  font-size: 14px;
}

/* RESPONSIVE */

@media (max-width: 1300px) {
  .mr-toolbar {
    align-items: stretch;
    flex-direction: column;
  }

  .mr-search-box {
    width: 100%;
    max-width: none;
  }

  .mr-toolbar-filters {
    width: 100%;
  }
}

@media (max-width: 1050px) {
  .mr-header-main {
    align-items: flex-start;
    flex-direction: column;
  }

  .mr-header-actions {
    width: 100%;
  }

  .mr-toolbar-filters {
    display: grid;
    grid-template-columns: repeat(2,minmax(0,1fr));
  }

  .mr-filter-select,
  .mr-sort-select {
    width: 100%;
  }

  .mr-sort-select {
    padding-left: 0;
    border-left: 0;
  }
}

@media (max-width: 900px) {
  .mr-stats-grid {
    grid-template-columns: repeat(2,minmax(0,1fr));
  }
}

@media (max-width: 680px) {
  .mr-page {
    padding: 0 0 22px;
  }

  .mr-page-header {
    margin-bottom: 17px;
  }

  .mr-breadcrumb {
    margin-bottom: 13px;
  }

  .mr-header-main h1 {
    font-size: 28px;
  }

  .mr-header-main > div:first-child > p {
    font-size: 12px;
    line-height: 1.6;
  }

  .mr-header-actions {
    gap: 8px;
  }

  .mr-header-actions .mr-button {
    flex: 1;
    padding: 0 9px;
    font-size: 10px;
  }

  .mr-header-date {
    width: 100%;
    justify-content: center;
  }

  .mr-stats-grid {
    gap: 10px;
    margin-bottom: 15px;
  }

  .mr-stat-card {
    min-height: 135px;
    padding: 13px;
    border-radius: 13px;
  }

  .mr-stat-title {
    font-size: 11px;
  }

  .mr-stat-value {
    font-size: 25px;
  }

  .mr-stat-icon {
    width: 38px;
    height: 38px;
  }

  .mr-stat-live {
    font-size: 10px;
  }

  .mr-card {
    border-radius: 13px;
  }

  .mr-card-heading {
    min-height: 70px;
    padding: 13px;
  }

  .mr-card-heading h2 {
    font-size: 14px;
  }

  .mr-card-heading p {
    font-size: 10px;
  }

  .mr-record-count {
    padding: 6px 8px;
    font-size: 9px;
  }

  .mr-toolbar {
    padding: 12px;
  }

  .mr-toolbar-filters {
    gap: 8px;
  }

  .mr-table-wrap {
    display: none;
  }

  .mr-mobile-list {
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .mr-mobile-card {
    min-width: 0;
    padding: 13px;
    background: white;
    border: 1px solid #EAEAEA;
    border-radius: 12px;
  }

  .mr-mobile-top {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .mr-mobile-title {
    min-width: 0;
    flex: 1;
  }

  .mr-mobile-title h3 {
    margin: 0;
    color: #333333;
    font-size: 12px;
    line-height: 1.4;
    font-weight: 750;
  }

  .mr-mobile-title > span {
    display: block;
    margin-top: 5px;
    color: #777777;
    font-size: 10px;
  }

  .mr-mobile-top > .mr-status-badge {
    padding: 5px 7px;
    font-size: 9px;
  }

  .mr-mobile-meta {
    padding: 12px 0;
    margin-top: 10px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    border-top: 1px solid #F0F0F0;
    border-bottom: 1px solid #F0F0F0;
  }

  .mr-mobile-meta > span {
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 7px;
    color: #666666;
    font-size: 11px;
    line-height: 1.5;
    overflow-wrap: anywhere;
  }

  .mr-mobile-meta svg {
    flex-shrink: 0;
    color: #F4512B;
  }

  .mr-mobile-bottom {
    padding-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .mr-mobile-bottom .mr-row-actions {
    gap: 2px;
  }

  .mr-table-footer {
    min-height: 46px;
    padding: 0 12px;
    font-size: 10px;
  }

  .mr-saved-indicator {
    font-size: 9px;
  }

  .mr-info-strip {
    padding: 13px;
  }

  .mr-info-strip strong {
    font-size: 12px;
  }

  .mr-info-strip p {
    max-width: 260px;
    font-size: 10px;
  }

  .mr-info-decoration {
    right: -3px;
    opacity: .6;
  }

  .mr-modal-backdrop {
    padding: 9px;
  }

  .mr-modal {
    max-height: 94vh;
    border-radius: 14px;
  }

  .mr-modal-header {
    min-height: 78px;
    padding: 13px;
  }

  .mr-modal-heading h2 {
    font-size: 16px;
  }

  .mr-modal-heading p {
    font-size: 10px;
  }

  .mr-modal-body {
    padding: 14px;
  }

  .mr-form-grid {
    gap: 13px 10px;
  }

  .mr-modal-footer {
    padding: 10px 13px;
  }

  .mr-required-note {
    display: none;
  }

  .mr-modal-footer-actions {
    width: 100%;
  }

  .mr-modal-footer-actions .mr-button {
    flex: 1;
    padding: 0 9px;
    font-size: 10px;
  }

  .mr-detail-grid {
    gap: 8px;
  }

  .mr-detail-item {
    padding: 10px;
    gap: 8px;
  }

  .mr-detail-item > span {
    width: 29px;
    height: 29px;
  }

  .mr-detail-item strong {
    font-size: 11px;
  }

  .mr-detail-footer {
    padding: 11px;
  }
}

@media (max-width: 430px) {
  .mr-toolbar-filters {
    grid-template-columns: 1fr 1fr;
  }

  .mr-sort-select {
    grid-column: span 2;
  }

  .mr-form-grid {
    grid-template-columns: 1fr;
  }

  .mr-field.span-2 {
    grid-column: span 1;
  }

  .mr-detail-grid {
    grid-template-columns: 1fr;
  }

  .mr-status-control {
    width: 100%;
    justify-content: space-between;
  }

  .mr-status-control .mr-select-trigger {
    width: 165px;
  }

  .mr-detail-footer {
    align-items: stretch;
  }

  .mr-detail-actions {
    width: 100%;
  }

  .mr-detail-actions .mr-button {
    flex: 1;
    padding: 0 8px;
    font-size: 10px;
  }

  .mr-quick-actions button {
    flex: 1 1 calc(50% - 8px);
  }
}

@media (min-width: 681px) and (max-width: 1050px) {
  .mr-header-main h1 {
    font-size: 32px;
  }
}
`;
