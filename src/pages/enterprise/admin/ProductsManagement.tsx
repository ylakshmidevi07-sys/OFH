import { useState } from 'react';
import { useProducts, useCreateProduct, useUpdateProduct, useDeleteProduct } from '../../../hooks/queries/useProducts';
import { useCategories } from '../../../hooks/queries/useCategories';
import type { ProductQueryParams, Product } from '../../../types';
import { Plus, Pencil, Trash2, Search, X, Save } from 'lucide-react';

interface ProductForm {
  name: string;
  description: string;
  details: string;
  price: number;
  unit: string;
  images: string;
  categoryId: string;
  isNew: boolean;
  isActive: boolean;
  stock: number;
}

const emptyForm: ProductForm = {
  name: '', description: '', details: '', price: 0, unit: 'kg',
  images: '', categoryId: '', isNew: false, isActive: true, stock: 0,
};

const ProductsManagement = () => {
  const [params, setParams] = useState<ProductQueryParams>({ page: 1, limit: 20 });
  const [search, setSearch] = useState('');
  const { data, isLoading } = useProducts({ ...params, search: search || undefined });
  const { data: categories } = useCategories();
  const createProduct = useCreateProduct();
  const updateProduct = useUpdateProduct();
  const deleteProduct = useDeleteProduct();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  const resetForm = () => { setForm(emptyForm); setEditingId(null); setShowForm(false); };

  const handleEdit = (p: Product) => {
    setEditingId(p.id);
    setForm({
      name: p.name, description: p.description,
      details: (p.details || []).join('\n'),
      price: p.price, unit: p.unit,
      images: (p.images || []).join('\n'),
      categoryId: p.categoryId, isNew: p.isNew, isActive: p.isActive,
      stock: p.inventory?.stock || 0,
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      name: form.name, description: form.description,
      details: form.details.split('\n').map(s => s.trim()).filter(Boolean),
      price: Number(form.price), unit: form.unit,
      images: form.images.split('\n').map(s => s.trim()).filter(Boolean),
      categoryId: form.categoryId, isNew: form.isNew, isActive: form.isActive,
      stock: Number(form.stock),
    };
    if (editingId) {
      updateProduct.mutate({ id: editingId, ...payload }, { onSuccess: resetForm });
    } else {
      createProduct.mutate(payload, { onSuccess: resetForm });
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setParams((p) => ({ ...p, page: 1 }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-800">Products</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? 'Edit Product' : 'New Product'}</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600"><X className="h-4 w-4" /></button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Name *</label>
              <input required value={form.name} onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Category *</label>
              <select required value={form.categoryId} onChange={(e) => setForm(f => ({ ...f, categoryId: e.target.value }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none">
                <option value="">Select category</option>
                {(categories as any[])?.map((c: any) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Price *</label>
              <input required type="number" min={0} step={0.01} value={form.price}
                onChange={(e) => setForm(f => ({ ...f, price: Number(e.target.value) }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Unit</label>
              <input value={form.unit} onChange={(e) => setForm(f => ({ ...f, unit: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Stock</label>
              <input type="number" min={0} value={form.stock}
                onChange={(e) => setForm(f => ({ ...f, stock: Number(e.target.value) }))
                }
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div className="flex items-end gap-4">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={form.isNew} onChange={(e) => setForm(f => ({ ...f, isNew: e.target.checked }))} className="rounded border-gray-300" />
                New
              </label>
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm(f => ({ ...f, isActive: e.target.checked }))} className="rounded border-gray-300" />
                Active
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description *</label>
            <textarea required value={form.description} onChange={(e) => setForm(f => ({ ...f, description: e.target.value }))} rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary" />
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Details (one per line)</label>
              <textarea value={form.details} onChange={(e) => setForm(f => ({ ...f, details: e.target.value }))} rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Image URLs (one per line)</label>
              <textarea value={form.images} onChange={(e) => setForm(f => ({ ...f, images: e.target.value }))} rows={3}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none" />
            </div>
          </div>
          <div className="flex gap-2">
            <button type="submit" disabled={createProduct.isPending || updateProduct.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50">
              <Save className="h-4 w-4" /> {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Search & Filter */}
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full rounded-lg border bg-white py-2.5 pl-10 pr-4 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
        <button type="submit" className="rounded-lg bg-gray-100 px-4 py-2 text-sm font-medium hover:bg-gray-200">
          Search
        </button>
      </form>

      {/* Product Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Product</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Price</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Stock</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-gray-100" /></td></tr>
              ))
            ) : data?.products?.length ? (
              data.products.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {product.images?.[0] && (
                        <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded-lg object-cover" />
                      )}
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{product.category?.name || '-'}</td>
                  <td className="px-4 py-3 font-medium">₹{product.price}/{product.unit}</td>
                  <td className="px-4 py-3">
                    <span className={`font-medium ${(product.inventory?.stock || 0) <= 10 ? 'text-red-600' : 'text-green-600'}`}>
                      {product.inventory?.stock || 0}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {product.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(product)}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this product?')) {
                            deleteProduct.mutate(product.id);
                          }
                        }}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No products found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {data?.pagination && data.pagination.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {((data.pagination.page - 1) * data.pagination.limit) + 1} to{' '}
            {Math.min(data.pagination.page * data.pagination.limit, data.pagination.total)} of{' '}
            {data.pagination.total} products
          </p>
          <div className="flex gap-2">
            <button
              disabled={data.pagination.page <= 1}
              onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) - 1 }))}
              className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50"
            >
              Previous
            </button>
            <button
              disabled={data.pagination.page >= data.pagination.totalPages}
              onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
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

export default ProductsManagement;

