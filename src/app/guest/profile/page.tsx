import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProfileForm } from "@/components/forms/profile-form";

export default async function GuestProfilePage() {
  const session = await requireAuth();

  const user = await db.user.findUnique({
    where: { id: session.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      gender: true,
      dateOfBirth: true,
      address: true,
      city: true,
      state: true,
      country: true,
      zipCode: true,
      idType: true,
      idNumber: true,
    },
  });

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">User profile not found.</p>
      </div>
    );
  }

  const profile = {
    id: user.id,
    name: user.name,
    email: user.email,
    phone: user.phone,
    gender: user.gender,
    dateOfBirth: user.dateOfBirth ? user.dateOfBirth.toISOString() : null,
    address: user.address,
    city: user.city,
    state: user.state,
    country: user.country,
    zipCode: user.zipCode,
    idType: user.idType,
    idNumber: user.idNumber,
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
        <p className="text-muted-foreground">
          Manage your personal information and preferences.
        </p>
      </div>

      <ProfileForm profile={profile} />
    </div>
  );
}
