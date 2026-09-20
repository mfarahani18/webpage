import React from 'react';
import { 
  Building2, 
  Smartphone, 
  Monitor, 
  ShoppingCart, 
  Search, 
  FileText, 
  PhoneCall, 
  Sparkles,
  MapPin,
  Clock,
  Menu,
  X
} from 'lucide-react';
import { CartItem } from '../types';

interface NavbarProps {
  viewMode: 'web' | 'android';
  setViewMode: (mode: 'web' | 'android') => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  cartItems: CartItem[];
  setIsCartOpen: (open: boolean) => void;
  setIsStrategyOpen: (open: boolean) => void;
  setIsChatOpen: (open: boolean) => void;
  activeSection: string;
  setActiveSection: (sec: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  viewMode,
  setViewMode,
  searchQuery,
  setSearchQuery,
  cartItems,
  setIsCartOpen,
  setIsStrategyOpen,
  setIsChatOpen,
  activeSection,
  setActiveSection,
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      {/* Top Notification Bar */}
      <div className="bg-[#12284C] text-white text-xs py-2 px-4">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-blue-200">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              بازرگانی مطبوع شهر (TSH) | مرکز تخصصی سرمایش، گرمایش و تجهیزات آشپزخانه
            </span>
            <span className="hidden md:inline-block text-slate-300 border-r border-slate-700 pr-4">
              الهام‌گرفته از ساختار جامع قم‌تجهیز (qomtajhiz.ir)
            </span>
          </div>

          <div className="flex items-center gap-4 text-xs">
            <span className="hidden sm:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-amber-400" />
              مرکز توزیع قم و ارسال سراسری به پروژه‌ها
            </span>
            <a 
              href="tel:02537700000" 
              className="flex items-center gap-1 text-amber-300 hover:text-amber-200 font-bold"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              مشاوره مهندسی: ۰۲۵-۳۷۷۰۰۰۰۰
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo & Brand Identity */}
          <div className="flex items-center gap-3">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-700 lg:hidden"
              aria-label="منوی سایت"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <div 
              onClick={() => setActiveSection('home')}
              className="flex items-center gap-3 cursor-pointer group"
            >
              <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#12284C] to-[#1E3A8A] flex items-center justify-center text-white font-extrabold text-xl shadow-md tracking-wider border border-blue-900/20 group-hover:scale-105 transition-transform">
                TSH
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-lg text-[#12284C] tracking-tight">مطبوع شهر</span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">TSH Comfort</span>
                </div>
                <span className="text-[11px] text-slate-700 font-medium">راهکارهای نوین سرمایش، گرمایش و آشپزخانه</span>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی پکیج بوتان، رادیاتور پره‌ای، داکت اسپلیت، هود کن..."
              className="w-full pl-10 pr-4 py-2 text-sm bg-slate-100/80 border border-slate-200 rounded-full focus:outline-hidden focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all text-slate-800 placeholder-slate-700"
            />
            <Search className="w-4 h-4 text-slate-700 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute left-9 top-1/2 -translate-y-1/2 text-xs text-slate-700 hover:text-slate-600"
              >
                پاک کردن
              </button>
            )}
          </div>

          {/* Action Buttons & Mode Switcher */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* View Mode Switcher: Desktop Web vs Android APK */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center border border-slate-200">
              <button
                id="view-mode-web"
                onClick={() => setViewMode('web')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'web'
                    ? 'bg-white text-[#12284C] shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="نمای وب‌سایت دسکتاپ کامل"
              >
                <Monitor className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">سایت پرتال</span>
              </button>
              <button
                id="view-mode-android"
                onClick={() => setViewMode('android')}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'android'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
                title="نمای اپلیکیشن اندروید (Mobile APK)"
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">اپلیکیشن اندروید</span>
              </button>
            </div>

            {/* Strategic Roadmap Button */}
            <button
              id="roadmap-toggle-btn"
              onClick={() => setIsStrategyOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 rounded-xl border border-blue-200 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden lg:inline">نقشه راه ۶ گانه</span>
              <span className="lg:hidden">استراتژی</span>
            </button>

            {/* AI Engineering Chatbot */}
            <button
              id="ai-chat-btn"
              onClick={() => setIsChatOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 rounded-xl shadow-xs hover:shadow transition-all"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">مشاور هوشمند TSH</span>
              <span className="sm:hidden">چت هوش مصنوعی</span>
            </button>

            {/* Quote / Cart Drawer Button */}
            <button
              id="cart-drawer-btn"
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-xl text-slate-700 hover:text-blue-700 hover:bg-slate-100 transition-colors"
              title="پیش‌فاکتور و سبد استعلام"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        <div className="mt-2.5 md:hidden">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="جستجوی تجهیزات، برندها، قطعات تاسیسات..."
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-700"
            />
            <Search className="w-4 h-4 text-slate-700 absolute left-3 top-1/2 -translate-y-1/2" />
          </div>
        </div>
      </div>

      {/* Navigation Links Bar */}
      <nav className="bg-slate-50 border-t border-slate-200/80 px-4 sm:px-6 overflow-x-auto scrollbar-none">
        <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 py-1.5 text-xs font-medium text-slate-700 min-w-max">
          <button
            onClick={() => setActiveSection('home')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'home' ? 'bg-[#12284C] text-white font-bold' : 'hover:bg-slate-200/80'
            }`}
          >
            صفحه اصلی
          </button>
          <button
            onClick={() => setActiveSection('calculator')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeSection === 'calculator' ? 'bg-[#12284C] text-white font-bold' : 'text-blue-700 bg-blue-50/70 hover:bg-blue-100'
            }`}
          >
            <Clock className="w-3 h-3 text-blue-600" />
            محاسبه‌گر آنلاین ظرفیت و متراژ
          </button>
          <button
            onClick={() => setActiveSection('bundles')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeSection === 'bundles' ? 'bg-[#12284C] text-white font-bold' : 'text-amber-800 bg-amber-50/80 hover:bg-amber-100'
            }`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            پک‌های باندل تخفیف‌دار
          </button>
          <button
            onClick={() => setActiveSection('catalog')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeSection === 'catalog' ? 'bg-[#12284C] text-white font-bold' : 'hover:bg-slate-200/80'
            }`}
          >
            کاتالوگ محصولات
          </button>
          <button
            onClick={() => setActiveSection('b2b')}
            className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1 ${
              activeSection === 'b2b' ? 'bg-[#12284C] text-white font-bold' : 'hover:bg-slate-200/80'
            }`}
          >
            <FileText className="w-3 h-3 text-slate-500" />
            میز انبوه‌سازان و پیمانکاران (B2B)
          </button>
          <button
            onClick={() => setIsStrategyOpen(true)}
            className="px-3 py-1.5 rounded-lg transition-colors text-indigo-700 hover:bg-indigo-50 font-semibold"
          >
            نقشه راه توسعه کسب‌وکار
          </button>
        </div>
      </nav>
    </header>
  );
};
