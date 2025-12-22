import { create } from "zustand";

interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  username?: string;
  phone?: string;
  avatar_url?: string;
  street_address?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  role?: string;
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
