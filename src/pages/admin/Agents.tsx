import { useState } from 'react'
import { Agent } from '../../types/index'
import { FEATURED_AGENTS } from '../../components/data/constants'

export default function Agents() {
  const [agents, setAgents] = useState<Agent[]>(
    FEATURED_AGENTS.map((agent, i) => ({
      id: String(agent.id),
      name: agent.name,
      title: agent.title,
      properties: agent.properties,
      image: agent.image,
      phone: agent.phone,
      rating: 4.5 + (i * 0.1),
      createdAt: new Date(2024, 0, i + 1).toISOString(),
      updatedAt: new Date(2024, 0, i + 1).toISOString(),
    }))
  )
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<Agent>>({
    name: '',
    title: '',
    properties: 0,
    image: '',
    phone: '',
    rating: 0,
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      name: '',
      title: '',
      properties: 0,
      image: '',
      phone: '',
      rating: 0,
    })
    setShowForm(true)
  }

  const handleEdit = (agent: Agent) => {
    setEditingId(agent.id)
    setFormData(agent)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.phone) {
      alert('Please fill in all required fields')
      return
    }

    if (editingId) {
      setAgents(
        agents.map((agent) =>
          agent.id === editingId
            ? {
                ...agent,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : agent
        )
      )
    } else {
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: formData.name || '',
        title: formData.title || '',
        properties: formData.properties || 0,
        image: formData.image || '',
        phone: formData.phone || '',
        rating: formData.rating || 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setAgents([...agents, newAgent])
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setAgents(agents.filter((agent) => agent.id !== id))
    setDeleteConfirm(null)
  }

  const renderStars = (rating: number) => {
    return '⭐'.repeat(Math.round(rating))
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-[#111827] mb-2">Manage Agents</h2>
          <p className="text-gray-600">Manage featured agents with profiles, properties sold, and ratings.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#2d6a4f] text-white px-6 py-3 rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
        >
          + Add Agent
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl text-[#111827] mb-6">
              {editingId ? 'Edit Agent' : 'Add New Agent'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Agent Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="e.g., Sarah Johnson"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="e.g., Senior Agent"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Phone *
                </label>
                <input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="+1 (212) 555-0101"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Properties Sold
                  </label>
                  <input
                    type="number"
                    value={formData.properties || 0}
                    onChange={(e) => setFormData({ ...formData, properties: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Rating (0-5)
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating || 0}
                    onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image || ''}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="https://..."
                />
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
                Save Agent
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-[#111827] mb-4">Delete Agent</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this agent? This action cannot be undone.</p>
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

      {/* Agents Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img src={agent.image} alt={agent.name} className="w-full h-48 object-cover" />

            <div className="p-6">
              <h3 className="font-display text-lg text-[#111827] mb-1">{agent.name}</h3>
              <p className="text-sm text-gray-500 mb-4">{agent.title}</p>

              <div className="space-y-3 mb-4 pb-4 border-b border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Properties Sold</span>
                  <span className="font-semibold text-[#2d6a4f]">{agent.properties}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-semibold">{renderStars(agent.rating)} ({agent.rating.toFixed(1)})</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Phone</span>
                  <span className="font-semibold text-[#111827]">{agent.phone}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(agent)}
                  className="flex-1 px-3 py-2 border border-[#2d6a4f] text-[#2d6a4f] rounded-lg hover:bg-green-50 transition-colors font-medium text-sm"
                >
                  Edit
                </button>
                <button
                  onClick={() => setDeleteConfirm(agent.id)}
                  className="flex-1 px-3 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {agents.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No agents found</p>
          <button
            onClick={handleAdd}
            className="text-[#2d6a4f] hover:text-[#1b4332] font-semibold"
          >
            Create the first agent
          </button>
        </div>
      )}
    </div>
  )
}
