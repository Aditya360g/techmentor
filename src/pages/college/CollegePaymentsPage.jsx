import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  CheckCircle2,
  CreditCard,
  Download,
  Search,
} from "lucide-react";

const initialPayments = [
  {
    id: "INV-2026-201",
    program: "Java + DSA",
    amount: 85000,
    dueDate: "30 Sep 2026",
    status: "Pending",
  },
  {
    id: "INV-2026-184",
    program: "Python Training",
    amount: 62000,
    dueDate: "18 Sep 2026",
    status: "Paid",
  },
  {
    id: "INV-2026-162",
    program: "Full Stack Workshop",
    amount: 45000,
    dueDate: "02 Sep 2026",
    status: "Paid",
  },
];

const statusStyles = {
  Paid: "bg-emerald-500/10 text-emerald-400",
  Pending: "bg-amber-500/10 text-amber-400",
  Overdue: "bg-red-500/10 text-red-400",
};

export default function CollegePaymentsPage() {
  const [payments, setPayments] =
    useState(initialPayments);

  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("All");

  const formatMoney = (value) =>
    new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    }).format(value);

  const filtered = useMemo(() => {
    return payments.filter((payment) => {
      const searchMatch =
        payment.id
          .toLowerCase()
          .includes(query.toLowerCase()) ||
        payment.program
          .toLowerCase()
          .includes(query.toLowerCase());

      const statusMatch =
        status === "All" ||
        payment.status === status;

      return searchMatch && statusMatch;
    });
  }, [payments, query, status]);

  const payInvoice = (id) => {
    setPayments((current) =>
      current.map((payment) =>
        payment.id === id
          ? {
              ...payment,
              status: "Paid",
            }
          : payment
      )
    );
  };

  const totalPaid = payments
    .filter((payment) => payment.status === "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  const totalPending = payments
    .filter((payment) => payment.status !== "Paid")
    .reduce((sum, payment) => sum + payment.amount, 0);

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">
          Payments & Invoices
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          View invoices and track payment status.
        </p>
      </motion.div>


      <div className="grid gap-4 sm:grid-cols-2">

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="text-xs text-slate-600">
            Total Paid
          </p>

          <p className="mt-3 text-2xl font-bold text-emerald-400">
            {formatMoney(totalPaid)}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="text-xs text-slate-600">
            Pending Amount
          </p>

          <p className="mt-3 text-2xl font-bold text-amber-400">
            {formatMoney(totalPending)}
          </p>
        </div>

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
            placeholder="Search invoice or program..."
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


      <div className="space-y-4">

        {filtered.map((payment, index) => (
          <motion.article
            key={payment.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
          >

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <div className="flex items-center gap-3">

                  <CreditCard
                    size={18}
                    className="text-violet-400"
                  />

                  <span className="text-xs text-slate-600">
                    {payment.id}
                  </span>

                </div>

                <h3 className="mt-3 font-semibold">
                  {payment.program}
                </h3>

                <p className="mt-1 text-sm text-slate-500">
                  Due: {payment.dueDate}
                </p>
              </div>


              <div className="sm:text-right">

                <p className="text-xl font-bold">
                  {formatMoney(payment.amount)}
                </p>

                <span className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${statusStyles[payment.status]}`}>
                  {payment.status}
                </span>

              </div>

            </div>


            <div className="mt-5 flex flex-wrap gap-3 border-t border-white/[0.06] pt-5">

              <button
                type="button"
                className="flex items-center gap-2 rounded-xl border border-white/[0.08] px-4 py-3 text-sm text-slate-400 hover:bg-white/[0.04] hover:text-white"
              >
                <Download size={16} />
                Invoice
              </button>

              {payment.status !== "Paid" ? (
                <button
                  type="button"
                  onClick={() =>
                    payInvoice(payment.id)
                  }
                  className="rounded-xl bg-violet-600 px-5 py-3 text-sm font-semibold hover:bg-violet-500"
                >
                  Pay Now
                </button>
              ) : (
                <div className="flex items-center gap-2 rounded-xl bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
                  <CheckCircle2 size={16} />
                  Payment Complete
                </div>
              )}

            </div>

          </motion.article>
        ))}

      </div>

    </div>
  );
}
