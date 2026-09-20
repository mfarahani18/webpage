import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  Plus, 
  Minus, 
  FileText, 
  Printer, 
  CheckCircle2, 
  Building2, 
  Copy, 
  Check, 
  Phone,
  ShieldCheck,
  Percent
} from 'lucide-react';
import { CartItem } from '../types';

interface QuoteDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: CartItem[];
  onUpdateQuantity: (productId: string, qty: number) => void;
  onRemoveItem: (productId: string) => void;
  onClearCart: () => void;
}

export const QuoteDrawer: React.FC<QuoteDrawerProps> = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
}) => {
  const [customerTier, setCustomerTier] = useState<'retail' | 'installer' | 'builder'>('retail');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Pricing calculations
  const rawTotal = cartItems.reduce((acc, item) => {
    const unitPrice = item.product.discountPrice || item.product.price;
    return acc + unitPrice * item.quantity;
  }, 0);

  let tierDiscountPercent = 0;
  if (customerTier === 'installer') tierDiscountPercent = 5;
  if (customerTier === 'builder') tierDiscountPercent = 10;

  const tierDiscountAmount = (rawTotal * tierDiscountPercent) / 100;
  const finalTotal = rawTotal - tierDiscountAmount;

  const quoteNumber = 'TSH-' + Math.floor(100000 + (cartItems.length * 12345) % 900000);
  const todayFa = new Date().toLocaleDateString('fa-IR');

  const handleCopyQuote = () => {
    const text = `پیش‌فاکتور رسمی بازرگانی مطبوع شهر (TSH)\nشماره استعلام: ${quoteNumber}\nتاریخ: ${todayFa}\nمشتری: ${customerName || 'همکار گرامی'}\nتلفن: ${customerPhone || '-'}\nتعداد اقلام: ${cartItems.length}\nمبلغ کل نهایی: ${finalTotal.toLocaleString('fa-IR')} تومان\nپشتیبانی: ۰۲۵-۳۷۷۰۰۰۰۰`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-start p-0 sm:p-4 bg-slate-950/60 backdrop-blur-xs">
      <div 
        className="relative bg-white w-full sm:max-w-xl h-full sm:h-[92vh] sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-slate-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-[#12284C] text-white p-4 sm:p-5 flex items-center justify-between border-b border-blue-900 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-700/80 flex items-center justify-center text-amber-300">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-sm sm:text-base">پیش‌فاکتور و استعلام رسمی قیمت</h3>
              <span className="text-[11px] text-blue-200">بازرگانی تأسیسات مطبوع شهر (TSH)</span>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-5">
          {cartItems.length === 0 ? (
            <div className="h-64 flex flex-col items-center justify-center text-slate-700 space-y-3">
              <FileText className="w-12 h-12 text-slate-500" />
              <p className="text-sm font-bold">پیش‌فاکتور شما در حال حاضر خالی است.</p>
              <p className="text-xs text-center max-w-xs">
                کالاهای مورد نظر یا باندل‌های تخفیف‌دار را از کاتالوگ یا محاسبه‌گر هوشمند اضافه کنید.
              </p>
            </div>
          ) : (
            <>
              {/* Customer Tier Switcher */}
              <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-200 space-y-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Percent className="w-3.5 h-3.5 text-blue-600" />
                  نوع کاربری و رده تخفیف پیش‌فاکتور:
                </label>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <button
                    type="button"
                    onClick={() => setCustomerTier('retail')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      customerTier === 'retail'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    مصرف‌کننده عادی
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerTier('installer')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      customerTier === 'installer'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    همکار نصاب (۵٪-)
                  </button>

                  <button
                    type="button"
                    onClick={() => setCustomerTier('builder')}
                    className={`p-2 rounded-xl border text-center transition-all ${
                      customerTier === 'builder'
                        ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600'
                    }`}
                  >
                    سازنده / انبوه‌ساز (۱۰٪-)
                  </button>
                </div>
              </div>

              {/* Items List */}
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span>اقلام سفارش داده شده ({cartItems.length} قلم):</span>
                  <button
                    onClick={onClearCart}
                    className="text-red-500 hover:text-red-700 flex items-center gap-1 font-normal text-[11px]"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    پاکسازی همه
                  </button>
                </div>

                <div className="space-y-2.5">
                  {cartItems.map((item) => {
                    const unitPrice = item.product.discountPrice || item.product.price;
                    const itemTotal = unitPrice * item.quantity;

                    return (
                      <div
                        key={item.product.id}
                        className="bg-white p-3 rounded-2xl border border-slate-200 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={item.product.image}
                            alt={item.product.title}
                            className="w-12 h-12 object-cover rounded-xl bg-slate-100 shrink-0 border border-slate-100"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-blue-800 bg-blue-50 px-1.5 py-0.5 rounded">
                              {item.product.brand}
                            </span>
                            <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5 max-w-[180px] sm:max-w-xs">
                              {item.product.title}
                            </h4>
                            <div className="text-[11px] text-slate-500 mt-0.5">
                              واحد: {unitPrice.toLocaleString('fa-IR')} تومان
                            </div>
                          </div>
                        </div>

                        {/* Quantity controls */}
                        <div className="flex items-center gap-2">
                          <div className="flex items-center bg-slate-100 rounded-lg border border-slate-200 p-0.5">
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity + 1)}
                              className="p-1 text-slate-600 hover:text-blue-700"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <span className="px-2 text-xs font-bold text-slate-800">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => onUpdateQuantity(item.product.id, item.quantity - 1)}
                              className="p-1 text-slate-600 hover:text-red-700"
                            >
                              <Minus className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <button
                            onClick={() => onRemoveItem(item.product.id)}
                            className="p-1 text-slate-400 hover:text-red-600"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Customer Info Form */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
                <div className="font-bold text-slate-800">اطلاعات جهت ثبت رسمی و ارسال پیش‌فاکتور:</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="نام کارفرما / مهندس پروژه"
                    className="p-2 bg-white border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="شماره تماس (جهت ارسال فاکتور)"
                    className="p-2 bg-white border border-slate-200 rounded-lg outline-hidden focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {/* Official Proforma Summary Box */}
              <div className="bg-gradient-to-br from-blue-900 via-[#12284C] to-slate-900 text-white p-5 rounded-2xl space-y-3 shadow-md">
                <div className="flex items-center justify-between pb-2 border-b border-white/10 text-xs">
                  <span className="font-bold text-amber-300">شناسه استعلام: {quoteNumber}</span>
                  <span className="text-slate-300">تاریخ: {todayFa}</span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>جمع ناخالص اقلام:</span>
                    <span>{rawTotal.toLocaleString('fa-IR')} تومان</span>
                  </div>

                  {tierDiscountPercent > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>تخفیف همکاری ({tierDiscountPercent}٪):</span>
                      <span>-{tierDiscountAmount.toLocaleString('fa-IR')} تومان</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-white/10 flex justify-between items-baseline text-sm sm:text-base font-black">
                    <span className="text-amber-200">مبلغ نهایی پیش‌فاکتور:</span>
                    <span className="text-xl text-white">
                      {finalTotal.toLocaleString('fa-IR')} <span className="text-xs font-normal">تومان</span>
                    </span>
                  </div>
                </div>

                <div className="text-[10px] text-slate-300 flex items-center gap-1.5 pt-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>قیمت‌ها بر اساس نرخ رسمی کارخانه و با احتساب خدمات گارانتی معتبر است.</span>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Actions */}
        {cartItems.length > 0 && (
          <div className="p-4 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyQuote}
              className="flex-1 py-2.5 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'جزئیات کپی شد' : 'کپی فاکتور برای پیامک / واتساپ'}</span>
            </button>

            <button
              onClick={() => {
                alert(`پیش‌فاکتور به شماره ${quoteNumber} به صورت رسمی ثبت گردید. کارشناسان بازرگانی TSH جهت نهایی‌سازی هماهنگ خواهند کرد.`);
                onClose();
              }}
              className="flex-1 py-2.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>تایید و ارسال به واحد فروش</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
