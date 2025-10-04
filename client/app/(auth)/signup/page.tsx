import Navigation from "@/components/Navigation";
import SIgnup from "@/components/SIgnup";

export default function SignupPage() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <Navigation />
      <section className="max-w-3xl mx-auto py-16 px-6">
        <SIgnup />
      </section>
    </main>
  );
}