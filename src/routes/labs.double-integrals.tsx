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
        let s = 0;
        for (let i = 0; i <= N; i++) for (let j = 0; j <= N; j++) {
          const wx = i === 0 || i === N ? 1 : i % 2 ? 4 : 2;
          const wy = j === 0 || j === N ? 1 : j % 2 ? 4 : 2;
          s += wx * wy * node.evaluate({ x: a + i * hx, y: c + j * hy });
        }
        const I = (hx * hy / 9) * s;
        return {
          steps: [
            { title: "Integral", tex: `\\int_{${c}}^{${d}}\\int_{${a}}^{${b}} ${tex(expr)} \\, dx\\, dy` },
            { title: "Method", note: "Composite Simpson's rule, 80×80 panels." },
          ],
          result: `I \\approx ${I.toFixed(8)}`,
        };
      }}
    />
  );
}