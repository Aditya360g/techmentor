import { Link } from "react-router";
import {
  Code2,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
} from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#08070f] text-white">
      <div className="mx-auto max-w-7xl px-6 py-16">

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">

          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500">
                <Code2 size={22} />
              </div>

              <div>
                <p className="font-bold">
                  CodeFaculty
                </p>

                <p className="text-xs text-slate-500">
                  Coding Guest Faculty
                </p>
              </div>
            </div>

            <p className="mt-5 max-w-sm leading-7 text-slate-400">
              Connecting colleges and universities with experienced coding
              trainers for Computer Science and IT students.
            </p>
          </div>


          <div>
            <h4 className="font-semibold">
              Quick Links
            </h4>

            <div className="mt-5 space-y-3">
              {[
                ["About Us", "/about"],
                ["Services", "/services"],
                ["Trainers", "/trainers"],
                ["Institutions", "/institutions"],
              ].map(([name, path]) => (
                <Link
                  key={path}
                  to={path}
                  className="block text-sm text-slate-400 transition hover:text-violet-400"
                >
                  {name}
                </Link>
              ))}
            </div>
          </div>


          <div>
            <h4 className="font-semibold">
              Services
            </h4>

            <div className="mt-5 space-y-3 text-sm text-slate-400">
              <p>Coding Guest Faculty</p>
              <p>Semester Training</p>
              <p>Placement Training</p>
              <p>Technical Workshops</p>
              <p>Bootcamp Programs</p>
            </div>
          </div>


          <div>
            <h4 className="font-semibold">
              Contact
            </h4>

            <div className="mt-5 space-y-4 text-sm text-slate-400">

              <div className="flex gap-3">
                <Mail size={18} className="text-violet-400" />
                info@yourcompany.com
              </div>

              <div className="flex gap-3">
                <Phone size={18} className="text-violet-400" />
                +91 XXXXX XXXXX
              </div>

              <div className="flex gap-3">
                <MapPin size={18} className="text-violet-400" />
                India
              </div>

            </div>
          </div>

        </div>


        <div className="mt-14 flex flex-col gap-5 border-t border-white/10 pt-8 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">

          <p>
            © 2026 CodeFaculty. All rights reserved.
          </p>

          <Link
            to="/request-guest-faculty"
            className="inline-flex items-center gap-2 text-violet-400"
          >
            Request a Trainer
            <ArrowUpRight size={15} />
          </Link>

        </div>

      </div>
    </footer>
  );
}
