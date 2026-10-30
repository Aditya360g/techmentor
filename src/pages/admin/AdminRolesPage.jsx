import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "motion/react";

import {
    Activity,
    ArrowUpRight,
    Check,
    CheckCircle2,
    ChevronDown,
    CircleAlert,
    KeyRound,
    LockKeyhole,
    Pencil,
    Plus,
    RefreshCw,
    Search,
    ShieldCheck,
    Users,
    UserCog,
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
   AVAILABLE PERMISSIONS
===================================================== */

const permissionGroups = [
    {
        title: "Platform Access",
        permissions: [
            "View dashboard",
            "View analytics",
            "Manage platform settings",
        ],
    },
    {
        title: "People Management",
        permissions: [
            "View students",
            "Manage students",
            "View trainers",
            "Manage trainers",
            "Manage colleges",
            "Manage administrator roles",
        ],
    },
    {
        title: "Academic Operations",
        permissions: [
            "Manage courses",
            "Manage trainer requests",
            "Manage assignments",
            "Manage demo schedules",
        ],
    },
    {
        title: "Business & Communication",
        permissions: [
            "View payments",
            "Manage payments",
            "Manage notifications",
            "Manage feedback",
        ],
    },
    {
        title: "Security & Auditing",
        permissions: [
            "View audit logs",
            "Manage security settings",
        ],
    },
];

const allPermissions = permissionGroups.flatMap(
    (group) => group.permissions
);

/* =====================================================
   DEMO ROLE RECORDS

   Connect backend API for real role persistence.
===================================================== */

const initialRoles = [
    {
        id: "ROLE-001",
        name: "Super Admin",
        description: "Full administrative access to the platform.",
        type: "System",
        users: 2,
        status: "Active",
        permissions: [...allPermissions],
    },
    {
        id: "ROLE-002",
        name: "Platform Admin",
        description: "Manages platform operations and user accounts.",
        type: "Built-in",
        users: 3,
        status: "Active",
        permissions: [
            "View dashboard",
            "View analytics",
            "View students",
            "Manage students",
            "View trainers",
            "Manage trainers",
            "Manage colleges",
            "Manage courses",
            "Manage trainer requests",
            "Manage assignments",
            "Manage demo schedules",
            "View payments",
            "Manage notifications",
            "Manage feedback",
            "View audit logs",
        ],
    },
    {
        id: "ROLE-003",
        name: "Academic Manager",
        description: "Oversees courses, trainers and academic activities.",
        type: "Built-in",
        users: 5,
        status: "Active",
        permissions: [
            "View dashboard",
            "View analytics",
            "View students",
            "View trainers",
            "Manage courses",
            "Manage trainer requests",
            "Manage assignments",
            "Manage demo schedules",
        ],
    },
    {
        id: "ROLE-004",
        name: "Finance Manager",
        description: "Responsible for payment and invoice operations.",
        type: "Custom",
        users: 2,
        status: "Active",
        permissions: [
            "View dashboard",
            "View analytics",
            "View payments",
            "Manage payments",
        ],
    },
    {
        id: "ROLE-005",
        name: "Support Manager",
        description: "Handles notifications, feedback and user issues.",
        type: "Custom",
        users: 4,
        status: "Active",
        permissions: [
            "View dashboard",
            "View students",
            "View trainers",
            "Manage notifications",
            "Manage feedback",
        ],
    },
    {
        id: "ROLE-006",
        name: "Read Only",
        description: "Can view permitted information without making changes.",
        type: "Custom",
        users: 1,
        status: "Inactive",
        permissions: [
            "View dashboard",
            "View analytics",
            "View students",
            "View trainers",
            "View payments",
            "View audit logs",
        ],
    },
];

/* =====================================================
   OPTIONS
===================================================== */

const statusOptions = [
    { label: "All statuses", value: "all" },
    { label: "Active", value: "Active" },
    { label: "Inactive", value: "Inactive" },
];

const typeOptions = [
    { label: "All role types", value: "all" },
    { label: "System", value: "System" },
    { label: "Built-in", value: "Built-in" },
    { label: "Custom", value: "Custom" },
];

/* =====================================================
   HELPERS
===================================================== */

function formatNumber(value) {
    return new Intl.NumberFormat("en-IN").format(value || 0);
}

/* =====================================================
   CUSTOM DROPDOWN
===================================================== */

function PremiumDropdown({
    value,
    onChange,
    options,
    label,
    minWidth = 155,
}) {
    const [open, setOpen] = useState(false);

    const selected =
        options.find((option) => option.value === value) || options[0];

    return (
        <div className="relative" style={{ minWidth }}>
            <button
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => setOpen((current) => !current)}
                className="flex h-11 w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 text-left outline-none transition-all hover:border-[#F2B3A3] focus:ring-4 focus:ring-orange-100"
                style={{
                    borderColor: open ? "#F3A58F" : COLORS.border,
                }}
            >
                <span className="truncate text-[12px] font-extrabold text-[#252525]">
                    {selected.label}
                </span>

                <motion.span
                    animate={{ rotate: open ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                    className="shrink-0 text-[#454545]"
                >
                    <ChevronDown size={16} />
                </motion.span>
            </button>

            <AnimatePresence>
                {open && (
                    <>
                        <button
                            type="button"
                            aria-label="Close dropdown"
                            onClick={() => setOpen(false)}
                            className="fixed inset-0 z-[70] cursor-default"
                        />

                        <motion.div
                            initial={{ opacity: 0, y: 6, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 4, scale: 0.98 }}
                            transition={{ duration: 0.16 }}
                            role="listbox"
                            className="absolute right-0 top-[calc(100%+8px)] z-[80] w-max min-w-full overflow-hidden rounded-xl border border-[#E8E8E8] bg-white p-1.5 shadow-[0_14px_36px_rgba(0,0,0,0.13)]"
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
                                        className="flex min-h-[40px] w-full items-center justify-between gap-4 rounded-lg px-3 text-left transition-colors hover:bg-[#FFF8F5]"
                                        style={{
                                            backgroundColor: isSelected
                                                ? COLORS.orangeLight
                                                : "#FFFFFF",
                                        }}
                                    >
                                        <span
                                            className="whitespace-nowrap text-[12px] font-bold"
                                            style={{
                                                color: isSelected
                                                    ? COLORS.orangeDark
                                                    : COLORS.black,
                                            }}
                                        >
                                            {option.label}
                                        </span>

                                        {isSelected && (
                                            <Check
                                                size={15}
                                                className="shrink-0 text-[#F4512B]"
                                            />
                                        )}
                                    </button>
                                );
                            })}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}

/* =====================================================
   STATUS BADGE
===================================================== */

function StatusBadge({ status }) {
    const active = status === "Active";

    return (
        <span
            className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1.5 text-[11px] font-extrabold"
            style={{
                backgroundColor: active ? COLORS.greenLight : COLORS.redLight,
                color: active ? "#17683D" : COLORS.red,
            }}
        >
            <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                    backgroundColor: active ? COLORS.green : COLORS.red,
                }}
            />
            {status}
        </span>
    );
}

/* =====================================================
   METRIC CARD
===================================================== */

function MetricCard({ title, value, detail, icon: Icon, color, bg, index }) {
    return (
        <motion.article
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: [0.22, 1, 0.36, 1],
            }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
        >
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-[12px] font-bold text-[#454545]">
                        {title}
                    </p>

                    <p className="mt-3 text-[29px] font-extrabold tracking-tight text-[#252525]">
                        {formatNumber(value)}
                    </p>
                </div>

                <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{ color, backgroundColor: bg }}
                >
                    <Icon size={21} />
                </div>
            </div>

            <p className="mt-4 border-t border-[#EEEEEE] pt-3 text-[11px] font-semibold text-[#454545]">
                {detail}
            </p>
        </motion.article>
    );
}

/* =====================================================
   ROLE MODAL
===================================================== */

function RoleModal({
    open,
    onClose,
    onSave,
    role,
}) {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [error, setError] = useState("");

    const isEditing = Boolean(role);

    // Reset the form every time a new role is opened.
    const formIdentity = role?.id || "new-role";

    return (
        <AnimatePresence>
            {open && (
                <RoleModalContent
                    key={formIdentity}
                    role={role}
                    onClose={onClose}
                    onSave={onSave}
                    isEditing={isEditing}
                    name={name}
                    setName={setName}
                    description={description}
                    setDescription={setDescription}
                    permissions={permissions}
                    setPermissions={setPermissions}
                    error={error}
                    setError={setError}
                />
            )}
        </AnimatePresence>
    );
}

function RoleModalContent({
    role,
    onClose,
    onSave,
    isEditing,
    name,
    setName,
    description,
    setDescription,
    permissions,
    setPermissions,
    error,
    setError,
}) {
    // Initialize all fields from the selected role, or defaults.
    // This component remounts each time the dialog opens.
    const [initialized, setInitialized] = useState(false);

    if (!initialized) {
        setName(role?.name || "");
        setDescription(role?.description || "");
        setPermissions(role?.permissions || []);
        setInitialized(true);
    }

    const togglePermission = (permission) => {
        setPermissions((current) =>
            current.includes(permission)
                ? current.filter((item) => item !== permission)
                : [...current, permission]
        );
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!name.trim()) {
            setError("Please enter a role name.");
            return;
        }

        if (permissions.length === 0) {
            setError("Select at least one permission.");
            return;
        }

        onSave({
            name: name.trim(),
            description: description.trim(),
            permissions,
        });
    };

    return (
        <motion.div
            className="fixed inset-0 z-[150] flex items-center justify-center overflow-y-auto bg-black/40 p-4 backdrop-blur-[3px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
                if (event.target === event.currentTarget) onClose();
            }}
        >
            <motion.div
                initial={{ opacity: 0, y: 18, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 12, scale: 0.98 }}
                transition={{ duration: 0.22 }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="role-modal-title"
                className="my-auto w-full max-w-[650px] overflow-hidden rounded-2xl border border-[#E8E8E8] bg-white shadow-2xl"
            >
                <div className="flex items-start justify-between gap-3 border-b border-[#EEEEEE] px-5 py-5 sm:px-6">
                    <div>
                        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                            <ShieldCheck size={21} />
                        </span>

                        <h2
                            id="role-modal-title"
                            className="mt-3 text-xl font-extrabold text-[#252525]"
                        >
                            {isEditing ? "Edit Role" : "Create New Role"}
                        </h2>

                        <p className="mt-1 text-[12px] font-semibold text-[#454545]">
                            Configure the role and its assigned permissions.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        aria-label="Close role modal"
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#E8E8E8] text-[#252525] hover:bg-[#F5F5F5]"
                    >
                        <X size={17} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="max-h-[65vh] space-y-5 overflow-y-auto p-5 sm:p-6">
                        <div>
                            <label
                                htmlFor="role-name"
                                className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                            >
                                Role name *
                            </label>

                            <input
                                id="role-name"
                                value={name}
                                onChange={(event) => {
                                    setName(event.target.value);
                                    setError("");
                                }}
                                placeholder="e.g. Content Manager"
                                required
                                className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[13px] font-bold text-[#111111] outline-none placeholder:text-[#686868] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="role-description"
                                className="mb-1.5 block text-[12px] font-extrabold text-[#252525]"
                            >
                                Description
                            </label>

                            <textarea
                                id="role-description"
                                value={description}
                                onChange={(event) =>
                                    setDescription(event.target.value)
                                }
                                rows={3}
                                placeholder="Describe this role's responsibilities..."
                                className="w-full resize-y rounded-xl border border-[#E8E8E8] bg-white px-3.5 py-3 text-[13px] font-semibold text-[#111111] outline-none placeholder:text-[#686868] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                            />
                        </div>

                        <div>
                            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                                <h3 className="text-[13px] font-extrabold text-[#252525]">
                                    Permissions
                                </h3>

                                <span className="rounded-full bg-[#FFF0EA] px-2.5 py-1 text-[11px] font-extrabold text-[#D9411F]">
                                    {permissions.length} selected
                                </span>
                            </div>

                            <div className="space-y-4">
                                {permissionGroups.map((group) => {
                                    const allSelected = group.permissions.every(
                                        (permission) => permissions.includes(permission)
                                    );

                                    return (
                                        <div
                                            key={group.title}
                                            className="overflow-hidden rounded-xl border border-[#E8E8E8]"
                                        >
                                            <div className="flex items-center justify-between gap-3 bg-[#FAFAFA] px-4 py-3">
                                                <p className="text-[12px] font-extrabold text-[#252525]">
                                                    {group.title}
                                                </p>

                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setPermissions((current) =>
                                                            allSelected
                                                                ? current.filter(
                                                                    (item) =>
                                                                        !group.permissions.includes(item)
                                                                )
                                                                : [
                                                                    ...new Set([
                                                                        ...current,
                                                                        ...group.permissions,
                                                                    ]),
                                                                ]
                                                        );

                                                        setError("");
                                                    }}
                                                    className="text-[10px] font-extrabold text-[#D9411F] hover:underline"
                                                >
                                                    {allSelected ? "Clear group" : "Select group"}
                                                </button>
                                            </div>

                                            <div className="grid grid-cols-1 gap-2 p-4 sm:grid-cols-2">
                                                {group.permissions.map((permission) => {
                                                    const checked = permissions.includes(permission);

                                                    return (
                                                        <label
                                                            key={permission}
                                                            className="flex cursor-pointer items-start gap-2.5 rounded-lg p-2 transition-colors hover:bg-[#FFF8F5]"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={checked}
                                                                onChange={() => togglePermission(permission)}
                                                                className="mt-0.5 h-4 w-4 shrink-0 accent-[#F4512B]"
                                                            />

                                                            <span className="text-[11px] font-semibold leading-5 text-[#252525]">
                                                                {permission}
                                                            </span>
                                                        </label>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {error && (
                            <p
                                role="alert"
                                className="flex items-center gap-2 text-[12px] font-extrabold text-[#B52D2D]"
                            >
                                <CircleAlert size={15} />
                                {error}
                            </p>
                        )}

                        <div className="rounded-xl border border-[#F4D5CB] bg-[#FFF8F5] p-3">
                            <p className="text-[11px] font-semibold leading-5 text-[#454545]">
                                Changes from this demo are stored in the current page state.
                                Connect server-side authorization before using these settings
                                to grant real platform access.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col-reverse gap-3 border-t border-[#EEEEEE] bg-[#FCFCFC] px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="h-11 rounded-xl border border-[#E8E8E8] bg-white px-5 text-[12px] font-extrabold text-[#252525] hover:bg-[#F5F5F5]"
                        >
                            Cancel
                        </button>

                        <motion.button
                            type="submit"
                            whileHover={{ y: -1 }}
                            whileTap={{ scale: 0.98 }}
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-[#F4512B] px-5 text-[12px] font-extrabold text-white shadow-sm hover:shadow-md"
                        >
                            <Check size={16} />
                            {isEditing ? "Save Changes" : "Create Role"}
                        </motion.button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
}

/* =====================================================
   MAIN PAGE
===================================================== */

export default function AdminRolesPage() {
    const [roles, setRoles] = useState(initialRoles);

    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [typeFilter, setTypeFilter] = useState("all");

    const [modalOpen, setModalOpen] = useState(false);
    const [editingRole, setEditingRole] = useState(null);
    const [notice, setNotice] = useState("");

    /* SUMMARY */

    const summary = useMemo(() => {
        return {
            totalRoles: roles.length,

            activeRoles: roles.filter(
                (role) => role.status === "Active"
            ).length,

            assignedUsers: roles.reduce(
                (total, role) => total + role.users,
                0
            ),

            customRoles: roles.filter(
                (role) => role.type === "Custom"
            ).length,
        };
    }, [roles]);

    /* FILTER ROLES */

    const filteredRoles = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();

        return roles.filter((role) => {
            const matchesSearch =
                !query ||
                [
                    role.id,
                    role.name,
                    role.description,
                    role.type,
                    ...role.permissions,
                ].some((value) =>
                    String(value).toLowerCase().includes(query)
                );

            const matchesStatus =
                statusFilter === "all" || role.status === statusFilter;

            const matchesType =
                typeFilter === "all" || role.type === typeFilter;

            return matchesSearch && matchesStatus && matchesType;
        });
    }, [roles, searchQuery, statusFilter, typeFilter]);

    /* MODAL */

    const openCreateModal = () => {
        setEditingRole(null);
        setModalOpen(true);
        setNotice("");
    };

    const openEditModal = (role) => {
        setEditingRole(role);
        setModalOpen(true);
        setNotice("");
    };

    const closeModal = () => {
        setModalOpen(false);
        setEditingRole(null);
    };

    /* CREATE OR UPDATE ROLE */

    const handleSaveRole = (form) => {
        if (editingRole) {
            setRoles((current) =>
                current.map((role) =>
                    role.id === editingRole.id
                        ? {
                            ...role,
                            name: form.name,
                            description: form.description,
                            permissions:
                                role.type === "System"
                                    ? role.permissions
                                    : form.permissions,
                        }
                        : role
                )
            );

            setNotice(`${form.name} updated successfully.`);
        } else {
            const duplicate = roles.some(
                (role) =>
                    role.name.toLowerCase() === form.name.toLowerCase()
            );

            if (duplicate) {
                setNotice("A role with this name already exists.");
                closeModal();
                return;
            }

            const newRole = {
                id: `ROLE-${String(Date.now()).slice(-6)}`,
                name: form.name,
                description: form.description,
                type: "Custom",
                users: 0,
                status: "Active",
                permissions: form.permissions,
            };

            setRoles((current) => [newRole, ...current]);
            setSearchQuery("");
            setStatusFilter("all");
            setTypeFilter("all");

            setNotice(`${form.name} created successfully.`);
        }

        closeModal();
    };

    /* STATUS */

    const handleToggleStatus = (role) => {
        if (role.type === "System") {
            setNotice("The system role status cannot be changed here.");
            return;
        }

        const nextStatus =
            role.status === "Active" ? "Inactive" : "Active";

        setRoles((current) =>
            current.map((item) =>
                item.id === role.id
                    ? { ...item, status: nextStatus }
                    : item
            )
        );

        setNotice(`${role.name} is now ${nextStatus.toLowerCase()}.`);
    };

    /* RESET */

    const resetFilters = () => {
        setSearchQuery("");
        setStatusFilter("all");
        setTypeFilter("all");
    };

    return (
        <div className="roles-page space-y-6 pb-8 text-[#252525]">
            <style>{`
        .roles-page input,
        .roles-page select,
        .roles-page textarea {
          color: #111111;
        }

        .roles-page input::placeholder,
        .roles-page textarea::placeholder {
          color: #686868;
          opacity: 1;
        }

        .roles-page input[type="checkbox"] {
          accent-color: #F4512B;
        }

        @media (prefers-reduced-motion: reduce) {
          .roles-page *,
          .roles-page *::before,
          .roles-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

            {/* HEADER */}

            <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
                className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
            >
                <div>
                    <div className="mb-2 flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-[#F4512B]" />

                        <span className="text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#D9411F]">
                            PLATFORM SECURITY
                        </span>
                    </div>

                    <h1 className="text-[30px] font-extrabold leading-tight tracking-[-1px] text-[#252525] sm:text-[35px]">
                        Admin Roles & Permissions
                    </h1>

                    <p className="mt-2 max-w-2xl text-[13px] font-semibold leading-6 text-[#454545]">
                        Manage administrator roles, review permissions and control
                        which capabilities each role is assigned.
                    </p>
                </div>

                <motion.button
                    type="button"
                    onClick={openCreateModal}
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex h-11 items-center justify-center gap-2 self-start rounded-xl bg-[#F4512B] px-4 text-[12px] font-extrabold text-white shadow-sm transition-shadow hover:shadow-md sm:self-auto"
                >
                    <Plus size={16} />
                    Create Role
                </motion.button>
            </motion.section>

            {/* NOTICE */}

            <AnimatePresence>
                {notice && (
                    <motion.div
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -5 }}
                        role="status"
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#CDEBD7] bg-[#F0FAF3] px-4 py-3"
                    >
                        <div className="flex items-center gap-2 text-[12px] font-extrabold text-[#17683D]">
                            <CheckCircle2 size={16} />
                            {notice}
                        </div>

                        <button
                            type="button"
                            onClick={() => setNotice("")}
                            aria-label="Dismiss notification"
                            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#E0F4E7]"
                        >
                            <X size={15} />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* METRICS */}

            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <MetricCard
                    index={0}
                    title="Total Roles"
                    value={summary.totalRoles}
                    detail="Configured role records"
                    icon={ShieldCheck}
                    color={COLORS.orange}
                    bg={COLORS.orangeLight}
                />

                <MetricCard
                    index={1}
                    title="Active Roles"
                    value={summary.activeRoles}
                    detail="Currently enabled"
                    icon={CheckCircle2}
                    color={COLORS.green}
                    bg={COLORS.greenLight}
                />

                <MetricCard
                    index={2}
                    title="Assigned Users"
                    value={summary.assignedUsers}
                    detail="Assignments across roles"
                    icon={Users}
                    color={COLORS.blue}
                    bg={COLORS.blueLight}
                />

                <MetricCard
                    index={3}
                    title="Custom Roles"
                    value={summary.customRoles}
                    detail="Configurable custom roles"
                    icon={KeyRound}
                    color={COLORS.purple}
                    bg={COLORS.purpleLight}
                />
            </section>

            {/* ROLE TABLE */}

            <motion.section
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.38, delay: 0.1 }}
                className="overflow-visible rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
            >
                <div className="flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <div>
                        <h2 className="text-[16px] font-extrabold text-[#252525]">
                            Role Directory
                        </h2>

                        <p className="mt-1.5 text-[12px] font-semibold text-[#454545]">
                            Review role access, permission counts and assigned users.
                        </p>
                    </div>

                    <span className="inline-flex items-center gap-2 self-start rounded-lg border border-[#E8E8E8] px-3 py-2 text-[11px] font-extrabold text-[#252525]">
                        <Users size={15} className="text-[#F4512B]" />
                        {formatNumber(filteredRoles.length)} roles
                    </span>
                </div>

                {/* SEARCH AND FILTERS */}

                <div className="relative z-20 flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-4 sm:px-6 lg:flex-row lg:items-center">
                    <div className="relative min-w-0 flex-1">
                        <Search
                            size={16}
                            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555555]"
                        />

                        <input
                            type="search"
                            value={searchQuery}
                            onChange={(event) => setSearchQuery(event.target.value)}
                            placeholder="Search roles, descriptions or permissions..."
                            aria-label="Search roles"
                            className="h-11 w-full rounded-xl border border-[#E8E8E8] bg-white pl-10 pr-3 text-[12px] font-bold text-[#111111] outline-none transition focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
                        />
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                        <PremiumDropdown
                            label="Filter by role status"
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={statusOptions}
                            minWidth={145}
                        />

                        <PremiumDropdown
                            label="Filter by role type"
                            value={typeFilter}
                            onChange={setTypeFilter}
                            options={typeOptions}
                            minWidth={145}
                        />

                        <button
                            type="button"
                            onClick={resetFilters}
                            title="Reset filters"
                            aria-label="Reset filters"
                            className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E8E8E8] text-[#252525] transition-colors hover:bg-[#FFF8F5]"
                        >
                            <RefreshCw size={15} />
                        </button>
                    </div>
                </div>

                {/* TABLE */}

                <div className="overflow-x-auto">
                    <table className="w-full min-w-[900px] border-collapse text-left">
                        <thead>
                            <tr className="bg-[#FAFAFA]">
                                {[
                                    "ROLE",
                                    "ROLE TYPE",
                                    "USERS",
                                    "PERMISSIONS",
                                    "STATUS",
                                    "ACTIONS",
                                ].map((heading) => (
                                    <th
                                        key={heading}
                                        className="whitespace-nowrap border-b border-[#E8E8E8] px-5 py-4 text-[10px] font-extrabold tracking-[0.05em] text-[#454545]"
                                    >
                                        {heading}
                                    </th>
                                ))}
                            </tr>
                        </thead>

                        <tbody>
                            <AnimatePresence mode="popLayout">
                                {filteredRoles.map((role, index) => (
                                    <motion.tr
                                        key={role.id}
                                        layout
                                        initial={{ opacity: 0, y: 7 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -5 }}
                                        transition={{
                                            duration: 0.2,
                                            delay: Math.min(index * 0.025, 0.1),
                                        }}
                                        className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FFFAF8]"
                                    >
                                        <td className="max-w-[330px] px-5 py-4">
                                            <div className="flex items-start gap-3">
                                                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#D9411F]">
                                                    <ShieldCheck size={19} />
                                                </span>

                                                <div className="min-w-0">
                                                    <p className="break-words text-[12px] font-extrabold text-[#252525]">
                                                        {role.name}
                                                    </p>

                                                    <p className="mt-1 text-[11px] font-semibold leading-5 text-[#555555]">
                                                        {role.description || "No description provided."}
                                                    </p>

                                                    <p className="mt-1 text-[10px] font-bold text-[#777777]">
                                                        {role.id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span
                                                className="inline-flex rounded-lg px-2.5 py-1.5 text-[10px] font-extrabold"
                                                style={{
                                                    color:
                                                        role.type === "System"
                                                            ? COLORS.purple
                                                            : role.type === "Built-in"
                                                                ? COLORS.blue
                                                                : COLORS.orangeDark,

                                                    backgroundColor:
                                                        role.type === "System"
                                                            ? COLORS.purpleLight
                                                            : role.type === "Built-in"
                                                                ? COLORS.blueLight
                                                                : COLORS.orangeLight,
                                                }}
                                            >
                                                {role.type}
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <Users
                                                    size={15}
                                                    className="text-[#454545]"
                                                />

                                                <span className="text-[12px] font-extrabold text-[#252525]">
                                                    {formatNumber(role.users)}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-5 py-4">
                                            <span className="inline-flex items-center gap-2 rounded-lg border border-[#E8E8E8] px-2.5 py-1.5 text-[11px] font-extrabold text-[#252525]">
                                                <KeyRound
                                                    size={13}
                                                    className="text-[#F4512B]"
                                                />

                                                {role.permissions.length} permissions
                                            </span>
                                        </td>

                                        <td className="px-5 py-4">
                                            <StatusBadge status={role.status} />
                                        </td>

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-2">
                                                <motion.button
                                                    type="button"
                                                    onClick={() => openEditModal(role)}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label={`Edit ${role.name}`}
                                                    title="Edit role"
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF0EA] hover:text-[#D9411F]"
                                                >
                                                    <Pencil size={15} />
                                                </motion.button>

                                                <motion.button
                                                    type="button"
                                                    onClick={() => handleToggleStatus(role)}
                                                    whileTap={{ scale: 0.95 }}
                                                    aria-label={`Change status for ${role.name}`}
                                                    title={
                                                        role.status === "Active"
                                                            ? "Deactivate role"
                                                            : "Activate role"
                                                    }
                                                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#E8E8E8] bg-white text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF0EA] hover:text-[#D9411F]"
                                                >
                                                    {role.status === "Active" ? (
                                                        <LockKeyhole size={15} />
                                                    ) : (
                                                        <CheckCircle2 size={15} />
                                                    )}
                                                </motion.button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>

                            {filteredRoles.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-5 py-14 text-center">
                                        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#D9411F]">
                                            <Search size={21} />
                                        </span>

                                        <p className="mt-3 text-[13px] font-extrabold text-[#252525]">
                                            No roles found
                                        </p>

                                        <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                                            Change your search or filters.
                                        </p>

                                        <button
                                            type="button"
                                            onClick={resetFilters}
                                            className="mt-3 text-[11px] font-extrabold text-[#D9411F] hover:underline"
                                        >
                                            Reset filters
                                        </button>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* TABLE FOOTER */}

                <div className="flex flex-col gap-2 border-t border-[#EEEEEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                    <p className="text-[11px] font-semibold text-[#454545]">
                        Showing{" "}
                        <span className="font-extrabold text-[#252525]">
                            {formatNumber(filteredRoles.length)}
                        </span>{" "}
                        of {formatNumber(roles.length)} roles
                    </p>

                    <span className="inline-flex items-center gap-2 text-[11px] font-bold text-[#454545]">
                        <Activity size={14} className="text-[#F4512B]" />
                        Role directory
                    </span>
                </div>
            </motion.section>

            {/* PERMISSION OVERVIEW */}

            <motion.section
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.16 }}
                className="rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm sm:p-6"
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2 className="text-[16px] font-extrabold text-[#252525]">
                            Permission Overview
                        </h2>

                        <p className="mt-1.5 text-[12px] font-semibold text-[#454545]">
                            Available permissions grouped by platform responsibility.
                        </p>
                    </div>

                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                        <KeyRound size={19} />
                    </span>
                </div>

                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {permissionGroups.map((group, index) => (
                        <motion.div
                            key={group.title}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                                duration: 0.28,
                                delay: index * 0.045,
                            }}
                            className="rounded-xl border border-[#EEEEEE] p-4"
                        >
                            <p className="text-[12px] font-extrabold text-[#252525]">
                                {group.title}
                            </p>

                            <p className="mt-1 text-[10px] font-bold text-[#555555]">
                                {group.permissions.length} available permissions
                            </p>

                            <div className="mt-3 flex flex-wrap gap-1.5">
                                {group.permissions.map((permission) => (
                                    <span
                                        key={permission}
                                        className="rounded-md border border-[#EEEEEE] bg-[#FAFAFA] px-2 py-1.5 text-[10px] font-semibold text-[#353535]"
                                    >
                                        {permission}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* SECURITY NOTE */}

            <section className="flex items-start gap-3 rounded-2xl border border-[#F4D5CB] bg-[#FFF8F5] p-4">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#D9411F]">
                    <LockKeyhole size={18} />
                </span>

                <div>
                    <p className="text-[12px] font-extrabold text-[#252525]">
                        Permission changes require backend enforcement
                    </p>

                    <p className="mt-1 text-[11px] font-semibold leading-5 text-[#454545]">
                        This page demonstrates role management in frontend state.
                        Before production use, persist roles through your API and enforce
                        permissions on the server. Hiding a menu item alone does not
                        secure a route or operation.
                    </p>
                </div>
            </section>

            {/* ROLE MODAL */}

            <RoleModal
                open={modalOpen}
                onClose={closeModal}
                onSave={handleSaveRole}
                role={editingRole}
            />
        </div>
    );
}