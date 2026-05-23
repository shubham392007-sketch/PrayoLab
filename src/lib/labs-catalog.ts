export type LabEntry = {
  slug: string;
  to: string;
  title: string;
  summary: string;
  category: "Linear Algebra" | "Calculus" | "Differential Equations" | "Fourier" | "Integration";
};

export const LAB_CATALOG: LabEntry[] = [
  { slug: "matrices", to: "/labs/matrices", title: "Matrix Laboratory", summary: "Determinants, inverse, transpose, rank.", category: "Linear Algebra" },
  { slug: "cramer-rule", to: "/labs/cramer-rule", title: "Cramer's Rule", summary: "Solve linear systems via determinants.", category: "Linear Algebra" },
  { slug: "equations", to: "/labs/equations", title: "Equation Solver", summary: "Symbolic equation solving.", category: "Linear Algebra" },
  { slug: "linear-dependence", to: "/labs/linear-dependence", title: "Linear Dependence", summary: "Test vectors for linear dependence.", category: "Linear Algebra" },
  { slug: "expansions", to: "/labs/expansions", title: "Function Expansions", summary: "Taylor, Maclaurin, binomial expansions.", category: "Calculus" },
  { slug: "differential-equations", to: "/labs/differential-equations", title: "Differential Equations", summary: "Higher-order ODE solver.", category: "Differential Equations" },
  { slug: "nth-derivative", to: "/labs/nth-derivative", title: "Nth Derivative", summary: "Repeated symbolic differentiation.", category: "Calculus" },
  { slug: "fourier-series", to: "/labs/fourier-series", title: "Fourier Series", summary: "Coefficients & harmonic visualization.", category: "Fourier" },
  { slug: "harmonic-analysis", to: "/labs/harmonic-analysis", title: "Harmonic Analysis", summary: "Discrete harmonic decomposition.", category: "Fourier" },
  { slug: "maxima-minima", to: "/labs/maxima-minima", title: "Maxima & Minima", summary: "Critical points and Hessian.", category: "Calculus" },
  { slug: "jacobian", to: "/labs/jacobian", title: "Jacobian Lab", summary: "Coordinate transformations.", category: "Calculus" },
  { slug: "euler-theorem", to: "/labs/euler-theorem", title: "Euler's Theorem", summary: "Homogeneous functions & verification.", category: "Calculus" },
  { slug: "partial-differentiation", to: "/labs/partial-differentiation", title: "Partial Differentiation", summary: "Partial, total & directional derivatives.", category: "Calculus" },
  { slug: "differentiation-under-integral", to: "/labs/differentiation-under-integral", title: "Differentiation Under Integral", summary: "Leibniz integral rule.", category: "Integration" },
  { slug: "double-integrals", to: "/labs/double-integrals", title: "Double Integrals", summary: "Cartesian and polar integration.", category: "Integration" },
];