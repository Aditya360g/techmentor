import {
  Building2,
  Medal,
  Trophy,
} from "lucide-react";

/*
  DEMO DATA:
  Replace college/student names with verified data before deployment.
*/

const colleges = [
  {
    rank: "#1",
    name: "Featured Engineering College",
  },
  {
    rank: "#2",
    name: "Partner Technical Institute",
  },
  {
    rank: "#3",
    name: "University Partner",
  },
];

const solvers = [
  {
    rank: "#1",
    name: "Student A",
    college: "Independent Learner",
    solved: "561 solved",
  },
  {
    rank: "#2",
    name: "Student B",
    college: "Partner University",
    solved: "403 solved",
  },
  {
    rank: "#3",
    name: "Student C",
    college: "Engineering College",
    solved: "300 solved",
  },
];

export default function InstitutionPartners() {
  return (
    <section className="bg-[#08070f] py-24 text-white">

      <div className="mx-auto grid max-w-7xl gap-6 px-6 lg:grid-cols-2">

        {/* COLLEGES */}

        <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Building2 size={22} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-400">
                Institution Network
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Top Colleges
              </h2>
            </div>

          </div>


          <div className="mt-7 space-y-3">

            {colleges.map((college) => (
              <div
                key={college.rank}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                  transition-all duration-200
                  hover:border-violet-400/70
                  hover:bg-violet-500/[0.07]
                  hover:shadow-[0_0_16px_rgba(139,92,246,0.15)]
                "
              >
                <span className="text-lg font-bold text-violet-400">
                  {college.rank}
                </span>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.05] text-slate-400">
                  <Building2 size={19} />
                </div>

                <p className="font-semibold">
                  {college.name}
                </p>

              </div>
            ))}

          </div>

        </div>


        {/* TOP SOLVERS */}

        <div className="rounded-[30px] border border-white/10 bg-white/[0.03] p-7">

          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <Trophy size={22} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-violet-400">
                Coding Performance
              </p>

              <h2 className="mt-1 text-2xl font-bold">
                Top Solvers
              </h2>
            </div>

          </div>


          <div className="mt-7 space-y-3">

            {solvers.map((solver, index) => (
              <div
                key={solver.rank}
                className="
                  group
                  flex
                  items-center
                  gap-4
                  rounded-2xl
                  border border-white/[0.07]
                  bg-white/[0.025]
                  p-4
                  transition-all duration-200
                  hover:border-violet-400/70
                  hover:bg-violet-500/[0.07]
                "
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-500/10 text-violet-400">
                  <Medal size={18} />
                </div>

                <div className="min-w-0 flex-1">

                  <p className="font-semibold">
                    {solver.name}
                  </p>

                  <p className="mt-1 truncate text-xs text-slate-500">
                    {solver.college}
                  </p>

                </div>

                <div className="text-right">

                  <p className="font-semibold text-violet-400">
                    {solver.solved}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    {index === 0 ? "Top Performer" : solver.rank}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

    </section>
  );
}
