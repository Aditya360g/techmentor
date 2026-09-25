import {
  Bell,
  Menu,
  Search,
} from "lucide-react";

import {
  Link,
  useLocation,
} from "react-router";

const titles = {
  "/student": "Student Dashboard",
  "/student/profile": "My Profile",
  "/student/courses": "My Courses",
  "/student/live-classes": "Live Classes",
  "/student/schedule": "Schedule",
  "/student/assignments": "Assignments",
  "/student/tests": "Coding Tests",
  "/student/progress": "My Progress",
  "/student/results": "Results",
  "/student/certificates": "Certificates",
  "/student/notifications": "Notifications",
  "/student/resources": "Resources",
  "/student/support": "Support",
  "/student/settings": "Settings",
};

export default function StudentTopbar({
  onMenuClick,
}) {
  const location = useLocation();

  let title = titles[location.pathname];

  if (!title) {
    if (
      location.pathname.startsWith(
        "/student/courses/"
      )
    ) {
      title = "Course Details";
    } else if (
      location.pathname.startsWith(
        "/student/assignments/"
      )
    ) {
      title = "Assignment Details";
    } else if (
      location.pathname.includes("/result")
    ) {
      title = "Test Result";
    } else if (
      location.pathname.startsWith(
        "/student/tests/"
      )
    ) {
      title = "Coding Test";
    } else {
      title = "Student Portal";
    }
  }

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b border-slate-100 bg-white/90 px-5 backdrop-blur-xl md:px-8">

      <div className="flex items-center gap-4">

        <button
          type="button"
          onClick={onMenuClick}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 text-slate-600 lg:hidden"
        >
          <Menu size={20} />
        </button>

        <div>
          <h1 className="text-lg font-bold text-slate-900">
            {title}
          </h1>

          <p className="hidden text-xs text-slate-400 sm:block">
            Continue learning and track your progress
          </p>
        </div>

      </div>


      <div className="flex items-center gap-3">

        <div className="hidden h-10 items-center gap-2 rounded-xl bg-slate-50 px-3 lg:flex">
          <Search
            size={16}
            className="text-slate-400"
          />

          <span className="text-xs text-slate-400">
            Search learning portal
          </span>
        </div>


        <Link
          to="/student/notifications"
          className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-500 transition-colors hover:text-violet-600"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-violet-600" />
        </Link>


        <Link
          to="/student/profile"
          className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-2 py-1.5"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-xs font-bold text-violet-700">
            AS
          </div>

          <div className="hidden pr-2 sm:block">
            <p className="text-xs font-semibold text-slate-800">
              Aditya Sharma
            </p>

            <p className="text-[10px] text-slate-400">
              Student
            </p>
          </div>
        </Link>

      </div>

    </header>
  );
}
