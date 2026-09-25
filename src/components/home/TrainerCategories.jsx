import {
  ArrowRight,
  BrainCircuit,
  Code2,
  Database,
  Layers3,
} from "lucide-react";

const specializedCourses = [
  {
    icon: Code2,
    discount: "17% OFF",
    title: "Core Java Mastery",
    text:
      "A structured Java program covering OOP, collections, exception handling and practical application development.",
    price: "₹4,999",
    originalPrice: "₹5,999",
  },
  {
    icon: Code2,
    discount: "17% OFF",
    title: "DSA in Java",
    text:
      "Placement-oriented data structures and algorithms with coding patterns and complexity analysis.",
    note: "Recommended after Core Java.",
    price: "₹4,999",
    originalPrice: "₹5,999",
  },
  {
    icon: Layers3,
    discount: "17% OFF",
    title: "Full-Stack Java Development",
    text:
      "Build Spring Boot APIs, database-driven applications and complete full-stack projects.",
    note: "Recommended after Core Java.",
    price: "₹4,999",
    originalPrice: "₹5,999",
  },
  {
    icon: Code2,
    discount: "17% OFF",
    title: "Python Core",
    text:
      "Learn Python fundamentals, scripting, libraries and practical programming.",
    price: "₹4,999",
    originalPrice: "₹5,999",
  },
  {
    icon: Code2,
    discount: "17% OFF",
    title: "DSA in Python",
    text:
      "Data structures, algorithms and placement-focused problem solving using Python.",
    note: "Recommended after Python Core.",
    price: "₹4,999",
    originalPrice: "₹5,999",
  },
  {
    icon: BrainCircuit,
    discount: "17% OFF",
    title: "Python Machine Learning & Data Science",
    text:
      "NumPy, Pandas, visualization, machine learning fundamentals and applied projects.",
    note: "Recommended after Python Core.",
    price: "₹4,999",
    originalPrice: "₹5,999",
  },
];

const comboCourses = [
  {
    title: "Java Core + DSA Combo",
    text:
      "Build a strong Java foundation and progress into placement-oriented algorithms.",
  },
  {
    title: "Java Core + Full Stack Combo",
    text:
      "Learn Java fundamentals and build complete Spring Boot-based applications.",
  },
  {
    title: "Python Core + DSA Combo",
    text:
      "Build Python fundamentals and strengthen algorithmic problem solving.",
  },
  {
    title: "Python Core + ML & Data Science Combo",
    text:
      "Learn Python foundations before progressing into data analysis and machine learning.",
  },
];

export default function TrainerCategories() {
  return (
    <section
      id="courses"
      className="bg-[#0b0a12] py-28 text-white"
    >

      <div className="mx-auto max-w-7xl px-6">

        <div className="mx-auto max-w-3xl text-center">

          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Our Curated Tracks
          </p>

          <h2 className="mt-4 text-3xl font-bold md:text-5xl">
            Master In-Demand

            <span className="text-violet-400">
              {" "}Technologies
            </span>
          </h2>

          <p className="mt-5 leading-7 text-slate-400">
            Project-based learning tracks designed around programming,
            development, problem solving and placement preparation.
          </p>

        </div>


        <div className="mt-16">

          <h3 className="text-xl font-semibold">
            Specialized Career Tracks
          </h3>


          <div className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">

            {specializedCourses.map((course) => {
              const Icon = course.icon;

              return (
                <article
                  key={course.title}
                  className="
                    group
                    relative
                    transform-gpu
                    rounded-3xl
                    border border-white/10
                    bg-white/[0.035]
                    p-7
                    transition-all duration-200
                    hover:-translate-y-1
                    hover:border-violet-400/80
                    hover:bg-violet-500/[0.07]
                    hover:shadow-[0_0_8px_rgba(139,92,246,0.55),0_0_22px_rgba(99,102,241,0.20)]
                  "
                >

                  <span className="absolute right-5 top-5 rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                    {course.discount}
                  </span>


                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                    <Icon size={23} />
                  </div>


                  <h4 className="mt-6 text-xl font-semibold">
                    {course.title}
                  </h4>

                  <p className="mt-3 min-h-20 leading-7 text-slate-400">
                    {course.text}
                  </p>


                  {course.note && (
                    <p className="mt-3 text-xs text-amber-400/80">
                      {course.note}
                    </p>
                  )}


                  <div className="mt-6 flex items-end gap-3">

                    <span className="text-2xl font-bold">
                      {course.price}
                    </span>

                    <span className="pb-1 text-sm text-slate-600 line-through">
                      {course.originalPrice}
                    </span>

                  </div>


                  <a
                    href="#contact"
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-violet-400"
                  >
                    Learn More
                    <ArrowRight size={16} />
                  </a>

                </article>
              );
            })}

          </div>

        </div>


        {/* COMBOS */}

        <div className="mt-20">

          <div className="flex flex-wrap items-center gap-3">

            <h3 className="text-xl font-semibold">
              Value Combo Programs
            </h3>

            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
              Best Value
            </span>

          </div>


          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {comboCourses.map((course) => (
              <article
                key={course.title}
                className="
                  group
                  rounded-3xl
                  border border-white/10
                  bg-gradient-to-br
                  from-violet-500/[0.08]
                  to-indigo-500/[0.03]
                  p-7
                  transition-all duration-200
                  hover:border-violet-400/80
                  hover:shadow-[0_0_20px_rgba(139,92,246,0.16)]
                "
              >

                <span className="rounded-full bg-violet-500/10 px-3 py-1 text-xs font-semibold text-violet-300">
                  Save ₹1,000
                </span>

                <h4 className="mt-5 text-xl font-semibold">
                  {course.title}
                </h4>

                <p className="mt-3 leading-7 text-slate-400">
                  {course.text}
                </p>

                <div className="mt-6 flex items-center gap-3">

                  <span className="text-2xl font-bold">
                    ₹8,999
                  </span>

                  <span className="text-sm text-slate-600 line-through">
                    ₹9,999
                  </span>

                </div>

              </article>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
