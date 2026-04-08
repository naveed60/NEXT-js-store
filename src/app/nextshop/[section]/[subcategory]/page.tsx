import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { SectionLayout } from "@/components/landing/section-layout";
import { CategoryProductGrid } from "@/components/landing/category-product-grid";
import { type StorefrontProduct } from "@/types/product";

export const dynamic = "force-dynamic";

type RawProduct = {
  id: unknown;
  name: unknown;
  description: unknown;
  price: unknown;
  image: unknown;
  tags: unknown;
  rating: unknown;
  featured: unknown;
  category: unknown;
  createdAt: unknown;
};

const URL_TO_CATEGORY: Record<string, string> = {
  "men/un-stitch":         "men-un-stitch",
  "men/stitch":            "men-stitch",
  "men/watches":           "men-watches",
  "men/perfumes":          "men-perfumes",
  "men/cufflinks":         "men-cufflinks",
  "women/un-stitch":       "women-un-stitch",
  "women/stitch":          "women-stitch",
  "women/watches":         "women-watches",
  "women/perfumes":        "women-perfumes",
  "women/cufflinks":       "women-cufflinks",
  "kids/baby-boys-suits":  "kids-baby-boys",
  "kids/baby-girls-suits": "kids-baby-girls",
};

const CATEGORY_META: Record<string, { title: string; kicker: string }> = {
  "men-un-stitch":   { title: "Men — Un-Stitch",          kicker: "Men's Collection" },
  "men-stitch":      { title: "Men — Stitch",              kicker: "Men's Collection" },
  "men-watches":     { title: "Men — Watch Collection",    kicker: "Men's Collection" },
  "men-perfumes":    { title: "Men — Perfume Collection",  kicker: "Men's Collection" },
  "men-cufflinks":   { title: "Men — Cufflinks",           kicker: "Men's Collection" },
  "women-un-stitch": { title: "Women — Un-Stitch",         kicker: "Women's Collection" },
  "women-stitch":    { title: "Women — Stitch",            kicker: "Women's Collection" },
  "women-watches":   { title: "Women — Watch Collection",  kicker: "Women's Collection" },
  "women-perfumes":  { title: "Women — Perfume Collection",kicker: "Women's Collection" },
  "women-cufflinks": { title: "Women — Cufflinks",         kicker: "Women's Collection" },
  "kids-baby-boys":  { title: "Kids — Baby Boys Suits",    kicker: "Kids' Collection" },
  "kids-baby-girls": { title: "Kids — Baby Girls Suits",   kicker: "Kids' Collection" },
};

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ section: string; subcategory: string }>;
}) {
  const { section, subcategory } = await params;
  const key = `${section}/${subcategory}`;
  const categorySlug = URL_TO_CATEGORY[key];

  if (!categorySlug) return notFound();

  const meta = CATEGORY_META[categorySlug];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rawProducts = await (prisma.product.findMany as any)({
    where: { category: categorySlug },
    orderBy: { createdAt: "desc" },
  });

  const products: StorefrontProduct[] = (rawProducts as RawProduct[]).map((p) => {
    const createdAt =
      p.createdAt instanceof Date
        ? p.createdAt
        : new Date(String(p.createdAt ?? "1970-01-01T00:00:00.000Z"));

    return {
      id: String(p.id),
      name: String(p.name),
      description: String(p.description ?? ""),
      price: Number(p.price),
      image: String(p.image ?? ""),
      tags: Array.isArray(p.tags) ? p.tags.map((tag: unknown) => String(tag)) : [],
      rating: Number(p.rating ?? 0),
      featured: Boolean(p.featured),
      category: String(p.category ?? ""),
      createdAt: createdAt.toISOString(),
    };
  });
  const searchSuggestions = Array.from(
    new Set(
      products.flatMap((product) => [product.name, ...product.tags])
    )
  ).slice(0, 12);

  return (
    <SectionLayout
      title={meta.title}
      kicker={meta.kicker}
      description={`${products.length} product${products.length === 1 ? "" : "s"} in this category`}
      searchSuggestions={searchSuggestions}
    >
      <CategoryProductGrid products={products} />
    </SectionLayout>
  );
}
