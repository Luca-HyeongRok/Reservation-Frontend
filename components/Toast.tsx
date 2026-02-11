"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  type?: "error" | "success";
  onClose?: () => void;
}

export default function Toast({ message, type = "error", onClose }: ToastProps) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 3000);

    return () => {
      window.clearTimeout(timer);
    };
  }, [message, type, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  if (!isVisible) {
    return null;
  }

  const toneClass = type === "success" ? "bg-emerald-600" : "bg-red-600";

  return (
    <div className="fixed right-4 top-4 z-50">
      <div className={`flex items-start gap-3 rounded-md px-4 py-3 text-sm text-white shadow-lg ${toneClass}`} role="alert" aria-live="assertive">
        <p>{message}</p>
        <button
          type="button"
          onClick={handleClose}
          className="ml-1 rounded px-1 leading-none text-white/90 hover:bg-white/20"
          aria-label="토스트 닫기"
        >
          X
        </button>
      </div>
    </div>
  );
}
