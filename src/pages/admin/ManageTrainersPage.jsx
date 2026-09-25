import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  BadgeCheck,
  MapPin,
  Search,
  Star,
} from "lucide-react";

const initialTrainers = [
  {
    id: 1,
    initials: "AS",
    name: "Aman Sharma",
    skills: "Java, DSA, Spring Boot",
    experience: "6+ Years",
    location: "Delhi NCR",
    rating: 4.9,
    status: "Active",
  },
  {
    id: 2,
    initials: "PV",
    name: "Priya Verma",
    skills: "Python, AI/ML, Data Science",
    experience: "5+ Years",
    location: "Noida",
    rating: 4.8,
    status: "Active",
  },
  {
    id: 3,
    initials: "RM",
    name: "Rahul Mehta",
    skills: "React, Spring Boot, SQL",
    experience: "7+ Years",
    location: "Gurugram",
    rating: 4.9,
    status: "Busy",
  },
  {
    id: 4,
    initials: "NS",
    name: "Neha Singh",
    skills: "Python, DSA, Interview Prep",
    experience: "5+ Years",
    location: "Delhi",
    rating: 4.7,
    status: "Inactive",
  },
];

const statusStyles = {
  Active: "bg-emerald-500/10 text-emerald-400",
  Busy: "bg-amber-500/10 text-amber-400",
  Inactive: "bg-slate-500/10 text-slate-500",
};

export default function ManageTrainersPage() {
  const [trainers, setTrainers] = useState(initialTrainers);
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const filteredTrainers = useMemo(() => {
    return trainers.filter((trainer) => {
      const matchesSearch =
        trainer.name.toLowerCase().includes(query.toLowerCase()) ||
        trainer.skills.toLowerCase().includes(query.toLowerCase()) ||
        trainer.location.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        status === "All" || trainer.status === status;

      return matchesSearch && matchesStatus;
    });
  }, [trainers, query, status]);

  const toggleTrainer = (id) => {
    setTrainers((current) =>
      current.map((trainer) =>
        trainer.id === id
          ? {
              ...trainer,
              status:
                trainer.status === "Inactive"
                  ? "Active"
                  : "Inactive",
            }
          : trainer
      )
    );
  };

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
          + Add Trainer
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
            placeholder="Search trainer, skill or location..."
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
          <option>Busy</option>
          <option>Inactive</option>
        </select>

      </div>


      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {filteredTrainers.map((trainer, index) => (
          <motion.article
            key={trainer.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            whileHover={{ y: -3 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
          >
            <div className="flex items-start justify-between">

              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 font-bold shadow-[0_0_20px_rgba(139,92,246,0.18)]">
                {trainer.initials}
              </div>

              <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[trainer.status]}`}>
                {trainer.status}
              </span>

            </div>


            <h3 className="mt-5 text-lg font-semibold">
              {trainer.name}
            </h3>

            <p className="mt-1 text-sm text-violet-400">
              {trainer.skills}
            </p>


            <div className="mt-4 space-y-2 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <BadgeCheck size={15} />
                {trainer.experience}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={15} />
                {trainer.location}
              </div>

              <div className="flex items-center gap-2">
                <Star
                  size={15}
                  fill="currentColor"
                  className="text-amber-400"
                />
                {trainer.rating}
              </div>

            </div>


            <div className="mt-5 grid grid-cols-2 gap-3">

              <button
                type="button"
                className="rounded-xl border border-white/[0.08] py-3 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
              >
                Profile
              </button>

              <button
                type="button"
                onClick={() => toggleTrainer(trainer.id)}
                className="rounded-xl bg-violet-500/10 py-3 text-sm font-medium text-violet-400 transition-colors hover:bg-violet-600 hover:text-white"
              >
                {trainer.status === "Inactive"
                  ? "Activate"
                  : "Deactivate"}
              </button>

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}

