import { useState, useEffect, useCallback } from 'react'
import { linksApi } from '../services/api'
import type { Link, CreateLinkRequest } from '../services/api'
import { useAuthStore } from '../store/authStore'

export const useLinks = () => {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const token = useAuthStore((state) => state.token)

  const fetchLinks = useCallback(async () => {
    if (!token) {
      return
    }

    setLoading(true)
    setError(null)
    try {
      console.log('Fetching links with token:', token)
      const data = await linksApi.list(token, {
        baseUrl: 'http://localhost:4000'
      })

      setLinks(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar links')
    } finally {
      setLoading(false)
    }
  }, [token])

  const addLink = async (payload: CreateLinkRequest) => {
    if (!token) {
      return
    }

    setError(null)
    try {
      const newLink = await linksApi.create(token, payload, {
        baseUrl: 'http://localhost:4000'
      })
      setLinks((prev) => [newLink, ...prev])
      return true
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al crear link')
      return false
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks])

  return {
    links,
    loading,
    error,
    addLink,
    refreshLinks: fetchLinks
  }
}
