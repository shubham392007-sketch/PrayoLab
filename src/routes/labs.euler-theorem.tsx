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
        const xfx = simplify(`x*(${fx})`).toString();
        const yfy = simplify(`y*(${fy})`).toString();
        const lhs = simplify(`(${xfx}) + (${yfy})`).toString();
        const rhs = simplify(`(${n})*(${expr})`).toString();
        const diff = simplify(`(${lhs}) - (${rhs})`).toString();
        // Scaling check: f(tx, ty) / f(x, y) at sample point — should equal t^n.
        const t = 1.4, X = 1.7, Y = -0.9;
        const num = parse(expr).evaluate({ x: t * X, y: t * Y });
        const den = parse(expr).evaluate({ x: X, y: Y });
        const ratio = num / den;
        const inferredN = Math.log(Math.abs(ratio)) / Math.log(t);
        const test = parse(diff).evaluate({ x: X, y: Y });
        const ok = Math.abs(test) < 1e-8;
        return {
          steps: [
            { title: "Given function", tex: `f(x, y) = ${tex(expr)}` },
            { title: "Definition recap", tex: `f(tx, ty) = t^n\\, f(x, y)`, note: "Homogeneous of degree n means scaling both variables by t scales the output by tⁿ." },
            { title: "Numerical degree check", note: `Sample at (x, y) = (${X}, ${Y}) and scale by t = ${t}: f(tx,ty)/f(x,y) = ${ratio.toFixed(6)}, so n ≈ log(ratio)/log(t) = ${inferredN.toFixed(4)}.` },
            { title: "Partial derivative w.r.t. x", tex: `f_x = ${tex(fx)}` },
            { title: "Partial derivative w.r.t. y", tex: `f_y = ${tex(fy)}` },
            { title: "Form x · fₓ", tex: `x\\,f_x = ${tex(xfx)}` },
            { title: "Form y · f_y", tex: `y\\,f_y = ${tex(yfy)}` },
            { title: "Sum the two terms (LHS of Euler's identity)", tex: `x f_x + y f_y = ${tex(lhs)}` },
            { title: "Compute n · f (RHS)", tex: `${n}\\,f = ${tex(rhs)}` },
            { title: "Compare LHS and RHS", tex: `\\text{LHS} - \\text{RHS} = ${tex(diff)}` },
            { title: "Final numerical verification at (1.7, -0.9)", note: `Residual ≈ ${test.toExponential(3)} (${ok ? "verified: f is homogeneous of degree " + n : "f is NOT homogeneous of degree " + n + " — try n ≈ " + inferredN.toFixed(2)})` },
          ],
          result: ok
            ? `x f_x + y f_y = ${n}\\, f \\quad\\checkmark`
            : `\\text{Function is not homogeneous of degree } ${n}`,
        };
      }}
    />
  );
}