"use client";

import { FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email: formState.email,
      password: formState.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Incorrect email or password");
      return;
    }

    router.push("/nextshop/admin");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-50 via-white to-zinc-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md space-y-6 rounded-3xl border border-zinc-100 bg-white p-8 shadow-2xl"
      >
        <div>
          <p className="text-sm text-zinc-500">Welcome back</p>
          <h1 className="text-3xl font-semibold text-zinc-900">
            Sign in to NextShop
          </h1>
        </div>
        <label className="space-y-1 text-sm font-medium text-zinc-600">
          Email
          <input
            type="email"
            required
            value={formState.email}
            onChange={(event) =>
              setFormState((prev) => ({ ...prev, email: event.target.value }))
            }
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500"
          />
        </label>
        <label className="space-y-1 text-sm font-medium text-zinc-600">
          Password
          <input
            type="password"
            required
            value={formState.password}
            onChange={(event) =>
              setFormState((prev) => ({
                ...prev,
                password: event.target.value,
              }))
            }
            className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-base text-zinc-900 outline-none transition focus:border-zinc-500"
          />
        </label>
        {error && (
          <p className="text-sm font-semibold text-red-500">{error}</p>
        )}
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Sign in"}
        </Button>
        <p className="text-sm text-zinc-600">
          New to NextShop?{" "}
          <Link
            href="/register"
            className="font-semibold text-[oklch(0.58_0.15_256.18)] hover:underline"
          >
            Create an account
          </Link>
        </p>
      </form>
    </div>
  );
}
