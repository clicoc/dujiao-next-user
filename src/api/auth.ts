import { api, userApi } from './client'
import type { ApiResponse } from './client'
import type { TelegramAuthPayload, TelegramMiniAppAuthPayload } from './types'

export const userAuthAPI = {
    sendVerifyCode: (data: any) => userApi.post<ApiResponse>('/auth/send-verify-code', data),
    register: (data: any) => userApi.post<ApiResponse>('/auth/register', data),
    login: (data: any) => userApi.post<ApiResponse>('/auth/login', data),
    telegramLogin: (data: TelegramAuthPayload) => userApi.post<ApiResponse>('/auth/telegram/login', data),
    telegramMiniAppLogin: (data: TelegramMiniAppAuthPayload) =>
        userApi.post<ApiResponse>('/auth/telegram/miniapp/login', data),
    forgotPassword: (data: any) => userApi.post<ApiResponse>('/auth/forgot-password', data),
}

export const captchaAPI = {
    image: () => api.get<ApiResponse>('/public/captcha/image'),
}

export const configAPI = {
    get: () => api.get<ApiResponse>('/public/config'),
}
