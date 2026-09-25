import { motion } from "motion/react";
import {
  BadgeCheck,
  BookOpenCheck,
  Building2,
  Code2,
  GraduationCap,
  Target,
  Users,
} from "lucide-react";

const values = [
  {
    icon: GraduationCap,
    title: "Institution Focused",
    text:
      "Programs designed around university, college and Computer Science department requirements.",
  },
  {
    icon: Code2,
    title: "Practical Learning",
    text:
      "Hands-on coding, problem solving and development-focused learning.",
  },
  {
    icon: BadgeCheck,
    title: "Verified Trainers",
    text:
      "Trainer selection based on technical skills, teaching ability and experience.",
  },
  {
    icon: Target,
    title: "Student Outcomes",
    text:
      "Training aligned with academic growth, placements and industry readiness.",
  },
];

const stats = [
  ["50+", "Coding Trainers"],
  ["20+", "Partner Institutions"],
  ["5000+", "Students Trained"],
  ["15+", "Technologies"],
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#08070f] pb-24 pt-36 text-white">

      <section className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mx-auto max-w-4xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            About CodeFaculty
          </p>

          <h1 className="mt-5 text-4xl font-bold leading-tight md:text-6xl">
            Connecting Institutions with

            <span className="block text-violet-400">
              Industry-Ready Coding Trainers
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-slate-400">
            CodeFaculty helps colleges and universities find experienced
            technical trainers for guest faculty programs, semester training,
            placement preparation, workshops and modern technology programs.
          </p>
        </motion.div>


        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {stats.map(([value, label], index) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 text-center"
            >
              <p className="text-3xl font-bold text-violet-400">
                {value}
              </p>

              <p className="mt-2 text-sm text-slate-500">
                {label}
              </p>
            </motion.div>
          ))}

        </div>


        <div className="mt-24 grid items-center gap-14 lg:grid-cols-2">

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-violet-400">
              Our Purpose
            </p>

            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Bridging Academic Learning and Industry Skills
            </h2>

            <p className="mt-6 leading-8 text-slate-400">
              Academic institutions often need trainers who can deliver
              curriculum-aligned education while also bringing modern
              industry practices into the classroom.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              We help institutions identify trainers according to technology,
              experience, location, duration and training mode.
            </p>


            <div className="mt-8 space-y-4">

              {[
                "Guest faculty for CS and IT programs",
                "Placement-focused technical training",
                "Technology-specific workshops",
                "Short-term and semester engagements",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-slate-300"
                >
                  <BookOpenCheck
                    size={18}
                    className="text-violet-400"
                  />

                  {item}
                </div>
              ))}

            </div>
          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-[32px] border border-white/[0.08] bg-gradient-to-br from-violet-500/[0.10] to-indigo-500/[0.03] p-8"
          >
            <div className="grid gap-4 sm:grid-cols-2">

              {values.map(({ icon: Icon, title, text }) => (
                <article
                  key={title}
                  className="rounded-2xl border border-white/[0.07] bg-[#0d0c14]/80 p-5 transition-all duration-200 hover:-translate-y-1 hover:border-violet-500/40"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Icon size={20} />
                  </div>

                  <h3 className="mt-4 font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {text}
                  </p>
                </article>
              ))}

            </div>
          </motion.div>

        </div>


        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 grid gap-5 md:grid-cols-3"
        >
          {[
            {
              icon: Building2,
              title: "For Institutions",
              text:
                "Flexible trainer engagement according to academic and placement requirements.",
            },
            {
              icon: Users,
              title: "For Students",
              text:
                "Practical coding experience aligned with current industry expectations.",
            },
            {
              icon: GraduationCap,
              title: "For Trainers",
              text:
                "Opportunities to work with colleges and technical education programs.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
            >
              <Icon className="text-violet-400" />

              <h3 className="mt-5 text-lg font-semibold">
                {title}
              </h3>

              <p className="mt-3 leading-7 text-slate-500">
                {text}
              </p>
            </article>
          ))}
        </motion.div>

      </section>

    </main>
  );
}
