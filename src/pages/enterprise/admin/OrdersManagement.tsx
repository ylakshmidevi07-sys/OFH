import { useState } from 'react';
import { useAdminOrders, useUpdateOrderStatus } from '../../../hooks/queries/useOrders';
import type { OrderStatus } from '../../../types';

const ORDER_STATUSES = ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

const OrdersManagement = () => {
  const [params, setParams] = useState<{ page: number; status?: string }>({ page: 1 });
  const { data, isLoading } = useAdminOrders(params);
  const updateStatus = useUpdateOrderStatus();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-800">Orders</h1>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setParams({ page: 1 })}
          className={`rounded-full px-3 py-1.5 text-xs font-medium ${!params.status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          All
        </button>
        {ORDER_STATUSES.map((status) => (
          <button
            key={status}
            onClick={() => setParams({ page: 1, status })}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${params.status === status ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
          >
            {status}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Order #</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Customer</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Items</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Total</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Date</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={7} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-gray-100" /></td></tr>
              ))
            ) : data?.orders?.length ? (
              data.orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium">{order.orderNumber}</td>
                  <td className="px-4 py-3">
                    <p className="text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                    <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                  </td>
                  <td className="px-4 py-3">{order.items?.length || 0} items</td>
                  <td className="px-4 py-3 font-medium">₹{order.totalAmount?.toLocaleString('en-IN')}</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                      className="rounded-lg border bg-white px-2 py-1 text-xs font-medium focus:border-primary focus:outline-none"
                    >
                      {ORDER_STATUSES.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs font-medium text-primary hover:underline">View</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-muted-foreground">No orders found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} orders)
          </p>
          <div className="flex gap-2">
            <button
              disabled={data.pagination.page <= 1}
              onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrdersManagement;

