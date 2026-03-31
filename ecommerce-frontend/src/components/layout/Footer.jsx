import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-ink-950 text-ink-300 mt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <p className="font-display text-3xl text-cream mb-4">
              Maison<span className="text-amber-500">.</span>
            </p>
            <p className="text-sm leading-relaxed text-ink-400 max-w-xs">
              Curated goods for the discerning. Every piece chosen with intention, every purchase delivered with care.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-4">Shop</h4>
            <ul className="space-y-2">
              {["New Arrivals", "Best Sellers", "Sale", "All Products"].map((item) => (
                <li key={item}>
                  <Link to="/products" className="text-sm text-ink-400 hover:text-cream transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-4">Support</h4>
            <ul className="space-y-2">
              {["My Account", "Orders", "Returns", "Contact"].map((item) => (
                <li key={item}>
                  <Link to="/profile" className="text-sm text-ink-400 hover:text-cream transition-colors">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-ink-800 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-ink-600 font-mono">
            © {new Date().getFullYear()} Maison. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Privacy", "Terms", "Cookies"].map((item) => (
              <Link key={item} to="/" className="text-xs text-ink-600 hover:text-ink-400 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
