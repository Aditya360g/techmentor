
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
} from "lucide-react";

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
        ],
    },
    {
        title: "ACADEMIC MANAGEMENT",
        items: [
            { label: "Students", path: "/college/students", icon: Users },
            { label: "Trainers", path: "/college/trainers", icon: GraduationCap },
            { label: "Programs & Courses", path: "/college/programs", icon: BookOpen },
            { label: "Assignments", path: "/college/assignments", icon: ClipboardList },
            { label: "Class Schedule", path: "/college/schedule", icon: CalendarDays },
        ],
    },
    {
        title: "COLLABORATION",
        items: [
            {
                label: "Trainer Requests",
                path: "/college/requests",
                icon: UserRoundCheck,
                badge: "3",
            },
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
        ],
    },
    {
        title: "ADMINISTRATION",
        items: [
            { label: "Payments", path: "/college/payments", icon: CreditCard },
            { label: "Reports", path: "/college/reports", icon: FileText },
            {
                label: "Notifications",
                path: "/college/notifications",
                icon: Bell,
                badge: "5",
            },
            { label: "Settings", path: "/college/settings", icon: Settings },
        ],
    },
];

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

export default function CollegeSidebar({
    mobileOpen = false,
    setMobileOpen,
    onLogout,
}) {
    const location = useLocation();
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

    const containWheel = (event) => {
        const element = event.currentTarget;

        if (element.scrollHeight > element.clientHeight) {
            event.stopPropagation();
        }
    };

    const renderNavigation = (isMobile = false) => (
        <div className="flex flex-col gap-6">
            {navigationGroups.map((group) => (
                <section key={group.title}>
                    <p className="mb-2.5 px-3 text-[10px] font-bold tracking-[0.18em] text-slate-500">
                        {group.title}
                    </p>

                    <div className="space-y-1">
                        {group.items.map((item) => {
                            const Icon = item.icon;

                            const active = item.end
                                ? location.pathname === item.path
                                : location.pathname === item.path ||
                                location.pathname.startsWith(`${item.path}/`);

                            return (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    end={item.end}
                                    onClick={isMobile ? closeMobile : undefined}
                                    className={[
                                        "group relative flex min-h-[44px] items-center gap-3 rounded-xl px-3 py-2.5",
                                        "outline-none transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-sky-400",
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
                                                "flex h-5 min-w-5 items-center justify-center rounded-md px-1.5 text-[10px] font-bold",
                                                active
                                                    ? "bg-sky-300/15 text-sky-200"
                                                    : "bg-slate-800 text-slate-400 group-hover:bg-slate-700",
                                            ].join(" ")}
                                        >
                                            {item.badge}
                                        </span>
                                    )}
                                </NavLink>
                            );
                        })}
                    </div >
                </section >
            ))}
        </div >
    );

    const navigationClass = [
        "min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain",
        "scroll-smooth px-3 py-5",
        "[scrollbar-color:#334155_transparent] [scrollbar-width:thin]",
        "[&::-webkit-scrollbar]:w-1",
        "[&::-webkit-scrollbar-thumb]:rounded-full",
        "[&::-webkit-scrollbar-thumb]:bg-slate-600",
        "hover:[&::-webkit-scrollbar-thumb]:bg-sky-400",
    ].join(" ");

    const logoutButton = (isMobile = false) => (
        <button
            type="button"
            onClick={handleLogout}
            className="group flex min-h-[44px] w-full items-center gap-3 rounded-xl px-3 py-2.5 text-slate-400 transition-colors hover:bg-rose-500/10 hover:text-rose-300"
        >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-400 group-hover:bg-rose-500/10 group-hover:text-rose-300">
                <LogOut size={18} />
            </span>
            <span className="text-[13px] font-medium">Logout</span>
        </button>
    );

    return (
        <>
            {/* Desktop Sidebar - fixed width, no collapse button */}
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-[272px] flex-col border-r border-white/[0.07] bg-[#0b1220] text-white md:flex">
                <div className="flex h-[76px] shrink-0 items-center border-b border-white/[0.07] px-5">
                    <Brand />
                </div>

                <nav
                    aria-label="College navigation"
                    onWheel={containWheel}
                    className={navigationClass}
                >
                    {renderNavigation()}
                </nav>

                <div className="shrink-0 border-t border-white/[0.07] p-3">
                    {logoutButton()}
                </div>
            </aside>

            {/* Mobile Sidebar - no open/close animation */}
            {isMobileOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Close navigation overlay"
                        onClick={closeMobile}
                        className="fixed inset-0 z-[60] bg-slate-950/65 backdrop-blur-[2px] md:hidden"
                    />

                    <aside className="fixed inset-y-0 left-0 z-[70] flex w-[288px] max-w-[88vw] flex-col border-r border-white/[0.08] bg-[#0b1220] text-white shadow-2xl md:hidden">
                        <div className="flex h-[76px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
                            <Brand onClick={closeMobile} />

                            <button
                                type="button"
                                onClick={closeMobile}
                                aria-label="Close sidebar"
                                title="Close sidebar"
                                className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/[0.07] hover:text-white"
                            >
                                <X size={19} />
                            </button>
                        </div>

                        <nav
                            aria-label="Mobile college navigation"
                            onWheel={containWheel}
                            className={navigationClass}
                        >
                            {renderNavigation(true)}
                        </nav>

                        <div className="shrink-0 border-t border-white/[0.07] p-3">
                            {logoutButton(true)}
                        </div>
                    </aside>
                </>
            )}
        </>
    );
}
