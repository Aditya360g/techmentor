import { useState } from "react";
import { motion } from "motion/react";

import {
  BarChart3,
  Building2,
  TrendingUp,
  UserRoundCheck,
  Users,
} from "lucide-react";

const periods = ["7 Days", "30 Days", "90 Days"];

const technologies = [
  { name: "Java + DSA", value: 92 },
  { name: "Python", value: 78 },
  { name: "Full Stack", value: 68 },
  { name: "AI / ML", value: 54 },
  { name: "Data Science", value: 43 },
];

const monthly = [
  { month: "Apr", value: 42 },
  { month: "May", value: 55 },
  { month: "Jun", value: 63 },
  { month: "Jul", value: 58 },
  { month: "Aug", value: 76 },
  { month: "Sep", value: 88 },
];

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30 Days");

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          

          

          
        </div>

        <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.03] p-1">

          {periods.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPeriod(item)}
              className={`rounded-lg px-3 py-2 text-xs font-medium transition-colors ${
                period === item
                  ? "bg-violet-600 text-white"
                  : "text-slate-500 hover:text-white"
              }`}
            >
              {item}
            </button>
          ))}

        </div>
      </motion.div>


      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {[
          {
            label: "Trainer Growth",
            value: "+18.4%",
            icon: Users,
          },
          {
            label: "College Growth",
            value: "+12.8%",
            icon: Building2,
          },
          {
            label: "Assignment Rate",
            value: "84%",
            icon: UserRoundCheck,
          },
          {
            label: "Request Growth",
            value: "+24.1%",
            icon: TrendingUp,
          },
        ].map((item, index) => {
          const Icon = item.icon;

          return (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
            >
              <div className="flex items-center justify-between">

                <div>
                  <p className="text-xs text-slate-600">
                    {item.label}
                  </p>

                  <p className="mt-2 text-2xl font-bold">
                    {item.value}
                  </p>
                </div>

                <Icon
                  size={20}
                  className="text-violet-400"
                />

              </div>

              <p className="mt-4 text-xs text-emerald-400">
                Selected period: {period}
              </p>
            </motion.div>
          );
        })}

      </div>


      <div className="grid gap-6 xl:grid-cols-2">

        {/* MONTHLY */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">
                Monthly Requests
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Request activity overview
              </p>
            </div>

            <BarChart3
              size={19}
              className="text-violet-400"
            />
          </div>


          <div className="mt-8 flex h-[260px] items-end gap-4">

            {monthly.map((item, index) => (
              <div
                key={item.month}
                className="flex h-full flex-1 flex-col justify-end"
              >
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${item.value}%` }}
                  transition={{
                    duration: 0.7,
                    delay: index * 0.05,
                  }}
                  className="min-h-4 rounded-t-xl bg-gradient-to-t from-violet-700 to-violet-400"
                />

                <p className="mt-3 text-center text-xs text-slate-600">
                  {item.month}
                </p>
              </div>
            ))}

          </div>

        </section>


        {/* TECHNOLOGIES */}
        <section className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6">

          <div>
            <h3 className="font-semibold">
              Most Requested Technologies
            </h3>

            <p className="mt-1 text-xs text-slate-600">
              Based on current institutional requirements
            </p>
          </div>


          <div className="mt-7 space-y-5">

            {technologies.map((tech, index) => (
              <div key={tech.name}>

                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">
                    {tech.name}
                  </span>

                  <span className="text-slate-600">
                    {tech.value}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white/[0.05]">

                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${tech.value}%` }}
                    transition={{
                      duration: 0.7,
                      delay: index * 0.06,
                    }}
                    className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500"
                  />

                </div>
              </div>
            ))}

          </div>

        </section>

      </div>

    </div>
  );
}

