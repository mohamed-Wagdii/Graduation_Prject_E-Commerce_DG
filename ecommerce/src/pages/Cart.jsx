import React, { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, t } = useContext(AppContext);
  const navigate = useNavigate();
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const discount = promoApplied ? total * 0.1 : 0;
  const finalTotal = total - discount;

  const applyPromo = () => {
    if (promo.toLowerCase() === "micro10") setPromoApplied(true);
  };

  if (cart.length === 0) return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] gap-5">
      <div className="relative">
        <div className="w-32 h-32 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center text-6xl">🛒</div>
        <div className="absolute -top-1 -right-1 w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center text-sm font-bold text-gray-500">0</div>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t("Your cart is empty", "سلتك فارغة")}</h2>
        <p className="text-gray-400 max-w-sm">{t("Looks like you haven't added any products yet. Start shopping!", "يبدو أنك لم تضف أي منتجات بعد. ابدأ التسوق!")}</p>
      </div>
      <div className="flex gap-3">
        <Link to="/app" className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold transition-colors shadow-sm">
          {t("Browse Products", "تصفح المنتجات")}
        </Link>
        <Link to="/app/products" className="bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold transition-colors">
          {t("All Products", "جميع المنتجات")}
        </Link>
      </div>

      {/* Suggestions */}
      <div className="mt-8 w-full max-w-lg">
        <p className="text-center text-gray-400 text-sm mb-4">{t("You might like", "قد يعجبك")}</p>
        <div className="grid grid-cols-3 gap-3">
          {["Arduino Uno", "ESP32", "Sensor Kit"].map((name) => (
            <Link to="/app/products" key={name}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl p-3 text-center hover:border-blue-200 dark:hover:border-blue-800 transition-colors">
              <div className="text-2xl mb-1">📦</div>
              <p className="text-xs font-medium text-gray-700 dark:text-gray-300">{name}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 dark:text-white">{t("Shopping Cart", "سلة التسوق")}</h2>
          <p className="text-gray-400 text-sm mt-1">{itemCount} {t("items in your cart", "منتجات في سلتك")}</p>
        </div>
        <button onClick={() => cart.forEach(item => removeFromCart(item._id))}
          className="text-red-400 hover:text-red-600 text-sm font-medium flex items-center gap-1 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 rounded-xl transition-colors">
          🗑️ {t("Clear All", "مسح الكل")}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Cart Items ── */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5 flex items-center gap-5 hover:border-blue-100 dark:hover:border-blue-900 transition-all group">
              <div className="relative flex-shrink-0">
                <img src={item.image ? `http://localhost:3000/${item.image}` : "https://placehold.co/80x80?text=?"}
                  alt={item.name} className="w-20 h-20 object-cover rounded-xl" />
              </div>

              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-800 dark:text-white truncate text-base">{item.name}</h4>
                <p className="text-blue-600 font-bold text-lg">${item.price}</p>
                <p className="text-gray-400 text-xs">{t("per unit", "للوحدة")}</p>
              </div>

              <div className="flex flex-col items-end gap-3">
                <p className="font-bold text-gray-800 dark:text-white">${(item.price * item.quantity).toFixed(2)}</p>
                <div className="flex items-center gap-1 bg-gray-50 dark:bg-gray-800 rounded-xl p-1">
                  <button onClick={() => updateQuantity(item._id, item.quantity - 1)}
                    className="w-8 h-8 bg-white dark:bg-gray-700 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 rounded-lg font-bold text-gray-600 dark:text-white transition-colors shadow-sm text-lg leading-none">−</button>
                  <span className="font-bold w-8 text-center text-sm dark:text-white">{item.quantity}</span>
                  <button onClick={() => updateQuantity(item._id, item.quantity + 1)}
                    className="w-8 h-8 bg-white dark:bg-gray-700 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-500 rounded-lg font-bold text-gray-600 dark:text-white transition-colors shadow-sm text-lg leading-none">+</button>
                </div>
                <button onClick={() => removeFromCart(item._id)}
                  className="text-red-400 hover:text-red-600 text-xs font-medium transition-colors opacity-0 group-hover:opacity-100">
                  {t("Remove", "حذف")}
                </button>
              </div>
            </div>
          ))}

          {/* Continue Shopping */}
          <Link to="/app/products" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium text-sm p-4 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-2xl transition-colors border-2 border-dashed border-blue-200 dark:border-blue-900 justify-center">
            + {t("Continue Shopping", "مواصلة التسوق")}
          </Link>
        </div>

        {/* ── Order Summary ── */}
        <div className="space-y-4">
          {/* Promo Code */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
              🎟️ {t("Promo Code", "كود الخصم")}
            </h3>
            {promoApplied ? (
              <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600 px-4 py-3 rounded-xl text-sm font-medium">
                ✓ {t("10% discount applied!", "تم تطبيق خصم 10%!")}
              </div>
            ) : (
              <div className="flex gap-2">
                <input type="text" placeholder={t("Enter code...", "أدخل الكود...")} value={promo} onChange={(e) => setPromo(e.target.value)}
                  className="flex-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-3 py-2.5 text-sm outline-none focus:border-blue-500 transition" />
                <button onClick={applyPromo} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-xl font-medium text-sm transition-colors">
                  {t("Apply", "تطبيق")}
                </button>
              </div>
            )}
            <p className="text-gray-400 text-xs mt-2">{t('Try "MICRO10" for 10% off', 'جرب "MICRO10" للحصول على خصم 10%')}</p>
          </div>

          {/* Summary */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-5">
            <h3 className="font-bold text-gray-800 dark:text-white mb-4">{t("Order Summary", "ملخص الطلب")}</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{t("Subtotal", "المجموع")} ({itemCount} {t("items", "منتجات")})</span>
                <span className="font-medium text-gray-700 dark:text-gray-300">${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 dark:text-gray-400">
                <span>{t("Shipping", "الشحن")}</span>
                <span className="text-green-600 font-semibold">{t("Free 🎉", "مجاني 🎉")}</span>
              </div>
              {promoApplied && (
                <div className="flex justify-between text-green-600">
                  <span>{t("Discount (10%)", "خصم (10%)")}</span>
                  <span className="font-semibold">-${discount.toFixed(2)}</span>
                </div>
              )}
              <div className="border-t border-gray-100 dark:border-gray-800 pt-3 flex justify-between font-bold text-gray-800 dark:text-white">
                <span className="text-base">{t("Total", "الإجمالي")}</span>
                <span className="text-2xl text-blue-600">${finalTotal.toFixed(2)}</span>
              </div>
            </div>

            <button onClick={() => navigate("/app/checkout")} className="w-full mt-5 bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-base transition-colors shadow-lg shadow-blue-200 dark:shadow-blue-900/30 flex items-center justify-center gap-2">
              {t("Proceed to Checkout", "إتمام الشراء")} →
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
              {["🔒 Secure", "📦 Fast", "↩️ Easy Returns"].map((b) => (
                <span key={b} className="text-xs text-gray-400 font-medium">{b}</span>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-4">
            <p className="text-xs text-gray-400 text-center mb-3">{t("We accept", "نقبل")}</p>
            <div className="flex justify-center gap-3">
              {["💳 Visa", "💳 Mastercard", "💵 Cash"].map((m) => (
                <span key={m} className="text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg text-gray-600 dark:text-gray-400 font-medium">{m}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
