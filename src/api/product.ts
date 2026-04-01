import { api } from './client'
import type { ApiResponse } from './client'
import type { PublicMemberLevel } from './types'

export const productAPI = {
    list: (params?: any) => api.get<ApiResponse>('/public/products', { params }),
    detail: (slug: string) => api.get<ApiResponse>(`/public/products/${slug}`),
}

export const postAPI = {
    list: (params?: any) => api.get<ApiResponse>('/public/posts', { params }),
    detail: (slug: string) => api.get<ApiResponse>(`/public/posts/${slug}`),
}

export const bannerAPI = {
    list: (params?: any) => api.get<ApiResponse>('/public/banners', { params }),
}

export const categoryAPI = {
    list: (params?: any) => api.get<ApiResponse>('/public/categories', { params }),
}

export const memberLevelAPI = {
    list: () => api.get<ApiResponse<PublicMemberLevel[]>>('/public/member-levels'),
}
