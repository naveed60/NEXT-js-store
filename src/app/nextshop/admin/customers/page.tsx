export default function AdminCustomersPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          Community
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900">Customers</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-zinc-900">
              Segment {index + 1}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Customer cohorts, loyalty tiers, and outreach automation will
              surface here. For now, use the session data and analytics to scope
              your next drop.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
