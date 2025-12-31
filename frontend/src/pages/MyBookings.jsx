import { useState, useEffect } from 'react'
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, Bed, DollarSign } from 'lucide-react'
import { booking } from '../services/api'
import { toast } from 'react-hot-toast'

const MyBookings = () => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBookings()
  }, [])

  const fetchBookings = async () => {
    try {
      const { data } = await booking.getMyBookings()
      if (data.success) {
        setBookings(data.bookings)
      }
    } catch (error) {
      toast.error('Failed to fetch bookings')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-blue-500" />
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
      case 'completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
      default:
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
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

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">My Bookings</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">View and manage your upcoming and past stays</p>
        </div>

        {bookings.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
            <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No bookings yet</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">You haven't made any bookings yet. Start by exploring our rooms.</p>
            <button
              onClick={() => window.location.href = '/rooms'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Browse Rooms
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((bookingItem) => (
              <div
                key={bookingItem._id}
                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700"
              >
                <div className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-4">
                        {getStatusIcon(bookingItem.status)}
                        <span className={`ml-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(bookingItem.status)}`}>
                          {bookingItem.status.charAt(0).toUpperCase() + bookingItem.status.slice(1)}
                        </span>
                        <span className="ml-4 text-sm text-gray-500 dark:text-gray-400">
                          Booking ID: {bookingItem._id.slice(-8)}
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <Bed className="h-4 w-4 mr-2" />
                            <span className="text-sm">Room</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {bookingItem.room?.title || 'N/A'}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">Check-in</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatDate(bookingItem.checkInDate)}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <Calendar className="h-4 w-4 mr-2" />
                            <span className="text-sm">Check-out</span>
                          </div>
                          <p className="font-semibold text-gray-900 dark:text-white">
                            {formatDate(bookingItem.checkOutDate)}
                          </p>
                        </div>

                        <div>
                          <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                            <DollarSign className="h-4 w-4 mr-2" />
                            <span className="text-sm">Total Price</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${bookingItem.totalPrice}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 lg:mt-0 lg:ml-6">
                      {bookingItem.status === 'pending' && (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => toast.success('Payment will be processed soon')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Pay Now
                          </button>
                          <button
                            onClick={() => toast.info('Cancellation feature coming soon')}
                            className="px-4 py-2 border border-red-600 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                      {bookingItem.status === 'confirmed' && (
                        <div className="text-center">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">Booking confirmed</div>
                          <button
                            onClick={() => toast.info('Modification feature coming soon')}
                            className="px-4 py-2 border border-blue-600 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
                          >
                            Modify Booking
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Additional info */}
                {bookingItem.status === 'confirmed' && (
                  <div className="bg-green-50 dark:bg-green-900/20 border-t border-green-200 dark:border-green-800 px-6 py-3">
                    <div className="flex items-center">
                      <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-sm text-green-700 dark:text-green-300">
                        Your booking is confirmed! Check-in time is 3:00 PM
                      </span>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Booking Stats */}
        {bookings.length > 0 && (
          <div className="mt-12 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Booking Statistics</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{bookings.length}</div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Bookings</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Confirmed</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                  {bookings.filter(b => b.status === 'pending').length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Pending</div>
              </div>
              <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  ${bookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">Total Spent</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default MyBookings