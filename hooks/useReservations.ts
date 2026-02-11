"use client";

/**
 * 상태/로직 계층 (커스텀 훅)
 * - 예약 목록 조회, 생성, 로딩/에러 상태를 화면에서 분리합니다.
 * - 페이지와 컴포넌트는 "무엇을 보여줄지"에 집중하게 만듭니다.
 */

import { useCallback, useEffect, useState } from "react";
import { createReservation, fetchReservations } from "@/lib/api";
import type { Reservation, ReservationCreateRequest } from "@/types/reservation";

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    try {
      const created = await createReservation(payload);
      setReservations((prev) => [created, ...prev]);
      return created;
    } catch (err) {
      const message = err instanceof Error ? err.message : "예약 생성 중 오류가 발생했습니다.";
      setError(message);
      throw err;
    }
  }, []);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  return {
    reservations,
    isLoading,
    error,
    loadReservations,
    addReservation,
  };
}
