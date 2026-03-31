import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Star, Package, RefreshCw, Shield } from "lucide-react";
import { productsAPI } from "../services/api";
import ProductCard from "../components/product/ProductCard";

const HERO_TAGS = ["Handcrafted", "Sustainable", "Curated"];

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tagIndex, setTagIndex] = useState(0);

  useEffect(() => {
    productsAPI.getFeatured()
      .then((res) => setFeatured(res.data.products || res.data || []))
      .catch(() => setFeatured([]))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setTagIndex((i) => (i + 1) % HERO_TAGS.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const features = [
    { icon: Package, title: "Free Shipping", desc: "On all orders over $75" },
    { icon: RefreshCw, title: "Easy Returns", desc: "30-day hassle-free returns" },
    { icon: Shield, title: "Secure Payment", desc: "Your data is always safe" },
    { icon: Star, title: "Quality Assured", desc: "Every item hand-picked" },
  ];

  const categories = [
    { name: "Living", image: null, slug: "living" },
    { name: "Apparel", image: null, slug: "apparel" },
    { name: "Kitchen", image: null, slug: "kitchen" },
    { name: "Accessories", image: null, slug: "accessories" },
  ];

  return (
    <main className="pt-16">
      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="min-h-screen flex flex-col justify-center relative overflow-hidden bg-parchment">
        {/* Decorative grain overlay */}
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")" }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              {/* Animated rotating tag */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-8 h-px bg-amber-500" />
                <span key={tagIndex} className="text-xs font-mono uppercase tracking-widest text-amber-700 animate-fade-in">
                  {HERO_TAGS[tagIndex]}
                </span>
              </div>

              <h1 className="font-display text-5xl md:text-7xl text-ink-900 leading-[1.05] mb-6">
                Objects worth
                <br />
                <span className="italic text-amber-700">living with.</span>
              </h1>

              <p className="text-ink-500 text-lg leading-relaxed max-w-md mb-10 font-sans font-light">
                Every piece in our collection is chosen for its beauty, craft, and the quiet joy it brings to everyday life.
              </p>

              <div className="flex flex-wrap gap-4">
                <Link to="/products" className="btn-primary flex items-center gap-2 text-sm">
                  Explore Collection
                  <ArrowRight size={14} />
                </Link>
                <Link to="/products?category=new" className="btn-secondary text-sm">
                  New Arrivals
                </Link>
              </div>
            </div>

            {/* Hero visual */}
            <div className="relative hidden lg:block">
              <div className="aspect-[4/5] bg-ink-100 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-parchment to-ink-100 flex items-center justify-center">
                  <span className="font-display text-9xl text-ink-200/50 select-none">M</span>
                </div>
                <div className="absolute bottom-6 left-6 right-6 bg-cream/90 backdrop-blur-sm p-4 border border-ink-100">
                  <p className="text-xs font-mono text-ink-500 uppercase tracking-widest mb-1">Featured</p>
                  <p className="text-sm font-display text-ink-900">New Season Collection</p>
                </div>
              </div>
              {/* Offset decorative square */}
              <div className="absolute -bottom-4 -right-4 w-48 h-48 border-2 border-amber-200 -z-10" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ink-400">
          <div className="w-px h-10 bg-gradient-to-b from-transparent to-ink-300 animate-pulse" />
          <span className="text-xs font-mono tracking-widest">SCROLL</span>
        </div>
      </section>

      {/* ── Categories ───────────────────────────────────── */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <h2 className="section-title">Shop by Category</h2>
          <Link to="/products" className="text-sm font-mono text-amber-700 hover:text-amber-900 flex items-center gap-1 transition-colors">
            All <ArrowRight size={14} />
          </Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categories.map((cat, i) => (
            <Link
              key={cat.slug}
              to={`/products?category=${cat.slug}`}
              className="group relative aspect-square bg-ink-50 overflow-hidden hover:bg-ink-100 transition-colors duration-300"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <span className="font-display text-4xl text-ink-200 group-hover:text-ink-300 transition-colors block mb-2">
                    {cat.name[0]}
                  </span>
                  <span className="font-sans text-sm font-medium text-ink-700 group-hover:text-ink-900">
                    {cat.name}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-amber-500 group-hover:w-full transition-all duration-300" />
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ─────────────────────────────── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-xs font-mono uppercase tracking-widest text-amber-700 mb-2">Handpicked</p>
              <h2 className="section-title">Featured Pieces</h2>
            </div>
            <Link to="/products" className="text-sm font-mono text-ink-600 hover:text-ink-900 flex items-center gap-1 transition-colors">
              View all <ArrowRight size={14} />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-ink-100" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 bg-ink-100 w-1/3" />
                    <div className="h-4 bg-ink-100 w-3/4" />
                    <div className="h-3 bg-ink-100 w-1/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : featured.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 gap-y-8">
              {featured.slice(0, 8).map((product) => (
                <ProductCard key={product._id || product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-ink-400">
              <p className="font-sans text-sm">No featured products yet.</p>
              <Link to="/products" className="text-amber-700 text-sm mt-2 inline-block hover:underline">
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Banner ───────────────────────────────────────── */}
      <section className="bg-ink-900 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs font-mono uppercase tracking-widest text-amber-400 mb-4">Limited Time</p>
          <h2 className="font-display text-4xl md:text-5xl text-cream mb-6 leading-tight">
            New season.<br />
            <span className="italic text-amber-400">New discoveries.</span>
          </h2>
          <p className="text-ink-300 mb-8 font-light max-w-lg mx-auto">
            Shop our latest arrivals — carefully curated pieces that bring thoughtful design into everyday moments.
          </p>
          <Link to="/products?category=new" className="bg-amber-500 text-ink-950 px-8 py-3 text-sm font-medium tracking-wide hover:bg-amber-400 transition-colors inline-flex items-center gap-2">
            Shop New Arrivals <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Trust Features ───────────────────────────────── */}
      <section className="py-16 border-t border-ink-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {features.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-10 h-10 mx-auto mb-3 flex items-center justify-center bg-amber-50 text-amber-700">
                  <Icon size={18} />
                </div>
                <h4 className="text-sm font-medium text-ink-800 mb-1">{title}</h4>
                <p className="text-xs text-ink-400">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
