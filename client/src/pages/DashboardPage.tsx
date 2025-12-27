import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '../store/authStore'
import { useLinks } from '../hooks/useLink'
import SummaryCard from '../components/ui/SummaryCard'
import LinksList from '../components/ui/LinksList'
import AddLinkModal from '../components/ui/AddLinkModal'
import type { CreateLinkRequest } from '../services/api'

type StoredUser = {
  id: number
  username: string
  email: string
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

  const { addLink, links } = useLinks()

  const [showModal, setShowModal] = useState(false)
  const [formError, setFormError] = useState('')
  const [newLink, setNewLink] = useState({ title: '', url: '' })
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) {
      return
    }

    const t = setTimeout(() => setCopied(false), 1500)

    return () => clearTimeout(t)
  }, [copied])

  const profileUrl = useMemo(() => {
    const username = user?.username?.trim()
    if (!username) {
      return '-'
    }

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
      alert('Could not copy. Please copy it manually.')
    }
  }

  const openAddModal = () => {
    setFormError('')
    setNewLink({ title: '', url: '' })
    setShowModal(true)
  }

  const handleAddLink = () => {
    setFormError('')

    if (!newLink.title.trim() || !newLink.url.trim()) {
      setFormError('Please fill in title and URL.')
      return
    }
    if (!isValidUrl(newLink.url.trim())) {
      setFormError('Please enter a valid URL (https://...).')
      return
    }

    const item: CreateLinkRequest = {
      title: newLink.title.trim(),
      url: newLink.url.trim()
    }

    try {
      addLink(item)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Error adding link.')
      return
    }

    setShowModal(false)
  }

  return (
    <div className="space-y-6">
      <SummaryCard
        profileUrl={profileUrl}
        copied={copied}
        onCopy={handleCopyProfileUrl}
        onAddLink={openAddModal}
        onLogout={handleLogout}
        onPreview={() => alert('TODO: open public preview')}
        canCopy={Boolean(user?.username)}
      />

      <LinksList links={links} onAddLink={openAddModal} />

      <AddLinkModal
        isOpen={showModal}
        formError={formError}
        draft={newLink}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddLink}
        onChange={setNewLink}
      />
    </div>
  )
}
