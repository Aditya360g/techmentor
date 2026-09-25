import { useState } from "react";
import { Outlet } from "react-router";

import StudentSidebar from "../student/StudentSidebar";
import StudentTopbar from "../student/StudentTopbar";

export default function StudentLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#f7f8fc] text-slate-900">

      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] border-r border-slate-200 lg:block">
        <StudentSidebar />
      </aside>


      {open && (
        <button
          type="button"
          aria-label="Close student menu"
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/30 backdrop-blur-sm lg:hidden"
        />
      )}


      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[280px] border-r border-slate-200 bg-white transition-transform duration-300 lg:hidden ${
          open
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        <StudentSidebar
          onNavigate={() => setOpen(false)}
        />
      </aside>


      <div className="lg:pl-[260px]">

        <StudentTopbar
          onMenuClick={() => setOpen(true)}
        />

        <main className="p-5 md:p-8">
          <Outlet />
        </main>

      </div>

    </div>
  );
}
