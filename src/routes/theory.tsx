import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { F } from "@/components/prayolab/formula";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/theory")({ component: Page });

type Topic = {
  category: string;
  title: string;
  intro: string;
  formula: string;
  example?: string;
  notes?: string;
};

const TOPICS: Topic[] = [
  { category: "Linear Algebra", title: "Cramer's Rule", intro: "Solve a square linear system using determinants when det(A) ≠ 0.",
    formula: `x_i = \\frac{\\det(A_i)}{\\det(A)}, \\quad i = 1, 2, \\dots, n`,
    example: `\\begin{cases} 2x - y + z = 8 \\\\ -x + 3y + 2z = -11 \\\\ -2x + y + 2z = -3 \\end{cases}` },
  { category: "Linear Algebra", title: "Determinants", intro: "A scalar that captures volume scaling and invertibility of a square matrix.",
    formula: `\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i,\\sigma(i)}` },
  { category: "Linear Algebra", title: "Eigenvalues", intro: "Scalars λ such that Av = λv for some non-zero vector v.",
    formula: `\\det(A - \\lambda I) = 0` },
  { category: "Linear Algebra", title: "Rank & Linear Dependence", intro: "Rank counts the maximal number of linearly independent rows/columns.",
    formula: `\\text{rank}(A) = \\dim(\\text{col}\\,A)` },
  { category: "Calculus", title: "Nth Derivative", intro: "Repeatedly applying d/dx yields the nth-order derivative.",
    formula: `f^{(n)}(x) = \\dfrac{d^n}{dx^n} f(x)` },
  { category: "Calculus", title: "Taylor Series", intro: "Local polynomial approximation of a smooth function about x = a.",
    formula: `f(x) = \\sum_{k=0}^{\\infty} \\dfrac{f^{(k)}(a)}{k!} (x - a)^k` },
  { category: "Calculus", title: "Partial Differentiation", intro: "Derivative of a multivariable function with respect to one variable, holding others constant.",
    formula: `\\dfrac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\dfrac{f(x + h, y) - f(x, y)}{h}` },
  { category: "Calculus", title: "Maxima & Minima", intro: "Second derivative test classifies critical points using the Hessian.",
    formula: `D = f_{xx} f_{yy} - f_{xy}^2` },
  { category: "Calculus", title: "Euler's Theorem", intro: "Homogeneous functions of degree n satisfy a useful identity.",
    formula: `x f_x + y f_y = n\\, f(x, y)` },
  { category: "Calculus", title: "Jacobian", intro: "Determinant of partials governing change of variables in multiple integrals.",
    formula: `\\dfrac{\\partial(u, v)}{\\partial(x, y)} = \\begin{vmatrix} u_x & u_y \\\\ v_x & v_y \\end{vmatrix}` },
  { category: "Differential Equations", title: "Linear ODE", intro: "Constant-coefficient linear ODEs are solved via the characteristic equation.",
    formula: `a y'' + b y' + c y = 0 \\;\\Rightarrow\\; ar^2 + br + c = 0` },
  { category: "Integration", title: "Double Integrals", intro: "Iterated integral over a 2D region computes volume under a surface.",
    formula: `\\iint_R f(x, y) \\, dA = \\int_c^d \\int_a^b f(x, y) \\, dx \\, dy` },
  { category: "Integration", title: "Leibniz Rule", intro: "Differentiation under the integral sign.",
    formula: `\\dfrac{d}{dt} \\int_a^b f(x, t) \\, dx = \\int_a^b \\dfrac{\\partial f}{\\partial t} \\, dx` },
  { category: "Fourier", title: "Fourier Series", intro: "Decompose a periodic function on [-L, L] into sines and cosines.",
    formula: `f(x) = \\dfrac{a_0}{2} + \\sum_{n=1}^{\\infty} a_n \\cos\\dfrac{n\\pi x}{L} + b_n \\sin\\dfrac{n\\pi x}{L}` },
  { category: "Fourier", title: "Harmonic Analysis", intro: "Discrete decomposition of sampled signals into harmonic components.",
    formula: `a_h = \\dfrac{2}{N} \\sum_{i=0}^{N-1} f_i \\cos\\dfrac{2\\pi h i}{N}` },
];

function Page() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const filtered = useMemo(() => {
    const s = q.toLowerCase().trim();
    if (!s) return TOPICS;
    return TOPICS.filter((t) => (t.title + " " + t.category + " " + t.intro).toLowerCase().includes(s));
  }, [q]);
  const topic = filtered[Math.min(active, filtered.length - 1)] ?? TOPICS[0];
  const grouped = useMemo(() => {
    const m = new Map<string, Topic[]>();
    filtered.forEach((t) => { if (!m.has(t.category)) m.set(t.category, []); m.get(t.category)!.push(t); });
    return Array.from(m.entries());
  }, [filtered]);

  return (
    <WorkspaceShell title="Theory Library" subtitle="Searchable theorems, derivations, and worked examples.">
      <div className="mb-4 max-w-md">
        <Input placeholder="Search theorems, e.g. ‘Fourier’ or ‘Jacobian’" value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} />
      </div>
      <div className="grid lg:grid-cols-[280px_1fr_220px] gap-6">
        <aside className="space-y-4 text-sm pl-card pl-soft-shadow p-4 max-h-[70vh] overflow-y-auto">
          {grouped.length === 0 && <div className="text-muted-foreground">No matches.</div>}
          {grouped.map(([cat, items]) => (
            <div key={cat}>
              <div className="font-medium mb-2">{cat}</div>
              <ul className="space-y-1">
                {items.map((t) => {
                  const idx = filtered.indexOf(t);
                  return (
                    <li key={t.title}>
                      <button onClick={() => setActive(idx)} className={`w-full text-left px-2 py-1.5 rounded-md ${topic.title === t.title ? "bg-secondary text-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>{t.title}</button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </aside>
        <div className="pl-card pl-soft-shadow p-6">
          <div className="text-xs text-muted-foreground">{topic.category} · {topic.title}</div>
          <h2 className="text-2xl font-semibold mt-1">{topic.title}</h2>
          <p className="text-sm text-muted-foreground mt-3">{topic.intro}</p>
          <h3 className="font-medium mt-6">Formula</h3>
          <div className="mt-2 overflow-x-auto"><F block>{topic.formula}</F></div>
          {topic.example && (<>
            <h3 className="font-medium mt-6">Example</h3>
            <div className="mt-2 overflow-x-auto"><F block>{topic.example}</F></div>
          </>)}
          {topic.notes && <p className="text-xs text-muted-foreground mt-4">{topic.notes}</p>}
        </div>
        <aside className="text-sm pl-card pl-soft-shadow p-4 h-fit">
          <div className="font-medium mb-3">In This Topic</div>
          <ul className="space-y-1 text-muted-foreground">{["Introduction","Formula","Derivation","Examples","Properties","Applications"].map(t=><li key={t}>{t}</li>)}</ul>
        </aside>
      </div>
    </WorkspaceShell>
  );
}
