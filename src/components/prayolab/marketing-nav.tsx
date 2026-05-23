import { Link } from "@tanstack/react-router";
import { Logo } from "./logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";

const links = [
  { to: "/", label: "Home" },
  { to: "/labs", label: "Labs" },
  { to: "/theory", label: "Theory" },
  { to: "/practice", label: "Practice" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function MarketingNav() {
  const user = useAuth((s) => s.user);
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-background/70 border-b border-border">
      <div className="mx-auto max-w-7xl px-5 h-16 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center gap-7 text-sm text-muted-foreground">
          {links.map((l) => (
            <Link key={l.to} to={l.to} className="hover:text-foreground transition-colors" activeProps={{ className: "text-foreground" }}>
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          {user ? (
            <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4">
              <Link to="/dashboard">Open Workspace</Link>
            </Button>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm" className="rounded-full">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm" className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-full px-4">
                <Link to="/signup">Get Started</Link>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}