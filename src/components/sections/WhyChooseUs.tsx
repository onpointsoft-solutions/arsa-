import { WHY_CHOOSE_US } from '../data/constants'

export default function WhyChooseUs() {
  return (
    <section id="services" className="py-28 px-8 md:px-16 bg-white">
      {/* Section Header */}
      <div className="text-center mb-20">
        <p className="text-[#2d6a4f] text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          What We Offer
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-[#111827]">
          The Full Spectrum<br />
          <em>of Service</em>
        </h2>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-3 gap-6">
        {WHY_CHOOSE_US.map((service) => (
          <div
            key={service.num}
            className="bg-[#f8faf9] border border-gray-100 rounded-xl p-8 group hover:border-[#2d6a4f]/30 hover:shadow-md transition-all duration-300"
          >
            {/* Icon */}
            <div className="w-12 h-12 rounded-lg bg-[#d8f3dc] flex items-center justify-center text-xl mb-5">
              {service.icon}
            </div>

            {/* Number */}
            <div className="text-[#2d6a4f] text-xs tracking-widest uppercase font-semibold mb-2">
              {service.num}
            </div>

            {/* Title */}
            <h3 className="font-display text-xl mb-3 text-[#111827] group-hover:text-[#2d6a4f] transition-colors duration-300">
              {service.title}
            </h3>

            {/* Description */}
            <p className="text-[#333333] text-sm leading-relaxed font-medium">{service.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
