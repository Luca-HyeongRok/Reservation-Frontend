"use client";

/**
 * 표현 계층 - 입력 컴포넌트
 * - 폼 화면과 입력 검증을 담당합니다.
 * - 실제 데이터 저장 책임은 상위(onSubmit)로 위임합니다.
 */

import { FormEvent, useState } from "react";
import type { ReservationCreateRequest } from "@/types/reservation";

interface ReservationFormProps {
  onSubmit: (payload: ReservationCreateRequest) => Promise<void> | void;
}

const INITIAL_FORM: ReservationCreateRequest = {
  name: "",
  date: "",
  time: "",
  partySize: 2,
};

export default function ReservationForm({ onSubmit }: ReservationFormProps) {
  const [form, setForm] = useState<ReservationCreateRequest>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);

    try {
      await onSubmit(form);
      setForm(INITIAL_FORM);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">예약 등록</h2>

      <input
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        placeholder="예약자명"
        value={form.name}
        onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
        required
      />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <input
          type="date"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={form.date}
          onChange={(e) => setForm((prev) => ({ ...prev, date: e.target.value }))}
          required
        />
        <input
          type="time"
          className="w-full rounded-md border border-slate-300 px-3 py-2"
          value={form.time}
          onChange={(e) => setForm((prev) => ({ ...prev, time: e.target.value }))}
          required
        />
      </div>

      <input
        type="number"
        min={1}
        className="w-full rounded-md border border-slate-300 px-3 py-2"
        value={form.partySize}
        onChange={(e) => setForm((prev) => ({ ...prev, partySize: Number(e.target.value) }))}
        required
      />

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-md bg-slate-900 px-4 py-2 text-white disabled:opacity-50"
      >
        {isSubmitting ? "저장 중..." : "예약 추가"}
      </button>
    </form>
  );
}
