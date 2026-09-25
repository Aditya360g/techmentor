import { motion } from "motion/react";

const skills = [
  "Java",
  "Python",
  "C",
  "C++",
  "Data Structures & Algorithms",
  "React",
  "Spring Boot",
  "Node.js",
  "Full Stack Development",
  "SQL & Databases",
  "Artificial Intelligence",
  "Machine Learning",
  "Data Science",
  "Cloud Computing",
  "Git & GitHub",
];

export default function SkillsSection() {
  return (
    <section className="bg-[#08070f] py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Technologies
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Industry-Relevant
            <span className="text-violet-400">
              {" "}Technical Skills
            </span>
          </h2>
        </motion.div>

        <div className="mt-14 flex flex-wrap justify-center gap-3">

          {skills.map((skill) => (
            <div
              key={skill}
              className="
                transform-gpu
                cursor-default
                rounded-full
                border border-white/10
                bg-white/[0.035]
                px-5 py-3
                text-sm font-medium
                text-slate-300
                transition-all
                duration-150
                ease-out
                hover:-translate-y-1
                hover:border-violet-400
                hover:bg-violet-500/[0.10]
                hover:text-white
                hover:shadow-[0_0_6px_rgba(139,92,246,0.8),0_0_16px_rgba(99,102,241,0.35)]
              "
            >
              {skill}
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}
