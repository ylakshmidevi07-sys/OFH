import { ReactNode } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

interface QuickAction {
  icon: ReactNode;
  label: string;
  description?: string;
  to?: string;
  onClick?: () => void;
  color: string;
  badge?: string | number;
}

interface QuickActionsProps {
  actions: QuickAction[];
  columns?: 2 | 3 | 4;
}

const QuickActions = ({ actions, columns = 4 }: QuickActionsProps) => {
  const gridCols = {
    2: "grid-cols-2",
    3: "grid-cols-3",
    4: "grid-cols-2 sm:grid-cols-4",
  };

  return (
    <div className={cn("grid gap-3", gridCols[columns])}>
      {actions.map((action, index) => {
        const content = (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "relative flex flex-col items-center justify-center p-4 rounded-xl",
              "bg-card border shadow-sm hover:shadow-md transition-all cursor-pointer",
              "min-h-[100px] text-center"
            )}
          >
            {/* Badge */}
            {action.badge !== undefined && (
              <div className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs font-bold rounded-full h-5 min-w-5 px-1.5 flex items-center justify-center">
                {action.badge}
              </div>
            )}

            {/* Icon */}
            <div
              className={cn(
                "p-2.5 rounded-xl mb-2 transition-transform",
                action.color
              )}
            >
              {action.icon}
            </div>

            {/* Label */}
            <span className="font-medium text-sm">{action.label}</span>
            {action.description && (
              <span className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                {action.description}
              </span>
            )}
          </motion.div>
        );

        if (action.to) {
          return (
            <Link key={index} to={action.to}>
              {content}
            </Link>
          );
        }

        return (
          <div key={index} onClick={action.onClick}>
            {content}
          </div>
        );
      })}
    </div>
  );
};

export default QuickActions;
