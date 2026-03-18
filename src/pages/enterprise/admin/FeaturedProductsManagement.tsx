import { useState } from 'react';
import {
  useAdminFeaturedProducts,
  useAddFeaturedProduct,
  useUpdateFeaturedProduct,
  useRemoveFeaturedProduct,
} from '../../../hooks/queries/useAdmin';
import { useProducts } from '../../../hooks/queries/useProducts';
import { Plus, Trash2, GripVertical, Eye, EyeOff } from 'lucide-react';

const FeaturedProductsManagement = () => {
  const { data: featuredProducts, isLoading } = useAdminFeaturedProducts();
  const { data: productsData } = useProducts({ limit: 100 });
  const addFeatured = useAddFeaturedProduct();
  const updateFeatured = useUpdateFeaturedProduct();
  const removeFeatured = useRemoveFeaturedProduct();

  const [selectedProductId, setSelectedProductId] = useState('');

  // Filter out already-featured products
  const availableProducts = (productsData?.products || []).filter(
    (p) => !featuredProducts?.some((fp) => fp.productId === p.id),
  );

  const handleAdd = () => {
    if (!selectedProductId) return;
    const nextPosition = (featuredProducts?.length || 0) + 1;
    addFeatured.mutate({ productId: selectedProductId, position: nextPosition });
    setSelectedProductId('');
  };

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-gray-800">Featured Products</h1>
      <p className="text-sm text-muted-foreground">
        Curate which products appear in the homepage "Featured Products" section.
      </p>

      {/* Add product */}
      <div className="flex gap-3 items-end">
        <div className="flex-1">
          <label className="mb-1 block text-sm font-medium">Add Product to Featured</label>
          <select
            value={selectedProductId}
            onChange={(e) => setSelectedProductId(e.target.value)}
            className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none"
          >
            <option value="">Select a product...</option>
            {availableProducts.map((p) => (
              <option key={p.id} value={p.id}>{p.name} — ₹{p.price}/{p.unit}</option>
            ))}
          </select>
        </div>
        <button
          onClick={handleAdd}
          disabled={!selectedProductId || addFeatured.isPending}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus className="h-4 w-4" /> Add
        </button>
      </div>

      {/* Featured products list */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3 font-medium text-muted-foreground">#</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Visible</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-gray-100" /></td></tr>
              ))
            ) : featuredProducts?.length ? (
              featuredProducts.map((fp, idx) => (
                <tr key={fp.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <GripVertical className="h-4 w-4" />
                      <span className="font-medium">{idx + 1}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {fp.product?.images?.[0] && (
                        <img src={fp.product.images[0]} alt={fp.product.name} className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium">{fp.product?.name}</p>
                        <p className="text-xs text-muted-foreground">{fp.product?.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{fp.product?.category?.name || '—'}</td>
                  <td className="px-4 py-3 font-medium">₹{fp.product?.price}/{fp.product?.unit}</td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => updateFeatured.mutate({ id: fp.id, isActive: !fp.isActive })}
                      className={`flex items-center gap-1 rounded-lg px-2 py-1 text-xs font-medium ${
                        fp.isActive
                          ? 'text-green-600 hover:bg-green-50'
                          : 'text-gray-400 hover:bg-gray-100'
                      }`}
                    >
                      {fp.isActive ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                      {fp.isActive ? 'Visible' : 'Hidden'}
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => { if (confirm('Remove from featured?')) removeFeatured.mutate(fp.id); }}
                      className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">
                  No featured products yet. Add products above to curate the homepage.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FeaturedProductsManagement;

