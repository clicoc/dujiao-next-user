import axios from 'axios'
import type { InternalAxiosRequestConfig } from 'axios'
import i18n from '../i18n'

export const t = (key: string, params?: Record<string, any>) =>
    (params ? i18n.global.t(key, params) : i18n.global.t(key)) as string

// 统一响应接口
export interface ApiResponse<T = any> {
    status_code: number
    msg: string
    data: T
    pagination?: {
        page: number
        page_size: number
        total: number
        total_page: number
    }
}

// API 基础配置
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || ''
// const API_BASE_URL = 'http://localhost:8080' // Original backup
const API_PREFIX = '/api/v1'

const api = axios.create({
    baseURL: `${API_BASE_URL}${API_PREFIX}`,
    timeout: 10000,
})

const userApi = axios.create({
    baseURL: `${API_BASE_URL}${API_PREFIX}`,
    timeout: 10000,
})

// 注入当前语言到请求头
function injectLocaleHeader(config: InternalAxiosRequestConfig) {
    const locale = (i18n.global.locale as any).value || i18n.global.locale
    if (locale) {
        config.headers['X-Lang'] = locale
    }
    return config
}

// 请求拦截器
api.interceptors.request.use(
    (config) => injectLocaleHeader(config),
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器
api.interceptors.response.use(
    (response) => {
        const data: ApiResponse = response.data

        // 检查响应数据是否存在
        if (!data) {
            console.error('API Error: No response data')
            return Promise.reject(new Error(t('common.api.responseMissing')))
        }

        // 检查是否是新的统一响应格式
        if (typeof data.status_code !== 'undefined') {
            // 检查业务状态码
            if (data.status_code !== 0) {
                if (data.status_code === 401) {
                    localStorage.removeItem('user_token')
                    localStorage.removeItem('user_profile')
                    window.location.href = '/auth/login'
                    return Promise.reject(new Error(t('common.api.unauthorized')))
                }
                // 业务错误，显示错误消息
                const fallbackMessage = t('common.api.requestFailed')
                const errorMessage = data.msg || fallbackMessage
                const silentBusinessError = Boolean((response.config as any)?.silentBusinessError)
                if (!silentBusinessError) {
                    console.error('API Error:', errorMessage)
                }
                const businessError = new Error(errorMessage) as Error & { silentBusinessError?: boolean }
                businessError.silentBusinessError = silentBusinessError
                return Promise.reject(businessError)
            }
        }

        // 返回完整的 AxiosResponse 对象
        return response
    },
    (error) => {
        // HTTP错误处理
        if (error.response) {
            const status = error.response.status
            let message = t('common.api.requestFailed')

            switch (status) {
                case 401:
                    message = t('common.api.unauthorized')
                    break
                case 403:
                    message = t('common.api.forbidden')
                    break
                case 404:
                    message = t('common.api.notFound')
                    break
                case 500:
                    message = t('common.api.serverError')
                    break
                case 502:
                    message = t('common.api.badGateway')
                    break
                case 503:
                    message = t('common.api.serviceUnavailable')
                    break
                default:
                    message = t('common.api.requestFailedStatus', { status })
            }

            console.error('HTTP Error:', message)
            // ElMessage.error(message)

            return Promise.reject(new Error(message))
        } else if (error.request) {
            const message = t('common.api.networkError')
            console.error('Network Error:', message)
            // ElMessage.error('网络连接失败，请检查您的网络')
            return Promise.reject(new Error(message))
        } else {
            if (!(error as any)?.silentBusinessError) {
                console.error('Request Error:', error.message)
            }
            return Promise.reject(error)
        }
    }
)

userApi.interceptors.request.use(
    (config) => {
        injectLocaleHeader(config)
        const token = localStorage.getItem('user_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

const isAuthEndpoint = (url?: string) => {
    if (!url) return false
    const path = url.replace(/^https?:\/\/[^/]+/, '')
    return /\/auth\/(login|register|telegram\/login|telegram\/miniapp\/login|forgot-password)/.test(path)
}

userApi.interceptors.response.use(
    (response) => {
        const data: ApiResponse = response.data

        if (!data) {
            console.error('API Error: No response data')
            return Promise.reject(new Error(t('common.api.responseMissing')))
        }

        if (typeof data.status_code !== 'undefined') {
            if (data.status_code !== 0) {
                if (data.status_code === 401 && !isAuthEndpoint(response.config.url)) {
                    localStorage.removeItem('user_token')
                    localStorage.removeItem('user_profile')
                    window.location.href = '/auth/login'
                    return Promise.reject(new Error(t('common.api.unauthorized')))
                }
                const fallbackMessage = t('common.api.requestFailed')
                const errorMessage = data.msg || fallbackMessage
                const silentBusinessError = Boolean((response.config as any)?.silentBusinessError)
                if (!silentBusinessError) {
                    console.error('API Error:', errorMessage)
                }
                const businessError = new Error(errorMessage) as Error & { silentBusinessError?: boolean }
                businessError.silentBusinessError = silentBusinessError
                return Promise.reject(businessError)
            }
        }

        return response
    },
    (error) => {
        if (error.response) {
            const status = error.response.status
            let message = t('common.api.requestFailed')

            switch (status) {
                case 401:
                    message = t('common.api.unauthorized')
                    if (!isAuthEndpoint(error.config?.url)) {
                        localStorage.removeItem('user_token')
                        localStorage.removeItem('user_profile')
                        window.location.href = '/auth/login'
                    }
                    break
                case 403:
                    message = t('common.api.forbidden')
                    break
                case 404:
                    message = t('common.api.notFound')
                    break
                case 500:
                    message = t('common.api.serverError')
                    break
                case 502:
                    message = t('common.api.badGateway')
                    break
                case 503:
                    message = t('common.api.serviceUnavailable')
                    break
                default:
                    message = t('common.api.requestFailedStatus', { status })
            }

            console.error('HTTP Error:', message)
            return Promise.reject(new Error(message))
        } else if (error.request) {
            const message = t('common.api.networkError')
            console.error('Network Error:', message)
            return Promise.reject(new Error(message))
        } else {
            if (!(error as any)?.silentBusinessError) {
                console.error('Request Error:', error.message)
            }
            return Promise.reject(error)
        }
    }
)

export { api, userApi }
export default api
