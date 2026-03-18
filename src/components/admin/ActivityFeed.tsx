import { ReactNode } from "react";
import { motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

export interface Activity {
  id: string;
  icon: ReactNode;
  iconColor: string;
  title: string;
  description: string;
  timestamp: Date;
  link?: string;
}

interface ActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
}

const ActivityFeed = ({ activities, maxItems = 5 }: ActivityFeedProps) => {
  const displayActivities = activities.slice(0, maxItems);

  return (
    <div className="space-y-1">
      {displayActivities.map((activity, index) => (
        <motion.div
          key={activity.id}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.05 }}
          className={cn(
            "flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors",
            activity.link && "cursor-pointer"
          )}
        >
          {/* Icon */}
          <div
            className={cn(
              "flex-shrink-0 p-2 rounded-lg",
              activity.iconColor
            )}
          >
            {activity.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{activity.title}</p>
            <p className="text-xs text-muted-foreground truncate">
              {activity.description}
            </p>
          </div>

          {/* Timestamp */}
          <span className="text-xs text-muted-foreground flex-shrink-0">
            {formatDistanceToNow(activity.timestamp, { addSuffix: true })}
          </span>
        </motion.div>
      ))}

      {activities.length === 0 && (
        <div className="text-center py-8 text-muted-foreground text-sm">
          No recent activity
        </div>
      )}
    </div>
  );
};

export default ActivityFeed;
