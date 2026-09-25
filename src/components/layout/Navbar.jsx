import { useState } from "react";
import { Link } from "react-router";
import {
  Menu,
  X,
} from "lucide-react";

const navLinks = [
  {
    label: "Courses",
    href: "/#courses",
  },
  {
    label: "Trainers",
    href: "/trainers",
  },
  {
    label: "Careers & Programs",
    href: "/#careers",
  },
  {
    label: "Test Platform",
    href: "/#platform",
  },
  {
    label: "Colleges",
    href: "/institutions",
  },
  {
    label: "Solutions",
    href: "/services",
  },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <header
      className="
        fixed
        inset-x-0
        top-4
        z-50
        px-4
      "
    >
      <nav
        className="
          mx-auto
          flex
          h-[68px]
          max-w-[1320px]
          items-center
          justify-between
          rounded-[22px]
          border
          border-white/[0.08]
          bg-[#111019]/75
          px-4
          shadow-[0_10px_45px_rgba(0,0,0,0.35)]
          backdrop-blur-2xl
          md:px-5
        "
      >

        {/* ================================
            LEFT BRAND
        ================================= */}

        <Link
          to="/"
          onClick={() => setOpen(false)}
          className="
            group
            flex
            shrink-0
            items-center
            gap-3
          "
        >
          <div
            className="
              relative
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-violet-300/30
              bg-gradient-to-br
              from-violet-500
              via-violet-600
              to-indigo-600
              text-sm
              font-bold
              text-white
              shadow-[0_0_10px_rgba(139,92,246,0.45),0_0_25px_rgba(99,102,241,0.20)]
              transition-all
              duration-200
              group-hover:shadow-[0_0_14px_rgba(139,92,246,0.65),0_0_30px_rgba(99,102,241,0.30)]
            "
          >
            CF
          </div>

          <div>
            <p
              className="
                text-[15px]
                font-semibold
                leading-tight
                tracking-[-0.01em]
                text-white
              "
            >
              CodeFaculty
            </p>

            <p
              className="
                mt-[2px]
                text-[10px]
                font-medium
                tracking-[0.08em]
                text-slate-500
              "
            >
              Tech Trainers
            </p>
          </div>
        </Link>


        {/* ================================
            CENTER NAV LINKS
        ================================= */}

        <div
          className="
            hidden
            items-center
            gap-7
            xl:flex
          "
        >
          {navLinks.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="
                relative
                whitespace-nowrap
                text-[13px]
                font-medium
                text-slate-400
                transition-colors
                duration-200

                after:absolute
                after:-bottom-2
                after:left-1/2
                after:h-[2px]
                after:w-0
                after:-translate-x-1/2
                after:rounded-full
                after:bg-violet-400
                after:shadow-[0_0_8px_rgba(167,139,250,0.8)]
                after:transition-all
                after:duration-200

                hover:text-white
                hover:after:w-full
              "
            >
              {item.label}
            </a>
          ))}
        </div>


        {/* ================================
            RIGHT LOGIN BUTTON
        ================================= */}

        <div
          className="
            hidden
            items-center
            gap-4
            xl:flex
          "
        >
          <div className="h-7 w-px bg-white/[0.08]" />

          <Link
            to="/login"
            className="
              relative
              overflow-hidden
              rounded-full
              border
              border-violet-400/20
              bg-gradient-to-r
              from-violet-600
              to-indigo-600
              px-6
              py-2.5
              text-[13px]
              font-semibold
              text-white
              shadow-[0_0_18px_rgba(124,58,237,0.30)]
              transition-all
              duration-200

              hover:-translate-y-[1px]
              hover:border-violet-300/40
              hover:shadow-[0_0_12px_rgba(139,92,246,0.55),0_0_28px_rgba(99,102,241,0.25)]
            "
          >
            Login
          </Link>
        </div>


        {/* ================================
            MOBILE BUTTON
        ================================= */}

        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-label="Toggle navigation"
          className="
            flex
            h-10
            w-10
            items-center
            justify-center
            rounded-xl
            border
            border-white/[0.08]
            bg-white/[0.04]
            text-white
            transition-colors
            duration-200
            hover:bg-white/[0.08]
            xl:hidden
          "
        >
          {open ? (
            <X size={20} />
          ) : (
            <Menu size={20} />
          )}
        </button>

      </nav>


      {/* ================================
          MOBILE MENU
      ================================= */}

      {open && (
        <div
          className="
            mx-auto
            mt-3
            max-w-[1320px]
            overflow-hidden
            rounded-[22px]
            border
            border-white/[0.08]
            bg-[#111019]/95
            p-3
            shadow-[0_20px_60px_rgba(0,0,0,0.45)]
            backdrop-blur-2xl
            xl:hidden
          "
        >
          <div className="flex flex-col">

            {navLinks.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={() => setOpen(false)}
                className="
                  rounded-xl
                  px-4
                  py-3.5
                  text-sm
                  font-medium
                  text-slate-400
                  transition-all
                  duration-200
                  hover:bg-white/[0.05]
                  hover:text-white
                "
              >
                {item.label}
              </a>
            ))}


            <div className="my-2 h-px bg-white/[0.07]" />


            <Link
              to="/login"
              onClick={() => setOpen(false)}
              className="
                rounded-xl
                bg-gradient-to-r
                from-violet-600
                to-indigo-600
                px-5
                py-3.5
                text-center
                text-sm
                font-semibold
                text-white
                shadow-[0_0_18px_rgba(124,58,237,0.25)]
              "
            >
              Login
            </Link>

          </div>
        </div>
      )}

    </header>
  );
}
