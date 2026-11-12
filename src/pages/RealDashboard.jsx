
import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import heroBg2 from '../assets/images/hero-bg2.jpg'
import { apiRequest } from '../services/api'
import {
  MdDashboard, MdTaskAlt, MdCalendarMonth, MdFolderShared,
  MdSmartToy, MdGroups, MdNotifications, MdSearch,
  MdKeyboardArrowRight, MdAdd, MdClose, MdCheckCircle,
  MdRadioButtonUnchecked, MdUpload
} from 'react-icons/md'

const TODAY = new Date()
const TODAY_LABEL = TODAY.toLocaleDateString('en-US', {
  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
})
const CURRENT_MONTH = TODAY.toLocaleDateString('en-US', {
  month: 'long', year: 'numeric'
})
const DAYS_IN_MONTH = new Date(
  TODAY.getFullYear(), TODAY.getMonth() + 1, 0
).getDate()
const FIRST_DAY_OFFSET = new Date(
  TODAY.getFullYear(), TODAY.getMonth(), 1
).getDay()

const COLORS = ['#C9B59C', '#526D82', '#9DB2BF', '#27374D', '#8a9ba8', '#b8a48c']

const normalizeMembers = (memberList) => {
  if (!Array.isArray(memberList)) return []

  return memberList.map((member, index) => {
    const name = member.name || member.full_name || 'Team Member'

    return {
      id: member.id,
      name,
      role: member.role || 'Member',
      avatar: name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      color: COLORS[index % COLORS.length],
      online: false,
      email: member.email,
    }
  })
}

const extractTaskList = (data) => {
  if (Array.isArray(data)) return data
  if (Array.isArray(data?.tasks)) return data.tasks
  if (Array.isArray(data?.data?.tasks)) return data.data.tasks
  if (Array.isArray(data?.data)) return data.data
  return []
}

const groupTasksByMember = (taskList) => {
  const groupedTasks = {}

  taskList.forEach(task => {
    const memberId = task.assigned_to ?? task.assignedTo
    if (memberId == null) return

    if (!groupedTasks[memberId]) groupedTasks[memberId] = []

    groupedTasks[memberId].push({
      id: task.id,
      name: task.name,
      deadline: task.deadline,
      done: Boolean(task.done ?? task.is_completed),
    })
  })

  return groupedTasks
}

const normalizeResources = (resourceList) => {
  if (!Array.isArray(resourceList)) return []

  return resourceList.map(resource => ({
    id: resource.id,
    name: resource.original_name || resource.filename || 'Uploaded file',
    size: `${(Number(resource.size || 0) / 1024).toFixed(0)} KB`,
    type: (
      resource.original_name || resource.filename || 'FILE'
    ).split('.').pop().toUpperCase(),
    by: resource.uploader?.name || 'Team member',
  }))
}

const groupDeadlinesByDay = (deadlineList) => {
  const grouped = {}

  deadlineList.forEach(deadline => {
    const date = new Date(deadline.due_date)

    if (
      Number.isNaN(date.getTime()) ||
      date.getFullYear() !== TODAY.getFullYear() ||
      date.getMonth() !== TODAY.getMonth()
    ) return

    const day = date.getDate()

    if (!grouped[day]) grouped[day] = []

    grouped[day].push({
      id: deadline.id,
      label: deadline.title,
      description: deadline.description || '',
    })
  })

  return grouped
}

const normalizeStandups = (standupList, members) => {
  if (!Array.isArray(standupList)) return []

  return standupList.map(standup => {
    const member = members.find(
      item => Number(item.id) === Number(standup.user_id)
    )

    const createdAt = standup.created_at
      ? new Date(standup.created_at)
      : new Date()

    return {
      id: standup.id,
      member: standup.user?.name || member?.name || 'Team Member',
      avatar: member?.avatar || 'TM',
      color: member?.color || '#526D82',
      time: createdAt.toLocaleString('en-US', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }),
      yesterday: standup.yesterday || '',
      update: standup.today || '',
      blockers: standup.blockers || '',
    }
  })
}

export default function RealDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [members, setMembers] = useState([])
  const [team, setTeam] = useState(null)
  const [loading, setLoading] = useState(true)
  const [dashboardError, setDashboardError] = useState('')

  const [memberError, setMemberError] = useState('')
  const [memberLoading, setMemberLoading] = useState(false)

  const [tasks, setTasks] = useState({})
  const [deadlines, setDeadlines] = useState({})
  const [deadlineError, setDeadlineError] = useState('')
  const [deadlineLoading, setDeadlineLoading] = useState(false)

  const [resources, setResources] = useState([])
  const [resourceError, setResourceError] = useState('')
  const [resourceLoading, setResourceLoading] = useState(false)

  const [standups, setStandups] = useState([])
  const [standupError, setStandupError] = useState('')
  const [standupLoading, setStandupLoading] = useState(false)

  const [newMember, setNewMember] = useState({ email: '' })
  const [newTask, setNewTask] = useState({
    memberId: '', name: '', deadline: ''
  })
  const [newDeadline, setNewDeadline] = useState({
    day: '', label: '', description: ''
  })
  const [newStandup, setNewStandup] = useState({
    yesterday: '',
    today: '',
    blockers: '',
  })

  const [selectedMember, setSelectedMember] = useState(null)
  const [selectedDay, setSelectedDay] = useState(null)
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'assistant',
      text: "Hello! I'm your Team Knowledge Assistant. Ask me about team members, tasks, deadlines, or resources."
    }
  ])
  const [isTyping, setIsTyping] = useState(false)

  const loadMembers = async () => {
    const memberData = await apiRequest('/api/members/')
    const memberList =
      memberData.members ||
      memberData.data?.members ||
      memberData.data ||
      []

    const normalizedMembers = normalizeMembers(memberList)
    setMembers(normalizedMembers)
    return normalizedMembers
  }

  const loadTasks = async (teamId) => {
    const taskData = await apiRequest(`/api/tasks/${teamId}`)
    setTasks(groupTasksByMember(extractTaskList(taskData)))
  }

  const loadResources = async (teamId) => {
    const resourceData = await apiRequest(`/api/resources/${teamId}`)
    const resourceList =
      resourceData.resources ||
      resourceData.data?.resources ||
      resourceData.data ||
      []

    setResources(normalizeResources(resourceList))
  }

  const loadDeadlines = async (teamId) => {
    const deadlineData = await apiRequest(`/api/deadlines/${teamId}`)
    const deadlineList =
      deadlineData.deadlines ||
      deadlineData.data?.deadlines ||
      deadlineData.data ||
      []

    setDeadlines(groupDeadlinesByDay(deadlineList))
  }

  const loadStandups = async (teamId, memberList = members) => {
    const standupData = await apiRequest(`/api/standups/${teamId}`)
    const standupList =
      standupData.standups ||
      standupData.data?.standups ||
      []

    setStandups(normalizeStandups(standupList, memberList))
  }

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        setLoading(true)
        setDashboardError('')

        const teamData = await apiRequest('/api/teams/my-team')
        const currentTeam =
          teamData.team ||
          teamData.data?.team ||
          teamData.data ||
          teamData

        if (!currentTeam?.id) {
          throw new Error('No team found. Please create a team first.')
        }

        setTeam(currentTeam)

        const loadedMembers = await loadMembers()
        await loadTasks(currentTeam.id)
        await loadResources(currentTeam.id)
        await loadDeadlines(currentTeam.id)
        await loadStandups(currentTeam.id, loadedMembers)
      } catch (error) {
        setDashboardError(
          error.message || 'Unable to load team information.'
        )
      } finally {
        setLoading(false)
      }
    }

    loadTeamData()
  }, [])

  const navItems = [
    { id: 'overview', icon: <MdDashboard size={20} />, label: 'Overview' },
    { id: 'tasks', icon: <MdTaskAlt size={20} />, label: 'Tasks' },
    { id: 'calendar', icon: <MdCalendarMonth size={20} />, label: 'Calendar' },
    { id: 'resources', icon: <MdFolderShared size={20} />, label: 'Resources' },
    { id: 'ai', icon: <MdSmartToy size={20} />, label: 'AI Assistant' },
    { id: 'standups', icon: <MdGroups size={20} />, label: 'Standups' },
  ]

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

  const inputStyle = {
    flex: 1,
    padding: '7px 10px',
    backgroundColor: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '6px',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: '300',
    color: 'white',
    outline: 'none',
  }

  const btnStyle = {
    padding: '7px 14px',
    backgroundColor: '#C9B59C',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontFamily: 'Poppins, sans-serif',
    fontSize: '11px',
    fontWeight: '400',
    color: '#27374D',
    flexShrink: 0,
  }

  const sectionLabel = (text) => (
    <p style={{
      fontSize: '9px',
      fontWeight: '500',
      color: '#C9B59C',
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: '4px'
    }}>
      {text}
    </p>
  )

  const sectionTitle = (text) => (
    <h2 style={{
      fontFamily: '"Bodoni Moda", Georgia, serif',
      fontSize: '19px',
      fontWeight: '400',
      color: 'white',
      marginBottom: '14px'
    }}>
      {text}
    </h2>
  )

  const addMember = async () => {
    const email = newMember.email.trim().toLowerCase()

    if (!email) {
      setMemberError('Please enter an email address.')
      return
    }

    try {
      setMemberLoading(true)
      setMemberError('')

      await apiRequest('/api/members/invite', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })

      await loadMembers()
      setNewMember({ email: '' })
      alert('Member added successfully!')
    } catch (error) {
      setMemberError(error.message || 'Unable to add member.')
    } finally {
      setMemberLoading(false)
    }
  }

  const addTask = async () => {
    if (!newTask.name.trim() || !newTask.memberId || !newTask.deadline) {
      return
    }

    try {
      const deadline = new Date(newTask.deadline)

      if (Number.isNaN(deadline.getTime())) {
        throw new Error('Please select a valid deadline.')
      }

      await apiRequest('/api/tasks/', {
        method: 'POST',
        body: JSON.stringify({
          name: newTask.name.trim(),
          assignedTo: Number(newTask.memberId),
          deadline: deadline.toISOString(),
        }),
      })

      await loadTasks(team.id)
      setNewTask({ memberId: '', name: '', deadline: '' })
    } catch (error) {
      alert(error.message || 'Unable to create task.')
    }
  }

  const toggleTask = async (memberId, taskId) => {
    const task = (tasks[memberId] || []).find(t => t.id === taskId)
    if (!task || task.done) return

    try {
      await apiRequest(`/api/tasks/${taskId}/complete`, {
        method: 'PATCH',
      })

      setTasks(prev => ({
        ...prev,
        [memberId]: prev[memberId].map(t =>
          t.id === taskId ? { ...t, done: true } : t
        ),
      }))
    } catch (error) {
      alert(error.message || 'Unable to complete task.')
    }
  }

  const addDeadline = async () => {
    if (!newDeadline.day || !newDeadline.label.trim()) {
      setDeadlineError('Please enter a day and deadline title.')
      return
    }

    const day = parseInt(newDeadline.day, 10)

    if (!Number.isInteger(day) || day < 1 || day > DAYS_IN_MONTH) {
      setDeadlineError(
        `Please enter a valid day between 1 and ${DAYS_IN_MONTH}.`
      )
      return
    }

    try {
      setDeadlineLoading(true)
      setDeadlineError('')

      const dueDate = new Date(
        TODAY.getFullYear(),
        TODAY.getMonth(),
        day,
        12,
        0,
        0
      )

      await apiRequest('/api/deadlines/', {
        method: 'POST',
        body: JSON.stringify({
          title: newDeadline.label.trim(),
          due_date: dueDate.toISOString(),
          description: newDeadline.description.trim(),
        }),
      })

      await loadDeadlines(team.id)

      setNewDeadline({ day: '', label: '', description: '' })
      setSelectedDay(day)
    } catch (error) {
      setDeadlineError(error.message || 'Unable to add deadline.')
    } finally {
      setDeadlineLoading(false)
    }
  }

  const handleFileUpload = async (event) => {
    const selectedFiles = Array.from(event.target.files || [])
    event.target.value = ''

    if (!selectedFiles.length) return

    try {
      setResourceLoading(true)
      setResourceError('')

      for (const file of selectedFiles) {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('teamId', String(team.id))

        await apiRequest('/api/resources/upload', {
          method: 'POST',
          body: formData,
        })
      }

      await loadResources(team.id)
    } catch (error) {
      setResourceError(error.message || 'Unable to upload file.')

      try {
        await loadResources(team.id)
      } catch {
        // Preserve the original upload error.
      }
    } finally {
      setResourceLoading(false)
    }
  }

  const deleteResource = async (resourceId) => {
    try {
      setResourceError('')

      await apiRequest(`/api/resources/${resourceId}`, {
        method: 'DELETE',
      })

      await loadResources(team.id)
    } catch (error) {
      setResourceError(error.message || 'Unable to delete file.')
    }
  }

  const addStandup = async () => {
    if (
      !newStandup.yesterday.trim() ||
      !newStandup.today.trim()
    ) {
      setStandupError("Please fill in both yesterday's and today's updates.")
      return
    }

    try {
      setStandupLoading(true)
      setStandupError('')

      await apiRequest('/api/standups/', {
        method: 'POST',
        body: JSON.stringify({
          yesterday: newStandup.yesterday.trim(),
          today: newStandup.today.trim(),
          blockers: newStandup.blockers.trim(),
        }),
      })

      await loadStandups(team.id)

      setNewStandup({
        yesterday: '',
        today: '',
        blockers: '',
      })
    } catch (error) {
      setStandupError(error.message || 'Unable to submit standup.')
    } finally {
      setStandupLoading(false)
    }
  }

  const getAIResponse = (input) => {
    const q = input.toLowerCase()

    if (q.includes('member') || q.includes('team')) {
      return `Your team currently has ${members.length} member${members.length !== 1 ? 's' : ''}:\n\n${members.map(m => `• ${m.name} — ${m.role}`).join('\n')}`
    }

    if (q.includes('task') || q.includes('work')) {
      const total = Object.values(tasks).flat().length
      const done = Object.values(tasks).flat().filter(t => t.done).length

      return `Total tasks across the team: ${total}\nCompleted: ${done}\nPending: ${total - done}`
    }

    if (q.includes('deadline') || q.includes('due') || q.includes('calendar')) {
      const total = Object.values(deadlines).flat().length
      return `You have ${total} deadline${total !== 1 ? 's' : ''} marked on the calendar.`
    }

    if (q.includes('file') || q.includes('resource') || q.includes('document')) {
      return `${resources.length} shared files:\n\n${resources.map(r => `• ${r.name} (${r.size})`).join('\n') || 'No files uploaded yet.'}`
    }

    if (q.includes('standup') || q.includes('progress') || q.includes('today')) {
      return `${standups.length} standup update${standups.length !== 1 ? 's' : ''} submitted by your team.`
    }

    return `I can help you with:\n\n• "How many members are in the team?"\n• "What tasks are pending?"\n• "How many deadlines are marked?"\n• "What files are shared?"\n• "What are the standup updates?"`
  }

  const sendAI = (override) => {
    const text = override || aiInput
    if (!text.trim()) return

    setAiMessages(prev => [...prev, { role: 'user', text }])
    setAiInput('')
    setIsTyping(true)

    setTimeout(() => {
      setAiMessages(prev => [
        ...prev,
        { role: 'assistant', text: getAIResponse(text) }
      ])
      setIsTyping(false)
    }, 600)
  }

  const completedTasks = Object.values(tasks).flat().filter(t => t.done).length
  const totalTasks = Object.values(tasks).flat().length
  const totalDeadlines = Object.values(deadlines).flat().length

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0f1623',
        color: 'white',
        fontFamily: 'Poppins, sans-serif',
        fontSize: '14px',
      }}>
        Loading your workspace...
      </div>
    )
  }

  if (dashboardError) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '12px',
        backgroundColor: '#0f1623',
        color: 'white',
        fontFamily: 'Poppins, sans-serif',
      }}>
        <p>{dashboardError}</p>
        <button onClick={() => window.location.reload()} style={btnStyle}>
          Retry
        </button>
      </div>
    )
  }

  return (
    <div style={{
      width: '100vw',
      height: '100vh',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: 'Poppins, sans-serif'
    }}>
      <img
        src={heroBg2}
        alt=""
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover'
        }}
      />

      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(10,16,28,0.55)'
      }} />

      <div style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px'
      }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 16 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          style={{
            width: '900px',
            height: '650px',
            background: 'rgba(15,22,35,0.85)',
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '18px',
            boxShadow: '0 40px 100px rgba(0,0,0,0.6)',
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
              <div style={{
                fontFamily: '"Bodoni Moda", Georgia, serif',
                fontSize: '16px',
                fontWeight: '400',
                color: 'white',
                letterSpacing: '0.04em'
              }}>
                Teams
              </div>

              <div style={{
                width: '1px',
                height: '14px',
                backgroundColor: 'rgba(255,255,255,0.15)'
              }} />

              <div style={{
                fontSize: '11px',
                fontWeight: '300',
                color: 'rgba(255,255,255,0.5)',
                letterSpacing: '0.06em'
              }}>
                {team?.name || 'My Workspace'}
              </div>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              backgroundColor: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '8px',
              padding: '6px 12px',
              width: '180px'
            }}>
              <MdSearch size={13} color="rgba(255,255,255,0.4)" />
              <input
                placeholder="Search..."
                style={{
                  background: 'none',
                  border: 'none',
                  outline: 'none',
                  fontFamily: 'Poppins, sans-serif',
                  fontSize: '11px',
                  fontWeight: '300',
                  color: 'white',
                  width: '100%'
                }}
              />
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px'
            }}>
              <div style={{ position: 'relative', cursor: 'pointer' }}>
                <MdNotifications size={18} color="rgba(255,255,255,0.6)" />
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  backgroundColor: '#C9B59C'
                }} />
              </div>

              <div style={{
                ...avatarStyle('#C9B59C'),
                width: '30px',
                height: '30px',
                fontSize: '10px',
                cursor: 'pointer'
              }}>
                RS
              </div>
            </div>
          </div>

          <div style={{
            display: 'flex',
            flex: 1,
            overflow: 'hidden'
          }}>
            <div style={{
              width: '48px',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              paddingTop: '12px',
              gap: '4px',
              flexShrink: 0
            }}>
              {navItems.map(item => (
                <div
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id)
                    setSelectedMember(null)
                    setSelectedDay(null)
                  }}
                  title={item.label}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    backgroundColor: activeTab === item.id
                      ? 'rgba(201,181,156,0.2)'
                      : 'transparent',
                    color: activeTab === item.id
                      ? '#C9B59C'
                      : 'rgba(255,255,255,0.4)',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {item.icon}
                </div>
              ))}
            </div>

            <div style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex'
            }}>
              <div style={{
                flex: 1,
                overflowY: 'auto',
                padding: '16px 20px'
              }}>
                <AnimatePresence mode="wait">

                  {activeTab === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sectionLabel("Today's Overview")}
                      {sectionTitle(`${team?.name || 'My Workspace'} — ${CURRENT_MONTH}`)}

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 1fr',
                        gap: '10px',
                        marginBottom: '20px'
                      }}>
                        {[
                          { label: 'Tasks Completed', value: `${completedTasks} / ${totalTasks}` },
                          { label: 'Total Members', value: members.length },
                          { label: 'Deadlines Marked', value: totalDeadlines },
                          { label: 'Files Shared', value: resources.length },
                        ].map((item, index) => (
                          <div key={index} style={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '10px',
                            padding: '12px 16px'
                          }}>
                            <div style={{
                              fontSize: '10px',
                              fontWeight: '300',
                              color: 'rgba(255,255,255,0.4)',
                              marginBottom: '4px'
                            }}>
                              {item.label}
                            </div>
                            <div style={{
                              fontSize: '22px',
                              fontWeight: '300',
                              color: 'white'
                            }}>
                              {item.value}
                            </div>
                          </div>
                        ))}
                      </div>

                      {sectionLabel('Add New Member')}
                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        marginBottom: '6px'
                      }}>
                        <input
                          type="email"
                          placeholder="Registered user's email address"
                          value={newMember.email}
                          onChange={e => {
                            setNewMember({ email: e.target.value })
                            setMemberError('')
                          }}
                          onKeyDown={e => e.key === 'Enter' && addMember()}
                          style={inputStyle}
                        />

                        <button
                          onClick={addMember}
                          disabled={memberLoading}
                          style={{
                            ...btnStyle,
                            opacity: memberLoading ? 0.6 : 1
                          }}
                        >
                          {memberLoading ? 'Adding...' : <MdAdd size={14} />}
                        </button>
                      </div>

                      {memberError ? (
                        <p style={{
                          fontSize: '10px',
                          color: '#ff8b8b',
                          marginBottom: '16px'
                        }}>
                          {memberError}
                        </p>
                      ) : (
                        <p style={{
                          fontSize: '9px',
                          color: 'rgba(255,255,255,0.35)',
                          marginBottom: '16px'
                        }}>
                          Only users who have already registered can be added.
                        </p>
                      )}

                      {sectionLabel("Today's Standups")}
                      {standups.length === 0 ? (
                        <p style={{
                          fontSize: '11px',
                          fontWeight: '300',
                          color: 'rgba(255,255,255,0.3)',
                          marginBottom: '8px'
                        }}>
                          No standups submitted yet.
                        </p>
                      ) : standups.slice(0, 3).map(standup => (
                        <div key={standup.id} style={{
                          backgroundColor: 'rgba(255,255,255,0.04)',
                          border: '1px solid rgba(255,255,255,0.07)',
                          borderRadius: '8px',
                          padding: '10px 14px',
                          marginBottom: '6px'
                        }}>
                          <div style={{
                            fontSize: '10px',
                            color: 'rgba(255,255,255,0.4)',
                            marginBottom: '4px'
                          }}>
                            {standup.member} · {standup.time}
                          </div>
                          <p style={{
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.75)',
                            lineHeight: '1.6'
                          }}>
                            {standup.update}
                          </p>
                        </div>
                      ))}
                    </motion.div>
                  )}

                  {activeTab === 'tasks' && (
                    <motion.div
                      key="tasks"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sectionLabel('Task Board')}
                      {sectionTitle(
                        selectedMember
                          ? `${selectedMember.name}'s Tasks`
                          : 'Select a Member'
                      )}

                      {!selectedMember && (
                        <>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            marginBottom: '20px'
                          }}>
                            {members.map(member => (
                              <div
                                key={member.id}
                                onClick={() => setSelectedMember(member)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  backgroundColor: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  borderRadius: '8px',
                                  padding: '10px 14px',
                                  cursor: 'pointer'
                                }}
                              >
                                <div style={avatarStyle(member.color)}>
                                  {member.avatar}
                                </div>

                                <div style={{ flex: 1 }}>
                                  <div style={{
                                    fontSize: '11px',
                                    color: 'white'
                                  }}>
                                    {member.name}
                                  </div>
                                  <div style={{
                                    fontSize: '10px',
                                    color: 'rgba(255,255,255,0.4)'
                                  }}>
                                    {member.role} · {(tasks[member.id] || []).length} tasks
                                  </div>
                                </div>

                                <MdKeyboardArrowRight
                                  size={15}
                                  color="rgba(255,255,255,0.3)"
                                />
                              </div>
                            ))}
                          </div>

                          {sectionLabel('Add Task')}
                          <div style={{
                            display: 'flex',
                            gap: '6px',
                            flexWrap: 'wrap'
                          }}>
                            <select
                              value={newTask.memberId}
                              onChange={e => setNewTask({
                                ...newTask,
                                memberId: e.target.value
                              })}
                              style={{
                                ...inputStyle,
                                flex: 'none',
                                width: '140px'
                              }}
                            >
                              <option value="" style={{ backgroundColor: '#1a2535' }}>
                                Select Member
                              </option>
                              {members.map(member => (
                                <option
                                  key={member.id}
                                  value={member.id}
                                  style={{ backgroundColor: '#1a2535' }}
                                >
                                  {member.name}
                                </option>
                              ))}
                            </select>

                            <input
                              placeholder="Task name"
                              value={newTask.name}
                              onChange={e => setNewTask({
                                ...newTask,
                                name: e.target.value
                              })}
                              style={inputStyle}
                            />

                            <input
                              type="datetime-local"
                              value={newTask.deadline}
                              onChange={e => setNewTask({
                                ...newTask,
                                deadline: e.target.value
                              })}
                              style={{
                                ...inputStyle,
                                flex: 'none',
                                width: '180px',
                                colorScheme: 'dark'
                              }}
                            />

                            <button onClick={addTask} style={btnStyle}>
                              <MdAdd size={14} />
                            </button>
                          </div>
                        </>
                      )}

                      {selectedMember && (
                        <>
                          <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '6px',
                            marginBottom: '14px'
                          }}>
                            {(tasks[selectedMember.id] || []).length === 0 ? (
                              <p style={{
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.35)'
                              }}>
                                No tasks added yet for {selectedMember.name}.
                              </p>
                            ) : (tasks[selectedMember.id] || []).map(task => (
                              <div
                                key={task.id}
                                onClick={() => toggleTask(selectedMember.id, task.id)}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '10px',
                                  backgroundColor: 'rgba(255,255,255,0.04)',
                                  border: '1px solid rgba(255,255,255,0.08)',
                                  borderRadius: '8px',
                                  padding: '10px 14px',
                                  cursor: task.done ? 'default' : 'pointer'
                                }}
                              >
                                {task.done ? (
                                  <MdCheckCircle size={16} color="#C9B59C" />
                                ) : (
                                  <MdRadioButtonUnchecked
                                    size={16}
                                    color="rgba(255,255,255,0.3)"
                                  />
                                )}

                                <span style={{
                                  flex: 1,
                                  fontSize: '11px',
                                  color: task.done
                                    ? 'rgba(255,255,255,0.35)'
                                    : 'rgba(255,255,255,0.85)',
                                  textDecoration: task.done ? 'line-through' : 'none'
                                }}>
                                  {task.name}
                                </span>

                                <span style={{
                                  fontSize: '10px',
                                  color: 'rgba(255,255,255,0.35)'
                                }}>
                                  Due {new Date(task.deadline).toLocaleString()}
                                </span>
                              </div>
                            ))}
                          </div>

                          <button
                            onClick={() => setSelectedMember(null)}
                            style={{
                              background: 'none',
                              border: '1px solid rgba(255,255,255,0.15)',
                              borderRadius: '6px',
                              padding: '6px 14px',
                              color: 'rgba(255,255,255,0.5)',
                              fontFamily: 'Poppins, sans-serif',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            ← Back
                          </button>
                        </>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'calendar' && (
                    <motion.div
                      key="calendar"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sectionLabel('Calendar')}
                      {sectionTitle(CURRENT_MONTH)}

                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '3px',
                        marginBottom: '14px'
                      }}>
                        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                          <div key={day} style={{
                            textAlign: 'center',
                            fontSize: '9px',
                            color: 'rgba(255,255,255,0.3)',
                            padding: '4px 0'
                          }}>
                            {day}
                          </div>
                        ))}

                        {Array.from({ length: FIRST_DAY_OFFSET }).map((_, index) => (
                          <div key={`e-${index}`} />
                        ))}

                        {Array.from(
                          { length: DAYS_IN_MONTH },
                          (_, index) => index + 1
                        ).map(day => {
                          const hasDeadline = Boolean(deadlines[day]?.length)
                          const isToday = day === TODAY.getDate()

                          return (
                            <div
                              key={day}
                              onClick={() => hasDeadline && setSelectedDay(
                                selectedDay === day ? null : day
                              )}
                              style={{
                                textAlign: 'center',
                                padding: '6px 2px',
                                borderRadius: '5px',
                                fontSize: '11px',
                                cursor: hasDeadline ? 'pointer' : 'default',
                                backgroundColor: selectedDay === day
                                  ? 'rgba(201,181,156,0.2)'
                                  : isToday
                                    ? 'rgba(201,181,156,0.15)'
                                    : hasDeadline
                                      ? 'rgba(220,80,80,0.1)'
                                      : 'transparent',
                                color: hasDeadline
                                  ? '#ff7b7b'
                                  : isToday
                                    ? '#C9B59C'
                                    : 'rgba(255,255,255,0.6)',
                                border: hasDeadline
                                  ? '1px solid rgba(220,80,80,0.3)'
                                  : isToday
                                    ? '1px solid rgba(201,181,156,0.4)'
                                    : '1px solid transparent',
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
                              borderRadius: '10px',
                              padding: '14px 16px',
                              overflow: 'hidden',
                              marginBottom: '14px'
                            }}
                          >
                            {sectionLabel(
                              `Deadlines — ${CURRENT_MONTH.split(' ')[0]} ${selectedDay}`
                            )}

                            {deadlines[selectedDay].map((deadline, index) => (
                              <div key={deadline.id || index} style={{
                                marginBottom: '6px'
                              }}>
                                <div style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '8px'
                                }}>
                                  <div style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    backgroundColor: '#ff7b7b'
                                  }} />
                                  <span style={{
                                    fontSize: '11px',
                                    color: 'rgba(255,255,255,0.8)'
                                  }}>
                                    {deadline.label}
                                  </span>
                                </div>

                                {deadline.description && (
                                  <p style={{
                                    fontSize: '10px',
                                    color: 'rgba(255,255,255,0.35)',
                                    marginLeft: '13px'
                                  }}>
                                    {deadline.description}
                                  </p>
                                )}
                              </div>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {sectionLabel('Add Deadline')}

                      <div style={{
                        display: 'flex',
                        gap: '6px',
                        flexWrap: 'wrap'
                      }}>
                        <input
                          type="number"
                          placeholder="Day"
                          min="1"
                          max={DAYS_IN_MONTH}
                          value={newDeadline.day}
                          onChange={e => setNewDeadline({
                            ...newDeadline,
                            day: e.target.value
                          })}
                          style={{
                            ...inputStyle,
                            flex: 'none',
                            width: '75px'
                          }}
                        />

                        <input
                          placeholder="Deadline title"
                          value={newDeadline.label}
                          onChange={e => setNewDeadline({
                            ...newDeadline,
                            label: e.target.value
                          })}
                          style={inputStyle}
                        />

                        <input
                          placeholder="Description (optional)"
                          value={newDeadline.description}
                          onChange={e => setNewDeadline({
                            ...newDeadline,
                            description: e.target.value
                          })}
                          style={inputStyle}
                        />

                        <button
                          onClick={addDeadline}
                          disabled={deadlineLoading}
                          style={{
                            ...btnStyle,
                            opacity: deadlineLoading ? 0.6 : 1
                          }}
                        >
                          {deadlineLoading ? 'Saving...' : <MdAdd size={14} />}
                        </button>
                      </div>

                      {deadlineError && (
                        <p style={{
                          fontSize: '10px',
                          color: '#ff8b8b',
                          marginTop: '8px'
                        }}>
                          {deadlineError}
                        </p>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'resources' && (
                    <motion.div
                      key="resources"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sectionLabel('Resources')}
                      {sectionTitle('Shared Files')}

                      <div style={{ marginBottom: '16px' }}>
                        <label style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 14px',
                          backgroundColor: 'rgba(201,181,156,0.1)',
                          border: '1px dashed rgba(201,181,156,0.4)',
                          borderRadius: '8px',
                          cursor: resourceLoading ? 'wait' : 'pointer',
                          fontSize: '11px',
                          color: '#C9B59C',
                          opacity: resourceLoading ? 0.6 : 1
                        }}>
                          <MdUpload size={16} />
                          {resourceLoading ? 'Uploading files...' : 'Click to upload files'}
                          <input
                            type="file"
                            multiple
                            disabled={resourceLoading}
                            onChange={handleFileUpload}
                            style={{ display: 'none' }}
                          />
                        </label>
                      </div>

                      {resourceError && (
                        <p style={{
                          fontSize: '10px',
                          color: '#ff8b8b',
                          marginBottom: '12px'
                        }}>
                          {resourceError}
                        </p>
                      )}

                      {resources.length === 0 ? (
                        <p style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.3)'
                        }}>
                          No files uploaded yet.
                        </p>
                      ) : (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px'
                        }}>
                          {resources.map(resource => (
                            <div
                              key={resource.id}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '8px',
                                padding: '10px 14px'
                              }}
                            >
                              <div style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(201,181,156,0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '8px',
                                color: '#C9B59C'
                              }}>
                                {resource.type}
                              </div>

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: '11px',
                                  color: 'rgba(255,255,255,0.85)',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap'
                                }}>
                                  {resource.name}
                                </div>

                                <div style={{
                                  fontSize: '9px',
                                  color: 'rgba(255,255,255,0.35)'
                                }}>
                                  {resource.size} · {resource.by}
                                </div>
                              </div>

                              <MdClose
                                size={14}
                                color="rgba(255,255,255,0.4)"
                                title="Delete file"
                                style={{ cursor: 'pointer', flexShrink: 0 }}
                                onClick={() => deleteResource(resource.id)}
                              />
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {activeTab === 'ai' && (
                    <motion.div
                      key="ai"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        height: '460px'
                      }}
                    >
                      {sectionLabel('AI Assistant')}
                      {sectionTitle('Team Knowledge Assistant')}

                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '10px'
                      }}>
                        {[
                          'How many members?',
                          'What tasks are pending?',
                          'Any deadlines?',
                          'What files are shared?'
                        ].map((suggestion, index) => (
                          <div
                            key={index}
                            onClick={() => sendAI(suggestion)}
                            style={{
                              padding: '4px 10px',
                              backgroundColor: 'rgba(201,181,156,0.1)',
                              border: '1px solid rgba(201,181,156,0.25)',
                              borderRadius: '20px',
                              fontSize: '10px',
                              color: '#C9B59C',
                              cursor: 'pointer'
                            }}
                          >
                            {suggestion}
                          </div>
                        ))}
                      </div>

                      <div style={{
                        flex: 1,
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '10px'
                      }}>
                        {aiMessages.map((message, index) => (
                          <div
                            key={index}
                            style={{
                              padding: '10px 14px',
                              borderRadius: '10px',
                              backgroundColor: message.role === 'user'
                                ? 'rgba(201,181,156,0.12)'
                                : 'rgba(255,255,255,0.05)',
                              border: '1px solid rgba(255,255,255,0.07)',
                              fontSize: '11px',
                              color: 'rgba(255,255,255,0.8)',
                              lineHeight: '1.7',
                              whiteSpace: 'pre-line',
                              maxWidth: '85%',
                              alignSelf: message.role === 'user'
                                ? 'flex-end'
                                : 'flex-start'
                            }}
                          >
                            {message.text}
                          </div>
                        ))}

                        {isTyping && (
                          <div style={{
                            padding: '10px 14px',
                            borderRadius: '10px',
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.07)',
                            fontSize: '11px',
                            color: 'rgba(255,255,255,0.4)',
                            alignSelf: 'flex-start'
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
                          placeholder="Ask about your team..."
                          style={inputStyle}
                        />

                        <button onClick={() => sendAI()} style={btnStyle}>
                          Send
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === 'standups' && (
                    <motion.div
                      key="standups"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                    >
                      {sectionLabel('Daily Standups')}
                      {sectionTitle(TODAY_LABEL)}

                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '8px',
                        marginBottom: '10px'
                      }}>
                        <textarea
                          value={newStandup.yesterday}
                          onChange={e => setNewStandup({
                            ...newStandup,
                            yesterday: e.target.value
                          })}
                          placeholder="What did you work on yesterday?"
                          rows={2}
                          style={{
                            ...inputStyle,
                            resize: 'vertical',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        />

                        <textarea
                          value={newStandup.today}
                          onChange={e => setNewStandup({
                            ...newStandup,
                            today: e.target.value
                          })}
                          placeholder="What are you working on today?"
                          rows={2}
                          style={{
                            ...inputStyle,
                            resize: 'vertical',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        />

                        <textarea
                          value={newStandup.blockers}
                          onChange={e => setNewStandup({
                            ...newStandup,
                            blockers: e.target.value
                          })}
                          placeholder="Any blockers? (Optional)"
                          rows={2}
                          style={{
                            ...inputStyle,
                            resize: 'vertical',
                            width: '100%',
                            boxSizing: 'border-box'
                          }}
                        />

                        <button
                          onClick={addStandup}
                          disabled={standupLoading}
                          style={{
                            ...btnStyle,
                            alignSelf: 'flex-end',
                            opacity: standupLoading ? 0.6 : 1
                          }}
                        >
                          {standupLoading ? 'Submitting...' : 'Submit Standup'}
                        </button>
                      </div>

                      {standupError && (
                        <p style={{
                          fontSize: '10px',
                          color: '#ff8b8b',
                          marginBottom: '12px'
                        }}>
                          {standupError}
                        </p>
                      )}

                      {sectionLabel('Team Updates')}

                      {standups.length === 0 ? (
                        <p style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.3)'
                        }}>
                          No standup updates submitted yet.
                        </p>
                      ) : (
                        <div style={{
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}>
                          {standups.map(standup => (
                            <div
                              key={standup.id}
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.04)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: '10px',
                                padding: '12px 16px'
                              }}
                            >
                              <div style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '10px'
                              }}>
                                <div style={avatarStyle(standup.color)}>
                                  {standup.avatar}
                                </div>

                                <div>
                                  <div style={{
                                    fontSize: '11px',
                                    color: 'white'
                                  }}>
                                    {standup.member}
                                  </div>

                                  <div style={{
                                    fontSize: '9px',
                                    color: 'rgba(255,255,255,0.35)'
                                  }}>
                                    {standup.time}
                                  </div>
                                </div>
                              </div>

                              <p style={{
                                fontSize: '10px',
                                color: '#C9B59C',
                                marginBottom: '3px'
                              }}>
                                Yesterday
                              </p>
                              <p style={{
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: '1.6',
                                marginBottom: '8px'
                              }}>
                                {standup.yesterday}
                              </p>

                              <p style={{
                                fontSize: '10px',
                                color: '#C9B59C',
                                marginBottom: '3px'
                              }}>
                                Today
                              </p>
                              <p style={{
                                fontSize: '11px',
                                color: 'rgba(255,255,255,0.7)',
                                lineHeight: '1.6',
                                marginBottom: '8px'
                              }}>
                                {standup.update}
                              </p>

                              {standup.blockers && (
                                <>
                                  <p style={{
                                    fontSize: '10px',
                                    color: '#C9B59C',
                                    marginBottom: '3px'
                                  }}>
                                    Blockers
                                  </p>
                                  <p style={{
                                    fontSize: '11px',
                                    color: 'rgba(255,255,255,0.7)',
                                    lineHeight: '1.6'
                                  }}>
                                    {standup.blockers}
                                  </p>
                                </>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                </AnimatePresence>
              </div>

              <div style={{
                width: '190px',
                borderLeft: '1px solid rgba(255,255,255,0.08)',
                padding: '16px 12px',
                overflowY: 'auto',
                flexShrink: 0
              }}>
                <p style={{
                  fontSize: '9px',
                  color: 'rgba(255,255,255,0.35)',
                  letterSpacing: '0.15em',
                  textTransform: 'uppercase',
                  marginBottom: '12px'
                }}>
                  Team Members
                </p>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  {members.map(member => (
                    <div
                      key={member.id}
                      onClick={() => {
                        setActiveTab('tasks')
                        setSelectedMember(member)
                      }}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 10px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <div style={{ position: 'relative' }}>
                        <div style={avatarStyle(member.color)}>
                          {member.avatar}
                        </div>
                        <div style={{
                          position: 'absolute',
                          bottom: '1px',
                          right: '1px',
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          border: '1.5px solid rgba(0,0,0,0.3)'
                        }} />
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: '10px',
                          color: 'rgba(255,255,255,0.8)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {member.name}
                        </div>

                        <div style={{
                          fontSize: '9px',
                          color: 'rgba(255,255,255,0.35)',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis'
                        }}>
                          {member.role}
                        </div>
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
