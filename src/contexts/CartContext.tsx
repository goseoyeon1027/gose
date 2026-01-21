import { createContext, useContext, useState, useRef, ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  description: string;
  image: string;
  price: string;
  cartItemId?: string; // 카트 내 고유 ID
  quantity?: number; // 상품 개수
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => boolean; // 중복 여부 반환 (true: 중복, false: 추가됨)
  removeFromCart: (cartItemId: string) => void;
  removeFromCartById: (itemId: number) => void; // id로 제거
  clearCart: () => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  isInCart: (itemId: number) => boolean;
  cartCount: number;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const cartItemsRef = useRef<CartItem[]>([]);
  
  // cartItems가 변경될 때마다 ref 업데이트
  cartItemsRef.current = cartItems;

  const addToCart = (item: CartItem): boolean => {
    setCartItems((prev) => {
      // 같은 상품 ID를 가진 첫 번째 항목 찾기
      const existingItemIndex = prev.findIndex((cartItem) => cartItem.id === item.id);
      
      if (existingItemIndex !== -1) {
        // 이미 있는 상품이면 수량만 증가
        const updatedItems = prev.map((cartItem, index) => {
          if (index === existingItemIndex) {
            return {
              ...cartItem,
              quantity: (cartItem.quantity || 1) + 1,
            };
          }
          return cartItem;
        });
        cartItemsRef.current = updatedItems;
        return updatedItems;
      } else {
        // 없는 상품이면 새로 추가
        const cartItemId = `${item.id}-${Date.now()}-${Math.random()}`;
        const newItem = { ...item, cartItemId, quantity: 1 };
        const newCartItems = [...prev, newItem];
        cartItemsRef.current = newCartItems;
        return newCartItems;
      }
    });
    
    return false;
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    if (quantity < 1) return; // 수량은 1 미만으로 내려가지 않음
    setCartItems((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId
          ? { ...item, quantity }
          : item
      )
    );
  };

  const isInCart = (itemId: number): boolean => {
    return cartItems.some((item) => item.id === itemId);
  };

  const removeFromCart = (cartItemId: string) => {
    setCartItems((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const removeFromCartById = (itemId: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== itemId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const cartCount = cartItems.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const openCart = () => {
    setIsCartOpen(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, removeFromCartById, clearCart, updateQuantity, isInCart, cartCount, isCartOpen, openCart, closeCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

