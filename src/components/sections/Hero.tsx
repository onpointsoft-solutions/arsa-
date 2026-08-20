import { useState } from 'react'
import { STATISTICS } from '../data/constants'

export default function Hero() {
  const [searchType, setSearchType] = useState<'buy' | 'rent'>('buy')
  const [searchLocation, setSearchLocation] = useState('')
  const [searchPrice, setSearchPrice] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Search:', { searchType, searchLocation, searchPrice })
  }

  return (
    <section className="relative h-screen flex items-end pb-24 overflow-hidden mt-20">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1800&h=1200&fit=crop&auto=format"
          alt="Luxury estate exterior"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(160deg, rgba(255,255,255,0.08) 0%, rgba(17,24,39,0.6) 55%, rgba(17,24,39,0.92) 100%)',
          }}
        />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 px-8 md:px-16 max-w-5xl w-full">
        <p className="text-[#40916c] text-xs tracking-[0.25em] uppercase mb-6 font-medium">
          Curated Luxury · Exceptional Properties
        </p>
        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] mb-8 text-white">
          Where Ambition<br />
          <em className="text-[#40916c] not-italic">Finds Its Home</em>
        </h1>
        <p className="text-white text-base md:text-lg leading-relaxed max-w-xl mb-10">
          ARSA REALESTATE represents the world's finest residential properties that are matched to discerning
          clients through unparalleled expertise and absolute discretion.
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-6 max-w-3xl">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {/* Search Type */}
            <div>
              <label className="block text-[#111827] text-xs tracking-widest uppercase font-semibold mb-2">
                Type
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSearchType('buy')}
                  className={`flex-1 py-2 rounded text-xs font-semibold transition-colors ${
                    searchType === 'buy'
                      ? 'bg-[#2d6a4f] text-white'
                      : 'bg-gray-100 text-[#111827] hover:bg-gray-200'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setSearchType('rent')}
                  className={`flex-1 py-2 rounded text-xs font-semibold transition-colors ${
                    searchType === 'rent'
                      ? 'bg-[#2d6a4f] text-white'
                      : 'bg-gray-100 text-[#111827] hover:bg-gray-200'
                  }`}
                >
                  Rent
                </button>
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="block text-[#111827] text-xs tracking-widest uppercase font-semibold mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="City or address"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#2d6a4f]"
              />
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-[#111827] text-xs tracking-widest uppercase font-semibold mb-2">
                Price
              </label>
              <select
                value={searchPrice}
                onChange={(e) => setSearchPrice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#2d6a4f]"
              >
                <option value="">Any Price</option>
                <option value="0-500k">Under $500k</option>
                <option value="500k-1m">$500k - $1M</option>
                <option value="1m-5m">$1M - $5M</option>
                <option value="5m+">$5M+</option>
              </select>
            </div>

            {/* Property Type */}
            <div>
              <label className="block text-[#111827] text-xs tracking-widest uppercase font-semibold mb-2">
                Type
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-[#2d6a4f]"
              >
                <option>All Types</option>
                <option>House</option>
                <option>Apartment</option>
                <option>Land</option>
                <option>Commercial</option>
              </select>
            </div>

            {/* Search Button */}
            <div className="flex flex-col justify-end">
              <button
                type="submit"
                className="bg-[#2d6a4f] text-white py-2 rounded font-semibold hover:bg-[#1b4332] transition-colors"
              >
                Search
              </button>
            </div>
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <a
            href="#properties"
            className="inline-block bg-[#2d6a4f] text-white text-xs tracking-[0.2em] uppercase font-semibold px-8 py-4 rounded hover:bg-[#1b4332] transition-colors duration-300"
          >
            Explore Properties
          </a>
          <a
            href="#about"
            className="inline-block border border-white/40 text-white text-xs tracking-[0.2em] uppercase px-8 py-4 rounded hover:border-[#40916c] hover:text-[#40916c] transition-colors duration-300"
          >
            Our Story
          </a>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="absolute bottom-0 right-0 hidden lg:flex bg-white/95 backdrop-blur-sm shadow-lg">
        {STATISTICS.map((s, i) => (
          <div key={i} className="px-10 py-6 border-l border-gray-100 text-right">
            <div className="font-display text-2xl text-[#2d6a4f]">{s.value}</div>
            <div className="text-[#333333] text-xs tracking-widest uppercase mt-1 font-medium">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
