import { useState } from 'react'
import { FEATURED_LOCATIONS } from '../../components/data/constants'
import { Location } from '../../types'

export default function Locations() {
  const [locations, setLocations] = useState<Location[]>(
    FEATURED_LOCATIONS.map(l => ({
      ...l,
      id: Math.random().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }))
  )
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Location>>({
    city: '',
    properties: 0,
    image: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setLocations(locations.map(l =>
        l.id === editingId ? { ...l, ...formData, updatedAt: new Date().toISOString() } : l
      ))
      setEditingId(null)
    } else {
      setLocations([
        ...locations,
        {
          ...formData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        } as Location,
      ])
    }
    setFormData({ city: '', properties: 0, image: '' })
    setShowForm(false)
  }

  const handleEdit = (location: Location) => {
    setFormData(location)
    setEditingId(location.id)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    if (confirm('Delete this location?')) {
      setLocations(locations.filter(l => l.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-[#111827]">Location Management</h2>
          <p className="text-gray-600 mt-1">Manage featured locations</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm)
            setEditingId(null)
            setFormData({ city: '', properties: 0, image: '' })
          }}
          className="px-6 py-2.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] font-semibold"
        >
          {showForm ? '✕ Cancel' : '+ Add Location'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">City</label>
              <input
                type="text"
                value={formData.city || ''}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-2">Properties</label>
              <input
                type="number"
                value={formData.properties || 0}
                onChange={(e) => setFormData({ ...formData, properties: parseInt(e.target.value) })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-[#111827] mb-2">Image URL</label>
              <input
                type="url"
                value={formData.image || ''}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>
            <button
              type="submit"
              className="md:col-span-2 px-6 py-2.5 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] font-semibold"
            >
              {editingId ? 'Update' : 'Create'}
            </button>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {locations.map((loc) => (
          <div key={loc.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <img src={loc.image} alt={loc.city} className="w-full h-40 object-cover" />
            <div className="p-6">
              <h3 className="font-display text-xl text-[#111827] mb-1">{loc.city}</h3>
              <p className="text-sm text-gray-600 mb-4">{loc.properties} properties</p>
              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(loc)}
                  className="flex-1 px-3 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 font-semibold text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(loc.id)}
                  className="flex-1 px-3 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 font-semibold text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
