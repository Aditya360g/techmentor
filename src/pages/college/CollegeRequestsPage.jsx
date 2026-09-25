import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  Clock3,
  Plus,
  Search,
  Users,
  X,
} from "lucide-react";

const initialRequests = [
  {
    id: "REQ-1001",
    technology: "Java + DSA",
    students: 120,
    duration: "4 Months",
    mode: "On Campus",
    status: "Shortlisting",
  },
  {
    id: "REQ-1005",
    technology: "Python",
    students: 80,
    duration: "8 Weeks",
    mode: "Hybrid",
    status: "Demo",
  },
];

const statusStyles = {
  New: "bg-blue-500/10 text-blue-400",
  Shortlisting: "bg-amber-500/10 text-amber-400",
  Demo: "bg-violet-500/10 text-violet-400",
  Assigned: "bg-emerald-500/10 text-emerald-400",
};

export default function CollegeRequestsPage() {
  const [requests, setRequests] = useState(initialRequests);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    technology: "Java + DSA",
    students: "60",
    duration: "8 Weeks",
    mode: "On Campus",
  });

  const filtered = useMemo(() => {
    return requests.filter((request) =>
      request.technology
        .toLowerCase()
        .includes(query.toLowerCase())
    );
  }, [requests, query]);

  const submitRequest = (event) => {
    event.preventDefault();

    const request = {
      id: `REQ-${1000 + requests.length + 1}`,
      technology: form.technology,
      students: Number(form.students),
      duration: form.duration,
      mode: form.mode,
      status: "New",
    };

    setRequests((current) => [
      request,
      ...current,
    ]);

    setShowForm(false);
  };

  const cancelRequest = (id) => {
    setRequests((current) =>
      current.filter((request) => request.id !== id)
    );
  };

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">
            Trainer Requests
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Create and track coding trainer requirements.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition-colors hover:bg-violet-500"
        >
          <Plus size={17} />
          New Request
        </button>
      </motion.div>


      {showForm && (
        <motion.form
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          onSubmit={submitRequest}
          className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-6"
        >

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              New Trainer Requirement
            </h3>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-500 hover:text-white"
            >
              <X size={19} />
            </button>
          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-2">

            <label>
              <span className="text-xs text-slate-500">
                Technology
              </span>

              <select
                value={form.technology}
                onChange={(event) =>
                  setForm({
                    ...form,
                    technology: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none"
              >
                <option>Java + DSA</option>
                <option>Python</option>
                <option>Full Stack</option>
                <option>AI / ML</option>
                <option>Data Science</option>
                <option>C / C++ DSA</option>
              </select>
            </label>


            <label>
              <span className="text-xs text-slate-500">
                Students
              </span>

              <input
                type="number"
                min="1"
                value={form.students}
                onChange={(event) =>
                  setForm({
                    ...form,
                    students: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none"
              />
            </label>


            <label>
              <span className="text-xs text-slate-500">
                Duration
              </span>

              <select
                value={form.duration}
                onChange={(event) =>
                  setForm({
                    ...form,
                    duration: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none"
              >
                <option>2 Weeks</option>
                <option>4 Weeks</option>
                <option>8 Weeks</option>
                <option>4 Months</option>
                <option>Semester</option>
              </select>
            </label>


            <label>
              <span className="text-xs text-slate-500">
                Training Mode
              </span>

              <select
                value={form.mode}
                onChange={(event) =>
                  setForm({
                    ...form,
                    mode: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none"
              >
                <option>On Campus</option>
                <option>Online</option>
                <option>Hybrid</option>
              </select>
            </label>

          </div>


          <button
            type="submit"
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Submit Requirement
          </button>

        </motion.form>
      )}


      <label className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4">
        <Search
          size={17}
          className="text-slate-600"
        />

        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search technology..."
          className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
        />
      </label>


      <div className="space-y-4">

        {filtered.map((request, index) => (
          <motion.article
            key={request.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
          >

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-3">

                  <span className="text-xs text-slate-600">
                    {request.id}
                  </span>

                  <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[request.status]}`}>
                    {request.status}
                  </span>

                </div>

                <h3 className="mt-3 text-lg font-semibold">
                  {request.technology}
                </h3>

                <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500">

                  <span className="flex items-center gap-1.5">
                    <Users size={14} />
                    {request.students} Students
                  </span>

                  <span className="flex items-center gap-1.5">
                    <Clock3 size={14} />
                    {request.duration}
                  </span>

                  <span>
                    {request.mode}
                  </span>

                </div>
              </div>


              <div className="flex gap-3">

                <button
                  type="button"
                  className="rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
                >
                  Details
                </button>

                {request.status === "New" && (
                  <button
                    type="button"
                    onClick={() =>
                      cancelRequest(request.id)
                    }
                    className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400"
                  >
                    Cancel
                  </button>
                )}

              </div>

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}
