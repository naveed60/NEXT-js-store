import { AdminOverview } from "@/components/admin/admin-overview";
import { getDashboardData } from "@/lib/admin-dashboard-data";

export default async function AdminOverviewPage() {
  const data = await getDashboardData();
  return <AdminOverview data={data} />;
}
