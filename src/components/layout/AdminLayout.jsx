import { useEffect, useState } from "react";
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router";

import { AnimatePresence, motion } from "motion/react";

import {
  Activity,
  ArrowRight,
  Bell,
  LogOut,
  Search,
  ShieldCheck,
} from "lucide-react";

import AdminSidebar from "../admin/layout/AdminSidebar";

/* =====================================================
   ADMIN THEME
===================================================== */

const THEME = {
  accent: "#F4512B",
  accentDark: "#D9411F",
  accentLight: "#FFF0EA",
  background: "#F7F7F7",
  white: "#FFFFFF",
  border: "#EEEEEE",
  black: "#252525",
  text: "#454545",
  muted: "#777777",
};

/* =====================================================
   ADMIN PAGE INFORMATION
===================================================== */

const pageTitles = {
  "/admin": {
    title: "Dashboard",
    description: "Your platform overview and daily operations.",
  },

  "/admin/analytics": {
    title: "Analytics & Reports",
    description: "Explore platform performance and reports.",
  },

  "/admin/students": {
    title: "Manage Students",
    description: "Manage student accounts, enrollment and activity.",
  },

  "/admin/trainers": {
    title: "Manage Trainers",
    description: "Manage trainer profiles and assignments.",
  },

  "/admin/colleges": {
    title: "Manage Colleges",
    description: "Manage institutions and college partnerships.",
  },

  "/admin/roles": {
    title: "Admin Roles",
    description: "Manage administrator roles and permissions.",
  },

  "/admin/programs": {
    title: "Programs & Courses",
    description: "Manage programs, courses and enrollment capacity.",
  },

  "/admin/requests": {
    title: "Trainer Requests",
    description: "Review and manage trainer requests.",
  },

  "/admin/assignments": {
    title: "Trainer Assignments",
    description: "Manage trainer allocations and assignments.",
  },

  "/admin/demos": {
    title: "Demo Schedules",
    description: "Organize demo sessions and schedules.",
  },

  "/admin/payments": {
    title: "Payments & Invoices",
    description: "Monitor payment and invoice records.",
  },

  "/admin/notifications": {
    title: "Notifications",
    description: "Manage platform notifications and communication.",
  },

  "/admin/feedback": {
    title: "Feedback & Reviews",
    description: "Review feedback and platform issues.",
  },

  "/admin/audit-logs": {
    title: "Audit Logs",
    description: "Review administrative activity and history.",
  },

  "/admin/settings": {
    title: "Platform Settings",
    description: "Manage platform configuration and preferences.",
  },
};

/* =====================================================
   GLOBAL SEARCH ROUTES
===================================================== */

const searchablePages = [
  { label: "Dashboard", path: "/admin" },
  { label: "Analytics & Reports", path: "/admin/analytics" },
  { label: "Manage Students", path: "/admin/students" },
  { label: "Manage Trainers", path: "/admin/trainers" },
  { label: "Manage Colleges", path: "/admin/colleges" },
  { label: "Admin Roles", path: "/admin/roles" },
  { label: "Programs & Courses", path: "/admin/programs" },
  { label: "Trainer Requests", path: "/admin/requests" },
  { label: "Trainer Assignments", path: "/admin/assignments" },
  { label: "Demo Schedules", path: "/admin/demos" },
  { label: "Payments & Invoices", path: "/admin/payments" },
  { label: "Notifications", path: "/admin/notifications" },
  { label: "Feedback & Reviews", path: "/admin/feedback" },
  { label: "Audit Logs", path: "/admin/audit-logs" },
  { label: "Settings", path: "/admin/settings" },
];

/* =====================================================
   PAGE TRANSITION
===================================================== */

const pageTransition = {
  initial: {
    opacity: 0,
    y: 8,
  },

  animate: {
    opacity: 1,
    y: 0,
  },

  exit: {
    opacity: 0,
    y: -4,
  },

  transition: {
    duration: 0.22,
    ease: [0.22, 1, 0.36, 1],
  },
};

/* =====================================================
   HELPERS
===================================================== */

function getPageInformation(pathname) {
  if (pageTitles[pathname]) {
    return pageTitles[pathname];
  }

  const matchedPath = Object.keys(pageTitles)
    .filter(
      (path) =>
        path !== "/admin" &&
        pathname.startsWith(`${path}/`)
    )
    .sort((a, b) => b.length - a.length)[0];

  if (matchedPath) {
    return pageTitles[matchedPath];
  }

  const segment = pathname
    .split("/")
    .filter(Boolean)
    .pop();

  return {
    title: segment
      ? segment
        .replace(/[-_]/g, " ")
        .replace(/\b\w/g, (character) =>
          character.toUpperCase()
        )
      : "Admin Panel",

    description: "Manage and monitor platform operations.",
  };
}

/* =====================================================
   ADMIN LAYOUT
===================================================== */

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [globalSearch, setGlobalSearch] = useState("");

  const { title, description } = getPageInformation(
    location.pathname
  );

  /* ===================================================
     RESET SEARCH WHEN ROUTE CHANGES
  =================================================== */

  useEffect(() => {
    setGlobalSearch("");
  }, [location.pathname]);

  /* ===================================================
     FIX SIDEBAR SCROLL CHAINING

     While the mouse is over the sidebar navigation,
     prevent the wheel event from scrolling the document.

     AdminSidebar's own smooth-wheel handler continues
     to move the navigation.
  =================================================== */

  useEffect(() => {
    const handleSidebarWheel = (event) => {
      const target = event.target;

      if (!(target instanceof Element)) {
        return;
      }

      const sidebarScroller = target.closest(
        ".admin-sidebar-scroll"
      );

      if (sidebarScroller) {
        event.preventDefault();
      }
    };

    document.addEventListener("wheel", handleSidebarWheel, {
      capture: true,
      passive: false,
    });

    return () => {
      document.removeEventListener(
        "wheel",
        handleSidebarWheel,
        true
      );
    };
  }, []);

  /* ===================================================
     TOPBAR SEARCH
  =================================================== */

  const handleGlobalSearch = (event) => {
    event.preventDefault();

    const query = globalSearch.trim().toLowerCase();

    if (!query) {
      return;
    }

    const exactMatch = searchablePages.find(
      (page) => page.label.toLowerCase() === query
    );

    const partialMatch = searchablePages.find(
      (page) => page.label.toLowerCase().includes(query)
    );

    const matchedPage = exactMatch || partialMatch;

    if (matchedPage) {
      navigate(matchedPage.path);
      setGlobalSearch("");
    }
  };

  /* ===================================================
     LAYOUT
  =================================================== */

  return (
    <div
      className="admin-layout-shell min-h-screen min-w-0 text-[#252525]"
      style={{
        backgroundColor: THEME.background,
      }}
    >
      <style>{`
        .admin-layout-shell input {
          color: #111111;
        }

        .admin-layout-shell input::placeholder {
          color: #686868;
          opacity: 1;
        }

        .admin-layout-shell .admin-topbar {
          -webkit-backdrop-filter: blur(14px);
          backdrop-filter: blur(14px);
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-layout-shell *,
          .admin-layout-shell *::before,
          .admin-layout-shell *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ===============================================
          SHARED SIDEBAR
      =============================================== */}

      <AdminSidebar />

      {/* ===============================================
          MAIN CONTENT AREA
      =============================================== */}

      <div className="min-h-screen min-w-0 lg:ml-[252px]">

        {/* =============================================
            STICKY TOPBAR
        ============================================= */}

        <header
          className="admin-topbar sticky top-0 z-30 flex h-[68px] items-center justify-between gap-3 border-b border-[#EEEEEE] bg-white/95 pl-[68px] pr-4 sm:pr-6 lg:pl-6"
        >
          {/* PAGE TITLE */}

          <div className="min-w-0 flex-1">
            <div className="flex min-w-0 items-center gap-2">
              <span className="hidden h-2 w-2 shrink-0 rounded-full bg-[#F4512B] sm:block" />

              <h1 className="truncate text-[15px] font-extrabold tracking-tight text-[#252525] sm:text-[17px]">
                {title}
              </h1>
            </div>

            <p className="mt-1 hidden truncate text-[10px] font-semibold text-[#686868] sm:block">
              {description}
            </p>
          </div>

          {/* GLOBAL SEARCH
              This search is in the topbar, not the sidebar.
          */}

          <form
            onSubmit={handleGlobalSearch}
            className="hidden h-10 w-full max-w-[280px] items-center gap-2 rounded-xl border border-[#E8E8E8] bg-[#FAFAFA] px-3 transition-all duration-200 focus-within:border-[#F2B3A3] focus-within:bg-white focus-within:ring-4 focus-within:ring-orange-50 xl:flex"
          >
            <Search
              size={16}
              className="shrink-0 text-[#555555]"
            />

            <input
              type="search"
              value={globalSearch}
              onChange={(event) =>
                setGlobalSearch(event.target.value)
              }
              placeholder="Search admin pages..."
              aria-label="Search admin pages"
              autoComplete="off"
              className="min-w-0 flex-1 bg-transparent text-[12px] font-bold text-[#111111] outline-none"
            />

            <span className="rounded-md border border-[#E8E8E8] bg-white px-1.5 py-0.5 text-[9px] font-bold text-[#555555]">
              Enter
            </span>
          </form>

          {/* RIGHT ACTIONS */}

          <div className="flex shrink-0 items-center gap-2 sm:gap-3">

            {/* NOTIFICATIONS */}

            <Link
              to="/admin/notifications"
              title="Notifications"
              aria-label="Open notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEEEEE] bg-white text-[#454545] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5] hover:text-[#D9411F]"
            >
              <Bell size={17} />

              <span className="absolute right-[8px] top-[7px] h-2 w-2 rounded-full border-2 border-white bg-[#F4512B]" />
            </Link>

            {/* ADMIN PROFILE */}

            <div className="flex items-center gap-2 rounded-xl border border-[#EEEEEE] bg-white px-2 py-1.5 sm:px-3">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#FFF0EA] text-[#D9411F]">
                <ShieldCheck size={17} />
              </div>

              <div className="hidden sm:block">
                <p className="text-[11px] font-extrabold text-[#252525]">
                  Administrator
                </p>

                <p className="mt-0.5 text-[9px] font-semibold text-[#686868]">
                  Admin Portal
                </p>
              </div>
            </div>

          </div>
        </header>

        {/* =============================================
            PAGE CONTENT
        ============================================= */}

        <main className="min-h-[calc(100vh-68px)] min-w-0 p-4 sm:p-5 lg:p-6">
          <div className="mx-auto min-w-0 w-full max-w-[1800px]">

            <AnimatePresence
              mode="wait"
              initial={false}
            >
              <motion.div
                key={location.pathname}
                {...pageTransition}
                className="min-w-0"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>

          </div>
        </main>

        {/* =============================================
            FOOTER
        ============================================= */}

        <footer className="border-t border-[#EEEEEE] bg-white px-5 py-3 sm:px-6">
          <div className="mx-auto flex w-full max-w-[1800px] flex-col gap-1 text-[10px] font-semibold text-[#686868] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} CodeFaculty
            </p>

            <p className="flex items-center gap-1.5">
              <Activity
                size={12}
                style={{ color: THEME.accent }}
              />

              Admin Control Center
            </p>
          </div>
        </footer>

      </div>
    </div>
  );
}