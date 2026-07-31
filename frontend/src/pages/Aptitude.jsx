import { useEffect, useState } from "react";
import { CheckCircle2, XCircle, Clock, RotateCcw } from "lucide-react";
import api from "../api/axios";
import Topbar from "../components/Topbar";
import Loader from "../components/Loader";
import ProgressLine from "../components/charts/ProgressLine";

const CATEGORIES = ["Quantitative", "Logical Reasoning", "Verbal Ability", "Data Interpretation"];

export default function Aptitude() {
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [history, setHistory] = useState([]);

  const loadQuestions = async (cat) => {
    setLoading(true);
    setResult(null);
    setAnswers({});
    try {
      const { data } = await api.get("/aptitude/questions", { params: { category: cat, limit: 5 } });
      setQuestions(data.questions);
      setStartTime(Date.now());
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    const { data } = await api.get("/aptitude/history");
    const trend = data.attempts
      .slice()
      .reverse()
      .map((a) => ({ date: new Date(a.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }), accuracy: a.accuracy }));
    setHistory(trend);
  };

  useEffect(() => {
    loadQuestions(category);
    loadHistory();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category]);

  const handleSubmit = async () => {
    setSubmitting(true);
    const timeTakenSeconds = Math.round((Date.now() - startTime) / 1000);
    const payload = {
      category,
      timeTakenSeconds,
      answers: questions.map((q) => ({
        questionId: q._id,
        selectedOptionIndex: answers[q._id] ?? -1,
      })),
    };
    try {
      const { data } = await api.post("/aptitude/submit", payload);
      setResult(data);
      loadHistory();
    } finally {
      setSubmitting(false);
    }
  };

  const allAnswered = questions.length > 0 && questions.every((q) => answers[q._id] !== undefined);

  return (
    <>
      <Topbar title="Aptitude Practice" subtitle="Quantitative, Logical, Verbal & Data Interpretation drills" />

      <div className="flex flex-wrap gap-2 mb-5">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`pill border transition-colors ${
              category === cat
                ? "bg-amber/15 text-amber border-amber/40"
                : "bg-surfaceAlt text-ink-muted border-border hover:text-ink"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 card p-6">
          {loading ? (
            <Loader label="Loading questions" />
          ) : result ? (
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="label-eyebrow">Session Result</p>
                  <p className="text-2xl font-display font-bold mt-1">
                    {result.attempt.correctAnswers}/{result.attempt.totalQuestions} correct ·{" "}
                    <span className="text-amber">{result.attempt.accuracy}%</span>
                  </p>
                </div>
                <button onClick={() => loadQuestions(category)} className="btn-secondary">
                  <RotateCcw size={16} /> New set
                </button>
              </div>
              <div className="space-y-3">
                {result.review.map((r) => (
                  <div key={r.questionId} className="rounded-lg border border-border bg-surfaceAlt p-3">
                    <div className="flex items-start gap-2">
                      {r.isCorrect ? (
                        <CheckCircle2 size={18} className="text-teal shrink-0 mt-0.5" />
                      ) : (
                        <XCircle size={18} className="text-coral shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm">{r.question}</p>
                        {!r.isCorrect && r.explanation && (
                          <p className="text-xs text-ink-faint mt-1.5">{r.explanation}</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q._id}>
                  <p className="text-sm font-medium mb-3">
                    <span className="text-ink-faint mr-2">Q{idx + 1}.</span>
                    {q.question}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt, optIdx) => (
                      <button
                        key={optIdx}
                        onClick={() => setAnswers({ ...answers, [q._id]: optIdx })}
                        className={`text-left text-sm rounded-lg border px-3 py-2.5 transition-colors ${
                          answers[q._id] === optIdx
                            ? "border-amber bg-amber/10 text-ink"
                            : "border-border bg-surfaceAlt text-ink-muted hover:text-ink"
                        }`}
                      >
                        {opt}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
              <button
                disabled={!allAnswered || submitting}
                onClick={handleSubmit}
                className="btn-primary w-full sm:w-auto"
              >
                {submitting ? "Submitting..." : "Submit answers"}
              </button>
            </div>
          )}
        </div>

        <div className="card p-6">
          <p className="label-eyebrow mb-1 flex items-center gap-1.5">
            <Clock size={13} /> Accuracy Trend
          </p>
          <p className="text-xs text-ink-faint mb-2">Across all categories, most recent sessions.</p>
          <ProgressLine data={history} dataKey="accuracy" unit="%" color="#F5A623" />
        </div>
      </div>
    </>
  );
}
