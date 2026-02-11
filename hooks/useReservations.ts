"use client";

/**
 * 상태/로직 계층 (커스텀 훅)
 * - 예약 목록 조회, 생성, 상태 변경, 로딩/에러 상태를 화면에서 분리합니다.
 * - 페이지와 컴포넌트는 "무엇을 보여줄지"에 집중하게 만듭니다.
 */

import { useCallback, useEffect, useState } from "react";
import {
  approveReservation as approveReservationApi,
  cancelReservation as cancelReservationApi,
  createReservation,
  fetchReservations,
} from "@/lib/api";
import type { Reservation, ReservationCreateRequest, ReservationStatus } from "@/types/reservation";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchReservations();
      setReservations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addReservation = useCallback(async (payload: ReservationCreateRequest) => {
    setError(null);
    setSuccess(null);

    try {
      const created = await createReservation(payload);
      setReservations((prev) => [created, ...prev]);
      setSuccess("예약이 생성되었습니다.");
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : "예약 생성 중 오류가 발생했습니다.";
      setError(message);
      throw err;
    }
  }, []);

  const updateReservationStatus = useCallback(
    async (id: string, nextStatus: ReservationStatus, request: (reservationId: string) => Promise<void>) => {
      setError(null);

      // 낙관적 업데이트: 먼저 화면 상태를 바꾸고 실패 시 이전 상태로 롤백합니다.
      const previous = reservations;
      setReservations((current) =>
        current.map((reservation) =>
          reservation.id === id ? { ...reservation, status: nextStatus } : reservation,
        ),
      );

      try {
        await request(id);
      } catch (err) {
        setReservations(previous);
        const message = err instanceof Error ? err.message : "상태 변경 중 오류가 발생했습니다.";
        setError(message);
        throw err;
      }
    },
    [reservations],
  );

  const approveReservation = useCallback(
    async (id: string) => {
      await updateReservationStatus(id, "APPROVED", approveReservationApi);
    },
    [updateReservationStatus],
  );

  const cancelReservation = useCallback(
    async (id: string) => {
      await updateReservationStatus(id, "CANCELLED", cancelReservationApi);
    },
    [updateReservationStatus],
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const clearSuccess = useCallback(() => {
    setSuccess(null);
  }, []);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  return {
    reservations,
    isLoading,
    error,
    success,
    loadReservations,
    addReservation,
    approveReservation,
    cancelReservation,
    clearError,
    clearSuccess,
  };
}