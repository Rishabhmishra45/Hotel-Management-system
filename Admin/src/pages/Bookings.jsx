import { useState, useEffect } from 'react'
import { Search, Filter, Calendar, User, Bed, DollarSign, CheckCircle, XCircle, Clock, Check, Eye, MoreVertical, Download, Mail, Phone, MapPin, Loader2, TrendingUp, TrendingDown } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { bookings as bookingApi } from '../services/api'
import Modal from '../components/Modal'

const Bookings = () => {
  const [bookingsData, setBookings] = useState([])
  const [filteredBookings, setFilteredBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isStatsModalOpen, setIsStatsModalOpen] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    revenue: 0,
    pending: 0,
    confirmed: 0,
    cancelled: 0,
    completed: 0,
  })

  useEffect(() => {
    fetchBookings()
  }, [])

  useEffect(() => {
    filterBookings()
    calculateStats()
  }, [search, filter, bookingsData])

  const fetchBookings = async () => {
    try {
      setLoading(true)
      const { data } = await bookingApi.getAll()
      if (data.success) {
        setBookings(data.bookings || [])
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      toast.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const filterBookings = () => {
    let result = bookingsData

    // Search filter
    if (search) {
      result = result.filter(booking =>
        booking.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
        booking.user?.email?.toLowerCase().includes(search.toLowerCase()) ||
        booking.room?.title?.toLowerCase().includes(search.toLowerCase()) ||
        booking._id?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Status filter
    if (filter !== 'all') {
      result = result.filter(booking => booking.status === filter)
    }

    setFilteredBookings(result)
  }

  const calculateStats = () => {
    const stats = {
      total: bookingsData.length,
      revenue: bookingsData
        .filter(b => b.status === 'confirmed' || b.status === 'completed')
        .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
      pending: bookingsData.filter(b => b.status === 'pending').length,
      confirmed: bookingsData.filter(b => b.status === 'confirmed').length,
      cancelled: bookingsData.filter(b => b.status === 'cancelled').length,
      completed: bookingsData.filter(b => b.status === 'completed').length,
    }
    setStats(stats)
  }

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(`Are you sure you want to change booking status to ${status}?`)) {
      return
    }

    setActionLoading(true)
    try {
      await bookingApi.updateStatus(id, status)
      toast.success(`Booking status updated to ${status}`)
      fetchBookings()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update booking status'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'completed':
        return <Check className="h-4 w-4 text-blue-500" />
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300'
    }
  }

  const getStatusActions = (status) => {
    switch (status) {
      case 'pending':
        return [
          { label: 'Confirm', value: 'confirmed', color: 'bg-green-500 hover:bg-green-600' },
          { label: 'Cancel', value: 'cancelled', color: 'bg-red-500 hover:bg-red-600' },
        ]
      case 'confirmed':
        return [
          { label: 'Mark Complete', value: 'completed', color: 'bg-blue-500 hover:bg-blue-600' },
          { label: 'Cancel', value: 'cancelled', color: 'bg-red-500 hover:bg-red-600' },
        ]
      case 'completed':
        return []
      case 'cancelled':
        return [
          { label: 'Reopen', value: 'pending', color: 'bg-yellow-500 hover:bg-yellow-600' },
        ]
      default:
        return []
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatDateTime = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const viewBookingDetails = (booking) => {
    setSelectedBooking(booking)
    setIsDetailModalOpen(true)
  }

  const exportBookings = () => {
    const csvContent = [
      ['Booking ID', 'Guest Name', 'Email', 'Room', 'Check-in', 'Check-out', 'Total Price', 'Status', 'Created At'],
      ...filteredBookings.map(booking => [
        booking._id,
        booking.user?.name || 'N/A',
        booking.user?.email || 'N/A',
        booking.room?.title || 'N/A',
        formatDate(booking.checkInDate),
        formatDate(booking.checkOutDate),
        `$${booking.totalPrice}`,
        booking.status,
        formatDateTime(booking.createdAt),
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast.success('Bookings exported successfully!')
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading bookings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Booking Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">View and manage all hotel bookings</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setIsStatsModalOpen(true)}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <TrendingUp className="h-5 w-5 mr-2" />
            View Stats
          </button>
          <button
            onClick={exportBookings}
            disabled={filteredBookings.length === 0}
            className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            <Download className="h-5 w-5 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90">Total</div>
          <div className="text-2xl font-bold mt-1">{stats.total}</div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90">Pending</div>
          <div className="text-2xl font-bold mt-1">{stats.pending}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90">Confirmed</div>
          <div className="text-2xl font-bold mt-1">{stats.confirmed}</div>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90">Completed</div>
          <div className="text-2xl font-bold mt-1">{stats.completed}</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90">Cancelled</div>
          <div className="text-2xl font-bold mt-1">{stats.cancelled}</div>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-4 text-white">
          <div className="text-sm opacity-90">Revenue</div>
          <div className="text-2xl font-bold mt-1">${stats.revenue.toFixed(2)}</div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by guest name, email, room, or booking ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2.5 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3">
            <Filter className="h-5 w-5 text-gray-400 hidden md:block" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white min-w-[160px]"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bookings Table - Desktop */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Guest</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Room</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredBookings.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      {bookingsData.length === 0 ? 'No bookings found.' : 'No bookings match your search.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredBookings.map((booking) => {
                  const statusActions = getStatusActions(booking.status)

                  return (
                    <tr key={booking._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <User className="h-5 w-5 text-white" />
                          </div>
                          <div className="ml-4">
                            <div className="font-medium text-gray-900 dark:text-white">
                              {booking.user?.name || 'N/A'}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">
                              {booking.user?.email || 'N/A'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Bed className="h-4 w-4 text-gray-400 mr-2" />
                          <span className="text-gray-900 dark:text-white">
                            {booking.room?.title || 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                          <div>
                            <div className="text-sm text-gray-900 dark:text-white">
                              {formatDate(booking.checkInDate)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              to {formatDate(booking.checkOutDate)}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                          <span className="font-bold text-gray-900 dark:text-white">
                            ${booking.totalPrice?.toFixed(2) || '0.00'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getStatusIcon(booking.status)}
                          <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(booking.status)}`}>
                            {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => viewBookingDetails(booking)}
                            className="p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="View details"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                          {statusActions.map((action) => (
                            <button
                              key={action.value}
                              onClick={() => handleStatusUpdate(booking._id, action.value)}
                              disabled={actionLoading}
                              className={`px-3 py-1.5 text-sm text-white rounded-lg transition-colors ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                              {action.label}
                            </button>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bookings Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredBookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              {bookingsData.length === 0 ? 'No bookings found.' : 'No bookings match your search.'}
            </div>
          </div>
        ) : (
          filteredBookings.map((booking) => {
            const statusActions = getStatusActions(booking.status)

            return (
              <div key={booking._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white">{booking.user?.name || 'Guest'}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{booking.user?.email || 'N/A'}</p>
                    </div>
                    <div className="flex items-center">
                      {getStatusIcon(booking.status)}
                      <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center">
                      <Bed className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">{booking.room?.title || 'N/A'}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-gray-900 dark:text-white">
                        {formatDate(booking.checkInDate)} - {formatDate(booking.checkOutDate)}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="font-bold text-gray-900 dark:text-white">${booking.totalPrice?.toFixed(2) || '0.00'}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <button
                      onClick={() => viewBookingDetails(booking)}
                      className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                    >
                      Details
                    </button>
                    {statusActions.map((action) => (
                      <button
                        key={action.value}
                        onClick={() => handleStatusUpdate(booking._id, action.value)}
                        disabled={actionLoading}
                        className={`px-3 py-1.5 text-sm text-white rounded-lg transition-colors ${action.color} disabled:opacity-50`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Booking Details Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title="Booking Details"
        size="lg"
      >
        {selectedBooking && (
          <div className="space-y-6">
            {/* Guest Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Guest Information</h3>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <div className="flex items-center mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mr-4">
                    <User className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      {selectedBooking.user?.name || 'N/A'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {selectedBooking.user?.email || 'N/A'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedBooking.user?.email || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 text-gray-400 mr-2" />
                    <span className="text-gray-700 dark:text-gray-300">
                      {selectedBooking.user?.phone || 'Not provided'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Booking Information</h3>
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-lg p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Booking ID</div>
                    <div className="font-medium text-gray-900 dark:text-white font-mono">
                      {selectedBooking._id}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Status</div>
                    <div className="flex items-center">
                      {getStatusIcon(selectedBooking.status)}
                      <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedBooking.status)}`}>
                        {selectedBooking.status.charAt(0).toUpperCase() + selectedBooking.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Created On</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(selectedBooking.createdAt)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Updated On</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDateTime(selectedBooking.updatedAt)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Room Information</h3>
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-lg p-4">
                <div className="flex items-start mb-4">
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mr-4">
                    <Bed className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <div className="font-bold text-gray-900 dark:text-white text-lg">
                      {selectedBooking.room?.title || 'N/A'}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">
                      {selectedBooking.room?.description || 'No description available'}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Check-in Date</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedBooking.checkInDate)}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">Check-out Date</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {formatDate(selectedBooking.checkOutDate)}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment Information</h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Total Amount</div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      ${selectedBooking.totalPrice?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Booking Duration</div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {Math.ceil((new Date(selectedBooking.checkOutDate) - new Date(selectedBooking.checkInDate)) / (1000 * 60 * 60 * 24))} nights
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
              {getStatusActions(selectedBooking.status).map((action) => (
                <button
                  key={action.value}
                  onClick={() => {
                    handleStatusUpdate(selectedBooking._id, action.value)
                    setIsDetailModalOpen(false)
                  }}
                  disabled={actionLoading}
                  className={`px-4 py-2.5 text-white rounded-lg transition-colors ${action.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* Stats Modal */}
      <Modal
        isOpen={isStatsModalOpen}
        onClose={() => setIsStatsModalOpen(false)}
        title="Booking Statistics"
        size="lg"
      >
        <div className="space-y-6">
          {/* Overview Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-4 text-white">
              <div className="text-sm opacity-90">Total Bookings</div>
              <div className="text-2xl font-bold mt-1">{stats.total}</div>
            </div>
            <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-4 text-white">
              <div className="text-sm opacity-90">Total Revenue</div>
              <div className="text-2xl font-bold mt-1">${stats.revenue.toFixed(2)}</div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-4 text-white">
              <div className="text-sm opacity-90">Avg. Booking</div>
              <div className="text-2xl font-bold mt-1">
                ${stats.total > 0 ? (stats.revenue / stats.total).toFixed(2) : '0.00'}
              </div>
            </div>
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-4 text-white">
              <div className="text-sm opacity-90">Success Rate</div>
              <div className="text-2xl font-bold mt-1">
                {stats.total > 0 ? Math.round(((stats.confirmed + stats.completed) / stats.total) * 100) : 0}%
              </div>
            </div>
          </div>

          {/* Status Distribution */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Status Distribution</h3>
            <div className="space-y-3">
              {[
                { status: 'Pending', count: stats.pending, color: 'bg-yellow-500', textColor: 'text-yellow-800 dark:text-yellow-300' },
                { status: 'Confirmed', count: stats.confirmed, color: 'bg-green-500', textColor: 'text-green-800 dark:text-green-300' },
                { status: 'Completed', count: stats.completed, color: 'bg-blue-500', textColor: 'text-blue-800 dark:text-blue-300' },
                { status: 'Cancelled', count: stats.cancelled, color: 'bg-red-500', textColor: 'text-red-800 dark:text-red-300' },
              ].map((item) => {
                const percentage = stats.total > 0 ? (item.count / stats.total) * 100 : 0

                return (
                  <div key={item.status} className="space-y-2">
                    <div className="flex justify-between">
                      <div className="flex items-center">
                        <div className={`h-3 w-3 rounded-full ${item.color} mr-2`}></div>
                        <span className="font-medium text-gray-700 dark:text-gray-300">{item.status}</span>
                      </div>
                      <div className={`font-bold ${item.textColor}`}>
                        {item.count} ({percentage.toFixed(1)}%)
                      </div>
                    </div>
                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Revenue by Status */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Revenue Analysis</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Confirmed Revenue</div>
                  <div className="text-xl font-bold text-green-600 dark:text-green-400">
                    ${stats.revenue.toFixed(2)}
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/30 rounded-lg">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">Potential Revenue (Pending)</div>
                  <div className="text-xl font-bold text-yellow-600 dark:text-yellow-400">
                    ${(stats.pending * 150).toFixed(2)}*
                  </div>
                </div>
                <TrendingUp className="h-8 w-8 text-yellow-500" />
              </div>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
              * Estimated based on average booking value of $150
            </p>
          </div>

          {/* Recent Bookings */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Recent Bookings</h3>
            <div className="space-y-2">
              {bookingsData.slice(0, 5).map((booking) => (
                <div key={booking._id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">
                      {booking.user?.name || 'Guest'}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {booking.room?.title || 'N/A'} • {formatDate(booking.checkInDate)}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                      {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                    </div>
                    <div className="text-sm font-bold text-gray-900 dark:text-white mt-1">
                      ${booking.totalPrice?.toFixed(2) || '0.00'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setIsStatsModalOpen(false)}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default Bookings