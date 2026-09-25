import { motion } from "motion/react";

import {
  BookOpen,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileCheck2,
} from "lucide-react";

const icons = {
  courses: BookOpen,
  assignments: ClipboardCheck,
  tests: FileCheck2,
  progress: ChartNoAxesCombined,
};

export default function StudentStatCard({
  title,
  value,
  change,
  type,
  index = 0,
}) {
  const Icon = icons[type] || BookOpen;

  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
      }}
      whileHover={{
        y: -3,
      }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm text-slate-500">
            {title}
          </p>

          <p className="mt-2 text-3xl font-bold text-slate-900">
            {value}
          </p>
        </div>

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Icon size={20} />
        </div>

      </div>

      <p className="mt-4 text-xs font-medium text-slate-400">
        {change}
      </p>

    </motion.article>
  );
}
