import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  AlertCircle,
  Bell,
  BellOff,
  BookOpen,
  CalendarDays,
  Check,
  CheckCheck,
  CheckCircle2,
  Clock3,
  Inbox,
  Mail,
  Monitor,
  Search,
  Settings2,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

/* =========================================================
   CONFIG
========================================================= */

const STORAGE_KEY = "teachlive.trainerNotifications.v1";
const PREFERENCES_KEY = "teachlive.trainerNotificationPreferences.v1";

const CATEGORIES = [
  "All categories",
  "Schedule",
  "Students",
  "Assignments",
  "System",
];

const INITIAL_NOTIFICATIONS = [
  {
    id: "notification-1",
    category: "Schedule",
    title: "Your upcoming class is ready",
    message:
      "React Advanced Concepts is scheduled for today. Review your session details before students join.",
    time: "Today · 10:42 AM",
    unread: true,
    priority: "Important",
  },
  {
    id: "notification-2",
    category: "Students",
    title: "New student joined your batch",
    message:
      "A new student has joined your Frontend Development batch. Check your student list for their details.",
    time: "Today · 9:30 AM",
    unread: true,
    priority: "Normal",
  },
  {
    id: "notification-3",
    category: "Assignments",
    title: "Assignments are waiting for review",
    message:
      "Several student submissions are ready for evaluation. Review their work and provide feedback.",
    time: "Today · 8:15 AM",
    unread: true,
    priority: "Important",
  },
  {
    id: "notification-4",
    category: "Schedule",
    title: "Your weekly schedule is updated",
    message:
      "Your availability settings were updated. Check your working hours and session timings.",
    time: "Yesterday · 5:20 PM",
    unread: false,
    priority: "Normal",
  },
  {
    id: "notification-5",
    category: "Students",
    title: "Student progress needs attention",
    message:
      "Some learners may benefit from additional guidance. Review progress in your trainer dashboard.",
    time: "Yesterday · 1:45 PM",
    unread: false,
    priority: "Normal",
  },
  {
    id: "notification-6",
    category: "System",
    title: "Keep your profile up to date",
    message:
      "Make sure your professional details and teaching specializations are current.",
    time: "Oct 18 · 11:00 AM",
    unread: false,
    priority: "Normal",
  },
  {
    id: "notification-7",
    category: "Assignments",
    title: "New submissions received",
    message:
      "Your students have submitted new work. Visit the assignment evaluation page when ready.",
    time: "Oct 17 · 3:15 PM",
    unread: false,
    priority: "Normal",
  },
];

const DEFAULT_PREFERENCES = {
  email: false,
  browser: false,
};

const CATEGORY_META = {
  Schedule: {
    icon: CalendarDays,
    color: "bg-sky-50 text-sky-700 border-sky-100",
    dot: "bg-sky-500",
  },
  Students: {
    icon: Users,
    color: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
  },
  Assignments: {
    icon: BookOpen,
    color: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
  },
  System: {
    icon: Settings2,
    color: "bg-slate-100 text-slate-700 border-slate-200",
    dot: "bg-slate-500",
  },
};

/* =========================================================
   STORAGE HELPERS
========================================================= */

function readNotifications() {
  if (typeof window === "undefined") {
    return INITIAL_NOTIFICATIONS;
  }

  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved === null) {
      return INITIAL_NOTIFICATIONS;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      return INITIAL_NOTIFICATIONS;
    }

    return parsed.filter(
      (item) =>
        item &&
        typeof item.id === "string" &&
        typeof item.title === "string" &&
        typeof item.message === "string" &&
        ["Schedule", "Students", "Assignments", "System"].includes(
          item.category,
        ),
    );
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

function readPreferences() {
  if (typeof window === "undefined") {
    return DEFAULT_PREFERENCES;
  }

  try {
    const saved = window.localStorage.getItem(PREFERENCES_KEY);

    if (!saved) {
      return DEFAULT_PREFERENCES;
    }

    const parsed = JSON.parse(saved);

    return {
      email: parsed.email === true,
      browser: parsed.browser === true,
    };
  } catch {
    return DEFAULT_PREFERENCES;
  }
}

/* =========================================================
   REUSABLE UI
========================================================= */

function StatCard({
  icon: Icon,
  label,
  value,
  detail,
  tone = "green",
}) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    blue: "bg-sky-50 text-sky-700 ring-sky-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    slate: "bg-slate-100 text-slate-600 ring-slate-200",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
      className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500">{label}</p>

          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
            {value}
          </p>

          <p className="mt-1 text-xs text-slate-500">{detail}</p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ring-1 ${styles[tone]}`}
        >
          <Icon size={21} />
        </div>
      </div>
    </motion.article>
  );
}

function Toggle({
  checked,
  onChange,
  label,
  description,
  icon: Icon,
}) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-emerald-200">
      <div className="flex min-w-0 items-start gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
          <Icon size={18} />
        </div>

        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-800">{label}</p>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        </div>
      </div>

      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-emerald-100 ${checked ? "bg-emerald-600" : "bg-slate-300"
          }`}
      >
        <span
          className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-6" : "translate-x-1"
            }`}
        />
      </button>
    </div>
  );
}

function NotificationCard({
  notification,
  onToggleRead,
  onDelete,
  reduceMotion,
}) {
  const meta =
    CATEGORY_META[notification.category] || CATEGORY_META.System;

  const Icon = meta.icon;

  return (
    <motion.article
      layout={!reduceMotion}
      initial={reduceMotion ? false : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={
        reduceMotion
          ? undefined
          : { opacity: 0, x: 12, scale: 0.98 }
      }
      transition={{ duration: 0.18 }}
      className={`group relative overflow-hidden rounded-2xl border p-4 transition-all sm:p-5 ${notification.unread
        ? "border-emerald-200 bg-white shadow-sm"
        : "border-slate-200 bg-white hover:border-slate-300"
        }`}
    >
      {notification.unread && (
        <span className="absolute bottom-4 left-0 top-4 w-1 rounded-r-full bg-emerald-500" />
      )}

      <div className="flex min-w-0 items-start gap-3 pl-1">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border ${meta.color}`}
        >
          <Icon size={19} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`rounded-lg border px-2 py-1 text-[11px] font-semibold ${meta.color}`}
            >
              {notification.category}
            </span>

            {notification.priority === "Important" && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-amber-50 px-2 py-1 text-[11px] font-semibold text-amber-700">
                <AlertCircle size={12} />
                Important
              </span>
            )}

            {notification.unread && (
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                New
              </span>
            )}
          </div>

          <h3
            className={`mt-2 break-words text-sm sm:text-base ${notification.unread
              ? "font-bold text-slate-950"
              : "font-semibold text-slate-800"
              }`}
          >
            {notification.title}
          </h3>

          <p className="mt-1.5 break-words text-sm leading-6 text-slate-500">
            {notification.message}
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-3">
            <span className="inline-flex items-center gap-1.5 text-xs text-slate-400">
              <Clock3 size={13} />
              {notification.time}
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => onToggleRead(notification.id)}
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
              >
                {notification.unread ? (
                  <Check size={14} />
                ) : (
                  <Bell size={14} />
                )}

                {notification.unread ? "Mark as read" : "Mark unread"}
              </button>

              <button
                type="button"
                onClick={() => onDelete(notification.id)}
                aria-label={`Delete ${notification.title}`}
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition hover:bg-rose-50 hover:text-rose-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export default function TrainerNotificationsPage() {
  const reduceMotion = useReducedMotion();

  const [notifications, setNotifications] = useState(readNotifications);
  const [preferences, setPreferences] = useState(readPreferences);

  const [activeTab, setActiveTab] = useState("all");
  const [activeCategory, setActiveCategory] = useState("All categories");
  const [search, setSearch] = useState("");

  const [showSettings, setShowSettings] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);
  const [toast, setToast] = useState(null);

  /* Toast notification */

  const notify = useCallback((message, tone = "success") => {
    setToast({
      id: Date.now(),
      message,
      tone,
    });
  }, []);

  useEffect(() => {
    if (!toast) return undefined;

    const timer = window.setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => window.clearTimeout(timer);
  }, [toast]);

  /* Persist notifications */

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(notifications),
      );
    } catch {
      // Keep the page functional if browser storage is unavailable.
    }
  }, [notifications]);

  /* Persist preferences */

  useEffect(() => {
    try {
      window.localStorage.setItem(
        PREFERENCES_KEY,
        JSON.stringify(preferences),
      );
    } catch {
      // Preferences remain available in React state for this session.
    }
  }, [preferences]);

  /* Counts */

  const unreadCount = useMemo(
    () => notifications.filter((item) => item.unread).length,
    [notifications],
  );

  const readCount = notifications.length - unreadCount;

  /* Filtering and search */

  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((item) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "unread" && item.unread) ||
        (activeTab === "read" && !item.unread);

      const matchesCategory =
        activeCategory === "All categories" ||
        item.category === activeCategory;

      const matchesSearch =
        !query ||
        [item.title, item.message, item.category, item.time].some(
          (text) => text.toLowerCase().includes(query),
        );

      return matchesTab && matchesCategory && matchesSearch;
    });
  }, [notifications, activeTab, activeCategory, search]);

  /* Category counts */

  const categoryCounts = useMemo(() => {
    const counts = {
      "All categories": notifications.length,
    };

    notifications.forEach((item) => {
      counts[item.category] = (counts[item.category] || 0) + 1;
    });

    return counts;
  }, [notifications]);

  /* Toggle read state */

  const toggleRead = (id) => {
    const item = notifications.find(
      (notification) => notification.id === id,
    );

    setNotifications((current) =>
      current.map((notification) =>
        notification.id === id
          ? { ...notification, unread: !notification.unread }
          : notification,
      ),
    );

    notify(
      item?.unread
        ? "Notification marked as read."
        : "Notification marked unread.",
    );
  };

  /* Mark all read */

  const markAllRead = () => {
    if (!unreadCount) return;

    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        unread: false,
      })),
    );

    notify("All notifications marked as read.");
  };

  /* Delete notification */

  const deleteNotification = (id) => {
    setNotifications((current) =>
      current.filter((item) => item.id !== id),
    );

    notify("Notification deleted.");
  };

  /* Clear all notifications */

  const clearAll = () => {
    setNotifications([]);
    setConfirmClear(false);

    notify("All notifications cleared.");
  };

  /* Toggle preferences */

  const togglePreference = (key, value) => {
    setPreferences((current) => ({
      ...current,
      [key]: value,
    }));

    notify(
      `${key === "email" ? "Email" : "Browser"} notification preference updated.`,
    );
  };

  /* Reset search and filters */

  const resetFilters = () => {
    setActiveTab("all");
    setActiveCategory("All categories");
    setSearch("");
  };

  const tabs = [
    {
      key: "all",
      label: "All",
      count: notifications.length,
    },
    {
      key: "unread",
      label: "Unread",
      count: unreadCount,
    },
    {
      key: "read",
      label: "Read",
      count: readCount,
    },
  ];

  return (
    <div className="min-h-screen min-w-0 bg-[#f5faf8] text-slate-800">
      <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        {/* HEADER */}

        <motion.header
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-7 flex justify-end"
        >
          <div className="flex flex-wrap items-center gap-3">
            {unreadCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white">
                <Bell size={13} />
                {unreadCount} unread
              </span>
            )}

            <button
              type="button"
              onClick={() =>
                setShowSettings((current) => !current)
              }
              aria-expanded={showSettings}
              className={`inline-flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-semibold transition ${showSettings
                ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                : "border-slate-200 bg-white text-slate-700 shadow-sm hover:border-emerald-200 hover:bg-emerald-50"
                }`}
            >
              <Settings2 size={17} />
              Notification settings
            </button>
          </div>
        </motion.header>

        {/* STATS */}

        <section className="mb-7 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatCard
            icon={Bell}
            label="Total notifications"
            value={notifications.length}
            detail="All activity updates"
          />

          <StatCard
            icon={Bell}
            label="Unread notifications"
            value={unreadCount}
            detail="Waiting for your attention"
            tone="blue"
          />

          <StatCard
            icon={CheckCircle2}
            label="Read notifications"
            value={readCount}
            detail="Already reviewed"
            tone="slate"
          />
        </section>

        {/* PREFERENCES */}

        <AnimatePresence initial={false}>
          {showSettings && (
            <motion.section
              initial={
                reduceMotion
                  ? false
                  : { opacity: 0, height: 0 }
              }
              animate={{ opacity: 1, height: "auto" }}
              exit={
                reduceMotion
                  ? undefined
                  : { opacity: 0, height: 0 }
              }
              className="mb-7 overflow-hidden"
            >
              <div className="overflow-hidden rounded-2xl border border-emerald-100 bg-white shadow-sm">
                <div className="flex items-center gap-3 border-b border-slate-100 p-4 sm:p-5">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <h2 className="font-bold text-slate-900">
                      Notification preferences
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Choose your preferred notification settings.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
                  <Toggle
                    icon={Mail}
                    label="Email notifications"
                    description="Save your preference for email updates."
                    checked={preferences.email}
                    onChange={(value) =>
                      togglePreference("email", value)
                    }
                  />

                  <Toggle
                    icon={Monitor}
                    label="Browser notifications"
                    description="Save your preference for browser alerts."
                    checked={preferences.browser}
                    onChange={(value) =>
                      togglePreference("browser", value)
                    }
                  />
                </div>

                <div className="flex items-start gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3 sm:px-5">
                  <AlertCircle
                    size={15}
                    className="mt-0.5 shrink-0 text-slate-400"
                  />

                  <p className="text-xs leading-5 text-slate-500">
                    These preferences are stored in this browser. Actual
                    email delivery and native browser notifications require
                    service integration and browser permission.
                  </p>
                </div>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* NOTIFICATION INBOX */}

        <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm">
          {/* Inbox header */}

          <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                <Inbox size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-slate-950">
                  Your inbox
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  {filteredNotifications.length} notification
                  {filteredNotifications.length === 1 ? "" : "s"} shown
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={markAllRead}
                disabled={unreadCount === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <CheckCheck size={16} />
                Mark all read
              </button>

              <button
                type="button"
                onClick={() => setConfirmClear(true)}
                disabled={notifications.length === 0}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm font-semibold text-slate-600 transition hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Trash2 size={15} />
                Clear all
              </button>
            </div>
          </div>

          {/* SEARCH AND FILTERS */}

          <div className="border-b border-slate-100 p-4 sm:p-5">
            <div className="relative">
              <Search
                size={17}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />

              {/* FIX: type="text" avoids the browser's native search-clear X */}

              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search notifications..."
                aria-label="Search notifications"
                autoComplete="off"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-10 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-400 focus:bg-white focus:ring-4 focus:ring-emerald-100"
              />

              {/* Only one custom clear button */}

              {search.length > 0 && (
                <button
                  type="button"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                  title="Clear search"
                  className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-200 hover:text-slate-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                >
                  <X size={15} />
                </button>
              )}
            </div>

            {/* Read status tabs */}

            <div className="mt-4 flex flex-wrap gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  type="button"
                  onClick={() => setActiveTab(tab.key)}
                  aria-pressed={activeTab === tab.key}
                  className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-semibold transition ${activeTab === tab.key
                    ? "border-emerald-600 bg-emerald-600 text-white shadow-sm"
                    : "border-slate-200 bg-white text-slate-600 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800"
                    }`}
                >
                  {tab.label}

                  <span
                    className={`rounded-md px-1.5 py-0.5 text-[10px] font-bold ${activeTab === tab.key
                      ? "bg-white/20 text-white"
                      : "bg-slate-100 text-slate-500"
                      }`}
                  >
                    {tab.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Category filters */}

            <div className="mt-4">
              <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.13em] text-slate-400">
                Filter by category
              </p>

              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((category) => {
                  const active = activeCategory === category;
                  const count = categoryCounts[category] || 0;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => setActiveCategory(category)}
                      aria-pressed={active}
                      className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${active
                        ? "border-sky-600 bg-sky-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-800"
                        }`}
                    >
                      {category}

                      <span
                        className={`ml-1.5 ${active ? "text-sky-100" : "text-slate-400"
                          }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* NOTIFICATION LIST */}

          <div className="space-y-3 p-4 sm:p-5">
            <AnimatePresence mode="popLayout" initial={false}>
              {filteredNotifications.map((notification) => (
                <NotificationCard
                  key={notification.id}
                  notification={notification}
                  onToggleRead={toggleRead}
                  onDelete={deleteNotification}
                  reduceMotion={reduceMotion}
                />
              ))}
            </AnimatePresence>

            {/* Empty state */}

            {filteredNotifications.length === 0 && (
              <motion.div
                initial={
                  reduceMotion ? false : { opacity: 0, y: 6 }
                }
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/50 px-5 py-12 text-center"
              >
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
                  {notifications.length === 0 ? (
                    <BellOff size={25} />
                  ) : (
                    <Inbox size={25} />
                  )}
                </div>

                <h3 className="mt-4 text-base font-bold text-slate-900">
                  {notifications.length === 0
                    ? "Your inbox is clear"
                    : "No matching notifications"}
                </h3>

                <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
                  {notifications.length === 0
                    ? "You have cleared your notifications. New notifications from integrated services can appear here."
                    : "Try changing the category, read status or search term to find your notifications."}
                </p>

                {(search ||
                  activeTab !== "all" ||
                  activeCategory !== "All categories") && (
                    <button
                      type="button"
                      onClick={resetFilters}
                      className="mt-5 rounded-xl border border-emerald-200 bg-white px-4 py-2.5 text-sm font-semibold text-emerald-800 hover:bg-emerald-50"
                    >
                      Reset filters
                    </button>
                  )}
              </motion.div>
            )}
          </div>

          {/* Inbox footer */}

          <div className="flex flex-col justify-between gap-2 border-t border-slate-100 bg-slate-50/60 px-4 py-3.5 sm:flex-row sm:items-center sm:px-5">
            <span className="inline-flex items-center gap-2 text-xs font-medium text-slate-500">
              <ShieldCheck size={15} className="text-emerald-600" />
              Notification state is saved in this browser
            </span>

            <span className="text-xs text-slate-400">
              {notifications.length} total · {unreadCount} unread
            </span>
          </div>
        </section>

        {/* CLEAR CONFIRMATION MODAL */}

        <AnimatePresence>
          {confirmClear && (
            <motion.div
              className="fixed inset-0 z-[110] flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onMouseDown={(event) => {
                if (event.target === event.currentTarget) {
                  setConfirmClear(false);
                }
              }}
            >
              <motion.div
                initial={
                  reduceMotion
                    ? false
                    : { opacity: 0, y: 12, scale: 0.97 }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={
                  reduceMotion
                    ? undefined
                    : { opacity: 0, y: 8 }
                }
                role="alertdialog"
                aria-modal="true"
                aria-labelledby="clear-notifications-title"
                className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600">
                  <Trash2 size={22} />
                </div>

                <h3
                  id="clear-notifications-title"
                  className="mt-4 text-lg font-bold text-slate-900"
                >
                  Clear all notifications?
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  This will remove all {notifications.length} notifications
                  from this browser. This action cannot be undone.
                </p>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setConfirmClear(false)}
                    className="flex-1 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={clearAll}
                    className="flex-1 rounded-xl bg-rose-600 px-4 py-3 text-sm font-semibold text-white hover:bg-rose-700"
                  >
                    Clear all
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* TOAST MESSAGE */}

      <AnimatePresence>
        {toast && (
          <motion.div
            key={toast.id}
            role="status"
            initial={
              reduceMotion
                ? false
                : { opacity: 0, y: 12, scale: 0.97 }
            }
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
            }}
            exit={
              reduceMotion
                ? undefined
                : { opacity: 0, y: 8 }
            }
            className={`fixed bottom-4 left-4 right-4 z-[130] mx-auto flex max-w-md items-center gap-3 rounded-2xl border bg-white p-4 shadow-2xl sm:bottom-6 sm:left-auto sm:right-6 ${toast.tone === "error"
              ? "border-rose-200"
              : "border-emerald-200"
              }`}
          >
            <div
              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${toast.tone === "error"
                ? "bg-rose-50 text-rose-600"
                : "bg-emerald-50 text-emerald-600"
                }`}
            >
              {toast.tone === "error" ? (
                <AlertCircle size={18} />
              ) : (
                <CheckCircle2 size={18} />
              )}
            </div>

            <p className="min-w-0 flex-1 text-sm font-semibold text-slate-800">
              {toast.message}
            </p>

            <button
              type="button"
              onClick={() => setToast(null)}
              aria-label="Dismiss notification"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100"
            >
              <X size={16} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}