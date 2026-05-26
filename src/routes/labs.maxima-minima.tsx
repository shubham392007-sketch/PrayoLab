import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { partial, tex } from "@/lib/math-engine";
import { parse } from "mathjs";

export const Route = createFileRoute("/labs/maxima-minima")({ component: Page });

function Page() {
  return (
    <ComputedLab
      title="Maxima & Minima"
      subtitle="Classify a critical point using the Hessian (second derivative test)."
      fields={[
        { name: "expr", label: "f(x, y)", defaultValue: "x^2 + y^2 - 2*x - 4*y + 5" },
        { name: "x0", label: "x*", defaultValue: "1" },
        { name: "y0", label: "y*", defaultValue: "2" },
      ]}
      compute={({ expr, x0, y0 }) => {
        const fx = partial(expr, "x");
        const fy = partial(expr, "y");
        const fxx = partial(fx, "x");
        const fyy = partial(fy, "y");
        const fxy = partial(fx, "y");
        const X = parseFloat(x0), Y = parseFloat(y0);
        const fxAt = parse(fx).evaluate({ x: X, y: Y });
        const fyAt = parse(fy).evaluate({ x: X, y: Y });
        const A = parse(fxx).evaluate({ x: X, y: Y });
        const B = parse(fxy).evaluate({ x: X, y: Y });
        const C = parse(fyy).evaluate({ x: X, y: Y });
        const D = A * C - B * B;
        const fAt = parse(expr).evaluate({ x: X, y: Y });
        let verdict = "Saddle point";
        if (D > 0 && A > 0) verdict = "Local minimum";
        else if (D > 0 && A < 0) verdict = "Local maximum";
        else if (Math.abs(D) < 1e-12) verdict = "Inconclusive (D = 0)";
        const critical = Math.hypot(fxAt, fyAt) < 1e-8;
        return {
          steps: [
            { title: "Given function", tex: `f(x, y) = ${tex(expr)}` },
            { title: "Necessary condition for an extremum", tex: `\\nabla f = (f_x, f_y) = (0, 0)`, note: "Interior critical points are solutions of this 2-variable system." },
            { title: "Compute the gradient", tex: `\\nabla f = \\left(${tex(fx)},\\ ${tex(fy)}\\right)` },
            { title: `Check that (${x0}, ${y0}) is a critical point`, tex: `\\nabla f(${x0}, ${y0}) = \\left(${fxAt},\\ ${fyAt}\\right)`, note: critical ? "Both components vanish — confirmed critical point." : "Gradient is non-zero — this is NOT a critical point; the second-derivative test does not apply." },
            { title: "Second-derivative test setup", tex: `H(f) = \\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{xy} & f_{yy} \\end{bmatrix}` },
            { title: "Symbolic Hessian entries", tex: `f_{xx} = ${tex(fxx)},\\quad f_{yy} = ${tex(fyy)},\\quad f_{xy} = ${tex(fxy)}` },
            { title: `Evaluate Hessian at (${x0}, ${y0})`, tex: `A = f_{xx} = ${A},\\ B = f_{xy} = ${B},\\ C = f_{yy} = ${C}` },
            { title: "Compute the discriminant D = AC − B²", tex: `D = (${A})(${C}) - (${B})^2 = ${D}` },
            { title: "Classification rules", note: "D > 0 & A > 0 ⇒ local minimum; D > 0 & A < 0 ⇒ local maximum; D < 0 ⇒ saddle point; D = 0 ⇒ test is inconclusive (use higher-order analysis)." },
            { title: `Function value at the critical point`, tex: `f(${x0}, ${y0}) = ${Number(fAt).toFixed(6)}`, note: "Useful as the actual extremum value when the verdict is local min/max." },
          ],
          result: `\\text{${verdict}}`,
        };
      }}
    />
  );
}