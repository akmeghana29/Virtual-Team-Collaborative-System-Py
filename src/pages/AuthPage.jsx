import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import professionals from '../assets/images/professionals.jpg'

export default function AuthPage() {
  const [mode, setMode] = useState('signin')
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
  const navigate = useNavigate()

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const inputStyle = {
    width: '100%',
    padding: '14px 18px',
    backgroundColor: 'rgba(39,55,77,0.06)',
    border: '1px solid #D9CFC7',
    borderRadius: '4px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '13px',
    fontWeight: '300',
    color: '#27374D',
    outline: 'none',
    transition: 'border-color 0.2s ease',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: '400',
    color: '#526D82',
    letterSpacing: '0.08em',
    textTransform: 'uppercase',
    marginBottom: '8px',
    display: 'block',
  }

  const RecruiterBanner = () => (
    <motion.button
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      whileHover={{ backgroundColor: '#526D82', color: 'white' }}
      whileTap={{ scale: 0.97 }}
      onClick={() => navigate('/dashboard')}
      style={{
        alignSelf: 'flex-start',
        marginTop: '12px',
        marginBottom: '28px',
        padding: '9px 20px',
        backgroundColor: '#C9B59C',
        color: '#27374D',
        border: 'none',
        borderRadius: '999px',
        cursor: 'pointer',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '12px',
        fontWeight: '500',
        letterSpacing: '0.02em',
        transition: 'all 0.2s ease',
        whiteSpace: 'nowrap',
      }}
    >
      View Prototype (For Recruiters)
    </motion.button>
  )

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <div style={{ width: '55%', position: 'relative', flexShrink: 0 }}>
        <img
          src={professionals}
          alt=""
          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }}
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(39,55,77,0.72)' }} />
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          padding: '60px',
        }}>
          <div
            onClick={() => navigate('/')}
            style={{
              position: 'absolute',
              top: '40px',
              left: '60px',
              fontFamily: '"Bodoni Moda", Georgia, serif',
              fontSize: '22px',
              fontWeight: '400',
              color: 'white',
              letterSpacing: '0.06em',
              cursor: 'pointer',
            }}
          >
            Teams
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <p style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '11px',
              fontWeight: '400',
              color: '#C9B59C',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              marginBottom: '16px',
            }}>
              Virtual Team Collaborative Workspace
            </p>
            <h2 style={{
              fontFamily: '"Bodoni Moda", Georgia, serif',
              fontSize: 'clamp(28px, 3vw, 44px)',
              fontWeight: '400',
              color: 'white',
              lineHeight: '1.25',
              marginBottom: '20px',
            }}>
              Where teams come<br />together to build<br />something great.
            </h2>
            <p style={{
              fontFamily: 'Poppins, sans-serif',
              fontSize: '12px',
              fontWeight: '300',
              color: 'rgba(255,255,255,0.5)',
              lineHeight: '1.8',
              maxWidth: '360px',
            }}>
              Manage tasks, share resources, track deadlines and collaborate in real time from anywhere in the world.
            </p>
          </motion.div>
        </div>
      </div>

      <div style={{
        width: '45%',
        backgroundColor: '#F9F8F6',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        padding: '40px 64px',
        overflowY: 'auto',
      }}>
        <div style={{
          display: 'inline-flex',
          backgroundColor: '#EFE9E3',
          borderRadius: '999px',
          padding: '4px',
          marginBottom: '16px',
          marginTop: '60px',
          alignSelf: 'flex-start',
        }}>
          {['signin', 'signup'].map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                padding: '8px 28px',
                borderRadius: '999px',
                border: 'none',
                cursor: 'pointer',
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: '400',
                letterSpacing: '0.04em',
                transition: 'all 0.25s ease',
                backgroundColor: mode === m ? '#27374D' : 'transparent',
                color: mode === m ? 'white' : '#9AA6B2',
              }}
            >
              {m === 'signin' ? 'Sign In' : 'Sign Up'}
            </button>
          ))}
        </div>

        <RecruiterBanner />

        <AnimatePresence mode="wait">
          {mode === 'signin' ? (
            <motion.div
              key="signin"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <h1 style={{
                fontFamily: '"Bodoni Moda", Georgia, serif',
                fontSize: 'clamp(26px, 2.5vw, 36px)',
                fontWeight: '400',
                color: '#27374D',
                marginBottom: '8px',
                lineHeight: '1.2',
              }}>
                Welcome back
              </h1>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: '300',
                color: '#9AA6B2',
                marginBottom: '28px',
              }}>
                Sign in to continue to your workspace
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handle}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C9B59C'}
                    onBlur={e => e.target.style.borderColor = '#D9CFC7'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handle}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C9B59C'}
                    onBlur={e => e.target.style.borderColor = '#D9CFC7'}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '11px',
                    fontWeight: '300',
                    color: '#C9B59C',
                    letterSpacing: '0.04em',
                  }}>
                    Forgot password?
                  </button>
                </div>

                <motion.button
                  whileHover={{ backgroundColor: '#1a2535' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/real-dashboard')}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#27374D',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    fontWeight: '400',
                    letterSpacing: '0.06em',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Sign In
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#D9CFC7' }} />
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: '300', color: '#9AA6B2' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#D9CFC7' }} />
                </div>

                <motion.button
                  whileHover={{ borderColor: '#C9B59C' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '13px',
                    backgroundColor: 'white',
                    color: '#27374D',
                    border: '1px solid #D9CFC7',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    fontWeight: '300',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <img src="https://www.google.com/favicon.ico" alt="" style={{ width: '16px', height: '16px' }} />
                  Continue with Google
                </motion.button>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="signup"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
              <h1 style={{
                fontFamily: '"Bodoni Moda", Georgia, serif',
                fontSize: 'clamp(26px, 2.5vw, 36px)',
                fontWeight: '400',
                color: '#27374D',
                marginBottom: '8px',
                lineHeight: '1.2',
              }}>
                Create your account
              </h1>
              <p style={{
                fontFamily: 'Poppins, sans-serif',
                fontSize: '12px',
                fontWeight: '300',
                color: '#9AA6B2',
                marginBottom: '28px',
              }}>
                Join thousands of teams already collaborating
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <label style={labelStyle}>Full Name</label>
                  <input
                    name="name"
                    type="text"
                    placeholder="Your full name"
                    value={form.name}
                    onChange={handle}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C9B59C'}
                    onBlur={e => e.target.style.borderColor = '#D9CFC7'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Email</label>
                  <input
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handle}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C9B59C'}
                    onBlur={e => e.target.style.borderColor = '#D9CFC7'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Password</label>
                  <input
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={handle}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C9B59C'}
                    onBlur={e => e.target.style.borderColor = '#D9CFC7'}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Confirm Password</label>
                  <input
                    name="confirm"
                    type="password"
                    placeholder="••••••••"
                    value={form.confirm}
                    onChange={handle}
                    style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#C9B59C'}
                    onBlur={e => e.target.style.borderColor = '#D9CFC7'}
                  />
                </div>

                <motion.button
                  whileHover={{ backgroundColor: '#1a2535' }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => navigate('/real-dashboard')}
                  style={{
                    width: '100%',
                    padding: '14px',
                    backgroundColor: '#27374D',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    fontWeight: '400',
                    letterSpacing: '0.06em',
                    transition: 'background-color 0.2s ease',
                  }}
                >
                  Create Account
                </motion.button>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#D9CFC7' }} />
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: '300', color: '#9AA6B2' }}>or</span>
                  <div style={{ flex: 1, height: '1px', backgroundColor: '#D9CFC7' }} />
                </div>

                <motion.button
                  whileHover={{ borderColor: '#C9B59C' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    width: '100%',
                    padding: '13px',
                    backgroundColor: 'white',
                    color: '#27374D',
                    border: '1px solid #D9CFC7',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontFamily: 'Poppins, sans-serif',
                    fontSize: '13px',
                    fontWeight: '300',
                    letterSpacing: '0.04em',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    transition: 'border-color 0.2s ease',
                  }}
                >
                  <img src="https://www.google.com/favicon.ico" alt="" style={{ width: '16px', height: '16px' }} />
                  Continue with Google
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p style={{
          fontFamily: 'Poppins, sans-serif',
          fontSize: '11px',
          fontWeight: '300',
          color: '#9AA6B2',
          textAlign: 'center',
          marginTop: '32px',
          marginBottom: '40px',
        }}>
          By continuing, you agree to our{' '}
          <span style={{ color: '#C9B59C', cursor: 'pointer' }}>Terms of Service</span>
          {' '}and{' '}
          <span style={{ color: '#C9B59C', cursor: 'pointer' }}>Privacy Policy</span>
        </p>
      </div>
    </div>
  )
}