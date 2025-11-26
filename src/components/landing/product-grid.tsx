"use client";

import { type StorefrontProduct } from "@/types/product";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useCart } from "@/components/providers/cart-provider";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";

const allowedImageHosts = new Set([
  "images.unsplash.com",
  "www.bopuqilamur.org.uk",
  "img.freepik.com",
]);

const getValidImageUrl = (src: string) => {
  if (!src) return null;
  if (src.startsWith("/")) {
    return src;
  }

  try {
    const url = new URL(src);
    return allowedImageHosts.has(url.hostname) ? src : null;
  } catch (error) {
    return null;
  }
};

type ProductGridProps = {
  searchTerm: string;
  products: StorefrontProduct[];
};

export function ProductGrid({ searchTerm, products }: ProductGridProps) {
  const { addItem } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const normalized = searchTerm.trim().toLowerCase();

  const visibleProducts = products.filter((product) => {
    if (!normalized) return true;
    return (
      product.name.toLowerCase().includes(normalized) ||
      product.tags.some((tag) => tag.toLowerCase().includes(normalized))
    );
  });

  return (
    <section className="mt-12 space-y-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
            Featured essentials
          </p>
          <h2 className="text-3xl font-semibold text-zinc-900">
            Studio best sellers
          </h2>
        </div>
        <p className="text-sm text-zinc-500">
          {visibleProducts.length} curated product
          {visibleProducts.length === 1 ? "" : "s"}
        </p>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visibleProducts.map((product) => (
          <article
            key={product.id}
            className="group flex flex-col rounded-[30px] border border-zinc-100 bg-white p-4 shadow-xl transition hover:-translate-y-1 hover:border-zinc-200"
          >
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-zinc-100">
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
              {product.featured && (
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-emerald-500 shadow">
                  Featured
                </span>
              )}
            </div>
            <div className="flex flex-1 flex-col gap-3 px-1 pt-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-zinc-900">
                    {product.name}
                  </h3>
                  <p className="text-sm text-zinc-500">
                    {product.description}
                  </p>
                </div>
                <div className="flex items-center gap-1 text-sm font-semibold">
                  <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                  {product.rating.toFixed(1)}
                </div>
              </div>
              <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-zinc-200 px-3 py-1"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-auto flex items-center justify-between">
                <p className="text-2xl font-semibold text-zinc-900">
                  ${product.price.toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  className="border border-zinc-200 px-4 py-2 text-sm font-semibold text-zinc-700 hover:border-zinc-400"
                  onClick={() => {
                    if (status === "authenticated") {
                      addItem(product);
                      toast.success(`${product.name} added to cart`);
                    } else {
                      toast.error("Please sign in to add items to the cart");
                      router.push("/login?redirect=/nextshop");
                    }
                  }}
                >
                  Add to cart
                </Button>
              </div>
            </div>
          </article>
        ))}
        {visibleProducts.length === 0 && (
          <div className="rounded-[30px] border border-dashed border-zinc-200 p-10 text-center text-zinc-500 sm:col-span-2 lg:col-span-3">
            Nothing matches “{searchTerm}”. Try a different keyword.
          </div>
        )}
      </div>
    </section>
  );
}
