"use client";

import ReservationForm from "@/components/ReservationForm";
import ReservationList from "@/components/ReservationList";
import Toast from "@/components/Toast";
import { useReservations } from "@/hooks/useReservations";
import type { ReservationCreateRequest } from "@/types/reservation";

/**
 * 페이지 계층
 * - page.tsx는 화면 조립만 담당합니다.
 * - 상세 비즈니스 로직은 훅, UI는 컴포넌트, 통신은 lib로 위임합니다.
 */
export default function HomePage() {
  const {
    reservations,
    isLoading,
    error,
    success,
    addReservation,
    approveReservation,
    cancelReservation,
    clearError,
    clearSuccess,
  } = useReservations();

  const handleCreate = async (payload: ReservationCreateRequest) => {
    await addReservation(payload);
  };

  const handleApprove = async (id: string) => {
    await approveReservation(id);
  };

  const handleCancel = async (id: string) => {
    await cancelReservation(id);
  };

  const toastMessage = error ?? success;
  const toastType = error ? "error" : "success";
  const handleToastClose = error ? clearError : clearSuccess;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col gap-6 bg-slate-50 px-6 py-10">
      <header className="space-y-1 border-b border-slate-200 pb-4">
        <h1 className="text-3xl font-bold text-slate-900">Reservation Dashboard</h1>
        <p className="text-sm text-slate-500">구조 중심 설계를 보여주기 위한 포트폴리오 스켈레톤</p>
      </header>

      {toastMessage ? <Toast message={toastMessage} type={toastType} onClose={handleToastClose} /> : null}

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