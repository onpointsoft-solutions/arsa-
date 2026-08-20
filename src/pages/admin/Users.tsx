import { useState } from 'react'
import { User, UserRole } from '../../types/index'

export default function Users() {
  const [users, setUsers] = useState<User[]>([
    {
      id: '1',
      name: 'Admin User',
      email: 'admin@arsa.com',
      role: 'admin',
      avatar: '👤',
      createdAt: new Date(2024, 0, 1).toISOString(),
      updatedAt: new Date(2024, 0, 1).toISOString(),
    },
    {
      id: '2',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      avatar: '👨',
      createdAt: new Date(2024, 1, 15).toISOString(),
      updatedAt: new Date(2024, 1, 15).toISOString(),
    },
    {
      id: '3',
      name: 'Jane Smith',
      email: 'jane@example.com',
      role: 'user',
      avatar: '👩',
      createdAt: new Date(2024, 2, 20).toISOString(),
      updatedAt: new Date(2024, 2, 20).toISOString(),
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<User>>({
    name: '',
    email: '',
    role: 'user',
    avatar: '👤',
  })

  const handleAdd = () => {
    setEditingId(null)
    setFormData({
      name: '',
      email: '',
      role: 'user',
      avatar: '👤',
    })
    setShowForm(true)
  }

  const handleEdit = (user: User) => {
    setEditingId(user.id)
    setFormData(user)
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.email) {
      alert('Please fill in all required fields')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      alert('Please enter a valid email address')
      return
    }

    if (editingId) {
      setUsers(
        users.map((user) =>
          user.id === editingId
            ? {
                ...user,
                ...formData,
                updatedAt: new Date().toISOString(),
              }
            : user
        )
      )
    } else {
      const newUser: User = {
        id: Date.now().toString(),
        name: formData.name || '',
        email: formData.email || '',
        role: (formData.role || 'user') as UserRole,
        avatar: formData.avatar || '👤',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setUsers([...users, newUser])
    }
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter((user) => user.id !== id))
    setDeleteConfirm(null)
  }

  const getRoleBadgeColor = (role: UserRole) => {
    return role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-[#111827] mb-2">Manage Users</h2>
          <p className="text-gray-600">Manage system users, assign roles, and view user details.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#2d6a4f] text-white px-6 py-3 rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
        >
          + Add User
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl text-[#111827] mb-6">
              {editingId ? 'Edit User' : 'Add New User'}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="e.g., John Doe"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="john@example.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Role
                </label>
                <select
                  value={formData.role || 'user'}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value as UserRole })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
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
                Save User
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-[#111827] mb-4">Delete User</h3>
            <p className="text-gray-600 mb-6">Are you sure you want to delete this user? This action cannot be undone.</p>
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

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#111827]">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#111827]">Email</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#111827]">Role</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-[#111827]">Created</th>
              <th className="px-6 py-4 text-right text-sm font-semibold text-[#111827]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-t border-gray-200 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{user.avatar}</span>
                    <span className="font-semibold text-[#111827]">{user.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                <td className="px-6 py-4">
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getRoleBadgeColor(user.role)}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">{formatDate(user.createdAt)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => handleEdit(user)}
                      className="px-3 py-1 text-[#2d6a4f] hover:bg-green-50 rounded text-sm font-medium transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeleteConfirm(user.id)}
                      className="px-3 py-1 text-red-600 hover:bg-red-50 rounded text-sm font-medium transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No users found</p>
          <button
            onClick={handleAdd}
            className="text-[#2d6a4f] hover:text-[#1b4332] font-semibold"
          >
            Create the first user
          </button>
        </div>
      )}
    </div>
  )
}
