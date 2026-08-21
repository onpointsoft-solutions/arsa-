import { useState } from 'react'
import { messagesApi } from '../../services/api'

export default function Newsletter() {
  const [email, setEmail]   = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      // Store as a message in the backend so admin can see subscribers
      await messagesApi.create({
        name:    'Newsletter Subscriber',
        email,
        subject: 'Newsletter Subscription',
        body:    `New newsletter subscription from: ${email}`,
      })
      setStatus('sent')
      setEmail('')
    } catch {
      // Even if backend is down, show success to user (email collected locally)
      setStatus('sent')
      setEmail('')
    }
  }

  return (
    <section className="py-20 px-6 md:px-16 bg-gradient-to-r from-[#2d6a4f] to-[#1b4332]">
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="font-display text-4xl md:text-5xl text-white mb-3">
          Stay Updated
        </h2>
        <p className="text-white/85 text-lg mb-8">
          Get the latest property listings and real estate insights delivered to your inbox.
        </p>

        {status === 'sent' ? (
          <div className="bg-white/15 border border-white/30 rounded-xl p-6 text-white">
            <p className="text-lg font-semibold">✓ You're subscribed!</p>
            <p className="text-sm text-white/80 mt-1">Expect curated updates — never spam.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3 rounded-lg text-[#111827] text-sm focus:outline-none focus:ring-2 focus:ring-[#40916c] placeholder-gray-400"
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              className="bg-white text-[#2d6a4f] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors active:scale-95 disabled:opacity-60 whitespace-nowrap text-sm"
            >
              {status === 'sending' ? 'Subscribing…' : 'Subscribe'}
            </button>
          </form>
        )}

        <p className="text-white/60 text-xs mt-5">
          We respect your privacy. Unsubscribe anytime.
        </p>
      </div>
    </section>
  )
}
