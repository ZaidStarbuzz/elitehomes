"use client";

import { useState } from "react";
import { createFloor } from "@/lib/actions/room";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

interface FloorFormProps {
  hostelId: string;
  onSuccess?: () => void;
}

export function FloorForm({ hostelId, onSuccess }: FloorFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const result = await createFloor(hostelId, formData);

    if (result?.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    setLoading(false);
    onSuccess?.();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Floor Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="e.g. Ground Floor"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="floorNumber">Floor Number</Label>
        <Input
          id="floorNumber"
          name="floorNumber"
          type="number"
          placeholder="e.g. 0, 1, 2"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Any additional details about this floor..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Floor"}
      </Button>
    </form>
  );
}
