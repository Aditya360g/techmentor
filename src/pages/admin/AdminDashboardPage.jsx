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
  Activity,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock3,
  Download,
  FileSpreadsheet,
  GraduationCap,
  Search,
  UserRoundCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";

/* =====================================================
   THEME
===================================================== */

const COLORS = {
  orange: "#F4512B",
  orangeDark: "#DF3F1C",
  orangeLight: "#FFF0EA",
  orangeSoft: "#FFF8F5",

  background: "#F7F7F7",
  white: "#FFFFFF",
  border: "#EAEAEA",

  heading: "#292929",
  text: "#555555",
  muted: "#858585",

  green: "#228653",
  greenLight: "#EAF7EE",

  blue: "#347FC7",
  blueLight: "#EDF5FF",

  purple: "#8058BE",
  purpleLight: "#F4EEFF",
};

/* =====================================================
   SAMPLE DASHBOARD DATA
===================================================== */

const dashboardStats = [
  {
    id: "students",
    title: "Total Students",
    value: "2,500",
    change: "+8.4%",
    changeLabel: "vs last month",
    icon: GraduationCap,
    color: COLORS.orange,
    background: COLORS.orangeLight,
    positive: true,
    path: "/admin/students",
  },
  {
    id: "trainers",
    title: "Active Trainers",
    value: "110",
    change: "+7.2%",
    changeLabel: "vs last month",
    icon: Users,
    color: COLORS.blue,
    background: COLORS.blueLight,
    positive: true,
    path: "/admin/trainers",
  },
  {
    id: "requests",
    title: "Open Requests",
    value: "72",
    change: "12 urgent",
    changeLabel: "need attention",
    icon: UserRoundCheck,
    color: COLORS.purple,
    background: COLORS.purpleLight,
    positive: false,
    path: "/admin/requests",
  },
  {
    id: "revenue",
    title: "Platform Revenue",
    value: "\u20B98,22,064",
    change: "+12.8%",
    changeLabel: "vs last month",
    icon: Wallet,
    color: COLORS.green,
    background: COLORS.greenLight,
    positive: true,
    path: "/admin/payments",
  },
];

/* =====================================================
   CHART DATA
===================================================== */

const chartData = {
  week: [
    { label: "Mon", students: 42, requests: 18, completed: 12, pending: 5 },
    { label: "Tue", students: 58, requests: 22, completed: 16, pending: 7 },
    { label: "Wed", students: 48, requests: 15, completed: 13, pending: 4 },
    { label: "Thu", students: 72, requests: 28, completed: 21, pending: 8 },
    { label: "Fri", students: 84, requests: 32, completed: 25, pending: 9 },
    { label: "Sat", students: 61, requests: 20, completed: 17, pending: 6 },
    { label: "Sun", students: 75, requests: 25, completed: 22, pending: 5 },
  ],

  month: [
    { label: "Week 1", students: 280, requests: 82, completed: 66, pending: 24 },
    { label: "Week 2", students: 340, requests: 96, completed: 82, pending: 31 },
    { label: "Week 3", students: 310, requests: 88, completed: 74, pending: 27 },
    { label: "Week 4", students: 420, requests: 118, completed: 103, pending: 35 },
  ],

  quarter: [
    { label: "W1", students: 190, requests: 54, completed: 42, pending: 18 },
    { label: "W2", students: 215, requests: 60, completed: 48, pending: 20 },
    { label: "W3", students: 245, requests: 65, completed: 56, pending: 22 },
    { label: "W4", students: 220, requests: 59, completed: 50, pending: 19 },
    { label: "W5", students: 280, requests: 76, completed: 65, pending: 26 },
    { label: "W6", students: 310, requests: 88, completed: 73, pending: 29 },
    { label: "W7", students: 275, requests: 79, completed: 67, pending: 24 },
    { label: "W8", students: 340, requests: 92, completed: 81, pending: 32 },
    { label: "W9", students: 360, requests: 98, completed: 89, pending: 33 },
    { label: "W10", students: 325, requests: 90, completed: 77, pending: 28 },
    { label: "W11", students: 395, requests: 108, completed: 94, pending: 36 },
    { label: "W12", students: 430, requests: 121, completed: 106, pending: 39 },
  ],

  year: [
    { label: "Jan", students: 180, requests: 52, completed: 38, pending: 17 },
    { label: "Feb", students: 220, requests: 60, completed: 48, pending: 20 },
    { label: "Mar", students: 260, requests: 69, completed: 57, pending: 22 },
    { label: "Apr", students: 245, requests: 65, completed: 54, pending: 21 },
    { label: "May", students: 310, requests: 82, completed: 72, pending: 27 },
    { label: "Jun", students: 335, requests: 91, completed: 79, pending: 30 },
    { label: "Jul", students: 290, requests: 78, completed: 68, pending: 25 },
    { label: "Aug", students: 370, requests: 99, completed: 87, pending: 32 },
    { label: "Sep", students: 395, requests: 106, completed: 95, pending: 35 },
    { label: "Oct", students: 430, requests: 118, completed: 103, pending: 38 },
    { label: "Nov", students: 450, requests: 125, completed: 110, pending: 41 },
    { label: "Dec", students: 490, requests: 137, completed: 122, pending: 45 },
  ],
};

/* =====================================================
   REQUESTS
===================================================== */

const initialRequests = [
  {
    id: "REQ-1042",
    date: "26 Oct 2026",
    college: "Global University",
    program: "Python AI/ML",
    students: 90,
    status: "Shortlisting",
  },
  {
    id: "REQ-1041",
    date: "25 Oct 2026",
    college: "RKGIT",
    program: "Java + DSA",
    students: 120,
    status: "New",
  },
  {
    id: "REQ-1040",
    date: "24 Oct 2026",
    college: "Tech Institute",
    program: "Full Stack",
    students: 75,
    status: "Demo Scheduled",
  },
  {
    id: "REQ-1039",
    date: "23 Oct 2026",
    college: "Apex College",
    program: "Data Science",
    students: 60,
    status: "Approved",
  },
  {
    id: "REQ-1038",
    date: "22 Oct 2026",
    college: "Northview College",
    program: "Cloud Computing",
    students: 45,
    status: "Pending",
  },
];

const demos = [
  {
    id: "DEMO-101",
    time: "10:30 AM",
    trainer: "Aman Sharma",
    college: "RKGIT",
    program: "Java + DSA",
  },
  {
    id: "DEMO-102",
    time: "02:00 PM",
    trainer: "Priya Verma",
    college: "Global University",
    program: "Python AI/ML",
  },
  {
    id: "DEMO-103",
    time: "04:30 PM",
    trainer: "Rahul Mehta",
    college: "Tech Institute",
    program: "Full Stack",
  },
];

/* =====================================================
   OPTIONS
===================================================== */

const rangeOptions = [
  { label: "Last 7 days", value: "week" },
  { label: "Last 30 days", value: "month" },
  { label: "Last 90 days", value: "quarter" },
  { label: "This year", value: "year" },
];

const metricOptions = [
  { label: "New Students", value: "students" },
  { label: "Trainer Requests", value: "requests" },
  { label: "Completed Assignments", value: "completed" },
];

const statusOptions = [
  { label: "All statuses", value: "all" },
  { label: "New", value: "New" },
  { label: "Pending", value: "Pending" },
  { label: "Shortlisting", value: "Shortlisting" },
  { label: "Demo Scheduled", value: "Demo Scheduled" },
  { label: "Approved", value: "Approved" },
];

const statusStyles = {
  New: { color: "#3478C7", background: "#EDF5FF" },
  Pending: { color: "#A36B16", background: "#FFF5DF" },
  Shortlisting: { color: "#8058BE", background: "#F4EEFF" },
  "Demo Scheduled": { color: "#C64D27", background: "#FFF0EA" },
  Approved: { color: "#218354", background: "#EAF7EE" },
};

/* =====================================================
   HELPERS
===================================================== */

function formatNumber(value) {
  return new Intl.NumberFormat("en-IN").format(value);
}

function getCurrentDate() {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());
}

/* =====================================================
   PREMIUM DROPDOWN

   Scroll functionality retained; scrollbar is hidden.
===================================================== */

function PremiumDropdown({
  value,
  onChange,
  options,
  ariaLabel,
  icon: Icon,
  minWidth = 160,
  align = "left",
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);

  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    if (!open) return undefined;

    const handleOutsideClick = (event) => {
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

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyboard);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
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
        onClick={() => setOpen((previous) => !previous)}
        whileTap={{ scale: 0.985 }}
        className="flex h-[44px] w-full items-center justify-between gap-3 rounded-xl border bg-white px-3.5 text-left shadow-sm outline-none transition-colors duration-200 hover:border-[#F2B3A3] focus-visible:ring-4 focus-visible:ring-orange-100"
        style={{
          borderColor: open ? "#F3A58F" : "#E8E8E8",
          color: COLORS.heading,
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

          <span className="truncate text-[13px] font-semibold">
            {selectedOption.label}
          </span>
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          className="shrink-0 text-[#777777]"
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
            className={[
              "absolute top-[calc(100%+8px)] z-[80]",
              "overflow-hidden rounded-xl border border-[#EAEAEA]",
              "bg-white p-1.5 shadow-[0_14px_36px_rgba(30,30,30,0.13)]",
              align === "right" ? "right-0" : "left-0",
            ].join(" ")}
            style={{
              width: "max-content",
              minWidth: Math.max(minWidth, 185),
              maxWidth: "min(300px, calc(100vw - 32px))",
            }}
          >
            <div className="admin-dropdown-scroll max-h-[280px] overflow-y-auto overscroll-contain">
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
                      color: selected ? COLORS.orangeDark : "#343434",
                      backgroundColor: selected
                        ? COLORS.orangeLight
                        : "#FFFFFF",
                    }}
                  >
                    <span className="text-[13px] font-medium">
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
   STATUS BADGE
===================================================== */

function StatusBadge({ status }) {
  const style = statusStyles[status] || {
    color: "#666666",
    background: "#F2F2F2",
  };

  return (
    <span
      className="inline-flex whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-semibold"
      style={{
        color: style.color,
        backgroundColor: style.background,
      }}
    >
      {status}
    </span>
  );
}

/* =====================================================
   SECTION HEADER
===================================================== */

function SectionHeading({ title, subtitle, children }) {
  return (
    <div className="relative z-20 flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div>
        <h3 className="text-[15px] font-bold tracking-[-0.2px] text-[#292929] sm:text-[16px]">
          {title}
        </h3>

        {subtitle && (
          <p className="mt-1 text-[12px] leading-5 text-[#777777]">
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </div>
  );
}

/* =====================================================
   CHART TOOLTIP
===================================================== */

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="min-w-[165px] rounded-xl border border-[#EAEAEA] bg-white p-3.5 shadow-[0_10px_30px_rgba(0,0,0,0.12)]">
      <p className="mb-2 text-[13px] font-bold text-[#292929]">
        {label}
      </p>

      {payload.map((item) => (
        <div
          key={item.dataKey}
          className="flex items-center justify-between gap-5 py-1.5"
        >
          <span className="flex items-center gap-2 text-[12px] text-[#555555]">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{
                backgroundColor: item.color || COLORS.orange,
              }}
            />
            {item.name}
          </span>

          <span className="text-[12px] font-bold text-[#292929]">
            {formatNumber(Number(item.value || 0))}
          </span>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   STAT CARD
===================================================== */

function StatCard({ stat, index }) {
  const Icon = stat.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.45,
        delay: index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={{
        y: -4,
        transition: { duration: 0.18 },
      }}
      className="min-w-0"
    >
      <Link
        to={stat.path}
        className="group block h-full rounded-2xl border border-[#EAEAEA] bg-white p-5 shadow-[0_2px_10px_rgba(0,0,0,0.015)] transition-shadow duration-300 hover:shadow-[0_12px_30px_rgba(0,0,0,0.055)] sm:p-6"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[13px] font-medium text-[#656565]">
              {stat.title}
            </p>

            <motion.p
              initial={{ opacity: 0, y: 7 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.07 + 0.12,
              }}
              className="mt-3 break-words text-[28px] font-bold leading-tight tracking-[-1px] text-[#292929] sm:text-[32px]"
            >
              {stat.value}
            </motion.p>
          </div>

          <motion.div
            whileHover={{ rotate: 5, scale: 1.06 }}
            transition={{ duration: 0.2 }}
            className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
            style={{
              color: stat.color,
              backgroundColor: stat.background,
            }}
          >
            <Icon size={22} strokeWidth={1.8} />
          </motion.div>
        </div>

        <div className="mt-5 flex flex-wrap items-center gap-2">
          <span
            className="inline-flex items-center gap-1 rounded-md px-2 py-1.5 text-[11px] font-bold"
            style={{
              color: stat.positive ? "#218354" : "#BC4C2C",
              background: stat.positive
                ? COLORS.greenLight
                : COLORS.orangeLight,
            }}
          >
            {stat.positive ? (
              <ArrowUpRight size={13} />
            ) : (
              <Clock3 size={13} />
            )}

            {stat.change}
          </span>

          <span className="text-[11px] font-medium text-[#777777]">
            {stat.changeLabel}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-[#F1F1F1] pt-3">
          <span className="text-[12px] font-medium text-[#666666]">
            View details
          </span>

          <ArrowRight
            size={16}
            className="text-[#999999] transition-all duration-200 group-hover:translate-x-1 group-hover:text-[#F4512B]"
          />
        </div>
      </Link>
    </motion.div>
  );
}

/* =====================================================
   CSV EXPORT
===================================================== */

function exportRequestsToCSV(rows) {
  const headers = [
    "Request ID",
    "Date",
    "College",
    "Program",
    "Students",
    "Status",
  ];

  const escapeCSV = (value) =>
    `"${String(value ?? "").replace(/"/g, '""')}"`;

  const contents = [
    headers.map(escapeCSV).join(","),
    ...rows.map((row) =>
      [
        row.id,
        row.date,
        row.college,
        row.program,
        row.students,
        row.status,
      ]
        .map(escapeCSV)
        .join(",")
    ),
  ].join("\r\n");

  const blob = new Blob(["\uFEFF", contents], {
    type: "text/csv;charset=utf-8;",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = "techmentor-admin-requests.csv";

  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  URL.revokeObjectURL(url);
}

/* =====================================================
   MAIN DASHBOARD
===================================================== */

export default function AdminDashboardPage() {
  const [dateRange, setDateRange] = useState("month");
  const [chartMetric, setChartMetric] = useState("students");

  const [tableSearch, setTableSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [notice, setNotice] = useState("");

  const activeChartData = chartData[dateRange] || chartData.month;

  const rangeLabel =
    rangeOptions.find((option) => option.value === dateRange)?.label ||
    "Last 30 days";

  const activeMetric = metricOptions.find(
    (option) => option.value === chartMetric
  );

  const filteredRequests = useMemo(() => {
    const query = tableSearch.trim().toLowerCase();

    return initialRequests.filter((request) => {
      const matchesSearch =
        !query ||
        [
          request.id,
          request.college,
          request.program,
          request.status,
        ].some((value) =>
          String(value).toLowerCase().includes(query)
        );

      const matchesStatus =
        statusFilter === "all" || request.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [tableSearch, statusFilter]);

  const handleExport = () => {
    exportRequestsToCSV(filteredRequests);

    setNotice(
      `Export complete: ${filteredRequests.length} request records downloaded.`
    );
  };

  return (
    <div className="admin-dashboard-page space-y-6 pb-8">
      <style>{`
        .admin-dashboard-page .admin-dropdown-scroll {
          scrollbar-width: none;
          -ms-overflow-style: none;
        }

        .admin-dashboard-page .admin-dropdown-scroll::-webkit-scrollbar {
          display: none;
          width: 0;
          height: 0;
        }

        .admin-dashboard-page .recharts-cartesian-axis-tick-value {
          fill: #555555;
          font-size: 12px;
          font-weight: 600;
        }

        .admin-dashboard-page .recharts-cartesian-grid-horizontal line {
          stroke: #EAEAEA;
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-dashboard-page *,
          .admin-dashboard-page *::before,
          .admin-dashboard-page *::after {
            animation-duration: 0.01ms !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* PAGE HEADING */}

      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#F4512B]" />

            <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-[#E94B27]">
              ADMINISTRATION
            </span>
          </div>

          <h2 className="text-[30px] font-bold leading-tight tracking-[-1px] text-[#292929] sm:text-[34px]">
            Sales Overview
          </h2>

          <p className="mt-2 max-w-2xl text-[13px] leading-6 text-[#626262]">
            Monitor platform performance, user activity and operational requests.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex h-[44px] items-center gap-2 rounded-xl border border-[#EAEAEA] bg-white px-3.5 text-[12px] font-semibold text-[#444444]">
            <CalendarDays size={16} className="text-[#F4512B]" />
            {getCurrentDate()}
          </div>

          <PremiumDropdown
            ariaLabel="Reporting date range"
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
            className="inline-flex h-[44px] items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-bold text-white shadow-sm transition-shadow hover:shadow-md"
            style={{ backgroundColor: COLORS.orange }}
          >
            <Download size={16} />
            Export Report
          </motion.button>
        </div>
      </motion.section>

      {/* KPI CARDS */}

      <section
        aria-label="Platform metrics"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {dashboardStats.map((stat, index) => (
          <StatCard key={stat.id} stat={stat} index={index} />
        ))}
      </section>

      {/* CHARTS */}

      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[1.55fr_1fr]">
        {/* PLATFORM ACTIVITY */}

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="relative min-w-0 rounded-2xl border border-[#EAEAEA] bg-white shadow-sm"
        >
          <SectionHeading
            title="Platform Activity"
            subtitle={`Performance trends - ${rangeLabel}`}
          >
            <PremiumDropdown
              ariaLabel="Select platform metric"
              value={chartMetric}
              onChange={setChartMetric}
              options={metricOptions}
              minWidth={195}
              align="right"
            />
          </SectionHeading>

          <div className="px-4 pb-5 pt-6 sm:px-6">
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-[12px] font-medium text-[#666666]">
                  {activeMetric?.label || "New Students"}
                </p>

                <p className="mt-1.5 text-[26px] font-bold tracking-[-0.7px] text-[#292929]">
                  {formatNumber(
                    activeChartData.reduce(
                      (total, item) => total + (item[chartMetric] || 0),
                      0
                    )
                  )}
                </p>

                <p className="mt-1 text-[11px] text-[#777777]">
                  Combined values for {rangeLabel.toLowerCase()}
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-[#FFF8F5] px-3 py-2 text-[11px] font-semibold text-[#DD3F1C]">
                <Activity size={15} />
                {rangeLabel}
              </div>
            </div>

            <div className="h-[280px] w-full min-w-0 sm:h-[310px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`${dateRange}-${chartMetric}`}
                  data={activeChartData}
                  margin={{
                    top: 16,
                    right: 8,
                    left: -5,
                    bottom: 0,
                  }}
                  barCategoryGap="34%"
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#EEEEEE"
                    strokeDasharray="4 5"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#555555", fontSize: 11 }}
                    dy={12}
                    interval={dateRange === "quarter" ? 1 : 0}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#555555", fontSize: 11, fontWeight: 600 }}
                    tickFormatter={(value) =>
                      value >= 1000
                        ? `${(value / 1000).toFixed(1)}k`
                        : value
                    }
                    width={45}
                  />

                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={false}
                  />

                  <Bar
                    dataKey={chartMetric}
                    name={activeMetric?.label || "Activity"}
                    fill={COLORS.orange}
                    radius={[8, 8, 2, 2]}
                    maxBarSize={38}
                    isAnimationActive
                    animationBegin={80}
                    animationDuration={1100}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEEEEE] pt-4">
              <p className="text-[11px] font-medium text-[#777777]">
                Selected period: {rangeLabel}
              </p>

              <Link
                to="/admin/analytics"
                className="inline-flex items-center gap-2 text-[12px] font-bold text-[#E94B27] transition-all hover:gap-3"
              >
                Detailed analytics
                <ArrowRight size={15} />
              </Link>
            </div>
          </div>
        </motion.article>

        {/* OPERATIONS OVERVIEW */}

        <motion.article
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="relative min-w-0 rounded-2xl border border-[#EAEAEA] bg-white shadow-sm"
        >
          <SectionHeading
            title="Operations Overview"
            subtitle="Assignment completion and pending workload"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
              <Activity size={18} />
            </span>
          </SectionHeading>

          <div className="p-5 sm:p-6">
            <div className="mb-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[#EEEEEE] bg-white p-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#555555]">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#F4512B]" />
                  Completed
                </div>

                <p className="mt-3 text-[29px] font-bold tracking-[-0.8px] text-[#292929]">
                  103
                </p>

                <p className="mt-1 text-[12px] text-[#777777]">
                  Assignments
                </p>
              </div>

              <div className="rounded-xl border border-[#EEEEEE] bg-white p-4">
                <div className="flex items-center gap-2 text-[12px] font-semibold text-[#555555]">
                  <span className="h-2.5 w-2.5 rounded-sm bg-[#292929]" />
                  Pending
                </div>

                <p className="mt-3 text-[29px] font-bold tracking-[-0.8px] text-[#292929]">
                  38
                </p>

                <p className="mt-1 text-[12px] text-[#777777]">
                  Need follow-up
                </p>
              </div>
            </div>

            <div className="h-[220px] w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  key={`operations-${dateRange}`}
                  data={activeChartData}
                  margin={{
                    top: 12,
                    right: 5,
                    left: 0,
                    bottom: 0,
                  }}
                  barCategoryGap="25%"
                  barGap={5}
                >
                  <CartesianGrid
                    vertical={false}
                    stroke="#EEEEEE"
                    strokeDasharray="4 5"
                  />

                  <XAxis
                    dataKey="label"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#555555", fontSize: 10 }}
                    dy={10}
                    interval={dateRange === "quarter" ? 2 : 0}
                  />

                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#444444", fontSize: 12, fontWeight: 700 }}
                    width={42}
                  />

                  <Tooltip
                    content={<ChartTooltip />}
                    cursor={false}
                  />

                  <Bar
                    dataKey="completed"
                    name="Completed"
                    fill={COLORS.orange}
                    radius={[6, 6, 1, 1]}
                    maxBarSize={20}
                    isAnimationActive
                    animationBegin={100}
                    animationDuration={1050}
                    animationEasing="ease-out"
                  />

                  <Bar
                    dataKey="pending"
                    name="Pending"
                    fill="#292929"
                    radius={[6, 6, 1, 1]}
                    maxBarSize={20}
                    isAnimationActive
                    animationBegin={180}
                    animationDuration={1050}
                    animationEasing="ease-out"
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <Link
              to="/admin/assignments"
              className="mt-5 flex items-center justify-between border-t border-[#EEEEEE] pt-4 text-[12px] font-semibold text-[#444444] transition-colors hover:text-[#E94B27]"
            >
              Manage assignments
              <ArrowRight size={15} />
            </Link>
          </div>
        </motion.article>
      </section>

      {/* RECENT TRAINER REQUESTS */}

      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.42, delay: 0.2 }}
        className="relative rounded-2xl border border-[#EAEAEA] bg-white shadow-sm"
      >
        <SectionHeading
          title="Recent Trainer Requests"
          subtitle="Recent college requirements and their current status"
        >
          <Link
            to="/admin/requests"
            className="inline-flex items-center gap-2 text-[12px] font-bold text-[#E94B27] transition-all hover:gap-3"
          >
            View all
            <ArrowRight size={15} />
          </Link>
        </SectionHeading>

        {/* SEARCH AND FILTERS */}

        <div className="relative z-20 flex flex-col gap-3 border-b border-[#EEEEEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div className="relative w-full sm:max-w-[350px]">
            <Search
              size={17}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#777777]"
            />

            <input
              type="search"
              value={tableSearch}
              onChange={(event) => setTableSearch(event.target.value)}
              placeholder="Search requests, colleges, programs..."
              aria-label="Search trainer requests"
              autoComplete="off"
              className="h-[44px] w-full rounded-xl border border-[#EAEAEA] bg-white pl-10 pr-3 text-[13px] font-bold text-[#111111] caret-[#F4512B] outline-none transition-all duration-200 placeholder:font-medium placeholder:text-[#777777] focus:border-[#F4512B] focus:ring-4 focus:ring-orange-100"
              style={{
                WebkitTextFillColor: "#111111",
              }}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <PremiumDropdown
              ariaLabel="Filter requests by status"
              value={statusFilter}
              onChange={setStatusFilter}
              options={statusOptions}
              minWidth={165}
              align="right"
            />

            <motion.button
              type="button"
              onClick={handleExport}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              className="inline-flex h-[44px] items-center gap-2 rounded-xl border border-[#EAEAEA] bg-white px-4 text-[12px] font-semibold text-[#444444] transition-colors hover:border-[#F2B3A3] hover:bg-[#FFF8F5]"
            >
              <Download size={16} />
              Export CSV
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {notice && (
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, height: 0 }}
              className="flex items-center justify-between gap-3 border-b border-[#F7D9CE] bg-[#FFF8F5] px-5 py-3 text-[12px] font-medium text-[#B84B2D]"
              role="status"
            >
              <span>{notice}</span>

              <button
                type="button"
                onClick={() => setNotice("")}
                aria-label="Dismiss message"
                className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-[#FFEDE5]"
              >
                <X size={15} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* REQUEST TABLE */}

        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] border-collapse text-left">
            <thead>
              <tr className="bg-[#FAFAFA]">
                {[
                  "REQUEST ID",
                  "DATE",
                  "COLLEGE",
                  "PROGRAM",
                  "STUDENTS",
                  "STATUS",
                  "ACTION",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap border-b border-[#EAEAEA] px-5 py-4 text-[11px] font-bold tracking-[0.04em] text-[#555555] sm:px-6"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {filteredRequests.map((request, index) => (
                <motion.tr
                  key={request.id}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.22,
                    delay: Math.min(index * 0.035, 0.14),
                  }}
                  className="border-b border-[#F0F0F0] last:border-0 hover:bg-[#FFFAF8]"
                >
                  <td className="whitespace-nowrap px-5 py-5 text-[12px] font-bold text-[#333333] sm:px-6">
                    {request.id}
                  </td>

                  <td className="whitespace-nowrap px-5 py-5 text-[12px] font-medium text-[#555555] sm:px-6">
                    {request.date}
                  </td>

                  <td className="px-5 py-5 sm:px-6">
                    <p className="whitespace-nowrap text-[12px] font-semibold text-[#333333]">
                      {request.college}
                    </p>
                  </td>

                  <td className="whitespace-nowrap px-5 py-5 text-[12px] font-medium text-[#444444] sm:px-6">
                    {request.program}
                  </td>

                  <td className="px-5 py-5 text-[12px] font-bold text-[#333333] sm:px-6">
                    {request.students}
                  </td>

                  <td className="px-5 py-5 sm:px-6">
                    <StatusBadge status={request.status} />
                  </td>

                  <td className="px-5 py-5 sm:px-6">
                    <Link
                      to="/admin/requests"
                      title={`View ${request.id}`}
                      aria-label={`View ${request.id}`}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-xl text-[#555555] transition-colors hover:bg-[#FFF0EA] hover:text-[#E94B27]"
                    >
                      <ArrowRight size={17} />
                    </Link>
                  </td>
                </motion.tr>
              ))}

              {filteredRequests.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-14 text-center">
                    <Search
                      size={27}
                      className="mx-auto mb-3 text-[#C8C8C8]"
                    />

                    <p className="text-[14px] font-semibold text-[#444444]">
                      No matching requests
                    </p>

                    <p className="mt-2 text-[12px] text-[#777777]">
                      Change the search text or selected status.
                    </p>

                    <button
                      type="button"
                      onClick={() => {
                        setTableSearch("");
                        setStatusFilter("all");
                      }}
                      className="mt-4 text-[12px] font-bold text-[#E94B27] hover:underline"
                    >
                      Clear all filters
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="flex flex-col gap-2 border-t border-[#EEEEEE] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p className="text-[12px] font-medium text-[#555555]">
            Showing{" "}
            <span className="font-bold text-[#292929]">
              {filteredRequests.length}
            </span>{" "}
            of {initialRequests.length} sample requests
          </p>

          <Link
            to="/admin/requests"
            className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#E94B27] hover:underline"
          >
            Open request management
            <ArrowRight size={15} />
          </Link>
        </div>
      </motion.section>

      {/* UPCOMING DEMOS AND QUICK ACTIONS */}

      <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-[1.1fr_1fr]">
        {/* UPCOMING DEMOS */}

        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="min-w-0 rounded-2xl border border-[#EAEAEA] bg-white"
        >
          <SectionHeading
            title="Upcoming Demos"
            subtitle="Scheduled trainer demonstrations"
          >
            <Link
              to="/admin/demos"
              className="text-[12px] font-bold text-[#E94B27] hover:underline"
            >
              View schedule
            </Link>
          </SectionHeading>

          <div className="px-5 sm:px-6">
            {demos.map((demo, index) => (
              <motion.div
                key={demo.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.24,
                  delay: 0.28 + index * 0.07,
                }}
                className="flex items-center gap-3 border-b border-[#EFEFEF] py-5 last:border-0"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B]">
                  <CalendarDays size={21} />
                </div>

                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-[#333333]">
                    {demo.trainer}
                  </p>

                  <p className="mt-1.5 truncate text-[12px] text-[#555555]">
                    {demo.college} - {demo.program}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="text-[12px] font-bold text-[#333333]">
                    {demo.time}
                  </p>

                  <span className="mt-1.5 inline-flex items-center gap-1 text-[11px] font-medium text-[#218354]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#28A566]" />
                    Upcoming
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.article>

        {/* QUICK ACTIONS */}

        <motion.article
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="min-w-0 rounded-2xl border border-[#EAEAEA] bg-white"
        >
          <SectionHeading
            title="Quick Actions"
            subtitle="Frequently used management pages"
          />

          <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5">
            {[
              {
                title: "Manage Students",
                description: "Accounts and enrollment",
                icon: GraduationCap,
                path: "/admin/students",
              },
              {
                title: "Review Requests",
                description: "College requirements",
                icon: UserRoundCheck,
                path: "/admin/requests",
              },
              {
                title: "Manage Trainers",
                description: "Profiles and assignments",
                icon: Users,
                path: "/admin/trainers",
              },
              {
                title: "Platform Reports",
                description: "Analytics and performance",
                icon: FileSpreadsheet,
                path: "/admin/analytics",
              },
              {
                title: "College Partners",
                description: "Institutions and accounts",
                icon: Building2,
                path: "/admin/colleges",
              },
              {
                title: "Notifications",
                description: "Announcements and updates",
                icon: Bell,
                path: "/admin/notifications",
              },
            ].map((action, index) => {
              const Icon = action.icon;

              return (
                <motion.div
                  key={action.title}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.25,
                    delay: 0.34 + index * 0.04,
                  }}
                >
                  <Link
                    to={action.path}
                    className="group flex h-full items-center gap-3 rounded-xl border border-[#ECECEC] p-4 transition-colors duration-200 hover:border-[#F1B8A8] hover:bg-[#FFFAF8]"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#FFF0EA] text-[#F4512B] transition-colors duration-200 group-hover:bg-[#F4512B] group-hover:text-white">
                      <Icon size={20} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[12px] font-bold text-[#333333]">
                        {action.title}
                      </p>

                      <p className="mt-1.5 text-[11px] leading-4 text-[#555555]">
                        {action.description}
                      </p>
                    </div>

                    <ArrowRight
                      size={16}
                      className="shrink-0 text-[#888888] transition-transform duration-200 group-hover:translate-x-1 group-hover:text-[#F4512B]"
                    />
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </motion.article>
      </section>

      {/* BOTTOM STATUS */}

      <motion.section
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.35 }}
        className="flex flex-col gap-3 rounded-2xl border border-[#EAEAEA] bg-white px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#EAF7EE] text-[#228653]">
            <BadgeCheck size={21} />
          </span>

          <div>
            <p className="text-[13px] font-bold text-[#333333]">
              Platform operations
            </p>

            <p className="mt-1 text-[12px] leading-5 text-[#555555]">
              Review pending requests and monitor upcoming demos.
            </p>
          </div>
        </div>

        <Link
          to="/admin/analytics"
          className="inline-flex items-center gap-2 self-start rounded-xl px-3 py-2 text-[12px] font-bold text-[#E94B27] transition-colors hover:bg-[#FFF0EA] sm:self-auto"
        >
          View platform reports
          <ArrowRight size={15} />
        </Link>
      </motion.section>
    </div>
  );
}