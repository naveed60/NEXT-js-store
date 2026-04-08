import Link from "next/link";

import { cn } from "@/lib/utils";

import type { DashboardData } from "@/lib/admin-dashboard-data";

export function AdminOverview({ data }: { data: DashboardData }) {
  return (
    <div className="space-y-8">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-zinc-500">Operations</p>
            <h1 className="text-3xl font-semibold text-zinc-900">Overview</h1>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/nextshop/admin/products"
              className="inline-flex items-center justify-center rounded-full border border-[oklch(0.58_0.15_256.18)] px-4 py-2 text-sm font-medium text-[oklch(0.58_0.15_256.18)] transition hover:bg-[oklch(0.58_0.15_256.18_/_0.08)]"
            >
              Manage products
            </Link>
            <Link
              href="/nextshop/admin/products/add"
              className="inline-flex items-center justify-center rounded-full bg-[oklch(0.58_0.15_256.18)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[oklch(0.63_0.15_256.18)]"
            >
              Add product
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {data.stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-zinc-100 bg-white p-5 shadow-lg"
          >
            <p className="text-sm text-zinc-500">{stat.label}</p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">{stat.value}</p>
            <p className="text-xs font-semibold text-emerald-500">{stat.change}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Realtime</p>
              <h2 className="text-xl font-semibold">Order pipeline</h2>
            </div>
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
                          statusStyles[order.status] ?? "bg-zinc-100 text-zinc-600",
                        )}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="py-3 text-right font-semibold">{order.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-zinc-500">Signals</p>
              <h2 className="text-xl font-semibold text-zinc-900">Highlights</h2>
            </div>
            <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
              {data.highlights.length} insights
            </span>
          </div>
          <div className="mt-4 space-y-3">
            {data.highlights.map((highlight) => (
              <div
                key={highlight.title}
                className="rounded-3xl border border-zinc-100 bg-zinc-50/60 p-4"
              >
                <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Signal</p>
                <h3 className="mt-2 text-lg font-semibold text-zinc-900">{highlight.title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{highlight.description}</p>
                <p className="mt-4 text-sm font-semibold text-zinc-700">{highlight.action}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <p className="text-sm text-zinc-500">Catalog snapshot</p>
            <h2 className="text-xl font-semibold text-zinc-900">Latest products</h2>
          </div>
          <Link
            href="/nextshop/admin/products"
            className="text-sm font-semibold text-[oklch(0.58_0.15_256.18)]"
          >
            Open products page
          </Link>
        </div>
        <div className="mt-4 space-y-3">
          {data.products.length === 0 ? (
            <p className="text-sm text-zinc-500">No products yet.</p>
          ) : (
            data.products.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="lg:flex-1">
                  <p className="text-sm font-semibold text-zinc-900">{product.name}</p>
                  <p className="line-clamp-2 text-xs text-zinc-500">{product.description}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                  <span>{product.priceLabel}</span>
                  <span>{product.inventory} in stock</span>
                  <span>Rating {product.rating.toFixed(1)}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700",
  PAID: "bg-emerald-100 text-emerald-700",
  FULFILLED: "bg-sky-100 text-sky-700",
  CANCELLED: "bg-red-100 text-red-700",
};
