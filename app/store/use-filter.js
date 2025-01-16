import { create } from "zustand";

export const useFilter = create((set) => ({
    isFilter: false,
    onFilterOpen: () => set({ isFilter: true }),
    onFilterClose: () => set({ isFilter: false }),
}))