import { Link } from "@tanstack/react-router";
import logoSrc from "@/assets/prayolab-logo.png";

export function Logo({ to = "/" }: { to?: string }) {
  return (
    <Link to={to} className="flex items-center gap-2 group">
      <img src={logoSrc} alt="PrayoLab" className="size-8 object-contain" />
      <span className="font-semibold tracking-tight text-[15px]">PrayoLab</span>
    </Link>
  );
}