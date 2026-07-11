"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

type ToastType = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

let toastId = 0;
let listeners: Array<(toast: Toast) => void> = [];

export function showToast(message: string, type: ToastType = "success") {
  const toast: Toast = { id: ++toastId, message, type };
  listeners.forEach((listener) => listener(toast));
}

export function ToastContainer() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const listener = (toast: Toast) => {
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== toast.id));
      }, 3000);
    };
    listeners.push(listener);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
    };
  }, []);

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-24 right-4 z-[100] flex flex-col gap-2 md:bottom-8">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium shadow-lg animate-in slide-in-from-right-full fade-in duration-300",
            toast.type === "success" && "border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-300",
            toast.type === "error" && "border-destructive/20 bg-destructive/10 text-destructive",
            toast.type === "info" && "border-blue-500/20 bg-blue-500/10 text-blue-600 dark:text-blue-300"
          )}
        >
          {toast.type === "success" && <CheckCircle className="h-4 w-4 shrink-0" />}
          {toast.type === "error" && <XCircle className="h-4 w-4 shrink-0" />}
          {toast.type === "info" && <Info className="h-4 w-4 shrink-0" />}
          {toast.message}
        </div>
      ))}
    </div>
  );
}
