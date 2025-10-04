import Navigation from "@/components/Navigation";
import Login from "@/components/Login";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <Navigation />
      <section className="max-w-3xl mx-auto py-16 px-6">
        <Login />
      </section>
    </main>
  );
}