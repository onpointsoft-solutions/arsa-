import { useState } from 'react'
import { Inquiry } from '../../types/index'

export default function Messages() {
  const [messages, setMessages] = useState<Inquiry[]>([
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah@example.com',
      message: 'I am interested in the luxury penthouse in Manhattan. Can you provide more details?',
      status: 'new',
      createdAt: new Date(2024, 4, 20, 10, 30).toISOString(),
    },
    {
      id: '2',
      name: 'Michael Chen',
      email: 'michael@example.com',
      message: 'Looking for investment properties in Miami area',
      status: 'responded',
      createdAt: new Date(2024, 4, 19, 14, 15).toISOString(),
      respondedAt: new Date(2024, 4, 19, 16, 45).toISOString(),
    },
    {
      id: '3',
      name: 'Emma Rodriguez',
      email: 'emma@example.com',
      message: 'I need assistance with selling my property',
      status: 'resolved',
      createdAt: new Date(2024, 4, 18, 9, 0).toISOString(),
      respondedAt: new Date(2024, 4, 18, 11, 30).toISOString(),
    },
  ])
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null)
  const [replyText, setReplyText] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const handleStatusChange = (id: string, newStatus: 'new' | 'responded' | 'resolved') => {
    setMessages(
      messages.map((msg) =>
        msg.id === id
          ? {
              ...msg,
              status: newStatus,
              respondedAt:
                newStatus === 'responded' || newStatus === 'resolved'
                  ? msg.respondedAt || new Date().toISOString()
                  : undefined,
            }
          : msg
      )
    )
  }

  const handleSendReply = (messageId: string) => {
    if (!replyText.trim()) {
      alert('Please write a reply')
      return
    }

    handleStatusChange(messageId, 'responded')
    setReplyText('')
    setSelectedMessage(null)
  }

  const handleDelete = (id: string) => {
    setMessages(messages.filter((msg) => msg.id !== id))
    setDeleteConfirm(null)
    if (selectedMessage === id) {
      setSelectedMessage(null)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-700'
      case 'responded':
        return 'bg-yellow-100 text-yellow-700'
      case 'resolved':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const selectedMsg = messages.find((m) => m.id === selectedMessage)
  const newMessagesCount = messages.filter((m) => m.status === 'new').length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-3xl text-[#111827] mb-2">Manage Messages</h2>
        <p className="text-gray-600">
          Manage contact form submissions and inquiries
          {newMessagesCount > 0 && (
            <span className="ml-2 inline-block px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-semibold">
              {newMessagesCount} new
            </span>
          )}
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="md:col-span-1">
          <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="font-semibold text-[#111827]">Messages</h3>
            </div>

            <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {messages.length === 0 ? (
                <div className="p-6 text-center text-gray-500">
                  <p>No messages</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <button
                    key={msg.id}
                    onClick={() => setSelectedMessage(msg.id)}
                    className={`w-full text-left p-4 hover:bg-gray-50 transition-colors border-l-4 ${
                      selectedMessage === msg.id
                        ? 'border-[#2d6a4f] bg-green-50'
                        : msg.status === 'new'
                        ? 'border-blue-500'
                        : msg.status === 'responded'
                        ? 'border-yellow-500'
                        : 'border-green-500'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="font-semibold text-[#111827] truncate">{msg.name}</div>
                      <span className={`text-xs font-semibold px-2 py-1 rounded whitespace-nowrap ml-2 ${getStatusColor(msg.status)}`}>
                        {msg.status}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{msg.email}</p>
                    <p className="text-xs text-gray-500 mt-2">{formatDate(msg.createdAt)}</p>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Message Detail */}
        <div className="md:col-span-2">
          {selectedMsg ? (
            <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-6">
              {/* Message Header */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-display text-xl text-[#111827]">{selectedMsg.name}</h3>
                    <a
                      href={`mailto:${selectedMsg.email}`}
                      className="text-[#2d6a4f] hover:text-[#1b4332] font-medium"
                    >
                      {selectedMsg.email}
                    </a>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(selectedMsg.status)}`}>
                    {selectedMsg.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500">{formatDate(selectedMsg.createdAt)}</p>
              </div>

              {/* Message Content */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{selectedMsg.message}</p>
              </div>

              {/* Status Buttons */}
              <div className="flex gap-2">
                <button
                  onClick={() => handleStatusChange(selectedMsg.id, 'new')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedMsg.status === 'new'
                      ? 'bg-blue-100 text-blue-700'
                      : 'border border-blue-300 text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Mark New
                </button>
                <button
                  onClick={() => handleStatusChange(selectedMsg.id, 'responded')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedMsg.status === 'responded'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'border border-yellow-300 text-yellow-600 hover:bg-yellow-50'
                  }`}
                >
                  Mark Responded
                </button>
                <button
                  onClick={() => handleStatusChange(selectedMsg.id, 'resolved')}
                  className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                    selectedMsg.status === 'resolved'
                      ? 'bg-green-100 text-green-700'
                      : 'border border-green-300 text-green-600 hover:bg-green-50'
                  }`}
                >
                  Mark Resolved
                </button>
              </div>

              {/* Delete Button */}
              <div className="flex gap-2">
                <button
                  onClick={() => setDeleteConfirm(selectedMsg.id)}
                  className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors font-medium text-sm"
                >
                  Delete Message
                </button>
              </div>

              {/* Reply Section */}
              {selectedMsg.status !== 'resolved' && (
                <div className="border-t border-gray-200 pt-6">
                  <h4 className="font-semibold text-[#111827] mb-3">Send Reply</h4>
                  <textarea
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Type your reply here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#2d6a4f] mb-3 h-24"
                  />
                  <button
                    onClick={() => handleSendReply(selectedMsg.id)}
                    className="w-full px-4 py-2 bg-[#2d6a4f] text-white rounded-lg hover:bg-[#1b4332] transition-colors font-medium"
                  >
                    Send Reply
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border border-gray-200 rounded-xl p-12 text-center">
              <p className="text-gray-500 text-lg">Select a message to view details</p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-sm">
            <h3 className="font-display text-xl text-[#111827] mb-4">Delete Message</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this message? This action cannot be undone.
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
    </div>
  )
}
