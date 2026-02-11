/**
 * API 계층
 * - 외부(Spring Boot)와 통신하는 코드를 한곳에 모읍니다.
 * - 화면과 훅에서 통신 세부 구현을 몰라도 되도록 경계를 만듭니다.
 */

import type { Reservation, ReservationCreateRequest } from "@/types/reservation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

export async function fetchReservations(): Promise<Reservation[]> {
  // 추후 실제 API 연동 시 엔드포인트를 확정합니다.
  // const response = await fetch(`${API_BASE_URL}/api/reservations`, { cache: "no-store" });
  // if (!response.ok) throw new Error("예약 목록 조회에 실패했습니다.");
  // return response.json();

  return [];
}

export async function createReservation(payload: ReservationCreateRequest): Promise<Reservation> {
  // 추후 실제 API 연동 시 POST 요청으로 교체합니다.
  // const response = await fetch(`${API_BASE_URL}/api/reservations`, {
  //   method: "POST",
  //   headers: { "Content-Type": "application/json" },
  //   body: JSON.stringify(payload),
  // });
  // if (!response.ok) throw new Error("예약 생성에 실패했습니다.");
  // return response.json();

  return {
    id: crypto.randomUUID(),
    name: payload.name,
    date: payload.date,
    time: payload.time,
    partySize: payload.partySize,
    createdAt: new Date().toISOString(),
  };
}

export { API_BASE_URL };
