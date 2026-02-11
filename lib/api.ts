/**
 * API 계층
 * - 외부(Spring Boot)와 통신하는 코드를 한곳에 모읍니다.
 * - 화면과 훅에서 통신 세부 구현을 몰라도 되도록 경계를 만듭니다.
 */

import type { Reservation, ReservationCreateRequest } from "@/types/reservation";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080";

// 요청 형식을 통일해 API 계층의 일관성을 유지합니다.
const JSON_HEADERS: HeadersInit = {
  Accept: "application/json",
  "Content-Type": "application/json",
};

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: "GET",
    headers: JSON_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("예약 목록 조회에 실패했습니다.");
  }

  return response.json();
}

export async function createReservation(payload: ReservationCreateRequest): Promise<Reservation> {
  const response = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: "POST",
    headers: JSON_HEADERS,
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("예약 생성에 실패했습니다.");
  }

  return response.json();
}

export async function approveReservation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/approve`, {
    method: "PATCH",
    headers: JSON_HEADERS,
  });

  if (!response.ok) {
    throw new Error("예약 승인에 실패했습니다.");
  }
}

export async function cancelReservation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/cancel`, {
    method: "PATCH",
    headers: JSON_HEADERS,
  });

  if (!response.ok) {
    throw new Error("예약 취소에 실패했습니다.");
  }
}

export { API_BASE_URL };
