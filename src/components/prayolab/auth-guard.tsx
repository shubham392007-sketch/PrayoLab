import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/lib/auth-store";

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { user, hydrated } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (hydrated && !user) navigate({ to: "/login" });
  }, [hydrated, user, navigate]);
  if (!hydrated) return <div className="min-h-screen grid place-items-center text-muted-foreground text-sm">Loading workspace…</div>;
  if (!user) return null;
  return <>{children}</>;
}