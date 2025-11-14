import { PrismaClient, Role, OrderStatus } from "@prisma/client";
import bcrypt from "bcrypt";
import { featuredProducts } from "@/data/products";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@nextshop.dev" },
    update: {
      role: Role.ADMIN,
      password,
    },
    create: {
      email: "admin@nextshop.dev",
      name: "Design Lead",
      password,
      role: Role.ADMIN,
    },
  });

  // Reset catalog
  await prisma.cartItem.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.product.deleteMany();

  await prisma.product.createMany({
    data: featuredProducts.map((product) => ({
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      tags: product.tags,
      rating: product.rating,
      featured: product.badge === "New Arrival" || product.badge === "Bestseller",
    })),
  });

  await prisma.order.create({
    data: {
      userId: admin.id,
      total: 1250,
      status: OrderStatus.PAID,
      items: {
        create: [
          {
            productId: featuredProducts[0].id,
            quantity: 1,
            price: featuredProducts[0].price,
          },
          {
            productId: featuredProducts[1].id,
            quantity: 2,
            price: featuredProducts[1].price,
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
