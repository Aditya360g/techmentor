import { useEffect, useRef, useState } from "react";
import { Link, NavLink } from "react-router";
import { AnimatePresence, motion } from "motion/react";

import {
    Activity,
    ArrowUpRight,
    BarChart3,
    Bell,
    BookOpen,
    Building2,
    CalendarDays,
    ChevronRight,
    ClipboardList,
    FileBarChart,
    GraduationCap,
    History,
    LayoutDashboard,
    LogOut,
    Menu,
    MessageSquareText,
    Settings,
    ShieldCheck,
    UserRoundCheck,
    Users,
    Wallet,
    X,
} from "lucide-react";

/* =====================================================
   ADMIN THEME
===================================================== */

const THEME = {
    accent: "#F4512B",
    accentHover: "#D9411F",
    accentLight: "#FFF0EA",
    accentSoft: "#FFF8F5",
    white: "#FFFFFF",
    border: "#EEEEEE",
    black: "#252525",
    text: "#454545",
    muted: "#777777",
};

/* =====================================================
   ALL ADMIN PAGES
   Matched to the page names shown in your screenshot.
===================================================== */

const navigationGroups = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                path: "/admin",
                icon: LayoutDashboard,
                end: true,
            },
            {
                label: "Analytics & Reports",
                path: "/admin/analytics",
                icon: BarChart3,
            },
        ],
    },

    {
        title: "PEOPLE MANAGEMENT",
        items: [
            {
                label: "Manage Students",
                path: "/admin/students",
                icon: GraduationCap,
            },
            {
                label: "Manage Trainers",
                path: "/admin/trainers",
                icon: Users,
            },
            {
                label: "Manage Colleges",
                path: "/admin/colleges",
                icon: Building2,
            },
            {
                label: "Admin Roles",
                path: "/admin/roles",
                icon: ShieldCheck,
            },
        ],
    },

    {
        title: "ACADEMIC MANAGEMENT",
        items: [
            {
                label: "Programs & Courses",
                path: "/admin/programs",
                icon: BookOpen,
            },
            {
                label: "Trainer Requests",
                path: "/admin/requests",
                icon: ClipboardList,
            },
            {
                label: "Trainer Assignments",
                path: "/admin/assignments",
                icon: UserRoundCheck,
            },
            {
                label: "Demo Schedules",
                path: "/admin/demos",
                icon: CalendarDays,
            },
        ],
    },

    {
        title: "BUSINESS & COMMUNICATION",
        items: [
            {
                label: "Payments & Invoices",
                path: "/admin/payments",
                icon: Wallet,
            },
            {
                label: "Notifications",
                path: "/admin/notifications",
                icon: Bell,
            },
            {
                label: "Feedback & Reviews",
                path: "/admin/feedback",
                icon: MessageSquareText,
            },
        ],
    },

    {
        title: "SYSTEM & SECURITY",
        items: [
            {
                label: "Audit Logs",
                path: "/admin/audit-logs",
                icon: History,
            },
            {
                label: "Settings",
                path: "/admin/settings",
                icon: Settings,
            },
        ],
    },
];

/* =====================================================
   SMOOTH MOUSE-WHEEL SCROLL
   Uses requestAnimationFrame for eased scrolling.
===================================================== */

function useSmoothWheel(scrollRef, enabled = true) {
    useEffect(() => {
        if (!enabled) return undefined;

        const element = scrollRef.current;

        if (!element) return undefined;

        let currentScroll = element.scrollTop;
        let targetScroll = element.scrollTop;
        let animationFrame = null;

        const animateScroll = () => {
            currentScroll += (targetScroll - currentScroll) * 0.22;

            element.scrollTop = currentScroll;

            if (Math.abs(targetScroll - currentScroll) > 0.6) {
                animationFrame = requestAnimationFrame(animateScroll);
            } else {
                element.scrollTop = targetScroll;
                currentScroll = targetScroll;
                animationFrame = null;
            }
        };

        const handleWheel = (event) => {
            if (event.ctrlKey) return;

            // Always block browser/page scrolling over sidebar.
            event.preventDefault();

            const maxScroll = Math.max(
                0,
                element.scrollHeight - element.clientHeight
            );

            if (maxScroll <= 0) return;

            let delta = event.deltaY;

            if (event.deltaMode === 1) {
                delta *= 16;
            } else if (event.deltaMode === 2) {
                delta *= element.clientHeight;
            }

            targetScroll = Math.max(
                0,
                Math.min(maxScroll, targetScroll + delta * 0.85)
            );

            if (animationFrame === null) {
                currentScroll = element.scrollTop;
                animationFrame = requestAnimationFrame(animateScroll);
            }
        };

        element.addEventListener("wheel", handleWheel, {
            passive: false,
        });

        return () => {
            element.removeEventListener("wheel", handleWheel);

            if (animationFrame !== null) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [scrollRef, enabled]);
}

/* =====================================================
   ANIMATION SETTINGS
===================================================== */

const sidebarTransition = {
    type: "tween",
    duration: 0.24,
    ease: [0.22, 1, 0.36, 1],
};

/* =====================================================
   ADMIN SIDEBAR
===================================================== */

export default function AdminSidebar() {
    const [mobileOpen, setMobileOpen] = useState(false);

    const desktopScrollRef = useRef(null);
    const mobileScrollRef = useRef(null);

    // Desktop sidebar always mounted.
    useSmoothWheel(desktopScrollRef, true);

    // Attach the wheel animation when mobile navigation opens.
    useSmoothWheel(mobileScrollRef, mobileOpen);

    /* ===================================================
       CLOSE MOBILE SIDEBAR
    =================================================== */

    useEffect(() => {
        if (!mobileOpen) return undefined;

        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setMobileOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
        };
    }, [mobileOpen]);

    /* ===================================================
       SIDEBAR CONTENT
    =================================================== */

    const renderSidebarContent = (scrollRef, isMobile = false) => (
        <div className="flex h-full min-h-0 flex-col bg-white">
            {/* BRAND */}

            <div className="flex h-[72px] shrink-0 items-center justify-between border-b border-[#EEEEEE] px-5">
                <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="group flex min-w-0 items-center gap-3"
                >
                    <motion.div
                        whileHover={{
                            rotate: -5,
                            scale: 1.05,
                        }}
                        transition={{ duration: 0.2 }}
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm"
                        style={{ backgroundColor: THEME.accent }}
                    >
                        <Activity size={21} strokeWidth={2.5} />
                    </motion.div>

                    <div className="min-w-0">
                        <p className="truncate text-[15px] font-extrabold tracking-tight text-[#252525]">
                            CodeFaculty
                        </p>

                        <p className="mt-0.5 text-[10px] font-extrabold uppercase tracking-[0.12em] text-[#D9411F]">
                            Admin Portal
                        </p>
                    </div>
                </Link>

                {isMobile && (
                    <button
                        type="button"
                        onClick={() => setMobileOpen(false)}
                        aria-label="Close sidebar"
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#EEEEEE] text-[#252525] transition-colors hover:bg-[#FFF0EA]"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* NAVIGATION HEADING */}

            <div className="shrink-0 px-5 pb-2 pt-5">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.14em] text-[#777777]">
                    Platform Navigation
                </p>

                <p className="mt-1 text-[11px] font-semibold text-[#454545]">
                    Manage all admin modules
                </p>
            </div>

            {/* NAVIGATION
          No search bar.
          Scrollbar is hidden but mouse wheel works.
      */}

            <nav
                ref={scrollRef}
                aria-label="Admin navigation"
                className="admin-sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-3 pb-4"
            >
                {navigationGroups.map((group, groupIndex) => (
                    <motion.div
                        key={group.title}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.22,
                            delay: groupIndex * 0.035,
                        }}
                        className="mb-5"
                    >
                        <p className="mb-2 px-3 pt-2 text-[10px] font-extrabold tracking-[0.12em] text-[#777777]">
                            {group.title}
                        </p>

                        <div className="space-y-1">
                            {group.items.map((item, itemIndex) => {
                                const Icon = item.icon;

                                return (
                                    <motion.div
                                        key={item.path}
                                        initial={{
                                            opacity: 0,
                                            x: -5,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            x: 0,
                                        }}
                                        transition={{
                                            duration: 0.18,
                                            delay: Math.min(itemIndex * 0.02, 0.08),
                                        }}
                                    >
                                        <NavLink
                                            to={item.path}
                                            end={item.end}
                                            onClick={() => setMobileOpen(false)}
                                            className={({ isActive }) =>
                                                [
                                                    "group relative flex min-h-[42px] items-center gap-3 rounded-xl px-3 py-2.5",
                                                    "text-[12px] transition-colors duration-200",
                                                    isActive
                                                        ? "bg-[#F4512B] font-extrabold text-white shadow-[0_4px_12px_rgba(244,81,43,0.18)]"
                                                        : "font-bold text-[#252525] hover:bg-[#FFF3EE] hover:text-[#D9411F]",
                                                ].join(" ")
                                            }
                                        >
                                            {({ isActive }) => (
                                                <>
                                                    <span
                                                        className={[
                                                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-lg transition-colors duration-200",
                                                            isActive
                                                                ? "bg-white/15 text-white"
                                                                : "text-[#555555] group-hover:text-[#D9411F]",
                                                        ].join(" ")}
                                                    >
                                                        <Icon
                                                            size={17}
                                                            strokeWidth={isActive ? 2.3 : 2}
                                                        />
                                                    </span>

                                                    <span className="min-w-0 flex-1 leading-5">
                                                        {item.label}
                                                    </span>

                                                    {isActive && (
                                                        <motion.span
                                                            initial={{
                                                                opacity: 0,
                                                                scale: 0.7,
                                                            }}
                                                            animate={{
                                                                opacity: 1,
                                                                scale: 1,
                                                            }}
                                                            transition={{ duration: 0.15 }}
                                                            className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-white/15"
                                                        >
                                                            <ChevronRight
                                                                size={14}
                                                                strokeWidth={2.5}
                                                            />
                                                        </motion.span>
                                                    )}
                                                </>
                                            )}
                                        </NavLink>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                ))}
            </nav>

            {/* SIDEBAR FOOTER */}

            <div className="shrink-0 border-t border-[#EEEEEE] bg-white p-3">
                <Link
                    to="/"
                    onClick={() => setMobileOpen(false)}
                    className="group flex min-h-[41px] items-center gap-3 rounded-xl px-3 text-[12px] font-bold text-[#252525] transition-colors hover:bg-[#F7F7F7]"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5F5F5] text-[#454545] group-hover:text-[#D9411F]">
                        <ArrowUpRight size={16} />
                    </span>

                    <span className="flex-1">Public Website</span>
                </Link>

                <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="group mt-1 flex min-h-[41px] items-center gap-3 rounded-xl px-3 text-[12px] font-bold text-[#C83D3D] transition-colors hover:bg-[#FFF0F0]"
                >
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#FFF0F0] text-[#C83D3D]">
                        <LogOut size={15} />
                    </span>

                    <span className="flex-1">Logout</span>
                </Link>

                <div className="mt-3 rounded-xl border border-[#F4D5CB] bg-[#FFF8F5] p-3">
                    <div className="flex items-center gap-2">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[#D9411F]">
                            <ShieldCheck size={17} />
                        </span>

                        <div className="min-w-0">
                            <p className="text-[11px] font-extrabold text-[#252525]">
                                Admin Workspace
                            </p>

                            <p className="mt-0.5 text-[10px] font-semibold text-[#555555]">
                                Platform management
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* SIDEBAR SCROLL STYLES */}

            <style>{`
        .admin-sidebar-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
          overscroll-behavior: none !important;
        }

        .admin-sidebar-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-sidebar-scroll *,
          .admin-sidebar-scroll *::before,
          .admin-sidebar-scroll *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

            {/* MOBILE MENU BUTTON */}

            <button
                type="button"
                onClick={() => setMobileOpen(true)}
                aria-label="Open admin navigation"
                className="fixed left-4 top-4 z-40 flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEEEEE] bg-white text-[#252525] shadow-md transition-colors hover:bg-[#FFF0EA] lg:hidden"
            >
                <Menu size={20} />
            </button>

            {/* DESKTOP SIDEBAR */}

            <aside className="admin-sidebar-root fixed inset-y-0 left-0 z-40 hidden w-[252px] border-r border-[#EEEEEE] bg-white lg:block">
                {renderSidebarContent(desktopScrollRef)}
            </aside>

            {/* MOBILE OVERLAY AND SIDEBAR */}

            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.button
                            type="button"
                            aria-label="Close navigation overlay"
                            onClick={() => setMobileOpen(false)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.18 }}
                            className="fixed inset-0 z-40 bg-black/35 backdrop-blur-[2px] lg:hidden"
                        />

                        <motion.aside
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={sidebarTransition}
                            className="admin-sidebar-root fixed inset-y-0 left-0 z-50 w-[280px] max-w-[88vw] border-r border-[#EEEEEE] bg-white shadow-2xl lg:hidden"
                        >
                            {renderSidebarContent(mobileScrollRef, true)}
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}