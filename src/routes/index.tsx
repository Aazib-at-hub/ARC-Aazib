import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect, useMemo } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  Activity, Github, Linkedin, Mail, Download, ExternalLink,
  Cpu, Radar, GitBranch, Target, Terminal, Shield, Power,
  Layers, Compass, Briefcase, ChevronRight, Dot, BarChart3,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ARC — Mohammad Aazib Khan · Software Engineer & AI Engineer · Lucknow" },
      { name: "description", content: "ARC (Aazib Research Console). Software Engineer, AI Engineer, and Full Stack Developer in Lucknow building intelligent systems, automation, and AI products." },
      { name: "keywords", content: "Software Engineer, AI Engineer, Full Stack Developer, Lucknow, React, FastAPI, Python, Node.js, AI Product Builder, Aazib, ARC" },
      { name: "author", content: "Aazib Khan" },
      { property: "og:title", content: "ARC — Aazib Khan · Engineering Console" },
      { property: "og:description", content: "A live operating console for an engineer building intelligent systems." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "geo.region", content: "IN-UP" },
      { name: "geo.placename", content: "Lucknow" },
    ],
    links: [{ rel: "canonical", href: "/" }],
    scripts: [{
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Person",
        name: "Aazib Khan",
        jobTitle: "Software Engineer, AI Engineer, Full Stack Developer",
        url: "/",
        address: { "@type": "PostalAddress", addressLocality: "Lucknow", addressRegion: "Uttar Pradesh", addressCountry: "IN" },
      }),
    }],
  }),
  component: Home,
});

type Mode = "builder" | "recruiter";
type ModuleId = "mission" | "systems" | "evolution" | "arsenal" | "focus" | "recruiter";

function trackPageview(mode: string) {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("arc-analytics");
    const data = raw ? JSON.parse(raw) : { total: 0, builder: 0, recruiter: 0, daily: {} as Record<string, number>, firstSeen: Date.now() };
    data.total += 1;
    if (mode === "builder") data.builder += 1; else data.recruiter += 1;
    const day = new Date().toISOString().slice(0, 10);
    data.daily[day] = (data.daily[day] || 0) + 1;
    localStorage.setItem("arc-analytics", JSON.stringify(data));
  } catch {}
}

const MODULES: { id: ModuleId; label: string; code: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "mission",   label: "Mission Control",  code: "M.01", icon: Compass },
  { id: "systems",   label: "Active Systems",   code: "M.02", icon: Cpu },
  { id: "evolution", label: "Evolution Log",    code: "M.03", icon: GitBranch },
  { id: "arsenal",   label: "Tech Arsenal",     code: "M.04", icon: Radar },
  { id: "focus",     label: "Current Focus",    code: "M.05", icon: Target },
  { id: "recruiter", label: "Recruiter Mode",   code: "M.06", icon: Briefcase },
];

function Home() {
  const [booting, setBooting] = useState(true);
  const [mode, setMode] = useState<Mode>("builder");
  const [active, setActive] = useState<ModuleId>("mission");
  const [hydrated, setHydrated] = useState(false);
  const [clock, setClock] = useState("");

  useEffect(() => {
    const saved = (typeof window !== "undefined" && localStorage.getItem("arc-mode")) as Mode | null;
    if (saved === "builder" || saved === "recruiter") setMode(saved);
    setHydrated(true);
    const t = setTimeout(() => setBooting(false), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem("arc-mode", mode);
    trackPageview(mode);
  }, [mode, hydrated]);

  useEffect(() => {
    const tick = () => {
      const d = new Date();
      setClock(d.toUTCString().slice(17, 25) + " UTC");
    };
    tick();
    const i = setInterval(tick, 1000);
    return () => clearInterval(i);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0c10] text-foreground font-sans selection:bg-primary/30">
      <AnimatePresence>{booting && <BootScreen key="boot" />}</AnimatePresence>

      {/* ambient grid */}
      <div className="pointer-events-none fixed inset-0 opacity-[0.35]"
        style={{
          backgroundImage: "linear-gradient(rgba(120,170,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(120,170,255,0.05) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse at 60% 40%, black 40%, transparent 85%)",
        }}
      />
      <div className="pointer-events-none fixed inset-0 bg-gradient-to-b from-transparent via-transparent to-black/60" />

      <div className="relative z-10 mx-auto flex min-h-screen max-w-[1600px]">
        <ControlPanel active={active} setActive={setActive} mode={mode} setMode={setMode} clock={clock} />
        <main className="flex-1 min-w-0 flex flex-col">
          <TopBar active={active} mode={mode} setMode={setMode} clock={clock} />
          <div className="flex-1 p-4 lg:p-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={mode + active}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25 }}
                className="h-full"
              >
                {mode === "recruiter" ? <RecruiterMode /> : <BuilderModule id={active} />}
              </motion.div>
            </AnimatePresence>
          </div>
          <StatusBar mode={mode} />
        </main>
      </div>
    </div>
  );
}

/* ---------------- Boot ---------------- */

function BootScreen() {
  const lines = [
    "› initializing ARC kernel...",
    "› loading engineering systems...",
    "› loading intelligence modules...",
    "› verifying signatures... OK",
    "› ACCESS GRANTED",
  ];
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#06080b]"
    >
      <div className="w-[min(560px,92vw)] font-mono text-[12px] leading-relaxed text-primary/90">
        <div className="mb-4 flex items-center gap-2 text-foreground">
          <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
          <span className="tracking-[0.3em] text-xs">INITIALIZING ARC</span>
        </div>
        {lines.map((l, i) => (
          <motion.div
            key={l}
            initial={{ opacity: 0, x: -4 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.25 }}
            className={i === lines.length - 1 ? "text-accent mt-2" : ""}
          >
            {l}
          </motion.div>
        ))}
        <div className="mt-4 h-px w-full bg-border overflow-hidden">
          <motion.div initial={{ width: 0 }} animate={{ width: "100%" }} transition={{ duration: 1.6 }} className="h-full bg-primary" />
        </div>
      </div>
    </motion.div>
  );
}

/* ---------------- Control Panel ---------------- */

function ControlPanel({
  active, setActive, mode, setMode, clock,
}: { active: ModuleId; setActive: (m: ModuleId) => void; mode: Mode; setMode: (m: Mode) => void; clock: string }) {
  return (
    <aside className="hidden lg:flex w-[260px] shrink-0 flex-col border-r border-border/70 bg-[#0b0e13]/80 backdrop-blur">
      {/* logo */}
      <div className="p-5 border-b border-border/70">
        <div className="flex items-center gap-2.5">
          <div className="relative h-8 w-8 rounded-md border border-primary/40 bg-primary/10 grid place-items-center">
            <Power className="h-4 w-4 text-primary" />
            <span className="absolute -inset-px rounded-md ring-1 ring-primary/20 animate-pulse" />
          </div>
          <div className="leading-tight">
            <div className="font-display text-sm font-semibold tracking-[0.18em]">ARC</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">Aazib Research Console</div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between text-[10px] uppercase tracking-[0.2em]">
          <span className="text-muted-foreground">System Status</span>
          <span className="flex items-center gap-1.5 text-accent">
            <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />
            ONLINE
          </span>
        </div>
      </div>

      {/* modules */}
      <nav className="flex-1 p-3 space-y-1">
        <div className="px-2 pt-2 pb-1 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Modules</div>
        {MODULES.map((m) => {
          const isActive = (mode === "recruiter" ? "recruiter" : active) === m.id;
          return (
            <button
              key={m.id}
              onClick={() => {
                if (m.id === "recruiter") setMode("recruiter");
                else { setMode("builder"); setActive(m.id); }
              }}
              className={`group w-full flex items-center gap-2.5 rounded-md border px-2.5 py-2 text-left text-sm transition-colors ${
                isActive
                  ? "border-primary/40 bg-primary/10 text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground hover:bg-white/[0.03]"
              }`}
            >
              <m.icon className={`h-4 w-4 ${isActive ? "text-primary" : ""}`} />
              <span className="flex-1">{m.label}</span>
              <span className="text-[10px] font-mono text-muted-foreground/70">{m.code}</span>
            </button>
          );
        })}
      </nav>

      {/* footer status */}
      <div className="m-3 rounded-md border border-border/70 bg-black/40 p-3">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>Current Status</span>
          <span className="font-mono">{clock}</span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full rounded-full bg-primary opacity-75 animate-ping" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
          </span>
          <div className="leading-tight">
            <div className="text-sm font-medium">BUILDING</div>
            <div className="text-[11px] text-muted-foreground">Cortex Engineering</div>
          </div>
        </div>
        <Link to="/analytics" className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground hover:text-foreground">
          <span className="flex items-center gap-1.5"><BarChart3 className="h-3 w-3" /> Analytics</span>
          <ChevronRight className="h-3 w-3" />
        </Link>
      </div>
    </aside>
  );
}

/* ---------------- Top Bar ---------------- */

function TopBar({ active, mode, setMode, clock }: { active: ModuleId; mode: Mode; setMode: (m: Mode) => void; clock: string }) {
  const current = MODULES.find((m) => m.id === (mode === "recruiter" ? "recruiter" : active));
  return (
    <div className="flex items-center justify-between border-b border-border/70 bg-[#0b0e13]/60 px-4 lg:px-6 h-12 backdrop-blur">
      <div className="flex items-center gap-3 text-xs">
        <span className="font-mono text-muted-foreground">arc://</span>
        <span className="font-mono text-muted-foreground">{current?.code}</span>
        <ChevronRight className="h-3 w-3 text-muted-foreground" />
        <span className="font-medium tracking-wide">{current?.label}</span>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden md:flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono">
          <Activity className="h-3 w-3 text-accent" /> {clock}
        </div>
        <ModeSwitch mode={mode} setMode={setMode} />
      </div>
    </div>
  );
}

function ModeSwitch({ mode, setMode }: { mode: Mode; setMode: (m: Mode) => void }) {
  return (
    <div className="relative flex rounded-md border border-border/70 bg-black/40 p-0.5 text-[11px] font-medium">
      {(["builder", "recruiter"] as Mode[]).map((m) => (
        <button
          key={m}
          onClick={() => setMode(m)}
          className={`relative z-10 px-3 py-1 rounded-[5px] capitalize transition-colors ${
            mode === m ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
          }`}
        >
          {mode === m && (
            <motion.span layoutId="modepill" className="absolute inset-0 -z-10 rounded-[5px] bg-primary" transition={{ type: "spring", stiffness: 300, damping: 30 }} />
          )}
          {m}
        </button>
      ))}
    </div>
  );
}

/* ---------------- Status Bar ---------------- */

function StatusBar({ mode }: { mode: Mode }) {
  return (
    <div className="border-t border-border/70 bg-[#0b0e13]/80 px-4 lg:px-6 h-7 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground font-mono">
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-accent" /> link stable</span>
        <span>mode: {mode}</span>
        <span className="hidden md:inline">loc: lucknow.in</span>
      </div>
      <div className="flex items-center gap-4">
        <span>v2.6.0</span>
        <span className="flex items-center gap-1.5"><Shield className="h-3 w-3" /> secure</span>
      </div>
    </div>
  );
}

/* ---------------- Builder Modules ---------------- */

function BuilderModule({ id }: { id: ModuleId }) {
  switch (id) {
    case "mission":   return <MissionControl />;
    case "systems":   return <ActiveSystems />;
    case "evolution": return <EvolutionLog />;
    case "arsenal":   return <TechArsenal />;
    case "focus":     return <CurrentFocus />;
    default:          return null;
  }
}

function Panel({ title, code, children, className = "" }: { title: string; code: string; children: React.ReactNode; className?: string }) {
  return (
    <section className={`rounded-lg border border-border/70 bg-[#0b0e13]/70 ${className}`}>
      <header className="flex items-center justify-between border-b border-border/60 px-4 py-2">
        <div className="flex items-center gap-2">
          <Dot className="h-4 w-4 text-primary" />
          <h2 className="text-[11px] font-medium uppercase tracking-[0.25em] text-foreground/90">{title}</h2>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">{code}</span>
      </header>
      <div className="p-4">{children}</div>
    </section>
  );
}

function MissionControl() {
  return (
    <div className="grid grid-cols-12 gap-4">
      <Panel title="Operator" code="MC.01" className="col-span-12 md:col-span-5">
        <div className="space-y-3">
          <div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Name</div>
            <div className="font-display text-2xl">Aazib Khan</div>
          </div>
          <Field label="Role" value="Software Engineer" />
          <Field label="Location" value="Lucknow, India" />
          <Field label="Clearance" value="Builder · AI Systems" mono />
        </div>
      </Panel>
      <Panel title="Specialization" code="MC.02" className="col-span-12 md:col-span-7">
        <div className="grid grid-cols-3 gap-2">
          {["AI Systems", "Automation", "Full Stack"].map((s, i) => (
            <div key={s} className="rounded-md border border-border/60 bg-black/30 p-3">
              <div className="text-[10px] font-mono text-muted-foreground">SPEC.0{i + 1}</div>
              <div className="mt-1 text-sm font-medium">{s}</div>
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/5">
                <div className="h-full bg-primary" style={{ width: `${85 + i * 4}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Panel>
      <Panel title="Mission Statement" code="MC.03" className="col-span-12">
        <p className="font-display text-xl leading-snug max-w-3xl">
          Building intelligent software that <span className="text-primary">amplifies human capability</span> and transforms ideas into <span className="text-accent">production-ready products</span>.
        </p>
      </Panel>
      <Panel title="Live Telemetry" code="MC.04" className="col-span-12 md:col-span-8">
        <Telemetry />
      </Panel>
      <Panel title="Channels" code="MC.05" className="col-span-12 md:col-span-4">
        <div className="space-y-2">
          {[
            { Icon: Github,   label: "github.com/Aazib-at-hub",  href: "https://github.com/Aazib-at-hub" },
            { Icon: Linkedin, label: "linkedin/in/mohammad-aazib-khan", href: "https://www.linkedin.com/in/mohammad-aazib-khan" },
            { Icon: Mail,     label: "aazib12j@gmail.com",   href: "mailto:aazib12j@gmail.com" },
          ].map(({ Icon, label, href }) => (
            <a key={label} href={href} className="group flex items-center justify-between rounded-md border border-border/60 bg-black/30 px-3 py-2 text-sm hover:border-primary/40 hover:bg-primary/5 transition-colors">
              <span className="flex items-center gap-2"><Icon className="h-4 w-4 text-primary" /> {label}</span>
              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-foreground" />
            </a>
          ))}
        </div>
      </Panel>
    </div>
  );
}

function Field({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{label}</div>
      <div className={`text-sm ${mono ? "font-mono text-primary" : ""}`}>{value}</div>
    </div>
  );
}

function Telemetry() {
  const { data: ghData } = useQuery({
    queryKey: ['github-stats'],
    queryFn: async () => {
      try {
        const [userRes, eventsRes] = await Promise.all([
          fetch('https://api.github.com/users/Aazib-at-hub').then(r => r.json()),
          fetch('https://api.github.com/users/Aazib-at-hub/events?per_page=100').then(r => r.json())
        ]);
        
        let commitsThisWeek = 0;
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const activityMap = new Array(40).fill(0);

        if (Array.isArray(eventsRes)) {
          eventsRes.forEach((event: any) => {
            if (event.type === 'PushEvent') {
              const eventDate = new Date(event.created_at);
              if (eventDate > oneWeekAgo) {
                commitsThisWeek += event.payload.commits?.length || 0;
              }
              const diffTime = Math.abs(new Date().getTime() - eventDate.getTime());
              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
              if (diffDays < 40) {
                activityMap[39 - diffDays] += (event.payload.commits?.length || 1) * 10;
              }
            }
          });
        }
        
        const maxActivity = Math.max(...activityMap, 1);
        const bars = activityMap.map(a => Math.round(30 + (a / maxActivity) * 70));

        return {
          commitsWk: commitsThisWeek.toString(),
          repos: userRes.public_repos?.toString() || "0",
          followers: userRes.followers?.toString() || "0",
          bars
        };
      } catch (e) {
        return null;
      }
    }
  });

  const bars = ghData?.bars || Array.from({ length: 40 }, () => Math.round(30 + Math.random() * 70));
  const stats = ghData ? [
    { k: "commits/wk", v: ghData.commitsWk },
    { k: "repos", v: ghData.repos },
    { k: "followers", v: ghData.followers },
    { k: "focus", v: "deep" },
  ] : [
    { k: "commits/wk", v: "..." },
    { k: "repos", v: "..." },
    { k: "followers", v: "..." },
    { k: "focus", v: "deep" },
  ];

  return (
    <div>
      <div className="flex h-24 items-end gap-1">
        {bars.map((h, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }}
            animate={{ height: `${h}%` }}
            transition={{ delay: i * 0.015, duration: 0.4 }}
            className="flex-1 rounded-sm bg-gradient-to-t from-primary/30 to-primary"
          />
        ))}
      </div>
      <div className="mt-3 grid grid-cols-4 gap-3 text-center">
        {stats.map((s) => (
          <div key={s.k} className="rounded-md border border-border/60 bg-black/30 py-2">
            <div className="font-display text-base">{s.v}</div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{s.k}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Active Systems ---------------- */

const SYSTEMS = [
  { name: "Tabbed",             status: "Operational",        health: 98,  type: "Chrome Extension · AI", stack: ["Chrome Ext", "TypeScript", "AI"], href: "https://chromewebstore.google.com/detail/tabbed-%E2%80%94-ai-prompt-optimi/fmdokfngejkknpnlfggljkgpjlogfikl" },
  { name: "AHX Labs",           status: "Operational",        health: 100, type: "Independent Software Studio", stack: ["Studio", "R&D", "Product"], href: "https://ahxlabs.vercel.app/" },
  { name: "Cortex Engineering", status: "Under Construction", health: 42,  type: "Intelligence Platform", stack: ["Python", "FastAPI", "LLMs"], badge: "Coming Soon" },
];

function ActiveSystems() {
  return (
    <div className="grid grid-cols-12 gap-4">
      {SYSTEMS.map((s, i) => (
        <Panel key={s.name} title={`System / ${s.name}`} code={`SYS.0${i + 1}`} className="col-span-12 md:col-span-6 xl:col-span-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-xl">
                  {s.href ? (
                    <a href={s.href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 group">
                      {s.name}
                      <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                    </a>
                  ) : (
                    s.name
                  )}
                </div>
                <div className="text-xs text-muted-foreground">{s.type}</div>
              </div>
              {s.badge && (
                <span className="rounded-sm border border-accent/40 bg-accent/10 px-1.5 py-0.5 text-[10px] uppercase tracking-wider text-accent">{s.badge}</span>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <Stat label="Status" value={s.status} ok={s.status === "Operational"} />
              <Stat label={s.health === 42 ? "Progress" : "Health"} value={`${s.health}%`} ok={s.health > 90} />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                <span>{s.health === 42 ? "build" : "health"}</span>
                <span className="font-mono">{s.health}%</span>
              </div>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${s.health}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className={`h-full ${s.health > 90 ? "bg-accent" : "bg-primary"}`}
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {s.stack.map((t) => (
                <span key={t} className="rounded-sm border border-border/60 bg-black/30 px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground">{t}</span>
              ))}
            </div>
          </div>
        </Panel>
      ))}
    </div>
  );
}

function Stat({ label, value, ok }: { label: string; value: string; ok: boolean }) {
  return (
    <div className="rounded-md border border-border/60 bg-black/30 px-2 py-1.5">
      <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">{label}</div>
      <div className={`text-sm ${ok ? "text-accent" : "text-primary"}`}>{value}</div>
    </div>
  );
}

/* ---------------- Evolution Log ---------------- */

const MILESTONES = [
  { year: "2024", title: "Foundations", items: ["Learned Web Development", "Contributed to Open-Source Programs", "Built Prompt-Wrompt"] },
  { year: "2025", title: "Acceleration", items: ["Founded AHX Labs", "Learned AI Integrations & Machine Learning", "AI-first product workflows"] },
  { year: "2026", title: "Cortex Era", items: ["Launched Tabbed", "Cortex Engineering", "Productizing intelligence"] },
];

function EvolutionLog() {
  return (
    <Panel title="Evolution Log" code="EVO.01">
      <div className="relative">
        <div className="absolute left-0 right-0 top-7 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="grid grid-cols-3 gap-4">
          {MILESTONES.map((m, i) => (
            <div key={m.year} className="relative">
              <div className="flex items-center gap-2">
                <div className="relative h-3 w-3 rounded-full border border-primary bg-background">
                  <div className="absolute inset-0.5 rounded-full bg-primary animate-pulse" />
                </div>
                <span className="font-mono text-xs text-muted-foreground">NODE.0{i + 1}</span>
              </div>
              <div className="mt-3 rounded-md border border-border/60 bg-black/30 p-3">
                <div className="font-display text-2xl">{m.year}</div>
                <div className="text-xs uppercase tracking-[0.2em] text-primary">{m.title}</div>
                <ul className="mt-3 space-y-1.5 text-sm text-muted-foreground">
                  {m.items.map((it) => (
                    <li key={it} className="flex gap-2"><span className="text-primary">›</span>{it}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ---------------- Tech Arsenal (Radar) ---------------- */

const ARSENAL = [
  { name: "AI",        techs: ["OpenAI", "LangChain", "Vector DBs", "RAG", "Agents"] },
  { name: "Frontend",  techs: ["React", "TypeScript", "Tailwind", "Motion", "Vite"] },
  { name: "Backend",   techs: ["Node.js", "FastAPI", "Python", "tRPC"] },
  { name: "Cloud",     techs: ["Cloudflare", "Vercel", "AWS"] },
  { name: "DevOps",    techs: ["GitHub Actions", "Docker", "Edge"] },
  { name: "Databases", techs: ["Postgres", "Supabase", "Redis"] },
];

function TechArsenal() {
  const [selected, setSelected] = useState<string>(ARSENAL[0].name);
  const sel = ARSENAL.find((a) => a.name === selected)!;
  return (
    <div className="flex flex-col gap-4">
      <Panel title="Radar" code="ARS.01" className="w-full">
        <div className="relative mx-auto aspect-square w-full max-w-[460px]">
          {[1, 2, 3].map((r) => (
            <div key={r} className="absolute inset-0 m-auto rounded-full border border-primary/15" style={{ width: `${r * 30}%`, height: `${r * 30}%` }} />
          ))}
          <div className="absolute inset-0 m-auto h-px w-full bg-primary/10" />
          <div className="absolute inset-0 m-auto w-px h-full bg-primary/10" />
          <motion.div
            className="absolute left-1/2 top-1 h-1/2 w-px origin-bottom bg-gradient-to-t from-primary to-transparent"
            animate={{ rotate: 360 }}
            transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          />
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-primary/40 bg-background px-3 py-1.5 text-[11px] font-mono">
            Engineering Core
          </div>
          {ARSENAL.map((a, i) => {
            const angle = (i / ARSENAL.length) * Math.PI * 2 - Math.PI / 2;
            const x = 50 + Math.cos(angle) * 38;
            const y = 50 + Math.sin(angle) * 38;
            const isSel = selected === a.name;
            return (
              <button
                key={a.name}
                onClick={() => setSelected(a.name)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-md border px-2 py-1 text-[11px] font-mono transition-colors ${
                  isSel ? "border-primary bg-primary/10 text-primary" : "border-border/60 bg-black/40 text-muted-foreground hover:text-foreground"
                }`}
                style={{ left: `${x}%`, top: `${y}%` }}
              >
                {a.name}
              </button>
            );
          })}
        </div>
      </Panel>
      <Panel title={`Node / ${sel.name}`} code="ARS.02" className="w-full">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {sel.techs.map((t, i) => (
            <motion.div
              key={t}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between rounded-md border border-border/60 bg-black/30 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2"><Layers className="h-3.5 w-3.5 text-primary" /> {t}</span>
              <span className="font-mono text-[10px] text-muted-foreground">link.{(i + 1).toString().padStart(2, "0")}</span>
            </motion.div>
          ))}
        </div>
      </Panel>
    </div>
  );
}

/* ---------------- Current Focus ---------------- */

const OBJECTIVES = [
  { code: "01", title: "Engineering Intelligence Systems", progress: 68, note: "Cortex core + agent orchestration" },
  { code: "02", title: "AI Product Development",            progress: 54, note: "Shipping AHX Labs experiments" },
  { code: "03", title: "Developer Productivity Tools",      progress: 81, note: "Tabbed v2, internal workflows" },
];

function CurrentFocus() {
  return (
    <Panel title="Active Objectives" code="OBJ.01">
      <div className="space-y-3">
        {OBJECTIVES.map((o) => (
          <div key={o.code} className="rounded-md border border-border/60 bg-black/30 p-4">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground">OBJECTIVE / {o.code}</div>
                <div className="mt-1 font-display text-lg">{o.title}</div>
                <div className="text-xs text-muted-foreground">{o.note}</div>
              </div>
              <div className="font-mono text-sm text-primary">{o.progress}%</div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${o.progress}%` }}
                transition={{ duration: 1 }}
                className="h-full bg-gradient-to-r from-primary to-accent"
              />
            </div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ---------------- Recruiter Mode ---------------- */

function RecruiterMode() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 py-4">
      <header className="border-b border-border/70 pb-6">
        <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Recruiter Mode · Executive View</div>
        <h1 className="mt-2 font-display text-4xl">Aazib Khan</h1>
        <p className="text-muted-foreground">Software Engineer · AI Engineer · Full Stack Developer — Lucknow, India</p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm">
          <a href="mailto:aazib12j@gmail.com" className="inline-flex items-center gap-1.5 text-foreground hover:text-primary"><Mail className="h-4 w-4" /> aazib12j@gmail.com</a>
          <a href="https://github.com/Aazib-at-hub" className="inline-flex items-center gap-1.5 text-foreground hover:text-primary"><Github className="h-4 w-4" /> GitHub</a>
          <a href="https://www.linkedin.com/in/mohammad-aazib-khan" className="inline-flex items-center gap-1.5 text-foreground hover:text-primary"><Linkedin className="h-4 w-4" /> LinkedIn</a>
        </div>
      </header>

      <Section title="Summary">
        <p className="leading-relaxed text-foreground/90">
          Engineer focused on AI systems, automation, and full-stack product development. I design and ship end-to-end products — from data and ML pipelines to polished interfaces — and currently lead independent R&D at AHX Labs while building Cortex Engineering.
        </p>
      </Section>

      <Section title="Experience">
        <Item title="Developer · Tabbed" date="2026 — Present" body="AI-augmented browser productivity extension used by power users to organize and reason across tabs." />
        <Item title="Developer & AI Engineer · AHX Labs" date="2026 — Present" body=" Independent Software studio for developing & Shipping AI Products, Developer Tools and Automation." />
        <Item title="Freelancer" date="2025 — Present" body="Independent software developer shipping AI products, developer tools, and automation systems." />
        <Item title="Open Source Contributor" date="2024" body="Participated in Hackotberfest & GSSoC Extd.' 24 helping in fixing UI/UX of different Websites." />
      </Section>

      <Section title="Selected Projects">
        <Item title="Cortex Engineering" date="In progress" body="Intelligence platform for agentic engineering workflows. Python · FastAPI · LLMs." />
        <Item title="Tabbed" date="Live" body="Chrome extension applying AI to browser workflows. TypeScript · Chrome APIs." href="https://chromewebstore.google.com/detail/tabbed-%E2%80%94-ai-prompt-optimi/fmdokfngejkknpnlfggljkgpjlogfikl" />
        <Item title="AHX Labs" date="Live" body="Studio site and product surface for ongoing experiments." href="https://ahxlabs.vercel.app/" />
      </Section>

      <Section title="Core Skills">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-1 text-sm text-foreground/90">
          {["TypeScript / React", "Python / FastAPI", "Node.js", "LLMs & RAG", "Postgres / Supabase", "Cloudflare / Vercel", "System Design", "Product Engineering", "Automation"].map((s) => (
            <div key={s}>· {s}</div>
          ))}
        </div>
      </Section>

      <div className="flex flex-wrap items-center gap-3 border-t border-border/70 pt-6">
        <a href="/resume.pdf" download className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          <Download className="h-4 w-4" /> Download Resume
        </a>
        <a href="mailto:aazib12j@gmail.com" className="inline-flex items-center gap-2 rounded-md border border-border px-4 py-2 text-sm hover:border-primary/40">
          <Terminal className="h-4 w-4" /> Let's build something meaningful
        </a>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground mb-3">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

function Item({ title, date, body, href }: { title: string; date: string; body: string; href?: string }) {
  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <div className="font-medium">
          {href ? (
            <a href={href} target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors inline-flex items-center gap-1.5 group">
              {title}
              <ExternalLink className="h-3 w-3 text-muted-foreground group-hover:text-primary transition-colors" />
            </a>
          ) : (
            title
          )}
        </div>
        <div className="font-mono text-xs text-muted-foreground whitespace-nowrap">{date}</div>
      </div>
      <p className="mt-1 text-sm text-muted-foreground">{body}</p>
    </div>
  );
}
