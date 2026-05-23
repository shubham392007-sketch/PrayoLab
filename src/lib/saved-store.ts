import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type SavedReport = {
  id: string;
  title: string;
  kind: "Matrix" | "Fourier" | "Differential" | "Jacobian" | "Integral" | "Theory" | "Other";
  summary?: string;
  createdAt: string;
};

export type Activity = {
  id: string;
  title: string;
  kind: SavedReport["kind"];
  at: string;
};

type State = {
  reports: SavedReport[];
  activity: Activity[];
  favorites: string[];
  addReport: (r: Omit<SavedReport, "id" | "createdAt">) => void;
  removeReport: (id: string) => void;
  logActivity: (a: Omit<Activity, "id" | "at">) => void;
  toggleFavorite: (topic: string) => void;
  clear: () => void;
};

const seedReports: SavedReport[] = [
  { id: "s1", kind: "Matrix", title: "Matrix Determinant Report", summary: "3×3 determinant via cofactor expansion", createdAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: "s2", kind: "Fourier", title: "Fourier Series Analysis", summary: "Square wave, n=10 harmonics", createdAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: "s3", kind: "Integral", title: "Double Integral Solution", summary: "∫∫ x·y dA over [0,1]²", createdAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: "s4", kind: "Differential", title: "Differential Equation Report", summary: "y'' + 3y' + 2y = 0", createdAt: new Date(Date.now() - 86400000 * 9).toISOString() },
  { id: "s5", kind: "Jacobian", title: "Jacobian Transformation", summary: "Cartesian → Polar", createdAt: new Date(Date.now() - 86400000 * 12).toISOString() },
];

const seedActivity: Activity[] = [
  { id: "a1", kind: "Matrix", title: "Solved Cramer's Rule Problem", at: new Date(Date.now() - 3600000 * 2).toISOString() },
  { id: "a2", kind: "Fourier", title: "Generated Fourier Series Report", at: new Date(Date.now() - 3600000 * 5).toISOString() },
  { id: "a3", kind: "Theory", title: "Read Taylor Series Expansion", at: new Date(Date.now() - 86400000).toISOString() },
  { id: "a4", kind: "Differential", title: "Solved Differential Equation", at: new Date(Date.now() - 86400000 * 2).toISOString() },
];

export const useSaved = create<State>()(
  persist(
    (set) => ({
      reports: seedReports,
      activity: seedActivity,
      favorites: ["Linear Algebra", "Calculus", "Differential Equations", "Fourier Series", "Vector Calculus"],
      addReport: (r) =>
        set((s) => ({
          reports: [{ ...r, id: crypto.randomUUID(), createdAt: new Date().toISOString() }, ...s.reports],
        })),
      removeReport: (id) => set((s) => ({ reports: s.reports.filter((r) => r.id !== id) })),
      logActivity: (a) =>
        set((s) => ({
          activity: [{ ...a, id: crypto.randomUUID(), at: new Date().toISOString() }, ...s.activity].slice(0, 50),
        })),
      toggleFavorite: (t) =>
        set((s) => ({
          favorites: s.favorites.includes(t) ? s.favorites.filter((x) => x !== t) : [...s.favorites, t],
        })),
      clear: () => set({ reports: [], activity: [], favorites: [] }),
    }),
    {
      name: "prayolab.saved",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as never))),
    },
  ),
);