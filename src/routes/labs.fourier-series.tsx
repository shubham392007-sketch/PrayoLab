import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LabShell } from "@/components/prayolab/lab-shell";
import { Plotly } from "@/components/prayolab/plot";
import { fourierCoeffs, fourierEval, fmt } from "@/lib/math-engine";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { useSaved } from "@/lib/saved-store";

export const Route = createFileRoute("/labs/fourier-series")({ component: FourierLab });

const PRESETS: Record<string, (x: number) => number> = {
  "Square wave": (x) => (Math.sin(x) >= 0 ? 1 : -1),
  "Sawtooth": (x) => (x / Math.PI) - Math.floor(0.5 + x / (2 * Math.PI)) * 2,
  "Triangle": (x) => (2 / Math.PI) * Math.asin(Math.sin(x)),
  "f(x) = x": (x) => x,
};

function FourierLab() {
  const [preset, setPreset] = useState<keyof typeof PRESETS>("Square wave");
  const [N, setN] = useState(8);
  const [showOriginal, setShowOriginal] = useState(true);
  const [showPartial, setShowPartial] = useState(true);
  const [showHarmonics, setShowHarmonics] = useState(true);
  const log = useSaved((s) => s.logActivity);

  const L = Math.PI;
  const f = PRESETS[preset];

  const data = useMemo(() => {
    const c = fourierCoeffs(f, L, Math.max(N, 10));
    const xs: number[] = [];
    const orig: number[] = [];
    const approx: number[] = [];
    for (let i = 0; i < 400; i++) {
      const x = -L + (i / 399) * 2 * L;
      xs.push(x); orig.push(f(x)); approx.push(fourierEval(c, L, x, N));
    }
    const harmonics: { name: string; y: number[] }[] = [];
    for (let n = 1; n <= Math.min(N, 4); n++) {
      const yh = xs.map((x) => c.a[n - 1] * Math.cos((n * Math.PI * x) / L) + c.b[n - 1] * Math.sin((n * Math.PI * x) / L));
      harmonics.push({ name: `n=${n}`, y: yh });
    }
    return { xs, orig, approx, coeffs: c, harmonics };
  }, [preset, N]);

  const traces: any[] = [];
  if (showOriginal) traces.push({ x: data.xs, y: data.orig, type: "scatter", mode: "lines", line: { color: "#111", width: 2 }, name: "f(x)" });
  if (showPartial) traces.push({ x: data.xs, y: data.approx, type: "scatter", mode: "lines", line: { color: "oklch(0.92 0.22 122)", width: 2.5 }, name: `S_${N}(x)` });

  return (
    <LabShell
      title="Fourier Series Laboratory"
      subtitle="Decompose periodic signals into sines and cosines."
      right={<Button variant="outline" className="rounded-full" onClick={() => { log({ kind: "Fourier", title: `Fourier on ${preset}, N=${N}` }); alert("Exported."); }}>Export Results</Button>}
    >
      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        <div className="pl-card pl-soft-shadow p-5">
          <div className="text-sm font-medium">Fourier Series Visualization</div>
          <div className="h-[420px]">
            <Plotly
              data={traces}
              layout={{
                margin: { t: 20, l: 36, r: 8, b: 30 }, autosize: true, showlegend: true,
                paper_bgcolor: "transparent", plot_bgcolor: "transparent",
                xaxis: { gridcolor: "#eee", zerolinecolor: "#ddd" }, yaxis: { gridcolor: "#eee", zerolinecolor: "#ddd" },
              }}
              useResizeHandler style={{ width: "100%", height: "100%" }}
              config={{ displayModeBar: false, responsive: true }}
            />
          </div>

          {showHarmonics && (
            <div className="mt-4">
              <div className="text-sm font-medium mb-2">Harmonic Components</div>
              <div className="h-[200px]">
                <Plotly
                  data={data.harmonics.map((h, i) => ({
                    x: data.xs, y: h.y, type: "scatter", mode: "lines", name: h.name,
                    line: { width: 1.5, color: `oklch(0.6 0.18 ${20 + i * 60})` },
                  }))}
                  layout={{
                    margin: { t: 10, l: 36, r: 8, b: 30 }, autosize: true, showlegend: true,
                    paper_bgcolor: "transparent", plot_bgcolor: "transparent",
                    xaxis: { gridcolor: "#eee" }, yaxis: { gridcolor: "#eee" },
                  }}
                  useResizeHandler style={{ width: "100%", height: "100%" }}
                  config={{ displayModeBar: false, responsive: true }}
                />
              </div>
            </div>
          )}
        </div>

        <aside className="space-y-4">
          <div className="pl-card pl-soft-shadow p-5 space-y-4">
            <div>
              <Label className="text-xs text-muted-foreground">Input Function</Label>
              <Select value={preset} onValueChange={(v) => setPreset(v as any)}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{Object.keys(PRESETS).map((k) => <SelectItem key={k} value={k}>{k}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs text-muted-foreground">Interval: [-π, π]</Label>
            </div>
            <div>
              <div className="flex justify-between items-center">
                <Label className="text-xs text-muted-foreground">Number of Terms (n)</Label>
                <span className="text-xs pl-mono">{N}</span>
              </div>
              <Slider value={[N]} min={1} max={30} step={1} onValueChange={([v]) => setN(v)} className="mt-3" />
            </div>
            <div className="space-y-2 pt-2">
              <Toggle label="Original Function" value={showOriginal} onChange={setShowOriginal} />
              <Toggle label="Partial Sum" value={showPartial} onChange={setShowPartial} />
              <Toggle label="Harmonics" value={showHarmonics} onChange={setShowHarmonics} />
            </div>
          </div>

          <div className="pl-card pl-soft-shadow p-5">
            <div className="text-sm font-medium">Coefficients</div>
            <div className="mt-3 text-xs pl-mono grid grid-cols-3 gap-2">
              <div className="text-muted-foreground">n</div><div className="text-muted-foreground">a_n</div><div className="text-muted-foreground">b_n</div>
              <div>0</div><div>{fmt(data.coeffs.a0, 3)}</div><div>—</div>
              {data.coeffs.a.slice(0, 6).map((a, i) => (
                <>
                  <div key={`n${i}`}>{i + 1}</div>
                  <div key={`a${i}`}>{fmt(a, 3)}</div>
                  <div key={`b${i}`}>{fmt(data.coeffs.b[i], 3)}</div>
                </>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </LabShell>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}