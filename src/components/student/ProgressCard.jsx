import { motion } from "motion/react";

export default function ProgressCard({
  title,
  value,
  label,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex justify-between">
        <div>
          <h3 className="font-bold text-slate-900">
            {title}
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            {label}
          </p>
        </div>

        <span className="text-lg font-bold text-violet-600">
          {value}%
        </span>
      </div>


      <div className="mt-5 h-2.5 overflow-hidden rounded-full bg-slate-100">

        <motion.div
          initial={{ width: 0 }}
          animate={{
            width: `${value}%`,
          }}
          transition={{
            duration: 0.8,
          }}
          className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
        />

      </div>

    </article>
  );
}
