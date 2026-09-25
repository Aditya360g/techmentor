import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowRight,
  BookOpen,
  BrainCircuit,
  BriefcaseBusiness,
  Code2,
  GraduationCap,
  Presentation,
  Workflow,
} from "lucide-react";

const services = [
  {
    icon: GraduationCap,
    title: "Coding Guest Faculty",
    text:
      "Experienced trainers for regular academic classes, labs and practical coding sessions.",
  },
  {
    icon: BookOpen,
    title: "Semester Training",
    text:
      "Structured semester-long technical programs for CS and IT students.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Placement Training",
    text:
      "DSA, coding, technical interviews and placement-focused preparation.",
  },
  {
    icon: Presentation,
    title: "Technical Workshops",
    text:
      "Focused practical workshops around specific modern technologies.",
  },
  {
    icon: Workflow,
    title: "Coding Bootcamps",
    text:
      "Intensive short-term practical programs for rapid skill development.",
  },
  {
    icon: Code2,
    title: "Technology Training",
    text:
      "Java, Python, Full Stack, Spring Boot, React, Cloud and databases.",
  },
  {
    icon: BrainCircuit,
    title: "AI / ML Training",
    text:
      "Python, machine learning, data science and applied AI learning programs.",
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-[#08070f] pb-24 pt-36 text-white">

      <section className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Services
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Technical Training Solutions for

            <span className="text-violet-400">
              {" "}Modern Institutions
            </span>
          </h1>

          <p className="mt-6 leading-8 text-slate-400">
            Flexible trainer engagement models for academics, placements,
            workshops and practical technical learning.
          </p>
        </motion.div>


        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

          {services.map(({ icon: Icon, title, text }, index) => (
            <motion.article
              key={title}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.04 }}
              whileHover={{ y: -5 }}
              className="group rounded-3xl border border-white/[0.08] bg-white/[0.03] p-7 transition-colors hover:border-violet-400/70 hover:bg-violet-500/[0.06] hover:shadow-[0_0_20px_rgba(139,92,246,0.15)]"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-all group-hover:bg-violet-600 group-hover:text-white">
                <Icon size={23} />
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                {title}
              </h2>

              <p className="mt-3 leading-7 text-slate-500">
                {text}
              </p>
            </motion.article>
          ))}

        </div>


        <div className="mt-24 rounded-[32px] border border-violet-500/20 bg-gradient-to-br from-violet-500/[0.10] to-indigo-500/[0.04] p-8 md:p-12">

          <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

            <div>
              <h2 className="text-3xl font-bold">
                Need a Custom Training Program?
              </h2>

              <p className="mt-4 max-w-2xl leading-7 text-slate-400">
                Share your technology, student count, academic schedule and
                trainer experience requirements.
              </p>
            </div>

            <Link
              to="/request-guest-faculty"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-4 font-semibold hover:bg-violet-500"
            >
              Request Trainer
              <ArrowRight size={17} />
            </Link>

          </div>

        </div>

      </section>

    </main>
  );
}
