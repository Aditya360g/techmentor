
import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import CollegeSidebar from "../college/layout/CollegeSidebar";
import CollegeTopbar from "../college/layout/CollegeTopbar";

export default function CollegeLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopView, setDesktopView] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );

  const sidebarWidth = 272;

  const handleLogout = useCallback(() => {
    setMobileOpen(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Keep the sidebar layout responsive.
  useEffect(() => {
    const handleResize = () => {
      const isDesktop = window.innerWidth >= 768;

      setDesktopView(isDesktop);

      if (isDesktop) {
        setMobileOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Close mobile navigation after changing pages.
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Prevent background scrolling while mobile navigation is open.
  useEffect(() => {
    if (!mobileOpen || desktopView) return undefined;

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, desktopView]);

  return (
    <div className="h-dvh overflow-hidden bg-[#f7f8fc] text-slate-900">
      {/* Mobile sidebar backdrop */}
      {mobileOpen && !desktopView && (
        <button
          type="button"
          aria-label="Close navigation backdrop"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-40 bg-slate-950/50 md:hidden"
        />
      )}

      {/* College sidebar */}
      <CollegeSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={false}
        onCollapsedChange={() => { }}
        onLogout={handleLogout}
      />

      {/* Main workspace */}
      <div
        className="flex h-dvh min-w-0 flex-col"
        style={{
          marginLeft: desktopView ? `${sidebarWidth}px` : "0px",
        }}
      >
        {/* Fixed-height topbar */}
        <CollegeTopbar
          mobileOpen={mobileOpen}
          onMenuClick={() => setMobileOpen((open) => !open)}
          onLogout={handleLogout}
        />

        {/* Scrollable content */}
        <main
          id="college-main-content"
          className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain p-4 sm:p-6 lg:p-8"
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="mx-auto mt-8 flex w-full max-w-[1600px] flex-col gap-2 border-t border-slate-200 py-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} CodeFaculty. College Workspace.
            </p>

            <button
              type="button"
              onClick={() => navigate("/college/settings")}
              className="inline-flex w-fit items-center gap-1 font-semibold text-slate-500 hover:text-violet-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
            >
              Workspace settings
            </button>
          </footer>
        </main>
      </div>
    </div>
  );
}
