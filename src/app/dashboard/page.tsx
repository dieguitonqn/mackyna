import { redirect } from "next/navigation";
import { getActiveSession } from "@/lib/getActiveSession";
import DashboardOverview from "./DashboardOverview";

export default async function DashboardPage() {
  const session = await getActiveSession();
  if (session?.user?.rol !== "admin") redirect("/portalProfes");
  return <DashboardOverview />;
}
