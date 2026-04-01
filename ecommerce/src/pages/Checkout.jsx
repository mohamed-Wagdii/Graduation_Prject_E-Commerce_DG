import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const API = "http://localhost:3000/api";

export default function Checkout() {
  const { user, cart, removeFromCart, t } = useContext(AppContext);
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash_on_delivery");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axios.post(`${API}/orders`,
        { shippingAddress: address, paymentMethod },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      cart.forEach(item => removeFromCart(item._id));
      navigate("/app/order-success", { state: { order: res.data.data } });
    } catch (err) {
      setError(err.response?.data?.msg || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
      <p className="text-5xl">🛒</p>
      <p className="text-gray-500 dark:text-gray-400 font-medium">{t("Your cart is empty", "سلتك فارغة")}</p>
      <button onClick={() => navigate("/app")} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-medium">
        {t("Browse Products", "تصفح المنتجات")}
      </button>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-8">{t("Checkout", "إتمام الطلب")}</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Form */}
        <form onSubmit={onSubmit} className="space-y-5">
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 dark:text-white mb-4">📦 {t("Shipping Address", "عنوان الشحن")}</h2>
            <textarea
              placeholder={t("Enter your full address...", "أدخل عنوانك الكامل...")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              rows={3}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition resize-none"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm">
            <h2 className="font-bold text-gray-800 dark:text-white mb-4">💳 {t("Payment Method", "طريقة الدفع")}</h2>
            <div className="space-y-3">
              {[
                { value: "cash_on_delivery", label: t("Cash on Delivery", "الدفع عند الاستلام"), icon: "💵" },
                { value: "credit_card", label: t("Credit Card", "بطاقة ائتمان"), icon: "💳" },
                { value: "paypal", label: "PayPal", icon: "🅿️" },
              ].map((m) => (
                <label key={m.value}
                  className={`flex items-center gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all ${paymentMethod === m.value ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-gray-300"}`}>
                  <input type="radio" name="payment" value={m.value} checked={paymentMethod === m.value}
                    onChange={() => setPaymentMethod(m.value)} className="hidden" />
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${paymentMethod === m.value ? "border-blue-500" : "border-gray-300"}`}>
                    {paymentMethod === m.value && <div className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                  <span className="text-lg">{m.icon}</span>
                  <span className="font-medium text-gray-700 dark:text-gray-300 text-sm">{m.label}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm bg-red-50 dark:bg-red-900/20 px-4 py-3 rounded-xl">⚠️ {error}</p>
          )}

          <button type="submit" disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-4 rounded-xl font-bold text-base transition-colors flex items-center justify-center gap-2">
            {loading
              ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              : `✅ ${t("Place Order", "تأكيد الطلب")}`}
          </button>
        </form>

        {/* Order Summary */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm h-fit">
          <h2 className="font-bold text-gray-800 dark:text-white mb-4">🧾 {t("Order Summary", "ملخص الطلب")}</h2>
          <div className="space-y-3 mb-4">
            {cart.map((item) => (
              <div key={item._id} className="flex items-center gap-3">
                <img src={item.image ? `http://localhost:3000/${item.image}` : "https://placehold.co/48x48?text=?"}
                  alt={item.name} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 dark:text-white truncate">{item.name}</p>
                  <p className="text-xs text-gray-400">x{item.quantity}</p>
                </div>
                <p className="font-bold text-blue-600 text-sm">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-100 dark:border-gray-800 pt-4 flex justify-between font-bold text-gray-800 dark:text-white">
            <span>{t("Total", "الإجمالي")}</span>
            <span className="text-blue-600 text-xl">${total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
