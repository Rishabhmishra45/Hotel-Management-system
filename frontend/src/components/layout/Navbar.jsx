import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { 
  Hotel, 
  Menu, 
  X, 
  Sun, 
  Moon, 
  User, 
  LogOut, 
  Home, 
  Bed, 
  Utensils, 
  Info, 
  Phone, 
  Calendar,
  Sparkles,
  Bell,
  Settings,
  CreditCard,
  ChevronDown,
  Search,
  Shield,
  Award,
  ExternalLink
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user, logout, isAuthenticated } = useAuth()
  const { isDark, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()
  const userMenuRef = useRef(null)
  const searchRef = useRef(null)

  // Handle scroll effect with throttle
  useEffect(() => {
    let ticking = false
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setScrolled(window.scrollY > 20)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target) && searchQuery === '') {
        setSearchOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [searchQuery])

  const handleLogout = () => {
    logout()
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
    navigate('/')
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`)
      setSearchOpen(false)
      setSearchQuery('')
    }
  }

  const navLinks = [
    { name: 'Home', href: '/', icon: Home, badge: null },
    { name: 'Rooms', href: '/rooms', icon: Bed, badge: 'Premium' },
    { name: 'Dining', href: '/menu', icon: Utensils, badge: 'New' },
    { name: 'About', href: '/about', icon: Info, badge: null },
    { name: 'Contact', href: '/contact', icon: Phone, badge: null },
  ]

  const userMenuItems = [
    { name: 'My Profile', href: '/profile', icon: User },
    { name: 'My Bookings', href: '/my-bookings', icon: Calendar },
    { name: 'Payment Methods', href: '/payment', icon: CreditCard },
    { name: 'Notifications', href: '/notifications', icon: Bell, badge: '3' },
    { name: 'Settings', href: '/settings', icon: Settings },
    { name: 'Help & Support', href: '/support', icon: Shield },
  ]

  const isActive = (path) => location.pathname === path || location.pathname.startsWith(path + '/')

  return (
    <nav 
      className={`sticky top-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-xl border-b border-gray-200/50 dark:border-gray-700/50' 
          : 'bg-white dark:bg-gray-900'
      }`}
    >
      <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 lg:h-20">
          {/* Logo & Desktop Navigation */}
          <div className="flex items-center flex-1">
            {/* Logo */}
            <Link 
              to="/" 
              className="flex items-center space-x-2 group"
              onClick={() => setIsMenuOpen(false)}
            >
              <div className="relative">
                <Hotel className="h-10 w-10 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300" />
                <Sparkles className="h-4 w-4 text-yellow-500 absolute -top-1 -right-1 animate-pulse" />
              </div>
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  StaySync
                </span>
                <div className="flex items-center space-x-1">
                  <Award className="h-3 w-3 text-yellow-500" />
                  <span className="text-xs text-gray-500 dark:text-gray-400">Luxury Hotels</span>
                </div>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <div className="hidden lg:flex lg:ml-8 lg:space-x-1">
              {navLinks.map((link) => {
                const Icon = link.icon
                return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={`relative flex items-center px-4 py-2 mx-1 rounded-xl text-sm font-semibold transition-all duration-300 group ${
                      isActive(link.href)
                        ? 'text-blue-700 dark:text-blue-300 bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10'
                        : 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                    }`}
                  >
                    <Icon className="h-5 w-5 mr-2" />
                    {link.name}
                    {link.badge && (
                      <span className="absolute -top-1 -right-1 px-1.5 py-0.5 text-[10px] font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full">
                        {link.badge}
                      </span>
                    )}
                    {/* Hover Indicator */}
                    <span className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 transition-all duration-300 ${
                      isActive(link.href) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                    }`} />
                  </Link>
                )
              })}
            </div>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden lg:flex items-center flex-1 max-w-md mx-6">
            <form 
              onSubmit={handleSearch}
              ref={searchRef}
              className={`relative w-full transition-all duration-500 ${
                searchOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
              }`}
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search rooms, amenities..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300"
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-12 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </form>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className={`ml-2 p-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 ${
                searchOpen ? 'rotate-90' : ''
              }`}
            >
              <Search className="h-5 w-5" />
            </button>
          </div>

          {/* Right Side Actions */}
          <div className="flex items-center space-x-2">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105 transition-all duration-300 group"
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark ? (
                <div className="flex items-center">
                  <Sun className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="ml-2 text-sm hidden xl:inline animate-pulse">Light</span>
                </div>
              ) : (
                <div className="flex items-center">
                  <Moon className="h-5 w-5 group-hover:rotate-180 transition-transform duration-500" />
                  <span className="ml-2 text-sm hidden xl:inline">Dark</span>
                </div>
              )}
            </button>

            {/* Notification Bell */}
            {isAuthenticated && (
              <button className="p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:shadow-lg hover:scale-105 transition-all duration-300 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
                  3
                </span>
              </button>
            )}

            {/* Authentication State */}
            {isAuthenticated ? (
              <>
                {/* User Menu - Desktop */}
                <div className="hidden lg:block relative" ref={userMenuRef}>
                  <button
                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                    className="flex items-center space-x-3 p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                  >
                    <div className="relative">
                      <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                        <span className="text-white font-bold text-base">
                          {user?.name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                    </div>
                    <div className="text-left hidden xl:block">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white">
                        {user?.name?.split(' ')[0]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Premium Member</p>
                    </div>
                    <ChevronDown className={`h-5 w-5 text-gray-500 transition-transform duration-300 ${
                      isUserMenuOpen ? 'rotate-180' : ''
                    }`} />
                  </button>

                  {/* Dropdown Menu */}
                  {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl py-2 border border-gray-100 dark:border-gray-700 animate-in slide-in-from-top-5">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700">
                        <div className="flex items-center space-x-3">
                          <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-lg">
                              {user?.name?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 dark:text-white">{user?.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400 truncate max-w-[140px]">
                              {user?.email}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex items-center space-x-2">
                          <div className="px-2 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 rounded-full">
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">Gold Tier</span>
                          </div>
                          <Sparkles className="h-3 w-3 text-yellow-500" />
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-1">
                        {userMenuItems.map((item) => {
                          const Icon = item.icon
                          return (
                            <Link
                              key={item.name}
                              to={item.href}
                              onClick={() => setIsUserMenuOpen(false)}
                              className="flex items-center justify-between px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                            >
                              <div className="flex items-center">
                                <Icon className="h-4 w-4 mr-3 text-gray-500 dark:text-gray-400" />
                                {item.name}
                              </div>
                              {item.badge && (
                                <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full">
                                  {item.badge}
                                </span>
                              )}
                            </Link>
                          )
                        })}
                      </div>

                      {/* Logout Button */}
                      <div className="border-t border-gray-100 dark:border-gray-700 pt-1">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200 rounded-b-2xl"
                        >
                          <LogOut className="h-4 w-4 mr-3" />
                          Logout
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-5 py-2.5 text-sm font-semibold text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-5 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                >
                  Get Started
                  <ExternalLink className="h-3 w-3 ml-1 inline" />
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-3 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 hover:shadow-lg transition-all duration-300"
              aria-label="Toggle menu"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 animate-in spin-in-90" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden transition-all duration-500 ease-in-out ${
          isMenuOpen 
            ? 'max-h-screen opacity-100 visible' 
            : 'max-h-0 opacity-0 invisible'
        }`}>
          {/* Mobile Search */}
          <div className="px-4 py-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search rooms, amenities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 dark:text-white"
              />
            </form>
          </div>

          {/* Mobile Navigation Links */}
          <div className="px-2 pb-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon
              return (
                <Link
                  key={link.name}
                  to={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-base font-medium transition-all duration-300 ${
                    isActive(link.href)
                      ? 'bg-gradient-to-r from-blue-50 to-blue-100/50 dark:from-blue-900/20 dark:to-blue-900/10 text-blue-700 dark:text-blue-300'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center">
                    <Icon className="h-5 w-5 mr-3" />
                    {link.name}
                  </div>
                  {link.badge && (
                    <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-full">
                      {link.badge}
                    </span>
                  )}
                </Link>
              )
            })}

            {/* Mobile Authentication */}
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mt-2">
              {isAuthenticated ? (
                <>
                  {/* User Info */}
                  <div className="px-4 py-3 mb-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800/50 dark:to-gray-800/30 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-white font-bold text-lg">
                            {user?.name?.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-900"></div>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white">{user?.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                      </div>
                      <Bell className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                    </div>
                  </div>

                  {/* User Actions */}
                  {userMenuItems.slice(0, 4).map((item) => {
                    const Icon = item.icon
                    return (
                      <Link
                        key={item.name}
                        to={item.href}
                        onClick={() => setIsMenuOpen(false)}
                        className="flex items-center justify-between px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-base font-medium"
                      >
                        <div className="flex items-center">
                          <Icon className="h-5 w-5 mr-3" />
                          {item.name}
                        </div>
                        {item.badge && (
                          <span className="px-2 py-0.5 text-xs font-bold bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full">
                            {item.badge}
                          </span>
                        )}
                      </Link>
                    )
                  })}

                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl text-base font-medium mt-2"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl text-base font-medium"
                  >
                    <User className="h-5 w-5 mr-3" />
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl text-base font-medium hover:from-blue-700 hover:to-purple-700 mt-2"
                  >
                    Create Account
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar