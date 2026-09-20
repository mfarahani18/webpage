import React, { useState, useMemo } from 'react';
import { 
  Calculator, 
  Flame, 
  Wind, 
  ChefHat, 
  CheckCircle, 
  PlusCircle, 
  Info, 
  Building, 
  Sun, 
  Layers,
  Sparkles
} from 'lucide-react';
import { Product } from '../types';

interface HVACCalculatorProps {
  onAddRecommendedToCart: (items: Product[]) => void;
  allProducts: Product[];
  onOpenChatWithTopic?: (topic: string) => void;
}

export const HVACCalculator: React.FC<HVACCalculatorProps> = ({
  onAddRecommendedToCart,
  allProducts,
  onOpenChatWithTopic,
}) => {
  const [area, setArea] = useState<number>(110);
  const [floorType, setFloorType] = useState<'middle' | 'top' | 'ground'>('middle');
  const [climate, setClimate] = useState<'hot_dry' | 'moderate' | 'cold' | 'humid'>('hot_dry');
  const [insulation, setInsulation] = useState<'double' | 'single' | 'high_sun'>('double');

  // Computational engineering logic
  const calculation = useMemo(() => {
    // Multipliers based on building exposure and climate
    let floorFactor = 1.0;
    if (floorType === 'top') floorFactor = 1.25; // 25% extra heat loss/gain on top floor
    if (floorType === 'ground') floorFactor = 1.15; // 15% extra heat loss over cold parking

    let climateFactor = 1.0;
    if (climate === 'hot_dry') climateFactor = 1.15; // Hot central climates like Qom require higher cooling BTU
    if (climate === 'cold') climateFactor = 1.2; // Mountainous cold climates need more heating
    if (climate === 'humid') climateFactor = 1.1;

    let insulationFactor = 1.0;
    if (insulation === 'single') insulationFactor = 1.2;
    if (insulation === 'high_sun') insulationFactor = 1.25;

    // Heating calculation (Kcal/h)
    // Rule of thumb: 130 to 160 Kcal/h per sq meter
    const baseHeatPerMeter = 140;
    const requiredHeatKcal = area * baseHeatPerMeter * floorFactor * (climate === 'cold' ? 1.2 : 1.0) * insulationFactor;

    // Boiler capacity determination
    let packageKw = '۲۴,۰۰۰ کیلوکالری';
    let packageModel = 'پکیج بوتان Perla Pro 24 یا ایران رادیاتور L24FF';
    let packageId = 'pkg-01';

    if (requiredHeatKcal > 28000 || area > 190) {
      packageKw = '۳۲,۰۰۰ تا ۳۶,۰۰۰ کیلوکالری';
      packageModel = 'پکیج ۳۲ هزار دو مبدل دیجیتال ویژه متراژهای بزرگ';
      packageId = 'pkg-01';
    } else if (requiredHeatKcal > 20000 || area > 130) {
      packageKw = '۲۸,۰۰۰ کیلوکالری';
      packageModel = 'پکیج ۲۸ هزار پرلا پرو بوتان یا L28FF ایران رادیاتور';
      packageId = 'pkg-01';
    }

    // Radiator calculations
    // Each standard die-cast aluminum blade (e.g. Kal 500) yields ~135-150 Kcal
    const bladeOutput = 140;
    const bladeCount = Math.ceil(requiredHeatKcal / bladeOutput);
    // Panel radiators: ~1800 Kcal per meter (Type 22)
    const panelMeters = (requiredHeatKcal / 1850).toFixed(1);

    // Cooling calculation (BTU/h)
    // Rule of thumb in central Iran: 400 - 550 BTU per sq meter depending on sun & floor
    let btuPerMeter = 450;
    if (climate === 'hot_dry') btuPerMeter = 520;
    if (floorType === 'top') btuPerMeter += 80;
    if (insulation === 'high_sun') btuPerMeter += 60;

    const totalBtu = area * btuPerMeter;
    let coolingRecommendation = 'اسپلیت ۲۴,۰۰۰ BTU اینورتر TSH';
    let btuLabel = '۲۴,۰۰۰ BTU';
    if (totalBtu <= 14000) {
      coolingRecommendation = 'کولر گازی ۱۲,۰۰۰ BTU اینورتر';
      btuLabel = '۱۲,۰۰۰ BTU';
    } else if (totalBtu <= 21000) {
      coolingRecommendation = 'کولر گازی ۱۸,۰۰۰ BTU اینورتر';
      btuLabel = '۱۸,۰۰۰ BTU';
    } else if (totalBtu <= 28000) {
      coolingRecommendation = 'کولر گازی ۲۴,۰۰۰ BTU اینورتر TSH سری الگانس';
      btuLabel = '۲۴,۰۰۰ BTU';
    } else if (totalBtu <= 34000) {
      coolingRecommendation = 'اسپلیت ۳۰,۰۰۰ BTU یا دو دستگاه ۱۲۰۰۰ و ۱۸۰۰۰ مجزا';
      btuLabel = '۳۰,۰۰۰ BTU';
    } else {
      coolingRecommendation = 'داکت اسپلیت ۳۶۰۰۰ هایسنس یا ترکیب دو اسپلیت ۲۴۰۰۰';
      btuLabel = '۳۶,۰۰۰ BTU (یا داکت اسپلیت)';
    }

    // Kitchen hood recommendation
    const hoodMinM3 = Math.max(650, Math.round(area * 6.5));

    return {
      packageKw,
      packageModel,
      packageId,
      bladeCount,
      panelMeters,
      coolingRecommendation,
      btuLabel,
      hoodMinM3,
      requiredHeatKcal: Math.round(requiredHeatKcal),
    };
  }, [area, floorType, climate, insulation]);

  const handleAddAllToCart = () => {
    // Find matching items from allProducts
    const boiler = allProducts.find(p => p.id === calculation.packageId) || allProducts[0];
    const radiator = allProducts.find(p => p.id === 'rad-01') || allProducts[2];
    const ac = allProducts.find(p => p.id === 'ac-01') || allProducts[5];
    const hood = allProducts.find(p => p.id === 'kit-01') || allProducts[7];

    onAddRecommendedToCart([boiler, radiator, ac, hood]);
  };

  return (
    <div id="hvac-calculator-section" className="bg-white rounded-3xl border border-slate-200 shadow-sm p-5 sm:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-blue-50 text-blue-800 text-xs font-bold mb-2">
            <Calculator className="w-3.5 h-3.5 text-blue-600" />
            سیستم مهندسی TSH | منطبق با مبحث ۱۴ و ۱۷ مقررات ملی ساختمان
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-[#12284C]">
            محاسبه‌گر آنلاین ظرفیت پکیج، رادیاتور و سیستم سرمایش
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            مشخصات فضای ساختمانی خود را وارد کنید تا ظرفیت دقیق، مدل‌های سازگار و تخمین تجهیزات به صورت خودکار محاسبه شود.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onOpenChatWithTopic?.('محاسبه ظرفیت برای متراژ ' + area + ' متر')}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5" />
            تحلیل تخصصی با هوش مصنوعی
          </button>
        </div>
      </div>

      {/* Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-6">
        
        {/* Input Parameters Controls */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Area Slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Building className="w-4 h-4 text-blue-600" />
                متراژ زیربنای مفید ساختمان (متر مربع):
              </label>
              <span className="text-lg font-black text-blue-700 bg-blue-50 px-3 py-1 rounded-lg border border-blue-100">
                {area} متر مربع
              </span>
            </div>
            <input
              type="range"
              min="40"
              max="260"
              step="5"
              value={area}
              onChange={(e) => setArea(Number(e.target.value))}
              className="w-full h-2.5 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-700"
            />
            <div className="flex justify-between text-[11px] text-slate-700 font-medium">
              <span>۴۰ متر (سوئیت / اداری)</span>
              <span>۱۱۰ متر (استاندارد آپارتمانی)</span>
              <span>۲۶۰ متر (پنت‌هاوس / دوبلکس)</span>
            </div>
          </div>

          {/* Floor Position */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-600" />
              موقعیت طبقه واحد در ساختمان:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setFloorType('middle')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  floorType === 'middle'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>طبقات میانی</div>
                <div className="text-[10px] text-slate-700 mt-0.5 font-normal">کمترین پرت انرژی</div>
              </button>

              <button
                type="button"
                onClick={() => setFloorType('top')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  floorType === 'top'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>طبقه آخر (زیر بام)</div>
                <div className="text-[10px] text-slate-700 mt-0.5 font-normal">تابش مستقیم آفتاب</div>
              </button>

              <button
                type="button"
                onClick={() => setFloorType('ground')}
                className={`p-2.5 rounded-xl border text-center transition-all ${
                  floorType === 'ground'
                    ? 'border-blue-600 bg-blue-50/80 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>همکف / روی پیلوت</div>
                <div className="text-[10px] text-slate-700 mt-0.5 font-normal">کف در مجاورت هوای سرد</div>
              </button>
            </div>
          </div>

          {/* Climate Region */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
              <Sun className="w-4 h-4 text-blue-600" />
              منطقه جغرافیایی و شرایط اقلیمی:
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setClimate('hot_dry')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  climate === 'hot_dry'
                    ? 'border-amber-500 bg-amber-50 text-amber-900 font-bold'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>گرم و خشک</div>
                <div className="text-[10px] text-slate-700">قم، کاشان، سمنان</div>
              </button>

              <button
                type="button"
                onClick={() => setClimate('moderate')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  climate === 'moderate'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>معتدل</div>
                <div className="text-[10px] text-slate-700">تهران، کرج، اصفهان</div>
              </button>

              <button
                type="button"
                onClick={() => setClimate('cold')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  climate === 'cold'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>کوهستانی سرد</div>
                <div className="text-[10px] text-slate-700">تبریز، همدان، اراک</div>
              </button>

              <button
                type="button"
                onClick={() => setClimate('humid')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  climate === 'humid'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 bg-slate-50/60 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div>مرطوب و شرجی</div>
                <div className="text-[10px] text-slate-700">شمال و نوار ساحلی</div>
              </button>
            </div>
          </div>

          {/* Window & Insulation */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-800">
              نوع پنجره‌ها و وضعیت عایق‌بندی:
            </label>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setInsulation('double')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  insulation === 'double'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                پنجره دوجداره UPVC
              </button>
              <button
                type="button"
                onClick={() => setInsulation('single')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  insulation === 'single'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                تک‌جداره معمولی
              </button>
              <button
                type="button"
                onClick={() => setInsulation('high_sun')}
                className={`p-2 rounded-xl border text-center transition-all ${
                  insulation === 'high_sun'
                    ? 'border-blue-600 bg-blue-50 text-blue-900 font-bold'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                پنجره قدی / پرنور
              </button>
            </div>
          </div>
        </div>

        {/* Engineering Calculation Results Card */}
        <div className="lg:col-span-6 bg-gradient-to-br from-slate-900 via-[#12284C] to-[#1E3A8A] text-white p-6 rounded-2xl flex flex-col justify-between shadow-lg relative overflow-hidden">
          
          <div className="space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-400" />
                نتایج برآورد مهندسی تأسیسات TSH
              </span>
              <span className="text-xs text-slate-300">
                مساحت مبنا: {area} م²
              </span>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              
              {/* Boiler Capacity Card */}
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
                  <Flame className="w-4 h-4 text-orange-400" />
                  ظرفیت پکیج دیواری
                </div>
                <div className="text-base sm:text-lg font-black text-white">
                  {calculation.packageKw}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 leading-tight">
                  دو مبدل فن‌دار (بوتان یا ایران رادیاتور)
                </div>
              </div>

              {/* Cooling Capacity Card */}
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-xs text-sky-300 font-medium mb-1">
                  <Wind className="w-4 h-4 text-sky-400" />
                  سیستم سرمایش پیشنهادی
                </div>
                <div className="text-base sm:text-lg font-black text-white">
                  {calculation.btuLabel}
                </div>
                <div className="text-[11px] text-slate-300 mt-1 leading-tight">
                  {calculation.coolingRecommendation}
                </div>
              </div>

              {/* Radiator Quantity Card */}
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <div className="text-xs text-slate-300 font-medium mb-1">
                  متراژ یا تعداد پره رادیاتور
                </div>
                <div className="text-base sm:text-lg font-black text-white">
                  {calculation.bladeCount} پره آلومینیومی
                </div>
                <div className="text-[11px] text-amber-200 mt-1 leading-tight">
                  یا {calculation.panelMeters} متر رادیاتور پنلی فولادی
                </div>
              </div>

              {/* Kitchen Hood Flow Card */}
              <div className="bg-white/10 backdrop-blur-md p-3.5 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-xs text-slate-300 font-medium mb-1">
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  قدرت مکش هود آشپزخانه
                </div>
                <div className="text-base sm:text-lg font-black text-white">
                  حداقل {calculation.hoodMinM3} m³/h
                </div>
                <div className="text-[11px] text-slate-300 mt-1 leading-tight">
                  هود مخفی تاچ سنسوردار کن یا اخوان
                </div>
              </div>
            </div>

            {/* Engineering Note */}
            <div className="flex items-start gap-2 p-3 rounded-xl bg-blue-950/60 border border-blue-400/20 text-xs text-slate-300">
              <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <span>
                <strong>توصیه ویژه اقلیم مرکزی و آب سخت قم:</strong> جهت افزایش طول عمر پکیج و جلوگیری از گرفتگی مبدل ثانویه، نصب فیلتر مغناطیسی و سختی‌گیر پلی‌فسفات الزامی است.
              </span>
            </div>
          </div>

          {/* Action Button */}
          <div className="pt-5 mt-4 border-t border-white/10 flex flex-col sm:flex-row gap-3">
            <button
              id="calculator-add-pack-btn"
              onClick={handleAddAllToCart}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-sm shadow-md transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              افزودن این تجهیزات به پیش‌فاکتور رسمی
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
