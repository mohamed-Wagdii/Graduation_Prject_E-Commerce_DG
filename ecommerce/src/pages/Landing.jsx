import React from "react";
import { Link } from "react-router-dom";

const features = [
  { icon: "⚡", title: "Arduino & MCUs", desc: "Uno, Mega, Nano, ESP32 and more microcontrollers for every project." },
  { icon: "📡", title: "Sensors & Modules", desc: "Temperature, ultrasonic, IR, GPS and hundreds of sensor modules." },
  { icon: "🔋", title: "Power Supplies", desc: "Reliable power solutions for all your electronics needs." },
  { icon: "🛠️", title: "Tools & Accessories", desc: "Breadboards, jumper wires, soldering kits and more." },
  { icon: "📦", title: "Fast Delivery", desc: "Get your components delivered to your door quickly." },
  { icon: "💬", title: "Expert Support", desc: "Our team is here to help you with any technical questions." },
];

const stats = [
  { value: "500+", label: "Products" },
  { value: "10K+", label: "Happy Customers" },
  { value: "99%", label: "Satisfaction Rate" },
  { value: "24/7", label: "Support" },
];

const steps = [
  { step: "01", title: "Browse Products", desc: "Explore our wide range of electronics components and modules." },
  { step: "02", title: "Add to Cart", desc: "Select what you need and add it to your shopping cart." },
  { step: "03", title: "Checkout", desc: "Complete your order with our secure and easy checkout process." },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden">

      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">M</div>
            <span className="text-xl font-bold text-gray-900">Micro<span className="text-blue-600">Electronics</span></span>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-gray-600 hover:text-gray-900 font-medium text-sm transition-colors px-4 py-2">
              Sign In
            </Link>
            <Link to="/register" className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium text-sm transition-colors shadow-sm">
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-900" />
        <div className="absolute inset-0 opacity-20"
          style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #6366f1 0%, transparent 50%), radial-gradient(circle at 60% 80%, #0ea5e9 0%, transparent 40%)" }}
        />
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)", backgroundSize: "50px 50px" }}
        />

        {/* Floating circles */}
        <div className="absolute top-32 left-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-20 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />

        <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-blue-200 text-sm font-medium px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            Now with 500+ products in stock
          </div>

          <h1 className="text-6xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
            Build Something
            <span className="block bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
              Amazing Today
            </span>
          </h1>

          <p className="text-xl text-blue-100/80 mb-10 max-w-2xl mx-auto leading-relaxed">
            Your one-stop shop for Arduino, sensors, modules and all electronics components. Everything you need to bring your ideas to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/login"
              className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              Start Shopping
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link to="/register"
              className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-all hover:-translate-y-0.5"
            >
              Create Account
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-20 pt-10 border-t border-white/10">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
                <p className="text-blue-300 text-sm">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40">
          <span className="text-xs">Scroll down</span>
          <div className="w-5 h-8 border-2 border-white/20 rounded-full flex items-start justify-center p-1">
            <div className="w-1 h-2 bg-white/40 rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">Everything You Need</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From beginner kits to advanced components, we have everything to power your next project.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-2xl mb-4 transition-colors">
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-800 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-16">
            <span className="text-blue-600 font-semibold text-sm uppercase tracking-widest">Simple Process</span>
            <h2 className="text-4xl font-bold text-gray-900 mt-2 mb-4">How It Works</h2>
            <p className="text-gray-500 max-w-xl mx-auto">Get your components in just 3 easy steps.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-8 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-200 to-blue-200" />
            {steps.map((s, i) => (
              <div key={s.step} className="text-center relative">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl mx-auto mb-4 shadow-lg shadow-blue-200">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-800 text-lg mb-2">{s.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: "radial-gradient(circle at 30% 50%, #fff 0%, transparent 50%), radial-gradient(circle at 70% 50%, #fff 0%, transparent 50%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Start Building?</h2>
          <p className="text-blue-100 text-lg mb-8">Join thousands of makers and engineers who trust MicroElectronics for their projects.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register"
              className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-2xl font-bold text-lg transition-colors shadow-lg"
            >
              Create Free Account
            </Link>
            <Link to="/login"
              className="bg-white/10 hover:bg-white/20 border border-white/30 text-white px-8 py-4 rounded-2xl font-semibold text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xs">M</div>
            <span className="text-white font-semibold">MicroElectronics</span>
          </div>
          <p className="text-sm">© 2025 MicroElectronics. All rights reserved.</p>
          <div className="flex gap-4 text-sm">
            <Link to="/login" className="hover:text-white transition-colors">Login</Link>
            <Link to="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
