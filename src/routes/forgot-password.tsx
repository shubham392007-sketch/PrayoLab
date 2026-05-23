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
