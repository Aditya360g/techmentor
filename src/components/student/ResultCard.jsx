export default function ResultCard({
  result,
}) {
  return (
    <article className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div>
        <h3 className="font-bold text-slate-900">
          {result.test}
        </h3>

        <p className="mt-1 text-sm text-violet-600">
          {result.course}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {result.date}
        </p>
      </div>


      <div className="text-right">

        <p className="text-2xl font-bold text-slate-900">
          {result.score}%
        </p>

        <span className="mt-1 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
          Grade {result.grade}
        </span>

      </div>

    </article>
  );
}
