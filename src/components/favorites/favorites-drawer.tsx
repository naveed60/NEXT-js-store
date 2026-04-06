"use client";

import { useFavorites } from "@/components/providers/favorites-provider";
import { cn, getValidImageUrl, formatPrice } from "@/lib/utils";
import { Heart, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

export function FavoritesDrawer() {
  const { favorites, isOpen, closeDrawer, removeFavorite } = useFavorites();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-30 bg-black/20 backdrop-blur-sm transition-opacity",
          isOpen
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0",
        )}
        onClick={closeDrawer}
      />
      <div
        className={cn(
          "fixed inset-y-0 right-0 z-40 w-full max-w-md transform bg-white shadow-2xl transition-transform duration-300",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-zinc-100 px-6 py-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 fill-rose-500 text-rose-500" />
            <h3 className="text-lg font-semibold">Favorites</h3>
          </div>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-full border border-transparent p-2 text-zinc-500 transition hover:border-zinc-200 hover:text-zinc-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex h-[calc(100%-72px)] flex-col gap-4 overflow-y-auto px-6 py-4">
          {favorites.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-16 text-center">
              <Heart className="h-10 w-10 text-zinc-200" />
              <p className="text-sm text-zinc-500">No favorites yet.</p>
            </div>
          ) : (
            favorites.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-4 shadow-sm"
              >
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-zinc-100">
                  {getValidImageUrl(item.image) ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[10px] font-semibold uppercase tracking-widest text-zinc-400">
                      No image
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-medium text-zinc-900">{item.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        removeFavorite(item.id);
                        toast.success(`${item.name} removed from favorites`);
                      }}
                      className="shrink-0 text-xs text-zinc-500 underline-offset-2 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-sm font-semibold text-zinc-700">
                    {formatPrice(item.price)}
                  </p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
