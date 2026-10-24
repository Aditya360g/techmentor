import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
    AlertCircle,
    ArrowDownToLine,
    ArrowRight,
    BriefcaseBusiness,
    CalendarDays,
    Check,
    CheckCircle2,
    ChevronDown,
    Clock3,
    Eye,
    Filter,
    GraduationCap,
    Mail,
    MapPin,
    MessageSquare,
    Plus,
    Search,
    Send,
    SlidersHorizontal,
    Users,
    X,
    XCircle,
    RotateCcw,
    FileText,
} from "lucide-react";

/* =========================================================
   CONFIGURATION
========================================================= */

const STORAGE_KEY = "techmentor-college-trainer-requests-v1";

const TRAINERS = [
    "Aman Sharma",
    "Priya Verma",
    "Rahul Mehta",
    "Neha Singh",
    "Arjun Kumar",
    "Meera Joshi",
    "Vikram Singh",
    "Kavya Agarwal",
];

const DEPARTMENTS = [
    "Computer Science",
    "Information Technology",
    "Data Science",
    "Electronics",
    "Management",
];

const SPECIALIZATIONS = [
    "Java Development",
    "Full Stack Development",
    "React Development",
    "Python for Data Science",
    "Machine Learning",
    "Cloud Computing",
    "DevOps Engineering",
    "Database Management",
];

const REQUEST_STATUSES = [
    "Open",
    "In Review",
    "Assigned",
    "Completed",
    "Closed",
];

const PRIORITIES = ["Low", "Medium", "High", "Urgent"];

const STATUS_STYLES = {
    Open: "border-sky-400/20 bg-sky-400/[0.08] text-sky-300",
    "In Review":
        "border-amber-400/20 bg-amber-400/[0.08] text-amber-300",
    Assigned:
        "border-violet-400/20 bg-violet-400/[0.08] text-violet-300",
    Completed:
        "border-emerald-400/20 bg-emerald-400/[0.08] text-emerald-300",
    Closed: "border-slate-400/15 bg-slate-400/[0.06] text-slate-400",
};

const PRIORITY_STYLES = {
    Low: "text-slate-400 bg-slate-400/[0.06] border-slate-400/15",
    Medium: "text-sky-300 bg-sky-400/[0.06] border-sky-400/15",
    High: "text-amber-300 bg-amber-400/[0.06] border-amber-400/15",
    Urgent: "text-rose-300 bg-rose-400/[0.06] border-rose-400/15",
};

/* =========================================================
   HELPERS
========================================================= */

function getLocalDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
}

function formatDate(value) {
    if (!value) return "—";

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) return value;

    return new Intl.DateTimeFormat("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    }).format(date);
}

function createInitialRequests() {
    const today = getLocalDate();

    return [
        {
            id: "REQ-26001",
            title: "Java Development Trainer",
            department: "Computer Science",
            specialization: "Java Development",
            description:
                "We require an experienced Java trainer for core Java, OOP, collections and interview preparation.",
            batches: 2,
            students: 80,
            startDate: today,
            duration: "8 weeks",
            mode: "Hybrid",
            priority: "High",
            status: "Open",
            assignedTrainer: "",
            contactName: "Academic Coordinator",
            contactEmail: "academics@example.edu",
            createdAt: today,
            notes: "",
        },
        {
            id: "REQ-26002",
            title: "Python and Data Science Faculty",
            department: "Data Science",
            specialization: "Python for Data Science",
            description:
                "Looking for a practical Python instructor for data analysis, Pandas, NumPy and student projects.",
            batches: 1,
            students: 45,
            startDate: today,
            duration: "6 weeks",
            mode: "Online",
            priority: "Medium",
            status: "In Review",
            assignedTrainer: "",
            contactName: "Training Coordinator",
            contactEmail: "training@example.edu",
            createdAt: today,
            notes: "",
        },
        {
            id: "REQ-26003",
            title: "Full Stack Development Program",
            department: "Information Technology",
            specialization: "Full Stack Development",
            description:
                "Industry-oriented React, API integration and database training for final-year students.",
            batches: 3,
            students: 120,
            startDate: today,
            duration: "12 weeks",
            mode: "In-person",
            priority: "Urgent",
            status: "Assigned",
            assignedTrainer: "Rahul Mehta",
            contactName: "Placement Coordinator",
            contactEmail: "placements@example.edu",
            createdAt: today,
            notes: "Trainer allocation is for the pilot batch.",
        },
        {
            id: "REQ-26004",
            title: "Machine Learning Workshop",
            department: "Data Science",
            specialization: "Machine Learning",
            description:
                "A practical workshop covering model training, evaluation and project deployment basics.",
            batches: 1,
            students: 55,
            startDate: today,
            duration: "4 weeks",
            mode: "Online",
            priority: "Low",
            status: "Completed",
            assignedTrainer: "Priya Verma",
            contactName: "Department Coordinator",
            contactEmail: "ds@example.edu",
            createdAt: today,
            notes: "Workshop completed successfully in demo data.",
        },
    ];
}

function loadRequests() {
    try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (saved) {
            const parsed = JSON.parse(saved);

            if (Array.isArray(parsed)) return parsed;
        }
    } catch (error) {
        console.error("Unable to load trainer requests:", error);
    }

    return createInitialRequests();
}

function getNextStatus(status) {
    const flow = {
        Open: "In Review",
        "In Review": "Assigned",
        Assigned: "Completed",
        Completed: "Closed",
        Closed: "Open",
    };

    return flow[status] || "Open";
}

function exportRequests(requests) {
    const headers = [
        "Request ID",
        "Title",
        "Department",
        "Specialization",
        "Priority",
        "Status",
        "Assigned Trainer",
        "Batches",
        "Students",
        "Start Date",
        "Duration",
        "Mode",
        "Contact Name",
        "Contact Email",
        "Description",
    ];

    const rows = requests.map((request) => [
        request.id,
        request.title,
        request.department,
        request.specialization,
        request.priority,
        request.status,
        request.assignedTrainer,
        request.batches,
        request.students,
        request.startDate,
        request.duration,
        request.mode,
        request.contactName,
        request.contactEmail,
        request.description,
    ]);

    const csv = [headers, ...rows]
        .map((row) =>
            row
                .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
                .join(",")
        )
        .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
        type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "college-trainer-requests.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

/* =========================================================
   REUSABLE FIELD COMPONENTS
========================================================= */

function FieldLabel({ children, required = false }) {
    return (
        <span className="mb-2 block text-[11px] font-semibold text-slate-300">
            {children}
            {required && <span className="ml-1 text-rose-300">*</span>}
        </span>
    );
}

function TextField({
    label,
    required = false,
    className = "",
    ...props
}) {
    return (
        <label className={`block min-w-0 ${className}`}>
            <FieldLabel required={required}>{label}</FieldLabel>
            <input
                {...props}
                required={required}
                className="min-h-[43px] w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-2.5 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
            />
        </label>
    );
}

function SelectField({
    label,
    options,
    required = false,
    className = "",
    ...props
}) {
    return (
        <label className={`block min-w-0 ${className}`}>
            <FieldLabel required={required}>{label}</FieldLabel>

            <select
                {...props}
                required={required}
                className="min-h-[43px] w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#091322] px-3 py-2.5 text-xs text-slate-100 outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
            >
                {options.map((option) => {
                    const item =
                        typeof option === "string"
                            ? { label: option, value: option }
                            : option;

                    return (
                        <option
                            key={item.value}
                            value={item.value}
                            className="bg-[#0f1b2c] text-white"
                        >
                            {item.label}
                        </option>
                    );
                })}
            </select>
        </label>
    );
}

function StatusBadge({ status }) {
    const Icon =
        status === "Completed"
            ? CheckCircle2
            : status === "Closed"
                ? XCircle
                : status === "In Review"
                    ? Clock3
                    : status === "Assigned"
                        ? Users
                        : AlertCircle;

    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-semibold ${STATUS_STYLES[status] || STATUS_STYLES.Open
                }`}
        >
            <Icon size={11} />
            {status}
        </span>
    );
}

function PriorityBadge({ priority }) {
    return (
        <span
            className={`inline-flex items-center rounded-full border px-2.5 py-1 text-[10px] font-semibold ${PRIORITY_STYLES[priority] || PRIORITY_STYLES.Medium
                }`}
        >
            {priority}
        </span>
    );
}

function StatCard({ label, value, description, icon: Icon, color }) {
    return (
        <motion.article
            whileHover={{ y: -2 }}
            className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5"
        >
            <div className="flex min-w-0 items-start justify-between gap-3">
                <div className="min-w-0">
                    <p className="truncate text-[11px] font-medium text-slate-400">
                        {label}
                    </p>
                    <p className="mt-3 text-2xl font-extrabold tracking-tight text-white">
                        {value}
                    </p>
                    <p className="mt-1 text-[10px] leading-5 text-slate-500">
                        {description}
                    </p>
                </div>

                <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.035] ${color}`}
                >
                    <Icon size={19} />
                </span>
            </div>
        </motion.article>
    );
}

/* =========================================================
   CREATE REQUEST MODAL
========================================================= */

function RequestFormModal({ onClose, onCreate }) {
    const [form, setForm] = useState({
        title: "",
        department: "Computer Science",
        specialization: "Java Development",
        description: "",
        batches: "1",
        students: "40",
        startDate: getLocalDate(),
        duration: "8 weeks",
        mode: "Hybrid",
        priority: "Medium",
        contactName: "",
        contactEmail: "",
        notes: "",
    });

    const [error, setError] = useState("");

    function changeField(event) {
        const { name, value } = event.target;

        setForm((current) => ({
            ...current,
            [name]: value,
        }));

        setError("");
    }

    function handleSubmit(event) {
        event.preventDefault();

        if (form.title.trim().length < 4) {
            setError("Request title should have at least 4 characters.");
            return;
        }

        if (form.description.trim().length < 10) {
            setError("Please provide a more detailed request description.");
            return;
        }

        if (Number(form.batches) < 1 || Number(form.students) < 1) {
            setError("Batches and student count must be at least 1.");
            return;
        }

        const request = {
            ...form,
            id: `REQ-${Date.now().toString().slice(-8)}`,
            title: form.title.trim(),
            description: form.description.trim(),
            batches: Number(form.batches),
            students: Number(form.students),
            assignedTrainer: "",
            status: "Open",
            createdAt: getLocalDate(),
        };

        onCreate(request);
        onClose();
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-[#020712]/85 p-3 backdrop-blur-md sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <motion.section
                initial={{ opacity: 0, y: 18, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.985 }}
                transition={{ duration: 0.2 }}
                role="dialog"
                aria-modal="true"
                aria-label="Create trainer request"
                className="my-auto max-h-[94vh] w-full max-w-3xl overflow-y-auto rounded-2xl border border-sky-400/15 bg-[#0d1829] shadow-2xl shadow-black/50"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-white/[0.07] bg-[#0d1829]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">
                            Trainer collaboration
                        </p>
                        <h2 className="mt-1.5 text-lg font-bold text-white">
                            Create trainer request
                        </h2>
                        <p className="mt-1 text-[11px] text-slate-400">
                            Share your institution's training requirement.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close request form"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-sky-400/30 hover:text-white"
                    >
                        <X size={17} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <TextField
                            className="sm:col-span-2"
                            label="Request title"
                            name="title"
                            value={form.title}
                            onChange={changeField}
                            placeholder="e.g. Advanced Full Stack Development Trainer"
                            maxLength={120}
                            required
                        />

                        <SelectField
                            label="Department"
                            name="department"
                            value={form.department}
                            onChange={changeField}
                            options={DEPARTMENTS}
                            required
                        />

                        <SelectField
                            label="Required specialization"
                            name="specialization"
                            value={form.specialization}
                            onChange={changeField}
                            options={SPECIALIZATIONS}
                            required
                        />

                        <TextField
                            label="Number of batches"
                            name="batches"
                            type="number"
                            min="1"
                            max="100"
                            value={form.batches}
                            onChange={changeField}
                            required
                        />

                        <TextField
                            label="Expected students"
                            name="students"
                            type="number"
                            min="1"
                            max="10000"
                            value={form.students}
                            onChange={changeField}
                            required
                        />

                        <TextField
                            label="Preferred start date"
                            name="startDate"
                            type="date"
                            value={form.startDate}
                            onChange={changeField}
                            required
                        />

                        <SelectField
                            label="Training duration"
                            name="duration"
                            value={form.duration}
                            onChange={changeField}
                            options={[
                                "1 week",
                                "2 weeks",
                                "4 weeks",
                                "6 weeks",
                                "8 weeks",
                                "12 weeks",
                                "16 weeks",
                                "Custom duration",
                            ]}
                            required
                        />

                        <SelectField
                            label="Training mode"
                            name="mode"
                            value={form.mode}
                            onChange={changeField}
                            options={["Online", "In-person", "Hybrid"]}
                            required
                        />

                        <SelectField
                            label="Priority"
                            name="priority"
                            value={form.priority}
                            onChange={changeField}
                            options={PRIORITIES}
                            required
                        />

                        <TextField
                            label="Contact person"
                            name="contactName"
                            value={form.contactName}
                            onChange={changeField}
                            placeholder="Academic coordinator"
                            required
                        />

                        <TextField
                            label="Contact email"
                            name="contactEmail"
                            type="email"
                            value={form.contactEmail}
                            onChange={changeField}
                            placeholder="coordinator@college.edu"
                            required
                        />

                        <label className="block sm:col-span-2">
                            <FieldLabel required>Training requirement</FieldLabel>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={changeField}
                                rows={4}
                                maxLength={1500}
                                required
                                placeholder="Describe the skills, topics, experience and expected outcomes..."
                                className="w-full resize-y rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-3 text-xs leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
                            />
                        </label>

                        <label className="block sm:col-span-2">
                            <FieldLabel>Additional notes</FieldLabel>
                            <textarea
                                name="notes"
                                value={form.notes}
                                onChange={changeField}
                                rows={2}
                                maxLength={800}
                                placeholder="Optional schedule, equipment or trainer requirements..."
                                className="w-full resize-y rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-3 text-xs leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
                            />
                        </label>
                    </div>

                    {error && (
                        <div
                            role="alert"
                            className="flex items-start gap-2.5 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-3.5 text-xs leading-5 text-rose-200"
                        >
                            <AlertCircle size={15} className="mt-0.5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="flex flex-col-reverse justify-end gap-2 border-t border-white/[0.07] pt-4 sm:flex-row">
                        <button
                            type="button"
                            onClick={onClose}
                            className="min-h-[42px] rounded-xl border border-white/[0.09] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.04] hover:text-white"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-5 text-xs font-bold text-[#07111f] transition hover:brightness-110"
                        >
                            <Send size={14} />
                            Submit request
                        </button>
                    </div>
                </form>
            </motion.section>
        </motion.div>
    );
}

/* =========================================================
   REQUEST DETAILS MODAL
========================================================= */

function RequestDetailsModal({
    request,
    onClose,
    onChangeStatus,
    onAssignTrainer,
}) {
    if (!request) return null;

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[9000] flex items-center justify-center overflow-y-auto bg-[#020712]/85 p-3 backdrop-blur-md sm:p-6"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <motion.section
                initial={{ opacity: 0, y: 16, scale: 0.985 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10 }}
                role="dialog"
                aria-modal="true"
                aria-label="Trainer request details"
                className="my-auto max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-sky-400/15 bg-[#0d1829] shadow-2xl shadow-black/50"
            >
                <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/[0.07] bg-[#0d1829]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
                    <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-sky-300">
                            {request.id}
                        </p>
                        <h2 className="mt-1.5 text-lg font-bold text-white">
                            Request details
                        </h2>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close request details"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 hover:text-white"
                    >
                        <X size={17} />
                    </button>
                </div>

                <div className="space-y-5 p-5 sm:p-6">
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={request.status} />
                            <PriorityBadge priority={request.priority} />
                        </div>

                        <h3 className="mt-3 text-xl font-bold text-white">
                            {request.title}
                        </h3>

                        <p className="mt-2 text-xs leading-6 text-slate-400">
                            {request.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {[
                            ["Department", request.department],
                            ["Specialization", request.specialization],
                            ["Batches", request.batches],
                            ["Expected students", request.students],
                            ["Preferred start", formatDate(request.startDate)],
                            ["Duration", request.duration],
                            ["Training mode", request.mode],
                            ["Created on", formatDate(request.createdAt)],
                            ["Contact person", request.contactName],
                            ["Contact email", request.contactEmail],
                        ].map(([label, value]) => (
                            <div
                                key={label}
                                className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
                            >
                                <p className="text-[10px] text-slate-500">{label}</p>
                                <p className="mt-1.5 break-words text-xs font-semibold text-slate-200">
                                    {value || "—"}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.13em] text-slate-400">
                            Trainer assignment
                        </p>

                        <div className="mt-3">
                            <label className="block">
                                <span className="mb-2 block text-[11px] text-slate-400">
                                    Assigned trainer
                                </span>

                                <select
                                    value={request.assignedTrainer || ""}
                                    onChange={(event) =>
                                        onAssignTrainer(request.id, event.target.value)
                                    }
                                    disabled={
                                        request.status === "Completed" ||
                                        request.status === "Closed"
                                    }
                                    className="min-h-[43px] w-full rounded-xl border border-white/[0.09] bg-[#091322] px-3 text-xs text-slate-100 outline-none focus:border-sky-400/40 disabled:opacity-50"
                                >
                                    <option value="">Not assigned</option>
                                    {TRAINERS.map((trainer) => (
                                        <option
                                            key={trainer}
                                            value={trainer}
                                            className="bg-[#0f1b2c]"
                                        >
                                            {trainer}
                                        </option>
                                    ))}
                                </select>
                            </label>
                        </div>

                        {request.notes && (
                            <p className="mt-4 text-xs leading-6 text-slate-400">
                                <span className="font-semibold text-slate-300">Notes: </span>
                                {request.notes}
                            </p>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 border-t border-white/[0.07] pt-4 sm:flex-row">
                        <button
                            type="button"
                            disabled={
                                request.status === "Completed" || request.status === "Closed"
                            }
                            onClick={() =>
                                onChangeStatus(request.id, getNextStatus(request.status))
                            }
                            className="inline-flex min-h-[42px] flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-4 text-xs font-bold text-[#07111f] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <Check size={14} />
                            Move to {getNextStatus(request.status)}
                        </button>

                        {request.status !== "Closed" && (
                            <button
                                type="button"
                                onClick={() => onChangeStatus(request.id, "Closed")}
                                className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/[0.09] px-4 text-xs font-semibold text-slate-300 transition hover:border-rose-400/25 hover:text-rose-200"
                            >
                                <XCircle size={14} />
                                Close request
                            </button>
                        )}
                    </div>
                </div>
            </motion.section>
        </motion.div>
    );
}

/* =========================================================
   REQUEST CARD
========================================================= */

function RequestCard({
    request,
    onView,
    onStatusChange,
    onAssignTrainer,
}) {
    return (
        <motion.article
            layout
            initial={{ opacity: 0, y: 9 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 transition-colors hover:border-sky-400/20 sm:p-5"
        >
            <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="flex min-w-0 gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.06] text-sky-200">
                        <BriefcaseBusiness size={19} />
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-semibold text-slate-500">
                                {request.id}
                            </span>
                            <PriorityBadge priority={request.priority} />
                        </div>

                        <h3 className="mt-1.5 break-words text-sm font-bold text-white">
                            {request.title}
                        </h3>

                        <p className="mt-1.5 text-[11px] text-slate-400">
                            {request.department} · {request.specialization}
                        </p>
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 self-start">
                    <StatusBadge status={request.status} />
                    <button
                        type="button"
                        onClick={() => onView(request)}
                        aria-label={`View ${request.title}`}
                        title="View request"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-sky-400/25 hover:text-sky-200"
                    >
                        <Eye size={15} />
                    </button>
                </div>
            </div>

            <p className="mt-4 line-clamp-2 text-xs leading-6 text-slate-400">
                {request.description}
            </p>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/[0.06] pt-4 sm:grid-cols-4">
                <div>
                    <p className="text-[10px] text-slate-500">Students</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-200">
                        <Users size={13} className="text-sky-300" />
                        {request.students}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] text-slate-500">Batches</p>
                    <p className="mt-1.5 text-xs font-bold text-slate-200">
                        {request.batches}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] text-slate-500">Start date</p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-200">
                        <CalendarDays size={12} className="text-sky-300" />
                        {formatDate(request.startDate)}
                    </p>
                </div>

                <div>
                    <p className="text-[10px] text-slate-500">Training mode</p>
                    <p className="mt-1.5 text-xs font-bold text-slate-200">
                        {request.mode}
                    </p>
                </div>
            </div>

            <div className="mt-4 flex min-w-0 flex-col justify-between gap-3 border-t border-white/[0.06] pt-4 sm:flex-row sm:items-center">
                <div className="min-w-0">
                    <p className="text-[10px] text-slate-500">Assigned trainer</p>
                    <p className="mt-1 truncate text-xs font-semibold text-slate-200">
                        {request.assignedTrainer || "Not assigned yet"}
                    </p>
                </div>

                <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <select
                        aria-label={`Assign trainer for ${request.title}`}
                        value={request.assignedTrainer || ""}
                        disabled={
                            request.status === "Completed" || request.status === "Closed"
                        }
                        onChange={(event) =>
                            onAssignTrainer(request.id, event.target.value)
                        }
                        className="min-h-[36px] min-w-0 max-w-full rounded-lg border border-white/[0.09] bg-[#091322] px-2.5 text-[10px] text-slate-200 outline-none focus:border-sky-400/40 disabled:opacity-50"
                    >
                        <option value="">Assign trainer...</option>
                        {TRAINERS.map((trainer) => (
                            <option key={trainer} value={trainer}>
                                {trainer}
                            </option>
                        ))}
                    </select>

                    {request.status !== "Completed" && request.status !== "Closed" && (
                        <button
                            type="button"
                            onClick={() =>
                                onStatusChange(request.id, getNextStatus(request.status))
                            }
                            className="inline-flex min-h-[36px] items-center justify-center gap-1.5 rounded-lg border border-sky-400/15 bg-sky-400/[0.05] px-3 text-[10px] font-semibold text-sky-200 transition hover:bg-sky-400/[0.1]"
                        >
                            Update status
                            <ArrowRight size={12} />
                        </button>
                    )}
                </div>
            </div>
        </motion.article>
    );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function CollegeTrainerRequestsPage() {
    const [requests, setRequests] = useState(loadRequests);

    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All statuses");
    const [priorityFilter, setPriorityFilter] = useState("All priorities");
    const [departmentFilter, setDepartmentFilter] = useState("All departments");

    const [showForm, setShowForm] = useState(false);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [toast, setToast] = useState("");

    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
        } catch (error) {
            console.error("Unable to save trainer requests:", error);
        }
    }, [requests]);

    useEffect(() => {
        if (!toast) return undefined;

        const timer = window.setTimeout(() => setToast(""), 3200);
        return () => window.clearTimeout(timer);
    }, [toast]);

    const filteredRequests = useMemo(() => {
        const query = search.trim().toLowerCase();

        return requests
            .filter((request) => {
                const searchable = [
                    request.id,
                    request.title,
                    request.department,
                    request.specialization,
                    request.assignedTrainer,
                    request.contactName,
                    request.contactEmail,
                    request.description,
                ]
                    .join(" ")
                    .toLowerCase();

                const matchesSearch = !query || searchable.includes(query);

                const matchesStatus =
                    statusFilter === "All statuses" ||
                    request.status === statusFilter;

                const matchesPriority =
                    priorityFilter === "All priorities" ||
                    request.priority === priorityFilter;

                const matchesDepartment =
                    departmentFilter === "All departments" ||
                    request.department === departmentFilter;

                return (
                    matchesSearch &&
                    matchesStatus &&
                    matchesPriority &&
                    matchesDepartment
                );
            })
            .sort((a, b) => {
                const priorityRank = {
                    Urgent: 4,
                    High: 3,
                    Medium: 2,
                    Low: 1,
                };

                const rankDifference =
                    (priorityRank[b.priority] || 0) -
                    (priorityRank[a.priority] || 0);

                if (rankDifference !== 0) return rankDifference;

                return b.createdAt.localeCompare(a.createdAt);
            });
    }, [requests, search, statusFilter, priorityFilter, departmentFilter]);

    const openCount = requests.filter((request) => request.status === "Open").length;

    const reviewCount = requests.filter(
        (request) => request.status === "In Review"
    ).length;

    const assignedCount = requests.filter(
        (request) => request.status === "Assigned"
    ).length;

    const completedCount = requests.filter(
        (request) => request.status === "Completed"
    ).length;

    const totalStudents = requests
        .filter((request) => request.status !== "Closed")
        .reduce((sum, request) => sum + (Number(request.students) || 0), 0);

    function addRequest(request) {
        setRequests((current) => [request, ...current]);
        setShowForm(false);
        setSearch("");
        setStatusFilter("All statuses");
        setPriorityFilter("All priorities");
        setDepartmentFilter("All departments");
        setToast("New trainer request created.");
    }

    function updateRequestStatus(id, status) {
        setRequests((current) =>
            current.map((request) =>
                request.id === id ? { ...request, status } : request
            )
        );

        setSelectedRequest((current) =>
            current?.id === id ? { ...current, status } : current
        );

        setToast(`Request status updated to "${status}".`);
    }

    function assignTrainer(id, trainerName) {
        setRequests((current) =>
            current.map((request) => {
                if (request.id !== id) return request;

                let newStatus = request.status;

                if (trainerName && (newStatus === "Open" || newStatus === "In Review")) {
                    newStatus = "Assigned";
                } else if (!trainerName && newStatus === "Assigned") {
                    newStatus = "In Review";
                }

                return {
                    ...request,
                    assignedTrainer: trainerName,
                    status: newStatus,
                };
            })
        );

        setSelectedRequest((current) => {
            if (current?.id !== id) return current;

            let newStatus = current.status;

            if (trainerName && (newStatus === "Open" || newStatus === "In Review")) {
                newStatus = "Assigned";
            } else if (!trainerName && newStatus === "Assigned") {
                newStatus = "In Review";
            }

            return {
                ...current,
                assignedTrainer: trainerName,
                status: newStatus,
            };
        });

        setToast(
            trainerName
                ? `${trainerName} assigned to the request.`
                : "Trainer assignment removed."
        );
    }

    function resetFilters() {
        setSearch("");
        setStatusFilter("All statuses");
        setPriorityFilter("All priorities");
        setDepartmentFilter("All departments");
    }

    function clearCompleted() {
        const confirmed = window.confirm(
            "Remove all completed and closed requests from this local demo?"
        );

        if (!confirmed) return;

        setRequests((current) =>
            current.filter(
                (request) =>
                    request.status !== "Completed" && request.status !== "Closed"
            )
        );

        setSelectedRequest(null);
        setToast("Completed and closed demo requests removed.");
    }

    return (
        <main className="college-trainer-requests-page min-h-full w-full min-w-0 overflow-x-clip bg-[#0b1424] text-slate-100">
            <style>{`
        .college-trainer-requests-page {
          color-scheme: dark;
          background:
            radial-gradient(ellipse at 8% 0%, rgba(56,189,248,.055), transparent 33%),
            radial-gradient(ellipse at 95% 10%, rgba(99,102,241,.04), transparent 30%),
            #0b1424;
        }

        .college-trainer-requests-page,
        .college-trainer-requests-page * {
          box-sizing: border-box;
        }

        .college-trainer-requests-page input::placeholder,
        .college-trainer-requests-page textarea::placeholder {
          color: #64748b;
        }

        .college-trainer-requests-page .requests-scroll {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }

        .college-trainer-requests-page .requests-scroll::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }

        .college-trainer-requests-page .requests-scroll::-webkit-scrollbar-thumb {
          border-radius: 999px;
          background: #334155;
        }
      `}</style>

            <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-3 py-5 sm:px-5 sm:py-6 xl:px-7">
                {/* HEADER */}

                <motion.section
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end"
                >
                    <div className="min-w-0">
                        <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-200">
                            <Users size={12} />
                            Academic collaboration
                        </span>

                        <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
                            Trainer Requests
                        </h1>

                        <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">
                            Manage faculty requirements, assign trainers and track request
                            progress from one place.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <button
                            type="button"
                            onClick={() => exportRequests(filteredRequests)}
                            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-white/[0.025] px-3.5 text-xs font-semibold text-slate-200 transition hover:border-sky-400/25 hover:text-white"
                        >
                            <ArrowDownToLine size={15} />
                            Export CSV
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-4 text-xs font-bold text-[#07111f] shadow-lg shadow-sky-950/20 transition hover:brightness-110"
                        >
                            <Plus size={16} />
                            New request
                        </button>
                    </div>
                </motion.section>

                {/* STATS */}

                <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 2xl:grid-cols-4">
                    <StatCard
                        label="Open requests"
                        value={openCount}
                        description="Waiting for initial review"
                        icon={FileText}
                        color="text-sky-300"
                    />

                    <StatCard
                        label="Under review"
                        value={reviewCount}
                        description="Requirements being reviewed"
                        icon={Clock3}
                        color="text-amber-300"
                    />

                    <StatCard
                        label="Assigned requests"
                        value={assignedCount}
                        description="Trainer allocation in progress"
                        icon={GraduationCap}
                        color="text-violet-300"
                    />

                    <StatCard
                        label="Expected students"
                        value={totalStudents.toLocaleString("en-IN")}
                        description={`${completedCount} completed requests`}
                        icon={Users}
                        color="text-emerald-300"
                    />
                </section>

                {/* SEARCH + FILTERS */}

                <section className="rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
                    <div className="flex min-w-0 flex-col justify-between gap-3 xl:flex-row xl:items-center">
                        <div className="relative min-w-0 flex-1">
                            <Search
                                size={16}
                                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                            />

                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Search request, department, trainer or contact..."
                                aria-label="Search trainer requests"
                                className="min-h-[45px] w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#091322] py-3 pl-10 pr-4 text-xs text-white outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
                            />
                        </div>

                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="inline-flex min-h-[39px] items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-[10px] font-semibold text-slate-300 transition hover:border-sky-400/25 hover:text-white"
                            >
                                <RotateCcw size={12} />
                                Reset
                            </button>

                            <button
                                type="button"
                                onClick={clearCompleted}
                                className="inline-flex min-h-[39px] items-center gap-1.5 rounded-lg border border-white/[0.08] px-3 text-[10px] font-semibold text-slate-400 transition hover:border-rose-400/20 hover:text-rose-300"
                            >
                                <XCircle size={12} />
                                Clear completed
                            </button>
                        </div>
                    </div>

                    <div className="mt-4 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-3">
                        <SelectField
                            label="Request status"
                            value={statusFilter}
                            onChange={(event) => setStatusFilter(event.target.value)}
                            options={["All statuses", ...REQUEST_STATUSES]}
                        />

                        <SelectField
                            label="Priority"
                            value={priorityFilter}
                            onChange={(event) => setPriorityFilter(event.target.value)}
                            options={["All priorities", ...PRIORITIES]}
                        />

                        <SelectField
                            label="Department"
                            value={departmentFilter}
                            onChange={(event) => setDepartmentFilter(event.target.value)}
                            options={["All departments", ...DEPARTMENTS]}
                        />
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-slate-500">
                        <SlidersHorizontal size={12} className="text-sky-300" />
                        Showing
                        <span className="font-semibold text-slate-300">
                            {filteredRequests.length}
                        </span>
                        of
                        <span className="font-semibold text-slate-300">
                            {requests.length}
                        </span>
                        requests
                    </div>
                </section>

                {/* REQUEST LIST HEADER */}

                <section className="flex min-w-0 flex-col justify-between gap-3 sm:flex-row sm:items-end">
                    <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                            <h2 className="text-base font-bold text-white sm:text-lg">
                                Request directory
                            </h2>

                            <span className="rounded-lg border border-sky-400/15 bg-sky-400/[0.06] px-2 py-1 text-[10px] font-bold text-sky-200">
                                {filteredRequests.length}
                            </span>
                        </div>

                        <p className="mt-1.5 text-[11px] leading-5 text-slate-500">
                            Review requirements, allocate faculty and update request status.
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-2 self-start text-[10px] text-slate-500 sm:self-auto">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Demo request records
                    </span>
                </section>

                {/* REQUEST CARDS */}

                {filteredRequests.length > 0 ? (
                    <section className="grid min-w-0 grid-cols-1 gap-4">
                        <AnimatePresence mode="popLayout">
                            {filteredRequests.map((request) => (
                                <RequestCard
                                    key={request.id}
                                    request={request}
                                    onView={setSelectedRequest}
                                    onStatusChange={updateRequestStatus}
                                    onAssignTrainer={assignTrainer}
                                />
                            ))}
                        </AnimatePresence>
                    </section>
                ) : (
                    <motion.section
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-2xl border border-dashed border-white/[0.12] bg-[#111c2d]/50 px-5 py-14 text-center"
                    >
                        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.08] bg-white/[0.025] text-slate-500">
                            <Search size={23} />
                        </span>

                        <h3 className="mt-4 text-sm font-bold text-white">
                            No requests found
                        </h3>

                        <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-500">
                            Try different filters or create a new trainer request.
                        </p>

                        <div className="mt-5 flex flex-wrap justify-center gap-2">
                            <button
                                type="button"
                                onClick={resetFilters}
                                className="rounded-xl border border-white/[0.09] px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:text-white"
                            >
                                Reset filters
                            </button>

                            <button
                                type="button"
                                onClick={() => setShowForm(true)}
                                className="inline-flex items-center gap-2 rounded-xl bg-sky-400 px-4 py-2.5 text-xs font-bold text-[#07111f] transition hover:bg-sky-300"
                            >
                                <Plus size={14} />
                                Create request
                            </button>
                        </div>
                    </motion.section>
                )}

                {/* BOTTOM SUMMARY */}

                <section className="relative overflow-hidden rounded-2xl border border-sky-400/15 bg-gradient-to-r from-[#102138] via-[#102039] to-[#131d37] p-5 sm:p-6">
                    <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-sky-400/[0.06] blur-3xl" />

                    <div className="relative flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 items-start gap-3">
                            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.07] text-sky-200">
                                <MessageSquare size={19} />
                            </span>

                            <div className="min-w-0">
                                <h3 className="text-sm font-bold text-white">
                                    Trainer request workflow
                                </h3>
                                <p className="mt-1 max-w-2xl text-[11px] leading-6 text-slate-400">
                                    Track each request from open to review, assign an available
                                    trainer, and mark the engagement completed when finished.
                                </p>
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={() => setShowForm(true)}
                            className="inline-flex min-h-[40px] shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-sky-400 px-4 text-xs font-bold text-[#07111f] transition hover:bg-sky-300 sm:self-auto"
                        >
                            Create request
                            <ArrowRight size={14} />
                        </button>
                    </div>
                </section>

                <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.07] pt-5 text-[10px] text-slate-500 sm:flex-row sm:items-center">
                    <span>College trainer requests</span>
                    <span className="inline-flex items-center gap-2">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                        Saved in this browser
                    </span>
                </footer>
            </div>

            {/* CREATE REQUEST MODAL */}

            <AnimatePresence>
                {showForm && (
                    <RequestFormModal
                        key="create-trainer-request"
                        onClose={() => setShowForm(false)}
                        onCreate={addRequest}
                    />
                )}
            </AnimatePresence>

            {/* REQUEST DETAILS MODAL */}

            <AnimatePresence>
                {selectedRequest && (
                    <RequestDetailsModal
                        key={selectedRequest.id}
                        request={selectedRequest}
                        onClose={() => setSelectedRequest(null)}
                        onChangeStatus={updateRequestStatus}
                        onAssignTrainer={assignTrainer}
                    />
                )}
            </AnimatePresence>

            {/* TOAST */}

            <AnimatePresence>
                {toast && (
                    <motion.div
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        role="status"
                        className="fixed right-4 top-20 z-[12000] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-emerald-400/20 bg-[#10211e] px-4 py-3 text-emerald-200 shadow-2xl sm:right-6"
                    >
                        <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                        <p className="text-xs leading-5">{toast}</p>
                        <button
                            type="button"
                            onClick={() => setToast("")}
                            aria-label="Dismiss notification"
                            className="ml-1 rounded-md p-0.5 opacity-70 transition hover:opacity-100"
                        >
                            <X size={14} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
}