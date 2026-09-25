import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowRight,
  BookOpenCheck,
  BriefcaseBusiness,
  Building2,
  Code2,
  GraduationCap,
  Users,
} from "lucide-react";

const solutions = [
  {
    icon: GraduationCap,
    title: "Guest Faculty",
    text:
      "Technical trainers for regular classes, practical labs and academic programs.",
  },
  {
    icon: BookOpenCheck,
    title: "Semester Training",
    text:
      "Structured technical programs aligned with semester requirements.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Placement Programs",
    text:
      "DSA, coding, aptitude and technical interview preparation.",
  },
  {
    icon: Code2,
    title: "Workshops & Bootcamps",
    text:
      "Focused practical programs on modern tools and technologies.",
  },
];

const process = [
  "Share Requirement",
  "Trainer Shortlisting",
  "Interview / Demo",
  "Final Selection",
  "Trainer Deployment",
];

export default function InstitutionsPage() {
  return (
    <main className="min-h-screen bg-[#08070f] pb-24 pt-36 text-white">

      <section className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid items-center gap-14 lg:grid-cols-2"
        >

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
              For Colleges & Universities
            </p>

            <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
              Build Stronger Technical Programs with

              <span className="text-violet-400">
                {" "}Experienced Trainers
              </span>
            </h1>

            <p className="mt-6 max-w-2xl leading-8 text-slate-400">
              Find coding trainers according to technology, experience,
              duration, location and academic requirements.
            </p>


            <div className="mt-8 flex flex-wrap gap-4">

              <Link
                to="/request-guest-faculty"
                className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold hover:bg-violet-500"
              >
                Request Guest Faculty
                <ArrowRight size={17} />
              </Link>

              <Link
                to="/trainers"
                className="rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 font-medium text-slate-300 hover:bg-white/[0.06]"
              >
                Explore Trainers
              </Link>

            </div>
          </div>


          <div className="grid gap-4 sm:grid-cols-2">

            {[
              ["Flexible", "Engagement Models"],
              ["15+", "Technologies"],
              ["On-Campus", "Training"],
              ["Online", "Training"],
            ].map(([value, label], index) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
              >
                <p className="text-2xl font-bold text-violet-400">
                  {value}
                </p>

                <p className="mt-2 text-sm text-slate-500">
                  {label}
                </p>
              </motion.div>
            ))}

          </div>

        </motion.div>


        <div className="mt-24">

          <div className="max-w-3xl">
            <p className="text-sm uppercase tracking-[0.18em] text-violet-400">
              Institutional Solutions
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Training Models Designed for Academic Institutions
            </h2>
          </div>


          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

            {solutions.map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={20} />
                </div>

                <h3 className="mt-5 font-semibold">
                  {title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-slate-500">
                  {text}
                </p>
              </article>
            ))}

          </div>

        </div>


        <div className="mt-24 grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">

          <div>
            <Building2
              size={34}
              className="text-violet-400"
            />

            <h2 className="mt-5 text-3xl font-bold">
              Simple Deployment Process
            </h2>

            <p className="mt-4 leading-7 text-slate-500">
              From trainer requirement to final deployment, the process is
              structured around institutional needs.
            </p>
          </div>


          <div className="grid gap-3">

            {process.map((item, index) => (
              <div
                key={item}
                className="flex items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-sm font-bold text-violet-400">
                  {index + 1}
                </span>

                <p className="font-medium">
                  {item}
                </p>
              </div>
            ))}

          </div>

        </div>


        <div className="mt-24 rounded-[32px] border border-violet-500/20 bg-gradient-to-r from-violet-500/[0.10] to-indigo-500/[0.05] p-8 md:p-12">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <div className="flex items-center gap-3 text-violet-400">
                <Users size={22} />
                <span className="text-sm font-semibold">
                  Need Trainers?
                </span>
              </div>

              <h2 className="mt-4 text-3xl font-bold">
                Share Your Institution's Requirement
              </h2>

              <p className="mt-3 max-w-2xl text-slate-400">
                Tell us the technology, student count, duration and training
                mode you need.
              </p>
            </div>

            <Link
              to="/request-guest-faculty"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 font-semibold hover:bg-violet-500"
            >
              Submit Requirement
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
