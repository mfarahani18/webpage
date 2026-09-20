import React from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  ShieldCheck, 
  Truck, 
  Award, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

interface FooterProps {
  onOpenCalculator: () => void;
  onOpenBundles: () => void;
  onOpenStrategy: () => void;
  onOpenChat: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCalculator,
  onOpenBundles,
  onOpenStrategy,
  onOpenChat,
}) => {
  return (
    <footer className="bg-[#0b172c] text-white pt-12 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Top 4 Trust Badges Strip */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-10 border-b border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-900/40 border border-blue-700/30 flex items-center justify-center text-blue-400 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">ضمانت ۱۰۰٪ اصالت</div>
              <div className="text-xs text-slate-400 mt-0.5">نمایندگی رسمی برترین برندها</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-900/30 border border-amber-700/30 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">گارانتی طلایی تعویض</div>
              <div className="text-xs text-slate-400 mt-0.5">خدمات پس از فروش رسمی کارخانه</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-900/30 border border-emerald-700/30 flex items-center justify-center text-emerald-400 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">ارسال به سراسر کشور</div>
              <div className="text-xs text-slate-400 mt-0.5">تحویل پای کارگاه در استان قم</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-purple-900/30 border border-purple-700/30 flex items-center justify-center text-purple-400 shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="text-sm font-bold text-white">محاسبه مهندسی رایگان</div>
              <div className="text-xs text-slate-400 mt-0.5">برآورد بار حرارتی و برودتی</div>
            </div>
          </div>
        </div>

        {/* Middle Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 py-10 border-b border-slate-800/80">
          
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-extrabold text-lg shadow-md">
                TSH
              </div>
              <div>
                <h3 className="text-lg font-black text-white">بازرگانی مطبوع شهر (TSH)</h3>
                <span className="text-xs text-slate-400">راهکارهای نوین سرمایش، گرمایش و آشپزخانه (الهام‌گرفته از قم‌تجهیز)</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-md">
              بازرگانی مطبوع شهر مرکز تخصصی فروش و مهندسی تجهیزات تأسیسات ساختمانی شامل انواع پکیج شوفاژ دیواری و زمینی، رادیاتورهای پره‌ای و پنلی، اسپلیت‌های اینورتر، داکت اسپلیت، و تجهیزات لوکس آشپزخانه (هود، سینک و گاز توکار) با همکاری برترین کارخانجات داخلی و بین‌المللی.
            </p>

            <div className="space-y-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                <span>قم، بلوار غدیر، مجتمع تخصصی تأسیسات و ساختمان مطبوع شهر</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>تلفن تماس: ۳۷۷۰۰۰۰۰-۰۲۵ (خط ویژه ۱۰ رقمی)</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>ساعات کاری: شنبه تا پنجشنبه ۸:۰۰ الی ۲۱:۰۰ یکسره</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3 space-y-3 text-xs">
            <h4 className="text-sm font-bold text-white border-r-2 border-blue-500 pr-2">
              دسترسی‌های سریع
            </h4>
            <ul className="space-y-2 text-slate-400">
              <li>
                <button onClick={onOpenCalculator} className="hover:text-amber-300 transition-colors">
                  محاسبه‌گر آنلاین ظرفیت پکیج و متراژ
                </button>
              </li>
              <li>
                <button onClick={onOpenBundles} className="hover:text-amber-300 transition-colors">
                  پک‌های باندل تخفیف‌دار انبوه‌سازان
                </button>
              </li>
              <li>
                <button onClick={onOpenChat} className="hover:text-amber-300 transition-colors">
                  مشاور هوشمند تأسیسات TSH (هوش مصنوعی)
                </button>
              </li>
              <li>
                <button onClick={onOpenStrategy} className="hover:text-amber-300 transition-colors">
                  نقشه راه ۶ گانه توسعه بازرگانی و برندسازی
                </button>
              </li>
              <li>
                <a href="https://www.qomtajhiz.ir" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-white transition-colors">
                  <span>مشاهده سایت مرجع قم‌تجهیز</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

          {/* Electronic Trust Symbols / Badges */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-sm font-bold text-white border-r-2 border-amber-500 pr-2">
              مجوزها و تاییدیه‌های رسمی
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-blue-900/60 mx-auto flex items-center justify-center text-blue-400 font-bold">
                  ✓
                </div>
                <div className="font-bold text-white text-[11px]">نماد اعتماد الکترونیکی</div>
                <div className="text-[10px] text-slate-500">وزارت صنعت، معدن و تجارت</div>
              </div>

              <div className="bg-slate-900/90 p-3 rounded-xl border border-slate-800 text-center space-y-1">
                <div className="w-8 h-8 rounded-full bg-emerald-900/60 mx-auto flex items-center justify-center text-emerald-400 font-bold">
                  ★
                </div>
                <div className="font-bold text-white text-[11px]">عضو رسمی اتحادیه</div>
                <div className="text-[10px] text-slate-500">لوازم شوفاژ، گازسوز و بهداشتی</div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-900/40 text-[11px] text-blue-300">
              صدور فاکتور رسمی الکترونیکی جهت ثبت در سامانه مودیان و کسر مالیاتی شرکت‌های مهندسی و انبوه‌سازی.
            </div>
          </div>

        </div>

        {/* Bottom Copyright */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            تمامی حقوق این سامانه متعلق به بازرگانی تجهیزات گرمایشی سرمایشی مطبوع شهر (TSH) می‌باشد.
          </div>
          <div className="text-[11px]">
            طراحی شده با الهام از قالب و استانداردهای فروشگاهی قم‌تجهیز (qomtajhiz.ir)
          </div>
        </div>

      </div>
    </footer>
  );
};
