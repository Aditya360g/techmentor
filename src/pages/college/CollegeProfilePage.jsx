import { useState } from "react";
import { motion } from "motion/react";

import {
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Users,
} from "lucide-react";

const initialProfile = {
  name: "RKGIT",
  type: "Engineering College",
  city: "Ghaziabad",
  state: "Uttar Pradesh",
  contactPerson: "Dr. Amit Sharma",
  designation: "HOD - Computer Science",
  email: "cs@college.example",
  phone: "+91 98765 43210",
  students: "640",
  website: "https://college.example",
};

export default function CollegeProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState(initialProfile);

  const updateField = (field, value) => {
    setProfile((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const saveProfile = () => {
    setEditing(false);
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 2200);
  };

  const fields = [
    ["name", "College Name"],
    ["type", "Institution Type"],
    ["city", "City"],
    ["state", "State"],
    ["contactPerson", "Contact Person"],
    ["designation", "Designation"],
    ["email", "Email"],
    ["phone", "Phone"],
    ["students", "Total CS/IT Students"],
    ["website", "Website"],
  ];

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h2 className="text-2xl font-bold">
            College Profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage institutional information and contact details.
          </p>
        </div>

        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-400 transition-colors hover:bg-violet-600 hover:text-white"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={saveProfile}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold transition-colors hover:bg-violet-500"
          >
            <Save size={16} />
            Save Changes
          </button>
        )}
      </motion.div>


      {saved && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
        >
          <CheckCircle2 size={17} />
          Profile saved successfully.
        </motion.div>
      )}


      <div className="grid gap-6 xl:grid-cols-[0.35fr_0.65fr]">

        <motion.aside
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
        >

          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 shadow-[0_0_30px_rgba(139,92,246,0.22)]">
            <Building2 size={34} />
          </div>

          <h3 className="mt-5 text-xl font-semibold">
            {profile.name}
          </h3>

          <p className="mt-1 text-sm text-violet-400">
            {profile.type}
          </p>


          <div className="mt-6 space-y-3 text-sm text-slate-500">

            <div className="flex items-center gap-2">
              <MapPin size={15} />
              {profile.city}, {profile.state}
            </div>

            <div className="flex items-center gap-2">
              <Mail size={15} />
              {profile.email}
            </div>

            <div className="flex items-center gap-2">
              <Phone size={15} />
              {profile.phone}
            </div>

            <div className="flex items-center gap-2">
              <Users size={15} />
              {profile.students} Students
            </div>

          </div>

        </motion.aside>


        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
        >
          <h3 className="font-semibold">
            Institution Details
          </h3>


          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {fields.map(([field, label]) => (
              <label
                key={field}
                className="block"
              >
                <span className="text-xs font-medium text-slate-500">
                  {label}
                </span>

                <input
                  value={profile[field]}
                  disabled={!editing}
                  onChange={(event) =>
                    updateField(field, event.target.value)
                  }
                  className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none transition-colors ${
                    editing
                      ? "border-violet-500/30 bg-[#11101a] focus:border-violet-500"
                      : "border-white/[0.06] bg-white/[0.02] text-slate-400"
                  }`}
                />
              </label>
            ))}

          </div>

        </motion.section>

      </div>

    </div>
  );
}
