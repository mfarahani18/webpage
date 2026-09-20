import React, { useState } from 'react';
import { 
  Home, 
  Grid, 
  Calculator, 
  Sparkles, 
  FileText, 
  Wifi, 
  BatteryMedium, 
  Signal, 
  Bell, 
  Search, 
  ArrowRight,
  Monitor,
  Flame,
  Wind,
  ChefHat,
  ShieldCheck,
  Plus
} from 'lucide-react';
import { Product, BundlePack, CartItem } from '../types';

interface AndroidAppFrameProps {
  onBackToWeb: () => void;
  products: Product[];
  bundles: BundlePack[];
  cartItems: CartItem[];
  onAddToCart: (p: Product) => void;
  onOpenProductModal: (p: Product) => void;
  onOpenChat: () => void;
  onOpenQuote: () => void;
  onOpenStrategy: () => void;
}

export const AndroidAppFrame: React.FC<AndroidAppFrameProps> = ({
  onBackToWeb,
  products,
  bundles,
  cartItems,
  onAddToCart,
  onOpenProductModal,
  onOpenChat,
  onOpenQuote,
  onOpenStrategy,
}) => {
  const [activeTab, setActiveTab] = useState<'home' | 'catalog' | 'calculator' | 'bundles' | 'profile'>('home');
  const [androidSearch, setAndroidSearch] = useState('');
  const [selectedCat, setSelectedCat] = useState('all');

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const filtered = products.filter(p => {
    if (selectedCat !== 'all' && p.category !== selectedCat) return false;
    if (androidSearch.trim() && !p.title.toLowerCase().includes(androidSearch.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="py-8 px-4 flex flex-col items-center justify-center bg-slate-900 min-h-screen">
      
      {/* Top Controls Bar */}
      <div className="w-full max-w-sm mb-4 flex items-center justify-between text-white text-xs">
        <button
          onClick={onBackToWeb}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 font-bold shadow-md transition-all"
        >
          <Monitor className="w-4 h-4" />
          <span>تغییر به نمای وب‌سایت دسکتاپ</span>
        </button>

        <span className="text-slate-400 font-medium">
          شبیه‌ساز اپلیکیشن اندروید TSH
        </span>
      </div>

      {/* Android Device Mockup Shell */}
      <div className="relative w-full max-w-[390px] h-[810px] bg-slate-950 rounded-[48px] p-3 shadow-2xl border-4 border-slate-800 ring-1 ring-white/10 flex flex-col overflow-hidden">
        
        {/* Screen Container */}
        <div className="relative w-full h-full bg-slate-50 rounded-[38px] flex flex-col overflow-hidden text-slate-900 select-none">
          
          {/* Android Status Bar */}
          <div className="bg-[#12284C] text-white px-6 pt-3 pb-1 flex items-center justify-between text-[11px] font-medium shrink-0">
            <span>{new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' })}</span>
            
            {/* Camera Punch-hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-950 border border-slate-800 shadow-inner" />

            <div className="flex items-center gap-1.5">
              <Signal className="w-3 h-3" />
              <Wifi className="w-3 h-3" />
              <BatteryMedium className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Android App Header */}
          <div className="bg-[#12284C] text-white px-4 py-2.5 flex items-center justify-between shadow-xs shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-black text-xs">
                TSH
              </div>
              <div>
                <h1 className="font-extrabold text-xs">مطبوع شهر</h1>
                <div className="text-[9px] text-blue-200">اپلیکیشن رسمی تأسیسات</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onOpenChat}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-amber-300"
                title="مشاور هوشمند"
              >
                <Sparkles className="w-4 h-4" />
              </button>
              <button 
                onClick={onOpenQuote}
                className="relative p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white"
                title="سبد استعلام"
              >
                <FileText className="w-4 h-4" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Search bar inside App */}
          <div className="p-3 bg-white border-b border-slate-200 shrink-0">
            <div className="relative">
              <input
                type="text"
                value={androidSearch}
                onChange={(e) => setAndroidSearch(e.target.value)}
                placeholder="جستجو در اپلیکیشن (پکیج، هود، اسپلیت)..."
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-slate-100 border border-slate-200 rounded-xl outline-hidden focus:bg-white focus:ring-1 focus:ring-blue-600 text-slate-800 placeholder-slate-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {/* App Scrollable Content Area */}
          <div className="flex-1 overflow-y-auto p-3 space-y-4">
            
            {/* App Banner */}
            <div className="bg-gradient-to-l from-[#12284C] to-[#1E3A8A] text-white p-3.5 rounded-2xl relative overflow-hidden shadow-xs">
              <div className="space-y-1 relative z-10">
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                  تخفیف ویژه سفارش در اپلیکیشن
                </span>
                <h2 className="text-sm font-black">باندل گرمایش و سرمایش واحد مسکونی</h2>
                <p className="text-[10px] text-slate-300">پکیج بوتان + رادیاتور کال ۵۰۰ با تحویل اکسپرس در قم</p>
                <button
                  onClick={() => setActiveTab('bundles')}
                  className="mt-2 inline-block text-[11px] font-bold bg-amber-500 text-slate-950 px-2.5 py-1 rounded-lg shadow-xs"
                >
                  مشاهده باندل‌ها
                </button>
              </div>
            </div>

            {/* Category Quick Circles */}
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 text-center scrollbar-none">
              {[
                { id: 'all', title: 'همه', icon: Grid },
                { id: 'heating', title: 'پکیج', icon: Flame },
                { id: 'cooling', title: 'سرمایش', icon: Wind },
                { id: 'kitchen', title: 'آشپزخانه', icon: ChefHat },
              ].map((c) => {
                const Icon = c.icon;
                const isSelected = selectedCat === c.id;
                return (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCat(c.id)}
                    className="flex flex-col items-center gap-1 min-w-[64px]"
                  >
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center transition-colors ${
                      isSelected ? 'bg-blue-700 text-white shadow-xs' : 'bg-white text-slate-600 border border-slate-200'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold text-slate-700">{c.title}</span>
                  </button>
                );
              })}
            </div>

            {/* Quick Sizing Tool Trigger */}
            <div 
              onClick={() => onOpenChat()}
              className="bg-blue-50 border border-blue-200 p-3 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-blue-100 transition-colors"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-blue-600 text-amber-300 flex items-center justify-center">
                  <Calculator className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-blue-900">محاسبه آنلاین ظرفیت پکیج</div>
                  <div className="text-[10px] text-blue-700">بر اساس متراژ ساختمان شما</div>
                </div>
              </div>
              <ArrowRight className="w-4 h-4 text-blue-600 rotate-180" />
            </div>

            {/* Products List in Mobile */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                <span>محصولات منتخب ({filtered.length}):</span>
                <span className="text-[10px] text-blue-700 font-medium">به‌روزرسانی لحظه‌ای</span>
              </div>

              <div className="space-y-2">
                {filtered.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => onOpenProductModal(prod)}
                    className="bg-white p-2.5 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs hover:border-blue-400 transition-all cursor-pointer"
                  >
                    <img
                      src={prod.image}
                      alt={prod.title}
                      className="w-16 h-16 object-cover rounded-xl bg-slate-100 shrink-0"
                      referrerPolicy="no-referrer"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="text-[9px] font-bold bg-slate-100 text-slate-700 px-1.5 py-0.5 rounded">
                          {prod.brand}
                        </span>
                        {prod.badge && (
                          <span className="text-[9px] font-bold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded truncate">
                            {prod.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 truncate mt-1">
                        {prod.title}
                      </h4>
                      <div className="text-xs font-black text-blue-700 mt-1">
                        {(prod.discountPrice || prod.price).toLocaleString('fa-IR')} <span className="text-[9px] font-normal text-slate-500">تومان</span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onAddToCart(prod);
                      }}
                      className="p-2 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-colors shrink-0"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Strategic Roadmap Button inside App */}
            <div className="pt-2">
              <button
                onClick={onOpenStrategy}
                className="w-full py-2.5 px-3 rounded-xl bg-slate-900 text-amber-300 font-bold text-xs flex items-center justify-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                مشاهده نقشه راه ۶ گانه توسعه بازرگانی
              </button>
            </div>

          </div>

          {/* Android Bottom Navigation Bar */}
          <div className="bg-white border-t border-slate-200 px-4 py-2 flex items-center justify-between text-slate-500 shrink-0">
            <button
              onClick={() => setActiveTab('home')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeTab === 'home' ? 'text-blue-700' : 'text-slate-500'
              }`}
            >
              <Home className="w-5 h-5" />
              <span>خانه</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex flex-col items-center gap-0.5 text-[10px] font-bold ${
                activeTab === 'catalog' ? 'text-blue-700' : 'text-slate-500'
              }`}
            >
              <Grid className="w-5 h-5" />
              <span>محصولات</span>
            </button>

            <button
              onClick={onOpenChat}
              className="flex flex-col items-center gap-0.5 text-[10px] font-bold text-indigo-700"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-amber-300 flex items-center justify-center -mt-2 shadow-md">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>مشاور AI</span>
            </button>

            <button
              onClick={() => onOpenQuote()}
              className="relative flex flex-col items-center gap-0.5 text-[10px] font-bold text-slate-500 hover:text-blue-700"
            >
              <FileText className="w-5 h-5" />
              <span>پیش‌فاکتور</span>
              {totalCartCount > 0 && (
                <span className="absolute -top-1 right-2 bg-amber-500 text-slate-950 text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>

          {/* Android Navigation Gesture Bar */}
          <div className="bg-white pb-2 pt-1 flex justify-center shrink-0">
            <div className="w-32 h-1 bg-slate-300 rounded-full" />
          </div>

        </div>
      </div>
    </div>
  );
};
