export default function StatCard({ label, value, accent = "amber", suffix = "", icon: Icon }) {
  const accentMap = {
    amber: "text-amber",
    teal: "text-teal",
    violet: "text-violet",
    coral: "text-coral",
  };

  return (
    <div className="card flex h-full items-start justify-between p-5">
      <div>
        <p className="label-eyebrow">{label}</p>
        <p className={`mt-2 text-3xl font-display font-bold tabular-score ${accentMap[accent]}`}>
          {value}
          <span className="text-base text-ink-faint font-body ml-1">{suffix}</span>
        </p>
      </div>
      {Icon && (
        <div className={`h-10 w-10 rounded-lg bg-surfaceAlt flex items-center justify-center ${accentMap[accent]}`}>
          <Icon size={20} />
        </div>
      )}
    </div>
  );
}
