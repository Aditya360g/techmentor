import { useState } from "react";

import {
  CheckCircle2,
  Headphones,
  Send,
} from "lucide-react";

export default function SupportPage() {
  const [submitted, setSubmitted] =
    useState(false);

  const [form, setForm] = useState({
    category: "Course Support",
    subject: "",
    message: "",
  });

  const submit = (event) => {
    event.preventDefault();

    setSubmitted(true);

    setForm({
      category: "Course Support",
      subject: "",
      message: "",
    });

    setTimeout(() => {
      setSubmitted(false);
    }, 2500);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          Student Support
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Need help with courses, tests or your account?
        </p>
      </div>


      {submitted && (
        <div className="flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={17} />
          Support ticket submitted successfully.
        </div>
      )}


      <form
        onSubmit={submit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
      >

        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Headphones size={22} />
        </div>


        <div className="mt-6 space-y-5">

          <label className="block">

            <span className="text-sm font-medium text-slate-600">
              Category
            </span>

            <select
              value={form.category}
              onChange={(event) =>
                setForm({
                  ...form,
                  category:
                    event.target.value,
                })
              }
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm"
            >
              <option>
                Course Support
              </option>

              <option>
                Assignment Issue
              </option>

              <option>
                Test Platform
              </option>

              <option>
                Account Issue
              </option>

              <option>
                Certificate
              </option>
            </select>

          </label>


          <label className="block">

            <span className="text-sm font-medium text-slate-600">
              Subject
            </span>

            <input
              required
              value={form.subject}
              onChange={(event) =>
                setForm({
                  ...form,
                  subject:
                    event.target.value,
                })
              }
              className="mt-2 h-12 w-full rounded-xl border border-slate-200 px-4 text-sm outline-none focus:border-violet-400"
            />

          </label>


          <label className="block">

            <span className="text-sm font-medium text-slate-600">
              Message
            </span>

            <textarea
              required
              rows="7"
              value={form.message}
              onChange={(event) =>
                setForm({
                  ...form,
                  message:
                    event.target.value,
                })
              }
              className="mt-2 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-violet-400"
            />

          </label>


          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-sm font-semibold text-white hover:bg-violet-500"
          >
            <Send size={17} />
            Submit Ticket
          </button>

        </div>

      </form>

    </div>
  );
}
