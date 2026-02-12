import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { GuestSidebar, GuestHeader } from "@/components/layout/guest-sidebar";
import { Toaster } from "@/components/ui/sonner";

export default async function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  if (!session) {
    redirect("/login");
  }

  if (session.role === "HOSTEL_ADMIN" || session.role === "SUPER_ADMIN") {
    redirect("/admin/dashboard");
  }

  const user = {
    name: session.name,
    email: session.email,
    avatar: session.avatar,
  };

  return (
    <SidebarProvider>
      <GuestSidebar user={user} />
      <SidebarInset>
        <GuestHeader user={user} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </SidebarInset>
      <Toaster />
    </SidebarProvider>
  );
}
