export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
          Insights
        </p>
        <h1 className="text-3xl font-semibold text-zinc-900">Analytics</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {["Sessions", "Conversion rate", "AOV"].map((metric) => (
          <div
            key={metric}
            className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              {metric}
            </p>
            <p className="mt-2 text-3xl font-semibold text-zinc-900">
              {metric === "Conversion rate" ? "4.1%" : "–"}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              Data sync is on the roadmap; this card will show live performance
              once the next data pipeline ships.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
