import { ReactNode } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileStat {
  label: string;
  value: string | number;
  change?: number;
  icon: ReactNode;
  iconColor: string;
}

interface MobileStatsGridProps {
  stats: MobileStat[];
}

const MobileStatsGrid = ({ stats }: MobileStatsGridProps) => {
  return (
    <div className="grid grid-cols-2 gap-3">
      {stats.map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-card border rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-center justify-between mb-2">
            <div className={cn("p-2 rounded-lg", stat.iconColor)}>
              {stat.icon}
            </div>
          {stat.change !== undefined && (
              <div
                className={cn(
                  "flex items-center gap-0.5 text-xs font-medium",
                  stat.change > 0 ? "text-primary" : stat.change < 0 ? "text-destructive" : "text-muted-foreground"
                )}
              >
                {stat.change > 0 ? (
                  <TrendingUp className="h-3 w-3" />
                ) : stat.change < 0 ? (
                  <TrendingDown className="h-3 w-3" />
                ) : null}
                {stat.change > 0 ? "+" : ""}
                {stat.change}%
              </div>
            )}
          </div>
          <p className="text-2xl font-bold">{stat.value}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default MobileStatsGrid;
