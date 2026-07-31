import { useEffect, useState } from "react";
import { ExternalLink, CheckCircle2 } from "lucide-react";
import api from "../api/axios";
import Topbar from "../components/Topbar";
import Loader from "../components/Loader";
import CategoryBar from "../components/charts/CategoryBar";

const TOPICS = ["All", "Arrays", "Strings", "Linked List", "Trees & Graphs", "Dynamic Programming", "Recursion", "Sorting & Searching"];

const difficultyColor = { Easy: "text-teal", Medium: "text-amber", Hard: "text-coral" };

export default function Coding() {
  const [topic, setTopic] = useState("All");
  const [problems, setProblems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(null);
  const [topicStats, setTopicStats] = useState([]);

  const loadProblems = async (t) => {
    setLoading(true);
    const { data } = await api.get("/coding/problems", t === "All" ? {} : { params: { topic: t } });
    setProblems(data.problems);
    setLoading(false);
  };

  const loadStats = async () => {
    const { data } = await api.get("/coding/history");
    const byTopic = {};
    data.submissions.forEach((s) => {
      if (!byTopic[s.topic]) byTopic[s.topic] = { solved: 0, total: 0 };
      byTopic[s.topic].total += 1;
      if (s.status === "Solved") byTopic[s.topic].solved += 1;
    });
    setTopicStats(
      Object.entries(byTopic).map(([area, v]) => ({ area, score: Math.round((v.solved / v.total) * 100) }))
    );
  };

  useEffect(() => {
    loadProblems(topic);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  useEffect(() => {
    loadStats();
  }, []);

  const logStatus = async (problemId, status) => {
    setLogging(problemId);
    try {
      await api.post("/coding/log", { problemId, status, timeTakenMinutes: 20, confidence: status === "Solved" ? 4 : 2 });
      await loadStats();
    } finally {
      setLogging(null);
    }
  };

  return (
    <>
      <Topbar title="Coding Practice" subtitle="Log your DSA practice to track solve rate per topic" />

      <div className="flex flex-wrap gap-2 mb-5">
        {TOPICS.map((t) => (
          <button
            key={t}
            onClick={() => setTopic(t)}
            className={`pill border transition-colors ${
              topic === t
                ? "bg-teal/15 text-teal border-teal/40"
                : "bg-surfaceAlt text-ink-muted border-border hover:text-ink"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-3">
          {loading ? (
            <Loader label="Loading problems" />
          ) : (
            problems.map((p) => (
              <div key={p._id} className="card p-4 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium text-sm">{p.title}</p>
                    <span className={`text-xs font-semibold ${difficultyColor[p.difficulty]}`}>{p.difficulty}</span>
                  </div>
                  <p className="text-xs text-ink-faint mt-1 truncate">{p.description}</p>
                  <div className="flex items-center gap-3 mt-2">
                    {p.link && (
                      <a href={p.link} target="_blank" rel="noreferrer" className="text-xs text-ink-muted hover:text-amber flex items-center gap-1">
                        Solve on original source <ExternalLink size={12} />
                      </a>
                    )}
                  </div>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button
                    disabled={logging === p._id}
                    onClick={() => logStatus(p._id, "Attempted")}
                    className="btn-secondary text-xs px-3 py-2"
                  >
                    Attempted
                  </button>
                  <button
                    disabled={logging === p._id}
                    onClick={() => logStatus(p._id, "Solved")}
                    className="btn-primary text-xs px-3 py-2"
                  >
                    <CheckCircle2 size={14} /> Solved
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="card p-6">
          <p className="label-eyebrow mb-1">Solve Rate by Topic</p>
          <p className="text-xs text-ink-faint mb-2">Percentage of logged attempts marked Solved.</p>
          <CategoryBar data={topicStats} xKey="area" barKey="score" />
        </div>
      </div>
    </>
  );
}
