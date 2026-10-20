
import { useEffect, useRef, useState } from "react";
import {
    Bell,
    Menu,
    Search,
    X,
    UserRound,
    Settings,
    Video,
    Headphones,
    LogOut,
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    BookOpen,
    CalendarDays,
    ClipboardList,
    ChartNoAxesCombined,
    Wallet,
    CircleHelp,
    CheckCircle2,
    Clock,
} from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router";

const pages = [
    { title: "Trainer Dashboard", path: "/trainer", keywords: "home overview dashboard", icon: LayoutDashboard },
    { title: "My Profile", path: "/trainer/profile", keywords: "account personal details profile", icon: UserRound },
    { title: "My Courses", path: "/trainer/courses", keywords: "teaching courses curriculum", icon: BookOpen },
    { title: "Live Classes", path: "/trainer/live-classes", keywords: "online lecture video class session", icon: Video },
    { title: "Student Progress", path: "/trainer/student-progress", keywords: "students performance progress learning", icon: ChartNoAxesCombined },
    { title: "Assignments", path: "/trainer/assignments", keywords: "homework tasks submissions evaluation", icon: ClipboardList },
    { title: "My Schedule", path: "/trainer/schedule", keywords: "calendar timetable upcoming sessions", icon: CalendarDays },
    { title: "Availability", path: "/trainer/availability", keywords: "available hours timings slots", icon: Clock },
    { title: "Notifications", path: "/trainer/notifications", keywords: "alerts messages updates", icon: Bell },
    { title: "Payments", path: "/trainer/payments", keywords: "earnings salary transactions payment", icon: Wallet },
    { title: "Help & Support", path: "/trainer/help", keywords: "help contact assistance ticket support", icon: Headphones },
    { title: "Settings", path: "/trainer/settings", keywords: "preferences configuration account", icon: Settings },
];

const profileLinks = [
    {
        label: "My Profile",
        description: "Manage your trainer profile",
        path: "/trainer/profile",
        icon: UserRound,
    },
    {
        label: "My Courses",
        description: "Manage your courses",
        path: "/trainer/courses",
        icon: BookOpen,
    },
    {
        label: "Live Classes",
        description: "View your teaching sessions",
        path: "/trainer/live-classes",
        icon: Video,
    },
    {
        label: "Payments",
        description: "View your earnings",
        path: "/trainer/payments",
        icon: Wallet,
    },
    {
        label: "Settings",
        description: "Manage your preferences",
        path: "/trainer/settings",
        icon: Settings,
    },
];

function getPageTitle(pathname) {
    const exactPage = pages.find((page) => page.path === pathname);

    if (exactPage) return exactPage.title;
    if (pathname.startsWith("/trainer/courses/")) return "Course Details";
    if (pathname.startsWith("/trainer/assignments/")) return "Assignment Details";
    if (pathname.startsWith("/trainer/live-classes/")) return "Live Class Details";
    if (pathname.startsWith("/trainer/student-progress/")) return "Student Progress";

    return "Trainer Portal";
}

function SearchResults({
    query,
    filteredPages,
    pathname,
    openPage,
    searchOpen,
}) {
    if (!searchOpen || !query) return null;

    return (
        <div className="absolute left-0 right-0 top-[calc(100%+8px)] z-[100] min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:min-w-[320px]">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
                    Search Results
                </span>

                <span className="text-[11px] font-bold text-slate-500">
                    {filteredPages.length}{" "}
                    {filteredPages.length === 1 ? "result" : "results"}
                </span>
            </div>

            {filteredPages.length > 0 ? (
                <div className="max-h-[290px] overflow-y-auto p-2">
                    {filteredPages.map((page) => {
                        const Icon = page.icon;
                        const isCurrent = pathname === page.path;

                        return (
                            <button
                                key={page.path}
                                type="button"
                                onClick={() => openPage(page)}
                                className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors hover:bg-emerald-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
                            >
                                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                                    <Icon size={17} />
                                </span>

                                <span className="min-w-0 flex-1 truncate text-[13px] font-bold text-slate-900">
                                    {page.title}
                                </span>

                                {isCurrent ? (
                                    <span className="text-[10px] font-extrabold text-emerald-700">
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
                <div className="px-5 py-7 text-center">
                    <Search size={23} className="mx-auto text-slate-400" />
                    <p className="mt-3 text-sm font-bold text-slate-900">
                        No pages found
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                        Try courses, students, classes, payments or settings.
                    </p>
                </div>
            )}

            <div className="border-t border-slate-100 bg-slate-50 px-4 py-2">
                <p className="text-[10px] font-medium text-slate-500">
                    Enter to open the first result · Esc to close
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
    openPage,
}) {
    function clearSearch() {
        setSearch("");
        setSearchOpen(true);
        containerRef.current?.querySelector("input")?.focus();
    }

    return (
        <div
            ref={containerRef}
            className={`relative w-full ${mobile ? "" : "hidden md:block md:w-[220px] lg:w-[270px] xl:w-[310px]"
                }`}
        >
            <div
                className={`flex h-11 w-full items-center gap-2.5 rounded-xl border px-3.5 ${searchOpen
                    ? "border-emerald-500 ring-2 ring-emerald-500/10"
                    : "border-slate-200 hover:border-slate-300"
                    } bg-white`}
            >
                <Search size={18} className="shrink-0 text-slate-500" />

                <input
                    type="text"
                    name={mobile ? "trainer-mobile-search" : "trainer-desktop-search"}
                    value={search}
                    onChange={(event) => {
                        setSearch(event.target.value);
                        setSearchOpen(true);
                    }}
                    onFocus={() => setSearchOpen(true)}
                    onKeyDown={handleSearchKeyDown}
                    placeholder={mobile ? "Search trainer pages..." : "Search courses, pages..."}
                    aria-label="Search trainer pages"
                    aria-expanded={searchOpen && query.length > 0}
                    autoComplete="off"
                    spellCheck={false}
                    className="trainer-search-input block h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-[13px] font-medium outline-none"
                />

                {search.length > 0 && (
                    <button
                        type="button"
                        onMouseDown={(event) => event.preventDefault()}
                        onClick={clearSearch}
                        aria-label="Clear search"
                        title="Clear search"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                    >
                        <X size={15} />
                    </button>
                )}
            </div>

            <SearchResults
                searchOpen={searchOpen}
                query={query}
                filteredPages={filteredPages}
                pathname={pathname}
                openPage={openPage}
            />
        </div>
    );
}

function ProfileMenuItem({ item, active, onClick }) {
    const Icon = item.icon;

    return (
        <Link
            to={item.path}
            onClick={onClick}
            className={`group flex w-full items-center gap-3 rounded-xl px-2.5 py-2 transition-colors ${active
                ? "bg-emerald-50"
                : "hover:bg-slate-50"
                }`}
        >
            <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition-colors ${active
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-slate-100 text-slate-600 group-hover:bg-emerald-50 group-hover:text-emerald-700"
                    }`}
            >
                <Icon size={17} strokeWidth={1.9} />
            </span>

            <span className="min-w-0 flex-1">
                <span
                    className={`block text-[12px] font-bold leading-4 ${active ? "text-emerald-800" : "text-slate-800"
                        }`}
                >
                    {item.label}
                </span>

                <span className="mt-0.5 block truncate text-[10px] leading-4 text-slate-500">
                    {item.description}
                </span>
            </span>

            <ChevronRight
                size={15}
                className={`shrink-0 ${active
                    ? "text-emerald-600"
                    : "text-slate-300 group-hover:text-emerald-600"
                    }`}
            />
        </Link>
    );
}

export default function TrainerTopbar({ onMenuClick }) {
    const location = useLocation();
    const navigate = useNavigate();

    const [search, setSearch] = useState("");
    const [searchOpen, setSearchOpen] = useState(false);
    const [profileOpen, setProfileOpen] = useState(false);
    const [bellShake, setBellShake] = useState(false);

    const desktopSearchRef = useRef(null);
    const mobileSearchRef = useRef(null);
    const profileRef = useRef(null);
    const shakeTimeoutRef = useRef(null);

    const title = getPageTitle(location.pathname);
    const query = search.trim().toLowerCase();

    const filteredPages = query
        ? pages.filter((page) =>
            `${page.title} ${page.path} ${page.keywords}`
                .toLowerCase()
                .includes(query)
        )
        : [];

    function openPage(page) {
        navigate(page.path);
        setSearch("");
        setSearchOpen(false);
        setProfileOpen(false);
    }

    function handleSearchKeyDown(event) {
        if (event.key === "Enter" && filteredPages.length > 0) {
            event.preventDefault();
            openPage(filteredPages[0]);
        }

        if (event.key === "Escape") {
            setSearchOpen(false);
        }
    }

    useEffect(() => {
        const interval = window.setInterval(() => {
            setBellShake(true);
            window.clearTimeout(shakeTimeoutRef.current);

            shakeTimeoutRef.current = window.setTimeout(() => {
                setBellShake(false);
            }, 750);
        }, 10000);

        return () => {
            window.clearInterval(interval);
            window.clearTimeout(shakeTimeoutRef.current);
        };
    }, []);

    useEffect(() => {
        function handleOutsideClick(event) {
            const inDesktop = desktopSearchRef.current?.contains(event.target) ?? false;
            const inMobile = mobileSearchRef.current?.contains(event.target) ?? false;
            const inProfile = profileRef.current?.contains(event.target) ?? false;

            if (!inDesktop && !inMobile) setSearchOpen(false);
            if (!inProfile) setProfileOpen(false);
        }

        function handleEscape(event) {
            if (event.key === "Escape") {
                setSearchOpen(false);
                setProfileOpen(false);
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
            document.removeEventListener("keydown", handleEscape);
        };
    }, []);

    useEffect(() => {
        setSearchOpen(false);
        setProfileOpen(false);
    }, [location.pathname]);

    const searchProps = {
        search,
        setSearch,
        searchOpen,
        setSearchOpen,
        handleSearchKeyDown,
        filteredPages,
        query,
        pathname: location.pathname,
        openPage,
    };

    function handleLogout() {
        setProfileOpen(false);
        navigate("/login");
    }

    return (
        <>
            <header className="sticky top-0 z-40 flex min-h-[76px] w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 py-3 shadow-sm sm:px-5 lg:px-8">
                <div className="flex min-w-0 flex-1 items-center gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={onMenuClick}
                        aria-label="Open trainer navigation"
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:hidden"
                    >
                        <Menu size={20} />
                    </button>

                    <div className="min-w-0">
                        <div className="flex items-center gap-2">
                            <h1 className="truncate text-base font-extrabold tracking-tight text-slate-950 sm:text-xl">
                                {title}
                            </h1>

                            <span className="hidden items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800 md:inline-flex">
                                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                                Active
                            </span>
                        </div>

                        <p className="mt-1 hidden text-xs font-medium text-slate-500 sm:block sm:text-[13px]">
                            Manage your courses, classes, and students.
                        </p>
                    </div>

                    <div className="ml-auto">
                        <SearchBox {...searchProps} containerRef={desktopSearchRef} />
                    </div>
                </div>

                <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                    <Link
                        to="/trainer/notifications"
                        aria-label="Open notifications"
                        title="Notifications"
                        className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-700 sm:h-11 sm:w-11"
                    >
                        <Bell
                            size={19}
                            className={bellShake ? "trainer-topbar-bell-shake" : ""}
                        />
                        <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-emerald-600" />
                    </Link>

                    <div ref={profileRef} className="relative">
                        <button
                            type="button"
                            onClick={() => {
                                setProfileOpen((value) => !value);
                                setSearchOpen(false);
                            }}
                            aria-label="Open trainer profile menu"
                            aria-expanded={profileOpen}
                            className={`flex h-10 items-center gap-2 rounded-xl border bg-white px-1.5 transition-colors sm:h-11 sm:gap-2.5 sm:px-2 ${profileOpen
                                ? "border-emerald-300 ring-2 ring-emerald-500/10"
                                : "border-slate-200 hover:border-emerald-200"
                                }`}
                        >
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-xs font-extrabold text-emerald-800 ring-1 ring-emerald-200 sm:h-9 sm:w-9">
                                TR
                            </span>

                            <span className="hidden min-w-0 text-left sm:block">
                                <span className="block max-w-[125px] truncate text-xs font-bold text-slate-900">
                                    Trainer Account
                                </span>
                            </span>

                            <ChevronDown
                                size={15}
                                className={`hidden text-slate-500 transition-transform sm:block ${profileOpen ? "rotate-180 text-emerald-700" : ""
                                    }`}
                            />
                        </button>

                        {profileOpen && (
                            <div className="trainer-profile-dropdown absolute right-0 top-[calc(100%+10px)] z-[100] w-[min(290px,calc(100vw-24px))] overflow-hidden rounded-2xl border border-slate-200/90 bg-white shadow-[0_20px_60px_-18px_rgba(15,23,42,0.28)] ring-1 ring-black/[0.03]">
                                {/* Profile header */}
                                <Link
                                    to="/trainer/profile"
                                    onClick={() => setProfileOpen(false)}
                                    className="group flex items-center gap-3 border-b border-emerald-100/80 bg-gradient-to-br from-emerald-50 via-white to-green-50 px-4 py-4 transition-colors hover:from-emerald-100/80"
                                >
                                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-600 to-green-600 text-sm font-extrabold text-white shadow-md shadow-emerald-700/20 ring-1 ring-white">
                                        TR
                                    </span>

                                    <span className="min-w-0 flex-1">
                                        <span className="block truncate text-[14px] font-extrabold tracking-tight text-slate-950">
                                            Trainer Account
                                        </span>

                                        <span className="mt-1 block text-[11px] font-medium text-slate-600">
                                            Course Instructor
                                        </span>

                                        <span className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-white/90 px-2 py-1 text-[10px] font-bold text-emerald-800 shadow-sm">
                                            <CheckCircle2 size={11} strokeWidth={2.5} />
                                            Trainer Workspace
                                        </span>
                                    </span>

                                    <ChevronRight
                                        size={16}
                                        className="shrink-0 text-slate-400 transition-transform group-hover:translate-x-0.5 group-hover:text-emerald-700"
                                    />
                                </Link>

                                {/* Quick access */}
                                <div className="px-2.5 pb-2.5 pt-3">
                                    <div className="mb-2 flex items-center justify-between px-2">
                                        <p className="text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-500">
                                            Quick Access
                                        </p>
                                        <span className="h-px w-10 bg-slate-100" />
                                    </div>

                                    <div className="space-y-1">
                                        {profileLinks.map((item) => (
                                            <ProfileMenuItem
                                                key={item.path}
                                                item={item}
                                                active={location.pathname === item.path}
                                                onClick={() => setProfileOpen(false)}
                                            />
                                        ))}
                                    </div>

                                    <div className="my-2.5 border-t border-slate-100" />

                                    <ProfileMenuItem
                                        item={{
                                            label: "Help & Support",
                                            description: "Get help with your workspace",
                                            path: "/trainer/help",
                                            icon: CircleHelp,
                                        }}
                                        active={location.pathname === "/trainer/help"}
                                        onClick={() => setProfileOpen(false)}
                                    />
                                </div>

                                {/* Logout */}
                                <div className="border-t border-slate-100 bg-slate-50/70 p-2">
                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="group flex w-full items-center gap-3 rounded-xl px-2.5 py-2.5 text-left transition-colors hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300"
                                    >
                                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-red-50 text-red-600 transition-colors group-hover:bg-white">
                                            <LogOut size={17} strokeWidth={2} />
                                        </span>

                                        <span className="min-w-0 flex-1">
                                            <span className="block text-[12px] font-extrabold text-red-700">
                                                Logout
                                            </span>
                                            <span className="mt-0.5 block text-[10px] text-red-500">
                                                Sign out of your account
                                            </span>
                                        </span>

                                        <ChevronRight
                                            size={15}
                                            className="shrink-0 text-red-400 transition-transform group-hover:translate-x-0.5"
                                        />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Mobile Search */}
            <div className="relative z-30 border-b border-slate-200 bg-white px-3 py-3 md:hidden">
                <SearchBox
                    {...searchProps}
                    mobile
                    containerRef={mobileSearchRef}
                />
            </div>

            <style>{`
        .trainer-search-input,
        .trainer-search-input:focus,
        .trainer-search-input:active,
        .trainer-search-input:hover {
          color: #0f172a !important;
          -webkit-text-fill-color: #0f172a !important;
          opacity: 1 !important;
          outline: none !important;
          box-shadow: none !important;
          animation: none !important;
          caret-color: #059669 !important;
        }

        .trainer-search-input::placeholder {
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
          opacity: 1 !important;
          font-weight: 500;
        }

        .trainer-profile-dropdown {
          transform-origin: top right;
          animation: trainer-dropdown-enter 150ms ease-out;
        }

        @keyframes trainer-dropdown-enter {
          from {
            opacity: 0;
            transform: translateY(-5px) scale(0.985);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @keyframes trainer-topbar-bell-shake {
          0%, 100% { transform: rotate(0deg); }
          12% { transform: rotate(14deg); }
          24% { transform: rotate(-14deg); }
          36% { transform: rotate(11deg); }
          48% { transform: rotate(-11deg); }
          60% { transform: rotate(6deg); }
          72% { transform: rotate(-6deg); }
          84% { transform: rotate(2deg); }
        }

        .trainer-topbar-bell-shake {
          transform-origin: top center;
          animation: trainer-topbar-bell-shake 0.7s ease-in-out;
        }

        @media (prefers-reduced-motion: reduce) {
          .trainer-topbar-bell-shake,
          .trainer-profile-dropdown {
            animation: none !important;
          }
        }
      `}</style>
        </>
    );
}
