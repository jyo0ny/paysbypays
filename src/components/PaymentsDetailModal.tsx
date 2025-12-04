// src/components/PaymentDetailModal.tsx
import React from "react";
import type { Payments, MerchantDetail } from "../types/payments";

interface PaymentDetailModalProps {
  payment: Payments | null;
  merchant: MerchantDetail | null;
  onClose: () => void;
}

export default function PaymentDetailModal({
  payment,
  merchant,
  onClose,
}: PaymentDetailModalProps) {
  if (!payment) return null;

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

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      SUCCESS: "결제 완료",
      PENDING: "결제 대기",
      FAILED: "결제 실패",
      CANCELLED: "결제 취소",
    };
    return labels[status] || status;
  };

  // ESC 키로 모달 닫기
  React.useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [onClose]);

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-800">결제 상세 정보</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-2xl font-bold w-8 h-8 flex items-center justify-center"
            >
              ×
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* 결제 정보 */}
            <section>
              <h3 className="text-lg font-semibold text-gray-700 mb-4">결제 정보</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="text-sm text-gray-500">결제 코드</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {payment.paymentCode}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">결제 금액</label>
                  <p className="text-xl font-bold text-blue-600 mt-1">
                    {parseInt(payment.amount).toLocaleString()} {payment.currency}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">결제 상태</label>
                  <div className="mt-1">
                    <span
                      className={`inline-block px-3 py-1 rounded-lg text-sm font-medium ${getStatusStyle(
                        payment.status
                      )}`}
                    >
                      {getStatusLabel(payment.status)}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-sm text-gray-500">결제 수단</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {getPayTypeLabel(payment.payType)}
                  </p>
                </div>

                <div>
                  <label className="text-sm text-gray-500">결제 일시</label>
                  <p className="text-base font-medium text-gray-900 mt-1">
                    {new Date(payment.paymentAt).toLocaleString("ko-KR", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </section>

            {/* 가맹점 정보 */}
            {merchant && (
              <section className="border-t pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">가맹점 정보</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">가맹점명</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {merchant.mchtName}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">가맹점 코드</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {merchant.mchtCode}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">사업자 번호</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {merchant.bizNo || "-"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">업종</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {merchant.bizType || "-"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">상태</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {merchant.status || "-"}
                    </p>
                  </div>

                  <div className="col-span-2">
                    <label className="text-sm text-gray-500">주소</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {merchant.address || "-"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">전화번호</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {merchant.phone || "-"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">이메일</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {merchant.email || "-"}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">등록일</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {new Date(merchant.registeredAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-gray-500">수정일</label>
                    <p className="text-base font-medium text-gray-900 mt-1">
                      {new Date(merchant.updatedAt).toLocaleDateString("ko-KR")}
                    </p>
                  </div>
                </div>
              </section>
            )}
          </div>

          {/* Footer */}
          <div className="flex justify-end gap-3 p-6 border-t bg-gray-50">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              닫기
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(payment.paymentCode);
                alert("결제 코드가 복사되었습니다!");
              }}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              결제 코드 복사
            </button>
          </div>
        </div>
      </div>
    </>
  );
}