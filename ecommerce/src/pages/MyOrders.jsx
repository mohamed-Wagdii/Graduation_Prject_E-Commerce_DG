import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const API = "http://localhost:3000/api";

const statusColors = {
  pending:   "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600",
  confirmed: "bg-blue-100 dark:bg-blue-900/30 text-blue-600",
  shipped:   "bg-purple-100 dark:bg-purple-900/30 text-purple-600",
  delivered: "bg-green-100 dark:bg-green-900/30 text-green-600",
  cancelled: "bg-red-100 dark:bg-red-900/30 text-red-500",
};

const statusIcons = {
  pending: "⏳", confirmed: "✅", shipped: "🚚", delivered: "📦", cancelled: "❌",
};

export default function MyOrders() {
  const { user, t } = useContext(AppContext);
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => {
    axios.get(`${API}/orders/my-orders`, {
      headers: { Authorization: `Bearer ${user?.token}` },
    })
      .then((res) => setOrders(res.data.data || []))
      .catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const cancelOrder = async (id) => {
    if (!window.confirm(t("Cancel this order?", "إلغاء هذا الطلب؟"))) return;
    setCancelling(id);
    try {
      await axios.put(`${API}/orders/${id}/cancel`, {}, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });
      setOrders(orders.map((o) => o._id === id ? { ...o, status: "cancelled" } : o));
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to cancel");
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 animate-pulse">
          <div className="flex justify-between mb-4">
            <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-32" />
            <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-20" />
          </div>
          <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-48" />
        </div>
      ))}
    </div>
  );

  if (orders.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-6xl">📭</p>
      <h2 className="text-xl font-bold text-gray-700 dark:text-white">{t("No orders yet", "لا توجد طلبات بعد")}</h2>
      <p className="text-gray-400 text-sm">{t("Start shopping to place your first order!", "ابدأ التسوق لتضع طلبك الأول!")}</p>
      <button onClick={() => navigate("/app")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
        {t("Browse Products", "تصفح المنتجات")}
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t("My Orders", "طلباتي")}</h1>
          <p className="text-gray-400 text-sm mt-1">{orders.length} {t("orders", "طلبات")}</p>
        </div>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-gray-50 dark:border-gray-800">
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs text-gray-400 font-mono">#{order._id.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.status]}`}>
                  {statusIcons[order.status]} {order.status}
                </span>
                <span className="font-bold text-blue-600 text-lg">${order.totalPrice}</span>
              </div>
            </div>

            {/* Items */}
            <div className="p-5">
              <div className="flex flex-wrap gap-3 mb-4">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 rounded-xl px-3 py-2">
                    <img
                      src={item.product?.image ? `http://localhost:3000/${item.product.image}` : "https://placehold.co/32x32?text=?"}
                      alt={item.product?.name}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                    <div>
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{item.product?.name || "Product"}</p>
                      <p className="text-xs text-gray-400">x{item.quantity} · ${item.priceAtPurchase}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                  <span>📍</span>
                  <span className="truncate max-w-xs">{order.shippingAddress}</span>
                </div>

                {order.status === "pending" && (
                  <button
                    onClick={() => cancelOrder(order._id)}
                    disabled={cancelling === order._id}
                    className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-4 py-2 rounded-xl text-sm font-medium transition-colors disabled:opacity-50 flex items-center gap-1">
                    {cancelling === order._id
                      ? <div className="w-3 h-3 border-2 border-red-400 border-t-transparent rounded-full animate-spin" />
                      : "❌"} {t("Cancel", "إلغاء")}
                  </button>
                )}
              </div>
            </div>

            {/* Status Bar */}
            {order.status !== "cancelled" && (
              <div className="px-5 pb-5">
                <div className="flex items-center gap-1">
                  {["pending", "confirmed", "shipped", "delivered"].map((s, i, arr) => {
                    const currentIndex = arr.indexOf(order.status);
                    const isDone = i <= currentIndex;
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <div className={`w-full h-1.5 rounded-full transition-colors ${isDone ? "bg-blue-500" : "bg-gray-100 dark:bg-gray-800"}`} />
                        {i === arr.length - 1 && (
                          <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isDone ? "bg-blue-500" : "bg-gray-200 dark:bg-gray-700"}`} />
                        )}
                      </div>
                    );
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  {["Pending", "Confirmed", "Shipped", "Delivered"].map((s) => (
                    <span key={s} className="text-xs text-gray-400">{t(s, { Pending: "قيد الانتظار", Confirmed: "مؤكد", Shipped: "تم الشحن", Delivered: "تم التسليم" }[s])}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
