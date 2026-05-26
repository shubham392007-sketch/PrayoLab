import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";

export const Route = createFileRoute("/labs/differential-equations")({ component: Page });

/** Solve a y'' + b y' + c y = 0 by its characteristic equation. */
function Page() {
  return (
    <ComputedLab
      title="Differential Equations"
      subtitle="Solve constant-coefficient linear ODE: a y'' + b y' + c y = 0."
      fields={[
        { name: "a", label: "a", defaultValue: "1" },
        { name: "b", label: "b", defaultValue: "3" },
        { name: "c", label: "c", defaultValue: "2" },
      ]}
      compute={({ a, b, c }) => {
        const A = parseFloat(a), B = parseFloat(b), C = parseFloat(c);
        const disc = B * B - 4 * A * C;
        const steps: { title: string; tex?: string; note?: string }[] = [
          { title: "Given second-order linear ODE", tex: `${A} y'' + ${B} y' + ${C} y = 0`, note: "Homogeneous, constant coefficients — try an exponential ansatz." },
          { title: "Ansatz", tex: `y(x) = e^{r x} \\Rightarrow y' = r e^{r x},\\ y'' = r^2 e^{r x}` },
          { title: "Substitute into the ODE", tex: `${A} r^2 e^{r x} + ${B} r e^{r x} + ${C} e^{r x} = 0` },
          { title: "Factor out eʳˣ (never zero)", tex: `e^{r x}\\left(${A} r^2 + ${B} r + ${C}\\right) = 0` },
          { title: "Characteristic equation", tex: `${A} r^2 + ${B} r + ${C} = 0` },
          { title: "Compute the discriminant", tex: `\\Delta = b^2 - 4ac = (${B})^2 - 4(${A})(${C}) = ${disc}` },
        ];
        let result = "";
        if (disc > 0) {
          const r1 = (-B + Math.sqrt(disc)) / (2 * A);
          const r2 = (-B - Math.sqrt(disc)) / (2 * A);
          steps.push({ title: "Δ > 0 — two distinct real roots", tex: `r_{1,2} = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a} = \\dfrac{${-B} \\pm \\sqrt{${disc}}}{${2 * A}}` });
          steps.push({ title: "Evaluate roots", tex: `r_1 = ${r1.toFixed(6)},\\quad r_2 = ${r2.toFixed(6)}` });
          steps.push({ title: "General solution", note: "Linear combination of the two independent exponential modes." });
          result = `y(x) = C_1 e^{${r1.toFixed(4)} x} + C_2 e^{${r2.toFixed(4)} x}`;
        } else if (Math.abs(disc) < 1e-12) {
          const r = -B / (2 * A);
          steps.push({ title: "Δ = 0 — single repeated root", tex: `r = -\\dfrac{b}{2a} = ${r.toFixed(6)}` });
          steps.push({ title: "Second linearly independent solution", tex: `y_2 = x\\,e^{r x}`, note: "Required to span the 2-D solution space; verified by reduction of order." });
          result = `y(x) = (C_1 + C_2 x) e^{${r.toFixed(4)} x}`;
        } else {
          const alpha = -B / (2 * A), beta = Math.sqrt(-disc) / (2 * A);
          steps.push({ title: "Δ < 0 — complex conjugate roots", tex: `r = \\alpha \\pm i\\beta = ${alpha.toFixed(6)} \\pm ${beta.toFixed(6)} i` });
          steps.push({ title: "Apply Euler's formula", tex: `e^{(\\alpha + i\\beta) x} = e^{\\alpha x}\\left(\\cos\\beta x + i\\sin\\beta x\\right)`, note: "Take real and imaginary parts as the two real independent solutions." });
          result = `y(x) = e^{${alpha.toFixed(4)} x}\\left(C_1 \\cos ${beta.toFixed(4)} x + C_2 \\sin ${beta.toFixed(4)} x\\right)`;
        }
        steps.push({ title: "General solution", tex: `y(x) = ${result}`, note: "Linear combination of two independent solutions of the homogeneous ODE." });
        steps.push({
          title: "Verification — substitute y back into the ODE",
          tex: `${A}\\,y'' + ${B}\\,y' + ${C}\\,y \\stackrel{?}{=} 0`,
          note: "For each basis solution eʳⁱˣ, plugging in yields (a rᵢ² + b rᵢ + c) eʳⁱˣ = 0 because rᵢ satisfies the characteristic equation. By linearity, every C₁ y₁ + C₂ y₂ also satisfies the ODE.",
        });
        steps.push({ title: "Apply initial / boundary conditions (if any)", note: "Two conditions, e.g. y(0) = y₀ and y'(0) = v₀, give a 2×2 linear system that pins down C₁ and C₂." });
        return { steps, result };
      }}
    />
  );
}