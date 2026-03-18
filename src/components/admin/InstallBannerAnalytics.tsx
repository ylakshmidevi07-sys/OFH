import { useState, useEffect, useMemo } from "react";
import { Download, Eye, MousePointer, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

type DateRange = "7d" | "30d" | "all";

interface RawEvent {
  event_type: string;
  created_at: string;
}

const rangeLabel: Record<DateRange, string> = { "7d": "7 days", "30d": "30 days", all: "All time" };

const InstallBannerAnalytics = () => {
  const [allEvents, setAllEvents] = useState<RawEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<DateRange>("30d");

  useEffect(() => {
    // Install banner analytics — stub until NestJS /api/analytics/install endpoint exists
    setAllEvents([]);
    setLoading(false);
  }, []);

  const filtered = useMemo(() => {
    if (range === "all") return allEvents;
    const days = range === "7d" ? 7 : 30;
    const cutoff = new Date(Date.now() - days * 86400000);
    return allEvents.filter((e) => new Date(e.created_at) >= cutoff);
  }, [allEvents, range]);

  const { counts, dailyData } = useMemo(() => {
    const c = { impression: 0, click_native: 0, click_fallback: 0, installed: 0, dismiss: 0, native_dismissed: 0 };
    const daily: Record<string, { impressions: number; clicks: number; installs: number }> = {};

    filtered.forEach((row) => {
      const type = row.event_type as keyof typeof c;
      if (type in c) c[type]++;

      const date = new Date(row.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric" });
      if (!daily[date]) daily[date] = { impressions: 0, clicks: 0, installs: 0 };
      if (type === "impression") daily[date].impressions++;
      if (type === "click_native" || type === "click_fallback") daily[date].clicks++;
      if (type === "installed") daily[date].installs++;
    });

    const maxDays = range === "7d" ? 7 : range === "30d" ? 30 : Infinity;
    const entries = Object.entries(daily).map(([date, v]) => ({ date, ...v }));
    return { counts: c, dailyData: entries.slice(-maxDays) };
  }, [filtered, range]);

  if (loading) {
    return (
      <Card>
        <CardHeader><CardTitle className="text-base md:text-lg">Install Banner Analytics</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    );
  }

  const totalClicks = counts.click_native + counts.click_fallback;
  const impressions = counts.impression;
  const installs = counts.installed;
  const ctr = impressions > 0 ? ((totalClicks / impressions) * 100).toFixed(1) : "0";
  const conversionRate = impressions > 0 ? ((installs / impressions) * 100).toFixed(1) : "0";

  const metrics = [
    { label: "Impressions", value: impressions, icon: <Eye className="h-4 w-4" />, color: "bg-blue-500/10 text-blue-600" },
    { label: "Clicks", value: totalClicks, icon: <MousePointer className="h-4 w-4" />, color: "bg-amber-500/10 text-amber-600" },
    { label: "Installs", value: installs, icon: <Download className="h-4 w-4" />, color: "bg-primary/10 text-primary" },
    { label: "CTR", value: `${ctr}%`, icon: <TrendingUp className="h-4 w-4" />, color: "bg-purple-500/10 text-purple-600" },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
        <CardTitle className="text-base md:text-lg font-semibold flex items-center gap-2">
          <Download className="h-4 w-4 text-primary" />
          Install Banner Analytics
        </CardTitle>
        <div className="flex items-center gap-2">
          <Tabs value={range} onValueChange={(v) => setRange(v as DateRange)}>
            <TabsList className="h-8">
              <TabsTrigger value="7d" className="text-xs px-2.5 h-6">7 days</TabsTrigger>
              <TabsTrigger value="30d" className="text-xs px-2.5 h-6">30 days</TabsTrigger>
              <TabsTrigger value="all" className="text-xs px-2.5 h-6">All</TabsTrigger>
            </TabsList>
          </Tabs>
          <Badge variant="secondary">{conversionRate}% conversion</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Metric cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {metrics.map((m) => (
            <div key={m.label} className="flex items-center gap-2 p-3 rounded-lg bg-muted/30">
              <div className={`p-1.5 rounded-md ${m.color}`}>{m.icon}</div>
              <div>
                <p className="text-xs text-muted-foreground">{m.label}</p>
                <p className="font-semibold text-sm">{m.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Daily chart */}
        {dailyData.length > 0 ? (
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--background))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Legend wrapperStyle={{ fontSize: "12px" }} />
                <Bar dataKey="impressions" name="Impressions" fill="hsl(200, 80%, 50%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="clicks" name="Clicks" fill="hsl(45, 90%, 55%)" radius={[2, 2, 0, 0]} />
                <Bar dataKey="installs" name="Installs" fill="hsl(var(--primary))" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-[200px] flex items-center justify-center text-sm text-muted-foreground">
            No data for {rangeLabel[range]}
          </div>
        )}

        {/* Dismiss rate */}
        <div className="flex items-center justify-between text-sm text-muted-foreground pt-1 border-t border-border">
          <span>Dismiss rate</span>
          <span className="font-medium text-foreground">
            {impressions > 0 ? ((counts.dismiss / impressions) * 100).toFixed(1) : "0"}%
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallBannerAnalytics;
