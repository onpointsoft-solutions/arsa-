import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

const ADMIN_MENU = [
  { label: 'Dashboard', icon: '📊', href: '/admin/dashboard' },
  { label: 'Properties', icon: '🏠', href: '/admin/properties' },
  { label: 'Categories', icon: '📂', href: '/admin/categories' },
  { label: 'Locations', icon: '📍', href: '/admin/locations' },
  { label: 'Agents', icon: '👥', href: '/admin/agents' },
  { label: 'Users', icon: '👨', href: '/admin/users' },
  { label: 'Testimonials', icon: '⭐', href: '/admin/testimonials' },
  { label: 'Messages', icon: '💬', href: '/admin/messages' },
  { label: 'Media', icon: '🖼️', href: '/admin/media' },
  { label: 'Settings', icon: '⚙️', href: '/admin/settings' },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { user, logout } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex h-screen bg-[#f8faf9]">
      {/* Sidebar */}
      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-[#111827] text-white transition-all duration-300 flex flex-col overflow-hidden`}
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/10">
          <Link
            to="/admin/dashboard"
            className="font-display text-xl tracking-widest truncate block"
          >
            {sidebarOpen ? (
              <>
                ARSA<span className="text-[#2d6a4f]">·</span>ADMIN
              </>
            ) : (
              'A'
            )}
          </Link>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-4">
          {ADMIN_MENU.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className={`flex items-center gap-4 px-6 py-3 text-sm font-medium transition-colors ${
                location.pathname === item.href
                  ? 'bg-[#2d6a4f] text-white border-l-4 border-[#40916c]'
                  : 'text-white/70 hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="text-xl">{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Toggle Sidebar */}
        <div className="p-4 border-t border-white/10">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full p-2 rounded-lg hover:bg-white/10 transition-colors text-xl"
            title={sidebarOpen ? 'Collapse' : 'Expand'}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between">
          <div>
            <h1 className="font-display text-2xl text-[#111827]">Admin Dashboard</h1>
          </div>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-semibold text-[#111827]">{user?.name}</p>
              <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-[#2d6a4f] flex items-center justify-center text-white font-semibold">
              {user?.name?.[0].toUpperCase()}
            </div>
            <button
              onClick={handleLogout}
              className="ml-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
            >
              Logout
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  )
}
