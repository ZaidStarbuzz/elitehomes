"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Layers,
  DoorOpen,
  BedDouble,
  Users,
  CalendarCheck,
  MessageSquareWarning,
  UserCog,
  IndianRupee,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { UserNav } from "@/components/layout/user-nav";

type NavItem = {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
};

export interface AdminSidebarUser {
  name: string;
  email: string;
  role: string;
  avatar?: string | null;
}

interface AdminSidebarProps {
  user: AdminSidebarUser;
}

const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/admin/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Hostels",
    href: "/admin/hostels",
    icon: Building2,
  },
];

function getHostelNavItems(hostelId: string): NavItem[] {
  return [
    {
      title: "Overview",
      href: `/admin/hostels/${hostelId}`,
      icon: LayoutDashboard,
    },
    {
      title: "Floors",
      href: `/admin/hostels/${hostelId}/floors`,
      icon: Layers,
    },
    {
      title: "Rooms",
      href: `/admin/hostels/${hostelId}/rooms`,
      icon: DoorOpen,
    },
    {
      title: "Beds",
      href: `/admin/hostels/${hostelId}/beds`,
      icon: BedDouble,
    },
    {
      title: "Guests",
      href: `/admin/hostels/${hostelId}/guests`,
      icon: Users,
    },
    {
      title: "Bookings",
      href: `/admin/hostels/${hostelId}/bookings`,
      icon: CalendarCheck,
    },
    {
      title: "Complaints",
      href: `/admin/hostels/${hostelId}/complaints`,
      icon: MessageSquareWarning,
    },
    {
      title: "Employees",
      href: `/admin/hostels/${hostelId}/employees`,
      icon: UserCog,
    },
    {
      title: "Finance",
      href: `/admin/hostels/${hostelId}/finance`,
      icon: IndianRupee,
    },
    {
      title: "Settings",
      href: `/admin/hostels/${hostelId}/settings`,
      icon: Settings,
    },
  ];
}

function extractHostelId(pathname: string): string | null {
  const match = pathname.match(/^\/admin\/hostels\/([^/]+)/);
  return match ? match[1] : null;
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname();
  const hostelId = extractHostelId(pathname);
  const hostelNavItems = hostelId ? getHostelNavItems(hostelId) : [];

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/admin/dashboard">
                <div className="bg-primary text-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <Building2 className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold">EliteHomes</span>
                  <span className="truncate text-xs text-muted-foreground">
                    Hostel Management
                  </span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={
                      pathname === item.href ||
                      (item.href === "/admin/hostels" &&
                        pathname.startsWith("/admin/hostels"))
                    }
                    tooltip={item.title}
                  >
                    <Link href={item.href}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {hostelId && hostelNavItems.length > 0 && (
          <>
            <SidebarSeparator />
            <SidebarGroup>
              <SidebarGroupLabel>Hostel Management</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {hostelNavItems.map((item) => {
                    const isOverview =
                      item.href === `/admin/hostels/${hostelId}`;
                    const isActive = isOverview
                      ? pathname === item.href
                      : pathname === item.href ||
                        pathname.startsWith(item.href + "/");

                    return (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton
                          asChild
                          isActive={isActive}
                          tooltip={item.title}
                        >
                          <Link href={item.href}>
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    );
                  })}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
      </SidebarContent>

      <SidebarFooter>
        <UserNav user={user} />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
