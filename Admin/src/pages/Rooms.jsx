import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, Eye, EyeOff, Search, Filter, Users, DollarSign, Check, X, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { rooms as roomApi } from '../services/api'
import Modal from '../components/Modal'

const Rooms = () => {
  const [roomsData, setRooms] = useState([])
  const [filteredRooms, setFilteredRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRoom, setEditingRoom] = useState(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    pricePerNight: '',
    capacity: '',
    available: true,
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchRooms()
  }, [])

  useEffect(() => {
    filterRooms()
  }, [search, filter, roomsData])

  const fetchRooms = async () => {
    try {
      setLoading(true)
      const { data } = await roomApi.getAll()
      if (data.success) {
        setRooms(data.rooms || [])
      }
    } catch (error) {
      console.error('Failed to fetch rooms:', error)
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
        room.title?.toLowerCase().includes(search.toLowerCase()) ||
        room.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Status filter
    if (filter === 'available') {
      result = result.filter(room => room.available)
    } else if (filter === 'unavailable') {
      result = result.filter(room => !room.available)
    }

    setFilteredRooms(result)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (!formData.pricePerNight || formData.pricePerNight <= 0) errors.pricePerNight = 'Valid price is required'
    if (!formData.capacity || formData.capacity <= 0) errors.capacity = 'Valid capacity is required'
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    
    // Clear error for this field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast.error('Please fix form errors')
      return
    }

    setActionLoading(true)
    try {
      const roomData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        pricePerNight: Number(formData.pricePerNight),
        capacity: Number(formData.capacity),
        available: formData.available
      }

      if (editingRoom) {
        await roomApi.update(editingRoom._id, roomData)
        toast.success('Room updated successfully!')
      } else {
        await roomApi.create(roomData)
        toast.success('Room created successfully!')
      }
      
      setIsModalOpen(false)
      resetForm()
      fetchRooms()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Operation failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (room) => {
    setEditingRoom(room)
    setFormData({
      title: room.title || '',
      description: room.description || '',
      pricePerNight: room.pricePerNight || '',
      capacity: room.capacity || '',
      available: room.available ?? true,
    })
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      return
    }

    setActionLoading(true)
    try {
      await roomApi.delete(id)
      toast.success('Room deleted successfully!')
      fetchRooms()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete room'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const toggleAvailability = async (room) => {
    setActionLoading(true)
    try {
      await roomApi.update(room._id, { available: !room.available })
      toast.success(`Room marked as ${!room.available ? 'available' : 'unavailable'}`)
      fetchRooms()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update room'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      pricePerNight: '',
      capacity: '',
      available: true,
    })
    setFormErrors({})
    setEditingRoom(null)
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading rooms...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Room Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all rooms in your hotel</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={actionLoading}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Room
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search rooms by title or description..."
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
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white min-w-[140px]"
            >
              <option value="all">All Rooms</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Rooms</p>
              <p className="text-2xl font-bold mt-1">{roomsData.length}</p>
            </div>
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Available</p>
              <p className="text-2xl font-bold mt-1">
                {roomsData.filter(r => r.available).length}
              </p>
            </div>
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Check className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Unavailable</p>
              <p className="text-2xl font-bold mt-1">
                {roomsData.filter(r => !r.available).length}
              </p>
            </div>
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <X className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Avg. Price</p>
              <p className="text-2xl font-bold mt-1">
                ${roomsData.length > 0 
                  ? (roomsData.reduce((sum, r) => sum + (r.pricePerNight || 0), 0) / roomsData.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Rooms Table - Desktop */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Room Details</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Capacity</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      {roomsData.length === 0 ? 'No rooms found. Add your first room!' : 'No rooms match your search.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => (
                  <tr key={room._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{room.title}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 max-w-md">
                          {room.description}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${room.pricePerNight}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">/night</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md text-sm">
                          {room.capacity} persons
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(room)}
                        disabled={actionLoading}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          room.available
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50'
                        }`}
                      >
                        {room.available ? (
                          <>
                            <Eye className="h-3.5 w-3.5 mr-1" />
                            Available
                          </>
                        ) : (
                          <>
                            <EyeOff className="h-3.5 w-3.5 mr-1" />
                            Unavailable
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(room)}
                          disabled={actionLoading}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit room"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(room._id)}
                          disabled={actionLoading}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete room"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rooms Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredRooms.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              {roomsData.length === 0 ? 'No rooms found. Add your first room!' : 'No rooms match your search.'}
            </div>
          </div>
        ) : (
          filteredRooms.map((room) => (
            <div key={room._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold text-gray-900 dark:text-white text-lg">{room.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                      {room.description}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleAvailability(room)}
                    disabled={actionLoading}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      room.available
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                    }`}
                  >
                    {room.available ? 'Available' : 'Unavailable'}
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="flex items-center">
                    <DollarSign className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">${room.pricePerNight}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">per night</div>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <Users className="h-4 w-4 text-gray-400 mr-2" />
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">{room.capacity}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">persons</div>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleEdit(room)}
                    disabled={actionLoading}
                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(room._id)}
                    disabled={actionLoading}
                    className="px-3 py-1.5 text-sm bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Room Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingRoom ? 'Edit Room' : 'Add New Room'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Room Title *
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.title 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white`}
              placeholder="Deluxe Suite with Sea View"
            />
            {formErrors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.title}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows="3"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.description 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white`}
              placeholder="Spacious room with panoramic sea view, king-sized bed, and luxury amenities..."
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.description}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price per Night ($) *
              </label>
              <input
                type="number"
                name="pricePerNight"
                value={formData.pricePerNight}
                onChange={handleInputChange}
                min="0"
                step="0.01"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.pricePerNight 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                } dark:bg-gray-700 dark:text-white`}
                placeholder="199.99"
              />
              {formErrors.pricePerNight && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.pricePerNight}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Capacity (Persons) *
              </label>
              <input
                type="number"
                name="capacity"
                value={formData.capacity}
                onChange={handleInputChange}
                min="1"
                max="10"
                className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  formErrors.capacity 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
                } dark:bg-gray-700 dark:text-white`}
                placeholder="2"
              />
              {formErrors.capacity && (
                <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.capacity}</p>
              )}
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="available"
              name="available"
              checked={formData.available}
              onChange={handleInputChange}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="available" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Available for booking
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
            <button
              type="button"
              onClick={handleModalClose}
              disabled={actionLoading}
              className="px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={actionLoading}
              className="px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center"
            >
              {actionLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingRoom ? 'Update Room' : 'Create Room'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Rooms