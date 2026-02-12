import { type LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: {
    value: number;
    type: "increase" | "decrease";
  };
  className?: string;
  iconClassName?: string;
}

export function StatCard({
  icon: Icon,
  label,
  value,
  change,
  className,
  iconClassName,
}: StatCardProps) {
  return (
    <Card className={cn("py-4", className)}>
      <CardContent className="flex items-center gap-4">
        <div
          className={cn(
            "flex size-12 shrink-0 items-center justify-center rounded-lg bg-primary/10",
            iconClassName
          )}
        >
          <Icon className="size-6 text-primary" />
        </div>
        <div className="flex-1 space-y-1">
          <p className="text-sm text-muted-foreground">{label}</p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-bold">{value}</p>
            {change && (
              <span
                className={cn(
                  "text-xs font-medium",
                  change.type === "increase"
                    ? "text-green-600"
                    : "text-red-600"
                )}
              >
                {change.type === "increase" ? "+" : "-"}
                {Math.abs(change.value)}%
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
