import { useState } from 'react'
import { agentsApi, Agent } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import {
  PageLoader, ErrorBanner, EmptyState, Modal, ConfirmModal,
  PageHeader, Table, Btn, Field, inputCls, Pagination,
} from '../../components/admin/ui'
import ImageUpload from '../../components/admin/ImageUpload'

const EMPTY: Partial<Agent> = {
  firstName: '', lastName: '', email: '', phone: '',
  avatar: '', bio: '', specialization: '', licenseNumber: '',
  isActive: true,
}

export default function Agents() {
  const [page, setPage]         = useState(1)
  const [search, setSearch]     = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Agent | null>(null)
  const [deleting, setDeleting] = useState<Agent | null>(null)
  const [form, setForm]         = useState<Partial<Agent>>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [formErr, setFormErr]   = useState('')

  const { data, loading, error, refetch } = useApi(
    () => agentsApi.list(page, 15, search), [page, search]
  )

  const total      = data?.pagination.total ?? 0
  const totalPages = data?.pagination.totalPages ?? 1

  const openAdd = () => {
    setEditing(null); setForm(EMPTY); setFormErr(''); setShowForm(true)
  }

  const openEdit = (a: Agent) => {
    setEditing(a); setForm({ ...a }); setFormErr(''); setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); setSaving(true); setFormErr('')
    try {
      editing
        ? await agentsApi.update(editing.id, form)
        : await agentsApi.create(form)
      setShowForm(false); refetch()
    } catch (err) {
      setFormErr(err instanceof Error ? err.message : 'Save failed')
    } finally { setSaving(false) }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try { await agentsApi.delete(deleting.id); setDeleting(null); refetch() } catch {}
  }

  const set = (k: keyof Agent, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Agents"
        subtitle={`${total} agent${total !== 1 ? 's' : ''}`}
        action={<Btn onClick={openAdd}>+ Add Agent</Btn>}
      />

      <input
        value={search}
        onChange={e => { setSearch(e.target.value); setPage(1) }}
        placeholder="Search agents…"
        className="w-full sm:max-w-xs px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20"
      />

      {loading && <PageLoader />}
      {error   && <ErrorBanner message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          <Table headers={['Agent', 'Email', 'Phone', 'Specialization', 'Status', 'Actions']}>
            {(data?.data ?? []).map(a => (
              <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    {a.avatar
                      ? <img src={a.avatar} alt="" className="w-10 h-10 rounded-full object-cover shrink-0" />
                      : (
                        <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white text-sm font-bold shrink-0">
                          {a.firstName?.[0]?.toUpperCase()}{a.lastName?.[0]?.toUpperCase()}
                        </div>
                      )
                    }
                    <div>
                      <p className="text-sm font-semibold text-[#111827]">{a.firstName} {a.lastName}</p>
                      {a.licenseNumber && <p className="text-xs text-gray-400">#{a.licenseNumber}</p>}
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{a.email}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{a.phone || '—'}</td>
                <td className="px-5 py-3.5 text-sm text-gray-600">{a.specialization || '—'}</td>
                <td className="px-5 py-3.5">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                    a.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'
                  }`}>
                    {a.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Btn size="sm" variant="outline" onClick={() => openEdit(a)}>Edit</Btn>
                    <Btn size="sm" variant="danger"  onClick={() => setDeleting(a)}>Del</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </Table>

          {(data?.data ?? []).length === 0 && (
            <EmptyState
              icon="👤"
              title="No agents yet"
              action={<Btn onClick={openAdd}>+ Add Agent</Btn>}
            />
          )}

          <Pagination page={page} totalPages={totalPages} onPage={setPage} />
        </>
      )}

      {/* Add / Edit Modal */}
      {showForm && (
        <Modal
          title={editing ? 'Edit Agent' : 'Add Agent'}
          onClose={() => setShowForm(false)}
          size="lg"
        >
          <form onSubmit={handleSave} className="space-y-4">
            {formErr && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-lg font-medium">{formErr}</div>
            )}

            {/* Avatar */}
            <ImageUpload
              label="Profile Photo"
              value={form.avatar ?? ''}
              onChange={url => set('avatar', url)}
              shape="circle"
              hint="Agent profile photo"
            />

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="First Name">
                <input
                  className={inputCls}
                  value={form.firstName ?? ''}
                  onChange={e => set('firstName', e.target.value)}
                  required
                />
              </Field>
              <Field label="Last Name">
                <input
                  className={inputCls}
                  value={form.lastName ?? ''}
                  onChange={e => set('lastName', e.target.value)}
                  required
                />
              </Field>
              <Field label="Email">
                <input
                  type="email"
                  className={inputCls}
                  value={form.email ?? ''}
                  onChange={e => set('email', e.target.value)}
                  required
                />
              </Field>
              <Field label="Phone">
                <input
                  type="tel"
                  className={inputCls}
                  value={form.phone ?? ''}
                  onChange={e => set('phone', e.target.value)}
                  placeholder="+254 700 000 000"
                />
              </Field>
              <Field label="Specialization">
                <input
                  className={inputCls}
                  value={form.specialization ?? ''}
                  onChange={e => set('specialization', e.target.value)}
                  placeholder="e.g. Residential, Luxury Villas"
                />
              </Field>
              <Field label="License Number">
                <input
                  className={inputCls}
                  value={form.licenseNumber ?? ''}
                  onChange={e => set('licenseNumber', e.target.value)}
                  placeholder="e.g. RE-12345"
                />
              </Field>
              <Field label="Bio" className="sm:col-span-2">
                <textarea
                  className={inputCls}
                  rows={3}
                  value={form.bio ?? ''}
                  onChange={e => set('bio', e.target.value)}
                  placeholder="Brief description of the agent…"
                />
              </Field>
              <Field label="Status" className="sm:col-span-2">
                <label className="flex items-center gap-2 mt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={!!form.isActive}
                    onChange={e => set('isActive', e.target.checked)}
                    className="w-4 h-4 accent-[#2d6a4f]"
                  />
                  <span className="text-sm text-gray-600">Active (visible on site)</span>
                </label>
              </Field>
            </div>

            <div className="flex gap-3 pt-2 border-t border-gray-100">
              <Btn type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update Agent' : 'Create Agent'}
              </Btn>
              <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmModal
          title="Delete Agent"
          message={`Delete "${deleting.firstName} ${deleting.lastName}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
