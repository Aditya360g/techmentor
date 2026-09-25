import { useState } from "react";
import { motion } from "motion/react";
import { Link, useNavigate } from "react-router";

import {
  Building2,
  CheckCircle2,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Phone,
  UserRound,
} from "lucide-react";

const roles = [
  {
    key: "student",
    label: "Student",
    icon: UserRound,
  },
  {
    key: "trainer",
    label: "Trainer",
    icon: GraduationCap,
  },
  {
    key: "college",
    label: "College",
    icon: Building2,
  },
];

export default function RegisterPage() {
  const navigate = useNavigate();

  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const updateField = (field, value) => {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      !form.name.trim() ||
      !form.email.trim() ||
      !form.phone.trim() ||
      !form.password.trim()
    ) {
      setError("Please fill all required fields.");
      return;
    }

    if (form.password.length < 6) {
      setError("Password must contain at least 6 characters.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setError("");

    navigate("/verify-email", {
      state: {
        name: form.name,
        email: form.email,
        role,
      },
    });
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-5 py-12 text-white">

      <div className="pointer-events-none absolute left-[-180px] top-[-120px] h-[520px] w-[520px] rounded-full bg-violet-600/10 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-180px] right-[-120px] h-[520px] w-[520px] rounded-full bg-indigo-600/10 blur-3xl" />


      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full max-w-xl"
      >

        <Link
          to="/"
          className="mx-auto mb-7 flex w-fit items-center gap-3"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold">
            CF
          </div>

          <div>
            <p className="font-bold">
              CodeFaculty
            </p>

            <p className="text-xs text-violet-400">
              Create Account
            </p>
          </div>
        </Link>


        <div className="rounded-[30px] border border-white/[0.08] bg-[#11101a]/90 p-6 shadow-2xl backdrop-blur-xl md:p-8">

          <div className="text-center">
            <h1 className="text-2xl font-bold">
              Create Your Account
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Register as Student, Trainer or College.
            </p>
          </div>


          <div className="mt-7 grid grid-cols-3 gap-2 rounded-xl border border-white/[0.07] bg-black/10 p-1.5">

            {roles.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                type="button"
                onClick={() => setRole(key)}
                className={`flex items-center justify-center gap-2 rounded-lg py-2.5 text-xs font-medium transition-all ${
                  role === key
                    ? "bg-violet-600 text-white"
                    : "text-slate-500 hover:text-white"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}

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
                Full Name
              </span>

              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#08070f] px-4 focus-within:border-violet-500/40">
                <UserRound
                  size={17}
                  className="text-slate-600"
                />

                <input
                  value={form.name}
                  onChange={(event) =>
                    updateField("name", event.target.value)
                  }
                  placeholder={
                    role === "college"
                      ? "Contact person name"
                      : "Your full name"
                  }
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
                />
              </div>
            </label>


            <div className="grid gap-5 sm:grid-cols-2">

              <label>
                <span className="text-xs text-slate-500">
                  Email
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
                      updateField("email", event.target.value)
                    }
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
                  />
                </div>
              </label>


              <label>
                <span className="text-xs text-slate-500">
                  Phone
                </span>

                <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#08070f] px-4 focus-within:border-violet-500/40">
                  <Phone
                    size={17}
                    className="text-slate-600"
                  />

                  <input
                    value={form.phone}
                    onChange={(event) =>
                      updateField("phone", event.target.value)
                    }
                    placeholder="+91..."
                    className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
                  />
                </div>
              </label>

            </div>


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
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(event) =>
                    updateField("password", event.target.value)
                  }
                  placeholder="Minimum 6 characters"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
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
                Confirm Password
              </span>

              <div className="mt-2 flex h-12 items-center gap-3 rounded-xl border border-white/[0.08] bg-[#08070f] px-4 focus-within:border-violet-500/40">
                <Lock
                  size={17}
                  className="text-slate-600"
                />

                <input
                  type={showConfirm ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={(event) =>
                    updateField("confirmPassword", event.target.value)
                  }
                  placeholder="Repeat password"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
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


            <div className="flex items-start gap-3 rounded-xl bg-white/[0.03] p-4 text-xs leading-5 text-slate-500">
              <CheckCircle2
                size={16}
                className="mt-0.5 shrink-0 text-violet-400"
              />

              {role === "trainer" &&
                "Trainer accounts may require admin approval before receiving institutional assignments."}

              {role === "college" &&
                "College accounts may require verification before accessing trainer deployment features."}

              {role === "student" &&
                "Student accounts can access courses, tests, assignments and learning resources."}
            </div>


            <button
              type="submit"
              className="w-full rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 py-3.5 font-semibold hover:from-violet-500 hover:to-indigo-500"
            >
              Create {roles.find((item) => item.key === role)?.label} Account
            </button>

          </form>


          <p className="mt-6 text-center text-sm text-slate-500">
            Already have an account?{" "}

            <Link
              to="/login"
              className="font-semibold text-violet-400 hover:text-violet-300"
            >
              Login
            </Link>
          </p>

        </div>

      </motion.div>

    </main>
  );
}
