import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { HiMenu, HiX } from 'react-icons/hi'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [hovered, setHovered] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#howitworks' },
    { label: 'For Teams', href: '#audience' },
    { label: 'FAQ', href: '#faq' },
  ]

  const handleScroll = (href) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.4s ease, backdrop-filter 0.4s ease, border-color 0.4s ease',
        background: scrolled ? 'rgba(0,0,0,0.35)' : 'transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255,255,255,0.08)' : '1px solid transparent',
      }}
    >
      <div style={{
        maxWidth: '1280px',
        margin: '0 auto',
        padding: '20px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{
          fontFamily: '"Bodoni Moda", Georgia, serif',
          fontSize: '24px',
          fontWeight: '400',
          color: 'white',
          letterSpacing: '0.06em',
          cursor: 'pointer',
        }}>
          Teams.
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '36px',
        }}>
          {navLinks.map((link) => (
            <button
              key={link.label}
              onClick={() => handleScroll(link.href)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '300',
                fontFamily: 'Poppins, sans-serif',
                color: 'rgba(255,255,255,0.65)',
                letterSpacing: '0.04em',
                transition: 'color 0.25s ease',
              }}
              onMouseEnter={e => e.target.style.color = 'white'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
            >
              {link.label}
            </button>
          ))}

          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '300',
              fontFamily: 'Poppins, sans-serif',
              color: 'rgba(255,255,255,0.65)',
              letterSpacing: '0.04em',
              transition: 'color 0.25s ease',
            }}
            onMouseEnter={e => e.target.style.color = 'white'}
            onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.65)'}
          >
            View Prototype
          </button>

          <motion.button
            onClick={() => navigate('/auth')}
            onHoverStart={() => setHovered(true)}
            onHoverEnd={() => setHovered(false)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.97 }}
            animate={{
              backgroundColor: hovered ? '#27374D' : '#C9B59C',
              color: hovered ? '#C9B59C' : '#27374D',
            }}
            transition={{ duration: 0.3 }}
            style={{
              border: 'none',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500',
              fontFamily: 'Poppins, sans-serif',
              padding: '11px 28px',
              borderRadius: '999px',
              letterSpacing: '0.03em',
            }}
          >
            Get Started
          </motion.button>
        </div>

        <button
          className="md:hidden"
          onClick={() => setMenuOpen(p => !p)}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          {menuOpen
            ? <HiX size={22} style={{ color: 'white' }} />
            : <HiMenu size={22} style={{ color: 'white' }} />
          }
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              background: 'rgba(0,0,0,0.75)',
              backdropFilter: 'blur(14px)',
              padding: '24px 40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {navLinks.map((link) => (
              <button
                key={link.label}
                onClick={() => handleScroll(link.href)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '300',
                  fontFamily: 'Poppins, sans-serif',
                  color: 'rgba(255,255,255,0.65)',
                  textAlign: 'left',
                  letterSpacing: '0.04em',
                }}
              >
                {link.label}
              </button>
            ))}
            <div style={{ display: 'flex', gap: '16px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '300',
                  fontFamily: 'Poppins, sans-serif',
                  color: 'rgba(255,255,255,0.65)',
                }}
              >
                View Prototype
              </button>
              <motion.button
                onClick={() => navigate('/auth')}
                whileHover={{ scale: 1.05, backgroundColor: '#27374D', color: '#C9B59C' }}
                whileTap={{ scale: 0.97 }}
                style={{
                  backgroundColor: '#C9B59C',
                  color: '#27374D',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '500',
                  fontFamily: 'Poppins, sans-serif',
                  padding: '11px 28px',
                  borderRadius: '999px',
                }}
              >
                Get Started
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}