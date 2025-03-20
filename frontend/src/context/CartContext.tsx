import React, { createContext, useState, useContext, ReactNode } from 'react';

// Definición de tipos
export interface Product {
  productId: string;
  price: number;
  quantity: number;
  discount: number;
}

export interface Cart {
  products: Product[];
}

interface CartContextType {
  cart: Cart | null;
  setCart: (cart: Cart | null) => void;
  clearCart: () => void;
  hasCart: boolean;
}

// Creación del contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// Hook personalizado para acceder al contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
};

// Proveedor del contexto
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<Cart | null>(null);

  const clearCart = () => {
    setCart(null);
  };

  const value = {
    cart,
    setCart,
    clearCart,
    hasCart: cart !== null && cart.products.length > 0
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export default CartContext;