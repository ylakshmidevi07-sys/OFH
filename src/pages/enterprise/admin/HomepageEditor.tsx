import { useState } from 'react';
import { useHomepageSections, useCreateHomepageSection, useUpdateHomepageSection, useDeleteHomepageSection, useReorderHomepageSections } from '../../../hooks/queries';
import type { HomepageSection, HomepageSectionType } from '../../../types';
import { ArrowUp, ArrowDown, Plus, Pencil, Trash2, Eye, EyeOff } from 'lucide-react';

const SECTION_TYPES: { value: HomepageSectionType; label: string }[] = [
  { value: 'HERO', label: 'Hero Banner' },
  { value: 'FEATURED_PRODUCTS', label: 'Featured Products' },
  { value: 'BANNER', label: 'Promotional Banner' },
  { value: 'CATEGORIES', label: 'Categories Grid' },
  { value: 'NEWSLETTER', label: 'Newsletter Signup' },
  { value: 'CUSTOM', label: 'Custom Section' },
];

const HomepageEditor = () => {
  const { data: sections, isLoading } = useHomepageSections();
  const createMutation = useCreateHomepageSection();
  const updateMutation = useUpdateHomepageSection();
  const deleteMutation = useDeleteHomepageSection();
  const reorderMutation = useReorderHomepageSections();

  const [showForm, setShowForm] = useState(false);
  const [editingSection, setEditingSection] = useState<HomepageSection | null>(null);
  const [formData, setFormData] = useState({
    type: 'HERO' as HomepageSectionType,
    title: '',
    subtitle: '',
    isActive: true,
    config: '{}',
  });

  const handleCreate = () => {
    let config = {};
    try { config = JSON.parse(formData.config); } catch { /* keep empty */ }
    createMutation.mutate(
      { type: formData.type, title: formData.title, subtitle: formData.subtitle, isActive: formData.isActive, config },
      { onSuccess: () => { setShowForm(false); resetForm(); } },
    );
  };

  const handleUpdate = () => {
    if (!editingSection) return;
    let config = {};
    try { config = JSON.parse(formData.config); } catch { /* keep empty */ }
    updateMutation.mutate(
      { id: editingSection.id, type: formData.type, title: formData.title, subtitle: formData.subtitle, isActive: formData.isActive, config },
      { onSuccess: () => { setEditingSection(null); setShowForm(false); resetForm(); } },
    );
  };

  const handleMoveUp = (index: number) => {
    if (!sections || index === 0) return;
    const ids = sections.map((s: HomepageSection) => s.id);
    [ids[index - 1], ids[index]] = [ids[index], ids[index - 1]];
    reorderMutation.mutate(ids);
  };

  const handleMoveDown = (index: number) => {
    if (!sections || index === sections.length - 1) return;
    const ids = sections.map((s: HomepageSection) => s.id);
    [ids[index], ids[index + 1]] = [ids[index + 1], ids[index]];
    reorderMutation.mutate(ids);
  };

  const startEdit = (section: HomepageSection) => {
    setEditingSection(section);
    setFormData({
      type: section.type,
      title: section.title || '',
      subtitle: section.subtitle || '',
      isActive: section.isActive,
      config: JSON.stringify(section.config || {}, null, 2),
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ type: 'HERO', title: '', subtitle: '', isActive: true, config: '{}' });
  };

  if (isLoading) return <div className="text-center py-10">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Homepage Layout</h1>
          <p className="text-sm text-muted-foreground">Manage homepage sections and their order.</p>
        </div>
        <button
          onClick={() => { resetForm(); setEditingSection(null); setShowForm(!showForm); }}
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90"
        >
          <Plus className="h-4 w-4" /> Add Section
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="font-semibold">{editingSection ? 'Edit Section' : 'New Section'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as HomepageSectionType })} className="w-full rounded border px-3 py-2 text-sm">
                {SECTION_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" placeholder="Section title" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Subtitle</label>
              <input value={formData.subtitle} onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" placeholder="Section subtitle" />
            </div>
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} />
                Active
              </label>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Config (JSON)</label>
            <textarea value={formData.config} onChange={(e) => setFormData({ ...formData, config: e.target.value })} className="w-full rounded border px-3 py-2 text-sm font-mono h-24" />
          </div>
          <div className="flex gap-2">
            <button onClick={editingSection ? handleUpdate : handleCreate} className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">
              {editingSection ? 'Update' : 'Create'}
            </button>
            <button onClick={() => { setShowForm(false); setEditingSection(null); }} className="rounded border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {sections?.map((section: HomepageSection, index: number) => (
          <div key={section.id} className="flex items-center gap-3 rounded-lg border bg-white p-4">
            <div className="flex flex-col gap-1">
              <button onClick={() => handleMoveUp(index)} disabled={index === 0} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ArrowUp className="h-3 w-3" /></button>
              <button onClick={() => handleMoveDown(index)} disabled={index === (sections?.length || 0) - 1} className="p-1 hover:bg-gray-100 rounded disabled:opacity-30"><ArrowDown className="h-3 w-3" /></button>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="inline-flex rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">{section.type}</span>
                {section.isActive ? <Eye className="h-3 w-3 text-green-600" /> : <EyeOff className="h-3 w-3 text-gray-400" />}
              </div>
              <p className="text-sm font-medium">{section.title || `(${section.type})`}</p>
              {section.subtitle && <p className="text-xs text-muted-foreground">{section.subtitle}</p>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => startEdit(section)} className="p-2 hover:bg-gray-100 rounded"><Pencil className="h-4 w-4" /></button>
              <button onClick={() => deleteMutation.mutate(section.id)} className="p-2 hover:bg-red-50 rounded text-red-600"><Trash2 className="h-4 w-4" /></button>
            </div>
          </div>
        ))}
        {(!sections || sections.length === 0) && (
          <p className="text-center py-8 text-muted-foreground">No homepage sections configured. Click "Add Section" to get started.</p>
        )}
      </div>
    </div>
  );
};

export default HomepageEditor;

