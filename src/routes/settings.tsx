import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

export const Route = createFileRoute("/settings")({ component: Page });

function Page() {
  const [dark, setDark] = useState(false);
  return (
    <WorkspaceShell title="Settings" subtitle="Manage appearance, graph preferences and exports.">
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1 text-sm">
          {["General","Appearance","Graph Settings","Export Settings","Notifications","Account","Security"].map((t,i)=>(
            <a key={t} href="#" className={`block px-3 py-2 rounded-lg ${i===1?"bg-secondary text-foreground font-medium":"text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>{t}</a>
          ))}
        </nav>
        <div className="space-y-6">
          <Card title="Theme">
            <div className="flex gap-3">
              {["Light","Dark","System"].map((t,i) => (
                <button key={t} onClick={() => setDark(i===1)} className={`px-4 h-10 rounded-lg border text-sm ${(!dark&&i===0)||(dark&&i===1)?"bg-foreground text-background border-foreground":"border-border"}`}>{t}</button>
              ))}
            </div>
          </Card>
          <Card title="Primary Color">
            <div className="flex gap-2">{["#111","#D8F000","#3B82F6","#EF4444","#F59E0B"].map(c=>(<span key={c} className="size-8 rounded-full border border-border" style={{background:c}}/>))}</div>
          </Card>
          <Card title="Accessibility">
            <Row label="High contrast"><Switch /></Row>
            <Row label="Reduce motion"><Switch /></Row>
            <Row label="Larger text"><Switch /></Row>
          </Card>
        </div>
      </div>
    </WorkspaceShell>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return <div className="pl-card pl-soft-shadow p-5"><div className="font-medium mb-3">{title}</div>{children}</div>;
}
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return <div className="flex items-center justify-between py-2"><span className="text-sm">{label}</span>{children}</div>;
}
