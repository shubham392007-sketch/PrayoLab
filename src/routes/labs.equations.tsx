import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { tex } from "@/lib/math-engine";
import { simplify, parse, derivative } from "mathjs";

export const Route = createFileRoute("/labs/equations")({ component: Page });

/** Newton's method to find a real root of f(x) = 0 near x0. */
function newton(f: (x: number) => number, df: (x: number) => number, x0: number) {
  let x = x0;
  const it: number[] = [x];
  for (let i = 0; i < 50; i++) {
    const d = df(x);
    if (Math.abs(d) < 1e-12) break;
    const nx = x - f(x) / d;
    it.push(nx);
    if (Math.abs(nx - x) < 1e-10) { x = nx; break; }
    x = nx;
  }
  return { x, it };
}

function Page() {
  return (
    <ComputedLab
      title="Equation Solver"
      subtitle="Solve f(x) = 0 numerically with Newton–Raphson."
      fields={[
        { name: "expr", label: "Equation f(x) = 0", defaultValue: "x^3 - x - 2" },
        { name: "x0", label: "Initial guess x₀", defaultValue: "1.5" },
      ]}
      compute={({ expr, x0 }) => {
        const node = parse(expr);
        const dnode = derivative(expr, "x");
        const f = (x: number) => node.evaluate({ x });
        const df = (x: number) => dnode.evaluate({ x });
        const { x, it } = newton(f, df, parseFloat(x0));
        return {
          steps: [
            { title: "Equation", tex: `f(x) = ${tex(expr)} = 0` },
            { title: "Derivative", tex: `f'(x) = ${tex(simplify(dnode).toString())}` },
            { title: "Newton iteration", tex: `x_{k+1} = x_k - \\dfrac{f(x_k)}{f'(x_k)}` },
            { title: "Iterations", note: it.map((v, i) => `x${i} = ${v.toFixed(8)}`).join("   ") },
          ],
          result: `x \\approx ${x.toFixed(8)}`,
        };
      }}
    />
  );
}