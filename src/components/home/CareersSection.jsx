import {
  ArrowRight,
  BriefcaseBusiness,
  GraduationCap,
  Users,
} from "lucide-react";
import { Link } from "react-router";

const opportunities = [
  {
    icon: BriefcaseBusiness,
    badge: "Hiring",
    title: "Jobs — Full & Part-Time",
    text:
      "Join as a trainer, course developer, coordinator, administrator or technology professional.",
    button: "Explore Jobs",
  },
  {
    icon: GraduationCap,
    badge: "Active",
    title: "Internships",
    text:
      "Work on practical education projects, training operations and technology systems with mentorship.",
    button: "Apply for Internship",
  },
  {
    icon: Users,
    badge: "Popular",
    title: "Campus Leader & Ambassador",
    text:
      "Represent the learning ecosystem on campus, coordinate technical events and build student communities.",
    button: "Become Campus Leader",
  },
];

export default function CareersSection() {
  return (
    <section className="bg-[#0b0a12] py-28 text-white">

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Careers & Opportunities
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Join Our

            <span className="text-violet-400">
              {" "}Learning Ecosystem
            </span>
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            Build education systems, train students, gain practical
            experience or represent technical learning on your campus.
          </p>

        </div>


        <div className="mt-16 grid gap-5 md:grid-cols-3">

          {opportunities.map(({ icon: Icon, badge, title, text, button }) => (
            <article
              key={title}
              className="
                group
                transform-gpu
                rounded-3xl
                border border-white/10
                bg-white/[0.035]
                p-7
                transition-all duration-200
                hover:-translate-y-1
                hover:border-violet-400/80
                hover:bg-violet-500/[0.07]
                hover:shadow-[0_0_8px_rgba(139,92,246,0.50),0_0_20px_rgba(99,102,241,0.18)]
              "
            >

              <div className="flex items-start justify-between">

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={22} />
                </div>

                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                  {badge}
                </span>

              </div>

              <h3 className="mt-6 text-xl font-semibold">
                {title}
              </h3>

              <p className="mt-3 min-h-24 leading-7 text-slate-400">
                {text}
              </p>

              <Link
                to="/contact"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-400"
              >
                {button}
                <ArrowRight size={16} />
              </Link>

            </article>
          ))}

        </div>

      </div>

    </section>
  );
}
