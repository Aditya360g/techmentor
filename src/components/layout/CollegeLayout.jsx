import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import CollegeSidebar from "../college/layout/CollegeSidebar";
import CollegeTopbar from "../college/layout/CollegeTopbar";

const SIDEBAR_WIDTH = 272;

export default function CollegeLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [desktopView, setDesktopView] = useState(
    () => typeof window !== "undefined" && window.innerWidth >= 768
  );

  const handleLogout = useCallback(() => {
    setMobileOpen(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)");

    const updateViewport = (event) => {
      setDesktopView(event.matches);
      if (event.matches) setMobileOpen(false);
    };

    setDesktopView(media.matches);
    media.addEventListener("change", updateViewport);

    return () => media.removeEventListener("change", updateViewport);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileOpen || desktopView) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleEscape);
    };
  }, [mobileOpen, desktopView]);

  return (
    <div
      className="college-workspace min-h-screen w-full bg-[#0b1421] text-slate-100"
      style={{ "--college-sidebar-width": `${SIDEBAR_WIDTH}px` }}
    >
      {mobileOpen && !desktopView && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-slate-950/60 md:hidden"
        />
      )}

      <CollegeSidebar
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        collapsed={false}
        onCollapsedChange={() => { }}
        onLogout={handleLogout}
      />

      <div
        className="college-main-workspace flex min-h-screen min-w-0 flex-col"
        style={{
          marginLeft: desktopView ? SIDEBAR_WIDTH : 0,
          width: desktopView
            ? `calc(100% - ${SIDEBAR_WIDTH}px)`
            : "100%",
        }}
      >
        <div className="sticky top-0 z-50 w-full shrink-0">
          <CollegeTopbar
            mobileOpen={mobileOpen}
            onMenuClick={() => setMobileOpen((open) => !open)}
            onLogout={handleLogout}
          />
        </div>

        <main
          id="college-main-content"
          className="college-main-content min-w-0 w-full flex-1"
        >
          <div className="mx-auto min-w-0 w-full max-w-[1800px]">
            <Outlet />
          </div>


        </main>
      </div>
    </div>
  );
}
