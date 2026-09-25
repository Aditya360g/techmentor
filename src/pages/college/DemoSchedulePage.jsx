import { useState } from "react";
import { motion } from "motion/react";

import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  Plus,
  Video,
  X,
} from "lucide-react";

const initialDemos = [
  {
    id: 1,
    trainer: "Aman Sharma",
    technology: "Java + DSA",
    date: "26 Sep 2026",
    time: "10:30 AM",
    mode: "Google Meet",
    status: "Upcoming",
  },
  {
    id: 2,
    trainer: "Priya Verma",
    technology: "Python AI/ML",
    date: "28 Sep 2026",
    time: "02:00 PM",
    mode: "Online",
    status: "Scheduled",
  },
  {
    id: 3,
    trainer: "Rahul Mehta",
    technology: "Full Stack",
    date: "20 Sep 2026",
    time: "11:00 AM",
    mode: "On Campus",
    status: "Completed",
  },
];

const statusStyles = {
  Upcoming: "bg-blue-500/10 text-blue-400",
  Scheduled: "bg-violet-500/10 text-violet-400",
  Completed: "bg-emerald-500/10 text-emerald-400",
};

export default function DemoSchedulePage() {
  const [demos, setDemos] = useState(initialDemos);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    trainer: "Aman Sharma",
    technology: "Java + DSA",
    date: "2026-09-30",
    time: "10:30",
    mode: "Google Meet",
  });

  const scheduleDemo = (event) => {
    event.preventDefault();

    const demo = {
      id: Date.now(),
      trainer: form.trainer,
      technology: form.technology,
      date: form.date,
      time: form.time,
      mode: form.mode,
      status: "Scheduled",
    };

    setDemos((current) => [
      demo,
      ...current,
    ]);

    setShowForm(false);
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
            Demo Schedule
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Schedule and manage trainer demo sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
        >
          <Plus size={17} />
          Schedule Demo
        </button>
      </motion.div>


      {showForm && (
        <motion.form
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={scheduleDemo}
          className="rounded-2xl border border-violet-500/20 bg-violet-500/[0.04] p-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Schedule Trainer Demo
            </h3>

            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="text-slate-500 hover:text-white"
            >
              <X size={19} />
            </button>
          </div>


          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <label>
              <span className="text-xs text-slate-500">
                Trainer
              </span>

              <select
                value={form.trainer}
                onChange={(event) =>
                  setForm({
                    ...form,
                    trainer: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
              >
                <option>Aman Sharma</option>
                <option>Priya Verma</option>
                <option>Rahul Mehta</option>
                <option>Neha Singh</option>
              </select>
            </label>


            <label>
              <span className="text-xs text-slate-500">
                Technology
              </span>

              <input
                value={form.technology}
                onChange={(event) =>
                  setForm({
                    ...form,
                    technology: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
              />
            </label>


            <label>
              <span className="text-xs text-slate-500">
                Date
              </span>

              <input
                type="date"
                value={form.date}
                onChange={(event) =>
                  setForm({
                    ...form,
                    date: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
              />
            </label>


            <label>
              <span className="text-xs text-slate-500">
                Time
              </span>

              <input
                type="time"
                value={form.time}
                onChange={(event) =>
                  setForm({
                    ...form,
                    time: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
              />
            </label>


            <label>
              <span className="text-xs text-slate-500">
                Mode
              </span>

              <select
                value={form.mode}
                onChange={(event) =>
                  setForm({
                    ...form,
                    mode: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
              >
                <option>Google Meet</option>
                <option>Online</option>
                <option>On Campus</option>
              </select>
            </label>

          </div>


          <button
            type="submit"
            className="mt-6 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold hover:bg-violet-500"
          >
            Confirm Demo
          </button>

        </motion.form>
      )}


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

            <div className="flex items-start justify-between gap-4">

              <div>
                <h3 className="font-semibold">
                  {demo.trainer}
                </h3>

                <p className="mt-1 text-sm text-violet-400">
                  {demo.technology}
                </p>
              </div>

              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[demo.status]}`}>
                {demo.status}
              </span>

            </div>


            <div className="mt-5 grid gap-3 text-sm text-slate-500 sm:grid-cols-3">

              <span className="flex items-center gap-2">
                <CalendarDays size={15} />
                {demo.date}
              </span>

              <span className="flex items-center gap-2">
                <Clock3 size={15} />
                {demo.time}
              </span>

              <span className="flex items-center gap-2">
                <Video size={15} />
                {demo.mode}
              </span>

            </div>


            <div className="mt-5">

              {demo.status === "Completed" ? (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle2 size={16} />
                  Demo completed
                </div>
              ) : (
                <button
                  type="button"
                  className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold hover:bg-violet-500"
                >
                  View Demo Details
                </button>
              )}

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}
