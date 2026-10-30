import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Download,
  FileSpreadsheet,
  GraduationCap,
  RefreshCw,
  Search,
  TrendingUp,
  Wallet,
  X,
} from "lucide-react";

/* =====================================================
   ORANGE AND WHITE PREMIUM THEME
===================================================== */

const COLORS = {
  orange: "#F4512B",
  orangeDark: "#D9411F",
  orangeLight: "#FFF0EA",
  orangeSoft: "#FFF8F5",
  background: "#F7F7F7",
  white: "#FFFFFF",
  border: "#E8E8E8",
  black: "#252525",
  text: "#454545",
  muted: "#686868",
  green: "#218653",
  greenLight: "#EAF7EE",
  blue: "#347FC7",
  blueLight: "#EDF5FF",
  purple: "#8058BE",
  purpleLight: "#F4EEFF",
};

/* =====================================================
   SAMPLE ANALYTICS DATA
===================================================== */

const analyticsData = {
  week: [
    { label: "Mon", students: 42, requests: 18, completed: 12, pending: 5, revenue: 12000 },
    { label: "Tue", students: 58, requests: 22, completed: 16, pending: 7, revenue: 15500 },
    { label: "Wed", students: 48, requests: 15, completed: 13, pending: 4, revenue: 13500 },
    { label: "Thu", students: 72, requests: 28, completed: 21, pending: 8, revenue: 21000 },
    { label: "Fri", students: 84, requests: 32, completed: 25, pending: 9, revenue: 26500 },
    { label: "Sat", students: 61, requests: 20, completed: 17, pending: 6, revenue: 18000 },
    { label: "Sun", students: 75, requests: 25, completed: 22, pending: 5, revenue: 23000 },
  ],

  month: [
    { label: "Week 1", students: 280, requests: 82, completed: 66, pending: 24, revenue: 125000 },
    { label: "Week 2", students: 340, requests: 96, completed: 82, pending: 31, revenue: 168000 },
    { label: "Week 3", students: 310, requests: 88, completed: 74, pending: 27, revenue: 149000 },
    { label: "Week 4", students: 420, requests: 118, completed: 103, pending: 35, revenue: 218000 },
  ],

  quarter: [
    { label: "W1", students: 190, requests: 54, completed: 42, pending: 18, revenue: 82000 },
    { label: "W2", students: 215, requests: 60, completed: 48, pending: 20, revenue: 94000 },
    { label: "W3", students: 245, requests: 65, completed: 56, pending: 22, revenue: 105000 },
    { label: "W4", students: 220, requests: 59, completed: 50, pending: 19, revenue: 98000 },
    { label: "W5", students: 280, requests: 76, completed: 65, pending: 26, revenue: 126000 },
    { label: "W6", students: 310, requests: 88, completed: 73, pending: 29, revenue: 142000 },
    { label: "W7", students: 275, requests: 79, completed: 67, pending: 24, revenue: 130000 },
    { label: "W8", students: 340, requests: 92, completed: 81, pending: 32, revenue: 158000 },
    { label: "W9", students: 360, requests: 98, completed: 89, pending: 33, revenue: 174000 },
    { label: "W10", students: 325, requests: 90, completed: 77, pending: 28, revenue: 151000 },
    { label: "W11", students: 395, requests: 108, completed: 94, pending: 36, revenue: 192000 },
    { label: "W12", students: 430, requests: 121, completed: 106, pending: 39, revenue: 215000 },
  ],

  year: [
    { label: "Jan", students: 180, requests: 52, completed: 38, pending: 17, revenue: 78000 },
    { label: "Feb", students: 220, requests: 60, completed: 48, pending: 20, revenue: 92000 },
    { label: "Mar", students: 260, requests: 69, completed: 57, pending: 22, revenue: 108000 },
    { label: "Apr", students: 245, requests: 65, completed: 54, pending: 21, revenue: 103000 },
    { label: "May", students: 310, requests: 82, completed: 72, pending: 27, revenue: 132000 },
    { label: "Jun", students: 335, requests: 91, completed: 79, pending: 30, revenue: 145000 },
    { label: "Jul", students: 290, requests: 78, completed: 68, pending: 25, revenue: 129000 },
    { label: "Aug", students: 370, requests: 99, completed: 87, pending: 32, revenue: 162000 },
    { label: "Sep", students: 395, requests: 106, completed: 95, pending: 35, revenue: 181000 },
    { label: "Oct", students: 430, requests: 118, completed: 103, pending: 38, revenue: 205000 },
    { label: "Nov", students: 450, requests: 125, completed: 110, pending: 41, revenue: 223000 },
    { label: "Dec", students: 490, requests: 137, completed: 122, pending: 45, revenue: 249000 },
  ],
};

/* =====================================================
   PROGRAM PERFORMANCE
===================================================== */

const programData = [
  { name: "Full Stack Development", students: 520, completed: 442 },
  { name: "Python AI / ML", students: 460, completed: 386 },
  { name: "Java and DSA", students: 390, completed: 319 },
  { name: "Data Science", students: 310, completed: 251 },
  { name: "Cloud Computing", students: 220, completed: 174 },
];

/* =====================================================
   DROPDOWN OPTIONS
===================================================== */

const rangeOptions = [
  { label: "Last 7 days", value: "week" },
  { label: "Last 30 days", value: "month" },
  { label: "Last 90 days", value: "quarter" },
  { label: "This year", value: "year" },
];

const metricOptions = [
  { label: "Student Registrations", value: "students" },
  { label: "Trainer Requests", value: "requests" },
  { label: "Completed Assignments", value: "completed" },
  { label: "Pending Assignments", value: "pending" },
  { label: "Revenue", value: "revenue" },
];

const sortOptions = [
  { label: "Period order", value: "period" },
  { label: "Highest students", value: "students" },
  { label: "Highest requests", value: "requests" },
  { label: "Highest completion", value: "completion" },
];

/* =====================================================
   HELPER FUNCTIONS
===================================================== */

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value || 0);
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCompactCurrency(value) {
  if (value >= 100000) {
    return `Rs. ${(value / 100000).toFixed(1)}L`;
  }

  if (value >= 1000) {
    return `Rs. ${(value / 1000).toFixed(0)}k`;
  }

  return formatNumber(value);
}

function getCurrentDate() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

/* =====================================================
   FIX 1: SECTION HEADING COMPONENT
   This prevents SectionHeading is not defined.
===================================================== */

function SectionHeading({ title, subtitle, children }) {
  return (
    <div className="flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="min-w-0">
        <h2 className="text-[16px] font-extrabold tracking-tight text-[#252525]">
          {title}
        </h2>

        {subtitle && (
          <p className="mt-1.5 text-[12px] font-medium leading-5 text-[#555555]">
            {subtitle}
          </p>
        )}
      </div>

      {children && (
        <div className="shrink-0">
          {children}
        </div>
      )}
    </div>
  );
}

/* =====================================================
   CUSTOM PREMIUM DROPDOWN
===================================================== */

function PremiumDropdown({
  value,
  onChange,
  options,
  ariaLabel,
  icon: Icon,
  minWidth = 170,
  align = "left",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;

    const handleOutside = (event) => {
      if (
        rootRef.current &&
        !rootRef.current.contains(event.target)
      ) {
        setOpen(false);
      }
    };

    const handleKeyboard = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handleOutside);
    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("pointerdown", handleOutside);
      document.removeEventListener("keydown", handleKeyboard);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className="relative inline-block"
      style={{ minWidth }}
    >
      <motion.button
        type="button"
        aria-label={ariaLabel}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        whileTap={{ scale: 0.985 }}
        className="flex h-[44px] w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 text-left shadow-sm outline-none transition-colors duration-200 hover:border-[#F2B3A3] focus-visible:ring-4 focus-visible:ring-orange-100"
        style={{
          borderColor: open ? "#F3A58F" : COLORS.border,
          color: COLORS.black,
        }}
      >
        <span className="flex min-w-0 items-center gap-2">
          {Icon && (
            <Icon
              size={16}
              className="shrink-0"
              style={{ color: COLORS.orange }}
            />
          )}

          <span className="truncate text-[13px] font-bold">
            {selectedOption.label}
          </span>
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[#454545]"
        >
          <ChevronDown size={16} />
        </motion.span>
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 7, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.985 }}
            transition={{
              duration: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            role="listbox"
            aria-label={ariaLabel}
            className={`absolute top-[calc(100%+8px)] z-[80] overflow-hidden rounded-xl border border-[#EAEAEA] bg-white p-1.5 shadow-[0_14px_36px_rgba(30,30,30,0.13)] ${align === "right" ? "right-0" : "left-0"
              }`}
            style={{
              width: "max-content",
              minWidth: Math.max(minWidth, 185),
              maxWidth: "min(300px, calc(100vw - 32px))",
            }}
          >
            <div className="analytics-dropdown-scroll max-h-[280px] overflow-y-auto overscroll-contain">
              {options.map((option) => {
                const selected = option.value === value;

                return (
                  <motion.button
                    key={option.value}
                    type="button"
                    role="option"
                    aria-selected={selected}
                    onClick={() => {
                      onChange(option.value);
                      setOpen(false);
                    }}
                    whileHover={{ x: 2 }}
                    className="flex min-h-[42px] w-full items-center justify-between gap-4 rounded-lg px-3.5 text-left transition-colors duration-150"
                    style={{
                      color: selected
                        ? COLORS.orangeDark
                        : COLORS.black,
                      backgroundColor: selected
                        ? COLORS.orangeLight
                        : COLORS.white,
                    }}
                  >
                    <span className="text-[13px] font-semibold">
                      {option.label}
                    </span>

                    {selected && (
                      <Check
                        size={16}
                        className="shrink-0"
                        style={{ color: COLORS.orange }}
                      />
                    )}
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* =====================================================
   CHART TOOLTIP
===================================================== */

function AnalyticsTooltip({
  active,
  payload,
  label,
  metric = "students",
}) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[170px] rounded-xl border border-[#E8E8E8] bg-white p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <p className="mb-2 text-[13px] font-extrabold text-[#252525]">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-5 py-1.5"
        >
          <span className="flex items-center gap-2 text-[12px] font-semibold text-[#454545]">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: item.color || COLORS.orange,
              }}
            />

            {item.name}
          </span>

          <span className="text-[12px] font-extrabold text-[#252525]">
            {metric === "revenue"
              ? formatCurrency(Number(item.value || 0))
              : formatNumber(Number(item.value || 0))}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   CSV EXPORT
===================================================== */

function downloadCSV(rows, filename) {
  const headers = [
    "Period",
    "New Students",
    "Trainer Requests",
    "Completed Assignments",
    "Pending Assignments",
    "Completion Rate",
    "Revenue INR",
  ];

  const escapeCSV = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const content = [
    headers.map(escapeCSV).join(","),

    ...rows.map((row) =>
      [
        row.label,
        row.students,
        row.requests,
        row.completed,
        row.pending,
        `${row.completionRate}%`,
        row.revenue,
      ]
        .map(escapeCSV)
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", content], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

/* =====================================================
   MAIN ANALYTICS PAGE
===================================================== */

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState("month");
  const [metric, setMetric] = useState("students");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("period");
  const [notice, setNotice] = useState("");

  const activeData = analyticsData[dateRange] || analyticsData.month;

  const rangeLabel =
    rangeOptions.find((option) => option.value === dateRange)?.label ||
    "Last 30 days";

  const activeMetric =
    metricOptions.find((option) => option.value === metric) ||
    metricOptions[0];

  /* SUMMARY CALCULATIONS */

  const summary = useMemo(() => {
    const totalStudents = activeData.reduce(
      (total, row) => total + row.students,
      0
    );

    const totalRequests = activeData.reduce(
      (total, row) => total + row.requests,
      0
    );

    const totalCompleted = activeData.reduce(
      (total, row) => total + row.completed,
      0
    );

    const totalPending = activeData.reduce(
      (total, row) => total + row.pending,
      0
    );

    const totalRevenue = activeData.reduce(
      (total, row) => total + row.revenue,
      0
    );

    const completionRate =
      totalCompleted + totalPending > 0
        ? Math.round(
          (totalCompleted / (totalCompleted + totalPending)) * 100
        )
        : 0;

    return {
      totalStudents,
      totalRequests,
      totalCompleted,
      totalPending,
      totalRevenue,
      completionRate,
    };
  }, [activeData]);

  /* SEARCH AND SORT TABLE */

  const tableRows = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    let rows = activeData.map((row) => ({
      ...row,
      completionRate:
        row.completed + row.pending > 0
          ? Math.round(
            (row.completed / (row.completed + row.pending)) * 100
          )
          : 0,
    }));

    if (query) {
      rows = rows.filter((row) =>
        [
          row.label,
          row.students,
          row.requests,
          row.completed,
          row.pending,
          row.completionRate,
          row.revenue,
        ].some((value) =>
          String(value).toLowerCase().includes(query)
        )
      );
    }

    if (sortBy === "students") {
      rows.sort((a, b) => b.students - a.students);
    } else if (sortBy === "requests") {
      rows.sort((a, b) => b.requests - a.requests);
    } else if (sortBy === "completion") {
      rows.sort((a, b) => b.completionRate - a.completionRate);
    }

    return rows;
  }, [activeData, searchQuery, sortBy]);

  /* EXPORT REPORT */

  const handleExport = () => {
    downloadCSV(
      tableRows,
      `codefaculty-analytics-${dateRange}.csv`
    );

    setNotice(
      `${tableRows.length} analytics records exported successfully.`
    );
  };

  /* CHART TOTAL */

  const selectedMetricTotal = activeData.reduce(
    (total, row) => total + (row[metric] || 0),
    0
  );

  return (
    <div className="analytics-page space-y-6 pb-8 text-[#252525]">
      <style>{`
        .analytics-dropdown-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .analytics-dropdown-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .analytics-page .recharts-cartesian-axis-tick-value {
          fill: #454545;
          font-size: 12px;
          font-weight: 600;
        }

        .analytics-page .recharts-cartesian-grid-horizontal line {
          stroke: #E8E8E8;
        }

        .analytics-page input {
          color: #111111;
          -webkit-text-fill-color: #111111;
        }

        .analytics-page input::placeholder {
          color: #686868;
          -webkit-text-fill-color: #686868;
          opacity: 1;
          font-weight: 500;
        }

        @media (prefers-reduced-motion: reduce) {
          .analytics-page *,
          .analytics-page *::before,
          .analytics-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* PAGE HEADER */}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F4512B]" />

            <span className="text-[11px] font-extrabold uppercase tracking-[0.15em] text-[#D9411F]">
              PLATFORM INSIGHTS
            </span>
          </div>

          <h1 className="text-[30px] font-extrabold leading-tight tracking-[-1px] text-[#252525] sm:text-[35px]">
            Analytics &amp; Reports
          </h1>

          <p className="mt-2 max-w-2xl text-[13px] font-medium leading-6 text-[#555555]">
            Understand platform growth, trainer operations, enrollments and revenue.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-[44px] items-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-3.5 text-[12px] font-bold text-[#333333]">
            <CalendarDays
              size={16}
              className="text-[#F4512B]"
            />
            {getCurrentDate()}
          </div>

          <PremiumDropdown
            ariaLabel="Select analytics date range"
            value={dateRange}
            onChange={(value) => {
              setDateRange(value);
              setNotice("");
            }}
            options={rangeOptions}
            icon={CalendarDays}
            minWidth={165}
            align="right"
          />

          <motion.button
            type="button"
            onClick={handleExport}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl bg-[#F4512B] px-4 text-[12px] font-bold text-white shadow-sm transition-shadow hover:shadow-md"
          >
            <Download size={16} />
            Export Report
          </motion.button>
        </div>
      </motion.section>

      {/* SUMMARY CARDS */}

      <section
        aria-label="Analytics summary"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {[
          {
            id: "students",
            title: "Student Registrations",
            value: formatNumber(summary.totalStudents),
            change: "+8.4%",
            detail: "Selected period",
            icon: GraduationCap,
            color: COLORS.orange,
            bg: COLORS.orangeLight,
            path: "/admin/students",
          },
          {
            id: "requests",
            title: "Trainer Requests",
            value: formatNumber(summary.totalRequests),
            change: "Requests received",
            detail: "Selected period",
            icon: ClipboardList,
            color: COLORS.blue,
            bg: COLORS.blueLight,
            path: "/admin/requests",
          },
          {
            id: "completion",
            title: "Completion Rate",
            value: `${summary.completionRate}%`,
            change: `${formatNumber(summary.totalCompleted)} completed`,
            detail: "Completion performance",
            icon: BadgeCheck,
            color: COLORS.green,
            bg: COLORS.greenLight,
            path: "/admin/assignments",
          },
          {
            id: "revenue",
            title: "Recorded Revenue",
            value: formatCompactCurrency(summary.totalRevenue),
            change: formatCurrency(summary.totalRevenue),
            detail: "Selected period",
            icon: Wallet,
            color: COLORS.purple,
            bg: COLORS.purpleLight,
            path: "/admin/payments",
          },
        ].map((stat, index) => {
          const Icon = stat.icon;

          return (
            <motion.div
              key={stat.id}
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.42,
                delay: index * 0.065,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{
                y: -4,
                transition: { duration: 0.18 },
              }}
            >
              <Link
                to={stat.path}
                className="group block h-full rounded-2xl border border-[#E8E8E8] bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-lg sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-[#454545]">
                      {stat.title}
                    </p>

                    <motion.p
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.35,
                        delay: index * 0.065 + 0.12,
                      }}
                      className="mt-4 break-words text-[28px] font-extrabold tracking-[-0.8px] text-[#252525] sm:text-[31px]"
                    >
                      {stat.value}
                    </motion.p>
                  </div>

                  <motion.div
                    whileHover={{ rotate: 5, scale: 1.06 }}
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                    style={{
                      color: stat.color,
                      backgroundColor: stat.bg,
                    }}
                  >
                    <Icon size={22} />
                  </motion.div>
                </div>

                <div className="mt-5 flex flex-wrap items-center gap-2">
                  <span
                    className="rounded-md px-2 py-1.5 text-[11px] font-bold"
                    style={{
                      color: stat.color,
                      backgroundColor: stat.bg,
                    }}
                  >
                    {stat.change}
                  </span>

                  <span className="text-[11px] font-semibold text-[#555555]">
                    {stat.detail}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-[#EEEEEE] pt-3">
                  <span className="text-[12px] font-semibold text-[#454545]">
                    View details
                  </span>

                  <ArrowRight
                    size={16}
                    className="text-[#555555] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#F4512B]"
                  />
                </div>
              </Link>
            </motion.div>
          );
        })}
      </section>

      {/* MAIN ANALYTICS CHART */}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.12 }}
        className="relative rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
      >
        <SectionHeading
          title="Performance Trends"
          subtitle={`Analytics overview for ${rangeLabel.toLowerCase()}`}
        >
          <PremiumDropdown
            ariaLabel="Select metric for performance chart"
            value={metric}
            onChange={setMetric}
            options={metricOptions}
            minWidth={205}
            align="right"
          />
        </SectionHeading>

        <div className="px-4 pb-5 pt-6 sm:px-6">
          <div className="mb-5 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[13px] font-semibold text-[#454545]">
                {activeMetric.label}
              </p>

              <motion.p
                key={`${metric}-${dateRange}-total`}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className="mt-1.5 text-[29px] font-extrabold tracking-[-0.8px] text-[#252525]"
              >
                {metric === "revenue"
                  ? formatCurrency(selectedMetricTotal)
                  : formatNumber(selectedMetricTotal)}
              </motion.p>

              <p className="mt-1 text-[12px] font-medium text-[#555555]">
                Total for {rangeLabel.toLowerCase()}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-[#FFF8F5] px-3 py-2 text-[12px] font-bold text-[#D9411F]">
              <TrendingUp size={16} />
              Selected metric
            </div>
          </div>

          <div className="h-[300px] w-full min-w-0 sm:h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                key={`main-${dateRange}-${metric}`}
                data={activeData}
                margin={{
                  top: 16,
                  right: 8,
                  left: -3,
                  bottom: 0,
                }}
                barCategoryGap="34%"
              >
                <CartesianGrid
                  vertical={false}
                  stroke="#E8E8E8"
                  strokeDasharray="4 5"
                />

                <XAxis
                  dataKey="label"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#454545",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  dy={12}
                  interval={dateRange === "quarter" ? 1 : 0}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fill: "#454545",
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                  tickFormatter={(value) =>
                    metric === "revenue"
                      ? formatCompactCurrency(value)
                      : value >= 1000
                        ? `${(value / 1000).toFixed(1)}k`
                        : value
                  }
                  width={70}
                />

                <Tooltip
                  content={<AnalyticsTooltip metric={metric} />}
                  cursor={false}
                />

                <Bar
                  dataKey={metric}
                  name={activeMetric.label}
                  fill={COLORS.orange}
                  radius={[8, 8, 2, 2]}
                  maxBarSize={42}
                  isAnimationActive
                  animationBegin={80}
                  animationDuration={1200}
                  animationEasing="ease-out"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEEEE] pt-4">
            <p className="text-[12px] font-semibold text-[#454545]">
              Reporting period: {rangeLabel}
            </p>

            <Link
              to="/admin/analytics"
              className="inline-flex items-center gap-2 text-[12px] font-bold text-[#D9411F] transition-all hover:gap-3"
            >
              Analytics overview
              <ArrowRight size={15} />
            </Link>
          </div>
        </div>
      </motion.section>

      {/* OPERATIONS AND PROGRAM PERFORMANCE */}

      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
        {/* OPERATIONS BREAKDOWN */}

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="min-w-0 rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
        >
          <SectionHeading
            title="Operations Breakdown"
            subtitle="Requests, completions and pending assignments"
          />

          <div className="p-4 sm:p-6">
            <div className="mb-5 grid grid-cols-3 gap-3">
              {[
                {
                  label: "Requests",
                  value: summary.totalRequests,
                },
                {
                  label: "Completed",
                  value: summary.totalCompleted,
                },
                {
                  label: "Pending",
                  value: summary.totalPending,
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-[#EEEEEE] bg-white p-3"
                >
                  <p className="text-[11px] font-semibold text-[#454545]">
                    {item.label}
                  </p>

                  <p className="mt-2 text-[23px] font-extrabold text-[#252525]">
                    {formatNumber(item.value)}
                  </p>
                </div>
              ))}
            </div>

            <div className="h-[260px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`ops-${dateRange}`}
                  data={activeData}
                  margin={{
                    top: 12,
                    right: 2,
                    left: -12,
                    bottom: 0,
                  }}
                  barCategoryGap="22%"
                  barGap={4}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#E8E8E8"
                    strokeDasharray="4 5"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#454545",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                    dy={10}
                    interval={dateRange === "quarter" ? 2 : 0}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#454545",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                    width={45}
                  />

                  <Tooltip
                    content={<AnalyticsTooltip />}
                    cursor={false}
                  />

                  <Bar
                    dataKey="requests"
                    name="Requests"
                    fill={COLORS.orange}
                    radius={[5, 5, 1, 1]}
                    maxBarSize={22}
                    isAnimationActive
                    animationBegin={80}
                    animationDuration={1100}
                    animationEasing="ease-out"
                  />

                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill="#292929"
                    radius={[5, 5, 1, 1]}
                    maxBarSize={22}
                    isAnimationActive
                    animationBegin={160}
                    animationDuration={1100}
                    animationEasing="ease-out"
                  />

                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="#A5A5A5"
                    radius={[5, 5, 1, 1]}
                    maxBarSize={22}
                    isAnimationActive
                    animationBegin={240}
                    animationDuration={1100}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-4 border-t border-[#EEEEEE] pt-4">
              {[
                { label: "Requests", color: COLORS.orange },
                { label: "Completed", color: "#292929" },
                { label: "Pending", color: "#A5A5A5" },
              ].map((item) => (
                <span
                  key={item.label}
                  className="flex items-center gap-2 text-[11px] font-semibold text-[#454545]"
                >
                  <span
                    className="h-2.5 w-2.5 rounded-sm"
                    style={{ backgroundColor: item.color }}
                  />

                  {item.label}
                </span>
              ))}
            </div>
          </div>
        </motion.article>

        {/* PROGRAM PERFORMANCE */}

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          className="min-w-0 rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
        >
          <SectionHeading
            title="Program Performance"
            subtitle="Student enrollments and completed learning"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
              <GraduationCap size={19} />
            </span>
          </SectionHeading>

          <div className="p-4 sm:p-6">
            <div className="h-[300px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key="program-performance"
                  layout="vertical"
                  data={programData}
                  margin={{
                    top: 4,
                    right: 12,
                    left: 4,
                    bottom: 0,
                  }}
                  barCategoryGap="30%"
                  barGap={5}
                >
                  <CartesianGrid
                    horizontal={false}
                    stroke="#E8E8E8"
                    strokeDasharray="4 5"
                  />

                  <XAxis
                    type="number"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#454545",
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  />

                  <YAxis
                    type="category"
                    dataKey="name"
                    width={138}
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fill: "#353535",
                      fontSize: 10,
                      fontWeight: 600,
                    }}
                  />

                  <Tooltip
                    content={<AnalyticsTooltip />}
                    cursor={false}
                  />

                  <Bar
                    dataKey="students"
                    name="Students"
                    fill={COLORS.orange}
                    radius={[0, 6, 6, 0]}
                    maxBarSize={20}
                    isAnimationActive
                    animationBegin={100}
                    animationDuration={1200}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-4 border-t border-[#EEEEEE] pt-4">
              <p className="text-[12px] font-semibold text-[#454545]">
                Highest enrollment
              </p>

              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-[13px] font-extrabold text-[#252525]">
                  {programData[0].name}
                </p>

                <span className="rounded-lg bg-[#FFF0EA] px-3 py-1.5 text-[12px] font-bold text-[#D9411F]">
                  {formatNumber(programData[0].students)} students
                </span>
              </div>
            </div>
          </div>
        </motion.article>
      </section>

      {/* DETAILED ANALYTICS TABLE */}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.25 }}
        className="relative rounded-2xl border border-[#E8E8E8] bg-white shadow-sm"
      >
        <SectionHeading
          title="Detailed Analytics"
          subtitle="Search, sort and export period-by-period performance"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
            <FileSpreadsheet size={19} />
          </span>
        </SectionHeading>

        {/* SEARCH AND SORT */}

        <div className="relative z-20 flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="relative w-full sm:max-w-[360px]">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#555555]"
            />

            <input
              type="search"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search period or metric..."
              aria-label="Search analytics table"
              autoComplete="off"
              className="h-[44px] w-full rounded-xl border border-[#E8E8E8] bg-white pl-10 pr-3 text-[13px] font-bold text-[#111111] caret-[#F4512B] outline-none transition-all duration-200 placeholder:font-medium placeholder:text-[#686868] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
              style={{
                WebkitTextFillColor: "#111111",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PremiumDropdown
              ariaLabel="Sort analytics rows"
              value={sortBy}
              onChange={setSortBy}
              options={sortOptions}
              minWidth={180}
              align="right"
            />

            <motion.button
              type="button"
              onClick={handleExport}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-[44px] items-center gap-2 rounded-xl border border-[#E8E8E8] bg-white px-4 text-[12px] font-bold text-[#252525] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5]"
            >
              <Download size={16} />
              Export CSV
            </motion.button>
          </div>
        </div>

        {/* EXPORT SUCCESS NOTICE */}

        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              role="status"
              className="flex items-center justify-between gap-3 border-b border-[#CDEBD7] bg-[#F0FAF3] px-5 py-3 text-[12px] font-semibold text-[#226A42]"
            >
              <span className="flex items-center gap-2">
                <CheckCircle2 size={16} />
                {notice}
              </span>

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#E0F4E7]"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left">
            <thead>
              <tr className="bg-[#FAFAFA]">
                {[
                  "PERIOD",
                  "STUDENTS",
                  "REQUESTS",
                  "COMPLETED",
                  "PENDING",
                  "COMPLETION RATE",
                  "REVENUE",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap border-b border-[#E8E8E8] px-5 py-4 text-[10px] font-extrabold tracking-[0.04em] text-[#454545] sm:px-6"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              <AnimatePresence mode="popLayout">
                {tableRows.map((row, index) => (
                  <motion.tr
                    key={`${dateRange}-${row.label}`}
                    layout
                    initial={{ opacity: 0, y: 7 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -5 }}
                    transition={{
                      duration: 0.2,
                      delay: Math.min(index * 0.025, 0.12),
                    }}
                    className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FFFAF8]"
                  >
                    <td className="whitespace-nowrap px-5 py-4 text-[12px] font-bold text-[#252525] sm:px-6">
                      {row.label}
                    </td>

                    <td className="px-5 py-4 text-[12px] font-bold text-[#252525] sm:px-6">
                      {formatNumber(row.students)}
                    </td>

                    <td className="px-5 py-4 text-[12px] font-bold text-[#252525] sm:px-6">
                      {formatNumber(row.requests)}
                    </td>

                    <td className="px-5 py-4 text-[12px] font-bold text-[#252525] sm:px-6">
                      {formatNumber(row.completed)}
                    </td>

                    <td className="px-5 py-4 text-[12px] font-bold text-[#252525] sm:px-6">
                      {formatNumber(row.pending)}
                    </td>

                    <td className="px-5 py-4 sm:px-6">
                      <span className="inline-flex rounded-full bg-[#EAF7EE] px-3 py-1.5 text-[11px] font-bold text-[#218653]">
                        {row.completionRate}%
                      </span>
                    </td>

                    <td className="whitespace-nowrap px-5 py-4 text-[12px] font-bold text-[#252525] sm:px-6">
                      {formatCurrency(row.revenue)}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>

              {tableRows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <Search
                      size={28}
                      className="mx-auto mb-3 text-[#A0A0A0]"
                    />

                    <p className="text-[14px] font-bold text-[#252525]">
                      No matching analytics found
                    </p>

                    <p className="mt-2 text-[12px] font-medium text-[#555555]">
                      Change the search text or clear the search.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setSortBy("period");
                      }}
                      className="mt-4 text-[12px] font-bold text-[#D9411F] hover:underline"
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#EEEEEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[12px] font-semibold text-[#454545]">
            Showing{" "}
            <span className="font-extrabold text-[#252525]">
              {tableRows.length}
            </span>{" "}
            of {activeData.length} periods
          </p>

          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSortBy("period");
              setNotice("");
            }}
            className="inline-flex items-center gap-2 self-start rounded-lg px-3 py-2 text-[12px] font-bold text-[#454545] transition-colors hover:bg-[#F2F2F2] sm:self-auto"
          >
            <RefreshCw size={14} />
            Reset table
          </button>
        </div>
      </motion.section>

      {/* BOTTOM SUMMARY */}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.3 }}
        className="flex flex-col gap-4 rounded-2xl border border-[#E8E8E8] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#218653]">
            <BadgeCheck size={22} />
          </div>

          <div>
            <p className="text-[13px] font-bold text-[#252525]">
              Analytics summary
            </p>

            <p className="mt-1 text-[12px] font-medium text-[#555555]">
              {rangeLabel} report with{" "}
              {formatNumber(summary.totalStudents)} student registrations.
            </p>
          </div>
        </div>

        <Link
          to="/admin/requests"
          className="inline-flex items-center gap-2 self-start rounded-xl px-3 py-2 text-[12px] font-bold text-[#D9411F] transition-colors hover:bg-[#FFF0EA] sm:self-auto"
        >
          Review trainer requests
          <ArrowRight size={15} />
        </Link>
      </motion.section>
    </div>
  );
}