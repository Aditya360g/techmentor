import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowRight,
  CalendarDays,
  ClipboardList,
  CreditCard,
  Search,
  UserRoundCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Active Requests",
    value: "4",
    icon: ClipboardList,
  },
  {
    label: "Assigned Trainers",
    value: "3",
    icon: UserRoundCheck,
  },
  {
    label: "Upcoming Demos",
    value: "2",
    icon: CalendarDays,
  },
  {
    label: "Students Covered",
    value: "340",
    icon: Users,
  },
];

const requests = [
  {
    id: "REQ-1001",
    technology: "Java + DSA",
    students: 120,
    status: "Shortlisting",
  },
  {
    id: "REQ-1005",
    technology: "Python",
    students: 80,
    status: "Demo",
  },
  {
    id: "REQ-1010",
    technology: "Full Stack",
    students: 65,
    status: "New",
  },
];

const assignments = [
  {
    trainer: "Aman Sharma",
    technology: "Java + DSA",
    duration: "4 Months",
    status: "Active",
  },
  {
    trainer: "Priya Verma",
    technology: "Python",
    duration: "8 Weeks",
    status: "Active",
  },
];

const statusStyles = {
  New: "bg-blue-500/10 text-blue-400",
  Shortlisting: "bg-amber-500/10 text-amber-400",
  Demo: "bg-violet-500/10 text-violet-400",
  Active: "bg-emerald-500/10 text-emerald-400",
};

export default function CollegeDashboardPage() {
  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">
            College Dashboard
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage trainer requirements and active programs.
          </p>
        </div>

        <Link
          to="/college/trainers"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition-colors hover:bg-violet-500"
        >
          <Search size={17} />
          Find Trainers
        </Link>
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

                  <p className="mt-3 text-3xl font-bold">
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


      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">

        <section className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">

          <div className="flex items-center justify-between border-b border-white/[0.06] p-5">

            <div>
              <h3 className="font-semibold">
                Recent Requests
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Latest trainer requirements
              </p>
            </div>

            <Link
              to="/college/requests"
              className="flex items-center gap-1 text-xs font-medium text-violet-400"
            >
              View all
              <ArrowRight size={14} />
            </Link>

          </div>


          <div className="divide-y divide-white/[0.05]">

            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div>
                  <p className="text-xs text-slate-600">
                    {request.id}
                  </p>

                  <p className="mt-1 font-medium">
                    {request.technology}
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {request.students} Students
                  </p>
                </div>

                <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[request.status]}`}>
                  {request.status}
                </span>
              </div>
            ))}

          </div>

        </section>


        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-5">

          <div className="flex items-center justify-between">
            <h3 className="font-semibold">
              Current Assignments
            </h3>

            <UserRoundCheck
              size={19}
              className="text-violet-400"
            />
          </div>


          <div className="mt-5 space-y-3">

            {assignments.map((assignment) => (
              <div
                key={assignment.trainer}
                className="rounded-xl border border-white/[0.06] bg-white/[0.025] p-4"
              >
                <div className="flex items-start justify-between gap-3">

                  <div>
                    <p className="font-medium">
                      {assignment.trainer}
                    </p>

                    <p className="mt-1 text-xs text-violet-400">
                      {assignment.technology}
                    </p>

                    <p className="mt-2 text-xs text-slate-600">
                      {assignment.duration}
                    </p>
                  </div>

                  <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                    {assignment.status}
                  </span>

                </div>
              </div>
            ))}

          </div>

          <Link
            to="/college/assignments"
            className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] py-3 text-sm text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-white"
          >
            View Assignments
            <ArrowRight size={15} />
          </Link>

        </section>

      </div>


      <div className="grid gap-4 md:grid-cols-3">

        <Link
          to="/college/demo-schedule"
          className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-violet-500/30"
        >
          <CalendarDays className="text-violet-400" />

          <h3 className="mt-4 font-semibold">
            Demo Schedule
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Manage trainer interviews and demos.
          </p>
        </Link>


        <Link
          to="/college/payments"
          className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-violet-500/30"
        >
          <CreditCard className="text-violet-400" />

          <h3 className="mt-4 font-semibold">
            Payments
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            View invoices and payment status.
          </p>
        </Link>


        <Link
          to="/college/requests"
          className="group rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-all hover:-translate-y-1 hover:border-violet-500/30"
        >
          <ClipboardList className="text-violet-400" />

          <h3 className="mt-4 font-semibold">
            New Requirement
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Submit a new trainer requirement.
          </p>
        </Link>

      </div>

    </div>
  );
}
