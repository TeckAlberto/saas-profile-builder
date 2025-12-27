import { request } from './http'
import type { ApiOptions } from './http'

export type Link = {
  id: number
  title: string
  url: string
  userId: number
  platform: string
  order: number
  isActive: boolean
  createdAt?: string | null
  updatedAt?: string | null
}

export type CreateLinkRequest = {
  title: string
  url: string
  platform?: string
}

export const linksApi = {
  list: async (token: string, options?: ApiOptions): Promise<Link[]> =>
    request<Link[]>('GET', '/api/links', undefined, { ...options, token }),
  create: async (token: string, payload: CreateLinkRequest, options?: ApiOptions): Promise<Link> =>
    request<Link>('POST', '/api/links', payload, { ...options, token })
}
