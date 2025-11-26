"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
} from "lucide-react";
import { ReactNode } from "react";

const navItems = [
  { label: "Overview", href: "/nextshop/admin/overview", icon: LayoutDashboard },
  { label: "Orders", href: "/nextshop/admin/orders", icon: ShoppingBag },
  { label: "Products", href: "/nextshop/admin/products", icon: Package },
  { label: "Customers", href: "/nextshop/admin/customers", icon: Users },
  { label: "Analytics", href: "/nextshop/admin/analytics", icon: BarChart3 },
  { label: "Settings", href: "/nextshop/admin/settings", icon: Settings },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <aside className="w-72 border-r border-zinc-100 bg-white/90 px-6 py-8 shadow-xl backdrop-blur-lg">
        <div className="mb-8 flex items-center justify-between">
          <p className="text-lg font-semibold text-zinc-800">Studio admin</p>
        </div>
        <nav className="space-y-2 text-sm text-zinc-500">
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
