"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Heart, ShoppingBag, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getValidImageUrl } from "@/lib/utils";
import { type StorefrontProduct } from "@/types/product";

type StorefrontProductCardProps = {
  product: StorefrontProduct;
  isFavorite: boolean;
  onToggleFavorite: (product: StorefrontProduct) => void;
  onAddToCart: () => void;
  onView?: (product: StorefrontProduct) => void;
};

const SWATCH_CLASSES = [
  "bg-zinc-800",
  "bg-rose-100",
  "bg-slate-300",
  "bg-indigo-200",
  "bg-amber-100",
];

function formatCardPrice(amount: number) {
  return `Rs.${new Intl.NumberFormat("en-PK").format(Math.round(amount))}`;
}

function getPromoPercent(product: StorefrontProduct) {
  if (product.featured) return 80;
  return Math.min(70, 35 + product.tags.length * 10);
}

function getComparePrice(price: number, promoPercent: number) {
  const multiplier = 1 / (1 - promoPercent / 100);
  return Math.max(price, Math.round(price * multiplier));
}

function getEyebrow(product: StorefrontProduct) {
  if (product.featured) return "Featured";
  return "Curated";
}

export function StorefrontProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onView,
}: StorefrontProductCardProps) {
  const promoPercent = getPromoPercent(product);
  const comparePrice = getComparePrice(product.price, promoPercent);
  const swatches = SWATCH_CLASSES.slice(0, Math.max(3, Math.min(4, product.tags.length + 1)));

  return (
    <article className="group flex h-full flex-col rounded-[24px] border border-[#ead8ff] bg-white p-3 shadow-[0_12px_36px_rgba(68,25,112,0.08)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgba(68,25,112,0.12)]">
      <div className="relative overflow-hidden rounded-[20px] border border-zinc-300 bg-[#faf7ff]">
        <Link href={`/nextshop/products/${product.id}`} className="relative block aspect-[1/1]">
          {getValidImageUrl(product.image) ? (
            <Image
              src={product.image}
              alt={product.name}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-xs font-semibold uppercase tracking-[0.2em] text-zinc-400">
              Image unavailable
            </div>
          )}
        </Link>
        <span className="absolute left-4 top-4 z-10 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-emerald-500 shadow-sm">
          {getEyebrow(product)}
        </span>
        <div className="pointer-events-none absolute right-3 top-3 z-10 flex translate-x-2 flex-col gap-2 opacity-0 transition-all duration-200 group-hover:pointer-events-auto group-hover:translate-x-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:translate-x-0 group-focus-within:opacity-100">
          {onView && (
            <button
              type="button"
              aria-label="Quick view product"
              onClick={() => onView(product)}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-[0_10px_22px_rgba(15,23,42,0.16)] transition hover:scale-105"
            >
              <Eye className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
            onClick={() => onToggleFavorite(product)}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-[0_10px_22px_rgba(15,23,42,0.16)] transition hover:scale-105"
          >
            <Heart
              className={`h-4 w-4 transition ${isFavorite ? "fill-[#c9162b] text-[#c9162b]" : ""}`}
            />
          </button>
          <button
            type="button"
            aria-label="Add to cart"
            onClick={onAddToCart}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white/95 text-zinc-700 shadow-[0_10px_22px_rgba(15,23,42,0.16)] transition hover:scale-105"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-2 pb-2 pt-4">
        <div className="flex items-start justify-between">
          <div className="min-w-0">
            <h3 className="text-[1.65rem] font-semibold leading-none tracking-[-0.04em] text-zinc-950">
              {product.name}
            </h3>
            <p className="mt-3 line-clamp-2 min-h-12 text-base leading-6 text-zinc-500">
              {product.description}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold tracking-[0.06em] text-[#ff4b3e]">
            {promoPercent}% OFF
          </p>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {swatches.map((swatchClass, index) => (
              <span
                key={`${product.id}-swatch-${index}`}
                className={`h-4 w-4 rounded-full border border-white shadow-sm ${swatchClass}`}
              />
            ))}
            {product.tags.length > 3 && (
              <span className="text-sm font-semibold text-zinc-900">+{product.tags.length - 3}</span>
            )}
          </div>
          <div className="flex items-center gap-1.5 text-base font-semibold text-zinc-950">
            <Star className="h-4 w-4 fill-[#ffb200] text-[#ffb200]" />
            {product.rating.toFixed(1)}
          </div>
        </div>

        <div className="mt-auto">
          <p className="text-xl text-zinc-400 line-through">{formatCardPrice(comparePrice)}</p>

          <div className="mt-2 flex items-end justify-between gap-4">
            <p className="text-[2.1rem] font-semibold leading-none tracking-[-0.05em] text-zinc-950">
              {formatCardPrice(product.price)}
            </p>
            <Button
              className="h-12 rounded-full bg-[#3b82f6] px-6 text-base font-semibold text-white shadow-[0_12px_28px_rgba(59,130,246,0.22)] hover:bg-[#2563eb]"
              onClick={onAddToCart}
            >
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
