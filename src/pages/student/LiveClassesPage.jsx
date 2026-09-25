import { useMemo, useState } from "react";

import {
  Search,
} from "lucide-react";

import { liveClasses } from "../../data/student/studentData";
import ClassCard from "../../components/student/ClassCard";

export default function LiveClassesPage() {
  const [query, setQuery] = useState("");

  const classes = useMemo(() => {
    return liveClasses.filter(
      (item) =>
        item.title
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        item.trainer
          .toLowerCase()
          .includes(query.toLowerCase())
    );
  }, [query]);

  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          Live Classes
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Join live training sessions and check upcoming classes.
        </p>
      </div>


      <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 shadow-sm">

        <Search
          size={17}
          className="text-slate-400"
        />

        <input
          value={query}
          onChange={(event) =>
            setQuery(event.target.value)
          }
          placeholder="Search class or trainer..."
          className="h-12 w-full bg-transparent text-sm outline-none"
        />

      </label>


      <div className="grid gap-5 xl:grid-cols-2">

        {classes.map((item, index) => (
          <ClassCard
            key={item.id}
            item={item}
            index={index}
          />
        ))}

      </div>

    </div>
  );
}
