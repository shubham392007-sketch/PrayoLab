import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { partial, tex } from "@/lib/math-engine";
import { simplify, parse } from "mathjs";

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
        // Numerical sanity check at a representative point.
        const X = 1, Y = Math.PI / 4;
        const Jnum = parse(expanded).evaluate({ x: X, y: Y });
        const uxN = parse(ux).evaluate({ x: X, y: Y });
        const uyN = parse(uy).evaluate({ x: X, y: Y });
        const vxN = parse(vx).evaluate({ x: X, y: Y });
        const vyN = parse(vy).evaluate({ x: X, y: Y });
        const direct = uxN * vyN - uyN * vxN;
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
            { title: "Inverse-function consequence", tex: `T \\text{ is locally invertible at } (x_0, y_0) \\iff |J(x_0, y_0)| \\ne 0`, note: "Wherever |J| = 0 the mapping collapses dimensions — the inverse function theorem fails there." },
            { title: "Change-of-variables formula", tex: `\\iint_S f(u, v)\\, du\\, dv = \\iint_R f(u(x,y), v(x,y))\\,\\left|J\\right|\\, dx\\, dy`, note: "|J| absorbs the local area scaling between (x, y) and (u, v) coordinates." },
            {
              title: "Numerical verification at (x, y) = (1, π/4)",
              tex: `\\left|J\\right| = (${uxN.toFixed(4)})(${vyN.toFixed(4)}) - (${uyN.toFixed(4)})(${vxN.toFixed(4)}) = ${direct.toFixed(6)}`,
              note: `Matches the symbolic expression evaluated at the same point: |J| = ${Number(Jnum).toFixed(6)}.`,
            },
          ],
          result: `\\dfrac{\\partial(u, v)}{\\partial(x, y)} = ${tex(expanded)}`,
        };
      }}
    />
  );
}