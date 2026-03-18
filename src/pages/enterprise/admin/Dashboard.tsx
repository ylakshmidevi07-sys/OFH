import { useDashboard } from '../../../hooks/queries/useAdmin';
import {
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  TrendingUp,
  AlertTriangle,
  Clock,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';

const Dashboard = () => {
  const { data: dashboard, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="font-display text-2xl font-bold">Dashboard</h1>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-xl bg-white" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-xl bg-white" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        <p>Failed to load dashboard data. Please try again.</p>
      </div>
    );
  }

  const stats = dashboard?.stats;

  const statCards = [
    { label: 'Total Revenue', value: `₹${(stats?.totalRevenue || 0).toLocaleString('en-IN')}`, icon: DollarSign, bgLight: 'bg-green-50', iconColor: 'text-green-600' },
    { label: 'Total Orders', value: stats?.totalOrders || 0, icon: ShoppingCart, bgLight: 'bg-blue-50', iconColor: 'text-blue-600' },
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, bgLight: 'bg-purple-50', iconColor: 'text-purple-600' },
    { label: 'Active Products', value: stats?.totalProducts || 0, icon: Package, bgLight: 'bg-amber-50', iconColor: 'text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-800">Dashboard</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>Last updated: {new Date().toLocaleTimeString()}</span>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="rounded-xl border bg-white p-5 shadow-soft transition-shadow hover:shadow-elevated">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <p className="mt-1 text-2xl font-bold text-gray-800">{stat.value}</p>
                </div>
                <div className={`rounded-xl ${stat.bgLight} p-3`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pending & New Users */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-soft">
          <div className="rounded-lg bg-orange-50 p-2"><TrendingUp className="h-5 w-5 text-orange-500" /></div>
          <div>
            <p className="text-sm text-muted-foreground">Pending Orders</p>
            <p className="text-xl font-bold">{stats?.pendingOrders || 0}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow-soft">
          <div className="rounded-lg bg-cyan-50 p-2"><Users className="h-5 w-5 text-cyan-500" /></div>
          <div>
            <p className="text-sm text-muted-foreground">New Users Today</p>
            <p className="text-xl font-bold">{stats?.newUsersToday || 0}</p>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="rounded-xl border bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-display text-lg font-semibold text-gray-800">Monthly Revenue</h2>
        {dashboard?.monthlyRevenue?.length ? (
          <ResponsiveContainer width="100%" height={320}>
            <BarChart data={dashboard.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Revenue']} contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Bar dataKey="revenue" fill="hsl(142, 50%, 35%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-muted-foreground">No revenue data yet.</div>
        )}
      </div>

      {/* Orders Line Chart */}
      <div className="rounded-xl border bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-display text-lg font-semibold text-gray-800">Monthly Orders</h2>
        {dashboard?.monthlyRevenue?.length ? (
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={dashboard.monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" fontSize={12} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e5e7eb' }} />
              <Line type="monotone" dataKey="orders" stroke="hsl(28, 85%, 55%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="flex h-64 items-center justify-center text-muted-foreground">No order data yet.</div>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Orders */}
        <div className="rounded-xl border bg-white p-6 shadow-soft">
          <h2 className="mb-4 font-display text-lg font-semibold text-gray-800">Recent Orders</h2>
          <div className="space-y-3">
            {dashboard?.recentOrders?.length ? (
              dashboard.recentOrders.slice(0, 5).map((order: any) => (
                <div key={order.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{order.orderNumber}</p>
                    <p className="text-xs text-muted-foreground">{order.user?.firstName} {order.user?.lastName}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold">₹{order.totalAmount?.toLocaleString('en-IN')}</p>
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                      order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                      order.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                      'bg-blue-100 text-blue-700'
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))
            ) : <p className="text-sm text-muted-foreground">No recent orders.</p>}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="rounded-xl border bg-white p-6 shadow-soft">
          <h2 className="mb-4 flex items-center gap-2 font-display text-lg font-semibold text-gray-800">
            <AlertTriangle className="h-5 w-5 text-amber-500" />Low Stock Alerts
          </h2>
          <div className="space-y-3">
            {dashboard?.lowStockItems?.length ? (
              dashboard.lowStockItems.map((item: any) => (
                <div key={item.id} className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
                  <div className="flex items-center gap-3">
                    {item.product?.images?.[0] && <img src={item.product.images[0]} alt={item.product.name} className="h-10 w-10 rounded-lg object-cover" />}
                    <div>
                      <p className="text-sm font-medium">{item.product?.name}</p>
                      <p className="text-xs text-muted-foreground">Threshold: {item.lowStockThreshold}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-amber-600">{item.stock}</p>
                    <p className="text-xs text-muted-foreground">in stock</p>
                  </div>
                </div>
              ))
            ) : <p className="text-sm text-muted-foreground">All stock levels healthy. ✅</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

