import { userApi } from './client'
import type { ApiResponse } from './client'
import type {
    WalletAccountData,
    WalletTransactionData,
    WalletRechargePayload,
    WalletRechargeResult,
    GiftCardRedeemResult,
    CaptchaPayload,
} from './types'

export const walletAPI = {
    account: () => userApi.get<ApiResponse<WalletAccountData>>('/wallet'),
    transactions: (params?: any) => userApi.get<ApiResponse<WalletTransactionData[]>>('/wallet/transactions', { params }),
    recharge: (data: WalletRechargePayload) => userApi.post<ApiResponse<WalletRechargeResult>>('/wallet/recharge', data),
    rechargeOrders: (params?: any) => userApi.get<ApiResponse<any[]>>('/wallet/recharges', { params }),
    rechargeDetail: (rechargeNo: string) =>
        userApi.get<ApiResponse<WalletRechargeResult>>(`/wallet/recharges/${encodeURIComponent(rechargeNo)}`),
    captureRechargePayment: (paymentID: number) =>
        userApi.post<ApiResponse<WalletRechargeResult>>(`/wallet/recharge/payments/${paymentID}/capture`),
}

export const giftCardAPI = {
    redeem: (data: { code: string; captcha_payload?: CaptchaPayload }) =>
        userApi.post<ApiResponse<GiftCardRedeemResult>>('/gift-cards/redeem', data),
}
