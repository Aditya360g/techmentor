import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  Building2,
  Mail,
  MapPin,
  Phone,
  Search,
} from "lucide-react";

const collegeData = [
  {
    id: 1,
    name: "RKGIT",
    location: "Ghaziabad, UP",
    contact: "Dr. Sharma",
    email: "placement@rkgit.example",
    phone: "+91 98765 43210",
    students: 640,
    status: "Active",
  },
  {
    id: 2,
    name: "XYZ College",
    location: "Noida, UP",
    contact: "Ankit Verma",
    email: "cs@xyzcollege.example",
    phone: "+91 98765 12210",
    students: 420,
    status: "Active",
  },
  {
    id: 3,
    name: "Global University",
    location: "Delhi",
    contact: "Priya Singh",
    email: "training@global.example",
    phone: "+91 98765 22220",
    students: 860,
    status: "Pending",
  },
  {
    id: 4,
    name: "Tech Institute",
    location: "Gurugram, HR",
    contact: "Rahul Jain",
    email: "hodcs@tech.example",
    phone: "+91 98765 34220",
    students: 310,
    status: "Inactive",
  },
];

const statusStyles = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Inactive: "bg-slate-500/10 text-slate-500",
};

export default function ManageCollegesPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const colleges = useMemo(() => {
    return collegeData.filter((college) => {
      const matchesSearch =
        college.name.toLowerCase().includes(query.toLowerCase()) ||
        college.location.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        status === "All" || college.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [query, status]);

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          

          

          
        </div>

        <button
          type="button"
          className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition-colors hover:bg-violet-500"
        >
          + Add College
        </button>
      </motion.div>


      <div className="flex flex-col gap-3 sm:flex-row">

        <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4">
          <Search
            size={17}
            className="text-slate-600"
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search colleges..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300 outline-none"
        >
          <option>All</option>
          <option>Active</option>
          <option>Pending</option>
          <option>Inactive</option>
        </select>

      </div>


      <div className="grid gap-4 xl:grid-cols-2">

        {colleges.map((college, index) => (
          <motion.article
            key={college.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
          >
            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Building2 size={22} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {college.name}
                  </h3>

                  <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-600">
                    <MapPin size={13} />
                    {college.location}
                  </p>
                </div>

              </div>

              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[college.status]}`}>
                {college.status}
              </span>

            </div>


            <div className="mt-5 grid gap-3 border-t border-white/[0.06] pt-5 text-sm text-slate-500">

              <p>
                Contact: <span className="text-slate-300">{college.contact}</span>
              </p>

              <div className="flex items-center gap-2">
                <Mail size={15} />
                {college.email}
              </div>

              <div className="flex items-center gap-2">
                <Phone size={15} />
                {college.phone}
              </div>

              <p>
                Students: <span className="font-medium text-white">{college.students}</span>
              </p>

            </div>


            <div className="mt-5 flex gap-3">

              <button
                type="button"
                className="flex-1 rounded-xl bg-violet-600/10 py-3 text-sm font-medium text-violet-400 transition-colors hover:bg-violet-600 hover:text-white"
              >
                View Profile
              </button>

              <button
                type="button"
                className="rounded-xl border border-white/[0.08] px-5 py-3 text-sm text-slate-500 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                Edit
              </button>

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}

