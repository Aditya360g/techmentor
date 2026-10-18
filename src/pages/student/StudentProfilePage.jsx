
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  Pencil,
  Save,
  UserRound,
  Camera,
  Upload,
  Trash2,
  X,
  Mail,
  Phone,
  GraduationCap,
  Hash,
  Building2,
  BookOpen,
} from "lucide-react";

import { studentProfile } from "../../data/student/studentData";

const profileFields = [
  { field: "name", label: "Full Name", icon: UserRound, type: "text" },
  { field: "email", label: "Email Address", icon: Mail, type: "email" },
  { field: "phone", label: "Phone Number", icon: Phone, type: "tel" },
  { field: "college", label: "College", icon: Building2, type: "text" },
  { field: "branch", label: "Branch", icon: GraduationCap, type: "text" },
  { field: "semester", label: "Semester", icon: BookOpen, type: "text" },
  { field: "enrollment", label: "Enrollment Number", icon: Hash, type: "text" },
];

const inputStyle = {
  color: "#000000",
  caretColor: "#000000",
  WebkitTextFillColor: "#000000",
  opacity: 1,
  colorScheme: "light",
};

export default function StudentProfilePage() {
  const [editing, setEditing] = useState(false);
  const [saved, setSaved] = useState(false);
  const [profile, setProfile] = useState({ ...studentProfile });
  const [savedProfile, setSavedProfile] = useState({ ...studentProfile });
  const [photo, setPhoto] = useState(studentProfile.photo || "");
  const [savedPhoto, setSavedPhoto] = useState(studentProfile.photo || "");
  const [photoError, setPhotoError] = useState("");
  const fileInputRef = useRef(null);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!saved) return;

    const timer = window.setTimeout(() => setSaved(false), 2500);
    return () => window.clearTimeout(timer);
  }, [saved]);

  useEffect(() => {
    return () => {
      if (photo?.startsWith("blob:")) URL.revokeObjectURL(photo);
    };
  }, [photo]);

  const updateField = (field, value) => {
    setProfile((current) => ({ ...current, [field]: value }));
    setSaved(false);
  };

  const handlePhotoChange = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setPhotoError("Please select a valid image file.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image size must be 5 MB or less.");
      return;
    }

    setPhotoError("");
    setSaved(false);
    setPhoto(URL.createObjectURL(file));
  };

  const save = () => {
    setSavedProfile({ ...profile });
    setSavedPhoto(photo);
    setEditing(false);
    setSaved(true);
  };

  const cancelEditing = () => {
    setProfile({ ...savedProfile });
    setPhoto(savedPhoto);
    setPhotoError("");
    setEditing(false);
  };

  const startEditing = () => {
    setProfile({ ...savedProfile });
    setPhoto(savedPhoto);
    setPhotoError("");
    setSaved(false);
    setEditing(true);
  };

  const removePhoto = () => {
    setPhoto("");
    setPhotoError("");
    setSaved(false);
  };

  const displayName = profile.name || "Student";

  return (
    <div className="mx-auto min-w-0 max-w-6xl space-y-5">
      {/* Success feedback */}
      {saved && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800"
        >
          <CheckCircle2 size={18} />
          Profile updated successfully.
        </motion.div>
      )}

      {/* Compact profile header */}
      <motion.section
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
      >
        <div className="h-2 bg-gradient-to-r from-violet-700 via-violet-500 to-indigo-500" />

        <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex min-w-0 items-center gap-4">
            {/* Smaller profile photo */}
            <div className="relative shrink-0">
              <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-violet-50 text-violet-600 sm:h-24 sm:w-24">
                {photo ? (
                  <img
                    src={photo}
                    alt={`${displayName}'s profile`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <UserRound size={36} strokeWidth={1.5} />
                )}
              </div>

              {editing && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  aria-label="Upload profile photo"
                  className="absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-xl border-2 border-white bg-violet-600 text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
                >
                  <Camera size={15} />
                </button>
              )}
            </div>

            <div className="min-w-0">
              <h2 className="break-words text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                {displayName}
              </h2>

              <p className="mt-1 break-words text-sm font-medium text-black">
                {profile.branch || "Student"}
              </p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle2 size={13} />
                  Student Account
                </span>

                {profile.semester && (
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                    {profile.semester}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Compact actions */}
          <div className="flex shrink-0 flex-wrap gap-2">
            {!editing ? (
              <button
                type="button"
                onClick={startEditing}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100 active:scale-[0.98]"
              >
                <Pencil size={15} />
                Edit Profile
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  <X size={15} />
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={save}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700"
                >
                  <Save size={15} />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>

        {/* Photo controls only while editing */}
        {editing && (
          <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 rounded-lg border border-violet-200 bg-white px-3 py-2 text-sm font-semibold text-violet-700 transition hover:bg-violet-50"
              >
                <Upload size={15} />
                {photo ? "Change Photo" : "Upload Photo"}
              </button>

              {photo && (
                <button
                  type="button"
                  onClick={removePhoto}
                  className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 transition hover:bg-rose-50"
                >
                  <Trash2 size={15} />
                  Remove Photo
                </button>
              )}

              <span className="text-xs text-slate-500">
                Image formats · Maximum 5 MB
              </span>
            </div>

            {photoError && (
              <p className="mt-2 text-sm font-medium text-rose-600">
                {photoError}
              </p>
            )}
          </div>
        )}
      </motion.section>

      {/* Compact content grid */}
      <div className="grid min-w-0 grid-cols-1 items-start gap-5 lg:grid-cols-[280px_minmax(0,1fr)]">
        {/* Overview card */}
        <motion.aside
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.05 }}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <GraduationCap size={20} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Student Overview
              </h3>
              <p className="mt-0.5 text-xs text-slate-500">
                Academic details
              </p>
            </div>
          </div>

          <div className="mt-5 divide-y divide-slate-100">
            <div className="flex items-start gap-3 py-3 first:pt-0">
              <Hash size={17} className="mt-0.5 shrink-0 text-slate-400" />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Student ID</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                  {profile.id || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3">
              <Building2
                size={17}
                className="mt-0.5 shrink-0 text-slate-400"
              />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">College</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                  {profile.college || "Not provided"}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 py-3 last:pb-0">
              <BookOpen
                size={17}
                className="mt-0.5 shrink-0 text-slate-400"
              />
              <div className="min-w-0">
                <p className="text-xs text-slate-500">Semester</p>
                <p className="mt-1 break-words text-sm font-semibold text-slate-900">
                  {profile.semester || "Not provided"}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-violet-50 p-3.5">
            <p className="text-xs font-semibold text-violet-900">
              Keep your profile updated
            </p>
            <p className="mt-1 text-xs leading-5 text-violet-700">
              Ensure your contact and academic details are correct.
            </p>
          </div>
        </motion.aside>

        {/* Personal information card */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <UserRound size={19} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Personal Information
              </h3>
              <p className="mt-1 text-xs text-slate-500">
                {editing
                  ? "Edit your details and save your changes."
                  : "Your registered student details."}
              </p>
            </div>
          </div>

          <div className="mt-5 grid min-w-0 gap-4 sm:grid-cols-2">
            {profileFields.map(({ field, label, icon: Icon, type }) => (
              <label key={field} className="block min-w-0">
                <span className="mb-2 flex items-center gap-2 text-xs font-semibold text-slate-600">
                  <Icon size={14} className="text-violet-600" />
                  {label}
                </span>

                <input
                  type={type}
                  value={profile[field] ?? ""}
                  disabled={!editing}
                  autoComplete="off"
                  spellCheck={false}
                  onChange={(event) =>
                    updateField(field, event.target.value)
                  }
                  style={inputStyle}
                  className={`h-11 w-full min-w-0 rounded-lg border px-3.5 text-sm !text-black caret-black outline-none transition-all placeholder:text-slate-400 disabled:cursor-default disabled:opacity-100 ${editing
                    ? "border-slate-300 bg-white focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                    : "border-slate-200 bg-slate-50"
                    }`}
                />
              </label>
            ))}
          </div>

          {editing && (
            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
              <p className="text-xs text-slate-500">
                Review your changes before saving.
              </p>
              <button
                type="button"
                onClick={save}
                className="inline-flex items-center justify-center gap-2 rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-100"
              >
                <Save size={15} />
                Save Changes
              </button>
            </div>
          )}
        </motion.section>
      </div>
    </div>
  );
}
