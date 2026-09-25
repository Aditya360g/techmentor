import { motion } from "motion/react";
import { Link, useParams } from "react-router";

import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  GraduationCap,
  MapPin,
  Star,
} from "lucide-react";

const trainers = [
  {
    id: "1",
    initials: "AS",
    name: "Aman Sharma",
    role: "Java & DSA Trainer",
    skills: [
      "Core Java",
      "Advanced Java",
      "Data Structures & Algorithms",
      "Spring Boot",
      "Problem Solving",
      "Interview Preparation",
    ],
    experience: "6+ Years",
    location: "Delhi NCR",
    rating: 4.9,
    mode: "On Campus / Online",
    availability: "Available",
    about:
      "Experienced Java and DSA trainer focused on practical coding, problem solving and placement-oriented learning.",
    programs: [
      "Semester Java Training",
      "DSA Placement Program",
      "Spring Boot Workshop",
      "Technical Interview Preparation",
    ],
  },
  {
    id: "2",
    initials: "PV",
    name: "Priya Verma",
    role: "Python & AI/ML Trainer",
    skills: [
      "Python",
      "Machine Learning",
      "Data Science",
      "Pandas",
      "NumPy",
      "AI Fundamentals",
    ],
    experience: "5+ Years",
    location: "Noida",
    rating: 4.8,
    mode: "Online / Hybrid",
    availability: "Available",
    about:
      "Python and AI/ML trainer experienced in data-driven learning, practical labs and applied student projects.",
    programs: [
      "Python Core Training",
      "AI / ML Program",
      "Data Science Workshop",
      "Python DSA",
    ],
  },
  {
    id: "3",
    initials: "RM",
    name: "Rahul Mehta",
    role: "Full Stack Trainer",
    skills: [
      "React",
      "Java",
      "Spring Boot",
      "REST APIs",
      "SQL",
      "Full Stack Projects",
    ],
    experience: "7+ Years",
    location: "Gurugram",
    rating: 4.9,
    mode: "On Campus / Online",
    availability: "Busy",
    about:
      "Full Stack technical trainer with experience in frontend, backend APIs, databases and end-to-end project development.",
    programs: [
      "Full Stack Development",
      "React Workshop",
      "Spring Boot Program",
      "REST API Training",
    ],
  },
];

const fallbackTrainer = {
  id: "0",
  initials: "CF",
  name: "CodeFaculty Trainer",
  role: "Technical Trainer",
  skills: [
    "Programming",
    "Problem Solving",
    "Technical Training",
  ],
  experience: "3+ Years",
  location: "India",
  rating: 4.8,
  mode: "Online / On Campus",
  availability: "Available",
  about:
    "Experienced technical educator available for institutional training requirements.",
  programs: [
    "Guest Faculty",
    "Technical Workshop",
    "Placement Training",
  ],
};

export default function TrainerDetailsPage() {
  const { trainerId } = useParams();

  const trainer =
    trainers.find((item) => item.id === trainerId) ||
    fallbackTrainer;

  return (
    <main className="min-h-screen bg-[#08070f] pb-24 pt-36 text-white">

      <section className="mx-auto max-w-7xl px-6">

        <Link
          to="/trainers"
          className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Trainers
        </Link>


        <div className="mt-8 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">

          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="h-fit rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-7"
          >

            <div className="flex h-24 w-24 items-center justify-center rounded-[26px] bg-gradient-to-br from-violet-600 to-indigo-500 text-2xl font-bold shadow-[0_0_35px_rgba(139,92,246,0.25)]">
              {trainer.initials}
            </div>

            <h1 className="mt-6 text-2xl font-bold">
              {trainer.name}
            </h1>

            <p className="mt-2 font-medium text-violet-400">
              {trainer.role}
            </p>


            <div className="mt-6 space-y-3 text-sm text-slate-500">

              <div className="flex items-center gap-2">
                <BadgeCheck size={16} />
                {trainer.experience}
              </div>

              <div className="flex items-center gap-2">
                <MapPin size={16} />
                {trainer.location}
              </div>

              <div className="flex items-center gap-2">
                <Star
                  size={16}
                  fill="currentColor"
                  className="text-amber-400"
                />
                {trainer.rating} Rating
              </div>

              <div className="flex items-center gap-2">
                <GraduationCap size={16} />
                {trainer.mode}
              </div>

            </div>


            <div className="mt-6">

              <span
                className={`inline-flex rounded-full px-3 py-1.5 text-xs ${
                  trainer.availability === "Available"
                    ? "bg-emerald-500/10 text-emerald-400"
                    : "bg-amber-500/10 text-amber-400"
                }`}
              >
                {trainer.availability}
              </span>

            </div>


            <Link
              to="/request-guest-faculty"
              className="mt-7 flex items-center justify-center rounded-xl bg-violet-600 py-3.5 font-semibold hover:bg-violet-500"
            >
              Request This Trainer
            </Link>

          </motion.aside>


          <motion.div
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >

            <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-7">

              <h2 className="text-xl font-semibold">
                About Trainer
              </h2>

              <p className="mt-4 leading-8 text-slate-400">
                {trainer.about}
              </p>

            </section>


            <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-7">

              <div className="flex items-center gap-3">
                <BookOpenCheck className="text-violet-400" />

                <h2 className="text-xl font-semibold">
                  Technical Skills
                </h2>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">

                {trainer.skills.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-2 text-sm text-violet-300"
                  >
                    {skill}
                  </span>
                ))}

              </div>

            </section>


            <section className="rounded-[28px] border border-white/[0.08] bg-white/[0.03] p-7">

              <h2 className="text-xl font-semibold">
                Training Programs
              </h2>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">

                {trainer.programs.map((program) => (
                  <div
                    key={program}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.06] bg-black/10 p-4 text-sm text-slate-300"
                  >
                    <CheckCircle2
                      size={17}
                      className="shrink-0 text-violet-400"
                    />

                    {program}
                  </div>
                ))}

              </div>

            </section>


            <section className="grid gap-4 sm:grid-cols-2">

              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">

                <CalendarDays className="text-violet-400" />

                <h3 className="mt-4 font-semibold">
                  Flexible Schedule
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Demo and training dates can be coordinated with the
                  institution.
                </p>

              </div>


              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">

                <Clock3 className="text-violet-400" />

                <h3 className="mt-4 font-semibold">
                  Flexible Engagement
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Short-term, semester and workshop engagement models.
                </p>

              </div>

            </section>

          </motion.div>

        </div>

      </section>

    </main>
  );
}
