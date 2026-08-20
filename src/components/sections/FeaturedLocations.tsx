import { FEATURED_LOCATIONS } from '../data/constants'

export default function FeaturedLocations() {
  return (
    <section id="locations" className="py-28 px-8 md:px-16 bg-white">
      {/* Section Header */}
      <div className="text-center mb-20">
        <p className="text-[#2d6a4f] text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          Explore Markets
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-[#111827]">
          Featured<br />
          <em>Locations</em>
        </h2>
      </div>

      {/* Locations Grid */}
      <div className="grid md:grid-cols-4 gap-6">
        {FEATURED_LOCATIONS.map((location) => (
          <div
            key={location.city}
            className="group cursor-pointer rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300"
          >
            {/* Location Image */}
            <div className="relative overflow-hidden aspect-[3/3] bg-gray-100">
              <img
                src={location.image}
                alt={location.city}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/80 via-transparent to-transparent" />

              {/* Location Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="font-display text-2xl text-white mb-1">{location.city}</h3>
                <p className="text-white/80 text-sm font-medium">{location.properties} properties</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <a
          href="#properties"
          className="inline-block bg-[#2d6a4f] text-white text-xs tracking-widest uppercase font-semibold px-8 py-3 rounded hover:bg-[#1b4332] transition-colors duration-300"
        >
          Explore All Cities
        </a>
      </div>
    </section>
  )
}
