import { AdminProductForm } from "@/components/admin/admin-product-form";

export default function AdminAddProductPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Catalog</p>
        <h1 className="text-3xl font-semibold text-zinc-900">Add product</h1>
      </div>

      <AdminProductForm mode="create" />
    </div>
  );
}
