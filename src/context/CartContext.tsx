import React, { createContext, useContext, useState, ReactNode } from "react";

// Cart item type
export interface CartItem {
  itemId: number;
  slug: string; // restaurant slug
  name: string;
  price: number;
  quantity: number;
  image?: string;
  modifiers: {
    groupId: number;
    modifierId: number;
    name: string;
    price: number;
  }[];
}

interface CartContextType {
  items: CartItem[];
  restaurantSlug: string | null;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  totalPrice: number;
  totalItems: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface Props {
  children: ReactNode;
}

export function CartProvider({ children }: Props) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [restaurantSlug, setRestaurantSlug] = useState<string | null>(null);

  const addItem = (newItem: CartItem) => {
    // If item is from another restaurant -> clear cart
    if (restaurantSlug && restaurantSlug !== newItem.slug) {
      setItems([newItem]);
      setRestaurantSlug(newItem.slug);
      return;
    }

    setRestaurantSlug(newItem.slug);

    setItems((prev) => {
      const existingItem = prev.find((i) => i.itemId === newItem.itemId);

      if (existingItem) {
        return prev.map((i) =>
          i.itemId === newItem.itemId
            ? { ...i, quantity: i.quantity + newItem.quantity }
            : i,
        );
      }

      return [...prev, newItem];
    });
  };

  const removeItem = (itemId: number) => {
    setItems((prev) => prev.filter((item) => item.itemId !== itemId));
  };

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setItems((prev) =>
      prev.map((item) =>
        item.itemId === itemId ? { ...item, quantity } : item,
      ),
    );
  };

  const clearCart = () => {
    setItems([]);
    setRestaurantSlug(null);
  };

  const totalPrice = items.reduce((sum, item) => {
    const modifierTotal = item.modifiers.reduce((s, m) => s + m.price, 0);
    return sum + (item.price + modifierTotal) * item.quantity;
  }, 0);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        restaurantSlug,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalPrice,
        totalItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart must be used within CartProvider");
  }

  return context;
};
