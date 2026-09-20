import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HeroBanner } from './components/HeroBanner';
import { HVACCalculator } from './components/HVACCalculator';
import { BundleSection } from './components/BundleSection';
import { ProductGrid } from './components/ProductGrid';
import { ProductModal } from './components/ProductModal';
import { B2BSection } from './components/B2BSection';
import { StrategyModal } from './components/StrategyModal';
import { AIConsultantChat } from './components/AIConsultantChat';
import { QuoteDrawer } from './components/QuoteDrawer';
import { AndroidAppFrame } from './components/AndroidAppFrame';
import { Footer } from './components/Footer';
import { PRODUCTS, BUNDLE_PACKS } from './data/mockData';
import { Product, BundlePack, CartItem } from './types';
import { Sparkles, ShoppingCart, Check, PhoneCall } from 'lucide-react';

export default function App() {
  const [viewMode, setViewMode] = useState<'web' | 'android'>('web');
  const [activeSection, setActiveSection] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals & Drawers
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isStrategyOpen, setIsStrategyOpen] = useState<boolean>(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);
  const [chatInitialTopic, setChatInitialTopic] = useState<string>('');
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Cart & Quote state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    { product: PRODUCTS[0], quantity: 1 },
    { product: PRODUCTS[2], quantity: 40 }, // 40 blades of Kal 500 radiator
  ]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAddToCart = (product: Product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
    showToast(`«${product.title}» به پیش‌فاکتور افزوده شد`);
  };

  const handleAddBundleToCart = (bundle: BundlePack) => {
    // Create a virtual bundle item or add matching core items
    const bundleProduct: Product = {
      id: bundle.id,
      title: bundle.title,
      category: 'heating',
      categoryName: 'پک تخفیف‌دار',
      brand: 'TSH Bundle',
      model: bundle.id,
      price: bundle.originalPrice,
      discountPrice: bundle.bundlePrice,
      image: bundle.image,
      rating: 5.0,
      reviewsCount: 1,
      inStock: true,
      warranty: 'گارانتی جامع طلایی کلیه قطعات پک',
      description: bundle.subtitle,
      specs: { 'اقلام پکیج': bundle.productsIncluded.join(' • ') }
    };
    handleAddToCart(bundleProduct, 1);
  };

  const handleAddMultipleToCart = (productsList: Product[]) => {
    productsList.forEach(p => handleAddToCart(p, 1));
    showToast(`${productsList.length} قلم کالای پیشنهادی مهندسی به پیش‌فاکتور اضافه گردید.`);
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (productId: string, qty: number) => {
    if (qty <= 0) {
      handleRemoveItem(productId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleOpenChatWithTopic = (topic: string) => {
    setChatInitialTopic(topic);
    setIsChatOpen(true);
  };

  // If user selected Android App Mode
  if (viewMode === 'android') {
    return (
      <div className="bg-slate-950 min-h-screen">
        <AndroidAppFrame
          onBackToWeb={() => setViewMode('web')}
          products={PRODUCTS}
          bundles={BUNDLE_PACKS}
          cartItems={cartItems}
          onAddToCart={handleAddToCart}
          onOpenProductModal={(p) => setSelectedProduct(p)}
          onOpenChat={() => setIsChatOpen(true)}
          onOpenQuote={() => setIsCartOpen(true)}
          onOpenStrategy={() => setIsStrategyOpen(true)}
        />

        {/* Global Modals in Mobile View */}
        <ProductModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={handleAddToCart}
          onAskAI={(topic) => {
            setSelectedProduct(null);
            handleOpenChatWithTopic(topic);
          }}
        />

        <AIConsultantChat
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          initialTopic={chatInitialTopic}
        />

        <QuoteDrawer
          isOpen={isCartOpen}
          onClose={() => setIsCartOpen(false)}
          cartItems={cartItems}
          onUpdateQuantity={handleUpdateQuantity}
          onRemoveItem={handleRemoveItem}
          onClearCart={handleClearCart}
        />

        <StrategyModal
          isOpen={isStrategyOpen}
          onClose={() => setIsStrategyOpen(false)}
          onSelectTopicForDetails={() => {}}
        />
      </div>
    );
  }

  // Desktop / Standard Web Portal View
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-blue-600 selection:text-white">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 left-6 z-50 bg-slate-900 text-white text-xs sm:text-sm font-bold py-3 px-4 rounded-2xl shadow-2xl flex items-center gap-2 border border-slate-700 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Primary Navigation */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cartItems={cartItems}
        setIsCartOpen={setIsCartOpen}
        setIsStrategyOpen={setIsStrategyOpen}
        setIsChatOpen={setIsChatOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* Hero Section */}
        {activeSection === 'home' && (
          <HeroBanner
            onOpenCalculator={() => {
              const el = document.getElementById('hvac-calculator-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenBundles={() => {
              const el = document.getElementById('bundles-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            onOpenChat={() => setIsChatOpen(true)}
            onOpenCatalog={() => {
              const el = document.getElementById('catalog-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
          />
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-12">
          
          {/* Smart HVAC & Kitchen Sizing Calculator */}
          {(activeSection === 'home' || activeSection === 'calculator') && (
            <HVACCalculator
              onAddRecommendedToCart={handleAddMultipleToCart}
              allProducts={PRODUCTS}
              onOpenChatWithTopic={handleOpenChatWithTopic}
            />
          )}

          {/* Strategic Bundles Showcase */}
          {(activeSection === 'home' || activeSection === 'bundles') && (
            <BundleSection
              onAddBundleToCart={handleAddBundleToCart}
              onOpenB2BTab={() => setActiveSection('b2b')}
            />
          )}

          {/* Comprehensive Product Catalog */}
          {(activeSection === 'home' || activeSection === 'catalog') && (
            <ProductGrid
              products={PRODUCTS}
              onAddToCart={handleAddToCart}
              onSelectProduct={(p) => setSelectedProduct(p)}
              searchQuery={searchQuery}
            />
          )}

          {/* B2B Builder & Project Hub */}
          {(activeSection === 'home' || activeSection === 'b2b') && (
            <B2BSection />
          )}

        </div>
      </main>

      {/* Footer */}
      <Footer
        onOpenCalculator={() => {
          setActiveSection('calculator');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenBundles={() => {
          setActiveSection('bundles');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenStrategy={() => setIsStrategyOpen(true)}
        onOpenChat={() => setIsChatOpen(true)}
      />

      {/* Floating Action Buttons: AI Chat & Quote */}
      <div className="fixed bottom-6 right-6 z-30 flex flex-col gap-3">
        <button
          onClick={() => setIsChatOpen(true)}
          className="flex items-center gap-2 p-3.5 sm:px-4 sm:py-3 rounded-2xl bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white font-bold text-xs sm:text-sm shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
          title="مشاوره با هوش مصنوعی TSH"
        >
          <Sparkles className="w-5 h-5 text-amber-300" />
          <span className="hidden sm:inline">مشاور مهندسی TSH</span>
        </button>

        <button
          onClick={() => setIsCartOpen(true)}
          className="relative flex items-center justify-center p-3.5 rounded-2xl bg-[#12284C] hover:bg-slate-900 text-white shadow-xl hover:shadow-2xl transition-all"
          title="مشاهده پیش‌فاکتور"
        >
          <ShoppingCart className="w-5 h-5 text-amber-400" />
          {cartItems.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-slate-950 font-black text-xs w-5 h-5 rounded-full flex items-center justify-center shadow-md">
              {cartItems.reduce((a, b) => a + b.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Modals and Drawers */}
      <ProductModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleAddToCart}
        onAskAI={(topic) => {
          setSelectedProduct(null);
          handleOpenChatWithTopic(topic);
        }}
      />

      <StrategyModal
        isOpen={isStrategyOpen}
        onClose={() => setIsStrategyOpen(false)}
        onSelectTopicForDetails={() => {}}
      />

      <AIConsultantChat
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialTopic={chatInitialTopic}
      />

      <QuoteDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
      />

    </div>
  );
}
