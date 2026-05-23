import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { Logo } from "./logo";
import { useAuth, initials } from "@/lib/auth-store";
import {
  Home, FlaskConical, BookOpen, Dumbbell, FileText, Bookmark, LineChart,
  User as UserIcon, Settings as SettingsIcon, Search, Bell, LogOut,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AuthGuard } from "./auth-guard";

const nav = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/labs", label: "Virtual Labs", icon: FlaskConical },
  { to: "/theory", label: "Theory Library", icon: BookOpen },
  { to: "/graph-visualizer", label: "Graph Visualizer", icon: LineChart },
  { to: "/practice", label: "Practice Arena", icon: Dumbbell },
  { to: "/saved-work", label: "Saved Work", icon: Bookmark },
  { to: "/reports", label: "Reports", icon: FileText },
  { to: "/profile", label: "Profile", icon: UserIcon },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

export function WorkspaceShell({
  title, subtitle, right, children,
}: {
  title?: string; subtitle?: string; right?: React.ReactNode; children: React.ReactNode;
}) {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <AuthGuard>
      <div className="min-h-screen bg-background text-foreground">
        <div className="flex">
          <aside className="hidden lg:flex flex-col w-64 shrink-0 h-screen sticky top-0 border-r border-border bg-card">
            <div className="px-5 h-16 flex items-center border-b border-border">
              <Logo to="/dashboard" />
            </div>
            <nav className="p-3 space-y-0.5 overflow-y-auto">
              {nav.map((n) => {
                const active = pathname === n.to || (n.to !== "/dashboard" && pathname.startsWith(n.to));
                const Icon = n.icon;
                return (
                  <Link key={n.to} to={n.to}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                      active ? "bg-primary text-primary-foreground font-medium"
                             : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}>
                    <Icon className="size-4" /> {n.label}
                  </Link>
                );
              })}
            </nav>
            <div className="mt-auto p-4 border-t border-border text-xs text-muted-foreground">
              <div className="pl-chip"><span className="size-1.5 rounded-full bg-primary" /> PrayoLab · Online</div>
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur border-b border-border flex items-center gap-4 px-5">
              <div className="flex-1 max-w-xl relative">
                <Search className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search labs, topics…" className="pl-9 h-10 rounded-full bg-secondary/60 border-transparent focus-visible:bg-card" />
              </div>
              <button className="size-10 grid place-items-center rounded-full hover:bg-secondary text-muted-foreground relative">
                <Bell className="size-4" />
                <span className="absolute top-2 right-2 size-1.5 rounded-full bg-primary" />
              </button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-full hover:bg-secondary">
                  <span className="size-8 rounded-full bg-foreground text-background grid place-items-center text-xs font-semibold">
                    {initials(user?.fullName ?? "U")}
                  </span>
                  <span className="hidden sm:block text-sm font-medium">{user?.fullName}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">{user?.email}</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate({ to: "/profile" })}>Profile</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/settings" })}>Settings</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate({ to: "/saved-work" })}>Saved work</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => { signOut(); navigate({ to: "/login" }); }}
                    className="text-destructive focus:text-destructive">
                    <LogOut className="size-4 mr-2" /> Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </header>

            {(title || right) && (
              <div className="px-5 lg:px-8 pt-6 pb-2 flex flex-wrap items-end justify-between gap-3">
                <div>
                  {title && <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>}
                  {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
                </div>
                {right}
              </div>
            )}

            <main className="px-5 lg:px-8 py-6">{children}</main>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}