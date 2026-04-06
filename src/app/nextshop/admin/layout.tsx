import { ReactNode } from "react";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const { getServerSession } = require("next-auth") as any;
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export const metadata = {
  title: "NextShop Admin",
};

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session || session.user?.role !== "ADMIN") {
    redirect("/login");
  }

  return <AdminShell>{children}</AdminShell>;
}
