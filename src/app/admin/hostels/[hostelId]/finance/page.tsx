import { requireHostelAccess } from "@/lib/auth";
import { db } from "@/lib/db";
import { format } from "date-fns";
import { IndianRupee, TrendingUp, TrendingDown, Plus } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
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
import { TransactionForm } from "@/components/forms/transaction-form";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export default async function FinancePage({
  params,
}: {
  params: Promise<{ hostelId: string }>;
}) {
  const { hostelId } = await params;
  await requireHostelAccess(hostelId);

  const [transactions, incomeTotal, expenseTotal] = await Promise.all([
    db.transaction.findMany({
      where: { hostelId },
      include: {
        booking: {
          select: { bookingNumber: true },
        },
      },
      orderBy: { date: "desc" },
      take: 50,
    }),
    db.transaction.aggregate({
      where: { hostelId, type: "INCOME", paymentStatus: "COMPLETED" },
      _sum: { amount: true },
    }),
    db.transaction.aggregate({
      where: { hostelId, type: "EXPENSE", paymentStatus: "COMPLETED" },
      _sum: { amount: true },
    }),
  ]);

  const totalIncome = Number(incomeTotal._sum.amount || 0);
  const totalExpenses = Number(expenseTotal._sum.amount || 0);
  const netProfit = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <IndianRupee className="h-8 w-8 text-primary" />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Finance</h1>
            <p className="text-muted-foreground">
              Track income, expenses, and financial overview
            </p>
          </div>
        </div>

        <Dialog>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Transaction
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Add New Transaction</DialogTitle>
            </DialogHeader>
            <TransactionForm hostelId={hostelId} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(totalIncome)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Expenses
            </CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {formatCurrency(totalExpenses)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <IndianRupee className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div
              className={`text-2xl font-bold ${
                netProfit >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {formatCurrency(netProfit)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Table */}
      {transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <IndianRupee className="h-12 w-12 text-muted-foreground/50" />
          <h3 className="mt-4 text-lg font-semibold">No transactions yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Add your first transaction to start tracking finances.
          </p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Payment Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow
                  key={transaction.id}
                  className={
                    transaction.type === "INCOME"
                      ? "bg-green-50/50"
                      : "bg-red-50/50"
                  }
                >
                  <TableCell>
                    {format(new Date(transaction.date), "MMM dd, yyyy")}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        transaction.type === "INCOME"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }
                    >
                      {transaction.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {transaction.category.replace("_", " ")}
                    </span>
                  </TableCell>
                  <TableCell>
                    <p className="max-w-[250px] truncate">
                      {transaction.description || "-"}
                    </p>
                    {transaction.booking && (
                      <p className="text-xs text-muted-foreground">
                        Booking: {transaction.booking.bookingNumber}
                      </p>
                    )}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(Number(transaction.amount))}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        transaction.paymentStatus === "COMPLETED"
                          ? "bg-green-100 text-green-800"
                          : transaction.paymentStatus === "PENDING"
                          ? "bg-yellow-100 text-yellow-800"
                          : transaction.paymentStatus === "FAILED"
                          ? "bg-red-100 text-red-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {transaction.paymentStatus}
                    </Badge>
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
