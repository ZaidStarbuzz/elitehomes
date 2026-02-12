import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/layout/admin-sidebar";
import { AdminHeader } from "@/components/layout/admin-header";
import { Toaster } from "@/components/ui/sonner";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role !== "HOSTEL_ADMIN" && session.role !== "SUPER_ADMIN") {
    redirect("/guest/dashboard");
  }

  const user = {
    name: session.name,
    email: session.email,
    role: session.role,
    avatar: session.avatar,
  };

  return (
    <SidebarProvider>
      <AdminSidebar user={user} />
      <SidebarInset>
        <AdminHeader user={user} />
        <div className="flex flex-1 flex-col p-4">
          {children}
        </div>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
