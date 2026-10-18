import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  Trophy,
  Target,
  ClipboardCheck,
  TrendingUp,
} from "lucide-react";

import { previousResults } from "../../data/student/testsData";
import ResultCard from "../../components/student/ResultCard";

function AnimatedNumber({ value, suffix = "" }) {
  const [count, setCount] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const target = Number.isFinite(Number(value)) ? Number(value) : 0;

    if (reduceMotion) {
      setCount(target);
      return;
    }

    let frameId;
    let startTime;

    const duration = 1400;

    const animate = (timestamp) => {
      if (startTime === undefined) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easedProgress = 1 - Math.pow(1 - progress, 4);

      setCount(Math.round(easedProgress * target));

      if (progress < 1) {
        frameId = requestAnimationFrame(animate);
      }
    };

    setCount(0);
    frameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frameId);
  }, [value, reduceMotion]);

  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default function ResultsPage() {
  const reduceMotion = useReducedMotion();

  const average = previousResults.length
    ? Math.round(
      previousResults.reduce(
        (sum, result) => sum + (Number(result.score) || 0),
        0
      ) / previousResults.length
    )
    : 0;

  const bestScore = previousResults.length
    ? Math.max(
      ...previousResults.map((item) => Number(item.score) || 0)
    )
    : 0;

  const stats = [
    {
      label: "Average Score",
      value: average,
      suffix: "%",
      icon: Target,
      color: "text-violet-700",
      iconStyle:
        "bg-violet-50 text-violet-600 group-hover:bg-violet-100",
      barStyle: "bg-violet-500",
    },
    {
      label: "Tests Completed",
      value: previousResults.length,
      suffix: "",
      icon: ClipboardCheck,
      color: "text-slate-900",
      iconStyle:
        "bg-blue-50 text-blue-600 group-hover:bg-blue-100",
      barStyle: "bg-blue-500",
    },
    {
      label: "Best Score",
      value: bestScore,
      suffix: "%",
      icon: Trophy,
      color: "text-emerald-600",
      iconStyle:
        "bg-emerald-50 text-emerald-600 group-hover:bg-emerald-100",
      barStyle: "bg-emerald-500",
    },
  ];

  return (
    <div className="min-w-0 space-y-7">
      {/* Animated Statistics */}
      <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.article
              key={stat.label}
              initial={reduceMotion ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.45,
                delay: index * 0.12,
                ease: "easeOut",
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                    y: -6,
                    scale: 1.02,
                    transition: { duration: 0.2 },
                  }
              }
              className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50"
            >
              {/* Top Accent */}
              <div
                className={`absolute inset-x-0 top-0 h-1 origin-left scale-x-0 ${stat.barStyle} transition-transform duration-300 group-hover:scale-x-100`}
              />

              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  {stat.label}
                </p>

                <motion.div
                  whileHover={
                    reduceMotion
                      ? undefined
                      : { rotate: -8, scale: 1.12 }
                  }
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 12,
                  }}
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors duration-300 ${stat.iconStyle}`}
                >
                  <Icon size={20} />
                </motion.div>
              </div>

              {/* Count-up Animation */}
              <motion.p
                initial={reduceMotion ? false : { scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + index * 0.12,
                  type: "spring",
                  stiffness: 180,
                  damping: 16,
                }}
                className={`mt-5 text-4xl font-bold tracking-tight tabular-nums ${stat.color}`}
              >
                <AnimatedNumber
                  value={stat.value}
                  suffix={stat.suffix}
                />
              </motion.p>

              {/* Animated Progress Bar */}
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{
                    width: `${stat.suffix === "%"
                      ? Math.min(100, Math.max(0, stat.value))
                      : stat.value > 0
                        ? 100
                        : 0
                      }%`,
                  }}
                  transition={{
                    duration: 1.2,
                    delay: 0.3 + index * 0.12,
                    ease: "easeOut",
                  }}
                  className={`h-full rounded-full ${stat.barStyle}`}
                />
              </div>
            </motion.article>
          );
        })}
      </div>

      {/* Previous Test Results */}
      <section className="space-y-4">
        {previousResults.length > 0 ? (
          previousResults.map((result, index) => (
            <motion.div
              key={result.id ?? index}
              initial={reduceMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              whileHover={
                reduceMotion
                  ? undefined
                  : {
                    y: -3,
                    transition: { duration: 0.2 },
                  }
              }
              className="min-w-0"
            >
              <ResultCard result={result} />
            </motion.div>
          ))
        ) : (
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center"
          >
            <motion.div
              animate={reduceMotion ? undefined : { y: [0, -5, 0] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <TrendingUp
                size={30}
                className="mx-auto text-violet-500"
              />
            </motion.div>

            <h3 className="mt-3 font-bold text-slate-900">
              No results yet
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Complete a test to see your results here.
            </p>
          </motion.div>
        )}
      </section>
    </div>
  );
}