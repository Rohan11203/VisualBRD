"use client";

import useAuthStore from "@/store/authStore";
import { useRouter } from "next/navigation";
import React, { useState } from "react";

export default function SIgnup() {
  const { registerWithCredentials, isLoading, error } = useAuthStore();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const success = await registerWithCredentials(name, email, password);
    if (success) {
      router.push("/workspace");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-neutral-900 p-6 rounded-md border border-neutral-800">
      <h2 className="text-2xl mb-4">Create account</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm text-neutral-300 mb-1">Name</label>
          <input
            className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-300 mb-1">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm text-neutral-300 mb-1">
            Password
          </label>
          <input
            type="password"
            className="w-full px-3 py-2 rounded bg-neutral-800 border border-neutral-700"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <div className="text-sm text-red-400">{error}</div>}

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-2 bg-amber-500 text-black rounded-md font-medium"
        >
          {isLoading ? "Creating..." : "Create account"}
        </button>
      </form>
    </div>
  );
}
