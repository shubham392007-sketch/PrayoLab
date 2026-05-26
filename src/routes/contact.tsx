import { createFileRoute } from "@tanstack/react-router";
import { MarketingNav } from "@/components/prayolab/marketing-nav";
import { Footer } from "@/components/prayolab/footer";

export const Route = createFileRoute("/contact")({
  head: () => ({ meta: [{ title: "Contact — PrayoLab" }, { name: "description", content: "Contact · PrayoLab interactive engineering mathematics laboratory." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="pl-chip mb-5">Contact</div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Contact</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">Have feedback, collaboration ideas, or just want to say hi? Reach out through any of the channels below.</p>

        <div className="grid sm:grid-cols-2 gap-4 mt-10">
          <a href="https://github.com/shubham392007-sketch" target="_blank" rel="noreferrer" className="pl-card pl-soft-shadow p-6 block hover:border-foreground/30 transition-colors">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">GitHub</div>
            <div className="text-lg font-semibold mt-1 break-all">github.com/shubham392007-sketch</div>
            <div className="text-sm text-muted-foreground mt-2">Source code, issues, and contributions.</div>
          </a>
          <a href="https://www.linkedin.com/in/shubham-pokale-94030b37a" target="_blank" rel="noreferrer" className="pl-card pl-soft-shadow p-6 block hover:border-foreground/30 transition-colors">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">LinkedIn</div>
            <div className="text-lg font-semibold mt-1 break-all">linkedin.com/in/shubham-pokale-94030b37a</div>
            <div className="text-sm text-muted-foreground mt-2">Connect professionally with the developer.</div>
          </a>
        </div>
      </section>
      <Footer />
    </div>
  );
}
