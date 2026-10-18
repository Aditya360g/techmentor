
import { useState } from "react";
import {
  Bell,
  Mail,
  Save,
  ShieldCheck,
  Settings2,
  CheckCircle2,
  ChevronRight,
  Sparkles,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    classReminder: true,
    assignmentReminder: true,
    testReminder: true,
    emailNotifications: true,
    profileVisible: true,
  });

  const [saved, setSaved] = useState(false);

  const toggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
    setSaved(false);
  };

  const save = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const groups = [
    {
      title: "Learning Notifications",
      description: "Stay updated with your learning activities.",
      items: [
        {
          key: "classReminder",
          title: "Class reminders",
          description: "Get notified before your live classes begin.",
          icon: Bell,
          iconBg: "bg-violet-50",
          iconColor: "text-violet-600",
        },
        {
          key: "assignmentReminder",
          title: "Assignment deadlines",
          description: "Receive reminders about upcoming submissions.",
          icon: CheckCircle2,
          iconBg: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          key: "testReminder",
          title: "Test notifications",
          description: "Stay informed about scheduled tests and exams.",
          icon: Settings2,
          iconBg: "bg-amber-50",
          iconColor: "text-amber-600",
        },
      ],
    },
    {
      title: "Communication & Privacy",
      description: "Manage how you receive updates and share your profile.",
      items: [
        {
          key: "emailNotifications",
          title: "Email notifications",
          description: "Receive important announcements and course updates.",
          icon: Mail,
          iconBg: "bg-emerald-50",
          iconColor: "text-emerald-600",
        },
        {
          key: "profileVisible",
          title: "Profile visibility",
          description: "Allow trainers to view your learning profile.",
          icon: ShieldCheck,
          iconBg: "bg-pink-50",
          iconColor: "text-pink-600",
        },
      ],
    },
  ];

  const enabledCount = Object.values(settings).filter(Boolean).length;

  return (
    <main className="mx-auto w-full max-w-5xl min-w-0 space-y-6 pb-8 text-slate-900">
      {/* Page heading */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-600">
            <Settings2 size={16} />
            <span>Account preferences</span>
          </div>



          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
            Personalize your learning experience and manage your preferences.
          </p>
        </div>

        <div className="flex w-fit items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
            <Sparkles size={19} />
          </div>
          <div>
            <p className="text-xs font-medium text-slate-500">
              Active preferences
            </p>
            <p className="text-lg font-bold text-slate-900">
              {enabledCount}
              <span className="ml-1 text-sm font-medium text-slate-400">
                / {Object.keys(settings).length}
              </span>
            </p>
          </div>
        </div>
      </header>

      {/* Success message */}
      {saved && (
        <div
          role="status"
          className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800"
        >
          <CheckCircle2 size={20} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-semibold">Preferences updated</p>
            <p className="mt-1 text-xs text-emerald-700">
              Your current settings have been confirmed for this session.
            </p>
          </div>
        </div>
      )}

      {/* Settings groups */}
      {groups.map((group) => (
        <section
          key={group.title}
          className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"
        >
          <div className="border-b border-slate-100 px-4 py-5 sm:px-6">
            <h2 className="text-base font-bold text-slate-950 sm:text-lg">
              {group.title}
            </h2>
            <p className="mt-1 text-sm leading-5 text-slate-500">
              {group.description}
            </p>
          </div>

          <div className="divide-y divide-slate-100">
            {group.items.map((item) => {
              const Icon = item.icon;
              const enabled = settings[item.key];

              return (
                <div
                  key={item.key}
                  className="flex min-w-0 items-center gap-3 px-4 py-5 transition-colors hover:bg-slate-50/70 sm:gap-4 sm:px-6"
                >
                  <div
                    className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${item.iconBg} ${item.iconColor}`}
                  >
                    <Icon size={19} strokeWidth={1.9} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold text-slate-900 sm:text-[15px]">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 sm:text-sm">
                      {item.description}
                    </p>
                  </div>

                  {/* Properly contained toggle */}
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={item.title}
                    onClick={() => toggle(item.key)}
                    className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full p-1 outline-none transition-colors duration-200 focus-visible:ring-4 focus-visible:ring-violet-100 ${enabled ? "bg-violet-600" : "bg-slate-300"
                      }`}
                  >
                    <span
                      className={`block h-5 w-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${enabled ? "translate-x-5" : "translate-x-0"
                        }`}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      {/* Bottom action bar */}
      <div className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/95 p-4 shadow-lg shadow-slate-200/50 backdrop-blur sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            Your preferences
          </p>
          <p className="mt-1 text-xs leading-5 text-slate-500">
            Review your choices before saving.
          </p>
        </div>

        <button
          type="button"
          onClick={save}
          className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-violet-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 active:scale-[0.98] sm:w-auto"
        >
          {saved ? <CheckCircle2 size={17} /> : <Save size={17} />}
          {saved ? "Saved" : "Save settings"}
          {!saved && <ChevronRight size={16} />}
        </button>
      </div>

      <p className="px-1 text-xs leading-5 text-slate-400">
        Note: These preferences currently use local component state. Connect
        your backend to persist them across sessions.
      </p>
    </main>
  );
}
