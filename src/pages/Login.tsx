import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import logoImg from '../assets/logo.jpg'

export default function Login() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw]     = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const navigate = useNavigate()
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const quickLogin = async (role: 'admin' | 'user') => {
    setLoading(true)
    setError('')
    const creds = role === 'admin'
      ? { email: 'admin@arsarealestate.com', password: 'Admin@123' }
      : { email: 'buyer1@example.com',       password: 'User@123' }
    try {
      await login(creds.email, creds.password)
      navigate(role === 'admin' ? '/admin/dashboard' : '/')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2d6a4f] to-[#1b4332] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <a href="/" className="inline-block hover:opacity-80 transition-opacity mb-4">
            <img
              src={logoImg}
              alt="ARSA Real Estate"
              className="h-16 w-auto"
            />
          </a>
          <p className="text-white/80 text-sm font-semibold">Admin Portal</p>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="font-display text-2xl text-[#111827] mb-6">Sign In</h2>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-3 mb-5 text-sm text-red-700 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="admin@arsarealestate.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-[#111827] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#111827] mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 pr-11 border border-gray-300 rounded-lg text-[#111827] focus:outline-none focus:border-[#2d6a4f] focus:ring-2 focus:ring-[#2d6a4f]/20 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(v => !v)}
                  className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#2d6a4f] transition-colors"
                  aria-label={showPw ? 'Hide password' : 'Show password'}
                >
                  {showPw ? (
                    /* eye-off */
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.94 17.94A10.07 10.07 0 0112 20c-5 0-9.27-3.11-11-8 1.02-2.79 2.9-5.12 5.34-6.61M9.88 9.88A3 3 0 0114.12 14.12M3 3l18 18" />
                    </svg>
                  ) : (
                    /* eye */
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M1 12C2.73 6.89 7 3 12 3s9.27 3.89 11 9c-1.73 5.11-6 9-11 9S2.73 17.11 1 12z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#2d6a4f] text-white font-semibold py-2.5 rounded-lg hover:bg-[#1b4332] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                  Signing in…
                </span>
              ) : 'Sign In'}
            </button>
          </form>

          

          <div className="mt-5 text-center">
            <Link to="/" className="text-sm text-[#2d6a4f] hover:text-[#1b4332] font-semibold">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
