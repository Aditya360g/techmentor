
import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Download,
  FileCode2,
  FileText,
  Search,
  ChevronDown,
  X,
  FolderOpen,
} from "lucide-react";

import { resources } from "../../data/student/studentData";

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");
  const reduceMotion = useReducedMotion();

  const filtered = useMemo(() => {
    const searchTerm = query.trim().toLowerCase();

    return resources.filter((item) => {
      const title = String(item.title ?? "").toLowerCase();
      const course = String(item.course ?? "").toLowerCase();

      const searchMatch =
        title.includes(searchTerm) || course.includes(searchTerm);

      const typeMatch = type === "All" || item.type === type;

      return searchMatch && typeMatch;
    });
  }, [query, type]);

  const clearFilters = () => {
    setQuery("");
    setType("All");
  };

  const downloadResource = (item) => {
    const content = [
      item.title,
      `Course: ${item.course}`,
      `Type: ${item.type}`,
      "",
      "Resource demo file.",
    ].join("\n");

    const blob = new Blob([content], {
      type: "text/plain;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = `${String(item.title || "resource")
      .replace(/[<>:"/\\|?*]/g, "-")
      .trim()}.txt`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  return (
    <div className="min-w-0 space-y-6">
      {/* Search and Filters */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5"
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          {/* Search Input */}
          <label className="group flex h-12 min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-300 bg-white px-4 transition-all duration-200 focus-within:border-violet-500 focus-within:ring-4 focus-within:ring-violet-100">
            <Search
              size={19}
              aria-hidden="true"
              className="shrink-0 text-slate-600 group-focus-within:text-violet-600"
            />

            <input
              type="search"
              name="resource-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search by resource or course..."
              aria-label="Search resources"
              autoComplete="off"
              spellCheck={false}
              style={{
                color: "#000000",
                WebkitTextFillColor: "#000000",
                caretColor: "#7c3aed",
                opacity: 1,
                backgroundColor: "transparent",
              }}
              className="resource-search-input h-full w-full min-w-0 flex-1 appearance-none border-0 bg-transparent text-sm font-medium !text-black opacity-100 outline-none placeholder:!text-slate-500 placeholder:opacity-100 focus:!text-black focus:outline-none"
            />

            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-slate-600 transition hover:bg-slate-100 hover:text-black"
              >
                <X size={15} />
              </button>
            )}
          </label>

          {/* Resource Type Dropdown */}
          <div className="relative w-full sm:w-48">
            <select
              value={type}
              onChange={(event) => setType(event.target.value)}
              aria-label="Filter resources by type"
              style={{ color: "#000000", opacity: 1 }}
              className="h-12 w-full cursor-pointer appearance-none rounded-xl border border-slate-300 bg-white py-0 pl-4 pr-11 text-sm font-semibold !text-black shadow-sm outline-none transition-all hover:border-violet-300 focus:border-violet-500 focus:ring-4 focus:ring-violet-100 [&>option]:bg-white [&>option]:text-black"
            >
              <option value="All">All Resources</option>
              <option value="PDF">PDF</option>
              <option value="Worksheet">Worksheet</option>
              <option value="Code">Code</option>
            </select>

            <ChevronDown
              size={18}
              aria-hidden="true"
              className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-black"
            />
          </div>
        </div>

        {/* Result Count */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-600">
            Showing{" "}
            <span className="font-bold text-slate-900">
              {filtered.length}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900">
              {resources.length}
            </span>{" "}
            resources
          </p>

          {(query || type !== "All") && (
            <button
              type="button"
              onClick={clearFilters}
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
            >
              <X size={15} />
              Clear filters
            </button>
          )}
        </div>
      </motion.section>

      {/* Resources Grid */}
      {filtered.length > 0 ? (
        <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item, index) => {
            const Icon =
              item.type === "Code" ? FileCode2 : FileText;

            return (
              <motion.article
                key={item.id}
                initial={
                  reduceMotion ? false : { opacity: 0, y: 18 }
                }
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: reduceMotion ? 0 : Math.min(index * 0.07, 0.35),
                  ease: "easeOut",
                }}
                whileHover={
                  reduceMotion
                    ? undefined
                    : {
                      y: -5,
                      transition: { duration: 0.2 },
                    }
                }
                className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50"
              >
                <div className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-violet-500 transition-transform duration-300 group-hover:scale-x-100" />

                <div className="flex items-start justify-between gap-3">
                  <motion.div
                    whileHover={
                      reduceMotion
                        ? undefined
                        : { rotate: -5, scale: 1.08 }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 280,
                      damping: 15,
                    }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 transition-colors duration-300 group-hover:bg-violet-100"
                  >
                    <Icon size={22} />
                  </motion.div>

                  <span className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700">
                    {item.type}
                  </span>
                </div>

                <h3 className="mt-5 break-words text-base font-bold leading-6 text-slate-900 transition-colors group-hover:text-violet-700">
                  {item.title}
                </h3>

                <p className="mt-2 break-words text-sm leading-5 text-slate-600">
                  {item.course}
                </p>

                <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
                  <FileText size={14} />
                  <span>{item.size}</span>
                </div>

                <div className="mt-auto pt-5">
                  <button
                    type="button"
                    onClick={() => downloadResource(item)}
                    className="flex w-full items-center justify-center gap-2 rounded-xl border border-violet-100 bg-violet-50 py-3 text-sm font-bold text-violet-700 transition-all duration-200 hover:border-violet-600 hover:bg-violet-600 hover:text-white focus:outline-none focus:ring-4 focus:ring-violet-100 active:scale-[0.98]"
                  >
                    <Download size={17} />
                    Download
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      ) : (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-14 text-center"
        >
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-50 text-violet-600">
            <FolderOpen size={27} />
          </div>

          <h3 className="mt-4 text-lg font-bold text-slate-900">
            No resources found
          </h3>

          <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-slate-500">
            Try a different search term or choose another resource type.
          </p>

          <button
            type="button"
            onClick={clearFilters}
            className="mt-5 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 active:scale-[0.98]"
          >
            Clear filters
          </button>
        </motion.div>
      )}

      {/* Explicit search text color fallback */}
      <style>{`
        .resource-search-input,
        .resource-search-input:focus,
        .resource-search-input:active,
        .resource-search-input:-webkit-autofill {
          color: #000000 !important;
          -webkit-text-fill-color: #000000 !important;
          caret-color: #7c3aed !important;
          opacity: 1 !important;
        }

        .resource-search-input::placeholder {
          color: #64748b !important;
          -webkit-text-fill-color: #64748b !important;
          opacity: 1 !important;
        }

        .resource-search-input::-webkit-search-cancel-button {
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}
