
import { useMemo, useState } from "react";
import { ClipboardCheck } from "lucide-react";

import { tests } from "../../data/student/testsData";
import TestCard from "../../components/student/TestCard";

export default function CodingTestsPage() {
  const [filter, setFilter] = useState("All");

  const filtered = useMemo(() => {
    if (filter === "All") {
      return tests;
    }

    return tests.filter((test) => test.status === filter);
  }, [filter]);

  return (
    <div className="min-w-0 space-y-6">
      {/* Filter and Test Count */}
      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-violet-100 bg-violet-50">
              <ClipboardCheck
                size={19}
                className="text-violet-700"
              />
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Your Assessments
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {filtered.length}{" "}
                {filtered.length === 1 ? "test" : "tests"} found
              </p>
            </div>
          </div>

          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            aria-label="Filter coding tests by status"
            className="h-11 w-full cursor-pointer rounded-xl border border-slate-300 bg-white px-4 text-sm font-medium !text-black shadow-sm outline-none transition focus:border-violet-500 focus:ring-4 focus:ring-violet-500/10 sm:w-48"
            style={{
              color: "#000000",
              backgroundColor: "#ffffff",
            }}
          >
            <option
              value="All"
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            >
              All Tests
            </option>
            <option
              value="Available"
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            >
              Available
            </option>
            <option
              value="Completed"
              style={{ color: "#000000", backgroundColor: "#ffffff" }}
            >
              Completed
            </option>
          </select>
        </div>
      </section>

      {/* Coding Test Cards */}
      {filtered.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((test, index) => (
            <TestCard
              key={test.id ?? index}
              test={test}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-violet-100 bg-violet-50">
            <ClipboardCheck
              size={23}
              className="text-violet-600"
            />
          </div>

          <h3 className="mt-5 text-lg font-bold text-slate-900">
            No tests found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            There are no tests in this category right now.
          </p>

          {filter !== "All" && (
            <button
              type="button"
              onClick={() => setFilter("All")}
              className="mt-5 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-500/20"
            >
              Show all tests
            </button>
          )}
        </div>
      )}
    </div>
  );
}
