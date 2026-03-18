import { useState } from 'react';
import {
  usePromoCodes, useCreatePromoCode, useUpdatePromoCode, useDeletePromoCode,
} from '../../../hooks/queries/useAdmin';
import { Plus, Pencil, Trash2, X, Save, Tag } from 'lucide-react';
import type { PromoCode } from '../../../types';

const emptyForm = {
  code: '',
  discountType: 'percentage' as 'percentage' | 'fixed',
  discountValue: 0,
  minOrderValue: '',
  maxDiscount: '',
  usageLimit: '',
  description: '',
  isActive: true,
  startDate: new Date().toISOString().slice(0, 10),
  endDate: '',
};

const PromoCodesManagement = () => {
  const { data: promoCodes, isLoading } = usePromoCodes();
  const createPromo = useCreatePromoCode();
  const updatePromo = useUpdatePromoCode();
  const deletePromo = useDeletePromoCode();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const handleEdit = (promo: PromoCode) => {
    setEditingId(promo.id);
    setForm({
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      minOrderValue: promo.minOrderValue?.toString() || '',
      maxDiscount: promo.maxDiscount?.toString() || '',
      usageLimit: promo.usageLimit?.toString() || '',
      description: promo.description,
      isActive: promo.isActive,
      startDate: promo.startDate ? new Date(promo.startDate).toISOString().slice(0, 10) : '',
      endDate: promo.endDate ? new Date(promo.endDate).toISOString().slice(0, 10) : '',
    });
    setShowForm(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload: any = {
      code: form.code.toUpperCase(),
      discountType: form.discountType,
      discountValue: Number(form.discountValue),
      description: form.description,
      isActive: form.isActive,
      startDate: form.startDate ? new Date(form.startDate).toISOString() : undefined,
      endDate: form.endDate ? new Date(form.endDate).toISOString() : null,
      minOrderValue: form.minOrderValue ? Number(form.minOrderValue) : null,
      maxDiscount: form.maxDiscount ? Number(form.maxDiscount) : null,
      usageLimit: form.usageLimit ? Number(form.usageLimit) : null,
    };

    if (editingId) {
      updatePromo.mutate({ id: editingId, ...payload }, { onSuccess: resetForm });
    } else {
      createPromo.mutate(payload, { onSuccess: resetForm });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-gray-800">Promo Codes</h1>
        <button
          onClick={() => { resetForm(); setShowForm(true); }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> New Promo Code
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">{editingId ? 'Edit Promo Code' : 'Create Promo Code'}</h2>
            <button type="button" onClick={resetForm} className="text-gray-400 hover:text-gray-600">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Code *</label>
              <input
                required
                value={form.code}
                onChange={(e) => setForm((f) => ({ ...f, code: e.target.value }))}
                placeholder="e.g. SAVE20"
                className="w-full rounded-lg border px-3 py-2 text-sm uppercase focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Discount Type</label>
              <select
                value={form.discountType}
                onChange={(e) => setForm((f) => ({ ...f, discountType: e.target.value as any }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed (₹)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Discount Value *</label>
              <input
                required
                type="number"
                min={0}
                value={form.discountValue}
                onChange={(e) => setForm((f) => ({ ...f, discountValue: Number(e.target.value) }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Min Order Value</label>
              <input
                type="number"
                min={0}
                value={form.minOrderValue}
                onChange={(e) => setForm((f) => ({ ...f, minOrderValue: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Max Discount</label>
              <input
                type="number"
                min={0}
                value={form.maxDiscount}
                onChange={(e) => setForm((f) => ({ ...f, maxDiscount: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Usage Limit</label>
              <input
                type="number"
                min={0}
                value={form.usageLimit}
                onChange={(e) => setForm((f) => ({ ...f, usageLimit: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Start Date</label>
              <input
                type="date"
                value={form.startDate}
                onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">End Date</label>
              <input
                type="date"
                value={form.endDate}
                onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
                className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                Active
              </label>
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Description *</label>
            <input
              required
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              className="w-full rounded-lg border px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={createPromo.isPending || updatePromo.isPending}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
            >
              <Save className="h-4 w-4" /> {editingId ? 'Update' : 'Create'}
            </button>
            <button type="button" onClick={resetForm} className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      {/* Promo Codes Table */}
      <div className="overflow-hidden rounded-xl border bg-white shadow-soft">
        <table className="w-full text-left text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 font-medium text-muted-foreground">Code</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Discount</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Usage</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Status</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Validity</th>
              <th className="px-4 py-3 font-medium text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              [...Array(3)].map((_, i) => (
                <tr key={i}><td colSpan={6} className="px-4 py-4"><div className="h-6 animate-pulse rounded bg-gray-100" /></td></tr>
              ))
            ) : promoCodes?.length ? (
              promoCodes.map((promo) => (
                <tr key={promo.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-primary" />
                      <span className="font-mono font-semibold">{promo.code}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">{promo.description}</p>
                  </td>
                  <td className="px-4 py-3 font-medium">
                    {promo.discountType === 'percentage' ? `${promo.discountValue}%` : `₹${promo.discountValue}`}
                    {promo.maxDiscount && <span className="text-xs text-muted-foreground ml-1">(max ₹{promo.maxDiscount})</span>}
                  </td>
                  <td className="px-4 py-3">
                    {promo.usedCount}{promo.usageLimit ? ` / ${promo.usageLimit}` : ''}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${
                      promo.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {promo.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">
                    {new Date(promo.startDate).toLocaleDateString()}
                    {promo.endDate && ` — ${new Date(promo.endDate).toLocaleDateString()}`}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleEdit(promo)} className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 hover:text-blue-600" title="Edit">
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => { if (confirm(`Delete promo code "${promo.code}"?`)) deletePromo.mutate(promo.id); }}
                        className="rounded-lg p-1.5 text-gray-500 hover:bg-red-50 hover:text-red-600" title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No promo codes found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PromoCodesManagement;

