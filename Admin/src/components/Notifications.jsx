import { useState, useEffect } from 'react'
import { Bell, X, Calendar, CheckCircle, XCircle } from 'lucide-react'
import { toast } from 'react-hot-toast'

const Notifications = () => {
  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    // Poll for new bookings every 30 seconds
    const interval = setInterval(() => {
      checkForNewBookings()
    }, 30000)

    // Initial check
    checkForNewBookings()

    return () => clearInterval(interval)
  }, [])

  const checkForNewBookings = async () => {
    try {
      // In a real app, you would call your API
      // For now, simulate new bookings
      const hasNewBookings = Math.random() > 0.7
      
      if (hasNewBookings) {
        const newNotification = {
          id: Date.now(),
          type: 'booking',
          title: 'New Booking Received',
          message: 'A new booking request has been received.',
          time: 'Just now',
          read: false,
        }
        
        setNotifications(prev => [newNotification, ...prev.slice(0, 9)])
        setUnreadCount(prev => prev + 1)
        
        // Show toast notification
        toast.success('New booking received!', {
          icon: <Calendar className="h-5 w-5 text-blue-500" />,
        })
      }
    } catch (error) {
      console.error('Failed to check for new bookings:', error)
    }
  }

  const markAsRead = (id) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    )
    setUnreadCount(prev => Math.max(0, prev - 1))
  }

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })))
    setUnreadCount(0)
  }

  const clearAll = () => {
    setNotifications([])
    setUnreadCount(0)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
      >
        <Bell className="h-5 w-5 text-gray-600 dark:text-gray-400" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="p-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-gray-900 dark:text-white">Notifications</h3>
              <div className="flex items-center space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-sm text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                >
                  Clear all
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors ${
                      !notification.read ? 'bg-blue-50 dark:bg-blue-900/20' : ''
                    }`}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <div className="flex items-start">
                      <div className={`h-8 w-8 rounded-full flex items-center justify-center mr-3 ${
                        notification.type === 'booking'
                          ? 'bg-blue-100 dark:bg-blue-900'
                          : 'bg-green-100 dark:bg-green-900'
                      }`}>
                        {notification.type === 'booking' ? (
                          <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-gray-900 dark:text-white">
                          {notification.title}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notification.message}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                          {notification.time}
                        </div>
                      </div>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-blue-500 rounded-full ml-2"></div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <a
              href="/bookings"
              className="block text-center text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all bookings →
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default Notifications