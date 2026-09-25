import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  Video,
} from "lucide-react";

const initialSessions = [
  {
    id: 1,
    college: "RKGIT",
    topic: "Binary Search & Problems",
    date: "2026-09-25",
    time: "10:30",
    mode: "On Campus",
    status: "Upcoming",
  },
  {
    id: 2,
    college: "XYZ College",
    topic: "Spring Boot REST APIs",
    date: "2026-09-25",
    time: "15:00",
    mode: "Google Meet",
    status: "Upcoming",
  },
  {
    id: 3,
    college: "RKGIT",
    topic: "Trees & Traversals",
    date: "2026-09-26",
    time: "11:00",
    mode: "On Campus",
    status: "Scheduled",
  },
  {
    id: 4,
    college: "Global University",
    topic: "Java Collections",
    date: "2026-09-20",
    time: "12:00",
    mode: "Online",
    status: "Completed",
  },
];

const statusStyles = {
  Upcoming: "bg-blue-500/10 text-blue-400",
  Scheduled: "bg-violet-500/10 text-violet-400",
  Completed: "bg-emerald-500/10 text-emerald-400",
};

export default function TrainerSchedulePage() {
  const [sessions, setSessions] =
    useState(initialSessions);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filtered = useMemo(() => {
    return sessions.filter((session) => {
      const matchesSearch =
        session.college
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        session.topic
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesStatus =
        status === "All" ||
        session.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [sessions, query, status]);

  const markCompleted = (id) => {
    setSessions((current) =>
      current.map((session) =>
        session.id === id
          ? {
              ...session,
              status: "Completed",
            }
          : session
      )
    );
  };

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">
          Training Schedule
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          View and manage upcoming training sessions.
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
            placeholder="Search college or topic..."
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
          <option>Upcoming</option>
          <option>Scheduled</option>
          <option>Completed</option>
        </select>

      </div>


      <div className="grid gap-4 xl:grid-cols-2">

        {filtered.map((session, index) => (
          <motion.article
            key={session.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
          >

            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="font-semibold">
                  {session.topic}
                </h3>

                <p className="mt-1 text-sm text-violet-400">
                  {session.college}
                </p>
              </div>

              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[session.status]}`}>
                {session.status}
              </span>

            </div>


            <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-3">

              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                {session.date}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={15} />
                {session.time}
              </span>

              <span className="flex items-center gap-2">
                <Video size={15} />
                {session.mode}
              </span>

            </div>


            <div className="mt-5 flex gap-3">

              {session.mode !== "On Campus" &&
                session.status !== "Completed" && (
                  <button
                    type="button"
                    className="flex-1 rounded-xl bg-violet-600 py-3 text-sm font-semibold hover:bg-violet-500"
                  >
                    Join Session
                  </button>
                )}


              {session.status !== "Completed" ? (
                <button
                  type="button"
                  onClick={() =>
                    markCompleted(session.id)
                  }
                  className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white"
                >
                  <CheckCircle2 size={16} />
                  Mark Complete
                </button>
              ) : (
                <div className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-emerald-500/10 py-3 text-sm text-emerald-400">
                  <CheckCircle2 size={16} />
                  Completed
                </div>
              )}

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}
