import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { useSaved } from "@/lib/saved-store";

export const Route = createFileRoute("/saved-work")({ component: Page });

function Page() {
  const { activity } = useSaved();
  return (
    <WorkspaceShell title="Saved Work" subtitle="History of your sessions and bookmarks.">
      <ul className="pl-card pl-soft-shadow divide-y divide-border">
        {activity.map((a) => (
          <li key={a.id} className="p-4 flex justify-between text-sm">
            <span>{a.title}</span>
            <span className="text-xs text-muted-foreground">{new Date(a.at).toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </WorkspaceShell>
  );
}
