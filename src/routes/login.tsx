import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/prayolab/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/login")({ component: LoginPage });

function LoginPage() {
  const [email, setEmail] = useState("");
  const [pwd, setPwd] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const signIn = useAuth((s) => s.signIn);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!email || !pwd) return setErr("Enter both email and password.");
    if (!/^\S+@\S+\.\S+$/.test(email)) return setErr("Enter a valid email address.");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    signIn(email);
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout title="Login" subtitle="Welcome back! Please login to continue">
      <form onSubmit={submit} className="space-y-4">
        <Field label="Email Address"><Input type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password"><Input type="password" placeholder="••••••••" value={pwd} onChange={(e) => setPwd(e.target.value)} /></Field>
        <div className="flex justify-end">
          <Link to="/forgot-password" className="text-xs text-muted-foreground hover:text-foreground">Forgot Password?</Link>
        </div>
        {err && <div className="text-xs text-destructive">{err}</div>}
        <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Login"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Don't have an account? <Link to="/signup" className="text-foreground font-medium">Sign up</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}