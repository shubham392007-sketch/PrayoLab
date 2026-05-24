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
        const A = parse(fxx).evaluate({ x: X, y: Y });
        const B = parse(fxy).evaluate({ x: X, y: Y });
        const C = parse(fyy).evaluate({ x: X, y: Y });
        const D = A * C - B * B;
        let verdict = "Saddle point";
        if (D > 0 && A > 0) verdict = "Local minimum";
        else if (D > 0 && A < 0) verdict = "Local maximum";
        else if (Math.abs(D) < 1e-12) verdict = "Inconclusive (D = 0)";
        return {
          steps: [
            { title: "f(x, y)", tex: `f = ${tex(expr)}` },
            { title: "Gradient", tex: `\\nabla f = (${tex(fx)},\\ ${tex(fy)})` },
            { title: "Hessian entries", tex: `f_{xx} = ${tex(fxx)},\\ f_{yy} = ${tex(fyy)},\\ f_{xy} = ${tex(fxy)}` },
            { title: `Evaluate at (${x0}, ${y0})`, tex: `A = ${A},\\ B = ${B},\\ C = ${C}` },
            { title: "Discriminant", tex: `D = AC - B^2 = ${D}` },
          ],
          result: `\\text{${verdict}}`,
        };
      }}
    />
  );
}