import { error } from "console";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: IUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}
const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isLoading: false,
      error: null,

      // Actions
      login: async (email, password) => {
        set({ isLoading: true, error: null });

        try {
          console.log(email, password);

          console.log("Inside the authStore");
          const res = await fetch("http://localhost:3000/api/v1/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ email, password }),
          });

          const data = await res.json();

          console.log("Response Data", data);

          if (!res.ok) {
            throw new Error(data.message || "Login failed. Please try again");
          }

          set({
            user: data,
            isLoading: false,
          });

          return true; // Retuen true on success
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred.";
          set({
            error: errorMessage,
            isLoading: false,
            user: null,
          });
          return false; // Return false on failure
        }
      },
      logout: () => set({ user: null }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
