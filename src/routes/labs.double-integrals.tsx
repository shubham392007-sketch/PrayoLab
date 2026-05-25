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
        return {
          steps: [
            { title: "Set up the iterated integral (Fubini)", tex: `I = \\int_{${c}}^{${d}}\\!\\!\\int_{${a}}^{${b}} ${tex(expr)} \\, dx\\, dy` },
            { title: "Inner integral — integrate w.r.t. x with y held fixed", tex: `g(y) = \\int_{${a}}^{${b}} ${tex(expr)} \\, dx` },
            { title: "Sample g(y) at three values to visualise the iteration", note: `g(${c}) ≈ ${g_c.toFixed(8)},  g(${(c + d) / 2}) ≈ ${g_mid.toFixed(8)},  g(${d}) ≈ ${g_d.toFixed(8)}` },
            { title: "Outer integral", tex: `I = \\int_{${c}}^{${d}} g(y) \\, dy` },
            { title: "Numerical scheme", note: "Composite Simpson's rule with 80×80 panels in both directions — O((hx⁴ + hy⁴)) accuracy." },
            { title: "Step size", tex: `h_x = \\dfrac{b - a}{N} = ${hx.toFixed(6)},\\quad h_y = \\dfrac{d - c}{N} = ${hy.toFixed(6)}` },
          ],
          result: `I \\approx ${I.toFixed(8)}`,
        };
      }}
    />
  );
}