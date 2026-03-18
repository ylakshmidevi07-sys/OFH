import { motion, AnimatePresence } from "framer-motion";
import { X, Trash2, Download, Tag, Package, Truck, CheckCircle, XCircle, Archive } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export interface BulkAction {
  id: string;
  label: string;
  icon: React.ReactNode;
  variant?: "default" | "destructive";
  onClick: () => void;
}

interface BulkActionsToolbarProps {
  selectedCount: number;
  totalCount: number;
  onClearSelection: () => void;
  onSelectAll: () => void;
  actions: BulkAction[];
  className?: string;
}

const BulkActionsToolbar = ({
  selectedCount,
  totalCount,
  onClearSelection,
  onSelectAll,
  actions,
  className,
}: BulkActionsToolbarProps) => {
  const isVisible = selectedCount > 0;
  const allSelected = selectedCount === totalCount && totalCount > 0;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={cn(
            "flex items-center justify-between gap-4 p-3 bg-primary/10 border border-primary/20 rounded-lg mb-4",
            className
          )}
        >
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={onClearSelection}
            >
              <X className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {selectedCount} of {totalCount} selected
            </span>
            {!allSelected && (
              <Button
                variant="link"
                size="sm"
                className="text-primary h-auto p-0"
                onClick={onSelectAll}
              >
                Select all {totalCount}
              </Button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Primary actions shown as buttons */}
            {actions.slice(0, 3).map((action) => (
              <Button
                key={action.id}
                variant={action.variant === "destructive" ? "destructive" : "secondary"}
                size="sm"
                onClick={action.onClick}
                className="gap-2"
              >
                {action.icon}
                <span className="hidden sm:inline">{action.label}</span>
              </Button>
            ))}

            {/* Additional actions in dropdown */}
            {actions.length > 3 && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    More actions
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-popover">
                  {actions.slice(3).map((action, index) => (
                    <div key={action.id}>
                      {index > 0 && action.variant === "destructive" && (
                        <DropdownMenuSeparator />
                      )}
                      <DropdownMenuItem
                        onClick={action.onClick}
                        className={cn(
                          "gap-2 cursor-pointer",
                          action.variant === "destructive" && "text-destructive focus:text-destructive"
                        )}
                      >
                        {action.icon}
                        {action.label}
                      </DropdownMenuItem>
                    </div>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Pre-built action sets for common use cases
export const getProductBulkActions = (
  onAction: (action: string, ids: string[]) => void,
  selectedIds: string[]
): BulkAction[] => [
  {
    id: "export",
    label: "Export",
    icon: <Download className="h-4 w-4" />,
    onClick: () => onAction("export", selectedIds),
  },
  {
    id: "update-stock",
    label: "Update Stock",
    icon: <Package className="h-4 w-4" />,
    onClick: () => onAction("update-stock", selectedIds),
  },
  {
    id: "add-tag",
    label: "Add Tag",
    icon: <Tag className="h-4 w-4" />,
    onClick: () => onAction("add-tag", selectedIds),
  },
  {
    id: "archive",
    label: "Archive",
    icon: <Archive className="h-4 w-4" />,
    onClick: () => onAction("archive", selectedIds),
  },
  {
    id: "delete",
    label: "Delete",
    icon: <Trash2 className="h-4 w-4" />,
    variant: "destructive",
    onClick: () => onAction("delete", selectedIds),
  },
];

export const getOrderBulkActions = (
  onAction: (action: string, ids: string[]) => void,
  selectedIds: string[]
): BulkAction[] => [
  {
    id: "export",
    label: "Export",
    icon: <Download className="h-4 w-4" />,
    onClick: () => onAction("export", selectedIds),
  },
  {
    id: "mark-shipped",
    label: "Mark Shipped",
    icon: <Truck className="h-4 w-4" />,
    onClick: () => onAction("mark-shipped", selectedIds),
  },
  {
    id: "mark-completed",
    label: "Mark Completed",
    icon: <CheckCircle className="h-4 w-4" />,
    onClick: () => onAction("mark-completed", selectedIds),
  },
  {
    id: "mark-cancelled",
    label: "Cancel Orders",
    icon: <XCircle className="h-4 w-4" />,
    variant: "destructive",
    onClick: () => onAction("mark-cancelled", selectedIds),
  },
];

export default BulkActionsToolbar;
