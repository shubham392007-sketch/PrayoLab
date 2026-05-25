import { createFileRoute } from "@tanstack/react-router";
import { ComputedLab } from "@/components/prayolab/computed-lab";
import { nthDerivative, tex } from "@/lib/math-engine";

export const Route = createFileRoute("/labs/nth-derivative")({ component: Page });

function Page() {
  return (
    <ComputedLab
      title="Nth Derivative"
      subtitle="Repeated symbolic differentiation with stepwise derivation."
      fields={[
        { name: "expr", label: "f(x)", placeholder: "e.g. sin(x) * x^2", defaultValue: "sin(x)*x^2" },
        { name: "var", label: "Variable", defaultValue: "x" },
        { name: "n", label: "Order n", defaultValue: "3" },
      ]}
      compute={({ expr, var: v, n }) => {
        const order = Math.max(1, Math.min(8, parseInt(n || "1", 10)));
        const { steps, result } = nthDerivative(expr, v || "x", order);
        return {
          steps: [
            { title: "Given function", tex: `f(${v}) = ${tex(expr)}` },
            { title: "Strategy", note: "Apply d/d" + (v || "x") + " repeatedly, simplifying after each pass. Use the product, quotient and chain rules where applicable." },
            ...steps.flatMap((s, i) => [
              { title: `Differentiation pass ${i + 1}`, tex: s.tex },
              { title: `Simplified result after pass ${i + 1}`, tex: `f^{(${i + 1})}(${v}) = ${tex(s.expr)}` },
            ]),
          ],
          result: `f^{(${order})}(${v}) = ${tex(result)}`,
        };
      }}
    />
  );
}