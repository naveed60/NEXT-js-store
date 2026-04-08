"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import { ReactNode, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Overview", href: "/nextshop/admin/overview", icon: LayoutDashboard },
  { label: "Orders", href: "/nextshop/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/nextshop/admin/products", icon: Package },
  { label: "Customers", href: "/nextshop/admin/customers", icon: Users },
  { label: "Analytics", href: "/nextshop/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/nextshop/admin/settings", icon: Settings },
];

type AdminSidebarUser = {
  name?: string | null;
  email?: string | null;
  role?: string | null;
};

export function AdminShell({
  children,
  user,
}: {
  children: ReactNode;
  user?: AdminSidebarUser;
}) {
  const pathname = usePathname();
  const [loggingOut, setLoggingOut] = useState(false);

  const userInitials = useMemo(() => {
    const source = user?.name?.trim() || user?.email?.trim() || "A";
    const parts = source.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }, [user?.email, user?.name]);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <aside className="flex w-72 flex-col border-r border-zinc-100 bg-white/90 px-6 py-8 shadow-xl backdrop-blur-lg">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-lg font-semibold text-zinc-800">Admin Dashboard</p>
        </div>

        <nav className="flex-1 space-y-2 text-sm text-zinc-500">
          {navItems.map((item) => {
            const isActive = pathname?.startsWith(item.href);
            return (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-3 py-3 transition hover:bg-zinc-100 hover:text-zinc-900",
                  isActive
                    ? "bg-zinc-900 text-white"
                    : "bg-transparent text-zinc-500",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-zinc-200 pt-4">
          <div className="flex items-center gap-3 rounded-2xl border border-zinc-200 bg-zinc-50 px-3 py-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900 text-sm font-semibold text-white">
              {userInitials}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-zinc-900">
                {user?.name?.trim() || "Admin user"}
              </p>
              <p className="truncate text-xs text-zinc-500">
                {user?.email?.trim() || "No email"}
              </p>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
                {user?.role || "ADMIN"}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="mt-3 w-full justify-start gap-2"
            disabled={loggingOut}
            onClick={async () => {
              try {
                setLoggingOut(true);
                await signOut({ callbackUrl: "/login" });
              } finally {
                setLoggingOut(false);
              }
            }}
          >
            <LogOut className="h-4 w-4" />
            {loggingOut ? "Logging out..." : "Logout"}
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-100 bg-white/70 px-6 py-5 shadow-sm">
          <div>
            <p className="text-sm text-zinc-500">Studio overview</p>
            <h1 className="text-2xl font-semibold text-zinc-900">Executive dashboard</h1>
          </div>
        </header>
        <main className="flex-1 overflow-auto px-6 py-8">{children}</main>
      </div>
    </div>
  );
}
