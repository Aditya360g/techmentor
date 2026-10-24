
import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Users,
  UserPlus,
  Search,
  Plus,
  Download,
  Mail,
  ShieldCheck,
  Building2,
  BriefcaseBusiness,
  CalendarDays,
  Clock3,
  CheckCircle2,
  BadgeCheck,
  Pencil,
  Trash2,
  X,
  Send,
  Copy,
  ChevronDown,
  ChevronRight,
  Crown,
  MoreHorizontal,
  Check,
  SearchCheck,
  UsersRound,
  LayoutGrid,
  Sparkles,
  Filter,
  RotateCcw,
  GraduationCap,
} from "lucide-react";

/* =========================================================
   THEME: NAVY + ICE BLUE
   ========================================================= */

const C = {
  page: "#0B1425",
  surface: "#111F34",
  surface2: "#152740",
  surface3: "#1A304D",
  border: "#293D58",
  borderLight: "#344C69",
  text: "#EAF3FF",
  muted: "#9FB2CA",
  accent: "#80BFFF",
  accentStrong: "#4B9AE8",
  accentBg: "#193858",
};

const STORAGE_KEY = "techmentor-college-team-v1";

const INITIAL_MEMBERS = [
  {
    id: "team-1",
    name: "Aditya Sharma",
    email: "aditya@college.edu",
    role: "Institution Admin",
    department: "Administration",
    status: "Active",
    joined: "2026-08-12",
    isOwner: true,
  },
  {
    id: "team-2",
    name: "Priya Verma",
    email: "priya@college.edu",
    role: "Academic Manager",
    department: "Academics",
    status: "Active",
    joined: "2026-08-18",
    isOwner: false,
  },
  {
    id: "team-3",
    name: "Rahul Mehta",
    email: "rahul@college.edu",
    role: "Trainer Coordinator",
    department: "Training",
    status: "Active",
    joined: "2026-09-02",
    isOwner: false,
  },
  {
    id: "team-4",
    name: "Sneha Patel",
    email: "sneha@college.edu",
    role: "Finance Manager",
    department: "Finance",
    status: "Active",
    joined: "2026-09-11",
    isOwner: false,
  },
  {
    id: "team-5",
    name: "Amit Singh",
    email: "amit@college.edu",
    role: "Support Staff",
    department: "Student Support",
    status: "Pending",
    joined: "2026-10-20",
    isOwner: false,
  },
];

const ROLE_OPTIONS = [
  "Institution Admin",
  "Academic Manager",
  "Trainer Coordinator",
  "Finance Manager",
  "Support Staff",
];

const STATUS_OPTIONS = ["Active", "Pending", "Inactive"];

const ROLE_DETAILS = {
  "Institution Admin": "Institution settings and team management",
  "Academic Manager": "Academic programs, batches and students",
  "Trainer Coordinator": "Trainer allocation and class management",
  "Finance Manager": "Payments and financial reports",
  "Support Staff": "Student support and communication",
};

const EMPTY_FORM = {
  name: "",
  email: "",
  role: "Trainer Coordinator",
  department: "",
  status: "Pending",
};

const FIELD_CLASS =
  "w-full rounded-xl border border-[#344A66] bg-[#101D30] px-4 py-3 text-sm text-[#EAF3FF] outline-none transition placeholder:text-[#7187A2] focus:border-[#80BFFF] focus:ring-4 focus:ring-[#4B9AE8]/15";

function loadMembers() {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);

    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) return parsed;
    }

    return INITIAL_MEMBERS;
  } catch {
    return INITIAL_MEMBERS;
  }
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0] || "")
    .join("")
    .toUpperCase();
}

function getAvatarStyle(name = "") {
  const styles = [
    "border-[#355D88] bg-[#1A3555] text-[#A9D5FF]",
    "border-[#305F75] bg-[#163747] text-[#A5E3F3]",
    "border-[#514A82] bg-[#2A264D] text-[#CEC7FF]",
    "border-[#376B58] bg-[#183C31] text-[#A7E6C6]",
    "border-[#755C39] bg-[#42311D] text-[#F4D19B]",
    "border-[#754660] bg-[#422337] text-[#F1B8D5]",
  ];

  const index = name
    .split("")
    .reduce((total, char) => total + char.charCodeAt(0), 0);

  return styles[index % styles.length];
}

function formatDate(date) {
  if (!date) return "—";

  const parsed = new Date(`${date}T00:00:00`);

  if (Number.isNaN(parsed.getTime())) return date;

  return parsed.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status) {
  const styles = {
    Active: {
      badge: "border-emerald-800 bg-emerald-950/60 text-emerald-300",
      dot: "bg-emerald-400",
    },
    Pending: {
      badge: "border-amber-800 bg-amber-950/50 text-amber-300",
      dot: "bg-amber-400",
    },
    Inactive: {
      badge: "border-slate-600 bg-slate-800 text-slate-300",
      dot: "bg-slate-400",
    },
  };

  return styles[status] || styles.Inactive;
}

function StatusBadge({ status }) {
  const style = getStatusStyle(status);

  return (
    <span
      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-full border px-3 py-1.5 text-xs font-semibold ${style.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`} />
      {status}
    </span>
  );
}

function IconButton({ children, onClick, label, className = "" }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border border-[#344A66] bg-[#14253C] text-[#A7BBD2] transition hover:border-[#628DBB] hover:bg-[#1A3555] hover:text-[#C8E5FF] ${className}`}
    >
      {children}
    </button>
  );
}

/* =========================================================
   CUSTOM PREMIUM DROPDOWN
   No native select popup.
   ========================================================= */

function PremiumSelect({
  value,
  options,
  onChange,
  icon: Icon,
  placeholder = "Select an option",
  className = "",
  menuAlign = "left",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const selectedOption = options.find((option) => option === value);

  useEffect(() => {
    function handlePointerDown(event) {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    }

    function handleEscape(event) {
      if (event.key === "Escape") setOpen(false);
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("touchstart", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("touchstart", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  return (
    <div ref={rootRef} className={`relative min-w-0 ${className}`}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((previous) => !previous)}
        className={`group flex min-h-[46px] w-full items-center gap-2.5 rounded-xl border px-3.5 py-2.5 text-left transition-all duration-200 ${open
          ? "border-[#80BFFF] bg-[#193858] ring-4 ring-[#4B9AE8]/10"
          : "border-[#344A66] bg-[#111F34] hover:border-[#52759A] hover:bg-[#162941]"
          }`}
      >
        {Icon && (
          <Icon
            size={17}
            className={`shrink-0 ${open
              ? "text-[#9BCFFF]"
              : "text-[#8FA6C1] group-hover:text-[#A9D5FF]"
              }`}
          />
        )}

        <span
          className={`min-w-0 flex-1 truncate text-sm font-medium ${selectedOption ? "text-[#EAF3FF]" : "text-[#8FA6C1]"
            }`}
        >
          {selectedOption || placeholder}
        </span>

        <ChevronDown
          size={16}
          className={`shrink-0 text-[#8FA6C1] transition-transform duration-200 ${open ? "rotate-180 text-[#A9D5FF]" : ""
            }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4, scale: 0.985 }}
            transition={{ duration: 0.15 }}
            className={`absolute top-[calc(100%+8px)] z-[110] w-full min-w-[210px] overflow-hidden rounded-2xl border border-[#3B5677] bg-[#111F34] p-1.5 shadow-[0_18px_55px_rgba(0,0,0,0.45)] ${menuAlign === "right" ? "right-0" : "left-0"
              }`}
          >
            <div
              role="listbox"
              aria-label="Options"
              className="max-h-64 overflow-y-auto overscroll-contain"
            >
              {options.map((option) => {
                const selected = option === value;

                return (
                  <button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(option);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors ${selected
                      ? "bg-[#1A3C60] text-[#C6E5FF]"
                      : "text-[#C1D0E2] hover:bg-[#1A304B] hover:text-white"
                      }`}
                  >
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${selected
                        ? "bg-[#28537F] text-[#D6ECFF]"
                        : "bg-[#1B2C42] text-[#7F99B7]"
                        }`}
                    >
                      {selected ? (
                        <Check size={15} strokeWidth={2.5} />
                      ) : (
                        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-60" />
                      )}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-semibold">
                        {option}
                      </span>

                      {ROLE_DETAILS[option] && (
                        <span className="mt-1 block text-[11px] leading-4 text-[#8299B5]">
                          {ROLE_DETAILS[option]}
                        </span>
                      )}
                    </span>
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

function MetricCard({ icon: Icon, label, value, note, iconStyle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="group min-w-0 rounded-2xl border border-[#263B56] bg-[#111F34] p-5 shadow-sm transition duration-300 hover:-translate-y-0.5 hover:border-[#42658B] hover:bg-[#14243A] hover:shadow-[0_14px_35px_rgba(0,0,0,0.18)]"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#9FB2CA]">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-[#F0F6FF]">
            {value}
          </p>
          <p className="mt-2 text-xs leading-5 text-[#8096B1]">{note}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${iconStyle}`}
        >
          <Icon size={21} strokeWidth={1.8} />
        </div>
      </div>
    </motion.div>
  );
}

/* =========================================================
   INVITE / EDIT MODAL
   ========================================================= */

function TeamMemberModal({
  open,
  onClose,
  onSubmit,
  editingMember,
  members,
}) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!open) return;

    if (editingMember) {
      setForm({
        name: editingMember.name || "",
        email: editingMember.email || "",
        role: editingMember.role || ROLE_OPTIONS[2],
        department: editingMember.department || "",
        status: editingMember.status || "Active",
      });
    } else {
      setForm(EMPTY_FORM);
    }

    setError("");
  }, [open, editingMember]);

  function updateField(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const name = form.name.trim();
    const email = form.email.trim().toLowerCase();
    const department = form.department.trim();

    if (!name || !email || !department) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    const duplicate = members.some(
      (member) =>
        member.email.toLowerCase() === email &&
        member.id !== editingMember?.id,
    );

    if (duplicate) {
      setError("This email address is already in the team.");
      return;
    }

    onSubmit({
      ...form,
      name,
      email,
      department,
      status: editingMember ? form.status : "Pending",
    });
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020916]/80 p-4 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.985 }}
            transition={{ duration: 0.2 }}
            className="my-auto w-full max-w-xl overflow-visible rounded-3xl border border-[#344A66] bg-[#111F34] shadow-[0_25px_90px_rgba(0,0,0,0.6)]"
          >
            <div className="relative overflow-hidden rounded-t-3xl border-b border-[#344A66] bg-gradient-to-r from-[#172B46] via-[#152740] to-[#1A3655] px-5 py-5 sm:px-7">
              <div className="pointer-events-none absolute -right-8 -top-16 h-40 w-40 rounded-full border border-[#7AB5EF]/15" />

              <div className="relative flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#52749B] bg-[#1B3A5B] text-[#A9D5FF]">
                    {editingMember ? (
                      <Pencil size={21} />
                    ) : (
                      <UserPlus size={21} />
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#EFF6FF]">
                      {editingMember
                        ? "Edit team member"
                        : "Invite team member"}
                    </h2>
                    <p className="mt-1 max-w-sm text-sm leading-5 text-[#97ADC7]">
                      {editingMember
                        ? "Update member details and assigned responsibilities."
                        : "Add a teammate to your institutional workspace."}
                    </p>
                  </div>
                </div>

                <IconButton label="Close dialog" onClick={onClose}>
                  <X size={18} />
                </IconButton>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-7">
              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Full name <span className="text-red-400">*</span>
                </label>
                <input
                  autoFocus
                  value={form.name}
                  onChange={(event) => updateField("name", event.target.value)}
                  placeholder="Enter full name"
                  maxLength={100}
                  required
                  className={FIELD_CLASS}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                  Work email <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Mail
                    size={17}
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
                  />
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => updateField("email", event.target.value)}
                    placeholder="name@college.edu"
                    maxLength={254}
                    required
                    className={`${FIELD_CLASS} pl-10`}
                  />
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Team role
                  </label>

                  <PremiumSelect
                    value={form.role}
                    options={ROLE_OPTIONS}
                    onChange={(value) => updateField("role", value)}
                    icon={ShieldCheck}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <input
                    value={form.department}
                    onChange={(event) =>
                      updateField("department", event.target.value)
                    }
                    placeholder="e.g. Academics"
                    maxLength={100}
                    required
                    className={FIELD_CLASS}
                  />
                </div>
              </div>

              {editingMember && !editingMember.isOwner && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-[#D4E2F2]">
                    Account status
                  </label>
                  <PremiumSelect
                    value={form.status}
                    options={STATUS_OPTIONS}
                    onChange={(value) => updateField("status", value)}
                    icon={CheckCircle2}
                  />
                </div>
              )}

              <div className="rounded-2xl border border-[#304D6D] bg-[#152A43] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#385979] bg-[#1D3957] text-[#A9D5FF]">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-[#DFEEFF]">
                      {form.role}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-[#91A8C2]">
                      {ROLE_DETAILS[form.role]}
                    </p>
                  </div>
                </div>
              </div>

              {error && (
                <div
                  role="alert"
                  className="rounded-xl border border-red-900 bg-red-950/60 px-4 py-3 text-sm text-red-300"
                >
                  {error}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[#2B405B] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-[#3A506C] bg-[#172840] px-5 py-3 text-sm font-semibold text-[#C1D0E2] transition hover:bg-[#203750]"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#80BFFF] px-5 py-3 text-sm font-bold text-[#10233D] shadow-lg shadow-black/10 transition hover:bg-[#A0D0FF] focus:outline-none focus:ring-4 focus:ring-[#80BFFF]/20"
                >
                  {editingMember ? (
                    <CheckCircle2 size={17} />
                  ) : (
                    <Send size={17} />
                  )}
                  {editingMember ? "Save changes" : "Create invitation"}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* =========================================================
   MAIN PAGE
   ========================================================= */

export default function CollegeTeamPage() {
  const [members, setMembers] = useState(loadMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All roles");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [toast, setToast] = useState("");
  const [menuId, setMenuId] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(members));
    } catch {
      setToast("Unable to save data in browser storage.");
    }
  }, [members]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 3200);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === "Escape") {
        setMenuId(null);
        setModalOpen(false);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const stats = useMemo(
    () => ({
      total: members.length,
      active: members.filter((member) => member.status === "Active").length,
      pending: members.filter((member) => member.status === "Pending").length,
      admins: members.filter(
        (member) => member.role === "Institution Admin",
      ).length,
    }),
    [members],
  );

  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const searchable = [
        member.name,
        member.email,
        member.role,
        member.department,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return (
        searchable.includes(query) &&
        (roleFilter === "All roles" || member.role === roleFilter) &&
        (statusFilter === "All statuses" || member.status === statusFilter)
      );
    });
  }, [members, search, roleFilter, statusFilter]);

  function openInvite() {
    setEditingMember(null);
    setModalOpen(true);
    setMenuId(null);
  }

  function openEdit(member) {
    setMenuId(null);

    if (member.isOwner) {
      setToast("The institution owner cannot be edited here.");
      return;
    }

    setEditingMember(member);
    setModalOpen(true);
  }

  function handleSave(formData) {
    if (editingMember) {
      setMembers((previous) =>
        previous.map((member) =>
          member.id === editingMember.id
            ? { ...member, ...formData }
            : member,
        ),
      );

      setToast("Team member updated successfully.");
    } else {
      const id =
        typeof crypto !== "undefined" && crypto.randomUUID
          ? crypto.randomUUID()
          : `team-${Date.now()}`;

      setMembers((previous) => [
        {
          id,
          ...formData,
          status: "Pending",
          joined: new Date().toISOString().slice(0, 10),
          isOwner: false,
        },
        ...previous,
      ]);

      setToast("Invitation record created. Status: Pending.");
    }

    setModalOpen(false);
    setEditingMember(null);
  }

  function handleDelete(member) {
    setMenuId(null);

    if (member.isOwner) {
      setToast("The institution owner cannot be removed.");
      return;
    }

    if (!window.confirm(`Remove ${member.name} from the team?`)) return;

    setMembers((previous) =>
      previous.filter((item) => item.id !== member.id),
    );

    setToast(`${member.name} was removed.`);
  }

  async function copyEmail(email) {
    setMenuId(null);

    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Clipboard unavailable");
      }

      await navigator.clipboard.writeText(email);
      setToast("Email address copied.");
    } catch {
      setToast(`Email address: ${email}`);
    }
  }

  function exportCSV() {
    if (!filteredMembers.length) {
      setToast("There are no team members to export.");
      return;
    }

    const headers = [
      "Name",
      "Email",
      "Role",
      "Department",
      "Status",
      "Joined",
    ];

    const rows = filteredMembers.map((member) => [
      member.name,
      member.email,
      member.role,
      member.department,
      member.status,
      member.joined,
    ]);

    const escapeCSV = (value) =>
      `"${String(value ?? "").replace(/"/g, '""')}"`;

    const csv = [headers, ...rows]
      .map((row) => row.map(escapeCSV).join(","))
      .join("\r\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "techmentor-college-team.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);

    setToast("Team directory exported.");
  }

  function resetFilters() {
    setSearch("");
    setRoleFilter("All roles");
    setStatusFilter("All statuses");
    setMenuId(null);
  }

  const hasActiveFilters =
    search.trim() !== "" ||
    roleFilter !== "All roles" ||
    statusFilter !== "All statuses";

  const metrics = [
    {
      icon: Users,
      label: "Total members",
      value: stats.total,
      note: "Across your team workspace",
      color: "border-[#3A5D83] bg-[#1A3452] text-[#A9D5FF]",
    },
    {
      icon: CheckCircle2,
      label: "Active members",
      value: stats.active,
      note: "Members marked as active",
      color: "border-[#28634F] bg-[#15382F] text-[#8CE0BA]",
    },
    {
      icon: Clock3,
      label: "Pending invitations",
      value: stats.pending,
      note: "Awaiting activation",
      color: "border-[#6C5632] bg-[#3A2F20] text-[#F2CD8B]",
    },
    {
      icon: ShieldCheck,
      label: "Institution admins",
      value: stats.admins,
      note: "Assigned admin roles",
      color: "border-[#51477E] bg-[#292442] text-[#CEC5FF]",
    },
  ];

  return (
    <div
      className="min-h-full w-full overflow-x-clip text-[#EAF3FF]"
      style={{ backgroundColor: C.page }}
    >
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center"
        >
          <div className="flex min-w-0 items-start gap-3.5">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#3B5C7F] bg-[#193858] text-[#B9DEFF] shadow-lg shadow-black/10">
              <UsersRound size={24} strokeWidth={1.8} />
            </div>

            <div className="min-w-0">
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-[#80BFFF]">
                  INSTITUTION
                </span>
                <ChevronRight size={13} className="text-[#607A98]" />
                <span className="text-xs font-medium text-[#94A9C2]">
                  Team management
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-[#F0F6FF] sm:text-[30px]">
                Team & Permissions
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#97ADC7]">
                Manage your team, organize responsibilities and oversee
                institutional access from one workspace.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={exportCSV}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#344A66] bg-[#14253C] px-4 py-3 text-sm font-semibold text-[#C0D2E7] transition hover:border-[#52759A] hover:bg-[#1A304A] hover:text-white"
            >
              <Download size={17} />
              Export CSV
            </button>

            <button
              type="button"
              onClick={openInvite}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#9BCFFF] bg-[#80BFFF] px-4 py-3 text-sm font-bold text-[#10233D] shadow-lg shadow-black/10 transition hover:-translate-y-0.5 hover:bg-[#A0D0FF] focus:outline-none focus:ring-4 focus:ring-[#80BFFF]/20"
            >
              <Plus size={18} />
              Invite member
            </button>
          </div>
        </motion.header>

        {/* Main navy banner */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="relative isolate overflow-hidden rounded-3xl border border-[#2D4868] bg-gradient-to-br from-[#142640] via-[#173251] to-[#1B3D60] p-5 shadow-[0_15px_40px_rgba(0,0,0,0.2)] sm:p-7 lg:p-8"
        >
          <div className="pointer-events-none absolute -right-10 -top-28 h-72 w-72 rounded-full border border-[#A7D3FF]/10" />
          <div className="pointer-events-none absolute -right-2 -top-20 h-60 w-60 rounded-full border border-[#A7D3FF]/10" />
          <div className="pointer-events-none absolute -bottom-24 right-[18%] h-44 w-44 rounded-full bg-[#66B2FF]/10 blur-3xl" />

          <div className="relative flex flex-col justify-between gap-6 md:flex-row md:items-center">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-[#6685A9]/50 bg-[#274768] text-[#C4E4FF]">
                <Building2 size={27} strokeWidth={1.7} />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#9DCDFF]">
                    INSTITUTION WORKSPACE
                  </span>
                  <span className="rounded-full border border-[#59718E] bg-[#203C59] px-2 py-0.5 text-[10px] font-semibold text-[#C5DFFF]">
                    Team overview
                  </span>
                </div>

                <h2 className="text-xl font-bold tracking-tight text-[#F1F7FF] sm:text-2xl">
                  Your College Team
                </h2>

                <p className="mt-1.5 max-w-xl text-sm leading-6 text-[#B0C4DB]">
                  Bring academics, coordination and operations together in
                  one collaborative workspace.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 self-start rounded-2xl border border-[#476482] bg-[#142B45]/80 px-4 py-3.5 md:self-auto">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#426688] bg-[#1E3B5A] text-[#A9D5FF]">
                <ShieldCheck size={22} />
              </div>

              <div>
                <p className="text-sm font-bold text-[#EFF6FF]">
                  Role-based team
                </p>
                <p className="mt-1 text-xs text-[#9EB6D1]">
                  {ROLE_OPTIONS.length} available roles
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Statistics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {metrics.map((metric) => (
            <MetricCard
              key={metric.label}
              icon={metric.icon}
              label={metric.label}
              value={metric.value}
              note={metric.note}
              iconStyle={metric.color}
            />
          ))}
        </section>

        {/* Directory */}
        <section className="overflow-visible rounded-3xl border border-[#293D58] bg-[#111F34] shadow-[0_8px_30px_rgba(0,0,0,0.12)]">
          <div className="flex flex-col justify-between gap-4 rounded-t-3xl border-b border-[#293D58] p-5 sm:p-6 lg:flex-row lg:items-center">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                  <LayoutGrid size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#EAF3FF]">
                  Team directory
                </h2>

                <span className="rounded-lg border border-[#395A7D] bg-[#1A3554] px-2 py-1 text-xs font-bold text-[#A9D5FF]">
                  {filteredMembers.length}
                </span>
              </div>

              <p className="mt-2 text-sm text-[#92A8C2]">
                Search, review and manage team members and their assigned roles.
              </p>
            </div>

            <button
              type="button"
              onClick={openInvite}
              className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#395B80] bg-[#193754] px-4 py-2.5 text-sm font-semibold text-[#B9DCFF] transition hover:bg-[#23476D] lg:self-auto"
            >
              <UserPlus size={17} />
              Add a teammate
            </button>
          </div>

          {/* Filters */}
          <div className="relative z-20 grid grid-cols-1 gap-3 border-b border-[#293D58] bg-[#0E1A2C] p-4 sm:p-5 md:grid-cols-2 xl:grid-cols-[minmax(240px,1fr)_230px_190px_auto]">
            <div className="relative min-w-0">
              <Search
                size={18}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8299B5]"
              />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, email, department..."
                className={`${FIELD_CLASS} min-h-[46px] pl-10`}
              />
            </div>

            <PremiumSelect
              value={roleFilter}
              options={["All roles", ...ROLE_OPTIONS]}
              onChange={setRoleFilter}
              icon={BriefcaseBusiness}
            />

            <PremiumSelect
              value={statusFilter}
              options={["All statuses", ...STATUS_OPTIONS]}
              onChange={setStatusFilter}
              icon={Filter}
            />

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[#344A66] bg-[#14253C] px-4 py-3 text-sm font-semibold text-[#AFC2D9] transition hover:border-[#52759A] hover:bg-[#1A304A] hover:text-[#D7EBFF]"
            >
              {hasActiveFilters ? (
                <RotateCcw size={16} />
              ) : (
                <X size={16} />
              )}
              Clear filters
            </button>
          </div>

          {/* Members table */}
          <div className="relative z-10 w-full overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left">
              <thead>
                <tr className="border-b border-[#293D58] bg-[#152740]">
                  {[
                    "Team member",
                    "Role & access",
                    "Department",
                    "Status",
                    "Joined",
                    "Actions",
                  ].map((heading) => (
                    <th
                      key={heading}
                      className={`px-5 py-4 text-[10px] font-bold uppercase tracking-[0.12em] text-[#849BB7] sm:px-6 ${heading === "Actions" ? "text-right" : ""
                        }`}
                    >
                      {heading}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-[#263952]">
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: Math.min(index * 0.025, 0.2) }}
                    className="group transition-colors hover:bg-[#172A42]"
                  >
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-sm font-bold ${getAvatarStyle(member.name)}`}
                        >
                          {getInitials(member.name)}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="max-w-[230px] truncate text-sm font-semibold text-[#EAF3FF]">
                              {member.name}
                            </p>

                            {member.isOwner && (
                              <span title="Institution owner">
                                <Crown
                                  size={14}
                                  className="shrink-0 text-[#E9BC69]"
                                />
                              </span>
                            )}
                          </div>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-[#91A7C0]">
                            <Mail size={12} className="shrink-0 text-[#7F96B1]" />
                            {member.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#334D6B] bg-[#192F49] px-2.5 py-1.5 text-xs font-semibold text-[#B9D8FA]">
                        <ShieldCheck size={14} className="text-[#80BFFF]" />
                        {member.role}
                      </span>

                      <p className="mt-1.5 max-w-[200px] text-xs leading-4 text-[#8298B2]">
                        {ROLE_DETAILS[member.role] || "Custom role"}
                      </p>
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 text-sm text-[#B1C2D7]">
                        <Building2
                          size={15}
                          className="shrink-0 text-[#7F96B1]"
                        />
                        {member.department || "—"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={member.status} />
                    </td>

                    <td className="px-5 py-4">
                      <span className="inline-flex items-center gap-2 whitespace-nowrap text-sm text-[#9FB1C8]">
                        <CalendarDays
                          size={15}
                          className="text-[#7F96B1]"
                        />
                        {formatDate(member.joined)}
                      </span>
                    </td>

                    <td className="px-5 py-4 text-right">
                      <div className="relative inline-flex justify-end">
                        <IconButton
                          label={`Actions for ${member.name}`}
                          onClick={() =>
                            setMenuId((current) =>
                              current === member.id ? null : member.id,
                            )
                          }
                          className={
                            menuId === member.id
                              ? "border-[#608AB5] bg-[#1D3B5C] text-[#C7E5FF]"
                              : ""
                          }
                        >
                          <MoreHorizontal size={20} />
                        </IconButton>

                        <AnimatePresence>
                          {menuId === member.id && (
                            <motion.div
                              initial={{ opacity: 0, y: -5, scale: 0.985 }}
                              animate={{ opacity: 1, y: 0, scale: 1 }}
                              exit={{ opacity: 0, y: -5, scale: 0.985 }}
                              className="absolute right-0 top-full z-[60] mt-2 w-48 rounded-2xl border border-[#3B5677] bg-[#111F34] p-1.5 text-left shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
                            >
                              <button
                                type="button"
                                onClick={() => openEdit(member)}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#C3D5E9] transition hover:bg-[#1C3552] hover:text-[#C5E5FF]"
                              >
                                <Pencil size={16} />
                                Edit member
                              </button>

                              <button
                                type="button"
                                onClick={() => copyEmail(member.email)}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-[#C3D5E9] transition hover:bg-[#1C3552] hover:text-[#C5E5FF]"
                              >
                                <Copy size={16} />
                                Copy email
                              </button>

                              <div className="my-1 border-t border-[#2B405A]" />

                              <button
                                type="button"
                                disabled={member.isOwner}
                                onClick={() => handleDelete(member)}
                                className="flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-950/40 disabled:cursor-not-allowed disabled:opacity-40"
                              >
                                <Trash2 size={16} />
                                Remove member
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>

            {filteredMembers.length === 0 && (
              <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#344E6C] bg-[#192F49] text-[#A9D5FF]">
                  <SearchCheck size={27} />
                </div>

                <h3 className="mt-4 text-base font-bold text-[#E2EEFC]">
                  No team members found
                </h3>

                <p className="mt-1 max-w-sm text-sm leading-6 text-[#91A7C0]">
                  Try another search or update your filters to find the members
                  you need.
                </p>

                <button
                  type="button"
                  onClick={resetFilters}
                  className="mt-4 rounded-xl border border-[#395879] bg-[#193451] px-4 py-2.5 text-sm font-semibold text-[#B7D9FF] transition hover:bg-[#23466A]"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2 rounded-b-3xl border-t border-[#293D58] bg-[#0E1A2C] px-5 py-4 text-xs text-[#90A6C0] sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p>
              Showing{" "}
              <span className="font-bold text-[#E0ECFA]">
                {filteredMembers.length}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#E0ECFA]">
                {members.length}
              </span>{" "}
              members
            </p>

            <p className="inline-flex items-center gap-1.5">
              <ShieldCheck size={14} className="text-[#80BFFF]" />
              Institution owner is protected from removal
            </p>
          </div>
        </section>

        {/* Role overview */}
        <section className="rounded-3xl border border-[#293D58] bg-[#111F34] p-5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] sm:p-6">
          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#344F70] bg-[#193553] text-[#A9D5FF]">
                  <ShieldCheck size={18} />
                </div>

                <h2 className="text-lg font-bold text-[#EAF3FF]">
                  Role overview
                </h2>
              </div>

              <p className="mt-2 text-sm text-[#91A7C0]">
                Review responsibilities and filter team members by role.
              </p>
            </div>

            <span className="inline-flex w-fit items-center gap-2 rounded-xl border border-[#344D6B] bg-[#172B44] px-3 py-2 text-xs font-semibold text-[#B3D6FA]">
              <Sparkles size={14} />
              Access overview
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {ROLE_OPTIONS.map((role, index) => {
              const roleIcons = [
                ShieldCheck,
                GraduationCap,
                UsersRound,
                BadgeCheck,
                Mail,
              ];

              const Icon = roleIcons[index];

              const count = members.filter(
                (member) => member.role === role,
              ).length;

              const selected = roleFilter === role;

              return (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    setRoleFilter(selected ? "All roles" : role);
                    setMenuId(null);

                    const searchElement = document.querySelector(
                      "input[type='search']",
                    );

                    if (searchElement) {
                      const top =
                        searchElement.getBoundingClientRect().top +
                        window.scrollY -
                        150;

                      window.scrollTo({
                        top: Math.max(0, top),
                        behavior: "smooth",
                      });
                    }
                  }}
                  className={`group flex min-w-0 items-start gap-3 rounded-2xl border p-4 text-left transition-all duration-200 ${selected
                    ? "border-[#648DB8] bg-[#1A3553] shadow-[0_0_0_1px_rgba(128,191,255,0.08)]"
                    : "border-[#2C405A] bg-[#14243A] hover:border-[#496A8D] hover:bg-[#182C44]"
                    }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition ${selected
                      ? "border-[#80BFFF] bg-[#80BFFF] text-[#10233D]"
                      : "border-[#365574] bg-[#1A3552] text-[#A9D5FF] group-hover:bg-[#214466]"
                      }`}
                  >
                    <Icon size={19} strokeWidth={1.8} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <p className="text-sm font-bold text-[#E0ECFA]">
                        {role}
                      </p>

                      <span
                        className={`rounded-lg border px-2 py-1 text-xs font-bold ${selected
                          ? "border-[#668CB6] bg-[#23466A] text-[#D5EAFF]"
                          : "border-[#34485F] bg-[#1A2B40] text-[#AFC2D8]"
                          }`}
                      >
                        {count}
                      </span>
                    </div>

                    <p className="mt-1.5 text-xs leading-5 text-[#91A7C0]">
                      {ROLE_DETAILS[role]}
                    </p>

                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold text-[#91C8FF]">
                      {selected ? "Filter applied" : "View members"}
                      <ChevronRight size={13} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <TeamMemberModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingMember(null);
        }}
        onSubmit={handleSave}
        editingMember={editingMember}
        members={members}
      />

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            role="status"
            className="fixed bottom-5 right-4 z-[150] flex max-w-[calc(100vw-2rem)] items-center gap-3 rounded-2xl border border-[#3A5472] bg-[#152840] px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.45)] sm:bottom-6 sm:right-6"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-emerald-800 bg-emerald-950/70 text-emerald-300">
              <CheckCircle2 size={20} />
            </div>

            <p className="text-sm font-medium leading-5 text-[#DAE8F7]">
              {toast}
            </p>

            <button
              type="button"
              onClick={() => setToast("")}
              aria-label="Dismiss notification"
              className="shrink-0 rounded-lg p-1 text-[#8EA5BF] transition hover:bg-[#263D58] hover:text-white"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
