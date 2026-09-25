import { motion } from "motion/react";

const stats = [
  {
    value: "15+",
    label: "Industry Mentors",
  },
  {
    value: "50+",
    label: "Partner Colleges",
  },
  {
    value: "98%",
    label: "Success Rate",
  },
  {
    value: "5000+",
    label: "Students Trained",
  },
];

export default function StatsSection() {
  return (
    <section className="border-y border-white/10 bg-[#0b0a12]">

      <div className="mx-auto grid max-w-7xl grid-cols-2 px-6 py-12 md:grid-cols-4">

        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.35,
              delay: index * 0.05,
            }}
            className="p-5 text-center"
          >
            <p className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-3xl font-bold text-transparent md:text-4xl">
              {stat.value}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              {stat.label}
            </p>
          </motion.div>
        ))}

      </div>

    </section>
  );
}
