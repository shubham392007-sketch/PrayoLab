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
        const dnode = parse(dft);
        const fnode = parse(expr);
        const N = 400, h = (B - A) / N;
        const trap = (g: (x: number) => number) => {
          let s = 0.5 * (g(A) + g(B));
          for (let i = 1; i < N; i++) s += g(A + i * h);
          return s * h;
        };
        const Iv = trap((x) => fnode.evaluate({ x, t: T }));
        const Ipv = trap((x) => dnode.evaluate({ x, t: T }));
        return {
          steps: [
            { title: "Define the parameter-dependent integral", tex: `I(t) = \\int_{${a}}^{${b}} ${tex(expr)} \\, dx` },
            { title: "Leibniz rule (fixed limits)", tex: `\\dfrac{dI}{dt} = \\int_{${a}}^{${b}} \\dfrac{\\partial f}{\\partial t}(x, t) \\, dx`, note: "Valid when f and ∂f/∂t are continuous in x and t on the integration domain." },
            { title: "Compute the integrand's partial derivative", tex: `\\dfrac{\\partial f}{\\partial t} = \\dfrac{\\partial}{\\partial t}\\left(${tex(expr)}\\right) = ${tex(dft)}` },
            { title: "Substitute back into the Leibniz formula", tex: `I'(t) = \\int_{${a}}^{${b}} ${tex(dft)} \\, dx` },
            { title: `Evaluate I(t) numerically at t = ${t}`, note: `Trapezoidal rule, N = ${N} panels → I(${t}) ≈ ${Iv.toFixed(8)}` },
            { title: `Evaluate I'(t) numerically at t = ${t}`, note: `Same scheme applied to ∂f/∂t → I'(${t}) ≈ ${Ipv.toFixed(8)}` },
            { title: "Step size", tex: `h = \\dfrac{b - a}{N} = ${h.toFixed(6)}` },
          ],
          result: `I'(${t}) \\approx ${Ipv.toFixed(8)},\\quad I(${t}) \\approx ${Iv.toFixed(8)}`,
        };
      }}
    />
  );
}