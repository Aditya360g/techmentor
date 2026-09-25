import { useState } from "react";
import {
  Bell,
  Mail,
  Save,
  ShieldCheck,
} from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] =
    useState({
      classReminder: true,
      assignmentReminder: true,
      testReminder: true,
      emailNotifications: true,
      profileVisible: true,
    });

  const [saved, setSaved] =
    useState(false);

  const toggle = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const save = () => {
    setSaved(true);

    setTimeout(() => {
      setSaved(false);
    }, 1800);
  };

  const rows = [
    {
      key: "classReminder",
      title: "Class Reminders",
      text:
        "Notify me before live classes.",
      icon: Bell,
    },
    {
      key: "assignmentReminder",
      title: "Assignment Reminders",
      text:
        "Remind me about deadlines.",
      icon: Bell,
    },
    {
      key: "testReminder",
      title: "Test Reminders",
      text:
        "Notify me about scheduled tests.",
      icon: Bell,
    },
    {
      key: "emailNotifications",
      title: "Email Notifications",
      text:
        "Send important updates by email.",
      icon: Mail,
    },
    {
      key: "profileVisible",
      title: "Profile Visibility",
      text:
        "Allow trainers to view my learning profile.",
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-7">

      <div>
        <h2 className="text-2xl font-bold">
          Settings
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Control student portal preferences.
        </p>
      </div>


      {saved && (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          Settings saved successfully.
        </div>
      )}


      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        <div className="divide-y divide-slate-100">

          {rows.map(
            ({
              key,
              title,
              text,
              icon: Icon,
            }) => (
              <div
                key={key}
                className="flex items-center justify-between gap-5 p-5"
              >

                <div className="flex items-center gap-4">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
                    <Icon size={18} />
                  </div>

                  <div>
                    <p className="font-semibold text-slate-900">
                      {title}
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                      {text}
                    </p>
                  </div>

                </div>


                <button
                  type="button"
                  onClick={() =>
                    toggle(key)
                  }
                  className={`relative h-7 w-14 shrink-0 rounded-full transition-colors ${
                    settings[key]
                      ? "bg-violet-600"
                      : "bg-slate-300"
                  }`}
                >
                  <span
                    className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                      settings[key]
                        ? "translate-x-8"
                        : "translate-x-1"
                    }`}
                  />
                </button>

              </div>
            )
          )}

        </div>

      </section>


      <button
        type="button"
        onClick={save}
        className="flex items-center gap-2 rounded-xl bg-violet-600 px-6 py-3 text-sm font-semibold text-white hover:bg-violet-500"
      >
        <Save size={16} />
        Save Settings
      </button>

    </div>
  );
}
