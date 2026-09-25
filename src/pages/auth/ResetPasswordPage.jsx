import { useState } from "react";
import { motion } from "motion/react";

import {
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
} from "lucide-react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email || "your registered email";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });

  const submit = (event) => {
    event.preventDefault();

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    navigate("/login", {
      state: {
        passwordReset: true,
      },
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-5 py-12 text-white">

      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />


      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-md"
      >

        <div className="rounded-[30px] border border-white/[0.08] bg-[#11101a]/90 p-7 shadow-2xl backdrop-blur-xl">

          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
            <Lock size={22} />
          </div>


          <h1 className="mt-6 text-2xl font-bold">
            Create New Password
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Resetting password for{" "}

            <span className="text-violet-400">
              {email}
            </span>
          </p>


          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          <form
            onSubmit={submit}
            className="mt-6 space-y-5"
          >

            <label className="block">
              <span className="text-xs text-slate-500">
                New Password
              </span>

              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#08070f] px-4">
                <Lock
                  size={17}
                  className="text-slate-600"
                />

                <input
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      password: event.target.value,
                    })
                  }
                  placeholder="Minimum 6 characters"
                  className="w-full bg-transparent text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((current) => !current)
                  }
                  className="text-slate-600 hover:text-white"
                >
                  {showPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>


            <label className="block">
              <span className="text-xs text-slate-500">
                Confirm New Password
              </span>

              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#08070f] px-4">
                <Lock
                  size={17}
                  className="text-slate-600"
                />

                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      confirmPassword: event.target.value,
                    })
                  }
                  placeholder="Repeat new password"
                  className="w-full bg-transparent text-sm outline-none"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirm((current) => !current)
                  }
                  className="text-slate-600 hover:text-white"
                >
                  {showConfirm ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </div>
            </label>


            <div className="flex gap-3 rounded-xl bg-emerald-500/[0.06] p-4 text-xs leading-5 text-emerald-400">
              <CheckCircle2
                size={16}
                className="shrink-0"
              />

              Use a strong password that is different from your previous password.
            </div>


            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3.5 font-semibold hover:bg-violet-500"
            >
              Reset Password
            </button>

          </form>


          <Link
            to="/login"
            className="mt-6 block text-center text-sm font-medium text-violet-400"
          >
            Back to Login
          </Link>

        </div>

      </motion.div>

    </main>
  );
}
