
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
    Search,
    Bell,
    ChevronDown,
    ChevronRight,
    Users,
    GraduationCap,
    CreditCard,
    FileText,
    Building2,
    Command,
    Menu,
    X,
    CheckCheck,
    CalendarDays,
    Settings,
    LogOut,
    UserRound,
} from "lucide-react";

const COLLEGE_PAGES = [
    { label: "Dashboard", path: "/college", keywords: "home overview", icon: Building2 },
    { label: "Analytics", path: "/college/analytics", keywords: "statistics performance", icon: Search },
    { label: "Students", path: "/college/students", keywords: "learners student management", icon: Users },
    { label: "Trainers", path: "/college/trainers", keywords: "teachers faculty", icon: GraduationCap },
    { label: "Programs & Courses", path: "/college/programs", keywords: "subjects curriculum", icon: FileText },
    { label: "Assignments", path: "/college/assignments", keywords: "tasks submissions", icon: FileText },
    { label: "Class Schedule", path: "/college/schedule", keywords: "calendar timetable classes", icon: CalendarDays },
    { label: "Trainer Requests", path: "/college/requests", keywords: "faculty applications", icon: Users },
    { label: "Demo Sessions", path: "/college/demo-schedule", keywords: "trial class meeting", icon: CalendarDays },
    { label: "Placements", path: "/college/placements", keywords: "jobs careers hiring", icon: GraduationCap },
    { label: "Payments", path: "/college/payments", keywords: "fees billing transactions", icon: CreditCard },
    { label: "Reports", path: "/college/reports", keywords: "documents export", icon: FileText },
    { label: "Notifications", path: "/college/notifications", keywords: "alerts messages", icon: Bell },
    { label: "Settings", path: "/college/settings", keywords: "preferences account", icon: Settings },
];

const DEFAULT_NOTIFICATIONS = [
    {
        id: "trainer-request",
        title: "Trainer request received",
        message: "A new trainer request needs your attention.",
        time: "Recently",
        icon: GraduationCap,
        unread: true,
        path: "/college/requests",
    },
    {
        id: "student-activity",
        title: "Student activity",
        message: "Review your latest student updates.",
        time: "Today",
        icon: Users,
        unread: true,
        path: "/college/students",
    },
    {
        id: "payment-overview",
        title: "Payment overview",
        message: "Check the latest payment records.",
        time: "Today",
        icon: CreditCard,
        unread: false,
        path: "/college/payments",
    },
];

function getInitials(name = "") {
    const words = String(name).trim().split(/\s+/).filter(Boolean);
    if (!words.length) return "CF";
    return words.slice(0, 2).map((word) => word.charAt(0).toUpperCase()).join("");
}

function normalizeNotification(item, index) {
    return {
        ...item,
        id: item.id ?? `college - notification - ${index} `,
        title: item.title ?? "Notification",
        message: item.message ?? "",
        time: item.time ?? "",
        unread: Boolean(item.unread),
        icon: typeof item.icon === "function" ? item.icon : Bell,
    };
}

const iconButton =
    "relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-300 bg-white text-slate-700 transition-all duration-300 ease-out hover:-translate-y-0.5 hover:border-violet-400 hover:bg-violet-50 hover:text-violet-700 hover:shadow-[0_5px_18px_rgba(109,40,217,0.13)] active:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400";

const menuButton =
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-semibold text-slate-700 transition-all duration-200 hover:translate-x-0.5 hover:bg-violet-50 hover:text-violet-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-300";

export default function CollegeTopbar({
    onMenuClick,
    mobileOpen = false,
    onLogout,
    user,
    collegeName,
    notificationItems,
}) {
    const navigate = useNavigate();
    const location = useLocation();

    const [search, setSearch] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [activeResult, setActiveResult] = useState(0);
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [readNotificationIds, setReadNotificationIds] = useState(() => new Set());
    const [logoutError, setLogoutError] = useState("");

    const searchRef = useRef(null);
    const searchInputRef = useRef(null);
    const notificationRef = useRef(null);
    const profileRef = useRef(null);

    const displayName =
        user?.collegeName || user?.name || collegeName || "College Admin";
    const displayEmail = user?.email || "College Administrator";
    const initials = getInitials(displayName);

    const notifications = useMemo(() => {
        const source = Array.isArray(notificationItems)
            ? notificationItems
            : DEFAULT_NOTIFICATIONS;
        return source.map(normalizeNotification);
    }, [notificationItems]);

    const unreadCount = notifications.filter(
        (item) => item.unread && !readNotificationIds.has(item.id)
    ).length;

    const filteredPages = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return [];

        return COLLEGE_PAGES.filter((page) =>
            `${page.label} ${page.keywords} ${page.path} `.toLowerCase().includes(query)
        );
    }, [search]);

    const currentPage = useMemo(() => {
        const pathname = location.pathname.replace(/\/+$/, "") || "/";

        return [...COLLEGE_PAGES]
            .sort((a, b) => b.path.length - a.path.length)
            .find((page) => {
                if (page.path === "/college") return pathname === "/college";
                return pathname === page.path || pathname.startsWith(`${page.path}/`);
            });
    }, [location.pathname]);

    const closeMenus = useCallback(() => {
        setSearchOpen(false);
        setNotificationsOpen(false);
        setProfileOpen(false);
    }, []);

    const openPage = useCallback(
        (path) => {
            closeMenus();
            setSearch("");
            setActiveResult(0);
            setLogoutError("");
            navigate(path);
        },
        [closeMenus, navigate]
    );

    useEffect(() => {
        closeMenus();
        setSearch("");
        setActiveResult(0);
        setLogoutError("");
    }, [location.pathname, closeMenus]);

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!searchRef.current?.contains(event.target)) setSearchOpen(false);
            if (!notificationRef.current?.contains(event.target)) setNotificationsOpen(false);
            if (!profileRef.current?.contains(event.target)) setProfileOpen(false);
        };

        const handleKeyboard = (event) => {
            if (event.key === "Escape") {
                closeMenus();
                return;
            }

            if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
                event.preventDefault();
                setNotificationsOpen(false);
                setProfileOpen(false);
                setSearchOpen(true);
                searchInputRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleKeyboard);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleKeyboard);
        };
    }, [closeMenus]);

    const handleSearchKeyDown = (event) => {
        if (event.key === "ArrowDown" && filteredPages.length) {
            event.preventDefault();
            setActiveResult((current) =>
                current >= filteredPages.length - 1 ? 0 : current + 1
            );
        }

        if (event.key === "ArrowUp" && filteredPages.length) {
            event.preventDefault();
            setActiveResult((current) =>
                current <= 0 ? filteredPages.length - 1 : current - 1
            );
        }

        if (event.key === "Enter" && filteredPages.length) {
            event.preventDefault();
            openPage(filteredPages[Math.min(activeResult, filteredPages.length - 1)].path);
        }
    };

    const markAllNotificationsRead = () => {
        setReadNotificationIds((previous) => {
            const next = new Set(previous);
            notifications.forEach((item) => {
                if (item.unread) next.add(item.id);
            });
            return next;
        });
    };

    const handleNotificationClick = (notification) => {
        if (notification.unread) {
            setReadNotificationIds((previous) => {
                const next = new Set(previous);
                next.add(notification.id);
                return next;
            });
        }

        if (notification.path) openPage(notification.path);
        else setNotificationsOpen(false);
    };

    const handleLogout = async () => {
        setLogoutError("");
        closeMenus();

        try {
            if (onLogout) await onLogout();
            else navigate("/login", { replace: true });
        } catch (error) {
            console.error("College logout failed:", error);
            setLogoutError("Logout failed. Please try again.");
            setProfileOpen(true);
        }
    };

    return (
        <header className="college-topbar relative z-30 h-[68px] w-full shrink-0 border-b border-slate-300/80 bg-white text-slate-900 shadow-[0_3px_16px_rgba(15,23,42,0.035)]">
            <div className="flex h-[68px] w-full items-center gap-3 px-3 sm:px-5 lg:px-6">
                {/* Mobile navigation */}
                <button
                    type="button"
                    onClick={onMenuClick}
                    aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
                    aria-expanded={mobileOpen}
                    className={`${iconButton} md:hidden`}
                >
                    {mobileOpen ? <X size={19} /> : <Menu size={19} />}
                </button>

                {/* Desktop: only the current page title */}
                <div className="hidden min-w-0 flex-1 sm:block">
                    <h1 className="college-title truncate text-base font-extrabold tracking-tight text-slate-950 lg:text-lg">
                        {currentPage?.label || "Dashboard"}
                    </h1>
                    <span className="mt-1 block h-[3px] w-9 rounded-full bg-gradient-to-r from-violet-600 to-indigo-500" />
                </div>

                {/* Mobile page title */}
                <div className="min-w-0 flex-1 sm:hidden">
                    <h1 className="truncate text-sm font-extrabold text-slate-950">
                        {currentPage?.label || "Dashboard"}
                    </h1>
                </div>

                {/* Search */}
                <div
                    ref={searchRef}
                    className="relative ml-auto min-w-0 w-[145px] shrink sm:ml-0 sm:w-[220px] sm:shrink-0 lg:w-[280px]"
                >
                    <div
                        className={`college-search flex h-10 items-center gap-2 rounded-xl border px-3 transition-all duration-300 ${searchOpen
                            ? "border-violet-500 bg-violet-50/70 shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
                            : "border-slate-400 bg-slate-50 hover:border-violet-400 hover:bg-white hover:shadow-[0_4px_14px_rgba(15,23,42,0.07)]"
                            }`}
                    >
                        <Search
                            size={17}
                            className={`shrink-0 transition-colors ${searchOpen ? "text-violet-700" : "text-slate-800"
                                }`}
                        />

                        <input
                            ref={searchInputRef}
                            type="search"
                            value={search}
                            onChange={(event) => {
                                setSearch(event.target.value);
                                setActiveResult(0);
                                setSearchOpen(true);
                            }}
                            onFocus={() => setSearchOpen(true)}
                            onKeyDown={handleSearchKeyDown}
                            placeholder="Search pages..."
                            aria-label="Search College pages"
                            aria-autocomplete="list"
                            aria-expanded={searchOpen}
                            className="min-w-0 w-full bg-transparent text-[12px] font-bold text-black outline-none placeholder:font-semibold placeholder:text-slate-600"
                        />

                        <kbd className="hidden shrink-0 items-center rounded-md border border-slate-300 bg-white px-1.5 py-0.5 text-[10px] font-bold text-black xl:flex">
                            <Command size={10} className="mr-1" />
                            K
                        </kbd>
                    </div>

                    {searchOpen && search.trim() && (
                        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)] animate-in fade-in slide-in-from-top-2 duration-200">
                            <div className="flex items-center justify-between px-2 py-2">
                                <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500">
                                    Search results
                                </p>
                                <span className="text-[10px] font-bold text-slate-600">
                                    {filteredPages.length} found
                                </span>
                            </div>

                            {filteredPages.length > 0 ? (
                                <div className="max-h-[300px] overflow-y-auto">
                                    {filteredPages.map((page, index) => {
                                        const Icon = page.icon;

                                        return (
                                            <button
                                                type="button"
                                                key={page.path}
                                                onMouseEnter={() => setActiveResult(index)}
                                                onClick={() => openPage(page.path)}
                                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200 ${activeResult === index
                                                    ? "translate-x-0.5 bg-violet-50 text-violet-900 shadow-sm"
                                                    : "text-slate-800 hover:translate-x-0.5 hover:bg-slate-50"
                                                    }`}
                                            >
                                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-700 transition-transform duration-200 group-hover:scale-105">
                                                    <Icon size={16} />
                                                </span>
                                                <span className="min-w-0 flex-1">
                                                    <span className="block truncate text-[12px] font-bold">
                                                        {page.label}
                                                    </span>
                                                    <span className="mt-0.5 block truncate text-[10px] text-slate-500">
                                                        {page.path}
                                                    </span>
                                                </span>
                                                <ChevronRight size={14} className="text-slate-400" />
                                            </button>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="px-3 py-7 text-center">
                                    <Search size={21} className="mx-auto mb-2 text-slate-400" />
                                    <p className="text-sm font-bold text-slate-800">No pages found</p>
                                    <p className="mt-1 text-xs text-slate-500">
                                        Try students, trainers or payments.
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Right-side actions */}
                <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
                    {/* Notifications */}
                    <div ref={notificationRef} className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setNotificationsOpen((open) => !open);
                                setProfileOpen(false);
                                setSearchOpen(false);
                            }}
                            aria-label={`Notifications, ${unreadCount} unread`}
                            aria-expanded={notificationsOpen}
                            title="Notifications"
                            className={`${iconButton} ${notificationsOpen ? "border-violet-400 bg-violet-50 text-violet-800" : ""
                                }`}
                        >
                            <Bell size={17} />
                            {unreadCount > 0 && (
                                <span className="absolute right-[6px] top-[5px] h-2.5 w-2.5 animate-pulse rounded-full border-2 border-white bg-violet-600" />
                            )}
                        </button>

                        {notificationsOpen && (
                            <div className="absolute right-[-45px] top-[calc(100%+10px)] z-50 w-[min(350px,calc(100vw-16px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_18px_50px_rgba(15,23,42,0.16)] sm:right-0">
                                <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-3.5">
                                    <div>
                                        <h2 className="text-sm font-extrabold text-slate-950">Notifications</h2>
                                        <p className="mt-1 text-[11px] font-medium text-slate-600">
                                            {unreadCount} unread updates
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={markAllNotificationsRead}
                                        disabled={unreadCount === 0}
                                        className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-bold text-violet-800 transition-all hover:bg-violet-50 disabled:opacity-40"
                                    >
                                        <CheckCheck size={14} />
                                        Mark all read
                                    </button>
                                </div>

                                <div className="max-h-[320px] overflow-y-auto p-2">
                                    {notifications.length > 0 ? (
                                        notifications.map((notification) => {
                                            const Icon = notification.icon;
                                            const isUnread =
                                                notification.unread && !readNotificationIds.has(notification.id);

                                            return (
                                                <button
                                                    type="button"
                                                    key={notification.id}
                                                    onClick={() => handleNotificationClick(notification)}
                                                    className="flex w-full gap-3 rounded-xl p-3 text-left transition-all duration-200 hover:translate-x-0.5 hover:bg-violet-50/70"
                                                >
                                                    <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-100 bg-violet-50 text-violet-800">
                                                        <Icon size={17} />
                                                        {isUnread && (
                                                            <span className="absolute right-0 top-0 h-2.5 w-2.5 rounded-full border-2 border-white bg-violet-600" />
                                                        )}
                                                    </span>
                                                    <span className="min-w-0 flex-1">
                                                        <span className="flex items-start justify-between gap-2">
                                                            <span className="text-[12px] font-bold text-slate-900">
                                                                {notification.title}
                                                            </span>
                                                            <span className="shrink-0 text-[9px] font-medium text-slate-500">
                                                                {notification.time}
                                                            </span>
                                                        </span>
                                                        <span className="mt-1 block text-[11px] leading-5 text-slate-600">
                                                            {notification.message}
                                                        </span>
                                                    </span>
                                                </button>
                                            );
                                        })
                                    ) : (
                                        <div className="py-9 text-center">
                                            <Bell size={23} className="mx-auto mb-2 text-slate-400" />
                                            <p className="text-sm font-semibold text-slate-700">
                                                You’re all caught up
                                            </p>
                                        </div>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    onClick={() => openPage("/college/notifications")}
                                    className="flex w-full items-center justify-center gap-2 border-t border-slate-200 px-4 py-3 text-xs font-bold text-violet-800 transition-colors hover:bg-violet-50"
                                >
                                    View all notifications
                                    <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Profile */}
                    <div ref={profileRef} className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setProfileOpen((open) => !open);
                                setNotificationsOpen(false);
                                setSearchOpen(false);
                                setLogoutError("");
                            }}
                            aria-label="Open profile menu"
                            aria-expanded={profileOpen}
                            title={displayName}
                            className={`flex h-10 items-center gap-2 rounded-xl border px-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_5px_18px_rgba(109,40,217,0.13)] active:translate-y-0 sm:px-2 ${profileOpen
                                ? "border-violet-400 bg-violet-50"
                                : "border-slate-300 bg-white hover:border-violet-400 hover:bg-violet-50"
                                }`}
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-700 to-indigo-600 text-[10px] font-extrabold text-white shadow-sm">
                                {initials}
                            </span>
                            <span className="hidden min-w-0 text-left sm:block">
                                <span className="block max-w-[110px] truncate text-[11px] font-extrabold text-black">
                                    {displayName}
                                </span>
                                <span className="mt-0.5 block text-[9px] font-semibold text-slate-600">
                                    College Admin
                                </span>
                            </span>
                            <ChevronDown
                                size={13}
                                className={`hidden text-slate-600 transition-transform duration-200 sm:block ${profileOpen ? "rotate-180" : ""
                                    }`}
                            />
                        </button>

                        {profileOpen && (
                            <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(270px,calc(100vw-16px))] overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-[0_18px_50px_rgba(15,23,42,0.16)]">
                                <div className="border-b border-slate-100 px-3 py-3">
                                    <p className="truncate text-[13px] font-extrabold text-slate-950">
                                        {displayName}
                                    </p>
                                    <p className="mt-1 truncate text-[11px] font-medium text-slate-600">
                                        {displayEmail}
                                    </p>
                                    <span className="mt-2 inline-flex rounded-lg border border-violet-100 bg-violet-50 px-2 py-1 text-[9px] font-extrabold uppercase tracking-wider text-violet-800">
                                        College Account
                                    </span>
                                </div>

                                <div className="space-y-1 py-2">
                                    <button
                                        type="button"
                                        onClick={() => openPage("/college/settings")}
                                        className={menuButton}
                                    >
                                        <UserRound size={16} className="text-violet-700" />
                                        Account settings
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openPage("/college/notifications")}
                                        className={menuButton}
                                    >
                                        <Bell size={16} className="text-violet-700" />
                                        Notifications
                                        {unreadCount > 0 && (
                                            <span className="ml-auto rounded-md bg-violet-100 px-1.5 py-0.5 text-[10px] font-extrabold text-violet-800">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => openPage("/college/settings")}
                                        className={menuButton}
                                    >
                                        <Settings size={16} className="text-violet-700" />
                                        Preferences
                                    </button>
                                </div>

                                {logoutError && (
                                    <p role="alert" className="px-3 py-2 text-[11px] font-semibold text-rose-600">
                                        {logoutError}
                                    </p>
                                )}

                                <div className="border-t border-slate-100 pt-2">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[12px] font-bold text-rose-600 transition-all duration-200 hover:translate-x-0.5 hover:bg-rose-50"
                                    >
                                        <LogOut size={16} />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
        .college-topbar button {
          -webkit-tap-highlight-color: transparent;
        }

        .college-topbar button:focus-visible {
          outline: 2px solid rgba(124, 58, 237, 0.6);
          outline-offset: 2px;
        }

        .college-title {
          animation: collegeTitleIn 280ms ease-out both;
        }

        .college-search:focus-within {
          border-color: rgb(124 58 237);
          box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.12);
        }

        @keyframes collegeTitleIn {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .college-topbar *,
          .college-topbar *::before,
          .college-topbar *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
            scroll-behavior: auto !important;
          }
        }
      `}</style>
        </header>
    );
}
