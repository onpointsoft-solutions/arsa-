import { FOOTER_LINKS, SOCIAL_MEDIA } from '../data/constants'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-[#111827] text-white">
      {/* Main Footer */}
      <div className="px-8 md:px-16 py-20">
        <div className="grid md:grid-cols-5 gap-12 mb-16">
          {/* Brand */}
          <div>
            <div className="font-display text-2xl tracking-widest mb-4">
              ARSA<span className="text-[#2d6a4f]">·</span>REALESTATE
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your trusted partner in luxury real estate solutions.
            </p>
          </div>

          {/* Quick Links - Company */}
          <div>
            <h4 className="font-semibold text-[#40916c] mb-4 text-sm tracking-widest uppercase">
              Company
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/70 text-sm hover:text-[#40916c] transition-colors font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Support */}
          <div>
            <h4 className="font-semibold text-[#40916c] mb-4 text-sm tracking-widest uppercase">
              Support
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.support.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/70 text-sm hover:text-[#40916c] transition-colors font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links - Legal */}
          <div>
            <h4 className="font-semibold text-[#40916c] mb-4 text-sm tracking-widest uppercase">
              Legal
            </h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.legal.map((link, i) => (
                <li key={i}>
                  <a
                    href={link.href}
                    className="text-white/70 text-sm hover:text-[#40916c] transition-colors font-medium"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter CTA */}
          <div>
            <h4 className="font-semibold text-[#40916c] mb-4 text-sm tracking-widest uppercase">
              Newsletter
            </h4>
            <p className="text-white/70 text-sm mb-4">
              Subscribe for exclusive updates and offers.
            </p>
            <input
              type="email"
              placeholder="Your email"
              className="w-full px-3 py-2 rounded bg-white/10 border border-white/20 text-white text-sm placeholder-white/50 focus:outline-none focus:border-[#40916c]"
            />
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Bottom Footer */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Copyright */}
          <p className="text-white/70 text-sm font-medium">
            © {currentYear} ARSA REALESTATE. All rights reserved.
          </p>

          {/* Social Media */}
          <div className="flex gap-4">
            {SOCIAL_MEDIA.map((social, i) => (
              <a
                key={i}
                href={social.url}
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-[#2d6a4f] transition-colors font-medium"
                title={social.name}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
