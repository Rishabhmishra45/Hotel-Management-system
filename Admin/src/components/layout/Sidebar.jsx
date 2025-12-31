import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  Home,
  Bed,
  Utensils,
  Calendar,
  Menu,
  X,
  LogOut,
  ChevronRight,
  Hotel,
  BarChart3,
  Settings,
  HelpCircle
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { bookings as bookingApi } from '../../services/api'

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [pendingBookings, setPendingBookings] = useState(0)
  const location = useLocation()
  const { logout } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchPendingBookings()
    const interval = setInterval(fetchPendingBookings, 30000) // Update every 30 seconds
    return () => clearInterval(interval)
  }, [])

  const fetchPendingBookings = async () => {
    try {
      const { data } = await bookingApi.getAll()
      if (data.success) {
        const pending = data.bookings?.filter(b => b.status === 'pending').length || 0
        setPendingBookings(pending)
      }
    } catch (error) {
      console.error('Failed to fetch pending bookings:', error)
    }
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Rooms', href: '/rooms', icon: Bed },
    { name: 'Dishes', href: '/dishes', icon: Utensils },
    { name: 'Bookings', href: '/bookings', icon: Calendar, badge: pendingBookings },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
  ]

  const secondaryNavigation = [
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/help', icon: HelpCircle },
  ]

  const handleLogout = () => {
    logout()
    setSidebarOpen(false)
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile sidebar */}
      <div className={`lg:hidden fixed inset-y-0 left-0 z-40 w-64 transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
          {/* Mobile header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center space-x-2">
              <Hotel className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              <span className="text-xl font-bold text-gray-900 dark:text-white">StaySync</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Mobile navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </div>
                    {item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {item.name}
                    </Link>
                  )
                })}
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2.5 mt-4 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut className="h-5 w-5 mr-3" />
                Sign out
              </button>
            </div>
          </nav>
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:z-40 lg:flex lg:flex-col transition-all duration-300 ${
        collapsed ? 'lg:w-20' : 'lg:w-64'
      }`}>
        <div className="flex min-h-0 flex-1 flex-col border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          {/* Desktop header */}
          <div className="flex h-16 items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700">
            {!collapsed && (
              <div className="flex items-center space-x-2">
                <Hotel className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">StaySync</span>
              </div>
            )}
            {collapsed && (
              <div className="flex items-center justify-center w-full">
                <Hotel className="h-8 w-8 text-blue-600 dark:text-blue-400" />
              </div>
            )}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <ChevronRight className={`h-5 w-5 transition-transform ${collapsed ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Desktop navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-4">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                    }`}
                    title={collapsed ? item.name : ''}
                  >
                    <div className="flex items-center">
                      <Icon className="h-5 w-5" />
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </div>
                    {!collapsed && item.badge && item.badge > 0 && (
                      <span className="bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && item.badge > 0 && (
                      <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
                    )}
                  </Link>
                )
              })}
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
              <div className="space-y-1">
                {secondaryNavigation.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={`flex items-center px-3 py-2.5 rounded-lg transition-colors ${
                        isActive(item.href)
                          ? 'bg-blue-600 text-white'
                          : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                      }`}
                      title={collapsed ? item.name : ''}
                    >
                      <Icon className="h-5 w-5" />
                      {!collapsed && <span className="ml-3">{item.name}</span>}
                    </Link>
                  )
                })}
              </div>

              <button
                onClick={handleLogout}
                className={`flex items-center w-full px-3 py-2.5 mt-4 rounded-lg text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 ${
                  collapsed ? 'justify-center' : ''
                }`}
                title={collapsed ? 'Sign out' : ''}
              >
                <LogOut className="h-5 w-5" />
                {!collapsed && <span className="ml-3">Sign out</span>}
              </button>
            </div>
          </nav>

          {/* Collapsed indicator */}
          {collapsed && (
            <div className="p-4 text-center">
              <div className="text-xs text-gray-500 dark:text-gray-400">Collapsed</div>
            </div>
          )}
        </div>
      </div>

      {/* Mobile menu button */}
      <div className="sticky top-0 z-30 lg:hidden">
        <div className="flex h-16 items-center justify-between px-4 bg-white dark:bg-gray-800 border-b dark:border-gray-700">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex items-center space-x-2">
            <Hotel className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <span className="text-lg font-bold text-gray-900 dark:text-white">StaySync</span>
          </div>
          <div className="w-6" /> {/* Spacer */}
        </div>
      </div>
    </>
  )
}

export default Sidebar