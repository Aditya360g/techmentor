import { useMemo, useState } from "react";

import { tests } from "../../data/student/testsData";
import TestCard from "../../components/student/TestCard";

export default function CodingTestsPage() {
  const [filter, setFilter] =
    useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") {
      return tests;
    }

    return tests.filter(
      (test) => test.status === filter
    );
  }, [filter]);

  return (
    <div className="space-y-7">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Coding Tests
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Practice assessments and placement mock tests.
          </p>
        </div>


        <select
          value={filter}
          onChange={(event) =>
            setFilter(event.target.value)
          }
          className="h-11 rounded-xl border border-slate-200 bg-white px-4 text-sm"
        >
          <option>All</option>
          <option>Available</option>
          <option>Completed</option>
        </select>

      </div>


      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {filtered.map((test) => (
          <TestCard
            key={test.id}
            test={test}
          />
        ))}

      </div>

    </div>
  );
}
