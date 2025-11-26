import { Prisma } from "@prisma/client";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const productUpdateSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    image: z.string().url().optional(),
    price: z.coerce.number().positive().optional(),
    tags: z.array(z.string()).optional(),
    inventory: z.coerce.number().int().min(0).optional(),
    featured: z.boolean().optional(),
    rating: z.coerce.number().min(0).max(5).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id?: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const productId = resolvedParams?.id;

  if (!productId) {
    return NextResponse.json({ message: "Missing product id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const productData = productUpdateSchema.parse(body);

    const updateData: Prisma.ProductUpdateInput = {};

    if (typeof productData.name === "string") {
      updateData.name = productData.name;
    }

    if (typeof productData.description === "string") {
      updateData.description = productData.description;
    }

    if (typeof productData.image === "string") {
      updateData.image = productData.image;
    }

    if (typeof productData.price === "number") {
      updateData.price = new Prisma.Decimal(productData.price);
    }

    if (typeof productData.tags !== "undefined") {
      updateData.tags = productData.tags;
    }

    if (typeof productData.inventory === "number") {
      updateData.inventory = productData.inventory;
    }

    if (typeof productData.featured === "boolean") {
      updateData.featured = productData.featured;
    }

    if (typeof productData.rating === "number") {
      updateData.rating = productData.rating;
    }

    await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return NextResponse.json({ message: "Product updated" }, { status: 200 });
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
      { message: "Unable to update product" },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id?: string }> },
) {
  const session = await getServerSession(authOptions);

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const resolvedParams = await params;
  const productId = resolvedParams?.id;

  if (!productId) {
    return NextResponse.json({ message: "Missing product id" }, { status: 400 });
  }

  try {
    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Unable to delete product" },
      { status: 500 },
    );
  }
}
