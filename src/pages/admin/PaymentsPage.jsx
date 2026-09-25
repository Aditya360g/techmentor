import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  CircleDollarSign,
  CreditCard,
  Search,
  TrendingUp,
} from "lucide-react";

const paymentData = [
  {
    id: "INV-2026-101",
    college: "RKGIT",
    program: "Java + DSA",
    amount: 85000,
    date: "22 Sep 2026",
    status: "Paid",
  },
  {
    id: "INV-2026-102",
    college: "XYZ College",
    program: "Python Training",
    amount: 62000,
    date: "21 Sep 2026",
    status: "Pending",
  },
  {
    id: "INV-2026-103",
    college: "Global University",
    program: "Full Stack",
    amount: 120000,
    date: "18 Sep 2026",
    status: "Paid",
  },
  {
    id: "INV-2026-104",
    college: "Tech Institute",
    program: "AI / ML Workshop",
    amount: 45000,
    date: "15 Sep 2026",
    status: "Overdue",
  },
];

const statusStyles = {
  Paid: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Overdue: "bg-red-500/10 text-red-400",
};

export default function PaymentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const payments = useMemo(() => {
    return paymentData.filter((payment) => {
      const matchesQuery =
        payment.id.toLowerCase().includes(query.toLowerCase()) ||
        payment.college.toLowerCase().includes(query.toLowerCase());

      const matchesStatus =
        status === "All" || payment.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const paidTotal = paymentData
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingTotal = paymentData
    .filter((payment) => payment.status !== "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        

        

        
      </motion.div>


      <div className="grid gap-4 sm:grid-cols-3">

        {[
          {
            label: "Collected",
            value: formatMoney(paidTotal),
            icon: CircleDollarSign,
          },
          {
            label: "Pending",
            value: formatMoney(pendingTotal),
            icon: CreditCard,
          },
          {
            label: "Collection Rate",
            value: "76%",
            icon: TrendingUp,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-600">
                    {item.label}
                  </p>

                  <p className="mt-3 text-2xl font-bold">
                    {item.value}
                  </p>
                </div>

                <Icon
                  size={21}
                  className="text-violet-400"
                />
              </div>
            </div>
          );
        })}

      </div>


      <div className="flex flex-col gap-3 sm:flex-row">

        <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4">
          <Search
            size={17}
            className="text-slate-600"
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search invoice or college..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>

        <select
          value={status}
          onChange={(event) => setStatus(event.target.value)}
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300 outline-none"
        >
          <option>All</option>
          <option>Paid</option>
          <option>Pending</option>
          <option>Overdue</option>
        </select>

      </div>


      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px]">

            <thead className="text-left text-xs text-slate-600">
              <tr>
                <th className="px-5 py-4 font-medium">Invoice</th>
                <th className="px-5 py-4 font-medium">College</th>
                <th className="px-5 py-4 font-medium">Program</th>
                <th className="px-5 py-4 font-medium">Amount</th>
                <th className="px-5 py-4 font-medium">Date</th>
                <th className="px-5 py-4 font-medium">Status</th>
              </tr>
            </thead>

            <tbody>
              {payments.map((payment) => (
                <tr
                  key={payment.id}
                  className="border-t border-white/[0.05] text-sm"
                >
                  <td className="px-5 py-4 font-medium">
                    {payment.id}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {payment.college}
                  </td>

                  <td className="px-5 py-4 text-slate-400">
                    {payment.program}
                  </td>

                  <td className="px-5 py-4 font-medium">
                    {formatMoney(payment.amount)}
                  </td>

                  <td className="px-5 py-4 text-slate-500">
                    {payment.date}
                  </td>

                  <td className="px-5 py-4">
                    <span className={`rounded-full px-3 py-1 text-xs ${statusStyles[payment.status]}`}>
                      {payment.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

