import { useState } from 'react'

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' })
  const [formSent, setFormSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setFormSent(true)
    setFormData({ name: '', email: '', message: '' })
    setTimeout(() => setFormSent(false), 3000)
  }

  return (
    <section id="contact" className="py-28 px-8 md:px-16 bg-white grid md:grid-cols-2 gap-16">
      {/* Contact Information */}
      <div>
        <p className="text-[#2d6a4f] text-xs tracking-[0.25em] uppercase mb-4 font-medium">
          Get in Touch
        </p>
        <h2 className="font-display text-4xl md:text-5xl mb-8 green-line text-[#111827]">
          Contact<br />
          <em>Us</em>
        </h2>
        <p className="text-[#333333] leading-relaxed mb-10 max-w-md font-medium">
          Ready to find your dream property? Our team is here to help with personalized service and expertise.
        </p>

        {/* Contact Details */}
        <div className="space-y-6">
          {[
            { label: 'Phone', value: '+254 795308101', icon: '📞' },
            { label: 'Email', value: 'inquiries@arsarealestate.com', icon: '📧' },
            { label: 'New York', value: '740 Park Avenue, Suite 12A', icon: '📍' },
            { label: 'Los Angeles', value: '9200 Wilshire Blvd, Penthouse', icon: '📍' },
          ].map((contact, i) => (
            <div key={i} className="flex gap-4 items-start">
              <span className="text-2xl">{contact.icon}</span>
              <div>
                <div className="text-[#2d6a4f] text-xs tracking-widest uppercase font-semibold">
                  {contact.label}
                </div>
                <div className="text-[#333333] font-medium mt-1">{contact.value}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Social Links */}
        <div className="mt-10">
          <p className="text-[#111827] text-xs tracking-widest uppercase font-semibold mb-4">
            Follow Us
          </p>
          <div className="flex gap-4">
            {['Facebook', 'Instagram', 'LinkedIn', 'Twitter'].map((social) => (
              <a
                key={social}
                href="#"
                className="w-10 h-10 rounded-full bg-[#f8faf9] flex items-center justify-center text-[#2d6a4f] hover:bg-[#2d6a4f] hover:text-white transition-colors"
                title={social}
              >
                {social[0]}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Contact Form */}
      <div>
        {formSent ? (
          <div className="h-full flex flex-col items-center justify-center text-center py-16 bg-[#f8faf9] rounded-xl">
            <div className="w-16 h-16 rounded-full bg-[#d8f3dc] flex items-center justify-center mb-5 mx-auto">
              <svg
                width="28"
                height="28"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#2d6a4f"
                strokeWidth="2"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-display text-2xl mb-3 text-[#111827]">Message Received</h3>
            <p className="text-[#333333] text-sm max-w-xs font-medium">
              Thank you! Our team will contact you within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Field */}
            <div>
              <label className="block text-[#333333] text-xs tracking-widest uppercase mb-2 font-medium">
                Full Name
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-white border border-gray-200 text-[#111827] px-4 py-3 text-sm rounded focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]/20 transition-colors placeholder-gray-300"
                placeholder="Your name"
              />
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-[#333333] text-xs tracking-widest uppercase mb-2 font-medium">
                Email Address
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white border border-gray-200 text-[#111827] px-4 py-3 text-sm rounded focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]/20 transition-colors placeholder-gray-300"
                placeholder="your@email.com"
              />
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-[#333333] text-xs tracking-widest uppercase mb-2 font-medium">
                Message
              </label>
              <textarea
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                className="w-full bg-white border border-gray-200 text-[#111827] px-4 py-3 text-sm rounded focus:outline-none focus:border-[#2d6a4f] focus:ring-1 focus:ring-[#2d6a4f]/20 transition-colors resize-none placeholder-gray-300"
                placeholder="Tell us about your property needs..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#2d6a4f] text-white text-xs tracking-[0.2em] uppercase font-semibold py-4 rounded hover:bg-[#1b4332] transition-colors duration-300"
            >
              Send Message
            </button>

            {/* Privacy Notice */}
            <p className="text-[#333333] text-xs text-center tracking-wider font-medium">
              All inquiries treated with strict confidence
            </p>
          </form>
        )}
      </div>
    </section>
  )
}
