import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { Settings } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ hostelId: string }>;
}) {
  const { hostelId } = await params;
  await requireHostelAccess(hostelId);

  const hostel = await db.hostel.findUnique({
    where: { id: hostelId },
  });

  if (!hostel) {
    redirect("/admin");
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-primary" />
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Hostel Settings
          </h1>
          <p className="text-muted-foreground">
            Manage hostel information and configuration
          </p>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>
            General details about the hostel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Hostel Name</Label>
              <Input id="name" defaultValue={hostel.name} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input id="slug" defaultValue={hostel.slug} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                defaultValue={hostel.email || ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                defaultValue={hostel.phone || ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                defaultValue={hostel.website || ""}
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Gender</Label>
              <Input
                id="gender"
                defaultValue={hostel.gender || "Co-ed"}
                readOnly
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              defaultValue={hostel.description || ""}
              readOnly
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Address */}
      <Card>
        <CardHeader>
          <CardTitle>Address</CardTitle>
          <CardDescription>
            Location details of the hostel
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input id="address" defaultValue={hostel.address} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" defaultValue={hostel.city} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input id="state" defaultValue={hostel.state} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" defaultValue={hostel.country} readOnly />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode">Zip Code</Label>
              <Input
                id="zipCode"
                defaultValue={hostel.zipCode || ""}
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Amenities */}
      <Card>
        <CardHeader>
          <CardTitle>Amenities</CardTitle>
          <CardDescription>
            Facilities available at the hostel
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hostel.amenities.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No amenities configured.
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {hostel.amenities.map((amenity) => (
                <Badge key={amenity} variant="secondary">
                  {amenity}
                </Badge>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Hostel Rules</CardTitle>
          <CardDescription>
            Rules and regulations for guests
          </CardDescription>
        </CardHeader>
        <CardContent>
          {hostel.rules.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No rules configured.
            </p>
          ) : (
            <ul className="space-y-2">
              {hostel.rules.map((rule, index) => (
                <li
                  key={index}
                  className="flex items-start gap-2 text-sm"
                >
                  <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-medium text-primary">
                    {index + 1}
                  </span>
                  {rule}
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      {/* Capacity */}
      <Card>
        <CardHeader>
          <CardTitle>Capacity</CardTitle>
          <CardDescription>
            Hostel capacity information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label>Total Capacity</Label>
            <p className="text-2xl font-bold">{hostel.totalCapacity} beds</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
