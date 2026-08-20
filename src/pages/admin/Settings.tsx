import { useState } from 'react'
import { SiteSettings } from '../../types/index'

export default function Settings() {
  const [settings, setSettings] = useState<SiteSettings>({
    id: '1',
    logo: '🏠',
    primaryColor: '#2d6a4f',
    secondaryColor: '#40916c',
    companyName: 'ARSA REALESTATE',
    tagline: 'Luxury Properties, Expert Solutions',
    email: 'info@arsa-realestate.com',
    phone: '+1 (212) 555-0101',
    address: '123 Park Avenue, New York, NY 10022',
    socialMedia: {
      facebook: 'https://facebook.com/arsarealestate',
      instagram: 'https://instagram.com/arsarealestate',
      linkedin: 'https://linkedin.com/company/arsa-realestate',
      twitter: 'https://twitter.com/arsarealestate',
    },
    updatedAt: new Date().toISOString(),
  })
  const [editMode, setEditMode] = useState(false)
  const [formData, setFormData] = useState(settings)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const handleEdit = () => {
    setEditMode(true)
    setFormData(settings)
  }

  const handleSave = () => {
    setSettings({
      ...formData,
      updatedAt: new Date().toISOString(),
    })
    setEditMode(false)
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const handleCancel = () => {
    setEditMode(false)
    setFormData(settings)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-3xl text-[#111827] mb-2">Website Settings</h2>
          <p className="text-gray-600">Manage website settings, branding, and contact information.</p>
        </div>
        {!editMode && (
          <button
            onClick={handleEdit}
            className="bg-[#2d6a4f] text-white px-6 py-3 rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
          >
            Edit Settings
          </button>
        )}
      </div>

      {/* Success Message */}
      {saveSuccess && (
        <div className="bg-green-100 border border-green-300 text-green-700 px-6 py-4 rounded-lg font-medium">
          ✓ Settings saved successfully!
        </div>
      )}

      {editMode ? (
        // Edit Mode
        <div className="space-y-6">
          {/* Branding Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-display text-xl text-[#111827] mb-6">Branding</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Logo Emoji
                  </label>
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    maxLength={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    placeholder="🏠"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Tagline
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.primaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, primaryColor: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Secondary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryColor: e.target.value })
                      }
                      className="w-12 h-10 border border-gray-300 rounded-lg cursor-pointer"
                    />
                    <input
                      type="text"
                      value={formData.secondaryColor}
                      onChange={(e) =>
                        setFormData({ ...formData, secondaryColor: e.target.value })
                      }
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-display text-xl text-[#111827] mb-6">Contact Information</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                />
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-display text-xl text-[#111827] mb-6">Social Media</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Facebook URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.facebook || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, facebook: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Instagram URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.instagram || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, instagram: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  LinkedIn URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.linkedin || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, linkedin: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="https://linkedin.com/..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Twitter URL
                </label>
                <input
                  type="url"
                  value={formData.socialMedia.twitter || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      socialMedia: { ...formData.socialMedia, twitter: e.target.value },
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="https://twitter.com/..."
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border border-gray-300 text-[#111827] rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 px-6 py-3 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
            >
              Save Changes
            </button>
          </div>
        </div>
      ) : (
        // View Mode
        <div className="space-y-6">
          {/* Branding Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-display text-xl text-[#111827] mb-6">Branding</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-semibold text-gray-600">Logo</label>
                <div className="mt-2 text-5xl">{settings.logo}</div>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Company Name</label>
                <p className="mt-2 font-display text-2xl text-[#111827]">{settings.companyName}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Tagline</label>
                <p className="mt-2 text-gray-700">{settings.tagline}</p>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Colors</label>
                <div className="mt-2 flex gap-4">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-300"
                      style={{ backgroundColor: settings.primaryColor }}
                    />
                    <span className="text-sm text-gray-700">Primary</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-8 rounded-lg border border-gray-300"
                      style={{ backgroundColor: settings.secondaryColor }}
                    />
                    <span className="text-sm text-gray-700">Secondary</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-display text-xl text-[#111827] mb-6">Contact Information</h3>

            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <label className="text-sm font-semibold text-gray-600">Email</label>
                <a
                  href={`mailto:${settings.email}`}
                  className="mt-2 block text-[#2d6a4f] hover:text-[#1b4332] font-medium"
                >
                  {settings.email}
                </a>
              </div>
              <div>
                <label className="text-sm font-semibold text-gray-600">Phone</label>
                <a
                  href={`tel:${settings.phone}`}
                  className="mt-2 block text-[#2d6a4f] hover:text-[#1b4332] font-medium"
                >
                  {settings.phone}
                </a>
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-semibold text-gray-600">Address</label>
                <p className="mt-2 text-gray-700">{settings.address}</p>
              </div>
            </div>
          </div>

          {/* Social Media Section */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-display text-xl text-[#111827] mb-6">Social Media</h3>

            <div className="grid md:grid-cols-2 gap-4">
              {settings.socialMedia.facebook && (
                <a
                  href={settings.socialMedia.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-semibold text-[#111827]">📘 Facebook</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {settings.socialMedia.facebook}
                  </p>
                </a>
              )}
              {settings.socialMedia.instagram && (
                <a
                  href={settings.socialMedia.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-semibold text-[#111827]">📷 Instagram</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {settings.socialMedia.instagram}
                  </p>
                </a>
              )}
              {settings.socialMedia.linkedin && (
                <a
                  href={settings.socialMedia.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-semibold text-[#111827]">💼 LinkedIn</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {settings.socialMedia.linkedin}
                  </p>
                </a>
              )}
              {settings.socialMedia.twitter && (
                <a
                  href={settings.socialMedia.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <p className="font-semibold text-[#111827]">𝕏 Twitter</p>
                  <p className="text-sm text-gray-600 truncate mt-1">
                    {settings.socialMedia.twitter}
                  </p>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
