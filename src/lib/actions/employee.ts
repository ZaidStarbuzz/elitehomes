"use server";

import { db } from "@/lib/db";
import { requireHostelAccess } from "@/lib/auth";
import { createEmployeeSchema } from "@/lib/validations/employee";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export async function createEmployee(hostelId: string, formData: FormData) {
  await requireHostelAccess(hostelId);

  const rawData = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    phone: (formData.get("phone") as string) || undefined,
    employeeRole: formData.get("employeeRole") as string,
    salary: formData.get("salary") as string,
    department: (formData.get("department") as string) || undefined,
  };

  const parsed = createEmployeeSchema.safeParse(rawData);
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  // Check if user already exists
  let user = await db.user.findUnique({
    where: { email: parsed.data.email },
  });

  if (!user) {
    // Create a Supabase auth account for the employee
    const supabase = await createClient();
    const { data: authData, error: authError } =
      await supabase.auth.admin.createUser({
        email: parsed.data.email,
        password: "TempPassword123!", // Temporary, should be changed
        email_confirm: true,
        user_metadata: { name: parsed.data.name },
      });

    if (authError) {
      // If admin API fails, create user record without supabase account
      // The employee can register later
      user = await db.user.create({
        data: {
          supabaseId: `pending_${Date.now()}`,
          email: parsed.data.email,
          name: parsed.data.name,
          phone: parsed.data.phone,
          role: "STAFF",
        },
      });
    } else if (authData.user) {
      user = await db.user.create({
        data: {
          supabaseId: authData.user.id,
          email: parsed.data.email,
          name: parsed.data.name,
          phone: parsed.data.phone,
          role: "STAFF",
        },
      });
    }
  }

  if (!user) {
    return { error: "Failed to create employee user" };
  }

  // Create employee record
  await db.employee.create({
    data: {
      employeeRole: parsed.data.employeeRole as
        | "WARDEN"
        | "CLEANING_STAFF"
        | "COOK"
        | "MAINTENANCE_STAFF"
        | "SECURITY"
        | "RECEPTIONIST"
        | "MANAGER"
        | "OTHER",
      salary: parsed.data.salary,
      department: parsed.data.department,
      hostelId,
      userId: user.id,
    },
  });

  // Add as hostel member
  await db.hostelMember.upsert({
    where: {
      hostelId_userId: { hostelId, userId: user.id },
    },
    create: {
      hostelId,
      userId: user.id,
      role: "STAFF",
    },
    update: {
      isActive: true,
      role: "STAFF",
    },
  });

  revalidatePath(`/admin/hostels/${hostelId}/employees`);
  return { success: true };
}

export async function updateEmployee(
  hostelId: string,
  employeeId: string,
  formData: FormData
) {
  await requireHostelAccess(hostelId);

  const data: Record<string, unknown> = {};
  const salary = formData.get("salary") as string;
  const department = formData.get("department") as string;
  const isActive = formData.get("isActive") as string;

  if (salary) data.salary = parseFloat(salary);
  if (department) data.department = department;
  if (isActive !== null) data.isActive = isActive === "true";

  await db.employee.update({
    where: { id: employeeId },
    data,
  });

  revalidatePath(`/admin/hostels/${hostelId}/employees`);
  return { success: true };
}

export async function deleteEmployee(hostelId: string, employeeId: string) {
  await requireHostelAccess(hostelId);

  await db.employee.update({
    where: { id: employeeId },
    data: { isActive: false },
  });

  revalidatePath(`/admin/hostels/${hostelId}/employees`);
  return { success: true };
}
