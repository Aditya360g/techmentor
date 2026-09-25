import { useState } from "react";
import { motion } from "motion/react";

import {
  CheckCircle2,
  Clock3,
  Save,
} from "lucide-react";

const initialAvailability = [
  {
    day: "Monday",
    enabled: true,
    start: "09:00",
    end: "17:00",
  },
  {
    day: "Tuesday",
    enabled: true,
    start: "09:00",
    end: "17:00",
  },
  {
    day: "Wednesday",
    enabled: true,
    start: "10:00",
    end: "18:00",
  },
  {
    day: "Thursday",
    enabled: true,
    start: "09:00",
    end: "17:00",
  },
  {
    day: "Friday",
    enabled: true,
    start: "09:00",
    end: "16:00",
  },
  {
    day: "Saturday",
    enabled: false,
    start: "10:00",
    end: "14:00",
  },
  {
    day: "Sunday",
    enabled: false,
    start: "10:00",
    end: "14:00",
  },
];

export default function TrainerAvailabilityPage() {
  const [availability, setAvailability] =
    useState(initialAvailability);

  const [saved, setSaved] = useState(false);
  const [overallAvailable, setOverallAvailable] = useState(true);

  const updateDay = (index, field, value) => {
    setAvailability((current) =>
      current.map((item, itemIndex) =>
        itemIndex === index
          ? {
              ...item,
              [field]: value,
            }
          : item
      )
    );
  };

  const saveAvailability = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2200);
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
            Availability
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Define when institutions can request your training sessions.
          </p>
        </div>

        <button
          type="button"
          onClick={saveAvailability}
          className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
        >
          <Save size={16} />
          Save Availability
        </button>
      </motion.div>


      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
        >
          <CheckCircle2 size={17} />
          Availability saved successfully.
        </motion.div>
      )}


      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Clock3 size={20} />
            </div>

            <div>
              <h3 className="font-semibold">
                Overall Availability
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Show your profile as available for new assignments.
              </p>
            </div>

          </div>


          <button
            type="button"
            onClick={() =>
              setOverallAvailable((current) => !current)
            }
            className={`relative h-7 w-14 rounded-full transition-colors ${
              overallAvailable
                ? "bg-violet-600"
                : "bg-slate-700"
            }`}
          >
            <span
              className={`absolute top-1 h-5 w-5 rounded-full bg-white transition-transform ${
                overallAvailable
                  ? "translate-x-8"
                  : "translate-x-1"
              }`}
            />
          </button>

        </div>


        <div className="mt-5 rounded-xl bg-black/10 px-4 py-3 text-sm">
          Status:{" "}

          <span
            className={
              overallAvailable
                ? "text-emerald-400"
                : "text-amber-400"
            }
          >
            {overallAvailable
              ? "Available for new assignments"
              : "Not accepting new assignments"}
          </span>
        </div>

      </section>


      <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">

        <div className="border-b border-white/[0.06] p-5">
          <h3 className="font-semibold">
            Weekly Schedule
          </h3>

          <p className="mt-1 text-xs text-slate-600">
            Set available teaching hours for each day.
          </p>
        </div>


        <div className="divide-y divide-white/[0.05]">

          {availability.map((item, index) => (
            <motion.div
              key={item.day}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.03 }}
              className="grid gap-4 p-5 md:grid-cols-[160px_120px_1fr_1fr] md:items-center"
            >

              <p className="font-medium">
                {item.day}
              </p>


              <button
                type="button"
                onClick={() =>
                  updateDay(
                    index,
                    "enabled",
                    !item.enabled
                  )
                }
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  item.enabled
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-slate-500/10 text-slate-500"
                }`}
              >
                {item.enabled
                  ? "Available"
                  : "Unavailable"}
              </button>


              <label>
                <span className="text-xs text-slate-600">
                  Start Time
                </span>

                <input
                  type="time"
                  value={item.start}
                  disabled={!item.enabled}
                  onChange={(event) =>
                    updateDay(
                      index,
                      "start",
                      event.target.value
                    )
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm disabled:opacity-30"
                />
              </label>


              <label>
                <span className="text-xs text-slate-600">
                  End Time
                </span>

                <input
                  type="time"
                  value={item.end}
                  disabled={!item.enabled}
                  onChange={(event) =>
                    updateDay(
                      index,
                      "end",
                      event.target.value
                    )
                  }
                  className="mt-2 h-11 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm disabled:opacity-30"
                />
              </label>

            </motion.div>
          ))}

        </div>

      </section>

    </div>
  );
}
