// src/api/payments.ts
import api from "./client";
import type { Payments } from "../types/payments";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const getPayments = async () => {
  const res = await api.get<ApiResponse<Payments[]>>("/payments/list");
  return res.data.data;
}; 