import { useMemo, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowRight,
  MapPin,
  Search,
  Star,
} from "lucide-react";

const trainersData = [
  {
    id: 1,
    initials: "AS",
    name: "Aman Sharma",
    role: "Java & DSA Trainer",
    category: "Java",
    skills: "Java, DSA, Spring Boot, Problem Solving",
    experience: 6,
    location: "Delhi NCR",
    rating: 4.9,
    mode: "On Campus / Online",
    available: true,
  },
  {
    id: 2,
    initials: "PV",
    name: "Priya Verma",
    role: "Python & AI/ML Trainer",
    category: "Python",
    skills: "Python, AI/ML, Data Science, Pandas",
    experience: 5,
    location: "Noida",
    rating: 4.8,
    mode: "Online / Hybrid",
    available: true,
  },
  {
    id: 3,
    initials: "RM",
    name: "Rahul Mehta",
    role: "Full Stack Trainer",
    category: "Full Stack",
    skills: "React, Spring Boot, SQL, REST APIs",
    experience: 7,
    location: "Gurugram",
    rating: 4.9,
    mode: "On Campus / Online",
    available: false,
  },
  {
    id: 4,
    initials: "NS",
    name: "Neha Singh",
    role: "Python DSA Trainer",
    category: "Python",
    skills: "Python, DSA, Interview Preparation",
    experience: 5,
    location: "Delhi",
    rating: 4.7,
    mode: "On Campus",
    available: true,
  },
  {
    id: 5,
    initials: "AK",
    name: "Arjun Kumar",
    role: "C / C++ DSA Trainer",
    category: "C / C++",
    skills: "C, C++, DSA, Competitive Coding",
    experience: 4,
    location: "Ghaziabad",
    rating: 4.6,
    mode: "On Campus / Hybrid",
    available: true,
  },
  {
    id: 6,
    initials: "VS",
    name: "Vikram Sharma",
    role: "Cloud & DevOps Trainer",
    category: "Cloud",
    skills: "Cloud, Linux, Git, CI/CD",
    experience: 6,
    location: "Bengaluru",
    rating: 4.8,
    mode: "Online",
    available: true,
  },
];

export default function TrainersPage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [availability, setAvailability] = useState("All");

  const trainers = useMemo(() => {
    return trainersData.filter((trainer) => {
      const searchMatch =
        trainer.name
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        trainer.skills
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        trainer.location
          .toLowerCase()
          .includes(query.toLowerCase());

      const categoryMatch =
        category === "All" ||
        trainer.category === category;

      const availabilityMatch =
        availability === "All" ||
        (availability === "Available"
          ? trainer.available
          : !trainer.available);

      return (
        searchMatch &&
        categoryMatch &&
        availabilityMatch
      );
    });
  }, [query, category, availability]);

  return (
    <main className="min-h-screen bg-[#08070f] pb-24 pt-36 text-white">

      <section className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Trainer Network
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Find Experienced

            <span className="text-violet-400">
              {" "}Technical Trainers
            </span>
          </h1>

          <p className="mt-6 leading-8 text-slate-400">
            Search trainers by technology, experience, location and
            availability.
          </p>
        </motion.div>


        <div className="mt-12 grid gap-3 lg:grid-cols-[1fr_auto_auto]">

          <label className="flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4">

            <Search
              size={17}
              className="text-slate-600"
            />

            <input
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              placeholder="Search trainer, skill or location..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
            />

          </label>


          <select
            value={category}
            onChange={(event) =>
              setCategory(event.target.value)
            }
            className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300"
          >
            <option>All</option>
            <option>Java</option>
            <option>Python</option>
            <option>Full Stack</option>
            <option>C / C++</option>
            <option>Cloud</option>
          </select>


          <select
            value={availability}
            onChange={(event) =>
              setAvailability(event.target.value)
            }
            className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300"
          >
            <option>All</option>
            <option>Available</option>
            <option>Busy</option>
          </select>

        </div>


        <p className="mt-5 text-sm text-slate-600">
          {trainers.length} trainers found
        </p>


        <div className="mt-7 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {trainers.map((trainer, index) => (
            <motion.article
              key={trainer.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -5 }}
              className="rounded-3xl border border-white/[0.08] bg-white/[0.03] p-6 transition-colors hover:border-violet-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.12)]"
            >

              <div className="flex items-start justify-between">

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-lg font-bold shadow-[0_0_20px_rgba(139,92,246,0.22)]">
                  {trainer.initials}
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs ${
                    trainer.available
                      ? "bg-emerald-500/10 text-emerald-400"
                      : "bg-amber-500/10 text-amber-400"
                  }`}
                >
                  {trainer.available
                    ? "Available"
                    : "Busy"}
                </span>

              </div>


              <h2 className="mt-5 text-xl font-semibold">
                {trainer.name}
              </h2>

              <p className="mt-1 text-sm font-medium text-violet-400">
                {trainer.role}
              </p>

              <p className="mt-4 text-sm leading-6 text-slate-500">
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

                <p>
                  {trainer.mode}
                </p>

              </div>


              <Link
                to={`/trainers/${trainer.id}`}
                className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-500/10 py-3 text-sm font-semibold text-violet-400 transition-colors hover:bg-violet-600 hover:text-white"
              >
                View Profile
                <ArrowRight size={16} />
              </Link>

            </motion.article>
          ))}

        </div>


        {trainers.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-12 text-center text-slate-600">
            No trainers found for these filters.
          </div>
        )}

      </section>

    </main>
  );
}
