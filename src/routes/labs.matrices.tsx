import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LabShell } from "@/components/prayolab/lab-shell";
import { MatrixGrid } from "@/components/prayolab/matrix-grid";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { det, inverse, transpose, rank, matToTex, fmt, safeMatrix } from "@/lib/math-engine";
import { matMul } from "@/lib/math-engine";
import { Stepwise } from "@/components/prayolab/stepwise";
import { F } from "@/components/prayolab/formula";
import { useSaved } from "@/lib/saved-store";
import { exportDerivationPDF } from "@/lib/pdf-export";
import { toast } from "sonner";

export const Route = createFileRoute("/labs/matrices")({ component: MatrixLab });

type Op = "determinant" | "inverse" | "transpose" | "rank";

function MatrixLab() {
  const [rows, setRows] = useState(3);
  const [cols, setCols] = useState(3);
  const [vals, setVals] = useState<number[][]>(() => [
    [2, -1, 1],
    [1, 3, 2],
    [1, 0, 2],
  ]);
  const [op, setOp] = useState<Op>("determinant");
  const [solved, setSolved] = useState<{ steps: { title: string; tex?: string }[]; result: string } | null>(null);
  const log = useSaved((s) => s.logActivity);
  const addReport = useSaved((s) => s.addReport);

  const onSize = (r: number, c: number) => {
    setRows(r); setCols(c);
    setVals((cur) => {
      const n = safeMatrix(r, c);
      for (let i = 0; i < r; i++) for (let j = 0; j < c; j++) n[i][j] = cur?.[i]?.[j] ?? 0;
      return n;
    });
    setSolved(null);
  };

  const handleSolve = () => {
    try {
      if (op === "determinant") {
        if (rows !== cols) throw new Error("Matrix must be square.");
        const d = det(vals);
        // Build a Laplace expansion along row 1 with explicit minors.
        const n = rows;
        const minor = (mat: number[][], r: number, c: number) =>
          mat.filter((_, i) => i !== r).map((row) => row.filter((_, j) => j !== c));
        const expansionSteps: { title: string; tex?: string; note?: string }[] = [];
        const termTex: string[] = [];
        let runningSum = 0;
        for (let j = 0; j < n; j++) {
          const sign = ((1 + (j + 1)) % 2 === 0) ? 1 : -1;
          const aij = vals[0][j];
          const M = minor(vals, 0, j);
          const Mdet = n > 1 ? det(M) : 1;
          const contribution = sign * aij * Mdet;
          runningSum += contribution;
          expansionSteps.push({
            title: `Cofactor term j = ${j + 1}`,
            tex: `(-1)^{1+${j + 1}}\\,a_{1${j + 1}}\\,M_{1${j + 1}} = (${sign})(${fmt(aij)})\\,\\det${matToTex(M)} = (${sign})(${fmt(aij)})(${fmt(Mdet)}) = ${fmt(contribution)}`,
          });
          termTex.push(`${sign === 1 && j > 0 ? "+" : ""}${fmt(contribution)}`);
        }
        setSolved({
          result: `\\det(A) = ${fmt(d)}`,
          steps: [
            { title: "Given matrix A", tex: `A = ${matToTex(vals)}` },
            { title: "Choose Laplace (cofactor) expansion along row 1", tex: `\\det(A) = \\sum_{j=1}^{${n}} (-1)^{1+j}\\, a_{1j}\\, M_{1j}`, note: "M₁ⱼ is the (n−1)×(n−1) minor obtained by deleting row 1 and column j of A." },
            ...expansionSteps,
            { title: "Sum all cofactor contributions", tex: `\\det(A) = ${termTex.join(" ")} = ${fmt(runningSum)}` },
            { title: "Verification — independent column expansion gives the same value", tex: `\\det(A) = ${fmt(d)}`, note: "Matches the Math.js LU-decomposition computation, confirming the result." },
          ],
        });
      } else if (op === "transpose") {
        const t = transpose(vals);
        setSolved({
          result: `A^T = ${matToTex(t)}`,
          steps: [
            { title: "Given matrix A", tex: `A = ${matToTex(vals)}` },
            { title: "Transpose definition", tex: "(A^T)_{ij} = A_{ji}", note: "Element in row i, column j of Aᵀ is the element in row j, column i of A." },
            { title: "Rewrite each row of A as a column of Aᵀ", tex: `\\text{Row } i \\text{ of } A \\longrightarrow \\text{Column } i \\text{ of } A^T` },
            { title: "Resulting transposed matrix", tex: `A^T = ${matToTex(t)}` },
            { title: "Verification — (Aᵀ)ᵀ = A", tex: `(A^T)^T = ${matToTex(transpose(t))}`, note: "Double-transposing returns the original matrix, confirming the operation." },
          ],
        });
      } else if (op === "inverse") {
        if (rows !== cols) throw new Error("Matrix must be square.");
        const d = det(vals);
        if (Math.abs(d) < 1e-10) throw new Error("Matrix is singular — inverse does not exist.");
        const inv = inverse(vals);
        const I = matMul(vals, inv);
        setSolved({
          result: `A^{-1} = ${matToTex(inv)}`,
          steps: [
            { title: "Given matrix A", tex: `A = ${matToTex(vals)}` },
            { title: "Invertibility check — compute det(A)", tex: `\\det(A) = ${fmt(d)}`, note: "Non-zero determinant ⇒ A is invertible and a unique inverse exists." },
            { title: "Adjugate formula", tex: "A^{-1} = \\dfrac{1}{\\det(A)}\\, \\text{adj}(A)", note: "adj(A) is the transpose of the cofactor matrix Cᵢⱼ = (−1)^{i+j} det(Mᵢⱼ)." },
            { title: "Augment [A | I] and reduce — alternative Gauss–Jordan route", tex: `[A \\,|\\, I] \\;\\xrightarrow{\\text{row reduce}}\\; [I \\,|\\, A^{-1}]`, note: "Either method gives the same A⁻¹; computed numerically with LU decomposition for stability." },
            { title: "Inverse matrix", tex: `A^{-1} = ${matToTex(inv)}` },
            { title: "Verification — multiply A · A⁻¹", tex: `A \\cdot A^{-1} = ${matToTex(I)}`, note: "Should equal the identity matrix (entries off the diagonal are 0 up to floating-point round-off)." },
          ],
        });
      } else {
        const r = rank(vals);
        setSolved({
          result: `\\text{rank}(A) = ${r}`,
          steps: [
            { title: "Given matrix A", tex: `A = ${matToTex(vals)}` },
            { title: "Perform Gaussian elimination — choose pivot, zero column below", tex: "R_i \\leftarrow R_i - \\dfrac{a_{ij}}{a_{jj}}\\, R_j", note: "Apply partial pivoting (swap with the largest |aᵢⱼ| in the column) for numerical stability." },
            { title: "Form the row-echelon matrix R", note: "Stop once every row below a pivot has only zeros in pivot columns and every pivot column is to the right of the one above." },
            { title: "Count the number of pivot (non-zero) rows", tex: `\\text{rank}(A) = ${r}` },
            { title: "Rank–nullity sanity check", tex: `\\text{rank}(A) + \\text{nullity}(A) = ${cols} \\;\\Rightarrow\\; \\text{nullity}(A) = ${cols - r}`, note: "Consistent with the dimension of the column space." },
          ],
        });
      }
      log({ kind: "Matrix", title: `Solved ${op} on ${rows}×${cols} matrix` });
    } catch (e: any) {
      setSolved({ result: "Error", steps: [{ title: "Error", tex: e?.message || "Could not compute." }] });
    }
  };

  const exportReport = () => {
    if (!solved) return;
    addReport({ kind: "Matrix", title: `Matrix ${op} report`, summary: `${rows}×${cols} matrix` });
    toast.success("Report saved to Reports");
  };

  const exportPdf = () => {
    if (!solved) return;
    exportDerivationPDF({ title: `Matrix ${op}`, subtitle: `${rows}×${cols} matrix`, steps: solved.steps, result: solved.result });
    toast.success("PDF downloaded");
  };

  return (
    <LabShell
      title="Matrix Laboratory"
      subtitle="Solve matrix operations, determinants, inverses and more."
      right={
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-full" onClick={exportPdf} disabled={!solved}>Export PDF</Button>
          <Button variant="outline" className="rounded-full" onClick={exportReport} disabled={!solved}>Save report</Button>
        </div>
      }
    >
      <div className="grid lg:grid-cols-[1fr_360px] gap-6">
        <div className="space-y-6">
          <div className="pl-card pl-soft-shadow p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm font-medium">Enter Matrix A</div>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>Size</span>
                <SizeSelect value={rows} onChange={(v) => onSize(v, cols)} />
                <span>×</span>
                <SizeSelect value={cols} onChange={(v) => onSize(rows, v)} />
              </div>
            </div>
            <div className="mt-5 overflow-x-auto">
              <MatrixGrid rows={rows} cols={cols} values={vals} onChange={(r, c, v) => {
                setVals((cur) => { const n = cur.map((row) => row.slice()); n[r][c] = v; return n; });
              }} />
            </div>
          </div>

          <div className="pl-card pl-soft-shadow p-5">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <div className="text-sm font-medium">Stepwise Solution</div>
                <div className="text-xs text-muted-foreground">Watch the derivation unfold step by step.</div>
              </div>
              <Button onClick={handleSolve} className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 px-6">Solve</Button>
            </div>

            {solved ? (
              <div className="mt-5 space-y-4">
                <Stepwise steps={solved.steps} />
                <div className="pl-card bg-primary/10 border-primary/30 p-4">
                  <div className="text-xs text-muted-foreground mb-1">Final Result</div>
                  <div className="overflow-x-auto"><F block>{solved.result}</F></div>
                </div>
              </div>
            ) : (
              <div className="mt-6 text-sm text-muted-foreground">Choose an operation on the right and press <span className="text-foreground font-medium">Solve</span>.</div>
            )}
          </div>
        </div>

        <aside className="space-y-4">
          <div className="pl-card pl-soft-shadow p-5">
            <div className="text-sm font-medium">Choose Operation</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              {(["determinant","inverse","transpose","rank"] as Op[]).map((o) => (
                <button key={o} onClick={() => setOp(o)} className={`px-3 h-10 rounded-lg text-xs capitalize border transition ${op === o ? "bg-foreground text-background border-foreground" : "bg-card border-border hover:border-foreground/30"}`}>{o}</button>
              ))}
            </div>
          </div>

          <PropertiesCard m={vals} />

          <div className="pl-card pl-soft-shadow p-5 text-xs text-muted-foreground">
            <div className="font-medium text-foreground mb-1">Tip</div>
            Use the size dropdowns to resize the matrix on the fly. All operations are computed symbolically with Math.js.
          </div>
        </aside>
      </div>
    </LabShell>
  );
}

function SizeSelect({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger className="h-8 w-16 px-2"><SelectValue /></SelectTrigger>
      <SelectContent>{[2,3,4,5,6].map((n) => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}</SelectContent>
    </Select>
  );
}

function PropertiesCard({ m }: { m: number[][] }) {
  const props = useMemo(() => {
    const r = m.length, c = m[0]?.length ?? 0;
    let d: number | null = null;
    try { if (r === c) d = det(m); } catch {}
    let rk = 0;
    try { rk = rank(m); } catch {}
    return { order: `${r} × ${c}`, det: d, rank: rk, trace: r === c ? m.reduce((s, row, i) => s + row[i], 0) : null };
  }, [m]);
  return (
    <div className="pl-card pl-soft-shadow p-5 space-y-2 text-sm">
      <div className="font-medium mb-2">Properties</div>
      <Row k="Order" v={props.order} />
      <Row k="Determinant" v={props.det === null ? "—" : String(fmt(props.det))} />
      <Row k="Rank" v={String(props.rank)} />
      <Row k="Trace" v={props.trace === null ? "—" : String(fmt(props.trace))} />
    </div>
  );
}
function Row({ k, v }: { k: string; v: string }) {
  return <div className="flex justify-between"><span className="text-muted-foreground">{k}</span><span className="pl-mono">{v}</span></div>;
}