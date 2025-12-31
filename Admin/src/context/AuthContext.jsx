import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import api from '../services/api'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  // Check if token is valid
  const validateToken = useCallback((token) => {
    if (!token) return false
    
    try {
      // Decode token to check expiration
      const payload = JSON.parse(atob(token.split('.')[1]))
      const isExpired = payload.exp * 1000 < Date.now()
      return !isExpired
    } catch (error) {
      return false
    }
  }, [])

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem('admin_token')
        const userData = localStorage.getItem('admin_user')
        
        if (token && userData) {
          // Check if token is valid
          if (validateToken(token)) {
            api.defaults.headers.common['Authorization'] = `Bearer ${token}`
            setUser(JSON.parse(userData))
            setIsAuthenticated(true)
          } else {
            // Token expired, clear storage
            localStorage.removeItem('admin_token')
            localStorage.removeItem('admin_user')
            localStorage.removeItem('refresh_token')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        // Clear invalid data
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_user')
        localStorage.removeItem('refresh_token')
      } finally {
        setLoading(false)
      }
    }

    initializeAuth()
  }, [validateToken])

  // Add response interceptor for token refresh
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config
        
        // If error is 401 and we haven't tried refreshing yet
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true
          
          try {
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
              // Call refresh token endpoint
              const { data } = await api.post('/token/refresh', { refreshToken })
              
              if (data.success) {
                localStorage.setItem('admin_token', data.accessToken)
                api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
                
                // Retry the original request
                return api(originalRequest)
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
          }
          
          // If refresh fails, logout
          logout()
          navigate('/login')
          toast.error('Session expired. Please login again.')
        }
        
        return Promise.reject(error)
      }
    )

    return () => {
      api.interceptors.response.eject(interceptor)
    }
  }, [navigate])

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/auth/admin/login', { email, password })
      
      if (data.success && data.accessToken) {
        // Store tokens
        localStorage.setItem('admin_token', data.accessToken)
        localStorage.setItem('refresh_token', data.refreshToken)
        localStorage.setItem('admin_user', JSON.stringify(data.admin || { email }))
        
        // Set axios header
        api.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`
        
        // Update state
        setUser(data.admin || { email, role: 'admin' })
        setIsAuthenticated(true)
        
        toast.success('Login successful!')
        navigate('/dashboard')
        return true
      } else {
        toast.error('Invalid response from server')
        return false
      }
    } catch (error) {
      console.error('Login error:', error)
      
      let errorMessage = 'Login failed'
      if (error.response) {
        if (error.response.status === 401) {
          errorMessage = 'Invalid admin credentials'
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.'
      }
      
      toast.error(errorMessage)
      return false
    }
  }

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('refresh_token')
    
    // Clear axios header
    delete api.defaults.headers.common['Authorization']
    
    // Reset state
    setUser(null)
    setIsAuthenticated(false)
    
    // Navigate to login
    navigate('/login')
    toast.success('Logged out successfully')
  }

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
    loading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}