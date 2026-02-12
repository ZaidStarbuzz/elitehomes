"use client";

import { Bell } from "lucide-react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface AdminHeaderUser {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface AdminHeaderProps {
  user: AdminHeaderUser;
}

export function AdminHeader({ user }: AdminHeaderProps) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />

      <div className="flex flex-1 items-center gap-2">
        <h1 className="text-sm font-medium text-muted-foreground">
          {user.role === "SUPER_ADMIN" ? "Super Admin" : "Hostel Admin"}
        </h1>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="size-4" />
          <span className="sr-only">Notifications</span>
        </Button>
      </div>
    </header>
  );
}
