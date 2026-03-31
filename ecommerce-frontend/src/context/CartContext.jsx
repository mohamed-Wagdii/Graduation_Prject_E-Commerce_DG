import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { cartAPI } from "../services/api";
import { useAuth } from "./AuthContext";
import toast from "react-hot-toast";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load cart from server when authenticated
  useEffect(() => {
    if (!isAuthenticated) { setItems([]); return; }
    setLoading(true);
    cartAPI.get()
      .then((res) => setItems(res.data.items || []))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [isAuthenticated]);

  const addItem = useCallback(async (productId, quantity = 1) => {
    try {
      const res = await cartAPI.addItem({ productId, quantity });
      setItems(res.data.items || []);
      toast.success("Added to cart");
    } catch {
      toast.error("Failed to add to cart");
    }
  }, []);

  const updateItem = useCallback(async (itemId, quantity) => {
    try {
      const res = await cartAPI.updateItem(itemId, { quantity });
      setItems(res.data.items || []);
    } catch {
      toast.error("Failed to update cart");
    }
  }, []);

  const removeItem = useCallback(async (itemId) => {
    try {
      const res = await cartAPI.removeItem(itemId);
      setItems(res.data.items || []);
      toast.success("Removed from cart");
    } catch {
      toast.error("Failed to remove item");
    }
  }, []);

  const clearCart = useCallback(async () => {
    try {
      await cartAPI.clear();
      setItems([]);
    } catch {}
  }, []);

  const itemCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);

  return (
    <CartContext.Provider value={{ items, loading, itemCount, subtotal, addItem, updateItem, removeItem, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
