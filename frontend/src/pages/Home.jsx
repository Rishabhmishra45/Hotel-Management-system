import { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { 
  ArrowRight, 
  Star, 
  Shield, 
  Clock, 
  Users, 
  MapPin, 
  ChevronRight, 
  Sparkles, 
  Award, 
  CheckCircle,
  Calendar,
  Bed,
  Wifi,
  Coffee,
  Car,
  Bath,
  Tv,
  Utensils
} from 'lucide-react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/effect-fade'
import { rooms } from '../services/api'

const Home = () => {
  const [featuredRooms, setFeaturedRooms] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeFeature, setActiveFeature] = useState(0)
  const heroRef = useRef(null)
  const statsRef = useRef(null)

  useEffect(() => {
    fetchRooms()
    // Intersection Observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in')
          }
        })
      },
      { threshold: 0.1 }
    )

    const elements = document.querySelectorAll('.observe')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const fetchRooms = async () => {
    try {
      const { data } = await rooms.getAll()
      if (data.success) {
        // Sort rooms by rating or popularity
        const sortedRooms = data.rooms
          .sort((a, b) => b.rating - a.rating)
          .slice(0, 3)
        setFeaturedRooms(sortedRooms)
      }
    } catch (error) {
      console.error('Failed to fetch rooms')
    } finally {
      setLoading(false)
    }
  }

  const features = [
    {
      icon: Shield,
      title: 'Secure Booking',
      description: 'Your booking is 100% secure with our advanced encryption.',
      gradient: 'from-blue-500 to-cyan-500',
      highlights: ['SSL Encrypted', 'PCI DSS Compliant', '24/7 Monitoring']
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs.',
      gradient: 'from-purple-500 to-pink-500',
      highlights: ['Instant Response', 'Multilingual', 'Any Device']
    },
    {
      icon: Users,
      title: 'Family Friendly',
      description: 'Perfect accommodations for families of all sizes.',
      gradient: 'from-green-500 to-emerald-500',
      highlights: ['Kids Play Area', 'Family Suites', 'Babysitting Services']
    },
    {
      icon: MapPin,
      title: 'Prime Locations',
      description: 'Located in the heart of the city with amazing views.',
      gradient: 'from-orange-500 to-red-500',
      highlights: ['City Center', 'Near Airport', 'Tourist Hotspots']
    },
  ]

  const amenities = [
    { icon: Wifi, label: 'High-speed WiFi' },
    { icon: Coffee, label: 'Complimentary Coffee' },
    { icon: Car, label: 'Free Parking' },
    { icon: Tv, label: 'Smart TV' },
    { icon: Bath, label: 'Luxury Bathroom' },
    { icon: Utensils, label: 'Restaurant' },
    { icon: Bed, label: 'Premium Bedding' },
    { icon: Sparkles, label: 'Daily Housekeeping' },
  ]

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Business Traveler',
      content: 'The attention to detail was exceptional. From the premium bedding to the high-speed WiFi, everything was perfect for my business trip.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      stay: 'Executive Suite',
      duration: '3 nights'
    },
    {
      name: 'Michael Chen',
      role: 'Family Vacation',
      content: 'Our kids absolutely loved the play area and the family suite was spacious enough for all of us. Will definitely return!',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael',
      stay: 'Family Suite',
      duration: '7 nights'
    },
    {
      name: 'Emma Davis',
      role: 'Couple Getaway',
      content: 'The sea view from our room was breathtaking. The romantic package made our anniversary truly special.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
      stay: 'Ocean View Suite',
      duration: '2 nights'
    },
    {
      name: 'Robert Wilson',
      role: 'Luxury Traveler',
      content: 'Best hotel experience in years. The spa services and gourmet dining were exceptional.',
      rating: 5,
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Robert',
      stay: 'Presidential Suite',
      duration: '5 nights'
    },
  ]

  const stats = [
    { value: '98%', label: 'Guest Satisfaction', icon: CheckCircle },
    { value: '24/7', label: 'Customer Support', icon: Clock },
    { value: '50+', label: 'Premium Rooms', icon: Bed },
    { value: '5★', label: 'Average Rating', icon: Award },
  ]

  return (
    <div className="fade-in">
      {/* Hero Section with Parallax */}
      <div 
        ref={heroRef}
        className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 min-h-[100vh] flex items-center"
      >
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=2070')] bg-cover bg-center opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/80 via-purple-900/60 to-blue-900/80"></div>
          
          {/* Animated particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-white rounded-full animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  opacity: Math.random() * 0.5 + 0.2,
                }}
              />
            ))}
          </div>
        </div>

        {/* Hero Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 w-full">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 mb-6">
                <Sparkles className="h-4 w-4 text-yellow-400 mr-2" />
                <span className="text-yellow-400 text-sm font-medium">Luxury Redefined</span>
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight">
                <span className="block">Experience</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-400">
                  Ultimate Comfort
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl leading-relaxed">
                Discover luxury accommodations with world-class amenities, 
                exquisite dining, and unforgettable experiences tailored just for you.
              </p>

              {/* Quick Stats */}
              <div className="flex flex-wrap gap-6 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="flex items-center">
                      <Icon className="h-5 w-5 text-yellow-400 mr-2" />
                      <div>
                        <div className="text-2xl font-bold text-white">{stat.value}</div>
                        <div className="text-sm text-gray-400">{stat.label}</div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/rooms"
                  className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl hover:from-yellow-600 hover:to-orange-600 transition-all duration-300 shadow-xl hover:shadow-2xl hover:scale-[1.02]"
                >
                  <span className="relative z-10 flex items-center">
                    Book Now
                    <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-yellow-500 rounded-xl opacity-0 group-hover:opacity-100 blur-md transition-opacity duration-300"></div>
                </Link>
                
                <Link
                  to="/rooms"
                  className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold text-white border-2 border-white/30 rounded-xl hover:bg-white/10 backdrop-blur-sm transition-all duration-300 hover:border-white/50"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  View Rooms
                  <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>

            {/* Hero Image/Booking Card */}
            <div className="relative">
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-2xl">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                    Best Rates Guaranteed
                  </div>
                </div>
                
                <h3 className="text-2xl font-bold text-white mb-6">Quick Booking</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Check-in / Check-out</label>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-yellow-400 mr-2" />
                          <span className="text-white">Check-in</span>
                        </div>
                      </div>
                      <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-yellow-400 mr-2" />
                          <span className="text-white">Check-out</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Guests</label>
                    <div className="bg-white/10 border border-white/20 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <Users className="h-4 w-4 text-yellow-400 mr-2" />
                          <span className="text-white">2 Adults, 1 Room</span>
                        </div>
                        <ChevronRight className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  </div>
                  
                  <button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02]">
                    Check Availability
                  </button>
                </div>
              </div>
              
              {/* Floating Elements */}
              <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-green-500 to-emerald-600 text-white px-4 py-2 rounded-lg shadow-xl">
                <div className="flex items-center">
                  <Award className="h-4 w-4 mr-2" />
                  <span className="font-semibold">TripAdvisor 2024 Winner</span>
                </div>
              </div>
              
              <div className="absolute -top-6 -right-6 bg-gradient-to-r from-pink-500 to-rose-600 text-white px-4 py-2 rounded-lg shadow-xl">
                <div className="flex items-center">
                  <Sparkles className="h-4 w-4 mr-2" />
                  <span className="font-semibold">Luxury Certified</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="animate-bounce">
            <ChevronRight className="h-8 w-8 text-white/50 rotate-90" />
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => {
              const Icon = stat.icon
              return (
                <div 
                  key={index} 
                  className="text-center group hover:transform hover:scale-105 transition-all duration-300"
                >
                  <div className="text-4xl md:text-5xl font-bold text-white mb-2">{stat.value}</div>
                  <div className="flex items-center justify-center text-gray-300">
                    <Icon className="h-5 w-5 mr-2 text-yellow-400" />
                    <span className="text-sm md:text-base">{stat.label}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Features Section with Interactive Cards */}
      <div className="py-20 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Why Stay With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Us?</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Experience hospitality redefined with our premium services and exceptional care
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Feature Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((feature, index) => {
                const Icon = feature.icon
                return (
                  <div
                    key={index}
                    onMouseEnter={() => setActiveFeature(index)}
                    className={`group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700 cursor-pointer transform hover:-translate-y-1 ${
                      activeFeature === index ? 'ring-2 ring-blue-500' : ''
                    }`}
                  >
                    <div className={`h-16 w-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-4">{feature.description}</p>
                    <ul className="space-y-2">
                      {feature.highlights.map((highlight, i) => (
                        <li key={i} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>

            {/* Feature Details */}
            <div className="relative">
              <div className="sticky top-24 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-8 shadow-xl">
                <div className={`h-24 w-24 bg-gradient-to-br ${features[activeFeature].gradient} rounded-2xl flex items-center justify-center mb-6 mx-auto transform rotate-0 hover:rotate-12 transition-transform duration-500`}>
                  {(() => {
                    const Icon = features[activeFeature].icon
                    return <Icon className="h-12 w-12 text-white" />
                  })()}
                </div>
                <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                  {features[activeFeature].title}
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 text-center mb-6">
                  {features[activeFeature].description}
                </p>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Key Benefits:</h4>
                  <ul className="space-y-3">
                    {features[activeFeature].highlights.map((highlight, i) => (
                      <li key={i} className="flex items-center">
                        <div className="h-2 w-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-3"></div>
                        <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Amenities Section */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Premium <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Amenities</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Enjoy world-class facilities designed for your comfort and convenience
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-12">
            {amenities.map((amenity, index) => {
              const Icon = amenity.icon
              return (
                <div 
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-xl p-4 text-center hover:shadow-2xl hover:transform hover:-translate-y-2 transition-all duration-300 border border-gray-100 dark:border-gray-700"
                >
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{amenity.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Featured Rooms with Enhanced Cards */}
      <div className="py-20 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-16">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
                Featured <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600">Accommodations</span>
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-400">
                Discover our most luxurious rooms with premium amenities and breathtaking views
              </p>
            </div>
            <Link
              to="/rooms"
              className="group mt-6 lg:mt-0 inline-flex items-center text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            >
              Explore All Rooms
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-2xl h-[500px] animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredRooms.map((room) => (
                <div
                  key={room._id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-3xl transition-all duration-500 border border-gray-100 dark:border-gray-700 hover:transform hover:-translate-y-2"
                >
                  {/* Room Image with Overlay */}
                  <div className="relative h-64 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-purple-600/20 z-10"></div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-20"></div>
                    
                    {/* Room Type Badge */}
                    <div className="absolute top-4 left-4 z-30">
                      <span className="px-3 py-1 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-semibold rounded-full">
                        {room.type || 'Deluxe'}
                      </span>
                    </div>
                    
                    {/* Availability Badge */}
                    {!room.available && (
                      <div className="absolute top-4 right-4 z-30 bg-red-600 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg">
                        Booked
                      </div>
                    )}
                    
                    {/* Price */}
                    <div className="absolute bottom-4 left-4 z-30">
                      <div className="text-white">
                        <div className="text-3xl font-bold">${room.pricePerNight}</div>
                        <div className="text-sm opacity-90">per night</div>
                      </div>
                    </div>
                  </div>

                  {/* Room Details */}
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{room.title}</h3>
                        <div className="flex items-center text-gray-600 dark:text-gray-400">
                          <Users className="h-5 w-5 mr-2" />
                          <span className="text-sm">Up to {room.capacity} guests</span>
                        </div>
                      </div>
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${i < (room.rating || 4) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                          />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-2">{room.description}</p>
                    
                    {/* Room Features */}
                    <div className="flex flex-wrap gap-2 mb-6">
                      <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm rounded-full">
                        {room.size || '350'} sq ft
                      </span>
                      <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 text-sm rounded-full">
                        King Bed
                      </span>
                      <span className="px-3 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 text-sm rounded-full">
                        Ocean View
                      </span>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-between items-center pt-6 border-t border-gray-100 dark:border-gray-700">
                      <div>
                        <div className="text-3xl font-bold text-gray-900 dark:text-white">${room.pricePerNight}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">+ taxes & fees</div>
                      </div>
                      <Link
                        to={`/book/${room._id}`}
                        className={`group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 overflow-hidden ${
                          room.available
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                            : 'bg-gray-300 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                        }`}
                        onClick={(e) => !room.available && e.preventDefault()}
                      >
                        <span className="relative z-10 flex items-center">
                          {room.available ? 'Book Now' : 'Unavailable'}
                          {room.available && (
                            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                          )}
                        </span>
                        {room.available && (
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        )}
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Testimonials with Enhanced Slider */}
      <div className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              Guest <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-600">Experiences</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Join thousands of satisfied guests who've experienced luxury redefined
            </p>
          </div>
          
          <Swiper
            modules={[Navigation, Pagination, Autoplay, EffectFade]}
            spaceBetween={30}
            slidesPerView={1}
            navigation
            pagination={{ 
              clickable: true,
              dynamicBullets: true 
            }}
            autoplay={{ 
              delay: 6000, 
              disableOnInteraction: false,
              pauseOnMouseEnter: true 
            }}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="pb-16"
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 h-full border border-gray-100 dark:border-gray-700 shadow-xl hover:shadow-2xl transition-all duration-500 group hover:transform hover:-translate-y-1">
                  {/* Quote Icon */}
                  <div className="text-6xl text-gray-200 dark:text-gray-700 mb-4 opacity-50 group-hover:opacity-70 transition-opacity duration-300">
                    "
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-6 w-6 ${i < testimonial.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                  </div>
                  
                  {/* Content */}
                  <p className="text-gray-700 dark:text-gray-300 mb-8 text-lg leading-relaxed">
                    "{testimonial.content}"
                  </p>
                  
                  {/* Guest Info */}
                  <div className="flex items-center">
                    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-0.5 mr-4">
                      <div className="h-full w-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="h-12 w-12 rounded-full"
                        />
                      </div>
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 dark:text-white text-lg">{testimonial.name}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{testimonial.role}</p>
                      <div className="flex items-center text-sm text-gray-500 dark:text-gray-500">
                        <Bed className="h-4 w-4 mr-1" />
                        {testimonial.stay} • {testimonial.duration}
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      {/* Final CTA Section */}
      <div className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute top-0 left-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/10 rounded-full mix-blend-overlay filter blur-3xl animate-pulse animation-delay-2000"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-8">
              Your Perfect Stay <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-300">
                Awaits
              </span>
            </h2>
            
            <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
              Book your luxury escape today and enjoy exclusive benefits including 
              complimentary breakfast, spa access, and late checkout.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link
                to="/rooms"
                className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-blue-600 bg-white hover:bg-gray-50 rounded-xl transition-all duration-300 shadow-2xl hover:shadow-3xl hover:scale-[1.02]"
              >
                <Sparkles className="mr-3 h-5 w-5" />
                Explore All Rooms
                <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
              
              <Link
                to="/contact"
                className="group inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white border-2 border-white/50 rounded-xl hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:border-white/80"
              >
                Get Special Offer
                <ChevronRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform" />
              </Link>
            </div>
            
            {/* Trust Badges */}
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-90">
              <div className="flex items-center text-white">
                <Shield className="h-5 w-5 mr-2" />
                <span className="text-sm">Secure Payment</span>
              </div>
              <div className="flex items-center text-white">
                <CheckCircle className="h-5 w-5 mr-2" />
                <span className="text-sm">Best Price Guarantee</span>
              </div>
              <div className="flex items-center text-white">
                <Clock className="h-5 w-5 mr-2" />
                <span className="text-sm">24/7 Support</span>
              </div>
              <div className="flex items-center text-white">
                <Award className="h-5 w-5 mr-2" />
                <span className="text-sm">Award Winning</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home