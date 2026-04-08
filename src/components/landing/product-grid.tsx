"use client";

import { useState } from "react";
import { type StorefrontProduct } from "@/types/product";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/cart-provider";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useRouter } from "next/navigation";
import { ProductModal } from "./product-modal";
import { StorefrontProductCard } from "./storefront-product-card";

const CATEGORY_LABELS: Record<string, string> = {
  "men-un-stitch": "Men — Un-Stitch",
  "men-stitch": "Men — Stitch",
  "men-watches": "Men — Watches",
  "men-perfumes": "Men — Perfumes",
  "men-cufflinks": "Men — Cufflinks",
  "women-un-stitch": "Women — Un-Stitch",
  "women-stitch": "Women — Stitch",
  "women-watches": "Women — Watches",
  "women-perfumes": "Women — Perfumes",
  "women-cufflinks": "Women — Cufflinks",
  "kids-baby-boys": "Kids — Baby Boys Suits",
  "kids-baby-girls": "Kids — Baby Girls Suits",
};

type ProductGridProps = {
  searchTerm: string;
  products: StorefrontProduct[];
};

export function ProductGrid({ searchTerm, products }: ProductGridProps) {
  const { addItem } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();
  const { status } = useSession();
  const router = useRouter();
  const [selectedProduct, setSelectedProduct] = useState<StorefrontProduct | null>(null);
  const normalized = searchTerm.trim().toLowerCase();

  const visible = products.filter((p) => {
    if (!normalized) return true;
    return (
      p.name.toLowerCase().includes(normalized) ||
      p.tags.some((t) => t.toLowerCase().includes(normalized)) ||
      (CATEGORY_LABELS[p.category] ?? p.category).toLowerCase().includes(normalized)
    );
  });

  // Sections
  const featured = visible.filter((p) => p.featured);
  const newArrivals = visible
    .slice()
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 6);

  const byCategory = visible.reduce<Record<string, StorefrontProduct[]>>((acc, p) => {
    if (!p.category) return acc;
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  if (visible.length === 0) {
    return (
      <section className="mt-12">
        <div className="rounded-[30px] border border-dashed border-zinc-200 p-10 text-center text-zinc-500">
          Nothing matches &quot;{searchTerm}&quot;. Try a different keyword.
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="mt-12 space-y-16">
        {featured.length > 0 && (
          <ProductSection title="Featured" subtitle="Hand-picked by our team">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} addItem={addItem} status={status} router={router} isFavorite={isFavorite} toggleFavorite={toggleFavorite} onView={setSelectedProduct} />
            ))}
          </ProductSection>
        )}

        {newArrivals.length > 0 && (
          <ProductSection title="New Arrivals" subtitle="Latest additions to the catalog">
            {newArrivals.map((p) => (
              <ProductCard key={p.id} product={p} addItem={addItem} status={status} router={router} isFavorite={isFavorite} toggleFavorite={toggleFavorite} onView={setSelectedProduct} />
            ))}
          </ProductSection>
        )}

        {Object.entries(byCategory).map(([cat, items]) => (
          <ProductSection key={cat} title={CATEGORY_LABELS[cat] ?? cat} subtitle={`${items.length} product${items.length === 1 ? "" : "s"}`}>
            {items.map((p) => (
              <ProductCard key={p.id} product={p} addItem={addItem} status={status} router={router} isFavorite={isFavorite} toggleFavorite={toggleFavorite} onView={setSelectedProduct} />
            ))}
          </ProductSection>
        ))}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  );
}

function ProductSection({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">{subtitle}</p>
          <h2 className="text-2xl font-semibold text-zinc-900">{title}</h2>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{children}</div>
    </section>
  );
}

type CardProps = {
  product: StorefrontProduct;
  addItem: (p: StorefrontProduct) => void;
  status: string;
  router: ReturnType<typeof useRouter>;
  isFavorite: (id: string) => boolean;
  toggleFavorite: (p: StorefrontProduct) => void;
  onView: (p: StorefrontProduct) => void;
};

function ProductCard({ product, addItem, status, router, isFavorite, toggleFavorite, onView }: CardProps) {
  const handleCart = () => {
    if (status === "authenticated") {
      addItem(product);
      toast.success(`${product.name} added to cart`);
    } else {
      toast.error("Please sign in to add items to the cart");
      router.push("/login?redirect=/nextshop");
    }
  };

  return (
    <StorefrontProductCard
      product={product}
      isFavorite={isFavorite(product.id)}
      onToggleFavorite={toggleFavorite}
      onAddToCart={handleCart}
      onView={onView}
    />
  );
}
