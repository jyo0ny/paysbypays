// src/pages/Payments/Payments.tsx
import React, { useEffect, useState } from "react";
import { getPayments } from "../../api/payments";
import { getMerchantsDetails } from "../../api/merchants";
import type { Payments, MerchantDetail } from "../../types/payments";
import PaymentDetailModal from "../../components/PaymentsDetailModal";

type SortField = "paymentCode" | "merchantName" | "amount" | "payType" | "status" | "paymentAt";
type SortOrder = "asc" | "desc";

export default function Payments() {
  const [payments, setPayments] = useState<Payments[]>([]);
  const [merchants, setMerchants] = useState<MerchantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  
  // 🆕 고급 필터 상태
  const [selectedPayTypes, setSelectedPayTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 정렬 상태
  const [sortField, setSortField] = useState<SortField>("paymentAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // 모달 상태
  const [selectedPayment, setSelectedPayment] = useState<Payments | null>(null);
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantDetail | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const [paymentData, mchtData] = await Promise.all([
        getPayments(),
        getMerchantsDetails(),
      ]);
      
      setPayments(paymentData);
      setMerchants(mchtData);
    } catch (err) {
      setError("결제 내역을 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getMerchantName = (mchtCode: string) => {
    const merchant = merchants.find((m) => m.mchtCode === mchtCode);
    return merchant?.mchtName || mchtCode;
  };

  const handlePaymentClick = (payment: Payments) => {
    const merchant = merchants.find((m) => m.mchtCode === payment.mchtCode);
    setSelectedPayment(payment);
    setSelectedMerchant(merchant || null);
  };

  const handleCloseModal = () => {
    setSelectedPayment(null);
    setSelectedMerchant(null);
  };

  // 🆕 결제 수단 토글
  const togglePayType = (payType: string) => {
    setSelectedPayTypes((prev) =>
      prev.includes(payType)
        ? prev.filter((t) => t !== payType)
        : [...prev, payType]
    );
  };

  // 🆕 상태 토글
  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status)
        ? prev.filter((s) => s !== status)
        : [...prev, status]
    );
  };

  // 🆕 모든 필터 초기화
  const resetAllFilters = () => {
    setSearchTerm("");
    setStartDate("");
    setEndDate("");
    setSelectedPayTypes([]);
    setSelectedStatuses([]);
    setMinAmount("");
    setMaxAmount("");
  };

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">⇅</span>;
    }
    return sortOrder === "asc" ? (
      <span className="text-blue-600 ml-1">↑</span>
    ) : (
      <span className="text-blue-600 ml-1">↓</span>
    );
  };

  // 🆕 고급 필터링 적용
  const filteredPayments = payments.filter((payment) => {
    const merchantName = getMerchantName(payment.mchtCode);
    const amount = parseInt(payment.amount);

    // 기본 필터
    const matchesSearch = merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = !startDate || new Date(payment.paymentAt) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(payment.paymentAt) <= new Date(endDate);

    // 고급 필터
    const matchesPayType = selectedPayTypes.length === 0 || selectedPayTypes.includes(payment.payType);
    const matchesStatus = selectedStatuses.length === 0 || selectedStatuses.includes(payment.status);
    const matchesMinAmount = !minAmount || amount >= parseInt(minAmount);
    const matchesMaxAmount = !maxAmount || amount <= parseInt(maxAmount);

    return (
      matchesSearch &&
      matchesStartDate &&
      matchesEndDate &&
      matchesPayType &&
      matchesStatus &&
      matchesMinAmount &&
      matchesMaxAmount
    );
  });

  const sortedPayments = [...filteredPayments].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "paymentCode":
        aValue = a.paymentCode;
        bValue = b.paymentCode;
        break;
      case "merchantName":
        aValue = getMerchantName(a.mchtCode);
        bValue = getMerchantName(b.mchtCode);
        break;
      case "amount":
        aValue = parseInt(a.amount);
        bValue = parseInt(b.amount);
        break;
      case "payType":
        aValue = a.payType;
        bValue = b.payType;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "paymentAt":
        aValue = new Date(a.paymentAt).getTime();
        bValue = new Date(b.paymentAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const totalPages = Math.ceil(sortedPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentPayments = sortedPayments.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, sortField, sortOrder, selectedPayTypes, selectedStatuses, minAmount, maxAmount]);

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
      <h1 className="text-2xl font-bold text-gray-800">결제 내역</h1>

      {/* Filter Section */}
      <div className="p-4 bg-white shadow rounded-xl flex flex-col gap-4">
        {/* 기본 필터 */}
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
          
          {/* 🆕 고급 필터 토글 버튼 */}
          <button
            onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {showAdvancedFilters ? "고급 필터 닫기" : "고급 필터 열기"}
          </button>

          <button
            onClick={resetAllFilters}
            className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500"
          >
            전체 초기화
          </button>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded-lg ml-auto"
          >
            <option value={10}>10개씩</option>
            <option value={20}>20개씩</option>
            <option value={50}>50개씩</option>
            <option value={100}>100개씩</option>
          </select>
        </div>

        {/* 🆕 고급 필터 영역 */}
        {showAdvancedFilters && (
          <div className="border-t pt-4 space-y-4">
            {/* 결제 수단 필터 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">결제 수단</label>
              <div className="flex gap-2 flex-wrap">
                {["ONLINE", "DEVICE", "MOBILE", "VACT", "BILLING"].map((type) => (
                  <button
                    key={type}
                    onClick={() => togglePayType(type)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      selectedPayTypes.includes(type)
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {getPayTypeLabel(type)}
                  </button>
                ))}
              </div>
            </div>

            {/* 상태 필터 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">결제 상태</label>
              <div className="flex gap-2 flex-wrap">
                {["SUCCESS", "PENDING", "FAILED", "CANCELLED"].map((status) => (
                  <button
                    key={status}
                    onClick={() => toggleStatus(status)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      selectedStatuses.includes(status)
                        ? getStatusStyle(status)
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>

            {/* 금액 범위 필터 */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">금액 범위</label>
              <div className="flex gap-2 items-center">
                <input
                  type="number"
                  placeholder="최소 금액"
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-40"
                />
                <span className="text-gray-500">~</span>
                <input
                  type="number"
                  placeholder="최대 금액"
                  value={maxAmount}
                  onChange={(e) => setMaxAmount(e.target.value)}
                  className="border px-3 py-2 rounded-lg w-40"
                />
              </div>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            총 {sortedPayments.length}건의 결제
          </p>
          <p className="text-sm text-gray-500">
            {startIndex + 1} - {Math.min(endIndex, sortedPayments.length)}번째 표시 중
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th
                onClick={() => handleSort("paymentCode")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                결제 코드 <SortIcon field="paymentCode" />
              </th>
              <th
                onClick={() => handleSort("merchantName")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                가맹점명 <SortIcon field="merchantName" />
              </th>
              <th
                onClick={() => handleSort("amount")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                금액 <SortIcon field="amount" />
              </th>
              <th
                onClick={() => handleSort("payType")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                결제 수단 <SortIcon field="payType" />
              </th>
              <th
                onClick={() => handleSort("status")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                상태 <SortIcon field="status" />
              </th>
              <th
                onClick={() => handleSort("paymentAt")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                결제일시 <SortIcon field="paymentAt" />
              </th>
            </tr>
          </thead>

          <tbody>
            {currentPayments.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  조건에 맞는 결제 내역이 없습니다.
                </td>
              </tr>
            ) : (
              currentPayments.map((payment) => (
                <tr
                  key={payment.paymentCode}
                  onClick={() => handlePaymentClick(payment)}
                  className="border-b hover:bg-blue-50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{payment.paymentCode}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getMerchantName(payment.mchtCode)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {parseInt(payment.amount).toLocaleString()} {payment.currency}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getPayTypeLabel(payment.payType)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(payment.paymentAt).toLocaleString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            이전
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
            if (
              page === 1 ||
              page === totalPages ||
              (page >= currentPage - 2 && page <= currentPage + 2)
            ) {
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "hover:bg-gray-100"
                  }`}
                >
                  {page}
                </button>
              );
            } else if (page === currentPage - 3 || page === currentPage + 3) {
              return <span key={page}>...</span>;
            }
            return null;
          })}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
          >
            다음
          </button>
        </div>
      )}

      {/* 모달 */}
      {selectedPayment && (
        <PaymentDetailModal
          payment={selectedPayment}
          merchant={selectedMerchant}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}