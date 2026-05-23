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