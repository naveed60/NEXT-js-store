"use client";

import Link from "next/link";
import {
  ChevronDown,
  Heart,
  Menu,
  Search,
  ShoppingBag,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useCart } from "@/components/providers/cart-provider";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type HeaderProps = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const navLinks: { label: string; href: string }[] = [];

type CategoryNavItem = {
  label: string;
  items: { label: string; href: string }[];
};

const categoryNavItems: CategoryNavItem[] = [
  {
    label: "MEN",
    items: [
      { label: "Un-Stitch", href: "/nextshop/men/un-stitch" },
      { label: "Stitch", href: "/nextshop/men/stitch" },
      { label: "Watch Collection", href: "/nextshop/men/watches" },
      { label: "Perfume Collection", href: "/nextshop/men/perfumes" },
      { label: "Cufflinks", href: "/nextshop/men/cufflinks" },
    ],
  },
  {
    label: "WOMEN",
    items: [
      { label: "Un-Stitch", href: "/nextshop/women/un-stitch" },
      { label: "Stitch", href: "/nextshop/women/stitch" },
      { label: "Watch Collection", href: "/nextshop/women/watches" },
      { label: "Perfume Collection", href: "/nextshop/women/perfumes" },
      { label: "Cufflinks", href: "/nextshop/women/cufflinks" },
    ],
  },
  {
    label: "KIDS",
    items: [
      { label: "Baby Boys Suits", href: "/nextshop/kids/baby-boys-suits" },
      { label: "Baby Girls Suits", href: "/nextshop/kids/baby-girls-suits" },
    ],
  },
];

const LogoMark = () => (
  <span className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-600 via-fuchsia-500 to-orange-500 text-white shadow-xl">
    <span className="text-lg font-bold tracking-tight">NS</span>
  </span>
);

export function PrimaryHeader({ searchTerm, onSearchChange }: HeaderProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openSidebarCat, setOpenSidebarCat] = useState<string | null>(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const { items, toggleCart } = useCart();
  const { favorites, toggleDrawer: toggleFavorites } = useFavorites();
  const { status, data: session } = useSession();
  const [signingOut, setSigningOut] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      setSigningOut(true);
      await signOut({ redirect: false });
      toast.success("Signed out");
      router.push("/nextshop");
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
            className="sm:hidden rounded-2xl border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-400"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Link
            href="/nextshop"
            className="flex items-center gap-3"
            aria-label="Go to NextShop home"
          >
            <LogoMark />
          </Link>
          <nav className="hidden flex-1 items-center justify-center gap-6 text-sm text-zinc-400 sm:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="transition hover:text-zinc-700"
              >
                {link.label}
              </Link>
            ))}
            {categoryNavItems.map((cat) => (
              <div
                key={cat.label}
                className="relative pb-2"
                onMouseEnter={() => setOpenCategory(cat.label)}
                onMouseLeave={() => setOpenCategory(null)}
              >
                <button
                  type="button"
                  className="flex items-center gap-1 font-semibold tracking-wide text-zinc-700 transition hover:text-zinc-900"
                >
                  {cat.label}
                  <svg className="h-3 w-3 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openCategory === cat.label && (
                  <div className="absolute left-0 top-full z-50 w-52 rounded-2xl border border-zinc-100 bg-white py-2 shadow-xl">
                    {cat.items.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="block px-4 py-2.5 text-sm text-zinc-600 transition hover:bg-zinc-50 hover:text-zinc-900"
                      >
                        {item.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
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
              onClick={toggleFavorites}
              className="relative rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-400"
              aria-label="Favorites"
            >
              <Heart className={`h-5 w-5 transition ${favorites.length > 0 ? "fill-rose-500 text-rose-500" : ""}`} />
              {favorites.length > 0 && (
                <span className="absolute -right-1 -top-1 inline-flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-rose-500 px-1 text-[11px] font-semibold text-white">
                  {favorites.length}
                </span>
              )}
            </button>
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
              <div className="relative hidden sm:block">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="rounded-full border border-zinc-200 p-2 text-zinc-600 transition hover:border-zinc-400"
                  aria-label="User profile"
                >
                  <User className="h-5 w-5" />
                </button>

                {profileOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-2 z-50 w-64 rounded-2xl border border-zinc-100 bg-white p-4 shadow-xl">
                      <div className="mb-4">
                        <p className="text-sm font-medium text-zinc-900">
                          {session?.user?.name}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {session?.user?.email}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={handleSignOut}
                        className="w-full rounded-xl border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-400 hover:bg-zinc-50"
                        disabled={signingOut}
                      >
                        {signingOut ? "Signing out..." : "Sign out"}
                      </button>
                    </div>
                  </>
                )}
              </div>
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
          <p className="font-semibold text-zinc-700">Categories</p>
          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="rounded-full border border-transparent p-2 text-zinc-500 hover:border-zinc-200"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-6 space-y-1 text-sm">
          {categoryNavItems.map((cat) => (
            <div key={cat.label}>
              <button
                type="button"
                onClick={() =>
                  setOpenSidebarCat(openSidebarCat === cat.label ? null : cat.label)
                }
                className="flex w-full items-center justify-between rounded-2xl px-3 py-3 font-semibold tracking-wide text-zinc-700 transition hover:bg-zinc-100"
              >
                {cat.label}
                <ChevronDown
                  className={cn(
                    "h-4 w-4 text-zinc-400 transition-transform duration-200",
                    openSidebarCat === cat.label && "rotate-180",
                  )}
                />
              </button>
              {openSidebarCat === cat.label && (
                <div className="ml-3 mt-1 space-y-0.5 border-l border-zinc-100 pl-3">
                  {cat.items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className="block rounded-xl px-3 py-2.5 text-zinc-500 transition hover:bg-zinc-50 hover:text-zinc-900"
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
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
