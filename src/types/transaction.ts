// src/types/transaction.ts
export interface Transaction {
  paymentCode: string;      // id → paymentCode
  mchtCode: string;         // 가맹점 코드
  amount: string;           // number → string (API 응답이 string)
  currency: string;         // 통화
  payType: "ONLINE" | "DEVICE" | "MOBILE" | "VACT" | "BILLING";
  status: "PENDING" | "SUCCESS" | "FAILED" | "CANCELLED";
  paymentAt: string;        // createdAt → paymentAt
}

// 가맹점 타입도 추가
export interface Merchant {
  mchtCode: string;
  mchtName: string;
  status: string;
  bizType: string;
}

export interface MerchantDetail extends Merchant {
  bizNo: string;
  address: string;
  phone: string;
  email: string;
  registeredAt: string;
  updatedAt: string;
}