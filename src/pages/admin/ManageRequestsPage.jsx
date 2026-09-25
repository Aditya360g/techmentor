import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  CheckCircle2,
  Clock3,
  Search,
  Users,
} from "lucide-react";

const initialRequests = [
  {
    id: "REQ-1001",
    college: "RKGIT",
    technology: "Java + DSA",
    students: 120,
    duration: "4 Months",
    mode: "On Campus",
    status: "New",
  },
  {
    id: "REQ-1002",
    college: "XYZ College",
    technology: "Python",
    students: 90,
    duration: "8 Weeks",
    mode: "Hybrid",
    status: "Shortlisting",
  },
  {
    id: "REQ-1003",
    college: "Global University",
    technology: "Full Stack",
    students: 75,
    duration: "Semester",
    mode: "On Campus",
    status: "Demo",
  },
  {
    id: "REQ-1004",
    college: "Tech Institute",
    technology: "AI / ML",
    students: 60,
    duration: "6 Weeks",
    mode: "Online",
    status: "Assigned",
  },
];

const statusStyles = {
  New: "bg-blue-500/10 text-blue-400",
  Shortlisting: "bg-amber-500/10 text-amber-400",
  Demo: "bg-violet-500/10 text-violet-400",
  Assigned: "bg-emerald-500/10 text-emerald-400",
};

const nextStatus = {
  New: "Shortlisting",
  Shortlisting: "Demo",
  Demo: "Assigned",
  Assigned: "Assigned",
};

export default function ManageRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filteredRequests = useMemo(() => {
    return requests.filter((request) => {
      const matchesQuery =
        request.college.toLowerCase().includes(query.toLowerCase()) ||
        request.technology.toLowerCase().includes(query.toLowerCase()) ||
        request.id.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        status === "All" || request.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [requests, query, status]);

  const advanceRequest = (id) => {
    setRequests((current) =>
      current.map((request) =>
        request.id === id
          ? {
              ...request,
              status: nextStatus[request.status],
            }
          : request
      )
    );
  };

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
            placeholder="Search request, college or technology..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300 outline-none"
        >
          <option>All</option>
          <option>New</option>
          <option>Shortlisting</option>
          <option>Demo</option>
          <option>Assigned</option>
        </select>

      </div>


      <div className="space-y-4">

        {filteredRequests.map((request, index) => (
          <motion.article
            key={request.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">

              <div className="min-w-0 flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <span className="text-xs font-medium text-slate-600">
                    {request.id}
                  </span>

                  <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[request.status]}`}>
                    {request.status}
                  </span>

                </div>

                <h3 className="mt-3 text-lg font-semibold">
                  {request.college}
                </h3>

                <p className="mt-1 text-sm text-violet-400">
                  {request.technology}
                </p>


                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">

                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {request.students} Students
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {request.duration}
                  </span>

                  <span>
                    Mode: {request.mode}
                  </span>

                </div>

              </div>


              <div className="flex flex-wrap gap-3">

                <button
                  type="button"
                  className="rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  Details
                </button>

                <button
                  type="button"
                  disabled={request.status === "Assigned"}
                  onClick={() => advanceRequest(request.id)}
                  className="flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-3 text-sm font-semibold transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-emerald-500/10 disabled:text-emerald-400"
                >
                  {request.status === "Assigned" ? (
                    <>
                      <CheckCircle2 size={16} />
                      Assigned
                    </>
                  ) : (
                    `Move to ${nextStatus[request.status]}`
                  )}
                </button>

              </div>

            </div>
          </motion.article>
        ))}

      </div>

    </div>
  );
}

