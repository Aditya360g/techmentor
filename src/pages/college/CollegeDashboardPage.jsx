
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { motion } from "motion/react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  BriefcaseBusiness,
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
} from "lucide-react";

/* =========================
   THEME
========================= */

const C = {
  bg: "#0b1421",
  panel: "#101d2e",
  panel2: "#12263b",
  border: "rgba(148,163,184,.17)",
  text: "#f8fafc",
  muted: "#a8b8cc",
  subtle: "#7f91a8",
  blue: "#38bdf8",
  cyan: "#22d3ee",
  violet: "#818cf8",
  green: "#34d399",
};

const axisStyle = {
  fill: "#b4c2d4",
  fontSize: 11,
};

const gridStyle = {
  stroke: "#94a3b8",
  strokeOpacity: 0.16,
  vertical: false,
};

/* =========================
   SAMPLE DATA
========================= */

const stats = [
  {
    title: "Total Students",
    value: "1,284",
    change: "+12.8%",
    note: "compared to last month",
    icon: GraduationCap,
    color: C.blue,
    progress: 78,
  },
  {
    title: "Active Trainers",
    value: "48",
    change: "+8.2%",
    note: "across all programs",
    icon: UserRoundCheck,
    color: C.violet,
    progress: 68,
  },
  {
    title: "Active Programs",
    value: "16",
    change: "+3",
    note: "this month",
    icon: BookOpen,
    color: C.cyan,
    progress: 84,
  },
  {
    title: "Placement Rate",
    value: "86.4%",
    change: "+4.6%",
    note: "placement performance",
    icon: Target,
    color: C.green,
    progress: 86,
  },
];

const growthData = [
  { month: "May", students: 740, placements: 410 },
  { month: "Jun", students: 820, placements: 465 },
  { month: "Jul", students: 790, placements: 490 },
  { month: "Aug", students: 960, placements: 560 },
  { month: "Sep", students: 1080, placements: 640 },
  { month: "Oct", students: 1284, placements: 720 },
];

const courseData = [
  { name: "React", students: 320 },
  { name: "Python", students: 280 },
  { name: "Java", students: 210 },
  { name: "Data Science", students: 190 },
  { name: "UI/UX", students: 145 },
];

const distribution = [
  { name: "Development", value: 38, color: C.blue },
  { name: "Data Science", value: 27, color: C.violet },
  { name: "Programming", value: 21, color: C.cyan },
  { name: "Other", value: 14, color: C.green },
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
    color: C.blue,
  },
  {
    id: "REQ-1023",
    title: "Python & Data Science",
    category: "AI & Data Science",
    students: 85,
    date: "23 Oct 2026",
    status: "Demo Scheduled",
    initials: "PY",
    color: C.violet,
  },
  {
    id: "REQ-1022",
    title: "Java + DSA",
    category: "Programming",
    students: 150,
    date: "25 Oct 2026",
    status: "New Request",
    initials: "JV",
    color: C.cyan,
  },
];

const classes = [
  {
    title: "Full Stack Development",
    trainer: "Aman Sharma",
    time: "10:30 AM",
    date: "Today",
    duration: "90 min",
    color: C.blue,
  },
  {
    title: "Python for Beginners",
    trainer: "Priya Verma",
    time: "12:00 PM",
    date: "Today",
    duration: "60 min",
    color: C.violet,
  },
  {
    title: "DSA Problem Solving",
    trainer: "Rahul Mehta",
    time: "02:30 PM",
    date: "Tomorrow",
    duration: "90 min",
    color: C.cyan,
  },
];

const activities = [
  {
    title: "New trainer request received",
    detail: "Full Stack Development · 120 students",
    time: "12 minutes ago",
    icon: UserRoundCheck,
    color: C.blue,
  },
  {
    title: "Python demo scheduled",
    detail: "Priya Verma · Tomorrow at 12:00 PM",
    time: "45 minutes ago",
    icon: CalendarDays,
    color: C.violet,
  },
  {
    title: "Payment successfully processed",
    detail: "Invoice #INV-2084 · ₹24,500",
    time: "2 hours ago",
    icon: Wallet,
    color: C.green,
  },
  {
    title: "New students enrolled",
    detail: "Java + DSA · 28 new enrollments",
    time: "4 hours ago",
    icon: Users,
    color: C.cyan,
  },
];

const quickActions = [
  {
    title: "Manage Students",
    description: "Review student records.",
    to: "/college/students",
    icon: Users,
    color: C.blue,
  },
  {
    title: "Trainer Requests",
    description: "Review incoming requests.",
    to: "/college/requests",
    icon: UserRoundCheck,
    color: C.violet,
  },
  {
    title: "Manage Programs",
    description: "Explore learning programs.",
    to: "/college/programs",
    icon: BookOpen,
    color: C.cyan,
  },
  {
    title: "Payments",
    description: "Check invoices and payments.",
    to: "/college/payments",
    icon: Wallet,
    color: C.green,
  },
  {
    title: "Placements",
    description: "Review placement activity.",
    to: "/college/placements",
    icon: BriefcaseBusiness,
    color: "#c4b5fd",
  },
  {
    title: "Analytics",
    description: "Review campus performance.",
    to: "/college/analytics",
    icon: TrendingUp,
    color: "#60a5fa",
  },
];

/* =========================
   ANIMATION VARIANTS
========================= */

const pageVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.065,
      delayChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.42,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

/* =========================
   REUSABLE COMPONENTS
========================= */

function Panel({ children, className = "" }) {
  return (
    <section
      className={`min - w - 0 rounded - 2xl border bg - [#101d2e] shadow - [0_14px_40px_rgba(0, 0, 0, .16)] ${className} `}
      style={{ borderColor: C.border }}
    >
      {children}
    </section>
  );
}

function ChartFrame({ children, height = 280 }) {
  return (
    <div
      className="w-full min-w-0"
      style={{ height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  );
}

function Eyebrow({ children, color = C.blue }) {
  return (
    <p
      className="mb-1.5 text-[10px] font-bold uppercase tracking-[.17em]"
      style={{ color }}
    >
      {children}
    </p>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}) {
  return (
    <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div className="min-w-0">
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}

        <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-300 sm:text-sm">
            {description}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

function SectionLink({ to, children }) {
  return (
    <Link
      to={to}
      className="inline-flex shrink-0 items-center gap-1.5 text-xs font-bold text-sky-300 transition hover:text-white"
    >
      {children}
      <ArrowRight size={14} />
    </Link>
  );
}

function StatusBadge({ status }) {
  const color =
    status === "Shortlisting"
      ? "#fbbf24"
      : status === "Demo Scheduled"
        ? C.violet
        : C.blue;

  return (
    <span
      className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-1 text-[10px] font-bold"
      style={{
        color,
        borderColor: `${color} 35`,
        background: `${color} 12`,
      }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ background: color }}
      />
      {status}
    </span>
  );
}

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div
      className="min-w-[180px] rounded-xl border p-3 shadow-2xl"
      style={{
        background: "#0b1421",
        borderColor: "rgba(148,163,184,.3)",
      }}
    >
      <p className="mb-2 text-xs font-extrabold text-white">
        {label || "Overview"}
      </p>

      {payload.map((item) => (
        <div
          key={`${item.dataKey} -${item.name} `}
          className="flex items-center justify-between gap-4 py-1.5"
        >
          <span className="flex items-center gap-2 text-[11px] text-slate-300">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ background: item.color || item.payload?.color || C.blue }}
            />
            {item.name}
          </span>

          <span
            className="text-sm font-extrabold tabular-nums"
            style={{ color: item.color || item.payload?.color || C.blue }}
          >
            {Number(item.value).toLocaleString("en-IN")}
            {item.unit || ""}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =========================
   MAIN DASHBOARD
========================= */

export default function CollegeDashboardPage() {
  const [period, setPeriod] = useState("6 months");
  const [showAllActivities, setShowAllActivities] = useState(false);

  const chartData = useMemo(
    () =>
      period === "3 months"
        ? growthData.slice(-3)
        : growthData,
    [period]
  );

  const visibleActivities = showAllActivities
    ? activities
    : activities.slice(0, 3);

  const latestGrowth = chartData[chartData.length - 1];

  return (
    <motion.main
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="college-dashboard min-h-full w-full min-w-0 overflow-x-hidden px-4 py-5 text-slate-100 sm:px-6 sm:py-7 xl:px-8"
      style={{ background: C.bg, color: C.text }}
    >
      <style>{`
  .college-dashboard,
  .college-dashboard * {
    box-sizing: border-box;
  }

  .college-dashboard {
    color-scheme: dark;
  }

  .college-dashboard .recharts-wrapper,
  .college-dashboard .recharts-surface,
  .college-dashboard .recharts-layer,
  .college-dashboard .recharts-cartesian-grid,
  .college-dashboard .recharts-cartesian-axis,
  .college-dashboard .recharts-cartesian-axis-tick {
    background: transparent !important;
  }

  .college-dashboard .recharts-cartesian-axis-tick-value {
    fill: #b4c2d4 !important;
  }

  .college-dashboard .recharts-text,
  .college-dashboard .recharts-cartesian-axis-tick text {
    fill: #b4c2d4 !important;
  }

  .college-dashboard .recharts-tooltip-wrapper {
    outline: none !important;
  }

  .college-dashboard select {
    color: #f8fafc;
    background-color: #0b1421;
  }

  .college-dashboard option {
    color: #f8fafc;
    background-color: #0b1421;
  }

  .college-dashboard a:focus-visible,
  .college-dashboard button:focus-visible,
  .college-dashboard select:focus-visible {
    outline: 2px solid #38bdf8;
    outline-offset: 3px;
  }

  @media (prefers-reduced-motion: reduce) {
    .college-dashboard *,
    .college-dashboard *::before,
    .college-dashboard *::after {
      animation-duration: 0.01ms !important;
      transition-duration: 0.01ms !important;
    }
  }
`}</style>

      {/* PAGE HEADER */}

      <motion.header
        variants={itemVariants}
        className="mb-7 flex flex-col justify-between gap-5 xl:flex-row xl:items-center"
      >


        <div className="flex flex-wrap items-center gap-2.5">
          <Link
            to="/college/notifications"
            aria-label="View notifications"
            className="relative flex h-11 w-11 items-center justify-center rounded-xl border bg-white/[0.04] text-slate-200 transition hover:border-sky-300/50 hover:bg-sky-300/10"
            style={{ borderColor: C.border }}
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-[#101d2e] bg-sky-400" />
          </Link>

          <Link
            to="/college/requests"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-sky-400 px-4 text-xs font-extrabold text-[#071322] shadow-lg shadow-sky-500/10 transition hover:-translate-y-0.5 hover:bg-sky-300 sm:px-5 sm:text-sm"
          >
            <Plus size={17} />
            New Requirement
          </Link>
        </div>
      </motion.header>

      {/* HERO BANNER */}

      <motion.section
        variants={itemVariants}
        className="relative isolate mb-8 overflow-hidden rounded-3xl border p-5 sm:p-7 lg:p-8"
        style={{
          borderColor: "#38bdf830",
          background:
            "linear-gradient(125deg,#15334d 0%,#102237 55%,#111b30 100%)",
        }}
      >
        <div className="pointer-events-none absolute -right-16 -top-24 -z-10 h-72 w-72 rounded-full bg-sky-400/10 blur-3xl" />

        <div className="grid gap-7 lg:grid-cols-[1fr_260px] lg:items-center">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-sky-200">
              <Sparkles size={17} />
              <span className="text-[10px] font-extrabold uppercase tracking-[.17em]">
                Your campus command center
              </span>
            </div>

            <h2 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
              Better learning outcomes
              <span className="block text-sky-300">
                start with better visibility.
              </span>
            </h2>

            <p className="mt-3 max-w-lg text-sm leading-6 text-slate-300">
              Monitor academic performance, coordinate trainers, and discover
              what needs attention today.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/college/analytics"
                className="inline-flex items-center gap-2 rounded-xl bg-white px-4 py-2.5 text-xs font-extrabold text-slate-900 transition hover:-translate-y-0.5 hover:bg-sky-100"
              >
                Explore Analytics
                <ArrowUpRight size={15} />
              </Link>

              <Link
                to="/college/trainers"
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-white/10"
              >
                <Search size={15} />
                Find Trainers
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Student engagement</span>
                <Activity size={15} className="text-sky-300" />
              </div>

              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-extrabold text-white">
                  92.8%
                </span>
                <span className="mb-1 text-[10px] font-bold text-emerald-300">
                  ↗ 6.4%
                </span>
              </div>

              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "92.8%" }}
                  transition={{ duration: 1.1 }}
                  className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300"
                />
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between text-xs text-slate-300">
                <span>Programs running</span>
                <Layers3 size={15} className="text-indigo-300" />
              </div>

              <div className="mt-3 flex items-end justify-between">
                <span className="text-3xl font-extrabold text-white">16</span>
                <span className="text-[10px] text-slate-300">
                  Across campus
                </span>
              </div>

              <div className="mt-3 flex h-8 items-end gap-1">
                {[40, 65, 50, 85, 60, 100, 72, 90, 60, 100, 78, 94].map(
                  (height, index) => (
                    <motion.span
                      key={index}
                      initial={{ height: 0 }}
                      animate={{ height: `${height}% ` }}
                      transition={{
                        delay: index * 0.035,
                        duration: 0.45,
                      }}
                      className="flex-1 rounded-t-sm bg-gradient-to-t from-sky-500/50 to-sky-300"
                    />
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* METRICS */}

      <motion.section variants={itemVariants} className="mb-8">
        <SectionHeading
          eyebrow="Campus overview"
          title="Performance snapshot"
          description="A quick look at your institution's key metrics."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
          {stats.map((item, index) => {
            const Icon = item.icon;

            return (
              <motion.article
                key={item.title}
                variants={itemVariants}
                whileHover={{ y: -5 }}
                transition={{ duration: 0.2 }}
                className="group relative min-w-0 overflow-hidden rounded-2xl border bg-[#101d2e] p-5 transition-colors hover:border-sky-300/40"
                style={{ borderColor: C.border }}
              >
                <div
                  className="pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[.09] blur-2xl transition-transform duration-500 group-hover:scale-150"
                  style={{ background: item.color }}
                />

                <div className="relative flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold text-slate-300">
                      {item.title}
                    </p>

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15 + index * 0.08 }}
                      className="mt-3 text-3xl font-extrabold tracking-tight text-white"
                    >
                      {item.value}
                    </motion.p>
                  </div>

                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      color: item.color,
                      background: `${item.color} 20`,
                    }}
                  >
                    <Icon size={22} />
                  </div>
                </div>

                <div className="relative mt-4 flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-300">
                    <ArrowUpRight size={13} />
                    {item.change}
                  </span>

                  <span className="text-[10px] text-slate-400">
                    {item.note}
                  </span>
                </div>

                <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.progress}% ` }}
                    transition={{
                      duration: 0.9,
                      delay: 0.2 + index * 0.1,
                    }}
                    className="h-full rounded-full"
                    style={{ background: item.color }}
                  />
                </div>
              </motion.article>
            );
          })}
        </div>
      </motion.section>

      {/* GROWTH CHART */}

      <motion.section
        variants={itemVariants}
        className="mb-8 grid min-w-0 gap-5 2xl:grid-cols-[1.65fr_1fr]"
      >
        <Panel className="p-4 sm:p-6 lg:p-7">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
            <div>
              <Eyebrow>Growth intelligence</Eyebrow>

              <h2 className="text-lg font-extrabold tracking-tight text-white sm:text-xl">
                Student growth & placements
              </h2>

              <p className="mt-2 max-w-lg text-xs leading-5 text-slate-300 sm:text-sm">
                Track enrollment and placement trends over time.
              </p>
            </div>

            <label className="relative inline-flex w-fit shrink-0 items-center">
              <span className="sr-only">Chart period</span>

              <select
                value={period}
                onChange={(event) => setPeriod(event.target.value)}
                className="h-10 appearance-none rounded-xl border py-2 pl-3 pr-9 text-xs font-bold outline-none transition focus:ring-4 focus:ring-sky-400/10"
                style={{
                  color: C.text,
                  background: C.bg,
                  borderColor: C.border,
                }}
              >
                <option value="6 months">Last 6 months</option>
                <option value="3 months">Last 3 months</option>
              </select>

              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 text-slate-300"
              />
            </label>
          </div>

          {/* CHART LEGEND */}

          <div className="mb-5 flex flex-wrap gap-x-6 gap-y-3">
            <span className="flex items-center gap-2 text-xs font-medium text-slate-200">
              <span className="h-2.5 w-2.5 rounded-full bg-sky-400 shadow-[0_0_10px_rgba(56,189,248,.6)]" />
              Enrolled students
            </span>

            <span className="flex items-center gap-2 text-xs font-medium text-slate-200">
              <span className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-[0_0_10px_rgba(129,140,248,.5)]" />
              Placement milestones
            </span>
          </div>

          {/* ANIMATED GROWTH CHART */}

          <div className="h-[280px] w-full min-w-0 sm:h-[330px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                key={period}
                data={chartData}
                margin={{ top: 12, right: 14, left: 0, bottom: 4 }}
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
                      stopColor="#38bdf8"
                      stopOpacity={0.36}
                    />
                    <stop
                      offset="65%"
                      stopColor="#38bdf8"
                      stopOpacity={0.12}
                    />
                    <stop
                      offset="100%"
                      stopColor="#38bdf8"
                      stopOpacity={0.01}
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
                      stopColor="#a78bfa"
                      stopOpacity={0.28}
                    />
                    <stop
                      offset="65%"
                      stopColor="#a78bfa"
                      stopOpacity={0.1}
                    />
                    <stop
                      offset="100%"
                      stopColor="#a78bfa"
                      stopOpacity={0.01}
                    />
                  </linearGradient>
                </defs>

                <CartesianGrid
                  stroke="rgba(148,163,184,.15)"
                  strokeDasharray="4 6"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={axisStyle}
                  tickMargin={12}
                  padding={{ left: 8, right: 8 }}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={axisStyle}
                  tickMargin={10}
                  width={48}
                  domain={[0, "auto"]}
                  allowDecimals={false}
                  tickFormatter={(value) =>
                    value >= 1000
                      ? `${(value / 1000).toFixed(1).replace(".0", "")} k`
                      : value
                  }
                />

                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{
                    stroke: "rgba(148,163,184,.5)",
                    strokeDasharray: "4 4",
                  }}
                  isAnimationActive
                  animationDuration={180}
                />

                <Area
                  type="monotone"
                  dataKey="students"
                  name="Enrolled students"
                  stroke="#38bdf8"
                  strokeWidth={3}
                  fill="url(#collegeStudentGradient)"
                  activeDot={{
                    r: 6,
                    fill: "#38bdf8",
                    stroke: "#e0f2fe",
                    strokeWidth: 2,
                  }}
                  dot={{
                    r: 3,
                    fill: "#38bdf8",
                    stroke: "#101d2e",
                    strokeWidth: 2,
                  }}
                  isAnimationActive
                  animationBegin={100}
                  animationDuration={1400}
                  animationEasing="ease-out"
                />

                <Area
                  type="monotone"
                  dataKey="placements"
                  name="Placement milestones"
                  stroke="#a78bfa"
                  strokeWidth={2.5}
                  fill="url(#collegePlacementGradient)"
                  activeDot={{
                    r: 5,
                    fill: "#a78bfa",
                    stroke: "#ede9fe",
                    strokeWidth: 2,
                  }}
                  dot={{
                    r: 2.5,
                    fill: "#a78bfa",
                    stroke: "#101d2e",
                    strokeWidth: 2,
                  }}
                  isAnimationActive
                  animationBegin={250}
                  animationDuration={1600}
                  animationEasing="ease-out"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* GROWTH SUMMARY */}

          <div className="mt-5 grid grid-cols-1 gap-3 border-t border-white/10 pt-5 sm:grid-cols-2">
            <div className="rounded-xl border border-sky-300/15 bg-sky-300/[.05] p-3.5">
              <div className="flex items-center gap-2 text-sky-300">
                <GraduationCap size={17} />
                <span className="text-xs font-semibold">
                  Enrolled students
                </span>
              </div>

              <p className="mt-2 text-xl font-extrabold text-white">
                {latestGrowth?.students.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Latest displayed period
              </p>
            </div>

            <div className="rounded-xl border border-violet-300/15 bg-violet-300/[.05] p-3.5">
              <div className="flex items-center gap-2 text-violet-300">
                <Target size={16} />
                <span className="text-xs font-semibold">
                  Placement milestones
                </span>
              </div>

              <p className="mt-2 text-xl font-extrabold text-white">
                {latestGrowth?.placements.toLocaleString("en-IN")}
              </p>

              <p className="mt-1 text-[10px] text-slate-400">
                Latest displayed period
              </p>
            </div>
          </div>

          <div className="mt-4 flex items-start gap-2">
            <Activity size={15} className="mt-0.5 shrink-0 text-sky-300" />

            <p className="text-[11px] leading-5 text-slate-400">
              Illustrative sample data. Connect your API to display live
              institutional metrics.
            </p>
          </div>
        </Panel>

        {/* GROWTH PRIORITIES */}



        <Panel className="p-5 sm:p-6">
          <Eyebrow color={C.violet}>Growth priorities</Eyebrow>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45 }}
            className="text-lg font-extrabold tracking-tight text-white"
          >
            Campus performance
          </motion.h2>

          <p className="mt-2 text-xs leading-5 text-slate-300">
            Keep an eye on your key academic indicators.
          </p>

          <div className="mt-6 space-y-5">
            {[
              {
                title: "Student engagement",
                value: 92.8,
                label: "Excellent",
                color: C.blue,
              },
              {
                title: "Placement performance",
                value: 86.4,
                label: "On track",
                color: C.green,
              },
              {
                title: "Trainer utilization",
                value: 78,
                label: "Good",
                color: C.violet,
              },
              {
                title: "Program completion",
                value: 74,
                label: "Improving",
                color: C.cyan,
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.45,
                  delay: 0.12 + index * 0.14,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-slate-200">
                    {item.title}
                  </span>

                  <motion.span
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      duration: 0.35,
                      delay: 0.35 + index * 0.14,
                    }}
                    className="text-xs font-extrabold tabular-nums"
                    style={{ color: item.color }}
                  >
                    {item.value}%
                  </motion.span>
                </div>

                {/* Progress track */}
                <div className="relative h-2 overflow-hidden rounded-full bg-white/10">
                  {/* Animated gradient bar */}
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: `${item.value}%` }}
                    transition={{
                      duration: 1.25,
                      delay: 0.2 + index * 0.14,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative h-full overflow-hidden rounded-full"
                    style={{
                      background: `linear-gradient(90deg, ${item.color}99 0%, ${item.color} 100%)`,
                      boxShadow: `0 0 12px ${item.color}40`,
                    }}
                  >
                    {/* Moving shine animation */}
                    <motion.span
                      className="absolute inset-y-0 w-10"
                      style={{
                        background:
                          "linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent)",
                      }}
                      initial={{ x: "-160%", opacity: 0 }}
                      animate={{
                        x: ["-160%", "500%"],
                        opacity: [0, 1, 0],
                      }}
                      transition={{
                        duration: 0.9,
                        delay: 0.65 + index * 0.14,
                        ease: "easeInOut",
                      }}
                    />
                  </motion.div>
                </div>

                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.35,
                    delay: 0.55 + index * 0.14,
                  }}
                  className="mt-1.5 text-[10px] text-slate-400"
                >
                  {item.label}
                </motion.p>
              </motion.div>
            ))}
          </div>

          {/* Recommended next step */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.5,
              delay: 0.85,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="mt-6 rounded-xl border border-sky-300/15 bg-sky-300/[.05] p-4"
          >
            <div className="flex items-start gap-3">
              <motion.div
                animate={{ y: [0, -3, 0] }}
                transition={{
                  duration: 2.2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-sky-300/10 text-sky-300"
              >
                <Sparkles size={18} />
              </motion.div>

              <div className="min-w-0">
                <h3 className="text-xs font-bold text-white">
                  Recommended next step
                </h3>

                <p className="mt-1.5 text-[11px] leading-5 text-slate-300">
                  Review placement progress and identify programs that need
                  additional trainer support.
                </p>

                <Link
                  to="/college/analytics"
                  className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 transition-all duration-200 hover:translate-x-1 hover:text-white"
                >
                  Open analytics
                  <ArrowRight size={13} />
                </Link>
              </div>
            </div>
          </motion.div>
        </Panel>


      </motion.section>

      {/* COURSE CHARTS */}

      <motion.section
        variants={itemVariants}
        className="mb-8 grid min-w-0 gap-5 xl:grid-cols-2"
      >
        <Panel className="p-4 sm:p-6">
          <SectionHeading
            eyebrow="Academic analytics"
            title="Popular learning programs"
            description="Student enrollment across key courses."
          />

          <ChartFrame height={280}>
            <BarChart
              data={courseData}
              margin={{ top: 10, right: 5, left: 0, bottom: 8 }}
              style={{ background: "transparent" }}
            >
              <CartesianGrid
                stroke="#94a3b8"
                strokeOpacity={0.16}
                vertical={false}
                fill="transparent"
              />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#b4c2d4", fontSize: 11 }}
                interval={0}
                angle={-12}
                textAnchor="end"
                height={55}
              />

              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#b4c2d4", fontSize: 11 }}
                allowDecimals={false}
              />

              <Tooltip
                content={<ChartTooltip />}
                cursor={{ fill: "transparent" }}
              />

              <Bar
                dataKey="students"
                name="Students"
                radius={[6, 6, 0, 0]}
                maxBarSize={40}
                animationDuration={1100}
                background={false}
              >
                {courseData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={[
                      C.blue,
                      C.violet,
                      C.cyan,
                      C.green,
                      "#60a5fa",
                    ][index]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ChartFrame>
        </Panel>


        <Panel className="p-4 sm:p-6">
          <SectionHeading
            eyebrow="Program breakdown"
            title="Course distribution"
            description="Sample view of your academic portfolio."
          />

          <div className="grid items-center gap-3 sm:grid-cols-2">
            <div className="relative h-[250px] min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distribution}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={62}
                    outerRadius={94}
                    paddingAngle={4}
                    stroke="none"
                    animationDuration={1100}
                  >
                    {distribution.map((item) => (
                      <Cell key={item.name} fill={item.color} />
                    ))}
                  </Pie>

                  <Tooltip
                    content={<ChartTooltip />}
                    wrapperStyle={{ zIndex: 20, pointerEvents: "none" }}
                    position={{ x: 10, y: 10 }}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-extrabold text-white">16</span>
                <span className="mt-1 text-[10px] text-slate-300">
                  Programs
                </span>
              </div>
            </div>

            <div className="space-y-4">
              {distribution.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="flex min-w-0 items-center gap-2 text-xs text-slate-200">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ background: item.color }}
                      />
                      <span className="truncate">{item.name}</span>
                    </span>

                    <span className="text-xs font-extrabold text-white">
                      {item.value}%
                    </span>
                  </div>

                  <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}% ` }}
                      transition={{ duration: 0.8, delay: 0.2 }}
                      className="h-full rounded-full"
                      style={{ background: item.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Panel>
      </motion.section>

      {/* REQUESTS AND SCHEDULE */}

      <motion.section
        variants={itemVariants}
        className="mb-8 grid min-w-0 gap-5 2xl:grid-cols-[1.2fr_.8fr]"
      >
        <Panel className="min-w-0 overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 p-5 sm:px-6">
            <div>
              <Eyebrow>Trainer marketplace</Eyebrow>
              <h2 className="text-lg font-bold text-white">
                Recent requirements
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Monitor your latest trainer requests.
              </p>
            </div>

            <SectionLink to="/college/requests">View all</SectionLink>
          </div>

          <div className="divide-y divide-white/[.07]">
            {requests.map((request) => (
              <motion.div
                key={request.id}
                whileHover={{
                  backgroundColor: "rgba(255,255,255,.035)",
                }}
                className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold"
                    style={{
                      color: request.color,
                      background: `${request.color} 20`,
                    }}
                  >
                    {request.initials}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-white">
                      {request.title}
                    </p>

                    <p className="mt-1 text-[11px] text-slate-300">
                      {request.id} · {request.category}
                    </p>

                    <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-[10px] text-slate-300">
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
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-300 transition hover:bg-sky-300/10 hover:text-sky-200"
                  >
                    <ArrowUpRight size={16} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4 sm:px-6">
            <Link
              to="/college/requests"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.03] py-3 text-xs font-bold text-slate-200 transition hover:border-sky-300/30 hover:text-sky-200"
            >
              Manage all requirements
              <ArrowRight size={14} />
            </Link>
          </div>
        </Panel>

        <Panel className="min-w-0 overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-white/10 p-5 sm:px-6">
            <div>
              <Eyebrow color={C.violet}>Learning calendar</Eyebrow>
              <h2 className="text-lg font-bold text-white">
                Upcoming classes
              </h2>
              <p className="mt-1 text-xs text-slate-300">
                Your upcoming learning sessions.
              </p>
            </div>

            <CalendarDays size={20} className="text-sky-300" />
          </div>

          <div className="space-y-1 p-4 sm:p-5">
            {classes.map((item) => (
              <motion.div
                key={item.title}
                variants={itemVariants}
                className="flex gap-3 rounded-xl p-3 transition hover:bg-white/[.035]"
              >
                <div
                  className="w-1 shrink-0 rounded-full"
                  style={{ background: item.color }}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold text-sky-300">
                      {item.date}
                    </span>

                    <span className="inline-flex items-center gap-1 text-[10px] text-slate-300">
                      <Clock3 size={11} />
                      {item.duration}
                    </span>
                  </div>

                  <h3 className="mt-2 text-sm font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-300">
                    Trainer: {item.trainer}
                  </p>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <span className="text-xs font-extrabold text-white">
                      {item.time}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/[.04] px-2.5 py-1.5 text-[10px] text-slate-200">
                      <Video size={12} />
                      Live session
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="border-t border-white/10 p-4 sm:px-5">
            <Link
              to="/college/schedule"
              className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[.03] py-3 text-xs font-bold text-slate-200 transition hover:border-sky-300/30 hover:text-sky-200"
            >
              View full schedule
              <ArrowRight size={14} />
            </Link>
          </div>
        </Panel>
      </motion.section>

      {/* ACTIVITY AND QUICK ACTIONS */}

      <motion.section
        variants={itemVariants}
        className="mb-8 grid min-w-0 gap-5 xl:grid-cols-2"
      >
        <Panel className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Workspace updates"
            title="Recent activity"
            description="A quick overview of recent events."
            action={
              <button
                type="button"
                onClick={() => setShowAllActivities((value) => !value)}
                className="text-xs font-extrabold text-sky-300 transition hover:text-white"
              >
                {showAllActivities ? "Show less" : "View all"}
              </button>
            }
          />

          <div className="space-y-1">
            {visibleActivities.map((activity, index) => {
              const Icon = activity.icon;

              return (
                <motion.div
                  key={activity.title}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.07 }}
                  className="flex items-start gap-3 rounded-xl p-3 transition hover:bg-white/[.035]"
                >
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      color: activity.color,
                      background: `${activity.color} 20`,
                    }}
                  >
                    <Icon size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-white">
                      {activity.title}
                    </p>

                    <p className="mt-1 text-[11px] leading-5 text-slate-300">
                      {activity.detail}
                    </p>

                    <p className="mt-1.5 text-[10px] text-slate-400">
                      {activity.time}
                    </p>
                  </div>

                  <CheckCircle2
                    size={15}
                    className="mt-1 shrink-0 text-emerald-300"
                  />
                </motion.div>
              );
            })}
          </div>
        </Panel>

        <Panel className="p-5 sm:p-6">
          <SectionHeading
            eyebrow="Work faster"
            title="Quick actions"
            description="Jump directly to important workspace sections."
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {quickActions.map((action) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.title}
                  whileHover={{ y: -3 }}
                  className="min-w-0"
                >
                  <Link
                    to={action.to}
                    className="group block h-full rounded-xl border bg-white/[.025] p-4 transition hover:border-sky-300/30 hover:bg-white/[.05]"
                    style={{ borderColor: C.border }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="flex h-10 w-10 items-center justify-center rounded-xl"
                        style={{
                          color: action.color,
                          background: `${action.color} 20`,
                        }}
                      >
                        <Icon size={19} />
                      </span>

                      <ArrowUpRight
                        size={15}
                        className="text-slate-400 transition group-hover:text-sky-300"
                      />
                    </div>

                    <p className="mt-4 text-xs font-extrabold text-white">
                      {action.title}
                    </p>

                    <p className="mt-1 text-[10px] leading-4 text-slate-300">
                      {action.description}
                    </p>
                  </Link>
                </motion.div>
              );
            })}
          </div>

        </Panel>
      </motion.section>


    </motion.main >
  );
}
