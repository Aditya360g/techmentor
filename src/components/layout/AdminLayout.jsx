import { useState } from "react";
import {
  NavLink,
  Outlet,
  Link,
  useLocation,
} from "react-router";

import {
  BarChart3,
  Bell,
  Building2,
  CalendarDays,
  ClipboardList,
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquareText,
  UserRoundCheck,
  Users,
  X,
} from "lucide-react";

const navItems = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
    end: true,
  },
  {
    label: "Trainers",
    path: "/admin/trainers",
    icon: Users,
  },
  {
    label: "Colleges",
    path: "/admin/colleges",
    icon: Building2,
  },
  {
    label: "Requests",
    path: "/admin/requests",
    icon: ClipboardList,
  },
  {
    label: "Assignments",
    path: "/admin/assignments",
    icon: UserRoundCheck,
  },
  {
    label: "Demo Schedules",
    path: "/admin/demos",
    icon: CalendarDays,
  },
  {
    label: "Notifications",
    path: "/admin/notifications",
    icon: Bell,
  },
  {
    label: "Payments",
    path: "/admin/payments",
    icon: CreditCard,
  },
  {
    label: "Feedback",
    path: "/admin/feedback",
    icon: MessageSquareText,
  },
  {
    label: "Analytics",
    path: "/admin/analytics",
    icon: BarChart3,
  },
];

const titles = {
  "/admin": "Dashboard",
  "/admin/trainers": "Manage Trainers",
  "/admin/colleges": "Manage Colleges",
  "/admin/requests": "Trainer Requests",
  "/admin/assignments": "Trainer Assignments",
  "/admin/demos": "Demo Schedules",
  "/admin/notifications": "Notifications",
  "/admin/payments": "Payments",
  "/admin/feedback": "Feedback",
  "/admin/analytics": "Analytics",
};

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const pageTitle =
    titles[location.pathname] || "Admin Panel";

  const SidebarContent = () => (
    <>
      <div className="flex h-20 items-center border-b border-white/[0.07] px-6">
        <Link
          to="/"
          className="flex items-center gap-3"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 text-sm font-bold text-white shadow-[0_0_20px_rgba(139,92,246,0.25)]">
            CF
          </div>

          <div>
            <p className="font-bold text-white">
              CodeFaculty
            </p>

            <p className="text-[11px] text-violet-400">
              Admin Panel
            </p>
          </div>
        </Link>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-5">
        <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-600">
          Management
        </p>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-violet-500/10 text-violet-300 shadow-[inset_0_0_0_1px_rgba(139,92,246,0.16)]"
                      : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={
                        isActive
                          ? "text-violet-400"
                          : "text-slate-600 transition-colors group-hover:text-slate-300"
                      }
                    />

                    {item.label}
                  </>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      <div className="border-t border-white/[0.07] p-4">
        <Link
          to="/login"
          className="flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition-colors hover:bg-red-500/10 hover:text-red-400"
        >
          <LogOut size={18} />
          Logout
        </Link>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#08070f] text-white">

      {/* DESKTOP SIDEBAR */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col border-r border-white/[0.07] bg-[#0b0a12] lg:flex">
        <SidebarContent />
      </aside>


      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
        />
      )}


      {/* MOBILE SIDEBAR */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.07] bg-[#0b0a12] transition-transform duration-300 lg:hidden ${
          sidebarOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="absolute right-4 top-5 flex h-9 w-9 items-center justify-center rounded-xl bg-white/[0.05] text-slate-400"
        >
          <X size={18} />
        </button>

        <SidebarContent />
      </aside>


      {/* CONTENT */}
      <div className="lg:pl-[260px]">

        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-white/[0.07] bg-[#08070f]/85 px-5 backdrop-blur-xl md:px-8">

          <div className="flex items-center gap-4">

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 lg:hidden"
            >
              <Menu size={20} />
            </button>

            <div>
              <h1 className="text-lg font-semibold">
                {pageTitle}
              </h1>

              <p className="hidden text-xs text-slate-600 sm:block">
                Manage CodeFaculty operations
              </p>
            </div>

          </div>


          <div className="flex items-center gap-3">

            <Link
              to="/admin/notifications"
              className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] text-slate-400 transition-colors hover:text-white"
            >
              <Bell size={18} />

              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
            </Link>

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-3 py-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 text-xs font-bold">
                AD
              </div>

              <div className="hidden sm:block">
                <p className="text-xs font-semibold">
                  Admin
                </p>

                <p className="text-[10px] text-slate-600">
                  Administrator
                </p>
              </div>
            </div>

          </div>
        </header>


        <main className="p-5 md:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
