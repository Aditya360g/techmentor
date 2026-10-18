
import { useMemo, useState } from "react";
import { Search, ClipboardList } from "lucide-react";

import { assignments } from "../../data/student/assignmentsData";
import AssignmentCard from "../../components/student/AssignmentCard";

export default function AssignmentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return assignments.filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const course = String(item.course || "").toLowerCase();

      const matchesQuery =
        title.includes(search) || course.includes(search);

      const matchesStatus =
        status === "All" || item.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="min-w-0 space-y-6">
      {/* Premium Search and Filter */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex min-w-0 flex-col gap-3 sm:flex-row">
          {/* Search Bar */}
          <label className="group flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition-all duration-200 focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10">
            <Search
              size={19}
              className="shrink-0 text-violet-600 transition-colors group-focus-within:text-violet-700"
            />

            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search assignments or courses..."
              aria-label="Search assignments or courses"
              autoComplete="off"
              className="h-full w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-sm font-medium !text-black caret-black outline-none placeholder:font-normal placeholder:!text-slate-500 focus:!text-black focus:border-0 focus:outline-none focus:ring-0"
              style={{
                color: "#000000",
                WebkitTextFillColor: "#000000",
                caretColor: "#000000",
                opacity: 1,
              }}
            />
          </label>

          {/* Status Dropdown */}
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
            aria-label="Filter assignments by status"
            className="h-12 w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium !text-black shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:w-48"
            style={{
              color: "#000000",
              backgroundColor: "#ffffff",
            }}
          >
            <option value="All" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
              All Statuses
            </option>
            <option value="Pending" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
              Pending
            </option>
            <option value="In Progress" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
              In Progress
            </option>
            <option value="Submitted" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
              Submitted
            </option>
          </select>
        </div>

        {/* Results Count */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <div className="flex items-center gap-2 text-sm text-slate-600">
            <ClipboardList size={17} className="text-violet-600" />
            <span>
              <span className="font-bold text-slate-900">
                {filtered.length}
              </span>{" "}
              {filtered.length === 1 ? "assignment" : "assignments"} found
            </span>
          </div>

          {(query || status !== "All") && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setStatus("All");
              }}
              className="rounded-lg px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50 focus:outline-none focus:ring-2 focus:ring-violet-500/30"
            >
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* Assignment Cards */}
      {filtered.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((assignment, index) => (
            <AssignmentCard
              key={assignment.id ?? index}
              assignment={assignment}
            />
          ))}
        </div>
      ) : (
        /* Empty Search Results */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50">
            <Search size={23} className="text-violet-600" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            No assignments found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Try a different assignment name, course name, or status.
          </p>

          <button
            type="button"
            onClick={() => {
              setQuery("");
              setStatus("All");
            }}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/20"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
