import { useEffect, useState } from "react";
import { Trophy } from "lucide-react";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import Topbar from "../components/Topbar";
import Loader from "../components/Loader";

const rankStyles = {
  1: "text-amber border-amber/40 bg-amber/10",
  2: "text-ink-muted border-border bg-surfaceAlt",
  3: "text-coral border-coral/30 bg-coral/10",
};

export default function Leaderboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/dashboard/leaderboard").then(({ data }) => setData(data)).finally(() => setLoading(false));
  }, []);

  if (loading) return <Loader label="Loading leaderboard" />;

  return (
    <>
      <Topbar title="Leaderboard" subtitle="Ranked by Readiness Index across aptitude, coding & interviews" />

      <div className="card overflow-hidden">
        <div className="grid grid-cols-12 px-5 py-3 text-[11px] uppercase tracking-wide text-ink-faint border-b border-border">
          <span className="col-span-1">Rank</span>
          <span className="col-span-5">Student</span>
          <span className="col-span-2 text-center">Aptitude</span>
          <span className="col-span-2 text-center">Coding</span>
          <span className="col-span-2 text-right">Readiness</span>
        </div>
        {data.leaderboard.map((u) => (
          <div
            key={u.userId}
            className={`grid grid-cols-12 items-center px-5 py-3.5 border-b border-border last:border-0 ${
              u.userId === user?._id ? "bg-amber/5" : ""
            }`}
          >
            <span className="col-span-1">
              <span
                className={`inline-flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold ${
                  rankStyles[u.rank] || "text-ink-muted border-border bg-surfaceAlt"
                }`}
              >
                {u.rank <= 3 ? <Trophy size={13} /> : u.rank}
              </span>
            </span>
            <span className="col-span-5 flex items-center gap-2.5 min-w-0">
              <span
                className="h-8 w-8 rounded-full flex items-center justify-center text-xs font-display font-bold text-base shrink-0"
                style={{ backgroundColor: u.avatarColor }}
              >
                {u.name?.[0]?.toUpperCase()}
              </span>
              <span className="min-w-0">
                <p className="text-sm font-medium truncate">
                  {u.name} {u.userId === user?._id && <span className="text-amber text-xs ml-1">(You)</span>}
                </p>
                <p className="text-xs text-ink-faint truncate">{u.college || "—"}</p>
              </span>
            </span>
            <span className="col-span-2 text-center text-sm tabular-score text-ink-muted">{u.breakdown.aptitude}</span>
            <span className="col-span-2 text-center text-sm tabular-score text-ink-muted">{u.breakdown.coding}</span>
            <span className="col-span-2 text-right text-base font-bold tabular-score text-amber">{u.readinessScore}</span>
          </div>
        ))}
        {data.leaderboard.length === 0 && (
          <p className="p-6 text-sm text-ink-faint">No students have logged activity yet.</p>
        )}
      </div>
    </>
  );
}
