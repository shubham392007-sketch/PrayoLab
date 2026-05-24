import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { partial, tex } from "@/lib/math-engine";
import { parse, simplify } from "mathjs";

export const Route = createFileRoute("/labs/euler-theorem")({ component: Page });

function Page() {
  return (
    <ComputedLab
      title="Euler's Theorem"
      subtitle="Verify x f_x + y f_y = n · f for homogeneous functions of degree n."
      fields={[
        { name: "expr", label: "f(x, y)", defaultValue: "x^3 + 3*x^2*y + y^3" },
        { name: "n", label: "Claimed degree n", defaultValue: "3" },
      ]}
      compute={({ expr, n }) => {
        const fx = partial(expr, "x");
        const fy = partial(expr, "y");
        const lhs = simplify(`(${"x"})*(${fx}) + (${"y"})*(${fy})`).toString();
        const rhs = simplify(`(${n})*(${expr})`).toString();
        const diff = simplify(`(${lhs}) - (${rhs})`).toString();
        // Sample test
        const test = parse(diff).evaluate({ x: 1.7, y: -0.9 });
        const ok = Math.abs(test) < 1e-8;
        return {
          steps: [
            { title: "Given f(x, y)", tex: `f = ${tex(expr)}` },
            { title: "Partials", tex: `f_x = ${tex(fx)},\\quad f_y = ${tex(fy)}` },
            { title: "Compute x f_x + y f_y", tex: `${tex(lhs)}` },
            { title: "Compare with n f", tex: `${n} f = ${tex(rhs)}` },
            { title: "Numerical check at (1.7, -0.9)", note: `Residual ≈ ${test.toExponential(3)} (${ok ? "OK — homogeneous of degree " + n : "Not exactly degree " + n})` },
          ],
          result: ok
            ? `x f_x + y f_y = ${n}\\, f \\quad\\checkmark`
            : `\\text{Function is not homogeneous of degree } ${n}`,
        };
      }}
    />
  );
}