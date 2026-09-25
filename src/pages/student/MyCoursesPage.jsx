import { useMemo, useState } from "react";

import {
  Search,
} from "lucide-react";

import { courses } from "../../data/student/coursesData";
import CourseCard from "../../components/student/CourseCard";

export default function MyCoursesPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] =
    useState("All");

  const filtered = useMemo(() => {
    return courses.filter((course) => {
      const searchMatch =
        course.title
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        course.trainer
          .toLowerCase()
          .includes(query.toLowerCase());

      const categoryMatch =
        category === "All" ||
        course.category === category;

      return searchMatch && categoryMatch;
    });
  }, [query, category]);

  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          My Courses
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Access all your active learning programs.
        </p>
      </div>


      <div className="flex flex-col gap-3 sm:flex-row">

        <label className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">

          <Search
            size={17}
            className="text-slate-400"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search course or trainer..."
            className="h-12 w-full bg-transparent text-sm outline-none"
          />

        </label>


        <select
          value={category}
          onChange={(event) =>
            setCategory(event.target.value)
          }
          className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none"
        >
          <option>All</option>
          <option>Java</option>
          <option>Python</option>
          <option>Full Stack</option>
        </select>

      </div>


      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {filtered.map((course, index) => (
          <CourseCard
            key={course.id}
            course={course}
            index={index}
          />
        ))}

      </div>

    </div>
  );
}
