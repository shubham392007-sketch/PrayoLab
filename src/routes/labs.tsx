import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { LAB_CATALOG } from "@/lib/labs-catalog";

export const Route = createFileRoute("/labs")({ component: LabsLayout });

function LabsLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  if (pathname !== "/labs") return <Outlet />;
  return (
    <WorkspaceShell title="Virtual Laboratories" subtitle="A curated set of interactive engineering mathematics labs.">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LAB_CATALOG.map((l) => (
          <Link key={l.slug} to={l.to} className="pl-card pl-soft-shadow p-5 hover:border-foreground/20 transition group">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="pl-chip">{l.category}</span>
            </div>
            <div className="mt-4 font-medium">{l.title}</div>
            <div className="text-sm text-muted-foreground mt-1">{l.summary}</div>
            <div className="mt-4 text-xs text-foreground">Open lab →</div>
          </Link>
        ))}
      </div>
    </WorkspaceShell>
  );
}