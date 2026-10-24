import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Search,
  Users,
  GraduationCap,
  Star,
  MapPin,
  BriefcaseBusiness,
  BookOpen,
  Mail,
  Phone,
  Eye,
  X,
  CalendarDays,
  SlidersHorizontal,
  RotateCcw,

  ChevronDown,} from "lucide-react";

const trainers = [
  {
    id: "TRN-001",
    name: "Aman Sharma",
    email: "aman.sharma@example.edu",
    phone: "+91 98765 20001",
    department: "Computer Science",
    designation: "Senior Java Developer & Trainer",
    specialization: "Java + DSA",
    skills: ["Java", "DSA", "Spring Boot"],
    courses: ["Java Development", "Data Structures & Algorithms"],
    experience: 6,
    rating: 4.9,
    students: 186,
    city: "Delhi NCR",
    availability: "Available",
  },
  {
    id: "TRN-002",
    name: "Priya Verma",
    email: "priya.verma@example.edu",
    phone: "+91 98765 20002",
    department: "Data Science",
    designation: "AI & Machine Learning Trainer",
    specialization: "Python / AI",
    skills: ["Python", "Machine Learning", "Pandas"],
    courses: ["Python for Data Science", "Machine Learning"],
    experience: 5,
    rating: 4.8,
    students: 154,
    city: "Noida",
    availability: "Available",
  },
  {
    id: "TRN-003",
    name: "Rahul Mehta",
    email: "rahul.mehta@example.edu",
    phone: "+91 98765 20003",
    department: "Information Technology",
    designation: "Full Stack Development Trainer",
    specialization: "Full Stack",
    skills: ["React", "Node.js", "SQL"],
    courses: ["Full Stack Development", "React Development"],
    experience: 7,
    rating: 4.9,
    students: 192,
    city: "Gurugram",
    availability: "Busy",
  },
  {
    id: "TRN-004",
    name: "Neha Singh",
    email: "neha.singh@example.edu",
    phone: "+91 98765 20004",
    department: "Data Science",
    designation: "Python & Data Analytics Trainer",
    specialization: "Python Development",
    skills: ["Python", "SQL", "Data Analysis"],
    courses: ["Python for Data Science", "Database Management"],
    experience: 4,
    rating: 4.7,
    students: 118,
    city: "Jaipur",
    availability: "Available",
  },
  {
    id: "TRN-005",
    name: "Arjun Kumar",
    email: "arjun.kumar@example.edu",
    phone: "+91 98765 20005",
    department: "Information Technology",
    designation: "Cloud & DevOps Trainer",
    specialization: "Cloud / DevOps",
    skills: ["Docker", "AWS", "Linux"],
    courses: ["Cloud Computing", "DevOps Engineering"],
    experience: 8,
    rating: 4.8,
    students: 162,
    city: "Delhi NCR",
    availability: "Limited",
  },
  {
    id: "TRN-006",
    name: "Meera Joshi",
    email: "meera.joshi@example.edu",
    phone: "+91 98765 20006",
    department: "Computer Science",
    designation: "Frontend Development Trainer",
    specialization: "Frontend Development",
    skills: ["React", "JavaScript", "CSS"],
    courses: ["React Development", "Frontend Development"],
    experience: 5,
    rating: 4.7,
    students: 126,
    city: "Jodhpur",
    availability: "Available",
  },
];

const departments = [
  "All Departments",
  ...new Set(trainers.map((trainer) => trainer.department)),
];

function initials(name) {
  return name
    .split(" ")
    .map((word) => word[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function statusClass(status) {
  if (status === "Available") {
    return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
  }

  if (status === "Busy") {
    return "border-amber-400/20 bg-amber-400/10 text-amber-300";
  }

  return "border-sky-400/20 bg-sky-400/10 text-sky-300";
}

export default function CollegeTrainersPage() {
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("All Departments");
  const [availability, setAvailability] = useState("All");
  const [selectedTrainer, setSelectedTrainer] = useState(null);

  const filteredTrainers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return trainers.filter((trainer) => {
      const searchable = [
        trainer.name,
        trainer.id,
        trainer.email,
        trainer.department,
        trainer.designation,
        trainer.specialization,
        trainer.city,
        ...trainer.skills,
        ...trainer.courses,
      ].join(" ").toLowerCase();

      return (
        (!query || searchable.includes(query)) &&
        (department === "All Departments" ||
          trainer.department === department) &&
        (availability === "All" ||
          trainer.availability === availability)
      );
    });
  }, [search, department, availability]);

  function resetFilters() {
    setSearch("");
    setDepartment("All Departments");
    setAvailability("All");
  }

  return (
    <main className="min-h-full w-full min-w-0 overflow-x-clip bg-[#0b1424] text-slate-100">
      <div className="mx-auto w-full max-w-[1600px] space-y-6 px-4 py-5 sm:px-6 sm:py-7 xl:px-8">
        <header>
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-sky-200">
            <GraduationCap size={13} />
            College portal
          </div>

          <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
            Find Trainers
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Explore professional trainers, compare expertise and find the right
            faculty for your institution.
          </p>
        </header>

        <section className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            {
              label: "Total trainers",
              value: trainers.length,
              icon: GraduationCap,
              color: "text-sky-300",
            },
            {
              label: "Available now",
              value: trainers.filter((t) => t.availability === "Available").length,
              icon: CalendarDays,
              color: "text-emerald-300",
            },
            {
              label: "Students taught",
              value: trainers.reduce((sum, t) => sum + t.students, 0),
              icon: Users,
              color: "text-violet-300",
            },
          ].map((stat) => {
            const Icon = stat.icon;

            return (
              <article
                key={stat.label}
                className="flex items-center justify-between gap-3 rounded-2xl border border-white/[0.08] bg-[#111c2d] p-4 sm:p-5"
              >
                <div>
                  <p className="text-xs text-slate-400">{stat.label}</p>
                  <p className="mt-2 text-2xl font-extrabold text-white">
                    {stat.value.toLocaleString("en-IN")}
                  </p>
                </div>

                <span className={`flex h-11 w-11 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] ${stat.color}`}>
                  <Icon size={20} />
                </span>
              </article>
            );
          })}
        </section>

        <section className="rounded-2xl border border-white/[0.08] bg-[#111c2d] p-4 sm:p-5">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_240px_200px_auto]">
            <div className="relative min-w-0">
              <Search
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
              />

              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search name, skills, course or email..."
                aria-label="Search trainers"
                className="min-h-[45px] w-full rounded-xl border border-white/[0.09] bg-[#091322] py-3 pl-10 pr-3 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-sky-400/40"
              />
            </div>

            <label className="relative block min-w-0">
              <span className="sr-only">Department</span>
              <select
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                className="min-h-[45px] w-full appearance-none rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 pr-9 text-xs text-slate-200 outline-none focus:border-sky-400/40"
              >
                {departments.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </label>

            <label className="relative block min-w-0">
              <span className="sr-only">Availability</span>
              <select
                value={availability}
                onChange={(event) => setAvailability(event.target.value)}
                className="min-h-[45px] w-full appearance-none rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 pr-9 text-xs text-slate-200 outline-none focus:border-sky-400/40"
              >
                {["All", "Available", "Busy", "Limited"].map((item) => (
                  <option key={item} value={item}>
                    {item === "All" ? "All Availability" : item}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
              />
            </label>

            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex min-h-[45px] items-center justify-center gap-2 rounded-xl border border-white/[0.09] px-4 text-xs font-semibold text-slate-300 transition hover:border-sky-400/25 hover:text-white"
            >
              <RotateCcw size={14} />
              Reset
            </button>
          </div>

          <p className="mt-4 text-[11px] text-slate-500">
            Showing <span className="font-semibold text-slate-300">{filteredTrainers.length}</span> trainers
          </p>
        </section>

        <section>
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-white">
                Trainer directory
              </h2>
              <p className="mt-1 text-xs text-slate-500">
                Profiles, specializations and availability
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 text-[10px] text-slate-500">
              <SlidersHorizontal size={12} />
              Searchable directory
            </span>
          </div>

          {filteredTrainers.length ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 2xl:grid-cols-3">
              <AnimatePresence mode="popLayout">
                {filteredTrainers.map((trainer, index) => (
                  <motion.article
                    key={trainer.id}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ delay: index * 0.025 }}
                    className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111c2d] p-4 transition-colors hover:border-sky-400/25 sm:p-5"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-blue-500 text-sm font-extrabold text-[#07111f]">
                        {initials(trainer.name)}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-white">
                          {trainer.name}
                        </p>
                        <p className="mt-1 line-clamp-2 text-[11px] leading-5 text-slate-400">
                          {trainer.designation}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-500">
                          {trainer.id}
                        </p>
                      </div>

                      <span className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-semibold ${statusClass(trainer.availability)}`}>
                        {trainer.availability}
                      </span>
                    </div>

                    <div className="mt-5 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3">
                      <p className="text-[10px] uppercase tracking-[0.12em] text-slate-500">
                        Specialization
                      </p>
                      <p className="mt-1.5 text-sm font-bold text-sky-200">
                        {trainer.specialization}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {trainer.skills.map((skill) => (
                          <span
                            key={skill}
                            className="rounded-lg border border-white/[0.07] bg-white/[0.025] px-2 py-1.5 text-[10px] text-slate-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-[10px] text-slate-500">Experience</p>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-200">
                          <BriefcaseBusiness size={13} className="text-sky-300" />
                          {trainer.experience} years
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500">Rating</p>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-200">
                          <Star size={13} className="fill-amber-400 text-amber-400" />
                          {trainer.rating.toFixed(1)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500">Students</p>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-200">
                          <Users size={13} className="text-sky-300" />
                          {trainer.students}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] text-slate-500">Location</p>
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-200">
                          <MapPin size={13} className="text-sky-300" />
                          {trainer.city}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setSelectedTrainer(trainer)}
                      className="mt-5 inline-flex min-h-[42px] w-full items-center justify-center gap-2 rounded-xl border border-sky-400/20 bg-sky-400/[0.05] px-3 text-xs font-semibold text-sky-200 transition hover:bg-sky-400/[0.1]"
                    >
                      <Eye size={14} />
                      View full profile
                    </button>
                  </motion.article>
                ))}
              </AnimatePresence>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.12] px-5 py-14 text-center">
              <Search size={25} className="mx-auto text-slate-500" />
              <h3 className="mt-3 text-sm font-bold text-white">
                No trainers found
              </h3>
              <p className="mt-2 text-xs text-slate-500">
                Try changing your search or filters.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="mt-4 rounded-xl border border-white/[0.09] px-4 py-2.5 text-xs text-slate-200"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <footer className="border-t border-white/[0.07] pt-5 text-[10px] text-slate-500">
          College trainer directory · Demo data
        </footer>
      </div>

      <AnimatePresence>
        {selectedTrainer && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-[#020712]/85 p-4 backdrop-blur-md"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setSelectedTrainer(null);
              }
            }}
          >
            <motion.section
              initial={{ opacity: 0, y: 15, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10 }}
              role="dialog"
              aria-modal="true"
              aria-label="Trainer profile"
              className="my-auto max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-sky-400/20 bg-[#0d1829] p-5 shadow-2xl sm:p-6"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-300 to-blue-500 font-extrabold text-[#07111f]">
                    {initials(selectedTrainer.name)}
                  </div>
                  <div className="min-w-0">
                    <h2 className="text-lg font-bold text-white">
                      {selectedTrainer.name}
                    </h2>
                    <p className="mt-1 text-xs text-slate-400">
                      {selectedTrainer.designation}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedTrainer(null)}
                  aria-label="Close profile"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 hover:text-white"
                >
                  <X size={17} />
                </button>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  ["Trainer ID", selectedTrainer.id],
                  ["Department", selectedTrainer.department],
                  ["Specialization", selectedTrainer.specialization],
                  ["Experience", `${selectedTrainer.experience} years`],
                  ["Rating", `${selectedTrainer.rating.toFixed(1)} / 5`],
                  ["Students taught", selectedTrainer.students],
                  ["Location", selectedTrainer.city],
                  ["Availability", selectedTrainer.availability],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="min-w-0 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5"
                  >
                    <p className="text-[10px] text-slate-500">{label}</p>
                    <p className="mt-1.5 break-words text-xs font-semibold text-slate-200">
                      {value}
                    </p>
                  </div>
                ))}
              </div>

              <section className="mt-5">
                <h3 className="text-xs font-bold text-sky-200">
                  Assigned courses
                </h3>
                <div className="mt-3 space-y-2">
                  {selectedTrainer.courses.map((course) => (
                    <div
                      key={course}
                      className="flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.02] p-3 text-xs text-slate-300"
                    >
                      <BookOpen size={15} className="shrink-0 text-sky-300" />
                      {course}
                    </div>
                  ))}
                </div>
              </section>

              <section className="mt-5 space-y-3">
                <a
                  href={`mailto:${selectedTrainer.email}`}
                  className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] p-3 text-xs text-slate-300 hover:border-sky-400/25"
                >
                  <Mail size={15} className="shrink-0 text-sky-300" />
                  <span className="truncate">{selectedTrainer.email}</span>
                </a>
                <a
                  href={`tel:${selectedTrainer.phone.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-xl border border-white/[0.07] p-3 text-xs text-slate-300 hover:border-sky-400/25"
                >
                  <Phone size={15} className="shrink-0 text-sky-300" />
                  {selectedTrainer.phone}
                </a>
              </section>

              <div className="mt-6 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedTrainer(null)}
                  className="rounded-xl bg-sky-400 px-5 py-2.5 text-xs font-bold text-[#07111f] hover:bg-sky-300"
                >
                  Close profile
                </button>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

