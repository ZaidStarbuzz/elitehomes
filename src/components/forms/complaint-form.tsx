"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { createComplaint } from "@/lib/actions/complaint";
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

type ComplaintFormState = {
  error?: string;
  success?: boolean;
} | null;

interface ComplaintFormProps {
  hostels: Array<{ id: string; name: string }>;
  onSuccess?: () => void;
}

const CATEGORIES = [
  { value: "MAINTENANCE", label: "Maintenance" },
  { value: "CLEANLINESS", label: "Cleanliness" },
  { value: "NOISE", label: "Noise" },
  { value: "SECURITY", label: "Security" },
  { value: "FOOD", label: "Food" },
  { value: "PLUMBING", label: "Plumbing" },
  { value: "ELECTRICAL", label: "Electrical" },
  { value: "OTHER", label: "Other" },
];

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
];

async function complaintAction(
  _prevState: ComplaintFormState,
  formData: FormData
): Promise<ComplaintFormState> {
  const result = await createComplaint(formData);
  if (result?.error) {
    return { error: result.error };
  }
  return { success: true };
}

export function ComplaintForm({ hostels, onSuccess }: ComplaintFormProps) {
  const [state, formAction, isPending] = useActionState(complaintAction, null);
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
          Complaint submitted successfully!
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="hostelId">Hostel</Label>
        <Select name="hostelId" required>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select hostel" />
          </SelectTrigger>
          <SelectContent>
            {hostels.map((hostel) => (
              <SelectItem key={hostel.id} value={hostel.id}>
                {hostel.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          name="title"
          placeholder="Brief description of the issue"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Provide detailed information about your complaint..."
          rows={4}
          required
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select name="category" required>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="priority">Priority</Label>
          <Select name="priority" defaultValue="MEDIUM">
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select priority" />
            </SelectTrigger>
            <SelectContent>
              {PRIORITIES.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Submitting..." : "Submit Complaint"}
      </Button>
    </form>
  );
}
