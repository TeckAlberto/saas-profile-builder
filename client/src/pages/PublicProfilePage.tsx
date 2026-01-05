import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import { usersApi } from '../services/api'
import type { PublicProfile } from '../services/api'

export default function PublicProfilePage() {
  const { name } = useParams()
  const [profile, setProfile] = useState<PublicProfile | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!name) {
      return
    }

    let isMounted = true

    const loadProfile = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await usersApi.getByName(name, { baseUrl: 'http://localhost:4000' })
        if (isMounted) {
          setProfile(data)
        }
      } catch (err) {
        if (isMounted) {
          setError(err instanceof Error ? err.message : 'Could not load profile')
          setProfile(null)
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    void loadProfile()

    return () => {
      isMounted = false
    }
  }, [name])

  if (!name) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <p className="text-sm font-semibold text-slate-900">We couldn’t find this profile.</p>
        <p className="text-sm text-slate-600 mt-2">Missing username in the URL.</p>
      </section>
    )
  }

  if (loading) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <p className="text-sm text-slate-600">Loading profile...</p>
      </section>
    )
  }

  if (error) {
    return (
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm text-center">
        <p className="text-sm font-semibold text-slate-900">We couldn’t find this profile.</p>
        <p className="text-sm text-slate-600 mt-2">{error}</p>
      </section>
    )
  }

  if (!profile) {
    return null
  }

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">{profile.username}</h1>
          <p className="text-sm text-slate-600 mt-1">Public profile</p>
        </div>
        <div className="text-xs text-slate-500">
          {profile.links.length} {profile.links.length === 1 ? 'link' : 'links'}
        </div>
      </div>

      {profile.links.length === 0 ? (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
          <p className="text-sm text-slate-700 font-semibold">No links to show yet.</p>
          <p className="text-sm text-slate-600 mt-1">Check back later.</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {profile.links.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noreferrer"
              className="block rounded-2xl border border-slate-200 bg-white p-4 shadow-sm hover:border-indigo-200 hover:shadow-md transition"
            >
              <div className="text-sm font-bold text-slate-900">{link.title}</div>
              <div className="text-sm text-indigo-600 break-all">{link.url}</div>
            </a>
          ))}
        </div>
      )}
    </section>
  )
}
