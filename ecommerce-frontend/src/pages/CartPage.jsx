import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { ordersAPI } from "../services/api";
import toast from "react-hot-toast";

export default function CartPage() {
  const { items, subtotal, updateItem, removeItem, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [checkingOut, setCheckingOut] = useState(false);

  const shipping = subtotal >= 75 || subtotal === 0 ? 0 : 9.99;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!isAuthenticated) { navigate("/login"); return; }
    setCheckingOut(true);
    try {
      const res = await ordersAPI.create({
        items: items.map((item) => ({
          product: item.productId || item.product?._id || item.product,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping: { amount: shipping },
        total,
      });
      await clearCart();
      const orderId = res.data.order?._id || res.data._id || res.data.id;
      toast.success("Order placed successfully!");
      navigate(`/profile?tab=orders&order=${orderId}`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Checkout failed. Please try again.");
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 min-h-screen flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-ink-900 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!items.length) {
    return (
      <main className="pt-24 pb-20 max-w-2xl mx-auto px-4 sm:px-6 text-center">
        <div className="mt-16">
          <div className="w-20 h-20 mx-auto mb-6 bg-ink-50 flex items-center justify-center">
            <ShoppingBag size={32} className="text-ink-300" />
          </div>
          <h1 className="font-display text-3xl text-ink-900 mb-3">Your cart is empty</h1>
          <p className="text-ink-400 text-sm mb-8">Add some beautiful things to get started.</p>
          <Link to="/products" className="btn-primary inline-flex items-center gap-2">
            <ShoppingBag size={14} /> Start Shopping
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="pt-24 pb-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link to="/products" className="inline-flex items-center gap-2 text-sm text-ink-500 hover:text-ink-900 transition-colors mb-4">
          <ArrowLeft size={14} /> Continue Shopping
        </Link>
        <h1 className="font-display text-4xl text-ink-900">
          Your Cart <span className="text-ink-300">({items.length})</span>
        </h1>
      </div>

      <div className="grid lg:grid-cols-3 gap-10">
        {/* Items */}
        <div className="lg:col-span-2 space-y-0 divide-y divide-ink-100">
          {items.map((item) => {
            const product = item.product || item;
            const name = product?.name || item.name || "Product";
            const image = product?.images?.[0] || product?.image || item.image;
            const price = Number(item.price || product?.price || 0);

            return (
              <div key={item._id || item.id} className="flex gap-5 py-5">
                {/* Image */}
                <Link to={`/products/${item.productId || product?._id || product?.id}`} className="flex-shrink-0">
                  <div className="w-24 h-28 bg-parchment overflow-hidden">
                    {image ? (
                      <img src={image} alt={name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={20} className="text-ink-200" />
                      </div>
                    )}
                  </div>
                </Link>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-4">
                    <Link to={`/products/${item.productId || product?._id || product?.id}`}>
                      <h3 className="font-sans font-medium text-ink-900 hover:text-ink-600 transition-colors truncate">
                        {name}
                      </h3>
                    </Link>
                    <span className="font-medium text-ink-900 flex-shrink-0">
                      ${(price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <p className="text-sm text-ink-400 mt-0.5">${price.toFixed(2)} each</p>

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-ink-200">
                      <button
                        onClick={() => updateItem(item._id || item.id, Math.max(1, item.quantity - 1))}
                        className="px-2.5 py-1.5 text-ink-600 hover:bg-ink-50 transition-colors text-sm"
                      >—</button>
                      <span className="px-3 py-1.5 text-sm font-mono">{item.quantity}</span>
                      <button
                        onClick={() => updateItem(item._id || item.id, item.quantity + 1)}
                        className="px-2.5 py-1.5 text-ink-600 hover:bg-ink-50 transition-colors text-sm"
                      >+</button>
                    </div>

                    <button
                      onClick={() => removeItem(item._id || item.id)}
                      className="text-ink-400 hover:text-red-500 transition-colors p-1"
                      aria-label="Remove"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-ink-100 p-6 sticky top-24">
            <h2 className="font-display text-xl text-ink-900 mb-5">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-ink-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-ink-600">
                <span>Shipping</span>
                <span>
                  {shipping === 0 ? (
                    <span className="text-green-600 font-medium">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-xs text-ink-400 font-light">
                  Add ${(75 - subtotal).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t border-ink-100 pt-3 flex justify-between font-medium text-ink-900 text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={checkingOut}
              className="w-full btn-primary flex items-center justify-center gap-2 py-4 mt-6"
            >
              {checkingOut ? (
                <>
                  <div className="w-4 h-4 border-2 border-cream border-t-transparent animate-spin" />
                  Processing…
                </>
              ) : (
                <>Checkout <ArrowRight size={14} /></>
              )}
            </button>

            <p className="text-xs text-ink-400 text-center mt-3">
              Secure checkout. SSL encrypted.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
