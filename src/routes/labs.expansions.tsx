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
        const steps: { title: string; tex?: string; note?: string }[] = [
          { title: "Given function and expansion centre", tex: `f(x) = ${tex(expr)},\\quad a = ${center},\\quad \\text{order } n = ${order}` },
          { title: "Taylor series formula", tex: `f(x) = \\sum_{k=0}^{\\infty} \\dfrac{f^{(k)}(a)}{k!}(x - a)^k` },
        ];
        const terms: string[] = [];
        let cur = expr;
        for (let k = 0; k <= order; k++) {
          const fkTex = tex(cur);
          const val = parse(cur).evaluate({ x: center });
          const coef = val / factorial(k);
          if (Math.abs(coef) > 1e-12) {
            const sign = coef >= 0 ? "+" : "-";
            const ac = Math.abs(coef);
            terms.push(`${sign} ${ac.toFixed(6)} (x${center === 0 ? "" : ` - ${center}`})^{${k}}`);
          }
          steps.push({ title: `Order k = ${k} — derivative`, tex: `f^{(${k})}(x) = ${fkTex}` });
          steps.push({ title: `Evaluate at x = ${center}`, tex: `f^{(${k})}(${center}) = ${val.toFixed(6)}` });
          steps.push({ title: `Form the k = ${k} term`, tex: `\\dfrac{f^{(${k})}(${center})}{${k}!}(x - ${center})^{${k}} = \\dfrac{${val.toFixed(6)}}{${factorial(k)}}(x - ${center})^{${k}} = ${coef.toFixed(6)} (x - ${center})^{${k}}` });
          cur = simplify(derivative(cur, "x")).toString();
        }
        const series = terms.join(" ").replace(/^\+\s*/, "");
        steps.push({ title: "Add all retained terms", note: `Truncation error is O((x − a)^${order + 1}) by Taylor's theorem.` });
        return { steps, result: `f(x) \\approx ${series}` };
      }}
    />
  );
}