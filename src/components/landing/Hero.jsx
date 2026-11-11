import { useRef, useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MdGroup, MdAutorenew, MdSmartToy, MdFolderShared, MdAccessTime, MdAdd, MdRemove } from 'react-icons/md'
import { useNavigate } from 'react-router-dom'
import heroBg from '../../assets/images/hero-bg.jpg'
import about1 from '../../assets/images/about-1.jpg'
import about2 from '../../assets/images/about-2.jpg'
import heroBg3 from '../../assets/images/hero-bg3.jpg'
import remote from '../../assets/images/remote.jpg'
import students from '../../assets/images/students.jpg'
import Lottie from 'lottie-react'
import aiAssistant from '../../assets/lotties/ai-assistant.json'
import collaboration from '../../assets/lotties/collaboration.json'
import taskComplete from '../../assets/lotties/task-complete.json'

const HOW_IT_WORKS_CARD_HEIGHT = 400
const STUDENTS_BG_START_FRACTION = 1.0
const STUDENTS_BG_OVERLAY_OPACITY = 0.40
const STUDENTS_BG_OFFSET = HOW_IT_WORKS_CARD_HEIGHT * STUDENTS_BG_START_FRACTION

const fadeUp = { hidden: { opacity: 0, y: 40 }, show: { opacity: 1, y: 0 } }
const fadeDown = { hidden: { opacity: 0, y: -40 }, show: { opacity: 1, y: 0 } }
const fadeLeft = { hidden: { opacity: 0, x: -50 }, show: { opacity: 1, x: 0 } }
const fadeRight = { hidden: { opacity: 0, x: 50 }, show: { opacity: 1, x: 0 } }
const scaleIn = { hidden: { opacity: 0, scale: 0.85 }, show: { opacity: 1, scale: 1 } }
const flipIn = { hidden: { opacity: 0, rotateX: 30, y: 30 }, show: { opacity: 1, rotateX: 0, y: 0 } }

const vp = { once: false, amount: 0.2 }
const vpHalf = { once: false, amount: 0.4 }

function useWindowWidth() {
  const [width, setWidth] = useState(window.innerWidth)
  useEffect(() => {
    const fn = () => setWidth(window.innerWidth)
    window.addEventListener('resize', fn)
    return () => window.removeEventListener('resize', fn)
  }, [])
  return width
}

export default function Hero() {
  const parallaxRef = useRef(null)
  const [openFaq, setOpenFaq] = useState(null)
  const [protoHover, setProtoHover] = useState(false)
  const navigate = useNavigate()

  const width = useWindowWidth()
  const isMobile = width < 768
  const isTablet = width < 1024

  useEffect(() => {
    const handleScroll = () => {
      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translateY(${window.scrollY * 0.35}px)`
      }
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const features = [
    { label: 'Team Rooms', icon: <MdGroup size={18} color="#C9B59C" /> },
    { label: 'Dynamic Scheduling', icon: <MdAutorenew size={18} color="#C9B59C" /> },
    { label: 'AI Assistant', icon: <MdSmartToy size={18} color="#C9B59C" /> },
    { label: 'Resource Sharing', icon: <MdFolderShared size={18} color="#C9B59C" /> },
    { label: 'Deadline Tracking', icon: <MdAccessTime size={18} color="#C9B59C" /> },
  ]

  const lottieFeatures = [
    {
      lottie: aiAssistant,
      heading: 'AI-Powered Assistance',
      subtext: "Get instant answers, summaries, and smart suggestions from your team's personal assistant, always on.",
    },
    {
      lottie: collaboration,
      heading: 'Seamless Collaboration',
      subtext: 'Work together in real time, share updates, and stay aligned no matter where your team is in the world.',
    },
    {
      lottie: taskComplete,
      heading: 'Efficient Task Management',
      subtext: 'Assign, track, and complete tasks with clarity. Hit every deadline and keep your sprint on track.',
    },
  ]

  const howItWorksPoints = [
    { num: '01', text: 'Create a virtual team room, invite teammates, and collaborate remotely from anywhere in the world.' },
    { num: '02', text: "Track every member's tasks individually - see who's ahead, who needs help, and what's due next." },
    { num: '03', text: 'Post daily progress, share files and resources, and ask questions about the files directly using RAG model' },
    { num: '04', text: 'Visualise all deadlines on a shared team calendar and never miss a milestone again.' },
    { num: '05', text: 'When a task is completed or missed, the schedule auto-updates dynamically keeping the sprint always on track.' },
  ]

  const faqs = [
    {
      q: 'How do I create a team and invite members?',
      a: "Simply sign up, create a new workspace, and share your invite link or enter team members' email addresses. They'll get an invite to join your virtual room instantly.",
    },
    {
      q: 'How does the AI assistant work with our documents?',
      a: "Our AI uses a RAG (Retrieval-Augmented Generation) model, it reads your uploaded files and resources, then lets you ask questions and get accurate, context-aware answers directly from your team's documents.",
    },
    {
      q: 'What happens when someone misses a deadline?',
      a: "The platform detects the missed deadline and automatically reschedules dependent tasks across the sprint, keeping your team's timeline updated without any manual effort.",
    },
    {
      q: 'Can I track individual member progress?',
      a: "Yes, each member has a dedicated task view showing completed, in-progress, and upcoming tasks. Team leads get a full overview of everyone's progress from the dashboard.",
    },
  ]

  return (
    <>
      <section style={{ height: '75vh', position: 'relative', overflow: 'hidden', flexShrink: 0 }}>
        <div ref={parallaxRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'scale(1.1)' }}>
          <img src={heroBg} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center 70%' }} />
          <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' }} />
        </div>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end', textAlign: 'center', padding: isMobile ? '0 16px 18% 16px' : '0 24px 12% 24px' }}>
          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: 'clamp(24px, 5.5vw, 62px)', fontWeight: '400', color: 'white', letterSpacing: '0.04em', lineHeight: '1.15', marginBottom: '20px' }}
          >
            Virtual Team<br />
            <span style={{ color: '#C9B59C' }}>Collaborative</span>{' '}Workspace
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ fontFamily: 'Poppins, sans-serif', fontSize: 'clamp(11px, 1.4vw, 17px)', fontWeight: '300', color: 'rgba(255,255,255,0.6)', letterSpacing: '0.12em', textTransform: 'uppercase' }}
          >
            Your Team.{' '}<span style={{ color: '#C9B59C', opacity: 0.85 }}>One Room.</span>{' '}Zero Distance.
          </motion.p>
        </div>
      </section>

      <div style={{ backgroundColor: 'white' }}>

        <div id="features" style={{ display: 'flex', justifyContent: 'center' }}>
          <motion.div
            variants={scaleIn}
            initial="hidden"
            whileInView="show"
            viewport={vp}
            transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ width: isMobile ? '95%' : '80%', maxWidth: '1000px', marginTop: isMobile ? '-30px' : '-60px', boxShadow: '0 20px 60px rgba(0,0,0,0.13)', overflow: 'hidden', position: 'relative', zIndex: 10 }}
          >
            <div style={{ display: 'flex', backgroundColor: 'white', borderBottom: '1px solid #EFE9E3', flexWrap: isMobile ? 'wrap' : 'nowrap' }}>
              {features.map((f, i, arr) => (
                <motion.div
                  key={i}
                  variants={fadeDown}
                  initial="hidden"
                  whileInView="show"
                  viewport={vp}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{
                    flex: isMobile ? '1 1 50%' : 1,
                    padding: isMobile ? '14px 8px' : '18px 0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    borderRight: isMobile ? (i % 2 === 0 ? '1px solid #EFE9E3' : 'none') : (i < arr.length - 1 ? '1px solid #EFE9E3' : 'none'),
                    borderBottom: isMobile ? '1px solid #EFE9E3' : 'none',
                    cursor: 'default',
                  }}
                >
                  {f.icon}
                  <span style={{ fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '10px' : '12px', fontWeight: '500', color: '#27374D', letterSpacing: '0.03em' }}>{f.label}</span>
                </motion.div>
              ))}
            </div>
            <div style={{ display: 'flex', height: isMobile ? 'auto' : '320px', flexDirection: isMobile ? 'column' : 'row' }}>
              <motion.div
                variants={fadeLeft}
                initial="hidden"
                whileInView="show"
                viewport={vp}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ width: isMobile ? '100%' : '50%', height: isMobile ? '200px' : '100%', position: 'relative' }}
              >
                <img src={about2} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
              </motion.div>
              <motion.div
                variants={fadeRight}
                initial="hidden"
                whileInView="show"
                viewport={vp}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ width: isMobile ? '100%' : '50%', position: 'relative', minHeight: isMobile ? '220px' : 'auto' }}
              >
                <img src={about1} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(239,233,227,0.93)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '24px 20px' : '36px 44px' }}>
                  <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} transition={{ duration: 0.5, delay: 0.2 }} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: '500', color: '#C9B59C', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>What We Do</motion.p>
                  <motion.h2 variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} transition={{ duration: 0.5, delay: 0.3 }} style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: 'clamp(16px, 2vw, 26px)', fontWeight: '400', color: '#27374D', lineHeight: '1.4', marginBottom: '14px' }}>
                    One place for every team, every project, every deadline.
                  </motion.h2>
                  <motion.p variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} transition={{ duration: 0.5, delay: 0.4 }} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: '300', color: '#526D82', lineHeight: '1.9' }}>
                    From assigning tasks to tracking deadlines, bringing your entire team together, no matter where they are.
                  </motion.p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>

        <div id="for-teams" style={{ padding: isMobile ? '60px 16px 70px 16px' : isTablet ? '70px 24px 80px 24px' : '90px 24px 100px 24px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={vpHalf}
            transition={{ duration: 0.7, ease: [0.25, 0.1, 0.25, 1] }}
            style={{ textAlign: 'center', marginBottom: '64px' }}
          >
            <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: '500', color: '#C9B59C', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '14px' }}>What's Inside</p>
            <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: 'clamp(22px, 3vw, 40px)', fontWeight: '400', color: '#27374D', lineHeight: '1.25', margin: 0 }}>
              Everything your team needs,<br />in one workspace.
            </h2>
          </motion.div>
          <div style={{ display: 'flex', gap: isMobile ? '40px' : '48px', justifyContent: 'center', alignItems: 'flex-start', flexWrap: 'wrap', maxWidth: '880px', width: '100%' }}>
            {lottieFeatures.map((item, i) => (
              <motion.div key={i}
                variants={i % 2 === 0 ? fadeUp : scaleIn}
                initial="hidden"
                whileInView="show"
                viewport={vp}
                transition={{ duration: 0.6, delay: i * 0.15, ease: [0.25, 0.1, 0.25, 1] }}
                style={{ flex: isMobile ? '1 1 100%' : '1 1 220px', maxWidth: isMobile ? '100%' : '250px', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}
              >
                <motion.div
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={vp}
                  transition={{ duration: 0.5, delay: i * 0.15 + 0.1 }}
                  style={{ width: '155px', height: '155px', borderRadius: '50%', backgroundColor: '#F4F0EC', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '26px', boxShadow: '0 8px 28px rgba(39,55,77,0.07)' }}
                >
                  <Lottie animationData={item.lottie} loop style={{ width: '105px', height: '105px' }} />
                </motion.div>
                <h3 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '19px', fontWeight: '400', color: '#27374D', marginBottom: '10px', lineHeight: '1.3' }}>{item.heading}</h3>
                <div style={{ width: '32px', height: '1px', backgroundColor: '#C9B59C', marginBottom: '12px' }} />
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: '300', color: '#526D82', lineHeight: '1.9' }}>{item.subtext}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          id="how-it-works"
          variants={scaleIn}
          initial="hidden"
          whileInView="show"
          viewport={vp}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{ display: 'flex', justifyContent: 'center' }}
        >
          <div style={{ width: isMobile ? '95%' : '80%', maxWidth: '1000px' }}>
            <div style={{ backgroundColor: '#27374D', padding: isMobile ? '20px 24px' : '26px 44px', textAlign: 'center' }}>
              <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: 'clamp(16px, 2vw, 26px)', fontWeight: '400', color: 'white', margin: 0, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                How It Works
              </h2>
            </div>
          </div>
        </motion.div>

        <div style={{ height: isMobile ? '0px' : `${STUDENTS_BG_OFFSET}px` }} />

      </div>

      <div style={{ position: 'relative' }}>

        <img
          src={students}
          alt=""
          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center', zIndex: 0 }}
        />

        <div style={{ position: 'absolute', inset: 0, backgroundColor: `rgba(15, 25, 40, ${STUDENTS_BG_OVERLAY_OPACITY})`, zIndex: 1 }} />

        <div style={{ position: 'relative', zIndex: 2 }}>

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: isMobile ? '0' : `-${STUDENTS_BG_OFFSET}px` }}>
            <motion.div
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={vp}
              transition={{ duration: 0.9, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ width: isMobile ? '95%' : '80%', maxWidth: '1000px', boxShadow: '0 20px 60px rgba(0,0,0,0.3)', overflow: 'hidden' }}
            >
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', minHeight: isMobile ? 'auto' : `${HOW_IT_WORKS_CARD_HEIGHT}px` }}>
                <motion.div
                  variants={fadeLeft}
                  initial="hidden"
                  whileInView="show"
                  viewport={vp}
                  transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                  style={{ width: isMobile ? '100%' : '50%', position: 'relative', minHeight: isMobile ? 'auto' : '100%' }}
                >
                  <img src={remote} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', position: isMobile ? 'relative' : 'absolute', top: 0, left: 0 }} />
                  <div style={{ position: isMobile ? 'relative' : 'absolute', inset: isMobile ? 'auto' : 0, backgroundColor: 'rgba(239,233,227,0.94)', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: isMobile ? '28px 20px' : '40px 44px' }}>
                    {howItWorksPoints.map((point, i) => (
                      <motion.div
                        key={i}
                        variants={fadeLeft}
                        initial="hidden"
                        whileInView="show"
                        viewport={vp}
                        transition={{ duration: 0.5, delay: i * 0.1, ease: [0.25, 0.1, 0.25, 1] }}
                        style={{ display: 'flex', gap: '16px', marginBottom: i < howItWorksPoints.length - 1 ? '18px' : '0' }}
                      >
                        <span style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '15px', fontWeight: '400', color: '#526D82', flexShrink: 0, marginTop: '2px', letterSpacing: '0.04em' }}>{point.num}</span>
                        <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: isMobile ? '12px' : '13px', fontWeight: '300', color: '#27374D', lineHeight: '1.75', margin: 0 }}>{point.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
                {!isMobile && (
                  <motion.div
                    variants={fadeRight}
                    initial="hidden"
                    whileInView="show"
                    viewport={vp}
                    transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                    style={{ width: '50%', position: 'relative' }}
                  >
                    <img src={heroBg3} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center' }} />
                  </motion.div>
                )}
              </div>
            </motion.div>
          </div>

          <div style={{ height: isMobile ? '50px' : '80px' }} />

          <div id="faq" style={{ display: 'flex', justifyContent: 'center', paddingLeft: isMobile ? '16px' : '24px', paddingRight: isMobile ? '16px' : '24px' }}>
            <motion.div
              variants={flipIn}
              initial="hidden"
              whileInView="show"
              viewport={vp}
              transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
              style={{ width: '100%', maxWidth: '780px', backgroundColor: 'white', borderRadius: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.35)', overflow: 'hidden' }}
            >
              <motion.div
                variants={fadeDown}
                initial="hidden"
                whileInView="show"
                viewport={vp}
                transition={{ duration: 0.6 }}
                style={{ backgroundColor: '#27374D', padding: isMobile ? '28px 24px' : '36px 48px 32px 48px', position: 'relative', overflow: 'hidden' }}
              >
                <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', borderRadius: '50%', backgroundColor: 'rgba(201,181,156,0.08)', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: '-20px', right: '80px', width: '90px', height: '90px', borderRadius: '50%', backgroundColor: 'rgba(201,181,156,0.06)', pointerEvents: 'none' }} />
                <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: '500', color: '#C9B59C', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: '10px' }}>Got Questions?</p>
                <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: 'clamp(20px, 2.5vw, 32px)', fontWeight: '400', color: 'white', margin: 0, lineHeight: '1.2' }}>Frequently Asked Questions</h2>
              </motion.div>
              <div style={{ padding: '8px 0' }}>
                {faqs.map((faq, i) => (
                  <motion.div
                    key={i}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="show"
                    viewport={vp}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    style={{ borderBottom: i < faqs.length - 1 ? '1px solid #EFE9E3' : 'none' }}
                  >
                    <button
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      style={{ width: '100%', background: 'none', border: 'none', padding: isMobile ? '18px 20px' : '24px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', gap: '16px', textAlign: 'left' }}
                    >
                      <span style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: 'clamp(13px, 1.4vw, 18px)', fontWeight: '400', color: '#27374D', lineHeight: '1.35' }}>{faq.q}</span>
                      <div style={{ width: '32px', height: '32px', borderRadius: '50%', flexShrink: 0, backgroundColor: openFaq === i ? '#27374D' : '#EFE9E3', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 0.25s ease' }}>
                        {openFaq === i ? <MdRemove size={16} color="white" /> : <MdAdd size={16} color="#526D82" />}
                      </div>
                    </button>
                    <AnimatePresence initial={false}>
                      {openFaq === i && (
                        <motion.div key="answer" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: 'easeInOut' }} style={{ overflow: 'hidden' }}>
                          <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: '300', color: '#526D82', lineHeight: '1.85', padding: isMobile ? '0 20px 20px 20px' : '0 48px 24px 48px', margin: 0 }}>{faq.a}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          <div id="view-prototype" style={{ display: 'flex', justifyContent: 'center', padding: isMobile ? '40px 16px 70px 16px' : '60px 24px 100px 24px' }}>
            <motion.button
              variants={scaleIn}
              initial="hidden"
              whileInView="show"
              viewport={vp}
              transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
              onMouseEnter={() => setProtoHover(true)}
              onMouseLeave={() => setProtoHover(false)}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/dashboard')}
              style={{
                padding: isMobile ? '16px 40px' : '20px 64px',
                backgroundColor: protoHover ? '#27374D' : '#C9B59C',
                color: protoHover ? 'white' : '#27374D',
                border: 'none',
                borderRadius: '999px',
                cursor: 'pointer',
                fontFamily: '"Bodoni Moda", Georgia, serif',
                fontSize: 'clamp(15px, 1.6vw, 22px)',
                fontWeight: '400',
                letterSpacing: '0.08em',
                transition: 'all 0.25s ease',
                boxShadow: protoHover ? '0 12px 40px rgba(39,55,77,0.5)' : '0 12px 40px rgba(0,0,0,0.25)',
              }}
            >
              View Prototype
            </motion.button>
          </div>

        </div>
      </div>

      <footer style={{ backgroundColor: '#F9F8F6', borderTop: '1px solid #EFE9E3' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '40px 20px 30px 20px' : '60px 40px 40px 40px' }}>
          <div style={{ display: 'flex', gap: isMobile ? '32px' : '60px', flexWrap: 'wrap', marginBottom: '48px' }}>

            <motion.div variants={fadeLeft} initial="hidden" whileInView="show" viewport={vp} transition={{ duration: 0.7 }} style={{ flex: '1 1 220px', maxWidth: isMobile ? '100%' : '280px' }}>
              <div style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '24px', fontWeight: '400', color: '#27374D', letterSpacing: '0.04em', marginBottom: '14px' }}>Teams.</div>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '12px', fontWeight: '300', color: '#526D82', lineHeight: '1.85', marginBottom: '24px' }}>
                A virtual collaborative workspace for modern teams, built to keep everyone aligned, productive, and connected.
              </p>
              <div style={{ display: 'flex', gap: '12px' }}>
                {[
                  { label: 'GitHub', path: 'M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.604-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.463-1.11-1.463-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.163 22 16.418 22 12c0-5.523-4.477-10-10-10z' },
                  { label: 'LinkedIn', path: 'M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z M4 6a2 2 0 100-4 2 2 0 000 4z' },
                  { label: 'Twitter', path: 'M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z' },
                ].map((s, i) => (
                  <div key={i} title={s.label}
                    style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: '#EFE9E3', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'background-color 0.2s ease' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = '#27374D'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = '#EFE9E3'}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#526D82" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d={s.path} />
                    </svg>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} transition={{ duration: 0.6, delay: 0.1 }} style={{ flex: '1 1 140px' }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: '500', color: '#C9B59C', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '18px' }}>Product</p>
              {['Features', 'How It Works', 'For Teams', 'View Prototype'].map((link, i) => (
                <p key={i} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: '300', color: '#526D82', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#27374D'}
                  onMouseLeave={e => e.currentTarget.style.color = '#526D82'}
                >{link}</p>
              ))}
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} transition={{ duration: 0.6, delay: 0.2 }} style={{ flex: '1 1 140px' }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: '500', color: '#C9B59C', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '18px' }}>Company</p>
              {['About', 'FAQ', 'Privacy Policy', 'Terms of Service'].map((link, i) => (
                <p key={i} style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: '300', color: '#526D82', marginBottom: '10px', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#27374D'}
                  onMouseLeave={e => e.currentTarget.style.color = '#526D82'}
                >{link}</p>
              ))}
            </motion.div>

            <motion.div variants={fadeRight} initial="hidden" whileInView="show" viewport={vp} transition={{ duration: 0.6, delay: 0.3 }} style={{ flex: '1 1 180px' }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '10px', fontWeight: '500', color: '#C9B59C', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '18px' }}>Contact</p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: '300', color: '#526D82', marginBottom: '10px', lineHeight: '1.7' }}>hello@teamspace.io</p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '13px', fontWeight: '300', color: '#526D82', lineHeight: '1.7' }}>Built for remote-first teams worldwide.</p>
            </motion.div>

          </div>

          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={vp} transition={{ duration: 0.5 }}>
            <div style={{ height: '1px', backgroundColor: '#EFE9E3', marginBottom: '28px' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: '300', color: '#9AA6B2', margin: 0 }}>
                © {new Date().getFullYear()} Teams. All rights reserved.
              </p>
              <p style={{ fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: '300', color: '#9AA6B2', margin: 0 }}>
                Developed by{' '}<span style={{ color: '#C9B59C', fontWeight: '400' }}>AK Meghana</span>
              </p>
            </div>
          </motion.div>

        </div>
      </footer>
    </>
  )
}