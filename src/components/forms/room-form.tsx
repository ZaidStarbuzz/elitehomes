"use client";

import { useState } from "react";
import { createRoom } from "@/lib/actions/room";
import { ROOM_TYPE_LABELS } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomFormProps {
  hostelId: string;
  floors: Array<{ id: string; name: string; floorNumber: number }>;
  onSuccess?: () => void;
}

export function RoomForm({ hostelId, floors, onSuccess }: RoomFormProps) {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [roomType, setRoomType] = useState("");
  const [floorId, setFloorId] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    formData.set("type", roomType);
    formData.set("floorId", floorId);

    const result = await createRoom(hostelId, formData);

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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="roomNumber">Room Number</Label>
          <Input
            id="roomNumber"
            name="roomNumber"
            placeholder="e.g. 101"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="name">Room Name (Optional)</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Deluxe Room"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Room Type</Label>
          <Select value={roomType} onValueChange={setRoomType} required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(ROOM_TYPE_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="capacity">Capacity</Label>
          <Input
            id="capacity"
            name="capacity"
            type="number"
            min={1}
            placeholder="e.g. 2"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="monthlyRent">Monthly Rent</Label>
          <Input
            id="monthlyRent"
            name="monthlyRent"
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 5000"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="deposit">Deposit</Label>
          <Input
            id="deposit"
            name="deposit"
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 10000"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>Floor</Label>
        <Select value={floorId} onValueChange={setFloorId} required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select floor" />
          </SelectTrigger>
          <SelectContent>
            {floors.map((floor) => (
              <SelectItem key={floor.id} value={floor.id}>
                {floor.name} (Floor {floor.floorNumber})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description (Optional)</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Any additional details about this room..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Creating..." : "Create Room"}
      </Button>
    </form>
  );
}
