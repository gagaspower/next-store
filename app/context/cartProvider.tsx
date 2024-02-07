"use client";
import { TProduct } from "@/interface/product";
import React, { createContext, useContext, useState } from "react";

export type ICartData = {
  cart_product_id: number | undefined;
  cart_product_qty: number;
  cart_product_variant_id: number;
  cart_user_id: number;
  product: TProduct | undefined;
};

export type ICartContext = {
  cart: ICartData[];
  setCart: React.Dispatch<React.SetStateAction<ICartData[]>>;
};

export const CartContext = createContext<ICartContext | undefined>(undefined);

export const useCartContext = (): ICartContext => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("CartContext must be used within an CartProvider");
  }
  return context;
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<ICartData[]>([]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
}
