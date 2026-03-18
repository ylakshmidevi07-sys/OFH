import { useState } from 'react';
import { useEmailCampaigns, useCreateEmailCampaign, useUpdateEmailCampaign, useDeleteEmailCampaign, useSendEmailCampaign } from '../../../hooks/queries';
import type { EmailCampaign, CampaignType } from '../../../types';
import { Plus, Pencil, Trash2, Send, Mail, AlertTriangle, Megaphone } from 'lucide-react';

const CAMPAIGN_TYPES: { value: CampaignType; label: string; icon: typeof Mail }[] = [
  { value: 'PROMOTION', label: 'Promotion', icon: Megaphone },
  { value: 'ABANDONED_CART', label: 'Abandoned Cart', icon: AlertTriangle },
  { value: 'ANNOUNCEMENT', label: 'Announcement', icon: Mail },
];

const TRIGGER_EVENTS = ['order-created', 'cart-abandoned', 'user-registered'];

const STATUS_COLORS: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  SCHEDULED: 'bg-blue-100 text-blue-800',
  SENDING: 'bg-yellow-100 text-yellow-800',
  SENT: 'bg-green-100 text-green-800',
  FAILED: 'bg-red-100 text-red-800',
};

const EmailCampaignsManagement = () => {
  const { data: campaigns, isLoading } = useEmailCampaigns();
  const createMutation = useCreateEmailCampaign();
  const updateMutation = useUpdateEmailCampaign();
  const deleteMutation = useDeleteEmailCampaign();
  const sendMutation = useSendEmailCampaign();

  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<EmailCampaign | null>(null);
  const [formData, setFormData] = useState({
    name: '', type: 'PROMOTION' as CampaignType, subject: '', htmlContent: '',
    triggerEvent: '', isActive: true, scheduledAt: '',
  });

  const handleSubmit = () => {
    const payload: Partial<EmailCampaign> = {
      name: formData.name, type: formData.type, subject: formData.subject,
      htmlContent: formData.htmlContent, triggerEvent: formData.triggerEvent || undefined,
      isActive: formData.isActive, scheduledAt: formData.scheduledAt || undefined,
    };
    if (editing) {
      updateMutation.mutate({ id: editing.id, ...payload }, { onSuccess: () => { setShowForm(false); setEditing(null); } });
    } else {
      createMutation.mutate(payload, { onSuccess: () => { setShowForm(false); resetForm(); } });
    }
  };

  const startEdit = (c: EmailCampaign) => {
    setEditing(c);
    setFormData({
      name: c.name, type: c.type, subject: c.subject || '', htmlContent: c.htmlContent || '',
      triggerEvent: c.triggerEvent || '', isActive: c.isActive,
      scheduledAt: c.scheduledAt ? new Date(c.scheduledAt).toISOString().slice(0, 16) : '',
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({ name: '', type: 'PROMOTION', subject: '', htmlContent: '', triggerEvent: '', isActive: true, scheduledAt: '' });
  };

  if (isLoading) return <div className="text-center py-10">Loading…</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Email Campaigns</h1>
          <p className="text-sm text-muted-foreground">Create and manage marketing email campaigns.</p>
        </div>
        <button onClick={() => { resetForm(); setEditing(null); setShowForm(!showForm); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary/90">
          <Plus className="h-4 w-4" /> New Campaign
        </button>
      </div>

      {showForm && (
        <div className="rounded-lg border bg-white p-6 space-y-4">
          <h3 className="font-semibold">{editing ? 'Edit Campaign' : 'New Campaign'}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium mb-1">Name</label><input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as CampaignType })} className="w-full rounded border px-3 py-2 text-sm">
                {CAMPAIGN_TYPES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Subject</label><input value={formData.subject} onChange={(e) => setFormData({ ...formData, subject: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div>
              <label className="block text-sm font-medium mb-1">Trigger Event</label>
              <select value={formData.triggerEvent} onChange={(e) => setFormData({ ...formData, triggerEvent: e.target.value })} className="w-full rounded border px-3 py-2 text-sm">
                <option value="">None (manual send)</option>
                {TRIGGER_EVENTS.map((e) => <option key={e} value={e}>{e}</option>)}
              </select>
            </div>
            <div><label className="block text-sm font-medium mb-1">Scheduled At</label><input type="datetime-local" value={formData.scheduledAt} onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })} className="w-full rounded border px-3 py-2 text-sm" /></div>
            <div className="flex items-end"><label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} /> Active</label></div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">HTML Content</label>
            <textarea value={formData.htmlContent} onChange={(e) => setFormData({ ...formData, htmlContent: e.target.value })} className="w-full rounded border px-3 py-2 text-sm font-mono h-32" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleSubmit} className="rounded bg-primary px-4 py-2 text-sm text-white hover:bg-primary/90">{editing ? 'Update' : 'Create'}</button>
            <button onClick={() => { setShowForm(false); setEditing(null); }} className="rounded border px-4 py-2 text-sm hover:bg-gray-50">Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        {campaigns?.map((campaign: EmailCampaign) => (
          <div key={campaign.id} className="rounded-lg border bg-white p-4">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{campaign.name}</h3>
                  <span className={`rounded px-2 py-0.5 text-xs font-medium ${STATUS_COLORS[campaign.status]}`}>{campaign.status}</span>
                  <span className="rounded bg-purple-100 px-2 py-0.5 text-xs font-medium text-purple-800">{campaign.type}</span>
                </div>
                {campaign.subject && <p className="text-sm text-muted-foreground">Subject: {campaign.subject}</p>}
                {campaign.triggerEvent && <p className="text-xs text-muted-foreground">Trigger: {campaign.triggerEvent}</p>}
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>Sent: {campaign.sentCount}</span>
                  <span>Opens: {campaign.openCount}</span>
                  <span>Clicks: {campaign.clickCount}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {campaign.status === 'DRAFT' && (
                  <button onClick={() => { if (confirm('Send this campaign?')) sendMutation.mutate(campaign.id); }} className="inline-flex items-center gap-1 rounded bg-green-600 px-3 py-1.5 text-xs text-white hover:bg-green-700">
                    <Send className="h-3 w-3" /> Send
                  </button>
                )}
                <button onClick={() => startEdit(campaign)} className="p-2 hover:bg-gray-100 rounded"><Pencil className="h-4 w-4" /></button>
                <button onClick={() => deleteMutation.mutate(campaign.id)} className="p-2 hover:bg-red-50 rounded text-red-600"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {(!campaigns || campaigns.length === 0) && <p className="text-center py-8 text-muted-foreground">No email campaigns yet.</p>}
      </div>
    </div>
  );
};

export default EmailCampaignsManagement;

