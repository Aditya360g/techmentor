import { previousResults } from "../../data/student/testsData";
import ResultCard from "../../components/student/ResultCard";

export default function ResultsPage() {
  const average = Math.round(
    previousResults.reduce(
      (sum, result) =>
        sum + result.score,
      0
    ) / previousResults.length
  );

  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          Results
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Review your test performance and scores.
        </p>
      </div>


      <div className="grid gap-4 sm:grid-cols-3">

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Average Score
          </p>

          <p className="mt-2 text-3xl font-bold text-violet-700">
            {average}%
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Tests Completed
          </p>

          <p className="mt-2 text-3xl font-bold">
            {previousResults.length}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">
            Best Score
          </p>

          <p className="mt-2 text-3xl font-bold text-emerald-600">
            {Math.max(
              ...previousResults.map(
                (item) => item.score
              )
            )}%
          </p>
        </article>

      </div>


      <div className="space-y-4">

        {previousResults.map((result) => (
          <ResultCard
            key={result.id}
            result={result}
          />
        ))}

      </div>

    </div>
  );
}
