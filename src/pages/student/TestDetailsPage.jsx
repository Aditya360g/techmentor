import { useState } from "react";

import {
  ArrowLeft,
  Clock3,
} from "lucide-react";

import {
  Link,
  useNavigate,
  useParams,
} from "react-router";

import { tests } from "../../data/student/testsData";

export default function TestDetailsPage() {
  const { testId } = useParams();
  const navigate = useNavigate();

  const test =
    tests.find(
      (item) => item.id === testId
    ) || tests[0];

  const [answers, setAnswers] =
    useState({});

  const answerQuestion = (
    questionId,
    optionIndex
  ) => {
    setAnswers((current) => ({
      ...current,
      [questionId]: optionIndex,
    }));
  };

  const submitTest = () => {
    let correct = 0;

    test.questions.forEach((question) => {
      if (
        answers[question.id] ===
        question.answer
      ) {
        correct += 1;
      }
    });

    const total =
      test.questions.length;

    const score =
      total === 0
        ? 0
        : Math.round(
            (correct / total) * 100
          );

    navigate(
      `/student/tests/${test.id}/result`,
      {
        state: {
          score,
          correct,
          total,
          title: test.title,
          course: test.course,
        },
      }
    );
  };

  return (
    <div className="space-y-7">

      <Link
        to="/student/tests"
        className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-violet-600"
      >
        <ArrowLeft size={16} />
        Back to Tests
      </Link>


      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>
            <p className="text-sm font-semibold text-violet-600">
              {test.course}
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              {test.title}
            </h2>
          </div>

          <div className="flex items-center gap-2 rounded-xl bg-violet-50 px-4 py-3 text-sm font-semibold text-violet-700">
            <Clock3 size={16} />
            {test.duration} minutes
          </div>

        </div>

      </section>


      <div className="space-y-5">

        {test.questions.map(
          (question, questionIndex) => (
            <section
              key={question.id}
              className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
            >

              <p className="text-sm font-semibold text-violet-600">
                Question {questionIndex + 1}
              </p>

              <h3 className="mt-3 text-lg font-bold text-slate-900">
                {question.question}
              </h3>


              <div className="mt-5 grid gap-3">

                {question.options.map(
                  (option, optionIndex) => {
                    const selected =
                      answers[
                        question.id
                      ] === optionIndex;

                    return (
                      <button
                        key={option}
                        type="button"
                        onClick={() =>
                          answerQuestion(
                            question.id,
                            optionIndex
                          )
                        }
                        className={`rounded-xl border p-4 text-left text-sm transition-colors ${
                          selected
                            ? "border-violet-500 bg-violet-50 text-violet-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        {String.fromCharCode(
                          65 + optionIndex
                        )}
                        . {option}
                      </button>
                    );
                  }
                )}

              </div>

            </section>
          )
        )}

      </div>


      <button
        type="button"
        onClick={submitTest}
        disabled={
          Object.keys(answers).length !==
          test.questions.length
        }
        className="w-full rounded-xl bg-violet-600 py-4 font-semibold text-white hover:bg-violet-500 disabled:cursor-not-allowed disabled:bg-slate-300"
      >
        Submit Test
      </button>

    </div>
  );
}
