import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { User, Package, Lock, ChevronRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usersAPI, ordersAPI } from "../services/api";
import toast from "react-hot-toast";

const STATUS_COLORS = {
  pending: "bg-amber-50 text-amber-700",
  processing: "bg-blue-50 text-blue-700",
  shipped: "bg-purple-50 text-purple-700",
  delivered: "bg-green-50 text-green-700",
  cancelled: "bg-red-50 text-red-700",
};

function ProfileTab({ user }) {
  const [form, setForm] = useState({ name: user?.name || "", email: user?.email || "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await usersAPI.updateProfile(form);
      toast.success("Profile updated");
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-ink-500 mb-2">Full Name</label>
        <input
          className="input-field"
          value={form.name}
          onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
        />
      </div>
      <div>
        <label className="block text-xs font-mono uppercase tracking-widest text-ink-500 mb-2">Email</label>
        <input
          type="email"
          className="input-field"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        />
      </div>
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}

function PasswordTab() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setSaving(true);
    try {
      await usersAPI.changePassword({ currentPassword: form.currentPassword, newPassword: form.newPassword });
      toast.success("Password changed");
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      {[
        { key: "currentPassword", label: "Current Password" },
        { key: "newPassword", label: "New Password" },
        { key: "confirmPassword", label: "Confirm New Password" },
      ].map(({ key, label }) => (
        <div key={key}>
          <label className="block text-xs font-mono uppercase tracking-widest text-ink-500 mb-2">{label}</label>
          <input
            type="password"
            className="input-field"
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            required
          />
        </div>
      ))}
      <button type="submit" disabled={saving} className="btn-primary">
        {saving ? "Saving…" : "Change Password"}
      </button>
    </form>
  );
}

function OrdersTab() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    ordersAPI.getMyOrders()
      .then((res) => setOrders(res.data.orders || res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="py-8 text-center text-ink-400 text-sm">Loading orders…</div>;

  if (!orders.length) {
    return (
      <div className="py-16 text-center">
        <Package size={40} className="mx-auto text-ink-200 mb-4" />
        <p className="text-ink-500 text-sm">No orders yet</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => {
        const id = order._id || order.id;
        const isOpen = expanded === id;
        return (
          <div key={id} className="border border-ink-100">
            <button
              onClick={() => setExpanded(isOpen ? null : id)}
              className="w-full flex items-center justify-between p-4 hover:bg-ink-50 transition-colors text-left"
            >
              <div className="flex items-center gap-4">
                <div>
                  <p className="text-xs font-mono text-ink-500">#{String(id).slice(-8).toUpperCase()}</p>
                  <p className="text-sm text-ink-900 font-medium mt-0.5">
                    ${Number(order.total || 0).toFixed(2)}
                  </p>
                </div>
                <span className={`badge text-xs font-mono px-2 py-1 ${STATUS_COLORS[order.status] || "bg-ink-50 text-ink-600"}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <p className="text-xs text-ink-400 hidden sm:block">
                  {new Date(order.createdAt).toLocaleDateString()}
                </p>
                <ChevronRight size={14} className={`text-ink-400 transition-transform ${isOpen ? "rotate-90" : ""}`} />
              </div>
            </button>

            {isOpen && order.items?.length > 0 && (
              <div className="border-t border-ink-100 px-4 py-3 space-y-2 bg-parchment">
                {order.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm text-ink-600">
                    <span>{item.product?.name || item.name || "Product"} × {item.quantity}</span>
                    <span>${(Number(item.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-2 border-t border-ink-200 flex justify-between text-sm font-medium text-ink-900">
                  <span>Total</span>
                  <span>${Number(order.total || 0).toFixed(2)}</span>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ProfilePage() {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab = searchParams.get("tab") || "profile";

  const tabs = [
    { key: "profile", label: "Profile", icon: User },
    { key: "orders", label: "My Orders", icon: Package },
    { key: "password", label: "Password", icon: Lock },
  ];

  return (
    <main className="pt-24 pb-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="font-display text-4xl text-ink-900 mb-8">My Account</h1>

      <div className="flex gap-8 flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="md:w-52 flex-shrink-0">
          <nav className="space-y-1">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setSearchParams({ tab: key })}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm text-left transition-colors ${
                  tab === key
                    ? "bg-ink-900 text-cream font-medium"
                    : "text-ink-600 hover:bg-ink-100 hover:text-ink-900"
                }`}
              >
                <Icon size={14} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-white border border-ink-100 p-6 md:p-8">
            <h2 className="font-display text-2xl text-ink-900 mb-6">
              {tabs.find((t) => t.key === tab)?.label}
            </h2>
            {tab === "profile" && <ProfileTab user={user} />}
            {tab === "orders" && <OrdersTab />}
            {tab === "password" && <PasswordTab />}
          </div>
        </div>
      </div>
    </main>
  );
}
