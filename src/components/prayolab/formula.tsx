import { BlockMath, InlineMath } from "react-katex";

export function F({ children, block = false }: { children: string; block?: boolean }) {
  return block ? <BlockMath math={children} /> : <InlineMath math={children} />;
}