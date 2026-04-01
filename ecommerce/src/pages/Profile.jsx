import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

export default function Profile() {
  const { user, logout, cart, t } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t("My Profile", "ملفي الشخصي")}</h1>

      {/* User Card */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8 flex items-center gap-6">
        <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold flex-shrink-0">
          {user?.role === "admin" ? "👑" : "👤"}
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white">{t("Welcome!", "أهلاً!")}</h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${user?.role === "admin" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600" : "bg-blue-100 dark:bg-blue-900/30 text-blue-600"}`}>
              {user?.role === "admin" ? "👑 Admin" : "👤 User"}
            </span>
          </div>
          <p className="text-gray-400 text-sm">{t("Manage your account and orders", "إدارة حسابك وطلباتك")}</p>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center shadow-sm">
          <p className="text-3xl font-bold text-blue-600 mb-1">{cart.length}</p>
          <p className="text-gray-400 text-sm">{t("Items in Cart", "منتجات في السلة")}</p>
        </div>
        <Link to="/app/my-orders" className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center shadow-sm hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
          <p className="text-3xl mb-1">📦</p>
          <p className="text-gray-400 text-sm">{t("My Orders", "طلباتي")}</p>
        </Link>
      </div>

      {/* Quick Links */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
        {[
          { icon: "🛒", label: t("My Cart", "سلتي"), to: "/app/cart" },
          { icon: "📦", label: t("My Orders", "طلباتي"), to: "/app/my-orders" },
          { icon: "🏠", label: t("Home", "الرئيسية"), to: "/app" },
          ...(user?.role === "admin" ? [{ icon: "⚙️", label: t("Admin Dashboard", "لوحة التحكم"), to: "/admin" }] : []),
        ].map((item) => (
          <Link key={item.to} to={item.to}
            className="flex items-center gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0">
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium text-gray-700 dark:text-gray-300">{item.label}</span>
            <span className="ml-auto text-gray-300 dark:text-gray-600">→</span>
          </Link>
        ))}
      </div>

      {/* Logout */}
      <button onClick={handleLogout}
        className="w-full bg-red-50 dark:bg-red-900/20 hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 py-3.5 rounded-2xl font-semibold transition-colors border border-red-200 dark:border-red-800">
        🚪 {t("Logout", "تسجيل الخروج")}
      </button>
    </div>
  );
}
