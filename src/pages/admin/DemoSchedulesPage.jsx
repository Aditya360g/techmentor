
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
  ArrowDownUp,
  ArrowRight,
  Building2,
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Copy,
  Download,
  ExternalLink,
  Eye,
  Filter,
  GraduationCap,
  Link2,
  Mail,
  MapPin,
  MoreHorizontal,
  Pencil,
  Phone,
  Plus,
  RefreshCw,
  Search,
  SlidersHorizontal,
  Sparkles,
  Trash2,
  Users,
  Video,
  X,
  UserRound,
} from "lucide-react";

/* =========================================================
   CONFIGURATION
========================================================= */

const STORAGE_KEY = "codefaculty_admin_demo_schedules_premium_v1";

const TRAINERS = [
  "Aman Sharma",
  "Rahul Verma",
  "Priya Singh",
  "Ankit Mehta",
  "Neha Agarwal",
  "Karan Malhotra",
];

const COLLEGES = [
  "Rajasthan Technical University",
  "JECRC University",
  "Poornima College of Engineering",
  "LNM Institute of Information Technology",
  "Arya College of Engineering",
  "SKIT Jaipur",
];

const COURSES = [
  "Full Stack Development",
  "Python Programming",
  "Java & DSA",
  "Artificial Intelligence",
  "Data Science",
  "React Development",
  "Machine Learning",
  "Cloud Computing",
];

const STATUS_OPTIONS = [
  { label: "All statuses", value: "All" },
  { label: "Scheduled", value: "Scheduled" },
  { label: "Completed", value: "Completed" },
  { label: "Pending", value: "Pending" },
  { label: "Cancelled", value: "Cancelled" },
];

const MODE_OPTIONS = [
  { label: "All modes", value: "All" },
  { label: "Online", value: "Online" },
  { label: "Offline", value: "Offline" },
];

const DATE_OPTIONS = [
  { label: "All dates", value: "All" },
  { label: "Upcoming", value: "Upcoming" },
  { label: "Next 7 days", value: "Next 7 days" },
  { label: "Past demos", value: "Past" },
];

const SORT_OPTIONS = [
  { label: "Date: nearest first", value: "nearest" },
  { label: "Date: farthest first", value: "farthest" },
  { label: "Recently added", value: "newest" },
  { label: "Oldest added", value: "oldest" },
];

const STATUS_META = {
  Scheduled: {
    label: "Scheduled",
    className: "scheduled",
    dot: "#26966A",
  },
  Completed: {
    label: "Completed",
    className: "completed",
    dot: "#3979D8",
  },
  Pending: {
    label: "Pending",
    className: "pending",
    dot: "#D99727",
  },
  Cancelled: {
    label: "Cancelled",
    className: "cancelled",
    dot: "#D95C5C",
  },
};

/* =========================================================
   HELPERS
========================================================= */

const pad = (value) => String(value).padStart(2, "0");

const toISODate = (date) => {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )}`;
};

const addDays = (days) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + days);
  return toISODate(date);
};

const todayISO = () => toISODate(new Date());

const formatDate = (value) => {
  if (!value) return "Not scheduled";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const formatShortDate = (value) => {
  if (!value) return "--";

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) return value;

  return {
    day: date.toLocaleDateString("en-IN", { day: "2-digit" }),
    month: date.toLocaleDateString("en-IN", { month: "short" }),
    year: date.getFullYear(),
  };
};

const formatTime = (time) => {
  if (!time) return "--";

  const [hours, minutes] = time.split(":");
  const date = new Date();

  date.setHours(Number(hours), Number(minutes), 0, 0);

  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const createId = () => {
  return `DEMO-${Date.now().toString().slice(-7)}`;
};

const escapeCSV = (value) => {
  return `"${String(value ?? "").replace(/"/g, '""')}"`;
};

/* =========================================================
   INITIAL DEMO DATA
========================================================= */

const createInitialDemos = () => [
  {
    id: "DEMO-1001",
    title: "Full Stack Development Introduction",
    college: "Rajasthan Technical University",
    course: "Full Stack Development",
    trainer: "Aman Sharma",
    date: addDays(1),
    time: "10:30",
    duration: "60",
    mode: "Online",
    meetingLink: "https://meet.google.com/demo-1001",
    location: "",
    students: 120,
    contactName: "Rahul Gupta",
    contactEmail: "rahul@rtu.ac.in",
    contactPhone: "9876543210",
    notes: "Introduction session with project overview.",
    status: "Scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-1002",
    title: "Python & AI Career Session",
    college: "JECRC University",
    course: "Python Programming",
    trainer: "Priya Singh",
    date: addDays(3),
    time: "12:00",
    duration: "45",
    mode: "Online",
    meetingLink: "https://meet.google.com/demo-1002",
    location: "",
    students: 85,
    contactName: "Amit Jain",
    contactEmail: "amit@jecrc.ac.in",
    contactPhone: "9876543211",
    notes: "Python fundamentals and AI career roadmap.",
    status: "Scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-1003",
    title: "Java & DSA Technical Demo",
    college: "Poornima College of Engineering",
    course: "Java & DSA",
    trainer: "Rahul Verma",
    date: addDays(5),
    time: "11:00",
    duration: "60",
    mode: "Offline",
    meetingLink: "",
    location: "Poornima College, Jaipur",
    students: 150,
    contactName: "Sandeep Sharma",
    contactEmail: "sandeep@poornima.edu",
    contactPhone: "9876543212",
    notes: "Technical demonstration and student interaction.",
    status: "Scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-1004",
    title: "React Development Workshop",
    college: "SKIT Jaipur",
    course: "React Development",
    trainer: "Neha Agarwal",
    date: addDays(-2),
    time: "14:00",
    duration: "90",
    mode: "Online",
    meetingLink: "https://meet.google.com/demo-1004",
    location: "",
    students: 90,
    contactName: "Vikas Sharma",
    contactEmail: "vikas@skit.ac.in",
    contactPhone: "9876543213",
    notes: "React components, hooks and practical examples.",
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-1005",
    title: "Data Science Orientation",
    college: "Arya College of Engineering",
    course: "Data Science",
    trainer: "Ankit Mehta",
    date: addDays(7),
    time: "09:30",
    duration: "60",
    mode: "Online",
    meetingLink: "https://meet.google.com/demo-1005",
    location: "",
    students: 75,
    contactName: "Mohit Yadav",
    contactEmail: "mohit@arya.ac.in",
    contactPhone: "9876543214",
    notes: "Data science program overview.",
    status: "Pending",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-1006",
    title: "Machine Learning Demo",
    college: "LNM Institute of Information Technology",
    course: "Machine Learning",
    trainer: "Karan Malhotra",
    date: addDays(10),
    time: "15:00",
    duration: "60",
    mode: "Online",
    meetingLink: "https://meet.google.com/demo-1006",
    location: "",
    students: 65,
    contactName: "Rohit Kumar",
    contactEmail: "rohit@lnmiit.ac.in",
    contactPhone: "9876543215",
    notes: "Machine learning introduction and use cases.",
    status: "Scheduled",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-1007",
    title: "Cloud Computing Overview",
    college: "JECRC University",
    course: "Cloud Computing",
    trainer: "Aman Sharma",
    date: addDays(-5),
    time: "11:30",
    duration: "45",
    mode: "Offline",
    meetingLink: "",
    location: "JECRC University Campus",
    students: 110,
    contactName: "Amit Jain",
    contactEmail: "amit@jecrc.ac.in",
    contactPhone: "9876543211",
    notes: "Cloud computing fundamentals.",
    status: "Completed",
    createdAt: new Date().toISOString(),
  },
  {
    id: "DEMO-1008",
    title: "AI & Data Science Discussion",
    college: "Rajasthan Technical University",
    course: "Artificial Intelligence",
    trainer: "Priya Singh",
    date: addDays(14),
    time: "13:00",
    duration: "60",
    mode: "Online",
    meetingLink: "https://meet.google.com/demo-1008",
    location: "",
    students: 100,
    contactName: "Rahul Gupta",
    contactEmail: "rahul@rtu.ac.in",
    contactPhone: "9876543210",
    notes: "AI and data science career discussion.",
    status: "Scheduled",
    createdAt: new Date().toISOString(),
  },
];

const loadDemos = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load demo schedules:", error);
  }

  return createInitialDemos();
};

const EMPTY_FORM = {
  title: "",
  college: "",
  course: "",
  trainer: "",
  date: "",
  time: "10:00",
  duration: "60",
  mode: "Online",
  meetingLink: "",
  location: "",
  students: "50",
  contactName: "",
  contactEmail: "",
  contactPhone: "",
  notes: "",
  status: "Scheduled",
};

/* =========================================================
   PREMIUM SELECT DROPDOWN
   Portal based dropdown: no clipping inside modals/cards
========================================================= */

function PremiumSelect({
  value,
  onChange,
  options = [],
  placeholder = "Select option",
  searchable = true,
  disabled = false,
  className = "",
  menuWidth,
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [menuStyle, setMenuStyle] = useState({});

  const triggerRef = useRef(null);
  const menuRef = useRef(null);

  const normalizedOptions = useMemo(() => {
    return options.map((option) => {
      if (typeof option === "string") {
        return { label: option, value: option };
      }

      return option;
    });
  }, [options]);

  const selectedOption = normalizedOptions.find(
    (option) => option.value === value
  );

  const filteredOptions = normalizedOptions.filter((option) => {
    const text = `${option.label} ${option.description || ""}`.toLowerCase();
    return text.includes(query.toLowerCase());
  });

  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;

    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    const availableBelow = viewportHeight - rect.bottom - 18;
    const availableAbove = rect.top - 18;

    const openBelow =
      availableBelow >= 210 || availableBelow >= availableAbove;

    const maxHeight = Math.max(
      150,
      Math.min(330, openBelow ? availableBelow : availableAbove)
    );

    const width = menuWidth || Math.max(rect.width, 210);

    const left = Math.min(
      Math.max(12, rect.left),
      window.innerWidth - width - 12
    );

    setMenuStyle({
      position: "fixed",
      left,
      width,
      maxHeight,
      top: openBelow ? rect.bottom + 8 : "auto",
      bottom: openBelow ? "auto" : window.innerHeight - rect.top + 8,
    });
  }, [menuWidth]);

  useEffect(() => {
    if (!open) return undefined;

    updatePosition();

    const handleOutside = (event) => {
      if (
        !triggerRef.current?.contains(event.target) &&
        !menuRef.current?.contains(event.target)
      ) {
        setOpen(false);
        setQuery("");
      }
    };

    const handleReposition = () => updatePosition();

    document.addEventListener("pointerdown", handleOutside);
    window.addEventListener("resize", handleReposition);
    window.addEventListener("scroll", handleReposition, true);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      window.removeEventListener("resize", handleReposition);
      window.removeEventListener("scroll", handleReposition, true);
    };
  }, [open, updatePosition]);

  const selectOption = (option) => {
    onChange(option.value);
    setOpen(false);
    setQuery("");
  };

  const menu = open
    ? createPortal(
      <AnimatePresence>
        <motion.div
          ref={menuRef}
          className="ds-dropdown-menu"
          style={menuStyle}
          initial={{ opacity: 0, y: -5, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -5, scale: 0.98 }}
          transition={{ duration: 0.16 }}
        >
          {searchable && (
            <div className="ds-dropdown-search">
              <Search size={15} />
              <input
                autoFocus
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search options..."
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                >
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          <div className="ds-dropdown-options ds-scrollbar">
            {filteredOptions.length ? (
              filteredOptions.map((option) => {
                const active = option.value === value;

                return (
                  <button
                    type="button"
                    key={option.value}
                    className={`ds-dropdown-option ${active ? "active" : ""
                      }`}
                    onClick={() => selectOption(option)}
                  >
                    <span className="ds-option-copy">
                      <span className="ds-option-label">
                        {option.label}
                      </span>
                      {option.description && (
                        <span className="ds-option-description">
                          {option.description}
                        </span>
                      )}
                    </span>

                    {active && (
                      <span className="ds-option-check">
                        <Check size={14} />
                      </span>
                    )}
                  </button>
                );
              })
            ) : (
              <div className="ds-dropdown-empty">
                No matching options found
              </div>
            )}
          </div>

          <div className="ds-dropdown-footer">
            <span>{filteredOptions.length} options</span>
            <span>CodeFaculty</span>
          </div>
        </motion.div>
      </AnimatePresence>,
      document.body
    )
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        className={`ds-select-trigger ${open ? "is-open" : ""} ${className}`}
        onClick={() => {
          if (disabled) return;
          setOpen((previous) => !previous);
          setQuery("");
        }}
      >
        <span className={selectedOption ? "ds-select-value" : "ds-select-placeholder"}>
          {selectedOption?.label || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`ds-select-chevron ${open ? "rotated" : ""}`}
        />
      </button>

      {menu}
    </>
  );
}

/* =========================================================
   SMALL UI COMPONENTS
========================================================= */

function StatusBadge({ status }) {
  const meta = STATUS_META[status] || STATUS_META.Pending;

  return (
    <span className={`ds-status-badge ${meta.className}`}>
      <span className="ds-status-dot" />
      {meta.label}
    </span>
  );
}

function IconButton({ icon: Icon, label, onClick, danger = false }) {
  return (
    <button
      type="button"
      className={`ds-icon-button ${danger ? "danger" : ""}`}
      onClick={onClick}
      title={label}
      aria-label={label}
    >
      <Icon size={16} />
    </button>
  );
}

function Field({ label, required, children, hint, className = "" }) {
  return (
    <div className={`ds-field ${className}`}>
      <label className="ds-field-label">
        {label}
        {required && <span className="ds-required">*</span>}
      </label>

      {children}

      {hint && <span className="ds-field-hint">{hint}</span>}
    </div>
  );
}

function StatCard({ title, value, note, icon: Icon, tone, index }) {
  return (
    <motion.div
      className="ds-stat-card"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.32 }}
    >
      <div className="ds-stat-top">
        <span className={`ds-stat-icon ${tone}`}>
          <Icon size={19} />
        </span>

        <span className="ds-stat-note">
          <Activity size={12} />
          Live data
        </span>
      </div>

      <div className="ds-stat-value">{value}</div>
      <div className="ds-stat-title">{title}</div>
      <div className="ds-stat-subtitle">{note}</div>
    </motion.div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function DemoSchedulesPage() {
  const [demos, setDemos] = useState(loadDemos);

  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedMode, setSelectedMode] = useState("All");
  const [selectedDate, setSelectedDate] = useState("All");
  const [sortBy, setSortBy] = useState("nearest");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [detailDemo, setDetailDemo] = useState(null);

  const [form, setForm] = useState(EMPTY_FORM);
  const [toast, setToast] = useState("");

  const today = todayISO();

  /* Persist schedules */

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demos));
    } catch (error) {
      console.error("Unable to save demo schedules:", error);
    }
  }, [demos]);

  /* Toast */

  const showToast = useCallback((message) => {
    setToast(message);

    window.setTimeout(() => {
      setToast("");
    }, 2600);
  }, []);

  /* Modal keyboard handling */

  useEffect(() => {
    if (!modalOpen && !detailDemo) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setModalOpen(false);
        setDetailDemo(null);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [modalOpen, detailDemo]);

  /* Dashboard stats */

  const stats = useMemo(() => {
    const upcoming = demos.filter(
      (demo) => demo.status === "Scheduled" && demo.date >= today
    );

    const completed = demos.filter(
      (demo) => demo.status === "Completed"
    );

    const expectedStudents = upcoming.reduce(
      (total, demo) => total + Number(demo.students || 0),
      0
    );

    return [
      {
        title: "Total demo sessions",
        value: demos.length,
        note: "Across all colleges",
        icon: CalendarDays,
        tone: "orange",
      },
      {
        title: "Upcoming demos",
        value: upcoming.length,
        note: "Scheduled sessions",
        icon: CalendarCheck,
        tone: "green",
      },
      {
        title: "Completed demos",
        value: completed.length,
        note: "Successfully conducted",
        icon: CheckCircle2,
        tone: "blue",
      },
      {
        title: "Expected students",
        value: expectedStudents.toLocaleString("en-IN"),
        note: "In upcoming sessions",
        icon: Users,
        tone: "purple",
      },
    ];
  }, [demos, today]);

  /* Filters and sorting */

  const filteredDemos = useMemo(() => {
    let result = [...demos];

    const term = search.trim().toLowerCase();

    if (term) {
      result = result.filter((demo) => {
        const searchable = [
          demo.id,
          demo.title,
          demo.college,
          demo.course,
          demo.trainer,
          demo.contactName,
          demo.contactEmail,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchable.includes(term);
      });
    }

    if (selectedStatus !== "All") {
      result = result.filter(
        (demo) => demo.status === selectedStatus
      );
    }

    if (selectedMode !== "All") {
      result = result.filter(
        (demo) => demo.mode === selectedMode
      );
    }

    if (selectedDate === "Upcoming") {
      result = result.filter(
        (demo) => demo.date >= today && demo.status !== "Cancelled"
      );
    }

    if (selectedDate === "Past") {
      result = result.filter((demo) => demo.date < today);
    }

    if (selectedDate === "Next 7 days") {
      const lastDate = addDays(7);

      result = result.filter(
        (demo) => demo.date >= today && demo.date <= lastDate
      );
    }

    result.sort((a, b) => {
      if (sortBy === "nearest") {
        return `${a.date} ${a.time}`.localeCompare(
          `${b.date} ${b.time}`
        );
      }

      if (sortBy === "farthest") {
        return `${b.date} ${b.time}`.localeCompare(
          `${a.date} ${a.time}`
        );
      }

      if (sortBy === "newest") {
        return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
      }

      if (sortBy === "oldest") {
        return new Date(a.createdAt || 0) - new Date(b.createdAt || 0);
      }

      return 0;
    });

    return result;
  }, [
    demos,
    search,
    selectedStatus,
    selectedMode,
    selectedDate,
    sortBy,
    today,
  ]);

  const hasActiveFilters =
    search ||
    selectedStatus !== "All" ||
    selectedMode !== "All" ||
    selectedDate !== "All";

  /* Form helpers */

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
      date: addDays(1),
    });

    setModalOpen(true);
  };

  const openEditModal = (demo) => {
    setEditingId(demo.id);

    setForm({
      ...EMPTY_FORM,
      ...demo,
      students: String(demo.students ?? 50),
    });

    setDetailDemo(null);
    setModalOpen(true);
  };

  const closeFormModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
  };

  /* Create / Update */

  const handleSave = (event) => {
    event.preventDefault();

    const payload = {
      ...form,
      students: Math.max(0, Number(form.students) || 0),
      updatedAt: new Date().toISOString(),
    };

    if (editingId) {
      setDemos((previous) =>
        previous.map((demo) =>
          demo.id === editingId
            ? {
              ...demo,
              ...payload,
            }
            : demo
        )
      );

      showToast("Demo schedule updated successfully");
    } else {
      const newDemo = {
        ...payload,
        id: createId(),
        createdAt: new Date().toISOString(),
      };

      setDemos((previous) => [newDemo, ...previous]);

      showToast("New demo schedule created");
    }

    closeFormModal();
  };

  /* Delete */

  const handleDelete = (demo) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete "${demo.title}"?`
    );

    if (!confirmed) return;

    setDemos((previous) =>
      previous.filter((item) => item.id !== demo.id)
    );

    setDetailDemo(null);
    showToast("Demo schedule deleted");
  };

  /* Status */

  const handleStatusUpdate = (demo, status) => {
    setDemos((previous) =>
      previous.map((item) =>
        item.id === demo.id
          ? {
            ...item,
            status,
            updatedAt: new Date().toISOString(),
          }
          : item
      )
    );

    setDetailDemo((previous) =>
      previous?.id === demo.id
        ? { ...previous, status }
        : previous
    );

    showToast(`Demo marked as ${status.toLowerCase()}`);
  };

  /* CSV export */

  const handleExport = () => {
    if (!filteredDemos.length) {
      showToast("No demo records available to export");
      return;
    }

    const headers = [
      "Demo ID",
      "Title",
      "College",
      "Course",
      "Trainer",
      "Date",
      "Time",
      "Duration",
      "Mode",
      "Students",
      "Status",
      "Contact Name",
      "Contact Email",
      "Contact Phone",
      "Meeting Link",
      "Location",
      "Notes",
    ];

    const rows = filteredDemos.map((demo) => [
      demo.id,
      demo.title,
      demo.college,
      demo.course,
      demo.trainer,
      demo.date,
      demo.time,
      demo.duration,
      demo.mode,
      demo.students,
      demo.status,
      demo.contactName,
      demo.contactEmail,
      demo.contactPhone,
      demo.meetingLink,
      demo.location,
      demo.notes,
    ]);

    const csv = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `codefaculty-demo-schedules-${today}.csv`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);

    showToast("CSV report exported successfully");
  };

  /* Copy meeting link */

  const handleCopyLink = async (link) => {
    if (!link) {
      showToast("No meeting link available");
      return;
    }

    try {
      await navigator.clipboard.writeText(link);
      showToast("Meeting link copied");
    } catch (error) {
      showToast("Unable to copy meeting link");
    }
  };

  /* Reset filters */

  const resetFilters = () => {
    setSearch("");
    setSelectedStatus("All");
    setSelectedMode("All");
    setSelectedDate("All");
    setSortBy("nearest");
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="ds-page">
      <style>{PAGE_STYLES}</style>

      {/* PAGE HEADER */}

      <div className="ds-page-header">
        <div className="ds-breadcrumb">
          <span>Admin</span>
          <span className="ds-breadcrumb-separator">/</span>
          <span className="current">Demo schedules</span>
        </div>

        <div className="ds-header-main">
          <div>
            <div className="ds-eyebrow">
              <span className="ds-eyebrow-dot" />
              SCHEDULING CENTER
            </div>

            <h1>
              Demo <span>Schedules</span>
            </h1>

            <p className="ds-page-description">
              Plan, organize and monitor product demos across your partner
              colleges.
            </p>
          </div>

          <div className="ds-header-actions">
            <button
              type="button"
              className="ds-button ds-button-secondary"
              onClick={handleExport}
            >
              <Download size={16} />
              Export report
            </button>

            <button
              type="button"
              className="ds-button ds-button-primary"
              onClick={openCreateModal}
            >
              <Plus size={17} />
              Schedule demo
            </button>
          </div>
        </div>
      </div>

      {/* STATS */}

      <div className="ds-stats-grid">
        {stats.map((item, index) => (
          <StatCard
            key={item.title}
            {...item}
            index={index}
          />
        ))}
      </div>

      {/* MAIN CONTENT */}

      <section className="ds-content-card">
        <div className="ds-content-heading">
          <div>
            <div className="ds-content-title-line">
              <div className="ds-section-icon">
                <CalendarDays size={19} />
              </div>

              <div>
                <h2>All demo sessions</h2>
                <p>Manage your college demo schedule and assignments.</p>
              </div>
            </div>
          </div>

          <div className="ds-record-count">
            <span className="ds-record-count-dot" />
            {filteredDemos.length} records
          </div>
        </div>

        {/* FILTER TOOLBAR */}

        <div className="ds-toolbar">
          <div className="ds-search-box">
            <Search size={17} />

            <input
              type="text"
              placeholder="Search demo, college, trainer..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
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

          <div className="ds-toolbar-filters">
            <div className="ds-filter-select status-filter">
              <PremiumSelect
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={STATUS_OPTIONS}
                searchable={false}
              />
            </div>

            <div className="ds-filter-select">
              <PremiumSelect
                value={selectedMode}
                onChange={setSelectedMode}
                options={MODE_OPTIONS}
                searchable={false}
              />
            </div>

            <div className="ds-filter-select date-filter">
              <PremiumSelect
                value={selectedDate}
                onChange={setSelectedDate}
                options={DATE_OPTIONS}
                searchable={false}
              />
            </div>

            <div className="ds-sort-select">
              <SlidersHorizontal size={15} />

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
          <div className="ds-active-filters">
            <div className="ds-active-filter-label">
              <Filter size={13} />
              Active filters
            </div>

            {search && (
              <button
                type="button"
                className="ds-filter-chip"
                onClick={() => setSearch("")}
              >
                Search: {search}
                <X size={12} />
              </button>
            )}

            {selectedStatus !== "All" && (
              <button
                type="button"
                className="ds-filter-chip"
                onClick={() => setSelectedStatus("All")}
              >
                {selectedStatus}
                <X size={12} />
              </button>
            )}

            {selectedMode !== "All" && (
              <button
                type="button"
                className="ds-filter-chip"
                onClick={() => setSelectedMode("All")}
              >
                {selectedMode}
                <X size={12} />
              </button>
            )}

            {selectedDate !== "All" && (
              <button
                type="button"
                className="ds-filter-chip"
                onClick={() => setSelectedDate("All")}
              >
                {selectedDate}
                <X size={12} />
              </button>
            )}

            <button
              type="button"
              className="ds-clear-filters"
              onClick={resetFilters}
            >
              Clear all
            </button>
          </div>
        )}

        {/* DESKTOP TABLE */}

        <div className="ds-table-wrap ds-scrollbar">
          <table className="ds-table">
            <thead>
              <tr>
                <th>DEMO DETAILS</th>
                <th>COLLEGE & COURSE</th>
                <th>TRAINER</th>
                <th>DATE & TIME</th>
                <th>MODE</th>
                <th>STATUS</th>
                <th className="ds-actions-heading">ACTIONS</th>
              </tr>
            </thead>

            <tbody>
              {filteredDemos.length ? (
                filteredDemos.map((demo, index) => {
                  const dateParts = formatShortDate(demo.date);

                  return (
                    <motion.tr
                      key={demo.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: Math.min(index * 0.025, 0.2),
                      }}
                    >
                      <td>
                        <div className="ds-demo-cell">
                          <div className="ds-demo-avatar">
                            <CalendarCheck size={18} />
                          </div>

                          <div className="ds-demo-copy">
                            <button
                              type="button"
                              className="ds-demo-title"
                              onClick={() => setDetailDemo(demo)}
                            >
                              {demo.title}
                            </button>

                            <span className="ds-demo-id">
                              {demo.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <div className="ds-college-cell">
                          <span className="ds-college-name">
                            {demo.college}
                          </span>
                          <span className="ds-course-name">
                            <GraduationCap size={13} />
                            {demo.course}
                          </span>
                        </div>
                      </td>

                      <td>
                        <div className="ds-trainer-cell">
                          <div className="ds-trainer-avatar">
                            {demo.trainer
                              ?.split(" ")
                              .map((part) => part[0])
                              .join("")
                              .slice(0, 2)}
                          </div>

                          <span>{demo.trainer}</span>
                        </div>
                      </td>

                      <td>
                        <div className="ds-date-cell">
                          <div className="ds-calendar-date">
                            <span>{dateParts.day}</span>
                            <small>{dateParts.month}</small>
                          </div>

                          <div className="ds-date-copy">
                            <strong>{formatDate(demo.date)}</strong>
                            <span>
                              <Clock3 size={12} />
                              {formatTime(demo.time)}
                            </span>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span
                          className={`ds-mode-badge ${demo.mode === "Online" ? "online" : "offline"
                            }`}
                        >
                          {demo.mode === "Online" ? (
                            <Video size={13} />
                          ) : (
                            <MapPin size={13} />
                          )}
                          {demo.mode}
                        </span>
                      </td>

                      <td>
                        <StatusBadge status={demo.status} />
                      </td>

                      <td>
                        <div className="ds-row-actions">
                          <IconButton
                            icon={Eye}
                            label="View details"
                            onClick={() => setDetailDemo(demo)}
                          />

                          <IconButton
                            icon={Pencil}
                            label="Edit schedule"
                            onClick={() => openEditModal(demo)}
                          />

                          <IconButton
                            icon={Trash2}
                            label="Delete schedule"
                            danger
                            onClick={() => handleDelete(demo)}
                          />
                        </div>
                      </td>
                    </motion.tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="ds-empty-state">
                      <div className="ds-empty-icon">
                        <CalendarDays size={27} />
                      </div>

                      <h3>No demo sessions found</h3>

                      <p>
                        Try changing your filters or create a new demo
                        schedule.
                      </p>

                      {hasActiveFilters ? (
                        <button
                          type="button"
                          className="ds-button ds-button-secondary"
                          onClick={resetFilters}
                        >
                          <RefreshCw size={15} />
                          Reset filters
                        </button>
                      ) : (
                        <button
                          type="button"
                          className="ds-button ds-button-primary"
                          onClick={openCreateModal}
                        >
                          <Plus size={15} />
                          Create demo
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

        <div className="ds-mobile-list">
          {filteredDemos.length ? (
            filteredDemos.map((demo) => (
              <div className="ds-mobile-card" key={demo.id}>
                <div className="ds-mobile-card-top">
                  <div className="ds-demo-avatar">
                    <CalendarCheck size={18} />
                  </div>

                  <div className="ds-mobile-card-title">
                    <h3>{demo.title}</h3>
                    <span>{demo.id}</span>
                  </div>

                  <StatusBadge status={demo.status} />
                </div>

                <div className="ds-mobile-meta">
                  <span>
                    <Building2 size={14} />
                    {demo.college}
                  </span>

                  <span>
                    <UserRound size={14} />
                    {demo.trainer}
                  </span>

                  <span>
                    <CalendarDays size={14} />
                    {formatDate(demo.date)}
                  </span>

                  <span>
                    <Clock3 size={14} />
                    {formatTime(demo.time)}
                  </span>
                </div>

                <div className="ds-mobile-card-footer">
                  <span
                    className={`ds-mode-badge ${demo.mode === "Online" ? "online" : "offline"
                      }`}
                  >
                    {demo.mode === "Online" ? (
                      <Video size={13} />
                    ) : (
                      <MapPin size={13} />
                    )}
                    {demo.mode}
                  </span>

                  <div className="ds-row-actions">
                    <IconButton
                      icon={Eye}
                      label="View details"
                      onClick={() => setDetailDemo(demo)}
                    />
                    <IconButton
                      icon={Pencil}
                      label="Edit"
                      onClick={() => openEditModal(demo)}
                    />
                    <IconButton
                      icon={Trash2}
                      label="Delete"
                      danger
                      onClick={() => handleDelete(demo)}
                    />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="ds-mobile-empty">
              <CalendarDays size={25} />
              <strong>No demo sessions found</strong>
              <span>Try adjusting your filters.</span>
            </div>
          )}
        </div>

        {/* TABLE FOOTER */}

        <div className="ds-table-footer">
          <span>
            Showing <strong>{filteredDemos.length}</strong> of{" "}
            <strong>{demos.length}</strong> demo sessions
          </span>

          <span className="ds-footer-updated">
            <span />
            Changes are saved locally
          </span>
        </div>
      </section>

      {/* BOTTOM INFO */}

      <div className="ds-bottom-info">
        <div className="ds-bottom-info-icon">
          <Sparkles size={17} />
        </div>

        <div>
          <strong>Stay on top of every demo</strong>
          <p>
            Keep trainer assignments, college coordination and session
            schedules organized in one place.
          </p>
        </div>

        <div className="ds-bottom-decoration">
          <CalendarCheck size={39} />
        </div>
      </div>

      {/* ===================================================
          CREATE / EDIT MODAL
      =================================================== */}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {modalOpen && (
              <motion.div
                className="ds-modal-backdrop"
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
                  className="ds-modal ds-form-modal"
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="ds-modal-header">
                    <div className="ds-modal-heading">
                      <div className="ds-modal-heading-icon">
                        {editingId ? (
                          <Pencil size={19} />
                        ) : (
                          <CalendarPlus size={20} />
                        )}
                      </div>

                      <div>
                        <span className="ds-modal-eyebrow">
                          DEMO MANAGEMENT
                        </span>
                        <h2>
                          {editingId ? "Edit demo schedule" : "Schedule a demo"}
                        </h2>
                        <p>
                          {editingId
                            ? "Update the details for this demo session."
                            : "Add a new demo session for a partner college."}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="ds-modal-close"
                      onClick={closeFormModal}
                    >
                      <X size={19} />
                    </button>
                  </div>

                  <form onSubmit={handleSave}>
                    <div className="ds-modal-body ds-scrollbar">
                      <div className="ds-form-section">
                        <div className="ds-form-section-title">
                          <span>01</span>
                          Session information
                        </div>

                        <div className="ds-form-grid">
                          <Field
                            label="Demo title"
                            required
                            className="span-2"
                          >
                            <input
                              className="ds-input"
                              value={form.title}
                              onChange={(event) =>
                                updateForm("title", event.target.value)
                              }
                              placeholder="e.g. Full Stack Development Demo"
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

                          <Field label="Course / Program" required>
                            <PremiumSelect
                              value={form.course}
                              onChange={(value) =>
                                updateForm("course", value)
                              }
                              options={COURSES}
                              placeholder="Select course"
                            />
                          </Field>

                          <Field label="Assigned trainer" required>
                            <PremiumSelect
                              value={form.trainer}
                              onChange={(value) =>
                                updateForm("trainer", value)
                              }
                              options={TRAINERS}
                              placeholder="Select trainer"
                            />
                          </Field>

                          <Field label="Expected students">
                            <input
                              className="ds-input"
                              type="number"
                              min="0"
                              value={form.students}
                              onChange={(event) =>
                                updateForm("students", event.target.value)
                              }
                              placeholder="50"
                            />
                          </Field>
                        </div>
                      </div>

                      <div className="ds-form-section">
                        <div className="ds-form-section-title">
                          <span>02</span>
                          Date & scheduling
                        </div>

                        <div className="ds-form-grid">
                          <Field label="Demo date" required>
                            <input
                              className="ds-input"
                              type="date"
                              value={form.date}
                              onChange={(event) =>
                                updateForm("date", event.target.value)
                              }
                              required
                            />
                          </Field>

                          <Field label="Start time" required>
                            <input
                              className="ds-input"
                              type="time"
                              value={form.time}
                              onChange={(event) =>
                                updateForm("time", event.target.value)
                              }
                              required
                            />
                          </Field>

                          <Field label="Duration">
                            <PremiumSelect
                              value={form.duration}
                              onChange={(value) =>
                                updateForm("duration", value)
                              }
                              searchable={false}
                              options={[
                                { label: "30 minutes", value: "30" },
                                { label: "45 minutes", value: "45" },
                                { label: "60 minutes", value: "60" },
                                { label: "90 minutes", value: "90" },
                                { label: "120 minutes", value: "120" },
                              ]}
                            />
                          </Field>

                          <Field label="Session mode">
                            <PremiumSelect
                              value={form.mode}
                              onChange={(value) =>
                                updateForm("mode", value)
                              }
                              searchable={false}
                              options={[
                                { label: "Online", value: "Online" },
                                { label: "Offline", value: "Offline" },
                              ]}
                            />
                          </Field>

                          {form.mode === "Online" ? (
                            <Field
                              label="Meeting link"
                              className="span-2"
                              hint="Paste your Google Meet, Zoom or Teams meeting link."
                            >
                              <div className="ds-input-icon-wrap">
                                <Link2 size={16} />
                                <input
                                  className="ds-input has-icon"
                                  type="url"
                                  value={form.meetingLink}
                                  onChange={(event) =>
                                    updateForm("meetingLink", event.target.value)
                                  }
                                  placeholder="https://meet.google.com/..."
                                />
                              </div>
                            </Field>
                          ) : (
                            <Field
                              label="Venue / Location"
                              className="span-2"
                            >
                              <div className="ds-input-icon-wrap">
                                <MapPin size={16} />
                                <input
                                  className="ds-input has-icon"
                                  value={form.location}
                                  onChange={(event) =>
                                    updateForm("location", event.target.value)
                                  }
                                  placeholder="Enter venue or college address"
                                />
                              </div>
                            </Field>
                          )}
                        </div>
                      </div>

                      <div className="ds-form-section">
                        <div className="ds-form-section-title">
                          <span>03</span>
                          College contact
                        </div>

                        <div className="ds-form-grid">
                          <Field label="Contact person">
                            <input
                              className="ds-input"
                              value={form.contactName}
                              onChange={(event) =>
                                updateForm("contactName", event.target.value)
                              }
                              placeholder="Contact person's name"
                            />
                          </Field>

                          <Field label="Contact email">
                            <input
                              className="ds-input"
                              type="email"
                              value={form.contactEmail}
                              onChange={(event) =>
                                updateForm("contactEmail", event.target.value)
                              }
                              placeholder="name@college.edu"
                            />
                          </Field>

                          <Field label="Contact phone">
                            <input
                              className="ds-input"
                              type="tel"
                              value={form.contactPhone}
                              onChange={(event) =>
                                updateForm("contactPhone", event.target.value)
                              }
                              placeholder="10-digit phone number"
                            />
                          </Field>

                          <Field label="Session status">
                            <PremiumSelect
                              value={form.status}
                              onChange={(value) =>
                                updateForm("status", value)
                              }
                              searchable={false}
                              options={STATUS_OPTIONS.filter(
                                (option) => option.value !== "All"
                              )}
                            />
                          </Field>

                          <Field label="Additional notes" className="span-2">
                            <textarea
                              className="ds-textarea"
                              rows={3}
                              value={form.notes}
                              onChange={(event) =>
                                updateForm("notes", event.target.value)
                              }
                              placeholder="Add instructions or important session details..."
                            />
                          </Field>
                        </div>
                      </div>
                    </div>

                    <div className="ds-modal-footer">
                      <span className="ds-required-note">
                        <span>*</span> Required fields
                      </span>

                      <div className="ds-modal-footer-actions">
                        <button
                          type="button"
                          className="ds-button ds-button-secondary"
                          onClick={closeFormModal}
                        >
                          Cancel
                        </button>

                        <button
                          type="submit"
                          className="ds-button ds-button-primary"
                        >
                          {editingId ? (
                            <Check size={16} />
                          ) : (
                            <CalendarPlus size={16} />
                          )}

                          {editingId ? "Save changes" : "Create schedule"}
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
          DETAIL MODAL
      =================================================== */}

      {typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {detailDemo && (
              <motion.div
                className="ds-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={(event) => {
                  if (event.target === event.currentTarget) {
                    setDetailDemo(null);
                  }
                }}
              >
                <motion.div
                  className="ds-modal ds-detail-modal"
                  initial={{ opacity: 0, y: 18, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 12, scale: 0.98 }}
                >
                  <div className="ds-detail-top">
                    <button
                      type="button"
                      className="ds-modal-close detail-close"
                      onClick={() => setDetailDemo(null)}
                    >
                      <X size={19} />
                    </button>

                    <div className="ds-detail-icon">
                      <CalendarCheck size={24} />
                    </div>

                    <span className="ds-detail-eyebrow">
                      DEMO SESSION DETAILS
                    </span>

                    <h2>{detailDemo.title}</h2>
                    <p>{detailDemo.id}</p>

                    <StatusBadge status={detailDemo.status} />
                  </div>

                  <div className="ds-detail-body ds-scrollbar">
                    <div className="ds-detail-grid">
                      <div className="ds-detail-item">
                        <span className="ds-detail-item-icon">
                          <Building2 size={16} />
                        </span>
                        <div>
                          <small>College</small>
                          <strong>{detailDemo.college}</strong>
                        </div>
                      </div>

                      <div className="ds-detail-item">
                        <span className="ds-detail-item-icon">
                          <GraduationCap size={16} />
                        </span>
                        <div>
                          <small>Course</small>
                          <strong>{detailDemo.course}</strong>
                        </div>
                      </div>

                      <div className="ds-detail-item">
                        <span className="ds-detail-item-icon">
                          <UserRound size={16} />
                        </span>
                        <div>
                          <small>Assigned trainer</small>
                          <strong>{detailDemo.trainer}</strong>
                        </div>
                      </div>

                      <div className="ds-detail-item">
                        <span className="ds-detail-item-icon">
                          <Users size={16} />
                        </span>
                        <div>
                          <small>Expected students</small>
                          <strong>{detailDemo.students}</strong>
                        </div>
                      </div>

                      <div className="ds-detail-item">
                        <span className="ds-detail-item-icon">
                          <CalendarDays size={16} />
                        </span>
                        <div>
                          <small>Date</small>
                          <strong>{formatDate(detailDemo.date)}</strong>
                        </div>
                      </div>

                      <div className="ds-detail-item">
                        <span className="ds-detail-item-icon">
                          <Clock3 size={16} />
                        </span>
                        <div>
                          <small>Time & duration</small>
                          <strong>
                            {formatTime(detailDemo.time)} ·{" "}
                            {detailDemo.duration} min
                          </strong>
                        </div>
                      </div>

                      <div className="ds-detail-item">
                        <span className="ds-detail-item-icon">
                          {detailDemo.mode === "Online" ? (
                            <Video size={16} />
                          ) : (
                            <MapPin size={16} />
                          )}
                        </span>
                        <div>
                          <small>Session mode</small>
                          <strong>{detailDemo.mode}</strong>
                        </div>
                      </div>
                    </div>

                    {(detailDemo.meetingLink || detailDemo.location) && (
                      <div className="ds-detail-link-box">
                        <div>
                          <small>
                            {detailDemo.mode === "Online"
                              ? "Meeting link"
                              : "Venue"}
                          </small>

                          <strong>
                            {detailDemo.meetingLink || detailDemo.location}
                          </strong>
                        </div>

                        {detailDemo.meetingLink && (
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyLink(detailDemo.meetingLink)
                            }
                          >
                            <Copy size={15} />
                            Copy
                          </button>
                        )}
                      </div>
                    )}

                    <div className="ds-detail-contact">
                      <div className="ds-detail-section-heading">
                        College contact
                      </div>

                      <div className="ds-contact-line">
                        <UserRound size={15} />
                        <span>
                          {detailDemo.contactName || "Not provided"}
                        </span>
                      </div>

                      <div className="ds-contact-line">
                        <Mail size={15} />
                        <span>
                          {detailDemo.contactEmail || "Not provided"}
                        </span>
                      </div>

                      <div className="ds-contact-line">
                        <Phone size={15} />
                        <span>
                          {detailDemo.contactPhone || "Not provided"}
                        </span>
                      </div>
                    </div>

                    {detailDemo.notes && (
                      <div className="ds-detail-notes">
                        <div className="ds-detail-section-heading">
                          Session notes
                        </div>
                        <p>{detailDemo.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="ds-detail-footer">
                    <div className="ds-detail-status-control">
                      <span>Update status</span>

                      <PremiumSelect
                        value={detailDemo.status}
                        onChange={(value) =>
                          handleStatusUpdate(detailDemo, value)
                        }
                        searchable={false}
                        options={STATUS_OPTIONS.filter(
                          (option) => option.value !== "All"
                        )}
                      />
                    </div>

                    <div className="ds-modal-footer-actions">
                      <button
                        type="button"
                        className="ds-button ds-button-secondary"
                        onClick={() => handleDelete(detailDemo)}
                      >
                        <Trash2 size={15} />
                        Delete
                      </button>

                      <button
                        type="button"
                        className="ds-button ds-button-primary"
                        onClick={() => openEditModal(detailDemo)}
                      >
                        <Pencil size={15} />
                        Edit demo
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
            className="ds-toast"
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.96 }}
          >
            <span className="ds-toast-icon">
              <Check size={15} />
            </span>
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =========================================================
   PREMIUM PAGE STYLES
========================================================= */

const PAGE_STYLES = `
.ds-page {
  --ds-orange: #f4512b;
  --ds-orange-dark: #df3f1d;
  --ds-orange-soft: #fff0ea;
  --ds-ink: #202633;
  --ds-muted: #87909e;
  --ds-line: #edf0f3;
  --ds-surface: #ffffff;
  --ds-bg: #f7f8fa;

  width: 100%;
  min-width: 0;
  color: var(--ds-ink);
  font-family: Inter, ui-sans-serif, system-ui, -apple-system,
    BlinkMacSystemFont, "Segoe UI", sans-serif;
  padding: 2px 2px 28px;
  position: relative;
}

.ds-page *,
.ds-page *::before,
.ds-page *::after {
  box-sizing: border-box;
}

.ds-page button,
.ds-page input,
.ds-page textarea {
  font: inherit;
}

.ds-page button {
  cursor: pointer;
}

.ds-page button:focus-visible,
.ds-page input:focus-visible,
.ds-page textarea:focus-visible {
  outline: 3px solid rgba(244, 81, 43, 0.16);
  outline-offset: 2px;
}

/* SCROLLBAR THEME */

.ds-scrollbar,
.ds-dropdown-menu,
.ds-modal-body,
.ds-detail-body {
  scrollbar-width: thin;
  scrollbar-color: #f58b70 #fff0ea;
}

.ds-scrollbar::-webkit-scrollbar,
.ds-dropdown-menu::-webkit-scrollbar,
.ds-modal-body::-webkit-scrollbar,
.ds-detail-body::-webkit-scrollbar {
  width: 7px;
  height: 7px;
}

.ds-scrollbar::-webkit-scrollbar-track,
.ds-dropdown-menu::-webkit-scrollbar-track,
.ds-modal-body::-webkit-scrollbar-track,
.ds-detail-body::-webkit-scrollbar-track {
  background: #fff2ed;
  border-radius: 20px;
}

.ds-scrollbar::-webkit-scrollbar-thumb,
.ds-dropdown-menu::-webkit-scrollbar-thumb,
.ds-modal-body::-webkit-scrollbar-thumb,
.ds-detail-body::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #ffad94, #f4512b);
  border: 2px solid #fff2ed;
  border-radius: 20px;
}

.ds-scrollbar::-webkit-scrollbar-thumb:hover,
.ds-dropdown-menu::-webkit-scrollbar-thumb:hover,
.ds-modal-body::-webkit-scrollbar-thumb:hover,
.ds-detail-body::-webkit-scrollbar-thumb:hover {
  background: #df3f1d;
}

/* HEADER */

.ds-page-header {
  margin-bottom: 24px;
}

.ds-breadcrumb {
  display: flex;
  align-items: center;
  gap: 9px;
  margin-bottom: 19px;
  color: #929aa6;
  font-size: 12px;
  font-weight: 600;
}

.ds-breadcrumb-separator {
  color: #c9cdd3;
}

.ds-breadcrumb .current {
  color: #4b5563;
}

.ds-header-main {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.ds-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: var(--ds-orange);
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 1.55px;
  margin-bottom: 9px;
}

.ds-eyebrow-dot {
  width: 7px;
  height: 7px;
  display: inline-block;
  background: var(--ds-orange);
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(244, 81, 43, 0.1);
}

.ds-header-main h1 {
  margin: 0;
  color: #202633;
  font-size: clamp(25px, 3vw, 32px);
  letter-spacing: -1.15px;
  font-weight: 790;
  line-height: 1.2;
}

.ds-header-main h1 span {
  color: var(--ds-orange);
}

.ds-page-description {
  color: #89919d;
  font-size: 13px;
  margin: 9px 0 0;
  line-height: 1.65;
}

.ds-header-actions {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

/* BUTTONS */

.ds-button {
  height: 42px;
  padding: 0 16px;
  border-radius: 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 700;
  border: 1px solid transparent;
  transition: 0.2s ease;
  white-space: nowrap;
}

.ds-button-primary {
  color: white;
  background: linear-gradient(135deg, #ff704c, #f4512b);
  border-color: #f4512b;
  box-shadow: 0 5px 13px rgba(244, 81, 43, 0.17);
}

.ds-button-primary:hover {
  background: linear-gradient(135deg, #f45d38, #df3f1d);
  box-shadow: 0 7px 17px rgba(244, 81, 43, 0.23);
  transform: translateY(-1px);
}

.ds-button-secondary {
  color: #5e6876;
  background: white;
  border-color: #e7e9ed;
}

.ds-button-secondary:hover {
  color: var(--ds-orange);
  background: #fffaf8;
  border-color: #ffc6b6;
}

/* STATS */

.ds-stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
  margin-bottom: 21px;
}

.ds-stat-card {
  min-width: 0;
  padding: 18px 19px 17px;
  border: 1px solid #edf0f2;
  border-radius: 15px;
  background: white;
  box-shadow: 0 3px 14px rgba(25, 35, 50, 0.025);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.ds-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 9px 23px rgba(25, 35, 50, 0.055);
}

.ds-stat-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}

.ds-stat-icon {
  width: 39px;
  height: 39px;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
}

.ds-stat-icon.orange {
  color: #f4512b;
  background: #fff0ea;
}

.ds-stat-icon.green {
  color: #22966b;
  background: #eaf8f1;
}

.ds-stat-icon.blue {
  color: #3979d8;
  background: #edf4ff;
}

.ds-stat-icon.purple {
  color: #8762d4;
  background: #f3efff;
}

.ds-stat-note {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  color: #9ba3ae;
  font-size: 10px;
  font-weight: 600;
}

.ds-stat-note svg {
  color: #299d72;
}

.ds-stat-value {
  color: #232a37;
  font-size: 26px;
  line-height: 1.15;
  letter-spacing: -0.9px;
  font-weight: 800;
  margin-bottom: 5px;
}

.ds-stat-title {
  color: #596373;
  font-size: 12px;
  font-weight: 700;
}

.ds-stat-subtitle {
  color: #a1a8b2;
  font-size: 10px;
  margin-top: 5px;
}

/* CONTENT CARD */

.ds-content-card {
  border: 1px solid #eceff2;
  border-radius: 16px;
  background: white;
  overflow: visible;
  box-shadow: 0 4px 18px rgba(22, 34, 50, 0.025);
}

.ds-content-heading {
  padding: 19px 21px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  border-bottom: 1px solid #f0f1f3;
}

.ds-content-title-line {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ds-section-icon {
  width: 39px;
  height: 39px;
  border-radius: 11px;
  color: var(--ds-orange);
  background: #fff1eb;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-content-heading h2 {
  margin: 0;
  color: #29303d;
  font-size: 14px;
  font-weight: 800;
  letter-spacing: -0.2px;
}

.ds-content-heading p {
  margin: 5px 0 0;
  color: #9aa2ad;
  font-size: 11px;
}

.ds-record-count {
  color: #818a97;
  border: 1px solid #eceff2;
  background: #fafbfc;
  border-radius: 30px;
  padding: 7px 11px;
  display: inline-flex;
  gap: 7px;
  align-items: center;
  font-size: 10px;
  font-weight: 700;
  white-space: nowrap;
}

.ds-record-count-dot {
  height: 6px;
  width: 6px;
  border-radius: 50%;
  background: #26966a;
}

/* TOOLBAR */

.ds-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding: 15px 20px;
  border-bottom: 1px solid #f0f1f3;
}

.ds-search-box {
  height: 40px;
  min-width: 190px;
  max-width: 340px;
  flex: 1;
  padding: 0 11px;
  display: flex;
  align-items: center;
  gap: 9px;
  border: 1px solid #e9ecf0;
  border-radius: 9px;
  background: #fcfcfd;
  color: #a0a8b2;
  transition: 0.2s ease;
}

.ds-search-box:focus-within {
  border-color: #f6a08a;
  background: white;
  box-shadow: 0 0 0 3px rgba(244, 81, 43, 0.07);
}

.ds-search-box input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #353d49;
  font-size: 11px;
}

.ds-search-box input::placeholder {
  color: #aab1ba;
}

.ds-search-box > button {
  flex-shrink: 0;
  color: #9ca4af;
  border: 0;
  background: transparent;
  display: flex;
  padding: 3px;
}

.ds-search-box > button:hover {
  color: var(--ds-orange);
}

.ds-toolbar-filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}

.ds-filter-select {
  width: 125px;
}

.ds-filter-select.status-filter {
  width: 132px;
}

.ds-filter-select.date-filter {
  width: 132px;
}

.ds-sort-select {
  width: 180px;
  display: flex;
  align-items: center;
  gap: 7px;
  padding-left: 9px;
  border-left: 1px solid #eceff2;
  color: #89919d;
}

.ds-sort-select .ds-select-trigger {
  border: 0;
  padding-left: 3px;
  background: transparent;
}

/* PREMIUM CUSTOM DROPDOWN */

.ds-select-trigger {
  height: 40px;
  width: 100%;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 9px;
  padding: 0 11px;
  color: #596373;
  background: #fff;
  border: 1px solid #e8ebef;
  border-radius: 9px;
  text-align: left;
  transition: 0.18s ease;
  font-size: 11px;
  font-weight: 650;
}

.ds-select-trigger:hover {
  border-color: #f5b09e;
  background: #fffdfc;
}

.ds-select-trigger.is-open {
  border-color: #f28d73;
  box-shadow: 0 0 0 3px rgba(244, 81, 43, 0.075);
}

.ds-select-trigger:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.ds-select-value,
.ds-select-placeholder {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ds-select-value {
  color: #4b5563;
}

.ds-select-placeholder {
  color: #a1a8b2;
}

.ds-select-chevron {
  flex-shrink: 0;
  color: #939ca8;
  transition: transform 0.18s ease;
}

.ds-select-chevron.rotated {
  transform: rotate(180deg);
  color: var(--ds-orange);
}

.ds-dropdown-menu {
  z-index: 99999;
  overflow: hidden;
  min-width: 210px;
  max-width: calc(100vw - 24px);
  display: flex;
  flex-direction: column;
  background: white;
  border: 1px solid #f0e4df;
  border-radius: 12px;
  box-shadow: 0 17px 45px rgba(35, 42, 55, 0.16),
    0 3px 9px rgba(35, 42, 55, 0.05);
  padding: 6px;
}

.ds-dropdown-search {
  min-height: 37px;
  flex-shrink: 0;
  margin-bottom: 5px;
  padding: 0 9px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #9ba3ae;
  background: #fafafa;
  border: 1px solid #f0f1f3;
  border-radius: 8px;
}

.ds-dropdown-search input {
  width: 100%;
  min-width: 0;
  border: 0;
  outline: 0;
  background: transparent;
  color: #424b59;
  font-size: 11px;
}

.ds-dropdown-search input::placeholder {
  color: #aab1ba;
}

.ds-dropdown-search button {
  color: #9ba3ae;
  padding: 2px;
  display: flex;
  border: 0;
  background: transparent;
}

.ds-dropdown-options {
  min-height: 0;
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 2px;
}

.ds-dropdown-option {
  width: 100%;
  min-height: 37px;
  padding: 8px 9px;
  border: 0;
  background: transparent;
  border-radius: 7px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  color: #626c79;
  text-align: left;
  transition: 0.14s ease;
}

.ds-dropdown-option:hover {
  color: #e64a27;
  background: #fff5f1;
}

.ds-dropdown-option.active {
  color: #e84c29;
  background: #fff0ea;
  font-weight: 750;
}

.ds-option-copy {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.ds-option-label {
  font-size: 11px;
  line-height: 1.4;
}

.ds-option-description {
  color: #a2a9b2;
  font-size: 9px;
}

.ds-option-check {
  color: var(--ds-orange);
  width: 21px;
  height: 21px;
  flex-shrink: 0;
  background: white;
  border: 1px solid #ffdbd0;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ds-dropdown-empty {
  color: #99a1ab;
  padding: 22px 10px;
  text-align: center;
  font-size: 11px;
}

.ds-dropdown-footer {
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
  padding: 8px 5px 2px;
  margin-top: 4px;
  border-top: 1px solid #f1f1f2;
  color: #a2a9b2;
  font-size: 9px;
}

/* ACTIVE FILTERS */

.ds-active-filters {
  min-height: 40px;
  padding: 8px 20px;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 7px;
  border-bottom: 1px solid #f0f1f3;
  background: #fffdfc;
}

.ds-active-filter-label {
  display: flex;
  align-items: center;
  gap: 5px;
  color: #9aa1aa;
  font-size: 10px;
  font-weight: 700;
  margin-right: 2px;
}

.ds-filter-chip {
  border: 1px solid #ffddd2;
  border-radius: 30px;
  padding: 5px 8px;
  background: white;
  display: flex;
  align-items: center;
  gap: 6px;
  color: #db5738;
  font-size: 10px;
  font-weight: 600;
}

.ds-filter-chip:hover {
  background: #fff0ea;
}

.ds-clear-filters {
  color: #858e9a;
  background: transparent;
  border: 0;
  font-size: 10px;
  font-weight: 700;
  padding: 5px;
}

.ds-clear-filters:hover {
  color: var(--ds-orange);
}

/* TABLE */

.ds-table-wrap {
  width: 100%;
  overflow-x: auto;
}

.ds-table {
  width: 100%;
  min-width: 1080px;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
}

.ds-table thead th {
  height: 43px;
  padding: 0 13px;
  color: #a0a7b0;
  background: #fbfcfd;
  border-bottom: 1px solid #edf0f2;
  font-size: 9px;
  letter-spacing: 0.7px;
  font-weight: 800;
  white-space: nowrap;
}

.ds-table thead th:first-child,
.ds-table tbody td:first-child {
  padding-left: 20px;
}

.ds-table thead th:last-child,
.ds-table tbody td:last-child {
  padding-right: 20px;
}

.ds-table tbody td {
  height: 76px;
  padding: 11px 13px;
  color: #606a78;
  border-bottom: 1px solid #f0f1f3;
  font-size: 11px;
  vertical-align: middle;
}

.ds-table tbody tr {
  transition: background 0.16s ease;
}

.ds-table tbody tr:hover {
  background: #fffdfc;
}

.ds-table tbody tr:last-child td {
  border-bottom: 0;
}

.ds-actions-heading {
  text-align: right;
}

/* DEMO CELL */

.ds-demo-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 200px;
}

.ds-demo-avatar {
  height: 36px;
  width: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--ds-orange);
  background: #fff1eb;
  border: 1px solid #ffe6dd;
  border-radius: 10px;
}

.ds-demo-copy {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ds-demo-title {
  max-width: 220px;
  padding: 0;
  border: 0;
  color: #36404d;
  background: transparent;
  text-align: left;
  font-size: 11px;
  font-weight: 750;
  line-height: 1.35;
  transition: color 0.15s ease;
}

.ds-demo-title:hover {
  color: var(--ds-orange);
}

.ds-demo-id {
  color: #a3aab4;
  font-size: 9px;
  font-weight: 650;
  letter-spacing: 0.2px;
}

/* COLLEGE */

.ds-college-cell {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 165px;
  max-width: 195px;
}

.ds-college-name {
  color: #4a5461;
  font-size: 10px;
  font-weight: 700;
  line-height: 1.4;
}

.ds-course-name {
  display: flex;
  gap: 5px;
  align-items: center;
  color: #9ba3ae;
  font-size: 9px;
}

.ds-course-name svg {
  color: #e98b73;
  flex-shrink: 0;
}

/* TRAINER */

.ds-trainer-cell {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 115px;
  color: #586272;
  font-size: 10px;
  font-weight: 650;
  white-space: nowrap;
}

.ds-trainer-avatar {
  height: 27px;
  width: 27px;
  flex-shrink: 0;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #b24e35;
  background: #fff0e9;
  border: 1px solid #ffe1d6;
  font-size: 9px;
  font-weight: 800;
}

/* DATE */

.ds-date-cell {
  min-width: 145px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ds-calendar-date {
  width: 33px;
  height: 38px;
  border: 1px solid #ffe0d6;
  border-radius: 8px;
  background: #fff8f5;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.ds-calendar-date span {
  color: #dc5131;
  font-size: 12px;
  font-weight: 850;
  line-height: 1.05;
}

.ds-calendar-date small {
  margin-top: 2px;
  color: #d18a78;
  font-size: 8px;
  font-weight: 700;
  text-transform: uppercase;
}

.ds-date-copy {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ds-date-copy strong {
  color: #5d6673;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

.ds-date-copy span {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #9aa2ad;
  font-size: 9px;
}

/* MODE BADGE */

.ds-mode-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  border-radius: 30px;
  padding: 6px 9px;
  font-size: 9px;
  font-weight: 750;
  white-space: nowrap;
}

.ds-mode-badge.online {
  color: #32836d;
  background: #eaf8f2;
}

.ds-mode-badge.offline {
  color: #8c68bb;
  background: #f4effb;
}

/* STATUS */

.ds-status-badge {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 9px;
  border-radius: 30px;
  font-size: 9px;
  font-weight: 750;
  white-space: nowrap;
}

.ds-status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.ds-status-badge.scheduled {
  color: #26845e;
  background: #eaf7f0;
}

.ds-status-badge.scheduled .ds-status-dot {
  background: #26966a;
}

.ds-status-badge.completed {
  color: #3974c3;
  background: #edf4ff;
}

.ds-status-badge.completed .ds-status-dot {
  background: #3979d8;
}

.ds-status-badge.pending {
  color: #a5761b;
  background: #fff7e8;
}

.ds-status-badge.pending .ds-status-dot {
  background: #d99727;
}

.ds-status-badge.cancelled {
  color: #c04b4b;
  background: #fff0f0;
}

.ds-status-badge.cancelled .ds-status-dot {
  background: #d95c5c;
}

/* ROW ACTIONS */

.ds-row-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 5px;
  white-space: nowrap;
}

.ds-icon-button {
  width: 29px;
  height: 29px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: 8px;
  color: #929ba7;
  background: transparent;
  transition: 0.16s ease;
}

.ds-icon-button:hover {
  color: #e9512e;
  background: #fff1eb;
  border-color: #ffe0d5;
}

.ds-icon-button.danger:hover {
  color: #cf4949;
  background: #fff0f0;
  border-color: #ffdddd;
}

/* EMPTY STATE */

.ds-empty-state {
  min-height: 260px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 25px;
}

.ds-empty-icon {
  width: 54px;
  height: 54px;
  margin-bottom: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 15px;
  color: var(--ds-orange);
  background: #fff1eb;
}

.ds-empty-state h3 {
  color: #35404e;
  margin: 0;
  font-size: 14px;
  font-weight: 800;
}

.ds-empty-state p {
  max-width: 340px;
  margin: 7px 0 16px;
  color: #9aa2ad;
  font-size: 11px;
  line-height: 1.6;
}

.ds-mobile-list {
  display: none;
}

/* TABLE FOOTER */

.ds-table-footer {
  min-height: 47px;
  padding: 0 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  border-top: 1px solid #eff1f3;
  color: #9ca4ae;
  font-size: 10px;
}

.ds-table-footer strong {
  color: #687280;
  font-weight: 800;
}

.ds-footer-updated {
  display: flex;
  align-items: center;
  gap: 7px;
}

.ds-footer-updated span {
  width: 6px;
  height: 6px;
  background: #2ba576;
  border-radius: 50%;
  box-shadow: 0 0 0 3px #eaf7f0;
}

/* BOTTOM INFO */

.ds-bottom-info {
  min-height: 82px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  gap: 13px;
  margin-top: 17px;
  padding: 15px 19px;
  border: 1px solid #ffe4da;
  border-radius: 14px;
  background: linear-gradient(100deg, #fff8f4 0%, #fffdfb 55%, #fff5f0 100%);
}

.ds-bottom-info-icon {
  height: 39px;
  width: 39px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 11px;
  color: #e9502d;
  background: white;
  border: 1px solid #ffe5db;
}

.ds-bottom-info strong {
  color: #4f5967;
  font-size: 11px;
  font-weight: 800;
}

.ds-bottom-info p {
  color: #989faa;
  font-size: 10px;
  margin: 5px 0 0;
  line-height: 1.5;
}

.ds-bottom-decoration {
  position: absolute;
  right: 25px;
  bottom: -11px;
  color: rgba(244, 81, 43, 0.12);
  transform: rotate(-12deg);
}

/* MODALS */

.ds-modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 99990;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(24, 30, 40, 0.48);
  backdrop-filter: blur(5px);
  -webkit-backdrop-filter: blur(5px);
}

.ds-modal {
  width: min(100%, 760px);
  max-height: min(91vh, 900px);
  display: flex;
  flex-direction: column;
  overflow: visible;
  background: white;
  border: 1px solid rgba(255, 255, 255, 0.7);
  border-radius: 17px;
  box-shadow: 0 25px 85px rgba(22, 29, 40, 0.22);
}

.ds-modal-header {
  min-height: 89px;
  padding: 19px 22px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 15px;
  border-bottom: 1px solid #eff1f3;
}

.ds-modal-heading {
  display: flex;
  align-items: center;
  gap: 12px;
}

.ds-modal-heading-icon {
  width: 43px;
  height: 43px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffe1d6;
  border-radius: 12px;
  color: var(--ds-orange);
  background: #fff1eb;
}

.ds-modal-eyebrow {
  display: block;
  color: #ec775b;
  font-size: 9px;
  letter-spacing: 1.1px;
  font-weight: 800;
  margin-bottom: 5px;
}

.ds-modal-heading h2 {
  margin: 0;
  color: #28313e;
  font-size: 17px;
  font-weight: 800;
  letter-spacing: -0.4px;
}

.ds-modal-heading p {
  margin: 5px 0 0;
  color: #9ba2ad;
  font-size: 10px;
}

.ds-modal-close {
  width: 33px;
  height: 33px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border: 1px solid #eceef0;
  border-radius: 9px;
  color: #8f98a3;
  background: white;
  transition: 0.17s ease;
}

.ds-modal-close:hover {
  color: #dd4d2d;
  border-color: #ffd9ce;
  background: #fff5f1;
}

.ds-modal-body {
  min-height: 0;
  overflow-y: auto;
  overflow-x: visible;
  padding: 20px 22px;
}

.ds-form-section + .ds-form-section {
  margin-top: 24px;
  padding-top: 19px;
  border-top: 1px solid #f0f1f3;
}

.ds-form-section-title {
  display: flex;
  align-items: center;
  gap: 9px;
  color: #3b4552;
  font-size: 11px;
  font-weight: 800;
  margin-bottom: 15px;
}

.ds-form-section-title > span {
  height: 23px;
  width: 23px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 7px;
  color: #e85331;
  background: #fff0ea;
  font-size: 9px;
  font-weight: 850;
}

.ds-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 15px 16px;
}

.ds-field {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.ds-field.span-2 {
  grid-column: span 2;
}

.ds-field-label {
  color: #596371;
  font-size: 10px;
  font-weight: 750;
}

.ds-required {
  color: #eb5735;
  margin-left: 3px;
}

.ds-input,
.ds-textarea {
  width: 100%;
  min-width: 0;
  color: #3d4754;
  border: 1px solid #e7eaee;
  border-radius: 9px;
  background: #fff;
  outline: 0;
  font-size: 11px;
  transition: 0.18s ease;
}

.ds-input {
  height: 40px;
  padding: 0 11px;
}

.ds-textarea {
  padding: 10px 11px;
  resize: vertical;
  min-height: 83px;
  line-height: 1.55;
}

.ds-input:hover,
.ds-textarea:hover {
  border-color: #f2b19f;
}

.ds-input:focus,
.ds-textarea:focus {
  border-color: #f28d73;
  box-shadow: 0 0 0 3px rgba(244, 81, 43, 0.07);
}

.ds-input::placeholder,
.ds-textarea::placeholder {
  color: #adb4bd;
}

.ds-input[type="date"],
.ds-input[type="time"] {
  color-scheme: light;
}

.ds-input[type="date"]::-webkit-calendar-picker-indicator,
.ds-input[type="time"]::-webkit-calendar-picker-indicator {
  cursor: pointer;
  opacity: 0.7;
  accent-color: var(--ds-orange);
}

.ds-field .ds-select-trigger {
  height: 40px;
  font-size: 11px;
}

.ds-field-hint {
  color: #a1a8b1;
  font-size: 9px;
  line-height: 1.4;
}

.ds-input-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.ds-input-icon-wrap > svg {
  position: absolute;
  left: 11px;
  z-index: 1;
  color: #a2aab4;
  pointer-events: none;
}

.ds-input.has-icon {
  padding-left: 34px;
}

.ds-modal-footer {
  min-height: 65px;
  padding: 12px 22px;
  border-top: 1px solid #eff1f3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 0 0 17px 17px;
}

.ds-required-note {
  color: #9aa2ac;
  font-size: 9px;
}

.ds-required-note span {
  color: #ed5534;
  font-weight: 900;
}

.ds-modal-footer-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

/* DETAIL MODAL */

.ds-detail-modal {
  width: min(100%, 660px);
  max-height: min(90vh, 820px);
}

.ds-detail-top {
  position: relative;
  overflow: hidden;
  padding: 25px 24px 20px;
  text-align: center;
  background:
    radial-gradient(circle at 90% 10%, rgba(244, 81, 43, 0.1), transparent 35%),
    linear-gradient(145deg, #fff9f6, #ffffff);
  border-bottom: 1px solid #f1eeec;
  border-radius: 17px 17px 0 0;
}

.ds-detail-top .detail-close {
  position: absolute;
  right: 17px;
  top: 17px;
}

.ds-detail-icon {
  width: 49px;
  height: 49px;
  margin: 0 auto 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid #ffdfd4;
  border-radius: 14px;
  color: var(--ds-orange);
  background: white;
  box-shadow: 0 5px 15px rgba(244, 81, 43, 0.08);
}

.ds-detail-eyebrow {
  color: #e97b60;
  font-size: 9px;
  font-weight: 850;
  letter-spacing: 1.2px;
}

.ds-detail-top h2 {
  max-width: 490px;
  margin: 7px auto 4px;
  color: #303946;
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.45px;
}

.ds-detail-top > p {
  margin: 0 0 11px;
  color: #9ba3ae;
  font-size: 10px;
  font-weight: 650;
}

.ds-detail-body {
  min-height: 0;
  overflow-y: auto;
  padding: 19px 23px;
}

.ds-detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.ds-detail-item {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  min-width: 0;
  padding: 12px;
  border: 1px solid #eef0f3;
  border-radius: 10px;
  background: #fff;
}

.ds-detail-item-icon {
  width: 30px;
  height: 30px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ec704f;
  background: #fff2ed;
  border-radius: 8px;
}

.ds-detail-item > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ds-detail-item small,
.ds-detail-link-box small {
  color: #a0a7b0;
  font-size: 9px;
  font-weight: 600;
}

.ds-detail-item strong {
  color: #4e5967;
  font-size: 10px;
  line-height: 1.45;
  font-weight: 750;
  overflow-wrap: anywhere;
}

.ds-detail-link-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px;
  margin-top: 12px;
  border: 1px solid #ffe4da;
  border-radius: 10px;
  background: #fff9f6;
}

.ds-detail-link-box > div {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.ds-detail-link-box strong {
  color: #c65b40;
  font-size: 10px;
  overflow-wrap: anywhere;
  font-weight: 700;
}

.ds-detail-link-box button {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 7px 9px;
  color: #d95130;
  background: white;
  border: 1px solid #ffddd2;
  border-radius: 7px;
  font-size: 9px;
  font-weight: 750;
}

.ds-detail-contact,
.ds-detail-notes {
  margin-top: 17px;
}

.ds-detail-section-heading {
  margin-bottom: 9px;
  color: #4c5664;
  font-size: 11px;
  font-weight: 800;
}

.ds-contact-line {
  min-height: 29px;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #78828e;
  font-size: 10px;
}

.ds-contact-line svg {
  color: #e5836c;
}

.ds-detail-notes p {
  padding: 11px;
  margin: 0;
  border: 1px solid #eff0f2;
  border-radius: 9px;
  color: #818a96;
  background: #fbfcfd;
  font-size: 10px;
  line-height: 1.6;
}

.ds-detail-footer {
  padding: 12px 19px;
  border-top: 1px solid #eff1f3;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
}

.ds-detail-status-control {
  min-width: 145px;
  display: flex;
  align-items: center;
  gap: 8px;
}

.ds-detail-status-control > span {
  color: #858e99;
  font-size: 9px;
  font-weight: 700;
  white-space: nowrap;
}

.ds-detail-status-control .ds-select-trigger {
  height: 34px;
  min-width: 120px;
}

/* TOAST */

.ds-toast {
  position: fixed;
  left: 50%;
  bottom: 25px;
  z-index: 100010;
  transform: translateX(-50%);
  min-height: 43px;
  max-width: calc(100vw - 30px);
  padding: 9px 15px 9px 10px;
  display: flex;
  align-items: center;
  gap: 9px;
  color: #3f4955;
  background: white;
  border: 1px solid #e9ecef;
  border-radius: 11px;
  box-shadow: 0 9px 35px rgba(26, 35, 48, 0.16);
  font-size: 11px;
  font-weight: 700;
}

.ds-toast-icon {
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #21895f;
  background: #e9f8f0;
  border-radius: 7px;
}

/* MOBILE EMPTY */

.ds-mobile-empty {
  min-height: 190px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 9px;
  color: #a1a9b3;
  font-size: 11px;
}

.ds-mobile-empty svg {
  color: var(--ds-orange);
}

.ds-mobile-empty strong {
  color: #586371;
}

/* RESPONSIVE */

@media (max-width: 1180px) {
  .ds-toolbar {
    align-items: flex-start;
    flex-direction: column;
  }

  .ds-search-box {
    max-width: none;
    width: 100%;
  }

  .ds-toolbar-filters {
    width: 100%;
  }
}

@media (max-width: 900px) {
  .ds-stats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ds-header-main {
    align-items: flex-start;
    flex-direction: column;
  }

  .ds-header-actions {
    width: 100%;
  }

  .ds-toolbar-filters {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .ds-filter-select,
  .ds-filter-select.status-filter,
  .ds-filter-select.date-filter,
  .ds-sort-select {
    width: 100%;
  }

  .ds-sort-select {
    padding-left: 0;
    border: 0;
  }
}

@media (max-width: 680px) {
  .ds-page {
    padding: 0 0 22px;
  }

  .ds-page-header {
    margin-bottom: 17px;
  }

  .ds-breadcrumb {
    margin-bottom: 13px;
  }

  .ds-header-main h1 {
    font-size: 27px;
  }

  .ds-page-description {
    font-size: 11px;
  }

  .ds-header-actions {
    gap: 8px;
  }

  .ds-header-actions .ds-button {
    flex: 1;
    padding: 0 9px;
    font-size: 10px;
  }

  .ds-stats-grid {
    gap: 9px;
    margin-bottom: 14px;
  }

  .ds-stat-card {
    padding: 13px;
    border-radius: 12px;
  }

  .ds-stat-icon {
    width: 33px;
    height: 33px;
  }

  .ds-stat-value {
    font-size: 22px;
  }

  .ds-stat-title {
    font-size: 10px;
  }

  .ds-stat-subtitle {
    font-size: 9px;
  }

  .ds-stat-note {
    font-size: 8px;
  }

  .ds-content-card {
    border-radius: 13px;
  }

  .ds-content-heading {
    padding: 14px;
  }

  .ds-content-heading p {
    font-size: 9px;
  }

  .ds-record-count {
    padding: 6px 8px;
    font-size: 9px;
  }

  .ds-toolbar {
    padding: 12px;
  }

  .ds-toolbar-filters {
    gap: 7px;
  }

  .ds-table-wrap {
    display: none;
  }

  .ds-mobile-list {
    display: flex;
    flex-direction: column;
    gap: 9px;
    padding: 11px;
  }

  .ds-mobile-card {
    min-width: 0;
    padding: 12px;
    border: 1px solid #edf0f2;
    border-radius: 11px;
    background: white;
  }

  .ds-mobile-card-top {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .ds-mobile-card-title {
    min-width: 0;
    flex: 1;
  }

  .ds-mobile-card-title h3 {
    margin: 0;
    color: #46515e;
    font-size: 11px;
    font-weight: 800;
    line-height: 1.4;
  }

  .ds-mobile-card-title span {
    display: block;
    margin-top: 4px;
    color: #a1a9b2;
    font-size: 9px;
  }

  .ds-mobile-card-top > .ds-status-badge {
    font-size: 8px;
    padding: 5px 7px;
  }

  .ds-mobile-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 9px;
    padding: 12px 0;
    margin-top: 10px;
    border-top: 1px solid #f0f1f3;
    border-bottom: 1px solid #f0f1f3;
  }

  .ds-mobile-meta > span {
    min-width: 0;
    display: flex;
    align-items: flex-start;
    gap: 6px;
    color: #7c8692;
    font-size: 9px;
    line-height: 1.45;
    overflow-wrap: anywhere;
  }

  .ds-mobile-meta svg {
    flex-shrink: 0;
    color: #e78067;
  }

  .ds-mobile-card-footer {
    padding-top: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .ds-mobile-card-footer .ds-row-actions {
    gap: 2px;
  }

  .ds-table-footer {
    padding: 0 12px;
    font-size: 9px;
  }

  .ds-bottom-info {
    padding: 13px;
  }

  .ds-bottom-info p {
    max-width: 270px;
  }

  .ds-bottom-decoration {
    right: -3px;
    opacity: 0.6;
  }

  .ds-modal-backdrop {
    padding: 10px;
  }

  .ds-modal {
    max-height: 94vh;
    border-radius: 14px;
  }

  .ds-modal-header {
    padding: 14px;
  }

  .ds-modal-heading h2 {
    font-size: 14px;
  }

  .ds-modal-body {
    padding: 15px;
  }

  .ds-form-grid {
    gap: 12px 10px;
  }

  .ds-modal-footer {
    padding: 11px 14px;
  }

  .ds-required-note {
    display: none;
  }

  .ds-modal-footer-actions {
    width: 100%;
  }

  .ds-modal-footer-actions .ds-button {
    flex: 1;
    padding: 0 9px;
    font-size: 10px;
  }

  .ds-detail-grid {
    gap: 7px;
  }

  .ds-detail-item {
    padding: 9px;
    gap: 7px;
  }

  .ds-detail-item-icon {
    width: 25px;
    height: 25px;
  }

  .ds-detail-item strong {
    font-size: 9px;
  }

  .ds-detail-footer {
    padding: 11px;
  }
}

@media (max-width: 430px) {
  .ds-toolbar-filters {
    grid-template-columns: 1fr 1fr;
  }

  .ds-sort-select {
    grid-column: span 2;
  }

  .ds-form-grid {
    grid-template-columns: 1fr;
  }

  .ds-field.span-2 {
    grid-column: span 1;
  }

  .ds-detail-grid {
    grid-template-columns: 1fr;
  }

  .ds-detail-status-control {
    width: 100%;
    justify-content: space-between;
  }

  .ds-detail-status-control .ds-select-trigger {
    width: 160px;
  }

  .ds-detail-footer {
    align-items: stretch;
  }

  .ds-detail-footer .ds-modal-footer-actions {
    width: 100%;
  }
}
`;
