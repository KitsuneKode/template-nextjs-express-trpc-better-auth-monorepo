'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { buildMetadata } from '@/lib/seo'

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
        <div className="mx-auto max-w-2xl">
          <p className="text-neutral-600">Loading sessions...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 px-4 py-20">
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-8 text-3xl font-bold text-neutral-900">Active Sessions</h1>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {sessions.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm">
            <p className="text-neutral-600">No active sessions found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sessions.map((session) => (
              <div key={session.id} className="rounded-lg bg-white p-6 shadow-sm">
                <div className="mb-4 flex items-start justify-between">
                  <div className="flex-1">
                    <p className="mb-2 text-sm text-neutral-600">
                      {session.userAgent || 'Unknown Device'}
                    </p>
                    <p className="mb-2 text-xs text-neutral-500">
                      IP: {session.ipAddress || 'Unknown'}
                    </p>
                    <p className="text-xs text-neutral-500">
                      Last active: {new Date(session.lastActiveAt).toLocaleDateString()}
                    </p>
                  </div>
                  {session.isCurrent && (
                    <span className="inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-800">
                      Current
                    </span>
                  )}
                </div>

                {!session.isCurrent && (
                  <button
                    onClick={() => handleRevokeSession(session.id)}
                    className="text-sm font-medium text-red-600 hover:text-red-700"
                  >
                    Revoke
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={handleRevokeAll}
              className="mt-6 w-full rounded-lg border border-red-300 px-4 py-2 font-medium text-red-600 transition hover:bg-red-50"
            >
              Revoke All Other Sessions
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
