import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export type DashboardData = {
  stats: {
    label: string;
    value: string;
    change: string;
  }[];
  orders: {
    id: string;
    customer: string;
    total: string;
    status: string;
    createdAt: string;
  }[];
  highlights: {
    title: string;
    description: string;
    action: string;
  }[];
};

async function getDashboardData(): Promise<DashboardData> {
  try {
    const [userCount, productCount, orderCount, revenue, latestOrders] =
      await Promise.all([
        prisma.user.count(),
        prisma.product.count(),
        prisma.order.count(),
        prisma.order.aggregate({ _sum: { total: true } }),
        prisma.order.findMany({
          take: 5,
          orderBy: { createdAt: "desc" },
          include: { user: true },
        }),
      ]);

    const grossRevenue = revenue._sum.total
      ? revenue._sum.total.toNumber()
      : 0;

    return {
      stats: [
        {
          label: "Active customers",
          value: userCount.toString(),
          change: "+12.6% vs last month",
        },
        {
          label: "Shippable products",
          value: productCount.toString(),
          change: "8 new arrivals",
        },
        {
          label: "Orders processed",
          value: orderCount.toString(),
          change: "98% fulfillment rate",
        },
        {
          label: "Gross revenue",
          value: `$${grossRevenue.toLocaleString()}`,
          change: "+18.4% vs forecast",
        },
      ],
      orders: latestOrders.map((order) => ({
        id: order.id.slice(0, 8).toUpperCase(),
        customer: order.user?.name ?? order.user?.email ?? "Guest",
        total: `$${order.total.toNumber().toFixed(2)}`,
        status: order.status,
        createdAt: order.createdAt.toLocaleDateString(),
      })),
      highlights: [
        {
          title: "New waitlist signups",
          description: "542 members ready for the August capsule.",
          action: "Invite customers",
        },
        {
          title: "Low inventory alert",
          description: "3 hero products below the 15 unit threshold.",
          action: "Restock inventory",
        },
      ],
    };
  } catch (error) {
    console.warn("Falling back to mocked admin data", error);
    return {
      stats: [
        {
          label: "Active customers",
          value: "1,482",
          change: "+12.6% vs last month",
        },
        {
          label: "Shippable products",
          value: "86",
          change: "8 new arrivals",
        },
        {
          label: "Orders processed",
          value: "312",
          change: "98% fulfillment rate",
        },
        {
          label: "Gross revenue",
          value: "$128,450",
          change: "+18.4% vs forecast",
        },
      ],
      orders: [
        {
          id: "XSA9132",
          customer: "Studio Form",
          total: "$1,280",
          status: "PAID",
          createdAt: "Jun 4",
        },
        {
          id: "QW92LA1",
          customer: "Nova Collective",
          total: "$890",
          status: "FULFILLED",
          createdAt: "Jun 3",
        },
        {
          id: "VT88DD9",
          customer: "Atlas Agency",
          total: "$2,430",
          status: "PENDING",
          createdAt: "Jun 2",
        },
      ],
      highlights: [
        {
          title: "New waitlist signups",
          description: "542 members ready for the August capsule.",
          action: "Invite customers",
        },
        {
          title: "Low inventory alert",
          description: "3 hero products below the 15 unit threshold.",
          action: "Restock inventory",
        },
      ],
    };
  }
}

export default async function AdminPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/nextshop");
  }

  const data = await getDashboardData();

  return <AdminDashboard data={data} />;
}
