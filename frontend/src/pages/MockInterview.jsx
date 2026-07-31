import { useEffect, useState } from "react";
import api from "../api/axios";
import Topbar from "../components/Topbar";
import ProgressLine from "../components/charts/ProgressLine";
import Loader from "../components/Loader";

const ROUNDS = ["Technical", "HR", "Group Discussion", "Managerial"];
const SCORE_FIELDS = [
  { key: "communicationScore", label: "Communication" },
  { key: "technicalScore", label: "Technical Depth" },
  { key: "confidenceScore", label: "Confidence" },
  { key: "problemSolvingScore", label: "Problem Solving" },
];

export default function MockInterview() {
  const [form, setForm] = useState({
    round: "Technical",
    communicationScore: 5,
    technicalScore: 5,
    confidenceScore: 5,
    problemSolvingScore: 5,
    feedback: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lastResult, setLastResult] = useState(null);

  const loadHistory = async () => {
    const { data } = await api.get("/interview/history");
    const trend = data.interviews
      .slice()
      .reverse()
      .map((i) => ({ date: new Date(i.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }), overallScore: i.overallScore }));
    setHistory(trend);
    setLoading(false);
  };

  useEffect(() => {
    loadHistory();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await api.post("/interview/log", form);
      setLastResult(data.interview);
      setForm({ ...form, feedback: "" });
      loadHistory();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Topbar title="Mock Interview Log" subtitle="Record self- or peer-assessed scores after every mock round" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <form onSubmit={handleSubmit} className="lg:col-span-2 card p-6 space-y-5">
          <div>
            <label className="label-eyebrow">Round type</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {ROUNDS.map((r) => (
                <button
                  type="button"
                  key={r}
                  onClick={() => setForm({ ...form, round: r })}
                  className={`pill border transition-colors ${
                    form.round === r
                      ? "bg-violet/15 text-violet border-violet/40"
                      : "bg-surfaceAlt text-ink-muted border-border"
                  }`}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {SCORE_FIELDS.map(({ key, label }) => (
            <div key={key}>
              <div className="flex items-center justify-between">
                <label className="label-eyebrow">{label}</label>
                <span className="tabular-score text-sm text-amber font-semibold">{form[key]}/10</span>
              </div>
              <input
                type="range"
                min={1}
                max={10}
                value={form[key]}
                onChange={(e) => setForm({ ...form, [key]: Number(e.target.value) })}
                className="w-full mt-2 accent-amber"
              />
            </div>
          ))}

          <div>
            <label className="label-eyebrow">Notes / feedback (optional)</label>
            <textarea
              rows={3}
              className="input-field mt-1.5"
              placeholder="What went well? What to improve next round?"
              value={form.feedback}
              onChange={(e) => setForm({ ...form, feedback: e.target.value })}
            />
          </div>

          <button type="submit" disabled={submitting} className="btn-primary w-full sm:w-auto">
            {submitting ? "Saving..." : "Log interview round"}
          </button>

          {lastResult && (
            <div className="rounded-lg border border-teal/30 bg-teal/10 px-4 py-3 text-sm text-teal">
              Saved — overall score for this round: <strong>{lastResult.overallScore}/10</strong>
            </div>
          )}
        </form>

        <div className="card p-6">
          <p className="label-eyebrow mb-1">Overall Score Trend</p>
          <p className="text-xs text-ink-faint mb-2">Across all rounds, most recent sessions.</p>
          {loading ? <Loader /> : <ProgressLine data={history} dataKey="overallScore" unit="/10" color="#7C6CF0" />}
        </div>
      </div>
    </>
  );
}
