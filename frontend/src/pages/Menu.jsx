import { useState, useEffect } from 'react'
import { Search, Star, Clock, Tag } from 'lucide-react'
import { dishes } from '../services/api'
import { toast } from 'react-hot-toast'

const Menu = () => {
  const [dishesData, setDishes] = useState([])
  const [filteredDishes, setFilteredDishes] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    fetchDishes()
  }, [])

  useEffect(() => {
    filterDishes()
  }, [search, filter, dishesData])

  const fetchDishes = async () => {
    try {
      const { data } = await dishes.getAll()
      if (data.success) {
        setDishes(data.dishes)
        setFilteredDishes(data.dishes)
      }
    } catch (error) {
      toast.error('Failed to fetch menu')
    } finally {
      setLoading(false)
    }
  }

  const filterDishes = () => {
    let result = dishesData

    // Search filter
    if (search) {
      result = result.filter(dish =>
        dish.name.toLowerCase().includes(search.toLowerCase()) ||
        dish.description.toLowerCase().includes(search.toLowerCase())
      )
    }

    // Availability filter
    if (filter === 'available') {
      result = result.filter(dish => dish.available)
    } else if (filter === 'unavailable') {
      result = result.filter(dish => !dish.available)
    }

    setFilteredDishes(result)
  }

  const categories = ['all', 'available', 'unavailable']

  if (loading) {
    return (
      <div className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Restaurant Menu</h1>
            <p className="text-gray-600 dark:text-gray-400">Loading menu...</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-700 rounded-xl h-64 animate-pulse"></div>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Restaurant Menu</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Discover our exquisite culinary creations</p>
        </div>

        {/* Filters */}
        <div className="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search dishes..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 pr-4 py-3 w-full border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div className="flex space-x-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setFilter(category)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === category
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                  }`}
                >
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Menu Grid */}
        {filteredDishes.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">No dishes found matching your criteria</div>
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
            {filteredDishes.map((dish) => (
              <div
                key={dish._id}
                className={`bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 ${
                  !dish.available ? 'opacity-75' : ''
                }`}
              >
                {/* Dish Image */}
                <div className="h-48 overflow-hidden">
                  <img
                    src={dish.image?.url || 'https://via.placeholder.com/400x300'}
                    alt={dish.name}
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  />
                  {!dish.available && (
                    <div className="absolute top-4 right-4 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      Unavailable
                    </div>
                  )}
                  {dish.price > 25 && (
                    <div className="absolute top-4 left-4 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center">
                      <Star className="h-3 w-3 mr-1 fill-white" />
                      Premium
                    </div>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">{dish.name}</h3>
                      <div className="flex items-center text-gray-600 dark:text-gray-400">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">20-30 min</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900 dark:text-white">${dish.price}</div>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{dish.description}</p>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">(4.5)</span>
                    </div>
                    <button
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center ${
                        dish.available
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      }`}
                      disabled={!dish.available}
                    >
                      <Tag className="h-4 w-4 mr-2" />
                      {dish.available ? 'Order Now' : 'Unavailable'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Tags */}
        <div className="mt-12 pt-8 border-t dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Popular Tags</h2>
          <div className="flex flex-wrap gap-3">
            {['Vegetarian', 'Spicy', 'Chef Special', 'Seafood', 'Dessert', 'Healthy', 'Breakfast', 'Italian'].map(
              (tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors cursor-pointer"
                >
                  {tag}
                </span>
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Menu