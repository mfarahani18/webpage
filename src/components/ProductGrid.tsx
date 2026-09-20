import React, { useState, useMemo } from 'react';
import { 
  Check, 
  ShoppingCart, 
  Star, 
  ShieldCheck, 
  Eye, 
  Sparkles, 
  Filter, 
  Flame, 
  Wind, 
  ChefHat, 
  Bath, 
  Droplets, 
  LayoutGrid,
  Building
} from 'lucide-react';
import { CATEGORIES } from '../data/mockData';
import { Product, CategoryType } from '../types';

interface ProductGridProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onSelectProduct: (product: Product) => void;
  searchQuery: string;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onAddToCart,
  onSelectProduct,
  searchQuery,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedBrand, setSelectedBrand] = useState<string>('all');
  const [onlyInStock, setOnlyInStock] = useState<boolean>(false);
  const [onlyB2B, setOnlyB2B] = useState<boolean>(false);

  // Extract unique brands
  const brands = useMemo(() => {
    const list = Array.from(new Set(products.map(p => p.brand)));
    return ['all', ...list];
  }, [products]);

  // Filter products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search Query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchBrand = p.brand.toLowerCase().includes(query);
        const matchModel = p.model.toLowerCase().includes(query);
        const matchDesc = p.description.toLowerCase().includes(query);
        if (!matchTitle && !matchBrand && !matchModel && !matchDesc) return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      // Brand filter
      if (selectedBrand !== 'all' && p.brand !== selectedBrand) {
        return false;
      }

      // Stock
      if (onlyInStock && !p.inStock) {
        return false;
      }

      // B2B filter
      if (onlyB2B && !p.isB2BRecommended) {
        return false;
      }

      return true;
    });
  }, [products, searchQuery, selectedCategory, selectedBrand, onlyInStock, onlyB2B]);

  const getCategoryIcon = (id: string) => {
    switch (id) {
      case 'heating': return <Flame className="w-4 h-4 text-orange-500" />;
      case 'cooling': return <Wind className="w-4 h-4 text-sky-500" />;
      case 'kitchen': return <ChefHat className="w-4 h-4 text-amber-500" />;
      case 'sanitary': return <Bath className="w-4 h-4 text-emerald-500" />;
      case 'water_air': return <Droplets className="w-4 h-4 text-blue-500" />;
      default: return <LayoutGrid className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <section id="catalog-section" className="py-8 space-y-6">
      
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#12284C]">
            کاتالوگ جامع تجهیزات و قطعات
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            سبد متنوع پکیج، رادیاتور، سیستم‌های سرمایشی، هود، سینک و شیرآلات با استعلام قیمت روز و فاکتور رسمی.
          </p>
        </div>

        <div className="text-xs text-slate-700 font-medium bg-slate-100 px-3 py-1.5 rounded-lg self-start sm:self-auto">
          نمایش <span className="font-bold text-blue-700">{filteredProducts.length}</span> قلم کالا
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as CategoryType)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-[#12284C] text-white shadow-xs'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              {getCategoryIcon(cat.id)}
              <span>{cat.title}</span>
            </button>
          );
        })}
      </div>

      {/* Brand & Filter Chips */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
        
        {/* Brands selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-700 font-semibold flex items-center gap-1 ml-1">
            <Filter className="w-3.5 h-3.5" />
            برند:
          </span>
          {brands.map((b) => (
            <button
              key={b}
              onClick={() => setSelectedBrand(b)}
              className={`px-2.5 py-1 rounded-lg transition-colors ${
                selectedBrand === b
                  ? 'bg-blue-600 text-white font-bold'
                  : 'bg-white text-slate-700 hover:bg-slate-200/70 border border-slate-200'
              }`}
            >
              {b === 'all' ? 'همه برندها' : b}
            </button>
          ))}
        </div>

        {/* Checkbox filters */}
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={onlyInStock}
              onChange={(e) => setOnlyInStock(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span>فقط کالاهای موجود</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 select-none">
            <input
              type="checkbox"
              checked={onlyB2B}
              onChange={(e) => setOnlyB2B(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
            />
            <span className="flex items-center gap-1 text-blue-800 font-medium">
              <Building className="w-3 h-3" />
              ویژه پروژه‌ها (B2B)
            </span>
          </label>
        </div>
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500">
          <p className="text-base font-bold">هیچ محصولی با فیلترهای انتخابی یافت نشد.</p>
          <p className="text-xs mt-1">لطفاً فیلترها را تغییر داده یا عبارت جستجو را پاک نمایید.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((product) => {
            const formattedPrice = product.price.toLocaleString('fa-IR');
            const formattedDiscount = product.discountPrice ? product.discountPrice.toLocaleString('fa-IR') : null;
            const discountPercent = product.discountPrice 
              ? Math.round(((product.price - product.discountPrice) / product.price) * 100) 
              : 0;

            return (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group overflow-hidden"
              >
                {/* Image & Badges */}
                <div className="relative h-52 bg-slate-100 overflow-hidden cursor-pointer" onClick={() => onSelectProduct(product)}>
                  <img
                    src={product.image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Brand & Badge Pills */}
                  <div className="absolute top-2.5 right-2.5 flex flex-col gap-1.5 items-start">
                    <span className="bg-[#12284C] text-white text-[11px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                      {product.brand}
                    </span>
                    {product.badge && (
                      <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {discountPercent > 0 && (
                    <span className="absolute top-2.5 left-2.5 bg-red-600 text-white text-[11px] font-extrabold px-1.5 py-0.5 rounded-md">
                      {discountPercent}٪ تخفیف
                    </span>
                  )}

                  {/* Quick View Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(product);
                    }}
                    className="absolute bottom-2.5 left-2.5 bg-white/90 backdrop-blur-xs text-slate-800 p-2 rounded-xl text-xs font-semibold shadow-xs hover:bg-white transition-all flex items-center gap-1 opacity-90 group-hover:opacity-100"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span className="text-[11px]">بررسی فنی</span>
                  </button>
                </div>

                {/* Body Details */}
                <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* Category and Rating */}
                    <div className="flex items-center justify-between text-[11px] text-slate-700 mb-1">
                      <span>{product.categoryName}</span>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3 h-3 fill-amber-400" />
                        <span>{product.rating}</span>
                        <span className="text-slate-600 font-normal">({product.reviewsCount})</span>
                      </div>
                    </div>

                    {/* Title */}
                    <h3 
                      onClick={() => onSelectProduct(product)}
                      className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-2 hover:text-blue-700 cursor-pointer leading-snug"
                    >
                      {product.title}
                    </h3>

                    {/* Specs snippets */}
                    <div className="mt-2.5 pt-2 border-t border-slate-100 grid grid-cols-2 gap-1.5 text-[10px] text-slate-700">
                      {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
                        <div key={key} className="bg-slate-50 p-1 rounded-md overflow-hidden">
                          <span className="text-slate-700 font-medium block">{key}:</span>
                          <span className="font-bold text-slate-800 truncate block">{val}</span>
                        </div>
                      ))}
                    </div>

                    {/* Warranty */}
                    <div className="flex items-center gap-1 text-[11px] text-emerald-800 mt-2">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{product.warranty}</span>
                    </div>
                  </div>

                  {/* Pricing and CTA */}
                  <div className="pt-3 border-t border-slate-100">
                    <div className="flex items-end justify-between mb-2">
                      <div className="text-right">
                        {formattedDiscount ? (
                          <>
                            <div className="text-[11px] text-slate-600 line-through">
                              {formattedPrice} تومان
                            </div>
                            <div className="text-base font-black text-blue-700">
                              {formattedDiscount} <span className="text-xs text-slate-600">تومان</span>
                            </div>
                          </>
                        ) : (
                          <div className="text-base font-black text-slate-900">
                            {formattedPrice} <span className="text-xs text-slate-600">تومان</span>
                          </div>
                        )}
                      </div>

                      <button
                        id={`add-cart-${product.id}`}
                        onClick={() => onAddToCart(product)}
                        className="p-2.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-600 hover:text-white transition-all shadow-xs"
                        title="افزودن به پیش‌فاکتور"
                      >
                        <ShoppingCart className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => onAddToCart(product)}
                      className="w-full py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5 text-slate-600" />
                      افزودن به استعلام قیمت
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};
