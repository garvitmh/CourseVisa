import { createContext, useState, useEffect, ReactNode } from 'react';
import { Course, Cart, CartContextType, CartItem } from '../types';
import { STORAGE_KEYS } from '../constants';

const CartContext = createContext<CartContextType | undefined>(undefined);

export { CartContext };

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [totalItems, setTotalItems] = useState(0);
  const normalizeId = (value: unknown) => String(value ?? '');

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem(STORAGE_KEYS.cartItems);
    if (storedCart) {
      try {
        const parsed = JSON.parse(storedCart);
        if (Array.isArray(parsed)) {
          setItems(parsed.map((item) => ({
            ...item,
            courseId: normalizeId(item.courseId),
            addedAt: item.addedAt ? new Date(item.addedAt) : new Date(),
          })));
        }
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
    const courseId = normalizeId(course.id || (course as any)._id);
    if (!courseId) return;

    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.courseId === courseId);
      if (existingItem) {
        return prevItems.map(item =>
          item.courseId === courseId
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [
        ...prevItems,
        {
          courseId,
          course: { ...course, id: courseId },
          quantity: 1,
          addedAt: new Date(),
        },
      ];
    });
  };

  const removeFromCart = (courseId: string) => {
    const normalizedCourseId = normalizeId(courseId);
    setItems(prevItems => prevItems.filter(item => item.courseId !== normalizedCourseId));
  };

  const updateQuantity = (courseId: string, quantity: number) => {
    const normalizedCourseId = normalizeId(courseId);
    if (quantity <= 0) {
      removeFromCart(normalizedCourseId);
      return;
    }
    setItems(prevItems =>
      prevItems.map(item =>
        item.courseId === normalizedCourseId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const isInCart = (courseId: string): boolean => {
    const normalizedCourseId = normalizeId(courseId);
    return items.some(item => item.courseId === normalizedCourseId);
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
