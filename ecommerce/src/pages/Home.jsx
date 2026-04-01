import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function ProductCard({ product, onAddToCart, t }) {
  const [added, setAdded] = useState(false);
  const handle = () => { onAddToCart(product); setAdded(true); setTimeout(() => setAdded(false), 1500); };
  return (
    <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
      <div className="relative overflow-hidden">
        <img src={product.image ? `http://localhost:3000/${product.image}` : "https://placehold.co/300x220?text=No+Image"} alt={product.name}
          className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        {product.stock <= 5 && product.stock > 0 && (
          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-lg">
            🔥 {t(`Only ${product.stock} left!`, `باقي ${product.stock} فقط!`)}
          </span>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm">
            <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full text-sm shadow-lg">{t("Out of Stock", "نفذ المخزون")}</span>
          </div>
        )}
        <Link to={`/app/products/${product._id}`}
          className="absolute top-3 right-3 w-8 h-8 bg-white/90 dark:bg-gray-800/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all shadow-md hover:scale-110">
          <svg className="w-4 h-4 text-gray-700 dark:text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
      </div>
      <div className="p-5">
        <Link to={`/app/products/${product._id}`}>
          <h4 className="font-semibold text-gray-800 dark:text-white mb-1 hover:text-blue-600 transition-colors line-clamp-1 text-base">{product.name}</h4>
        </Link>
        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-blue-600">${product.price}</span>
          <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${product.stock > 0 ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "bg-red-50 dark:bg-red-900/20 text-red-500"}`}>
            {product.stock > 0 ? `✓ ${product.stock} ${t("left", "متبقي")}` : t("Sold out", "نفذ")}
          </span>
        </div>
        <button onClick={handle} disabled={product.stock === 0}
          className={`w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 flex items-center justify-center gap-2 ${added ? "bg-green-500 text-white scale-95" : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed text-white disabled:text-gray-400"}`}>
          {added ? <>✓ {t("Added!", "تمت الإضافة!")}</> : <>{t("Add to Cart", "أضف للسلة")}</>}
        </button>
      </div>
    </div>
  );
}

const categories = [
  { icon: "🤖", label: "Arduino", labelAr: "أردوينو", color: "from-blue-500 to-blue-600" },
  { icon: "📡", label: "Sensors", labelAr: "مستشعرات", color: "from-purple-500 to-purple-600" },
  { icon: "🔋", label: "Power", labelAr: "طاقة", color: "from-green-500 to-green-600" },
  { icon: "📟", label: "Displays", labelAr: "شاشات", color: "from-orange-500 to-orange-600" },
  { icon: "📶", label: "Wireless", labelAr: "لاسلكي", color: "from-pink-500 to-pink-600" },
  { icon: "🛠️", label: "Tools", labelAr: "أدوات", color: "from-indigo-500 to-indigo-600" },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart, t } = useContext(AppContext);

  useEffect(() => {
    axios.get("http://localhost:3000/api/product")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-16">

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 rounded-3xl p-12 overflow-hidden min-h-[340px] flex items-center">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-indigo-400/20 rounded-full translate-y-1/2" />
        <div className="absolute top-8 right-12 grid grid-cols-3 gap-2 opacity-20">
          {[...Array(9)].map((_, i) => <div key={i} className="w-2 h-2 bg-white rounded-full" />)}
        </div>
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm text-white text-xs font-semibold px-4 py-1.5 rounded-full mb-5 border border-white/20">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            ⚡ {t("Best Electronics Store in Egypt", "أفضل متجر إلكترونيات في مصر")}
          </span>
          <h1 className="text-5xl font-bold text-white mb-4 leading-tight">
            {t("Build Your Next", "ابنِ مشروعك")}
            <span className="block text-blue-200">{t("Big Project", "القادم الآن")}</span>
          </h1>
          <p className="text-blue-100/90 text-lg mb-8 leading-relaxed max-w-lg">
            {t("Find Arduino, sensors, modules and everything you need for your electronics projects.", "اعثر على Arduino والمستشعرات والوحدات وكل ما تحتاجه لمشاريعك الإلكترونية.")}
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link to="/app/products" className="bg-white text-blue-600 font-bold px-7 py-3.5 rounded-2xl hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-0.5 hover:shadow-blue-900/30">
              {t("Shop Now →", "تسوق الآن ←")}
            </Link>
            <Link to="/app/cart" className="bg-white/15 backdrop-blur-sm text-white font-semibold px-7 py-3.5 rounded-2xl hover:bg-white/25 transition-all border border-white/25">
              {t("View Cart 🛒", "عرض السلة 🛒")}
            </Link>
          </div>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { value: "500+", en: "Products", ar: "منتج", icon: "📦", color: "text-blue-600" },
          { value: "10K+", en: "Customers", ar: "عميل", icon: "👥", color: "text-purple-600" },
          { value: "99%", en: "Satisfaction", ar: "رضا العملاء", icon: "⭐", color: "text-yellow-500" },
          { value: "24/7", en: "Support", ar: "دعم فني", icon: "💬", color: "text-green-600" },
        ].map((s) => (
          <div key={s.en} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
            <div className="text-3xl mb-2">{s.icon}</div>
            <div className={`text-3xl font-bold ${s.color} mb-1`}>{s.value}</div>
            <div className="text-gray-500 dark:text-gray-400 text-sm font-medium">{t(s.en, s.ar)}</div>
          </div>
        ))}
      </div>

      {/* ── Categories ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{t("Browse Categories", "تصفح الفئات")}</h2>
            <p className="text-gray-400 text-sm mt-1">{t("Find what you need fast", "اعثر على ما تحتاجه بسرعة")}</p>
          </div>
        </div>
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {categories.map((c) => (
            <Link to="/app/products" key={c.label}
              className="group flex flex-col items-center gap-3 p-4 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 hover:border-blue-200 dark:hover:border-blue-800 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
              <div className={`w-12 h-12 bg-gradient-to-br ${c.color} rounded-xl flex items-center justify-center text-2xl shadow-md group-hover:scale-110 transition-transform`}>
                {c.icon}
              </div>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">{t(c.label, c.labelAr)}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* ── Features ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: "🚚", en: ["Fast Delivery", "Get your components delivered to your door quickly"], ar: ["توصيل سريع", "احصل على مكوناتك بسرعة لباب بيتك"], bg: "bg-blue-50 dark:bg-blue-900/20", iconBg: "bg-blue-100 dark:bg-blue-900/40" },
          { icon: "🔒", en: ["Secure Payment", "100% safe and encrypted checkout process"], ar: ["دفع آمن", "عملية دفع آمنة ومشفرة 100%"], bg: "bg-green-50 dark:bg-green-900/20", iconBg: "bg-green-100 dark:bg-green-900/40" },
          { icon: "↩️", en: ["Easy Returns", "Hassle-free 30-day return policy"], ar: ["إرجاع سهل", "سياسة إرجاع سهلة خلال 30 يوم"], bg: "bg-purple-50 dark:bg-purple-900/20", iconBg: "bg-purple-100 dark:bg-purple-900/40" },
        ].map((f) => (
          <div key={f.en[0]} className={`${f.bg} rounded-2xl p-6 flex items-start gap-4 border border-transparent`}>
            <div className={`${f.iconBg} w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0`}>{f.icon}</div>
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-1">{t(f.en[0], f.ar[0])}</h4>
              <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{t(f.en[1], f.ar[1])}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Latest Products ── */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">🔥 {t("Latest Products", "أحدث المنتجات")}</h2>
            <p className="text-gray-400 text-sm mt-1">{t("Fresh arrivals just for you", "وصل حديثاً خصيصاً لك")}</p>
          </div>
          <Link to="/app/products" className="flex items-center gap-1 text-blue-600 hover:text-blue-700 font-semibold text-sm bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl transition-colors">
            {t("View all", "عرض الكل")} →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
                <div className="w-full h-52 bg-gray-100 dark:bg-gray-800" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
                  <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
                  <div className="h-10 bg-gray-100 dark:bg-gray-800 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 8).map((product) => (
              <ProductCard key={product._id} product={product} onAddToCart={addToCart} t={t} />
            ))}
          </div>
        )}
      </div>

      {/* ── Banner CTA ── */}
      <div className="relative bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl p-10 overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full translate-x-1/3 -translate-y-1/3" />
        <div className="relative z-10">
          <h3 className="text-2xl font-bold text-white mb-2">{t("New to MicroElectronics?", "جديد في MicroElectronics؟")}</h3>
          <p className="text-blue-100">{t("Create an account and get access to exclusive deals.", "أنشئ حساباً واحصل على عروض حصرية.")}</p>
        </div>
        <Link to="/register" className="relative z-10 bg-white text-blue-600 font-bold px-8 py-3.5 rounded-2xl hover:bg-blue-50 transition-colors shadow-xl whitespace-nowrap flex-shrink-0">
          {t("Get Started Free →", "ابدأ مجاناً ←")}
        </Link>
      </div>

      {/* ── Newsletter ── */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 p-10 text-center shadow-sm">
        <div className="text-4xl mb-4">📬</div>
        <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{t("Stay Updated", "ابقَ على اطلاع")}</h3>
        <p className="text-gray-400 mb-6 max-w-md mx-auto">{t("Subscribe to get the latest products and deals delivered to your inbox.", "اشترك للحصول على أحدث المنتجات والعروض في بريدك.")}</p>
        <div className="flex gap-3 max-w-md mx-auto">
          <input type="email" placeholder={t("your@email.com", "بريدك@example.com")}
            className="flex-1 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition" />
          <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl font-semibold text-sm transition-colors whitespace-nowrap">
            {t("Subscribe", "اشترك")}
          </button>
        </div>
      </div>

    </div>
  );
}
