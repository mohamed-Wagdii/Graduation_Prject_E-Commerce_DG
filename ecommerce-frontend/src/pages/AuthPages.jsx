import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

function AuthInput({ label, type = "text", value, onChange, placeholder, required, autoComplete }) {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";
  return (
    <div>
      <label className="block text-xs font-mono uppercase tracking-widest text-ink-500 mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={isPassword && showPw ? "text" : type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          autoComplete={autoComplete}
          className="input-field pr-10"
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-700"
          >
            {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        )}
      </div>
    </div>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(form.email, form.password);
      toast.success(`Welcome back${user.name ? ", " + user.name.split(" ")[0] : ""}!`);
      const dest = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/");
      navigate(dest, { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-parchment flex">
      {/* Left decorative panel */}
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #f59e0b 0%, transparent 60%), radial-gradient(circle at 80% 20%, #d97706 0%, transparent 50%)" }} />
        <div className="relative text-center">
          <p className="font-display text-5xl text-cream mb-6">
            Maison<span className="text-amber-400">.</span>
          </p>
          <p className="text-ink-400 font-light text-lg italic font-display">
            "Objects worth living with."
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="font-display text-3xl text-ink-900">
              Maison<span className="text-amber-600">.</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl text-ink-900 mb-2">Sign in</h1>
          <p className="text-sm text-ink-400 mb-8">
            New here?{" "}
            <Link to="/register" className="text-amber-700 hover:underline font-medium">
              Create an account
            </Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput
              label="Email"
              type="email"
              value={form.email}
              onChange={set("email")}
              placeholder="you@example.com"
              required
              autoComplete="email"
            />
            <AuthInput
              label="Password"
              type="password"
              value={form.password}
              onChange={set("password")}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-cream border-t-transparent animate-spin" />
              ) : (
                <>Sign In <ArrowRight size={14} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}

export function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [loading, setLoading] = useState(false);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const user = await register({ name: form.name, email: form.email, password: form.password });
      toast.success("Account created! Welcome to Maison.");
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-parchment flex">
      <div className="hidden lg:flex lg:w-1/2 bg-ink-900 items-center justify-center p-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 70%, #f59e0b 0%, transparent 60%), radial-gradient(circle at 80% 20%, #d97706 0%, transparent 50%)" }} />
        <div className="relative text-center">
          <p className="font-display text-5xl text-cream mb-6">
            Maison<span className="text-amber-400">.</span>
          </p>
          <p className="text-ink-400 font-light text-lg italic font-display">
            Join thousands of discerning shoppers.
          </p>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-10 text-center">
            <Link to="/" className="font-display text-3xl text-ink-900">
              Maison<span className="text-amber-600">.</span>
            </Link>
          </div>

          <h1 className="font-display text-3xl text-ink-900 mb-2">Create account</h1>
          <p className="text-sm text-ink-400 mb-8">
            Already have one?{" "}
            <Link to="/login" className="text-amber-700 hover:underline font-medium">Sign in</Link>
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AuthInput label="Full Name" value={form.name} onChange={set("name")} placeholder="Jane Doe" required autoComplete="name" />
            <AuthInput label="Email" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" required autoComplete="email" />
            <AuthInput label="Password" type="password" value={form.password} onChange={set("password")} placeholder="Min. 8 characters" required autoComplete="new-password" />
            <AuthInput label="Confirm Password" type="password" value={form.confirmPassword} onChange={set("confirmPassword")} placeholder="Repeat password" required autoComplete="new-password" />

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary flex items-center justify-center gap-2 py-3.5 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-cream border-t-transparent animate-spin" />
              ) : (
                <>Create Account <ArrowRight size={14} /></>
              )}
            </button>
          </form>

          <p className="text-xs text-ink-400 mt-4 text-center">
            By creating an account, you agree to our{" "}
            <Link to="/" className="underline hover:text-ink-700">Terms</Link> and{" "}
            <Link to="/" className="underline hover:text-ink-700">Privacy Policy</Link>.
          </p>
        </div>
      </div>
    </main>
  );
}
