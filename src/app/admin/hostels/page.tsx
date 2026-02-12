import { requireRole } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Building2, MapPin, Plus, BedDouble, CalendarCheck, Users } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function HostelsPage() {
  const session = await requireRole(["HOSTEL_ADMIN", "SUPER_ADMIN"]);

  const hostels = await db.hostel.findMany({
    where:
      session.role === "SUPER_ADMIN"
        ? { isActive: true }
        : { adminId: session.id, isActive: true },
    orderBy: { createdAt: "desc" },
    include: {
      _count: {
        select: {
          rooms: true,
          beds: true,
          bookings: true,
          employees: true,
        },
      },
    },
  });

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Hostels</h1>
          <p className="text-muted-foreground">
            Manage all your hostels in one place
          </p>
        </div>
        <Link href="/admin/hostels/new">
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Add New Hostel
          </Button>
        </Link>
      </div>

      {/* Hostels Grid */}
      {hostels.length === 0 ? (
        <Card className="py-12 text-center">
          <CardContent>
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
              <Building2 className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold">No hostels yet</h3>
            <p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">
              Create your first hostel to start managing rooms, bookings, and
              tenants.
            </p>
            <Link href="/admin/hostels/new">
              <Button className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Create Your First Hostel
              </Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {hostels.map((hostel) => (
            <Link
              key={hostel.id}
              href={`/admin/hostels/${hostel.id}`}
              className="group"
            >
              <Card className="h-full transition-shadow hover:shadow-md">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg group-hover:text-primary transition-colors">
                          {hostel.name}
                        </CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          {hostel.city}, {hostel.state}
                        </CardDescription>
                      </div>
                    </div>
                    {hostel.gender && (
                      <Badge variant="outline" className="text-xs">
                        {hostel.gender === "MALE"
                          ? "Boys"
                          : hostel.gender === "FEMALE"
                            ? "Girls"
                            : "Co-ed"}
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  {hostel.description && (
                    <p className="mb-4 line-clamp-2 text-sm text-muted-foreground">
                      {hostel.description}
                    </p>
                  )}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                      <BedDouble className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {hostel._count.rooms}
                        </p>
                        <p className="text-xs text-muted-foreground">Rooms</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                      <BedDouble className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {hostel._count.beds}
                        </p>
                        <p className="text-xs text-muted-foreground">Beds</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                      <CalendarCheck className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {hostel._count.bookings}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Bookings
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 rounded-md bg-muted/50 px-3 py-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium">
                          {hostel._count.employees}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Employees
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Amenities preview */}
                  {hostel.amenities.length > 0 && (
                    <div className="mt-4 flex flex-wrap gap-1">
                      {hostel.amenities.slice(0, 4).map((amenity) => (
                        <Badge
                          key={amenity}
                          variant="secondary"
                          className="text-xs"
                        >
                          {amenity}
                        </Badge>
                      ))}
                      {hostel.amenities.length > 4 && (
                        <Badge variant="outline" className="text-xs">
                          +{hostel.amenities.length - 4} more
                        </Badge>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
