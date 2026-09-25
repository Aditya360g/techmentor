import { motion } from "motion/react";
import {
  CalendarDays,
  Clock3,
  Presentation,
  UserCheck,
} from "lucide-react";

const models = [
  {
    icon: UserCheck,
    title: "Guest Faculty",
    description:
      "Coding trainers for regular academic classes and lab sessions.",
  },
  {
    icon: CalendarDays,
    title: "Semester Engagement",
    description:
      "Dedicated trainers for complete semester training programs.",
  },
  {
    icon: Clock3,
    title: "Short-Term Training",
    description:
      "Focused skill programs running for days or weeks.",
  },
  {
    icon: Presentation,
    title: "Technical Workshops",
    description:
      "Practical workshops around specific technical skills.",
  },
];

export default function EngagementModelsSection() {
  return (
    <section className="bg-[#0b0a12] py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Engagement Models
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Choose How You Need
            <span className="text-violet-400">
              {" "}a Trainer
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {models.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="
                group
                transform-gpu
                rounded-3xl
                border
                border-white/10
                bg-white/[0.035]
                p-7
                transition-all
                duration-200
                ease-out
                hover:-translate-y-1
                hover:border-violet-400/90
                hover:bg-violet-500/[0.08]
                hover:shadow-[0_0_7px_rgba(139,92,246,0.70),0_0_20px_rgba(99,102,241,0.30)]
              "
            >
              <div
                className="
                  flex h-12 w-12 items-center justify-center
                  rounded-xl
                  bg-violet-500/10
                  text-violet-400
                  transition-all
                  duration-200
                  group-hover:bg-gradient-to-br
                  group-hover:from-violet-600
                  group-hover:to-indigo-600
                  group-hover:text-white
                  group-hover:shadow-[0_0_18px_rgba(139,92,246,0.40)]
                "
              >
                <Icon size={27} />
              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                {description}
              </p>
            </article>
          ))}

        </div>

      </div>
    </section>
  );
}
