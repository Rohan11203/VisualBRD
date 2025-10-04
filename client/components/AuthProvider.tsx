"use client";

import { useEffect } from "react";
import useAuthStore from "@/store/authStore";

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { checkAuth, isInitialized } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Show a global loader until the auth check is complete
  if (!isInitialized) {
    return <div>App Loading...</div>; // Or a full-page spinner
  }

  return <>{children}</>;
}
