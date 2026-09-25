import { motion } from "motion/react";
import {
  BookOpen,
  BriefcaseBusiness,
  Code2,
  Presentation,
  Users,
  Workflow,
  GraduationCap,
  BrainCircuit,
} from "lucide-react";

const services = [
  {
    icon: Users,
    title: "Coding Guest Faculty",
    description:
      "Experienced coding trainers for regular academic classes, practical labs and technical sessions.",
  },
  {
    icon: GraduationCap,
    title: "Curriculum Integration",
    description:
      "Training programs aligned with university and college curriculum while adding industry-relevant skills.",
  },
  {
    icon: BookOpen,
    title: "Semester Training",
    description:
      "Structured semester-long technical training programs for Computer Science and IT students.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Placement Training",
    description:
      "Placement-focused coding, DSA, problem solving and technical interview preparation.",
  },
  {
    icon: BrainCircuit,
    title: "Language-Specific DSA",
    description:
      "DSA training in Java, Python, C or C++ according to institutional requirements.",
  },
  {
    icon: Presentation,
    title: "Technical Workshops",
    description:
      "Short-term practical workshops on modern programming tools and technologies.",
  },
  {
    icon: Workflow,
    title: "Coding Bootcamps",
    description:
      "Intensive short-term coding programs designed for fast practical skill development.",
  },
  {
    icon: Code2,
    title: "Technology Training",
    description:
      "Java, Python, Full Stack, AI/ML, Data Science, Cloud and other modern technologies.",
  },
];

export default function GuestFacultyServices() {
  return (
    <section className="bg-[#0b0a12] py-28 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.4,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="max-w-3xl"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Training Solutions
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Curriculum-Aligned Training
            <span className="text-violet-400">
              {" "}for Better Student Outcomes
            </span>
          </h2>

          <p className="mt-5 max-w-2xl leading-7 text-slate-400">
            We help colleges and universities strengthen technical education
            through experienced coding trainers and placement-oriented programs.
          </p>
        </motion.div>


        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-4">

          {services.map(({ icon: Icon, title, description }) => (
            <article
              key={title}
              className="
                group
                transform-gpu
                rounded-3xl
                border border-white/10
                bg-white/[0.035]
                p-7
                transition-all duration-200 ease-out
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
                  transition-all duration-200
                  group-hover:bg-gradient-to-br
                  group-hover:from-violet-600
                  group-hover:to-indigo-600
                  group-hover:text-white
                  group-hover:shadow-[0_0_18px_rgba(139,92,246,0.40)]
                "
              >
                <Icon size={24} />
              </div>

              <h3 className="mt-6 text-lg font-semibold">
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
