import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { ArrowLeft, BarChart3, Eye, Users, Calendar } from "lucide-react";

export const Route = createFileRoute("/analytics")({
  head: () => ({
    meta: [
      { title: "Analytics Dashboard — ARC" },
      { name: "description", content: "Live visit analytics for the ARC portfolio." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AnalyticsPage,
});

type Data = { total: number; builder: number; recruiter: number; daily: Record<string, number>; firstSeen: number };

function AnalyticsPage() {
  const [data, setData] = useState<Data | null>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("arc-analytics");
      setData(raw ? JSON.parse(raw) : { total: 0, builder: 0, recruiter: 0, daily: {}, firstSeen: Date.now() });
    } catch {
      setData({ total: 0, builder: 0, recruiter: 0, daily: {}, firstSeen: Date.now() });
    }
  }, []);

  if (!data) return null;

  const today = new Date();
  const days: [string, number][] = [];
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    days.push([dateStr, data.daily[dateStr] || 0]);
  }
  const max = Math.max(1, ...days.map(([, v]) => v));

  const stats = [
    { label: "Total Visits", value: data.total, icon: Eye },
    { label: "Builder Mode", value: data.builder, icon: BarChart3 },
    { label: "Recruiter Mode", value: data.recruiter, icon: Users },
    { label: "Tracking Since", value: new Date(data.firstSeen).toLocaleDateString(), icon: Calendar },
  ];

  return (
    <motion.main
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="min-h-screen pt-24 pb-20"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6">
          <ArrowLeft className="size-4" /> Back
        </Link>
        <p className="font-mono text-xs text-primary tracking-widest mb-3">// TELEMETRY</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold tracking-tight">Analytics Dashboard</h1>
        <p className="mt-3 text-muted-foreground">Privacy-friendly, on-device visit tracking. No cookies, no third parties.</p>

        <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass rounded-2xl p-5"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-muted-foreground tracking-widest">{s.label.toUpperCase()}</span>
                <s.icon className="size-4 text-primary" />
              </div>
              <div className="mt-3 font-display text-3xl font-bold text-gradient">{s.value}</div>
            </motion.div>
          ))}
        </div>

        <div className="mt-10 glass rounded-2xl p-6">
          <h2 className="font-display text-lg font-semibold mb-6">Last 14 Days</h2>
          {days.length === 0 ? (
            <p className="text-sm text-muted-foreground">No data yet — visit the homepage to start tracking.</p>
          ) : (
            <div className="flex items-end gap-2 h-48">
              {days.map(([d, v]) => (
                <div key={d} className="flex-1 flex flex-col items-center gap-2 group">
                  <div className="text-[10px] font-mono text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">{v}</div>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(v / max) * 100}%` }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="w-full rounded-t-md bg-gradient-to-t from-primary/40 to-secondary/80 min-h-1"
                  />
                  <div className="text-[10px] font-mono text-muted-foreground">{d.slice(5)}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={() => { localStorage.removeItem("arc-analytics"); setData({ total: 0, builder: 0, recruiter: 0, daily: {}, firstSeen: Date.now() }); }}
          className="mt-6 text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
        >
          Reset local analytics
        </button>
      </div>
    </motion.main>
  );
}
