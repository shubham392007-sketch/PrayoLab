import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { tex } from "@/lib/math-engine";
import { derivative, parse, simplify } from "mathjs";

export const Route = createFileRoute("/labs/expansions")({ component: Page });

function factorial(n: number) { let r = 1; for (let i = 2; i <= n; i++) r *= i; return r; }

function Page() {
  return (
    <ComputedLab
      title="Function Expansions"
      subtitle="Taylor / Maclaurin series expansion around a point."
      fields={[
        { name: "expr", label: "f(x)", defaultValue: "exp(x)" },
        { name: "a", label: "Center a", defaultValue: "0" },
        { name: "n", label: "Order n", defaultValue: "5" },
      ]}
      compute={({ expr, a, n }) => {
        const center = parseFloat(a || "0");
        const order = Math.max(1, Math.min(10, parseInt(n || "5", 10)));
        const steps: { title: string; tex?: string }[] = [{ title: "Given function", tex: `f(x) = ${tex(expr)}` }];
        const terms: string[] = [];
        let cur = expr;
        for (let k = 0; k <= order; k++) {
          const val = parse(cur).evaluate({ x: center });
          const coef = val / factorial(k);
          if (Math.abs(coef) > 1e-12) {
            const sign = coef >= 0 ? "+" : "-";
            const ac = Math.abs(coef);
            terms.push(`${sign} ${ac.toFixed(6)} (x${center === 0 ? "" : ` - ${center}`})^{${k}}`);
          }
          steps.push({ title: `Term k=${k}`, tex: `\\frac{f^{(${k})}(${center})}{${k}!}(x-${center})^{${k}} = ${coef.toFixed(6)} (x-${center})^{${k}}` });
          cur = simplify(derivative(cur, "x")).toString();
        }
        const series = terms.join(" ").replace(/^\+\s*/, "");
        return { steps, result: `f(x) \\approx ${series}` };
      }}
    />
  );
}