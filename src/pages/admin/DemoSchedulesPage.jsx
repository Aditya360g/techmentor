import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  CalendarDays,
  Clock3,
  Search,
  Video,
} from "lucide-react";

const demoData = [
  {
    id: 1,
    trainer: "Aman Sharma",
    college: "RKGIT",
    technology: "Java + DSA",
    date: "25 Sep 2026",
    time: "10:30 AM",
    mode: "Google Meet",
    status: "Upcoming",
  },
  {
    id: 2,
    trainer: "Priya Verma",
    college: "XYZ College",
    technology: "Python AI/ML",
    date: "25 Sep 2026",
    time: "02:00 PM",
    mode: "Online",
    status: "Upcoming",
  },
  {
    id: 3,
    trainer: "Rahul Mehta",
    college: "Global University",
    technology: "Full Stack",
    date: "24 Sep 2026",
    time: "11:00 AM",
    mode: "On Campus",
    status: "Completed",
  },
  {
    id: 4,
    trainer: "Neha Singh",
    college: "Tech Institute",
    technology: "Python",
    date: "27 Sep 2026",
    time: "03:30 PM",
    mode: "Google Meet",
    status: "Pending",
  },
];

const statusStyles = {
  Upcoming: "bg-blue-500/10 text-blue-400",
  Completed: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
};

export default function DemoSchedulesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const demos = useMemo(() => {
    return demoData.filter((demo) => {
      const matchesQuery =
        demo.trainer.toLowerCase().includes(query.toLowerCase()) ||
        demo.college.toLowerCase().includes(query.toLowerCase()) ||
        demo.technology.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        status === "All" || demo.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        

        

        
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
            placeholder="Search trainer, college or technology..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300 outline-none"
        >
          <option>All</option>
          <option>Upcoming</option>
          <option>Pending</option>
          <option>Completed</option>
        </select>

      </div>


      <div className="grid gap-4 xl:grid-cols-2">

        {demos.map((demo, index) => (
          <motion.article
            key={demo.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">

              <div>
                <p className="text-lg font-semibold">
                  {demo.trainer}
                </p>

                <p className="mt-1 text-sm text-violet-400">
                  {demo.technology}
                </p>
              </div>

              <span className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyles[demo.status]}`}>
                {demo.status}
              </span>

            </div>


            <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-2">

              <div className="flex items-center gap-2">
                <CalendarDays size={16} />
                {demo.date}
              </div>

              <div className="flex items-center gap-2">
                <Clock3 size={16} />
                {demo.time}
              </div>

              <div className="flex items-center gap-2">
                <Video size={16} />
                {demo.mode}
              </div>

              <div>
                College: {demo.college}
              </div>

            </div>


            <div className="mt-5 flex gap-3">

              <button
                type="button"
                className="flex-1 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition-colors hover:bg-violet-500"
              >
                View Details
              </button>

              {demo.status === "Upcoming" && (
                <button
                  type="button"
                  className="rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  Join
                </button>
              )}

            </div>

          </motion.article>
        ))}

      </div>


      {demos.length === 0 && (
        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-10 text-center text-sm text-slate-600">
          No demo schedules found.
        </div>
      )}

    </div>
  );
}

