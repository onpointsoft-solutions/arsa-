import { FEATURED_AGENTS } from '../data/constants'

export default function Agents() {
  return (
    <section id="agents" className="py-28 px-8 md:px-16 bg-[#f8faf9]">
      {/* Section Header */}
      <div className="text-center mb-20">
        <p className="text-[#2d6a4f] text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          Our Team
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-[#111827]">
          Featured<br />
          <em>Agents</em>
        </h2>
      </div>

      {/* Agents Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {FEATURED_AGENTS.map((agent) => (
          <div
            key={agent.id}
            className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* Agent Image */}
            <div className="relative h-64 overflow-hidden bg-gray-100">
              <img
                src={agent.image}
                alt={agent.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>

            {/* Agent Info */}
            <div className="p-8">
              <h3 className="font-display text-xl text-[#111827] mb-1">{agent.name}</h3>
              <p className="text-[#2d6a4f] text-sm font-semibold mb-4">{agent.title}</p>

              {/* Stats */}
              <div className="flex justify-between mb-6 pb-6 border-b border-gray-100">
                <div>
                  <div className="text-xl font-display text-[#2d6a4f]">{agent.properties}</div>
                  <div className="text-[#333333] text-xs font-medium">Properties Sold</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-display text-[#2d6a4f]">4.9★</div>
                  <div className="text-[#333333] text-xs font-medium">Rating</div>
                </div>
              </div>

              {/* Contact Button */}
              <a
                href={`tel:${agent.phone}`}
                className="block w-full text-center bg-[#2d6a4f] text-white text-xs tracking-widest uppercase font-semibold py-2 rounded hover:bg-[#1b4332] transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="text-center mt-12">
        <a
          href="#contact"
          className="inline-block bg-[#2d6a4f] text-white text-xs tracking-widest uppercase font-semibold px-8 py-3 rounded hover:bg-[#1b4332] transition-colors duration-300"
        >
          Meet Our Team
        </a>
      </div>
    </section>
  )
}
