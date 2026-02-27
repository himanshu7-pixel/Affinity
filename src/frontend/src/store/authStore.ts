import { create } from "zustand";

interface AuthState {
  email: string;
  setEmail: (email: string) => void;
  isRegistered: boolean;
  setIsRegistered: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  email: "",
  setEmail: (email) => set({ email }),
  isRegistered: false,
  setIsRegistered: (v) => set({ isRegistered: v }),
}));
