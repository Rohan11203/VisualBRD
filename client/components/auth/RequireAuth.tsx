"use client";
import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface RequireAuthProps {
  children: React.ReactNode;
}

export const RequireAuth = ({ children }: RequireAuthProps) => {
  const router = useRouter();
  const { user } = useAuthStore();

  useEffect(() => {
    if (user === null) {
      router.push("/login");
    }
  }, [user, router]);

  // If user exists, render the children, otherwise render null or a loader
  // This prevents flashing the protected content before the redirect happens
  if (!user) {
    return <div>Loading...</div>; // Or <LoadingSpinner />
  }

  return <>{children}</>;
};
