
import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  GraduationCap,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
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

/* ======================================================
   SAMPLE DATA
====================================================== */

const performanceData = [
  { month: "May", students: 320, completion: 62 },
  { month: "Jun", students: 390, completion: 67 },
  { month: "Jul", students: 420, completion: 64 },
  { month: "Aug", students: 510, completion: 73 },
  { month: "Sep", students: 570, completion: 78 },
  { month: "Oct", students: 648, completion: 84 },
];

const departmentData = [
  { name: "Computer Science", students: 245, color: "#67e8f9" },
  { name: "Information Tech", students: 168, color: "#60a5fa" },
  { name: "Data Science", students: 124, color: "#a5b4fc" },
  { name: "Electronics", students: 72, color: "#c4b5fd" },
  { name: "Other", students: 39, color: "#64748b" },
];

const engagementData = [
  { name: "Mon", value: 58 },
  { name: "Tue", value: 72 },
  { name: "Wed", value: 65 },
  { name: "Thu", value: 86 },
  { name: "Fri", value: 78 },
  { name: "Sat", value: 45 },
  { name: "Sun", value: 34 },
];

const topCourses = [
  {
    name: "Full Stack Development",
    category: "Development",
    enrolled: 186,
    completion: 88,
    growth: "+14%",
    departments: ["Computer Science", "Information Tech"],
  },
  {
    name: "Python for Data Science",
    category: "AI & Data",
    enrolled: 154,
    completion: 82,
    growth: "+11%",
    departments: ["Data Science", "Computer Science"],
  },
  {
    name: "Machine Learning",
    category: "Artificial Intelligence",
    enrolled: 126,
    completion: 76,
    growth: "+9%",
    departments: ["Computer Science", "Data Science"],
  },
  {
    name: "Cloud & DevOps",
    category: "Infrastructure",
    enrolled: 98,
    completion: 71,
    growth: "+6%",
    departments: ["Information Tech", "Electronics"],
  },
];

const initialActivities = [
  {
    title: "Student engagement improved",
    detail: "Weekly learning activity increased by 12%.",
    time: "2 hours ago",
    icon: TrendingUp,
    color: "text-cyan-300",
    bg: "bg-cyan-400/10",
  },
  {
    title: "Course completion milestone",
    detail: "Full Stack Development reached 88% completion.",
    time: "5 hours ago",
    icon: CheckCircle2,
    color: "text-emerald-300",
    bg: "bg-emerald-400/10",
  },
  {
    title: "New enrollment activity",
    detail: "24 students joined learning programs this week.",
    time: "Yesterday",
    icon: Users,
    color: "text-blue-300",
    bg: "bg-blue-400/10",
  },
];

const periods = ["Last 7 days", "Last 30 days", "Last 6 months"];

const departmentOptions = [
  "All departments",
  ...departmentData.map((item) => item.name),
];

const panelClass =
  "rounded-2xl border border-white/[0.09] bg-[#101d32]/80 shadow-[0_18px_55px_rgba(0,0,0,0.12)] backdrop-blur-xl";

/* ======================================================
   PREMIUM CUSTOM DROPDOWN
====================================================== */

function PremiumDropdown({
  value,
  options,
  onChange,
  icon: Icon = ChevronDown,
  label = "Select option",
  menuWidth = "w-full",
}) {
  const rootRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(
    Math.max(0, options.indexOf(value))
  );

  useEffect(() => {
    if (open) {
      setActiveIndex(Math.max(0, options.indexOf(value)));
    }
  }, [open, value, options]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
    };
  }, []);

  const chooseOption = (option) => {
    onChange(option);
    setOpen(false);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      setOpen(false);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((current) =>
          Math.min(current + 1, options.length - 1)
        );
      }
    } else if (event.key === "ArrowUp") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
      } else {
        setActiveIndex((current) => Math.max(current - 1, 0));
      }
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      if (!open) {
        setOpen(true);
      } else if (options[activeIndex]) {
        chooseOption(options[activeIndex]);
      }
    }
  };

  return (
    <div ref={rootRef} className="relative w-full">
      <motion.button
        type="button"
        whileTap={{ scale: 0.985 }}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={handleKeyDown}
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`
          group flex min-h-[44px] w-full items-center gap-3
          rounded-xl border px-3.5 py-2.5 text-left
          outline-none transition-all duration-200
          ${open
            ? "border-cyan-300/50 bg-[#13243a] shadow-[0_0_0_3px_rgba(103,232,249,0.07)]"
            : "border-white/[0.10] bg-[#0e192b]/90 hover:border-cyan-300/30 hover:bg-[#132238]"
          }
        `}
      >
        <span
          className={`
            flex h-7 w-7 shrink-0 items-center justify-center
            rounded-lg border transition-colors
            ${open
              ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
              : "border-white/[0.07] bg-white/[0.04] text-slate-400 group-hover:text-cyan-200"
            }
          `}
        >
          <Icon size={15} />
        </span>

        <span className="min-w-0 flex-1 truncate text-xs font-semibold text-slate-200">
          {value}
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.22 }}
          className="flex shrink-0 text-slate-400 group-hover:text-cyan-200"
        >
          <ChevronDown size={15} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={`
              absolute left-0 top-[calc(100%+8px)] z-[100]
              ${menuWidth} min-w-[210px] overflow-hidden
              rounded-2xl border border-cyan-300/15
              bg-[#0b1424] p-1.5
              shadow-[0_20px_55px_rgba(0,0,0,0.55)]
            `}
            role="listbox"
            aria-label={label}
          >
            <div className="flex items-center justify-between border-b border-white/[0.07] px-3 py-2.5">
              <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                {label}
              </span>

              <span className="rounded-md border border-cyan-300/10 bg-cyan-300/[0.06] px-1.5 py-0.5 text-[9px] font-semibold text-cyan-200">
                {options.length} options
              </span>
            </div>

            <div className="analytics-dropdown-scroll max-h-64 overflow-y-auto py-1">
              {options.map((option, index) => {
                const selected = option === value;
                const highlighted = index === activeIndex;

                return (
                  <motion.button
                    key={option}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    initial={{ opacity: 0, x: -5 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.16,
                      delay: Math.min(index * 0.018, 0.12),
                    }}
                    onMouseEnter={() => setActiveIndex(index)}
                    onClick={() => chooseOption(option)}
                    className={`
                      relative flex w-full items-center gap-3
                      rounded-xl px-3 py-2.5 text-left
                      transition-colors duration-150
                      ${selected
                        ? "bg-cyan-300/[0.10] text-cyan-100"
                        : highlighted
                          ? "bg-white/[0.055] text-white"
                          : "text-slate-300 hover:bg-white/[0.04] hover:text-white"
                      }
                    `}
                  >
                    <span
                      className={`
                        flex h-6 w-6 shrink-0 items-center justify-center
                        rounded-lg border text-[10px] font-bold
                        ${selected
                          ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                          : "border-white/[0.07] bg-white/[0.035] text-slate-500"
                        }
                      `}
                    >
                      {selected ? (
                        <Check size={13} strokeWidth={2.5} />
                      ) : (
                        String(index + 1).padStart(2, "0")
                      )}
                    </span>

                    <span className="min-w-0 flex-1 truncate text-xs font-medium">
                      {option}
                    </span>

                    {selected && (
                      <span className="h-4 w-0.5 rounded-full bg-cyan-300" />
                    )}
                  </motion.button>
                );
              })}
            </div>

            <div className="border-t border-white/[0.06] px-3 py-2">
              <p className="text-[9px] text-slate-600">
                ↑ ↓ Navigate · Enter Select · Esc Close
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ======================================================
   DARK CHART TOOLTIP
====================================================== */

function DarkTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[135px] rounded-xl border border-cyan-300/20 bg-[#0b1424] px-3.5 py-3 shadow-[0_12px_35px_rgba(0,0,0,0.45)]">
      {label !== undefined && label !== null && (
        <p className="mb-2.5 text-xs font-bold text-white">{label}</p>
      )}

      <div className="grid gap-2">
        {payload.map((item, index) => {
          const itemName = item.name || item.dataKey || "Value";
          const isPercentage = ["Completion", "Engagement"].includes(
            itemName
          );

          const displayValue =
            typeof item.value === "number" && isPercentage
              ? `${item.value}%`
              : item.value;

          return (
            <div
              key={`${itemName}-${index}`}
              className="flex items-center justify-between gap-4 text-xs"
            >
              <span className="text-slate-300">{itemName}</span>
              <strong
                style={{ color: item.color || "#67e8f9" }}
                className="font-bold"
              >
                {displayValue}
              </strong>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ======================================================
   SECTION HEADING
====================================================== */

function SectionHeading({ eyebrow, title, subtitle, action }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0">
        <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
          {eyebrow}
        </p>

        <h2 className="text-lg font-bold tracking-tight text-white sm:text-xl">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1 text-xs leading-5 text-slate-400">
            {subtitle}
          </p>
        )}
      </div>

      {action}
    </div>
  );
}

/* ======================================================
   METRIC CARD
====================================================== */

function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  color,
  delay,
}) {
  const positive = !change.startsWith("-");

  const barColor = {
    "text-cyan-300": "bg-cyan-300",
    "text-blue-300": "bg-blue-300",
    "text-violet-300": "bg-violet-300",
    "text-emerald-300": "bg-emerald-300",
  }[color] || "bg-cyan-300";

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className={`${panelClass} group relative min-w-0 overflow-hidden p-5`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-[0.08] blur-2xl ${color}`}
      />

      <div className="relative flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{title}</p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: delay + 0.2 }}
            className="mt-3 text-3xl font-bold tracking-tight text-white"
          >
            {value}
          </motion.p>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-lg px-2 py-1 text-[10px] font-bold ${positive
                ? "bg-emerald-400/10 text-emerald-300"
                : "bg-rose-400/10 text-rose-300"
                }`}
            >
              {positive ? (
                <ArrowUpRight size={12} />
              ) : (
                <ArrowDownRight size={12} />
              )}
              {change}
            </span>

            <span className="text-[10px] text-slate-500">{description}</span>
          </div>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] ${color} bg-white/[0.04]`}
        >
          <Icon size={20} />
        </div>
      </div>

      <div className="mt-5 h-1 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${Math.min(90, 55 + delay * 80)}%` }}
          transition={{ duration: 1, delay: delay + 0.2 }}
          className={`h-full rounded-full ${barColor}`}
        />
      </div>
    </motion.article>
  );
}

function ChartCard({ children, className = "" }) {
  return (
    <div className={`${panelClass} min-w-0 p-5 ${className}`}>
      {children}
    </div>
  );
}

/* ======================================================
   COLLEGE ANALYTICS PAGE
====================================================== */

export default function CollegeAnalyticsPage() {
  const [period, setPeriod] = useState("Last 6 months");
  const [department, setDepartment] = useState("All departments");
  const [refreshed, setRefreshed] = useState(false);

  const selectedDepartment = useMemo(
    () => departmentData.find((item) => item.name === department),
    [department]
  );

  /*
   * Keep every department in the donut chart.
   * The selected department is highlighted instead of
   * removing all the other SVG slices.
   */
  const displayedDepartments = departmentData;

  const displayedStudentCount = selectedDepartment
    ? selectedDepartment.students
    : departmentData.reduce((sum, item) => sum + item.students, 0);

  const filteredCourses = useMemo(() => {
    if (department === "All departments") {
      return topCourses;
    }

    return topCourses.filter((course) =>
      course.departments.includes(department)
    );
  }, [department]);

  const handleRefresh = () => {
    setRefreshed(true);
    window.setTimeout(() => setRefreshed(false), 1600);
  };

  const handleExport = () => {
    const rows = [
      ["Course", "Category", "Enrolled Students", "Completion", "Growth"],
      ...filteredCourses.map((course) => [
        course.name,
        course.category,
        course.enrolled,
        `${course.completion}%`,
        course.growth,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value).replace(/"/g, '""')}"`)
          .join(",")
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "college-analytics.csv";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
  };

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.35 }}
      className="college-dashboard min-h-full w-full min-w-0 overflow-x-hidden text-slate-100"
    >
      <style>{`
        .college-dashboard {
          color-scheme: dark;
          background:
            radial-gradient(ellipse at 8% 0%, rgba(34,211,238,.075), transparent 32%),
            radial-gradient(ellipse at 95% 12%, rgba(96,165,250,.07), transparent 30%),
            #0b1424;
        }

        .college-dashboard * {
          box-sizing: border-box;
        }

        .college-dashboard .analytics-dropdown-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(103,232,249,.3) transparent;
        }

        .college-dashboard .analytics-dropdown-scroll::-webkit-scrollbar {
          width: 5px;
        }

        .college-dashboard .analytics-dropdown-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .college-dashboard .analytics-dropdown-scroll::-webkit-scrollbar-thumb {
          background: rgba(103,232,249,.25);
          border-radius: 10px;
        }

        .college-dashboard .analytics-dropdown-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(103,232,249,.45);
        }

        .college-dashboard .analytics-scroll {
          scrollbar-width: thin;
          scrollbar-color: #334155 transparent;
        }

        .college-dashboard .analytics-scroll::-webkit-scrollbar {
          height: 5px;
          width: 5px;
        }

        .college-dashboard .analytics-scroll::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }

        .college-dashboard .recharts-wrapper,
        .college-dashboard .recharts-surface {
          background: transparent !important;
          outline: none !important;
        }

        .college-dashboard .recharts-cartesian-axis-tick-value {
          fill: #cbd5e1 !important;
          font-size: 11px;
        }

        .college-dashboard .recharts-tooltip-wrapper {
          outline: none !important;
        }

        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(12deg); }
          75% { transform: rotate(-8deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .college-dashboard *,
          .college-dashboard *::before,
          .college-dashboard *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1600px] space-y-7 p-4 sm:p-6 xl:p-8">
        {/* HEADER */}

        <motion.header
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end"
        >

          <div className="flex flex-wrap items-center gap-2">
            <div className="w-[190px]">
              <PremiumDropdown
                value={period}
                options={periods}
                onChange={setPeriod}
                icon={CalendarDays}
                label="Time period"
                menuWidth="min-w-[225px]"
              />
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.035] px-3.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-300/30 hover:bg-cyan-300/[0.06] active:scale-[0.98]"
            >
              <motion.span
                animate={refreshed ? { rotate: 360 } : { rotate: 0 }}
                transition={{ duration: 0.55 }}
                className="flex"
              >
                <RefreshCw size={14} />
              </motion.span>

              {refreshed ? "Updated" : "Refresh"}
            </button>

            <button
              type="button"
              onClick={handleExport}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-blue-300 px-3.5 text-xs font-bold text-[#071522] transition hover:brightness-110 active:scale-[0.98]"
            >
              <Download size={14} />
              Export CSV
            </button>
          </div>
        </motion.header>

        {/* KEY METRICS */}

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                Key indicators
              </p>

              <p className="mt-1 text-xs text-slate-400">
                Overview for {period.toLowerCase()}
              </p>
            </div>

            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/[0.06] px-3 py-1.5 text-[10px] font-medium text-emerald-300">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-300" />
              Analytics active
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
            <MetricCard
              title="Total Students"
              value="648"
              change="+12.8%"
              description="vs previous period"
              icon={Users}
              color="text-cyan-300"
              delay={0.05}
            />

            <MetricCard
              title="Active Learners"
              value="482"
              change="+8.4%"
              description="vs previous period"
              icon={Activity}
              color="text-blue-300"
              delay={0.12}
            />

            <MetricCard
              title="Course Completion"
              value="84.6%"
              change="+6.2%"
              description="vs previous period"
              icon={Target}
              color="text-violet-300"
              delay={0.19}
            />

            <MetricCard
              title="Learning Hours"
              value="2,840"
              change="+18.5%"
              description="vs previous period"
              icon={Clock3}
              color="text-emerald-300"
              delay={0.26}
            />
          </div>
        </section>

        {/* GROWTH CHART */}

        <section className="grid grid-cols-1 gap-5">
          <ChartCard>
            <SectionHeading
              eyebrow="Growth overview"
              title="Student growth & completion"
              subtitle="Monthly student activity and course completion trend."
              action={
                <div className="flex items-center gap-4 text-[10px] text-slate-400">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-cyan-300" />
                    Students
                  </span>

                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />
                    Completion
                  </span>
                </div>
              }
            />

            <div className="h-[270px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 10, right: 8, left: -18, bottom: 0 }}
                >
                  <defs>
                    <linearGradient
                      id="studentsGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#67e8f9" stopOpacity={0.25} />
                      <stop offset="95%" stopColor="#67e8f9" stopOpacity={0} />
                    </linearGradient>

                    <linearGradient
                      id="completionGradient"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#60a5fa" stopOpacity={0.18} />
                      <stop offset="95%" stopColor="#60a5fa" stopOpacity={0} />
                    </linearGradient>
                  </defs>

                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(148,163,184,0.12)"
                    fill="transparent"
                  />

                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                  />

                  <Tooltip content={<DarkTooltip />} cursor={false} />

                  <Area
                    type="monotone"
                    dataKey="students"
                    name="Students"
                    stroke="#67e8f9"
                    strokeWidth={2.5}
                    fill="url(#studentsGradient)"
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#a5f3fc" }}
                    animationDuration={1200}
                  />

                  <Area
                    type="monotone"
                    dataKey="completion"
                    name="Completion"
                    stroke="#60a5fa"
                    strokeWidth={2.5}
                    fill="url(#completionGradient)"
                    activeDot={{ r: 5, strokeWidth: 0, fill: "#93c5fd" }}
                    animationDuration={1400}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
              <div>
                <p className="text-xs text-slate-400">
                  Student growth during selected period
                </p>

                <p className="mt-1 text-sm font-semibold text-white">
                  Consistent upward trend
                </p>
              </div>

              <span className="inline-flex items-center gap-1 rounded-lg bg-emerald-400/10 px-2.5 py-1.5 text-xs font-bold text-emerald-300">
                <TrendingUp size={13} />
                +20.4%
              </span>
            </div>
          </ChartCard>
        </section>

        {/* WEEKLY ENGAGEMENT + PERFORMANCE */}

        <section className="grid grid-cols-1 gap-5 xl:grid-cols-5">
          <ChartCard className="xl:col-span-3">
            <SectionHeading
              eyebrow="Engagement"
              title="Weekly learning activity"
              subtitle="Learning engagement score across the week."
              action={
                <span className="rounded-lg border border-cyan-300/15 bg-cyan-300/[0.06] px-2.5 py-1.5 text-[10px] font-semibold text-cyan-200">
                  Average 62.6%
                </span>
              }
            />

            <div className="h-[230px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={engagementData}
                  margin={{ top: 8, right: 5, left: -20, bottom: 0 }}
                  barCategoryGap="25%"
                  style={{ background: "transparent" }}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="rgba(148,163,184,0.12)"
                    fill="transparent"
                  />

                  <XAxis
                    dataKey="name"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                  />

                  <YAxis
                    domain={[0, 100]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#cbd5e1", fontSize: 11 }}
                  />

                  <Tooltip
                    content={<DarkTooltip />}
                    cursor={false}
                    isAnimationActive={false}
                  />

                  <Bar
                    dataKey="value"
                    name="Engagement"
                    radius={[6, 6, 0, 0]}
                    maxBarSize={32}
                    animationDuration={1000}
                    background={false}
                  >
                    {engagementData.map((item, index) => (
                      <Cell
                        key={item.name}
                        fill={index === 3 ? "#67e8f9" : "#3b82f6"}
                        fillOpacity={index === 3 ? 1 : 0.58}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </ChartCard>

          <ChartCard className="flex flex-col xl:col-span-2">
            <SectionHeading
              eyebrow="Learning outcomes"
              title="Performance snapshot"
              subtitle="Current learning targets and progress."
            />

            <div className="space-y-5">
              {[
                {
                  label: "Course completion",
                  value: 84,
                  target: "Target 80%",
                  color: "from-cyan-300 to-blue-400",
                },
                {
                  label: "Student participation",
                  value: 76,
                  target: "Target 85%",
                  color: "from-blue-400 to-indigo-400",
                },
                {
                  label: "Assignment success",
                  value: 91,
                  target: "Target 90%",
                  color: "from-emerald-300 to-cyan-300",
                },
                {
                  label: "Attendance rate",
                  value: 88,
                  target: "Target 90%",
                  color: "from-violet-300 to-blue-400",
                },
              ].map((item, index) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-slate-300">
                      {item.label}
                    </span>

                    <span className="text-xs font-bold tabular-nums text-white">
                      {item.value}%
                    </span>
                  </div>

                  <div className="relative h-2 overflow-hidden rounded-full bg-white/[0.07]">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{
                        duration: 1,
                        delay: index * 0.12,
                        ease: "easeOut",
                      }}
                      className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                    />
                  </div>

                  <p className="mt-1.5 text-right text-[10px] text-slate-500">
                    {item.target}
                  </p>
                </div>
              ))}
            </div>

            <div className="mt-auto pt-5">
              <div className="flex items-start gap-3 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.045] p-3.5">
                <Zap size={17} className="mt-0.5 shrink-0 text-cyan-300" />

                <div>
                  <p className="text-xs font-semibold text-white">
                    Strong overall performance
                  </p>

                  <p className="mt-1 text-[11px] leading-5 text-slate-400">
                    Three of four learning indicators are near or above target.
                  </p>
                </div>
              </div>
            </div>
          </ChartCard>
        </section>

        {/* SHARED FILTER + BOTH BOXES TOGETHER */}

        <section>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-5 flex flex-col justify-between gap-4 rounded-2xl border border-cyan-300/10 bg-gradient-to-r from-[#11243a] to-[#101b30] p-4 sm:flex-row sm:items-center sm:p-5"
          >
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
                <Activity size={19} />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Combined analytics
                </p>

                <h2 className="mt-1 text-base font-bold text-white">
                  Department insights
                </h2>

                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Change the department once to update the chart and course list together.
                </p>
              </div>
            </div>

            <div className="w-full sm:w-[255px]">
              <PremiumDropdown
                value={department}
                options={departmentOptions}
                onChange={setDepartment}
                icon={Users}
                label="Department filter"
                menuWidth="min-w-[260px]"
              />
            </div>
          </motion.div>

          <div className="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-5">
            {/* DISTRIBUTION BOX */}

            <ChartCard className="xl:col-span-2">
              <SectionHeading
                eyebrow="Distribution"
                title="Students by department"
                subtitle={
                  department === "All departments"
                    ? "Enrollment across all academic departments."
                    : `Department enrollment for ${department}.`
                }
              />

              <AnimatePresence mode="wait">
                <motion.div
                  key={department}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  transition={{ duration: 0.22 }}
                >
                  <div className="relative h-[230px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={displayedDepartments}
                          dataKey="students"
                          nameKey="name"
                          innerRadius={61}
                          outerRadius={91}
                          paddingAngle={4}
                          stroke="none"
                          animationBegin={0}
                          animationDuration={650}
                        >
                          {displayedDepartments.map((item) => {
                            const isSelected =
                              department === "All departments" ||
                              item.name === department;

                            return (
                              <Cell
                                key={item.name}
                                fill={item.color}
                                fillOpacity={isSelected ? 1 : 0.16}
                                stroke={
                                  item.name === department
                                    ? "#e0f2fe"
                                    : "transparent"
                                }
                                strokeWidth={
                                  item.name === department ? 2 : 0
                                }
                              />
                            );
                          })}
                        </Pie>

                        <Tooltip
                          content={<DarkTooltip />}
                          cursor={false}
                        />
                      </PieChart>
                    </ResponsiveContainer>

                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                      <motion.span
                        key={displayedStudentCount}
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-3xl font-bold tracking-tight text-white"
                      >
                        {displayedStudentCount}
                      </motion.span>

                      <span className="mt-1 text-[10px] text-slate-400">
                        {department === "All departments"
                          ? "Total students"
                          : "Department students"}
                      </span>

                      {selectedDepartment && (
                        <span className="mt-1 max-w-[135px] truncate text-[10px] font-semibold text-cyan-200">
                          {selectedDepartment.name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="mt-3 space-y-3">
                    {displayedDepartments.map((item, index) => {
                      const isSelected =
                        department === "All departments" ||
                        item.name === department;

                      const share = (
                        (item.students /
                          departmentData.reduce(
                            (sum, entry) => sum + entry.students,
                            0
                          )) *
                        100
                      ).toFixed(1);

                      return (
                        <motion.div
                          key={item.name}
                          initial={{ opacity: 0, x: 8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.04 }}
                          className={`flex items-center justify-between gap-3 rounded-xl px-2 py-2 transition-colors ${item.name === department
                            ? "bg-cyan-300/[0.07]"
                            : ""
                            }`}
                        >
                          <div className="flex min-w-0 items-center gap-2.5">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor: item.color,
                                opacity: isSelected ? 1 : 0.35,
                              }}
                            />

                            <span
                              className={`truncate text-xs ${item.name === department
                                ? "font-semibold text-cyan-100"
                                : "text-slate-300"
                                }`}
                            >
                              {item.name}
                            </span>
                          </div>

                          <div className="flex shrink-0 items-center gap-3">
                            <span className="text-[10px] text-slate-500">
                              {share}%
                            </span>

                            <span className="min-w-[28px] text-right text-xs font-semibold tabular-nums text-white">
                              {item.students}
                            </span>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              </AnimatePresence>
            </ChartCard>

            {/* COURSE INSIGHTS BOX */}

            <ChartCard className="xl:col-span-3">
              <SectionHeading
                eyebrow="Course insights"
                title="Top performing courses"
                subtitle={
                  department === "All departments"
                    ? "Compare enrollment and course completion across courses."
                    : `Courses associated with ${department}.`
                }
                action={
                  <Link
                    to="/college/courses"
                    className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-cyan-300 transition hover:text-cyan-100"
                  >
                    View courses <ArrowRight size={14} />
                  </Link>
                }
              />

              <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <span className="text-[11px] text-slate-500">
                  {filteredCourses.length} course
                  {filteredCourses.length !== 1 ? "s" : ""} found
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-300/10 bg-cyan-300/[0.05] px-2.5 py-1.5 text-[10px] font-medium text-cyan-200">
                  <CheckCircle2 size={12} />
                  {department === "All departments"
                    ? "All departments"
                    : "Filter applied"}
                </span>
              </div>

              <div className="analytics-scroll w-full overflow-x-auto">
                <table className="w-full min-w-[520px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-wider text-slate-500">
                      <th className="pb-3 pr-4 font-semibold">Course</th>
                      <th className="pb-3 pr-4 font-semibold">Enrolled</th>
                      <th className="pb-3 pr-4 font-semibold">Completion</th>
                      <th className="pb-3 text-right font-semibold">Growth</th>
                    </tr>
                  </thead>

                  <tbody>
                    <AnimatePresence mode="popLayout">
                      {filteredCourses.map((course, index) => (
                        <motion.tr
                          layout
                          key={course.name}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{
                            duration: 0.2,
                            delay: index * 0.04,
                          }}
                          className="border-b border-white/[0.05] last:border-0"
                        >
                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-3">
                              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.04] text-cyan-200">
                                <BookOpen size={16} />
                              </span>

                              <div>
                                <p className="text-xs font-semibold text-slate-100">
                                  {course.name}
                                </p>

                                <p className="mt-1 text-[10px] text-slate-500">
                                  {course.category}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="py-4 pr-4 text-xs font-semibold tabular-nums text-slate-200">
                            {course.enrolled}
                          </td>

                          <td className="py-4 pr-4">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.07]">
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${course.completion}%`,
                                  }}
                                  transition={{
                                    duration: 0.8,
                                    delay: index * 0.08,
                                  }}
                                  className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-blue-400"
                                />
                              </div>

                              <span className="text-[11px] tabular-nums text-slate-300">
                                {course.completion}%
                              </span>
                            </div>
                          </td>

                          <td className="py-4 text-right">
                            <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-300">
                              <ArrowUpRight size={13} />
                              {course.growth}
                            </span>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>

                {filteredCourses.length === 0 && (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <BookOpen size={25} className="mb-3 text-slate-600" />

                    <p className="text-sm font-semibold text-slate-300">
                      No courses found
                    </p>

                    <p className="mt-1 text-xs text-slate-500">
                      Try selecting another department.
                    </p>
                  </div>
                )}
              </div>
            </ChartCard>
          </div>
        </section>

        {/* RECENT ACTIVITY */}

        <section className="grid grid-cols-1 gap-5">
          <ChartCard>
            <SectionHeading
              eyebrow="Recent activity"
              title="Analytics highlights"
              subtitle="Recent changes across learning programs."
              action={
                <Link
                  to="/college/notifications"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 transition hover:text-cyan-100"
                >
                  View notifications <ArrowRight size={14} />
                </Link>
              }
            />

            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {initialActivities.map((activity, index) => {
                const Icon = activity.icon;

                return (
                  <motion.div
                    key={activity.title}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + index * 0.08 }}
                    className="flex gap-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${activity.bg} ${activity.color}`}
                    >
                      <Icon size={18} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-5 text-slate-100">
                        {activity.title}
                      </p>

                      <p className="mt-1 text-[11px] leading-5 text-slate-400">
                        {activity.detail}
                      </p>

                      <p className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                        <CalendarDays size={11} />
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </ChartCard>
        </section>

        {/* BOTTOM CTA */}

        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-gradient-to-r from-[#12243a] via-[#102039] to-[#142344] p-5 sm:p-6"
        >
          <div className="pointer-events-none absolute -right-10 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.07] blur-3xl" />

          <div className="relative flex flex-col justify-between gap-5 md:flex-row md:items-center">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/15 bg-cyan-300/10 text-cyan-200">
                <GraduationCap size={23} />
              </div>

              <div>
                <h2 className="text-base font-bold text-white sm:text-lg">
                  Turn insights into action
                </h2>

                <p className="mt-1 max-w-xl text-xs leading-6 text-slate-400">
                  Use course and engagement trends to identify opportunities,
                  support students, and improve learning outcomes.
                </p>
              </div>
            </div>

            <Link
              to="/college/students"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-200 to-blue-300 px-4 py-3 text-xs font-bold text-[#081523] shadow-lg shadow-cyan-950/20 transition hover:-translate-y-0.5 hover:shadow-cyan-900/30"
            >
              Explore students <ArrowRight size={15} />
            </Link>
          </div>
        </motion.section>


      </div>
    </motion.main>
  );
}
