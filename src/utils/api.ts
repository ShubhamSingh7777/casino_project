import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios'
import { toast } from 'react-toastify'
import { setChangePassAndTxn, setLoader } from '../redux/actions/common/commonSlice'
import { logout } from '../redux/actions/login/loginSlice'
import { store } from '../redux/store'
import authService from '../services/auth.service'
import agentService from '../services/agent.service'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASEURL,
  timeout: 50000,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = authService.getToken() || agentService.getAgentToken()
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

api.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(setLoader(false))
    if (!response.data.changePassAndTxn) {
      store.dispatch(setChangePassAndTxn(response.data.changePassAndTxn))
    }
    return response
  },
  async (error: AxiosError<{ message: string; data: any }>) => {
    store.dispatch(setLoader(false))
    const token = authService.getRefreshToken()
    const originalConfig: any = error.config

    if (error.response?.data?.data && error.response?.data?.data.maintenance) {
      setTimeout(() => {
        store.dispatch(logout())
        window.location.reload()
      }, 1)
    }

    if (
      (error.response?.status === 401 && error.response?.data?.message === 'jwt expired') ||
      (error.response?.data?.message === 'jwt malformed' && !originalConfig._retry)
    ) {
      store.dispatch(logout())
      window.location.reload()
      return true
    }

    return Promise.reject(error)
  },
)

export const sportsApi = axios.create({
  baseURL: process.env.REACT_APP_API_SPORTS_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

export const fancyApi = axios.create({
  baseURL: process.env.REACT_APP_PYTHON_SERVER,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

fancyApi.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    store.dispatch(setLoader(true))
    const token = authService.getToken() || agentService.getAgentToken()
    config.headers.Authorization = token ? `Bearer ${token}` : ''
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

fancyApi.interceptors.response.use(
  (response: AxiosResponse) => {
    store.dispatch(setLoader(false))
    if (!response.data.changePassAndTxn) {
      store.dispatch(setChangePassAndTxn(response.data.changePassAndTxn))
    }
    return response
  },
  async (error: AxiosError<{ message: string; data: any }>) => {
    store.dispatch(setLoader(false))
    const token = authService.getRefreshToken()
    const originalConfig: any = error.config

    if (error.response?.data?.data && error.response?.data?.data.maintenance) {
      setTimeout(() => {
        store.dispatch(logout())
        window.location.reload()
      }, 1)
    }

    if (
      (error.response?.status === 401 && error.response?.data?.message === 'jwt expired') ||
      (error.response?.data?.message === 'jwt malformed' && !originalConfig._retry)
    ) {
      store.dispatch(logout())
      window.location.reload()
      return true
    }

    // ✅ Show toast only when API route is /placebet
    if (error.response?.data?.message !== 'No auth token') {
      if (error.config?.url?.includes('/placebet')) {
        toast.error(error.response?.data?.message)
      }
    }

    return Promise.reject(error)
  },
)

export default api
