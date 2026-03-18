import { useState, useEffect, useMemo } from "react";
import { Activity, Search, RefreshCw, Loader2, ChevronLeft, ChevronRight, Clock, Timer } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
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
import { format, formatDistanceToNow } from "date-fns";

interface ActivityEntry {
  id: string;
  user_id: string;
  event_type: string;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
}

interface UserInfo {
  email: string;
  last_sign_in_at: string | null;
}

const PAGE_SIZE = 10;

const UserActivityLog = () => {
  const [page, setPage] = useState(1);
  const [emailSearch, setEmailSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [eventFilter, setEventFilter] = useState("all");

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(emailSearch), 400);
    return () => clearTimeout(t);
  }, [emailSearch]);

  const queryParams = useMemo(() => ({
    page,
    pageSize: PAGE_SIZE,
    email: debouncedSearch || undefined,
    eventType: eventFilter !== "all" ? eventFilter : undefined,
  }), [page, debouncedSearch, eventFilter]);

  const { data, isLoading: loading, refetch } = useActivityLog(queryParams);

  const logs: ActivityEntry[] = useMemo(() => {
    if (!data?.logs) return [];
    return data.logs.map((l: any) => ({
      id: l.id,
      user_id: l.userId,
      event_type: l.eventType,
      ip_address: l.ipAddress ?? null,
      user_agent: l.userAgent ?? null,
      created_at: l.createdAt,
    }));
  }, [data]);

  const users: Record<string, UserInfo> = useMemo(() => {
    if (!data?.logs) return {};
    const map: Record<string, UserInfo> = {};
    for (const l of data.logs as any[]) {
      if (l.user?.email) {
        map[l.userId] = { email: l.user.email, last_sign_in_at: null };
      }
    }
    return map;
  }, [data]);

  const total = data?.total ?? 0;

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, eventFilter]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  const parseUserAgent = (ua: string | null) => {
    if (!ua) return "Unknown";
    if (ua.includes("Chrome")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari")) return "Safari";
    if (ua.includes("Edge")) return "Edge";
    return ua.substring(0, 30) + "...";
  };

  // Calculate session durations by pairing logout→login for same user
  const sessionDurations = useMemo(() => {
    const durations: Record<string, string> = {};
    const sortedLogs = [...logs].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    
    for (const log of sortedLogs) {
      if (log.event_type === "logout") {
        // Find the most recent login before this logout for the same user
        const logoutTime = new Date(log.created_at).getTime();
        const matchingLogin = sortedLogs.find(
          (l) => l.user_id === log.user_id && l.event_type === "login" && new Date(l.created_at).getTime() < logoutTime
        );
        if (matchingLogin) {
          const durationMs = logoutTime - new Date(matchingLogin.created_at).getTime();
          const mins = Math.floor(durationMs / 60000);
          const hours = Math.floor(mins / 60);
          const remainMins = mins % 60;
          durations[log.id] = hours > 0 ? `${hours}h ${remainMins}m` : `${mins}m`;
        }
      }
    }
    return durations;
  }, [logs]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              User Activity Log
            </CardTitle>
            <CardDescription>Login history, session durations, and last active timestamps</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={loading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex gap-3 flex-wrap">
          <div className="relative max-w-sm flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by email..."
              value={emailSearch}
              onChange={(e) => setEmailSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={eventFilter} onValueChange={setEventFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Event type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All events</SelectItem>
              <SelectItem value="login">Login</SelectItem>
              <SelectItem value="logout">Logout</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : logs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No activity recorded yet</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Event</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Last Active</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Browser</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => {
                  const userInfo = users[log.user_id];
                  const duration = sessionDurations[log.id];
                  return (
                    <TableRow key={log.id}>
                      <TableCell className="font-medium">
                        {userInfo?.email || log.user_id.slice(0, 8)}
                      </TableCell>
                      <TableCell>
                        <Badge variant={log.event_type === "logout" ? "outline" : "secondary"}>
                          {log.event_type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {duration ? (
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Timer className="h-3 w-3" />
                            {duration}
                          </span>
                        ) : (
                          <span className="text-muted-foreground">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {userInfo?.last_sign_in_at ? (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {formatDistanceToNow(new Date(userInfo.last_sign_in_at), { addSuffix: true })}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {format(new Date(log.created_at), "MMM d, yyyy h:mm a")}
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {parseUserAgent(log.user_agent)}
                      </TableCell>
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
            <span className="text-sm text-muted-foreground">{total} entries</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm">
                {page} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserActivityLog;
