import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import {
  Bell,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  LayoutDashboard,
  Menu,
  User,
  X,
  Clock3,
} from "lucide-react";

const links = [
  {
    name: "Dashboard",
    path: "/trainer",
    icon: LayoutDashboard,
    end: true,
  },
  {
    name: "Profile",
    path: "/trainer/profile",
    icon: User,
  },
  {
    name: "Availability",
    path: "/trainer/availability",
    icon: Clock3,
  },
  {
    name: "Assignments",
    path: "/trainer/assignments",
    icon: ClipboardCheck,
  },
  {
    name: "Schedule",
    path: "/trainer/schedule",
    icon: CalendarDays,
  },
  {
    name: "Notifications",
    path: "/trainer/notifications",
    icon: Bell,
  },
  {
    name: "Payments",
    path: "/trainer/payments",
    icon: CreditCard,
  },
];

export default function TrainerLayout() {
  const [open, setOpen] = useState(false);

  const Sidebar = () => (
    <>
      <div className="flex h-20 items-center border-b border-white/[0.07] px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold text-white">
            CF
          </div>

          <div>
            <p className="font-bold text-white">
              CodeFaculty
            </p>

            <p className="text-[11px] text-violet-400">
              Trainer Panel
            </p>
          </div>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-4">
        {links.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-violet-500/10 text-violet-300"
                    : "text-slate-500 hover:bg-white/[0.04] hover:text-white"
                }`
              }
            >
              <Icon size={18} />
              {item.name}
            </NavLink>
          );
        })}
      </nav>
    </>
  );

  return (
    <div className="min-h-screen bg-[#08070f] text-white">

      <aside className="fixed inset-y-0 left-0 hidden w-[260px] flex-col border-r border-white/[0.07] bg-[#0b0a12] lg:flex">
        <Sidebar />
      </aside>

      {open && (
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.07] bg-[#0b0a12] transition-transform duration-300 lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="absolute right-4 top-5 text-slate-400"
        >
          <X size={22} />
        </button>

        <Sidebar />
      </aside>

      <div className="lg:pl-[260px]">

        <header className="sticky top-0 z-30 flex h-20 items-center border-b border-white/[0.07] bg-[#08070f]/90 px-5 backdrop-blur-xl lg:px-8">

          <button
            type="button"
            onClick={() => setOpen(true)}
            className="mr-4 text-white lg:hidden"
          >
            <Menu size={22} />
          </button>

          <div>
            <p className="font-semibold">
              Trainer Dashboard
            </p>

            <p className="text-xs text-slate-600">
              Manage your training activity
            </p>
          </div>

        </header>

        <main className="p-5 md:p-8">
          <Outlet />
        </main>

      </div>
    </div>
  );
}
