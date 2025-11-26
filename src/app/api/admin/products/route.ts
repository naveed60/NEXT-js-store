import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const productCreateSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  image: z.string().url(),
  price: z.coerce.number().positive(),
  tags: z.array(z.string()).optional().default([]),
  inventory: z.coerce.number().int().min(0).default(25),
  featured: z.boolean().default(false),
  rating: z.coerce.number().min(0).max(5).default(4.5),
});

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({
    products: products.map((product) => ({
      id: product.id,
      name: product.name,
      priceLabel: `$${product.price.toNumber().toFixed(2)}`,
      priceValue: product.price.toNumber(),
      featured: product.featured,
      description: product.description,
      image: product.image,
      tags: product.tags,
      inventory: product.inventory,
      rating: product.rating,
    })),
  });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const productData = productCreateSchema.parse(body);

    await prisma.product.create({
      data: {
        name: productData.name,
        description: productData.description,
        image: productData.image,
        price: new Prisma.Decimal(productData.price),
        tags: productData.tags,
        inventory: productData.inventory,
        featured: productData.featured,
        rating: productData.rating,
      },
    });

    return NextResponse.json({ message: "Product created" }, { status: 201 });
  } catch (error) {
    console.error(error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          message: error.errors
            .map((err) => `${err.path.join(".")}: ${err.message}`)
            .join(", "),
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { message: "Unable to create product" },
      { status: 500 },
    );
  }
}
