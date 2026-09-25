import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowLeft,
  Home,
  ShieldAlert,
} from "lucide-react";

export default function UnauthorizedPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-5 text-white">

      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-red-500/10 blur-3xl" />


      <motion.div
        initial={{
          opacity: 0,
          y: 18,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative w-full max-w-lg text-center"
      >

        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-red-500/20 bg-red-500/10 text-red-400">
          <ShieldAlert size={36} />
        </div>


        <p className="mt-8 text-sm font-bold uppercase tracking-[0.2em] text-red-400">
          Access Denied
        </p>

        <h1 className="mt-4 text-4xl font-bold">
          Unauthorized Access
        </h1>

        <p className="mx-auto mt-5 max-w-md leading-7 text-slate-500">
          You do not have permission to access this page. Login using an account with the correct role.
        </p>


        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/login"
            className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold hover:bg-violet-500"
          >
            <ArrowLeft size={17} />
            Login Again
          </Link>


          <Link
            to="/"
            className="flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 font-medium text-slate-300 hover:bg-white/[0.06]"
          >
            <Home size={17} />
            Home
          </Link>

        </div>

      </motion.div>

    </main>
  );
}
