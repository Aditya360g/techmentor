import { motion } from "motion/react";

const steps = [
  {
    number: "01",
    title: "Share Requirement",
    description:
      "Tell us technology, duration, number of students, location and training requirements.",
  },
  {
    number: "02",
    title: "Trainer Shortlisting",
    description:
      "Relevant coding trainers are shortlisted based on your institutional requirement.",
  },
  {
    number: "03",
    title: "Demo / Interview",
    description:
      "Your institution can evaluate the trainer through an interview or demo session.",
  },
  {
    number: "04",
    title: "Trainer Deployment",
    description:
      "The selected coding trainer begins the academic or training engagement.",
  },
];

export default function DeploymentProcess() {
  return (
    <section className="bg-[#0b0a12] py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{
            duration: 0.45,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            How It Works
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            From Requirement to
            <span className="text-violet-400">
              {" "}Trainer Deployment
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-5 lg:grid-cols-4">

          {steps.map((step) => (
            <article
              key={step.number}
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
                hover:border-violet-400/80
                hover:bg-violet-500/[0.07]
                hover:shadow-[0_0_8px_rgba(139,92,246,0.65),0_0_22px_rgba(99,102,241,0.25)]
              "
            >
              <span className="text-5xl font-black text-white/[0.06] transition-colors duration-200 group-hover:text-violet-500/20">
                {step.number}
              </span>

              <h3 className="mt-6 text-xl font-semibold">
                {step.title}
              </h3>

              <p className="mt-3 leading-7 text-slate-400">
                {step.description}
              </p>
            </article>
          ))}

        </div>

      </div>
    </section>
  );
}
