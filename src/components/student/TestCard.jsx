import { Link } from "react-router";
import {
  Clock3,
  FileCheck2,
} from "lucide-react";

export default function TestCard({
  test,
}) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between">

        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
          <FileCheck2 size={20} />
        </div>

        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            test.status === "Completed"
              ? "bg-emerald-50 text-emerald-600"
              : "bg-violet-50 text-violet-600"
          }`}
        >
          {test.status}
        </span>

      </div>


      <h3 className="mt-5 font-bold text-slate-900">
        {test.title}
      </h3>

      <p className="mt-1 text-sm text-violet-600">
        {test.course}
      </p>


      <div className="mt-4 flex gap-4 text-sm text-slate-500">

        <span className="flex items-center gap-1.5">
          <Clock3 size={14} />
          {test.duration} min
        </span>

        <span>
          {test.questionsCount} questions
        </span>

      </div>


      {test.status === "Completed" ? (
        <div className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-center text-sm font-semibold text-emerald-700">
          Score: {test.score}%
        </div>
      ) : (
        <Link
          to={`/student/tests/${test.id}`}
          className="mt-5 block rounded-xl bg-violet-600 py-3 text-center text-sm font-semibold text-white hover:bg-violet-500"
        >
          Start Test
        </Link>
      )}

    </article>
  );
}
