import { useState } from "react";
import { motion } from "motion/react";

import {
  CheckCircle2,
  Pencil,
  Save,
  UserRound,
} from "lucide-react";

import { studentProfile } from "../../data/student/studentData";

export default function StudentProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profile, setProfile] =
    useState(studentProfile);

  const updateField = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const save = () => {
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  return (
    <div className="space-y-7">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

        <div>
          <h2 className="text-2xl font-bold">
            My Profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your student information.
          </p>
        </div>

        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-50 px-5 py-3 text-sm font-semibold text-violet-700"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={save}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white"
          >
            <Save size={16} />
            Save Changes
          </button>
        )}

      </div>


      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"
        >
          <CheckCircle2 size={17} />
          Profile updated successfully.
        </motion.div>
      )}


      <div className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">

        <aside className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
            <UserRound size={32} />
          </div>

          <h3 className="mt-5 text-xl font-bold">
            {profile.name}
          </h3>

          <p className="mt-1 text-sm text-violet-600">
            {profile.branch}
          </p>

          <div className="mt-6 space-y-3 text-sm text-slate-500">
            <p>
              Student ID: {profile.id}
            </p>

            <p>
              College: {profile.college}
            </p>

            <p>
              {profile.semester}
            </p>
          </div>

        </aside>


        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="font-bold">
            Student Information
          </h3>


          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {[
              ["name", "Full Name"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["college", "College"],
              ["branch", "Branch"],
              ["semester", "Semester"],
              ["enrollment", "Enrollment Number"],
            ].map(([field, label]) => (
              <label key={field}>

                <span className="text-xs font-medium text-slate-500">
                  {label}
                </span>

                <input
                  value={profile[field]}
                  disabled={!editing}
                  onChange={(event) =>
                    updateField(
                      field,
                      event.target.value
                    )
                  }
                  className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none ${
                    editing
                      ? "border-violet-300 bg-white focus:border-violet-500"
                      : "border-slate-200 bg-slate-50 text-slate-500"
                  }`}
                />

              </label>
            ))}

          </div>

        </section>

      </div>

    </div>
  );
}
