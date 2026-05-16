'use client'

import { buildMetadata } from '@/lib/seo'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

// Note: metadata doesn't work with 'use client', define it via an RSC wrapper or layout
// export const metadata = buildMetadata({...})

interface Session {
  id: string
  userAgent: string
  ipAddress: string
  createdAt: string
  lastActiveAt: string
  isCurrent: boolean
}

export default function SessionsPage() {
  const router = useRouter()
  const [sessions, setSessions] = useState<Session[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // TODO: Fetch sessions from API
    // Replace with your actual tRPC procedure call
    setIsLoading(false)
  }, [])

  const handleRevokeSession = async (sessionId: string) => {
    // TODO: Call API to revoke session
    // Replace with your actual tRPC procedure call
    setSessions((prev) => prev.filter((s) => s.id !== sessionId))
  }

  const handleRevokeAll = async () => {
    if (!confirm('Are you sure? This will log you out of all other devices.')) return
    // TODO: Call API to revoke all sessions
    router.push('/login')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 px-4 py-20">
        <div className="max-w-2xl mx-auto">
          <p className="text-neutral-600">Loading sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-20">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-neutral-900">Active Sessions</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <p className="text-neutral-600">No active sessions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <p className="text-sm text-neutral-600 mb-2">
                      {session.userAgent || 'Unknown Device'}
                    </p>
                    <p className="text-xs text-neutral-500 mb-2">
                      IP: {session.ipAddress || 'Unknown'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Last active: {new Date(session.lastActiveAt).toLocaleDateString()}
                    </p>
                  </div>
                  {session.isCurrent && (
                    <span className="inline-block bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full">
                      Current
                    </span>
                  )}
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-sm text-red-600 hover:text-red-700 font-medium"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleRevokeAll}
              className="w-full mt-6 px-4 py-2 border border-red-300 text-red-600 font-medium rounded-lg hover:bg-red-50 transition"
            >
              Revoke All Other Sessions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
