import { useState } from "react";
import { LabShell } from "./lab-shell";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Stepwise, type Step } from "./stepwise";
import { F } from "./formula";
import { exportDerivationPDF } from "@/lib/pdf-export";
import { useSaved } from "@/lib/saved-store";
import { toast } from "sonner";

export type ComputedLabProps = {
  title: string;
  subtitle?: string;
  fields: { name: string; label: string; placeholder?: string; defaultValue?: string }[];
  compute: (values: Record<string, string>) => { steps: Step[]; result?: string };
};

export function ComputedLab({ title, subtitle, fields, compute }: ComputedLabProps) {
  const init = Object.fromEntries(fields.map((f) => [f.name, f.defaultValue ?? ""]));
  const [vals, setVals] = useState<Record<string, string>>(init);
  const [out, setOut] = useState<{ steps: Step[]; result?: string } | null>(null);
  const addReport = useSaved((s) => s.addReport);
  const log = useSaved((s) => s.logActivity);

  return (
    <LabShell title={title} subtitle={subtitle} right={
      <div className="flex gap-2">
        <Button variant="outline" className="rounded-full" disabled={!out}
          onClick={() => { if (out) { exportDerivationPDF({ title, subtitle, steps: out.steps, result: out.result }); toast.success("PDF downloaded"); } }}>
          Export PDF
        </Button>
        <Button variant="outline" className="rounded-full" disabled={!out}
          onClick={() => { if (out) { addReport({ kind: "Other", title: `${title} report`, summary: out.result ? out.result.slice(0, 120) : subtitle }); toast.success("Saved to Reports"); } }}>
          Save report
        </Button>
      </div>
    }>
      <div className="grid lg:grid-cols-[340px_1fr] gap-6">
        <div className="pl-card pl-soft-shadow p-5 space-y-4">
          {fields.map((f) => (
            <div key={f.name} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">{f.label}</Label>
              <Input className="pl-mono" placeholder={f.placeholder} value={vals[f.name]} onChange={(e) => setVals((p) => ({ ...p, [f.name]: e.target.value }))} />
            </div>
          ))}
          <Button onClick={() => { try { const r = compute(vals); setOut(r); log({ kind: "Other", title: `Solved ${title}` }); } catch (e: any) { setOut({ steps: [{ title: "Error", note: e?.message }] }); } }} className="w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90">Solve</Button>
        </div>
        <div className="pl-card pl-soft-shadow p-5">
          <div className="text-sm font-medium mb-3">Stepwise Solution</div>
          {out ? (
            <div className="space-y-4">
              <Stepwise steps={out.steps} />
              {out.result && (
                <div className="pl-card bg-primary/10 border-primary/30 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Final Result</div>
                  <div className="overflow-x-auto"><F block>{out.result}</F></div>
                </div>
              )}
            </div>
          ) : <div className="text-sm text-muted-foreground">Enter inputs and press Solve to derive the answer step by step.</div>}
        </div>
      </div>
    </LabShell>
  );
}
