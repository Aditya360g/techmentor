import {
  Award,
  CheckCircle2,
  RotateCcw,
} from "lucide-react";

import {
  Link,
  useLocation,
  useParams,
} from "react-router";

export default function TestResultPage() {
  const location = useLocation();
  const { testId } = useParams();

  const result =
    location.state || {
      score: 0,
      correct: 0,
      total: 0,
      title: "Coding Test",
      course: "Course",
    };

  const grade =
    result.score >= 90
      ? "A+"
      : result.score >= 80
        ? "A"
        : result.score >= 70
          ? "B"
          : result.score >= 60
            ? "C"
            : "Needs Improvement";

  return (
    <div className="mx-auto max-w-2xl">

      <section className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">

        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
          <Award size={30} />
        </div>

        <p className="mt-6 text-sm font-semibold text-violet-600">
          {result.course}
        </p>

        <h2 className="mt-2 text-2xl font-bold">
          {result.title}
        </h2>


        <div className="mx-auto mt-8 flex h-36 w-36 flex-col items-center justify-center rounded-full border-[10px] border-violet-100">

          <p className="text-4xl font-bold text-violet-700">
            {result.score}%
          </p>

          <p className="mt-1 text-xs text-slate-400">
            Score
          </p>

        </div>


        <div className="mt-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Correct
            </p>

            <p className="mt-1 text-xl font-bold text-emerald-600">
              {result.correct}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Questions
            </p>

            <p className="mt-1 text-xl font-bold">
              {result.total}
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 p-4">
            <p className="text-xs text-slate-400">
              Grade
            </p>

            <p className="mt-1 text-xl font-bold text-violet-700">
              {grade}
            </p>
          </div>

        </div>


        <div className="mt-8 flex flex-col gap-3 sm:flex-row">

          <Link
            to={`/student/tests/${testId}`}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            <RotateCcw size={16} />
            Retake Test
          </Link>

          <Link
            to="/student/results"
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white"
          >
            <CheckCircle2 size={16} />
            View Results
          </Link>

        </div>

      </section>

    </div>
  );
}
