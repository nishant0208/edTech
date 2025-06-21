import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  email: string;
  role: string;
}

interface Profile {
  id: string;
  name: string;
  address: string;
  occupation: string | null;
  phone: string;
  relationship: string | null;
  userId: string;
}

interface AuthData {
  user: User;
  profile: Profile;
  token: string;
}

interface AuthState {
  auth: AuthData | null;
  isAuthenticated: boolean;
  login: (auth: AuthData) => void;
  signup: (auth: AuthData) => void;
  logout: () => void;
  updateProfile: (data: Partial<Profile>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      auth: null,
      isAuthenticated: false,

      login: (auth) => set({ auth, isAuthenticated: true }),

      signup: (auth) => set({ auth, isAuthenticated: true }),

      logout: () => set({ auth: null, isAuthenticated: false }),

      updateProfile: (data) =>
        set((state) => ({
          auth: state.auth
            ? {
                ...state.auth,
                profile: { ...state.auth.profile, ...data },
              }
            : null,
        })),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        auth: state.auth,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
