import Navigation from "@/components/Navigation";
import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen bg-neutral-900 text-white">
      <Navigation />
      <section className="flex flex-col items-center justify-center py-28 px-4">
        <h1 className="text-4xl font-semibold mb-6">VisualBRD</h1>
        <p className="max-w-xl text-center text-neutral-300 mb-8">
          Simple visual annotation workflow. Sign up or log in to continue.
        </p>

        <div className="flex gap-4">
          <Link href="/signup">
            <div className="px-6 py-3 bg-amber-500 text-black rounded-md font-medium">
              Get Started
            </div>
          </Link>
          <Link href="/login">
            <div className="px-6 py-3 border border-neutral-600 rounded-md text-neutral-200">
              Login
            </div>
          </Link>
        </div>
      </section>
    </main>
  );
}