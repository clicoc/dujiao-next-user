import { api, userApi } from './client'
import type { ApiResponse } from './client'
import type {
    AffiliateDashboardData,
    AffiliateCommissionData,
    AffiliateWithdrawData,
    AffiliateWithdrawApplyPayload,
} from './types'

export const affiliateAPI = {
    trackClick: (data: { affiliate_code: string; visitor_key?: string; landing_path?: string; referrer?: string }) =>
        api.post<ApiResponse<{ ok: boolean }>>('/public/affiliate/click', data),
    open: () => userApi.post<ApiResponse>('/affiliate/open'),
    dashboard: () => userApi.get<ApiResponse<AffiliateDashboardData>>('/affiliate/dashboard'),
    commissions: (params?: any) => userApi.get<ApiResponse<AffiliateCommissionData[]>>('/affiliate/commissions', { params }),
    withdraws: (params?: any) => userApi.get<ApiResponse<AffiliateWithdrawData[]>>('/affiliate/withdraws', { params }),
    applyWithdraw: (data: AffiliateWithdrawApplyPayload) =>
        userApi.post<ApiResponse<AffiliateWithdrawData>>('/affiliate/withdraws', data),
}
