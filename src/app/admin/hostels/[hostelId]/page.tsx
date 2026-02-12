import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Phone,
  Mail,
  BedDouble,
  Users,
  CalendarCheck,
  MessageSquareWarning,
  IndianRupee,
  Settings,
  ArrowLeft,
  Layers,
  ShieldCheck,
  Wifi,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

interface HostelDetailPageProps {
  params: Promise<{ hostelId: string }>;
}

export default async function HostelDetailPage({
  params,
}: HostelDetailPageProps) {
  const { hostelId } = await params;

  await requireHostelAccess(hostelId);

  const hostel = await db.hostel.findUnique({
    where: { id: hostelId, isActive: true },
    include: {
      admin: {
        select: { id: true, name: true, email: true },
      },
      _count: {
        select: {
          floors: true,
          rooms: true,
          beds: true,
          bookings: true,
          complaints: true,
          employees: true,
        },
      },
    },
  });

  if (!hostel) {
    notFound();
  }

  // Fetch additional stats
  const [occupiedBeds, activeBookings, pendingBookings, openComplaints] =
    await Promise.all([
      db.bed.count({
        where: { hostelId, isActive: true, status: "OCCUPIED" },
      }),
      db.booking.count({
        where: { hostelId, status: { in: ["APPROVED", "CHECKED_IN"] } },
      }),
      db.booking.count({
        where: { hostelId, status: "PENDING" },
      }),
      db.complaint.count({
        where: { hostelId, status: { in: ["OPEN", "IN_PROGRESS"] } },
      }),
    ]);

  const availableBeds = hostel._count.beds - occupiedBeds;
  const occupancyRate =
    hostel._count.beds > 0
      ? Math.round((occupiedBeds / hostel._count.beds) * 100)
      : 0;

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-4">
          <Link href="/admin/hostels">
            <Button variant="ghost" size="icon" className="mt-1">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight">
                {hostel.name}
              </h1>
              {hostel.gender && (
                <Badge variant="outline">
                  {hostel.gender === "MALE"
                    ? "Boys"
                    : hostel.gender === "FEMALE"
                      ? "Girls"
                      : "Co-ed"}
                </Badge>
              )}
            </div>
            <div className="mt-1 flex items-center gap-1 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>
                {hostel.address}, {hostel.city}, {hostel.state}
                {hostel.zipCode ? ` - ${hostel.zipCode}` : ""}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Link href={`/admin/hostels/${hostelId}/settings`}>
            <Button variant="outline" className="gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>
      </div>

      {/* Hostel Overview */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Details Card */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Hostel Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {hostel.description && (
              <div>
                <h4 className="text-sm font-medium text-muted-foreground">
                  Description
                </h4>
                <p className="mt-1 text-sm">{hostel.description}</p>
              </div>
            )}

            <Separator />

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Full Address</p>
                  <p className="text-sm">
                    {hostel.address}, {hostel.city}, {hostel.state},{" "}
                    {hostel.country}
                    {hostel.zipCode ? ` - ${hostel.zipCode}` : ""}
                  </p>
                </div>
              </div>
              {hostel.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="text-sm">{hostel.phone}</p>
                  </div>
                </div>
              )}
              {hostel.email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm">{hostel.email}</p>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-xs text-muted-foreground">Managed by</p>
                  <p className="text-sm">{hostel.admin.name}</p>
                </div>
              </div>
            </div>

            {/* Amenities */}
            {hostel.amenities.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <Wifi className="h-4 w-4" />
                    Amenities
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {hostel.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Rules */}
            {hostel.rules.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                    <ShieldCheck className="h-4 w-4" />
                    Rules
                  </h4>
                  <ul className="space-y-1">
                    {hostel.rules.map((rule, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-sm"
                      >
                        <span className="mt-0.5 text-muted-foreground">
                          {index + 1}.
                        </span>
                        {rule}
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Occupancy
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold">{occupancyRate}%</div>
                <p className="text-sm text-muted-foreground">
                  {occupiedBeds} of {hostel._count.beds} beds occupied
                </p>
                <div className="mt-3 flex justify-center gap-4">
                  <div>
                    <p className="text-lg font-semibold text-red-600">
                      {occupiedBeds}
                    </p>
                    <p className="text-xs text-muted-foreground">Occupied</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-green-600">
                      {availableBeds}
                    </p>
                    <p className="text-xs text-muted-foreground">Available</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="pt-6 text-center">
                <Layers className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-2xl font-bold">
                  {hostel._count.floors}
                </p>
                <p className="text-xs text-muted-foreground">Floors</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <BedDouble className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-2xl font-bold">
                  {hostel._count.rooms}
                </p>
                <p className="text-xs text-muted-foreground">Rooms</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <CalendarCheck className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-2xl font-bold">{activeBookings}</p>
                <p className="text-xs text-muted-foreground">Active</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6 text-center">
                <MessageSquareWarning className="mx-auto h-5 w-5 text-muted-foreground" />
                <p className="mt-2 text-2xl font-bold">{openComplaints}</p>
                <p className="text-xs text-muted-foreground">Complaints</p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardContent className="pt-6 text-center">
              <Users className="mx-auto h-5 w-5 text-muted-foreground" />
              <p className="mt-2 text-2xl font-bold">
                {hostel._count.employees}
              </p>
              <p className="text-xs text-muted-foreground">Employees</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Manage</CardTitle>
          <CardDescription>
            Quick links to manage different aspects of this hostel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Link href={`/admin/hostels/${hostelId}/floors`}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Layers className="h-4 w-4" />
                Floors & Rooms
                <Badge variant="secondary" className="ml-auto">
                  {hostel._count.floors}
                </Badge>
              </Button>
            </Link>
            <Link href={`/admin/hostels/${hostelId}/rooms`}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <BedDouble className="h-4 w-4" />
                Rooms & Beds
                <Badge variant="secondary" className="ml-auto">
                  {hostel._count.rooms}
                </Badge>
              </Button>
            </Link>
            <Link href={`/admin/hostels/${hostelId}/bookings`}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <CalendarCheck className="h-4 w-4" />
                Bookings
                {pendingBookings > 0 && (
                  <Badge variant="secondary" className="ml-auto">
                    {pendingBookings} pending
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href={`/admin/hostels/${hostelId}/complaints`}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <MessageSquareWarning className="h-4 w-4" />
                Complaints
                {openComplaints > 0 && (
                  <Badge variant="destructive" className="ml-auto">
                    {openComplaints}
                  </Badge>
                )}
              </Button>
            </Link>
            <Link href={`/admin/hostels/${hostelId}/employees`}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Users className="h-4 w-4" />
                Employees
                <Badge variant="secondary" className="ml-auto">
                  {hostel._count.employees}
                </Badge>
              </Button>
            </Link>
            <Link href={`/admin/hostels/${hostelId}/transactions`}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <IndianRupee className="h-4 w-4" />
                Transactions
              </Button>
            </Link>
            <Link href={`/admin/hostels/${hostelId}/announcements`}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Building2 className="h-4 w-4" />
                Announcements
              </Button>
            </Link>
            <Link href={`/admin/hostels/${hostelId}/settings`}>
              <Button
                variant="outline"
                className="w-full justify-start gap-2"
              >
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
