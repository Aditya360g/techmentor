
import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Sparkles,
  TrendingUp,
  Users,
  Video,
  Wallet,
  ClipboardCheck,
} from "lucide-react";

const stats = [
  {
    title: "Total Courses",
    value: 8,
    change: "+12.5%",
    note: "2 courses added recently",
    icon: BookOpen,
    tone: "blue",
    trend: [35, 48, 42, 62, 54, 76, 88],
  },
  {
    title: "Total Students",
    value: 248,
    change: "+18.2%",
    note: "Across all your courses",
    icon: Users,
    tone: "emerald",
    trend: [30, 42, 38, 55, 65, 72, 92],
  },
  {
    title: "Live Classes",
    value: 12,
    change: "+8.4%",
    note: "Scheduled this month",
    icon: Video,
    tone: "rose",
    trend: [45, 35, 55, 48, 70, 62, 85],
  },
  {
    title: "Total Earnings",
    value: 24500,
    currency: true,
    change: "+10.6%",
    note: "Current month earnings",
    icon: Wallet,
    tone: "amber",
    trend: [28, 45, 40, 60, 52, 78, 94],
  },
];

const earningsData = [
  { month: "May", value: 12500 },
  { month: "Jun", value: 16800 },
  { month: "Jul", value: 14200 },
  { month: "Aug", value: 19800 },
  { month: "Sep", value: 22100 },
  { month: "Oct", value: 24500 },
];

const teachingData = [
  { month: "May", value: 12 },
  { month: "Jun", value: 18 },
  { month: "Jul", value: 15 },
  { month: "Aug", value: 23 },
  { month: "Sep", value: 20 },
  { month: "Oct", value: 28 },
];

const courses = [
  {
    name: "React Fundamentals",
    category: "Web Development",
    students: 86,
    completion: 78,
    color: "emerald",
    initials: "RE",
  },
  {
    name: "JavaScript Advanced",
    category: "Programming",
    students: 64,
    completion: 64,
    color: "rose",
    initials: "JS",
  },
  {
    name: "Frontend Project Lab",
    category: "Practical Training",
    students: 52,
    completion: 86,
    color: "blue",
    initials: "FE",
  },
];

const upcomingClasses = [
  {
    name: "React Fundamentals",
    date: "Today",
    time: "3:00 PM – 4:00 PM",
    students: 42,
    type: "Live session",
    color: "emerald",
  },
  {
    name: "JavaScript Advanced",
    date: "Tomorrow",
    time: "11:00 AM – 12:00 PM",
    students: 36,
    type: "Workshop",
    color: "violet",
  },
  {
    name: "Frontend Project Review",
    date: "22 Oct",
    time: "2:00 PM – 3:00 PM",
    students: 18,
    type: "Project review",
    color: "blue",
  },
];

const shortcuts = [
  {
    label: "Manage Courses",
    description: "Update course content",
    href: "/trainer/courses",
    icon: BookOpen,
    tone: "emerald",
  },
  {
    label: "Live Classes",
    description: "Manage teaching sessions",
    href: "/trainer/live-classes",
    icon: Video,
    tone: "violet",
  },
  {
    label: "Student Progress",
    description: "Review student activity",
    href: "/trainer/student-progress",
    icon: Users,
    tone: "blue",
  },
  {
    label: "Assignments",
    description: "Review submissions",
    href: "/trainer/assignments",
    icon: ClipboardCheck,
    tone: "amber",
  },
];


const toneStyles = {
  blue: {
    icon: "bg-blue-100 text-blue-800 ring-blue-200",
    bar: "bg-blue-600",
    text: "text-blue-800",
    avatar: "bg-blue-100 text-blue-900",
    chart: "from-blue-700 to-blue-500",
  },

  emerald: {
    icon: "bg-emerald-100 text-emerald-800 ring-emerald-200",
    bar: "bg-emerald-600",
    text: "text-emerald-800",
    avatar: "bg-emerald-100 text-emerald-900",
    chart: "from-emerald-700 to-emerald-500",
  },

  violet: {
    icon: "bg-violet-100 text-violet-800 ring-violet-200",
    bar: "bg-violet-600",
    text: "text-violet-800",
    avatar: "bg-violet-100 text-violet-900",
    chart: "from-violet-700 to-violet-500",
  },

  rose: {
    icon: "bg-rose-100 text-rose-800 ring-rose-200",
    bar: "bg-rose-600",
    text: "text-rose-800",
    avatar: "bg-rose-100 text-rose-900",
    chart: "from-rose-700 to-rose-500",
  },

  amber: {
    icon: "bg-amber-100 text-amber-900 ring-amber-200",
    bar: "bg-amber-600",
    text: "text-amber-800",
    avatar: "bg-amber-100 text-amber-900",
    chart: "from-amber-700 to-amber-500",
  },
};


function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let frame;
    let startTime;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;

      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 4);

      setValue(Math.round(target * eased));

      if (progress < 1) {
        frame = requestAnimationFrame(animate);
      }
    };

    frame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function formatNumber(value, currency = false) {
  return currency
    ? `₹${value.toLocaleString("en-IN")}`
    : value.toLocaleString("en-IN");
}

function SectionHeading({ eyebrow, title, description, action }) {
  return (
    <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
      <div>
        {eyebrow && (
          <p className="mb-1.5 text-[10px] font-extrabold uppercase tracking-[0.18em] text-emerald-800">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-extrabold tracking-tight text-slate-950 sm:text-xl">
          {title}
        </h2>
        {description && (
          <p className="mt-1.5 text-sm leading-6 text-slate-600">
            {description}
          </p>
        )}
      </div>
      {action}
    </div>
  );
}

function StatCard({ item, index }) {
  const count = useCountUp(item.value);
  const Icon = item.icon;
  const tone = toneStyles[item.tone];

  return (
    <article
      className="dashboard-enter group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_4px_16px_-8px_rgba(15,23,42,0.22)] transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-[0_16px_32px_-18px_rgba(5,150,105,0.4)]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="relative flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-bold text-slate-600">{item.title}</p>
          <p className="mt-3 text-[28px] font-extrabold leading-none tracking-tight text-slate-950 sm:text-[30px]">
            {formatNumber(count, item.currency)}
          </p>
        </div>

        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-transform duration-300 group-hover:scale-105 ${tone.icon}`}
        >
          <Icon size={21} strokeWidth={2} />
        </span>
      </div>

      <div className="relative mt-5 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[10px] font-extrabold text-emerald-800">
          <ArrowUpRight size={12} />
          {item.change}
        </span>

        <div
          className="flex h-9 items-end gap-1"
          aria-label={`${item.title} trend`}
        >
          {item.trend.map((height, i) => (
            <span
              key={i}
              className={`w-2 rounded-t-sm ${tone.bar} transition-all duration-300 group-hover:brightness-110`}
              style={{ height: `${height * 0.3}px` }}
            />
          ))}
        </div>
      </div>

      <p className="mt-2 text-[11px] font-medium text-slate-500">
        {item.note}
      </p>
    </article>
  );
}

function EarningsChart({ data }) {
  const [period, setPeriod] = useState("6 months");
  const visibleData = period === "3 months" ? data.slice(-3) : data;
  const maxValue = Math.max(...visibleData.map((item) => item.value));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-800">
            <Wallet size={19} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-950">
              Earnings overview
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Your monthly earnings trend
            </p>
          </div>
        </div>

        <div className="flex rounded-xl border border-slate-200 bg-slate-100 p-1">
          {["3 months", "6 months"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setPeriod(option)}
              className={`rounded-lg px-2.5 py-1.5 text-[10px] font-bold transition-all sm:text-[11px] ${period === option
                ? "bg-white text-emerald-900 shadow-sm ring-1 ring-slate-200"
                : "text-slate-600 hover:text-slate-950"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-slate-600">Total earnings</p>
          <p className="mt-1 text-2xl font-extrabold tracking-tight text-slate-950">
            ₹24,500
          </p>
        </div>
        <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-extrabold text-emerald-800">
          <TrendingUp size={13} />
          10.6%
        </span>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-3 border-b border-slate-200 pb-3 sm:grid-cols-6">
        {visibleData.map((item, index) => {
          const height = Math.max((item.value / maxValue) * 100, 12);

          return (
            <div key={item.month} className="group flex min-w-0 flex-col items-center">
              <div className="flex h-[145px] w-full items-end justify-center rounded-xl bg-slate-100 px-2 pt-3 transition-colors group-hover:bg-emerald-50 sm:h-[175px]">
                <div
                  className={`relative w-full max-w-[38px] rounded-t-lg bg-gradient-to-t from-emerald-800 to-emerald-500 transition-all duration-700 ease-out group-hover:brightness-110 ${index === visibleData.length - 1
                    ? "shadow-[0_0_14px_-4px_rgba(5,150,105,0.65)]"
                    : ""
                    }`}
                  style={{ height: `${height}%` }}
                  title={`${item.month}: ${formatNumber(item.value, true)}`}
                >
                  <span className="absolute -top-7 left-1/2 hidden -translate-x-1/2 whitespace-nowrap rounded-md bg-slate-950 px-2 py-1 text-[10px] font-bold text-white shadow-lg group-hover:block">
                    {formatNumber(item.value, true)}
                  </span>
                </div>
              </div>
              <span className="mt-2 text-xs font-bold text-slate-600">
                {item.month}
              </span>
            </div>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-xs font-semibold text-slate-600">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-700" />
          Monthly earnings
        </span>
        <Link
          to="/trainer/payments"
          className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-800 transition-colors hover:text-emerald-950"
        >
          View payments <ArrowRight size={14} />
        </Link>
      </div>
    </section>
  );
}

function TeachingActivityChart() {
  const maxValue = Math.max(...teachingData.map((item) => item.value));

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow duration-300 hover:shadow-md sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-100 text-violet-800">
            <Activity size={19} />
          </span>
          <div>
            <h3 className="text-sm font-extrabold text-slate-950">
              Teaching activity
            </h3>
            <p className="mt-1 text-xs text-slate-600">
              Classes delivered each month
            </p>
          </div>
        </div>

        <span className="rounded-full border border-violet-200 bg-violet-50 px-2.5 py-1.5 text-[10px] font-extrabold text-violet-800">
          Last 6 months
        </span>
      </div>

      <div className="mt-7 space-y-5">
        {teachingData.map((item) => (
          <div key={item.month} className="group">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600">
                {item.month}
              </span>
              <span className="text-xs font-extrabold text-slate-900">
                {item.value} classes
              </span>
            </div>

            <div className="h-3 overflow-hidden rounded-full border border-slate-200 bg-slate-100">
              <div
                className="h-full rounded-full bg-gradient-to-r from-violet-800 to-violet-500 transition-all duration-700 ease-out group-hover:brightness-110"
                style={{ width: `${(item.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 flex items-start gap-3 rounded-xl border border-violet-200 bg-violet-50 p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-violet-800 shadow-sm">
          <Sparkles size={17} />
        </span>
        <div>
          <p className="text-sm font-extrabold text-slate-950">
            Keep up the momentum
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-700">
            Consistent classes help students maintain their learning progress.
          </p>
        </div>
      </div>
    </section>
  );
}

function CoursePerformance() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        eyebrow="Learning outcomes"
        title="Course performance"
        description="Student progress across your courses."
        action={
          <Link
            to="/trainer/courses"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-emerald-800 hover:text-emerald-950"
          >
            All courses <ChevronRight size={15} />
          </Link>
        }
      />

      <div className="space-y-3">
        {courses.map((course, index) => {
          const tone = toneStyles[course.color];

          return (
            <div
              key={course.name}
              className="group rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/30"
            >
              <div className="flex items-start gap-3">
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-xs font-extrabold ${tone.avatar}`}
                >
                  {course.initials}
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="text-sm font-extrabold text-slate-950">
                        {course.name}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-slate-600">
                        {course.category}
                      </p>
                    </div>

                    <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-700">
                      <Users size={13} className="text-slate-500" />
                      {course.students} students
                    </span>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-slate-600">
                      Completion
                    </span>
                    <span className={`text-sm font-extrabold ${tone.text}`}>
                      {course.completion}%
                    </span>
                  </div>

                  <div
                    className="mt-2 h-3 w-full overflow-hidden rounded-full border border-slate-200 bg-slate-100"
                    role="progressbar"
                    aria-label={`${course.name} completion`}
                    aria-valuenow={course.completion}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  >
                    <div
                      className={`h-full rounded-full ${tone.bar} transition-[width] duration-1000 ease-out`}
                      style={{
                        width: `${course.completion}%`,
                        transitionDelay: `${index * 120}ms`,
                        minWidth: "6px",
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function UpcomingClasses() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        eyebrow="Your calendar"
        title="Upcoming classes"
        description="Your next scheduled teaching sessions."
        action={
          <Link
            to="/trainer/schedule"
            className="inline-flex shrink-0 items-center gap-1 text-xs font-extrabold text-emerald-800 hover:text-emerald-950"
          >
            Full schedule <ArrowRight size={14} />
          </Link>
        }
      />

      <div className="space-y-3">
        {upcomingClasses.map((item) => {
          const tone = toneStyles[item.color];

          return (
            <div
              key={item.name}
              className="group flex flex-col gap-3 rounded-xl border border-slate-200 p-4 transition-all duration-200 hover:border-emerald-300 hover:bg-emerald-50/30 sm:flex-row sm:items-center"
            >
              <span
                className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${tone.icon}`}
              >
                <CalendarDays size={19} />
              </span>

              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-sm font-extrabold text-slate-950">
                    {item.name}
                  </h3>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[10px] font-extrabold ${tone.icon}`}
                  >
                    {item.type}
                  </span>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs font-medium text-slate-600">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 size={13} />
                    {item.date} · {item.time}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={13} />
                    {item.students} students enrolled
                  </span>
                </div>
              </div>

              <Link
                to="/trainer/live-classes"
                aria-label={`Open ${item.name}`}
                className="flex h-9 w-9 shrink-0 items-center justify-center self-end rounded-xl border border-slate-200 bg-white text-slate-600 transition-all hover:border-emerald-700 hover:bg-emerald-700 hover:text-white sm:self-center"
              >
                <ChevronRight size={17} />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function QuickActions() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <SectionHeading
        eyebrow="Work smarter"
        title="Quick actions"
        description="Jump straight into your most-used tools."
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {shortcuts.map((item, index) => {
          const Icon = item.icon;
          const tone = toneStyles[item.tone];

          return (
            <Link
              key={item.label}
              to={item.href}
              className="group rounded-xl border border-slate-200 bg-white p-4 transition-all duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:shadow-lg hover:shadow-emerald-950/5"
              style={{ animationDelay: `${index * 70}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                <span
                  className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${tone.icon}`}
                >
                  <Icon size={19} />
                </span>
                <ArrowUpRight
                  size={17}
                  className="text-slate-400 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-800"
                />
              </div>

              <h3 className="mt-4 text-sm font-extrabold text-slate-950">
                {item.label}
              </h3>
              <p className="mt-1 text-xs leading-5 text-slate-600">
                {item.description}
              </p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

export default function TrainerDashboardPage() {
  return (
    <div className="trainer-dashboard mx-auto w-full max-w-[1500px] space-y-7 pb-8">
      <style>{`
        .dashboard-enter {
          animation: dashboard-enter 500ms cubic-bezier(0.2, 0.75, 0.25, 1) both;
        }

        @keyframes dashboard-enter {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dashboard-enter {
            animation: none !important;
          }
        }
      `}</style>

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-100 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.14em] text-emerald-900">
            <Sparkles size={13} />
            Trainer Overview
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
            Dashboard
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Here’s an overview of your courses, students, classes and earnings.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/trainer/schedule"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-xs font-extrabold text-slate-800 shadow-sm transition-all hover:border-emerald-400 hover:bg-emerald-50"
          >
            <CalendarDays size={16} />
            My Schedule
          </Link>

          <Link
            to="/trainer/courses"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-xl bg-emerald-800 px-4 text-xs font-extrabold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-emerald-900 hover:shadow-md"
          >
            <BookOpen size={16} />
            View Courses
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Your performance"
          title="At a glance"
          description="A quick summary of your training activity."
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((item, index) => (
            <StatCard key={item.title} item={item} index={index} />
          ))}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Analytics"
          title="Performance analytics"
          description="Track your monthly earnings and teaching activity."
        />

        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          <EarningsChart data={earningsData} />
          <TeachingActivityChart />
        </div>
      </section>

      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-2">
        <CoursePerformance />
        <UpcomingClasses />
      </section>

      <QuickActions />

      <div className="flex items-center gap-2 border-t border-slate-300 pt-4 text-xs font-semibold text-slate-500">
        <CheckCircle2 size={15} className="text-emerald-700" />
        Your trainer workspace at a glance
      </div>
    </div>
  );
}

