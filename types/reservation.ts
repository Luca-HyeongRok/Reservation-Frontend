/**
 * 도메인 타입 계층
 * - 예약 관련 타입을 중앙에서 관리해
 *   API/훅/컴포넌트 사이의 데이터 계약을 명확히 합니다.
 */

export type ReservationStatus = "PENDING" | "APPROVED" | "CANCELLED";

export interface Reservation {
  id: string;
  customerName: string;
  reservedAt: string; // 날짜+시간 형식: ISO-8601 LocalDateTime
  partySize: number;
  status: ReservationStatus;
}

export interface ReservationCreateRequest {
  name: string;
  date: string;
  time: string;
  partySize: number;
}
