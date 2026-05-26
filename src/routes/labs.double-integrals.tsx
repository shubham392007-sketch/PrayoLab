import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { parse } from "mathjs";
import { tex } from "@/lib/math-engine";

export const Route = createFileRoute("/labs/double-integrals")({ component: Page });

function Page() {
  return (
    <ComputedLab
      title="Double Integrals"
      subtitle="∫∫_R f(x, y) dA over a rectangular region — Simpson 2D."
      fields={[
        { name: "expr", label: "f(x, y)", defaultValue: "x*y" },
        { name: "x0", label: "x from", defaultValue: "0" },
        { name: "x1", label: "x to", defaultValue: "1" },
        { name: "y0", label: "y from", defaultValue: "0" },
        { name: "y1", label: "y to", defaultValue: "1" },
      ]}
      compute={({ expr, x0, x1, y0, y1 }) => {
        const node = parse(expr);
        const a = parseFloat(x0), b = parseFloat(x1), c = parseFloat(y0), d = parseFloat(y1);
        const N = 80;
        const hx = (b - a) / N, hy = (d - c) / N;
        // Inner integral g(y) = ∫_a^b f(x,y) dx via Simpson — show g at a few y to expose the iteration.
        const innerAt = (y: number) => {
          let s = node.evaluate({ x: a, y }) + node.evaluate({ x: b, y });
          for (let i = 1; i < N; i++) {
            const w = i % 2 ? 4 : 2;
            s += w * node.evaluate({ x: a + i * hx, y });
          }
          return (hx / 3) * s;
        };
        const g_c = innerAt(c), g_mid = innerAt((c + d) / 2), g_d = innerAt(d);
        // Outer integral of g(y) via Simpson on N panels.
        let s = 0;
        for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
          const wx = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
          const wy = j === 0 || j === N ? 1 : j % 2 ? 4 : 2;
          s += wx * wy * node.evaluate({ x: a + i * hx, y: c + j * hy });
        }
        const I = (hx * hy / 9) * s;
        // Verification via swapped order of integration: ∫_a^b (∫_c^d f dy) dx using same composite Simpson.
        const innerY = (x: number) => {
          let sy = node.evaluate({ x, y: c }) + node.evaluate({ x, y: d });
          for (let i = 1; i < N; i++) {
            const w = i % 2 ? 4 : 2;
            sy += w * node.evaluate({ x, y: c + i * hy });
          }
          return (hy / 3) * sy;
        };
        let s2 = innerY(a) + innerY(b);
        for (let i = 1; i < N; i++) {
          const w = i % 2 ? 4 : 2;
          s2 += w * innerY(a + i * hx);
        }
        const I_swap = (hx / 3) * s2;
        return {
          steps: [
            { title: "Set up the iterated integral (Fubini)", tex: `I = \\int_{${c}}^{${d}}\\!\\!\\int_{${a}}^{${b}} ${tex(expr)} \\, dx\\, dy` },
            { title: "Inner integral — integrate w.r.t. x with y held fixed", tex: `g(y) = \\int_{${a}}^{${b}} ${tex(expr)} \\, dx` },
            { title: "Sample g(y) at three values to visualise the iteration", note: `g(${c}) ≈ ${g_c.toFixed(8)},  g(${(c + d) / 2}) ≈ ${g_mid.toFixed(8)},  g(${d}) ≈ ${g_d.toFixed(8)}` },
            { title: "Outer integral", tex: `I = \\int_{${c}}^{${d}} g(y) \\, dy` },
            { title: "Numerical scheme", note: "Composite Simpson's rule with 80×80 panels in both directions — O((hx⁴ + hy⁴)) accuracy." },
            { title: "Step size", tex: `h_x = \\dfrac{b - a}{N} = ${hx.toFixed(6)},\\quad h_y = \\dfrac{d - c}{N} = ${hy.toFixed(6)}` },
            { title: "Composite-Simpson 2-D formula", tex: `I \\approx \\dfrac{h_x h_y}{9} \\sum_{i=0}^{N}\\sum_{j=0}^{N} w_i^x\\, w_j^y\\, f(x_i, y_j)`, note: "Weights wₖ = 1 at endpoints, 4 at odd interior nodes, 2 at even interior nodes." },
            { title: "Final numerical value", tex: `I \\approx ${I.toFixed(8)}` },
            {
              title: "Verification — swap the order of integration (Fubini)",
              tex: `\\int_{${a}}^{${b}}\\!\\!\\int_{${c}}^{${d}} ${tex(expr)} \\, dy\\, dx \\approx ${I_swap.toFixed(8)}`,
              note: `Absolute difference between the two orders ≈ ${Math.abs(I - I_swap).toExponential(3)} — confirms Fubini's theorem numerically.`,
            },
          ],
          result: `I \\approx ${I.toFixed(8)}`,
        };
      }}
    />
  );
}