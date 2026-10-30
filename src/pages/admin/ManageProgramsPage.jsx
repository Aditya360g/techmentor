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
    Archive,
    ArrowRight,
    BookOpen,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Download,
    FileSpreadsheet,
    Filter,
    GraduationCap,
    Layers3,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    SlidersHorizontal,
    Sparkles,
    Users,
    X,
} from "lucide-react";

/* =====================================================
   PREMIUM ORANGE / WHITE THEME
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
    muted: "#686868",

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
   PROGRAM OPTIONS
===================================================== */

const PROGRAM_CATEGORIES = [
    "Web Development",
    "AI & Data Science",
    "Programming",
    "Cloud & DevOps",
    "Design",
    "Cybersecurity",
    "Business & Management",
];

const LEVEL_OPTIONS = [
    { label: "Beginner", value: "Beginner" },
    { label: "Intermediate", value: "Intermediate" },
    { label: "Advanced", value: "Advanced" },
    { label: "All Levels", value: "All Levels" },
];

const STATUS_OPTIONS = [
    { label: "All statuses", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Draft", value: "Draft" },
    { label: "Archived", value: "Archived" },
];

const CATEGORY_OPTIONS = [
    { label: "All categories", value: "all" },
    ...PROGRAM_CATEGORIES.map((category) => ({
        label: category,
        value: category,
    })),
];

const SORT_OPTIONS = [
    { label: "Newest programs", value: "newest" },
    { label: "Oldest programs", value: "oldest" },
    { label: "Name A to Z", value: "name" },
    { label: "Most enrollments", value: "enrollments" },
    { label: "Highest completion", value: "completion" },
];

/* =====================================================
   DEMO PROGRAM DATA

   Frontend demo data.
   Connect your backend API for persistent records.
===================================================== */

const initialPrograms = [
    {
        id: "PRG-1001",
        code: "FSD-101",
        name: "Full Stack Development",
        category: "Web Development",
        level: "Advanced",
        duration: 24,
        price: 12999,
        capacity: 500,
        students: 420,
        completionRate: 84,
        status: "Active",
        createdAt: "2026-10-20",
        description:
            "Frontend, backend, database and full-stack application development.",
    },
    {
        id: "PRG-1002",
        code: "AIML-201",
        name: "Python AI / ML",
        category: "AI & Data Science",
        level: "Intermediate",
        duration: 20,
        price: 14999,
        capacity: 450,
        students: 368,
        completionRate: 78,
        status: "Active",
        createdAt: "2026-10-16",
        description:
            "Python programming, machine learning fundamentals and applied AI projects.",
    },
    {
        id: "PRG-1003",
        code: "JDSA-301",
        name: "Java and DSA",
        category: "Programming",
        level: "Intermediate",
        duration: 16,
        price: 8999,
        capacity: 400,
        students: 312,
        completionRate: 72,
        status: "Active",
        createdAt: "2026-10-12",
        description:
            "Java programming, data structures, algorithms and interview preparation.",
    },
    {
        id: "PRG-1004",
        code: "DS-401",
        name: "Data Science",
        category: "AI & Data Science",
        level: "Advanced",
        duration: 22,
        price: 15999,
        capacity: 350,
        students: 276,
        completionRate: 81,
        status: "Active",
        createdAt: "2026-10-09",
        description:
            "Data analysis, statistics, data visualization and applied machine learning.",
    },
    {
        id: "PRG-1005",
        code: "CLD-501",
        name: "Cloud Computing",
        category: "Cloud & DevOps",
        level: "Intermediate",
        duration: 14,
        price: 10999,
        capacity: 300,
        students: 218,
        completionRate: 67,
        status: "Active",
        createdAt: "2026-10-06",
        description:
            "Cloud infrastructure, deployment workflows and modern DevOps foundations.",
    },
    {
        id: "PRG-1006",
        code: "UIUX-601",
        name: "UI / UX Design",
        category: "Design",
        level: "Beginner",
        duration: 12,
        price: 6999,
        capacity: 250,
        students: 146,
        completionRate: 63,
        status: "Draft",
        createdAt: "2026-10-03",
        description:
            "User research, interface design, prototyping and usability fundamentals.",
    },
    {
        id: "PRG-1007",
        code: "SEC-701",
        name: "Cybersecurity Essentials",
        category: "Cybersecurity",
        level: "Beginner",
        duration: 12,
        price: 7999,
        capacity: 250,
        students: 0,
        completionRate: 0,
        status: "Draft",
        createdAt: "2026-09-28",
        description:
            "Security fundamentals, safe computing practices and introductory network security.",
    },
    {
        id: "PRG-1008",
        code: "BIZ-801",
        name: "Business Analytics",
        category: "Business & Management",
        level: "Beginner",
        duration: 10,
        price: 5999,
        capacity: 200,
        students: 84,
        completionRate: 48,
        status: "Archived",
        createdAt: "2026-09-22",
        description:
            "Business metrics, data interpretation and evidence-based decision making.",
    },
];

/* =====================================================
   HELPERS
===================================================== */

function formatNumber(value) {
    return new Intl.NumberFormat("en-IN").format(value || 0);
}

function formatCurrency(value) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0,
    }).format(value || 0);
}

function formatCompactNumber(value) {
    if (value >= 100000) {
        return `${(value / 100000).toFixed(1)}L`;
    }

    if (value >= 1000) {
        return `${(value / 1000).toFixed(1)}k`;
    }

    return formatNumber(value);
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

/* =====================================================
   PREMIUM DROPDOWN

   Outside click, Escape key, smooth animation,
   visible text and hidden scrollbar.
===================================================== */

function PremiumDropdown({
    value,
    onChange,
    options,
    ariaLabel,
    icon: Icon,
    minWidth = 165,
    align = "left",
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef(null);

    const selectedOption =
        options.find((option) => option.value === value) || options[0];

    useEffect(() => {
        if (!open) return undefined;

        const handleOutside = (event) => {
            if (
                rootRef.current &&
                !rootRef.current.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleKeyboard = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
            }
        };

        document.addEventListener("pointerdown", handleOutside);
        document.addEventListener("keydown", handleKeyboard);

        return () => {
            document.removeEventListener("pointerdown", handleOutside);
            document.removeEventListener("keydown", handleKeyboard);
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
                className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 text-left shadow-sm outline-none transition-colors duration-200 hover:border-[#F2B3A3] focus-visible:ring-4 focus-visible:ring-orange-100"
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
                        className={`absolute top-[calc(100%+8px)] z-[90] overflow-hidden rounded-xl border border-[#E8E8E8] bg-white p-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.13)] ${align === "right" ? "right-0" : "left-0"
                            }`}
                        style={{
                            width: "max-content",
                            minWidth: Math.max(minWidth, 185),
                            maxWidth: "min(300px, calc(100vw - 32px))",
                        }}
                    >
                        <div className="programs-dropdown-scroll max-h-[280px] overflow-y-auto overscroll-contain">
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
                                        className="flex min-h-[42px] w-full items-center justify-between gap-4 rounded-lg px-3.5 text-left transition-colors duration-150"
                                        style={{
                                            color: selected
                                                ? COLORS.orangeDark
                                                : COLORS.black,
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
                                                size={15}
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
   SECTION HEADING
===================================================== */

function SectionHeading({
    title,
    subtitle,
    icon: Icon,
    children,
}) {
    return (
        <div className="flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
                {Icon && (
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                        <Icon size={20} />
                    </span>
                )}

                <div className="min-w-0">
                    <h2 className="text-[16px] font-extrabold text-[#252525]">
                        {title}
                    </h2>

                    {subtitle && (
                        <p className="mt-1.5 text-[12px] font-semibold leading-5 text-[#454545]">
                            {subtitle}
                        </p>
                    )}
                </div>
            </div>

            {children && (
                <div className="shrink-0">{children}</div>
            )}
        </div>
    );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function ProgramStatusBadge({ status }) {
    const configs = {
        Active: {
            color: "#17683D",
            background: COLORS.greenLight,
            icon: CheckCircle2,
        },

        Draft: {
            color: "#855A0B",
            background: COLORS.yellowLight,
            icon: Clock3,
        },

        Archived: {
            color: "#B52D2D",
            background: COLORS.redLight,
            icon: Archive,
        },
    };

    const config = configs[status] || configs.Draft;
    const Icon = config.icon;

    return (
        <span
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1.5 text-[11px] font-extrabold"
            style={{
                color: config.color,
                backgroundColor: config.background,
            }}
        >
            <Icon size={12} />
            {status}
        </span>
    );
}

/* =====================================================
   STAT CARD
===================================================== */

function ProgramStatCard({
    title,
    value,
    detail,
    icon: Icon,
    color,
    bg,
    index,
}) {
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
            className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.055)]"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-[12px] font-bold text-[#454545]">
                        {title}
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
                        {formatNumber(value)}
                    </motion.p>
                </div>

                <motion.span
                    whileHover={{ rotate: 5, scale: 1.06 }}
                    transition={{ duration: 0.2 }}
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                        color,
                        backgroundColor: bg,
                    }}
                >
                    <Icon size={21} strokeWidth={1.9} />
                </motion.span>
            </div>

            <p className="mt-4 border-t border-[#EEEEEE] pt-3 text-[11px] font-semibold text-[#454545]">
                {detail}
            </p>
        </motion.article>
    );
}

/* =====================================================
   CHART TOOLTIP
===================================================== */

function ProgramChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;

    return (
        <div className="min-w-[175px] rounded-xl border border-[#E8E8E8] bg-white p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
            <p className="mb-2 text-[12px] font-extrabold leading-5 text-[#252525]">
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
                            style={{
                                backgroundColor: item.color || COLORS.orange,
                            }}
                        />

                        {item.name}
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
   PROGRAM MODAL
===================================================== */

function ProgramModal({
    open,
    program,
    onClose,
    onSave,
}) {
    const [form, setForm] = useState({
        name: "",
        code: "",
        category: PROGRAM_CATEGORIES[0],
        level: "Beginner",
        duration: "12",
        price: "0",
        capacity: "100",
        description: "",
    });

    const [error, setError] = useState("");

    useEffect(() => {
        if (!open) return;

        setError("");

        if (program) {
            setForm({
                name: program.name || "",
                code: program.code || "",
                category: program.category || PROGRAM_CATEGORIES[0],
                level: program.level || "Beginner",
                duration: String(program.duration ?? 12),
                price: String(program.price ?? 0),
                capacity: String(program.capacity ?? 100),
                description: program.description || "",
            });
        } else {
            setForm({
                name: "",
                code: "",
                category: PROGRAM_CATEGORIES[0],
                level: "Beginner",
                duration: "12",
                price: "0",
                capacity: "100",
                description: "",
            });
        }
    }, [open, program]);

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

    const updateField = (event) => {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setError("");

        const name = form.name.trim();
        const code = form.code.trim();

        if (!name || !code || !form.description.trim()) {
            setError("Please fill in the required fields.");
            return;
        }

        const duration = Number(form.duration);
        const price = Number(form.price);
        const capacity = Number(form.capacity);

        if (!Number.isFinite(duration) || duration < 1) {
            setError("Duration must be at least 1 week.");
            return;
        }

        if (!Number.isFinite(price) || price < 0) {
            setError("Enter a valid non-negative price.");
            return;
        }

        if (!Number.isFinite(capacity) || capacity < 1) {
            setError("Capacity must be at least 1 student.");
            return;
        }

        const success = onSave({
            name,
            code,
            category: form.category,
            level: form.level,
            duration,
            price,
            capacity,
            description: form.description.trim(),
        });

        if (success) onClose();
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) {
                            onClose();
                        }
                    }}
                    className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[3px]"
                >
                    <motion.div
                        initial={{ opacity: 0, y: 18, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 12, scale: 0.98 }}
                        transition={{ duration: 0.23 }}
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="program-modal-title"
                        className="my-auto w-full max-w-[700px] overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-[0_25px_80px_rgba(0,0,0,0.2)]"
                    >
                        {/* MODAL HEADER */}

                        <div className="flex items-start justify-between gap-4 border-b border-[#EEEEEE] px-5 py-5 sm:px-6">
                            <div>
                                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                                    <BookOpen size={21} />
                                </span>

                                <h2
                                    id="program-modal-title"
                                    className="mt-3 text-xl font-extrabold text-[#252525]"
                                >
                                    {program ? "Edit Program" : "Create New Program"}
                                </h2>

                                <p className="mt-1 text-[12px] font-semibold text-[#454545]">
                                    Configure program details, pricing and capacity.
                                </p>
                            </div>

                            <button
                                type="button"
                                onClick={onClose}
                                aria-label="Close program form"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#E8E8E8] text-[#252525] transition-colors hover:bg-[#F5F5F5]"
                            >
                                <X size={17} />
                            </button>
                        </div>

                        {/* MODAL FORM */}

                        <form onSubmit={handleSubmit}>
                            <div className="grid max-h-[65vh] grid-cols-1 gap-4 overflow-y-auto p-5 sm:grid-cols-2 sm:p-6">
                                {/* PROGRAM NAME */}

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="program-name"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Program name *
                                    </label>

                                    <input
                                        id="program-name"
                                        name="name"
                                        value={form.name}
                                        onChange={updateField}
                                        placeholder="e.g. Full Stack Development"
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold text-[#111111] outline-none transition placeholder:text-[#686868] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                {/* PROGRAM CODE */}

                                <div>
                                    <label
                                        htmlFor="program-code"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Program code *
                                    </label>

                                    <input
                                        id="program-code"
                                        name="code"
                                        value={form.code}
                                        onChange={updateField}
                                        placeholder="e.g. FSD-101"
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold uppercase text-[#111111] outline-none transition placeholder:normal-case placeholder:text-[#686868] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                {/* CATEGORY */}

                                <div>
                                    <label
                                        htmlFor="program-category"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Category *
                                    </label>

                                    <select
                                        id="program-category"
                                        name="category"
                                        value={form.category}
                                        onChange={updateField}
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3 text-[12px] font-bold text-[#111111] outline-none focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    >
                                        {PROGRAM_CATEGORIES.map((category) => (
                                            <option key={category} value={category}>
                                                {category}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* LEVEL */}

                                <div>
                                    <label
                                        htmlFor="program-level"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Difficulty level *
                                    </label>

                                    <select
                                        id="program-level"
                                        name="level"
                                        value={form.level}
                                        onChange={updateField}
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3 text-[12px] font-bold text-[#111111] outline-none focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    >
                                        {LEVEL_OPTIONS.map((option) => (
                                            <option key={option.value} value={option.value}>
                                                {option.label}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                {/* DURATION */}

                                <div>
                                    <label
                                        htmlFor="program-duration"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Duration in weeks *
                                    </label>

                                    <input
                                        id="program-duration"
                                        name="duration"
                                        type="number"
                                        min="1"
                                        max="520"
                                        value={form.duration}
                                        onChange={updateField}
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold text-[#111111] outline-none focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                {/* PRICE */}

                                <div>
                                    <label
                                        htmlFor="program-price"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Price in INR *
                                    </label>

                                    <input
                                        id="program-price"
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="1"
                                        value={form.price}
                                        onChange={updateField}
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold text-[#111111] outline-none focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                {/* CAPACITY */}

                                <div>
                                    <label
                                        htmlFor="program-capacity"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Student capacity *
                                    </label>

                                    <input
                                        id="program-capacity"
                                        name="capacity"
                                        type="number"
                                        min="1"
                                        step="1"
                                        value={form.capacity}
                                        onChange={updateField}
                                        required
                                        className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold text-[#111111] outline-none focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                {/* DESCRIPTION */}

                                <div className="sm:col-span-2">
                                    <label
                                        htmlFor="program-description"
                                        className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                                    >
                                        Program description *
                                    </label>

                                    <textarea
                                        id="program-description"
                                        name="description"
                                        rows={3}
                                        value={form.description}
                                        onChange={updateField}
                                        placeholder="Describe what students will learn..."
                                        required
                                        className="w-full resize-y rounded-xl border border-[#E8E8E8] bg-white px-3.5 py-3 text-[13px] font-semibold text-[#111111] outline-none transition placeholder:text-[#686868] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                    />
                                </div>

                                {error && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -4 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        role="alert"
                                        className="text-[12px] font-extrabold text-[#B52D2D] sm:col-span-2"
                                    >
                                        {error}
                                    </motion.p>
                                )}

                                <div className="rounded-xl border border-[#F4D5CB] bg-[#FFF8F5] p-3 sm:col-span-2">
                                    <p className="text-[11px] font-semibold leading-5 text-[#454545]">
                                        New programs start as drafts. They can be activated
                                        after the program details have been reviewed.
                                    </p>
                                </div>
                            </div>

                            {/* MODAL FOOTER */}

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
                                    <Check size={16} />
                                    {program ? "Save Changes" : "Create Program"}
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
   CSV EXPORT
===================================================== */

function downloadProgramsCSV(programs) {
    const headers = [
        "Program ID",
        "Program Code",
        "Program Name",
        "Category",
        "Level",
        "Duration Weeks",
        "Price INR",
        "Student Capacity",
        "Enrolled Students",
        "Completion Rate",
        "Status",
        "Created Date",
        "Description",
    ];

    const escapeCSV = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const content = [
        headers.map(escapeCSV).join(","),

        ...programs.map((program) =>
            [
                program.id,
                program.code,
                program.name,
                program.category,
                program.level,
                program.duration,
                program.price,
                program.capacity,
                program.students,
                `${program.completionRate}%`,
                program.status,
                program.createdAt,
                program.description,
            ]
                .map(escapeCSV)
                .join(",")
        ),
    ].join("\r\n");

    const blob = new Blob(["\uFEFF", content], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "codefaculty-programs.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

/* =====================================================
   MAIN PAGE
===================================================== */

export default function ManageProgramsPage() {
    const [programs, setPrograms] = useState(initialPrograms);

    const [searchQuery, setSearchQuery] = useState("");
    const [categoryFilter, setCategoryFilter] = useState("all");
    const [statusFilter, setStatusFilter] = useState("all");
    const [sortBy, setSortBy] = useState("newest");

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(6);

    const [modalOpen, setModalOpen] = useState(false);
    const [editingProgram, setEditingProgram] = useState(null);
    const [notice, setNotice] = useState("");

    /* ===================================================
       SUMMARY METRICS
    =================================================== */

    const summary = useMemo(() => {
        const totalPrograms = programs.length;

        const activePrograms = programs.filter(
            (program) => program.status === "Active"
        ).length;

        const draftPrograms = programs.filter(
            (program) => program.status === "Draft"
        ).length;

        const totalStudents = programs.reduce(
            (total, program) => total + program.students,
            0
        );

        const totalCapacity = programs.reduce(
            (total, program) => total + program.capacity,
            0
        );

        const averageCompletion = activePrograms
            ? Math.round(
                programs
                    .filter((program) => program.status === "Active")
                    .reduce(
                        (total, program) => total + program.completionRate,
                        0
                    ) / activePrograms
            )
            : 0;

        return {
            totalPrograms,
            activePrograms,
            draftPrograms,
            totalStudents,
            totalCapacity,
            averageCompletion,
        };
    }, [programs]);

    /* ===================================================
       SEARCH, FILTER AND SORT
    =================================================== */

    const filteredPrograms = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        let rows = programs.filter((program) => {
            const matchesSearch =
                !query ||
                [
                    program.id,
                    program.code,
                    program.name,
                    program.category,
                    program.level,
                    program.status,
                    program.description,
                ].some((value) =>
                    String(value ?? "").toLowerCase().includes(query)
                );

            const matchesCategory =
                categoryFilter === "all" ||
                program.category === categoryFilter;

            const matchesStatus =
                statusFilter === "all" ||
                program.status === statusFilter;

            return matchesSearch && matchesCategory && matchesStatus;
        });

        if (sortBy === "newest") {
            rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
        } else if (sortBy === "oldest") {
            rows.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
        } else if (sortBy === "name") {
            rows.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sortBy === "enrollments") {
            rows.sort((a, b) => b.students - a.students);
        } else if (sortBy === "completion") {
            rows.sort((a, b) => b.completionRate - a.completionRate);
        }

        return rows;
    }, [
        programs,
        searchQuery,
        categoryFilter,
        statusFilter,
        sortBy,
    ]);

    /* ===================================================
       PAGINATION
    =================================================== */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredPrograms.length / pageSize)
    );

    const visiblePrograms = useMemo(() => {
        const start = (currentPage - 1) * pageSize;

        return filteredPrograms.slice(start, start + pageSize);
    }, [filteredPrograms, currentPage, pageSize]);

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    /* ===================================================
       CHART DATA
    =================================================== */

    const chartData = useMemo(() => {
        return [...programs]
            .filter((program) => program.status !== "Archived")
            .sort((a, b) => b.students - a.students)
            .slice(0, 6)
            .map((program) => ({
                name: program.name,
                students: program.students,
                capacity: program.capacity,
            }));
    }, [programs]);

    const enrollmentTotal = programs.reduce(
        (total, program) =>
            total +
            (program.status === "Archived" ? 0 : program.students),
        0
    );

    /* ===================================================
       CREATE / EDIT MODAL
    =================================================== */

    const openCreateModal = () => {
        setEditingProgram(null);
        setNotice("");
        setModalOpen(true);
    };

    const openEditModal = (program) => {
        setEditingProgram(program);
        setNotice("");
        setModalOpen(true);
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingProgram(null);
    };

    /* ===================================================
       SAVE PROGRAM
    =================================================== */

    const handleSaveProgram = (form) => {
        const duplicateName = programs.some(
            (program) =>
                program.name.toLowerCase() === form.name.toLowerCase() &&
                program.id !== editingProgram?.id
        );

        const duplicateCode = programs.some(
            (program) =>
                program.code.toLowerCase() === form.code.toLowerCase() &&
                program.id !== editingProgram?.id
        );

        if (duplicateName) {
            setNotice("A program with this name already exists.");
            return false;
        }

        if (duplicateCode) {
            setNotice("A program with this code already exists.");
            return false;
        }

        if (editingProgram) {
            setPrograms((current) =>
                current.map((program) =>
                    program.id === editingProgram.id
                        ? {
                            ...program,
                            ...form,
                        }
                        : program
                )
            );

            setNotice(`${form.name} updated successfully.`);
            return true;
        }

        const newProgram = {
            id: `PRG-${String(Date.now()).slice(-6)}`,
            ...form,
            students: 0,
            completionRate: 0,
            status: "Draft",
            createdAt: getToday(),
        };

        setPrograms((current) => [newProgram, ...current]);

        setSearchQuery("");
        setCategoryFilter("all");
        setStatusFilter("all");
        setSortBy("newest");
        setCurrentPage(1);

        setNotice(`${form.name} created as a draft.`);
        return true;
    };

    /* ===================================================
       PROGRAM STATUS
    =================================================== */

    const handleToggleStatus = (program) => {
        const nextStatus =
            program.status === "Active" ? "Draft" : "Active";

        setPrograms((current) =>
            current.map((item) =>
                item.id === program.id
                    ? { ...item, status: nextStatus }
                    : item
            )
        );

        setNotice(
            `${program.name} status changed to ${nextStatus.toLowerCase()}.`
        );
    };

    const handleArchiveProgram = (program) => {
        const nextStatus =
            program.status === "Archived" ? "Draft" : "Archived";

        setPrograms((current) =>
            current.map((item) =>
                item.id === program.id
                    ? { ...item, status: nextStatus }
                    : item
            )
        );

        setNotice(
            `${program.name} ${nextStatus === "Archived" ? "archived" : "restored as a draft"
            }.`
        );
    };

    /* ===================================================
       RESET FILTERS
    =================================================== */

    const resetFilters = () => {
        setSearchQuery("");
        setCategoryFilter("all");
        setStatusFilter("all");
        setSortBy("newest");
        setCurrentPage(1);
    };

    /* ===================================================
       CSV EXPORT
    =================================================== */

    const handleExport = () => {
        downloadProgramsCSV(filteredPrograms);

        setNotice(
            `${filteredPrograms.length} program records exported successfully.`
        );
    };

    return (
        <div className="programs-page space-y-6 pb-8 text-[#252525]">
            <style>{`
        .programs-dropdown-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .programs-dropdown-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .programs-page input,
        .programs-page select,
        .programs-page textarea {
          color: #111111;
          -webkit-text-fill-color: #111111;
        }

        .programs-page input::placeholder,
        .programs-page textarea::placeholder {
          color: #686868;
          -webkit-text-fill-color: #686868;
          opacity: 1;
          font-weight: 600;
        }

        .programs-page .recharts-cartesian-axis-tick-value {
          fill: #454545;
          font-size: 12px;
          font-weight: 700;
        }

        .programs-page .recharts-cartesian-grid-horizontal line {
          stroke: #E8E8E8;
        }

        .programs-page .recharts-surface {
          outline: none;
        }

        @media (prefers-reduced-motion: reduce) {
          .programs-page *,
          .programs-page *::before,
          .programs-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

            {/* =================================================
          PAGE HEADER
      ================================================= */}

            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
                className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
            >
                <div className="min-w-0">
                    <div className="mb-2 flex items-center gap-2">
                        <Sparkles
                            size={14}
                            className="text-[#F4512B]"
                        />

                        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#D9411F]">
                            ACADEMIC MANAGEMENT
                        </span>
                    </div>

                    <h1 className="text-[30px] font-extrabold leading-tight tracking-[-1px] text-[#252525] sm:text-[35px]">
                        Programs & Courses
                    </h1>

                    <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-6 text-[#454545]">
                        Create programs, manage course offerings, monitor enrollments
                        and maintain academic catalog details.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="flex h-11 items-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[11px] font-extrabold text-[#252525]">
                        <CalendarDays
                            size={15}
                            className="text-[#F4512B]"
                        />

                        {formatDate(getToday())}
                    </div>

                    <motion.button
                        type="button"
                        onClick={openCreateModal}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F4512B] px-4 text-[12px] font-extrabold text-white shadow-sm transition-shadow hover:shadow-md"
                    >
                        <Plus size={17} />
                        Create Program
                    </motion.button>
                </div>
            </motion.section>

            {/* =================================================
          NOTICE
      ================================================= */}

            <AnimatePresence>
                {notice && (
                    <motion.div
                        initial={{ opacity: 0, y: -7 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        role="status"
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#CDEBD7] bg-[#F0FAF3] px-4 py-3"
                    >
                        <span className="flex items-center gap-2 text-[12px] font-extrabold text-[#17683D]">
                            <CheckCircle2 size={16} />
                            {notice}
                        </span>

                        <button
                            type="button"
                            aria-label="Dismiss notification"
                            onClick={() => setNotice("")}
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg hover:bg-[#E0F4E7]"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* =================================================
          SUMMARY CARDS
      ================================================= */}

            <section
                aria-label="Program statistics"
                className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
            >
                <ProgramStatCard
                    index={0}
                    title="Total Programs"
                    value={summary.totalPrograms}
                    detail="All catalog records"
                    icon={Layers3}
                    color={COLORS.orange}
                    bg={COLORS.orangeLight}
                />

                <ProgramStatCard
                    index={1}
                    title="Active Programs"
                    value={summary.activePrograms}
                    detail="Currently active"
                    icon={CheckCircle2}
                    color={COLORS.green}
                    bg={COLORS.greenLight}
                />

                <ProgramStatCard
                    index={2}
                    title="Total Enrollments"
                    value={summary.totalStudents}
                    detail="Across non-archived and archived records"
                    icon={Users}
                    color={COLORS.blue}
                    bg={COLORS.blueLight}
                />

                <ProgramStatCard
                    index={3}
                    title="Average Completion"
                    value={`${summary.averageCompletion}%`}
                    detail={`${summary.draftPrograms} drafts need review`}
                    icon={GraduationCap}
                    color={COLORS.purple}
                    bg={COLORS.purpleLight}
                />
            </section>

            {/* =================================================
          PROGRAM ENROLLMENT CHART
      ================================================= */}

            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
            >
                <SectionHeading
                    title="Program Enrollment Overview"
                    subtitle="Compare student enrollments across the leading programs."
                    icon={Activity}
                >
                    <span className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[11px] font-extrabold text-[#252525]">
                        <Users
                            size={15}
                            className="text-[#F4512B]"
                        />

                        {formatNumber(enrollmentTotal)} enrollments
                    </span>
                </SectionHeading>

                <div className="px-4 pb-5 pt-5 sm:px-6">
                    <div className="mb-4">
                        <p className="text-[12px] font-bold text-[#454545]">
                            Top programs by enrollment
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                            Active and draft programs are shown. Archived programs are excluded.
                        </p>
                    </div>

                    {/* No tinted chart background */}

                    <div className="h-[290px] w-full min-w-0 sm:h-[320px]">
                        {chartData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    key={chartData.map((item) => item.students).join("-")}
                                    layout="vertical"
                                    data={chartData}
                                    margin={{
                                        top: 6,
                                        right: 22,
                                        left: 8,
                                        bottom: 0,
                                    }}
                                    barCategoryGap="29%"
                                >
                                    <CartesianGrid
                                        horizontal={false}
                                        stroke="#E8E8E8"
                                        strokeDasharray="4 5"
                                    />

                                    <XAxis
                                        type="number"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#454545",
                                            fontSize: 11,
                                            fontWeight: 700,
                                        }}
                                        tickFormatter={(value) =>
                                            value >= 1000
                                                ? `${(value / 1000).toFixed(1)}k`
                                                : value
                                        }
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="name"
                                        width={155}
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{
                                            fill: "#353535",
                                            fontSize: 11,
                                            fontWeight: 700,
                                        }}
                                    />

                                    <Tooltip
                                        content={<ProgramChartTooltip />}
                                        cursor={false}
                                    />

                                    <Bar
                                        dataKey="students"
                                        name="Students"
                                        fill={COLORS.orange}
                                        radius={[0, 7, 7, 0]}
                                        maxBarSize={25}
                                        isAnimationActive
                                        animationBegin={80}
                                        animationDuration={1200}
                                        animationEasing="ease-out"
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="flex h-full items-center justify-center text-[12px] font-bold text-[#454545]">
                                No program data available.
                            </div>
                        )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEEEE] pt-4">
                        <span className="flex items-center gap-2 text-[11px] font-bold text-[#454545]">
                            <span className="h-2.5 w-2.5 rounded-sm bg-[#F4512B]" />
                            Enrolled students
                        </span>

                        <span className="text-[11px] font-semibold text-[#454545]">
                            Showing up to {chartData.length} programs
                        </span>
                    </div>
                </div>
            </motion.section>

            {/* =================================================
          PROGRAM DIRECTORY
      ================================================= */}

            <motion.section
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="relative rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
            >
                {/* HEADER */}

                <div className="flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-[16px] font-extrabold text-[#252525]">
                            Program Directory
                        </h2>

                        <p className="mt-1.5 text-[12px] font-semibold text-[#454545]">
                            Manage program details, enrollment capacity and status.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex h-9 items-center gap-2 rounded-lg border border-[#E8E8E8] bg-white px-3 text-[11px] font-extrabold text-[#252525]">
                            <BookOpen
                                size={14}
                                className="text-[#F4512B]"
                            />

                            {formatNumber(filteredPrograms.length)} programs
                        </span>

                        <motion.button
                            type="button"
                            onClick={handleExport}
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[11px] font-extrabold text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5]"
                        >
                            <Download size={15} />
                            Export CSV
                        </motion.button>
                    </div>
                </div>

                {/* SEARCH AND FILTERS */}

                <div className="relative z-20 flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-4 sm:px-6">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                        {/* SEARCH */}

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
                                placeholder="Search program name, code or category..."
                                aria-label="Search programs"
                                autoComplete="off"
                                className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white pl-10 pr-10 text-[12px] font-bold text-[#111111] caret-[#F4512B] outline-none transition-all duration-200 placeholder:font-semibold placeholder:text-[#686868] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
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
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-md text-[#454545] hover:bg-[#F2F2F2]"
                                >
                                    <X size={14} />
                                </button>
                            )}
                        </div>

                        {/* FILTERS */}

                        <div className="flex flex-wrap items-center gap-2">
                            <PremiumDropdown
                                ariaLabel="Filter by category"
                                value={categoryFilter}
                                onChange={(value) => {
                                    setCategoryFilter(value);
                                    setCurrentPage(1);
                                }}
                                options={CATEGORY_OPTIONS}
                                icon={Layers3}
                                minWidth={170}
                            />

                            <PremiumDropdown
                                ariaLabel="Filter by status"
                                value={statusFilter}
                                onChange={(value) => {
                                    setStatusFilter(value);
                                    setCurrentPage(1);
                                }}
                                options={STATUS_OPTIONS}
                                icon={Filter}
                                minWidth={145}
                            />

                            <PremiumDropdown
                                ariaLabel="Sort programs"
                                value={sortBy}
                                onChange={(value) => {
                                    setSortBy(value);
                                    setCurrentPage(1);
                                }}
                                options={SORT_OPTIONS}
                                icon={SlidersHorizontal}
                                minWidth={165}
                                align="right"
                            />

                            <motion.button
                                type="button"
                                onClick={resetFilters}
                                title="Reset filters"
                                aria-label="Reset filters"
                                whileTap={{ scale: 0.95 }}
                                className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5]"
                            >
                                <RefreshCw size={15} />
                            </motion.button>
                        </div>
                    </div>

                    {/* ACTIVE FILTERS */}

                    {(searchQuery.trim() ||
                        categoryFilter !== "all" ||
                        statusFilter !== "all") && (
                            <div className="flex flex-wrap items-center gap-2 pt-1">
                                <span className="text-[10px] font-extrabold text-[#454545]">
                                    Active filters:
                                </span>

                                {searchQuery.trim() && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSearchQuery("");
                                            setCurrentPage(1);
                                        }}
                                        className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#FFF0EA] px-3 py-1.5 text-[10px] font-extrabold text-[#D9411F]"
                                    >
                                        <span className="truncate">
                                            Search: {searchQuery}
                                        </span>
                                        <X size={12} />
                                    </button>
                                )}

                                {categoryFilter !== "all" && (
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setCategoryFilter("all");
                                            setCurrentPage(1);
                                        }}
                                        className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-[#EDF5FF] px-3 py-1.5 text-[10px] font-extrabold text-[#245E99]"
                                    >
                                        <span className="truncate">{categoryFilter}</span>
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
                                        className="inline-flex items-center gap-1.5 rounded-full bg-[#F4EEFF] px-3 py-1.5 text-[10px] font-extrabold text-[#6941A5]"
                                    >
                                        {statusFilter}
                                        <X size={12} />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={resetFilters}
                                    className="ml-auto text-[10px] font-extrabold text-[#D9411F] hover:underline"
                                >
                                    Clear all
                                </button>
                            </div>
                        )}
                </div>

                {/* PROGRAM TABLE */}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[1150px] border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FAFAFA]">
                                {[
                                    "PROGRAM",
                                    "CATEGORY",
                                    "LEVEL",
                                    "DURATION",
                                    "PRICE",
                                    "ENROLLMENTS",
                                    "STATUS",
                                    "ACTIONS",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="whitespace-nowrap border-b border-[#E8E8E8] px-4 py-4 text-[10px] font-extrabold tracking-[0.04em] text-[#454545] first:pl-5 last:pr-5 sm:px-5"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {visiblePrograms.map((program, index) => (
                                    <motion.tr
                                        key={program.id}
                                        layout
                                        initial={{ opacity: 0, y: 7 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: Math.min(index * 0.025, 0.12),
                                        }}
                                        className="border-b border-[#F0F0F0] last:border-0 transition-colors hover:bg-[#FFFAF8]"
                                    >
                                        {/* PROGRAM */}

                                        <td className="max-w-[300px] px-4 py-4 pl-5 sm:px-5">
                                            <div className="flex min-w-[220px] items-start gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#D9411F]">
                                                    <BookOpen size={18} />
                                                </span>

                                                <div className="min-w-0">
                                                    <p className="break-words text-[12px] font-extrabold leading-5 text-[#252525]">
                                                        {program.name}
                                                    </p>

                                                    <p className="mt-1 text-[10px] font-bold text-[#454545]">
                                                        {program.code}
                                                        {"  /  "}
                                                        {program.id}
                                                    </p>

                                                    <p className="mt-1 line-clamp-2 text-[10px] font-semibold leading-4 text-[#606060]">
                                                        {program.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* CATEGORY */}

                                        <td className="px-4 py-4 sm:px-5">
                                            <span className="inline-flex max-w-[155px] items-center gap-1.5 rounded-lg border border-[#EEEEEE] bg-white px-2.5 py-1.5 text-[10px] font-bold leading-4 text-[#353535]">
                                                <Layers3
                                                    size={12}
                                                    className="shrink-0 text-[#F4512B]"
                                                />

                                                {program.category}
                                            </span>
                                        </td>

                                        {/* LEVEL */}

                                        <td className="px-4 py-4 sm:px-5">
                                            <span
                                                className="rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold"
                                                style={{
                                                    color:
                                                        program.level === "Advanced"
                                                            ? COLORS.purple
                                                            : program.level === "Intermediate"
                                                                ? COLORS.blue
                                                                : COLORS.green,

                                                    backgroundColor:
                                                        program.level === "Advanced"
                                                            ? COLORS.purpleLight
                                                            : program.level === "Intermediate"
                                                                ? COLORS.blueLight
                                                                : COLORS.greenLight,
                                                }}
                                            >
                                                {program.level}
                                            </span>
                                        </td>

                                        {/* DURATION */}

                                        <td className="whitespace-nowrap px-4 py-4 text-[11px] font-bold text-[#252525] sm:px-5">
                                            {program.duration} weeks
                                        </td>

                                        {/* PRICE */}

                                        <td className="whitespace-nowrap px-4 py-4 text-[11px] font-extrabold text-[#252525] sm:px-5">
                                            {formatCurrency(program.price)}
                                        </td>

                                        {/* ENROLLMENT */}

                                        <td className="px-4 py-4 sm:px-5">
                                            <div className="min-w-[125px]">
                                                <div className="mb-1.5 flex items-center justify-between gap-2">
                                                    <span className="text-[11px] font-extrabold text-[#252525]">
                                                        {formatNumber(program.students)}
                                                    </span>

                                                    <span className="text-[10px] font-bold text-[#555555]">
                                                        {program.capacity > 0
                                                            ? Math.round(
                                                                (program.students / program.capacity) * 100
                                                            )
                                                            : 0}
                                                        %
                                                    </span>
                                                </div>

                                                <div className="h-1.5 overflow-hidden rounded-full bg-[#EEEEEE]">
                                                    <motion.div
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: `${program.capacity > 0
                                                                ? Math.min(
                                                                    100,
                                                                    (program.students / program.capacity) * 100
                                                                )
                                                                : 0
                                                                }%`,
                                                        }}
                                                        transition={{
                                                            duration: 0.8,
                                                            ease: [0.22, 1, 0.36, 1],
                                                        }}
                                                        className="h-full rounded-full bg-[#F4512B]"
                                                    />
                                                </div>

                                                <p className="mt-1 text-[9px] font-semibold text-[#606060]">
                                                    Capacity {formatNumber(program.capacity)}
                                                </p>
                                            </div>
                                        </td>

                                        {/* STATUS */}

                                        <td className="px-4 py-4 sm:px-5">
                                            <ProgramStatusBadge status={program.status} />
                                        </td>

                                        {/* ACTIONS */}

                                        <td className="px-4 py-4 pr-5 sm:px-5">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    type="button"
                                                    onClick={() => openEditModal(program)}
                                                    title="Edit program"
                                                    aria-label={`Edit ${program.name}`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF0EA] hover:text-[#D9411F]"
                                                >
                                                    <Pencil size={15} />
                                                </motion.button>

                                                <motion.button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(program)}
                                                    title={
                                                        program.status === "Active"
                                                            ? "Move to draft"
                                                            : "Activate program"
                                                    }
                                                    aria-label={`Change status for ${program.name}`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    disabled={program.status === "Archived"}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:border-[#B5DEC5] hover:bg-[#EAF7EE] hover:text-[#218653] disabled:cursor-not-allowed disabled:opacity-40"
                                                >
                                                    {program.status === "Active" ? (
                                                        <Archive size={15} />
                                                    ) : (
                                                        <CheckCircle2 size={15} />
                                                    )}
                                                </motion.button>

                                                <motion.button
                                                    type="button"
                                                    onClick={() => handleArchiveProgram(program)}
                                                    title={
                                                        program.status === "Archived"
                                                            ? "Restore program as draft"
                                                            : "Archive program"
                                                    }
                                                    aria-label={`Archive or restore ${program.name}`}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:border-[#F0C4C4] hover:bg-[#FFF0F0] hover:text-[#B52D2D]"
                                                >
                                                    {program.status === "Archived" ? (
                                                        <RefreshCw size={14} />
                                                    ) : (
                                                        <Archive size={14} />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>

                            {/* EMPTY STATE */}

                            {visiblePrograms.length === 0 && (
                                <tr>
                                    <td colSpan={8} className="px-5 py-16 text-center">
                                        <motion.div
                                            initial={{ opacity: 0, y: 8 }}
                                            animate={{ opacity: 1, y: 0 }}
                                        >
                                            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0EA] text-[#D9411F]">
                                                <Search size={23} />
                                            </span>

                                            <p className="mt-4 text-[14px] font-extrabold text-[#252525]">
                                                No programs found
                                            </p>

                                            <p className="mt-2 text-[12px] font-semibold text-[#454545]">
                                                Try a different search or reset your filters.
                                            </p>

                                            <button
                                                type="button"
                                                onClick={resetFilters}
                                                className="mt-4 inline-flex items-center gap-2 rounded-xl bg-[#F4512B] px-4 py-2.5 text-[11px] font-extrabold text-white transition-colors hover:bg-[#D9411F]"
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

                {/* TABLE FOOTER AND PAGINATION */}

                <div className="flex flex-col gap-4 border-t border-[#EEEEEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-[11px] font-semibold text-[#454545]">
                        Showing{" "}
                        <span className="font-extrabold text-[#252525]">
                            {filteredPrograms.length === 0
                                ? 0
                                : (currentPage - 1) * pageSize + 1}
                            {" - "}
                            {Math.min(
                                currentPage * pageSize,
                                filteredPrograms.length
                            )}
                        </span>{" "}
                        of{" "}
                        <span className="font-extrabold text-[#252525]">
                            {formatNumber(filteredPrograms.length)}
                        </span>{" "}
                        programs
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
                            aria-label="Rows per page"
                            className="h-9 rounded-lg border border-[#E8E8E8] bg-white px-2.5 text-[11px] font-extrabold text-[#252525] outline-none focus:border-[#F4512B]"
                        >
                            <option value={5}>5</option>
                            <option value={6}>6</option>
                            <option value={10}>10</option>
                            <option value={20}>20</option>
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

                            <span className="min-w-[74px] text-center text-[11px] font-extrabold text-[#252525]">
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

            {/* =================================================
          QUICK OVERVIEW
      ================================================= */}

            <section className="grid grid-cols-1 gap-5 xl:grid-cols-2">
                {/* CAPACITY */}

                <motion.article
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.2 }}
                    className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-[15px] font-extrabold text-[#252525]">
                                Enrollment Capacity
                            </h2>

                            <p className="mt-1.5 text-[12px] font-semibold text-[#454545]">
                                Total seats and current enrollments across programs.
                            </p>
                        </div>

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#218653]">
                            <Users size={19} />
                        </span>
                    </div>

                    <div className="mt-6 flex items-end justify-between gap-3">
                        <div>
                            <p className="text-[11px] font-bold text-[#454545]">
                                Total enrolled
                            </p>

                            <p className="mt-1.5 text-[29px] font-extrabold text-[#252525]">
                                {formatNumber(summary.totalStudents)}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-[11px] font-bold text-[#454545]">
                                Total capacity
                            </p>

                            <p className="mt-1.5 text-[19px] font-extrabold text-[#252525]">
                                {formatNumber(summary.totalCapacity)}
                            </p>
                        </div>
                    </div>

                    <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-[#EEEEEE]">
                        <motion.div
                            initial={{ width: 0 }}
                            animate={{
                                width: `${summary.totalCapacity > 0
                                    ? Math.min(
                                        100,
                                        (summary.totalStudents / summary.totalCapacity) * 100
                                    )
                                    : 0
                                    }%`,
                            }}
                            transition={{
                                duration: 1,
                                ease: [0.22, 1, 0.36, 1],
                            }}
                            className="h-full rounded-full bg-[#F4512B]"
                        />
                    </div>

                    <p className="mt-2 text-[11px] font-semibold text-[#454545]">
                        {summary.totalCapacity > 0
                            ? Math.round(
                                (summary.totalStudents / summary.totalCapacity) * 100
                            )
                            : 0}
                        % of listed capacity is currently filled.
                    </p>
                </motion.article>

                {/* MANAGEMENT SHORTCUTS */}

                <motion.article
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35, delay: 0.24 }}
                    className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm sm:p-6"
                >
                    <div className="flex items-start justify-between gap-3">
                        <div>
                            <h2 className="text-[15px] font-extrabold text-[#252525]">
                                Quick Management
                            </h2>

                            <p className="mt-1.5 text-[12px] font-semibold text-[#454545]">
                                Open a useful filtered view with one click.
                            </p>
                        </div>

                        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                            <SlidersHorizontal size={19} />
                        </span>
                    </div>

                    <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <motion.button
                            type="button"
                            onClick={() => {
                                setStatusFilter("Draft");
                                setCategoryFilter("all");
                                setSearchQuery("");
                                setCurrentPage(1);
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="group rounded-xl border border-[#E8E8E8] bg-white p-4 text-left transition-colors hover:border-[#F2D59A] hover:bg-[#FFFCF3]"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF7DF] text-[#996515]">
                                <Clock3 size={19} />
                            </span>

                            <p className="mt-3 text-[12px] font-extrabold text-[#252525]">
                                Review Drafts
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                                Programs awaiting activation.
                            </p>

                            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#996515]">
                                {summary.draftPrograms} drafts
                                <ArrowRight
                                    size={13}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </span>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={() => {
                                setStatusFilter("Active");
                                setCategoryFilter("all");
                                setSearchQuery("");
                                setSortBy("enrollments");
                                setCurrentPage(1);
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="group rounded-xl border border-[#E8E8E8] bg-white p-4 text-left transition-colors hover:border-[#B5DEC5] hover:bg-[#F7FCF8]"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#218653]">
                                <GraduationCap size={19} />
                            </span>

                            <p className="mt-3 text-[12px] font-extrabold text-[#252525]">
                                Top Programs
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                                Active programs sorted by students.
                            </p>

                            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#218653]">
                                View enrollments
                                <ArrowRight
                                    size={13}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </span>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={handleExport}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="group rounded-xl border border-[#E8E8E8] bg-white p-4 text-left transition-colors hover:border-[#B8D5F2] hover:bg-[#F7FAFF]"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#EDF5FF] text-[#347FC7]">
                                <FileSpreadsheet size={19} />
                            </span>

                            <p className="mt-3 text-[12px] font-extrabold text-[#252525]">
                                Export Catalog
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                                Download matching program records.
                            </p>

                            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#347FC7]">
                                Download CSV
                                <ArrowRight
                                    size={13}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </span>
                        </motion.button>

                        <motion.button
                            type="button"
                            onClick={() => {
                                resetFilters();
                                openCreateModal();
                            }}
                            whileHover={{ y: -2 }}
                            whileTap={{ scale: 0.99 }}
                            className="group rounded-xl border border-[#E8E8E8] bg-white p-4 text-left transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5]"
                        >
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#D9411F]">
                                <Plus size={19} />
                            </span>

                            <p className="mt-3 text-[12px] font-extrabold text-[#252525]">
                                New Program
                            </p>

                            <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                                Add a new item to the catalog.
                            </p>

                            <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-extrabold text-[#D9411F]">
                                Create program
                                <ArrowRight
                                    size={13}
                                    className="transition-transform group-hover:translate-x-1"
                                />
                            </span>
                        </motion.button>
                    </div>
                </motion.article>
            </section>

            {/* =================================================
          FOOTER
      ================================================= */}

            <motion.footer
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.28 }}
                className="flex flex-col gap-3 rounded-2xl border border-[#E8E8E8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
            >
                <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                        <CheckCircle2 size={20} />
                    </span>

                    <div>
                        <p className="text-[12px] font-extrabold text-[#252525]">
                            Program Management Workspace
                        </p>

                        <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                            {formatNumber(summary.totalPrograms)} records in the current catalog.
                        </p>
                    </div>
                </div>

                <button
                    type="button"
                    onClick={() => {
                        resetFilters();
                        setNotice("");
                    }}
                    className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-[#E8E8E8] bg-white px-4 text-[11px] font-extrabold text-[#252525] transition-colors hover:bg-[#FFF8F5] sm:self-auto"
                >
                    <RefreshCw size={14} />
                    Reset filters
                </button>
            </motion.footer>

            {/* =================================================
          CREATE / EDIT MODAL
      ================================================= */}

            <ProgramModal
                open={modalOpen}
                program={editingProgram}
                onClose={closeModal}
                onSave={handleSaveProgram}
            />
        </div>
    );
}