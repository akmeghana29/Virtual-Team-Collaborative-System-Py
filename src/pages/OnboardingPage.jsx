import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiRequest } from '../services/api'

export default function OnboardingPage() {
  const navigate = useNavigate()
  const [teamName, setTeamName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!teamName.trim()) {
      setError('Please enter a team name.')
      return
    }

    setLoading(true)

    try {
      await apiRequest('/api/teams/', {
        method: 'POST',
        body: JSON.stringify({
          name: teamName.trim(),
          description: description.trim(),
        }),
      })

      navigate('/real-dashboard')
    } catch (err) {
      setError(err.message || 'Unable to create your team.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-900 p-8 shadow-xl"
      >
        <h1 className="mb-2 text-2xl font-bold text-white">
          Create your team
        </h1>

        <p className="mb-6 text-sm text-slate-400">
          Set up your workspace to get started.
        </p>

        <label className="mb-2 block text-sm text-slate-300">
          Team name
        </label>

        <input
          type="text"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          placeholder="Enter your team name"
          className="mb-5 w-full rounded-lg border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        <label className="mb-2 block text-sm text-slate-300">
          Description (optional)
        </label>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="What is your team working on?"
          rows={3}
          className="mb-5 w-full resize-none rounded-lg border border-white/10 bg-slate-800 px-4 py-3 text-white outline-none focus:border-blue-500"
        />

        {error && (
          <p className="mb-4 text-sm text-red-400">{error}</p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? 'Creating team...' : 'Create workspace'}
        </button>
      </form>
    </div>
  )
}