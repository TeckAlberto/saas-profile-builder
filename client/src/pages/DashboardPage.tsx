import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'

type StoredUser = {
  id: number
  username: string
  email: string
}

type LinkItem = {
  id: string
  title: string
  url: string
  active: boolean
}

function getStoredUser(): StoredUser | null {
  try {
    const raw = localStorage.getItem('user')
    if (!raw) return null
    return JSON.parse(raw) as StoredUser
  } catch {
    return null
  }
}

function isValidUrl(value: string) {
  try {
    const url = new URL(value)
    return url.protocol === 'http:' || url.protocol === 'https:'
  } catch {
    return false
  }
}

export default function DashboardPage() {
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const user = getStoredUser()

  // Mock inicial (luego lo sustituyes por API)
  const [links, setLinks] = useState<LinkItem[]>([])

  const [showModal, setShowModal] = useState(false)
  const [formError, setFormError] = useState('')
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1500)
    return () => clearTimeout(t)
  }, [copied])

  const profileUrl = useMemo(() => {
    const username = user?.username?.trim()
    if (!username) return '—'
    // Ajusta el formato como quieras: /u/:username o /:username
    return `${window.location.origin}/u/${encodeURIComponent(username)}`
  }, [user])

  const handleLogout = () => {
    logout()
    localStorage.removeItem('user')
    navigate('/auth/login')
  }

  const handleCopyProfileUrl = async () => {
    if (!user?.username) return
    try {
      await navigator.clipboard.writeText(profileUrl)
      setCopied(true)
    } catch {
      // fallback mínimo
      alert('Could not copy. Please copy it manually.')
    }
  }

  const openAddModal = () => {
    setFormError('')
    setNewLink({ title: '', url: '' })
    setShowModal(true)
  }

  const addLink = () => {
    setFormError('')

    if (!newLink.title.trim() || !newLink.url.trim()) {
      setFormError('Please fill in title and URL.')
      return
    }
    if (!isValidUrl(newLink.url.trim())) {
      setFormError('Please enter a valid URL (https://...).')
      return
    }

    const item: LinkItem = {
      id: crypto.randomUUID(),
      title: newLink.title.trim(),
      url: newLink.url.trim(),
      active: true
    }

    setLinks((prev) => [item, ...prev])
    setShowModal(false)
  }

  const toggleActive = (id: string) => {
    setLinks((prev) => prev.map((l) => (l.id === id ? { ...l, active: !l.active } : l)))
  }

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  return (
    <div className="space-y-6">
      {/* Top summary card */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-xl font-bold text-slate-900">Your page</h1>
            <p className="text-sm text-slate-600 mt-1">
              Manage the links people will see when they open your profile.
            </p>

            <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 truncate">
                {profileUrl}
              </div>

              <button
                onClick={handleCopyProfileUrl}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                           hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                           active:scale-95 transition-all duration-200"
                disabled={!user?.username}
              >
                {copied ? 'Copied!' : 'Copy link'}
              </button>

              <button
                onClick={() => alert('TODO: open public preview')}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm
                           hover:bg-slate-50 transition"
              >
                Preview
              </button>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={openAddModal}
              className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                         hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                         active:scale-95 transition-all duration-200"
            >
              Add link
            </button>

            <button
              onClick={handleLogout}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm
                         hover:bg-slate-50 transition"
            >
              Log out
            </button>
          </div>
        </div>
      </section>

      {/* Links list */}
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">Links</h2>
            <p className="text-sm text-slate-600 mt-1">
              Turn links on/off or remove them. (Drag & drop ordering later.)
            </p>
          </div>

          <div className="text-sm text-slate-500">
            {links.length} {links.length === 1 ? 'item' : 'items'}
          </div>
        </div>

        {links.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-6">
            <p className="text-sm text-slate-700 font-semibold">No links yet.</p>
            <p className="text-sm text-slate-600 mt-1">
              Add your first link (Instagram, website, portfolio, whatever makes you look like a
              real person).
            </p>

            <button
              onClick={openAddModal}
              className="mt-4 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                         hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                         active:scale-95 transition-all duration-200"
            >
              Add your first link
            </button>
          </div>
        ) : (
          <div className="mt-6 space-y-3">
            {links.map((link) => (
              <div
                key={link.id}
                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">{link.title}</p>
                  <a
                    href={link.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-sm text-indigo-600 hover:underline break-all"
                  >
                    {link.url}
                  </a>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleActive(link.id)}
                    className={`rounded-xl px-3 py-2 text-sm font-semibold shadow-sm border transition
                      ${
                        link.active
                          ? 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    aria-pressed={link.active}
                  >
                    {link.active ? 'Active' : 'Inactive'}
                  </button>

                  <button
                    onClick={() => removeLink(link.id)}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
                    aria-label={`Remove ${link.title}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Add link"
        >
          <div className="absolute inset-0 bg-slate-900/30" onClick={() => setShowModal(false)} />

          <div className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900">Add a link</h3>
            <p className="text-sm text-slate-600 mt-1">Use a full URL (https://...).</p>

            <div className="mt-5 space-y-3">
              <div>
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input
                  value={newLink.title}
                  onChange={(e) => setNewLink((p) => ({ ...p, title: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none
                             focus:ring-2 focus:ring-indigo-200"
                  placeholder="Instagram"
                  autoFocus
                />
              </div>

              <div>
                <label className="text-sm font-semibold text-slate-700">URL</label>
                <input
                  value={newLink.url}
                  onChange={(e) => setNewLink((p) => ({ ...p, url: e.target.value }))}
                  className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none
                             focus:ring-2 focus:ring-indigo-200"
                  placeholder="https://instagram.com/youruser"
                />
              </div>

              {formError && (
                <p className="text-red-600 text-sm border border-red-200 bg-red-50 rounded-xl p-2">
                  {formError}
                </p>
              )}
            </div>

            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={addLink}
                className="rounded-xl bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg
                           hover:bg-indigo-700 hover:shadow-xl hover:-translate-y-0.5
                           active:scale-95 transition-all duration-200"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
