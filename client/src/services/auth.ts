import { request } from './http'
import type { ApiOptions } from './http'

export type LoginRequest = {
  email: string
  password: string
}

export type LoginResponse = {
  message: string
  token: string
  user: {
    id: number
    username: string
    email: string
  }
}

export type RegisterRequest = {
  email: string
  username: string
  password: string
}

export const authApi = {
  login: async (payload: LoginRequest, options?: ApiOptions): Promise<LoginResponse> =>
    request<LoginResponse>('POST', '/api/auth/login', payload, options),
  register: async (payload: RegisterRequest, options?: ApiOptions): Promise<void> =>
    request<void>('POST', '/api/auth/register', payload, options)
}
