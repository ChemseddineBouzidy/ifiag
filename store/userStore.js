import { create } from 'zustand';
export const useUserStore = create((set) => ({
    user: null,
    student: null,
    setUserAndStudent: ({ user, student }) => set({ user, student }),
    clearUserAndStudent: () => set({ user: null, student: null }),
  }));
  