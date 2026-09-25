import { motion } from "motion/react";
import { Quote } from "lucide-react";

const reviews = [
  {
    text:
      "The trainer delivered strong technical sessions and connected extremely well with our students.",
    person: "Training & Placement Head",
    institution: "Engineering College",
  },
  {
    text:
      "The trainer selection process was smooth and the quality of technical teaching was excellent.",
    person: "HOD - Computer Science",
    institution: "University",
  },
  {
    text:
      "Our students received practical coding exposure that complemented their academic curriculum.",
    person: "Program Coordinator",
    institution: "Technical Institute",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="bg-[#08070f] py-28 text-white">
      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{
            opacity: 0,
            y: 18,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
          }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Testimonials
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            What Institutions
            <span className="text-violet-400">
              {" "}Say
            </span>
          </h2>
        </motion.div>

        <div className="mt-16 grid gap-5 md:grid-cols-3">

          {reviews.map((review) => (
            <article
              key={review.person}
              className="
                group
                transform-gpu
                rounded-3xl
                border border-white/10
                bg-white/[0.035]
                p-7
                transition-all duration-200 ease-out
                hover:-translate-y-1
                hover:border-violet-400/70
                hover:bg-violet-500/[0.06]
                hover:shadow-[0_0_8px_rgba(139,92,246,0.45),0_0_20px_rgba(99,102,241,0.18)]
              "
            >
              <Quote className="text-violet-400 transition-transform duration-200 group-hover:scale-110" />

              <p className="mt-6 leading-8 text-slate-300">
                “{review.text}”
              </p>

              <div className="mt-7 border-t border-white/10 pt-5">
                <p className="font-semibold">
                  {review.person}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {review.institution}
                </p>
              </div>
            </article>
          ))}

        </div>

      </div>
    </section>
  );
}
