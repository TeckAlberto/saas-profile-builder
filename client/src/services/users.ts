import { request } from './http'
import type { ApiOptions } from './http'
import type { Link } from './links'

export type PublicProfile = {
  username: string
  links: Link[]
}

export const usersApi = {
  getByName: async (name: string, options?: ApiOptions): Promise<PublicProfile> =>
    request<PublicProfile>('GET', `/api/${encodeURIComponent(name)}`, undefined, options)
}
