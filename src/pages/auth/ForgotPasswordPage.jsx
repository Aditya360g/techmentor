import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";

import {
  ArrowLeft,
  Mail,
  Send,
} from "lucide-react";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();

    if (!email.trim()) {
      setError("Please enter your registered email.");
      return;
    }

    setError("");

    navigate("/reset-password", {
      state: {
        email,
      },
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-5 py-12 text-white">

      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />


      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >

        <Link
          to="/login"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-500 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to Login
        </Link>


        <div className="rounded-[30px] border border-white/[0.08] bg-[#11101a]/90 p-7 shadow-2xl backdrop-blur-xl">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Mail size={22} />
          </div>


          <h1 className="mt-6 text-2xl font-bold">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Enter your registered email address. In production, a secure
            password reset link or OTP will be sent to this email.
          </p>


          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          <form
            onSubmit={submit}
            className="mt-6"
          >

            <label>
              <span className="text-xs text-slate-500">
                Email Address
              </span>

              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#08070f] px-4 focus-within:border-violet-500/40">
                <Mail
                  size={17}
                  className="text-slate-600"
                />

                <input
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
                />
              </div>
            </label>


            <button
              type="submit"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 font-semibold hover:bg-violet-500"
            >
              <Send size={17} />
              Continue
            </button>

          </form>


          <p className="mt-6 text-center text-xs text-slate-600">
            Demo frontend mode: email delivery will be connected with the backend later.
          </p>

        </div>

      </motion.div>

    </main>
  );
}
