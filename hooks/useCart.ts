import { Product } from "@/payload-types";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

export type CartItemType = {
  product: Product;
};

type CartType = {
  items: CartItemType[];
  addItem: (product: Product) => void;
  removeItem: (productId: Product["id"]) => void;
  clearCart: () => void;
};

export const useCart = create<CartType>()(
  persist(
    (set) => ({
      items: [],
      addItem: (product) =>
        set((state) => {
          return {
            items: [...state.items, { product }],
          };
        }),
      removeItem: (productId) =>
        set((state) => {
          return {
            items: state.items.filter((item) => item.product.id !== productId),
          };
        }),
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
