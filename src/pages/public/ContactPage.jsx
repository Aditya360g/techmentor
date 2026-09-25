import { useState } from "react";
import { motion } from "motion/react";

import {
  Building2,
  CheckCircle2,
  Mail,
  MapPin,
  MessageSquareText,
  Phone,
  Send,
} from "lucide-react";

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    name: "",
    institution: "",
    email: "",
    phone: "",
    subject: "Guest Faculty Requirement",
    message: "",
  });

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setForm({
      name: "",
      institution: "",
      email: "",
      phone: "",
      subject: "Guest Faculty Requirement",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 3000);
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
            Contact Us
          </p>

          <h1 className="mt-4 text-4xl font-bold md:text-6xl">
            Let's Discuss Your

            <span className="text-violet-400">
              {" "}Training Requirement
            </span>
          </h1>

          <p className="mt-6 leading-8 text-slate-400">
            Share your college, university or training requirement and our
            team can help identify suitable technical trainers.
          </p>
        </motion.div>


        <div className="mt-16 grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">

          <motion.aside
            initial={{ opacity: 0, x: -18 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-4"
          >

            {[
              {
                icon: Phone,
                title: "Call Us",
                text: "Official phone number will be added",
              },
              {
                icon: Mail,
                title: "Email Us",
                text: "Official email address will be added",
              },
              {
                icon: MapPin,
                title: "Service Area",
                text: "On-campus and online training engagements",
              },
              {
                icon: Building2,
                title: "Institutions",
                text: "Colleges, universities and technical institutes",
              },
            ].map(({ icon: Icon, title, text }) => (
              <article
                key={title}
                className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 transition-colors hover:border-violet-500/30"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={19} />
                </div>

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
            onSubmit={handleSubmit}
            className="rounded-[30px] border border-white/[0.08] bg-white/[0.03] p-6 md:p-8"
          >

            <div className="flex items-center gap-3">

              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <MessageSquareText size={20} />
              </div>

              <div>
                <h2 className="font-semibold">
                  Send a Message
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  Tell us what you need.
                </p>
              </div>

            </div>


            {submitted && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
              >
                <CheckCircle2 size={17} />
                Message submitted successfully.
              </motion.div>
            )}


            <div className="mt-7 grid gap-5 md:grid-cols-2">

              <label>
                <span className="text-xs text-slate-500">
                  Your Name
                </span>

                <input
                  required
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none focus:border-violet-500/40"
                />
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Institution
                </span>

                <input
                  required
                  value={form.institution}
                  onChange={(event) =>
                    updateField(
                      "institution",
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none focus:border-violet-500/40"
                />
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Email
                </span>

                <input
                  required
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    updateField("email", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none focus:border-violet-500/40"
                />
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Phone
                </span>

                <input
                  value={form.phone}
                  onChange={(event) =>
                    updateField("phone", event.target.value)
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none focus:border-violet-500/40"
                />
              </label>


              <label className="md:col-span-2">
                <span className="text-xs text-slate-500">
                  Subject
                </span>

                <select
                  value={form.subject}
                  onChange={(event) =>
                    updateField(
                      "subject",
                      event.target.value
                    )
                  }
                  className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm outline-none"
                >
                  <option>Guest Faculty Requirement</option>
                  <option>Semester Training</option>
                  <option>Placement Training</option>
                  <option>Technical Workshop</option>
                  <option>Trainer Partnership</option>
                  <option>General Query</option>
                </select>
              </label>


              <label className="md:col-span-2">
                <span className="text-xs text-slate-500">
                  Message
                </span>

                <textarea
                  required
                  rows="6"
                  value={form.message}
                  onChange={(event) =>
                    updateField(
                      "message",
                      event.target.value
                    )
                  }
                  className="mt-2 w-full resize-none rounded-xl border border-white/[0.08] bg-[#11101a] p-4 text-sm outline-none focus:border-violet-500/40"
                />
              </label>

            </div>


            <button
              type="submit"
              className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 text-sm font-semibold transition-colors hover:bg-violet-500"
            >
              <Send size={17} />
              Send Message
            </button>

          </motion.form>

        </div>

      </section>

    </main>
  );
}
