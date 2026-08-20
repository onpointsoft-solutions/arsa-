import { properties } from '../../components/data/properties'
import { testimonials } from '../../components/data/testimonials'
import { FEATURED_AGENTS } from '../../components/data/constants'

export default function Dashboard() {
  const stats = [
    { label: 'Total Properties', value: properties.length, icon: '🏠', color: 'bg-blue-50' },
    { label: 'Total Agents', value: FEATURED_AGENTS.length, icon: '👥', color: 'bg-green-50' },
    { label: 'Total Users', value: 1250, icon: '👨', color: 'bg-purple-50' },
    { label: 'Total Testimonials', value: testimonials.length, icon: '⭐', color: 'bg-yellow-50' },
  ]

  const recentProperties = properties.slice(0, 5)
  const recentTestimonials = testimonials.slice(0, 3)

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="font-display text-3xl text-[#111827] mb-2">Dashboard Overview</h2>
        <p className="text-gray-600">Welcome back! Here's what's happening with your properties.</p>
      </div>

      {/* Statistics Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div
            key={i}
            className={`${stat.color} border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-3xl">{stat.icon}</span>
              <span className="text-sm font-semibold text-gray-500">↑ 12%</span>
            </div>
            <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
            <p className="font-display text-3xl text-[#111827] mt-2">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Recent Properties */}
        <div className="md:col-span-2 bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-display text-xl text-[#111827]">Recent Properties</h3>
            <a href="/admin/properties" className="text-[#2d6a4f] hover:text-[#1b4332] text-sm font-semibold">
              View All →
            </a>
          </div>

          <div className="space-y-4">
            {recentProperties.map((prop) => (
              <div
                key={prop.id}
                className="flex items-center gap-4 pb-4 border-b border-gray-100 last:border-0"
              >
                <img
                  src={prop.img}
                  alt={prop.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-[#111827]">{prop.title}</h4>
                  <p className="text-sm text-gray-500">{prop.location}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-[#2d6a4f]">{prop.price}</p>
                  <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium mt-1">
                    {prop.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-6">
          {/* Activity */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-display text-lg text-[#111827] mb-4">Today's Activity</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">New Properties</span>
                <span className="font-semibold text-[#111827]">3</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">New Users</span>
                <span className="font-semibold text-[#111827]">12</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Messages</span>
                <span className="font-semibold text-[#111827]">5</span>
              </div>
            </div>
          </div>

          {/* Recent Testimonials */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-display text-lg text-[#111827] mb-4">Latest Reviews</h3>
            <div className="space-y-3">
              {recentTestimonials.map((t) => (
                <div key={t.name} className="flex gap-2">
                  <div className="text-yellow-500 text-sm">⭐⭐⭐⭐⭐</div>
                  <div>
                    <p className="text-xs font-semibold text-[#111827]">{t.name}</p>
                    <p className="text-xs text-gray-500 line-clamp-2">{t.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-display text-xl text-[#111827] mb-4">Monthly Analytics</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <p className="text-gray-400">Analytics chart would render here</p>
        </div>
      </div>
    </div>
  )
}
