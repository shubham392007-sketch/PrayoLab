import { createFileRoute } from "@tanstack/react-router";
import { WorkspaceShell } from "@/components/prayolab/workspace-shell";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/settings")({ component: Page });

function Page() {
  const [theme, setTheme] = useState<"Light" | "Dark" | "System">(() => {
    if (typeof window === "undefined") return "Light";
    return (localStorage.getItem("prayolab.theme") as any) || "Light";
  });
  const [reduceMotion, setReduceMotion] = useState(false);
  const [largerText, setLargerText] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [section, setSection] = useState("Appearance");

  useEffect(() => {
    if (typeof document === "undefined") return;
    const root = document.documentElement;
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    const dark = theme === "Dark" || (theme === "System" && prefersDark);
    root.classList.toggle("dark", dark);
    localStorage.setItem("prayolab.theme", theme);
  }, [theme]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.style.fontSize = largerText ? "17px" : "";
    document.documentElement.dataset.reduceMotion = reduceMotion ? "true" : "";
    document.documentElement.classList.toggle("high-contrast", highContrast);
  }, [largerText, reduceMotion, highContrast]);

  return (
    <WorkspaceShell title="Settings" subtitle="Manage appearance, graph preferences and exports.">
      <div className="grid lg:grid-cols-[220px_1fr] gap-6">
        <nav className="space-y-1 text-sm">
          {["General","Appearance","Graph Settings","Export Settings","Notifications","Account","Security"].map((t)=>(
            <button key={t} onClick={() => setSection(t)} className={`block w-full text-left px-3 py-2 rounded-lg ${section===t?"bg-secondary text-foreground font-medium":"text-muted-foreground hover:bg-secondary hover:text-foreground"}`}>{t}</button>
          ))}
        </nav>
        <div className="space-y-6">
          <Card title="Theme">
            <div className="flex gap-3">
              {(["Light","Dark","System"] as const).map((t) => (
                <button key={t} onClick={() => { setTheme(t); toast.success(`Theme set to ${t}`); }} className={`px-4 h-10 rounded-lg border text-sm ${theme===t?"bg-foreground text-background border-foreground":"border-border"}`}>{t}</button>
              ))}
            </div>
          </Card>
          <Card title="Accessibility">
            <Row label="High contrast"><Switch checked={highContrast} onCheckedChange={setHighContrast} /></Row>
            <Row label="Reduce motion"><Switch checked={reduceMotion} onCheckedChange={setReduceMotion} /></Row>
            <Row label="Larger text"><Switch checked={largerText} onCheckedChange={setLargerText} /></Row>
          </Card>
          <Card title="Export defaults">
            <Row label="Include step numbering in PDF"><Switch defaultChecked /></Row>
            <Row label="Include PrayoLab footer"><Switch defaultChecked /></Row>
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
