import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal, X, ChevronDown } from "lucide-react";
import { productsAPI } from "../services/api";
import ProductCard from "../components/product/ProductCard";

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price: Low to High" },
  { value: "price_desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalPages, setTotalPages] = useState(1);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "newest";
  const page = parseInt(searchParams.get("page") || "1");
  const minPrice = searchParams.get("minPrice") || "";
  const maxPrice = searchParams.get("maxPrice") || "";

  const updateParam = (key, value) => {
    const next = new URLSearchParams(searchParams);
    if (value) next.set(key, value);
    else next.delete(key);
    if (key !== "page") next.delete("page");
    setSearchParams(next);
  };

  useEffect(() => {
    productsAPI.getCategories()
      .then((res) => setCategories(res.data.categories || res.data || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = { page, sort, limit: 12 };
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice) params.minPrice = minPrice;
    if (maxPrice) params.maxPrice = maxPrice;

    productsAPI.getAll(params)
      .then((res) => {
        setProducts(res.data.products || res.data || []);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, category, sort, page, minPrice, maxPrice]);

  const activeFilters = [
    category && { key: "category", label: category },
    minPrice && { key: "minPrice", label: `Min $${minPrice}` },
    maxPrice && { key: "maxPrice", label: `Max $${maxPrice}` },
  ].filter(Boolean);

  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-4xl text-ink-900 mb-2">
          {search ? `Results for "${search}"` : category ? category : "All Products"}
        </h1>
        {!loading && (
          <p className="text-sm text-ink-400 font-mono">
            {products.length} {products.length === 1 ? "item" : "items"}
          </p>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-ink-100 gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setFiltersOpen((v) => !v)}
            className="flex items-center gap-2 text-sm font-medium text-ink-700 hover:text-ink-900 border border-ink-200 px-3 py-2 hover:border-ink-400 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
            {activeFilters.length > 0 && (
              <span className="bg-ink-900 text-cream text-xs px-1.5 py-0.5 font-mono">
                {activeFilters.length}
              </span>
            )}
          </button>

          {/* Active filters */}
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={() => updateParam(f.key, "")}
              className="flex items-center gap-1.5 text-xs bg-ink-900 text-cream px-3 py-1.5 hover:bg-ink-700 transition-colors"
            >
              {f.label} <X size={10} />
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sort}
            onChange={(e) => updateParam("sort", e.target.value)}
            className="text-sm border border-ink-200 bg-white px-3 py-2 pr-8 focus:outline-none focus:border-ink-500 appearance-none cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <ChevronDown size={12} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-ink-400" />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        {filtersOpen && (
          <aside className="w-56 flex-shrink-0">
            <div className="sticky top-24 space-y-8">
              {/* Category filter */}
              {categories.length > 0 && (
                <div>
                  <h3 className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-3">Category</h3>
                  <ul className="space-y-1.5">
                    <li>
                      <button
                        onClick={() => updateParam("category", "")}
                        className={`text-sm w-full text-left py-1 transition-colors ${!category ? "text-ink-900 font-medium" : "text-ink-500 hover:text-ink-800"}`}
                      >
                        All
                      </button>
                    </li>
                    {categories.map((cat) => (
                      <li key={cat}>
                        <button
                          onClick={() => updateParam("category", cat)}
                          className={`text-sm w-full text-left py-1 transition-colors ${category === cat ? "text-ink-900 font-medium" : "text-ink-500 hover:text-ink-800"}`}
                        >
                          {cat}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Price filter */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-3">Price Range</h3>
                <div className="flex gap-2 items-center">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPrice}
                    onChange={(e) => updateParam("minPrice", e.target.value)}
                    className="w-full border border-ink-200 px-2 py-1.5 text-sm focus:outline-none focus:border-ink-500"
                  />
                  <span className="text-ink-300">—</span>
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPrice}
                    onChange={(e) => updateParam("maxPrice", e.target.value)}
                    className="w-full border border-ink-200 px-2 py-1.5 text-sm focus:outline-none focus:border-ink-500"
                  />
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* Products grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-ink-100" />
                  <div className="mt-3 space-y-2">
                    <div className="h-3 bg-ink-100 w-1/3" />
                    <div className="h-4 bg-ink-100 w-3/4" />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-2xl text-ink-400 mb-3">No products found</p>
              <p className="text-sm text-ink-400">Try adjusting your search or filters</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8">
                {products.map((product) => (
                  <ProductCard key={product._id || product.id} product={product} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-12 flex justify-center items-center gap-2">
                  {[...Array(totalPages)].map((_, i) => (
                    <button
                      key={i}
                      onClick={() => updateParam("page", String(i + 1))}
                      className={`w-9 h-9 text-sm font-mono transition-colors ${
                        page === i + 1
                          ? "bg-ink-900 text-cream"
                          : "border border-ink-200 text-ink-600 hover:border-ink-600"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </main>
  );
}
