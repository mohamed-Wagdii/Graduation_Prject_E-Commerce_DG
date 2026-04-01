import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("default");
  const [view, setView] = useState("grid");
  const { addToCart, t } = useContext(AppContext);
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  useEffect(() => {
    axios.get("http://localhost:3000/api/product")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, []);

  const filtered = products
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "stock") return b.stock - a.stock;
      return 0;
    });

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const handleSearch = (val) => { setSearch(val); setPage(1); };
  const handleSort = (val) => { setSort(val); setPage(1); };

  const inStock = products.filter(p => p.stock > 0).length;

  return (
    <div className="space-y-8">

      {/* ── Header Banner ── */}
      <div className="relative bg-gradient-to-r from-gray-900 to-blue-900 dark:from-gray-950 dark:to-blue-950 rounded-3xl p-10 overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(circle at 80% 50%, #3b82f6 0%, transparent 60%)" }} />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">{t("All Products", "جميع المنتجات")}</h1>
            <p className="text-blue-200 text-sm">
              {products.length} {t("total products", "منتج إجمالي")} · {inStock} {t("in stock", "متوفر")}
            </p>
          </div>
          <div className="flex gap-3 flex-wrap">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold text-white">{products.length}</div>
              <div className="text-blue-200 text-xs">{t("Products", "منتج")}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 text-center">
              <div className="text-2xl font-bold text-green-400">{inStock}</div>
              <div className="text-blue-200 text-xs">{t("In Stock", "متوفر")}</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Filters Bar ── */}
      <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-4">
        <div className="flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-52">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder={t("Search products...", "ابحث عن منتج...")} value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition placeholder-gray-400"
            />
          </div>

          {/* Sort */}
          <select value={sort} onChange={(e) => handleSort(e.target.value)}
            className="border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-xl px-4 py-2.5 text-sm outline-none focus:border-blue-500 transition cursor-pointer">
            <option value="default">{t("Default", "افتراضي")}</option>
            <option value="price-asc">{t("Price ↑", "السعر ↑")}</option>
            <option value="price-desc">{t("Price ↓", "السعر ↓")}</option>
            <option value="stock">{t("Most Stock", "الأكثر مخزوناً")}</option>
          </select>

          {/* View Toggle */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1">
            <button onClick={() => setView("grid")}
              className={`p-2 rounded-lg transition-colors ${view === "grid" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z" />
              </svg>
            </button>
            <button onClick={() => setView("list")}
              className={`p-2 rounded-lg transition-colors ${view === "list" ? "bg-white dark:bg-gray-700 shadow-sm text-blue-600" : "text-gray-400 hover:text-gray-600"}`}>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {search && (
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {filtered.length} {t("results", "نتيجة")}
            </span>
          )}
        </div>
      </div>
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
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
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800">
          <p className="text-6xl mb-4">🔍</p>
          <h3 className="text-xl font-bold text-gray-700 dark:text-white mb-2">{t("No results found", "لا توجد نتائج")}</h3>
          <p className="text-gray-400 mb-6">{t(`Nothing matched "${search}"`, `لا يوجد ما يطابق "${search}"`)}</p>
          <button onClick={() => setSearch("")} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-medium transition-colors">
            {t("Clear Search", "مسح البحث")}
          </button>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 group">
              <div className="relative overflow-hidden">
                <img src={product.image ? `http://localhost:3000/${product.image}` : "https://placehold.co/300x220?text=No+Image"} alt={product.name}
                  className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                {product.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">
                    <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full text-sm">{t("Out of Stock", "نفذ المخزون")}</span>
                  </div>
                )}
                {product.stock > 0 && product.stock <= 5 && (
                  <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-bold px-2.5 py-1 rounded-full">
                    🔥 {t(`${product.stock} left`, `${product.stock} متبقي`)}
                  </span>
                )}
              </div>
              <div className="p-5">
                <Link to={`/app/products/${product._id}`}>
                  <h4 className="font-semibold text-gray-800 dark:text-white mb-1 hover:text-blue-600 transition-colors line-clamp-1">{product.name}</h4>
                </Link>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xl font-bold text-blue-600">${product.price}</span>
                  <span className={`text-xs font-medium px-2 py-1 rounded-full ${product.stock > 0 ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "bg-red-50 text-red-500"}`}>
                    {product.stock > 0 ? `✓ ${t("In Stock", "متوفر")}` : t("Sold Out", "نفذ")}
                  </span>
                </div>
                <button onClick={() => addToCart(product)} disabled={product.stock === 0}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:text-gray-400 disabled:cursor-not-allowed text-white py-2.5 rounded-xl font-semibold text-sm transition-colors">
                  {t("Add to Cart", "أضف للسلة")}
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="flex flex-col gap-4">
          {filtered.map((product) => (
            <div key={product._id} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-all p-4 flex items-center gap-5">
              <img src={product.image ? `http://localhost:3000/${product.image}` : "https://placehold.co/100x100?text=?"} alt={product.name}
                className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <Link to={`/app/products/${product._id}`}>
                  <h4 className="font-semibold text-gray-800 dark:text-white hover:text-blue-600 transition-colors">{product.name}</h4>
                </Link>
                <p className="text-gray-400 text-sm mt-1">{t("Stock", "المخزون")}: {product.stock}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-2xl font-bold text-blue-600 mb-2">${product.price}</p>
                <button onClick={() => addToCart(product)} disabled={product.stock === 0}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 disabled:cursor-not-allowed text-white disabled:text-gray-400 px-5 py-2 rounded-xl font-medium text-sm transition-colors">
                  {t("Add to Cart", "أضف للسلة")}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
