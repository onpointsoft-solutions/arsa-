import { useState } from 'react'
import { Testimonial } from '../../types/index'
import { testimonials } from '../../components/data/testimonials'

export default function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(
    testimonials.slice(0, 6).map((t, i) => ({
      ...t,
      createdAt: new Date(2024, i, 1).toISOString(),
      updatedAt: new Date(2024, i, 1).toISOString(),
    }))
  )
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Testimonial>>({
    name: '',
    title: '',
    quote: '',
    avatar: '👤',
    rating: 5,
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      name: '',
      title: '',
      quote: '',
      avatar: '👤',
      rating: 5,
    })
    setShowForm(true)
  }

  const handleEdit = (item: Testimonial) => {
    setEditingId(item.id)
    setFormData(item)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.quote) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      setItems(
        items.map((item) =>
          item.id === editingId
            ? {
                ...item,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      )
    } else {
      const newItem: Testimonial = {
        id: Date.now().toString(),
        name: formData.name || '',
        title: formData.title || '',
        quote: formData.quote || '',
        avatar: formData.avatar || '👤',
        rating: formData.rating || 5,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setItems([...items, newItem])
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
    setDeleteConfirm(null)
  }

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-[#111827] mb-2">Manage Testimonials</h2>
          <p className="text-gray-600">Manage client testimonials and reviews.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#2d6a4f] text-white px-6 py-3 rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
        >
          + Add Testimonial
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl text-[#111827] mb-6">
              {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Client Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="e.g., John Smith"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Title/Occupation
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="e.g., Business Owner"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Testimonial *
                </label>
                <textarea
                  value={formData.quote || ''}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f] h-20"
                  placeholder="Client testimonial..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Rating (1-5)
                  </label>
                  <select
                    value={formData.rating || 5}
                    onChange={(e) =>
                      setFormData({ ...formData, rating: parseInt(e.target.value) })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  >
                    <option value="1">1 ⭐</option>
                    <option value="2">2 ⭐</option>
                    <option value="3">3 ⭐</option>
                    <option value="4">4 ⭐</option>
                    <option value="5">5 ⭐</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Avatar Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.avatar || '👤'}
                    onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    placeholder="👤"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowForm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-[#111827] rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="flex-1 px-4 py-2 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] transition-colors font-medium"
              >
                Save Testimonial
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-[#111827] mb-4">Delete Testimonial</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this testimonial? This action cannot be undone.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-2 border border-gray-300 text-[#111827] rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{item.avatar}</span>
                <div>
                  <h3 className="font-semibold text-[#111827]">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.title}</p>
                </div>
              </div>
              <span className="text-lg">{renderStars(item.rating)}</span>
            </div>

            <p className="text-gray-600 mb-6 italic line-clamp-3">"{item.quote}"</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleEdit(item)}
                className="flex-1 px-3 py-2 border border-[#2d6a4f] text-[#2d6a4f] rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
              >
                Edit
              </button>
              <button
                onClick={() => setDeleteConfirm(item.id)}
                className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No testimonials found</p>
          <button
            onClick={handleAdd}
            className="text-[#2d6a4f] hover:text-[#1b4332] font-semibold"
          >
            Create the first testimonial
          </button>
        </div>
      )}
    </div>
  )
}
