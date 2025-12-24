import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
    title: string;
    value: string | number;
    description?: string;
    icon: LucideIcon;
    trend?: {
        value: number;
        isPositive: boolean;
    };
    className?: string;
}

export function StatsCard({
    title,
    value,
    description,
    icon: Icon,
    trend,
    className,
}: StatsCardProps) {
    return (
        <Card className={cn("overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-border hover:shadow-lg", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                    {title}
                </CardTitle>
                <div className="rounded-full bg-primary/10 p-2 text-primary">
                    <Icon className="h-4 w-4" />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold tracking-tight">{value}</div>
                {(description || trend) && (
                    <div className="mt-1 flex items-center gap-2">
                        {trend && (
                            <span
                                className={cn(
                                    "text-xs font-medium",
                                    trend.isPositive ? "text-green-600" : "text-destructive"
                                )}
                            >
                                {trend.isPositive ? "+" : "-"}{Math.abs(trend.value)}%
                            </span>
                        )}
                        {description && (
                            <p className="text-xs text-muted-foreground">{description}</p>
                        )}
                    </div>
                )}
            </CardContent>
            {/* Subtle decorative element */}
            <div className="absolute -right-4 -top-4 size-24 rounded-full bg-primary/5 blur-3xl" />
        </Card>
    );
}
