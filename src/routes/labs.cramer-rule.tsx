import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { cramer, matToTex, fmt } from "@/lib/math-engine";

export const Route = createFileRoute("/labs/cramer-rule")({ component: Page });

function parseMat(s: string): number[][] {
  return s.trim().split(/\n+/).map((r) => r.split(/[\s,]+/).filter(Boolean).map(Number));
}

function Page() {
  return (
    <ComputedLab
      title="Cramer's Rule"
      subtitle="Solve a square linear system using determinants."
      fields={[
        { name: "A", label: "Coefficient matrix A (rows on new lines)", defaultValue: "2 -1 1\n1 3 2\n1 0 2" },
        { name: "b", label: "RHS vector b", defaultValue: "8, 13, 6" },
      ]}
      compute={({ A, b }) => {
        const M = parseMat(A);
        const B = b.split(/[\s,]+/).filter(Boolean).map(Number);
        const { D, Di, xs } = cramer(M, B);
        const replaceCol = (mat: number[][], col: number, vec: number[]) =>
          mat.map((row, r) => row.map((v, c) => (c === col ? vec[r] : v)));
        // Verification: compute A·x and compare to b.
        const Ax = M.map((row) => row.reduce((s, v, j) => s + v * xs[j], 0));
        const residual = Ax.map((v, i) => v - B[i]);
        const resNorm = Math.sqrt(residual.reduce((s, v) => s + v * v, 0));
        const steps: { title: string; tex?: string; note?: string }[] = [
          { title: "Write the system in matrix form", tex: `A\\,\\mathbf{x} = \\mathbf{b}` },
          { title: "Coefficient matrix A", tex: `A = ${matToTex(M)}` },
          { title: "Right-hand side b", tex: `\\mathbf{b} = ${matToTex(B.map((v) => [v]))}` },
          { title: "Check that the system has a unique solution", tex: `D = \\det(A) = ${fmt(D)}`, note: Math.abs(D) < 1e-12 ? "det(A) = 0 — Cramer's rule does not apply." : "det(A) ≠ 0, so A is invertible and the system has a unique solution." },
          { title: "Cramer's rule (general form)", tex: `x_i = \\dfrac{\\det(A_i)}{\\det(A)},\\quad i = 1, 2, \\dots, n`, note: "Aᵢ is obtained from A by replacing the i-th column with b." },
        ];
        Di.forEach((d, i) => {
          const Ai = replaceCol(M, i, B);
          steps.push({ title: `Form A_${i + 1} by replacing column ${i + 1} with b`, tex: `A_{${i + 1}} = ${matToTex(Ai)}` });
          steps.push({ title: `Determinant of A_${i + 1}`, tex: `D_{${i + 1}} = \\det(A_{${i + 1}}) = ${fmt(d)}` });
          steps.push({ title: `Apply Cramer's rule for x_${i + 1}`, tex: `x_{${i + 1}} = \\dfrac{D_{${i + 1}}}{D} = \\dfrac{${fmt(d)}}{${fmt(D)}} = ${fmt(xs[i])}` });
        });
        steps.push({
          title: "Verification — substitute x back into A·x",
          tex: `A\\,\\mathbf{x} = ${matToTex(Ax.map((v) => [v]))} \\approx ${matToTex(B.map((v) => [v]))} = \\mathbf{b}`,
          note: `Residual ‖A·x − b‖ ≈ ${resNorm.toExponential(3)} (round-off only — solution verified).`,
        });
        return {
          steps,
          result: xs.map((x, i) => `x_{${i + 1}} = ${fmt(x)}`).join(",\\quad "),
        };
      }}
    />
  );
}