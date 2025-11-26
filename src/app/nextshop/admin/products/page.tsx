export default function AdminProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Catalog</p>
        <h1 className="text-3xl font-semibold text-zinc-900">Products</h1>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {[...Array(2)].map((_, index) => (
          <div
            key={index}
            className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg"
          >
            <h2 className="text-lg font-semibold text-zinc-900">
              Product board {index + 1}
            </h2>
            <p className="mt-2 text-sm text-zinc-500">
              Product-level controls, inventory forecasting, and featured
              toggles will live here once the catalog expands. Use the overview
              form to add or update a listing in the meantime.
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
