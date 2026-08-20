import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function UserProfile() {
  const { user, logout, updateProfile } = useAuth()
  const navigate = useNavigate()
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })
  const [savedFavorites, setSavedFavorites] = useState([
    { id: 1, title: 'Villa Castellan', location: 'Bel Air, Los Angeles', price: '$24,500,000' },
    { id: 2, title: 'The Meridian Penthouse', location: 'South Beach, Miami', price: '$18,750,000' },
  ])

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const handleSaveProfile = () => {
    updateProfile({
      name: formData.name,
      email: formData.email,
    })
    setEditMode(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-8 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-display text-3xl text-[#111827]">My Profile</h1>
            <p className="text-gray-600 mt-1">Manage your account and preferences</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-6 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="md:col-span-1">
            <div className="bg-white border border-gray-200 rounded-xl p-6 text-center">
              <div className="w-24 h-24 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white font-display text-4xl mx-auto mb-4">
                {user?.name?.[0].toUpperCase()}
              </div>
              <h2 className="font-display text-2xl text-[#111827] mb-1">{user?.name}</h2>
              <p className="text-gray-600 mb-4">{user?.email}</p>
              <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold capitalize">
                {user?.role}
              </span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="md:col-span-2 space-y-6">
            {/* Account Information */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-xl text-[#111827]">Account Information</h3>
                {!editMode && (
                  <button
                    onClick={() => setEditMode(true)}
                    className="text-[#2d6a4f] hover:text-[#1b4332] font-semibold text-sm"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editMode ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-[#111827] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    />
                  </div>
                  <div className="flex gap-3 pt-4">
                    <button
                      onClick={handleSaveProfile}
                      className="px-4 py-2 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-gray-600">Full Name</p>
                    <p className="text-[#111827] font-semibold">{user?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Email Address</p>
                    <p className="text-[#111827] font-semibold">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Account Type</p>
                    <p className="text-[#111827] font-semibold capitalize">{user?.role}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Preferences */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-display text-xl text-[#111827] mb-4">Preferences</h3>
              <div className="space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-[#111827] font-medium">Email notifications for new properties</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded" />
                  <span className="text-[#111827] font-medium">Email notifications for saved searches</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" className="w-4 h-4 rounded" />
                  <span className="text-[#111827] font-medium">Marketing emails and offers</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Saved Properties */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-display text-xl text-[#111827] mb-6">Saved Properties ({savedFavorites.length})</h3>

          {savedFavorites.length > 0 ? (
            <div className="space-y-4">
              {savedFavorites.map((property) => (
                <div
                  key={property.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h4 className="font-semibold text-[#111827]">{property.title}</h4>
                    <p className="text-sm text-gray-600">{property.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-display text-lg text-[#2d6a4f] font-semibold">{property.price}</p>
                    <button className="text-red-600 hover:text-red-700 text-xs font-semibold mt-1">
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center py-8">No saved properties yet. Start exploring!</p>
          )}
        </div>

        {/* Account Security */}
        <div className="mt-8 bg-white border border-gray-200 rounded-xl p-6">
          <h3 className="font-display text-xl text-[#111827] mb-4">Security</h3>
          <button className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold">
            Change Password
          </button>
        </div>
      </div>
    </div>
  )
}
