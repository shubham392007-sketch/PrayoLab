import { createFileRoute, Link } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { useAuth } from "@/lib/auth-store";
import { useSaved } from "@/lib/saved-store";
import { ArrowRight, FlaskConical, LineChart, BookOpen, Dumbbell, Sigma, FileText } from "lucide-react";

export const Route = createFileRoute("/dashboard")({ component: Dashboard });

function Dashboard() {
  const user = useAuth((s) => s.user);
  const { reports, activity } = useSaved();

  return (
    <WorkspaceShell title={`Welcome back, ${user?.fullName?.split(" ")[0] ?? "Student"}.`} subtitle="Pick up where you left off — or open a new laboratory.">
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="space-y-6">
          <div className="pl-card pl-soft-shadow p-6 bg-foreground text-background relative overflow-hidden">
            <div className="absolute inset-0 pl-grid-bg opacity-10" />
            <div className="relative grid md:grid-cols-2 gap-6 items-center">
              <div>
                <div className="pl-chip bg-white/10 border-white/10 text-white/70">Matrix Laboratory</div>
                <h2 className="text-2xl font-semibold tracking-tight mt-3">Solve matrices visually with stepwise reasoning.</h2>
                <p className="text-white/70 text-sm mt-2">Determinants, inverse, Cramer's rule, eigenvalues — beautifully derived.</p>
                <Link to="/labs/matrices" className="inline-flex items-center gap-1 mt-4 px-4 h-10 rounded-full bg-primary text-primary-foreground text-sm font-medium">Open Matrix Lab <ArrowRight className="size-4" /></Link>
              </div>
              <svg viewBox="0 0 320 160" className="w-full">
                {Array.from({length:24}).map((_,i)=>(
                  <path key={i} d={`M 10 ${30+i*5} Q 160 ${5+Math.sin(i/2)*30} 310 ${30+i*5}`} fill="none" stroke="oklch(0.92 0.22 122)" strokeOpacity={0.2+i*0.025} strokeWidth="0.9"/>
                ))}
              </svg>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: FlaskConical, t: "Virtual Labs", d: "15+ interactive engineering math labs.", to: "/labs" },
              { icon: LineChart, t: "Graph Visualizer", d: "2D / 3D / contour / vector field plots.", to: "/graph-visualizer" },
              { icon: BookOpen, t: "Theory Library", d: "Searchable theorems and derivations.", to: "/theory" },
              { icon: Dumbbell, t: "Practice Arena", d: "Timed problems by topic & difficulty.", to: "/practice" },
              { icon: Sigma, t: "Stepwise Engine", d: "Every solution, broken down.", to: "/labs/matrices" },
              { icon: FileText, t: "Reports", d: "Saved derivations and exports.", to: "/reports" },
            ].map((c) => (
              <Link key={c.t} to={c.to} className="pl-card pl-soft-shadow p-5 group hover:border-foreground/20 transition">
                <c.icon className="size-5 text-muted-foreground group-hover:text-foreground" />
                <div className="mt-3 font-medium">{c.t}</div>
                <div className="text-xs text-muted-foreground mt-1">{c.d}</div>
              </Link>
            ))}
          </div>

          <div className="pl-card pl-soft-shadow p-5">
            <div className="flex items-center justify-between">
              <div className="font-medium">Recent Activity</div>
              <Link to="/saved-work" className="text-xs text-muted-foreground hover:text-foreground">View all</Link>
            </div>
            <ul className="mt-3 divide-y divide-border">
              {activity.slice(0, 5).map((a) => (
                <li key={a.id} className="py-3 flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    <span className="size-8 rounded-md bg-secondary grid place-items-center text-xs pl-mono">{a.kind[0]}</span>
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <div className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</div>
                    </div>
                  </div>
                  <span className="text-xs text-muted-foreground">{a.kind}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-4">
          <div className="pl-card pl-soft-shadow p-5">
            <div className="text-xs text-muted-foreground">Your progress</div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">156 <span className="text-sm text-muted-foreground font-normal">problems solved</span></div>
            <div className="mt-4 grid grid-cols-12 gap-1">
              {Array.from({length:60}).map((_,i)=>(
                <span key={i} className={`h-3 rounded ${i % 4 ? "bg-primary/80" : "bg-secondary"}`}/>
              ))}
            </div>
          </div>
          <div className="pl-card pl-soft-shadow p-5">
            <div className="text-sm font-medium mb-3">Recent reports</div>
            <ul className="space-y-2 text-sm">
              {reports.slice(0, 4).map((r) => (
                <li key={r.id} className="flex items-center justify-between gap-2">
                  <span className="truncate">{r.title}</span>
                  <span className="text-[10px] uppercase tracking-wide text-muted-foreground">{r.kind}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </WorkspaceShell>
  );
}