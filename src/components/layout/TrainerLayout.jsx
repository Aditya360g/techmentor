
import { useCallback, useEffect, useRef, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";

import TrainerSidebar from "../trainer/TrainerSidebar";
import TrainerTopbar from "../trainer/TrainerTopbar";

const SIDEBAR_WIDTH = 272;
const DESKTOP_BREAKPOINT = 1024;

export default function TrainerLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const mainRef = useRef(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(
    () =>
      typeof window !== "undefined" &&
      window.innerWidth >= DESKTOP_BREAKPOINT
  );

  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const handleLogout = useCallback(() => {
    setSidebarOpen(false);
    navigate("/login", { replace: true });
  }, [navigate]);

  // Correct desktop/mobile detection.
  useEffect(() => {
    const media = window.matchMedia(
      `(min-width: ${DESKTOP_BREAKPOINT}px)`
    );

    const update = (event) => {
      setIsDesktop(event.matches);
      if (event.matches) setSidebarOpen(false);
    };

    setIsDesktop(media.matches);
    media.addEventListener("change", update);

    return () => media.removeEventListener("change", update);
  }, []);

  // Close mobile menu and reset page scroll after navigation.
  useEffect(() => {
    setSidebarOpen(false);

    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: "auto" });
    }
  }, [location.pathname]);

  // Prevent background scrolling while the mobile menu is open.
  useEffect(() => {
    if (!sidebarOpen || isDesktop) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") closeSidebar();
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [sidebarOpen, isDesktop, closeSidebar]);

  // Smooth wheel animation for the main page.
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;

    let current = main.scrollTop;
    let target = main.scrollTop;
    let frame = null;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const animate = () => {
      const distance = target - current;

      if (Math.abs(distance) < 0.7) {
        current = target;
        main.scrollTop = target;
        frame = null;
        return;
      }

      current += distance * 0.16;
      main.scrollTop = current;
      frame = requestAnimationFrame(animate);
    };

    const canScroll = (element, delta) => {
      const max = element.scrollHeight - element.clientHeight;
      if (max <= 1) return false;

      return delta > 0
        ? element.scrollTop < max - 1
        : element.scrollTop > 1;
    };

    const onWheel = (event) => {
      if (event.ctrlKey || event.metaKey || !event.deltaY) return;

      const multiplier =
        event.deltaMode === 1
          ? 16
          : event.deltaMode === 2
            ? main.clientHeight
            : 1;

      const delta = event.deltaY * multiplier;
      const node = event.target;

      if (node instanceof Element) {
        if (
          node.closest(
            "input, textarea, select, [contenteditable='true']"
          )
        ) {
          return;
        }

        const inner = node.closest(
          [
            "[data-wheel-scroll]",
            "[data-native-scroll]",
            ".trainer-sidebar-scroll",
            ".overflow-y-auto",
            ".overflow-auto",
          ].join(",")
        );

        if (inner && inner !== main && canScroll(inner, delta)) {
          return;
        }
      }

      const max = main.scrollHeight - main.clientHeight;
      if (max <= 1) return;

      if (
        (delta < 0 && main.scrollTop <= 0) ||
        (delta > 0 && main.scrollTop >= max - 1)
      ) {
        return;
      }

      event.preventDefault();

      if (reducedMotion) {
        main.scrollTop = Math.max(
          0,
          Math.min(max, main.scrollTop + delta)
        );
        current = target = main.scrollTop;
        return;
      }

      if (frame === null) {
        current = main.scrollTop;
        target = main.scrollTop;
      }

      target = Math.max(0, Math.min(max, target + delta * 1.1));

      if (frame === null) {
        frame = requestAnimationFrame(animate);
      }
    };

    main.addEventListener("wheel", onWheel, { passive: false });

    return () => {
      main.removeEventListener("wheel", onWheel);

      if (frame !== null) {
        cancelAnimationFrame(frame);
      }
    };
  }, []);

  return (
    <div
      className="trainer-theme fixed inset-0 flex w-full flex-col overflow-hidden bg-[#f6f9fc] text-slate-900"
      style={{ height: "100dvh" }}
    >
      {/* Desktop sidebar: always visible on desktop */}
      {isDesktop && (
        <aside
          className="fixed inset-y-0 left-0 z-40 flex flex-col overflow-hidden border-r border-slate-200 bg-white"
          style={{ width: SIDEBAR_WIDTH }}
        >
          <TrainerSidebar onLogout={handleLogout} />
        </aside>
      )}

      {/* Mobile backdrop */}
      {!isDesktop && sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-slate-950/40"
        />
      )}

      {/* Mobile sidebar */}
      {!isDesktop && (
        <aside
          className={[
            "fixed inset-y-0 left-0 z-50 flex w-[272px] max-w-[88vw]",
            "flex-col overflow-hidden border-r border-slate-200 bg-white shadow-2xl",
            "transition-transform duration-300 ease-in-out",
            sidebarOpen ? "translate-x-0" : "-translate-x-full",
          ].join(" ")}
          aria-hidden={!sidebarOpen}
          inert={!sidebarOpen}
        >
          <TrainerSidebar
            onNavigate={closeSidebar}
            onLogout={handleLogout}
          />
        </aside>
      )}

      {/* Main layout */}
      <div
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
        style={{
          marginLeft: isDesktop ? SIDEBAR_WIDTH : 0,
          width: isDesktop
            ? `calc(100% - ${SIDEBAR_WIDTH}px)`
            : "100%",
        }}
      >
        {/* Topbar */}
        <header className="relative z-30 shrink-0 border-b border-slate-200 bg-white shadow-sm">
          <TrainerTopbar onMenuClick={openSidebar} />
        </header>

        {/* Scrollable page content */}
        <main
          ref={mainRef}
          id="trainer-main-content"
          tabIndex={-1}
          className="trainer-content min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto bg-[#f6f9fc] p-4 sm:p-6 lg:p-8"
          style={{
            WebkitOverflowScrolling: "touch",
            overscrollBehaviorY: "contain",
            scrollbarWidth: "thin",
            scrollbarColor: "#a7e8cc transparent",
          }}
        >
          <div className="mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>

          <footer className="mx-auto mt-8 flex w-full max-w-[1600px] flex-col gap-3 border-t border-slate-200 py-5 text-[11px] text-slate-400 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} CodeFaculty. Trainer Workspace.
            </p>

            <button
              type="button"
              onClick={() => navigate("/trainer/settings")}
              className="w-fit font-semibold text-slate-500 transition-colors hover:text-emerald-800"
            >
              Workspace settings
            </button>
          </footer>
        </main>
      </div>

      <style>{`
        .trainer-content {
          scrollbar-gutter: stable;
        }

        .trainer-content::-webkit-scrollbar {
          width: 8px;
        }

        .trainer-content::-webkit-scrollbar-track {
          background: transparent;
        }

        .trainer-content::-webkit-scrollbar-thumb {
          background: #a7e8cc;
          border-radius: 999px;
        }

        .trainer-content::-webkit-scrollbar-thumb:hover {
          background: #6ed7ac;
        }

        .trainer-sidebar-scroll {
          min-height: 0;
          overscroll-behavior-y: contain;
          -webkit-overflow-scrolling: touch;
          scrollbar-width: thin;
          scrollbar-color: #a7e8cc transparent;
        }

        .trainer-sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }

        .trainer-sidebar-scroll::-webkit-scrollbar-thumb {
          background: #a7e8cc;
          border-radius: 999px;
        }
      `}</style>
    </div>
  );
}
