
import { useMemo, useState } from "react";
import { Search, X, BookOpen } from "lucide-react";

import { courses } from "../../data/student/coursesData";
import CourseCard from "../../components/student/CourseCard";

export default function MyCoursesPage() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const search = query.trim().toLowerCase();

    return courses.filter((course) => {
      const title = String(course.title || "").toLowerCase();
      const trainer = String(course.trainer || "").toLowerCase();

      return title.includes(search) || trainer.includes(search);
    });
  }, [query]);

  const clearSearch = () => {
    setQuery("");
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Search Bar */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <label className="group flex h-12 w-full items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-4 transition-all duration-200 focus-within:border-emerald-500 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
          <Search
            size={19}
            className="shrink-0 text-emerald-600 transition-colors group-focus-within:text-emerald-700"
          />

          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search courses or trainers..."
            aria-label="Search courses or trainers"
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

      {/* Course Count */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-emerald-100 bg-emerald-50">
            <BookOpen size={18} className="text-emerald-700" />
          </div>

          <div>
            <h2 className="text-sm font-bold text-slate-800">
              My Courses
            </h2>

            <p className="mt-0.5 text-xs text-slate-500">
              {filtered.length}{" "}
              {filtered.length === 1 ? "course" : "courses"} found
            </p>
          </div>
        </div>

        {/* Only One Clear Search Button */}
        {query && (
          <button
            type="button"
            onClick={clearSearch}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-50"
          >
            <X size={14} />
            Clear search
          </button>
        )}
      </div>

      {/* Course Cards */}
      {filtered.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((course, index) => (
            <CourseCard
              key={course.id ?? index}
              course={course}
              index={index}
            />
          ))}
        </div>
      ) : (
        /* Empty Search Results */
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-emerald-100 bg-emerald-50">
            <Search size={23} className="text-emerald-600" />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-800">
            No courses found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Try searching with another course name or trainer name.
          </p>

          <button
            type="button"
            onClick={clearSearch}
            className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 focus:outline-none focus:ring-4 focus:ring-emerald-500/20"
          >
            Clear search
          </button>
        </div>
      )}
    </div>
  );
}
