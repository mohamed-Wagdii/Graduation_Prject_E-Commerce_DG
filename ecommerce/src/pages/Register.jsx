import React, { useState, useContext } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { login, dark, setDark, lang, setLang, t } = useContext(AppContext);
  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await axios.post("http://localhost:3000/api/register", { ...form, role: "user" });
      const res = await axios.post("http://localhost:3000/api/login", { email: form.email, password: form.password });
      if (res.data.token) { login(res.data.token); navigate("/app"); }
    } catch (err) {
      setError(err.response?.data?.msg || t("Registration failed", "فشل إنشاء الحساب"));
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-xl px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-900/30 transition placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center transition-colors p-4">
      <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 bg-white dark:bg-gray-900 rounded-3xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-800">

        <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-indigo-600 to-blue-700 p-10 text-white">
          <div>
            <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center font-bold text-lg mb-8">M</div>
            <h2 className="text-3xl font-bold mb-3">{t("Join us today!", "انضم إلينا اليوم!")}</h2>
            <p className="text-blue-100 leading-relaxed">{t("Create your account and start shopping.", "أنشئ حسابك وابدأ التسوق.")}</p>
          </div>
          <div className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
            <p className="text-sm text-blue-100 italic">{t('"Best place for Arduino components!"', '"أفضل مكان لمكونات الأردوينو!"')}</p>
            <p className="text-xs text-blue-200 mt-3 font-medium">— {t("Happy Customer", "عميل سعيد")}</p>
          </div>
        </div>

        <div className="p-10">
          <div className="flex justify-end gap-2 mb-6">
            <button onClick={() => setLang(lang === "en" ? "ar" : "en")}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {lang === "en" ? "ع" : "EN"}
            </button>
            <button onClick={() => setDark(!dark)}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
              {dark ? "☀️" : "🌙"}
            </button>
          </div>

          <h1 className="text-2xl font-bold text-gray-800 dark:text-white mb-1">{t("Create account", "إنشاء حساب")}</h1>
          <p className="text-gray-400 text-sm mb-8">
            {t("Already have one?", "لديك حساب بالفعل؟")}{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">{t("Sign in", "تسجيل الدخول")}</Link>
          </p>

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("Username", "اسم المستخدم")}</label>
              <input type="text" placeholder={t("John Doe", "محمد أحمد")} value={form.username} onChange={set("username")} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("Email address", "البريد الإلكتروني")}</label>
              <input type="email" placeholder="you@example.com" value={form.email} onChange={set("email")} required className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">{t("Password", "كلمة المرور")}</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} placeholder={t("Min. 6 characters", "٦ أحرف على الأقل")} value={form.password} onChange={set("password")} required className={`${inputClass} pr-12`} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
                  {showPassword ? t("Hide", "إخفاء") : t("Show", "إظهار")}
                </button>
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm px-4 py-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white py-3 rounded-xl font-semibold text-sm transition-colors shadow-sm flex items-center justify-center gap-2">
              {loading ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{t("Creating...", "جارٍ الإنشاء...")}</> : t("Create Account →", "إنشاء الحساب ←")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
