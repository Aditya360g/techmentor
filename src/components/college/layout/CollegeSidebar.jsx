import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import {
    LayoutDashboard,
    Users,
    GraduationCap,
    BookOpen,
    ClipboardList,
    CalendarDays,
    BarChart3,
    CreditCard,
    Bell,
    Settings,
    X,
    Building2,
    Headset,
    FileText,
    UserRoundCheck,
    BriefcaseBusiness,
    LogOut,
    MessageSquareText,
    UserRound,
    Layers3,
    TrendingUp,
    Video,
    ClipboardCheck,
    Megaphone,
    LifeBuoy,
    UsersRound,
    ChevronRight,
    BarChart2,
    ContactRound,
} from "lucide-react";

/* =====================================================
   ALL COLLEGE PAGES
   Every item below matches a route in AppRoutes.jsx.
===================================================== */

const navigationGroups = [
    {
        title: "OVERVIEW",
        items: [
            {
                label: "Dashboard",
                path: "/college",
                icon: LayoutDashboard,
                end: true,
            },
            {
                label: "Analytics",
                path: "/college/analytics",
                icon: BarChart3,
            },
            {
                label: "Reports",
                path: "/college/reports",
                icon: FileText,
            },
        ],
    },

    {
        title: "INSTITUTION",
        items: [
            {
                label: "College Profile",
                path: "/college/profile",
                icon: Building2,
            },
            {
                label: "Team & Permissions",
                path: "/college/team",
                icon: UsersRound,
            },
            {
                label: "Announcements",
                path: "/college/announcements",
                icon: Megaphone,
            },
            {
                label: "Support",
                path: "/college/support",
                icon: LifeBuoy,
            },
        ],
    },

    {
        title: "STUDENT MANAGEMENT",
        items: [
            {
                label: "Students",
                path: "/college/students",
                icon: Users,
            },
            {
                label: "Batches & Departments",
                path: "/college/batches",
                icon: Layers3,
            },
            {
                label: "Student Progress",
                path: "/college/student-progress",
                icon: TrendingUp,
            },
            {
                label: "Attendance",
                path: "/college/attendance",
                icon: ClipboardCheck,
            },
        ],
    },

    {
        title: "TRAINER MANAGEMENT",
        items: [
            {
                label: "Find Trainers",
                path: "/college/trainers",
                icon: GraduationCap,
            },
            {
                label: "Trainer Requests",
                path: "/college/trainer-requests",
                icon: UserRoundCheck,
                badge: "3",
            },
            {
                label: "Requests",
                path: "/college/requests",
                icon: ContactRound,
            },
        ],
    },

    {
        title: "ACADEMIC MANAGEMENT",
        items: [
            {
                label: "Programs & Courses",
                path: "/college/programs",
                icon: BookOpen,
            },
            {
                label: "Assignments",
                path: "/college/assignments",
                icon: ClipboardList,
            },
            {
                label: "Assignments & Tests",
                path: "/college/assignments-tests",
                icon: ClipboardCheck,
            },
            {
                label: "Class Schedule",
                path: "/college/class-schedule",
                icon: CalendarDays,
            },
            {
                label: "Live Classes",
                path: "/college/live-classes",
                icon: Video,
            },
        ],
    },

    {
        title: "COLLABORATION",
        items: [
            {
                label: "Demo Sessions",
                path: "/college/demo-schedule",
                icon: Headset,
            },
            {
                label: "Placements",
                path: "/college/placements",
                icon: BriefcaseBusiness,
            },
            {
                label: "Feedback & Reviews",
                path: "/college/feedback",
                icon: MessageSquareText,
            },
        ],
    },

    {
        title: "FINANCE & UPDATES",
        items: [
            {
                label: "Payments",
                path: "/college/payments",
                icon: CreditCard,
            },
            {
                label: "Notifications",
                path: "/college/notifications",
                icon: Bell,
                badge: "5",
            },
        ],
    },
];

/* =====================================================
   BRAND
===================================================== */

function Brand({ onClick }) {
    return (
        <NavLink
            to="/college"
            onClick={onClick}
            title="Go to College Dashboard"
            aria-label="CodeFaculty College Dashboard"
            className="flex min-w-0 items-center gap-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
        >
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-[14px] bg-gradient-to-br from-sky-300 to-blue-500 text-[#07111f] shadow-lg shadow-sky-500/15">
                <Building2 size={21} strokeWidth={2.4} />

                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-[#0b1220] bg-emerald-400" />
            </div>

            <div className="min-w-0">
                <p className="truncate text-[16px] font-extrabold tracking-tight text-white">
                    CodeFaculty
                </p>

                <p className="mt-0.5 text-[10px] font-semibold tracking-[0.16em] text-sky-300">
                    COLLEGE PORTAL
                </p>
            </div>
        </NavLink>
    );
}

/* =====================================================
   NAVIGATION
===================================================== */

function SidebarNavigation({ onNavigate }) {
    const location = useLocation();

    const isActive = (item) => {
        if (item.end) {
            return location.pathname === item.path;
        }

        return (
            location.pathname === item.path ||
            location.pathname.startsWith(`${item.path}/`)
        );
    };

    return (
        <div className="flex flex-col gap-5 pb-4">
            {navigationGroups.map((group) => (
                <section key={group.title}>
                    <p className="mb-2.5 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-500">
                        {group.title}
                    </p>

                    <div className="space-y-1">
                        {group.items.map((item) => {
                            const Icon = item.icon;
                            const active = isActive(item);

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.end}
                                    onClick={onNavigate}
                                    className={[
                                        "group relative flex min-h-[44px] min-w-0 items-center gap-3 rounded-xl px-3 py-2.5",
                                        "outline-none transition-colors duration-200",
                                        "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400",
                                        active
                                            ? "bg-sky-400/10 text-sky-300 ring-1 ring-inset ring-sky-400/20"
                                            : "text-slate-400 hover:bg-white/[0.045] hover:text-slate-100",
                                    ].join(" ")}
                                >
                                    {active && (
                                        <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-sky-400" />
                                    )}

                                    <span
                                        className={[
                                            "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                                            active
                                                ? "bg-sky-400/15 text-sky-300"
                                                : "text-slate-400 group-hover:bg-white/[0.06] group-hover:text-white",
                                        ].join(" ")}
                                    >
                                        <Icon
                                            size={18}
                                            strokeWidth={active ? 2.2 : 1.8}
                                        />
                                    </span>

                                    <span className="min-w-0 flex-1 truncate text-[13px] font-medium">
                                        {item.label}
                                    </span>

                                    {item.badge && (
                                        <span
                                            className={[
                                                "flex h-5 min-w-5 shrink-0 items-center justify-center rounded-md px-1.5 text-[10px] font-bold",
                                                active
                                                    ? "bg-sky-300/15 text-sky-200"
                                                    : "bg-slate-800 text-slate-400 group-hover:bg-slate-700",
                                            ].join(" ")}
                                        >
                                            {item.badge}
                                        </span>
                                    )}

                                    {active && (
                                        <ChevronRight
                                            size={14}
                                            className="shrink-0 text-sky-300/70"
                                        />
                                    )}
                                </NavLink>
                            );
                        })}
                    </div>
                </section>
            ))}
        </div>
    );
}

/* =====================================================
   SIDEBAR
===================================================== */

export default function CollegeSidebar({
    mobileOpen,
    setMobileOpen,
    onLogout,
}) {
    const navigate = useNavigate();

    const [internalMobileOpen, setInternalMobileOpen] = useState(false);

    const isMobileOpen = mobileOpen ?? internalMobileOpen;

    const closeMobile = () => {
        setMobileOpen?.(false);
        setInternalMobileOpen(false);
    };

    const handleLogout = async () => {
        closeMobile();

        if (onLogout) {
            await onLogout();
        } else {
            navigate("/login");
        }
    };

    /*
     * Do not preventDefault here.
     * Native overflow scrolling must continue to work.
     * data-lenis-prevent below prevents Lenis from taking
     * over the wheel while the cursor is over the sidebar.
     */
    const handleNavigationWheel = (event) => {
        event.stopPropagation();
    };

    const navigationClass = [
        "min-h-0 flex-1 overflow-x-hidden overflow-y-auto",
        "overscroll-y-contain scroll-smooth px-3 py-5",
        "[scrollbar-width:thin]",
        "[scrollbar-color:#334155_transparent]",
        "[&::-webkit-scrollbar]:w-[5px]",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:bg-slate-600",
        "hover:[&::-webkit-scrollbar-thumb]:bg-sky-400",
    ].join(" ");

    const logoutButton = () => (
        <button
            type="button"
            onClick={handleLogout}
            className="group flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
        >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 group-hover:bg-rose-500/10 group-hover:text-rose-300">
                <LogOut size={18} />
            </span>

            <span className="flex-1 text-left text-[13px] font-medium">
                Logout
            </span>
        </button>
    );

    return (
        <>
            {/* DESKTOP SIDEBAR */}

            <aside className="fixed inset-y-0 left-0 z-50 hidden h-screen w-[272px] flex-col border-r border-white/[0.07] bg-[#0b1220] text-white md:flex">
                <div className="flex h-[76px] shrink-0 items-center border-b border-white/[0.07] px-5">
                    <Brand />
                </div>

                <nav
                    aria-label="College navigation"
                    tabIndex={0}
                    data-lenis-prevent
                    onWheel={handleNavigationWheel}
                    className={navigationClass}
                    style={{
                        overscrollBehaviorY: "contain",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    <SidebarNavigation />
                </nav>

                <div className="shrink-0 border-t border-white/[0.07] bg-[#0b1220] p-3">
                    {logoutButton()}
                </div>
            </aside>

            {/* MOBILE SIDEBAR */}

            {isMobileOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close navigation overlay"
                        onClick={closeMobile}
                        className="fixed inset-0 z-[60] bg-slate-950/65 backdrop-blur-[2px] md:hidden"
                    />

                    <aside className="fixed inset-y-0 left-0 z-[70] flex h-screen w-[288px] max-w-[88vw] flex-col border-r border-white/[0.08] bg-[#0b1220] text-white shadow-2xl md:hidden">
                        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
                            <Brand onClick={closeMobile} />

                            <button
                                type="button"
                                onClick={closeMobile}
                                aria-label="Close sidebar"
                                title="Close sidebar"
                                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <nav
                            aria-label="Mobile college navigation"
                            tabIndex={0}
                            data-lenis-prevent
                            onWheel={handleNavigationWheel}
                            className={navigationClass}
                            style={{
                                overscrollBehaviorY: "contain",
                                WebkitOverflowScrolling: "touch",
                            }}
                        >
                            <SidebarNavigation onNavigate={closeMobile} />
                        </nav>

                        <div className="shrink-0 border-t border-white/[0.07] bg-[#0b1220] p-3">
                            {logoutButton()}
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}