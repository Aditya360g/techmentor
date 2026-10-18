
import { useMemo, useState } from "react";

import {
  CalendarDays,
  Clock3,
} from "lucide-react";

import { scheduleItems } from "../../data/student/studentData";

const styles = {
  Class: "bg-violet-50 text-violet-700",
  Assignment: "bg-amber-50 text-amber-700",
  Test: "bg-blue-50 text-blue-700",
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
      {/* Filter Dropdown */}
      <div className="flex justify-end">
        <select
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
          aria-label="Filter schedule items"
          className="h-11 min-w-40 cursor-pointer rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium !text-black shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10"
          style={{
            color: "#000000",
            backgroundColor: "#ffffff",
          }}
        >
          <option value="All" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
            All
          </option>
          <option value="Class" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
            Class
          </option>
          <option value="Assignment" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
            Assignment
          </option>
          <option value="Test" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
            Test
          </option>
        </select>
      </div>

      {/* Schedule Items */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="divide-y divide-slate-100">
          {items.length > 0 ? (
            items.map((item, index) => (
              <div
                key={item.id ?? index}
                className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <CalendarDays size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="font-bold text-slate-900">
                      {item.title}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-4 text-xs text-slate-600">
                      <span>{item.date}</span>

                      <span className="flex items-center gap-1">
                        <Clock3 size={13} />
                        {item.time}
                      </span>
                    </div>
                  </div>
                </div>

                <span
                  className={`w-fit shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${styles[item.type] || "bg-slate-100 text-slate-700"
                    }`}
                >
                  {item.type}
                </span>
              </div>
            ))
          ) : (
            <div className="px-5 py-12 text-center">
              <CalendarDays
                size={30}
                className="mx-auto text-violet-500"
              />

              <h3 className="mt-3 font-bold text-slate-900">
                No schedule items found
              </h3>

              <p className="mt-1 text-sm text-slate-500">
                Try selecting another filter.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
