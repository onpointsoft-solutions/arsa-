import { useState } from 'react'
import { properties } from '../data/properties'
import { PROPERTY_FILTERS } from '../data/constants'

export default function FeaturedProperties() {
  const [activeFilter, setActiveFilter] = useState('All')

  const filtered =
    activeFilter === 'All'
      ? properties
      : properties.filter((p) => p.type === activeFilter || p.tag === activeFilter)

  return (
    <section id="properties" className="py-28 px-8 md:px-16 bg-white">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-8">
        <div>
          <p className="text-[#2d6a4f] text-xs tracking-[0.25em] uppercase mb-4 font-medium">
            Our Portfolio
          </p>
          <h2 className="font-display text-4xl md:text-5xl green-line text-[#111827]">
            Signature<br />
            <em>Residences</em>
          </h2>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {PROPERTY_FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`text-xs tracking-[0.15em] uppercase px-5 py-2.5 rounded border transition-all duration-200 font-medium ${
                activeFilter === f
                  ? 'border-[#2d6a4f] bg-[#2d6a4f] text-white'
                  : 'border-gray-300 text-[#333333] hover:border-[#2d6a4f] hover:text-[#2d6a4f]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="property-card group cursor-pointer rounded-xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300"
          >
            {/* Property Image */}
            <div className="relative overflow-hidden bg-gray-100 aspect-[4/3]">
              <img
                src={p.img}
                alt={p.title}
                className="property-img w-full h-full object-cover transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/70 via-transparent to-transparent" />

              {/* Tag Badge */}
              <span className="absolute top-4 left-4 bg-[#2d6a4f] text-white text-[10px] tracking-[0.2em] uppercase font-semibold px-3 py-1 rounded">
                {p.tag}
              </span>

              {/* Property Info Overlay */}
              <div className="absolute bottom-4 left-4 right-4">
                <div className="font-display text-xl text-white">{p.title}</div>
                <div className="text-white text-xs tracking-wider mt-0.5">{p.location}</div>
              </div>
            </div>

            {/* Property Details */}
            <div className="bg-white p-5 flex items-center justify-between">
              <div className="font-display text-lg text-[#2d6a4f] font-semibold">{p.price}</div>
              <div className="flex gap-5 text-[#333333] text-xs tracking-wider font-medium">
                <span>{p.beds} bd</span>
                <span>{p.baths} ba</span>
                <span>{p.sqft} ft²</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-12">
        <a
          href="#search"
          className="inline-block bg-[#2d6a4f] text-white text-xs tracking-widest uppercase font-semibold px-8 py-3 rounded hover:bg-[#1b4332] transition-colors duration-300"
        >
          View All Properties
        </a>
      </div>
    </section>
  )
}
