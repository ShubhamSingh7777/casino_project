import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'

/**
 * Separate axios instance for AGENT-side API calls.
 * Sends the agent-token (JWT) instead of the admin token.
 */
const agentApi = axios.create({
  baseURL: process.env.REACT_APP_API_BASEURL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
})

agentApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('agent-token')
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
  },
  (error: AxiosError) => Promise.reject(error),
)

agentApi.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<{ message: string; data: any }>) => {
    if (error.response?.status === 401) {
      // Agent session expired — clear and redirect to agent login
      localStorage.removeItem('agent-token')
      localStorage.removeItem('agent-refresh-token')
      localStorage.removeItem('agent-username')
      localStorage.removeItem('agent-permissions')
      localStorage.removeItem('agent-parentId')
      localStorage.removeItem('agent-parentRole')
      window.location.href = '/admin/agent-login'
    }
    return Promise.reject(error)
  },
)

export default agentApi
