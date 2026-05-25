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
  derivation?: string[];
  properties?: string[];
  applications?: string[];
  example?: string;
  exampleSteps?: { tex?: string; note?: string }[];
  notes?: string;
};

const TOPICS: Topic[] = [
  {
    category: "Linear Algebra", title: "Cramer's Rule",
    intro: "Cramer's rule expresses the unique solution of a square linear system A·x = b as a ratio of determinants. It is valid only when det(A) ≠ 0, in which case the coefficient matrix is invertible and the system has exactly one solution.",
    formula: `x_i = \\dfrac{\\det(A_i)}{\\det(A)}, \\quad i = 1, 2, \\dots, n`,
    derivation: [
      "Start from A·x = b with A ∈ ℝⁿˣⁿ invertible. Multiply both sides by A⁻¹ to obtain x = A⁻¹ b.",
      "Using the cofactor formula A⁻¹ = adj(A) / det(A), the i-th component is xᵢ = (Σⱼ Cⱼᵢ bⱼ) / det(A).",
      "The numerator equals the cofactor expansion of det(Aᵢ), where Aᵢ is obtained by replacing column i of A with b.",
    ],
    properties: [
      "Fails when det(A) = 0: the system is either inconsistent or has infinitely many solutions.",
      "Computational cost is O(n · n!) using Leibniz, so it is only practical for small n (≤ 4).",
      "Provides a closed-form symbolic answer — useful for proofs and parametric systems.",
    ],
    applications: [
      "Symbolic solution of small linear circuits (mesh / nodal equations).",
      "Closed-form Jacobian inverses in mechanics and robotics.",
    ],
    example: `\\begin{cases} 2x - y + z = 8 \\\\ -x + 3y + 2z = -11 \\\\ -2x + y + 2z = -3 \\end{cases}`,
  },
  {
    category: "Linear Algebra", title: "Determinants",
    intro: "The determinant is a scalar associated to every square matrix. Geometrically it is the signed n-dimensional volume scaling of the linear map; algebraically it determines invertibility.",
    formula: `\\det(A) = \\sum_{\\sigma \\in S_n} \\text{sgn}(\\sigma) \\prod_{i=1}^n a_{i,\\sigma(i)}`,
    derivation: [
      "Define det as the unique alternating multilinear function of the rows with det(I) = 1.",
      "Multilinearity + alternation force the Leibniz expansion above.",
      "Equivalent recursive form: det(A) = Σⱼ (−1)ⁱ⁺ʲ aᵢⱼ · det(Mᵢⱼ) (Laplace cofactor expansion along any row i).",
    ],
    properties: [
      "det(AB) = det(A)·det(B); det(Aᵀ) = det(A); det(A⁻¹) = 1/det(A).",
      "Row operations: swapping rows flips the sign, scaling a row by k scales det by k, adding a multiple of one row to another leaves det unchanged.",
      "A is invertible ⇔ det(A) ≠ 0 ⇔ rank(A) = n.",
    ],
    applications: [
      "Volume / oriented area in change-of-variables for multiple integrals (Jacobian).",
      "Characteristic polynomial det(A − λI) for eigenvalues.",
      "Wronskian to test linear independence of functions.",
    ],
  },
  {
    category: "Linear Algebra", title: "Eigenvalues & Eigenvectors",
    intro: "An eigenvector v of A satisfies A v = λ v for some scalar λ, the associated eigenvalue. Eigenpairs reveal the invariant directions and scaling of a linear transformation.",
    formula: `\\det(A - \\lambda I) = 0`,
    derivation: [
      "From A v = λ v we get (A − λI) v = 0; a non-trivial v exists iff (A − λI) is singular, i.e. det(A − λI) = 0.",
      "The roots of the characteristic polynomial p(λ) = det(A − λI) are the eigenvalues.",
      "For each λ, solve (A − λI) v = 0 by Gaussian elimination to obtain the eigenvectors (kernel basis).",
    ],
    properties: [
      "Sum of eigenvalues = trace(A); product = det(A).",
      "Symmetric real matrices have real eigenvalues and an orthonormal eigenbasis (Spectral Theorem).",
      "A is diagonalisable ⇔ it has n linearly independent eigenvectors.",
    ],
    applications: [
      "Principal Component Analysis, stability analysis of ODE systems, vibration mode shapes.",
      "Google PageRank — dominant eigenvector of the link matrix.",
    ],
  },
  {
    category: "Linear Algebra", title: "Rank & Linear Dependence",
    intro: "The rank of a matrix is the dimension of its column (equivalently row) space. It measures how many independent directions the linear map actually spans.",
    formula: `\\text{rank}(A) = \\dim(\\text{col}\\,A) = \\dim(\\text{row}\\,A)`,
    derivation: [
      "Row-reduce A to its row-echelon form R using Gaussian elimination.",
      "rank(A) equals the number of non-zero rows of R (= number of pivot columns).",
      "Rank–nullity theorem: rank(A) + nullity(A) = number of columns.",
    ],
    properties: [
      "rank(A) ≤ min(m, n) for an m×n matrix.",
      "rank(A) = n ⇔ columns are linearly independent ⇔ Ax = 0 has only the trivial solution.",
      "rank(AB) ≤ min(rank A, rank B).",
    ],
    applications: [
      "Solvability of Ax = b: consistent ⇔ rank(A) = rank(A | b).",
      "Detecting redundant equations in engineering models.",
    ],
  },
  {
    category: "Calculus", title: "Nth Derivative",
    intro: "Repeated symbolic differentiation produces the n-th derivative f⁽ⁿ⁾(x). For elementary functions, recognising the pattern often yields a closed form.",
    formula: `f^{(n)}(x) = \\dfrac{d^n}{dx^n} f(x)`,
    derivation: [
      "Apply d/dx successively, simplifying after each pass.",
      "Leibniz product rule generalises: (uv)⁽ⁿ⁾ = Σₖ C(n,k) u⁽ᵏ⁾ v⁽ⁿ⁻ᵏ⁾.",
      "Standard closed forms: dⁿ/dxⁿ eᵃˣ = aⁿ eᵃˣ; dⁿ/dxⁿ sin(ax) = aⁿ sin(ax + nπ/2).",
    ],
    properties: [
      "Linearity: (αf + βg)⁽ⁿ⁾ = α f⁽ⁿ⁾ + β g⁽ⁿ⁾.",
      "Smoothness class Cⁿ: f admits continuous derivatives up to order n.",
    ],
    applications: [
      "Taylor / Maclaurin series coefficients.",
      "Higher-order ODE solutions and beam deflection formulas.",
    ],
  },
  {
    category: "Calculus", title: "Taylor & Maclaurin Series",
    intro: "A Taylor series approximates a smooth function near x = a by an infinite polynomial whose coefficients are the function's successive derivatives at a. When a = 0 it is called the Maclaurin series.",
    formula: `f(x) = \\sum_{k=0}^{\\infty} \\dfrac{f^{(k)}(a)}{k!} (x - a)^k`,
    derivation: [
      "Assume f is analytic near a so f(x) = Σ cₖ (x − a)ᵏ converges in some interval.",
      "Differentiate k times and evaluate at x = a: f⁽ᵏ⁾(a) = k! cₖ, hence cₖ = f⁽ᵏ⁾(a)/k!.",
      "Lagrange remainder: Rₙ(x) = f⁽ⁿ⁺¹⁾(ξ)/(n+1)! · (x − a)ⁿ⁺¹ for some ξ between a and x.",
    ],
    properties: [
      "Convergence is governed by the radius of convergence around a.",
      "Within the radius, term-by-term differentiation and integration are valid.",
    ],
    applications: [
      "Polynomial approximations for numerical evaluation of eˣ, sin x, ln(1+x), etc.",
      "Error analysis of numerical methods (Runge–Kutta, finite differences).",
    ],
  },
  {
    category: "Calculus", title: "Partial Differentiation",
    intro: "Partial derivatives measure the rate of change of a multivariable function with respect to one variable while keeping all other variables fixed.",
    formula: `\\dfrac{\\partial f}{\\partial x} = \\lim_{h \\to 0} \\dfrac{f(x + h, y) - f(x, y)}{h}`,
    derivation: [
      "Treat all variables except x as constants and apply ordinary differentiation rules.",
      "Second-order derivatives: fxx, fyy, and the mixed partial fxy.",
      "Clairaut's theorem: if fxy and fyx are continuous, then fxy = fyx.",
    ],
    properties: [
      "Gradient ∇f = (fx, fy, …) points in the direction of steepest ascent.",
      "Chain rule for f(x(t), y(t)): df/dt = fx · x'(t) + fy · y'(t).",
    ],
    applications: [
      "Heat, wave, and Laplace PDEs.",
      "Optimisation of multivariable cost / energy functions.",
    ],
  },
  {
    category: "Calculus", title: "Maxima & Minima (Multivariable)",
    intro: "Critical points satisfy ∇f = 0. The Hessian-based second-derivative test classifies them into local minima, maxima, and saddle points.",
    formula: `D = f_{xx} f_{yy} - f_{xy}^2`,
    derivation: [
      "Find critical points by solving fx = 0 and fy = 0 simultaneously.",
      "Compute D = fxx · fyy − fxy² at each critical point.",
      "Classify: D > 0 & fxx > 0 → local minimum; D > 0 & fxx < 0 → local maximum; D < 0 → saddle; D = 0 → inconclusive.",
    ],
    properties: [
      "The Hessian is the symmetric matrix [[fxx, fxy], [fxy, fyy]].",
      "Positive-definite Hessian ⇔ strict local minimum; negative-definite ⇔ strict local maximum.",
    ],
    applications: [
      "Engineering design optimisation (least material, maximum stiffness).",
      "Machine-learning loss-surface analysis.",
    ],
  },
  {
    category: "Calculus", title: "Euler's Theorem on Homogeneous Functions",
    intro: "A function f(x, y) is homogeneous of degree n if f(tx, ty) = tⁿ f(x, y) for every t > 0. Euler's theorem connects this scaling to its partial derivatives.",
    formula: `x \\dfrac{\\partial f}{\\partial x} + y \\dfrac{\\partial f}{\\partial y} = n\\, f(x, y)`,
    derivation: [
      "Differentiate f(tx, ty) = tⁿ f(x, y) with respect to t.",
      "LHS: x fx(tx, ty) + y fy(tx, ty). RHS: n tⁿ⁻¹ f(x, y).",
      "Set t = 1 to obtain x fx + y fy = n f.",
    ],
    properties: [
      "Generalises to k variables: Σ xᵢ ∂f/∂xᵢ = n f.",
      "Second-order corollary: x² fxx + 2xy fxy + y² fyy = n(n−1) f.",
    ],
    applications: [
      "Microeconomics — production functions exhibiting returns to scale.",
      "Thermodynamics — extensive vs. intensive variables.",
    ],
  },
  {
    category: "Calculus", title: "Jacobian",
    intro: "The Jacobian determinant of a smooth map (u, v) = T(x, y) measures the local area scaling factor and governs change of variables in multiple integrals.",
    formula: `\\dfrac{\\partial(u, v)}{\\partial(x, y)} = \\begin{vmatrix} u_x & u_y \\\\ v_x & v_y \\end{vmatrix}`,
    derivation: [
      "Compute the four first-order partials ux, uy, vx, vy.",
      "Assemble the 2×2 Jacobian matrix J = [[ux, uy], [vx, vy]].",
      "The Jacobian determinant |J| = ux·vy − uy·vx is the local oriented area scaling.",
    ],
    properties: [
      "T is locally invertible at p ⇔ |J(p)| ≠ 0 (Inverse Function Theorem).",
      "Change of variables: ∬ f(u, v) du dv = ∬ f(u(x,y), v(x,y)) · |J| dx dy.",
    ],
    applications: [
      "Conversion between Cartesian, polar, cylindrical, and spherical coordinates.",
      "Robotics — relating joint velocities to end-effector velocities.",
    ],
  },
  {
    category: "Differential Equations", title: "Constant-Coefficient Linear ODEs",
    intro: "Linear ODEs with constant coefficients are solved by guessing y = eʳˣ; the exponent r must satisfy the characteristic algebraic equation.",
    formula: `a y'' + b y' + c y = 0 \\;\\Rightarrow\\; ar^2 + br + c = 0`,
    derivation: [
      "Substitute y = eʳˣ into the ODE: (ar² + br + c) eʳˣ = 0 → ar² + br + c = 0.",
      "Compute discriminant Δ = b² − 4ac and find the two roots r₁, r₂.",
      "Case Δ > 0: y = C₁ eʳ¹ˣ + C₂ eʳ²ˣ. Case Δ = 0 (double root r): y = (C₁ + C₂ x) eʳˣ. Case Δ < 0 (r = α ± βi): y = eᵅˣ (C₁ cos βx + C₂ sin βx).",
    ],
    properties: [
      "Solution space is 2-dimensional for a second-order linear ODE.",
      "Stability of the equilibrium y = 0 is determined by the real parts of the roots.",
    ],
    applications: [
      "Mechanical / electrical oscillators (mass-spring-damper, RLC circuits).",
      "Population dynamics with linear interaction terms.",
    ],
  },
  {
    category: "Integration", title: "Double Integrals",
    intro: "A double integral computes the signed volume under a surface z = f(x, y) over a planar region R. Fubini's theorem allows it to be evaluated as an iterated integral.",
    formula: `\\iint_R f(x, y) \\, dA = \\int_c^d \\int_a^b f(x, y) \\, dx \\, dy`,
    derivation: [
      "Partition R into small rectangles of area ΔxΔy and form Riemann sums Σ f(xᵢ, yⱼ) ΔxΔy.",
      "Taking the limit as Δx, Δy → 0 yields ∬_R f dA when f is continuous (Riemann-integrable).",
      "Fubini: under mild conditions, the double integral equals either iterated single integral.",
    ],
    properties: [
      "Linearity, additivity over sub-regions, monotonicity in f.",
      "Polar form: dA = r dr dθ; general change of variables uses the Jacobian.",
    ],
    applications: [
      "Computing mass, centroids, and moments of plane laminae.",
      "Probability — marginal densities of joint distributions.",
    ],
  },
  {
    category: "Integration", title: "Leibniz Rule (Differentiation Under the Integral Sign)",
    intro: "When an integral depends smoothly on a parameter t, the derivative with respect to t can often be brought inside the integral.",
    formula: `\\dfrac{d}{dt} \\int_{a(t)}^{b(t)} f(x, t) \\, dx = \\int_{a(t)}^{b(t)} \\dfrac{\\partial f}{\\partial t} \\, dx + f(b(t), t) b'(t) - f(a(t), t) a'(t)`,
    derivation: [
      "Apply the chain rule to F(t) = ∫_{a(t)}^{b(t)} f(x, t) dx viewed as a composite of (a, b, t).",
      "Hypotheses: f and ∂f/∂t are continuous on a neighbourhood of [a, b] × {t}.",
      "For fixed limits the boundary terms vanish and only the parametric term remains.",
    ],
    properties: [
      "Powerful tool to evaluate definite integrals by introducing an auxiliary parameter (Feynman's trick).",
    ],
    applications: [
      "Special integrals (Dirichlet integral, Gaussian integrals).",
      "Sensitivity analysis of integrated quantities in physics and engineering.",
    ],
  },
  {
    category: "Fourier", title: "Fourier Series",
    intro: "Any sufficiently nice periodic function on [−L, L] can be expanded as a sum of sines and cosines whose coefficients are computed by orthogonality.",
    formula: `f(x) = \\dfrac{a_0}{2} + \\sum_{n=1}^{\\infty} a_n \\cos\\dfrac{n\\pi x}{L} + b_n \\sin\\dfrac{n\\pi x}{L}`,
    derivation: [
      "{1, cos(nπx/L), sin(nπx/L)} form an orthogonal basis on [−L, L] with respect to the L² inner product.",
      "Projecting f onto each basis element yields aₙ = (1/L) ∫_{−L}^{L} f(x) cos(nπx/L) dx and bₙ analogously.",
      "Dirichlet's theorem: the series converges to f(x) at points of continuity and to ½(f(x⁻) + f(x⁺)) at jump discontinuities.",
    ],
    properties: [
      "Parseval's identity: (1/L) ∫ f² dx = a₀²/2 + Σ (aₙ² + bₙ²).",
      "Even functions have only cosines; odd functions have only sines.",
    ],
    applications: [
      "Signal processing, heat conduction, vibrations of strings and beams.",
    ],
  },
  {
    category: "Fourier", title: "Harmonic Analysis (Discrete)",
    intro: "Discrete harmonic analysis decomposes N equally spaced samples of a periodic signal into a finite sum of harmonics.",
    formula: `a_h = \\dfrac{2}{N} \\sum_{i=0}^{N-1} f_i \\cos\\dfrac{2\\pi h i}{N}, \\quad b_h = \\dfrac{2}{N} \\sum_{i=0}^{N-1} f_i \\sin\\dfrac{2\\pi h i}{N}`,
    derivation: [
      "Use the discrete orthogonality of cos(2πhi/N) and sin(2πhi/N) over i = 0, …, N − 1.",
      "The DC component is a₀ = (1/N) Σ fᵢ; higher harmonics follow from the formulas above.",
      "Reconstruct as f(t) ≈ a₀ + Σₕ [aₕ cos(2πht/T) + bₕ sin(2πht/T)].",
    ],
    properties: [
      "Equivalent to the real form of the Discrete Fourier Transform (DFT).",
      "Aliasing occurs above the Nyquist frequency N/2.",
    ],
    applications: [
      "Spectral analysis of sampled signals (audio, vibration, ECG).",
    ],
  },
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
        <div className="pl-card pl-soft-shadow p-6 space-y-6">
          <div>
            <div className="text-xs text-muted-foreground">{topic.category} · {topic.title}</div>
            <h2 id="introduction" className="text-2xl font-semibold mt-1">{topic.title}</h2>
            <p className="text-sm text-foreground/80 mt-3 leading-relaxed">{topic.intro}</p>
          </div>
          <section>
            <h3 id="formula" className="font-medium">Key formula</h3>
            <div className="mt-2 overflow-x-auto"><F block>{topic.formula}</F></div>
          </section>
          {topic.derivation && (
            <section>
              <h3 id="derivation" className="font-medium">Derivation</h3>
              <ol className="mt-2 space-y-2 list-decimal pl-5 text-sm text-foreground/85 leading-relaxed">
                {topic.derivation.map((d, i) => <li key={i}>{d}</li>)}
              </ol>
            </section>
          )}
          {topic.properties && (
            <section>
              <h3 id="properties" className="font-medium">Properties</h3>
              <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm text-foreground/85 leading-relaxed">
                {topic.properties.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </section>
          )}
          {topic.example && (
            <section>
              <h3 id="examples" className="font-medium">Example</h3>
              <div className="mt-2 overflow-x-auto"><F block>{topic.example}</F></div>
            </section>
          )}
          {topic.applications && (
            <section>
              <h3 id="applications" className="font-medium">Applications</h3>
              <ul className="mt-2 space-y-1.5 list-disc pl-5 text-sm text-foreground/85 leading-relaxed">
                {topic.applications.map((a, i) => <li key={i}>{a}</li>)}
              </ul>
            </section>
          )}
          {topic.notes && <p className="text-xs text-muted-foreground">{topic.notes}</p>}
        </div>
        <aside className="text-sm pl-card pl-soft-shadow p-4 h-fit">
          <div className="font-medium mb-3">In This Topic</div>
          <ul className="space-y-1 text-muted-foreground">
            {[
              ["Introduction","introduction"],
              ["Formula","formula"],
              topic.derivation && ["Derivation","derivation"],
              topic.properties && ["Properties","properties"],
              topic.example && ["Examples","examples"],
              topic.applications && ["Applications","applications"],
            ].filter(Boolean).map((t) => {
              const [label, id] = t as [string, string];
              return <li key={id}><a href={`#${id}`} className="hover:text-foreground">{label}</a></li>;
            })}
          </ul>
        </aside>
      </div>
    </WorkspaceShell>
  );
}
