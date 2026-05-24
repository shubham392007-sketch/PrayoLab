import jsPDF from "jspdf";
import type { SavedReport } from "./saved-store";

/** Strip TeX commands to a plain-text fallback. */
function texToPlain(s: string): string {
  return s
    .replace(/\\begin\{bmatrix\}|\\end\{bmatrix\}/g, "")
    .replace(/\\\\/g, " | ")
    .replace(/&/g, "  ")
    .replace(/\\frac\{([^}]*)\}\{([^}]*)\}/g, "($1)/($2)")
    .replace(/\\det/g, "det")
    .replace(/\\sum/g, "sum")
    .replace(/\\left|\\right/g, "")
    .replace(/\\cdot/g, "·")
    .replace(/\\pi/g, "pi")
    .replace(/\\text\{([^}]*)\}/g, "$1")
    .replace(/\\[a-zA-Z]+/g, "")
    .replace(/[{}]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export type PdfStep = { title: string; tex?: string; note?: string };

export function exportDerivationPDF(opts: {
  title: string;
  subtitle?: string;
  steps: PdfStep[];
  result?: string;
}) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const H = doc.internal.pageSize.getHeight();
  const margin = 48;
  let y = margin;

  const writeWrap = (text: string, size = 10, bold = false, color: [number, number, number] = [20, 20, 20]) => {
    doc.setFont("helvetica", bold ? "bold" : "normal");
    doc.setFontSize(size);
    doc.setTextColor(...color);
    const lines = doc.splitTextToSize(text, W - margin * 2);
    for (const line of lines) {
      if (y > H - margin) { doc.addPage(); y = margin; }
      doc.text(line, margin, y);
      y += size * 1.35;
    }
  };

  // Header
  doc.setFillColor(17, 17, 17);
  doc.rect(0, 0, W, 64, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("PRAYOLAB", margin, 30);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text("Engineering Mathematics · Derivation Report", margin, 48);
  y = 96;

  writeWrap(opts.title, 18, true);
  if (opts.subtitle) writeWrap(opts.subtitle, 10, false, [110, 110, 110]);
  y += 6;
  writeWrap(`Generated: ${new Date().toLocaleString()}`, 9, false, [130, 130, 130]);
  y += 12;

  doc.setDrawColor(220, 220, 220);
  doc.line(margin, y, W - margin, y);
  y += 18;

  writeWrap("Stepwise Solution", 13, true);
  y += 6;

  opts.steps.forEach((s, i) => {
    writeWrap(`Step ${i + 1}. ${s.title}`, 11, true, [17, 17, 17]);
    if (s.tex) writeWrap(texToPlain(s.tex), 10, false, [40, 40, 40]);
    if (s.note) writeWrap(s.note, 9, false, [110, 110, 110]);
    y += 6;
  });

  if (opts.result) {
    y += 8;
    if (y > H - margin - 60) { doc.addPage(); y = margin; }
    doc.setFillColor(245, 250, 220);
    doc.setDrawColor(216, 240, 0);
    doc.roundedRect(margin, y, W - margin * 2, 56, 6, 6, "FD");
    doc.setTextColor(80, 80, 80);
    doc.setFontSize(9);
    doc.text("Final Result", margin + 12, y + 18);
    doc.setTextColor(17, 17, 17);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    const lines = doc.splitTextToSize(texToPlain(opts.result), W - margin * 2 - 24);
    doc.text(lines.slice(0, 2), margin + 12, y + 38);
    y += 72;
  }

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let p = 1; p <= pageCount; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(`PrayoLab · Page ${p} of ${pageCount}`, margin, H - 20);
  }

  const safe = opts.title.replace(/[^a-z0-9-_]+/gi, "_");
  doc.save(`${safe || "prayolab-report"}.pdf`);
}

export function exportReportPDF(report: SavedReport) {
  exportDerivationPDF({
    title: report.title,
    subtitle: `${report.kind} · ${new Date(report.createdAt).toLocaleDateString()}`,
    steps: [
      { title: "Overview", note: report.summary || "Saved derivation from your PrayoLab workspace." },
      { title: "Kind", tex: report.kind },
      { title: "Saved on", tex: new Date(report.createdAt).toLocaleString() },
    ],
    result: report.summary,
  });
}