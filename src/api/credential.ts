import { userApi } from './client'
import type { ApiResponse } from './client'

export const apiCredentialAPI = {
    getMy: () => userApi.get<ApiResponse>('/api-credential'),
    apply: () => userApi.post<ApiResponse>('/api-credential/apply'),
    regenerate: () => userApi.post<ApiResponse>('/api-credential/regenerate'),
    updateStatus: (data: { is_active: boolean }) => userApi.put<ApiResponse>('/api-credential/status', data),
}
