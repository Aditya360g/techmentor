import { motion } from "motion/react";

import {
  CalendarDays,
  Clock3,
  Video,
} from "lucide-react";

export default function ClassCard({
  item,
  index = 0,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.04,
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >

      <div className="flex items-start justify-between gap-4">

        <div>
          <h3 className="font-bold text-slate-900">
            {item.title}
          </h3>

          <p className="mt-1 text-sm text-violet-600">
            {item.trainer}
          </p>
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            item.status === "Live"
              ? "bg-red-50 text-red-600"
              : "bg-blue-50 text-blue-600"
          }`}
        >
          {item.status}
        </span>

      </div>


      <div className="mt-5 grid gap-2 text-sm text-slate-500 sm:grid-cols-3">

        <span className="flex items-center gap-2">
          <CalendarDays size={15} />
          {item.date}
        </span>

        <span className="flex items-center gap-2">
          <Clock3 size={15} />
          {item.time}
        </span>

        <span className="flex items-center gap-2">
          <Video size={15} />
          {item.mode}
        </span>

      </div>


      <button
        type="button"
        className={`mt-5 w-full rounded-xl py-3 text-sm font-semibold ${
          item.status === "Live"
            ? "bg-violet-600 text-white hover:bg-violet-500"
            : "bg-slate-100 text-slate-600"
        }`}
      >
        {item.status === "Live"
          ? "Join Live Class"
          : "Class Scheduled"}
      </button>

    </motion.article>
  );
}
