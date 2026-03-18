import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  Plus,
  Play,
  Pause,
  Trophy,
  TrendingUp,
  TrendingDown,
  Users,
  Mail,
  Smartphone,
  Bell,
  Target,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  Percent,
  ArrowRight,
  Trash2,
  Eye,
  Copy,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";

interface ABTestVariant {
  id: string;
  name: string;
  subject?: string;
  content: string;
  trafficAllocation: number;
  sent: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  revenue: number;
}

interface ABTest {
  id: string;
  name: string;
  description: string;
  channel: "email" | "sms" | "push";
  status: "draft" | "running" | "paused" | "completed" | "winner_selected";
  variants: ABTestVariant[];
  winnerId?: string;
  winnerMetric: "open_rate" | "click_rate" | "conversion_rate" | "revenue";
  autoSelectWinner: boolean;
  minSampleSize: number;
  confidenceLevel: number;
  startDate?: string;
  endDate?: string;
  createdAt: string;
  audience: "all" | "segment";
  audienceSegment?: string;
  totalParticipants: number;
}

interface PerformanceData {
  date: string;
  variantA: number;
  variantB: number;
  variantC?: number;
}

const ABTestingDashboard = () => {
  const [abTests, setAbTests] = useState<ABTest[]>([
    {
      id: "1",
      name: "Welcome Email Subject Line Test",
      description: "Testing different subject lines for welcome emails",
      channel: "email",
      status: "running",
      variants: [
        {
          id: "1a",
          name: "Variant A (Control)",
          subject: "Welcome to Fresh Harvest, {{customer_name}}!",
          content: "Thank you for joining us...",
          trafficAllocation: 50,
          sent: 5420,
          delivered: 5380,
          opened: 2150,
          clicked: 860,
          converted: 215,
          revenue: 12900,
        },
        {
          id: "1b",
          name: "Variant B",
          subject: "🎉 Your Fresh Harvest journey begins!",
          content: "Thank you for joining us...",
          trafficAllocation: 50,
          sent: 5418,
          delivered: 5375,
          opened: 2690,
          clicked: 1076,
          converted: 322,
          revenue: 19320,
        },
      ],
      winnerMetric: "open_rate",
      autoSelectWinner: true,
      minSampleSize: 10000,
      confidenceLevel: 95,
      startDate: "2024-01-15",
      createdAt: "2024-01-14",
      audience: "all",
      totalParticipants: 10838,
    },
    {
      id: "2",
      name: "Cart Abandonment SMS Timing",
      description: "Testing 1h vs 2h delay for cart abandonment SMS",
      channel: "sms",
      status: "completed",
      variants: [
        {
          id: "2a",
          name: "1 Hour Delay",
          content: "Hey {{name}}! You left items in your cart...",
          trafficAllocation: 50,
          sent: 3200,
          delivered: 3180,
          opened: 2862,
          clicked: 956,
          converted: 382,
          revenue: 22920,
        },
        {
          id: "2b",
          name: "2 Hour Delay",
          content: "Hey {{name}}! You left items in your cart...",
          trafficAllocation: 50,
          sent: 3198,
          delivered: 3175,
          opened: 2540,
          clicked: 762,
          converted: 305,
          revenue: 18300,
        },
      ],
      winnerId: "2a",
      winnerMetric: "conversion_rate",
      autoSelectWinner: true,
      minSampleSize: 5000,
      confidenceLevel: 95,
      startDate: "2024-01-10",
      endDate: "2024-01-18",
      createdAt: "2024-01-09",
      audience: "segment",
      audienceSegment: "cart_abandoners",
      totalParticipants: 6398,
    },
    {
      id: "3",
      name: "Push Notification CTA Test",
      description: "Testing different call-to-action buttons",
      channel: "push",
      status: "running",
      variants: [
        {
          id: "3a",
          name: "Shop Now",
          content: "Flash Sale! 50% off everything. Shop Now →",
          trafficAllocation: 33,
          sent: 8500,
          delivered: 8420,
          opened: 3368,
          clicked: 1684,
          converted: 504,
          revenue: 30240,
        },
        {
          id: "3b",
          name: "View Deals",
          content: "Flash Sale! 50% off everything. View Deals →",
          trafficAllocation: 33,
          sent: 8502,
          delivered: 8418,
          opened: 3535,
          clicked: 1767,
          converted: 530,
          revenue: 31800,
        },
        {
          id: "3c",
          name: "Claim Discount",
          content: "Flash Sale! 50% off everything. Claim Discount →",
          trafficAllocation: 34,
          sent: 8498,
          delivered: 8415,
          opened: 3787,
          clicked: 2021,
          converted: 606,
          revenue: 36360,
        },
      ],
      winnerMetric: "click_rate",
      autoSelectWinner: false,
      minSampleSize: 20000,
      confidenceLevel: 95,
      startDate: "2024-01-18",
      createdAt: "2024-01-17",
      audience: "all",
      totalParticipants: 25500,
    },
    {
      id: "4",
      name: "Order Confirmation Email Design",
      description: "Testing minimal vs detailed order confirmation",
      channel: "email",
      status: "draft",
      variants: [
        {
          id: "4a",
          name: "Minimal Design",
          subject: "Order #{{order_id}} Confirmed",
          content: "Your order is confirmed. Track: {{tracking_url}}",
          trafficAllocation: 50,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          revenue: 0,
        },
        {
          id: "4b",
          name: "Detailed Design",
          subject: "Order #{{order_id}} Confirmed ✓",
          content: "Your order is confirmed with full details...",
          trafficAllocation: 50,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          revenue: 0,
        },
      ],
      winnerMetric: "click_rate",
      autoSelectWinner: true,
      minSampleSize: 5000,
      confidenceLevel: 95,
      createdAt: "2024-01-20",
      audience: "all",
      totalParticipants: 0,
    },
  ]);

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedTest, setSelectedTest] = useState<ABTest | null>(null);
  const [newTest, setNewTest] = useState<Partial<ABTest>>({
    name: "",
    description: "",
    channel: "email",
    winnerMetric: "open_rate",
    autoSelectWinner: true,
    minSampleSize: 5000,
    confidenceLevel: 95,
    audience: "all",
    variants: [
      {
        id: "new-a",
        name: "Variant A (Control)",
        subject: "",
        content: "",
        trafficAllocation: 50,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0,
      },
      {
        id: "new-b",
        name: "Variant B",
        subject: "",
        content: "",
        trafficAllocation: 50,
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        revenue: 0,
      },
    ],
  });

  // Performance chart data
  const performanceData: PerformanceData[] = [
    { date: "Jan 15", variantA: 38.5, variantB: 45.2 },
    { date: "Jan 16", variantA: 39.8, variantB: 48.1 },
    { date: "Jan 17", variantA: 40.2, variantB: 49.5 },
    { date: "Jan 18", variantA: 39.5, variantB: 50.2 },
    { date: "Jan 19", variantA: 40.1, variantB: 49.8 },
    { date: "Jan 20", variantA: 39.9, variantB: 50.1 },
    { date: "Jan 21", variantA: 40.0, variantB: 50.0 },
  ];

  const calculateRate = (numerator: number, denominator: number): number => {
    if (denominator === 0) return 0;
    return (numerator / denominator) * 100;
  };

  const getMetricValue = (variant: ABTestVariant, metric: string): number => {
    switch (metric) {
      case "open_rate":
        return calculateRate(variant.opened, variant.delivered);
      case "click_rate":
        return calculateRate(variant.clicked, variant.opened);
      case "conversion_rate":
        return calculateRate(variant.converted, variant.clicked);
      case "revenue":
        return variant.revenue;
      default:
        return 0;
    }
  };

  const getWinningVariant = (test: ABTest): ABTestVariant | null => {
    if (test.variants.length === 0) return null;
    return test.variants.reduce((best, current) => {
      const bestValue = getMetricValue(best, test.winnerMetric);
      const currentValue = getMetricValue(current, test.winnerMetric);
      return currentValue > bestValue ? current : best;
    });
  };

  const calculateLift = (control: ABTestVariant, variant: ABTestVariant, metric: string): number => {
    const controlValue = getMetricValue(control, metric);
    const variantValue = getMetricValue(variant, metric);
    if (controlValue === 0) return 0;
    return ((variantValue - controlValue) / controlValue) * 100;
  };

  const calculateStatisticalSignificance = (
    controlConversions: number,
    controlTotal: number,
    variantConversions: number,
    variantTotal: number
  ): number => {
    // Simplified significance calculation (would use proper z-test in production)
    const controlRate = controlConversions / controlTotal;
    const variantRate = variantConversions / variantTotal;
    const pooledRate = (controlConversions + variantConversions) / (controlTotal + variantTotal);
    const standardError = Math.sqrt(pooledRate * (1 - pooledRate) * (1 / controlTotal + 1 / variantTotal));
    if (standardError === 0) return 0;
    const zScore = Math.abs(variantRate - controlRate) / standardError;
    // Convert z-score to approximate confidence (simplified)
    return Math.min(99.9, Math.max(0, zScore * 25));
  };

  const getStatusColor = (status: ABTest["status"]) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      case "winner_selected":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300";
      case "paused":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
      case "draft":
        return "bg-muted text-muted-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getChannelIcon = (channel: ABTest["channel"]) => {
    switch (channel) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <Smartphone className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
    }
  };

  const handleCreateTest = () => {
    const test: ABTest = {
      id: Date.now().toString(),
      name: newTest.name || "",
      description: newTest.description || "",
      channel: newTest.channel || "email",
      status: "draft",
      variants: newTest.variants || [],
      winnerMetric: newTest.winnerMetric || "open_rate",
      autoSelectWinner: newTest.autoSelectWinner ?? true,
      minSampleSize: newTest.minSampleSize || 5000,
      confidenceLevel: newTest.confidenceLevel || 95,
      createdAt: new Date().toISOString().split("T")[0],
      audience: newTest.audience || "all",
      audienceSegment: newTest.audienceSegment,
      totalParticipants: 0,
    };
    setAbTests([...abTests, test]);
    setIsCreateDialogOpen(false);
    setNewTest({
      name: "",
      description: "",
      channel: "email",
      winnerMetric: "open_rate",
      autoSelectWinner: true,
      minSampleSize: 5000,
      confidenceLevel: 95,
      audience: "all",
      variants: [
        {
          id: "new-a",
          name: "Variant A (Control)",
          subject: "",
          content: "",
          trafficAllocation: 50,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          revenue: 0,
        },
        {
          id: "new-b",
          name: "Variant B",
          subject: "",
          content: "",
          trafficAllocation: 50,
          sent: 0,
          delivered: 0,
          opened: 0,
          clicked: 0,
          converted: 0,
          revenue: 0,
        },
      ],
    });
    toast.success("A/B test created successfully");
  };

  const handleStartTest = (testId: string) => {
    setAbTests(
      abTests.map((t) =>
        t.id === testId
          ? { ...t, status: "running", startDate: new Date().toISOString().split("T")[0] }
          : t
      )
    );
    toast.success("A/B test started");
  };

  const handlePauseTest = (testId: string) => {
    setAbTests(
      abTests.map((t) =>
        t.id === testId ? { ...t, status: "paused" as const } : t
      )
    );
    toast.success("A/B test paused");
  };

  const handleSelectWinner = (testId: string, variantId: string) => {
    setAbTests(
      abTests.map((t) =>
        t.id === testId
          ? {
              ...t,
              status: "winner_selected" as const,
              winnerId: variantId,
              endDate: new Date().toISOString().split("T")[0],
            }
          : t
      )
    );
    toast.success("Winner selected and test completed");
  };

  const handleDeleteTest = (testId: string) => {
    setAbTests(abTests.filter((t) => t.id !== testId));
    toast.success("A/B test deleted");
  };

  const addVariant = () => {
    if (!newTest.variants) return;
    const variantCount = newTest.variants.length;
    const newAllocation = Math.floor(100 / (variantCount + 1));
    const updatedVariants = newTest.variants.map((v) => ({
      ...v,
      trafficAllocation: newAllocation,
    }));
    updatedVariants.push({
      id: `new-${String.fromCharCode(97 + variantCount)}`,
      name: `Variant ${String.fromCharCode(65 + variantCount)}`,
      subject: "",
      content: "",
      trafficAllocation: newAllocation,
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      converted: 0,
      revenue: 0,
    });
    setNewTest({ ...newTest, variants: updatedVariants });
  };

  const removeVariant = (variantId: string) => {
    if (!newTest.variants || newTest.variants.length <= 2) return;
    const updatedVariants = newTest.variants.filter((v) => v.id !== variantId);
    const newAllocation = Math.floor(100 / updatedVariants.length);
    setNewTest({
      ...newTest,
      variants: updatedVariants.map((v) => ({ ...v, trafficAllocation: newAllocation })),
    });
  };

  // Summary stats
  const runningTests = abTests.filter((t) => t.status === "running").length;
  const completedTests = abTests.filter((t) => t.status === "completed" || t.status === "winner_selected").length;
  const totalParticipants = abTests.reduce((sum, t) => sum + t.totalParticipants, 0);
  const avgLift = 23.5; // Would calculate from actual data

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Tests</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{runningTests}</div>
            <p className="text-xs text-muted-foreground">
              {abTests.filter((t) => t.status === "draft").length} drafts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Tests</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedTests}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Participants</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalParticipants.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Across all tests
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Lift</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">+{avgLift}%</div>
            <p className="text-xs text-muted-foreground">
              Winner vs control
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Create Test Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">A/B Tests</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Create A/B Test
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create A/B Test</DialogTitle>
            </DialogHeader>
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Test Name</Label>
                    <Input
                      value={newTest.name}
                      onChange={(e) => setNewTest({ ...newTest, name: e.target.value })}
                      placeholder="e.g., Welcome Email Subject Test"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Channel</Label>
                    <Select
                      value={newTest.channel}
                      onValueChange={(value) =>
                        setNewTest({ ...newTest, channel: value as ABTest["channel"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="sms">SMS</SelectItem>
                        <SelectItem value="push">Push Notification</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Textarea
                    value={newTest.description}
                    onChange={(e) => setNewTest({ ...newTest, description: e.target.value })}
                    placeholder="Describe what you're testing..."
                    rows={2}
                  />
                </div>
              </div>

              {/* Variants */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Label className="text-base font-semibold">Variants</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addVariant}
                    disabled={(newTest.variants?.length || 0) >= 4}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add Variant
                  </Button>
                </div>
                <div className="space-y-4">
                  {newTest.variants?.map((variant, index) => (
                    <Card key={variant.id} className="p-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-2">
                            <Badge variant={index === 0 ? "default" : "outline"}>
                              {index === 0 ? "Control" : `Variant ${String.fromCharCode(65 + index)}`}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {variant.trafficAllocation}% traffic
                            </span>
                          </div>
                          {index > 0 && newTest.variants && newTest.variants.length > 2 && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeVariant(variant.id)}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          )}
                        </div>
                        {newTest.channel === "email" && (
                          <div className="space-y-2">
                            <Label className="text-sm">Subject Line</Label>
                            <Input
                              value={variant.subject || ""}
                              onChange={(e) => {
                                const updatedVariants = newTest.variants?.map((v) =>
                                  v.id === variant.id ? { ...v, subject: e.target.value } : v
                                );
                                setNewTest({ ...newTest, variants: updatedVariants });
                              }}
                              placeholder="Enter subject line..."
                            />
                          </div>
                        )}
                        <div className="space-y-2">
                          <Label className="text-sm">Content</Label>
                          <Textarea
                            value={variant.content}
                            onChange={(e) => {
                              const updatedVariants = newTest.variants?.map((v) =>
                                v.id === variant.id ? { ...v, content: e.target.value } : v
                              );
                              setNewTest({ ...newTest, variants: updatedVariants });
                            }}
                            placeholder="Enter message content..."
                            rows={2}
                          />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Test Settings */}
              <div className="space-y-4">
                <Label className="text-base font-semibold">Test Settings</Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Success Metric</Label>
                    <Select
                      value={newTest.winnerMetric}
                      onValueChange={(value) =>
                        setNewTest({ ...newTest, winnerMetric: value as ABTest["winnerMetric"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="open_rate">Open Rate</SelectItem>
                        <SelectItem value="click_rate">Click Rate</SelectItem>
                        <SelectItem value="conversion_rate">Conversion Rate</SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Min Sample Size</Label>
                    <Input
                      type="number"
                      value={newTest.minSampleSize}
                      onChange={(e) =>
                        setNewTest({ ...newTest, minSampleSize: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Confidence Level</Label>
                    <Select
                      value={String(newTest.confidenceLevel)}
                      onValueChange={(value) =>
                        setNewTest({ ...newTest, confidenceLevel: parseInt(value) })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="90">90%</SelectItem>
                        <SelectItem value="95">95%</SelectItem>
                        <SelectItem value="99">99%</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Audience</Label>
                    <Select
                      value={newTest.audience}
                      onValueChange={(value) =>
                        setNewTest({ ...newTest, audience: value as ABTest["audience"] })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="segment">Specific Segment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-select Winner</Label>
                    <p className="text-xs text-muted-foreground">
                      Automatically end test and select winner when confidence is reached
                    </p>
                  </div>
                  <Switch
                    checked={newTest.autoSelectWinner}
                    onCheckedChange={(checked) =>
                      setNewTest({ ...newTest, autoSelectWinner: checked })
                    }
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateTest}>Create Test</Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Tests Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Test Name</TableHead>
              <TableHead>Channel</TableHead>
              <TableHead>Variants</TableHead>
              <TableHead>Participants</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Leading Variant</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {abTests.map((test) => {
              const winningVariant = getWinningVariant(test);
              const controlVariant = test.variants[0];
              const lift = winningVariant && controlVariant && winningVariant.id !== controlVariant.id
                ? calculateLift(controlVariant, winningVariant, test.winnerMetric)
                : 0;

              return (
                <TableRow key={test.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{test.name}</p>
                      <p className="text-xs text-muted-foreground">{test.description}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="flex items-center gap-1 w-fit">
                      {getChannelIcon(test.channel)}
                      {test.channel}
                    </Badge>
                  </TableCell>
                  <TableCell>{test.variants.length} variants</TableCell>
                  <TableCell>{test.totalParticipants.toLocaleString()}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(test.status)}>
                      {test.status === "winner_selected" ? "Winner Selected" : test.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {winningVariant && test.status !== "draft" ? (
                      <div className="flex items-center gap-2">
                        {test.winnerId === winningVariant.id && (
                          <Trophy className="h-4 w-4 text-yellow-500" />
                        )}
                        <span className="font-medium">{winningVariant.name}</span>
                        {lift > 0 && (
                          <Badge variant="outline" className="text-green-600">
                            <TrendingUp className="h-3 w-3 mr-1" />
                            +{lift.toFixed(1)}%
                          </Badge>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {test.status === "draft" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartTest(test.id)}
                          title="Start Test"
                        >
                          <Play className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      {test.status === "running" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handlePauseTest(test.id)}
                          title="Pause Test"
                        >
                          <Pause className="h-4 w-4 text-yellow-600" />
                        </Button>
                      )}
                      {test.status === "paused" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleStartTest(test.id)}
                          title="Resume Test"
                        >
                          <Play className="h-4 w-4 text-green-600" />
                        </Button>
                      )}
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedTest(test)}
                            title="View Details"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {test.name}
                              <Badge className={getStatusColor(test.status)}>
                                {test.status}
                              </Badge>
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-6">
                            {/* Test Info */}
                            <div className="grid grid-cols-4 gap-4">
                              <div className="text-center p-3 rounded-lg bg-muted">
                                <p className="text-2xl font-bold">{test.totalParticipants.toLocaleString()}</p>
                                <p className="text-xs text-muted-foreground">Participants</p>
                              </div>
                              <div className="text-center p-3 rounded-lg bg-muted">
                                <p className="text-2xl font-bold">{test.variants.length}</p>
                                <p className="text-xs text-muted-foreground">Variants</p>
                              </div>
                              <div className="text-center p-3 rounded-lg bg-muted">
                                <p className="text-2xl font-bold">{test.confidenceLevel}%</p>
                                <p className="text-xs text-muted-foreground">Confidence Target</p>
                              </div>
                              <div className="text-center p-3 rounded-lg bg-muted">
                                <p className="text-2xl font-bold capitalize">{test.winnerMetric.replace("_", " ")}</p>
                                <p className="text-xs text-muted-foreground">Success Metric</p>
                              </div>
                            </div>

                            {/* Variant Comparison */}
                            <div className="space-y-4">
                              <h3 className="font-semibold">Variant Performance</h3>
                              {test.variants.map((variant, index) => {
                                const openRate = calculateRate(variant.opened, variant.delivered);
                                const clickRate = calculateRate(variant.clicked, variant.opened);
                                const convRate = calculateRate(variant.converted, variant.clicked);
                                const isWinner = test.winnerId === variant.id;
                                const isLeading = winningVariant?.id === variant.id;

                                return (
                                  <Card
                                    key={variant.id}
                                    className={`p-4 ${isWinner ? "border-yellow-500 border-2" : ""}`}
                                  >
                                    <div className="space-y-4">
                                      <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-2">
                                          {isWinner && <Trophy className="h-5 w-5 text-yellow-500" />}
                                          <span className="font-medium">{variant.name}</span>
                                          {index === 0 && (
                                            <Badge variant="secondary">Control</Badge>
                                          )}
                                          {isLeading && !isWinner && (
                                            <Badge variant="outline" className="text-green-600">
                                              Leading
                                            </Badge>
                                          )}
                                        </div>
                                        <span className="text-sm text-muted-foreground">
                                          {variant.trafficAllocation}% traffic
                                        </span>
                                      </div>
                                      
                                      {test.channel === "email" && variant.subject && (
                                        <div className="text-sm">
                                          <span className="text-muted-foreground">Subject: </span>
                                          <span className="font-medium">{variant.subject}</span>
                                        </div>
                                      )}

                                      <div className="grid grid-cols-5 gap-4 text-center">
                                        <div>
                                          <p className="text-lg font-bold">{variant.sent.toLocaleString()}</p>
                                          <p className="text-xs text-muted-foreground">Sent</p>
                                        </div>
                                        <div>
                                          <p className="text-lg font-bold">{openRate.toFixed(1)}%</p>
                                          <p className="text-xs text-muted-foreground">Open Rate</p>
                                          <Progress value={openRate} className="h-1 mt-1" />
                                        </div>
                                        <div>
                                          <p className="text-lg font-bold">{clickRate.toFixed(1)}%</p>
                                          <p className="text-xs text-muted-foreground">Click Rate</p>
                                          <Progress value={clickRate} className="h-1 mt-1" />
                                        </div>
                                        <div>
                                          <p className="text-lg font-bold">{convRate.toFixed(1)}%</p>
                                          <p className="text-xs text-muted-foreground">Conversion</p>
                                          <Progress value={convRate} className="h-1 mt-1" />
                                        </div>
                                        <div>
                                          <p className="text-lg font-bold">₹{variant.revenue.toLocaleString()}</p>
                                          <p className="text-xs text-muted-foreground">Revenue</p>
                                        </div>
                                      </div>

                                      {/* Lift vs Control */}
                                      {index > 0 && controlVariant && (
                                        <div className="flex items-center gap-4 pt-2 border-t">
                                          <span className="text-sm text-muted-foreground">vs Control:</span>
                                          {["open_rate", "click_rate", "conversion_rate", "revenue"].map((metric) => {
                                            const liftValue = calculateLift(controlVariant, variant, metric);
                                            return (
                                              <div key={metric} className="flex items-center gap-1">
                                                <span className="text-xs text-muted-foreground capitalize">
                                                  {metric.replace("_", " ")}:
                                                </span>
                                                <span
                                                  className={`text-sm font-medium ${
                                                    liftValue > 0 ? "text-green-600" : liftValue < 0 ? "text-red-600" : ""
                                                  }`}
                                                >
                                                  {liftValue > 0 ? "+" : ""}
                                                  {liftValue.toFixed(1)}%
                                                </span>
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </Card>
                                );
                              })}
                            </div>

                            {/* Performance Chart */}
                            {test.status !== "draft" && (
                              <div className="space-y-4">
                                <h3 className="font-semibold">Performance Over Time</h3>
                                <div className="h-64">
                                  <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={performanceData}>
                                      <CartesianGrid strokeDasharray="3 3" />
                                      <XAxis dataKey="date" />
                                      <YAxis />
                                      <Tooltip />
                                      <Legend />
                                      <Area
                                        type="monotone"
                                        dataKey="variantA"
                                        name="Variant A"
                                        stroke="hsl(var(--primary))"
                                        fill="hsl(var(--primary))"
                                        fillOpacity={0.3}
                                      />
                                      <Area
                                        type="monotone"
                                        dataKey="variantB"
                                        name="Variant B"
                                        stroke="hsl(var(--chart-2))"
                                        fill="hsl(var(--chart-2))"
                                        fillOpacity={0.3}
                                      />
                                    </AreaChart>
                                  </ResponsiveContainer>
                                </div>
                              </div>
                            )}

                            {/* Actions */}
                            {(test.status === "running" || test.status === "paused") && !test.winnerId && (
                              <div className="flex justify-end gap-2 pt-4 border-t">
                                <p className="text-sm text-muted-foreground flex-1">
                                  Select a winner to end the test and apply the winning variant to all future notifications.
                                </p>
                                {test.variants.map((variant) => (
                                  <Button
                                    key={variant.id}
                                    variant="outline"
                                    onClick={() => handleSelectWinner(test.id, variant.id)}
                                  >
                                    <Trophy className="h-4 w-4 mr-2" />
                                    Select {variant.name}
                                  </Button>
                                ))}
                              </div>
                            )}
                          </div>
                        </DialogContent>
                      </Dialog>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteTest(test.id)}
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Best Practices Card */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            A/B Testing Best Practices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Target className="h-5 w-5 text-primary" />
                <span className="font-medium">Test One Variable</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Change only one element per test (subject line, CTA, or content) to identify what drives results.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-5 w-5 text-primary" />
                <span className="font-medium">Sufficient Sample Size</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Aim for at least 1,000 recipients per variant to achieve statistical significance.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-muted/50">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-5 w-5 text-primary" />
                <span className="font-medium">Run Tests Long Enough</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Allow tests to run for at least 7 days to account for day-of-week variations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ABTestingDashboard;
