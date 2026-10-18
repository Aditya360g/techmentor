
import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  CheckCircle2,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Library,
  LogOut,
  Settings,
  UserRound,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import { NavLink, Link } from "react-router";

const links = [
  { label: "Dashboard", path: "/student", icon: LayoutDashboard, end: true },
  { label: "My Courses", path: "/student/courses", icon: BookOpen },
  { label: "Live Classes", path: "/student/live-classes", icon: GraduationCap },
  { label: "Schedule", path: "/student/schedule", icon: CalendarDays },
  { label: "Assignments", path: "/student/assignments", icon: ClipboardCheck },
  { label: "Coding Tests", path: "/student/tests", icon: FileCheck2 },
  { label: "Progress", path: "/student/progress", icon: ChartNoAxesCombined },
  { label: "Results", path: "/student/results", icon: CheckCircle2 },
  { label: "Certificates", path: "/student/certificates", icon: Award },
  { label: "Notifications", path: "/student/notifications", icon: Bell },
  { label: "Resources", path: "/student/resources", icon: Library },
  { label: "Profile", path: "/student/profile", icon: UserRound },
  { label: "Support", path: "/student/support", icon: Headphones },
  { label: "Settings", path: "/student/settings", icon: Settings },
];

export default function StudentSidebar({ onNavigate }) {
  return (
    <aside className="flex h-full min-h-0 w-full flex-col overflow-hidden border-r border-slate-200 bg-white text-slate-900">

      {/* Brand Header */}
      <div className="flex h-[68px] shrink-0 items-center border-b border-slate-100 px-4">
        <Link
          to="/"
          onClick={onNavigate}
          className="group flex min-w-0 items-center gap-3 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-violet-300"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-extrabold text-white shadow-sm shadow-violet-200 transition-transform group-hover:scale-105">
            CF
          </div>

          <div className="min-w-0">
            <p className="truncate text-base font-extrabold tracking-tight text-slate-950">
              CodeFaculty
            </p>
            <p className="mt-0.5 text-[10px] font-bold tracking-[0.14em] text-violet-600">
              STUDENT PORTAL
            </p>
          </div>
        </Link>
      </div>

      {/* Scrollable Navigation */}
      <div className="student-sidebar-scroll min-h-0 flex-1 overflow-x-hidden overflow-y-auto overscroll-y-contain px-3 py-3">
        <div className="mb-2 flex items-center justify-between px-2">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.13em] text-slate-400">
            Learning Menu
          </p>
          <Sparkles size={14} className="text-violet-400" />
        </div>

        <nav aria-label="Student navigation" className="space-y-1">
          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  [
                    "group relative flex min-w-0 items-center gap-3 rounded-xl px-3 py-2",
                    "text-sm font-semibold outline-none transition-all duration-150",
                    "focus-visible:ring-2 focus-visible:ring-violet-200",
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-600 hover:bg-violet-50 hover:text-violet-700",
                  ].join(" ")
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-violet-600" />
                    )}

                    <span
                      className={[
                        "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors",
                        isActive
                          ? "bg-white text-violet-700 shadow-sm"
                          : "text-slate-500 group-hover:bg-white group-hover:text-violet-600",
                      ].join(" ")}
                    >
                      <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
                    </span>

                    <span className="min-w-0 flex-1 truncate">
                      {item.label}
                    </span>

                    {isActive && (
                      <ChevronRight
                        size={15}
                        className="shrink-0 text-violet-500"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>


      </div>

      {/* Fixed Footer */}
      <div className="shrink-0 border-t border-slate-100 bg-white px-3 py-2">
        <Link
          to="/login"
          onClick={onNavigate}
          className="group flex w-full items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold text-slate-600 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-200"
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 group-hover:bg-white group-hover:text-red-600">
            <LogOut size={17} />
          </span>

          <span className="flex-1">Logout</span>

          <ChevronRight
            size={15}
            className="text-slate-300 group-hover:text-red-500"
          />
        </Link>

        <p className="mt-1 text-center text-[9px] font-medium tracking-wide text-slate-400">
          CODEFACULTY · STUDENT WORKSPACE
        </p>
      </div>

      {/* Visible Scrollbar */}
      <style>{`
  .student - sidebar - scroll {
  scrollbar - width: thin;
  scrollbar - color: #a78bfa #f1f5f9;
  -webkit - overflow - scrolling: touch;
  overscroll - behavior - y: contain;
}

        .student - sidebar - scroll:: -webkit - scrollbar {
  width: 7px;
}

        .student - sidebar - scroll:: -webkit - scrollbar - track {
  background: #f1f5f9;
  border - radius: 10px;
}

        .student - sidebar - scroll:: -webkit - scrollbar - thumb {
  background: #a78bfa;
  border: 1px solid #f1f5f9;
  border - radius: 10px;
}

        .student - sidebar - scroll:: -webkit - scrollbar - thumb:hover {
  background: #7c3aed;
}
`}</style>
    </aside>
  );
}
