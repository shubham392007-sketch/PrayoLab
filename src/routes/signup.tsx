import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AuthLayout } from "@/components/prayolab/auth-layout";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth-store";
import { Loader2 } from "lucide-react";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

export const Route = createFileRoute("/signup")({ component: SignupPage });

const universities = ["MIT University", "IIT Bombay", "Stanford University", "Cambridge", "Other"];
const branches = ["Computer Science", "Electronics", "Mechanical", "Civil", "Electrical", "Aerospace"];
const semesters = ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"].map((s) => `${s} Semester`);

function SignupPage() {
  const navigate = useNavigate();
  const signUp = useAuth((s) => s.signUp);
  const [f, setF] = useState({ fullName: "", email: "", university: "", branch: "", semester: "", password: "" });
  const [agree, setAgree] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = <K extends keyof typeof f>(k: K, v: string) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    if (!f.fullName.trim()) return setErr("Enter your full name.");
    if (!/^\S+@\S+\.\S+$/.test(f.email)) return setErr("Enter a valid email.");
    if (!f.university || !f.branch || !f.semester) return setErr("Select your university, branch and semester.");
    if (f.password.length < 6) return setErr("Password must be at least 6 characters.");
    if (!agree) return setErr("Please accept the terms to continue.");
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    signUp({ fullName: f.fullName, email: f.email, university: f.university, branch: f.branch, semester: f.semester });
    navigate({ to: "/dashboard" });
  };

  return (
    <AuthLayout title="Create Account" subtitle="Join PrayoLab and start your journey">
      <form onSubmit={submit} className="space-y-3.5">
        <Field label="Full Name"><Input value={f.fullName} onChange={(e) => set("fullName", e.target.value)} placeholder="John Doe" /></Field>
        <Field label="Email Address"><Input type="email" value={f.email} onChange={(e) => set("email", e.target.value)} placeholder="you@example.com" /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="University">
            <Select value={f.university} onValueChange={(v) => set("university", v)}>
              <SelectTrigger><SelectValue placeholder="Select University" /></SelectTrigger>
              <SelectContent>{universities.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
          <Field label="Branch">
            <Select value={f.branch} onValueChange={(v) => set("branch", v)}>
              <SelectTrigger><SelectValue placeholder="Select Branch" /></SelectTrigger>
              <SelectContent>{branches.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
            </Select>
          </Field>
        </div>
        <Field label="Semester">
          <Select value={f.semester} onValueChange={(v) => set("semester", v)}>
            <SelectTrigger><SelectValue placeholder="Select Semester" /></SelectTrigger>
            <SelectContent>{semesters.map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
          </Select>
        </Field>
        <Field label="Password"><Input type="password" value={f.password} onChange={(e) => set("password", e.target.value)} placeholder="••••••••" /></Field>
        <label className="flex items-center gap-2 text-xs text-muted-foreground">
          <Checkbox checked={agree} onCheckedChange={(c) => setAgree(Boolean(c))} />
          I agree to the Terms & Conditions
        </label>
        {err && <div className="text-xs text-destructive">{err}</div>}
        <Button type="submit" disabled={loading} className="w-full h-11 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 font-medium">
          {loading ? <Loader2 className="size-4 animate-spin" /> : "Create Account"}
        </Button>
        <p className="text-center text-xs text-muted-foreground">
          Already have an account? <Link to="/login" className="text-foreground font-medium">Login</Link>
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