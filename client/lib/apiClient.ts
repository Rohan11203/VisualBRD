import useAuthStore from "@/store/authStore";

export const apiClient = async (url: string, options: RequestInit = {}) => {
  const response = await fetch(`http://localhost:3000/api/v1${url}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (response.status === 401) {
    console.log("API client received a 401 Unauthorized. Logging out.");

    // Get the logout function from your Zustand store
    const { logout } = useAuthStore.getState();
    logout();

    window.location.href = "/login";

    throw new Error("Session expired or invalid.");
  }

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Something went wrong");
  }

  return response.json();
};
