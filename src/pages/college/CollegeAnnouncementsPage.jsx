import { motion } from "motion/react";
import { Construction } from "lucide-react";

export default function CollegeAnnouncementsPage() {
  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="min-h-full p-6 md:p-8"
    >
      <div className="mb-8">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
          TechMentor · College Portal
        </p>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 md:text-3xl">
          College Announcements
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Manage your institution's College Announcements and related activities.
        </p>
      </div>

      <section className="flex min-h-56 flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-sky-50 text-sky-600">
          <Construction size={26} />
        </div>
        <h2 className="text-lg font-semibold text-slate-800">
          Workspace ready to build
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          This page is connected to the College Portal. Its detailed interface can be added next.
        </p>
      </section>
    </motion.main>
  );
}
