import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/practice")({ component: Page });

const Qs = [
  { q: "Solve the system using Cramer's Rule.", opts: ["x=1, y=2, z=-1","x=2, y=3, z=-1","x=3, y=-2, z=1","x=-3, y=2, z=-1"], a: 1 },
  { q: "Find the determinant of a 2×2 identity matrix.", opts: ["0","1","-1","2"], a: 1 },
];

function Page() {
  return (
    <WorkspaceShell title="Practice Arena" subtitle="Sharpen skills with curated problems.">
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="pl-card pl-soft-shadow p-6">
          <div className="flex justify-between text-xs text-muted-foreground"><span>Question 1 of 20</span><span className="pl-mono">00:24:15</span></div>
          <p className="mt-3 font-medium">{Qs[0].q}</p>
          <div className="mt-4 space-y-2">
            {Qs[0].opts.map((o, i) => (
              <label key={i} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${i===Qs[0].a?"border-primary bg-primary/10":"border-border hover:bg-secondary"}`}>
                <span className="size-5 rounded-full border grid place-items-center text-xs">{String.fromCharCode(65+i)}</span>{o}
              </label>
            ))}
          </div>
          <div className="mt-5 flex gap-2"><Button variant="outline" className="rounded-full">Previous</Button><Button className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 ml-auto">Submit</Button></div>
        </div>
        <aside className="space-y-4">
          <div className="pl-card pl-soft-shadow p-5">
            <div className="text-sm font-medium mb-3">Progress</div>
            <div className="grid grid-cols-10 gap-1">{Array.from({length:20}).map((_,i)=><span key={i} className={`h-6 rounded ${i<7?"bg-primary":"bg-secondary"}`}/>)}</div>
          </div>
          <div className="pl-card pl-soft-shadow p-5">
            <div className="text-sm font-medium mb-3">Performance</div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Accuracy</span><span>85%</span></div>
            <div className="flex justify-between text-sm mt-2"><span className="text-muted-foreground">Score</span><span>17 / 20</span></div>
          </div>
        </aside>
      </div>
    </WorkspaceShell>
  );
}
