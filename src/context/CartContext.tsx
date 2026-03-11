import { createContext, useState, useEffect, ReactNode } from 'react';
import { Course, Cart, CartContextType, CartItem } from '../types';
import { STORAGE_KEYS } from '../constants';

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(STORAGE_KEYS.cartItems);
    if (storedCart) {
      try {
        setItems(JSON.parse(storedCart));
      } catch (err) {
        console.error('Failed to parse stored cart:', err);
      }
    }
  }, []);

  // Update localStorage when cart changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.cartItems, JSON.stringify(items));
    
    // Calculate totals
    const newTotal = items.reduce((sum, item) => sum + item.course.price * item.quantity, 0);
    const newCount = items.reduce((count, item) => count + item.quantity, 0);
    setTotalPrice(newTotal);
    setTotalItems(newCount);
  }, [items]);


  const addToCart = (course: Course) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.courseId === course.id);
      if (existingItem) {
        return prevItems.map(item =>
          item.courseId === course.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          courseId: course.id,
          course,
          quantity: 1,
          addedAt: new Date(),
        },
      ];
    });
  };

  const removeFromCart = (courseId: number) => {
    setItems(prevItems => prevItems.filter(item => item.courseId !== courseId));
  };

  const updateQuantity = (courseId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(courseId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.courseId === courseId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (courseId: number): boolean => {
    return items.some(item => item.courseId === courseId);
  };

  const cart: Cart = {
    items,
    totalPrice,
    totalItems,
  };

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
