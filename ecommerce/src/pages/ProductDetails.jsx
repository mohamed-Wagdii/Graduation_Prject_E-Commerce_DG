import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const { addToCart, t } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get(`http://localhost:3000/api/details/${id}`)
      .then((res) => setProduct(res.data.data || res.data))
      .catch((err) => console.log(err))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (loading) return (
    <div className="max-w-3xl mx-auto animate-pulse">
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 overflow-hidden flex flex-col md:flex-row">
        <div className="w-full md:w-80 h-72 bg-gray-100 dark:bg-gray-800" />
        <div className="p-8 flex-1 space-y-4">
          <div className="h-6 bg-gray-100 dark:bg-gray-800 rounded-full w-3/4" />
          <div className="h-8 bg-gray-100 dark:bg-gray-800 rounded-full w-1/3" />
          <div className="h-12 bg-gray-100 dark:bg-gray-800 rounded-xl" />
        </div>
      </div>
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center h-64 gap-3">
      <p className="text-5xl">😕</p>
      <p className="text-gray-500 dark:text-gray-400 font-medium">{t("Product not found.", "المنتج غير موجود.")}</p>
      <button onClick={() => navigate(-1)} className="text-blue-600 hover:underline text-sm">{t("Go back", "رجوع")}</button>
    </div>
  );

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 font-medium text-sm transition-colors">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        {t("Back", "رجوع")}
      </button>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden flex flex-col md:flex-row">
        <div className="relative w-full md:w-80 h-72 flex-shrink-0">
          <img
            src={product.image ? `http://localhost:3000/${product.image}` : "https://placehold.co/400x300?text=No+Image"}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="bg-white text-gray-800 font-bold px-4 py-2 rounded-full">{t("Out of Stock", "نفذ المخزون")}</span>
            </div>
          )}
        </div>

        <div className="p-8 flex flex-col justify-center flex-1">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h2>
          <p className="text-4xl font-bold text-blue-600 mb-4">${product.price}</p>

          <div className="flex items-center gap-2 mb-6">
            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? "bg-green-500" : "bg-red-400"}`} />
            <span className={`text-sm font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0
                ? t(`In Stock — ${product.stock} units`, `متوفر — ${product.stock} وحدة`)
                : t("Out of Stock", "نفذ المخزون")}
            </span>
          </div>

          <button onClick={handleAddToCart} disabled={product.stock === 0}
            className={`py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${added ? "bg-green-500 text-white" : "bg-blue-600 hover:bg-blue-700 disabled:bg-gray-200 dark:disabled:bg-gray-700 disabled:cursor-not-allowed text-white"}`}>
            {added ? `✓ ${t("Added to Cart!", "تمت الإضافة!")}` : t("Add to Cart 🛒", "أضف للسلة 🛒")}
          </button>
        </div>
      </div>
    </div>
  );
}
