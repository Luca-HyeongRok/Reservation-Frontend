"use client";

import ReservationForm from "@/components/ReservationForm";
import ReservationList from "@/components/ReservationList";
import { useReservations } from "@/hooks/useReservations";
import type { ReservationCreateRequest } from "@/types/reservation";

/**
 * 페이지 계층
 * - page.tsx는 화면 조립만 담당합니다.
 * - 상세 비즈니스 로직은 훅, UI는 컴포넌트, 통신은 lib로 위임합니다.
 */
export default function HomePage() {
  const { reservations, isLoading, error, addReservation, approveReservation, cancelReservation } =
    useReservations();

  const handleCreate = async (payload: ReservationCreateRequest) => {
    await addReservation(payload);
  };

  const handleApprove = async (id: string) => {
    await approveReservation(id);
  };

  const handleCancel = async (id: string) => {
    await cancelReservation(id);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 bg-slate-50 px-6 py-10">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold text-slate-900">Reservation Dashboard</h1>
        <p className="text-sm text-slate-600">구조 중심 설계를 보여주기 위한 포트폴리오 스켈레톤</p>
      </header>

      {error ? <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p> : null}

      <ReservationForm onSubmit={handleCreate} />
      <ReservationList
        reservations={reservations}
        isLoading={isLoading}
        onApprove={handleApprove}
        onCancel={handleCancel}
      />
    </main>
  );
}
