import {
  BookOpen,
  ClipboardCheck,
  FileCheck2,
  TrendingUp,
} from "lucide-react";

import { courses } from "../../data/student/coursesData";
import ProgressCard from "../../components/student/ProgressCard";

export default function ProgressPage() {
  const overall = Math.round(
    courses.reduce(
      (sum, course) =>
        sum + course.progress,
      0
    ) / courses.length
  );

  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          Learning Progress
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Track progress across courses and assessments.
        </p>
      </div>


      <section className="rounded-3xl bg-gradient-to-r from-violet-600 to-indigo-600 p-7 text-white">

        <div className="flex items-center gap-3">
          <TrendingUp size={22} />

          <p className="font-semibold">
            Overall Learning Progress
          </p>
        </div>

        <p className="mt-5 text-5xl font-bold">
          {overall}%
        </p>

        <p className="mt-2 text-sm text-violet-100">
          Great progress. Keep completing classes and assessments.
        </p>

      </section>


      <div className="grid gap-5 lg:grid-cols-3">

        {courses.map((course) => (
          <ProgressCard
            key={course.id}
            title={course.title}
            value={course.progress}
            label={`${course.completedLessons}/${course.totalLessons} lessons completed`}
          />
        ))}

      </div>


      <div className="grid gap-4 sm:grid-cols-3">

        {[
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
        ].map(({ icon: Icon, label, value }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <Icon className="text-violet-600" />

            <p className="mt-4 text-2xl font-bold">
              {value}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {label}
            </p>
          </article>
        ))}

      </div>

    </div>
  );
}
