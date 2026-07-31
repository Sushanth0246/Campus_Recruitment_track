import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const COLORS = ["#F5A623", "#2DD4BF", "#7C6CF0", "#EF6461"];

export default function CategoryBar({ data = [], xKey = "area", barKey = "score" }) {
  if (!data.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-ink-faint">
        No data yet for this module.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#2A3050" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "#5E6489", fontSize: 10 }} axisLine={{ stroke: "#2A3050" }} tickLine={false} interval={0} angle={-15} textAnchor="end" height={50} />
        <YAxis domain={[0, 100]} tick={{ fill: "#5E6489", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#171B2E", border: "1px solid #2A3050", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#E7E9F5" }}
        />
        <Bar dataKey={barKey} radius={[6, 6, 0, 0]}>
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
