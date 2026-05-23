import { createFileRoute } from "@tanstack/react-router";
import { LabShell } from "@/components/prayolab/lab-shell";

export const Route = createFileRoute("/labs/equations")({ component: Page });

function Page() {
  return (
    <LabShell title="Equations" subtitle="Interactive laboratory.">
      <div className="pl-card pl-soft-shadow p-8 text-center">
        <div className="text-sm text-muted-foreground">This laboratory is part of the PrayoLab Equations module.</div>
        <p className="mt-3 text-foreground max-w-xl mx-auto">Full interactive engine is available in the flagship Matrix, Fourier, Cramer's Rule, Graph Visualizer and Double Integrals labs. Stepwise solver, derivation engine and visualizations follow the same patterns and are being progressively rolled out across all topics.</p>
      </div>
    </LabShell>
  );
}
