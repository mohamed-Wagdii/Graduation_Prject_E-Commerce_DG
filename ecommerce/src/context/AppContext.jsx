import { createContext, useState, useEffect, useContext } from "react";

export const AppContext = createContext();

export const useApp = () => useContext(AppContext);

export default function AppContextProvider({ children }) {

  const savedUser = localStorage.getItem("user");
  const [user, setUser] = useState(savedUser ? JSON.parse(savedUser) : null);

  const [cart, setCart] = useState([]);
  const [dark, setDark] = useState(localStorage.getItem("dark") === "true");
  const [lang, setLang] = useState(localStorage.getItem("lang") || "en");

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("dark", dark);
  }, [dark]);

  useEffect(() => {
    document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
    localStorage.setItem("lang", lang);
  }, [lang]);

  const login = async (role, email, password) => {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!data.token) {
      return { success: false, message: data.msg || "Login failed" };
    }

    if (data.role !== role) {
      return { success: false, message: role === "admin" ? "You are not an admin!" : "You are not a user!" };
    }

    const userData = { token: data.token, role: data.role };
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);

    return { success: true };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setCart([]);
  };

  const addToCart = (product) => {
    const exists = cart.find((p) => p._id === product._id);
    if (exists) {
      setCart(cart.map((p) => p._id === product._id ? { ...p, quantity: p.quantity + 1 } : p));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((p) => p._id !== id));
  };

  const updateQuantity = (id, quantity) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart(cart.map((p) => p._id === id ? { ...p, quantity } : p));
    }
  };

  const t = (en, ar) => lang === "ar" ? ar : en;

  return (
    <AppContext.Provider value={{ user, login, logout, cart, addToCart, removeFromCart, updateQuantity, dark, setDark, lang, setLang, t }}>
      {children}
    </AppContext.Provider>
  );
}
