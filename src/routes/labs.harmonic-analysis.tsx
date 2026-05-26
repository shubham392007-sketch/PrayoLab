import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";

export const Route = createFileRoute("/labs/harmonic-analysis")({ component: Page });

function Page() {
  return (
    <ComputedLab
      title="Harmonic Analysis"
      subtitle="Discrete harmonic decomposition of sampled data over [0, 2π)."
      fields={[
        { name: "ys", label: "Samples (12 values, comma-separated)", defaultValue: "1.8, 1.1, 0.3, -0.7, -1.6, -1.4, -0.9, 0.1, 1.0, 1.5, 1.7, 1.9" },
        { name: "k", label: "Harmonics k", defaultValue: "3" },
      ]}
      compute={({ ys, k }) => {
        const data = ys.split(/[\s,]+/).filter(Boolean).map(Number);
        const N = data.length;
        const K = Math.max(1, Math.min(Math.floor(N / 2), parseInt(k || "3", 10)));
        const a0 = (1 / N) * data.reduce((s, v) => s + v, 0) * 2;
        const A: number[] = [], B: number[] = [];
        for (let h = 1; h <= K; h++) {
          let a = 0, b = 0;
          for (let i = 0; i < N; i++) {
            const x = (2 * Math.PI * i) / N;
            a += data[i] * Math.cos(h * x);
            b += data[i] * Math.sin(h * x);
          }
          A.push((2 / N) * a); B.push((2 / N) * b);
        }
        const steps = [
          { title: "Number of samples", tex: `N = ${N}` },
          { title: "Discrete orthogonality", tex: `\\sum_{i=0}^{N-1} \\cos\\dfrac{2\\pi h i}{N} \\cos\\dfrac{2\\pi k i}{N} = \\dfrac{N}{2}\\delta_{hk},\\;\\; \\sum \\sin\\sin = \\dfrac{N}{2}\\delta_{hk}`, note: "Provides the projection formulas for the harmonic coefficients aₕ and bₕ." },
          { title: "Coefficient formulas", tex: `a_h = \\dfrac{2}{N}\\sum_{i=0}^{N-1} f_i \\cos\\dfrac{2\\pi h i}{N},\\quad b_h = \\dfrac{2}{N}\\sum_{i=0}^{N-1} f_i \\sin\\dfrac{2\\pi h i}{N}` },
          { title: "Mean term a₀/2", tex: `\\dfrac{a_0}{2} = ${(a0 / 2).toFixed(4)}` },
          ...A.map((a, i) => ({
            title: `Harmonic ${i + 1}`,
            tex: `a_${i + 1} = ${a.toFixed(4)},\\ b_${i + 1} = ${B[i].toFixed(4)},\\ \\text{amp} = ${Math.hypot(a, B[i]).toFixed(4)}`,
          })),
          {
            title: "Power spectrum & Parseval check",
            tex: `\\dfrac{1}{N}\\sum_{i=0}^{N-1} f_i^2 \\approx \\dfrac{a_0^2}{4} + \\dfrac{1}{2}\\sum_{h=1}^{K} (a_h^2 + b_h^2)`,
            note: `LHS = ${((1 / N) * data.reduce((s, v) => s + v * v, 0)).toFixed(4)}, RHS = ${(((a0 / 2) ** 2) + 0.5 * A.reduce((s, a, i) => s + a * a + B[i] * B[i], 0)).toFixed(4)} — agreement improves as K → N/2.`,
          },
        ];
        const series = A.map((a, i) => `${a.toFixed(3)}\\cos ${i + 1}x ${B[i] >= 0 ? "+" : "-"} ${Math.abs(B[i]).toFixed(3)}\\sin ${i + 1}x`).join(" + ");
        return { steps, result: `f(x) \\approx ${(a0 / 2).toFixed(3)} + ${series}` };
      }}
    />
  );
}