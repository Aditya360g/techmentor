import { useState } from "react";
import { motion } from "motion/react";
import {
  Link,
  useNavigate,
} from "react-router";

import {
  Building2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const roles = [
  {
    key: "student",
    label: "Student",
    icon: UserRound,
  },
  {
    key: "college",
    label: "College",
    icon: Building2,
  },
  {
    key: "trainer",
    label: "Trainer",
    icon: GraduationCap,
  },
  {
    key: "admin",
    label: "Admin",
    icon: ShieldCheck,
  },
];

export default function LoginPage() {
  const navigate = useNavigate();

  const [role, setRole] =
    useState("student");

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [form, setForm] =
    useState({
      email: "",
      password: "",
    });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.email.trim() ||
      !form.password.trim()
    ) {
      setError(
        "Please enter email and password."
      );

      return;
    }

    setError("");

    if (role === "student") {
      navigate("/student");
      return;
    }

    if (role === "admin") {
      navigate("/admin");
      return;
    }

    if (role === "trainer") {
      navigate("/trainer");
      return;
    }

    navigate("/college");
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-6 py-12 text-white">

      <div className="pointer-events-none absolute left-[-150px] top-[-100px] h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />

      <div className="pointer-events-none absolute bottom-[-150px] right-[-100px] h-[500px] w-[500px] rounded-full bg-indigo-600/10 blur-3xl" />


      <motion.div
        initial={{
          opacity: 0,
          y: 22,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="relative w-full max-w-lg"
      >

        <Link
          to="/"
          className="mx-auto mb-8 flex w-fit items-center gap-3"
        >

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold">
            CF
          </div>

          <div>
            <p className="font-bold">
              CodeFaculty
            </p>

            <p className="text-xs text-violet-400">
              Learning Platform
            </p>
          </div>

        </Link>


        <div className="rounded-[30px] border border-white/[0.08] bg-[#11101a]/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">

          <div className="text-center">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <UserRound size={22} />
            </div>

            <h1 className="mt-5 text-2xl font-bold">
              Welcome Back
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Select your portal and continue.
            </p>

          </div>


          <div className="mt-7 grid grid-cols-2 gap-2 rounded-xl border border-white/[0.07] bg-black/10 p-1.5 sm:grid-cols-4">

            {roles.map(
              ({
                key,
                label,
                icon: Icon,
              }) => (
                <button
                  key={key}
                  type="button"
                  onClick={() =>
                    setRole(key)
                  }
                  className={`flex items-center justify-center gap-1.5 rounded-lg px-2 py-2.5 text-xs font-medium transition-all ${
                    role === key
                      ? "bg-violet-600 text-white"
                      : "text-slate-500 hover:text-white"
                  }`}
                >
                  <Icon size={14} />
                  {label}
                </button>
              )
            )}

          </div>


          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >

            {error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}


            <label className="block">

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
                  value={form.email}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      email:
                        event.target.value,
                    })
                  }
                  placeholder="you@example.com"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
                />

              </div>

            </label>


            <label className="block">

              <span className="text-xs text-slate-500">
                Password
              </span>

              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#08070f] px-4 focus-within:border-violet-500/40">

                <Lock
                  size={17}
                  className="text-slate-600"
                />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  value={form.password}
                  onChange={(event) =>
                    setForm({
                      ...form,
                      password:
                        event.target.value,
                    })
                  }
                  placeholder="Enter password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      (current) =>
                        !current
                    )
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


            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold transition-transform hover:-translate-y-0.5"
            >
              Login as{" "}
              {
                roles.find(
                  (item) =>
                    item.key === role
                )?.label
              }
            </button>

          </form>


          <p className="mt-6 text-center text-xs leading-6 text-slate-600">
            Demo frontend login. Enter any non-empty email and password.
          </p>

        </div>

      </motion.div>

    </main>
  );
}
