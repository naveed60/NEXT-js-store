"use client";

import { FormEvent, useState } from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/nextshop/admin";
  const { status, data: session } = useSession();
  const [formState, setFormState] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    const result = await signIn("credentials", {
      email: formState.email,
      password: formState.password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      toast.error("Incorrect email or password");
      return;
    }

    toast.success("Welcome back!");
    router.push(redirectTo);
    router.refresh();
  };

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut({ redirect: false });
      toast.success("Signed out");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign out right now");
    } finally {
      setSigningOut(false);
    }
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
        {status === "authenticated" && (
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 text-sm text-zinc-600">
            <p className="font-semibold text-zinc-800">Already signed in</p>
            <p>
              {session?.user?.email} is signed in. Continue with this account or
              sign out to switch.
            </p>
            <div className="mt-3 flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  router.push(redirectTo);
                  router.refresh();
                }}
              >
                Continue
              </Button>
              <Button
                variant="ghost"
                className="flex-1 border border-zinc-200 text-zinc-700 hover:border-zinc-400"
                type="button"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                {signingOut ? "Signing out..." : "Switch account"}
              </Button>
            </div>
          </div>
        )}
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
