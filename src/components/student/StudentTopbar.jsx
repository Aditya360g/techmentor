import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  Search,
  Bell,
  ChevronDown,
  ChevronRight,
  UserRound,
  Settings,
  LogOut,
  Menu,
  X,
  CheckCheck,
  CalendarDays,
  Users,
  GraduationCap,
  CreditCard,
  FileText,
  Building2,
  Command,
  ArrowUpRight,
  CircleHelp,
} from "lucide-react";

const collegePages = [
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
  { label: "Notifications", path: "/college/notifications", keywords: "alerts messages updates", icon: Bell },
  { label: "Settings", path: "/college/settings", keywords: "preferences account", icon: Settings },
];

const initialNotifications = [
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

const profileLinks = [
  {
    label: "Account Settings",
    description: "Manage your college account",
    path: "/college/settings",
    icon: UserRound,
  },
  {
    label: "Notifications",
    description: "Review important updates",
    path: "/college/notifications",
    icon: Bell,
  },
  {
    label: "Payments",
    description: "View payment activity",
    path: "/college/payments",
    icon: CreditCard,
  },
  {
    label: "Support & Settings",
    description: "Manage workspace preferences",
    path: "/college/settings",
    icon: Settings,
  },
];

function getInitials(name = "") {
  const words = String(name).trim().split(/\s+/).filter(Boolean);

  if (!words.length) return "CF";

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

function normalizeNotification(item, index) {
  return {
    ...item,
    id: item.id ?? `notification-${index}`,
    title: item.title ?? "Notification",
    message: item.message ?? "",
    time: item.time ?? "",
    unread: Boolean(item.unread),
    icon: typeof item.icon === "function" ? item.icon : Bell,
  };
}

function SearchResults({
  searchOpen,
  query,
  filteredPages,
  pathname,
  activeResult,
  setActiveResult,
  openPage,
}) {
  if (!searchOpen || !query) return null;

  return (
    <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] min-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.16)]">
      <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
          Search Results
        </p>
        <span className="text-[11px] font-semibold text-slate-500">
          {filteredPages.length} {filteredPages.length === 1 ? "result" : "results"}
        </span>
      </div>

      {filteredPages.length > 0 ? (
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filteredPages.map((page, index) => {
            const Icon = page.icon;
            const isCurrentPage = pathname === page.path;

            return (
              <button
                key={page.path}
                type="button"
                onMouseEnter={() => setActiveResult(index)}
                onClick={() => openPage(page.path)}
                className={[
                  "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left",
                  activeResult === index
                    ? "bg-sky-50 text-sky-800"
                    : "text-slate-700 hover:bg-slate-50",
                ].join(" ")}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-slate-100 bg-slate-50 text-sky-700">
                  <Icon size={17} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-slate-900">
                    {page.label}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-slate-400">
                    {page.path}
                  </span>
                </span>

                {isCurrentPage ? (
                  <span className="text-[10px] font-bold text-sky-700">
                    Current
                  </span>
                ) : (
                  <ChevronRight size={15} className="shrink-0 text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="px-5 py-8 text-center">
          <Search size={23} className="mx-auto text-slate-300" />
          <p className="mt-3 text-sm font-bold text-slate-800">
            No pages found
          </p>
          <p className="mt-1 text-xs text-slate-500">
            Try students, trainers, courses or payments.
          </p>
        </div>
      )}

      <div className="border-t border-slate-100 bg-slate-50 px-4 py-2">
        <p className="text-[10px] font-medium text-slate-500">
          Press Enter to open the selected result. Press Esc to close.
        </p>
      </div>
    </div>
  );
}

function SearchBox({
  mobile = false,
  containerRef,
  search,
  setSearch,
  searchOpen,
  setSearchOpen,
  handleSearchKeyDown,
  filteredPages,
  query,
  pathname,
  activeResult,
  setActiveResult,
  openPage,
}) {
  const clearSearch = () => {
    setSearch("");
    setSearchOpen(true);
    containerRef.current?.querySelector("input")?.focus();
  };

  return (
    <div
      ref={containerRef}
      className={
        mobile
          ? "relative w-full"
          : "relative hidden w-[220px] md:block lg:w-[270px] xl:w-[310px]"
      }
    >
      <div
        className={[
          "flex h-11 items-center gap-2.5 rounded-xl border px-3.5",
          searchOpen
            ? "border-sky-400 bg-white ring-2 ring-sky-100"
            : "border-slate-200 bg-slate-50 hover:border-slate-300",
        ].join(" ")}
      >
        <Search
          size={17}
          className={searchOpen ? "shrink-0 text-sky-700" : "shrink-0 text-slate-400"}
        />

        <input
          type="search"
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setActiveResult(0);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={handleSearchKeyDown}
          placeholder={mobile ? "Search college pages..." : "Search pages..."}
          aria-label="Search college pages"
          aria-expanded={searchOpen && query.length > 0}
          autoComplete="off"
          spellCheck={false}
          className="min-w-0 flex-1 border-0 bg-transparent text-[13px] font-semibold text-slate-900 outline-none placeholder:font-medium placeholder:text-slate-400"
        />

        {search.length > 0 ? (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearSearch}
            aria-label="Clear search"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
          >
            <X size={15} />
          </button>
        ) : (
          <kbd className="hidden shrink-0 items-center gap-1 rounded-md border border-slate-200 bg-white px-1.5 py-1 text-[10px] text-slate-400 lg:flex">
            <Command size={10} /> K
          </kbd>
        )}
      </div>

      <SearchResults
        searchOpen={searchOpen}
        query={query}
        filteredPages={filteredPages}
        pathname={pathname}
        activeResult={activeResult}
        setActiveResult={setActiveResult}
        openPage={openPage}
      />
    </div>
  );
}

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
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [readNotificationIds, setReadNotificationIds] = useState(() => new Set());
  const [logoutError, setLogoutError] = useState("");

  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const notificationRef = useRef(null);
  const profileRef = useRef(null);
  const searchInputRef = useRef(null);

  const displayName =
    user?.collegeName ||
    user?.name ||
    collegeName ||
    "College Admin";

  const displayEmail = user?.email || "College Administrator";
  const initials = getInitials(displayName);
  const query = search.trim().toLowerCase();

  const notifications = useMemo(() => {
    const source = Array.isArray(notificationItems)
      ? notificationItems
      : initialNotifications;

    return source.map(normalizeNotification);
  }, [notificationItems]);

  const unreadCount = notifications.filter(
    (item) => item.unread && !readNotificationIds.has(item.id)
  ).length;

  const filteredPages = useMemo(() => {
    if (!query) return [];

    return collegePages.filter((page) =>
      `${page.label} ${page.path} ${page.keywords}`
        .toLowerCase()
        .includes(query)
    );
  }, [query]);

  const currentPage = useMemo(() => {
    const pathname = location.pathname.replace(/\/+$/, "") || "/";

    return [...collegePages]
      .sort((a, b) => b.path.length - a.path.length)
      .find((page) => {
        if (page.path === "/college") return pathname === "/college";

        return (
          pathname === page.path ||
          pathname.startsWith(`${page.path}/`)
        );
      });
  }, [location.pathname]);

  const closeMenus = useCallback(() => {
    setSearchOpen(false);
    setProfileOpen(false);
    setNotificationsOpen(false);
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

  const handleSearchKeyDown = (event) => {
    if (event.key === "ArrowDown" && filteredPages.length > 0) {
      event.preventDefault();
      setActiveResult((current) =>
        current >= filteredPages.length - 1 ? 0 : current + 1
      );
    }

    if (event.key === "ArrowUp" && filteredPages.length > 0) {
      event.preventDefault();
      setActiveResult((current) =>
        current <= 0 ? filteredPages.length - 1 : current - 1
      );
    }

    if (event.key === "Enter" && filteredPages.length > 0) {
      event.preventDefault();
      const index = Math.min(activeResult, filteredPages.length - 1);
      openPage(filteredPages[index].path);
    }

    if (event.key === "Escape") {
      setSearchOpen(false);
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

    if (notification.path) {
      openPage(notification.path);
    } else {
      setNotificationsOpen(false);
    }
  };

  const handleLogout = async () => {
    setLogoutError("");
    closeMenus();

    try {
      if (onLogout) {
        await onLogout();
      } else {
        navigate("/login", { replace: true });
      }
    } catch (error) {
      console.error("College logout failed:", error);
      setLogoutError("Logout failed. Please try again.");
      setProfileOpen(true);
    }
  };

  useEffect(() => {
    closeMenus();
    setSearch("");
    setActiveResult(0);
    setLogoutError("");
  }, [location.pathname, closeMenus]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        !desktopSearchRef.current?.contains(event.target) &&
        !mobileSearchRef.current?.contains(event.target)
      ) {
        setSearchOpen(false);
      }

      if (!notificationRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
      }

      if (!profileRef.current?.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        closeMenus();
        return;
      }

      if (
        (event.ctrlKey || event.metaKey) &&
        event.key.toLowerCase() === "k"
      ) {
        event.preventDefault();
        setProfileOpen(false);
        setNotificationsOpen(false);
        setSearchOpen(true);

        requestAnimationFrame(() => {
          searchInputRef.current?.focus();
        });
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [closeMenus]);

  const searchProps = {
    search,
    setSearch,
    searchOpen,
    setSearchOpen,
    handleSearchKeyDown,
    filteredPages,
    query,
    pathname: location.pathname,
    activeResult,
    setActiveResult,
    openPage,
  };

  return (
    <>
      <header className="sticky top-0 z-40 flex h-[67px] w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 text-slate-900 shadow-sm sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label={mobileOpen ? "Close college navigation" : "Open college navigation"}
            aria-expanded={mobileOpen}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700 md:hidden"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <div className="hidden min-w-0 sm:block">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-sky-700">
              College Workspace
            </p>
            <h1 className="mt-1 max-w-[220px] truncate text-sm font-extrabold tracking-tight text-slate-950">
              {currentPage?.label || "College Portal"}
            </h1>
          </div>

          <div className="min-w-0 flex-1 md:hidden">
            <h1 className="truncate text-sm font-extrabold text-slate-950">
              {currentPage?.label || "College Portal"}
            </h1>
            <p className="mt-0.5 truncate text-[10px] font-medium text-slate-500">
              Manage your college workspace
            </p>
          </div>
        </div>

        <div className="flex min-w-0 flex-1 items-center justify-end gap-2 sm:flex-initial sm:gap-3">
          <SearchBox
            {...searchProps}
            containerRef={desktopSearchRef}
          />

          <button
            type="button"
            onClick={() => openPage("/college/settings")}
            aria-label="Help and settings"
            title="Help and settings"
            className="hidden h-10 w-10 shrink-0 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-sky-700 sm:flex"
          >
            <CircleHelp size={19} />
          </button>

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
              className={[
                "relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border",
                notificationsOpen
                  ? "border-sky-200 bg-sky-50 text-sky-700"
                  : "border-slate-200 bg-white text-slate-600 hover:border-sky-200 hover:bg-sky-50 hover:text-sky-700",
              ].join(" ")}
            >
              <Bell size={19} />

              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-sky-600 px-1 text-[9px] font-extrabold text-white">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <div className="absolute right-[-44px] top-[calc(100%+10px)] z-50 w-[min(360px,calc(100vw-16px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.16)] sm:right-0">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 px-4 py-4">
                  <div>
                    <h2 className="text-sm font-extrabold text-slate-900">
                      Notifications
                    </h2>
                    <p className="mt-1 text-[11px] text-slate-500">
                      {unreadCount} unread updates
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    disabled={unreadCount === 0}
                    className="flex shrink-0 items-center gap-1.5 rounded-lg px-2 py-1.5 text-[10px] font-bold text-sky-700 hover:bg-sky-50 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <CheckCheck size={14} />
                    Mark all read
                  </button>
                </div>

                <div className="max-h-[340px] overflow-y-auto p-2">
                  {notifications.length > 0 ? (
                    notifications.map((notification) => {
                      const Icon = notification.icon;
                      const isUnread =
                        notification.unread &&
                        !readNotificationIds.has(notification.id);

                      return (
                        <button
                          type="button"
                          key={notification.id}
                          onClick={() => handleNotificationClick(notification)}
                          className="flex w-full gap-3 rounded-xl p-3 text-left hover:bg-slate-50"
                        >
                          <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-100 bg-sky-50 text-sky-700">
                            <Icon size={18} />
                            {isUnread && (
                              <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-sky-600" />
                            )}
                          </span>

                          <span className="min-w-0 flex-1">
                            <span className="flex items-start justify-between gap-2">
                              <span className="text-[12px] font-bold text-slate-800">
                                {notification.title}
                              </span>
                              <span className="shrink-0 text-[9px] text-slate-400">
                                {notification.time}
                              </span>
                            </span>
                            <span className="mt-1 block text-[11px] leading-5 text-slate-500">
                              {notification.message}
                            </span>
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="py-10 text-center">
                      <Bell size={24} className="mx-auto mb-2 text-slate-300" />
                      <p className="text-sm font-semibold text-slate-600">
                        You’re all caught up
                      </p>
                    </div>
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => openPage("/college/notifications")}
                  className="flex w-full items-center justify-center gap-2 border-t border-slate-100 px-4 py-3 text-xs font-bold text-sky-700 hover:bg-sky-50"
                >
                  View all notifications
                  <ChevronRight size={14} />
                </button>
              </div>
            )}
          </div>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((open) => !open);
                setNotificationsOpen(false);
                setSearchOpen(false);
                setLogoutError("");
              }}
              aria-label="Open college profile menu"
              aria-expanded={profileOpen}
              className={[
                "flex h-10 items-center gap-2 rounded-xl border bg-white px-1.5 sm:gap-2.5 sm:px-2",
                profileOpen
                  ? "border-sky-200 bg-sky-50"
                  : "border-slate-200 hover:border-sky-200 hover:bg-sky-50/50",
              ].join(" ")}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#dbeafe] to-[#bae6fd] text-[11px] font-extrabold text-[#12345a] ring-1 ring-sky-200 sm:h-9 sm:w-9">
                {initials}
              </span>

              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-[125px] truncate text-xs font-extrabold text-slate-900">
                  {displayName}
                </span>
                <span className="mt-0.5 block text-[10px] font-medium text-slate-500">
                  College Admin
                </span>
              </span>

              <ChevronDown
                size={15}
                className="hidden text-slate-500 sm:block"
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[min(290px,calc(100vw-16px))] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.16)]">
                <Link
                  to="/college/settings"
                  onClick={() => closeMenus()}
                  className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-br from-sky-50 via-white to-blue-50 p-4 hover:from-sky-100"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#12345a] to-[#1976b9] text-sm font-extrabold text-white">
                    {initials}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold text-slate-950">
                      {displayName}
                    </span>
                    <span className="mt-1 block truncate text-[11px] text-slate-500">
                      {displayEmail}
                    </span>
                    <span className="mt-2 inline-flex rounded-full border border-sky-100 bg-sky-50 px-2 py-1 text-[10px] font-bold text-sky-800">
                      College Account
                    </span>
                  </span>
                  <ChevronRight size={16} className="text-slate-400" />
                </Link>

                <div className="p-2">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-400">
                    Quick Access
                  </p>

                  {profileLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.label}
                        to={item.path}
                        onClick={closeMenus}
                        className={[
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5",
                          isActive
                            ? "bg-sky-50 text-sky-800"
                            : "text-slate-700 hover:bg-slate-50 hover:text-sky-800",
                        ].join(" ")}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 group-hover:bg-sky-50 group-hover:text-sky-700">
                          <Icon size={17} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-[12px] font-bold">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[10px] text-slate-500">
                            {item.description}
                          </span>
                        </span>

                        <ChevronRight size={14} className="text-slate-300" />
                      </Link>
                    );
                  })}
                </div>

                {logoutError && (
                  <p role="alert" className="px-4 py-2 text-[11px] font-medium text-rose-600">
                    {logoutError}
                  </p>
                )}

                <div className="border-t border-slate-100 p-2">
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-rose-700 hover:bg-rose-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-rose-50 text-rose-600 group-hover:bg-white">
                      <LogOut size={17} />
                    </span>
                    <span className="flex-1">
                      <span className="block text-[12px] font-bold">
                        Logout
                      </span>
                      <span className="mt-0.5 block text-[10px] text-rose-500">
                        Sign out of your account
                      </span>
                    </span>
                    <ChevronRight size={14} className="text-rose-300" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="relative z-30 border-b border-slate-200 bg-white px-3 py-2.5 md:hidden">
        <SearchBox
          {...searchProps}
          mobile
          containerRef={mobileSearchRef}
        />
      </div>
    </>
  );
}
