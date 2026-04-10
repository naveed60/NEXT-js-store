"use client";

import { useState, type ReactNode } from "react";
import { Footer } from "@/components/landing/footer";
import { PrimaryHeader } from "@/components/landing/primary-header";
import "./auth.css";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 pb-16">
      <div className="mx-auto max-w-6xl px-4">
        <PrimaryHeader
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={setSearchTerm}
          searchSuggestions={[]}
        />
        <div className="mt-10 md:mt-12">{children}</div>
        <Footer />
      </div>
    </div>
  );
}
