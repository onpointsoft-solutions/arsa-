import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { User, AuthContextType } from '../types'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Mock user database - In production, this would be a backend API
const MOCK_USERS = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@arsarealestate.com',
    password: 'admin@123', // In production: never store passwords in frontend
    role: 'admin' as const,
  },
  {
    id: 'user-1',
    name: 'John Buyer',
    email: 'buyer@example.com',
    password: 'user@123',
    role: 'user' as const,
  },
]

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize from localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken')
    const storedUser = localStorage.getItem('authUser')

    if (storedToken && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setToken(storedToken)
        setUser(parsedUser)
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('authToken')
        localStorage.removeItem('authUser')
      }
    }

    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true)
    try {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))

      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      )

      if (!mockUser) {
        throw new Error('Invalid email or password')
      }

      // Create mock JWT token
      const mockToken = btoa(JSON.stringify({ id: mockUser.id, email: mockUser.email }))

      const userData: User = {
        id: mockUser.id,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Store in state and localStorage
      setToken(mockToken)
      setUser(userData)
      localStorage.setItem('authToken', mockToken)
      localStorage.setItem('authUser', JSON.stringify(userData))
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    localStorage.removeItem('authToken')
    localStorage.removeItem('authUser')
  }

  const updateProfile = (userData: Partial<User>) => {
    if (user) {
      const updatedUser: User = {
        ...user,
        ...userData,
        updatedAt: new Date().toISOString(),
      }
      setUser(updatedUser)
      localStorage.setItem('authUser', JSON.stringify(updatedUser))
    }
  }

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token && !!user,
    isLoading,
    login,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
