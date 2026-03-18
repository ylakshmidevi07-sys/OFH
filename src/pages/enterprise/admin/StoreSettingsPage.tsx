import { useState } from 'react';
import { useStoreSettings, useUpdateStoreSettings } from '../../../hooks/queries';
import { Save, Store } from 'lucide-react';

const StoreSettingsPage = () => {
  const { data: settings, isLoading } = useStoreSettings();
  const updateMutation = useUpdateStoreSettings();
  const [formData, setFormData] = useState<Record<string, any> | null>(null);

  // Initialize form data from fetched settings
  const form = formData || settings || {};

  const handleChange = (field: string, value: any) => {
    setFormData({ ...form, [field]: value });
  };

  const handleSave = () => {
    if (!formData) return;
    const { id, createdAt, updatedAt, ...payload } = formData;
    updateMutation.mutate(payload);
  };

  if (isLoading) return <div className="text-center py-10">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2"><Store className="h-6 w-6" /> Store Settings</h1>
          <p className="text-sm text-muted-foreground">Configure global store behavior and appearance.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={!formData || updateMutation.isPending}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" /> {updateMutation.isPending ? 'Saving…' : 'Save Changes'}
        </button>
      </div>

      {updateMutation.isSuccess && (
        <div className="rounded-lg bg-green-50 border border-green-200 px-4 py-3 text-sm text-green-800">Settings saved successfully.</div>
      )}

      <div className="grid gap-6 lg:grid-cols-2">
        {/* General */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="font-semibold border-b pb-2">General</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Store Name</label>
            <input value={form.storeName || ''} onChange={(e) => handleChange('storeName', e.target.value)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Currency</label>
            <select value={form.currency || 'INR'} onChange={(e) => handleChange('currency', e.target.value)} className="w-full rounded border px-3 py-2 text-sm">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Support Email</label>
            <input value={form.supportEmail || ''} onChange={(e) => handleChange('supportEmail', e.target.value)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Support Phone</label>
            <input value={form.supportPhone || ''} onChange={(e) => handleChange('supportPhone', e.target.value)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
        </div>

        {/* Pricing */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="font-semibold border-b pb-2">Pricing & Shipping</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Tax Rate (%)</label>
            <input type="number" step="0.1" value={form.taxRate ?? 5} onChange={(e) => handleChange('taxRate', parseFloat(e.target.value) || 0)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Base Shipping Cost (₹)</label>
            <input type="number" value={form.shippingBaseCost ?? 50} onChange={(e) => handleChange('shippingBaseCost', parseFloat(e.target.value) || 0)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Free Shipping Minimum (₹)</label>
            <input type="number" value={form.freeShippingMin ?? 500} onChange={(e) => handleChange('freeShippingMin', parseFloat(e.target.value) || 0)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
        </div>

        {/* SEO */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="font-semibold border-b pb-2">SEO</h3>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Title</label>
            <input value={form.metaTitle || ''} onChange={(e) => handleChange('metaTitle', e.target.value)} className="w-full rounded border px-3 py-2 text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Meta Description</label>
            <textarea value={form.metaDescription || ''} onChange={(e) => handleChange('metaDescription', e.target.value)} className="w-full rounded border px-3 py-2 text-sm h-20" />
          </div>
        </div>

        {/* Theme */}
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="font-semibold border-b pb-2">Theme Config (JSON)</h3>
          <textarea
            value={typeof form.themeConfig === 'string' ? form.themeConfig : JSON.stringify(form.themeConfig || {}, null, 2)}
            onChange={(e) => {
              try { handleChange('themeConfig', JSON.parse(e.target.value)); } catch { handleChange('themeConfig', e.target.value); }
            }}
            className="w-full rounded border px-3 py-2 text-sm font-mono h-32"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreSettingsPage;

