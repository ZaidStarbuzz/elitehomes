"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { RoomForm } from "@/components/forms/room-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";

interface AddRoomButtonProps {
  hostelId: string;
  floors: Array<{ id: string; name: string; floorNumber: number }>;
}

export function AddRoomButton({ hostelId, floors }: AddRoomButtonProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function handleSuccess() {
    setOpen(false);
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Room
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Room</DialogTitle>
        </DialogHeader>
        <RoomForm
          hostelId={hostelId}
          floors={floors}
          onSuccess={handleSuccess}
        />
      </DialogContent>
    </Dialog>
  );
}
