// src/pages/Merchants/Merchants.tsx
import React, { useEffect, useState } from "react";
import { getMerchantsDetails } from "../../api/merchants";
import type { MerchantDetail } from "../../types/payments";
import MerchantDetailModal from "../../components/MerchantDetailModal";

type SortField = "mchtCode" | "mchtName" | "bizType" | "status" | "registeredAt";
type SortOrder = "asc" | "desc";

export default function Merchants() {
  const [merchants, setMerchants] = useState<MerchantDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 필터 상태
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBizTypes, setSelectedBizTypes] = useState<string[]>([]);
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>([]);

  // 페이지네이션 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 정렬 상태
  const [sortField, setSortField] = useState<SortField>("registeredAt");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  // 선택된 가맹점
  const [selectedMerchant, setSelectedMerchant] = useState<MerchantDetail | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMerchantsDetails();
      setMerchants(data);
    } catch (err) {
      setError("가맹점 정보를 불러오는데 실패했습니다.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const toggleBizType = (bizType: string) => {
    setSelectedBizTypes((prev) =>
      prev.includes(bizType) ? prev.filter((t) => t !== bizType) : [...prev, bizType]
    );
  };

  const toggleStatus = (status: string) => {
    setSelectedStatuses((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedBizTypes([]);
    setSelectedStatuses([]);
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

  // 필터링
  const filteredMerchants = merchants.filter((merchant) => {
    const matchesSearch =
      merchant.mchtName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      merchant.mchtCode.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBizType =
      selectedBizTypes.length === 0 || selectedBizTypes.includes(merchant.bizType);
    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(merchant.status);

    return matchesSearch && matchesBizType && matchesStatus;
  });

  // 정렬
  const sortedMerchants = [...filteredMerchants].sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortField) {
      case "mchtCode":
        aValue = a.mchtCode;
        bValue = b.mchtCode;
        break;
      case "mchtName":
        aValue = a.mchtName;
        bValue = b.mchtName;
        break;
      case "bizType":
        aValue = a.bizType;
        bValue = b.bizType;
        break;
      case "status":
        aValue = a.status;
        bValue = b.status;
        break;
      case "registeredAt":
        aValue = new Date(a.registeredAt).getTime();
        bValue = new Date(b.registeredAt).getTime();
        break;
      default:
        return 0;
    }

    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  // 페이지네이션
  const totalPages = Math.ceil(sortedMerchants.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentMerchants = sortedMerchants.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBizTypes, selectedStatuses, sortField, sortOrder]);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "bg-green-100 text-green-700";
      case "INACTIVE":
        return "bg-gray-100 text-gray-700";
      case "READY":
        return "bg-blue-100 text-blue-700";
      case "CLOSED":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getBizTypeLabel = (bizType: string) => {
    const labels: Record<string, string> = {
      CAFE: "카페",
      SHOP: "쇼핑몰",
      MART: "마트",
      APP: "앱",
      TRAVEL: "여행",
      EDU: "교육",
      TEST: "테스트",
    };
    return labels[bizType] || bizType;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      ACTIVE: "활성",
      INACTIVE: "비활성",
      READY: "준비중",
      CLOSED: "폐쇄",
    };
    return labels[status] || status;
  };

  // 업종별 통계
  const bizTypeStats = merchants.reduce((acc, m) => {
    acc[m.bizType] = (acc[m.bizType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // 상태별 통계
  const statusStats = merchants.reduce((acc, m) => {
    acc[m.status] = (acc[m.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

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
      <h1 className="text-2xl font-bold text-gray-800">가맹점 관리</h1>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">전체 가맹점</p>
          <h2 className="text-2xl font-semibold mt-2">{merchants.length}개</h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">활성 가맹점</p>
          <h2 className="text-2xl font-semibold mt-2 text-green-600">
            {statusStats.ACTIVE || 0}개
          </h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">비활성 가맹점</p>
          <h2 className="text-2xl font-semibold mt-2 text-gray-600">
            {statusStats.INACTIVE || 0}개
          </h2>
        </div>

        <div className="p-6 bg-white shadow rounded-xl">
          <p className="text-gray-500 text-sm">업종 수</p>
          <h2 className="text-2xl font-semibold mt-2">
            {Object.keys(bizTypeStats).length}개
          </h2>
        </div>
      </div>

      {/* 필터 섹션 */}
      <div className="p-4 bg-white shadow rounded-xl flex flex-col gap-4">
        <div className="flex gap-4 items-center flex-wrap">
          <input
            type="text"
            placeholder="가맹점명 또는 코드 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border px-3 py-2 rounded-lg flex-1 min-w-[200px]"
          />

          <button onClick={resetFilters} className="px-4 py-2 bg-gray-400 text-white rounded-lg hover:bg-gray-500">
            초기화
          </button>

          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="border px-3 py-2 rounded-lg"
          >
            <option value={10}>10개씩</option>
            <option value={20}>20개씩</option>
            <option value={50}>50개씩</option>
          </select>
        </div>

        {/* 업종 필터 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">업종</label>
          <div className="flex gap-2 flex-wrap">
            {Object.keys(bizTypeStats).map((type) => (
              <button
                key={type}
                onClick={() => toggleBizType(type)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  selectedBizTypes.includes(type)
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getBizTypeLabel(type)} ({bizTypeStats[type]})
              </button>
            ))}
          </div>
        </div>

        {/* 상태 필터 */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">상태</label>
          <div className="flex gap-2 flex-wrap">
            {["ACTIVE", "INACTIVE", "READY", "CLOSED"].map((status) => (
              <button
                key={status}
                onClick={() => toggleStatus(status)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  selectedStatuses.includes(status)
                    ? getStatusStyle(status)
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {getStatusLabel(status)} ({statusStats[status] || 0})
              </button>
            ))}
          </div>
        </div>

        <p className="text-sm text-gray-500">
          총 {sortedMerchants.length}개의 가맹점
        </p>
      </div>

      {/* 테이블 */}
      <div className="bg-white shadow rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th
                onClick={() => handleSort("mchtCode")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                가맹점 코드 <SortIcon field="mchtCode" />
              </th>
              <th
                onClick={() => handleSort("mchtName")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                가맹점명 <SortIcon field="mchtName" />
              </th>
              <th
                onClick={() => handleSort("bizType")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                업종 <SortIcon field="bizType" />
              </th>
              <th
                onClick={() => handleSort("status")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                상태 <SortIcon field="status" />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">연락처</th>
              <th
                onClick={() => handleSort("registeredAt")}
                className="px-4 py-3 text-left text-sm font-medium text-gray-600 cursor-pointer hover:bg-gray-200 select-none"
              >
                등록일 <SortIcon field="registeredAt" />
              </th>
            </tr>
          </thead>

          <tbody>
            {currentMerchants.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  조건에 맞는 가맹점이 없습니다.
                </td>
              </tr>
            ) : (
              currentMerchants.map((merchant) => (
                <tr
                  key={merchant.mchtCode}
                  onClick={() => setSelectedMerchant(merchant)}
                  className="border-b hover:bg-blue-50 cursor-pointer transition"
                >
                  <td className="px-4 py-3 text-sm text-gray-700">{merchant.mchtCode}</td>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {merchant.mchtName}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {getBizTypeLabel(merchant.bizType)}
                  </td>
                  <td className="px-4 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-xs ${getStatusStyle(merchant.status)}`}>
                      {getStatusLabel(merchant.status)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">{merchant.phone}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {new Date(merchant.registeredAt).toLocaleDateString("ko-KR")}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* 페이지네이션 */}
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
                    currentPage === page ? "bg-blue-600 text-white" : "hover:bg-gray-100"
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

      {/* 가맹점 상세 모달 */}
      {selectedMerchant && (
        <MerchantDetailModal
          merchant={selectedMerchant}
          onClose={() => setSelectedMerchant(null)}
        />
      )}
    </div>
  );
}