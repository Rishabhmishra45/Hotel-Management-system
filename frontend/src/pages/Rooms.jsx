import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Search, Star, Users, Wifi, Coffee, Car, Tv, Wind } from 'lucide-react'
import { rooms } from '../services/api'
import { toast } from 'react-hot-toast'

const Rooms = () => {
  const [roomsData, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    filterRooms()
  }, [search, filter, roomsData])

  const fetchRooms = async () => {
    try {
      const { data } = await rooms.getAll()
      if (data.success) {
        setRooms(data.rooms)
        setFilteredRooms(data.rooms)
      }
    } catch (error) {
      toast.error('Failed to fetch rooms')
    } finally {
      setLoading(false)
    }
  }

  const filterRooms = () => {
    let result = roomsData

    // Search filter
    if (search) {
      result = result.filter(room =>
        room.title.toLowerCase().includes(search.toLowerCase()) ||
        room.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Availability filter
    if (filter === 'available') {
      result = result.filter(room => room.available)
    } else if (filter === 'unavailable') {
      result = result.filter(room => !room.available)
    }

    setFilteredRooms(result)
  }

  const amenities = [
    { icon: Wifi, label: 'Free WiFi' },
    { icon: Tv, label: 'Smart TV' },
    { icon: Wind, label: 'AC' },
    { icon: Coffee, label: 'Coffee Maker' },
    { icon: Car, label: 'Parking' },
  ]

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Rooms & Suites</h1>
            <p className="text-gray-600 dark:text-gray-400">Loading rooms...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-96 animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Our Rooms & Suites</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Choose from our premium selection of accommodations</p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
            >
              <option value="all">All Rooms</option>
              <option value="available">Available Only</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>

        {/* Amenities */}
        <div className="mb-12">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">All Rooms Include</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon
              return (
                <div
                  key={index}
                  className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                >
                  <Icon className="h-8 w-8 text-blue-600 dark:text-blue-400 mb-2" />
                  <span className="text-sm text-gray-700 dark:text-gray-300 text-center">{amenity.label}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Rooms Grid */}
        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No rooms found matching your criteria</div>
            <button
              onClick={() => {
                setSearch('')
                setFilter('all')
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRooms.map((room) => (
              <div
                key={room._id}
                className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  !room.available ? 'opacity-75' : ''
                }`}
              >
                {/* Room Image */}
                <div className="h-64 bg-gradient-to-br from-blue-500 to-purple-600 relative">
                  {!room.available && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Unavailable
                    </div>
                  )}
                  <div className="h-full flex items-center justify-center text-white">
                    <div className="text-center">
                      <div className="text-4xl font-bold mb-2">${room.pricePerNight}</div>
                      <div className="text-lg">per night</div>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{room.title}</h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Users className="h-4 w-4 mr-1" />
                        <span className="text-sm">{room.capacity} persons</span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{room.description}</p>

                  <div className="flex justify-between items-center">
                    <div>
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">${room.pricePerNight}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">per night</div>
                    </div>
                    <Link
                      to={`/book/${room._id}`}
                      className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                        room.available
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      }`}
                      onClick={(e) => !room.available && e.preventDefault()}
                    >
                      {room.available ? 'Book Now' : 'Unavailable'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Rooms