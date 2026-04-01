import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Navbar() {
  const { user, logout, cart, dark, setDark, lang, setLang, t } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [search, setSearch] = useState("");
  const [showProfile, setShowProfile] = useState(false);

  const handleLogout = () => { logout(); navigate("/"); };
  const isActive = (path) => location.pathname === path;

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/app/products?search=${search.trim()}`);
      setSearch("");
    }
  };

  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-colors">
      <div className="max-w-6xl mx-auto px-6 py-3 flex items-center gap-4">

        {/* Logo */}
        <Link to="/app" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold text-gray-900 dark:text-white hidden sm:block">
            Micro<span className="text-blue-600">Electronics</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-sm">
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder={t("Search products...", "ابحث عن منتج...")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition text-gray-800 dark:text-white placeholder-gray-400"
            />
          </div>
        </form>

        {/* Links */}
        <div className="hidden md:flex items-center gap-1">
          {[{ path: "/app", label: t("Home", "الرئيسية") }, { path: "/app/products", label: t("Products", "المنتجات") }].map(({ path, label }) => (
            <Link key={path} to={path}
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${isActive(path) ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              {label}
            </Link>
          ))}
          {user && (
            <Link to="/app/my-orders"
              className={`px-3 py-2 rounded-lg font-medium text-sm transition-colors ${isActive("/app/my-orders") ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              {t("My Orders", "طلباتي")}
            </Link>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-2 ml-auto">

          {/* Dark Mode */}
          <button onClick={() => setDark(!dark)}
            className="p-2 rounded-lg text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            {dark ? "☀️" : "🌙"}
          </button>

          {/* Language */}
          <button onClick={() => setLang(lang === "en" ? "ar" : "en")}
            className="px-2.5 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            {lang === "en" ? "ع" : "EN"}
          </button>

          {/* Cart */}
          <Link to="/app/cart" className="relative p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
            <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {cart.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {cart.length}
              </span>
            )}
          </Link>

          {/* Profile / Login */}
          {user ? (
            <div className="relative">
              <button onClick={() => setShowProfile(!showProfile)}
                className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-sm hover:opacity-90 transition-opacity">
                {user.role === "admin" ? "👑" : "👤"}
              </button>

              {showProfile && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b border-gray-50 dark:border-gray-800">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase">{user.role}</p>
                  </div>
                  {[
                    { label: t("Profile", "الملف الشخصي"), to: "/app/profile", icon: "👤" },
                    { label: t("My Orders", "طلباتي"), to: "/app/my-orders", icon: "📦" },
                    { label: t("Cart", "السلة"), to: "/app/cart", icon: "🛒" },
                    ...(user.role === "admin" ? [{ label: t("Dashboard", "لوحة التحكم"), to: "/admin", icon: "⚙️" }] : []),
                  ].map((item) => (
                    <Link key={item.to} to={item.to} onClick={() => setShowProfile(false)}
                      className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <span>{item.icon}</span> {item.label}
                    </Link>
                  ))}
                  <button onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border-t border-gray-50 dark:border-gray-800">
                    🚪 {t("Logout", "خروج")}
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link to="/login" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-colors">
              {t("Sign In", "دخول")}
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
