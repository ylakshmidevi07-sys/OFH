import { useMemo } from "react";
import { Loader2, Activity } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useActivityLog } from "@/hooks/queries";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { format, subDays, eachDayOfInterval } from "date-fns";

interface DayData {
  date: string;
  label: string;
  logins: number;
  logouts: number;
}

const LoginFrequencyChart = () => {
  // Fetch a large page of activity logs to build the chart
  const { data, isLoading: loading } = useActivityLog({ page: 1, pageSize: 1000 });

  const { chartData, totalLogins } = useMemo(() => {
    const logs: { event_type: string; created_at: string }[] = (data?.logs || []).map((l: any) => ({
      event_type: l.eventType,
      created_at: l.createdAt,
    }));

    const days = eachDayOfInterval({
      start: subDays(new Date(), 29),
      end: new Date(),
    });

    const dayMap: Record<string, { logins: number; logouts: number }> = {};
    days.forEach((d) => {
      dayMap[format(d, "yyyy-MM-dd")] = { logins: 0, logouts: 0 };
    });

    let loginCount = 0;
    for (const log of logs) {
      const day = log.created_at.split("T")[0];
      if (dayMap[day]) {
        if (log.event_type === "login") {
          dayMap[day].logins++;
          loginCount++;
        } else if (log.event_type === "logout") {
          dayMap[day].logouts++;
        }
      }
    }

    return {
      totalLogins: loginCount,
      chartData: days.map((d) => {
        const key = format(d, "yyyy-MM-dd");
        return {
          date: key,
          label: format(d, "MMM d"),
          logins: dayMap[key].logins,
          logouts: dayMap[key].logouts,
        };
      }),
    };
  }, [data]);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
          <Activity className="h-4 w-4" />
          Login Activity
        </CardTitle>
        <Badge variant="secondary">
          {totalLogins} logins (30d)
        </Badge>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-[200px]">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="h-[200px] md:h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 10 }}
                  interval="preserveStartEnd"
                />
                <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar
                  dataKey="logins"
                  fill="hsl(var(--primary))"
                  radius={[3, 3, 0, 0]}
                  name="Logins"
                />
                <Bar
                  dataKey="logouts"
                  fill="hsl(var(--muted-foreground))"
                  radius={[3, 3, 0, 0]}
                  opacity={0.5}
                  name="Logouts"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LoginFrequencyChart;
