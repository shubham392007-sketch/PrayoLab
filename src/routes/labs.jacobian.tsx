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
        const J = simplify(`(${ux})*(${vy}) - (${uy})*(${vx})`).toString();
        return {
          steps: [
            { title: "Map", tex: `u = ${tex(u)},\\quad v = ${tex(v)}` },
            { title: "Partials", tex: `\\dfrac{\\partial u}{\\partial x} = ${tex(ux)},\\ \\dfrac{\\partial u}{\\partial y} = ${tex(uy)}` },
            { title: "Partials", tex: `\\dfrac{\\partial v}{\\partial x} = ${tex(vx)},\\ \\dfrac{\\partial v}{\\partial y} = ${tex(vy)}` },
            { title: "Jacobian matrix", tex: `J = \\begin{vmatrix} u_x & u_y \\\\ v_x & v_y \\end{vmatrix}` },
            { title: "Determinant", tex: `|J| = u_x v_y - u_y v_x` },
          ],
          result: `\\dfrac{\\partial(u, v)}{\\partial(x, y)} = ${tex(J)}`,
        };
      }}
    />
  );
}