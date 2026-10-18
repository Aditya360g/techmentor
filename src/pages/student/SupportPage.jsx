
import { useEffect, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import {
  CheckCircle2,
  Headphones,
  Send,
  ChevronDown,
  MessageSquareText,
  CircleHelp,
  ShieldCheck,
  Clock3,
  TicketCheck,
} from "lucide-react";

const categories = [
  "Course Support",
  "Assignment Issue",
  "Test Platform",
  "Account Issue",
  "Certificate",
];

const initialForm = {
  category: "Course Support",
  subject: "",
  message: "",
};

const blackTextStyle = {
  color: "#000000",
  WebkitTextFillColor: "#000000",
  caretColor: "#000000",
  colorScheme: "light",
};

export default function SupportPage() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!submitted) return;

    const timer = window.setTimeout(() => setSubmitted(false), 4000);
    return () => window.clearTimeout(timer);
  }, [submitted]);

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setError("");
    setSubmitted(false);
  };

  const submit = (event) => {
    event.preventDefault();

    if (!form.subject.trim() || !form.message.trim()) {
      setError("Please complete the subject and message fields.");
      return;
    }

    setSubmitted(true);
    setError("");
    setForm({ ...initialForm });
  };

  const fieldClass =
    "mt-2.5 h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm !text-black outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100";

  return (
    <div className="mx-auto min-w-0 max-w-5xl space-y-6 pb-8">
      {/* Page heading */}
      <motion.div
        initial={reduceMotion ? false : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-violet-600">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-600" />
            Help Center
          </div>



          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Tell us what you need help with. Share the details and we'll help
            you find the right solution.
          </p>
        </div>

        <div className="flex w-fit items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3.5 py-2.5">
          <span className="relative flex h-2.5 w-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-40" />
            <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
          </span>
          <span className="text-xs font-semibold text-emerald-800">
            Support available
          </span>
        </div>
      </motion.div>

      {/* Success message */}
      {submitted && (
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 rounded-2xl border border-emerald-200 bg-emerald-50 p-4"
          role="status"
          aria-live="polite"
        >
          <CheckCircle2
            size={21}
            className="mt-0.5 shrink-0 text-emerald-600"
          />
          <div>
            <p className="text-sm font-semibold text-emerald-900">
              Form submitted successfully
            </p>
            <p className="mt-1 text-sm text-emerald-800">
              Your form was accepted in this page. Connect a backend or ticket
              service to create and track a real support ticket.
            </p>
          </div>
        </motion.div>
      )}

      <div className="grid min-w-0 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_280px]">
        {/* Support form */}
        <motion.section
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 bg-gradient-to-r from-violet-50/80 to-white px-5 py-5 sm:px-7">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-600 text-white shadow-sm shadow-violet-200">
                <Headphones size={21} />
              </div>

              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Create a support request
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Fields marked with * are required
                </p>
              </div>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-5 p-5 sm:p-7">
            {/* Category dropdown */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Category <span className="text-rose-500">*</span>
              </span>

              <div className="relative">
                <select
                  required
                  value={form.category}
                  onChange={(event) =>
                    updateField("category", event.target.value)
                  }
                  style={blackTextStyle}
                  className={`${fieldClass} cursor-pointer appearance-none pr-11`}
                >
                  {categories.map((category) => (
                    <option
                      key={category}
                      value={category}
                      style={{
                        color: "#000000",
                        backgroundColor: "#ffffff",
                      }}
                    >
                      {category}
                    </option>
                  ))}
                </select>

                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                />
              </div>

              <span className="mt-1.5 block text-xs text-slate-500">
                Select the area where you need assistance.
              </span>
            </label>

            {/* Subject */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Subject <span className="text-rose-500">*</span>
              </span>

              <input
                required
                type="text"
                maxLength={120}
                value={form.subject}
                onChange={(event) =>
                  updateField("subject", event.target.value)
                }
                placeholder="Briefly describe your issue"
                style={blackTextStyle}
                className={fieldClass}
              />

              <span className="mt-1.5 block text-right text-xs text-slate-400">
                {form.subject.length}/120
              </span>
            </label>

            {/* Message */}
            <label className="block">
              <span className="text-sm font-semibold text-slate-700">
                Message <span className="text-rose-500">*</span>
              </span>

              <textarea
                required
                rows={6}
                maxLength={2000}
                value={form.message}
                onChange={(event) =>
                  updateField("message", event.target.value)
                }
                placeholder="Explain the issue you're facing. Include relevant details so we can understand it better."
                style={blackTextStyle}
                className="mt-2.5 min-h-36 w-full resize-y rounded-xl border border-slate-200 bg-white p-4 text-sm !text-black outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
              />

              <span className="mt-1.5 block text-right text-xs text-slate-400">
                {form.message.length}/2000
              </span>
            </label>

            {error && (
              <p className="rounded-lg bg-rose-50 px-3 py-2.5 text-sm font-medium text-rose-700">
                {error}
              </p>
            )}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs leading-5 text-slate-500">
                Please don't include passwords or sensitive account details.
              </p>

              <button
                type="submit"
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200 active:scale-[0.98]"
              >
                <Send size={16} />
                Submit Request
              </button>
            </div>
          </form>
        </motion.section>

        {/* Help sidebar */}
        <motion.aside
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, delay: 0.08 }}
          className="space-y-4"
        >
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
              <MessageSquareText size={20} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              How can we help?
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Choose the most relevant category and provide a clear description
              of your issue.
            </p>

            <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
              <div className="flex items-start gap-2.5">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                <p className="text-xs leading-5 text-slate-600">
                  Include any relevant error messages.
                </p>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCircle2
                  size={16}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                <p className="text-xs leading-5 text-slate-600">
                  Use a specific subject for your request.
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <Clock3 size={20} />
            </div>

            <h3 className="mt-4 text-sm font-bold text-slate-900">
              Response time
            </h3>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Response times depend on your support team's availability and
              the nature of the issue.
            </p>
          </div>

          <div className="rounded-2xl border border-violet-100 bg-violet-50/70 p-5">
            <div className="flex items-center gap-2">
              <ShieldCheck size={18} className="text-violet-700" />
              <h3 className="text-sm font-bold text-violet-950">
                Your information
              </h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-violet-800">
              Share only the information needed to explain your issue. Never
              send passwords or verification codes.
            </p>
          </div>

          <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <TicketCheck
              size={19}
              className="mt-0.5 shrink-0 text-slate-500"
            />
            <p className="text-xs leading-5 text-slate-600">
              Ticket tracking will be available once a backend ticket system
              is connected.
            </p>
          </div>

          <div className="flex items-start gap-2 px-1 text-xs leading-5 text-slate-500">
            <CircleHelp size={15} className="mt-0.5 shrink-0" />
            <p>Having trouble? Double-check the category and required fields.</p>
          </div>
        </motion.aside>
      </div>
    </div>
  );
}
