import { Users, Target, Award, Globe, Heart, Clock, Shield, Star } from 'lucide-react'

const About = () => {
  const features = [
    {
      icon: Heart,
      title: 'Passionate Hospitality',
      description: 'We treat every guest like family with genuine care and attention.',
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Your safety and comfort are our top priorities with 24/7 security.',
    },
    {
      icon: Globe,
      title: 'Global Standards',
      description: 'International hospitality standards with local cultural touch.',
    },
    {
      icon: Clock,
      title: '24/7 Service',
      description: 'Round-the-clock concierge and room service for your convenience.',
    },
  ]

  const team = [
    {
      name: 'Sarah Johnson',
      role: 'General Manager',
      experience: '15 years',
      image: 'SJ',
    },
    {
      name: 'Michael Chen',
      role: 'Head Chef',
      experience: '12 years',
      image: 'MC',
    },
    {
      name: 'Emma Davis',
      role: 'Guest Relations',
      experience: '8 years',
      image: 'ED',
    },
    {
      name: 'Robert Wilson',
      role: 'Operations Director',
      experience: '20 years',
      image: 'RW',
    },
  ]

  const stats = [
    { value: '10,000+', label: 'Happy Guests' },
    { value: '95%', label: 'Guest Satisfaction' },
    { value: '150+', label: 'Team Members' },
    { value: '25', label: 'Awards Won' },
  ]

  return (
    <div className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
            Luxury <span className="text-blue-600 dark:text-blue-400">Redefined</span>, Hospitality <span className="text-blue-600 dark:text-blue-400">Perfected</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            For over two decades, StaySync has been setting new standards in luxury hospitality, 
            blending timeless elegance with modern comfort to create unforgettable experiences.
          </p>
        </div>

        {/* Story Section */}
        <div className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  Founded in 2003, StaySync began as a small family-run hotel with a simple vision: 
                  to create a home away from home for travelers seeking comfort and luxury.
                </p>
                <p>
                  Over the years, we've grown into an internationally recognized hospitality brand, 
                  but we've never lost sight of our core values - personalized service, attention to detail, 
                  and creating memorable experiences.
                </p>
                <p>
                  Today, we continue to innovate while maintaining the traditional warmth and hospitality 
                  that has become our signature.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
              <div className="text-center">
                <Target className="h-12 w-12 mx-auto mb-6" />
                <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                <p className="text-blue-100">
                  To create exceptional experiences by providing unparalleled hospitality, 
                  luxurious comfort, and personalized service that exceeds expectations and 
                  creates lasting memories for every guest.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Why Choose StaySync</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon
              return (
                <div
                  key={index}
                  className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                    <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                </div>
              )
            })}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center text-white">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-blue-100">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Meet Our Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
              >
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <span className="text-5xl font-bold text-white">{member.image}</span>
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">{member.name}</h3>
                  <p className="text-blue-600 dark:text-blue-400 font-medium mb-2">{member.role}</p>
                  <div className="flex items-center text-gray-600 dark:text-gray-400">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{member.experience} experience</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Our Core Values</h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mr-4">
                    <Users className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">People First</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Our team members and guests are at the heart of everything we do.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center mr-4">
                    <Star className="h-5 w-5 text-yellow-600 dark:text-yellow-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Excellence</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      We strive for perfection in every detail of your experience.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mr-4">
                    <Award className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Innovation</h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Continuously evolving to meet and exceed modern hospitality standards.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-500 to-blue-500 rounded-xl p-8 text-white">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-4">Sustainability Commitment</h3>
                <p className="text-white/90 mb-6">
                  We are committed to sustainable practices that protect our planet while providing luxury hospitality.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold">100%</div>
                    <div className="text-sm">Renewable Energy</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">Zero</div>
                    <div className="text-sm">Single-Use Plastic</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">85%</div>
                    <div className="text-sm">Local Sourcing</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold">200+</div>
                    <div className="text-sm">Trees Planted</div>
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

export default About