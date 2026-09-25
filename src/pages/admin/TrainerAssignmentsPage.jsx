import { useState } from "react";
import { motion } from "motion/react";

import {
  Building2,
  CalendarDays,
  CheckCircle2,
  Clock3,
  UserRoundCheck,
} from "lucide-react";

const initialAssignments = [
  {
    id: 1,
    trainer: "Aman Sharma",
    college: "RKGIT",
    technology: "Java + DSA",
    duration: "4 Months",
    startDate: "01 Oct 2026",
    status: "Active",
  },
  {
    id: 2,
    trainer: "Priya Verma",
    college: "XYZ College",
    technology: "Python AI/ML",
    duration: "8 Weeks",
    startDate: "05 Oct 2026",
    status: "Pending",
  },
  {
    id: 3,
    trainer: "Rahul Mehta",
    college: "Global University",
    technology: "Full Stack",
    duration: "Semester",
    startDate: "28 Sep 2026",
    status: "Active",
  },
];

const statusStyles = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Completed: "bg-blue-500/10 text-blue-400",
};

export default function TrainerAssignmentsPage() {
  const [assignments, setAssignments] =
    useState(initialAssignments);

  const activateAssignment = (id) => {
    setAssignments((current) =>
      current.map((assignment) =>
        assignment.id === id
          ? {
              ...assignment,
              status: "Active",
            }
          : assignment
      )
    );
  };

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          

          

          
        </div>

        <button
          type="button"
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition-colors hover:bg-violet-500"
        >
          + New Assignment
        </button>
      </motion.div>


      <div className="grid gap-4 xl:grid-cols-2">

        {assignments.map((assignment, index) => (
          <motion.article
            key={assignment.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
          >

            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <UserRoundCheck size={21} />
                </div>

                <div>
                  <p className="font-semibold">
                    {assignment.trainer}
                  </p>

                  <p className="mt-1 text-sm text-violet-400">
                    {assignment.technology}
                  </p>
                </div>

              </div>

              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[assignment.status]}`}>
                {assignment.status}
              </span>

            </div>


            <div className="mt-5 grid gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4 text-sm text-slate-500 sm:grid-cols-2">

              <div className="flex items-center gap-2">
                <Building2 size={15} />
                {assignment.college}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={15} />
                {assignment.duration}
              </div>

              <div className="flex items-center gap-2">
                <CalendarDays size={15} />
                Start: {assignment.startDate}
              </div>

            </div>


            <div className="mt-5 flex gap-3">

              <button
                type="button"
                className="flex-1 rounded-xl border border-white/[0.08] py-3 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                View Details
              </button>

              {assignment.status === "Pending" ? (
                <button
                  type="button"
                  onClick={() =>
                    activateAssignment(assignment.id)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold transition-colors hover:bg-violet-500"
                >
                  <CheckCircle2 size={16} />
                  Activate
                </button>
              ) : (
                <button
                  type="button"
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-3 text-sm font-medium text-emerald-400"
                >
                  <CheckCircle2 size={16} />
                  Active
                </button>
              )}

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}

