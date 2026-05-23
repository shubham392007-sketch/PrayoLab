import { WorkspaceShell } from "./workspace-shell";
import { Link } from "@tanstack/react-router";
import { ChevronLeft } from "lucide-react";

export function LabShell({
  title, subtitle, right, children,
}: { title: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode }) {
  return (
    <WorkspaceShell>
      <div className="mb-4">
        <Link to="/labs" className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1">
          <ChevronLeft className="size-3" /> All Laboratories
        </Link>
        <div className="mt-3 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
          </div>
          {right}
        </div>
      </div>
      {children}
    </WorkspaceShell>
  );
}