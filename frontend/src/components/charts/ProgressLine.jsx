import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function ProgressLine({ data = [], dataKey, xKey = "date", color = "#F5A623", unit = "" }) {
  if (!data.length) {
    return (
      <div className="flex h-56 items-center justify-center text-sm text-ink-faint">
        No sessions logged yet — your trend line will appear here.
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={220}>
      <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid stroke="#2A3050" strokeDasharray="3 3" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fill: "#5E6489", fontSize: 11 }} axisLine={{ stroke: "#2A3050" }} tickLine={false} />
        <YAxis tick={{ fill: "#5E6489", fontSize: 11 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{ background: "#171B2E", border: "1px solid #2A3050", borderRadius: 8, fontSize: 12 }}
          labelStyle={{ color: "#E7E9F5" }}
          formatter={(value) => [`${value}${unit}`, ""]}
        />
        <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2.5} dot={{ r: 3, fill: color }} activeDot={{ r: 5 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
