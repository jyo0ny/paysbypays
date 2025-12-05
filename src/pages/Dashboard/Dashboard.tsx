// src/pages/Dashboard/Dashboard.tsx
import React, { useEffect, useState } from "react";
import { getPayments } from "../../api/payments";
import { getMerchantsDetails } from "../../api/merchants";
import type { Payment, MerchantDetail } from "../../types/payments";
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
  Area,
  AreaChart,
} from "recharts";

export default function Dashboard() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [merchants, setMerchants] = useState<MerchantDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [paymentData, merchantData] = await Promise.all([
          getPayments(),
          getMerchantsDetails(),
        ]);
         console.log("💳 전체 결제 데이터:", paymentData.length, "건");
        console.log("✅ 성공 결제:", paymentData.filter(p => p.status === "SUCCESS").length, "건");
        console.log("📅 결제 날짜 샘플:", paymentData.slice(0, 3).map(p => p.paymentAt));
        
        setPayments(paymentData);
        setMerchants(merchantData);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  //  가맹점명 매핑
  const getMerchantName = (mchtCode: string) => {
    const merchant = merchants.find((m) => m.mchtCode === mchtCode);
    return merchant?.mchtName || mchtCode;
  };

  //  기본 통계
  const totalCount = payments.length;
  const successCount = payments.filter((p) => p.status === "SUCCESS").length;
  const failedCount = payments.filter((p) => p.status === "FAILED").length;
  const pendingCount = payments.filter((p) => p.status === "PENDING").length;
  const successRate = totalCount > 0 ? ((successCount / totalCount) * 100).toFixed(1) : "0";
  const totalAmount = payments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + parseInt(p.amount), 0);
  const avgAmount = successCount > 0 ? Math.round(totalAmount / successCount) : 0;

  //  오늘/어제 비교
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const todayPayments = payments.filter((p) => new Date(p.paymentAt) >= today);
  const yesterdayPayments = payments.filter(
    (p) => new Date(p.paymentAt) >= yesterday && new Date(p.paymentAt) < today
  );

  const todayAmount = todayPayments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + parseInt(p.amount), 0);
  const yesterdayAmount = yesterdayPayments
    .filter((p) => p.status === "SUCCESS")
    .reduce((sum, p) => sum + parseInt(p.amount), 0);

  const amountChange =
    yesterdayAmount > 0
      ? (((todayAmount - yesterdayAmount) / yesterdayAmount) * 100).toFixed(1)
      : "0";

//  일별 데이터 - 전체 기간 표시 (수정됨)
const getDailyData = () => {
  if (payments.length === 0) return [];

  const successPayments = payments.filter((p) => p.status === "SUCCESS");
  if (successPayments.length === 0) return [];

  // 실제 결제 데이터의 날짜 범위 찾기
  const paymentDates = successPayments.map(p => {
    const date = new Date(p.paymentAt);
    date.setHours(0, 0, 0, 0);
    return date.getTime();
  });
  
  const minDate = new Date(Math.min(...paymentDates));
  const maxDate = new Date(Math.max(...paymentDates));
  
  console.log("📅 실제 데이터 범위:", {
    시작: minDate.toISOString().split('T')[0],
    종료: maxDate.toISOString().split('T')[0]
  });

  // 날짜별 Map 생성
  const dailyMap = new Map<string, { amount: number; count: number }>();
  
  // 날짜 범위의 모든 날짜 생성
  const currentDate = new Date(minDate);
  const dateList: string[] = [];
  
  while (currentDate <= maxDate) {
    const dateStr = currentDate.toISOString().split('T')[0];
    dateList.push(dateStr);
    dailyMap.set(dateStr, { amount: 0, count: 0 });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // 결제 데이터 집계
  successPayments.forEach((p) => {
    const paymentDate = new Date(p.paymentAt);
    const dateStr = paymentDate.toISOString().split('T')[0];
    
    if (dailyMap.has(dateStr)) {
      const current = dailyMap.get(dateStr)!;
      dailyMap.set(dateStr, {
        amount: current.amount + parseFloat(p.amount), //  parseInt → parseFloat (소수점 처리)
        count: current.count + 1,
      });
    }
  });

  console.log("📊 집계된 일별 데이터 샘플:", 
    Array.from(dailyMap.entries()).slice(0, 5)
  );

  // 차트용 데이터 변환 (전체 기간 표시)
  return dateList.map((dateStr) => {
    const data = dailyMap.get(dateStr)!;
    const date = new Date(dateStr);
    return {
      date: `${date.getMonth() + 1}/${date.getDate()}`,
      fullDate: dateStr, // 툴팁용
      amount: Math.round(data.amount), // 반올림
      count: data.count,
    };
  });
};

  //  가맹점별 매출 TOP 10
  const getTopMerchants = () => {
    const merchantMap = new Map<string, number>();

    payments
      .filter((p) => p.status === "SUCCESS")
      .forEach((p) => {
        const current = merchantMap.get(p.mchtCode) || 0;
        merchantMap.set(p.mchtCode, current + parseInt(p.amount));
      });

    return Array.from(merchantMap.entries())
      .map(([mchtCode, amount]) => ({
        name: getMerchantName(mchtCode),
        amount,
      }))
      .sort((a, b) => b.amount - a.amount)
      .slice(0, 10);
  };

  //  결제 수단별 데이터
  const getPayTypeData = () => {
    const payTypeMap = new Map<string, number>();

    payments
      .filter((p) => p.status === "SUCCESS")
      .forEach((p) => {
        const label = {
          ONLINE: "온라인",
          DEVICE: "디바이스",
          MOBILE: "모바일",
          VACT: "가상계좌",
          BILLING: "정기결제",
        }[p.payType] || p.payType;

        const current = payTypeMap.get(label) || 0;
        payTypeMap.set(label, current + parseInt(p.amount));
      });

    return Array.from(payTypeMap.entries()).map(([name, amount]) => ({ name, amount }));
  };

  //  상태별 데이터
  const getStatusData = () => {
    return [
      { name: "성공", value: successCount, color: "#10b981" },
      { name: "대기", value: pendingCount, color: "#f59e0b" },
      { name: "실패", value: failedCount, color: "#ef4444" },
    ].filter((item) => item.value > 0);
  };

  //  최근 거래 5건
  const recentPayments = [...payments]
    .sort((a, b) => new Date(b.paymentAt).getTime() - new Date(a.paymentAt).getTime())
    .slice(0, 5);

  //  시간대별 거래 분포
  const getHourlyData = () => {
    const hourlyMap = new Map<number, number>();
    for (let i = 0; i < 24; i++) {
      hourlyMap.set(i, 0);
    }

    payments.forEach((p) => {
      const hour = new Date(p.paymentAt).getHours();
      hourlyMap.set(hour, (hourlyMap.get(hour) || 0) + 1);
    });

    return Array.from(hourlyMap.entries()).map(([hour, count]) => ({
      hour: `${hour}시`,
      count,
    }));
  };

  const dailyData = getDailyData();
  console.log("📈 차트 데이터:", dailyData);  
  const topMerchants = getTopMerchants();
  const payTypeData = getPayTypeData();
  const statusData = getStatusData();
  const hourlyData = getHourlyData();

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "SUCCESS":
        return "bg-green-100 text-green-700";
      case "PENDING":
        return "bg-yellow-100 text-yellow-700";
      case "FAILED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">로딩 중...</div>;
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">대시보드</h1>
        <p className="text-sm text-gray-500">
          최종 업데이트: {new Date().toLocaleString("ko-KR")}
        </p>
      </div>

      {/*  KPI 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">총 결제 건수</p>
          <h2 className="text-3xl font-bold mt-2">{totalCount.toLocaleString()}건</h2>
          <p className="text-sm text-gray-400 mt-1">오늘 {todayPayments.length}건</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">결제 성공률</p>
          <h2 className="text-3xl font-bold mt-2 text-green-600">{successRate}%</h2>
          <p className="text-sm text-red-500 mt-1">실패 {failedCount}건</p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">총 결제 금액</p>
          <h2 className="text-3xl font-bold mt-2">₩{totalAmount.toLocaleString()}</h2>
          <p
            className={`text-sm mt-1 ${
              parseFloat(amountChange) >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            전일 대비 {amountChange}%
          </p>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">평균 결제 금액</p>
          <h2 className="text-3xl font-bold mt-2">₩{avgAmount.toLocaleString()}</h2>
          <p className="text-sm text-gray-400 mt-1">성공 거래 기준</p>
        </div>
      </div>

      {/*  트렌드 차트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 일별 결제 금액 추이 */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">일별 결제 추이 (14일)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={dailyData}>
              <defs>
                <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#3b82f6"
                fillOpacity={1}
                fill="url(#colorAmount)"
                name="결제 금액"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* 시간대별 거래 분포 */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">시간대별 거래 분포</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hourlyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b5fffc5" name="거래 건수" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/*  가맹점 & 결제 수단 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* TOP 10 가맹점 */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">매출 TOP 10 가맹점</h3>
          <div className="space-y-3">
            {topMerchants.map((merchant, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold ${
                      index < 3 ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span className="text-sm font-medium text-gray-700">{merchant.name}</span>
                </div>
                <span className="text-sm font-bold text-blue-600">
                  ₩{merchant.amount.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 결제 수단별 금액 */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">결제 수단별 금액</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={payTypeData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }: any) =>
                  `${name} ${((percent || 0) * 100).toFixed(0)}%`
                }
                outerRadius={100}
                fill="#8884d8"
                dataKey="amount"
              >
                {payTypeData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"][index % 5]}
                  />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => `₩${value.toLocaleString()}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/*  상태 분석 & 최근 거래 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 결제 상태 분포 */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">결제 상태 분포</h3>
          <div className="space-y-4">
            {statusData.map((item, index) => (
              <div key={index}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">{item.name}</span>
                  <span className="text-sm font-bold" style={{ color: item.color }}>
                    {item.value}건 ({((item.value / totalCount) * 100).toFixed(1)}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${(item.value / totalCount) * 100}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 최근 거래 */}
        <div className="p-6 bg-white shadow rounded-xl">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">최근 거래 내역</h3>
          <div className="space-y-3">
            {recentPayments.map((payment) => (
              <div key={payment.paymentCode} className="flex justify-between items-center pb-3 border-b last:border-b-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {getMerchantName(payment.mchtCode)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {new Date(payment.paymentAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-gray-900">
                    ₩{parseInt(payment.amount).toLocaleString()}
                  </p>
                  <span className={`text-xs px-2 py-0.5 rounded ${getStatusStyle(payment.status)}`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}