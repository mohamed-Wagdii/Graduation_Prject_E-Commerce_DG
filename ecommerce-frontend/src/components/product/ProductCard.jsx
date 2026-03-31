import React, { useState } from "react";
import { Link } from "react-router-dom";
import { ShoppingBag, Heart, Eye } from "lucide-react";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";

export default function ProductCard({ product }) {
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();
  const [hovered, setHovered] = useState(false);
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      toast.error("Please sign in to add items to cart");
      return;
    }
    setAdding(true);
    await addItem(product._id || product.id, 1);
    setAdding(false);
  };

  const price = Number(product.price || 0).toFixed(2);
  const originalPrice = product.originalPrice ? Number(product.originalPrice).toFixed(2) : null;
  const discount = originalPrice
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : null;

  return (
    <Link
      to={`/products/${product._id || product.id}`}
      className="group block"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image container */}
      <div className="relative overflow-hidden bg-parchment aspect-[3/4]">
        {product.images?.[0] || product.image ? (
          <img
            src={product.images?.[0] || product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-ink-50">
            <ShoppingBag size={40} className="text-ink-200" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.isNew && (
            <span className="badge bg-ink-900 text-cream">NEW</span>
          )}
          {discount && (
            <span className="badge bg-amber-500 text-white">-{discount}%</span>
          )}
          {product.stock === 0 && (
            <span className="badge bg-ink-300 text-ink-700">SOLD OUT</span>
          )}
        </div>

        {/* Hover actions */}
        <div className={`absolute inset-x-0 bottom-0 p-3 flex gap-2 transition-all duration-300 ${
          hovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}>
          <button
            onClick={handleAddToCart}
            disabled={adding || product.stock === 0}
            className="flex-1 btn-primary py-2 text-xs flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <ShoppingBag size={14} />
            {adding ? "Adding…" : "Add to Cart"}
          </button>
          <button className="bg-white p-2 hover:bg-ink-50 transition-colors" aria-label="Wishlist">
            <Heart size={14} className="text-ink-600" />
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="pt-3 pb-1">
        {product.category && (
          <p className="text-xs font-mono text-ink-400 uppercase tracking-widest mb-0.5">
            {product.category}
          </p>
        )}
        <h3 className="text-sm font-sans font-medium text-ink-800 group-hover:text-ink-900 truncate">
          {product.name}
        </h3>
        <div className="flex items-baseline gap-2 mt-1">
          <span className="text-sm font-medium text-ink-900">${price}</span>
          {originalPrice && (
            <span className="text-xs text-ink-400 line-through">${originalPrice}</span>
          )}
        </div>
      </div>
    </Link>
  );
}
