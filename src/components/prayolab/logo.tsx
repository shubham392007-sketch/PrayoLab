import { Link } from "@tanstack/react-router";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <span className="grid place-items-center size-7 rounded-md bg-foreground text-background">
        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2.2">
          <path d="M4 20L12 4l8 16" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7.5 14h9" strokeLinecap="round" />
        </svg>
      </span>
      <span className="font-semibold tracking-tight text-[15px]">PrayoLab</span>
    </Link>
  );
}