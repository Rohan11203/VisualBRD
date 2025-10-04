"use client";

import Link from "next/link";

export default function Navigation() {
  return (
    <header className="w-full border-b border-neutral-800 bg-neutral-950/50">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center justify-between">
        <Link href="/">
          <div className="text-lg font-semibold">VisualBRD</div>
        </Link>

        <nav>
          <div className="flex items-center gap-6">
            <Link
              href="/login"
              className="text-sm font-medium text-neutral-400 hover:text-white"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="text-sm font-medium text-neutral-400 hover:text-white"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}