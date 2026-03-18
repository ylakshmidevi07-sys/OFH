import { useSalesAnalytics, useTopProducts } from '../../../hooks/queries/useAdmin';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const COLORS = ['hsl(142,50%,35%)', 'hsl(28,85%,55%)', 'hsl(210,70%,50%)', 'hsl(280,60%,50%)', 'hsl(45,90%,55%)'];

const Analytics = () => {
  const { data: sales, isLoading: salesLoading } = useSalesAnalytics();
  const { data: topProducts, isLoading: productsLoading } = useTopProducts();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-800">Analytics</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-white p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="mt-1 text-2xl font-bold">₹{(sales?.totalRevenue || 0).toLocaleString('en-IN')}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-1 text-2xl font-bold">{sales?.totalOrders || 0}</p>
        </div>
        <div className="rounded-xl border bg-white p-5 shadow-soft">
          <p className="text-sm text-muted-foreground">Avg Order Value</p>
          <p className="mt-1 text-2xl font-bold">₹{(sales?.averageOrderValue || 0).toLocaleString('en-IN')}</p>
        </div>
      </div>

      {/* Daily Sales Chart */}
      <div className="rounded-xl border bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-display text-lg font-semibold">Daily Sales (Last 30 Days)</h2>
        {salesLoading ? (
          <div className="h-72 animate-pulse rounded bg-gray-50" />
        ) : sales?.dailySales?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={sales.dailySales}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="date" fontSize={10} tickLine={false} />
              <YAxis fontSize={12} tickLine={false} tickFormatter={(v) => `₹${v}`} />
              <Tooltip formatter={(v: number) => [`₹${v.toLocaleString('en-IN')}`, 'Revenue']} />
              <Bar dataKey="revenue" fill="hsl(142,50%,35%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : <p className="py-12 text-center text-muted-foreground">No sales data available.</p>}
      </div>

      {/* Orders by Status */}
      <div className="rounded-xl border bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-display text-lg font-semibold">Orders by Status</h2>
        {sales?.ordersByStatus?.length ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={sales.ordersByStatus} cx="50%" cy="50%" outerRadius={100} dataKey="count" nameKey="status" label={({ status, count }) => `${status}: ${count}`}>
                {sales.ordersByStatus.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        ) : <p className="py-12 text-center text-muted-foreground">No order data.</p>}
      </div>

      {/* Top Products */}
      <div className="rounded-xl border bg-white p-6 shadow-soft">
        <h2 className="mb-4 font-display text-lg font-semibold">Top Selling Products</h2>
        {productsLoading ? (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => <div key={i} className="h-12 animate-pulse rounded bg-gray-50" />)}
          </div>
        ) : topProducts?.length ? (
          <div className="space-y-3">
            {topProducts.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {idx + 1}
                  </span>
                  {item.product?.images?.[0] && (
                    <img src={item.product.images[0]} alt={item.product.name} className="h-10 w-10 rounded-lg object-cover" />
                  )}
                  <div>
                    <p className="font-medium">{item.product?.name}</p>
                    <p className="text-xs text-muted-foreground">{item.orderCount} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">₹{item.totalRevenue.toLocaleString('en-IN')}</p>
                  <p className="text-xs text-muted-foreground">{item.totalQuantitySold} units</p>
                </div>
              </div>
            ))}
          </div>
        ) : <p className="py-12 text-center text-muted-foreground">No product data.</p>}
      </div>
    </div>
  );
};

export default Analytics;

