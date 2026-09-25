import { useMemo, useState } from "react";
import { motion } from "motion/react";

import {
  MessageSquareText,
  Search,
  Star,
} from "lucide-react";

const feedbackData = [
  {
    id: 1,
    college: "RKGIT",
    trainer: "Aman Sharma",
    rating: 5,
    comment:
      "Excellent teaching quality and strong student engagement throughout the Java DSA program.",
    date: "22 Sep 2026",
  },
  {
    id: 2,
    college: "XYZ College",
    trainer: "Priya Verma",
    rating: 4,
    comment:
      "Good practical sessions. Students appreciated the Python examples and project guidance.",
    date: "20 Sep 2026",
  },
  {
    id: 3,
    college: "Global University",
    trainer: "Rahul Mehta",
    rating: 5,
    comment:
      "The Full Stack training was structured well and aligned with our academic schedule.",
    date: "17 Sep 2026",
  },
  {
    id: 4,
    college: "Tech Institute",
    trainer: "Neha Singh",
    rating: 3,
    comment:
      "Overall good delivery. More practice sessions would improve the program further.",
    date: "14 Sep 2026",
  },
];

export default function FeedbackPage() {
  const [query, setQuery] = useState("");
  const [rating, setRating] = useState("All");

  const feedback = useMemo(() => {
    return feedbackData.filter((item) => {
      const searchMatch =
        item.college.toLowerCase().includes(query.toLowerCase()) ||
        item.trainer.toLowerCase().includes(query.toLowerCase());

      const ratingMatch =
        rating === "All" ||
        item.rating === Number(rating);

      return searchMatch && ratingMatch;
    });
  }, [query, rating]);

  const average =
    feedbackData.reduce((sum, item) => sum + item.rating, 0) /
    feedbackData.length;

  return (
    <div className="space-y-7">

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
      >
        

        

        
      </motion.div>


      <div className="grid gap-4 sm:grid-cols-3">

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="text-xs text-slate-600">
            Average Rating
          </p>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-3xl font-bold">
              {average.toFixed(1)}
            </span>

            <Star
              size={22}
              fill="currentColor"
              className="text-amber-400"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="text-xs text-slate-600">
            Total Reviews
          </p>

          <p className="mt-3 text-3xl font-bold">
            {feedbackData.length}
          </p>
        </div>

        <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5">
          <p className="text-xs text-slate-600">
            5 Star Reviews
          </p>

          <p className="mt-3 text-3xl font-bold">
            {feedbackData.filter((item) => item.rating === 5).length}
          </p>
        </div>

      </div>


      <div className="flex flex-col gap-3 sm:flex-row">

        <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4">
          <Search
            size={17}
            className="text-slate-600"
          />

          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search college or trainer..."
            className="h-12 w-full bg-transparent text-sm outline-none placeholder:text-slate-700"
          />
        </label>

        <select
          value={rating}
          onChange={(event) => setRating(event.target.value)}
          className="h-12 rounded-xl border border-white/[0.08] bg-[#11101a] px-4 text-sm text-slate-300 outline-none"
        >
          <option>All</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
        </select>

      </div>


      <div className="grid gap-4 lg:grid-cols-2">

        {feedback.map((item, index) => (
          <motion.article
            key={item.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.04 }}
            className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6"
          >
            <div className="flex items-start justify-between gap-4">

              <div className="flex items-center gap-3">

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-500/10 text-violet-400">
                  <MessageSquareText size={20} />
                </div>

                <div>
                  <p className="font-semibold">
                    {item.college}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Trainer: {item.trainer}
                  </p>
                </div>

              </div>

              <div className="flex gap-1 text-amber-400">
                {Array.from({ length: 5 }).map((_, starIndex) => (
                  <Star
                    key={starIndex}
                    size={14}
                    fill={
                      starIndex < item.rating
                        ? "currentColor"
                        : "none"
                    }
                    className={
                      starIndex < item.rating
                        ? "text-amber-400"
                        : "text-slate-700"
                    }
                  />
                ))}
              </div>

            </div>

            <p className="mt-5 leading-7 text-slate-400">
              “{item.comment}”
            </p>

            <p className="mt-5 text-xs text-slate-600">
              {item.date}
            </p>

          </motion.article>
        ))}

      </div>

    </div>
  );
}

