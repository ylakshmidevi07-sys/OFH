import { useInventory, useUpdateInventory } from '../../../hooks/queries/useAdmin';
import { useState } from 'react';
import { Save, AlertTriangle } from 'lucide-react';

const InventoryManagement = () => {
  const { data: inventory, isLoading } = useInventory();
  const updateInventory = useUpdateInventory();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editStock, setEditStock] = useState(0);

  const handleSave = (productId: string) => {
    updateInventory.mutate({ productId, stock: editStock });
    setEditingId(null);
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-800">Inventory</h1>

      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Reserved</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Available</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Threshold</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-gray-100" /></td></tr>
              ))
            ) : inventory?.length ? (
              inventory.map((item: any) => {
                const available = item.stock - item.reservedStock;
                const isLow = item.stock <= item.lowStockThreshold;
                return (
                  <tr key={item.id} className={`hover:bg-gray-50 ${isLow ? 'bg-amber-50/50' : ''}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {item.product?.images?.[0] && (
                          <img src={item.product.images[0]} alt={item.product.name} className="h-10 w-10 rounded-lg object-cover" />
                        )}
                        <div>
                          <p className="font-medium">{item.product?.name}</p>
                          {isLow && (
                            <span className="flex items-center gap-1 text-xs text-amber-600">
                              <AlertTriangle className="h-3 w-3" /> Low stock
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {editingId === item.productId ? (
                        <input
                          type="number"
                          value={editStock}
                          onChange={(e) => setEditStock(Number(e.target.value))}
                          className="w-20 rounded border px-2 py-1 text-sm"
                          min={0}
                        />
                      ) : (
                        <span className={`font-medium ${isLow ? 'text-red-600' : ''}`}>{item.stock}</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{item.reservedStock}</td>
                    <td className="px-4 py-3 font-medium text-green-600">{available}</td>
                    <td className="px-4 py-3 text-muted-foreground">{item.lowStockThreshold}</td>
                    <td className="px-4 py-3">
                      {editingId === item.productId ? (
                        <button
                          onClick={() => handleSave(item.productId)}
                          className="flex items-center gap-1 rounded-lg bg-primary px-2 py-1 text-xs font-medium text-white hover:bg-primary/90"
                        >
                          <Save className="h-3 w-3" /> Save
                        </button>
                      ) : (
                        <button
                          onClick={() => { setEditingId(item.productId); setEditStock(item.stock); }}
                          className="text-xs font-medium text-primary hover:underline"
                        >
                          Edit Stock
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No inventory data.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryManagement;

