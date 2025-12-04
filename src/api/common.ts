// src/api/common.ts
import api from "./client";

interface StatusCode {
  code: string;
  description: string;
}

interface PayType {
  type: string;
  description: string;
}

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// 결제 상태 코드
export const getPaymentStatuses = async () => {
  const res = await api.get<ApiResponse<StatusCode[]>>("/common/payment-status/all");
  return res.data.data;
};

// 결제 수단 코드
export const getPaymentTypes = async () => {
  const res = await api.get<ApiResponse<PayType[]>>("/common/paymemt-type/all");
  return res.data.data;
};

// 가맹점 상태 코드
export const getMerchantStatuses = async () => {
  const res = await api.get<ApiResponse<StatusCode[]>>("/common/mcht-status/all");
  return res.data.data;
};