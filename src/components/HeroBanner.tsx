import React from 'react';
import { 
  ShieldCheck, 
  Flame, 
  Wind, 
  ChefHat, 
  Wrench, 
  Calculator, 
  Package, 
  ArrowLeft, 
  Sparkles,
  Award,
  Truck
} from 'lucide-react';

interface HeroBannerProps {
  onOpenCalculator: () => void;
  onOpenBundles: () => void;
  onOpenChat: () => void;
  onOpenCatalog: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onOpenCalculator,
  onOpenBundles,
  onOpenChat,
  onOpenCatalog,
}) => {
  return (
    <div className="relative overflow-hidden bg-[#0f1f3d] text-white py-10 sm:py-16 border-b border-blue-900/40">
      
      {/* Background Video (1.mp4) */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-0 opacity-40 pointer-events-none"
      >
        <source src="/1.mp4" type="video/mp4" />
      </video>

      {/* Video Overlay Tint */}
      <div className="absolute inset-0 bg-gradient-to-bl from-[#0f1f3d]/85 via-[#12284C]/80 to-[#1e3a5f]/85 pointer-events-none" />

      {/* Subtle Background Glows */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Text & Content Column */}
          <div className="lg:col-span-7 space-y-6 text-right">
            
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/15 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>TSH Modern Comfort Solutions | راهکارهای نوین سرمایش و گرمایش</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-snug">
              تجهیزات گرمایشی سرمایشی <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-l from-amber-300 via-amber-200 to-white">
                مطبوع شهر
              </span>
              {' '}و ملزومات مدرن آشپزخانه
            </h1>

            {/* Description */}
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed max-w-2xl">
              تأمین تخصصی پکیج و رادیاتور، انواع کولر گازی و داکت اسپلیت اینورتر، هود، سینک گرانیتی و شیرآلات ساختمانی. ارائه خدمات مهندسی محاسبه بار حرارتی، صدور پیش‌فاکتور رسمی برای سازندگان و فروش مستقیم با تضمین اصالت و کمترین قیمت بازار.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                id="hero-calc-cta"
                onClick={onOpenCalculator}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm sm:text-base shadow-lg hover:shadow-amber-500/25 transition-all transform hover:-translate-y-0.5 cursor-pointer"
              >
                <Calculator className="w-4 h-4" />
                محاسبه آنلاین ظرفیت پکیج و کولر
                <ArrowLeft className="w-4 h-4" />
              </button>

              <button
                id="hero-bundles-cta"
                onClick={onOpenBundles}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-semibold text-sm sm:text-base transition-all backdrop-blur-xs cursor-pointer"
              >
                <Package className="w-4 h-4 text-amber-300" />
                پک‌های باندل تخفیف‌دار سازندگان
              </button>

              <button
                id="hero-chat-cta"
                onClick={onOpenChat}
                className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-blue-600/30 hover:bg-blue-600/50 text-blue-200 border border-blue-400/30 font-medium text-sm transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-300" />
                مشاوره هوش مصنوعی
              </button>
            </div>

            {/* Quick Pillars Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-700/60 text-xs">
              <div className="flex items-center gap-2 text-slate-300">
                <Flame className="w-4 h-4 text-orange-400 shrink-0" />
                <span>پکیج و رادیاتور رسمی</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Wind className="w-4 h-4 text-sky-400 shrink-0" />
                <span>اسپلیت و داکت T3</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <ChefHat className="w-4 h-4 text-amber-400 shrink-0" />
                <span>هود، گاز و سینک لوکس</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Wrench className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>نصب و گارانتی شرکتی</span>
              </div>
            </div>
          </div>

          {/* Visual Showcase Column (Image 3 Showcase) */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-blue-400/20 shadow-2xl bg-slate-900/60 group">
              
              <div className="relative h-72 sm:h-84 overflow-hidden">
                <img
                  src="/3.jpg"
                  alt="مطبوع شهر TSH تجهیزات سرمایش گرمایش و آشپزخانه"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#12284C] via-[#12284C]/40 to-transparent" />
                
                {/* Floating Badge on Image */}
                <div className="absolute top-4 right-4 bg-slate-900/85 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-lg text-xs font-bold text-white flex items-center gap-1.5 shadow-md">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>TSH Modern Comfort Solutions</span>
                </div>

                {/* Overlaid Specs Pills */}
                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-blue-950/80 backdrop-blur-md text-[11px] font-medium text-blue-200 border border-blue-400/20">
                    بوتان • ایران رادیاتور • لورچ
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-blue-950/80 backdrop-blur-md text-[11px] font-medium text-amber-200 border border-amber-400/20">
                    کن • اخوان • استیل البرز • شودر
                  </span>
                </div>
              </div>

              {/* Bottom Info Strip inside Card */}
              <div className="p-4 bg-slate-900/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300">
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <span>تأییدیه رسمی نظام مهندسی و اداره گاز</span>
                </div>
                <div className="flex items-center gap-1.5 text-blue-300">
                  <Truck className="w-4 h-4" />
                  <span>ارسال مستقیم پای پروژه</span>
                </div>
              </div>
            </div>

            {/* Floating Stats Card */}
            <div className="hidden sm:flex items-center gap-3 absolute -bottom-5 -right-5 bg-white text-slate-900 px-4 py-2.5 rounded-xl shadow-xl border border-slate-200">
              <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500">ضمانت طلایی اصالت کالا</div>
                <div className="text-sm font-black text-slate-900">۱۰۰٪ قطعات اصل و شرکتی</div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};