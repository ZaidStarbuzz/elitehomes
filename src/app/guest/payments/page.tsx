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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { CreditCard } from "lucide-react";

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

const PAYMENT_STATUS_COLORS: Record<string, string> = {
  COMPLETED: "bg-green-100 text-green-800",
  PENDING: "bg-yellow-100 text-yellow-800",
  FAILED: "bg-red-100 text-red-800",
  REFUNDED: "bg-blue-100 text-blue-800",
};

export default async function GuestPaymentsPage() {
  const session = await requireAuth();

  const transactions = await db.transaction.findMany({
    where: {
      booking: { guestId: session.id },
    },
    include: {
      hostel: { select: { name: true } },
      booking: { select: { bookingNumber: true } },
    },
    orderBy: { date: "desc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Payment History</h1>
        <p className="text-muted-foreground">
          View all your payment transactions.
        </p>
      </div>

      {transactions.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <CreditCard className="mx-auto size-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold">No Payments</h3>
            <p className="text-sm text-muted-foreground mt-1">
              You don&apos;t have any payment records yet.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Transactions</CardTitle>
            <CardDescription>
              All payments associated with your bookings.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Hostel</TableHead>
                  <TableHead>Booking #</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell>
                      {format(new Date(transaction.date), "MMM dd, yyyy")}
                    </TableCell>
                    <TableCell>{transaction.hostel.name}</TableCell>
                    <TableCell>
                      {transaction.booking?.bookingNumber || "-"}
                    </TableCell>
                    <TableCell>
                      {transaction.category.replace(/_/g, " ")}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatCurrency(Number(transaction.amount))}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          PAYMENT_STATUS_COLORS[transaction.paymentStatus] || ""
                        }
                        variant="secondary"
                      >
                        {transaction.paymentStatus}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
