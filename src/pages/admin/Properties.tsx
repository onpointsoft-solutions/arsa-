import { useState } from 'react'
import { properties as initialProperties } from '../../components/data/properties'
import { Property } from '../../types'

export default function Properties() {
  const [properties, setProperties] = useState<Property[]>(
    initialProperties.map(p => ({
      ...p,
      id: p.id || Math.random().toString(),
      description: p.description || 'Beautiful property with stunning views.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  )
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Property>>({
    title: '',
    location: '',
    price: 0,
    beds: 0,
    baths: 0,
    sqft: '',
    type: 'House',
    tag: 'Featured',
    img: '',
    description: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setProperties(properties.map(p =>
        p.id === editingId
          ? { ...p, ...formData, updatedAt: new Date().toISOString() }
          : p
      ))
      setEditingId(null)
    } else {
      setProperties([
        ...properties,
        {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Property,
      ])
    }
    setFormData({
      title: '',
      location: '',
      price: 0,
      beds: 0,
      baths: 0,
      sqft: '',
      type: 'House',
      tag: 'Featured',
      img: '',
      description: '',
    })
    setShowForm(false)
  }

  const handleEdit = (property: Property) => {
    setFormData(property)
    setEditingId(property.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this property?')) {
      setProperties(properties.filter(p => p.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-[#111827]">Properties Management</h2>
          <p className="text-gray-600 mt-1">Manage all property listings</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({
              title: '',
              location: '',
              price: 0,
              beds: 0,
              baths: 0,
              sqft: '',
              type: 'House',
              tag: 'Featured',
              img: '',
              description: '',
            })
          }}
          className="px-6 py-2.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
        >
          {showForm ? '✕ Cancel' : '+ Add Property'}
        </button>
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-display text-xl text-[#111827] mb-6">
            {editingId ? 'Edit Property' : 'Add New Property'}
          </h3>
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Title</label>
              <input
                type="text"
                value={formData.title || ''}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Location</label>
              <input
                type="text"
                value={formData.location || ''}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Price ($)</label>
              <input
                type="number"
                value={formData.price || 0}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Type</label>
              <select
                value={formData.type || 'House'}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              >
                <option>House</option>
                <option>Apartment</option>
                <option>Land</option>
                <option>Commercial</option>
                <option>Luxury Home</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Bedrooms</label>
              <input
                type="number"
                value={formData.beds || 0}
                onChange={(e) => setFormData({ ...formData, beds: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Bathrooms</label>
              <input
                type="number"
                value={formData.baths || 0}
                onChange={(e) => setFormData({ ...formData, baths: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Square Feet</label>
              <input
                type="text"
                value={formData.sqft || ''}
                onChange={(e) => setFormData({ ...formData, sqft: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Tag</label>
              <select
                value={formData.tag || 'Featured'}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              >
                <option>Featured</option>
                <option>New</option>
                <option>Exclusive</option>
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-2">Description</label>
              <textarea
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-2">Image URL</label>
              <input
                type="url"
                value={formData.img || ''}
                onChange={(e) => setFormData({ ...formData, img: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div className="md:col-span-2 flex gap-3">
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
              >
                {editingId ? 'Update' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-6 py-2.5 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Properties Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111827]">Title</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111827]">Location</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111827]">Price</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111827]">Type</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-[#111827]">Beds/Baths</th>
                <th className="px-6 py-3 text-center text-sm font-semibold text-[#111827]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {properties.map((property) => (
                <tr key={property.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-[#111827]">{property.title}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">{property.location}</td>
                  <td className="px-6 py-4 text-sm font-semibold text-[#2d6a4f]">
                    ${property.price?.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{property.type}</td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {property.beds}/{property.baths}
                  </td>
                  <td className="px-6 py-4 text-center text-sm space-x-2">
                    <button
                      onClick={() => handleEdit(property)}
                      className="px-3 py-1 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(property.id)}
                      className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Empty State */}
      {properties.length === 0 && (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <p className="text-gray-600 font-semibold">No properties found</p>
          <button
            onClick={() => setShowForm(true)}
            className="mt-4 px-6 py-2.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
          >
            + Add Your First Property
          </button>
        </div>
      )}
    </div>
  )
}
