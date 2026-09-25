import { useState } from "react";
import { motion } from "motion/react";

import {
  Bell,
  Building2,
  CalendarDays,
  CheckCheck,
  CreditCard,
  UserRoundCheck,
} from "lucide-react";

const initialNotifications = [
  {
    id: 1,
    type: "request",
    title: "New Trainer Request",
    message:
      "RKGIT submitted a requirement for Java + DSA guest faculty.",
    time: "10 min ago",
    read: false,
  },
  {
    id: 2,
    type: "demo",
    title: "Demo Scheduled",
    message:
      "Demo with Aman Sharma has been scheduled for tomorrow at 10:30 AM.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 3,
    type: "assignment",
    title: "Trainer Assigned",
    message:
      "Priya Verma has been assigned to XYZ College.",
    time: "3 hours ago",
    read: true,
  },
  {
    id: 4,
    type: "payment",
    title: "Payment Received",
    message:
      "Payment INV-2026-094 has been marked as received.",
    time: "Yesterday",
    read: true,
  },
];

const iconMap = {
  request: Building2,
  demo: CalendarDays,
  assignment: UserRoundCheck,
  payment: CreditCard,
};

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const markRead = (id) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === id
          ? { ...item, read: true }
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

  const unreadCount =
    notifications.filter((item) => !item.read).length;

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >

        <div>
          

          

          
        </div>


        <button
          type="button"
          onClick={markAll}
          className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3 text-sm text-slate-400 transition-colors hover:text-white"
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
              type="button"
              key={notification.id}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.04 }}
              onClick={() => markRead(notification.id)}
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
                    <p className="font-semibold">
                      {notification.title}
                    </p>

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

