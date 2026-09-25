import { useState } from "react";

import {
  ArrowLeft,
  CheckCircle2,
  Upload,
} from "lucide-react";

import {
  Link,
  useParams,
} from "react-router";

import { assignments } from "../../data/student/assignmentsData";

export default function AssignmentDetailsPage() {
  const { assignmentId } = useParams();

  const assignment =
    assignments.find(
      (item) => item.id === assignmentId
    ) || assignments[0];

  const [answer, setAnswer] = useState("");
  const [submitted, setSubmitted] =
    useState(
      assignment.status === "Submitted"
    );

  const submit = () => {
    if (!answer.trim() && !submitted) {
      return;
    }

    setSubmitted(true);
  };

  return (
    <div className="space-y-7">

      <Link
        to="/student/assignments"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600"
      >
        <ArrowLeft size={16} />
        Back to Assignments
      </Link>


      <div className="grid gap-6 xl:grid-cols-[1fr_0.4fr]">

        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <div className="flex flex-wrap items-start justify-between gap-3">

            <div>
              <span className="text-sm font-medium text-violet-600">
                {assignment.course}
              </span>

              <h2 className="mt-2 text-2xl font-bold">
                {assignment.title}
              </h2>
            </div>

            <span className="rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
              {assignment.marks} Marks
            </span>

          </div>


          <p className="mt-6 leading-7 text-slate-600">
            {assignment.description}
          </p>


          <h3 className="mt-7 font-bold">
            Instructions
          </h3>

          <div className="mt-4 space-y-3">

            {assignment.instructions.map(
              (item) => (
                <div
                  key={item}
                  className="flex gap-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-600"
                >
                  <CheckCircle2
                    size={17}
                    className="shrink-0 text-violet-600"
                  />

                  {item}
                </div>
              )
            )}

          </div>

        </section>


        <aside className="h-fit rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="font-bold">
            Your Submission
          </h3>

          <p className="mt-2 text-xs text-slate-400">
            Due {assignment.dueDate}
          </p>


          {submitted ? (
            <div className="mt-6 rounded-xl bg-emerald-50 p-5 text-center text-emerald-700">

              <CheckCircle2
                size={28}
                className="mx-auto"
              />

              <p className="mt-3 font-semibold">
                Assignment Submitted
              </p>

              {assignment.score && (
                <p className="mt-2 text-sm">
                  Score: {assignment.score}/{assignment.marks}
                </p>
              )}

            </div>
          ) : (
            <>
              <textarea
                value={answer}
                onChange={(event) =>
                  setAnswer(event.target.value)
                }
                rows="7"
                placeholder="Add GitHub link, answer or submission notes..."
                className="mt-5 w-full resize-none rounded-xl border border-slate-200 p-4 text-sm outline-none focus:border-violet-400"
              />


              <button
                type="button"
                onClick={submit}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3 text-sm font-semibold text-white hover:bg-violet-500"
              >
                <Upload size={16} />
                Submit Assignment
              </button>
            </>
          )}

        </aside>

      </div>

    </div>
  );
}
