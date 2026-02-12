"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DashboardStats } from "@/types";

interface OccupancyChartProps {
  stats: DashboardStats;
}

export function OccupancyChart({ stats }: OccupancyChartProps) {
  const occupiedPercent = stats.totalBeds > 0
    ? (stats.occupiedBeds / stats.totalBeds) * 100
    : 0;
  const availablePercent = stats.totalBeds > 0
    ? (stats.availableBeds / stats.totalBeds) * 100
    : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Occupancy Overview</CardTitle>
        <CardDescription>
          Visual breakdown of bed occupancy across your hostel
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Horizontal Bar Chart */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Bed Occupancy</span>
              <span className="text-muted-foreground">
                {stats.occupiedBeds} / {stats.totalBeds} beds
              </span>
            </div>

            {/* Bar */}
            <div className="relative h-8 w-full overflow-hidden rounded-full bg-muted">
              {stats.totalBeds > 0 ? (
                <>
                  <div
                    className="absolute left-0 top-0 h-full rounded-l-full bg-red-500 transition-all duration-500"
                    style={{ width: `${occupiedPercent}%` }}
                  />
                  <div
                    className="absolute top-0 h-full bg-green-500 transition-all duration-500"
                    style={{
                      left: `${occupiedPercent}%`,
                      width: `${availablePercent}%`,
                      borderTopRightRadius: "9999px",
                      borderBottomRightRadius: "9999px",
                    }}
                  />
                  {/* Percentage label inside bar */}
                  {occupiedPercent > 15 && (
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-white">
                      {Math.round(occupiedPercent)}%
                    </span>
                  )}
                </>
              ) : (
                <div className="flex h-full items-center justify-center">
                  <span className="text-xs text-muted-foreground">
                    No beds configured
                  </span>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm text-muted-foreground">
                  Occupied ({stats.occupiedBeds})
                </span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm text-muted-foreground">
                  Available ({stats.availableBeds})
                </span>
              </div>
            </div>
          </div>

          {/* Room Stats Row */}
          <div className="grid grid-cols-2 gap-4 border-t pt-4 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalRooms}</p>
              <p className="text-xs text-muted-foreground">Total Rooms</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{stats.totalBeds}</p>
              <p className="text-xs text-muted-foreground">Total Beds</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {stats.occupiedBeds}
              </p>
              <p className="text-xs text-muted-foreground">Occupied</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {stats.availableBeds}
              </p>
              <p className="text-xs text-muted-foreground">Available</p>
            </div>
          </div>

          {/* Pie-like Visual */}
          {stats.totalBeds > 0 && (
            <div className="flex items-center justify-center border-t pt-4">
              <div className="relative h-32 w-32">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  {/* Background circle */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="20"
                    className="text-green-200"
                  />
                  {/* Occupied arc */}
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="20"
                    strokeDasharray={`${occupiedPercent * 2.51} ${(100 - occupiedPercent) * 2.51}`}
                    className="text-red-500 transition-all duration-700"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-bold">
                    {Math.round(occupiedPercent)}%
                  </span>
                  <span className="text-xs text-muted-foreground">
                    Occupied
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
