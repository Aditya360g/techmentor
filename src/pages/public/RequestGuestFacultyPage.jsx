import { useState } from "react";
import { motion } from "motion/react";

import {
  Building2,
  CheckCircle2,
  Clock3,
  GraduationCap,
  Send,
  Users,
} from "lucide-react";

const initialForm = {
  institution: "",
  contactPerson: "",
  email: "",
  phone: "",
  technology: "Java + DSA",
  students: "60",
  duration: "8 Weeks",
  mode: "On Campus",
  location: "",
  experience: "3+ Years",
  notes: "",
};

export default function RequestGuestFacultyPage() {
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const submitForm = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 3500);
  };

  return (
    <main className="min-h-screen bg-[#08070f] pb-24 pt-36 text-white">

      <section className="mx-auto max-w-7xl px-6">

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Trainer Requirement
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Request Coding

            <span className="text-violet-400">
              {" "}Guest Faculty
            </span>
          </h1>

          <p className="mt-6 leading-8 text-slate-400">
            Share your institution's requirement and define the technology,
            student count, duration, mode and trainer experience you need.
          </p>
        </motion.div>


        <div className="mt-16 grid gap-8 lg:grid-cols-[0.65fr_1.35fr]">

          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >

            {[
              {
                icon: Building2,
                title: "Institution Requirement",
                text:
                  "Tell us the college or university details.",
              },
              {
                icon: GraduationCap,
                title: "Technology",
                text:
                  "Choose the technical skills and program required.",
              },
              {
                icon: Users,
                title: "Student Batch",
                text:
                  "Share the approximate number of students.",
              },
              {
                icon: Clock3,
                title: "Engagement",
                text:
                  "Choose duration, mode and preferred experience.",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
              >
                <Icon className="text-violet-400" />

                <h3 className="mt-4 font-semibold">
                  {title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  {text}
                </p>
              </article>
            ))}

          </motion.aside>


          <motion.form
            initial={{ opacity: 0, x: 18 }}
            animate={{ opacity: 1, x: 0 }}
            onSubmit={submitForm}
            className="rounded-[30px] border border-white/[0.08] bg-white/[0.03] p-6 md:p-8"
          >

            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 flex items-center gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-4 text-sm text-emerald-400"
              >
                <CheckCircle2 size={18} />

                Requirement submitted successfully. It is currently stored
                only in frontend state.
              </motion.div>
            )}


            <div className="grid gap-5 md:grid-cols-2">

              {[
                ["institution", "Institution Name", "text"],
                ["contactPerson", "Contact Person", "text"],
                ["email", "Email", "email"],
                ["phone", "Phone", "text"],
              ].map(([field, label, type]) => (
                <label key={field}>
                  <span className="text-xs text-slate-500">
                    {label}
                  </span>

                  <input
                    required
                    type={type}
                    value={form[field]}
                    onChange={(event) =>
                      updateField(
                        field,
                        event.target.value
                      )
                    }
                    className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none focus:border-violet-500/40"
                  />
                </label>
              ))}


              <label>
                <span className="text-xs text-slate-500">
                  Technology
                </span>

                <select
                  value={form.technology}
                  onChange={(event) =>
                    updateField(
                      "technology",
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
                >
                  <option>Java + DSA</option>
                  <option>Python</option>
                  <option>Full Stack Development</option>
                  <option>AI / ML</option>
                  <option>Data Science</option>
                  <option>C / C++ DSA</option>
                  <option>Spring Boot</option>
                  <option>React</option>
                </select>
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Students
                </span>

                <input
                  type="number"
                  min="1"
                  value={form.students}
                  onChange={(event) =>
                    updateField(
                      "students",
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
                />
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Duration
                </span>

                <select
                  value={form.duration}
                  onChange={(event) =>
                    updateField(
                      "duration",
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
                >
                  <option>2 Weeks</option>
                  <option>4 Weeks</option>
                  <option>8 Weeks</option>
                  <option>4 Months</option>
                  <option>Semester</option>
                </select>
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Training Mode
                </span>

                <select
                  value={form.mode}
                  onChange={(event) =>
                    updateField(
                      "mode",
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
                >
                  <option>On Campus</option>
                  <option>Online</option>
                  <option>Hybrid</option>
                </select>
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Location
                </span>

                <input
                  required
                  value={form.location}
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value
                    )
                  }
                  placeholder="City / State"
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none"
                />
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Trainer Experience
                </span>

                <select
                  value={form.experience}
                  onChange={(event) =>
                    updateField(
                      "experience",
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
                >
                  <option>1+ Years</option>
                  <option>3+ Years</option>
                  <option>5+ Years</option>
                  <option>8+ Years</option>
                </select>
              </label>


              <label className="md:col-span-2">
                <span className="text-xs text-slate-500">
                  Additional Requirement
                </span>

                <textarea
                  rows="5"
                  value={form.notes}
                  onChange={(event) =>
                    updateField(
                      "notes",
                      event.target.value
                    )
                  }
                  placeholder="Syllabus, preferred dates, lab requirements, placement focus..."
                  className="mt-2 w-full resize-none rounded-xl border border-white/[0.08] bg-[#11101a] p-4 text-sm outline-none focus:border-violet-500/40"
                />
              </label>

            </div>


            <button
              type="submit"
              className="mt-6 flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold hover:bg-violet-500"
            >
              <Send size={17} />
              Submit Requirement
            </button>

          </motion.form>

        </div>

      </section>

    </main>
  );
}
