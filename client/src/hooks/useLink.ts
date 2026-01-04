import { useState, useEffect, useCallback } from 'react'
import { linksApi } from '../services/api'
import type { Link, CreateLinkRequest, SaveOrderRequest } from '../services/api'
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

  const deleteLink = async (id: number | string) => {
    const previousLinks = links.map((link) => link)
    try {
      if (!token) {
        return false
      }

      setError(null)
      setLinks((prev) => prev.filter((link) => link.id !== id))

      await linksApi.delete(token, String(id), {
        baseUrl: 'http://localhost:4000'
      })

      return true
    } catch (err) {
      if (previousLinks) {
        setLinks(previousLinks)
      }
      setError(err instanceof Error ? err.message : 'Error al eliminar link')
      return false
    }
  }

  const saveOrder = async (orderedLinks: Link[]) => {
    const previousLinks = links.map((link) => link)

    if (!token) {
      return false
    }

    const payload: SaveOrderRequest = {
      orderedLinkIds: orderedLinks.map((link, index) => ({
        id: link.id,
        order: index
      }))
    }

    setError(null)
    setLinks(
      orderedLinks.map((link, index) => ({
        ...link,
        order: index
      }))
    )

    try {
      await linksApi.saveOrder(token, payload, {
        baseUrl: 'http://localhost:4000'
      })
      return true
    } catch (err) {
      setLinks(previousLinks)
      setError(err instanceof Error ? err.message : 'Error al guardar orden de links')
      return false
    }
  }

  useEffect(() => {
    fetchLinks()
  }, [fetchLinks, setLinks])

  return {
    links,
    loading,
    error,
    addLink,
    deleteLink,
    saveOrder,
    refreshLinks: fetchLinks
  }
}
