import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
    Activity,
    AlertCircle,
    ArrowDownUp,
    ArrowRight,
    ArrowUpRight,
    Ban,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    Clock3,
    Download,
    Eye,
    FileText,
    Filter,
    Fingerprint,
    Globe,
    History,
    Laptop,
    LockKeyhole,
    RefreshCw,
    Search,
    ShieldAlert,
    ShieldCheck,
    SlidersHorizontal,
    User,
    UserCog,
    Users,
    X,
    Zap,
} from "lucide-react";

/* =========================================================
   CODEFACULTY — ADMIN AUDIT LOGS
   Premium Orange + White Theme
   Read-only activity and security records
   Demo records stored in browser localStorage
========================================================= */

const STORAGE_KEY = "codefaculty_admin_audit_logs_v3";
const PAGE_SIZE = 8;

/* =========================================================
   FILTER MASTER DATA
========================================================= */

const MODULES = [
    "Authentication",
    "Students",
    "Trainers",
    "Colleges",
    "Programs",
    "Assignments",
    "Demo Schedules",
    "Payments",
    "Notifications",
    "Admin Roles",
    "Settings",
    "System",
];

const ACTION_TYPES = [
    "LOGIN",
    "LOGOUT",
    "CREATE",
    "UPDATE",
    "DELETE",
    "APPROVE",
    "REJECT",
    "EXPORT",
    "SECURITY",
];

const ACTOR_ROLES = [
    "Super Admin",
    "Admin",
    "Trainer",
    "College",
    "Student",
    "System",
];

const RESULTS = [
    "Success",
    "Failed",
    "Blocked",
];

const SEVERITIES = [
    "Info",
    "Warning",
    "Critical",
];

const SORT_OPTIONS = [
    { label: "Newest first", value: "newest" },
    { label: "Oldest first", value: "oldest" },
    { label: "Highest severity", value: "severity-desc" },
    { label: "Actor: A to Z", value: "actor-asc" },
];

const MODULE_OPTIONS = [
    { label: "All modules", value: "All" },
    ...MODULES.map((item) => ({
        label: item,
        value: item,
    })),
];

const ACTION_OPTIONS = [
    { label: "All actions", value: "All" },
    ...ACTION_TYPES.map((item) => ({
        label: item,
        value: item,
    })),
];

const ROLE_OPTIONS = [
    { label: "All roles", value: "All" },
    ...ACTOR_ROLES.map((item) => ({
        label: item,
        value: item,
    })),
];

const RESULT_OPTIONS = [
    { label: "All results", value: "All" },
    ...RESULTS.map((item) => ({
        label: item,
        value: item,
    })),
];

const SEVERITY_OPTIONS = [
    { label: "All severities", value: "All" },
    ...SEVERITIES.map((item) => ({
        label: item,
        value: item,
    })),
];

/* =========================================================
   INITIAL DEMO AUDIT RECORDS
========================================================= */

const INITIAL_LOGS = [
    {
        id: "LOG-9001",
        actor: "Aditya Sharma",
        email: "admin@codefaculty.in",
        role: "Super Admin",
        action: "LOGIN",
        module: "Authentication",
        entity: "Admin Account",
        description: "Super Admin successfully signed in to the platform.",
        result: "Success",
        severity: "Info",
        ip: "103.25.68.142",
        location: "Jaipur, Rajasthan, India",
        device: "Windows 11 · Chrome",
        timestamp: "2026-10-30T10:24:35",
        details: {
            loginMethod: "Email and Password",
            sessionStatus: "Active",
            twoFactor: "Enabled",
            endpoint: "/api/auth/login",
        },
    },
    {
        id: "LOG-9002",
        actor: "Aditya Sharma",
        email: "admin@codefaculty.in",
        role: "Super Admin",
        action: "UPDATE",
        module: "Trainer Assignments",
        entity: "TA-4201",
        description: "Updated the assignment deadline and priority for a trainer task.",
        result: "Success",
        severity: "Info",
        ip: "103.25.68.142",
        location: "Jaipur, Rajasthan, India",
        device: "Windows 11 · Chrome",
        timestamp: "2026-10-30T10:18:12",
        details: {
            assignmentId: "TA-4201",
            previousDueDate: "2026-10-31",
            updatedDueDate: "2026-11-02",
            previousPriority: "Normal",
            updatedPriority: "High",
        },
    },
    {
        id: "LOG-9003",
        actor: "Neha Verma",
        email: "neha.verma@example.com",
        role: "Admin",
        action: "CREATE",
        module: "Notifications",
        entity: "NT-3011",
        description: "Created a new platform announcement for all students.",
        result: "Success",
        severity: "Info",
        ip: "103.26.91.28",
        location: "Delhi, India",
        device: "macOS · Chrome",
        timestamp: "2026-10-30T09:50:00",
        details: {
            notificationId: "NT-3011",
            audience: "Students",
            channel: "In-app",
            status: "Draft",
        },
    },
    {
        id: "LOG-9004",
        actor: "Rohit Kumar",
        email: "rohit.kumar@example.com",
        role: "Trainer",
        action: "LOGIN",
        module: "Authentication",
        entity: "Trainer Account",
        description: "Trainer successfully signed in to the trainer workspace.",
        result: "Success",
        severity: "Info",
        ip: "49.36.120.18",
        location: "Jaipur, Rajasthan, India",
        device: "Android · Chrome",
        timestamp: "2026-10-30T09:35:42",
        details: {
            loginMethod: "Email and Password",
            accountStatus: "Active",
            workspace: "Trainer Portal",
        },
    },
    {
        id: "LOG-9005",
        actor: "Unknown User",
        email: "unknown@example.com",
        role: "System",
        action: "SECURITY",
        module: "Authentication",
        entity: "Login Attempt",
        description: "Multiple unsuccessful login attempts were detected for an account.",
        result: "Blocked",
        severity: "Critical",
        ip: "185.220.101.15",
        location: "Unknown Location",
        device: "Unknown Device",
        timestamp: "2026-10-30T08:48:20",
        details: {
            failedAttempts: 8,
            securityRule: "Repeated Login Failure",
            actionTaken: "Temporary Block",
            accountAffected: "admin@codefaculty.in",
        },
    },
    {
        id: "LOG-9006",
        actor: "Aditya Sharma",
        email: "admin@codefaculty.in",
        role: "Super Admin",
        action: "APPROVE",
        module: "Trainers",
        entity: "TR-2081",
        description: "Approved a trainer profile after reviewing verification details.",
        result: "Success",
        severity: "Info",
        ip: "103.25.68.142",
        location: "Jaipur, Rajasthan, India",
        device: "Windows 11 · Chrome",
        timestamp: "2026-10-29T17:40:15",
        details: {
            trainerId: "TR-2081",
            previousStatus: "Pending",
            newStatus: "Approved",
            reviewedBy: "Aditya Sharma",
        },
    },
    {
        id: "LOG-9007",
        actor: "Priya Singh",
        email: "priya.singh@example.com",
        role: "College",
        action: "UPDATE",
        module: "Colleges",
        entity: "COL-1042",
        description: "Updated the institution contact information and coordinator details.",
        result: "Success",
        severity: "Info",
        ip: "122.161.45.81",
        location: "Kota, Rajasthan, India",
        device: "Windows 10 · Edge",
        timestamp: "2026-10-29T16:22:10",
        details: {
            collegeId: "COL-1042",
            updatedFields: "Contact Number, Academic Coordinator",
            accountType: "College Admin",
        },
    },
    {
        id: "LOG-9008",
        actor: "Aditya Sharma",
        email: "admin@codefaculty.in",
        role: "Super Admin",
        action: "EXPORT",
        module: "Students",
        entity: "Students CSV Report",
        description: "Exported the student directory for administrative reporting.",
        result: "Success",
        severity: "Info",
        ip: "103.25.68.142",
        location: "Jaipur, Rajasthan, India",
        device: "Windows 11 · Chrome",
        timestamp: "2026-10-29T15:10:00",
        details: {
            exportFormat: "CSV",
            exportedRecords: 340,
            reportName: "Student Directory",
        },
    },
    {
        id: "LOG-9009",
        actor: "System Monitor",
        email: "system@codefaculty.in",
        role: "System",
        action: "SECURITY",
        module: "System",
        entity: "API Rate Limit",
        description: "A request rate threshold was exceeded and the request was rejected.",
        result: "Blocked",
        severity: "Warning",
        ip: "45.118.32.10",
        location: "Mumbai, India",
        device: "API Client",
        timestamp: "2026-10-29T13:42:30",
        details: {
            rule: "Rate Limiting",
            requestCount: 145,
            allowedRequests: 100,
            window: "60 seconds",
        },
    },
    {
        id: "LOG-9010",
        actor: "Aditya Sharma",
        email: "admin@codefaculty.in",
        role: "Super Admin",
        action: "UPDATE",
        module: "Settings",
        entity: "Platform Configuration",
        description: "Updated the platform notification preference settings.",
        result: "Success",
        severity: "Info",
        ip: "103.25.68.142",
        location: "Jaipur, Rajasthan, India",
        device: "Windows 11 · Chrome",
        timestamp: "2026-10-28T12:10:25",
        details: {
            configuration: "Notification Preferences",
            updatedSettings: "Email Alerts",
            previousValue: "Disabled",
            newValue: "Enabled",
        },
    },
    {
        id: "LOG-9011",
        actor: "Aman Gupta",
        email: "aman.gupta@example.com",
        role: "Student",
        action: "LOGIN",
        module: "Authentication",
        entity: "Student Account",
        description: "Student account successfully signed in.",
        result: "Success",
        severity: "Info",
        ip: "106.220.14.32",
        location: "Jodhpur, Rajasthan, India",
        device: "Android · Chrome",
        timestamp: "2026-10-28T10:55:44",
        details: {
            loginMethod: "Email and Password",
            accountStatus: "Active",
        },
    },
    {
        id: "LOG-9012",
        actor: "Aditya Sharma",
        email: "admin@codefaculty.in",
        role: "Super Admin",
        action: "DELETE",
        module: "Programs",
        entity: "PRG-104",
        description: "Removed an inactive demo program from the program directory.",
        result: "Success",
        severity: "Warning",
        ip: "103.25.68.142",
        location: "Jaipur, Rajasthan, India",
        device: "Windows 11 · Chrome",
        timestamp: "2026-10-27T17:35:00",
        details: {
            programId: "PRG-104",
            programName: "Legacy Web Development",
            reason: "Inactive Program",
        },
    },
    {
        id: "LOG-9013",
        actor: "System Monitor",
        email: "system@codefaculty.in",
        role: "System",
        action: "SECURITY",
        module: "Payments",
        entity: "PAY-8105",
        description: "Payment gateway returned a failed transaction response.",
        result: "Failed",
        severity: "Warning",
        ip: "172.16.12.25",
        location: "Gateway Server",
        device: "Payment API",
        timestamp: "2026-10-27T15:25:00",
        details: {
            paymentId: "PAY-8105",
            gateway: "Razorpay",
            responseCode: "PAYMENT_FAILED",
            actionTaken: "Transaction Marked Failed",
        },
    },
    {
        id: "LOG-9014",
        actor: "Aditya Sharma",
        email: "admin@codefaculty.in",
        role: "Super Admin",
        action: "UPDATE",
        module: "Admin Roles",
        entity: "ROLE-ADMIN-02",
        description: "Updated permissions assigned to an administrator role.",
        result: "Success",
        severity: "Warning",
        ip: "103.25.68.142",
        location: "Jaipur, Rajasthan, India",
        device: "Windows 11 · Chrome",
        timestamp: "2026-10-26T11:15:00",
        details: {
            roleName: "Content Administrator",
            changedPermissions: "Program Management, Notifications",
            modifiedBy: "Aditya Sharma",
        },
    },
    {
        id: "LOG-9015",
        actor: "System Monitor",
        email: "system@codefaculty.in",
        role: "System",
        action: "SECURITY",
        module: "System",
        entity: "Session Monitor",
        description: "An expired session was automatically terminated.",
        result: "Success",
        severity: "Info",
        ip: "10.0.0.18",
        location: "Internal System",
        device: "Session Service",
        timestamp: "2026-10-25T18:20:00",
        details: {
            sessionState: "Expired",
            termination: "Automatic",
            service: "Session Manager",
        },
    },
];

/* =========================================================
   HELPERS
========================================================= */

function formatNumber(value) {
    return new Intl.NumberFormat("en-IN").format(Number(value || 0));
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

function formatDateTime(value) {
    if (!value) return "—";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "—";

    return date.toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}

function getDateInputValue(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function getInitials(value = "") {
    return value
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase())
        .join("");
}

function escapeCSV(value) {
    return `"${String(value ?? "").replace(/"/g, '""')}"`;
}

function getSeverityRank(severity) {
    return {
        Critical: 3,
        Warning: 2,
        Info: 1,
    }[severity] || 0;
}

function getActionColor(action) {
    const colors = {
        LOGIN: "border-blue-200 bg-blue-50 text-blue-700",
        LOGOUT: "border-slate-200 bg-slate-100 text-slate-600",
        CREATE: "border-emerald-200 bg-emerald-50 text-emerald-700",
        UPDATE: "border-orange-200 bg-orange-50 text-[#C94524]",
        DELETE: "border-rose-200 bg-rose-50 text-rose-700",
        APPROVE: "border-emerald-200 bg-emerald-50 text-emerald-700",
        REJECT: "border-rose-200 bg-rose-50 text-rose-700",
        EXPORT: "border-violet-200 bg-violet-50 text-violet-700",
        SECURITY: "border-amber-200 bg-amber-50 text-amber-700",
    };

    return colors[action] || colors.UPDATE;
}

function getSeverityConfig(severity) {
    return {
        Info: {
            icon: Activity,
            classes: "border-blue-200 bg-blue-50 text-blue-700",
            dot: "bg-blue-500",
        },
        Warning: {
            icon: AlertCircle,
            classes: "border-amber-200 bg-amber-50 text-amber-700",
            dot: "bg-amber-500",
        },
        Critical: {
            icon: ShieldAlert,
            classes: "border-rose-200 bg-rose-50 text-rose-700",
            dot: "bg-rose-500",
        },
    }[severity] || {
        icon: Activity,
        classes: "border-blue-200 bg-blue-50 text-blue-700",
        dot: "bg-blue-500",
    };
}

function getResultConfig(result) {
    return {
        Success: {
            icon: CheckCircle2,
            classes: "border-emerald-200 bg-emerald-50 text-emerald-700",
        },
        Failed: {
            icon: AlertCircle,
            classes: "border-rose-200 bg-rose-50 text-rose-700",
        },
        Blocked: {
            icon: Ban,
            classes: "border-amber-200 bg-amber-50 text-amber-700",
        },
    }[result] || {
        icon: Activity,
        classes: "border-slate-200 bg-slate-50 text-slate-600",
    };
}

/* =========================================================
   PREMIUM SCROLLBAR STYLES
========================================================= */

function AuditPremiumStyles() {
    return (
        <style>{`
      .admin-audit-page {
        min-width: 0;
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .admin-audit-page *,
      .audit-premium-menu {
        scrollbar-width: thin;
        scrollbar-color: #f3a58f #fff7f3;
      }

      .admin-audit-page ::-webkit-scrollbar,
      .audit-premium-menu::-webkit-scrollbar {
        width: 8px;
        height: 8px;
      }

      .admin-audit-page ::-webkit-scrollbar-track,
      .audit-premium-menu::-webkit-scrollbar-track {
        background: #fff7f3;
        border-radius: 999px;
      }

      .admin-audit-page ::-webkit-scrollbar-thumb,
      .audit-premium-menu::-webkit-scrollbar-thumb {
        background: linear-gradient(180deg, #f8c4b4, #f4512b);
        border: 2px solid #fff7f3;
        border-radius: 999px;
      }

      .admin-audit-page ::-webkit-scrollbar-thumb:hover,
      .audit-premium-menu::-webkit-scrollbar-thumb:hover {
        background: #dc3f1d;
      }

      .audit-premium-menu {
        overscroll-behavior: contain;
        -webkit-overflow-scrolling: touch;
      }

      .audit-table-scroll {
        width: 100%;
        overflow-x: auto;
        overscroll-behavior-x: contain;
        -webkit-overflow-scrolling: touch;
      }

      .admin-audit-page input,
      .admin-audit-page textarea {
        color: #1e293b;
      }

      .admin-audit-page input::placeholder,
      .admin-audit-page textarea::placeholder {
        color: #94a3b8;
        opacity: 1;
      }

      .admin-audit-page button:focus-visible {
        outline: 2px solid #f4512b;
        outline-offset: 2px;
      }

      @media (prefers-reduced-motion: reduce) {
        .admin-audit-page *,
        .admin-audit-page *::before,
        .admin-audit-page *::after {
          animation-duration: 0.01ms !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `}</style>
    );
}

/* =========================================================
   PREMIUM CUSTOM DROPDOWN
   Searchable + Portal + Keyboard + Scroll aware
========================================================= */

function PremiumDropdown({
    value,
    onChange,
    options = [],
    placeholder = "Select an option",
    searchable,
    disabled = false,
    className = "",
}) {
    const triggerRef = useRef(null);
    const menuRef = useRef(null);
    const searchRef = useRef(null);

    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [position, setPosition] = useState(null);

    const selectedOption = options.find(
        (option) => String(option.value) === String(value)
    );

    const showSearch = searchable ?? options.length > 6;

    const filteredOptions = options.filter((option) =>
        String(option.label)
            .toLowerCase()
            .includes(query.trim().toLowerCase())
    );

    const updatePosition = useCallback(() => {
        const rect = triggerRef.current?.getBoundingClientRect();

        if (!rect) return;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        const width = Math.min(
            Math.max(rect.width, 224),
            viewportWidth - 24
        );

        const left = Math.max(
            12,
            Math.min(rect.left, viewportWidth - width - 12)
        );

        const spaceBelow = Math.max(100, viewportHeight - rect.bottom - 16);
        const spaceAbove = Math.max(100, rect.top - 16);

        const openUp = spaceBelow < 230 && spaceAbove > spaceBelow;
        const availableSpace = openUp ? spaceAbove : spaceBelow;
        const maxHeight = Math.min(315, availableSpace);

        let top = openUp
            ? rect.top - maxHeight - 8
            : rect.bottom + 8;

        top = Math.max(
            8,
            Math.min(top, viewportHeight - maxHeight - 8)
        );

        setPosition({
            top,
            left,
            width,
            maxHeight,
            openUp,
        });
    }, []);

    function toggleDropdown() {
        if (disabled) return;

        if (open) {
            setOpen(false);
            return;
        }

        setQuery("");
        updatePosition();
        setOpen(true);
    }

    useEffect(() => {
        if (!open) return undefined;

        const reposition = () => updatePosition();

        const handleOutside = (event) => {
            if (
                !triggerRef.current?.contains(event.target) &&
                !menuRef.current?.contains(event.target)
            ) {
                setOpen(false);
            }
        };

        const handleKeyboard = (event) => {
            if (event.key === "Escape") {
                setOpen(false);
                triggerRef.current?.focus();
            }

            if (
                (event.key === "ArrowDown" || event.key === "ArrowUp") &&
                menuRef.current?.contains(document.activeElement)
            ) {
                event.preventDefault();

                const items = Array.from(
                    menuRef.current.querySelectorAll('[role="option"]')
                );

                const currentIndex = items.indexOf(document.activeElement);

                const nextIndex =
                    event.key === "ArrowDown"
                        ? Math.min(currentIndex + 1, items.length - 1)
                        : Math.max(currentIndex - 1, 0);

                items[nextIndex]?.focus();
            }
        };

        window.addEventListener("resize", reposition);
        window.addEventListener("scroll", reposition, true);
        document.addEventListener("pointerdown", handleOutside);
        document.addEventListener("keydown", handleKeyboard);

        return () => {
            window.removeEventListener("resize", reposition);
            window.removeEventListener("scroll", reposition, true);
            document.removeEventListener("pointerdown", handleOutside);
            document.removeEventListener("keydown", handleKeyboard);
        };
    }, [open, updatePosition]);

    useEffect(() => {
        if (!open || !showSearch) return undefined;

        const timer = window.setTimeout(
            () => searchRef.current?.focus(),
            40
        );

        return () => window.clearTimeout(timer);
    }, [open, showSearch]);

    return (
        <>
            <button
                ref={triggerRef}
                type="button"
                disabled={disabled}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={toggleDropdown}
                className={[
                    "flex min-h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 py-2.5 text-left outline-none transition duration-200",
                    "focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100",
                    open
                        ? "border-[#F4512B] ring-4 ring-orange-100"
                        : "border-slate-200 hover:border-orange-300 hover:bg-orange-50/20",
                    disabled ? "cursor-not-allowed opacity-50" : "",
                    className,
                ].join(" ")}
            >
                <span
                    className={[
                        "min-w-0 flex-1 truncate text-sm font-semibold",
                        selectedOption ? "text-slate-800" : "text-slate-400",
                    ].join(" ")}
                >
                    {selectedOption?.label || placeholder}
                </span>

                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.16 }}
                    className="shrink-0 text-slate-400"
                >
                    <ChevronDown size={16} />
                </motion.span>
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
                                y: position.openUp ? 4 : -4,
                                scale: 0.99,
                            }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{
                                opacity: 0,
                                y: position.openUp ? 3 : -3,
                                scale: 0.99,
                            }}
                            transition={{ duration: 0.14 }}
                            style={{
                                position: "fixed",
                                top: position.top,
                                left: position.left,
                                width: position.width,
                                maxHeight: position.maxHeight,
                                zIndex: 99999,
                                transformOrigin: position.openUp
                                    ? "bottom center"
                                    : "top center",
                            }}
                            className="audit-premium-menu overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_22px_60px_-20px_rgba(15,23,42,.36)] ring-1 ring-black/[.025]"
                        >
                            <div className="border-b border-slate-100 bg-gradient-to-r from-orange-50/90 via-white to-white px-3.5 py-3">
                                <div className="flex items-center justify-between gap-2">
                                    <span className="text-[10px] font-extrabold uppercase tracking-[.15em] text-slate-400">
                                        Available options
                                    </span>

                                    <span className="rounded-md bg-orange-100 px-1.5 py-0.5 text-[10px] font-bold text-[#F4512B]">
                                        {filteredOptions.length}
                                    </span>
                                </div>

                                {showSearch && (
                                    <div className="relative mt-2.5">
                                        <Search
                                            size={15}
                                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                                        />

                                        <input
                                            ref={searchRef}
                                            value={query}
                                            onChange={(event) => setQuery(event.target.value)}
                                            onKeyDown={(event) => {
                                                if (event.key === "Escape") setOpen(false);
                                            }}
                                            placeholder="Search options..."
                                            aria-label="Search dropdown options"
                                            className="h-9 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-xs font-medium outline-none transition focus:border-orange-300 focus:ring-2 focus:ring-orange-100"
                                        />
                                    </div>
                                )}
                            </div>

                            <div
                                className="overflow-y-auto p-1.5"
                                style={{
                                    maxHeight: Math.max(
                                        65,
                                        position.maxHeight - (showSearch ? 91 : 48)
                                    ),
                                }}
                            >
                                {filteredOptions.length ? (
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
                                                    setQuery("");
                                                    triggerRef.current?.focus();
                                                }}
                                                className={[
                                                    "group/option flex min-h-10 w-full items-center gap-2.5 rounded-xl px-2.5 py-2.5 text-left transition duration-150",
                                                    selected
                                                        ? "bg-orange-50 text-[#F4512B]"
                                                        : "text-slate-700 hover:bg-slate-50",
                                                ].join(" ")}
                                            >
                                                <span
                                                    className={[
                                                        "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border transition",
                                                        selected
                                                            ? "border-orange-200 bg-white text-[#F4512B]"
                                                            : "border-slate-100 bg-slate-50 text-slate-400 group-hover/option:border-orange-100 group-hover/option:bg-orange-50 group-hover/option:text-[#F4512B]",
                                                    ].join(" ")}
                                                >
                                                    {selected ? (
                                                        <Check size={14} strokeWidth={2.5} />
                                                    ) : (
                                                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                                                    )}
                                                </span>

                                                <span
                                                    className={[
                                                        "min-w-0 flex-1 break-words text-sm",
                                                        selected ? "font-bold" : "font-medium",
                                                    ].join(" ")}
                                                >
                                                    {option.label}
                                                </span>

                                                {selected && (
                                                    <span className="text-[9px] font-extrabold uppercase tracking-wider text-[#F4512B]">
                                                        Selected
                                                    </span>
                                                )}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="px-3 py-7 text-center">
                                        <Search
                                            size={19}
                                            className="mx-auto text-slate-300"
                                        />

                                        <p className="mt-2 text-sm font-semibold text-slate-600">
                                            No options found
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Try another search term.
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/80 px-3.5 py-2">
                                <span className="text-[10px] font-medium text-slate-400">
                                    CodeFaculty
                                </span>

                                <span className="flex items-center gap-1 text-[10px] font-semibold text-slate-500">
                                    <ShieldCheck
                                        size={12}
                                        className="text-[#F4512B]"
                                    />
                                    Smart selection
                                </span>
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
   ACTION BUTTON
========================================================= */

function ActionButton({
    children,
    onClick,
    variant = "secondary",
    type = "button",
    disabled = false,
    className = "",
}) {
    const variants = {
        primary:
            "border-[#F4512B] bg-[#F4512B] text-white shadow-sm shadow-orange-200/70 hover:border-[#df3f1b] hover:bg-[#df3f1b]",
        secondary:
            "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50/60 hover:text-[#F4512B]",
        ghost:
            "border-transparent bg-transparent text-slate-500 hover:bg-slate-100 hover:text-slate-800",
        danger:
            "border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100",
    };

    return (
        <button
            type={type}
            disabled={disabled}
            onClick={onClick}
            className={[
                "inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition duration-200",
                "focus:outline-none focus:ring-4 focus:ring-orange-100 active:scale-[.98] disabled:pointer-events-none disabled:opacity-50",
                variants[variant] || variants.secondary,
                className,
            ].join(" ")}
        >
            {children}
        </button>
    );
}

/* =========================================================
   BADGES
========================================================= */

function SeverityBadge({ severity }) {
    const config = getSeverityConfig(severity);
    const Icon = config.icon;

    return (
        <span
            className={[
                "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                config.classes,
            ].join(" ")}
        >
            <Icon size={13} />
            {severity}
        </span>
    );
}

function ResultBadge({ result }) {
    const config = getResultConfig(result);
    const Icon = config.icon;

    return (
        <span
            className={[
                "inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold",
                config.classes,
            ].join(" ")}
        >
            <Icon size={13} />
            {result}
        </span>
    );
}

function ActionBadge({ action }) {
    return (
        <span
            className={[
                "inline-flex items-center rounded-lg border px-2.5 py-1 text-[10px] font-extrabold tracking-wide",
                getActionColor(action),
            ].join(" ")}
        >
            {action}
        </span>
    );
}

/* =========================================================
   MODAL SHELL
========================================================= */

function ModalShell({
    title,
    subtitle,
    icon: Icon = History,
    onClose,
    children,
    size = "max-w-3xl",
}) {
    const onCloseRef = useRef(onClose);

    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    useEffect(() => {
        const previousOverflow = document.body.style.overflow;

        document.body.style.overflow = "hidden";

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                onCloseRef.current?.();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    return (
        <motion.div
            className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-slate-950/45 p-3 backdrop-blur-[5px] sm:p-6"
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
                aria-label={title}
                initial={{ opacity: 0, y: 12, scale: 0.99 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.99 }}
                transition={{ duration: 0.16 }}
                className={[
                    "my-auto w-full overflow-visible rounded-2xl border border-slate-200/80 bg-white shadow-[0_24px_90px_-24px_rgba(15,23,42,.45)]",
                    size,
                ].join(" ")}
            >
                <div className="flex items-start justify-between gap-4 rounded-t-2xl border-b border-slate-100 bg-white px-5 py-4 sm:px-6">
                    <div className="flex min-w-0 items-start gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                            <Icon size={21} />
                        </div>

                        <div className="min-w-0 pt-0.5">
                            <h2 className="text-lg font-bold tracking-tight text-slate-900">
                                {title}
                            </h2>

                            {subtitle && (
                                <p className="mt-1 text-sm leading-5 text-slate-500">
                                    {subtitle}
                                </p>
                            )}
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close modal"
                        className="rounded-lg p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-800"
                    >
                        <X size={19} />
                    </button>
                </div>

                <div className="max-h-[75vh] overflow-y-auto rounded-b-2xl">
                    {children}
                </div>
            </motion.div>
        </motion.div>
    );
}

/* =========================================================
   AUDIT LOG DETAIL MODAL
========================================================= */

function AuditLogDetailsModal({ log, onClose }) {
    if (!log) return null;

    const details = log.details || {};
    const detailEntries = Object.entries(details);

    return (
        <ModalShell
            title="Audit Log Details"
            subtitle={`Immutable activity reference: ${log.id}`}
            icon={Fingerprint}
            onClose={onClose}
            size="max-w-4xl"
        >
            <div className="p-5 sm:p-6">
                {/* EVENT SUMMARY */}
                <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50 via-white to-white p-4 sm:p-5">
                    <div className="flex flex-wrap items-center gap-2">
                        <ActionBadge action={log.action} />
                        <SeverityBadge severity={log.severity} />
                        <ResultBadge result={log.result} />
                    </div>

                    <h3 className="mt-4 break-words text-xl font-bold tracking-tight text-slate-900">
                        {log.description}
                    </h3>

                    <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                        <span className="flex items-center gap-1.5">
                            <Clock3 size={14} />
                            {formatDateTime(log.timestamp)}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <FileText size={14} />
                            {log.module}
                        </span>

                        <span className="flex items-center gap-1.5">
                            <Fingerprint size={14} />
                            {log.id}
                        </span>
                    </div>
                </div>

                {/* ACTOR */}
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <UserCog size={17} className="text-[#F4512B]" />

                        <h4 className="text-sm font-bold text-slate-900">
                            Actor Information
                        </h4>
                    </div>

                    <div className="mt-4 flex items-center gap-3">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-sm font-extrabold text-[#F4512B]">
                            {getInitials(log.actor)}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-slate-800">
                                {log.actor}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-400">
                                {log.email}
                            </p>
                        </div>

                        <div className="ml-auto shrink-0 rounded-lg border border-orange-100 bg-orange-50 px-2.5 py-1.5 text-xs font-bold text-[#C94524]">
                            {log.role}
                        </div>
                    </div>
                </div>

                {/* EVENT METADATA */}
                <div className="mt-5">
                    <div className="mb-3">
                        <h4 className="text-sm font-bold text-slate-900">
                            Event Metadata
                        </h4>

                        <p className="mt-1 text-xs text-slate-400">
                            Context and technical information for this event
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            {
                                label: "Module",
                                value: log.module,
                                icon: Activity,
                            },
                            {
                                label: "Affected Entity",
                                value: log.entity,
                                icon: FileText,
                            },
                            {
                                label: "IP Address",
                                value: log.ip,
                                icon: Globe,
                            },
                            {
                                label: "Location",
                                value: log.location,
                                icon: ArrowUpRight,
                            },
                            {
                                label: "Device",
                                value: log.device,
                                icon: Laptop,
                            },
                            {
                                label: "Timestamp",
                                value: formatDateTime(log.timestamp),
                                icon: CalendarDays,
                            },
                        ].map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.label}
                                    className="flex min-w-0 items-start gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-3.5"
                                >
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-slate-100 bg-white text-slate-500">
                                        <Icon size={16} />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="text-xs font-medium text-slate-400">
                                            {item.label}
                                        </p>

                                        <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                                            {item.value || "—"}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* ADDITIONAL DETAILS */}
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4">
                    <div className="flex items-center gap-2">
                        <FileText size={17} className="text-[#F4512B]" />

                        <div>
                            <h4 className="text-sm font-bold text-slate-900">
                                Additional Event Details
                            </h4>

                            <p className="mt-0.5 text-xs text-slate-400">
                                Recorded event attributes
                            </p>
                        </div>
                    </div>

                    {detailEntries.length ? (
                        <div className="mt-4 space-y-2">
                            {detailEntries.map(([key, value]) => (
                                <div
                                    key={key}
                                    className="flex flex-col gap-1 rounded-lg bg-slate-50 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
                                >
                                    <span className="text-xs font-medium text-slate-500">
                                        {key.replace(/([A-Z])/g, " $1")}
                                    </span>

                                    <span className="break-words text-sm font-semibold text-slate-800 sm:text-right">
                                        {typeof value === "object"
                                            ? JSON.stringify(value)
                                            : String(value)}
                                    </span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="mt-4 text-sm text-slate-400">
                            No additional details recorded.
                        </p>
                    )}
                </div>

                {/* INTEGRITY NOTE */}
                <div className="mt-5 flex items-start gap-2 rounded-xl border border-orange-100 bg-orange-50/70 p-3">
                    <LockKeyhole
                        size={17}
                        className="mt-0.5 shrink-0 text-[#F4512B]"
                    />

                    <p className="text-xs leading-5 text-slate-600">
                        Audit records are displayed as read-only entries. Editing or
                        deleting original audit events is intentionally not available
                        in this interface.
                    </p>
                </div>

                <div className="mt-5 flex justify-end border-t border-slate-100 pt-5">
                    <ActionButton onClick={onClose}>
                        Close Details
                    </ActionButton>
                </div>
            </div>
        </ModalShell>
    );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
    label,
    value,
    note,
    icon: Icon,
    tone = "orange",
}) {
    const tones = {
        orange: "border-orange-100 bg-orange-50 text-[#F4512B]",
        green: "border-emerald-100 bg-emerald-50 text-emerald-700",
        blue: "border-blue-100 bg-blue-50 text-blue-700",
        violet: "border-violet-100 bg-violet-50 text-violet-700",
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 7 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/70 transition duration-200 hover:shadow-md sm:p-5"
        >
            <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="text-sm font-medium text-slate-500">
                        {label}
                    </p>

                    <p className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                        {value}
                    </p>
                </div>

                <div
                    className={[
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                        tones[tone] || tones.orange,
                    ].join(" ")}
                >
                    <Icon size={21} />
                </div>
            </div>

            <p className="mt-3 text-xs leading-5 text-slate-400">
                {note}
            </p>
        </motion.div>
    );
}

/* =========================================================
   EMPTY STATE
========================================================= */

function EmptyState({ onReset }) {
    return (
        <div className="px-5 py-14 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                <History size={25} />
            </div>

            <h3 className="mt-4 text-lg font-bold text-slate-900">
                No audit records found
            </h3>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                No activities match the current search, date range or filter
                settings.
            </p>

            <div className="mt-5">
                <ActionButton onClick={onReset}>
                    <RefreshCw size={15} />
                    Reset Filters
                </ActionButton>
            </div>
        </div>
    );
}

/* =========================================================
   MAIN ADMIN AUDIT LOGS PAGE
========================================================= */

export default function AdminAuditLogsPage() {
    const [logs, setLogs] = useState(() => {
        try {
            const saved = window.localStorage.getItem(STORAGE_KEY);

            if (saved) {
                const parsed = JSON.parse(saved);

                if (Array.isArray(parsed)) return parsed;
            }
        } catch {
            // Fall back to sample records if storage is invalid.
        }

        return INITIAL_LOGS;
    });

    const [search, setSearch] = useState("");

    const [moduleFilter, setModuleFilter] = useState("All");
    const [actionFilter, setActionFilter] = useState("All");
    const [roleFilter, setRoleFilter] = useState("All");
    const [resultFilter, setResultFilter] = useState("All");
    const [severityFilter, setSeverityFilter] = useState("All");

    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    const [sortBy, setSortBy] = useState("newest");
    const [showFilters, setShowFilters] = useState(false);
    const [page, setPage] = useState(1);

    const [selectedLog, setSelectedLog] = useState(null);
    const [notice, setNotice] = useState(null);

    /* =======================================================
       LOCAL STORAGE
    ======================================================= */

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(logs));
        } catch {
            // Keep this screen usable if browser storage is unavailable.
        }
    }, [logs]);

    /* =======================================================
       FILTER + SORT
    ======================================================= */

    const filteredLogs = useMemo(() => {
        const query = search.trim().toLowerCase();

        const result = logs.filter((item) => {
            const searchableValues = [
                item.id,
                item.actor,
                item.email,
                item.role,
                item.action,
                item.module,
                item.entity,
                item.description,
                item.ip,
                item.location,
                item.device,
                item.result,
                item.severity,
            ];

            const matchesSearch =
                !query ||
                searchableValues.some((value) =>
                    String(value || "").toLowerCase().includes(query)
                );

            const logDate = String(item.timestamp || "").slice(0, 10);

            const matchesModule =
                moduleFilter === "All" || item.module === moduleFilter;

            const matchesAction =
                actionFilter === "All" || item.action === actionFilter;

            const matchesRole =
                roleFilter === "All" || item.role === roleFilter;

            const matchesResult =
                resultFilter === "All" || item.result === resultFilter;

            const matchesSeverity =
                severityFilter === "All" || item.severity === severityFilter;

            const matchesFrom = !dateFrom || logDate >= dateFrom;
            const matchesTo = !dateTo || logDate <= dateTo;

            return (
                matchesSearch &&
                matchesModule &&
                matchesAction &&
                matchesRole &&
                matchesResult &&
                matchesSeverity &&
                matchesFrom &&
                matchesTo
            );
        });

        return [...result].sort((a, b) => {
            switch (sortBy) {
                case "oldest":
                    return String(a.timestamp || "").localeCompare(
                        String(b.timestamp || "")
                    );

                case "severity-desc":
                    return getSeverityRank(b.severity) - getSeverityRank(a.severity);

                case "actor-asc":
                    return String(a.actor || "").localeCompare(
                        String(b.actor || "")
                    );

                case "newest":
                default:
                    return String(b.timestamp || "").localeCompare(
                        String(a.timestamp || "")
                    );
            }
        });
    }, [
        logs,
        search,
        moduleFilter,
        actionFilter,
        roleFilter,
        resultFilter,
        severityFilter,
        dateFrom,
        dateTo,
        sortBy,
    ]);

    /* =======================================================
       DASHBOARD STATISTICS
    ======================================================= */

    const totalLogs = logs.length;

    const todayDate = getDateInputValue(new Date());

    const todayCount = logs.filter(
        (item) => String(item.timestamp || "").slice(0, 10) === todayDate
    ).length;

    const warningCount = logs.filter(
        (item) => item.severity === "Warning"
    ).length;

    const criticalCount = logs.filter(
        (item) => item.severity === "Critical"
    ).length;

    const failedCount = logs.filter(
        (item) => item.result === "Failed" || item.result === "Blocked"
    ).length;

    const successCount = logs.filter(
        (item) => item.result === "Success"
    ).length;

    const uniqueActors = new Set(
        logs.map((item) => item.actor).filter(Boolean)
    ).size;

    /* =======================================================
       PAGINATION
    ======================================================= */

    const totalPages = Math.max(
        1,
        Math.ceil(filteredLogs.length / PAGE_SIZE)
    );

    const safePage = Math.min(page, totalPages);

    const visibleLogs = filteredLogs.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
    );

    const activeFiltersCount = [
        moduleFilter !== "All",
        actionFilter !== "All",
        roleFilter !== "All",
        resultFilter !== "All",
        severityFilter !== "All",
        Boolean(dateFrom),
        Boolean(dateTo),
    ].filter(Boolean).length;

    const hasFilters =
        Boolean(search.trim()) || activeFiltersCount > 0;

    /* Reset page when filters change. */
    useEffect(() => {
        setPage(1);
    }, [
        search,
        moduleFilter,
        actionFilter,
        roleFilter,
        resultFilter,
        severityFilter,
        dateFrom,
        dateTo,
        sortBy,
    ]);

    useEffect(() => {
        setPage((current) => Math.min(current, totalPages));
    }, [totalPages]);

    /* =======================================================
       ACTIONS
    ======================================================= */

    function resetFilters() {
        setSearch("");
        setModuleFilter("All");
        setActionFilter("All");
        setRoleFilter("All");
        setResultFilter("All");
        setSeverityFilter("All");
        setDateFrom("");
        setDateTo("");
        setSortBy("newest");
        setPage(1);
    }

    function applyQuickFilter(value) {
        resetFilters();

        if (value === "critical") {
            setSeverityFilter("Critical");
        }

        if (value === "warning") {
            setSeverityFilter("Warning");
        }

        if (value === "today") {
            const today = getDateInputValue(new Date());

            setDateFrom(today);
            setDateTo(today);
        }
    }

    function exportCSV() {
        const headers = [
            "Log ID",
            "Actor",
            "Email",
            "Role",
            "Action",
            "Module",
            "Entity",
            "Description",
            "Result",
            "Severity",
            "IP Address",
            "Location",
            "Device",
            "Timestamp",
            "Additional Details",
        ];

        const rows = filteredLogs.map((item) => [
            item.id,
            item.actor,
            item.email,
            item.role,
            item.action,
            item.module,
            item.entity,
            item.description,
            item.result,
            item.severity,
            item.ip,
            item.location,
            item.device,
            item.timestamp,
            JSON.stringify(item.details || {}),
        ]);

        const csv = [headers, ...rows]
            .map((row) => row.map(escapeCSV).join(","))
            .join("\r\n");

        const blob = new Blob(["\uFEFF", csv], {
            type: "text/csv;charset=utf-8;",
        });

        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");

        link.href = url;
        link.download = `codefaculty-audit-logs-${todayDate}.csv`;

        document.body.appendChild(link);
        link.click();
        link.remove();

        window.setTimeout(() => URL.revokeObjectURL(url), 1000);

        setNotice({
            type: "success",
            message: `${filteredLogs.length} audit record(s) exported successfully.`,
        });
    }

    const sortLabel =
        {
            newest: "Newest first",
            oldest: "Oldest first",
            "severity-desc": "Highest severity",
            "actor-asc": "Actor: A to Z",
        }[sortBy] || "Newest first";

    /* =======================================================
       RENDER
    ======================================================= */

    return (
        <div className="admin-audit-page min-w-0 bg-[#F8FAFC] px-4 py-5 text-slate-800 sm:px-6 sm:py-6 xl:px-8">
            <AuditPremiumStyles />

            <div className="mx-auto w-full max-w-[1600px]">
                {/* HEADER */}
                <section className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div className="min-w-0">
                        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-[.15em] text-slate-400">
                            <History size={15} className="text-[#F4512B]" />
                            Administration
                            <span className="text-slate-300">/</span>
                            System & Security
                        </div>

                        <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                            Audit Logs
                        </h1>

                        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                            Monitor administrative activity, review security events,
                            inspect account changes and maintain visibility across
                            platform operations.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <ActionButton onClick={resetFilters}>
                            <RefreshCw size={15} />
                            Reset Filters
                        </ActionButton>

                        <ActionButton variant="primary" onClick={exportCSV}>
                            <Download size={16} />
                            Export CSV
                        </ActionButton>
                    </div>
                </section>

                {/* NOTICE */}
                <AnimatePresence initial={false}>
                    {notice && (
                        <motion.div
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -5 }}
                            className="overflow-hidden"
                        >
                            <div className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
                                <CheckCircle2
                                    size={18}
                                    className="mt-0.5 shrink-0"
                                />

                                <p className="flex-1 text-sm font-medium leading-6">
                                    {notice.message}
                                </p>

                                <button
                                    type="button"
                                    onClick={() => setNotice(null)}
                                    aria-label="Dismiss notice"
                                    className="rounded-md p-1 opacity-70 transition hover:bg-black/5 hover:opacity-100"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* STATS */}
                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <StatCard
                        label="Total Activity Logs"
                        value={formatNumber(totalLogs)}
                        note="All recorded demo activity events"
                        icon={History}
                        tone="orange"
                    />

                    <StatCard
                        label="Today's Activity"
                        value={formatNumber(todayCount)}
                        note="Events recorded for the current date"
                        icon={Activity}
                        tone="blue"
                    />

                    <StatCard
                        label="Warning Events"
                        value={formatNumber(warningCount)}
                        note="Events that require attention"
                        icon={AlertCircle}
                        tone="violet"
                    />

                    <StatCard
                        label="Critical Events"
                        value={formatNumber(criticalCount)}
                        note="High-priority security events"
                        icon={ShieldAlert}
                        tone="green"
                    />
                </div>

                {/* SECURITY OVERVIEW */}
                <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.3fr_.7fr]">
                    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-5">
                        <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                                    <Activity size={19} />
                                </div>

                                <div>
                                    <h2 className="text-sm font-bold text-slate-900">
                                        Activity Overview
                                    </h2>

                                    <p className="mt-1 text-xs text-slate-400">
                                        Current stored audit records
                                    </p>
                                </div>
                            </div>

                            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                                <span className="h-1.5 w-1.5 rounded-full bg-blue-500" />
                                Demo records
                            </span>
                        </div>

                        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                            {[
                                {
                                    label: "Successful",
                                    value: successCount,
                                    color: "text-emerald-700",
                                },
                                {
                                    label: "Failed / Blocked",
                                    value: failedCount,
                                    color: "text-rose-700",
                                },
                                {
                                    label: "Unique Actors",
                                    value: uniqueActors,
                                    color: "text-slate-900",
                                },
                                {
                                    label: "Warnings",
                                    value: warningCount,
                                    color: "text-amber-700",
                                },
                            ].map((item) => (
                                <div
                                    key={item.label}
                                    className="rounded-xl border border-slate-100 bg-slate-50/70 p-3"
                                >
                                    <p className="text-xs font-medium text-slate-500">
                                        {item.label}
                                    </p>

                                    <p
                                        className={[
                                            "mt-2 text-2xl font-extrabold tabular-nums",
                                            item.color,
                                        ].join(" ")}
                                    >
                                        {formatNumber(item.value)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                            <button
                                type="button"
                                onClick={() => applyQuickFilter("today")}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B]"
                            >
                                <CalendarDays size={14} />
                                Today's activity
                            </button>

                            <button
                                type="button"
                                onClick={() => applyQuickFilter("warning")}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-amber-200 hover:bg-amber-50 hover:text-amber-700"
                            >
                                <AlertCircle size={14} />
                                Warnings
                            </button>

                            <button
                                type="button"
                                onClick={() => applyQuickFilter("critical")}
                                className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-xs font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700"
                            >
                                <ShieldAlert size={14} />
                                Critical events
                            </button>
                        </div>
                    </div>

                    <div className="rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/90 via-white to-white p-4 shadow-sm shadow-orange-100/30 sm:p-5">
                        <div className="flex items-start gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-white text-[#F4512B]">
                                <LockKeyhole size={20} />
                            </div>

                            <div>
                                <h2 className="text-sm font-bold text-slate-900">
                                    Security & Integrity
                                </h2>

                                <p className="mt-1 text-xs leading-5 text-slate-500">
                                    Review sensitive account activity and security events.
                                </p>
                            </div>
                        </div>

                        <div className="mt-4 space-y-2.5">
                            <div className="flex items-center gap-2.5 rounded-xl border border-orange-100 bg-white/90 p-3">
                                <CheckCircle2
                                    size={16}
                                    className="shrink-0 text-emerald-600"
                                />

                                <p className="text-xs font-semibold text-slate-600">
                                    {formatNumber(successCount)} successful events
                                </p>
                            </div>

                            <div className="flex items-center gap-2.5 rounded-xl border border-orange-100 bg-white/90 p-3">
                                <Ban
                                    size={16}
                                    className="shrink-0 text-rose-600"
                                />

                                <p className="text-xs font-semibold text-slate-600">
                                    {formatNumber(failedCount)} failed or blocked events
                                </p>
                            </div>

                            <div className="flex items-center gap-2.5 rounded-xl border border-orange-100 bg-white/90 p-3">
                                <ShieldCheck
                                    size={16}
                                    className="shrink-0 text-[#F4512B]"
                                />

                                <p className="text-xs font-semibold text-slate-600">
                                    Audit entries are read-only in this interface
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* SEARCH AND FILTERS */}
                <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-100/50 sm:p-5">
                    <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={18}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search log ID, actor, IP, module, action or description..."
                                aria-label="Search audit logs"
                                className="min-h-11 w-full rounded-xl border border-slate-200 bg-slate-50/60 py-2.5 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 hover:border-slate-300 focus:border-[#F4512B] focus:bg-white focus:ring-4 focus:ring-orange-100"
                            />

                            {search && (
                                <button
                                    type="button"
                                    onClick={() => setSearch("")}
                                    aria-label="Clear search"
                                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                                >
                                    <X size={15} />
                                </button>
                            )}
                        </div>

                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:flex">
                            <div className="min-w-0 xl:w-44">
                                <PremiumDropdown
                                    value={severityFilter}
                                    onChange={setSeverityFilter}
                                    options={SEVERITY_OPTIONS}
                                    placeholder="All severities"
                                    searchable={false}
                                />
                            </div>

                            <div className="min-w-0 xl:w-48">
                                <PremiumDropdown
                                    value={sortBy}
                                    onChange={setSortBy}
                                    options={SORT_OPTIONS}
                                    placeholder="Sort activity"
                                />
                            </div>

                            <ActionButton
                                onClick={() =>
                                    setShowFilters((current) => !current)
                                }
                            >
                                <SlidersHorizontal size={16} />
                                Filters

                                {activeFiltersCount > 0 && (
                                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-orange-100 px-1 text-[11px] font-bold text-[#F4512B]">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </ActionButton>

                            {hasFilters && (
                                <ActionButton
                                    onClick={resetFilters}
                                    variant="ghost"
                                >
                                    <RefreshCw size={15} />
                                    Reset
                                </ActionButton>
                            )}
                        </div>
                    </div>

                    {/* ADVANCED FILTERS */}
                    <AnimatePresence initial={false}>
                        {showFilters && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.16 }}
                                className="overflow-visible"
                            >
                                <div className="mt-4 grid grid-cols-1 gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2 xl:grid-cols-3">
                                    <div className="min-w-0">
                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Module
                                        </p>

                                        <PremiumDropdown
                                            value={moduleFilter}
                                            onChange={setModuleFilter}
                                            options={MODULE_OPTIONS}
                                            placeholder="All modules"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Action type
                                        </p>

                                        <PremiumDropdown
                                            value={actionFilter}
                                            onChange={setActionFilter}
                                            options={ACTION_OPTIONS}
                                            placeholder="All actions"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Actor role
                                        </p>

                                        <PremiumDropdown
                                            value={roleFilter}
                                            onChange={setRoleFilter}
                                            options={ROLE_OPTIONS}
                                            placeholder="All roles"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Event result
                                        </p>

                                        <PremiumDropdown
                                            value={resultFilter}
                                            onChange={setResultFilter}
                                            options={RESULT_OPTIONS}
                                            placeholder="All results"
                                            searchable={false}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Severity
                                        </p>

                                        <PremiumDropdown
                                            value={severityFilter}
                                            onChange={setSeverityFilter}
                                            options={SEVERITY_OPTIONS}
                                            placeholder="All severities"
                                            searchable={false}
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Date from
                                        </p>

                                        <input
                                            type="date"
                                            value={dateFrom}
                                            max={dateTo || undefined}
                                            onChange={(event) => setDateFrom(event.target.value)}
                                            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium outline-none transition hover:border-slate-300 focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                        />
                                    </div>

                                    <div className="min-w-0">
                                        <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                                            Date to
                                        </p>

                                        <input
                                            type="date"
                                            value={dateTo}
                                            min={dateFrom || undefined}
                                            onChange={(event) => setDateTo(event.target.value)}
                                            className="min-h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-sm font-medium outline-none transition hover:border-slate-300 focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                                        />
                                    </div>

                                    <div className="flex flex-col justify-end">
                                        <p className="mb-2 text-xs text-slate-400">
                                            Matching audit events
                                        </p>

                                        <div className="flex min-h-11 items-center gap-2 rounded-xl border border-orange-100 bg-orange-50/50 px-3.5 text-sm font-semibold text-slate-700">
                                            <Filter
                                                size={15}
                                                className="text-[#F4512B]"
                                            />

                                            {formatNumber(filteredLogs.length)} records
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* DIRECTORY HEADER */}
                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <h2 className="text-lg font-bold text-slate-900">
                            Activity Log Directory
                        </h2>

                        <p className="mt-1 text-sm text-slate-500">
                            Showing{" "}
                            <span className="font-semibold text-slate-700">
                                {filteredLogs.length === 0
                                    ? 0
                                    : (safePage - 1) * PAGE_SIZE + 1}
                                {"–"}
                                {Math.min(
                                    safePage * PAGE_SIZE,
                                    filteredLogs.length
                                )}
                            </span>{" "}
                            of{" "}
                            <span className="font-semibold text-slate-700">
                                {formatNumber(filteredLogs.length)}
                            </span>{" "}
                            activity records
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-400">
                        <ArrowDownUp size={14} />

                        Sorted by{" "}
                        <span className="font-semibold text-slate-600">
                            {sortLabel}
                        </span>
                    </div>
                </div>

                {/* AUDIT TABLE */}
                <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-100/50">
                    <div className="audit-table-scroll">
                        <table className="w-full min-w-[1250px] border-collapse text-left">
                            <thead>
                                <tr className="border-b border-slate-200 bg-slate-50/90">
                                    {[
                                        "LOG / EVENT",
                                        "ACTOR",
                                        "MODULE",
                                        "ACTION",
                                        "RESULT",
                                        "SEVERITY",
                                        "IP ADDRESS",
                                        "DATE & TIME",
                                        "DETAILS",
                                    ].map((heading) => (
                                        <th
                                            key={heading}
                                            className="whitespace-nowrap px-4 py-4 text-[10px] font-extrabold tracking-[.12em] text-slate-400"
                                        >
                                            {heading}
                                        </th>
                                    ))}
                                </tr>
                            </thead>

                            <tbody>
                                {visibleLogs.map((log) => (
                                    <tr
                                        key={log.id}
                                        className="border-b border-slate-100 transition-colors last:border-0 hover:bg-orange-50/25"
                                    >
                                        {/* LOG */}
                                        <td className="px-4 py-4">
                                            <div className="flex min-w-[245px] items-start gap-3">
                                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-orange-100 bg-orange-50 text-[#F4512B]">
                                                    <Fingerprint size={18} />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-bold text-slate-800">
                                                        {log.id}
                                                    </p>

                                                    <p
                                                        title={log.description}
                                                        className="mt-1 max-w-[280px] truncate text-xs text-slate-500"
                                                    >
                                                        {log.description}
                                                    </p>

                                                    <p className="mt-1 text-[10px] font-medium text-slate-400">
                                                        Entity: {log.entity}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* ACTOR */}
                                        <td className="px-4 py-4">
                                            <div className="flex min-w-[175px] items-center gap-3">
                                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-orange-100 bg-orange-50 text-xs font-extrabold text-[#F4512B]">
                                                    {getInitials(log.actor)}
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="max-w-[180px] truncate text-sm font-bold text-slate-800">
                                                        {log.actor}
                                                    </p>

                                                    <p className="mt-1 max-w-[180px] truncate text-xs text-slate-400">
                                                        {log.role}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* MODULE */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <span className="inline-flex items-center gap-2 text-sm font-medium text-slate-600">
                                                <Activity
                                                    size={14}
                                                    className="text-slate-400"
                                                />

                                                {log.module}
                                            </span>
                                        </td>

                                        {/* ACTION */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <ActionBadge action={log.action} />
                                        </td>

                                        {/* RESULT */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <ResultBadge result={log.result} />
                                        </td>

                                        {/* SEVERITY */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <SeverityBadge severity={log.severity} />
                                        </td>

                                        {/* IP */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-center gap-2">
                                                <Globe
                                                    size={14}
                                                    className="text-slate-400"
                                                />

                                                <span className="font-mono text-xs font-medium text-slate-600">
                                                    {log.ip}
                                                </span>
                                            </div>

                                            <p className="mt-1 text-[10px] text-slate-400">
                                                {log.location}
                                            </p>
                                        </td>

                                        {/* DATE */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <div className="flex items-start gap-2">
                                                <CalendarDays
                                                    size={14}
                                                    className="mt-0.5 text-slate-400"
                                                />

                                                <div>
                                                    <p className="text-xs font-semibold text-slate-600">
                                                        {formatDate(log.timestamp)}
                                                    </p>

                                                    <p className="mt-1 text-[11px] text-slate-400">
                                                        {new Date(log.timestamp).toLocaleTimeString(
                                                            "en-IN",
                                                            {
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                            }
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* DETAILS */}
                                        <td className="whitespace-nowrap px-4 py-4">
                                            <button
                                                type="button"
                                                onClick={() => setSelectedLog(log)}
                                                aria-label={`View details for ${log.id}`}
                                                title="View audit details"
                                                className="inline-flex h-9 items-center justify-center gap-2 rounded-lg border border-orange-200 bg-orange-50 px-3 text-xs font-bold text-[#F4512B] transition hover:bg-[#F4512B] hover:text-white"
                                            >
                                                <Eye size={14} />
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* EMPTY */}
                    {visibleLogs.length === 0 && (
                        <EmptyState onReset={resetFilters} />
                    )}

                    {/* TABLE FOOTER */}
                    {filteredLogs.length > 0 && (
                        <div className="flex flex-col gap-3 border-t border-slate-100 bg-white px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
                            <p className="text-xs text-slate-400">
                                Showing{" "}
                                <span className="font-semibold text-slate-600">
                                    {visibleLogs.length}
                                </span>{" "}
                                audit events on this page
                            </p>

                            <div className="flex flex-wrap items-center gap-1.5">
                                <button
                                    type="button"
                                    disabled={safePage <= 1}
                                    onClick={() =>
                                        setPage((current) => Math.max(1, current - 1))
                                    }
                                    aria-label="Previous page"
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronLeft size={16} />
                                </button>

                                {Array.from(
                                    { length: totalPages },
                                    (_, index) => index + 1
                                )
                                    .filter(
                                        (number) =>
                                            number === 1 ||
                                            number === totalPages ||
                                            Math.abs(number - safePage) <= 1
                                    )
                                    .map((number, index, numbers) => (
                                        <span key={number} className="contents">
                                            {index > 0 &&
                                                number - numbers[index - 1] > 1 && (
                                                    <span className="px-1 text-slate-400">
                                                        …
                                                    </span>
                                                )}

                                            <button
                                                type="button"
                                                onClick={() => setPage(number)}
                                                aria-label={`Go to page ${number}`}
                                                aria-current={
                                                    safePage === number ? "page" : undefined
                                                }
                                                className={[
                                                    "min-w-9 rounded-lg border px-3 py-2 text-xs font-bold transition",
                                                    safePage === number
                                                        ? "border-[#F4512B] bg-[#F4512B] text-white"
                                                        : "border-slate-200 bg-white text-slate-600 hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B]",
                                                ].join(" ")}
                                            >
                                                {number}
                                            </button>
                                        </span>
                                    ))}

                                <button
                                    type="button"
                                    disabled={safePage >= totalPages}
                                    onClick={() =>
                                        setPage((current) =>
                                            Math.min(totalPages, current + 1)
                                        )
                                    }
                                    aria-label="Next page"
                                    className="rounded-lg border border-slate-200 p-2 text-slate-500 transition hover:border-orange-200 hover:bg-orange-50 hover:text-[#F4512B] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <ChevronRight size={16} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* FOOTER NOTE */}
                <div className="mt-5 flex items-start gap-2 rounded-xl border border-slate-200/80 bg-white/70 px-4 py-3 text-xs leading-5 text-slate-400">
                    <ShieldCheck
                        size={15}
                        className="mt-0.5 shrink-0"
                    />

                    <p>
                        Audit records shown here are sample data stored in browser
                        localStorage. A production audit trail should be generated and
                        stored by the backend with protected, append-only records,
                        authenticated actor identity and verified timestamps.
                    </p>
                </div>
            </div>

            {/* DETAILS MODAL */}
            <AnimatePresence>
                {selectedLog && (
                    <AuditLogDetailsModal
                        key={selectedLog.id}
                        log={selectedLog}
                        onClose={() => setSelectedLog(null)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}