import { useEffect, useState } from "react";
import { BookOpen, Code2, Users, AlertTriangle } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import StatCard from "../components/StatCard";
import ReadinessGauge from "../components/ReadinessGauge";
import WeakAreaRadar from "../components/charts/WeakAreaRadar";
import Loader from "../components/Loader";

export default function Dashboard() {
  const { user } = useAuth();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    api
      .get("/dashboard/summary")
      .then(({ data }) => setSummary(data))
      .catch(() => setErrorMsg("Couldn't load your dashboard. Make sure the backend server is running."))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading dashboard" />;

  if (errorMsg) {
    return (
      <div className="card p-6 mt-6 border-coral/40 text-coral text-sm">{errorMsg}</div>
    );
  }

  const { readinessScore, weakAreas, radarData, stats } = summary;

  return (
    <>
      <Topbar title={`Hi, ${user?.name?.split(" ")[0]}`} subtitle="Here's where your placement prep stands today." />

      <section className="mt-2 grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]">
        <div className="card flex min-h-[280px] flex-col items-center justify-center p-6">
          <p className="label-eyebrow mb-4">Readiness Index</p>
          <ReadinessGauge score={readinessScore} />
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <StatCard label="Aptitude Sessions" value={stats.aptitudeAttempts} icon={BookOpen} accent="amber" />
          <StatCard label="Problems Solved" value={stats.problemsSolved} icon={Code2} accent="teal" />
          <StatCard label="Mock Interviews" value={stats.mockInterviews} icon={Users} accent="violet" />
          <StatCard label="Weak Areas Flagged" value={weakAreas.length} icon={AlertTriangle} accent="coral" />
        </div>
      </section>

      <section className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className="card p-6">
          <p className="label-eyebrow mb-1">Area Mastery Map</p>
          <p className="mb-2 text-sm text-ink-faint">Score out of 100 across every topic you've practiced.</p>
          <WeakAreaRadar data={radarData} />
        </div>

        <div className="card p-6">
          <p className="label-eyebrow mb-1">Weak Areas</p>
          <p className="mb-4 text-sm text-ink-faint">Below 60/100 mastery — prioritize these next.</p>
          <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
            {weakAreas.length === 0 && (
              <p className="text-sm text-ink-faint">No weak areas detected yet. Keep practicing to populate this.</p>
            )}
            {weakAreas.map((w) => (
              <div key={`${w.type}-${w.area}`} className="rounded-lg border border-border bg-surfaceAlt p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">{w.area}</span>
                  <span className="pill bg-coral/15 text-coral border border-coral/30">{w.score}/100</span>
                </div>
                <p className="text-xs text-ink-faint mt-1.5 leading-relaxed">{w.tip}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
