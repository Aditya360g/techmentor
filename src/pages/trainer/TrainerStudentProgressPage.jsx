import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
    ArrowDownUp,
    ArrowRight,
    Award,
    BookOpen,
    CalendarDays,
    Check,
    ChevronDown,
    CircleCheck,
    Clock3,
    Download,
    LayoutDashboard,
    Search,
    SlidersHorizontal,
    Sparkles,
    Target,
    TrendingUp,
    Users,
    X,
    RotateCcw,
} from "lucide-react";

const INITIAL_STUDENTS = [
    {
        id: "STU-1001",
        name: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        course: "Full Stack Development",
        avatar: "AS",
        color: "emerald",
        progress: 86,
        completed: 19,
        total: 22,
        score: 92,
        attendance: 95,
        streak: 12,
        status: "On track",
        lastActive: "Today",
        nextLesson: "Advanced React Patterns",
        skills: ["React", "JavaScript", "Node.js"],
    },
    {
        id: "STU-1002",
        name: "Ananya Verma",
        email: "ananya.verma@example.com",
        course: "AI & Data Science",
        avatar: "AV",
        color: "violet",
        progress: 72,
        completed: 18,
        total: 25,
        score: 88,
        attendance: 91,
        streak: 8,
        status: "On track",
        lastActive: "Today",
        nextLesson: "Model Evaluation",
        skills: ["Python", "Pandas", "Machine Learning"],
    },
    {
        id: "STU-1003",
        name: "Rohan Gupta",
        email: "rohan.gupta@example.com",
        course: "DSA in Java",
        avatar: "RG",
        color: "blue",
        progress: 43,
        completed: 13,
        total: 30,
        score: 64,
        attendance: 68,
        streak: 2,
        status: "Needs attention",
        lastActive: "3 days ago",
        nextLesson: "Trees and Graphs",
        skills: ["Java", "Arrays", "Linked Lists"],
    },
    {
        id: "STU-1004",
        name: "Priya Singh",
        email: "priya.singh@example.com",
        course: "Frontend Development",
        avatar: "PS",
        color: "rose",
        progress: 94,
        completed: 30,
        total: 32,
        score: 97,
        attendance: 98,
        streak: 18,
        status: "Excellent",
        lastActive: "Today",
        nextLesson: "Performance Optimization",
        skills: ["HTML", "CSS", "React"],
    },
    {
        id: "STU-1005",
        name: "Kabir Mehta",
        email: "kabir.mehta@example.com",
        course: "Backend Development",
        avatar: "KM",
        color: "amber",
        progress: 58,
        completed: 14,
        total: 24,
        score: 76,
        attendance: 82,
        streak: 5,
        status: "On track",
        lastActive: "Yesterday",
        nextLesson: "REST API Security",
        skills: ["Node.js", "Express", "SQL"],
    },
    {
        id: "STU-1006",
        name: "Isha Patel",
        email: "isha.patel@example.com",
        course: "Python Programming",
        avatar: "IP",
        color: "cyan",
        progress: 29,
        completed: 7,
        total: 24,
        score: 52,
        attendance: 61,
        streak: 1,
        status: "Needs attention",
        lastActive: "5 days ago",
        nextLesson: "Functions and Modules",
        skills: ["Python", "Functions", "Loops"],
    },
    {
        id: "STU-1007",
        name: "Dev Malhotra",
        email: "dev.malhotra@example.com",
        course: "Full Stack Development",
        avatar: "DM",
        color: "indigo",
        progress: 79,
        completed: 19,
        total: 24,
        score: 85,
        attendance: 88,
        streak: 9,
        status: "On track",
        lastActive: "Today",
        nextLesson: "Authentication and JWT",
        skills: ["React", "APIs", "Authentication"],
    },
    {
        id: "STU-1008",
        name: "Meera Joshi",
        email: "meera.joshi@example.com",
        course: "AI & Data Science",
        avatar: "MJ",
        color: "pink",
        progress: 91,
        completed: 27,
        total: 30,
        score: 95,
        attendance: 96,
        streak: 15,
        status: "Excellent",
        lastActive: "Today",
        nextLesson: "Deep Learning Basics",
        skills: ["Python", "NumPy", "Model Training"],
    },
];

const STATUS_OPTIONS = [
    { label: "All students", value: "All" },
    { label: "Excellent", value: "Excellent" },
    { label: "On track", value: "On track" },
    { label: "Needs attention", value: "Needs attention" },
];

const COURSE_OPTIONS = [
    { label: "All courses", value: "All" },
    { label: "Full Stack Development", value: "Full Stack Development" },
    { label: "Frontend Development", value: "Frontend Development" },
    { label: "Backend Development", value: "Backend Development" },
    { label: "AI & Data Science", value: "AI & Data Science" },
    { label: "DSA in Java", value: "DSA in Java" },
    { label: "Python Programming", value: "Python Programming" },
];

const SORT_OPTIONS = [
    { label: "Progress: highest first", value: "progress" },
    { label: "Progress: lowest first", value: "lowProgress" },
    { label: "Score: highest first", value: "score" },
    { label: "Name: A–Z", value: "name" },
];

const ACCENTS = {
    emerald: {
        avatar: "bg-emerald-100 text-emerald-800",
        bar: "from-emerald-500 to-green-400",
        badge: "bg-emerald-50 text-emerald-700",
        ring: "ring-emerald-100",
    },
    violet: {
        avatar: "bg-violet-100 text-violet-800",
        bar: "from-violet-600 to-purple-400",
        badge: "bg-violet-50 text-violet-700",
        ring: "ring-violet-100",
    },
    blue: {
        avatar: "bg-blue-100 text-blue-800",
        bar: "from-blue-600 to-sky-400",
        badge: "bg-blue-50 text-blue-700",
        ring: "ring-blue-100",
    },
    rose: {
        avatar: "bg-rose-100 text-rose-800",
        bar: "from-rose-600 to-pink-400",
        badge: "bg-rose-50 text-rose-700",
        ring: "ring-rose-100",
    },
    amber: {
        avatar: "bg-amber-100 text-amber-800",
        bar: "from-amber-500 to-yellow-400",
        badge: "bg-amber-50 text-amber-800",
        ring: "ring-amber-100",
    },
    cyan: {
        avatar: "bg-cyan-100 text-cyan-800",
        bar: "from-cyan-600 to-teal-400",
        badge: "bg-cyan-50 text-cyan-800",
        ring: "ring-cyan-100",
    },
    indigo: {
        avatar: "bg-indigo-100 text-indigo-800",
        bar: "from-indigo-600 to-blue-400",
        badge: "bg-indigo-50 text-indigo-800",
        ring: "ring-indigo-100",
    },
    pink: {
        avatar: "bg-pink-100 text-pink-800",
        bar: "from-pink-600 to-rose-400",
        badge: "bg-pink-50 text-pink-800",
        ring: "ring-pink-100",
    },
};

function getStatus(student) {
    if (student.progress >= 90 && student.score >= 90) {
        return "Excellent";
    }

    if (
        student.progress < 50 ||
        student.attendance < 75 ||
        student.score < 60
    ) {
        return "Needs attention";
    }

    return "On track";
}

function PremiumDropdown({ label, value, options, onChange, icon: Icon }) {
    const [open, setOpen] = useState(false);

    return (
        <div className="relative min-w-0">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
            </span>

            <button
                type="button"
                aria-expanded={open}
                aria-haspopup="listbox"
                onClick={() => setOpen((current) => !current)}
                className={`flex min-h-[50px] w-full items-center gap-3 rounded-xl border bg-white px-3 text-left transition ${open
                        ? "border-emerald-500 ring-4 ring-emerald-500/10"
                        : "border-slate-200 hover:border-emerald-300"
                    }`}
            >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
                    <Icon size={16} />
                </span>

                <span className="min-w-0 flex-1 truncate text-sm font-semibold text-slate-700">
                    {options.find((option) => option.value === value)?.label}
                </span>

                <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                        className="absolute left-0 top-full z-[100] mt-2 max-h-64 w-full min-w-[220px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl"
                        role="listbox"
                        aria-label={label}
                    >
                        {options.map((option) => (
                            <button
                                type="button"
                                role="option"
                                aria-selected={value === option.value}
                                key={option.value}
                                onClick={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-3 text-left text-sm transition ${value === option.value
                                        ? "bg-emerald-50 font-semibold text-emerald-800"
                                        : "text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <span>{option.label}</span>

                                {value === option.value && (
                                    <Check
                                        size={16}
                                        className="shrink-0 text-emerald-600"
                                    />
                                )}
                            </button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function MetricCard({
    title,
    value,
    detail,
    icon: Icon,
    tone = "emerald",
}) {
    const tones = {
        emerald: "bg-emerald-50 text-emerald-700",
        violet: "bg-violet-50 text-violet-700",
        blue: "bg-blue-50 text-blue-700",
        amber: "bg-amber-50 text-amber-800",
    };

    return (
        <motion.article
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">
                        {value}
                    </p>
                </div>

                <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl ${tones[tone]}`}
                >
                    <Icon size={21} />
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-500">{detail}</p>
        </motion.article>
    );
}

function StudentCard({ student, onView }) {
    const accent = ACCENTS[student.color] || ACCENTS.emerald;
    const status = getStatus(student);

    const statusStyles = {
        Excellent: "bg-violet-50 text-violet-700",
        "On track": "bg-emerald-50 text-emerald-700",
        "Needs attention": "bg-amber-50 text-amber-800",
    };

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg"
        >
            <div className={`h-1.5 bg-gradient-to-r ${accent.bar}`} />

            <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start gap-3">
                    <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-sm font-bold ring-4 ${accent.avatar} ${accent.ring}`}
                    >
                        {student.avatar}
                    </div>

                    <div className="min-w-0 flex-1">
                        <h3 className="truncate font-bold text-slate-900">
                            {student.name}
                        </h3>
                        <p className="mt-1 truncate text-xs text-slate-500">
                            {student.email}
                        </p>
                        <p className="mt-1 text-[11px] font-medium text-slate-400">
                            {student.id}
                        </p>
                    </div>
                </div>

                <div className="mt-5 rounded-xl bg-slate-50 p-3">
                    <p className="text-xs font-medium text-slate-500">
                        Enrolled course
                    </p>
                    <p className="mt-1 text-sm font-semibold leading-5 text-slate-800">
                        {student.course}
                    </p>
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-slate-700">
                        Course progress
                    </span>
                    <span className="text-lg font-bold text-slate-900">
                        {student.progress}%
                    </span>
                </div>

                <div
                    className="mt-2 h-2.5 overflow-hidden rounded-full bg-slate-100"
                    role="progressbar"
                    aria-label={`${student.name} course progress`}
                    aria-valuenow={student.progress}
                    aria-valuemin={0}
                    aria-valuemax={100}
                >
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${student.progress}%` }}
                        transition={{ duration: 0.7 }}
                        className={`h-full rounded-full bg-gradient-to-r ${accent.bar}`}
                    />
                </div>

                <div className="mt-2 flex items-center justify-between gap-2 text-xs text-slate-500">
                    <span>
                        {student.completed} of {student.total} lessons
                    </span>
                    <span>{student.total - student.completed} remaining</span>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 p-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <Award size={14} />
                            <span className="text-xs">Assessment</span>
                        </div>
                        <p className="mt-2 text-xl font-bold text-slate-900">
                            {student.score}%
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                        <div className="flex items-center gap-1.5 text-slate-500">
                            <CalendarDays size={14} />
                            <span className="text-xs">Attendance</span>
                        </div>
                        <p className="mt-2 text-xl font-bold text-slate-900">
                            {student.attendance}%
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${statusStyles[status]}`}
                    >
                        <span className="h-1.5 w-1.5 rounded-full bg-current" />
                        {status}
                    </span>
                    <span className="text-xs text-slate-400">
                        {student.lastActive}
                    </span>
                </div>

                <button
                    type="button"
                    onClick={() => onView(student)}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                >
                    View student progress
                    <ArrowRight size={16} />
                </button>
            </div>
        </motion.article>
    );
}

function StudentDetailsModal({ student, onClose }) {
    if (!student) return null;

    const accent = ACCENTS[student.color] || ACCENTS.emerald;
    const status = getStatus(student);

    return (
        <AnimatePresence>
            <motion.div
                key={student.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onMouseDown={(event) => {
                    if (event.target === event.currentTarget) onClose();
                }}
                className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
            >
                <motion.div
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10 }}
                    role="dialog"
                    aria-modal="true"
                    aria-labelledby="student-details-title"
                    className="my-auto max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white shadow-2xl"
                >
                    <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-slate-100 bg-white p-5 sm:p-6">
                        <div className="flex min-w-0 items-center gap-3">
                            <div
                                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl font-bold ${accent.avatar}`}
                            >
                                {student.avatar}
                            </div>

                            <div className="min-w-0">
                                <h2
                                    id="student-details-title"
                                    className="truncate text-lg font-bold text-slate-900"
                                >
                                    {student.name}
                                </h2>
                                <p className="mt-1 truncate text-sm text-slate-500">
                                    {student.course}
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            aria-label="Close student details"
                            onClick={onClose}
                            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                        >
                            <X size={19} />
                        </button>
                    </div>

                    <div className="space-y-6 p-5 sm:p-6">
                        <div className="rounded-2xl bg-gradient-to-r from-emerald-900 to-green-700 p-5 text-white">
                            <div className="flex items-center justify-between gap-3">
                                <div>
                                    <p className="text-sm text-emerald-100">
                                        Overall course progress
                                    </p>
                                    <p className="mt-2 text-4xl font-bold">
                                        {student.progress}%
                                    </p>
                                </div>

                                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                                    <TrendingUp size={25} />
                                </div>
                            </div>

                            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white/20">
                                <div
                                    className="h-full rounded-full bg-white transition-all"
                                    style={{ width: `${student.progress}%` }}
                                />
                            </div>

                            <p className="mt-3 text-xs text-emerald-100">
                                {student.completed} lessons completed out of{" "}
                                {student.total}
                            </p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                            {[
                                {
                                    label: "Assessment score",
                                    value: `${student.score}%`,
                                    icon: Award,
                                },
                                {
                                    label: "Attendance",
                                    value: `${student.attendance}%`,
                                    icon: CalendarDays,
                                },
                                {
                                    label: "Learning streak",
                                    value: `${student.streak} days`,
                                    icon: TrendingUp,
                                },
                            ].map(({ label, value, icon: Icon }) => (
                                <div
                                    key={label}
                                    className="rounded-2xl border border-slate-100 bg-slate-50 p-4"
                                >
                                    <Icon size={18} className="text-emerald-700" />
                                    <p className="mt-3 text-xs leading-5 text-slate-500">
                                        {label}
                                    </p>
                                    <p className="mt-1 text-xl font-bold text-slate-900">
                                        {value}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900">
                                Learning overview
                            </h3>

                            <div className="mt-3 space-y-4 rounded-2xl border border-slate-100 p-4">
                                <div>
                                    <div className="flex justify-between gap-3 text-sm">
                                        <span className="text-slate-600">
                                            Lessons completed
                                        </span>
                                        <span className="font-semibold text-slate-800">
                                            {student.completed}/{student.total}
                                        </span>
                                    </div>

                                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                                        <div
                                            className={`h-full rounded-full bg-gradient-to-r ${accent.bar}`}
                                            style={{
                                                width: `${student.progress}%`,
                                            }}
                                        />
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
                                        <BookOpen size={17} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Next lesson
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {student.nextLesson}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                                        <Clock3 size={17} />
                                    </div>

                                    <div>
                                        <p className="text-xs text-slate-500">
                                            Last active
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-slate-800">
                                            {student.lastActive}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="font-bold text-slate-900">
                                Skills covered
                            </h3>

                            <div className="mt-3 flex flex-wrap gap-2">
                                {student.skills.map((skill) => (
                                    <span
                                        key={skill}
                                        className={`rounded-lg px-3 py-2 text-xs font-semibold ${accent.badge}`}
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                            <span
                                className={`inline-flex w-fit items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold ${status === "Excellent"
                                        ? "bg-violet-50 text-violet-700"
                                        : status === "On track"
                                            ? "bg-emerald-50 text-emerald-700"
                                            : "bg-amber-50 text-amber-800"
                                    }`}
                            >
                                <CircleCheck size={15} />
                                {status}
                            </span>

                            <button
                                type="button"
                                onClick={onClose}
                                className="min-h-11 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function TrainerStudentProgressPage() {
    const [students] = useState(INITIAL_STUDENTS);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [courseFilter, setCourseFilter] = useState("All");
    const [sortBy, setSortBy] = useState("progress");
    const [showFilters, setShowFilters] = useState(true);
    const [selectedStudent, setSelectedStudent] = useState(null);
    const [notice, setNotice] = useState("");

    const stats = useMemo(() => {
        const averageProgress = students.length
            ? Math.round(
                students.reduce(
                    (sum, student) => sum + student.progress,
                    0
                ) / students.length
            )
            : 0;

        const averageScore = students.length
            ? Math.round(
                students.reduce((sum, student) => sum + student.score, 0) /
                students.length
            )
            : 0;

        const needsAttention = students.filter(
            (student) => getStatus(student) === "Needs attention"
        ).length;

        const excellent = students.filter(
            (student) => getStatus(student) === "Excellent"
        ).length;

        return {
            averageProgress,
            averageScore,
            needsAttention,
            excellent,
        };
    }, [students]);

    const filteredStudents = useMemo(() => {
        let result = [...students];
        const query = search.trim().toLowerCase();

        if (query) {
            result = result.filter((student) =>
                [
                    student.name,
                    student.email,
                    student.id,
                    student.course,
                    ...student.skills,
                ]
                    .join(" ")
                    .toLowerCase()
                    .includes(query)
            );
        }

        if (statusFilter !== "All") {
            result = result.filter(
                (student) => getStatus(student) === statusFilter
            );
        }

        if (courseFilter !== "All") {
            result = result.filter(
                (student) => student.course === courseFilter
            );
        }

        result.sort((a, b) => {
            if (sortBy === "progress") return b.progress - a.progress;
            if (sortBy === "lowProgress") return a.progress - b.progress;
            if (sortBy === "score") return b.score - a.score;
            return a.name.localeCompare(b.name);
        });

        return result;
    }, [students, search, statusFilter, courseFilter, sortBy]);

    function resetFilters() {
        setSearch("");
        setStatusFilter("All");
        setCourseFilter("All");
        setSortBy("progress");
    }

    function exportStudents() {
        const headers = [
            "Student ID",
            "Name",
            "Email",
            "Course",
            "Progress",
            "Lessons Completed",
            "Total Lessons",
            "Assessment Score",
            "Attendance",
            "Status",
        ];

        const rows = filteredStudents.map((student) => [
            student.id,
            student.name,
            student.email,
            student.course,
            `${student.progress}%`,
            student.completed,
            student.total,
            `${student.score}%`,
            `${student.attendance}%`,
            getStatus(student),
        ]);

        const escapeCSV = (value) =>
            `"${String(value ?? "").replace(/"/g, '""')}"`;

        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCSV).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = "student-progress.csv";
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        setNotice("Student progress report downloaded.");
    }

    useEffect(() => {
        if (!notice) return undefined;

        const timeout = window.setTimeout(() => setNotice(""), 3500);
        return () => window.clearTimeout(timeout);
    }, [notice]);

    return (
        <div className="min-h-screen bg-[#f6faf7] text-slate-900">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <motion.header
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
                >
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                            Student progress
                        </h1>
                        <p className="mt-2 text-sm text-slate-500">
                            Track learning progress, assessment scores, and
                            attendance.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-3">
                        <a
                            href="/trainer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </a>

                        <button
                            type="button"
                            onClick={exportStudents}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700"
                        >
                            <Download size={16} />
                            Export report
                        </button>
                    </div>
                </motion.header>

                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 }}
                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                    aria-label="Student progress statistics"
                >
                    <MetricCard
                        title="Total students"
                        value={students.length}
                        detail="Students in your learning groups"
                        icon={Users}
                    />

                    <MetricCard
                        title="Average progress"
                        value={`${stats.averageProgress}%`}
                        detail="Average course completion"
                        icon={TrendingUp}
                        tone="blue"
                    />

                    <MetricCard
                        title="Average score"
                        value={`${stats.averageScore}%`}
                        detail="Across student assessments"
                        icon={Target}
                        tone="violet"
                    />

                    <MetricCard
                        title="Need attention"
                        value={stats.needsAttention}
                        detail={`${stats.excellent} students are performing excellently`}
                        icon={Award}
                        tone="amber"
                    />
                </motion.section>

                <section className="overflow-visible rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">
                                Your students
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Find a student and review their learning
                                progress.
                            </p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <button
                                type="button"
                                aria-expanded={showFilters}
                                onClick={() =>
                                    setShowFilters((current) => !current)
                                }
                                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${showFilters
                                        ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                        : "border-slate-200 text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <SlidersHorizontal size={16} />
                                Filters
                                <ChevronDown
                                    size={15}
                                    className={`transition-transform ${showFilters ? "rotate-180" : ""
                                        }`}
                                />
                            </button>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                            >
                                <RotateCcw size={14} />
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="border-b border-slate-100 p-5 sm:px-6">
                        <label
                            htmlFor="student-search"
                            className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500"
                        >
                            Search students
                        </label>

                        <div className="relative">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="student-search"
                                type="search"
                                value={search}
                                onChange={(event) =>
                                    setSearch(event.target.value)
                                }
                                placeholder="Search by name, email, course, skill or ID..."
                                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                            />

                            {search && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {showFilters && (
                        <div className="relative z-30 border-b border-slate-100">
                            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-3">
                                <PremiumDropdown
                                    label="Student status"
                                    value={statusFilter}
                                    options={STATUS_OPTIONS}
                                    onChange={setStatusFilter}
                                    icon={Users}
                                />

                                <PremiumDropdown
                                    label="Course"
                                    value={courseFilter}
                                    options={COURSE_OPTIONS}
                                    onChange={setCourseFilter}
                                    icon={BookOpen}
                                />

                                <PremiumDropdown
                                    label="Sort students"
                                    value={sortBy}
                                    options={SORT_OPTIONS}
                                    onChange={setSortBy}
                                    icon={ArrowDownUp}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col justify-between gap-2 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                        <p className="text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-bold text-slate-900">
                                {filteredStudents.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-bold text-slate-900">
                                {students.length}
                            </span>{" "}
                            students
                        </p>

                        <span className="inline-flex items-center gap-2 text-xs text-slate-400">
                            <Check
                                size={14}
                                className="text-emerald-600"
                            />
                            Results update automatically
                        </span>
                    </div>

                    <div className="px-5 pb-6 sm:px-6">
                        {filteredStudents.length > 0 ? (
                            <motion.div
                                layout
                                className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 xl:grid-cols-3"
                            >
                                <AnimatePresence mode="popLayout">
                                    {filteredStudents.map((student) => (
                                        <StudentCard
                                            key={student.id}
                                            student={student}
                                            onView={setSelectedStudent}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <div className="flex min-h-[280px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-12 text-center">
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200">
                                    <Search size={23} />
                                </div>

                                <h3 className="mt-5 font-bold text-slate-900">
                                    No students found
                                </h3>

                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Try a different search or change your
                                    filters.
                                </p>

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
                                >
                                    <RotateCcw size={15} />
                                    Clear filters
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Sparkles size={17} />
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-slate-800">
                            Learning insights
                        </p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Progress figures are demo data. Connect your
                            backend to display real student activity,
                            assessments, and attendance.
                        </p>
                    </div>
                </div>

                <footer className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p className="inline-flex items-center gap-2">
                        <CircleCheck
                            size={15}
                            className="text-emerald-600"
                        />
                        Student progress overview
                    </p>

                    <p>Sample student records are displayed.</p>
                </footer>
            </div>

            <StudentDetailsModal
                student={selectedStudent}
                onClose={() => setSelectedStudent(null)}
            />

            <AnimatePresence>
                {notice && (
                    <motion.div
                        role="status"
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="fixed bottom-5 right-4 z-[300] flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl sm:right-6"
                    >
                        <CircleCheck
                            size={19}
                            className="mt-1 shrink-0 text-emerald-600"
                        />

                        <p className="flex-1 text-sm text-slate-700">
                            {notice}
                        </p>

                        <button
                            type="button"
                            aria-label="Dismiss notification"
                            onClick={() => setNotice("")}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}