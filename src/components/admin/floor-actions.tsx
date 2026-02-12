"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deleteFloor } from "@/lib/actions/room";
import { FloorForm } from "@/components/forms/floor-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus, Trash2 } from "lucide-react";

interface FloorActionsProps {
  hostelId: string;
}

export function AddFloorButton({ hostelId }: FloorActionsProps) {
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
          Add Floor
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Floor</DialogTitle>
        </DialogHeader>
        <FloorForm hostelId={hostelId} onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}

interface DeleteFloorButtonProps {
  hostelId: string;
  floorId: string;
}

export function DeleteFloorButton({
  hostelId,
  floorId,
}: DeleteFloorButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Are you sure you want to delete this floor?")) return;

    setLoading(true);
    try {
      const result = await deleteFloor(hostelId, floorId);
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

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleDelete}
      disabled={loading}
      className="text-red-500 hover:bg-red-50 hover:text-red-600"
    >
      <Trash2 className="h-4 w-4" />
      <span className="sr-only">Delete floor</span>
    </Button>
  );
}
