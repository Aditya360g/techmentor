import { Link } from "react-router";
import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";

export default function AssignmentCard({
  assignment,
}) {
  const styles = {
    Pending:
      "bg-amber-50 text-amber-600",
    "In Progress":
      "bg-blue-50 text-blue-600",
    Submitted:
      "bg-emerald-50 text-emerald-600",
  };

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">

      <div className="flex items-start justify-between gap-4">

        <div>
          <h3 className="font-bold text-slate-900">
            {assignment.title}
          </h3>

          <p className="mt-1 text-sm text-violet-600">
            {assignment.course}
          </p>
        </div>

        <span className={`rounded-full px-3 py-1 text-xs font-medium ${styles[assignment.status]}`}>
          {assignment.status}
        </span>

      </div>


      <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
        <CalendarDays size={15} />
        Due {assignment.dueDate}
      </div>

      <p className="mt-2 text-sm text-slate-500">
        Marks: {assignment.marks}
      </p>


      <Link
        to={`/student/assignments/${assignment.id}`}
        className="mt-5 flex items-center justify-center gap-2 rounded-xl bg-violet-50 py-3 text-sm font-semibold text-violet-700 hover:bg-violet-600 hover:text-white"
      >
        View Assignment
        <ArrowRight size={15} />
      </Link>

    </article>
  );
}
