import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { Plotly } from "@/components/prayolab/plot";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { safeEval } from "@/lib/math-engine";

export const Route = createFileRoute("/graph-visualizer")({ component: GV });

type Mode = "2D" | "3D" | "Contour" | "Polar";

function GV() {
  const [mode, setMode] = useState<Mode>("3D");
  const [expr, setExpr] = useState("sin(sqrt(x^2 + y^2))");
  const [expr2d, setExpr2d] = useState("sin(x) * cos(x/3)");
  const [range, setRange] = useState(6);
  const [grid, setGrid] = useState(true);

  const data = useMemo(() => {
    if (mode === "2D") {
      const xs: number[] = [], ys: number[] = [];
      for (let i = -200; i <= 200; i++) {
        const x = (i / 200) * range; xs.push(x); ys.push(safeEval(expr2d, { x }));
      }
      return [{ x: xs, y: ys, type: "scatter" as const, mode: "lines" as const, line: { color: "oklch(0.5 0.2 250)", width: 2.5 } }];
    }
    if (mode === "Polar") {
      const t: number[] = [], r: number[] = [];
      for (let i = 0; i <= 600; i++) {
        const theta = (i / 600) * Math.PI * 2; t.push((theta * 180) / Math.PI);
        r.push(safeEval(expr2d.replace(/x/g, "t"), { t: theta }));
      }
      return [{ r, theta: t, type: "scatterpolar" as const, mode: "lines" as const, line: { color: "oklch(0.6 0.2 20)", width: 2.5 } }];
    }
    const N = 60;
    const xs: number[] = [], ys: number[] = [];
    for (let i = 0; i < N; i++) {
      xs.push(-range + (i / (N - 1)) * 2 * range);
      ys.push(-range + (i / (N - 1)) * 2 * range);
    }
    const z: number[][] = ys.map((y) => xs.map((x) => safeEval(expr, { x, y })));
    if (mode === "Contour") return [{ x: xs, y: ys, z, type: "contour" as const, colorscale: "Viridis", contours: { coloring: "heatmap" } }];
    return [{ x: xs, y: ys, z, type: "surface" as const, colorscale: "Viridis", showscale: false }];
  }, [mode, expr, expr2d, range]);

  const layout: any = {
    margin: { t: 20, l: 0, r: 0, b: 20 }, autosize: true,
    paper_bgcolor: "transparent", plot_bgcolor: "transparent",
    scene: { xaxis: { backgroundcolor: "transparent" }, yaxis: { backgroundcolor: "transparent" }, zaxis: { backgroundcolor: "transparent" }, aspectmode: "cube" },
    xaxis: { gridcolor: grid ? "#eee" : "transparent" },
    yaxis: { gridcolor: grid ? "#eee" : "transparent" },
    polar: { bgcolor: "transparent" },
  };

  return (
    <WorkspaceShell title="Graph Visualizer" subtitle="Professional scientific plotting environment.">
      <div className="grid lg:grid-cols-[260px_1fr_280px] gap-4">
        <aside className="pl-card pl-soft-shadow p-4 space-y-3">
          <div className="text-sm font-medium">Functions</div>
          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">{mode === "3D" || mode === "Contour" ? "z = f(x, y)" : "f(x)"}</Label>
            {(mode === "3D" || mode === "Contour") ? (
              <Input value={expr} onChange={(e) => setExpr(e.target.value)} className="pl-mono" />
            ) : (
              <Input value={expr2d} onChange={(e) => setExpr2d(e.target.value)} className="pl-mono" />
            )}
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Graph Type</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{(["2D","3D","Contour","Polar"] as Mode[]).map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
        </aside>

        <div className="pl-card pl-soft-shadow p-2 h-[560px]">
          <Plotly data={data as any} layout={layout} useResizeHandler style={{ width: "100%", height: "100%" }} config={{ responsive: true, displaylogo: false }} />
        </div>

        <aside className="pl-card pl-soft-shadow p-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Range</Label>
            <Input type="number" value={range} onChange={(e) => setRange(parseFloat(e.target.value) || 1)} />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Grid</span><Switch checked={grid} onCheckedChange={setGrid} /></div>
            <div className="flex items-center justify-between"><span>Axes</span><Switch defaultChecked /></div>
            <div className="flex items-center justify-between"><span>Legend</span><Switch defaultChecked /></div>
          </div>
          <Button className="w-full rounded-full" variant="outline" onClick={() => { setRange(6); setExpr("sin(sqrt(x^2 + y^2))"); }}>Reset View</Button>
        </aside>
      </div>
    </WorkspaceShell>
  );
}