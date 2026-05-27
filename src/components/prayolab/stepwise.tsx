import { BlockMath } from "react-katex";

export type Step = { title: string; tex?: string; note?: string };

export function Stepwise({ steps }: { steps: Step[] }) {
  return (
    <ol className="space-y-3">
      {steps.map((s, i) => {
        const isVerif = /verif/i.test(s.title);
        return (
          <li
            key={i}
            className={`pl-card pl-soft-shadow p-4 min-w-0 ${
              isVerif ? "border-primary/40 bg-primary/5" : ""
            }`}
          >
            <div className="flex items-start gap-2 text-xs text-muted-foreground mb-2">
              <span
                className={`shrink-0 size-5 grid place-items-center rounded-full font-semibold ${
                  isVerif
                    ? "bg-primary text-primary-foreground"
                    : "bg-primary text-primary-foreground"
                }`}
              >
                {isVerif ? "✓" : i + 1}
              </span>
              <span className="font-medium text-foreground leading-5 break-words">
                {s.title}
              </span>
            </div>
            {s.tex && (
              <div className="overflow-x-auto max-w-full text-foreground">
                <BlockMath math={s.tex} />
              </div>
            )}
            {s.note && (
              <p className="text-xs pl-step-note mt-2 break-words whitespace-pre-wrap">
                {s.note}
              </p>
            )}
          </li>
        );
      })}
    </ol>
  );
}