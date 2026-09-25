import {
  Award,
  Bell,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileCheck2,
  GraduationCap,
  Headphones,
  LayoutDashboard,
  Library,
  LogOut,
  Settings,
  UserRound,
} from "lucide-react";

import {
  NavLink,
  Link,
} from "react-router";

const links = [
  {
    label: "Dashboard",
    path: "/student",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "My Courses",
    path: "/student/courses",
    icon: BookOpen,
  },
  {
    label: "Live Classes",
    path: "/student/live-classes",
    icon: GraduationCap,
  },
  {
    label: "Schedule",
    path: "/student/schedule",
    icon: CalendarDays,
  },
  {
    label: "Assignments",
    path: "/student/assignments",
    icon: ClipboardCheck,
  },
  {
    label: "Coding Tests",
    path: "/student/tests",
    icon: FileCheck2,
  },
  {
    label: "Progress",
    path: "/student/progress",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Results",
    path: "/student/results",
    icon: FileCheck2,
  },
  {
    label: "Certificates",
    path: "/student/certificates",
    icon: Award,
  },
  {
    label: "Notifications",
    path: "/student/notifications",
    icon: Bell,
  },
  {
    label: "Resources",
    path: "/student/resources",
    icon: Library,
  },
  {
    label: "Profile",
    path: "/student/profile",
    icon: UserRound,
  },
  {
    label: "Support",
    path: "/student/support",
    icon: Headphones,
  },
  {
    label: "Settings",
    path: "/student/settings",
    icon: Settings,
  },
];

export default function StudentSidebar({
  onNavigate,
}) {
  return (
    <div className="flex h-full flex-col bg-white">

      <div className="flex h-20 items-center border-b border-slate-100 px-6">

        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-lg shadow-violet-200">
            CF
          </div>

          <div>
            <p className="font-bold text-slate-900">
              CodeFaculty
            </p>

            <p className="text-[11px] font-medium text-violet-600">
              Student Portal
            </p>
          </div>
        </Link>

      </div>


      <div className="flex-1 overflow-y-auto px-3 py-5">

        <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
          Learning
        </p>

        <nav className="space-y-1">

          {links.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={onNavigate}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    isActive
                      ? "bg-violet-50 text-violet-700"
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon size={18} />
                {item.label}
              </NavLink>
            );
          })}

        </nav>

      </div>


      <div className="border-t border-slate-100 p-4">

        <Link
          to="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-red-50 hover:text-red-600"
        >
          <LogOut size={18} />
          Logout
        </Link>

      </div>

    </div>
  );
}
