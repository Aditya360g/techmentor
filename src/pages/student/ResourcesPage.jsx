import { useMemo, useState } from "react";

import {
  Download,
  FileCode2,
  FileText,
  Search,
} from "lucide-react";

import { resources } from "../../data/student/studentData";

export default function ResourcesPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState("All");

  const filtered = useMemo(() => {
    return resources.filter((item) => {
      const searchMatch =
        item.title
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        item.course
          .toLowerCase()
          .includes(query.toLowerCase());

      const typeMatch =
        type === "All" ||
        item.type === type;

      return searchMatch && typeMatch;
    });
  }, [query, type]);

  const downloadResource = (item) => {
    const blob = new Blob(
      [
        `${item.title}\nCourse: ${item.course}\nResource demo file.`,
      ],
      {
        type: "text/plain",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const anchor =
      document.createElement("a");

    anchor.href = url;
    anchor.download = `${item.title}.txt`;
    anchor.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          Learning Resources
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Notes, worksheets and project resources.
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
            placeholder="Search resources..."
            className="h-12 w-full bg-transparent text-sm outline-none"
          />

        </label>


        <select
          value={type}
          onChange={(event) =>
            setType(event.target.value)
          }
          className="h-12 rounded-xl border border-slate-200 bg-white px-4 text-sm"
        >
          <option>All</option>
          <option>PDF</option>
          <option>Worksheet</option>
          <option>Code</option>
        </select>

      </div>


      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">

        {filtered.map((item) => {
          const Icon =
            item.type === "Code"
              ? FileCode2
              : FileText;

          return (
            <article
              key={item.id}
              className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
            >

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                <Icon size={20} />
              </div>

              <h3 className="mt-5 font-bold">
                {item.title}
              </h3>

              <p className="mt-1 text-sm text-violet-600">
                {item.course}
              </p>

              <p className="mt-3 text-xs text-slate-400">
                {item.type} · {item.size}
              </p>


              <button
                type="button"
                onClick={() =>
                  downloadResource(item)
                }
                className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-50 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-600 hover:text-white"
              >
                <Download size={16} />
                Download
              </button>

            </article>
          );
        })}

      </div>

    </div>
  );
}
