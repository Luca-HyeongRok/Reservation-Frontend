/**
 * API 계층
 * - 외부(Spring Boot)와 통신하는 코드를 한곳에 모읍니다.
 * - 화면과 훅에서 통신 세부 구현을 몰라도 되도록 경계를 만듭니다.
 */

import type { Reservation, ReservationCreateRequest } from "@/types/reservation";

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8080").replace(/\/+$/, "");

// 요청 형식을 통일해 API 계층의 일관성을 유지합니다.
const BASE_HEADERS: HeadersInit = {
  Accept: "application/json",
};

// 본문이 있는 요청은 JSON Content-Type을 명시합니다.
const JSON_HEADERS: HeadersInit = {
  ...BASE_HEADERS,
  "Content-Type": "application/json",
};

const PATCH_HEADERS: HeadersInit = {
  Accept: "application/json",
};

async function throwApiError(response: Response, fallbackMessage: string): Promise<never> {
  try {
    const json = (await response.json()) as { message?: string };
    // 백엔드 에러 메시지를 사용자에게 그대로 전달
    if (typeof json.message === "string" && json.message.trim().length > 0) {
      throw new Error(json.message);
    }
  } catch {
    // JSON 파싱 실패 또는 예상 형식이 아닌 경우 기본 메시지를 사용합니다.
  }

  throw new Error(fallbackMessage);
}

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await fetch(`${API_BASE_URL}/api/reservations`, {
    method: "GET",
    headers: BASE_HEADERS,
    cache: "no-store",
  });

  if (!response.ok) {
    await throwApiError(response, "예약 목록 조회에 실패했습니다.");
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
    await throwApiError(response, "예약 생성에 실패했습니다.");
  }

  return response.json();
}

export async function approveReservation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/approve`, {
    method: "PATCH",
    headers: PATCH_HEADERS,
  });

  if (!response.ok) {
    await throwApiError(response, "예약 승인에 실패했습니다.");
  }
}

export async function cancelReservation(id: string): Promise<void> {
  const response = await fetch(`${API_BASE_URL}/api/reservations/${id}/cancel`, {
    method: "PATCH",
    headers: PATCH_HEADERS,
  });

  if (!response.ok) {
    await throwApiError(response, "예약 취소에 실패했습니다.");
  }
}

export { API_BASE_URL };