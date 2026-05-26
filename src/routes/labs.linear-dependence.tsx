import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { rank, matToTex, fmt } from "@/lib/math-engine";

export const Route = createFileRoute("/labs/linear-dependence")({ component: Page });

function parseVec(s: string): number[] {
  return s.split(/[\s,]+/).filter(Boolean).map(Number);
}

function Page() {
  return (
    <ComputedLab
      title="Linear Dependence"
      subtitle="Test whether vectors are linearly independent via rank."
      fields={[
        { name: "v1", label: "Vector v₁", defaultValue: "1, 2, 3" },
        { name: "v2", label: "Vector v₂", defaultValue: "2, 4, 6" },
        { name: "v3", label: "Vector v₃", defaultValue: "1, 0, 1" },
      ]}
      compute={({ v1, v2, v3 }) => {
        const vs = [parseVec(v1), parseVec(v2), parseVec(v3)].filter((v) => v.length);
        const len = vs[0].length;
        if (!vs.every((v) => v.length === len)) throw new Error("Vectors must have the same dimension.");
        const M = vs; // rows are vectors
        const r = rank(M);
        const dep = r < vs.length;
        // If dependent, try to express v3 ≈ α v1 + β v2 via least squares for illustration.
        let relation: string | null = null;
        if (dep && vs.length === 3) {
          // Solve A [α β]ᵀ ≈ v3 where A = [v1 v2]ᵀ columns.
          const a = vs[0], b = vs[1], c = vs[2];
          // Normal equations 2x2:
          const aa = a.reduce((s, x) => s + x * x, 0);
          const ab = a.reduce((s, x, i) => s + x * b[i], 0);
          const bb = b.reduce((s, x) => s + x * x, 0);
          const ac = a.reduce((s, x, i) => s + x * c[i], 0);
          const bc = b.reduce((s, x, i) => s + x * c[i], 0);
          const D = aa * bb - ab * ab;
          if (Math.abs(D) > 1e-10) {
            const alpha = (bb * ac - ab * bc) / D;
            const beta = (aa * bc - ab * ac) / D;
            const reconstructed = a.map((x, i) => alpha * x + beta * b[i]);
            const residual = reconstructed.reduce((s, x, i) => s + (x - c[i]) ** 2, 0);
            if (residual < 1e-8) {
              relation = `v_3 = ${fmt(alpha)}\\,v_1 + ${fmt(beta)}\\,v_2`;
            }
          }
        }
        return {
          steps: [
            { title: "Definition", tex: `\\sum_i c_i\\, \\mathbf{v}_i = \\mathbf{0} \\Rightarrow c_i = 0`, note: "Vectors are linearly independent iff the only solution to the homogeneous combination is the trivial one." },
            { title: "Stack the vectors as rows of M", tex: `M = ${matToTex(M)}` },
            { title: "Row-reduce M to echelon form (Gaussian elimination)", note: "Pivot rows correspond to independent vectors; rows that reduce to zero are linear combinations of the others." },
            { title: "Count the pivot rows", tex: `\\text{rank}(M) = ${r}` },
            { title: "Compare rank with the number of vectors", tex: `\\text{rank}(M) = ${r} \\;${dep ? "<" : "="}\\; ${vs.length} = \\#\\text{vectors}` },
            ...(relation ? [{ title: "Explicit dependence relation", tex: relation, note: "Recovered by solving the over-determined least-squares system; residual is at round-off." }] : []),
            { title: "Conclusion", note: dep ? "Since rank(M) < number of vectors, at least one vector is a linear combination of the others." : "Since rank(M) equals the number of vectors, no non-trivial relation exists between them." },
          ],
          result: dep
            ? `\\text{Vectors are } \\mathbf{linearly\\ dependent}.`
            : `\\text{Vectors are } \\mathbf{linearly\\ independent}.`,
        };
      }}
    />
  );
}