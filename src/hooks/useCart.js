import create from 'zustand'

export const useCart = create((set) => ({
  items: [],
  addItem: (item) => 
    set((state) => ({ 
      items: [...state.items, item] 
    })),
  removeItem: (itemId) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== itemId)
    })),
  clearCart: () => set({ items: [] }),
  openCart: () => set({ isOpen: true }),
  closeCart: () => set({ isOpen: false }),
  isOpen: false,
})) 