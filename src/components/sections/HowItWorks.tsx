import { HOW_IT_WORKS } from '../data/constants'

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-8 md:px-16 bg-[#f8faf9]">
      {/* Section Header */}
      <div className="text-center mb-20">
        <p className="text-[#2d6a4f] text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          Our Process
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-[#111827]">
          How It<br />
          <em>Works</em>
        </h2>
      </div>

      {/* Process Steps */}
      <div className="grid md:grid-cols-4 gap-6">
        {HOW_IT_WORKS.map((step, index) => (
          <div key={step.num} className="relative">
            {/* Step Card */}
            <div className="bg-white border border-gray-100 rounded-xl p-8 text-center h-full">
              {/* Icon */}
              <div className="w-16 h-16 rounded-full bg-[#d8f3dc] flex items-center justify-center text-2xl mx-auto mb-4">
                {step.icon}
              </div>

              {/* Step Number */}
              <div className="text-[#2d6a4f] text-2xl font-display font-bold mb-2">{step.num}</div>

              {/* Title */}
              <h3 className="font-display text-lg text-[#111827] mb-3">{step.title}</h3>

              {/* Description */}
              <p className="text-[#333333] text-sm leading-relaxed font-medium">{step.body}</p>
            </div>

            {/* Arrow Connector (Hidden on mobile and last item) */}
            {index < HOW_IT_WORKS.length - 1 && (
              <div className="hidden md:block absolute -right-6 top-1/2 transform -translate-y-1/2 text-2xl text-[#2d6a4f]">
                →
              </div>
            )}
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="text-center mt-12">
        <a
          href="#contact"
          className="inline-block bg-[#2d6a4f] text-white text-xs tracking-widest uppercase font-semibold px-8 py-3 rounded hover:bg-[#1b4332] transition-colors duration-300"
        >
          Get Started Today
        </a>
      </div>
    </section>
  )
}
