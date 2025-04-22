import { create } from "zustand";

// Email store with persist (because it’s not very sensitive)
import { persist } from 'zustand/middleware';

export const useEmailStore = create(persist(
    (set) => ({
        email: '',
        setEmail: (email) => set({ email }),
        clearEmail: () => set({ email: '' }),
    }),
    {
        name: "email-storage",
        getStorage: () => sessionStorage,
    }
));

// Separate store for verification code (not persisted)
export const useVerificationStore = create((set) => ({
    code: '',
    setCode: (code) => set({ code }),
    clearCode: () => set({ code: '' }),
}));
