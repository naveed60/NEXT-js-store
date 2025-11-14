"use client";

import type { DashboardData } from "@/app/nextshop/admin/page";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BarChart3,
  LayoutDashboard,
  Menu,
  Package,
  Settings,
  ShoppingBag,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const navigation = [
  { label: "Overview", icon: LayoutDashboard },
  { label: "Orders", icon: ShoppingBag },
  { label: "Products", icon: Package },
  { label: "Customers", icon: Users },
  { label: "Analytics", icon: BarChart3 },
  { label: "Settings", icon: Settings },
];

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FULFILLED: "bg-sky-100 text-sky-700",
  CANCELLED: "bg-red-100 text-red-700",
};

export function AdminDashboard({ data }: { data: DashboardData }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-zinc-50 via-white to-zinc-100 text-zinc-900">
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-30 w-72 border-r border-zinc-100 bg-white/90 px-6 py-8 backdrop-blur-lg transition-transform shadow-xl lg:static lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-lg font-semibold text-zinc-800">NextShop Admin</p>
          <button
            type="button"
            className="rounded-full border border-transparent p-2 text-zinc-500 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <nav className="mt-8 space-y-2 text-sm text-zinc-500">
          {navigation.map((item) => (
            <button
              key={item.label}
              type="button"
              className="flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition hover:bg-zinc-100 hover:text-zinc-800"
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </button>
          ))}
        </nav>
        <div className="mt-10 rounded-3xl border border-zinc-100 bg-white p-5 text-zinc-900 shadow-lg">
          <p className="text-sm text-zinc-500">Need deeper insights?</p>
          <p className="mt-2 text-lg font-semibold">Unlock Pro analytics</p>
          <Button size="sm" className="mt-4 w-full bg-white text-zinc-800">
            Upgrade
          </Button>
        </div>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-zinc-100 bg-white/70 px-6 py-5 backdrop-blur-lg">
          <div>
            <p className="text-sm text-zinc-500">Operations</p>
            <h1 className="text-2xl font-semibold">Executive dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-full border border-zinc-200 p-2 text-zinc-600 lg:hidden"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <Link
              href="/nextshop"
              className="hidden text-sm font-semibold text-zinc-500 underline-offset-4 hover:underline sm:block"
            >
              View storefront
            </Link>
            <Button className="hidden sm:inline-flex">New product</Button>
          </div>
        </header>

        <main className="flex-1 space-y-8 px-6 py-8">
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {data.stats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-lg"
              >
                <p className="text-sm text-zinc-500">{stat.label}</p>
                <p className="mt-2 text-3xl font-semibold">{stat.value}</p>
                <p className="text-xs font-semibold text-emerald-500">
                  {stat.change}
                </p>
              </div>
            ))}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-zinc-500">Realtime</p>
                  <h2 className="text-xl font-semibold">Order pipeline</h2>
                </div>
                <Button variant="ghost" className="text-sm">
                  View all
                </Button>
              </div>
              <div className="mt-6 overflow-auto">
                <table className="w-full min-w-[480px] text-sm">
                  <thead className="text-left text-xs uppercase text-zinc-400">
                    <tr>
                      <th className="pb-3">Order</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3">Status</th>
                      <th className="pb-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100">
                    {data.orders.map((order) => (
                      <tr key={order.id} className="text-sm">
                        <td className="py-3 font-semibold">{order.id}</td>
                        <td className="py-3 text-zinc-500">{order.customer}</td>
                        <td className="py-3">
                          <span
                            className={cn(
                              "rounded-full px-3 py-1 text-xs font-semibold",
                              statusStyles[order.status] ??
                                "bg-zinc-100 text-zinc-600",
                            )}
                          >
                            {order.status}
                          </span>
                        </td>
                        <td className="py-3 text-right font-semibold">
                          {order.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="space-y-6">
              {data.highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg"
                >
                  <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                    Signal
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-zinc-900">
                    {highlight.title}
                  </h3>
                  <p className="mt-2 text-sm text-zinc-500">
                    {highlight.description}
                  </p>
                  <Button variant="ghost" className="mt-4 px-0 text-zinc-700">
                    {highlight.action}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
