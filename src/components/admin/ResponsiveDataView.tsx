import { ReactNode } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import MobileDataCard from "./MobileDataCard";

interface Column<T> {
  key: string;
  header: string;
  render: (item: T) => ReactNode;
  hideOnMobile?: boolean;
}

interface MobileCardConfig<T> {
  title: (item: T) => string;
  subtitle?: (item: T) => string;
  image?: (item: T) => string | undefined;
  avatar?: (item: T) => ReactNode;
  badge?: (item: T) => { label: string; variant?: "default" | "secondary" | "destructive" | "outline"; className?: string } | undefined;
  fields: (item: T) => { label: string; value: string | number | ReactNode; highlight?: boolean }[];
  actions?: (item: T) => { label: string; icon?: ReactNode; onClick: () => void; destructive?: boolean }[];
  onClick?: (item: T) => void;
}

interface ResponsiveDataViewProps<T> {
  data: T[];
  columns: Column<T>[];
  mobileConfig: MobileCardConfig<T>;
  keyExtractor: (item: T) => string | number;
  emptyState?: ReactNode;
}

function ResponsiveDataView<T>({
  data,
  columns,
  mobileConfig,
  keyExtractor,
  emptyState,
}: ResponsiveDataViewProps<T>) {
  const isMobile = useIsMobile();

  if (data.length === 0 && emptyState) {
    return <>{emptyState}</>;
  }

  // Mobile View - Card List
  if (isMobile) {
    return (
      <div className="space-y-3">
        {data.map((item, index) => (
          <MobileDataCard
            key={keyExtractor(item)}
            title={mobileConfig.title(item)}
            subtitle={mobileConfig.subtitle?.(item)}
            image={mobileConfig.image?.(item)}
            avatar={mobileConfig.avatar?.(item)}
            badge={mobileConfig.badge?.(item)}
            fields={mobileConfig.fields(item)}
            actions={mobileConfig.actions?.(item)}
            onClick={mobileConfig.onClick ? () => mobileConfig.onClick!(item) : undefined}
            index={index}
          />
        ))}
      </div>
    );
  }

  // Desktop View - Table
  return (
    <Card>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              {columns
                .filter((col) => !col.hideOnMobile)
                .map((col) => (
                  <TableHead key={col.key}>{col.header}</TableHead>
                ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((item) => (
              <TableRow key={keyExtractor(item)}>
                {columns
                  .filter((col) => !col.hideOnMobile)
                  .map((col) => (
                    <TableCell key={col.key}>{col.render(item)}</TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default ResponsiveDataView;
