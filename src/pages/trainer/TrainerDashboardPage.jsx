import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowRight,
  Bell,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  GraduationCap,
} from "lucide-react";

const stats = [
  {
    label: "Active Assignments",
    value: "2",
    icon: GraduationCap,
  },
  {
    label: "Upcoming Sessions",
    value: "6",
    icon: CalendarDays,
  },
  {
    label: "Completed Programs",
    value: "12",
    icon: CheckCircle2,
  },
  {
    label: "Pending Payment",
    value: "₹38,000",
    icon: CreditCard,
  },
];

const assignments = [
  {
    college: "RKGIT",
    technology: "Java + DSA",
    students: 120,
    duration: "4 Months",
    progress: 34,
  },
  {
    college: "XYZ College",
    technology: "Spring Boot",
    students: 80,
    duration: "8 Weeks",
    progress: 62,
  },
];

const sessions = [
  {
    college: "RKGIT",
    subject: "Binary Search & Problems",
    date: "25 Sep",
    time: "10:30 AM",
  },
  {
    college: "XYZ College",
    subject: "Spring Boot REST APIs",
    date: "25 Sep",
    time: "03:00 PM",
  },
  {
    college: "RKGIT",
    subject: "Trees & Traversals",
    date: "26 Sep",
    time: "11:00 AM",
  },
];

export default function TrainerDashboardPage() {
  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">
          Trainer Dashboard
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Manage assignments, sessions and training activity.
        </p>
      </motion.div>


      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.article
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ y: -3 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-xs text-slate-600">
                    {item.label}
                  </p>

                  <p className="mt-3 text-2xl font-bold">
                    {item.value}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={20} />
                </div>

              </div>
            </motion.article>
          );
        })}

      </div>


      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">

        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">

          <div className="flex items-center justify-between">

            <div>
              <h3 className="font-semibold">
                Active Assignments
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Current institutional programs
              </p>
            </div>

            <Link
              to="/trainer/assignments"
              className="flex items-center gap-1 text-xs text-violet-400"
            >
              View all
              <ArrowRight size={14} />
            </Link>

          </div>


          <div className="mt-5 space-y-4">

            {assignments.map((assignment) => (
              <article
                key={`${assignment.college}-${assignment.technology}`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
              >

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h4 className="font-medium">
                      {assignment.college}
                    </h4>

                    <p className="mt-1 text-sm text-violet-400">
                      {assignment.technology}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                    Active
                  </span>

                </div>


                <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
                  <span>
                    {assignment.students} Students
                  </span>

                  <span>
                    {assignment.duration}
                  </span>
                </div>


                <div className="mt-4">

                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Progress</span>
                    <span>{assignment.progress}%</span>
                  </div>

                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.05]">

                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${assignment.progress}%`,
                      }}
                      transition={{ duration: 0.7 }}
                      className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                    />

                  </div>

                </div>

              </article>
            ))}

          </div>

        </section>


        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Upcoming Sessions
            </h3>

            <CalendarDays
              size={19}
              className="text-violet-400"
            />
          </div>


          <div className="mt-5 space-y-3">

            {sessions.map((session) => (
              <div
                key={`${session.date}-${session.time}`}
                className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
              >
                <p className="font-medium">
                  {session.subject}
                </p>

                <p className="mt-1 text-xs text-slate-600">
                  {session.college}
                </p>

                <div className="mt-3 flex gap-4 text-xs text-slate-500">

                  <span className="flex items-center gap-1">
                    <CalendarDays size={13} />
                    {session.date}
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock3 size={13} />
                    {session.time}
                  </span>

                </div>
              </div>
            ))}

          </div>


          <Link
            to="/trainer/schedule"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            View Schedule
            <ArrowRight size={15} />
          </Link>

        </section>

      </div>


      <div className="grid gap-4 md:grid-cols-3">

        <Link
          to="/trainer/availability"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-violet-500/30"
        >
          <Clock3 className="text-violet-400" />

          <h3 className="mt-4 font-semibold">
            Availability
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Manage your weekly availability.
          </p>
        </Link>


        <Link
          to="/trainer/notifications"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-violet-500/30"
        >
          <Bell className="text-violet-400" />

          <h3 className="mt-4 font-semibold">
            Notifications
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Check assignment and demo updates.
          </p>
        </Link>


        <Link
          to="/trainer/payments"
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-violet-500/30"
        >
          <CreditCard className="text-violet-400" />

          <h3 className="mt-4 font-semibold">
            Payments
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Track payment records.
          </p>
        </Link>

      </div>

    </div>
  );
}
