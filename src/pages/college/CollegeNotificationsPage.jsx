

import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Bell,
  BellRing,
  BookOpen,
  Briefcase,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  GraduationCap,
  Inbox,
  Mail,
  MessageCircle,
  MessageSquare,
  Search,
  Settings,
  ShieldCheck,
  Trash2,
  Users,
  Wallet,
  X,
} from "lucide-react";

/* -------------------------------- HELPERS -------------------------------- */

const STORAGE_KEY = "techmentor_college_notifications_v1";

const cx = (...classes) => classes.filter(Boolean).join(" ");

const timeAgo = (hoursAgo) =>
  new Date(Date.now() - hoursAgo * 60 * 60 * 1000).toISOString();

const formatDate = (value) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Recently";

  return date.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
};

const relativeTime = (value) => {
  const difference = Math.max(0, Date.now() - new Date(value).getTime());
  const minutes = Math.floor(difference / 60000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes} min ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatDate(value);
};

const seedNotifications = [
  {
    id: "NTF-1001",
    title: "New placement opportunity",
    message:
      "TechNova Solutions has a new Software Development Engineer opportunity. Review eligibility details and the application deadline in the Placements section.",
    category: "Placements",
    date: timeAgo(0.3),
    read: false,
    priority: "High",
    icon: "placements",
  },
  {
    id: "NTF-1002",
    title: "Trainer assignment updated",
    message:
      "Rahul Mehta has been assigned to the upcoming Java & DSA program. Review the assignment and schedule from Academic Management.",
    category: "Trainers",
    date: timeAgo(2),
    read: false,
    priority: "Normal",
    icon: "trainers",
  },
  {
    id: "NTF-1003",
    title: "Upcoming demo session",
    message:
      "Your Python Fundamentals demo is scheduled for tomorrow at 11:00 AM. Please verify the trainer and session details before the session.",
    category: "Schedule",
    date: timeAgo(4),
    read: false,
    priority: "High",
    icon: "schedule",
  },
  {
    id: "NTF-1004",
    title: "Payment record updated",
    message:
      "A course fee payment record has been marked as completed. Open Payments & Billing to review the transaction details.",
    category: "Payments",
    date: timeAgo(8),
    read: true,
    priority: "Normal",
    icon: "payments",
  },
  {
    id: "NTF-1005",
    title: "New student feedback",
    message:
      "A student has submitted feedback about the Python course. Open Feedback & Reviews to read the message and respond.",
    category: "Feedback",
    date: timeAgo(22),
    read: true,
    priority: "Normal",
    icon: "feedback",
  },
  {
    id: "NTF-1006",
    title: "Assignment deadline approaching",
    message:
      "Several students have assignments due soon. Review assignment progress and follow up with the relevant trainers.",
    category: "Academic",
    date: timeAgo(28),
    read: true,
    priority: "Normal",
    icon: "academic",
  },
  {
    id: "NTF-1007",
    title: "Placement drive reminder",
    message:
      "An upcoming placement drive is approaching its application deadline. Check eligible departments and communicate the details to students.",
    category: "Placements",
    date: timeAgo(48),
    read: true,
    priority: "High",
    icon: "placements",
  },
  {
    id: "NTF-1008",
    title: "Portal settings reminder",
    message:
      "Review your college profile and coordinator contact details to keep portal information up to date.",
    category: "System",
    date: timeAgo(72),
    read: true,
    priority: "Low",
    icon: "system",
  },
];

const loadNotifications = () => {
  if (typeof window === "undefined") return seedNotifications;

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (error) {
    console.error("Unable to load notifications:", error);
  }

  return seedNotifications;
};

const CATEGORY_STYLES = {
  Placements: {
    icon: Briefcase,
    color: "text-cyan-200",
    bg: "bg-cyan-300/[0.08]",
    border: "border-cyan-300/15",
  },
  Trainers: {
    icon: GraduationCap,
    color: "text-indigo-200",
    bg: "bg-indigo-300/[0.08]",
    border: "border-indigo-300/15",
  },
  Schedule: {
    icon: CalendarDays,
    color: "text-sky-200",
    bg: "bg-sky-300/[0.08]",
    border: "border-sky-300/15",
  },
  Payments: {
    icon: Wallet,
    color: "text-emerald-200",
    bg: "bg-emerald-300/[0.08]",
    border: "border-emerald-300/15",
  },
  Feedback: {
    icon: MessageSquare,
    color: "text-violet-200",
    bg: "bg-violet-300/[0.08]",
    border: "border-violet-300/15",
  },
  Academic: {
    icon: BookOpen,
    color: "text-amber-200",
    bg: "bg-amber-300/[0.08]",
    border: "border-amber-300/15",
  },
  System: {
    icon: ShieldCheck,
    color: "text-slate-200",
    bg: "bg-slate-300/[0.07]",
    border: "border-slate-300/10",
  },
};

const PRIORITY_STYLES = {
  High: "border-rose-300/15 bg-rose-300/[0.06] text-rose-200",
  Normal: "border-white/[0.08] bg-white/[0.025] text-slate-400",
  Low: "border-slate-300/10 bg-slate-300/[0.04] text-slate-400",
};

/* ---------------------------- PREMIUM DROPDOWN --------------------------- */

function PremiumDropdown({ value, options, onChange, icon: Icon }) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return undefined;

    const handleOutside = (event) => {
      if (rootRef.current && !rootRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative w-full sm:w-44">
      <button
        type="button"
        onClick={() => setOpen((previous) => !previous)}
        aria-expanded={open}
        className={cx(
          "group flex w-full items-center gap-2.5 rounded-xl border px-3.5 py-3 text-left transition-all duration-200",
          open
            ? "border-cyan-300/40 bg-[#12263c] shadow-[0_0_0_3px_rgba(103,232,249,0.05)]"
            : "border-white/[0.09] bg-[#081525] hover:border-cyan-300/25 hover:bg-[#102036]"
        )}
      >
        <Icon
          size={15}
          className={cx(
            "shrink-0",
            open ? "text-cyan-200" : "text-slate-500 group-hover:text-cyan-200"
          )}
        />

        <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-200">
          {selected?.label || value}
        </span>

        <ChevronDown
          size={14}
          className={cx(
            "shrink-0 text-slate-500 transition-transform duration-200",
            open && "rotate-180 text-cyan-200"
          )}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.985 }}
            transition={{ duration: 0.14 }}
            className="absolute left-0 top-[calc(100%+8px)] z-[100] w-full min-w-[185px] overflow-hidden rounded-2xl border border-white/10 bg-[#0b1728] p-1.5 shadow-[0_20px_55px_rgba(0,0,0,0.5)]"
          >
            {options.map((option) => {
              const active = option.value === value;

              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cx(
                    "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-xs transition",
                    active
                      ? "bg-cyan-300/10 text-cyan-100"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  )}
                >
                  <span
                    className={cx(
                      "h-1.5 w-1.5 shrink-0 rounded-full",
                      active ? "bg-cyan-300" : "bg-slate-600"
                    )}
                  />

                  <span className="min-w-0 flex-1">{option.label}</span>

                  {active && <Check size={14} className="text-cyan-200" />}
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------------------------------- PAGE ------------------------------------ */

export default function CollegeNotificationsPage() {
  const [notifications, setNotifications] = useState(loadNotifications);
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState("All");
  const [category, setCategory] = useState("all");
  const [selectedId, setSelectedId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications)
      );
    } catch (error) {
      console.error("Unable to save notifications:", error);
    }
  }, [notifications]);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => setToast(""), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const notify = (message) => setToast(message);

  const unreadCount = notifications.filter((item) => !item.read).length;

  const readCount = notifications.filter((item) => item.read).length;

  const selectedNotification =
    notifications.find((item) => item.id === selectedId) || null;

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications
      .filter((item) => {
        if (tab === "Unread" && item.read) return false;
        if (tab === "Read" && !item.read) return false;

        if (category !== "all" && item.category !== category) return false;

        if (query) {
          const searchable = [
            item.id,
            item.title,
            item.message,
            item.category,
          ]
            .join(" ")
            .toLowerCase();

          if (!searchable.includes(query)) return false;
        }

        return true;
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [notifications, search, tab, category]);

  const markAsRead = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: true } : item
      )
    );
  };

  const markAsUnread = (id) => {
    setNotifications((previous) =>
      previous.map((item) =>
        item.id === id ? { ...item, read: false } : item
      )
    );
  };

  const markAllAsRead = () => {
    if (unreadCount === 0) {
      notify("There are no unread notifications.");
      return;
    }

    setNotifications((previous) =>
      previous.map((item) => ({ ...item, read: true }))
    );

    notify("All notifications marked as read.");
  };

  const deleteNotification = (id) => {
    setNotifications((previous) =>
      previous.filter((item) => item.id !== id)
    );

    if (selectedId === id) setSelectedId(null);

    notify("Notification deleted.");
  };

  const clearReadNotifications = () => {
    if (readCount === 0) {
      notify("There are no read notifications to clear.");
      return;
    }

    const confirmed = window.confirm(
      `Delete all ${readCount} read notifications?`
    );

    if (!confirmed) return;

    setNotifications((previous) => previous.filter((item) => !item.read));
    notify("Read notifications cleared.");
  };

  const openNotification = (item) => {
    setSelectedId(item.id);

    if (!item.read) {
      markAsRead(item.id);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setTab("All");
    setCategory("all");
  };

  const hasFilters = Boolean(search.trim()) || tab !== "All" || category !== "all";

  return (
    <div className="min-h-full min-w-0 space-y-6 bg-[#071323] p-4 text-slate-100 sm:p-6 xl:p-7">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end"
      >
        <div className="min-w-0">
          <div className="mb-3 flex items-center gap-2 text-[11px] font-medium text-slate-500">
            <span>College Portal</span>
            <ChevronRight size={12} />
            <span className="text-cyan-300">Notifications</span>
          </div>

          <div className="flex items-start gap-3">
            <div className="hidden h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-cyan-300/15 to-sky-400/[0.04] sm:flex">
              <BellRing size={22} className="text-cyan-200" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-[30px]">
                  Notifications
                </h1>

                {unreadCount > 0 && (
                  <span className="rounded-full border border-cyan-300/15 bg-cyan-300/[0.08] px-2.5 py-1 text-[10px] font-semibold text-cyan-200">
                    {unreadCount} unread
                  </span>
                )}
              </div>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Stay updated on placements, trainers, schedules, payments and
                student feedback.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={clearReadNotifications}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.09] bg-[#0c192b] px-3.5 py-3 text-xs font-semibold text-slate-300 transition hover:border-rose-300/20 hover:bg-rose-300/[0.05] hover:text-rose-200"
          >
            <Trash2 size={14} />
            Clear read
          </button>

          <button
            type="button"
            onClick={markAllAsRead}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-[#071323] transition hover:bg-cyan-200"
          >
            <CheckCheck size={15} />
            Mark all read
          </button>
        </div>
      </motion.header>

      {/* Summary */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/[0.08] bg-[#0c192b] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">Total notifications</p>
              <p className="mt-3 text-2xl font-semibold text-white">
                {notifications.length}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.07]">
              <Inbox size={18} className="text-cyan-200" />
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            All portal updates in one place
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c192b] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">Unread</p>
              <p className="mt-3 text-2xl font-semibold text-cyan-200">
                {unreadCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/10 bg-cyan-300/[0.07]">
              <Bell size={18} className="text-cyan-200" />
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Notifications waiting for your attention
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-[#0c192b] p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs text-slate-400">Read</p>
              <p className="mt-3 text-2xl font-semibold text-emerald-200">
                {readCount}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-300/10 bg-emerald-300/[0.07]">
              <CheckCircle2 size={18} className="text-emerald-200" />
            </div>
          </div>

          <p className="mt-2 text-[11px] text-slate-500">
            Notifications already reviewed
          </p>
        </div>
      </section>

      {/* Small highlight */}
      <section className="relative overflow-hidden rounded-2xl border border-cyan-300/[0.13] bg-gradient-to-r from-[#103047] via-[#10253b] to-[#0b192a] p-4 sm:p-5">
        <div className="pointer-events-none absolute -right-12 -top-20 h-48 w-48 rounded-full bg-cyan-300/[0.07] blur-3xl" />

        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-200/15 bg-cyan-200/[0.08]">
              <Settings size={17} className="text-cyan-200" />
            </div>

            <div>
              <h2 className="text-sm font-semibold text-white">
                Keep your college workspace organised
              </h2>

              <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-300/75">
                Review important updates and clear notifications once they have
                been handled.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setTab("Unread");
              setCategory("all");
              setSearch("");
            }}
            className="inline-flex shrink-0 items-center justify-center gap-2 self-start rounded-xl border border-cyan-200/15 bg-[#061525]/40 px-3.5 py-2.5 text-xs font-semibold text-cyan-100 transition hover:bg-cyan-300/[0.08] sm:self-center"
          >
            View unread
            <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Notification list */}
      <section className="overflow-visible rounded-2xl border border-white/[0.08] bg-[#0c192b]">
        {/* Toolbar */}
        <div className="border-b border-white/[0.07] p-3 sm:p-4">
          <div className="mb-4 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-sm font-semibold text-white">
                Your activity
              </h2>
              <p className="mt-1 text-[11px] text-slate-500">
                {filteredNotifications.length} notifications found
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-1 rounded-xl border border-white/[0.07] bg-[#071323] p-1">
              {["All", "Unread", "Read"].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setTab(item)}
                  className={cx(
                    "rounded-lg px-3.5 py-2 text-[11px] font-semibold transition",
                    tab === item
                      ? "bg-cyan-300/10 text-cyan-200"
                      : "text-slate-500 hover:text-slate-200"
                  )}
                >
                  {item}
                  {item === "Unread" && unreadCount > 0 && (
                    <span className="ml-1.5 text-[10px] text-cyan-300">
                      {unreadCount}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:flex-row">
            <div className="relative min-w-0 flex-1">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications..."
                className="w-full rounded-xl border border-white/[0.09] bg-[#071323] py-3 pl-10 pr-10 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-300/[0.05]"
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            <PremiumDropdown
              value={category}
              onChange={setCategory}
              icon={MessageSquare}
              options={[
                { label: "All categories", value: "all" },
                ...Object.keys(CATEGORY_STYLES).map((item) => ({
                  label: item,
                  value: item,
                })),
              ]}
            />
          </div>

          {hasFilters && (
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <span className="text-[10px] text-slate-500">
                Active filters:
              </span>

              {search && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
                >
                  Search: {search}
                  <X size={11} />
                </button>
              )}

              {tab !== "All" && (
                <button
                  type="button"
                  onClick={() => setTab("All")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
                >
                  {tab}
                  <X size={11} />
                </button>
              )}

              {category !== "all" && (
                <button
                  type="button"
                  onClick={() => setCategory("all")}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-slate-300"
                >
                  {category}
                  <X size={11} />
                </button>
              )}

              <button
                type="button"
                onClick={clearFilters}
                className="ml-auto text-[10px] font-semibold text-cyan-300 transition hover:text-cyan-200"
              >
                Clear all
              </button>
            </div>
          )}
        </div>

        {/* Items */}
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center px-5 py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/15 bg-cyan-400/[0.07]">
              <Inbox size={27} className="text-cyan-300" />
            </div>

            <h3 className="mt-5 text-base font-semibold text-white">
              No notifications found
            </h3>

            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
              Try changing the search or filters to see other notifications.
            </p>

            {hasFilters && (
              <button
                type="button"
                onClick={clearFilters}
                className="mt-5 rounded-xl border border-white/10 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.05]"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.055]">
            {filteredNotifications.map((item, index) => {
              const style =
                CATEGORY_STYLES[item.category] || CATEGORY_STYLES.System;
              const Icon = style.icon;

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: Math.min(index * 0.025, 0.15) }}
                  className={cx(
                    "group flex min-w-0 gap-3.5 px-4 py-4 transition sm:gap-4 sm:px-5",
                    !item.read
                      ? "bg-cyan-300/[0.025] hover:bg-cyan-300/[0.045]"
                      : "hover:bg-white/[0.02]"
                  )}
                >
                  <div
                    className={cx(
                      "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                      style.bg,
                      style.border
                    )}
                  >
                    <Icon size={18} className={style.color} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {!item.read && (
                        <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(103,232,249,0.35)]" />
                      )}

                      <button
                        type="button"
                        onClick={() => openNotification(item)}
                        className={cx(
                          "min-w-0 text-left text-sm transition hover:text-cyan-200",
                          item.read
                            ? "font-medium text-slate-300"
                            : "font-semibold text-white"
                        )}
                      >
                        {item.title}
                      </button>

                      {item.priority === "High" && (
                        <span
                          className={cx(
                            "rounded-full border px-2 py-0.5 text-[9px] font-semibold",
                            PRIORITY_STYLES.High
                          )}
                        >
                          Important
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => openNotification(item)}
                      className="mt-1.5 block w-full text-left"
                    >
                      <p className="line-clamp-2 text-xs leading-5 text-slate-400 transition group-hover:text-slate-300">
                        {item.message}
                      </p>
                    </button>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span
                        className={cx(
                          "rounded-full border px-2.5 py-1 text-[10px] font-medium",
                          style.bg,
                          style.border,
                          style.color
                        )}
                      >
                        {item.category}
                      </span>

                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-500">
                        <Clock3 size={11} />
                        {relativeTime(item.date)}
                      </span>

                      <span className="hidden text-[10px] text-slate-600 sm:inline">
                        {item.id}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-col items-end justify-between gap-3">
                    <button
                      type="button"
                      aria-label={item.read ? "Mark as unread" : "Mark as read"}
                      title={item.read ? "Mark as unread" : "Mark as read"}
                      onClick={() => {
                        if (item.read) {
                          markAsUnread(item.id);
                          notify("Notification marked as unread.");
                        } else {
                          markAsRead(item.id);
                          notify("Notification marked as read.");
                        }
                      }}
                      className={cx(
                        "flex h-8 w-8 items-center justify-center rounded-lg border transition",
                        item.read
                          ? "border-white/[0.06] text-slate-500 hover:border-cyan-300/20 hover:text-cyan-200"
                          : "border-cyan-300/15 bg-cyan-300/[0.06] text-cyan-200 hover:bg-cyan-300/10"
                      )}
                    >
                      {item.read ? <Mail size={14} /> : <Check size={14} />}
                    </button>

                    <button
                      type="button"
                      aria-label="Delete notification"
                      title="Delete notification"
                      onClick={() => deleteNotification(item.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg border border-transparent text-slate-600 transition hover:border-rose-300/15 hover:bg-rose-300/[0.05] hover:text-rose-200"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}

        <div className="flex flex-col gap-2 border-t border-white/[0.06] px-4 py-3.5 text-[10px] text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-5">
          <span>
            Showing{" "}
            <strong className="font-semibold text-slate-300">
              {filteredNotifications.length}
            </strong>{" "}
            notifications
          </span>

          <span className="inline-flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
            Changes save in this browser
          </span>
        </div>
      </section>

      {/* Notification details modal */}
      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            key="notification-details"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) setSelectedId(null);
            }}
            className="fixed inset-0 z-[200] flex items-center justify-center overflow-y-auto bg-[#020813]/80 p-3 backdrop-blur-sm sm:p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.985 }}
              className="my-auto w-full max-w-xl overflow-hidden rounded-3xl border border-white/10 bg-[#0b1728] shadow-[0_30px_100px_rgba(0,0,0,0.5)]"
            >
              <div className="flex items-start justify-between gap-4 border-b border-white/[0.07] px-5 py-5 sm:px-6">
                <div className="flex min-w-0 items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/[0.08]">
                    <Bell size={19} className="text-cyan-200" />
                  </div>

                  <div className="min-w-0">
                    <h2 className="text-base font-semibold text-white">
                      Notification details
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedNotification.id}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedId(null)}
                  aria-label="Close details"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] text-slate-400 transition hover:bg-white/[0.05] hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="space-y-5 p-5 sm:p-6">
                {(() => {
                  const style =
                    CATEGORY_STYLES[selectedNotification.category] ||
                    CATEGORY_STYLES.System;
                  const Icon = style.icon;

                  return (
                    <div className="flex items-start gap-3">
                      <div
                        className={cx(
                          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border",
                          style.bg,
                          style.border
                        )}
                      >
                        <Icon size={19} className={style.color} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <h3 className="text-base font-semibold text-white">
                          {selectedNotification.title}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span
                            className={cx(
                              "rounded-full border px-2.5 py-1 text-[10px] font-medium",
                              style.bg,
                              style.border,
                              style.color
                            )}
                          >
                            {selectedNotification.category}
                          </span>

                          <span
                            className={cx(
                              "rounded-full border px-2.5 py-1 text-[10px] font-medium",
                              selectedNotification.read
                                ? "border-white/10 bg-white/[0.03] text-slate-400"
                                : "border-cyan-300/15 bg-cyan-300/[0.07] text-cyan-200"
                            )}
                          >
                            {selectedNotification.read ? "Read" : "Unread"}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                <div className="rounded-2xl border border-white/[0.07] bg-[#081323] p-4">
                  <p className="whitespace-pre-wrap text-sm leading-7 text-slate-300">
                    {selectedNotification.message}
                  </p>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-white/[0.07] p-3.5">
                    <p className="text-[10px] text-slate-500">Received</p>
                    <p className="mt-1.5 text-xs font-medium text-slate-200">
                      {formatDate(selectedNotification.date)}
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/[0.07] p-3.5">
                    <p className="text-[10px] text-slate-500">Priority</p>
                    <p
                      className={cx(
                        "mt-1.5 w-fit rounded-full border px-2.5 py-1 text-[10px] font-semibold",
                        PRIORITY_STYLES[selectedNotification.priority] ||
                        PRIORITY_STYLES.Normal
                      )}
                    >
                      {selectedNotification.priority}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap justify-between gap-2 border-t border-white/[0.07] pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      deleteNotification(selectedNotification.id);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border border-rose-300/15 px-3.5 py-2.5 text-xs font-semibold text-rose-200 transition hover:bg-rose-300/[0.06]"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (selectedNotification.read) {
                        markAsUnread(selectedNotification.id);
                        notify("Notification marked as unread.");
                      } else {
                        markAsRead(selectedNotification.id);
                        notify("Notification marked as read.");
                      }

                      setSelectedId(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-[#071323] transition hover:bg-cyan-200"
                  >
                    <Check size={14} />
                    Mark as {selectedNotification.read ? "unread" : "read"}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="fixed bottom-5 right-5 z-[300] flex max-w-[calc(100vw-40px)] items-center gap-3 rounded-2xl border border-cyan-300/20 bg-[#0b1c2c] px-4 py-3.5 text-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.4)]"
          >
            <CheckCircle2 size={17} className="shrink-0 text-cyan-300" />
            <span className="text-xs font-medium">{toast}</span>

            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => setToast("")}
              className="ml-2 text-slate-500 transition hover:text-white"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}