
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Layers3,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  UserRoundCheck,
  Users,
  Video,
  Wallet,
  Zap,
} from "lucide-react";

/* ----------------------------------
   DEMO DATA
---------------------------------- */

const stats = [
  {
    title: "Total Students",
    value: "1,284",
    change: "+12.8%",
    trend: "up",
    caption: "compared to last month",
    icon: GraduationCap,
    color: "sky",
    progress: 78,
  },
  {
    title: "Active Trainers",
    value: "48",
    change: "+8.2%",
    trend: "up",
    caption: "across all programs",
    icon: UserRoundCheck,
    color: "indigo",
    progress: 68,
  },
  {
    title: "Active Programs",
    value: "16",
    change: "+3 this month",
    trend: "up",
    caption: "learning programs",
    icon: BookOpen,
    color: "cyan",
    progress: 84,
  },
  {
    title: "Placement Rate",
    value: "86.4%",
    change: "+4.6%",
    trend: "up",
    caption: "placement performance",
    icon: Target,
    color: "emerald",
    progress: 86,
  },
];

const enrollmentData = [
  { month: "May", students: 740, placements: 410 },
  { month: "Jun", students: 820, placements: 465 },
  { month: "Jul", students: 790, placements: 490 },
  { month: "Aug", students: 960, placements: 560 },
  { month: "Sep", students: 1080, placements: 640 },
  { month: "Oct", students: 1284, placements: 720 },
];

const requests = [
  {
    id: "REQ-1024",
    title: "Full Stack Development",
    category: "Web Development",
    students: 120,
    date: "22 Oct 2026",
    status: "Shortlisting",
    initials: "FS",
    color: "sky",
  },
  {
    id: "REQ-1023",
    title: "Python & Data Science",
    category: "AI & Data Science",
    students: 85,
    date: "23 Oct 2026",
    status: "Demo Scheduled",
    initials: "PY",
    color: "indigo",
  },
  {
    id: "REQ-1022",
    title: "Java + DSA",
    category: "Programming",
    students: 150,
    date: "25 Oct 2026",
    status: "New Request",
    initials: "JV",
    color: "cyan",
  },
];

const upcomingClasses = [
  {
    title: "Full Stack Development",
    trainer: "Aman Sharma",
    time: "10:30 AM",
    date: "Today",
    duration: "90 min",
    type: "Live Class",
    color: "sky",
  },
  {
    title: "Python for Beginners",
    trainer: "Priya Verma",
    time: "12:00 PM",
    date: "Today",
    duration: "60 min",
    type: "Demo Session",
    color: "indigo",
  },
  {
    title: "DSA Problem Solving",
    trainer: "Rahul Mehta",
    time: "02:30 PM",
    date: "Tomorrow",
    duration: "90 min",
    type: "Live Class",
    color: "cyan",
  },
];

const activities = [
  {
    title: "New trainer request received",
    detail: "Full Stack Development · 120 students",
    time: "12 minutes ago",
    icon: UserRoundCheck,
    color: "sky",
  },
  {
    title: "Python demo scheduled",
    detail: "Priya Verma · Tomorrow at 12:00 PM",
    time: "45 minutes ago",
    icon: CalendarDays,
    color: "indigo",
  },
  {
    title: "Payment successfully processed",
    detail: "Invoice #INV-2084 · ₹24,500",
    time: "2 hours ago",
    icon: Wallet,
    color: "emerald",
  },
  {
    title: "New students enrolled",
    detail: "Java + DSA · 28 new enrollments",
    time: "4 hours ago",
    icon: Users,
    color: "cyan",
  },
];

const statusClasses = {
  Shortlisting:
    "border-amber-400/15 bg-amber-400/[0.08] text-amber-300",
  "Demo Scheduled":
    "border-indigo-400/15 bg-indigo-400/[0.08] text-indigo-300",
  "New Request":
    "border-sky-400/15 bg-sky-400/[0.08] text-sky-300",
};

const colorClasses = {
  sky: {
    icon: "bg-sky-400/10 text-sky-300",
    bar: "bg-sky-400",
    border: "hover:border-sky-400/25",
    avatar: "bg-sky-400/10 text-sky-300",
  },
  indigo: {
    icon: "bg-indigo-400/10 text-indigo-300",
    bar: "bg-indigo-400",
    border: "hover:border-indigo-400/25",
    avatar: "bg-indigo-400/10 text-indigo-300",
  },
  cyan: {
    icon: "bg-cyan-400/10 text-cyan-300",
    bar: "bg-cyan-400",
    border: "hover:border-cyan-400/25",
    avatar: "bg-cyan-400/10 text-cyan-300",
  },
  emerald: {
    icon: "bg-emerald-400/10 text-emerald-300",
    bar: "bg-emerald-400",
    border: "hover:border-emerald-400/25",
    avatar: "bg-emerald-400/10 text-emerald-300",
  },
};

/* ----------------------------------
   ANIMATION SETTINGS
---------------------------------- */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.075,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* ----------------------------------
   REUSABLE COMPONENTS
---------------------------------- */

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.18em] text-sky-300/75">
            {eyebrow}
          </p>
        )}

        <h2 className="text-base font-semibold tracking-tight text-slate-100 sm:text-lg">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={[
        "rounded-2xl border border-white/[0.075]",
        "bg-[#101B2B]/85 shadow-[0_12px_35px_rgba(0,0,0,0.12)]",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}

function SmallLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-300 transition-colors hover:text-sky-200"
    >
      {children}
      <ArrowRight size={14} />
    </Link>
  );
}

function StatusBadge({ status }) {
  return (
    <span
      className={[
        "inline-flex items-center whitespace-nowrap rounded-full border px-2.5 py-1",
        "text-[10px] font-semibold sm:text-[11px]",
        statusClasses[status] ||
        "border-white/10 bg-white/[0.04] text-slate-300",
      ].join(" ")}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}

/* ----------------------------------
   MAIN DASHBOARD
---------------------------------- */

export default function CollegeDashboardPage() {
  const [period, setPeriod] = useState("6 months");
  const [activityExpanded, setActivityExpanded] = useState(false);

  const visibleActivities = useMemo(
    () =>
      activityExpanded
        ? activities
        : activities.slice(0, 3),
    [activityExpanded]
  );

  const chartData = useMemo(() => {
    if (period === "3 months") {
      return enrollmentData.slice(-3);
    }

    return enrollmentData;
  }, [period]);

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto w-full max-w-[1600px] space-y-7 pb-8 text-slate-100 sm:space-y-8"
    >
      {/* PAGE HEADER */}

      <motion.header
        variants={itemVariants}
        className="flex flex-col justify-between gap-5 xl:flex-row xl:items-center"
      >
        <div>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-300/15 bg-sky-300/[0.06] px-3 py-1.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-sky-200">
              Institution workspace
            </span>
          </div>

          <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl xl:text-[34px]">
            College Dashboard
            <span className="ml-2 inline-block">👋</span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Your campus at a glance. Track student growth, manage
            trainers, and keep every learning program on track.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/college/notifications"
            aria-label="View notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/[0.035] text-slate-300 transition-all hover:border-sky-300/25 hover:bg-sky-300/[0.06] hover:text-sky-200"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#101B2B] bg-sky-400" />
          </Link>

          <Link
            to="/college/requests"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-sky-300/20 bg-sky-400 px-4 text-xs font-bold text-[#071322] shadow-lg shadow-sky-500/10 transition-all hover:-translate-y-0.5 hover:bg-sky-300 sm:px-5 sm:text-sm"
          >
            <Plus size={17} />
            New Requirement
          </Link>
        </div>
      </motion.header>

      {/* WELCOME BANNER */}

      <motion.section
        variants={itemVariants}
        className="relative isolate overflow-hidden rounded-[24px] border border-sky-300/15 bg-gradient-to-br from-[#122B43] via-[#102237] to-[#111B30] p-5 sm:p-7 lg:p-8"
      >
        <div className="pointer-events-none absolute -right-16 -top-28 -z-10 h-72 w-72 rounded-full bg-sky-400/[0.09] blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 right-1/4 -z-10 h-56 w-56 rounded-full bg-indigo-400/[0.08] blur-3xl" />

        <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-sky-200">
              <Sparkles size={17} />
              <span className="text-[10px] font-bold uppercase tracking-[0.17em]">
                Your campus command center
              </span>
            </div>

            <h2 className="max-w-xl text-xl font-bold leading-tight tracking-tight text-white sm:text-2xl lg:text-[30px]">
              Better learning outcomes
              <span className="block text-sky-300">
                start with better visibility.
              </span>
            </h2>

            <p className="mt-3 max-w-lg text-xs leading-6 text-slate-300/80 sm:text-sm">
              Monitor academic performance, coordinate your trainers,
              and discover what needs attention today — all in one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/college/analytics"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-bold text-slate-900 transition-all hover:-translate-y-0.5 hover:bg-sky-100"
              >
                Explore Analytics
                <ArrowUpRight size={15} />
              </Link>

              <Link
                to="/college/trainers"
                className="inline-flex items-center gap-2 rounded-xl border border-white/15 bg-white/[0.045] px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-white/10"
              >
                <Search size={15} />
                Find Trainers
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 lg:w-[260px] lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-black/[0.13] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-300">
                  Student engagement
                </span>
                <Activity size={15} className="text-sky-300" />
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-2xl font-bold text-white">
                  92.8%
                </span>
                <span className="mb-1 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-300">
                  <ArrowUpRight size={12} />
                  6.4%
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "92.8%" }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/[0.13] p-4 backdrop-blur-sm">
              <div className="flex items-center justify-between gap-2">
                <span className="text-[11px] text-slate-300">
                  Programs running
                </span>
                <Layers3 size={15} className="text-indigo-300" />
              </div>

              <div className="mt-3 flex items-end justify-between gap-3">
                <span className="text-2xl font-bold text-white">16</span>
                <span className="mb-1 text-[10px] text-slate-400">
                  Across campus
                </span>
              </div>

              <div className="mt-3 flex gap-1">
                {[40, 65, 50, 85, 60, 100, 72, 90, 60, 100, 78, 94].map(
                  (height, index) => (
                    <motion.span
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height * 0.24} px` }}
                      transition={{
                        delay: 0.25 + index * 0.035,
                        duration: 0.35,
                      }}
                      className="flex-1 self-end rounded-sm bg-gradient-to-t from-sky-500/40 to-sky-300"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* KPI CARDS */}

      <motion.section variants={itemVariants}>
        <SectionHeading
          eyebrow="Campus overview"
          title="Performance snapshot"
          description="A quick look at your institution's key metrics."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;
            const palette = colorClasses[item.color];

            return (
              <motion.article
                key={item.title}
                variants={itemVariants}
                whileHover={{
                  y: -5,
                  transition: { duration: 0.2 },
                }}
                className={[
                  "group relative overflow-hidden rounded-2xl border",
                  "border-white/[0.075] bg-[#101B2B] p-5",
                  "transition-colors duration-300",
                  palette.border,
                ].join(" ")}
              >
                <div className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/[0.015] transition-transform duration-500 group-hover:scale-150" />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium text-slate-400">
                      {item.title}
                    </p>

                    <motion.p
                      initial={{ opacity: 0, y: 7 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.18 + index * 0.08,
                        duration: 0.35,
                      }}
                      className="mt-3 text-[29px] font-bold tracking-tight text-white sm:text-[32px]"
                    >
                      {item.value}
                    </motion.p>
                  </div>

                  <div
                    className={[
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      palette.icon,
                    ].join(" ")}
                  >
                    <Icon size={21} strokeWidth={1.8} />
                  </div>
                </div>

                <div className="relative mt-4 flex flex-wrap items-center gap-x-2 gap-y-1">
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-300">
                    {item.trend === "up" ? (
                      <ArrowUpRight size={13} />
                    ) : (
                      <ArrowDownRight size={13} />
                    )}
                    {item.change}
                  </span>

                  <span className="text-[10px] text-slate-500">
                    {item.caption}
                  </span>
                </div>

                <div className="mt-4 h-1 overflow-hidden rounded-full bg-white/[0.06]">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}% ` }}
                    transition={{
                      duration: 0.85,
                      delay: 0.25 + index * 0.1,
                      ease: "easeOut",
                    }}
                    className={[
                      "h-full rounded-full",
                      palette.bar,
                    ].join(" ")}
                  />
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.section>

      {/* CHART + QUICK SUMMARY */}

      <motion.section
        variants={itemVariants}
        className="grid min-w-0 gap-5 2xl:grid-cols-[1.65fr_1fr]"
      >
        <Panel className="min-w-0 p-4 sm:p-6">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300/75">
                Growth intelligence
              </p>

              <h2 className="text-base font-semibold text-white sm:text-lg">
                Student growth & placements
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                Track enrollment and placement trends over time.
              </p>
            </div>

            <label className="relative">
              <span className="sr-only">Chart period</span>
              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="h-9 appearance-none rounded-lg border border-white/10 bg-[#0B1421] py-2 pl-3 pr-8 text-xs font-medium text-slate-300 outline-none transition-colors focus:border-sky-300/40"
              >
                <option>6 months</option>
                <option>3 months</option>
              </select>
              <ChevronDown
                size={13}
                className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </label>
          </div>

          <div className="mb-4 flex flex-wrap gap-x-5 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-sky-400" />
              <span className="text-[11px] text-slate-400">
                Enrolled students
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-indigo-400" />
              <span className="text-[11px] text-slate-400">
                Placement milestones
              </span>
            </div>
          </div>

          <div className="h-[250px] w-full sm:h-[290px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={chartData}
                margin={{
                  top: 10,
                  right: 6,
                  left: -18,
                  bottom: 0,
                }}
              >
                <defs>
                  <linearGradient
                    id="collegeStudentGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#38BDF8"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="95%"
                      stopColor="#38BDF8"
                      stopOpacity={0}
                    />
                  </linearGradient>

                  <linearGradient
                    id="collegePlacementGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="0%"
                      stopColor="#818CF8"
                      stopOpacity={0.18}
                    />
                    <stop
                      offset="95%"
                      stopColor="#818CF8"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="#FFFFFF"
                  strokeOpacity={0.055}
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8493A7", fontSize: 11 }}
                  dy={10}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8493A7", fontSize: 10 }}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `${(value / 1000).toFixed(1)} k`
                      : value
                  }
                />

                <Tooltip
                  contentStyle={{
                    background: "#101B2B",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: "12px",
                    color: "#F8FAFC",
                    fontSize: "12px",
                    boxShadow: "0 12px 35px rgba(0,0,0,0.25)",
                  }}
                  labelStyle={{
                    color: "#94A3B8",
                    marginBottom: 6,
                  }}
                />

                <Area
                  type="monotone"
                  dataKey="students"
                  name="Enrolled students"
                  stroke="#38BDF8"
                  strokeWidth={2.5}
                  fill="url(#collegeStudentGradient)"
                  activeDot={{
                    r: 5,
                    stroke: "#101B2B",
                    strokeWidth: 2,
                  }}
                  animationDuration={1000}
                />

                <Area
                  type="monotone"
                  dataKey="placements"
                  name="Placement milestones"
                  stroke="#818CF8"
                  strokeWidth={2}
                  fill="url(#collegePlacementGradient)"
                  activeDot={{
                    r: 4,
                    stroke: "#101B2B",
                    strokeWidth: 2,
                  }}
                  animationDuration={1200}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4">
            <TrendingUp size={16} className="text-emerald-300" />
            <p className="text-[11px] leading-5 text-slate-400">
              Student enrollment is trending upward in this sample dataset.
            </p>
          </div>
        </Panel>

        {/* ATTENTION SUMMARY */}

        <Panel className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Stay on track"
            title="Today's priorities"
            description="Items to review in your workspace."
          />

          <div className="space-y-3">
            <Link
              to="/college/requests"
              className="group flex items-center gap-3 rounded-xl border border-amber-300/10 bg-amber-300/[0.035] p-3.5 transition-all hover:border-amber-300/25 hover:bg-amber-300/[0.06]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-300/10 text-amber-300">
                <Clock3 size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200">
                  Pending trainer requests
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Review and shortlist trainers
                </p>
              </div>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-amber-300/10 px-2 text-xs font-bold text-amber-300">
                4
              </span>
            </Link>

            <Link
              to="/college/demo-schedule"
              className="group flex items-center gap-3 rounded-xl border border-sky-300/10 bg-sky-300/[0.035] p-3.5 transition-all hover:border-sky-300/25 hover:bg-sky-300/[0.06]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-300/10 text-sky-300">
                <CalendarDays size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200">
                  Upcoming demo sessions
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Confirm trainer availability
                </p>
              </div>

              <span className="flex h-7 min-w-7 items-center justify-center rounded-lg bg-sky-300/10 px-2 text-xs font-bold text-sky-300">
                2
              </span>
            </Link>

            <Link
              to="/college/payments"
              className="group flex items-center gap-3 rounded-xl border border-emerald-300/10 bg-emerald-300/[0.035] p-3.5 transition-all hover:border-emerald-300/25 hover:bg-emerald-300/[0.06]"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-300/10 text-emerald-300">
                <Wallet size={19} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200">
                  Payment overview
                </p>
                <p className="mt-1 text-[11px] text-slate-500">
                  Review invoices and transactions
                </p>
              </div>

              <ArrowRight
                size={16}
                className="shrink-0 text-slate-500 transition-transform group-hover:translate-x-1 group-hover:text-emerald-300"
              />
            </Link>
          </div>

          <div className="mt-5 rounded-xl border border-white/[0.07] bg-[#0B1421] p-4">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-sky-300" />
              <p className="text-xs font-semibold text-slate-200">
                Quick insight
              </p>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">
              Keep trainer requests and demo schedules updated to help your
              academic programs stay organized.
            </p>
          </div>
        </Panel>
      </motion.section>

      {/* REQUESTS + UPCOMING CLASSES */}

      <motion.section
        variants={itemVariants}
        className="grid min-w-0 gap-5 2xl:grid-cols-[1.2fr_0.8fr]"
      >
        {/* RECENT REQUESTS */}

        <Panel className="min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.06] p-5 sm:px-6">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300/75">
                Trainer marketplace
              </p>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Recent requirements
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Monitor your latest trainer requests.
              </p>
            </div>

            <SmallLink to="/college/requests">
              View all
            </SmallLink>
          </div>

          <div className="divide-y divide-white/[0.055]">
            {requests.map((request, index) => (
              <motion.div
                key={request.id}
                variants={itemVariants}
                className="group flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={[
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                      "text-xs font-bold",
                      colorClasses[request.color].avatar,
                    ].join(" ")}
                  >
                    {request.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-slate-200 transition-colors group-hover:text-sky-200">
                      {request.title}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      {request.id} <span className="mx-1.5">·</span>
                      {request.category}
                    </p>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-slate-400">
                      <span className="inline-flex items-center gap-1">
                        <Users size={12} />
                        {request.students} students
                      </span>
                      <span className="inline-flex items-center gap-1">
                        <CalendarDays size={12} />
                        {request.date}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pl-14 sm:flex-col sm:items-end sm:pl-0">
                  <StatusBadge status={request.status} />
                  <Link
                    to="/college/requests"
                    aria-label={`View ${request.id} `}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-sky-300/10 hover:text-sky-200"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-white/[0.06] p-4 sm:px-6">
            <Link
              to="/college/requests"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.02] py-3 text-xs font-semibold text-slate-300 transition-all hover:border-sky-300/20 hover:bg-sky-300/[0.04] hover:text-sky-200"
            >
              Manage all requirements
              <ArrowRight size={14} />
            </Link>
          </div>
        </Panel>

        {/* UPCOMING CLASSES */}

        <Panel className="min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] p-5 sm:px-6">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-300/75">
                Learning calendar
              </p>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Upcoming sessions
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                What's coming up next.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
              <CalendarDays size={19} />
            </div>
          </div>

          <div className="space-y-3 p-4 sm:p-5">
            {upcomingClasses.map((session, index) => (
              <motion.div
                key={session.title}
                variants={itemVariants}
                className={[
                  "group rounded-xl border border-white/[0.06]",
                  "bg-white/[0.018] p-4 transition-all duration-200",
                  "hover:border-sky-300/15 hover:bg-white/[0.035]",
                ].join(" ")}
              >
                <div className="flex gap-3">
                  <div
                    className={[
                      "flex w-[54px] shrink-0 flex-col items-center justify-center rounded-xl",
                      colorClasses[session.color].icon,
                    ].join(" ")}
                  >
                    <span className="text-[10px] font-semibold">
                      {session.date}
                    </span>
                    <span className="mt-1 text-[9px] opacity-75">
                      {index + 1}
                    </span>
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-slate-200 transition-colors group-hover:text-sky-200">
                      {session.title}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-500">
                      Trainer: {session.trainer}
                    </p>

                    <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-2">
                      <span className="inline-flex items-center gap-1 text-[10px] text-slate-400">
                        <Clock3 size={12} />
                        {session.time}
                      </span>
                      <span className="text-[10px] text-slate-600">·</span>
                      <span className="text-[10px] text-slate-400">
                        {session.duration}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-white/[0.05] pt-3">
                  <span className="text-[10px] font-medium text-slate-500">
                    {session.type}
                  </span>

                  <Link
                    to="/college/demo-schedule"
                    className="inline-flex items-center gap-1 text-[10px] font-semibold text-sky-300 transition-colors hover:text-sky-200"
                  >
                    View schedule
                    <ArrowRight size={12} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="px-4 pb-4 sm:px-5 sm:pb-5">
            <Link
              to="/college/demo-schedule"
              className="flex items-center justify-center gap-2 rounded-xl bg-indigo-400/[0.08] py-3 text-xs font-semibold text-indigo-200 transition-colors hover:bg-indigo-400/[0.13]"
            >
              Open class schedule
              <CalendarDays size={14} />
            </Link>
          </div>
        </Panel>
      </motion.section>

      {/* ACTIVITY + QUICK ACTIONS */}

      <motion.section
        variants={itemVariants}
        className="grid min-w-0 gap-5 xl:grid-cols-[1fr_0.8fr]"
      >
        {/* RECENT ACTIVITY */}

        <Panel className="min-w-0 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300/75">
                Workspace timeline
              </p>
              <h2 className="text-base font-semibold text-white sm:text-lg">
                Recent activity
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Latest updates across your college workspace.
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
              <Activity size={19} />
            </div>
          </div>

          <div className="mt-6">
            {visibleActivities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.05 }}
                  className="relative flex gap-3 pb-5 last:pb-0"
                >
                  {index !== visibleActivities.length - 1 && (
                    <span className="absolute bottom-0 left-[17px] top-9 w-px bg-white/[0.07]" />
                  )}

                  <div
                    className={[
                      "relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      colorClasses[activity.color].icon,
                    ].join(" ")}
                  >
                    <Icon size={16} />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-xs font-semibold text-slate-200">
                      {activity.title}
                    </p>
                    <p className="mt-1 text-[11px] leading-5 text-slate-500">
                      {activity.detail}
                    </p>
                  </div>

                  <span className="shrink-0 pt-1 text-right text-[9px] leading-4 text-slate-500 sm:text-[10px]">
                    {activity.time}
                  </span>
                </motion.div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setActivityExpanded((value) => !value)}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] py-3 text-xs font-semibold text-slate-400 transition-colors hover:border-sky-300/20 hover:text-sky-200"
          >
            {activityExpanded ? "Show less" : "Show all activity"}
            <motion.span
              animate={{ rotate: activityExpanded ? -90 : 90 }}
              transition={{ duration: 0.2 }}
            >
              <ArrowRight size={14} />
            </motion.span>
          </button>
        </Panel>

        {/* QUICK ACTIONS */}

        <Panel className="p-5 sm:p-6">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300/75">
            Work smarter
          </p>

          <h2 className="text-base font-semibold text-white sm:text-lg">
            Quick actions
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            Jump straight into your daily tasks.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Link
              to="/college/trainers"
              className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-sky-300/20 hover:bg-sky-300/[0.035]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-400/10 text-sky-300">
                  <Search size={19} />
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-slate-600 transition-colors group-hover:text-sky-300"
                />
              </div>

              <p className="mt-4 text-xs font-semibold text-slate-200">
                Find Trainers
              </p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                Discover trainers for your programs.
              </p>
            </Link>

            <Link
              to="/college/assignments"
              className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-indigo-300/20 hover:bg-indigo-300/[0.035]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-400/10 text-indigo-300">
                  <Layers3 size={19} />
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-slate-600 transition-colors group-hover:text-indigo-300"
                />
              </div>

              <p className="mt-4 text-xs font-semibold text-slate-200">
                Assignments
              </p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                Coordinate ongoing training work.
              </p>
            </Link>

            <Link
              to="/college/students"
              className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-cyan-300/20 hover:bg-cyan-300/[0.035]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300">
                  <Users size={19} />
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-slate-600 transition-colors group-hover:text-cyan-300"
                />
              </div>

              <p className="mt-4 text-xs font-semibold text-slate-200">
                Manage Students
              </p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                Review your student records.
              </p>
            </Link>

            <Link
              to="/college/payments"
              className="group rounded-xl border border-white/[0.07] bg-white/[0.02] p-4 transition-all hover:-translate-y-0.5 hover:border-emerald-300/20 hover:bg-emerald-300/[0.035]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-400/10 text-emerald-300">
                  <Wallet size={19} />
                </span>
                <ArrowUpRight
                  size={15}
                  className="text-slate-600 transition-colors group-hover:text-emerald-300"
                />
              </div>

              <p className="mt-4 text-xs font-semibold text-slate-200">
                Payments
              </p>
              <p className="mt-1 text-[10px] leading-4 text-slate-500">
                Check invoices and payments.
              </p>
            </Link>
          </div>

          <div className="mt-4 flex items-start gap-3 rounded-xl border border-sky-300/10 bg-sky-300/[0.035] p-3.5">
            <CheckCircle2
              size={17}
              className="mt-0.5 shrink-0 text-sky-300"
            />
            <div>
              <p className="text-xs font-semibold text-slate-200">
                Keep your workspace organized
              </p>
              <p className="mt-1 text-[10px] leading-5 text-slate-500">
                Update trainer requests, schedules and student records
                regularly for a clearer overview.
              </p>
            </div>
          </div>
        </Panel>
      </motion.section>

      {/* FOOTER */}

      <motion.footer
        variants={itemVariants}
        className="flex flex-col justify-between gap-2 border-t border-white/[0.06] pt-5 text-[10px] text-slate-600 sm:flex-row sm:items-center"
      >
        <p>
          TechMentor College Workspace
          <span className="mx-2 text-slate-700">·</span>
          Academic overview
        </p>

        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          <span>Dashboard interface loaded</span>
        </div>
      </motion.footer>
    </motion.div>
  );
}
