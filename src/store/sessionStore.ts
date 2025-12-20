import { create } from "zustand";

interface User {
  id: string;
  email: string;
  name?: string; // Optional since backend model has UserName and FullName
  fullName?: string;
  role?: string;
  avatarUrl?: string;
}

interface SessionState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  clearUser: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  clearUser: () => set({ user: null, isAuthenticated: false }),
}));
