import React from 'react';
import { 
  X, 
  ShieldCheck, 
  Star, 
  ShoppingCart, 
  Check, 
  Building, 
  FileText, 
  PhoneCall, 
  Share2,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
  onAskAI: (productTitle: string) => void;
}

export const ProductModal: React.FC<ProductModalProps> = ({
  product,
  onClose,
  onAddToCart,
  onAskAI,
}) => {
  if (!product) return null;

  const formattedPrice = product.price.toLocaleString('fa-IR');
  const formattedDiscount = product.discountPrice ? product.discountPrice.toLocaleString('fa-IR') : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        className="relative bg-white rounded-3xl max-w-3xl w-full overflow-hidden shadow-2xl border border-slate-200 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 z-10 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
          aria-label="بستن پنجره"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Product Image Column */}
          <div className="md:col-span-5 bg-slate-50 p-6 flex flex-col justify-between border-b md:border-b-0 md:border-l border-slate-200">
            <div className="relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-inner h-64 md:h-72">
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-3 right-3 bg-[#12284C] text-white text-xs font-bold px-2.5 py-1 rounded-md">
                {product.brand}
              </div>
            </div>

            <div className="pt-4 space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100 font-medium">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{product.warranty}</span>
              </div>

              <button
                onClick={() => onAskAI(`مشخصات فنی، شرایط گارانتی و نکات نصب ${product.title} چیست؟`)}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-800 text-xs font-bold transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                پرسش از هوش مصنوعی درباره این کالا
              </button>
            </div>
          </div>

          {/* Details Column */}
          <div className="md:col-span-7 p-6 space-y-4">
            
            {/* Category and Code */}
            <div className="flex items-center justify-between text-xs text-slate-500">
              <span>دسته‌بندی: {product.categoryName}</span>
              <span>کد مدل: {product.model}</span>
            </div>

            {/* Title */}
            <h3 className="text-lg sm:text-xl font-black text-[#12284C] leading-snug">
              {product.title}
            </h3>

            {/* Description */}
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              {product.description}
            </p>

            {/* Full Specifications Table */}
            <div>
              <h4 className="text-xs font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                مشخصات فنی و استانداردها:
              </h4>
              <div className="grid grid-cols-1 gap-1.5 text-xs max-h-48 overflow-y-auto pr-1">
                {Object.entries(product.specs).map(([key, value]) => (
                  <div key={key} className="flex justify-between py-1.5 px-3 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="text-slate-500">{key}:</span>
                    <span className="font-bold text-slate-800">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Price & Action */}
            <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                {formattedDiscount ? (
                  <div>
                    <div className="text-xs text-slate-600 line-through">
                      {formattedPrice} تومان
                    </div>
                    <div className="text-xl font-black text-blue-700">
                      {formattedDiscount} <span className="text-xs text-slate-600">تومان</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-xl font-black text-slate-900">
                    {formattedPrice} <span className="text-xs text-slate-600">تومان</span>
                  </div>
                )}
                <div className="text-[11px] text-slate-700">قیمت قطعی روز با ضمانت اصالت شرکتی</div>
              </div>

              <button
                onClick={() => {
                  onAddToCart(product);
                  onClose();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#12284C] hover:bg-[#1E3A8A] text-white font-bold text-sm shadow-md transition-all"
              >
                <ShoppingCart className="w-4 h-4 text-amber-400" />
                افزودن به پیش‌فاکتور
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
