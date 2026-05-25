import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { partial, tex } from "@/lib/math-engine";
import { simplify } from "mathjs";

export const Route = createFileRoute("/labs/jacobian")({ component: Page });

function Page() {
  return (
    <ComputedLab
      title="Jacobian"
      subtitle="Compute the Jacobian determinant of (u(x,y), v(x,y))."
      fields={[
        { name: "u", label: "u(x, y)", defaultValue: "x*cos(y)" },
        { name: "v", label: "v(x, y)", defaultValue: "x*sin(y)" },
      ]}
      compute={({ u, v }) => {
        const ux = partial(u, "x"), uy = partial(u, "y");
        const vx = partial(v, "x"), vy = partial(v, "y");
        const expanded = simplify(`(${ux})*(${vy}) - (${uy})*(${vx})`).toString();
        return {
          steps: [
            { title: "Given mapping", tex: `u(x, y) = ${tex(u)},\\quad v(x, y) = ${tex(v)}` },
            { title: "Compute ∂u/∂x — differentiate u w.r.t. x, treat y constant", tex: `u_x = \\dfrac{\\partial u}{\\partial x} = ${tex(ux)}` },
            { title: "Compute ∂u/∂y — differentiate u w.r.t. y, treat x constant", tex: `u_y = \\dfrac{\\partial u}{\\partial y} = ${tex(uy)}` },
            { title: "Compute ∂v/∂x", tex: `v_x = \\dfrac{\\partial v}{\\partial x} = ${tex(vx)}` },
            { title: "Compute ∂v/∂y", tex: `v_y = \\dfrac{\\partial v}{\\partial y} = ${tex(vy)}` },
            { title: "Assemble the Jacobian matrix", tex: `J = \\begin{bmatrix} u_x & u_y \\\\ v_x & v_y \\end{bmatrix} = \\begin{bmatrix} ${tex(ux)} & ${tex(uy)} \\\\ ${tex(vx)} & ${tex(vy)} \\end{bmatrix}` },
            { title: "Jacobian determinant formula", tex: `\\left|J\\right| = u_x\\,v_y - u_y\\,v_x` },
            { title: "Substitute the partials", tex: `\\left|J\\right| = \\left(${tex(ux)}\\right)\\left(${tex(vy)}\\right) - \\left(${tex(uy)}\\right)\\left(${tex(vx)}\\right)` },
            { title: "Simplify", tex: `\\left|J\\right| = ${tex(expanded)}`, note: "|J| is the local oriented area scaling factor of the map." },
          ],
          result: `\\dfrac{\\partial(u, v)}{\\partial(x, y)} = ${tex(expanded)}`,
        };
      }}
    />
  );
}