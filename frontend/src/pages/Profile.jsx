import { useState, useEffect } from 'react'
import { User, Mail, Phone, MapPin, Calendar, Edit, Save, Camera, Lock, CreditCard, History, Settings, Bell, Shield, HelpCircle } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

const Profile = () => {
  const { user, updateUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    dateOfBirth: '',
  })

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '+1 (234) 567-8900',
        address: user.address || '123 Main Street, New York, NY 10001',
        dateOfBirth: user.dateOfBirth || '1990-01-01',
      })
    }
  }, [user])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSave = async () => {
    try {
      setLoading(true)
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      updateUser({ ...user, ...formData })
      setIsEditing(false)
      toast.success('Profile updated successfully!')
    } catch (error) {
      toast.error('Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const stats = [
    { label: 'Total Bookings', value: '12', icon: History, color: 'bg-blue-500' },
    { label: 'Loyalty Points', value: '1,245', icon: CreditCard, color: 'bg-green-500' },
    { label: 'Reviews', value: '8', icon: HelpCircle, color: 'bg-yellow-500' },
    { label: 'Member Since', value: '2023', icon: Calendar, color: 'bg-purple-500' },
  ]

  const settings = [
    { icon: Bell, label: 'Notifications', description: 'Manage your notification preferences' },
    { icon: Shield, label: 'Privacy & Security', description: 'Control your privacy settings' },
    { icon: Lock, label: 'Change Password', description: 'Update your password regularly' },
    { icon: Settings, label: 'Preferences', description: 'Customize your experience' },
  ]

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">My Profile</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Manage your account settings and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Card */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="relative">
                    <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-3xl font-bold text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <button className="absolute bottom-0 right-0 h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                      <Camera className="h-4 w-4 text-white" />
                    </button>
                  </div>
                  <div className="ml-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isEditing ? (
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          className="bg-transparent border-b border-blue-500 focus:outline-none"
                        />
                      ) : (
                        user.name
                      )}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">Premium Member</p>
                    <div className="flex items-center mt-2">
                      <span className="text-sm bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 px-2 py-1 rounded">
                        Gold Tier
                      </span>
                      <span className="ml-2 text-sm text-gray-500 dark:text-gray-400">Member ID: {user._id?.slice(-8)}</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => isEditing ? handleSave() : setIsEditing(true)}
                  disabled={loading}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    isEditing
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isEditing ? (
                    <>
                      {loading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      ) : (
                        <Save className="h-4 w-4 mr-2" />
                      )}
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {stats.map((stat, index) => {
                  const Icon = stat.icon
                  return (
                    <div key={index} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center">
                        <div className={`${stat.color} p-2 rounded-lg`}>
                          <Icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="ml-3">
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Personal Information */}
              <div className="border-t dark:border-gray-700 pt-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm">Email Address</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="font-medium text-gray-900 dark:text-white">{formData.email}</p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Phone className="h-4 w-4 mr-2" />
                        <span className="text-sm">Phone Number</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="font-medium text-gray-900 dark:text-white">{formData.phone}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">Address</span>
                      </div>
                      {isEditing ? (
                        <textarea
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          rows="2"
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="font-medium text-gray-900 dark:text-white">{formData.address}</p>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center text-gray-600 dark:text-gray-400 mb-1">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">Date of Birth</span>
                      </div>
                      {isEditing ? (
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                        />
                      ) : (
                        <p className="font-medium text-gray-900 dark:text-white">
                          {new Date(formData.dateOfBirth).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Preferences Section */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {settings.map((setting, index) => {
                  const Icon = setting.icon
                  return (
                    <button
                      key={index}
                      className="flex items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                      <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                        <Icon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{setting.label}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">{setting.description}</div>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Right Column - Recent Activity & Quick Actions */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-medium text-gray-900 dark:text-white">View My Bookings</span>
                  <History className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-medium text-gray-900 dark:text-white">Payment Methods</span>
                  <CreditCard className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-medium text-gray-900 dark:text-white">Change Password</span>
                  <Lock className="h-4 w-4 text-gray-400" />
                </button>
                <button className="w-full flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <span className="font-medium text-gray-900 dark:text-white">Help & Support</span>
                  <HelpCircle className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Loyalty Program */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
              <h3 className="text-lg font-bold mb-4">Loyalty Program</h3>
              <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span>Gold Tier</span>
                  <span>1,245 points</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400 rounded-full" style={{ width: '65%' }}></div>
                </div>
                <div className="text-sm mt-2 text-white/80">350 points to Platinum Tier</div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-2"></div>
                  <span className="text-sm">Free room upgrade on next stay</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-2"></div>
                  <span className="text-sm">Priority check-in & check-out</span>
                </div>
                <div className="flex items-center">
                  <div className="h-2 w-2 bg-white rounded-full mr-2"></div>
                  <span className="text-sm">Exclusive member discounts</span>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Recent Activity</h3>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mr-3">
                    <History className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Booking Confirmed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Deluxe Suite • 2 days ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mr-3">
                    <CreditCard className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Payment Processed</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">$249.99 • 5 days ago</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-yellow-100 dark:bg-yellow-900 rounded-full flex items-center justify-center mr-3">
                    <User className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">Profile Updated</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Phone number changed • 1 week ago</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile