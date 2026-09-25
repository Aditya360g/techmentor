import { useMemo, useState } from "react";
import { Search } from "lucide-react";

import { assignments } from "../../data/student/assignmentsData";
import AssignmentCard from "../../components/student/AssignmentCard";

export default function AssignmentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] =
    useState("All");

  const filtered = useMemo(() => {
    return assignments.filter((item) => {
      const matchesQuery =
        item.title
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        item.course
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesStatus =
        status === "All" ||
        item.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          Assignments
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Track, complete and submit course assignments.
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
            placeholder="Search assignments..."
            className="h-12 w-full bg-transparent text-sm outline-none"
          />
        </label>


        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"
        >
          <option>All</option>
          <option>Pending</option>
          <option>In Progress</option>
          <option>Submitted</option>
        </select>

      </div>


      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {filtered.map((assignment) => (
          <AssignmentCard
            key={assignment.id}
            assignment={assignment}
          />
        ))}

      </div>

    </div>
  );
}
