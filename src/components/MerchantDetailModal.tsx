// src/components/MerchantDetailModal.tsx
import React from "react";
import type { MerchantDetail } from "../types/payments";

interface MerchantDetailModalProps {
  merchant: MerchantDetail | null;
  onClose: () => void;
}

export default function MerchantDetailModal({ merchant, onClose }: MerchantDetailModalProps) {
  if (!merchant) return null;

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

  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">가맹점 상세 정보</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            <section>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">가맹점명</label>
                  <p className="text-xl font-bold text-gray-900 mt-1">{merchant.mchtName}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">가맹점 코드</label>
                  <p className="text-base font-medium text-gray-900 mt-1">{merchant.mchtCode}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">사업자 번호</label>
                  <p className="text-base font-medium text-gray-900 mt-1">{merchant.bizNo}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">업종</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {getBizTypeLabel(merchant.bizType)}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">상태</label>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getStatusStyle(
                        merchant.status
                      )}`}
                    >
                      {getStatusLabel(merchant.status)}
                    </span>
                  </div>
                </div>

                <div className="col-span-2">
                  <label className="text-sm text-gray-500">주소</label>
                  <p className="text-base font-medium text-gray-900 mt-1">{merchant.address}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">전화번호</label>
                  <p className="text-base font-medium text-gray-900 mt-1">{merchant.phone}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">이메일</label>
                  <p className="text-base font-medium text-gray-900 mt-1">{merchant.email}</p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">등록일</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {new Date(merchant.registeredAt).toLocaleString("ko-KR")}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">수정일</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {new Date(merchant.updatedAt).toLocaleString("ko-KR")}
                  </p>
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              닫기
            </button>
          </div>
        </div>
      </div>
    </>
  );
}