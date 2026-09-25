import { useState } from "react";
import { CheckCheck } from "lucide-react";

import { notifications as initialNotifications } from "../../data/student/studentData";

import NotificationCard from "../../components/student/NotificationCard";

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState(initialNotifications);

  const unread =
    notifications.filter(
      (item) => !item.read
    ).length;

  const readOne = (id) => {
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

  const readAll = () => {
    setNotifications((current) =>
      current.map((item) => ({
        ...item,
        read: true,
      }))
    );
  };

  return (
    <div className="space-y-7">

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

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
          onClick={readAll}
          className="flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-600"
        >
          <CheckCheck size={17} />
          Mark all as read
        </button>

      </div>


      <div className="space-y-3">

        {notifications.map((item) => (
          <NotificationCard
            key={item.id}
            item={item}
            onRead={readOne}
          />
        ))}

      </div>

    </div>
  );
}
