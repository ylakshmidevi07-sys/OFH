import { useState } from 'react';
import { useCategories, useCreateCategory, useUpdateCategory, useDeleteCategory } from '../../../hooks/queries/useCategories';
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react';
import type { Category } from '../../../types';

const CategoriesManagement = () => {
  const { data: categories, isLoading } = useCategories();
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();
  const deleteCategory = useDeleteCategory();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', description: '', image: '' });

  const resetForm = () => {
    setForm({ name: '', description: '', image: '' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (cat: Category) => {
    setEditingId(cat.id);
    setForm({ name: cat.name, description: cat.description || '', image: cat.image || '' });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateCategory.mutate({ id: editingId, ...form }, { onSuccess: resetForm });
    } else {
      createCategory.mutate(form, { onSuccess: resetForm });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-800">Categories</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      {/* Create / Edit Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? 'Edit Category' : 'New Category'}</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">Name *</label>
              <input
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Image URL</label>
              <input
                value={form.image}
                onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createCategory.isPending || updateCategory.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Categories Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Category</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Slug</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Products</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(4)].map((_, i) => (
                <tr key={i}><td colSpan={4} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-gray-100" /></td></tr>
              ))
            ) : (categories as Category[])?.length ? (
              (categories as Category[]).map((cat) => (
                <tr key={cat.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {cat.image && <img src={cat.image} alt={cat.name} className="h-10 w-10 rounded-lg object-cover" />}
                      <div>
                        <p className="font-medium">{cat.name}</p>
                        {cat.description && <p className="text-xs text-muted-foreground line-clamp-1">{cat.description}</p>}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{cat.slug}</td>
                  <td className="px-4 py-3">{cat._count?.products ?? 0}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(cat)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete category "${cat.name}"?`)) deleteCategory.mutate(cat.id); }}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">No categories found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriesManagement;

