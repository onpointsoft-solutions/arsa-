import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import Login from './pages/Login'
import HomePage from './pages/HomePage'
import UserProfile from './pages/UserProfile'

// Admin Pages
import AdminLayout from './pages/admin/AdminLayout'
import Dashboard from './pages/admin/Dashboard'
import Properties from './pages/admin/Properties'
import Categories from './pages/admin/Categories'
import Locations from './pages/admin/Locations'
import Agents from './pages/admin/Agents'
import Users from './pages/admin/Users'
import Testimonials from './pages/admin/Testimonials'
import Messages from './pages/admin/Messages'
import Settings from './pages/admin/Settings'
import Media from './pages/admin/Media'

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />

          {/* User Protected Routes */}
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute requiredRole="user">
                <UserProfile />
              </ProtectedRoute>
            }
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="properties" element={<Properties />} />
            <Route path="categories" element={<Categories />} />
            <Route path="locations" element={<Locations />} />
            <Route path="agents" element={<Agents />} />
            <Route path="users" element={<Users />} />
            <Route path="testimonials" element={<Testimonials />} />
            <Route path="messages" element={<Messages />} />
            <Route path="media" element={<Media />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Catch all - redirect to home */}
          <Route path="*" element={<HomePage />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
