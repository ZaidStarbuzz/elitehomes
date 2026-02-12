"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/lib/actions/transaction";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const TRANSACTION_TYPES = [
  { value: "INCOME", label: "Income" },
  { value: "EXPENSE", label: "Expense" },
];

const TRANSACTION_CATEGORIES = [
  { value: "ROOM_FEE", label: "Room Fee" },
  { value: "DEPOSIT", label: "Deposit" },
  { value: "SALARY", label: "Salary" },
  { value: "UTILITIES", label: "Utilities" },
  { value: "MAINTENANCE_COST", label: "Maintenance Cost" },
  { value: "SUPPLIES", label: "Supplies" },
  { value: "FOOD", label: "Food" },
  { value: "MISCELLANEOUS", label: "Miscellaneous" },
  { value: "REFUND", label: "Refund" },
];

interface TransactionFormProps {
  hostelId: string;
}

export function TransactionForm({ hostelId }: TransactionFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = await createTransaction(hostelId, formData);
      if (result?.error) {
        setError(result.error);
      } else {
        router.refresh();
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form action={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-md bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="type">Type</Label>
        <Select name="type" required>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Category</Label>
        <Select name="category" required>
          <SelectTrigger>
            <SelectValue placeholder="Select category" />
          </SelectTrigger>
          <SelectContent>
            {TRANSACTION_CATEGORIES.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                {category.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Amount (INR)</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          placeholder="0"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Transaction details..."
          rows={3}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="paymentMethod">Payment Method</Label>
        <Input
          id="paymentMethod"
          name="paymentMethod"
          placeholder="e.g., Cash, UPI, Bank Transfer"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          name="date"
          type="date"
          defaultValue={new Date().toISOString().split("T")[0]}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Transaction"}
      </Button>
    </form>
  );
}
