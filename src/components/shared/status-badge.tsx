import { Badge } from "@/components/ui/badge";
import {
  BOOKING_STATUS_COLORS,
  COMPLAINT_STATUS_COLORS,
  COMPLAINT_PRIORITY_COLORS,
  BED_STATUS_COLORS,
} from "@/lib/constants";
import { cn } from "@/lib/utils";

type StatusType = "booking" | "complaint" | "priority" | "bed";

interface StatusBadgeProps {
  status: string;
  type?: StatusType;
  className?: string;
}

const STATUS_COLOR_MAPS: Record<StatusType, Record<string, string>> = {
  booking: BOOKING_STATUS_COLORS,
  complaint: COMPLAINT_STATUS_COLORS,
  priority: COMPLAINT_PRIORITY_COLORS,
  bed: BED_STATUS_COLORS,
};

function getColorClasses(status: string, type?: StatusType): string {
  if (type) {
    const colorMap = STATUS_COLOR_MAPS[type];
    return colorMap[status] || "bg-gray-100 text-gray-800";
  }

  // Auto-detect by searching all maps
  for (const map of Object.values(STATUS_COLOR_MAPS)) {
    if (map[status]) {
      return map[status];
    }
  }

  return "bg-gray-100 text-gray-800";
}

function formatLabel(status: string): string {
  return status
    .replace(/_/g, " ")
    .toLowerCase()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export function StatusBadge({ status, type, className }: StatusBadgeProps) {
  const colorClasses = getColorClasses(status, type);

  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent font-medium",
        colorClasses,
        className
      )}
    >
      {formatLabel(status)}
    </Badge>
  );
}
