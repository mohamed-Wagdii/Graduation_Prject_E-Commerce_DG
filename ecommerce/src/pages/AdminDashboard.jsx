import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const API = "http://localhost:3000/api";

function StatCard({ icon, label, value, color }) {
  return (
    <div className={`bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 p-6 shadow-sm`}>
      <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center text-2xl mb-4`}>{icon}</div>
      <p className="text-3xl font-bold text-gray-800 dark:text-white mb-1">{value}</p>
      <p className="text-gray-400 text-sm">{label}</p>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout, dark, setDark, lang, setLang, t } = useContext(AppContext);
  const navigate = useNavigate();

  const [tab, setTab] = useState("overview");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", price: "", stock: "" });
  const [image, setImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState(null);

  const headers = { Authorization: `Bearer ${user?.token}` };

  useEffect(() => {
    Promise.all([
      axios.get(`${API}/product`),
      axios.get(`${API}/orders`, { headers }),
    ]).then(([p, o]) => {
      setProducts(p.data);
      setOrders(o.data.data || []);
    }).catch(console.log)
      .finally(() => setLoading(false));
  }, []);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("price", form.price);
      fd.append("stock", form.stock);
      if (image) fd.append("image", image);

      const res = await axios.post(`${API}/product`, fd, {
        headers: { ...headers, "Content-Type": "multipart/form-data" },
      });
      setMsg({ type: "success", text: t("Product added successfully!", "تم إضافة المنتج بنجاح!") });
      setForm({ name: "", price: "", stock: "" });
      setImage(null);
      setProducts((prev) => [...prev, res.data.data]);
    } catch (err) {
      setMsg({ type: "error", text: err.response?.data?.msg || t("Failed to add product", "فشل إضافة المنتج") });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm(t("Delete this product?", "حذف هذا المنتج؟"))) return;
    try {
      await axios.delete(`${API}/product/${id}`, { headers });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch { alert(t("Delete failed", "فشل الحذف")); }
  };

  const handleLogout = () => { logout(); navigate("/"); };

  const totalRevenue = orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0);

  const tabs = [
    { id: "overview", label: t("Overview", "نظرة عامة"), icon: "📊" },
    { id: "products", label: t("Products", "المنتجات"), icon: "📦" },
    { id: "add", label: t("Add Product", "إضافة منتج"), icon: "➕" },
    { id: "orders", label: t("Orders", "الطلبات"), icon: "🛒" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex transition-colors">

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 flex flex-col fixed h-full z-40 shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">M</div>
            <div>
              <p className="font-bold text-gray-800 dark:text-white text-sm">MicroElectronics</p>
              <p className="text-xs text-blue-600 font-medium">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {tabs.map((tab_item) => (
            <button key={tab_item.id} onClick={() => setTab(tab_item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${tab === tab_item.id ? "bg-blue-600 text-white shadow-sm" : "text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"}`}>
              <span>{tab_item.icon}</span>
              {tab_item.label}
            </button>
          ))}
        </nav>

        {/* Bottom */}
        <div className="p-4 border-t border-gray-100 dark:border-gray-800 space-y-2">
          <div className="flex items-center gap-2 px-3 py-2">
            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center text-blue-600 font-bold text-sm">A</div>
            <div>
              <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">Admin</p>
              <p className="text-xs text-gray-400">{t("Administrator", "مدير النظام")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setDark(!dark)}
              className="flex-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-sm">
              {dark ? "☀️" : "🌙"}
            </button>
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="flex-1 p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-xs font-bold">
              {lang === "en" ? "ع" : "EN"}
            </button>
            <button onClick={handleLogout}
              className="flex-1 p-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm">
              🚪
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main ── */}
      <main className="ml-64 flex-1 p-8">

        {/* ── Overview ── */}
        {tab === "overview" && (
          <div className="space-y-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t("Dashboard", "لوحة التحكم")} 👋</h1>
              <p className="text-gray-400 mt-1">{t("Welcome back, Admin!", "أهلاً بعودتك، مدير!")}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <StatCard icon="📦" label={t("Total Products", "إجمالي المنتجات")} value={products.length} color="bg-blue-50 dark:bg-blue-900/20" />
              <StatCard icon="🛒" label={t("Total Orders", "إجمالي الطلبات")} value={orders.length} color="bg-purple-50 dark:bg-purple-900/20" />
              <StatCard icon="💰" label={t("Total Revenue", "إجمالي الإيرادات")} value={`$${totalRevenue.toFixed(0)}`} color="bg-green-50 dark:bg-green-900/20" />
              <StatCard icon="✅" label={t("In Stock", "متوفر")} value={products.filter(p => p.stock > 0).length} color="bg-orange-50 dark:bg-orange-900/20" />
            </div>

            {/* Recent Orders */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <h2 className="font-bold text-gray-800 dark:text-white">{t("Recent Orders", "أحدث الطلبات")}</h2>
              </div>
              {loading ? (
                <div className="p-6 text-center text-gray-400">{t("Loading...", "جارٍ التحميل...")}</div>
              ) : orders.length === 0 ? (
                <div className="p-10 text-center text-gray-400">
                  <p className="text-4xl mb-2">📭</p>
                  <p>{t("No orders yet", "لا توجد طلبات بعد")}</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {[t("Order ID", "رقم الطلب"), t("Total", "الإجمالي"), t("Status", "الحالة"), t("Payment", "الدفع"), t("Date", "التاريخ")].map((h) => (
                          <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {orders.slice(0, 5).map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500 dark:text-gray-400">#{order._id.slice(-6)}</td>
                          <td className="px-6 py-4 font-bold text-blue-600">${order.totalPrice}</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                              order.status === "delivered" ? "bg-green-100 dark:bg-green-900/30 text-green-600" :
                              order.status === "cancelled" ? "bg-red-100 dark:bg-red-900/30 text-red-500" :
                              order.status === "shipped" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600" :
                              "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600"
                            }`}>
                              {order.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-gray-500 dark:text-gray-400 capitalize">{order.paymentMethod?.replace("_", " ")}</td>
                          <td className="px-6 py-4 text-gray-400 text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Products ── */}
        {tab === "products" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t("Products", "المنتجات")}</h1>
                <p className="text-gray-400 mt-1">{products.length} {t("total", "إجمالي")}</p>
              </div>
              <button onClick={() => setTab("add")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors flex items-center gap-2">
                + {t("Add Product", "إضافة منتج")}
              </button>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 overflow-hidden animate-pulse">
                    <div className="h-40 bg-gray-100 dark:bg-gray-800" />
                    <div className="p-4 space-y-2">
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-3/4" />
                      <div className="h-4 bg-gray-100 dark:bg-gray-800 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      {[t("Product", "المنتج"), t("Price", "السعر"), t("Stock", "المخزون"), t("Status", "الحالة"), t("Actions", "إجراءات")].map((h) => (
                        <th key={h} className="text-left px-6 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                    {products.map((p) => (
                      <tr key={p._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <img src={p.image ? `http://localhost:3000/${p.image}` : "https://placehold.co/40x40?text=?"} alt={p.name}
                              className="w-10 h-10 rounded-lg object-cover flex-shrink-0" />
                            <span className="font-medium text-gray-800 dark:text-white">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-bold text-blue-600">${p.price}</td>
                        <td className="px-6 py-4 text-gray-600 dark:text-gray-300">{p.stock ?? "—"}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${p.stock > 0 ? "bg-green-100 dark:bg-green-900/30 text-green-600" : "bg-red-100 dark:bg-red-900/30 text-red-500"}`}>
                            {p.stock > 0 ? t("In Stock", "متوفر") : t("Out of Stock", "نفذ")}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button onClick={() => handleDeleteProduct(p._id)}
                            className="text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors">
                            🗑️ {t("Delete", "حذف")}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── Add Product ── */}
        {tab === "add" && (
          <div className="max-w-xl space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t("Add New Product", "إضافة منتج جديد")}</h1>
              <p className="text-gray-400 mt-1">{t("Fill in the details below", "أدخل التفاصيل أدناه")}</p>
            </div>

            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm p-8">
              <form onSubmit={handleAddProduct} className="space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("Product Name", "اسم المنتج")}</label>
                  <input type="text" placeholder={t("e.g. Arduino Uno", "مثال: أردوينو أونو")} value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })} required
                    className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("Price ($)", "السعر ($)")}</label>
                    <input type="number" placeholder="0.00" value={form.price}
                      onChange={(e) => setForm({ ...form, price: e.target.value })} required min="0"
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("Stock", "المخزون")}</label>
                    <input type="number" placeholder="0" value={form.stock}
                      onChange={(e) => setForm({ ...form, stock: e.target.value })} required min="0"
                      className="w-full border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition" />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("Product Image", "صورة المنتج")}</label>
                  <div className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center hover:border-blue-400 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("imgInput").click()}>
                    {image ? (
                      <div className="space-y-2">
                        <img src={URL.createObjectURL(image)} alt="preview" className="w-24 h-24 object-cover rounded-xl mx-auto" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">{image.name}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-3xl">📸</p>
                        <p className="text-sm text-gray-400">{t("Click to upload image", "اضغط لرفع صورة")}</p>
                      </div>
                    )}
                    <input id="imgInput" type="file" accept="image/*" className="hidden"
                      onChange={(e) => setImage(e.target.files[0])} />
                  </div>
                </div>

                {msg && (
                  <div className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium ${msg.type === "success" ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-600" : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600"}`}>
                    {msg.type === "success" ? "✅" : "⚠️"} {msg.text}
                  </div>
                )}

                <button type="submit" disabled={submitting}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3.5 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2">
                  {submitting ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("Adding...", "جارٍ الإضافة...")}</> : `+ ${t("Add Product", "إضافة المنتج")}`}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* ── Orders ── */}
        {tab === "orders" && (
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white">{t("All Orders", "جميع الطلبات")}</h1>
              <p className="text-gray-400 mt-1">{orders.length} {t("total orders", "طلب إجمالي")}</p>
            </div>

            {loading ? (
              <div className="text-center py-20 text-gray-400">{t("Loading...", "جارٍ التحميل...")}</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-20 bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800">
                <p className="text-5xl mb-3">📭</p>
                <p className="text-gray-400 font-medium">{t("No orders yet", "لا توجد طلبات بعد")}</p>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        {[t("Order ID", "رقم الطلب"), t("Customer", "العميل"), t("Total", "الإجمالي"), t("Status", "الحالة"), t("Payment", "الدفع"), t("Address", "العنوان"), t("Date", "التاريخ")].map((h) => (
                          <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase whitespace-nowrap">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 dark:divide-gray-800">
                      {orders.map((order) => (
                        <tr key={order._id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                          <td className="px-5 py-4 font-mono text-xs text-gray-400">#{order._id.slice(-6)}</td>
                          <td className="px-5 py-4 text-gray-600 dark:text-gray-300">{order.user?.email || "—"}</td>
                          <td className="px-5 py-4 font-bold text-blue-600">${order.totalPrice}</td>
                          <td className="px-5 py-4">
                            <select
                              value={order.status}
                              onChange={async (e) => {
                                const newStatus = e.target.value;
                                await axios.put(`${API}/orders/${order._id}/status`, { status: newStatus }, { headers });
                                setOrders(orders.map(o => o._id === order._id ? { ...o, status: newStatus } : o));
                              }}
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold border-0 outline-none cursor-pointer ${
                                order.status === 'delivered' ? 'bg-green-100 dark:bg-green-900/30 text-green-600' :
                                order.status === 'cancelled' ? 'bg-red-100 dark:bg-red-900/30 text-red-500' :
                                order.status === 'shipped' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' :
                                order.status === 'confirmed' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-600' :
                                'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600'
                              }`}>
                              {['pending','confirmed','shipped','delivered','cancelled'].map(s => (
                                <option key={s} value={s}>{s}</option>
                              ))}
                            </select>
                          </td>
                          <td className="px-5 py-4 text-gray-500 dark:text-gray-400 capitalize text-xs">{order.paymentMethod?.replace("_", " ")}</td>
                          <td className="px-5 py-4 text-gray-400 text-xs max-w-32 truncate">{order.shippingAddress}</td>
                          <td className="px-5 py-4 text-gray-400 text-xs whitespace-nowrap">{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
