import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import { Link } from "react-router";

import {
  ArrowRight,
  CheckCircle2,
  Code2,
  GraduationCap,
  Sparkles,
  Users,
} from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1];

function RequirementCard3D() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 130,
    damping: 20,
    mass: 0.45,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 130,
    damping: 20,
    mass: 0.45,
  });

  const rotateY = useTransform(
    smoothX,
    [-0.5, 0.5],
    [-6, 6]
  );

  const rotateX = useTransform(
    smoothY,
    [-0.5, 0.5],
    [6, -6]
  );

  function handleMouseMove(event) {
    const rect =
      event.currentTarget.getBoundingClientRect();

    const x =
      (event.clientX - rect.left) / rect.width - 0.5;

    const y =
      (event.clientY - rect.top) / rect.height - 0.5;

    mouseX.set(x);
    mouseY.set(y);
  }

  function resetTilt() {
    mouseX.set(0);
    mouseY.set(0);
  }

  return (
    <motion.div
      animate={{
        y: [0, -9, 0],
      }}
      transition={{
        duration: 5.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      style={{
        perspective: "1200px",
      }}
    >
      <motion.div
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d",
          willChange: "transform",
        }}
        className="
          relative
          transform-gpu
          rounded-[30px]
          border
          border-white/10
          bg-[#11101a]/95
          p-5
          shadow-[0_30px_80px_rgba(0,0,0,0.38)]
        "
      >
        {/* GLOW */}
        <div className="pointer-events-none absolute inset-0 rounded-[30px] bg-gradient-to-br from-violet-500/[0.09] via-transparent to-indigo-500/[0.05]" />

        {/* HEADER */}
        <div
          style={{
            transform: "translateZ(35px)",
          }}
          className="relative flex items-center justify-between border-b border-white/10 pb-5"
        >
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-slate-500">
              New Requirement
            </p>

            <p className="mt-1 text-lg font-semibold">
              Guest Faculty Request
            </p>
          </div>

          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-violet-400/20 bg-violet-500/10 text-violet-400 shadow-[0_0_18px_rgba(139,92,246,0.15)]">
            <GraduationCap size={22} />
          </div>
        </div>

        {/* DETAILS */}
        <div
          style={{
            transform: "translateZ(24px)",
          }}
          className="relative mt-5 space-y-3"
        >
          {[
            ["Technology", "Java + DSA"],
            ["Students", "120 CS Students"],
            ["Duration", "4 Months"],
            ["Mode", "On Campus"],
          ].map(([label, value]) => (
            <div
              key={label}
              className="
                flex
                items-center
                justify-between
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.035]
                px-4
                py-4
                transition-all
                duration-200
                hover:border-violet-400/40
                hover:bg-violet-500/[0.05]
              "
            >
              <span className="text-sm text-slate-500">
                {label}
              </span>

              <span className="text-sm font-semibold text-slate-100">
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* MATCH */}
        <div
          style={{
            transform: "translateZ(45px)",
          }}
          className="relative mt-5 rounded-2xl border border-violet-500/20 bg-gradient-to-r from-violet-500/[0.10] to-indigo-500/[0.08] p-5"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 shadow-lg shadow-violet-900/30">
              <Users size={21} />
            </div>

            <div>
              <p className="text-xs text-violet-300">
                Trainer Match
              </p>

              <p className="font-semibold">
                Suitable Trainers Available
              </p>
            </div>

            <span className="ml-auto h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.8)]" />

          </div>
        </div>

        {/* FLOATING TRAINER CARD */}
        <div
          style={{
            transform: "translateZ(70px)",
          }}
          className="absolute -bottom-9 -left-5 hidden sm:block"
        >
          <motion.div
            animate={{
              y: [0, 5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="rounded-2xl border border-white/10 bg-[#171520] p-4 shadow-2xl"
          >
            <div className="flex items-center gap-3">

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-indigo-500 shadow-[0_0_18px_rgba(139,92,246,0.30)]">
                <Code2 size={18} />
              </div>

              <div>
                <p className="text-xs text-slate-500">
                  Trainer
                </p>

                <p className="text-sm font-semibold">
                  6+ Years Experience
                </p>
              </div>

            </div>
          </motion.div>
        </div>

      </motion.div>
    </motion.div>
  );
}

export default function HeroSection() {
  return (
    <section
      className="relative min-h-screen overflow-hidden bg-[#08070f] pt-32 text-white"
      style={{
        backgroundImage: `
          radial-gradient(circle at 15% 15%, rgba(124,58,237,0.14), transparent 30%),
          radial-gradient(circle at 85% 70%, rgba(79,70,229,0.12), transparent 30%)
        `,
      }}
    >
      <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-16 px-6 pb-24 lg:grid-cols-2">

        {/* LEFT CONTENT */}
        <motion.div
          initial={{
            opacity: 0,
            y: 24,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.6,
            ease: smoothEase,
          }}
        >
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-2 text-sm text-violet-300">
            <Sparkles size={16} />

            Next Batch Starting Soon
          </div>

          <h1 className="max-w-3xl text-5xl font-bold leading-[1.08] tracking-tight md:text-6xl lg:text-7xl">
            Partnering with Colleges,

            <span className="block bg-gradient-to-r from-violet-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
              Universities & Technical Education
            </span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-8 text-slate-400">
            Curriculum-aligned coding trainers and guest faculty for
            Computer Science and IT students across Java, Python, DSA,
            Full Stack, AI/ML and modern technologies.
          </p>

          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-400">

            {[
              "Verified Trainers",
              "University Partnerships",
              "Placement Focused",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-2"
              >
                <CheckCircle2
                  size={18}
                  className="text-emerald-400"
                />

                {text}
              </div>
            ))}

          </div>

          <div className="mt-10 flex flex-wrap gap-4">

            <Link
              to="/request-guest-faculty"
              className="
                inline-flex
                items-center
                gap-2
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-indigo-600
                px-7
                py-4
                font-semibold
                shadow-lg
                shadow-violet-900/20
                transition-transform
                duration-200
                hover:-translate-y-1
              "
            >
              Request Guest Faculty
              <ArrowRight size={18} />
            </Link>

            <a
              href="#courses"
              className="
                rounded-xl
                border
                border-white/10
                bg-white/[0.04]
                px-7
                py-4
                font-semibold
                text-slate-200
                transition-colors
                duration-200
                hover:bg-white/[0.08]
              "
            >
              Explore Courses
            </a>

          </div>
        </motion.div>


        {/* OLD PREMIUM 3D CARD */}
        <motion.div
          initial={{
            opacity: 0,
            x: 25,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          transition={{
            duration: 0.65,
            delay: 0.1,
            ease: smoothEase,
          }}
          className="mx-auto w-full max-w-lg"
        >
          <RequirementCard3D />
        </motion.div>

      </div>
    </section>
  );
}
