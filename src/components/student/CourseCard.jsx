import { motion } from "motion/react";
import { Link } from "react-router";
import {
  ArrowRight,
  BookOpen,
} from "lucide-react";

export default function CourseCard({
  course,
  index = 0,
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      whileHover={{ y: -4 }}
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >

      <div className="flex items-start justify-between gap-3">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <BookOpen size={20} />
        </div>

        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
          {course.status}
        </span>

      </div>


      <h3 className="mt-5 text-lg font-bold text-slate-900">
        {course.title}
      </h3>

      <p className="mt-1 text-sm text-violet-600">
        {course.trainer}
      </p>

      <p className="mt-3 text-sm text-slate-500">
        {course.completedLessons}/{course.totalLessons} lessons · {course.duration}
      </p>


      <div className="mt-5">

        <div className="flex justify-between text-xs text-slate-400">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>

        <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">

          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${course.progress}%`,
            }}
            transition={{
              duration: 0.7,
              delay: index * 0.05,
            }}
            className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
          />

        </div>

      </div>


      <Link
        to={`/student/courses/${course.id}`}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-violet-50 py-3 text-sm font-semibold text-violet-700 transition-colors hover:bg-violet-600 hover:text-white"
      >
        Continue Course
        <ArrowRight size={15} />
      </Link>

    </motion.article>
  );
}
