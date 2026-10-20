import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    PieChart,
    Pie,
    Cell,
} from "recharts";
import {
    ArrowLeft,
    ArrowUpRight,
    Award,
    BarChart3,
    BookOpen,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Download,
    Eye,
    FileText,
    GraduationCap,
    Search,
    Send,
    Sparkles,
    TrendingUp,
    Users,
    X,
    Zap,
    CircleCheck,
    CircleAlert,
    ChartNoAxesCombined,
    SlidersHorizontal,
    ClipboardCheck,
    Target,
} from "lucide-react";

const initialStudents = [
    {
        id: 1,
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        avatar: "AS",
        submitted: "Oct 18, 2026",
        status: "Submitted",
        marks: 92,
        feedback: "Excellent problem-solving and clean code structure.",
    },
    {
        id: 2,
        name: "Priya Verma",
        email: "priya.verma@example.com",
        avatar: "PV",
        submitted: "Oct 18, 2026",
        status: "Submitted",
        marks: 88,
        feedback: "Good approach. Improve edge-case handling.",
    },
    {
        id: 3,
        name: "Rahul Singh",
        email: "rahul.singh@example.com",
        avatar: "RS",
        submitted: "Oct 17, 2026",
        status: "Submitted",
        marks: 76,
        feedback: "Good effort. Review time complexity.",
    },
    {
        id: 4,
        name: "Ananya Gupta",
        email: "ananya.gupta@example.com",
        avatar: "AG",
        submitted: "Oct 17, 2026",
        status: "Pending Review",
        marks: null,
        feedback: "",
    },
    {
        id: 5,
        name: "Karan Patel",
        email: "karan.patel@example.com",
        avatar: "KP",
        submitted: "Oct 16, 2026",
        status: "Submitted",
        marks: 81,
        feedback: "Strong fundamentals. Add meaningful variable names.",
    },
    {
        id: 6,
        name: "Sneha Joshi",
        email: "sneha.joshi@example.com",
        avatar: "SJ",
        submitted: "Not submitted",
        status: "Not Submitted",
        marks: null,
        feedback: "",
    },
    {
        id: 7,
        name: "Vikram Mehta",
        email: "vikram.mehta@example.com",
        avatar: "VM",
        submitted: "Oct 19, 2026",
        status: "Pending Review",
        marks: null,
        feedback: "",
    },
    {
        id: 8,
        name: "Neha Agarwal",
        email: "neha.agarwal@example.com",
        avatar: "NA",
        submitted: "Not submitted",
        status: "Not Submitted",
        marks: null,
        feedback: "",
    },
];

const weeklyData = [
    { day: "Mon", submissions: 12 },
    { day: "Tue", submissions: 19 },
    { day: "Wed", submissions: 15 },
    { day: "Thu", submissions: 28 },
    { day: "Fri", submissions: 22 },
    { day: "Sat", submissions: 35 },
    { day: "Sun", submissions: 18 },
];

const initialAssignment = {
    title: "Java & DSA Coding Challenge",
    course: "Java Programming + Data Structures",
    college: "RKGIT College",
    batch: "Batch 2026 - A",
    instructor: "You",
    assignmentId: "ASN-2026-014",
    created: "Oct 10, 2026",
    deadline: "Oct 25, 2026",
    maxMarks: 100,
    difficulty: "Intermediate",
    description:
        "Solve the given data structure and algorithm problems using Java. Focus on clean code, optimal time complexity, edge cases, and clear explanations of your approach.",
    objectives: [
        "Implement common array and string operations.",
        "Apply sorting and searching algorithms.",
        "Analyze time and space complexity.",
        "Write clean, reusable Java code.",
    ],
};

const STATUS_STYLES = {
    Submitted: "bg-emerald-50 text-emerald-800 ring-emerald-200",
    "Pending Review": "bg-amber-50 text-amber-800 ring-amber-200",
    "Not Submitted": "bg-rose-50 text-rose-800 ring-rose-200",
    Reviewed: "bg-sky-50 text-sky-800 ring-sky-200",
};

const SORT_OPTIONS = [
    {
        value: "name",
        label: "Student name",
        description: "Alphabetical order",
        icon: "Aa",
    },
    {
        value: "marks-high",
        label: "Highest marks",
        description: "Top scores first",
        icon: "↑",
    },
    {
        value: "marks-low",
        label: "Lowest marks",
        description: "Lowest scores first",
        icon: "↓",
    },
    {
        value: "status",
        label: "Submission status",
        description: "Group by status",
        icon: "≡",
    },
];

const EASE = [0.22, 1, 0.36, 1];

const CHART_COLORS = ["#10B981", "#F59E0B", "#F43F5E"];

function cn(...classes) {
    return classes.filter(Boolean).join(" ");
}

function formatPercent(value) {
    return `${Math.round(value)}%`;
}

function downloadCSV(rows) {
    const headers = [
        "Student Name",
        "Email",
        "Submission Date",
        "Status",
        "Marks",
        "Feedback",
    ];

    // Correctly escape double quotes inside CSV values.
    const escapeCSV = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
        headers.map(escapeCSV).join(","),
        ...rows.map((student) =>
            [
                student.name,
                student.email,
                student.submitted,
                student.status,
                student.marks ?? "",
                student.feedback,
            ]
                .map(escapeCSV)
                .join(",")
        ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", csv], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "assignment-student-report.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function StatusBadge({ status }) {
    const dotStyles = {
        Submitted: "bg-emerald-500",
        "Pending Review": "bg-amber-500",
        "Not Submitted": "bg-rose-500",
        Reviewed: "bg-sky-500",
    };

    return (
        <span
            className={cn(
                "inline-flex items-center gap-2 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-bold ring-1 ring-inset",
                STATUS_STYLES[status] ||
                "bg-slate-100 text-slate-700 ring-slate-200"
            )}
        >
            <span
                className={cn(
                    "h-1.5 w-1.5 rounded-full",
                    dotStyles[status] || "bg-slate-400"
                )}
            />
            {status}
        </span>
    );
}

function SectionTitle({ eyebrow, title, description, action }) {
    return (
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                {eyebrow && (
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-1.5 w-5 rounded-full bg-emerald-500" />
                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-800">
                            {eyebrow}
                        </p>
                    </div>
                )}

                <h2 className="text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">
                    {title}
                </h2>

                {description && (
                    <p className="mt-1.5 text-sm leading-6 text-slate-600">
                        {description}
                    </p>
                )}
            </div>

            {action}
        </div>
    );
}

function MetricCard({
    title,
    value,
    description,
    icon: Icon,
    color = "emerald",
    delay = 0,
    trend,
}) {
    const reduceMotion = useReducedMotion();

    const themes = {
        emerald: {
            icon: "bg-emerald-50 text-emerald-800 ring-emerald-100",
            glow: "bg-emerald-400/10",
            bar: "bg-emerald-500",
            label: "text-emerald-800",
        },
        blue: {
            icon: "bg-blue-50 text-blue-800 ring-blue-100",
            glow: "bg-blue-400/10",
            bar: "bg-blue-500",
            label: "text-blue-800",
        },
        amber: {
            icon: "bg-amber-50 text-amber-800 ring-amber-100",
            glow: "bg-amber-400/10",
            bar: "bg-amber-500",
            label: "text-amber-800",
        },
        violet: {
            icon: "bg-violet-50 text-violet-800 ring-violet-100",
            glow: "bg-violet-400/10",
            bar: "bg-violet-500",
            label: "text-violet-800",
        },
    };

    const theme = themes[color] || themes.emerald;

    return (
        <motion.article
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay, ease: EASE }}
            whileHover={
                reduceMotion
                    ? undefined
                    : { y: -4, transition: { duration: 0.2 } }
            }
            className="group relative isolate overflow-hidden rounded-[22px] border border-slate-200/90 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-xl sm:p-6"
        >
            <div
                className={cn(
                    "pointer-events-none absolute -right-8 -top-8 -z-10 h-28 w-28 rounded-full blur-2xl transition-transform duration-500 group-hover:scale-125",
                    theme.glow
                )}
            />

            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-600">{title}</p>
                    <p className="mt-3 break-words text-3xl font-black tracking-tight text-slate-950 sm:text-[34px]">
                        {value}
                    </p>
                </div>

                <div
                    className={cn(
                        "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1 ring-inset transition-transform duration-300 group-hover:scale-105",
                        theme.icon
                    )}
                >
                    <Icon size={22} />
                </div>
            </div>

            <div className="mt-5 flex min-h-5 flex-wrap items-center gap-x-2 gap-y-1">
                {trend && (
                    <span
                        className={cn(
                            "inline-flex items-center gap-1 text-xs font-bold",
                            theme.label
                        )}
                    >
                        <TrendingUp size={13} />
                        {trend}
                    </span>
                )}
                <span className="text-xs leading-5 text-slate-600">
                    {description}
                </span>
            </div>

            <div className="mt-4 h-1 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                    initial={{ width: reduceMotion ? "72%" : 0 }}
                    animate={{ width: "72%" }}
                    transition={{ duration: 0.85, delay: delay + 0.15, ease: EASE }}
                    className={cn("h-full rounded-full", theme.bar)}
                />
            </div>
        </motion.article>
    );
}

function SubmissionModal({ student, onClose, onSave, maxMarks }) {
    const [marks, setMarks] = useState(String(student.marks ?? ""));
    const [feedback, setFeedback] = useState(student.feedback || "");
    const [error, setError] = useState("");

    const handleSubmit = (event) => {
        event.preventDefault();

        const parsedMarks = Number(marks);

        if (
            marks.trim() === "" ||
            !Number.isFinite(parsedMarks) ||
            parsedMarks < 0 ||
            parsedMarks > maxMarks
        ) {
            setError(`Marks 0 se ${maxMarks} ke beech hone chahiye.`);
            return;
        }

        onSave(student.id, parsedMarks, feedback.trim());
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-md sm:items-center sm:p-4"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.22, ease: EASE }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-modal-title"
                className="max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-[28px] border border-slate-200 bg-white p-5 shadow-2xl sm:rounded-[28px] sm:p-7"
            >
                <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-sm font-extrabold text-emerald-900 ring-1 ring-emerald-100">
                            {student.avatar}
                        </div>
                        <div>
                            <h3
                                id="review-modal-title"
                                className="text-lg font-extrabold text-slate-950"
                            >
                                Review submission
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">{student.name}</p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close review dialog"
                        className="rounded-xl p-2 text-slate-600 transition hover:bg-slate-100"
                    >
                        <X size={19} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                    <div>
                        <label
                            htmlFor="student-marks"
                            className="mb-2 block text-sm font-bold text-slate-800"
                        >
                            Marks (out of {maxMarks})
                        </label>
                        <input
                            id="student-marks"
                            type="number"
                            min="0"
                            max={maxMarks}
                            step="1"
                            required
                            value={marks}
                            onChange={(event) => {
                                setMarks(event.target.value);
                                setError("");
                            }}
                            placeholder={`Enter marks / ${maxMarks}`}
                            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        />
                    </div>

                    <div>
                        <label
                            htmlFor="student-feedback"
                            className="mb-2 block text-sm font-bold text-slate-800"
                        >
                            Feedback for student
                        </label>
                        <textarea
                            id="student-feedback"
                            rows={4}
                            value={feedback}
                            onChange={(event) => setFeedback(event.target.value)}
                            placeholder="Share improvement points and positive feedback..."
                            className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                        />
                    </div>

                    {error && (
                        <p role="alert" className="text-sm font-semibold text-rose-700">
                            {error}
                        </p>
                    )}

                    <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-emerald-900"
                        >
                            <Check size={16} />
                            Save review
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

function SortDropdown({ sortBy, setSortBy }) {
    const [open, setOpen] = useState(false);

    const selected =
        SORT_OPTIONS.find((option) => option.value === sortBy) || SORT_OPTIONS[0];

    return (
        <div className="relative z-30 w-full">
            {open && (
                <button
                    type="button"
                    aria-label="Close sort menu"
                    onClick={() => setOpen(false)}
                    className="fixed inset-0 z-0 cursor-default"
                />
            )}

            <div
                className={cn(
                    "relative z-10 rounded-2xl border bg-white transition-colors duration-200",
                    open
                        ? "border-emerald-400 shadow-[0_0_0_4px_rgba(16,185,129,0.10),0_18px_45px_rgba(15,23,42,0.10)]"
                        : "border-slate-200 shadow-sm hover:border-slate-300"
                )}
            >
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => setOpen((current) => !current)}
                    className="flex h-12 w-full items-center gap-3 rounded-2xl px-4 text-left outline-none"
                >
                    <span
                        className={cn(
                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition-colors",
                            open
                                ? "bg-emerald-100 text-emerald-900"
                                : "bg-slate-100 text-slate-600"
                        )}
                    >
                        <SlidersHorizontal size={16} />
                    </span>

                    <span className="min-w-0 flex-1 truncate text-sm font-extrabold text-slate-900">
                        <span className="font-semibold text-slate-600">Sort by: </span>
                        {selected.label}
                    </span>

                    <ChevronDown
                        size={17}
                        className={cn(
                            "shrink-0 text-slate-500 transition-transform duration-200",
                            open && "rotate-180 text-emerald-800"
                        )}
                    />
                </button>

                <AnimatePresence>
                    {open && (
                        <motion.div
                            initial={{ opacity: 0, y: -5, scale: 0.99 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -4, scale: 0.99 }}
                            transition={{ duration: 0.14, ease: EASE }}
                            role="listbox"
                            aria-label="Sort students"
                            className="absolute left-0 right-0 top-[calc(100%+9px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_20px_55px_rgba(15,23,42,0.16)]"
                        >
                            <div className="flex items-center justify-between px-3 pb-2 pt-1">
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                                    Sort students
                                </span>
                                <span className="rounded-md bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800">
                                    4 options
                                </span>
                            </div>

                            <div className="space-y-1">
                                {SORT_OPTIONS.map((option) => {
                                    const active = sortBy === option.value;

                                    return (
                                        <button
                                            key={option.value}
                                            type="button"
                                            role="option"
                                            aria-selected={active}
                                            onClick={() => {
                                                setSortBy(option.value);
                                                setOpen(false);
                                            }}
                                            className={cn(
                                                "group flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors duration-150",
                                                active
                                                    ? "bg-emerald-50 ring-1 ring-inset ring-emerald-200"
                                                    : "hover:bg-slate-50"
                                            )}
                                        >
                                            <span
                                                className={cn(
                                                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-sm font-black transition-colors",
                                                    active
                                                        ? "bg-emerald-800 text-white"
                                                        : "bg-slate-100 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-900"
                                                )}
                                            >
                                                {option.icon}
                                            </span>

                                            <span className="min-w-0 flex-1">
                                                <span
                                                    className={cn(
                                                        "block text-sm font-bold",
                                                        active ? "text-emerald-950" : "text-slate-800"
                                                    )}
                                                >
                                                    {option.label}
                                                </span>
                                                <span className="mt-0.5 block text-xs text-slate-500">
                                                    {option.description}
                                                </span>
                                            </span>

                                            {active && (
                                                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-800 text-white">
                                                    <Check size={13} strokeWidth={3} />
                                                </span>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>

                            <div className="mt-2 border-t border-slate-100 px-3 py-2">
                                <p className="text-[10px] font-medium text-slate-500">
                                    Choose how student records are arranged.
                                </p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default function TrainerAssignmentDetailsPage() {
    const reduceMotion = useReducedMotion();

    const [assignment] = useState(initialAssignment);
    const [students, setStudents] = useState(initialStudents);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [sortBy, setSortBy] = useState("name");
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [toast, setToast] = useState("");

    const stats = useMemo(() => {
        const submitted = students.filter(
            (student) =>
                student.status === "Submitted" || student.status === "Reviewed"
        ).length;

        const pending = students.filter(
            (student) => student.status === "Pending Review"
        ).length;

        const notSubmitted = students.filter(
            (student) => student.status === "Not Submitted"
        ).length;

        const reviewed = students.filter(
            (student) => student.status === "Reviewed"
        ).length;

        const markedStudents = students.filter(
            (student) => typeof student.marks === "number"
        );

        const average = markedStudents.length
            ? markedStudents.reduce((sum, student) => sum + student.marks, 0) /
            markedStudents.length
            : 0;

        return {
            total: students.length,
            submitted,
            pending,
            notSubmitted,
            reviewed,
            average,
            submissionRate: students.length
                ? (submitted / students.length) * 100
                : 0,
            reviewRate: students.length
                ? (reviewed / students.length) * 100
                : 0,
        };
    }, [students]);

    const filteredStudents = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        const result = students.filter((student) => {
            const matchesSearch =
                !normalizedSearch ||
                student.name.toLowerCase().includes(normalizedSearch) ||
                student.email.toLowerCase().includes(normalizedSearch);

            const matchesStatus =
                statusFilter === "All" || student.status === statusFilter;

            return matchesSearch && matchesStatus;
        });

        return [...result].sort((a, b) => {
            if (sortBy === "marks-high") {
                return (b.marks ?? -1) - (a.marks ?? -1);
            }

            if (sortBy === "marks-low") {
                return (a.marks ?? Infinity) - (b.marks ?? Infinity);
            }

            if (sortBy === "status") {
                return a.status.localeCompare(b.status);
            }

            return a.name.localeCompare(b.name);
        });
    }, [students, search, statusFilter, sortBy]);

    const distributionData = [
        {
            name: "Submitted",
            value: stats.submitted,
            color: CHART_COLORS[0],
        },
        {
            name: "Pending review",
            value: stats.pending,
            color: CHART_COLORS[1],
        },
        {
            name: "Not submitted",
            value: stats.notSubmitted,
            color: CHART_COLORS[2],
        },
    ];

    const weeklyTotal = weeklyData.reduce(
        (sum, item) => sum + item.submissions,
        0
    );

    const peakDay = weeklyData.reduce(
        (peak, item) =>
            item.submissions > peak.submissions ? item : peak,
        weeklyData[0]
    );

    const showToast = (message) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 2800);
    };

    const saveReview = (studentId, marks, feedback) => {
        setStudents((current) =>
            current.map((student) =>
                student.id === studentId
                    ? {
                        ...student,
                        marks,
                        feedback,
                        status: "Reviewed",
                    }
                    : student
            )
        );

        setSelectedStudent(null);
        showToast("Review saved successfully.");
    };

    const exportReport = () => {
        downloadCSV(filteredStudents);
        showToast("Student report exported.");
    };

    const statusTabs = [
        {
            label: "All students",
            value: "All",
            count: stats.total,
        },
        {
            label: "Submitted",
            value: "Submitted",
            count: students.filter((student) => student.status === "Submitted")
                .length,
        },
        {
            label: "Pending review",
            value: "Pending Review",
            count: stats.pending,
        },
        {
            label: "Not submitted",
            value: "Not Submitted",
            count: stats.notSubmitted,
        },
        {
            label: "Reviewed",
            value: "Reviewed",
            count: stats.reviewed,
        },
    ];

    const pageReveal = reduceMotion
        ? {}
        : {
            initial: { opacity: 0, y: 14 },
            whileInView: { opacity: 1, y: 0 },
            viewport: { once: true, amount: 0.08 },
        };

    return (
        <div className="min-h-screen bg-[#F5F8F6] text-slate-900">
            <div className="mx-auto max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
                {/* Breadcrumb */}
                <motion.div
                    initial={reduceMotion ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex flex-wrap items-center gap-2 text-sm text-slate-600"
                >
                    <button
                        type="button"
                        onClick={() =>
                            showToast("Connect this action to your assignments route.")
                        }
                        className="inline-flex items-center gap-2 rounded-lg py-1 font-semibold transition hover:text-emerald-800"
                    >
                        <ArrowLeft size={16} />
                        Assignments
                    </button>
                    <span className="text-slate-300">/</span>
                    <span className="font-bold text-slate-900">Assignment Details</span>
                </motion.div>

                {/* Hero */}
                <motion.section
                    initial={reduceMotion ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="relative isolate overflow-hidden rounded-[28px] bg-gradient-to-br from-[#063D2B] via-[#08764B] to-[#12A66B] p-5 text-white shadow-[0_20px_55px_rgba(5,90,55,0.17)] sm:p-7 lg:p-9"
                >
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden opacity-30">
                        <motion.div
                            animate={reduceMotion ? undefined : { rotate: 360 }}
                            transition={{
                                duration: 70,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className="absolute -right-16 -top-28 h-80 w-80 rounded-full border border-white/30"
                        />
                        <div className="absolute -right-3 -top-16 h-56 w-56 rounded-full border border-white/30" />
                        <motion.div
                            animate={
                                reduceMotion
                                    ? undefined
                                    : {
                                        scale: [1, 1.12, 1],
                                        opacity: [0.15, 0.3, 0.15],
                                    }
                            }
                            transition={{
                                duration: 7,
                                repeat: Infinity,
                                ease: "easeInOut",
                            }}
                            className="absolute -bottom-36 left-1/3 h-72 w-72 rounded-full bg-emerald-200/20 blur-3xl"
                        />
                    </div>

                    <div className="relative grid gap-8 xl:grid-cols-[1fr_290px] xl:items-center">
                        <div className="min-w-0">
                            <div className="mb-5 flex flex-wrap items-center gap-2">
                                <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold">
                                    <span className="h-2 w-2 rounded-full bg-emerald-300" />
                                    Assignment workspace
                                </span>
                                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold">
                                    {assignment.assignmentId}
                                </span>
                                <span className="rounded-full border border-white/25 bg-white/15 px-3 py-1.5 text-xs font-bold">
                                    {assignment.difficulty}
                                </span>
                            </div>

                            <h1 className="max-w-4xl text-2xl font-black leading-tight tracking-tight sm:text-3xl lg:text-[42px]">
                                {assignment.title}
                            </h1>

                            <p className="mt-4 max-w-2xl text-sm leading-7 text-white/90 sm:text-base">
                                Track submissions, evaluate student performance and keep your
                                learning batch moving forward — all from one workspace.
                            </p>

                            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-3">
                                {[
                                    {
                                        label: "College",
                                        value: assignment.college,
                                        icon: GraduationCap,
                                    },
                                    {
                                        label: "Course",
                                        value: assignment.course,
                                        icon: BookOpen,
                                    },
                                    {
                                        label: "Deadline",
                                        value: assignment.deadline,
                                        icon: CalendarDays,
                                    },
                                ].map((item, index) => {
                                    const Icon = item.icon;

                                    return (
                                        <motion.div
                                            key={item.label}
                                            initial={reduceMotion ? false : { opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{
                                                delay: 0.12 + index * 0.08,
                                                duration: 0.35,
                                                ease: EASE,
                                            }}
                                            className="flex min-w-0 items-start gap-3 rounded-xl border border-white/25 bg-white/15 px-3.5 py-3 backdrop-blur-lg"
                                        >
                                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/15">
                                                <Icon size={18} />
                                            </div>
                                            <div className="min-w-0">
                                                <p className="text-[10px] font-bold uppercase tracking-wider text-white/90">
                                                    {item.label}
                                                </p>
                                                <p className="mt-1 break-words text-sm font-extrabold leading-5">
                                                    {item.value}
                                                </p>
                                            </div>
                                        </motion.div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="rounded-[24px] border border-white/25 bg-white/15 p-5 shadow-inner backdrop-blur-xl sm:p-6">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm font-bold">Submission rate</p>
                                    <motion.p
                                        key={Math.round(stats.submissionRate)}
                                        initial={reduceMotion ? false : { opacity: 0.5, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.25 }}
                                        className="mt-2 text-4xl font-black tracking-tight"
                                    >
                                        {formatPercent(stats.submissionRate)}
                                    </motion.p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20">
                                    <ChartNoAxesCombined size={24} />
                                </div>
                            </div>

                            <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-black/20">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${stats.submissionRate}%` }}
                                    transition={{ duration: 0.9, ease: EASE }}
                                    className="h-full rounded-full bg-gradient-to-r from-lime-200 to-white"
                                />
                            </div>

                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs font-bold">
                                <span>{stats.submitted} submissions received</span>
                                <span>{stats.notSubmitted} remaining</span>
                            </div>

                            <div className="mt-6 grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={exportReport}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-3 py-3 text-sm font-extrabold text-emerald-950 shadow-lg transition hover:-translate-y-0.5 hover:bg-emerald-50"
                                >
                                    <Download size={16} />
                                    Export
                                </button>

                                <button
                                    type="button"
                                    onClick={() =>
                                        showToast("Assignment editing can be connected to your edit form.")
                                    }
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/30 bg-white/15 px-3 py-3 text-sm font-bold transition hover:bg-white/25"
                                >
                                    <FileText size={16} />
                                    Edit
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Metrics */}
                <motion.section {...pageReveal}>
                    <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <div className="mb-2 flex items-center gap-2">
                                <Sparkles size={16} className="text-emerald-700" />
                                <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-emerald-800">
                                    Performance at a glance
                                </span>
                            </div>
                            <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl">
                                Assignment overview
                            </h2>
                            <p className="mt-1.5 text-sm text-slate-600">
                                Batch performance and current assignment progress.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-full border border-emerald-100 bg-white px-3 py-2 text-xs font-bold text-emerald-900 shadow-sm">
                            <span className="h-2 w-2 rounded-full bg-emerald-500" />
                            Live page metrics
                        </span>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                        <MetricCard
                            title="Enrolled students"
                            value={stats.total}
                            description="Students in this batch"
                            icon={Users}
                            color="emerald"
                            trend="Batch overview"
                            delay={0.04}
                        />
                        <MetricCard
                            title="Submissions received"
                            value={stats.submitted}
                            description={`${formatPercent(stats.submissionRate)} submission rate`}
                            icon={FileText}
                            color="blue"
                            trend="Progress tracking"
                            delay={0.1}
                        />
                        <MetricCard
                            title="Pending reviews"
                            value={stats.pending}
                            description="Awaiting trainer review"
                            icon={Clock3}
                            color="amber"
                            trend={stats.pending ? "Action needed" : "All caught up"}
                            delay={0.16}
                        />
                        <MetricCard
                            title="Average marks"
                            value={`${stats.average.toFixed(1)}/${assignment.maxMarks}`}
                            description={`${stats.reviewed} reviewed submissions`}
                            icon={Award}
                            color="violet"
                            trend={stats.reviewed ? "Based on marked work" : "Awaiting reviews"}
                            delay={0.22}
                        />
                    </div>
                </motion.section>

                {/* Assignment information and charts */}
                <div className="grid grid-cols-1 gap-6 xl:grid-cols-[0.9fr_1.1fr]">
                    <motion.section
                        {...pageReveal}
                        transition={{ duration: 0.45, ease: EASE }}
                        className="rounded-[24px] border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6"
                    >
                        <SectionTitle
                            eyebrow="Assignment brief"
                            title="Assignment information"
                            description="Instructions, requirements and important dates."
                            action={
                                <span className="inline-flex w-fit items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900">
                                    <Zap size={13} />
                                    {assignment.difficulty}
                                </span>
                            }
                        />

                        <div className="rounded-2xl border border-emerald-100 bg-gradient-to-br from-emerald-50 to-teal-50/50 p-4 sm:p-5">
                            <div className="mb-3 flex items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
                                    <BookOpen size={18} />
                                </div>
                                <p className="text-sm font-extrabold text-emerald-950">
                                    Assignment brief
                                </p>
                            </div>
                            <p className="text-sm leading-7 text-slate-800">
                                {assignment.description}
                            </p>
                        </div>

                        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {[
                                {
                                    label: "Course",
                                    value: assignment.course,
                                    icon: BookOpen,
                                    color: "emerald",
                                },
                                {
                                    label: "College",
                                    value: assignment.college,
                                    icon: GraduationCap,
                                    color: "blue",
                                },
                                {
                                    label: "Batch",
                                    value: assignment.batch,
                                    icon: Users,
                                    color: "violet",
                                },
                                {
                                    label: "Maximum marks",
                                    value: `${assignment.maxMarks} marks`,
                                    icon: Award,
                                    color: "amber",
                                },
                                {
                                    label: "Created on",
                                    value: assignment.created,
                                    icon: CalendarDays,
                                    color: "blue",
                                },
                                {
                                    label: "Deadline",
                                    value: assignment.deadline,
                                    icon: Clock3,
                                    color: "rose",
                                },
                            ].map((item, index) => {
                                const Icon = item.icon;

                                const iconTheme = {
                                    emerald: "bg-emerald-50 text-emerald-800",
                                    blue: "bg-blue-50 text-blue-800",
                                    violet: "bg-violet-50 text-violet-800",
                                    amber: "bg-amber-50 text-amber-800",
                                    rose: "bg-rose-50 text-rose-800",
                                };

                                return (
                                    <motion.div
                                        key={item.label}
                                        initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true, amount: 0.2 }}
                                        transition={{
                                            delay: index * 0.04,
                                            duration: 0.3,
                                            ease: EASE,
                                        }}
                                        className="group flex min-w-0 items-start gap-3 rounded-2xl border border-slate-200/80 bg-white p-3.5 transition-colors hover:border-emerald-200 hover:bg-slate-50/70"
                                    >
                                        <div
                                            className={cn(
                                                "rounded-xl p-2.5 transition-transform duration-200 group-hover:scale-105",
                                                iconTheme[item.color]
                                            )}
                                        >
                                            <Icon size={17} />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-xs font-semibold text-slate-600">
                                                {item.label}
                                            </p>
                                            <p className="mt-1.5 break-words text-sm font-bold leading-5 text-slate-950">
                                                {item.value}
                                            </p>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        <div className="mt-6">
                            <div className="mb-4 flex items-center justify-between gap-3">
                                <h3 className="text-sm font-extrabold text-slate-950">
                                    Learning objectives
                                </h3>
                                <span className="rounded-lg bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900">
                                    {assignment.objectives.length} objectives
                                </span>
                            </div>

                            <div className="space-y-3">
                                {assignment.objectives.map((objective, index) => (
                                    <motion.div
                                        key={objective}
                                        initial={reduceMotion ? false : { opacity: 0, x: -7 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{
                                            delay: index * 0.05,
                                            duration: 0.3,
                                            ease: EASE,
                                        }}
                                        className="flex items-start gap-3"
                                    >
                                        <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                                            <Check size={13} strokeWidth={3} />
                                        </span>
                                        <p className="flex-1 text-sm leading-6 text-slate-700">
                                            {objective}
                                        </p>
                                        <span className="text-[10px] font-extrabold tracking-wider text-slate-400">
                                            0{index + 1}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </motion.section>

                    <div className="grid min-w-0 grid-cols-1 gap-6">
                        {/* Donut chart */}
                        <motion.section
                            {...pageReveal}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="overflow-hidden rounded-[24px] border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6"
                        >
                            <SectionTitle
                                eyebrow="Visual analytics"
                                title="Submission distribution"
                                description="See where your students stand right now."
                                action={
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-100 text-emerald-800 ring-1 ring-emerald-100">
                                        <ChartNoAxesCombined size={20} />
                                    </div>
                                }
                            />

                            <div className="grid grid-cols-1 items-center gap-5 sm:grid-cols-[minmax(180px,0.9fr)_1fr]">
                                <div className="relative mx-auto h-[240px] w-full max-w-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <defs>
                                                <linearGradient
                                                    id="donutGreen"
                                                    x1="0"
                                                    y1="0"
                                                    x2="1"
                                                    y2="1"
                                                >
                                                    <stop offset="0%" stopColor="#34D399" />
                                                    <stop offset="100%" stopColor="#047857" />
                                                </linearGradient>
                                                <linearGradient
                                                    id="donutAmber"
                                                    x1="0"
                                                    y1="0"
                                                    x2="1"
                                                    y2="1"
                                                >
                                                    <stop offset="0%" stopColor="#FCD34D" />
                                                    <stop offset="100%" stopColor="#D97706" />
                                                </linearGradient>
                                                <linearGradient
                                                    id="donutRose"
                                                    x1="0"
                                                    y1="0"
                                                    x2="1"
                                                    y2="1"
                                                >
                                                    <stop offset="0%" stopColor="#FDA4AF" />
                                                    <stop offset="100%" stopColor="#E11D48" />
                                                </linearGradient>
                                            </defs>

                                            <Pie
                                                data={distributionData}
                                                dataKey="value"
                                                nameKey="name"
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={66}
                                                outerRadius={91}
                                                paddingAngle={4}
                                                cornerRadius={7}
                                                stroke="none"
                                                isAnimationActive={!reduceMotion}
                                                animationBegin={100}
                                                animationDuration={1000}
                                                animationEasing="ease-out"
                                            >
                                                {distributionData.map((entry, index) => (
                                                    <Cell
                                                        key={entry.name}
                                                        fill={
                                                            [
                                                                "url(#donutGreen)",
                                                                "url(#donutAmber)",
                                                                "url(#donutRose)",
                                                            ][index]
                                                        }
                                                    />
                                                ))}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>

                                    <div className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
                                        <span className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-600">
                                            Submission
                                        </span>
                                        <motion.span
                                            key={Math.round(stats.submissionRate)}
                                            initial={reduceMotion ? false : { opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.25 }}
                                            className="mt-1 text-4xl font-black leading-none tracking-tight text-slate-950"
                                        >
                                            {formatPercent(stats.submissionRate)}
                                        </motion.span>
                                        <span className="mt-2 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-900">
                                            {stats.submitted} of {stats.total} students
                                        </span>
                                    </div>
                                </div>

                                <div className="min-w-0 space-y-3">
                                    {distributionData.map((item, index) => {
                                        const percent = stats.total
                                            ? (item.value / stats.total) * 100
                                            : 0;

                                        return (
                                            <motion.div
                                                key={item.name}
                                                initial={reduceMotion ? false : { opacity: 0, x: 10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{
                                                    delay: index * 0.07,
                                                    duration: 0.35,
                                                    ease: EASE,
                                                }}
                                                className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 transition-colors hover:border-slate-300 hover:bg-white"
                                            >
                                                <div className="flex items-center justify-between gap-3">
                                                    <div className="flex min-w-0 items-center gap-2.5">
                                                        <span
                                                            className="h-3 w-3 shrink-0 rounded-md"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                        <span className="truncate text-sm font-bold text-slate-800">
                                                            {item.name}
                                                        </span>
                                                    </div>
                                                    <span className="text-lg font-black text-slate-950">
                                                        {item.value}
                                                    </span>
                                                </div>

                                                <div className="mt-3 flex items-center gap-3">
                                                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-200">
                                                        <motion.div
                                                            initial={{ width: 0 }}
                                                            whileInView={{ width: `${percent}%` }}
                                                            viewport={{ once: true }}
                                                            transition={{
                                                                duration: 0.75,
                                                                delay: index * 0.08,
                                                                ease: EASE,
                                                            }}
                                                            className="h-full rounded-full"
                                                            style={{ backgroundColor: item.color }}
                                                        />
                                                    </div>
                                                    <span className="w-10 shrink-0 text-right text-xs font-extrabold tabular-nums text-slate-700">
                                                        {Math.round(percent)}%
                                                    </span>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            </div>

                            <div className="mt-5 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50/50 p-4">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-800 shadow-sm">
                                    {stats.notSubmitted === 0 ? (
                                        <CircleCheck size={20} />
                                    ) : (
                                        <CircleAlert size={20} />
                                    )}
                                </div>
                                <div>
                                    <p className="text-sm font-extrabold text-emerald-950">
                                        {stats.notSubmitted === 0
                                            ? "Everyone has submitted"
                                            : `${stats.notSubmitted} student${stats.notSubmitted > 1 ? "s" : ""
                                            } still need to submit`}
                                    </p>
                                    <p className="mt-1 text-xs leading-5 text-emerald-900">
                                        {stats.pending} submission
                                        {stats.pending !== 1 ? "s" : ""} waiting for review.
                                        Prioritize pending evaluations.
                                    </p>
                                </div>
                            </div>
                        </motion.section>

                        {/* Weekly bar chart */}
                        <motion.section
                            {...pageReveal}
                            transition={{ duration: 0.45, ease: EASE }}
                            className="overflow-hidden rounded-[24px] border border-slate-200/90 bg-white p-5 shadow-sm sm:p-6"
                        >
                            <div className="mb-2 flex items-start justify-between gap-3">
                                <div>
                                    <div className="mb-2 flex items-center gap-2">
                                        <span className="h-1.5 w-5 rounded-full bg-blue-500" />
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-blue-800">
                                            Weekly activity
                                        </p>
                                    </div>
                                    <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl">
                                        Submission trends
                                    </h2>
                                    <p className="mt-1.5 text-sm text-slate-600">
                                        Daily submissions received throughout the week.
                                    </p>
                                </div>

                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-blue-800 ring-1 ring-blue-100">
                                    <BarChart3 size={20} />
                                </div>
                            </div>

                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                                <span className="inline-flex items-center gap-2 text-xs font-bold text-slate-700">
                                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                                    Daily submissions
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 px-2.5 py-1.5 text-xs font-bold text-blue-900">
                                    <TrendingUp size={13} />
                                    Peak: {peakDay.day}
                                </span>
                            </div>

                            {/* Extra top padding and wider Y-axis prevent labels being cut off. */}
                            <motion.div
                                initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, amount: 0.15 }}
                                transition={{ duration: 0.5, ease: EASE }}
                                className="mt-4 h-[285px] w-full overflow-visible sm:h-[315px]"
                            >
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart
                                        data={weeklyData}
                                        margin={{
                                            top: 28,
                                            right: 18,
                                            left: 8,
                                            bottom: 12,
                                        }}
                                        barCategoryGap="25%"
                                    >
                                        <defs>
                                            <linearGradient
                                                id="submissionBarGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop offset="0%" stopColor="#6EE7B7" />
                                                <stop offset="100%" stopColor="#059669" />
                                            </linearGradient>

                                            <linearGradient
                                                id="peakBarGradient"
                                                x1="0"
                                                y1="0"
                                                x2="0"
                                                y2="1"
                                            >
                                                <stop offset="0%" stopColor="#60A5FA" />
                                                <stop offset="100%" stopColor="#2563EB" />
                                            </linearGradient>
                                        </defs>

                                        <CartesianGrid
                                            stroke="#E8EFEB"
                                            strokeDasharray="4 6"
                                            vertical={false}
                                        />

                                        <XAxis
                                            dataKey="day"
                                            axisLine={false}
                                            tickLine={false}
                                            tickMargin={12}
                                            interval={0}
                                            height={36}
                                            tick={{
                                                fill: "#475569",
                                                fontSize: 12,
                                                fontWeight: 700,
                                            }}
                                        />

                                        <YAxis
                                            axisLine={false}
                                            tickLine={false}
                                            tickMargin={8}
                                            tick={{
                                                fill: "#475569",
                                                fontSize: 12,
                                                fontWeight: 600,
                                            }}
                                            allowDecimals={false}
                                            width={42}
                                            tickCount={5}
                                            domain={[0, 40]}
                                            padding={{ top: 8, bottom: 0 }}
                                        />

                                        {/* Tooltip intentionally omitted: no hover popup. */}
                                        <Bar
                                            dataKey="submissions"
                                            name="Submissions"
                                            radius={[9, 9, 3, 3]}
                                            maxBarSize={38}
                                            isAnimationActive={!reduceMotion}
                                            animationBegin={100}
                                            animationDuration={1300}
                                            animationEasing="ease-out"
                                            minPointSize={4}
                                            label={{
                                                position: "top",
                                                fill: "#334155",
                                                fontSize: 12,
                                                fontWeight: 800,
                                                offset: 9,
                                            }}
                                        >
                                            {weeklyData.map((entry) => (
                                                <Cell
                                                    key={entry.day}
                                                    fill={
                                                        entry.day === peakDay.day
                                                            ? "url(#peakBarGradient)"
                                                            : "url(#submissionBarGradient)"
                                                    }
                                                />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </motion.div>

                            <div className="mt-4 grid grid-cols-1 gap-2 border-t border-slate-100 pt-4 sm:grid-cols-3">
                                <div className="rounded-xl border border-slate-100 bg-slate-50 p-3">
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-600">
                                        Weekly total
                                    </p>
                                    <p className="mt-1.5 text-xl font-black tabular-nums text-slate-950">
                                        {weeklyTotal}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3">
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-900">
                                        Daily average
                                    </p>
                                    <p className="mt-1.5 text-xl font-black tabular-nums text-emerald-950">
                                        {(weeklyTotal / weeklyData.length).toFixed(1)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-blue-100 bg-blue-50/70 p-3">
                                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-blue-900">
                                        Peak day
                                    </p>
                                    <p className="mt-1.5 text-xl font-black text-blue-950">
                                        {peakDay.day}
                                        <span className="ml-1.5 text-sm font-bold text-blue-800">
                                            ({peakDay.submissions})
                                        </span>
                                    </p>
                                </div>
                            </div>
                        </motion.section>
                    </div>
                </div>

                {/* Student management */}
                <motion.section
                    {...pageReveal}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="overflow-visible rounded-[24px] border border-slate-200/90 bg-white shadow-sm"
                >
                    <div className="rounded-t-[24px] border-b border-slate-100 p-5 sm:p-6">
                        <SectionTitle
                            eyebrow="Student management"
                            title="Student submissions"
                            description="Search students, check submission status and evaluate their work."
                            action={
                                <button
                                    type="button"
                                    onClick={exportReport}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-bold text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
                                >
                                    <Download size={16} />
                                    <span className="hidden sm:inline">Export CSV</span>
                                    <span className="sm:hidden">Export</span>
                                </button>
                            }
                        />

                        <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
                            {statusTabs.map((tab) => (
                                <button
                                    key={tab.value}
                                    type="button"
                                    onClick={() => setStatusFilter(tab.value)}
                                    aria-pressed={statusFilter === tab.value}
                                    className={cn(
                                        "inline-flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2.5 text-xs font-bold transition-colors duration-150 sm:text-sm",
                                        statusFilter === tab.value
                                            ? "border-emerald-800 bg-emerald-800 text-white shadow-md shadow-emerald-900/10"
                                            : "border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
                                    )}
                                >
                                    {tab.label}
                                    <span
                                        className={cn(
                                            "rounded-md px-1.5 py-0.5 text-[11px]",
                                            statusFilter === tab.value
                                                ? "bg-white/20 text-white"
                                                : "bg-slate-100 text-slate-700"
                                        )}
                                    >
                                        {tab.count}
                                    </span>
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 gap-3 md:grid-cols-[minmax(0,1fr)_minmax(220px,0.6fr)_auto]">
                            <div className="relative">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search student name or email..."
                                    aria-label="Search students"
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 text-sm font-semibold text-slate-950 outline-none transition placeholder:font-normal placeholder:text-slate-500 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-100"
                                />
                            </div>

                            <SortDropdown sortBy={sortBy} setSortBy={setSortBy} />

                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("All");
                                    setSortBy("name");
                                }}
                                className="inline-flex h-12 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-sm font-bold text-slate-700 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-800"
                            >
                                <X size={16} />
                                Reset filters
                            </button>
                        </div>
                    </div>

                    <div className="flex items-center justify-between gap-3 border-b border-slate-100 bg-slate-50/80 px-5 py-3.5 sm:px-6">
                        <p className="text-sm text-slate-700">
                            Showing{" "}
                            <span className="font-black text-slate-950">
                                {filteredStudents.length}
                            </span>{" "}
                            of {students.length} students
                        </p>
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-bold text-slate-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Sample data
                        </span>
                    </div>

                    <div className="overflow-x-auto rounded-b-[24px]">
                        <table className="w-full min-w-[800px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-100 bg-white text-[10px] uppercase tracking-[0.13em] text-slate-600">
                                    <th className="px-5 py-4 font-extrabold sm:px-6">
                                        Student
                                    </th>
                                    <th className="px-4 py-4 font-extrabold">
                                        Submission date
                                    </th>
                                    <th className="px-4 py-4 font-extrabold">Status</th>
                                    <th className="px-4 py-4 font-extrabold">Marks</th>
                                    <th className="px-4 py-4 text-right font-extrabold">
                                        Action
                                    </th>
                                </tr>
                            </thead>

                            {/* No row-level layout/exit animations: filters won't make the table glitch. */}
                            <tbody>
                                {filteredStudents.map((student) => (
                                    <tr
                                        key={student.id}
                                        className="border-b border-slate-100 last:border-0 transition-colors duration-150 hover:bg-emerald-50/40"
                                    >
                                        <td className="px-5 py-4 sm:px-6">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-100 to-teal-100 text-xs font-extrabold text-emerald-950 ring-1 ring-emerald-200/70">
                                                    {student.avatar}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="whitespace-nowrap text-sm font-extrabold text-slate-950">
                                                        {student.name}
                                                    </p>
                                                    <p className="mt-1 text-xs text-slate-600">
                                                        {student.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-4 py-4 text-sm font-semibold text-slate-700">
                                            {student.submitted}
                                        </td>

                                        <td className="px-4 py-4">
                                            <StatusBadge status={student.status} />
                                        </td>

                                        <td className="px-4 py-4">
                                            {student.marks !== null ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-black text-slate-950">
                                                        {student.marks}
                                                    </span>
                                                    <span className="text-xs font-semibold text-slate-500">
                                                        / {assignment.maxMarks}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-500">—</span>
                                            )}
                                        </td>

                                        <td className="px-4 py-4 text-right">
                                            {student.status === "Not Submitted" ? (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        showToast(
                                                            `Reminder action for ${student.name} is ready to connect to notifications.`
                                                        )
                                                    }
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold text-slate-800 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
                                                >
                                                    <Send size={14} />
                                                    Remind
                                                </button>
                                            ) : (
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedStudent(student)}
                                                    className="inline-flex items-center gap-1.5 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-bold text-emerald-950 transition hover:border-emerald-300 hover:bg-emerald-100"
                                                >
                                                    {student.status === "Reviewed" ? (
                                                        <Eye size={14} />
                                                    ) : (
                                                        <ClipboardCheck size={14} />
                                                    )}
                                                    {student.status === "Reviewed"
                                                        ? "Edit review"
                                                        : "Review"}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {filteredStudents.length === 0 && (
                        <div className="px-5 py-14 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                                <Search size={23} />
                            </div>
                            <h3 className="mt-4 font-extrabold text-slate-950">
                                No students found
                            </h3>
                            <p className="mt-1 text-sm text-slate-600">
                                Try another name or change the selected filter.
                            </p>
                            <button
                                type="button"
                                onClick={() => {
                                    setSearch("");
                                    setStatusFilter("All");
                                }}
                                className="mt-4 rounded-xl bg-emerald-800 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-emerald-900"
                            >
                                Clear filters
                            </button>
                        </div>
                    )}

                    <div className="flex flex-col gap-2 border-t border-slate-100 bg-slate-50/70 px-5 py-4 text-xs font-medium text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <span>
                            Showing {filteredStudents.length} records from this assignment.
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                            <CheckCircle2 size={14} className="text-emerald-700" />
                            Changes are stored in the current page state only.
                        </span>
                    </div>
                </motion.section>

                {/* Review reminder */}
                <motion.div
                    {...pageReveal}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="relative isolate overflow-hidden rounded-[24px] border border-emerald-100 bg-gradient-to-r from-emerald-50 via-white to-teal-50 p-5 sm:p-6"
                >
                    <div className="pointer-events-none absolute -right-10 -top-16 -z-10 h-40 w-40 rounded-full bg-emerald-100/70 blur-2xl" />

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex items-start gap-3">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-800 shadow-sm ring-1 ring-emerald-100">
                                <Target size={22} />
                            </div>
                            <div>
                                <p className="text-base font-extrabold text-emerald-950">
                                    Keep the review cycle moving
                                </p>
                                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-emerald-900">
                                    {stats.pending > 0
                                        ? `${stats.pending} submissions are waiting for review. Review them to keep student feedback timely.`
                                        : "No pending reviews right now. Great work keeping the batch up to date."}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => {
                                setStatusFilter("Pending Review");
                                document.querySelector("table")?.scrollIntoView({
                                    behavior: reduceMotion ? "auto" : "smooth",
                                    block: "start",
                                });
                            }}
                            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3 text-sm font-extrabold text-white shadow-lg shadow-emerald-900/10 transition hover:-translate-y-0.5 hover:bg-emerald-900"
                        >
                            Review pending
                            <ArrowUpRight size={16} />
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Toast notification */}
            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: 12, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.99 }}
                        transition={{ duration: 0.18, ease: EASE }}
                        role="status"
                        className="fixed bottom-4 left-4 right-4 z-[60] mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 shadow-[0_20px_60px_rgba(15,23,42,0.16)] sm:bottom-6"
                    >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
                            <CheckCircle2 size={19} />
                        </span>

                        <p className="flex-1 text-sm font-bold text-slate-900">{toast}</p>

                        <button
                            type="button"
                            onClick={() => setToast("")}
                            aria-label="Dismiss notification"
                            className="rounded-lg p-1.5 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Review modal */}
            <AnimatePresence>
                {selectedStudent && (
                    <SubmissionModal
                        student={selectedStudent}
                        maxMarks={assignment.maxMarks}
                        onClose={() => setSelectedStudent(null)}
                        onSave={saveReview}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}