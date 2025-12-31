import axios from 'axios'
import { toast } from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, // Increased timeout
  withCredentials: true,
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    
    // Add cache control for GET requests
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'no-cache'
    }
    
    return config
  },
  (error) => {
    console.error('Request error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor with better error handling
api.interceptors.response.use(
  (response) => {
    // Handle successful responses
    return response
  },
  (error) => {
    // Don't show toast for 401 errors (handled in AuthContext)
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token')
      localStorage.removeItem('admin_user')
      localStorage.removeItem('refresh_token')
      
      // Redirect to login if not already there
      if (!window.location.pathname.includes('/login')) {
        window.location.href = '/login'
      }
      return Promise.reject(error)
    }

    // Handle network errors
    if (!error.response) {
      toast.error('Network error. Please check your internet connection.')
      return Promise.reject(error)
    }

    // Handle specific error cases
    const { status, data } = error.response
    
    switch (status) {
      case 400:
        if (data.errors) {
          // Handle validation errors
          Object.values(data.errors).forEach(errorMsg => {
            toast.error(errorMsg)
          })
        } else {
          toast.error(data?.message || 'Bad request. Please check your input.')
        }
        break
      case 403:
        toast.error('You do not have permission to perform this action.')
        break
      case 404:
        toast.error(data?.message || 'Resource not found.')
        break
      case 409:
        toast.error(data?.message || 'Conflict occurred. Resource already exists.')
        break
      case 413:
        toast.error('File too large. Please upload a file smaller than 5MB.')
        break
      case 422:
        toast.error(data?.message || 'Validation error. Please check your input.')
        break
      case 429:
        toast.error('Too many requests. Please try again later.')
        break
      case 500:
        toast.error('Server error. Please try again later.')
        break
      case 503:
        toast.error('Service unavailable. Please try again later.')
        break
      default:
        toast.error(data?.message || 'An unexpected error occurred.')
    }

    return Promise.reject(error)
  }
)

// Auth endpoints
export const auth = {
  login: (email, password) => api.post('/auth/admin/login', { email, password }),
  refreshToken: (refreshToken) => api.post('/token/refresh', { refreshToken }),
  logout: () => {
    localStorage.removeItem('admin_token')
    localStorage.removeItem('admin_user')
    localStorage.removeItem('refresh_token')
    return Promise.resolve()
  }
}

// Analytics endpoints
export const analytics = {
  getStats: () => api.get('/analytics'),
  getRevenueData: (period = 'monthly') => 
    api.get(`/analytics/revenue?period=${period}`),
  getBookingTrends: () => api.get('/analytics/booking-trends'),
}

// Rooms endpoints with improved error handling
export const rooms = {
  getAll: () => api.get('/rooms'),
  getById: (id) => api.get(`/rooms/${id}`),
  create: (data) => api.post('/rooms', data),
  update: (id, data) => api.put(`/rooms/${id}`, data),
  delete: (id) => api.delete(`/rooms/${id}`),
  toggleAvailability: (id, available) => 
    api.patch(`/rooms/${id}/availability`, { available }),
}

// Dishes endpoints with file upload handling
export const dishes = {
  getAll: () => api.get('/dishes'),
  getById: (id) => api.get(`/dishes/${id}`),
  create: (data) => {
    const formData = new FormData()
    
    // Add all fields to formData
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key]) {
        formData.append('image', data[key])
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    
    return api.post('/dishes', formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // Longer timeout for file uploads
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        // You can dispatch this to a state if you want to show progress bar
        console.log(`Upload progress: ${percentCompleted}%`)
      }
    })
  },
  update: (id, data) => {
    const formData = new FormData()
    
    // Add all fields to formData
    Object.keys(data).forEach(key => {
      if (key === 'image' && data[key]) {
        formData.append('image', data[key])
      } else if (data[key] !== undefined && data[key] !== null) {
        formData.append(key, data[key])
      }
    })
    
    return api.put(`/dishes/${id}`, formData, {
      headers: { 
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000,
    })
  },
  delete: (id) => api.delete(`/dishes/${id}`),
  toggleAvailability: (id, available) => 
    api.patch(`/dishes/${id}/availability`, { available }),
}

// Bookings endpoints with filters
export const bookings = {
  getAll: (params = {}) => {
    const queryParams = new URLSearchParams(params).toString()
    return api.get(`/bookings${queryParams ? `?${queryParams}` : ''}`)
  },
  getById: (id) => api.get(`/bookings/${id}`),
  updateStatus: (id, status) => api.put(`/bookings/${id}/status`, { status }),
  getStats: () => api.get('/bookings/stats'),
  export: (format = 'csv') => api.get(`/bookings/export?format=${format}`, {
    responseType: 'blob'
  }),
}

// Users endpoints
export const users = {
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`),
}

// Utility functions
export const uploadImage = async (file, folder = 'uploads') => {
  const formData = new FormData()
  formData.append('image', file)
  formData.append('folder', folder)
  
  const { data } = await api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  })
  
  return data
}

// Retry failed requests
export const retryRequest = async (requestFn, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await requestFn()
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1))) // Exponential backoff
    }
  }
}

// Cache management
export const clearCache = () => {
  // Clear localStorage cache
  localStorage.removeItem('rooms_cache')
  localStorage.removeItem('dishes_cache')
  localStorage.removeItem('bookings_cache')
}

export default api