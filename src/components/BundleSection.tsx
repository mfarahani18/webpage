import React from 'react';
import { 
  Package, 
  Check, 
  Sparkles, 
  PlusCircle, 
  Layers, 
  Building2, 
  Home, 
  Palmtree, 
  FileCheck 
} from 'lucide-react';
import { BUNDLE_PACKS } from '../data/mockData';
import { BundlePack, CartItem, Product } from '../types';

interface BundleSectionProps {
  onAddBundleToCart: (bundle: BundlePack) => void;
  onOpenB2BTab: () => void;
}

export const BundleSection: React.FC<BundleSectionProps> = ({
  onAddBundleToCart,
  onOpenB2BTab,
}) => {
  return (
    <section id="bundles-section" className="py-8 space-y-6">
      
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-100 text-amber-900 text-xs font-bold mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            استراتژی باندلینگ تخصصی بازرگانی TSH
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#12284C]">
            پک‌های تخفیف‌دار و ترکیبی تأسیسات و آشپزخانه
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            باندل‌های مهندسی‌شده با بالاترین میزان سازگاری فنی قطعات، جلوگیری از خرید لوازم ناسازگار، کاهش هزینه‌های نصب و بهره‌مندی از حداکثر تخفیف شرکتی.
          </p>
        </div>

        <button
          onClick={onOpenB2BTab}
          className="self-start md:self-auto flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-bold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors border border-blue-200"
        >
          <Building2 className="w-4 h-4" />
          استعلام باندل اختصاصی انبوه‌سازان
        </button>
      </div>

      {/* Bundles Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {BUNDLE_PACKS.map((bundle) => {
          const formattedOriginal = (bundle.originalPrice).toLocaleString('fa-IR');
          const formattedBundle = (bundle.bundlePrice).toLocaleString('fa-IR');
          const saving = (bundle.originalPrice - bundle.bundlePrice).toLocaleString('fa-IR');

          return (
            <div
              key={bundle.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              {/* Image & Badge */}
              <div className="relative h-48 overflow-hidden bg-slate-100">
                <img
                  src={bundle.image}
                  alt={bundle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                
                {/* Popular Tag */}
                {bundle.popularTag && (
                  <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md shadow-md">
                    {bundle.popularTag}
                  </div>
                )}

                {/* Target Audience Pill */}
                <div className="absolute bottom-3 right-3 left-3 flex items-center justify-between text-xs text-white">
                  <span className="font-semibold bg-slate-900/80 backdrop-blur-xs px-2.5 py-1 rounded-md">
                    {bundle.targetAudience}
                  </span>
                  <span className="bg-red-500 text-white font-extrabold px-2 py-0.5 rounded-md text-[11px]">
                    {bundle.discountPercent}٪ تخفیف
                  </span>
                </div>
              </div>

              {/* Content Details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="text-base sm:text-lg font-black text-[#12284C] leading-snug">
                    {bundle.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {bundle.subtitle}
                  </p>

                  {/* Included Items List */}
                  <div className="mt-4 space-y-2">
                    <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-blue-600" />
                      اقلام موجود در این پکیج:
                    </div>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {bundle.productsIncluded.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 bg-slate-50 p-2 rounded-lg border border-slate-100">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="leading-tight">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Key Features */}
                  <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-[11px] text-slate-500">
                    {bundle.features.slice(0, 2).map((feat, i) => (
                      <div key={i} className="flex items-center gap-1.5">
                        <FileCheck className="w-3 h-3 text-blue-500 shrink-0" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price and Add CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="text-xs text-slate-700">قیمت خرید تکی:</span>
                    <span className="text-xs text-slate-600 line-through">
                      {formattedOriginal} تومان
                    </span>
                  </div>

                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-xs font-bold text-emerald-700">سود شما از خرید باندل:</span>
                    <span className="text-xs font-bold text-emerald-600">
                      {saving} تومان
                    </span>
                  </div>

                  <div className="flex items-center justify-between py-2 bg-blue-50/70 px-3 rounded-xl border border-blue-100 mb-3">
                    <span className="text-xs font-bold text-[#12284C]">قیمت نهایی پک:</span>
                    <div className="text-left">
                      <span className="text-lg font-black text-blue-700">{formattedBundle}</span>
                      <span className="text-xs text-slate-600 mr-1">تومان</span>
                    </div>
                  </div>

                  <button
                    id={`add-bundle-${bundle.id}`}
                    onClick={() => onAddBundleToCart(bundle)}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#12284C] hover:bg-[#1E3A8A] text-white text-xs sm:text-sm font-bold shadow-xs hover:shadow transition-all"
                  >
                    <PlusCircle className="w-4 h-4 text-amber-400" />
                    افزودن این باندل به پیش‌فاکتور
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
