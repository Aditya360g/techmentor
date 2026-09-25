import { useState } from "react";
import { motion } from "motion/react";

import {
  BadgeCheck,
  CheckCircle2,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Save,
  Star,
} from "lucide-react";

const initialProfile = {
  name: "Aman Sharma",
  title: "Java & DSA Trainer",
  email: "aman.trainer@example.com",
  phone: "+91 98765 43210",
  location: "Delhi NCR",
  experience: "6",
  mode: "On Campus / Online",
  bio:
    "Technical trainer focused on Java, DSA, Spring Boot, problem solving and placement preparation.",
};

const initialSkills = [
  "Java",
  "DSA",
  "Spring Boot",
  "SQL",
  "Git & GitHub",
  "Interview Preparation",
];

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState(initialProfile);
  const [skills, setSkills] = useState(initialSkills);
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [newSkill, setNewSkill] = useState("");

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

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill || skills.includes(skill)) {
      return;
    }

    setSkills((current) => [
      ...current,
      skill,
    ]);

    setNewSkill("");
  };

  const removeSkill = (skill) => {
    if (!editing) return;

    setSkills((current) =>
      current.filter((item) => item !== skill)
    );
  };

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >

        <div>
          <h2 className="text-2xl font-bold">
            Trainer Profile
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            Manage your profile, skills and professional information.
          </p>
        </div>


        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="flex items-center justify-center gap-2 rounded-xl border border-violet-500/20 bg-violet-500/10 px-5 py-3 text-sm font-semibold text-violet-400 hover:bg-violet-600 hover:text-white"
          >
            <Pencil size={16} />
            Edit Profile
          </button>
        ) : (
          <button
            type="button"
            onClick={saveProfile}
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
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


      <div className="grid gap-6 xl:grid-cols-[0.4fr_0.6fr]">

        <motion.aside
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
        >
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 text-xl font-bold shadow-[0_0_30px_rgba(139,92,246,0.22)]">
            AS
          </div>

          <h3 className="mt-5 text-xl font-semibold">
            {profile.name}
          </h3>

          <p className="mt-1 text-sm text-violet-400">
            {profile.title}
          </p>


          <div className="mt-5 flex items-center gap-2 text-sm text-amber-400">
            <Star
              size={16}
              fill="currentColor"
            />

            4.9 Trainer Rating
          </div>


          <div className="mt-6 space-y-3 text-sm text-slate-500">

            <div className="flex items-center gap-2">
              <BadgeCheck size={15} />
              {profile.experience}+ Years Experience
            </div>

            <div className="flex items-center gap-2">
              <MapPin size={15} />
              {profile.location}
            </div>

            <div className="flex items-center gap-2">
              <Mail size={15} />
              {profile.email}
            </div>

            <div className="flex items-center gap-2">
              <Phone size={15} />
              {profile.phone}
            </div>

          </div>

        </motion.aside>


        <motion.section
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6"
        >
          <h3 className="font-semibold">
            Professional Information
          </h3>


          <div className="mt-6 grid gap-5 md:grid-cols-2">

            {[
              ["name", "Full Name"],
              ["title", "Professional Title"],
              ["email", "Email"],
              ["phone", "Phone"],
              ["location", "Location"],
              ["experience", "Experience (Years)"],
              ["mode", "Training Mode"],
            ].map(([field, label]) => (
              <label
                key={field}
                className="block"
              >
                <span className="text-xs text-slate-500">
                  {label}
                </span>

                <input
                  value={profile[field]}
                  disabled={!editing}
                  onChange={(event) =>
                    updateField(field, event.target.value)
                  }
                  className={`mt-2 h-12 w-full rounded-xl border px-4 text-sm outline-none ${
                    editing
                      ? "border-violet-500/30 bg-[#11101a] focus:border-violet-500"
                      : "border-white/[0.06] bg-white/[0.02] text-slate-400"
                  }`}
                />
              </label>
            ))}


            <label className="md:col-span-2">
              <span className="text-xs text-slate-500">
                Bio
              </span>

              <textarea
                rows="5"
                value={profile.bio}
                disabled={!editing}
                onChange={(event) =>
                  updateField("bio", event.target.value)
                }
                className={`mt-2 w-full resize-none rounded-xl border p-4 text-sm outline-none ${
                  editing
                    ? "border-violet-500/30 bg-[#11101a]"
                    : "border-white/[0.06] bg-white/[0.02] text-slate-400"
                }`}
              />
            </label>

          </div>


          <div className="mt-8 border-t border-white/[0.06] pt-6">

            <h3 className="font-semibold">
              Technical Skills
            </h3>

            <div className="mt-4 flex flex-wrap gap-2">

              {skills.map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="rounded-full border border-violet-500/20 bg-violet-500/[0.07] px-4 py-2 text-sm text-violet-300"
                >
                  {skill}
                  {editing ? " ×" : ""}
                </button>
              ))}

            </div>


            {editing && (
              <div className="mt-5 flex gap-3">

                <input
                  value={newSkill}
                  onChange={(event) =>
                    setNewSkill(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSkill();
                    }
                  }}
                  placeholder="Add skill..."
                  className="h-11 flex-1 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={addSkill}
                  className="rounded-xl bg-violet-600 px-5 text-sm font-medium hover:bg-violet-500"
                >
                  Add
                </button>

              </div>
            )}

          </div>

        </motion.section>

      </div>

    </div>
  );
}
