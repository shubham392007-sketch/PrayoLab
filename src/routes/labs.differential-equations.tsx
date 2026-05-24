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
          { title: "ODE", tex: `${A} y'' + ${B} y' + ${C} y = 0` },
          { title: "Characteristic equation", tex: `${A} r^2 + ${B} r + ${C} = 0` },
          { title: "Discriminant", tex: `\\Delta = b^2 - 4ac = ${disc}` },
        ];
        let result = "";
        if (disc > 0) {
          const r1 = (-B + Math.sqrt(disc)) / (2 * A);
          const r2 = (-B - Math.sqrt(disc)) / (2 * A);
          steps.push({ title: "Distinct real roots", tex: `r_1 = ${r1.toFixed(4)},\\ r_2 = ${r2.toFixed(4)}` });
          result = `y(x) = C_1 e^{${r1.toFixed(4)} x} + C_2 e^{${r2.toFixed(4)} x}`;
        } else if (Math.abs(disc) < 1e-12) {
          const r = -B / (2 * A);
          steps.push({ title: "Repeated real root", tex: `r = ${r.toFixed(4)}` });
          result = `y(x) = (C_1 + C_2 x) e^{${r.toFixed(4)} x}`;
        } else {
          const alpha = -B / (2 * A), beta = Math.sqrt(-disc) / (2 * A);
          steps.push({ title: "Complex conjugate roots", tex: `r = ${alpha.toFixed(4)} \\pm ${beta.toFixed(4)} i` });
          result = `y(x) = e^{${alpha.toFixed(4)} x}\\left(C_1 \\cos ${beta.toFixed(4)} x + C_2 \\sin ${beta.toFixed(4)} x\\right)`;
        }
        return { steps, result };
      }}
    />
  );
}