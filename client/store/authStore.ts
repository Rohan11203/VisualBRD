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
  loginWithCredentials: (email: string, password: string) => Promise<boolean>;
  registerWithCredentials: (
    name: string,
    email: string,
    password: string
  ) => Promise<boolean>;
  logout: () => void;
  isInitialized: boolean; // To track if the initial auth check is done
  checkAuth: () => Promise<void>;
}
const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isInitialized: false,
      isLoading: false,
      error: null,

      // Actions
      loginWithCredentials: async (email, password) => {
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

      registerWithCredentials: async (name, email, password) => {
        set({ isLoading: true, error: null });
        try {
          const res = await fetch(
            "http://localhost:3000/api/v1/users/register",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              credentials: "include",
              body: JSON.stringify({ name, email, password }),
            }
          );

          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Signup failed");
          }

          set({ user: data, isLoading: false });
          return true; // Success
        } catch (err) {
          const errorMessage =
            err instanceof Error ? err.message : "An unknown error occurred.";
          set({ error: errorMessage, isLoading: false, user: null });
          return false; // Failure
        }
      },

      logout: async () => {
        try {
          await fetch("http://localhost:3000/api/v1/users/logout", {
            method: "POST",
            credentials: "include",
          });
        } catch (error) {
          console.error("Failed to logout from server", error);
        }
        set({ user: null });
      },

      checkAuth: async () => {
        // Prevent re-checking if it's already done
        if (get().isInitialized) return;

        try {
          const response = await fetch(
            "http://localhost:3000/api/v1/users/profile",
            {
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Not authenticated");
          }

          const user = await response.json();
          set({ user, isInitialized: true });
        } catch (error) {
          set({ user: null, isInitialized: true });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);

export default useAuthStore;
