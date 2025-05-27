import { create } from 'zustand';
export const useUserStore = create((set) => ({
    user: null,
    student: null,
    setUserAndStudent: ({ user, student }: any) => set({ user, student }),
    logout: () => set({ user: null, student: null }),
  }));
  