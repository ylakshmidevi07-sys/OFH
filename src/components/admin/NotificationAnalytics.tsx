import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Mail,
  Smartphone,
  Bell,
  MousePointerClick,
  Eye,
  Target,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  Calendar,
} from "lucide-react";
import { useState } from "react";

interface AnalyticsData {
  date: string;
  emailSent: number;
  emailOpened: number;
  emailClicked: number;
  smsSent: number;
  smsDelivered: number;
  smsClicked: number;
  pushSent: number;
  pushOpened: number;
  pushClicked: number;
}

interface ChannelPerformance {
  channel: string;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

interface CampaignMetric {
  id: string;
  name: string;
  channel: "email" | "sms" | "push";
  sent: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
}

const NotificationAnalytics = () => {
  const [dateRange, setDateRange] = useState("7d");

  // Sample analytics data
  const dailyData: AnalyticsData[] = [
    { date: "Jan 18", emailSent: 4200, emailOpened: 1890, emailClicked: 420, smsSent: 1500, smsDelivered: 1470, smsClicked: 180, pushSent: 8500, pushOpened: 3400, pushClicked: 680 },
    { date: "Jan 19", emailSent: 4500, emailOpened: 2025, emailClicked: 495, smsSent: 1650, smsDelivered: 1617, smsClicked: 214, pushSent: 9200, pushOpened: 3864, pushClicked: 736 },
    { date: "Jan 20", emailSent: 3800, emailOpened: 1634, emailClicked: 380, smsSent: 1400, smsDelivered: 1372, smsClicked: 168, pushSent: 7800, pushOpened: 3042, pushClicked: 624 },
    { date: "Jan 21", emailSent: 5100, emailOpened: 2397, emailClicked: 561, smsSent: 1800, smsDelivered: 1764, smsClicked: 252, pushSent: 10500, pushOpened: 4410, pushClicked: 840 },
    { date: "Jan 22", emailSent: 4800, emailOpened: 2160, emailClicked: 528, smsSent: 1700, smsDelivered: 1666, smsClicked: 238, pushSent: 9800, pushOpened: 4018, pushClicked: 784 },
    { date: "Jan 23", emailSent: 5500, emailOpened: 2585, emailClicked: 605, smsSent: 1950, smsDelivered: 1911, smsClicked: 273, pushSent: 11200, pushOpened: 4816, pushClicked: 896 },
    { date: "Jan 24", emailSent: 4900, emailOpened: 2254, emailClicked: 539, smsSent: 1750, smsDelivered: 1715, smsClicked: 245, pushSent: 10100, pushOpened: 4242, pushClicked: 808 },
  ];

  const channelPerformance: ChannelPerformance[] = [
    { channel: "Email", sent: 32800, delivered: 32144, opened: 14945, clicked: 3528, converted: 892, openRate: 46.5, clickRate: 10.9, conversionRate: 2.8 },
    { channel: "SMS", sent: 11750, delivered: 11515, opened: 11515, clicked: 1570, converted: 425, openRate: 100, clickRate: 13.6, conversionRate: 3.7 },
    { channel: "Push", sent: 67100, delivered: 66429, opened: 27792, clicked: 5368, converted: 1245, openRate: 41.8, clickRate: 8.1, conversionRate: 1.9 },
  ];

  const topCampaigns: CampaignMetric[] = [
    { id: "1", name: "Weekly Newsletter", channel: "email", sent: 15420, opened: 7402, clicked: 1850, converted: 462, revenue: 23100, openRate: 48.0, clickRate: 12.0, conversionRate: 3.0 },
    { id: "2", name: "Flash Sale Alert", channel: "push", sent: 45000, opened: 18900, clicked: 4500, converted: 1125, revenue: 56250, openRate: 42.0, clickRate: 10.0, conversionRate: 2.5 },
    { id: "3", name: "Order Shipped SMS", channel: "sms", sent: 8750, opened: 8750, clicked: 1312, converted: 350, revenue: 17500, openRate: 100, clickRate: 15.0, conversionRate: 4.0 },
    { id: "4", name: "Cart Abandonment", channel: "email", sent: 3250, opened: 1625, clicked: 520, converted: 195, revenue: 9750, openRate: 50.0, clickRate: 16.0, conversionRate: 6.0 },
    { id: "5", name: "New Arrival Push", channel: "push", sent: 22100, opened: 8840, clicked: 1768, converted: 442, revenue: 22100, openRate: 40.0, clickRate: 8.0, conversionRate: 2.0 },
  ];

  const pieData = [
    { name: "Email", value: 32800, color: "hsl(var(--chart-1))" },
    { name: "SMS", value: 11750, color: "hsl(var(--chart-2))" },
    { name: "Push", value: 67100, color: "hsl(var(--chart-3))" },
  ];

  const conversionFunnelData = [
    { stage: "Sent", email: 100, sms: 100, push: 100 },
    { stage: "Delivered", email: 98, sms: 98, push: 99 },
    { stage: "Opened", email: 46, sms: 100, push: 42 },
    { stage: "Clicked", email: 11, sms: 14, push: 8 },
    { stage: "Converted", email: 2.8, sms: 3.7, push: 1.9 },
  ];

  const hourlyEngagement = [
    { hour: "6AM", opens: 320, clicks: 45 },
    { hour: "8AM", opens: 890, clicks: 125 },
    { hour: "10AM", opens: 1450, clicks: 210 },
    { hour: "12PM", opens: 1680, clicks: 245 },
    { hour: "2PM", opens: 1320, clicks: 185 },
    { hour: "4PM", opens: 1150, clicks: 165 },
    { hour: "6PM", opens: 1580, clicks: 230 },
    { hour: "8PM", opens: 1920, clicks: 285 },
    { hour: "10PM", opens: 1240, clicks: 175 },
  ];

  const totalSent = 111650;
  const totalOpened = 54252;
  const totalClicked = 10466;
  const totalConverted = 2562;
  const totalRevenue = 128700;

  const overallOpenRate = ((totalOpened / totalSent) * 100).toFixed(1);
  const overallClickRate = ((totalClicked / totalSent) * 100).toFixed(1);
  const overallConversionRate = ((totalConverted / totalSent) * 100).toFixed(2);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
      default:
        return <Mail className="h-4 w-4" />;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "email":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "sms":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "push":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-xl font-semibold">Notification Analytics</h2>
        <div className="flex gap-2">
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[140px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sent</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSent.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +12.5% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Rate</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallOpenRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +2.3% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Click Rate</CardTitle>
            <MousePointerClick className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallClickRate}%</div>
            <div className="flex items-center text-xs text-red-600">
              <ArrowDownRight className="h-3 w-3 mr-1" />
              -0.8% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{overallConversionRate}%</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +0.5% from last period
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue Generated</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹{totalRevenue.toLocaleString()}</div>
            <div className="flex items-center text-xs text-green-600">
              <ArrowUpRight className="h-3 w-3 mr-1" />
              +18.2% from last period
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Daily Engagement Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Daily Engagement Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dailyData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="date" className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis className="text-xs" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Area type="monotone" dataKey="emailOpened" name="Email Opens" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="smsDelivered" name="SMS Delivered" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.6} />
                  <Area type="monotone" dataKey="pushOpened" name="Push Opens" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.6} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Channel Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center">
              <ResponsiveContainer width="50%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => value.toLocaleString()}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="w-1/2 space-y-4">
                {pieData.map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm font-medium">{item.name}</span>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{item.value.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">
                        {((item.value / totalSent) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Channel Performance Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Channel Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {channelPerformance.map((channel) => (
              <div key={channel.channel} className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${
                      channel.channel === "Email" ? "bg-blue-100 dark:bg-blue-900" :
                      channel.channel === "SMS" ? "bg-purple-100 dark:bg-purple-900" :
                      "bg-orange-100 dark:bg-orange-900"
                    }`}>
                      {channel.channel === "Email" && <Mail className="h-5 w-5 text-blue-600 dark:text-blue-300" />}
                      {channel.channel === "SMS" && <Smartphone className="h-5 w-5 text-purple-600 dark:text-purple-300" />}
                      {channel.channel === "Push" && <Bell className="h-5 w-5 text-orange-600 dark:text-orange-300" />}
                    </div>
                    <div>
                      <h4 className="font-medium">{channel.channel}</h4>
                      <p className="text-sm text-muted-foreground">{channel.sent.toLocaleString()} sent</p>
                    </div>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold">{channel.openRate}%</div>
                      <div className="text-xs text-muted-foreground">Open Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{channel.clickRate}%</div>
                      <div className="text-xs text-muted-foreground">Click Rate</div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold">{channel.conversionRate}%</div>
                      <div className="text-xs text-muted-foreground">Conversion</div>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Open Rate</span>
                      <span>{channel.openRate}%</span>
                    </div>
                    <Progress value={channel.openRate} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Click Rate</span>
                      <span>{channel.clickRate}%</span>
                    </div>
                    <Progress value={channel.clickRate * 5} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span>Conversion</span>
                      <span>{channel.conversionRate}%</span>
                    </div>
                    <Progress value={channel.conversionRate * 20} className="h-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Charts Row 2 */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Conversion Funnel */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Conversion Funnel by Channel</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={conversionFunnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis type="number" domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis dataKey="stage" type="category" width={80} tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    formatter={(value: number) => `${value}%`}
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Bar dataKey="email" name="Email" fill="hsl(var(--chart-1))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="sms" name="SMS" fill="hsl(var(--chart-2))" radius={[0, 4, 4, 0]} />
                  <Bar dataKey="push" name="Push" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Best Time to Send */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Engagement by Hour of Day</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={hourlyEngagement}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="hour" tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <YAxis tick={{ fill: 'hsl(var(--muted-foreground))' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'hsl(var(--background))', 
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px'
                    }} 
                  />
                  <Legend />
                  <Line type="monotone" dataKey="opens" name="Opens" stroke="hsl(var(--chart-1))" strokeWidth={2} dot={{ fill: 'hsl(var(--chart-1))' }} />
                  <Line type="monotone" dataKey="clicks" name="Clicks" stroke="hsl(var(--chart-2))" strokeWidth={2} dot={{ fill: 'hsl(var(--chart-2))' }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performing Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Top Performing Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topCampaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-4 rounded-lg border"
              >
                <div className="flex items-center gap-4">
                  <div className="text-2xl font-bold text-muted-foreground w-8">
                    #{index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{campaign.name}</h4>
                      <Badge className={getChannelColor(campaign.channel)}>
                        {getChannelIcon(campaign.channel)}
                        <span className="ml-1 capitalize">{campaign.channel}</span>
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.sent.toLocaleString()} sent
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-center">
                    <div className="font-semibold">{campaign.openRate}%</div>
                    <div className="text-xs text-muted-foreground">Open Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{campaign.clickRate}%</div>
                    <div className="text-xs text-muted-foreground">Click Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold">{campaign.conversionRate}%</div>
                    <div className="text-xs text-muted-foreground">Conversion</div>
                  </div>
                  <div className="text-center">
                    <div className="font-semibold text-green-600">₹{campaign.revenue.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Revenue</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-primary/5 border-primary/20">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-background rounded-lg">
              <h4 className="font-medium mb-2">Best Performing Channel</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">SMS</span> has the highest conversion rate at 3.7%, 
                making it ideal for transactional and time-sensitive notifications.
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <h4 className="font-medium mb-2">Optimal Send Time</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">8 PM</span> shows the highest engagement with 
                1,920 opens and 285 clicks, followed by 12 PM for business hours.
              </p>
            </div>
            <div className="p-4 bg-background rounded-lg">
              <h4 className="font-medium mb-2">Top Converting Campaign</h4>
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">Cart Abandonment</span> emails achieve a 6% 
                conversion rate, the highest among all campaigns.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationAnalytics;
