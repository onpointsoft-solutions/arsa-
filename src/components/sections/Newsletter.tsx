import { useState } from 'react'

export default function Newsletter() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section className="py-20 px-8 md:px-16 bg-gradient-to-r from-[#2d6a4f] to-[#1b4332]">
      <div className="max-w-2xl mx-auto text-center">
        {/* Header */}
        <h2 className="font-display text-4xl md:text-5xl text-white mb-4">
          Stay Updated
        </h2>
        <p className="text-white/90 text-lg mb-8">
          Get the latest property listings and real estate insights delivered to your inbox.
        </p>

        {/* Newsletter Form */}
        {!submitted ? (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="flex-1 px-6 py-3 rounded-lg text-[#111827] focus:outline-none focus:ring-2 focus:ring-[#40916c]"
            />
            <button
              type="submit"
              className="bg-white text-[#2d6a4f] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Subscribe
            </button>
          </form>
        ) : (
          <div className="bg-white/10 border border-white/30 rounded-lg p-6 text-white">
            <p className="font-semibold">✓ Thanks for subscribing!</p>
            <p className="text-sm text-white/80 mt-1">Check your email for exclusive offers.</p>
          </div>
        )}

        {/* Privacy Notice */}
        <p className="text-white/70 text-xs mt-6">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
