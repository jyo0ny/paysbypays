// src/pages/Transactions/Transactions.tsx
import React, { useEffect, useState } from "react";
import { getTransactions } from "../../api/transactions";
import { getMerchantsDetails } from "../../api/merchants";
import type { Transaction, MerchantDetail } from "../../types/transaction";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [merchants, setMerchants] = useState<MerchantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 데이터 불러오기
  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [txData, mchtData] = await Promise.all([
        getTransactions(),
        getMerchantsDetails(),
      ]);
      
      setTransactions(txData);
      setMerchants(mchtData);
    } catch (err) {
      setError("거래 내역을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 가맹점명 찾기 헬퍼 함수
  const getMerchantName = (mchtCode: string) => {
    const merchant = merchants.find((m) => m.mchtCode === mchtCode);
    return merchant?.mchtName || mchtCode;
  };

  // 필터링된 데이터
  const filteredTransactions = transactions.filter((tx) => {
    const merchantName = getMerchantName(tx.mchtCode);
    const matchesSearch = merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = !startDate || new Date(tx.paymentAt) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(tx.paymentAt) <= new Date(endDate);
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // 상태별 색상
  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      case "CANCELLED":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  // 결제 수단 한글 변환
  const getPayTypeLabel = (payType: string) => {
    const labels: Record<string, string> = {
      ONLINE: "온라인",
      DEVICE: "디바이스",
      MOBILE: "모바일",
      VACT: "가상계좌",
      BILLING: "정기결제",
    };
    return labels[payType] || payType;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">로딩 중...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-gray-800">거래 내역</h1>

      {/* Filter Section */}
      <div className="p-4 bg-white shadow rounded-xl flex flex-col gap-4">
        <div className="flex gap-4 items-center flex-wrap">
          <input
            type="text"
            placeholder="가맹점명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded-lg"
          />
          <button
            onClick={() => {
              setSearchTerm("");
              setStartDate("");
              setEndDate("");
            }}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            초기화
          </button>
        </div>
        <p className="text-sm text-gray-500">
          총 {filteredTransactions.length}건의 거래
        </p>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">결제 코드</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">가맹점명</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">금액</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">결제 수단</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">상태</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">결제일시</th>
            </tr>
          </thead>

          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  조건에 맞는 거래 내역이 없습니다.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr key={tx.paymentCode} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-700">{tx.paymentCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getMerchantName(tx.mchtCode)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {parseInt(tx.amount).toLocaleString()} {tx.currency}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getPayTypeLabel(tx.payType)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(tx.status)}`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(tx.paymentAt).toLocaleString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}