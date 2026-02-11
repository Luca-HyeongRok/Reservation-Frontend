/**
 * 표현 계층 - 목록 컴포넌트
 * - 전달받은 예약 데이터의 렌더링만 책임집니다.
 * - 데이터 조회/변환 로직은 훅에서 처리합니다.
 */

import type { Reservation } from "@/types/reservation";

interface ReservationListProps {
  reservations: Reservation[];
  isLoading?: boolean;
}

export default function ReservationList({ reservations, isLoading = false }: ReservationListProps) {
  if (isLoading) {
    return <p className="text-sm text-slate-500">예약 목록을 불러오는 중입니다...</p>;
  }

  if (reservations.length === 0) {
    return <p className="text-sm text-slate-500">등록된 예약이 없습니다.</p>;
  }

  return (
    <ul className="space-y-3">
      {reservations.map((reservation) => (
        <li key={reservation.id} className="rounded-lg border border-slate-200 bg-white p-4">
          <p className="font-medium text-slate-900">{reservation.name}</p>
          <p className="text-sm text-slate-600">
            {reservation.date} {reservation.time} · {reservation.partySize}명
          </p>
        </li>
      ))}
    </ul>
  );
}
