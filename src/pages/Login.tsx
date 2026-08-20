import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(true)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = async (role: 'admin' | 'user') => {
    setIsLoading(true)
    const credentials = role === 'admin'
      ? { email: 'admin@arsarealestate.com', password: 'admin@123' }
      : { email: 'buyer@example.com', password: 'user@123' }

    try {
      await login(credentials.email, credentials.password)
      navigate(role === 'admin' ? '/admin/dashboard' : '/user/profile')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="font-display text-4xl text-white mb-2">
            ARSA<span className="text-[#40916c]">·</span>REALESTATE
          </h1>
          <p className="text-white/70">Admin & User Portal</p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-xl shadow-xl p-8">
          <h2 className="font-display text-2xl text-[#111827] mb-6">Sign In</h2>

          {/* Demo Credentials Notice */}
          {showDemo && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800 font-medium mb-3">Demo Credentials:</p>
              <div className="space-y-2 text-xs text-blue-700">
                <p><strong>Admin:</strong> admin@arsarealestate.com / admin@123</p>
                <p><strong>User:</strong> buyer@example.com / user@123</p>
              </div>
              <button
                type="button"
                onClick={() => setShowDemo(false)}
                className="text-xs text-blue-600 hover:text-blue-800 font-semibold mt-2"
              >
                Close
              </button>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-[#111827] text-sm font-semibold mb-2">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-[#111827] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all"
                placeholder="admin@arsarealestate.com"
              />
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-[#111827] text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-[#111827] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all"
                placeholder="••••••••"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#2d6a4f] text-white font-semibold py-2.5 rounded-lg hover:bg-[#1b4332] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          {/* Demo Buttons */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center mb-4 font-medium">Quick Demo Login</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleDemoLogin('admin')}
                disabled={isLoading}
                className="px-4 py-2 border-2 border-[#2d6a4f] text-[#2d6a4f] font-semibold rounded-lg hover:bg-[#2d6a4f]/10 transition-colors disabled:opacity-50"
              >
                Admin Demo
              </button>
              <button
                type="button"
                onClick={() => handleDemoLogin('user')}
                disabled={isLoading}
                className="px-4 py-2 border-2 border-[#2d6a4f] text-[#2d6a4f] font-semibold rounded-lg hover:bg-[#2d6a4f]/10 transition-colors disabled:opacity-50"
              >
                User Demo
              </button>
            </div>
          </div>

          {/* Back to Home */}
          <div className="mt-6 text-center">
            <a href="/" className="text-sm text-[#2d6a4f] hover:text-[#1b4332] font-semibold">
              ← Back to Home
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-white/60 text-xs mt-8">
          This is a demo portal. In production, all credentials would be securely handled.
        </p>
      </div>
    </div>
  )
}
