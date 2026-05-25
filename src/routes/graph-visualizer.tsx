import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { Plotly } from "@/components/prayolab/plot";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { safeEval } from "@/lib/math-engine";
import { derivative, parse } from "mathjs";

export const Route = createFileRoute("/graph-visualizer")({ component: GV });

type Mode = "2D" | "3D" | "Contour" | "Polar" | "Parametric";

const PALETTE = [
  "oklch(0.62 0.22 256)", // blue
  "oklch(0.62 0.22 28)",  // red
  "oklch(0.65 0.18 150)", // green
  "oklch(0.7 0.22 80)",   // amber
  "oklch(0.62 0.22 310)", // magenta
];

/** Split f(x), g(x) into separate expressions while respecting parentheses. */
function splitExpressions(input: string): string[] {
  const out: string[] = [];
  let buf = "", depth = 0;
  for (const ch of input) {
    if (ch === "(" || ch === "[") depth++;
    else if (ch === ")" || ch === "]") depth--;
    if (ch === "," && depth === 0) { if (buf.trim()) out.push(buf.trim()); buf = ""; }
    else buf += ch;
  }
  if (buf.trim()) out.push(buf.trim());
  return out;
}

/** Sample a 1-D function with break detection so vertical asymptotes do not draw spurious lines. */
function sample1D(expr: string, varName: string, lo: number, hi: number, n: number) {
  let node: ReturnType<typeof parse> | null = null;
  try { node = parse(expr); } catch { return { xs: [], ys: [] }; }
  const xs: (number | null)[] = [], ys: (number | null)[] = [];
  let prev: number | null = null;
  for (let i = 0; i <= n; i++) {
    const x = lo + (i / n) * (hi - lo);
    let y: number;
    try { y = Number(node.evaluate({ [varName]: x })); } catch { y = NaN; }
    if (!Number.isFinite(y)) { xs.push(null); ys.push(null); prev = null; continue; }
    // Break the trace if successive y values jump dramatically (likely asymptote).
    if (prev !== null && Math.abs(y - prev) > 1e3 * (Math.abs(hi - lo) || 1)) {
      xs.push(null); ys.push(null);
    }
    xs.push(x); ys.push(y); prev = y;
  }
  return { xs, ys };
}

function GV() {
  const [mode, setMode] = useState<Mode>("2D");
  const [expr, setExpr] = useState("sin(sqrt(x^2 + y^2))");
  const [expr2d, setExpr2d] = useState("sin(x) * cos(x/3), x^2/8");
  const [exprX, setExprX] = useState("cos(3*t)");
  const [exprY, setExprY] = useState("sin(2*t)");
  const [range, setRange] = useState(6);
  const [resolution, setResolution] = useState(80);
  const [grid, setGrid] = useState(true);
  const [showDeriv, setShowDeriv] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const data = useMemo(() => {
    setError(null);
    try {
      if (mode === "2D") {
        const exprs = splitExpressions(expr2d);
        const N = Math.max(200, Math.min(2000, resolution * 25));
        const traces: any[] = [];
        exprs.forEach((e, i) => {
          const { xs, ys } = sample1D(e, "x", -range, range, N);
          traces.push({
            x: xs, y: ys, type: "scatter", mode: "lines",
            name: `f${exprs.length > 1 ? i + 1 : ""}(x) = ${e}`,
            line: { color: PALETTE[i % PALETTE.length], width: 2.5, shape: "spline" },
            connectgaps: false,
            hovertemplate: "x = %{x:.4f}<br>y = %{y:.4f}<extra></extra>",
          });
          if (showDeriv) {
            try {
              const d = derivative(e, "x").toString();
              const { xs: dx, ys: dy } = sample1D(d, "x", -range, range, N);
              traces.push({
                x: dx, y: dy, type: "scatter", mode: "lines",
                name: `f${exprs.length > 1 ? i + 1 : ""}'(x)`,
                line: { color: PALETTE[i % PALETTE.length], width: 1.5, dash: "dot" },
                connectgaps: false, opacity: 0.7,
              });
            } catch {/* skip non-differentiable */}
          }
        });
        return traces;
      }
      if (mode === "Polar") {
        const exprs = splitExpressions(expr2d);
        const N = Math.max(400, Math.min(4000, resolution * 50));
        return exprs.map((e, i) => {
          const t: number[] = [], r: number[] = [];
          const node = parse(e.replace(/\bx\b/g, "t"));
          for (let k = 0; k <= N; k++) {
            const theta = (k / N) * Math.PI * 2;
            t.push((theta * 180) / Math.PI);
            let rv: number;
            try { rv = Number(node.evaluate({ t: theta })); } catch { rv = NaN; }
            r.push(Number.isFinite(rv) ? rv : 0);
          }
          return {
            r, theta: t, type: "scatterpolar", mode: "lines",
            name: `r = ${e}`,
            line: { color: PALETTE[i % PALETTE.length], width: 2.5 },
          };
        });
      }
      if (mode === "Parametric") {
        const N = Math.max(400, Math.min(4000, resolution * 50));
        const nx = parse(exprX), ny = parse(exprY);
        const xs: number[] = [], ys: number[] = [];
        for (let k = 0; k <= N; k++) {
          const tt = -Math.PI + (k / N) * 2 * Math.PI * range / 6;
          xs.push(Number(nx.evaluate({ t: tt })));
          ys.push(Number(ny.evaluate({ t: tt })));
        }
        return [{
          x: xs, y: ys, type: "scatter", mode: "lines",
          line: { color: PALETTE[0], width: 2.5 },
          name: `(x(t), y(t))`,
        }];
      }
      // 3D / Contour
      const N = Math.max(30, Math.min(160, resolution));
      const xs: number[] = [], ys: number[] = [];
      for (let i = 0; i < N; i++) {
        xs.push(-range + (i / (N - 1)) * 2 * range);
        ys.push(-range + (i / (N - 1)) * 2 * range);
      }
      const node = parse(expr);
      const z: number[][] = ys.map((y) => xs.map((x) => {
        try { const v = Number(node.evaluate({ x, y })); return Number.isFinite(v) ? v : 0; } catch { return 0; }
      }));
      if (mode === "Contour") return [{ x: xs, y: ys, z, type: "contour", colorscale: "Viridis", contours: { coloring: "heatmap", showlabels: true }, ncontours: 20 }];
      return [{ x: xs, y: ys, z, type: "surface", colorscale: "Viridis", showscale: true, contours: { z: { show: true, project: { z: true }, usecolormap: true } } }];
    } catch (e: any) {
      setError(e?.message ?? "Invalid expression");
      return [];
    }
  }, [mode, expr, expr2d, exprX, exprY, range, resolution, showDeriv]);

  const gridColor = "rgba(120,120,120,0.18)";
  const axisColor = "rgba(120,120,120,0.55)";
  const layout: any = {
    margin: { t: 20, l: 40, r: 10, b: 40 }, autosize: true,
    paper_bgcolor: "transparent", plot_bgcolor: "transparent",
    font: { family: "Inter, system-ui, sans-serif", size: 12 },
    showlegend: mode === "2D" || mode === "Polar",
    legend: { orientation: "h", x: 0, y: -0.15, bgcolor: "transparent" },
    scene: {
      xaxis: { title: "x", backgroundcolor: "transparent", gridcolor: gridColor, zerolinecolor: axisColor },
      yaxis: { title: "y", backgroundcolor: "transparent", gridcolor: gridColor, zerolinecolor: axisColor },
      zaxis: { title: "z", backgroundcolor: "transparent", gridcolor: gridColor, zerolinecolor: axisColor },
      aspectmode: "cube",
      camera: { eye: { x: 1.6, y: 1.6, z: 1.1 } },
    },
    xaxis: { title: "x", gridcolor: grid ? gridColor : "transparent", zeroline: true, zerolinecolor: axisColor, zerolinewidth: 1.2, showline: true, linecolor: axisColor, mirror: true },
    yaxis: { title: mode === "2D" ? "y" : "y", gridcolor: grid ? gridColor : "transparent", zeroline: true, zerolinecolor: axisColor, zerolinewidth: 1.2, showline: true, linecolor: axisColor, mirror: true, scaleanchor: mode === "Parametric" ? "x" : undefined },
    polar: { bgcolor: "transparent", radialaxis: { gridcolor: gridColor }, angularaxis: { gridcolor: gridColor } },
  };

  const showExpr3D = mode === "3D" || mode === "Contour";
  const showExpr1D = mode === "2D" || mode === "Polar";

  return (
    <WorkspaceShell title="Graph Visualizer" subtitle="Professional scientific plotting environment.">
      <div className="grid lg:grid-cols-[280px_1fr_280px] gap-4">
        <aside className="pl-card pl-soft-shadow p-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Graph Type</Label>
            <Select value={mode} onValueChange={(v) => setMode(v as Mode)}>
              <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
              <SelectContent>{(["2D","3D","Contour","Polar","Parametric"] as Mode[]).map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          {showExpr1D && (
            <div>
              <Label className="text-xs text-muted-foreground">{mode === "Polar" ? "r(θ) — use ‘x’ for θ, separate with commas" : "f(x) — separate multiple with commas"}</Label>
              <Input value={expr2d} onChange={(e) => setExpr2d(e.target.value)} className="pl-mono mt-1.5" />
            </div>
          )}
          {showExpr3D && (
            <div>
              <Label className="text-xs text-muted-foreground">z = f(x, y)</Label>
              <Input value={expr} onChange={(e) => setExpr(e.target.value)} className="pl-mono mt-1.5" />
            </div>
          )}
          {mode === "Parametric" && (
            <div className="space-y-3">
              <div>
                <Label className="text-xs text-muted-foreground">x(t)</Label>
                <Input value={exprX} onChange={(e) => setExprX(e.target.value)} className="pl-mono mt-1.5" />
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">y(t)</Label>
                <Input value={exprY} onChange={(e) => setExprY(e.target.value)} className="pl-mono mt-1.5" />
              </div>
            </div>
          )}
          {error && <div className="text-xs text-destructive">{error}</div>}
          <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border">
            Supported: <span className="pl-mono">+ − * / ^</span>, <span className="pl-mono">sin cos tan asin acos atan exp log sqrt abs</span>, <span className="pl-mono">pi e</span>.
          </div>
        </aside>

        <div className="pl-card pl-soft-shadow p-2 h-[600px]">
          <Plotly data={data as any} layout={layout} useResizeHandler style={{ width: "100%", height: "100%" }} config={{ responsive: true, displaylogo: false, displayModeBar: true, scrollZoom: true }} />
        </div>

        <aside className="pl-card pl-soft-shadow p-4 space-y-4">
          <div>
            <Label className="text-xs text-muted-foreground">Range  ±{range}</Label>
            <Slider className="mt-2" value={[range]} min={1} max={30} step={1} onValueChange={([v]) => setRange(v)} />
          </div>
          <div>
            <Label className="text-xs text-muted-foreground">Resolution  {resolution}</Label>
            <Slider className="mt-2" value={[resolution]} min={30} max={160} step={5} onValueChange={([v]) => setResolution(v)} />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between"><span>Grid</span><Switch checked={grid} onCheckedChange={setGrid} /></div>
            {showExpr1D && (
              <div className="flex items-center justify-between"><span>Show derivative</span><Switch checked={showDeriv} onCheckedChange={setShowDeriv} /></div>
            )}
          </div>
          <Button className="w-full rounded-full" variant="outline" onClick={() => { setRange(6); setResolution(80); setExpr("sin(sqrt(x^2 + y^2))"); setExpr2d("sin(x) * cos(x/3), x^2/8"); setShowDeriv(false); }}>Reset View</Button>
        </aside>
      </div>
    </WorkspaceShell>
  );
}