"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "./cart-provider";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </SessionProvider>
  );
}
