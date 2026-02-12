"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { createHostel } from "@/lib/actions/hostel";
import { DEFAULT_AMENITIES } from "@/lib/constants";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Building2, Loader2 } from "lucide-react";

export function HostelForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("");

  function toggleAmenity(amenity: string) {
    setSelectedAmenities((prev) =>
      prev.includes(amenity)
        ? prev.filter((a) => a !== amenity)
        : [...prev, amenity]
    );
  }

  async function handleSubmit(formData: FormData) {
    setError(null);

    // Append selected amenities to form data
    selectedAmenities.forEach((amenity) => {
      formData.append("amenities", amenity);
    });

    // Append gender from controlled select
    if (gender) {
      formData.set("gender", gender);
    }

    startTransition(async () => {
      const result = await createHostel(formData);

      if (result.error) {
        setError(result.error);
        return;
      }

      if (result.success) {
        router.push("/admin/hostels");
      }
    });
  }

  return (
    <form action={handleSubmit}>
      <div className="space-y-6">
        {/* Error Display */}
        {error && (
          <div className="rounded-md bg-destructive/10 px-4 py-3">
            <p className="text-sm font-medium text-destructive">{error}</p>
          </div>
        )}

        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Basic Information
            </CardTitle>
            <CardDescription>
              Enter the basic details about your hostel
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Hostel Name *</Label>
              <Input
                id="name"
                name="name"
                placeholder="e.g., Sunrise Boys Hostel"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Describe your hostel, its features, and what makes it special..."
                rows={4}
                disabled={isPending}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="+91 9876543210"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="contact@hostel.com"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="gender">Gender Preference</Label>
              <Select
                value={gender}
                onValueChange={setGender}
                disabled={isPending}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select gender preference" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Boys Only</SelectItem>
                  <SelectItem value="FEMALE">Girls Only</SelectItem>
                  <SelectItem value="OTHER">Co-ed / Mixed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Address */}
        <Card>
          <CardHeader>
            <CardTitle>Address</CardTitle>
            <CardDescription>
              Where is your hostel located?
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="address">Street Address *</Label>
              <Input
                id="address"
                name="address"
                placeholder="123, Main Street, Near Bus Stand"
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="e.g., Mumbai"
                  required
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State *</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="e.g., Maharashtra"
                  required
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  defaultValue="India"
                  disabled={isPending}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">Zip Code</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  placeholder="400001"
                  disabled={isPending}
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
              Select the amenities available at your hostel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {DEFAULT_AMENITIES.map((amenity) => (
                <div key={amenity} className="flex items-center gap-2">
                  <Checkbox
                    id={`amenity-${amenity}`}
                    checked={selectedAmenities.includes(amenity)}
                    onCheckedChange={() => toggleAmenity(amenity)}
                    disabled={isPending}
                  />
                  <Label
                    htmlFor={`amenity-${amenity}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {amenity}
                  </Label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isPending} className="gap-2">
            {isPending && <Loader2 className="h-4 w-4 animate-spin" />}
            {isPending ? "Creating..." : "Create Hostel"}
          </Button>
        </div>
      </div>
    </form>
  );
}
