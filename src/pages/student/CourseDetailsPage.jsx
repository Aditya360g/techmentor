import { Link, useParams } from "react-router";

import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Clock3,
  UserRound,
} from "lucide-react";

import { courses } from "../../data/student/coursesData";

export default function CourseDetailsPage() {
  const { courseId } = useParams();

  const course =
    courses.find(
      (item) => item.id === courseId
    ) || courses[0];

  return (
    <div className="space-y-7">

      <Link
        to="/student/courses"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600"
      >
        <ArrowLeft size={16} />
        Back to Courses
      </Link>


      <section className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-7 text-white md:p-9">

        <span className="rounded-full bg-white/15 px-3 py-1 text-xs">
          {course.category}
        </span>

        <h2 className="mt-5 text-3xl font-bold">
          {course.title}
        </h2>

        <p className="mt-4 max-w-3xl leading-7 text-violet-100">
          {course.description}
        </p>


        <div className="mt-6 flex flex-wrap gap-5 text-sm text-violet-100">

          <span className="flex items-center gap-2">
            <UserRound size={16} />
            {course.trainer}
          </span>

          <span className="flex items-center gap-2">
            <Clock3 size={16} />
            {course.duration}
          </span>

          <span className="flex items-center gap-2">
            <BookOpen size={16} />
            {course.totalLessons} Lessons
          </span>

        </div>

      </section>


      <div className="grid gap-6 xl:grid-cols-[1fr_0.35fr]">

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-bold">
            Course Syllabus
          </h3>


          <div className="mt-5 space-y-3">

            {course.syllabus.map(
              (item, index) => (
                <div
                  key={item}
                  className="flex items-center gap-4 rounded-xl bg-slate-50 p-4"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-100 text-sm font-bold text-violet-700">
                    {index + 1}
                  </span>

                  <span className="font-medium text-slate-700">
                    {item}
                  </span>

                  {index <
                    Math.floor(
                      course.syllabus.length *
                        (course.progress / 100)
                    ) && (
                    <CheckCircle2
                      size={18}
                      className="ml-auto text-emerald-500"
                    />
                  )}
                </div>
              )
            )}

          </div>

        </section>


        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <p className="text-sm text-slate-500">
            Course Progress
          </p>

          <p className="mt-2 text-4xl font-bold text-slate-900">
            {course.progress}%
          </p>

          <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100">

            <div
              style={{
                width: `${course.progress}%`,
              }}
              className="h-full rounded-full bg-violet-600"
            />

          </div>

          <p className="mt-4 text-sm text-slate-500">
            {course.completedLessons} of{" "}
            {course.totalLessons} lessons completed
          </p>


          <Link
            to="/student/live-classes"
            className="mt-6 block rounded-xl bg-violet-600 py-3 text-center text-sm font-semibold text-white hover:bg-violet-500"
          >
            Continue Learning
          </Link>

        </aside>

      </div>

    </div>
  );
}
