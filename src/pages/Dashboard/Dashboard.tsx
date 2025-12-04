// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getTransactions } from "../../api/transactions";
import type { Transaction } from "../../types/transaction";

export default function Dashboard() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (error) {
        console.error("Failed to fetch transactions", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 통계 계산
  const totalCount = transactions.length;
  const successCount = transactions.filter((tx) => tx.status === "SUCCESS").length;
  const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : "0";
  const totalAmount = transactions.reduce((sum, tx) => sum + parseInt(tx.amount), 0);

  if (loading) {
    return <div className="flex items-center justify-center h-64">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">총 거래 건수</p>
          <h2 className="text-2xl font-semibold mt-2">{totalCount.toLocaleString()}건</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">거래 성공률</p>
          <h2 className="text-2xl font-semibold mt-2">{successRate}%</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">총 거래 금액</p>
          <h2 className="text-2xl font-semibold mt-2">₩{totalAmount.toLocaleString()}</h2>
        </div>
      </div>

      {/* Chart Section */}
      <div className="p-6 bg-white shadow rounded-xl min-h-[300px] flex items-center justify-center">
        <span className="text-gray-400">
          (차트 영역 – Recharts 라이브러리 설치 후 추가 예정)
        </span>
      </div>
    </div>
  );
}