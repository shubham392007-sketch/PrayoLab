import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type PrayoUser = {
  fullName: string;
  email: string;
  university?: string;
  branch?: string;
  semester?: string;
  joinedAt: string;
};

type AuthState = {
  user: PrayoUser | null;
  hydrated: boolean;
  signUp: (u: Omit<PrayoUser, "joinedAt">) => void;
  signIn: (email: string) => void;
  signOut: () => void;
  update: (patch: Partial<PrayoUser>) => void;
  setHydrated: (v: boolean) => void;
};

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      hydrated: false,
      signUp: (u) =>
        set({ user: { ...u, joinedAt: new Date().toISOString() } }),
      signIn: (email) => {
        const existing = get().user;
        if (existing && existing.email === email) return;
        set({
          user: {
            fullName: email.split("@")[0].replace(/\W+/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) || "Student",
            email,
            university: "MIT University",
            branch: "Computer Science",
            semester: "4th Semester",
            joinedAt: new Date().toISOString(),
          },
        });
      },
      signOut: () => set({ user: null }),
      update: (patch) => set((s) => ({ user: s.user ? { ...s.user, ...patch } : s.user })),
      setHydrated: (v) => set({ hydrated: v }),
    }),
    {
      name: "prayolab.auth",
      storage: createJSONStorage(() => (typeof window !== "undefined" ? localStorage : (undefined as never))),
      onRehydrateStorage: () => (state) => state?.setHydrated(true),
    },
  ),
);

export const initials = (name: string) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((s) => s[0]?.toUpperCase())
    .join("");