import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  CalendarDays,
  Clock3,
  MessageCircle,
  Search,
  Star,
  UserRoundCheck,
} from "lucide-react";

const assignmentData = [
  {
    id: 1,
    trainer: "Aman Sharma",
    technology: "Java + DSA",
    startDate: "01 Oct 2026",
    duration: "4 Months",
    students: 120,
    progress: 18,
    status: "Active",
  },
  {
    id: 2,
    trainer: "Priya Verma",
    technology: "Python",
    startDate: "05 Oct 2026",
    duration: "8 Weeks",
    students: 80,
    progress: 0,
    status: "Upcoming",
  },
  {
    id: 3,
    trainer: "Rahul Mehta",
    technology: "Full Stack",
    startDate: "12 Aug 2026",
    duration: "6 Weeks",
    students: 65,
    progress: 100,
    status: "Completed",
  },
];

const statusStyles = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Upcoming: "bg-blue-500/10 text-blue-400",
  Completed: "bg-slate-500/10 text-slate-400",
};

export default function CollegeAssignmentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const assignments = useMemo(() => {
    return assignmentData.filter((assignment) => {
      const searchMatch =
        assignment.trainer
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        assignment.technology
          .toLowerCase()
          .includes(query.toLowerCase());

      const statusMatch =
        status === "All" ||
        assignment.status === status;

      return searchMatch && statusMatch;
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
          Track current and completed trainer engagements.
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
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search trainer or technology..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>


        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300 outline-none"
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

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <UserRoundCheck size={21} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {assignment.trainer}
                  </h3>

                  <p className="mt-1 text-sm text-violet-400">
                    {assignment.technology}
                  </p>
                </div>

              </div>

              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[assignment.status]}`}>
                {assignment.status}
              </span>

            </div>


            <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">

              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                {assignment.startDate}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={15} />
                {assignment.duration}
              </span>

              <span>
                Students: {assignment.students}
              </span>

            </div>


            <div className="mt-6">

              <div className="flex items-center justify-between text-xs text-slate-600">
                <span>
                  Program Progress
                </span>

                <span>
                  {assignment.progress}%
                </span>
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


            <div className="mt-6 grid grid-cols-2 gap-3">

              <button
                type="button"
                className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white"
              >
                <MessageCircle size={16} />
                Contact
              </button>

              {assignment.status === "Completed" ? (
                <button
                  type="button"
                  className="flex items-center justify-center gap-2 rounded-xl bg-amber-500/10 py-3 text-sm font-medium text-amber-400"
                >
                  <Star size={16} />
                  Give Feedback
                </button>
              ) : (
                <button
                  type="button"
                  className="rounded-xl bg-violet-600 py-3 text-sm font-semibold hover:bg-violet-500"
                >
                  View Program
                </button>
              )}

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}
