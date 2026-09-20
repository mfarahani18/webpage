import React, { useState } from 'react';
import { 
  Building2, 
  FileCheck, 
  Percent, 
  Truck, 
  Clock, 
  Send, 
  Phone, 
  CheckCircle2, 
  Download,
  ShieldCheck
} from 'lucide-react';

export const B2BSection: React.FC = () => {
  const [formData, setFormData] = useState({
    builderName: '',
    phone: '',
    projectName: '',
    unitsCount: '6',
    city: 'قم',
    requiredSystems: ['پکیج و رادیاتور', 'تجهیزات آشپزخانه'],
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [inquiryResult, setInquiryResult] = useState<{
    inquiryId?: string;
    discountPercent?: number;
    assignedDepartment?: string;
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('/api/b2b-inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      if (data.success) {
        setInquiryResult({
          inquiryId: data.inquiryId,
          discountPercent: data.discountPercent,
          assignedDepartment: data.assignedDepartment
        });
      }
    } catch (err) {
      console.error('Failed to submit B2B inquiry:', err);
    } finally {
      setIsLoading(false);
      setIsSubmitted(true);
    }
  };

  const toggleSystem = (sys: string) => {
    setFormData(prev => ({
      ...prev,
      requiredSystems: prev.requiredSystems.includes(sys)
        ? prev.requiredSystems.filter(s => s !== sys)
        : [...prev.requiredSystems, sys]
    }));
  };

  return (
    <section id="b2b-section" className="py-8 space-y-8">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#12284C] via-[#1E3A8A] to-[#12284C] text-white p-6 sm:p-10 rounded-3xl relative overflow-hidden shadow-lg">
        <div className="max-w-3xl space-y-3 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-400/20 text-amber-300 text-xs font-bold border border-amber-400/30">
            <Building2 className="w-4 h-4" />
            مرکز خدمات انبوه‌سازان، مهندسین ناظر و پیمانکاران پروژه
          </div>
          <h2 className="text-2xl sm:text-3xl font-black leading-tight">
            تأمین جامع تأسیسات ساختمانی پروژه‌ها با تخفیف پلکانی و فاکتور رسمی
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
            بازرگانی مطبوع شهر (TSH) مجری تأمین پروژه‌های مسکونی، اداری و ویلایی در استان قم و سراسر ایران. ارائه پیش‌فاکتور رسمی شرکتی با ثبت در سامانه مودیان مالیاتی، تحویل مرحله‌ای پای کارگاه و تضمین خدمات پس از فروش رسمی کارخانجات.
          </p>
        </div>

        {/* 4 Feature Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8 mt-8 border-t border-white/10 text-xs relative z-10">
          <div className="flex items-start gap-2.5">
            <Percent className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">تخفیف همکاری پلکانی</div>
              <div className="text-slate-300 text-[11px]">تا ۱۵٪ تخفیف ویژه بر اساس تعداد واحدها</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <FileCheck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">فاکتور رسمی ارزش افزوده</div>
              <div className="text-slate-300 text-[11px]">صدور صورتحساب الکترونیکی سامانه مودیان</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">تسویه مرحله‌ای پروژه</div>
              <div className="text-slate-300 text-[11px]">انعطاف در پرداخت متناسب با پیشرفت فیزیکی</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Truck className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white">حمل مستقیم به کارگاه</div>
              <div className="text-slate-300 text-[11px]">تخلیه بدون واسطه در محل پروژه</div>
            </div>
          </div>
        </div>
      </div>

      {/* Form & Consultation Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Form Column */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-xs">
          <h3 className="text-lg font-black text-[#12284C] mb-2">
            فرم استعلام قیمت و دریافت پیش‌فاکتور پروژه‌ای
          </h3>
          <p className="text-xs text-slate-500 mb-6">
            مشخصات پروژه را ثبت فرمایید تا کارشناسان فنی بازرگانی TSH پیش‌فاکتور اختصاصی با بالاترین درصد تخفیف را آماده و تقدیم نمایند.
          </p>

          {isSubmitted ? (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 space-y-4">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h4 className="text-lg font-black text-emerald-900">
                درخواست پیش‌فاکتور پروژه با موفقیت ثبت گردید!
              </h4>

              {inquiryResult?.inquiryId && (
                <div className="inline-flex items-center gap-2 bg-emerald-100/90 text-emerald-950 font-mono text-sm px-4 py-2 rounded-xl border border-emerald-300 shadow-xs">
                  <span>کد پیگیری سیستمی استعلام:</span>
                  <span className="font-bold tracking-wider text-blue-900">{inquiryResult.inquiryId}</span>
                </div>
              )}

              {inquiryResult?.discountPercent && (
                <div className="text-xs font-bold text-blue-900 bg-blue-50 py-1.5 px-3 rounded-lg border border-blue-200 inline-block">
                  تخفیف همکاری تعلق‌گرفته: {inquiryResult.discountPercent}٪ کسر از قیمت مصوب کارخانجات
                </div>
              )}

              <p className="text-xs text-emerald-700 max-w-md mx-auto leading-relaxed">
                اطلاعات پروژه شما به واحد مهندسی فروش بازرگانی مطبوع شهر ارجاع شد. کارشناسان ما ظرف حداکثر ۲ ساعت کاری جهت ارائه آنالیز قیمت، برآورد تجهیزات و صدور پیش‌فاکتور رسمی با شما تماس خواهند گرفت.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setInquiryResult(null);
                }}
                className="mt-4 px-4 py-2 text-xs font-bold text-emerald-800 bg-white hover:bg-emerald-100 rounded-xl border border-emerald-200 transition-colors"
              >
                ثبت استعلام جدید
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700">نام سازنده یا شرکت مهندسی: *</label>
                  <input
                    type="text"
                    required
                    value={formData.builderName}
                    onChange={(e) => setFormData({...formData, builderName: e.target.value})}
                    placeholder="مثال: مهندس رحیمی / شرکت ساختمانی نوین"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700">شماره همراه کارفرما / مدیر پروژه: *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700">نام پروژه / آدرس:</label>
                  <input
                    type="text"
                    value={formData.projectName}
                    onChange={(e) => setFormData({...formData, projectName: e.target.value})}
                    placeholder="مثال: برج مسکونی پردیسان"
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700">تعداد واحدها:</label>
                  <select
                    value={formData.unitsCount}
                    onChange={(e) => setFormData({...formData, unitsCount: e.target.value})}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  >
                    <option value="1-4">۱ الی ۴ واحد</option>
                    <option value="5-10">۵ الی ۱۰ واحد</option>
                    <option value="10-30">۱۰ الی ۳۰ واحد</option>
                    <option value="30+">بیش از ۳۰ واحد (انبوه‌سازی بزرگ)</option>
                  </select>
                </div>

                <div className="space-y-1 text-xs">
                  <label className="font-bold text-slate-700">شهر محل پروژه:</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="قم، تهران، کاشان..."
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                  />
                </div>
              </div>

              {/* Required systems selection */}
              <div className="space-y-2 pt-2 text-xs">
                <label className="font-bold text-slate-700 block">سیستم‌های مورد نیاز برای استعلام:</label>
                <div className="flex flex-wrap gap-2">
                  {[
                    'پکیج و رادیاتور',
                    'کولر گازی و داکت اسپلیت',
                    'تجهیزات آشپزخانه (هود، گاز، سینک)',
                    'شیرآلات ساختمانی و بهداشتی',
                    'تصفیه آب و پمپ تحت فشار',
                    'اتصالات و لوله پنج‌لایه'
                  ].map((sys) => {
                    const isSelected = formData.requiredSystems.includes(sys);
                    return (
                      <button
                        type="button"
                        key={sys}
                        onClick={() => toggleSystem(sys)}
                        className={`px-3 py-1.5 rounded-lg border text-xs font-semibold transition-colors ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                            : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                        }`}
                      >
                        {sys}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1 text-xs">
                <label className="font-bold text-slate-700">توضیحات تکمیلی یا متراژ واحدها:</label>
                <textarea
                  rows={3}
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  placeholder="مثال: ۸ واحد ۱۲۰ متری، نیاز به پکیج ۲۴ هزار دو مبدل و رادیاتور آلومینیومی کال ۵۰۰ با احتساب شیر رادیاتور..."
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-blue-600 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-[#12284C] to-[#1E3A8A] hover:from-[#0d1e3a] hover:to-[#172e6f] disabled:opacity-60 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>در حال ثبت در سامانه مهندسی فروش...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>ثبت استعلام و صدور پیش‌فاکتور همکاری</span>
                  </>
                )}
              </button>
            </form>
          )}
        </div>

        {/* B2B Direct Assistance & Downloads Column */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Direct Line Card */}
          <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 space-y-4">
            <h4 className="text-base font-black text-amber-300">
              ارتباط مستقیم با مدیریت فروش سازمانی TSH
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              جهت هماهنگی جلسه حضوری در محل دفتر مرکزی قم، بازدید کارشناسی از پروژه و یا مذاکره در خصوص قراردادهای تهاتر ساختمانی:
            </p>

            <div className="space-y-2 pt-2">
              <a
                href="tel:02537700000"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-xs font-bold"
              >
                <Phone className="w-4 h-4 text-emerald-400" />
                <span>تلفن واحد پروژه‌ها: ۳۷۷۰۰۰۰۰-۰۲۵ (داخلی ۱۰۴)</span>
              </a>

              <a
                href="tel:09120000000"
                className="flex items-center gap-3 p-3 rounded-xl bg-white/10 hover:bg-white/15 transition-colors text-xs font-bold"
              >
                <Phone className="w-4 h-4 text-amber-400" />
                <span>خط ویژه واتساپ مهندسی: ۰۹۱۲۰۰۰۰۰۰۰</span>
              </a>
            </div>
          </div>

          {/* Builder Perks Card */}
          <div className="bg-blue-50 p-6 rounded-3xl border border-blue-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-black text-[#12284C]">
              <ShieldCheck className="w-4 h-4 text-blue-700" />
              مزایای انحصاری طرف قرارداد با مطبوع شهر (TSH):
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>گارانتی معتبر شرکتی از تاریخ راه‌اندازی واقعی واحد، نه تاریخ فاکتور خرید</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>انبارداری رایگان اقلام تا زمان آماده‌سازی محل نصب در ساختمان</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                <span>تامین کلیه ملزومات نصب استاندارد تایید شده سازمان نظام مهندسی</span>
              </li>
            </ul>
          </div>

        </div>

      </div>
    </section>
  );
};
