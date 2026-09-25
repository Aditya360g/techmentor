import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  Users,
} from "lucide-react";

const assignmentData = [
  {
    id: 1,
    college: "RKGIT",
    technology: "Java + DSA",
    students: 120,
    startDate: "01 Sep 2026",
    duration: "4 Months",
    progress: 34,
    status: "Active",
  },
  {
    id: 2,
    college: "XYZ College",
    technology: "Spring Boot",
    students: 80,
    startDate: "18 Aug 2026",
    duration: "8 Weeks",
    progress: 62,
    status: "Active",
  },
  {
    id: 3,
    college: "Global University",
    technology: "Core Java",
    students: 95,
    startDate: "05 Jul 2026",
    duration: "6 Weeks",
    progress: 100,
    status: "Completed",
  },
  {
    id: 4,
    college: "Tech Institute",
    technology: "DSA Placement",
    students: 70,
    startDate: "05 Oct 2026",
    duration: "6 Weeks",
    progress: 0,
    status: "Upcoming",
  },
];

const statusStyles = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Completed: "bg-blue-500/10 text-blue-400",
  Upcoming: "bg-amber-500/10 text-amber-400",
};

export default function TrainerAssignmentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const assignments = useMemo(() => {
    return assignmentData.filter((assignment) => {
      const matchesQuery =
        assignment.college
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        assignment.technology
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesStatus =
        status === "All" ||
        assignment.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">
          Trainer Assignments
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Track current, upcoming and completed training engagements.
        </p>
      </motion.div>


      <div className="flex flex-col gap-3 sm:flex-row">

        <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4">
          <Search
            size={17}
            className="text-slate-600"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search college or technology..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>


        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300"
        >
          <option>All</option>
          <option>Active</option>
          <option>Upcoming</option>
          <option>Completed</option>
        </select>

      </div>


      <div className="grid gap-5 xl:grid-cols-2">

        {assignments.map((assignment, index) => (
          <motion.article
            key={assignment.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-violet-500/30"
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="text-lg font-semibold">
                  {assignment.college}
                </h3>

                <p className="mt-1 text-sm text-violet-400">
                  {assignment.technology}
                </p>
              </div>

              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[assignment.status]}`}>
                {assignment.status}
              </span>

            </div>


            <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">

              <span className="flex items-center gap-2">
                <Building2 size={15} />
                Institution
              </span>

              <span className="flex items-center gap-2">
                <Users size={15} />
                {assignment.students} Students
              </span>

              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                {assignment.startDate}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={15} />
                {assignment.duration}
              </span>

            </div>


            <div className="mt-6">

              <div className="flex justify-between text-xs text-slate-600">
                <span>Program Progress</span>
                <span>{assignment.progress}%</span>
              </div>

              <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">

                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${assignment.progress}%`,
                  }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.05,
                  }}
                  className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                />

              </div>

            </div>


            <div className="mt-6 flex gap-3">

              <button
                type="button"
                className="flex-1 rounded-xl border border-white/[0.08] py-3 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white"
              >
                View Details
              </button>

              {assignment.status === "Completed" ? (
                <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-3 text-sm text-emerald-400">
                  <CheckCircle2 size={16} />
                  Completed
                </div>
              ) : (
                <button
                  type="button"
                  className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold hover:bg-violet-500"
                >
                  Open Program
                </button>
              )}

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}
