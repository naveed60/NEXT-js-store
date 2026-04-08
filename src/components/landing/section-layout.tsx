"use client";

import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { PrimaryHeader } from "./primary-header";

type SectionSearchContextValue = {
  searchTerm: string;
  onSearchChange: (value: string) => void;
};

const SectionSearchContext = createContext<SectionSearchContextValue | null>(null);

export function useSectionSearch() {
  return useContext(SectionSearchContext);
}

type SectionLayoutProps = {
  title: string;
  description: string;
  kicker?: string;
  children?: ReactNode;
  searchSuggestions?: string[];
};

export function SectionLayout({
  title,
  description,
  kicker,
  children,
  searchSuggestions = [],
}: SectionLayoutProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const sectionRef = useRef<HTMLElement | null>(null);
  const contextValue = useMemo<SectionSearchContextValue>(
    () => ({
      searchTerm,
      onSearchChange: setSearchTerm,
    }),
    [searchTerm]
  );

  return (
    <SectionSearchContext.Provider value={contextValue}>
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 via-white to-zinc-100 pb-20">
        <div className="mx-auto max-w-6xl px-4 pb-12">
          <PrimaryHeader
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onSearchSubmit={(query) => {
              setSearchTerm(query);
              sectionRef.current?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
            searchSuggestions={searchSuggestions}
          />
          <section
            ref={sectionRef}
            className="mt-10 space-y-4 rounded-[32px] border border-zinc-100 bg-white p-8 shadow-2xl"
          >
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
    </SectionSearchContext.Provider>
  );
}
