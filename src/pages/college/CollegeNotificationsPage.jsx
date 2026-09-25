import { useState } from "react";
import { motion } from "motion/react";

import {
  Bell,
  CalendarDays,
  CheckCheck,
  CreditCard,
  UserRoundCheck,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "trainer",
    title: "Trainer Shortlisted",
    message:
      "Aman Sharma has been shortlisted for your Java + DSA requirement.",
    time: "10 min ago",
    read: false,
  },
  {
    id: 2,
    type: "demo",
    title: "Demo Scheduled",
    message:
      "Your trainer demo has been scheduled for 26 Sep at 10:30 AM.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "payment",
    title: "Invoice Generated",
    message:
      "Invoice INV-2026-201 is now available in Payments.",
    time: "Yesterday",
    read: true,
  },
  {
    id: 4,
    type: "trainer",
    title: "Trainer Assigned",
    message:
      "Priya Verma has been assigned to your Python training program.",
    time: "2 days ago",
    read: true,
  },
];

const iconMap = {
  trainer: UserRoundCheck,
  demo: CalendarDays,
  payment: CreditCard,
};

export default function CollegeNotificationsPage() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const unread =
    notifications.filter((item) => !item.read).length;

  const markRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              read: true,
            }
          : item
      )
    );
  };

  const markAll = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >

        <div>
          <h2 className="text-2xl font-bold">
            Notifications
          </h2>

          <p className="mt-2 text-sm text-slate-500">
            {unread} unread notification{unread !== 1 ? "s" : ""}
          </p>
        </div>


        <button
          type="button"
          onClick={markAll}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white"
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>

      </motion.div>


      <div className="space-y-3">

        {notifications.map((notification, index) => {
          const Icon =
            iconMap[notification.type] || Bell;

          return (
            <motion.button
              key={notification.id}
              type="button"
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() =>
                markRead(notification.id)
              }
              className={`flex w-full items-start gap-4 rounded-2xl border p-5 text-left transition-colors ${
                notification.read
                  ? "border-white/[0.06] bg-white/[0.02]"
                  : "border-violet-500/20 bg-violet-500/[0.05]"
              }`}
            >

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                <Icon size={19} />
              </div>

              <div className="min-w-0 flex-1">

                <div className="flex items-start justify-between gap-4">

                  <div>
                    <h3 className="font-semibold">
                      {notification.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-slate-500">
                      {notification.message}
                    </p>
                  </div>

                  {!notification.read && (
                    <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,0.8)]" />
                  )}

                </div>

                <p className="mt-3 text-xs text-slate-700">
                  {notification.time}
                </p>

              </div>

            </motion.button>
          );
        })}

      </div>

    </div>
  );
}
