import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { rank, matToTex } from "@/lib/math-engine";

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
        return {
          steps: [
            { title: "Stack vectors as rows of M", tex: `M = ${matToTex(M)}` },
            { title: "Reduce to row-echelon form", tex: `\\text{rank}(M) = ${r}` },
            { title: "Compare rank with number of vectors", tex: `${r} \\,${dep ? "<" : "="}\\, ${vs.length}` },
          ],
          result: dep
            ? `\\text{Vectors are } \\mathbf{linearly\\ dependent}.`
            : `\\text{Vectors are } \\mathbf{linearly\\ independent}.`,
        };
      }}
    />
  );
}