// src/api/transactions.ts
import api from "./client";
import type { Transaction } from "../types/transaction";

interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const getTransactions = async () => {
  const res = await api.get<ApiResponse<Transaction[]>>("/payments/list");
  return res.data.data;
};