import { requireAuth } from "@/lib/auth";
import { db } from "@/lib/db";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  COMPLAINT_STATUS_COLORS,
  COMPLAINT_PRIORITY_COLORS,
} from "@/lib/constants";
import { format } from "date-fns";
import { MessageSquareWarning, Plus } from "lucide-react";
import { ComplaintForm } from "@/components/forms/complaint-form";

export default async function GuestComplaintsPage() {
  const session = await requireAuth();

  const [complaints, hostelMemberships] = await Promise.all([
    db.complaint.findMany({
      where: { authorId: session.id },
      include: {
        hostel: { select: { name: true } },
        assignee: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    }),
    db.hostelMember.findMany({
      where: { userId: session.id, isActive: true },
      include: {
        hostel: { select: { id: true, name: true } },
      },
    }),
  ]);

  const hostels = hostelMemberships.map((m) => ({
    id: m.hostel.id,
    name: m.hostel.name,
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Complaints</h1>
          <p className="text-muted-foreground">
            Submit and track your complaints.
          </p>
        </div>

        {hostels.length > 0 && (
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 size-4" />
                New Complaint
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-lg">
              <DialogHeader>
                <DialogTitle>Submit a Complaint</DialogTitle>
              </DialogHeader>
              <ComplaintForm hostels={hostels} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {complaints.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <MessageSquareWarning className="mx-auto size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Complaints</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You haven&apos;t submitted any complaints yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {complaints.map((complaint) => (
            <Card key={complaint.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
                  <span className="truncate mr-2">{complaint.title}</span>
                  <Badge
                    className={
                      COMPLAINT_STATUS_COLORS[complaint.status] || ""
                    }
                    variant="secondary"
                  >
                    {complaint.status.replace("_", " ")}
                  </Badge>
                </CardTitle>
                <CardDescription>{complaint.ticketNumber}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Hostel</span>
                  <span>{complaint.hostel.name}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Category</span>
                  <span>{complaint.category.replace("_", " ")}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority</span>
                  <Badge
                    className={
                      COMPLAINT_PRIORITY_COLORS[complaint.priority] || ""
                    }
                    variant="secondary"
                  >
                    {complaint.priority}
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Submitted</span>
                  <span>
                    {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                  </span>
                </div>

                {complaint.assignee && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assigned To</span>
                    <span>{complaint.assignee.name}</span>
                  </div>
                )}

                {complaint.resolution && (
                  <div className="border-t pt-2 mt-2">
                    <p className="text-sm text-muted-foreground mb-1">
                      Resolution
                    </p>
                    <p className="text-sm">{complaint.resolution}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
