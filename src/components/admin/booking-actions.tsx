"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  approveBooking,
  rejectBooking,
  checkIn,
  checkOut,
} from "@/lib/actions/booking";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Check, X, LogIn, LogOut, MoreHorizontal } from "lucide-react";

interface BookingActionsProps {
  hostelId: string;
  bookingId: string;
  status: string;
}

export function BookingActions({
  hostelId,
  bookingId,
  status,
}: BookingActionsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleAction(
    action: (hostelId: string, bookingId: string) => Promise<{ error?: string; success?: boolean }>
  ) {
    setLoading(true);
    try {
      const result = await action(hostelId, bookingId);
      if (result?.error) {
        alert(result.error);
      }
      router.refresh();
    } catch {
      alert("An error occurred");
    } finally {
      setLoading(false);
    }
  }

  if (status === "CHECKED_OUT" || status === "CANCELLED" || status === "REJECTED") {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" disabled={loading}>
          <MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Actions</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {status === "PENDING" && (
          <>
            <DropdownMenuItem
              onClick={() => handleAction(approveBooking)}
              className="text-green-600"
            >
              <Check className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => handleAction(rejectBooking)}
              className="text-red-600"
            >
              <X className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </>
        )}
        {status === "APPROVED" && (
          <DropdownMenuItem
            onClick={() => handleAction(checkIn)}
            className="text-blue-600"
          >
            <LogIn className="mr-2 h-4 w-4" />
            Check In
          </DropdownMenuItem>
        )}
        {status === "CHECKED_IN" && (
          <DropdownMenuItem
            onClick={() => handleAction(checkOut)}
            className="text-orange-600"
          >
            <LogOut className="mr-2 h-4 w-4" />
            Check Out
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
