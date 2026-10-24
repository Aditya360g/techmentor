import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
    Users,
    Search,
    Download,
    GraduationCap,
    CalendarDays,
    Clock3,
    CheckCircle2,
    AlertTriangle,
    X,
    ChevronDown,
    ChevronRight,
    Check,
    RotateCcw,
    Eye,
    FileText,
    Sparkles,
    BookOpen,
    UserRound,
    Mail,
    Phone,
    ArrowUpRight,
    MoreHorizontal,
    XCircle,
    Inbox,
    ClipboardList,
    Plus,
    SlidersHorizontal,
    CheckCheck,
    CircleDashed,
    RefreshCw,
    ShieldCheck,
    Filter,
} from "lucide-react";

/* =========================================================
   CONFIG
========================================================= */

const STORAGE_KEY = "techmentor-college-requests-v1";

const COURSES = [
    "Full Stack Development",
    "Artificial Intelligence",
    "Data Science",
    "Python Programming",
    "Java Development",
    "Cloud Computing",
];

const BATCHES = [
    "Morning Batch",
    "Afternoon Batch",
    "Evening Batch",
    "Weekend Batch",
];

const STATUS_CONFIG = {
    Pending: {
        color: "#FBBF24",
        background: "rgba(251,191,36,0.10)",
        border: "rgba(251,191,36,0.25)",
        icon: Clock3,
    },
    "Under Review": {
        color: "#67C9FF",
        background: "rgba(103,201,255,0.10)",
        border: "rgba(103,201,255,0.25)",
        icon: CircleDashed,
    },
    Approved: {
        color: "#5EE6B1",
        background: "rgba(94,230,177,0.10)",
        border: "rgba(94,230,177,0.25)",
        icon: CheckCircle2,
    },
    Rejected: {
        color: "#FDA4AF",
        background: "rgba(251,113,133,0.10)",
        border: "rgba(251,113,133,0.25)",
        icon: XCircle,
    },
};

const STATUS_OPTIONS = [
    { value: "All", label: "All requests" },
    { value: "Pending", label: "Pending" },
    { value: "Under Review", label: "Under review" },
    { value: "Approved", label: "Approved" },
    { value: "Rejected", label: "Rejected" },
];

const COURSE_OPTIONS = [
    { value: "All", label: "All courses" },
    ...COURSES.map((course) => ({ value: course, label: course })),
];

const BATCH_OPTIONS = [
    { value: "All", label: "All batches" },
    ...BATCHES.map((batch) => ({ value: batch, label: batch })),
];

const SORT_OPTIONS = [
    { value: "newest", label: "Newest first" },
    { value: "oldest", label: "Oldest first" },
    { value: "name", label: "Student name" },
];

/* =========================================================
   HELPERS
========================================================= */

const makeId = () =>
    `REQ-${Date.now().toString(36).toUpperCase()}-${Math.random()
        .toString(36)
        .slice(2, 6)
        .toUpperCase()}`;

const daysAgo = (days) => {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date.toISOString();
};

const formatDate = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const formatDateTime = (value) => {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
};

const getInitials = (name = "") =>
    name
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((word) => word[0].toUpperCase())
        .join("") || "ST";

const getAvatarColor = (name = "") => {
    const palette = [
        "#6CCBFF",
        "#A78BFA",
        "#5EE6B1",
        "#FBBF24",
        "#FB9EBD",
        "#8DA8FF",
    ];

    const score = name
        .split("")
        .reduce((total, char) => total + char.charCodeAt(0), 0);

    return palette[score % palette.length];
};

/* =========================================================
   SAMPLE DATA
========================================================= */

const createSeedRequests = () => [
    {
        id: "REQ-2026-001",
        studentName: "Aarav Sharma",
        email: "aarav.sharma@example.com",
        phone: "+91 98765 41021",
        course: "Full Stack Development",
        batch: "Morning Batch",
        qualification: "B.Tech — Computer Science",
        graduationYear: "2027",
        message:
            "I want to strengthen my full-stack development skills and build industry-level projects.",
        status: "Pending",
        requestedAt: daysAgo(0),
        updatedAt: daysAgo(0),
        reviewedBy: "",
        reviewNote: "",
    },
    {
        id: "REQ-2026-002",
        studentName: "Priya Verma",
        email: "priya.verma@example.com",
        phone: "+91 98765 41022",
        course: "Artificial Intelligence",
        batch: "Evening Batch",
        qualification: "B.Tech — AI & DS",
        graduationYear: "2028",
        message:
            "Interested in learning practical AI, machine learning and real-world applications.",
        status: "Under Review",
        requestedAt: daysAgo(1),
        updatedAt: daysAgo(0),
        reviewedBy: "College Admin",
        reviewNote: "Academic details are being checked.",
    },
    {
        id: "REQ-2026-003",
        studentName: "Rahul Meena",
        email: "rahul.meena@example.com",
        phone: "+91 98765 41023",
        course: "Data Science",
        batch: "Weekend Batch",
        qualification: "BCA",
        graduationYear: "2026",
        message:
            "I am looking for a structured data science course with practical assignments.",
        status: "Approved",
        requestedAt: daysAgo(2),
        updatedAt: daysAgo(1),
        reviewedBy: "College Admin",
        reviewNote: "Application approved after checking the student details.",
    },
    {
        id: "REQ-2026-004",
        studentName: "Neha Singh",
        email: "neha.singh@example.com",
        phone: "+91 98765 41024",
        course: "Python Programming",
        batch: "Afternoon Batch",
        qualification: "B.Sc — Mathematics",
        graduationYear: "2027",
        message:
            "I am a beginner in programming and want to learn Python from fundamentals.",
        status: "Pending",
        requestedAt: daysAgo(3),
        updatedAt: daysAgo(3),
        reviewedBy: "",
        reviewNote: "",
    },
    {
        id: "REQ-2026-005",
        studentName: "Karan Patel",
        email: "karan.patel@example.com",
        phone: "+91 98765 41025",
        course: "Java Development",
        batch: "Morning Batch",
        qualification: "B.Tech — IT",
        graduationYear: "2027",
        message:
            "My goal is to improve my Java programming and backend development skills.",
        status: "Rejected",
        requestedAt: daysAgo(5),
        updatedAt: daysAgo(4),
        reviewedBy: "College Admin",
        reviewNote: "The selected batch is currently full.",
    },
    {
        id: "REQ-2026-006",
        studentName: "Simran Kaur",
        email: "simran.kaur@example.com",
        phone: "+91 98765 41026",
        course: "Cloud Computing",
        batch: "Weekend Batch",
        qualification: "BCA",
        graduationYear: "2026",
        message:
            "Interested in cloud infrastructure, deployment and practical cloud projects.",
        status: "Pending",
        requestedAt: daysAgo(1),
        updatedAt: daysAgo(1),
        reviewedBy: "",
        reviewNote: "",
    },
    {
        id: "REQ-2026-007",
        studentName: "Vikram Yadav",
        email: "vikram.yadav@example.com",
        phone: "+91 98765 41027",
        course: "Full Stack Development",
        batch: "Evening Batch",
        qualification: "B.Tech — ECE",
        graduationYear: "2027",
        message:
            "I want to transition into software development and create portfolio projects.",
        status: "Under Review",
        requestedAt: daysAgo(4),
        updatedAt: daysAgo(2),
        reviewedBy: "College Admin",
        reviewNote: "Checking course eligibility.",
    },
    {
        id: "REQ-2026-008",
        studentName: "Ananya Gupta",
        email: "ananya.gupta@example.com",
        phone: "+91 98765 41028",
        course: "Artificial Intelligence",
        batch: "Morning Batch",
        qualification: "B.Tech — AI & DS",
        graduationYear: "2028",
        message:
            "I would like to join the AI program to work on practical machine learning projects.",
        status: "Approved",
        requestedAt: daysAgo(6),
        updatedAt: daysAgo(3),
        reviewedBy: "College Admin",
        reviewNote: "Approved. Student can proceed with enrollment.",
    },
];

const readRequestsFromStorage = () => {
    if (typeof window === "undefined") return createSeedRequests();

    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (saved === null) return createSeedRequests();

        const parsed = JSON.parse(saved);

        return Array.isArray(parsed) ? parsed : createSeedRequests();
    } catch {
        return createSeedRequests();
    }
};

/* =========================================================
   CSV EXPORT
========================================================= */

const downloadCSV = (rows) => {
    const headers = [
        "Request ID",
        "Student Name",
        "Email",
        "Phone",
        "Course",
        "Batch",
        "Qualification",
        "Graduation Year",
        "Status",
        "Requested At",
        "Updated At",
        "Review Note",
    ];

    const escapeCSV = (value) =>
        `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [
        headers.map(escapeCSV).join(","),
        ...rows.map((request) =>
            [
                request.id,
                request.studentName,
                request.email,
                request.phone,
                request.course,
                request.batch,
                request.qualification,
                request.graduationYear,
                request.status,
                formatDateTime(request.requestedAt),
                formatDateTime(request.updatedAt),
                request.reviewNote,
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
    link.download = `college-requests-${new Date()
        .toISOString()
        .slice(0, 10)}.csv`;

    document.body.appendChild(link);
    link.click();
    link.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

/* =========================================================
   PREMIUM ANIMATED DROPDOWN
========================================================= */

function PremiumSelect({
    value,
    options,
    onChange,
    placeholder = "Select option",
    icon: SelectIcon,
    width = "100%",
}) {
    const [open, setOpen] = useState(false);
    const [position, setPosition] = useState(null);

    const rootRef = useRef(null);
    const menuRef = useRef(null);

    const selectedOption = options.find(
        (option) => option.value === value
    );

    useEffect(() => {
        if (!open) return undefined;

        const updatePosition = () => {
            if (!rootRef.current) return;

            const rect = rootRef.current.getBoundingClientRect();
            const below = window.innerHeight - rect.bottom;
            const above = rect.top;
            const openAbove = below < 260 && above > below;

            const availableSpace = openAbove ? above - 20 : below - 20;

            const menuWidth = Math.min(
                Math.max(rect.width, 170),
                window.innerWidth - 24
            );

            const left = Math.max(
                12,
                Math.min(rect.left, window.innerWidth - menuWidth - 12)
            );

            setPosition({
                left,
                width: menuWidth,
                anchorTop: openAbove ? rect.top - 8 : rect.bottom + 8,
                maxHeight: Math.max(120, Math.min(300, availableSpace)),
                openAbove,
            });
        };

        updatePosition();

        const handlePointerDown = (event) => {
            const inTrigger = rootRef.current?.contains(event.target);
            const inMenu = menuRef.current?.contains(event.target);

            if (!inTrigger && !inMenu) setOpen(false);
        };

        const handleKeyDown = (event) => {
            if (event.key === "Escape") setOpen(false);
        };

        window.addEventListener("resize", updatePosition);
        window.addEventListener("scroll", updatePosition, true);
        document.addEventListener("pointerdown", handlePointerDown);
        document.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("resize", updatePosition);
            window.removeEventListener("scroll", updatePosition, true);
            document.removeEventListener("pointerdown", handlePointerDown);
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [open]);

    const menu =
        open && position
            ? createPortal(
                <AnimatePresence>
                    <motion.div
                        ref={menuRef}
                        initial={{
                            opacity: 0,
                            y: position.openAbove ? 8 : -6,
                            scale: 0.97,
                        }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{
                            opacity: 0,
                            y: position.openAbove ? 5 : -4,
                            scale: 0.98,
                        }}
                        transition={{ duration: 0.16, ease: "easeOut" }}
                        style={{
                            position: "fixed",
                            left: position.left,
                            top: position.anchorTop,
                            transform: position.openAbove
                                ? "translateY(-100%)"
                                : "none",
                            width: position.width,
                            maxHeight: position.maxHeight,
                            zIndex: 100000,
                        }}
                        className="overflow-y-auto rounded-2xl border border-[#24445e] bg-[#0b1b2b] p-1.5 shadow-[0_22px_70px_rgba(0,0,0,0.48)]"
                    >
                        {options.map((option, index) => {
                            const active = option.value === value;

                            return (
                                <motion.button
                                    key={option.value}
                                    type="button"
                                    initial={{ opacity: 0, x: -4 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{
                                        delay: Math.min(index * 0.012, 0.08),
                                    }}
                                    onClick={() => {
                                        onChange(option.value);
                                        setOpen(false);
                                    }}
                                    className={`group flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition-all ${active
                                        ? "bg-[#153b55] text-[#93dcff]"
                                        : "text-slate-300 hover:bg-[#122b40] hover:text-white"
                                        }`}
                                >
                                    <span className="min-w-0 truncate font-medium">
                                        {option.label}
                                    </span>

                                    {active ? (
                                        <Check
                                            size={15}
                                            className="shrink-0 text-[#76d4ff]"
                                        />
                                    ) : (
                                        <ChevronRight
                                            size={14}
                                            className="shrink-0 text-slate-600 opacity-0 transition group-hover:opacity-100"
                                        />
                                    )}
                                </motion.button>
                            );
                        })}
                    </motion.div>
                </AnimatePresence>,
                document.body
            )
            : null;

    return (
        <>
            <div
                ref={rootRef}
                className="relative min-w-0"
                style={{ width }}
            >
                <button
                    type="button"
                    aria-haspopup="listbox"
                    aria-expanded={open}
                    onClick={() => setOpen((current) => !current)}
                    className={`flex min-h-[44px] w-full items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm outline-none transition-all ${open
                        ? "border-[#58b9ed] bg-[#102b40] shadow-[0_0_0_3px_rgba(88,185,237,0.10)]"
                        : "border-[#263e54] bg-[#0a1b2b] hover:border-[#3c6786] hover:bg-[#0d2235]"
                        }`}
                >
                    <span className="flex min-w-0 items-center gap-2.5">
                        {SelectIcon && (
                            <SelectIcon
                                size={16}
                                className={`shrink-0 ${open ? "text-[#76d4ff]" : "text-slate-500"
                                    }`}
                            />
                        )}

                        <span
                            className={`truncate ${selectedOption
                                ? "text-slate-100"
                                : "text-slate-500"
                                }`}
                        >
                            {selectedOption?.label || placeholder}
                        </span>
                    </span>

                    <ChevronDown
                        size={15}
                        className={`shrink-0 text-slate-500 transition-transform duration-200 ${open ? "rotate-180 text-[#76d4ff]" : ""
                            }`}
                    />
                </button>
            </div>

            {menu}
        </>
    );
}

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

function StatusBadge({ status }) {
    const config = STATUS_CONFIG[status] || STATUS_CONFIG.Pending;
    const StatusIcon = config.icon;

    return (
        <span
            className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[11px] font-semibold"
            style={{
                color: config.color,
                background: config.background,
                borderColor: config.border,
            }}
        >
            <StatusIcon size={12} strokeWidth={2.3} />
            {status}
        </span>
    );
}

function Avatar({ name, size = "md" }) {
    const dimensions =
        size === "lg"
            ? "h-14 w-14 text-base"
            : size === "sm"
                ? "h-9 w-9 text-xs"
                : "h-11 w-11 text-sm";

    return (
        <div
            className={`flex shrink-0 items-center justify-center rounded-xl font-bold ${dimensions}`}
            style={{
                color: "#071725",
                background: `linear-gradient(145deg, ${getAvatarColor(
                    name
                )}, #d7f3ff)`,
                boxShadow: "0 5px 18px rgba(93,190,235,0.12)",
            }}
        >
            {getInitials(name)}
        </div>
    );
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
    accent,
    delay = 0,
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.35 }}
            whileHover={{ y: -3 }}
            className="group relative overflow-hidden rounded-2xl border border-[#20384d] bg-[#0a1a2a] p-4 sm:p-5"
        >
            <div
                className="pointer-events-none absolute -right-8 -top-10 h-28 w-28 rounded-full opacity-[0.09] blur-2xl transition-opacity group-hover:opacity-[0.17]"
                style={{ background: accent }}
            />

            <div className="relative flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-xs font-medium text-slate-400 sm:text-sm">
                        {title}
                    </p>

                    <p className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">
                        {value}
                    </p>

                    <p className="mt-2 text-[11px] leading-5 text-slate-500 sm:text-xs">
                        {description}
                    </p>
                </div>

                <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                        color: accent,
                        background: `${accent}12`,
                        borderColor: `${accent}28`,
                    }}
                >
                    <Icon size={19} />
                </div>
            </div>
        </motion.div>
    );
}

function EmptyState({ onReset, hasFilters }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl border border-[#27445c] bg-[#10263a]">
                <Inbox size={28} className="text-[#76cfff]" />
            </div>

            <h3 className="text-base font-semibold text-white">
                No requests found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                {hasFilters
                    ? "Try changing your search or filters to see more student requests."
                    : "New student enrollment requests will appear here."}
            </p>

            {hasFilters && (
                <button
                    type="button"
                    onClick={onReset}
                    className="mt-5 inline-flex items-center gap-2 rounded-xl border border-[#30516b] bg-[#112b40] px-4 py-2.5 text-sm font-semibold text-[#a4e2ff] transition hover:bg-[#183a54]"
                >
                    <RotateCcw size={14} />
                    Reset filters
                </button>
            )}
        </div>
    );
}

/* =========================================================
   REQUEST DETAILS MODAL
========================================================= */

function RequestDetailsModal({ request, onClose, onSave }) {
    const [reviewNote, setReviewNote] = useState("");
    const [status, setStatus] = useState("Pending");

    useEffect(() => {
        if (!request) return;

        setReviewNote(request.reviewNote || "");
        setStatus(request.status || "Pending");
    }, [request]);

    if (!request) return null;

    const details = [
        {
            icon: Mail,
            label: "Email address",
            value: request.email,
        },
        {
            icon: Phone,
            label: "Phone number",
            value: request.phone,
        },
        {
            icon: GraduationCap,
            label: "Qualification",
            value: request.qualification,
        },
        {
            icon: CalendarDays,
            label: "Graduation year",
            value: request.graduationYear,
        },
    ];

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            className="fixed inset-0 z-[9990] flex items-center justify-center overflow-y-auto bg-[#020914]/80 p-3 backdrop-blur-md sm:p-6"
        >
            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="my-auto w-full max-w-2xl overflow-visible rounded-3xl border border-[#29455d] bg-[#091827] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
            >
                <div className="relative overflow-hidden rounded-t-3xl border-b border-[#20384d] px-5 py-5 sm:px-7">
                    <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full bg-[#56bfff]/10 blur-3xl" />

                    <div className="relative flex items-start justify-between gap-4">
                        <div className="flex min-w-0 items-start gap-3">
                            <Avatar name={request.studentName} size="lg" />

                            <div className="min-w-0">
                                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#77cfff]">
                                    Enrollment request
                                </p>

                                <h2 className="mt-1 break-words text-xl font-bold text-white sm:text-2xl">
                                    {request.studentName}
                                </h2>

                                <p className="mt-1 text-xs text-slate-500">
                                    {request.id}
                                </p>

                                <div className="mt-3">
                                    <StatusBadge status={request.status} />
                                </div>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#29445b] bg-[#102438] text-slate-400 transition hover:text-white"
                            aria-label="Close details"
                        >
                            <X size={17} />
                        </button>
                    </div>
                </div>

                <div className="max-h-[65vh] space-y-6 overflow-y-auto p-5 sm:p-7">
                    <section>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                            <UserRound size={16} className="text-[#75cfff]" />
                            Student information
                        </h3>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                            {details.map((item) => {
                                const ItemIcon = item.icon;

                                return (
                                    <div
                                        key={item.label}
                                        className="min-w-0 rounded-xl border border-[#20384d] bg-[#0d2031] p-3.5"
                                    >
                                        <p className="flex items-center gap-2 text-[11px] text-slate-500">
                                            <ItemIcon size={13} />
                                            {item.label}
                                        </p>

                                        <p className="mt-2 break-words text-sm font-medium text-slate-200">
                                            {item.value || "Not provided"}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                            <BookOpen size={16} className="text-[#75cfff]" />
                            Course details
                        </h3>

                        <div className="rounded-xl border border-[#24445d] bg-[#0d2133] p-4">
                            <div className="flex items-start gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#2a5874] bg-[#14354b] text-[#7bd4ff]">
                                    <GraduationCap size={19} />
                                </div>

                                <div className="min-w-0">
                                    <p className="font-semibold text-white">
                                        {request.course}
                                    </p>

                                    <p className="mt-1 text-xs text-slate-400">
                                        {request.batch}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-4 border-t border-[#20384d] pt-3">
                                <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                                    Student's message
                                </p>

                                <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-300">
                                    {request.message || "No message provided."}
                                </p>
                            </div>
                        </div>
                    </section>

                    <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <div className="rounded-xl border border-[#20384d] bg-[#0d2031] p-3.5">
                            <p className="text-xs text-slate-500">Submitted on</p>

                            <p className="mt-1.5 text-sm font-medium text-slate-200">
                                {formatDateTime(request.requestedAt)}
                            </p>
                        </div>

                        <div className="rounded-xl border border-[#20384d] bg-[#0d2031] p-3.5">
                            <p className="text-xs text-slate-500">Last updated</p>

                            <p className="mt-1.5 text-sm font-medium text-slate-200">
                                {formatDateTime(request.updatedAt)}
                            </p>
                        </div>
                    </section>

                    <section>
                        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
                            <ClipboardList size={16} className="text-[#75cfff]" />
                            Review decision
                        </h3>

                        <div className="space-y-4 rounded-2xl border border-[#20384d] bg-[#0b1d2d] p-4">
                            <div>
                                <label className="mb-2 block text-xs font-medium text-slate-400">
                                    Request status
                                </label>

                                <PremiumSelect
                                    value={status}
                                    options={STATUS_OPTIONS.filter(
                                        (option) => option.value !== "All"
                                    )}
                                    onChange={setStatus}
                                    icon={ShieldCheck}
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor="college-review-note"
                                    className="mb-2 block text-xs font-medium text-slate-400"
                                >
                                    Internal review note
                                </label>

                                <textarea
                                    id="college-review-note"
                                    value={reviewNote}
                                    onChange={(event) =>
                                        setReviewNote(event.target.value)
                                    }
                                    rows={3}
                                    placeholder="Add a note about this decision..."
                                    className="w-full resize-y rounded-xl border border-[#263f55] bg-[#081725] px-3.5 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#64c7fa] focus:ring-2 focus:ring-[#64c7fa]/10"
                                />
                            </div>

                            {request.reviewedBy && (
                                <p className="text-[11px] text-slate-500">
                                    Last reviewed by{" "}
                                    <span className="font-medium text-slate-300">
                                        {request.reviewedBy}
                                    </span>
                                </p>
                            )}
                        </div>
                    </section>
                </div>

                <div className="flex flex-col-reverse gap-2 border-t border-[#20384d] bg-[#081624] px-5 py-4 sm:flex-row sm:justify-between sm:px-7">
                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-xl border border-[#2a4256] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#12283b]"
                    >
                        Cancel
                    </button>

                    <button
                        type="button"
                        onClick={() => onSave(request.id, status, reviewNote)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#79d6ff]/30 bg-gradient-to-r from-[#6bc9f5] to-[#91e1ff] px-5 py-2.5 text-sm font-bold text-[#061726] transition hover:brightness-110"
                    >
                        <Check size={16} />
                        Save decision
                    </button>
                </div>
            </motion.div>
        </motion.div>,
        document.body
    );
}

/* =========================================================
   CREATE REQUEST MODAL
========================================================= */

function AddRequestModal({ onClose, onCreate }) {
    const [form, setForm] = useState({
        studentName: "",
        email: "",
        phone: "",
        course: COURSES[0],
        batch: BATCHES[0],
        qualification: "",
        graduationYear: "",
        message: "",
    });

    const [error, setError] = useState("");

    const updateField = (key, value) => {
        setForm((current) => ({ ...current, [key]: value }));
        setError("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!form.studentName.trim()) {
            setError("Please enter the student's full name.");
            return;
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            setError("Please enter a valid email address.");
            return;
        }

        if (!form.phone.trim()) {
            setError("Please enter the student's phone number.");
            return;
        }

        onCreate({
            ...form,
            studentName: form.studentName.trim(),
            email: form.email.trim(),
            phone: form.phone.trim(),
            qualification: form.qualification.trim(),
            graduationYear: form.graduationYear.trim(),
            message: form.message.trim(),
        });
    };

    const inputClass =
        "w-full rounded-xl border border-[#263f55] bg-[#081725] px-3.5 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#64c7fa] focus:ring-2 focus:ring-[#64c7fa]/10";

    const labelClass =
        "mb-2 block text-xs font-semibold text-slate-400";

    return createPortal(
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
            className="fixed inset-0 z-[9990] flex items-center justify-center overflow-y-auto bg-[#020914]/80 p-3 backdrop-blur-md sm:p-6"
        >
            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="my-auto w-full max-w-2xl overflow-visible rounded-3xl border border-[#29455d] bg-[#091827] shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
            >
                <div className="flex items-start justify-between gap-4 border-b border-[#20384d] px-5 py-5 sm:px-7">
                    <div>
                        <div className="flex items-center gap-2 text-[#79d4ff]">
                            <Plus size={17} />
                            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
                                New enrollment
                            </span>
                        </div>

                        <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                            Create student request
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Add a student enrollment request to your records.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#29445b] bg-[#102438] text-slate-400 transition hover:text-white"
                        aria-label="Close form"
                    >
                        <X size={17} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="max-h-[65vh] space-y-4 overflow-y-auto p-5 sm:p-7">
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                                <label className={labelClass} htmlFor="request-student-name">
                                    Student full name *
                                </label>

                                <input
                                    id="request-student-name"
                                    value={form.studentName}
                                    onChange={(event) =>
                                        updateField("studentName", event.target.value)
                                    }
                                    placeholder="Enter full name"
                                    className={inputClass}
                                    autoFocus
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="request-student-email">
                                    Email address *
                                </label>

                                <input
                                    id="request-student-email"
                                    type="email"
                                    value={form.email}
                                    onChange={(event) =>
                                        updateField("email", event.target.value)
                                    }
                                    placeholder="student@example.com"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass} htmlFor="request-student-phone">
                                    Phone number *
                                </label>

                                <input
                                    id="request-student-phone"
                                    value={form.phone}
                                    onChange={(event) =>
                                        updateField("phone", event.target.value)
                                    }
                                    placeholder="+91 98765 43210"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label
                                    className={labelClass}
                                    htmlFor="request-student-qualification"
                                >
                                    Qualification
                                </label>

                                <input
                                    id="request-student-qualification"
                                    value={form.qualification}
                                    onChange={(event) =>
                                        updateField("qualification", event.target.value)
                                    }
                                    placeholder="e.g. B.Tech — CSE"
                                    className={inputClass}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Course *</label>

                                <PremiumSelect
                                    value={form.course}
                                    options={COURSES.map((course) => ({
                                        value: course,
                                        label: course,
                                    }))}
                                    onChange={(value) => updateField("course", value)}
                                    icon={BookOpen}
                                />
                            </div>

                            <div>
                                <label className={labelClass}>Batch *</label>

                                <PremiumSelect
                                    value={form.batch}
                                    options={BATCHES.map((batch) => ({
                                        value: batch,
                                        label: batch,
                                    }))}
                                    onChange={(value) => updateField("batch", value)}
                                    icon={CalendarDays}
                                />
                            </div>

                            <div>
                                <label
                                    className={labelClass}
                                    htmlFor="request-graduation-year"
                                >
                                    Graduation year
                                </label>

                                <input
                                    id="request-graduation-year"
                                    value={form.graduationYear}
                                    onChange={(event) =>
                                        updateField("graduationYear", event.target.value)
                                    }
                                    placeholder="e.g. 2027"
                                    className={inputClass}
                                    inputMode="numeric"
                                    maxLength={4}
                                />
                            </div>
                        </div>

                        <div>
                            <label className={labelClass} htmlFor="request-message">
                                Student message / notes
                            </label>

                            <textarea
                                id="request-message"
                                rows={3}
                                value={form.message}
                                onChange={(event) =>
                                    updateField("message", event.target.value)
                                }
                                placeholder="Add the student's message or relevant notes..."
                                className={`${inputClass} resize-y`}
                            />
                        </div>

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="rounded-xl border border-rose-400/20 bg-rose-400/10 px-3 py-2.5 text-sm text-rose-300"
                            >
                                {error}
                            </motion.p>
                        )}

                        <div className="flex items-start gap-2 rounded-xl border border-[#244258] bg-[#0d2234] p-3">
                            <Sparkles
                                size={16}
                                className="mt-0.5 shrink-0 text-[#7bd4ff]"
                            />

                            <p className="text-xs leading-5 text-slate-400">
                                The new request will start with{" "}
                                <span className="font-semibold text-amber-300">
                                    Pending
                                </span>{" "}
                                status. You can review it and update the decision later.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-2 border-t border-[#20384d] bg-[#081624] px-5 py-4 sm:flex-row sm:justify-end sm:px-7">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-xl border border-[#2a4256] px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#12283b]"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#6bc9f5] to-[#91e1ff] px-5 py-2.5 text-sm font-bold text-[#061726] transition hover:brightness-110"
                        >
                            <Plus size={16} />
                            Create request
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>,
        document.body
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

function CollegeRequestsPage() {
    const [requests, setRequests] = useState(readRequestsFromStorage);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [courseFilter, setCourseFilter] = useState("All");
    const [batchFilter, setBatchFilter] = useState("All");
    const [sortBy, setSortBy] = useState("newest");

    const [selectedIds, setSelectedIds] = useState([]);
    const [activeRequest, setActiveRequest] = useState(null);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [toast, setToast] = useState(null);

    const searchRef = useRef(null);
    const toastTimerRef = useRef(null);

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
        } catch (error) {
            console.error("Could not save college requests:", error);
        }
    }, [requests]);

    useEffect(() => {
        return () => {
            if (toastTimerRef.current) {
                window.clearTimeout(toastTimerRef.current);
            }
        };
    }, []);

    const notify = (message, type = "success") => {
        if (toastTimerRef.current) {
            window.clearTimeout(toastTimerRef.current);
        }

        setToast({ message, type });

        toastTimerRef.current = window.setTimeout(() => {
            setToast(null);
        }, 3000);
    };

    const stats = useMemo(() => {
        const pending = requests.filter(
            (request) => request.status === "Pending"
        ).length;

        const review = requests.filter(
            (request) => request.status === "Under Review"
        ).length;

        const approved = requests.filter(
            (request) => request.status === "Approved"
        ).length;

        const rejected = requests.filter(
            (request) => request.status === "Rejected"
        ).length;

        return {
            total: requests.length,
            pending,
            review,
            approved,
            rejected,
        };
    }, [requests]);

    const filteredRequests = useMemo(() => {
        const searchTerm = search.trim().toLowerCase();

        const result = requests.filter((request) => {
            const searchableText = [
                request.id,
                request.studentName,
                request.email,
                request.phone,
                request.course,
                request.batch,
                request.qualification,
            ]
                .join(" ")
                .toLowerCase();

            const matchesSearch =
                !searchTerm || searchableText.includes(searchTerm);

            const matchesStatus =
                statusFilter === "All" || request.status === statusFilter;

            const matchesCourse =
                courseFilter === "All" || request.course === courseFilter;

            const matchesBatch =
                batchFilter === "All" || request.batch === batchFilter;

            return (
                matchesSearch &&
                matchesStatus &&
                matchesCourse &&
                matchesBatch
            );
        });

        result.sort((a, b) => {
            if (sortBy === "name") {
                return a.studentName.localeCompare(b.studentName);
            }

            const dateA = new Date(a.requestedAt).getTime();
            const dateB = new Date(b.requestedAt).getTime();

            return sortBy === "oldest" ? dateA - dateB : dateB - dateA;
        });

        return result;
    }, [
        requests,
        search,
        statusFilter,
        courseFilter,
        batchFilter,
        sortBy,
    ]);

    const hasActiveFilters =
        Boolean(search.trim()) ||
        statusFilter !== "All" ||
        courseFilter !== "All" ||
        batchFilter !== "All" ||
        sortBy !== "newest";

    const allVisibleSelected =
        filteredRequests.length > 0 &&
        filteredRequests.every((request) =>
            selectedIds.includes(request.id)
        );

    const visibleSelectedCount = filteredRequests.filter((request) =>
        selectedIds.includes(request.id)
    ).length;

    const clearFilters = () => {
        setSearch("");
        setStatusFilter("All");
        setCourseFilter("All");
        setBatchFilter("All");
        setSortBy("newest");
        setSelectedIds([]);
    };

    const toggleSelected = (id) => {
        setSelectedIds((current) =>
            current.includes(id)
                ? current.filter((selectedId) => selectedId !== id)
                : [...current, id]
        );
    };

    const toggleSelectAll = () => {
        const visibleIds = filteredRequests.map((request) => request.id);

        if (allVisibleSelected) {
            setSelectedIds((current) =>
                current.filter((id) => !visibleIds.includes(id))
            );
            return;
        }

        setSelectedIds((current) => [
            ...new Set([...current, ...visibleIds]),
        ]);
    };

    const updateRequestStatus = (id, status, reviewNote = "") => {
        setRequests((current) =>
            current.map((request) =>
                request.id === id
                    ? {
                        ...request,
                        status,
                        reviewNote,
                        updatedAt: new Date().toISOString(),
                        reviewedBy: "College Admin",
                    }
                    : request
            )
        );

        setActiveRequest(null);

        const messages = {
            Pending: "Request moved back to pending.",
            "Under Review": "Request moved to review.",
            Approved: "Request approved successfully.",
            Rejected: "Request rejected.",
        };

        notify(messages[status] || "Request updated.");
    };

    const bulkUpdateStatus = (status) => {
        if (selectedIds.length === 0) {
            notify("Select at least one request first.", "error");
            return;
        }

        const selected = new Set(selectedIds);

        setRequests((current) =>
            current.map((request) =>
                selected.has(request.id)
                    ? {
                        ...request,
                        status,
                        updatedAt: new Date().toISOString(),
                        reviewedBy: "College Admin",
                        reviewNote: request.reviewNote || "",
                    }
                    : request
            )
        );

        const count = selectedIds.length;
        setSelectedIds([]);

        notify(`${count} request${count === 1 ? "" : "s"} updated.`);
    };

    const createRequest = (form) => {
        const duplicateEmail = requests.some(
            (request) =>
                request.email.toLowerCase() === form.email.toLowerCase()
        );

        if (duplicateEmail) {
            notify("A request with this email already exists.", "error");
            return;
        }

        const now = new Date().toISOString();

        const newRequest = {
            ...form,
            id: makeId(),
            status: "Pending",
            requestedAt: now,
            updatedAt: now,
            reviewedBy: "",
            reviewNote: "",
        };

        setRequests((current) => [newRequest, ...current]);

        setSearch("");
        setStatusFilter("All");
        setCourseFilter("All");
        setBatchFilter("All");
        setSortBy("newest");
        setSelectedIds([]);
        setShowCreateModal(false);

        notify("Student request created successfully.");
    };

    const resetDemoData = () => {
        const confirmed = window.confirm(
            "Reset all requests to the original sample data? Your current local changes will be replaced."
        );

        if (!confirmed) return;

        setRequests(createSeedRequests());
        clearFilters();

        notify("Sample request data restored.");
    };

    const statusTabs = [
        {
            label: "All requests",
            value: "All",
            count: stats.total,
            icon: ClipboardList,
        },
        {
            label: "Pending",
            value: "Pending",
            count: stats.pending,
            icon: Clock3,
        },
        {
            label: "Under review",
            value: "Under Review",
            count: stats.review,
            icon: CircleDashed,
        },
        {
            label: "Approved",
            value: "Approved",
            count: stats.approved,
            icon: CheckCircle2,
        },
        {
            label: "Rejected",
            value: "Rejected",
            count: stats.rejected,
            icon: XCircle,
        },
    ];

    return (
        <div className="min-h-full w-full bg-[#071421] text-slate-200">
            <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
                {/* HEADER */}

                <motion.section
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.35 }}
                    className="relative overflow-hidden rounded-3xl border border-[#24445d] bg-gradient-to-br from-[#102a40] via-[#0b1e30] to-[#091725] p-5 sm:p-7 xl:p-8"
                >
                    <div className="pointer-events-none absolute -right-16 -top-28 h-72 w-72 rounded-full bg-[#51bdff]/10 blur-3xl" />

                    <div className="pointer-events-none absolute bottom-[-100px] left-[35%] h-56 w-56 rounded-full bg-[#357de2]/10 blur-3xl" />

                    <div className="relative flex flex-col justify-between gap-6 xl:flex-row xl:items-center">
                        <div className="max-w-2xl">
                            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3c6986] bg-[#16354c]/70 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-[#9ce1ff]">
                                <Sparkles size={13} />
                                College workspace
                            </div>

                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl xl:text-4xl">
                                Student Requests

                                <span className="mt-1 block bg-gradient-to-r from-[#79d5ff] to-[#c1f0ff] bg-clip-text text-transparent">
                                    Review. Approve. Empower.
                                </span>
                            </h1>

                            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400 sm:text-[15px]">
                                Manage enrollment applications, review student details and
                                keep every course request moving through the right stage.
                            </p>

                            <div className="mt-5 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                                <span className="inline-flex items-center gap-2 rounded-lg border border-[#2b4c63] bg-[#0a1c2b]/70 px-3 py-2">
                                    <ShieldCheck size={14} className="text-[#80d8ff]" />
                                    College management
                                </span>

                                <span className="inline-flex items-center gap-2 rounded-lg border border-[#2b4c63] bg-[#0a1c2b]/70 px-3 py-2">
                                    <RefreshCw size={14} className="text-[#80d8ff]" />
                                    Page updates
                                </span>
                            </div>
                        </div>

                        <div className="flex flex-col gap-2 sm:flex-row xl:min-w-fit xl:flex-col">
                            <button
                                type="button"
                                onClick={() => setShowCreateModal(true)}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#70ccf7] to-[#a1e6ff] px-5 py-3 text-sm font-bold text-[#061624] shadow-[0_8px_30px_rgba(94,192,239,0.16)] transition duration-200 hover:-translate-y-0.5 hover:brightness-110"
                            >
                                <Plus size={17} />
                                Create request
                            </button>

                            <button
                                type="button"
                                onClick={() => downloadCSV(filteredRequests)}
                                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#35566f] bg-[#112b40]/80 px-5 py-3 text-sm font-semibold text-[#d3efff] transition duration-200 hover:border-[#6dc9f5]/60 hover:bg-[#173851]"
                            >
                                <Download size={16} />
                                Export CSV
                            </button>
                        </div>
                    </div>
                </motion.section>

                {/* STATISTICS */}

                <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    <StatCard
                        title="Total requests"
                        value={stats.total}
                        description="All enrollment applications"
                        icon={Users}
                        accent="#70CCF7"
                        delay={0.04}
                    />

                    <StatCard
                        title="Pending"
                        value={stats.pending}
                        description="Waiting for a decision"
                        icon={Clock3}
                        accent="#FBBF24"
                        delay={0.08}
                    />

                    <StatCard
                        title="Under review"
                        value={stats.review}
                        description="Currently being checked"
                        icon={CircleDashed}
                        accent="#67C9FF"
                        delay={0.12}
                    />

                    <StatCard
                        title="Approved"
                        value={stats.approved}
                        description="Accepted for enrollment"
                        icon={CheckCircle2}
                        accent="#5EE6B1"
                        delay={0.16}
                    />

                    <StatCard
                        title="Rejected"
                        value={stats.rejected}
                        description="Not approved"
                        icon={XCircle}
                        accent="#FDA4AF"
                        delay={0.2}
                    />
                </section>

                {/* APPLICATIONS */}

                <section className="overflow-hidden rounded-2xl border border-[#20384d] bg-[#091827]">
                    <div className="flex flex-col justify-between gap-4 border-b border-[#20384d] px-4 py-5 sm:px-6 lg:flex-row lg:items-center">
                        <div>
                            <div className="flex flex-wrap items-center gap-2">
                                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#2a526c] bg-[#123047] text-[#8bdcff]">
                                    <ClipboardList size={18} />
                                </div>

                                <h2 className="text-lg font-bold text-white">
                                    Enrollment applications
                                </h2>

                                <span className="rounded-lg border border-[#29475d] bg-[#102638] px-2 py-1 text-xs font-semibold text-[#a6dfff]">
                                    {filteredRequests.length} results
                                </span>
                            </div>

                            <p className="mt-2 text-xs leading-5 text-slate-500">
                                Search, filter and manage each student's enrollment request.
                            </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={() => searchRef.current?.focus()}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#29445b] bg-[#0d2030] px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-[#122b40]"
                            >
                                <Search size={14} />
                                Search
                            </button>

                            <button
                                type="button"
                                onClick={resetDemoData}
                                className="inline-flex items-center gap-2 rounded-xl border border-[#29445b] bg-[#0d2030] px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-[#5595bb] hover:text-white"
                            >
                                <RotateCcw size={14} />
                                Reset demo
                            </button>
                        </div>
                    </div>

                    {/* STATUS TABS */}

                    <div className="border-b border-[#20384d] bg-[#0a1928] px-3 pt-3 sm:px-5">
                        <div className="flex gap-1.5 overflow-x-auto pb-0.5">
                            {statusTabs.map((tab) => {
                                const TabIcon = tab.icon;
                                const active = statusFilter === tab.value;

                                return (
                                    <button
                                        key={tab.value}
                                        type="button"
                                        onClick={() => setStatusFilter(tab.value)}
                                        className={`relative flex shrink-0 items-center gap-2 rounded-t-xl px-3.5 py-3 text-xs font-semibold transition ${active
                                            ? "bg-[#112b40] text-[#a2e2ff]"
                                            : "text-slate-500 hover:bg-[#0d2234] hover:text-slate-200"
                                            }`}
                                    >
                                        <TabIcon size={14} />

                                        {tab.label}

                                        <span
                                            className={`rounded-md px-1.5 py-0.5 text-[10px] ${active
                                                ? "bg-[#24516d] text-[#b9eaff]"
                                                : "bg-[#17293a] text-slate-500"
                                                }`}
                                        >
                                            {tab.count}
                                        </span>

                                        {active && (
                                            <motion.span
                                                layoutId="college-request-tab-indicator"
                                                className="absolute inset-x-3 bottom-0 h-[2px] rounded-full bg-[#7ad6ff]"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* FILTERS */}

                    <div className="space-y-4 border-b border-[#20384d] p-4 sm:p-5">
                        <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(220px,1.7fr)_repeat(3,minmax(150px,1fr))]">
                            <div className="relative">
                                <Search
                                    size={17}
                                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                                />

                                <input
                                    ref={searchRef}
                                    value={search}
                                    onChange={(event) => setSearch(event.target.value)}
                                    placeholder="Search name, email, course or ID..."
                                    className="min-h-[44px] w-full rounded-xl border border-[#263e54] bg-[#0a1b2b] py-3 pl-10 pr-10 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-[#67c8fa] focus:ring-2 focus:ring-[#67c8fa]/10"
                                />

                                {search && (
                                    <button
                                        type="button"
                                        onClick={() => setSearch("")}
                                        aria-label="Clear search"
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                                    >
                                        <X size={15} />
                                    </button>
                                )}
                            </div>

                            <PremiumSelect
                                value={courseFilter}
                                options={COURSE_OPTIONS}
                                onChange={setCourseFilter}
                                icon={BookOpen}
                            />

                            <PremiumSelect
                                value={batchFilter}
                                options={BATCH_OPTIONS}
                                onChange={setBatchFilter}
                                icon={CalendarDays}
                            />

                            <PremiumSelect
                                value={sortBy}
                                options={SORT_OPTIONS}
                                onChange={setSortBy}
                                icon={SlidersHorizontal}
                            />
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Filter size={14} className="text-[#78d3ff]" />

                                <span>
                                    Showing{" "}
                                    <span className="font-semibold text-slate-300">
                                        {filteredRequests.length}
                                    </span>{" "}
                                    of{" "}
                                    <span className="font-semibold text-slate-300">
                                        {requests.length}
                                    </span>{" "}
                                    requests
                                </span>

                                {hasActiveFilters && (
                                    <span className="rounded-md border border-[#315a74] bg-[#102d42] px-2 py-1 text-[10px] font-semibold text-[#91dfff]">
                                        Filters active
                                    </span>
                                )}
                            </div>

                            {hasActiveFilters && (
                                <button
                                    type="button"
                                    onClick={clearFilters}
                                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#7bd3ff] transition hover:text-white"
                                >
                                    <RotateCcw size={13} />
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* BULK ACTIONS */}

                    <AnimatePresence>
                        {selectedIds.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, height: 0, y: -5 }}
                                animate={{ opacity: 1, height: "auto", y: 0 }}
                                exit={{ opacity: 0, height: 0, y: -5 }}
                                className="overflow-hidden border-b border-[#2b5069] bg-[#10273a]"
                            >
                                <div className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                                    <div className="flex items-center gap-2 text-sm font-semibold text-[#a5e4ff]">
                                        <CheckCheck size={17} />
                                        {selectedIds.length} selected

                                        <span className="hidden text-xs font-normal text-slate-500 sm:inline">
                                            ({visibleSelectedCount} visible in current results)
                                        </span>
                                    </div>

                                    <div className="flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => bulkUpdateStatus("Approved")}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/25 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
                                        >
                                            <CheckCircle2 size={14} />
                                            Approve
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => bulkUpdateStatus("Under Review")}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-sky-400/25 bg-sky-400/10 px-3 py-2 text-xs font-semibold text-sky-300 transition hover:bg-sky-400/20"
                                        >
                                            <CircleDashed size={14} />
                                            Review
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => bulkUpdateStatus("Rejected")}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-rose-400/25 bg-rose-400/10 px-3 py-2 text-xs font-semibold text-rose-300 transition hover:bg-rose-400/20"
                                        >
                                            <XCircle size={14} />
                                            Reject
                                        </button>

                                        <button
                                            type="button"
                                            onClick={() => setSelectedIds([])}
                                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#314b60] bg-[#102033] px-3 py-2 text-xs font-semibold text-slate-400 transition hover:text-white"
                                        >
                                            <X size={14} />
                                            Clear
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* DESKTOP TABLE */}

                    <div className="hidden overflow-x-auto lg:block">
                        <table className="w-full min-w-[1060px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-[#20384d] bg-[#0a1927]">
                                    <th className="w-12 px-5 py-4">
                                        <input
                                            type="checkbox"
                                            checked={allVisibleSelected}
                                            onChange={toggleSelectAll}
                                            aria-label="Select all visible requests"
                                            className="h-4 w-4 cursor-pointer rounded border-[#42627a] bg-[#0b1c2a] accent-[#6dcaf7]"
                                        />
                                    </th>

                                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                                        Student
                                    </th>

                                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                                        Course / Batch
                                    </th>

                                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                                        Submitted
                                    </th>

                                    <th className="px-3 py-4 text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                                        Status
                                    </th>

                                    <th className="px-3 py-4 text-right text-[10px] font-bold uppercase tracking-[0.13em] text-slate-500">
                                        Actions
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                <AnimatePresence initial={false}>
                                    {filteredRequests.map((request, index) => (
                                        <motion.tr
                                            key={request.id}
                                            layout
                                            initial={{ opacity: 0, y: 7 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{
                                                duration: 0.2,
                                                delay: Math.min(index * 0.025, 0.15),
                                            }}
                                            className={`group border-b border-[#1b3042]/90 transition-colors hover:bg-[#0d2233] ${selectedIds.includes(request.id)
                                                ? "bg-[#102b40]/65"
                                                : ""
                                                }`}
                                        >
                                            <td className="px-5 py-4">
                                                <input
                                                    type="checkbox"
                                                    checked={selectedIds.includes(request.id)}
                                                    onChange={() => toggleSelected(request.id)}
                                                    aria-label={`Select ${request.studentName}`}
                                                    className="h-4 w-4 cursor-pointer rounded border-[#42627a] bg-[#0b1c2a] accent-[#6dcaf7]"
                                                />
                                            </td>

                                            <td className="px-3 py-4">
                                                <div className="flex items-center gap-3">
                                                    <Avatar name={request.studentName} />

                                                    <div className="min-w-0">
                                                        <p className="max-w-[190px] truncate text-sm font-semibold text-slate-100 transition group-hover:text-[#9ce2ff]">
                                                            {request.studentName}
                                                        </p>

                                                        <p className="mt-1 max-w-[200px] truncate text-xs text-slate-500">
                                                            {request.email}
                                                        </p>

                                                        <p className="mt-1 text-[10px] text-slate-600">
                                                            {request.id}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>

                                            <td className="px-3 py-4">
                                                <div className="max-w-[220px]">
                                                    <p className="truncate text-sm font-medium text-slate-200">
                                                        {request.course}
                                                    </p>

                                                    <p className="mt-1.5 inline-flex items-center gap-1.5 text-xs text-slate-500">
                                                        <CalendarDays size={12} />
                                                        {request.batch}
                                                    </p>
                                                </div>
                                            </td>

                                            <td className="px-3 py-4">
                                                <p className="whitespace-nowrap text-sm text-slate-300">
                                                    {formatDate(request.requestedAt)}
                                                </p>

                                                <p className="mt-1 text-[11px] text-slate-600">
                                                    {new Date(request.requestedAt).toLocaleTimeString(
                                                        "en-IN",
                                                        {
                                                            hour: "2-digit",
                                                            minute: "2-digit",
                                                        }
                                                    )}
                                                </p>
                                            </td>

                                            <td className="px-3 py-4">
                                                <StatusBadge status={request.status} />
                                            </td>

                                            <td className="px-3 py-4">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveRequest(request)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#2d4d64] bg-[#102539] px-3 py-2 text-xs font-semibold text-[#9cdeff] transition hover:border-[#66c7f8]/60 hover:bg-[#173b53]"
                                                    >
                                                        <Eye size={14} />
                                                        Review
                                                    </button>

                                                    {request.status === "Pending" && (
                                                        <button
                                                            type="button"
                                                            title="Approve request"
                                                            onClick={() =>
                                                                updateRequestStatus(
                                                                    request.id,
                                                                    "Approved",
                                                                    request.reviewNote || ""
                                                                )
                                                            }
                                                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-400/20 bg-emerald-400/10 text-emerald-300 transition hover:bg-emerald-400/20"
                                                        >
                                                            <Check size={16} />
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        title="More actions"
                                                        onClick={() => setActiveRequest(request)}
                                                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#263e53] bg-[#0b1d2b] text-slate-500 transition hover:text-white"
                                                    >
                                                        <MoreHorizontal size={17} />
                                                    </button>
                                                </div>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>

                        {filteredRequests.length === 0 && (
                            <EmptyState
                                onReset={clearFilters}
                                hasFilters={hasActiveFilters}
                            />
                        )}
                    </div>

                    {/* MOBILE / TABLET CARDS */}

                    <div className="space-y-3 p-3 sm:p-4 lg:hidden">
                        {filteredRequests.length > 0 && (
                            <div className="flex items-center justify-between gap-3 rounded-xl border border-[#20384d] bg-[#0b1c2b] px-3.5 py-3">
                                <label className="flex cursor-pointer items-center gap-2.5 text-xs font-medium text-slate-400">
                                    <input
                                        type="checkbox"
                                        checked={allVisibleSelected}
                                        onChange={toggleSelectAll}
                                        className="h-4 w-4 cursor-pointer rounded border-[#42627a] bg-[#0b1c2a] accent-[#6dcaf7]"
                                    />
                                    Select all visible
                                </label>

                                <span className="text-xs text-slate-500">
                                    {filteredRequests.length} requests
                                </span>
                            </div>
                        )}

                        <AnimatePresence initial={false}>
                            {filteredRequests.map((request, index) => (
                                <motion.article
                                    key={request.id}
                                    layout
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -6 }}
                                    transition={{
                                        duration: 0.2,
                                        delay: Math.min(index * 0.025, 0.15),
                                    }}
                                    className={`rounded-2xl border p-4 transition ${selectedIds.includes(request.id)
                                        ? "border-[#4b91b7] bg-[#102a3e]"
                                        : "border-[#20384d] bg-[#0a1b2a]"
                                        }`}
                                >
                                    <div className="flex items-start gap-3">
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.includes(request.id)}
                                            onChange={() => toggleSelected(request.id)}
                                            aria-label={`Select ${request.studentName}`}
                                            className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded border-[#42627a] bg-[#0b1c2a] accent-[#6dcaf7]"
                                        />

                                        <Avatar name={request.studentName} />

                                        <div className="min-w-0 flex-1">
                                            <div className="flex flex-wrap items-start justify-between gap-2">
                                                <div className="min-w-0">
                                                    <h3 className="break-words text-sm font-bold text-white">
                                                        {request.studentName}
                                                    </h3>

                                                    <p className="mt-1 break-all text-xs text-slate-500">
                                                        {request.email}
                                                    </p>
                                                </div>

                                                <StatusBadge status={request.status} />
                                            </div>

                                            <div className="mt-4 rounded-xl border border-[#20384d] bg-[#0c2030] p-3">
                                                <p className="break-words text-sm font-semibold text-slate-200">
                                                    {request.course}
                                                </p>

                                                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-500">
                                                    <span className="inline-flex items-center gap-1.5">
                                                        <CalendarDays size={13} />
                                                        {request.batch}
                                                    </span>

                                                    <span className="inline-flex items-center gap-1.5">
                                                        <Clock3 size={13} />
                                                        {formatDate(request.requestedAt)}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                                                <span className="text-[10px] text-slate-600">
                                                    {request.id}
                                                </span>

                                                <div className="flex flex-wrap gap-2">
                                                    {request.status === "Pending" && (
                                                        <button
                                                            type="button"
                                                            onClick={() =>
                                                                updateRequestStatus(
                                                                    request.id,
                                                                    "Approved",
                                                                    request.reviewNote || ""
                                                                )
                                                            }
                                                            className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/10 px-3 py-2 text-xs font-semibold text-emerald-300 transition hover:bg-emerald-400/20"
                                                        >
                                                            <Check size={14} />
                                                            Approve
                                                        </button>
                                                    )}

                                                    <button
                                                        type="button"
                                                        onClick={() => setActiveRequest(request)}
                                                        className="inline-flex items-center gap-1.5 rounded-lg border border-[#31536d] bg-[#123047] px-3 py-2 text-xs font-semibold text-[#a5e3ff] transition hover:bg-[#1a3f59]"
                                                    >
                                                        <Eye size={14} />
                                                        Review details
                                                        <ArrowUpRight size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </motion.article>
                            ))}
                        </AnimatePresence>

                        {filteredRequests.length === 0 && (
                            <EmptyState
                                onReset={clearFilters}
                                hasFilters={hasActiveFilters}
                            />
                        )}
                    </div>

                    {/* FOOTER */}

                    <div className="flex flex-col gap-3 border-t border-[#20384d] bg-[#081624] px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                        <p className="text-xs text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-300">
                                {filteredRequests.length}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-300">
                                {requests.length}
                            </span>{" "}
                            student requests
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#5ee6b1]" />
                                Approved
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#fbbf24]" />
                                Pending
                            </span>

                            <span className="inline-flex items-center gap-1.5">
                                <span className="h-1.5 w-1.5 rounded-full bg-[#67c9ff]" />
                                Under review
                            </span>
                        </div>
                    </div>
                </section>

                {/* DEMO NOTICE */}

                <div className="flex items-start gap-2 px-1 pb-2 text-[11px] leading-5 text-slate-600">
                    <FileText size={14} className="mt-0.5 shrink-0" />

                    <p>
                        Demo mode: requests are saved in this browser's local storage.
                        They are not synced with a backend API or shared with other users.
                    </p>
                </div>
            </div>

            {/* MODALS */}

            <RequestDetailsModal
                request={activeRequest}
                onClose={() => setActiveRequest(null)}
                onSave={updateRequestStatus}
            />

            {showCreateModal && (
                <AddRequestModal
                    onClose={() => setShowCreateModal(false)}
                    onCreate={createRequest}
                />
            )}

            {/* TOAST */}

            <AnimatePresence>
                {toast && (
                    <motion.div
                        key="college-requests-toast"
                        initial={{ opacity: 0, y: 14, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        className="fixed bottom-4 right-4 z-[10010] flex max-w-[calc(100vw-32px)] items-center gap-3 rounded-2xl border border-[#31536b] bg-[#0b1c2b] px-4 py-3.5 shadow-[0_16px_50px_rgba(0,0,0,0.45)] sm:bottom-6 sm:right-6"
                    >
                        <div
                            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${toast.type === "error"
                                ? "bg-rose-400/10 text-rose-300"
                                : "bg-emerald-400/10 text-emerald-300"
                                }`}
                        >
                            {toast.type === "error" ? (
                                <AlertTriangle size={16} />
                            ) : (
                                <CheckCircle2 size={16} />
                            )}
                        </div>

                        <p className="text-sm font-medium text-slate-200">
                            {toast.message}
                        </p>

                        <button
                            type="button"
                            onClick={() => setToast(null)}
                            className="ml-1 text-slate-500 transition hover:text-white"
                            aria-label="Dismiss notification"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

/* Explicit default export for AppRoutes.jsx */
export default CollegeRequestsPage;