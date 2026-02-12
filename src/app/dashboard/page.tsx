import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function DashboardRedirect() {
  const session = await getSession();
  console.log(session);
  if (!session) {
    redirect("/login");
  }

  if (session.role === "HOSTEL_ADMIN" || session.role === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  redirect("/guest/dashboard");
}
