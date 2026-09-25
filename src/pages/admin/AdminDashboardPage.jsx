import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowRight,
  Building2,
  CalendarDays,
  ClipboardList,
  TrendingUp,
  UserRoundCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Trainers",
    value: "128",
    change: "+12 this month",
    icon: Users,
  },
  {
    title: "Partner Colleges",
    value: "46",
    change: "+5 this month",
    icon: Building2,
  },
  {
    title: "Open Requests",
    value: "18",
    change: "7 high priority",
    icon: ClipboardList,
  },
  {
    title: "Active Assignments",
    value: "34",
    change: "+8 this month",
    icon: UserRoundCheck,
  },
];

const requests = [
  {
    college: "RKGIT",
    technology: "Java + DSA",
    students: 120,
    status: "New",
  },
  {
    college: "Global University",
    technology: "Python",
    students: 90,
    status: "Shortlisting",
  },
  {
    college: "Tech Institute",
    technology: "Full Stack",
    students: 75,
    status: "Demo",
  },
];

const demos = [
  {
    trainer: "Aman Sharma",
    college: "RKGIT",
    time: "10:30 AM",
    tech: "Java + DSA",
  },
  {
    trainer: "Priya Verma",
    college: "XYZ College",
    time: "02:00 PM",
    tech: "Python AI/ML",
  },
  {
    trainer: "Rahul Mehta",
    college: "Global University",
    time: "04:30 PM",
    tech: "Full Stack",
  },
];

function StatusBadge({ status }) {
  const styles = {
    New: "bg-blue-500/10 text-blue-400",
    Shortlisting: "bg-amber-500/10 text-amber-400",
    Demo: "bg-violet-500/10 text-violet-400",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
      >
        <div>
          

          

          
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-400">
          <TrendingUp
            size={17}
            className="text-emerald-400"
          />
          Platform activity is up
        </div>
      </motion.div>


      {/* STATS */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.article
              key={stat.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.05,
              }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-sm text-slate-500">
                    {stat.title}
                  </p>

                  <p className="mt-3 text-3xl font-bold">
                    {stat.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={21} />
                </div>

              </div>

              <p className="mt-4 text-xs text-slate-600">
                {stat.change}
              </p>
            </motion.article>
          );
        })}

      </div>


      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">

        {/* REQUESTS */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.12,
          }}
          className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]"
        >
          <div className="flex items-center justify-between border-b border-white/[0.07] p-5">

            <div>
              <h3 className="font-semibold">
                Recent Trainer Requests
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Latest requirements from colleges
              </p>
            </div>

            <Link
              to="/admin/requests"
              className="flex items-center gap-1 text-xs font-medium text-violet-400"
            >
              View all
              <ArrowRight size={14} />
            </Link>

          </div>


          <div className="overflow-x-auto">

            <table className="w-full min-w-[620px]">

              <thead>
                <tr className="text-left text-xs text-slate-600">
                  <th className="px-5 py-4 font-medium">College</th>
                  <th className="px-5 py-4 font-medium">Technology</th>
                  <th className="px-5 py-4 font-medium">Students</th>
                  <th className="px-5 py-4 font-medium">Status</th>
                </tr>
              </thead>

              <tbody>
                {requests.map((request) => (
                  <tr
                    key={`${request.college}-${request.technology}`}
                    className="border-t border-white/[0.05] text-sm"
                  >
                    <td className="px-5 py-4 font-medium">
                      {request.college}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {request.technology}
                    </td>

                    <td className="px-5 py-4 text-slate-400">
                      {request.students}
                    </td>

                    <td className="px-5 py-4">
                      <StatusBadge status={request.status} />
                    </td>
                  </tr>
                ))}
              </tbody>

            </table>

          </div>
        </motion.section>


        {/* DEMOS */}
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.4,
            delay: 0.18,
          }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5"
        >
          <div className="flex items-center justify-between">

            <div>
              <h3 className="font-semibold">
                Today's Demos
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Upcoming trainer sessions
              </p>
            </div>

            <CalendarDays
              size={19}
              className="text-violet-400"
            />

          </div>


          <div className="mt-5 space-y-3">

            {demos.map((demo) => (
              <div
                key={`${demo.trainer}-${demo.time}`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4 transition-colors hover:border-violet-500/20"
              >
                <div className="flex items-center justify-between gap-3">

                  <div>
                    <p className="text-sm font-medium">
                      {demo.trainer}
                    </p>

                    <p className="mt-1 text-xs text-slate-600">
                      {demo.college} · {demo.tech}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-lg bg-violet-500/10 px-2.5 py-1.5 text-xs text-violet-400">
                    {demo.time}
                  </span>

                </div>
              </div>
            ))}

          </div>


          <Link
            to="/admin/demos"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/[0.07] py-3 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            View Schedule
            <ArrowRight size={15} />
          </Link>

        </motion.section>

      </div>

    </div>
  );
}

