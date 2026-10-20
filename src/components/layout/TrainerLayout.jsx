
import { useState } from "react";
import { Outlet } from "react-router";

import TrainerSidebar from "../trainer/TrainerSidebar";
import TrainerTopbar from "../trainer/TrainerTopbar";

export default function TrainerLayout() {
  const [open, setOpen] = useState(false);

  const openSidebar = () => setOpen(true);
  const closeSidebar = () => setOpen(false);

  return (
    <div className="trainer-theme min-h-screen bg-[#080d19] text-slate-100">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[270px] flex-col border-r border-white/[0.07] bg-[#0b1220] lg:flex">
        <TrainerSidebar />
      </aside>

      {/* Mobile Overlay */}
      {open && (
        <button
          type="button"
          aria-label="Close trainer navigation"
          onClick={closeSidebar}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* Mobile Sidebar */}
      <aside
        id="trainer-mobile-sidebar"
        className={[
          "fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col",
          "border-r border-white/[0.07] bg-[#0b1220] shadow-2xl",
          "transition-transform duration-300 ease-in-out lg:hidden",
          open ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-hidden={!open}
        inert={!open}
      >
        {/* Sidebar ke andar close button TrainerSidebar handle karega */}
        <TrainerSidebar onNavigate={closeSidebar} />
      </aside>

      {/* Main Content */}
      <div className="min-h-screen lg:pl-[270px]">
        {/* Trainer Topbar: Search, Notifications, Profile & Mobile Menu */}
        <TrainerTopbar onMenuClick={openSidebar} />

        {/* Page Outlet */}
        <main className="trainer-content relative min-h-[calc(100vh-76px)] overflow-hidden bg-gradient-to-br from-[#080d19] via-[#0d1425] to-[#11152b] p-4 sm:p-6 lg:p-8">
          {/* Background Decoration */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-emerald-500/[0.12] blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-teal-500/[0.10] blur-3xl"
          />

          <div className="relative z-10 mx-auto w-full max-w-[1600px]">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
