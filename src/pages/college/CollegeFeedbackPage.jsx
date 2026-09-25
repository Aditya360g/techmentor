import { useState } from "react";
import { motion } from "motion/react";

import {
  CheckCircle2,
  MessageSquareText,
  Star,
} from "lucide-react";

const initialFeedback = [
  {
    id: 1,
    trainer: "Rahul Mehta",
    program: "Full Stack Development",
    rating: 5,
    comment:
      "Excellent training quality and strong practical project guidance.",
    date: "18 Sep 2026",
  },
];

export default function CollegeFeedbackPage() {
  const [reviews, setReviews] =
    useState(initialFeedback);

  const [submitted, setSubmitted] =
    useState(false);

  const [form, setForm] = useState({
    trainer: "Aman Sharma",
    program: "Java + DSA",
    rating: 5,
    comment: "",
  });

  const submitFeedback = (event) => {
    event.preventDefault();

    if (!form.comment.trim()) {
      return;
    }

    const review = {
      id: Date.now(),
      trainer: form.trainer,
      program: form.program,
      rating: form.rating,
      comment: form.comment,
      date: "Today",
    };

    setReviews((current) => [
      review,
      ...current,
    ]);

    setForm({
      ...form,
      comment: "",
    });

    setSubmitted(true);

    setTimeout(() => {
      setSubmitted(false);
    }, 2200);
  };

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold">
          Trainer Feedback
        </h2>

        <p className="mt-2 text-sm text-slate-500">
          Rate trainers and share program feedback.
        </p>
      </motion.div>


      {submitted && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400"
        >
          <CheckCircle2 size={17} />
          Feedback submitted successfully.
        </motion.div>
      )}


      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">

        <motion.form
          initial={{ opacity: 0, x: -14 }}
          animate={{ opacity: 1, x: 0 }}
          onSubmit={submitFeedback}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
        >
          <div className="flex items-center gap-3">

            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
              <MessageSquareText size={20} />
            </div>

            <div>
              <h3 className="font-semibold">
                Submit Feedback
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Share your training experience.
              </p>
            </div>

          </div>


          <div className="mt-6 space-y-5">

            <label className="block">
              <span className="text-xs text-slate-500">
                Trainer
              </span>

              <select
                value={form.trainer}
                onChange={(event) =>
                  setForm({
                    ...form,
                    trainer: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
              >
                <option>Aman Sharma</option>
                <option>Priya Verma</option>
                <option>Rahul Mehta</option>
              </select>
            </label>


            <label className="block">
              <span className="text-xs text-slate-500">
                Program
              </span>

              <select
                value={form.program}
                onChange={(event) =>
                  setForm({
                    ...form,
                    program: event.target.value,
                  })
                }
                className="mt-2 h-12 w-full rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm"
              >
                <option>Java + DSA</option>
                <option>Python Training</option>
                <option>Full Stack Development</option>
              </select>
            </label>


            <div>
              <p className="text-xs text-slate-500">
                Rating
              </p>

              <div className="mt-3 flex gap-2">

                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    onClick={() =>
                      setForm({
                        ...form,
                        rating,
                      })
                    }
                  >
                    <Star
                      size={24}
                      fill={
                        rating <= form.rating
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        rating <= form.rating
                          ? "text-amber-400"
                          : "text-slate-700"
                      }
                    />
                  </button>
                ))}

              </div>
            </div>


            <label className="block">
              <span className="text-xs text-slate-500">
                Comment
              </span>

              <textarea
                rows="5"
                value={form.comment}
                onChange={(event) =>
                  setForm({
                    ...form,
                    comment: event.target.value,
                  })
                }
                placeholder="Write your feedback..."
                className="mt-2 w-full resize-none rounded-xl border border-white/[0.08] bg-[#11101a] p-4 text-sm outline-none placeholder:text-slate-700 focus:border-violet-500/40"
              />
            </label>


            <button
              type="submit"
              className="w-full rounded-xl bg-violet-600 py-3 text-sm font-semibold hover:bg-violet-500"
            >
              Submit Feedback
            </button>

          </div>
        </motion.form>


        <section className="space-y-4">

          <h3 className="font-semibold">
            Previous Feedback
          </h3>

          {reviews.map((review, index) => (
            <motion.article
              key={review.id}
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5"
            >

              <div className="flex items-start justify-between gap-4">

                <div>
                  <h4 className="font-semibold">
                    {review.trainer}
                  </h4>

                  <p className="mt-1 text-sm text-violet-400">
                    {review.program}
                  </p>
                </div>


                <div className="flex gap-1">

                  {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                      key={star}
                      size={14}
                      fill={
                        star <= review.rating
                          ? "currentColor"
                          : "none"
                      }
                      className={
                        star <= review.rating
                          ? "text-amber-400"
                          : "text-slate-700"
                      }
                    />
                  ))}

                </div>

              </div>

              <p className="mt-4 leading-7 text-slate-400">
                “{review.comment}”
              </p>

              <p className="mt-4 text-xs text-slate-600">
                {review.date}
              </p>

            </motion.article>
          ))}

        </section>

      </div>

    </div>
  );
}
