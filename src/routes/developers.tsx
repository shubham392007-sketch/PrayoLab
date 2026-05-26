import { createFileRoute } from "@tanstack/react-router";
import { MarketingNav } from "@/components/prayolab/marketing-nav";
import { Footer } from "@/components/prayolab/footer";

export const Route = createFileRoute("/developers")({
  head: () => ({ meta: [{ title: "Developers — PrayoLab" }, { name: "description", content: "Developers · PrayoLab interactive engineering mathematics laboratory." }] }),
  component: Page,
});

function Page() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <section className="mx-auto max-w-5xl px-5 py-20">
        <div className="pl-chip mb-5">Developers</div>
        <h1 className="text-4xl md:text-5xl font-semibold tracking-tight">Developers</h1>
        <p className="text-muted-foreground mt-4 max-w-2xl">PrayoLab is built and maintained by a passionate engineer focused on making mathematics intuitive, visual, and interactive for every learner.</p>

        <div className="mt-12 pl-card pl-soft-shadow p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <div className="size-20 rounded-full bg-primary/15 grid place-items-center text-2xl font-semibold text-foreground">SP</div>
          <div className="flex-1">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Lead Developer</div>
            <h2 className="text-2xl font-semibold tracking-tight mt-1">Shubham Pokale</h2>
            <p className="text-sm text-muted-foreground mt-2 max-w-xl">Full-stack engineer and the architect behind PrayoLab — designing the math engine, lab system, and the entire scientific workspace experience.</p>
            <div className="flex flex-wrap gap-3 mt-4 text-sm">
              <a href="https://github.com/shubham392007-sketch" target="_blank" rel="noreferrer" className="pl-chip hover:text-foreground">GitHub</a>
              <a href="https://www.linkedin.com/in/shubham-pokale-94030b37a" target="_blank" rel="noreferrer" className="pl-chip hover:text-foreground">LinkedIn</a>
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mt-10">
          {["50+ Virtual Labs","1000+ Topics","99.9% Accuracy"].map((s)=>(
            <div key={s} className="pl-card pl-soft-shadow p-6"><div className="text-2xl font-semibold">{s.split(" ")[0]}</div><div className="text-sm text-muted-foreground">{s.split(" ").slice(1).join(" ")}</div></div>
          ))}
        </div>
      </section>
      <Footer />
    </div>
  );
}
