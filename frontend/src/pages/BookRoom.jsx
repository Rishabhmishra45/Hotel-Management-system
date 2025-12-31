import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Calendar, Users, Check, ArrowLeft, CreditCard } from 'lucide-react'
import { rooms, booking } from '../services/api'
import { toast } from 'react-hot-toast'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const BookRoom = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [loading, setLoading] = useState(true)
  const [bookingLoading, setBookingLoading] = useState(false)
  
  // Booking form state
  const [checkInDate, setCheckInDate] = useState(null)
  const [checkOutDate, setCheckOutDate] = useState(null)
  const [guests, setGuests] = useState(1)
  const [specialRequests, setSpecialRequests] = useState('')

  useEffect(() => {
    if (roomId) {
      fetchRoom()
    }
  }, [roomId])

  const fetchRoom = async () => {
    try {
      const { data } = await rooms.getAll()
      if (data.success) {
        const selectedRoom = data.rooms.find(r => r._id === roomId)
        if (selectedRoom) {
          setRoom(selectedRoom)
        } else {
          toast.error('Room not found')
          navigate('/rooms')
        }
      }
    } catch (error) {
      toast.error('Failed to fetch room details')
      navigate('/rooms')
    } finally {
      setLoading(false)
    }
  }

  const calculateTotal = () => {
    if (!checkInDate || !checkOutDate || !room) return 0
    const nights = (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    return nights * room.pricePerNight
  }

  const handleBookNow = async () => {
    if (!checkInDate || !checkOutDate) {
      toast.error('Please select check-in and check-out dates')
      return
    }

    if (checkInDate >= checkOutDate) {
      toast.error('Check-out date must be after check-in date')
      return
    }

    if (guests > room.capacity) {
      toast.error(`Maximum capacity for this room is ${room.capacity} guests`)
      return
    }

    if (checkInDate < new Date()) {
      toast.error('Check-in date cannot be in the past')
      return
    }

    setBookingLoading(true)
    try {
      const bookingData = {
        roomId: room._id,
        checkInDate: checkInDate.toISOString(),
        checkOutDate: checkOutDate.toISOString(),
      }

      const { data } = await booking.create(bookingData)
      if (data.success) {
        toast.success('Booking created successfully! Redirecting to payment...')
        // In a real app, you would redirect to payment gateway here
        setTimeout(() => {
          navigate('/my-bookings')
        }, 2000)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create booking')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!room) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Room not found</h2>
          <button
            onClick={() => navigate('/rooms')}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Rooms
          </button>
        </div>
      </div>
    )
  }

  const total = calculateTotal()
  const nights = total > 0 ? Math.floor((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)) : 0

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate('/rooms')}
          className="flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 mb-8"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Rooms
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Room Details */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{room.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">{room.description}</p>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Capacity</div>
                    <div className="font-semibold text-gray-900 dark:text-white">{room.capacity} persons</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <CreditCard className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Price per Night</div>
                    <div className="font-semibold text-gray-900 dark:text-white">${room.pricePerNight}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Check className="h-5 w-5 text-green-600 dark:text-green-400 mr-2" />
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Status</div>
                    <div className={`font-semibold ${room.available ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {room.available ? 'Available' : 'Unavailable'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Amenities Included</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {[
                    'Free WiFi',
                    'Air Conditioning',
                    'Smart TV',
                    'Mini Bar',
                    'Coffee Maker',
                    'Safe Deposit Box',
                    'Hair Dryer',
                    'Room Service',
                    'Daily Housekeeping'
                  ].map((amenity, index) => (
                    <div key={index} className="flex items-center">
                      <Check className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                      <span className="text-gray-700 dark:text-gray-300">{amenity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 sticky top-24">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Book This Room</h2>
              
              {!room.available ? (
                <div className="text-center py-8">
                  <div className="text-red-600 dark:text-red-400 font-bold mb-2">This room is currently unavailable</div>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">Please check back later or browse other rooms.</p>
                  <button
                    onClick={() => navigate('/rooms')}
                    className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Browse Available Rooms
                  </button>
                </div>
              ) : (
                <>
                  <div className="space-y-6">
                    {/* Dates */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Calendar className="h-4 w-4 inline mr-2" />
                        Check-in / Check-out Dates
                      </label>
                      <div className="space-y-3">
                        <div>
                          <DatePicker
                            selected={checkInDate}
                            onChange={setCheckInDate}
                            selectsStart
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={new Date()}
                            placeholderText="Check-in Date"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                        <div>
                          <DatePicker
                            selected={checkOutDate}
                            onChange={setCheckOutDate}
                            selectsEnd
                            startDate={checkInDate}
                            endDate={checkOutDate}
                            minDate={checkInDate || new Date()}
                            placeholderText="Check-out Date"
                            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Guests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        <Users className="h-4 w-4 inline mr-2" />
                        Number of Guests
                      </label>
                      <select
                        value={guests}
                        onChange={(e) => setGuests(parseInt(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      >
                        {[...Array(room.capacity)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i + 1 === 1 ? 'Guest' : 'Guests'}
                          </option>
                        ))}
                      </select>
                      <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                        Maximum capacity: {room.capacity} guests
                      </p>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Special Requests
                      </label>
                      <textarea
                        value={specialRequests}
                        onChange={(e) => setSpecialRequests(e.target.value)}
                        rows="3"
                        placeholder="Any special requirements or requests?"
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                      />
                    </div>

                    {/* Price Summary */}
                    <div className="border-t dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Price Summary</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">${room.pricePerNight} × {nights} nights</span>
                          <span className="font-medium text-gray-900 dark:text-white">${room.pricePerNight * nights}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Service fee</span>
                          <span className="font-medium text-gray-900 dark:text-white">$15.00</span>
                        </div>
                        <div className="flex justify-between border-t dark:border-gray-700 pt-3">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${(room.pricePerNight * nights + 15).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Book Now Button */}
                    <button
                      onClick={handleBookNow}
                      disabled={bookingLoading || !checkInDate || !checkOutDate || !room.available}
                      className="w-full px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-bold text-lg"
                    >
                      {bookingLoading ? (
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </div>
                      ) : (
                        'Book Now'
                      )}
                    </button>

                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      You won't be charged until you confirm your booking
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default BookRoom