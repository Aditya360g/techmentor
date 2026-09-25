import { Link } from "react-router";
import {
  ArrowRight,
  Building2,
  Mail,
  Phone,
} from "lucide-react";

export default function ContactCTA() {
  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-[#08070f] px-6 py-28 text-white"
    >

      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[450px] w-[450px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-600/10 blur-3xl" />


      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[36px] border border-violet-500/20 bg-gradient-to-br from-violet-600/[0.13] via-[#11101a] to-indigo-600/[0.08] p-8 md:p-14">

        <div className="grid gap-12 lg:grid-cols-[1fr_0.8fr]">

          <div>

            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <Building2 size={23} />
            </div>

            <h2 className="mt-6 max-w-2xl text-3xl font-bold md:text-5xl">
              Ready to Strengthen Technical Learning at Your Institution?
            </h2>

            <p className="mt-5 max-w-xl leading-7 text-slate-400">
              Connect with us for coding guest faculty, semester programs,
              placement training, workshops or online technical learning.
            </p>


            <div className="mt-8 flex flex-wrap gap-3">

              <Link
                to="/request-guest-faculty"
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-4 font-semibold transition-transform duration-200 hover:-translate-y-1"
              >
                Request Trainer
                <ArrowRight size={18} />
              </Link>

              <Link
                to="/contact"
                className="rounded-xl border border-white/10 bg-white/[0.04] px-6 py-4 font-medium transition-colors hover:bg-white/[0.08]"
              >
                Send Message
              </Link>

            </div>

          </div>


          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">

            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">

              <Phone
                size={20}
                className="text-violet-400"
              />

              <p className="mt-4 text-sm text-slate-500">
                Call Us
              </p>

              <p className="mt-1 font-semibold">
                Add Official Phone Number
              </p>

            </div>


            <div className="rounded-2xl border border-white/10 bg-black/10 p-5">

              <Mail
                size={20}
                className="text-violet-400"
              />

              <p className="mt-4 text-sm text-slate-500">
                Email Us
              </p>

              <p className="mt-1 font-semibold">
                Add Official Email Address
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>
  );
}
