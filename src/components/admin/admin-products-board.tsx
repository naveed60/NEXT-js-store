"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PyramidLoader } from "@/components/ui/pyramid-loader";

import type { AdminProductSummary } from "@/types/admin-product";

export function AdminProductsBoard() {
  const [catalog, setCatalog] = useState<AdminProductSummary[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [viewingProduct, setViewingProduct] = useState<AdminProductSummary | null>(
    null,
  );
  const [deletingProductId, setDeletingProductId] = useState<string | null>(null);

  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true);

    try {
      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to load products");
      }

      setCatalog(payload?.products ?? []);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to load products",
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const handleDeleteProduct = async (product: AdminProductSummary) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

    setDeletingProductId(product.id);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "DELETE",
      });
      const payload = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to delete product");
      }

      toast.success("Product deleted");
      await refreshProducts();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to delete product",
      );
    } finally {
      setDeletingProductId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">Catalog</p>
          <h1 className="text-3xl font-semibold text-zinc-900">Products</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={refreshProducts}>
            Refresh
          </Button>
          <Link
            href="/nextshop/admin/products/add"
            className="inline-flex items-center justify-center rounded-full bg-[oklch(0.58_0.15_256.18)] px-4 py-2 text-sm font-medium text-white transition hover:bg-[oklch(0.63_0.15_256.18)]"
          >
            Add product
          </Link>
        </div>
      </div>

      <section className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-zinc-500">All products</p>
          <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
            {catalog.length} total
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {loadingProducts ? (
            <div className="flex justify-center py-8">
              <PyramidLoader size="md" label="Loading products..." />
            </div>
          ) : catalog.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-zinc-300 bg-zinc-50 p-6">
              <p className="text-sm text-zinc-600">No products found.</p>
              <Link
                href="/nextshop/admin/products/add"
                className="mt-3 inline-flex text-sm font-semibold text-[oklch(0.58_0.15_256.18)]"
              >
                Add your first product
              </Link>
            </div>
          ) : (
            catalog.map((product) => (
              <div
                key={product.id}
                className="flex flex-col gap-3 rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="min-w-0 lg:flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-900">{product.name}</p>
                  <p className="line-clamp-2 text-xs text-zinc-500">{product.description}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
                    <span>{product.priceLabel}</span>
                    <span>{product.inventory} in stock</span>
                    <span>Rating {product.rating.toFixed(1)}</span>
                    {product.featured && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <Button size="sm" variant="ghost" onClick={() => setViewingProduct(product)}>
                    View
                  </Button>
                  <Link
                    href={`/nextshop/admin/products/${product.id}/edit`}
                    className="inline-flex items-center justify-center rounded-full border border-[oklch(0.58_0.15_256.18)] px-3 py-1.5 text-sm font-medium text-[oklch(0.58_0.15_256.18)] transition hover:bg-[oklch(0.58_0.15_256.18_/_0.08)]"
                  >
                    Edit
                  </Link>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="border border-rose-300 text-rose-500 hover:border-rose-400 hover:text-rose-600"
                    disabled={deletingProductId === product.id}
                    onClick={() => handleDeleteProduct(product)}
                  >
                    {deletingProductId === product.id ? (
                      <span className="inline-flex items-center gap-2">
                        <PyramidLoader size="xs" />
                        Deleting...
                      </span>
                    ) : (
                      "Delete"
                    )}
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">Product preview</p>
                <h3 className="text-xl font-semibold text-zinc-900">{viewingProduct.name}</h3>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setViewingProduct(null)}>
                Close
              </Button>
            </div>

            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-zinc-100">
                {viewingProduct.image ? (
                  // Next/Image is not suitable here because URLs can be arbitrary admin-provided links.
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={viewingProduct.image}
                    alt={viewingProduct.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                    No image
                  </div>
                )}
              </div>

              <div className="space-y-2 text-sm text-zinc-600">
                <p>{viewingProduct.description}</p>
                <p>Price: {viewingProduct.priceLabel}</p>
                <p>Inventory: {viewingProduct.inventory}</p>
                <p>Rating: {viewingProduct.rating.toFixed(1)}</p>
                <div className="flex flex-wrap gap-2">
                  {viewingProduct.tags.map((tag) => (
                    <span
                      key={`${viewingProduct.id}-${tag}-preview`}
                      className="rounded-full border border-zinc-200 px-3 py-1 text-[10px] uppercase tracking-[0.3em]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
