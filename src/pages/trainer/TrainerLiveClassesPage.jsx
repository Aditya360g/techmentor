
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "framer-motion";
import {
    Activity,
    ArrowDownUp,
    ArrowRight,
    BookOpen,
    CalendarClock,
    CalendarDays,
    Check,
    ChevronDown,
    CircleCheck,
    CircleDot,
    Clock3,
    ExternalLink,
    GraduationCap,
    LayoutDashboard,
    MonitorPlay,
    Plus,
    Radio,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Sparkles,
    Users,
    Video,
    X,
} from "lucide-react";

const INITIAL_CLASSES = [
    {
        id: "CLS-1042",
        title: "Advanced React Patterns & Performance",
        course: "Full Stack Development",
        type: "Live Class",
        status: "Live",
        date: "2026-10-19",
        startTime: "13:00",
        endTime: "14:00",
        duration: "60 min",
        students: 48,
        capacity: 60,
        description:
            "Build reusable React components, create custom hooks, and improve application performance with practical examples.",
        meetingUrl: "",
        color: "emerald",
        topics: ["Compound components", "Memoization", "Custom hooks"],
    },
    {
        id: "CLS-1043",
        title: "Building REST APIs with Node.js",
        course: "Backend Development",
        type: "Live Class",
        status: "Upcoming",
        date: "2026-10-19",
        startTime: "15:30",
        endTime: "16:30",
        duration: "60 min",
        students: 36,
        capacity: 50,
        description:
            "Build a practical REST API and learn how validation, middleware, and error handling work together.",
        meetingUrl: "",
        color: "blue",
        topics: ["REST APIs", "Middleware", "Error handling"],
    },
    {
        id: "CLS-1044",
        title: "Data Structures: Trees & Graphs",
        course: "DSA in Java",
        type: "Workshop",
        status: "Upcoming",
        date: "2026-10-20",
        startTime: "11:00",
        endTime: "12:30",
        duration: "90 min",
        students: 42,
        capacity: 50,
        description:
            "Practice tree traversal, BFS, DFS, and common interview problems with guided exercises.",
        meetingUrl: "",
        color: "violet",
        topics: ["Tree traversal", "BFS & DFS", "Problem solving"],
    },
    {
        id: "CLS-1045",
        title: "Introduction to Machine Learning",
        course: "AI & Data Science",
        type: "Live Class",
        status: "Completed",
        date: "2026-10-18",
        startTime: "10:00",
        endTime: "11:00",
        duration: "60 min",
        students: 55,
        capacity: 60,
        description:
            "Explore supervised learning, model evaluation, and a typical machine learning workflow.",
        meetingUrl: "",
        color: "amber",
        topics: ["Supervised learning", "Model evaluation", "ML workflow"],
    },
    {
        id: "CLS-1046",
        title: "Git, GitHub & Team Collaboration",
        course: "Developer Essentials",
        type: "Workshop",
        status: "Upcoming",
        date: "2026-10-21",
        startTime: "14:00",
        endTime: "15:00",
        duration: "60 min",
        students: 28,
        capacity: 40,
        description:
            "Learn branching, pull requests, code reviews, and how to collaborate on a shared project.",
        meetingUrl: "",
        color: "rose",
        topics: ["Git workflow", "Pull requests", "Code reviews"],
    },
];

const STATUS_OPTIONS = [
    { label: "All statuses", value: "All statuses", description: "Every session" },
    { label: "Live", value: "Live", description: "Currently in progress" },
    { label: "Upcoming", value: "Upcoming", description: "Scheduled sessions" },
    { label: "Completed", value: "Completed", description: "Finished sessions" },
];

const TYPE_OPTIONS = [
    { label: "All types", value: "All types", description: "Every session type" },
    { label: "Live Class", value: "Live Class", description: "Instructor-led classes" },
    { label: "Workshop", value: "Workshop", description: "Practical workshops" },
];

const DATE_OPTIONS = [
    { label: "Any date", value: "Any date", description: "All available dates" },
    { label: "Today", value: "Today", description: "Sessions scheduled today" },
    { label: "Next 7 days", value: "Next 7 days", description: "Coming week" },
    { label: "Past classes", value: "Past classes", description: "Earlier or completed sessions" },
];

const SORT_OPTIONS = [
    { label: "Date: newest first", value: "newest", description: "Latest sessions first" },
    { label: "Date: oldest first", value: "oldest", description: "Earliest sessions first" },
    { label: "Most students", value: "students", description: "Highest enrollment first" },
    { label: "Title: A–Z", value: "title", description: "Alphabetical order" },
];

const ACCENTS = {
    emerald: {
        hero: "bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-500",
        icon: "bg-emerald-100 text-emerald-800",
        border: "hover:border-emerald-300",
        line: "bg-gradient-to-r from-emerald-600 to-green-400",
        light: "bg-emerald-50 text-emerald-800",
        progress: "from-emerald-600 to-green-400",
        shadow: "hover:shadow-emerald-900/10",
    },
    blue: {
        hero: "bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500",
        icon: "bg-blue-100 text-blue-800",
        border: "hover:border-blue-300",
        line: "bg-gradient-to-r from-blue-600 to-sky-400",
        light: "bg-blue-50 text-blue-800",
        progress: "from-blue-600 to-sky-400",
        shadow: "hover:shadow-blue-900/10",
    },
    violet: {
        hero: "bg-gradient-to-br from-violet-900 via-violet-700 to-purple-500",
        icon: "bg-violet-100 text-violet-800",
        border: "hover:border-violet-300",
        line: "bg-gradient-to-r from-violet-600 to-purple-400",
        light: "bg-violet-50 text-violet-800",
        progress: "from-violet-600 to-purple-400",
        shadow: "hover:shadow-violet-900/10",
    },
    amber: {
        hero: "bg-gradient-to-br from-amber-800 via-amber-700 to-yellow-500",
        icon: "bg-amber-100 text-amber-800",
        border: "hover:border-amber-300",
        line: "bg-gradient-to-r from-amber-500 to-yellow-400",
        light: "bg-amber-50 text-amber-800",
        progress: "from-amber-500 to-yellow-400",
        shadow: "hover:shadow-amber-900/10",
    },
    rose: {
        hero: "bg-gradient-to-br from-rose-900 via-rose-700 to-pink-500",
        icon: "bg-rose-100 text-rose-800",
        border: "hover:border-rose-300",
        line: "bg-gradient-to-r from-rose-600 to-pink-400",
        light: "bg-rose-50 text-rose-800",
        progress: "from-rose-600 to-pink-400",
        shadow: "hover:shadow-rose-900/10",
    },
};

function getToday() {
    const date = new Date();

    return [
        date.getFullYear(),
        String(date.getMonth() + 1).padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
    ].join("-");
}

function formatDate(value) {
    if (!value) return "Date not set";

    const match = String(value)
        .trim()
        .slice(0, 10)
        .match(/^(\d{4})-(\d{2})-(\d{2})$/);

    if (!match) return "Date not set";

    const [, year, month, day] = match;
    const date = new Date(Number(year), Number(month) - 1, Number(day));

    if (
        date.getFullYear() !== Number(year) ||
        date.getMonth() !== Number(month) - 1 ||
        date.getDate() !== Number(day)
    ) {
        return "Date not set";
    }

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function formatTime(value) {
    if (!value) return "Time not set";

    const match = String(value).trim().match(/^(\d{1,2}):(\d{2})$/);
    if (!match) return "Time not set";

    const hours = Number(match[1]);
    const minutes = Number(match[2]);

    if (hours > 23 || minutes > 59) return "Time not set";

    const date = new Date();
    date.setHours(hours, minutes, 0, 0);

    return new Intl.DateTimeFormat("en-IN", {
        hour: "numeric",
        minute: "2-digit",
        hour12: true,
    }).format(date);
}

/* Premium custom dropdown */
function PremiumDropdown({ label, value, options, onChange, icon: Icon }) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);
    const selected = options.find((option) => option.value === value) || options[0];

    useEffect(() => {
        if (!open) return undefined;

        function handleOutsideClick(event) {
            if (rootRef.current && !rootRef.current.contains(event.target)) {
                setOpen(false);
            }
        }

        function handleEscape(event) {
            if (event.key === "Escape") setOpen(false);
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("touchstart", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("touchstart", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    return (
        <div ref={rootRef} className="relative min-w-0">
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                {label}
            </span>

            <button
                type="button"
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className={`group flex min-h-[52px] w-full items-center gap-3 rounded-2xl border bg-white px-3.5 text-left transition duration-200 ${open
                    ? "border-emerald-500 ring-4 ring-emerald-500/10"
                    : "border-slate-200 hover:border-emerald-300 hover:shadow-md hover:shadow-emerald-950/5"
                    }`}
            >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 transition group-hover:bg-emerald-100">
                    <Icon size={17} />
                </span>

                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold text-slate-800">
                        {selected.label}
                    </span>
                    <span className="mt-0.5 block truncate text-[11px] text-slate-400">
                        {selected.description || label}
                    </span>
                </span>

                <ChevronDown
                    size={17}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180 text-emerald-700" : ""
                        }`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 6, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 4, scale: 0.98 }}
                        transition={{ duration: 0.15 }}
                        className="absolute left-0 top-full z-[100] mt-2 w-full min-w-[230px] origin-top overflow-hidden rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
                    >
                        <div
                            role="listbox"
                            aria-label={label}
                            className="max-h-64 overflow-y-auto overscroll-contain"
                        >
                            {options.map((option) => {
                                const isSelected = option.value === value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        role="option"
                                        aria-selected={isSelected}
                                        onClick={() => {
                                            onChange(option.value);
                                            setOpen(false);
                                        }}
                                        className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition ${isSelected
                                            ? "bg-emerald-50 text-emerald-900"
                                            : "text-slate-700 hover:bg-slate-50"
                                            }`}
                                    >
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${isSelected
                                                ? "bg-emerald-600 text-white"
                                                : "bg-slate-100 text-slate-500"
                                                }`}
                                        >
                                            {isSelected ? (
                                                <Check size={16} />
                                            ) : (
                                                <CircleDot size={16} />
                                            )}
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-sm font-semibold">
                                                {option.label}
                                            </span>
                                            {option.description && (
                                                <span className="mt-0.5 block text-xs text-slate-400">
                                                    {option.description}
                                                </span>
                                            )}
                                        </span>

                                        {isSelected && (
                                            <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                                                Selected
                                            </span>
                                        )}
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

function StatCard({ title, value, subtitle, icon: Icon, tone = "emerald" }) {
    const tones = {
        emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
        red: "bg-red-50 text-red-600 ring-red-100",
        blue: "bg-blue-50 text-blue-700 ring-blue-100",
        violet: "bg-violet-50 text-violet-700 ring-violet-100",
    };

    return (
        <motion.article
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md sm:p-6"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {value}
                    </p>
                </div>

                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${tones[tone] || tones.emerald}`}>
                    <Icon size={21} strokeWidth={1.8} />
                </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-slate-500">{subtitle}</p>
        </motion.article>
    );
}

function ClassCard({ item, onView, onJoin }) {
    const accent = ACCENTS[item.color] || ACCENTS.emerald;
    const Icon = item.type === "Workshop" ? GraduationCap : MonitorPlay;
    const enrollment = item.capacity
        ? Math.min(100, Math.round((item.students / item.capacity) * 100))
        : 0;

    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
            className={`group flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${accent.border} ${accent.shadow}`}
        >
            <div className={`h-1.5 ${accent.line}`} />

            <div className={`relative m-3 mb-0 overflow-hidden rounded-xl p-5 text-white sm:p-6 ${accent.hero}`}>
                <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                        <Icon size={14} />
                        {item.type}
                    </span>

                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-xs font-semibold ${item.status === "Live"
                        ? "bg-white text-red-700"
                        : item.status === "Upcoming"
                            ? "bg-white text-emerald-800"
                            : "bg-white/15 text-white ring-1 ring-white/20"
                        }`}>
                        {item.status === "Live" && (
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-red-500" />
                        )}
                        {item.status}
                    </span>
                </div>

                <div className="mt-6">
                    <p className="text-xs font-semibold uppercase tracking-wider text-white/75">
                        {item.course}
                    </p>
                    <h3 className="mt-2 line-clamp-2 text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                        {item.title}
                    </h3>
                    <p className="mt-2 line-clamp-2 text-sm leading-6 text-white/85">
                        {item.description}
                    </p>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/20 pt-4 text-xs text-white/90">
                    <span className="font-medium">{item.id}</span>
                    <span>Session details</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <CalendarDays size={16} className={`shrink-0 ${(ACCENTS[item.color] || ACCENTS.emerald).light.split(" ")[1]}`} />
                        <span>{formatDate(item.date)}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Clock3 size={16} className={`shrink-0 ${(ACCENTS[item.color] || ACCENTS.emerald).light.split(" ")[1]}`} />
                        <span>{formatTime(item.startTime)} – {formatTime(item.endTime)}</span>
                        <span className="ml-auto shrink-0 text-xs text-slate-400">{item.duration}</span>
                    </div>

                    <div className="flex items-center gap-2.5 text-sm text-slate-600">
                        <Users size={16} className={`shrink-0 ${(ACCENTS[item.color] || ACCENTS.emerald).light.split(" ")[1]}`} />
                        <span>
                            {item.students} enrolled
                            <span className="text-slate-400"> / {item.capacity}</span>
                        </span>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                        <span className="font-medium text-slate-500">Class capacity</span>
                        <span className="font-bold text-slate-700">{enrollment}%</span>
                    </div>

                    <div
                        className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        aria-label={`${item.title} enrollment`}
                        aria-valuenow={enrollment}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${enrollment}%` }}
                            transition={{ duration: 0.6 }}
                            className={`h-full rounded-full bg-gradient-to-r ${accent.progress}`}
                        />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap gap-2">
                    {item.topics.map((topic) => (
                        <span key={topic} className={`rounded-lg px-2.5 py-1.5 text-xs font-medium ${accent.light}`}>
                            {topic}
                        </span>
                    ))}
                </div>

                <div className="mt-auto flex flex-col gap-2 border-t border-slate-100 pt-5 sm:flex-row">
                    <button
                        type="button"
                        onClick={() => onView(item)}
                        className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                        View details
                    </button>

                    {item.status !== "Completed" && (
                        <button
                            type="button"
                            onClick={() => onJoin(item)}
                            className={`inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition ${item.status === "Live"
                                ? "bg-emerald-600 hover:bg-emerald-700"
                                : "bg-slate-900 hover:bg-slate-800"
                                }`}
                        >
                            {item.status === "Live" ? <Radio size={16} /> : <Video size={16} />}
                            {item.status === "Live" ? "Join class" : "Meeting link"}
                            <ArrowRight size={15} />
                        </button>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

function ClassDetailsModal({ item, onClose, onJoin }) {
    useEffect(() => {
        if (!item) return undefined;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.body.style.overflow = previousOverflow;
            document.removeEventListener("keydown", handleEscape);
        };
    }, [item, onClose]);

    return (
        <AnimatePresence>
            {item && (
                <motion.div
                    key="class-modal"
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
                        exit={{ opacity: 0, y: 10, scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="class-modal-title"
                        className="my-auto w-full max-w-xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        <div className={`relative p-6 text-white sm:p-7 ${(ACCENTS[item.color] || ACCENTS.emerald).hero}`}>
                            <button
                                type="button"
                                aria-label="Close class details"
                                onClick={onClose}
                                className="absolute right-4 top-4 rounded-xl p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                            >
                                <X size={19} />
                            </button>

                            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                                <MonitorPlay size={14} />
                                {item.status}
                            </span>

                            <h2 id="class-modal-title" className="mt-4 max-w-lg pr-8 text-2xl font-bold leading-tight">
                                {item.title}
                            </h2>
                            <p className="mt-2 text-sm text-white/80">{item.course}</p>
                        </div>

                        <div className="max-h-[65vh] space-y-6 overflow-y-auto p-6">
                            <p className="text-sm leading-6 text-slate-600">{item.description}</p>

                            <div className="grid gap-3 sm:grid-cols-2">
                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <CalendarDays size={18} className="text-emerald-700" />
                                    <p className="mt-3 text-xs text-slate-500">Scheduled date</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">{formatDate(item.date)}</p>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <Clock3 size={18} className="text-emerald-700" />
                                    <p className="mt-3 text-xs text-slate-500">Time and duration</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {formatTime(item.startTime)} – {formatTime(item.endTime)}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">{item.duration}</p>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <Users size={18} className="text-emerald-700" />
                                    <p className="mt-3 text-xs text-slate-500">Enrollment</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">
                                        {item.students} of {item.capacity} students
                                    </p>
                                </div>

                                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                                    <BookOpen size={18} className="text-emerald-700" />
                                    <p className="mt-3 text-xs text-slate-500">Session type</p>
                                    <p className="mt-1 text-sm font-semibold text-slate-800">{item.type}</p>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-sm font-bold text-slate-900">What you'll learn</h3>
                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {item.topics.map((topic, index) => (
                                        <div key={topic} className="flex items-center gap-3 rounded-xl border border-slate-100 bg-white p-3">
                                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${(ACCENTS[item.color] || ACCENTS.emerald).icon}`}>
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-sm font-medium text-slate-700">{topic}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="min-h-11 rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Close
                                </button>

                                {item.status !== "Completed" && (
                                    <button
                                        type="button"
                                        onClick={() => onJoin(item)}
                                        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                    >
                                        <Video size={16} />
                                        {item.status === "Live" ? "Join live class" : "Open meeting"}
                                        <ExternalLink size={14} />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default function TrainerLiveClassesPage() {
    const [classes] = useState(INITIAL_CLASSES);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("All statuses");
    const [type, setType] = useState("All types");
    const [dateRange, setDateRange] = useState("Any date");
    const [sortBy, setSortBy] = useState("newest");
    const [selectedClass, setSelectedClass] = useState(null);
    const [notice, setNotice] = useState("");
    const [showFilters, setShowFilters] = useState(true);

    useEffect(() => {
        if (!notice) return undefined;

        const timeout = window.setTimeout(() => setNotice(""), 4000);
        return () => window.clearTimeout(timeout);
    }, [notice]);

    const today = getToday();

    const stats = useMemo(() => {
        const live = classes.filter((item) => item.status === "Live").length;
        const upcoming = classes.filter((item) => item.status === "Upcoming").length;
        const completed = classes.filter((item) => item.status === "Completed").length;
        const totalStudents = classes.reduce((sum, item) => sum + item.students, 0);

        return { live, upcoming, completed, totalStudents };
    }, [classes]);

    const filteredClasses = useMemo(() => {
        let result = [...classes];
        const query = search.trim().toLowerCase();

        if (query) {
            result = result.filter((item) =>
                [item.title, item.course, item.type, item.status, item.id, ...item.topics]
                    .join(" ")
                    .toLowerCase()
                    .includes(query)
            );
        }

        if (status !== "All statuses") {
            result = result.filter((item) => item.status === status);
        }

        if (type !== "All types") {
            result = result.filter((item) => item.type === type);
        }

        if (dateRange === "Today") {
            result = result.filter((item) => item.date === today);
        } else if (dateRange === "Next 7 days") {
            const end = new Date(`${today}T00:00:00`);
            end.setDate(end.getDate() + 7);

            const endString = [
                end.getFullYear(),
                String(end.getMonth() + 1).padStart(2, "0"),
                String(end.getDate()).padStart(2, "0"),
            ].join("-");

            result = result.filter((item) => item.date >= today && item.date <= endString);
        } else if (dateRange === "Past classes") {
            result = result.filter((item) => item.date < today || item.status === "Completed");
        }

        result.sort((a, b) => {
            if (sortBy === "newest") {
                return `${b.date} ${b.startTime}`.localeCompare(`${a.date} ${a.startTime}`);
            }
            if (sortBy === "oldest") {
                return `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`);
            }
            if (sortBy === "students") return b.students - a.students;
            return a.title.localeCompare(b.title);
        });

        return result;
    }, [classes, search, status, type, dateRange, sortBy, today]);

    function resetFilters() {
        setSearch("");
        setStatus("All statuses");
        setType("All types");
        setDateRange("Any date");
        setSortBy("newest");
    }

    function handleJoin(item) {
        if (item.meetingUrl) {
            window.open(item.meetingUrl, "_blank", "noopener,noreferrer");
            return;
        }

        setNotice(`A meeting link hasn't been added for "${item.title}" yet. Add the meeting URL to enable joining.`);
        setSelectedClass(null);
    }

    function handleAddClass() {
        setNotice("Class creation isn't connected yet. Connect this action to your backend API to schedule and save classes.");
    }

    return (
        <div className="min-h-screen bg-[#f6faf7] text-slate-900">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                <motion.header
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="mb-7 flex flex-col justify-between gap-5 sm:flex-row sm:items-center"
                >
                    <h1 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
                        Live classes
                    </h1>

                    <div className="flex flex-wrap items-center gap-3">
                        <Link
                            to="/trainer"
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                        >
                            <LayoutDashboard size={16} />
                            Dashboard
                        </Link>

                        <button
                            type="button"
                            onClick={handleAddClass}
                            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                        >
                            <Plus size={17} />
                            Create class
                        </button>
                    </div>
                </motion.header>

                {stats.live > 0 && (
                    <motion.section
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.35 }}
                        className="mb-7 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-700 p-5 text-white shadow-lg shadow-emerald-900/10 sm:p-6"
                    >
                        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                            <div className="flex items-start gap-4">
                                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">
                                    <Radio size={23} />
                                </div>

                                <div>
                                    <div className="flex flex-wrap items-center gap-2">
                                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider ring-1 ring-white/15">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-white" />
                                            Live now
                                        </span>
                                        <span className="text-xs text-emerald-100">
                                            {stats.live} active session{stats.live !== 1 ? "s" : ""}
                                        </span>
                                    </div>

                                    <h2 className="mt-3 text-lg font-bold sm:text-xl">
                                        Your class is in progress
                                    </h2>
                                    <p className="mt-1 max-w-xl text-sm leading-6 text-emerald-50">
                                        Open the session details or join your class when you're ready.
                                    </p>
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={() => {
                                    setStatus("Live");
                                    setDateRange("Any date");
                                }}
                                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-emerald-800 transition hover:bg-emerald-50 sm:self-center"
                            >
                                View live classes
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </motion.section>
                )}

                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.05 }}
                    aria-label="Class statistics"
                    className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    <StatCard title="Total sessions" value={classes.length} subtitle="Sessions in your class library" icon={CalendarDays} />
                    <StatCard title="Live right now" value={stats.live} subtitle="Sessions currently in progress" icon={Activity} tone="red" />
                    <StatCard title="Upcoming sessions" value={stats.upcoming} subtitle="Sessions scheduled next" icon={CalendarClock} tone="blue" />
                    <StatCard title="Student enrollments" value={stats.totalStudents.toLocaleString("en-IN")} subtitle={`${stats.completed} completed session${stats.completed !== 1 ? "s" : ""}`} icon={Users} tone="violet" />
                </motion.section>

                <section className="overflow-visible rounded-2xl border border-slate-200/80 bg-white shadow-sm">
                    <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900">Your sessions</h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Search classes, review details, and manage your schedule.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => setShowFilters((current) => !current)}
                                aria-expanded={showFilters}
                                className={`inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${showFilters
                                    ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                                    }`}
                            >
                                <SlidersHorizontal size={16} />
                                Filters
                                <ChevronDown size={15} className={`transition-transform ${showFilters ? "rotate-180" : ""}`} />
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
                        <label htmlFor="class-search" className="mb-2 block text-xs font-semibold uppercase tracking-wider text-slate-500">
                            Search classes
                        </label>

                        <div className="relative">
                            <Search size={18} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="class-search"
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search by class, course, topic or ID..."
                                className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pl-11 pr-10 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                            />

                            {search && (
                                <button
                                    type="button"
                                    aria-label="Clear search"
                                    onClick={() => setSearch("")}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>
                    </div>

                    {/* Static filter panel prevents dropdown clipping during height animation */}
                    {showFilters && (
                        <div className="relative z-30 border-b border-slate-100">
                            <div className="grid grid-cols-1 gap-4 p-5 sm:grid-cols-2 sm:p-6 xl:grid-cols-4">
                                <PremiumDropdown label="Status" value={status} options={STATUS_OPTIONS} onChange={setStatus} icon={CircleDot} />
                                <PremiumDropdown label="Session type" value={type} options={TYPE_OPTIONS} onChange={setType} icon={MonitorPlay} />
                                <PremiumDropdown label="Date range" value={dateRange} options={DATE_OPTIONS} onChange={setDateRange} icon={CalendarDays} />
                                <PremiumDropdown label="Sort by" value={sortBy} options={SORT_OPTIONS} onChange={setSortBy} icon={ArrowDownUp} />
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col justify-between gap-2 px-5 py-4 sm:flex-row sm:items-center sm:px-6">
                        <p className="text-sm text-slate-500">
                            Showing <span className="font-bold text-slate-900">{filteredClasses.length}</span>
                            {" "}of <span className="font-bold text-slate-900">{classes.length}</span> sessions
                        </p>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Check size={14} className="text-emerald-600" />
                            Results update as you change filters
                        </div>
                    </div>

                    <div className="px-5 pb-6 sm:px-6">
                        {filteredClasses.length > 0 ? (
                            <motion.div layout className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-2 2xl:grid-cols-3">
                                <AnimatePresence mode="popLayout">
                                    {filteredClasses.map((item) => (
                                        <ClassCard
                                            key={item.id}
                                            item={item}
                                            onView={setSelectedClass}
                                            onJoin={handleJoin}
                                        />
                                    ))}
                                </AnimatePresence>
                            </motion.div>
                        ) : (
                            <motion.div
                                initial={{ opacity: 0, y: 8 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex min-h-[320px] flex-col items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 px-5 py-12 text-center"
                            >
                                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm ring-1 ring-slate-200">
                                    <Search size={23} />
                                </div>
                                <h3 className="mt-5 text-base font-bold text-slate-900">No classes found</h3>
                                <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                    Try another search or adjust the filters to find the session you need.
                                </p>
                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="mt-5 inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                >
                                    <RotateCcw size={15} />
                                    Clear all filters
                                </button>
                            </motion.div>
                        )}
                    </div>
                </section>

                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm">
                    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                        <Sparkles size={17} />
                    </div>
                    <div>
                        <p className="text-sm font-semibold text-slate-800">Class workspace</p>
                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            These are sample sessions. Connect your classes API and meeting provider to load real sessions and save changes.
                        </p>
                    </div>
                </div>

                <footer className="mt-6 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p className="inline-flex items-center gap-2">
                        <CircleCheck size={15} className="text-emerald-600" />
                        Live class management
                    </p>
                    <p>Demo data is shown until your backend API is connected.</p>
                </footer>
            </div>

            <ClassDetailsModal
                item={selectedClass}
                onClose={() => setSelectedClass(null)}
                onJoin={handleJoin}
            />

            <AnimatePresence>
                {notice && (
                    <motion.div
                        key={notice}
                        role="status"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="fixed bottom-5 right-4 z-[300] flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-xl shadow-slate-900/10 sm:right-6"
                    >
                        <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            <CircleCheck size={19} />
                        </div>
                        <p className="flex-1 text-sm leading-5 text-slate-700">{notice}</p>
                        <button
                            type="button"
                            aria-label="Dismiss message"
                            onClick={() => setNotice("")}
                            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
