import {
  Code2,
  Star,
} from "lucide-react";

const mentors = [
  {
    initials: "AS",
    name: "Aman Sharma",
    role: "Senior Java Trainer",
    skills: "Java DSA, Problem Solving",
    experience: "8+ Years Exp",
  },
  {
    initials: "PV",
    name: "Priya Verma",
    role: "AI / ML Trainer",
    skills: "Python, AI/ML, Data Science",
    experience: "6+ Years Exp",
  },
  {
    initials: "RM",
    name: "Rahul Mehta",
    role: "Full Stack Trainer",
    skills: "React, Spring Boot, SQL",
    experience: "7+ Years Exp",
  },
  {
    initials: "AK",
    name: "Arjun Kumar",
    role: "DSA Trainer",
    skills: "C/C++ DSA, Competitive Coding",
    experience: "5+ Years Exp",
  },
  {
    initials: "NS",
    name: "Neha Singh",
    role: "Python Trainer",
    skills: "Python DSA, Interview Prep",
    experience: "5+ Years Exp",
  },
  {
    initials: "VS",
    name: "Vikram Sharma",
    role: "Development Trainer",
    skills: "Web Development, System Fundamentals",
    experience: "6+ Years Exp",
  },
];

export default function TrainersSection() {
  return (
    <section className="bg-[#08070f] py-28 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Meet Your Mentors
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Learn from Experienced

            <span className="text-violet-400">
              {" "}Technical Mentors
            </span>
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            Learn from educators experienced in coding, development,
            problem solving and placement preparation.
          </p>

        </div>


        <div className="mt-16 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">

          {mentors.map((mentor) => (
            <article
              key={mentor.name}
              className="
                group
                transform-gpu
                rounded-3xl
                border border-white/10
                bg-white/[0.035]
                p-7
                transition-all duration-200
                hover:-translate-y-1
                hover:border-violet-400/90
                hover:bg-violet-500/[0.08]
                hover:shadow-[0_0_8px_rgba(139,92,246,0.60),0_0_22px_rgba(99,102,241,0.22)]
              "
            >

              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-lg font-bold shadow-lg shadow-violet-900/20 transition-all duration-200 group-hover:shadow-[0_0_20px_rgba(139,92,246,0.45)]">
                {mentor.initials}
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {mentor.name}
              </h3>

              <p className="mt-1 font-medium text-violet-400">
                {mentor.role}
              </p>

              <div className="mt-4 flex items-start gap-2 text-sm text-slate-400">
                <Code2
                  size={16}
                  className="mt-0.5 shrink-0 text-violet-400"
                />

                {mentor.skills}
              </div>

              <p className="mt-3 text-sm text-slate-500">
                {mentor.experience}
              </p>


              <div className="mt-5 flex gap-1 text-amber-400">

                {[1, 2, 3, 4, 5].map((item) => (
                  <Star
                    key={item}
                    size={15}
                    fill="currentColor"
                  />
                ))}

              </div>

            </article>
          ))}

        </div>

      </div>

    </section>
  );
}
