import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
    Activity,
    ArrowUpRight,
    CalendarDays,
    Check,
    ChevronDown,
    CircleCheck,
    Clock3,
    ClipboardList,
    ExternalLink,
    Eye,
    GraduationCap,
    Layers3,
    MapPin,
    MoreVertical,
    Plus,
    RotateCcw,
    Search,
    SlidersHorizontal,
    Target,
    Trash2,
    TrendingUp,
    Users,
    X,
    BookOpen,
} from "lucide-react";

/* ======================== ASSIGNMENT DATA ======================== */

const INITIAL_ASSIGNMENTS = [
    {
        id: "ASN-1001",
        college: "RKGIT Ghaziabad",
        location: "Ghaziabad, Uttar Pradesh",
        title: "Java + DSA Programming",
        subtitle: "Build strong problem-solving and coding skills",
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
        theme: "emerald",
        description:
            "A structured Java and Data Structures & Algorithms program covering programming fundamentals, problem-solving patterns, and interview preparation.",
        modules: [
            "Java Fundamentals",
            "Object-Oriented Programming",
            "Arrays and Strings",
            "Linked Lists",
            "Stacks and Queues",
            "Trees and Graphs",
        ],
    },
    {
        id: "ASN-1002",
        college: "XYZ College Noida",
        location: "Noida, Uttar Pradesh",
        title: "Spring Boot Backend Development",
        subtitle: "Develop secure and scalable REST APIs",
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
        theme: "blue",
        description:
            "Hands-on backend training covering Spring Boot, REST APIs, database integration, authentication, validation, and application architecture.",
        modules: [
            "Spring Boot Basics",
            "REST API Development",
            "Spring Data JPA",
            "MySQL Integration",
            "Authentication",
            "Deployment",
        ],
    },
    {
        id: "ASN-1003",
        college: "Global University Jaipur",
        location: "Jaipur, Rajasthan",
        title: "Core Java Programming",
        subtitle: "Master Java from fundamentals to OOP",
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
        theme: "amber",
        description:
            "A complete Core Java learning program with practical exercises, object-oriented programming, collections, and exception handling.",
        modules: [
            "Java Basics",
            "OOP Concepts",
            "Collections Framework",
            "Exception Handling",
            "File Handling",
            "Mini Project",
        ],
    },
    {
        id: "ASN-1004",
        college: "Tech Institute Delhi",
        location: "Delhi, India",
        title: "DSA Placement Preparation",
        subtitle: "Prepare for technical interviews",
        category: "Placement Training",
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
        theme: "rose",
        description:
            "A placement-focused program covering common coding interview patterns, complexity analysis, mock interviews, and problem-solving practice.",
        modules: [
            "Complexity Analysis",
            "Arrays and Strings",
            "Binary Search",
            "Recursion",
            "Trees and Graphs",
            "Mock Interviews",
        ],
    },
    {
        id: "ASN-1005",
        college: "Northstar Institute Gurugram",
        location: "Gurugram, Haryana",
        title: "Full Stack Development",
        subtitle: "Create end-to-end web applications",
        category: "Full Stack",
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
        theme: "violet",
        description:
            "Full stack training covering responsive interfaces, React, backend APIs, database design, authentication, and deployment workflows.",
        modules: [
            "HTML and CSS",
            "JavaScript",
            "React",
            "Node.js and APIs",
            "Database Design",
            "Deployment",
        ],
    },
    {
        id: "ASN-1006",
        college: "Pioneer Technical Campus Faridabad",
        location: "Faridabad, Haryana",
        title: "Python + Data Science",
        subtitle: "Turn raw data into useful insights",
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
        theme: "cyan",
        description:
            "A practical Python and data science program covering data analysis, visualization, statistics, and introductory machine learning.",
        modules: [
            "Python Programming",
            "NumPy and Pandas",
            "Data Cleaning",
            "Data Visualization",
            "Statistics",
            "Machine Learning Basics",
        ],
    },
];

const FILTERS = [
    "All Assignments",
    "Active",
    "Upcoming",
    "Completed",
];

const THEMES = {
    emerald: {
        hero: "bg-gradient-to-br from-emerald-900 via-emerald-700 to-green-500",
        icon: "bg-emerald-100 text-emerald-800",
        accent: "text-emerald-700",
        progress: "from-emerald-600 to-green-400",
        border: "hover:border-emerald-300",
        glow: "hover:shadow-emerald-900/10",
        soft: "bg-emerald-50 text-emerald-800",
        dot: "bg-emerald-500",
    },
    blue: {
        hero: "bg-gradient-to-br from-blue-950 via-blue-800 to-sky-500",
        icon: "bg-blue-100 text-blue-800",
        accent: "text-blue-700",
        progress: "from-blue-600 to-sky-400",
        border: "hover:border-blue-300",
        glow: "hover:shadow-blue-900/10",
        soft: "bg-blue-50 text-blue-800",
        dot: "bg-blue-500",
    },
    amber: {
        hero: "bg-gradient-to-br from-amber-950 via-amber-700 to-yellow-400",
        icon: "bg-amber-100 text-amber-800",
        accent: "text-amber-700",
        progress: "from-amber-500 to-yellow-400",
        border: "hover:border-amber-300",
        glow: "hover:shadow-amber-900/10",
        soft: "bg-amber-50 text-amber-800",
        dot: "bg-amber-500",
    },
    rose: {
        hero: "bg-gradient-to-br from-rose-950 via-rose-800 to-pink-500",
        icon: "bg-rose-100 text-rose-800",
        accent: "text-rose-700",
        progress: "from-rose-600 to-pink-400",
        border: "hover:border-rose-300",
        glow: "hover:shadow-rose-900/10",
        soft: "bg-rose-50 text-rose-800",
        dot: "bg-rose-500",
    },
    violet: {
        hero: "bg-gradient-to-br from-violet-950 via-violet-800 to-purple-500",
        icon: "bg-violet-100 text-violet-800",
        accent: "text-violet-700",
        progress: "from-violet-600 to-purple-400",
        border: "hover:border-violet-300",
        glow: "hover:shadow-violet-900/10",
        soft: "bg-violet-50 text-violet-800",
        dot: "bg-violet-500",
    },
    cyan: {
        hero: "bg-gradient-to-br from-cyan-950 via-cyan-800 to-teal-500",
        icon: "bg-cyan-100 text-cyan-800",
        accent: "text-cyan-700",
        progress: "from-cyan-600 to-teal-400",
        border: "hover:border-cyan-300",
        glow: "hover:shadow-cyan-900/10",
        soft: "bg-cyan-50 text-cyan-800",
        dot: "bg-cyan-500",
    },
};

const OPTION_COLORS = [
    "bg-emerald-50 text-emerald-800 hover:bg-emerald-100",
    "bg-blue-50 text-blue-800 hover:bg-blue-100",
    "bg-amber-50 text-amber-800 hover:bg-amber-100",
    "bg-rose-50 text-rose-800 hover:bg-rose-100",
    "bg-violet-50 text-violet-800 hover:bg-violet-100",
    "bg-cyan-50 text-cyan-800 hover:bg-cyan-100",
];

const STATUS_STYLES = {
    Active: "bg-emerald-50 text-emerald-700 ring-emerald-600/15",
    Upcoming: "bg-blue-50 text-blue-700 ring-blue-600/15",
    Completed: "bg-violet-50 text-violet-700 ring-violet-600/15",
    Paused: "bg-amber-50 text-amber-700 ring-amber-600/15",
};

const getTheme = (item) => THEMES[item.theme] || THEMES.emerald;

const getStatusStyle = (status) =>
    STATUS_STYLES[status] ||
    "bg-slate-100 text-slate-700 ring-slate-300/40";

const formatDate = (date) =>
    new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });

/* ======================== PREMIUM DROPDOWN ======================== */

function PremiumDropdown({ value, options, onChange, label, icon: Icon }) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState(null);

    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const selected = options.find((option) => option.value === value);

    useEffect(() => {
        if (!open) return undefined;

        const updatePosition = () => {
            const rect = triggerRef.current?.getBoundingClientRect();
            if (!rect) return;

            const gap = 8;
            const padding = 12;
            const below = window.innerHeight - rect.bottom - padding;
            const above = rect.top - padding;

            const desiredHeight = Math.min(
                280,
                Math.max(100, options.length * 45 + 16),
            );

            const placement =
                below >= desiredHeight || below >= above ? "bottom" : "top";

            const available = Math.max(
                100,
                placement === "bottom" ? below : above,
            );

            const width = Math.min(
                Math.max(rect.width, 210),
                window.innerWidth - 16,
            );

            setPosition({
                left: Math.max(
                    8,
                    Math.min(rect.left, window.innerWidth - width - 8),
                ),
                width,
                maxHeight: Math.min(desiredHeight, available),
                top: rect.bottom + gap,
                bottom: window.innerHeight - rect.top + gap,
                placement,
            });
        };

        const handleOutside = (event) => {
            if (
                triggerRef.current?.contains(event.target) ||
                menuRef.current?.contains(event.target)
            ) {
                return;
            }

            setOpen(false);
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }
        };

        updatePosition();

        document.addEventListener("pointerdown", handleOutside);
        document.addEventListener("keydown", handleKeyDown);
        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);

        return () => {
            document.removeEventListener("pointerdown", handleOutside);
            document.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
        };
    }, [open, options.length]);

    const menu =
        open && position
            ? createPortal(
                <AnimatePresence>
                    <motion.div
                        ref={menuRef}
                        role="listbox"
                        aria-label={label}
                        initial={{
                            opacity: 0,
                            y: position.placement === "top" ? 5 : -5,
                            scale: 0.98,
                        }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.14 }}
                        style={{
                            position: "fixed",
                            zIndex: 9999,
                            left: position.left,
                            width: position.width,
                            maxHeight: position.maxHeight,
                            top:
                                position.placement === "bottom"
                                    ? position.top
                                    : undefined,
                            bottom:
                                position.placement === "top"
                                    ? position.bottom
                                    : undefined,
                        }}
                        className="assignment-dropdown-scroll overflow-y-auto rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl shadow-slate-900/15"
                    >
                        {options.map((option, index) => {
                            const active = option.value === value;
                            const OptionIcon = option.icon;

                            return (
                                <button
                                    key={option.value}
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                        triggerRef.current?.focus();
                                    }}
                                    className={`mb-1 flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-sm transition last:mb-0 ${option.color ||
                                        OPTION_COLORS[index % OPTION_COLORS.length]
                                        } ${active
                                            ? "font-bold ring-1 ring-current/15"
                                            : "font-medium"
                                        }`}
                                >
                                    {OptionIcon && (
                                        <OptionIcon size={15} className="shrink-0" />
                                    )}

                                    <span className="min-w-0 flex-1">
                                        {option.label}
                                    </span>

                                    {active && (
                                        <Check size={15} className="shrink-0" />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>,
                document.body,
            )
            : null;

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => {
                    setOpen((current) => !current);
                }}
                className={`flex h-[46px] min-w-0 w-full items-center gap-2 rounded-xl border bg-white px-3 text-left text-sm outline-none transition ${open
                    ? "border-emerald-500 ring-4 ring-emerald-500/10"
                    : "border-slate-200 hover:border-emerald-300"
                    }`}
            >
                {Icon && (
                    <Icon size={16} className="shrink-0 text-emerald-700" />
                )}

                <span className="min-w-0 flex-1 truncate font-semibold text-slate-800">
                    {selected?.label ?? value}
                </span>

                <ChevronDown
                    size={15}
                    className={`shrink-0 text-slate-400 transition-transform ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            {menu}
        </>
    );
}

/* ======================== STAT CARD ======================== */

function StatCard({ title, value, description, icon: Icon, color }) {
    return (
        <motion.div
            whileHover={{ y: -3 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">{title}</p>
                    <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                        {value}
                    </p>
                </div>

                <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ${color}`}>
                    <Icon size={21} strokeWidth={1.8} />
                </div>
            </div>

            <p className="mt-4 text-xs text-slate-500">{description}</p>
        </motion.div>
    );
}

/* ======================== ASSIGNMENT DETAILS MODAL ======================== */

function AssignmentDetailsModal({ assignment, onClose }) {
    useEffect(() => {
        if (!assignment) return undefined;

        const handleEscape = (event) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("keydown", handleEscape);
        };
    }, [assignment, onClose]);

    return (
        <AnimatePresence>
            {assignment && (
                <motion.div
                    key="assignment-details-overlay"
                    className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
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
                        aria-labelledby="assignment-modal-title"
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.22 }}
                        className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                    >
                        <div className={`relative p-6 text-white sm:p-8 ${getTheme(assignment).hero}`}>
                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close assignment details"
                                className="absolute right-4 top-4 rounded-xl p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                            >
                                <X size={20} />
                            </button>

                            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                                <ClipboardList size={14} />
                                {assignment.id}
                            </span>

                            <h2
                                id="assignment-modal-title"
                                className="mt-5 max-w-lg text-2xl font-bold leading-tight sm:text-3xl"
                            >
                                {assignment.title}
                            </h2>

                            <p className="mt-2 text-sm leading-6 text-white/85">
                                {assignment.description}
                            </p>

                            <div className="mt-5 flex flex-wrap gap-4 text-sm text-white/90">
                                <span className="inline-flex items-center gap-1.5">
                                    <Users size={15} />
                                    {assignment.students} students
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <Clock3 size={15} />
                                    {assignment.duration}
                                </span>
                                <span className="inline-flex items-center gap-1.5">
                                    <BookOpen size={15} />
                                    {assignment.totalModules} modules
                                </span>
                            </div>
                        </div>

                        <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs font-medium text-slate-500">College</p>
                                    <p className="mt-2 font-semibold text-slate-900">
                                        {assignment.college}
                                    </p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        {assignment.location}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs font-medium text-slate-500">
                                        Assignment status
                                    </p>
                                    <span className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusStyle(assignment.status)}`}>
                                        {assignment.status}
                                    </span>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs font-medium text-slate-500">Start date</p>
                                    <p className="mt-2 font-semibold text-slate-900">
                                        {formatDate(assignment.startDate)}
                                    </p>
                                </div>

                                <div className="rounded-xl border border-slate-200 p-4">
                                    <p className="text-xs font-medium text-slate-500">End date</p>
                                    <p className="mt-2 font-semibold text-slate-900">
                                        {formatDate(assignment.endDate)}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="font-semibold text-slate-900">
                                        Program progress
                                    </h3>
                                    <span className={`text-sm font-bold ${getTheme(assignment).accent}`}>
                                        {assignment.progress}%
                                    </span>
                                </div>

                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${assignment.progress}%` }}
                                        transition={{ duration: 0.7 }}
                                        className={`h-full rounded-full bg-gradient-to-r ${getTheme(assignment).progress}`}
                                    />
                                </div>

                                <p className="mt-2 text-xs text-slate-500">
                                    {assignment.completedModules} of {assignment.totalModules} modules completed
                                </p>
                            </div>

                            <div className="mt-7">
                                <h3 className="font-semibold text-slate-900">Program modules</h3>

                                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                    {assignment.modules.map((module, index) => (
                                        <div
                                            key={module}
                                            className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                                        >
                                            <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${getTheme(assignment).icon}`}>
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <span className="text-sm font-medium text-slate-700">
                                                {module}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    onClick={onClose}
                                    className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold text-white transition ${getTheme(assignment).hero}`}
                                >
                                    <Check size={16} />
                                    Done
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

/* ======================== ASSIGNMENT CARD ======================== */

function AssignmentCard({
    assignment,
    index,
    isMenuOpen,
    menuRef,
    onToggleMenu,
    onViewDetails,
    onOpenProgram,
    onStatusChange,
    onDelete,
}) {
    const theme = getTheme(assignment);

    return (
        <motion.article
            layout
            key={assignment.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{
                duration: 0.2,
                delay: Math.min(index * 0.025, 0.1),
            }}
            className={`relative flex min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.border} ${theme.glow}`}
        >
            <div className={`relative m-3 mb-0 rounded-xl p-5 text-white sm:p-6 ${theme.hero}`}>
                <div className="flex items-start justify-between gap-3">
                    <span className="inline-flex max-w-[80%] items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15">
                        <GraduationCap size={14} className="shrink-0" />
                        <span className="truncate">{assignment.category}</span>
                    </span>

                    <div
                        ref={isMenuOpen ? menuRef : null}
                        className="relative shrink-0"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            aria-label={`More actions for ${assignment.title}`}
                            aria-expanded={isMenuOpen}
                            onClick={() => onToggleMenu(assignment.id)}
                            className="rounded-lg p-2 text-white/90 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
                        >
                            <MoreVertical size={18} />
                        </button>

                        <AnimatePresence>
                            {isMenuOpen && (
                                <motion.div
                                    initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                    transition={{ duration: 0.14 }}
                                    className="absolute right-0 top-11 z-[100] w-56 rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 shadow-2xl shadow-slate-950/15"
                                >
                                    <button
                                        type="button"
                                        onClick={() => onViewDetails(assignment)}
                                        className="flex w-full items-center gap-2.5 rounded-lg bg-emerald-50 px-3 py-2.5 text-left text-sm font-medium text-emerald-800 transition hover:bg-emerald-100"
                                    >
                                        <Eye size={15} />
                                        View details
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => onOpenProgram(assignment)}
                                        className="mt-1 flex w-full items-center gap-2.5 rounded-lg bg-blue-50 px-3 py-2.5 text-left text-sm font-medium text-blue-800 transition hover:bg-blue-100"
                                    >
                                        <ExternalLink size={15} />
                                        Open program
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onStatusChange(
                                                assignment,
                                                assignment.status === "Completed"
                                                    ? "Active"
                                                    : "Completed",
                                            )
                                        }
                                        className="mt-1 flex w-full items-center gap-2.5 rounded-lg bg-violet-50 px-3 py-2.5 text-left text-sm font-medium text-violet-800 transition hover:bg-violet-100"
                                    >
                                        <CircleCheck size={15} />
                                        {assignment.status === "Completed"
                                            ? "Reopen assignment"
                                            : "Mark completed"}
                                    </button>

                                    <div className="my-1 border-t border-slate-100" />

                                    <button
                                        type="button"
                                        onClick={() => onDelete(assignment)}
                                        className="flex w-full items-center gap-2.5 rounded-lg bg-rose-50 px-3 py-2.5 text-left text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                                    >
                                        <Trash2 size={15} />
                                        Remove from demo
                                    </button>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>

                <div className="mt-7 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                        <span className="inline-flex rounded-md bg-white/15 px-2 py-1 text-[11px] font-semibold text-white ring-1 ring-white/15">
                            {assignment.id}
                        </span>
                        <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                            {assignment.title}
                        </h3>
                        <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/85">
                            {assignment.subtitle}
                        </p>
                    </div>

                    <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 sm:flex">
                        <ClipboardList size={26} />
                    </div>
                </div>

                <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${assignment.status === "Active"
                        ? "bg-white text-emerald-800"
                        : assignment.status === "Upcoming"
                            ? "bg-white text-blue-800"
                            : assignment.status === "Completed"
                                ? "bg-white text-violet-800"
                                : "bg-white text-amber-800"
                        }`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${theme.dot}`} />
                        {assignment.status}
                    </span>
                    <span className="text-xs text-white/85">{assignment.duration}</span>
                </div>
            </div>

            <div className="flex flex-1 flex-col p-4 sm:p-5">
                <div className="flex items-start gap-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.icon}`}>
                        <GraduationCap size={19} />
                    </div>
                    <div className="min-w-0">
                        <p className="line-clamp-2 text-sm font-bold text-slate-900">
                            {assignment.college}
                        </p>
                        <p className="mt-1 flex items-center gap-1 text-xs text-slate-500">
                            <MapPin size={12} className="shrink-0" />
                            <span className="truncate">{assignment.location}</span>
                        </p>
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50/80 py-3">
                    <div className="px-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-500">
                            <Users size={14} />
                            <span className="text-xs">Students</span>
                        </div>
                        <p className="mt-1.5 text-lg font-bold text-slate-900">
                            {assignment.students}
                        </p>
                    </div>

                    <div className="px-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-500">
                            <BookOpen size={14} />
                            <span className="text-xs">Modules</span>
                        </div>
                        <p className="mt-1.5 text-lg font-bold text-slate-900">
                            {assignment.completedModules}
                            <span className="text-xs font-medium text-slate-400">
                                /{assignment.totalModules}
                            </span>
                        </p>
                    </div>

                    <div className="px-2 text-center">
                        <div className="flex items-center justify-center gap-1 text-slate-500">
                            <Activity size={14} />
                            <span className="text-xs">Attendance</span>
                        </div>
                        <p className="mt-1.5 text-lg font-bold text-slate-900">
                            {assignment.attendance}%
                        </p>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="flex items-center justify-between gap-3">
                        <span className="text-sm font-medium text-slate-600">
                            Program progress
                        </span>
                        <span className={`text-sm font-bold ${theme.accent}`}>
                            {assignment.progress}%
                        </span>
                    </div>

                    <div
                        className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100"
                        role="progressbar"
                        aria-label={`${assignment.title} progress`}
                        aria-valuenow={assignment.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                    >
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${assignment.progress}%` }}
                            transition={{ duration: 0.65 }}
                            className={`h-full rounded-full bg-gradient-to-r ${theme.progress}`}
                        />
                    </div>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-slate-100 p-3">
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                            <CalendarDays size={13} />
                            Start date
                        </p>
                        <p className="mt-1.5 text-xs font-semibold text-slate-800">
                            {formatDate(assignment.startDate)}
                        </p>
                    </div>

                    <div className="rounded-xl border border-slate-100 p-3">
                        <p className="flex items-center gap-1.5 text-xs text-slate-500">
                            <Clock3 size={13} />
                            End date
                        </p>
                        <p className="mt-1.5 text-xs font-semibold text-slate-800">
                            {formatDate(assignment.endDate)}
                        </p>
                    </div>
                </div>

                <div className="mt-4 flex min-w-0 items-center gap-3 rounded-xl bg-slate-50 p-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold ${theme.icon}`}>
                        {assignment.trainer
                            .split(" ")
                            .map((part) => part[0])
                            .join("")
                            .slice(0, 2)}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-semibold text-slate-800">
                            {assignment.trainer}
                        </p>
                        <p className="truncate text-xs text-slate-500">
                            {assignment.email}
                        </p>
                    </div>

                    <span className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-bold ${theme.soft}`}>
                        Trainer
                    </span>
                </div>

                <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                    <button
                        type="button"
                        onClick={() => onViewDetails(assignment)}
                        className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 ${theme.border}`}
                    >
                        <Eye size={16} />
                        Details
                    </button>

                    <button
                        type="button"
                        onClick={() => onOpenProgram(assignment)}
                        className={`inline-flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-white transition ${theme.hero}`}
                    >
                        <span className="truncate">Open program</span>
                        <ArrowUpRight size={15} className="shrink-0" />
                    </button>
                </div>
            </div>
        </motion.article>
    );
}

/* ======================== MAIN PAGE ======================== */

export default function TrainerAssignmentsPage() {
    const navigate = useNavigate();

    const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All Assignments");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [sortBy, setSortBy] = useState("recent");
    const [selectedAssignment, setSelectedAssignment] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [notice, setNotice] = useState("");
    const [noticeKey, setNoticeKey] = useState(0);

    const menuRef = useRef(null);

    useEffect(() => {
        if (!notice) return undefined;
        const timer = window.setTimeout(() => setNotice(""), 3200);
        return () => window.clearTimeout(timer);
    }, [notice, noticeKey]);

    useEffect(() => {
        if (openMenuId === null) return undefined;

        const handleOutside = (event) => {
            if (!menuRef.current?.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") setOpenMenuId(null);
        };

        document.addEventListener("pointerdown", handleOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("pointerdown", handleOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [openMenuId]);

    const activeCount = assignments.filter(
        (item) => item.status === "Active",
    ).length;

    const upcomingCount = assignments.filter(
        (item) => item.status === "Upcoming",
    ).length;

    const completedCount = assignments.filter(
        (item) => item.status === "Completed",
    ).length;

    const totalStudents = assignments.reduce(
        (total, item) => total + item.students,
        0,
    );

    const startedAssignments = assignments.filter(
        (item) => item.status !== "Upcoming",
    );

    const attendanceValue = startedAssignments.length
        ? Math.round(
            startedAssignments.reduce(
                (total, item) => total + item.attendance,
                0,
            ) / startedAssignments.length,
        )
        : 0;

    const categories = useMemo(
        () => [
            "All Categories",
            ...new Set(assignments.map((item) => item.category)),
        ],
        [assignments],
    );

    const filteredAssignments = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const result = assignments.filter((item) => {
            const searchableText = [
                item.id,
                item.title,
                item.subtitle,
                item.college,
                item.location,
                item.category,
                item.trainer,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch = !query || searchableText.includes(query);
            const matchesStatus =
                activeFilter === "All Assignments" ||
                item.status === activeFilter;
            const matchesCategory =
                categoryFilter === "All Categories" ||
                item.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        return [...result].sort((a, b) => {
            if (sortBy === "students") return b.students - a.students;
            if (sortBy === "progress") return b.progress - a.progress;
            if (sortBy === "attendance") return b.attendance - a.attendance;
            if (sortBy === "name") return a.title.localeCompare(b.title);
            if (sortBy === "startDate") {
                return a.startDate.localeCompare(b.startDate);
            }
            return b.id.localeCompare(a.id);
        });
    }, [
        assignments,
        searchQuery,
        activeFilter,
        categoryFilter,
        sortBy,
    ]);

    const showNotice = (message) => {
        setNotice(message);
        setNoticeKey((key) => key + 1);
    };

    const openProgram = (assignment) => {
        setOpenMenuId(null);
        navigate(`/trainer/assignments/${assignment.id}`, {
            state: { assignment },
        });
    };

    const viewDetails = (assignment) => {
        setSelectedAssignment(assignment);
        setOpenMenuId(null);
    };

    const handleDelete = (assignment) => {
        const confirmed = window.confirm(
            `Remove "${assignment.title}" from this demo list?`,
        );

        setOpenMenuId(null);
        if (!confirmed) return;

        setAssignments((current) =>
            current.filter((item) => item.id !== assignment.id),
        );

        if (selectedAssignment?.id === assignment.id) {
            setSelectedAssignment(null);
        }

        showNotice("Assignment removed from the demo list.");
    };

    const handleStatusChange = (assignment, nextStatus) => {
        setAssignments((current) =>
            current.map((item) =>
                item.id === assignment.id
                    ? {
                        ...item,
                        status: nextStatus,
                        progress:
                            nextStatus === "Completed" ? 100 : item.progress,
                        completedModules:
                            nextStatus === "Completed"
                                ? item.totalModules
                                : item.completedModules,
                    }
                    : item,
            ),
        );

        setOpenMenuId(null);
        showNotice(`Assignment status changed to ${nextStatus}.`);
    };

    const resetFilters = () => {
        setSearchQuery("");
        setActiveFilter("All Assignments");
        setCategoryFilter("All Categories");
        setSortBy("recent");
    };

    const categoryOptions = categories.map((category, index) => ({
        value: category,
        label: category,
        color: OPTION_COLORS[index % OPTION_COLORS.length],
    }));

    const sortOptions = [
        { value: "recent", label: "Recently added", color: OPTION_COLORS[0] },
        { value: "students", label: "Most students", color: OPTION_COLORS[1] },
        { value: "progress", label: "Highest progress", color: OPTION_COLORS[2] },
        { value: "attendance", label: "Best attendance", color: OPTION_COLORS[3] },
        { value: "startDate", label: "Start date", color: OPTION_COLORS[4] },
        { value: "name", label: "Name A–Z", color: OPTION_COLORS[5] },
    ];

    return (
        <div className="min-h-screen min-w-0 bg-[#f6faf7] text-slate-900">
            <style>{`
        /* Compact, single-row desktop filter layout */
        @media (min-width: 1100px) {
          .assignment-filter-layout {
            grid-template-columns:
              minmax(260px, 1.1fr)
              minmax(365px, 1fr)
              minmax(330px, 1fr);
            align-items: center;
          }

          .assignment-status-filters {
            flex-wrap: nowrap;
          }
        }

        .assignment-dropdown-scroll {
          scrollbar-width: thin;
          scrollbar-color: #10b981 #ecfdf5;
        }

        .assignment-dropdown-scroll::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .assignment-dropdown-scroll::-webkit-scrollbar-track {
          background: #ecfdf5;
          border-radius: 999px;
        }

        .assignment-dropdown-scroll::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #34d399, #059669);
          border: 2px solid #ecfdf5;
          border-radius: 999px;
        }

        .assignment-dropdown-scroll::-webkit-scrollbar-thumb:hover {
          background: #047857;
        }
      `}</style>

            <div className="mx-auto w-full max-w-[1600px] px-4 py-5 sm:px-6 lg:px-8 lg:py-6">
                {/* Header actions */}

                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center"
                >
                    <button
                        type="button"
                        onClick={() => navigate("/trainer/schedule")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                        <CalendarDays size={17} />
                        View schedule
                    </button>

                    <button
                        type="button"
                        onClick={() =>
                            showNotice(
                                "Connect this button to your assignment creation route to create real assignments.",
                            )
                        }
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                    >
                        <Plus size={18} />
                        Create assignment
                    </button>
                </motion.div>

                {/* Statistics */}

                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    <StatCard
                        title="Total assignments"
                        value={assignments.length}
                        description={`${activeCount} active · ${upcomingCount} upcoming`}
                        icon={ClipboardList}
                        color="bg-emerald-50 text-emerald-700 ring-emerald-100"
                    />

                    <StatCard
                        title="Total students"
                        value={totalStudents.toLocaleString("en-IN")}
                        description="Across assigned programs"
                        icon={Users}
                        color="bg-blue-50 text-blue-700 ring-blue-100"
                    />

                    <StatCard
                        title="Average attendance"
                        value={`${attendanceValue}%`}
                        description="Across started programs"
                        icon={Activity}
                        color="bg-amber-50 text-amber-700 ring-amber-100"
                    />

                    <StatCard
                        title="Completed programs"
                        value={completedCount}
                        description={`${activeCount} programs currently active`}
                        icon={CircleCheck}
                        color="bg-violet-50 text-violet-700 ring-violet-100"
                    />
                </motion.div>

                {/* Performance banner */}

                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.14 }}
                    className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-950 via-emerald-800 to-green-700 p-5 text-white sm:p-6"
                >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                                <Target size={23} />
                            </div>

                            <div>
                                <p className="text-lg font-bold">Assignment performance</p>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-emerald-50">
                                    Track student participation, program progress, attendance,
                                    and upcoming training schedules from one workspace.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-5 border-t border-white/15 pt-4 md:border-l md:border-t-0 md:pl-7 md:pt-0">
                            {[
                                ["Active", activeCount],
                                ["Upcoming", upcomingCount],
                                ["Completed", completedCount],
                            ].map(([label, count]) => (
                                <div key={label}>
                                    <p className="text-2xl font-bold">{count}</p>
                                    <p className="mt-1 text-xs text-emerald-100">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.section>

                {/* Training assignments */}

                <section className="mt-7">
                    <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                Training assignments
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Manage college programs and monitor student progress.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
                            <Layers3 size={16} className="text-emerald-700" />
                            {filteredAssignments.length}{" "}
                            {filteredAssignments.length === 1
                                ? "assignment"
                                : "assignments"}{" "}
                            found
                        </span>
                    </div>

                    {/* Compact filters — three columns on desktop */}

                    <div className="relative z-30 mt-4 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
                        <div className="assignment-filter-layout grid min-w-0 grid-cols-1 gap-3">
                            {/* Search */}

                            <div className="relative min-w-0">
                                <Search
                                    size={17}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />

                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search programs, colleges or IDs..."
                                    aria-label="Search assignments"
                                    className="h-[46px] w-full min-w-0 rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-10 text-sm font-medium text-slate-900 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10"
                                />

                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>

                            {/* Status filters */}

                            <div className="assignment-status-filters flex min-w-0 flex-wrap items-center gap-1 rounded-xl bg-slate-100 p-1">
                                {FILTERS.map((filter) => {
                                    const active = activeFilter === filter;

                                    const activeColor =
                                        filter === "Upcoming"
                                            ? "text-blue-800"
                                            : filter === "Completed"
                                                ? "text-violet-800"
                                                : "text-emerald-800";

                                    return (
                                        <button
                                            type="button"
                                            key={filter}
                                            aria-pressed={active}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`whitespace-nowrap rounded-lg px-2.5 py-2.5 text-xs font-semibold transition ${active
                                                ? `bg-white ${activeColor} shadow-sm`
                                                : "text-slate-500 hover:bg-white/60 hover:text-slate-800"
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Category and sorting dropdowns */}

                            <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                                <PremiumDropdown
                                    value={categoryFilter}
                                    options={categoryOptions}
                                    onChange={setCategoryFilter}
                                    label="Filter by category"
                                    icon={SlidersHorizontal}
                                />

                                <PremiumDropdown
                                    value={sortBy}
                                    options={[
                                        {
                                            value: "recent",
                                            label: "Recently added",
                                            color: OPTION_COLORS[0],
                                        },
                                        {
                                            value: "students",
                                            label: "Most students",
                                            color: OPTION_COLORS[1],
                                        },
                                        {
                                            value: "progress",
                                            label: "Highest progress",
                                            color: OPTION_COLORS[2],
                                        },
                                        {
                                            value: "attendance",
                                            label: "Best attendance",
                                            color: OPTION_COLORS[3],
                                        },
                                        {
                                            value: "startDate",
                                            label: "Start date",
                                            color: OPTION_COLORS[4],
                                        },
                                        {
                                            value: "name",
                                            label: "Name A–Z",
                                            color: OPTION_COLORS[5],
                                        },
                                    ]}
                                    onChange={setSortBy}
                                    label="Sort assignments"
                                    icon={TrendingUp}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Assignment cards */}

                    <div className="relative z-0 mt-5 grid min-w-0 items-stretch gap-5 md:grid-cols-2 2xl:grid-cols-3">
                        <AnimatePresence mode="sync">
                            {filteredAssignments.map((assignment, index) => (
                                <AssignmentCard
                                    key={assignment.id}
                                    assignment={assignment}
                                    index={index}
                                    isMenuOpen={openMenuId === assignment.id}
                                    menuRef={menuRef}
                                    onToggleMenu={(id) =>
                                        setOpenMenuId((current) => current === id ? null : id)
                                    }
                                    onViewDetails={viewDetails}
                                    onOpenProgram={openProgram}
                                    onStatusChange={handleStatusChange}
                                    onDelete={handleDelete}
                                />
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Empty state */}

                    {filteredAssignments.length === 0 && (
                        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                <Search size={24} />
                            </div>

                            <h3 className="mt-4 text-lg font-bold text-slate-900">
                                No assignments found
                            </h3>

                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Try changing your search term or filters to find the assignment
                                you are looking for.
                            </p>

                            <button
                                type="button"
                                onClick={resetFilters}
                                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                            >
                                <RotateCcw size={15} />
                                Reset filters
                            </button>
                        </div>
                    )}
                </section>
            </div>

            {/* Toast */}

            <AnimatePresence>
                {notice && (
                    <motion.div
                        key={noticeKey}
                        role="status"
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 12 }}
                        className="fixed bottom-5 right-4 z-[110] flex max-w-sm items-start gap-3 rounded-2xl border border-emerald-100 bg-white px-4 py-3.5 shadow-xl shadow-slate-900/10 sm:right-6"
                    >
                        <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                            {notice.toLowerCase().includes("removed") ? (
                                <Trash2 size={17} />
                            ) : (
                                <CircleCheck size={18} />
                            )}
                        </div>

                        <p className="flex-1 text-sm font-medium leading-5 text-slate-700">
                            {notice}
                        </p>

                        <button
                            type="button"
                            onClick={() => setNotice("")}
                            aria-label="Dismiss notification"
                            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                        >
                            <X size={16} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Assignment details modal */}

            <AssignmentDetailsModal
                assignment={selectedAssignment}
                onClose={() => setSelectedAssignment(null)}
            />
        </div>
    );
}