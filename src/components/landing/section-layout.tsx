"use client";

import { useState, type ReactNode } from "react";
import { PrimaryHeader } from "./primary-header";

type SectionLayoutProps = {
  title: string;
  description: string;
  kicker?: string;
  children?: ReactNode;
};

export function SectionLayout({
  title,
  description,
  kicker,
  children,
}: SectionLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 pb-20">
      <div className="mx-auto max-w-6xl px-4 pb-12">
        <PrimaryHeader searchTerm={searchTerm} onSearchChange={setSearchTerm} />
        <section className="mt-10 space-y-4 rounded-[32px] border border-zinc-100 bg-white p-8 shadow-2xl">
          {kicker ? (
            <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
              {kicker}
            </p>
          ) : null}
          <h1 className="text-3xl font-semibold text-zinc-900">{title}</h1>
          <p className="text-sm leading-6 text-zinc-500">{description}</p>
          {children ? <div className="pt-4">{children}</div> : null}
        </section>
      </div>
    </div>
  );
}
