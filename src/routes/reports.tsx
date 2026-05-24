import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { useSaved } from "@/lib/saved-store";
import { FileText, Download } from "lucide-react";
import { exportReportPDF } from "@/lib/pdf-export";
import { toast } from "sonner";

export const Route = createFileRoute("/reports")({ component: Page });

function Page() {
  const { reports, removeReport } = useSaved();
  return (
    <WorkspaceShell title="Saved Reports" subtitle="All your saved derivations and exports.">
      <div className="pl-card pl-soft-shadow divide-y divide-border">
        {reports.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No saved reports yet. Solve in any laboratory and use “Save report” to add one.
          </div>
        )}
        {reports.map((r) => (
          <div key={r.id} className="p-4 flex items-center gap-4">
            <span className="size-10 rounded-lg bg-secondary grid place-items-center"><FileText className="size-4" /></span>
            <div className="flex-1 min-w-0">
              <div className="font-medium truncate">{r.title}</div>
              <div className="text-xs text-muted-foreground">{r.summary} · {new Date(r.createdAt).toLocaleDateString()}</div>
            </div>
            <span className="pl-chip">{r.kind}</span>
            <button
              onClick={() => { exportReportPDF(r); toast.success("PDF downloaded"); }}
              title="Download PDF"
              className="size-9 rounded-full hover:bg-secondary grid place-items-center"
            >
              <Download className="size-4" />
            </button>
            <button
              onClick={() => { removeReport(r.id); toast("Report removed"); }}
              title="Delete"
              className="text-xs text-muted-foreground hover:text-foreground px-2"
            >Delete</button>
          </div>
        ))}
      </div>
    </WorkspaceShell>
  );
}
