import { BlockMath } from "react-katex";

export type Step = { title: string; tex?: string; note?: string };

export function Stepwise({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => (
        <li key={i} className="pl-card pl-soft-shadow p-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
            <span className="size-5 grid place-items-center rounded-full bg-primary text-primary-foreground font-semibold">{i + 1}</span>
            <span className="font-medium text-foreground">{s.title}</span>
          </div>
          {s.tex && <div className="overflow-x-auto"><BlockMath math={s.tex} /></div>}
          {s.note && <p className="text-xs text-muted-foreground mt-2">{s.note}</p>}
        </li>
      ))}
    </ol>
  );
}