import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "motion/react";

import {
  Bell,
  BookOpenCheck,
  CheckCircle2,
  ClipboardCheck,
  MessagesSquare,
  Smartphone,
} from "lucide-react";

const features = [
  {
    icon: BookOpenCheck,
    title: "All-in-One Student Portal",
    text:
      "Students can track batches, lectures, programming assignments and academic progress from one portal.",
  },
  {
    icon: ClipboardCheck,
    title: "Integrated Placement Test System",
    text:
      "Support mock placement assessments, coding tests and institution-specific technical examinations.",
  },
  {
    icon: MessagesSquare,
    title: "Active Learning Communities",
    text:
      "Enable discussion forums, class communities and peer learning around technical topics.",
  },
];

function LearningPortal3D() {
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
          rounded-[34px]
          border
          border-white/10
          bg-[#11101a]
          p-5
          shadow-[0_35px_100px_rgba(0,0,0,0.45)]
        "
      >
        {/* GLOW */}
        <div className="pointer-events-none absolute inset-0 rounded-[34px] bg-gradient-to-br from-violet-500/[0.08] via-transparent to-indigo-500/[0.05]" />

        {/* HEADER */}
        <div
          style={{
            transform: "translateZ(40px)",
          }}
          className="relative flex items-center justify-between border-b border-white/10 pb-5"
        >
          <div className="flex items-center gap-3">

            <motion.div
              animate={{
                y: [0, -2, 0],
              }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 font-bold shadow-[0_0_18px_rgba(139,92,246,0.30)]"
            >
              CF
            </motion.div>

            <div>
              <p className="font-semibold">
                Learning Portal
              </p>

              <p className="text-xs text-slate-500">
                v1.0
              </p>
            </div>

          </div>

          <motion.div
            animate={{
              rotate: [0, -6, 6, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Bell
              size={20}
              className="text-slate-500"
            />
          </motion.div>

        </div>


        {/* ACTIVE ENROLLMENT */}
        <motion.div
          style={{
            transform: "translateZ(32px)",
          }}
          whileHover={{
            y: -2,
          }}
          transition={{
            duration: 0.18,
          }}
          className="relative mt-5 rounded-2xl border border-violet-500/20 bg-violet-500/[0.07] p-5"
        >
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-violet-400">
            Active Enrollment
          </p>

          <h3 className="mt-2 text-lg font-semibold">
            Core Java & DSA Combo
          </h3>

          <div className="mt-5">

            <div className="flex justify-between text-xs text-slate-500">
              <span>
                Batch Progress
              </span>

              <span>
                72%
              </span>
            </div>

            <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/[0.06]">

              <motion.div
                initial={{
                  width: 0,
                }}
                whileInView={{
                  width: "72%",
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 1.1,
                  delay: 0.25,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="h-full rounded-full bg-gradient-to-r from-violet-600 to-indigo-500 shadow-[0_0_12px_rgba(139,92,246,0.35)]"
              />

            </div>

          </div>
        </motion.div>


        {/* EXAM PLATFORM */}
        <motion.div
          style={{
            transform: "translateZ(45px)",
          }}
          whileHover={{
            y: -2,
          }}
          transition={{
            duration: 0.18,
          }}
          className="relative mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
        >
          <p className="text-sm font-semibold">
            Exam Platform Integration
          </p>

          <div className="mt-4 space-y-3">

            {[
              "Custom Training Portal",
              "Mock Placement Platform",
            ].map((item, index) => (
              <motion.div
                key={item}
                initial={{
                  opacity: 0,
                  x: 10,
                }}
                whileInView={{
                  opacity: 1,
                  x: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.35,
                  delay: 0.15 + index * 0.08,
                }}
                className="flex items-center justify-between rounded-xl border border-transparent px-2 py-2 transition-colors duration-200 hover:border-violet-500/20 hover:bg-violet-500/[0.04]"
              >
                <span className="text-sm text-slate-400">
                  {item}
                </span>

                <span className="flex items-center gap-1 text-xs text-emerald-400">

                  <CheckCircle2
                    size={14}
                  />

                  Connected

                </span>
              </motion.div>
            ))}

          </div>
        </motion.div>


        {/* NOTIFICATION */}
        <motion.div
          style={{
            transform: "translateZ(45px)",
          }}
          whileHover={{
            y: -2,
          }}
          transition={{
            duration: 0.18,
          }}
          className="relative mt-4 rounded-2xl border border-white/[0.07] bg-white/[0.025] p-5"
        >
          <p className="text-xs uppercase tracking-[0.15em] text-slate-500">
            Latest Notification
          </p>

          <p className="mt-3 font-semibold">
            New Mock Test Released
          </p>

          <p className="mt-1 text-sm text-slate-500">
            Placement practice assessment
          </p>
        </motion.div>


        {/* BOTTOM MENU */}
        <div
          style={{
            transform: "translateZ(28px)",
          }}
          className="relative mt-5 grid grid-cols-4 gap-2 border-t border-white/10 pt-5 text-center text-xs text-slate-600"
        >
          {[
            "Home",
            "Courses",
            "Tests",
            "Forums",
          ].map((item) => (
            <span
              key={item}
              className="rounded-lg py-2 transition-all duration-200 hover:bg-violet-500/[0.08] hover:text-violet-300"
            >
              {item}
            </span>
          ))}
        </div>

      </motion.div>
    </motion.div>
  );
}

export default function LearningPlatformSection() {
  return (
    <section className="overflow-hidden bg-[#08070f] py-28 text-white">

      <div className="mx-auto grid max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">

        {/* LEFT */}

        <motion.div
          initial={{
            opacity: 0,
            x: -20,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.5,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-violet-400">
            Own Testing & Learning Platform
          </p>

          <h2 className="mt-4 text-3xl font-bold leading-tight md:text-5xl">
            Learn and Take Exams Anywhere with

            <span className="text-violet-400">
              {" "}Web & Mobile Portals
            </span>
          </h2>

          <p className="mt-5 max-w-xl leading-7 text-slate-400">
            Build a connected learning environment where students can access
            training material, assignments, discussions, notifications and
            mock placement tests.
          </p>


          <div className="mt-9 space-y-5">

            {features.map(({ icon: Icon, title, text }, index) => (
              <motion.div
                key={title}
                initial={{
                  opacity: 0,
                  y: 12,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                }}
                viewport={{
                  once: true,
                }}
                transition={{
                  duration: 0.35,
                  delay: index * 0.07,
                }}
                className="flex gap-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <Icon size={20} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    {title}
                  </h3>

                  <p className="mt-2 leading-7 text-slate-400">
                    {text}
                  </p>
                </div>
              </motion.div>
            ))}

          </div>


          <button
            type="button"
            className="mt-9 inline-flex cursor-default items-center gap-2 rounded-xl border border-violet-400/20 bg-violet-500/10 px-6 py-3 font-medium text-violet-300"
          >
            <Smartphone size={18} />

            Mobile App — Coming Soon
          </button>

        </motion.div>


        {/* RIGHT 3D PORTAL */}

        <motion.div
          initial={{
            opacity: 0,
            x: 25,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
          }}
          viewport={{
            once: true,
          }}
          transition={{
            duration: 0.6,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="relative mx-auto w-full max-w-lg"
        >
          <LearningPortal3D />
        </motion.div>

      </div>

    </section>
  );
}

