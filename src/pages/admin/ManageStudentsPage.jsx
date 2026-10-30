import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
} from "recharts";

import {
    Activity,
    ArrowRight,
    ArrowUpRight,
    Ban,
    BookOpen,
    Building2,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    CircleAlert,
    Clock3,
    Download,
    Eye,
    FileSpreadsheet,
    Filter,
    GraduationCap,
    Mail,
    Phone,
    Plus,
    RefreshCw,
    Search,
    SlidersHorizontal,
    TrendingUp,
    UserCheck,
    UserX,
    Users,
    X,
} from "lucide-react";

/* =====================================================
   THEME
===================================================== */

const COLORS = {
    orange: "#F4512B",
    orangeDark: "#D9411F",
    orangeLight: "#FFF0EA",
    orangeSoft: "#FFF8F5",

    white: "#FFFFFF",
    background: "#F7F7F7",
    border: "#E8E8E8",

    black: "#252525",
    text: "#454545",
    muted: "#606060",

    green: "#218653",
    greenLight: "#EAF7EE",

    blue: "#347FC7",
    blueLight: "#EDF5FF",

    purple: "#8058BE",
    purpleLight: "#F4EEFF",

    red: "#C83D3D",
    redLight: "#FFF0F0",

    yellow: "#996515",
    yellowLight: "#FFF7DF",
};

/* =====================================================
   DEMO STUDENT RECORDS

   Demo data only.
   Connect the backend API to load real students.
===================================================== */

const initialStudents = [
    {
        id: "STU-2401",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 43210",
        college: "Engineering College Jaipur",
        course: "Full Stack Development",
        joined: "2026-10-20",
        status: "Active",
        progress: 86,
        lastActive: "5 minutes ago",
    },
    {
        id: "STU-2402",
        name: "Priya Verma",
        email: "priya.verma@example.com",
        phone: "+91 98765 43211",
        college: "Tech Institute Kota",
        course: "Python AI / ML",
        joined: "2026-10-18",
        status: "Active",
        progress: 72,
        lastActive: "15 minutes ago",
    },
    {
        id: "STU-2403",
        name: "Rahul Meena",
        email: "rahul.meena@example.com",
        phone: "+91 98765 43212",
        college: "Engineering College Jaipur",
        course: "Java and DSA",
        joined: "2026-10-16",
        status: "Pending",
        progress: 18,
        lastActive: "2 days ago",
    },
    {
        id: "STU-2404",
        name: "Sneha Gupta",
        email: "sneha.gupta@example.com",
        phone: "+91 98765 43213",
        college: "Institute of Technology Ajmer",
        course: "Data Science",
        joined: "2026-10-14",
        status: "Active",
        progress: 91,
        lastActive: "10 minutes ago",
    },
    {
        id: "STU-2405",
        name: "Aditya Singh",
        email: "aditya.singh@example.com",
        phone: "+91 98765 43214",
        college: "Tech Institute Kota",
        course: "Full Stack Development",
        joined: "2026-10-12",
        status: "Inactive",
        progress: 34,
        lastActive: "12 days ago",
    },
    {
        id: "STU-2406",
        name: "Neha Joshi",
        email: "neha.joshi@example.com",
        phone: "+91 98765 43215",
        college: "Engineering College Jaipur",
        course: "Python AI / ML",
        joined: "2026-10-10",
        status: "Active",
        progress: 68,
        lastActive: "30 minutes ago",
    },
    {
        id: "STU-2407",
        name: "Vikram Kumar",
        email: "vikram.kumar@example.com",
        phone: "+91 98765 43216",
        college: "Institute of Technology Ajmer",
        course: "Java and DSA",
        joined: "2026-10-08",
        status: "Active",
        progress: 45,
        lastActive: "1 hour ago",
    },
    {
        id: "STU-2408",
        name: "Ananya Jain",
        email: "ananya.jain@example.com",
        phone: "+91 98765 43217",
        college: "Tech Institute Kota",
        course: "Data Science",
        joined: "2026-10-06",
        status: "Pending",
        progress: 12,
        lastActive: "4 days ago",
    },
    {
        id: "STU-2409",
        name: "Rohan Yadav",
        email: "rohan.yadav@example.com",
        phone: "+91 98765 43218",
        college: "Engineering College Jaipur",
        course: "Cloud Computing",
        joined: "2026-10-04",
        status: "Active",
        progress: 79,
        lastActive: "20 minutes ago",
    },
    {
        id: "STU-2410",
        name: "Kavya Sharma",
        email: "kavya.sharma@example.com",
        phone: "+91 98765 43219",
        college: "Institute of Technology Ajmer",
        course: "Full Stack Development",
        joined: "2026-10-02",
        status: "Active",
        progress: 57,
        lastActive: "45 minutes ago",
    },
    {
        id: "STU-2411",
        name: "Mohit Choudhary",
        email: "mohit.choudhary@example.com",
        phone: "+91 98765 43220",
        college: "Tech Institute Kota",
        course: "Python AI / ML",
        joined: "2026-09-28",
        status: "Inactive",
        progress: 27,
        lastActive: "15 days ago",
    },
    {
        id: "STU-2412",
        name: "Isha Agarwal",
        email: "isha.agarwal@example.com",
        phone: "+91 98765 43221",
        college: "Engineering College Jaipur",
        course: "Cloud Computing",
        joined: "2026-09-25",
        status: "Active",
        progress: 95,
        lastActive: "8 minutes ago",
    },
];

/* =====================================================
   CHART DATA
===================================================== */

const enrollmentData = {
    week: [
        { label: "Mon", registrations: 18, active: 14, pending: 4 },
        { label: "Tue", registrations: 25, active: 20, pending: 5 },
        { label: "Wed", registrations: 21, active: 17, pending: 4 },
        { label: "Thu", registrations: 32, active: 27, pending: 5 },
        { label: "Fri", registrations: 39, active: 32, pending: 7 },
        { label: "Sat", registrations: 28, active: 24, pending: 4 },
        { label: "Sun", registrations: 35, active: 29, pending: 6 },
    ],

    month: [
        { label: "Week 1", registrations: 105, active: 88, pending: 17 },
        { label: "Week 2", registrations: 132, active: 110, pending: 22 },
        { label: "Week 3", registrations: 118, active: 99, pending: 19 },
        { label: "Week 4", registrations: 164, active: 139, pending: 25 },
    ],

    quarter: [
        { label: "W1", registrations: 95, active: 79, pending: 16 },
        { label: "W2", registrations: 110, active: 92, pending: 18 },
        { label: "W3", registrations: 125, active: 105, pending: 20 },
        { label: "W4", registrations: 119, active: 99, pending: 20 },
        { label: "W5", registrations: 145, active: 122, pending: 23 },
        { label: "W6", registrations: 160, active: 136, pending: 24 },
        { label: "W7", registrations: 138, active: 116, pending: 22 },
        { label: "W8", registrations: 174, active: 148, pending: 26 },
        { label: "W9", registrations: 182, active: 155, pending: 27 },
        { label: "W10", registrations: 165, active: 139, pending: 26 },
        { label: "W11", registrations: 198, active: 170, pending: 28 },
        { label: "W12", registrations: 215, active: 185, pending: 30 },
    ],

    year: [
        { label: "Jan", registrations: 180, active: 151, pending: 29 },
        { label: "Feb", registrations: 215, active: 182, pending: 33 },
        { label: "Mar", registrations: 240, active: 205, pending: 35 },
        { label: "Apr", registrations: 225, active: 190, pending: 35 },
        { label: "May", registrations: 290, active: 250, pending: 40 },
        { label: "Jun", registrations: 315, active: 273, pending: 42 },
        { label: "Jul", registrations: 278, active: 239, pending: 39 },
        { label: "Aug", registrations: 345, active: 300, pending: 45 },
        { label: "Sep", registrations: 365, active: 318, pending: 47 },
        { label: "Oct", registrations: 390, active: 340, pending: 50 },
        { label: "Nov", registrations: 420, active: 367, pending: 53 },
        { label: "Dec", registrations: 450, active: 395, pending: 55 },
    ],
};

/* =====================================================
   FILTER OPTIONS
===================================================== */

const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Active students", value: "Active" },
    { label: "Pending students", value: "Pending" },
    { label: "Inactive students", value: "Inactive" },
];

const sortOptions = [
    { label: "Newest joined", value: "newest" },
    { label: "Oldest joined", value: "oldest" },
    { label: "Name A to Z", value: "name" },
    { label: "Highest progress", value: "progress" },
];

const dateRangeOptions = [
    { label: "Last 7 days", value: "week" },
    { label: "Last 30 days", value: "month" },
    { label: "Last 90 days", value: "quarter" },
    { label: "This year", value: "year" },
];

const chartMetricOptions = [
    { label: "Registrations", value: "registrations" },
    { label: "Active students", value: "active" },
    { label: "Pending students", value: "pending" },
];

/* =====================================================
   HELPERS
===================================================== */

function formatNumber(value) {
    return new Intl.NumberFormat("en-IN").format(value || 0);
}

function formatDate(value) {
    if (!value) return "-";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    }).format(date);
}

function getToday() {
    const now = new Date();
    const localDate = new Date(
        now.getTime() - now.getTimezoneOffset() * 60000
    );

    return localDate.toISOString().slice(0, 10);
}

function getInitials(name = "") {
    return name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part.charAt(0).toUpperCase())
        .join("");
}

function getAvatarColor(name = "") {
    const colors = [
        { bg: "#FFF0EA", text: "#D9411F" },
        { bg: "#EDF5FF", text: "#245E99" },
        { bg: "#EAF7EE", text: "#18673D" },
        { bg: "#F4EEFF", text: "#6941A5" },
        { bg: "#FFF7DF", text: "#885B0B" },
    ];

    const index = name
        .split("")
        .reduce((total, character) => total + character.charCodeAt(0), 0);

    return colors[index % colors.length];
}

/* =====================================================
   CUSTOM DROPDOWN
===================================================== */

function PremiumDropdown({
    value,
    onChange,
    options,
    ariaLabel,
    icon: Icon,
    minWidth = 170,
    align = "left",
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const selectedOption =
        options.find((option) => option.value === value) || options[0];

    useEffect(() => {
        if (!open) return undefined;

        const handlePointerDown = (event) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    return (
        <div
            ref={rootRef}
            className="relative inline-block"
            style={{ minWidth }}
        >
            <motion.button
                type="button"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                whileTap={{ scale: 0.985 }}
                className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 text-left shadow-sm outline-none transition-colors hover:border-[#F2B3A3] focus-visible:ring-4 focus-visible:ring-orange-100"
                style={{
                    borderColor: open ? "#F3A58F" : COLORS.border,
                    color: COLORS.black,
                }}
            >
                <span className="flex min-w-0 items-center gap-2">
                    {Icon && (
                        <Icon
                            size={16}
                            className="shrink-0"
                            style={{ color: COLORS.orange }}
                        />
                    )}

                    <span className="truncate text-[12px] font-extrabold">
                        {selectedOption.label}
                    </span>
                </span>

                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-[#252525]"
                >
                    <ChevronDown size={16} />
                </motion.span>
            </motion.button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 7, scale: 0.985 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.985 }}
                        transition={{
                            duration: 0.18,
                            ease: [0.22, 1, 0.36, 1],
                        }}
                        role="listbox"
                        aria-label={ariaLabel}
                        className={`absolute top-[calc(100%+8px)] z-[90] overflow-hidden rounded-xl border border-[#E8E8E8] bg-white p-1.5 shadow-[0_14px_36px_rgba(30,30,30,0.13)] ${align === "right" ? "right-0" : "left-0"
                            }`}
                        style={{
                            minWidth: Math.max(minWidth, 185),
                            width: "max-content",
                            maxWidth: "min(300px, calc(100vw - 32px))",
                        }}
                    >
                        <div className="students-dropdown-scroll max-h-[280px] overflow-y-auto overscroll-contain">
                            {options.map((option) => {
                                const selected = option.value === value;

                                return (
                                    <motion.button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={selected}
                                        onClick={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                        whileHover={{ x: 2 }}
                                        className="flex min-h-[42px] w-full items-center justify-between gap-4 rounded-lg px-3.5 text-left transition-colors"
                                        style={{
                                            color: selected ? COLORS.orangeDark : COLORS.black,
                                            backgroundColor: selected
                                                ? COLORS.orangeLight
                                                : COLORS.white,
                                        }}
                                    >
                                        <span className="text-[12px] font-bold">
                                            {option.label}
                                        </span>

                                        {selected && (
                                            <Check
                                                size={16}
                                                className="shrink-0"
                                                style={{ color: COLORS.orange }}
                                            />
                                        )}
                                    </motion.button>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({ status }) {
    const styles = {
        Active: {
            background: COLORS.greenLight,
            color: "#17683D",
            icon: CheckCircle2,
        },

        Pending: {
            background: COLORS.yellowLight,
            color: "#855A0B",
            icon: Clock3,
        },

        Inactive: {
            background: COLORS.redLight,
            color: "#B52D2D",
            icon: UserX,
        },
    };

    const config = styles[status] || styles.Pending;
    const Icon = config.icon;

    return (
        <span
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-extrabold"
            style={{
                color: config.color,
                backgroundColor: config.background,
            }}
        >
            <Icon size={13} />
            {status}
        </span>
    );
}

/* =====================================================
   STUDENT AVATAR
===================================================== */

function StudentAvatar({ name, size = "normal" }) {
    const avatar = getAvatarColor(name);

    const sizeClass =
        size === "large"
            ? "h-14 w-14 rounded-2xl text-lg"
            : "h-10 w-10 rounded-xl text-[12px]";

    return (
        <div
            className={`flex shrink-0 items-center justify-center font-extrabold ${sizeClass}`}
            style={{
                backgroundColor: avatar.bg,
                color: avatar.text,
            }}
            aria-label={`${name} avatar`}
        >
            {getInitials(name)}
        </div>
    );
}

/* =====================================================
   ANIMATED METRIC CARD
===================================================== */

function StudentStatCard({ stat, index }) {
    const Icon = stat.icon;

    return (
        <motion.article
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.42,
                delay: index * 0.065,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{
                y: -4,
                transition: { duration: 0.18 },
            }}
            className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.055)] sm:p-5"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#454545]">
                        {stat.title}
                    </p>

                    <motion.p
                        initial={{ opacity: 0, y: 7 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.35,
                            delay: index * 0.065 + 0.1,
                        }}
                        className="mt-3 break-words text-[29px] font-extrabold leading-tight tracking-[-0.8px] text-[#252525]"
                    >
                        {stat.value}
                    </motion.p>
                </div>

                <motion.div
                    whileHover={{ rotate: 5, scale: 1.06 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                        color: stat.color,
                        backgroundColor: stat.bg,
                    }}
                >
                    <Icon size={21} strokeWidth={1.9} />
                </motion.div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <span
                    className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-extrabold"
                    style={{
                        color: stat.color,
                        backgroundColor: stat.bg,
                    }}
                >
                    {stat.trendIcon && <ArrowUpRight size={13} />}
                    {stat.trend}
                </span>

                <span className="text-[11px] font-bold text-[#454545]">
                    {stat.description}
                </span>
            </div>
        </motion.article>
    );
}

/* =====================================================
   CHART TOOLTIP
===================================================== */

function StudentChartTooltip({ active, payload, label, metric }) {
    if (!active || !payload?.length) return null;

    const metricLabel =
        chartMetricOptions.find((item) => item.value === metric)?.label ||
        "Students";

    return (
        <div className="min-w-[160px] rounded-xl border border-[#E8E8E8] bg-white p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            <p className="mb-2 text-[12px] font-extrabold text-[#252525]">
                {label}
            </p>

            {payload.map((item) => (
                <div
                    key={item.dataKey}
                    className="flex items-center justify-between gap-4 py-1"
                >
                    <span className="flex items-center gap-2 text-[11px] font-bold text-[#454545]">
                        <span
                            className="h-2.5 w-2.5 rounded-full"
                            style={{ backgroundColor: item.color || COLORS.orange }}
                        />
                        {item.name || metricLabel}
                    </span>

                    <span className="text-[12px] font-extrabold text-[#252525]">
                        {formatNumber(Number(item.value || 0))}
                    </span>
                </div>
            ))}
        </div>
    );
}

/* =====================================================
   PROGRESS BAR
===================================================== */

function StudentProgress({ value }) {
    const progress = Math.max(0, Math.min(100, Number(value) || 0));

    const barColor =
        progress >= 75
            ? COLORS.green
            : progress >= 40
                ? COLORS.orange
                : "#D49A26";

    return (
        <div className="w-full min-w-[100px]">
            <div className="mb-1.5 flex items-center justify-between gap-2">
                <span className="text-[11px] font-extrabold text-[#252525]">
                    {progress}%
                </span>

                <span className="text-[10px] font-bold text-[#454545]">
                    Complete
                </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-[#EEEEEE]">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{
                        duration: 0.9,
                        ease: [0.22, 1, 0.36, 1],
                    }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: barColor }}
                />
            </div>
        </div>
    );
}

/* =====================================================
   CSV EXPORT
===================================================== */

function downloadStudentsCSV(students) {
    const headers = [
        "Student ID",
        "Name",
        "Email",
        "Phone",
        "College",
        "Course",
        "Joined Date",
        "Status",
        "Progress",
        "Last Active",
    ];

    const escapeCSV = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const rows = students.map((student) => [
        student.id,
        student.name,
        student.email,
        student.phone,
        student.college,
        student.course,
        student.joined,
        student.status,
        `${student.progress}%`,
        student.lastActive,
    ]);

    const content = [
        headers.map(escapeCSV).join(","),
        ...rows.map((row) => row.map(escapeCSV).join(",")),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", content], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "techmentor-students.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

/* =====================================================
   ADD STUDENT MODAL
===================================================== */

function AddStudentModal({
    open,
    onClose,
    onAdd,
    courses,
    colleges,
}) {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        college: "",
        course: "",
    });

    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (open) {
            setForm({
                name: "",
                email: "",
                phone: "",
                college: colleges[0] || "",
                course: courses[0] || "",
            });

            setFormError("");
        }
    }, [open, colleges, courses]);

    useEffect(() => {
        if (!open) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (
            !form.name.trim() ||
            !form.email.trim() ||
            !form.college ||
            !form.course
        ) {
            setFormError("Please fill in all required fields.");
            return;
        }

        const emailIsValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            form.email.trim()
        );

        if (!emailIsValid) {
            setFormError("Please enter a valid email address.");
            return;
        }

        onAdd(form);
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[3px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="add-student-title"
                        className="my-auto w-full max-w-[600px] overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.2)]"
                    >
                        <div className="flex items-start justify-between gap-4 border-b border-[#EEEEEE] px-5 py-5 sm:px-6">
                            <div>
                                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                                    <GraduationCap size={21} />
                                </span>

                                <h2
                                    id="add-student-title"
                                    className="mt-3 text-xl font-extrabold text-[#252525]"
                                >
                                    Add New Student
                                </h2>

                                <p className="mt-1 text-[12px] font-semibold text-[#454545]">
                                    Enter the student details below.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close add student form"
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E8E8] text-[#252525] transition-colors hover:bg-[#F7F7F7]"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6">
                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="student-name"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Full name <span className="text-[#D9411F]">*</span>
                                    </label>

                                    <input
                                        id="student-name"
                                        name="name"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter student name"
                                        autoComplete="name"
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold text-[#111111] outline-none transition focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="student-email"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Email address <span className="text-[#D9411F]">*</span>
                                    </label>

                                    <input
                                        id="student-email"
                                        name="email"
                                        type="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="student@example.com"
                                        autoComplete="email"
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold text-[#111111] outline-none transition focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="student-phone"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Phone number
                                    </label>

                                    <input
                                        id="student-phone"
                                        name="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="+91 98765 43210"
                                        autoComplete="tel"
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold text-[#111111] outline-none transition focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor="student-college"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        College <span className="text-[#D9411F]">*</span>
                                    </label>

                                    <select
                                        id="student-college"
                                        name="college"
                                        value={form.college}
                                        onChange={handleChange}
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3 text-[12px] font-bold text-[#111111] outline-none focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    >
                                        {colleges.map((college) => (
                                            <option key={college} value={college}>
                                                {college}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="student-course"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Program <span className="text-[#D9411F]">*</span>
                                    </label>

                                    <select
                                        id="student-course"
                                        name="course"
                                        value={form.course}
                                        onChange={handleChange}
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3 text-[12px] font-bold text-[#111111] outline-none focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    >
                                        {courses.map((course) => (
                                            <option key={course} value={course}>
                                                {course}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {formError && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        role="alert"
                                        className="text-[12px] font-bold text-[#B52D2D] sm:col-span-2"
                                    >
                                        {formError}
                                    </motion.p>
                                )}

                                <div className="flex items-start gap-2 rounded-xl border border-[#F4D4C9] bg-[#FFF8F5] p-3 sm:col-span-2">
                                    <CircleAlert
                                        size={16}
                                        className="mt-0.5 shrink-0 text-[#D9411F]"
                                    />

                                    <p className="text-[11px] font-semibold leading-5 text-[#454545]">
                                        This demo adds the student to the current page state.
                                        Connect your backend to persist the record in your database.
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-[#EEEEEE] bg-[#FCFCFC] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="h-11 rounded-xl border border-[#E8E8E8] bg-white px-5 text-[12px] font-extrabold text-[#252525] transition-colors hover:bg-[#F5F5F5]"
                                >
                                    Cancel
                                </button>

                                <motion.button
                                    type="submit"
                                    whileHover={{ y: -1 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F4512B] px-5 text-[12px] font-extrabold text-white shadow-sm transition-shadow hover:shadow-md"
                                >
                                    <Plus size={16} />
                                    Create Student
                                </motion.button>
                            </div>
                        </form>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* =====================================================
   STUDENT DETAILS MODAL
===================================================== */

function StudentDetailsModal({
    student,
    onClose,
    onToggleStatus,
}) {
    useEffect(() => {
        if (!student) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [student, onClose]);

    return (
        <AnimatePresence>
            {student && (
                <motion.div
                    className="fixed inset-0 z-[145] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[3px]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            onClose();
                        }
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.25 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="student-details-title"
                        className="my-auto w-full max-w-[510px] overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.2)]"
                    >
                        <div className="relative overflow-hidden border-b border-[#EEEEEE] bg-white p-5 sm:p-6">
                            <div className="pointer-events-none absolute -right-8 -top-12 h-36 w-36 rounded-full bg-[#FFF0EA]" />

                            <div className="relative flex items-start justify-between gap-3">
                                <div className="flex items-center gap-3">
                                    <StudentAvatar name={student.name} size="large" />

                                    <div className="min-w-0">
                                        <h2
                                            id="student-details-title"
                                            className="break-words text-lg font-extrabold text-[#252525]"
                                        >
                                            {student.name}
                                        </h2>

                                        <p className="mt-1 text-[11px] font-bold text-[#454545]">
                                            {student.id}
                                        </p>

                                        <div className="mt-2">
                                            <StatusBadge status={student.status} />
                                        </div>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    aria-label="Close student details"
                                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E8E8E8] bg-white text-[#252525] hover:bg-[#F7F7F7]"
                                >
                                    <X size={17} />
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4 p-5 sm:p-6">
                            <div className="flex items-start gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#D9411F]">
                                    <Mail size={16} />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-[#454545]">
                                        Email address
                                    </p>

                                    <p className="mt-1 break-all text-[12px] font-extrabold text-[#252525]">
                                        {student.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EDF5FF] text-[#245E99]">
                                    <Phone size={16} />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-[#454545]">
                                        Phone number
                                    </p>

                                    <p className="mt-1 break-words text-[12px] font-extrabold text-[#252525]">
                                        {student.phone || "Not provided"}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#218653]">
                                    <Building2 size={16} />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-[#454545]">
                                        College
                                    </p>

                                    <p className="mt-1 break-words text-[12px] font-extrabold text-[#252525]">
                                        {student.college}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3">
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#F4EEFF] text-[#8058BE]">
                                    <BookOpen size={16} />
                                </span>

                                <div className="min-w-0">
                                    <p className="text-[11px] font-bold text-[#454545]">
                                        Program
                                    </p>

                                    <p className="mt-1 break-words text-[12px] font-extrabold text-[#252525]">
                                        {student.course}
                                    </p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 border-t border-[#EEEEEE] pt-4">
                                <div className="rounded-xl border border-[#EEEEEE] p-3">
                                    <p className="text-[11px] font-bold text-[#454545]">
                                        Joined
                                    </p>

                                    <p className="mt-2 text-[12px] font-extrabold text-[#252525]">
                                        {formatDate(student.joined)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-[#EEEEEE] p-3">
                                    <p className="text-[11px] font-bold text-[#454545]">
                                        Last activity
                                    </p>

                                    <p className="mt-2 break-words text-[12px] font-extrabold text-[#252525]">
                                        {student.lastActive || "Not available"}
                                    </p>
                                </div>
                            </div>

                            <div className="rounded-xl border border-[#EEEEEE] p-4">
                                <div className="mb-3 flex items-center justify-between gap-3">
                                    <p className="text-[12px] font-extrabold text-[#252525]">
                                        Learning progress
                                    </p>

                                    <p className="text-[14px] font-extrabold text-[#252525]">
                                        {student.progress}%
                                    </p>
                                </div>

                                <StudentProgress value={student.progress} />
                            </div>
                        </div>

                        <div className="flex flex-col-reverse gap-3 border-t border-[#EEEEEE] bg-[#FCFCFC] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                            <button
                                type="button"
                                onClick={onClose}
                                className="h-10 rounded-xl border border-[#E8E8E8] bg-white px-4 text-[12px] font-extrabold text-[#252525] hover:bg-[#F5F5F5]"
                            >
                                Close
                            </button>

                            <motion.button
                                type="button"
                                onClick={() => onToggleStatus(student)}
                                whileTap={{ scale: 0.98 }}
                                className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-[#F4512B] px-4 text-[12px] font-extrabold text-white transition-shadow hover:shadow-md"
                            >
                                {student.status === "Active" ? (
                                    <>
                                        <Ban size={15} />
                                        Deactivate student
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 size={15} />
                                        Activate student
                                    </>
                                )}
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* =====================================================
   MAIN PAGE
===================================================== */

export default function ManageStudentsPage() {
    const [students, setStudents] = useState(initialStudents);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [courseFilter, setCourseFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const [dateRange, setDateRange] = useState("month");
    const [chartMetric, setChartMetric] = useState("registrations");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [selectedStudent, setSelectedStudent] = useState(null);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showFilters, setShowFilters] = useState(false);
    const [notice, setNotice] = useState("");

    const activeChartData =
        enrollmentData[dateRange] || enrollmentData.month;

    const rangeLabel =
        dateRangeOptions.find((option) => option.value === dateRange)?.label ||
        "Last 30 days";

    const chartMetricLabel =
        chartMetricOptions.find((option) => option.value === chartMetric)?.label ||
        "Registrations";

    const courseOptions = useMemo(() => {
        const availableCourses = [
            ...new Set(students.map((student) => student.course).filter(Boolean)),
        ].sort((a, b) => a.localeCompare(b));

        return [
            { label: "All programs", value: "all" },
            ...availableCourses.map((course) => ({
                label: course,
                value: course,
            })),
        ];
    }, [students]);

    const collegeOptions = useMemo(() => {
        return [
            ...new Set(students.map((student) => student.college).filter(Boolean)),
        ].sort((a, b) => a.localeCompare(b));
    }, [students]);

    /* =================================================
       SUMMARY STATS
    ================================================= */

    const summary = useMemo(() => {
        const total = students.length;

        const active = students.filter(
            (student) => student.status === "Active"
        ).length;

        const pending = students.filter(
            (student) => student.status === "Pending"
        ).length;

        const inactive = students.filter(
            (student) => student.status === "Inactive"
        ).length;

        const atRisk = students.filter(
            (student) =>
                student.progress < 40 && student.status !== "Inactive"
        ).length;

        const avgProgress =
            total > 0
                ? Math.round(
                    students.reduce(
                        (totalProgress, student) =>
                            totalProgress + Number(student.progress || 0),
                        0
                    ) / total
                )
                : 0;

        const activeRate =
            total > 0 ? Math.round((active / total) * 100) : 0;

        return {
            total,
            active,
            pending,
            inactive,
            atRisk,
            avgProgress,
            activeRate,
        };
    }, [students]);

    /* =================================================
       FILTER, SEARCH AND SORT
    ================================================= */

    const filteredStudents = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        let rows = students.filter((student) => {
            const matchesSearch =
                !query ||
                [
                    student.id,
                    student.name,
                    student.email,
                    student.phone,
                    student.college,
                    student.course,
                    student.status,
                ].some((value) =>
                    String(value || "").toLowerCase().includes(query)
                );

            const matchesStatus =
                statusFilter === "all" || student.status === statusFilter;

            const matchesCourse =
                courseFilter === "all" || student.course === courseFilter;

            return matchesSearch && matchesStatus && matchesCourse;
        });

        if (sortBy === "newest") {
            rows.sort((a, b) => b.joined.localeCompare(a.joined));
        } else if (sortBy === "oldest") {
            rows.sort((a, b) => a.joined.localeCompare(b.joined));
        } else if (sortBy === "name") {
            rows.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "progress") {
            rows.sort((a, b) => b.progress - a.progress);
        }

        return rows;
    }, [students, searchQuery, statusFilter, courseFilter, sortBy]);

    const totalPages = Math.max(
        1,
        Math.ceil(filteredStudents.length / pageSize)
    );

    const visibleStudents = useMemo(() => {
        const startIndex = (currentPage - 1) * pageSize;

        return filteredStudents.slice(startIndex, startIndex + pageSize);
    }, [filteredStudents, currentPage, pageSize]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    /* =================================================
       FILTER ACTIONS
    ================================================= */

    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setCourseFilter("all");
        setSortBy("newest");
        setCurrentPage(1);
    };

    /* =================================================
       ADD STUDENT
    ================================================= */

    const handleAddStudent = (form) => {
        const emailAlreadyExists = students.some(
            (student) =>
                student.email.toLowerCase() === form.email.trim().toLowerCase()
        );

        if (emailAlreadyExists) {
            setNotice("A student with this email address already exists.");
            setShowAddModal(false);
            return;
        }

        const newStudent = {
            id: `STU-${String(Date.now()).slice(-6)}`,
            name: form.name.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            college: form.college,
            course: form.course,
            joined: getToday(),
            status: "Pending",
            progress: 0,
            lastActive: "Just now",
        };

        setStudents((current) => [newStudent, ...current]);

        setSearchQuery("");
        setStatusFilter("all");
        setCourseFilter("all");
        setSortBy("newest");
        setCurrentPage(1);

        setShowAddModal(false);
        setNotice(`${newStudent.name} added to the student list.`);
    };

    /* =================================================
       TOGGLE STATUS
    ================================================= */

    const handleToggleStatus = (student) => {
        const nextStatus =
            student.status === "Active" ? "Inactive" : "Active";

        setStudents((current) =>
            current.map((item) =>
                item.id === student.id
                    ? {
                        ...item,
                        status: nextStatus,
                    }
                    : item
            )
        );

        setSelectedStudent((current) =>
            current?.id === student.id
                ? {
                    ...current,
                    status: nextStatus,
                }
                : current
        );

        setNotice(
            `${student.name} status changed to ${nextStatus.toLowerCase()}.`
        );
    };

    /* =================================================
       EXPORT CSV
    ================================================= */

    const handleExport = () => {
        downloadStudentsCSV(filteredStudents);

        setNotice(
            `${filteredStudents.length} student records exported successfully.`
        );
    };

    /* =================================================
       METRICS
    ================================================= */

    const chartTotal = activeChartData.reduce(
        (total, row) => total + (row[chartMetric] || 0),
        0
    );

    const stats = [
        {
            title: "Total Students",
            value: formatNumber(summary.total),
            trend: `${summary.activeRate}% active`,
            description: "Current records",
            icon: Users,
            color: COLORS.orange,
            bg: COLORS.orangeLight,
            trendIcon: true,
        },
        {
            title: "Active Students",
            value: formatNumber(summary.active),
            trend: "Enrolled",
            description: "Currently active",
            icon: UserCheck,
            color: COLORS.green,
            bg: COLORS.greenLight,
            trendIcon: false,
        },
        {
            title: "Pending Approval",
            value: formatNumber(summary.pending),
            trend: "Needs review",
            description: "Awaiting activation",
            icon: Clock3,
            color: COLORS.blue,
            bg: COLORS.blueLight,
            trendIcon: false,
        },
        {
            title: "Students At Risk",
            value: formatNumber(summary.atRisk),
            trend: "Below 40%",
            description: "Progress monitoring",
            icon: CircleAlert,
            color: COLORS.purple,
            bg: COLORS.purpleLight,
            trendIcon: false,
        },
    ];

    return (
        <div className="students-page space-y-6 pb-8 text-[#252525]">
            <style>{`
        .students-dropdown-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .students-dropdown-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .students-page input,
        .students-page select {
          color: #111111;
          -webkit-text-fill-color: #111111;
        }

        .students-page input::placeholder {
          color: #606060;
          -webkit-text-fill-color: #606060;
          opacity: 1;
          font-weight: 600;
        }

        .students-page .recharts-cartesian-axis-tick-value {
          fill: #454545;
          font-size: 12px;
          font-weight: 700;
        }

        .students-page .recharts-cartesian-grid-horizontal line {
          stroke: #E8E8E8;
        }

        .students-page .recharts-surface {
          outline: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .students-page *,
          .students-page *::before,
          .students-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

            {/* ===============================================
          PAGE HEADER
      =============================================== */}

            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
            >
                <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#F4512B]" />

                        <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#D9411F]">
                            STUDENT MANAGEMENT
                        </span>
                    </div>

                    <h1 className="text-[30px] font-extrabold leading-tight tracking-[-1px] text-[#252525] sm:text-[35px]">
                        Manage Students
                    </h1>

                    <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-6 text-[#454545]">
                        Manage student records, enrollment status, learning progress and
                        college assignments from one workspace.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[12px] font-extrabold text-[#252525]">
                        <CalendarDays
                            size={16}
                            className="text-[#F4512B]"
                        />

                        {formatDate(getToday())}
                    </div>

                    <motion.button
                        type="button"
                        onClick={() => setShowAddModal(true)}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F4512B] px-4 text-[12px] font-extrabold text-white shadow-sm transition-shadow hover:shadow-md"
                    >
                        <Plus size={17} />
                        Add Student
                    </motion.button>
                </div>
            </motion.section>

            {/* ===============================================
          TOAST MESSAGE
      =============================================== */}

            <AnimatePresence>
                {notice && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        role="status"
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#CDEBD7] bg-[#F0FAF3] px-4 py-3"
                    >
                        <span className="flex items-center gap-2 text-[12px] font-extrabold text-[#17683D]">
                            <CheckCircle2 size={17} />
                            {notice}
                        </span>

                        <button
                            type="button"
                            onClick={() => setNotice("")}
                            aria-label="Dismiss message"
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[#17683D] hover:bg-[#E0F4E7]"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* ===============================================
          SUMMARY CARDS
      =============================================== */}

            <section
                aria-label="Student summary"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                {stats.map((stat, index) => (
                    <StudentStatCard
                        key={stat.title}
                        stat={stat}
                        index={index}
                    />
                ))}
            </section>

            {/* ===============================================
          REGISTRATION CHART
      =============================================== */}

            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.12 }}
                className="overflow-visible rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
            >
                <div className="flex flex-col gap-4 border-b border-[#EEEEEE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-[16px] font-extrabold text-[#252525]">
                            Student Enrollment Trends
                        </h2>

                        <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#454545]">
                            Registration and activation overview across selected periods.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <PremiumDropdown
                            ariaLabel="Select chart metric"
                            value={chartMetric}
                            onChange={setChartMetric}
                            options={chartMetricOptions}
                            icon={Activity}
                            minWidth={175}
                            align="right"
                        />

                        <PremiumDropdown
                            ariaLabel="Select chart date range"
                            value={dateRange}
                            onChange={setDateRange}
                            options={dateRangeOptions}
                            icon={CalendarDays}
                            minWidth={155}
                            align="right"
                        />
                    </div>
                </div>

                <div className="px-4 pb-5 pt-5 sm:px-6">
                    <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
                        <div>
                            <p className="text-[12px] font-bold text-[#454545]">
                                {chartMetricLabel}
                            </p>

                            <motion.p
                                key={`${dateRange}-${chartMetric}-${chartTotal}`}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                                className="mt-1.5 text-[30px] font-extrabold tracking-[-0.8px] text-[#252525]"
                            >
                                {formatNumber(chartTotal)}
                            </motion.p>

                            <p className="mt-1 text-[11px] font-bold text-[#454545]">
                                Total for {rangeLabel.toLowerCase()}
                            </p>
                        </div>

                        <div className="flex items-center gap-2 rounded-lg bg-[#FFF8F5] px-3 py-2 text-[11px] font-extrabold text-[#D9411F]">
                            <TrendingUp size={15} />
                            Enrollment analytics
                        </div>
                    </div>

                    {/* Transparent chart area: no tinted plot background */}

                    <div className="h-[270px] w-full min-w-0 sm:h-[320px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                key={`${dateRange}-${chartMetric}`}
                                data={activeChartData}
                                margin={{
                                    top: 14,
                                    right: 8,
                                    left: -4,
                                    bottom: 0,
                                }}
                                barCategoryGap="35%"
                            >
                                <CartesianGrid
                                    vertical={false}
                                    stroke="#E8E8E8"
                                    strokeDasharray="4 5"
                                />

                                <XAxis
                                    dataKey="label"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#454545",
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                    dy={10}
                                    interval={dateRange === "quarter" ? 1 : 0}
                                />

                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{
                                        fill: "#454545",
                                        fontSize: 12,
                                        fontWeight: 700,
                                    }}
                                    tickFormatter={(value) =>
                                        value >= 1000
                                            ? `${(value / 1000).toFixed(1)}k`
                                            : value
                                    }
                                    width={48}
                                />

                                <Tooltip
                                    content={
                                        <StudentChartTooltip metric={chartMetric} />
                                    }
                                    cursor={false}
                                    isAnimationActive
                                />

                                <Bar
                                    dataKey={chartMetric}
                                    name={chartMetricLabel}
                                    fill={COLORS.orange}
                                    radius={[7, 7, 2, 2]}
                                    maxBarSize={44}
                                    isAnimationActive
                                    animationBegin={80}
                                    animationDuration={1200}
                                    animationEasing="ease-out"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEEEE] pt-4">
                        <p className="text-[11px] font-bold text-[#454545]">
                            Reporting period: {rangeLabel}
                        </p>

                        <div className="flex items-center gap-2 text-[11px] font-extrabold text-[#252525]">
                            <span className="h-2.5 w-2.5 rounded-sm bg-[#F4512B]" />

                            {chartMetricLabel}
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ===============================================
          STUDENT TABLE SECTION
      =============================================== */}

            <motion.section
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.42, delay: 0.18 }}
                className="relative rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
            >
                {/* TABLE HEADER */}

                <div className="flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-[16px] font-extrabold text-[#252525]">
                            All Students
                        </h2>

                        <p className="mt-1.5 text-[12px] font-semibold text-[#454545]">
                            Search student records and manage enrollment status.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-2 rounded-lg border border-[#E8E8E8] bg-white px-3 py-2 text-[11px] font-extrabold text-[#252525]">
                            <Users size={15} className="text-[#F4512B]" />
                            {formatNumber(filteredStudents.length)} records
                        </span>

                        <motion.button
                            type="button"
                            onClick={handleExport}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[11px] font-extrabold text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5]"
                        >
                            <Download size={15} />
                            Export CSV
                        </motion.button>
                    </div>
                </div>

                {/* SEARCH BAR */}

                <div className="relative z-30 flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={17}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#454545]"
                            />

                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(event) => {
                                    setSearchQuery(event.target.value);
                                    setCurrentPage(1);
                                }}
                                placeholder="Search by name, email, student ID or college..."
                                aria-label="Search students"
                                autoComplete="off"
                                className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white pl-10 pr-10 text-[12px] font-extrabold text-[#111111] caret-[#F4512B] outline-none transition-all duration-200 placeholder:font-semibold placeholder:text-[#606060] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                style={{
                                    WebkitTextFillColor: "#111111",
                                }}
                            />

                            {searchQuery && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCurrentPage(1);
                                    }}
                                    aria-label="Clear student search"
                                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#454545] hover:bg-[#F2F2F2]"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <motion.button
                                type="button"
                                onClick={() => setShowFilters((current) => !current)}
                                whileTap={{ scale: 0.98 }}
                                className={`inline-flex h-11 items-center gap-2 rounded-xl border px-3.5 text-[12px] font-extrabold transition-colors ${showFilters
                                    ? "border-[#F3B09E] bg-[#FFF0EA] text-[#D9411F]"
                                    : "border-[#E8E8E8] bg-white text-[#252525] hover:bg-[#FFF8F5]"
                                    }`}
                            >
                                <SlidersHorizontal size={15} />
                                Filters
                                <motion.span
                                    animate={{ rotate: showFilters ? 180 : 0 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <ChevronDown size={14} />
                                </motion.span>
                            </motion.button>

                            <PremiumDropdown
                                ariaLabel="Filter students by status"
                                value={statusFilter}
                                onChange={(value) => {
                                    setStatusFilter(value);
                                    setCurrentPage(1);
                                }}
                                options={statusOptions}
                                minWidth={165}
                                align="right"
                            />

                            <PremiumDropdown
                                ariaLabel="Sort student records"
                                value={sortBy}
                                onChange={(value) => {
                                    setSortBy(value);
                                    setCurrentPage(1);
                                }}
                                options={sortOptions}
                                minWidth={155}
                                align="right"
                            />
                        </div>
                    </div>

                    {/* EXTRA FILTERS */}

                    <AnimatePresence>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -5 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -5 }}
                                transition={{ duration: 0.22 }}
                                className="overflow-visible"
                            >
                                <div className="flex flex-col gap-3 rounded-xl border border-[#EEEEEE] bg-[#FCFCFC] p-4 sm:flex-row sm:items-center sm:justify-between">
                                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                                        <span className="inline-flex items-center gap-2 text-[12px] font-extrabold text-[#252525]">
                                            <Filter size={15} className="text-[#F4512B]" />
                                            Program filter
                                        </span>

                                        <PremiumDropdown
                                            ariaLabel="Filter students by program"
                                            value={courseFilter}
                                            onChange={(value) => {
                                                setCourseFilter(value);
                                                setCurrentPage(1);
                                            }}
                                            options={courseOptions}
                                            minWidth={220}
                                        />
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="text-[11px] font-bold text-[#454545]">
                                            {formatNumber(filteredStudents.length)} matching records
                                        </span>

                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E8E8E8] bg-white px-3 text-[11px] font-extrabold text-[#252525] transition-colors hover:bg-[#FFF0EA]"
                                        >
                                            <RefreshCw size={13} />
                                            Reset filters
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* ACTIVE FILTER CHIPS */}

                {(statusFilter !== "all" ||
                    courseFilter !== "all" ||
                    searchQuery.trim() !== "") && (
                        <div className="flex flex-wrap items-center gap-2 border-b border-[#EEEEEE] px-5 py-3 sm:px-6">
                            <span className="text-[11px] font-extrabold text-[#454545]">
                                Active filters:
                            </span>

                            {searchQuery.trim() !== "" && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSearchQuery("");
                                        setCurrentPage(1);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#FFF0EA] px-3 py-1.5 text-[10px] font-extrabold text-[#D9411F]"
                                >
                                    Search: {searchQuery}
                                    <X size={12} />
                                </button>
                            )}

                            {statusFilter !== "all" && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setStatusFilter("all");
                                        setCurrentPage(1);
                                    }}
                                    className="inline-flex items-center gap-1.5 rounded-full bg-[#EDF5FF] px-3 py-1.5 text-[10px] font-extrabold text-[#245E99]"
                                >
                                    {statusFilter}
                                    <X size={12} />
                                </button>
                            )}

                            {courseFilter !== "all" && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setCourseFilter("all");
                                        setCurrentPage(1);
                                    }}
                                    className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#F4EEFF] px-3 py-1.5 text-[10px] font-extrabold text-[#6941A5]"
                                >
                                    <span className="truncate">{courseFilter}</span>
                                    <X size={12} />
                                </button>
                            )}

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="ml-auto text-[11px] font-extrabold text-[#D9411F] hover:underline"
                            >
                                Clear all
                            </button>
                        </div>
                    )}

                {/* STUDENT TABLE */}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1050px] border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FAFAFA]">
                                {[
                                    "STUDENT",
                                    "STUDENT ID",
                                    "PROGRAM",
                                    "COLLEGE",
                                    "PROGRESS",
                                    "JOINED DATE",
                                    "STATUS",
                                    "ACTIONS",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="whitespace-nowrap border-b border-[#E8E8E8] px-4 py-4 text-[10px] font-extrabold tracking-[0.04em] text-[#353535] first:pl-5 last:pr-5 sm:px-5"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {visibleStudents.map((student, index) => (
                                    <motion.tr
                                        key={student.id}
                                        layout
                                        initial={{ opacity: 0, y: 7 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{
                                            duration: 0.22,
                                            delay: Math.min(index * 0.035, 0.14),
                                        }}
                                        className="border-b border-[#F0F0F0] transition-colors last:border-0 hover:bg-[#FFFAF8]"
                                    >
                                        {/* STUDENT */}

                                        <td className="px-4 py-4 pl-5 sm:px-5">
                                            <div className="flex min-w-[190px] items-center gap-3">
                                                <StudentAvatar name={student.name} />

                                                <div className="min-w-0">
                                                    <p className="truncate text-[12px] font-extrabold text-[#252525]">
                                                        {student.name}
                                                    </p>

                                                    <p className="mt-1 max-w-[190px] truncate text-[11px] font-semibold text-[#454545]">
                                                        {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ID */}

                                        <td className="whitespace-nowrap px-4 py-4 sm:px-5">
                                            <span className="rounded-md bg-[#F5F5F5] px-2 py-1.5 text-[11px] font-extrabold text-[#252525]">
                                                {student.id}
                                            </span>
                                        </td>

                                        {/* COURSE */}

                                        <td className="px-4 py-4 sm:px-5">
                                            <div className="flex max-w-[180px] items-center gap-2">
                                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0EA] text-[#D9411F]">
                                                    <BookOpen size={15} />
                                                </span>

                                                <span className="text-[11px] font-extrabold leading-5 text-[#252525]">
                                                    {student.course}
                                                </span>
                                            </div>
                                        </td>

                                        {/* COLLEGE */}

                                        <td className="px-4 py-4 sm:px-5">
                                            <div className="flex max-w-[185px] items-start gap-2">
                                                <Building2
                                                    size={14}
                                                    className="mt-0.5 shrink-0 text-[#454545]"
                                                />

                                                <span className="text-[11px] font-bold leading-5 text-[#353535]">
                                                    {student.college}
                                                </span>
                                            </div>
                                        </td>

                                        {/* PROGRESS */}

                                        <td className="w-[145px] px-4 py-4 sm:px-5">
                                            <StudentProgress value={student.progress} />
                                        </td>

                                        {/* JOINED DATE */}

                                        <td className="whitespace-nowrap px-4 py-4 text-[11px] font-bold text-[#353535] sm:px-5">
                                            {formatDate(student.joined)}
                                        </td>

                                        {/* STATUS */}

                                        <td className="px-4 py-4 sm:px-5">
                                            <StatusBadge status={student.status} />
                                        </td>

                                        {/* ACTIONS */}

                                        <td className="px-4 py-4 pr-5 sm:px-5">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    type="button"
                                                    title="View student details"
                                                    aria-label={`View ${student.name}`}
                                                    onClick={() => setSelectedStudent(student)}
                                                    whileHover={{ scale: 1.06 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF0EA] hover:text-[#D9411F]"
                                                >
                                                    <Eye size={16} />
                                                </motion.button>

                                                <motion.button
                                                    type="button"
                                                    title={
                                                        student.status === "Active"
                                                            ? "Deactivate student"
                                                            : "Activate student"
                                                    }
                                                    aria-label={
                                                        student.status === "Active"
                                                            ? `Deactivate ${student.name}`
                                                            : `Activate ${student.name}`
                                                    }
                                                    onClick={() => handleToggleStatus(student)}
                                                    whileHover={{ scale: 1.06 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF0EA] hover:text-[#D9411F]"
                                                >
                                                    {student.status === "Active" ? (
                                                        <Ban size={15} />
                                                    ) : (
                                                        <CheckCircle2 size={16} />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>

                            {/* EMPTY STATE */}

                            {visibleStudents.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-16 text-center">
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0EA] text-[#D9411F]">
                                                <Search size={24} />
                                            </span>

                                            <p className="mt-4 text-[14px] font-extrabold text-[#252525]">
                                                No students found
                                            </p>

                                            <p className="mt-2 text-[12px] font-semibold text-[#454545]">
                                                Try another search or clear your filters.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#F4512B] px-4 py-2.5 text-[11px] font-extrabold text-white hover:bg-[#D9411F]"
                                            >
                                                <RefreshCw size={14} />
                                                Reset filters
                                            </button>
                                        </motion.div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TABLE FOOTER / PAGINATION */}

                <div className="flex flex-col gap-4 border-t border-[#EEEEEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-[11px] font-bold text-[#454545]">
                        Showing{" "}
                        <span className="font-extrabold text-[#252525]">
                            {filteredStudents.length === 0
                                ? 0
                                : (currentPage - 1) * pageSize + 1}
                            {" - "}
                            {Math.min(currentPage * pageSize, filteredStudents.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-extrabold text-[#252525]">
                            {formatNumber(filteredStudents.length)}
                        </span>{" "}
                        students
                    </p>

                    <div className="flex flex-wrap items-center gap-3">
                        <span className="text-[11px] font-extrabold text-[#454545]">
                            Rows
                        </span>

                        <select
                            value={pageSize}
                            onChange={(event) => {
                                setPageSize(Number(event.target.value));
                                setCurrentPage(1);
                            }}
                            aria-label="Select rows per page"
                            className="h-9 rounded-lg border border-[#E8E8E8] bg-white px-2.5 text-[11px] font-extrabold text-[#252525] outline-none focus:border-[#F4512B]"
                        >
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                            <option value={12}>12</option>
                            <option value={25}>25</option>
                        </select>

                        <div className="flex items-center gap-1.5">
                            <motion.button
                                type="button"
                                disabled={currentPage <= 1}
                                onClick={() =>
                                    setCurrentPage((page) => Math.max(1, page - 1))
                                }
                                whileTap={{ scale: 0.95 }}
                                aria-label="Previous page"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:bg-[#FFF0EA] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronLeft size={16} />
                            </motion.button>

                            <span className="min-w-[72px] text-center text-[11px] font-extrabold text-[#252525]">
                                Page {currentPage} / {totalPages}
                            </span>

                            <motion.button
                                type="button"
                                disabled={currentPage >= totalPages}
                                onClick={() =>
                                    setCurrentPage((page) =>
                                        Math.min(totalPages, page + 1)
                                    )
                                }
                                whileTap={{ scale: 0.95 }}
                                aria-label="Next page"
                                className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:bg-[#FFF0EA] disabled:cursor-not-allowed disabled:opacity-40"
                            >
                                <ChevronRight size={16} />
                            </motion.button>
                        </div>
                    </div>
                </div>
            </motion.section>

            {/* ===============================================
          LOWER INSIGHTS
      =============================================== */}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {/* LEARNING PROGRESS */}

                <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-[15px] font-extrabold text-[#252525]">
                                Learning Progress
                            </h2>

                            <p className="mt-1.5 text-[12px] font-semibold text-[#454545]">
                                Current learning progress across students.
                            </p>
                        </div>

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#218653]">
                            <Activity size={19} />
                        </span>
                    </div>

                    <div className="mt-6">
                        <div className="flex items-end justify-between gap-3">
                            <p className="text-[12px] font-bold text-[#454545]">
                                Average completion
                            </p>

                            <motion.p
                                key={summary.avgProgress}
                                initial={{ opacity: 0, y: 5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-[25px] font-extrabold text-[#252525]"
                            >
                                {summary.avgProgress}%
                            </motion.p>
                        </div>

                        <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#EEEEEE]">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${summary.avgProgress}%` }}
                                transition={{
                                    duration: 1.1,
                                    ease: [0.22, 1, 0.36, 1],
                                }}
                                className="h-full rounded-full bg-[#F4512B]"
                            />
                        </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                        <div className="rounded-xl border border-[#EEEEEE] p-4">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#218653]" />

                                <p className="text-[11px] font-extrabold text-[#454545]">
                                    High progress
                                </p>
                            </div>

                            <p className="mt-2.5 text-[23px] font-extrabold text-[#252525]">
                                {
                                    students.filter(
                                        (student) => student.progress >= 75
                                    ).length
                                }
                            </p>

                            <p className="mt-1 text-[10px] font-bold text-[#454545]">
                                75% or above
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#EEEEEE] p-4">
                            <div className="flex items-center gap-2">
                                <span className="h-2.5 w-2.5 rounded-full bg-[#D49A26]" />

                                <p className="text-[11px] font-extrabold text-[#454545]">
                                    Needs attention
                                </p>
                            </div>

                            <p className="mt-2.5 text-[23px] font-extrabold text-[#252525]">
                                {summary.atRisk}
                            </p>

                            <p className="mt-1 text-[10px] font-bold text-[#454545]">
                                Below 40% progress
                            </p>
                        </div>
                    </div>
                </motion.article>

                {/* QUICK MANAGEMENT */}

                <motion.article
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                    className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-[15px] font-extrabold text-[#252525]">
                                Quick Management
                            </h2>

                            <p className="mt-1.5 text-[12px] font-semibold text-[#454545]">
                                Shortcuts for commonly used student actions.
                            </p>
                        </div>

                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                            <SlidersHorizontal size={19} />
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <motion.button
                            type="button"
                            onClick={() => {
                                setStatusFilter("Pending");
                                setCourseFilter("all");
                                setSearchQuery("");
                                setCurrentPage(1);
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="group rounded-xl border border-[#E8E8E8] bg-white p-4 text-left transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5]"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7DF] text-[#996515]">
                                    <Clock3 size={19} />
                                </span>

                                <ArrowRight
                                    size={16}
                                    className="text-[#454545] transition-all group-hover:translate-x-1 group-hover:text-[#F4512B]"
                                />
                            </div>

                            <p className="mt-4 text-[12px] font-extrabold text-[#252525]">
                                Pending Students
                            </p>

                            <p className="mt-1 text-[11px] font-semibold leading-5 text-[#454545]">
                                Review students awaiting activation.
                            </p>

                            <p className="mt-3 text-[12px] font-extrabold text-[#D9411F]">
                                {summary.pending} pending
                            </p>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={() => {
                                setStatusFilter("Active");
                                setCourseFilter("all");
                                setSearchQuery("");
                                setCurrentPage(1);
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="group rounded-xl border border-[#E8E8E8] bg-white p-4 text-left transition-colors hover:border-[#B5DEC5] hover:bg-[#F7FCF8]"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#218653]">
                                    <UserCheck size={19} />
                                </span>

                                <ArrowRight
                                    size={16}
                                    className="text-[#454545] transition-all group-hover:translate-x-1 group-hover:text-[#218653]"
                                />
                            </div>

                            <p className="mt-4 text-[12px] font-extrabold text-[#252525]">
                                Active Students
                            </p>

                            <p className="mt-1 text-[11px] font-semibold leading-5 text-[#454545]">
                                View currently active student accounts.
                            </p>

                            <p className="mt-3 text-[12px] font-extrabold text-[#218653]">
                                {summary.active} active
                            </p>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={() => {
                                setSearchQuery("");
                                setStatusFilter("all");
                                setCourseFilter("all");
                                setSortBy("progress");
                                setCurrentPage(1);
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="group rounded-xl border border-[#E8E8E8] bg-white p-4 text-left transition-colors hover:border-[#D6C4F3] hover:bg-[#FBF9FF]"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#F4EEFF] text-[#8058BE]">
                                    <TrendingUp size={19} />
                                </span>

                                <ArrowRight
                                    size={16}
                                    className="text-[#454545] transition-all group-hover:translate-x-1 group-hover:text-[#8058BE]"
                                />
                            </div>

                            <p className="mt-4 text-[12px] font-extrabold text-[#252525]">
                                Progress Overview
                            </p>

                            <p className="mt-1 text-[11px] font-semibold leading-5 text-[#454545]">
                                Sort student records by learning progress.
                            </p>

                            <p className="mt-3 text-[12px] font-extrabold text-[#8058BE]">
                                Average {summary.avgProgress}%
                            </p>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={handleExport}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="group rounded-xl border border-[#E8E8E8] bg-white p-4 text-left transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5]"
                        >
                            <div className="flex items-center justify-between gap-2">
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF5FF] text-[#347FC7]">
                                    <FileSpreadsheet size={19} />
                                </span>

                                <ArrowRight
                                    size={16}
                                    className="text-[#454545] transition-all group-hover:translate-x-1 group-hover:text-[#347FC7]"
                                />
                            </div>

                            <p className="mt-4 text-[12px] font-extrabold text-[#252525]">
                                Export Student Data
                            </p>

                            <p className="mt-1 text-[11px] font-semibold leading-5 text-[#454545]">
                                Download the current filtered student records.
                            </p>

                            <p className="mt-3 text-[12px] font-extrabold text-[#347FC7]">
                                Export CSV
                            </p>
                        </motion.button>
                    </div>
                </motion.article>
            </section>

            {/* ===============================================
          FOOTER SUMMARY
      =============================================== */}

            <motion.footer
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.3 }}
                className="flex flex-col gap-3 rounded-2xl border border-[#E8E8E8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#218653]">
                        <CheckCircle2 size={20} />
                    </span>

                    <div>
                        <p className="text-[12px] font-extrabold text-[#252525]">
                            Student workspace
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                            {formatNumber(summary.total)} student records in the current dataset.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        resetFilters();
                        setDateRange("month");
                        setChartMetric("registrations");
                        setNotice("");
                    }}
                    className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-[#E8E8E8] bg-white px-4 text-[11px] font-extrabold text-[#252525] transition-colors hover:bg-[#FFF8F5] sm:self-auto"
                >
                    <RefreshCw size={14} />
                    Reset workspace
                </button>
            </motion.footer>

            {/* ===============================================
          MODALS
      =============================================== */}

            <AddStudentModal
                open={showAddModal}
                onClose={() => setShowAddModal(false)}
                onAdd={handleAddStudent}
                courses={courseOptions
                    .filter((option) => option.value !== "all")
                    .map((option) => option.value)}
                colleges={collegeOptions}
            />

            <StudentDetailsModal
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
                onToggleStatus={handleToggleStatus}
            />
        </div>
    );
}