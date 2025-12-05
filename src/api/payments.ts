// src/api/payments.ts
import api from "./client";
import type { Payment } from "../types/payments";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const getPayments = async () => {
  const res = await api.get<ApiResponse<Payment[]>>("/payments/list");
  return res.data.data;
}; 