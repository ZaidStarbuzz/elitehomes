"use client";

import {
  BedDouble,
  Users,
  CalendarCheck,
  MessageSquareWarning,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  Clock,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import type { DashboardStats } from "@/types";

interface StatsCardsProps {
  stats: DashboardStats;
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

function getOccupancyColor(rate: number): string {
  if (rate >= 90) return "text-red-600";
  if (rate >= 70) return "text-yellow-600";
  if (rate >= 50) return "text-green-600";
  return "text-blue-600";
}

function getOccupancyBadgeVariant(
  rate: number
): "default" | "secondary" | "destructive" | "outline" {
  if (rate >= 90) return "destructive";
  if (rate >= 70) return "default";
  return "secondary";
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Beds Overview */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Beds Overview
          </CardTitle>
          <BedDouble className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBeds}</div>
          <p className="text-xs text-muted-foreground">Total Beds</p>
          <div className="mt-3 flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
              <span className="text-xs font-medium">{stats.occupiedBeds}</span>
              <span className="text-xs text-muted-foreground">Occupied</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
              <span className="text-xs font-medium">
                {stats.availableBeds}
              </span>
              <span className="text-xs text-muted-foreground">Available</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Occupancy Rate */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Occupancy Rate
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span
              className={`text-2xl font-bold ${getOccupancyColor(stats.occupancyRate)}`}
            >
              {stats.occupancyRate}%
            </span>
            <Badge variant={getOccupancyBadgeVariant(stats.occupancyRate)}>
              {stats.occupancyRate >= 90
                ? "Near Full"
                : stats.occupancyRate >= 70
                  ? "Good"
                  : stats.occupancyRate >= 50
                    ? "Moderate"
                    : "Low"}
            </Badge>
          </div>
          <div className="mt-3">
            <Progress value={stats.occupancyRate} className="h-2" />
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            {stats.occupiedBeds} of {stats.totalBeds} beds occupied
          </p>
        </CardContent>
      </Card>

      {/* Bookings */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Bookings
          </CardTitle>
          <CalendarCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeBookings}</div>
          <p className="text-xs text-muted-foreground">Active Bookings</p>
          {stats.pendingBookings > 0 && (
            <div className="mt-3 flex items-center gap-2">
              <Clock className="h-3.5 w-3.5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-600">
                {stats.pendingBookings} pending
              </span>
              <Badge variant="outline" className="ml-auto text-xs">
                Needs Action
              </Badge>
            </div>
          )}
          {stats.pendingBookings === 0 && (
            <p className="mt-3 text-xs text-muted-foreground">
              No pending bookings
            </p>
          )}
        </CardContent>
      </Card>

      {/* Complaints */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Open Complaints
          </CardTitle>
          <MessageSquareWarning className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold">{stats.openComplaints}</span>
            {stats.openComplaints > 0 && (
              <Badge variant="destructive" className="text-xs">
                <AlertCircle className="mr-1 h-3 w-3" />
                Active
              </Badge>
            )}
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {stats.openComplaints === 0
              ? "All complaints resolved"
              : `${stats.openComplaints} complaint${stats.openComplaints > 1 ? "s" : ""} need attention`}
          </p>
        </CardContent>
      </Card>

      {/* Monthly Revenue */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Revenue
          </CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            {formatCurrency(stats.monthlyRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">Income this month</p>
        </CardContent>
      </Card>

      {/* Monthly Expenses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Monthly Expenses
          </CardTitle>
          <IndianRupee className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            {formatCurrency(stats.monthlyExpenses)}
          </div>
          <p className="text-xs text-muted-foreground">Expenses this month</p>
          {stats.monthlyRevenue > 0 && (
            <div className="mt-3">
              <p className="text-xs font-medium">
                Net:{" "}
                <span
                  className={
                    stats.monthlyRevenue - stats.monthlyExpenses >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {formatCurrency(
                    stats.monthlyRevenue - stats.monthlyExpenses
                  )}
                </span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Total Guests */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Guests
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalGuests}</div>
          <p className="text-xs text-muted-foreground">
            Currently checked in
          </p>
        </CardContent>
      </Card>

      {/* Employees */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Employees
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalEmployees}</div>
          <p className="text-xs text-muted-foreground">Active staff members</p>
        </CardContent>
      </Card>
    </div>
  );
}
