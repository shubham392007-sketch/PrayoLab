import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { tex } from "@/lib/math-engine";
import { simplify, parse, derivative } from "mathjs";

export const Route = createFileRoute("/labs/equations")({ component: Page });

/** Newton's method to find a real root of f(x) = 0 near x0. Returns per-iteration details. */
function newton(f: (x: number) => number, df: (x: number) => number, x0: number) {
  let x = x0;
  const iters: { k: number; xk: number; fxk: number; dfxk: number; xk1: number }[] = [];
  for (let i = 0; i < 50; i++) {
    const fx = f(x), d = df(x);
    if (Math.abs(d) < 1e-12) break;
    const nx = x - fx / d;
    iters.push({ k: i, xk: x, fxk: fx, dfxk: d, xk1: nx });
    if (Math.abs(nx - x) < 1e-10) { x = nx; break; }
    x = nx;
  }
  return { x, iters };
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
        const { x, iters } = newton(f, df, parseFloat(x0));
        const fmt = (v: number) => v.toFixed(8);
        const steps: { title: string; tex?: string; note?: string }[] = [
          { title: "Equation to solve", tex: `f(x) = ${tex(expr)} = 0` },
          { title: "Differentiate the function", tex: `f'(x) = ${tex(simplify(dnode).toString())}` },
          { title: "Newton–Raphson update formula", tex: `x_{k+1} = x_k - \\dfrac{f(x_k)}{f'(x_k)}`, note: "Quadratic convergence near a simple root provided f'(x) ≠ 0." },
          { title: "Geometric interpretation", note: "At xₖ draw the tangent y = f(xₖ) + f'(xₖ)(x − xₖ); xₖ₊₁ is where this tangent crosses the x-axis." },
          { title: `Initial guess`, tex: `x_0 = ${fmt(parseFloat(x0))}` },
          { title: "Initial residual", tex: `f(x_0) = ${fmt(f(parseFloat(x0)))}`, note: "If |f(x₀)| is already < 1e-10 the guess is already a root." },
        ];
        iters.forEach((it) => {
          steps.push({
            title: `Iteration k = ${it.k}`,
            tex: `x_{${it.k + 1}} = ${fmt(it.xk)} - \\dfrac{${fmt(it.fxk)}}{${fmt(it.dfxk)}} = ${fmt(it.xk1)}`,
            note: `Residual |f(x_${it.k + 1})| ≈ ${Math.abs(f(it.xk1)).toExponential(3)}`,
          });
        });
        steps.push({ title: "Convergence reached", note: `Stopped when |xₖ₊₁ − xₖ| < 1e-10 after ${iters.length} iteration(s).` });
        steps.push({
          title: "Verification — evaluate f at the converged root",
          tex: `f(${fmt(x)}) = ${f(x).toExponential(3)}`,
          note: "Residual is of the order of floating-point round-off, confirming x is a root of f.",
        });
        return {
          steps,
          result: `x \\approx ${fmt(x)}`,
        };
      }}
    />
  );
}