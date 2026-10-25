
import { useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router";
import {
    LayoutDashboard,
    UserRound,
    BookOpen,
    Video,
    Users,
    ClipboardList,
    CalendarDays,
    Bell,
    Wallet,
    GraduationCap,
    ChevronRight,
    CircleHelp,
    Settings,
    LogOut,
    X,
} from "lucide-react";

const NAVIGATION = [
    { label: "Dashboard", path: "/trainer", icon: LayoutDashboard, end: true },
    { label: "My Profile", path: "/trainer/profile", icon: UserRound },
    { label: "My Courses", path: "/trainer/courses", icon: BookOpen },
    { label: "Live Classes", path: "/trainer/live-classes", icon: Video },
    { label: "Student Progress", path: "/trainer/student-progress", icon: Users },
    { label: "Assignments", path: "/trainer/assignments", icon: ClipboardList },
    { label: "My Schedule", path: "/trainer/schedule", icon: CalendarDays },
    { label: "Availability", path: "/trainer/availability", icon: CalendarDays },
    { label: "Notifications", path: "/trainer/notifications", icon: Bell },
    { label: "Payments", path: "/trainer/payments", icon: Wallet },
    { label: "Help & Support", path: "/trainer/help", icon: CircleHelp },
    { label: "Settings", path: "/trainer/settings", icon: Settings },
];

function SidebarLink({ item, onNavigate }) {
    const Icon = item.icon;

    return (
        <NavLink
            to={item.path}
            end={item.end}
            onClick={onNavigate}
            className={({ isActive }) =>
                [
                    "group relative flex min-h-11 items-center gap-3 rounded-xl px-3 py-2.5",
                    "text-sm transition-colors duration-200",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500",
                    isActive
                        ? "bg-emerald-600 font-bold text-white shadow-md shadow-emerald-600/20"
                        : "font-medium text-slate-600 hover:bg-emerald-50 hover:text-emerald-800",
                ].join(" ")
            }
        >
            {({ isActive }) => (
                <>
                    <Icon
                        size={19}
                        strokeWidth={isActive ? 2.3 : 1.9}
                        className="shrink-0"
                    />

                    <span className="min-w-0 flex-1 truncate">{item.label}</span>

                    {isActive && (
                        <ChevronRight
                            size={16}
                            className="shrink-0 text-emerald-100"
                        />
                    )}
                </>
            )}
        </NavLink>
    );
}

function SidebarBrand({ onClose }) {
    const navigate = useNavigate();

    const goHome = () => {
        onClose?.();
        navigate("/");
    };

    return (
        <div className="flex h-[76px] shrink-0 items-center gap-3 border-b border-slate-100 px-5">
            <button
                type="button"
                onClick={goHome}
                aria-label="Go to TechMentor home page"
                className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500"
            >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-emerald-500 to-green-700 text-white shadow-lg shadow-emerald-600/20">
                    <GraduationCap size={25} strokeWidth={2.2} />
                </div>

                <div className="min-w-0 flex-1">
                    <h1 className="truncate text-xl font-extrabold tracking-tight text-slate-900">
                        TechMentor
                    </h1>
                    <p className="mt-0.5 text-xs font-medium text-slate-500">
                        Trainer Account
                    </p>
                </div>
            </button>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    aria-label="Close trainer sidebar"
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 lg:hidden"
                >
                    <X size={20} />
                </button>
            )}
        </div>
    );
}

export default function TrainerSidebar({ onNavigate, onLogout }) {
    const navigate = useNavigate();
    const scrollRef = useRef(null);

    // Smooth wheel scrolling for the sidebar menu only.
    useEffect(() => {
        const element = scrollRef.current;
        if (!element) return;

        let current = element.scrollTop;
        let target = element.scrollTop;
        let frame = null;

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        const animate = () => {
            const distance = target - current;

            if (Math.abs(distance) < 0.6) {
                current = target;
                element.scrollTop = target;
                frame = null;
                return;
            }

            current += distance * 0.18;
            element.scrollTop = current;
            frame = requestAnimationFrame(animate);
        };

        const onWheel = (event) => {
            if (event.ctrlKey || event.metaKey || !event.deltaY) return;

            const maxScroll = element.scrollHeight - element.clientHeight;
            if (maxScroll <= 1) return;

            const multiplier =
                event.deltaMode === 1
                    ? 16
                    : event.deltaMode === 2
                        ? element.clientHeight
                        : 1;

            const delta = event.deltaY * multiplier;

            // Let the page handle scrolling when the sidebar is at its edge.
            if (
                (delta < 0 && element.scrollTop <= 0) ||
                (delta > 0 && element.scrollTop >= maxScroll - 1)
            ) {
                return;
            }

            event.preventDefault();

            if (prefersReducedMotion) {
                element.scrollTop = Math.max(
                    0,
                    Math.min(maxScroll, element.scrollTop + delta)
                );
                current = target = element.scrollTop;
                return;
            }

            if (frame === null) {
                current = element.scrollTop;
                target = element.scrollTop;
            }

            target = Math.max(
                0,
                Math.min(maxScroll, target + delta * 1.05)
            );

            if (frame === null) {
                frame = requestAnimationFrame(animate);
            }
        };

        const syncScroll = () => {
            if (frame === null) {
                current = target = element.scrollTop;
            }
        };

        element.addEventListener("wheel", onWheel, { passive: false });
        element.addEventListener("scroll", syncScroll, { passive: true });

        return () => {
            element.removeEventListener("wheel", onWheel);
            element.removeEventListener("scroll", syncScroll);

            if (frame !== null) {
                cancelAnimationFrame(frame);
            }
        };
    }, []);

    const handleLogout = () => {
        onNavigate?.();

        if (onLogout) {
            onLogout();
        } else {
            navigate("/login");
        }
    };

    return (
        <aside
            aria-label="Trainer navigation"
            className="flex h-full min-h-0 flex-col overflow-hidden bg-white text-slate-800"
        >
            <SidebarBrand onClose={onNavigate} />

            {/* Smoothly scrolling navigation */}
            <div
                ref={scrollRef}
                data-wheel-scroll
                className="trainer-sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-contain px-4 py-5"
            >
                <p className="mb-3 px-3 text-[10px] font-extrabold uppercase tracking-[0.16em] text-slate-400">
                    Main Menu
                </p>

                <nav className="space-y-1" aria-label="Trainer menu">
                    {NAVIGATION.map((item) => (
                        <SidebarLink
                            key={item.path}
                            item={item}
                            onNavigate={onNavigate}
                        />
                    ))}
                </nav>
            </div>

            {/* Logout stays visible at the bottom */}
            <div className="shrink-0 border-t border-slate-100 bg-white p-4">
                <button
                    type="button"
                    onClick={handleLogout}
                    className="flex min-h-11 w-full items-center gap-3 rounded-xl border border-red-100 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:border-red-200 hover:bg-red-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                    <LogOut size={19} className="shrink-0" />
                    <span className="flex-1 text-left">Logout</span>
                </button>
            </div>

            <style>{`
    .trainer - sidebar - scroll {
    overscroll - behavior - y: contain;
    -webkit - overflow - scrolling: touch;
    scrollbar - width: thin;
    scrollbar - color: #10b981 #f1f5f9;
}

        .trainer - sidebar - scroll:: -webkit - scrollbar {
    width: 6px;
}

        .trainer - sidebar - scroll:: -webkit - scrollbar - track {
    background: #11e71c;
    border - radius: 10px;
}

        .trainer - sidebar - scroll:: -webkit - scrollbar - thumb {
    background: #0bf17e;
    border - radius: 10px;
}

        .trainer - sidebar - scroll:: -webkit - scrollbar - thumb:hover {
    background: #059669;
}
`}</style>
        </aside>
    );
}
