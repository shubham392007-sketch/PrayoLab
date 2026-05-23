import { Input } from "@/components/ui/input";

export function MatrixGrid({
  rows, cols, values, onChange, readOnly,
}: {
  rows: number; cols: number;
  values: number[][];
  onChange?: (r: number, c: number, v: number) => void;
  readOnly?: boolean;
}) {
  return (
    <div className="relative inline-block">
      <span className="absolute -left-2 top-0 bottom-0 w-1 border-y-2 border-l-2 border-foreground rounded-l-sm" />
      <span className="absolute -right-2 top-0 bottom-0 w-1 border-y-2 border-r-2 border-foreground rounded-r-sm" />
      <div
        className="grid gap-1.5 px-2 py-1"
        style={{ gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))` }}
      >
        {Array.from({ length: rows }).map((_, r) =>
          Array.from({ length: cols }).map((_, c) => (
            <Input
              key={`${r}-${c}`}
              readOnly={readOnly}
              value={Number.isFinite(values?.[r]?.[c]) ? values[r][c] : 0}
              onChange={(e) => {
                const v = parseFloat(e.target.value);
                onChange?.(r, c, Number.isFinite(v) ? v : 0);
              }}
              className="pl-mono h-10 w-14 text-center bg-secondary/60 border-transparent focus-visible:bg-card"
            />
          )),
        )}
      </div>
    </div>
  );
}