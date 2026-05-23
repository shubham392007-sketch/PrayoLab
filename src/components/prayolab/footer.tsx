import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";

export function Footer() {
  return (
    <footer className="border-t border-border mt-24">
      <div className="mx-auto max-w-7xl px-5 py-12 grid gap-8 md:grid-cols-4">
        <div className="space-y-3">
          <Logo />
          <p className="text-sm text-muted-foreground max-w-xs">
            An interactive virtual mathematics laboratory for engineering students.
          </p>
        </div>
        <FooterCol title="Platform" items={[["Labs","/labs"],["Theory","/theory"],["Practice","/practice"],["Graph Visualizer","/graph-visualizer"]]} />
        <FooterCol title="Company" items={[["About","/about"],["How to Use","/how-to-use"],["Developers","/developers"],["Contact","/contact"]]} />
        <FooterCol title="Account" items={[["Login","/login"],["Sign Up","/signup"],["Dashboard","/dashboard"],["Profile","/profile"]]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto max-w-7xl px-5 py-5 flex flex-wrap justify-between text-xs text-muted-foreground">
          <span>© {new Date().getFullYear()} PrayoLab. Engineered for excellence.</span>
          <span>v1.0 · Built for mathematicians</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <div className="text-sm font-medium mb-3">{title}</div>
      <ul className="space-y-2 text-sm text-muted-foreground">
        {items.map(([label, to]) => (
          <li key={to}><Link to={to} className="hover:text-foreground">{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}