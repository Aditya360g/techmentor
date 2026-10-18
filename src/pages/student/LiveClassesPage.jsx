
import { useMemo, useState } from "react";
import { Search, X, Video } from "lucide-react";

import { liveClasses } from "../../data/student/studentData";
import ClassCard from "../../components/student/ClassCard";

export default function LiveClassesPage() {
  const [query, setQuery] = useState("");

  const classes = useMemo(() => {
    const search = query.trim().toLowerCase();

    return liveClasses.filter((item) => {
      const title = String(item.title || "").toLowerCase();
      const trainer = String(item.trainer || "").toLowerCase();

      return title.includes(search) || trainer.includes(search);
    });
  }, [query]);

  return (
    <div className="min-w-0 space-y-6">
      {/* Purple Search Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <label className="group flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition-all duration-200 focus-within:border-violet-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-violet-500/10">
          <Search
            size={19}
            className="shrink-0 text-violet-600"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search classes or trainers..."
            aria-label="Search classes or trainers"
            autoComplete="off"
            className="h-full w-full min-w-0 appearance-none border-0 bg-transparent p-0 text-sm font-medium !text-black caret-black outline-none placeholder:font-normal placeholder:!text-slate-500 focus:!text-black focus:border-0 focus:outline-none focus:ring-0"
            style={{
              color: "#000000",
              WebkitTextFillColor: "#000000",
              caretColor: "#000000",
              opacity: 1,
            }}
          />
        </label>
      </section>

      {/* Classes Count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-violet-50">
            <Video size={18} className="text-violet-700" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800">
              Training Sessions
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {classes.length}{" "}
              {classes.length === 1 ? "class" : "classes"} found
            </p>
          </div>
        </div>

        {/* Only One Clear Search Button */}
        {query && (
          <button
            type="button"
            onClick={() => setQuery("")}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-violet-700 transition hover:bg-violet-50"
          >
            <X size={14} />
            Clear search
          </button>
        )}
      </div>

      {/* Live Classes Grid */}
      {classes.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
          {classes.map((item, index) => (
            <ClassCard
              key={item.id ?? index}
              item={item}
              index={index}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50">
            <Search size={23} className="text-violet-600" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-800">
            No classes found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Try searching with a different class name or trainer name.
          </p>

          <button
            type="button"
            onClick={() => setQuery("")}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/20"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
