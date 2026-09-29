import { useState } from 'react'
import { servicesApi, Service } from '../../services/api'
import { useApi } from '../../hooks/useApi'
import {
  PageLoader, ErrorBanner, EmptyState, Modal, ConfirmModal,
  PageHeader, Table, Btn, Field, inputCls,
} from '../../components/admin/ui'

const EMPTY: Partial<Service> = { num: '', title: '', body: '', icon: '', sortOrder: 0 }

export default function Services() {
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing]   = useState<Service | null>(null)
  const [deleting, setDeleting] = useState<Service | null>(null)
  const [form, setForm]         = useState<Partial<Service>>(EMPTY)
  const [saving, setSaving]     = useState(false)
  const [formErr, setFormErr]   = useState('')

  const { data, loading, error, refetch } = useApi(() => servicesApi.list(), [])
  const services = data?.data ?? []

  const openAdd = () => {
    const nextNum = String(services.length + 1).padStart(2, '0')
    setEditing(null)
    setForm({ ...EMPTY, num: nextNum, sortOrder: services.length + 1 })
    setFormErr('')
    setShowForm(true)
  }

  const openEdit = (s: Service) => {
    setEditing(s)
    setForm({ ...s })
    setFormErr('')
    setShowForm(true)
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setFormErr('')
    try {
      editing
        ? await servicesApi.update(editing.id, form)
        : await servicesApi.create(form)
      setShowForm(false)
      refetch()
    } catch (err) {
      setFormErr(err instanceof Error ? err.message : 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!deleting) return
    try {
      await servicesApi.delete(deleting.id)
      setDeleting(null)
      refetch()
    } catch {}
  }

  const set = (k: keyof Service, v: any) => setForm(f => ({ ...f, [k]: v }))

  return (
    <div className="space-y-6">
      <PageHeader
        title="Services"
        subtitle={`${services.length} service${services.length !== 1 ? 's' : ''}`}
        action={<Btn onClick={openAdd}>+ Add Service</Btn>}
      />

      {loading && <PageLoader />}
      {error   && <ErrorBanner message={error} onRetry={refetch} />}

      {!loading && !error && (
        <>
          <Table headers={['#', 'Icon', 'Title', 'Description', 'Order', 'Actions']}>
            {services.map(s => (
              <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3.5 text-xs font-mono text-[#2d6a4f] font-semibold">{s.num}</td>
                <td className="px-5 py-3.5 text-2xl">{s.icon}</td>
                <td className="px-5 py-3.5 text-sm font-semibold text-[#111827]">{s.title}</td>
                <td className="px-5 py-3.5 text-sm text-gray-500 max-w-xs truncate">{s.body}</td>
                <td className="px-5 py-3.5 text-sm text-gray-400">{s.sortOrder}</td>
                <td className="px-5 py-3.5">
                  <div className="flex gap-2">
                    <Btn size="sm" variant="outline" onClick={() => openEdit(s)}>Edit</Btn>
                    <Btn size="sm" variant="danger"  onClick={() => setDeleting(s)}>Del</Btn>
                  </div>
                </td>
              </tr>
            ))}
          </Table>

          {services.length === 0 && (
            <EmptyState
              icon="🛎"
              title="No services yet"
              action={<Btn onClick={openAdd}>+ Add Service</Btn>}
            />
          )}
        </>
      )}

      {showForm && (
        <Modal
          title={editing ? 'Edit Service' : 'Add Service'}
          onClose={() => setShowForm(false)}
        >
          <form onSubmit={handleSave} className="space-y-4">
            {formErr && (
              <div className="bg-red-50 text-red-700 text-sm px-4 py-2.5 rounded-lg font-medium">
                {formErr}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Field label="Number (e.g. 01)">
                <input
                  className={inputCls}
                  value={form.num ?? ''}
                  onChange={e => set('num', e.target.value)}
                  placeholder="01"
                  maxLength={5}
                  required
                />
              </Field>
              <Field label="Icon (emoji)">
                <input
                  className={inputCls}
                  value={form.icon ?? ''}
                  onChange={e => set('icon', e.target.value)}
                  placeholder="🏛"
                  maxLength={4}
                />
              </Field>
            </div>

            <Field label="Title">
              <input
                className={inputCls}
                value={form.title ?? ''}
                onChange={e => set('title', e.target.value)}
                placeholder="Acquisition Advisory"
                required
              />
            </Field>

            <Field label="Description">
              <textarea
                className={inputCls}
                rows={3}
                value={form.body ?? ''}
                onChange={e => set('body', e.target.value)}
                placeholder="Describe this service…"
              />
            </Field>

            <Field label="Sort Order">
              <input
                type="number"
                className={inputCls}
                value={form.sortOrder ?? 0}
                onChange={e => set('sortOrder', parseInt(e.target.value) || 0)}
                min={0}
              />
            </Field>

            <div className="flex gap-3 pt-2">
              <Btn type="submit" disabled={saving}>
                {saving ? 'Saving…' : editing ? 'Update' : 'Create'}
              </Btn>
              <Btn variant="ghost" onClick={() => setShowForm(false)}>Cancel</Btn>
            </div>
          </form>
        </Modal>
      )}

      {deleting && (
        <ConfirmModal
          title="Delete Service"
          message={`Delete "${deleting.title}"? This will remove it from the Services page.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
