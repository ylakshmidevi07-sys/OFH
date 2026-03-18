import { useState } from 'react';
import { usePricingRules, useCreatePricingRule, useUpdatePricingRule, useDeletePricingRule } from '../../../hooks/queries';
import type { PricingRule, PricingRuleType, PricingTargetType } from '../../../types';
import { Plus, Pencil, Trash2, DollarSign, Percent, Layers } from 'lucide-react';

const RULE_TYPES: { value: PricingRuleType; label: string; icon: typeof Percent }[] = [
  { value: 'PERCENTAGE', label: 'Percentage Discount', icon: Percent },
  { value: 'FIXED', label: 'Fixed Discount', icon: DollarSign },
  { value: 'TIERED', label: 'Tiered (Quantity)', icon: Layers },
];

const TARGET_TYPES: { value: PricingTargetType; label: string }[] = [
  { value: 'PRODUCT', label: 'Specific Product' },
  { value: 'CATEGORY', label: 'Category' },
  { value: 'CART', label: 'Entire Cart' },
];

const PricingRulesManagement = () => {
  const { data: rules, isLoading } = usePricingRules();
  const createMutation = useCreatePricingRule();
  const updateMutation = useUpdatePricingRule();
  const deleteMutation = useDeletePricingRule();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<PricingRule | null>(null);
  const [formData, setFormData] = useState({
    name: '', type: 'PERCENTAGE' as PricingRuleType, targetType: 'PRODUCT' as PricingTargetType,
    targetId: '', value: 0, minQuantity: '', priority: 0, isActive: true,
    startDate: '', endDate: '',
  });

  const handleSubmit = () => {
    const payload: any = {
      name: formData.name, type: formData.type, targetType: formData.targetType,
      targetId: formData.targetId || undefined, value: formData.value,
      minQuantity: formData.minQuantity ? parseInt(formData.minQuantity) : undefined,
      priority: formData.priority, isActive: formData.isActive,
      startDate: formData.startDate || undefined, endDate: formData.endDate || undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload }, { onSuccess: () => { setShowForm(false); setEditing(null); } });
    } else {
      createMutation.mutate(payload, { onSuccess: () => { setShowForm(false); resetForm(); } });
    }
  };

  const startEdit = (rule: PricingRule) => {
    setEditing(rule);
    setFormData({
      name: rule.name, type: rule.type, targetType: rule.targetType,
      targetId: rule.targetId || '', value: rule.value,
      minQuantity: rule.minQuantity?.toString() || '', priority: rule.priority,
      isActive: rule.isActive,
      startDate: rule.startDate ? new Date(rule.startDate).toISOString().split('T')[0] : '',
      endDate: rule.endDate ? new Date(rule.endDate).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'PERCENTAGE', targetType: 'PRODUCT', targetId: '', value: 0, minQuantity: '', priority: 0, isActive: true, startDate: '', endDate: '' });
  };

  if (isLoading) return <div className="text-center py-10">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dynamic Pricing Rules</h1>
          <p className="text-sm text-muted-foreground">Configure automatic pricing discounts applied at checkout.</p>
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(!showForm); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Rule
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="font-semibold">{editing ? 'Edit Rule' : 'New Rule'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Name</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as PricingRuleType })} className="w-full rounded border px-3 py-2 text-sm">
                {RULE_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Target</label>
              <select value={formData.targetType} onChange={(e) => setFormData({ ...formData, targetType: e.target.value as PricingTargetType })} className="w-full rounded border px-3 py-2 text-sm">
                {TARGET_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            {formData.targetType !== 'CART' && (
              <div><label className="block text-sm font-medium mb-1">Target ID</label><input value={formData.targetId} onChange={(e) => setFormData({ ...formData, targetId: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" placeholder="Product/Category ID" /></div>
            )}
            <div><label className="block text-sm font-medium mb-1">Value ({formData.type === 'PERCENTAGE' ? '%' : '₹'})</label><input type="number" value={formData.value} onChange={(e) => setFormData({ ...formData, value: parseFloat(e.target.value) || 0 })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Min Quantity</label><input type="number" value={formData.minQuantity} onChange={(e) => setFormData({ ...formData, minQuantity: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" placeholder="Optional" /></div>
            <div><label className="block text-sm font-medium mb-1">Priority</label><input type="number" value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) || 0 })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div className="flex items-end"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active</label></div>
            <div><label className="block text-sm font-medium mb-1">Start Date</label><input type="date" value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">End Date</label><input type="date" value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="overflow-hidden rounded-lg border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50"><tr>
            <th className="px-4 py-3 text-left font-medium">Rule</th>
            <th className="px-4 py-3 text-left font-medium">Type</th>
            <th className="px-4 py-3 text-left font-medium">Target</th>
            <th className="px-4 py-3 text-left font-medium">Value</th>
            <th className="px-4 py-3 text-left font-medium">Priority</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {rules?.map((rule: PricingRule) => (
              <tr key={rule.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{rule.name}</td>
                <td className="px-4 py-3"><span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">{rule.type}</span></td>
                <td className="px-4 py-3">
                  <span className="text-xs">{rule.targetType}</span>
                  {rule.product && <span className="ml-1 text-xs text-muted-foreground">({rule.product.name})</span>}
                  {rule.category && <span className="ml-1 text-xs text-muted-foreground">({rule.category.name})</span>}
                </td>
                <td className="px-4 py-3 font-mono">{rule.type === 'PERCENTAGE' ? `${rule.value}%` : `₹${rule.value}`}</td>
                <td className="px-4 py-3">{rule.priority}</td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {rule.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(rule)} className="p-1 hover:bg-gray-100 rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteMutation.mutate(rule.id)} className="p-1 hover:bg-red-50 rounded text-red-600 ml-1"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!rules || rules.length === 0) && <p className="text-center py-8 text-muted-foreground">No pricing rules configured.</p>}
      </div>
    </div>
  );
};

export default PricingRulesManagement;

