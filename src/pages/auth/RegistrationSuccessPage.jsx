import { motion } from "motion/react";
import { Link, useLocation } from "react-router";

import {
  ArrowRight,
  CheckCircle2,
} from "lucide-react";

export default function RegistrationSuccessPage() {
  const location = useLocation();

  const name =
    location.state?.name || "User";

  const role =
    location.state?.role || "student";

  const roleName =
    role.charAt(0).toUpperCase() +
    role.slice(1);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-5 text-white">

      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-emerald-500/10 blur-3xl" />


      <motion.div
        initial={{
          opacity: 0,
          y: 18,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        className="relative w-full max-w-md"
      >

        <div className="rounded-[30px] border border-white/[0.08] bg-[#11101a]/90 p-8 text-center shadow-2xl">

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: "spring",
              delay: 0.1,
            }}
            className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500/10 text-emerald-400"
          >
            <CheckCircle2 size={38} />
          </motion.div>


          <h1 className="mt-7 text-2xl font-bold">
            Registration Successful
          </h1>

          <p className="mt-3 leading-7 text-slate-500">
            Welcome,{" "}

            <span className="font-semibold text-white">
              {name}
            </span>

            . Your {roleName} account has been created and your email has been verified.
          </p>


          {(role === "trainer" || role === "college") && (
            <div className="mt-6 rounded-xl border border-amber-500/20 bg-amber-500/10 p-4 text-sm leading-6 text-amber-400">
              Your account may require admin approval before all platform features become available.
            </div>
          )}


          <Link
            to="/login"
            className="mt-7 flex items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-semibold hover:bg-violet-500"
          >
            Continue to Login
            <ArrowRight size={17} />
          </Link>


          <Link
            to="/"
            className="mt-4 block text-sm text-slate-500 hover:text-white"
          >
            Return to Home
          </Link>

        </div>

      </motion.div>

    </main>
  );
}
