import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import {
  COMPLAINT_PRIORITY_COLORS,
  COMPLAINT_STATUS_COLORS,
} from "@/lib/constants";
import { MessageSquareWarning } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

export default async function ComplaintsPage({
  params,
}: {
  params: Promise<{ hostelId: string }>;
}) {
  const { hostelId } = await params;
  await requireHostelAccess(hostelId);

  const complaints = await db.complaint.findMany({
    where: { hostelId },
    include: {
      author: {
        select: { id: true, name: true, email: true },
      },
      assignee: {
        select: { id: true, name: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquareWarning className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Complaints</h1>
            <p className="text-muted-foreground">
              View and manage complaints from guests
            </p>
          </div>
        </div>
      </div>

      {complaints.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <MessageSquareWarning className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No complaints</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            No complaints have been raised yet.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ticket #</TableHead>
                <TableHead>Title</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Author</TableHead>
                <TableHead>Assignee</TableHead>
                <TableHead>Created</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {complaints.map((complaint) => (
                <TableRow key={complaint.id}>
                  <TableCell className="font-medium">
                    {complaint.ticketNumber}
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[200px] truncate font-medium">
                      {complaint.title}
                    </p>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {complaint.category.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        COMPLAINT_PRIORITY_COLORS[complaint.priority] ||
                        "bg-gray-100 text-gray-800"
                      }
                      variant="secondary"
                    >
                      {complaint.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        COMPLAINT_STATUS_COLORS[complaint.status] ||
                        "bg-gray-100 text-gray-800"
                      }
                      variant="secondary"
                    >
                      {complaint.status.replace("_", " ")}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div>
                      <p className="font-medium">{complaint.author.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {complaint.author.email}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>
                    {complaint.assignee ? (
                      <span className="font-medium">
                        {complaint.assignee.name}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">Unassigned</span>
                    )}
                  </TableCell>
                  <TableCell>
                    {format(new Date(complaint.createdAt), "MMM dd, yyyy")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
