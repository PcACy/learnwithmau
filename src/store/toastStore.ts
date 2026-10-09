import { create } from 'zustand';

export type ToastKind = 'achievement' | 'level' | 'goal' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  title: string;
  body?: string;
}

interface ToastState {
  toasts: Toast[];
  push(toast: Omit<Toast, 'id'>): void;
  dismiss(id: number): void;
}

let nextId = 1;

export const useToastStore = create<ToastState>()((set) => ({
  toasts: [],
  push(toast) {
    set((s) => ({ toasts: [...s.toasts, { ...toast, id: nextId++ }].slice(-4) }));
  },
  dismiss(id) {
    set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
  },
}));
