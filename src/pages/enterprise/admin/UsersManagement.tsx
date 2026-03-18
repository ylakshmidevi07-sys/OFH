import { useAdminUsers, useBlockUser } from '../../../hooks/queries/useAdmin';
import { useState } from 'react';
import { Shield, ShieldOff } from 'lucide-react';

const UsersManagement = () => {
  const [params, setParams] = useState({ page: 1, limit: 20 });
  const { data, isLoading } = useAdminUsers(params);
  const blockUser = useBlockUser();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-800">Users</h1>

      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">User</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Role</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Orders</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Joined</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-gray-100" /></td></tr>
              ))
            ) : data?.users?.length ? (
              data.users.map((user: any) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'
                    }`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3">{user._count?.orders || 0}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>{user.isActive ? 'Active' : 'Blocked'}</span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    {user.isActive ? (
                      <button
                        onClick={() => { if (confirm(`Block ${user.email}?`)) blockUser.mutate(user.id); }}
                        className="flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50"
                      >
                        <ShieldOff className="h-3 w-3" /> Block
                      </button>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Shield className="h-3 w-3" /> Blocked
                      </span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No users found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-end gap-2">
          <button
            disabled={params.page <= 1}
            onClick={() => setParams((p) => ({ ...p, page: p.page - 1 }))}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
          >Previous</button>
          <span className="text-sm text-muted-foreground">Page {params.page} of {data.pagination.totalPages}</span>
          <button
            disabled={params.page >= data.pagination.totalPages}
            onClick={() => setParams((p) => ({ ...p, page: p.page + 1 }))}
            className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
          >Next</button>
        </div>
      )}
    </div>
  );
};

export default UsersManagement;

