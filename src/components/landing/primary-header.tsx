"use client";

import Link from "next/link";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/cart-provider";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type HeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const navLinks = ["Collections", "Essentials", "Stories"];
const sidebarCategories = [
  "New in studio",
  "Outdoor edits",
  "Daily carry",
  "Wellness",
  "Workspace",
];

export function PrimaryHeader({ searchTerm, onSearchChange }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { items, toggleCart } = useCart();
  const { status, data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut({ redirect: false });
      toast.success("Signed out");
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("Unable to sign out");
    } finally {
      setSigningOut(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center gap-4 border border-transparent bg-white/90 px-4 py-4 shadow-lg transition sm:rounded-3xl sm:border-zinc-100">
          <button
            type="button"
            className="rounded-2xl border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-400"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link href="/nextshop" className="font-semibold tracking-tight text-zinc-900">
            next<span className="text-[oklch(0.58_0.15_256.18)]">shop</span>
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm text-zinc-400 sm:flex">
            {navLinks.map((link) => (
              <button
                type="button"
                key={link}
                className="transition hover:text-zinc-700"
              >
                {link}
              </button>
            ))}
          </nav>
          <div className="relative hidden flex-1 items-center rounded-full border border-zinc-200 bg-white px-4 py-2 text-sm shadow-inner sm:flex">
            <Search className="mr-3 h-4 w-4 text-zinc-400" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search for curated objects..."
              className="flex-1 bg-transparent outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleCart}
              className="relative rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-400"
              aria-label="Open cart"
            >
              <ShoppingBag className="h-5 w-5" />
              {items.length > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[oklch(0.58_0.15_256.18)] px-1 text-[11px] font-semibold text-white">
                  {items.length}
                </span>
              )}
            </button>
            {status === "authenticated" ? (
              <button
                type="button"
                onClick={handleSignOut}
                className="hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 sm:block"
                disabled={signingOut}
              >
                {signingOut ? "Signing out..." : "Sign out"}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => signIn()}
                className="hidden rounded-full border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 sm:block"
              >
                Sign in
              </button>
            )}
          </div>
        </div>
        <div className="mt-3 px-4 sm:hidden">
          <div className="relative flex items-center rounded-2xl border border-zinc-200 bg-white px-4 py-2 text-sm">
            <Search className="mr-3 h-4 w-4 text-zinc-400" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Search products"
              className="flex-1 bg-transparent outline-none"
            />
          </div>
        </div>
      </header>

      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/20 backdrop-blur-sm transition-opacity",
          sidebarOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={() => setSidebarOpen(false)}
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 transform border-r border-zinc-100 bg-white/90 p-6 shadow-2xl transition-transform",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <p className="font-semibold text-zinc-700">Explore studio</p>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-full border border-transparent p-2 text-zinc-500 hover:border-zinc-200"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-4 text-sm text-zinc-500">
          {sidebarCategories.map((category) => (
            <button
              key={category}
              type="button"
              className="w-full rounded-2xl border border-transparent px-3 py-3 text-left transition hover:border-zinc-200 hover:text-zinc-800"
            >
              {category}
            </button>
          ))}
        </div>
        {status === "authenticated" && (
          <div className="mt-8 rounded-2xl border border-zinc-100 p-4 text-sm text-zinc-500">
            <p>Signed in as</p>
            <p className="font-semibold text-zinc-800">
              {session?.user?.name ?? session?.user?.email}
            </p>
          </div>
        )}
      </aside>
    </>
  );
}
