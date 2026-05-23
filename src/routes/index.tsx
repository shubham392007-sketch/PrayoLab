import { createFileRoute, Link } from "@tanstack/react-router";
import { MarketingNav } from "@/components/prayolab/marketing-nav";
import { Footer } from "@/components/prayolab/footer";
import { Button } from "@/components/ui/button";
import {
  ArrowRight, Sparkles, FlaskConical, LineChart, BookOpen, Layers,
  CheckCircle2, GitBranch, FileDown, Save,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "PrayoLab — Experiment with Mathematics Visually" },
      { name: "description", content: "Interactive virtual mathematics laboratory for engineering students. Solve, derive, and visualize." },
      { property: "og:title", content: "PrayoLab" },
      { property: "og:description", content: "Experiment with mathematics visually." },
    ],
  }),
  component: Landing,
});

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <MarketingNav />
      <Hero />
      <Strip />
      <Labs />
      <Theory />
      <Stepwise />
      <Practice />
      <Developers />
      <Footer />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 pl-grid-bg opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative mx-auto max-w-7xl px-5 pt-16 pb-12 grid lg:grid-cols-2 gap-10 items-center">
        <div>
          <span className="pl-chip"><Sparkles className="size-3" /> Interactive Mathematics Laboratory</span>
          <h1 className="mt-5 text-5xl md:text-6xl font-semibold tracking-[-0.03em] leading-[1.02]">
            Experiment With <span className="bg-primary px-2 rounded-md">Mathematics</span> Visually.
          </h1>
          <p className="mt-5 text-muted-foreground text-lg max-w-lg">
            An interactive virtual mathematics laboratory for engineering students — solve, derive step-by-step, and visualize like never before.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <Button asChild size="lg" className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90 h-12 px-6">
              <Link to="/signup">Start Experimenting <ArrowRight className="size-4 ml-1" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full h-12 px-6">
              <Link to="/theory">Explore Theory</Link>
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-4 gap-6 max-w-md">
            {[["50+", "Virtual Labs"], ["1000+", "Topics Covered"], ["10K+", "Practice Problems"], ["25K+", "Happy Students"]].map(([n, l]) => (
              <div key={l}>
                <div className="text-2xl font-semibold tracking-tight">{n}</div>
                <div className="text-xs text-muted-foreground mt-1">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div className="relative">
      <div className="pl-card pl-soft-shadow p-5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm font-semibold">Matrix Laboratory</div>
            <div className="text-xs text-muted-foreground">Solve matrix operations, determinants, inverses and more.</div>
          </div>
          <div className="flex gap-1">
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="size-2 rounded-full bg-muted-foreground/30" />
            <span className="size-2 rounded-full bg-primary" />
          </div>
        </div>
        <div className="mt-4 grid md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-secondary p-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Matrix A</div>
            <div className="grid grid-cols-3 gap-1 pl-mono text-sm">
              {[2,4,6,1,3,5,7,8,9].map((n,i) => (
                <div key={i} className="aspect-square grid place-items-center bg-card rounded">{n}</div>
              ))}
            </div>
          </div>
          <div className="rounded-xl bg-foreground text-background p-3 relative overflow-hidden">
            <div className="text-[10px] uppercase tracking-wider opacity-60">3D Surface</div>
            <svg viewBox="0 0 200 120" className="w-full h-28 mt-1">
              {Array.from({length:18}).map((_,i)=>(
                <path key={i} d={`M 10 ${30+i*4} Q 100 ${10+Math.sin(i/2)*30} 190 ${30+i*4}`} fill="none" stroke="hsl(74 100% 50%)" strokeOpacity={0.4+i*0.02} strokeWidth="0.8"/>
              ))}
            </svg>
          </div>
        </div>
        <div className="mt-4 rounded-xl bg-secondary p-3">
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Waveform</div>
          <svg viewBox="0 0 320 80" className="w-full h-20">
            <path d="M 0 40 Q 40 0 80 40 T 160 40 T 240 40 T 320 40" fill="none" stroke="oklch(0.5 0.2 250)" strokeWidth="1.5"/>
            <path d="M 0 40 Q 40 80 80 40 T 160 40 T 240 40 T 320 40" fill="none" stroke="oklch(0.6 0.2 20)" strokeWidth="1.5"/>
          </svg>
        </div>
      </div>
    </div>
  );
}

function Strip() {
  const items = [
    { icon: GitBranch, t: "Stepwise Solutions", s: "Understand every step" },
    { icon: LineChart, t: "Interactive Graphs", s: "Visualize concepts" },
    { icon: BookOpen, t: "Formula Library", s: "All formulas at one place" },
    { icon: FileDown, t: "Export Reports", s: "Download & share" },
    { icon: Save, t: "Save & Continue", s: "Your work, anytime" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-8">
      <div className="pl-card pl-soft-shadow p-4 grid grid-cols-2 md:grid-cols-5 gap-2">
        {items.map(({ icon: Icon, t, s }) => (
          <div key={t} className="flex items-center gap-3 p-3">
            <span className="size-9 rounded-lg bg-primary/20 grid place-items-center"><Icon className="size-4" /></span>
            <div>
              <div className="text-sm font-medium">{t}</div>
              <div className="text-xs text-muted-foreground">{s}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Labs() {
  const labs = [
    { t: "Matrix Laboratory", d: "Determinants, inverse, eigenvalues, Cramer's rule.", to: "/labs/matrices" },
    { t: "Fourier Series Lab", d: "Coefficient computation, harmonic visualization.", to: "/labs/fourier-series" },
    { t: "Differential Equations", d: "Higher-order ODE solver with stepwise method.", to: "/labs/differential-equations" },
    { t: "Double Integrals", d: "Cartesian, polar, animated integration regions.", to: "/labs/double-integrals" },
    { t: "Jacobian Lab", d: "Coordinate transformations and visualization.", to: "/labs/jacobian" },
    { t: "Maxima & Minima", d: "Critical points, Hessian, contour plots.", to: "/labs/maxima-minima" },
  ];
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionHeader eyebrow="Featured Laboratories" title="A complete virtual engineering math studio." />
      <div className="mt-8 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {labs.map((l) => (
          <Link key={l.t} to={l.to} className="pl-card pl-soft-shadow p-5 hover:border-foreground/20 transition group">
            <FlaskConical className="size-5 text-muted-foreground group-hover:text-foreground" />
            <div className="mt-4 font-medium">{l.t}</div>
            <div className="text-sm text-muted-foreground mt-1">{l.d}</div>
            <div className="mt-4 text-xs flex items-center gap-1 text-foreground">Open lab <ArrowRight className="size-3" /></div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function Theory() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 grid lg:grid-cols-2 gap-10 items-center">
      <div>
        <SectionHeader eyebrow="Theory System" title="A documentation-style mathematics library." />
        <p className="text-muted-foreground mt-3 max-w-md">
          Hundreds of theorems, derivations and worked examples — beautifully typeset with KaTeX and searchable across topics.
        </p>
        <ul className="mt-5 space-y-2 text-sm">
          {["Linear Algebra · Matrices · Eigenvalues", "Calculus · Series · Partial differentiation", "Differential Equations · Fourier · Vector Calculus"].map((t) => (
            <li key={t} className="flex items-center gap-2"><CheckCircle2 className="size-4 text-primary-foreground bg-primary rounded-full p-0.5" /> {t}</li>
          ))}
        </ul>
        <Button asChild className="mt-6 rounded-full bg-foreground text-background hover:bg-foreground/90"><Link to="/theory">Open Theory Library</Link></Button>
      </div>
      <div className="pl-card pl-soft-shadow p-5">
        <div className="text-xs text-muted-foreground">Linear Algebra · Cramer's Rule</div>
        <h3 className="text-xl font-semibold mt-1">Cramer's Rule</h3>
        <p className="text-sm text-muted-foreground mt-2">
          Used to solve a system of linear equations when the determinant of the coefficient matrix is non-zero.
        </p>
        <div className="mt-4 pl-mono text-sm bg-secondary rounded-lg p-3">
          x_i = det(A_i) / det(A)
        </div>
      </div>
    </section>
  );
}

function Stepwise() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <SectionHeader eyebrow="Stepwise Engine" title="Watch the math derive itself." />
      <div className="mt-8 pl-card pl-soft-shadow p-6 grid lg:grid-cols-3 gap-4">
        {["Given Matrix A", "Apply determinant formula", "Final Calculation"].map((t, i) => (
          <div key={t} className="rounded-xl bg-secondary p-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><span className="size-5 grid place-items-center rounded-full bg-primary text-primary-foreground font-semibold">{i+1}</span> Step {i+1}</div>
            <div className="mt-3 font-medium text-sm">{t}</div>
            <div className="mt-3 pl-mono text-xs text-muted-foreground">det(A) = a(ei − fh) − b(di − fg) + c(dh − eg)</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function Practice() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16">
      <div className="pl-card pl-soft-shadow p-8 bg-foreground text-background relative overflow-hidden rounded-2xl">
        <div className="absolute inset-0 pl-grid-bg opacity-10" />
        <div className="relative grid md:grid-cols-2 gap-8 items-center">
          <div>
            <div className="pl-chip bg-white/10 border-white/10 text-white/70">Practice Arena</div>
            <h2 className="text-3xl md:text-4xl font-semibold mt-4 tracking-tight">Sharpen your skills with curated problems.</h2>
            <p className="text-white/70 mt-3 max-w-md">Filter by topic and difficulty. Track progress. Get scored on accuracy and time — like a real engineering examination.</p>
            <Button asChild className="mt-6 rounded-full bg-primary text-primary-foreground hover:bg-primary/90"><Link to="/practice">Enter Arena</Link></Button>
          </div>
          <div className="rounded-xl bg-white/5 backdrop-blur p-4 border border-white/10">
            <div className="text-xs uppercase tracking-wider text-white/60">Today's progress</div>
            <div className="mt-2 grid grid-cols-10 gap-1">
              {Array.from({length:30}).map((_,i)=>(
                <span key={i} className={`h-6 rounded ${i<18 ? "bg-primary" : "bg-white/10"}`} />
              ))}
            </div>
            <div className="mt-4 text-2xl font-semibold">18 / 30 <span className="text-sm text-white/60 font-normal">solved</span></div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Developers() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-16 grid lg:grid-cols-2 gap-10 items-center">
      <div className="pl-card pl-soft-shadow p-6 pl-mono text-sm bg-foreground text-background overflow-hidden">
        <div className="text-white/40 text-xs mb-3">// engine.ts</div>
        <pre className="text-[13px] leading-6 whitespace-pre-wrap">
{`import { derivative, simplify } from "mathjs";

export const dy = (expr: string, x = "x") =>
  simplify(derivative(expr, x)).toString();

dy("x^3 + 2x^2 + x"); // 3x^2 + 4x + 1`}
        </pre>
      </div>
      <div>
        <SectionHeader eyebrow="Built for Mathematicians" title="Engineered for excellence." />
        <p className="text-muted-foreground mt-3 max-w-md">
          PrayoLab is built with a passion for mathematics and a commitment to clean engineering — TypeScript, Math.js, KaTeX, Plotly and TanStack throughout.
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          {["TanStack", "TypeScript", "Math.js", "KaTeX", "Plotly", "Tailwind"].map((t) => (
            <span key={t} className="pl-chip"><Layers className="size-3" /> {t}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function SectionHeader({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-2xl">
      <div className="pl-chip">{eyebrow}</div>
      <h2 className="mt-4 text-3xl md:text-4xl font-semibold tracking-tight">{title}</h2>
    </div>
  );
}
