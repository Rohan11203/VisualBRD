import { RequireAuth } from "@/components/auth/RequireAuth";

export default function ProtectedPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RequireAuth>{children}</RequireAuth>;
}