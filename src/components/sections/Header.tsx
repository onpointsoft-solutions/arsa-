import { useState } from 'react'
import { NAVIGATION_MENU } from '../data/constants'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      {/* ── NAV ── */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-8 md:px-16 h-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
        {/* Logo */}
        <a href="#" className="font-display text-xl tracking-widest text-[#111827] font-bold">
          ARSA<span className="text-[#2d6a4f]">·</span>REALESTATE
        </a>

        {/* Desktop Navigation Menu */}
        <div className="hidden md:flex items-center gap-10">
          {NAVIGATION_MENU.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="nav-link text-[#111827] hover:text-[#2d6a4f] transition-colors font-semibold text-sm"
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Search & Auth - Desktop */}
        <div className="hidden md:flex items-center gap-4">
          <button className="p-2 text-[#111827] hover:text-[#2d6a4f] transition-colors" title="Search">
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="9" r="7" />
              <path d="m14 14 3 3" />
            </svg>
          </button>
          <a
            href="#signin"
            className="text-[#111827] hover:text-[#2d6a4f] transition-colors font-semibold text-sm"
          >
            Sign In
          </a>
          <a
            href="#register"
            className="bg-[#2d6a4f] text-white text-xs tracking-widest uppercase font-semibold px-5 py-2.5 rounded hover:bg-[#1b4332] transition-colors duration-300"
          >
            Register
          </a>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden text-[#111827] p-1"
          onClick={() => setMenuOpen(!menuOpen)}
          title="Toggle menu"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5">
            {menuOpen ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="4" y1="7" x2="20" y2="7" />
                <line x1="4" y1="12" x2="20" y2="12" />
                <line x1="4" y1="17" x2="20" y2="17" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 mt-20 pt-8">
          {NAVIGATION_MENU.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="font-display text-3xl text-[#111827] hover:text-[#2d6a4f] transition-colors font-bold"
              onClick={() => setMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
          <div className="flex flex-col gap-4 mt-8 w-full px-8">
            <a
              href="#signin"
              className="text-center text-[#111827] hover:text-[#2d6a4f] transition-colors font-semibold py-3 border border-[#2d6a4f] rounded"
            >
              Sign In
            </a>
            <a
              href="#register"
              className="text-center bg-[#2d6a4f] text-white font-semibold py-3 rounded hover:bg-[#1b4332] transition-colors"
            >
              Register
            </a>
          </div>
        </div>
      )}
    </>
  )
}
