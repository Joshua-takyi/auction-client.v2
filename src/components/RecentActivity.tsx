"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ActivityItem {
    id: string;
    user: {
        name: string;
        avatar?: string;
    };
    action: string;
    target: string;
    timestamp: string;
    amount?: string;
}

interface RecentActivityProps {
    activities: ActivityItem[];
    className?: string;
}

export function RecentActivity({ activities, className }: RecentActivityProps) {
    return (
        <div className={cn("space-y-6", className)}>
            {activities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-4">
                    <Avatar className="h-9 w-9 border border-border/50">
                        <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                        <AvatarFallback className="bg-primary/10 text-primary text-xs">
                            {activity.user.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                        <p className="text-sm font-medium leading-none">
                            <span className="font-bold">{activity.user.name}</span>
                            <span className="text-muted-foreground mx-1">{activity.action}</span>
                            <span className="font-semibold italic">{activity.target}</span>
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-muted-foreground">
                                {activity.timestamp}
                            </p>
                            {activity.amount && (
                                <>
                                    <span className="text-[4px] text-muted-foreground">•</span>
                                    <p className="text-xs font-mono font-bold text-primary">
                                        {activity.amount}
                                    </p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            ))}
            {activities.length === 0 && (
                <p className="text-sm text-muted-foreground italic text-center py-4">
                    No recent activity to show.
                </p>
            )}
        </div>
    );
}
