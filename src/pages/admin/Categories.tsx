import { useState } from 'react'
import { PROPERTY_CATEGORIES } from '../../components/data/constants'
import { Category } from '../../types'

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>(
    PROPERTY_CATEGORIES.map(c => ({
      ...c,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  )
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    icon: '',
    count: 0,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setCategories(categories.map(c =>
        c.id === editingId ? { ...c, ...formData, updatedAt: new Date().toISOString() } : c
      ))
      setEditingId(null)
    } else {
      setCategories([
        ...categories,
        {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Category,
      ])
    }
    setFormData({ name: '', icon: '', count: 0 })
    setShowForm(false)
  }

  const handleEdit = (category: Category) => {
    setFormData(category)
    setEditingId(category.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this category?')) {
      setCategories(categories.filter(c => c.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-[#111827]">Category Management</h2>
          <p className="text-gray-600 mt-1">Manage property categories</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ name: '', icon: '', count: 0 })
          }}
          className="px-6 py-2.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] font-semibold"
        >
          {showForm ? '✕ Cancel' : '+ Add Category'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Name</label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Icon</label>
              <input
                type="text"
                value={formData.icon || ''}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                placeholder="e.g., 🏠"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Count</label>
              <input
                type="number"
                value={formData.count || 0}
                onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <button
              type="submit"
              className="md:col-span-3 px-6 py-2.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] font-semibold"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <div key={cat.id} className="bg-white border border-gray-200 rounded-xl p-6">
            <div className="text-4xl mb-3">{cat.icon}</div>
            <h3 className="font-semibold text-[#111827] mb-2">{cat.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{cat.count} properties</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(cat)}
                className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(cat.id)}
                className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
