"use client"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  Smartphone,
  Palette,
  Menu,
  Box,
  Zap,
  Shield,
  BarChart3,
  Bell,
  ShoppingBag,
  ArrowRight,
  LayoutDashboard,
  Globe,
  Layers
} from "lucide-react"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-primary/10">
      {/* Navigation */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100 px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <Zap size={18} className="text-white fill-white" />
          </div>
          <span className="font-black text-xl tracking-tighter">EasyApp.</span>
        </div>
        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-gray-500">
          <a href="#features" className="hover:text-black transition-colors">Features</a>
          <a href="#upcoming" className="hover:text-black transition-colors">Roadmap</a>
          <a href="#" className="hover:text-black transition-colors">Pricing</a>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm font-bold text-gray-600 hover:text-black transition-colors px-4 py-2">
            Login
          </Link>
          <Link
            href="/auth/signup"
            className="bg-black hover:bg-gray-800 text-white rounded-full px-6 py-2 text-sm font-bold shadow-xl shadow-black/10 flex items-center justify-center transition-all active:scale-95"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 px-6 overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 right-0 -z-10 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-blue-500/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-gray-100 shadow-sm animate-bounce-subtle">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">v1.2 Now Live</span>
          </div>

          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-black leading-[0.9]">
            Design. Ship. <br />
            <span className="text-primary italic">Control</span> your App.
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-500 font-medium leading-relaxed">
            The ultimate CMS for React Native E-commerce. Manage colors,
            dynamic menus, and app content without writing a single line of code.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/auth/signup"
              className="h-14 px-8 bg-black hover:bg-gray-800 text-white text-lg font-bold rounded-2xl shadow-2xl shadow-black/20 group flex items-center justify-center transition-all active:scale-95"
            >
              Start Building Now
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="h-14 px-8 border border-gray-200 text-gray-900 text-lg font-bold rounded-2xl bg-white hover:bg-gray-50 transition-all active:scale-95">
              Book a Demo
            </button>
          </div>

          {/* Preview Image / Mockup placeholder */}
          <div className="relative mt-20 max-w-5xl mx-auto">
            <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 to-blue-500/30 rounded-[2.5rem] blur-2xl opacity-50" />
            <div className="relative bg-white border border-gray-100 rounded-[2.5rem] shadow-2xl overflow-hidden aspect-[16/9] flex items-center justify-center p-2">
              <div className="w-full h-full bg-[#f8f9fb] rounded-[2rem] border border-gray-50 overflow-hidden flex">
                {/* Mock Dashboard Sidebar */}
                <div className="w-16 md:w-48 h-full bg-white border-r border-gray-100 p-4 space-y-6 hidden sm:block">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg animate-pulse" />
                  <div className="space-y-4 pt-10">
                    {[1, 2, 3, 4].map(i => <div key={i} className="h-4 w-full bg-gray-50 rounded-md animate-pulse" />)}
                  </div>
                </div>
                {/* Mock Dashboard Content */}
                <div className="flex-1 p-8 space-y-10">
                  <div className="flex justify-between items-center">
                    <div className="h-8 w-40 bg-gray-100 rounded-lg animate-pulse" />
                    <div className="h-10 w-32 bg-primary/80 rounded-full animate-pulse" />
                  </div>
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => <div key={i} className="h-32 bg-white border border-gray-100 rounded-2xl shadow-sm animate-pulse-slow" />)}
                  </div>
                  <div className="h-64 bg-white border border-gray-100 rounded-3xl shadow-sm w-full animate-pulse-slow" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-20">
            <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em]">Powerful Features</h2>
            <h3 className="text-4xl md:text-5xl font-black">Everything you need to <br /> scale your mobile commerce.</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: Theme */}
            <div className="group p-8 bg-[#fafafa] rounded-[2rem] border border-gray-100 hover:border-primary/20 hover:bg-white hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all">
                <Palette size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Universal Theming</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Change your app colors, button radius, and fonts in real-time. Universal sync across all user devices.
              </p>
            </div>

            {/* Feature 2: CMS */}
            <div className="group p-8 bg-[#fafafa] rounded-[2rem] border border-gray-100 hover:border-blue-500/20 hover:bg-white hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 group-hover:-rotate-3 transition-all">
                <LayoutDashboard size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Visual Editor</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Drag-and-drop sections, update copy, and manage promotions without waiting for App Store approval.
              </p>
            </div>

            {/* Feature 3: Menus */}
            <div className="group p-8 bg-[#fafafa] rounded-[2rem] border border-gray-100 hover:border-amber-500/20 hover:bg-white hover:shadow-2xl hover:shadow-amber-500/5 transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-amber-500 mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all">
                <Menu size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Smart Navigation</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Build complex navigation systems for drawer and bottom tabs with hundreds of premium icons.
              </p>
            </div>

            {/* Feature 4: Assets */}
            <div className="group p-8 bg-[#fafafa] rounded-[2rem] border border-gray-100 hover:border-green-500/20 hover:bg-white hover:shadow-2xl hover:shadow-green-500/5 transition-all duration-500">
              <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-all">
                <Box size={28} />
              </div>
              <h4 className="text-xl font-bold mb-3">Asset Manager</h4>
              <p className="text-gray-500 text-sm leading-relaxed">
                Centralized media storage with automatic optimization for mobile performance and fast loading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Upcoming Features Section */}
      <section id="upcoming" className="py-32 px-6 bg-black text-white relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[800px] h-[800px] bg-primary/80 rounded-full blur-[160px] opacity-20" />

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <div className="space-y-10">
            <div className="space-y-6">
              <h2 className="text-sm font-bold text-primary uppercase tracking-[0.3em]">On the Roadmap</h2>
              <h3 className="text-5xl md:text-7xl font-black">Building the <br /> Future of Admin.</h3>
              <p className="text-lg text-gray-400 font-medium leading-relaxed max-w-lg">
                We are constantly evolving. Here is a sneak peek at the powerful
                tools coming to your dashboard very soon.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-primary shrink-0">
                  <BarChart3 size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold">Deep Analytics</h4>
                  <p className="text-sm text-gray-400">Track user behavior, heatmaps, and sales funnels directly in the dashboard.</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-primary/80 text-primary text-[10px] font-bold rounded">COMMING Q1 2026</span>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-blue-400 shrink-0">
                  <Bell size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold">Push Automations</h4>
                  <p className="text-sm text-gray-400">Trigger smart notifications based on user actions likes abandoned carts.</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[10px] font-bold rounded">IN DEVELOPMENT</span>
                </div>
              </div>

              <div className="flex gap-6 p-6 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/[0.08] transition-colors">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-green-400 shrink-0">
                  <ShoppingBag size={24} />
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold">Full Inventory Management</h4>
                  <p className="text-sm text-gray-400">The same place you manage the look, you manage the stock.</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-green-500/20 text-green-400 text-[10px] font-bold rounded">ROADMAP</span>
                </div>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-10 bg-primary/30 blur-[100px] rounded-full opacity-30" />
            <div className="relative p-8 rounded-[3rem] bg-white/5 border border-white/10 backdrop-blur-3xl overflow-hidden aspect-[4/5] flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center animate-pulse">
                <Shield size={48} className="text-primary" />
              </div>
              <div className="space-y-2">
                <h4 className="text-2xl font-black uppercase tracking-tighter">Enterprise Grade</h4>
                <p className="text-gray-400 text-sm max-w-[200px]">Secure, fast, and built for large-scale operations.</p>
              </div>
              <div className="flex gap-3 pt-8">
                <Globe size={20} className="text-white/20" />
                <Zap size={20} className="text-white/20" />
                <Layers size={20} className="text-white/20" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integration Section */}
      <section className="py-24 px-6 bg-[#f8f9fb]">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-10">Seamless Integration</h2>
          <div className="flex flex-wrap justify-center items-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all">
            <span className="text-2xl font-black tracking-tighter uppercase italic">React Native</span>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Supabase</span>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Next.js</span>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Tailwind</span>
            <span className="text-2xl font-black tracking-tighter uppercase italic">Vercel</span>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-32 px-6">
        <div className="max-w-5xl mx-auto bg-primary rounded-[4rem] p-12 md:p-24 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-primary/40">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-[60px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-[60px]" />

          <h3 className="text-4xl md:text-6xl font-black text-white leading-tight">
            Ready to elevate your <br /> mobile presence?
          </h3>
          <p className="text-white/80 text-lg md:text-xl font-medium max-w-xl mx-auto">
            Join 200+ brands that use EasyApp to manage their mobile storefronts daily.
          </p>
          <div className="flex justify-center">
            <Link
              href="/auth/signup"
              className="h-16 px-10 bg-white text-primary hover:bg-gray-100 text-xl font-black rounded-3xl group shadow-2xl shadow-white/50 flex items-center justify-center transition-all active:scale-95"
            >
              Get Started Free
              <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 px-6 border-t border-gray-100">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
              <Zap size={18} className="text-white fill-white" />
            </div>
            <span className="font-black text-xl tracking-tighter">EasyApp.</span>
          </div>
          <div className="flex gap-10 text-sm font-bold text-gray-400 uppercase tracking-widest">
            <a href="#" className="hover:text-black">Terms</a>
            <a href="#" className="hover:text-black">Privacy</a>
            <a href="#" className="hover:text-black">Twitter</a>
            <a href="#" className="hover:text-black">Support</a>
          </div>
          <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">© 2026 EasyApp CMS. Built for Mobile.</p>
        </div>
      </footer>

      <style jsx>{`
                @keyframes bounce-subtle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-5px); }
                }
                .animate-bounce-subtle {
                    animation: bounce-subtle 3s ease-in-out infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 4s ease-in-out infinite;
                }
                nav a::after {
                    content: '';
                    display: block;
                    width: 0;
                    height: 2px;
                    background: black;
                    transition: width 0.3s;
                }
                nav a:hover::after {
                    width: 100%;
                }
            `}</style>
    </div>
  )
}
