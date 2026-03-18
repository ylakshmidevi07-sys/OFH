import { useState } from 'react';
import { useAdminBanners, useCreateBanner, useUpdateBanner, useDeleteBanner } from '../../../hooks/queries';
import type { Banner, BannerPlacement } from '../../../types';
import { Plus, Pencil, Trash2, Image as ImageIcon, ExternalLink } from 'lucide-react';

const PLACEMENTS: { value: BannerPlacement; label: string }[] = [
  { value: 'HOMEPAGE', label: 'Homepage' },
  { value: 'CATEGORY_PAGE', label: 'Category Page' },
  { value: 'CHECKOUT', label: 'Checkout' },
  { value: 'SIDEBAR', label: 'Sidebar' },
];

const BannersManagement = () => {
  const { data: banners, isLoading } = useAdminBanners();
  const createMutation = useCreateBanner();
  const updateMutation = useUpdateBanner();
  const deleteMutation = useDeleteBanner();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Banner | null>(null);
  const [formData, setFormData] = useState({
    title: '', subtitle: '', imageUrl: '', linkUrl: '',
    placement: 'HOMEPAGE' as BannerPlacement, isActive: true,
    startDate: '', endDate: '',
  });

  const handleSubmit = () => {
    const payload: Partial<Banner> = {
      ...formData,
      startDate: formData.startDate || undefined,
      endDate: formData.endDate || undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload }, { onSuccess: () => { setShowForm(false); setEditing(null); } });
    } else {
      createMutation.mutate(payload, { onSuccess: () => { setShowForm(false); resetForm(); } });
    }
  };

  const startEdit = (banner: Banner) => {
    setEditing(banner);
    setFormData({
      title: banner.title, subtitle: banner.subtitle || '', imageUrl: banner.imageUrl,
      linkUrl: banner.linkUrl || '', placement: banner.placement, isActive: banner.isActive,
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split('T')[0] : '',
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split('T')[0] : '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ title: '', subtitle: '', imageUrl: '', linkUrl: '', placement: 'HOMEPAGE', isActive: true, startDate: '', endDate: '' });
  };

  if (isLoading) return <div className="text-center py-10">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Banners & Campaigns</h1>
          <p className="text-sm text-muted-foreground">Manage promotional banners with scheduling.</p>
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(!showForm); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Banner
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="font-semibold">{editing ? 'Edit Banner' : 'New Banner'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Title</label><input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Subtitle</label><input value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Image URL</label><input value={formData.imageUrl} onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div><label className="block text-sm font-medium mb-1">Link URL</label><input value={formData.linkUrl} onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Placement</label>
              <select value={formData.placement} onChange={(e) => setFormData({ ...formData, placement: e.target.value as BannerPlacement })} className="w-full rounded border px-3 py-2 text-sm">
                {PLACEMENTS.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
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
            <th className="px-4 py-3 text-left font-medium">Banner</th>
            <th className="px-4 py-3 text-left font-medium">Placement</th>
            <th className="px-4 py-3 text-left font-medium">Schedule</th>
            <th className="px-4 py-3 text-left font-medium">Status</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr></thead>
          <tbody>
            {banners?.map((banner: Banner) => (
              <tr key={banner.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {banner.imageUrl ? (
                      <img src={banner.imageUrl} alt="" className="h-10 w-16 object-cover rounded" />
                    ) : (
                      <div className="h-10 w-16 bg-gray-100 rounded flex items-center justify-center"><ImageIcon className="h-4 w-4 text-gray-400" /></div>
                    )}
                    <div>
                      <p className="font-medium">{banner.title}</p>
                      {banner.linkUrl && <p className="text-xs text-blue-600 flex items-center gap-1"><ExternalLink className="h-3 w-3" />{banner.linkUrl}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3"><span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">{banner.placement}</span></td>
                <td className="px-4 py-3 text-xs">
                  {banner.startDate && <span>{new Date(banner.startDate).toLocaleDateString()}</span>}
                  {banner.startDate && banner.endDate && <span> – </span>}
                  {banner.endDate && <span>{new Date(banner.endDate).toLocaleDateString()}</span>}
                  {!banner.startDate && !banner.endDate && <span className="text-muted-foreground">Always</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${banner.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'}`}>
                    {banner.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => startEdit(banner)} className="p-1 hover:bg-gray-100 rounded"><Pencil className="h-4 w-4" /></button>
                  <button onClick={() => deleteMutation.mutate(banner.id)} className="p-1 hover:bg-red-50 rounded text-red-600 ml-1"><Trash2 className="h-4 w-4" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {(!banners || banners.length === 0) && <p className="text-center py-8 text-muted-foreground">No banners yet.</p>}
      </div>
    </div>
  );
};

export default BannersManagement;

