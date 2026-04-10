"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export function Modal({ open, onClose, title, children }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-start justify-center bg-navy/40 pt-[10vh]"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      <div className="w-full max-w-[640px] bg-white border-2 border-navy shadow-lg">
        <div className="flex items-center justify-between border-b-2 border-navy px-6 py-4">
          <h2 className="text-[20px] font-extrabold text-navy tracking-tight">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="text-grey-text hover:text-navy text-[18px] font-bold leading-none"
          >
            X
          </button>
        </div>
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
