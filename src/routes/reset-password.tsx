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
