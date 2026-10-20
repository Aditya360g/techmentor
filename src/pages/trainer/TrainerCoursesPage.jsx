
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
    Search,
    Plus,
    BookOpen,
    Users,
    Star,
    TrendingUp,
    Clock3,
    MoreVertical,
    ChevronDown,
    ArrowUpRight,
    CalendarDays,
    FileText,
    CircleCheck,
    CirclePlay,
    Eye,
    Pencil,
    Trash2,
    X,
    SlidersHorizontal,
    ChartNoAxesCombined,
    Layers3,
    CheckCircle2,
    ExternalLink,
    Target,
    Database,
    Code2,
    Palette,
    BrainCircuit,
    RotateCcw,
    Check,
} from "lucide-react";

const INITIAL_COURSES = [
    {
        id: 1,
        title: "Full Stack Web Development",
        subtitle: "Build production-ready web applications",
        category: "Development",
        level: "Intermediate",
        status: "Published",
        students: 248,
        rating: 4.9,
        reviews: 86,
        lessons: 42,
        duration: "18h 30m",
        progress: 92,
        revenue: 24800,
        updatedAt: "2 days ago",
        theme: "emerald",
        modules: ["HTML & CSS", "JavaScript", "React", "Node.js & APIs"],
        description:
            "Learn to build modern, responsive web applications with frontend and backend technologies, authentication, databases and deployment.",
    },
    {
        id: 2,
        title: "React.js Masterclass",
        subtitle: "From React fundamentals to advanced patterns",
        category: "Development",
        level: "Advanced",
        status: "Published",
        students: 186,
        rating: 4.8,
        reviews: 64,
        lessons: 36,
        duration: "14h 20m",
        progress: 78,
        revenue: 18600,
        updatedAt: "5 days ago",
        theme: "blue",
        modules: [
            "React Fundamentals",
            "Hooks",
            "State Management",
            "Performance",
        ],
        description:
            "Master component architecture, hooks, reusable UI patterns, state management and practical techniques for building scalable React applications.",
    },
    {
        id: 3,
        title: "Python for Data Science",
        subtitle: "Analyze data and discover actionable insights",
        category: "Data Science",
        level: "Beginner",
        status: "Published",
        students: 324,
        rating: 4.9,
        reviews: 112,
        lessons: 48,
        duration: "21h 10m",
        progress: 100,
        revenue: 32400,
        updatedAt: "1 week ago",
        theme: "amber",
        modules: [
            "Python Basics",
            "NumPy & Pandas",
            "Visualization",
            "Data Projects",
        ],
        description:
            "Explore Python programming, data cleaning, analysis and visualization through practical exercises and real-world datasets.",
    },
    {
        id: 4,
        title: "UI/UX Design Essentials",
        subtitle: "Create intuitive and beautiful user experiences",
        category: "Design",
        level: "Beginner",
        status: "Draft",
        students: 0,
        rating: 0,
        reviews: 0,
        lessons: 24,
        duration: "9h 45m",
        progress: 56,
        revenue: 0,
        updatedAt: "Today",
        theme: "rose",
        modules: [
            "Design Principles",
            "Wireframing",
            "Prototyping",
            "Design Systems",
        ],
        description:
            "Learn user-centered design, wireframing, prototyping and design systems to create accessible and polished digital experiences.",
    },
    {
        id: 5,
        title: "Advanced SQL & Database Design",
        subtitle: "Write efficient queries and model databases",
        category: "Data Science",
        level: "Advanced",
        status: "Published",
        students: 142,
        rating: 4.7,
        reviews: 39,
        lessons: 30,
        duration: "12h 15m",
        progress: 68,
        revenue: 14200,
        updatedAt: "3 days ago",
        theme: "violet",
        modules: [
            "SQL Fundamentals",
            "Joins & CTEs",
            "Optimization",
            "Database Design",
        ],
        description:
            "Develop strong SQL skills, design relational databases and learn to optimize queries for reliable, scalable applications.",
    },
    {
        id: 6,
        title: "Introduction to Machine Learning",
        subtitle: "Build your first intelligent models",
        category: "AI & ML",
        level: "Intermediate",
        status: "Draft",
        students: 0,
        rating: 0,
        reviews: 0,
        lessons: 32,
        duration: "16h 00m",
        progress: 34,
        revenue: 0,
        updatedAt: "Yesterday",
        theme: "cyan",
        modules: [
            "ML Foundations",
            "Regression",
            "Classification",
            "Model Evaluation",
        ],
        description:
            "Understand core machine learning concepts, train predictive models and evaluate results using hands-on Python projects.",
    },
];

const FILTERS = ["All Courses", "Published", "Draft"];

const COURSE_THEMES = {
    emerald: {
        hero: "bg-gradient-to-br from-emerald-800 via-emerald-700 to-green-600",
        icon: "bg-emerald-100 text-emerald-800",
        accent: "text-emerald-700",
        progress: "from-emerald-600 to-green-400",
        border: "hover:border-emerald-300",
        glow: "hover:shadow-emerald-900/10",
    },
    blue: {
        hero: "bg-gradient-to-br from-blue-900 via-blue-700 to-sky-500",
        icon: "bg-blue-100 text-blue-800",
        accent: "text-blue-700",
        progress: "from-blue-600 to-sky-400",
        border: "hover:border-blue-300",
        glow: "hover:shadow-blue-900/10",
    },
    amber: {
        hero: "bg-gradient-to-br from-amber-800 via-amber-700 to-yellow-500",
        icon: "bg-amber-100 text-amber-800",
        accent: "text-amber-700",
        progress: "from-amber-500 to-yellow-400",
        border: "hover:border-amber-300",
        glow: "hover:shadow-amber-900/10",
    },
    rose: {
        hero: "bg-gradient-to-br from-rose-900 via-rose-700 to-pink-500",
        icon: "bg-rose-100 text-rose-800",
        accent: "text-rose-700",
        progress: "from-rose-600 to-pink-400",
        border: "hover:border-rose-300",
        glow: "hover:shadow-rose-900/10",
    },
    violet: {
        hero: "bg-gradient-to-br from-violet-900 via-violet-700 to-purple-500",
        icon: "bg-violet-100 text-violet-800",
        accent: "text-violet-700",
        progress: "from-violet-600 to-purple-400",
        border: "hover:border-violet-300",
        glow: "hover:shadow-violet-900/10",
    },
    cyan: {
        hero: "bg-gradient-to-br from-cyan-900 via-cyan-700 to-teal-500",
        icon: "bg-cyan-100 text-cyan-800",
        accent: "text-cyan-700",
        progress: "from-cyan-600 to-teal-400",
        border: "hover:border-cyan-300",
        glow: "hover:shadow-cyan-900/10",
    },
};

const formatCurrency = (amount) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(amount);

const getStatusStyle = (status) =>
    status === "Published"
        ? "bg-emerald-50 text-emerald-700 ring-emerald-600/15"
        : "bg-amber-50 text-amber-700 ring-amber-600/15";

const getCourseIcon = (category) => {
    if (category === "Design") return Palette;
    if (category === "AI & ML") return BrainCircuit;
    if (category === "Data Science") return Database;
    if (category === "Development") return Code2;
    return BookOpen;
};

/* Custom dropdown with outside-click handling */
function PremiumDropdown({
    value,
    options,
    onChange,
    label,
    icon: Icon,
    width = "w-full sm:w-48",
}) {
    const [open, setOpen] = useState(false);
    const dropdownRef = useRef(null);
    const selectedOption = options.find((option) => option.value === value);

    useEffect(() => {
        if (!open) return;

        const handleOutsideClick = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") setOpen(false);
        };

        document.addEventListener("pointerdown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [open]);

    return (
        <div
            ref={dropdownRef}
            className={`relative min-w-0 ${width}`}
            onClick={(event) => event.stopPropagation()}
        >
            <button
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className={`flex w-full items-center gap-2.5 rounded-xl border bg-white px-3.5 py-3 text-left text-sm outline-none transition ${open
                    ? "border-emerald-500 ring-4 ring-emerald-500/10"
                    : "border-slate-200 hover:border-emerald-300"
                    }`}
            >
                {Icon && <Icon size={16} className="shrink-0 text-emerald-700" />}
                <span className="min-w-0 flex-1 truncate font-medium text-slate-700">
                    {selectedOption?.label ?? value}
                </span>
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-slate-400 transition-transform duration-200 ${open ? "rotate-180" : ""
                        }`}
                />
            </button>

            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 5, scale: 0.98 }}
                        transition={{ duration: 0.14 }}
                        role="listbox"
                        aria-label={label}
                        className="absolute right-0 top-[calc(100%+8px)] z-[100] max-h-64 w-full min-w-[190px] overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-xl shadow-slate-900/10"
                    >
                        {options.map((option) => {
                            const active = option.value === value;

                            return (
                                <button
                                    type="button"
                                    role="option"
                                    aria-selected={active}
                                    key={option.value}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={`flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition ${active
                                        ? "bg-emerald-50 font-semibold text-emerald-800"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                        }`}
                                >
                                    <span className="min-w-0 flex-1">{option.label}</span>
                                    {active && (
                                        <Check
                                            size={15}
                                            className="shrink-0 text-emerald-700"
                                        />
                                    )}
                                </button>
                            );
                        })}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

function StatCard({ title, value, description, icon: Icon, trend }) {
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
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                    <Icon size={21} strokeWidth={1.8} />
                </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2 text-xs">
                {trend && (
                    <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                        <TrendingUp size={13} />
                        {trend}
                    </span>
                )}
                <span className="text-slate-500">{description}</span>
            </div>
        </motion.div>
    );
}

function CourseDetailsModal({ course, onClose }) {
    if (!course) return null;

    const Icon = getCourseIcon(course.category);
    const theme = COURSE_THEMES[course.theme] || COURSE_THEMES.emerald;

    return (
        <AnimatePresence>
            <motion.div
                key="course-details-overlay"
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
                    aria-labelledby="course-modal-title"
                    initial={{ opacity: 0, y: 18, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 12, scale: 0.98 }}
                    transition={{ duration: 0.22 }}
                    className="my-auto w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl"
                >
                    <div className={`relative p-6 text-white sm:p-8 ${theme.hero}`}>
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close course details"
                            className="absolute right-4 top-4 z-10 rounded-xl p-2 text-white/80 transition hover:bg-white/15 hover:text-white"
                        >
                            <X size={20} />
                        </button>

                        <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold ring-1 ring-white/20">
                            <Icon size={14} />
                            {course.category}
                        </span>

                        <h2
                            id="course-modal-title"
                            className="mt-5 max-w-lg text-2xl font-bold leading-tight sm:text-3xl"
                        >
                            {course.title}
                        </h2>

                        <p className="mt-2 max-w-lg text-sm leading-6 text-white/85">
                            {course.description}
                        </p>

                        <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-white/90">
                            <span className="inline-flex items-center gap-1.5">
                                <Users size={15} />
                                {course.students} students
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <CirclePlay size={15} />
                                {course.lessons} lessons
                            </span>
                            <span className="inline-flex items-center gap-1.5">
                                <Clock3 size={15} />
                                {course.duration}
                            </span>
                        </div>
                    </div>

                    <div className="max-h-[60vh] overflow-y-auto p-6 sm:p-8">
                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <div>
                                <p className="text-sm text-slate-500">Course status</p>
                                <span
                                    className={`mt-2 inline-flex rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ${getStatusStyle(course.status)}`}
                                >
                                    {course.status}
                                </span>
                            </div>

                            <div>
                                <p className="text-sm text-slate-500">Course rating</p>
                                <p className="mt-2 flex items-center gap-1.5 font-semibold text-slate-900">
                                    <Star size={17} className="fill-amber-400 text-amber-400" />
                                    {course.rating ? course.rating.toFixed(1) : "Not rated"}
                                    <span className="text-sm font-normal text-slate-500">
                                        ({course.reviews} reviews)
                                    </span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-6">
                            <div className="flex items-center justify-between gap-3">
                                <h3 className="font-semibold text-slate-900">
                                    Content completion
                                </h3>
                                <span className={`text-sm font-bold ${theme.accent}`}>
                                    {course.progress}%
                                </span>
                            </div>

                            <div
                                className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100"
                                role="progressbar"
                                aria-label="Course completion"
                                aria-valuenow={course.progress}
                                aria-valuemin={0}
                                aria-valuemax={100}
                            >
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${course.progress}%` }}
                                    transition={{ duration: 0.7 }}
                                    className={`h-full rounded-full bg-gradient-to-r ${theme.progress}`}
                                />
                            </div>
                        </div>

                        <div className="mt-7">
                            <h3 className="font-semibold text-slate-900">Course modules</h3>
                            <div className="mt-3 grid gap-2 sm:grid-cols-2">
                                {course.modules.map((module, index) => (
                                    <div
                                        key={module}
                                        className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/70 p-3"
                                    >
                                        <span
                                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${theme.icon}`}
                                        >
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
                            <Link
                                to={`/trainer/courses/${course.id}/edit`}
                                onClick={onClose}
                                className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/15 transition hover:bg-emerald-700"
                            >
                                <Pencil size={16} />
                                Edit course
                                <ArrowUpRight size={15} />
                            </Link>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

export default function TrainerCoursesPage() {
    const [courses, setCourses] = useState(INITIAL_COURSES);
    const [searchQuery, setSearchQuery] = useState("");
    const [activeFilter, setActiveFilter] = useState("All Courses");
    const [categoryFilter, setCategoryFilter] = useState("All Categories");
    const [sortBy, setSortBy] = useState("recent");
    const [selectedCourse, setSelectedCourse] = useState(null);
    const [openMenuId, setOpenMenuId] = useState(null);
    const [notice, setNotice] = useState("");
    const [noticeKey, setNoticeKey] = useState(0);

    const menuRef = useRef(null);

    useEffect(() => {
        if (!notice) return undefined;

        const timeout = window.setTimeout(() => setNotice(""), 3200);
        return () => window.clearTimeout(timeout);
    }, [notice, noticeKey]);

    useEffect(() => {
        if (openMenuId === null) return undefined;

        const handleOutsideClick = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenMenuId(null);
            }
        };

        const handleEscape = (event) => {
            if (event.key === "Escape") setOpenMenuId(null);
        };

        document.addEventListener("pointerdown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("pointerdown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [openMenuId]);

    const publishedCount = courses.filter(
        (course) => course.status === "Published"
    ).length;

    const draftCount = courses.filter(
        (course) => course.status === "Draft"
    ).length;

    const totalStudents = courses.reduce(
        (total, course) => total + course.students,
        0
    );

    const totalRevenue = courses.reduce(
        (total, course) => total + course.revenue,
        0
    );

    const ratedCourses = courses.filter((course) => course.rating > 0);

    const ratingValue = ratedCourses.length
        ? (
            ratedCourses.reduce((total, course) => total + course.rating, 0) /
            ratedCourses.length
        ).toFixed(1)
        : "0.0";

    const categories = [
        "All Categories",
        ...new Set(courses.map((course) => course.category)),
    ];

    const filteredCourses = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        const result = courses.filter((course) => {
            const matchesSearch =
                !query ||
                course.title.toLowerCase().includes(query) ||
                course.subtitle.toLowerCase().includes(query) ||
                course.category.toLowerCase().includes(query);

            const matchesStatus =
                activeFilter === "All Courses" ||
                course.status === activeFilter;

            const matchesCategory =
                categoryFilter === "All Categories" ||
                course.category === categoryFilter;

            return matchesSearch && matchesStatus && matchesCategory;
        });

        return [...result].sort((a, b) => {
            if (sortBy === "students") return b.students - a.students;
            if (sortBy === "rating") return b.rating - a.rating;
            if (sortBy === "name") return a.title.localeCompare(b.title);
            if (sortBy === "progress") return b.progress - a.progress;
            return b.id - a.id;
        });
    }, [courses, searchQuery, activeFilter, categoryFilter, sortBy]);

    const showNotice = (message) => {
        setNotice(message);
        setNoticeKey((key) => key + 1);
    };

    const handleDelete = (course) => {
        const confirmed = window.confirm(
            `Are you sure you want to remove "${course.title}" from this demo?`
        );

        setOpenMenuId(null);

        if (!confirmed) return;

        setCourses((current) =>
            current.filter((item) => item.id !== course.id)
        );

        if (selectedCourse?.id === course.id) {
            setSelectedCourse(null);
        }

        showNotice("Course removed from the demo list.");
    };

    const handlePublishToggle = (course) => {
        const nextStatus =
            course.status === "Published" ? "Draft" : "Published";

        setCourses((current) =>
            current.map((item) =>
                item.id === course.id
                    ? { ...item, status: nextStatus }
                    : item
            )
        );

        setOpenMenuId(null);

        showNotice(
            nextStatus === "Published"
                ? "Course published in the demo."
                : "Course moved to drafts in the demo."
        );
    };

    const handleCreateCourse = () => {
        showNotice(
            "Connect this button to your course creation route to create real courses."
        );
    };

    const resetFilters = () => {
        setSearchQuery("");
        setActiveFilter("All Courses");
        setCategoryFilter("All Categories");
        setSortBy("recent");
    };

    const categoryOptions = categories.map((category) => ({
        value: category,
        label: category,
    }));

    const sortOptions = [
        { value: "recent", label: "Recently updated" },
        { value: "students", label: "Most students" },
        { value: "rating", label: "Top rated" },
        { value: "progress", label: "Course progress" },
        { value: "name", label: "Name A–Z" },
    ];

    return (
        <div className="min-h-screen bg-[#f6faf7] text-slate-900">
            <div className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
                {/* Header actions */}
                <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="flex flex-col justify-end gap-3 sm:flex-row sm:items-center"
                >
                    <Link
                        to="/trainer/schedule"
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                    >
                        <CalendarDays size={17} />
                        View schedule
                    </Link>

                    <button
                        type="button"
                        onClick={handleCreateCourse}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:-translate-y-0.5 hover:bg-emerald-700"
                    >
                        <Plus size={18} />
                        Create course
                    </button>
                </motion.div>

                {/* Overview cards */}
                <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.08 }}
                    className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
                >
                    <StatCard
                        title="Total courses"
                        value={courses.length}
                        description={`${publishedCount} published · ${draftCount} drafts`}
                        icon={BookOpen}
                        trend="Course library"
                    />
                    <StatCard
                        title="Total students"
                        value={totalStudents.toLocaleString("en-IN")}
                        description="Across all your courses"
                        icon={Users}
                        trend="Learner audience"
                    />
                    <StatCard
                        title="Average rating"
                        value={ratingValue}
                        description="Based on rated courses"
                        icon={Star}
                        trend="Learner feedback"
                    />
                    <StatCard
                        title="Course revenue"
                        value={formatCurrency(totalRevenue)}
                        description="Illustrative demo total"
                        icon={ChartNoAxesCombined}
                        trend="Demo analytics"
                    />
                </motion.div>

                {/* Performance banner */}
                <motion.section
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.14 }}
                    className="mt-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-emerald-800 to-green-700 p-5 text-white sm:p-6"
                >
                    <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
                                <Target size={23} />
                            </div>
                            <div>
                                <p className="text-lg font-bold">
                                    Course performance
                                </p>
                                <p className="mt-1 max-w-2xl text-sm leading-6 text-emerald-50">
                                    Review your course portfolio, monitor progress and keep your
                                    learning content up to date.
                                </p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6 border-t border-white/15 pt-4 md:border-l md:border-t-0 md:pl-7 md:pt-0">
                            <div>
                                <p className="text-2xl font-bold">{publishedCount}</p>
                                <p className="mt-1 text-xs text-emerald-100">
                                    Published courses
                                </p>
                            </div>
                            <div>
                                <p className="text-2xl font-bold">
                                    {courses.filter((course) => course.progress === 100).length}
                                </p>
                                <p className="mt-1 text-xs text-emerald-100">
                                    Fully completed
                                </p>
                            </div>
                        </div>
                    </div>
                </motion.section>

                {/* Course library */}
                <section className="mt-8">
                    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
                        <div>
                            <h2 className="text-xl font-bold tracking-tight text-slate-900">
                                Course library
                            </h2>
                            <p className="mt-1 text-sm text-slate-500">
                                Find, review and manage your learning programs.
                            </p>
                        </div>

                        <span className="inline-flex w-fit items-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-slate-600 ring-1 ring-slate-200">
                            <Layers3 size={16} className="text-emerald-700" />
                            {filteredCourses.length}{" "}
                            {filteredCourses.length === 1 ? "course" : "courses"} found
                        </span>
                    </div>

                    {/* Search and filters */}
                    <div className="relative z-20 mt-5 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
                        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
                            <div className="relative w-full xl:max-w-md">
                                <Search
                                    size={18}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                                />
                                <input
                                    type="search"
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search courses or categories..."
                                    aria-label="Search courses"
                                    className="w-full rounded-xl border border-slate-200 bg-slate-50/70 py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-4 focus:ring-emerald-500/10"
                                />
                            </div>

                            <div className="flex min-w-0 flex-col gap-3 sm:flex-row sm:items-center">
                                <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl bg-slate-100 p-1">
                                    {FILTERS.map((filter) => (
                                        <button
                                            type="button"
                                            key={filter}
                                            onClick={() => setActiveFilter(filter)}
                                            className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition sm:text-sm ${activeFilter === filter
                                                ? "bg-white text-emerald-800 shadow-sm"
                                                : "text-slate-500 hover:text-slate-800"
                                                }`}
                                        >
                                            {filter}
                                        </button>
                                    ))}
                                </div>

                                <div className="grid min-w-0 grid-cols-1 gap-2 sm:grid-cols-2">
                                    <PremiumDropdown
                                        value={categoryFilter}
                                        options={categoryOptions}
                                        onChange={setCategoryFilter}
                                        label="Filter by category"
                                        icon={SlidersHorizontal}
                                        width="w-full sm:w-48"
                                    />
                                    <PremiumDropdown
                                        value={sortBy}
                                        options={sortOptions}
                                        onChange={setSortBy}
                                        label="Sort courses"
                                        width="w-full sm:w-48"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Course cards: no grid layout animation to prevent jumps */}
                    <div className="relative z-0 mt-5 grid items-stretch gap-5 md:grid-cols-2 2xl:grid-cols-3">
                        <AnimatePresence mode="sync">
                            {filteredCourses.map((course, index) => {
                                const theme =
                                    COURSE_THEMES[course.theme] || COURSE_THEMES.emerald;
                                const Icon = getCourseIcon(course.category);

                                return (
                                    <motion.article
                                        key={course.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: 8 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: Math.min(index * 0.025, 0.1),
                                        }}
                                        className={`relative flex min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl ${theme.border} ${theme.glow}`}
                                    >
                                        {/* Coloured course header */}
                                        <div
                                            className={`relative m-3 mb-0 rounded-xl p-5 text-white sm:p-6 ${theme.hero}`}
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-xs font-semibold text-white ring-1 ring-white/15">
                                                    <Icon size={13} />
                                                    {course.category}
                                                </span>

                                                <div
                                                    ref={openMenuId === course.id ? menuRef : null}
                                                    className="relative shrink-0"
                                                    onClick={(event) => event.stopPropagation()}
                                                >
                                                    <button
                                                        type="button"
                                                        aria-label={`More actions for ${course.title}`}
                                                        aria-expanded={openMenuId === course.id}
                                                        onClick={() =>
                                                            setOpenMenuId((current) =>
                                                                current === course.id ? null : course.id
                                                            )
                                                        }
                                                        className="rounded-lg p-2 text-white/90 transition hover:bg-white/15 focus:outline-none focus:ring-2 focus:ring-white/70"
                                                    >
                                                        <MoreVertical size={18} />
                                                    </button>

                                                    <AnimatePresence>
                                                        {openMenuId === course.id && (
                                                            <motion.div
                                                                initial={{ opacity: 0, y: 5, scale: 0.98 }}
                                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                                exit={{ opacity: 0, y: 5, scale: 0.98 }}
                                                                transition={{ duration: 0.14 }}
                                                                className="absolute right-0 top-11 z-[100] w-52 rounded-xl border border-slate-200 bg-white p-1.5 text-slate-700 shadow-2xl shadow-slate-950/15"
                                                            >
                                                                <button
                                                                    type="button"
                                                                    onClick={() => {
                                                                        setSelectedCourse(course);
                                                                        setOpenMenuId(null);
                                                                    }}
                                                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-emerald-50 hover:text-emerald-800"
                                                                >
                                                                    <Eye size={15} />
                                                                    View details
                                                                </button>

                                                                <Link
                                                                    to={`/trainer/courses/${course.id}/edit`}
                                                                    onClick={() => setOpenMenuId(null)}
                                                                    className="flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm transition hover:bg-emerald-50 hover:text-emerald-800"
                                                                >
                                                                    <Pencil size={15} />
                                                                    Edit course
                                                                </Link>

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handlePublishToggle(course)}
                                                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm transition hover:bg-emerald-50 hover:text-emerald-800"
                                                                >
                                                                    {course.status === "Published" ? (
                                                                        <FileText size={15} />
                                                                    ) : (
                                                                        <CircleCheck size={15} />
                                                                    )}
                                                                    {course.status === "Published"
                                                                        ? "Move to draft"
                                                                        : "Publish course"}
                                                                </button>

                                                                <div className="my-1 border-t border-slate-100" />

                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleDelete(course)}
                                                                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2.5 text-left text-sm text-red-600 transition hover:bg-red-50"
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
                                                        {course.level}
                                                    </span>
                                                    <h3 className="mt-3 line-clamp-2 text-xl font-bold leading-snug tracking-tight sm:text-2xl">
                                                        {course.title}
                                                    </h3>
                                                    <p className="mt-2 line-clamp-2 text-sm leading-5 text-white/85">
                                                        {course.subtitle}
                                                    </p>
                                                </div>

                                                <div className="hidden h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-white/10 ring-1 ring-white/20 sm:flex">
                                                    <Icon size={26} />
                                                </div>
                                            </div>

                                            <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-white/15 pt-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${course.status === "Published"
                                                        ? "bg-white text-emerald-800"
                                                        : "bg-amber-100 text-amber-800"
                                                        }`}
                                                >
                                                    <span
                                                        className={`h-1.5 w-1.5 rounded-full ${course.status === "Published"
                                                            ? "bg-emerald-500"
                                                            : "bg-amber-500"
                                                            }`}
                                                    />
                                                    {course.status}
                                                </span>
                                                <span className="text-xs text-white/85">
                                                    Updated {course.updatedAt}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Course metrics */}
                                        <div className="flex flex-1 flex-col p-4 sm:p-5">
                                            <div className="grid grid-cols-3 divide-x divide-slate-100 rounded-xl bg-slate-50/80 py-3">
                                                <div className="px-2 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 text-slate-500">
                                                        <Users size={15} />
                                                        <span className="text-xs">Students</span>
                                                    </div>
                                                    <p className="mt-1.5 text-lg font-bold text-slate-900">
                                                        {course.students.toLocaleString("en-IN")}
                                                    </p>
                                                </div>

                                                <div className="px-2 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 text-slate-500">
                                                        <Star size={14} className="fill-amber-400 text-amber-400" />
                                                        <span className="text-xs">Rating</span>
                                                    </div>
                                                    <p className="mt-1.5 text-lg font-bold text-slate-900">
                                                        {course.rating ? course.rating.toFixed(1) : "—"}
                                                    </p>
                                                </div>

                                                <div className="px-2 text-center">
                                                    <div className="flex items-center justify-center gap-1.5 text-slate-500">
                                                        <CirclePlay size={15} />
                                                        <span className="text-xs">Lessons</span>
                                                    </div>
                                                    <p className="mt-1.5 text-lg font-bold text-slate-900">
                                                        {course.lessons}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="mt-5">
                                                <div className="flex items-center justify-between gap-3">
                                                    <span className="text-sm font-medium text-slate-600">
                                                        Content completion
                                                    </span>
                                                    <span className={`text-sm font-bold ${theme.accent}`}>
                                                        {course.progress}%
                                                    </span>
                                                </div>

                                                <div
                                                    className="mt-2.5 h-2 overflow-hidden rounded-full bg-slate-100"
                                                    role="progressbar"
                                                    aria-label={`${course.title} completion`}
                                                    aria-valuenow={course.progress}
                                                    aria-valuemin={0}
                                                    aria-valuemax={100}
                                                >
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${course.progress}%` }}
                                                        transition={{ duration: 0.65 }}
                                                        className={`h-full rounded-full bg-gradient-to-r ${theme.progress}`}
                                                    />
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                                                <span className="inline-flex items-center gap-1.5">
                                                    <Clock3 size={14} />
                                                    {course.duration}
                                                </span>
                                                <span className="inline-flex items-center gap-1.5">
                                                    <FileText size={14} />
                                                    {course.reviews} reviews
                                                </span>
                                            </div>

                                            <div className="mt-5 flex gap-2 border-t border-slate-100 pt-4">
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedCourse(course)}
                                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                                                >
                                                    <Eye size={16} />
                                                    Details
                                                </button>

                                                <Link
                                                    to={`/trainer/courses/${course.id}/edit`}
                                                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-600 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700"
                                                >
                                                    <Pencil size={15} />
                                                    Manage
                                                    <ExternalLink size={13} />
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.article>
                                );
                            })}
                        </AnimatePresence>
                    </div>

                    {/* Empty state */}
                    {filteredCourses.length === 0 && (
                        <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
                            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                                <Search size={24} />
                            </div>
                            <h3 className="mt-4 text-lg font-bold text-slate-900">
                                No courses found
                            </h3>
                            <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                                Try changing your search term or filters to find the course you
                                are looking for.
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

                {/* Footer */}
                <div className="mt-8 flex flex-col gap-2 border-t border-slate-200 pt-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
                    <p className="inline-flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-emerald-600" />
                        Course workspace
                    </p>
                    <p>Demo data is shown until connected to your backend API.</p>
                </div>
            </div>

            {/* Toast notification */}
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
                            <CircleCheck size={18} />
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

            {/* Course details modal */}
            <CourseDetailsModal
                course={selectedCourse}
                onClose={() => setSelectedCourse(null)}
            />
        </div>
    );
}
