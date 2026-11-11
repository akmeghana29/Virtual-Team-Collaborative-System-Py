import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import heroBg2 from '../assets/images/hero-bg2.jpg'
import {
  MdDashboard, MdTaskAlt, MdCalendarMonth, MdFolderShared,
  MdSmartToy, MdGroups, MdNotifications, MdSearch,
  MdKeyboardArrowRight, MdAdd, MdClose, MdCheckCircle,
  MdRadioButtonUnchecked, MdUpload
} from 'react-icons/md'

const TODAY = new Date()
const TODAY_LABEL = TODAY.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
const CURRENT_MONTH = TODAY.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
const DAYS_IN_MONTH = new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate()
const FIRST_DAY_OFFSET = new Date(TODAY.getFullYear(), TODAY.getMonth(), 1).getDay()

export default function RealDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [members, setMembers] = useState([
    { id: 1, name: 'Rahul Sharma', role: 'Team Leader', avatar: 'RS', color: '#C9B59C', online: true }
  ])
  const [tasks, setTasks] = useState({})
  const [deadlines, setDeadlines] = useState({})
  const [resources, setResources] = useState([])
  const [standups, setStandups] = useState({})
  const [newMember, setNewMember] = useState({ name: '', role: '' })
  const [newTask, setNewTask] = useState({ memberId: '', name: '', deadline: '' })
  const [newDeadline, setNewDeadline] = useState({ day: '', label: '', member: '' })
  const [newStandup, setNewStandup] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState([
    { role: 'assistant', text: "👋 Hello! I'm your Team Knowledge Assistant. Ask me about team members, tasks, deadlines, or resources." }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const navItems = [
    { id: 'overview', icon: <MdDashboard size={20} />, label: 'Overview' },
    { id: 'tasks', icon: <MdTaskAlt size={20} />, label: 'Tasks' },
    { id: 'calendar', icon: <MdCalendarMonth size={20} />, label: 'Calendar' },
    { id: 'resources', icon: <MdFolderShared size={20} />, label: 'Resources' },
    { id: 'ai', icon: <MdSmartToy size={20} />, label: 'AI Assistant' },
    { id: 'standups', icon: <MdGroups size={20} />, label: 'Standups' },
  ]

  const avatarStyle = (color) => ({
    width: '32px', height: '32px', borderRadius: '50%',
    backgroundColor: color, display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: '500',
    color: 'white', flexShrink: 0,
  })

  const inputStyle = {
    flex: 1, padding: '7px 10px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '6px', fontFamily: 'Poppins, sans-serif',
    fontSize: '11px', fontWeight: '300', color: 'white', outline: 'none',
  }

  const btnStyle = {
    padding: '7px 14px', backgroundColor: '#C9B59C', border: 'none',
    borderRadius: '6px', cursor: 'pointer', fontFamily: 'Poppins, sans-serif',
    fontSize: '11px', fontWeight: '400', color: '#27374D', flexShrink: 0,
  }

  const sectionLabel = (text) => (
    <p style={{ fontSize: '9px', fontWeight: '500', color: '#C9B59C', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '4px' }}>
      {text}
    </p>
  )

  const sectionTitle = (text) => (
    <h2 style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '19px', fontWeight: '400', color: 'white', marginBottom: '14px' }}>
      {text}
    </h2>
  )

  const addMember = () => {
    if (!newMember.name.trim() || !newMember.role.trim()) return
    const colors = ['#C9B59C', '#526D82', '#9DB2BF', '#27374D', '#8a9ba8', '#b8a48c']
    const id = Date.now()
    const avatar = newMember.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    setMembers(prev => [...prev, { id, ...newMember, avatar, color: colors[prev.length % colors.length], online: false }])
    setNewMember({ name: '', role: '' })
  }

  const addTask = () => {
    if (!newTask.name.trim() || !newTask.memberId || !newTask.deadline.trim()) return
    const memberId = parseInt(newTask.memberId)
    setTasks(prev => ({
      ...prev,
      [memberId]: [...(prev[memberId] || []), { name: newTask.name, deadline: newTask.deadline, done: false, id: Date.now() }]
    }))
    setNewTask({ memberId: '', name: '', deadline: '' })
  }

  const toggleTask = (memberId, taskId) => {
    setTasks(prev => ({
      ...prev,
      [memberId]: prev[memberId].map(t => t.id === taskId ? { ...t, done: !t.done } : t)
    }))
  }

  const addDeadline = () => {
    if (!newDeadline.day || !newDeadline.label.trim() || !newDeadline.member.trim()) return
    const day = parseInt(newDeadline.day)
    setDeadlines(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { label: newDeadline.label, member: newDeadline.member }]
    }))
    setNewDeadline({ day: '', label: '', member: '' })
  }

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      setResources(prev => [...prev, {
        id: Date.now() + Math.random(),
        name: file.name,
        size: (file.size / 1024).toFixed(0) + ' KB',
        type: file.name.split('.').pop().toUpperCase(),
        by: 'You',
      }])
    })
  }

  const addStandup = () => {
    if (!newStandup.trim()) return
    const dateKey = TODAY.toISOString().split('T')[0]
    setStandups(prev => ({
      ...prev,
      [dateKey]: [...(prev[dateKey] || []), {
        id: Date.now(),
        member: 'You',
        avatar: 'ME',
        color: '#C9B59C',
        time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
        update: newStandup,
      }]
    }))
    setNewStandup('')
  }

  const getAIResponse = (input) => {
    const q = input.toLowerCase()
    if (q.includes('member') || q.includes('team')) {
      return `Your team currently has ${members.length} member${members.length > 1 ? 's' : ''}:\n\n${members.map(m => `• ${m.name} — ${m.role}`).join('\n')}`
    }
    if (q.includes('task') || q.includes('work')) {
      const total = Object.values(tasks).flat().length
      const done = Object.values(tasks).flat().filter(t => t.done).length
      return `Total tasks across the team: ${total}\nCompleted: ${done}\nPending: ${total - done}\n\nGo to the Tasks tab to manage individual member tasks.`
    }
    if (q.includes('deadline') || q.includes('due') || q.includes('calendar')) {
      const total = Object.values(deadlines).flat().length
      return `You have ${total} deadline${total !== 1 ? 's' : ''} marked on the calendar. Go to the Calendar tab to view or add more.`
    }
    if (q.includes('file') || q.includes('resource') || q.includes('document')) {
      return `${resources.length} file${resources.length !== 1 ? 's' : ''} shared so far:\n\n${resources.map(r => `• ${r.name} (${r.size})`).join('\n') || 'No files uploaded yet.'}`
    }
    if (q.includes('standup') || q.includes('progress') || q.includes('today')) {
      const dateKey = TODAY.toISOString().split('T')[0]
      const todayStandups = standups[dateKey] || []
      return `${todayStandups.length} standup update${todayStandups.length !== 1 ? 's' : ''} submitted today.\n\n${todayStandups.map(s => `• ${s.member}: ${s.update}`).join('\n') || 'No updates yet today.'}`
    }
    return `I can help you with:\n\n• "How many members are in the team?"\n• "What tasks are pending?"\n• "How many deadlines are marked?"\n• "What files are shared?"\n• "What are today's standups?"\n\nTry asking one of these!`
  }

  const sendAI = (override) => {
    const text = override || aiInput
    if (!text.trim()) return
    setAiMessages(prev => [...prev, { role: 'user', text }])
    setAiInput('')
    setIsTyping(true)
    setTimeout(() => {
      setAiMessages(prev => [...prev, { role: 'assistant', text: getAIResponse(text) }])
      setIsTyping(false)
    }, 600)
  }

  const completedTasks = Object.values(tasks).flat().filter(t => t.done).length
  const totalTasks = Object.values(tasks).flat().length
  const dateKey = TODAY.toISOString().split('T')[0]
  const todayStandups = standups[dateKey] || []

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative', overflow: 'hidden', fontFamily: 'Poppins, sans-serif' }}>
      <img src={heroBg2} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(10,16,28,0.55)' }} />

      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: '900px', height: '650px',
            background: 'rgba(15,22,35,0.85)',
            backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '18px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
            display: 'flex', flexDirection: 'column', overflow: 'hidden',
          }}
        >
          <div style={{
            padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ fontFamily: '"Bodoni Moda", Georgia, serif', fontSize: '16px', fontWeight: '400', color: 'white', letterSpacing: '0.04em' }}>Teams</div>
              <div style={{ width: '1px', height: '14px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
              <div style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.5)', letterSpacing: '0.06em' }}>Team Adobe 512</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', padding: '6px 12px', width: '180px' }}>
              <MdSearch size={13} color="rgba(255,255,255,0.4)" />
              <input placeholder="Search..." style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'Poppins, sans-serif', fontSize: '11px', fontWeight: '300', color: 'white', width: '100%' }} />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <MdNotifications size={18} color="rgba(255,255,255,0.6)" />
                <div style={{ position: 'absolute', top: '-2px', right: '-2px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#C9B59C' }} />
              </div>
              <div style={{ ...avatarStyle('#C9B59C'), width: '30px', height: '30px', fontSize: '10px', cursor: 'pointer' }}>RS</div>
            </div>
          </div>

          <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
            <div style={{ width: '48px', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '12px', gap: '4px', flexShrink: 0 }}>
              {navItems.map((item) => (
                <div
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSelectedMember(null); setSelectedDay(null) }}
                  title={item.label}
                  style={{
                    width: '36px', height: '36px', borderRadius: '8px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: activeTab === item.id ? 'rgba(201,181,156,0.2)' : 'transparent',
                    color: activeTab === item.id ? '#C9B59C' : 'rgba(255,255,255,0.4)',
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

                  {activeTab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      {sectionLabel("Today's Overview")}
                      {sectionTitle(`Team Adobe 512 — ${CURRENT_MONTH}`)}

                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '20px' }}>
                        {[
                          { label: 'Tasks Completed', value: `${completedTasks} / ${totalTasks}` },
                          { label: 'Total Members', value: members.length },
                          { label: 'Deadlines Marked', value: Object.values(deadlines).flat().length },
                          { label: 'Files Shared', value: resources.length },
                        ].map((s, i) => (
                          <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '300', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{s.label}</div>
                            <div style={{ fontSize: '22px', fontWeight: '300', color: 'white' }}>{s.value}</div>
                          </div>
                        ))}
                      </div>

                      {sectionLabel('Add New Member')}
                      <div style={{ display: 'flex', gap: '6px', marginBottom: '20px' }}>
                        <input placeholder="Full Name" value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })} style={inputStyle} />
                        <input placeholder="Role" value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })} style={inputStyle} />
                        <button onClick={addMember} style={btnStyle}><MdAdd size={14} /></button>
                      </div>

                      {sectionLabel("Today's Standups")}
                      {todayStandups.length === 0
                        ? <p style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.3)', marginBottom: '8px' }}>No standups submitted yet today.</p>
                        : todayStandups.map((s, i) => (
                          <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', padding: '10px 14px', marginBottom: '6px' }}>
                            <div style={{ fontSize: '10px', fontWeight: '300', color: 'rgba(255,255,255,0.4)', marginBottom: '4px' }}>{s.time}</div>
                            <p style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.75)', lineHeight: '1.6' }}>{s.update}</p>
                          </div>
                        ))
                      }
                    </motion.div>
                  )}

                  {activeTab === 'tasks' && (
                    <motion.div key="tasks" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      {sectionLabel('Task Board')}
                      {sectionTitle(selectedMember ? `${selectedMember.name}'s Tasks` : 'Select a Member')}

                      {!selectedMember && (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '20px' }}>
                            {members.map(m => (
                              <div
                                key={m.id}
                                onClick={() => setSelectedMember(m)}
                                style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer', transition: 'background 0.2s' }}
                                onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                                onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)'}
                              >
                                <div style={avatarStyle(m.color)}>{m.avatar}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '11px', fontWeight: '400', color: 'white' }}>{m.name}</div>
                                  <div style={{ fontSize: '10px', fontWeight: '300', color: 'rgba(255,255,255,0.4)' }}>{m.role} · {(tasks[m.id] || []).length} tasks</div>
                                </div>
                                <MdKeyboardArrowRight size={15} color="rgba(255,255,255,0.3)" />
                              </div>
                            ))}
                          </div>

                          {sectionLabel('Add Task')}
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            <select
                              value={newTask.memberId}
                              onChange={e => setNewTask({ ...newTask, memberId: e.target.value })}
                              style={{ ...inputStyle, flex: 'none', width: '140px' }}
                            >
                              <option value="" style={{ backgroundColor: '#1a2535' }}>Select Member</option>
                              {members.map(m => <option key={m.id} value={m.id} style={{ backgroundColor: '#1a2535' }}>{m.name}</option>)}
                            </select>
                            <input placeholder="Task name" value={newTask.name} onChange={e => setNewTask({ ...newTask, name: e.target.value })} style={inputStyle} />
                            <input placeholder="Deadline e.g. Mar 5" value={newTask.deadline} onChange={e => setNewTask({ ...newTask, deadline: e.target.value })} style={{ ...inputStyle, flex: 'none', width: '120px' }} />
                            <button onClick={addTask} style={btnStyle}><MdAdd size={14} /></button>
                          </div>
                        </>
                      )}

                      {selectedMember && (
                        <>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '14px' }}>
                            {(tasks[selectedMember.id] || []).length === 0
                              ? <p style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.35)' }}>No tasks added yet for {selectedMember.name}.</p>
                              : (tasks[selectedMember.id] || []).map((t) => (
                                <div
                                  key={t.id}
                                  onClick={() => toggleTask(selectedMember.id, t.id)}
                                  style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px', cursor: 'pointer' }}
                                >
                                  {t.done
                                    ? <MdCheckCircle size={16} color="#C9B59C" />
                                    : <MdRadioButtonUnchecked size={16} color="rgba(255,255,255,0.3)" />
                                  }
                                  <span style={{ flex: 1, fontSize: '11px', fontWeight: '300', color: t.done ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.85)', textDecoration: t.done ? 'line-through' : 'none' }}>{t.name}</span>
                                  <span style={{ fontSize: '10px', fontWeight: '300', color: 'rgba(255,255,255,0.35)' }}>Due {t.deadline}</span>
                                </div>
                              ))
                            }
                          </div>
                          <button onClick={() => setSelectedMember(null)} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '6px 14px', color: 'rgba(255,255,255,0.5)', fontFamily: 'Poppins, sans-serif', fontSize: '10px', cursor: 'pointer' }}>
                            ← Back
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'calendar' && (
                    <motion.div key="calendar" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      {sectionLabel('Calendar')}
                      {sectionTitle(CURRENT_MONTH)}

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '14px' }}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(d => (
                          <div key={d} style={{ textAlign: 'center', fontSize: '9px', fontWeight: '400', color: 'rgba(255,255,255,0.3)', padding: '4px 0' }}>{d}</div>
                        ))}
                        {Array.from({ length: FIRST_DAY_OFFSET }).map((_, i) => <div key={`e-${i}`} />)}
                        {Array.from({ length: DAYS_IN_MONTH }, (_, i) => i + 1).map(day => {
                          const hasDeadline = deadlines[day]
                          const isToday = day === TODAY.getDate()
                          return (
                            <div
                              key={day}
                              onClick={() => hasDeadline && setSelectedDay(selectedDay === day ? null : day)}
                              style={{
                                textAlign: 'center', padding: '6px 2px', borderRadius: '5px',
                                fontSize: '11px', fontWeight: isToday ? '500' : '300',
                                cursor: hasDeadline ? 'pointer' : 'default',
                                backgroundColor: selectedDay === day ? 'rgba(201,181,156,0.2)' : isToday ? 'rgba(201,181,156,0.15)' : hasDeadline ? 'rgba(220,80,80,0.1)' : 'transparent',
                                color: hasDeadline ? '#ff7b7b' : isToday ? '#C9B59C' : 'rgba(255,255,255,0.6)',
                                border: hasDeadline ? '1px solid rgba(220,80,80,0.3)' : isToday ? '1px solid rgba(201,181,156,0.4)' : '1px solid transparent',
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
                          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 16px', overflow: 'hidden', marginBottom: '14px' }}>
                            {sectionLabel(`Deadlines — ${CURRENT_MONTH.split(' ')[0]} ${selectedDay}`)}
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

                      {sectionLabel('Add Deadline')}
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <input type="number" placeholder="Day (1-31)" min="1" max="31" value={newDeadline.day} onChange={e => setNewDeadline({ ...newDeadline, day: e.target.value })} style={{ ...inputStyle, flex: 'none', width: '100px' }} />
                        <input placeholder="Deadline label" value={newDeadline.label} onChange={e => setNewDeadline({ ...newDeadline, label: e.target.value })} style={inputStyle} />
                        <input placeholder="Assigned to" value={newDeadline.member} onChange={e => setNewDeadline({ ...newDeadline, member: e.target.value })} style={{ ...inputStyle, flex: 'none', width: '120px' }} />
                        <button onClick={addDeadline} style={btnStyle}><MdAdd size={14} /></button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'resources' && (
                    <motion.div key="resources" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      {sectionLabel('Resources')}
                      {sectionTitle('Shared Files')}

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', backgroundColor: 'rgba(201,181,156,0.1)', border: '1px dashed rgba(201,181,156,0.4)', borderRadius: '8px', cursor: 'pointer', fontSize: '11px', fontWeight: '300', color: '#C9B59C' }}>
                          <MdUpload size={16} />
                          Click to upload files
                          <input type="file" multiple onChange={handleFileUpload} style={{ display: 'none' }} />
                        </label>
                      </div>

                      {resources.length === 0
                        ? <p style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.3)', marginBottom: '16px' }}>No files uploaded yet.</p>
                        : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '16px' }}>
                            {resources.map((r, i) => (
                              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '8px', padding: '10px 14px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '6px', backgroundColor: 'rgba(201,181,156,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', fontWeight: '500', color: '#C9B59C' }}>{r.type}</div>
                                <div style={{ flex: 1 }}>
                                  <div style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.85)' }}>{r.name}</div>
                                  <div style={{ fontSize: '9px', fontWeight: '300', color: 'rgba(255,255,255,0.35)' }}>{r.size} · {r.by}</div>
                                </div>
                                <MdClose size={14} color="rgba(255,255,255,0.25)" style={{ cursor: 'pointer' }} onClick={() => setResources(prev => prev.filter((_, idx) => idx !== i))} />
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </motion.div>
                  )}

                  {activeTab === 'ai' && (
                    <motion.div key="ai" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} style={{ display: 'flex', flexDirection: 'column', height: '460px' }}>
                      {sectionLabel('AI Assistant')}
                      {sectionTitle('Team Knowledge Assistant')}

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {['How many members?', "What tasks are pending?", "Any deadlines?", "What files are shared?"].map((s, i) => (
                          <div key={i} onClick={() => sendAI(s)} style={{ padding: '4px 10px', backgroundColor: 'rgba(201,181,156,0.1)', border: '1px solid rgba(201,181,156,0.25)', borderRadius: '20px', fontSize: '10px', fontWeight: '300', color: '#C9B59C', cursor: 'pointer' }}
                            onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(201,181,156,0.2)'}
                            onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(201,181,156,0.1)'}
                          >
                            {s}
                          </div>
                        ))}
                      </div>

                      <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
                        {aiMessages.map((msg, i) => (
                          <div key={i} style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: msg.role === 'user' ? 'rgba(201,181,156,0.12)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.8)', lineHeight: '1.7', whiteSpace: 'pre-line', maxWidth: '85%', alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
                            {msg.text}
                          </div>
                        ))}
                        {isTyping && (
                          <div style={{ padding: '10px 14px', borderRadius: '10px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)', fontSize: '11px', color: 'rgba(255,255,255,0.4)', alignSelf: 'flex-start' }}>
                            Thinking...
                          </div>
                        )}
                      </div>

                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input value={aiInput} onChange={e => setAiInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && sendAI()} placeholder="Ask about your team..." style={inputStyle} />
                        <button onClick={() => sendAI()} style={btnStyle}>Send</button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'standups' && (
                    <motion.div key="standups" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                      {sectionLabel('Daily Standups')}
                      {sectionTitle(TODAY_LABEL)}

                      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
                        <input
                          value={newStandup}
                          onChange={e => setNewStandup(e.target.value)}
                          onKeyDown={e => e.key === 'Enter' && addStandup()}
                          placeholder="What did you work on today?"
                          style={inputStyle}
                        />
                        <button onClick={addStandup} style={btnStyle}>Post</button>
                      </div>

                      {todayStandups.length === 0
                        ? <p style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.3)' }}>No updates yet today. Be the first to post!</p>
                        : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {todayStandups.map((s, i) => (
                              <div key={i} style={{ backgroundColor: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', padding: '12px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                  <div style={avatarStyle(s.color)}>{s.avatar}</div>
                                  <div>
                                    <div style={{ fontSize: '11px', fontWeight: '400', color: 'white' }}>{s.member}</div>
                                    <div style={{ fontSize: '9px', fontWeight: '300', color: 'rgba(255,255,255,0.35)' }}>{s.time}</div>
                                  </div>
                                </div>
                                <p style={{ fontSize: '11px', fontWeight: '300', color: 'rgba(255,255,255,0.65)', lineHeight: '1.6' }}>{s.update}</p>
                              </div>
                            ))}
                          </div>
                        )
                      }
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              <div style={{ width: '190px', borderLeft: '1px solid rgba(255,255,255,0.08)', padding: '16px 12px', overflowY: 'auto', flexShrink: 0 }}>
                <p style={{ fontSize: '9px', fontWeight: '400', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>Team Members</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {members.map(m => (
                    <div
                      key={m.id}
                      onClick={() => { setActiveTab('tasks'); setSelectedMember(m) }}
                      style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', borderRadius: '8px', cursor: 'pointer', backgroundColor: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', transition: 'all 0.2s ease' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.08)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                    >
                      <div style={{ position: 'relative' }}>
                        <div style={avatarStyle(m.color)}>{m.avatar}</div>
                        <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '6px', height: '6px', borderRadius: '50%', backgroundColor: m.online ? '#6fcf97' : 'rgba(255,255,255,0.2)', border: '1.5px solid rgba(0,0,0,0.3)' }} />
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