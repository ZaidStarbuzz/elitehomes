import { requireRole } from "@/lib/auth";
import { HostelForm } from "@/components/forms/hostel-form";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function NewHostelPage() {
  await requireRole(["HOSTEL_ADMIN", "SUPER_ADMIN"]);

  return (
    <div className="flex-1 space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/admin/hostels">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Create New Hostel
          </h1>
          <p className="text-muted-foreground">
            Set up a new hostel with all the essential details
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="mx-auto max-w-2xl">
        <HostelForm />
      </div>
    </div>
  );
}
