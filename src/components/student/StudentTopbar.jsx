
import { useEffect, useRef, useState } from "react";

import {
  Bell,
  Menu,
  Search,
  X,
  UserRound,
  Settings,
  Trophy,
  Video,
  Headphones,
  LogOut,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  FileCheck2,
  ChartNoAxesCombined,
  Award,
  Library,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router";

const pages = [
  { title: "Student Dashboard", path: "/student", keywords: "home overview dashboard", icon: LayoutDashboard },
  { title: "My Profile", path: "/student/profile", keywords: "account personal details profile", icon: UserRound },
  { title: "My Courses", path: "/student/courses", keywords: "learning enrolled courses course", icon: BookOpen },
  { title: "Live Classes", path: "/student/live-classes", keywords: "online lecture video class", icon: Video },
  { title: "Schedule", path: "/student/schedule", keywords: "calendar timetable upcoming", icon: CalendarDays },
  { title: "Assignments", path: "/student/assignments", keywords: "homework tasks submissions", icon: ClipboardCheck },
  { title: "Coding Tests", path: "/student/tests", keywords: "exam quiz coding assessment test", icon: FileCheck2 },
  { title: "My Progress", path: "/student/progress", keywords: "performance learning progress", icon: ChartNoAxesCombined },
  { title: "Results", path: "/student/results", keywords: "marks grades scores test results", icon: Trophy },
  { title: "Certificates", path: "/student/certificates", keywords: "achievements completion certificate", icon: Award },
  { title: "Notifications", path: "/student/notifications", keywords: "alerts messages updates", icon: Bell },
  { title: "Resources", path: "/student/resources", keywords: "notes study material library", icon: Library },
  { title: "Support", path: "/student/support", keywords: "help contact assistance ticket", icon: Headphones },
  { title: "Settings", path: "/student/settings", keywords: "preferences configuration account", icon: Settings },
];

const profileLinks = [
  {
    label: "Settings",
    description: "Manage your preferences",
    path: "/student/settings",
    icon: Settings,
  },
  {
    label: "Results",
    description: "View your test scores",
    path: "/student/results",
    icon: Trophy,
  },
  {
    label: "Live Classes",
    description: "Join your learning sessions",
    path: "/student/live-classes",
    icon: Video,
  },
  {
    label: "Support",
    description: "Get help when you need it",
    path: "/student/support",
    icon: Headphones,
  },
];

const titles = Object.fromEntries(
  pages.map((page) => [page.path, page.title])
);

function getPageTitle(pathname) {
  if (titles[pathname]) return titles[pathname];
  if (pathname.startsWith("/student/courses/")) return "Course Details";
  if (pathname.startsWith("/student/assignments/")) return "Assignment Details";
  if (pathname.includes("/result")) return "Test Result";
  if (pathname.startsWith("/student/tests/")) return "Coding Test";
  return "Student Portal";
}

function SearchResults({
  searchOpen,
  query,
  filteredPages,
  pathname,
  openPage,
}) {
  if (!searchOpen || !query) return null;

  return (
    <div className="absolute right-0 top-[calc(100%+10px)] z-[100] w-full min-w-[280px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.18)] sm:w-[350px]">
      <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
        <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Search Results
        </p>

        <span className="text-[11px] font-bold text-slate-600">
          {filteredPages.length}{" "}
          {filteredPages.length === 1 ? "result" : "results"}
        </span>
      </div>

      {filteredPages.length > 0 ? (
        <div className="max-h-[320px] overflow-y-auto p-2">
          {filteredPages.map((page) => {
            const Icon = page.icon;
            const isCurrentPage = pathname === page.path;

            return (
              <button
                key={page.path}
                type="button"
                onClick={() => openPage(page)}
                className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-violet-50 focus-visible:bg-violet-50 focus-visible:outline-none"
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-violet-800">
                  <Icon size={18} />
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-slate-950">
                    {page.title}
                  </span>
                </span>

                {isCurrentPage ? (
                  <span className="text-[10px] font-extrabold text-violet-800">
                    Current
                  </span>
                ) : (
                  <ChevronRight
                    size={16}
                    className="shrink-0 text-slate-500"
                  />
                )}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="px-5 py-7 text-center">
          <Search size={24} className="mx-auto text-slate-500" />

          <p className="mt-3 text-sm font-bold text-slate-950">
            No pages found
          </p>

          <p className="mt-1 text-xs font-medium text-slate-600">
            Try courses, results, tests, schedule or settings.
          </p>
        </div>
      )}

      <div className="border-t border-slate-200 bg-slate-50 px-4 py-2">
        <p className="text-[10px] font-semibold text-slate-600">
          Press Enter to open the first result. Press Esc to close.
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
      className={
        mobile
          ? "relative w-full"
          : "relative hidden w-[220px] md:block lg:w-[270px] xl:w-[310px]"
      }
    >
      <div
        className={[
          "flex h-11 items-center gap-2.5 rounded-xl border px-3.5",
          "transition-colors duration-150",
          searchOpen
            ? "border-violet-500 bg-white shadow-[0_0_0_3px_rgba(139,92,246,0.12)]"
            : "border-slate-300 bg-white hover:border-slate-400",
        ].join(" ")}
      >
        <Search size={18} className="shrink-0 text-slate-700" />

        <input
          type="text"
          name={mobile ? "student-mobile-search" : "student-desktop-search"}
          value={search}
          onChange={(event) => {
            setSearch(event.target.value);
            setSearchOpen(true);
          }}
          onFocus={() => setSearchOpen(true)}
          onKeyDown={handleSearchKeyDown}
          placeholder={
            mobile ? "Search student pages..." : "Search courses, pages..."
          }
          aria-label="Search student pages"
          aria-expanded={searchOpen && query.length > 0}
          autoComplete="off"
          spellCheck={false}
          className="student-search-input min-w-0 flex-1 border-0 bg-transparent text-[13px] font-bold outline-none"
          style={{
            color: "#000",
            WebkitTextFillColor: "#000",
            caretColor: "#6d28d9",
            opacity: 1,
          }}
        />

        {search.length > 0 && (
          <button
            type="button"
            onMouseDown={(event) => event.preventDefault()}
            onClick={clearSearch}
            aria-label="Clear search"
            title="Clear search"
            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 hover:text-black"
          >
            <X size={16} strokeWidth={2.5} />
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

export default function StudentTopbar({ onMenuClick }) {
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
      `${page.title} ${page.path} ${page.keywords} `
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
      const insideDesktop =
        desktopSearchRef.current?.contains(event.target) ?? false;

      const insideMobile =
        mobileSearchRef.current?.contains(event.target) ?? false;

      const insideProfile =
        profileRef.current?.contains(event.target) ?? false;

      if (!insideDesktop && !insideMobile) {
        setSearchOpen(false);
      }

      if (!insideProfile) {
        setProfileOpen(false);
      }
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

  return (
    <>
      <header className="sticky top-0 z-40 flex h-[67px] w-full items-center justify-between gap-3 border-b border-slate-200 bg-white px-3 shadow-sm sm:px-5 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open student navigation"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100 lg:hidden"
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

            <p className="mt-1 hidden text-xs font-medium text-slate-600 sm:block sm:text-[13px]">
              Learn, grow, and track your progress.
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <SearchBox
            {...searchProps}
            containerRef={desktopSearchRef}
          />

          <Link
            to="/student/notifications"
            aria-label="Open notifications"
            title="Notifications"
            className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 transition-colors hover:border-violet-200 hover:bg-violet-50 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-100 sm:h-11 sm:w-11"
          >
            <Bell
              size={19}
              className={bellShake ? "topbar-bell-shake" : ""}
            />

            <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-violet-600" />
          </Link>

          <div ref={profileRef} className="relative">
            <button
              type="button"
              onClick={() => {
                setProfileOpen((open) => !open);
                setSearchOpen(false);
              }}
              aria-label="Open profile menu"
              aria-expanded={profileOpen}
              className={[
                "flex h-10 items-center gap-2 rounded-xl border bg-white px-1.5 transition-all sm:h-11 sm:gap-2.5 sm:px-2",
                profileOpen
                  ? "border-violet-300 shadow-[0_0_0_3px_rgba(139,92,246,0.08)]"
                  : "border-slate-200 hover:border-violet-200 hover:bg-violet-50/40",
              ].join(" ")}
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-violet-100 to-indigo-100 text-xs font-extrabold text-violet-800 ring-1 ring-violet-200 sm:h-9 sm:w-9">
                AS
              </span>

              <span className="hidden min-w-0 text-left sm:block">
                <span className="block max-w-[125px] truncate text-xs font-bold text-slate-900">
                  Aditya Sharma
                </span>


              </span>

              <ChevronDown
                size={15}
                className={[
                  "hidden text-slate-500 transition-transform duration-200 sm:block",
                  profileOpen ? "rotate-180 text-violet-700" : "",
                ].join(" ")}
              />
            </button>

            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] z-50 w-[270px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_16px_50px_rgba(15,23,42,0.15)] sm:w-[290px]">
                <Link
                  to="/student/profile"
                  onClick={() => setProfileOpen(false)}
                  className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-br from-violet-50 via-white to-indigo-50 p-4 hover:from-violet-100"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-extrabold text-white shadow-md">
                    AS
                  </span>

                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-extrabold text-slate-950">
                      Aditya Sharma
                    </span>



                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[10px] font-bold text-emerald-800">
                      <CheckCircle2 size={11} />
                      Learning actively
                    </span>
                  </span>

                  <ChevronRight size={16} className="text-slate-500" />
                </Link>

                <div className="p-2">
                  <p className="px-3 pb-2 pt-1 text-[10px] font-extrabold uppercase tracking-[0.15em] text-slate-500">
                    Quick Access
                  </p>

                  {profileLinks.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setProfileOpen(false)}
                        className={[
                          "group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-colors",
                          isActive
                            ? "bg-violet-50 text-violet-800"
                            : "text-slate-800 hover:bg-violet-50 hover:text-violet-800",
                        ].join(" ")}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-600 group-hover:bg-white group-hover:text-violet-700">
                          <Icon size={17} />
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="block text-[13px] font-bold">
                            {item.label}
                          </span>

                          <span className="mt-0.5 block text-[10px] font-medium text-slate-500">
                            {item.description}
                          </span>
                        </span>

                        <ChevronRight size={14} className="text-slate-400" />
                      </Link>
                    );
                  })}
                </div>

                <div className="border-t border-slate-100 p-2">
                  <Link
                    to="/login"
                    onClick={() => setProfileOpen(false)}
                    className="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-red-700 transition-colors hover:bg-red-50"
                  >
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-50 text-red-600 group-hover:bg-white">
                      <LogOut size={17} />
                    </span>

                    <span className="flex-1">
                      <span className="block text-[13px] font-bold">
                        Logout
                      </span>

                      <span className="mt-0.5 block text-[10px] font-medium text-red-500">
                        Sign out of your account
                      </span>
                    </span>

                    <ChevronRight size={14} className="text-red-400" />
                  </Link>
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

      <style>{`
  .student - search - input,
        .student - search - input: focus,
        .student - search - input:active {
  color: #000!important;
  -webkit - text - fill - color: #000!important;
  opacity: 1!important;
  outline: none!important;
  box - shadow: none!important;
}

        .student - search - input::placeholder {
  color: #64748b!important;
  -webkit - text - fill - color: #64748b!important;
  opacity: 1!important;
  font - weight: 500;
}

@keyframes topbar - bell - shake {
  0 %, 100 % { transform: rotate(0deg); }
  12 % { transform: rotate(14deg); }
  24 % { transform: rotate(-14deg); }
  36 % { transform: rotate(11deg); }
  48 % { transform: rotate(-11deg); }
  60 % { transform: rotate(6deg); }
  72 % { transform: rotate(-6deg); }
  84 % { transform: rotate(2deg); }
}

        .topbar - bell - shake {
  transform - origin: top center;
  animation: topbar - bell - shake 0.7s ease -in -out;
}

@media(prefers - reduced - motion: reduce) {
          .topbar - bell - shake {
    animation: none;
  }
}
`}</style>
    </>
  );
}
