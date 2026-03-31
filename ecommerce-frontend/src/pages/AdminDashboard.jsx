import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Package, Users, ShoppingBag, DollarSign,
  TrendingUp, Eye, Edit2, Trash2, Plus, ChevronDown
} from "lucide-react";
import { adminAPI, productsAPI, ordersAPI, usersAPI } from "../services/api";
import toast from "react-hot-toast";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered", "cancelled"];
const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

function StatCard({ icon: Icon, label, value, sub, color = "amber" }) {
  const colors = {
    amber: "bg-amber-50 text-amber-700",
    blue: "bg-blue-50 text-blue-700",
    green: "bg-green-50 text-green-700",
    purple: "bg-purple-50 text-purple-700",
  };
  return (
    <div className="bg-white border border-ink-100 p-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-ink-500 mb-1">{label}</p>
          <p className="font-display text-3xl text-ink-900">{value}</p>
          {sub && <p className="text-xs text-ink-400 mt-1">{sub}</p>}
        </div>
        <div className={`w-10 h-10 flex items-center justify-center ${colors[color]}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.allSettled([
      adminAPI.getStats(),
      productsAPI.getAll({ limit: 20 }),
      ordersAPI.getAll({ limit: 20 }),
      usersAPI.getAll({ limit: 20 }),
    ]).then(([statsRes, productsRes, ordersRes, usersRes]) => {
      if (statsRes.status === "fulfilled") setStats(statsRes.value.data);
      if (productsRes.status === "fulfilled") setProducts(productsRes.value.data.products || productsRes.value.data || []);
      if (ordersRes.status === "fulfilled") setOrders(ordersRes.value.data.orders || ordersRes.value.data || []);
      if (usersRes.status === "fulfilled") setUsers(usersRes.value.data.users || usersRes.value.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleOrderStatus = async (orderId, status) => {
    try {
      await ordersAPI.updateStatus(orderId, status);
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId || o.id === orderId ? { ...o, status } : o))
      );
      toast.success("Order status updated");
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await productsAPI.delete(id);
      setProducts((prev) => prev.filter((p) => (p._id || p.id) !== id));
      toast.success("Product deleted");
    } catch {
      toast.error("Failed to delete product");
    }
  };

  const TABS = [
    { key: "overview", label: "Overview" },
    { key: "products", label: "Products" },
    { key: "orders", label: "Orders" },
    { key: "users", label: "Users" },
  ];

  return (
    <main className="pt-24 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-display text-4xl text-ink-900">Admin Dashboard</h1>
        {activeTab === "products" && (
          <Link to="/admin/products/new" className="btn-primary flex items-center gap-2 text-sm py-2">
            <Plus size={14} /> Add Product
          </Link>
        )}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-ink-200 mb-8 gap-0">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            className={`px-5 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === t.key
                ? "border-ink-900 text-ink-900"
                : "border-transparent text-ink-500 hover:text-ink-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── Overview ─── */}
      {activeTab === "overview" && (
        <div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
            <StatCard icon={DollarSign} label="Total Revenue" value={stats ? `$${Number(stats.revenue || 0).toLocaleString()}` : "—"} color="green" />
            <StatCard icon={ShoppingBag} label="Total Orders" value={stats?.totalOrders ?? orders.length} color="blue" />
            <StatCard icon={Package} label="Products" value={stats?.totalProducts ?? products.length} color="amber" />
            <StatCard icon={Users} label="Users" value={stats?.totalUsers ?? users.length} color="purple" />
          </div>

          {/* Recent orders preview */}
          <div className="bg-white border border-ink-100">
            <div className="p-5 border-b border-ink-100 flex justify-between items-center">
              <h2 className="font-display text-xl text-ink-900">Recent Orders</h2>
              <button onClick={() => setActiveTab("orders")} className="text-xs font-mono text-amber-700 hover:underline">
                View all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-parchment">
                  <tr>
                    {["Order ID", "Customer", "Total", "Status", "Date"].map((h) => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-mono uppercase tracking-widest text-ink-500">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-50">
                  {orders.slice(0, 5).map((order) => (
                    <tr key={order._id || order.id} className="hover:bg-ink-50/50">
                      <td className="px-5 py-3 font-mono text-xs text-ink-500">#{String(order._id || order.id).slice(-8).toUpperCase()}</td>
                      <td className="px-5 py-3 text-ink-800">{order.user?.name || order.user?.email || "—"}</td>
                      <td className="px-5 py-3 font-medium text-ink-900">${Number(order.total || 0).toFixed(2)}</td>
                      <td className="px-5 py-3">
                        <span className={`badge text-xs px-2 py-0.5 font-mono ${STATUS_COLORS[order.status] || "bg-ink-100 text-ink-500"}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-ink-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── Products ─── */}
      {activeTab === "products" && (
        <div className="bg-white border border-ink-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-parchment">
                <tr>
                  {["Product", "Category", "Price", "Stock", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-mono uppercase tracking-widest text-ink-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {products.map((product) => (
                  <tr key={product._id || product.id} className="hover:bg-ink-50/50">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-ink-100 flex-shrink-0 overflow-hidden">
                          {product.images?.[0] || product.image ? (
                            <img src={product.images?.[0] || product.image} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <Package size={16} className="m-auto text-ink-300 mt-2.5" />
                          )}
                        </div>
                        <span className="font-medium text-ink-800 truncate max-w-[200px]">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-500">{product.category || "—"}</td>
                    <td className="px-5 py-3 font-medium text-ink-900">${Number(product.price || 0).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <span className={`font-mono text-xs ${product.stock > 0 ? "text-green-700" : "text-red-600"}`}>
                        {product.stock ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Link to={`/products/${product._id || product.id}`} className="p-1.5 text-ink-400 hover:text-ink-700">
                          <Eye size={14} />
                        </Link>
                        <button className="p-1.5 text-ink-400 hover:text-ink-700">
                          <Edit2 size={14} />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id || product.id)}
                          className="p-1.5 text-ink-400 hover:text-red-600"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Orders ─── */}
      {activeTab === "orders" && (
        <div className="bg-white border border-ink-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-parchment">
                <tr>
                  {["Order ID", "Customer", "Items", "Total", "Status", "Date"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-mono uppercase tracking-widest text-ink-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {orders.map((order) => (
                  <tr key={order._id || order.id} className="hover:bg-ink-50/50">
                    <td className="px-5 py-3 font-mono text-xs text-ink-500">
                      #{String(order._id || order.id).slice(-8).toUpperCase()}
                    </td>
                    <td className="px-5 py-3 text-ink-800">{order.user?.name || order.user?.email || "—"}</td>
                    <td className="px-5 py-3 text-ink-500">{order.items?.length || 0}</td>
                    <td className="px-5 py-3 font-medium text-ink-900">${Number(order.total || 0).toFixed(2)}</td>
                    <td className="px-5 py-3">
                      <div className="relative">
                        <select
                          value={order.status || "pending"}
                          onChange={(e) => handleOrderStatus(order._id || order.id, e.target.value)}
                          className={`text-xs font-mono border-0 pr-6 py-1 pl-2 appearance-none cursor-pointer focus:outline-none focus:ring-1 focus:ring-ink-300 ${STATUS_COLORS[order.status] || "bg-ink-50 text-ink-600"}`}
                        >
                          {STATUS_OPTIONS.map((s) => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink-400 text-xs">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Users ─── */}
      {activeTab === "users" && (
        <div className="bg-white border border-ink-100">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-parchment">
                <tr>
                  {["Name", "Email", "Role", "Joined", "Actions"].map((h) => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-mono uppercase tracking-widest text-ink-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-50">
                {users.map((user) => (
                  <tr key={user._id || user.id} className="hover:bg-ink-50/50">
                    <td className="px-5 py-3 font-medium text-ink-800">{user.name || "—"}</td>
                    <td className="px-5 py-3 text-ink-500">{user.email}</td>
                    <td className="px-5 py-3">
                      <span className={`badge text-xs font-mono px-2 py-0.5 ${user.role === "admin" ? "bg-amber-50 text-amber-700" : "bg-ink-50 text-ink-600"}`}>
                        {user.role || "user"}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-ink-400 text-xs">
                      {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-5 py-3">
                      <button
                        onClick={async () => {
                          if (!window.confirm("Delete this user?")) return;
                          try {
                            await usersAPI.deleteUser(user._id || user.id);
                            setUsers((prev) => prev.filter((u) => (u._id || u.id) !== (user._id || user.id)));
                            toast.success("User deleted");
                          } catch { toast.error("Failed to delete user"); }
                        }}
                        className="p-1.5 text-ink-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </main>
  );
}
