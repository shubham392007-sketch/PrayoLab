import { lazy, Suspense } from "react";
const Plot = lazy(() => import("react-plotly.js"));

export function Plotly(props: React.ComponentProps<typeof Plot>) {
  return (
    <Suspense fallback={<div className="h-full w-full grid place-items-center text-xs text-muted-foreground">Rendering…</div>}>
      <Plot {...props} />
    </Suspense>
  );
}