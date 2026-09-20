export type CategoryType = 
  | 'all'
  | 'heating' // پکیج و رادیاتور
  | 'cooling' // کولر گازی، داکت اسپلیت، کولر آبی
  | 'kitchen' // هود، گاز، سینک، فر
  | 'sanitary' // شیرآلات، حوله خشک‌کن
  | 'water_air'; // تصفیه آب و هوا، پمپ خانگی

export interface Product {
  id: string;
  title: string;
  category: CategoryType;
  categoryName: string;
  brand: string;
  model: string;
  price: number; // in Tomans
  discountPrice?: number;
  image: string;
  rating: number;
  reviewsCount: number;
  inStock: boolean;
  warranty: string;
  specs: Record<string, string>;
  description: string;
  badge?: string;
  isB2BRecommended?: boolean;
}

export interface BundlePack {
  id: string;
  title: string;
  subtitle: string;
  targetAudience: 'سازندگان و پروژه‌ها (B2B)' | 'نوسازی و جهیزیه (B2C)' | 'پکیج اقتصادی ویلایی';
  productsIncluded: string[];
  originalPrice: number;
  bundlePrice: number;
  discountPercent: number;
  image: string;
  features: string[];
  popularTag?: string;
}

export interface CalculatorState {
  area: number;
  floor: 'middle' | 'top' | 'ground';
  climate: 'hot_dry' | 'moderate' | 'humid' | 'cold';
  sunExposure: 'high' | 'normal';
  kitchenStyle: 'open' | 'closed';
}

export interface CalculationResult {
  packageCapacity: string;
  packageDescription: string;
  radiatorBladeCount: number;
  radiatorPanelMeters: number;
  coolingBtu: string;
  coolingRecommendation: string;
  hoodFlowRate: string;
  estimatedTotalBudgetMin: number;
  estimatedTotalBudgetMax: number;
  matchingBundleId: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  isB2BQuote?: boolean;
}

export interface StrategyModule {
  id: number;
  title: string;
  englishTitle: string;
  iconName: string;
  summary: string;
  keyPoints: string[];
  iranMarketInsight: string;
  concreteExample: string;
}
