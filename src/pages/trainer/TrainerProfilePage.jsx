
import { useEffect, useMemo, useState } from "react";

const STORAGE_KEY = "trainer-profile-v1";

const DEFAULT_PROFILE = {
  name: "Aman Sharma",
  title: "Java & DSA Trainer",
  email: "aman.trainer@example.com",
  phone: "+91 98765 43210",
  location: "Jaipur, Rajasthan, India",
  experience: "3",
  education: "B.Tech in Computer Science",
  bio: "Passionate trainer focused on helping students build strong programming fundamentals, solve data structures and algorithms problems, and prepare for technical interviews.",
  skills: [
    "Java",
    "DSA",
    "Spring Boot",
    "SQL",
    "Git & GitHub",
    "Interview Preparation",
  ],
  website: "https://example.com",
  linkedin: "https://linkedin.com",
  github: "https://github.com",
};

const DEFAULT_SKILLS = [
  "Java",
  "JavaScript",
  "Python",
  "DSA",
  "React",
  "Spring Boot",
  "SQL",
  "MongoDB",
  "Git & GitHub",
  "System Design",
  "Interview Preparation",
  "Machine Learning",
];

const ICONS = {
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M5 21a7 7 0 0 1 14 0" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  badge: (
    <>
      <path d="M12 3 15 5l4 .5.5 4L22 13l-2.5 3.5-.5 4-4 .5-3 2-3-2-4-.5-.5-4L2 13l2.5-3.5.5-4L9 5z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  external: (
    <>
      <path d="M14 3h7v7" />
      <path d="m10 14 11-11" />
      <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M2 12h20" />
      <path d="M12 2a15 15 0 0 1 0 20" />
      <path d="M12 2a15 15 0 0 0 0 20" />
    </>
  ),
  mail: (
    <>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </>
  ),
  map: (
    <>
      <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  edit: (
    <>
      <path d="m16 4 4 4" />
      <path d="M4 20l4-.8L19 8a2.8 2.8 0 0 0-4-4L4 15z" />
    </>
  ),
  phone: (
    <path d="M22 16.9v3a2 2 0 0 1-2.2 2A19.8 19.8 0 0 1 11.2 19a19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7l.5 3a2 2 0 0 1-.6 1.8L7.1 10.4a16 16 0 0 0 6 6l1.9-1.9a2 2 0 0 1 1.8-.6l3 .5a2 2 0 0 1 2.2 2.5Z" />
  ),
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  save: (
    <>
      <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2Z" />
      <path d="M17 21v-8H7v8" />
      <path d="M7 3v5h8" />
    </>
  ),
  shield: (
    <>
      <path d="M12 22s8-4 8-11V5l-8-3-8 3v6c0 7 8 11 8 11Z" />
      <path d="m9 12 2 2 4-4" />
    </>
  ),
  star: (
    <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" />
  ),
  briefcase: (
    <>
      <rect x="3" y="7" width="18" height="14" rx="2" />
      <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
    </>
  ),
  education: (
    <>
      <path d="m2 10 10-5 10 5-10 5z" />
      <path d="M6 12v5c4 3 8 3 12 0v-5" />
      <path d="M22 10v6" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </>
  ),
  close: (
    <>
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </>
  ),
  code: (
    <>
      <path d="m8 17-5-5 5-5M16 7l5 5-5 5M14 4l-4 16" />
    </>
  ),
};

function Icon({ name, size = 18, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {ICONS[name] || ICONS.user}
    </svg>
  );
}

function readStoredProfile() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      return {
        ...DEFAULT_PROFILE,
        ...JSON.parse(stored),
      };
    }
  } catch (error) {
    console.error("Could not load saved profile:", error);
  }

  return { ...DEFAULT_PROFILE };
}

const inputStyle =
  "mt-2 block w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-bold text-black caret-emerald-700 outline-none placeholder:font-normal placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-black disabled:opacity-100";

const labelStyle = "block text-sm font-semibold text-slate-700";

function Field({
  label,
  name,
  profile,
  editing,
  updateField,
  type = "text",
  placeholder = "",
}) {
  return (
    <label className={labelStyle}>
      {label}
      <input
        type={type}
        name={name}
        value={profile[name] ?? ""}
        disabled={!editing}
        placeholder={placeholder}
        onChange={(event) => updateField(name, event.target.value)}
        className={inputStyle}
        autoComplete="off"
      />
    </label>
  );
}

function ProfileLink({ icon, label, value, editing, onChange, placeholder }) {
  const displayValue = value
    ? value.startsWith("http")
      ? value
      : `https://${value}`
    : "";

  return (
    <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4">
      <div className="mt-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
        <Icon name={icon} size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <label className="block text-sm font-semibold text-slate-700">
          {label}
          <input
            type="url"
            value={value ?? ""}
            disabled={!editing}
            placeholder={placeholder}
            onChange={(event) => onChange(event.target.value)}
            className={`${inputStyle} px-3`}
            autoComplete="off"
          />
        </label>

        {!editing && displayValue && (
          <a
            href={displayValue}
            target="_blank"
            rel="noreferrer"
            className="mt-2 inline-flex max-w-full items-center gap-1 break-all text-xs font-medium text-emerald-700 hover:underline"
          >
            Open profile
            <Icon name="external" size={12} />
          </a>
        )}
      </div>
    </div>
  );
}

export default function TrainerProfilePage() {
  const [profile, setProfile] = useState(() => readStoredProfile());
  const [savedProfile, setSavedProfile] = useState(() => readStoredProfile());
  const [editing, setEditing] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedProfile));
    } catch (storageError) {
      console.error("Could not save profile:", storageError);
    }
  }, [savedProfile]);

  const updateField = (name, value) => {
    setProfile((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveProfile = (event) => {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!profile.name.trim()) {
      setError("Please enter your full name.");
      return;
    }

    if (!profile.email.trim()) {
      setError("Please enter your email address.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (profile.phone.trim() && profile.phone.trim().length < 7) {
      setError("Please enter a valid phone number.");
      return;
    }

    const cleanedProfile = {
      ...profile,
      name: profile.name.trim(),
      title: profile.title.trim(),
      email: profile.email.trim(),
      phone: profile.phone.trim(),
      location: profile.location.trim(),
      experience: profile.experience.trim(),
      education: profile.education.trim(),
      bio: profile.bio.trim(),
      website: profile.website.trim(),
      linkedin: profile.linkedin.trim(),
      github: profile.github.trim(),
      skills: profile.skills.map((skill) => skill.trim()).filter(Boolean),
    };

    setProfile(cleanedProfile);
    setSavedProfile(cleanedProfile);
    setEditing(false);
    setMessage("Your profile has been saved successfully.");

    window.setTimeout(() => setMessage(""), 3000);
  };

  const cancelEditing = () => {
    setProfile({ ...savedProfile, skills: [...savedProfile.skills] });
    setEditing(false);
    setError("");
    setMessage("");
    setNewSkill("");
  };

  const addSkill = () => {
    const skill = newSkill.trim();

    if (!skill) return;

    const alreadyExists = profile.skills.some(
      (existing) => existing.toLowerCase() === skill.toLowerCase()
    );

    if (alreadyExists) {
      setError("This skill has already been added.");
      return;
    }

    setProfile((current) => ({
      ...current,
      skills: [...current.skills, skill],
    }));

    setNewSkill("");
    setError("");
  };

  const removeSkill = (skillToRemove) => {
    setProfile((current) => ({
      ...current,
      skills: current.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const completeness = useMemo(() => {
    const checks = [
      profile.name,
      profile.title,
      profile.email,
      profile.phone,
      profile.location,
      profile.experience,
      profile.education,
      profile.bio,
      profile.skills.length > 0,
      profile.website || profile.linkedin || profile.github,
    ];

    const completed = checks.filter((item) =>
      typeof item === "string" ? item.trim().length > 0 : Boolean(item)
    ).length;

    return Math.round((completed / checks.length) * 100);
  }, [profile]);

  const initials = profile.name
    .split(" ")
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const summaryItems = [
    {
      icon: "briefcase",
      label: "Experience",
      value: profile.experience
        ? `${profile.experience} years`
        : "Not specified",
    },
    {
      icon: "education",
      label: "Education",
      value: profile.education || "Not specified",
    },
    {
      icon: "map",
      label: "Location",
      value: profile.location || "Not specified",
    },
  ];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-wrap items-center justify-end gap-3">
          {editing ? (
            <>
              <button
                type="button"
                onClick={cancelEditing}
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
              >
                <Icon name="close" size={16} />
                Cancel
              </button>

              <button
                type="submit"
                form="trainer-profile-form"
                className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
              >
                <Icon name="save" size={16} />
                Save Changes
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setEditing(true);
                setMessage("");
                setError("");
              }}
              className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
            >
              <Icon name="edit" size={16} />
              Edit Profile
            </button>
          )}
        </div>

        {message && (
          <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800">
            <Icon name="check" size={18} />
            {message}
          </div>
        )}

        {error && (
          <div
            role="alert"
            className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
          >
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[340px_minmax(0,1fr)]">
          <aside className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-24 bg-gradient-to-r from-emerald-700 via-emerald-600 to-teal-500" />

              <div className="px-6 pb-6">
                <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-2xl border-4 border-white bg-emerald-100 text-3xl font-bold text-emerald-800 shadow-sm">
                  {initials || "TS"}
                </div>

                <div className="mt-4">
                  <h1 className="text-xl font-bold text-slate-900">
                    {profile.name || "Your Name"}
                  </h1>

                  <p className="mt-1 text-sm font-medium text-emerald-700">
                    {profile.title || "Your Professional Title"}
                  </p>

                  <div className="mt-4 space-y-3 text-sm text-slate-600">
                    <p className="flex items-start gap-2">
                      <Icon
                        name="mail"
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-700"
                      />
                      <span className="break-all">
                        {profile.email || "Email not added"}
                      </span>
                    </p>

                    <p className="flex items-start gap-2">
                      <Icon
                        name="phone"
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-700"
                      />
                      <span>{profile.phone || "Phone not added"}</span>
                    </p>

                    <p className="flex items-start gap-2">
                      <Icon
                        name="map"
                        size={17}
                        className="mt-0.5 shrink-0 text-emerald-700"
                      />
                      <span>{profile.location || "Location not added"}</span>
                    </p>
                  </div>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-5">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">
                      Profile completeness
                    </span>
                    <span className="text-sm font-bold text-emerald-700">
                      {completeness}%
                    </span>
                  </div>

                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-emerald-600 transition-all duration-500"
                      style={{ width: `${completeness}%` }}
                    />
                  </div>

                  <p className="mt-2 text-xs text-slate-500">
                    Complete your details to improve your profile.
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="badge" size={19} />
                </div>
                <h2 className="font-bold text-slate-900">
                  Professional Summary
                </h2>
              </div>

              <div className="space-y-5">
                {summaryItems.map((item) => (
                  <div key={item.label} className="flex gap-3">
                    <div className="mt-0.5 text-emerald-700">
                      <Icon name={item.icon} size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-slate-500">
                        {item.label}
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-800">
                        {item.value}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
              <div className="flex items-start gap-3">
                <Icon
                  name="shield"
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-700"
                />
                <div>
                  <h2 className="text-sm font-bold text-emerald-900">
                    Keep your profile updated
                  </h2>
                  <p className="mt-1 text-xs leading-5 text-emerald-800">
                    Add your latest skills, experience and professional links
                    so students can learn more about you.
                  </p>
                </div>
              </div>
            </section>
          </aside>

          <form
            id="trainer-profile-form"
            onSubmit={saveProfile}
            className="space-y-6"
          >
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="user" size={21} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Personal Information
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Your basic contact and professional details.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field
                  label="Full Name"
                  name="name"
                  profile={profile}
                  editing={editing}
                  updateField={updateField}
                  placeholder="Enter your full name"
                />

                <Field
                  label="Professional Title"
                  name="title"
                  profile={profile}
                  editing={editing}
                  updateField={updateField}
                  placeholder="e.g. Java & DSA Trainer"
                />

                <Field
                  label="Email Address"
                  name="email"
                  profile={profile}
                  editing={editing}
                  updateField={updateField}
                  type="email"
                  placeholder="Enter your email"
                />

                <Field
                  label="Phone Number"
                  name="phone"
                  profile={profile}
                  editing={editing}
                  updateField={updateField}
                  type="tel"
                  placeholder="Enter your phone number"
                />

                <Field
                  label="Location"
                  name="location"
                  profile={profile}
                  editing={editing}
                  updateField={updateField}
                  placeholder="City, State, Country"
                />

                <Field
                  label="Experience (years)"
                  name="experience"
                  profile={profile}
                  editing={editing}
                  updateField={updateField}
                  type="number"
                  placeholder="e.g. 3"
                />

                <div className="sm:col-span-2">
                  <Field
                    label="Education"
                    name="education"
                    profile={profile}
                    editing={editing}
                    updateField={updateField}
                    placeholder="Your highest qualification"
                  />
                </div>

                <label className={`${labelStyle} sm:col-span-2`}>
                  Professional Bio
                  <textarea
                    rows={5}
                    value={profile.bio ?? ""}
                    disabled={!editing}
                    placeholder="Tell students about your experience, teaching style and expertise..."
                    onChange={(event) =>
                      updateField("bio", event.target.value)
                    }
                    className="mt-2 block w-full resize-y rounded-xl border border-slate-300 bg-white p-4 text-sm font-bold leading-6 text-black caret-emerald-700 outline-none placeholder:font-normal placeholder:text-slate-500 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50 disabled:text-black disabled:opacity-100"
                  />
                </label>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="code" size={21} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Technical Skills
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Highlight the subjects and technologies you teach.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800"
                  >
                    {skill}

                    {editing && (
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        aria-label={`Remove ${skill}`}
                        className="rounded-full text-emerald-700 transition hover:text-red-600"
                      >
                        <Icon name="close" size={14} />
                      </button>
                    )}
                  </span>
                ))}

                {profile.skills.length === 0 && (
                  <p className="text-sm text-slate-500">
                    No skills added yet.
                  </p>
                )}
              </div>

              {editing && (
                <div className="mt-5">
                  <label className={labelStyle}>
                    Add a skill
                    <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                      <input
                        type="text"
                        value={newSkill}
                        onChange={(event) => setNewSkill(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") {
                            event.preventDefault();
                            addSkill();
                          }
                        }}
                        placeholder="e.g. React, Python, Machine Learning"
                        className={`${inputStyle} mt-0`}
                      />

                      <button
                        type="button"
                        onClick={addSkill}
                        className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-emerald-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
                      >
                        <Icon name="plus" size={16} />
                        Add Skill
                      </button>
                    </div>
                  </label>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {DEFAULT_SKILLS.filter(
                      (skill) =>
                        !profile.skills.some(
                          (existing) =>
                            existing.toLowerCase() === skill.toLowerCase()
                        )
                    ).map((skill) => (
                      <button
                        key={skill}
                        type="button"
                        onClick={() => {
                          setProfile((current) => ({
                            ...current,
                            skills: [...current.skills, skill],
                          }));
                          setError("");
                        }}
                        className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-800"
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="mb-6 flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700">
                  <Icon name="globe" size={21} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    Professional Links
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Let students and recruiters explore your work.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <ProfileLink
                  icon="globe"
                  label="Personal Website"
                  value={profile.website}
                  editing={editing}
                  onChange={(value) => updateField("website", value)}
                  placeholder="https://yourwebsite.com"
                />

                <ProfileLink
                  icon="briefcase"
                  label="LinkedIn"
                  value={profile.linkedin}
                  editing={editing}
                  onChange={(value) => updateField("linkedin", value)}
                  placeholder="https://linkedin.com/in/yourname"
                />

                <ProfileLink
                  icon="code"
                  label="GitHub"
                  value={profile.github}
                  editing={editing}
                  onChange={(value) => updateField("github", value)}
                  placeholder="https://github.com/yourname"
                />
              </div>
            </section>

            {editing && (
              <div className="flex flex-wrap justify-end gap-3 pb-4">
                <button
                  type="button"
                  onClick={cancelEditing}
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 rounded-xl bg-emerald-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-800"
                >
                  <Icon name="save" size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </main>
  );
}
