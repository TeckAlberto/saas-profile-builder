export type ApiOptions = {
  token?: string
  baseUrl?: string
  headers?: Record<string, string>
}

const buildUrl = (url: string, baseUrl?: string) => {
  if (!baseUrl) {
    return url
  }

  const normalizedBase = baseUrl.replace(/\/$/, '')

  return `${normalizedBase}${url.startsWith('/') ? '' : '/'}${url}`
}

export const request = async <T>(
  method: 'GET' | 'POST' | 'DELETE' | 'PATCH',
  url: string,
  body?: unknown,
  options: ApiOptions = {}
): Promise<T> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers
  }

  if (options.token) {
    headers.Authorization = `Bearer ${options.token}`
  }

  const response = await fetch(buildUrl(url, options.baseUrl), {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined
  })

  const raw = await response.text()
  let data: unknown = null

  if (raw) {
    try {
      data = JSON.parse(raw) as unknown
    } catch {
      throw new Error('Invalid JSON response from server')
    }
  }

  if (!response.ok) {
    const message =
      data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
        ? data.message
        : response.statusText || 'Something went wrong'
    throw new Error(message)
  }

  if (!data) {
    throw new Error('Empty response from server')
  }

  return data as T
}

export const get = async <T>(url: string, options?: ApiOptions): Promise<T> =>
  request<T>('GET', url, undefined, options)

export const post = async <T>(url: string, body: unknown, options?: ApiOptions): Promise<T> =>
  request<T>('POST', url, body, options)

export const del = async <T>(url: string, options?: ApiOptions): Promise<T> =>
  request<T>('DELETE', url, undefined, options)

export const patch = async <T>(url: string, body: unknown, options?: ApiOptions): Promise<T> =>
  request<T>('PATCH', url, body, options)
