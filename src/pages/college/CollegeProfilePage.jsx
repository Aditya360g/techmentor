import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowUpRight,
  Award,
  BadgeCheck,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Clock3,
  Edit3,
  ExternalLink,
  FileText,
  Globe,
  GraduationCap,
  Mail,
  MapPin,
  Phone,
  Save,
  ShieldCheck,
  Sparkles,
  Users,
  X,
  XCircle,
  Upload,
  UserRound,
  BookOpen,
  BriefcaseBusiness,
  School,
  Landmark,
  ClipboardCheck,
  LoaderCircle,
} from "lucide-react";

/* =========================================================
   CONFIGURATION
========================================================= */

const STORAGE_KEY = "techmentor-college-profile-v1";

const INITIAL_PROFILE = {
  collegeName: "Rajasthan Institute of Technology",
  shortName: "RIT",
  institutionType: "Engineering College",
  affiliation: "Rajasthan Technical University",
  accreditation: "NAAC Accredited",
  establishedYear: "2012",
  website: "https://www.example.edu",
  email: "admin@example.edu",
  phone: "+91 98765 43210",
  alternatePhone: "",
  contactPerson: "Academic Administrator",
  designation: "College Administrator",
  address: "College Road, Main Campus",
  city: "Jodhpur",
  state: "Rajasthan",
  postalCode: "342001",
  country: "India",
  studentCount: "2400",
  trainerCount: "85",
  departmentCount: "12",
  description:
    "A technology-focused institution committed to practical learning, industry-oriented training, academic excellence and career development.",
  academicYear: "2026 – 27",
  accountStatus: "Verified",
  updatedAt: null,
};

const INSTITUTION_TYPES = [
  "Engineering College",
  "University",
  "Degree College",
  "Management Institute",
  "Polytechnic College",
  "Training Institute",
  "Other",
];

/* =========================================================
   HELPERS
========================================================= */

function loadProfile() {
  try {
    if (typeof window === "undefined") {
      return INITIAL_PROFILE;
    }

    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed && typeof parsed === "object") {
        return {
          ...INITIAL_PROFILE,
          ...parsed,
        };
      }
    }
  } catch (error) {
    console.error("Unable to load college profile:", error);
  }

  return INITIAL_PROFILE;
}

function getInitials(name = "") {
  return name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase() || "CL";
}

function formatNumber(value) {
  return (Number(value) || 0).toLocaleString("en-IN");
}

function validateWebsite(value) {
  if (!value.trim()) return true;

  try {
    const url = new URL(value);

    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function getProfileCompleteness(profile) {
  const fields = [
    profile.collegeName,
    profile.institutionType,
    profile.affiliation,
    profile.establishedYear,
    profile.website,
    profile.email,
    profile.phone,
    profile.contactPerson,
    profile.address,
    profile.city,
    profile.state,
    profile.postalCode,
    profile.description,
  ];

  const completed = fields.filter(
    (value) => String(value ?? "").trim().length > 0
  ).length;

  return Math.round((completed / fields.length) * 100);
}

/* =========================================================
   REUSABLE UI
========================================================= */

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="flex min-w-0 items-start gap-3">
      {Icon && (
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.06] text-sky-200">
          <Icon size={18} />
        </span>
      )}

      <div className="min-w-0">
        {eyebrow && (
          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-sky-300">
            {eyebrow}
          </p>
        )}

        <h2 className="mt-1 text-sm font-bold text-white sm:text-base">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-500">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value, href, emptyText = "Not provided" }) {
  const content = (
    <>
      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.07] bg-white/[0.025] text-sky-300">
        <Icon size={17} />
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-[10px] font-medium text-slate-500">
          {label}
        </span>

        <span className="mt-1 block break-words text-xs font-semibold leading-5 text-slate-200">
          {value || emptyText}
        </span>
      </span>

      {href && value && (
        <ExternalLink size={13} className="shrink-0 text-slate-500" />
      )}
    </>
  );

  if (href && value) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noreferrer" : undefined}
        className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0b1424]/75 p-3.5 transition hover:border-sky-400/20 hover:bg-white/[0.025]"
      >
        {content}
      </a>
    );
  }

  return (
    <div className="flex min-w-0 items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0b1424]/75 p-3.5">
      {content}
    </div>
  );
}

function MetricCard({ label, value, helper, icon: Icon, color }) {
  return (
    <motion.article
      whileHover={{ y: -2 }}
      className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[11px] font-medium text-slate-400">
            {label}
          </p>

          <p className="mt-3 break-words text-2xl font-extrabold tracking-tight text-white">
            {value}
          </p>

          <p className="mt-1 text-[10px] leading-5 text-slate-500">
            {helper}
          </p>
        </div>

        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] bg-white/[0.03] ${color}`}
        >
          <Icon size={19} />
        </span>
      </div>
    </motion.article>
  );
}

function Field({ label, name, value, onChange, type = "text", required = false, placeholder, help, maxLength }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold text-slate-300">
        {label}
        {required && <span className="ml-1 text-rose-300">*</span>}
      </span>

      <input
        type={type}
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        maxLength={maxLength}
        className="min-h-[43px] w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-2.5 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
      />

      {help && (
        <span className="mt-1.5 block text-[10px] leading-4 text-slate-500">
          {help}
        </span>
      )}
    </label>
  );
}

function SelectField({ label, name, value, onChange, options, required = false }) {
  return (
    <label className="block min-w-0">
      <span className="mb-2 block text-[11px] font-semibold text-slate-300">
        {label}
        {required && <span className="ml-1 text-rose-300">*</span>}
      </span>

      <select
        name={name}
        value={value ?? ""}
        onChange={onChange}
        required={required}
        className="min-h-[43px] w-full min-w-0 rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-2.5 text-xs text-slate-100 outline-none transition focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className="bg-[#0d1829] text-white"
          >
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

/* =========================================================
   EDIT PROFILE MODAL
========================================================= */

function EditProfileModal({ profile, onClose, onSave }) {
  const [form, setForm] = useState(() => ({ ...profile }));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (form.collegeName.trim().length < 3) {
      setError("College name should contain at least 3 characters.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      setError("Please enter a valid college email address.");
      return;
    }

    if (form.phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid contact number.");
      return;
    }

    if (!validateWebsite(form.website)) {
      setError("Website must be a valid URL starting with https:// or http://.");
      return;
    }

    if (form.establishedYear) {
      const year = Number(form.establishedYear);
      const currentYear = new Date().getFullYear();

      if (
        !Number.isInteger(year) ||
        year < 1800 ||
        year > currentYear
      ) {
        setError(`Enter a valid establishment year between 1800 and ${currentYear}.`);
        return;
      }
    }

    if (!form.city.trim() || !form.state.trim()) {
      setError("Please fill in the city and state.");
      return;
    }

    setSaving(true);

    const result = onSave({
      ...form,
      collegeName: form.collegeName.trim(),
      shortName: form.shortName.trim(),
      email: form.email.trim(),
      website: form.website.trim(),
      contactPerson: form.contactPerson.trim(),
      address: form.address.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      updatedAt: new Date().toISOString(),
    });

    setSaving(false);

    if (result !== true) {
      setError(typeof result === "string" ? result : "Unable to save the profile.");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[10000] flex items-center justify-center overflow-y-auto bg-[#020712]/85 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <motion.section
        initial={{ opacity: 0, y: 20, scale: 0.985 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 10, scale: 0.985 }}
        transition={{ duration: 0.2 }}
        role="dialog"
        aria-modal="true"
        aria-label="Edit college profile"
        className="my-auto max-h-[94vh] w-full max-w-4xl overflow-y-auto rounded-2xl border border-sky-400/15 bg-[#0d1829] shadow-2xl shadow-black/50"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-white/[0.07] bg-[#0d1829]/95 px-5 py-4 backdrop-blur-xl sm:px-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-sky-300">
              College settings
            </p>

            <h2 className="mt-1.5 text-lg font-bold text-white">
              Edit college profile
            </h2>

            <p className="mt-1 text-[11px] text-slate-400">
              Update your institution and contact information.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close edit profile"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-sky-400/25 hover:text-white"
          >
            <X size={17} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 p-5 sm:p-6">
          <section>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.13em] text-sky-200">
              Institution details
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="College / institution name"
                  name="collegeName"
                  value={form.collegeName}
                  onChange={handleChange}
                  required
                  maxLength={120}
                  placeholder="Enter institution name"
                />
              </div>

              <Field
                label="Short name / abbreviation"
                name="shortName"
                value={form.shortName}
                onChange={handleChange}
                maxLength={15}
                placeholder="e.g. RIT"
              />

              <SelectField
                label="Institution type"
                name="institutionType"
                value={form.institutionType}
                onChange={handleChange}
                options={INSTITUTION_TYPES}
                required
              />

              <Field
                label="Affiliated university"
                name="affiliation"
                value={form.affiliation}
                onChange={handleChange}
                placeholder="Enter university name"
                maxLength={120}
              />

              <Field
                label="Accreditation"
                name="accreditation"
                value={form.accreditation}
                onChange={handleChange}
                placeholder="Enter accreditation details"
                maxLength={80}
              />

              <Field
                label="Established year"
                name="establishedYear"
                type="number"
                value={form.establishedYear}
                onChange={handleChange}
                min="1800"
                max={new Date().getFullYear()}
              />

              <Field
                label="Academic year"
                name="academicYear"
                value={form.academicYear}
                onChange={handleChange}
                placeholder="e.g. 2026–27"
              />

              <Field
                label="Website"
                name="website"
                type="url"
                value={form.website}
                onChange={handleChange}
                placeholder="https://www.example.edu"
                help="Include https:// or http://"
              />
            </div>
          </section>

          <section className="border-t border-white/[0.07] pt-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.13em] text-sky-200">
              Contact information
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label="Official email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="admin@college.edu"
              />

              <Field
                label="Primary contact number"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                required
                placeholder="+91 98765 43210"
              />

              <Field
                label="Alternate contact number"
                name="alternatePhone"
                type="tel"
                value={form.alternatePhone}
                onChange={handleChange}
                placeholder="Optional alternate number"
              />

              <Field
                label="Contact person"
                name="contactPerson"
                value={form.contactPerson}
                onChange={handleChange}
                required
                placeholder="Full name"
                maxLength={100}
              />

              <div className="sm:col-span-2">
                <Field
                  label="Contact person's designation"
                  name="designation"
                  value={form.designation}
                  onChange={handleChange}
                  placeholder="e.g. College Administrator"
                  maxLength={100}
                />
              </div>
            </div>
          </section>

          <section className="border-t border-white/[0.07] pt-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.13em] text-sky-200">
              Campus address
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <Field
                  label="Address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  placeholder="Street, campus and locality"
                  maxLength={200}
                />
              </div>

              <Field
                label="City"
                name="city"
                value={form.city}
                onChange={handleChange}
                required
                maxLength={80}
              />

              <Field
                label="State"
                name="state"
                value={form.state}
                onChange={handleChange}
                required
                maxLength={80}
              />

              <Field
                label="Postal code"
                name="postalCode"
                value={form.postalCode}
                onChange={handleChange}
                maxLength={12}
              />

              <Field
                label="Country"
                name="country"
                value={form.country}
                onChange={handleChange}
                maxLength={80}
              />
            </div>
          </section>

          <section className="border-t border-white/[0.07] pt-5">
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.13em] text-sky-200">
              Institution overview
            </h3>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field
                label="Total students"
                name="studentCount"
                type="number"
                value={form.studentCount}
                onChange={handleChange}
                min="0"
                max="1000000"
              />

              <Field
                label="Total trainers"
                name="trainerCount"
                type="number"
                value={form.trainerCount}
                onChange={handleChange}
                min="0"
                max="100000"
              />

              <Field
                label="Departments"
                name="departmentCount"
                type="number"
                value={form.departmentCount}
                onChange={handleChange}
                min="0"
                max="10000"
              />
            </div>

            <label className="mt-4 block">
              <span className="mb-2 block text-[11px] font-semibold text-slate-300">
                About the institution
              </span>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                maxLength={1000}
                placeholder="Describe your institution, academic programs and learning environment..."
                className="w-full resize-y rounded-xl border border-white/[0.09] bg-[#091322] px-3.5 py-3 text-xs leading-6 text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-sky-400/40 focus:ring-2 focus:ring-sky-400/[0.08]"
              />

              <span className="mt-1.5 block text-right text-[10px] text-slate-500">
                {form.description.length}/1000 characters
              </span>
            </label>
          </section>

          {error && (
            <div
              role="alert"
              className="flex items-start gap-2.5 rounded-xl border border-rose-400/20 bg-rose-400/[0.06] p-3.5 text-xs leading-5 text-rose-200"
            >
              <XCircle size={15} className="mt-0.5 shrink-0" />
              {error}
            </div>
          )}

          <div className="sticky bottom-0 flex flex-col-reverse justify-end gap-2 border-t border-white/[0.07] bg-[#0d1829]/95 pt-4 sm:flex-row">
            <button
              type="button"
              onClick={onClose}
              disabled={saving}
              className="min-h-[42px] rounded-xl border border-white/[0.09] px-4 text-xs font-semibold text-slate-300 transition hover:bg-white/[0.04] hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={saving}
              className="inline-flex min-h-[42px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-5 text-xs font-bold text-[#07111f] transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70"
            >
              {saving ? (
                <LoaderCircle size={15} className="animate-spin" />
              ) : (
                <Save size={15} />
              )}

              {saving ? "Saving..." : "Save changes"}
            </button>
          </div>
        </form>
      </motion.section>
    </motion.div>
  );
}

/* =========================================================
   MAIN COLLEGE PROFILE PAGE
========================================================= */

export default function CollegeProfilePage() {
  const [profile, setProfile] = useState(loadProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [toast, setToast] = useState("");

  const completeness = getProfileCompleteness(profile);

  useEffect(() => {
    if (!toast) return undefined;

    const timeout = window.setTimeout(() => setToast(""), 3200);

    return () => window.clearTimeout(timeout);
  }, [toast]);

  function handleSaveProfile(updatedProfile) {
    try {
      const previous = profile;

      setProfile(updatedProfile);

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedProfile)
      );

      setIsEditing(false);
      setToast("College profile updated successfully.");

      return true;
    } catch (error) {
      console.error("Unable to save college profile:", error);

      setToast("Could not save the profile in this browser.");
      return "Saving failed. Check your browser storage and try again.";
    }
  }

  const websiteUrl = profile.website?.trim()
    ? /^https?:\/\//i.test(profile.website.trim())
      ? profile.website.trim()
      : `https://${profile.website.trim()}`
    : "";

  return (
    <main className="college-profile-page min-h-full w-full min-w-0 overflow-x-clip bg-[#0b1424] text-slate-100">
      <style>{`
        .college-profile-page {
          color-scheme: dark;
          background:
            radial-gradient(ellipse at 8% 0%, rgba(56,189,248,.055), transparent 33%),
            radial-gradient(ellipse at 95% 12%, rgba(99,102,241,.04), transparent 30%),
            #0b1424;
        }

        .college-profile-page,
        .college-profile-page * {
          box-sizing: border-box;
        }

        @media (prefers-reduced-motion: reduce) {
          .college-profile-page *,
          .college-profile-page *::before,
          .college-profile-page *::after {
            animation-duration: .01ms !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="mx-auto w-full min-w-0 max-w-[1600px] space-y-6 px-3 py-5 sm:px-5 sm:py-6 xl:px-7">
        {/* PAGE HEADER */}

        <motion.header
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div className="min-w-0">
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-sky-400/15 bg-sky-400/[0.06] px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-sky-200">
              <Building2 size={12} />
              
            </span>

            <h1 className="text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              
            </h1>

            <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-400 sm:text-sm">
              Manage your institution's identity, contact information, campus
              details and academic profile.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex min-h-[43px] shrink-0 items-center justify-center gap-2 self-start rounded-xl bg-gradient-to-r from-sky-400 to-blue-500 px-4 text-xs font-bold text-[#07111f] shadow-lg shadow-sky-950/20 transition hover:brightness-110 active:scale-[0.99] sm:self-auto"
          >
            <Edit3 size={15} />
            Edit Profile
          </button>
        </motion.header>

        {/* PROFILE HERO */}

        <motion.section
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="relative min-w-0 overflow-hidden rounded-2xl border border-sky-400/15 bg-gradient-to-br from-[#13263e] via-[#102039] to-[#111a2f] p-5 sm:p-7"
        >
          <div className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-sky-400/[0.07] blur-3xl" />
          <div className="pointer-events-none absolute bottom-[-90px] left-[35%] h-48 w-48 rounded-full bg-blue-500/[0.05] blur-3xl" />

          <div className="relative flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
              <div className="relative flex h-20 w-20 shrink-0 items-center justify-center rounded-[22px] border border-sky-300/20 bg-gradient-to-br from-sky-300 to-blue-500 text-2xl font-extrabold text-[#07111f] shadow-xl shadow-sky-950/20 sm:h-24 sm:w-24">
                {getInitials(profile.shortName || profile.collegeName)}

                <span className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-lg border-2 border-[#11223a] bg-emerald-400 text-[#06251a]">
                  <Check size={14} strokeWidth={3} />
                </span>
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="break-words text-xl font-extrabold tracking-tight text-white sm:text-2xl">
                    {profile.collegeName}
                  </h2>

                  <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-2.5 py-1 text-[10px] font-semibold text-emerald-300">
                    <BadgeCheck size={12} />
                    {profile.accountStatus || "Verified"}
                  </span>
                </div>

                <p className="mt-2 text-xs text-slate-300">
                  {profile.institutionType}
                  {profile.affiliation ? ` · ${profile.affiliation}` : ""}
                </p>

                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-slate-400">
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} className="text-sky-300" />
                    {[profile.city, profile.state].filter(Boolean).join(", ") || "Location not provided"}
                  </span>

                  <span className="inline-flex items-center gap-1.5">
                    <CalendarDays size={13} className="text-sky-300" />
                    Established {profile.establishedYear || "—"}
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:min-w-[240px]">
              <div className="rounded-xl border border-white/[0.08] bg-black/[0.12] p-3.5">
                <p className="text-[10px] text-slate-400">Academic year</p>
                <p className="mt-2 text-sm font-bold text-white">
                  {profile.academicYear || "—"}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.08] bg-black/[0.12] p-3.5">
                <p className="text-[10px] text-slate-400">Profile completed</p>
                <p className="mt-2 text-sm font-bold text-sky-200">
                  {completeness}%
                </p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* METRICS */}

        <section className="grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            label="Total students"
            value={formatNumber(profile.studentCount)}
            helper="Institution profile"
            icon={Users}
            color="text-sky-300"
          />

          <MetricCard
            label="Total trainers"
            value={formatNumber(profile.trainerCount)}
            helper="Trainer directory"
            icon={GraduationCap}
            color="text-violet-300"
          />

          <MetricCard
            label="Departments"
            value={formatNumber(profile.departmentCount)}
            helper="Academic departments"
            icon={BookOpen}
            color="text-blue-300"
          />

          <MetricCard
            label="Established"
            value={profile.establishedYear || "—"}
            helper={profile.institutionType}
            icon={Award}
            color="text-amber-300"
          />
        </section>

        {/* PROFILE COMPLETENESS */}

        <section className="rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex min-w-0 items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.06] text-sky-200">
                <Sparkles size={18} />
              </span>

              <div className="min-w-0">
                <h3 className="text-sm font-bold text-white">
                  Profile completeness
                </h3>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Keep your college information up to date for a complete
                  institutional profile.
                </p>
              </div>
            </div>

            <span className="text-xl font-extrabold text-sky-200">
              {completeness}%
            </span>
          </div>

          <div
            className="mt-4 h-2 overflow-hidden rounded-full bg-white/[0.06]"
            role="progressbar"
            aria-label="Profile completeness"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={completeness}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${completeness}%` }}
              transition={{ duration: 0.7 }}
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-blue-500"
            />
          </div>

          {completeness < 100 && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold text-sky-300 transition hover:text-sky-100"
            >
              Complete missing details
              <ChevronRight size={13} />
            </button>
          )}
        </section>

        {/* INSTITUTION + CONTACT */}

        <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
          {/* INSTITUTION DETAILS */}

          <article className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <SectionHeading
                eyebrow="Institution"
                title="Institution details"
                description="Your college's official information"
                icon={School}
              />

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit institution details"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-sky-400/25 hover:text-sky-200"
              >
                <Edit3 size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <InfoItem
                icon={Building2}
                label="Institution name"
                value={profile.collegeName}
              />

              <InfoItem
                icon={Landmark}
                label="Affiliated university"
                value={profile.affiliation}
              />

              <InfoItem
                icon={Award}
                label="Accreditation"
                value={profile.accreditation}
              />

              <InfoItem
                icon={CalendarDays}
                label="Establishment year"
                value={profile.establishedYear}
              />

              <InfoItem
                icon={Globe}
                label="Official website"
                value={profile.website}
                href={websiteUrl || undefined}
              />
            </div>
          </article>

          {/* CONTACT DETAILS */}

          <article className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <SectionHeading
                eyebrow="Communication"
                title="Contact information"
                description="Official contact details for your institution"
                icon={Phone}
              />

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit contact information"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-sky-400/25 hover:text-sky-200"
              >
                <Edit3 size={15} />
              </button>
            </div>

            <div className="space-y-3">
              <InfoItem
                icon={Mail}
                label="Official email"
                value={profile.email}
                href={profile.email ? `mailto:${profile.email}` : undefined}
              />

              <InfoItem
                icon={Phone}
                label="Primary contact"
                value={profile.phone}
                href={profile.phone ? `tel:${profile.phone.replace(/[^\d+]/g, "")}` : undefined}
              />

              <InfoItem
                icon={Phone}
                label="Alternate contact"
                value={profile.alternatePhone}
                href={
                  profile.alternatePhone
                    ? `tel:${profile.alternatePhone.replace(/[^\d+]/g, "")}`
                    : undefined
                }
              />

              <InfoItem
                icon={UserRound}
                label="Contact person"
                value={profile.contactPerson}
              />

              <InfoItem
                icon={BriefcaseBusiness}
                label="Designation"
                value={profile.designation}
              />
            </div>
          </article>
        </section>

        {/* ADDRESS + OVERVIEW */}

        <section className="grid min-w-0 grid-cols-1 gap-5 xl:grid-cols-2">
          <article className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <SectionHeading
                eyebrow="Campus"
                title="Campus address"
                description="Institution location and postal details"
                icon={MapPin}
              />

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit campus address"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-sky-400/25 hover:text-sky-200"
              >
                <Edit3 size={15} />
              </button>
            </div>

            <div className="rounded-2xl border border-white/[0.07] bg-[#0b1424]/70 p-4">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/[0.06] text-sky-200">
                  <MapPin size={18} />
                </span>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-white">
                    {profile.collegeName}
                  </p>

                  <p className="mt-2 break-words text-xs leading-6 text-slate-400">
                    {[profile.address, profile.city, profile.state, profile.postalCode, profile.country]
                      .filter(Boolean)
                      .join(", ") || "Address not provided"}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                <p className="text-[10px] text-slate-500">City</p>
                <p className="mt-1.5 break-words text-xs font-semibold text-slate-200">
                  {profile.city || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                <p className="text-[10px] text-slate-500">State</p>
                <p className="mt-1.5 break-words text-xs font-semibold text-slate-200">
                  {profile.state || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                <p className="text-[10px] text-slate-500">Postal code</p>
                <p className="mt-1.5 text-xs font-semibold text-slate-200">
                  {profile.postalCode || "Not provided"}
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-3.5">
                <p className="text-[10px] text-slate-500">Country</p>
                <p className="mt-1.5 text-xs font-semibold text-slate-200">
                  {profile.country || "Not provided"}
                </p>
              </div>
            </div>
          </article>

          <article className="min-w-0 rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
            <div className="mb-5 flex items-start justify-between gap-3">
              <SectionHeading
                eyebrow="About us"
                title="Institution overview"
                description="Academic scale and institution description"
                icon={BookOpen}
              />

              <button
                type="button"
                onClick={() => setIsEditing(true)}
                aria-label="Edit institution overview"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/[0.08] text-slate-400 transition hover:border-sky-400/25 hover:text-sky-200"
              >
                <Edit3 size={15} />
              </button>
            </div>

            <p className="rounded-xl border border-white/[0.07] bg-[#0b1424]/70 p-4 text-xs leading-7 text-slate-300">
              {profile.description || "Add an overview of your institution using Edit Profile."}
            </p>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-400/[0.07] text-sky-200">
                  <Users size={16} />
                </span>

                <p className="mt-3 text-xl font-extrabold text-white">
                  {formatNumber(profile.studentCount)}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Students registered
                </p>
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-400/[0.07] text-violet-200">
                  <GraduationCap size={16} />
                </span>

                <p className="mt-3 text-xl font-extrabold text-white">
                  {formatNumber(profile.trainerCount)}
                </p>

                <p className="mt-1 text-[10px] text-slate-500">
                  Trainers listed
                </p>
              </div>
            </div>
          </article>
        </section>

        {/* ACCOUNT DETAILS */}

        <section className="rounded-2xl border border-white/[0.08] bg-[#111c2d]/90 p-4 sm:p-5">
          <div className="flex min-w-0 flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <SectionHeading
              eyebrow="Account"
              title="Institution account"
              description="Review account status and the most recent profile update."
              icon={ShieldCheck}
            />

            <span className="inline-flex items-center gap-2 self-start rounded-full border border-emerald-400/20 bg-emerald-400/[0.07] px-3 py-1.5 text-[10px] font-semibold text-emerald-300 sm:self-auto">
              <CheckCircle2 size={13} />
              {profile.accountStatus || "Verified"}
            </span>
          </div>

          <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0b1424]/70 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-sky-400/[0.07] text-sky-200">
                <Clock3 size={16} />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] text-slate-500">
                  Last profile update
                </p>

                <p className="mt-1.5 break-words text-xs font-semibold text-slate-200">
                  {profile.updatedAt
                    ? new Date(profile.updatedAt).toLocaleString("en-IN")
                    : "No saved update yet"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-[#0b1424]/70 p-3.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-400/[0.07] text-emerald-200">
                <BadgeCheck size={16} />
              </span>

              <div className="min-w-0">
                <p className="text-[10px] text-slate-500">
                  Profile completion
                </p>

                <p className="mt-1.5 text-xs font-semibold text-slate-200">
                  {completeness}% completed
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FOOTER */}

        <footer className="flex flex-col justify-between gap-2 border-t border-white/[0.07] pt-5 text-[10px] text-slate-500 sm:flex-row sm:items-center">
          <span>CodeFaculty · College profile</span>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="inline-flex items-center gap-1.5 self-start font-semibold text-sky-300 transition hover:text-sky-100 sm:self-auto"
          >
            Edit institution details
            <ArrowUpRight size={12} />
          </button>
        </footer>
      </div>

      {/* EDIT PROFILE MODAL */}

      <AnimatePresence>
        {isEditing && (
          <EditProfileModal
            key="college-profile-edit"
            profile={profile}
            onClose={() => setIsEditing(false)}
            onSave={handleSaveProfile}
          />
        )}
      </AnimatePresence>

      {/* TOAST */}

      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            role="status"
            className="fixed right-4 top-20 z-[12000] flex max-w-[calc(100vw-2rem)] items-start gap-3 rounded-xl border border-emerald-400/20 bg-[#10211e] px-4 py-3 text-emerald-200 shadow-2xl sm:right-6"
          >
            <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
            <p className="text-xs leading-5">{toast}</p>

            <button
              type="button"
              onClick={() => setToast("")}
              aria-label="Dismiss notification"
              className="ml-1 rounded-md p-0.5 opacity-70 transition hover:opacity-100"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

