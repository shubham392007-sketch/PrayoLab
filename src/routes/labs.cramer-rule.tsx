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
        return {
          steps: [
            { title: "Coefficient matrix A", tex: `A = ${matToTex(M)}` },
            { title: "RHS vector b", tex: `b = ${matToTex(B.map((v) => [v]))}` },
            { title: "Compute det(A)", tex: `D = ${fmt(D)}` },
            ...Di.map((d, i) => ({ title: `Replace column ${i + 1} with b`, tex: `D_{${i + 1}} = ${fmt(d)}` })),
          ],
          result: xs.map((x, i) => `x_{${i + 1}} = ${fmt(x)}`).join(",\\quad "),
        };
      }}
    />
  );
}