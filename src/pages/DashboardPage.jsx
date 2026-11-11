import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import heroBg2 from '../assets/images/hero-bg2.jpg'
import {
  MdDashboard, MdTaskAlt, MdCalendarMonth, MdFolderShared,
  MdSmartToy, MdGroups, MdNotifications, MdSearch,
  MdKeyboardArrowRight
} from 'react-icons/md'

const members = [
  { id: 1, name: 'Rahul Sharma', role: 'Team Leader', online: true, avatar: 'RS', color: '#C9B59C' },
  { id: 2, name: 'Priya Mehta', role: 'Product Manager', online: true, avatar: 'PM', color: '#526D82' },
  { id: 3, name: 'Arjun Patel', role: 'Full Stack Dev', online: false, avatar: 'AP', color: '#27374D' },
  { id: 4, name: 'Sneha Reddy', role: 'DB & Cloud', online: true, avatar: 'SR', color: '#9DB2BF' },
  { id: 5, name: 'Karan Iyer', role: 'Marketing', online: false, avatar: 'KI', color: '#C9B59C' },
  { id: 6, name: 'Ananya Singh', role: 'UI/UX Designer', online: true, avatar: 'AS', color: '#526D82' },
]

const tasks = {
  1: [
    { name: 'Sprint planning', deadline: 'Mar 2', done: true },
    { name: 'Team code review', deadline: 'Mar 5', done: false },
    { name: 'Stakeholder update', deadline: 'Mar 8', done: false },
  ],
  2: [
    { name: 'Product roadmap', deadline: 'Mar 3', done: true },
    { name: 'User research report', deadline: 'Mar 6', done: false },
    { name: 'Feature prioritization', deadline: 'Mar 10', done: false },
  ],
  3: [
    { name: 'Auth module', deadline: 'Mar 1', done: true },
    { name: 'Dashboard UI', deadline: 'Mar 4', done: false },
    { name: 'API integration', deadline: 'Mar 7', done: false },
  ],
  4: [
    { name: 'Database schema', deadline: 'Mar 2', done: true },
    { name: 'Cloud deployment', deadline: 'Mar 6', done: false },
    { name: 'Backup configuration', deadline: 'Mar 9', done: false },
  ],
  5: [
    { name: 'Campaign strategy', deadline: 'Mar 3', done: true },
    { name: 'Social media plan', deadline: 'Mar 5', done: false },
    { name: 'Budget report', deadline: 'Mar 11', done: false },
  ],
  6: [
    { name: 'Wireframes', deadline: 'Mar 1', done: true },
    { name: 'Design system', deadline: 'Mar 5', done: false },
    { name: 'Prototype review', deadline: 'Mar 8', done: false },
  ],
}

const deadlines = {
  4: [{ label: 'Database Schema Final', member: 'Sneha Reddy' }, { label: 'Auth Module Complete', member: 'Arjun Patel' }],
  7: [{ label: 'API Integration', member: 'Arjun Patel' }, { label: 'Campaign Strategy', member: 'Karan Iyer' }],
  10: [{ label: 'Product Roadmap v2', member: 'Priya Mehta' }, { label: 'Cloud Deployment', member: 'Sneha Reddy' }],
  15: [{ label: 'Dashboard UI Complete', member: 'Arjun Patel' }, { label: 'Design System', member: 'Ananya Singh' }],
  20: [{ label: 'Sprint Review', member: 'Rahul Sharma' }, { label: 'Marketing Budget', member: 'Karan Iyer' }],
  25: [{ label: 'Feature Prioritization', member: 'Priya Mehta' }, { label: 'Prototype Review', member: 'Ananya Singh' }],
}

const standups = [
  { member: 'Rahul Sharma', avatar: 'RS', color: '#C9B59C', time: '9:02 AM', update: 'Reviewed PRs and aligned the team on sprint goals. Will be setting up the stakeholder call today.' },
  { member: 'Priya Mehta', avatar: 'PM', color: '#526D82', time: '9:15 AM', update: 'Completed user interviews yesterday. Compiling insights into a report today.' },
  { member: 'Arjun Patel', avatar: 'AP', color: '#27374D', time: '9:30 AM', update: 'Auth module is done and pushed. Starting dashboard UI integration today.' },
  { member: 'Sneha Reddy', avatar: 'SR', color: '#9DB2BF', time: '9:45 AM', update: 'Schema finalised. Working on cloud configuration scripts this afternoon.' },
]

const resources = [
  { name: 'Project Brief.pdf', type: 'PDF', size: '2.4 MB', by: 'Rahul Sharma' },
  { name: 'Design System.fig', type: 'Figma', size: '8.1 MB', by: 'Ananya Singh' },
  { name: 'API Docs.md', type: 'Markdown', size: '340 KB', by: 'Arjun Patel' },
  { name: 'DB Schema.sql', type: 'SQL', size: '120 KB', by: 'Sneha Reddy' },
  { name: 'Campaign Plan.pptx', type: 'PPT', size: '5.2 MB', by: 'Karan Iyer' },
]

const progress = [
  { name: 'Rahul Sharma', avatar: 'RS', color: '#C9B59C', percent: 80 },
  { name: 'Priya Mehta', avatar: 'PM', color: '#526D82', percent: 65 },
  { name: 'Arjun Patel', avatar: 'AP', color: '#27374D', percent: 72 },
  { name: 'Sneha Reddy', avatar: 'SR', color: '#9DB2BF', percent: 90 },
  { name: 'Karan Iyer', avatar: 'KI', color: '#C9B59C', percent: 55 },
  { name: 'Ananya Singh', avatar: 'AS', color: '#526D82', percent: 78 },
]

const navItems = [
  { id: 'overview', icon: <MdDashboard size={20} />, label: 'Overview' },
  { id: 'tasks', icon: <MdTaskAlt size={20} />, label: 'Tasks' },
  { id: 'calendar', icon: <MdCalendarMonth size={20} />, label: 'Calendar' },
  { id: 'resources', icon: <MdFolderShared size={20} />, label: 'Resources' },
  { id: 'ai', icon: <MdSmartToy size={20} />, label: 'AI Assistant' },
  { id: 'standups', icon: <MdGroups size={20} />, label: 'Standups' },
]

const daysInMarch = Array.from({ length: 31 }, (_, i) => i + 1)
const firstDayOffset = 6

function getAIResponse(input) {
  const q = input.toLowerCase()

  if (q.includes('rahul')) {
    return `🧑‍💼 **Rahul Sharma — Team Leader (80% progress)**\n\nRahul has completed Sprint Planning and is currently working on Team Code Review (due Mar 5) and the Stakeholder Update (due Mar 8). Today he reviewed PRs, aligned the team on sprint goals, and is setting up the stakeholder call. He's one of the most active members online.`
  }
  if (q.includes('priya')) {
    return `📋 **Priya Mehta — Product Manager (65% progress)**\n\nPriya has finished the Product Roadmap and is working on the User Research Report (due Mar 6) and Feature Prioritization (due Mar 10). She completed user interviews yesterday and is compiling insights today. She has a key deadline on Mar 10.`
  }
  if (q.includes('arjun')) {
    return `💻 **Arjun Patel — Full Stack Dev (72% progress)**\n\nArjun has completed the Auth Module and is now working on Dashboard UI (due Mar 4) and API Integration (due Mar 7). He pushed the auth module today and started dashboard UI integration. He has back-to-back deadlines — watch Mar 4 and Mar 7 closely.`
  }
  if (q.includes('sneha')) {
    return `☁️ **Sneha Reddy — DB & Cloud (90% progress)**\n\nSneha is the top performer at 90% progress! She finalized the Database Schema and is now working on Cloud Deployment (due Mar 6) and Backup Configuration (due Mar 9). She's working on cloud configuration scripts this afternoon.`
  }
  if (q.includes('karan')) {
    return `📣 **Karan Iyer — Marketing (55% progress)**\n\nKaran is the team member with the most runway — currently at 55% progress. His Campaign Strategy is done, and he's working on the Social Media Plan (due Mar 5) and Budget Report (due Mar 11). He has a Sprint Review deadline on Mar 20.`
  }
  if (q.includes('ananya')) {
    return `🎨 **Ananya Singh — UI/UX Designer (78% progress)**\n\nAnanya completed the Wireframes and is now focused on the Design System (due Mar 5) and Prototype Review (due Mar 8). She's a key contributor to the project's visual direction and has a deadline on Mar 15 for the Design System.`
  }
  if (q.includes('summary') || q.includes('overview') || q.includes('status')) {
    return `📊 **Team Summary — Adobe 512**\n\n14 out of 18 tasks are completed. 4 out of 6 members are online. The standout performer is Sneha Reddy at 90%, while Karan Iyer needs attention at 55%. Next major deadline cluster is around Mar 4–7, with Arjun's Dashboard UI and API Integration both due then.`
  }
  if (q.includes('behind') || q.includes('risk') || q.includes('slow') || q.includes('low')) {
    return `⚠️ **Members Needing Attention**\n\nKaran Iyer is at the lowest progress (55%) with his Social Media Plan due Mar 5 — just days away. Priya Mehta is at 65% with two open tasks. Both have upcoming deadlines and may need a check-in from the team lead.`
  }
  if (q.includes('deadline') || q.includes('due') || q.includes('upcoming')) {
    return `📅 **Upcoming Deadlines**\n\n• Mar 4 — Dashboard UI (Arjun)\n• Mar 5 — Team Code Review (Rahul), Social Media Plan (Karan), Design System (Ananya)\n• Mar 6 — User Research Report (Priya), Cloud Deployment (Sneha)\n• Mar 7 — API Integration (Arjun)\n• Mar 8 — Stakeholder Update (Rahul), Prototype Review (Ananya)\n\nThe busiest week is Mar 4–8. Make sure the team is aligned!`
  }
  if (q.includes('file') || q.includes('resource') || q.includes('document') || q.includes('api') || q.includes('design') || q.includes('brief')) {
    return `📁 **Shared Resources**\n\n5 files are available: Project Brief.pdf (Rahul, 2.4MB), Design System.fig (Ananya, 8.1MB), API Docs.md (Arjun, 340KB), DB Schema.sql (Sneha, 120KB), and Campaign Plan.pptx (Karan, 5.2MB). The API Docs and Design System are the most relevant for the current sprint.`
  }
  if (q.includes('top') || q.includes('best') || q.includes('perform')) {
    return `🏆 **Top Performers**\n\nSneha Reddy leads the team at 90% progress, followed by Rahul Sharma at 80% and Ananya Singh at 78%. These three are on track to finish before their deadlines. Great momentum on the cloud and design fronts!`
  }

  return `🤖 I can help with questions like:\n\n• "Give me a summary of the team"\n• "What is Arjun working on?"\n• "Who is behind on tasks?"\n• "What are the upcoming deadlines?"\n• "Show me the shared resources"\n• "Who is the top performer?"\n\nTry one of these — I have context on all 6 team members!`
}

const dummyAISuggestions = [
  'Give me a team summary',
  'Who is behind on tasks?',
  'What is Sneha working on?',
  'List upcoming deadlines',
]

export default function DashboardPage() {
  const [active, setActive] = useState('overview')
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', text: "👋 Hello! I'm your Team Knowledge Assistant. Ask me about team members, deadlines, resources, or progress, I've got the full picture!" }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const sendAI = (overrideInput) => {
    const text = overrideInput || aiInput
    if (!text.trim()) return
    const userMsg = { role: 'user', text }
    setAiMessages(prev => [...prev, userMsg])
    setAiInput('')
    setIsTyping(true)
    setTimeout(() => {
      const botText = getAIResponse(text)
      setAiMessages(prev => [...prev, { role: 'assistant', text: botText }])
      setIsTyping(false)
    }, 700)
  }

  const avatarStyle = (color) => ({
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: color,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: '500',
    color: 'white',
    flexShrink: 0,
  })

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'Poppins, sans-serif' }}>
      <img
        src={heroBg2}
        alt=""
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
      />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,16,28,0.45)' }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: '860px',
            height: '600px',
            background: 'rgba(15,22,35,0.82)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '12px 20px',
            borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '16px', fontWeight: '400', color: 'white', letterSpacing: '0.04em' }}>
                Teams
              </div>
              <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>
                Team Adobe 512
              </div>
            </div>

            <div style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px', padding: '6px 12px', width: '180px',
            }}>
              <MdSearch size={13} color="rgba(255,255,255,0.4)" />
              <input
                placeholder="Search..."
                style={{
                  background: 'none', border: 'none', outline: 'none',
                  fontFamily: 'Poppins, sans-serif', fontSize: '11px',
                  fontWeight: '300', color: 'white', width: '100%',
                }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <MdNotifications size={18} color="rgba(255,255,255,0.6)" />
                <div style={{
                  position: 'absolute', top: '-2px', right: '-2px',
                  width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C9B59C',
                }} />
              </div>
              <div style={{ ...avatarStyle('#C9B59C'), width: '30px', height: '30px', fontSize: '10px', cursor: 'pointer' }}>
                RS
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <div style={{
              width: '48px',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              paddingTop: '12px', gap: '4px', flexShrink: 0,
            }}>
              {navItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { setActive(item.id); setSelectedMember(null); setSelectedDay(null) }}
                  title={item.label}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: active === item.id ? 'rgba(201,181,156,0.2)' : 'transparent',
                    color: active === item.id ? '#C9B59C' : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.icon}
                </div>
              ))}
            </div>

            <div style={{ flex: 1, overflow: 'hidden', display: 'flex' }}>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
                <AnimatePresence mode="wait">

                  {active === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p style={{ fontSize: '9px', fontWeight: '400', color: '#C9B59C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Today's Overview
                      </p>
                      <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '19px', fontWeight: '400', color: 'white', marginBottom: '16px' }}>
                        Team Adobe 512 : March 2026
                      </h2>

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '18px' }}>
                        {[
                          { label: 'Tasks Completed', value: '14 / 18' },
                          { label: 'Days to Deadline', value: '12' },
                          { label: 'Active Members', value: '4 / 6' },
                          { label: 'Resources Shared', value: '5' },
                        ].map((s, i) => (
                          <div key={i} style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px', padding: '12px 16px',
                          }}>
                            <div style={{ fontSize: '10px', fontWeight: '300', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{s.label}</div>
                            <div style={{ fontSize: '20px', fontWeight: '300', color: 'white' }}>{s.value}</div>
                          </div>
                        ))}
                      </div>

                      <p style={{ fontSize: '10px', fontWeight: '400', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>
                        Member Progress
                      </p>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
                        {progress.map((m, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={avatarStyle(m.color)}>{m.avatar}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.7)' }}>{m.name}</span>
                                <span style={{ fontSize: '11px', fontWeight: '300', color: '#C9B59C' }}>{m.percent}%</span>
                              </div>
                              <div style={{ height: '3px', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                                <motion.div
                                  initial={{ width: 0 }}
                                  animate={{ width: `${m.percent}%` }}
                                  transition={{ duration: 0.8, delay: i * 0.08 }}
                                  style={{ height: '100%', backgroundColor: '#C9B59C', borderRadius: '2px' }}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {active === 'tasks' && (
                    <motion.div
                      key="tasks"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p style={{ fontSize: '9px', fontWeight: '400', color: '#C9B59C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Task Board</p>
                      <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '19px', fontWeight: '400', color: 'white', marginBottom: '14px' }}>
                        {selectedMember ? `${selectedMember.name}'s Tasks` : 'Select a member to view tasks'}
                      </h2>

                      {selectedMember ? (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {tasks[selectedMember.id].map((t, i) => (
                              <div key={i} style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                backgroundColor: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px', padding: '12px 16px',
                              }}>
                                <div style={{
                                  width: '14px', height: '14px', borderRadius: '50%',
                                  border: t.done ? 'none' : '1.5px solid rgba(255,255,255,0.3)',
                                  backgroundColor: t.done ? '#C9B59C' : 'transparent', flexShrink: 0,
                                }} />
                                <span style={{ flex: 1, fontSize: '11px', fontWeight: '300', color: t.done ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)', textDecoration: t.done ? 'line-through' : 'none' }}>
                                  {t.name}
                                </span>
                                <span style={{ fontSize: '10px', fontWeight: '300', color: 'rgba(255,255,255,0.35)' }}>Due {t.deadline}</span>
                              </div>
                            ))}
                          </div>
                          <button
                            onClick={() => setSelectedMember(null)}
                            style={{
                              marginTop: '12px', background: 'none',
                              border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px',
                              padding: '6px 14px', color: 'rgba(255,255,255,0.5)',
                              fontFamily: 'Poppins, sans-serif', fontSize: '10px', cursor: 'pointer',
                            }}
                          >
                            Back to all members
                          </button>
                        </>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {members.map((m) => (
                            <div
                              key={m.id}
                              onClick={() => setSelectedMember(m)}
                              style={{
                                display: 'flex', alignItems: 'center', gap: '10px',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px', padding: '10px 14px',
                                cursor: 'pointer', transition: 'background 0.2s ease',
                              }}
                              onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                              onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
                            >
                              <div style={avatarStyle(m.color)}>{m.avatar}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '11px', fontWeight: '400', color: 'white' }}>{m.name}</div>
                                <div style={{ fontSize: '10px', fontWeight: '300', color: 'rgba(255,255,255,0.4)' }}>{m.role}</div>
                              </div>
                              <MdKeyboardArrowRight size={15} color="rgba(255,255,255,0.3)" />
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {active === 'calendar' && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p style={{ fontSize: '9px', fontWeight: '400', color: '#C9B59C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Calendar</p>
                      <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '19px', fontWeight: '400', color: 'white', marginBottom: '14px' }}>
                        March 2026
                      </h2>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '14px' }}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((d) => (
                          <div key={d} style={{ textAlign: 'center', fontSize: '9px', fontWeight: '400', color: 'rgba(255,255,255,0.3)', padding: '4px 0' }}>{d}</div>
                        ))}
                        {Array.from({ length: firstDayOffset }).map((_, i) => <div key={`e-${i}`} />)}
                        {daysInMarch.map((day) => {
                          const hasDeadline = deadlines[day]
                          return (
                            <div
                              key={day}
                              onClick={() => hasDeadline && setSelectedDay(selectedDay === day ? null : day)}
                              style={{
                                textAlign: 'center', padding: '6px 2px', borderRadius: '5px',
                                fontSize: '11px', fontWeight: '300',
                                cursor: hasDeadline ? 'pointer' : 'default',
                                backgroundColor: selectedDay === day ? 'rgba(201,181,156,0.2)' : hasDeadline ? 'rgba(220,80,80,0.1)' : 'transparent',
                                color: hasDeadline ? '#ff7b7b' : 'rgba(255,255,255,0.6)',
                                border: hasDeadline ? '1px solid rgba(220,80,80,0.3)' : '1px solid transparent',
                                transition: 'all 0.2s ease',
                              }}
                            >
                              {day}
                            </div>
                          )
                        })}
                      </div>

                      <AnimatePresence>
                        {selectedDay && deadlines[selectedDay] && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            style={{
                              backgroundColor: 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              borderRadius: '10px', padding: '14px 16px', overflow: 'hidden',
                            }}
                          >
                            <p style={{ fontSize: '9px', fontWeight: '400', color: '#C9B59C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
                              Deadlines — March {selectedDay}
                            </p>
                            {deadlines[selectedDay].map((d, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                <div style={{ width: '5px', height: '5px', borderRadius: '50%', backgroundColor: '#ff7b7b', flexShrink: 0 }} />
                                <span style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.8)', flex: 1 }}>{d.label}</span>
                                <span style={{ fontSize: '10px', fontWeight: '300', color: 'rgba(255,255,255,0.35)' }}>{d.member}</span>
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  )}

                  {active === 'resources' && (
                    <motion.div
                      key="resources"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p style={{ fontSize: '9px', fontWeight: '400', color: '#C9B59C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Resources</p>
                      <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '19px', fontWeight: '400', color: 'white', marginBottom: '14px' }}>Shared Files</h2>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '18px' }}>
                        {resources.map((r, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', gap: '10px',
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px', padding: '10px 14px',
                          }}>
                            <div style={{
                              width: '28px', height: '28px', borderRadius: '6px',
                              backgroundColor: 'rgba(201,181,156,0.15)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontSize: '8px', fontWeight: '500', color: '#C9B59C', letterSpacing: '0.05em',
                            }}>
                              {r.type}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.85)' }}>{r.name}</div>
                              <div style={{ fontSize: '9px', fontWeight: '300', color: 'rgba(255,255,255,0.35)' }}>{r.size} · {r.by}</div>
                            </div>
                          </div>
                        ))}
                      </div>

                      <p style={{ fontSize: '9px', fontWeight: '400', color: '#C9B59C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '10px' }}>
                        Ask AI about Resources
                      </p>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          value={aiInput}
                          onChange={e => setAiInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && sendAI()}
                          placeholder="Ask about your team's documents..."
                          style={{
                            flex: 1, padding: '8px 12px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px', fontWeight: '300', color: 'white', outline: 'none',
                          }}
                        />
                        <button onClick={() => sendAI()} style={{
                          padding: '8px 16px', backgroundColor: '#C9B59C', border: 'none',
                          borderRadius: '8px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                          fontSize: '11px', fontWeight: '400', color: '#27374D',
                        }}>
                          Ask
                        </button>
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        {aiMessages.map((msg, i) => (
                          <div key={i} style={{
                            padding: '8px 12px', borderRadius: '8px',
                            backgroundColor: msg.role === 'user' ? 'rgba(201,181,156,0.1)' : 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.06)',
                            fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.75)',
                            lineHeight: '1.6', whiteSpace: 'pre-line',
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          }}>
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {active === 'ai' && (
                    <motion.div
                      key="ai"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
                    >
                      <p style={{ fontSize: '9px', fontWeight: '400', color: '#C9B59C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>AI Assistant</p>
                      <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '19px', fontWeight: '400', color: 'white', marginBottom: '10px' }}>
                        Team Knowledge Assistant
                      </h2>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
                        {dummyAISuggestions.map((s, i) => (
                          <div
                            key={i}
                            onClick={() => sendAI(s)}
                            style={{
                              padding: '4px 10px',
                              backgroundColor: 'rgba(201,181,156,0.1)',
                              border: '1px solid rgba(201,181,156,0.25)',
                              borderRadius: '20px', fontSize: '10px', fontWeight: '300',
                              color: '#C9B59C', cursor: 'pointer', transition: 'all 0.2s',
                            }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,181,156,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(201,181,156,0.1)'}
                          >
                            {s}
                          </div>
                        ))}
                      </div>

                      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px', overflowY: 'auto' }}>
                        {aiMessages.map((msg, i) => (
                          <div key={i} style={{
                            padding: '10px 14px', borderRadius: '10px',
                            backgroundColor: msg.role === 'user' ? 'rgba(201,181,156,0.12)' : 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.8)',
                            lineHeight: '1.7', whiteSpace: 'pre-line', maxWidth: '85%',
                            alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
                          }}>
                            {msg.text}
                          </div>
                        ))}
                        {isTyping && (
                          <div style={{
                            padding: '10px 14px', borderRadius: '10px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.4)',
                            alignSelf: 'flex-start',
                          }}>
                            Thinking...
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          value={aiInput}
                          onChange={e => setAiInput(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && sendAI()}
                          placeholder="Ask anything about your team..."
                          style={{
                            flex: 1, padding: '10px 14px',
                            backgroundColor: 'rgba(255,255,255,0.06)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '8px', fontFamily: 'Poppins, sans-serif',
                            fontSize: '11px', fontWeight: '300', color: 'white', outline: 'none',
                          }}
                        />
                        <button onClick={() => sendAI()} style={{
                          padding: '10px 18px', backgroundColor: '#C9B59C', border: 'none',
                          borderRadius: '8px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
                          fontSize: '11px', fontWeight: '400', color: '#27374D',
                        }}>
                          Send
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {active === 'standups' && (
                    <motion.div
                      key="standups"
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <p style={{ fontSize: '9px', fontWeight: '400', color: '#C9B59C', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '4px' }}>Daily Standups</p>
                      <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '19px', fontWeight: '400', color: 'white', marginBottom: '14px' }}>
                        Today Feb 27, 2026
                      </h2>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {standups.map((s, i) => (
                          <div key={i} style={{
                            backgroundColor: 'rgba(255,255,255,0.04)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px', padding: '12px 16px',
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                              <div style={avatarStyle(s.color)}>{s.avatar}</div>
                              <div>
                                <div style={{ fontSize: '11px', fontWeight: '400', color: 'white' }}>{s.member}</div>
                                <div style={{ fontSize: '9px', fontWeight: '300', color: 'rgba(255,255,255,0.35)' }}>{s.time}</div>
                              </div>
                            </div>
                            <p style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>
                              {s.update}
                            </p>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              <div style={{
                width: '190px',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                padding: '16px 12px', overflowY: 'auto', flexShrink: 0,
              }}>
                <p style={{ fontSize: '9px', fontWeight: '400', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
                  Team Members
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {members.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => { setActive('tasks'); setSelectedMember(m) }}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '8px',
                        padding: '8px 10px', borderRadius: '8px', cursor: 'pointer',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                        transition: 'all 0.2s ease',
                      }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                    >
                      <div style={{ position: 'relative' }}>
                        <div style={avatarStyle(m.color)}>{m.avatar}</div>
                        <div style={{
                          position: 'absolute', bottom: '1px', right: '1px',
                          width: '6px', height: '6px', borderRadius: '50%',
                          backgroundColor: m.online ? '#6fcf97' : 'rgba(255,255,255,0.2)',
                          border: '1.5px solid rgba(0,0,0,0.3)',
                        }} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: '10px', fontWeight: '400', color: 'rgba(255,255,255,0.8)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.name}</div>
                        <div style={{ fontSize: '9px', fontWeight: '300', color: 'rgba(255,255,255,0.35)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.role}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}