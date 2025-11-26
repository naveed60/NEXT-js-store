import { LandingScreen } from "@/components/landing/landing-screen";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function NextShopPage() {
  const products = await prisma.product.findMany({
    take: 9,
    orderBy: { createdAt: "desc" },
  });

  const serializedProducts = products.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: product.image,
    tags: product.tags,
    rating: product.rating,
    featured: product.featured,
  }));

  return <LandingScreen products={serializedProducts} />;
}
