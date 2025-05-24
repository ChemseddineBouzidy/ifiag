import { create } from 'zustand';
export const useUserStore = create((set) => ({
    user: null,
    student: null,
    setUserAndStudent: ({ user, student }) => set({ user, student }),
    logout: () => set({ user: null, student: null }),
  }));
  