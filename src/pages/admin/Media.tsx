import { useState } from 'react'

interface MediaItem {
  id: string
  name: string
  url: string
  type: 'image' | 'gallery'
  size: string
  uploadedAt: string
}

export default function Media() {
  const [media, setMedia] = useState<MediaItem[]>([
    {
      id: '1',
      name: 'Luxury Penthouse',
      url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&h=300&fit=crop&auto=format',
      type: 'image',
      size: '2.4 MB',
      uploadedAt: new Date(2024, 4, 20).toISOString(),
    },
    {
      id: '2',
      name: 'Modern Kitchen',
      url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&h=300&fit=crop&auto=format',
      type: 'image',
      size: '1.8 MB',
      uploadedAt: new Date(2024, 4, 19).toISOString(),
    },
    {
      id: '3',
      name: 'Living Room',
      url: 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=300&h=300&fit=crop&auto=format',
      type: 'image',
      size: '2.1 MB',
      uploadedAt: new Date(2024, 4, 18).toISOString(),
    },
    {
      id: '4',
      name: 'Beach Property',
      url: 'https://images.unsplash.com/photo-1570129477492-45a003537e1f?w=300&h=300&fit=crop&auto=format',
      type: 'image',
      size: '2.8 MB',
      uploadedAt: new Date(2024, 4, 17).toISOString(),
    },
  ])
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: '',
    url: '',
    size: '',
  })

  const handleAdd = () => {
    setFormData({
      name: '',
      url: '',
      size: '',
    })
    setShowForm(true)
  }

  const handleSave = () => {
    if (!formData.name || !formData.url) {
      alert('Please fill in all required fields')
      return
    }

    const newMedia: MediaItem = {
      id: Date.now().toString(),
      name: formData.name,
      url: formData.url,
      type: 'image',
      size: formData.size || '1.0 MB',
      uploadedAt: new Date().toISOString(),
    }

    setMedia([newMedia, ...media])
    setShowForm(false)
  }

  const handleDelete = (id: string) => {
    setMedia(media.filter((item) => item.id !== id))
    setDeleteConfirm(null)
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
          <h2 className="font-display text-3xl text-[#111827] mb-2">Media Gallery</h2>
          <p className="text-gray-600">Upload and manage images for properties and website.</p>
        </div>
        <button
          onClick={handleAdd}
          className="bg-[#2d6a4f] text-white px-6 py-3 rounded-lg hover:bg-[#1b4332] transition-colors font-semibold"
        >
          + Upload Image
        </button>
      </div>

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-8 w-full max-w-md">
            <h3 className="font-display text-2xl text-[#111827] mb-6">Upload Image</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Image Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="e.g., Luxury Penthouse"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="https://..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tip: Use external URLs or upload to a CDN
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#111827] mb-2">
                  File Size (Optional)
                </label>
                <input
                  type="text"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f]"
                  placeholder="e.g., 2.4 MB"
                />
              </div>

              {/* Preview */}
              {formData.url && (
                <div>
                  <label className="block text-sm font-semibold text-[#111827] mb-2">
                    Preview
                  </label>
                  <img
                    src={formData.url}
                    alt={formData.name}
                    className="w-full h-40 object-cover rounded-lg"
                    onError={() => {
                      // Handle broken image
                    }}
                  />
                </div>
              )}
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
                Upload
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-[#111827] mb-4">Delete Image</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this image? This action cannot be undone.
            </p>
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

      {/* Media Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {media.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
          >
            {/* Image */}
            <div className="relative w-full h-40 bg-gray-100 overflow-hidden group">
              <img
                src={item.url}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white rounded-full text-[#2d6a4f] hover:bg-gray-100 transition-colors"
                    title="View"
                  >
                    👁️
                  </a>
                  <button
                    onClick={() => setDeleteConfirm(item.id)}
                    className="p-2 bg-red-600 rounded-full text-white hover:bg-red-700 transition-colors"
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-[#111827] truncate">{item.name}</h3>
              <div className="flex items-center justify-between text-xs text-gray-500 mt-3">
                <span>{item.size}</span>
                <span>{formatDate(item.uploadedAt)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {media.length === 0 && (
        <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
          <p className="text-gray-500 text-lg mb-4">No images uploaded yet</p>
          <button
            onClick={handleAdd}
            className="text-[#2d6a4f] hover:text-[#1b4332] font-semibold"
          >
            Upload your first image
          </button>
        </div>
      )}

      {/* Storage Info */}
      {media.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <p className="text-sm text-blue-700 font-medium">
            💾 Total images: {media.length} | Storage used: {media.reduce((sum, item) => {
              const sizeNum = parseFloat(item.size)
              return sum + sizeNum
            }, 0).toFixed(1)} MB
          </p>
        </div>
      )}
    </div>
  )
}
