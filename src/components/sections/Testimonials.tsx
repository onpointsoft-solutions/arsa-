import { testimonials } from '../data/testimonials'

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-28 px-8 md:px-16 bg-[#f8faf9]">
      {/* Section Header */}
      <div className="text-center mb-20">
        <p className="text-[#2d6a4f] text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          Client Stories
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-[#111827]">
          Voices of<br />
          <em>Our Clients</em>
        </h2>
      </div>

      {/* Testimonials Grid */}
      <div className="grid md:grid-cols-3 gap-8">
        {testimonials.map((t, i) => (
          <div
            key={i}
            className="bg-white border border-gray-100 rounded-xl p-8 shadow-sm hover:shadow-md transition-shadow duration-300"
          >
            {/* Quote Mark */}
            <div className="text-[#2d6a4f] text-4xl font-display mb-5 leading-none">"</div>

            {/* Quote Text */}
            <p className="text-[#333333] leading-relaxed text-sm mb-8 italic font-display font-medium">
              {t.quote}
            </p>

            {/* Client Info */}
            <div className="flex items-center gap-4 border-t border-gray-100 pt-6">
              <img
                src={t.avatar}
                alt={t.name}
                className="w-11 h-11 rounded-full object-cover"
              />
              <div>
                <div className="text-sm font-semibold text-[#111827]">{t.name}</div>
                <div className="text-xs text-[#2d6a4f] mt-0.5">{t.title}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
