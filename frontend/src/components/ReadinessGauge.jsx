// Signature element: a hall-ticket-stamp style circular readiness gauge.
// Score is out of 1000 to feel distinct from a plain percentage.
export default function ReadinessGauge({ score = 0, size = 180 }) {
  const pct = Math.min(Math.max(score / 1000, 0), 1);
  const radius = (size - 20) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - pct);

  const tier =
    score >= 750 ? { label: "Interview Ready", color: "#2DD4BF" } :
    score >= 500 ? { label: "On Track", color: "#F5A623" } :
    { label: "Needs Focus", color: "#EF6461" };

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="#2A3050" strokeWidth="12" fill="none" />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={tier.color}
          strokeWidth="12"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="tabular-score text-4xl font-bold text-ink">{score}</span>
        <span className="text-[11px] text-ink-faint tracking-wide">out of 1000</span>
        <span
          className="mt-1.5 pill border"
          style={{ color: tier.color, borderColor: `${tier.color}55`, backgroundColor: `${tier.color}15` }}
        >
          {tier.label}
        </span>
      </div>
    </div>
  );
}
