import { useEffect, useState } from "react";
import { motion } from "motion/react";

import {
  MailCheck,
  RotateCcw,
} from "lucide-react";

import {
  useLocation,
  useNavigate,
} from "react-router";

export default function VerifyEmailPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const email =
    location.state?.email || "user@example.com";

  const name =
    location.state?.name || "User";

  const role =
    location.state?.role || "student";

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [seconds, setSeconds] = useState(30);

  useEffect(() => {
    if (seconds <= 0) {
      return;
    }

    const timer = setInterval(() => {
      setSeconds((current) => current - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [seconds]);


  const verify = (event) => {
    event.preventDefault();

    if (otp.length !== 6) {
      setError("Please enter the 6-digit verification code.");
      return;
    }

    if (otp !== "123456") {
      setError("Demo verification code is 123456.");
      return;
    }

    setError("");

    navigate("/registration-success", {
      state: {
        name,
        email,
        role,
      },
    });
  };


  const resend = () => {
    setSeconds(30);
    setOtp("");
    setError("");
  };


  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-5 py-12 text-white">

      <div className="pointer-events-none absolute h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />


      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-md"
      >

        <div className="rounded-[30px] border border-white/[0.08] bg-[#11101a]/90 p-7 text-center shadow-2xl backdrop-blur-xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-500/10 text-violet-400">
            <MailCheck size={26} />
          </div>


          <h1 className="mt-6 text-2xl font-bold">
            Verify Your Email
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            We sent a verification code to
          </p>

          <p className="mt-1 text-sm font-semibold text-violet-400">
            {email}
          </p>


          {error && (
            <div className="mt-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
              {error}
            </div>
          )}


          <form
            onSubmit={verify}
            className="mt-7"
          >

            <input
              value={otp}
              onChange={(event) => {
                const value =
                  event.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6);

                setOtp(value);
              }}
              inputMode="numeric"
              placeholder="000000"
              className="h-16 w-full rounded-xl border border-white/[0.08] bg-[#08070f] text-center text-2xl font-bold tracking-[0.55em] outline-none focus:border-violet-500/50"
            />


            <p className="mt-3 text-xs text-slate-600">
              Demo OTP:{" "}

              <span className="font-semibold text-violet-400">
                123456
              </span>
            </p>


            <button
              type="submit"
              className="mt-6 w-full rounded-xl bg-violet-600 py-3.5 font-semibold hover:bg-violet-500"
            >
              Verify Email
            </button>

          </form>


          <div className="mt-6 border-t border-white/[0.06] pt-6">

            {seconds > 0 ? (
              <p className="text-sm text-slate-500">
                Resend code in{" "}

                <span className="text-white">
                  {seconds}s
                </span>
              </p>
            ) : (
              <button
                type="button"
                onClick={resend}
                className="mx-auto flex items-center gap-2 text-sm font-semibold text-violet-400"
              >
                <RotateCcw size={15} />
                Resend Code
              </button>
            )}

          </div>

        </div>

      </motion.div>

    </main>
  );
}
