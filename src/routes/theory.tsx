import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { F } from "@/components/prayolab/formula";

export const Route = createFileRoute("/theory")({ component: Page });

const cats = [
  { c: "Linear Algebra", items: ["Matrices","Determinants","Eigenvalues","Cramer's Rule","Vector Spaces"] },
  { c: "Calculus", items: ["Differential Equations","Integral Calculus","Fourier Analysis","Multivariable Calculus"] },
];

function Page() {
  return (
    <WorkspaceShell title="Theory Library" subtitle="Searchable theorems, derivations, and worked examples.">
      <div className="grid lg:grid-cols-[260px_1fr_220px] gap-6">
        <aside className="space-y-4 text-sm">
          {cats.map((g) => (
            <div key={g.c}><div className="font-medium mb-2">{g.c}</div>
              <ul className="space-y-1">{g.items.map((i,k) => <li key={i} className={`px-2 py-1.5 rounded-md ${k===3?"bg-secondary":"text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>{i}</li>)}</ul>
            </div>
          ))}
        </aside>
        <div className="pl-card pl-soft-shadow p-6">
          <div className="text-xs text-muted-foreground">Linear Algebra · Cramer's Rule</div>
          <h2 className="text-2xl font-semibold mt-1">Cramer's Rule</h2>
          <p className="text-sm text-muted-foreground mt-3">Cramer's rule is used to solve a system of linear equations when the determinant of the coefficient matrix is non-zero.</p>
          <h3 className="font-medium mt-6">Formula</h3>
          <div className="mt-2"><F block>{`x_i = \\frac{\\det(A_i)}{\\det(A)}, \\quad i = 1, 2, \\dots, n`}</F></div>
          <p className="text-xs text-muted-foreground mt-1">where A_i is the matrix obtained by replacing the ith column of A with b.</p>
          <h3 className="font-medium mt-6">Example</h3>
          <div className="mt-2"><F block>{`\\begin{cases} 2x - y + z = 8 \\\\ -x + 3y + 2z = -11 \\\\ -2x + y + 2z = -3 \\end{cases}`}</F></div>
        </div>
        <aside className="text-sm">
          <div className="font-medium mb-3">In This Topic</div>
          <ul className="space-y-1 text-muted-foreground">{["Introduction","Formula","Derivation","Examples","Properties","Applications","Common Mistakes"].map(t=><li key={t}>{t}</li>)}</ul>
        </aside>
      </div>
    </WorkspaceShell>
  );
}
