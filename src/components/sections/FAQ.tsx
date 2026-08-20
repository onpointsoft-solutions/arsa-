import { useState } from 'react'
import { FAQ_ITEMS } from '../data/constants'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  return (
    <section id="faq" className="py-28 px-8 md:px-16 bg-[#f8faf9]">
      {/* Section Header */}
      <div className="text-center mb-20">
        <p className="text-[#2d6a4f] text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          Help & Support
        </p>
        <h2 className="font-display text-4xl md:text-5xl text-[#111827]">
          Frequently<br />
          <em>Asked Questions</em>
        </h2>
      </div>

      {/* FAQ Accordion */}
      <div className="max-w-2xl mx-auto space-y-4">
        {FAQ_ITEMS.map((item, index) => (
          <div
            key={index}
            className="bg-white border border-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
          >
            {/* FAQ Item Header */}
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-[#f8faf9] transition-colors"
            >
              <h3 className="font-semibold text-[#111827] pr-4">{item.q}</h3>
              <span
                className={`flex-shrink-0 text-[#2d6a4f] transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180' : ''
                }`}
              >
                ▼
              </span>
            </button>

            {/* FAQ Item Content */}
            {openIndex === index && (
              <div className="px-6 py-4 border-t border-gray-100 bg-white">
                <p className="text-[#333333] leading-relaxed font-medium">{item.a}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Still Have Questions */}
      <div className="text-center mt-12">
        <p className="text-[#111827] text-lg font-semibold mb-4">Still have questions?</p>
        <a
          href="#contact"
          className="inline-block bg-[#2d6a4f] text-white text-xs tracking-widest uppercase font-semibold px-8 py-3 rounded hover:bg-[#1b4332] transition-colors duration-300"
        >
          Contact Us
        </a>
      </div>
    </section>
  )
}
