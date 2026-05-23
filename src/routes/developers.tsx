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
        <p className="text-muted-foreground mt-4 max-w-2xl">PrayoLab is an interactive virtual mathematics laboratory designed to help engineering students learn, visualize, and master mathematics with confidence.</p>
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
