import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { useAuth, initials } from "@/lib/auth-store";
import { useSaved } from "@/lib/saved-store";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/profile")({ component: Page });

function Page() {
  const user = useAuth((s) => s.user)!;
  const { reports, activity, favorites } = useSaved();
  return (
    <WorkspaceShell>
      <div className="pl-card pl-soft-shadow p-6 flex flex-wrap items-center gap-5">
        <div className="size-16 rounded-full bg-foreground text-background grid place-items-center text-lg font-semibold">{initials(user.fullName)}</div>
        <div className="flex-1 min-w-[200px]">
          <div className="text-xl font-semibold">{user.fullName}</div>
          <div className="text-sm text-muted-foreground">{user.email}</div>
          <div className="text-xs text-muted-foreground mt-1">{user.university} · {user.branch} · {user.semester}</div>
        </div>
        <Button variant="outline" className="rounded-full">Edit Profile</Button>
      </div>
      <div className="grid sm:grid-cols-4 gap-4 mt-6">
        {[["Labs Completed", "28"], ["Problems Solved", "156"], ["Reports Generated", String(reports.length)], ["Theory Read", "89"]].map(([l, n]) => (
          <div key={l} className="pl-card pl-soft-shadow p-5">
            <div className="text-3xl font-semibold tracking-tight">{n}</div>
            <div className="text-xs text-muted-foreground mt-1">{l}</div>
          </div>
        ))}
      </div>
      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <div className="pl-card pl-soft-shadow p-5">
          <div className="font-medium mb-3">Recent Activity</div>
          <ul className="space-y-3 text-sm">
            {activity.slice(0, 6).map((a) => (
              <li key={a.id} className="flex justify-between"><span>{a.title}</span><span className="text-xs text-muted-foreground">{new Date(a.at).toLocaleDateString()}</span></li>
            ))}
          </ul>
        </div>
        <div className="pl-card pl-soft-shadow p-5">
          <div className="font-medium mb-3">Favorite Topics</div>
          <div className="flex flex-wrap gap-2">
            {favorites.map((f) => <span key={f} className="pl-chip">{f}</span>)}
          </div>
        </div>
      </div>
    </WorkspaceShell>
  );
}
