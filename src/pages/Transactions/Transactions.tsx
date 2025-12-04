// src/pages/Transactions/Transactions.tsx
import React, { useEffect, useState } from "react";
import { getTransactions } from "../../api/transactions";
import { getMerchantsDetails } from "../../api/merchants";
import type { Transaction, MerchantDetail } from "../../types/transaction";

// 🆕 정렬 타입 정의
type SortField = "paymentCode" | "merchantName" | "amount" | "payType" | "status" | "paymentAt";
type SortOrder = "asc" | "desc";

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [merchants, setMerchants] = useState<MerchantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 🆕 정렬 상태
  const [sortField, setSortField] = useState<SortField>("paymentAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

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

  const getMerchantName = (mchtCode: string) => {
    const merchant = merchants.find((m) => m.mchtCode === mchtCode);
    return merchant?.mchtName || mchtCode;
  };

  // 🆕 정렬 핸들러
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      // 같은 필드 클릭 시 순서 변경
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      // 다른 필드 클릭 시 해당 필드로 오름차순
      setSortField(field);
      setSortOrder("asc");
    }
  };

  // 🆕 정렬 아이콘 렌더링
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

  // 필터링된 데이터
  const filteredTransactions = transactions.filter((tx) => {
    const merchantName = getMerchantName(tx.mchtCode);
    const matchesSearch = merchantName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStartDate = !startDate || new Date(tx.paymentAt) >= new Date(startDate);
    const matchesEndDate = !endDate || new Date(tx.paymentAt) <= new Date(endDate);
    return matchesSearch && matchesStartDate && matchesEndDate;
  });

  // 🆕 정렬된 데이터
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
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

  // 페이지네이션 계산
  const totalPages = Math.ceil(sortedTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = sortedTransactions.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, startDate, endDate, sortField, sortOrder]);

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
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            총 {sortedTransactions.length}건의 거래
          </p>
          <p className="text-sm text-gray-500">
            {startIndex + 1} - {Math.min(endIndex, sortedTransactions.length)}번째 표시 중
          </p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              {/* 🆕 클릭 가능한 헤더 */}
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
            {currentTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  조건에 맞는 거래 내역이 없습니다.
                </td>
              </tr>
            ) : (
              currentTransactions.map((tx) => (
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
    </div>
  );
}