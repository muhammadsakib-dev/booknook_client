// Ready

"use client";

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";
import type { NormalizedBook } from "@/types/book";

export interface CartItem {
  book: NormalizedBook;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (book: NormalizedBook, quantity?: number) => boolean;
  removeFromCart: (bookId: string) => void;
  updateQuantity: (bookId: string, quantity: number) => void;
  clearCart: () => void;
  totalCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = "booknook-borrow-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Load saved borrow cart from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      if (saved) {
        setItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load borrow cart from storage", e);
    } finally {
      setIsInitialized(true);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        window.dispatchEvent(new Event("booknook:cart-updated"));
      } catch (e) {
        console.error("Failed to save borrow cart to storage", e);
      }
    }
  }, [items, isInitialized]);

  const addToCart = (book: NormalizedBook, quantityToAdd = 1): boolean => {
    if (!book.isAvailable || book.availableCopies <= 0) {
      return false;
    }

    const addedSuccessfully = true;

    setItems((prev) => {
      const existing = prev.find((item) => item.book.id === book.id);
      if (existing) {
        const newQty = Math.min(
          existing.quantity + quantityToAdd,
          book.availableCopies,
        );
        return prev.map((item) =>
          item.book.id === book.id ? { ...item, quantity: newQty } : item,
        );
      }

      const initialQty = Math.min(quantityToAdd, book.availableCopies);
      return [...prev, { book, quantity: initialQty }];
    });

    return addedSuccessfully;
  };

  const removeFromCart = (bookId: string) => {
    setItems((prev) => prev.filter((item) => item.book.id !== bookId));
  };

  const updateQuantity = (bookId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(bookId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => {
        if (item.book.id === bookId) {
          // Cap at available copies
          const maxAllowed = Math.min(quantity, item.book.availableCopies);
          return { ...item, quantity: maxAllowed };
        }
        return item;
      }),
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
