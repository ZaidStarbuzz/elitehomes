"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEmployee } from "@/lib/actions/employee";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const EMPLOYEE_ROLES = [
  { value: "WARDEN", label: "Warden" },
  { value: "CLEANING_STAFF", label: "Cleaning Staff" },
  { value: "COOK", label: "Cook" },
  { value: "MAINTENANCE_STAFF", label: "Maintenance Staff" },
  { value: "SECURITY", label: "Security" },
  { value: "RECEPTIONIST", label: "Receptionist" },
  { value: "MANAGER", label: "Manager" },
  { value: "OTHER", label: "Other" },
];

interface EmployeeFormProps {
  hostelId: string;
}

export function EmployeeForm({ hostelId }: EmployeeFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);

    try {
      const result = await createEmployee(hostelId, formData);
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
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          name="name"
          placeholder="Full name"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="employee@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Phone</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+91 XXXXX XXXXX"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="employeeRole">Role</Label>
        <Select name="employeeRole" required>
          <SelectTrigger>
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {EMPLOYEE_ROLES.map((role) => (
              <SelectItem key={role.value} value={role.value}>
                {role.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="salary">Salary (INR)</Label>
        <Input
          id="salary"
          name="salary"
          type="number"
          placeholder="0"
          min="0"
          step="100"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="department">Department</Label>
        <Input
          id="department"
          name="department"
          placeholder="e.g., Housekeeping, Kitchen"
        />
      </div>

      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? "Adding..." : "Add Employee"}
      </Button>
    </form>
  );
}
