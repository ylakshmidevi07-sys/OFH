import { ReactNode } from "react";
import { motion } from "framer-motion";
import { ChevronRight, MoreHorizontal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

interface DataField {
  label: string;
  value: string | number | ReactNode;
  highlight?: boolean;
}

interface Action {
  label: string;
  icon?: ReactNode;
  onClick: () => void;
  destructive?: boolean;
}

export interface MobileDataCardProps {
  title: string;
  subtitle?: string;
  image?: string;
  avatar?: ReactNode;
  badge?: {
    label: string;
    variant?: "default" | "secondary" | "destructive" | "outline";
    className?: string;
  };
  fields: DataField[];
  actions?: Action[];
  onClick?: () => void;
  index?: number;
  selectable?: boolean;
  selected?: boolean;
  onSelect?: () => void;
}

const MobileDataCard = ({
  title,
  subtitle,
  image,
  avatar,
  badge,
  fields,
  actions,
  onClick,
  index = 0,
  selectable = false,
  selected = false,
  onSelect,
}: MobileDataCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className={cn(
        "overflow-hidden hover:shadow-md transition-all active:scale-[0.99]",
        selected && "ring-2 ring-primary bg-primary/5"
      )}>
        <CardContent className="p-0">
          <div className="flex items-stretch">
            {/* Checkbox for selection */}
            {selectable && (
              <div className="flex-shrink-0 pl-3 flex items-center">
                <Checkbox
                  checked={selected}
                  onCheckedChange={onSelect}
                  onClick={(e) => e.stopPropagation()}
                  aria-label={`Select ${title}`}
                />
              </div>
            )}

            {/* Image or Avatar */}
            {(image || avatar) && (
              <div className="flex-shrink-0 p-3 flex items-center">
                {image ? (
                  <img
                    src={image}
                    alt={title}
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                ) : (
                  avatar
                )}
              </div>
            )}

            {/* Main Content */}
            <div className="flex-1 p-4 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold truncate">{title}</h3>
                    {badge && (
                      <Badge
                        variant={badge.variant || "secondary"}
                        className={cn("flex-shrink-0 text-xs", badge.className)}
                      >
                        {badge.label}
                      </Badge>
                    )}
                  </div>
                  {subtitle && (
                    <p className="text-sm text-muted-foreground truncate mt-0.5">
                      {subtitle}
                    </p>
                  )}
                </div>

                {/* Actions Dropdown */}
                {actions && actions.length > 0 && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 flex-shrink-0"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="bg-popover z-50">
                      {actions.map((action, i) => (
                        <DropdownMenuItem
                          key={i}
                          onClick={action.onClick}
                          className={cn(action.destructive && "text-destructive")}
                        >
                          {action.icon}
                          {action.label}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              {/* Fields Grid */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                {fields.map((field, i) => (
                  <div key={i} className="min-w-0">
                    <span className="text-xs text-muted-foreground">
                      {field.label}
                    </span>
                    <p
                      className={cn(
                        "text-sm truncate",
                        field.highlight && "font-semibold text-primary"
                      )}
                    >
                      {field.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Click Arrow */}
            {onClick && (
              <button
                onClick={onClick}
                className="flex-shrink-0 px-3 flex items-center hover:bg-muted/50 transition-colors"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default MobileDataCard;
