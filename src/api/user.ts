import { userApi } from './client'
import type { ApiResponse } from './client'
import type {
    UserProfileData,
    UpdateUserProfilePayload,
    UserLoginLogItem,
    SendChangeEmailCodePayload,
    ChangeEmailPayload,
    ChangeUserPasswordPayload,
    TelegramAuthPayload,
    TelegramMiniAppAuthPayload,
    TelegramBindingData,
} from './types'

export const userProfileAPI = {
    current: () => userApi.get<ApiResponse<UserProfileData>>('/me'),
    loginLogs: (params?: any) => userApi.get<ApiResponse<UserLoginLogItem[]>>('/me/login-logs', { params }),
    updateProfile: (data: UpdateUserProfilePayload) => userApi.put<ApiResponse<UserProfileData>>('/me/profile', data),
    sendChangeEmailCode: (data: SendChangeEmailCodePayload) => userApi.post<ApiResponse<{ sent: boolean }>>('/me/email/send-verify-code', data),
    changeEmail: (data: ChangeEmailPayload) => userApi.post<ApiResponse<UserProfileData>>('/me/email/change', data),
    changePassword: (data: ChangeUserPasswordPayload) => userApi.put<ApiResponse<{ updated: boolean }>>('/me/password', data),
    getTelegramBinding: () => userApi.get<ApiResponse<TelegramBindingData>>('/me/telegram'),
    bindTelegram: (data: TelegramAuthPayload) => userApi.post<ApiResponse<TelegramBindingData>>('/me/telegram/bind', data),
    bindTelegramMiniApp: (data: TelegramMiniAppAuthPayload) =>
        userApi.post<ApiResponse<TelegramBindingData>>('/me/telegram/miniapp/bind', data),
    unbindTelegram: () => userApi.delete<ApiResponse<{ unbound: boolean }>>('/me/telegram/unbind'),
}
