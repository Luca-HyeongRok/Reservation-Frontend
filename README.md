# Reservation Dashboard Frontend

## 1) 프로젝트 소개
이 프로젝트는 "예약 기능 구현" 자체보다, **구조 중심 설계 역량**을 보여주기 위해 만든 포트폴리오용 프론트엔드입니다.  
Next.js(App Router) 환경에서 API 통신, 상태 관리, UI 렌더링을 분리해 **변경에 강한 구조**를 의도했습니다.

Spring Boot Reservation Management API와 연동하며, 예약 상태 전이와 낙관적 업데이트를 통해 백엔드 설계를 프론트엔드에 반영했습니다.

## 2) 기술 스택
- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Fetch API (Spring Boot REST API 연동)

## 3) 아키텍처 설계 의도
핵심 의도는 "역할 분리"입니다. 화면 코드가 비즈니스 로직과 통신 세부사항을 직접 갖지 않도록 계층을 분리했습니다.

### 전체 데이터 흐름

UI(Component)
→ Hook(상태/비즈니스 로직)
→ API 계층(lib)
→ Spring Boot
→ Database


### 계층 분리 이유
- 변경 지점 최소화: API 스펙 변경 시 `lib` 중심 수정
- 재사용성: 로직(`hooks`)과 UI(`components`) 독립 재사용
- 가독성: `page`는 조립만 담당해 흐름 파악이 쉬움

### 역할 정의
- `app/page.tsx`: 화면 조립(Composition)만 담당
- `hooks/useReservations.ts`: 상태/비즈니스 로직(조회, 생성, 상태 변경, 에러 처리)
- `lib/api.ts`: 서버 통신 전담(HTTP method, 헤더, 에러 처리)
- `components/*`: 화면 표현 전담(폼, 리스트, 상태 뱃지/버튼)
- `types/reservation.ts`: 도메인 타입 계약(Reservation, ReservationStatus)

## 4) 상태 전이 설계
예약 상태는 `PENDING`, `APPROVED`, `CANCELLED`로 정의했습니다.

텍스트 다이어그램:

```text
PENDING -> APPROVED -> CANCELLED
PENDING -> CANCELLED
```

설계 의도:
- `PENDING`: 처리 대기
- `APPROVED`: 승인 완료
- `CANCELLED`: 종료 상태(추가 전이 없음)

UI에서도 같은 전이 규칙을 반영해 버튼 활성/비활성 조건을 제어합니다.

## 5) 낙관적 업데이트(Optimistic UI)
상태 변경(승인/취소) 시, 사용자 반응성을 위해 **UI를 먼저 갱신**합니다.

동작 방식:
1. 현재 목록 상태를 백업
2. 화면 상태를 즉시 변경
3. 서버 요청 수행
4. 실패 시 백업 상태로 롤백 + 에러 노출

이 방식으로 체감 속도와 실패 복구를 동시에 고려했습니다.

## 6) API 연동 구조
백엔드 스펙을 `lib/api.ts`에 캡슐화했습니다.

- `GET /api/reservations` (`cache: "no-store"`)
- `POST /api/reservations`
- `PATCH /api/reservations/{id}/approve`
- `PATCH /api/reservations/{id}/cancel`

`NEXT_PUBLIC_API_BASE_URL`을 사용하며, 베이스 URL의 끝 슬래시를 정규화해 `//api` 같은 URL 오류 가능성을 줄였습니다.

## 7) 실행 방법 (로컬)
### 1. 환경 변수 설정
프로젝트 루트에 `.env.local` 파일 생성:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속

## 8) 향후 개선 방향
- 서버 에러 응답 바디(`message`) 파싱 후 사용자 메시지 정교화
- 요청 공통 처리(예: 공통 에러 핸들러) 유틸화
- 상태 전이 규칙을 상수/모델로 추출해 테스트 용이성 강화
- React Query/SWR 도입으로 캐시/동기화 전략 고도화

## 9) 포인트
- 기능보다 구조를 먼저 설계하고, 계층 경계를 코드로 강제한 경험
- 백엔드 상태 전이 모델을 프론트 UI 규칙으로 일치시킨 설계 사고
- 낙관적 업데이트 + 롤백으로 UX와 안정성을 균형 있게 다룬 판단
- API 스펙 변경에 유연한 구조(`page`/`hook`/`api` 분리)
