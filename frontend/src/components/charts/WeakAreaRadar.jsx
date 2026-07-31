import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from "recharts";

export default function WeakAreaRadar({ data = [] }) {
  if (!data.length) {
    return (
      <div className="flex h-64 items-center justify-center text-sm text-ink-faint">
        Practice a few sessions to unlock your area breakdown.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <RadarChart data={data} outerRadius="75%">
        <PolarGrid stroke="#2A3050" />
        <PolarAngleAxis dataKey="subject" tick={{ fill: "#9AA1C4", fontSize: 11 }} />
        <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "#5E6489", fontSize: 10 }} />
        <Radar name="Mastery" dataKey="score" stroke="#F5A623" fill="#F5A623" fillOpacity={0.35} />
        <Tooltip
          contentStyle={{ background: "#171B2E", border: "1px solid #2A3050", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#E7E9F5" }}
        />
      </RadarChart>
    </ResponsiveContainer>
  );
}
