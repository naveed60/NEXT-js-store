export default function AdminOrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          Order intelligence
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900">Orders</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Pending", value: "24", tone: "text-amber-500" },
          { label: "Shipped", value: "118", tone: "text-emerald-500" },
          { label: "Returned", value: "6", tone: "text-rose-500" },
        ].map((stat) => (
          <div
            key={stat.label}
            className="rounded-3xl border border-zinc-100 bg-white p-4 text-sm text-zinc-500 shadow"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              {stat.label}
            </p>
            <p className={`mt-2 text-2xl font-semibold text-zinc-900 ${stat.tone}`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>
      <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg">
        <p className="text-sm text-zinc-500">
          The order table integration is coming Soon. For now, review the
          operational summaries above, and head back to the overview for
          live order insights.
        </p>
      </div>
    </div>
  );
}
