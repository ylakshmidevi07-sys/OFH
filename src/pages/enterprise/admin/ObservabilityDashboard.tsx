import { useHealthCheck, useSystemMetrics } from '../../../hooks/queries';
import { Activity, Server, HardDrive, Clock, Cpu, Database } from 'lucide-react';

const ObservabilityDashboard = () => {
  const { data: health, isLoading: healthLoading } = useHealthCheck();
  const { data: metrics, isLoading: metricsLoading } = useSystemMetrics();

  const statusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatUptime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${mins}m`;
  };

  if (healthLoading || metricsLoading) return <div className="text-center py-10">Loading…</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2"><Activity className="h-6 w-6" /> System Observability</h1>
        <p className="text-sm text-muted-foreground">Monitor system health, performance, and throughput in real-time.</p>
      </div>

      {/* Overall Status */}
      {health && (
        <div className={`rounded-lg border p-4 flex items-center gap-4 ${statusColor(health.status)}`}>
          <Server className="h-8 w-8" />
          <div>
            <p className="text-lg font-bold capitalize">{health.status}</p>
            <p className="text-sm">Last check: {new Date(health.timestamp).toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Health Checks */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {health?.checks && Object.entries(health.checks).map(([name, check]) => (
          <div key={name} className="rounded-lg border bg-white p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4" />
                <span className="font-medium capitalize">{name}</span>
              </div>
              <span className={`rounded px-2 py-0.5 text-xs font-medium ${statusColor(check.status)}`}>{check.status}</span>
            </div>
            {check.latency !== undefined && <p className="text-sm text-muted-foreground">Latency: {check.latency}ms</p>}
            {check.error && <p className="text-sm text-red-600">{check.error}</p>}
          </div>
        ))}
      </div>

      {/* System Metrics */}
      {metrics && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground"><Clock className="h-4 w-4" /><span className="text-sm font-medium">Uptime</span></div>
            <p className="text-2xl font-bold">{formatUptime(metrics.uptime)}</p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground"><HardDrive className="h-4 w-4" /><span className="text-sm font-medium">Memory (Heap)</span></div>
            <p className="text-2xl font-bold">{metrics.memory.heapUsed}</p>
            <p className="text-xs text-muted-foreground">of {metrics.memory.heapTotal}</p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground"><Cpu className="h-4 w-4" /><span className="text-sm font-medium">CPU Time</span></div>
            <p className="text-lg font-bold">User: {metrics.cpu.user}</p>
            <p className="text-sm text-muted-foreground">System: {metrics.cpu.system}</p>
          </div>
          <div className="rounded-lg border bg-white p-4">
            <div className="flex items-center gap-2 mb-2 text-muted-foreground"><Activity className="h-4 w-4" /><span className="text-sm font-medium">Throughput (24h)</span></div>
            <p className="text-2xl font-bold">{metrics.throughput.orders24h}</p>
            <p className="text-xs text-muted-foreground">orders processed</p>
          </div>
        </div>
      )}

      {/* Process Info */}
      {metrics && (
        <div className="rounded-lg border bg-white p-4">
          <h3 className="font-semibold mb-2">Process Info</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><span className="text-muted-foreground">PID:</span> <span className="font-mono">{metrics.pid}</span></div>
            <div><span className="text-muted-foreground">Node:</span> <span className="font-mono">{metrics.nodeVersion}</span></div>
            <div><span className="text-muted-foreground">RSS Memory:</span> <span className="font-mono">{metrics.memory.rss}</span></div>
            <div><span className="text-muted-foreground">Inventory Records:</span> <span className="font-mono">{metrics.throughput.inventoryRecords}</span></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ObservabilityDashboard;

