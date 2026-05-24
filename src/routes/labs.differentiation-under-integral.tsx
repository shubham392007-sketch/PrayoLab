import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { partial, tex } from "@/lib/math-engine";
import { parse } from "mathjs";

export const Route = createFileRoute("/labs/differentiation-under-integral")({ component: Page });

function Page() {
  return (
    <ComputedLab
      title="Differentiation Under the Integral Sign"
      subtitle="Leibniz rule for I(t) = ∫_a^b f(x, t) dx."
      fields={[
        { name: "expr", label: "f(x, t)", defaultValue: "exp(-t*x^2)" },
        { name: "a", label: "a", defaultValue: "0" },
        { name: "b", label: "b", defaultValue: "1" },
        { name: "t", label: "Evaluate at t =", defaultValue: "1" },
      ]}
      compute={({ expr, a, b, t }) => {
        const dft = partial(expr, "t");
        const A = parseFloat(a), B = parseFloat(b), T = parseFloat(t);
        const node = parse(dft);
        const N = 400, h = (B - A) / N;
        let s = 0.5 * (node.evaluate({ x: A, t: T }) + node.evaluate({ x: B, t: T }));
        for (let i = 1; i < N; i++) s += node.evaluate({ x: A + i * h, t: T });
        const val = s * h;
        return {
          steps: [
            { title: "Integral", tex: `I(t) = \\int_{${a}}^{${b}} ${tex(expr)} \\, dx` },
            { title: "Leibniz rule", tex: `I'(t) = \\int_{${a}}^{${b}} \\dfrac{\\partial}{\\partial t} ${tex(expr)} \\, dx` },
            { title: "∂f/∂t", tex: `\\dfrac{\\partial f}{\\partial t} = ${tex(dft)}` },
            { title: "Numeric value at t = " + t, note: "Trapezoidal rule with 400 panels." },
          ],
          result: `I'(${t}) \\approx ${val.toFixed(8)}`,
        };
      }}
    />
  );
}