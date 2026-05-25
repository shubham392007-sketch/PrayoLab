import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { partial, tex } from "@/lib/math-engine";

export const Route = createFileRoute("/labs/partial-differentiation")({ component: Page });

function Page() {
  return (
    <ComputedLab
      title="Partial Differentiation"
      subtitle="Compute first and second-order partial derivatives."
      fields={[{ name: "expr", label: "f(x, y)", defaultValue: "x^2*y + sin(x*y)" }]}
      compute={({ expr }) => {
        const fx = partial(expr, "x");
        const fy = partial(expr, "y");
        const fxx = partial(fx, "x");
        const fyy = partial(fy, "y");
        const fxy = partial(fx, "y");
        const fyx = partial(fy, "x");
        const D = `(${fxx})*(${fyy}) - (${fxy})^2`;
        return {
          steps: [
            { title: "Given function", tex: `f(x, y) = ${tex(expr)}` },
            { title: "First partial w.r.t. x — treat y as a constant", tex: `f_x = \\dfrac{\\partial f}{\\partial x} = ${tex(fx)}`, note: "Apply ordinary differentiation rules to x while y is frozen." },
            { title: "First partial w.r.t. y — treat x as a constant", tex: `f_y = \\dfrac{\\partial f}{\\partial y} = ${tex(fy)}` },
            { title: "Gradient vector", tex: `\\nabla f = \\left(f_x,\\ f_y\\right) = \\left(${tex(fx)},\\ ${tex(fy)}\\right)`, note: "Points in the direction of steepest ascent of f." },
            { title: "Second partial fₓₓ — differentiate fₓ w.r.t. x", tex: `f_{xx} = \\dfrac{\\partial}{\\partial x}\\left(${tex(fx)}\\right) = ${tex(fxx)}` },
            { title: "Second partial f_yy — differentiate f_y w.r.t. y", tex: `f_{yy} = \\dfrac{\\partial}{\\partial y}\\left(${tex(fy)}\\right) = ${tex(fyy)}` },
            { title: "Mixed partial fₓᵧ — differentiate fₓ w.r.t. y", tex: `f_{xy} = \\dfrac{\\partial}{\\partial y}\\left(${tex(fx)}\\right) = ${tex(fxy)}` },
            { title: "Mixed partial f_yx — differentiate f_y w.r.t. x", tex: `f_{yx} = \\dfrac{\\partial}{\\partial x}\\left(${tex(fy)}\\right) = ${tex(fyx)}`, note: "By Clairaut's theorem, if both mixed partials are continuous, fₓᵧ = f_yx." },
            { title: "Hessian matrix", tex: `H(f) = \\begin{bmatrix} f_{xx} & f_{xy} \\\\ f_{yx} & f_{yy} \\end{bmatrix} = \\begin{bmatrix} ${tex(fxx)} & ${tex(fxy)} \\\\ ${tex(fyx)} & ${tex(fyy)} \\end{bmatrix}` },
            { title: "Discriminant for the second-derivative test", tex: `D = f_{xx} f_{yy} - f_{xy}^2 = ${tex(D)}`, note: "Used to classify critical points where ∇f = 0." },
          ],
          result: `\\nabla f = \\left(${tex(fx)},\\ ${tex(fy)}\\right)`,
        };
      }}
    />
  );
}