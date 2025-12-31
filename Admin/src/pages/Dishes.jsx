import { useState, useEffect, useRef } from 'react'
import { Plus, Edit, Trash2, Search, Filter, Image as ImageIcon, X, DollarSign, Clock, Check, Loader2 } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { dishes as dishApi } from '../services/api'
import Modal from '../components/Modal'

const Dishes = () => {
  const [dishesData, setDishes] = useState([])
  const [filteredDishes, setFilteredDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDish, setEditingDish] = useState(null)
  const [previewImage, setPreviewImage] = useState(null)
  const fileInputRef = useRef(null)
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    available: true,
    image: null,
  })
  const [formErrors, setFormErrors] = useState({})

  useEffect(() => {
    fetchDishes()
  }, [])

  useEffect(() => {
    filterDishes()
  }, [search, filter, dishesData])

  const fetchDishes = async () => {
    try {
      setLoading(true)
      const { data } = await dishApi.getAll()
      if (data.success) {
        setDishes(data.dishes || [])
      }
    } catch (error) {
      console.error('Failed to fetch dishes:', error)
      toast.error('Failed to fetch dishes')
    } finally {
      setLoading(false)
    }
  }

  const filterDishes = () => {
    let result = dishesData

    // Search filter
    if (search) {
      result = result.filter(dish =>
        dish.name?.toLowerCase().includes(search.toLowerCase()) ||
        dish.description?.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Status filter
    if (filter === 'available') {
      result = result.filter(dish => dish.available)
    } else if (filter === 'unavailable') {
      result = result.filter(dish => !dish.available)
    }

    setFilteredDishes(result)
  }

  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) errors.name = 'Dish name is required'
    if (!formData.description.trim()) errors.description = 'Description is required'
    if (!formData.price || formData.price <= 0) errors.price = 'Valid price is required'
    if (!editingDish && !formData.image) errors.image = 'Image is required for new dishes'
    
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

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a valid image (JPEG, PNG, WebP)')
      return
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB')
      return
    }

    setFormData({ ...formData, image: file })
    
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewImage(reader.result)
    }
    reader.readAsDataURL(file)
    
    // Clear image error
    if (formErrors.image) {
      setFormErrors({
        ...formErrors,
        image: ''
      })
    }
  }

  const removeImage = () => {
    setFormData({ ...formData, image: null })
    setPreviewImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
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
      const dishData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        available: formData.available
      }

      // Only include image if it's a new dish or image was changed
      if (formData.image) {
        dishData.image = formData.image
      }

      if (editingDish) {
        await dishApi.update(editingDish._id, dishData)
        toast.success('Dish updated successfully!')
      } else {
        await dishApi.create(dishData)
        toast.success('Dish created successfully!')
      }
      
      setIsModalOpen(false)
      resetForm()
      fetchDishes()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Operation failed. Please try again.'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const handleEdit = (dish) => {
    setEditingDish(dish)
    setFormData({
      name: dish.name || '',
      description: dish.description || '',
      price: dish.price || '',
      available: dish.available ?? true,
      image: null,
    })
    setPreviewImage(dish.image?.url || null)
    setIsModalOpen(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish? This action cannot be undone.')) {
      return
    }

    setActionLoading(true)
    try {
      await dishApi.delete(id)
      toast.success('Dish deleted successfully!')
      fetchDishes()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete dish'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const toggleAvailability = async (dish) => {
    setActionLoading(true)
    try {
      await dishApi.update(dish._id, { available: !dish.available })
      toast.success(`Dish marked as ${!dish.available ? 'available' : 'unavailable'}`)
      fetchDishes()
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update dish'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      available: true,
      image: null,
    })
    setPreviewImage(null)
    setFormErrors({})
    setEditingDish(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleModalClose = () => {
    setIsModalOpen(false)
    resetForm()
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
        <p className="text-gray-600 dark:text-gray-400">Loading dishes...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Dish Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Manage all dishes in your restaurant</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          disabled={actionLoading}
          className="inline-flex items-center justify-center px-4 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          <Plus className="h-5 w-5 mr-2" />
          Add New Dish
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes by name or description..."
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
              <option value="all">All Dishes</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Total Dishes</p>
              <p className="text-2xl font-bold mt-1">{dishesData.length}</p>
            </div>
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <ImageIcon className="h-5 w-5" />
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl p-5 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm opacity-90">Available</p>
              <p className="text-2xl font-bold mt-1">
                {dishesData.filter(d => d.available).length}
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
                {dishesData.filter(d => !d.available).length}
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
                ${dishesData.length > 0 
                  ? (dishesData.reduce((sum, d) => sum + (d.price || 0), 0) / dishesData.length).toFixed(2)
                  : '0.00'}
              </p>
            </div>
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>
        </div>
      </div>

      {/* Dishes Table - Desktop */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hidden lg:block">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Dish</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Description</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Price</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDishes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">
                    <div className="text-gray-500 dark:text-gray-400">
                      {dishesData.length === 0 ? 'No dishes found. Add your first dish!' : 'No dishes match your search.'}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredDishes.map((dish) => (
                  <tr key={dish._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                          {dish.image?.url ? (
                            <img
                              src={dish.image.url}
                              alt={dish.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full flex items-center justify-center">
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900 dark:text-white">{dish.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 max-w-md">
                        {dish.description}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                        <span className="font-semibold text-gray-900 dark:text-white">
                          ${dish.price}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => toggleAvailability(dish)}
                        disabled={actionLoading}
                        className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                          dish.available
                            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-800/50'
                            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-800/50'
                        }`}
                      >
                        {dish.available ? 'Available' : 'Unavailable'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(dish)}
                          disabled={actionLoading}
                          className="p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Edit dish"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(dish._id)}
                          disabled={actionLoading}
                          className="p-2 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Delete dish"
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

      {/* Dishes Cards - Mobile */}
      <div className="lg:hidden space-y-4">
        {filteredDishes.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl p-8 text-center shadow-lg">
            <div className="text-gray-500 dark:text-gray-400 mb-2">
              {dishesData.length === 0 ? 'No dishes found. Add your first dish!' : 'No dishes match your search.'}
            </div>
          </div>
        ) : (
          filteredDishes.map((dish) => (
            <div key={dish._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="p-5">
                <div className="flex items-start mb-4">
                  <div className="h-16 w-16 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700 mr-4">
                    {dish.image?.url ? (
                      <img
                        src={dish.image.url}
                        alt={dish.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">{dish.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                          {dish.description}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleAvailability(dish)}
                        disabled={actionLoading}
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          dish.available
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}
                      >
                        {dish.available ? 'Available' : 'Unavailable'}
                      </button>
                    </div>
                    
                    <div className="flex items-center mt-3">
                      <DollarSign className="h-4 w-4 text-gray-400 mr-1" />
                      <span className="font-bold text-gray-900 dark:text-white">${dish.price}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleEdit(dish)}
                    disabled={actionLoading}
                    className="px-3 py-1.5 text-sm bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dish._id)}
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

      {/* Add/Edit Dish Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        title={editingDish ? 'Edit Dish' : 'Add New Dish'}
      >
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dish Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.name 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white`}
              placeholder="Spaghetti Carbonara"
            />
            {formErrors.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.name}</p>
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
              placeholder="Classic Italian pasta dish with eggs, cheese, pancetta, and black pepper..."
            />
            {formErrors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.description}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Price ($) *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              min="0"
              step="0.01"
              className={`w-full px-4 py-2.5 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                formErrors.price 
                  ? 'border-red-500 focus:border-red-500' 
                  : 'border-gray-300 dark:border-gray-600 focus:border-blue-500'
              } dark:bg-gray-700 dark:text-white`}
              placeholder="12.99"
            />
            {formErrors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.price}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Dish Image {!editingDish && '*'}
            </label>
            <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-lg ${
              formErrors.image 
                ? 'border-red-300 dark:border-red-700' 
                : 'border-gray-300 dark:border-gray-600'
            }`}>
              <div className="space-y-1 text-center">
                {previewImage ? (
                  <div className="relative">
                    <img
                      src={previewImage}
                      alt="Preview"
                      className="mx-auto h-32 w-32 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 p-1 bg-red-100 text-red-600 rounded-full hover:bg-red-200 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">
                        <span>Upload an image</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="sr-only"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      PNG, JPG, GIF up to 5MB
                    </p>
                  </>
                )}
              </div>
            </div>
            {formErrors.image && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">{formErrors.image}</p>
            )}
            {editingDish && dish.image?.url && !previewImage && (
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Current image will be kept if no new image is uploaded.
              </p>
            )}
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
              Available for order
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
              {editingDish ? 'Update Dish' : 'Create Dish'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  )
}

export default Dishes