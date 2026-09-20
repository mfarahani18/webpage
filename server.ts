import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { PRODUCTS, BUNDLE_PACKS, STRATEGY_MODULES, CATEGORIES } from './src/data/mockData';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

let aiClient: GoogleGenAI | null = null;
function getAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

// 1. Health Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    service: 'TSH Modern Comfort Solutions API (مطبوع شهر)',
    version: '1.2.0',
    availableProductsCount: PRODUCTS.length,
    bundlesCount: BUNDLE_PACKS.length
  });
});

// 2. Categories API
app.get('/api/categories', (req, res) => {
  res.json({
    success: true,
    categories: CATEGORIES
  });
});

// 3. Products List API with search, category filter, brand filter, and sorting
app.get('/api/products', (req, res) => {
  const { category, q, search, brand, minPrice, maxPrice, sort, b2bOnly } = req.query;
  let result = [...PRODUCTS];

  // Category filter
  if (category && category !== 'all') {
    result = result.filter(p => p.category === category);
  }

  // Text search in title, model, description, brand
  const searchQuery = (q || search) as string;
  if (searchQuery && typeof searchQuery === 'string') {
    const term = searchQuery.trim().toLowerCase();
    result = result.filter(p => 
      p.title.toLowerCase().includes(term) ||
      p.brand.toLowerCase().includes(term) ||
      p.model.toLowerCase().includes(term) ||
      p.description.toLowerCase().includes(term)
    );
  }

  // Brand filter
  if (brand && typeof brand === 'string') {
    result = result.filter(p => p.brand.toLowerCase() === brand.toLowerCase());
  }

  // Price range filters
  if (minPrice && !isNaN(Number(minPrice))) {
    result = result.filter(p => (p.discountPrice || p.price) >= Number(minPrice));
  }
  if (maxPrice && !isNaN(Number(maxPrice))) {
    result = result.filter(p => (p.discountPrice || p.price) <= Number(maxPrice));
  }

  // B2B recommended filter
  if (b2bOnly === 'true') {
    result = result.filter(p => p.isB2BRecommended);
  }

  // Sorting
  if (sort === 'price_asc') {
    result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
  } else if (sort === 'price_desc') {
    result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
  } else if (sort === 'rating') {
    result.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'popular') {
    result.sort((a, b) => b.reviewsCount - a.reviewsCount);
  }

  res.json({
    success: true,
    total: result.length,
    products: result
  });
});

// 4. Product Details API with recommended companion items
app.get('/api/products/:id', (req, res) => {
  const { id } = req.params;
  const product = PRODUCTS.find(p => p.id === id);

  if (!product) {
    return res.status(404).json({ success: false, message: 'محصول مورد نظر یافت نشد' });
  }

  // Get related products from same category
  const related = PRODUCTS
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 3);

  res.json({
    success: true,
    product,
    relatedProducts: related
  });
});

// 5. Bundles API
app.get('/api/bundles', (req, res) => {
  res.json({
    success: true,
    bundles: BUNDLE_PACKS
  });
});

// 6. Strategy & Brand Framework API
app.get('/api/strategy', (req, res) => {
  res.json({
    success: true,
    modules: STRATEGY_MODULES,
    brandInfo: {
      brandNameFa: 'مطبوع شهر (TSH)',
      brandNameEn: 'TSH Modern Comfort Solutions',
      tagline: 'راهکارهای نوین سرمایش و گرمایش - همراه مطمئن بنا تا آسایش خانه',
      primaryColors: {
        navy: '#12284C',
        sky: '#0EA5E9',
        flame: '#EA580C'
      },
      headquarters: 'قم - شهرک صنوف / بلوار امین',
      standardsCompliance: ['مبحث ۱۴ مقررات ملی ساختمان', 'مبحث ۱۷ لوله‌کشی گاز', 'استاندارد ملی ISIRI']
    }
  });
});

// 7. HVAC Engineering Capacity Calculation Endpoint (Mabhas 14 & 17)
app.post('/api/calculate-hvac', (req, res) => {
  try {
    const { 
      area = 100, 
      floor = 'middle', 
      climate = 'hot_dry', 
      insulation = 'double',
      city = 'قم'
    } = req.body;

    const numArea = Math.max(20, Math.min(1000, Number(area) || 100));

    // Multipliers based on building exposure and climate
    let floorFactor = 1.0;
    if (floor === 'top') floorFactor = 1.25; // 25% heat loss/gain on top roof floor
    if (floor === 'ground') floorFactor = 1.15; // 15% loss over unheated basement/parking

    let climateFactor = 1.0;
    if (climate === 'hot_dry') climateFactor = 1.15; // High cooling load in central dry climates
    if (climate === 'cold') climateFactor = 1.2; // High heating load in cold climates
    if (climate === 'humid') climateFactor = 1.1;

    let insulationFactor = 1.0;
    if (insulation === 'single') insulationFactor = 1.2;
    if (insulation === 'high_sun') insulationFactor = 1.25;

    // Heating calculation (Kcal/hr)
    const baseHeatPerMeter = 140;
    const requiredHeatKcal = Math.round(numArea * baseHeatPerMeter * floorFactor * (climate === 'cold' ? 1.2 : 1.0) * insulationFactor);

    // Boiler capacity determination
    let packageCapacity = '۲۴,۰۰۰ کیلوکالری (۲۴ kW)';
    let packageModel = 'پکیج شوفاژ دیواری بوتان Perla Pro 24RSI یا ایران رادیاتور L24FF';
    let packageId = 'pkg-01';

    if (requiredHeatKcal > 28000 || numArea > 180) {
      packageCapacity = '۳۲,۰۰۰ تا ۳۶,۰۰۰ کیلوکالری';
      packageModel = 'پکیج ۳۲ یا ۳۶ هزار دو مبدل دیجیتال با ظرفیت بالای آبگرم مصرفی';
      packageId = 'pkg-01';
    } else if (requiredHeatKcal > 20000 || numArea > 130) {
      packageCapacity = '۲۸,۰۰۰ کیلوکالری';
      packageModel = 'پکیج ۲۸ هزار دو مبدل فن‌دار دیجیتال بوتان یا ایران رادیاتور L28FF';
      packageId = 'pkg-02';
    }

    // Radiators estimation
    const heatPerBladeKal500 = 152; // Kcal per blade of Kal 500
    const bladeCount = Math.ceil((requiredHeatKcal * 0.85) / heatPerBladeKal500);
    const panelMeters = +(numArea * 0.085 * floorFactor).toFixed(1);

    // Cooling calculation (BTU/hr)
    const btuPerMeter = (climate === 'hot_dry' ? 450 : 380) * floorFactor * insulationFactor;
    const coolingBtu = Math.round(numArea * btuPerMeter);

    let coolingRecommendation = '';
    let coolingSystem = '';
    if (coolingBtu <= 14000) {
      coolingSystem = 'اسپلیت ۱۲,۰۰۰ BTU دیواری اینورتر';
      coolingRecommendation = 'یک دستگاه اسپلیت ۱۲ هزار اینورتر TSH با کمپرسور روتاری T3';
    } else if (coolingBtu <= 20000) {
      coolingSystem = 'اسپلیت ۱۸,۰۰۰ BTU دیواری اینورتر';
      coolingRecommendation = 'یک دستگاه اسپلیت ۱۸ هزار اینورتر فوق کم‌مصرف TSH';
    } else if (coolingBtu <= 26000) {
      coolingSystem = 'اسپلیت ۲۴,۰۰۰ BTU دیواری اینورتر';
      coolingRecommendation = 'یک دستگاه اسپلیت پرچمدار ۲۴ هزار اینورتر TSH یا ترکیب با کولر سلولزی';
    } else if (coolingBtu <= 38000) {
      coolingSystem = 'داکت اسپلیت ۳۶,۰۰۰ BTU (۳ تن) یا دو دستگاه اسپلیت';
      coolingRecommendation = 'داکت اسپلیت ۳۶۰۰۰ هایسنس توکار با کویل آبگرم یا دو اسپلیت ۱۸ هزار تفکیک‌شده';
    } else {
      coolingSystem = 'سیستم داکت اسپلیت مرکزی یا چیلر مستقل';
      coolingRecommendation = 'داکت اسپلیت ۴۸۰۰۰ تا ۶۰۰۰۰ یا سیستم‌های چند تکه Multi V';
    }

    // Water hardness analysis (e.g. Qom TDS exceeds 1200 ppm)
    const isHardWaterCity = ['قم', 'کاشان', 'یزد', 'سمنان', 'اراک'].some(c => (city || '').includes(c));
    const waterHardnessAdvice = isHardWaterCity
      ? 'به دلیل سختی بالای آب منطقه (TDS بالای ۱۰۰۰)، نصب فیلتر پلی‌فسفات ضد رسوب و فیلتر مغناطیسی مدار گرمایش الزامی بوده و استفاده از دستگاه تصفیه آب ۶ مرحله‌ای RO توصیه اکید می‌شود.'
      : 'کیفیت آب در محدوده استاندارد است؛ فیلتر رسوب‌گیر مغناطیسی پکیج برای تضمین گارانتی قطعات کافی است.';

    res.json({
      success: true,
      input: { area: numArea, floor, climate, insulation, city },
      calculation: {
        requiredHeatKcal,
        packageCapacity,
        packageModel,
        packageId,
        recommendedRadiatorBlades: bladeCount,
        recommendedPanelMeters: panelMeters,
        coolingBtu,
        coolingSystem,
        coolingRecommendation,
        waterHardnessAdvice,
        isHardWaterCity
      }
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// 8. B2B Project Inquiry Endpoint
const b2bInquiries: any[] = [];
app.post('/api/b2b-inquiry', (req, res) => {
  const { builderName, phone, projectName, unitsCount, city, requiredSystems, notes } = req.body;

  if (!builderName || !phone) {
    return res.status(400).json({ success: false, error: 'نام سازنده و شماره تماس الزامی است' });
  }

  const inquiryId = 'TSH-PRJ-' + Math.floor(100000 + Math.random() * 900000);
  const units = parseInt(unitsCount) || 1;
  
  // Calculate discount tier
  let discountPercent = 8;
  if (units >= 10) discountPercent = 16;
  else if (units >= 5) discountPercent = 12;

  const inquiryRecord = {
    inquiryId,
    builderName,
    phone,
    projectName: projectName || 'پروژه ساختمانی',
    unitsCount: units,
    city: city || 'قم',
    requiredSystems: requiredSystems || [],
    notes: notes || '',
    discountTier: `${discountPercent}٪ تخفیف همکاری انبوه‌سازی`,
    status: 'بررسی واحد مهندسی فروش',
    submittedAt: new Date().toISOString()
  };

  b2bInquiries.push(inquiryRecord);

  res.json({
    success: true,
    inquiryId,
    message: 'استعلام پروژه شما با موفقیت در سامانه مهندسی فروش بازرگانی مطبوع شهر ثبت گردید.',
    discountPercent,
    assignedDepartment: 'واحد پروژه‌ها و انبوه‌سازان TSH',
    contactFollowUp: 'تماس کارشناس فنی ظرف حداکثر ۲ ساعت کاری'
  });
});

// 9. Gemini AI Chat Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const ai = getAI();
    const lastUserMessage = messages[messages.length - 1]?.content || '';

    // If Gemini API Key is available, call Gemini 3.8 Flash
    if (ai) {
      const systemInstruction = `شما «دستیار هوشمند و کارشناس ارشد مهندسی فروش و تأسیسات شرکت بازرگانی TSH (مطبوع شهر / قم تجهیز)» هستید.
حوزه فعالیت شما:
۱. تجهیزات گرمایش: پکیج دیواری و زمینی (ایران رادیاتور، بوتان، لورچ)، انواع رادیاتور آلومینیومی پره‌ای (کال ۵۰۰)، رادیاتورهای پنلی فولادی و حوله خشک‌کن لوکس استیل.
۲. سرمایش و تهویه مطبوع: کولر گازی اینورتر، داکت اسپلیت، کولر آبی سلولزی، چیلر و فن‌کویل.
۳. تجهیزات آشپزخانه: هود مخفی و لمسی (کن، اخوان)، گاز صفحه‌ای توکار، سینک ظرفشویی گرانیتی و استیل البرز، شیرآلات بهداشتی شودر و راسان.
۴. آب و تصفیه: دستگاه‌های تصفیه آب ۶ مرحله‌ای خانگی اسمز معکوس و فیلترهای ضد رسوب پلی‌فسفات و مغناطیسی.

اصول پاسخگویی:
- لحنی حرفه‌ای، محترمانه، فنی و دقیق با استانداردهای مبحث ۱۴ و ۱۷ مقررات ملی ساختمان ایران داشته باشید.
- در انتخاب ظرفیت پکیج و کولر گازی، متراژ، ارتفاع سقف، نوع پنجره‌ها و شرایط اقلیمی (به‌ویژه هوای گرم و خشک و سختی آب شهرهای مرکزی نظیر قم) را لحاظ کنید.
- برای افزایش بهره‌وری، باندل‌های اقتصادی و مکمل (مثلاً پکیج + رادیاتور + فیلتر مغناطیسی محافظ) را پیشنهاد دهید.
- کوتاه، شمرده، سازمان‌یافته با بولت‌پوینت‌های خوانا و به زبان فارسی سلیس پاسخ دهید.`;

      const contents = messages.map((m: { role: string; content: string }) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        }
      });

      const responseText = response.text || 'در حال حاضر پاسخی دریافت نشد، لطفاً دوباره تلاش کنید.';
      return res.json({ reply: responseText });
    }

    // Intelligent Fallback when API key is not yet set or in offline mode
    const lower = lastUserMessage.toLowerCase();
    let reply = '';

    if (lower.includes('پکیج') || lower.includes('گرمایش') || lower.includes('بوتان') || lower.includes('ایران رادیاتور')) {
      reply = `در خصوص انتخاب پکیج گرمایشی، بر اساس استانداردهای مهندسی تاسیسات ساختمانی ایران:
• برای متراژ تا ۱۲۰ متر: پکیج ۲۴ هزار دو مبدل فن‌دار (نظیر بوتان Perla Pro 24 یا ایران رادیاتور L24FF) ایده‌آل است.
• برای متراژ ۱۲۰ تا ۱۸۰ متر: پکیج ۲۸ هزار دو مبدل توصیه می‌گردد تا در تامین همزمان آبگرم مصرفی حمام و گرمایش رادیاتورها افت فشار نداشته باشید.
• برای متراژ بالای ۱۸۰ متر: پکیج‌های ۳۲ یا ۳۶ هزار کیلوکالری.

پیشنهاد مهندسی TSH: حتماً از فیلتر مغناطیسی مدار گرمایش و رسوب‌گیر پلی‌فسفات استفاده کنید تا پکیج شما در برابر املاح و رسوبات آب مقاوم شود. آیا مایلید باندل کامل پکیج + رادیاتور را با تخفیف سازندگان مشاهده فرمایید؟`;
    } else if (lower.includes('کولر') || lower.includes('اسپلیت') || lower.includes('سرمایش') || lower.includes('داکت')) {
      reply = `برای محاسبه ظرفیت برودتی کولر گازی و داکت اسپلیت در اقلیم‌های گرم و معتدل:
• تا ۴۰ متر مربع: اسپلیت ۱۲۰۰۰ BTU
• ۴۰ تا ۶۵ متر مربع: اسپلیت ۱۸۰۰۰ BTU
• ۶۵ تا ۹۰ متر مربع: اسپلیت ۲۴۰۰۰ BTU اینورتر TSH
• ۹۰ تا ۱۳۰ متر مربع: اسپلیت ۳۰۰۰۰ BTU یا داکت اسپلیت ۳۶۰۰۰ هایسنس

مزیت ویژه سیستم‌های اینورتر TSH صرفه‌جویی تا ۶۰٪ در مصرف برق و کمپرسور تقویت‌شده T3 متناسب با گرمای بالای تابستان است.`;
    } else if (lower.includes('رادیاتور') || lower.includes('پره') || lower.includes('پنلی')) {
      reply = `در انتخاب رادیاتور بین مدل‌های «پره‌ای آلومینیومی» و «پنلی فولادی»:
۱. رادیاتور پره‌ای آلومینیومی (مدل کال ۵۰۰ ایران رادیاتور): ضریب انتقال حرارت بالاتر، امکان افزایش یا کاهش پره‌ها، سبک و ضد زنگ.
۲. رادیاتور پنلی فولادی (مدل پرسیانو لورچ): عدم ناسازگاری مس و آلومینیوم با پکیج (عدم تولید گاز هیدروژن و رفع نیاز به هواگیری مداوم)، با ۱۲ سال ضمانت تعویض کتبی.

قاعده سرانگشتی محاسبه: به ازای هر متر مربع فضای مسکونی در طبقات میانی، حدود ۰.۶ پره آلومینیومی یا ۸ تا ۹ سانتی‌متر رادیاتور پنلی نیاز است.`;
    } else if (lower.includes('آشپزخانه') || lower.includes('هود') || lower.includes('گاز') || lower.includes('سینک')) {
      reply = `در سبد تجهیزات مدرن آشپزخانه بازرگانی TSH، محبوب‌ترین ست شامل موارد زیر است:
۱. هود مخفی توکار لمسی کن آرتیما ۲ با سنسور هوشمند اشاره دست و مکش ۷۰۰ متر مکعب
۲. گاز صفحه‌ای شیشه‌ای ۵ شعله نشکن اخوان Gi-135 با سرشعله‌های راندمان بالا طرح ساباف
۳. سینک گرانیتی آنتی‌باکتریال دو لگنه استیل البرز با مقاومت حرارتی تا ۲۸۰ درجه
۴. شیر ظرفشویی شاوری استیل فنری TSH Pro Chef

خرید به صورت «پک جهیزیه و نوسازی آشپزخانه» شامل ۱۴٪ تخفیف کل و هدیه سبد آبکشی و تخته گوشت فابریک می‌باشد.`;
    } else {
      reply = `درود بر شما! من دستیار هوشمند و کارشناس ارشد مهندسی تاسیسات و تجهیزات ساختمانی TSH (مطبوع شهر) هستم.

می‌توانم در موارد زیر راهنمایی‌تان کنم:
• محاسبه دقیق بار حرارتی و برودتی متناسب با متراژ و اقلیم واحد شما
• مقایسه تخصصی برندهای پکیج (بوتان، ایران رادیاتور، لورچ) و کولرهای گازی
• معرفی باندل‌های ویژه انبوه‌سازان (B2B) با فاکتور رسمی و تخفیف همکاری
• مشاوره ست کامل تجهیزات آشپزخانه (هود، گاز، سینک، شیرآلات لوکس)

متراژ حدودی واحد، شهر محل پروژه و تجهیزات مد نظرتان را بفرمایید تا دقیق‌ترین پیشنهاد را تقدیم کنم.`;
    }

    return res.json({ reply });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({ 
      error: 'خطا در ارتباط با مشاور هوشمند',
      details: error.message 
    });
  }
});

// 10. Quote Generation Endpoint
app.post('/api/quote', (req, res) => {
  const { customerName, phone, projectType, items, city, discountTier } = req.body;
  const quoteNumber = 'TSH-' + Math.floor(100000 + Math.random() * 900000);
  const date = new Date().toLocaleDateString('fa-IR');
  
  res.json({
    success: true,
    quoteNumber,
    date,
    customerName: customerName || 'مشتری گرامی',
    phone,
    projectType,
    city: city || 'قم',
    discountTier: discountTier || 'همکاری سازندگان',
    items: items || [],
    validDays: 7,
    notes: 'قیمت‌ها بر اساس نرخ روز بازرگانی TSH محاسبه شده و تا ۷ روز معتبر می‌باشد.'
  });
});

async function startServer() {
  // Setup Vite middleware in dev or static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`TSH server is running at http://localhost:${PORT}`);
  });
}

startServer();
