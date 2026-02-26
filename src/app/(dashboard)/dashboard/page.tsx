import { getAnalytics } from "@/server/actions";
import { DashboardClient } from "@/components/dashboard/dashboard-client";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let analytics;
  try {
    analytics = await getAnalytics();
  } catch (e) {
    analytics = null;
  }

  return <DashboardClient analytics={analytics} />;
}
