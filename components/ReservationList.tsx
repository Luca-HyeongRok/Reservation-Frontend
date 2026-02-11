/**
 * 표현 계층 - 목록 컴포넌트
 * - 전달받은 예약 데이터의 렌더링만 책임집니다.
 * - 데이터 조회/변환 로직은 훅에서 처리합니다.
 */

import type { Reservation, ReservationStatus } from "@/types/reservation";

interface ReservationListProps {
  reservations: Reservation[];
  isLoading?: boolean;
  onApprove: (id: string) => Promise<void> | void;
  onCancel: (id: string) => Promise<void> | void;
}

const STATUS_STYLES: Record<ReservationStatus, string> = {
  PENDING: "bg-slate-100 text-slate-700",
  APPROVED: "bg-emerald-100 text-emerald-700",
  CANCELLED: "bg-red-100 text-red-700",
};

const STATUS_LABELS: Record<ReservationStatus, string> = {
  PENDING: "대기",
  APPROVED: "승인",
  CANCELLED: "취소",
};

export default function ReservationList({
  reservations,
  isLoading = false,
  onApprove,
  onCancel,
}: ReservationListProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">예약 목록을 불러오는 중입니다...</p>;
  }

  if (reservations.length === 0) {
    return <p className="text-sm text-slate-500">등록된 예약이 없습니다.</p>;
  }

  return (
    <ul className="space-y-3">
      {reservations.map((reservation) => {
        // 상태 전이 규칙: PENDING -> APPROVED/CANCELLED, APPROVED -> CANCELLED
        const canApprove = reservation.status === "PENDING";
        const canCancel = reservation.status === "PENDING" || reservation.status === "APPROVED";

        return (
          <li key={reservation.id} className="space-y-3 rounded-lg border border-slate-200 bg-white p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium text-slate-900">{reservation.name}</p>
                <p className="text-sm text-slate-600">
                  {reservation.date} {reservation.time} · {reservation.partySize}명
                </p>
              </div>

              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${STATUS_STYLES[reservation.status]}`}>
                {STATUS_LABELS[reservation.status]}
              </span>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => void onApprove(reservation.id)}
                disabled={!canApprove}
                className="rounded-md border border-emerald-300 px-3 py-1.5 text-sm text-emerald-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
              >
                승인
              </button>
              <button
                type="button"
                onClick={() => void onCancel(reservation.id)}
                disabled={!canCancel}
                className="rounded-md border border-red-300 px-3 py-1.5 text-sm text-red-700 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
              >
                취소
              </button>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
