import { motion } from "motion/react";
import { Link } from "react-router";

import {
  ArrowLeft,
  Home,
  SearchX,
} from "lucide-react";

export default function NotFoundPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#08070f] px-6 text-white">

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />


      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 18,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.45,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative w-full max-w-2xl text-center"
      >

        <motion.div
          animate={{
            y: [0, -8, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl border border-violet-500/20 bg-violet-500/10 text-violet-400 shadow-[0_0_30px_rgba(139,92,246,0.15)]"
        >
          <SearchX size={34} />
        </motion.div>


        <p className="mt-8 bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-7xl font-black text-transparent md:text-9xl">
          404
        </p>


        <h1 className="mt-5 text-3xl font-bold md:text-5xl">
          Page Not Found
        </h1>

        <p className="mx-auto mt-5 max-w-xl leading-7 text-slate-500">
          The page you're looking for doesn't exist or may have been moved.
          You can return to the homepage or go back to the previous page.
        </p>


        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-violet-600 px-6 py-3.5 font-semibold transition-all hover:-translate-y-0.5 hover:bg-violet-500"
          >
            <Home size={17} />
            Go Home
          </Link>


          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/[0.08] bg-white/[0.03] px-6 py-3.5 font-medium text-slate-300 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <ArrowLeft size={17} />
            Go Back
          </button>

        </div>

      </motion.div>

    </main>
  );
}
