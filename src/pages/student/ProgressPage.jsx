
import {
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  TrendingUp,
} from "lucide-react";

import { motion } from "motion/react";

import { courses } from "../../data/student/coursesData";
import ProgressCard from "../../components/student/ProgressCard";

const MotionArticle = motion.article;

export default function ProgressPage() {
  const overall = courses.length
    ? Math.round(
      courses.reduce(
        (sum, course) => sum + (Number(course.progress) || 0),
        0
      ) / courses.length
    )
    : 0;

  const stats = [
    {
      icon: BookOpen,
      label: "Lessons Completed",
      value: "82",
    },
    {
      icon: ClipboardCheck,
      label: "Assignments Submitted",
      value: "18",
    },
    {
      icon: FileCheck2,
      label: "Tests Completed",
      value: "12",
    },
  ];

  return (
    <div className="min-w-0 space-y-7">
      {/* Overall Progress */}
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        whileHover={{
          y: -4,
          boxShadow: "0px 18px 40px rgba(109, 40, 217, 0.22)",
        }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-6 text-white shadow-lg transition-shadow duration-300 sm:p-7"
      >
        {/* Decorative Background */}
        <div className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full bg-white/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-16 right-1/4 h-36 w-36 rounded-full bg-indigo-300/20 blur-2xl" />

        <div className="relative">
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-white/15"
            >
              <TrendingUp size={22} />
            </motion.div>

            <p className="font-semibold">
              Overall Learning Progress
            </p>
          </div>

          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="mt-5 text-5xl font-bold tracking-tight"
          >
            {overall}%
          </motion.p>

          <p className="mt-2 text-sm text-violet-100">
            Great progress. Keep completing classes and assessments.
          </p>

          {/* Progress Bar */}
          <div className="mt-6 h-2.5 overflow-hidden rounded-full bg-white/20">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(100, Math.max(0, overall))}% ` }}
              transition={{ duration: 1.2, delay: 0.3, ease: "easeOut" }}
              className="h-full rounded-full bg-white"
            />
          </div>
        </div>
      </motion.section>

      {/* Course Progress Cards */}
      <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-3">
        {courses.map((course, index) => (
          <motion.div
            key={course.id ?? course.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.4,
              delay: index * 0.1,
              ease: "easeOut",
            }}
            whileHover={{
              y: -6,
              transition: { duration: 0.2 },
            }}
            className="min-w-0 rounded-2xl transition-shadow duration-300 hover:shadow-xl"
          >
            <ProgressCard
              title={course.title}
              value={course.progress}
              label={`${course.completedLessons}/${course.totalLessons} lessons completed`}
            />
          </motion.div >
        ))}
      </div >

      {/* Learning Statistics */}
      < div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3" >
        {
          stats.map(({ icon: Icon, label, value }, index) => (
            <MotionArticle
              key={label}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              whileHover={{
                y: -6,
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/60"
            >
              <motion.div
                whileHover={{ rotate: -8, scale: 1.12 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
                className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors duration-300 group-hover:bg-violet-100"
              >
                <Icon size={21} />
              </motion.div>

              <p className="mt-4 text-2xl font-bold text-slate-900 transition-colors group-hover:text-violet-700">
                {value}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {label}
              </p>
            </MotionArticle>
          ))
        }
      </div >
    </div >
  );
}
