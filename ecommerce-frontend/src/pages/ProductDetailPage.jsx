import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ShoppingBag, ArrowLeft, ChevronLeft, ChevronRight, Star, Truck, RefreshCw } from "lucide-react";
import { productsAPI } from "../services/api";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/product/ProductCard";
import toast from "react-hot-toast";

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { isAuthenticated } = useAuth();

  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    setLoading(true);
    productsAPI.getById(id)
      .then((res) => {
        const p = res.data.product || res.data;
        setProduct(p);
        // Load related products
        if (p.category) {
          productsAPI.getAll({ category: p.category, limit: 4 })
            .then((r) => setRelated((r.data.products || r.data || []).filter((x) => (x._id || x.id) !== id)))
            .catch(() => {});
        }
      })
      .catch(() => navigate("/products"))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) { toast.error("Please sign in to add items to cart"); return; }
    setAdding(true);
    await addItem(product._id || product.id, quantity);
    setAdding(false);
  };

  if (loading) {
    return (
      <div className="pt-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="grid md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-square bg-ink-100" />
          <div className="space-y-4">
            <div className="h-6 bg-ink-100 w-1/3" />
            <div className="h-10 bg-ink-100 w-3/4" />
            <div className="h-8 bg-ink-100 w-1/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images?.length ? product.images : [product.image].filter(Boolean);
  const price = Number(product.price || 0).toFixed(2);
  const inStock = product.stock > 0;

  return (
    <main className="pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 mb-8 text-xs font-mono text-ink-400">
          <Link to="/" className="hover:text-ink-700">Home</Link>
          <span>/</span>
          <Link to="/products" className="hover:text-ink-700">Products</Link>
          {product.category && (<><span>/</span><span>{product.category}</span></>)}
          <span>/</span>
          <span className="text-ink-700 truncate max-w-xs">{product.name}</span>
        </div>

        <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
          {/* Images */}
          <div>
            <div className="relative aspect-square bg-parchment overflow-hidden mb-3">
              {images[activeImage] ? (
                <img
                  src={images[activeImage]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ShoppingBag size={64} className="text-ink-200" />
                </div>
              )}

              {images.length > 1 && (
                <>
                  <button
                    onClick={() => setActiveImage((i) => Math.max(0, i - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 transition-colors"
                  >
                    <ChevronLeft size={16} />
                  </button>
                  <button
                    onClick={() => setActiveImage((i) => Math.min(images.length - 1, i + 1))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-1.5 transition-colors"
                  >
                    <ChevronRight size={16} />
                  </button>
                </>
              )}
            </div>

            {images.length > 1 && (
              <div className="flex gap-2">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`w-16 h-16 overflow-hidden border-2 transition-colors flex-shrink-0 ${
                      activeImage === i ? "border-ink-900" : "border-transparent hover:border-ink-300"
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            {product.category && (
              <p className="text-xs font-mono uppercase tracking-widest text-amber-700 mb-3">
                {product.category}
              </p>
            )}
            <h1 className="font-display text-3xl md:text-4xl text-ink-900 mb-4 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl font-medium text-ink-900">${price}</span>
              {product.originalPrice && (
                <span className="text-lg text-ink-400 line-through">
                  ${Number(product.originalPrice).toFixed(2)}
                </span>
              )}
            </div>

            {/* Stock status */}
            <div className={`inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 mb-6 ${
              inStock ? "bg-green-50 text-green-700" : "bg-ink-100 text-ink-500"
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${inStock ? "bg-green-500" : "bg-ink-400"}`} />
              {inStock ? `In Stock (${product.stock} left)` : "Out of Stock"}
            </div>

            {product.description && (
              <p className="text-ink-500 text-sm leading-relaxed mb-8 font-light">
                {product.description}
              </p>
            )}

            {/* Quantity + Add to Cart */}
            <div className="flex items-center gap-3 mb-8">
              <div className="flex items-center border border-ink-200">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="px-3 py-3 text-ink-600 hover:bg-ink-50 transition-colors"
                >—</button>
                <span className="px-4 py-3 text-sm font-mono min-w-[3rem] text-center">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity((q) => Math.min(product.stock || 99, q + 1))}
                  disabled={!inStock}
                  className="px-3 py-3 text-ink-600 hover:bg-ink-50 transition-colors disabled:opacity-50"
                >+</button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={adding || !inStock}
                className="flex-1 btn-primary flex items-center justify-center gap-2 py-3.5 disabled:opacity-60"
              >
                <ShoppingBag size={16} />
                {adding ? "Adding…" : !inStock ? "Out of Stock" : "Add to Cart"}
              </button>
            </div>

            {/* Delivery info */}
            <div className="border-t border-ink-100 pt-6 space-y-3">
              {[
                { icon: Truck, text: "Free shipping on orders over $75" },
                { icon: RefreshCw, text: "30-day returns, no questions asked" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-sm text-ink-500">
                  <Icon size={14} className="text-ink-400" />
                  {text}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <section className="mt-24">
            <div className="flex items-center justify-between mb-8">
              <h2 className="section-title text-2xl">You May Also Like</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {related.slice(0, 4).map((p) => (
                <ProductCard key={p._id || p.id} product={p} />
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
