import { useState, useEffect } from 'react'
import { 
  Users, 
  Calendar, 
  Bed, 
  Utensils, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Clock,
  CheckCircle,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  Eye,
  Star,
  Activity
} from 'lucide-react'
import { analytics, bookings as bookingApi } from '../services/api'
import { toast } from 'react-hot-toast'
import { Link } from 'react-router-dom'

const Dashboard = () => {
  const [stats, setStats] = useState({
    users: 0,
    bookings: 0,
    rooms: 0,
    dishes: 0,
    revenue: 0,
  })
  const [bookingStats, setBookingStats] = useState({
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
    recentBookings: [],
  })
  const [recentActivity, setRecentActivity] = useState([])
  const [loading, setLoading] = useState(true)
  const [chartData, setChartData] = useState({
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    values: [12, 19, 8, 15, 22, 18, 25]
  })

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch analytics stats
      const analyticsResponse = await analytics.getStats()
      if (analyticsResponse.data.success) {
        setStats(analyticsResponse.data.stats)
      }

      // Fetch booking stats
      const bookingsResponse = await bookingApi.getAll()
      if (bookingsResponse.data.success) {
        const bookingsData = bookingsResponse.data.bookings || []
        setBookingStats({
          pending: bookingsData.filter(b => b.status === 'pending').length,
          confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
          cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
          completed: bookingsData.filter(b => b.status === 'completed').length,
          recentBookings: bookingsData.slice(0, 5),
        })
      }

      // Simulate recent activity
      setRecentActivity([
        { id: 1, type: 'booking', user: 'John Doe', room: 'Deluxe Suite', time: '5 min ago' },
        { id: 2, type: 'payment', amount: '$250', user: 'Sarah Smith', time: '15 min ago' },
        { id: 3, type: 'review', rating: 5, user: 'Mike Johnson', time: '1 hour ago' },
        { id: 4, type: 'checkin', room: '101', user: 'Emma Wilson', time: '2 hours ago' },
        { id: 5, type: 'booking', user: 'Robert Brown', room: 'Premium Room', time: '3 hours ago' },
      ])

    } catch (error) {
      toast.error('Failed to fetch dashboard data')
      console.error('Dashboard fetch error:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      title: 'Total Users',
      value: stats.users.toLocaleString(),
      icon: Users,
      color: 'from-blue-500 to-cyan-500',
      trend: '+12%',
      trendUp: true,
      link: '#',
    },
    {
      title: 'Total Bookings',
      value: stats.bookings.toLocaleString(),
      icon: Calendar,
      color: 'from-purple-500 to-pink-500',
      trend: '+8%',
      trendUp: true,
      link: '/bookings',
    },
    {
      title: 'Available Rooms',
      value: `${stats.rooms} Rooms`,
      icon: Bed,
      color: 'from-green-500 to-emerald-500',
      trend: '+5%',
      trendUp: true,
      link: '/rooms',
    },
    {
      title: 'Menu Items',
      value: stats.dishes,
      icon: Utensils,
      color: 'from-yellow-500 to-orange-500',
      trend: '+15%',
      trendUp: true,
      link: '/dishes',
    },
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: DollarSign,
      color: 'from-red-500 to-pink-500',
      trend: '+23%',
      trendUp: true,
      link: '#',
    },
  ]

  const bookingStatusCards = [
    {
      title: 'Pending',
      value: bookingStats.pending,
      icon: Clock,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-800 dark:text-yellow-300',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
    },
    {
      title: 'Confirmed',
      value: bookingStats.confirmed,
      icon: CheckCircle,
      color: 'bg-green-500',
      textColor: 'text-green-800 dark:text-green-300',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      title: 'Completed',
      value: bookingStats.completed,
      icon: CheckCircle,
      color: 'bg-blue-500',
      textColor: 'text-blue-800 dark:text-blue-300',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      title: 'Cancelled',
      value: bookingStats.cancelled,
      icon: XCircle,
      color: 'bg-red-500',
      textColor: 'text-red-800 dark:text-red-300',
      bgColor: 'bg-red-50 dark:bg-red-900/20',
    },
  ]

  const getActivityIcon = (type) => {
    switch (type) {
      case 'booking':
        return <Calendar className="h-4 w-4 text-blue-500" />
      case 'payment':
        return <DollarSign className="h-4 w-4 text-green-500" />
      case 'review':
        return <Star className="h-4 w-4 text-yellow-500" />
      case 'checkin':
        return <Eye className="h-4 w-4 text-purple-500" />
      default:
        return <Activity className="h-4 w-4 text-gray-500" />
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dashboard Overview</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchDashboardData}
            className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Refresh Data
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Link
              key={stat.title}
              to={stat.link}
              className="group block"
            >
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      {stat.trendUp ? (
                        <ArrowUpRight className="h-4 w-4 text-green-500 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-4 w-4 text-red-500 mr-1" />
                      )}
                      <span className={`text-sm ${stat.trendUp ? 'text-green-600' : 'text-red-600'}`}>
                        {stat.trend}
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-2">from last month</span>
                    </div>
                  </div>
                  <div className={`bg-gradient-to-br ${stat.color} p-3 rounded-lg group-hover:scale-110 transition-transform`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Charts and Booking Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Revenue Overview</h3>
            <select className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm bg-transparent">
              <option>Last 7 days</option>
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="h-64 flex items-end space-x-2">
            {chartData.values.map((value, index) => (
              <div key={index} className="flex-1 flex flex-col items-center">
                <div
                  className="w-full bg-gradient-to-t from-blue-500 to-purple-500 rounded-t-lg transition-all duration-300 hover:opacity-80"
                  style={{ height: `${(value / Math.max(...chartData.values)) * 100}%` }}
                ></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                  {chartData.labels[index]}
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-between items-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">Weekly Revenue</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${chartData.values.reduce((a, b) => a + b, 0) * 100}
              </p>
            </div>
            <div className="flex items-center text-green-600 dark:text-green-400">
              <TrendingUp className="h-5 w-5 mr-2" />
              <span>+12.5% from last week</span>
            </div>
          </div>
        </div>

        {/* Booking Status */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Booking Status</h3>
          <div className="space-y-4">
            {bookingStatusCards.map((status) => {
              const Icon = status.icon
              const percentage = stats.bookings > 0 ? (status.value / stats.bookings) * 100 : 0
              
              return (
                <div key={status.title} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className={`h-3 w-3 rounded-full ${status.color} mr-2`}></div>
                      <span className="font-medium text-gray-700 dark:text-gray-300">{status.title}</span>
                    </div>
                    <div className={`font-bold ${status.textColor}`}>
                      {status.value} ({percentage.toFixed(1)}%)
                    </div>
                  </div>
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${status.color} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
          <Link
            to="/bookings"
            className="block text-center mt-6 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
          >
            Manage Bookings
          </Link>
        </div>
      </div>

      {/* Recent Activity and Bookings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
            <button className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
              View all
            </button>
          </div>
          <div className="space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0">
                <div className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {activity.type === 'booking' && `${activity.user} booked ${activity.room}`}
                      {activity.type === 'payment' && `Payment of ${activity.amount} from ${activity.user}`}
                      {activity.type === 'review' && `${activity.user} left ${activity.rating}-star review`}
                      {activity.type === 'checkin' && `${activity.user} checked into Room ${activity.room}`}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{activity.time}</div>
                  </div>
                </div>
                {activity.type === 'review' && (
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < activity.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Bookings</h3>
            <Link 
              to="/bookings"
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
              View all
            </Link>
          </div>
          <div className="space-y-4">
            {bookingStats.recentBookings.length === 0 ? (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">No recent bookings</div>
            ) : (
              bookingStats.recentBookings.map((booking) => (
                <div key={booking._id} className="flex items-center justify-between py-3 border-b dark:border-gray-700 last:border-0">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{booking.user?.name || 'Guest'}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{booking.room?.title || 'N/A'}</div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                      booking.status === 'completed' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                    }`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                      ${booking.totalPrice?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
          {bookingStats.pending > 0 && (
            <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-yellow-800 dark:text-yellow-300">
                    {bookingStats.pending} Pending Bookings
                  </div>
                  <div className="text-sm text-yellow-600 dark:text-yellow-400">
                    Requires your attention
                  </div>
                </div>
                <Link
                  to="/bookings?filter=pending"
                  className="px-3 py-1.5 bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-300 rounded-lg hover:bg-yellow-200 dark:hover:bg-yellow-700 transition-colors"
                >
                  Review
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Avg. Booking Value</div>
              <div className="text-2xl font-bold mt-1">
                ${stats.bookings > 0 ? (stats.revenue / stats.bookings).toFixed(2) : '0.00'}
              </div>
            </div>
            <TrendingUp className="h-8 w-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Occupancy Rate</div>
              <div className="text-2xl font-bold mt-1">
                {stats.rooms > 0 ? Math.round((bookingStats.confirmed / stats.rooms) * 100) : 0}%
              </div>
            </div>
            <TrendingUp className="h-8 w-8 opacity-50" />
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm opacity-90">Customer Satisfaction</div>
              <div className="text-2xl font-bold mt-1">94%</div>
            </div>
            <TrendingUp className="h-8 w-8 opacity-50" />
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Link
            to="/rooms/new"
            className="group p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-200"
          >
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900 mb-2 group-hover:scale-110 transition-transform">
                <Bed className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Add Room</p>
            </div>
          </Link>
          <Link
            to="/dishes/new"
            className="group p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
          >
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-2 group-hover:scale-110 transition-transform">
                <Utensils className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Add Dish</p>
            </div>
          </Link>
          <Link
            to="/bookings"
            className="group p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all duration-200"
          >
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-purple-100 dark:bg-purple-900 mb-2 group-hover:scale-110 transition-transform">
                <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">View Bookings</p>
            </div>
          </Link>
          <button
            onClick={() => toast.success('Report generated successfully!')}
            className="group p-4 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-200"
          >
            <div className="text-center">
              <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900 mb-2 group-hover:scale-110 transition-transform">
                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <p className="text-sm font-medium text-gray-900 dark:text-white">Generate Report</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Dashboard