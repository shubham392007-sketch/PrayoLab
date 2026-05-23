import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/prayolab/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/forgot-password")({ component: Page });

function Page() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const navigate = useNavigate();

  return (
    <AuthLayout title="Forgot Password" subtitle="Enter your email address and we will send you a link to reset your password.">
      <form onSubmit={(e) => { e.preventDefault(); setSent(true); setTimeout(() => navigate({ to: "/reset-password" }), 800); }} className="space-y-4">
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Email Address</Label>
          <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
        </div>
        <Button className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
          {sent ? "Sent!" : "Send Reset Link"}
        </Button>
        <p className="text-center text-xs text-muted-foreground"><Link to="/login" className="text-foreground font-medium">Back to Login</Link></p>
      </form>
    </AuthLayout>
  );
}
*** Add File: src/routes/reset-password.tsx
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/prayolab/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/reset-password")({ component: Page });

function Page() {
  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const navigate = useNavigate();

  return (
    <AuthLayout title="Reset Password" subtitle="Create a new password for your account.">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (pwd.length < 6) return setErr("Password must be at least 6 characters.");
          if (pwd !== confirm) return setErr("Passwords do not match.");
          setErr(null);
          navigate({ to: "/login" });
        }}
        className="space-y-4"
      >
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">New Password</Label>
          <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs text-muted-foreground">Confirm Password</Label>
          <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} />
        </div>
        {err && <div className="text-xs text-destructive">{err}</div>}
        <Button className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">Reset Password</Button>
        <p className="text-center text-xs text-muted-foreground"><Link to="/login" className="text-foreground font-medium">Back to Login</Link></p>
      </form>
    </AuthLayout>
  );
}
*** Add File: src/components/prayolab/auth-layout.tsx
import { Logo } from "./logo";
import { Link } from "@tanstack/react-router";

export function AuthLayout({
  title, subtitle, children,
}: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="px-5 h-16 flex items-center border-b border-border">
        <Logo />
        <div className="ml-auto text-xs text-muted-foreground">
          <Link to="/" className="hover:text-foreground">← Back to home</Link>
        </div>
      </div>
      <div className="flex-1 grid lg:grid-cols-2">
        <div className="hidden lg:flex relative overflow-hidden bg-secondary/50 border-r border-border">
          <div className="absolute inset-0 pl-grid-bg opacity-40" />
          <div className="relative m-auto max-w-md p-10">
            <div className="pl-chip mb-5">PrayoLab</div>
            <h2 className="text-3xl font-semibold tracking-tight">A premium engineering mathematics laboratory.</h2>
            <p className="text-muted-foreground mt-3">Solve, visualize and derive — from matrices to Fourier series — all in one beautiful workspace.</p>
            <svg viewBox="0 0 320 220" className="mt-10">
              {Array.from({length:22}).map((_,i)=>(
                <path key={i} d={`M 10 ${50+i*7} Q 160 ${i*5} 310 ${50+i*7}`} fill="none" stroke="oklch(0.18 0.005 270)" strokeOpacity={0.05+i*0.025} strokeWidth="0.8"/>
              ))}
              <circle cx="220" cy="120" r="60" fill="none" stroke="oklch(0.92 0.22 122)" strokeWidth="2"/>
              <circle cx="220" cy="120" r="30" fill="oklch(0.92 0.22 122)" fillOpacity="0.3"/>
            </svg>
          </div>
        </div>
        <div className="flex items-center justify-center p-6">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
            {subtitle && <p className="text-muted-foreground text-sm mt-2">{subtitle}</p>}
            <div className="mt-7">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}