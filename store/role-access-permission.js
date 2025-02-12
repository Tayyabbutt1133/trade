import { create } from "zustand";

const roleAccessStore = create((set) => ({
  role: null, // Store the role object
  setRole: (roleData) => set({ role: roleData }), // Setter function
}));

export default roleAccessStore;
