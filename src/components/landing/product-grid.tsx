"use client";

import { useState } from "react";
import { type StorefrontProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/cart-provider";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { getValidImageUrl, formatPrice } from "@/lib/utils";
import { ProductModal } from "./product-modal";
import Link from "next/link";

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
    <article className="group flex flex-col rounded-[30px] border border-zinc-100 bg-white p-4 shadow-xl transition hover:-translate-y-1 hover:border-zinc-200">
      <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-zinc-100">
        <Link href={`/nextshop/products/${product.id}`} className="absolute inset-0 z-0">
          {getValidImageUrl(product.image) ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Image unavailable
            </div>
          )}
        </Link>
        {product.featured && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-500 shadow">
            Featured
          </span>
        )}
        <div className="absolute right-3 top-3 z-10 flex translate-x-2 flex-col gap-2 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
          <button
            type="button"
            aria-label="View product"
            onClick={() => onView(product)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-zinc-100"
          >
            <Eye className="h-4 w-4 text-zinc-600" />
          </button>
          <button
            type="button"
            aria-label={isFavorite(product.id) ? "Remove from favorites" : "Add to favorites"}
            onClick={() => toggleFavorite(product)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-zinc-100"
          >
            <Heart className={`h-4 w-4 transition ${isFavorite(product.id) ? "fill-rose-500 text-rose-500" : "text-zinc-600"}`} />
          </button>
          <button
            type="button"
            aria-label="Add to cart"
            onClick={handleCart}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-white shadow-md transition hover:bg-zinc-100"
          >
            <ShoppingBag className="h-4 w-4 text-zinc-600" />
          </button>
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 px-1 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-zinc-900">{product.name}</h3>
            <p className="text-sm text-zinc-500">{product.description}</p>
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            {product.rating.toFixed(1)}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
          {product.tags.map((tag) => (
            <span key={tag} className="rounded-full border border-zinc-200 px-3 py-1">
              {tag}
            </span>
          ))}
        </div>
        <div className="mt-auto flex items-center justify-between">
          <p className="text-2xl font-semibold text-zinc-900">{formatPrice(product.price)}</p>
          <Button
            variant="ghost"
            className="border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
            onClick={handleCart}
          >
            Add to cart
          </Button>
        </div>
      </div>
    </article>
  );
}
