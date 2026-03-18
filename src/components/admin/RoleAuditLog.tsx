import { useState, useEffect, useMemo } from "react";
import { CalendarIcon, Download, History, Loader2, RefreshCw, ChevronLeft, ChevronRight, Search } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useActivityLog } from "@/hooks/queries";
import { toast } from "sonner";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AuditEntry {
  id: string;
  actor_email: string;
  target_email: string;
  action: string;
  role: string;
  created_at: string;
}

const PAGE_SIZE = 10;

const actionLabel = (action: string) => {
  switch (action) {
    case "assign": return { text: "Assigned", variant: "default" as const };
    case "remove": return { text: "Removed", variant: "destructive" as const };
    case "invite": return { text: "Invited", variant: "secondary" as const };
    default: return { text: action, variant: "outline" as const };
  }
};

const RoleAuditLog = () => {
  const [page, setPage] = useState(1);
  const [dateFrom, setDateFrom] = useState<Date | undefined>();
  const [dateTo, setDateTo] = useState<Date | undefined>();
  const [actionFilter, setActionFilter] = useState<string>("all");
  const [emailSearch, setEmailSearch] = useState("");
  const [debouncedEmail, setDebouncedEmail] = useState("");

  // Debounce email search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedEmail(emailSearch), 400);
    return () => clearTimeout(t);
  }, [emailSearch]);

  const queryParams = useMemo(() => ({
    page,
    pageSize: PAGE_SIZE,
    email: debouncedEmail || undefined,
    eventType: actionFilter !== "all" ? actionFilter : undefined,
  }), [page, debouncedEmail, actionFilter]);

  const { data, isLoading: loading, refetch } = useActivityLog(queryParams);

  const logs: AuditEntry[] = useMemo(() => {
    if (!data?.logs) return [];
    // Map activity-log entries to audit shape (will show real data once backend provides role-audit-specific endpoint)
    return (data.logs as any[]).map((l) => ({
      id: l.id,
      actor_email: l.user?.email ?? "system",
      target_email: l.user?.email ?? "",
      action: l.eventType ?? "assign",
      role: "user",
      created_at: l.createdAt,
    }));
  }, [data]);

  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  // Reset page on filter change
  useEffect(() => {
    setPage(1);
  }, [debouncedEmail, actionFilter, dateFrom, dateTo]);

  const handleExport = () => {
    if (logs.length === 0) {
      toast.info("No data to export");
      return;
    }
    const headers = ["Date", "Action", "Role", "Target User", "By"];
    const rows = logs.map((log) => [
      format(new Date(log.created_at), "yyyy-MM-dd HH:mm:ss"),
      log.action,
      log.role,
      log.target_email,
      log.actor_email,
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `role-audit-log-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Audit log exported");
  };

  const clearFilters = () => {
    setDateFrom(undefined);
    setDateTo(undefined);
    setActionFilter("all");
    setEmailSearch("");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <History className="h-5 w-5" />
              Role Change History
            </CardTitle>
            <CardDescription>Track who changed which roles and when</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleExport} disabled={loading || logs.length === 0}>
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
            <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="pl-8 h-9 w-[200px] text-sm"
            />
          </div>
          <Select value={actionFilter} onValueChange={setActionFilter}>
            <SelectTrigger className="w-[130px] h-9 text-sm">
              <SelectValue placeholder="All actions" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All actions</SelectItem>
              <SelectItem value="assign">Assigned</SelectItem>
              <SelectItem value="remove">Removed</SelectItem>
              <SelectItem value="invite">Invited</SelectItem>
            </SelectContent>
          </Select>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("w-[150px] justify-start text-left font-normal", !dateFrom && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateFrom ? format(dateFrom, "MMM d, yyyy") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateFrom} onSelect={setDateFrom} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className={cn("w-[150px] justify-start text-left font-normal", !dateTo && "text-muted-foreground")}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateTo ? format(dateTo, "MMM d, yyyy") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={dateTo} onSelect={setDateTo} initialFocus className="p-3 pointer-events-auto" />
            </PopoverContent>
          </Popover>
          {(dateFrom || dateTo || actionFilter !== "all" || emailSearch) && (
            <Button variant="ghost" size="sm" onClick={clearFilters}>
              Clear
            </Button>
          )}
          <span className="text-sm text-muted-foreground ml-auto">
            {total} {total === 1 ? "entry" : "entries"}
          </span>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No role changes recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Action</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Target User</TableHead>
                  <TableHead>By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const { text, variant } = actionLabel(log.action);
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                        {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell>
                        <Badge variant={variant}>{text}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{log.role}</Badge>
                      </TableCell>
                      <TableCell className="font-medium">{log.target_email}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{log.actor_email}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-2">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RoleAuditLog;
