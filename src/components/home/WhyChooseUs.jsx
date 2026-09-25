import { motion } from "motion/react";
import {
  ArrowUpRight,
  BookOpenCheck,
  BriefcaseBusiness,
  GraduationCap,
  Languages,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    label: "Collaboration",
    title: "University Partnerships",
    text:
      "Work directly with colleges and academic institutions to integrate industry-grade technical training into academic schedules.",
  },
  {
    icon: BookOpenCheck,
    label: "Academic Growth",
    title: "Curriculum Integration",
    text:
      "Programs can align with university standards while simultaneously building practical and real-world development skills.",
  },
  {
    icon: Languages,
    label: "Problem Solving",
    title: "Language-Specific DSA",
    text:
      "Students can learn Data Structures & Algorithms in Java, Python, C or C++ based on institutional requirements.",
  },
  {
    icon: BriefcaseBusiness,
    label: "Placements",
    title: "Career Acceleration",
    text:
      "Placement preparation can include coding practice, mock interviews, technical mentoring and problem-solving sessions.",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="bg-[#0b0a12] py-28 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Platform Overview
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Curriculum-Aligned Tech Training Built for

            <span className="text-violet-400">
              {" "}Student Outcomes
            </span>
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            Bridge the gap between academic education and modern industry
            requirements through specialized, placement-oriented technical
            training.
          </p>
        </motion.div>


        <div className="mt-16 grid gap-5 md:grid-cols-2">

          {features.map(({ icon: Icon, label, title, text }) => (
            <article
              key={title}
              className="
                group
                transform-gpu
                rounded-3xl
                border border-white/10
                bg-white/[0.035]
                p-8
                transition-all duration-200
                hover:-translate-y-1
                hover:border-violet-400/90
                hover:bg-violet-500/[0.07]
                hover:shadow-[0_0_8px_rgba(139,92,246,0.55),0_0_24px_rgba(99,102,241,0.20)]
              "
            >

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400 transition-all duration-200 group-hover:bg-violet-600 group-hover:text-white">
                <Icon size={23} />
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
                {label}
              </p>

              <h3 className="mt-2 text-xl font-semibold">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                {text}
              </p>

              <div className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-violet-400">
                Learn more
                <ArrowUpRight size={16} />
              </div>

            </article>
          ))}

        </div>

      </div>

    </section>
  );
}
