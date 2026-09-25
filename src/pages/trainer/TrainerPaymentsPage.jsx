import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  CheckCircle2,
  CreditCard,
  Download,
  Search,
  WalletCards,
} from "lucide-react";

const paymentData = [
  {
    id: "PAY-2026-101",
    college: "RKGIT",
    program: "Java + DSA",
    amount: 32000,
    date: "20 Sep 2026",
    status: "Paid",
  },
  {
    id: "PAY-2026-102",
    college: "XYZ College",
    program: "Spring Boot",
    amount: 38000,
    date: "30 Sep 2026",
    status: "Pending",
  },
  {
    id: "PAY-2026-088",
    college: "Global University",
    program: "Core Java",
    amount: 28000,
    date: "10 Sep 2026",
    status: "Paid",
  },
  {
    id: "PAY-2026-077",
    college: "Tech Institute",
    program: "DSA Workshop",
    amount: 18000,
    date: "28 Aug 2026",
    status: "Paid",
  },
];

const statusStyles = {
  Paid: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
};

export default function TrainerPaymentsPage() {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const payments = useMemo(() => {
    return paymentData.filter((payment) => {
      const matchesQuery =
        payment.college
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        payment.program
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        payment.id
          .toLowerCase()
          .includes(query.toLowerCase());

      const matchesStatus =
        status === "All" ||
        payment.status === status;

      return matchesQuery && matchesStatus;
    });
  }, [query, status]);

  const paid = paymentData
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pending = paymentData
    .filter((payment) => payment.status === "Pending")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">
          Payments
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Track trainer earnings and payment history.
        </p>
      </motion.div>


      <div className="grid gap-4 sm:grid-cols-3">

        <article className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <WalletCards className="text-emerald-400" />

          <p className="mt-4 text-xs text-slate-600">
            Total Received
          </p>

          <p className="mt-2 text-2xl font-bold">
            {formatMoney(paid)}
          </p>
        </article>


        <article className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <CreditCard className="text-amber-400" />

          <p className="mt-4 text-xs text-slate-600">
            Pending Payment
          </p>

          <p className="mt-2 text-2xl font-bold">
            {formatMoney(pending)}
          </p>
        </article>


        <article className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <CheckCircle2 className="text-violet-400" />

          <p className="mt-4 text-xs text-slate-600">
            Completed Payments
          </p>

          <p className="mt-2 text-2xl font-bold">
            {
              paymentData.filter(
                (payment) => payment.status === "Paid"
              ).length
            }
          </p>
        </article>

      </div>


      <div className="flex flex-col gap-3 sm:flex-row">

        <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4">
          <Search
            size={17}
            className="text-slate-600"
          />

          <input
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="Search payment, college or program..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>


        <select
          value={status}
          onChange={(event) =>
            setStatus(event.target.value)
          }
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300"
        >
          <option>All</option>
          <option>Paid</option>
          <option>Pending</option>
        </select>

      </div>


      <div className="overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.025]">

        <div className="overflow-x-auto">

          <table className="w-full min-w-[760px]">

            <thead>
              <tr className="text-left text-xs text-slate-600">
                <th className="px-5 py-4 font-medium">
                  Payment ID
                </th>

                <th className="px-5 py-4 font-medium">
                  College
                </th>

                <th className="px-5 py-4 font-medium">
                  Program
                </th>

                <th className="px-5 py-4 font-medium">
                  Amount
                </th>

                <th className="px-5 py-4 font-medium">
                  Date
                </th>

                <th className="px-5 py-4 font-medium">
                  Status
                </th>

                <th className="px-5 py-4 font-medium">
                  Receipt
                </th>
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

                  <td className="px-5 py-4">

                    <button
                      type="button"
                      disabled={payment.status !== "Paid"}
                      className="flex items-center gap-1.5 text-xs text-violet-400 disabled:text-slate-700"
                    >
                      <Download size={14} />
                      Download
                    </button>

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
