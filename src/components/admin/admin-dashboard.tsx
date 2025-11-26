"use client";

import {
  ChangeEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
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
import { toast } from "sonner";

type ProductSummary = {
  id: string;
  name: string;
  description: string;
  priceLabel: string;
  priceValue: number;
  image: string;
  tags: string[];
  inventory: number;
  featured: boolean;
  rating: number;
};

type ProductFormState = {
  name: string;
  description: string;
  price: string;
  image: string;
  tags: string;
  inventory: string;
  rating: string;
  featured: boolean;
};

const initialProductForm: ProductFormState = {
  name: "",
  description: "",
  price: "0",
  image: "",
  tags: "",
  inventory: "25",
  rating: "4.5",
  featured: false,
};

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
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [productForm, setProductForm] = useState<ProductFormState>(
    initialProductForm,
  );
  const [submittingProduct, setSubmittingProduct] = useState(false);
  const [catalog, setCatalog] = useState<ProductSummary[]>(data.products);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [editingProduct, setEditingProduct] = useState<ProductSummary | null>(
    null,
  );
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [viewingProduct, setViewingProduct] = useState<ProductSummary | null>(
    null,
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const refreshProducts = useCallback(async () => {
    setLoadingProducts(true);
    try {
      const response = await fetch("/api/admin/products", {
        cache: "no-store",
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to load products");
      }

      setCatalog(payload.products ?? []);
    } catch (error) {
      console.error(error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Unable to load catalog entries",
      );
    } finally {
      setLoadingProducts(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  const isEditing = Boolean(editingProduct);

  const handleEditProduct = (product: ProductSummary) => {
    setNewProductOpen(true);
    setEditingProduct(product);
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.priceValue.toString(),
      image: product.image,
      tags: product.tags.join(", "),
      inventory: product.inventory.toString(),
      rating: product.rating.toString(),
      featured: product.featured,
    });
  };

  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductForm(initialProductForm);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.currentTarget.files?.[0];
    if (!file) {
      return;
    }

    setUploadError(null);
    setUploadingImage(true);

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch("/api/admin/uploads", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message ?? "Unable to upload image");
      }

      setProductForm((prev) => ({
        ...prev,
        image: payload.url ?? prev.image,
      }));
      toast.success("Image uploaded");
    } catch (error) {
      console.error(error);
      const message =
        error instanceof Error ? error.message : "Unable to upload image";
      setUploadError(message);
      toast.error(message);
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleDeleteProduct = async (product: ProductSummary) => {
    if (!confirm(`Delete "${product.name}"? This cannot be undone.`)) {
      return;
    }

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
      console.error(error);
      toast.error(
        error instanceof Error ? error.message : "Unable to delete product",
      );
    }
  };

  const handleViewProduct = (product: ProductSummary) => {
    setViewingProduct(product);
  };

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
            <Button
              variant="outline"
              className="hidden sm:inline-flex"
              onClick={() => setNewProductOpen((prev) => !prev)}
            >
              {newProductOpen ? "Close form" : "New product"}
            </Button>
          </div>
        </header>

        <main className="flex-1 space-y-8 px-6 py-8">
          <div className="space-y-4">
            <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg transition">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-zinc-500">Product catalog</p>
                  <h2 className="text-xl font-semibold text-zinc-900">
                    {editingProduct ? "Update a product" : "Add a new product"}
                  </h2>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setNewProductOpen((prev) => !prev)}
                  >
                    {newProductOpen ? "Hide form" : "Open form"}
                  </Button>
                  {editingProduct && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancelEdit}
                    >
                      Cancel edit
                    </Button>
                  )}
                </div>
              </div>
              {newProductOpen ? (
                <form
                  onSubmit={async (event) => {
                    event.preventDefault();
                    setSubmittingProduct(true);

                    try {
                      const tags = productForm.tags
                        .split(",")
                        .map((tag) => tag.trim())
                        .filter(Boolean);

                      const url = editingProduct
                        ? `/api/admin/products/${editingProduct.id}`
                        : "/api/admin/products";
                      const response = await fetch(url, {
                        method: editingProduct ? "PATCH" : "POST",
                        headers: {
                          "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                          name: productForm.name,
                          description: productForm.description,
                          price: parseFloat(productForm.price),
                          image: productForm.image,
                          tags,
                          inventory: Number(productForm.inventory),
                          featured: productForm.featured,
                          rating: parseFloat(productForm.rating),
                        }),
                      });

                      if (!response.ok) {
                        const errorData = await response
                          .json()
                          .catch(() => null);
                        throw new Error(
                          errorData?.message ??
                            (isEditing
                              ? "Unable to update product"
                              : "Unable to add product"),
                        );
                      }

                      toast.success(
                        isEditing ? "Product updated" : "Product saved",
                      );
                      setProductForm(initialProductForm);
                      setEditingProduct(null);
                      await refreshProducts();
                    } catch (error) {
                      console.error(error);
                      toast.error(
                        error instanceof Error
                          ? error.message
                          : "Unable to save product",
                      );
                    } finally {
                      setSubmittingProduct(false);
                    }
                  }}
                  className="mt-6 space-y-4"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1 text-sm font-medium text-zinc-600">
                      Name
                      <input
                        type="text"
                        required
                        value={productForm.name}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            name: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                      />
                    </label>
                    <label className="space-y-1 text-sm font-medium text-zinc-600">
                      Price
                      <input
                        type="number"
                        min={0}
                        step="0.01"
                        required
                        value={productForm.price}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            price: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                      />
                    </label>
                  </div>
                  <label className="space-y-1 text-sm font-medium text-zinc-600">
                    Description
                    <textarea
                      required
                      value={productForm.description}
                      onChange={(event) =>
                        setProductForm((prev) => ({
                          ...prev,
                          description: event.target.value,
                        }))
                      }
                      rows={3}
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                  <label className="space-y-1 text-sm font-medium text-zinc-600">
                    Image URL
                    <div className="flex flex-col gap-2">
                      <div className="flex gap-2">
                        <input
                          type="url"
                          required
                          value={productForm.image}
                          onChange={(event) =>
                            setProductForm((prev) => ({
                              ...prev,
                              image: event.target.value,
                            }))
                          }
                          className="flex-1 rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          className="whitespace-nowrap"
                          onClick={triggerFileInput}
                          disabled={uploadingImage}
                        >
                          {uploadingImage ? "Uploading..." : "Upload"}
                        </Button>
                      </div>
                      {uploadError && (
                        <p className="text-xs font-semibold text-rose-500">
                          {uploadError}
                        </p>
                      )}
                    </div>
                  </label>
                    <label className="space-y-1 text-sm font-medium text-zinc-600">
                      Inventory
                      <input
                        type="number"
                        min={0}
                        required
                        value={productForm.inventory}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            inventory: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                      />
                    </label>
                  </div>
                  <label className="space-y-1 text-sm font-medium text-zinc-600">
                    Tags (comma separated)
                    <input
                      type="text"
                      value={productForm.tags}
                      onChange={(event) =>
                        setProductForm((prev) => ({
                          ...prev,
                          tags: event.target.value,
                        }))
                      }
                      className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                    />
                  </label>
                  <div className="grid gap-4 md:grid-cols-2">
                    <label className="space-y-1 text-sm font-medium text-zinc-600">
                      Rating
                      <input
                        type="number"
                        min={0}
                        max={5}
                        step="0.1"
                        required
                        value={productForm.rating}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            rating: event.target.value,
                          }))
                        }
                        className="w-full rounded-2xl border border-zinc-200 px-4 py-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-500"
                      />
                    </label>
                    <label className="flex items-center gap-2 text-sm font-medium text-zinc-600">
                      <input
                        type="checkbox"
                        checked={productForm.featured}
                        onChange={(event) =>
                          setProductForm((prev) => ({
                            ...prev,
                            featured: event.target.checked,
                          }))
                        }
                        className="h-4 w-4 rounded border border-zinc-200 text-[oklch(0.58_0.15_256.18)] focus:ring-[oklch(0.58_0.15_256.18)]"
                      />
                      Featured
                    </label>
                  </div>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={submittingProduct}
                  >
                    {submittingProduct
                      ? isEditing
                        ? "Updating..."
                        : "Saving..."
                      : isEditing
                      ? "Update product"
                      : "Add product"}
                  </Button>
                </form>
              ) : (
                <p className="mt-4 text-sm text-zinc-500">
                  Open the form to seed or update a product directly from the
                  dashboard.
                </p>
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <p className="text-sm text-zinc-500">Catalog insights</p>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Latest catalog entries
                </h2>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                {catalog.length} shown
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {loadingProducts ? (
                <p className="text-sm text-zinc-500">Loading products…</p>
              ) : catalog.length === 0 ? (
                <p className="text-sm text-zinc-500">
                  No catalog entries yet. Add one above to see it listed here.
                </p>
              ) : (
                catalog.map((product) => (
                  <div
                    key={product.id}
                    className="flex flex-col gap-2 rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 transition hover:border-zinc-300 lg:flex-row lg:items-center lg:justify-between"
                  >
                    <div className="lg:flex-1">
                      <p className="text-sm font-semibold text-zinc-900">
                        {product.name}
                      </p>
                      <p className="text-xs text-zinc-500">
                        {product.description}
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2 text-xs text-zinc-500">
                        {product.tags.map((tag) => (
                          <span
                            key={`${product.id}-${tag}`}
                            className="rounded-full border border-zinc-200 px-3 py-1"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
                      <span className="text-zinc-900">{product.priceLabel}</span>
                      <span className="text-xs text-zinc-500">
                        {product.inventory} in stock
                      </span>
                      <span className="text-xs text-zinc-500">
                        Rating {product.rating.toFixed(1)}
                      </span>
                      {product.featured && (
                        <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                          Featured
                        </span>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleViewProduct(product)}
                        >
                          View
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditProduct(product)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="border border-rose-300 text-rose-500 hover:border-rose-400 hover:text-rose-600"
                          onClick={() => handleDeleteProduct(product)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          <div className="rounded-3xl border border-zinc-100 bg-white p-6 shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-zinc-500">Catalog insights</p>
                <h2 className="text-xl font-semibold text-zinc-900">
                  Latest products
                </h2>
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">
                {data.products.length} total
              </span>
            </div>
            <div className="mt-4 space-y-3">
              {data.products.map((product) => (
                <div
                  key={product.id}
                  className="flex flex-col gap-1 rounded-2xl border border-zinc-100 bg-zinc-50/50 px-4 py-3 transition hover:border-zinc-300 lg:flex-row lg:items-center lg:justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-zinc-500">{product.id}</p>
                  </div>
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <span className="text-zinc-900">{product.price}</span>
                    {product.featured && (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-emerald-700">
                        Featured
                      </span>
                    )}
                  </div>
                </div>
              ))}
              {data.products.length === 0 && (
                <p className="text-sm text-zinc-500">
                  No catalog entries yet. Add one above to see it listed here.
                </p>
              )}
            </div>
          </div>

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
      {viewingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 py-10">
          <div className="w-full max-w-2xl rounded-3xl bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.4em] text-zinc-400">
                  Product preview
                </p>
                <h3 className="text-xl font-semibold text-zinc-900">
                  {viewingProduct.name}
                </h3>
              </div>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setViewingProduct(null)}
              >
                Close
              </Button>
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-zinc-100">
                {viewingProduct.image ? (
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
                      key={`${viewingProduct.id}-${tag}-view`}
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
