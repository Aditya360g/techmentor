import { useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";

import { scheduleItems } from "../../data/student/studentData";

const styles = {
  Class:
    "bg-violet-50 text-violet-700",
  Assignment:
    "bg-amber-50 text-amber-700",
  Test:
    "bg-blue-50 text-blue-700",
};

export default function SchedulePage() {
  const [filter, setFilter] = useState("All");

  const items = useMemo(() => {
    if (filter === "All") {
      return scheduleItems;
    }

    return scheduleItems.filter(
      (item) => item.type === filter
    );
  }, [filter]);

  return (
    <div className="space-y-7">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            Schedule
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Classes, tests and assignment deadlines.
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
          <option>Class</option>
          <option>Assignment</option>
          <option>Test</option>
        </select>

      </div>


      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="divide-y divide-slate-100">

          {items.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
            >

              <div className="flex items-center gap-4">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                  <CalendarDays size={19} />
                </div>

                <div>
                  <p className="font-bold text-slate-900">
                    {item.title}
                  </p>

                  <div className="mt-2 flex gap-4 text-xs text-slate-500">

                    <span>
                      {item.date}
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock3 size={13} />
                      {item.time}
                    </span>

                  </div>
                </div>

              </div>


              <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${styles[item.type]}`}>
                {item.type}
              </span>

            </div>
          ))}

        </div>

      </div>

    </div>
  );
}
