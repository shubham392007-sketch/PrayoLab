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
        return {
          steps: [
            { title: "Given f(x, y)", tex: `f(x, y) = ${tex(expr)}` },
            { title: "∂f/∂x (treat y constant)", tex: `f_x = ${tex(fx)}` },
            { title: "∂f/∂y (treat x constant)", tex: `f_y = ${tex(fy)}` },
            { title: "Second order ∂²f/∂x²", tex: `f_{xx} = ${tex(fxx)}` },
            { title: "Second order ∂²f/∂y²", tex: `f_{yy} = ${tex(fyy)}` },
            { title: "Mixed partial ∂²f/∂x∂y", tex: `f_{xy} = ${tex(fxy)}` },
          ],
          result: `\\nabla f = \\left(${tex(fx)},\\ ${tex(fy)}\\right)`,
        };
      }}
    />
  );
}