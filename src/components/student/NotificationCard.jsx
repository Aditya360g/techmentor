import {
  Award,
  Bell,
  BookOpenCheck,
  FileCheck2,
} from "lucide-react";

const icons = {
  assignment: BookOpenCheck,
  class: Bell,
  result: FileCheck2,
  certificate: Award,
};

export default function NotificationCard({
  item,
  onRead,
}) {
  const Icon = icons[item.type] || Bell;

  return (
    <button
      type="button"
      onClick={() => onRead(item.id)}
      className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors ${
        item.read
          ? "border-slate-200 bg-white"
          : "border-violet-200 bg-violet-50/70"
      }`}
    >

      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-violet-600 shadow-sm">
        <Icon size={19} />
      </div>

      <div className="min-w-0 flex-1">

        <div className="flex items-start justify-between gap-3">

          <h3 className="font-bold text-slate-900">
            {item.title}
          </h3>

          {!item.read && (
            <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-violet-600" />
          )}

        </div>

        <p className="mt-2 text-sm leading-6 text-slate-500">
          {item.message}
        </p>

        <p className="mt-2 text-xs text-slate-400">
          {item.time}
        </p>

      </div>

    </button>
  );
}
