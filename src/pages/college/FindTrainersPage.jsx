import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  Bookmark,
  BookmarkCheck,
  MapPin,
  Search,
  Star,
} from "lucide-react";

const trainerData = [
  {
    id: 1,
    initials: "AS",
    name: "Aman Sharma",
    technology: "Java + DSA",
    skills: "Java, DSA, Spring Boot",
    experience: 6,
    location: "Delhi NCR",
    rating: 4.9,
    available: true,
  },
  {
    id: 2,
    initials: "PV",
    name: "Priya Verma",
    technology: "Python / AI",
    skills: "Python, AI/ML, Data Science",
    experience: 5,
    location: "Noida",
    rating: 4.8,
    available: true,
  },
  {
    id: 3,
    initials: "RM",
    name: "Rahul Mehta",
    technology: "Full Stack",
    skills: "React, Spring Boot, SQL",
    experience: 7,
    location: "Gurugram",
    rating: 4.9,
    available: false,
  },
  {
    id: 4,
    initials: "NS",
    name: "Neha Singh",
    technology: "Python + DSA",
    skills: "Python, DSA, Interview Prep",
    experience: 5,
    location: "Delhi",
    rating: 4.7,
    available: true,
  },
  {
    id: 5,
    initials: "AK",
    name: "Arjun Kumar",
    technology: "C / C++ DSA",
    skills: "C, C++, Competitive Coding",
    experience: 4,
    location: "Ghaziabad",
    rating: 4.6,
    available: true,
  },
];

export default function FindTrainersPage() {
  const [query, setQuery] = useState("");
  const [technology, setTechnology] = useState("All");
  const [availability, setAvailability] = useState("All");
  const [shortlisted, setShortlisted] = useState([]);

  const trainers = useMemo(() => {
    return trainerData.filter((trainer) => {
      const searchMatch =
        trainer.name.toLowerCase().includes(query.toLowerCase()) ||
        trainer.skills.toLowerCase().includes(query.toLowerCase()) ||
        trainer.location.toLowerCase().includes(query.toLowerCase());

      const techMatch =
        technology === "All" ||
        trainer.technology
          .toLowerCase()
          .includes(technology.toLowerCase());

      const availabilityMatch =
        availability === "All" ||
        (availability === "Available"
          ? trainer.available
          : !trainer.available);

      return searchMatch && techMatch && availabilityMatch;
    });
  }, [query, technology, availability]);

  const toggleShortlist = (id) => {
    setShortlisted((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id]
    );
  };

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">
          Find Trainers
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Search trainers by skills, location and availability.
        </p>
      </motion.div>


      <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto]">

        <label className="flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4">
          <Search
            size={17}
            className="text-slate-600"
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search name, technology or location..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>


        <select
          value={technology}
          onChange={(event) => setTechnology(event.target.value)}
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300 outline-none"
        >
          <option>All</option>
          <option>Java</option>
          <option>Python</option>
          <option>Full Stack</option>
          <option>C / C++</option>
        </select>


        <select
          value={availability}
          onChange={(event) => setAvailability(event.target.value)}
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300 outline-none"
        >
          <option>All</option>
          <option>Available</option>
          <option>Busy</option>
        </select>

      </div>


      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-600">
          {trainers.length} trainers found
        </p>

        <p className="text-sm text-violet-400">
          {shortlisted.length} shortlisted
        </p>
      </div>


      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

        {trainers.map((trainer, index) => {
          const saved = shortlisted.includes(trainer.id);

          return (
            <motion.article
              key={trainer.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -4 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 font-bold shadow-[0_0_22px_rgba(139,92,246,0.20)]">
                  {trainer.initials}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    trainer.available
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {trainer.available ? "Available" : "Busy"}
                </span>

              </div>


              <h3 className="mt-5 text-lg font-semibold">
                {trainer.name}
              </h3>

              <p className="mt-1 text-sm font-medium text-violet-400">
                {trainer.technology}
              </p>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                {trainer.skills}
              </p>


              <div className="mt-5 space-y-2 text-sm text-slate-500">

                <p>
                  {trainer.experience}+ Years Experience
                </p>

                <div className="flex items-center gap-2">
                  <MapPin size={14} />
                  {trainer.location}
                </div>

                <div className="flex items-center gap-2">
                  <Star
                    size={14}
                    fill="currentColor"
                    className="text-amber-400"
                  />
                  {trainer.rating}
                </div>

              </div>


              <div className="mt-5 grid grid-cols-[1fr_auto] gap-3">

                <button
                  type="button"
                  disabled={!trainer.available}
                  className="rounded-xl bg-violet-600 py-3 text-sm font-semibold transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-white/[0.04] disabled:text-slate-600"
                >
                  Request Demo
                </button>

                <button
                  type="button"
                  onClick={() =>
                    toggleShortlist(trainer.id)
                  }
                  className={`flex h-11 w-11 items-center justify-center rounded-xl border transition-colors ${
                    saved
                      ? "border-violet-500/30 bg-violet-500/10 text-violet-400"
                      : "border-white/[0.08] text-slate-500 hover:text-white"
                  }`}
                >
                  {saved ? (
                    <BookmarkCheck size={18} />
                  ) : (
                    <Bookmark size={18} />
                  )}
                </button>

              </div>

            </motion.article>
          );
        })}

      </div>

    </div>
  );
}
