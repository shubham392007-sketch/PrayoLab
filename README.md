# PrayoLab

**PrayoLab** is an interactive virtual mathematics laboratory built for engineering students. It combines symbolic computation, stepwise derivations, and rich visualizations into a single premium "scientific OS" experience covering 15+ core engineering math topics.

> Solve. Derive. Visualize.

---

## Highlights

- **15+ interactive labs** — Matrices, Cramer's Rule, Equation Solver, Linear Dependence, Function Expansions, Differential Equations, Nth Derivative, Fourier Series, Harmonic Analysis, Maxima & Minima, Jacobian, Euler's Theorem, Partial Differentiation, Differentiation Under the Integral, Double Integrals.
- **Stepwise derivation engine** — every lab shows classroom-style, line-by-line working with KaTeX-rendered math.
- **Advanced graph visualizer** — 2D, 3D, contour, polar, and parametric plotting with multi-function support, derivative overlays, smart sampling, and adjustable resolution.
- **Searchable theory library** — in-depth notes, derivations, properties, and worked examples for every topic.
- **PDF export** — export any derivation or saved report as a branded PDF.
- **Dummy auth + workspace** — local profile, persistent settings, dark mode, and a complete dashboard / saved-work / reports flow.

---

## Tech Stack

| Layer | Tools |
|------|------|
| Framework | TanStack Start v1 (React 19, Vite 7) |
| Language | TypeScript (strict) |
| Styling | Tailwind CSS v4 + custom design tokens (`src/styles.css`) |
| UI | shadcn/ui + custom `prayolab/*` components |
| State | Zustand (auth, saved work, settings) |
| Math | Math.js (symbolic), custom engine (`src/lib/math-engine.ts`) |
| Rendering | KaTeX (formulas), Plotly.js (graphs) |
| Export | jsPDF |
| Notifications | Sonner |

---

## Project Structure

```
src/
├── components/
│   ├── prayolab/        # Logo, nav, workspace shell, lab shell, plot, stepwise, etc.
│   └── ui/              # shadcn primitives
├── lib/
│   ├── auth-store.ts    # Local-only dummy auth (Zustand + localStorage)
│   ├── saved-store.ts   # Saved derivations / reports
│   ├── math-engine.ts   # Symbolic math, partials, rank, KaTeX helpers
│   ├── labs-catalog.ts  # Lab registry
│   └── pdf-export.ts    # Branded PDF generation
├── routes/
│   ├── __root.tsx       # Root layout + theme bootstrap
│   ├── index.tsx        # Landing page
│   ├── labs.*.tsx       # All laboratory routes
│   ├── graph-visualizer.tsx
│   ├── theory.tsx       # Searchable theory library
│   ├── dashboard.tsx, reports.tsx, saved-work.tsx, settings.tsx, profile.tsx
│   └── about / contact / developers / how-to-use / login / signup / ...
└── styles.css           # Design tokens & global styles
```

---

## Getting Started

```bash
# Install dependencies
bun install

# Start the dev server
bun run dev

# Build for production
bun run build
```

Then visit the local URL printed in the terminal. Create a mock profile at `/signup` to enter the workspace.

---

## Key Routes

- `/` — Landing page
- `/labs` — All laboratories
- `/labs/matrices`, `/labs/jacobian`, `/labs/fourier-series`, … — Individual labs
- `/graph-visualizer` — 2D/3D/parametric plotter
- `/theory` — Searchable theory library
- `/dashboard`, `/saved-work`, `/reports`, `/settings`, `/profile`

---

## Design System

PrayoLab uses a warm off-white (`#F7F7F3`) base with a lime (`#D8F000`) accent, paired with **Inter** for UI and **JetBrains Mono** for numeric/code surfaces. All colors are defined as semantic tokens in `src/styles.css` — do not hardcode colors in components.

Dark, light, and system themes are supported and persisted in `localStorage`.

---

## Developer

**Shubham Pokale** — Lead Developer & Architect

- GitHub: [github.com/shubham392007-sketch](https://github.com/shubham392007-sketch)
- LinkedIn: [linkedin.com/in/shubham-pokale-94030b37a](https://www.linkedin.com/in/shubham-pokale-94030b37a)

---

## License

© PrayoLab. All rights reserved.