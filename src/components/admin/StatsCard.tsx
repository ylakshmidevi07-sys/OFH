import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  iconBg?: string;
  delay?: number;
}

const StatsCard = ({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon,
  iconBg = "bg-primary/10",
  delay = 0,
}: StatsCardProps) => {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-3xl font-bold">{value}</p>
              {change !== undefined && (
                <div className="flex items-center gap-1 text-sm">
                  {isPositive && (
                    <>
                      <TrendingUp className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">+{change}%</span>
                    </>
                  )}
                  {isNegative && (
                    <>
                      <TrendingDown className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">{change}%</span>
                    </>
                  )}
                  {!isPositive && !isNegative && <span className="text-muted-foreground">0%</span>}
                  <span className="text-muted-foreground">{changeLabel}</span>
                </div>
              )}
            </div>
            <div className={cn("p-3 rounded-xl", iconBg)}>{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default StatsCard;
