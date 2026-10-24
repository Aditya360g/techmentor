
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Outlet, useLocation, useNavigate } from "react-router";

import CollegeSidebar from "../college/layout/CollegeSidebar";
import CollegeTopbar from "../college/layout/CollegeTopbar";

const SIDEBAR_WIDTH = 272;
const DESKTOP_BREAKPOINT = 1024;

export default function CollegeLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [desktopView, setDesktopView] = useState(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth >= DESKTOP_BREAKPOINT
  );

  const openSidebar = useCallback(() => {
    setOpen(true);
  }, []);

  const closeSidebar = useCallback(() => {
    setOpen(false);
  }, []);

  const handleLogout = useCallback(() => {
    setOpen(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Responsive sidebar
  useEffect(() => {
    const mediaQuery = window.matchMedia(
      `(min - width: ${DESKTOP_BREAKPOINT}px)`
    );

    const updateViewport = (event) => {
      setDesktopView(event.matches);

      if (event.matches) {
        setOpen(false);
      }
    };

    setDesktopView(mediaQuery.matches);
    mediaQuery.addEventListener("change", updateViewport);

    return () => {
      mediaQuery.removeEventListener("change", updateViewport);
    };
  }, []);

  // Close mobile sidebar and reset scroll after navigation
  useEffect(() => {
    setOpen(false);

    const main = document.getElementById("college-main-content");

    if (main) {
      main.scrollTop = 0;
    }
  }, [location.pathname]);

  // Lock background scroll while mobile navigation is open
  useEffect(() => {
    if (!open || desktopView) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, desktopView]);

  return (
    <div className="college-theme fixed inset-0 flex h-screen h-dvh w-full overflow-hidden bg-[#f7f9fc] text-slate-900">
      {/* Desktop Sidebar */}
      {desktopView && (
        <aside
          className="fixed inset-y-0 left-0 z-40 flex flex-col border-r border-white/[0.07] bg-[#0b1220]"
          style={{ width: `${SIDEBAR_WIDTH} px` }}
        >
          <CollegeSidebar onLogout={handleLogout} />
        </aside>
      )}

      {/* Mobile Overlay */}
      <AnimatePresence>
        {open && !desktopView && (
          <motion.button
            type="button"
            aria-label="Close college navigation"
            onClick={closeSidebar}
            className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />
        )}
      </AnimatePresence>

      {/* Mobile Sidebar */}
      {!desktopView && (
        <aside
          id="college-mobile-sidebar"
          className={[
            "fixed inset-y-0 left-0 z-50 flex w-[272px] max-w-[88vw] flex-col",
            "border-r border-white/[0.07] bg-[#0b1220] shadow-2xl",
            "transition-transform duration-300 ease-in-out lg:hidden",
            open ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          aria-hidden={!open}
          inert={!open}
        >
          <CollegeSidebar
            mobileOpen={open}
            setMobileOpen={setOpen}
            onLogout={handleLogout}
          />
        </aside>
      )}

      {/* Main Content */}
      <div
        className="flex h-full min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        style={{
          marginLeft: desktopView ? `${SIDEBAR_WIDTH} px` : "0px",
          width: desktopView
            ? `calc(100 % - ${SIDEBAR_WIDTH}px)`
            : "100%",
        }}
      >
        {/* College Topbar */}
        <header className="relative z-30 shrink-0 border-b border-slate-200/80 bg-white shadow-sm">
          <CollegeTopbar
            mobileOpen={open}
            onMenuClick={openSidebar}
            onLogout={handleLogout}
          />
        </header>

        {/* Scrollable Page Content */}
        <main
          id="college-main-content"
          tabIndex={0}
          className="college-main-scroll relative min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-[#f7f9fc] p-4 sm:p-6 lg:p-8"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "contain",
            touchAction: "pan-y",
            scrollbarGutter: "stable",
          }}
        >
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="relative z-10 mx-auto w-full max-w-[1600px]"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>

          {/* Footer */}
          <footer className="relative z-10 mx-auto mt-8 flex w-full max-w-[1600px] flex-col gap-3 border-t border-slate-200 py-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} CodeFaculty. College Workspace.
            </p>

            <button
              type="button"
              onClick={() => navigate("/college/settings")}
              className="w-fit font-semibold text-slate-500 transition-colors hover:text-sky-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
            >
              Workspace settings
            </button>
          </footer>
        </main>
      </div>

      {/* Scrollbar Styles */}
      <style>{`
  .college - theme {
  isolation: isolate;
}

        .college - main - scroll {
  scrollbar - width: thin;
  scrollbar - color: #cbd5e1 transparent;
}

        .college - main - scroll:: -webkit - scrollbar {
  width: 8px;
}

        .college - main - scroll:: -webkit - scrollbar - track {
  background: transparent;
}

        .college - main - scroll:: -webkit - scrollbar - thumb {
  background: #cbd5e1;
  border: 2px solid transparent;
  background - clip: padding - box;
  border - radius: 999px;
}

        .college - main - scroll:: -webkit - scrollbar - thumb:hover {
  background: #94a3b8;
  border: 2px solid transparent;
  background - clip: padding - box;
}

@media(prefers - reduced - motion: reduce) {
          .college - main - scroll {
    scroll - behavior: auto;
  }
}
`}</style>
    </div>
  );
}
