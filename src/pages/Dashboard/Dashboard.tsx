// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getPayments } from "../../api/payments";
import type { Payments } from "../../types/payments";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function Dashboard() {
  const [payments, setpayments] = useState<Payments[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPayments();
        setpayments(data);
      } catch (error) {
        console.error("Failed to fetch payments", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 통계 계산
  const totalCount = payments.length;
  const successCount = payments.filter((tx) => tx.status === "SUCCESS").length;
  const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : "0";
  const totalAmount = payments.reduce((sum, tx) => sum + parseInt(tx.amount), 0);

  // 📊 차트 데이터 가공

  // 1. 일별 거래 금액 (최근 7일)
  const getDailyData = () => {
    const dailyMap = new Map<string, number>();
    
    payments.forEach((tx) => {
      const date = new Date(tx.paymentAt).toLocaleDateString("ko-KR", {
        month: "short",
        day: "numeric",
      });
      const amount = parseInt(tx.amount);
      dailyMap.set(date, (dailyMap.get(date) || 0) + amount);
    });

    return Array.from(dailyMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .slice(-7); // 최근 7일만
  };

  // 2. 결제 수단별 거래 건수
  const getPayTypeData = () => {
    const payTypeMap = new Map<string, number>();
    
    payments.forEach((tx) => {
      const label = {
        ONLINE: "온라인",
        DEVICE: "디바이스",
        MOBILE: "모바일",
        VACT: "가상계좌",
        BILLING: "정기결제",
      }[tx.payType] || tx.payType;

      payTypeMap.set(label, (payTypeMap.get(label) || 0) + 1);
    });

    return Array.from(payTypeMap.entries()).map(([name, value]) => ({ name, value }));
  };

  // 3. 상태별 거래 비율 (파이 차트용)
  const getStatusData = () => {
    const statusMap = new Map<string, number>();
    
    payments.forEach((tx) => {
      statusMap.set(tx.status, (statusMap.get(tx.status) || 0) + 1);
    });

    return Array.from(statusMap.entries()).map(([name, value]) => ({ name, value }));
  };

  const dailyData = getDailyData();
  const payTypeData = getPayTypeData();
  const statusData = getStatusData();

  // 파이 차트 색상
  const STATUS_COLORS: Record<string, string> = {
    SUCCESS: "#10b981",
    PENDING: "#f59e0b",
    FAILED: "#ef4444",
    CANCELLED: "#6b7280",
  };

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

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 📈 일별 거래 금액 추이 (Line Chart) */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">일별 거래 금액 추이</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip
                formatter={(value: number) => `₩${value.toLocaleString()}`}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                strokeWidth={2}
                name="거래 금액"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 📊 결제 수단별 거래 건수 (Bar Chart) */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">결제 수단별 거래 건수</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={payTypeData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8b5cf6" name="거래 건수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 🥧 거래 상태 분포 (Pie Chart) */}
      <div className="p-6 bg-white shadow rounded-xl">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">거래 상태 분포</h3>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={statusData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} ${percent ? (percent * 100).toFixed(0) : 0}%`}
              outerRadius={100}
              fill="#8884d8"
              dataKey="value"
            >
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={STATUS_COLORS[entry.name] || "#6b7280"} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}