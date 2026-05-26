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
          { title: "Strategy", note: "Compute the k-th derivative f⁽ᵏ⁾(x), evaluate at x = a, divide by k!, and multiply by (x − a)ᵏ. Stop at k = n; the remainder is O((x − a)ⁿ⁺¹) by Taylor's theorem." },
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
        steps.push({ title: "Sum the retained terms", tex: `P_{${order}}(x) = ${series}`, note: `Polynomial Taylor approximation of f around a = ${center}.` });
        // Verification at a nearby probe point.
        const probe = center + 0.1;
        const exact = parse(expr).evaluate({ x: probe });
        // Reconstruct polynomial value.
        let cur2 = expr;
        let approx = 0;
        for (let k = 0; k <= order; k++) {
          const val = parse(cur2).evaluate({ x: center });
          approx += (val / factorial(k)) * Math.pow(probe - center, k);
          cur2 = simplify(derivative(cur2, "x")).toString();
        }
        steps.push({
          title: `Verification at the probe point x = ${probe.toFixed(2)}`,
          tex: `P_{${order}}(${probe.toFixed(2)}) = ${approx.toFixed(8)},\\quad f(${probe.toFixed(2)}) = ${Number(exact).toFixed(8)}`,
          note: `Absolute error ≈ ${Math.abs(Number(exact) - approx).toExponential(3)} — consistent with the O((x − a)^${order + 1}) bound.`,
        });
        steps.push({ title: "Remainder bound (Lagrange form)", tex: `R_{${order}}(x) = \\dfrac{f^{(${order + 1})}(\\xi)}{(${order + 1})!}(x - ${center})^{${order + 1}}`, note: "ξ lies between a and x; controls the worst-case truncation error." });
        return { steps, result: `f(x) \\approx ${series}` };
      }}
    />
  );
}