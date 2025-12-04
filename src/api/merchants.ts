// src/api/merchants.ts
import api from "./client";
import type { Merchant, MerchantDetail } from "../types/payments";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

// 전체 가맹점 목록
export const getMerchants = async () => {
  const res = await api.get<ApiResponse<Merchant[]>>("/merchants/list");
  return res.data.data;
};

// 전체 가맹점 상세 정보
export const getMerchantsDetails = async () => {
  const res = await api.get<ApiResponse<MerchantDetail[]>>("/merchants/details");
  return res.data.data;
};

// 특정 가맹점 상세 정보
export const getMerchantDetail = async (mchtCode: string) => {
  const res = await api.get<ApiResponse<MerchantDetail>>(`/merchants/details/${mchtCode}`);
  return res.data.data;
};