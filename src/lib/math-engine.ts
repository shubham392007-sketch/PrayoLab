import { matrix, det as mjDet, inv as mjInv, transpose as mjT, multiply, add, subtract, derivative, simplify, evaluate, parse } from "mathjs";

export type Mat = number[][];

export const safeMatrix = (rows: number, cols: number, fill = 0): Mat =>
  Array.from({ length: rows }, () => Array.from({ length: cols }, () => fill));

export const fmt = (n: number, d = 4) => {
  if (!Number.isFinite(n)) return "—";
  const r = Math.round(n * 10 ** d) / 10 ** d;
  return Object.is(r, -0) ? 0 : r;
};

export const det = (m: Mat) => Number(mjDet(matrix(m)));
export const inverse = (m: Mat): Mat => (mjInv(matrix(m)).toArray() as Mat);
export const transpose = (m: Mat): Mat => (mjT(matrix(m)).toArray() as Mat);
export const matMul = (a: Mat, b: Mat): Mat => (multiply(matrix(a), matrix(b)).toArray() as Mat);
export const matAdd = (a: Mat, b: Mat): Mat => (add(matrix(a), matrix(b)).toArray() as Mat);
export const matSub = (a: Mat, b: Mat): Mat => (subtract(matrix(a), matrix(b)).toArray() as Mat);

/** Compute rank via Gaussian elimination (numerical). */
export const rank = (m: Mat): number => {
  const a = m.map((r) => r.slice());
  const R = a.length, C = a[0]?.length ?? 0;
  let r = 0;
  for (let c = 0; c < C && r < R; c++) {
    let piv = r;
    for (let i = r + 1; i < R; i++) if (Math.abs(a[i][c]) > Math.abs(a[piv][c])) piv = i;
    if (Math.abs(a[piv][c]) < 1e-10) continue;
    [a[r], a[piv]] = [a[piv], a[r]];
    for (let i = r + 1; i < R; i++) {
      const f = a[i][c] / a[r][c];
      for (let j = c; j < C; j++) a[i][j] -= f * a[r][j];
    }
    r++;
  }
  return r;
};

/** Latex helpers */
export const matToTex = (m: Mat) =>
  `\\begin{bmatrix} ${m.map((r) => r.map((v) => fmt(v)).join(" & ")).join(" \\\\ ")} \\end{bmatrix}`;

/** Symbolic derivative chain. */
export const nthDerivative = (expr: string, x: string, n: number) => {
  let cur = parse(expr).toString();
  const steps: { tex: string; expr: string }[] = [];
  for (let i = 0; i < n; i++) {
    const d = simplify(derivative(cur, x)).toString();
    steps.push({ tex: `\\frac{d^{${i + 1}}}{d${x}^{${i + 1}}} \\left(${parse(cur).toTex()}\\right) = ${parse(d).toTex()}`, expr: d });
    cur = d;
  }
  return { result: cur, steps };
};

/** Fourier series of a sampled f on [-L,L]: a0, a_n, b_n up to N. */
export function fourierCoeffs(f: (x: number) => number, L: number, N: number, samples = 1024) {
  const dx = (2 * L) / samples;
  const integrate = (g: (x: number) => number) => {
    let s = 0;
    for (let i = 0; i < samples; i++) {
      const x = -L + (i + 0.5) * dx;
      s += g(x);
    }
    return s * dx;
  };
  const a0 = (1 / (2 * L)) * integrate(f);
  const a: number[] = [];
  const b: number[] = [];
  for (let n = 1; n <= N; n++) {
    a.push((1 / L) * integrate((x) => f(x) * Math.cos((n * Math.PI * x) / L)));
    b.push((1 / L) * integrate((x) => f(x) * Math.sin((n * Math.PI * x) / L)));
  }
  return { a0, a, b };
}

export const fourierEval = (
  coeffs: { a0: number; a: number[]; b: number[] },
  L: number,
  x: number,
  N?: number,
) => {
  const { a0, a, b } = coeffs;
  let s = a0;
  const limit = N ?? a.length;
  for (let n = 1; n <= limit; n++) {
    s += a[n - 1] * Math.cos((n * Math.PI * x) / L);
    s += b[n - 1] * Math.sin((n * Math.PI * x) / L);
  }
  return s;
};

export const safeEval = (expr: string, scope: Record<string, number>) => {
  try { return Number(evaluate(expr, scope)); } catch { return NaN; }
};

export const tex = (expr: string) => {
  try { return parse(expr).toTex(); } catch { return expr; }
};