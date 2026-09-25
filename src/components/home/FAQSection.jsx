import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown } from "lucide-react";

const questions = [
  {
    question: "Do you provide trainers for on-campus classes?",
    answer:
      "Yes. Coding trainers can be provided for on-campus guest faculty engagements depending on technology, location and trainer availability.",
  },
  {
    question: "Can colleges interview trainers before final selection?",
    answer:
      "Yes. Colleges and universities can conduct an interview or demo session before finalizing a trainer.",
  },
  {
    question: "Which technologies do your trainers cover?",
    answer:
      "Our trainers cover Java, Python, C, C++, DSA, Full Stack Development, Spring Boot, React, AI/ML, Data Science and many other technologies.",
  },
  {
    question: "Can we hire a trainer for a complete semester?",
    answer:
      "Yes. Trainers can be engaged for full-semester programs, short-term programs, workshops or bootcamps.",
  },
  {
    question: "Do you provide placement-focused trainers?",
    answer:
      "Yes. Placement training can include DSA, coding practice, technical interview preparation and problem-solving.",
  },
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#0b0a12] py-28 text-white">
      <div className="mx-auto grid max-w-7xl gap-14 px-6 lg:grid-cols-[0.8fr_1.2fr]">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            FAQ
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Common
            <span className="text-violet-400">
              {" "}Questions
            </span>
          </h2>

          <p className="mt-5 max-w-md leading-7 text-slate-400">
            Important information institutions may need before requesting
            coding guest faculty.
          </p>
        </motion.div>

        <div className="space-y-3">

          {questions.map((item, index) => {
            const active = openIndex === index;

            return (
              <div
                key={item.question}
                className={`
                  overflow-hidden
                  rounded-2xl
                  border
                  bg-white/[0.03]
                  transition-all
                  duration-200
                  ${
                    active
                      ? "border-violet-500/60 shadow-[0_0_16px_rgba(139,92,246,0.15)]"
                      : "border-white/10"
                  }
                `}
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(active ? -1 : index)
                  }
                  className="flex w-full items-center justify-between gap-5 px-6 py-5 text-left"
                >
                  <span className="font-medium">
                    {item.question}
                  </span>

                  <motion.div
                    animate={{
                      rotate: active ? 180 : 0,
                    }}
                    transition={{
                      duration: 0.2,
                    }}
                  >
                    <ChevronDown
                      size={19}
                      className={
                        active
                          ? "text-violet-400"
                          : "text-slate-500"
                      }
                    />
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {active && (
                    <motion.div
                      initial={{
                        height: 0,
                        opacity: 0,
                      }}
                      animate={{
                        height: "auto",
                        opacity: 1,
                      }}
                      exit={{
                        height: 0,
                        opacity: 0,
                      }}
                      transition={{
                        duration: 0.25,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      <p className="px-6 pb-6 leading-7 text-slate-400">
                        {item.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}

        </div>

      </div>
    </section>
  );
}
