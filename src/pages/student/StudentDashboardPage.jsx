import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import {
  dashboardStats,
  liveClasses,
} from "../../data/student/studentData";

import { courses } from "../../data/student/coursesData";

import StudentStatCard from "../../components/student/StudentStatCard";
import CourseCard from "../../components/student/CourseCard";
import ClassCard from "../../components/student/ClassCard";

export default function StudentDashboardPage() {
  return (
    <div className="space-y-8">

      <motion.section
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-7 text-white shadow-lg shadow-violet-100 md:p-8"
      >

        <p className="text-sm text-violet-100">
          Welcome back
        </p>

        <h2 className="mt-2 text-2xl font-bold md:text-3xl">
          Continue your learning journey
        </h2>

        <p className="mt-3 max-w-2xl text-sm leading-6 text-violet-100">
          You have active classes, assignments and tests waiting for you.
        </p>

        <Link
          to="/student/courses"
          className="mt-6 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-violet-700"
        >
          Continue Learning
          <ArrowRight size={16} />
        </Link>

      </motion.section>


      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {dashboardStats.map((item, index) => (
          <StudentStatCard
            key={item.title}
            {...item}
            index={index}
          />
        ))}

      </section>


      <section>

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              My Courses
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Continue your active programs.
            </p>
          </div>

          <Link
            to="/student/courses"
            className="flex items-center gap-1 text-sm font-semibold text-violet-600"
          >
            View all
            <ArrowRight size={15} />
          </Link>

        </div>


        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

          {courses.map((course, index) => (
            <CourseCard
              key={course.id}
              course={course}
              index={index}
            />
          ))}

        </div>

      </section>


      <section>

        <div className="mb-5 flex items-center justify-between">

          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Today's Classes
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Upcoming and live sessions.
            </p>
          </div>

          <Link
            to="/student/schedule"
            className="flex items-center gap-2 text-sm font-semibold text-violet-600"
          >
            <CalendarDays size={15} />
            Full Schedule
          </Link>

        </div>


        <div className="grid gap-5 xl:grid-cols-3">

          {liveClasses.map((item, index) => (
            <ClassCard
              key={item.id}
              item={item}
              index={index}
            />
          ))}

        </div>

      </section>

    </div>
  );
}
