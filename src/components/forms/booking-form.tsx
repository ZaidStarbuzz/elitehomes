"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createBooking } from "@/lib/actions/booking";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type BookingFormState = {
  error?: string;
  success?: boolean;
  bookingId?: string;
} | null;

interface BookingFormProps {
  hostelId: string;
  beds: Array<{
    id: string;
    bedNumber: string;
    monthlyRent: number | null;
    room: { roomNumber: string };
  }>;
  onSuccess?: () => void;
}

async function bookingAction(
  _prevState: BookingFormState,
  formData: FormData
): Promise<BookingFormState> {
  const result = await createBooking(formData);
  if (result?.error) {
    return { error: result.error };
  }
  return { success: true, bookingId: result?.bookingId };
}

export function BookingForm({ hostelId, beds, onSuccess }: BookingFormProps) {
  const [state, formAction, isPending] = useActionState(bookingAction, null);
  const router = useRouter();

  useEffect(() => {
    if (state?.success) {
      router.refresh();
      onSuccess?.();
    }
  }, [state?.success, router, onSuccess]);

  return (
    <form action={formAction} className="space-y-4">
      {state?.error && (
        <div className="rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {state.error}
        </div>
      )}

      {state?.success && (
        <div className="rounded-md bg-green-50 px-4 py-3 text-sm text-green-800">
          Booking request submitted successfully!
        </div>
      )}

      <input type="hidden" name="hostelId" value={hostelId} />

      <div className="space-y-2">
        <Label htmlFor="bedId">Select Bed</Label>
        <Select name="bedId" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Choose a bed" />
          </SelectTrigger>
          <SelectContent>
            {beds.map((bed) => (
              <SelectItem key={bed.id} value={bed.id}>
                Room {bed.room.roomNumber} - Bed {bed.bedNumber}
                {bed.monthlyRent != null &&
                  ` (${new Intl.NumberFormat("en-IN", {
                    style: "currency",
                    currency: "INR",
                  }).format(Number(bed.monthlyRent))}/mo)`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkInDate">Check-in Date</Label>
        <Input
          id="checkInDate"
          name="checkInDate"
          type="date"
          required
          min={new Date().toISOString().split("T")[0]}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="checkOutDate">Check-out Date (Optional)</Label>
        <Input
          id="checkOutDate"
          name="checkOutDate"
          type="date"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Notes (Optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          placeholder="Any special requirements or notes..."
          rows={3}
        />
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Booking Request"}
      </Button>
    </form>
  );
}
