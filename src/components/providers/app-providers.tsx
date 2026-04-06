"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./cart-provider";
import { FavoritesProvider } from "./favorites-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { FavoritesDrawer } from "@/components/favorites/favorites-drawer";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        <FavoritesProvider>
          {children}
          <CartDrawer />
          <FavoritesDrawer />
        </FavoritesProvider>
      </CartProvider>
    </SessionProvider>
  );
}
